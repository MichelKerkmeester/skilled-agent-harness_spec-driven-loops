# Edits for unit t019

Each edit names a file, an OLD block and a NEW block. The block is the text between its two fence lines, without the fence lines themselves.

## Edit 1

File: `.opencode/scripts/git-hooks/pre-push`

OLD:

~~~~text
if [[ -z "$REPO_ROOT" ]]; then
  exit 0
fi

~~~~

NEW:

~~~~text
if [[ -z "$REPO_ROOT" ]]; then
  exit 0
fi

# The hook is installed globally, so a gate script can be missing for two reasons: this
# repository does not ship the toolchain, which leaves the gate nothing to check, or it
# does and the install is broken. The spec-kit sentinel tells the two apart, under
# either source root.
_in_toolchain_repo() {
  [[ -f "$REPO_ROOT/.opencode/skills/system-spec-kit/SKILL.md" \
     || -f "$REPO_ROOT/.skilled/skills/system-spec-kit/SKILL.md" ]]
}

~~~~

## Edit 2

File: `.opencode/scripts/git-hooks/pre-push`

OLD:

~~~~text
diff --quiet "$remote_sha" "$local_sha" -- .opencode/skills 2>/dev/null; then
~~~~

NEW:

~~~~text
diff --quiet "$remote_sha" "$local_sha" -- .opencode/skills .skilled/skills 2>/dev/null; then
~~~~

## Edit 3

File: `.opencode/scripts/git-hooks/pre-push`

OLD:

~~~~text
  if [[ "$SKILL_CHANGES_PUSHED" -eq 1 && ! -f "$SKILL_GATE" ]]; then
    echo "WARNING [gate:skill-root-metadata]: checker missing; push gate failed open." >&2
  elif
~~~~

NEW:

~~~~text
  if [[ "$SKILL_CHANGES_PUSHED" -eq 1 && ! -f "$SKILL_GATE" ]]; then
    # Only a checkout that ships the toolchain has a checker to miss.
    if _in_toolchain_repo; then
      echo "WARNING [gate:skill-root-metadata]: checker is missing: $SKILL_GATE; push gate failed open." >&2
    fi
  elif
~~~~

## Edit 4

File: `.opencode/scripts/git-hooks/pre-push`

OLD:

~~~~text
    '.opencode/skills/*/SKILL.md'
  )
~~~~

NEW:

~~~~text
    '.opencode/skills/*/SKILL.md'
    '.skilled/bin/lib/compiled-routing/013-live-activation/activation/*/manifest.json'
    '.skilled/skills/*/hub-router.json'
    '.skilled/skills/*/mode-registry.json'
    '.skilled/skills/*/leaf-manifest.json'
    '.skilled/skills/*/ROUTER.md'
    '.skilled/skills/*/SKILL.md'
  )
~~~~

## Edit 5

File: `.opencode/scripts/git-hooks/tests/pre-push.test.sh`

OLD:

~~~~text
# Test harness for the pre-push hook's two independent gates (naming +
# remote-push-permission). Runs entirely inside a throwaway git repo
~~~~

NEW:

~~~~text
# Test harness for the pre-push hook's two independent gates (naming +
# remote-push-permission), and for how its gates treat a pushed range under
# .skilled/ and a gate script that is missing. Runs entirely inside a throwaway git repo
~~~~

## Edit 6

File: `.opencode/scripts/git-hooks/tests/pre-push.test.sh`

OLD:

~~~~text
# ── report ──────────────────────────────────────────────────────
echo "pre-push tests: PASS=$PASS FAIL=$FAIL"
[ "$FAIL" -eq 0 ]
~~~~

NEW:

