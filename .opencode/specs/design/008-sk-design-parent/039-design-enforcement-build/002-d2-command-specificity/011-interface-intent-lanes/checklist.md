---
title: "Verification Checklist: D2-R11 — Interface intent lanes as visible task projections"
description: "Acceptance gates for adding the interface `tasks` array to command-metadata.json, projecting the INTERFACE TASK LANES section in interface.md, and extending design-command-surface-check.mjs with an interface-targeted lane gate, INTENT_SIGNALS reconciliation, and negative fixtures; populated with evidence during the build."
trigger_phrases:
  - "d2-r11 interface intent lanes checklist"
  - "interface intent lanes design checklist"
  - "interface task projections checklist"
importance_tier: "normal"
contextType: "planning"
status: "complete"
_memory:
  continuity:
    packet_pointer: "design/008-sk-design-parent/039-design-enforcement-build/002-d2-command-specificity/011-interface-intent-lanes"
    last_updated_at: "2026-06-29T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Bound interface tasks to INTENT_SIGNALS; checker PASS invalid=0 drift=0; 3 files scoped"
    next_safe_action: "Regenerate description.json + graph-metadata.json to clear residual generated-metadata"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-29-d2-r11-interface-intent-lanes"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "The lane set is reconciled to the live INTENT_SIGNALS keys, so the surface cannot drift from the router"
      - "tasks stays interface-targeted and is not added to the global REQUIRED_FIELDS, so the 4 siblings keep drift=0"
---
# Verification Checklist: D2-R11 — Interface intent lanes as visible task projections

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

- [x] CHK-001 [P0] Prior-D2 baseline confirmed green before any edit (`invalid=0 drift=0`)
  - **Evidence**: additive baseline confirmed; final `node design-command-surface-check.mjs` still `STATUS=PASS invalid=0 drift=0`, exit 0
- [x] CHK-002 [P0] The eleven `INTENT_SIGNALS` lanes enumerated from `design-interface/SKILL.md` and frozen as the reconciliation set in plan.md §3
  - **Evidence**: 11 keys parsed from the fenced router block: DESIGN_PRINCIPLES, REGISTER_DIALS, VARIATION_DIVERSITY, UX_QUALITY, REAL_UI_LOOP, MECHANICAL_PREFLIGHT, COPY_MOCK_DATA, REDESIGN_INTAKE, REAL_SYSTEM_GROUNDING, REAL_WORLD_REFERENCE, AESTHETICS
- [x] CHK-003 [P1] Per-lane `label` / `class` / `surface` authored in plan.md §3 and reconciled with the interface record's `argumentHint` (`--mode`) and `deferToHubWhen`
  - **Evidence**: plan.md §3 lane table; 6 `argument` surfaces map to `--mode` values, `UX_QUALITY` routes to `/design:audit` per `deferToHubWhen`
- [x] CHK-004 [P0] Scope frozen to the `/design:interface` record in `command-metadata.json` + `interface.md` (body-only) + the checker
  - **Evidence**: `git status` shows exactly 3 changed skill/command files (interface record in metadata, `interface.md`, checker); nothing else

<!-- /ANCHOR:pre-impl -->
---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] `command-metadata.json` parses as valid JSON; the interface record carries an 11-entry `tasks` array, each entry with non-empty `lane`/`label`/`class`/`surface`
  - **Evidence**: `node` JSON parse OK, 5 records; the interface `tasks` array has 11 entries, each with four non-empty string fields
- [x] CHK-011 [P0] Every `class` is one of `sibling-command`/`argument`/`internal`/`hidden`; the four named lanes (directions/preflight/redesign/handoff) are `argument`
  - **Evidence**: 6 `argument`, 1 `sibling-command`, 3 `internal`, 1 `hidden`; directions/preflight/redesign/handoff all `argument`; class-enum guard green
