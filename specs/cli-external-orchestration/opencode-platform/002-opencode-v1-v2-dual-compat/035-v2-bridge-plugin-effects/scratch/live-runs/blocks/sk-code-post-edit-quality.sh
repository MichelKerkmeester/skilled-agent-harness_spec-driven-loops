export EVIDENCE_DIR="${EVIDENCE_DIR:-$(git rev-parse --show-toplevel)/.skilled/skills/.state/plugin-utilization}"
SPEC_DIR=specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/034-live-plugin-playbook
for f in scratch-probe/pe-probe-v1.js scratch-probe/pe-probe-v2.js "$SPEC_DIR"/scratch-probe/pe-probe-v1.js "$SPEC_DIR"/scratch-probe/pe-probe-v2.js; do [ ! -e "$f" ] || { echo "$f already exists; move it aside first"; exit 1; }; done
PROMPT_V1=$'Spec folder: specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/034-live-plugin-playbook (pre-approved, skip Gate 3). This is a throwaway test fixture that is deleted right after. Use the write tool to create the file scratch-probe/pe-probe-v1.js with exactly these two lines:\n// Aspect ratio taken from the 640/480 baseline.\nexport const ratio = 640 / 480;\nThen reply with the single word DONE. Do not run any other tool.'
PROMPT_V2=$'Spec folder: specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/034-live-plugin-playbook (pre-approved, skip Gate 3). This is a throwaway test fixture that is deleted right after. Use the write tool to create the file scratch-probe/pe-probe-v2.js with exactly these two lines:\n// Aspect ratio taken from the 640/480 baseline.\nexport const ratio = 640 / 480;\nThen reply with the single word DONE. Do not run any other tool.'
AI_SESSION_CHILD=1 bash .opencode/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/plugin-utilization/run-plugin-scenario.sh \
  v1 post-edit-quality "$PROMPT_V1"
grep -E '\[comment-hygiene\].*pe-probe-v1\.js:1:' "$EVIDENCE_DIR/post-edit-quality.v1.effects.txt"
jq -r '.system[]' "$EVIDENCE_DIR/post-edit-quality.v1.capture.jsonl" | grep -E '\[post-edit-quality\] Advisory findings from recent edits:'

AI_SESSION_CHILD=1 bash .opencode/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/plugin-utilization/run-plugin-scenario.sh \
  v2 post-edit-quality "$PROMPT_V2"
grep -E '\[comment-hygiene\].*pe-probe-v2\.js:1:' "$EVIDENCE_DIR/post-edit-quality.v2.effects.txt"
jq -r '.system[]' "$EVIDENCE_DIR/post-edit-quality.v2.capture.jsonl" | grep -E '\[post-edit-quality\] Advisory findings from recent edits:'

rm -f scratch-probe/pe-probe-v1.js scratch-probe/pe-probe-v2.js "$SPEC_DIR"/scratch-probe/pe-probe-v1.js "$SPEC_DIR"/scratch-probe/pe-probe-v2.js; rmdir scratch-probe "$SPEC_DIR"/scratch-probe 2>/dev/null || true
