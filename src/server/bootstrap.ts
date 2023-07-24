import { readdirSync } from 'fs'
import { join } from 'path'
import { isArray } from 'lodash'
import { green, blue } from 'chalk'

import type { Cb } from '../interface'

/**chỉ load code bên trong khi node thoả mãn */
export const check_node_valid = (
    /**tên của node */
    name: string | string[],
    /**callback */
    proceed: Function
) => {
    // nếu không có node name thì cho qua
    if (!process.env.NODE_NAME) return proceed()
    // nếu node name khớp thì cho qua
    if (process.env.NODE_NAME === name) return proceed()
    // nếu node name khớp thì cho qua
    if (isArray(name) && name.includes(process.env.NODE_NAME)) return proceed()

    return
}

/**nạp các code xử lý khi hệ thống khởi động */
export const loadBootstrap = (proceed: Cb) => {
    /**đường dẫn đến code */
    const PATH = `${$project_dirname}/helper/bootstrap`

    Promise
        .all(readdirSync(PATH).map(async r => {
            // nạp toàn bộ code
            await import(join(PATH, r))

            return r
        }))
        .then(r => {
            console.log(green`✔ Bootstrap loading successfully`)

            console.log(blue`\t⇨ ${r}`)

            proceed()
        })
        .catch(e => proceed())
}