---
title: "Tasks: Memory Consolidation Cursor + Clock (C4-A → C4-C → C-G1 chain + crash-safety hardening)"
description: "Task Format: T### [P?] Description (file path) — per-candidate breakdown for the longest Memory consolidation chain; all candidates PENDING (none shipped in the 030 Wave-0 record)."
trigger_phrases:
  - "consolidation cursor tasks"
  - "c4-a c4-c c-g1 tasks"
  - "enrichment dead letter tasks"
  - "durable retry tasks"
  - "transport idempotency tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/001-speckit-memory/010-010-consolidation-cursor-clock"
    last_updated_at: "2026-06-19T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Authored task breakdown; all 10 candidates PENDING"
    next_safe_action: "Start T010 (C4-A reproduce the update-path regression)"
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
# Tasks: Memory Consolidation Cursor + Clock (C4-A → C4-C → C-G1 chain + crash-safety hardening)

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`

> **Status note:** Every candidate in this sub-phase is PENDING. None shipped in the 030 Wave-0 record. C4-A was explicitly **DEFERRED → Wave-1+** in `030/spec.md §14` (no commit) after flipping `SPECKIT_MEMORY_IDEMPOTENCY` broke 11 `handleMemoryUpdate` tests. C4-C, C-G1 and the hardening candidates were Wave-1/Wave-2 (out of 030 scope). So all task checkboxes are `[ ]`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Read all chain-head seams (`idempotency-receipts.ts`, `memory-save.ts:3547,3655,3775`, the `handleMemoryUpdate` path, `near-duplicate.ts:95`, `memory-index.ts:697`)
- [ ] T002 Capture the baseline `handleMemoryUpdate` suite green (55/0) with the flag OFF — the regression gate
- [ ] T003 [P] Inventory `SPECKIT_MEMORY_IDEMPOTENCY` consumers (`rg -n 'SPECKIT_MEMORY_IDEMPOTENCY' mcp_server`) to confirm the near-dup-hint coupling
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### C4-A — idempotency-receipts default-on (PENDING; gate: save/update-path scoping)
- [ ] T010 Reproduce the 11-test `handleMemoryUpdate` regression with the flag on (confirm root cause = update path + near-dup hint emission)
- [ ] T011 Scope receipts to the save path; decouple or explicitly accept the near-dup-hint coupling per ADR-001 (`idempotency-receipts.ts`; `memory-save.ts:3547,3655`)
- [ ] T012 Default-on with the content-addressed id; verify replay re-derives the same id (dedup no-op) and the update suite stays 55/55
> Research: surviving value = receipt-default-on + content-addressed ids; the "wire replay/conflict into deferred-save" leg was REFUTED (001 iter-27 F27-02; synthesis/03 §A). 030 §14: DEFERRED, no commit.

### C4-C — explicit episode→consolidation cursor + per-item state machine (PENDING; gate: shared-infra on existing cursor)
- [ ] T020 Add per-item `raw|in_progress|consolidated|failed` over the deferred/background seam (`memory-index.ts:293-294,:1376-1377`)
- [ ] T021 Wire the cursor advance to the existing durable cursor without re-running `consolidated` items (`consolidation.ts:518-548`)
> Research: shrunk by 006 (G29-01) — a cadence-gated durable cursor ALREADY exists (`consolidation.ts`, `consolidation_state.last_run_at`, weekly interval, idempotent locked cycle), save-triggered only. C4-C = add the explicit per-item state over the existing seam, do NOT adopt an episode model (O13-01/O18-01).

### M-contiguous-prefix-stop (PENDING; GO greenfield/isolated on the C4-C cursor surface)
- [ ] T030 Tick stops at the first non-consolidating item; cursor tracks only the contiguous consolidated prefix (never jumps a held-back failure)
- [ ] T031 Startup reset: flip `in_progress`→`raw` for a clean whole re-run + recovery count
> Research: 001 iter-13 (B-001), iter-18 GO (greenfield/isolated), H30-01 reference (aionforge scheduler.rs:142-169,190-204). Decoupled from ranking/chunk-save; low blast, reversible.

### Enrichment-retry-budget + dead-letter (PENDING; gate: boot-enrichment-replay scoping)
- [ ] T040 Bound the boot-time enrichment replay with a per-row attempt cap (`post-insert.ts:289-298`)
- [ ] T041 Add a terminal `failed` state; queue-exclude the poison-pill (no infinite re-enrich)
> Research: 006 PQ2 / R028-enrichment-retry-budget NET-NEW (iter-14). The boot backfill replays stuck work every boot with no cap or terminal state today.

### M-durable-retry-budget (PENDING; gate: design-conflict — Transient/Fatal split is the clean survivor)
- [ ] T050 Add Transient vs Fatal classification on the retry budget (`retry-budget.ts:8-13,:44-46`)
- [ ] T051 [B] (decision-gated) Make attempts store-counted (not in-memory `BoundedMap`) so a restart does not grant a fresh budget — BLOCKED on ADR-002 (durability conflicts with the documented intentional restart-self-heal)
> Research: 001 iter-25 F25-03 REAL/CAUTION — durability conflicts with the documented intentional process-restart self-heal; the Transient/Fatal split alone is clean. H30-03 reference (aionforge scheduler.rs:341-374 store-counted attempts).
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

### Transport-idempotency (PENDING; gate: shared-infra on C4-A receipt)
- [ ] T060 Thread the idempotency token through daemon IPC (`launcher-session-proxy.cjs:151`) into the save handler (`memory-save.ts:3775`)
- [ ] T061 Test: commit-then-die replay is deduped before it duplicates the secondary index
> Research: 006 NET-NEW (Wave-2). The receipt is stored after+outside the save txn, so commit-then-die replays duplicate the secondary index today.

### C-G1 — clock-driver around the existing cursor (PENDING; depends on C4-A + C4-C)
- [ ] T070 Add a registerInterval-hosted driver that fires the existing tick on cadence (`session-manager.ts:234-283` + `consolidation.ts`)
- [ ] T071 Port the discipline: MissedTickBehavior Skip; tick logs-and-continues (never fatal); sits on C4-A so clock-replays do not double-apply
> Research: 001 iter-29 G29-01 (cursor exists, only the clock is missing); iter-30 C-G1-clock-driver (aionforge scheduler.rs:205-223); galadriel's lone strong net-new contribution. Galadriel prompt-cache rationale is INVALID for an MCP server (G29-02) — do not cite it.

### LT-turn-cadence-trigger (PENDING; NET-NEW M/S)
- [ ] T080 Add a persistent `turns_counter` gate (`turns_counter % frequency == 0`, default 5) around the background work (`pressure-monitor.ts`)
> Research: 007 iter-20 NET-NEW M/S. Internal pressure-monitor gates on token-ratio, retention sweep is cron/trigger — neither is turn-count cadence (letta `sleeptime_multi_agent_v4.py:139-145`).

### M-detail-retention-guard (PENDING; gate: needs-benchmark — entity confidence scoring missing)
- [ ] T090 [B] Add the anti-lossy guard: skip-not-write a derived summary unless it names ≥ `entity_retention_threshold` (0.9) of distinct entities AND mean source confidence ≥ 0.6 (`pe-gating.ts`) — BLOCKED: `ExtractedEntity` has NO confidence field today; build confidence scoring first or defer
> Research: 001 iter-13 (B-001) CONFIRMED-gap; iter-25 F25-02 PARTIAL/NEEDS-BENCHMARK (premise partly refuted — not computable today). aionforge ref `summarize.rs` / `summarization.rs` tests.

### M-capture-near-dup-verdict (PENDING-REFUTED; record disposition only)
- [ ] T100 Document REFUTED: synchronous near-dup ALREADY runs inline on the hot save path (`memory-save.ts:2729-2738`; `near-duplicate.ts:18,52`, vectorSearch limit=8 vs 0.88) — gap already closed; no code
> Research: 001 iter-24 E24-01 REFUTED/NO-GO. Carried so it is not re-attempted.

### Close-out
- [ ] T110 tsc/build + focused per-seam suites green (incl. `handleMemoryUpdate` 55/55)
- [ ] T111 `validate.sh --strict` on this folder passes
- [ ] T112 Adversarial review (independent seat) of each shipped candidate; fix findings; scoped commits
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All non-blocked tasks marked `[x]` with evidence (commit SHA / test output)
- [ ] `[B]` tasks (T051, T090) resolved by an ADR decision or explicitly deferred with a recorded reason
- [ ] The C4-A → C4-C → C-G1 chain shipped in dependency order; C4-A no longer regresses the update suite
- [ ] Each shipped candidate independently reversible
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
- **Wave-0 shipped record (DONE evidence)**: `../../../030-memory-search-intelligence-impl/spec.md` §14
<!-- /ANCHOR:cross-refs -->
