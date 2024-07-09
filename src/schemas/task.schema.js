import { z } from "zod"

export const taskSchema = z.object({
    title: z.string({
        required_error: "Tittle is required."
    }),
    description: z.string({
        required_error: "The description must be a string."
    }).optional(),

    date: z.string().datetime().optional()
})