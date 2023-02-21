"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const LineChart_1 = __importDefault(require("./LineChart"));
// Display the metrics for the selected API
const ApiMetrics = ({ selectedApi, apiMetrics }) => {
    const [message, setMessage] = (0, react_1.useState)('fetching data...');
    // If data not found, set message
    if (apiMetrics === undefined) {
        if (message !== 'data not found') {
            setMessage('data not found');
        }
    }
    // Make chart for each metric for the selected API
    const makeCharts = (selectedApiMetrics) => {
        if (!selectedApiMetrics)
            return;
        // Declare array to store the LineChart elements
        const lineChartElements = [];
        // Loop over each metric 
        for (let metric in selectedApiMetrics) {
            const timeValArr = [];
            const currMetricsObj = selectedApiMetrics[metric];
            // Loop over data points: value and timestamp
            for (let i = currMetricsObj.values.length - 1; i >= 0; i--) {
                const subElement = {
                    y: currMetricsObj.values[i],
                    x: new Date(currMetricsObj.timestamps[i]).toLocaleString([], { year: "2-digit", month: "numeric", day: "numeric" }),
                };
                timeValArr.push(subElement);
                // Get the date of the current iteration
                let date = new Date(currMetricsObj.timestamps[i]);
                // If the next day is less than the next date in our iteration push a value of 0 and the next day into our object
                if ((date.getTime() + 1) < (new Date(currMetricsObj.timestamps[i - 1])).getTime()) {
                    date.setDate(date.getDate() + 1);
                    while (date.getTime() < (new Date(currMetricsObj.timestamps[i - 1])).getTime()) {
                        const subElement = {
                            y: 0,
                            x: new Date(date).toLocaleString([], { year: "2-digit", month: "numeric", day: "numeric" })
                        };
                        timeValArr.push(subElement);
                        date.setDate(date.getDate() + 1);
                    }
                }
            }
            // Add lineChart element to array
            lineChartElements.push(react_1.default.createElement("div", { key: metric, className: "card w-[90%] md:w-[43%] bg-neutral shadow-xl" },
                react_1.default.createElement("div", { className: "card-body" },
                    react_1.default.createElement(LineChart_1.default, { key: `${metric}-chart`, rawData: timeValArr, label: metric }))));
        }
        return lineChartElements;
    };
    let chartElements;
    // Make chart if there is a selected API
    if (selectedApi) {
        chartElements = makeCharts(apiMetrics[selectedApi]);
    }
    return (react_1.default.createElement("div", null,
        react_1.default.createElement("div", { className: 'flex justify-center flex-wrap gap-3 items-start' }, chartElements ? chartElements : message)));
};
exports.default = ApiMetrics;
