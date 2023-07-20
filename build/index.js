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
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.init = void 0;
const express_1 = __importDefault(require("express"));
const async_1 = require("async");
const server_1 = require("./server");
__exportStar(require("./interface"), exports);
__exportStar(require("./service"), exports);
__exportStar(require("./server"), exports);
__exportStar(require("./database"), exports);
/**khởi chạy hệ thống */
const init = () => {
    // khởi tạo đối tượng của server
    const APP = (0, express_1.default)();
    // xoá toàn bộ log trước đó
    console.clear();
    (0, async_1.waterfall)([
        (cb) => (0, server_1.CatchAllServerUnknownError)(cb),
        (cb) => (0, server_1.loadCurrentEnvConfig)(cb),
        (cb) => (0, server_1.loadConstant)(cb),
        (cb) => (0, server_1.loadLanguage)(cb),
        (cb) => (0, server_1.loadDatabase)(cb),
        (cb) => (0, server_1.loadMiddleware)(APP, cb),
        (cb) => (0, server_1.loadStatic)(APP, cb),
        (cb) => (0, server_1.loadCustomRequestResponse)(cb),
        (cb) => (0, server_1.loadRouter)(APP, cb),
        (cb) => (0, server_1.loadBootstrap)(cb),
        (cb) => (0, server_1.loadDefaultEndpoint)(APP, cb),
        (cb) => (0, server_1.loadSocket)(cb),
        (cb) => (0, server_1.loadServer)(APP, cb),
        (cb) => (0, server_1.loadBuddha)(cb),
    ], e => { if (e)
        console.log('START SERVER ERROR::', e); });
};
exports.init = init;
