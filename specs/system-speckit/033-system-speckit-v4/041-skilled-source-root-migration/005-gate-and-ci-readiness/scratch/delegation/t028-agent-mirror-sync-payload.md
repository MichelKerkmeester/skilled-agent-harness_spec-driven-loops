# Edits for unit t028-agent-mirror-sync

Each edit names a file, an OLD block and a NEW block. The block is the text between its two fence lines, without the fence lines themselves.

## Edit 1

File: `.github/workflows/agent-mirror-sync.yml`

OLD:

~~~~text
          done < <(git diff --name-only --diff-filter=ACMD "$BASE" "$HEAD" | grep -E '^\.(opencode|claude|codex)/agents/' || true)
~~~~

NEW:

~~~~text
          done < <(git diff --name-only --diff-filter=ACMD "$BASE" "$HEAD" | grep -E '^\.(opencode|skilled|claude|codex)/agents/' || true)
~~~~
