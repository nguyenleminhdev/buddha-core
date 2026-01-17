import { readdirSync, lstat } from 'fs'
import { eachOfLimit, waterfall } from 'async'
import { join, posix } from 'path'
import { keyBy, get, isArray } from 'lodash'
import { green, blue } from 'chalk'
import { get_file_name } from '../service'
import express from 'express'

import type { Express, Router } from 'express'
import type {
  Cb,
  CbError,
  Controller,
  Middleware,
  MiddlewareConfig,
} from '../interface'

/**dữ liệu đường dẫn của một tập tin */
interface PathData {
  /**đường dẫn chính xác */
  full_path: string
  /**đường dẫn cơ bản */
  path: string
}

/**code xử lý của một api */
interface SourceItem {
  [index: string]: Controller
}

/**code xử lý trong một tập tin */
interface SourceData extends PathData {
  /**dạng export const */
  source: SourceItem
  /**dạng export default */
  default: SourceItem
}

/**dữ liệu của một controller */
interface ControllerData {
  path: string
  controller: Controller | Array<Controller | Middleware>
}

/**đọc toàn bộ tên file của folder */
const get_all_file_name_folder = (root_path: string, proceed: Cb) => {
  const DATA: PathData[] = []

  /**đệ quy đọc toàn bộ tên file của folder */
  const recursive = (path: string, proceed: Cb) =>
    eachOfLimit(
      // đọc tên file của folder hiện tại
      readdirSync(path),
      20,
      (name, i, next) => {
        /**đường dẫn đến file hiện tại */
        const CURRENT_PATH = `${path}/${name}`

        // lấy thông tin của tập tin này
        lstat(CURRENT_PATH, (e, r) => {
          if (e) return next(e)

          // nếu là folder thì đệ quy để lấy toàn bộ dự liệu cần thiết bên trong
          if (r.isDirectory()) return recursive(CURRENT_PATH, next)

          DATA.push({
            full_path: CURRENT_PATH,
            // xoá bỏ các dữ liệu thừa để lấy path
            path: CURRENT_PATH.replace(root_path, '')
              .replace('.ts', '')
              .replace('.js', '')
              .replace(/index/g, ''),
          })

          next()
        })
      },
      proceed
    )

  // bắt đầu chạy
  recursive(root_path, e => (e ? proceed(e) : proceed(null, DATA)))
}

/**nạp các middleware vào router */
const load_middleware = (ROUTER: Router, proceed: Cb) => {
  /**đường dẫn đến nơi chứa middleware */
  const PATH = `${$project_dirname}/api/middleware`

  const DATA: {
    config_middleware: MiddlewareConfig
    /**danh sách các middleware */
    list_middleware: {
      [index: string]: {
        /**tên middleware */
        name: string
        /**code của middleware */
        source: { default: Middleware }
      }
    }
  } = {
    config_middleware: {},
    list_middleware: {},
  }
  waterfall(
    [
      // * đọc code của middleware
      (cb: CbError) =>
        Promise.all(
          readdirSync(PATH).map(async n => {
            return {
              name: get_file_name(n),
              source: await import(join(PATH, n)),
            }
          })
        ).then(n => {
          DATA.list_middleware = keyBy(n, 'name')

          cb()
        }),
      // * đọc cấu hình
      (cb: CbError) => {
        import(`${$project_dirname}/config/middleware`).then(r => {
          DATA.config_middleware = r?.default

          cb()
        })
      },
      // * thêm middleware vào router
      (cb: CbError) => {
        console.log(green`✔ Middleware loading successfully`)

        eachOfLimit(
          DATA.config_middleware,
          20,
          (v, k, next) => {
            /**code của middleware */
            const LIST_HANDLE = v
              .map(n => get(DATA.list_middleware, [n, 'source', 'default']))
              .filter(n => n)

            if (!LIST_HANDLE.length) return next()

            // thêm vào router
            ROUTER.use(posix.join('/', k as string), ...LIST_HANDLE)

            console.log(blue`\t⇨ ${v.join(' >> ')} >> ${k}`)

            next()
          },
          cb
        )
      },
    ],
    proceed
  )
}

