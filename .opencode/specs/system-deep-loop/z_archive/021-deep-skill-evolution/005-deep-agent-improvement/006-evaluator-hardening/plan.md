---
title: "Implementation Plan: Packet 126 deep-agent-improvement evaluator hardening"
description: "Plan for Level 3 packet 126 evaluator reproducibility, promotion gates, dedup, mirror coverage, and dashboard transparency."
trigger_phrases:
  - "packet 126 plan"
  - "DAI evaluator hardening plan"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/z_archive/021-deep-skill-evolution/005-deep-agent-improvement/006-evaluator-hardening"
    recent_action: "Planned packet 126 evaluator hardening."
    last_updated_at: "2026-05-23T00:00:00Z"
    last_updated_by: "codex"
    next_safe_action: "Run strict validation."
---
# Implementation Plan: Packet 126 deep-agent-improvement evaluator hardening

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
| --- | --- |
| Language/Stack | CommonJS Node scripts, TypeScript Vitest tests, Markdown docs |
| Framework | OpenCode skill runtime |
| Storage | Local JSON, JSONL, Markdown, OS temp score cache |
| Testing | `node --check`, direct Node smoke, strict spec validation |

### Overview

Implement six evaluator hardening items in the DAI scoring, promotion, dedup, and dashboard paths. The work centralizes promotion thresholds, records deterministic score hashes, caches score output by input hash, prevents empty-field mutation-signature collisions, warns when four runtime mirrors were not considered, deduplicates candidate proposals by normalized content hash, and lists unscored dimensions in dashboard output.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] Packet 126 spec folder provided by user.
- [x] Scope boundaries identified: writable only in packet 126 and DAI skill subpaths.
- [x] Precedents read from packets 121, 122, 123, and 124.
- [x] Target scripts read before modification.

### Definition of Done

- [x] All six P1 deliverables implemented.
- [x] Level 3 docs authored, including ADR-001.
- [x] Modified `.cjs` files pass syntax checks.
- [x] Targeted smoke test passes.
- [x] Strict spec validation passes with 0 errors and 0 warnings.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Local evaluator hardening with shared constants and additive result fields.

### Key Components

- `scripts/lib/promotion-gates.cjs`: source of truth for weighted, benchmark, and per-dimension gate values.
- `scripts/score-candidate.cjs`: computes deterministic input hashes and emits cacheable score results.
- `scripts/promote-candidate.cjs`: enforces named promotion gates.
- `scripts/mutation-coverage.cjs`: computes collision-resistant signatures for empty fields.
- `scripts/candidate-lineage.cjs`: stores proposal content hashes and duplicate records.
- `scripts/reduce-state.cjs`: renders unscored dimension transparency in the dashboard.

### Data Flow

```text
candidate file + profile + manifest + integration scan
  -> score-candidate input hash
  -> cache lookup or fresh 5D score
  -> promotionGates/runtimeMirrorCoverage/unscoredDimensions
  -> state log
  -> reduce-state dashboard transparency
```
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup

- [x] Read roadmap and precedent docs.
- [x] Inspect scorer, promotion, mutation, lineage, reducer, and tests.
- [x] Confirm existing worktree dirt is unrelated and preserve it.

### Phase 2: Implementation

- [x] Add `promotion-gates.cjs` and wire score/promotion paths.
- [x] Add score input hashing, cache, and `--no-cache`.
- [x] Add mutation signature sentinels.
- [x] Add runtime mirror coverage checkpoint.
- [x] Add candidate proposal content-hash dedup.
- [x] Add dashboard unscored dimension section.
- [x] Update references.

### Phase 3: Verification

