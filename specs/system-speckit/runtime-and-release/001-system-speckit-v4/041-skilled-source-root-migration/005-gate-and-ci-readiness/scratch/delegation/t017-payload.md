# Edits for unit t017

Each edit names a file, an OLD block and a NEW block. The block is the text between its two fence lines, without the fence lines themselves.

## Edit 1

File: `.opencode/scripts/git-hooks/pre-commit`

OLD:

~~~~text
  ROUTE_MINT="$REPO_ROOT/.opencode/bin/compiled-route-manifest.cjs"
  # Cheap git-only pre-filter. Resolving the hub list costs a node start, and the
  # overwhelming majority of commits stage no routing input at all, so decide with a
  # pathspec first and only pay for the modules when something under skills is staged.
  if [[ -n "$(git diff --cached --name-only --diff-filter=ACMR -- \
        '.opencode/skills/*/SKILL.md' '.opencode/skills/*/*/SKILL.md' \
        '.opencode/skills/*/hub-router.json' '.opencode/skills/*/mode-registry.json' 2>/dev/null)" ]]; then
~~~~

NEW:

~~~~text
  ROUTE_MINT="$REPO_ROOT/.opencode/bin/compiled-route-manifest.cjs"
  ROUTE_GUARD="$REPO_ROOT/.opencode/bin/compiled-route-guard.cjs"
  ROUTE_LAYOUT="$REPO_ROOT/.opencode/bin/lib/compiled-route-layout.cjs"
  # Cheap git-only pre-filter. Resolving the hub list costs a node start, and the
  # overwhelming majority of commits stage no routing input at all, so decide with a
  # pathspec first and only pay for the modules when something under skills is staged.
  # A repository that does not ship the toolchain has skill trees of its own but no
  # route modules, and nothing to re-mint, so it passes. Inside one that ships the
  # toolchain a missing module still blocks below, naming the module.
  if [[ -n "$(git diff --cached --name-only --diff-filter=ACMR -- \
        '.opencode/skills/*/SKILL.md' '.opencode/skills/*/*/SKILL.md' \
        '.opencode/skills/*/hub-router.json' '.opencode/skills/*/mode-registry.json' \
        '.skilled/skills/*/SKILL.md' '.skilled/skills/*/*/SKILL.md' \
        '.skilled/skills/*/hub-router.json' '.skilled/skills/*/mode-registry.json' 2>/dev/null)" ]] \
     && { [[ -f "$ROUTE_GUARD" && -f "$ROUTE_LAYOUT" ]] || _in_toolchain_repo; }; then
~~~~

## Edit 2

File: `.opencode/scripts/git-hooks/pre-commit`

OLD:

~~~~text
    ' "$REPO_ROOT/.opencode/bin/compiled-route-guard.cjs" 2>&1)"; then
~~~~

NEW:

~~~~text
    ' "$ROUTE_GUARD" 2>&1)"; then
~~~~

## Edit 3

File: `.opencode/scripts/git-hooks/pre-commit`

OLD:

~~~~text
  if ! ROUTE_RUNTIME="$(node -e '
      const layout = require(process.argv[1]);
      const path = require("path");
      process.stdout.write(layout.activationRootFor(path.join(process.argv[2], ".opencode", "bin", "lib", "compiled-routing")));
    ' "$REPO_ROOT/.opencode/bin/lib/compiled-route-layout.cjs" "$REPO_ROOT" 2>&1)"; then
~~~~

NEW:

~~~~text
  # git refuses to stage a path that runs through a symbolic link, and the source root
  # may be one, so the manifests are addressed through the directory it resolves to.
  ROUTE_SOURCE="$(cd -P "$REPO_ROOT/.opencode" && pwd)"
  if ! ROUTE_RUNTIME="$(node -e '
      const layout = require(process.argv[1]);
      const path = require("path");
      process.stdout.write(layout.activationRootFor(path.join(process.argv[2], "bin", "lib", "compiled-routing")));
    ' "$ROUTE_LAYOUT" "$ROUTE_SOURCE" 2>&1)"; then
~~~~

## Edit 4

File: `.opencode/scripts/git-hooks/pre-commit`

OLD:

~~~~text
${ROUTE_RUNTIME#"$REPO_ROOT/.opencode/bin/lib/compiled-routing/"}"
~~~~

NEW:

~~~~text
${ROUTE_RUNTIME#"$ROUTE_SOURCE/bin/lib/compiled-routing/"}"
~~~~

## Edit 5

File: `.opencode/scripts/git-hooks/pre-commit`

OLD:

~~~~text
    ROUTE_PATHS=(
      ".opencode/skills/$ROUTE_HUB/SKILL.md"
      ".opencode/skills/$ROUTE_HUB/hub-router.json"
      ".opencode/skills/$ROUTE_HUB/mode-registry.json"
      ".opencode/skills/$ROUTE_HUB/*/SKILL.md"
    )
~~~~

NEW:

~~~~text
    ROUTE_PATHS=(
      ".opencode/skills/$ROUTE_HUB/SKILL.md"
      ".opencode/skills/$ROUTE_HUB/hub-router.json"
      ".opencode/skills/$ROUTE_HUB/mode-registry.json"
      ".opencode/skills/$ROUTE_HUB/*/SKILL.md"
      ".skilled/skills/$ROUTE_HUB/SKILL.md"
      ".skilled/skills/$ROUTE_HUB/hub-router.json"
      ".skilled/skills/$ROUTE_HUB/mode-registry.json"
      ".skilled/skills/$ROUTE_HUB/*/SKILL.md"
    )
~~~~

## Edit 6

File: `.opencode/scripts/git-hooks/tests/pre-commit.test.sh`

OLD:

~~~~text
echo ""
echo "pre-commit gates: $PASS passed, $FAIL failed"
[[ "$FAIL" -eq 0 ]]
~~~~

NEW:

~~~~text
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

echo ""
echo "pre-commit gates: $PASS passed, $FAIL failed"
[[ "$FAIL" -eq 0 ]]
~~~~
