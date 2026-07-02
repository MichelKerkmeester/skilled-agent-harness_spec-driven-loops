---
title: "Implementation Plan: Phase 16: LLM Judge Hardening"
description: "Plan for the shipped retry, neutral fallback card, timeout, format-strip retry, and quarantine layers for judge validation."
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
    last_updated_at: "2026-07-01T21:50:00Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Replaced scaffold plan with shipped LLM judge hardening content from spec.md"
    next_safe_action: "Use this plan as documentation for the completed judge hardening stack"
    blockers: []
    key_files:
      - ".opencode/skills/deep-loop-runtime/lib/deep-loop/post-dispatch-validate.ts"
    session_dedup:
      fingerprint: "sha256:016a5e7c9d2b4f6081c3e5a7890b2d4f6a8c0e2d4f6b8a0c2e4d6f8a1b3c5e1b"
      session_id: "scaffold-content-remediation-016"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "4-stage JSON extraction cascade deferred to a separate deep-rewrite ticket"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 16: LLM Judge Hardening

<!-- SPECKIT_LEVEL: 1 -->
<!--
SELF-CHECK:
- Confirm the plan names the simplest viable approach, affected surfaces, and verification path.
- Match phases to the stated scope; remove setup theater that does not change the outcome.
FAILURE MODES:
- Over-planning, missing rollback, and treating assumptions as dependencies.
-->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript post-dispatch judge validation |
| **Framework** | Layered LLM judge retry, fallback, timeout, parse recovery, and quarantine enforcement |
| **Storage** | Persistence/convergence/coverage write paths guarded against quarantined fallback cards |
| **Testing** | Spec acceptance requires exhausted-retry quarantine, zero writes for quarantined cards, fenced JSON parse recovery, retry metadata on fallback cards, and transient failure recovery; no dedicated test file is named in spec.md |

### Overview
This phase hardened `.opencode/skills/deep-loop-runtime/lib/deep-loop/post-dispatch-validate.ts` against model judge failures. The implementation adds configurable retries/backoff, dual timeout races, format-strip retry, neutral fallback cards marked `quarantined:true`, and guard checks so fallback cards cannot reach persistence, convergence, or coverage scoring paths.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented: one judge model failure could contaminate convergence and coverage scoring.
- [x] Success criteria measurable: exhausted retries produce `quarantined:true` fallback cards with zero persistence writes.
- [x] Dependencies identified: persistence write-path entry points and retry config surface are identifiable.

### Definition of Done
- [x] Retry layer implemented with configurable attempts and backoff for transient model failures.
- [x] Dual timeout races implemented for fast path and slow-path escape hatch.
- [x] Format-strip retry strips markdown fences and reparses before fallback.
- [x] Neutral fallback cards carry `quarantined:true` and retry/failure metadata.
- [x] Quarantine checks exclude fallback cards from persistence, convergence, and coverage scoring.
- [x] Full 4-stage JSON extraction cascade remains deferred as a separate deep-rewrite ticket.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Layered judge hardening with neutral quarantine fallback at all scoring write boundaries.

### Key Components
- **Retry layer**: Re-attempts transient model calls according to configured attempts/backoff.
- **Dual timeout races**: Separates fast timeout behavior from a slow-path escape hatch.
- **Format-strip retry**: Recovers fenced JSON responses by stripping markdown fences before reparsing.
- **Neutral fallback card**: Produced after exhausted recovery attempts, marked `quarantined:true`, and annotated with retry/failure metadata.
- **Quarantine guards**: Prevent fallback cards from reaching persistence, convergence, and coverage scoring write paths.

### Data Flow
Judge validation calls the model through retry and timeout wrappers. A parse failure first tries format stripping; exhausted retries issue a neutral fallback card with quarantine metadata. Before any persistence or scoring write, the quarantine guard checks the card and skips writes for quarantined fallback output.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.opencode/skills/deep-loop-runtime/lib/deep-loop/post-dispatch-validate.ts` | Owns judge model validation and scoring write boundaries | Add retry/fallback/timeout/format-strip/quarantine hardening | Spec acceptance covers fallback quarantine and transient recovery |
| Persistence write path | Stores scored cards | Block quarantined fallback cards | Unit test asserts zero writes for quarantined cards |
| Convergence and coverage scoring | Consume validated cards | Exclude quarantined fallback cards | Guard tests cover all three surfaces |

Required inventories:
- Same-class producers: identify judge call path and all persistence/scoring write entry points before placing guards.
- Consumers of changed symbols: persistence, convergence, and coverage paths must all respect `quarantined:true`.
- Matrix axes: transient model failure, exhausted retries, fenced JSON response, fast timeout, slow-path timeout, fallback metadata, and each write-path guard.
- Algorithm invariant: no fallback card marked `quarantined:true` may be persisted or used for convergence/coverage scoring.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Confirm implementation scope is only `post-dispatch-validate.ts`.
- [x] Identify persistence, convergence, and coverage scoring write-path entry points.
- [x] Confirm the 4-stage JSON extraction cascade is deferred to a separate deep-rewrite ticket.

### Phase 2: Core Implementation
- [x] Add retry layer with configurable attempts and backoff.
- [x] Add dual timeout races for fast-path timeout and slow-path escape hatch.
- [x] Add format-strip retry for fenced JSON model responses.
- [x] Add neutral fallback card with `quarantined:true`, retry count, and failure kind metadata.
- [x] Add quarantine guards at persistence, convergence, and coverage scoring write paths.

### Phase 3: Verification
- [x] Verify exhausted retries produce a `quarantined:true` fallback card.
- [x] Verify quarantined fallback cards produce zero persistence writes and do not reach convergence/coverage scoring.
- [x] Verify fenced JSON parses successfully after format-strip retry without issuing fallback.
- [x] Verify transient one-shot model failures recover within the retry window and produce a valid scored card.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit/quarantine | Exhausted retries produce `quarantined:true`; zero persistence writes | Spec acceptance criteria; no dedicated test file named |
| Unit/parse recovery | Fenced JSON strips and reparses before fallback card is issued | Format-strip fixture |
| Integration/retry | One-shot model failure recovers within retry window and produces valid scored card | Mocked model failure |
| Guard invariant | No fallback card reaches persistence, convergence, or coverage scoring | Write-path guard assertions |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Existing retry config surface | Internal | Available | Required to configure attempts and backoff |
| Identifiable write-path entry points | Internal | Available | Required to place quarantine guards consistently |
| 4-stage JSON extraction cascade | Future design | Deferred | More advanced parse recovery requires separate structured-output design |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Retry/timeout wrappers break judge validation, quarantine guards block valid scored cards, or fallback cards leak into scoring paths.
- **Procedure**: Revert judge hardening additions in `post-dispatch-validate.ts`; restore prior judge path while keeping the quarantine invariant documented for a corrected implementation.
<!-- /ANCHOR:rollback -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->
