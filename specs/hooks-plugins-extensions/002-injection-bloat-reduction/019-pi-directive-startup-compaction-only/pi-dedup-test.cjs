// Reproduce the exact decidePiDirectiveDelivery logic from prompt-advisor.ts
const SEP = "\nDirectives:";
function splitPiDirectiveBrief(context) {
  const index = context.indexOf(SEP);
  if (index <= 0) return null;
  return { head: context.slice(0, index), directives: context.slice(index) };
}
function makeDecider() {
  const map = new Map(); // the in-memory store, PERSISTENT within one process
  return function decide(context, key) {
    if (!key) return { suppressed: false, why: "no session key" };
    const parts = splitPiDirectiveBrief(context);
    if (!parts || !parts.head.trim()) return { suppressed: false, why: "no head / directives-only -> splitPiDirectiveBrief null" };
    if (map.get(key) === parts.directives) return { suppressed: true, why: "same directives repeat" };
    map.set(key, parts.directives);
    return { suppressed: false, why: "first delivery for this session (recorded)" };
  };
}

const DIRECTIVES = "\nDirectives:\n- Comment hygiene [HARD BLOCK]: ...\n- Governor: ...\n- Proof over appearance: ...";
const HEAD = "Advisor: live; use sk-git 0.86/0.12 pass.";

console.log("=== CASE A: brief HAS a head (Advisor: line + Directives:), persistent store, same session ===");
let dA = makeDecider();
for (let t = 1; t <= 3; t++) {
  const ctx = HEAD + DIRECTIVES;
  const r = dA(ctx, "sess-1");
  console.log(`  turn ${t}: suppressed=${r.suppressed}  (${r.why})`);
}
console.log("");
console.log("=== CASE B: brief is DIRECTIVES-ONLY (no Advisor head) — the fallback ===");
let dB = makeDecider();
for (let t = 1; t <= 3; t++) {
  const ctx = DIRECTIVES.replace(/^\n/, ""); // starts with "Directives:"
  const r = dB(ctx, "sess-1");
  console.log(`  turn ${t}: suppressed=${r.suppressed}  (${r.why})`);
}
console.log("");
console.log("=== CASE C: brief has head BUT store is FRESH each turn (per-process, no persistence) ===");
for (let t = 1; t <= 3; t++) {
  const d = makeDecider(); // fresh store each turn = simulates non-persistent process
  const r = d(HEAD + DIRECTIVES, "sess-1");
  console.log(`  turn ${t}: suppressed=${r.suppressed}  (${r.why})`);
}
