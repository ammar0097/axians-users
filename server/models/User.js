module.exports = (sequelize, DataType) => {
  const User = sequelize.define("User", {
    username: {
      type: DataType.STRING,
      allowNull: false,
      unique: true,
    },
    firstName: {
      type: DataType.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataType.STRING,
      allowNull: false,
    },
    password: {
      type: DataType.STRING,
      allowNull: false,
    },
    email: {
      type: DataType.STRING,
      allowNull: false,
      unique: true,
    },
    isAdmin: {
        type: DataType.BOOLEAN,
        allowNull: false,
        defaultValue:false
    },
    isActive: {
      type: DataType.BOOLEAN,
      allowNull: false,
      defaultValue:true
  }

  });
return User
};


