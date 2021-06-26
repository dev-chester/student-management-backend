require("mysql2/node_modules/iconv-lite").encodingExists("foo");

const request = require("supertest");
const app = require("../testEntry");
const faker = require("faker");

const { truncate } = require("../testHelper");

const { fake } = require("faker");

describe("Api Controller", () => {
  describe("Register API", () => {
    describe("Invalid body", () => {
      it("should fail without tutor ", async (done) => {
        const { statusCode, body } = await request(app).post("/api/register").send();
        const { message, details } = body;

        expect(message).toEqual("Validation Failed");
        expect(details).toEqual([{ tutor: '"tutor" is required' }]);
        expect(statusCode).toEqual(400);
        done();
      });

      it("should fail without students ", async (done) => {
        const { statusCode, body } = await request(app).post("/api/register").send({
          tutor: 't1@gmail.com',
          students: [],
        });
        const { message, details } = body;
        expect(message).toEqual("Validation Failed");
        expect(details).toEqual([{ students: '"students" must contain at least 1 items' }])
        expect(statusCode).toEqual(400);
        done();
      });

      it("should fail if tutor is not an email", async (done) => {
        const { statusCode, body } = await request(app).post("/api/register").send({
          tutor: '@gmail.com',
        });
        const { message, details } = body;
        expect(message).toEqual("Validation Failed");
        expect(details).toEqual([{ tutor: '"tutor" must be a valid email' }])
        expect(statusCode).toEqual(400);
        done();
      });

      it("should fail if students are not in email format", async (done) => {
        const { statusCode, body } = await request(app).post("/api/register").send({
          tutor: 't1@gmail.com',
          students: ['@gmail.com', '@gmail.com']
        });
        const { message, details } = body;
        expect(message).toEqual("Validation Failed");
        expect(details).toEqual([{ 0: '"students[0]" must be a valid email' }])
        expect(statusCode).toEqual(400);
        done();
      });
    });

    describe("Valid body", () => {
      beforeEach(async () => {
        await reset();
      })

      it("should pass for new tutor and students", async (done) => {
        const studentInfo = ['efg@gmail.com', 'hij@gmail.com']
        const tutorEmail = 'abcd@gmail.com';
        const { statusCode } = await request(app).post("/api/register").send({
          tutor: tutorEmail,
          students: studentInfo,
        });
        const tutor = await db.Tutor.findOne({
          where: {
            email: tutorEmail,
          },
          include: {
            model: db.Student,
            as: 'subscriptions',
            required: true,
          }
        });
        const emails = tutor.subscriptions.map(s => s.email);
        
        expect(emails.length).toEqual(2)
        expect(statusCode).toEqual(204)
        done();
      });

      it("should pass for existing tutor and new students", async (done) => {
        const studentInfo = ['lmn@gmail.com', 'opq@gmail.com'];
        const tutorEmail = 't1@gmail.com'; // exists after running seed()

        const { statusCode } = await request(app).post("/api/register").send({
          tutor: tutorEmail,
          students: studentInfo,
        });

        const tutor = await db.Tutor.findOne({
          where: {
            email: tutorEmail,
          },
          include: {
            model: db.Student,
            as: 'subscriptions',
            required: true,
          }
        });
        const emails = tutor.subscriptions.map(s => s.email);

        expect(emails.length).toEqual(2)
        expect(statusCode).toEqual(204)
        done();
      });

      it("should pass for new tutor and old students", async (done) => {
        const studentInfo = ['s1@gmail.com', 's2@gmail.com']; // exists after running seed()
        const tutorEmail = 'rst@gmail.com';

        const { statusCode } = await request(app).post("/api/register").send({
          tutor: tutorEmail,
          students: studentInfo,
        });

        const tutor = await db.Tutor.findOne({
          where: {
            email: tutorEmail,
          },
          include: {
            model: db.Student,
            as: 'subscriptions',
            required: true,
          }
        });
        const emails = tutor.subscriptions
          .map(s => s.email);

        expect(emails.length).toEqual(2)
        expect(statusCode).toEqual(204)
        done();
      });
    });
  });

  describe("GetCommonStudents API", () => {
    describe("Invalid query", () => {
      it("should fail without tutor ", async (done) => {
        const { statusCode, body } = await request(app).get("/api/getcommonsstudents");
        const { message, details } = body;

        expect(message).toEqual("Validation Failed");
        expect(details).toEqual([{ tutor: '"tutor" is required' }]);
        expect(statusCode).toEqual(400);
        done();
      });

      it("should fail if tutor is not an email ", async (done) => {
        const { statusCode, body } = await request(app).get("/api/getcommonsstudents?tutor=%40gmail.com");
        const { message, details } = body;
        expect(message).toEqual("Validation Failed");
        expect(details).toEqual([{ tutor: '"tutor" must be a valid email' }])
        expect(statusCode).toEqual(400);
        done();
      });
    });

    describe("Valid query", () => {
      beforeEach(async () => {
        await reset();
      })

      it("should pass for single common tutor ", async (done) => {
        const { statusCode: registerStatusCode } = await request(app).post("/api/register").send({
          tutor: 't1@gmail.com',
          students: ['s1@gmail.com', 's2@gmail.com'],
        });
        const { statusCode, body } = await request(app).get("/api/getcommonsstudents?tutor=t1%40gmail.com");
        const { students } = body;
        expect(registerStatusCode).toEqual(204)
        expect(students.length).toEqual(2)
        expect(statusCode).toEqual(200);
        done();
      });

      it("should pass for multiple common tutor", async (done) => {
        const { statusCode: registerStatusCode1 } = await request(app).post("/api/register").send({
          tutor: 't1@gmail.com',
          students: ['s1@gmail.com', 's2@gmail.com'],
        });
        const { statusCode: registerStatusCode2 } = await request(app).post("/api/register").send({
          tutor: 't2@gmail.com',
          students: ['s3@gmail.com', 's4@gmail.com'],
        });
        const { statusCode, body } = await request(app).get("/api/getcommonsstudents?tutor=t1%40gmail.com&tutor=t2%40gmail.com");
        const { students } = body;
        expect(registerStatusCode1).toEqual(204)
        expect(registerStatusCode2).toEqual(204)
        expect(students.length).toEqual(4)
        expect(statusCode).toEqual(200);
        done();
      });
    });
  });

  describe("SuspendStudent API", () => {
    describe("Invalid body", () => {
      it("should fail for nonexistent student", async (done) => {
        const student = 'xyz@gmail.com';
        const { statusCode, body } = await request(app).post("/api/suspend").send({
          student,
        });
        const { message } = body;
        expect(statusCode).toEqual(500)
        expect(message).toEqual('Student does not exist');
        done();
      });
    });

    describe("Valid body", () => {
      beforeEach(async () => {
        await reset();
      })

      it("should pass for existing student", async (done) => {
        const student = 's1@gmail.com';
        const { statusCode } = await request(app).post("/api/suspend").send({
          student,
        });
        expect(statusCode).toEqual(204)
        done();
      });
    });
  });

  describe("ReceiveNotifications API", () => {
    describe("Invalid body", () => {
      it("should fail if tutor is empty", async (done) => {
        const { statusCode, body } = await request(app).post("/api/retrievenotifications").send({
          tutor: '',
          notification: '',
        });
        const { message, details } = body;
        expect(message).toEqual("Validation Failed");
        expect(details).toEqual([{ tutor: '"tutor" is not allowed to be empty' }]);
        expect(statusCode).toEqual(400);
        done();
      });

      it("should fail if notification is empty", async (done) => {
        const { statusCode, body } = await request(app).post("/api/retrievenotifications").send({
          tutor: 't1@gmail.com',
          notification: '',
        });
        const { message, details } = body;
        expect(message).toEqual("Validation Failed");
        expect(details).toEqual([{ notification: '"notification" is not allowed to be empty' }]);
        expect(statusCode).toEqual(400);
        done();
      });
    });
  });

  describe("Valid body", () => {
    beforeEach(async () => {
      await reset();
    })
    it("should fail if tutor doesnt exist", async (done) => {
      const { statusCode, body } = await request(app).post("/api/retrievenotifications").send({
        tutor: 't1@gmail.com',
        notification: '',
      });
      const { message, details } = body;
      expect(message).toEqual("Validation Failed");
      expect(details).toEqual([{ notification: '"notification" is not allowed to be empty' }]);
      expect(statusCode).toEqual(400);
      done();
    });

    it("should pass and retrieve students that belongs to the tutor", async (done) => {
      done();
      const { statusCode, body } = await request(app).post("/api/retrievenotifications").send({
        tutor: 'abc@gmail.com',
        notification: '',
      });
      const { message, details } = body;
      expect(message).toEqual("Validation Failed");
      expect(details).toEqual([{ notification: '"notification" is not allowed to be empty' }]);
      expect(statusCode).toEqual(400);
      done();
    });

    it("should pass and retrieve students that belongs to the tutor and mentioned students", async (done) => {
      const { statusCode, body } = await request(app).post("/api/retrievenotifications").send({
        tutor: 't1@gmail.com',
        notification: 'Hi there @s3@gmail.com @s4@gmail.com',
      });
      const { recipients } = body;
      expect(statusCode).toEqual(200)
      expect(recipients.length).toEqual(2)
      done();
    });

    it("should pass and retrieve students that are not suspended only", async (done) => {
      const { statusCode: registerStatusCode1 } = await request(app).post("/api/register").send({
        tutor: 't1@gmail.com',
        students: ['s1@gmail.com','s2@gmail.com'],
      });
      const { statusCode: suspensionCode } = await request(app).post("/api/suspend").send({
        student: 's1@gmail.com',
      });

      const { statusCode, body } = await request(app).post("/api/retrievenotifications").send({
        tutor: 't1@gmail.com',
        notification: 'Hello Everyone',
      });
      const { recipients } = body;

      expect(registerStatusCode1).toEqual(204)
      expect(suspensionCode).toEqual(204)
      expect(statusCode).toEqual(200)
      expect(recipients.length).toEqual(1)
      done();
    });
  });
});