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

// 获取父节点的方法
export const getParentNode = (node, parentClassName) => {
  let current = node
  while(current !== null){
    // 判断当前节点上是否包含parentClassName
    if(current.classList.contains(parentClassName)){
      // 如果包括，则直接返回
      return current
    }
    // 如果不包括，则继续上浮一层
    current = current.parentNode
  }
  // 如果最后都没有找到
  return false
}
