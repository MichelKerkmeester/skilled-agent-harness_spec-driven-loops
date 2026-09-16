# Edits for unit t022a

Each edit names a file, an OLD block and a NEW block. The block is the text between its two fence lines, without the fence lines themselves.

## Edit 1

File: `.opencode/scripts/git-hooks/post-commit`

OLD:

~~~~text
REPO_ROOT="$(git rev-parse --show-toplevel 2>/dev/null || true)"
if [ -z "$REPO_ROOT" ]; then
  exit 0
fi

~~~~

NEW:

~~~~text
REPO_ROOT="$(git rev-parse --show-toplevel 2>/dev/null || true)"
if [ -z "$REPO_ROOT" ]; then
  exit 0
fi

# The hook is installed globally, so a script it calls can be missing for two reasons:
# this repository does not ship the toolchain, or it does and the install is broken.
# The spec-kit sentinel tells the two apart, under either source root.
_in_toolchain_repo() {
  [[ -f "$REPO_ROOT/.opencode/skills/system-spec-kit/SKILL.md" \
     || -f "$REPO_ROOT/.skilled/skills/system-spec-kit/SKILL.md" ]]
}

~~~~

## Edit 2

File: `.opencode/scripts/git-hooks/post-commit`

OLD:

~~~~text
  source "$REPO_ROOT/.opencode/scripts/git-hooks/lib/autostash-orphan-guard.sh"
  autostash_orphan_guard || true
fi
~~~~

NEW:

~~~~text
  source "$REPO_ROOT/.opencode/scripts/git-hooks/lib/autostash-orphan-guard.sh"
  autostash_orphan_guard || true
elif _in_toolchain_repo; then
  echo "WARNING [gate:autostash-guard]: guard library is missing: $REPO_ROOT/.opencode/scripts/git-hooks/lib/autostash-orphan-guard.sh (post-commit)" >&2
fi
~~~~

## Edit 3

File: `.opencode/scripts/git-hooks/post-commit`

OLD:

~~~~text
      echo "WARNING [gate:hook-flags]: resolver unavailable; continuing with live-sync enabled." >&2
    fi
  fi
~~~~

NEW:

~~~~text
      echo "WARNING [gate:hook-flags]: resolver unavailable; continuing with live-sync enabled." >&2
    fi
  elif _in_toolchain_repo; then
    echo "WARNING [gate:hook-flags]: $REPO_ROOT/.opencode/hooks/shared/hook-flags.sh is missing or unreadable; continuing with live-sync enabled." >&2
  fi
~~~~

## Edit 4

File: `.opencode/scripts/git-hooks/post-commit`

OLD:

~~~~text
      [ -f "$_as_sync" ] && bash "$_as_sync" --auto --quiet || true
~~~~

NEW:

~~~~text
      if [ -f "$_as_sync" ]; then
        bash "$_as_sync" --auto --quiet || true
      elif _in_toolchain_repo; then
        echo "WARNING [gate:live-sync]: $_as_sync is missing; this commit was not published to the live branch." >&2
      fi
~~~~

## Edit 5

File: `.opencode/scripts/git-hooks/post-merge`

OLD:

~~~~text
REPO_ROOT="$(git rev-parse --show-toplevel 2>/dev/null || true)"
if [ -z "$REPO_ROOT" ]; then
  exit 0
fi

~~~~

NEW:

~~~~text
REPO_ROOT="$(git rev-parse --show-toplevel 2>/dev/null || true)"
if [ -z "$REPO_ROOT" ]; then
  exit 0
fi

# The hook is installed globally, so a script it calls can be missing for two reasons:
# this repository does not ship the toolchain, or it does and the install is broken.
# The spec-kit sentinel tells the two apart, under either source root.
_in_toolchain_repo() {
  [[ -f "$REPO_ROOT/.opencode/skills/system-spec-kit/SKILL.md" \
     || -f "$REPO_ROOT/.skilled/skills/system-spec-kit/SKILL.md" ]]
}

~~~~

## Edit 6

File: `.opencode/scripts/git-hooks/post-merge`

OLD:

~~~~text
  source "$REPO_ROOT/.opencode/scripts/git-hooks/lib/autostash-orphan-guard.sh"
  autostash_orphan_guard || true
fi
~~~~

NEW:

~~~~text
  source "$REPO_ROOT/.opencode/scripts/git-hooks/lib/autostash-orphan-guard.sh"
  autostash_orphan_guard || true
elif _in_toolchain_repo; then
  echo "WARNING [gate:autostash-guard]: guard library is missing: $REPO_ROOT/.opencode/scripts/git-hooks/lib/autostash-orphan-guard.sh (post-merge)" >&2
fi
~~~~

## Edit 7

File: `.opencode/scripts/git-hooks/post-rewrite`

OLD:

~~~~text
REPO_ROOT="$(git rev-parse --show-toplevel 2>/dev/null || true)"
if [ -z "$REPO_ROOT" ]; then
  exit 0
fi

~~~~

NEW:

~~~~text
REPO_ROOT="$(git rev-parse --show-toplevel 2>/dev/null || true)"
if [ -z "$REPO_ROOT" ]; then
  exit 0
fi

# The hook is installed globally, so a script it calls can be missing for two reasons:
# this repository does not ship the toolchain, or it does and the install is broken.
# The spec-kit sentinel tells the two apart, under either source root.
_in_toolchain_repo() {
  [[ -f "$REPO_ROOT/.opencode/skills/system-spec-kit/SKILL.md" \
     || -f "$REPO_ROOT/.skilled/skills/system-spec-kit/SKILL.md" ]]
}

~~~~

## Edit 8

File: `.opencode/scripts/git-hooks/post-rewrite`

OLD:

~~~~text
  source "$REPO_ROOT/.opencode/scripts/git-hooks/lib/autostash-orphan-guard.sh"
  autostash_orphan_guard || true
fi
~~~~

NEW:

~~~~text
  source "$REPO_ROOT/.opencode/scripts/git-hooks/lib/autostash-orphan-guard.sh"
  autostash_orphan_guard || true
elif _in_toolchain_repo; then
  echo "WARNING [gate:autostash-guard]: guard library is missing: $REPO_ROOT/.opencode/scripts/git-hooks/lib/autostash-orphan-guard.sh (post-rewrite)" >&2
fi
~~~~
