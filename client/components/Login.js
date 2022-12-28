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
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const Login = ({ swapAuthView, handleUserLogin }) => {
    // const [username, setUsername] = useState("");
    const [email, setEmail] = (0, react_1.useState)("");
    const [password, setPassword] = (0, react_1.useState)("");
    const [errorMessage, setErrorMessage] = (0, react_1.useState)("");
    // Update state when user types email or password
    const updateEmail = (e) => {
        setEmail(e.target.value);
    };
    const updatePassword = (e) => {
        setPassword(e.target.value);
    };
    // Hnadle wrong user input
    const handleError = (err) => {
        setErrorMessage(err);
    };
    const submitForm = (e) => {
        e.preventDefault();
        const credentials = {
            email,
            password
        };
        console.log(credentials);
        fetch('/login', {
            method: 'POST',
            headers: { 'Content-Type': 'Application/JSON' },
            body: JSON.stringify(credentials),
        })
            .then(res => res.json())
            .then((result) => {
            if (result.err) {
                handleError('Wrong username or password');
            }
            else {
                console.log('user info:', result);
                handleUserLogin();
                localStorage.setItem("accessToken", result.accessToken);
                localStorage.setItem("refreshToken", result.refreshToken);
            }
        });
    };
    return (react_1.default.createElement("div", { className: "hero-content flex-col lg:flex-row-reverse px-12" },
        react_1.default.createElement("div", { className: "text-center lg:text-left lg:ml-5" },
            react_1.default.createElement("h1", { className: "text-5xl font-bold" }, "Login now!"),
            react_1.default.createElement("p", { className: "py-6" }, "Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda excepturi exercitationem quasi. In deleniti eaque aut repudiandae et a id nisi.")),
        react_1.default.createElement("div", { className: "card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100" },
            react_1.default.createElement("div", { className: "card-body" },
                react_1.default.createElement("form", { onSubmit: submitForm },
                    react_1.default.createElement("div", { className: "form-control" },
                        react_1.default.createElement("label", { htmlFor: "email", className: "label" },
                            react_1.default.createElement("span", { className: "label-text" }, "Email")),
                        react_1.default.createElement("input", { type: "text", id: "email", name: "email", onChange: updateEmail, className: "input input-bordered" })),
                    react_1.default.createElement("div", { className: "form-control" },
                        react_1.default.createElement("label", { htmlFor: "password", className: "label" },
                            react_1.default.createElement("span", { className: "label-text" }, "Password")),
                        react_1.default.createElement("input", { type: "password", id: "password", name: "password", onChange: updatePassword, className: "input input-bordered" })),
                    react_1.default.createElement("div", { className: "form-control" },
                        react_1.default.createElement("input", { type: "submit", value: "Submit", className: "btn btn-primary mt-5" }))),
                react_1.default.createElement("div", { className: "errorMessage" }, errorMessage),
                react_1.default.createElement("button", { className: "btn btn-outline btn-secondary", onClick: swapAuthView }, "Register")))));
};
exports.default = Login;
