import { Model, model, Schema, Document } from "mongoose";
import bcrypt from "bcryptjs";
import * as crypto from "crypto";

export interface IUser extends Document {
  id: string;
  name: string;
  email: string;
  photo: string;
  role: string;
  password?: string;
  passwordConfirm?: string;
  passwordChangedAt?: Date;
  passwordResetAt?: string;
  passwordResetExpires?: Date;
  passwordResetToken?: string;
  active: boolean;

  correctPassword(
    candidatePassword: string,
    userPassword: string
  ): Promise<boolean>;
  passwordChangedAfter(JWTTimestamp: any): boolean;
  createPasswordResetToken: string;
}

const schema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required."],
    },
    email: {
      type: String,
      required: [true, "Email is required."],
    },
    photo: {
      type: String,
      default: "default.jpg",
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    password: {
      type: String,
      required: [true, "Password is required."],
      minlength: 6,
      select: false,
    },
    passwordConfirm: {
      type: String,
      required: [true, "Password confirm is required."],
      validate: function (confirm: string): boolean {
        // @ts-ignore
        return confirm == this.password;
      },
      message: "Passwords are not same.",
    },
    passwordChangedAt: Date,
    passwordResetAt: String,
    passwordResetExpires: Date,
    passwordResetToken: String,
    active: {
      type: Boolean,
      default: true,
      select: false,
    },
  },
  { versionKey: false }
);

schema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  // @ts-ignore
  this.password = await bcrypt.hash(this.password, 12);

  // @ts-ignore
  this.passwordConfirm = undefined;

  next();
});

schema.pre("save", function (next) {
  if (!this.isModified("password") || this.isNew) return next();

  // @ts-ignore
  this.passwordChangedAt = Date.now() - 1000;
  next();
});

schema.pre(/^find/, function (next) {
  // this.find({ active:{ $ne: false }})
  next();
});

schema.methods.correctPassword = async (
  candidatePassword: string,
  userPassword: string
) => {
  return await bcrypt.compare(candidatePassword, userPassword);
};

schema.methods.passwordChangedAfter = (JWTTimestamp: any): boolean => {
  // @ts-ignore
  if (this.passwordChangedAt) {
    const changedTimestamp: any = parseInt(
      // @ts-ignore
      (((this.passwordChangedAt.getTime() as number) /
        1000) as unknown) as string,
      10
    );

    return JWTTimestamp < changedTimestamp;
  }

  return false;
};

schema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  schema.set(
    "passwordResetToken",
    crypto.createHash("sha256").update(resetToken).digest("hex")
  );

  schema.set("passwordResetExpires", Date.now() + 10 * 60 * 1000);

  console.log(resetToken);
  return resetToken;
};

const User: Model<IUser> = model("User", schema);

export default User;
