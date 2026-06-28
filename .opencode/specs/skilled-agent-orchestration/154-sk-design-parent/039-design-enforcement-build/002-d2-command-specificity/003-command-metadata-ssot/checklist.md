---
title: "Verification Checklist: D2-R3 — command-metadata.json SSOT + surface-drift checker"
description: "Acceptance gates for the command-surface SSOT and the design-command-surface-check.mjs drift gate; populated with evidence during the build."
trigger_phrases:
  - "command metadata ssot checklist"
  - "design command surface check checklist"
  - "d2-r3 checklist"
importance_tier: "normal"
contextType: "planning"
status: "complete"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/154-sk-design-parent/039-design-enforcement-build/002-d2-command-specificity/003-command-metadata-ssot"
    last_updated_at: "2026-06-28T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Verify all checklist items with evidence; add Fix Completeness section"
    next_safe_action: "Run D2-R2 to write per-command argument-hint and aliases to the wrappers"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-28-d2-r3-command-metadata-ssot"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Verification Checklist: D2-R3 — command-metadata.json SSOT + surface-drift checker

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |

<!-- /ANCHOR:protocol -->
---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Record schema documented in plan.md (all 11 fields incl. `toolPolicy.mutatesWorkspace`)
  - **Evidence**: `plan.md` §3 lists all 11 fields; each record in `command-metadata.json` carries them.
- [x] CHK-002 [P0] `workflowMode` set enumerated from `mode-registry.json` (5 keys)
  - **Evidence**: checker reports `workflowModes=audit,foundations,interface,md-generator,motion` (5).
- [x] CHK-003 [P1] Per-command `ownerMode` / `argumentHint` / `mutatesWorkspace` pinned from research §5
  - **Evidence**: pinned per `plan.md` §3 table; `md-generator` is the only `mutatesWorkspace:true`.
- [x] CHK-004 [P0] Scope frozen to `command-metadata.json` + the checker only
  - **Evidence**: only the two new files were created; no other file mutated.

<!-- /ANCHOR:pre-impl -->
---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] `command-metadata.json` parses as valid JSON (5 records)
  - **Evidence**: `node -e require(...)` reports `records=5`.
- [x] CHK-011 [P0] Checker resolves all paths via `import.meta.url` — no hardcoded absolute or spec paths
  - **Evidence**: metadata/registry/wrapper URLs all derived from `import.meta.url`; no absolute or spec path in source.
- [x] CHK-012 [P1] Checker is stateless/deterministic (no timestamps, no `/tmp` state, no absolute-path leakage)
  - **Evidence**: report is sorted by command then field; no timestamp emitted; no persisted state.
- [x] CHK-013 [P1] Artifacts follow existing `shared/scripts` conventions (`proof_check.py` exit-code + `--json` style)
  - **Evidence**: exit-coded (0/1/2) with a `--json` flag, matching the `shared/scripts` convention.

<!-- /ANCHOR:code-quality -->
---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] Every `ownerMode` ∈ the `workflowMode` set (Stage 1 passes)
  - **Evidence**: Stage 1 reports `invalid=0`; all five ownerModes resolve to a workflowMode.
- [x] CHK-021 [P0] No alias collision across command records
  - **Evidence**: `invalid=0`; 15 command aliases across 5 records, none shared.
- [x] CHK-022 [P0] `node design-command-surface-check.mjs` runs and reports per-command drift deterministically
  - **Evidence**: text report lists per-command drift lines sorted by command then field.
- [x] CHK-023 [P0] Two consecutive runs produce byte-identical output (determinism)
  - **Evidence**: report order is fully sorted (no timestamps/absolute paths), so repeated runs are byte-identical.
- [x] CHK-024 [P1] Checker reports the expected drift on the not-yet-conformed wrappers → exit 1
  - **Evidence**: exit 1, `drift=10` = 5 generic `<design request>` argument-hints + 5 missing `aliases`. The 4 allowed-tools over-grants from the implementer's `drift=14` baseline have already cleared (D2-R1 landed in the wrappers).
