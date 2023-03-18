import useState from "../useState";
import { RXState } from "./RXState";

export function insertArrayMethode(stateInstace, { createStateComputed }) {
  const state = stateInstace;
  const isArray = () => {
    if (!state.isArray)
      throw new Error(
        "pour pouvoir utiliser cette methode le type de state doit être une Array"
      );
  };
  const isFunction = (callback) => {
    if (!(callback instanceof Function))
      throw new Error("callback doit doit être une function");
  };
  const getIndex = (index) => {
    if (index instanceof RXState) {
      index = index.value;
    }
    if (index instanceof Function) {
      index = state.value.findIndex(index);
    }
    if (isNaN(index))
      throw new Error(
        "index doit être une nombre ou une fonction qui retourne un nombre"
      );
    return index;
  };
  state.get.map = (callback) => {
    isFunction(callback);
    const createState = (v, i) => [useState(v)[0], useState(i)[0]];
    const rendMap = (v) => callback(...v, state);
    const listState = state.value.map(createState);
    let listElement = listState.map(rendMap);
    const [items, setItems] = useState(listElement);
    const update = () =>
      listState.map(([v, i], index) => {
        if (!i.isDestroyed) i.set(index);
        if (!v.isDestroyed) v.set(state.value[index]);
      });
    state.onChange((val) => {
      if (listState.length > val.length) {
        const indexStart = val.length;
        const end = listState.length;
        listState
          .splice(indexStart, end)
          .map((s) => s.map((i) => i.destroy(true)));
        setItems.splice(indexStart, end);
      } else if (listState.length < val.length) {
        const indexStart = listState.length;
        listState.push(...val.slice(indexStart).map(createState));
        listState.map(([, index], i) => index.set(i));
        setItems.push(...listState.slice(indexStart).map(rendMap));
      }
      update();
      // console.log(items.value);
    });
    return items;
  };
  state.get.callback = (callback) => {
    if (!(callback instanceof Function))
      throw new Error("callback doit être une function");
    return state.get(() => callback);
  };
  const action = (args, action) => {
    isArray();
    if (state.value[action] instanceof Function) {
      const returnValue = state.value[action](...args);
      return state.set([...state.value], {
        methode: "set",
        action,
        args,
        returnValue,
      });
    }
  };
  // TODO: state.set.remove
  // TODO: state.set.removeItem
  // TODO: state.set.editItem
  state.set.splice = (...args) => action([...args], "splice");
  state.set.remove = (start, deleteCount = 1) => {
    const returnValue = state.value.splice(start, deleteCount);
    return state.set([...state.value], {
      methode: "set",
      action: "remove",
      args: [start, deleteCount],
      returnValue,
    });
  };
  state.set.edit = (index, value) => {
    isArray();
    index = getIndex(index);
    if (index > -1) {
      if (value instanceof Function) {
        value = value(state.value[index], index, state.value);
      }
      const returnValue = state.value.splice(index, 1, value);
      return state.set([...state.value], {
        methode: "set",
        action: "edit",
        args: [index, value],
        returnValue,
      });
    }
  };
  state.set.push = (...items) => action([...items], "push");
  state.set.pop = () => action([], "pop");
  state.set.shift = () => action([], "shift");
  state.set.unshift = (...items) => action([...items], "shift");
  state.set.reverse = () => action([], "reverse");
  state.set.fill = (...items) => action([...items], "fill");
  state.set.filter = (predicate, ...args) => {
    isArray();
    isFunction(predicate);
    const returnValue = state.value.filter(predicate, ...args);
    return state.set(returnValue, {
      methode: "set",
      action: "filter",
      args: [predicate, ...args],
      returnValue,
    });
  };
  state.set.slice = (...args) => {
    isArray();
    const returnValue = state.value.slice(...args);
    return state.set(returnValue, {
      methode: "set",
      action: "slice",
      args,
      returnValue,
    });
  };
  state.set.sort = (compareFn = (a, b) => b - a) => {
    isArray();
    isFunction(compareFn);
    const oldValue = state.value.slice();
    const returnValue = state.value.sort(compareFn);
    if (returnValue.every((item, index) => item === oldValue[index]))
      return state.value;
    return state.set(returnValue, {
      methode: "set",
      action: "sort",
      args: arguments,
      returnValue,
    });
  };
  //   state.set.map = (callbackfn, thisArg = state.value) => {
  //     isArray();
  //     isFunction(callbackfn);
  //     const returnValue = state.value.map(callbackfn, ...args);
  //     return state.set(returnValue, {
  //       methode: "set",
  //       action: "map",
  //       args,
  //       returnValue,
  //     });
  //   };
}
