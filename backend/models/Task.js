const { DataTypes, Model } = require("sequelize");
const { sequelize } = require("../config/db");

class Task extends Model {}

Task.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: { msg: "Title is required" },
        len: { args: [1, 100], msg: "Title must be less than 100 characters" },
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: "",
    },
    priority: {
      type: DataTypes.ENUM("Low", "Medium", "High"),
      allowNull: false,
      defaultValue: "Medium",
    },
    stage: {
      type: DataTypes.ENUM("Todo", "In Progress", "Done"),
      allowNull: false,
      defaultValue: "Todo",
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
      onDelete: "CASCADE",
    },
  },
  {
    sequelize,
    modelName: "Task",
    tableName: "tasks",
    timestamps: true,
    indexes: [
      { fields: ["userId"] },
      { fields: ["stage"] },
      { fields: ["priority"] },
    ],
  }
);

module.exports = Task;