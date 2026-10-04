#!/usr/bin/env bash
# ───────────────────────────────────────────────────────────────
# COMPONENT: Git Hook Gate Settings
# ───────────────────────────────────────────────────────────────
# Lets an operator keep a hook gate switched off without exporting its SPECKIT_SKIP_*
# variable in every shell. gates.tsv beside this file lists the gates. For each
# persistable gate of the calling hook, git config speckit.hooks.<key> set to off,
# false, no or 0 exports the gate's variable as 1 for this run and prints one notice
# line, so a gate is never skipped silently.
#
# Only config files count. A `git -c` flag or a GIT_CONFIG_* variable reports scope
# "command" and is ignored, so one invocation cannot switch a gate off; that is what
# the SPECKIT_SKIP_* variables are for. Per-push approvals are marked non-persistable
# in gates.tsv and are never read here.
#
# Usage: . "$HOOK_DIR/lib/gate-config.sh"; gate_config_apply <hook-name>

# Export the skip variable of every gate the operator switched off in git config.
# Args: $1 = hook name as listed in gates.tsv. Always returns 0.
gate_config_apply() {
  local hook="$1" registry row_hook key env persistable _description line scope value
  registry="${GATE_REGISTRY:-$(dirname "${BASH_SOURCE[0]}")/gates.tsv}"
  [[ -r "$registry" ]] || return 0
  while IFS=$'\t' read -r row_hook key env persistable _description; do
    [[ -z "$row_hook" || "$row_hook" == \#* ]] && continue
    [[ "$row_hook" == "$hook" && "$persistable" == "yes" ]] || continue
    [[ "${!env:-0}" == "1" ]] && continue
    line="$(git config --show-scope --get-all "speckit.hooks.$key" 2>/dev/null | grep -v $'^command\t' | tail -n 1 || true)"
    [[ -n "$line" ]] || continue
    scope="${line%%$'\t'*}"
    value="$(printf '%s' "${line#*$'\t'}" | tr '[:upper:]' '[:lower:]')"
    case "$value" in
      off|false|no|0)
        export "$env=1"
        printf '%s: the %s gate is off (git config speckit.hooks.%s in %s config).\n' "$hook" "$key" "$key" "$scope" >&2
        ;;
    esac
  done < "$registry"
  return 0
}
