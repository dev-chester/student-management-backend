'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Student extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsToMany(models.Tutor, { as: 'tutors', through: models.Tutor_Student, foreignKey: 'student_id'});
      // this.belongsToMany(models.Tutor, {
      //   through: "Tutor_Students",
      //   as: "tutors",
      //   foreignKey: "student_id"
      // });
      // this.belongsToMany(models.Tutor, { through: "Tutor_Students" });
    }
  };
  Student.init({
    email: {
      type: DataTypes.STRING,
      validate: {
        isEmail: true,
      },
    },
    isSuspended : {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    sequelize,
    modelName: 'Student',
  });
  return Student;
};