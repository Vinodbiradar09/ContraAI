import mongoose , {Schema , model , models , Document, Model} from "mongoose";
import bcrypt from "bcrypt";

export interface UserInt extends Document{
    _id : mongoose.Types.ObjectId,
    username : string,
    email : string,
    password : string,
    verifyCode : string,
    verifyCodeExpiry : Date,
    isVerified : boolean
}

const userSchema = new Schema<UserInt>(
    {
        username : {
            type : String,
            unique : [true , "Username  must be unique"],
            lowercase : true ,
            trim : true,
            required : [true , "Username is required"],
        },
        email : {
            type : String,
            unique : [true , "Email must be unique"],
            required : [true , "Email is required"],
            match : [ /^[^\s@]+@[^\s@]+\.[^\s@]+$/, "please use the valid email address"],
        },
        password : {
            type : String,
            required : [true , "Password is required"],
        },
        verifyCode : {
            type : String,
            required : [true , "Verify code is required"],
        },
        verifyCodeExpiry : {
            type : Date,
            required : [true , "Verify code expiry is required"],
        },
        isVerified : {
            type : Boolean,
            default : false 
        }

    },
    {
        timestamps : true,
    }
)


userSchema.pre("save" , async function (next) {
    if(this.isModified('password')) {
        this.password = await bcrypt.hash(this.password , 10);
    }
    next();
})

const User : Model<UserInt> = models?.User as mongoose.Model<UserInt> || model<UserInt>("User" , userSchema);

export default User;