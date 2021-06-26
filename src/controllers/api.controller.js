import { successResponse, errorResponse } from "../helpers";
import RegisterStudents from "../services/RegisterStudents";
import GetCommonStudents from "../services/GetCommonStudents";
import SuspendStudent from "../services/SuspendStudent";
import RetrieveNotifications from "../services/RetrieveNotifications";

export const register = async (req, res) => {
  try {
    const service = new RegisterStudents(req.body);
    await service.call();
    return successResponse(req, res, {}, 204);
  } catch (error) {
    return errorResponse(req, res, error.message);
  }
};

export const getcommonstudents = async (req, res) => {
  try {
    const service = new GetCommonStudents(req.query);
    const resultsCommonStudents = await service.call();
    return successResponse(req, res, { data: resultsCommonStudents }, 200);
  } catch (error) {
    debugger;
    return errorResponse(req, res, error.message);
  }
};

export const suspendStudent = async (req, res) => {
  try {
    const service = new SuspendStudent(req.body);
    await service.call();
    return successResponse(req, res, {}, 204);
  } catch (error) {
    debugger;
    return errorResponse(req, res, error.message);
  }
};

export const retrieveNotifications = async (req, res) => {
  try {
    const service = new RetrieveNotifications(req.body);
    const results = await service.call();
    return successResponse(req, res, results, 200);
  } catch (error) {
    debugger;
    return errorResponse(req, res, error.message);
  }
};
