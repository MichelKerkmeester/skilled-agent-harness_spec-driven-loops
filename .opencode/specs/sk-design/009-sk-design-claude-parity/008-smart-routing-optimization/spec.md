---
title: "Feature Specification: Phase 008 — Smart Routing Optimization (Hub + Mode Packets)"
description: "Level 2 specification for a content-quality optimization pass over sk-design's SMART ROUTING sections (hub + five mode packets), informed by Lane-C benchmark evidence and the mode-registry.json transform-verb routing table."
trigger_phrases:
  - "smart routing optimization"
  - "sk-design routing vocabulary"
  - "hub-router keyword sync"
  - "mode packet SMART ROUTING"
  - "procedure-card routing cross-reference"
  - "phase 008"
importance_tier: "high"
contextType: "spec"
_memory:
  continuity:
    packet_pointer: ".opencode/specs/sk-design/009-sk-design-claude-parity/008-smart-routing-optimization/"
    last_updated_at: "2026-07-06"
    last_updated_by: "markdown-leaf-agent"
    recent_action: "Created planned Level 2 smart routing optimization docs."
    next_safe_action: "Wait for Phase 007 gates to pass before any sk-design routing-vocabulary implementation."
---
# Feature Specification: Phase 008 — Smart Routing Optimization (Hub + Mode Packets)

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-07-06 |
| **Phase Folder** | `.opencode/specs/sk-design/009-sk-design-claude-parity/008-smart-routing-optimization/` |
| **Parent Packet** | `.opencode/specs/sk-design/009-sk-design-claude-parity/` |
| **Writable Scope** | Phase 008 docs plus scoped sk-design routing vocabulary/prose files named by this phase |
| **Depends On** | `007-procedure-card-template-alignment/` gate closed with Errors: 0 and one continuity freshness warning |

<!-- /ANCHOR:metadata -->
---

## Phase Navigation

| Link | Target |
|------|--------|
| **Parent Spec** | ../spec.md |
| **Predecessor Phase** | ../007-procedure-card-template-alignment/spec.md |
| **Successor Phase** | ../009-readme-alignment/spec.md |

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The sk-design Lane-C skill-benchmark harness recorded a `CONDITIONAL` verdict at aggregate `69/100` in both the frozen `benchmark/baseline/` run (21 scenarios, pre-Phase-002) and the Phase-005 `benchmark/after-009/` rerun (24 scenarios, post-Phase-005). In both runs, D3 efficiency scored `0/100` and D1inter (advisor routing precision) stayed `unscored-mode-a` — the harness cannot fully score routing precision or route-efficiency without a live-mode run and route-gold fixtures that do not currently exist. The `after-009/report.md` contamination findings also show literal keyword overlap across mode boundaries in several scenario prompts (for example TV-003 carries `hero section, clarify, hierarchy`, spanning `design-interface` aliases and the `design-foundations` "Use it for" vocabulary), which is a qualitative signal that the hub and mode SMART ROUTING keyword/alias prose has not been re-audited since Phase 004 refactored the five mode packets and added private procedure-card CONDITIONAL selection tables inside each mode's Section 2. Those procedure-card tables exist in all five modes today, but the surrounding keyword/alias prose was not deliberately re-tuned against the benchmark's ambiguity signals or explicitly cross-referenced as part of the same routing contract.

### Purpose

Implement a content-quality optimization pass over the SMART ROUTING sections in `sk-design/SKILL.md` (hub) and all five mode packets' `SKILL.md`, grounded in the `benchmark/baseline/` and `benchmark/after-009/` report evidence and the `mode-registry.json` transform-verb routing table. The pass sharpens keyword/alias coverage per mode, resolves the ambiguity the benchmark's D1/D3 dimensions expose where prose or vocabulary can safely help, makes each mode's existing private procedure-card selection logic (added Phase 004) explicit within its routing prose, and keeps `hub-router.json` `vocabularyClasses`/`routerSignals` synchronized with keyword changes — all without altering registry structure, `workflowMode` values, or `toolSurface` entries.

