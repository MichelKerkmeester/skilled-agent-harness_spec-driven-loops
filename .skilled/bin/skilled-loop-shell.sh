#!/usr/bin/env bash
# ───────────────────────────────────────────────────────────────
# COMPONENT: SKILLED LOOP SHELL SHIM
# ───────────────────────────────────────────────────────────────
# Sourced from ~/.zshrc or ~/.bashrc, it starts every interactive runtime session
# under the nearest skilled-loop wrapper, so a context handoff relaunches the session
# in the same terminal instead of stopping at a manual claim command.
#
# Usage: source /abs/path/.skilled/bin/skilled-loop-shell.sh
#
# Defines claude, pi, opencode, codex, hermes, devin and cursor-agent. Each one runs
# `bash <repo>/.skilled/bin/skilled-loop <arm> "$@"` when stdin and stdout are a
# terminal, no loop is running yet, the arguments open an interactive session, and a
# wrapper sits in $PWD or a parent; otherwise it runs the binary itself. A linked
# `.skilled` counts, so a repository that links another checkout's `.skilled` hops too.
#
# The file is sourced into the operator's own shell, so it sets no option there and
# keeps to syntax that bash 3.2 and zsh read the same way.
#
# Agent tool shells are rebuilt from a snapshot that drops single-underscore
# functions, so every helper a runtime function calls keeps a plain name.

# ───────────────────────────────────────────────────────────────
# 1. WRAPPER RESOLUTION
# ───────────────────────────────────────────────────────────────

# Prints the wrapper a launch of <runtime> with these arguments should go through, or
# nothing. The runtime is the wrapper's arm name, so Cursor is `cursor`. It reads no
# terminal state, so a test can call it from a pipe. The body runs in a subshell, so
# strict mode guards the decision without changing the operator's own shell.
skilled_loop_resolve() (
  set -uo pipefail
  runtime="${1:-}"
  if [ "$#" -gt 0 ]; then
    shift
  fi
  case "$runtime" in
    claude|pi|opencode|codex|hermes|devin|cursor) ;;
    *) exit 0 ;;
  esac
  # A session the loop started already relaunches through its own wrapper.
  if [ -n "${SKILLED_LOOP_ID:-}" ]; then
    exit 0
  fi
  if ! skilled_loop_opens_session "$runtime" "$@"; then
    exit 0
  fi
  skilled_loop_find_wrapper
)

# ───────────────────────────────────────────────────────────────
# 2. INVOCATION CLASSIFIERS
# ───────────────────────────────────────────────────────────────

# Succeeds when the first argument is a subcommand that does not open a session in
# this terminal. Each list comes from that runtime's own --help.
skilled_loop_first_word_passes() {
  case "$1:$2" in
    claude:agents|claude:attach|claude:auth|claude:auto-mode|claude:doctor|\
      claude:gateway|claude:import|claude:install|claude:logs|claude:mcp|\
      claude:plugin|claude:plugins|claude:purge|claude:respawn|claude:rm|\
      claude:setup-token|claude:stop|claude:kill|claude:ultrareview|\
      claude:update|claude:upgrade)
      return 0
      ;;
    pi:install|pi:remove|pi:uninstall|pi:update|pi:list|pi:config|pi:auth|pi:mcp)
      return 0
      ;;
    opencode:completion|opencode:acp|opencode:mcp|opencode:attach|opencode:run|\
      opencode:debug|opencode:providers|opencode:auth|opencode:agent|\
      opencode:upgrade|opencode:uninstall|opencode:serve|opencode:web|\
      opencode:models|opencode:stats|opencode:export|opencode:import|\
      opencode:github|opencode:pr|opencode:session|opencode:plugin|\
      opencode:plug|opencode:db)
      return 0
      ;;
    # Codex resume and fork reopen an interactive session, so they stay wrapped.
    codex:agents|codex:exec|codex:e|codex:review|codex:login|codex:logout|\
      codex:mcp|codex:plugin|codex:app-server|codex:remote-control|codex:app|\
      codex:completion|codex:update|codex:doctor|codex:sandbox|codex:debug|\
      codex:apply|codex:a|codex:queue|codex:archive|codex:delete|\
      codex:migrate-rollouts|codex:unarchive|codex:cloud|codex:exec-server|\
      codex:features|codex:help)
      return 0
      ;;
    # Hermes takes no top-level prompt, so every word but chat is a subcommand.
    hermes:chat|hermes:-*)
      return 1
      ;;
    hermes:*)
      return 0
      ;;
    # A leading Devin word is a subcommand or a path for the desktop app; the
    # terminal prompt only follows `--`.
    devin:-*)
      return 1
      ;;
    devin:*)
      return 0
      ;;
    # Cursor's agent, ls and resume open a session, so they stay wrapped.
    cursor:persist|cursor:install-shell-integration|\
      cursor:uninstall-shell-integration|cursor:login|cursor:logout|cursor:mcp|\
      cursor:plugin|cursor:worker|cursor:status|cursor:whoami|cursor:models|\
      cursor:team|cursor:bedrock|cursor:about|cursor:update|cursor:create-chat|\
      cursor:generate-rule|cursor:rule|cursor:help)
      return 0
      ;;
  esac
  return 1
}

