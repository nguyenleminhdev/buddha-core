/**hàm callback cơ bản, trả về lỗi và kết quả */
export interface Cb<Result = any> {
    (error?: any, result?: Result): void;
}
/**hàm callback chỉ trả về lỗi nếu có */
export interface CbError {
    (error?: any): void;
}