<!-- /ANCHOR:problem -->
---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Read `benchmark/baseline/skill-benchmark-report.json`/`.md` and `benchmark/after-009/report.json`/`.md` and extract the concrete D1/D3-linked ambiguity findings (contamination list, D3 route-gold gap, D1inter live-mode gap) that will ground the proposed keyword changes.
- Implement sharpened keyword/alias prose for `sk-design/SKILL.md` Section 2 SMART ROUTING (hub-level routing rule, discriminator, and manager-intake vocabulary).
- Implement sharpened keyword/alias prose for each of the five mode packets' `SKILL.md` Section 2 SMART ROUTING: `design-interface`, `design-foundations`, `design-motion`, `design-audit`, `design-md-generator`.
- Implement explicit cross-referencing of each mode's existing private procedure-card CONDITIONAL selection table (added Phase 004) within its routing prose, so procedure-card selection and keyword/alias routing read as one coherent contract.
- Implement `hub-router.json` `vocabularyClasses`/`routerSignals` updates that stay in sync with hub/mode keyword or alias changes.
- Implement `mode-registry.json` `aliases` vocabulary-only updates, explicitly excluding `workflowMode`, `backendKind`, `packet`, `proceduresPath`, `packetSkillName`, `advisorRouting`, and `toolSurface` keys from any proposed change.
- Run the benchmark rerun and scoped diff review as acceptance evidence.

### Out of Scope

- Changing behavior outside the routing vocabulary/prose and synchronized alias/class vocabulary edits implemented here.
- Changing `mode-registry.json` registry keys (`workflowMode`, `backendKind`, `packet`, `proceduresPath`, `packetSkillName`, `advisorRouting`, `toolSurface`) or `hub-router.json`'s `routerPolicy`/`bundleRules` structure.
- Creating, renaming, or removing modes, procedure cards, or public skill identities.
- Editing `manual_testing_playbook/` scenario content or the benchmark harness itself (`deep-loop-workflows/deep-improvement/scripts/skill-benchmark/`).
- Editing `.opencode/commands/design/**`, `.opencode/skills/sk-doc/**`, or unrelated `.opencode/skills/sk-design/**` content outside the allowed routing files.
- Building route-gold/`expected.mode` tagging infrastructure to close the D3 efficiency gap structurally; the plan may flag this as a related but distinct benchmark-maintenance concern without implementing it.
- Dispatching sub-agents or nested Task execution.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `spec.md` | Create/update | Phase 008 scope, requirements, success criteria, and constraints |
| `plan.md` | Create/update | Routing optimization execution plan, quality gates, dependencies, and rollback |
| `tasks.md` | Create/update | Pending work queue for keyword audit, drafting, registry/router sync, and verification |
| `checklist.md` | Create/update | P0/P1 evidence gates that block implementation until Phase 007 passes |
| `description.json` | Create/update | Phase metadata for memory/search discovery |
| `graph-metadata.json` | Create/update | Phase graph metadata and dependency linkage |

### Routing Optimization Targets

| Capability | Required Behavior | Boundary |
|------------|-------------------|----------|
| Hub keyword/alias sharpening | `sk-design/SKILL.md` Section 2 SMART ROUTING keyword/alias prose is sharpened for the five `workflowMode` discriminators | No new discriminator field; the routing rule and `workflowMode`/`backendKind` discriminator contract stay unchanged |
| Mode keyword/alias sharpening | Each of the five mode packets' Section 2 SMART ROUTING keyword/alias coverage is sharpened to reduce the cross-mode ambiguity the benchmark contamination findings flag (for example the TV-003 `hierarchy`/`clarify`/`hero section` overlap) | No `workflowMode`, `backendKind`, or `toolSurface` change in any mode |
| D1/D3-informed ambiguity resolution | Proposed keyword changes cite specific `baseline/`/`after-009/` findings (D3 `0/100` both runs, D1inter `unscored-mode-a` both runs, named contamination scenarios) as their justification | Does not require live-mode D1inter/D4 scoring to close this phase; documents the qualitative gap addressed and the residual live-mode-only limitation honestly |
| Procedure-card routing cross-reference | Each mode's routing prose explicitly cross-references its existing private procedure-card CONDITIONAL selection table (added Phase 004) so procedure selection and keyword/alias routing read as one coherent contract | Does not create new procedure cards or change the `procedures/` schema; schema ownership stays with Phase 003/Phase 004 |
| `hub-router.json` sync | `vocabularyClasses` and `routerSignals` content reflects any keyword/alias prose change made in the hub or mode `SKILL.md` files | Only `routerPolicy`/`bundleRules` structural keys are frozen; `vocabularyClasses`/`routerSignals` entries may be updated |
| `mode-registry.json` vocabulary-only edits | `aliases` arrays and the `transformVerbRouting` vocabulary block may be updated | `workflowMode`, `backendKind`, `packet`, `proceduresPath`, `packetSkillName`, `advisorRouting`, and `toolSurface` keys stay byte-identical |

