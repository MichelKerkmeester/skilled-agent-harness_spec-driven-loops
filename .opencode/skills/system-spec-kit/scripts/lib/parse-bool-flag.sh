#!/usr/bin/env bash
# ───────────────────────────────────────────────────────────────
# COMPONENT: Boolean Flag Parser
# ───────────────────────────────────────────────────────────────
# Provides one truthy-value contract for validation rule flags.

set -euo pipefail

# Three outcomes, not two. Treating anything unrecognized as "off" is the wrong
# default for the rules that consume this: both of them default to enabled and
# gate a hard failure, so a misspelled value silently downgraded a validation
# failure to a pass. An unrecognized value now keeps the rule enabled and names
# itself in SPECKIT_FLAG_UNRECOGNIZED, so the caller can report it rather than
# obey it. Only an explicit falsey value disables anything.
SPECKIT_FLAG_UNRECOGNIZED=""

speckit_flag_enabled() {
    local value="${1:-}"
    value="$(printf '%s' "$value" | tr '[:upper:]' '[:lower:]')"
    SPECKIT_FLAG_UNRECOGNIZED=""
    case "$value" in
        true|1|yes|on) return 0 ;;
        false|0|no|off) return 1 ;;
        *)
            SPECKIT_FLAG_UNRECOGNIZED="$value"
            return 0
            ;;
    esac
}
