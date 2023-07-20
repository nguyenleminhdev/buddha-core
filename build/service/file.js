"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.get_file_name = void 0;
/**cắt ra tên tập tin từ path gốc */
const get_file_name = (file_path) => {
    if (!file_path)
        return '';
    return file_path.replace('.ts', '').replace('.js', '');
};
exports.get_file_name = get_file_name;
