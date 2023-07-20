import type { Cb } from '../interface';
/**chỉ load code bên trong khi node thoả mãn */
export declare const check_node_valid: (name: string | string[], proceed: Function) => any;
/**nạp các code xử lý khi hệ thống khởi động */
export declare const loadBootstrap: (proceed: Cb) => void;
