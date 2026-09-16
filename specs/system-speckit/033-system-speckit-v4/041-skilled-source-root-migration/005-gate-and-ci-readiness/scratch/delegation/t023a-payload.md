# Edits for unit t023a

Each edit names a file, an OLD block and a NEW block. The block is the text between its two fence lines, without the fence lines themselves.

## Edit 1

File: `.opencode/hooks/git/pre-commit`

OLD:

~~~~text
REPO_ROOT="$(git rev-parse --show-toplevel)"

~~~~

NEW:

~~~~text
REPO_ROOT="$(git rev-parse --show-toplevel)"

# A missing checker means nothing to check in a repository that does not ship the
# toolchain, and a broken install in one that does. The spec-kit sentinel, under
# either source root, tells the two apart.
_in_toolchain_repo() {
  [[ -f "$REPO_ROOT/.opencode/skills/system-spec-kit/SKILL.md" \
     || -f "$REPO_ROOT/.skilled/skills/system-spec-kit/SKILL.md" ]]
}

~~~~

## Edit 2

File: `.opencode/hooks/git/pre-commit`

OLD:

~~~~text
if [[ ! -x "$CHECKER_PATH" ]]; then
  echo "WARNING: comment hygiene checker not found at $CHECKER — skipping check" >&2
  exit 0
fi
~~~~

NEW:

~~~~text
if [[ ! -x "$CHECKER_PATH" ]]; then
  if _in_toolchain_repo; then
    echo "BLOCKED: comment hygiene checker is missing or not executable: $CHECKER_PATH" >&2
    exit 1
  fi
  echo "WARNING: comment hygiene checker not found at $CHECKER — skipping check" >&2
  exit 0
fi
~~~~

## Edit 3

File: `.opencode/hooks/git/pre-commit`

OLD:

~~~~text
grep -E '^\.(opencode|claude)/agents/' || true)
~~~~

NEW:

~~~~text
grep -E '^\.(opencode|skilled|claude)/agents/' || true)
~~~~

## Edit 4

File: `.opencode/hooks/git/pre-commit`

OLD:

~~~~text
if [[ ${#STAGED_AGENTS[@]} -gt 0 ]]; then
  if ! command -v node >/dev/null 2>&1 || [[ ! -f "$MIRROR_CHECKER" ]]; then
~~~~

NEW:

~~~~text
if [[ ${#STAGED_AGENTS[@]} -gt 0 ]]; then
  if [[ ! -f "$MIRROR_CHECKER" ]] && _in_toolchain_repo; then
    echo "BLOCKED: agent mirror-sync checker is missing: $MIRROR_CHECKER" >&2
    exit 1
  elif ! command -v node >/dev/null 2>&1 || [[ ! -f "$MIRROR_CHECKER" ]]; then
~~~~
