import { RXState } from "./RXState";

export interface OnchangeOptionType<TypeState> {
  methode?: string;
  value?: TypeState | any;
}

export interface GuardCallbackOptionType<T> {
  methode?: string;
  value?: T;
  history?: T[];
}
export type GuardCallbackType<T> = (
  newValue: T,
  oldValue: T,
  option: GuardCallbackOptionType<T>
) => T;
// ---------------------------------------------

export type SetStateType<TypeState = any> = {
  (
    value:
      | ((
          state: TypeState,
          oldState: TypeState,
          option: OnchangeOptionType<TypeState>
        ) => TypeState)
      | TypeState
  ): void;
};

export type GetStateType<TypeState = any> = {
  <ReturnType = TypeState>(
    callback?: (state: TypeState) => ReturnType,
    dependencyList?: RXState<any>[]
  ): RXState<ReturnType>;
};
export type OnchangeType<TypeState = any> = (
  callback: (
    newValue: TypeState,
    oldValue: TypeState,
    option: GuardCallbackOptionType<TypeState>
  ) => (() => void) | void
) => () => void;

export type OnCleanupType<TypeState = any> = (
  callback: (isWillDestroyed: boolean) => void
) => void;
export type AddGuardType<TypeState = any> = (
  callback: GuardCallbackType<TypeState>
) => void;
