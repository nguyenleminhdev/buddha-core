"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadStatic = void 0;
const express_1 = __importDefault(require("express"));
/**cài đặt server phục vụ static cho các file */
const loadStatic = (APP, proceed) => {
    APP.use(express_1.default.static(
    // nơi folder được phục vụ
    `${process.cwd()}/${$env.app.public_path}`, {
        setHeaders: function setHeaders(res, path, stat) {
            // cho phép tất cả origin gọi được tập tin
            res.header('Access-Control-Allow-Origin', '*');
        }
    }));
    proceed();
};
exports.loadStatic = loadStatic;
