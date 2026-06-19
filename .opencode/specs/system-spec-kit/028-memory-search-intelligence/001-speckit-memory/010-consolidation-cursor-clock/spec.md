---
title: "Feature Specification: Memory Consolidation Cursor + Clock (C4-A → C4-C → C-G1 chain + crash-safety hardening)"
description: "Make the Spec-Kit Memory MCP's already-half-built async consolidation path durable and clock-driven: default-on idempotency receipts, an explicit episode->consolidation cursor with a per-item state machine, a cadence/clock driver around the existing save-triggered cursor, plus the contiguous-prefix-stop, durable-retry, transport-idempotency and dead-letter crash-safety hardening that the cursor needs."
trigger_phrases:
  - "memory consolidation cursor"
  - "idempotency receipts default on"
  - "consolidation clock driver"
  - "contiguous prefix stop consolidation"
  - "enrichment dead letter retry budget"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/001-speckit-memory/010-consolidation-cursor-clock"
    last_updated_at: "2026-06-19T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Authored impl sub-phase spec from 028 research (10 candidates, all PENDING)"
    next_safe_action: "Sequence C4-A scoping fix first, then C4-C cursor, then C-G1 clock"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "decision-record.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-19-028-001-010-consolidation-cursor-clock"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Does the C4-A flag stay overloaded (near-dup hints) or split into two flags before default-on?"
      - "Does durable-retry get the Transient/Fatal split only, or also durability (conflicts with intentional restart-self-heal)?"
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
<!-- SPECKIT_LEVEL: 3 -->

# Feature Specification: Memory Consolidation Cursor + Clock (C4-A → C4-C → C-G1 chain + crash-safety hardening)

## EXECUTIVE SUMMARY

The Spec-Kit Memory MCP already ships most of an idempotent async-consolidation machine — idempotency receipts, a deferred/background enrichment seam, and a durable cadence-gated consolidation cursor — but the pieces are flag-gated OFF, save-triggered only, and not crash-safe end to end. This sub-phase lands the longest Memory chain from packet 028's research: **C4-A** (receipts default-on) → **C4-C** (explicit episode→consolidation cursor with a per-item state machine) → **C-G1** (a clock-driver around the existing cursor), plus the crash-safety hardening (`M-contiguous-prefix-stop`, `M-durable-retry-budget`, `Transport-idempotency`, `Enrichment-retry-budget-deadletter`) and two consolidation-quality candidates (`M-detail-retention-guard`, `LT-turn-cadence-trigger`). One candidate (`M-capture-near-dup-verdict`) is carried only to record its REFUTED disposition.

**Key Decisions**: All 10 candidates are PENDING (none shipped in the 030 Wave-0 record); the idempotent-async pattern built here is the reuse template for the 003 advisor projection rebuild.

