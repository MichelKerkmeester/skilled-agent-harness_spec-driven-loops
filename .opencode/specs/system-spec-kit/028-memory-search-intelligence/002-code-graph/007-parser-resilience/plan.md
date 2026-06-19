---
title: "Implementation Plan: Code Graph Q2-C1 — Transient/Fatal Parser Skip-List with Bounded Retry"
description: "Split the parser skip-list into TRANSIENT (re-attempt until attempt_count >= max_retries, default 5) vs FATAL (permanent), classify at the existing parse-error catch, reuse the durable attempt_count budget, and lift the deliberate no-op recordSuccess into a TRANSIENT self-heal. Gated on owner sign-off (REQ-000). No schema migration required."
trigger_phrases:
  - "Q2-C1 plan parser transient fatal"
  - "code graph bounded retry sequencing"
  - "parser skip-list self-heal plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/002-code-graph/007-parser-resilience"
    last_updated_at: "2026-06-19T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Author Q2-C1 parser-resilience impl plan (PENDING — owner-sign-off gated)"
    next_safe_action: "Obtain owner sign-off, then enumerate the TRANSIENT/FATAL error mapping"
    blockers:
      - "REQ-000 owner sign-off on reversing no-self-heal precedes all implementation"
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-19-028-002-007-parser-resilience"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Owner sign-off (REQ-000) on reversing the no-self-heal stance"
      - "Exact TRANSIENT vs FATAL error-string mapping"
    answered_questions:
      - "Q2-C1 reuses the durable attempt_count budget — no schema migration"
      - "Q2-C1 is independent of the Q1/Q6 reindex-transaction cluster"
---

# Implementation Plan: Code Graph Q2-C1 — Transient/Fatal Parser Skip-List with Bounded Retry

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (Node, MCP server) |
| **Framework** | `system-code-graph` tree-sitter (WASM) → SQLite structural indexer |
| **Storage** | SQLite (`parser_skip_list` table; durable `attempt_count` column) |
| **Testing** | vitest |

### Overview
Q2-C1 adds a **transient/fatal axis** and a **bounded retry ceiling** (`max_retries`, default 5) to the parser skip-list, so a transient WASM crash (OOM/timeout/deadline-abort) self-heals on a later scan while a genuine poison file is permanently quarantined — and neither ever wedges the scan for other files. It reuses the **existing durable `attempt_count` column** (`parser-skip-list.ts:78-91`) as the retry budget, classifies at the **existing parse-error catch** (`structural-indexer.ts:1254-1262`), and lifts the deliberate no-op `recordSuccess` (`parser-skip-list.ts:93-97`) into a real TRANSIENT self-heal. This is the code-graph analogue of the deep-loop fan-out transient/fatal pattern and the scan-layer expression of aionforge's `PassError::Transient` vs `Fatal` model with `max_retries=5` and a durable failed-audit count [CONFIRMED: `external/aionforge-memory-development/docs/consolidation.md:60-68`; research iter-002 findings 8/9/10].

**Gating note:** the change deliberately **reverses** the documented "must not auto-unskip / no self-heal" stance for the TRANSIENT class only. REQ-000 makes owner sign-off a hard precondition; this sub-phase is isolated to gate that decision. **No schema migration is required** (the counter already exists), so Q2-C1 ships independently of the Q1-C1/Q6-C1 reindex-transaction cluster.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] **REQ-000 owner sign-off obtained** — reversing the no-self-heal stance is explicitly approved (HARD precondition)
- [ ] TRANSIENT vs FATAL error-string mapping enumerated and reviewed
- [ ] `max_retries` default (5) and config surface confirmed
- [ ] Baseline captured: current parser-skip-list / structural-indexer suite green

### Definition of Done
- [ ] All P0 acceptance criteria met (REQ-000..004)
- [ ] P1 met or user-approved deferral (REQ-005..007)
- [ ] Tests passing (transient self-heal, exhaustion→fatal, fatal-from-first, poison-pill isolation)
- [ ] Docs updated (spec/plan/tasks/implementation-summary); `validate.sh --strict` green
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Durable, bounded retry with poison-pill isolation — the scan-layer analogue of aionforge consolidation's `Transient` (leave `raw`, retry) vs `Fatal` (mark `failed`, retain/audit/exclude, proceed past) classification, with `max_retries` read from a durable audit trail so a crash never refreshes the budget [CONFIRMED: `consolidation.md:60-68`].

### Key Components
- **`parser-skip-list.ts`** (policy): owns the transient/fatal axis, the `max_retries` ceiling, the "eligible while TRANSIENT and under budget" lookup, the promotion of an exhausted TRANSIENT to FATAL, and the lifted `recordSuccess` self-heal for TRANSIENT entries. Reuses the durable `attempt_count`.
- **`structural-indexer.ts`** (classifier): at the parse-error catch (`:1254-1262`), maps the caught error to TRANSIENT vs FATAL before calling `addToSkipList`; keeps returning the empty-node result so the scan proceeds past the file.
- **`code-graph-db.ts`** (storage, additive): the `parser_skip_list` table (`:203-211`); if a `retry_class` column is needed it is declared additively, otherwise the axis rides config + the existing `error_class`/`attempt_count`.

