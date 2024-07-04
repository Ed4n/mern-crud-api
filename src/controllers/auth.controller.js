import { createAccesToken } from "../libs/jwt.js"
import { User } from "../models/user.model.js"
import bcrypt from "bcryptjs"




export const login = async (req, res) => {
    const { email, username, password } = req.body

    try {
        const passwordHash = await bcrypt.hash(password, 10)

        const newUer = new User({
            username,
            email,
            password: passwordHash

        })

        const savedUser = await newUer.save()

        const token = await createAccesToken({ id: savedUser._id })
        res.cookie('token', token)

        return res.status(200).json({
            success: true,
            data: {
                username: savedUser.username,
                email: savedUser.email,
                createdAt: savedUser.createdAt,
                updatedAt: savedUser.updatedAt
            }
        })
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            details: err
        })
    }

}