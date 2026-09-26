// Keeps plugin/hooks/compaction/ identical to src/vendor/compaction/ (the plugin must be self-contained).
import { copyFileSync, readdirSync, readFileSync } from "node:fs";
const src = "src/vendor/compaction";
const dst = "plugin/hooks/compaction";
const check = process.argv.includes("--check");
let drift = 0;
for (const f of readdirSync(src).filter((n) => n.endsWith(".ts"))) {
  const a = readFileSync(`${src}/${f}`, "utf8");
  let b = "";
  try { b = readFileSync(`${dst}/${f}`, "utf8"); } catch {}
  if (a !== b) {
    drift++;
    if (check) console.error(`out of sync: ${dst}/${f}`);
    else copyFileSync(`${src}/${f}`, `${dst}/${f}`);
  }
}
if (check && drift) { console.error(`run: npm run sync:hooks`); process.exit(1); }
console.log(check ? "plugin hooks in sync" : `synced ${drift} file(s)`);
