# Edits for unit t018

Each edit names a file, an OLD block and a NEW block. The block is the text between its two fence lines, without the fence lines themselves.

## Edit 1

File: `.opencode/scripts/git-hooks/pre-commit`

OLD:

~~~~text
    if [[ -n "$SPEC_PACKETS" ]]; then
      # git runs this hook against a throwaway index when a pathspec narrows the
~~~~

NEW:

~~~~text
    # A repository that does not ship the toolchain has no re-derive tool and nothing
    # to re-derive with, so it passes. Inside one that ships it, a missing tool blocks.
    SPEC_TOOL="$REPO_ROOT/.opencode/skills/system-spec-kit/runtime/cli/spec/repair-derived.cjs"
    if [[ -n "$SPEC_PACKETS" ]] && { [[ -f "$SPEC_TOOL" ]] || _in_toolchain_repo; }; then
      # git runs this hook against a throwaway index when a pathspec narrows the
~~~~

## Edit 2

File: `.opencode/scripts/git-hooks/pre-commit`

OLD:

~~~~text
      SPEC_RC=0
      SPEC_OUT="$(node "$REPO_ROOT/.opencode/skills/system-spec-kit/runtime/cli/spec/repair-derived.cjs" \
            ${SPEC_ARGS[@]+"${SPEC_ARGS[@]}"} --apply 2>&1)" || SPEC_RC=$?
~~~~

NEW:

~~~~text
      if [[ ! -f "$SPEC_TOOL" ]]; then
        echo "" >&2
        echo "BLOCKED [gate:spec-remint]: re-derive tool is missing: $SPEC_TOOL" >&2
        echo "Bypass: SPECKIT_SKIP_SPEC_REMINT=1 git commit ..." >&2
        exit 1
      fi
      SPEC_RC=0
      SPEC_OUT="$(node "$SPEC_TOOL" \
            ${SPEC_ARGS[@]+"${SPEC_ARGS[@]}"} --apply 2>&1)" || SPEC_RC=$?
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
# ── 34. a missing re-derive tool blocks a staged spec doc where the toolchain ships ──
setup_spec_fixture
mkdir -p "$TMP/.opencode/skills/system-spec-kit"
echo "sentinel" > "$TMP/.opencode/skills/system-spec-kit/SKILL.md"
rm "$TMP/.opencode/skills/system-spec-kit/runtime/cli/spec/repair-derived.cjs"
echo "# edited" > "$TMP/$PKT/spec.md"; git -C "$TMP" add "$PKT/spec.md"
run_hook; RC=$?
check "a missing re-derive tool blocks" 1 "$RC" "re-derive tool is missing"

# ── 35. a repository that does not ship the toolchain is never blocked by a missing gate script ──
# Every trigger staged at once, every bypass lifted and no gate script present: the
# globally installed hook must leave such a repository committable.
setup_gate_fixture
mkdir -p "$TMP/.opencode/skills/sk-code"
echo "a skill of its own" > "$TMP/.opencode/skills/sk-code/SKILL.md"
stage_new ".opencode/agents/probe.md" "agent"
stage_new ".opencode/skills/cli-external-orchestration/cli-x/SKILL.md" "cli"
stage_new ".opencode/skills/mcp-tooling/mcp-x/scripts/doctor.sh" "doctor"
stage_new "specs/demo/001-demo/spec.md" "# spec"
stage_new "specs/demo/001-demo/graph-metadata.json" '{"fingerprint":"old"}'
SPECKIT_SKIP_COMMENT_HYGIENE=0 SPECKIT_SKIP_MIRROR_PARITY=0 SPECKIT_SKIP_CARD_SYNC=0 \
  SPECKIT_SKIP_MCP_MUTATION_CLASS=0 run_hook; RC=$?
check "a repository without the toolchain stays committable" 0 "$RC"
grep -q 'BLOCKED' "$TMP/out.log" && { echo "FAIL  a gate blocked a repository without the toolchain"; FAIL=$((FAIL + 1)); }

echo ""
echo "pre-commit gates: $PASS passed, $FAIL failed"
[[ "$FAIL" -eq 0 ]]
~~~~
