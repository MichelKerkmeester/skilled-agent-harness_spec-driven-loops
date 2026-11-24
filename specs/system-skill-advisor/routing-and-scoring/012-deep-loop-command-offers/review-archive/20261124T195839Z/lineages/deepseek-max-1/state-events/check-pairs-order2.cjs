const fs = require("fs");
const s = fs.readFileSync(".skilled/skills/system-skill-advisor/runtime/tests/deep-loop-offer-cases.vitest.ts", "utf8");
const i = s.indexOf("const VOCABULARY_PAIRS");
const j = s.indexOf("\n];", i);
const block = s.slice(i, j);
const rows = [...block.matchAll(/^\s{2}\[\s*['"]([A-Za-z_.]+)['"]/gm)].map((m) => m[1]);
console.log("count", rows.length);
rows.forEach((r, k) => console.log(k + 1, r));
