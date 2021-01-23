// 转化为数组
export const flattenArr = (arr) => {
  return arr.reduce((map, item) => {
    map[item.id] = item
    return map
  }, {})
}

// 重新转化为对象
export const objToArr = (obj) => {
  return Object.keys(obj).map(key => obj[key])
}
