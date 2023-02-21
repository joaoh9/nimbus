import { CloudWatchClient, GetMetricDataCommand, GetMetricDataCommandInput, MetricDataQuery, MetricDataResult} from "@aws-sdk/client-cloudwatch";
import { LambdaClient, GetFunctionConfigurationCommand} from "@aws-sdk/client-lambda"
import { Request, Response, NextFunction } from "express";
import { subMetrics, Metrics } from "../../types";
require('dotenv').config();

const metricsController = {
  // Grab the Invocation, Error, Duration, and Throttle metrics for all functions
  async getAllMetrics(req: Request, res: Response, next: NextFunction) {
    try {
      // Initiate client with credentials
      const client = new CloudWatchClient({
        region: res.locals.region,
        credentials: res.locals.credentials
      })
      
      // Specify parameters for each metric
      const metricMemoryData = {
        Id: "m1",
        MetricStat: {
          Metric: {
            MetricName: "MemoryUsage",
            Namespace: "AWS/Lambda",
          },
          Period: 60 * 60 * 24,
          Stat: "Average", 
        },
        Label: "Average memory usage of Lambda Functions"
      }
      const metricInvocationData = {
        Id: "i1", 
        MetricStat: {
          Metric: {
            MetricName: "Invocations",
            Namespace: "AWS/Lambda",
          },
          Period: 60 * 60 * 24,
          Stat: "Sum", 
        },
        Label: "Total Invocations of Lambda Functions"
      }
      const metricErrorData = {
        Id: "e1", 
        MetricStat: {
          Metric: {
            MetricName: "Errors",
            Namespace: "AWS/Lambda"
          },
          Period: 60 * 60 * 24,
          Stat: "Sum",
        },
        Label: "Total Errors of Lambda Functions"
      }
      const metricThrottlesData = {
        Id: "t1", 
        MetricStat: {
          Metric: {
            MetricName: "Throttles",
            Namespace: "AWS/Lambda"
          },
          Period: 60 * 60 * 24,
          Stat: "Sum",
        },
        Label: "Total Throttles of Lambda Functions"
      }
      const metricDurationData = {
        Id: "d1", 
        MetricStat: {
          Metric: {
            MetricName: "Duration",
            Namespace: "AWS/Lambda"
          },
          Period: 60 * 60 * 24,
          Stat: "Sum",
        },
        Label: "Total Duration of Lambda Functions"
      }

      // Create input for GetMetricDataCommand
      const input: GetMetricDataCommandInput = {
        "StartTime": new Date(new Date().setDate(new Date().getDate() - 30)),
        "EndTime": new Date(),
        "MetricDataQueries": [metricInvocationData, metricErrorData, metricThrottlesData, metricDurationData, metricMemoryData],
      }
      const command = new GetMetricDataCommand(input)
      const response = await client.send(command);
      // Create a metrics object to send the values and timestamps of each metric to front end 
      if (response.MetricDataResults) {
        const metrics: Metrics = {
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
          },
        };
        res.locals.allFuncMetrics = metrics;
      }
      return next();
    } catch (err) {
      return next({
        log: "Error caught in metricsController.getAllMetrics middleware function",
        status: 500,
        message: { err: "Error grabbing metrics for all Lambda Functions" }
      })
    } 
  },
  // Grab metrics from cloudwatch depending on user input (seleted func)
  async getMetricsByFunc (req: Request, res: Response, next: NextFunction) {
    try {
      // Start a new CloudWatchClient instance
      const client = new CloudWatchClient({
        region: res.locals.region,
        credentials: res.locals.credentials
      })
      const metricData: MetricDataQuery[] = []
      // functions from lamda controller 
      res.locals.functions.forEach((functionName:string, i:number) => {
        const metricInvocationData = {
          Id: `i${i}`, 
          MetricStat: {
            Metric: {
              MetricName: "Invocations",
              Namespace: "AWS/Lambda",
              Dimensions: [
                {
                  Name: 'FunctionName',
                  Value: `${functionName}`
                },           
              ],
            },
            Period: 60 * 60 * 24,
            Stat: "Sum", 
          },
          Label: `${functionName} Total invocations of Lambda Function`
        }
        metricData.push(metricInvocationData)

        const metricErrorData = {
          Id: `e${i}`, 
          MetricStat: {
            Metric: {
              MetricName: "Errors",
              Namespace: "AWS/Lambda",
              Dimensions: [
                {
                  Name: 'FunctionName',
                  Value: `${functionName}`
                },           
              ],
            },   
            Period: 60 * 60 * 24,
            Stat: "Sum",
          },
          Label: `${functionName} Total errors of Lambda Function`
        }
        metricData.push(metricErrorData)

        const metricThrottlesData = {
          Id: `t${i}`, 
          MetricStat: {
            Metric: {
              MetricName: "Throttles",
              Namespace: "AWS/Lambda",
              Dimensions: [
                {
                  Name: 'FunctionName',
                  Value: `${functionName}`
                },           
              ],
            },
            Period: 60 * 60 * 24,
            Stat: "Sum",
          },
          Label: `${functionName} Total throttles of Lambda Function`
        }
        metricData.push(metricThrottlesData)

        const metricDurationData = {
          Id: `d${i}`, 
          MetricStat: {
            Metric: {
              MetricName: "Duration",
              Namespace: "AWS/Lambda",
              Dimensions: [
                {
                  Name: 'FunctionName',
                  Value: `${functionName}`
                },           
              ],
            },
            Period: 60 * 60 * 24,
            Stat: "Sum",
          },
          Label: `${functionName} Total duration of Lambda Function`
        }
        metricData.push(metricDurationData)
      })
      // Input to get metric data command 
      const input: GetMetricDataCommandInput = {
        "StartTime": new Date(new Date().setDate(new Date().getDate() - 30)),
        "EndTime": new Date(),
        "MetricDataQueries": metricData
      }
      const command = new GetMetricDataCommand(input)

      const response = await client.send(command);
      // Create a metrics object to store the values and timestamps of specific metric
      if (response.MetricDataResults) {
        
        // Parse data into an object where keys are function names and values are the metrics for each function
        const parseData = (arr: MetricDataResult[]) => {
          const allFuncMetrics = {};
          // :oop over elements in arr in chunks of 4
          for (let i = 0; i < arr.length; i+=4) {
            // Get function name
            const funcName = arr[i].Label!.split(' ')[0];
            const metricsByFunc = {};
            // Populate allMetricsObj
            // Loop over number of metrics
            for (let j = 0; j < 4; j++) {
              const metricName = arr[i+j].Label!.split(' ')[2];
              // Declare func object
              const singleMetric: subMetrics = {
                values: arr[i+j].Values,
                timestamp: arr[i+j].Timestamps
              };
              (metricsByFunc as any)[metricName] = singleMetric;
            }
            (allFuncMetrics as any)[funcName] = metricsByFunc;
          }
          return allFuncMetrics;
        }
        // Metrics data for the functions page
        res.locals.eachFuncMetrics = parseData(response.MetricDataResults)
      }
      return next();
    } catch (err) {
      return next({
        log: "Error caught in metricsController.getMetricsByFunc middleware function",
        status: 500,
        message: { err: "Error grabbing metrics for Lambda Function" }
      })
    }
  },
  // Grab required properties to calculate cost of application
  async getCostProps(req: Request, res: Response, next: NextFunction) {
    try {
      // Start a new LambdaClient instance
      const client = new LambdaClient({
        region: res.locals.region,
        credentials: res.locals.credentials
      });

      const memory: Array<number> = [];
      const invocations: Array<number> = [];
      const duration: Array<number> = [];
      // For each function grab the memory allocated, total invocations, and total duration
      for (const funcName of res.locals.functions) {
        const command = new GetFunctionConfigurationCommand({FunctionName: funcName});
        const response = await client.send(command)
        if (response.MemorySize) {
          memory.push(response.MemorySize)
          if (res.locals.eachFuncMetrics[funcName].invocations.values.length > 0) {
            invocations.push(res.locals.eachFuncMetrics[funcName].invocations.values.reduce((acc: number, curr: number) => acc + curr))
          } else {
            invocations.push(res.locals.eachFuncMetrics[funcName].invocations.values[0])
          }
          if (res.locals.eachFuncMetrics[funcName].duration.values.length > 0) {
            duration.push(res.locals.eachFuncMetrics[funcName].duration.values.reduce((acc: number, curr: number) => acc + curr))
          } else {
            duration.push(res.locals.eachFuncMetrics[funcName].duration.values[0])
          }
        }
      }

      // Store cost related arrays in res.locals
      res.locals.cost = {
        memory,
        invocations,
        duration
      }

      return next();
    } catch (err) {
      return next({
        log: "Error caught in metricsController.getCostProps middleware function",
        status: 500,
        message: { err: "Error grabbing cost for all Lambda Function" }
      })
    }
  }
}
    
// Change to export default syntaix
export default metricsController;