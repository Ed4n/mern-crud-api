# ZOD

[⬆︎ Back To Readme](../README.md)

```bash
npm i zod
```

## Usage

create a schema file, example:

`
schemas/auth.schema.js
`

```js
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
```

create a middle ware that recives this schema and compare to wathever you want.

```js

//The "validateSchema" recieves an schema in this case the "registerSchema".
export const validateSchema = (schema ) => (req, res, next) => {
    try {
        schema.parse(req.body) // the prase can be used in the schema in this case "registerSchema"
        next()
    } catch (err) {
        return res.status(500).json({
            error: err.errors.map(err => err.message)
        })

        // It return an object error for each validation, but here I'm mapping just the message to show to the user.
    }
}
```

Use it on your routes as a middleware.

```js
import Router from "express"
import { login, register } from "../controllers/auth.controller.js"
import { validateSchema } from "../middlewares/validator.middleware.js"
import { loginSchema, registerSchema } from "../schemas/auth.schema.js"

const router = Router()

router.post("/register", validateSchema(registerSchema), register)
router.post("/login", validateSchema(loginSchema), login)

export default router
```
