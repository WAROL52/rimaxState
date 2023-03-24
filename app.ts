import { useState } from "./hooks/indexHooks";
const el = document.createElement("h1");
const el2 = document.createElement("h1");
const count = useState(0);
document.body.appendChild(el);
document.body.appendChild(el2);
const count2 = count.get((c) => c * 2);
count.onChange((c) => {
  el.innerHTML = String(c);
});
count2.onChange((c) => {
  el2.innerHTML = String(c);
});
setInterval(() => {
  count.set(count.value + 1);
}, 300);
console.log(count);
count2[2] = null;
const statee = useState(count, {
  reducer: {},
});