- [x] CHK-012 [P0] `interface.md` carries the generated `## 3. INTERFACE TASK LANES` section with each argument label and the `/design:audit` route; subsequent sections renumbered §4…§7
  - **Evidence**: `## 3. INTERFACE TASK LANES` present with 6 `--mode` labels + the `/design:audit` route; WHEN TO USE/PRECONDITIONS/INSTRUCTIONS/EMIT/EXAMPLE follow with named anchors intact
- [x] CHK-013 [P1] `interface.md` frontmatter (`description`, `argument-hint`, `allowed-tools`) is byte-unchanged (body-only edits); the four sibling wrappers untouched
  - **Evidence**: `git diff` shows interface.md frontmatter unchanged; audit/foundations/md-generator/motion wrappers have no diff

<!-- /ANCHOR:code-quality -->
---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] Stage 1 passes: the interface `tasks` array is well-formed and the lane set reconciles exactly with the eleven `INTENT_SIGNALS` keys (`invalid=0`)
  - **Evidence**: `validateInterfaceTasks` green; lane set equals the 11 parsed keys (no missing, no extra); `invalid=0`
- [x] CHK-021 [P0] Stage 2 passes: `interface.md` carries the projected task-lanes section (each argument label + the sibling route)
  - **Evidence**: `expectedInterfaceTaskLanesDrift` returns no drift; section, labels, `/design:audit` route, and not-surfaced/not-selectable notes all present
- [x] CHK-022 [P0] Full run is no-regression: all prior-D2 drift stays 0 and overall `node design-command-surface-check.mjs` reports `drift=0`, exit 0
  - **Evidence**: `STATUS=PASS STAGE=complete ... SUMMARY invalid=0 drift=0`, exit 0; all prior D2 gates intact
- [x] CHK-023 [P1] Negative fixture — removing a lane (count 10) flips the checker to exit 2 (reconciliation fails)
  - **Evidence**: lane-set mismatch → `STATUS=INVALID` "tasks lane set must match interface INTENT_SIGNALS"; orchestrator-verified, restored to `invalid=0 drift=0`
- [x] CHK-024 [P1] Negative fixture — adding a lane not in `INTENT_SIGNALS` flips the checker to exit 2 (unknown lane)
  - **Evidence**: synthetic bogus lane → `STATUS=INVALID` "... missing=[...] extra=[BOGUS...]" (`invalid=1`); restored to `invalid=0 drift=0`
- [x] CHK-025 [P1] Negative fixture — a non-`argument` lane promoted to a `/design:*` command surface flips the checker to exit 2 (lane that should not become a command)
  - **Evidence**: negative-fixture guard rejects a non-`argument` lane naming a `/design:*` command; orchestrator-verified, restored
- [x] CHK-026 [P1] Negative fixture — deleting the `## INTERFACE TASK LANES` section flips the checker to `task-lanes` drift, exit 1
  - **Evidence**: Stage-2 `expectedInterfaceTaskLanesDrift` reports `<missing section>` drift `field: "task-lanes"`, exit 1; restored
- [x] CHK-027 [P1] `node --check` passes on the edited checker (valid ESM)
  - **Evidence**: `node --check design-command-surface-check.mjs` → OK

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] The gap is closed at the source: all eleven lanes are projected, not just the obvious ones — no lane stays hidden behind the single bridge
  - **Evidence**: all 11 `INTENT_SIGNALS` lanes carry a `tasks` entry; the lane-set reconciliation fails if any lane is dropped
- [x] CHK-FIX-002 [P0] Every lane carries exactly one class, so each is either a visible `--mode`, a named sibling route, or an explicitly not-surfaced internal/hidden lane
  - **Evidence**: 6 `argument` (`--mode`), 1 `sibling-command` (`/design:audit`), 3 `internal`, 1 `hidden`; class-enum guard enforces a single valid class per lane
- [x] CHK-FIX-003 [P0] The lane set is bound to `INTENT_SIGNALS` by the checker, not just authored once in prose — adding/removing a router lane makes the surface-check fail until `tasks` is updated
  - **Evidence**: `parseInterfaceIntentSignalKeys` reads the live router block; the synthetic break (lane-set mismatch → INVALID) proves the binding bites
