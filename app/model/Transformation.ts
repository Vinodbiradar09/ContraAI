import mongoose , {Schema , model , models , Document, Model} from "mongoose";

export interface ContentInt extends Document {
    _id : mongoose.Types.ObjectId,
    userId : mongoose.Types.ObjectId,
    mode : "humanize" | "refine" | "concise",
    originalContent : string,
    transformedContent : string,
    originalWordCount: number;
    transformedWordCount: number;
}

const transformationSchema = new Schema<ContentInt>(
    {
        userId : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "User",
            // required : [true , "userId for transformationSchema is required"],
            index : true,
        },
        mode : {
            type : String,
            enum : ["humanize" , "refine" , "concise"],
            required : [true , "For content transformation mode is required"],
            index : true,
        },
        originalContent : {
            type : String,
            required : [true , "Original content is required"],
            maxLength : [5000 , "Original content cannot exceed more than 5000"]
        },
        transformedContent : {
            type : String,
            required : [true , "Transformed content is required"],
            maxLength : [5000 , "Transformed content cannot exceed more than 5000"]
        },
        originalWordCount : {
            type : Number,
            min : 0,
        },
        transformedWordCount : {
            type : Number,
            min : 0,
        }

    },
    {
        timestamps : true,
    }
)

const Transformed : Model<ContentInt> = models?.Transformed as mongoose.Model<ContentInt> || model<ContentInt>("Transformed" , transformationSchema);

export default Transformed;