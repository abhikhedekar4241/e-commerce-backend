export interface IAbout {
  about: string;
  details: string;
  images: string[];
}

export interface IArea {
  area: string;
  city: string;
  status: string;
}

export interface ICreditPlan {
  price: string;
  credit: string;
}

export interface IDeliverySettings {
  freeDeliveryAbove: string;
  deliveryCost: string;
  deliveryNote: string;
  minimumOrderCost: string;
  gstNo: string;
  companyName: string;
  codPayment: string;
  onlinePayment: string;
  storeLocation: string;
  timeSlot: ITimeSlot;
}

export interface ITimeSlot {
  startTime: string;
  endTime: string;
}

export interface IGroup {
  name: string;
}

export interface IWeight {
  name: string;
}

export interface IRefferalPlan {
  creditsFor: string;
  credit: string;
}

export interface ISupport {
  contact1: string;
  contact2: string;
  address: string;
}

export interface ITax {
  percent: string;
}

export interface ICoupon {
  name: string;
  code: string;
  value: string;
  limitPerUser: string;
  condition: string;
  minimumAmount: string;
  validFrom: string;
  validTill: string;
  description: string;
  applyCustomer: string;
  status: string;
}
export interface IBannerImages {
  mobile: string[];
  website: string[];
}

export interface IAppSettings {
  area: IArea[];
  deliverySettings: IDeliverySettings;
  groups: IGroup[];
  weights: IWeight[];
  taxes: ITax[];
  support: ISupport;
  about: IAbout[];
  terms: string;
  creditPlans: ICreditPlan[];
  referralPlans: IRefferalPlan[];
}
