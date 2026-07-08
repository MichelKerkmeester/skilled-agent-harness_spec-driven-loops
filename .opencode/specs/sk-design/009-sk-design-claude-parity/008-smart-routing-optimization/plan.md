---
title: "Implementation Plan: Phase 008 — Smart Routing Optimization (Hub + Mode Packets)"
description: "Level 2 plan for sharpening sk-design's SMART ROUTING keyword/alias coverage across the hub and five mode packets, informed by Lane-C benchmark evidence, while keeping registry/router structure frozen."
trigger_phrases:
  - "implementation plan"
  - "smart routing optimization"
  - "sk-design routing vocabulary"
  - "hub-router keyword sync"
importance_tier: "high"
contextType: "plan"
_memory:
  continuity:
    packet_pointer: "sk-design/009-sk-design-claude-parity/008-smart-routing-optimization"
    last_updated_at: "2026-07-06"
    last_updated_by: "markdown-leaf-agent"
    recent_action: "Created planned Level 2 smart routing optimization docs."
    next_safe_action: "Wait for Phase 007 gates to pass before any sk-design routing-vocabulary implementation."
---
# Implementation Plan: Phase 008 — Smart Routing Optimization (Hub + Mode Packets)

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Surface** | OpenCode `sk-design` hub and five mode packets' SMART ROUTING content |
| **Primary Area** | `.opencode/skills/sk-design/SKILL.md`, `.opencode/skills/sk-design/hub-router.json`, `.opencode/skills/sk-design/mode-registry.json`, and the five `design-*/SKILL.md` Section 2 blocks after Phase 007 gates close |
| **Spec Level** | 2 |
| **Testing** | Strict spec validation, Lane-C skill-benchmark rerun compared against `benchmark/after-009/report.json`, scoped registry/router diff, negative controls |
| **Mutation Policy** | Implemented after Phase 007 gate closure; vocabulary/prose only |

### Overview
This plan defines how Phase 008 will sharpen the SMART ROUTING keyword/alias prose in the `sk-design` hub and its five mode packets, grounded in the `benchmark/baseline/` and `benchmark/after-009/` report evidence and the `mode-registry.json` transform-verb routing table. The pass resolves ambiguity that the benchmark's D1/D3 dimensions expose, makes each mode's Phase 004 procedure-card selection logic an explicit part of its routing prose, and keeps `hub-router.json` `vocabularyClasses`/`routerSignals` synchronized with any change — without touching registry structure, `workflowMode` values, or `toolSurface` entries.

<!-- /ANCHOR:summary -->
---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Phase 008 documentation scope is explicit and confined to this folder for this authoring task.
- [x] Routing optimization goal is documented in `spec.md`.
- [x] Phase 007 gates have passed strict validation and template-alignment closure. Evidence: Phase 007 checklist states Gate Status CLOSED; current Phase 007 strict validation returned Errors: 0, Warnings: 1 (`CONTINUITY_FRESHNESS` only), treated as non-blocking under the user-provided warning policy.
- [x] Existing hub/mode SMART ROUTING sections, `mode-registry.json`, and `hub-router.json` have been re-read after Phase 007 closure. Evidence: direct reads before edit of `sk-design/SKILL.md`, all five `design-*/SKILL.md` files, `mode-registry.json`, and `hub-router.json`.
- [x] Baseline and after-009 benchmark reports have been re-read (or re-run if stale) and their D1/D3 findings cited. Evidence: baseline and after-009 both show aggregate 69, D1inter unscored, D3 0, D2 100, D5 100; final Phase 008 rerun written to `benchmark-after-008/`.

### Definition of Done
- [x] Sharpened keyword/alias prose is implemented in the hub `SKILL.md` Section 2 SMART ROUTING.
- [x] Sharpened keyword/alias prose is implemented in all five mode packets' `SKILL.md` Section 2 SMART ROUTING.
- [x] Each mode's routing prose explicitly cross-references its existing private procedure-card CONDITIONAL selection table by relative path.
- [x] `hub-router.json` `vocabularyClasses`/`routerSignals` reflect implemented keyword/alias changes.
- [x] `mode-registry.json` registry keys (`workflowMode`, `backendKind`, `packet`, `proceduresPath`, `packetSkillName`, `advisorRouting`, `toolSurface`) remain byte-identical; only vocabulary content (`aliases`) changed.
- [x] Negative controls prove no new modes, no registry-key renames, and no `toolSurface` changes were introduced. Evidence: structural-key diff check produced no output.

