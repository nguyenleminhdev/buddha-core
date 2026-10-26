"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadMiddleware = void 0;
const fs_1 = require("fs");
const path_1 = require("path");
const body_parser_1 = require("body-parser");
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const chalk_1 = require("chalk");
const lodash_1 = require("lodash");
const service_1 = require("../service");
/**
 * nạp middleware cấp app của dự án ở `helper/global_middleware`
 * - mỗi file export default 1 middleware, nạp theo thứ tự tên file
 * - chạy TRƯỚC cors, body-parser, static và mọi route: dành cho việc cần bao
 *   trọn vòng đời request như đo thời gian, log api, bắt cả lỗi giải mã body
 * - không có thư mục thì bỏ qua, dự án cũ không bị ảnh hưởng
 * - 1 file lỗi khi nạp thì chỉ bỏ file đó (báo ❌ ở bảng trạng thái lúc khởi
 *   động), không chặn các middleware khác và việc khởi động server
 */
const load_global_middleware = (APP) => {
    try {
        /**đường dẫn đến nơi chứa middleware cấp app */
        const PATH = `${$project_dirname}/helper/global_middleware`;
        if (!(0, fs_1.existsSync)(PATH))
            return;
        (0, lodash_1.sortBy)((0, fs_1.readdirSync)(PATH))
            // chỉ nạp file code, bỏ file khai báo kiểu
            .filter(file_path => /\.(js|ts)$/.test(file_path) && !file_path.endsWith('.d.ts'))
            .forEach(file_path => {
            var _a;
            try {
                /**middleware export default của file */
                const MIDDLEWARE = (_a = require((0, path_1.join)(PATH, file_path))) === null || _a === void 0 ? void 0 : _a.default;
                if (MIDDLEWARE)
                    APP.use(MIDDLEWARE);
            }
            catch (e) {
                (0, service_1.add_log)({
                    type: 'middleware',
                    name: (0, service_1.get_file_name)(file_path),
                    address: (e === null || e === void 0 ? void 0 : e.message) || String(e),
                    status: '❌',
                });
            }
        });
    }
    catch (e) {
        // không đọc được thư mục (vd trùng tên với 1 file) thì bỏ cả nhóm, server vẫn khởi động
        (0, service_1.add_log)({
            type: 'middleware',
            name: 'global_middleware',
            address: (e === null || e === void 0 ? void 0 : e.message) || String(e),
            status: '❌',
        });
    }
};
/**nạp các cài đặt của express */
const loadMiddleware = (APP, proceed) => {
    var _a, _b, _c, _d;
    // nạp middleware cấp app của dự án đầu tiên để bao trọn vòng đời request
    load_global_middleware(APP);
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
