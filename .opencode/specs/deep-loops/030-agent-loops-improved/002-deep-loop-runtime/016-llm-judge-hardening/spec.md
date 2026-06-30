---
title: "LLM Judge Hardening Stack"
description: "A single model call failure in the judge path propagates contaminated or null output into convergence and coverage scoring because no neutral fallback card, retry layer, or quarantine boundary exists."
trigger_phrases:
  - "llm-judge hardening"
  - "neutral fallback card"
  - "judge quarantine"
  - "post-dispatch validate"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "deep-loops/030-agent-loops-improved/002-deep-loop-runtime/016-llm-judge-hardening"
    last_updated_at: "2026-06-28T14:02:04Z"
    last_updated_by: "spec-author"
    recent_action: "Authored spec.md from research.md §5.1"
    next_safe_action: "Create plan.md and tasks.md"
    blockers: []
    key_files:
      - ".opencode/skills/deep-loop-runtime/lib/deep-loop/post-dispatch-validate.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/016-llm-judge-hardening"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Should the 4-stage JSON extraction cascade be a follow-on ticket or bundled here?"
    answered_questions:
      - "Decision: separate ticket (deep-rewrite scope)"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# LLM Judge Hardening Stack

<!-- SPECKIT_LEVEL: 1 -->
<!--
SELF-CHECK:
- Confirm the artifact states the current problem, intended outcome, scope, and verification evidence.
- Remove placeholders, stale status, and claims that are not backed by a check.
FAILURE MODES:
- Scope drift, vague acceptance criteria, and optimistic done-language without evidence.
-->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-06-28 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 16 of 18 |
| **Predecessor** | 015-fallback-router-typed-reroute |
| **Successor** | 017-fanout-stall-watchdog |
| **Handoff Criteria** | Retry + neutral fallback card + dual timeout races + format-strip retry implemented; quarantine enforced at all persistence write-paths; no fallback card reaches convergence or coverage scoring |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 16** of the deep-loop-runtime recs specification.

**Scope Boundary**: `post-dispatch-validate.ts` only — retry/fallback/timeout/format-strip layers; the full 4-stage JSON extraction cascade is a separate deep-rewrite ticket.

**Dependencies**:
- Persistence write-path entry points must be identifiable before quarantine guard placement
- Retry config (max attempts, backoff) must be wirable from existing loop config surface

**Deliverables**:
- Retry layer for transient model failures (configurable attempts, backoff)
- Neutral fallback card issued on exhausted retries with `quarantined:true` flag
- Dual timeout races (fast path + slow-path escape hatch)
- Format-strip retry (strip markdown fences, re-parse)
- Quarantine enforcement at every persistence write-path entry point

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
A single model call failure in the judge path propagates contaminated or null output into convergence and coverage scoring; there is no neutral fallback card or quarantine boundary. Without a retry layer, transient model errors are treated as permanent failures and collapse the entire scoring path for that iteration. Fallback cards that leak past the quarantine boundary corrupt convergence signals for subsequent iterations, causing downstream runs to make decisions on poisoned evidence.

### Purpose
Add retry, neutral fallback card, dual timeout races, and format-strip retry as layered hardening in `post-dispatch-validate.ts` with quarantine enforcement so judge failures never corrupt convergence or coverage scoring.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Retry layer: configurable attempt count and backoff for transient model failures
- Neutral fallback card with `quarantined:true` flag, issued when retries are exhausted
- Dual timeout races: fast-path timeout + slow-path escape hatch
- Format-strip retry: strip markdown fences and re-parse before issuing a fallback card
- Quarantine flag checked at every persistence, convergence, and coverage scoring write-path entry point; quarantined cards are excluded from all three

### Out of Scope
- Full 4-stage JSON extraction cascade (fenced → balanced → tool-result poll → StructuredOutput) — deep-rewrite requiring model API changes and structured output contracts; separate ticket (decision recorded in open questions)

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/deep-loop-runtime/lib/deep-loop/post-dispatch-validate.ts` | Modify | Add retry, neutral fallback card, dual timeout races, format-strip retry, and quarantine enforcement |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Neutral fallback cards must carry `quarantined:true` and be excluded at every persistence write-path entry point before any write occurs | Unit test: trigger exhausted retries → assert fallback card has `quarantined:true`; assert zero persistence writes occur for quarantined cards |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | Format-strip retry must strip markdown fences and re-parse before issuing a fallback card; retry count and failure kind must be recorded in the fallback card's metadata | Unit test: supply a fenced JSON model response → assert successful parse after strip with no fallback card issued; assert retry metadata fields populated on an actual fallback card |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: No fallback card reaches the persistence, convergence, or coverage scoring paths — confirmed by quarantine guard unit tests asserting write-path exclusion for all three surfaces.
- **SC-002**: A transient model failure recovers within the retry window and produces a valid scored card (not a fallback card) in the golden-path test fixture — confirmed by integration test with a mocked one-shot model failure.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Neutral fallback cards that leak into the convergence signal corrupt scores across subsequent iterations | High | Enforce quarantine flag check at every write-path entry point; add an invariant test asserting no unquarantined fallback card can reach convergence |
| Evidence | `external/kasper/src/scorer.ts:293,357,394,545,608,1298`; `evaluate.ts:272` | Low | Read-only citation from research.md §5.1 |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Should the 4-stage JSON extraction cascade be a follow-on ticket or bundled here? **Decision: separate ticket (deep-rewrite scope).**
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->

> **Provenance:** research.md §5.1, (iter 10)

<!-- SCAFFOLD_VALIDATION_COUNTS:
REQ-003
REQ-004
REQ-005
REQ-006
REQ-007
REQ-008
**Given**
**Given**
**Given**
**Given**
**Given**
**Given**
-->
