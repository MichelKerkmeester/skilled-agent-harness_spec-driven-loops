---
title: "Implementation Summary: Code Graph Q2-C1 — Transient/Fatal Parser Skip-List with Bounded Retry"
description: "PENDING state — Q2-C1 is planned against confirmed seams but not implemented. It splits the parser skip-list into TRANSIENT (re-attempt until attempt_count >= max_retries, default 5) vs FATAL (permanent), reuses the durable attempt_count budget, and reverses the must-not-auto-unskip / no-self-heal stance. Build is gated on owner sign-off (REQ-000); it is absent from 030 spec §14 (no commit)."
trigger_phrases:
  - "Q2-C1 implementation summary parser transient fatal"
  - "code graph bounded retry pending"
  - "parser skip-list self-heal not shipped"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/002-code-graph/007-parser-resilience"
    last_updated_at: "2026-06-19T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Author Q2-C1 parser-resilience impl-summary (PENDING: 0 of 1 shipped)"
    next_safe_action: "Resolve owner sign-off (REQ-000), then implement the transient/fatal split"
    blockers:
      - "REQ-000 owner sign-off on reversing no-self-heal precedes implementation"
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-19-028-002-007-parser-resilience"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Owner sign-off on reversing the no-self-heal stance (REQ-000)"
      - "Exact TRANSIENT vs FATAL error-string mapping"
    answered_questions:
      - "Q2-C1 is PENDING — absent from 030 §14"
      - "Reuses the durable attempt_count budget — no schema migration"
---

# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | `028-memory-search-intelligence/002-code-graph/007-parser-resilience` |
| **Completed** | Not started (0 of 1 candidate shipped — PENDING) |
| **Level** | 1 |
| **Candidates** | Q2-C1 / `Q2-C1-parser-transient-fatal` (PENDING) |
| **Shipped In** | None — absent from 030 spec §14 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Nothing has been built yet. This sub-phase plans Q2-C1 against confirmed seams and records the gating decision it depends on. The headline that matters once it ships: a tree-sitter file that crashes the WASM parser **once** for a transient reason — an out-of-memory, a timeout, a deadline-abort — will get a bounded second chance instead of being banished from the code graph forever, while a genuine poison file is still permanently quarantined, and neither ever wedges the scan for any other file.

### Q2-C1 transient/fatal skip-list with bounded retry (PENDING — owner-sign-off gated)

The planned change splits the parser skip-list along a new axis. Today the skip-list classifies only by tree-sitter WASM crash **cohort** (`B1`/`B2`/`OTHER`) — a crash taxonomy, not a retry policy — adds entries via an idempotent upsert that bumps a durable `attempt_count` but never gates on it, and treats removal as a deliberate permanent no-op (`recordSuccess` is `@deprecated`, "must not auto-unskip… or imply self-heal") [CONFIRMED: `parser-skip-list.ts:9,27-35,78-91,93-97`; research iter-002 finding 8]. Q2-C1 adds:

- a **TRANSIENT** class (WASM OOM / timeout / deadline-abort) that stays **eligible** for re-attempt on the next scan until `attempt_count >= max_retries` (default **5**), then promotes to FATAL;
- a **FATAL** class (genuine unparseable content, or a transient that exhausted its budget) that is permanently skipped, manual-review-only — the current behavior;
- the budget read from the **durable** `attempt_count` column, never an in-memory counter, so a crash mid-scan does not hand the file a fresh `max_retries` [CONFIRMED: `consolidation.md:66-68`];
- classification at the existing parse-error catch (`structural-indexer.ts:1254-1262`), which already isolates the failure by returning an empty-node result so the scan proceeds past the file — that isolation invariant is preserved, the retry axis is layered on top.

This is the code-graph analogue of the deep-loop fan-out transient/fatal pattern and the scan-layer expression of aionforge's `PassError::Transient` vs `Fatal` model (`max_retries=5`, durable failed-audit count, poison-pill isolation) [CONFIRMED: `external/aionforge-memory-development/docs/consolidation.md:60-68`; research iter-002 findings 9/10].

### The deliberate reversal (PENDING — REQ-000)

