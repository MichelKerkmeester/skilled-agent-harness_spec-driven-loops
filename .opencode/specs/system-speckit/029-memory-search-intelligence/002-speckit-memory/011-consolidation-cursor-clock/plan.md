---
title: "Implementation Plan: Memory Consolidation Cursor + Clock (C4-A → C4-C → C-G1 chain + crash-safety hardening)"
description: "Sequenced approach for landing the longest Memory consolidation chain from packet 028: receipts default-on, an explicit per-item consolidation cursor, a clock-driver and the crash-safety hardening that the cursor needs, each independently reversible and unit-tested in strict dependency order."
trigger_phrases:
  - "consolidation cursor plan"
  - "c4-a c4-c c-g1 sequencing"
  - "idempotent async consolidation plan"
  - "enrichment dead letter plan"
  - "durable retry budget plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/029-memory-search-intelligence/002-speckit-memory/011-consolidation-cursor-clock"
    last_updated_at: "2026-07-04T17:51:02.602Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Authored plan: chain sequencing + shared-infra deps + per-candidate status"
    next_safe_action: "Implement C4-A scoping fix (chain head)"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-19-028-001-010-consolidation-cursor-clock"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Memory Consolidation Cursor + Clock (C4-A → C4-C → C-G1 chain + crash-safety hardening)

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (mcp_server), CommonJS (`.cjs` launcher) |
| **Framework** | Spec-Kit Memory MCP daemon |
| **Storage** | SQLite (`memory_index`, `consolidation_state`, `post_insert_enrichment_status`, idempotency receipts table) |
| **Testing** | vitest (focused per-seam suites incl. `handleMemoryUpdate`) |

### Overview
Land the longest Memory chain from packet 028 in strict dependency order: C4-A (receipts default-on, save/update-path scoped) is the chain head whose content-addressed id and receipt mechanism C-G1 and Transport-idempotency reuse. C4-C adds an explicit per-item consolidation state machine over the existing background/deferred seam. C-G1 wraps the existing save-triggered cursor in a clock-driver. The crash-safety candidates (contiguous-prefix-stop, durable-retry, transport-idempotency, dead-letter) harden that same cursor. All candidates are PENDING, none shipped in the 030 Wave-0 record (C4-A was explicitly DEFERRED there).
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented (spec.md complete)
- [ ] Success criteria measurable (SC-001..004)
- [ ] Dependencies identified (chain order + 003 cross-packet reuse)

### Definition of Done
- [ ] All P0 acceptance criteria met (REQ-001..004)
- [ ] Focused tests passing incl. the `handleMemoryUpdate` regression gate
- [ ] Docs updated (spec/plan/tasks/checklist/decision-record synchronized)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Idempotent async-consolidation state machine over an existing durable cursor, content-addressed identity + bounded retry + per-item state, reused as a shared primitive by the 003 advisor projection.

### Key Components
- **Idempotency receipts** (`idempotency-receipts.ts`): content-derived `{operation, contentHash, requestFingerprintHash, payloadHash}` receipts with `miss|replay|conflict`. The C4-A flip + content-addressed id is the chain head.
- **Consolidation cursor** (`consolidation.ts:518-548`): durable cadence-gated cursor (`consolidation_state.last_run_at`, weekly interval, idempotent locked cycle), already built, save-triggered only.
- **Background/deferred enrichment seam** (`memory-index.ts:293-294,:1376-1377`, `post-insert.ts:289-298`): where C4-C's per-item `raw|in_progress|consolidated|failed` state and the dead-letter terminal state live.
- **Clock host** (`session-manager.ts:234-283` registerInterval): where C-G1's interval driver attaches.
- **Retry budget** (`retry-budget.ts:8-13,:44-46`): in-memory `BoundedMap` today. M-durable-retry adds Transient/Fatal + store-counted attempts.

