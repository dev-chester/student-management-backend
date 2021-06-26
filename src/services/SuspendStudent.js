  
var models = require('../models');

class SuspendStudent {
  constructor(validatedArgs) {
    this.student = validatedArgs.student;
  }  

  async call() {

    const findStudent = await models.Student.findOne({where: {email: this.student}});

    if (!findStudent) throw new Error(`Student ${this.student} was not found`);

    findStudent.isSuspended = true;

    return findStudent.save();

  }
  
}

module.exports = SuspendStudent;