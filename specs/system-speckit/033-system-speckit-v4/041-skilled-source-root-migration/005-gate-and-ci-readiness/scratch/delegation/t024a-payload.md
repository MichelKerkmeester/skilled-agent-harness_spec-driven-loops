# Edits for unit t024a

Each edit names a file, an OLD block and a NEW block. The block is the text between its two fence lines, without the fence lines themselves.

## Edit 1

File: `.opencode/bin/check-git-hooks.sh`

OLD:

~~~~text
# Not a git repo: nothing to guard.
[ -z "$REPO_ROOT" ] && exit 0
~~~~

NEW:

~~~~text
# Not a git repo: nothing to guard.
[ -z "$REPO_ROOT" ] && exit 0

# A missing hook source or installer means nothing to guard in a repository that does
# not ship the toolchain, and a broken install in one that does. The spec-kit
# sentinel, under either source root, tells the two apart.
_in_toolchain_repo() {
  [[ -f "$REPO_ROOT/.opencode/skills/system-spec-kit/SKILL.md" \
     || -f "$REPO_ROOT/.skilled/skills/system-spec-kit/SKILL.md" ]]
}
~~~~

## Edit 2

File: `.opencode/bin/check-git-hooks.sh`

OLD:

~~~~text
# No versioned hook source in this checkout: nothing to guard.
[ -d "$HOOK_SOURCE_DIR" ] || exit 0
~~~~

NEW:

~~~~text
# No versioned hook source in this checkout: nothing to guard, unless the checkout
# ships the toolchain, where the missing directory is itself worth a warning.
if [ ! -d "$HOOK_SOURCE_DIR" ]; then
  if _in_toolchain_repo; then
    printf '%s\n' "[check-git-hooks] WARNING: hook source directory is missing: $HOOK_SOURCE_DIR" >&2
  fi
  exit 0
fi
~~~~

## Edit 3

File: `.opencode/bin/check-git-hooks.sh`

OLD:

~~~~text
          printf '%s\n' "[check-git-hooks] self-heal install failed; run it manually" >&2
        fi
      fi
~~~~

NEW:

~~~~text
          printf '%s\n' "[check-git-hooks] self-heal install failed; run it manually" >&2
        fi
      elif _in_toolchain_repo; then
        printf '%s\n' "[check-git-hooks] WARNING: self-heal skipped, installer is missing: $REPO_ROOT/.opencode/scripts/install-git-hooks.sh" >&2
      fi
~~~~
