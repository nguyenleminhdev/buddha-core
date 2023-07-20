"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadMiddleware = void 0;
const body_parser_1 = require("body-parser");
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const chalk_1 = require("chalk");
const lodash_1 = require("lodash");
/**nạp các cài đặt của express */
const loadMiddleware = (APP, proceed) => {
    var _a, _b, _c, _d;
    // load cors nếu có cài đặt
    if ((0, lodash_1.size)($env === null || $env === void 0 ? void 0 : $env.cors))
        APP.use((0, cors_1.default)($env === null || $env === void 0 ? void 0 : $env.cors));
    // nếu không thì không check cors
    else
        APP.use((0, cors_1.default)());
    // bật log api nếu có cài đặt
    if (((_a = $env === null || $env === void 0 ? void 0 : $env.app) === null || _a === void 0 ? void 0 : _a.log_level) !== 'none')
        APP.use((0, morgan_1.default)((_b = $env === null || $env === void 0 ? void 0 : $env.app) === null || _b === void 0 ? void 0 : _b.log_level));
    // giới hạn kích thước tối đa body có thể truyền lên
    APP.use((0, body_parser_1.json)({ limit: (_c = $env === null || $env === void 0 ? void 0 : $env.app) === null || _c === void 0 ? void 0 : _c.max_body_size }));
    // giải mã body truyền lên thành object
    APP.use((0, body_parser_1.urlencoded)({ limit: (_d = $env === null || $env === void 0 ? void 0 : $env.app) === null || _d === void 0 ? void 0 : _d.max_body_size, extended: true }));
    APP.use((req, res, next) => {
        // gán giá trị i18n từ api
        req.locale = req.headers.locale;
        // cho phép tất cả origin có thể gọi api
        res.setHeader('Access-Control-Allow-Origin', '*');
        next();
    });
    console.log((0, chalk_1.green) `✔ Cors, body-parser, morgan loading successfully`);
    proceed();
};
exports.loadMiddleware = loadMiddleware;
