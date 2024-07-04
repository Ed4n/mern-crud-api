import mongoose from "mongoose";

const { Schema, model } = mongoose;

const userSchema = new Schema({
    username: {
        type: String,
        require: true,
        trim: true
    },

    email: {
        type: String,
        require: true,
        trim: true,
        unique: true
    },

    password: {
        type: String,
        require: true

    },

}, {
    timestamps: true
})

export const User = model('User', userSchema)