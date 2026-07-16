---
title: "Decision Record: Determinism + Content-ID Foundation"
description: "Decision record for the determinism + content-id foundation sub-phase: keystone-first scope discipline, the byte-identical-default ship gate, the gating of the render-stage and configured-mode residue and the single-tenant refusal of the identity-hardening pair."
trigger_phrases:
  - "decision record determinism content-id foundation"
  - "byte identical default ship gate memory"
  - "single-tenant identity hardening refused"
  - "028 speckit-memory determinism decisions"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/029-memory-search-intelligence/001-speckit-memory/002-determinism-content-id-foundation"
    last_updated_at: "2026-07-04T17:51:02.224Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Recorded the foundation's load-bearing decisions as ADR-001..004"
    next_safe_action: "Author implementation-summary.md"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-19-028-001-determinism-foundation"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Decision Record: Determinism + Content-ID Foundation

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Treat the total-comparator + content-id as the keystone and ship it first

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-06-19 |
| **Deciders** | Re-plan author, grounded in the 200-iteration research synthesis |

---

<!-- ANCHOR:adr-001-context -->
### Context

The 200-iteration campaign identified the total-comparator as THE keystone of the determinism spine: JS `(a,b)=>b-a` is not a total order (NaN / -0 poison it), so every determinism candidate needs one hand-written total comparator plus a content-derived tiebreak, and the content-id formula is duplicated across `memory-parser.ts` (content-body) and `idempotency-receipts.ts` (canonical-field). Four sibling consumers, Code Graph (002), Skill Advisor (003), Deep Loop (004), byte-compare their fused output against this Memory primitive.

### Constraints

- Build the comparator and the content-id formula ONCE, reuse across candidates and siblings.
- The content-id centralization must be byte-identical to the legacy bare-hex hashes (centralize the formula, parameterize the identity).
- The content-derived-id is a 2nd-tier dependency (identity/tiebreak subset only), not co-equal with the comparator.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: Ship the keystone first, the two content-id primitives (`lib/content-id.ts`) and the content-derived tiebreaks (C5-B at the comparator/output sorts, ANN `, m.id ASC` below RRF), as the foundation every other determinism candidate and sibling subsystem depends on.

**How it works**: The content-id formula is centralized into one module with two named primitives (`hashContentBody`, `hashCanonicalJson`), proven byte-identical by a parity test. C5-B adds the content-derived tiebreak. The ANN COALESCE tiebreak makes LIMIT-survival into fusion run-stable. All shipped in Wave-0 (commits `18c8582e33`, `bec0eed27f`).
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Keystone-first (one comparator + one content-id module)** | Reuse across candidates + siblings, one parity-proof | Requires careful byte-identity discipline | 10/10 |
| Per-candidate ad-hoc comparators | Faster per candidate | Partial orders re-implemented, NaN/-0 poison, no shared contract | 2/10 |
| One merged hash (not two primitives) | Fewer functions | Collapses content-body and canonical-field semantics, B's token-stripping is receipt-specific | 3/10 |

**Why this one**: The keystone is the choke point every sibling ranker passes through, building it once is the whole point of the determinism spine.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- Recall ordering is reproducible at the ANN-below-RRF, comparator and RRF-output seams.
- The content-id formula has one proven-identical home, ready for the future C4-B `derived_id` (Wave-2).

**What it costs**:
- Centralizing identity carries a divergence risk from legacy hashes. Mitigation: parity test (shipped).

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Centralized hash diverges from legacy bare-hex | H | Parity test proves byte-identical (commit `18c8582e33`) |
| C5-B re-baselines golden files | M | Primary order unchanged (verified), one-time re-baseline |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Siblings byte-compare against this primitive, the comparator must be total |
| 2 | **Beyond Local Maxima?** | PASS | Per-candidate and merged-hash options were rejected with reasons |
| 3 | **Sufficient?** | PASS | One comparator + two primitives cover the identity/tiebreak subset |
| 4 | **Fits Goal?** | PASS | Goal is the determinism foundation, not a ranking rewrite |
| 5 | **Open Horizons?** | PASS | The module is the base for the future `derived_id` |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- `lib/content-id.ts` created (`18c8582e33`), C5-B + ANN tiebreaks (`bec0eed27f`).

**How to roll back**: Revert the listed commits independently, no migration to reverse.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: Make byte-identical default behavior the ship gate for the fusion seams

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-06-19 |
| **Deciders** | Re-plan author, opus review on the shipped candidates |

---

<!-- ANCHOR:adr-002-context -->
### Context

C-X1 exposes the active-channel bonus denominator as a named param and C6-A turns rank-time decay into a caller-clock function. Both touch the fusion/decay math that three sibling subsystems byte-compare against. A small numeric drift would silently re-order every consumer.

### Constraints

