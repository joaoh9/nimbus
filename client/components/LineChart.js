"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const chart_js_1 = require("chart.js");
const react_chartjs_2_1 = require("react-chartjs-2");
const LineChart = (props) => {
    // Registers plugins to be applied on all charts
    chart_js_1.Chart.register(chart_js_1.TimeScale, chart_js_1.CategoryScale, chart_js_1.LinearScale, chart_js_1.PointElement, chart_js_1.LineElement, chart_js_1.Title, chart_js_1.Tooltip, chart_js_1.Legend);
    // Set chart data
    const data = {
        datasets: [
            {
                label: props.label,
                data: props.rawData,
                fill: false,
                borderColor: [
                    "#fb9ce5",
                ],
                tension: 0.3,
            },
        ]
    };
    return (react_1.default.createElement(react_chartjs_2_1.Line, { data: data, options: {
            responsive: true,
            maintainAspectRatio: false,
        } }));
};
exports.default = LineChart;
