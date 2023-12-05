"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CatchAllServerUnknownError = void 0;
/**bắt lỗi của hệ thống, làm máy chủ không bị sập */
const CatchAllServerUnknownError = (proceed) => {
    process.on('unhandledRejection', (e) => {
        var _a;
        // nếu là lỗi kết nối của mongo thì bỏ qua
        if ((_a = e === null || e === void 0 ? void 0 : e.stack) === null || _a === void 0 ? void 0 : _a.includes('MongooseServerSelectionError: connect ECONNREFUSED'))
            return;
        console.log('CATCH [unhandledRejection]::', e);
    });
    process.on('uncaughtException', function (e) {
        console.log('CATCH [uncaughtException]::', e);
    });
    proceed();
};
exports.CatchAllServerUnknownError = CatchAllServerUnknownError;
