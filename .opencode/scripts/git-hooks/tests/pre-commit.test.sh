#!/usr/bin/env bash
# Test harness for the pre-commit hook's two auto re-mint gates: compiled routing
# and spec derived metadata.
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

# ══ spec derived-metadata gate ══════════════════════════════════════════════
# Its own fixture: a packet carrying graph-metadata.json plus a stub repair tool,
# so the cases exercise the gate's path-walking and staging rather than the real
# re-derivation, which has its own tests.
PKT="specs/hooks/001-fixture"
CHILD="specs/hooks/002-parent/001-child"
GROUP="specs/hooks/002-parent/research"

setup_spec_fixture() {
  rm -rf "$TMP"; mkdir -p "$TMP"
  git -C "$TMP" init -q
  git -C "$TMP" config core.hooksPath /dev/null
  git -C "$TMP" config user.email t@example.com
  git -C "$TMP" config user.name test
  mkdir -p "$TMP/$PKT/scratch" "$TMP/$CHILD" "$TMP/specs/hooks/002-parent" \
           "$TMP/.opencode/skills/system-spec-kit/runtime/cli/spec"
  for d in "$PKT" "$CHILD" "specs/hooks/002-parent"; do
    echo "# spec" > "$TMP/$d/spec.md"
    echo '{"fingerprint":"old"}' > "$TMP/$d/graph-metadata.json"
    echo '{"d":"old"}' > "$TMP/$d/description.json"
  done
  echo "working file" > "$TMP/$PKT/scratch/notes.md"
  # A grouping directory: carries metadata but is not a packet, because it has no
  # spec.md. The real repository has eight of these, and the re-derive tool exits
  # non-zero on them, so the gate must walk past rather than into one.
  mkdir -p "$TMP/$GROUP"
  echo '{"fingerprint":"old"}' > "$TMP/$GROUP/graph-metadata.json"
  echo "# a note" > "$TMP/$GROUP/notes.md"
  # Stub repair tool: rewrites both derived files so a change is visible, unless
  # told to fail or to behave as the common no-op.
  cat > "$TMP/.opencode/skills/system-spec-kit/runtime/cli/spec/repair-derived.cjs" <<'REPAIR'
const fs = require('fs');
const path = require('path');
fs.appendFileSync(path.join(process.cwd(), 'repair-calls.log'), 'call\n');
if (process.env.STUB_REPAIR_FAIL === '1') { console.error('stub repair refused'); process.exit(1); }
if (process.env.STUB_REPAIR_NOOP === '1') { console.log('inspected=1 repairable=0'); process.exit(0); }
const folders = process.argv.reduce((acc, tok, i) =>
  (tok === '--folder' ? [...acc, process.argv[i + 1]] : acc), []);
for (const folder of folders) {
  for (const f of ['graph-metadata.json', 'description.json']) {
    fs.writeFileSync(path.join(process.cwd(), folder, f), JSON.stringify({ fingerprint: Date.now() }));
  }
}
REPAIR
  git -C "$TMP" add -A >/dev/null
  git -C "$TMP" commit -qm init
}

# ── 8. nothing under specs/ staged: the gate must not speak ──
setup_spec_fixture
echo "unrelated" > "$TMP/notes.md"; git -C "$TMP" add notes.md
run_hook; RC=$?
check "no spec doc is a silent no-op" 0 "$RC"
grep -q 'spec-remint' "$TMP/out.log" && { echo "FAIL  spec gate spoke on an unrelated commit"; FAIL=$((FAIL + 1)); }

# ── 9. a staged spec doc re-derives its packet and stages both derived files ──
setup_spec_fixture
echo "# edited" > "$TMP/$PKT/spec.md"; git -C "$TMP" add "$PKT/spec.md"
run_hook; RC=$?
check "staged spec doc re-derives its packet" 0 "$RC" "re-derived $PKT"
STAGED="$(git -C "$TMP" diff --cached --name-only | grep -cE 'graph-metadata.json|description.json')"
if [[ "$STAGED" == "2" ]]; then echo "PASS  both derived files reached the index"; PASS=$((PASS + 1))
else echo "FAIL  expected 2 staged derived files, got $STAGED"; FAIL=$((FAIL + 1)); fi

# ── 10. a packet staged and unstaged at once is refused ──
setup_spec_fixture
echo "# staged" > "$TMP/$PKT/spec.md"; git -C "$TMP" add "$PKT/spec.md"
echo "# unstaged too" > "$TMP/$PKT/spec.md"
run_hook; RC=$?
check "partly staged packet is refused" 1 "$RC" "staged and unstaged at once"

# ── 11. a repair failure blocks and shows the tool's own output ──
setup_spec_fixture
echo "# edited" > "$TMP/$PKT/spec.md"; git -C "$TMP" add "$PKT/spec.md"
STUB_REPAIR_FAIL=1 run_hook; RC=$?
check "repair failure blocks with its output" 1 "$RC" "stub repair refused"

