---
title: "Implementation Plan: Edge-Confidence and Seeded-PPR Revisit Review Remediation [template:level_3/plan.md]"
description: "Fix all 16 findings (10 P1, 6 P2) from the 20-iteration deep review of 010-edge-confidence-and-ppr-revisit: 6 real-behavior bugs, 4 evidence/completion-honesty gaps, 6 documentation/test-coverage gaps."
trigger_phrases:
  - "edge confidence review remediation plan"
  - "010 findings fix plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-code-graph/001-code-graph-core/011-edge-confidence-review-remediation"
    last_updated_at: "2026-07-01T17:09:48.000Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Authored plan.md"
    next_safe_action: "Author tasks.md and checklist.md, then dispatch Phase 1 fixes"
    blockers: []
    key_files: ["spec.md", "plan.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-07-01-011-edge-confidence-review-remediation"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Edge-Confidence and Seeded-PPR Revisit Review Remediation

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (mcp_server), Markdown (spec-kit docs) |
| **Framework** | Model Context Protocol server (`system-code-graph`), better-sqlite3 |
| **Storage** | SQLite (`database/code-graph.sqlite`), edge metadata JSON column |
| **Testing** | Vitest |

### Overview

This plan fixes every confirmed finding from the 20-iteration deep review of `010-edge-confidence-and-ppr-revisit`, in three phases ordered by real-world consequence: real-behavior P1s first (they affect what happens the moment either flag is exercised), then completion-honesty P1s (they affect whether the packet's own evidence can be trusted), then P2 cleanup. Every fix stays gated behind the existing default-off flags and is independently re-verified, matching this packet's own established discipline.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented (spec.md, sourced from 20 raw review iteration files)
- [x] Success criteria measurable (16 REQs, each independently re-verifiable)
- [x] Dependencies identified (none external; all fixes are local to this packet's own code/docs)

### Definition of Done
- [ ] All 16 REQs implemented and independently re-verified
- [ ] Existing + new tests passing, flags off byte-identical to pre-fix baseline
- [ ] Docs updated (spec/plan/tasks/checklist here, plus the 010 packet's own docs)
- [ ] `validate.sh --strict` passes on both this folder and `../010-edge-confidence-and-ppr-revisit`
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Flag-gated incremental fix within an existing MCP server (no new architectural pattern introduced).

### Key Components

- **`code-graph-context.ts`**: seeded-PPR module loader, trace/`why_included` construction, rank-time confidence consumption (REQ-001, 002, 004, 006).
- **`cross-file-edge-resolver.ts`**: cross-file CALLS confidence classification writer (REQ-003, 005).
- **`handlers/query.ts` / `handlers/scan.ts`**: relationship-query and scan-enrichment evidence-class consumers (REQ-005).
- **Test suite**: existing code-graph vitest suite plus new regression coverage (REQ-013).
- **Packet docs**: this packet's and the reviewed packet's own spec-kit documentation (REQ-007 through 010, 014, 015) and two root-level packet-wide docs (REQ-016).

### Data Flow

A CALLS edge is written once at scan time (with a confidence tier when the differentiation flag is on) and read many times afterward by ranking, trace, relationship-query, and blast-radius consumers. The bugs in this plan are almost all read-side: producers write reasonable values, but several consumers either don't know about the new values (`AMBIGUOUS`) or don't know to ignore stale ones (rollback). REQ-003 is the one producer-side fix (a write should not have claimed `EXTRACTED` confidence it cannot back up).
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This addendum applies: this plan is authored from a deep-review CONDITIONAL verdict, and multiple findings touch shared policy (evidence-class contract) and persistence (rollback/DB state).

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|---------------|
| `code-graph-context.ts` top-level import (line 32) | Loads shared traversal module at module-load time | Update: make lazy, scoped to PPR path | `grep -n "await import" code-graph-context.ts`; server starts with dist artifact absent |
| `code-graph-context.ts` `why_included` builder | Derives `.ambiguous` from `evidenceClass` | Update: add `AMBIGUOUS` branch | New test: AMBIGUOUS edge sets `.ambiguous === true` |
| `cross-file-edge-resolver.ts` resolved-branch writer | Assigns `0.9/EXTRACTED` on name-only single candidate | Update: verify import-target match or downgrade tier | New test: mismatched-module same-name candidate gets `INFERRED`, not `EXTRACTED` |
| `handlers/query.ts` relationship/enrichment classifier | Checks `evidenceClass === 'INFERRED'` only | Update: also treat `AMBIGUOUS` as weak | New test: `AMBIGUOUS` edge classified weak in relationship output |
| `code-graph-context.ts` `rankContextEdges`/`contextEdgeReliability` | Reads persisted `metadata.confidence` unconditionally | Update per ADR-001 resolution | New test: mixed-state DB (some differentiated, some legacy 0.8) behaves per chosen contract with flag off |
| Packet docs (`checklist.md`, `tasks.md`, `plan.md`, `implementation-summary.md`) | Record completion/verification claims | Update wording and checkboxes to match reality | `validate.sh --strict`; fresh command re-run matches cited numbers |

Required inventories:
- Same-class producers of `evidenceClass`: `rg -n "evidenceClass" .opencode/skills/system-code-graph/mcp_server/lib .opencode/skills/system-code-graph/mcp_server/handlers` (already run during iterations 18 and 20 of the review; re-run before implementing to catch drift).
- Consumers of `metadata.confidence`: `rg -n "metadata\.confidence|\.confidence\b" .opencode/skills/system-code-graph/mcp_server/lib .opencode/skills/system-code-graph/mcp_server/handlers`.
- Matrix axes for REQ-006: {edge-confidence flag: on/off} x {DB history: never-touched / previously-flag-on}. 4 rows, all must be tested.
- Algorithm invariant for REQ-003: a resolver may only claim `EXTRACTED` confidence when it has verified module-target identity, not name uniqueness alone.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Real-Behavior P1 Fixes (REQ-001 through REQ-006)
- [ ] REQ-001: lazy-load the Memory MCP traversal module inside the seeded-PPR path only
- [ ] REQ-002: preserve full multi-hop edge chain in seeded-PPR trace output
- [ ] REQ-003: require import-target verification (or downgrade tier) before EXTRACTED confidence
- [ ] REQ-004: `why_included.ambiguous` recognizes `AMBIGUOUS` evidence class
- [ ] REQ-005: relationship-query/scan-enrichment consumers recognize `AMBIGUOUS`; resolver guarantees `detectorProvenance` on every AMBIGUOUS write
- [ ] REQ-006: resolve rollback-cleanliness per decision-record.md ADR-001

### Phase 2: Evidence & Completion Honesty (REQ-007 through REQ-010)
- [ ] REQ-007: check the real completed boxes in tasks.md/plan.md
- [ ] REQ-008: reword "green"/"passing" to baseline-relative language
- [ ] REQ-009: cite the exact reproducible verification command/scope, or replace with the real current baseline
- [ ] REQ-010: preserve a durable confidence-distribution artifact, or qualify the claim as non-reproducible

### Phase 3: P2 Documentation, Tests, Cleanup (REQ-011 through REQ-016)
- [ ] REQ-011: try/finally cleanup in the eval harness
- [ ] REQ-012: feature catalog + manual playbook coverage for the new gated capabilities
- [ ] REQ-013: regression tests for findings 1 and 4/5
- [ ] REQ-014: fix spec.md's benchmark-record relative path
- [ ] REQ-015: correct ADR-001 misattribution in tasks/checklist/implementation-summary
- [ ] REQ-016: update benchmark-status.md and feature-flags.md to reflect the PPR recovery

### Phase 4: Verification
- [ ] Full code-graph vitest suite, flags off, byte-identical to pre-fix baseline (genuine before/after comparison)
- [ ] Full code-graph vitest suite, both flags on, no regressions vs the state recorded in 010
- [ ] New regression tests (REQ-013) pass, and are confirmed to fail against pre-fix code
- [ ] `validate.sh --strict` on this folder and on `../010-edge-confidence-and-ppr-revisit`
- [ ] Sync from isolation worktree (if used) to live tree with file-by-file diff confirmation
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | New: missing-dist load safety, AMBIGUOUS trace/consumer classification, import-target verification downgrade | Vitest |
| Regression | Existing code-graph suite, both flag states, before/after diff | Vitest |
| Manual | Fresh command re-run of every doc-cited verification claim (REQ-008, 009, 010) | Bash (tsc, vitest, sqlite3 query) |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `system-spec-kit/mcp_server/dist` compiled output | Internal | Green (already built this session) | REQ-001 verification (missing-dist scenario) needs it absent; test must simulate absence rather than rely on ambient state |
| Decision on REQ-006 direction (ADR-001) | Internal | Yellow, needs explicit resolution before implementation | Blocks REQ-006 implementation only; all other REQs are independent |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Any fix causes a new regression in the flags-off byte-identical guarantee, or in the existing PPR test suite.
- **Procedure**: Revert the specific commit/diff for that fix only (each REQ lands as an independent, isolable change); re-run the full before/after regression comparison to confirm the revert restores baseline.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Real-Behavior P1s) ──┐
                               ├──► Phase 4 (Verify)
Phase 2 (Evidence P1s) ────────┤
Phase 3 (P2 Cleanup) ──────────┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Phase 1 | None | Phase 4 |
| Phase 2 | None (independent of Phase 1) | Phase 4 |
| Phase 3 | None (independent of Phases 1-2) | Phase 4 |
| Phase 4 | Phases 1, 2, 3 | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|-------------------|
| Phase 1 (real-behavior P1s) | High (REQ-006 is an architecture decision) | 6 dispatch rounds |
| Phase 2 (evidence P1s) | Low (doc-only) | 1 dispatch round (all 4 are closely related edits) |
| Phase 3 (P2 cleanup) | Medium | 2-3 dispatch rounds |
| Phase 4 (verification) | Medium | 1-2 rounds |
| **Total** | | **~10-12 GPT-5.5-fast dispatch rounds** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Baseline captured (existing suite result, both flag states) before any fix lands
- [ ] Each REQ isolated as an independently revertible change
- [ ] Nothing committed to git (uncommitted diffs only, per standing session rule)

### Rollback Procedure
1. Identify the specific REQ's diff (each is scoped to 1-2 files)
2. Discard that diff only (`git checkout -- <file>` on the worktree copy, or manual revert if synced to live tree)
3. Re-run the full before/after regression comparison to confirm baseline is restored
4. No user-facing notification needed; both flags remain default-off throughout

### Data Reversal
- **Has data migrations?** No schema change. REQ-006 may touch how existing DB rows are interpreted at read time, not their storage format.
- **Reversal procedure**: N/A (no migration to reverse)
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Phase 1   │────►│             │     │             │
│Real-Behavior│     │             │     │             │
└─────────────┘     │   Phase 4   │     │             │
┌─────────────┐     │   Verify    │     │             │
│   Phase 2   │────►│             │     │             │
│  Evidence   │     │             │     │             │
└─────────────┘     └──────┬──────┘     │             │
┌─────────────┐            │            │             │
│   Phase 3   │────────────┘            │             │
│ P2 Cleanup  │                         │             │
└─────────────┘                         └─────────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Phase 1 (REQ-001..006) | None | Fixed real-behavior code | Phase 4 |
| Phase 2 (REQ-007..010) | None | Honest completion evidence | Phase 4 |
| Phase 3 (REQ-011..016) | None | Test coverage, doc completeness | Phase 4 |
| Phase 4 (Verify) | Phases 1-3 | Final validated state | None |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **REQ-006 (ADR-001 resolution + implementation)** - highest complexity, needs a real decision - CRITICAL
2. **REQ-001 (lazy import)** - highest real-world risk if unfixed - CRITICAL
3. **Phase 4 verification** - gates completion - CRITICAL

**Total Critical Path**: Phase 1 (specifically REQ-001 and REQ-006) through Phase 4.

**Parallel Opportunities**:
- Phase 2 (doc-only) and Phase 3 (mostly doc + test) can run fully in parallel with Phase 1 and with each other.
- Within Phase 1, REQ-002, REQ-003, REQ-004, REQ-005 are independent of each other and of REQ-001/REQ-006.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|-------------------|--------|
| M1 | Real-behavior P1s fixed | REQ-001..006 implemented, unit-tested | End of Phase 1 |
| M2 | Evidence honesty restored | REQ-007..010 landed, docs internally consistent | End of Phase 2 |
| M3 | Full remediation verified | All 16 REQs done, suite green (flags off, byte-identical), `validate.sh --strict` passes both folders | End of Phase 4 |
<!-- /ANCHOR:milestones -->
