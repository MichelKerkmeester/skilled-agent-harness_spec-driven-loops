---
title: "Decision Record: Deep Improvement Common Promotion Reference Boundary"
description: "Accepts format-only promotion authorization validation at the schema layer and assigns decision authentication to the phase-014 cutover fold."
trigger_phrases:
  - "deep improvement common promotion reference"
  - "external authorization authenticity"
  - "phase 014 promotion authentication"
importance_tier: "high"
contextType: "implementation"
parent: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/004-deep-improvement-common/001-typed-ledger-schema"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/004-deep-improvement-common/001-typed-ledger-schema"
    last_updated_at: "2026-07-23T09:11:00Z"
    last_updated_by: "codex"
    recent_action: "Accepted the schema-only promotion reference boundary"
    next_safe_action: "Authenticate promotion references during phase-014 cutover"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/lib/deep-improvement-common-ledger-schema/deep-improvement-common-ledger-schema.ts"
      - ".opencode/skills/system-deep-loop/runtime/tests/unit/deep-improvement-common-ledger-schema.vitest.ts"
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "The schema validates promotion authorization reference format only"
      - "Phase 014 authenticates the reference against a real gateway decision"
---
# Decision Record: Deep Improvement Common Promotion Reference Boundary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr-rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Keep Promotion Decision Authentication Outside the Schema Leaf

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-07-23 |
| **Deciders** | Deep Improvement Common typed-ledger schema owners |

---

<!-- ANCHOR:adr-001-context -->
### Context

`promotion_authorized.externalAuthorizationRef` must identify an external transition decision rather than a score or
canary result. The schema can reject missing values, wrong prefixes, spaces, and malformed tokens. It cannot prove that
a syntactically valid reference was issued by `TransitionAuthorizationGateway`, is current for the proposal and
authority epoch, or matches a durable decision in prior ledger history.

Authenticating the reference requires historical state: folded prior events or an authenticated migration registry.
Adding that lookup here would turn a pure event-shape validator into a reducer or cutover authority. This is the same
schema-only boundary already accepted for store observations and source-tail sequence relationships.

### Constraints

- The leaf remains additive-dark and does not read prior ledger state.
- The shared gateway and authorized ledger remain the only write-authorization authority.
- Promotion payloads still require the transition-authorization reference format and its digest.
- Authority cutover must fail closed when the referenced decision cannot be authenticated.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: Keep `externalAuthorizationRef` format validation in this schema and assign reference authentication to
phase 014.

The schema accepts only `transition-authorization:*` tokens and continues to reject score-derived self-authorization.
Phase 014 must resolve the reference against a real `TransitionAuthorizationGateway` decision while folding prior
events or an authenticated migration registry. Missing, fabricated, stale, proposal-mismatched, or epoch-mismatched
decisions must block cutover.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Format here; authenticate during phase-014 folding** | Keeps the schema pure and gives cutover access to the required history | A fabricated but well-formed reference can pass schema preparation | 9/10 |
| Query gateway decisions from the schema validator | Rejects fabricated references earlier | Couples pure validation to mutable history and creates reducer behavior in this leaf | 2/10 |
| Add an in-memory allowlist of decision references | Small local check | Not authoritative, not replay-safe, and diverges from durable gateway state | 1/10 |

**Why this one**: Only the cutover fold has both the historical context and authority boundary needed to authenticate
the reference without creating a second decision source.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- Schema preparation remains deterministic and independent of external state.
- Score and canary payloads still cannot self-authorize promotion.
- Cutover owns one explicit fail-closed obligation for decision existence, proposal binding, and authority epoch.

**What it costs**:
- Schema success does not prove promotion-decision authenticity.
- Phase 014 must retain or reconstruct an authenticated decision registry before enabling authority.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A fabricated but well-formed reference reaches the cutover fold | H | Resolve it to a durable gateway decision and reject on absence or mismatch |
| A real decision is replayed for another proposal or epoch | H | Bind decision identity to proposal digest, requested transition, and authority epoch |
| A consumer mistakes schema validity for cutover authorization | H | Preserve additive-dark posture and document the phase-014 obligation at every cutover gate |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Reference authenticity cannot be derived from event shape alone |
| 2 | **Beyond Local Maxima?** | PASS | The decision compares historical folding with local allowlists and schema lookups |
| 3 | **Sufficient?** | PASS | Format validation plus fail-closed cutover authentication covers both layers |
| 4 | **Fits Goal?** | PASS | The schema stays pure and the cutover phase owns authority |
| 5 | **Open Horizons?** | PASS | An authenticated registry can support replay and migration without widening payloads |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- The schema continues to validate the `transition-authorization:*` reference shape and digest.
- This leaf records schema validity as distinct from decision authenticity.
- Phase 014 must authenticate the reference against a durable gateway decision before authority cutover.

**How to roll back**: Remove this additive documentation together with the schema module if the dark path is retired.
No authoritative writer or stored state is changed.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->
