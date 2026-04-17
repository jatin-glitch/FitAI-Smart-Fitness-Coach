const Notification = require('../models/Notification');

class NotificationService {
  async create(userId, { title, message, type, data }) {
    return Notification.create({ user: userId, title, message, type, data });
  }

  async getUserNotifications(userId, { page = 1, limit = 20, unreadOnly = false }) {
    const query = { user: userId };
    if (unreadOnly) query.read = false;

    const skip = (page - 1) * limit;
    const [notifications, total, unreadCount] = await Promise.all([
      Notification.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Notification.countDocuments(query),
      Notification.countDocuments({ user: userId, read: false }),
    ]);

    return {
      notifications,
      unreadCount,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    };
  }

  async markAsRead(userId, notificationId) {
    const notification = await Notification.findOneAndUpdate(
      { _id: notificationId, user: userId },
      { read: true },
      { new: true }
    );
    return notification;
  }

  async markAllAsRead(userId) {
    await Notification.updateMany({ user: userId, read: false }, { read: true });
    return { message: 'All notifications marked as read.' };
  }

  async deleteNotification(userId, notificationId) {
    await Notification.findOneAndDelete({ _id: notificationId, user: userId });
    return { message: 'Notification deleted.' };
  }
}

module.exports = new NotificationService();
