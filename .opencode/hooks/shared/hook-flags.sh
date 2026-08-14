#!/bin/sh
# Shared hook kill-switch guard - POSIX sh mirror of hook-flags.cjs / .mjs.
# Usage:  . "<repo>/.opencode/hooks/shared/hook-flags.sh"; hook_enabled <concern> || exit 0
# ENABLED (return 0) unless master MK_HOOKS_DISABLED or per-concern MK_<CONCERN>_DISABLED
# is truthy (1/true/yes/on, case-insensitive). Default-on, dependency-free.
# Flags resolve from the live environment first, then an optional operator config
# file (hook-flags.env); the environment always wins so a persisted default can
# still be overridden per session.

# Resolve the config file once at source time. Prefer an explicit override, then
# the repo root the caller already computed, then a git lookup; empty = no file.
__hook_flags_config="${HOOK_FLAGS_CONFIG:-}"
if [ -z "$__hook_flags_config" ]; then
  __hf_cfg_root="${__hf_root:-$(git rev-parse --show-toplevel 2>/dev/null)}"
  [ -n "$__hf_cfg_root" ] && __hook_flags_config="$__hf_cfg_root/.opencode/hooks/hook-flags.env"
fi

__hook_flags_truthy() {
  case "$(printf '%s' "${1:-}" | tr 'A-Z' 'a-z' | tr -d '[:space:]')" in
    1|true|yes|on) return 0 ;;
    *) return 1 ;;
  esac
}

# Print the effective value for an env-var name: the environment value when the
# variable is set (even to empty, so env wins), else the config-file value, else
# nothing. A missing/unreadable file yields nothing (fail-open).
__hook_flags_resolve() {
  eval "__hf_r=\${$1-__HF_UNSET__}"
  if [ "$__hf_r" != "__HF_UNSET__" ]; then
    printf '%s' "$__hf_r"
    return 0
  fi
  [ -n "$__hook_flags_config" ] && [ -r "$__hook_flags_config" ] || return 0
  __hf_line=$(grep -E "^[[:space:]]*$1[[:space:]]*=" "$__hook_flags_config" 2>/dev/null | grep -v '^[[:space:]]*#' | tail -1)
  [ -n "$__hf_line" ] || return 0
  __hf_v=${__hf_line#*=}
  __hf_v=$(printf '%s' "$__hf_v" | sed -e 's/^[[:space:]]*//' -e 's/[[:space:]]*$//' -e 's/^"\(.*\)"$/\1/' -e "s/^'\(.*\)'\$/\1/")
  printf '%s' "$__hf_v"
}

hook_enabled() {
  __hook_flags_truthy "$(__hook_flags_resolve MK_HOOKS_DISABLED)" && return 1
  [ -n "${1:-}" ] || return 0
  __hf_flag="MK_$(printf '%s' "$1" | tr 'a-z' 'A-Z' | sed 's/[^A-Z0-9][^A-Z0-9]*/_/g')_DISABLED"
  __hook_flags_truthy "$(__hook_flags_resolve "$__hf_flag")" && return 1
  return 0
}
