var models = require('../models');

class RetrieveNotification {

  constructor(validatedArgs) {
    debugger;
    this.tutor = validatedArgs.tutor;
    this.notification = validatedArgs.notification;
  }

  async call() { 

    // All subscribed students that were not suspended
    const subscribedStudents = await models.Tutor.findOne({
      where: {
        email: this.tutor,
      },
      include: [{
          model: models.Student,
          as: 'students',
          required: false,
          where: {
            isSuspended: false,
          },
        }],
    });

    // Extract emails in notification string
    const allMentionedStudents = this.notification
      .split(" ")
      .filter( e => e.charAt(0) === '@')
      .map( e => e.substring(1,e.length));
    debugger;

    // All mentioned students that were not suspended
    const mentionedStudentsNotSuspended = await models.Student.findAll({
      where: {
        email: allMentionedStudents,
        isSuspended : false
      }
    });

    // Merge two student lists and remove duplicates
    console.log([subscribedStudents.students,mentionedStudentsNotSuspended]);
    let aResults = [subscribedStudents.students, mentionedStudentsNotSuspended].flat();

    let oRes = {"recipients": [...new Set(aResults.map((student) => student.email))]};
    debugger;
    return oRes;

  }

}

module.exports = RetrieveNotification;