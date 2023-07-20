"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.add_log = void 0;
const lodash_1 = require("lodash");
/**thêm log vào danh sách */
const add_log = (item) => {
    // nếu chưa có phần từ nào thì tạo mới array
    if (!(0, lodash_1.size)(globalThis.$logging))
        globalThis.$logging = [item];
    // nếu đã tồn tại thì push thêm
    else
        globalThis.$logging.push(item);
};
exports.add_log = add_log;
