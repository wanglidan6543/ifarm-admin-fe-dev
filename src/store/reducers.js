const defaultState = {
  count: 0
}

// reducer 可以接收state， 但是绝不能修改state
export default (state = defaultState, action) => {
  return state;
}