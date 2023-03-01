import { DataTypes } from "sequelize";
import sequelize from "../config";

const User = sequelize.define("User", {
  user: DataTypes.STRING,
  tokens: DataTypes.INTEGER,
  permission: DataTypes.INTEGER,
});

(async () => {
  await sequelize.sync();
  User.findOrCreate({
    where: { user: "556191190720@c.us" },
    defaults: {
      user: "556191190720@c.us",
      tokens: 100000,
      permission: 3,
    },
  });
})();

export default User;
