import type { Express } from 'express';
import type { Cb } from '../interface';
/**nạp toàn bộ các xử lý api vào router */
export declare const loadRouter: (APP: Express, proceed: Cb) => void;
