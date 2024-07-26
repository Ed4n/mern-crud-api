import express, { json } from "express"
import morgan from "morgan"
import "dotenv/config";
import "./src/db.js";
import cookieParser from "cookie-parser"
import cors from "cors"

import authRoutes from "./src/routes/auth.routes.js"
import tasksRoutes from "./src/routes/tasks.routes.js";



const app = express()
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}))
app.use(express.json())
app.use(cookieParser()) // This is used to read the cookies, workds similar like express,json() but this one is not build in
//To install cookie parser just add via || npm i cookie-parser||





app.use("/api/v1", authRoutes)
app.use("/api/v1", tasksRoutes)


//Morgan is use to see more information in the console about the requests.
app.use(morgan("dev"))
export { app }
