OUT="$(mktemp -d)"
bash .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh --skip-branch --level 2 --track zz-pb-gate-legacy --short-name gate-legacy --number 1 "Placeholder gate legacy" > "$OUT/create.txt" 2>&1
P=specs/zz-pb-gate-legacy/001-gate-legacy
test -f "$P/spec.md" && echo "packet=$P"
for f in spec plan tasks implementation-summary acceptance-criteria; do
  perl -pi -e 's/\| v2\.3 -->/| v2.2 -->/g' "$P/$f.md"
  printf '%s ' "$f"
  grep -c 'v2\.2 -->' "$P/$f.md"
done
grep -m1 '| \*\*Status\*\* |' "$P/spec.md"
bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh "$P" --strict --json > "$OUT/gate.json" 2>&1
jq -r '.entries[] | select(.rule == "PLACEHOLDER_FILLED") | .status' "$OUT/gate.json"
jq -r '.passed' "$OUT/gate.json"
rm -rf specs/zz-pb-gate-legacy
test ! -d specs/zz-pb-gate-legacy && echo "cleanup=ok"
