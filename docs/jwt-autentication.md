# JWT Authentication Process

⬆︎ [Back to RedMe](../README.md)

first we need to impot jwt & bcrypt libraries

```
npm i jsonwebtoken
```

```
npm i bcrypt
```

Then in our auth.controller we create a register endpoint and login, and it will look like this:

## Register

```js
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
```

We hash the password uisng bcrypt method:

```js
 const passwordHash = await bcrypt.hash(password, 10)
 //this returns a hashed passwor like this one: $2a$10$TdxZpgEXQyo52LcG2Gqj1eaBBYQpndwpV7tLwWHi43RnBphQWySiS
 ```

 this one is an async operation so dont forget the **await**.

Then we create the user with the hashed password and save it:

```js
const newUer = new User({
            username,
            email,
            password: passwordHash

        })

        const savedUser = await newUer.save()
```

### Token creation uisng JWT

To create the token we create a funcion outside to used freely in other places

`libs/jwt.js`

And the code will be like this:

```js

import jwt from "jsonwebtoken"

export const createAccesToken = (payload) => {

    return new Promise((resolve, reject) => {
        jwt.sign(
            payload,
            process.env.SECRET_KEY,
            {
                expiresIn: '1d'
            },
            (err, token) => {
                if (err) reject(err)
                resolve(token)
            }

        )
    })

}
```

1. the`payload` recieves and object with an id:

```js
{ id: savedUser._id }
```

2. As a second parameter we add a secret key, that in this case is stored in an .env file:
`SECRET_KEY='this-is-the-secret-key'`

3. We add an expiration date

4. A call back that returns an **error** or the **token**.

```js
  (err, token) => {
                if (err) reject(err)
                resolve(token)
            }
```

All this is wraped in a Promise because is an asynchoruns process.

After all of that we proceed to save the token in a cookie and return a success response if all was correct:

```js

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

```

## Login

The login is a similar process becuse we use the same jwt function.

```js
export const login = async (req, res) => {
    const { email, password } = req.body

    try {
        const userFound = await User.findOne({ email })

        if (!userFound) return res.status(400).json(
            {
                success: false, message: "User not found"

            }
        )

        const isMatch = await bcrypt.compare(password, userFound.password) // este retorna un boolean

        if (!isMatch) return res.status(400).json({
            success: false, message: "Incorrect Passowrd"
        })

        const token = await createAccesToken({ id: userFound._id }) // se crea un token con el id del usuario (este es una serie de carateres muy diferente al id.)
        res.cookie('token', token)

        return res.status(200).json({
            success: true,
            message: "Login succesfully",
            data: {
                token: token,
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
```

The only difference is that we compare the password with the one in the db and we do a validation that returns a message:

```js
const isMatch = await bcrypt.compare(password, userFound.password) // este retorna un boolean

        if (!isMatch) return res.status(400).json({
            success: false, message: "Incorrect Passowrd"
        })

```
