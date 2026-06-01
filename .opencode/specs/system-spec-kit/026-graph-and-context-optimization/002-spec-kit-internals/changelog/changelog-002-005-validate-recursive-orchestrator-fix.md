# Changelog , , ,  005: validate.sh recursive orchestrator fix

**Shipped**: 2026-05-29
**Commit**: `(see git history)`

## What Changed

- `.opencode/skills/system-spec-kit/scripts/spec/validate.sh`: fixed `run_node_orchestrator()` calling `exit $?` before `main()`'s recursive block ran , , ,  on the orchestrator-present path, `--recursive` had silently validated only the parent and skipped all phase children
- Now recurses over phase children on the orchestrator path and aggregates child exit codes worst-wins
- Non-recursive path left byte-identical, only the orchestrator-present recursive path changed

## Why

`--recursive` on a phase parent was giving a false-green: it validated the parent only and never descended into the phase children when the Node orchestrator was present, so child failures went unreported.

## Verification

- `validate.sh --recursive` on a phase parent (orchestrator path): PASS , , ,  now recurses children
- `validate.sh` non-recursive: PASS , , ,  byte-identical behavior
- Exit-code aggregation (worst-wins): PASS
