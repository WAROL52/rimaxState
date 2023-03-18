const stateSymbol = Symbol("$$State");
export const isState: (ref: any) => boolean = ((ref: any) =>
  ref instanceof RXState && stateSymbol === ref[".rxType"]).bind(null);

export interface OnchangeOption<TypeState> {
  methode?: string;
  value?: TypeState | any;
}

export type TypeSet<TypeState> = {
  (
    value:
      | ((
          state: TypeState,
          oldState: TypeState,
          option: OnchangeOption<TypeState>
        ) => TypeState)
      | TypeState
  ): void;
};
// type TypeSet<TypeState, actions> = {
//   (
//     value: ((state: TypeState) => TypeState) | TypeState,
//     option?: OnchangeOption<TypeState>
//   ): void;
// } & actions;
type GetNumber<T extends number> = {};
type GetAny<T extends any> = {};
type InferGet<T> = T extends number ? GetNumber<T> : GetAny<T>;

type TypeGet<TypeState> = {
  <ReturnType = TypeState>(
    callback?: (state: TypeState) => ReturnType,
    dependencyList?: RXState<any>[]
  ): ReturnType extends RXState<infer T> ? RXState<T> : RXState<ReturnType>;
} & InferGet<TypeState>;

type PickTypeOfArray<T extends Array<any>> = T extends Array<infer U>
  ? RXState<U>
  : never;

type TypeSetArray<T extends any[]> = TypeSet<T> & {
  push: T["push"];
  pop: T["pop"];
  shift: T["shift"];
  unshift: T["unshift"];
  splice: T["splice"];
  reverse: T["reverse"];
  fill: T["fill"];
  filter: T["filter"];
  slice: T["slice"];
  sort: T["sort"];
  map: T["map"];
  edit(
    index: number | T["findIndex"],
    value: T | ((currentValue: T, index: number, oldValue: T) => T)
  ): any;
  edits(
    index: number | T["findIndex"] | number[],
    value: T | ((currentValue: T, index: number, oldValue: T) => T)
  ): any;
  remove(index: number | T["findIndex"], deleteCount?: number): T[];
};
export interface TypeOptionState<T> {
  methode?: string;
  value?: T;
}
export type TypeFnSet<T> = (
  newValue: T,
  oldValue: T,
  option: TypeOptionState<T>,
  history: T[]
) => T;

export abstract class RXState<V> extends Array {
  [0]: RXState<V>;
  [1]: TypeSet<V>;
  constructor() {
    super();
    this[0] = this;
    this[1] = this.set;
  }
  get length() {
    return 10;
  }
  public get isDestroyed(): boolean {
    return false;
  }
  public get id(): number {
    return -1;
  }
  abstract clear(withDom?: false): void;
  abstract destroy(withDom?: true): void;
  abstract onCleanup(callback: () => void): () => void;
  abstract addGuard(guard: TypeFnSet<V>): () => boolean | undefined;
  get: TypeGet<V>;
  set: TypeSet<V>;
  abstract onChange(
    callback: (
      newValue: V,
      oldValue: V,
      option: TypeOptionState<V>
    ) => (() => void) | void
  ): () => void;
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
