const m = await import("/Users/michelkerkmeester/worktrees/public/535-deep-loop-offers-traceability-review/.skilled/skills/system-skill-advisor/runtime/dist/runtime/lib/command-attach.js");
const S = (mode) => ({ action: "route", selectionKind: "single", targets: [{ workflowMode: mode }] });
const R = S("review");
const time = (label, fn) => {
  const t0 = performance.now();
  let out, err = null;
  try { out = fn(); } catch (e) { err = e.message; }
  const ms = performance.now() - t0;
  console.log(label.padEnd(34), (ms.toFixed(1) + "ms").padStart(9), err ? "THREW: " + err : "ok out=" + (out === undefined ? "-" : out));
  return ms;
};
// 1. adversarial shapes
time("empty prompt", () => m.attachCommand("system-deep-loop", R, ""));
time("whitespace only", () => m.attachCommand("system-deep-loop", R, "   \n\t "));
time("regex metachars", () => m.attachCommand("system-deep-loop", R, "deep review (((( ?! [a-z] * * + + ^$|\\"));
time("unicode astral", () => m.attachCommand("system-deep-loop", R, "run a deep review of the 🧪🧪 parser 🎯"));
time("newlines between words", () => m.attachCommand("system-deep-loop", R, "run a\ndeep\nreview\nof the parser"));
// 2. pathological repetition for backtracking
time("10k 'do not ' repeated", () => m.attachCommand("system-deep-loop", R, "do not ".repeat(1600)));
time("10k 'deep review ' repeated", () => m.attachCommand("system-deep-loop", R, "deep review ".repeat(900)));
time("10k 'iterations ' repeated", () => m.attachCommand("system-deep-loop", R, "iterations ".repeat(1000)));
time("10k 'passes of the ' repeated", () => m.attachCommand("system-deep-loop", R, "passes of the ".repeat(700)));
time("10k '-' padding then ask", () => m.attachCommand("system-deep-loop", R, "x ".repeat(5000) + "run a deep review"));
time("100k single token", () => m.attachCommand("system-deep-loop", R, "a".repeat(100000)));
