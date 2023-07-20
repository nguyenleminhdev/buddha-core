import type { RedisClient } from 'redis';
import type { Cb } from '../interface';
/**cài đặt kết nối đến redis */
export interface Redis {
    [index: string]: RedisClient;
}
/**tạo kết nối đến redis */
export declare const load_default_redis_connect: (proceed: Cb) => void;
