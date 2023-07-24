import { readdirSync } from 'fs'
import { join } from 'path'
import { get, keys } from 'lodash'
import { green, blue } from 'chalk'
import { get_file_name } from '../service'

import { Cb, T, I18nSource } from '../interface'

/**trả về dữ liệu i18n */
const t: T = (alias: string, language = 'vn') => {
    /**dữ liệu nguồn của ngôn ngữ được chọn */
    const SOURCE = get($lang.source, language, {})

    // trả về i18n
    return get(SOURCE, alias, alias)
}

/**nạp các phương thức của i18n */
export async function loadLanguage(proceed: Cb) {
    /**đường dẫn đến thư mục chứa source i18n */
    const LANG_PATH = `${$project_dirname}/lang`

    Promise
        .all(
            // nạp toàn bộ các file trong thư mục
            readdirSync(LANG_PATH)
                .map(async file_path => ({
                    name: get_file_name(file_path),
                    data: await import(join(LANG_PATH, file_path))
                }))
        )
        .then(r => {
            /**dữ liệu nguồn của i18n */
            let source: I18nSource<any> = {}

            console.log(green`✔ Language i18n loading successfully`)

            // nạp dữ liệu của các file vào nguồn
            r.map(n => {
                /**dữ liệu nguồn của 1 tập tin */
                const TEMP: I18nSource<any> = {}

                // map lại dữ liệu theo tên của tập tin
                TEMP[n.name] = n.data.default

                // nạp dữ liệu vào nguồn
                source = { ...source, ...TEMP }

                keys(TEMP).map(n => console.log(blue`\t⇨ ${n}`))
            })

            // nap vào cài đặt của i18n
            globalThis.$lang = { source, t }

            proceed()
        })
}