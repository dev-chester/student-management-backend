'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Tutor_Student extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Student, { foreignKey: 'student_id', targetKey: 'id', as: 'students' });
      this.belongsTo(models.Tutor, { foreignKey: 'tutor_id', targetKey: 'id', as: 'tutors' });
    }
  };
  Tutor_Student.init({
    student_id: {
      type: DataTypes.INTEGER(11),
      primaryKey: false,
      references: {
        model: 'Student',
        key: 'student_id'
      },
      onDelete: 'cascade',
      onUpdate: 'cascade'
    },
    tutor_id: {
      type: DataTypes.INTEGER(11),
      primaryKey: false,
      references: {
        model: 'Tutor',
        key: 'tutor_id'
      },
      onDelete: 'cascade',
      onUpdate: 'cascade'
    },
  }, {
    sequelize,
    modelName: 'Tutor_Student',
  });
  return Tutor_Student;
};