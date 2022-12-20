"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_cloudwatch_1 = require("@aws-sdk/client-cloudwatch");
require('dotenv').config();
// NOTE: LOOK TO SEE IF THE GETMETRIC HAS AN INPUT TYPE IN THE LIBRARY
// GetMetricStatistics only retrieves data for a single metric
// GetMetricData allows you to retrieve data for multiple metrics at the same time
// GetMetricData is more flexible and powerful than GetMetricStatistics as it allows you to retrieve data for multiple metrics at the same time, but more complex to use, as it requires you to specify more information in the request
const metricsController = {
    getAllMetrics(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const client = new client_cloudwatch_1.CloudWatchClient({
                    region: res.locals.region,
                    credentials: res.locals.credentials
                });
                const metricInvocationData = {
                    Id: "i1",
                    MetricStat: {
                        Metric: {
                            MetricName: "Invocations",
                            Namespace: "AWS/Lambda",
                        },
                        Period: 60,
                        Stat: "Sum", //Sum/Average/Minimum/Maximum
                    },
                    Label: "Total Invocations of Lambda Functions"
                };
                const metricErrorData = {
                    Id: "e1",
                    MetricStat: {
                        Metric: {
                            MetricName: "Errors",
                            Namespace: "AWS/Lambda"
                        },
                        Period: 60,
                        Stat: "Sum",
                    },
                    Label: "Total Errors of Lambda Functions"
                };
                const metricThrottlesData = {
                    Id: "t1",
                    MetricStat: {
                        Metric: {
                            MetricName: "Throttles",
                            Namespace: "AWS/Lambda"
                        },
                        Period: 60,
                        Stat: "Sum",
                    },
                    Label: "Total Throttles of Lambda Functions"
                };
                const metricDurationData = {
                    Id: "d1",
                    MetricStat: {
                        Metric: {
                            MetricName: "Duration",
                            Namespace: "AWS/Lambda"
                        },
                        Period: 60,
                        Stat: "Sum",
                    },
                    Label: "Total Duration of Lambda Functions"
                };
                const input = {
                    // Update StartTime and EndTime to be more dynamic from user
                    "StartTime": new Date(new Date().setDate(new Date().getDate() - 7)),
                    "EndTime": new Date(),
                    "MetricDataQueries": [metricInvocationData, metricErrorData, metricThrottlesData, metricDurationData],
                };
                const command = new client_cloudwatch_1.GetMetricDataCommand(input);
                const response = yield client.send(command);
                // Create a metrics object to store the values and timestamps of each metric
                if (response.MetricDataResults) {
                    const metrics = {
                        invocations: {
                            values: response.MetricDataResults[0].Values,
                            timestamp: response.MetricDataResults[0].Timestamps
                        },
                        errors: {
                            values: response.MetricDataResults[1].Values,
                            timestamp: response.MetricDataResults[1].Timestamps
                        },
                        throttles: {
                            values: response.MetricDataResults[2].Values,
                            timestamp: response.MetricDataResults[2].Timestamps
                        },
                        duration: {
                            values: response.MetricDataResults[3].Values,
                            timestamp: response.MetricDataResults[3].Timestamps
                        }
                    };
                    res.locals.metrics = metrics;
                }
                return next();
            }
            catch (err) {
                return next({
                    log: "Error caught in metricsController.getAllMetrics middleware function",
                    status: 500,
                    message: { err: "Error grabbing metrics for all Lambda Functions" }
                });
            }
        });
    },
    // Grab specific metrics from cloudwatch depending on user input 
    getMetricsByFunc(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Intiate client with credentials
                const client = new client_cloudwatch_1.CloudWatchClient({
                    region: res.locals.region,
                    credentials: res.locals.credentials
                });
                const { id, metricName, stat, functionName } = req.body;
                const metricData = {
                    Id: `${id}`,
                    MetricStat: {
                        Metric: {
                            MetricName: `${metricName}`,
                            Namespace: "AWS/Lambda"
                        },
                        Dimensions: [
                            {
                                Name: 'FunctionName',
                                Value: `${functionName}`
                            },
                        ],
                        Period: 60,
                        Stat: `${stat}`, //Sum/Average/Minimum/Maximum
                    },
                    Label: `Total ${metricName} of Lambda Functions`
                };
                const input = {
                    // Update StartTime and EndTime to be more dynamic from user
                    "StartTime": new Date(new Date().setDate(new Date().getDate() - 7)),
                    "EndTime": new Date(),
                    "MetricDataQueries": [metricData],
                };
                const command = new client_cloudwatch_1.GetMetricDataCommand(input);
                const response = yield client.send(command);
                // Create a metrics object to store the values and timestamps of specific metric
                if (response.MetricDataResults) {
                    const metric = {
                        values: response.MetricDataResults[0].Values,
                        timestamp: response.MetricDataResults[0].Timestamps
                    };
                    res.locals.metric = metric;
                }
                return next();
            }
            catch (err) {
                return next({
                    log: "Error caught in metricsController.getMetricsByFunc middleware function",
                    status: 500,
                    message: { err: "Error grabbing metrics for Lambda Function" }
                });
            }
        });
    }
};
// Change to export default syntaix
exports.default = metricsController;
