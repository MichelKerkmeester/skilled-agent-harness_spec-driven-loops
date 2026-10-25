#!/bin/bash
# Run the real claude binary with a clean environment (no loop, no nested-session vars).
# usage: run-claude.sh <dir> <claude args...>
d="$1"; shift
cd "$d" || exit 99
exec env -i HOME="$HOME" USER="$USER" PATH="/usr/bin:/bin:/usr/sbin:/sbin:/opt/homebrew/bin:$HOME/.local/bin" TERM=xterm-256color LANG=en_US.UTF-8 \
  "$HOME/.local/bin/claude" "$@"
