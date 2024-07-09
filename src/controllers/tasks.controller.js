import Task from "../models/task.model.js"


export const getTasks = async (req, res) => {
    const { id } = req.user

    try {
        const tasks = await Task.find({ user: id }).populate('user', 'username email')
        return res.status(200).json({
            success: true,
            data: tasks
        })
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error :(",
            details: err
        })
    }
}

export const getTask = async (req, res) => {

    const { id } = req.params

    if (!id) return res.status(404).json({ message: "An ID is required!" })

    try {
        const task = await Task.findById(id)
        if (!task) return res.status(404).json({ message: "Task not found" })

        return res.status(200).json({
            success: true,
            data: task
        })
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error :(",
            details: err
        })
    }

}

export const createTask = async (req, res) => {
    const { title, description, date } = req.body
    const { id } = req.user

    try {

        const newTask = new Task({
            title,
            description,
            date,
            user: id
        })

        const savedTask = await newTask.save()

        // Populate the user field after saving the task    
        const populatedTask = await savedTask.populate('user', 'username email')

        return res.status(200).json({
            success: true,
            message: "Task created successfully",
            data: {
                id: populatedTask._id,
                title: populatedTask.title,
                description: populatedTask.description,
                date: populatedTask.date || null,
                user: populatedTask.user // This will include the populated user data
            }
        });

    } catch (err) {
        console.log(err)
        return res.status(500).json({
            success: false,
            message: "Internal Server Error :(",
            details: err
        })
    }
}

export const updateTask = async (req, res) => {
    const { id } = req.params
    const body = req.body

    if (!id) res.status(404).json({ message: "an ID is rquired" })

    try {
        const updatedTask = await Task.findByIdAndUpdate(id, body, { new: true })
        if (!updatedTask) res.status(404).json({ message: "Task Not Found" })

        return res.status(200).json({
            succes: true,
            message: "Task Updated Succesfully",
            data: updateTask

        })

    } catch (err) {
        console.error(err)
        return res.status(500).json({
            succes: false,
            message: "Internal Server Error",
            details: err
        })
    }
}
export const deleteTask = async (req, res) => {
    const { id } = req.params

    if (!id) res.status(404).json({ message: "an ID is rquired" })

    try {
        const deletedTask = await Task.findByIdAndDelete(id)
        if (!deleteTask) res.status(404).json({ message: "Task Not Found" })

        return res.status(200).json({ message: `The Task with the title: "${deletedTask.title}" was deleted succesfully` })

    } catch (err) {
        return res.status(500).json({
            succes: false,
            message: "Internal Server Error",
            details: err
        })
    }
}