- The `bonusOverChannels` param must default to `'active'` so existing fusion stays byte-identical.
- The C6-A clock must keep a clock-less query byte-identical (preserve the no-timestamp skip guard), reinforcement stays a separate explicit event.
- The galadriel prompt-cache (~84%) is NOT a valid justification for an out-of-band MCP server, determinism stands on reproducibility, not prompt-cache.
<!-- /ANCHOR:adr-002-context -->

---

<!-- ANCHOR:adr-002-decision -->
### Decision

**We chose**: Treat byte-identical default behavior as the hard ship gate for the C-X1 `'active'` param and the C6-A clock.

**How it works**: C-X1 defaults to `'active'` (byte-identity traced arithmetically). C6-A restored the no-timestamp skip guard so it is a pure refactor. Both shipped in commit `65cfcea513` with an opus SHIP.
<!-- /ANCHOR:adr-002-decision -->

---

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Byte-identical default gate** | Zero silent re-order for siblings | Requires an arithmetic/traced proof | 10/10 |
| Change the default bonus denominator now | Simpler call sites | Reshapes the convergence bonus, breaks byte-compare | 2/10 |
| Cite prompt-cache savings as the benefit | Compelling headline | Invalid for an out-of-band MCP server (no API calls) | 1/10 |

**Why this one**: The cross-subsystem byte-compare contract is the reliability invariant, the default must not move.
<!-- /ANCHOR:adr-002-alternatives -->

---

<!-- ANCHOR:adr-002-consequences -->
### Consequences

**What improves**:
- The fusion-bonus param and the decay clock land without perturbing any consumer's default order.

**What it costs**:
- The actual benefit of the `'configured'` mode is unrealized until a consumer opts in (see ADR-003).

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A future change forgets default parity | M | This ADR + the traced byte-identity proof are the standing gate |
| The fusion-bonus invariant unit test is still open | M | Land it before any `'configured'` promotion |
<!-- /ANCHOR:adr-002-consequences -->

---

<!-- ANCHOR:adr-002-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Fusion/decay paths are regression-sensitive and byte-compared |
| 2 | **Beyond Local Maxima?** | PASS | Change-default and prompt-cache framings were rejected |
| 3 | **Sufficient?** | PASS | A traced default-identity proof is enough to ship the seam |
| 4 | **Fits Goal?** | PASS | The foundation must keep consumers stable |
| 5 | **Open Horizons?** | PASS | The `'configured'` mode remains available behind its gate |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-002-five-checks -->

---

<!-- ANCHOR:adr-002-impl -->
### Implementation

**What changes**:
- C-X1 `'active'` default + C6-A clock shipped in `65cfcea513`.

**How to roll back**: Revert `65cfcea513`, the param and clock refactor come out together.
<!-- /ANCHOR:adr-002-impl -->
<!-- /ANCHOR:adr-002 -->

---

<!-- ANCHOR:adr-003 -->
## ADR-003: Gate the render-stage and configured-mode residue behind their consumers

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-06-19 |
| **Deciders** | Re-plan author |

---

<!-- ANCHOR:adr-003-context -->
### Context

Two fuller-parity candidates remain after the cheap wins ship: C-X1-true-multichannel (the `'configured'` bonus denominator) and C5-A (the content-derived serialization-order render stage). Neither has a present consumer: `'configured'` only matters once per-class zero-weighting (Wave-1 C2-B) lands, and C5-A is a render re-sort that supersedes the already-shipped C5-B stopgap and would re-baseline golden files.

### Constraints

- Do not build the `'configured'` mode before its C2-B consumer and the still-open fusion-bonus unit test.
- C5-A's render tiebreak must stay separate from the C5-B fusion tiebreak.
- Ship C5-B first (done), C5-A is the superseding successor.
<!-- /ANCHOR:adr-003-context -->

---

<!-- ANCHOR:adr-003-decision -->
### Decision

**We chose**: Keep C-X1-true-multichannel and C5-A documented PENDING with explicit gates (shared-infra-dep and render-build), not built in this sub-phase.

**How it works**: `'configured'` is built alongside the Wave-1 C2-B per-class weight consumer after the fusion-bonus unit test lands. C5-A is built as the fuller render stage with a one-time golden re-baseline.
<!-- /ANCHOR:adr-003-decision -->

---

<!-- ANCHOR:adr-003-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Gate behind consumer + unit test** | No dead code, no premature re-baseline | Benefit deferred | 10/10 |
| Build `'configured'` now | Feels complete | No consumer, conditioned on an open unit test | 3/10 |
| Build C5-A now and drop C5-B | Fuller aionforge parity | Golden re-baseline churn without a determinism gap C5-B left open | 4/10 |

**Why this one**: The residue is fuller-parity follow-up, not a present gap, building it now adds churn without an earned benefit.
<!-- /ANCHOR:adr-003-alternatives -->

