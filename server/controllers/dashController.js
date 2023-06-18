const db = require("../models");
const { Op } = require("sequelize");

exports.getDashboardStats = async (req, res) => {
  try {
    const currentDate = new Date();
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    // Total number of users
    const totalUsers = await db.User.count();

    // New users in the last 7 days
    const newUsersLast7Days = await db.User.count({
      where: {
        createdAt: {
          [Op.between]: [oneWeekAgo, currentDate],
        },
      },
    });

    // Total number of users today
    const usersToday = await db.User.count({
      where: {
        createdAt: {
          [Op.gte]: currentDate.setHours(0, 0, 0, 0),
          [Op.lte]: currentDate.setHours(23, 59, 59, 999),
        },
      },
    });

    return res.status(200).json( 
      {data: {
      totalUsers,
      newUsersLast7Days,
      usersToday,
    }
  });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};