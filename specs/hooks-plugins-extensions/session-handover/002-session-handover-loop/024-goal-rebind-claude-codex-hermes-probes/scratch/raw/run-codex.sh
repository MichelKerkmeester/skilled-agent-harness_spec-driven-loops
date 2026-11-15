#!/bin/bash
# usage: run-codex.sh <name> <codex args...>   (CODEX_HOME isolated, clean env)
n="$1"; shift
S=/private/tmp/claude-501/-Users-michelkerkmeester-MEGA-Development-Code-Environment-Public/bf59c2c4-b852-41a2-886d-00232422ac9e/scratchpad/probe
cd "$S/$n" || exit 99
exec env -i HOME="$HOME" USER="$USER" PATH="/usr/bin:/bin:/usr/sbin:/sbin:/opt/homebrew/bin:$HOME/.local/bin" TERM=xterm-256color LANG=en_US.UTF-8 CODEX_HOME="$S/codex-home-$n" \
  /opt/homebrew/bin/codex "$@"
