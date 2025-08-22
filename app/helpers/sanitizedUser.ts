import { UserInt , UserPublic } from "../model/Users";

export function sanitizeUser( user : UserInt) : UserPublic {
    return {
        _id : user._id,
        username : user.username,
        email : user.email,
        isVerified : user.isVerified
    }
}