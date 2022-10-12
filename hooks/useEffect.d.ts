import { RXState } from "./indexHooks"

export declare function useEffect<T extends RXState>(
    callback: (
        valuesOfState: (T extends RXState<infer U> ? U : T)[],
        index: number,
    ) => ((
        valuesOfState: (T extends RXState<infer U> ? U : T)[],
        index: number,
    ) => void) | void,
    states?: T[]
): () => void