# ── 12. a no-op repair passes without claiming it staged anything ──
setup_spec_fixture
echo "# edited" > "$TMP/$PKT/spec.md"; git -C "$TMP" add "$PKT/spec.md"
STUB_REPAIR_NOOP=1 run_hook; RC=$?
check "a no-op repair is silent" 0 "$RC"
grep -q 're-derived' "$TMP/out.log" && { echo "FAIL  gate claimed a re-derive that wrote nothing"; FAIL=$((FAIL + 1)); }

# ── 13. a phase child resolves to the child, not its parent ──
# The packet is the NEAREST ancestor carrying graph-metadata.json. Walking to the
# parent instead would re-derive the wrong folder and leave the child stale.
setup_spec_fixture
echo "# edited" > "$TMP/$CHILD/spec.md"; git -C "$TMP" add "$CHILD/spec.md"
run_hook; RC=$?
check "a phase child resolves to itself" 0 "$RC" "re-derived $CHILD"
grep -q "re-derived specs/hooks/002-parent " "$TMP/out.log" && { echo "FAIL  gate re-derived the parent as well"; FAIL=$((FAIL + 1)); }

# ── 14. a scratch/ file is not a packet document ──
setup_spec_fixture
echo "changed" > "$TMP/$PKT/scratch/notes.md"; git -C "$TMP" add "$PKT/scratch/notes.md"
run_hook; RC=$?
check "a scratch file does not trigger the gate" 0 "$RC"
grep -q 'spec-remint' "$TMP/out.log" && { echo "FAIL  gate fired on a scratch file"; FAIL=$((FAIL + 1)); }

# ── 15. a pathspec-narrowed commit is refused, because git discards that index ──
setup_spec_fixture
echo "# edited" > "$TMP/$PKT/spec.md"; git -C "$TMP" add "$PKT/spec.md"
( cd "$TMP" && cp .git/index "$TMP/.git/next-index-1234.lock"
  GIT_INDEX_FILE="$TMP/.git/next-index-1234.lock" bash "$HOOK" >"$TMP/out.log" 2>&1 )
RC=$?
check "pathspec-narrowed spec commit is refused" 1 "$RC" "narrows its"

# ── 16. a grouping directory with metadata but no spec.md is walked past ──
# The re-derive tool refuses these ("target is not a spec folder"), so keying the
# packet on metadata alone would turn every such commit into a block.
setup_spec_fixture
echo "# edited" > "$TMP/$GROUP/notes.md"; git -C "$TMP" add "$GROUP/notes.md"
run_hook; RC=$?
check "a metadata-only directory resolves to its packet parent" 0 "$RC" "re-derived specs/hooks/002-parent"
grep -q "re-derived $GROUP" "$TMP/out.log" && { echo "FAIL  gate tried to re-derive a non-packet"; FAIL=$((FAIL + 1)); }

# ── 17. two packets in one commit are re-derived in a single process ──
# The gate batches every staged packet into one node call, because spawning per
# packet was the entire cost: 3 packets measured 4.47s serially against 1.59s
# batched. A stub honouring only the first --folder would let a broken batch pass,
# which is why the stub above reads them all.
setup_spec_fixture
echo "# edited" > "$TMP/$PKT/spec.md"; git -C "$TMP" add "$PKT/spec.md"
echo "# edited" > "$TMP/$CHILD/spec.md"; git -C "$TMP" add "$CHILD/spec.md"
run_hook; RC=$?
check "two packets re-derive together" 0 "$RC" "re-derived $PKT"
if grep -q "re-derived $CHILD" "$TMP/out.log"; then
  echo "PASS  the second packet was re-derived too"; PASS=$((PASS + 1))
else
  echo "FAIL  the second packet was not re-derived"; FAIL=$((FAIL + 1))
fi
# The assertion that makes this a batching test rather than a re-derive test:
# two packets must cost exactly one process. Without it the case passes against
# the per-packet loop it replaced, and proves nothing about the change.
CALLS="$(grep -c . "$TMP/repair-calls.log" 2>/dev/null || echo 0)"
if [[ "$CALLS" == "1" ]]; then
  echo "PASS  two packets cost one node invocation"; PASS=$((PASS + 1))
else
  echo "FAIL  expected 1 node invocation for 2 packets, got $CALLS"; FAIL=$((FAIL + 1))
fi
STAGED="$(git -C "$TMP" diff --cached --name-only | grep -cE 'graph-metadata.json|description.json')"
if [[ "$STAGED" == "4" ]]; then echo "PASS  all four derived files reached the index"; PASS=$((PASS + 1))
else echo "FAIL  expected 4 staged derived files, got $STAGED"; FAIL=$((FAIL + 1)); fi

echo ""
echo "pre-commit auto re-mint gates: $PASS passed, $FAIL failed"
[[ "$FAIL" -eq 0 ]]
