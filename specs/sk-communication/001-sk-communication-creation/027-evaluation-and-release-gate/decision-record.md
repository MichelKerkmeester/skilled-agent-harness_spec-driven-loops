---
title: "Decision Record: Phase 027 Evaluation and Release Gate"
description: "Architecture decisions for Phase 027: compose the blind non-inferiority verdict as a reject-only production consult, and gate rollout on dated, expiring non-inferiority plus smoke plus canary evidence."
trigger_phrases:
  - "evaluation-and-release-gate"
  - "architecture decision"
  - "reject-only consult and dated rollout gate"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-communication/001-sk-communication-creation/027-evaluation-and-release-gate"
    last_updated_at: "2026-08-14T09:24:23.000Z"
    last_updated_by: "opencode"
    recent_action: "Accepted and verified the reject-only consult and dated rollout gate decisions."
    next_safe_action: "Proceed to operator rollout documentation with the validated release evidence contract."
    blockers: []
    key_files:
      - "decision-record.md"
      - "spec.md"
      - "plan.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-027-evaluation-release-20260814"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "The evaluation verdict is a reject-only consult at the production offer seam, not an advisory scoreboard."
      - "Rollout readiness requires dated, expiring non-inferiority plus smoke plus canary evidence."
---
# Decision Record: Phase 027 Evaluation and Release Gate

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr-rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Compose the evaluation verdict as a reject-only consult in the production path

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-08-14 |
| **Deciders** | Project owner and implementer at closeout |

---

<!-- ANCHOR:adr-001-context -->
### Context

The projection layer may only ship where it reads at least as well as the original. The Phase 007 harness already produces a blind non-inferiority verdict, but the production projection path does not yet consult it before offering projection for a runtime / prompt-profile combination. Without the consult, a combination with a failing or inconclusive verdict can still be offered, which breaks the ship-only-where-it-reads-as-well rule.

### Constraints

- The consult must not change the Phase 007 statistics, margins, or frozen pre-registration.
- The consult must never produce a rewrite that the verdict rejects.
- The consult must be deterministic and testable for every runtime / prompt-profile combination.
- The fidelity boundary and canonical bytes must stay unchanged.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We decided**: compose the evaluation verdict as a reject-only consult at the production offer seam, before projection is offered for any runtime / prompt-profile combination.

**How it works**: the offer path calls the evaluation verdict for the combination and consults the result. Any fail or inconclusive verdict returns the exact original and never a rewrite. Only a fresh, approved verdict lets projection be offered. Diagnostic metrics stay diagnostic and never affect the decision, mirroring `evaluateReleaseGate`, whose `releaseApproved` is true only when the status is `pass`.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| Reject-only offer-seam consult | Ship-only-where-proven, never rewrites a rejected verdict, deterministic and testable | Every offer path must call the consult | 9/10 |
| Advisory scoreboard that never blocks | No production change | A failing verdict can still be offered, which breaks the core rule | 2/10 |
| Gate only at release time | Single chokepoint | Offers still happen between releases, so a regression ships before the gate runs | 5/10 |

**Why this one**: the reject-only consult enforces the ship-only-where-proven rule at the point where projection is actually offered, and it reuses the verified Phase 007 verdict unchanged.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:

- A failing or inconclusive verdict can no longer produce a projection offer.
- The offer decision is a pure function of the verdict, so it is exhaustively testable.

**What it costs**:

- Each offer path must call the consult. Mitigation: the consult is a single, named entry point reused across runtime / prompt-profile combinations.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| An offer path forgets the consult and offers projection anyway. | High | The projection contract requires the consult before any rewrite, and the reject-only policy is enforced by the shared entry point. |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | Necessary? | PASS | Production offers are not yet gated on the non-inferiority verdict the harness already produces. |
| 2 | Beyond local maxima? | PASS | Reject-only consult, advisory scoreboard, and release-only gating were compared. |
| 3 | Sufficient? | PASS | One shared reject-only consult is the smallest design that meets the requirement. |
| 4 | Fits goal? | PASS | It ships projection only where it reads at least as well as the original. |
| 5 | Open horizons? | PASS | New runtime / prompt-profile combinations reuse the same consult without code changes. |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:

- `src/runtimes/adapter.ts`: consult the evaluation verdict before projection is offered for a runtime / prompt-profile combination.
- The consult returns the exact original on any fail or inconclusive verdict and never rewrites.
- New offer tests cover pass, fail, and inconclusive verdicts per combination.

