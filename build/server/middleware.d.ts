import type { Express } from 'express';
import type { Cb } from '../interface';
/**nạp các cài đặt của express */
export declare const loadMiddleware: (APP: Express, proceed: Cb) => void;
