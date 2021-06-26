require("@babel/register");
const models = require("./models/");

export const truncate = async () => {
  return await Promise.all(
    Object.keys(models).map((key) => {
      if (["sequelize", "Sequelize"].includes(key)) return null;
      return models[key].destroy({ where: {}, force: true });
    })
  );
};
