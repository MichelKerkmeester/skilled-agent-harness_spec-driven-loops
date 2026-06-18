---
title: "Decision Record: Memory Search Intelligence Wave-0 closeout"
description: "Decision record for the 030 Wave-0 implementation packet, including scope discipline, deferred candidates, default-behavior rules, candidate-specific caveats, and residual benchmark follow-ups."
trigger_phrases:
  - "decision record memory search intelligence wave 0"
  - "030 candidate decisions"
  - "byte identical default discipline"
  - "candidate 6 deferred"
  - "candidate 11 deferred"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/030-memory-search-intelligence-impl"
    last_updated_at: "2026-06-18T23:20:00Z"
    last_updated_by: "codex-gpt-5"
    recent_action: "Recorded Wave-0 closeout decisions."
    next_safe_action: "Use these decisions as Wave-1 intake constraints."
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-18-wave-0-closeout"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Decision Record: Memory Search Intelligence Wave-0 closeout

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Ship only Wave-0-ready candidates

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-06-18 |
| **Deciders** | Codex, opus review where noted |

---

<!-- ANCHOR:adr-001-context -->
### Context

Packet 028 produced the research roadmap. That research did not authorize broad implementation; it identified candidate seams. Packet 030 exists to ship only the Wave-0 items that are additive, reversible, and safe without schema migration or benchmark tuning.

### Constraints

- Packet 028 remains research-only.
- Wave-1 and Wave-2 candidates are not smuggled into Wave-0.
- Every shipped candidate needs focused verification and commit evidence.
- Default behavior must remain byte-identical unless the candidate explicitly changes the default and tests prove it safe.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: Ship the 11 Wave-0-ready candidates and defer the 2 candidates whose evidence contradicted a safe default implementation.

**How it works**: Each candidate landed at its named seam with a focused test and scoped commit. Candidates 6 and 11 are not partial work; they are deliberate drops from Wave-0 with evidence and Wave-1 paths.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Ship only verified Wave-0 candidates** | Preserves reversibility and truthfulness | Leaves two attractive ideas for later | 10/10 |
| Implement all 13 rows because they are in the roadmap | Feels complete on paper | Ships known regressions and live-DB recall damage | 2/10 |
| Defer all risky retrieval work until benchmarks exist | Lowest immediate risk | Blocks small correctness and stability wins | 5/10 |

**Why this one**: The branch now contains the safe retrieval improvements without pretending the two contradicted candidates are safe.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- Memory search degrades more gracefully, orders more deterministically, and keeps default scoring stable.
- Deep Loop fanout has deterministic merge behavior, gauges, and self-stop summary behavior.
- Code Graph impact context can rank trusted edges without perturbing neutral peer order.

**What it costs**:
- Wave-1 must handle idempotency defaulting and system-kind filtering properly. Mitigation: both deferred rows include specific blocking evidence and next constraints.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Broad Memory MCP suite remains red from historical drift | M | Use focused touched-area suite for packet composition, and classify broad failures against baseline |
| Q4-C1 boost magnitude is unbenchmarked | M | Keep neutral-order proof as ship gate and record magnitude benchmark follow-up |
| Deferred candidates get forgotten | M | Keep them as explicit follow-ups in `implementation-summary.md` |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Candidate rows map to packet 028 roadmap seams and packet 030 status table |
| 2 | **Beyond Local Maxima?** | PASS | Unsafe cheap implementations were rejected with evidence |
| 3 | **Sufficient?** | PASS | Shipped candidates stay candidate-local and reversible |
| 4 | **Fits Goal?** | PASS | Goal is Wave-0 implementation, not a retrieval rewrite |
| 5 | **Open Horizons?** | PASS | Wave-1 follow-ups preserve future paths without hiding risk |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- 11 candidates are marked Done with implementation commits.
- 2 candidates are marked Deferred with test or live-DB evidence.
- Packet docs are rewritten to reflect full scope.

