import { mergeResolvers } from "@graphql-tools/merge";
import userResolver from "./user.resolver.js";
import transactionReslover from "./transaction.resolver.js";

const mergeResolver = mergeResolvers([userResolver,transactionReslover]);

export default mergeResolver;