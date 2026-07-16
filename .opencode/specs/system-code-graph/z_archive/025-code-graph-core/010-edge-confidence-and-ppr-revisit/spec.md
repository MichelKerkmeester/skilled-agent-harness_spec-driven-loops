---
title: "Feature Specification: Edge-Confidence Differentiation and Seeded-PPR Revisit"
description: "Give CALLS/IMPORTS edges a real confidence gradient (reusing an existing signal the extractor currently discards), then re-benchmark the previously-cut seeded-PPR ranking feature against the same queries/metrics as its original cut verdict."
trigger_phrases:
  - "edge confidence differentiation"
  - "seeded ppr revisit"
  - "code graph confidence gradient"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-code-graph/025-code-graph-core/010-edge-confidence-and-ppr-revisit"
    last_updated_at: "2026-07-01T00:00:00Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Scaffolded spec folder for the PPR revisit project"
    next_safe_action: "Implement edge-confidence differentiation behind a new default-off flag"
    blockers: []
    key_files:
      - "spec.md"
      - "tasks.md"
      - "005-seeded-ppr-ranking/spec.md"
      - "../../007-dark-flag-graduation/005-codegraph-seeded-ppr/benchmark-results.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-07-01-010-edge-confidence-ppr-revisit"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "Operator approved this as the ONE feature worth revisiting among 4 cut candidates, because the repo's own benchmark record explicitly says the cut is a verdict on this substrate, not a refute of PPR as an algorithm, and names the exact prerequisite."
      - "One combined phase folder for both the confidence-differentiation work and the PPR re-benchmark, not two, to avoid re-creating the child-undercount drift this packet already had fixed once."
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
<!-- SPECKIT_LEVEL: 3 -->

<!-- WHEN TO USE THIS TEMPLATE: Level 3 - changes affect 500+ lines across shared production code, needs formal risk matrix, multiple user stories, full complexity assessment. -->

---

## EXECUTIVE SUMMARY

Seeded-PPR code-graph ranking was built, shadow-shipped, and cut after tying a flat walk exactly (0.0000 delta on every metric) because every CALLS edge carried identical confidence metadata, giving PPR no gradient to rank on. This phase fixes the actual root cause -- an existing resolution-quality signal that the extractor computes then discards -- gates it behind a new default-off flag, recovers the deleted PPR module from git history, and re-runs the original benchmark unmodified for an apples-to-apples verdict.

**Key Decisions**: Reuse the existing resolution-quality signal in `cross-file-edge-resolver.ts` rather than building new call-resolution infrastructure. Recover the deleted PPR module from git (`277c35344c^`) rather than rewriting it.

**Critical Dependencies**: The re-benchmark's validity depends on the confidence differentiation actually producing a real, non-uniform gradient -- if the spread is too narrow, the re-benchmark result is inconclusive, not necessarily "PPR still doesn't work."

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-07-01 |
| **Branch** | `system-speckit/028-memory-search-intelligence` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Seeded-PPR ranking was cut because uniform CALLS-edge confidence (all edges: INFERRED, 0.8, 0.8) gave it nothing to differentiate on. The repo's own benchmark record says this is "not a refute of PPR as an algorithm, it is a verdict on PPR over this substrate" and names non-uniform edge weighting as the exact prerequisite for a fair re-test. That prerequisite has never been built.