### Data Flow
Scan a file → parser throws → catch classifies error as TRANSIENT or FATAL → `addToSkipList` records it with the class + bumps the durable `attempt_count` → return empty-node result so the scan continues. On the **next** scan: skip-list lookup returns "skip" only when FATAL **or** (TRANSIENT **and** `attempt_count >= max_retries`); a TRANSIENT-under-budget file is re-attempted. On a clean re-parse: `recordSuccess` clears the TRANSIENT entry (self-heal); FATAL entries are never auto-cleared.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This reverses a deliberate doctrine and changes a persistence-policy invariant, so the affected-surface inventory applies.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `parser-skip-list.ts` `lookupSkipList` / `addToSkipList` | Permanent skip on any crash; `attempt_count` bumps but never gates | Update — TRANSIENT-under-budget stays eligible; exhausted TRANSIENT promotes to FATAL; FATAL behaves as today | Transient-self-heal + exhaustion→fatal tests |
| `parser-skip-list.ts` `recordSuccess` (`@deprecated` no-op, `:93-97`) | Intentional no-op (no self-heal) — **the reversed contract** | Update — clears a TRANSIENT entry on a clean parse; FATAL stays manual-review-only | REQ-005 self-heal test; REQ-000 sign-off recorded |
| `structural-indexer.ts` parse-error catch (`:1254-1262`) | Flattens all failures to `parseHealth:'error'` + `parseErrors`; returns empty-node result (scan proceeds) | Update — classify TRANSIENT vs FATAL before `addToSkipList`; keep the empty-node return (isolation) | Poison-pill isolation test (REQ-004) |
| `code-graph-db.ts` `parser_skip_list` schema (`:203-211`) | `error_class CHECK IN ('B1','B2','OTHER')` + `attempt_count` | Update (additive only) — optional `retry_class` column, or ride config + existing cols; no destructive migration | Schema-additivity check; fixtures without the column stay compatible |
| B1/B2/OTHER crash cohorts | Crash taxonomy | Unchanged — orthogonal to the new axis | REQ-006: cohort label preserved |

Required invariant: the failing file **always** isolates (the scan proceeds for every other file) regardless of classification; the retry budget is **durable** (never in-memory); and an **ambiguous/unknown** error defaults to **FATAL** (fail-closed) rather than looping.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 0: Sign-off Gate (HARD precondition)
- [ ] Secure explicit owner sign-off to reverse the "must not auto-unskip / no self-heal" stance for the TRANSIENT class (REQ-000) — implementation does not begin until this is recorded

### Phase 1: Setup
- [ ] Confirm the durable `attempt_count` budget and the permanent-skip no-op (`parser-skip-list.ts:78-91, 93-97`)
- [ ] Confirm the parse-error catch + empty-node isolation return (`structural-indexer.ts:1254-1262`)
- [ ] Enumerate the TRANSIENT (OOM/timeout/deadline-abort) vs FATAL error-string mapping; default ambiguous → FATAL
- [ ] Decide `max_retries` surface (config, default 5) and whether a `retry_class` column is needed
- [ ] Capture baseline: parser-skip-list / structural-indexer suite green

### Phase 2: Core Implementation
- [ ] Add the transient/fatal axis + `max_retries` ceiling to the skip-list policy; reuse the durable `attempt_count`
- [ ] Make `lookupSkipList` return "skip" only for FATAL or exhausted-TRANSIENT; a TRANSIENT-under-budget file stays eligible
- [ ] Promote an exhausted TRANSIENT to FATAL
- [ ] Classify the caught error at the structural-indexer catch before `addToSkipList`; preserve the empty-node isolation return
- [ ] Lift `recordSuccess` into a TRANSIENT self-heal (clear on clean re-parse); FATAL stays manual-review-only
- [ ] (If needed) declare an additive `retry_class` column

### Phase 3: Verification
- [ ] Transient-self-heal test: a TRANSIENT file re-enters the graph when it next parses cleanly
- [ ] Exhaustion→fatal test: a TRANSIENT file that fails `max_retries` times is permanently skipped; budget read from the durable `attempt_count` (crash does not reset it)
- [ ] Fatal-from-first test: a FATAL file is skipped immediately, no re-attempt
- [ ] Poison-pill isolation test: a scan with one crashing file still indexes every other file
- [ ] Error→class mapping test incl. unknown-defaults-to-FATAL (fail-closed)
- [ ] `tsc` + build pass; `validate.sh --strict` green
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Transient self-heal; exhaustion→fatal; fatal-from-first; durable-budget-not-reset | vitest |
| Unit | Error→class mapping incl. unknown→FATAL (fail-closed) | vitest |
| Integration | Poison-pill isolation: one crashing file, the rest index cleanly | vitest (structural-indexer scan) |
| Regression | B1/B2/OTHER cohort labels unchanged; FATAL behavior identical to baseline | vitest |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| **Owner sign-off (REQ-000)** | Process | **PENDING** | HARD blocker — no implementation until the no-self-heal reversal is approved |
| Durable `attempt_count` column (`parser-skip-list.ts:78-91`) | Internal | Green | Present; reused as the retry budget — no migration for the counter |
| Parse-error catch site (`structural-indexer.ts:1254-1262`) | Internal | Green | Present; the classification point |
| Q1-C1 / Q6-C1 reindex-transaction cluster | Internal | Independent | NOT a dependency — Q2-C1 needs no schema migration and ships ahead of the cluster [CONFIRMED: research iter-002 finding 10] |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A TRANSIENT mis-classification loops a genuinely-fatal file (bounded by `max_retries`, so low blast), or the self-heal re-admits a file that should stay skipped, or any regression to the poison-pill isolation invariant.
- **Procedure**: Revert the Q2-C1 commit (branch-only; never pushed to main or deployed without explicit go). The change is additive and reversible — reverting restores the permanent-skip / no-self-heal behavior exactly, because `attempt_count` and the B1/B2/OTHER cohorts are untouched in shape. If an additive `retry_class` column was added, it is left in place (additive, ignored) or dropped in a follow-up; no data is destroyed.
- **What still speaks the old contract**: any operator runbook or doc that asserts "skip-list removal is manual-review-only" must be updated to note the TRANSIENT self-heal exception once REQ-000 is signed off.
<!-- /ANCHOR:rollback -->
