---
title: "Decision Record: Skill Advisor C4 Shadow Seam + Beta Posterior"
description: "The two load-bearing architecture decisions for the C4 sub-phase: C4 is a shadow-only BUILD (not a graduation), and the Beta reliability math is one shared f64 primitive with thin per-consumer adapters co-owned with Deep-Loop D2."
trigger_phrases:
  - "advisor c4 shadow seam decision record"
  - "advisor beta posterior adr"
  - "skill advisor reliability shared primitive decision"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/003-skill-advisor/004-c4-shadow-seam-beta-posterior"
    last_updated_at: "2026-06-19T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Author decision record for the C4 shadow-seam + Beta-posterior sub-phase"
    next_safe_action: "Begin Phase 0 baseline capture; implement against ADR-001/ADR-002"
    blockers: []
    key_files:
      - "decision-record.md"
      - "spec.md"
      - "plan.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-19-028-003-004-c4-shadow-seam"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Decision Record: Skill Advisor C4 Shadow Seam + Beta Posterior

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: C4 is a shadow-only BUILD, not a graduation

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-06-19 |
| **Deciders** | Michel Kerkmeester, claude-opus-4-8 |

---

<!-- ANCHOR:adr-001-context -->
### Context

The pass-1 research framed C4 as graduating an already-shipped Beta estimator to live. We read the live scorer and that framing is false. The estimator `reduceAdvisorFeedbackCalibration` is raw-frequency, not Bayesian: the proposed weight delta is `round4(clamp((acceptancePressure − correctionPressure) × MAX_WEIGHT_DELTA, ...))` (`feedback-calibration.ts:176`), a symmetric single clamp gated by a binary `minSamples` cliff (`:193-197`). A grep for `posterior|prior|alpha|beta` across the advisor scorer dir returns zero hits in `feedback-calibration.ts` (iter-14 G3). There is no Beta math to graduate. Two harder facts compound it: the estimator's proposal is written to a JSONL log that no out-of-process consumer ever reads back into the shadow-weight registry, so the learning loop never closes (the C4-seam, iter-10 GO); and 027 shipped no per-lane outcome attribution, so `laneAttributionBySkill` collapses to identical workspace totals (`:163-169`) and even a correct posterior would have no per-lane signal to tune.

### Constraints

- The live skill-recommendation path must stay byte-identical: a bad reliability weight cannot be allowed to corrupt routing.
- The guardrails already in the code are load-bearing and must remain TRUE: `defaultOff:true, shadowOnly:true, liveWeightsFrozen:true, autoPromotion:false, heldOutValidationRequired:true` (`feedback-calibration.ts:230-237`).
- No leverage number may be quoted: the asserted "~13% confidence skew" is unsourced (grep across `.opencode/specs` + `system-skill-advisor` = 0, iter-17 J7); a real baseline must be captured first.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: Build the Beta posterior, the estimator→registry seam, and the aionforge promotion-gate family from scratch, keeping the entire pipeline shadow-only behind `liveWeightsFrozen` and gating any live flip behind a micro-benchmark that must beat today's `minSamples` cliff (NO-GO until it does).

**How it works**: An out-of-process promoter (cron/maintenance, never a prompt-time hook) reads the estimator's `ReadOnlyScorerCalibrationProposal` from the feedback-calibration JSONL, folds it through a new shared Beta posterior plus the two-gate + held-out attestation machinery, and writes only the non-live shadow-weight channel (`SPECKIT_ADVISOR_LANE_SHADOW_WEIGHTS_JSON` → `RESOLVED_SHADOW_WEIGHTS`, `lane-registry.ts:71-74`). The live scorer is never on this path, and a guardrail unit test asserts no code route can move a live lane weight.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Shadow-only BUILD + NO-GO live gate (chosen)** | Closes the disconnected loop; net-new math is correct and flood-immune; zero live-routing blast radius | Larger than a flag flip; net-new out-of-process seam + gate family | 9/10 |
| Graduate the existing estimator to live | Cheap if it were real | There is no Beta math to graduate; the estimator is raw-frequency (`:176`); would ship nothing | 1/10 |
| Reuse `deep-loop-runtime/lib/deep-loop/bayesian-scorer.ts` integer scorer | Avoids a new module | `computeScore` throws `RangeError` on non-integer inputs (`:14-15`) the fractional posterior needs; wrong shape | 2/10 |

