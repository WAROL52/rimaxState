import useState from "../useState";
import { insertArrayMethode } from "./insertArrayMethode";
import {
  OnchangeOption,
  RXState,
  TypeFnSet,
  TypeOptionState,
  TypeSet,
} from "./RXState";
import { stateType } from "./stateType";
export function createState<T>(value: T, guard): RXState<T> {
  let currentValueOfState;
  let oldValueOfState;
  let isDestroyed = false;
  let subscriber = 0;
  const ID = Math.random();
  const GUARDS: TypeFnSet<T>[] = [];
  const DESTROY_EVENTS = new Set<() => void>();
  const UPDATE_EVENTS = new Set();
  const ACTIONS = {};
  const dispatchUpdate = (option) => {
    UPDATE_EVENTS.forEach((fn) =>
      // @ts-ignore
      fn(currentValueOfState, oldValueOfState, option)
    );
  };
  const _Object = Object;
  const STATE = new (class _rxs extends RXState<T> {
    get guards() {
      return [...GUARDS];
    }
    get isDestroyed() {
      return isDestroyed;
    }
    get id() {
      return ID;
    }
    get len() {
      return {
        onChange: UPDATE_EVENTS.size,
        onCleanup: DESTROY_EVENTS.size,
        subscriber,
      };
    }
    addGuard(guard) {
      if (!(guard instanceof Function)) return () => undefined;
      const callback: typeof guard = (...a) => guard(...a);
      const lastIndex = GUARDS.push(callback) - 1;
      let isRemoved = false;
      return () => {
        if (isRemoved) return true;
        if (GUARDS[lastIndex] === callback) {
          GUARDS.splice(lastIndex, 1);
          isRemoved = true;
          return true;
        }
        const i = GUARDS.findIndex((fn) => fn === callback);
        if (i > -1) {
          GUARDS.splice(i, 1);
          return true;
        }
        return false;
      };
    }

    clear() {
      DESTROY_EVENTS.forEach((fn) => fn());
      DESTROY_EVENTS.clear();
      UPDATE_EVENTS.clear();
    }
    destroy() {
      if (isDestroyed) return;
      this.clear();
      isDestroyed = true;
    }

    onChange: RXState<T>["onChange"] = ((callback) => {
      if (!(callback instanceof Function))
        throw new Error("callback doit être une fonction");
      const on = {
        dispatch: callback,
        destroy: callback(this.value, this.value, {
          methode: "set",
          value: this.value,
        }),
      };
      const onDispatch = (...arg) => (on.destroy = on.dispatch(...arg));
      let isCalled = false;
      const destroy = (...arg) => {
        if (isCalled) return;
        isCalled = true;
        if (on.destroy instanceof Function) on.destroy(...arg);
        DESTROY_EVENTS.delete(destroy);
        UPDATE_EVENTS.delete(onDispatch);
      };
      UPDATE_EVENTS.add(onDispatch);
      DESTROY_EVENTS.add(destroy);
      return destroy;
    }).bind(null);
    onCleanup = ((callback) => {
      if (!(callback instanceof Function))
        throw new Error("callback doit être une fonction");
      const fn = (...args) => callback(...args);
      DESTROY_EVENTS.add(fn);
      return () => DESTROY_EVENTS.delete(callback);
    }).bind(null);

    get oldValue() {
      return oldValueOfState;
    }

    constructor(value, guard = (v) => v) {
      super();
      _Object.defineProperty(this, "value", {
        get: (() => currentValueOfState).bind(null),
        set: ((value) => this.set(value)).bind(null),
        enumerable: true,
      });
      if (guard && typeof guard == "object") {
        // @ts-ignore
        Object.assign(ACTIONS, guard.actions ?? {});
        // @ts-ignore
        guard = guard.guard ?? ((v) => v);
      }
      if (!(guard instanceof Function))
        throw new Error("guard doit être une fonction");
      currentValueOfState = value;
      GUARDS.push(guard);
      const toValidate = (
        value,
        oldValue = oldValueOfState,
        option: TypeOptionState<T> = {}
      ) => {
        const oldValues: any[] = [];
        return GUARDS.reduceRight((val, guardFn) => {
          oldValues.push(val);
          return guardFn(val, oldValue, option, [...oldValues]);
        }, value);
      };
      if (!(value instanceof Promise)) {
        currentValueOfState = toValidate(value, undefined, {});
      }
      const createStateComputed = (
        callback: (
          state: T,
          oldState: T,
          option: OnchangeOption<T>
        ) => T = () => currentValueOfState,
        dependencies: any[] = [],
        guard = (v) => v
      ) => {
        if (!(callback instanceof Function))
          throw new Error("callback doit être une function");
        if (isDestroyed)
          throw new Error(
            "cette Etat ne peut plus etre utiliser car elle est deja detruit"
          );
        const optDependencies =
          dependencies &&
          !Array.isArray(dependencies) &&
          typeof dependencies == "object"
            ? dependencies
            : {};
        dependencies = Array.isArray(dependencies)
          ? dependencies
          : // @ts-ignore
            optDependencies?.dependencies ?? [];
        if (!Array.isArray(dependencies))
          throw new Error("dependencies doit être une Array");
        const update = (option = {}) =>
          callback(currentValueOfState, oldValueOfState, option);
        const optionState = { guard, ...optDependencies };
        // @ts-ignore
        const [state, setState] = useState(update(), optionState);
        if (optionState.guard !== guard) state.addGuard(guard);
        const states = [this, ...dependencies];
        const listrmv = states.map((st) => {
          if (st instanceof RXState) {
            return st.onChange((_1, _2, option) => {
              setState(update(option));
              return () => !state.isDestroyed && state.destroy(true);
            });
          }
        });
        state.onCleanup(() =>
          listrmv.map((fn) => fn instanceof Function && fn())
        );
        return state;
      };
      this.get = ((callback = () => this.value, dependencies = []) =>
        createStateComputed(callback, dependencies)).bind(null);
      _Object
        .entries(stateType)
        .map(
          ([type, fnGuard]) =>
            (this.get[type] = (
              callback = () => this.value,
              dependencies = []
            ) => createStateComputed(callback, dependencies, fnGuard))
        );
      this.set = ((value, option = { methode: "set", value: value }) => {
        if (isDestroyed)
          throw new Error(
            "cette Etat ne peut plus etre utiliser car elle est deja detruit"
          );
        if (typeof option != "object")
          throw new Error("option doit être un object");
        if (value instanceof Promise) {
          return value.then((v) => this.set(v));
        }
        if (value instanceof RXState) value = value.value;
        if (value instanceof Function)
          value = value(currentValueOfState, oldValueOfState);
        const _oldValue = currentValueOfState;
        if (_oldValue !== value) {
          value = toValidate(value, _oldValue, option);
          oldValueOfState = _oldValue;
          currentValueOfState = value;
          dispatchUpdate(option);
        }
        return currentValueOfState;
      }).bind(null);
      insertArrayMethode(this, { createStateComputed });
      _Object
        .entries(ACTIONS)
        .map(
          ([k, v]) =>
            (this.set[k] = (payload) =>
              this.set(
                v instanceof Function ? v(currentValueOfState, payload) : v
              ))
        );
      if (value instanceof Promise) {
        value.then((v) => this.set(v));
      }
    }
  })(value, guard);
  return Object.freeze(STATE);
}
