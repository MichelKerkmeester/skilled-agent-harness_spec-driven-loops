#!/usr/bin/env bash
# Headless regression harness for the 11 mcp-obsidian plugin playbook scenarios
# (OBS-011 .. OBS-021). Each scenario runs in its own disposable throwaway-vault
# workspace, with cli-codex sandboxed to that dir (workspace-write) and TMPDIR
# redirected there, so every write is physically contained: no real vault, no repo
# writes, and no network beyond what a scenario explicitly reaches. OBS-013 stages
# from the shipped offline release fixture, so the full set runs without network.
#
# Requires: the `codex` CLI (cli-codex) with access to the gpt-5.6-luna model.
# Usage:  bash run-scenarios.sh [WORKDIR]
#   WORKDIR defaults to a fresh mktemp dir; pass one to keep the results for inspection.
# Exit:   0 if every scenario ends PASS or SKIP; 1 if any scenario FAILs.
set -u

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SK="$(cd "$SCRIPT_DIR/.." && pwd)"                       # .../mcp-tooling/mcp-obsidian
TIE="$SK/manual-testing-playbook/plugin-tie-ins"
BASE="${1:-$(mktemp -d "${TMPDIR:-/tmp}/obsidian-scenarios.XXXXXX")}"
mkdir -p "$BASE"
echo "workdir: $BASE"

command -v codex >/dev/null || { echo "error: codex CLI not found on PATH" >&2; exit 127; }

# scenario id : tie-in file basename (without .md)
SCEN="OBS-011:beancount-transaction OBS-012:obsidian-tables-roundtrip OBS-013:brat-headless-install OBS-014:health-md-data OBS-015:iconic-rules OBS-016:charts-render-block OBS-017:dataview-metadata-query OBS-018:excalidraw-drawing-note OBS-019:git-status-roundtrip OBS-020:outliner-settings-defaults OBS-021:minimal-theme-activation"

PIDS=""
for entry in $SCEN; do
  id="${entry%%:*}"; file="${entry##*:}"
  wt="$BASE/$id"; mkdir -p "$wt"
  cp "$TIE/$file.md" "$wt/scenario.md"
  cp -R "$SK/examples" "$wt/examples"
  cp -R "$SK/assets" "$wt/assets"
  PROMPT="Role: headless test runner for one Obsidian plugin file-layer scenario ($id).

Context:
- Your current working directory is an empty, disposable throwaway vault workspace. Write ONLY inside it. Never touch a real vault or any path outside your CWD. TMPDIR already points at your CWD.
- The scenario spec is ./scenario.md (read it). Executable helpers are in ./examples/ ; shipped fixtures are in ./assets/ (for OBS-013 Fixture mode, \$SKILL resolves to ./ so FIXTURE=./assets/plugins/obsidian42-brat).

Action:
1. Read ./scenario.md.
2. Run its file-layer command sequence, redirecting every scratch / vault / ledger / data.json / theme path to live UNDER your CWD (create the throwaway vault at ./vault). If it calls a script in ./examples/, run that copy. For OBS-013 use Fixture mode (no network).
3. Do the structural validation the scenario specifies (JSON parse, id/schema checks, bean-check if present, jq empty, etc.). Actually run the commands; do not simulate.
4. SKIP any step that needs the running Obsidian app (visual render / reload) with reason 'requires running app'. SKIP any network step you cannot reach, stating the reason.

Format: print the key evidence (created file paths + validation output), then end with EXACTLY one final line, no trailing text:
RESULT: PASS — <one-line evidence>
or RESULT: FAIL — <what failed and why>
or RESULT: SKIP — <why the file-layer part could not run>"
  ( cd "$wt" && TMPDIR="$wt" AI_SESSION_CHILD=1 codex exec \
      --model gpt-5.6-luna -c model_reasoning_effort=xhigh -c service_tier=fast \
      -c approval_policy=never --sandbox workspace-write --skip-git-repo-check "$PROMPT" \
      > "$wt/result.log" 2>&1 </dev/null ) &
  PIDS="$PIDS $!"
  echo "dispatched $id pid=$! wt=$wt"
done
echo "ALL_PIDS:$PIDS"
wait

echo "── results ──"
rc=0
for entry in $SCEN; do
  id="${entry%%:*}"
  line="$(grep -aE '^RESULT:' "$BASE/$id/result.log" 2>/dev/null | tail -1)"
  [ -n "$line" ] || line="RESULT: FAIL — no RESULT line (see $BASE/$id/result.log)"
  printf '%s  %s\n' "$id" "$line"
  case "$line" in *"RESULT: FAIL"*) rc=1;; esac
done
echo "ALL_DONE (workdir: $BASE)"
exit "$rc"