**Why this one**: The loop is genuinely half-built and disconnected; the only honest path is to build the missing math and seam, and the only safe path is to keep it off the live lane until a benchmark earns the flip.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- The shadow learning loop becomes a real loop: the estimator's proposal finally reaches the shadow-weight registry instead of dead-ending in a write-only JSONL.
- Lane reliability becomes flood-immune: 8 all-accepted samples no longer max the delta identically to a 10,000-sample signal (the `minSamples` cliff is replaced by a continuous posterior, NEEDS-BENCHMARK).

**What it costs**:
- Net-new math, a net-new out-of-process promoter, and a gate family. Mitigation: build in dependency order (Phase-0 foundation → seam → posterior → gates) so each layer is independently testable.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A shadow weight leaks into live routing | H | `liveWeightsFrozen:true` stays TRUE (`:233`); a guardrail unit test asserts no live write is reachable |
| Treating C4 as a graduation ships nothing | M | This ADR fixes the framing: it is a from-scratch BUILD; the live estimator is raw-frequency (`:176`) |
| Quoting the unsourced ~13% skew | M | Capture a real baseline in `scratch/` first; the number is asserted, grep=0 (iter-17) |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The estimator→registry loop is confirmed disconnected (iter-10); no Beta math exists (iter-14). The need is real, not hypothetical |
| 2 | **Beyond Local Maxima?** | PASS | Three alternatives weighed (graduate-existing, reuse-integer-scorer, shadow-build); the integer scorer was read live and rejected on the RangeError |
| 3 | **Sufficient?** | PASS | Shadow-only + NO-GO gate is the minimum safe build; no live flip is attempted, no schema migration is introduced |
| 4 | **Fits Goal?** | PASS | C4 is the campaign's sequenced critical path (Phase-0 → seam → posterior → two-gate → held-out → decay); on-path, not a side quest |
| 5 | **Open Horizons?** | PASS | The shared Beta primitive is reused by Deep-Loop D2; the seam unblocks later per-lane attribution and the eventual benchmark-gated live flip |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- `feedback-calibration.ts` gains a Beta lane signal, sign-locked asymmetric threshold deltas (`:200-201`), a content-addressed fold over the JSONL (`:241-251`), and a cold-start neutral prior replacing the exclude-on-low-sample path (`:193-197`).
- A new out-of-process promoter script reads the proposal and writes the shadow-weight channel; `lane-registry.ts` gains a decay/un-promotion revert path with audit tags (`:71-74`).
- New unit tests cover the Beta math, the gate, the fold, and the shadow-only guardrail; a baseline-capture harness lives in `scratch/`.

**How to roll back**: Unset `SPECKIT_ADVISOR_LANE_SHADOW_WEIGHTS_JSON` to restore default shadow weights, then revert the per-candidate scoped commits. No live weight ever changes, so rollback is reversion-only with no data migration; verify the live recommend path is byte-identical to the captured baseline.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: One shared Beta f64 primitive + thin per-consumer adapters

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-06-19 |
| **Deciders** | Michel Kerkmeester, claude-opus-4-8, (Deep-Loop D2 co-owner) |

---

<!-- ANCHOR:adr-002-context -->
### Context

The anti-flood Beta posterior is needed by two subsystems at once: Skill Advisor C4 and Deep-Loop D2 (roadmap §4 shared-infra). The naive reading is "one module, three identical callers." The corrected reading (synthesis 04 RC6, 006 revisit) is that the consumers are NOT identical: the advisor consumes the posterior as a weight-delta, D2 consumes it as a posterior mean, and the third proxy consumer (procedural) is proxy-only. The existing integer scorer cannot be the shared primitive because it throws on the fractional inputs both real consumers need.

### Constraints

- Build the keystone math exactly once so the two subsystems cannot drift into divergent forks.
- The advisor side must not reuse `deep-loop-runtime/lib/deep-loop/bayesian-scorer.ts` `computeScore` (`:13-25`): it throws `RangeError` on non-integer inputs (`:14-15`); the file is 44 lines and the synthesis `:182-191` citation is stale.
- The Deep-Loop D2 consumer wiring lands in its own subsystem (028/004); this sub-phase owns only the shared primitive plus the advisor adapter.
<!-- /ANCHOR:adr-002-context -->

---

<!-- ANCHOR:adr-002-decision -->
### Decision

**We chose**: Build one f64 primitive `(α₀+s)/(α₀+β₀+s+f)` with a cold-start neutral 0.5 (Beta(1,1)) and a count floor, plus a thin advisor adapter that turns the posterior into a weight-delta, and coordinate the module location and signature with the Deep-Loop subsystem.

