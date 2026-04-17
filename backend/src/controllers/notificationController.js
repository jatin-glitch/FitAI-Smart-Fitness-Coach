const notificationService = require('../services/notificationService');

const getNotifications = async (req, res, next) => {
  try {
    const result = await notificationService.getUserNotifications(req.userId, req.query);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

const markAsRead = async (req, res, next) => {
  try {
    const notification = await notificationService.markAsRead(req.userId, req.params.id);
    res.json({ notification });
  } catch (error) {
    next(error);
  }
};

const markAllAsRead = async (req, res, next) => {
  try {
    const result = await notificationService.markAllAsRead(req.userId);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

const deleteNotification = async (req, res, next) => {
  try {
    const result = await notificationService.deleteNotification(req.userId, req.params.id);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

module.exports = { getNotifications, markAsRead, markAllAsRead, deleteNotification };
