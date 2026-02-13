# Barter Deal Templates — Deal System Refinement Plan

<!-- SPECKIT_LEVEL: 3+ -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify + level3-arch + level3plus-govern | v2.0 -->

| Field | Value |
|-------|-------|
| **Version** | 1.0.0 |
| **Status** | Draft |
| **Owner** | Michel Kerkmeester |
| **Created** | 2026-02-07 |
| **Last Updated** | 2026-02-07 |
| **Revision Note** | v1.0.0 — Initial implementation plan for Deal System Refinement. 5 phases, 3 workstreams, ~14 hours total effort. |

---

## Table of Contents

1. [Summary](#1-summary)
2. [Quality Gates](#2-quality-gates)
3. [Implementation Phases](#3-implementation-phases)
4. [Phase 1 — Critical Fixes](#4-phase-1--critical-fixes)
5. [Phase 2 — HVR Harmonization](#5-phase-2--hvr-harmonization)
6. [Phase 3 — Scoring and Validation Enhancement](#6-phase-3--scoring-and-validation-enhancement)
7. [Phase 4 — Content Expansion](#7-phase-4--content-expansion)
8. [Phase 5 — Integration Testing](#8-phase-5--integration-testing)
9. [Dependencies](#9-dependencies)
10. [Rollback Plan](#10-rollback-plan)
11. [Phase Dependencies](#11-phase-dependencies)
12. [Effort Estimation](#12-effort-estimation)
13. [Dependency Graph](#13-dependency-graph)
14. [Milestones](#14-milestones)
15. [AI Execution Framework](#15-ai-execution-framework)
16. [Workstream Coordination](#16-workstream-coordination)
17. [Communication Plan](#17-communication-plan)

---

## 1. Summary

### Technical Context

| Dimension | Value |
|-----------|-------|
| **Language/Stack** | Markdown (knowledge base documents, no code) |
| **Framework** | None (AI agent configuration via structured Markdown files) |
| **Storage** | File system (Markdown files in `2. Barter deals/knowledge base/`) |
| **Testing** | Manual validation (HVR word scan, DEAL scoring, cross-reference verification, voice audit) |
| **Build System** | None (no compilation or bundling) |
| **CI/CD** | None (manual deployment via file updates) |

### Overview

This plan addresses the 22 requirements identified in the spec across 5 implementation phases. The system under modification is a Markdown-based AI agent knowledge base consisting of 12 files totalling 4,084 lines. There is no code, framework, or build system. All changes are content modifications to Markdown files. Testing is manual: cross-reference verification via grep, HVR compliance via word scanning, DEAL scoring via template evaluation, and voice consistency via side-by-side comparison with sibling AI systems.

### Total Effort

**~14 hours** across 5 phases, executable by 3 parallel workstreams with synchronization points.

---

## 2. Quality Gates

### Definition of Ready (per phase)

- All dependency phases marked complete
- Required reference files (LinkedIn Pieter v0.130, LinkedIn Nigel v0.100) available and read
- Spec requirements for the phase reviewed and understood
- Target files identified and current line counts recorded

### Definition of Done (per phase)

- All requirements assigned to the phase are implemented
- Cross-references verified (zero broken references)
- HVR compliance validated on affected templates
- Context window budget checked (always-loaded total under 2,000 lines)
- Phase milestone criteria met

---

## 3. Implementation Phases

| Phase | Name | Duration | Requirements | Files | Status |
|-------|------|----------|-------------|-------|--------|
| 1 | Critical Fixes | ~2 hours | REQ-001, REQ-002, REQ-003, REQ-004 | 6 files | Pending |
| 2 | HVR Harmonization | ~3 hours | REQ-005, REQ-006, REQ-007, REQ-008 | 4 files | Pending |
| 3 | Scoring and Validation Enhancement | ~3 hours | REQ-009, REQ-010, REQ-011, REQ-012, REQ-013 | 3 files | Pending |
| 4 | Content Expansion | ~4 hours | REQ-014, REQ-015, REQ-016, REQ-017, REQ-018, REQ-019, REQ-020, REQ-021, REQ-022 | 8 files | Pending |
| 5 | Integration Testing | ~2 hours | SC-001 through SC-006 | All 12 files | Pending |

---

## 4. Phase 1 — Critical Fixes

**Goal:** Resolve all P0 blockers so the system is operationally functional.
**Duration:** ~2 hours
**Requirements:** REQ-001, REQ-002, REQ-003, REQ-004

### Tasks

| Task | Description | Output | Est. Time |
|------|-------------|--------|-----------|
| T-101 | Fix file references in AGENTS.md | Replace all `DT - ` prefix references with `Barter deals - ` prefix. Verify all 10 knowledge base file references resolve. | 20 min |
| T-102 | Fix file references in README.md | Update file inventory table. Replace `DT - ` prefix with `Barter deals - `. Mark all 10 files as Active. Update line counts. | 20 min |
| T-103 | Fix routing references in System Prompt | Update Smart Routing Logic section file references. Verify every file path in the routing table resolves. | 15 min |
| T-104 | Validate export directory persistence | Confirm `/export/` directory exists. Test export naming convention `[###] - deal-[type]-[brand].md`. Document sequential numbering approach. | 15 min |
| T-105 | Restore EUR values in Brand Context | Locate lines 191-199. Cross-reference with Copywriter Brand Context and Market Data for correct EUR amounts. Replace `...` with specific values. | 20 min |
| T-106 | Unify DEAL dimension definitions | Canonical definition in System Prompt: D=Description (6pts), E=Expectations (7pts), A=Appeal (6pts), L=Legitimacy (6pts). Update Standards.md to match exactly. Remove alternative names. | 30 min |

### Verification

| Check | Method | Expected Result |
|-------|--------|-----------------|
| Cross-reference integrity | Grep all 12 files for file path references, verify each resolves | Zero unresolved references |
| DEAL dimension consistency | Compare dimension definitions in System Prompt and Standards.md | Identical text in both files |
| EUR values present | Read Brand Context lines 191-199 | Specific EUR amounts, no `...` |
| Export directory functional | Verify `/export/` exists and is writable | Directory exists, test file can be created |

---

## 5. Phase 2 — HVR Harmonization

**Goal:** Align Deals HVR with LinkedIn Pieter v0.130 and LinkedIn Nigel v0.100 to create ecosystem-wide consistency.
**Duration:** ~3 hours
**Requirements:** REQ-005, REQ-006, REQ-007, REQ-008
**Dependency:** Phase 1 complete (cross-references must be fixed first)

### Tasks

| Task | Description | Output | Est. Time |
|------|-------------|--------|-----------|
| T-201 | Audit HVR divergence | Side-by-side comparison of Deals HVR v0.100 vs LinkedIn Pieter v0.130 HVR. Document all gaps: missing hard blockers, missing phrase blockers, spelling differences. | 30 min |
| T-202 | Add missing hard blocker words | Add ~15 hard blocker words from LinkedIn systems. Verify no false positives against existing passing deal templates. | 30 min |
| T-203 | Add missing phrase blockers | Add ~18 phrase blockers from LinkedIn systems. Adapt phrasing for deal context where needed (e.g., marketing phrases that differ in deal vs post context). | 30 min |
| T-204 | Convert to UK English | Replace all US spellings in HVR file (optimize -> optimise, color -> colour, analyze -> analyse, etc.). Add UK English declaration in HVR header metadata. | 20 min |
| T-205 | Resolve variation scaling contradiction | Determine canonical scaling approach. Update System Prompt to use single definition. Remove contradicting definition from Standards.md. Add cross-reference. | 20 min |
| T-206 | Update Brand Context HVR alignment | Sync Brand Context HVR quick-reference section with updated HVR blockers. Ensure no blacklist divergence between Brand Context summary and full HVR file. | 20 min |
| T-207 | Validate existing templates against new HVR | Re-run HVR validation on all existing deal template examples (from 001-initial-creation examples.md). Fix any newly-failing templates. Document changes. | 30 min |

### Verification

| Check | Method | Expected Result |
|-------|--------|-----------------|
| Hard blocker parity | Diff Deals HVR blockers vs LinkedIn Pieter v0.130 | Zero gaps |
| Phrase blocker parity | Diff Deals HVR phrases vs LinkedIn systems | Zero gaps |
| UK English compliance | Spelling scan of HVR file | Zero US spellings |
| Existing templates still pass | HVR scan of all examples | All passing examples still pass (or are updated) |

---

## 6. Phase 3 — Scoring and Validation Enhancement

**Goal:** Add sophisticated scoring infrastructure matching LinkedIn system sophistication.
**Duration:** ~3 hours
**Requirements:** REQ-009, REQ-010, REQ-011, REQ-012, REQ-013
**Dependency:** Phase 1 complete (DEAL dimensions must be unified first)

### Tasks

| Task | Description | Output | Est. Time |
|------|-------------|--------|-----------|
| T-301 | Design per-dimension minimum floors | Define floor for each DEAL dimension. Proposed: D >= 3/6, E >= 4/7, A >= 3/6, L >= 3/6. Document rationale per floor. Add to System Prompt scoring section. | 30 min |
| T-302 | Define deal complexity tiers | Three tiers: Simple (single product, one brand, EUR < 100), Standard (single product/service, one brand, EUR 100-300), Complex (multi-product, multi-brand, high value EUR 300+, service bundles). Add classification rules to Standards.md. | 30 min |
| T-303 | Implement tiered validation thresholds | Simple: 19/25, Standard: 21/25, Complex: 23/25. Add threshold table to System Prompt. Add override mechanism for edge cases. Update Standards.md scoring display format. | 20 min |
| T-304 | Create tone alignment checkpoint | 5 concrete evaluation criteria: (1) uses conversational sentence structures, (2) avoids corporate jargon, (3) includes specific details over generalities, (4) reads like a peer-to-peer communication, (5) could plausibly appear on a real marketplace. Add to System Prompt after DEAL scoring. | 20 min |
| T-305 | Build self-correction diagnostic matrix | 10+ failure mode patterns with columns: Failure Mode, Symptom, Root Cause, Corrective Action, Example. Patterns include: inflated value claims, vague requirements, generic descriptions, HVR violations in high-scoring templates, dimension imbalance, missing creator benefit, template fatigue, over-formal tone, missing logistics, cultural mismatch. Add to Standards.md. | 40 min |
| T-306 | Write revision guidance by score band | Four bands: 14-18 (Major revision, restart DEPTH), 19-21 (Targeted fixes, specific dimension improvement), 22-24 (Polish, minor refinements), 25 (Ship as-is). Each band with 2-3 concrete revision strategies. Add to System Prompt. | 20 min |

### Verification

| Check | Method | Expected Result |
|-------|--------|-----------------|
| Floor enforcement | Score 3 templates where one dimension is below floor but total exceeds threshold | All 3 correctly flagged as conditional |
| Tier classification | Classify 5 sample deals into tiers | Classification matches expected tier for each |
| Tone checkpoint | Run 5 templates through tone criteria | Binary pass/fail with specific criterion cited |
| Diagnostic matrix coverage | Map 10 historical low-scoring templates to matrix entries | At least 80% map to a documented failure mode |

---

## 7. Phase 4 — Content Expansion

**Goal:** Expand knowledge base coverage for industries, examples, edge cases, and market data.
**Duration:** ~4 hours
**Requirements:** REQ-014 through REQ-022
**Dependency:** Phase 2 complete (new content must comply with harmonized HVR)

### Tasks

| Task | Description | Output | Est. Time |
|------|-------------|--------|-----------|
| T-401 | Add 5 new industry verticals | Automotive, travel, education, sports, entertainment. Each with key vocabulary (15+ terms), 3+ brand examples, content type guidance, cross-industry reference. Match format of existing 5 verticals. | 45 min |
| T-402 | Add freshness dates to Market Data | Add `Last Verified: YYYY-MM-DD` to every pricing benchmark. Add Dutch-specific data (Marktplaats, Bol.com comparisons). Add platform comparison table. Flag data older than 6 months. | 30 min |
| T-403 | Create failing deal template examples (Product) | 2 failing product deal examples with score breakdowns, HVR violation lists, root cause analysis, and corrected versions. One low-scoring (below 14), one borderline (15-18). | 30 min |
| T-404 | Create failing deal template examples (Service) | 2 failing service deal examples with same structure as T-403. Include at least 1 with tone alignment failure and 1 with dimension imbalance. | 30 min |
| T-405 | Add hybrid/mixed deal type guidance | New section in System Prompt or Standards.md covering deals that combine product and service elements. Scoring adjustments. 1 annotated hybrid example. Template structure for hybrid deals. | 20 min |
| T-406 | Add missing template fields | Add optional fields to both Deal Type files: timeline/deadline, shipping/logistics, content approval process, exclusivity period, geographic scope, minimum follower count. Mark as required/optional per deal type. | 20 min |
| T-407 | Add Interactive Mode edge cases | Multi-brand collaboration question flow, non-EUR currency handling flow, digital-only product flow, seasonal/limited-time deal flow. Each with 3-5 targeted questions and smart defaults. | 25 min |
| T-408 | Add export sequential numbering | Define numbering persistence: scan `/export/` directory for highest existing number, increment by 1. Handle gaps. Document reset procedure. Add to Standards.md export section. | 15 min |
| T-409 | Update DEPTH Framework alignment | Compare Deals DEPTH (v0.112 base) with Pieter v0.120 improvements. Port applicable changes: updated quality gates, expanded cognitive rigor techniques, refined adaptive round thresholds. | 25 min |

### Verification

| Check | Method | Expected Result |
|-------|--------|-----------------|
| Industry module format consistency | Compare new verticals structure to existing 5 | Identical section structure and depth |
| Failing examples have corrected versions | Each failing example has a passing corrected version | 4/4 have corrections |
| HVR compliance of new content | Scan all new content for HVR violations | Zero hard blocker violations |
| Template field documentation | Review both Deal Type files for new fields | All 6 fields documented with required/optional status |
| Context window budget | Sum always-loaded file line counts | Total under 2,000 lines |

---

## 8. Phase 5 — Integration Testing

**Goal:** Validate the complete system works end-to-end and passes all success criteria.
**Duration:** ~2 hours
**Requirements:** SC-001 through SC-006
**Dependency:** All phases 1-4 complete

### Tasks

| Task | Description | Output | Est. Time |
|------|-------------|--------|-----------|
| T-501 | Cross-reference audit | Grep all 12 files for every file path reference. Verify each resolves to an existing file. Check both directions (referencing and referenced). | 20 min |
| T-502 | End-to-end deal generation test | Generate 3 test deals: 1 product (simple tier), 1 service (standard tier), 1 hybrid (complex tier). Full DEPTH workflow, DEAL scoring, HVR validation, export to `/export/`. | 30 min |
| T-503 | Cross-system voice audit | Take 5 deal templates and validate against LinkedIn Pieter v0.130 HVR rules and LinkedIn Nigel v0.100 HVR rules. Document any voice inconsistencies. | 20 min |
| T-504 | Scoring calibration test | Score 10 templates independently using System Prompt definitions and Standards.md definitions. Verify scores match within 1 point. Test floor enforcement on 3 edge cases. Test tier classification on 5 deals. | 25 min |
| T-505 | Diagnostic matrix validation | Take 5 low-scoring templates. Consult diagnostic matrix for each. Verify matrix correctly identifies failure mode and corrective action is actionable. | 15 min |
| T-506 | Final documentation sweep | Update all line counts in README.md. Verify all version numbers consistent. Update 001-initial-creation cross-references if needed. Final context window budget verification. | 10 min |

### Verification

| Check | Method | Expected Result |
|-------|--------|-----------------|
| SC-001: Zero broken references | T-501 output | All references resolve |
| SC-002: HVR parity | T-503 output | No gaps vs LinkedIn systems |
| SC-003: Consistent DEAL scoring | T-504 output | Scores match within 1 point |
| SC-004: Export works end-to-end | T-502 output | 3 deals in `/export/` |
| SC-005: Cross-system voice consistency | T-503 output | 5/5 templates pass cross-system validation |
| SC-006: Diagnostic matrix coverage | T-505 output | 10+ failure modes, 80%+ coverage |

---

## 9. Dependencies

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| LinkedIn Pieter v0.130 HVR file | External reference | Available | Cannot complete Phase 2 (HVR harmonization) |
| LinkedIn Nigel v0.100 scoring framework | External reference | Available | Cannot complete Phase 3 (scoring enhancement) |
| Copywriter Brand Context v0.111 | External reference | Available | Cannot verify EUR values in Phase 1 |
| All Phase 1 tasks complete | Internal | Pending | Phases 2 and 3 cannot start |
| Phase 2 complete | Internal | Pending | Phase 4 cannot start (new content must comply with harmonized HVR) |
| All phases 1-4 complete | Internal | Pending | Phase 5 cannot start |

---

## 10. Rollback Plan

### Trigger

Rollback if any of these occur:
- HVR harmonization causes more than 50% of existing passing templates to fail with no clear fix
- DEAL scoring changes produce scores that diverge by more than 3 points from original scores on the same templates
- Context window budget exceeds 2,500 lines for always-loaded files (25% above target)

### Procedure

1. All original files are in the git history (no destructive changes)
2. Revert to pre-refinement versions of affected files using git
3. Document which changes caused the rollback and why
4. Create targeted fix plan for the specific issue before re-attempting

### Data Reversal

Not applicable. All changes are Markdown content modifications. No database, state, or user data is affected. Git history provides complete rollback capability.

---

## 11. Phase Dependencies

```
Phase 1: Critical Fixes (P0)
    │
    ├──────────────────┐
    │                  │
    v                  v
Phase 2:           Phase 3:
HVR Harmonization  Scoring Enhancement
    │                  │
    ├──────────────────┘
    │
    v
Phase 4: Content Expansion
    │
    v
Phase 5: Integration Testing
```

### Phase Dependency Table

| Phase | Depends On | Blocks | Rationale |
|-------|-----------|--------|-----------|
| Phase 1 | None | Phase 2, Phase 3 | Cross-references and DEAL dimensions must be fixed before any other work |
| Phase 2 | Phase 1 | Phase 4 | HVR must be harmonized before new content is created (new content must comply) |
| Phase 3 | Phase 1 | Phase 4 | Scoring changes must be finalized before content expansion adds examples |
| Phase 4 | Phase 2, Phase 3 | Phase 5 | New content must comply with harmonized HVR and updated scoring |
| Phase 5 | Phase 1-4 | None | Integration testing validates the complete system |

---

## 12. Effort Estimation

| Phase | Complexity | Estimated Effort | Files Touched |
|-------|-----------|-----------------|---------------|
| Phase 1: Critical Fixes | Medium (known issues, clear fixes) | ~2 hours | 6 (AGENTS.md, README.md, System Prompt, Brand Context, Standards.md, export/) |
| Phase 2: HVR Harmonization | High (cross-system analysis, cascading impact) | ~3 hours | 4 (HVR, Brand Context, System Prompt, Standards.md) |
| Phase 3: Scoring Enhancement | High (design decisions, calibration needed) | ~3 hours | 3 (System Prompt, Standards.md, DEPTH Framework) |
| Phase 4: Content Expansion | Medium (additive, lower risk) | ~4 hours | 8 (Industry Modules, Market Data, Deal Type Product, Deal Type Service, Interactive Mode, Standards.md, System Prompt, DEPTH Framework) |
| Phase 5: Integration Testing | Medium (validation, no new content) | ~2 hours | 12 (all files — read and verify) |
| **Total** | | **~14 hours** | **12 unique files** |

### Parallel Execution Savings

Phases 2 and 3 can run in parallel after Phase 1 completes (they touch mostly different files with 2 overlap files: System Prompt and Standards.md). With parallel execution, the critical path is:

```
Phase 1 (2h) → Phase 2+3 parallel (3h) → Phase 4 (4h) → Phase 5 (2h) = 11 hours elapsed
```

This saves ~3 hours compared to sequential execution, bringing elapsed time from 14 hours to 11 hours.

---

## 13. Dependency Graph

```
┌─────────────────────────────────────────────────────────────────────┐
│                    DEAL SYSTEM REFINEMENT                           │
│                    Total: ~14h / Elapsed: ~11h                      │
└─────────────────────────────────────────────────────────────────────┘

         ┌──────────────────────────────────────────┐
         │  PHASE 1: CRITICAL FIXES (~2h)           │
         │  T-101: Fix AGENTS.md refs               │
         │  T-102: Fix README.md refs               │
         │  T-103: Fix System Prompt routing         │
         │  T-104: Validate export directory         │
         │  T-105: Restore EUR values                │
         │  T-106: Unify DEAL dimensions             │
         └──────────────┬───────────────────────────┘
                        │
              ┌─────────┴──────────┐
              │                    │
              v                    v
┌─────────────────────┐ ┌─────────────────────────┐
│ PHASE 2: HVR (~3h)  │ │ PHASE 3: SCORING (~3h)  │
│ T-201: Audit gaps   │ │ T-301: Dimension floors  │
│ T-202: Hard blockers│ │ T-302: Complexity tiers  │
│ T-203: Phrase blocks │ │ T-303: Tiered thresholds │
│ T-204: UK English   │ │ T-304: Tone checkpoint   │
│ T-205: Var. scaling  │ │ T-305: Diagnostic matrix │
│ T-206: Brand align  │ │ T-306: Revision guidance  │
│ T-207: Template test│ │                           │
└────────┬────────────┘ └────────────┬──────────────┘
         │                           │
         └─────────┬─────────────────┘
                   │
                   v
         ┌──────────────────────────────────────────┐
         │  PHASE 4: CONTENT EXPANSION (~4h)        │
         │  T-401: 5 new industry verticals         │
         │  T-402: Market Data freshness dates       │
         │  T-403: Failing product examples          │
         │  T-404: Failing service examples          │
         │  T-405: Hybrid deal type guidance         │
         │  T-406: Missing template fields           │
         │  T-407: Interactive Mode edge cases        │
         │  T-408: Export sequential numbering        │
         │  T-409: DEPTH Framework alignment          │
         └──────────────────┬───────────────────────┘
                            │
                            v
         ┌──────────────────────────────────────────┐
         │  PHASE 5: INTEGRATION TESTING (~2h)      │
         │  T-501: Cross-reference audit             │
         │  T-502: End-to-end deal generation        │
         │  T-503: Cross-system voice audit          │
         │  T-504: Scoring calibration test          │
         │  T-505: Diagnostic matrix validation      │
         │  T-506: Final documentation sweep         │
         └──────────────────────────────────────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|-----------|----------|--------|
| T-101 to T-106 (Phase 1) | External references (LinkedIn, Copywriter) | Fixed cross-references, unified DEAL definitions | Phase 2, Phase 3 |
| T-201 to T-207 (Phase 2) | Phase 1 complete | Harmonized HVR, UK English, resolved scaling | Phase 4 |
| T-301 to T-306 (Phase 3) | Phase 1 complete (specifically T-106) | Scoring floors, tiers, diagnostics | Phase 4 |
| T-401 to T-409 (Phase 4) | Phase 2 and Phase 3 complete | Expanded content, new examples, updated frameworks | Phase 5 |
| T-501 to T-506 (Phase 5) | Phase 1-4 complete | Validated system, test results, final documentation | Release |

### Critical Path

1. **Phase 1: T-106** (Unify DEAL dimensions) — Longest single task, blocks all scoring work
2. **Phase 2: T-207** (Template re-validation) — Last task in Phase 2, gates Phase 4
3. **Phase 3: T-305** (Diagnostic matrix) — Longest task in Phase 3, gates Phase 4
4. **Phase 4: T-401** (Industry verticals) — Longest task in Phase 4
5. **Phase 5: T-502** (End-to-end test) — Longest task in Phase 5, validates everything

### Parallel Opportunities

| Window | Parallel Tasks | Shared Resources | Sync Required |
|--------|---------------|-----------------|---------------|
| After Phase 1 | Phase 2 (all) and Phase 3 (all) | System Prompt, Standards.md | SYNC-001: Before Phase 4, merge System Prompt and Standards.md changes |
| Within Phase 4 | T-401, T-402 (no file overlap) | None | None |
| Within Phase 4 | T-403, T-404 (different deal types) | None | None |
| Within Phase 5 | T-501, T-503, T-505 (read-only) | None | None |

---

## 14. Milestones

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|-----------------|--------|
| **M1** | Critical Fixes Complete | Zero broken cross-references. DEAL dimensions unified. EUR values restored. Export directory verified. | Phase 1 end |
| **M2** | HVR Harmonized | Deals HVR contains all hard and phrase blockers from LinkedIn systems. UK English enforced. Variation scaling contradiction resolved. All existing templates re-validated. | Phase 2 end |
| **M3** | Scoring Enhanced | Per-dimension floors implemented. Tiered thresholds defined. Tone checkpoint added. Diagnostic matrix with 10+ failure modes. Revision guidance for all score bands. | Phase 3 end |
| **M4** | Content Expanded | 10+ industry verticals. Market data with freshness dates. 4 failing examples (2 product, 2 service). Hybrid deal guidance. 6 new template fields. Interactive Mode edge cases. DEPTH aligned. | Phase 4 end |
| **M5** | Integration Tested | All 6 success criteria validated. 3 test deals generated end-to-end. Cross-system voice audit passed. Scoring calibration verified. Final documentation updated. | Phase 5 end |

---

## 15. AI Execution Framework

### Tier 1: Sequential Foundation (~30 min)

**Agent:** Primary agent
**Scope:** Phase 1 critical fixes (T-101 through T-106)
**Rationale:** Cross-references must be fixed before any parallel work can begin. These tasks touch shared files (AGENTS.md, README.md, System Prompt, Standards.md) that other phases also modify.

**Steps:**
1. Read all 12 files to establish current state
2. Execute T-101 through T-103 (cross-reference fixes) sequentially — each touches different files
3. Execute T-104 (export directory validation)
4. Execute T-105 (EUR values) — requires cross-referencing with Copywriter Brand Context
5. Execute T-106 (DEAL dimension unification) — modifies System Prompt and Standards.md
6. Verify M1 milestone criteria

### Tier 2: Parallel Execution (~3 hours)

**Agents:** 2 parallel agents
**Scope:** Phase 2 (W-A agent) and Phase 3 (W-B agent) executing simultaneously

**Agent W-A (HVR Harmonization):**
1. Read LinkedIn Pieter v0.130 HVR and LinkedIn Nigel v0.100 HVR
2. Execute T-201 (audit) to produce gap analysis
3. Execute T-202, T-203, T-204 (add blockers, fix spelling) — all modify HVR file
4. Execute T-205 (variation scaling) — modifies System Prompt and Standards.md
5. Execute T-206 (Brand Context alignment) — modifies Brand Context
6. Execute T-207 (re-validate templates)
7. Report: HVR change summary, files modified, templates re-validated

**Agent W-B (Scoring Enhancement):**
1. Read LinkedIn Nigel v0.100 scoring framework for reference patterns
2. Execute T-301, T-302 (design floors and tiers) — modifies System Prompt and Standards.md
3. Execute T-303 (thresholds) — modifies System Prompt and Standards.md
4. Execute T-304 (tone checkpoint) — modifies System Prompt
5. Execute T-305 (diagnostic matrix) — modifies Standards.md
6. Execute T-306 (revision guidance) — modifies System Prompt
7. Report: Scoring changes summary, threshold values, matrix entries

**SYNC-001:** After both agents complete, merge System Prompt and Standards.md changes. Both agents modify these files. Primary agent resolves any conflicts.

### Tier 3: Integration (~6 hours)

**Agent:** Primary agent (sequential after SYNC-001)
**Scope:** Phase 4 (content expansion) and Phase 5 (integration testing)

**Phase 4 Execution (can parallelise sub-tasks):**
1. Execute T-401, T-402 in parallel (different files: Industry Modules, Market Data)
2. Execute T-403, T-404 in parallel (different files: Deal Type Product, Deal Type Service)
3. Execute T-405 through T-409 sequentially (some shared files)

**Phase 5 Execution:**
1. Execute T-501, T-503, T-505 in parallel (all read-only validation)
2. Execute T-502 (end-to-end test, sequential — generates output)
3. Execute T-504 (scoring calibration, sequential — depends on T-502 output)
4. Execute T-506 (final sweep, sequential — last task)

---

## 16. Workstream Coordination

### Workstream Definitions

| ID | Name | Owner | Files | Phases | Status |
|----|------|-------|-------|--------|--------|
| **W-A** | System Infrastructure | Agent A | AGENTS.md, README.md, System Prompt, HVR v0.100, Brand Context, Standards.md | Phase 1, Phase 2 | Pending |
| **W-B** | Content Enhancement | Agent B | System Prompt, Standards.md, DEPTH Framework, Deal Type Product, Deal Type Service, Industry Modules, Market Data, Interactive Mode | Phase 3, Phase 4 | Pending |
| **W-C** | Quality and Integration | Primary Agent | All 12 files (read/verify) | Phase 5 | Pending |

### Sync Points

| Sync ID | Trigger | Participants | Output |
|---------|---------|-------------|--------|
| SYNC-001 | Phase 2 and Phase 3 both complete | W-A, W-B, Primary | Merged System Prompt and Standards.md with changes from both workstreams |
| SYNC-002 | Phase 4 complete | W-B, Primary | All new content verified against harmonized HVR and updated scoring |
| SYNC-003 | Phase 5 complete | W-C, Primary | Final validation report, milestone M5 sign-off |

### File Ownership Rules

| File | Primary Owner | Secondary (Read) | Notes |
|------|--------------|-------------------|-------|
| AGENTS.md | W-A | W-C | Modified only in Phase 1 |
| README.md | W-A | W-C | Modified in Phase 1 and Phase 5 |
| System Prompt | W-A (Phase 1-2), W-B (Phase 3-4) | W-C | Ownership transfers at SYNC-001 |
| HVR v0.100 | W-A | W-B, W-C | Modified only in Phase 2 |
| Brand Context | W-A | W-C | Modified in Phase 1 and Phase 2 |
| Standards.md | W-A (Phase 1-2), W-B (Phase 3-4) | W-C | Ownership transfers at SYNC-001 |
| DEPTH Framework | W-B | W-C | Modified only in Phase 4 |
| Deal Type Product | W-B | W-C | Modified only in Phase 4 |
| Deal Type Service | W-B | W-C | Modified only in Phase 4 |
| Industry Modules | W-B | W-C | Modified only in Phase 4 |
| Market Data | W-B | W-C | Modified only in Phase 4 |
| Interactive Mode | W-B | W-C | Modified only in Phase 4 |

**Cross-workstream rule:** When a file must be modified by two workstreams (System Prompt, Standards.md), the second workstream must wait for SYNC-001 before making changes. No concurrent edits to the same file.

---

## 17. Communication Plan

### Checkpoints

| Frequency | Type | Content |
|-----------|------|---------|
| Per phase | Status report | Tasks completed, blockers found, milestone assessment, files modified with line count deltas |
| Per sync point | Merge report | Files merged, conflicts resolved, validation results |
| End of project | Final report | All 6 success criteria results, remaining issues (if any), recommendations for future work |

### Escalation Path

| Issue Type | Escalate To | Trigger |
|-----------|-------------|---------|
| Technical (broken references, scoring inconsistencies) | Michel Kerkmeester | Cannot resolve within 30 minutes |
| Scope (HVR changes affect other systems) | Pieter Bertram | Changes propagate beyond Deal Templates system |
| Quality (scoring thresholds block too many templates) | Pieter Bertram | More than 50% of test templates fail new thresholds |

---

## Related Documents

- [spec.md](./spec.md) — Full specification with 22 requirements
- [decision-record.md](./decision-record.md) — 5 Architecture Decision Records
- Parent: [001-initial-creation/plan.md](../001-initial-creation/plan.md) — Original implementation plan
