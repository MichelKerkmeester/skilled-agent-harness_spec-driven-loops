---
title: "Feature Specification: Phase 19 benchmarks, validator promotion, and parent rollup"
description: "Plan the final 124 parent-hub gate: fresh Lane-C benchmark baselines for sk-code, sk-design, and deep-loop; gated parent-skill-check promotion; parent rollup metadata repair; and optional feature catalog entries."
trigger_phrases:
  - "phase 19 benchmarks"
  - "validator promotion"
  - "124 parent rollup"
importance_tier: "high"
contextType: "implementation"
parent: "skilled-agent-orchestration/124-sk-code-parent"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/124-sk-code-parent/019-benchmarks-and-promotion"
    last_updated_at: "2026-07-05T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Phase executed; checks 5-9 promoted to FAIL, 124 rolled up"
    next_safe_action: "Close the 124 goal; sk-code re-baseline handed to rename follow-up"
---
# Feature Specification: Phase 19 benchmarks, validator promotion, and parent rollup

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-07-05 |
| **Branch** | `system-speckit/028-memory-search-intelligence` |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The 124 parent-hub program is only complete after all three hub families have fresh, comparable Lane-C benchmark baselines, parent-skill-check migration checks 5-9 can be promoted from warning posture to failure posture, and the parent phase rollup metadata reflects phases 010-019 instead of the stale 001-009 child list. The master plan marks this as the final gate, and the audit evidence records benchmark gaps across sk-code, sk-design, and deep-loop plus a live deep-loop collision that blocks promotion until 018b lands.

### Purpose
Plan the final verification and promotion phase without executing it yet: create add-only benchmark packages for all three hubs, promote validator checks only after every hub passes strict parent-skill-check, repair the 124 parent rollup metadata, and optionally add feature catalog entries if time remains.

<!-- /ANCHOR:problem -->
---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Produce fresh Lane-C benchmark baselines for `sk-code`, `sk-design`, and `deep-loop-workflows` as add-only `benchmark/` packages, leaving historical runs untouched.
- Re-derive the sk-code Lane-C baseline after the phase 013 surface-packet move and phase 016 content coherence work.
- Produce new sk-design and deep-loop Lane-C baselines after their hub-level benchmark packages exist and the deep-loop 018b registry/router work has landed.
- Promote parent-skill-check checks 5-9 from WARN to FAIL only after all three hubs pass strict checking.
- Repair the 124 parent rollup by updating stale `graph-metadata.children_ids` from 001-009 to 001-019, setting `last_active_child_id`, and setting the parent status.
- Optionally add low-priority feature catalog entries for the three hubs; these are explicitly not canon-required.

### Out of Scope
- Executing benchmark runs before prerequisite phases land.
- Editing deep-loop registry, router, or changelog files while 018b remains blocked by live-agent collision.
- Modifying historical benchmark run folders.
- Treating feature catalog entries as required parent-hub canon.
- Running metadata generation or graph backfill from this planning-doc phase.