**How to roll back**: Revert the candidate commit listed in `spec.md` section 14. No shipped candidate requires database migration reversal.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: Drop Candidate 6 from Wave-0

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-06-18 |
| **Deciders** | Codex |

---

<!-- ANCHOR:adr-002-context -->
### Context

Candidate 6 proposed flipping idempotency receipts on by default. The roadmap already warned that deferred-save replay and conflict wiring needed care. The cheap version was to flip `SPECKIT_MEMORY_IDEMPOTENCY` on and trust existing paths.

### Constraints

- `memory_update` must not silently change behavior when save-path idempotency changes.
- The refuted replay/conflict leg must not be rebuilt under a misleading Wave-0 label.
<!-- /ANCHOR:adr-002-context -->

---

<!-- ANCHOR:adr-002-decision -->
### Decision

**We chose**: Defer Candidate 6 to Wave-1+.

**How it works**: The candidate remains documented as a receipt-default-on goal, but the save/update path must be scoped before any default flip ships.
<!-- /ANCHOR:adr-002-decision -->

---

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Defer with regression evidence** | Honest and safe | Requires Wave-1 work | 10/10 |
| Flip idempotency on now | Small code change | Breaks 11 `handleMemoryUpdate` tests | 1/10 |
| Rebuild replay/conflict leg now | Could solve broader behavior | Out of scope and previously refuted | 2/10 |

**Why this one**: A default flip that breaks update tests is not a Wave-0 improvement.
<!-- /ANCHOR:adr-002-alternatives -->

---

<!-- ANCHOR:adr-002-consequences -->
### Consequences

**What improves**:
- Wave-0 does not ship a known `memory_update` regression.
- Wave-1 has a precise intake: separate save-path idempotency from update-path semantics.

**What it costs**:
- Idempotency receipts are not default-on yet. Mitigation: keep the content-id primitive shipped and use it as future infrastructure.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Duplicate save behavior remains possible by default | M | Track Candidate 6 as Wave-1+ with update-path test gate |
<!-- /ANCHOR:adr-002-consequences -->

---

<!-- ANCHOR:adr-002-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The regression is concrete |
| 2 | **Beyond Local Maxima?** | PASS | Flip, rebuild, and defer options were compared |
| 3 | **Sufficient?** | PASS | Defer keeps current behavior stable |
| 4 | **Fits Goal?** | PASS | Wave-0 excludes known regressions |
| 5 | **Open Horizons?** | PASS | Wave-1 path remains intact |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-002-five-checks -->

---

<!-- ANCHOR:adr-002-impl -->
### Implementation

**What changes**:
- Candidate 6 stays unshipped.
- `tasks.md`, `checklist.md`, and `implementation-summary.md` record the block reason.

**How to roll back**: No code rollback required; this is a non-ship decision.
<!-- /ANCHOR:adr-002-impl -->
<!-- /ANCHOR:adr-002 -->

---

<!-- ANCHOR:adr-003 -->
## ADR-003: Drop Candidate 11 from Wave-0

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-06-18 |
| **Deciders** | Codex, opus review |

---

<!-- ANCHOR:adr-003-context -->
### Context

Candidate 11 proposed excluding `source_kind='system'` rows from default recall. The hypothesis was that system-kind rows were substrate noise. Opus review checked the live 734 MB database and disproved that premise.

### Constraints

- Constitutional rules and canonical spec docs must remain recallable.
- A cheap predicate cannot hide half of useful recall.
- An admin opt-in is not enough if the default hides load-bearing memories.
<!-- /ANCHOR:adr-003-context -->

---

<!-- ANCHOR:adr-003-decision -->
### Decision

**We chose**: Defer Candidate 11 to Wave-1.

**How it works**: The next implementation needs a real substrate signal, constitutional/spec-doc short-circuit, and live-DB validation before changing default recall.
<!-- /ANCHOR:adr-003-decision -->

---