/**xử lý code thành dạng chuẩn */
const handle_controller = (path: string, source: SourceItem, proceed: Cb) => {
  const DATA: {
    controller_list: ControllerData[]
  } = {
    controller_list: [],
  }
  eachOfLimit(
    source,
    20,
    (controller, name, next) => {
      DATA.controller_list.push({
        path: posix.join(path, (name as string).replace(/index/g, '')),
        controller,
      })

      next()
    },
    e => (e ? proceed(e) : proceed(null, DATA.controller_list))
  )
}

/**xử lý code ban đầu để nạp vào router */
const handle_controller_list = (input: SourceData, proceed: Cb) => {
  const DATA: {
    controller_list: ControllerData[]
  } = {
    controller_list: [],
  }
  waterfall(
    [
      // * export const
      (cb: CbError) =>
        handle_controller(
          input.path,
          input.source,
          (e, r: ControllerData[]) => {
            if (e) return cb(e)

            DATA.controller_list = [...DATA.controller_list, ...r]
            cb()
          }
        ),
      // * export default
      (cb: CbError) =>
        handle_controller(
          input.path,
          input.default,
          (e, r: ControllerData[]) => {
            if (e) return cb(e)

            DATA.controller_list = [...DATA.controller_list, ...r]
            cb()
          }
        ),
    ],
    e => (e ? proceed(e) : proceed(null, DATA.controller_list))
  )
}

/**nạp toàn bộ dữ liệu của controller vào làm api */
const load_controller = (ROUTER: Router, proceed: Cb) => {
  const DATA: {
    path_list: PathData[]
    source_list: SourceData[]
    controller_list: ControllerData[]
  } = {
    path_list: [],
    source_list: [],
    controller_list: [],
  }
  waterfall(
    [
      // * đọc tên của toàn bộ các file trong controller
      (cb: CbError) =>
        get_all_file_name_folder(
          `${$project_dirname}/api/controller`,
          (e, r) => {
            if (e) return cb(e)

            DATA.path_list = r
            cb()
          }
        ),
      // * import code của các file đã đọc được
      (cb: CbError) =>
        Promise.all(
          DATA.path_list.map(async file => {
            /**code các api của file này */
            const SOURCE = await import(file.full_path)
            /**code dạng default của file */
            const DEFAULT = SOURCE.default || {}

            // loại bỏ code default trong source gốc
            delete SOURCE.default

            // thêm code đọc được vào đường dẫn
            return { ...file, ...{ source: SOURCE, default: DEFAULT } }
          })
        ).then(r => {
          DATA.source_list = r
          cb()
        }),
      // * xử lý code để nạp vào router
      (cb: CbError) => {
        console.log(green`✔ Api loading successfully`)

        // * xử lý source
        eachOfLimit(
          DATA.source_list,
          20,
          (source_data, i, next) =>
            handle_controller_list(source_data, (e, r: ControllerData[]) => {
              if (e) return next(e)

              DATA.controller_list = [...DATA.controller_list, ...r]

              r.map(n => console.log(blue`\t⇨ ${n.path}`))

              next()
            }),
          cb
        )
      },
      // * nạp code vào router
      (cb: CbError) =>
        eachOfLimit(
          DATA.controller_list,
          20,
          (n, i, next) => {
            if (isArray(n.controller)) ROUTER.all(n.path, ...n.controller)
            else ROUTER.all(n.path, n.controller)

            next()
          },
          cb
        ),
    ],
    proceed
  )
}

/**nạp toàn bộ các xử lý api vào router */
export const loadRouter = (APP: Express, proceed: Cb) => {
  /**khởi tạo đối tượng router */
  const ROUTER = express.Router()

  waterfall(
    [
      // * nạp toàn bộ các middleware
      (cb: CbError) => load_middleware(ROUTER, cb),
      // * nạp toàn bộ các controller
      (cb: CbError) => load_controller(ROUTER, cb),
      // * nạp prefix cho router
      (cb: CbError) => {
        APP.use(`/${$env?.app?.prefix}`, ROUTER)

        cb()
      },
    ],
    proceed
  )
}