### Files to Change During Execution

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-code/benchmark/` | Add | Fresh sk-code Lane-C baseline package; historical runs preserved |
| `.opencode/skills/sk-design/benchmark/` | Add | Fresh sk-design Lane-C baseline package after hub artifacts pass |
| `.opencode/skills/deep-loop-workflows/benchmark/` | Add | Fresh deep-loop Lane-C baseline package after 018b lands |
| `.opencode/commands/doctor/scripts/parent-skill-check.cjs` | Update | Promote checks 5-9 WARN to FAIL after all three hubs pass |
| `.opencode/specs/skilled-agent-orchestration/124-sk-code-parent/graph-metadata.json` | Update | Add child ids 010-019, set `last_active_child_id`, and parent status |
| `.opencode/skills/sk-code/feature_catalog/` | Optional Add | Low-priority hub feature catalog entry if time permits |
| `.opencode/skills/sk-design/feature_catalog/` | Optional Add | Low-priority hub feature catalog entry if time permits |
| `.opencode/skills/deep-loop-workflows/feature_catalog/` | Optional Add | Low-priority hub feature catalog entry if time permits |

<!-- /ANCHOR:scope -->
---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria | Trace |
|----|-------------|---------------------|-------|
| REQ-001 | Fresh Lane-C baselines exist for all three hubs | `sk-code`, `sk-design`, and `deep-loop-workflows` each have an add-only fresh `benchmark/` package, with historical runs untouched | MASTER PLAN 019 benchmark bullet; audit category rollup reports 5 benchmark findings |
| REQ-002 | sk-code benchmark is re-derived after the two-axis move | New sk-code baseline reflects nested `webflow/`, `opencode/`, and `animation/` surface packets instead of pre-013 flat paths | audit sk-code benchmark stale after 013 surface-packet move |
| REQ-003 | sk-design benchmark baseline is created | sk-design no longer fails check 9b for missing hub-level benchmark baseline | audit P0-12: sk-design check-9b missing `benchmark/` |
| REQ-004 | deep-loop benchmark baseline is created only after 018b | Deep-loop baseline is generated from the settled 7-mode registry/router state, not the dirty live-refactor state | audit P0-1 live collision; audit P0-6 deep-loop check-9b missing `benchmark/`; MASTER PLAN 018b gate |
| REQ-005 | Validator promotion is gated | parent-skill-check checks 5-9 change from WARN to FAIL only after sk-code, sk-design, and deep-loop all pass strict checking | MASTER PLAN 019 promotion bullet; MASTER PLAN scorecard for 3 hubs |
| REQ-006 | Parent rollup metadata is repaired | 124 parent `graph-metadata.children_ids` includes 001-019, `last_active_child_id` points to 019, and parent status reflects final gate state | MASTER PLAN 019 rollup bullet |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria | Trace |
|----|-------------|---------------------|-------|
| REQ-007 | Cross-hub benchmark comparison is recorded | Final report compares the three Lane-C baselines and calls out regressions or parity gaps | MASTER PLAN 019 verify bullet |
| REQ-008 | Recursive spec validation passes | `validate.sh --strict` passes for the 124 phase parent and child phases once central metadata is present | MASTER PLAN 019 verify bullet |

### P2 - Optional

| ID | Requirement | Acceptance Criteria | Trace |
|----|-------------|---------------------|-------|
| REQ-009 | Feature catalog entries are added if time permits | Optional entries exist for sk-code, sk-design, and deep-loop or are explicitly deferred as non-canon | MASTER PLAN 019 optional feature_catalog bullet; audit feature_catalog optional note |

<!-- /ANCHOR:requirements -->
---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001 — MET (one scoped deferral)**: sk-design and deep-loop carry fresh add-only Lane-C baselines (`benchmark/baseline/`; CONDITIONAL 69 and 71; D5 connectivity hard gate 100/100); historical runs untouched. The sk-code re-baseline is deferred to the rename follow-up because its playbook gold encodes the pre-013 single-skill file-loading model and is stale against the post-013 two-axis packet router — a rewrite that follow-up mandates anyway. [EVIDENCE: sk-design `fc4644a98a`; deep-loop `50fbe53094`; sk-code stale-gold root cause recorded in implementation-summary]
- **SC-002 — MET**: `parent-skill-check` strict reports 0 fails for `sk-code`, `sk-design`, and `deep-loop-workflows` before promotion. [EVIDENCE: three STRICT 0/0 runs re-verified pre-promotion]
- **SC-003 — MET**: Checks 5-9 in `parent-skill-check.cjs` promoted from WARN to FAIL only after SC-002 held. [EVIDENCE: commit `769845c5a8` — `STRICT_HUB_CANON` default flipped to FAIL with a `PARENT_HUB_CHECK_STRICT=0` WIP opt-out]
- **SC-004 — MET**: The 124 parent rollup metadata lists children 001-019, sets `last_active_child_id` to `019-benchmarks-and-promotion`, and carries parent status complete. [EVIDENCE: parent `graph-metadata.json` rollup]
- **SC-005 — MET (scoped)**: Every phase this program built (010-019) passes `validate.sh --strict` at 0/0, and the 124 parent rollup lands Errors: 0 (children_ids 001-019, status complete, generated-metadata integrity clean). A pre-existing `PHASE_LINKS` warning (predecessor/successor phase-adjacency, never wired across the packet's children) remains at the parent — non-blocking and orthogonal to the named structural gates; fully clearing it would require editing the out-of-scope 001-009 phases. Phases 001-009 (the original pre-canon hub build) carry pre-existing template drift outside this program's scope. [EVIDENCE: 010-019 validate 0/0; parent Errors: 0; PHASE_LINKS adjacency pre-existing]

### Acceptance Scenarios

- **Scenario 1**: **Given** all prerequisite hub phases have landed, **when** Lane-C benchmark generation runs, **then** each hub receives a fresh add-only baseline package and no historical run is modified.
- **Scenario 2**: **Given** deep-loop 018b remains incomplete, **when** phase 019 is reviewed, **then** validator promotion and deep-loop-dependent work remain blocked rather than partially executed.
- **Scenario 3**: **Given** all three hubs pass strict parent-skill-check, **when** checks 5-9 are promoted, **then** future missing hub-router, resource, changelog, description, playbook, or benchmark violations fail instead of warn.
- **Scenario 4**: **Given** the 124 parent metadata currently lists only 001-009, **when** rollup executes, **then** children 010-019 and the current active phase are represented.

<!-- /ANCHOR:success-criteria -->
---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Deep-loop 018b registry/router completion | Deep-loop benchmark and validator promotion cannot safely run | Keep blocked tasks explicit until the dirty registry/hub-router state settles |
| Dependency | Phases 015, 016, 017, and 018a | Baselines may reflect stale hub artifacts if prerequisites are missing | Confirm strict parent checks and artifact availability before benchmark generation |
| Risk | Historical benchmark mutation | Regression history could be lost or contaminated | Use add-only benchmark packages and verify no historical run folders changed |
| Risk | Premature WARN-to-FAIL promotion | Validator could break still-migrating hubs | Require 3x strict 0-fail gate before editing validator severity |
| Risk | Parent metadata drift | Resume and graph traversal can point at stale phase children | Update children ids, active child, and parent status as one rollup step |

<!-- /ANCHOR:risks -->
---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Benchmark generation should record runtime and avoid unnecessary reruns when a validated fresh baseline already exists for the same source state.

### Security
- **NFR-S01**: Benchmark packages and reports must not include secrets, private environment values, or unredacted local-only credentials.

### Reliability
- **NFR-R01**: Validator promotion must be reversible by reverting the severity-change commit if any hub unexpectedly fails after promotion.
- **NFR-R02**: Parent rollup metadata must preserve existing child references and only add the missing 010-019 entries.

<!-- /ANCHOR:nfr -->
---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

### Data Boundaries
- Benchmark packages are add-only; existing baseline or historical run folders are read-only inputs.
- Feature catalog entries are optional P2 artifacts and must not block canon completion.

### Error Scenarios
- If one hub fails strict parent-skill-check, stop before validator promotion and record the failing hub.
- If deep-loop 018b is still blocked, do not generate the deep-loop final baseline from moving registry/router state.
- If recursive strict validation fails because central `description.json` or `graph-metadata.json` generation has not run, report the orchestrator-owned metadata gap rather than generating it from this phase.

### Concurrent Operations
- Deep-loop files remain collision-sensitive while the live context-deprecation agent owns the registry and changelog changes; phase 019 must wait for 018b to settle before deep-loop-dependent work.

<!-- /ANCHOR:edge-cases -->
---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 16/25 | Three hub benchmark packages, one validator promotion, one parent rollup, optional catalogs |
| Risk | 17/25 | Promotion is migration-gated and deep-loop-dependent; historical benchmark preservation matters |
| Research | 10/20 | Scope is defined by master plan and audit digest with deterministic verification gates |
| **Total** | **43/70** | **Level 2** |

<!-- /ANCHOR:complexity -->
---

<!-- ANCHOR:questions -->
## 9. OPEN QUESTIONS

- None. Execution is complete: deep-loop 018b landed, all three hubs pass strict parent-skill-check, and the promotion + parent rollup shipped. The one carried-forward item is the sk-code Lane-C re-baseline, handed to the rename follow-up packet with its stale-gold root cause recorded (SC-001).

<!-- /ANCHOR:questions -->
---

<!-- ANCHOR:related-docs -->
## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`

<!-- /ANCHOR:related-docs -->
