import type { Express } from 'express';
import type { Cb } from '../interface';
/**khởi chạy server */
export declare const loadServer: (APP: Express, proceed: Cb) => void;