**How it works**: The primitive is pure f64 math with commuting α/β increments (folds are order-independent and replay-idempotent). The advisor adapter maps lane outcome counts onto the primitive and emits a bounded weight-delta for the shadow channel; the D2 adapter (built in 028/004) maps finding counts onto the same primitive and emits a posterior mean. Neither adapter reimplements the math.
<!-- /ANCHOR:adr-002-decision -->

---

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **One f64 primitive + thin adapters (chosen)** | No divergent fork; each consumer keeps its own output shape; testable once | Requires cross-subsystem coordination on module location | 9/10 |
| Advisor builds its own Beta in `feedback-calibration.ts` | No coordination needed | Duplicates the keystone math; guaranteed drift from D2 | 3/10 |
| Extend the integer scorer to accept floats | Reuses an existing file | Breaks its integer contract (`:14-15` throws by design); risks the live D-scorer | 2/10 |

**Why this one**: A single source of truth for the reliability math is the only way to keep two subsystems' flood-resistance invariants identical; the per-consumer output difference is an adapter concern, not a reason to fork.
<!-- /ANCHOR:adr-002-alternatives -->

---

<!-- ANCHOR:adr-002-consequences -->
### Consequences

**What improves**:
- One audited implementation of `(α₀+s)/(α₀+β₀+s+f)` with shared commutativity/cold-start/anti-flood tests serves both subsystems.
- The advisor and D2 cannot silently disagree on what "reliable" means.

**What it costs**:
- A cross-subsystem coordination point on where the module lives and its signature. Mitigation: agree the location beside `rrf-fusion.ts` (006 revisit) and freeze the signature before both adapters are written.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| The two adapters fork the primitive anyway | M | Land the primitive + its test suite first; both adapters import it, neither copies the math |
| Module-location churn breaks one consumer | M | Decide location once (T010 coordination), then write adapters against the frozen path |
<!-- /ANCHOR:adr-002-consequences -->

---

<!-- ANCHOR:adr-002-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Two confirmed consumers (Advisor C4, Deep-Loop D2) need the same posterior; building it twice guarantees drift |
| 2 | **Beyond Local Maxima?** | PASS | The "one module, three identical callers" reading was explicitly corrected (RC6); per-consumer shapes were enumerated |
| 3 | **Sufficient?** | PASS | One f64 primitive + thin adapters is the minimum that avoids a fork; no over-abstraction |
| 4 | **Fits Goal?** | PASS | The Beta primitive is the keystone the gate family consumes; on the critical path |
| 5 | **Open Horizons?** | PASS | A shared primitive is reusable by any future reliability consumer without re-deriving the math |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-002-five-checks -->

---

<!-- ANCHOR:adr-002-impl -->
### Implementation

**What changes**:
- A new shared module (e.g. `beta-reliability.ts`) holds the f64 primitive `(α₀+s)/(α₀+β₀+s+f)` with cold-start 0.5, a count floor, and commuting folds.
- A new thin advisor adapter consumes the posterior as a bounded weight-delta and feeds the C4-seam promoter; the D2 adapter is out of scope here (lands in 028/004).

**How to roll back**: The primitive is a new, additive module with no live consumer until the shadow promoter is wired; delete the module and adapter and revert the scoped commits. The live scorer never imported it, so there is nothing to unwind on the live path.
<!-- /ANCHOR:adr-002-impl -->
<!-- /ANCHOR:adr-002 -->

---

## RELATED DOCUMENTS

- **Specification**: `spec.md` (REQ-005/REQ-011, ADR mapping in §9-10).
- **Plan**: `plan.md` (§3 Architecture, L3 ADR-001/ADR-002, FIX ADDENDUM affected surfaces).
- **Tasks**: `tasks.md` (T008-T010 Beta primitive + adapter; T021 NO-GO record).
- **Checklist**: `checklist.md` (CHK-100 architecture decisions documented).
- **Source research**: `../research/research.md` (Internal Baseline + Broadening Addendum), `../../research/roadmap.md` (spine 5 + §2/§4), `../../research/synthesis/{01,04}-*` (RC6 shared-primitive correction); deltas `iter-010.jsonl` (C4-seam GO), `iter-014.jsonl` (no Beta math), `iter-016.jsonl` (build sequence + D2 sharing), `iter-017.jsonl` (13% unsourced).
- **Shipped record (historical evidence)**: Wave-0 record (line 106 lists Advisor C4 / C5 as NO-GO until benchmarked/built; no advisor candidate shipped).

<!--
Level 3 Decision Record (Addendum): One ADR per major decision.
Write in human voice: active, direct, specific. No em dashes, no hedging.
HVR rules: .opencode/skills/sk-doc/references/hvr_rules.md
-->
