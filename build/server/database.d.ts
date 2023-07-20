import type { Cb } from '../interface';
/**
 * trong trường hợp deploy ở nhiều máy chủ, có khả năng sẽ sử dụng đến db nội bộ
 * của máy, mà không thể được truy cập từ bên ngoài
 * sử dụng cài đặt này để chỉ định node_name nào được phép kết nối, hạn chế việc
 * node kết nối đến một db không tiếp cập được
 */
export interface NodeName {
    /**tên của node */
    node_name?: string | string[];
}
/**kiểm tra kết nối đến db có thoả mãn ở node này hay không */
export declare const check_node_name: (config: NodeName, proceed: Cb) => void;
/**nạp các CSDL vào biến toàn cục */
export declare const loadDatabase: (proceed: Cb) => void;
