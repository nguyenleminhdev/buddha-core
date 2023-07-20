/**cắt ra tên tập tin từ path gốc */
export const get_file_name = (file_path?: string) => {
    if (!file_path) return ''

    return file_path.replace('.ts', '').replace('.js', '')
}