import axios from "axios";
import env from "../config/env";
import Task from "../database/models/task";
import logger from "../utils/logger";

const DISCORD_WEBHOOKS = {
  REMINDER: env.discord.webhooks.reminder,
  COMPLETE: env.discord.webhooks.complete,
  DELETE: env.discord.webhooks.delete,
};

export enum NotificationType {
  Reminder = "reminder",
  Complete = "complete",
  Delete = "delete",
  Permanent = "permanent",
  Created = "created",
}

export async function sendDiscordNotification(
  task: any,
  user: any,
  type: NotificationType = NotificationType.Reminder
) {
  try {
    const priorityColors = {
      Easy: 0x00ff00,
      Medium: 0xffff00,
      Hard: 0xff0000,
    };

    const titles: Record<NotificationType, string> = {
      [NotificationType.Reminder]: "📋 Task Reminder",
      [NotificationType.Complete]: "✅ Task Completed",
      [NotificationType.Delete]: "🗑️ Task Deleted",
      [NotificationType.Permanent]: "⚠️ Task Permanently Deleted",
      [NotificationType.Created]: "🆕 New Task Created",
    };

    const descriptions: Record<NotificationType, string> = {
      [NotificationType.Reminder]: `Hey <@${user.discordId}>, you have a task due!`,
      [NotificationType.Complete]: `<@${user.discordId}> has completed a task!`,
      [NotificationType.Delete]: `<@${user.discordId}>'s task has been moved to trash.`,
      [NotificationType.Permanent]: `<@${user.discordId}>'s task has been permanently deleted.`,
      [NotificationType.Created]: `A new task has been assigned to <@${user.discordId}>!`,
    };

    const priorityColor = (priorityColors as Record<string, number>)[
      task.priority as string
    ] as number | undefined;

    const embed = {
      title: titles[type] || titles[NotificationType.Reminder],
      description:
        descriptions[type] || descriptions[NotificationType.Reminder],
      color:
        type === NotificationType.Complete
          ? 0x00ff00
          : type === NotificationType.Delete ||
            type === NotificationType.Permanent
          ? 0xff0000
          : type === NotificationType.Created
          ? 0x3498db
          : priorityColor ?? 0x3498db,
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
    } else if (type === "delete" || type === "permanent") {
      webhookUrl = DISCORD_WEBHOOKS.DELETE;
    } else if (type === "created" || type === "reminder") {
      webhookUrl = DISCORD_WEBHOOKS.REMINDER;
    }

    if (!webhookUrl) {
      logger.warn(`No webhook configured for notification type: ${type}`);
      return;
    }

    await axios.post(
      webhookUrl as string,
      {
        content: `<@${user.discordId}>`,
        embeds: [embed],
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    // Only update lastNotified for reminder type
    if (type === "reminder") {
      await Task.findByIdAndUpdate(task._id, { lastNotified: new Date() });
    }
    logger.info(`${type} notification sent for task: ${task.taskName}`);
  } catch (error) {
    logger.error(`Error sending Discord ${type} notification:`, error);
  }
}

export async function checkAndSendNotifications() {
  try {
    const now = new Date();
    const istOffset = 5.5 * 60 * 60 * 1000;
    const istNow = new Date(now.getTime() + istOffset);

    const tasks = await Task.find({
      status: "active",
    })
      .populate("assignedUser")
      .populate("category");

    for (const task of tasks) {
      const shouldNotify = await shouldSendNotification(task, istNow);
      if (shouldNotify) {
        await sendDiscordNotification(
          task,
          task.assignedUser,
          NotificationType.Reminder
        );
      }
    }
  } catch (error) {
    logger.error("Error checking notifications:", error);
  }
}

export async function shouldSendNotification(task: any, currentTime: Date) {
  const taskDueDate = new Date(task.dueDate);
  const isDue = taskDueDate.getTime() <= currentTime.getTime();

  if (!isDue) return false;

  if (!task.lastNotified) {
    return true;
  }

  const lastNotified = new Date(task.lastNotified);
  const timeSinceLastNotification =
    currentTime.getTime() - lastNotified.getTime();
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
}
