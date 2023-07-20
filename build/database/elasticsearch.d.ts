import { Client } from 'elasticsearch';
import type { Cb } from '../interface';
/**cài đặt kết nối đến ES */
export interface Elasticsearch {
    [index: string]: Client;
}
/**tạo kết nối đến các ES mặc định */
export declare const load_default_elasticsearch_connect: (proceed: Cb) => void;
