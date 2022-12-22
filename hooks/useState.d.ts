interface OnchangeOption<TypeState> {
    methode?: string;
    value?: TypeState | any
}
type TypeSet<TypeState> = {
    (value: ((state: TypeState, oldState: TypeState, option: OnchangeOption<TypeState>) => TypeState) | TypeState): void
}

type GetNumber<T extends number>={}
type GetAny<T extends any>={}
type InferGet<T>=T extends number?GetNumber<T>:GetAny<T>

type TypeGet<TypeState> = {
    <ReturnType=TypeState>(
        callback?: (state: TypeState) => ReturnType, 
        dependencyList?: RXState<any>[]
        ): ReturnType extends RXState<infer T> ? RXState<T> : RXState<ReturnType>
}&InferGet<TypeState>

type PickTypeOfArray<T extends Array<any>> = T extends Array<infer U> ? RXState<U> : never

export declare class RXState<TypeState= any> {
    constructor(value: TypeState)
    static isState:(target:any)=>boolean
    get value(): TypeState
    set value(value: TypeState)
    get isDestroyed(): boolean
    get id():number
    clear(withDom?: false): void
    destroy(withDom?: true): void
    toString(): string
    valueOf(): TypeState
    onCleanup(callback: (state?: TypeState, oldState?: TypeState, option?: OnchangeOption<TypeState>) => (((state?: TypeState) => void) | void), directApply?: false): (...data: any[]) => void
    onChange(callback: (state?: TypeState, oldState?: TypeState, option?: OnchangeOption<TypeState>) => (((state?: TypeState) => void) | void), directApply?: false): (...data: any[]) => void
    onChange<T extends RXState>(
        state: T, 
        callback?: (
            state?: TypeState, 
            oldState?: TypeState, 
            option?: OnchangeOption<TypeState>
            ) => T extends RXState<infer U>?U:never): (...data: any[]) => void
    get: TypeGet<TypeState>
    set: TypeSet<TypeState>
    get isArray(): boolean
    getMap: TypeState extends Array<any> ?
        <T>(callbackfn: (item: PickTypeOfArray<TypeState>, indexOfItem: RXState<number>, items: RXState<TypeState>, setItem: TypeSet<TypeState>) => T) => RXState<T[]>
        : never
}
type PickTypeRXState<T> = T extends RXState<infer U> ? U : T

type TypeSetArray<T extends any[]>=TypeSet<T>&{
    push: T["push"]
    pop: T["pop"]
    shift: T["shift"]
    unshift: T["unshift"]
    splice: T["splice"]
    reverse: T["reverse"]
    fill: T["fill"]
    filter: T["filter"]
    slice: T["slice"]
    sort: T["sort"]
    map: T["map"]
    edit(index: number | T["findIndex"], value: T | ((currentValue: T,index:number, oldValue: T) => T)):any
    edits(index: number | T["findIndex"]|number[], value: T | ((currentValue: T,index:number, oldValue: T) => T)):any
    remove(index: number | T["findIndex"],deleteCount?:number):T[]
}
interface TypeOptionState<T> {
    methode: string;
    value: T;
}
type TypeFnSet<T> = (newValue: T, oldValue: T, option: TypeOptionState<T>) => T;
type TypeGet<TypeState> = {
    <ReturnType = TypeState>(callback?: (state: TypeState) => ReturnType, dependencyList?: RXState<any>[]): ReturnType extends RXState<infer T> ? RXState<T> : RXState<ReturnType>;
};
type TypeSet<TypeState, actions> = {
    (value: ((state: TypeState) => TypeState) | TypeState, option?: OnchangeOption<TypeState>): void;
} & actions;
interface OnchangeOption<TypeState> {
    methode?: string;
    value?: TypeState | any;
}
export abstract class RXState<V = any> {
    abstract get isDestroyed(): boolean;
    abstract get id(): number;
    abstract clear(withDom?: false): void;
    abstract destroy(withDom?: true): void;
    abstract onCleanup(callback: (() => void)): () => void;
    abstract onChange<T extends RXState>(state: T, callback?: (state?: V, oldState?: V, option?: OnchangeOption<V>) => T extends RXState<infer U> ? U : never): (...data: any[]) => void;
    get: TypeGet<V>;
    set: TypeSet<V, any>;
    value: V;
    abstract addGuard(guard: TypeFnSet<V>): () => boolean;
    onChanges: (callbackOrState: RXState | ((newValue: V, oldValue: V, option: TypeOptionState<V>) => (() => void) | void), directApply?: boolean | ((newValue: V, oldValue: V, option: TypeOptionState<V>) => V)) => () => void;
    get isArray(): boolean;
    toString(): string;
    valueOf(): V;
    get [".rxType"](): any;
    static isState: <T>(ref: T) => boolean;
}
type HandlerReducer<V, A> = {
    [P in keyof A]: (currentState: V, payload: any) => V;
};
type PickTypeRXState<T> = T extends RXState<infer U> ? U : T;
export const useState: {
    <T, H extends HandlerReducer<T, H>>(value: T, handler?: {
        guard?: TypeFnSet<T>;
        reducer?: H;
    }): [RXState<PickTypeRXState<T>>, any, H];
    isState: <T_1>(ref: T_1) => boolean;
};