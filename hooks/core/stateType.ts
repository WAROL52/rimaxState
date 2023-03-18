export const stateType = {
  array(v) {
    if (!Array.isArray(v))
      throw new Error("cette state doit être de type Array");
    return v;
  },
  number(v) {
    if (typeof v != "number")
      throw new Error("cette state doit être de type Number");
    return v;
  },
  string(v) {
    if (typeof v != "string")
      throw new Error("cette state doit être de type string");
    return v;
  },
  function(v) {
    if (typeof v != "function")
      throw new Error("cette state doit être de type function");
    return v;
  },
  boolean(v) {
    if (typeof v != "boolean")
      throw new Error("cette state doit être de type boolean");
    return v;
  },
  symbol(v) {
    if (typeof v != "symbol")
      throw new Error("cette state doit être de type symbol");
    return v;
  },
  object(v) {
    if (typeof v != "object")
      throw new Error("cette state doit être de type object");
    return v;
  },
};