<!-- /ANCHOR:scope -->
---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Phase 007 gates pass before implementation | Phase 008 checklist records Phase 007 strict validation, template-alignment closure, and go/no-go state before any hub/mode SKILL.md edit |
| REQ-002 | Registry structural keys remain unchanged | `mode-registry.json`'s `workflowMode`, `backendKind`, `packet`, `proceduresPath`, `packetSkillName`, `advisorRouting`, and `toolSurface` keys are named as frozen in the plan; only `aliases`/`transformVerbRouting` vocabulary is in scope |
| REQ-003 | Hub SMART ROUTING vocabulary sharpening is defined | Plan names the specific hub Section 2 keyword/alias prose to sharpen and the benchmark evidence driving each change |
| REQ-004 | All five mode SMART ROUTING vocabularies are covered | Plan names keyword/alias sharpening targets for `design-interface`, `design-foundations`, `design-motion`, `design-audit`, and `design-md-generator` |
| REQ-005 | `hub-router.json` sync obligation is explicit | Plan states that `vocabularyClasses`/`routerSignals` must be updated to match any implemented keyword/alias change, and names the 22 existing `vocabularyClasses` entries as the baseline to reconcile against |
| REQ-006 | Procedure-card cross-reference obligation is explicit | Plan requires each mode's routing prose to cite its own procedure-card CONDITIONAL selection table by relative path as part of the same routing contract |
| REQ-007 | Benchmark evidence grounds every proposed change | Plan cites `benchmark/baseline/skill-benchmark-report.json` and `benchmark/after-009/report.json` dimension scores and named contamination scenarios as the basis for the keyword changes it proposes |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-008 | Existing five public modes and registry authority remain unchanged | Plan states no new `workflowMode` values, no mode additions/removals, and `mode-registry.json` remains the routing source of truth |
| REQ-009 | Negative controls documented | Checklist includes no registry-key rename, no `toolSurface` change, no new public modes, and no structural `hub-router.json`/`routerPolicy` edit |
| REQ-010 | Handoff to Phase 009 is explicit | This spec and `tasks.md` hand off README-alignment detail to Phase 009 only |
| REQ-011 | Verification commands are listed | `plan.md`, `tasks.md`, and `checklist.md` record strict spec validation and the canonical Lane-C skill-benchmark rerun command needed after implementation |
| REQ-012 | Rollback path is non-destructive first | `plan.md` names diff/status inspection first and requires explicit approval before destructive rollback |

<!-- /ANCHOR:requirements -->
---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Phase 008 docs and metadata exist and validate as a Level 2 child packet.
- **SC-002**: Implementation remains blocked until Phase 007 gates pass with evidence.
- **SC-003**: The plan names concrete, benchmark-cited keyword/alias sharpening targets for the hub and all five mode packets.
- **SC-004**: The plan keeps `mode-registry.json` registry keys and `hub-router.json` structural keys frozen, limiting change to routing vocabulary content.
- **SC-005**: The plan makes the Phase 004 procedure-card selection logic an explicit, cross-referenced part of each mode's routing prose.
- **SC-006**: The plan is honest about the D1inter/D3 live-mode scoring limitation — it does not claim the optimization pass alone will change the benchmark's numeric verdict, only that it reduces documented qualitative ambiguity and prepares the vocabulary for a future route-gold-tagged rerun.

<!-- /ANCHOR:success-criteria -->
---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 007 gate closure | Implementation cannot start safely | Keep Phase 008 planned/not-started until Phase 007 evidence passes |
| Dependency | Existing `sk-design` registry and router state | Sharpening could drift into structural change | Require scoped registry/router diff review limited to `aliases`/`transformVerbRouting`/`vocabularyClasses`/`routerSignals` before and after implementation |
| Risk | Keyword sharpening accidentally renames or removes a registry structural key | Public routing contract breaks | Checklist negative control explicitly diffs `workflowMode`/`backendKind`/`packet`/`proceduresPath`/`packetSkillName`/`advisorRouting`/`toolSurface` and requires zero change |
| Risk | D3 efficiency stays `0/100` even after keyword sharpening because D3 needs live-mode route-gold rows, not prose changes alone | Overclaiming benchmark impact | Document the limitation explicitly in success criteria and open questions; do not promise a numeric score improvement |
| Risk | `hub-router.json` `vocabularyClasses`/`routerSignals` drift out of sync with `mode-registry.json` `aliases` (two adjacent but separate vocabulary sources) | Router and registry vocabulary disagree, reintroducing ambiguity | Plan requires a cross-check pass between both files after any keyword edit, before claiming the sync obligation (REQ-005) met |
| Risk | Contamination-driven prose changes conflict with existing `transformVerbRouting.excludedAliases` (e.g. `foundations: typeset, colorize`; `audit: harden, polish`) | New alias could contradict an existing intentional exclusion | Plan requires reading `transformVerbRouting` before proposing any alias change and preserving existing exclusions unless explicitly revised with rationale |

