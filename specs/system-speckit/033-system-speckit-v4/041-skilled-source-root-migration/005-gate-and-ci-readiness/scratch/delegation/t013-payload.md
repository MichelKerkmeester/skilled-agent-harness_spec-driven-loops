# Edits for unit t013

Each edit names a file, an OLD block and a NEW block. The block is the text between its two fence lines, without the fence lines themselves.

## Edit 1

File: `.opencode/scripts/git-hooks/pre-commit`

OLD:

~~~~text
done < <(git diff --cached --name-only --diff-filter=ACMD | grep -E '^\.(opencode|claude)/agents/' || true)
~~~~

NEW:

~~~~text
done < <(git diff --cached --name-only --diff-filter=ACMD | grep -E '^\.(opencode|skilled|claude)/agents/' || true)
~~~~

## Edit 2

File: `.opencode/scripts/git-hooks/pre-commit`

OLD:

~~~~text
    .opencode/commands/README.txt
  )
~~~~

NEW:

~~~~text
    .opencode/commands/README.txt .skilled/commands/README.txt
  )
~~~~

## Edit 3

File: `.opencode/scripts/git-hooks/pre-commit`

OLD:

~~~~text
    .opencode/skills/system-spec-kit/runtime/cli/codex
  )
~~~~

NEW:

~~~~text
    .opencode/skills/system-spec-kit/runtime/cli/codex
    .skilled/agents .skilled/commands .skilled/hooks
    .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors
    .skilled/skills/system-spec-kit/runtime/cli/codex
  )
~~~~

## Edit 4

File: `.opencode/scripts/git-hooks/pre-commit`

OLD:

~~~~text
  UNSTAGED_MIRROR="$( { git diff --name-only -- "${MIRROR_OUTPUTS[@]}" '.opencode/commands/*/README.txt' '.opencode/skills/*/command-metadata.json'; git ls-files --others --exclude-standard -- "${MIRROR_OUTPUTS[@]}"; } 2>/dev/null )"
~~~~

NEW:

~~~~text
  UNSTAGED_MIRROR="$( { git diff --name-only -- "${MIRROR_OUTPUTS[@]}" '.opencode/commands/*/README.txt' '.opencode/skills/*/command-metadata.json' '.skilled/commands/*/README.txt' '.skilled/skills/*/command-metadata.json'; git ls-files --others --exclude-standard -- "${MIRROR_OUTPUTS[@]}"; } 2>/dev/null )"
~~~~

## Edit 5

File: `.opencode/scripts/git-hooks/pre-commit`

OLD:

~~~~text
    STAGED_MIRROR_RELATED="$(git diff --cached --name-only -- "${MIRROR_OUTPUTS[@]}" "${MIRROR_SOURCES[@]}" '.opencode/skills/*/command-metadata.json' 2>/dev/null)"
~~~~

NEW:

~~~~text
    STAGED_MIRROR_RELATED="$(git diff --cached --name-only -- "${MIRROR_OUTPUTS[@]}" "${MIRROR_SOURCES[@]}" '.opencode/skills/*/command-metadata.json' '.skilled/skills/*/command-metadata.json' 2>/dev/null)"
~~~~

## Edit 6

File: `.opencode/scripts/git-hooks/tests/pre-commit.test.sh`

OLD:

~~~~text
# Test harness for the pre-commit hook's two auto re-mint gates: compiled routing
# and spec derived metadata.
~~~~

NEW:

~~~~text
# Test harness for the pre-commit hook's two auto re-mint gates, compiled routing
# and spec derived metadata, and for how every gate treats a source tree under
# .skilled/ and a gate script that is missing.
~~~~

## Edit 7

File: `.opencode/scripts/git-hooks/tests/pre-commit.test.sh`

OLD:

~~~~text
# The other sub-gates are silenced through their own bypass flags: this harness
# is about the re-mint gate, and an unrelated dirty mirror in the caller's clone
# would otherwise make every case fail for the wrong reason.
~~~~

NEW:

~~~~text
# The other sub-gates are silenced through their own bypass flags, and a case lifts
# only the flag of the gate it exercises: an unrelated dirty mirror in the caller's
# clone would otherwise make every case fail for the wrong reason.
~~~~

## Edit 8

File: `.opencode/scripts/git-hooks/tests/pre-commit.test.sh`

OLD:

~~~~text
echo ""
echo "pre-commit auto re-mint gates: $PASS passed, $FAIL failed"
[[ "$FAIL" -eq 0 ]]
~~~~

NEW:

~~~~text
# ══ source-root gates ═══════════════════════════════════════════════════════
# The gates must match changes under .skilled/ as well as .opencode/, and a gate
# script missing from a checkout that ships the toolchain must never pass in
# silence. Each case starts from a bare repository. "toolchain" plants the
# spec-kit sentinel that marks such a checkout; without it the repository stands
# in for any other repository the globally installed hook runs in.
setup_gate_fixture() { # setup_gate_fixture [toolchain]
  rm -rf "$TMP"; mkdir -p "$TMP"
  git -C "$TMP" init -q
  git -C "$TMP" config core.hooksPath /dev/null
  git -C "$TMP" config user.email t@example.com
  git -C "$TMP" config user.name test
  echo "seed" > "$TMP/seed.txt"
  if [[ "${1:-}" == "toolchain" ]]; then
    mkdir -p "$TMP/.opencode/skills/system-spec-kit"
    echo "sentinel" > "$TMP/.opencode/skills/system-spec-kit/SKILL.md"
  fi
  git -C "$TMP" add -A >/dev/null
  git -C "$TMP" commit -qm init
}

# Stage one new file with the given content, creating its directories.
stage_new() { # stage_new <path> <content>
  mkdir -p "$TMP/$(dirname "$1")"
  printf '%s\n' "$2" > "$TMP/$1"
  git -C "$TMP" add -- "$1"
}

# ── 21. a staged .skilled agent reaches the agent mirror checker ──
setup_gate_fixture
mkdir -p "$TMP/.opencode/skills/system-deep-loop/deep-improvement/scripts"
cat > "$TMP/.opencode/skills/system-deep-loop/deep-improvement/scripts/check-agent-mirror-sync.cjs" <<'CHECKER'
require('fs').appendFileSync('checker-calls.log', process.argv.slice(2).join('\n') + '\n');
CHECKER
stage_new ".skilled/agents/probe.md" "agent"
run_hook; RC=$?
check "a .skilled agent passes the mirror gate" 0 "$RC"
if grep -qxF '.skilled/agents/probe.md' "$TMP/checker-calls.log" 2>/dev/null; then
  echo "PASS  the mirror checker was handed the .skilled agent"; PASS=$((PASS + 1))
else
  echo "FAIL  the mirror checker never saw .skilled/agents/probe.md"; FAIL=$((FAIL + 1))
fi

# ── 22. a dirty .skilled mirror output blocks a commit that stages a .skilled source ──
setup_gate_fixture
stage_new ".skilled/commands/README.txt" "catalog"
git -C "$TMP" commit -qm catalog
echo "catalog regenerated" > "$TMP/.skilled/commands/README.txt"
stage_new ".skilled/hooks/probe.sh" "hook"
SPECKIT_SKIP_MIRROR_PARITY=0 run_hook; RC=$?
check "a dirty .skilled mirror blocks its source" 1 "$RC" "a generated mirror has changes that are not staged"

echo ""
echo "pre-commit gates: $PASS passed, $FAIL failed"
[[ "$FAIL" -eq 0 ]]
~~~~
