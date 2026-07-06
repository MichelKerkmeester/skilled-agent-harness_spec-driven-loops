---
title: "Decision Record: Phase 003 - Private Procedure Card Layer"
description: "Decision record choosing private mode-local procedure cards over a public fourteen-skill mirror for adapting external Claude design procedures."
trigger_phrases:
  - "private procedure cards decision"
  - "public skill mirror rejected"
  - "mode-local cards"
  - "single sk-design hub identity"
importance_tier: "high"
contextType: "decision"
_memory:
  continuity:
    packet_pointer: "design/009-sk-design-claude-parity/003-private-procedure-card-layer"
    last_updated_at: "2026-07-06T00:00:00.000Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Revalidated ADR-001."
    next_safe_action: "Use ADR-001 for Phase 004 routing integration."
---
# Decision Record: Phase 003 - Private Procedure Card Layer

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Use Private Mode-Local Procedure Cards

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted, implemented, and revalidated in Phase 003 |
| **Date** | 2026-07-05 |
| **Deciders** | Phase packet owner, user-provided task scope |

---

<!-- ANCHOR:adr-001-context -->
### Context

The parity effort needs to adapt fourteen external Claude design procedures into OpenCode behavior. The project already exposes `sk-design` as one public design skill with five modes, so turning each external procedure into a public OpenCode skill would make users choose among implementation details and would weaken the hub model. The phase also needs a safe source-adaptation layer because direct prompt copying is not acceptable.

### Constraints

- Preserve one public `sk-design` hub identity.
- Preserve the five current public modes unless a later decision changes the architecture.
- Keep external procedure text private and synthesized into OpenCode-native language.
- Use `shared/procedures/` only for real cross-mode orchestration.
- Make every procedure card testable through an output contract and proof gate.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: Adapt the external procedures into private procedure cards owned by the existing `sk-design` modes, with a narrow shared procedure bucket for cross-mode orchestration.

**How it works**: The public hub still routes to one of the five existing modes. The selected mode then chooses a private card when a card trigger matches the request, applies the card's procedure, and verifies the card's proof gate before claiming the procedure was followed.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Private mode-local procedure cards** | Preserves public hub, keeps procedures close to owning modes, supports source adaptation | Requires mode inventories and reviewer discipline | 9/10 |
| Public fourteen-skill mirror | Direct one-to-one mapping from external procedures | Fragments public taxonomy, exposes implementation details, increases copying risk | 3/10 |
| One shared global procedure library | Avoids public skill expansion and centralizes procedures | Encourages dumping unrelated mode logic into one place, weakens mode ownership | 5/10 |
| Inline procedure guidance in mode docs only | Simple file layout and no extra card concept | Harder to route, test, cite, and reuse cross-mode orchestration | 6/10 |

**Why this one**: Private mode-local cards solve the current adaptation need while keeping the user-facing interface stable and giving reviewers a concrete object to inspect for source safety and proof quality.
<!-- /ANCHOR:adr-001-alternatives -->

### Revalidation Note

No decision changed during the final verification pass. The live evidence still supports ADR-001: 14 private cards exist under mode-local or justified shared procedure folders, no new public mode or skill metadata was added, and the normalized source/card comparison found no 15-word verbatim source run in the cards.

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- Users keep one public `sk-design` entry point instead of learning fourteen procedure names.
- Mode authors get a structured way to add procedure behavior without hiding it in prose.
- Reviewers can audit source adaptation, mode fit, and proof gates card by card.

**What it costs**:
- Card inventories add a new private maintenance surface. Mitigation: keep ownership mode-local and require shared-placement rationale.
- Source adaptation takes more time than copying. Mitigation: require synthesis templates and citation fields so review is repeatable.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Shared bucket becomes a dumping ground | M | Require cross-mode rationale and owner for every shared card |
| Public docs leak private procedure taxonomy | H | Keep public docs focused on hub and modes, not card inventory |
| Cards become untestable advice | M | Require output contract and proof gate in the schema |
| External prompt wording is copied too closely | H | Review cards for synthesis and cite only safe source identifiers |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The phase must adapt external procedure value without exposing a public fourteen-skill taxonomy. |
| 2 | **Beyond Local Maxima?** | PASS | The decision compares public mirror, shared global library, inline mode docs, and private mode-local cards. |
| 3 | **Sufficient?** | PASS | Private cards add only the layer needed for schema, routing, source adaptation, and proof. |
| 4 | **Fits Goal?** | PASS | The approach preserves one public hub and maps procedures into the current five-mode architecture. |
| 5 | **Open Horizons?** | PASS | Later phases can promote or reorganize cards through an explicit decision without changing the current public API. |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- Define a procedure-card schema with source reference, trigger, output contract, proof gate, and privacy rule.
- Build per-mode card inventories for the existing five modes.
- Add shared procedure cards only for cross-mode orchestration with owner and rationale.
- Add source-adaptation and review rules that prevent long-form external prompt copying.

**How to roll back**: Remove the private card schema, inventories, and routing rules introduced by the phase, then restore each mode to its previous baseline procedure behavior and re-run strict validation.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->
