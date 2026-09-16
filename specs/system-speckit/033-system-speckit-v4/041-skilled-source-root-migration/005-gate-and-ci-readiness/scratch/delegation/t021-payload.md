# Edits for unit t021

Each edit names a file, an OLD block and a NEW block. The block is the text between its two fence lines, without the fence lines themselves.

## Edit 1

File: `.opencode/scripts/git-hooks/prepare-commit-msg`

OLD:

~~~~text
ALLOCATOR="$REPO_ROOT/.opencode/skills/sk-git/scripts/commit-id-naming.sh"
if [[ ! -f "$ALLOCATOR" ]]; then
  exit 0
fi
~~~~

NEW:

~~~~text
# A checkout that ships the toolchain, marked by the spec-kit sentinel under either
# source root, should have the allocator, so its absence is said out loud there.
# The hook still never blocks.
_in_toolchain_repo() {
  [[ -f "$REPO_ROOT/.opencode/skills/system-spec-kit/SKILL.md" \
     || -f "$REPO_ROOT/.skilled/skills/system-spec-kit/SKILL.md" ]]
}

ALLOCATOR="$REPO_ROOT/.opencode/skills/sk-git/scripts/commit-id-naming.sh"
if [[ ! -f "$ALLOCATOR" ]]; then
  if _in_toolchain_repo; then
    printf 'prepare-commit-msg: allocator is missing: %s; leaving the message unstamped.\n' "$ALLOCATOR" >&2
  fi
  exit 0
fi
~~~~

## Edit 2

File: `.opencode/scripts/git-hooks/tests/prepare-commit-msg.test.sh`

OLD:

~~~~text
echo ""
echo "PASS=$PASS FAIL=$FAIL"
[[ "$FAIL" -eq 0 ]]
~~~~

NEW:

~~~~text
# ── 16. a missing allocator warns where the toolchain ships, and never blocks ──
setup_repo
rm -rf "$TMP/.opencode/skills/sk-git/scripts"
mkdir -p "$TMP/.opencode/skills/system-spec-kit"
echo sentinel > "$TMP/.opencode/skills/system-spec-kit/SKILL.md"
printf 'feat(sk-git): stamp without an allocator\n\nBody text.\n' > "$TMP/message.txt"
cp "$TMP/message.txt" "$TMP/before.txt"
run_hook message; RC=$?
check_rc "a missing allocator still exits 0" 0 "$RC"
check_count "a missing allocator warns once" 'allocator is missing' 1 "$TMP/out.log"
check_same "a missing allocator leaves the message unstamped" "$TMP/before.txt" "$TMP/message.txt"

# ── 17. an allocator under a linked source root still stamps ──
setup_repo
mv "$TMP/.opencode" "$TMP/.skilled"
ln -s .skilled "$TMP/.opencode"
printf 'feat(sk-git): stamp through the link\n\nBody text.\n' > "$TMP/message.txt"
run_hook message; RC=$?
check_rc "an allocator under .skilled exits 0" 0 "$RC"
check_count "an allocator under .skilled mints one id" '^Commit-Id: [0-9]{7}$' 1 "$TMP/message.txt"

echo ""
echo "PASS=$PASS FAIL=$FAIL"
[[ "$FAIL" -eq 0 ]]
~~~~
