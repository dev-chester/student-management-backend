var models = require('../models');

class GetCommonStudents {

  constructor(validatedArgs) {
    this.queries = validatedArgs;
  }

  async call() {
    /* TODO: Implementation */

    // Get all Tutors and all their students
    const allTutors = await models.Tutor.findAll({
      include: [{
        model: models.Student,
        as: 'students'
      }],
      where: {
        email: this.queries.tutor
      }
    });

    // Move into an array
    let aStudents = [];
    allTutors.forEach((tutor) => {
      aStudents.push(tutor.students.map((student) => student.email));
    })

    // If single tutor was provided
    if (!Array.isArray(this.queries.tutor)) {
      return {students: aStudents};
    }

    // If multiple tutors but some tutor/s was not found
    if (allTutors.length !== this.queries.tutor.length) {
      throw new Error("Some tutors provided was not found");
    }
    
    let aStudentsNoDuplicates = [];
    let aStudentsDup = [];

    // Finding common student/s
    aStudents = aStudents.flat();
    aStudentsNoDuplicates = [...new Set(aStudents)];
    aStudentsDup = [...aStudents];

    aStudentsNoDuplicates.forEach((s) => {
      const i = aStudentsDup.indexOf(s);
      aStudentsDup = aStudentsDup.slice(0, i).concat(aStudentsDup.slice(i + 1, aStudentsDup.length));
    })

    return {students: aStudentsDup};

  }

}

module.exports = GetCommonStudents;