<!-- /ANCHOR:quality-gates -->
---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Content-quality routing optimization pass: sharpen SMART ROUTING prose in the hub and five mode packets while keeping the registry/router structural contract, `workflowMode` values, and `toolSurface` entries frozen. This is a vocabulary and cross-reference change, not an architecture change.

### Key Components
- **Keyword/Alias Audit**: Read current hub/mode SMART ROUTING prose plus `mode-registry.json` `aliases`/`transformVerbRouting` and `hub-router.json` `vocabularyClasses`/`routerSignals` before drafting any change.
- **Ambiguity Resolution Map**: A per-mode table of benchmark-cited contamination findings mapped to a proposed keyword/alias/prose fix or an explicit "prose-only disambiguation, no alias change" decision.
- **Procedure-Card Cross-Reference**: Explicit citation of each mode's existing procedure-card CONDITIONAL selection table inside its routing prose.
- **Registry/Router Sync Check**: A scoped diff plan proving only vocabulary fields changed in `mode-registry.json` and `hub-router.json`.
- **Negative Controls**: Explicit checks that prevent registry-key rename, `toolSurface` drift, and new public mode creation.

### Data Flow
1. Confirm Phase 007 gates are closed and implementation is allowed.
2. Re-read the current hub `SKILL.md`, all five mode `SKILL.md` Section 2 blocks, `mode-registry.json`, and `hub-router.json` without mutating unrelated files.
3. Re-read (or re-run if stale) `benchmark/baseline/` and `benchmark/after-009/` reports and extract D1/D3 findings and named contamination scenarios.
4. Draft the per-mode ambiguity resolution map, citing specific findings for each proposed keyword/alias/prose change.
5. Draft the sharpened SMART ROUTING prose for the hub and each of the five modes, including the explicit procedure-card cross-reference.
6. Draft the corresponding `hub-router.json` `vocabularyClasses`/`routerSignals` sync and `mode-registry.json` vocabulary-only edits.
7. Run registry/router preservation and negative-control checks before claiming the routing optimization is ready for review.

<!-- /ANCHOR:architecture -->
---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Entry Gate and Current Routing Review
- [x] Verify Phase 007 P0 gates are closed with evidence.
- [x] Read the current hub `SKILL.md`, all five mode `SKILL.md` Section 2 blocks, `mode-registry.json`, and `hub-router.json`.
- [x] Re-read or re-run `benchmark/baseline/` and `benchmark/after-009/` reports and extract D1/D3 findings and named contamination scenarios.
- [x] Record any logic-sync conflict between this plan and current hub/mode/registry/router shape. Evidence: no conflict found; Phase 007 continuity freshness warning was non-blocking per user policy.

### Phase 2: Keyword/Alias Sharpening Contract
- [x] Draft the per-mode ambiguity resolution map (benchmark finding → proposed fix or explicit no-change decision).
- [x] Draft sharpened keyword/alias prose for the hub Section 2 SMART ROUTING.
- [x] Draft sharpened keyword/alias prose for each of the five mode packets' Section 2 SMART ROUTING.
- [x] Draft the explicit procedure-card cross-reference for each mode's routing prose.

### Phase 3: Registry/Router Sync Preservation
- [x] Draft the `hub-router.json` `vocabularyClasses`/`routerSignals` updates needed to match keyword/alias changes.
- [x] Draft the `mode-registry.json` `aliases` vocabulary-only updates, explicitly excluding registry structural keys.
- [x] Confirm existing `transformVerbRouting.excludedAliases` entries are preserved unless explicitly revised with rationale.

### Phase 4: Verification and Handoff
- [x] Run strict spec validation for this phase docs after authored changes. Evidence recorded in `implementation-summary.md` after final metadata regeneration.
- [x] Run the canonical Lane-C skill-benchmark command after implementation and compare against `benchmark/after-009/report.json`. Evidence: `benchmark-after-008/report.md` remains aggregate 69 with D2 100, D5 100, D3 0, D1inter/D4 unscored.
- [x] Update checklist with evidence or approved deferrals.
- [x] Hand off README-alignment detail to Phase 009.