### Data Flow
save → (C4-A receipt dedup) → deferred enrichment write (`raw`) → C4-C cursor picks up → consolidation tick (`in_progress`→`consolidated`/`failed`) → contiguous-prefix cursor advance. The C-G1 clock-driver fires the same tick on cadence, gated by the LT turns_counter.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Applies because C4-A touches a public save/update path and several candidates touch persistence/schema boundaries.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `idempotency-receipts.ts` | flag-gated receipt store | update (default-on, scoped) | `handleMemoryUpdate` suite green. Replay re-derives same id |
| `memory-save.ts:3547,3655,3775` | save handler + receipt + IPC token sink | update | unit test: commit-then-die replay deduped |
| `memory-update.ts` (`handleMemoryUpdate`) | update path consumer of the flag | not-broken (regression gate) | 55/55 update tests stay green |
| `near-duplicate.ts:95` | overloaded under the same flag | update OR explicitly-accepted | decision-record ADR-001 |
| `consolidation.ts:518-548` | durable save-triggered cursor | update (per-item state + clock) | startup-reset + prefix-stop tests |
| `post-insert.ts:289-298` | boot enrichment replay | update (bounded + terminal failed) | poison-pill terminates test |
| `retry-budget.ts` | in-memory ephemeral budget | update (Transient/Fatal, store-counted optional) | restart does not grant fresh budget |
| `launcher-session-proxy.cjs:151` | daemon IPC | update (forward token) | token reaches the handler |

Required inventories:
- Consumers of the `SPECKIT_MEMORY_IDEMPOTENCY` flag: `rg -n 'SPECKIT_MEMORY_IDEMPOTENCY' mcp_server` (catches the near-dup-hint coupling at `near-duplicate.ts:95` + the receipt path at `memory-index.ts:697`).
- Consumers of the deferred/background status column: `rg -n 'post_insert_enrichment_status|deferred|in_progress' mcp_server`.
- Invariant (apply-once): a re-run over already-`consolidated` items must be a no-op. A replay must re-derive the same content-addressed id.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Chain head + scoping (C4-A)
- [ ] Read the receipt + update-path seams, reproduce the 11-test `handleMemoryUpdate` regression with the flag on
- [ ] Scope receipts to the save path (decouple from the update path / split the near-dup-hint coupling per ADR-001)
- [ ] Default-on with the content-addressed id, verify replay = dedup no-op

### Phase 2: Cursor + state machine (C4-C) + prefix/dead-letter hardening
- [ ] Add per-item `raw|in_progress|consolidated|failed` over the deferred seam
- [ ] M-contiguous-prefix-stop: stop at first non-consolidating item, prefix-only cursor, startup `in_progress`→`raw` reset
- [ ] Enrichment-retry-budget-deadletter: bound boot-replay, terminal `failed`, queue-exclude poison-pill
- [ ] M-durable-retry-budget: Transient/Fatal split (store-counted attempts pending user decision)

### Phase 3: Clock + cadence + quality + transport, then verify
- [ ] C-G1: registerInterval driver around the existing cursor (Skip missed-tick, log-and-continue, sits on C4-A)
- [ ] LT-turn-cadence-trigger: persistent turns_counter gate (`% frequency`, default 5)
- [ ] Transport-idempotency: thread the token through IPC into the handler
- [ ] M-detail-retention-guard: anti-lossy guard (gated on entity confidence scoring) OR defer
- [ ] M-capture-near-dup-verdict: record REFUTED disposition (no code)
- [ ] tsc/build + focused tests + `validate.sh --strict`, adversarial review, scoped commits
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | receipt replay/conflict, update-path regression, cursor state transitions, prefix-stop, startup reset, dead-letter termination, Transient/Fatal, turns_counter gate | vitest |
| Integration | commit-then-die replay across IPC, clock-driver tick advancing the existing cursor | vitest + daemon harness |
| Manual | health output gauges (`lag`/pending/failed if surfaced), a forced poison-pill backlog | CLI |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| C4-A receipt mechanism | Internal | Green (exists, flag-off) | C-G1 + Transport-idempotency cannot rely on content-addressed dedup |
| C4-C cursor (consolidation.ts) | Internal | Green (cursor exists, save-triggered) | C-G1 clock + prefix-stop have nothing to drive |
| Entity confidence scoring | Internal | Red (no confidence field on `ExtractedEntity`) | M-detail-retention-guard not computable → defer |
| 003 advisor projection | Cross-packet | N/A | Reuses the shared idempotent-async primitive (reference only) |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: any candidate regresses an existing suite (esp. `handleMemoryUpdate`) or the clock-driver double-applies.
- **Procedure**: each candidate is a scoped, independently reversible commit on the 028 branch. Revert the single hunk. C4-A remains flag-reversible (`SPECKIT_MEMORY_IDEMPOTENCY` back to off) with inert receipt-table residue (TTL-pruned).
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (C4-A chain head) ──► Phase 2 (C4-C cursor + hardening) ──► Phase 3 (C-G1 clock + cadence + transport + verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Phase 1 (C4-A) | None | Phase 2, Transport-idempotency, C-G1 |
| Phase 2 (C4-C + prefix/dead-letter/durable-retry) | Phase 1 | C-G1 clock |
| Phase 3 (C-G1 + LT cadence + transport + quality) | Phase 1, Phase 2 | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Phase 1 (C4-A scoping) | Med | scoping fix + regression gate |
| Phase 2 (cursor + hardening) | Med-High | per-item state machine + crash-safety |
| Phase 3 (clock + cadence + transport + quality) | Med | clock-driver + token plumb + guards |
| **Total** | | **the longest Memory chain (S→M per candidate, M/L for the cursor)** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] `handleMemoryUpdate` suite captured green BEFORE flipping C4-A (baseline)
- [ ] `SPECKIT_MEMORY_IDEMPOTENCY` confirmed reversible (inert residue)
- [ ] Clock-driver gated behind a flag until idempotency is verified

