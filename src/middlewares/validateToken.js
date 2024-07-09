import jwt from "jsonwebtoken"

export const authRequired = (req, res, next) => {
    const { token } = req.cookies;

    if (!token)
        return res.status(401).json(
            {
                success: false,
                message: "Token not found, Authorization Denied!"
            })

    jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
        if (err) return res.status(403).json({
            success: false,
            message: "Invalid Token"
        })

        req.user = user
        next()
    })
}