# Changelog , , ,  006: orchestrator placeholder parity

**Shipped**: 2026-05-29
**Commit**: `(see git history)`

## What Changed

- `mcp_server/lib/validation/orchestrator.ts`: added the `[NEEDS CLARIFICATION:` space variant plus fenced-code / inline-backtick exclusions via a single `PLACEHOLDER_MARKER_RE` + an `inCode` toggle
- `scripts/rules/check-placeholders.sh`: removed `{{mustache}}`, broadened the NEEDS_CLARIFICATION match (underscore + space) for strict superset parity
- `mcp_server/dist/lib/validation/orchestrator.js`: rebuilt from source (no hand-edited JS)

## Why

The canonical Node validator (`validatePlaceholders`) and the legacy shell rule disagreed on three cases , , ,  the space variant, fence/backtick exclusions, and `{{mustache}}` , , ,  so the same doc could pass one and fail the other. They now share one placeholder-detection contract.

## Verification

- Placeholder parity (Node vs shell): PASS
- `validate.sh --strict` on this packet: PASS
- Rebuilt dist matches source: PASS
