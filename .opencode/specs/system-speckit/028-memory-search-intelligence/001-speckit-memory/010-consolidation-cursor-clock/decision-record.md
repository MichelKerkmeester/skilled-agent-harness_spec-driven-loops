---
title: "Decision Record: Memory Consolidation Cursor + Clock (C4-A → C4-C → C-G1 chain)"
description: "Architectural decisions for the longest Memory consolidation chain: how to default-on idempotency receipts without regressing the update path, whether durable-retry durability fights the intentional restart-self-heal design and reusing the existing cursor rather than adopting an episode model."
trigger_phrases:
  - "c4-a flag coupling decision"
  - "durable retry restart self-heal decision"
  - "consolidation cursor reuse decision"
  - "idempotency receipts default-on decision"
  - "consolidation episode model decision"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/001-speckit-memory/010-consolidation-cursor-clock"
    last_updated_at: "2026-06-19T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Authored 3 ADRs for the consolidation chain decisions"
    next_safe_action: "Resolve ADR-002 (durable-retry durability) with the user before T051"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "decision-record.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-19-028-001-010-consolidation-cursor-clock"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Decision Record: Memory Consolidation Cursor + Clock (C4-A → C4-C → C-G1 chain)

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: How to default-on idempotency receipts without regressing the update path

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Proposed |
| **Date** | 2026-06-19 |
| **Deciders** | Memory MCP maintainer |

---

<!-- ANCHOR:adr-001-context -->
### Context

C4-A wants `SPECKIT_MEMORY_IDEMPOTENCY` default-on, but the 030 Wave-0 run proved this is not a clean flip: flipping it on activates the idempotency/near-dup path on `memory_update` and broke 11 of 55 `handleMemoryUpdate` tests (`030/spec.md §14`, candidate 6, DEFERRED → Wave-1+). The flag is overloaded, it also gates near-duplicate advisory hints (`near-duplicate.ts:95`) and a receipt path (`memory-index.ts:697`), so default-on turns on a second caller-visible change (005-revisit-027 iter-045 O5-02).

### Constraints
- The `handleMemoryUpdate` suite must stay 55/55 green, it is the regression gate.
- The surviving value of C4-A is receipt-default-on + content-addressed ids. The "wire replay/conflict into the deferred/canonical save path" leg was REFUTED (001 iter-27 F27-02), so do NOT build it.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: scope receipts to the save path so default-on does not change update-path behavior, and decide the near-dup-hint coupling explicitly (split the flag, or accept the near-dup hint as an intentional part of default-on).

**How it works**: gate receipt creation on the save handler only. The update path keeps its current behavior unless a maintainer accepts the near-dup hint emission. Verify replay re-derives the same content-addressed id (dedup no-op) and the update suite stays green.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Scope to save path + explicit coupling decision** | Keeps update suite green, surgical | Needs the coupling call recorded | 8/10 |
| Flip the flag as-is (the 030 attempt) | One-line | Regressed 11 update tests, refuted | 2/10 |
| Split into two flags (receipts vs near-dup hints) | Cleanest separation | More surface, may be over-engineering for one consumer | 6/10 |

**Why this one**: it lands the surviving C4-A value (default-on receipts + content-addressed ids) while honoring the regression gate the 030 deferral established.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- Crash-replay safety: a commit-then-die replay re-derives the same id and dedups (the mechanism C-G1 and Transport-idempotency reuse).

