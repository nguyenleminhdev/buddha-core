import type { NodeName } from '../server/database'
import type { Mongodb, Redis, Elasticsearch } from '../database'

export interface DbAuth {
    username?: string
    password?: string
}

/**cài đặt cho một kết nối đến mongo */
export interface MongodbConfig extends NodeName, DbAuth {
    /**tên miền,ip */
    host: string
    /**cổng */
    port: number
    /**tên db */
    name: string
}

/**cài đặt cho một kết nối redis */
export interface RedisConfig extends NodeName, DbAuth {
    /**tên miền, ip */
    host: string
    /**cổng */
    port: number
    /**index của db */
    name: number
}

/**cài đặt cho một kết nối ES */
export interface ElasticsearchConfig extends NodeName, DbAuth {
    /**phương thức */
    protocol: 'http' | 'https'
    /**tên miền,ip */
    host: string
    /**cổng */
    port: number
}

/**các kết nối đến db hiện có */
export interface Database {
    /**kết nối đến mongodb */
    mongodb: Mongodb
    /**kết nối đến redis */
    redis: Redis
    /**kết nối đến ES */
    elasticsearch: Elasticsearch
}