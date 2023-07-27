import type {
  SignedInAuthObject,
  SignedOutAuthObject,
} from "@clerk/nextjs/server";

export type AuthContext = {
  auth: SignedInAuthObject | SignedOutAuthObject;
};
