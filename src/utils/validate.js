/**
 * URL地址
 * @param {*} s
 */
export function isURL (s) {
    return /^http[s]?:\/\/.*/.test(s)
  }

  export function isNumeric(value) {
    return !isNaN(parseFloat(value)) && isFinite(value)
  }

  /**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}