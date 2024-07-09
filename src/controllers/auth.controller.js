import { createAccesToken } from "../libs/jwt.js"
import { User } from "../models/user.model.js"
import bcrypt from "bcryptjs"




export const register = async (req, res) => {
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

export const login = async (req, res) => {
    const { email, password } = req.body

    try {
        const userFound = await User.findOne({ email })

        if (!userFound) return res.status(400).json(
            {
                success: false, message: "User not found"

            }
        )

        const isMatch = await bcrypt.compare(password, userFound.password)

        if (!isMatch) return res.status(400).json({
            success: false, message: "Incorrect Passowrd"
        })

        const token = await createAccesToken({ id: userFound._id })
        res.cookie('token', token)

        return res.status(200).json({
            success: true,
            message: "Login succesfully",
            data: {
                username: userFound.username,
                email: userFound.email,
                createdAt: userFound.createdAt,
                updatedAt: userFound.updatedAt
            }
        })


    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Internal Servier error",
            details: err
        })
    }


}

export const logout = (req, res) => {
    res.cookie("token", " ", { expires: new Date(0) })

    return res.status(200).json({
        success: true,
        message: "Logout Succefully"
    })
}

export const profile = async (req, res) => {
    const { id } = req.user

    const logedUser = await User.findById(id)

    if (!logedUser) return res.status(400).json({
        success: false,
        message: "User not found"
    })

    return res.status(200).json({
        success: true,
        message: "Welcome to your profile",
        data: {
            id: logedUser.id,
            username: logedUser.username,
            email: logedUser.email
        }
    })
}