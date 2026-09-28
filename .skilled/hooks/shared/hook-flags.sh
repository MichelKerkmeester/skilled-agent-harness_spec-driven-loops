#!/usr/bin/env bash
# Shared hook kill-switch guard - POSIX sh mirror of hook-flags.cjs / .mjs.
# Usage:  . "<repo>/.skilled/hooks/shared/hook-flags.sh"; hook_enabled <concern> || exit 0
# ENABLED (return 0) unless master SYSTEM_HOOKS_DISABLED or per-concern SYSTEM_<CONCERN>_DISABLED
# is truthy (1/true/yes/on, case-insensitive). Default-on, dependency-free.
# Flags resolve from the live environment first, then an optional operator config
# file (hook-flags.env); the environment always wins so a persisted default can
# still be overridden per session.

# Resolve the config file once at source time. Prefer an explicit override, then
# the repo root the caller already computed, then a git lookup; empty = no file.
__hook_flags_config="${HOOK_FLAGS_CONFIG:-}"
if [ -z "$__hook_flags_config" ]; then
  __hf_cfg_root="${__hf_root:-$(git rev-parse --show-toplevel 2>/dev/null)}"
  # The source root is whichever of the two names holds the spec-kit skill, the
  # same test the git hooks use, so a checkout carrying only one name still works.
  for __hf_src in .skilled .opencode; do
    if [ -n "$__hf_cfg_root" ] && [ -f "$__hf_cfg_root/$__hf_src/skills/system-spec-kit/SKILL.md" ]; then
      __hook_flags_config="$__hf_cfg_root/$__hf_src/hooks/hook-flags.env"
      break
    fi
  done
fi

# Only the value's edges are trimmed, as in hook-flags.cjs, so "o n" stays off.
__hook_flags_truthy() {
  __hf_t=$(printf '%s' "${1:-}" | tr 'A-Z' 'a-z')
  __hf_t=${__hf_t#"${__hf_t%%[![:space:]]*}"}
  __hf_t=${__hf_t%"${__hf_t##*[![:space:]]}"}
  case "$__hf_t" in
    1|true|yes|on) return 0 ;;
    *) return 1 ;;
  esac
}

# An editor that saves UTF-8 with a signature puts a byte order mark before the
# first line, and the file readers in Node and Python drop it, so this one does.
__hf_bom=$(printf '\357\273\277')

# Print the effective value for an env-var name: the environment value when the
# variable is set (even to empty, so env wins), else the config-file value, else
# nothing. Whether the variable is set decides, never what it holds. A missing or
# unreadable file yields nothing (fail-open). In the file a '#' after a space or
# tab ends the value, as in hook-flags.cjs, so a line carrying a trailing comment
# still counts.
__hook_flags_resolve() {
  if eval "[ \"\${$1+set}\" = set ]"; then
    eval "__hf_r=\${$1}"
    printf '%s' "$__hf_r"
    return 0
  fi
  [ -n "$__hook_flags_config" ] && [ -r "$__hook_flags_config" ] || return 0
  __hf_line=$(LC_ALL=C grep -E "^($__hf_bom)?[[:space:]]*$1[[:space:]]*=" "$__hook_flags_config" 2>/dev/null | grep -v '^[[:space:]]*#' | tail -1)
  [ -n "$__hf_line" ] || return 0
  __hf_v=${__hf_line#*=}
  __hf_v=$(printf '%s' "$__hf_v" | sed -e 's/[[:blank:]]#.*$//' -e 's/^[[:space:]]*//' -e 's/[[:space:]]*$//' -e 's/^"\(.*\)"$/\1/' -e "s/^'\(.*\)'\$/\1/")
  printf '%s' "$__hf_v"
}

# Succeed when one named switch resolves truthy, for a switch that is not a hook
# concern (a validator's opt-out, say) but is saved in the same file under the
# same precedence. The name is checked before use because the resolver expands
# it through eval, so anything but a plain variable name is refused.
hook_flag_on() {
  case "${1:-}" in
    ''|[0-9]*|*[!A-Za-z0-9_]*) return 1 ;;
  esac
  __hook_flags_truthy "$(__hook_flags_resolve "$1")"
}

hook_enabled() {
  __hook_flags_truthy "$(__hook_flags_resolve SYSTEM_HOOKS_DISABLED)" && return 1
  [ -n "${1:-}" ] || return 0
  __hf_flag="SYSTEM_$(printf '%s' "$1" | tr 'a-z' 'A-Z' | sed 's/[^A-Z0-9][^A-Z0-9]*/_/g')_DISABLED"
  __hook_flags_truthy "$(__hook_flags_resolve "$__hf_flag")" && return 1
  return 0
}
