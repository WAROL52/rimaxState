import { createState } from "./core/createState";
import { RXState, isState, TypeFnSet } from "./core/RXState";
import { stateType } from "./core/stateType";
export { RXState } from "./core/RXState";
const guardFn = (v) => v;
type HandlerReducer<V, A> = {
  [P in keyof A]: (currentState: V, payload: any) => V;
};
type PickTypeRXState<T> = T extends RXState<infer U> ? U : T;
export type StateHandler<T> = {
  guard?: TypeFnSet<T>;
  reducer?: {};
};

const useState = <T>(value: T, handler?: StateHandler<T>) => {
  const state = createState(value, handler);
  return state;
};

Object.entries(stateType).map(
  ([type, guard]) => (useState[type] = (value) => useState(value))
);
useState.isState = isState;
export default useState;
