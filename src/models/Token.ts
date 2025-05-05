import mongoose, {Schema, Document, mongo, Types, Date} from "mongoose"

export interface IToken extends Document {
    token: string
    user: Types.ObjectId
    createAt: Date
}

const tokenSchemma : Schema =  new Schema({
    token: {
        type: String,
        require: true
    },
    user: {
        type: Types.ObjectId,
        require: "User"
    },
    expiresAt: {
        type: Date,
        default: Date.now(),
        expires: "10m"
    }
})

const token = mongoose.model<IToken>("Token", tokenSchemma);
export default token