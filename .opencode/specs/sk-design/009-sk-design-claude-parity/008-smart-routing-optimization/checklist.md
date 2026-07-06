---
title: "Verification Checklist: Phase 008 — Smart Routing Optimization (Hub + Mode Packets)"
description: "Level 2 verification checklist for blocking implementation until Phase 007 passes and preserving sk-design registry/router structure while sharpening routing vocabulary."
trigger_phrases:
  - "verification"
  - "checklist"
  - "smart routing optimization"
  - "sk-design routing vocabulary"
importance_tier: "high"
contextType: "checklist"
_memory:
  continuity:
    packet_pointer: ".opencode/specs/sk-design/009-sk-design-claude-parity/008-smart-routing-optimization/"
    last_updated_at: "2026-07-06"
    last_updated_by: "markdown-leaf-agent"
    recent_action: "Verified Phase 008 routing optimization implementation evidence."
    next_safe_action: "Proceed to Phase 009 README alignment only; Phase 008 is complete."
---
# Verification Checklist: Phase 008 — Smart Routing Optimization (Hub + Mode Packets)

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot start implementation until complete |
| **[P1]** | Required | Must complete OR get user approval to defer |
| **[P2]** | Optional | Can defer with documented reason |

<!-- /ANCHOR:protocol -->
---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Phase 007 gates pass before any Phase 008 implementation [EVIDENCE: Phase 007 checklist Gate Status CLOSED; current strict validation returned Errors: 0, Warnings: 1 (`CONTINUITY_FRESHNESS` only), accepted under the user-provided warning policy.]
  - **Evidence required**: Phase 007 strict validation exit 0, template-alignment closure, rollback path, and go/no-go state.
  - **Current state**: Verified; implementation proceeded.
- [x] CHK-002 [P0] Current hub, mode, registry, and router files are read before edit [EVIDENCE: Read `sk-design/SKILL.md`, all five `design-*/SKILL.md` files, `mode-registry.json`, and `hub-router.json` before editing.]
  - **Evidence required**: File paths and relevant current-state notes from `sk-design/SKILL.md`, the five `design-*/SKILL.md` files, `mode-registry.json`, and `hub-router.json`.
  - **Current state**: Collected; routing edits followed the reads.
- [x] CHK-003 [P0] No `.opencode/skills/sk-design/**` implementation edit occurs before Phase 007 closure [EVIDENCE: Phase 007 gate evidence was read and current strict validation was run before routing edits; pre-edit scoped status showed only the Phase 008 folder untracked.]
  - **Evidence required**: Scoped status/diff review before implementation.
  - **Current state**: Verified; no pre-gate skill edit occurred in this pass.
- [x] CHK-004 [P0] Logic-sync conflicts are escalated before writing [EVIDENCE: No logic-sync conflict found; Phase 007 continuity freshness warning was treated as non-blocking per user warning policy.]
  - **Evidence required**: Any conflict between current hub/mode/registry/router shape and this plan is reported with the prevailing truth decision.
  - **Current state**: No escalation required.

<!-- /ANCHOR:pre-impl -->
---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Registry structural keys remain unchanged [EVIDENCE: `git diff -G'workflowMode|backendKind|packet\"|proceduresPath|packetSkillName|advisorRouting|toolSurface|routerPolicy|bundleRules'` produced no output for `mode-registry.json`/`hub-router.json`; only aliases/vocabulary changed.]
  - **Evidence required**: `mode-registry.json`'s `workflowMode`, `backendKind`, `packet`, `proceduresPath`, `packetSkillName`, `advisorRouting`, and `toolSurface` keys are byte-identical before and after implementation.
  - **Current state**: Verified.
- [x] CHK-011 [P0] `hub-router.json` structural keys remain unchanged [EVIDENCE: The same structural-key diff check produced no output; `routerPolicy`/`bundleRules` were not edited.]
  - **Evidence required**: `routerPolicy`/`bundleRules` structure is byte-identical before and after implementation; only `vocabularyClasses`/`routerSignals` content may change.
  - **Current state**: Verified.
