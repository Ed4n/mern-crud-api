import Router from "express"
import { login, logout, profile, register, verifyToken } from "../controllers/auth.controller.js"
import { authRequired } from "../middlewares/validatetoken.js"
import { validateSchema } from "../middlewares/validator.middleware.js"
import { loginSchema, registerSchema } from "../schemas/auth.schema.js"


const router = Router()

router.post("/register", validateSchema(registerSchema), register)
router.post("/login", validateSchema(loginSchema), login)
router.post("/logout", logout)
router.get("/profile", authRequired, profile)
router.get("/verify-token", verifyToken)

export default router