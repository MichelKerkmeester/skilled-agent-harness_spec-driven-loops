#!/usr/bin/env bash
# Test harness for the pre-commit hook's two auto re-mint gates, compiled routing
# and spec derived metadata, and for how every gate treats a source tree under
# .skilled/ and a gate script that is missing.
#
# Runs entirely inside a throwaway git repo carrying a fixture hub, a stub mint
# tool and stub route modules, so it never touches the real clone's index, its
# manifests, or the operator's global git config. The gate is exercised through
# the real hook file rather than a copy, so a change to the block is covered here
# even when nobody remembers to update this harness.
#
# The other sub-gates are silenced through their own bypass flags, and a case lifts
# only the flag of the gate it exercises: an unrelated dirty mirror in the caller's
# clone would otherwise make every case fail for the wrong reason.
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

# ── 18. a route-remint block names its bypass, so an unattended caller can escape ──
setup_fixture
echo "staged" > "$TMP/.opencode/skills/$HUB/SKILL.md"
git -C "$TMP" add ".opencode/skills/$HUB/SKILL.md"
echo "unstaged too" > "$TMP/.opencode/skills/$HUB/SKILL.md"
run_hook; RC=$?
check "route block names its bypass" 1 "$RC" "Bypass: SPECKIT_SKIP_ROUTE_REMINT=1"

# ── 19. a spec-remint block names its bypass too ──
setup_spec_fixture
echo "# staged" > "$TMP/$PKT/spec.md"; git -C "$TMP" add "$PKT/spec.md"
echo "# unstaged too" > "$TMP/$PKT/spec.md"
run_hook; RC=$?
check "spec block names its bypass" 1 "$RC" "Bypass: SPECKIT_SKIP_SPEC_REMINT=1"

# ── 20. a packet dirty only in the gate's own derived files re-derives ──
# The derived files are outputs, not derivation inputs, so their dirt cannot make
# the metadata describe content the commit lacks. Blocking on it wedged automated
# committers behind a file the gate itself rewrites.
setup_spec_fixture
echo "# edited" > "$TMP/$PKT/spec.md"; git -C "$TMP" add "$PKT/spec.md"
echo '{"fingerprint":"manual"}' > "$TMP/$PKT/graph-metadata.json"
run_hook; RC=$?
check "a packet dirty only in derived files re-derives" 0 "$RC" "re-derived $PKT"

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

# ── 23. a missing kill switch warns where the toolchain ships, and gates stay on ──
setup_gate_fixture toolchain
stage_new "notes.md" "note"
run_hook; RC=$?
check "a missing kill switch warns and leaves gates on" 0 "$RC" "hook-flags.sh is missing"

# ── 24. a missing comment checker blocks where the toolchain ships ──
setup_gate_fixture toolchain
stage_new "notes.md" "note"
SPECKIT_SKIP_COMMENT_HYGIENE=0 run_hook; RC=$?
check "a missing comment checker blocks" 1 "$RC" "checker is missing or not executable: "

# ── 25. a missing agent mirror checker blocks where the toolchain ships ──
setup_gate_fixture toolchain
stage_new ".opencode/agents/probe.md" "agent"
run_hook; RC=$?
check "a missing agent mirror checker blocks" 1 "$RC" "agent-mirror-sync]: checker is missing"

# ── 26. a missing mirror parity script blocks where the toolchain ships ──
setup_gate_fixture toolchain
stage_new "notes.md" "note"
SPECKIT_SKIP_MIRROR_PARITY=0 run_hook; RC=$?
check "a missing mirror parity script blocks" 1 "$RC" "mirror-parity]: script is missing"

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

# The route fixture laid out the way the tree ships once it moves: the files under
# .skilled/, and .opencode a tracked relative link to it.
setup_linked_fixture() {
  setup_fixture
  git -C "$TMP" mv .opencode .skilled
  ln -s .skilled "$TMP/.opencode"
  git -C "$TMP" add .opencode
  git -C "$TMP" commit -qm "move the source root"
}

