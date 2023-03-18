import { useState } from "./hooks/indexHooks";
const el = document.createElement("h1");
const count = useState(0);
document.body.appendChild(el);
count.onChange((c) => {
  el.innerHTML = String(c);
});
setInterval(() => {
  count.set(count.value + 1);
}, 100);
console.log(count);
