## Edit 1

File: `.opencode/bin/tests/worktree-session.test.sh`

OLD:

~~~~text
# ── F6-F8: shared paths and the database directory follow each checkout's real source root ──
# The tree sits under .opencode (today), under .skilled, or under .skilled with .opencode
# linked to it. Physical paths, for the same containment reason as F5.
make_layout_fixture() {
~~~~

NEW:

~~~~text
# ── F6-F8: shared paths and the database directory follow each checkout's real source root ──
# The tree sits under .opencode beside a tracked .skilled placeholder (today), under .skilled,
# or under .skilled with .opencode linked to it. Physical paths, for the same containment
# reason as F5.
make_layout_fixture() {
~~~~

## Edit 2

File: `.opencode/bin/tests/worktree-session.test.sh`

OLD:

~~~~text
  printf '# sentinel\n' > "$fixture/$real/skills/system-spec-kit/SKILL.md"
  [ "$layout" != "whole-link" ] || ln -s .skilled "$fixture/.opencode"
~~~~

NEW:

~~~~text
  printf '# sentinel\n' > "$fixture/$real/skills/system-spec-kit/SKILL.md"
  if [ "$layout" = "today" ]; then
    mkdir -p "$fixture/.skilled/future-task-placeholder"
    : > "$fixture/.skilled/future-task-placeholder/.gitkeep"
  fi
  [ "$layout" != "whole-link" ] || ln -s .skilled "$fixture/.opencode"
~~~~

## Edit 3

File: `.opencode/bin/tests/worktree-session.test.sh`

OLD:

~~~~text
make_layout_fixture "$F7_FIXTURE" skilled-only
set +e
run_layout_wrapper "$F7_FIXTURE" "$F7_BASE" /dev/null "$ROOT/f7.stderr" myrt
F7_RC=$?
~~~~

NEW:

~~~~text
make_layout_fixture "$F7_FIXTURE" skilled-only
# This runtime stub records the database directory the launcher exports to the session.
printf '%s\n' '#!/usr/bin/env bash' 'printf "%s\n" "$SPEC_KIT_DB_DIR" > "$DB_DIR_RECORD"' > "$BIN_DIR/dbrt"
chmod +x "$BIN_DIR/dbrt"
export DB_DIR_RECORD="$ROOT/f7.db-dir"
set +e
run_layout_wrapper "$F7_FIXTURE" "$F7_BASE" /dev/null "$ROOT/f7.stderr" dbrt
F7_RC=$?
~~~~

## Edit 4

File: `.opencode/bin/tests/worktree-session.test.sh`

OLD:

~~~~text
  test -L "$F7_WT/.skilled/skills/system-spec-kit/node_modules"
expect "skilled-only launch creates no .opencode path in the worktree" test ! -e "$F7_WT/.opencode"

# The main checkout moved its tree in the working copy but not in the commit the worktree
# checks out, so the two checkouts name different source roots.
mkdir -p "$ROOT/f8" "$ROOT/f8-base"
~~~~

NEW:

~~~~text
  test -L "$F7_WT/.skilled/skills/system-spec-kit/node_modules"
expect "skilled-only launch exports the database directory under the worktree's .skilled tree" \
  test "$(cat "$DB_DIR_RECORD" 2>/dev/null)" = "$F7_WT/.skilled/skills/system-spec-kit/runtime/database"
expect "skilled-only launch creates no .opencode path in the worktree" test ! -e "$F7_WT/.opencode"

# The main checkout moved its tree in the working copy, replacing the placeholder, but not in
# the commit the worktree checks out, so the two checkouts name different source roots.
mkdir -p "$ROOT/f8" "$ROOT/f8-base"
~~~~

## Edit 5

File: `.opencode/bin/tests/worktree-session.test.sh`

OLD:

~~~~text
make_layout_fixture "$F8_FIXTURE" today
mv "$F8_FIXTURE/.opencode" "$F8_FIXTURE/.skilled"
~~~~

NEW:

~~~~text
make_layout_fixture "$F8_FIXTURE" today
rm -rf "$F8_FIXTURE/.skilled"
mv "$F8_FIXTURE/.opencode" "$F8_FIXTURE/.skilled"
~~~~

## Edit 6

File: `.opencode/bin/tests/worktree-session.test.sh`

OLD:

~~~~text
  grep -F "main checkout keeps its source tree under .skilled but the new worktree keeps it under .opencode" "$ROOT/f8.stderr"
expect "the mismatched worktree gets no second source tree" test ! -e "$F8_WT/.skilled"
echo "worktree-session tests: PASS=$PASS FAIL=$FAIL"
~~~~

NEW:

~~~~text
  grep -F "main checkout keeps its source tree under .skilled but the new worktree keeps it under .opencode" "$ROOT/f8.stderr"
expect "the mismatched worktree plants no links in its .skilled placeholder" test ! -e "$F8_WT/.skilled/skills"
echo "worktree-session tests: PASS=$PASS FAIL=$FAIL"
~~~~
