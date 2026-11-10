export EVIDENCE_DIR="${EVIDENCE_DIR:-$(git rev-parse --show-toplevel)/.skilled/skills/.state/plugin-utilization}"
export AI_SESSION_CHILD=1
E=.opencode/skills/sk-design/sk-design-md-generator/backend/dist/cli.js
BACKUP="$(mktemp)" || exit 1
cp -p "$E" "$BACKUP" && cmp -s "$E" "$BACKUP" || { echo "could not back up $E"; rm -f "$BACKUP"; exit 1; }
trap 'cp -p "$BACKUP" "$E" && cmp -s "$BACKUP" "$E" && rm -f "$BACKUP" || echo "restore failed; backup kept at $BACKUP"' EXIT
printf '\n' >> $E
touch -t 200001010000 $E
node -e "const d=require('./.opencode/skills/system-spec-kit/runtime/cli/lib/dist-freshness.cjs'); console.log(d.checkAllFreshness({workspaceRoot:process.cwd()}).filter(r=>r.stale).map(r=>r.packageId))"

bash .opencode/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/plugin-utilization/run-plugin-scenario.sh v1 dist-freshness "Reply with the single word OK."
jq -r '.system[]' "$EVIDENCE_DIR/dist-freshness.v1.capture.jsonl" | grep -E 'dist-freshness-guard|STALE DIST WARNING'
grep -E 'session.created:|inject:' "$EVIDENCE_DIR/dist-freshness.v1.effects.txt"

bash .opencode/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/plugin-utilization/run-plugin-scenario.sh v2 dist-freshness "Reply with the single word OK."
jq -r '.system[]' "$EVIDENCE_DIR/dist-freshness.v2.capture.jsonl" | grep -E 'dist-freshness-guard|STALE DIST WARNING'
grep -E 'session.created:|inject:' "$EVIDENCE_DIR/dist-freshness.v2.effects.txt"

cp -p "$BACKUP" "$E" && cmp -s "$BACKUP" "$E" && rm -f "$BACKUP" && trap - EXIT || echo "restore failed; backup kept at $BACKUP"
