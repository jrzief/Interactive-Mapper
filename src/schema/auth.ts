import { AuthChecker } from "type-graphql";
import { context } from "./context";

export const authChecker: AuthChecker<Context> = ({context}) => {
  const {uid} = context;
  return !!uid;
};
