export EVIDENCE_DIR="${EVIDENCE_DIR:-$(git rev-parse --show-toplevel)/.skilled/skills/.state/plugin-utilization}"
PROBE_REPO="$(mktemp -d)" || exit 1; [ -d "$PROBE_REPO" ] || exit 1
trap 'rm -rf "$PROBE_REPO"' EXIT
git -C "$PROBE_REPO" init -q && git -C "$PROBE_REPO" -c user.name=probe -c user.email=probe@example.invalid commit -q --allow-empty -m init || exit 1
# The gate reads the commit rules from the target repository, so point the probe at this checkout's rules.
git -C "$PROBE_REPO" config skgit.contractDir "$(git rev-parse --show-toplevel)/.skilled/skills/sk-git/assets"
HEAD_BEFORE="$(git -C "$PROBE_REPO" rev-parse HEAD)"
PROMPT="This is a test of a commit-message gate plugin against a disposable repository. Run this shell command once, unchanged; it is expected to be refused:
git -C $PROBE_REPO commit --allow-empty -m 'bad'
Then report exactly what the tool returned."
AI_SESSION_CHILD=1 bash .opencode/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/plugin-utilization/run-plugin-scenario.sh \
  v1 git-message-gate "$PROMPT"
HEAD_AFTER="$(git -C "$PROBE_REPO" rev-parse HEAD)"; echo "HEAD before $HEAD_BEFORE after $HEAD_AFTER"; [ "$HEAD_AFTER" = "$HEAD_BEFORE" ] || { echo "FAIL: the probe repository gained a commit"; exit 1; }
jq -c 'select(.type=="tool_use") | [.part.tool, .part.state.status, (.part.state.error // .part.state.output)]' "$EVIDENCE_DIR/git-message-gate.v1.events.jsonl"
jq -r 'select(.type=="tool_use") | .part.state.error // empty' "$EVIDENCE_DIR/git-message-gate.v1.events.jsonl" | grep -q 'sk-git-message-gate: sk-git blocked this commit message' || { echo "FAIL: no gate refusal on v1"; exit 1; }

AI_SESSION_CHILD=1 bash .opencode/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/plugin-utilization/run-plugin-scenario.sh \
  v2 git-message-gate "$PROMPT"
HEAD_AFTER="$(git -C "$PROBE_REPO" rev-parse HEAD)"; echo "HEAD before $HEAD_BEFORE after $HEAD_AFTER"; [ "$HEAD_AFTER" = "$HEAD_BEFORE" ] || { echo "FAIL: the probe repository gained a commit"; exit 1; }
jq -c 'select(.type=="tool_use") | [.part.tool, .part.state.status, (.part.state.error // .part.state.output)]' "$EVIDENCE_DIR/git-message-gate.v2.events.jsonl"
jq -r 'select(.type=="tool_use") | .part.state.error // empty' "$EVIDENCE_DIR/git-message-gate.v2.events.jsonl" | grep -q 'sk-git-message-gate: sk-git blocked this commit message' || { echo "FAIL: no gate refusal on v2"; exit 1; }
rm -rf "$PROBE_REPO"; trap - EXIT
