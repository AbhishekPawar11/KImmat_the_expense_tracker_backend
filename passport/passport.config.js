import passport from "passport";
import bcrypt from 'bcryptjs';

import User from "../Models/user.model.js";
import { GraphQLLocalStrategy } from "graphql-passport";

export const configurePassport = async ()=>{
    passport.serializeUser((user, done)=>{
        console.log("serializing user");
        done(null,user.id)
    });
   
    passport.deserializeUser(async(id,done)=>{
        console.log("Deserialisizing user");
        try {
            const user = await User.findById(id);
            done(null,user);
        } catch (error) {
            done(error);
        }
    })

    passport.use(
        new GraphQLLocalStrategy( async (username,password,done)=>{
            try {
                const user = await User.findOne({username});
                if(!user){
                    throw new Error("invalid username or password");
                }
                const validPassowrd = await bcrypt.compare(password, user.password);
                if(!validPassowrd){
                    throw new Error("Invalid username or password")
                }

                return done(null, user);
            } catch (error) {
                return done(error);
            }
        })
    )
}