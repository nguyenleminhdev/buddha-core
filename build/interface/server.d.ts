import type { Request, Response, NextFunction } from 'express';
/**định nghĩa một api */
export type Controller = (req: Request, res: Response) => void;
/**định nghĩa một policy */
export type Middleware = (req: Request, res: Response, proceed: NextFunction) => void;
/**cấu trúc khi cài đặt middleware */
export interface MiddlewareConfig {
    [index: string]: string[];
}
/**kiểu dữ liệu của 1 xử lý event tiến trình */
export type ProcessInfo = (
/**dữ liệu đầu vào của event */
p: any, 
/**
 * bắt buộc phải gọi callback khi kết thúc event, nếu không task sẽ chạy
 * mãi mãi gây đầy bộ nhớ
 */
done: Function) => void;
/**dữ liệu của một phần tử log kết nối */
export interface LogItemInfo {
    /**loại kết nối */
    type: string;
    /**tên của kết nối */
    name: string;
    /**địa chỉ của kết nối */
    address: string;
    /**trạng thái của kết nối */
    status?: string;
}
