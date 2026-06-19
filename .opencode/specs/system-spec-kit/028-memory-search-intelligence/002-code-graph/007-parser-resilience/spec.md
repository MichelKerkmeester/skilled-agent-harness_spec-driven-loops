---
title: "Feature Specification: Code Graph Q2-C1 — Transient/Fatal Parser Skip-List with Bounded Retry"
description: "A single tree-sitter WASM crash permanently wedges a file out of the code graph: the parser skip-list has no transient/fatal axis and no retry ceiling, and removal is a deliberate no-op. Q2-C1 splits the skip-list into TRANSIENT (re-attempt until attempt_count >= max_retries, default 5) vs FATAL (the current permanent skip), reusing the existing durable attempt_count budget so a transient WASM OOM/timeout self-heals while a genuine poison file never wedges the scan. This deliberately reverses the current must-not-auto-unskip / no-self-heal stance and is isolated as its own sub-phase to gate that explicit owner sign-off."
trigger_phrases:
  - "Q2-C1 parser transient fatal skip-list"
  - "code graph parser bounded retry max_retries"
  - "tree-sitter WASM crash poison file wedge"
  - "parser skip-list auto-unskip self-heal reversal"
  - "attempt_count durable retry budget code graph"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/002-code-graph/007-parser-resilience"
    last_updated_at: "2026-06-19T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Author Q2-C1 parser-resilience impl sub-phase spec from 028/002 research"
    next_safe_action: "Obtain owner sign-off on reversing no-self-heal, then implement the transient/fatal split"
    blockers:
      - "Reverses the documented must-not-auto-unskip stance — needs explicit owner sign-off before build"
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
      - "Which concrete error classes count as TRANSIENT (WASM OOM, timeout, deadline-abort) vs FATAL?"
      - "Does owner sign-off approve reversing the must-not-auto-unskip / no-self-heal stance?"
    answered_questions:
      - "Q2-C1 is PENDING — not in 030 §14 (only Q4-C1 shipped for Code Graph)"
      - "The durable attempt_count column already persists the retry budget across restarts"
---

# Feature Specification: Code Graph Q2-C1 — Transient/Fatal Parser Skip-List with Bounded Retry

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Draft |
| **Disposition** | PENDING — owner sign-off gated (REQ-000) |
| **Created** | 2026-06-19 |
| **Branch** | `system-speckit/027-xce-research-based-refinement` |
| **Parent Phase** | `system-spec-kit/028-memory-search-intelligence/002-code-graph` (research) |
| **Parent Packet** | `system-spec-kit/028-memory-search-intelligence` |
| **Subsystem** | Code Graph — structural retrieval intelligence |
| **Candidates** | Q2-C1 / `Q2-C1-parser-transient-fatal` (one candidate, two label forms) |
| **Shipped In** | None — PENDING (see §7) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
A single crashing file is permanently removed from the code graph with no bounded-retry escape. The parser skip-list classifies files only by tree-sitter WASM crash **cohort** — `SkipListErrorClass = 'B1' | 'B2' | 'OTHER'` — which is a crash taxonomy, **not** a retry policy [CONFIRMED: `parser-skip-list.ts:9,27-35`; research iter-002 finding 8]. Adding a file is an idempotent upsert that only bumps `attempt_count` [CONFIRMED: `parser-skip-list.ts:78-91`]; there is **no `max_retries` ceiling**, **no transient-leaves-pending** semantics, and removal is an **intentional permanent no-op** — `recordSuccess()` is `@deprecated` with an empty body, documented "must not auto-unskip… or imply self-heal support" [CONFIRMED: `parser-skip-list.ts:93-97`]. So a file that crashes the WASM parser **once** — even for a transient reason like an OOM, a timeout, or a deadline-abort — is skipped **forever** with no path back into the graph short of manual review.

The parse-error catch that feeds the skip-list flattens every failure into a single `parseHealth:'error'` shape with no transient/fatal distinction [CONFIRMED: `structural-indexer.ts:1254-1262` per research; verified live at the catch block returning `parseHealth:'error'` + `parseErrors`]. The external aionforge consolidation model treats this exact failure mode differently: `PassError::Transient` (down embedder, rate limit, timeout) leaves the item **`raw`** so it retries; `PassError::Fatal` **or** a transient that exceeds `max_retries` (default 5) marks it **`failed`** — retained, audited, excluded, and later ticks **proceed past it** so a poison pill never wedges the pipeline. Crucially, the attempt count is read from the **durable** failed-audit trail, not memory, so a crash does not refresh the retry budget [CONFIRMED: `external/aionforge-memory-development/docs/consolidation.md:60-68`; research iter-002 finding 9].

