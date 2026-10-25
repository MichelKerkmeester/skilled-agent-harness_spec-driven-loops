OUT="$(mktemp -d)"
bash .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh --skip-branch --level 2 --track zz-pb-gate-draft --short-name gate-draft --number 1 "Placeholder gate draft" > "$OUT/create.txt" 2>&1
P=specs/zz-pb-gate-draft/001-gate-draft
test -f "$P/spec.md" && echo "packet=$P"
grep -m1 'SPECKIT_TEMPLATE_SOURCE' "$P/spec.md"
grep -m1 '| \*\*Status\*\* |' "$P/spec.md"
bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh "$P" --strict --json > "$OUT/gate.json" 2>&1
jq -r '.entries[] | select(.rule == "PLACEHOLDER_FILLED") | .status' "$OUT/gate.json"
jq -r '.passed' "$OUT/gate.json"
rm -rf specs/zz-pb-gate-draft
test ! -d specs/zz-pb-gate-draft && echo "cleanup=ok"