**Critical Dependencies**: C4-A scoping fix (DEFERRED from 030 after it broke 11 `handleMemoryUpdate` tests) is the chain head; C-G1 depends on both C4-A (so clock-replays don't double-apply) and the C4-C cursor.

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-06-19 |
| **Branch** | `system-speckit/028-memory-search-intelligence` |
| **Parent Packet** | system-spec-kit/028-memory-search-intelligence/001-speckit-memory |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The Memory MCP's async-consolidation path is half-built and not crash-safe. Idempotency receipts exist but are flag-gated OFF (`SPECKIT_MEMORY_IDEMPOTENCY`), so a commit-then-die replay can duplicate the secondary index; a durable cadence-gated consolidation cursor exists (`consolidation.ts`) but is save-triggered only, never clock-driven; the boot-time enrichment backfill replays stuck work on every boot with no per-row attempt cap or terminal `failed` state, so a poison-pill re-enriches forever; and the enrichment retry budget is in-memory/ephemeral, granting a fresh budget on every restart.

### Purpose
Make the existing consolidation machinery durable and clock-driven by landing the C4-A → C4-C → C-G1 chain plus its crash-safety hardening, each as a small, independently reversible, individually tested change — establishing the idempotent-async primitive (durable cursor + bounded retry + idempotency token) that the 003 advisor projection rebuild reuses.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- **The consolidation chain (C4-A → C4-C → C-G1)** — receipts default-on with save/update-path scoping; an explicit episode→consolidation cursor with a per-item `raw|in_progress|consolidated|failed` state machine over the existing background/deferred seam; a cadence/clock driver around the existing save-triggered cursor.
- **Crash-safety hardening on the same cursor** — `M-contiguous-prefix-stop` (stop at first non-consolidating item; cursor tracks only the contiguous consolidated prefix; reset `in_progress`→`raw` on startup), `M-durable-retry-budget` (Transient/Fatal classification, store-counted attempts), `Transport-idempotency` (thread the idempotency token through daemon IPC into the save handler), `Enrichment-retry-budget-deadletter` (bound the boot-time enrichment replay; add a terminal `failed` state).
- **Consolidation quality** — `M-detail-retention-guard` (anti-lossy-summary guard), `LT-turn-cadence-trigger` (persistent turns_counter cadence gate).
- **Disposition record** — `M-capture-near-dup-verdict` carried only to document that the gap is already closed (REFUTED), so it is not re-attempted.

### Out of Scope
- The other Memory candidates (C2-x router, C3-x bi-temporal, C5/C6/C-X1 determinism/decay, C7/C8/C9) — covered by sibling 028/001 impl sub-phases.
- The other three subsystems (code-graph 002, skill-advisor 003, deep-loop 004) — except that 003's advisor projection rebuild reuses the idempotent-async primitive built here (a cross-subsystem reference, not built in this folder).
- Adopting a per-turn episode model — internal Memory is doc/chunk-granular; the capture-side candidates graft onto the existing chunk-save path, they do NOT introduce an immutable episode substrate (research scope decision O13-01, O18-01).
- Modifying the external reference systems under `028/external/`.
- Any measured before/after benefit numbers — research banked zero benchmarks; benchmark-gated candidates are flagged, not shipped on a promised delta.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `mcp_server/lib/storage/idempotency-receipts.ts` | Modify | C4-A: default-on receipts, scoped to save vs update path |
| `mcp_server/handlers/memory-save.ts` | Modify | C4-A wiring (`:3547,:3655`); Transport-idempotency token plumb (`:3775`); near-dup flag split if needed (`:2729-2738`) |
| `mcp_server/handlers/memory-index.ts` | Modify | C4-C cursor state machine over the deferred/background seam (`:293-294,:1376-1377`) |
| `mcp_server/lib/cognitive/consolidation.ts` | Modify | C4-C/C-G1: per-item state, contiguous-prefix-stop tick, startup reset around the existing cursor (`:518-548`) |
| `mcp_server/lib/cognitive/session-manager.ts` | Modify | C-G1: clock/interval driver via the registerInterval host (`:234-283`) |
| `mcp_server/lib/cognitive/pressure-monitor.ts` | Modify | LT-turn-cadence-trigger: persistent turns_counter cadence gate |
| `mcp_server/lib/enrichment/retry-budget.ts` | Modify | M-durable-retry-budget: Transient/Fatal split, store-counted attempts (`:8-13,:44-46`) |
| `mcp_server/handlers/save/post-insert.ts` | Modify | Enrichment-retry-budget-deadletter: bounded boot-replay + terminal `failed` (`:289-298`) |
| `mcp_server/handlers/pe-gating.ts` | Modify | M-detail-retention-guard: anti-lossy-summary guard (entity-retention + mean-confidence) |
| `bin/launcher-session-proxy.cjs` | Modify | Transport-idempotency: forward the token through daemon IPC (`:151`) |
| tests alongside each seam | Create/Modify | Per-candidate unit tests |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | C4-A: receipts default-on without breaking the update path | `SPECKIT_MEMORY_IDEMPOTENCY` default-on scoped so the `handleMemoryUpdate` suite stays green (the 030 deferral broke 11 of 55); replay re-derives the same content-addressed id; the overloaded near-dup-hint coupling is split or explicitly accepted |
| REQ-002 | C4-C: explicit per-item consolidation state | Each item carries `raw|in_progress|consolidated|failed`; the cursor advances over the existing background/deferred seam, never silently re-runs a `consolidated` item |
| REQ-003 | M-contiguous-prefix-stop: prefix-only cursor + startup reset | The tick stops at the first non-consolidating item; the cursor tracks only the contiguous consolidated prefix (never jumps a held-back failure); startup flips `in_progress`→`raw` |
| REQ-004 | Enrichment-retry-budget-deadletter: bounded boot-replay | The boot-time enrichment replay is bounded by a per-row attempt cap; a poison-pill reaches a terminal `failed` state and is excluded from the queue (no infinite re-enrich) |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | C-G1: clock-driver around the existing cursor | A registerInterval-hosted driver advances the cursor on a clock (not just on save); missed-tick behavior is Skip; the tick logs-and-continues, never fatal; sits on C4-A so clock-replays do not double-apply |
| REQ-006 | M-durable-retry-budget: Transient/Fatal classification | Retry budget classifies Transient vs Fatal; attempts counted from the store (not the in-memory `BoundedMap`) so a restart does not grant a fresh budget — OR the Transient/Fatal split ships alone if durability conflicts with the documented restart-self-heal design (user decision) |
| REQ-007 | Transport-idempotency: token through IPC | The idempotency token is threaded through daemon IPC into the save handler so a commit-then-die replay is deduped before it duplicates the secondary index |
| REQ-008 | LT-turn-cadence-trigger: turn-count cadence gate | A persistent `turns_counter` gates background consolidation work (`turns_counter % frequency == 0`, default 5); distinct from the existing token-ratio pressure gate and cron retention sweep |
| REQ-009 | M-detail-retention-guard: anti-lossy-summary guard | A derived summary is skipped-not-written unless it names ≥ `entity_retention_threshold` (default 0.9) of distinct source entities AND mean source confidence ≥ 0.6 — gated on building entity confidence scoring first (no confidence field exists today) |
| REQ-010 | M-capture-near-dup-verdict: record disposition only | Documented REFUTED: synchronous near-dup already runs inline on the hot save path; no new work — included so it is not re-attempted |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The C4-A → C4-C → C-G1 chain ships in dependency order, each candidate independently reversible and unit-tested; C4-A no longer regresses the `handleMemoryUpdate` suite.
- **SC-002**: The consolidation cursor is crash-safe: a mid-tick crash leaves a recoverable state (startup reset), a poison-pill reaches a terminal `failed` (no infinite replay), and a commit-then-die does not duplicate the secondary index.
- **SC-003**: Every candidate's STATUS is explicit (PENDING + gate, or REFUTED) with research citations; benchmark-gated and design-conflicting candidates are flagged, not shipped on an unmeasured delta.
- **SC-004**: Typecheck, build, focused tests, and `validate.sh --strict` on this folder pass.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | C4-A flag is overloaded (also enables near-dup hints, `near-duplicate.ts:95`) | Default-on turns on a second caller-visible change | Split the flag or explicitly accept the near-dup hint as part of default-on (decision-record ADR-001) |
| Risk | M-durable-retry durability conflicts with the documented intentional process-restart self-heal | Building durability fights the design | Ship the Transient/Fatal split alone (clean); durability is a separate user decision |
| Risk | M-detail-retention-guard premise partly refuted — `ExtractedEntity` has no confidence field | The ≥0.9-entities AND mean-conf≥0.6 guard is not computable today | Build entity confidence scoring first, or defer the guard; it is benchmark-gated either way |
| Risk | No candidate has a measured benefit number | Ship for correctness/reversibility, not a promised delta | All leverage/effort are structural inference (028 GO-evidence caveat) |
| Dependency | C4-A scoping fix (chain head) | C4-C/C-G1/Transport-idempotency all sit on the receipt mechanism | Land C4-A first; its content-addressed id is reused by C-G1 and Transport-idempotency |
| Dependency | C4-C cursor (mid-chain) | C-G1 clock + M-contiguous-prefix-stop ride the cursor | Build the per-item state machine before the clock |
| Dependency | 003 advisor projection rebuild | Reuses the idempotent-async primitive built here | Build the shared primitive once; the advisor reference is cross-packet, not in this folder |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The clock-driver tick is bounded and amortized via the turns_counter cadence gate (default frequency 5) so reorganization cost is spread across turns, not paid synchronously on every save.

### Security
- **NFR-S01**: No new untrusted-input surface — the consolidation path operates over already-stored memory rows; the recall-trust/escaper work is out of scope (sibling sub-phase).

### Reliability
- **NFR-R01**: A crash at any point in the consolidation tick is recoverable: the cursor tracks only the contiguous consolidated prefix, startup resets `in_progress`→`raw`, and a poison-pill reaches a terminal `failed` state rather than re-enriching forever.

---

## 8. EDGE CASES

### Data Boundaries
- Empty input: a tick with no `raw` items is a no-op; an empty/no-new-work cadence is valid, not a failure.
- Maximum length: the boot-time enrichment replay is bounded by the per-row attempt cap, so a large backlog of poison-pills cannot wedge the scan.

### Error Scenarios
- Crash mid-tick: startup reset flips `in_progress`→`raw`; the contiguous-prefix cursor never advances past a held-back failure.
- Commit-then-die: the idempotency receipt (stored after+outside the save txn today) replays as a dedup no-op once the token is threaded through IPC.
- Transient vs Fatal: a Transient error (timeout/WASM OOM analogue) re-attempts up to the store-counted cap; a Fatal error escalates immediately to terminal `failed`.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 18/25 | Files: ~10 seams, Systems: consolidation + enrichment + IPC transport |
| Risk | 18/25 | Breaking: C4-A regressed 11 update tests; durable-retry design-conflict; near-dup flag coupling |
| Research | 14/20 | Investigation done (028 200-iter campaign); residual = benchmark/confidence-scoring gates |
| Multi-Agent | 6/15 | Workstreams: chain (C4-A→C4-C→C-G1) + hardening + quality |
| Coordination | 9/15 | Dependencies: strict chain ordering + 003 cross-packet reuse |
| **Total** | **65/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | C4-A default-on breaks the update path again | H | M | Scope receipts to the save path; keep the `handleMemoryUpdate` suite green as a gate |
| R-002 | Durable-retry fights the intentional restart-self-heal design | M | M | Ship Transient/Fatal split alone unless the user approves durability |
| R-003 | M-detail-retention-guard not computable (no entity confidence field) | M | H | Defer or build confidence scoring first; benchmark-gated |
| R-004 | Clock-replays double-apply without C4-A idempotency | H | L | Sequence C-G1 strictly after C4-A |

---

## 11. USER STORIES

### US-001: Crash-safe consolidation (Priority: P0)

**As an** operator, **I want** the consolidation cursor to survive a crash, **so that** a mid-tick failure leaves recoverable state instead of a duplicated index or a silently-skipped item.

**Acceptance Criteria**:
1. Given a crash mid-tick, When the server restarts, Then `in_progress` items flip back to `raw` and the cursor tracks only the contiguous consolidated prefix.

### US-002: No infinite re-enrich (Priority: P0)

**As an** operator, **I want** a poison-pill enrichment row to give up, **so that** the boot-time replay does not re-enrich it forever.

**Acceptance Criteria**:
1. Given a row that fails enrichment repeatedly, When the per-row attempt cap is reached, Then the row enters a terminal `failed` state and is excluded from the replay queue.

### US-003: Clock-driven consolidation (Priority: P1)

**As an** operator, **I want** consolidation to advance on a clock, **so that** reorganization happens on cadence even without a save, amortized across turns.

**Acceptance Criteria**:
1. Given the clock-driver and a persistent turns_counter, When `turns_counter % frequency == 0` and the interval fires, Then the existing cursor advances once (idempotently), logging-and-continuing on error.

---

## 12. OPEN QUESTIONS

- Does C4-A stay overloaded (default-on also enables near-dup hints at `near-duplicate.ts:95`) or split into two flags before the flip?
- Does M-durable-retry-budget ship the Transient/Fatal split only, or also durability (which conflicts with the documented intentional restart-self-heal design)?
- Is M-detail-retention-guard built now (requires building entity confidence scoring first) or deferred until a confidence field exists?
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
- **Parent research phase**: See `../research/research.md`, `../../research/roadmap.md`, `../../research/synthesis/01-go-candidates.md`, `../../research/synthesis/03-corrections-caveats-and-residuals.md`, `../../research/synthesis/04-sibling-and-cross-cutting.md`
- **Wave-0 shipped record (DONE evidence)**: See Wave-0 record
