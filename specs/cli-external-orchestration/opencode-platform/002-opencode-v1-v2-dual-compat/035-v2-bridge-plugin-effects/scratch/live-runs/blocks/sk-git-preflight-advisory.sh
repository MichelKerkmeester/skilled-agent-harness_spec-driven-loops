export EVIDENCE_DIR="${EVIDENCE_DIR:-$(git rev-parse --show-toplevel)/.skilled/skills/.state/plugin-utilization}"
test ! -e no-such-path-preflight-probe.txt || { echo "remove no-such-path-preflight-probe.txt first"; exit 1; }
git diff --cached --quiet || { echo "index has staged changes; unstage them first"; exit 1; }
PROMPT=$'This is a test of a git advisory plugin. Run this shell command once, unchanged; it is expected to fail:\ngit add no-such-path-preflight-probe.txt\nThen reply with the single word DONE.'
AI_SESSION_CHILD=1 bash .opencode/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/plugin-utilization/run-plugin-scenario.sh \
  v1 git-preflight "$PROMPT"
jq -r '.system[]' "$EVIDENCE_DIR/git-preflight.v1.capture.jsonl" | grep -E '\[add-pathspec-matches-nothing\] This pathspec matches no files'
jq -c 'select(.type=="tool_use") | [.part.tool, .part.state.status, (.part.state.error // .part.state.output)]' "$EVIDENCE_DIR/git-preflight.v1.events.jsonl"
git diff --cached --quiet || { echo "the run staged a file"; exit 1; }
git status --short

AI_SESSION_CHILD=1 bash .opencode/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/plugin-utilization/run-plugin-scenario.sh \
  v2 git-preflight "$PROMPT"
jq -r '.system[]' "$EVIDENCE_DIR/git-preflight.v2.capture.jsonl" | grep -E '\[add-pathspec-matches-nothing\] This pathspec matches no files'
jq -c 'select(.type=="tool_use") | [.part.tool, .part.state.status, (.part.state.error // .part.state.output)]' "$EVIDENCE_DIR/git-preflight.v2.events.jsonl"
git diff --cached --quiet || { echo "the run staged a file"; exit 1; }
git status --short
