"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.init = void 0;
const express_1 = __importDefault(require("express"));
const async_1 = require("async");
const _1 = require("./");
/**
 * khởi chạy hệ thống
 * @param project_dirname đường dẫn của thư mục dự án
 */
const init = (project_dirname, next) => {
    // nạp đường dẫn server
    globalThis.$project_dirname = project_dirname;
    // khởi tạo đối tượng của server
    const APP = (0, express_1.default)();
    // gán vào biến toàn cục
    globalThis.$app = APP;
    // xoá toàn bộ log trước đó
    console.clear();
    (0, async_1.waterfall)([
        (cb) => (0, _1.CatchAllServerUnknownError)(cb),
        (cb) => (0, _1.loadCurrentEnvConfig)(cb),
        (cb) => (0, _1.loadConstant)(cb),
        (cb) => (0, _1.loadLanguage)(cb),
        (cb) => (0, _1.loadDatabase)(cb),
        (cb) => (0, _1.loadMiddleware)(APP, cb),
        (cb) => (0, _1.loadStatic)(APP, cb),
        (cb) => (0, _1.loadCustomRequestResponse)(cb),
        (cb) => (0, _1.loadRouter)(APP, cb),
        (cb) => (0, _1.loadBootstrap)(cb),
        (cb) => (0, _1.loadDefaultEndpoint)(APP, cb),
        (cb) => (0, _1.loadSocket)(cb),
        (cb) => (0, _1.loadServer)(APP, cb),
        (cb) => (0, _1.loadBuddha)(cb),
    ], e => {
        if (e)
            console.log('START SERVER ERROR::', e);
        next === null || next === void 0 ? void 0 : next(e);
    });
};
exports.init = init;
