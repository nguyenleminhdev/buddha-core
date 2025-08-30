import { green } from 'chalk'

import type { Cb } from '../interface'

/**nạp dữ liệu của môi trường hiện tại */
export async function loadCurrentEnvConfig(proceed: Cb) {
    /**giá trị của mội trường hiện tại */
    const NODE_ENV = process.env.NODE_ENV || 'development'

    /**dữ liệu của môi trường hiện tại */
    const ENV: { default: any } = await import(`${$project_dirname}/config/env/${NODE_ENV}`)
        .catch(e => import(`${$project_dirname}/config/env`))

    // nạp dữ liệu môi trường vào biến toàn cục
    globalThis.$env = ENV.default

    console.log(green`✔ Env config loading successfully`)
    proceed()
}