#!/usr/bin/env bash
# Stand-in for sk-git's numbering script that only records that it was
# called, so a test can prove a run never reached worktree creation.
printf '%s\n' "$*" >> "$NAMING_STUB_LOG"
exit 1
