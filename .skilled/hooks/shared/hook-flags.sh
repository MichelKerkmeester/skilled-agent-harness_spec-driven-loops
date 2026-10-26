#!/usr/bin/env bash
# ───────────────────────────────────────────────────────────────
# COMPONENT: HOOK FLAGS GUARD
# ───────────────────────────────────────────────────────────────
# Shared hook kill-switch guard - POSIX sh mirror of hook-flags.cjs / .mjs.
# Usage:  . "<repo>/.skilled/hooks/shared/hook-flags.sh"; hook_enabled <concern> [runtime] || exit 0
# ENABLED (return 0) unless master SYSTEM_HOOKS_DISABLED (or legacy MK_HOOKS_DISABLED) or per-concern SYSTEM_<CONCERN>_DISABLED
# is truthy (1/true/yes/on, case-insensitive). Default-on, dependency-free, except
# session-relaunch, which also needs SYSTEM_SESSION_RELAUNCH_ENABLED truthy, or, when
# the caller names its runtime, SYSTEM_SESSION_RELAUNCH_<RUNTIME>_ENABLED, which answers
# first whenever it holds a value.
# Flags resolve from the live environment first, then an optional operator config
# file (hook-flags.env); the environment always wins so a persisted default can
# still be overridden per session.

# Resolve the config file once at source time. Prefer an explicit override, then
# the repo root the caller already computed, then a git lookup; empty = no file.
__hook_flags_config="${HOOK_FLAGS_CONFIG:-}"
if [ -z "$__hook_flags_config" ]; then
  __hf_cfg_root="${__hf_root:-$(git -c core.fsmonitor=false rev-parse --show-toplevel 2>/dev/null)}"
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
    # Assigned through eval, so name it first for the linter's sake.
    __hf_r=''
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
  # The master switch and its legacy names, as in MASTER_FLAG and MASTER_ALIASES
  # in hook-flags.cjs.
  for __hf_master in SYSTEM_HOOKS_DISABLED MK_HOOKS_DISABLED; do
    __hook_flags_truthy "$(__hook_flags_resolve "$__hf_master")" && return 1
  done
  [ -n "${1:-}" ] || return 0
  __hf_flag="SYSTEM_$(printf '%s' "$1" | tr 'a-z' 'A-Z' | sed 's/[^A-Z0-9][^A-Z0-9]*/_/g')_DISABLED"
  __hook_flags_truthy "$(__hook_flags_resolve "$__hf_flag")" && return 1
  # Concerns that act on the session itself stay off until the operator opts in,
  # as in DEFAULT_OFF in hook-flags.cjs; the kill switches above still win. A named
  # runtime from RUNTIMES in hook-flags.cjs checks its own enable switch first, and
  # an empty one falls through to the global switch.
  case "$1" in
    session-relaunch)
      # The runtime name's edges are trimmed, as in hook-flags.cjs.
      __hf_rt=$(printf '%s' "${2:-}" | tr 'A-Z' 'a-z')
      __hf_rt=${__hf_rt#"${__hf_rt%%[![:space:]]*}"}
      __hf_rt=${__hf_rt%"${__hf_rt##*[![:space:]]}"}
      case "$__hf_rt" in
        claude|codex|pi|opencode|hermes|cursor|devin)
          __hf_rv=$(__hook_flags_resolve "SYSTEM_SESSION_RELAUNCH_$(printf '%s' "$__hf_rt" | tr 'a-z' 'A-Z')_ENABLED")
          __hf_rv_trim=${__hf_rv#"${__hf_rv%%[![:space:]]*}"}
          if [ -n "$__hf_rv_trim" ]; then
            __hook_flags_truthy "$__hf_rv"
            return
          fi
          ;;
      esac
      __hook_flags_truthy "$(__hook_flags_resolve SYSTEM_SESSION_RELAUNCH_ENABLED)"
      return
      ;;
  esac
  return 0
}
