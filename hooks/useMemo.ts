import useState, { RXState } from "./useState";

export function useMemo<T>(callback: () => T, states: any[] = []): RXState<T> {
  if (!Array.isArray(states)) throw new Error("states doit être une Array");
  const listRmv: (() => void)[] = [];
  const [state, setState] = useState();
  const array = [...states];
  const update = () => setState(callback());
  array.forEach((st, i) => {
    if (st instanceof RXState) {
      listRmv.push(st.onChange(() => update()));
    }
  });
  update();
  state.onCleanup(() => listRmv.splice(0, listRmv.length).map((fn) => fn?.()));
  return state;
}
