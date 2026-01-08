"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const axios_1 = __importDefault(require("axios"));
const node_cron_1 = __importDefault(require("node-cron"));
const user_1 = __importDefault(require("./database/models/user"));
const category_1 = __importDefault(require("./database/models/category"));
const task_1 = __importDefault(require("./database/models/task"));
const env_1 = __importDefault(require("./config/env"));
const database_1 = __importDefault(require("./config/database")); // Initialize database connection
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Discord Webhook URLs from environment
const DISCORD_WEBHOOKS = {
    REMINDER: env_1.default.discord.webhooks.reminder,
    COMPLETE: env_1.default.discord.webhooks.complete,
    DELETE: env_1.default.discord.webhooks.delete,
};
function sendDiscordNotification(task_2, user_2) {
    return __awaiter(this, arguments, void 0, function* (task, user, type = "reminder") {
        try {
            const priorityColors = {
                Easy: 0x00ff00,
                Medium: 0xffff00,
                Hard: 0xff0000,
            };
            const titles = {
                reminder: "📋 Task Reminder",
                complete: "✅ Task Completed",
                delete: "🗑️ Task Deleted",
                permanent: "⚠️ Task Permanently Deleted",
                created: "🆕 New Task Created",
            };
            const descriptions = {
                reminder: `Hey <@${user.discordId}>, you have a task due!`,
                complete: `<@${user.discordId}> has completed a task!`,
                delete: `<@${user.discordId}>'s task has been moved to trash.`,
                permanent: `<@${user.discordId}>'s task has been permanently deleted.`,
                created: `A new task has been assigned to <@${user.discordId}>!`,
            };
            const priorityColor = priorityColors[task.priority];
            const embed = {
                title: titles[type] || titles["reminder"],
                description: descriptions[type] || descriptions["reminder"],
                color: type === "complete"
                    ? 0x00ff00
                    : type === "delete" || type === "permanent"
                        ? 0xff0000
                        : type === "created"
                            ? 0x3498db
                            : priorityColor !== null && priorityColor !== void 0 ? priorityColor : 0x3498db,
                fields: [
                    {
                        name: "Task",
                        value: task.taskName,
                        inline: false,
                    },
                    {
                        name: "Due Date",
                        value: new Date(task.dueDate).toLocaleDateString("en-IN", {
                            timeZone: "Asia/Kolkata",
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                        }),
                        inline: true,
                    },
                    {
                        name: "Priority",
                        value: task.priority,
                        inline: true,
                    },
                    {
                        name: "Category",
                        value: task.category.name,
                        inline: true,
                    },
                ],
                timestamp: new Date().toISOString(),
            };
            // Choose webhook based on type
            let webhookUrl = DISCORD_WEBHOOKS.REMINDER;
            if (type === "complete") {
                webhookUrl = DISCORD_WEBHOOKS.COMPLETE;
            }
            else if (type === "delete" || type === "permanent") {
                webhookUrl = DISCORD_WEBHOOKS.DELETE;
            }
            else if (type === "created" || type === "reminder") {
                webhookUrl = DISCORD_WEBHOOKS.REMINDER;
            }
            if (!webhookUrl) {
                console.warn(`No webhook configured for notification type: ${type}`);
                return;
            }
            yield axios_1.default.post(webhookUrl, {
                content: `<@${user.discordId}>`,
                embeds: [embed],
            });
            // Only update lastNotified for reminder type
            if (type === "reminder") {
                yield task_1.default.findByIdAndUpdate(task._id, { lastNotified: new Date() });
            }
            console.log(`${type} notification sent for task: ${task.taskName}`);
        }
        catch (error) {
            console.error(`Error sending Discord ${type} notification:`, error);
        }
    });
}
function checkAndSendNotifications() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const now = new Date();
            const istOffset = 5.5 * 60 * 60 * 1000;
            const istNow = new Date(now.getTime() + istOffset);
            const tasks = yield task_1.default.find({
                status: "active",
            })
                .populate("assignedUser")
                .populate("category");
            for (const task of tasks) {
                const shouldNotify = yield shouldSendNotification(task, istNow);
                if (shouldNotify) {
                    yield sendDiscordNotification(task, task.assignedUser, "reminder");
                }
            }
        }
        catch (error) {
            console.error("Error checking notifications:", error);
        }
    });
}
function shouldSendNotification(task, currentTime) {
    return __awaiter(this, void 0, void 0, function* () {
        const taskDueDate = new Date(task.dueDate);
        const isDue = taskDueDate.getTime() <= currentTime.getTime();
        if (!isDue)
            return false;
        if (!task.lastNotified) {
            return true;
        }
        const lastNotified = new Date(task.lastNotified);
        const timeSinceLastNotification = currentTime.getTime() - lastNotified.getTime();
        const oneDay = 24 * 60 * 60 * 1000;
        const oneWeek = 7 * oneDay;
        const oneMonth = 30 * oneDay;
        switch (task.repeatInterval) {
            case "daily":
                return timeSinceLastNotification >= oneDay;
            case "weekly":
                return timeSinceLastNotification >= oneWeek;
            case "monthly":
                return timeSinceLastNotification >= oneMonth;
            case "none":
                return timeSinceLastNotification >= oneDay;
            default:
                return false;
        }
    });
}
node_cron_1.default.schedule(env_1.default.cron.dailyNotificationCheck, () => {
    console.log("Running daily notification check at 9 AM IST");
    checkAndSendNotifications();
});
node_cron_1.default.schedule(env_1.default.cron.sixHourlyCheck, () => {
    console.log("Running 6-hourly notification check");
    checkAndSendNotifications();
});
app.get("/api/users", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield user_1.default.find().sort({ created_at: -1 });
        res.json(users);
    }
    catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        res.status(500).json({ error: msg });
    }
}));
app.post("/api/users", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, discordId } = req.body;
        // Check if user with this Discord ID already exists
        const existingUser = yield user_1.default.findOne({ discordId });
        if (existingUser) {
            return res
                .status(400)
                .json({ error: `User with Discord ID ${discordId} already exists` });
        }
        const user = new user_1.default({ name, discordId });
        yield user.save();
        res.status(201).json(user);
    }
    catch (err) {
        if ((err === null || err === void 0 ? void 0 : err.code) === 11000) {
            res
                .status(400)
                .json({ error: "A user with this Discord ID already exists" });
        }
        else {
            const msg = err instanceof Error ? err.message : String(err);
            res.status(400).json({ error: msg });
        }
    }
}));
app.delete("/api/users/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        yield user_1.default.findByIdAndDelete(id);
        res.status(200).json({ message: "User deleted successfully" });
    }
    catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        res.status(500).json({ error: msg });
    }
}));
app.get("/api/categories", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const categories = yield category_1.default.find().sort({ created_at: 1 });
        res.json(categories);
    }
    catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        res.status(500).json({ error: msg });
    }
}));
app.post("/api/categories", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name } = req.body;
        const category = new category_1.default({ name });
        yield category.save();
        res.status(201).json(category);
    }
    catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        res.status(400).json({ error: msg });
    }
}));
app.delete("/api/categories/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const category = yield category_1.default.findById(id);
        if (!category) {
            return res.status(404).json({ error: "Category not found" });
        }
        if (!category.isDeletable) {
            return res.status(400).json({ error: "This category cannot be deleted" });
        }
        yield task_1.default.deleteMany({ category: id });
        yield category_1.default.findByIdAndDelete(id);
        res.status(200).json({ message: "Category deleted successfully" });
    }
    catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        res.status(500).json({ error: msg });
    }
}));
app.get("/api/tasks", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tasks = yield task_1.default.find()
            .populate("category")
            .populate("assignedUser")
            .sort({ created_at: -1 });
        res.json(tasks);
    }
    catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        res.status(500).json({ error: msg });
    }
}));
app.post("/api/tasks", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { taskName, dueDate, priority, assignedUser, category, repeatInterval, } = req.body;
        const task = new task_1.default({
            taskName,
            dueDate,
            priority,
            assignedUser,
            category,
            repeatInterval: repeatInterval || "none",
        });
        yield task.save();
        const populatedTask = yield task_1.default.findById(task._id)
            .populate("category")
            .populate("assignedUser");
        // Send Discord notification for new task creation (only if populated)
        if (populatedTask) {
            yield sendDiscordNotification(populatedTask, populatedTask.assignedUser, "created");
            res.status(201).json(populatedTask);
        }
        else {
            res.status(201).json(task);
        }
    }
    catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        res.status(400).json({ error: msg });
    }
}));
app.put("/api/tasks/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { taskName, dueDate, priority, assignedUser, category, repeatInterval, } = req.body;
        // Validate required fields
        if (!taskName || !dueDate || !priority || !assignedUser || !category) {
            return res.status(400).json({ error: "Missing required fields" });
        }
        // Check if task exists
        const existingTask = yield task_1.default.findById(id);
        if (!existingTask) {
            return res.status(404).json({ error: "Task not found" });
        }
        // Validate that user exists
        const userExists = yield user_1.default.findById(assignedUser);
        if (!userExists) {
            return res.status(400).json({ error: "Assigned user not found" });
        }
        // Validate that category exists
        const categoryExists = yield category_1.default.findById(category);
        if (!categoryExists) {
            return res.status(400).json({ error: "Category not found" });
        }
        // Validate priority value
        if (!["Easy", "Medium", "Hard"].includes(priority)) {
            return res.status(400).json({ error: "Invalid priority value" });
        }
        // Validate repeat interval if provided
        if (repeatInterval &&
            !["none", "daily", "weekly", "monthly"].includes(repeatInterval)) {
            return res.status(400).json({ error: "Invalid repeat interval" });
        }
        const task = yield task_1.default.findByIdAndUpdate(id, {
            taskName,
            dueDate,
            priority,
            assignedUser,
            category,
            repeatInterval: repeatInterval || "none",
        }, { new: true, runValidators: true })
            .populate("category")
            .populate("assignedUser");
        if (!task) {
            return res.status(404).json({ error: "Task not found" });
        }
        res.json(task);
    }
    catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        console.error("Error updating task:", err);
        res.status(500).json({ error: "Failed to update task: " + msg });
    }
}));
app.delete("/api/tasks/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const task = yield task_1.default.findById(id)
            .populate("category")
            .populate("assignedUser");
        if (!task) {
            return res.status(404).json({ error: "Task not found" });
        }
        const deletedCategory = yield category_1.default.findOne({ name: "Deleted Tasks" });
        // Resolve category name safely (category may be populated doc or ObjectId)
        const categoryName = task.category &&
            typeof task.category === "object" &&
            "name" in task.category
            ? task.category.name
            : String(task.category);
        // If task is already in Deleted Tasks category, permanently delete it
        if (categoryName === "Deleted Tasks") {
            yield task_1.default.findByIdAndDelete(id);
            // Send permanent delete notification
            yield sendDiscordNotification(task, task.assignedUser, "permanent");
            res.status(200).json({ message: "Task permanently deleted" });
        }
        else if (deletedCategory) {
            // Move to Deleted Tasks category (store _id)
            task.category = deletedCategory._id;
            task.status = "deleted";
            yield task.save();
            // Ensure category is populated for notification
            yield task.populate("category");
            // Send delete notification
            yield sendDiscordNotification(task, task.assignedUser, "delete");
            res.status(200).json({ message: "Task moved to deleted" });
        }
        else {
            // If no deleted category exists, permanently delete
            yield task_1.default.findByIdAndDelete(id);
            res.status(200).json({ message: "Task deleted permanently" });
        }
    }
    catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        res.status(500).json({ error: msg });
    }
}));
app.patch("/api/tasks/:id/complete", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const completedCategory = yield category_1.default.findOne({
            name: "Completed Tasks",
        });
        if (!completedCategory) {
            return res
                .status(404)
                .json({ error: "Completed Tasks category not found" });
        }
        const task = yield task_1.default.findById(id)
            .populate("assignedUser")
            .populate("category");
        if (!task) {
            return res.status(404).json({ error: "Task not found" });
        }
        // Update task (store category _id)
        task.category = completedCategory._id;
        task.status = "completed";
        yield task.save();
        // Populate the updated task
        yield task.populate("category");
        // Send completion notification
        yield sendDiscordNotification(task, task.assignedUser, "complete");
        res.json(task);
    }
    catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        res.status(400).json({ error: msg });
    }
}));
app.patch("/api/tasks/:id/category", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { categoryId } = req.body;
        // Find the target category to check if it's special
        const targetCategory = yield category_1.default.findById(categoryId);
        if (!targetCategory) {
            return res.status(404).json({ error: "Category not found" });
        }
        // Determine the new status based on the category
        let newStatus = "active";
        if (targetCategory.name === "Completed Tasks") {
            newStatus = "completed";
        }
        else if (targetCategory.name === "Deleted Tasks") {
            newStatus = "deleted";
        }
        // Update both category and status
        const task = yield task_1.default.findByIdAndUpdate(id, {
            category: categoryId,
            status: newStatus,
        }, { new: true })
            .populate("category")
            .populate("assignedUser");
        res.json(task);
    }
    catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        res.status(400).json({ error: msg });
    }
}));
app.post("/api/test-notification", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { taskId, type = "reminder" } = req.body;
        const task = yield task_1.default.findById(taskId)
            .populate("assignedUser")
            .populate("category");
        if (!task) {
            return res.status(404).json({ error: "Task not found" });
        }
        yield sendDiscordNotification(task, task.assignedUser, type);
        res.json({ message: `Test ${type} notification sent successfully` });
    }
    catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        res.status(500).json({ error: msg });
    }
}));
const PORT = env_1.default.application.port;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    // Only check notifications if MongoDB is connected
    if (database_1.default.connection.readyState === 1) {
        checkAndSendNotifications();
    }
});
