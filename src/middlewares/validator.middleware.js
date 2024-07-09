
export const validateSchema = (schema) => (req, res, next) => {
    try {
        schema.parse(req.body)
        next()
    } catch (err) {
        return res.status(500).json({
            error: err.errors.map(err => err.message)
        })
    }
}