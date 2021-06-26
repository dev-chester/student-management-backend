const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Tutor extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsToMany(models.Student, { as: 'students', through: models.Tutor_Student, foreignKey: 'tutor_id'});
      // this.belongsToMany(models.Student, {
      //   through: "Tutor_Students",
      //   as: "students",
      //   foreignKey: "tutor_id"
      // });
      // this.belongsToMany(models.Student, { through: "Tutor_Students" });
    }
  }
  Tutor.init(
    {
      email: {
        type: DataTypes.STRING,
        validate: {
          isEmail: true,
        },
      },
    },
    {
      sequelize,
      modelName: "Tutor",
    }
  );
  return Tutor;
};
