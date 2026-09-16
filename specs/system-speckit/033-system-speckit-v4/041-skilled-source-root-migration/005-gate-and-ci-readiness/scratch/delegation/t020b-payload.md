# Edits for unit t020b

Each edit names a file, an OLD block and a NEW block. The block is the text between its two fence lines, without the fence lines themselves.

## Edit 1

File: `.opencode/scripts/git-hooks/tests/pre-push.test.sh`

OLD:

~~~~text
# ── report ──────────────────────────────────────────────────────
echo "pre-push tests: PASS=$PASS FAIL=$FAIL"
[ "$FAIL" -eq 0 ]
~~~~

NEW:

~~~~text
# ── missing permission, deletion and routing scripts ───────────
# Where the toolchain ships, each blocks the pushes it would have checked, and its
# existing approval still lets a deliberate push through. Anywhere else nothing blocks.
mkdir -p "$(dirname "$SENTINEL")"; printf 'name: system-spec-kit\n' > "$SENTINEL"
rm -f "$TMP/.opencode/skills/sk-git/scripts/worktree-naming.sh"
expect_hook_says "a missing permission script blocks an update to a feature branch" \
  1 "permission script is missing" "refs/heads/feature-x $SHA_A refs/heads/feature-x $SHA_B" \
  SPECKIT_SKIP_PREPUSH_ROUTE_GATE=1 SPECKIT_ALLOW_MASS_DELETION=1
expect_hook "...while a release branch still passes" \
  0 "refs/heads/skilled/v4.0.0.0 $SHA_A refs/heads/skilled/v4.0.0.0 $SHA_B" \
  SPECKIT_SKIP_PREPUSH_ROUTE_GATE=1 SPECKIT_ALLOW_MASS_DELETION=1
expect_hook "...and SPECKIT_ALLOW_REMOTE_PUSH=1 approves the update" \
  0 "refs/heads/feature-x $SHA_A refs/heads/feature-x $SHA_B" \
  SPECKIT_SKIP_PREPUSH_ROUTE_GATE=1 SPECKIT_ALLOW_MASS_DELETION=1 SPECKIT_ALLOW_REMOTE_PUSH=1
ln -s "$REAL_NAMING" "$TMP/.opencode/skills/sk-git/scripts/worktree-naming.sh"
expect_hook_says "a missing deletion guard library blocks an update push" \
  1 "guard library is missing" "refs/heads/main $SHA_A refs/heads/main $SHA_B" \
  SPECKIT_SKIP_PREPUSH_ROUTE_GATE=1
expect_hook "...unless SPECKIT_ALLOW_MASS_DELETION=1 approves it" \
  0 "refs/heads/main $SHA_A refs/heads/main $SHA_B" \
  SPECKIT_SKIP_PREPUSH_ROUTE_GATE=1 SPECKIT_ALLOW_MASS_DELETION=1
expect_hook_says "a missing route guard blocks the push" \
  1 "route guard is missing" "refs/heads/main $SHA_A refs/heads/main $SHA_B" \
  SPECKIT_ALLOW_MASS_DELETION=1
rm -f "$SENTINEL"

rm -f "$TMP/.opencode/skills/sk-git/scripts/worktree-naming.sh"
expect_hook "missing gate scripts never block a push in another repository" \
  0 "refs/heads/feature-x $SHA_A refs/heads/feature-x $SHA_B"
ln -s "$REAL_NAMING" "$TMP/.opencode/skills/sk-git/scripts/worktree-naming.sh"

# ── report ──────────────────────────────────────────────────────
echo "pre-push tests: PASS=$PASS FAIL=$FAIL"
[ "$FAIL" -eq 0 ]
~~~~
