import type { Express } from 'express';
import type { Cb } from '../interface';
/**nạp các xử lý api mặc định */
export declare const loadDefaultEndpoint: (APP: Express, proceed: Cb) => void;