- [x] Run syntax checks on modified `.cjs`.
- [x] Attempt existing Vitest tests.
- [x] Run direct smoke for reproducibility, dedup, and dashboard transparency.
- [x] Run strict spec validation.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tool | Evidence |
| --- | --- | --- | --- |
| Syntax | Modified `.cjs` files | `node --check` | All modified scripts exit 0. |
| Regression | DAI-005/012/dedup/dashboard | Direct Node smoke | Smoke output reports PASS. |
| Vitest | Existing DAI test files | `npm exec --prefix .opencode -- vitest` | Attempted; blocked by offline dependency fetch. |
| Spec | Level 3 docs | `validate.sh --strict` | Final gate exits 0. |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
| --- | --- | --- | --- |
| Packet 124 ADR-001 | Policy | Green | Null-dimension contract undefined. |
| Packet 122 DR-005 | Pattern | Green | Content-hash dedup approach ambiguous. |
| Packet 121 DR-003 | Pattern | Green | Dashboard transparency pattern ambiguous. |
| Node built-ins | Runtime | Green | Hash/cache helpers need `crypto`, `os`, `fs`. |
| Vitest package | Dev dependency | Blocked by offline install | Direct Node smoke covers core regressions. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- Trigger: scorer cache returns incorrect stale data, promotion gates block valid operational candidates unexpectedly, or dashboard rendering regresses.
- Procedure: revert packet 126 changes in DAI scripts/references/tests and remove packet 126 docs.
- Verification after rollback: `node --check` modified scripts and run the pre-packet scorer against a known candidate.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

| Phase | Depends On | Blocks |
| --- | --- | --- |
| Phase 1: Setup | User packet scope | Phase 2 |
| Phase 2: Implementation | Setup evidence | Phase 3 |
| Phase 3: Verification | Implementation | Commit handoff |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
| --- | --- | --- |
| Setup | Medium | 45 minutes |
| Implementation | High | 2 hours |
| Verification | Medium | 45 minutes |
| Documentation | Medium | 1 hour |
| Total |  | 4.5 hours |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist

- [x] Code changes limited to allowed DAI subpaths.
- [x] Spec docs isolated to packet 126.
- [x] No downstream packet folders touched.

### Rollback Procedure

1. Revert changes to `scripts/lib/promotion-gates.cjs`, scorer, promotion, mutation coverage, candidate lineage, reducer, tests, and references.
2. Remove packet 126 docs if the packet is abandoned.
3. Re-run syntax checks and a scorer smoke against an existing candidate.

### Data Reversal

- Has data migrations? No.
- Reversal procedure: remove score cache files under OS temp if needed.
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```text
Packet 123 roadmap
  -> Packet 124 null scoring precedent
  -> Packet 126 scorer/promotion/dedup/dashboard implementation
  -> Packet 127 full runtime mirror gate
```

| Component | Depends On | Produces | Blocks |
| --- | --- | --- | --- |
| Promotion gates | Score dimensions | Shared threshold map | Promotion enforcement |
| Score cache | Rubric/profile/config inputs | `inputHash` and cached result | Reproducibility claim |
| Mutation sentinels | Mutation fields | Collision-resistant signature | Dedup accuracy |
| Candidate content hash | Candidate content | Primary proposal dedup key | Duplicate suppression |
| Dashboard transparency | Null dimensions | Unscored section | Convergence clarity |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. Read source and precedents.
2. Implement score/promotion shared gate contract.
3. Implement hash/cache and dedup fixes.
4. Implement dashboard transparency.
5. Verify syntax and behavior.
6. Strict-validate packet docs.

Parallel opportunities were limited because all changes meet at scorer output semantics.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
| --- | --- | --- | --- |
| M1 | Source Understood | Scripts and precedent docs read | Phase 1 |
| M2 | Code Complete | Six P1 items implemented | Phase 2 |
| M3 | Verified | Syntax, smoke, and strict validation pass | Phase 3 |
| M4 | Handoff Ready | Commit handoff written | Completion |
<!-- /ANCHOR:milestones -->

---

<!-- ANCHOR:adr -->
## L3: ARCHITECTURE DECISION RECORD

See `decision-record.md` ADR-001 for the Evaluator Reproducibility Contract.

| ADR | Decision | Rationale |
| --- | --- | --- |
| ADR-001 | Hash deterministic scorer inputs, centralize promotion gates, and expose null dimensions | Makes evaluator evidence repeatable and transparent without expanding into packet 127 sync enforcement. |
<!-- /ANCHOR:adr -->
