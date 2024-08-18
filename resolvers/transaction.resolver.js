import { transactions } from "../dummyData/data.js"

const transactionReslover = {
    Query:{
         transactions: ()=>{
            return transactions
         }
    },
    Mutation:{}
}

export default transactionReslover;