**What it costs**:
- A recorded decision on the near-dup-hint coupling. Mitigation: ADR records whichever path (split or accept) the maintainer takes.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Default-on re-breaks the update path | H | Save-path scoping + the 55/55 regression gate as a hard check |
| Near-dup hints surface unexpectedly | M | Explicit accept-or-split decision before the flip |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Crash-replay dedup is the chain head C-G1/Transport-idempotency depend on |
| 2 | **Beyond Local Maxima?** | PASS | The naive flip was tried in 030 and refuted. This is the scoped alternative |
| 3 | **Sufficient?** | PASS | Save-path scoping is the minimal change that keeps the update suite green |
| 4 | **Fits Goal?** | PASS | C4-A is the documented chain head (J37-01 critical path) |
| 5 | **Open Horizons?** | PASS | The receipt primitive is reused by the 003 advisor projection |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- `idempotency-receipts.ts`: default-on, save-path-scoped.
- `memory-save.ts:3547,3655`: receipt wiring. `near-duplicate.ts:95`: coupling split-or-accept.

**How to roll back**: set `SPECKIT_MEMORY_IDEMPOTENCY` back off (the receipt table persists as inert TTL-pruned residue) and revert the scoped commit.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: Whether durable-retry durability fights the intentional restart-self-heal design

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Proposed |
| **Date** | 2026-06-19 |
| **Deciders** | Memory MCP maintainer |

---

<!-- ANCHOR:adr-002-context -->
### Context

M-durable-retry-budget proposes attempts counted from the store (not the in-memory `BoundedMap`) so a restart does not grant a fresh budget. But the retry budget is documented as intentionally ephemeral (`retry-budget.ts:8-13`, `@invariant ephemeral`, MAX_RETRIES=3), and durability conflicts with the documented intentional process-restart self-heal design (001 iter-25 F25-03 REAL/CAUTION). The clean survivor is the Transient/Fatal classification alone, decoupled from durability.

### Constraints
- The Transient/Fatal split is clean and ships independently.
- Bundled durability is the risk leg, it fights an intentional design choice.
<!-- /ANCHOR:adr-002-context -->

---

<!-- ANCHOR:adr-002-decision -->
### Decision

**We chose**: ship the Transient/Fatal classification now. Treat store-counted durability as a separate, maintainer-gated decision (task T051 is `[B]`-blocked on this ADR).

**How it works**: classify retry causes as Transient (re-attempt up to the cap) vs Fatal (escalate to terminal `failed`). Leave attempt counting in-memory unless the maintainer explicitly chooses durability, in which case the dead-letter terminal state (Enrichment-retry-budget-deadletter) provides the durable poison-pill record instead.
<!-- /ANCHOR:adr-002-decision -->

---

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Transient/Fatal split only** | Clean, no design conflict | Restart still grants a fresh in-memory budget | 8/10 |
| Split + store-counted attempts | Crash-proof budget (aionforge scheduler.rs:341-374) | Fights the documented restart-self-heal | 5/10 |
| Status quo (in-memory, no split) | Zero change | Poison-pill not classified | 2/10 |

**Why this one**: the split delivers the durable poison-pill behavior via the dead-letter terminal state without overriding an intentional design decision.
<!-- /ANCHOR:adr-002-alternatives -->

---

<!-- ANCHOR:adr-002-consequences -->
### Consequences

**What improves**:
- A Fatal error escalates immediately rather than burning the full retry budget.

**What it costs**:
- A restart still resets the in-memory attempt count under the split-only option. Mitigation: the dead-letter terminal `failed` row (durable) carries the poison-pill verdict instead.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Split-only lets a restart re-try a near-fatal item | M | The dead-letter terminal state caps total re-enrichment |
<!-- /ANCHOR:adr-002-consequences -->

---

<!-- ANCHOR:adr-002-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Poison-pill currently burns the full budget without classification |
| 2 | **Beyond Local Maxima?** | PASS | Durability alternative weighed and gated, not discarded |
| 3 | **Sufficient?** | PASS | The split + dead-letter covers the poison-pill case without durability |
| 4 | **Fits Goal?** | PASS | Crash-safety hardening on the same cursor |
| 5 | **Open Horizons?** | PASS | Durability remains an explicit future option |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-002-five-checks -->

---

<!-- ANCHOR:adr-002-impl -->
### Implementation

