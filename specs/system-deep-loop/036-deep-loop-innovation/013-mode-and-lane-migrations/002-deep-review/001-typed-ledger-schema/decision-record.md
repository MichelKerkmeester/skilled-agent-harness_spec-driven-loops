---
title: "Decision Record: Deep Review Candidate and Adjudication Boundary"
description: "Records the closed field-kind discipline and the requirement that severity-bearing finding state bind a typed adjudication event and payload digest."
trigger_phrases:
  - "deep review candidate adjudication boundary"
  - "deep review severity activation"
  - "deep review ledger field kinds"
importance_tier: "high"
contextType: "implementation"
parent: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/002-deep-review/001-typed-ledger-schema"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/002-deep-review/001-typed-ledger-schema"
    last_updated_at: "2026-07-23T10:00:00Z"
    last_updated_by: "codex"
    recent_action: "Bound finding severity to typed adjudication"
    next_safe_action: "Preserve this boundary in reducer state"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/lib/deep-review-ledger-schema/deep-review-ledger-types.ts"
      - ".opencode/skills/system-deep-loop/runtime/lib/deep-review-ledger-schema/deep-review-ledger-schema.ts"
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Candidates cannot carry P0/P1/P2 severity"
      - "Severity-bearing state changes bind an adjudication event and payload digest"
---
# Decision Record: Deep Review Candidate and Adjudication Boundary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr-rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Keep Candidate Observations Separate from Verdict-Bearing Adjudication

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-07-23 |
| **Deciders** | Deep Review typed-ledger schema owners |

---

<!-- ANCHOR:adr-001-context -->
### Context

Deep Review emits possible defects before independent evidence and claim adjudication determine publication status. If a candidate payload can carry P0/P1/P2 directly, raw model or analyzer confidence becomes indistinguishable from an accepted verdict. A generic event reference on later finding state is also too weak because it does not bind the adjudication content that authorized the severity.

The schema must preserve orthogonal impact and confidence, retain raw evidence separately, and remain additive-dark. It cannot add a reducer, query historical state, change gateway policy, or introduce a second authorization mechanism.

### Constraints

- Candidate, evidence, adjudication, lineage, and finding state remain separate append-only events.
- Every payload and nested object uses an exact allowed-key set and semantic field validators.
- Authorization proof and durable decision references remain owned by the frozen gateway and ledger.
- A schema reference can bind identity and digest, while historical existence checks belong to the reducer and projection sibling.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: Candidate events carry impact, raw confidence, raw candidate score, actionability, reachability, exploitability, evidence class and scope, raw observation digest, and semantic fingerprint, but no severity or verdict field.

Only `claim_adjudication_recorded` carries `finalSeverity`. P0/P1/P2 is valid only with an accepted adjudication that contains evidence references, counterevidence sought, an alternative-explanation digest, separate impact and confidence values, a downgrade trigger, transition, validator fingerprint, and adjudication outcome.

`finding_state_changed` can record a severity transition only when it also carries the adjudication event ID and adjudication payload digest. The next sibling must resolve that typed reference against ledger history before folding verdict-bearing state.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Separate candidate and adjudication events with a digest-bound state reference** | Preserves raw observations, makes severity provenance explicit, and stays append-only | Historical reference resolution remains a reducer responsibility | 9/10 |
| Put optional severity on the candidate | Fewer events | Lets producer confidence silently become a verdict and weakens replay evidence | 1/10 |
| Keep separate events but reference only an event ID | Simple shape | Does not bind the exact adjudication payload used for the transition | 5/10 |

**Why this one**: The selected boundary is the strongest referential contract available inside a schema-only leaf without importing reducer or authority behavior.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- Candidate fixtures reject P0/P1/P2 and any synonym field before authorization.
- Adjudication preserves impact and confidence as separate axes.
- Finding-state severity changes bind both adjudication identity and content.
- Raw evidence remains immutable and separately replayable.

**What it costs**:
- Producers must emit an adjudication event before a severity-bearing state transition.
- The next sibling must verify that the referenced event exists, targets the same candidate and finding, and matches the recorded payload digest.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A producer forges a syntactically valid adjudication reference | H | The reducer sibling resolves event identity, candidate/finding scope, and payload digest before folding state |
| A new field bypasses semantic validation | H | Exact field tables and a dispatcher without a default reject unclassified fields |
| A legacy mutation lacks candidate or adjudication identity | M | Return `pin-old-runtime` rather than synthesize identity from prose |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The mode contract requires candidates to remain non-verdict-bearing before adjudication |
| 2 | **Beyond Local Maxima?** | PASS | The design separates event families instead of denying only known severity keys |
| 3 | **Sufficient?** | PASS | Closed candidate shape plus accepted adjudication and digest-bound state reference cover schema-level authority |
| 4 | **Fits Goal?** | PASS | The decision adds schema contracts and tests only |
| 5 | **Open Horizons?** | PASS | The next sibling can add historical referential checks without widening payloads |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- `deep-review-ledger-types.ts` defines distinct candidate, evidence, adjudication, lineage, and state-change payloads.
- `deep-review-ledger-schema.ts` gives each field one semantic rule and rejects unknown keys.
- The targeted Vitest suite proves the candidate-severity guard is non-vacuous and exercises accepted adjudication through the real authorized append path.

**How to roll back**: Remove the additive module, test, and leaf documentation together. No authoritative writer or stored state is migrated.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->
