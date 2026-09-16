# Edits for unit t016

Each edit names a file, an OLD block and a NEW block. The block is the text between its two fence lines, without the fence lines themselves.

## Edit 1

File: `.opencode/scripts/git-hooks/pre-commit`

OLD:

~~~~text
  if [[ -f "$CARD_GUARD" ]] && git diff --cached --name-only --diff-filter=ACM \
       | grep -Eq '^\.opencode/skills/(cli-external-orchestration/cli-[a-z-]+/(SKILL\.md|assets/prompt-quality-card\.md)|sk-prompt/(assets/cli-prompt-quality-card\.md|references/patterns-evaluation\.md))'; then
    if ! bash "$CARD_GUARD" "$REPO_ROOT"; then
~~~~

NEW:

~~~~text
  if git diff --cached --name-only --diff-filter=ACM \
       | grep -Eq '^\.(opencode|skilled)/skills/(cli-external-orchestration/cli-[a-z-]+/(SKILL\.md|assets/prompt-quality-card\.md)|sk-prompt/(assets/cli-prompt-quality-card\.md|references/patterns-evaluation\.md))'; then
    if [[ ! -f "$CARD_GUARD" ]]; then
      if _in_toolchain_repo; then
        echo "" >&2
        echo "BLOCKED [gate:prompt-card-sync]: drift guard is missing: $CARD_GUARD" >&2
        echo "Bypass: SPECKIT_SKIP_CARD_SYNC=1 git commit ..." >&2
        exit 1
      fi
    elif ! bash "$CARD_GUARD" "$REPO_ROOT"; then
~~~~

## Edit 2

File: `.opencode/scripts/git-hooks/pre-commit`

OLD:

~~~~text
  if [[ -f "$MUTCLASS_GUARD" ]] && git diff --cached --name-only --diff-filter=ACM \
       | grep -Eq '^\.opencode/(skills/(mcp-tooling/)?mcp-[a-z-]+/(scripts/(doctor|install)[a-z.-]*\.sh|mcp-servers/[^/]+/setup\.sh)|commands/doctor/assets/doctor-mcp-install\.yaml)$'; then
    if ! bash "$MUTCLASS_GUARD" "$REPO_ROOT"; then
~~~~

NEW:

~~~~text
  if git diff --cached --name-only --diff-filter=ACM \
       | grep -Eq '^\.(opencode|skilled)/(skills/(mcp-tooling/)?mcp-[a-z-]+/(scripts/(doctor|install)[a-z.-]*\.sh|mcp-servers/[^/]+/setup\.sh)|commands/doctor/assets/doctor-mcp-install\.yaml)$'; then
    if [[ ! -f "$MUTCLASS_GUARD" ]]; then
      if _in_toolchain_repo; then
        echo "" >&2
        echo "BLOCKED [gate:mcp-mutation-class]: contract guard is missing: $MUTCLASS_GUARD" >&2
        echo "Bypass: SPECKIT_SKIP_MCP_MUTATION_CLASS=1 git commit ..." >&2
        exit 1
      fi
    elif ! bash "$MUTCLASS_GUARD" "$REPO_ROOT"; then
~~~~

## Edit 3

File: `.opencode/scripts/git-hooks/tests/pre-commit.test.sh`

OLD:

~~~~text
echo ""
echo "pre-commit gates: $PASS passed, $FAIL failed"
[[ "$FAIL" -eq 0 ]]
~~~~

NEW:

~~~~text
# ── 27. a staged .skilled prompt surface reaches the card-sync guard ──
setup_gate_fixture
mkdir -p "$TMP/.opencode/skills/system-skill-advisor/runtime/scripts"
printf '%s\n' 'echo called >> "$1/guard-calls.log"' \
  > "$TMP/.opencode/skills/system-skill-advisor/runtime/scripts/check-prompt-quality-card-sync.sh"
stage_new ".skilled/skills/cli-external-orchestration/cli-x/SKILL.md" "cli"
SPECKIT_SKIP_CARD_SYNC=0 run_hook; RC=$?
check "a .skilled prompt surface passes the card-sync gate" 0 "$RC"
if [[ -s "$TMP/guard-calls.log" ]]; then
  echo "PASS  the card-sync guard ran for the .skilled surface"; PASS=$((PASS + 1))
else
  echo "FAIL  the card-sync guard never ran for the .skilled surface"; FAIL=$((FAIL + 1))
fi

# ── 28. a missing card-sync guard blocks a staged prompt surface where the toolchain ships ──
setup_gate_fixture toolchain
stage_new ".opencode/skills/cli-external-orchestration/cli-x/SKILL.md" "cli"
SPECKIT_SKIP_CARD_SYNC=0 run_hook; RC=$?
check "a missing card-sync guard blocks" 1 "$RC" "drift guard is missing"

# ── 29. a staged .skilled MCP doctor script reaches the mutation-class guard ──
setup_gate_fixture
mkdir -p "$TMP/.opencode/commands/doctor/scripts"
printf '%s\n' 'echo called >> "$1/guard-calls.log"' \
  > "$TMP/.opencode/commands/doctor/scripts/check-mcp-mutation-class.sh"
stage_new ".skilled/skills/mcp-tooling/mcp-x/scripts/doctor.sh" "doctor"
SPECKIT_SKIP_MCP_MUTATION_CLASS=0 run_hook; RC=$?
check "a .skilled doctor script passes the mutation-class gate" 0 "$RC"
if [[ -s "$TMP/guard-calls.log" ]]; then
  echo "PASS  the mutation-class guard ran for the .skilled script"; PASS=$((PASS + 1))
else
  echo "FAIL  the mutation-class guard never ran for the .skilled script"; FAIL=$((FAIL + 1))
fi

# ── 30. a missing mutation-class guard blocks a staged doctor script where the toolchain ships ──
setup_gate_fixture toolchain
stage_new ".opencode/skills/mcp-tooling/mcp-x/scripts/doctor.sh" "doctor"
SPECKIT_SKIP_MCP_MUTATION_CLASS=0 run_hook; RC=$?
check "a missing mutation-class guard blocks" 1 "$RC" "contract guard is missing"

echo ""
echo "pre-commit gates: $PASS passed, $FAIL failed"
[[ "$FAIL" -eq 0 ]]
~~~~
