
export interface Resp {
    token: string, 
    stage: number
}
export interface User {
  bearer: string;
  profiles:string[];
  alerts: boolean;
  reports: boolean;
  newsletters: boolean;
  _id: string;
  userId: string;
  name: string;
  email: string;
  photo: string;
  plan: string;
  stage: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface BrandProfile {
_id: string;
users: string[];
competitors: string[];
brand: string;
plan:string;
quota: number;
createdAt:string;
updatedAt:string;
__v:number;
}

