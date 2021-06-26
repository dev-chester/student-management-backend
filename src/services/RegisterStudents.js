var models = require('../models');
models.sequelize

class RegisterStudents {

  constructor(validatedArgs) {
    this.tutor = validatedArgs.tutor;
    this.students = validatedArgs.students;
  }

  async call() {
    /* TODO: Implementation */

    // Starting a transaction
    await models.sequelize.transaction( async t => {
      
      // Inserting to Tutor table
      var resultTutorCreate = await models.Tutor.findOrCreate({
        where: {
          email: this.tutor
        }, transaction: t
      }); 

      // Use find and create for both tutor and student
      const resultStudents = await Promise.all(this.students.map((e) => {
        return models.Student.findOrCreate({
          where: {
            email: e
          }, transaction : t
        }).then((data) => {
          return data[0];
        });
      }));

      // Inserting to junction table
      resultTutorCreate[0].addStudents(resultStudents);
      return;

      // Inserting to Student table
      // var resultStudentBulkCreate = await models.Student.bulkCreate(aStudents, {
      //   transaction: t,
      //   ignoreDuplicates: false
      // });
      // Reformatting body request
      // const aStudents = students.map((e) => {
      //   return {email: e};
      // })
    });

  }

}

module.exports = RegisterStudents;
