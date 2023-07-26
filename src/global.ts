/**
 * - khai báo kiểu dữ liệu cho các biến toàn cục
 * - chỉnh sửa kiểu dữ liệu của thư viên
 */

import type { LogItemInfo, Database, Lang } from './interface'
import type { Queue } from './service'

declare global {
    // chỉnh sửa kiểu dữ liệu của thư viện express
    namespace Express {
        // thêm thuộc tính vào request
        interface Request {
            /**custom phương thức cho request */
            [index: string | number]: any

            /**giá trị của i18n được api truyền lên */
            locale: string
        }

        // thêm thuộc tính vào response
        interface Response {
            /**custom phương thức cho response */
            [index: string | number]: any
        }
    }
    /**__dirname của thư mục dự án (không phải của thư viện) */
    var $project_dirname: string
    /**log dữ liệu kết nối của hệ thống */
    var $logging: LogItemInfo[]
    /**giá trị các cài đặt của môi trường hiện tại */
    var $env: any
    /**giá trị các cài đặt các môi trường dùng chung */
    var $constant: any
    /**các cài đặt của i18n */
    var $lang: Lang
    /**các đối tượng dùng để kết nối đến CSDL */
    var $database: Database
    /**các phương thức của hàng đợi */
    var $queue: {
        [index: string]: Queue
    }
}