- [x] CHK-FIX-004 [P1] The negative fixtures actually reject lanes that should not become commands (the guard is enforced, not assumed)
  - **Evidence**: the guard rejects a non-`argument` lane naming a `/design:*` command and any lane promoted into the command set; orchestrator-verified
- [x] CHK-FIX-005 [P1] Evidence pinned to the deterministic checker report (`SUMMARY invalid=0 drift=0`), re-runnable on demand
  - **Evidence**: `node design-command-surface-check.mjs` → `SUMMARY invalid=0 drift=0`, exit 0; deterministic and re-runnable

<!-- /ANCHOR:fix-completeness -->
---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] `mode-registry.json` is byte-unchanged (identity-only, not mutated)
  - **Evidence**: `git diff` shows `mode-registry.json` unchanged
- [x] CHK-031 [P0] No file outside the `/design:interface` record in `command-metadata.json` + `interface.md` + the checker is created or modified (the four sibling records and wrappers untouched)
  - **Evidence**: `git status` shows exactly 3 changed skill/command files; the 4 sibling records and wrappers have no diff
- [x] CHK-032 [P1] The checker still treats the wrappers, the registry, and `design-interface/SKILL.md` as read-only (`readFile` only, no write/edit)
  - **Evidence**: the checker only `readFile`s the wrappers, registry, and `SKILL.md`; no write/edit calls; `mode-registry.json` and `SKILL.md` byte-unchanged

<!-- /ANCHOR:security -->
---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] plan.md / tasks.md / checklist.md synchronized on the lane table, the four-class taxonomy, the reconciliation rule, and the additive `drift=0` outcome
  - **Evidence**: all three docs reference the same 11-lane table, the `argument`/`sibling-command`/`internal`/`hidden` taxonomy, the INTENT_SIGNALS-sync rule, and the `invalid=0 drift=0` outcome
- [x] CHK-041 [P1] The additive coupling documented (one nested array on the interface record only; `tasks` deliberately not in the global `REQUIRED_FIELDS`; siblings unaffected)
  - **Evidence**: plan.md §6 Coupling note + spec.md RISKS record that `tasks` is interface-targeted, not in `REQUIRED_FIELDS`, siblings keep drift 0
- [x] CHK-042 [P1] The lane-class taxonomy documented (`sibling-command` / `argument` / `internal` / `hidden`) with the rule that only `argument` lanes are selectable tasks
  - **Evidence**: plan.md §3 lane-class taxonomy + implementation-summary "four-class lane taxonomy"; only `argument` lanes surface as selectable `--mode` tasks

<!-- /ANCHOR:docs -->
---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P0] `command-metadata.json` carries NO spec/packet/phase IDs or spec paths (evergreen [HARD])
  - **Evidence**: no spec/packet/phase ID or spec-folder path in the metadata; the `tasks` strings are lane/label/class/surface only
- [x] CHK-051 [P0] `interface.md` and the checker carry NO spec/packet/phase IDs or spec paths (evergreen [HARD])
  - **Evidence**: no IDs/paths in `interface.md` or `design-command-surface-check.mjs`; paths resolved via `import.meta.url`
- [x] CHK-052 [P1] No temp files created outside `scratch/`
  - **Evidence**: no temp files written outside the scratchpad; the three targets are the only mutations

<!-- /ANCHOR:file-org -->
---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 16 | 16/16 |
| P1 Items | 14 | 14/14 |
| P2 Items | 0 | 0/0 |

**Verification Date**: 2026-06-29
**Verified By**: claude-opus-4-8 (orchestrator-verified gate evidence)

<!-- /ANCHOR:summary -->

---

<!--
Level 2 checklist - Verification focus
Mark [x] with evidence when verified during the build
P0 must complete, P1 need approval to defer
-->
