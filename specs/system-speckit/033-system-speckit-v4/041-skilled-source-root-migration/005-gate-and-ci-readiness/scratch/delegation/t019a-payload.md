# Edits for unit t019a

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
