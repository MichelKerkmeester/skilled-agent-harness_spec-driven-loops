#!/usr/bin/env bash
# Test harness for the pre-commit hook's compiled-routing re-mint gate.
#
# Runs entirely inside a throwaway git repo carrying a fixture hub, a stub mint
# tool and stub route modules, so it never touches the real clone's index, its
# manifests, or the operator's global git config. The gate is exercised through
# the real hook file rather than a copy, so a change to the block is covered here
# even when nobody remembers to update this harness.
#
# The other sub-gates are silenced through their own bypass flags: this harness
# is about the re-mint gate, and an unrelated dirty mirror in the caller's clone
# would otherwise make every case fail for the wrong reason.
set -uo pipefail

# git resolves its repository from these in preference to -C/cwd. Clear them so the
# fixture stays hermetic even when the caller sits inside a worktree.
unset GIT_DIR GIT_WORK_TREE GIT_COMMON_DIR GIT_INDEX_FILE GIT_OBJECT_DIRECTORY \
      GIT_ALTERNATE_OBJECT_DIRECTORIES GIT_CONFIG GIT_CONFIG_SYSTEM \
      GIT_CONFIG_COUNT GIT_NAMESPACE GIT_CEILING_DIRECTORIES

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd -P)"
REPO_ROOT="$(git -C "$SCRIPT_DIR" rev-parse --show-toplevel)"
HOOK="$REPO_ROOT/.opencode/scripts/git-hooks/pre-commit"

PASS=0; FAIL=0
export GIT_CONFIG_GLOBAL=/dev/null
export SPECKIT_SKIP_COMMENT_HYGIENE=1 SPECKIT_SKIP_MIRROR_PARITY=1 \
       SPECKIT_SKIP_CARD_SYNC=1 SPECKIT_SKIP_MCP_MUTATION_CLASS=1 \
       SPECKIT_SKIP_DOC_MODEL_VALIDATE=1

TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

ACT=".opencode/bin/lib/compiled-routing/013-live-activation/activation"
AUTH="specs/sk-doc/019-skill-routing-refactor/015-router-unification-program/013-live-activation/activation"
HUB="sk-doc"

setup_fixture() {
  rm -rf "$TMP"; mkdir -p "$TMP"
  git -C "$TMP" init -q
  git -C "$TMP" config core.hooksPath /dev/null
  git -C "$TMP" config user.email t@example.com
  git -C "$TMP" config user.name test
  mkdir -p "$TMP/.opencode/skills/$HUB" "$TMP/.opencode/bin/lib" \
           "$TMP/$ACT/$HUB" "$TMP/$AUTH/$HUB"
  echo "hub skill" > "$TMP/.opencode/skills/$HUB/SKILL.md"
  echo '{"pin":0}' > "$TMP/$ACT/$HUB/manifest.json"
  echo '{"pin":0}' > "$TMP/$AUTH/$HUB/manifest.json"
  # Stub guard module: the gate reads its hub list from here rather than carrying one.
  printf 'module.exports = { HUBS: ["%s"] };\n' "$HUB" \
    > "$TMP/.opencode/bin/compiled-route-guard.cjs"
  # Stub layout module: returns the activation root the gate then derives both paths from.
  cat > "$TMP/.opencode/bin/lib/compiled-route-layout.cjs" <<'MODULE'
const path = require('path');
module.exports = {
  activationRootFor: (runtimeRoot) =>
    path.join(runtimeRoot, '013-live-activation', 'activation'),
};
MODULE
  # Stub mint tool: rewrites the runtime manifest so freshness visibly changes.
  cat > "$TMP/.opencode/bin/compiled-route-manifest.cjs" <<'MINT'
const fs = require('fs');
const path = require('path');
const hub = process.argv[process.argv.indexOf('--hub') + 1];
const target = path.join(process.cwd(),
  '.opencode/bin/lib/compiled-routing/013-live-activation/activation', hub, 'manifest.json');
if (process.env.STUB_MINT_FAIL === '1') { console.error('stub mint refused'); process.exit(1); }
fs.writeFileSync(target, JSON.stringify({ pin: Date.now() }));
MINT
  git -C "$TMP" add -A >/dev/null
  git -C "$TMP" commit -qm init
}

# Run the real hook inside the fixture. Prints nothing; the caller reads $? and the log.
run_hook() { ( cd "$TMP" && bash "$HOOK" >"$TMP/out.log" 2>&1 ); }