<!-- /ANCHOR:risks -->
---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Traceability
- **NFR-T01**: Every proposed keyword/alias change traces to a named `benchmark/baseline/` or `benchmark/after-009/` finding (dimension score or contamination scenario ID).
- **NFR-T02**: Every later implementation change must have an explicit Routing Optimization Target row or checklist item.

### Maintainability
- **NFR-M01**: Routing vocabulary sharpening stays in the hub and existing mode `SKILL.md` files and the registry/router vocabulary fields; it does not introduce new files or new routing mechanisms.
- **NFR-M02**: Negative rules (no registry-key rename, no `toolSurface` change) are visible to future mode-packet authors in `checklist.md`.

### Safety
- **NFR-S01**: No `.opencode/skills/sk-design/**` implementation edit is allowed while Phase 007 is unresolved.
- **NFR-S02**: Rollback must preserve unrelated user or sibling-phase work.

### Verification
- **NFR-V01**: Strict spec validation must run for this phase packet.
- **NFR-V02**: Later implementation must include a Lane-C skill-benchmark rerun and scoped registry/router diff as evidence.

<!-- /ANCHOR:nfr -->
---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

### Data Boundaries
- **Phase 007 incomplete or not yet authored**: Keep this phase in planned/not-started state and do not edit `sk-design` files.
- **Benchmark reports become stale before implementation**: Re-run the canonical Lane-C command and cite the fresh report instead of `baseline/`/`after-009/` if implementation happens long after this plan is authored.
- **Keyword change conflicts with an existing `transformVerbRouting.excludedAliases` entry**: Record the mismatch and stop for logic-sync before writing routing prose.

### Error Scenarios
- **Validator fails**: Fix docs/metadata inside this phase folder only, then re-run strict validation.
- **Benchmark harness unavailable during implementation**: Treat the benchmark-rerun evidence requirement as blocked and record it as an approved deferral rather than a silent skip.
- **D3 stays `0/100` after implementation**: Not a phase failure by itself; document the residual live-mode/route-gold gap and route it to a distinct benchmark-maintenance follow-up rather than reopening this phase indefinitely.

### Concurrent Operations
- **User changes Phase 007 during this work**: Re-read Phase 007 gate state before implementation starts.
- **Sibling phase docs appear first**: Treat them as read-only context unless this phase explicitly depends on them.
- **Unrelated worktree changes appear**: Preserve them and keep Phase 008 writes scoped to this folder.

<!-- /ANCHOR:edge-cases -->
---

<!-- ANCHOR:questions -->
## 9. OPEN QUESTIONS

- What exact Phase 007 evidence will be accepted as the go signal for Phase 008 implementation? **Resolution required before implementation.**
- Should the D3 route-gold tagging gap (adding `expected.mode`-style fixtures to the playbook) be raised as a distinct benchmark-maintenance backlog item during this phase, or deferred entirely until after Phase 009? **Resolution required before implementation.**
- Which specific contamination-flagged keyword conflicts (for example TV-003's `hierarchy`/`clarify`/`hero section` overlap) get resolved via a new `transformVerbRouting.excludedAliases` entry versus prose-only disambiguation? **Resolution required during implementation drafting.**

<!-- /ANCHOR:questions -->
---

<!-- ANCHOR:related-docs -->
## RELATED DOCUMENTS

- **Parent Packet**: `../spec.md`
- **Predecessor Gate**: `../007-procedure-card-template-alignment/`
- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Benchmark Evidence**: `../../../../skills/sk-design/benchmark/baseline/skill-benchmark-report.md`, `../../../../skills/sk-design/benchmark/after-009/report.md`

<!-- /ANCHOR:related-docs -->
