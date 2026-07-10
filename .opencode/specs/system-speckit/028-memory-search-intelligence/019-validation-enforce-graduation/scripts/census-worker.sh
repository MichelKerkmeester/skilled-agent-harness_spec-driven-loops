#!/usr/bin/env bash
# Single-folder worker for census-validation-rule.sh's parallel xargs pool.
# Kept as a standalone script (not an exported bash function) because macOS
# ships bash 3.2, which does not reliably support `export -f` for xargs workers.
set -euo pipefail

spec_file="$1"
folder="${spec_file%/spec.md}"

out="$(env "$CENSUS_FLAG=true" "SPECKIT_RULES=$CENSUS_RULE" bash "$CENSUS_VALIDATE_SCRIPT" "$folder" --strict --json --no-recursive 2>/dev/null || true)"

parsed="$(printf '%s' "$out" | node -e '
const fs = require("fs");
const rule = process.argv[1];
let payload;
try { payload = JSON.parse(fs.readFileSync(0, "utf8")); } catch (_) { payload = null; }
const result = payload && (payload.results || []).find((entry) => entry.rule === rule);
if (!result) process.stdout.write(JSON.stringify({ status: "missing", message: "rule missing from validator JSON" }));
else process.stdout.write(JSON.stringify({ status: result.status, message: result.message || "" }));
' "$CENSUS_RULE" 2>/dev/null || printf '%s' '{"status":"error","message":"validator did not return parseable JSON"}')"

out_name="$(printf '%s' "$folder" | shasum -a 1 | cut -d' ' -f1)"
node -e '
const fs = require("fs");
const [folder, parsedJson] = process.argv.slice(1);
const parsed = JSON.parse(parsedJson);
process.stdout.write(JSON.stringify({ folder, status: parsed.status, message: parsed.message }) + "\n");
' "$folder" "$parsed" > "$CENSUS_WORK_DIR/$out_name.json"