### Rollback Procedure
1. Revert the single offending scoped commit.
2. For C4-A: set `SPECKIT_MEMORY_IDEMPOTENCY` back off (receipt table persists, TTL-pruned).
3. For C-G1: disable the interval driver (cursor reverts to save-triggered).
4. Re-run the focused suite + `validate.sh --strict`.

### Data Reversal
- **Has data migrations?** No (state columns are additive on existing tables, no SCHEMA_VERSION bump in scope).
- **Reversal procedure**: additive state columns are inert when unused. New `failed` rows are queue-excluded, not destructive.
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌──────────────┐     ┌──────────────────────┐     ┌─────────────────────────┐
│  C4-A        │────►│  C4-C cursor          │────►│  C-G1 clock-driver      │
│ receipts on  │     │  per-item state       │     │  (LT turns_counter gate)│
└──────┬───────┘     └──────┬───────────────┘     └─────────────────────────┘
       │                    │
       │             ┌──────▼──────────────┐
       │             │ M-contiguous-prefix │
       │             │ + dead-letter       │
       │             │ + durable-retry     │
       │             └─────────────────────┘
       └──► Transport-idempotency (token through IPC, reuses the receipt)
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| C4-A | None | content-addressed id + receipt | C4-C, C-G1, Transport-idempotency |
| C4-C | C4-A | per-item consolidation state | C-G1, prefix-stop |
| M-contiguous-prefix-stop | C4-C | crash-safe prefix cursor | None |
| Enrichment-retry-budget-deadletter | C4-C | terminal `failed` state | None |
| M-durable-retry-budget | (independent, pairs with dead-letter) | Transient/Fatal classification | None |
| Transport-idempotency | C4-A | IPC-deduped save | None |
| C-G1 | C4-A, C4-C | clock-driven tick | None |
| LT-turn-cadence-trigger | (pairs with C-G1) | turns_counter gate | None |
| M-detail-retention-guard | entity confidence scoring (Red) | anti-lossy guard | None |
| M-capture-near-dup-verdict | None (REFUTED) | disposition record | None |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **C4-A scoping fix** - chain head - CRITICAL
2. **C4-C cursor state machine** - mid-chain - CRITICAL
3. **C-G1 clock-driver** - chain tail (must sit on C4-A idempotency) - CRITICAL

**Total Critical Path**: C4-A → C4-C → C-G1.

**Parallel Opportunities**:
- M-durable-retry-budget (Transient/Fatal split) and M-detail-retention-guard can be scoped independently of the cursor.
- Transport-idempotency can land any time after C4-A.
- M-capture-near-dup-verdict (disposition record) needs no code and can be written immediately.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | C4-A re-scoped + default-on | `handleMemoryUpdate` 55/55 green, replay deduped | Phase 1 |
| M2 | Cursor crash-safe | startup reset + prefix-stop + dead-letter tests pass | Phase 2 |
| M3 | Clock-driven + cadence-gated | interval tick advances cursor idempotently | Phase 3 |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

See `decision-record.md` for ADR-001 (C4-A flag coupling), ADR-002 (durable-retry vs restart-self-heal) and ADR-003 (cursor reuse, not a new episode model). The detailed records live in that file. This section is the pointer.
