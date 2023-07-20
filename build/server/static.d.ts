import type { Cb } from '../interface';
import type { Express } from 'express';
/**cài đặt server phục vụ static cho các file */
export declare const loadStatic: (APP: Express, proceed: Cb) => void;
