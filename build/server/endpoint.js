"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadDefaultEndpoint = void 0;
const chalk_1 = require("chalk");
/**nạp các xử lý api mặc định */
const loadDefaultEndpoint = (APP, proceed) => {
    // trả về thông báo chào mừng
    APP.get('/', (req, res) => res.ok($env === null || $env === void 0 ? void 0 : $env.app.hello_message));
    // trả về 404
    APP.use((req, res, proceed) => {
        res.err('NOT_FOUND.API', 404, req.path);
    });
    // trả về 500 khi server có lỗi hệ thống
    APP.use(((e, req, res, proceed) => {
        console.log(500, e);
        res.err(e.message || e, 500);
    }));
    console.log((0, chalk_1.green) `✔ Default endpoint loading successfully`);
    proceed();
};
exports.loadDefaultEndpoint = loadDefaultEndpoint;
