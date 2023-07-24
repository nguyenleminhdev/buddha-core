import { readdirSync } from 'fs'
import { join } from 'path'
import { green } from 'chalk'

import type { Cb } from '../interface'

/**nạp các cài đặt dùng chung cho tất cả các môi trường */
export async function loadConstant(proceed: Cb) {
    /**đường dẫn của thư mục cài đặt */
    const CONSTANT_PATH = `${$project_dirname}/config/constant`

    Promise
        .all(
            // nạp tất cả các tập tin trong thư mục
            readdirSync(CONSTANT_PATH)
                .map(file_path => import(join(CONSTANT_PATH, file_path)))
        )
        .then(list_source_constant => {
            /**dữ liệu của các cài đặt chung */
            let constant: any = {}

            // tiến hành gộp dữ liệu
            list_source_constant.map(source_constant => {
                constant = { ...constant, ...source_constant }
            })

            // nạp dữ liệu vào biến toàn cục
            globalThis.$constant = constant

            console.log(green`✔ Constant variable loading successfully`)
            proceed()
        })
}