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
    // trả về lỗi khi server có lỗi hệ thống
    APP.use(((e, req, res, proceed) => {
        // đã trả về một phần thì không ghi đè được nữa, để express tự đóng kết nối
        if (res.headersSent)
            return proceed(e);
        // giữ lỗi gốc (kèm stack) cho middleware cấp app đọc lại (vd log api),
        // vì res.err bên dưới chỉ nhận message
        res.locals.error = e;
        /**
         * lỗi 4xx mà thư viện chủ động trả cho client (body-parser: json sai
         * định dạng, body quá lớn...) thì giữ đúng mã, còn lại là lỗi hệ thống
         */
        const CODE = (e === null || e === void 0 ? void 0 : e.expose) && e.status && e.status < 500 ? e.status : 500;
        if (CODE === 500)
            console.log(500, e);
        res.err(e.message || e, CODE);
    }));
    console.log((0, chalk_1.green) `✔ Default endpoint loading successfully`);
    proceed();
};
exports.loadDefaultEndpoint = loadDefaultEndpoint;
