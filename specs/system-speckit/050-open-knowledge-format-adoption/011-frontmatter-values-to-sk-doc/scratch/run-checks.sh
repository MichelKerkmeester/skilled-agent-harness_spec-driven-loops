#!/usr/bin/env bash
# Runs every check this phase guards and writes its output to the folder given.
OUT="$1"; W="$2"; S="$W/.skilled/skills"; mkdir -p "$OUT"
cd "$S/system-spec-kit/shared" && npm test > "$OUT/shared-tests.log" 2>&1; echo "shared-tests rc=$?" >> "$OUT/rc.txt"
node "$(dirname "$0")/dump-exports.mjs" "$S/system-spec-kit/shared/dist/context-types.js" > "$OUT/exports-dist.json" 2> "$OUT/exports-dist.err"; echo "exports-dist rc=$?" >> "$OUT/rc.txt"
npx --no-install tsx "$(dirname "$0")/dump-exports.mjs" "$S/system-spec-kit/shared/context-types.ts" > "$OUT/exports-src.json" 2> "$OUT/exports-src.err"; echo "exports-src rc=$?" >> "$OUT/rc.txt"
cd "$S/system-spec-kit/runtime/cli" && npx vitest run --config ../../vitest.config.ts --project cli > "$OUT/cli-vitest.log" 2>&1; echo "cli-vitest rc=$?" >> "$OUT/rc.txt"
cd "$S/sk-doc/scripts/tests" && python3 test_frontmatter_values.py > "$OUT/sk-doc-py.log" 2>&1; echo "sk-doc-py rc=$?" >> "$OUT/rc.txt"
cd "$S/system-skill-advisor/runtime" && npx vitest run tests/skill-doc-frontmatter-checker.vitest.ts > "$OUT/advisor-vitest.log" 2>&1; echo "advisor-vitest rc=$?" >> "$OUT/rc.txt"
