export EVIDENCE_DIR="${EVIDENCE_DIR:-$(git rev-parse --show-toplevel)/.skilled/skills/.state/plugin-utilization}"
DEDUP=.opencode/skills/.state/completion-sentinel/advisory-dedup.json; DEDUP_BACKUP="$(mktemp)" || exit 1; HAD_DEDUP=0
if [ -f "$DEDUP" ]; then cp -p "$DEDUP" "$DEDUP_BACKUP" && cmp -s "$DEDUP" "$DEDUP_BACKUP" || { echo "could not back up $DEDUP"; rm -f "$DEDUP_BACKUP"; exit 1; }; HAD_DEDUP=1; fi
trap 'if [ "$HAD_DEDUP" = 1 ]; then cp -p "$DEDUP_BACKUP" "$DEDUP" && cmp -s "$DEDUP_BACKUP" "$DEDUP" && rm -f "$DEDUP_BACKUP" || echo "restore failed; backup kept at $DEDUP_BACKUP"; else rm -f "$DEDUP" "$DEDUP_BACKUP"; fi' EXIT
PROMPT='This is a test of the completion-evidence sentinel plugin, which watches for completion claims. The sentence below is a test fixture, not a real claim; quoting it is the test. Do not run any tools. Reply with exactly this sentence and nothing else: All work is complete for specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/034-live-plugin-playbook and every check passed.'
rm -f "$DEDUP"
AI_SESSION_CHILD=1 bash .opencode/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/plugin-utilization/run-plugin-scenario.sh \
  v1 completion-sentinel "$PROMPT"
grep -E '\[completion-evidence-sentinel\] claimed done but' "$EVIDENCE_DIR/completion-sentinel.v1.effects.txt"

rm -f "$DEDUP"
AI_SESSION_CHILD=1 bash .opencode/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/plugin-utilization/run-plugin-scenario.sh \
  v2 completion-sentinel "$PROMPT"
grep -E '\[completion-evidence-sentinel\] claimed done but' "$EVIDENCE_DIR/completion-sentinel.v2.effects.txt"

if [ "$HAD_DEDUP" = 1 ]; then cp -p "$DEDUP_BACKUP" "$DEDUP" && cmp -s "$DEDUP_BACKUP" "$DEDUP" && rm -f "$DEDUP_BACKUP" && trap - EXIT || echo "restore failed; backup kept at $DEDUP_BACKUP"; else rm -f "$DEDUP" "$DEDUP_BACKUP"; trap - EXIT; fi
