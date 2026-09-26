import { status } from "./status.ts";

let count = 0;
const button = document.querySelector<HTMLButtonElement>("#increment")!;
const output = document.querySelector<HTMLElement>("#status")!;

button.addEventListener("click", () => {
  count += 1;
  button.textContent = `Count: ${count}`;
  output.textContent = status(true, count);
});