**What changes**:
- `retry-budget.ts:8-13,:44-46`: add Transient/Fatal classification.
- `post-insert.ts:289-298`: terminal `failed` dead-letter state (shared with Enrichment-retry-budget-deadletter).

**How to roll back**: revert the classification hunk. The dead-letter terminal state is additive and queue-exclusion-only (non-destructive).
<!-- /ANCHOR:adr-002-impl -->
<!-- /ANCHOR:adr-002 -->

---

<!-- ANCHOR:adr-003 -->
## ADR-003: Reuse the existing consolidation cursor rather than adopt an episode model

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-06-19 |
| **Deciders** | Memory MCP maintainer |

---

<!-- ANCHOR:adr-003-context -->
### Context

aionforge's capture↔consolidation split presumes immutable per-turn episodes. Internal Memory is doc/chunk-granular with no per-turn episode boundary (001 iter-13 O13-01). The research re-scoped C4-C and C-G1 around this: a cadence-gated durable cursor ALREADY exists (`consolidation.ts:518-548`, `consolidation_state.last_run_at`, weekly interval, idempotent locked cycle) and is merely save-triggered, never clock-driven (001 iter-29 G29-01). C-G1 therefore shrinks to "add a clock-driver around the existing cursor."

### Constraints
- Adopting an episode model = an invasive `memory-save.ts` rewrite with no payoff (O18-01).
- C4-C must add the explicit per-item state over the existing background/deferred seam, not introduce a new substrate.
<!-- /ANCHOR:adr-003-context -->

---

<!-- ANCHOR:adr-003-decision -->
### Decision

**We chose**: graft the per-item `raw|in_progress|consolidated|failed` state and the clock-driver onto the existing chunk-save / consolidation-cursor path. Do NOT adopt an episode model.

**How it works**: C4-C adds the state machine over `memory-index.ts:293-294,:1376-1377`. C-G1 attaches a registerInterval driver to the existing `consolidation.ts` tick. The capture-side candidates (prefix-stop, dead-letter) harden that same cursor.
<!-- /ANCHOR:adr-003-decision -->

---

<!-- ANCHOR:adr-003-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Graft onto existing cursor** | No substrate rewrite, reuses the durable cursor | Per-item state must be added carefully | 9/10 |
| Adopt an immutable episode model | Matches aionforge directly | Invasive rewrite, no payoff (O18-01) | 2/10 |

**Why this one**: the durable cursor already exists. Only the per-item state and the clock are missing.
<!-- /ANCHOR:adr-003-alternatives -->

---

<!-- ANCHOR:adr-003-consequences -->
### Consequences

**What improves**:
- C4-C/C-G1 become small additive changes on a proven cursor instead of a new subsystem.

**What it costs**:
- The per-item state must coexist with the existing weekly-cycle locking. Mitigation: the apply-once invariant (a re-run over `consolidated` items is a no-op).

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Per-item state desyncs from the cursor's locked cycle | M | Startup reset + contiguous-prefix invariant |
<!-- /ANCHOR:adr-003-consequences -->

---

<!-- ANCHOR:adr-003-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The clock-driver is the one missing top link (J37-01) |
| 2 | **Beyond Local Maxima?** | PASS | Episode-model alternative explicitly weighed and rejected |
| 3 | **Sufficient?** | PASS | Graft is the minimal change on the existing cursor |
| 4 | **Fits Goal?** | PASS | Keeps C4-C/C-G1 small and reversible |
| 5 | **Open Horizons?** | PASS | The cursor pattern generalizes to the 003 advisor projection |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-003-five-checks -->

---

<!-- ANCHOR:adr-003-impl -->
### Implementation

**What changes**:
- `memory-index.ts`, `consolidation.ts`, `session-manager.ts`: per-item state + clock-driver grafted onto the existing cursor.

**How to roll back**: the per-item state columns are additive/inert. Disable the interval driver to revert to save-triggered consolidation.
<!-- /ANCHOR:adr-003-impl -->
<!-- /ANCHOR:adr-003 -->
