OUT="$(mktemp -d)"
S=.skilled/skills/system-spec-kit
bash "$S/runtime/cli/spec/check-card-sync.sh" > "$OUT/clean.txt" 2>&1
echo "clean_exit=$?"
grep -c '^PASS ' "$OUT/clean.txt"
tail -1 "$OUT/clean.txt"
N="$OUT/skill"
rsync -a --exclude node_modules "$S/" "$N/"
bash "$N/runtime/cli/spec/check-card-sync.sh" > "$OUT/copy.txt" 2>&1
echo "copy_exit=$?"
tail -1 "$OUT/copy.txt"
rm "$N/references/workflows/spec-authoring-card.md"
bash "$N/runtime/cli/spec/check-card-sync.sh" > "$OUT/broken.txt" 2>&1
echo "broken_exit=$?"
grep -c '^FAIL card-exists' "$OUT/broken.txt"
tail -1 "$OUT/broken.txt"
rm -rf "$OUT"
test ! -d "$OUT" && echo "cleanup=ok"