### Purpose
Build real per-edge confidence differentiation (reusing existing signals and schema, not inventing new infrastructure), then give seeded-PPR a genuinely fair second benchmark and record an honest verdict.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Differentiate CALLS edge confidence using the resolution-quality signal `cross-file-edge-resolver.ts` already computes (`resolved`/`ambiguousSkipped`/`unresolved`) but currently discards, plus in-file candidate-cardinality for same-file calls.
- Gate this behind a new default-off flag `SPECKIT_CODE_GRAPH_EDGE_CONFIDENCE_DIFFERENTIATION`.
- Prove zero behavior change for existing consumers (structural search, impact analysis via `code-graph-context.ts`'s reliability blend) when the flag is off.
- Recover the deleted seeded-PPR module from git history (`657a0f6a3e` introduced, `277c35344c` deleted) and re-wire it behind its original flag, consuming the new differentiated weights.
- Re-run the existing, unmodified benchmark harness and record an honest verdict.

### Out of Scope
- A full call-resolution rewrite (e.g. swapping the tree-sitter/regex extractor for a TypeScript-compiler-API symbol binder) -- the candidate-cardinality heuristic is an approximation, not true semantic resolution, and that's an explicitly separate, much larger project.
- Reviving any of the other 3 cut features (summary-fusion lane, C4 shadow-weight promoter, outcome-weighted ranking) -- tracked as docs-only in `../../005-spec-data-quality/046-drift-audit-deep-history-correction/`.
- Changing IMPORTS edge confidence -- those already resolve to confidence 1.0/EXTRACTED by construction (successful module+export resolution), no change needed.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-code-graph/mcp_server/lib/structural-indexer.ts` | Modify | Candidate-cardinality check for same-file CALLS edges |
| `.opencode/skills/system-code-graph/mcp_server/lib/cross-file-edge-resolver.ts` | Modify | Write the already-computed resolution-quality signal to edge metadata instead of discarding it |
| `.opencode/skills/system-code-graph/mcp_server/lib/code-graph-context.ts` | Modify | Recover deleted PPR functions from `277c35344c^`, gate behind flag |
| `.opencode/skills/system-code-graph/mcp_server/lib/indexer-types.ts` | Reference only | Existing `EdgeEvidenceClass` enum reused, no schema change |
| `.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md` (or code-graph equivalent) | Modify | Register the new flag |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Confidence differentiation ships behind a default-off flag | Existing test suite shows no new failures against the pre-existing baseline with flag OFF, proving zero behavior change |
| REQ-002 | Deleted PPR module recovered from git, not rewritten from scratch | Recovered functions match `277c35344c^` content, re-wired to consume new weights |
| REQ-003 | Re-benchmark uses the same queries/metrics/methodology as the original cut verdict | Same 20 labeled queries, same precision/recall/nDCG@3/5/8, same damping sweep 0.5-0.95 |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Verdict is recorded honestly, not assumed | Graduate/refine/cut decision made from the actual new numbers |
| REQ-005 | New flag registered in the env reference docs | Grep confirms the flag is documented per repo convention |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Existing code-graph test suite passes with the new flag OFF (regression proof).
- **SC-002**: Re-benchmark runs to completion and produces real, non-simulated metrics.
- **SC-003**: A clear graduate/refine/cut verdict is written, whatever the outcome.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | `contextEdgeReliability` in `code-graph-context.ts` is already live/unconditional for all code-graph-context consumers | Un-gated confidence differentiation would change ranking behavior for structural search/impact analysis, not just PPR | New flag gates the write path; consumers see zero change until explicitly enabled |
| Risk | Candidate-cardinality is a proxy for resolution quality, not true call-target binding | Could mis-rank shadowed/overloaded/dynamically-dispatched calls | Document explicitly as an approximation in the implementation-summary |
| Risk | Re-benchmark may still show near-zero PPR delta | Would look like wasted effort | Valid, honest result either way -- record it; this is real information regardless of direction |
| Dependency | This project touches `.opencode/skills/system-code-graph/mcp_server/` -- shared production code used elsewhere in the repo | Isolated in worktree; regression suite run before any live-tree sync |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Confidence differentiation adds no measurable indexing latency when the flag is off (unconditional early-return).

### Security
- **NFR-S01**: No destructive shell commands; git-history recovery uses read-only `git show`.

### Reliability
- **NFR-R01**: Existing consumers of code-graph context show zero behavior change with the flag off, proven by the existing test suite, not just claimed.

---

## 8. EDGE CASES

### Data Boundaries
- A CALLS edge with zero name-matching candidates in either same-file or cross-file scope: leave at the current default tier, don't fabricate a confidence value.
- An edge already resolved by `cross-file-edge-resolver.ts` before this change ships: re-running the resolver after the flag is enabled should update its metadata, not leave it stale.

### Error Scenarios
- Recovered PPR module references a symbol/type that no longer exists in the current codebase (drift since `277c35344c`): fix the specific incompatibility, don't silently stub it out.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 18/25 | Files: 4, LOC: ~300-500 estimated, Systems: 1 (code-graph MCP server) |
| Risk | 15/25 | Auth: N, API: N (internal), Breaking: N (gated), but touches live/unconditional consumer code |
| Research | 15/20 | Git archaeology for recovery, benchmark methodology reuse |
| Multi-Agent | 5/15 | Single sequential dispatch chain, not parallel workstreams |
| Coordination | 5/15 | One dependency on doc-correction pass (009) for final PPR doc entries |
| **Total** | **58/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Un-gated confidence change breaks existing structural search/impact ranking | High | Low (gated by design) | Flag default-off; regression suite proves it |
| R-002 | Recovered PPR code doesn't compile against current codebase | Medium | Medium | Fix incompatibilities surgically during recovery, not a rewrite |
| R-003 | Re-benchmark shows no improvement | Low (still a valid result) | Medium | Record honestly; this closes the open question either way |

---

## 11. USER STORIES

### US-001: Fair re-benchmark (Priority: P0)

**As a** maintainer of the code-graph subsystem, **I want** seeded-PPR re-tested against real, differentiated edge confidence, **so that** the "REFINE not refute" question the original cut left open gets a real answer instead of staying speculative forever.

**Acceptance Criteria**:
1. Given the new confidence-differentiation flag is on, When the re-benchmark runs, Then it uses the same 20 queries and metrics as the original cut verdict.
2. Given the flag is off, When any existing code-graph consumer runs, Then behavior is byte-identical to before this phase.

---

## 12. OPEN QUESTIONS

- None blocking. The final verdict (graduate/refine/cut) is the deliverable, not a precondition.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Original cut record**: `../../007-dark-flag-graduation/005-codegraph-seeded-ppr/benchmark-results.md`
- **Original spec (being revisited)**: `../005-seeded-ppr-ranking/spec.md`
- **Doc-correction pass**: `../../005-spec-data-quality/046-drift-audit-deep-history-correction/`
- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
