import express, { json } from "express"
import morgan from "morgan"
import authRoutes from "./src/routes/auth.route.js"
import "dotenv/config";
import "./src/db.js";

const app = express()
app.use(express.json())

app.use("/api/v1", authRoutes)


//Morgan is use to see more information in the console about the requests.
app.use(morgan("dev"))
export { app }
