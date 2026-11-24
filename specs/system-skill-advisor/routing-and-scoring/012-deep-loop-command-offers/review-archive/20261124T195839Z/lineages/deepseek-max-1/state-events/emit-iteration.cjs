// Writes one iteration's single-record event file and its write-once delta from a payload JSON.
const fs = require("fs");
const L = "specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/review/lineages/deepseek-max-1";
const payloadPath = process.argv[2];
const payload = JSON.parse(fs.readFileSync(payloadPath, "utf8"));
const n = payload.record.iteration;
const pad = String(n).padStart(3, "0");
fs.writeFileSync(`${L}/state-events/iter-${pad}-record.json`, JSON.stringify(payload.record));
fs.writeFileSync(`${L}/deltas/iter-${pad}.jsonl`, payload.rows.map((r) => JSON.stringify(r)).join("\n") + "\n");
console.log("iteration", n, "delta rows", payload.rows.length);
