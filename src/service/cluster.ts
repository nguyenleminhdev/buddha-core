import cluster from 'cluster'

/**kiểm tra xem node hiện tại có phải là master hay không */
export const is_master_node = () => (
    cluster.isPrimary || 
    process.env.NODE_APP_INSTANCE === '0'
)