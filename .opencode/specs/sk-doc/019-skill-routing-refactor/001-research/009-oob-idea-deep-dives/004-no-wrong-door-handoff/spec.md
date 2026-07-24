---
title: "Feature Specification: Deep-Dive — No-Wrong-Door Bounded Handoff"
description: "Five-iteration SOL xhigh-fast deep-research lineage on a no-wrong-door routing protocol where any mode can accept intake and offer a typed transfer through a bounded INTAKE→OFFERED→ACCEPTED→ACTIVE state machine, where acceptance transfers execution ownership but is distinct from completion, authority stays destination-local via a short-lived scoped lease, and cost is bounded by an idempotent transfer id, visited-mode set, hop budget, deadline, and at most one clarification turn — used only on the ambiguous path, never replacing confident one-shot routes."
trigger_phrases:
  - "no wrong door handoff deep dive"
  - "bounded routing handoff protocol"
  - "acceptance vs completion routing"
importance_tier: "important"
contextType: "research"
---
<!-- SPECKIT_TEMPLATE_SOURCE: templates/spec.md -->
<!-- SPECKIT_LEVEL: 2 -->

# Deep-Dive: No-Wrong-Door Bounded Handoff

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | Important |
| **Status** | Research complete; protocol implementation and empirical cost validation remain outside this packet |
| **Created** | 2026-07-18 |
| **Packet** | `004-no-wrong-door-handoff` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

One-shot routing has no bounded recovery path when an ambiguous request reaches the wrong mode. Without explicit states, a transfer can widen authority, loop, duplicate effects, or be mistaken for completed work merely because a destination accepted it.

### Purpose

Define a bounded handoff protocol for an explicit ambiguous/defer result with a viable candidate, while keeping confident routes one-shot. Transfer, clarification, ownership, activation, completion, authority, and effect identity remain distinct.

### Research Outcome

The five-iteration run converged on a durable versioned transfer lineage with an atomic acceptance transaction, destination-local fenced lease, closed and hashed envelopes, authorized context references, idempotent retries, and a strict default hop budget of one. Structural message and clarification bounds are defined, while acceptable latency, byte caps, recovery yield, and failure amplification remain empirical questions that require a real corpus. The retained `presentation.md` records the complete synthesis.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Five-iteration research on the state machine, offer envelope, destination authority, cost bounds, and confident-route boundary.
- Explicit evaluation of advisor evidence, deterministic benchmark replay, and document-only operation.
- A retained plain-language synthesis in `presentation.md`.

### Out of Scope

- Implementing a transactional store, canonicalizer, lease mediator, broker, or protocol runtime.
- Measuring latency, byte caps, recovery yield, or failure amplification on a request corpus.
- Re-deriving the shipped `defaultMode` answer.

### Packet Artifacts

| File | Role |
|------|------|
| `spec.md` | Research charter and bounded-handoff requirements |
| `presentation.md` | Retained five-iteration synthesis |
| `plan.md`, `tasks.md`, `checklist.md` | Canonical planning and verification surfaces |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Research Contract

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Define a durable versioned handoff state machine. | `presentation.md` separates intake, offer, acceptance, active work, terminal states, rejection, clarification, and timeout. |
| REQ-002 | Define closed, canonical, idempotent envelopes. | The synthesis defines fixed envelope families, canonical digest identity, and conflict on same key with changed content. |
| REQ-003 | Keep authority destination-local and fenced. | Acceptance atomically transfers ownership and grants only a narrowed lease revalidated on every effect. |
| REQ-004 | Prove structural bounds and preserve confident routes. | The synthesis defaults to one candidate, at most one clarification, bounded messages, and zero handoff artifacts for confident routes. |

### P1 - Cross-Cutting Evaluation

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Evaluate system-skill-advisor integration. | `presentation.md` treats advisor candidates and scores as evidence, not authority or protocol state. |
| REQ-006 | Evaluate benchmark integration. | `presentation.md` defines direct-versus-ambiguous fixtures and frozen replay state. |
| REQ-007 | Evaluate standalone document-only routing. | `presentation.md` allows safe conversational handoff behavior but not transactional guarantees or mutation. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- Handoff begins only from an explicit ambiguous/defer outcome with a viable candidate.
- Acceptance is an atomic ownership commit and never means activation or completion.
- Retries, loops, clarification, context transfer, lease scope, and effects have explicit identities and bounds.
- Structural bounds are distinguished from unmeasured empirical latency and recovery quality.
- Advisor, benchmark, and document-only behavior are separately bounded without implementation claims.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Transactional state and fenced effect mediation | Message order alone cannot guarantee one winner or stop stale workers | Use compare-and-set state versions and revalidate the fence on every effect |
| Risk | Acceptance is treated as completion | Work could be reported done before execution begins | Keep `ACCEPTED` distinct from `ACTIVE` and terminal states |
| Risk | External systems ignore idempotency or fencing | Exactly-once claims become false | Require a serialized broker, disclose at-least-once behavior, or exclude the integration |
| Risk | Structural bounds are mistaken for acceptable latency | A terminating protocol may still be too slow or costly | Require paired corpus measurement before operational adoption |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

- **Safety**: every effect revalidates holder, state, scope, tool, policy pins, expiry, fence, and effect identity.
- **Determinism**: closed envelopes use canonical content identity and replay freezes policy, registry, schema, clock, candidate availability, and byte caps.
- **Boundedness**: the default one-candidate profile allows at most one clarification and a finite control-message count.
- **Privacy**: context travels through authorized, content-addressed, size-capped references rather than raw prompts or answers.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Confident single routes, bundles, idle, no-match, dependency failure, and unsafe degradation create no handoff state or lease.
- Same idempotency key with different content fails as a conflict rather than overwriting prior meaning.
- Concurrent accept, reject, timeout, or cancel attempts have one compare-and-set winner.
- A stale source or worker may observe state but cannot regain or exercise execution authority after acceptance.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

The packet retains its declared Level 2 classification because it coordinates state, identity, authority, privacy, replay, and bounded-cost concerns. No numeric score is reconstructed from the retained artifacts.
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- What measured latency, byte cap, recovery yield, and failure amplification are acceptable on a real paired corpus?
- Which external integrations can honor fencing and idempotency, and which require a broker or explicit downgrade?
- What exact destination-local lease scope and expiry policy should become normative?
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Five-iteration synthesis**: `presentation.md`
- **Parent phase map**: `../spec.md`
- **Source lineage**: `../../002-default-mode-policy-research/research/lineages/sol-oob/`
