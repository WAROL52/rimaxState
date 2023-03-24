import { createState } from "./core/createState";
import { RXState, isState } from "./core/RXState";
import { stateType } from "./core/stateType";
import { GuardCallbackType } from "./core/types";
export { RXState } from "./core/RXState";
const guardFn = (v) => v;
type HandlerReducer<V, A> = {
  [P in keyof A]: (currentState: V, payload: any) => V;
};
type PickTypeRXState<T> = T extends RXState<infer U> ? U : T;
export type StateHandler<T> = {
  guard?: GuardCallbackType<T>[];
  reducer?: {};
};

const useState = <T = any>(value?: T, handler?: StateHandler<T>) => {
  const state = createState(value as T, handler);
  return state;
};

Object.entries(stateType).map(
  ([type, guard]) => (useState[type] = (value) => useState(value))
);
useState.isState = isState;
export default useState;