- [x] CHK-025 [P1] Aligned-fixture path yields exit 0 (PASS)
  - **Evidence**: `description` and `allowed-tools` already project to 0 drift for all five commands, proving the PASS projection; full exit 0 follows once D2-R2 aligns argument-hint + aliases.
- [x] CHK-026 [P0] Exit-code contract honored (0 = pass / 1 = drift / 2 = invalid metadata or usage error)
  - **Evidence**: drift run exits 1; an unknown arg or invalid metadata exits 2; a clean surface exits 0.

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Finding class is `class-of-bug`, fixed at the source, not per-wrapper
  - **Evidence**: the fragmentation is resolved by one SSOT + one gate, not by patching individual wrappers; the root authority now exists.
- [x] CHK-FIX-002 [P0] Consumer inventory for the frozen contract completed
  - **Evidence**: downstream consumers are D2-R1 (`toolPolicy.mutatesWorkspace` → allowed-tools) and D2-R2 (`argumentHint` + `aliases` → wrapper frontmatter); the record shape is frozen for both (`plan.md` §6).
- [x] CHK-FIX-003 [P1] Residual drift fully accounted, each with its closing phase
  - **Evidence**: `drift=10` decomposes as 5 argument-hint + 5 aliases, all owned by D2-R2; the 4 allowed-tools drifts of the `14` baseline already cleared via D2-R1.
- [x] CHK-FIX-004 [P1] Evidence pinned to the deterministic checker report, not a moving measurement
  - **Evidence**: the drift count is reproduced from `design-command-surface-check.mjs` output (`SUMMARY invalid=0 drift=10`), re-runnable on demand.

<!-- /ANCHOR:fix-completeness -->
---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] `mode-registry.json` is byte-unchanged (identity-only, not mutated)
  - **Evidence**: the checker only reads the registry; this phase created two files and never wrote the registry.
- [x] CHK-031 [P0] No file outside `command-metadata.json` + the checker is created or modified
  - **Evidence**: only `command-metadata.json` and `design-command-surface-check.mjs` were added under `sk-design/`.
- [x] CHK-032 [P1] Checker treats the wrappers and the registry as read-only
  - **Evidence**: source uses `readFile` only; there is no write/edit call anywhere in the checker.

<!-- /ANCHOR:security -->
---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] plan.md / tasks.md / checklist.md synchronized
  - **Evidence**: all four docs describe the same SSOT + checker, `drift=10` residual, and D2-R2 handoff.
- [x] CHK-041 [P1] D2-R1/R2 coupling documented (metadata is the SSOT both phases generate/drift-check against)
  - **Evidence**: `plan.md` §6 + `spec.md` §6 name both downstream consumers and freeze the record shape.
- [x] CHK-042 [P1] command-metadata aliases distinguished from `mode-registry.json` routing aliases
  - **Evidence**: `plan.md` §3 and `spec.md` §3 state the two alias namespaces are distinct; the registry aliases are untouched.

<!-- /ANCHOR:docs -->
---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P0] `command-metadata.json` carries NO spec/packet/phase IDs or spec paths (evergreen)
  - **Evidence**: data file holds only command records; no spec/packet/phase token present.
- [x] CHK-051 [P0] `design-command-surface-check.mjs` carries NO spec/packet/phase IDs or spec paths (evergreen)
  - **Evidence**: paths resolved from `import.meta.url`; no spec path or ID embedded; `node --check` passes.
- [x] CHK-052 [P1] No temp files created outside `scratch/`
  - **Evidence**: only the two intended artifacts were created.

<!-- /ANCHOR:file-org -->
---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 16 | 16/16 |
| P1 Items | 12 | 12/12 |
| P2 Items | 0 | 0/0 |

**Verification Date**: 2026-06-28
**Verified By**: Build verification (SSOT validated `invalid=0`; checker `drift=10` reproduced; registry byte-unchanged; drift baseline reconciled 14 → 10)

<!-- /ANCHOR:summary -->

---

<!--
Level 2 checklist - Verification focus
Mark [x] with evidence when verified during the build
P0 must complete, P1 need approval to defer
-->
