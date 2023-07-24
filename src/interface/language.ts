/**hàm trả về dữ liệu cho i18n */
export interface T {
    (
        /**đường dẫn đến i18n */
        alias: string,
        /**ngôn ngữ được chọn */
        language?: string
    ): string
}

/**nguồn của i18n */
export interface I18nSource<Item> {
    [index: string]: Item
}

/**khai báo cho i81n */
export interface Lang<Item> {
    /**nguồn của i18n */
    source: I18nSource<Item>
    /**phương thức trả về dữ liệu */
    t: T
}