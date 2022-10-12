import useState, { RXState } from "../../hooks/useState";

test('useState is a function', () => {
    expect(useState).toBeInstanceOf(Function)
});
describe('RXState is a constructor', () => {
    test("is a function",()=>{
        expect(RXState).toBeInstanceOf(Function)
    })
    test("it can create create an instance of RXState",()=>{
        expect(new RXState()).toBeInstanceOf(RXState)
    })
});
describe('useState()', () => {
    const [state,setState]=useState()
    test("return an array",()=>{
        expect(useState()).toBeInstanceOf(Array)
    })
    test("it can create an instance of RXState",()=>{
        expect(new RXState()).toBeInstanceOf(RXState)
    })
});
