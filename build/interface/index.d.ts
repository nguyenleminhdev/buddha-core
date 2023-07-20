import type { Request, Response, NextFunction } from 'express';
import type { NodeName } from '../server/database';
import type { Mongodb, Redis, Elasticsearch } from '../database';
/**hàm callback cơ bản, trả về lỗi và kết quả */
export interface Cb {
    (error?: any, result?: any): void;
}
/**hàm callback chỉ trả về lỗi nếu có */
export interface CbError {
    (error?: any): void;
}
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
/**định nghĩa một api */
export type Controller = (req: Request, res: Response) => void;
/**định nghĩa một policy */
export type Middleware = (req: Request, res: Response, proceed: NextFunction) => void;
/**cấu trúc khi cài đặt middleware */
export interface MiddlewareConfig {
    [index: string]: string[];
}
/**cài đặt cho một kết nối đến mongo */
export interface MongodbConfig extends NodeName {
    /**tên miền,ip */
    host: string;
    /**cổng */
    port: number;
    /**tên db */
    name: string;
}
/**cài đặt cho một kết nối redis */
export interface RedisConfig extends NodeName {
    /**tên miền, ip */
    host: string;
    /**cổng */
    port: number;
    /**index của db */
    name: number;
}
/**cài đặt cho một kết nối ES */
export interface ElasticsearchConfig extends NodeName {
    /**phương thức */
    protocol: 'http' | 'https';
    /**tên miền,ip */
    host: string;
    /**cổng */
    port: number;
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
/**hàm trả về dữ liệu cho i18n */
export interface T {
    (
    /**đường dẫn đến i18n */
    alias: string, 
    /**ngôn ngữ được chọn */
    language?: string): string;
}
/**nguồn của i18n */
export interface I18nSource<Item> {
    [index: string]: Item;
}
/**khai báo cho i81n */
export interface Lang<Item> {
    /**nguồn của i18n */
    source: I18nSource<Item>;
    /**phương thức trả về dữ liệu */
    t: T;
}
/**các kết nối đến db hiện có */
export interface Database {
    /**kết nối đến mongodb */
    mongodb: Mongodb;
    /**kết nối đến redis */
    redis: Redis;
    /**kết nối đến ES */
    elasticsearch: Elasticsearch;
}
