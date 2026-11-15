#!/usr/bin/env zsh
# Run from the repository root: zsh <this file> <git ref>
# Extracts the ref with git archive into a new folder under $TMPDIR, with no
# worktree, and runs the three CI checks behind the alignment rows for the
# markdown links and the playbook validator there. An extract has no
# node_modules and no built shared package, so each node_modules folder of this
# checkout is linked in and the shared package's built folder is copied in.
# The libraries therefore come from this checkout, while the checked files and
# the checker scripts come from the ref. Read the PASS or FAIL package line, not
# the exit code: a missing module also exits 1 and prints no package line. The
# folder is removed before the script ends.
setopt pipefail
ref=${1:?usage: extract-check.sh <git ref>}
W=${0:A:h}/../../../../../../..
W=${W:A}
cd "$W" || exit 2
hash=$(git -c core.fsmonitor=false rev-parse --short "$ref") || exit 2
T=$(mktemp -d "${TMPDIR%/}/align-extract.XXXXXX") || exit 2
trap 'rm -rf "$T"' EXIT
git -c core.fsmonitor=false archive "$ref" | tar -x -C "$T" || exit 2
find . -name node_modules -type d -prune -not -path './node_modules' | while read -r d; do
  mkdir -p "$T/${d:h}"
  [[ -e "$T/$d" ]] || ln -s "$W/$d" "$T/$d"
done
cp -R .skilled/skills/system-spec-kit/shared/dist "$T/.skilled/skills/system-spec-kit/shared/dist"
cd "$T" || exit 2
V=.skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs
print -r -- "ref $ref $hash"
print -r -- "links    $(node .skilled/skills/system-spec-kit/runtime/cli/check-markdown-links.cjs 2>&1 | head -1)"
print -r -- "package  $(node $V --package .skilled/skills/system-spec-kit/manual-testing-playbook 2>&1 | rg '^(PASS|FAIL) package=|^  BAKED|Error:' | tr '\n' ' ')"
print -r -- "strict   failed-packages=[$(node $V --strict 2>&1 | rg '^FAIL package=' | cut -d' ' -f2 | tr '\n' ' ' | sed 's/ $//')] errors=$(node $V --strict 2>&1 | rg -c 'Error:' || print 0)"