<!-- ANCHOR:adr-003-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Defer until substrate signal exists** | Protects recall quality | Leaves noise reduction unsolved | 10/10 |
| Hide all `system` rows by default | Simple | Hides 9,592 live spec docs and 29 constitutional rules | 1/10 |
| Ship with `includeSystem` escape hatch | Debuggable | Bad default still damages normal recall | 3/10 |

**Why this one**: The live DB evidence proves `source_kind='system'` is not a safe substrate-noise proxy.
<!-- /ANCHOR:adr-003-alternatives -->

---

<!-- ANCHOR:adr-003-consequences -->
### Consequences

**What improves**:
- Constitutional and canonical spec memories remain visible by default.
- Wave-1 has a sharper substrate-filtering requirement.

**What it costs**:
- Default recall still includes some system-kind rows. Mitigation: design a true substrate signal before filtering.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Recall noise persists | M | Track Wave-1 substrate signal plus live-DB validation |
<!-- /ANCHOR:adr-003-consequences -->

---

<!-- ANCHOR:adr-003-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The cheap implementation was disproven |
| 2 | **Beyond Local Maxima?** | PASS | Hard-hide and opt-in alternatives were rejected |
| 3 | **Sufficient?** | PASS | Deferral avoids recall damage |
| 4 | **Fits Goal?** | PASS | Wave-0 must not degrade memory recall |
| 5 | **Open Horizons?** | PASS | Wave-1 substrate signal remains open |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-003-five-checks -->

---

<!-- ANCHOR:adr-003-impl -->
### Implementation

**What changes**:
- Candidate 11 stays unshipped.
- Docs record the live DB evidence and future constraints.

**How to roll back**: No code rollback required; this is a non-ship decision.
<!-- /ANCHOR:adr-003-impl -->
<!-- /ANCHOR:adr-003 -->

---

<!-- ANCHOR:adr-004 -->
## ADR-004: Preserve byte-identical defaults

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-06-18 |
| **Deciders** | Codex, opus review where noted |

---

<!-- ANCHOR:adr-004-context -->
### Context

Several candidates added knobs or trust signals to ranking paths. Ranking changes are high-risk because small numeric differences can reorder results and look like recall regressions.

### Constraints

- Default behavior must remain byte-identical unless the candidate explicitly changes default behavior.
- Additive options need a neutral/default proof.
- Benchmark tuning is not part of Wave-0.
<!-- /ANCHOR:adr-004-context -->

---

<!-- ANCHOR:adr-004-decision -->
### Decision

**We chose**: Treat byte-identical default behavior as the ship gate for optional ranking knobs.

**How it works**: Candidate 5 keeps `bonusOverChannels` defaulting to `active` and restores the no-timestamp guard so C6-A is a pure refactor. Candidate 13 uses an RRF-additive trust blend and proves neutral peer order is preserved; magnitude tuning is deferred.
<!-- /ANCHOR:adr-004-decision -->

---

<!-- ANCHOR:adr-004-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Byte-identical default gate** | Low regression risk | Requires parity tests and arithmetic checks | 10/10 |
| Multiplicative neutral trust blend | Looks mathematically tidy | Reorders ties against rowid baseline | 3/10 |
| Tune boost magnitude now | Could improve ranking quality | Needs benchmark data outside Wave-0 | 4/10 |

**Why this one**: The branch can ship ranking scaffolding without claiming unmeasured relevance gains.
<!-- /ANCHOR:adr-004-alternatives -->

---

<!-- ANCHOR:adr-004-consequences -->
### Consequences

**What improves**:
- Optional ranking features have stable default behavior.
- Q4-C1 can ship as a structural improvement without pretending the boost magnitude is tuned.

**What it costs**:
- Q4-C1 relevance magnitude remains unbenchmarked. Mitigation: track benchmark follow-up explicitly.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Future change forgets default parity | M | Keep byte-identical default discipline in this ADR and tests |
| Q4-C1 boost is too weak or too strong | M | Run a later benchmark sweep |
<!-- /ANCHOR:adr-004-consequences -->