# Succeeds when the argument is a flag that prints, runs headless or exits instead of
# opening a session here. Each list comes from that runtime's own --help.
skilled_loop_flag_passes() {
  case "$1:$2" in
    claude:-p|claude:--print|claude:-v|claude:--version|claude:-h|claude:--help|\
      claude:--bg|claude:--background|claude:--desktop|claude:--cloud|\
      claude:--cloud=*)
      return 0
      ;;
    pi:-p|pi:--print|pi:-v|pi:--version|pi:-h|pi:--help|pi:--mode|pi:--mode=*|\
      pi:--export|pi:--export=*|pi:--list-models|pi:--list-models=*|\
      pi:--blackhole-export|pi:--blackhole-export=*)
      return 0
      ;;
    opencode:-v|opencode:--version|opencode:-h|opencode:--help)
      return 0
      ;;
    codex:-V|codex:--version|codex:-h|codex:--help)
      return 0
      ;;
    hermes:-z*|hermes:--oneshot|hermes:--oneshot=*|hermes:-Q|hermes:--quiet|\
      hermes:-V|hermes:--version|hermes:-h|hermes:--help)
      return 0
      ;;
    devin:-p|devin:--print|devin:--print=*|devin:-V|devin:--version|devin:-h|\
      devin:--help|devin:--cloud)
      return 0
      ;;
    cursor:-p|cursor:--print|cursor:-v|cursor:--version|cursor:-h|cursor:--help|\
      cursor:--list-models)
      return 0
      ;;
  esac
  return 1
}

# Succeeds when the arguments open an interactive session. Only the first argument is
# read as a subcommand, so a prompt word that matches one later on stays a prompt.
skilled_loop_opens_session() {
  local runtime="$1"
  local argument
  shift
  if [ "$#" -gt 0 ] && skilled_loop_first_word_passes "$runtime" "$1"; then
    return 1
  fi
  for argument in "$@"; do
    if [ "$argument" = '--' ]; then
      break
    fi
    if skilled_loop_flag_passes "$runtime" "$argument"; then
      return 1
    fi
  done
  return 0
}

# Prints the nearest skilled-loop wrapper at or above $PWD, or nothing at the root.
skilled_loop_find_wrapper() {
  local directory="$PWD"
  while :; do
    if [ -f "$directory/.skilled/bin/skilled-loop" ]; then
      printf '%s\n' "$directory/.skilled/bin/skilled-loop"
      return 0
    fi
    if [ -z "$directory" ] || [ "$directory" = '/' ]; then
      return 0
    fi
    directory="${directory%/*}"
  done
}

# ───────────────────────────────────────────────────────────────
# 3. RUNTIME FUNCTIONS
# ───────────────────────────────────────────────────────────────

# A pipe or a redirect means a script or another tool is driving the runtime, and the
# wrapper's relaunch needs a terminal to hand the fresh session to.
skilled_loop_launch() {
  local runtime="$1"
  local binary="$2"
  local wrapper=''
  shift 2
  if [ -t 0 ] && [ -t 1 ]; then
    wrapper=$(skilled_loop_resolve "$runtime" "$@")
  fi
  if [ -n "$wrapper" ] && [ "$runtime" = 'hermes' ]; then
    # Hermes reaches the relaunch bridge only through a project plugin, which it loads
    # behind this switch; the prefix scopes it to the wrapped launch alone.
    HERMES_ENABLE_PROJECT_PLUGINS=1 bash "$wrapper" "$runtime" "$@"
  elif [ -n "$wrapper" ]; then
    bash "$wrapper" "$runtime" "$@"
  else
    command "$binary" "$@"
  fi
}

# The `function` keyword keeps zsh from expanding an existing alias of the same name
# while it reads these definitions.
function claude { skilled_loop_launch claude claude "$@"; }
function pi { skilled_loop_launch pi pi "$@"; }
function opencode { skilled_loop_launch opencode opencode "$@"; }
function codex { skilled_loop_launch codex codex "$@"; }
function hermes { skilled_loop_launch hermes hermes "$@"; }
function devin { skilled_loop_launch devin devin "$@"; }
function cursor-agent { skilled_loop_launch cursor cursor-agent "$@"; }
