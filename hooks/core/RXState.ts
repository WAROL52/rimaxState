import {
  SetStateType,
  GuardCallbackType,
  GetStateType,
  GuardCallbackOptionType,
  OnchangeType,
  OnCleanupType,
  AddGuardType,
} from "./types";

const stateSymbol = Symbol("$$State");
export const isState: (ref: any) => boolean = ((ref: any) =>
  ref instanceof RXState && stateSymbol === ref[".rxType"]).bind(null);

export abstract class RXState<V> extends Array {
  [0]: RXState<V>;
  [1]: SetStateType<V>;
  constructor() {
    super();
  }

  public get isDestroyed(): boolean {
    return false;
  }
  public get id(): number {
    return -1;
  }
  abstract clear(withDom?: false): void;
  abstract destroy(withDom?: true): void;
  abstract onCleanup(
    ...args: Parameters<OnCleanupType<V>>
  ): ReturnType<OnCleanupType<V>>;
  abstract addGuard(
    ...args: Parameters<AddGuardType<V>>
  ): ReturnType<AddGuardType<V>>;
  get: GetStateType<V>;
  set: SetStateType<V>;
  abstract onChange(
    ...args: Parameters<OnchangeType<V>>
  ): ReturnType<OnchangeType<V>>;
  value: V;

  get isArray() {
    return Array.isArray(this.value);
  }
  toString() {
    return String(this.value);
  }
  valueOf() {
    return this.value;
  }
  get [".rxType"]() {
    return stateSymbol;
  }
  static isState = isState;
}
