#!/usr/bin/env bash
# ───────────────────────────────────────────────────────────────
# COMPONENT: Boolean Flag Parser
# ───────────────────────────────────────────────────────────────
# Provides one truthy-value contract for validation rule flags.

set -euo pipefail

speckit_flag_enabled() {
    local value="${1:-}"
    value="$(printf '%s' "$value" | tr '[:upper:]' '[:lower:]')"
    [[ "$value" == "true" || "$value" == "1" || "$value" == "yes" || "$value" == "on" ]]
}
