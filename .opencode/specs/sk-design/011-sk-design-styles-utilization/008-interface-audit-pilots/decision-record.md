---
title: "Decision Record: interface + audit contrasting pilots"
description: "Level-3 architecture decisions for the two contrasting styles-library pilots: corpus as falsification infrastructure, the interface decision-only handoff, the audit strict non-authority contract, and the choice of two contrasting pilots before the relationship-heavy modes. All ADRs proposed — scaffold only."
trigger_phrases:
  - "interface audit pilots decisions"
  - "design-interface pilot adr"
  - "design-audit non-authority adr"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-design/011-sk-design-styles-utilization/008-interface-audit-pilots"
    last_updated_at: "2026-07-18T13:40:00Z"
    last_updated_by: "claude"
    recent_action: "Authored the interface/audit pilots scaffold (six L3 planning docs)"
    next_safe_action: "Wire the phase-007 seam into design-interface, then design-audit"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "decision-record.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-iface-audit-011-008"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Decision Record: interface + audit contrasting pilots

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Corpus as Falsification Infrastructure

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Proposed |
| **Date** | 2026-07-18 |
| **Deciders** | sk-design maintainers |

---

<!-- ANCHOR:adr-001-context -->
### Context

The styles library could be treated as an authority that selects direction, proves properties, or dictates fixes. The global-modes research (`../003-global-modes-utilization/research/lineages/sol/research.md` §11) rejected that framing: the corpus is evidence, not authority. Both pilots need a shared stance on what the corpus is for before either wires it in.

### Constraints

- The corpus must never select a mode, prove accessibility or performance, assign severity, establish copying, or authorize exact reuse.
- Both pilots share one phase-007 envelope, so a split stance would fork the seam.
- Negative results must be expressible outcomes.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: Treat the corpus as falsification infrastructure whose primary value is proving that unsafe integrations fail, through counterexamples.

**How it works**: Each pilot ships fixtures where a low-fit anchor or an absent comparison forces a fail-closed outcome (`anchor:null`, `no-fit`, `comparison-unavailable`) rather than a forced result. The corpus may explain relationships, expose counterexamples, and sharpen critique, but it may not decide or prove.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Falsification infrastructure** | Keeps corpus non-authoritative, encodes fail-closed by construction | Requires counterexample fixtures up front | 9/10 |
| Corpus as scored recommender | Simple ranking UX | Smuggles authority into the corpus, violates the research verdict | 3/10 |
| Corpus as raw reference dump | Minimal contract | No proof of safety, over-fits per mode | 4/10 |

**Why this one**: Falsification infrastructure is the only option that makes non-authority verifiable rather than aspirational, because the fixtures assert it.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- Non-authority becomes a testable property via fail-closed fixtures.
- Both pilots share one honest stance on the corpus.

**What it costs**:
- Up-front counterexample fixtures cost authoring time. Mitigation: they double as the verification suite.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Corpus creep into authority | H | Fail-closed fixtures assert non-authority per pilot |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Both pilots need one shared stance on corpus authority before wiring |
| 2 | **Beyond Local Maxima?** | PASS | Scored-recommender and raw-dump alternatives were weighed and rejected |
| 3 | **Sufficient?** | PASS | Fail-closed fixtures are the simplest way to make non-authority testable |
| 4 | **Fits Goal?** | PASS | On the critical path: stabilizes the shared fields for phase 009 |
| 5 | **Open Horizons?** | PASS | Counterexample fixtures generalize to later corpus consumers |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- `design-interface/` and `design-audit/` gain fail-closed fixtures.
- The maintainer fixture atlas gains counterexample cases.

**How to roll back**: Feature-gate the consumers off so the corpus stops being consumed; the fixtures remain as inert test data.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

## ADR-002: Interface Decision-Only, Source-Aware Handoff

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Proposed |
| **Date** | 2026-07-18 |
| **Deciders** | sk-design maintainers |

---

### Context

`design-interface` grounds creative direction in a retrieved anchor and an optional bounded contrast. What it hands to the target render must improve anti-default direction without leaking raw corpus style bodies or overriding the brief/owned system.

### Constraints

- Must not override the brief/owned system, target render, or preflight.
- Must be traceable to the anchor/contrast that produced it.
- Must not paste raw style content into downstream stages.

---

### Decision

**We chose**: The interface handoff carries decisions and their corpus sources only, never raw style bodies.

**How it works**: The pilot retrieves 1 coherent anchor plus an optional bounded contrast or rejected-default, builds a relational exemplar, and emits a handoff of the form decision plus source-provenance. It also records the counterfactual no-corpus default that changed after grounding.

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Decision-only, source-aware handoff** | No raw-content leakage, fully traceable, respects authority order | Requires a structured handoff schema | 9/10 |
| Raw exemplar passthrough | Simple | Leaks style bodies, invites copying, hard to trace | 3/10 |
| Anchor-id-only handoff | Minimal | Loses the decision rationale, downstream cannot act | 5/10 |

**Why this one**: Decision-only plus source keeps the handoff actionable and traceable while preventing raw-content leakage and authority override.

---

### Consequences

**What improves**:
- Anti-default direction improves with a traceable rationale.
- The counterfactual record makes grounding auditable.

**What it costs**:
- A structured handoff schema must be defined and shared. Mitigation: reuse the phase-007 handoff fields.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Handoff leaks raw content | M | Decision-only contract, verified by fixtures |

---

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The interface must hand something actionable downstream without leaking content |
| 2 | **Beyond Local Maxima?** | PASS | Raw passthrough and anchor-id-only were considered |
| 3 | **Sufficient?** | PASS | Decisions plus sources is the minimal actionable, traceable payload |
| 4 | **Fits Goal?** | PASS | Exercises the shared handoff fields the seam must generalize |
| 5 | **Open Horizons?** | PASS | The schema is reusable by later generative modes |