# ── 31. a hub under a linked source root re-mints and stages through the real directory ──
setup_linked_fixture
echo "edited" > "$TMP/.skilled/skills/$HUB/SKILL.md"
git -C "$TMP" add ".skilled/skills/$HUB/SKILL.md"
run_hook; RC=$?
check "a .skilled hub re-mints through the link" 0 "$RC" "re-minted $HUB"
STAGED="$(git -C "$TMP" diff --cached --name-only | grep -c 'manifest.json')"
if [[ "$STAGED" == "2" ]]; then echo "PASS  both manifests reached the index under the real root"; PASS=$((PASS + 1))
else echo "FAIL  expected 2 staged manifests under the real root, got $STAGED"; FAIL=$((FAIL + 1)); fi

# ── 32. a partly staged input under a linked source root is still refused ──
setup_linked_fixture
echo "staged" > "$TMP/.skilled/skills/$HUB/SKILL.md"
git -C "$TMP" add ".skilled/skills/$HUB/SKILL.md"
echo "unstaged too" > "$TMP/.skilled/skills/$HUB/SKILL.md"
run_hook; RC=$?
check "a partly staged .skilled input is refused" 1 "$RC" "staged and unstaged at once"

# ── 33. a missing route module still blocks where the toolchain ships ──
setup_fixture
mkdir -p "$TMP/.opencode/skills/system-spec-kit"
echo "sentinel" > "$TMP/.opencode/skills/system-spec-kit/SKILL.md"
rm "$TMP/.opencode/bin/compiled-route-guard.cjs"
echo "edited" > "$TMP/.opencode/skills/$HUB/SKILL.md"
git -C "$TMP" add ".opencode/skills/$HUB/SKILL.md"
run_hook; RC=$?
check "a missing route module blocks where the toolchain ships" 1 "$RC" "could not read the hub list"

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

# ══ legacy hygiene helper ═══════════════════════════════════════════════════
# The compatibility helper applies the same rules to its two gates. It has no bypass
# flags, so a case that exercises its agent gate plants a comment checker that passes.
LEGACY="$REPO_ROOT/.opencode/hooks/git/pre-commit"
run_legacy() { ( cd "$TMP" && bash "$LEGACY" >"$TMP/out.log" 2>&1 ); }
plant_comment_checker() {
  mkdir -p "$TMP/.opencode/skills/sk-code/sk-code-quality/scripts"
  printf '#!/usr/bin/env bash\nexit 0\n' > "$TMP/.opencode/skills/sk-code/sk-code-quality/scripts/check-comment-hygiene.sh"
  chmod +x "$TMP/.opencode/skills/sk-code/sk-code-quality/scripts/check-comment-hygiene.sh"
}

# ── 36. a staged .skilled agent reaches the helper's mirror checker ──
setup_gate_fixture
plant_comment_checker
mkdir -p "$TMP/.opencode/skills/system-deep-loop/deep-improvement/scripts"
cat > "$TMP/.opencode/skills/system-deep-loop/deep-improvement/scripts/check-agent-mirror-sync.cjs" <<'CHECKER'
require('fs').appendFileSync('checker-calls.log', process.argv.slice(2).join('\n') + '\n');
CHECKER
stage_new ".skilled/agents/probe.md" "agent"
run_legacy; RC=$?
check "the helper passes a .skilled agent" 0 "$RC"
if grep -qxF '.skilled/agents/probe.md' "$TMP/checker-calls.log" 2>/dev/null; then
  echo "PASS  the helper handed the .skilled agent to its checker"; PASS=$((PASS + 1))
else
  echo "FAIL  the helper's checker never saw .skilled/agents/probe.md"; FAIL=$((FAIL + 1))
fi

# ── 37. the helper blocks on a missing comment checker where the toolchain ships ──
setup_gate_fixture toolchain
stage_new "notes.md" "note"
run_legacy; RC=$?
check "the helper blocks on a missing comment checker" 1 "$RC" "comment hygiene checker is missing"

# ── 38. the helper blocks on a missing agent checker where the toolchain ships ──
setup_gate_fixture toolchain
plant_comment_checker
stage_new ".opencode/agents/probe.md" "agent"
run_legacy; RC=$?
check "the helper blocks on a missing agent checker" 1 "$RC" "agent mirror-sync checker is missing"

# ── 39. the helper never blocks a repository that does not ship the toolchain ──
setup_gate_fixture
stage_new ".opencode/agents/probe.md" "agent"
run_legacy; RC=$?
check "the helper leaves a repository without the toolchain committable" 0 "$RC"

echo ""
echo "pre-commit gates: $PASS passed, $FAIL failed"
[[ "$FAIL" -eq 0 ]]