- [x] CHK-012 [P1] Existing five public modes remain the public surface [EVIDENCE: `mode-registry.json` still contains only `interface`, `foundations`, `motion`, `audit`, and `md-generator`; no mode object was added or removed.]
  - **Evidence required**: `interface`, `foundations`, `motion`, `audit`, and `md-generator` remain the only `workflowMode` values.
  - **Current state**: Verified.
- [x] CHK-013 [P1] Routing vocabulary changes do not duplicate procedure-card schema logic that belongs to Phase 003/004 [EVIDENCE: Each mode Section 2 now cross-references the existing Section 3 procedure-card table by relative path; no procedure-card schema or card content was edited.]
  - **Evidence required**: Routing prose cross-references existing procedure cards by relative path; it does not redefine the procedure-card schema.
  - **Current state**: Verified.

<!-- /ANCHOR:code-quality -->
---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] Strict spec validation attempted for Phase 008 [EVIDENCE: Final validation command and result are recorded in `implementation-summary.md` after metadata regeneration.]
  - **Evidence required**: Validation command and exit code for this phase folder.
  - **Current state**: Verification evidence recorded in this pass.
- [x] CHK-021 [P0] Negative controls prove no new public mode or registry bypass [EVIDENCE: Structural-key diff check produced no output; file diff includes only the hub, five mode `SKILL.md` files, `hub-router.json`, `mode-registry.json`, and Phase 008 docs/benchmark output.]
  - **Evidence required**: File inventory or route review shows no new `workflowMode`, no mode-packet graph metadata added, and no registry/router structural diff.
  - **Current state**: Verified.
- [x] CHK-022 [P1] Benchmark rerun evidence is captured after implementation [EVIDENCE: `benchmark-after-008/report.md` shows aggregate 69/100, D1inter unscored-mode-a, D2 100, D3 0, D5 100, D4 unscored-mode-a; `toolSurface.violations` is empty in `report.json`.]
  - **Evidence required**: Lane-C skill-benchmark command output compared against `benchmark/after-009/report.json` (D2/D5 not regressed; D1inter/D3 status honestly reported).
  - **Current state**: Captured.
- [x] CHK-023 [P1] Proposed keyword/alias changes are individually traceable to a named benchmark finding [EVIDENCE: `tasks.md` Implementation Evidence maps AI-003, TV-003, TV-005, MG-001, MG-002, MG-003, SR-001, SR-004, PB-001, PB-002, and PB-003 to mode-boundary changes or explicit no-change decisions.]
  - **Evidence required**: Ambiguity resolution map cites specific `baseline/`/`after-009/` scenario IDs or dimension scores for each change.
  - **Current state**: Verified.

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-005 [P0] Hub SMART ROUTING keyword/alias sharpening exists [EVIDENCE: `sk-design/SKILL.md` Section 2 now includes `Mode Vocabulary Guardrails` and synchronized hub keyword updates.]
  - **Evidence required**: `sk-design/SKILL.md` Section 2 keyword/alias prose is sharpened without changing the routing rule or discriminator contract.
  - **Current state**: Implemented.
- [x] CHK-006 [P0] All five mode packets' SMART ROUTING keyword/alias sharpening exists [EVIDENCE: `design-interface`, `design-foundations`, `design-motion`, `design-audit`, and `design-md-generator` Section 2 blocks each gained boundary/alias sharpening prose.]
  - **Evidence required**: `design-interface/`, `design-foundations/`, `design-motion/`, `design-audit/`, and `design-md-generator/` `SKILL.md` Section 2 blocks are each sharpened.
  - **Current state**: Implemented.
- [x] CHK-007 [P0] Procedure-card selection logic is explicitly cross-referenced in each mode's routing prose [EVIDENCE: Each mode Section 2 states its Section 3 procedure-card selection table is part of the routing contract and cites `procedures/` or `../shared/procedures/` paths.]
  - **Evidence required**: Each mode's Section 2 cites its own procedure-card CONDITIONAL selection table by relative path as part of the same routing contract.
  - **Current state**: Implemented; procedure-card content/schema unchanged.
