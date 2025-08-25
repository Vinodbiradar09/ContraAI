import  { UserInt } from "../model/Users"
import { ContentInt } from "../model/Transformation"

export interface ApiRes {
    success : boolean,
    message : string,
    user? : UserInt,
    content? : string,
    wordCount? : number,
}