Q2-C1 reverses a documented stance: the permanent-skip / no-self-heal doctrine is intentional, not an oversight. The sub-phase is isolated precisely so that reversal can be gated on explicit owner sign-off (REQ-000) before any code changes. The lifted `recordSuccess` will clear a TRANSIENT entry on a clean re-parse (self-heal); FATAL entries are never auto-cleared.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Not delivered. Q2-C1 is sequenced in plan.md behind a Phase-0 sign-off gate: REQ-000 (owner approval to reverse the no-self-heal stance) must be recorded before any build task starts. After sign-off, the work is a single subsystem-scoped change — the skip-list policy plus its one feeding catch site, reusing the existing durable `attempt_count` so **no schema migration is required** and Q2-C1 ships independently of the Q1-C1/Q6-C1 reindex-transaction cluster [CONFIRMED: research iter-002 finding 10]. The change is reversible (additive; the B1/B2/OTHER cohorts and the `attempt_count` shape are untouched), branch-scoped, and verified with focused parser-skip-list / structural-indexer Vitest plus `validate.sh --strict`. Nothing is committed, pushed, or deployed without explicit user approval.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Gate the build on explicit owner sign-off (REQ-000) | Q2-C1 reverses a documented "must not auto-unskip / no self-heal" stance; silently flipping a deliberate contract would be a policy violation, so the reversal is isolated and gated [CONFIRMED: `parser-skip-list.ts:93-97`] |
| Reuse the durable `attempt_count` as the retry budget, never an in-memory counter | A crash mid-scan must not refresh the budget; SQLite-persisted `attempt_count` matches aionforge's "durable audit trail" property [CONFIRMED: `consolidation.md:66-68`] |
| Default ambiguous/unknown errors to FATAL (fail-closed) | A mis-classified error should waste at most `max_retries` attempts and then stop, never loop forever; fail-closed on ambiguity is the safe default (REQ-007) |
| Keep B1/B2/OTHER cohorts orthogonal to the new axis | The crash taxonomy and the retry policy are independent dimensions; replacing the cohorts would lose crash-class signal for no benefit (REQ-006) |
| No schema migration — additive only | Reusing `attempt_count` keeps Q2-C1 independent of the Q1/Q6 reindex-transaction cluster, so it can ship first and de-risk the cluster [CONFIRMED: research iter-002 finding 10] |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Owner sign-off (REQ-000) | PENDING (HARD precondition; not yet recorded) |
| Q2-C1 transient/fatal split + bounded retry | PENDING (planned; seams confirmed `parser-skip-list.ts:78-91,93-97`, `structural-indexer.ts:1254-1262`) |
| Transient self-heal / exhaustion→fatal / fatal-from-first tests | PENDING (not yet written) |
| Poison-pill isolation test | PENDING (invariant already present at the catch; test to be added) |
| Error→class mapping (unknown→FATAL) | PENDING (mapping to enumerate at build, REQ-007) |
| `validate.sh --strict` on this folder | Expected PASS (spec-doc structure authored to template) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Not implemented.** Q2-C1 is absent from 030 spec §14 (the only Code-Graph candidate shipped in Wave-0 was Q4-C1). There is no commit hash; this summary documents the planned/pending state per the phase's research-then-implement structure.
2. **Blocked on a policy decision.** Implementation cannot begin until the owner approves reversing the documented no-self-heal stance (REQ-000) — this is the gating reason the candidate is isolated as its own sub-phase.
3. **No benefit number is measured.** Every leverage/effort tag in research is structural inference, never a benchmarked delta (research §6 / roadmap §6). Q2-C1's M/M rating is inferred from the failure-mode (single-poison-file wedge), not a measured recall recovery.
4. **TRANSIENT vs FATAL taxonomy is not yet enumerated.** Research names the categories (OOM, timeout, deadline-abort vs unparseable) [CONFIRMED: `consolidation.md:60-68`], but the exact code-graph error-string mapping must be pinned at build, defaulting ambiguous cases to FATAL (REQ-007).
5. **Q2-C2 is explicitly deferred.** Content-addressing edge endpoints (decoupling the symbol ID from the path) is the related but higher-conflict rename-survival fragility, owned by a later Code-Graph phase — not this sub-phase [CONFIRMED: research iter-002 finding 11].
<!-- /ANCHOR:limitations -->

---

<!-- ANCHOR:related-docs -->
## RELATED DOCUMENTS

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Tasks**: See `tasks.md`
- **Research evidence**: `../research/iterations/iteration-002.md` (Q2 findings 8/9/10, `cand-Q2-C1`), `../research/deltas/iter-002.jsonl` (`f2-8`, `cand-Q2-C1`)
- **External source**: `../../external/aionforge-memory-development/docs/consolidation.md:60-68`
- **Roadmap**: `../../research/roadmap.md` (Spine 6 — Q2-C1 row; owner sign-off note)
- **Wave-0 shipped record**: `../../../030-memory-search-intelligence-impl/spec.md` §14 (Q2-C1 absent — PENDING)
<!-- /ANCHOR:related-docs -->
