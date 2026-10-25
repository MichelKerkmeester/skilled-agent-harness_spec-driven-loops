OUT="$(mktemp -d)"
bash .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh --skip-branch --level 2 --track zz-pb-gate-complete --short-name gate-complete --number 1 "Placeholder gate complete" > "$OUT/create.txt" 2>&1
P=specs/zz-pb-gate-complete/001-gate-complete
test -f "$P/spec.md" && echo "packet=$P"
perl -pi -e 's/\| \*\*Status\*\* \| Draft \|/| **Status** | Complete |/' "$P/spec.md"
grep -m1 '| \*\*Status\*\* |' "$P/spec.md"
bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh "$P" --strict --json > "$OUT/gate.json" 2>&1
jq -r '.entries[] | select(.rule == "PLACEHOLDER_FILLED") | .status' "$OUT/gate.json"
jq -r '.passed' "$OUT/gate.json"
jq -r '.entries[] | select(.rule == "PLACEHOLDER_FILLED") | .details[]' "$OUT/gate.json" | head -3
rm -rf specs/zz-pb-gate-complete
test ! -d specs/zz-pb-gate-complete && echo "cleanup=ok"
