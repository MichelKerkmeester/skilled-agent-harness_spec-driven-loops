# Edits for unit check-git-hooks-harness-pin

Each edit names a file, an OLD block and a NEW block. The block is the text between its two fence lines, without the fence lines themselves.

## Edit 1

File: `.opencode/bin/tests/check-git-hooks.test.sh`

OLD:

~~~~text
  rm -rf "$TMP"; mkdir -p "$TMP"
  git -C "$TMP" init -q
~~~~

NEW:

~~~~text
  rm -rf "$TMP"; mkdir -p "$TMP"
  git -C "$TMP" init -q
  # A hooks path set in any config layer would move the directory the check inspects.
  git -C "$TMP" config core.hooksPath "$TMP/.git/hooks"
~~~~