### Purpose
Give the code-graph skip-list a **transient/fatal axis** with a **bounded retry ceiling**, so a transient WASM crash self-heals on a later scan while a genuine poison file is permanently quarantined — and in **neither** case does the failing file wedge the scan for any other file. Reuse the **existing durable `attempt_count` column** as the persistent retry budget (it already survives restarts via SQLite, matching aionforge's "durable audit trail, not in-memory" property [CONFIRMED: `consolidation.md:66-68`]), so the change is bounded to the skip-list policy and its one feeding catch site.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope — one candidate (PENDING, owner-sign-off gated)
- **Q2-C1 / `Q2-C1-parser-transient-fatal`** (Code Graph; M/M; BUILD — policy change): split the skip-list semantics into:
  - **`TRANSIENT`** (WASM OOM, timeout, deadline-abort, and similar recoverable conditions) → the file is left **eligible** and re-attempted on the next scan **until `attempt_count >= max_retries`** (default **5**), at which point it is promoted to FATAL.
  - **`FATAL`** (genuine unparseable/poison content, or a transient that exhausted `max_retries`) → the current permanent skip, manual-review-only.
- Reuse the existing `attempt_count` column (`parser-skip-list.ts:78-91`) as the **durable** retry budget — no in-memory counter, so a mid-scan crash does **not** hand the file a fresh budget [CONFIRMED: `consolidation.md:66-68`].
- Classify at the **parse-error catch site** that already produces `parseHealth:'error'` (`structural-indexer.ts:1254-1262`), mapping the caught error to `TRANSIENT` vs `FATAL` before it reaches `addToSkipList`.
- Preserve **poison-pill isolation**: the scan **proceeds past** the failing file regardless of classification, so one file can never wedge the others (this is already true at the catch site — the failure returns an empty-node parse result rather than aborting the scan; Q2-C1 keeps that invariant and adds the retry axis on top).
- A regression test proving (a) a TRANSIENT file is re-attempted and self-heals when it next parses cleanly, (b) a TRANSIENT file that exhausts `max_retries` is promoted to FATAL and then permanently skipped, and (c) a FATAL file is skipped from the first failure.

### Out of Scope
- **Q2-C2** (content-address edge endpoints / decouple symbol ID from path) — L/high-conflict; the path-coupling is load-bearing for `replaceNodes(fileId, …)` reindex granularity [CONFIRMED: research iter-002 finding 11]. Owned by a later Code-Graph phase, not this one. - It is a different fragility (rename-survival), not the poison-file wedge.
- **Q1-C1 / Q1-C2 / Q6-C1** (bi-temporal `valid_at`/`invalid_at` columns, `SUPERSEDES` rename edges, the hard generation watermark) — they share the `code-graph-db.ts` reindex transaction boundary and a SCHEMA_VERSION migration; tracked under sibling `002-code-graph` impl sub-phases. - Q2-C1 needs no schema migration (it reuses an existing column), so it ships independently of that cluster [CONFIRMED: research iter-002 finding 10].
- **Q4-C1** (rank-time trust multiplier) — already **SHIPPED** in 030 (`002-code-graph` Q4-C1 row); unrelated rank-time path. - Read-time ranking, not scan-time resilience.
- The Deep-Loop **fan-out transient/fatal retry** (`fanout-run.cjs`) — the orchestration-layer analogue of this same pattern; tracked under `004-deep-loop`. - Same transient/fatal shape, different subsystem and seam [CONFIRMED: synthesis/01-go-candidates.md "Fan-out transient/fatal retry" row].
- Changing the B1/B2/OTHER cohort labels — they become **orthogonal** to the new transient/fatal axis and are left intact [CONFIRMED: research iter-002 finding 10].

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-code-graph/mcp_server/lib/parser-skip-list.ts` | Modify | Add a `transient`/`fatal` axis and a `max_retries` ceiling (default 5); a TRANSIENT entry below the ceiling stays eligible for re-attempt; an exhausted TRANSIENT promotes to FATAL; reuse the existing durable `attempt_count` budget. Lift the permanent no-op `recordSuccess` to a real "successful parse clears a TRANSIENT entry" path (the deliberate reversal). |
| `.opencode/skills/system-code-graph/mcp_server/lib/structural-indexer.ts` | Modify | At the parse-error catch (`:1254-1262`), classify the caught error as TRANSIENT vs FATAL before it reaches `addToSkipList`; keep the scan proceeding past the failing file. |
| `.opencode/skills/system-code-graph/mcp_server/lib/code-graph-db.ts` | Modify (additive) | If the `parser_skip_list` table needs a `retry_class` (transient/fatal) column or a CHECK-vocab extension, declare it additively (`:203-211`); a `max_retries` ceiling can live in config rather than schema. |
| `.opencode/skills/system-code-graph/mcp_server/tests/*.vitest.ts` | Create | Transient-self-heal, transient-exhaustion→fatal, fatal-from-first-failure, and poison-pill-isolation (scan proceeds) tests. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-000 | **Owner sign-off on reversing the no-self-heal stance.** | The documented "must not auto-unskip… or imply self-heal" contract (`parser-skip-list.ts:93-97`) is a deliberate stance; Q2-C1 reverses it for the TRANSIENT class only. Implementation MUST NOT begin until the owner explicitly approves the reversal. This sub-phase is isolated specifically to gate that decision. |
| REQ-001 | A TRANSIENT failure is re-attempted on later scans, bounded by `max_retries` (default 5). | A file skipped as TRANSIENT with `attempt_count < max_retries` remains **eligible** on the next scan; a unit test asserts it is re-parsed rather than skipped. Seam: `parser-skip-list.ts:78-91` (durable `attempt_count`). |
| REQ-002 | A TRANSIENT failure that reaches `max_retries` is promoted to FATAL (permanent skip). | A file that fails TRANSIENT `max_retries` times is reclassified FATAL and thereafter skipped without re-attempt; the retry budget is read from the durable `attempt_count`, so a mid-scan crash does NOT reset it [CONFIRMED: `consolidation.md:66-68`]. |
| REQ-003 | A FATAL failure is permanently skipped from the first occurrence. | A file classified FATAL on first failure is skipped immediately with no re-attempt — the current behavior, preserved for the FATAL class. |
| REQ-004 | Poison-pill isolation: the scan proceeds past the failing file regardless of classification. | A scan containing one crashing file (TRANSIENT or FATAL) still indexes every other file; a test asserts the non-failing files produce nodes/edges while the failing file is skipped. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | A successful parse clears a TRANSIENT skip entry (the deliberate self-heal). | The lifted `recordSuccess` removes (or marks healed) a TRANSIENT entry on a clean re-parse; a FATAL entry is NOT auto-cleared (manual-review-only). A test proves a TRANSIENT entry self-heals and a FATAL entry does not. |
| REQ-006 | The B1/B2/OTHER cohort labels remain orthogonal and intact. | The crash-cohort `error_class` is preserved; the new transient/fatal axis is an independent dimension, not a replacement [CONFIRMED: research iter-002 finding 10]. |
| REQ-007 | Error→class mapping is explicit and documented. | The TRANSIENT set (e.g. WASM OOM, timeout, deadline-abort) vs FATAL set is enumerated in plan.md and asserted by a mapping test; an unknown error defaults to the **safe** side (FATAL, manual-review) rather than looping forever — fail-closed on ambiguity. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A transient WASM crash (OOM/timeout) self-heals — the file re-enters the graph on a later clean scan — while a genuine poison file is permanently quarantined after at most `max_retries` attempts (REQ-001/002/003/005 met).
- **SC-002**: No single failing file wedges the scan for any other file, in either classification (REQ-004 met — the existing isolation invariant is preserved, not regressed).
- **SC-003**: The retry budget is durable — a crash mid-scan does not hand a TRANSIENT file a fresh `max_retries` (REQ-002 met; budget read from the persisted `attempt_count`).
- **SC-004**: `validate.sh --strict` on this phase folder passes; typecheck + focused parser-skip-list / structural-indexer tests green.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | **Reverses a deliberate doctrine** — "must not auto-unskip / no self-heal" was an intentional stance, not an oversight | High — silently flipping it would violate an explicit contract | REQ-000 gates the build on explicit owner sign-off; this sub-phase exists to isolate that decision [CONFIRMED: `parser-skip-list.ts:93-97`; research iter-002 finding 10 "needs explicit owner sign-off"] |
| Risk | A genuinely-fatal file mis-classified TRANSIENT loops up to `max_retries` times | Med — wasted parse attempts, not a wedge | Bound by `max_retries` (default 5); ambiguous/unknown errors default to FATAL (REQ-007, fail-closed); each attempt is already isolated so it cannot wedge other files |
| Risk | A transient file mis-classified FATAL is permanently lost until manual review | Med — recall gap, current behavior | This is strictly no worse than today (today every crash is permanent); the TRANSIENT class is a net improvement, and FATAL stays manual-review-recoverable |
| Risk | In-memory retry counting would reset on a crash, breaking the bounded-retry guarantee | Med — a crash-looping file could retry indefinitely | Reuse the **durable** `attempt_count` column, never an in-memory counter [CONFIRMED: `consolidation.md:66-68`; `parser-skip-list.ts:78-91`] |
| Dependency | Existing durable `attempt_count` column on `parser_skip_list` | Required as the retry budget | Present and already bumped on upsert (`parser-skip-list.ts:78-91`); no schema migration needed for the counter itself |
| Dependency | The parse-error catch site that flattens failures to `parseHealth:'error'` | Required as the classification point | Present at `structural-indexer.ts:1254-1262`; Q2-C1 inserts the transient/fatal mapping there |
| Dependency | Owner sign-off (REQ-000) | Gates all implementation | Out of band — secure before any code change |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- **Owner sign-off (REQ-000):** does the owner approve reversing the documented "must not auto-unskip / no self-heal" stance for the TRANSIENT class? This is the gating decision; implementation does not begin until it is answered.
- **TRANSIENT vs FATAL taxonomy:** which concrete tree-sitter/WASM error signatures map to TRANSIENT (recoverable: OOM, timeout, deadline-abort) vs FATAL (unparseable content)? Research names the categories [CONFIRMED: `consolidation.md:60-68`] but the exact code-graph error-string mapping must be enumerated at build (REQ-007). Default the ambiguous case to FATAL (fail-closed).
- **`max_retries` value:** default **5** mirrors aionforge [CONFIRMED: `consolidation.md:60-68`]; should it be configurable (env/config) rather than a constant? Sub-phase proposes config, not schema.
- **Schema touch:** does the transient/fatal axis need a new `retry_class` column on `parser_skip_list` (`code-graph-db.ts:203-211`), or can it ride the existing `error_class` CHECK-vocab orthogonally? Resolve at build; keep it additive either way.
- **Status:** Q2-C1 is **PENDING** — it is **not** in 030 spec §14 (the only Code-Graph candidate shipped in Wave-0 was Q4-C1). No commit hash exists for this candidate.
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:related-docs -->
## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Implementation Summary**: See `implementation-summary.md`
- **Research (PRIMARY)**: `../research/research.md`, `../research/iterations/iteration-002.md` (Q2 findings 8/9/10, candidate `cand-Q2-C1`), `../research/deltas/iter-002.jsonl` (`f2-8`, `cand-Q2-C1`), `../research/findings-registry.json` (`finding-4-14-q2-c1-transient-fatal-parser-retry`).
- **Roadmap**: `../../research/roadmap.md` (Spine 6 "Idempotent Async Consolidation + Crash-Safe Recovery" — Q2-C1 row; "owner sign-off" note).
- **Synthesis**: `../../research/synthesis/01-go-candidates.md` (the Deep-Loop fan-out transient/fatal sibling row), `../../research/synthesis/03-corrections-caveats-and-residuals.md`.
- **External source**: `../../external/aionforge-memory-development/docs/consolidation.md:60-68, 84-90` (Transient/Fatal, `max_retries=5`, durable failed-audit count, poison-pill isolation).
- **Wave-0 shipped record**: `../../../030-memory-search-intelligence-impl/spec.md` §14 (Q2-C1 is absent — PENDING; Code-Graph Q4-C1 = row 13).
<!-- /ANCHOR:related-docs -->
