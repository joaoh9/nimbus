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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const Function_1 = __importDefault(require("./Function"));
const uuid_1 = require("uuid");
// Component to fetch all functions metrics and display them
const Functions = () => {
    const [funcMetrics, setFuncMetrics] = (0, react_1.useState)({});
    // Grab each functions metrics when the component mounts
    const grabFuncsMetrics = () => __awaiter(void 0, void 0, void 0, function* () {
        let response;
        response = yield fetch('/dashboard/funcmetrics', {
            method: 'GET',
            headers: {
                'Content-Type': 'Application/JSON',
                authorization: `BEARER ${localStorage.getItem('accessToken')}`,
            },
        });
        response = yield response.json();
        setFuncMetrics(response.eachFuncMetrics);
    });
    // Grab functions metrics when the component mounts
    (0, react_1.useEffect)(() => {
        grabFuncsMetrics();
    }, []);
    // Display table head and each function metrics component
    return (react_1.default.createElement("div", { className: "w-[100%] overflow-auto" },
        react_1.default.createElement("table", { className: "table w-[100%] mx-6" },
            react_1.default.createElement("thead", { className: "w-[100%]" },
                react_1.default.createElement("tr", { className: "w-[100%]" },
                    react_1.default.createElement("th", { className: "bg-primary text-center w-[20%]" }, "Lambda Function"),
                    react_1.default.createElement("th", { className: "bg-primary text-center w-[20%]" }, "Invocations"),
                    react_1.default.createElement("th", { className: "bg-primary text-center w-[20%]" }, "Errors"),
                    react_1.default.createElement("th", { className: "bg-primary text-center w-[20%]" }, "Throttles"),
                    react_1.default.createElement("th", { className: "bg-primary text-center w-[20%]" }, "Duration (ms)"))),
            react_1.default.createElement("tbody", { className: "w-[100%]" }, Object.entries(funcMetrics).map((funcMetric) => (react_1.default.createElement(Function_1.default, { key: (0, uuid_1.v4)(), funcName: funcMetric[0], invocations: funcMetric[1].invocations, errors: funcMetric[1].errors, throttles: funcMetric[1].throttles, duration: funcMetric[1].duration })))))));
};
exports.default = Functions;