<!-- /ANCHOR:phases -->
---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Spec validation | Phase docs structure and required metadata | `validate.sh --strict` |
| Entry gate review | Phase 007 closure and go/no-go state | Phase 007 checklist and implementation-summary evidence |
| Benchmark rerun | Routing vocabulary sharpening does not regress D2/D5 and honestly reports D1/D3 status | Lane-C `run-skill-benchmark.cjs` command from `benchmark/README.md`, compared against `benchmark/after-009/report.json` |
| Registry/router sync | Vocabulary fields updated together; structural keys unchanged | Scoped `git diff` on `mode-registry.json` and `hub-router.json` |
| Negative controls | No registry-key rename, no `toolSurface` drift, no new public mode | File inventory and content review |
| Procedure-card cross-reference review | Each mode's routing prose cites its own procedure-card table | Content review across the five `design-*/SKILL.md` files |

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 007 closure | Governance | Closed with Errors: 0 and one accepted continuity warning | Gate allowed implementation |
| Current hub/mode SMART ROUTING shape | Evidence | Re-inspected before edit | Sharpening targets live prose |
| `benchmark/baseline/` and `benchmark/after-009/` reports | Evidence | Read before implementation; Phase 008 rerun captured in `benchmark-after-008/` | Keyword changes stay grounded |
| `mode-registry.json` / `hub-router.json` | Architecture | Must stay structurally frozen; vocabulary only may change | Public routing could drift or duplicate |
| Phase 004 procedure-card layer | Prior work | Already implemented; this phase cross-references it, does not modify its schema | Routing prose could describe procedure selection inaccurately if not cross-checked |
| Phase 009 README alignment | Follow-on | Not started | This phase must hand off cleanly without pre-empting Phase 009 scope |
| Strict spec validation | Documentation | Required after write | Structural errors must be fixed or reported |

<!-- /ANCHOR:dependencies -->
---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Phase 007 has not passed, a proposed change touches a registry structural key or `toolSurface` entry, `hub-router.json`/`mode-registry.json` vocabulary drifts out of sync, or a keyword change contradicts an existing `transformVerbRouting.excludedAliases` entry without documented rationale.
- **Procedure**: Stop implementation; keep worktree state unchanged; revert or remove only Phase 008 routing-vocabulary changes after explicit approval; preserve unrelated user and sibling-phase work.

<!-- /ANCHOR:rollback -->
---

<!-- ANCHOR:l2-phase-deps -->
## L2: PHASE DEPENDENCIES

```text
Phase 007 Gate ──> Routing Review ──> Keyword/Alias Contract ──> Registry/Router Sync ──> Verification Handoff
       │                                                                                        │
       └───────────────── blocks all sk-design routing-vocabulary implementation ───────────────┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Phase 007 Gate | Phase 007 checklist and summary evidence | All Phase 008 implementation |
| Routing Review | Phase 007 Gate | Keyword/Alias Contract |
| Keyword/Alias Contract | Routing Review, benchmark evidence | Registry/Router Sync |
| Registry/Router Sync | Keyword/Alias Contract, current registry/router shape | Verification Handoff |
| Verification Handoff | Registry/Router Sync | Phase 009 README-alignment detail |

<!-- /ANCHOR:l2-phase-deps -->
---

<!-- ANCHOR:l2-effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Entry Gate and Routing Review | Low | 20-40 minutes |
| Keyword/Alias Sharpening Contract | Medium | 60-120 minutes |
| Registry/Router Sync Preservation | Medium | 30-60 minutes |
| Verification and Handoff | Medium | 30-75 minutes |
| **Total** | | **2.5-5 hours after Phase 007 closure** |

<!-- /ANCHOR:l2-effort -->
---

<!-- ANCHOR:l2-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-implementation Checklist
- [ ] Phase 007 P0 gates are closed.
- [ ] Current hub, mode, registry, and router files are re-read before edit.
- [ ] Benchmark evidence supporting each proposed keyword change is recorded.
- [ ] Non-destructive rollback path is named.
- [ ] Negative controls are ready before implementation.

### Rollback Procedure
1. **Immediate**: Stop routing-vocabulary implementation and preserve current worktree state.
2. **Document**: Record which invariant failed: Phase 007 gate, registry structural key, `toolSurface` boundary, or vocabulary sync.
3. **Preserve**: Avoid stash/reset/revert until unrelated work ownership is clear.
4. **Recover**: Remove or revise only the routing-vocabulary change after approval.
5. **Re-verify**: Re-run registry/router sync checks and negative controls before resuming.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: Documentation-only changes can be removed by deleting this phase folder; later hub/mode/registry/router edits must be reverted only after preserving unrelated user work.

<!-- /ANCHOR:l2-rollback -->
