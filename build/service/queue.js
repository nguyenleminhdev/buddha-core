"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Queue = void 0;
const bull_1 = __importDefault(require("bull"));
const lodash_1 = require("lodash");
/**tạo queue cho hệ thống */
class Queue {
    constructor(
    /**tên của queue */
    name, 
    /**đường dẫn kết nối đến db redis */
    redis_config, 
    /**danh sách các code xử lý */
    list_process, 
    /**giới hạn max số task cùng chạy một lúc */
    limit) {
        this.queue = this._init(name, redis_config);
        this._fix_bug();
        this._add_process(list_process, limit);
        this._make_global(name);
    }
    /**khởi tạo queue */
    _init(name, redis_config) {
        return new bull_1.default(name, `redis://${redis_config.host}:${redis_config.port}/${redis_config.name}`, 
        // không chạy lại các task có vấn đề
        { settings: { maxStalledCount: 0 } });
    }
    /**sử dụng một số thủ thuật để fix bug của thư viên bull */
    _fix_bug() {
        // fix lỗi job đã done nhưng vẫn gắn cờ faild
        this.queue.on('failed', (job, e) => job.remove());
    }
    /**thêm các code xử lý cho queue */
    _add_process(list_process, limit) {
        this.queue.process(limit, (job, done) => {
            let { event, payload } = job.data;
            // nếu event không tồn tại thì kết thúc queue
            if (!(0, lodash_1.keys)(list_process).includes(event))
                return done();
            // nạp danh sách các xử lý vào queue
            (0, lodash_1.map)(list_process, (process, process_name) => {
                if (event !== process_name)
                    return;
                process(payload, done);
            });
        });
    }
    /**thêm instant vào biến toàn cục */
    _make_global(name) {
        if (!globalThis.$queue || !(0, lodash_1.size)(globalThis.$queue))
            globalThis.$queue = {};
        globalThis.$queue[name] = this;
    }
    /**truyền dữ liệu vào queue để khởi chạy */
    exec(event, payload, priority) {
        this.queue.add({
            event,
            payload: payload || {}
        }, {
            priority: priority || 1,
            // xoá task khi hoàn thành hay lỗi để giải phóng bộ nhớ
            removeOnComplete: true, removeOnFail: true
        });
    }
}
exports.Queue = Queue;
