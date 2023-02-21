"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require('express');
const apiController_1 = __importDefault(require("../controllers/aws/apiController"));
const router = express.Router();
const authController_1 = __importDefault(require("../controllers/authController"));
const credentialsController_1 = __importDefault(require("../controllers/aws/credentialsController"));
const lambdaController_1 = __importDefault(require("../controllers/aws/lambdaController"));
const logsController_1 = __importDefault(require("../controllers/aws/logsController"));
const metricsController_1 = __importDefault(require("../controllers/aws/metricsController"));
const userController_1 = __importDefault(require("../controllers/userController"));
const apiMetricsController_1 = __importDefault(require("../controllers/aws/apiMetricsController"));
// All routes verify JWT Token to get email
// Email is used to query the database for ARN
// ARN is used to get credentials from client's AWS account
// Credentials used to grab metrics
router.get('/allMetrics', authController_1.default.verifyToken, credentialsController_1.default.getCredentialsFromDB, metricsController_1.default.getAllMetrics, lambdaController_1.default.getFunctions, metricsController_1.default.getMetricsByFunc, metricsController_1.default.getCostProps, (req, res) => {
    return res.status(200).json({
        allFuncMetrics: res.locals.allFuncMetrics,
        cost: res.locals.cost
    });
});
router.get('/funcmetrics', authController_1.default.verifyToken, credentialsController_1.default.getCredentialsFromDB, lambdaController_1.default.getFunctions, metricsController_1.default.getMetricsByFunc, (req, res) => {
    return res.status(200).json({
        eachFuncMetrics: res.locals.eachFuncMetrics,
    });
});
router.get('/functions', authController_1.default.verifyToken, credentialsController_1.default.getCredentialsFromDB, lambdaController_1.default.getFunctions, (req, res) => {
    return res.status(200).json({
        functions: res.locals.functions
    });
});
// Handles POST Requests to get Logs for all functions and the ability to filter
router.post('/allLogs', authController_1.default.verifyToken, credentialsController_1.default.getCredentialsFromDB, logsController_1.default.getAllLogs, (req, res) => {
    return res.status(200).json({
        logs: res.locals.logs
    });
});
router.post('/filteredLogs', authController_1.default.verifyToken, credentialsController_1.default.getCredentialsFromDB, logsController_1.default.getFilteredLogs, (req, res) => {
    return res.status(200).json({
        filteredLogs: res.locals.filteredLogs
    });
});
// Handles GET/POST Requests to grab API Metrics + Relationships
router.post('/apiRelations', authController_1.default.verifyToken, credentialsController_1.default.getCredentialsFromDB, lambdaController_1.default.getFunctions, apiController_1.default.getAPIRelations, (req, res) => {
    return res.status(200).json({
        apiRelations: res.locals.apiRelations
    });
});
router.get('/apiList', authController_1.default.verifyToken, credentialsController_1.default.getCredentialsFromDB, apiController_1.default.getAPIList, (req, res) => {
    return res.status(200).json({
        apiList: res.locals.apiList
    });
});
router.get('/apiMetrics', authController_1.default.verifyToken, credentialsController_1.default.getCredentialsFromDB, apiController_1.default.getAPIList, apiMetricsController_1.default.getAPIMetrics, (req, res) => {
    return res.status(200).json({
        allApiMetrics: res.locals.allApiMetrics
    });
});
router.get('/apiList', authController_1.default.verifyToken, credentialsController_1.default.getCredentialsFromDB, apiController_1.default.getAPIList, (req, res) => {
    return res.status(200).json({
        apiList: res.locals.apiList
    });
});
//Handles GET/POST requests to the Settings Tab
router.get('/userDetails', authController_1.default.verifyToken, userController_1.default.getUser, (req, res) => {
    return res.status(200).json(res.locals.user);
});
router.post('/updateProfile', authController_1.default.verifyToken, credentialsController_1.default.getCredentials, userController_1.default.updateUserProfile, (req, res) => {
    return res.status(200).json(res.locals.user);
});
router.post('/updatePassword', authController_1.default.verifyToken, userController_1.default.updateUserPassword, (req, res) => {
    return res.status(200).json(res.locals.success);
});
module.exports = router;