~~~~text
# ── source-root cases ──────────────────────────────────────────
# A pushed range under .skilled/ must reach the skill and routing gates, and a gate
# script missing from a checkout that ships the toolchain must never pass in
# silence. These cases push real commits, because both gates read the pushed range
# rather than the ref line. The spec-kit sentinel marks such a checkout; without it
# the fixture stands in for any other repository the global hook runs in.
expect_hook_says() { # expect_hook_says <desc> <expected-rc> <stderr substring> <line> [env-assignment...]
  local desc="$1" exp="$2" needle="$3" line="$4"; shift 4
  local rc=0
  _hook_rc "$line" "$@" || rc=$?
  if [ "$rc" = "$exp" ] && grep -qF -- "$needle" "$TMP/last.err"; then
    PASS=$((PASS+1))
  else
    FAIL=$((FAIL+1))
    echo "FAIL: $desc (rc=$rc exp=$exp, wanted '$needle')"
    sed 's/^/    err> /' "$TMP/last.err" >&2 || true
  fi
}
expect_quiet() { # expect_quiet <desc> <substring the last run's stderr must not carry>
  if grep -qF -- "$2" "$TMP/last.err"; then
    FAIL=$((FAIL+1)); echo "FAIL: $1 (stderr carried '$2')"
  else
    PASS=$((PASS+1))
  fi
}
SENTINEL="$TMP/.opencode/skills/system-spec-kit/SKILL.md"
SKILL_CHECKER="$TMP/.opencode/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs"
BASE_SHA="$(git -C "$TMP" rev-parse HEAD)"
mkdir -p "$TMP/.skilled/skills/demo"
printf 'name: demo\n' > "$TMP/.skilled/skills/demo/SKILL.md"
printf '{}\n' > "$TMP/.skilled/skills/demo/hub-router.json"
git -C "$TMP" add .skilled
git -C "$TMP" commit -q -m 'a skill under .skilled'
SKILLED_SHA="$(git -C "$TMP" rev-parse HEAD)"

mkdir -p "$(dirname "$SKILL_CHECKER")"
printf '%s\n' "require('fs').writeFileSync('skill-gate-calls.log', 'called');" > "$SKILL_CHECKER"
expect_hook "a range that changes only .skilled/skills passes the skill gate" \
  0 "refs/heads/main $SKILLED_SHA refs/heads/main $BASE_SHA"
if grep -q called "$TMP/skill-gate-calls.log" 2>/dev/null; then PASS=$((PASS+1))
else FAIL=$((FAIL+1)); echo "FAIL: a range under .skilled/skills never reached the skill-root metadata checker"; fi
rm -f "$SKILL_CHECKER" "$TMP/skill-gate-calls.log"

mkdir -p "$(dirname "$SENTINEL")"; printf 'name: system-spec-kit\n' > "$SENTINEL"
expect_hook_says "a missing skill checker warns with its path where the toolchain ships" \
  0 "checker is missing: " "refs/heads/main $SKILLED_SHA refs/heads/main $BASE_SHA" \
  SPECKIT_SKIP_PREPUSH_ROUTE_GATE=1 SPECKIT_ALLOW_MASS_DELETION=1
rm -f "$SENTINEL"

mkdir -p "$TMP/.opencode/skills/demo-two"
printf 'name: demo-two\n' > "$TMP/.opencode/skills/demo-two/SKILL.md"
git -C "$TMP" add -f .opencode/skills/demo-two
git -C "$TMP" commit -q -m 'a skill under .opencode'
OPENCODE_SHA="$(git -C "$TMP" rev-parse HEAD)"
expect_hook "a missing skill checker in another repository lets the push through" \
  0 "refs/heads/main $OPENCODE_SHA refs/heads/main $SKILLED_SHA"
expect_quiet "...and says nothing about the checker" "skill-root-metadata"

printf '{"drift":1}\n' > "$TMP/.skilled/skills/demo/hub-router.json"
expect_hook_says "drift in a .skilled routing input blocks the push" \
  1 "routing-commit-parity" "refs/heads/main $OPENCODE_SHA refs/heads/main $SKILLED_SHA"
git -C "$TMP" checkout -q -- .skilled/skills/demo/hub-router.json

# ── report ──────────────────────────────────────────────────────
echo "pre-push tests: PASS=$PASS FAIL=$FAIL"
[ "$FAIL" -eq 0 ]
~~~~
