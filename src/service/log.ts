import { size } from 'lodash'

import type { LogItemInfo } from '../interface'

/**thêm log vào danh sách */
export const add_log = (item: LogItemInfo) => {
    // nếu chưa có phần từ nào thì tạo mới array
    if (!size(globalThis.$logging)) globalThis.$logging = [item]
    // nếu đã tồn tại thì push thêm
    else globalThis.$logging.push(item)
}