- [x] CHK-008 [P1] Handoff to Phase 009 is explicit [EVIDENCE: `tasks.md` Implementation Evidence states README alignment remains in `../009-readme-alignment/`; Phase 008 only changed routing vocabulary/prose.]
  - **Evidence required**: README-alignment detail is deferred to Phase 009 with clear criteria.
  - **Current state**: Verified.

<!-- /ANCHOR:fix-completeness -->
---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] `toolSurface` boundaries remain unchanged for all five modes [EVIDENCE: Structural-key diff check included `toolSurface` and produced no output; benchmark `report.json` gate has `toolSurface.violations: []`.]
  - **Evidence required**: The four read-only modes (`interface`, `foundations`, `motion`, `audit`) keep `allowed: [Read, Glob, Grep]` / `forbidden: [Write, Edit, Bash]`; `md-generator` keeps its mutating `toolSurface`.
  - **Current state**: Verified.
- [x] CHK-031 [P0] No routing-vocabulary change expands a mode's tool permissions [EVIDENCE: No `toolSurface` lines changed; the four read-only mode `allowed-tools` frontmatter values and `md-generator` mutating frontmatter remain unchanged.]
  - **Evidence required**: Review confirms keyword/alias sharpening does not introduce new tool grants or bypass the registry's `toolSurface` contract.
  - **Current state**: Verified.
- [x] CHK-032 [P1] Rollback path preserves unrelated work [EVIDENCE: `plan.md` rollback remains non-destructive first: inspect diff/status, stop on invariant failure, avoid stash/reset/revert until unrelated ownership is clear.]
  - **Evidence required**: Non-destructive rollback path and explicit confirmation rule are recorded.
  - **Current state**: Verified.

<!-- /ANCHOR:security -->
---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks/checklist stay synchronized [EVIDENCE: `spec.md` status is Complete; `plan.md` gates are checked; `tasks.md` and this checklist record the same benchmark/negative-control evidence.]
  - **Evidence required**: Cross-document review after implementation evidence is recorded.
  - **Current state**: Verified.
- [x] CHK-041 [P1] Docs do not claim implementation completion prematurely [EVIDENCE: Completion claims were reconciled after routing edits, benchmark rerun, JSON validation, structural-key diff check, and final validation sequence.]
  - **Evidence required**: `tasks.md` and `checklist.md` say planned/not started until routing-vocabulary implementation and checks are complete.
  - **Current state**: Verified.
- [x] CHK-042 [P2] Optional handoff notes recorded if implementation stays blocked [EVIDENCE: Not blocked; handoff note records Phase 009 README alignment as the next sibling phase.]
  - **Evidence required**: Continuation notes recorded once implementation begins.
  - **Current state**: Completed as a non-blocked handoff note.

<!-- /ANCHOR:docs -->
---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Phase writes remain inside the Phase 008 folder for this documentation task [EVIDENCE: Phase documentation and benchmark output are under the Phase 008 folder; implementation writes outside the folder are limited to the allowed sk-design routing files.]
  - **Evidence required**: File list includes only the requested Phase 008 docs and metadata.
  - **Current state**: Verified.
- [x] CHK-051 [P1] Parent root, sibling phases, and unrelated `.opencode/skills/sk-design/**` are not edited by this phase [EVIDENCE: Scoped diff file list shows only `sk-design/SKILL.md`, five mode `SKILL.md` files, `hub-router.json`, `mode-registry.json`, and Phase 008 artifacts.]
  - **Evidence required**: Final file list and validation notes.
  - **Current state**: Verified.

<!-- /ANCHOR:file-org -->
---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 13 | 13/13 |
| P1 Items | 10 | 10/10 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-07-06.
**Verified By**: gpt-5.5.
**Gate Status**: CLOSED. All Phase 008 P0/P1 items have evidence; final strict validation result is recorded in `implementation-summary.md`.

<!-- /ANCHOR:summary -->
