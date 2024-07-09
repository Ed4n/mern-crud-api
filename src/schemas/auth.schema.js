import { z } from "zod"


const registerSchema = z.object({
    username: z.string({
        required_error: 'Username is required'
    }),

    email: z.string({
        required_error: "Email is required"
    }).email({
        required_error: 'Invalid Email.'
    }),

    password: z.string({
        required_error: "Password is required."
    }).min(6, {
        required_error: "Password must have 6 characters or more."
    })
})

const loginSchema = z.object({
    email: z.string({
        required_error: "Email is required"
    }).email({
        required_error: 'Invalid Email.'
    }),

    password: z.string({
        required_error: "Password is required."
    }).min(6, {
        required_error: "Password must be at least 6 characters."
    })
})

export { registerSchema, loginSchema }