import mongoose, { Schema, Document, Types, Date } from "mongoose"

export interface IToken extends Document {
    token: string
    user: Types.ObjectId
    createAt: Date
}

const tokenSchemma: Schema = new Schema({
    token: {
        type: String,
        required: true,
        trim: true
    },
    user: {
        type: Types.ObjectId,
        ref: "User",
        required: true
    },
    expiresAt: {
        type: Date,
        default: Date.now,
        expires: "10d"
    }
}, { timestamps: true })

const token = mongoose.model<IToken>("Token", tokenSchemma);
export default token