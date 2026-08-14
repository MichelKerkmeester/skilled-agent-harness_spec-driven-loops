#!/bin/sh
# Shared hook kill-switch guard - POSIX sh mirror of hook-flags.cjs / .mjs.
# Usage:  . "<repo>/.opencode/hooks/shared/hook-flags.sh"; hook_enabled <concern> || exit 0
# ENABLED (return 0) unless master MK_HOOKS_DISABLED or per-concern MK_<CONCERN>_DISABLED
# is truthy (1/true/yes/on, case-insensitive). Default-on, dependency-free.
__hook_flags_truthy() {
  case "$(printf '%s' "${1:-}" | tr 'A-Z' 'a-z' | tr -d '[:space:]')" in
    1|true|yes|on) return 0 ;;
    *) return 1 ;;
  esac
}
hook_enabled() {
  __hook_flags_truthy "${MK_HOOKS_DISABLED:-}" && return 1
  [ -n "${1:-}" ] || return 0
  __hf_flag="MK_$(printf '%s' "$1" | tr 'a-z' 'A-Z' | sed 's/[^A-Z0-9][^A-Z0-9]*/_/g')_DISABLED"
  eval "__hf_val=\${$__hf_flag:-}"
  __hook_flags_truthy "$__hf_val" && return 1
  return 0
}
