OUT="$(mktemp -d)"
( cd .skilled/skills/system-spec-kit && ./node_modules/.bin/vitest run runtime/cli/tests/scaffold-golden-snapshots.vitest.ts --config vitest.config.ts ) > "$OUT/golden.txt" 2>&1
echo "golden_exit=$?"
grep -E '^ *Tests +12 passed' "$OUT/golden.txt"
grep -c 'failed' "$OUT/golden.txt"
( cd .skilled/skills/system-spec-kit && ./node_modules/.bin/vitest run runtime/cli/tests/template-fill-guidance.vitest.ts --config vitest.config.ts ) > "$OUT/fill.txt" 2>&1
echo "fill_exit=$?"
grep -E '^ *Tests +16 passed' "$OUT/fill.txt"
grep -c 'failed' "$OUT/fill.txt"
rm -rf "$OUT"
test ! -d "$OUT" && echo "cleanup=ok"