**Checks Summary**: 5/5 PASS

---

### Implementation

**What changes**:
- `design-interface/` gains the handoff emitter and counterfactual recorder.
- The phase-007 handoff fields are bound to interface decisions.

**How to roll back**: Disable the interface consumer so the mode returns to un-grounded direction.

---

## ADR-003: Audit Corpus Is Strictly Non-Authoritative

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Proposed |
| **Date** | 2026-07-18 |
| **Deciders** | sk-design maintainers |

---

### Context

`design-audit` is a critique mode. The corpus could tempt it to assign severity, prove accessibility or performance, or claim copying, all of which require target evidence rather than reference material. The comparison lane must stay context-only.

### Constraints

- 0–2 comparison references, used as non-authoritative context.
- Any verdict (severity, score, WCAG, perf, copying, fix) needs target evidence.
- Intended-anchor drift is context, not a finding on its own.

---

### Decision

**We chose**: The audit corpus provides non-authoritative comparison context and drift fixtures only; it never assigns severity or score, proves WCAG or perf, establishes copying, or owns fixes.

**How it works**: The lane retrieves 0–2 comparison refs, labels them as context, and emits intended-anchor drift fixtures with evidence labels. When no ref exists it emits `comparison-unavailable` and proceeds on target evidence alone. Where corpus context contradicts target evidence, target evidence wins.

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Strictly non-authoritative context** | Keeps verdicts grounded in target evidence, honest labels | Analysts must not over-read the context | 9/10 |
| Corpus-scored audit findings | Fast triage | Fabricates authority the corpus does not have | 2/10 |
| No corpus in audit | Zero risk | Loses drift detection and comparison context | 5/10 |

**Why this one**: Non-authoritative context preserves the drift and comparison value while keeping every verdict anchored to target evidence.

---

### Consequences

**What improves**:
- Verdicts stay grounded in target evidence.
- `comparison-unavailable` is a valid, first-class outcome.

**What it costs**:
- Analysts may be tempted to over-read context. Mitigation: explicit evidence labels and non-authority guards.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Corpus assigns a verdict | H | Non-authority guards plus fixtures assert it cannot |

---

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Audit needs corpus context without corpus authority |
| 2 | **Beyond Local Maxima?** | PASS | Scored findings and no-corpus were considered |
| 3 | **Sufficient?** | PASS | Context plus drift fixtures is enough without a verdict path |
| 4 | **Fits Goal?** | PASS | The critique consumer contrasts with the generative pilot |
| 5 | **Open Horizons?** | PASS | Non-authority pattern reuses across future critique modes |

**Checks Summary**: 5/5 PASS

---

### Implementation

**What changes**:
- `design-audit/` gains comparison retrieval, the drift detector, and evidence labels.
- Non-authority guards are added to the audit output path.

**How to roll back**: Disable the audit consumer so the mode audits on target evidence only.

---

## ADR-004: Two Contrasting Pilots Before Relationship-Heavy Modes

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Proposed |
| **Date** | 2026-07-18 |
| **Deciders** | sk-design maintainers |

---

### Context

The phase-007 shared seam defines proof and handoff fields that every future mode will consume. If the first consumer is a single mode, the fields risk over-fitting that mode's shape before foundations and motion (phase 009) arrive.

### Constraints

- Foundations and motion are the highest-complexity consumers and should inherit stable fields.
- The research sequence (§15) places two contrasting pilots as Phase B, before the relationship-heavy modes in Phase C.

---

### Decision

**We chose**: Land two deliberately contrasting pilots, a generative consumer (interface) and a critique consumer (audit), before the relationship-heavy modes, using their contrast to force the shared fields to be general.

**How it works**: Interface (creative grounding, decision-only handoff) and audit (non-authoritative comparison, drift) exercise the same phase-007 proof/handoff fields from opposite directions. Fields that survive both are general enough for phase 009.

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Two contrasting pilots first** | Forces general fields, de-risks phase 009 | Two modes in flight at once | 9/10 |
| Single pilot then generalize later | Simpler first step | Over-fits the seam, rework in phase 009 | 4/10 |
| Straight to foundations/motion | Highest-value modes first | Complex modes on unproven fields | 3/10 |

**Why this one**: The contrast is the mechanism that generalizes the shared fields at the lowest total cost.

---

### Consequences

**What improves**:
- Shared proof/handoff fields are validated by opposite jobs.
- Phase 009 inherits stable fields.

**What it costs**:
- Two modes in flight increases coordination. Mitigation: a shared contract-binding phase runs first.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Seam still over-fits | M | Cross-pilot shared-field verification (T017) |

---

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Phase 009 needs stable shared fields to inherit |
| 2 | **Beyond Local Maxima?** | PASS | Single-pilot and straight-to-009 were considered |
| 3 | **Sufficient?** | PASS | Two contrasting consumers is the minimum to generalize the fields |
| 4 | **Fits Goal?** | PASS | Directly sequences Phase B before Phase C |
| 5 | **Open Horizons?** | PASS | Generalized fields serve every later consumer |

**Checks Summary**: 5/5 PASS

---

### Implementation

**What changes**:
- Both pilots bind to the phase-007 proof/handoff fields.
- A cross-pilot verification step confirms field generality.

**How to roll back**: Ship only one pilot and defer field generalization, accepting phase-009 rework risk.

---

<!--
Level 3 Decision Record: One ADR per major decision.
All ADRs proposed — scaffold; implementation not started. ADRs move to Accepted before completion.
HVR rules: .opencode/skills/sk-doc/references/hvr_rules.md
-->
