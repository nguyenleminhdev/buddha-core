import type { RedisConfig, ProcessInfo } from '../interface';
/**danh sách các xử lý sự kiện */
interface ListProcess {
    [index: string]: ProcessInfo;
}
/**tạo queue cho hệ thống */
export declare class Queue {
    private queue;
    constructor(
    /**tên của queue */
    name: string, 
    /**đường dẫn kết nối đến db redis */
    redis_config: RedisConfig, 
    /**danh sách các code xử lý */
    list_process: ListProcess, 
    /**giới hạn max số task cùng chạy một lúc */
    limit: number);
    /**khởi tạo queue */
    private _init;
    /**sử dụng một số thủ thuật để fix bug của thư viên bull */
    private _fix_bug;
    /**thêm các code xử lý cho queue */
    private _add_process;
    /**thêm instant vào biến toàn cục */
    private _make_global;
    /**truyền dữ liệu vào queue để khởi chạy */
    exec(event: string, payload?: any, priority?: number): void;
}
export {};
