import jwt from "jsonwebtoken";
import { IUser } from "@entities/user";
import { CookieOptions, NextFunction, Response } from "express";
import catchAsync from "../utils/catch-async";
import { IRequest } from "@shared/constants";
import User from "@entities/user";
import { StatusCodes } from "http-status-codes";
import AppError from "../utils/app-error";
import sendResponse from "../utils/send-response";
import { promisify } from "util";
import crypto from "crypto";
import EmailService from "../utils/email-service";

/**
 * Sign token using json web token.
 * @param id User's document id.
 */
const signToken = (id: string) => {
  return jwt.sign({ id }, process.env["JWT_SECRET"] as string, {
    expiresIn: process.env["JWT_EXPIRES_IN"],
  });
};

/**
 * Sign token and send the response.
 * @param user User data
 * @param statusCode Status code to send the response
 * @param message Message to send in the response
 * @param res Response object
 */
const createSendToken = (
  user: IUser,
  statusCode: number,
  message: string,
  res: Response
) => {
  const token = signToken(user.id);
  const cookieOptions: CookieOptions = {
    expires: new Date(
      Date.now() +
        ((process.env["JWT_COOKIE_EXPIRES_IN"] as unknown) as number) *
          24 *
          60 *
          60 *
          1000
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === "production") cookieOptions.secure = true;

  user.password = undefined;

  res.status(statusCode).json({
    message,
    token,
    user,
  });
};

/**
 * Controller to sign up/ register new user. User will be created from data in request body.
 */
const signUp = catchAsync(
  async (req: IRequest, res: Response, next: NextFunction) => {
    const adminEmail = "abhikhedekar55@gmail.com";
    const role =
      req.body.email == adminEmail ? "admin" : req.body.role || "user";
    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
      role,
    });

    if (!newUser)
      return next(
        new AppError(StatusCodes.EXPECTATION_FAILED, "User not created.")
      );

    createSendToken(
      newUser,
      StatusCodes.CREATED,
      "User created successfully.",
      res
    );
  }
);

/**
 * Controller to login user. Credentials should be in request body.
 */
const login = catchAsync(
  async (req: IRequest, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    if (!email || !password)
      return next(
        new AppError(
          StatusCodes.BAD_REQUEST,
          "Please provide email and password."
        )
      );

    const user = await User.findOne({ email }).select("+password");

    if (
      !user ||
      !(await user.correctPassword(password, user.password as string))
    )
      return next(
        new AppError(StatusCodes.UNAUTHORIZED, "Invalid email or password.")
      );

    createSendToken(user, StatusCodes.ACCEPTED, "Successfully logged in.", res);
  }
);

/**
 * Controller to logout user.
 */
const logout = catchAsync((req: IRequest, res: Response) => {
  res.cookie("jwt", "loggedout", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  sendResponse(null, StatusCodes.OK, "Successfully logged out.", res);
});

/**
 * Middleware to protect the access to authorised users only.
 */
const protect = catchAsync(
  async (req: IRequest, res: Response, next: NextFunction) => {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies.jwt) token = req.cookies.jwt;

    if (!token)
      return next(
        new AppError(StatusCodes.UNAUTHORIZED, "You are not logged in!")
      );

    const t = promisify(jwt.verify);

    // @ts-ignore
    const decoded = await t(token, process.env.JWT_SECRET);

    // @ts-ignore
    const currentUser = await User.findById(decoded.id);

    if (!currentUser)
      return next(
        new AppError(
          StatusCodes.UNAUTHORIZED,
          "The user belonging to this token does no longer exist."
        )
      );

    // @ts-ignore
    if (currentUser.passwordChangedAfter(decoded.iat))
      return next(
        new AppError(
          StatusCodes.UNAUTHORIZED,
          "User recently changed password! Please log in again."
        )
      );

    req.user = currentUser;
    res.locals.user = currentUser;
    next();
  }
);

/**
 * Middleware to check if user's auth token is valid or not.
 */
const isLoggedIn = async (req: IRequest, res: Response, next: NextFunction) => {
  if (req.cookies["jwt"]) {
    try {
      const decoded = await promisify(jwt.verify)(
        req.cookies.jwt,
        // @ts-ignore
        process.env.JWT_SECRET
      );

      // @ts-ignore
      const currentUser = await User.findById(decoded.id);

      if (!currentUser) return next();

      // @ts-ignore
      if (currentUser.passwordChangedAfter(decoded.iat)) return next();

      res.locals.user = currentUser;
      return next();
    } catch (err) {
      return next(err);
    }
  }
  next();
};

/**
 * Restrict user to go ahead.
 * @param roles Allwed roles to go ahead
 */
const restrictTo = (...roles: string[]) => {
  return (req: IRequest, res: Response, next: NextFunction) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError(
          StatusCodes.UNAUTHORIZED,
          "You do not have permission to perform this action."
        )
      );
    }
    next();
  };
};

/**
 * Controller to send password reset token to user.
 */
const forgotPassword = catchAsync(
  async (req: IRequest, res: Response, next: NextFunction) => {
    const user = await User.findOne({ email: req.body.email });
    if (!user)
      return next(
        new AppError(
          StatusCodes.NOT_FOUND,
          "There is no user with email address."
        )
      );

    const resetToken = user.createPasswordResetToken;

    await user.save({ validateBeforeSave: true });

    try {
      const resetUrl = `${req.protocol}://${req.get(
        "host"
      )}/api/v1/users/resetPassword/${resetToken}`;

      new EmailService(user, resetUrl).sendPasswordReset();

      res.status(StatusCodes.OK).json({
        message: "Token sent to your email.",
      });
    } catch (err) {
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save({ validateBeforeSave: false });

      return next(
        new AppError(
          StatusCodes.BAD_REQUEST,
          "There was an error sending the email. Try again later!"
        )
      );
    }
  }
);

/**
 * Controller to reset user password.
 */
const resetPassword = catchAsync(
  async (req: IRequest, res: Response, next: NextFunction) => {
    const hashedToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");
    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: (Date.now() as unknown) as Date },
    });

    if (!user)
      return next(
        new AppError(
          StatusCodes.BAD_REQUEST,
          "Token is invalid or has expired."
        )
      );

    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await user.save();

    createSendToken(user, StatusCodes.OK, "Password reset successful.", res);
  }
);

/**
 * Controller to update user's password.
 */
const updatePassword = catchAsync(
  async (req: IRequest, res: Response, next: NextFunction) => {
    const user = (await User.findById(req.user.id).select(
      "+password"
    )) as IUser;

    if (
      !(await user?.correctPassword(
        req.body.currentPassword,
        user.password as string
      ))
    )
      return next(
        new AppError(
          StatusCodes.UNAUTHORIZED,
          "Your current password is wrong."
        )
      );

    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;

    await user?.save();

    createSendToken(
      user,
      StatusCodes.ACCEPTED,
      "Updated password successful.",
      res
    );
  }
);

export default {
  signUp,
  login,
  logout,
  protect,
  isLoggedIn,
  forgotPassword,
  restrictTo,
  resetPassword,
  updatePassword,
};