**How to roll back**: revert the offer-seam consult only; projection returns to the pre-gate offer behavior.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: Gate rollout on dated, expiring non-inferiority plus smoke plus canary evidence

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-08-14 |
| **Deciders** | Project owner and implementer at closeout |

---

<!-- ANCHOR:adr-002-context -->
### Context

The multi-runtime rollout must never mark a runtime rollout-ready without fresh proof. The release gate already blocks on dated evidence, but rollout is not yet gated on the full set: non-inferiority plus the six-runtime smokes plus the privacy canaries. Without the gate, stale or provisional evidence can keep a runtime marked rollout-ready long after it stops being true.

### Constraints

- A runtime must not be marked rollout-ready without passing non-inferiority plus all six runtime smokes plus all privacy canaries.
- Every piece of evidence must be dated and expire.
- Only human-certifiable, non-provisional evidence may unblock a runtime.
- A measured regression on any dimension must block the gate.
<!-- /ANCHOR:adr-002-context -->

---

<!-- ANCHOR:adr-002-decision -->
### Decision

**We decided**: gate the multi-runtime rollout on dated, expiring non-inferiority plus smoke plus canary evidence through `evaluateReleaseReadiness`.

**How it works**: every evidence reference carries `observedAt` and `expiresAt`, and the gate rejects references that are missing, invalid, stale, or failing, mirroring the existing `assessDatedEvidence` and `ReleaseAbortReasonCodes`. Rollout readiness requires the evaluation to be human-certifiable and non-provisional, the six runtime smokes to pass for every `RuntimeId`, and the privacy canaries to report zero leaks. A measured regression on any non-inferiority dimension fails the gate, so `overallDecision` is `blocked` until the evidence is refreshed.
<!-- /ANCHOR:adr-002-decision -->

---

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|--------|
| Dated, expiring evidence across non-inferiority, smokes, and canaries | Fail-closed, honest, and reusable across runtimes | Every lane needs dated evidence to be produced | 9/10 |
| One-shot, undated evidence | Simple | Old proof keeps a runtime rollout-ready forever | 2/10 |
| Static support matrix without evaluation | Cheap | Ignores the non-inferiority verdict, so a regression still ships | 3/10 |

**Why this one**: the dated gate fails closed on stale, invalid, or failing evidence, and it reuses the verified release contracts instead of inventing a second gate.
<!-- /ANCHOR:adr-002-alternatives -->

---

<!-- ANCHOR:adr-002-consequences -->
### Consequences

**What improves**:

- No runtime is marked rollout-ready without fresh non-inferiority, smoke, and canary evidence.
- Stale or provisional evidence can no longer keep a runtime rollout-ready.

**What it costs**:

- The rollout process must produce and date evidence on every lane before a runtime can be marked rollout-ready. Mitigation: the gate names the missing or stale lane so the operator refreshes exactly what blocks.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A lane is forgotten or expires unnoticed. | Medium | The gate treats missing or stale evidence as blocked and reports the specific lane. |
| A provisional pass is treated as proof. | High | Only human-certifiable, non-provisional evaluation evidence unblocks rollout. |
<!-- /ANCHOR:adr-002-consequences -->

---

<!-- ANCHOR:adr-002-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | Necessary? | PASS | Rollout is not yet gated on the full dated evidence set. |
| 2 | Beyond local maxima? | PASS | One-shot and undated gates were compared and rejected. |
| 3 | Sufficient? | PASS | Dated non-inferiority plus smokes plus canaries is the smallest complete rollout gate. |
| 4 | Fits goal? | PASS | Rollout never precedes passing, fresh evidence. |
| 5 | Open horizons? | PASS | Additional runtimes reuse the same dated evidence lanes without code changes. |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-002-five-checks -->

---

<!-- ANCHOR:adr-002-impl -->
### Implementation

**What changes**:

- `src/release/release-gate.ts`: require fresh non-inferiority plus the six-runtime smokes plus the privacy canaries before a runtime is rollout-ready.
- `src/release/evidence.ts`: extend dated evidence references and expiry handling.
- New gate tests cover missing, stale, invalid, and failing evidence and a measured regression.

**How to roll back**: revert the release-gate and evidence-reference wiring; the gate returns to its prior evidence set.
<!-- /ANCHOR:adr-002-impl -->
<!-- /ANCHOR:adr-002 -->
