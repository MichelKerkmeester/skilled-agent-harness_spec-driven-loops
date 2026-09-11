// Final verification: mirror the fanout-run completion checks against this lineage.
const fs = require("node:fs");
const path = require("node:path");

const L = "/Users/michelkerkmeester/worktrees/public/048-crawlable-commit-history/.opencode/specs/sk-git/028-crawlable-commit-history/007-git-workflow-run-failures/research/lineages/deepseek";
const statePath = path.join(L, "deep-research-state.jsonl");
const records = fs.readFileSync(statePath, "utf8").trim().split("\n").map((line) => JSON.parse(line));

const iterations = records.filter((r) => r.type === "iteration" && Number.isInteger(r.iteration)).map((r) => r.iteration);
const synthesis = records.find((r) => r.type === "event" && ["synthesis_complete", "phase_synthesis_complete", "synthesis"].includes(r.event));
const disk = fs.readdirSync(path.join(L, "iterations")).map((n) => /^iteration-(\d+)\.md$/.exec(n)).filter(Boolean).map((m) => Number.parseInt(m[1], 10)).sort((a, b) => a - b);

console.log("state records:", records.length);
console.log("iteration records:", JSON.stringify(iterations));
console.log("iteration files on disk:", JSON.stringify(disk));
console.log("research.md non-empty:", fs.statSync(path.join(L, "research.md")).size > 0, `(${fs.statSync(path.join(L, "research.md")).size} bytes)`);
console.log("synthesis event:", synthesis ? synthesis.event : "MISSING");
console.log("synthesis stopReason:", synthesis ? synthesis.stopReason : "MISSING");
console.log("stopReason accepted as max-iterations family:", synthesis ? /^maxiteration/i.test(synthesis.stopReason.replace(/[^a-z]/gi, "")) : false);
const expected = [1, 2, 3, 4, 5];
const same = (a) => a.length === 5 && a.every((v, i) => v === expected[i]);
console.log("forced-depth iteration set OK:", same(iterations) && same(disk));