check() { # check <label> <expected-rc> <actual-rc> [<substring the log must contain>]
  local label="$1" want="$2" got="$3" needle="${4:-}"
  if [[ "$got" != "$want" ]]; then
    echo "FAIL  $label: expected rc $want, got $got"; sed 's/^/        /' "$TMP/out.log" | tail -5
    FAIL=$((FAIL + 1)); return
  fi
  if [[ -n "$needle" ]] && ! grep -q "$needle" "$TMP/out.log"; then
    echo "FAIL  $label: log did not contain '$needle'"; sed 's/^/        /' "$TMP/out.log" | tail -5
    FAIL=$((FAIL + 1)); return
  fi
  echo "PASS  $label"; PASS=$((PASS + 1))
}

# ── 1. nothing under a hub staged: the gate must not speak or start node ──
setup_fixture
echo "unrelated" > "$TMP/notes.md"; git -C "$TMP" add notes.md
run_hook; RC=$?
check "no routing input is a silent no-op" 0 "$RC"
grep -q 'route-remint' "$TMP/out.log" && { echo "FAIL  gate spoke on an unrelated commit"; FAIL=$((FAIL + 1)); }

# ── 2. a staged hub SKILL.md is re-minted and BOTH manifests reach the index ──
setup_fixture
echo "edited" > "$TMP/.opencode/skills/$HUB/SKILL.md"
git -C "$TMP" add ".opencode/skills/$HUB/SKILL.md"
run_hook; RC=$?
check "staged SKILL.md re-mints the hub" 0 "$RC" "re-minted $HUB"
STAGED="$(git -C "$TMP" diff --cached --name-only | grep -c 'manifest.json')"
if [[ "$STAGED" == "2" ]]; then echo "PASS  both manifests reached the index"; PASS=$((PASS + 1))
else echo "FAIL  expected 2 staged manifests, got $STAGED"; FAIL=$((FAIL + 1)); fi

# ── 3. an input staged and unstaged at once is refused, not minted from the tree ──
setup_fixture
echo "staged" > "$TMP/.opencode/skills/$HUB/SKILL.md"
git -C "$TMP" add ".opencode/skills/$HUB/SKILL.md"
echo "unstaged too" > "$TMP/.opencode/skills/$HUB/SKILL.md"
run_hook; RC=$?
check "partly staged input is refused" 1 "$RC" "staged and unstaged at once"

# ── 4. a missing authored manifest blocks rather than exiting zero in silence ──
setup_fixture
echo "edited" > "$TMP/.opencode/skills/$HUB/SKILL.md"
git -C "$TMP" add ".opencode/skills/$HUB/SKILL.md"
rm "$TMP/$AUTH/$HUB/manifest.json"
run_hook; RC=$?
check "missing authored manifest blocks" 1 "$RC" "cannot be re-minted"

# ── 5. a mint failure blocks and shows the tool's own output ──
setup_fixture
echo "edited" > "$TMP/.opencode/skills/$HUB/SKILL.md"
git -C "$TMP" add ".opencode/skills/$HUB/SKILL.md"
STUB_MINT_FAIL=1 run_hook; RC=$?
check "mint failure blocks with its output" 1 "$RC" "stub mint refused"

# ── 6. a pathspec-narrowed commit is refused, because git discards that index ──
# git names the throwaway index next-index-<pid>.lock, which is the whole
# discriminator: a plain commit uses .git/index and -a uses .git/index.lock, and
# staging into either of those is correct.
setup_fixture
echo "edited" > "$TMP/.opencode/skills/$HUB/SKILL.md"
git -C "$TMP" add ".opencode/skills/$HUB/SKILL.md"
( cd "$TMP" && GIT_INDEX_FILE="$TMP/.git/next-index-1234.lock" \
    git ls-files --stage >/dev/null 2>&1
  cp .git/index "$TMP/.git/next-index-1234.lock"
  GIT_INDEX_FILE="$TMP/.git/next-index-1234.lock" bash "$HOOK" >"$TMP/out.log" 2>&1 )
RC=$?
check "pathspec-narrowed commit is refused" 1 "$RC" "narrows its"

# ── 7. a staged deletion does not mint against a tree the leaf has left ──
setup_fixture
git -C "$TMP" rm -q ".opencode/skills/$HUB/SKILL.md"
run_hook; RC=$?
check "staged deletion is not a mint trigger" 0 "$RC"

echo ""
echo "pre-commit route-remint gate: $PASS passed, $FAIL failed"
[[ "$FAIL" -eq 0 ]]
