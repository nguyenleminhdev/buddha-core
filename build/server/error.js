"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CatchAllServerUnknownError = void 0;
/**bắt lỗi của hệ thống, làm máy chủ không bị sập */
const CatchAllServerUnknownError = (proceed) => {
    process.on('unhandledRejection', (e) => {
        // nếu là lỗi kết nối của mongo thì bỏ qua
        if (e.stack.includes('MongooseServerSelectionError: connect ECONNREFUSED'))
            return;
        console.log('CATCH [unhandledRejection]::', e);
    });
    process.on('uncaughtException', function (e) {
        console.log('CATCH [uncaughtException]::', e);
    });
    proceed();
};
exports.CatchAllServerUnknownError = CatchAllServerUnknownError;