---

<!-- ANCHOR:adr-003-consequences -->
### Consequences

**What improves**:
- The foundation ships clean, the residue is tracked, not lost.

**What it costs**:
- Per-class zero-weighting and full render-order parity wait for their wave. Mitigation: explicit gates recorded in `spec.md` §13.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Residue forgotten | M | Recorded as PENDING with gates + consuming sub-phase |
| `'configured'` built before the unit test | M | Gate is explicit in plan/tasks |
<!-- /ANCHOR:adr-003-consequences -->

---

<!-- ANCHOR:adr-003-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Neither residue has a present consumer |
| 2 | **Beyond Local Maxima?** | PASS | Build-now options were compared and rejected |
| 3 | **Sufficient?** | PASS | Gating with a named consumer preserves the path |
| 4 | **Fits Goal?** | PASS | The foundation ships the cheap wins, defers the fuller parity |
| 5 | **Open Horizons?** | PASS | Both candidates remain buildable behind their gates |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-003-five-checks -->

---

<!-- ANCHOR:adr-003-impl -->
### Implementation

**What changes**:
- C-X1-true-multichannel and C5-A stay unbuilt, recorded PENDING in `spec.md` §13, `tasks.md` T006/T007.

**How to roll back**: No code rollback required, this is a non-ship gating decision.
<!-- /ANCHOR:adr-003-impl -->
<!-- /ANCHOR:adr-003 -->

---

<!-- ANCHOR:adr-004 -->
## ADR-004: Refuse the identity-hardening pair for a single-trusted-host tool

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-06-19 |
| **Deciders** | Re-plan author, grounded in the iter-23 single-tenant re-verification |

---

<!-- ANCHOR:adr-004-context -->
### Context

Iteration 14 flagged a determinism/idempotency hardening sub-cluster, M-dual-class-identity (PROMOTE) and M-clock-skew-replay-window (BUILD), alongside the content-id work. Iteration 23 re-verified the cluster under the single-tenant applicability lens and found 4 of 5 REFUTED/NO-GO: their threat models assume a remote / multi-writer adversary that does not exist for a local single-trusted-host MCP.

### Constraints

- A single-tenant caller IS the owner, anti-replay clock-skew defends a network/multi-writer threat that is absent.
- Identity is already informally dual-class (autoincrement id + contentHash dedup), formalizing pays off only for distributed/multi-writer merge.
- Receipts already dedup, so the clock-skew replay window is redundant locally.
<!-- /ANCHOR:adr-004-context -->

---

<!-- ANCHOR:adr-004-decision -->
### Decision

**We chose**: Do NOT build the identity-hardening pair, record it PENDING behind a multi-writer-adoption gate.

**How it works**: Both candidates stay documented-NO-GO, only the adoption of a distributed / multi-writer / strict-isolation mode would revive them.
<!-- /ANCHOR:adr-004-decision -->

---

<!-- ANCHOR:adr-004-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Document-NO-GO behind a multi-writer gate** | Honest threat model, no dead hardening | Pair stays unbuilt | 10/10 |
| Build the clock-skew window now | Looks like defense-in-depth | Defends an absent threat, receipts already dedup | 1/10 |
| Build dual-class identity now | Formal capture/content split | Already informal, only pays for multi-writer merge | 2/10 |

**Why this one**: Shipping hardening against a threat model that does not apply is cargo-culting, not security.
<!-- /ANCHOR:adr-004-alternatives -->

---

<!-- ANCHOR:adr-004-consequences -->
### Consequences

**What improves**:
- No misleading "security" hardening is added to a single-trusted-host tool.

**What it costs**:
- If a multi-writer mode is ever adopted, the pair must be revisited. Mitigation: the gate is recorded.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Multi-writer mode adopted later without revisiting | L | Recorded PENDING behind the multi-writer-adoption gate |
<!-- /ANCHOR:adr-004-consequences -->

---

<!-- ANCHOR:adr-004-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The threat model was re-verified absent (iter-23) |
| 2 | **Beyond Local Maxima?** | PASS | Build-now options were rejected with the threat-model reason |
| 3 | **Sufficient?** | PASS | Documenting the gate preserves the future path |
| 4 | **Fits Goal?** | PASS | The foundation is determinism, not multi-writer hardening |
| 5 | **Open Horizons?** | PASS | The pair revives only under a multi-writer adoption |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-004-five-checks -->

---

<!-- ANCHOR:adr-004-impl -->
### Implementation

**What changes**:
- M-dual-class-identity and M-clock-skew-replay-window stay unbuilt, recorded PENDING in `spec.md` §13, `tasks.md` T008/T009.

**How to roll back**: No code rollback required, this is a non-ship decision.
<!-- /ANCHOR:adr-004-impl -->
<!-- /ANCHOR:adr-004 -->