---

<!-- ANCHOR:adr-004-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Ranking paths are regression-sensitive |
| 2 | **Beyond Local Maxima?** | PASS | Multiplicative and benchmark-now options were considered |
| 3 | **Sufficient?** | PASS | Neutral-order proof is enough for Wave-0 |
| 4 | **Fits Goal?** | PASS | Wave-0 can ship scaffolding without tuning |
| 5 | **Open Horizons?** | PASS | Benchmark follow-up remains explicit |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-004-five-checks -->

---

<!-- ANCHOR:adr-004-impl -->
### Implementation

**What changes**:
- Candidate 5 ships with `bonusOverChannels` default parity and no-timestamp guard restored.
- Candidate 13 ships with additive trust blend and neutral-order proof.
- Q4-C1 magnitude benchmark remains follow-up.

**How to roll back**: Revert Candidate 5 or Candidate 13 commits independently.
<!-- /ANCHOR:adr-004-impl -->
<!-- /ANCHOR:adr-004 -->

---

<!-- ANCHOR:adr-005 -->
## ADR-005: Keep C9 input-validation expansion in scope

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-06-18 |
| **Deciders** | Codex, opus review |

---

<!-- ANCHOR:adr-005-context -->
### Context

Candidate 2 primarily addressed embedder unavailability. During that work, input-validation behavior was tightened so typed Stage 1 input errors propagate instead of collapsing into silent fallback.

### Constraints

- The scope addition must be benign and zero-live-blast.
- Typed validation errors must not mask embedder-degradation behavior.
- Review must accept the scope addition.
<!-- /ANCHOR:adr-005-context -->

---

<!-- ANCHOR:adr-005-decision -->
### Decision

**We chose**: Keep the input-validation tightening inside Candidate 2's shipped scope.

**How it works**: Embedder unavailability still degrades to lexical search with `embedder_available:false`. Invalid Stage 1 input now reports a typed Stage1InputError and handler concept guard.
<!-- /ANCHOR:adr-005-decision -->

---

<!-- ANCHOR:adr-005-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Keep reviewed validation tightening** | Improves correctness near the touched seam | Slightly broader than original candidate title | 9/10 |
| Revert validation tightening | Narrowest diff | Loses reviewed correctness improvement | 5/10 |
| Expand into broader input-validation pass | More complete | Scope creep beyond Wave-0 | 2/10 |

**Why this one**: The change is local to the touched seam, reviewed, and does not alter successful degradation behavior.
<!-- /ANCHOR:adr-005-alternatives -->

---

<!-- ANCHOR:adr-005-consequences -->
### Consequences

**What improves**:
- Invalid input fails with a typed error instead of ambiguous fallback.
- C9 still handles embedder unavailability gracefully.

**What it costs**:
- Candidate 2 has a documented scope note. Mitigation: keep the note in `spec.md` and this ADR.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Scope expansion hides unrelated behavior | L | Limit to Stage 1 input and handler concept guard |
<!-- /ANCHOR:adr-005-consequences -->

---

<!-- ANCHOR:adr-005-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Invalid Stage 1 input needed explicit behavior |
| 2 | **Beyond Local Maxima?** | PASS | Revert and broaden options were considered |
| 3 | **Sufficient?** | PASS | Change stays at the touched seam |
| 4 | **Fits Goal?** | PASS | It supports graceful degradation correctness |
| 5 | **Open Horizons?** | PASS | Does not block later validation work |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-005-five-checks -->

---

<!-- ANCHOR:adr-005-impl -->
### Implementation

**What changes**:
- Candidate 2 includes typed Stage 1 input error propagation and handler concept guard.

**How to roll back**: Revert the Candidate 2 commit or remove the validation-specific hunks while preserving embedder fallback.
<!-- /ANCHOR:adr-005-impl -->
<!-- /ANCHOR:adr-005 -->
