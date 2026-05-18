## Batch D Summary

### Scope

- Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-doctor-update-orchestrator/002-deep-review-remediation/`
- Timestamp used for checks: `2026-05-11T09:00:27Z`
- Banned operations avoided: no `rm`, `git rm`, or `mv`; no writes to `.opencode/commands/doctor/*`, `.claude/`, `.codex/`, or `.gemini/`.

### Changes Applied

- T-D01: no continuity `last_updated_at` refresh was needed. Batch A-touched docs in `001` and `002` were already dated `2026-05-09`, which is newer than the stale cutoff `2026-05-06`.
- T-D02 / R5-P2-001: changed sandbox base image from `node:20-bookworm` to `node:20-bookworm-slim`. Existing explicit `apt-get install` packages remain appropriate for the slim base.
- T-D03 / R5-P2-002: changed the sandbox reset guard path so an unmet guard pre-condition returns `125` and the runner records a SKIP verdict through the existing harness convention (`exit-code.txt` = `125`, `STATUS=SKIP`) instead of silently continuing as success.
- T-D04 / R8-P2-002: relaxed parent `REQ-P-001` so cross-cutting optional docs (`handover.md`, `resource-map.md`) are allowed at the phase-parent root while heavy authored docs remain forbidden.
- T-D05 / R9-P2-004: fixed authored `001-initial-doctor-commands` packet pointers to include `/001-initial-doctor-commands`.
- T-D06:
  - R9-P2-001: 001 resource-map existing-file statuses were already reconciled by Batch A; no remaining stale existing-file PLANNED rows found.
  - R9-P2-002: marked the absent 001 `scratch/` row as `MISSING` with `# absent on disk`.
  - R9-P2-003: updated `001-initial-doctor-commands/spec.md` continuity `completion_pct` from `0` to `95`, matching the reconciled implementation summary.
  - R9-P2-005: verified the parent resource-map `.opencode/skill` symlink row is gone.
  - R9-P2-007: updated 001 and 002 decision-record continuity `completion_pct` values to `100`.
  - R9-P2-008: updated `002-sandbox-testing-playbook/spec.md` continuity `completion_pct` to `95`, matching its current implementation summary.
  - R9-P2-009: verified `002-sandbox-testing-playbook/spec.md` no longer references absent `../001-initial-doctor-commands/handover.md`.

### Deferred Items

- R8-P2-001: deferred because it requires `.gemini/` writes, explicitly banned for Batch D.
- R9-P2-006: deferred because it requires editing parent `010-doctor-update-orchestrator/handover.md`, which is outside Batch D's allowed write paths.

### Verification

- `bash -n` on `harness/reset-state.sh`, `harness/capture-evidence.sh`, and `harness/run-all.sh`: PASS.
- Host guard smoke with `SPECKIT_SANDBOX` and `SPECKIT_ALLOW_HOST_RESET` unset via `run-all.sh --scenario DOC-323`: runner exited `0`, verdict `SKIP`, exit code `125`, reason `sandbox guard pre-condition not met`.
- Stale continuity command for `2026-01` through `2026-04`: 0 hits.
- Supplemental stale continuity check for `2026-05-01` through `2026-05-05`: 0 hits.
- Packet pointer verification command: 0 hits.
- Docker base verification: `FROM node:20-bookworm-slim`.
- REQ-P-001 verification: parent `spec.md` contains `cross-cutting` acceptance language.
- Strict validation of the remediation packet still fails with the pre-existing Batch A errors: `TEMPLATE_HEADERS` (14), `ANCHORS_VALID` (21), `FRONTMATTER_MEMORY_BLOCK` (5), plus `PRIORITY_TAGS` warning (61).

### Diff Stats

Current allowed-scope tracked diff stats:

```text
26 files changed, 335 insertions(+), 289 deletions(-)
```

This excludes the untracked `scratch/batch-d-summary.md` addition itself.
