---
title: "Feature Specification: Unified Router Rollout — sk-prompt"
description: "Activate the compiled router contract for the two-mode sk-prompt workflow hub. Preserve authored weights, ordered bundle order, and the non-null prompt-improve default while proving real route-gold against the frozen scorer."
trigger_phrases:
  - "sk-prompt router activation"
  - "prompt-improve bounded default"
  - "sk-prompt ordered bundle canary"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/020-router-unification-program/007-unified-refactor-implementation/006-parent-hub-rollout/005-sk-prompt"
    last_updated_at: "2026-07-19T23:59:59Z"
    last_updated_by: "codex"
    recent_action: "Proved the two-mode shadow canary against the frozen scorer"
    next_safe_action: "Keep legacy serving authority until the parent rollout advances"
    blockers: []
    key_files:
      - "harness/validate-canary.cjs"
      - "compiled/policy.json"
      - "compiled/route-gold.typed.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-prompt-rollout-005"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Feature Specification: Unified Router Rollout — sk-prompt

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|---|---|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Complete — REAL-GREEN, shadow-only |
| **Created** | 2026-07-19 |
| **Branch** | Existing isolated worktree; no commit or push |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The authored hub cannot be represented by treating every zero-signal request as a defer. Its
non-null default is intentional, while its two modes also have unequal weights and one ordered
bundle. Copying a default-null sibling would silently change the public routing contract.

### Purpose

Compile the authored router and registry into one content-addressed policy, retain the bounded
default, and prove exact single and ordered-bundle decisions through the real frozen scorer.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Read the live hub router, registry, hub skill, and two packet skills as immutable authored inputs.
- Compile two workflow destinations through the shared compiler.
- Preserve weights `4` and `6`, ambiguity delta `1`, default `prompt-improve`, and tie-break order.
- Project selected packet resources through the shared projector and real read-only scorer.
- Generate deterministic compiled and activation artifacts and prove byte-exact rollback.

### Out of Scope

- Editing any live skill, router, registry, shared library, sibling, or scorer.
- Installing packages, using the network, enabling live serving, committing, or pushing.
- Adding modes, leaf manifests, surfaces, handoffs, overlays, or scorer conventions.

### Files to Change

| File Path | Change Type | Description |
|---|---|---|
| `lib/*.cjs` | Create | Source adapter, router, policy card, gate, and fence |
| `harness/*.cjs` | Create | Deterministic build and real canary validation |
| `fixtures/canary-cases.v1.json` | Create | Eight typed routing cases |
| `compiled/*`, `activation/*` | Create | Generated policy, projections, and shadow manifests |
| Root Level-2 documents | Create | Scope, plan, evidence, completion, and metadata |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|---|---|---|
| REQ-001 | Use shared `compile()` as the only `CompiledPolicyV1` constructor. | Both modes compile to schema-valid destinations and identical bytes recompile identically. |
| REQ-002 | Preserve authored routing metadata. | Weights are `4`/`6`, delta is `1`, tie-break is improve/models, and resources come from the router. |
| REQ-003 | Honor the non-null default. | Zero-signal input routes single to `prompt-improve` with `bounded-default` basis. |
| REQ-004 | Preserve the ordered bundle. | Explicit dual intent routes improve then models; reversed targets fail validation. |
| REQ-005 | Keep the decision algebra closed. | Clarify/defer/reject are target-free and authority-free; forbidden input rejects. |
| REQ-006 | Prove route-gold through frozen consumers. | Shared projection feeds the real read-only scorer; every delivered row passes and corruption fails. |
| REQ-007 | Keep protected files unchanged. | All three protected scorer hashes match the captured baseline. |
| REQ-008 | Prove reversible activation. | Fenced ship and rollback advance the epoch and restore exact prior bytes. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|---|---|---|
| REQ-009 | Generate a document-only policy card. | All document decisions match machine decisions and planted default drift fails. |
| REQ-010 | Preserve advisor non-authority behavior. | Only live identity-matched evidence contributes; other evidence cannot rewrite routing. |

### Acceptance Scenarios

#### Scenario 1: Bounded default

- **Given** a prompt with no authored signal,
- **When** the compiled router evaluates the request,
- **Then** it returns `route(single,[prompt-improve])` with `bounded-default` basis.

#### Scenario 2: Explicit composition

- **Given** a prompt explicitly naming both authored modes,
- **When** the compiled router evaluates the request,
- **Then** it returns `route(orderedBundle,[prompt-improve,prompt-models])`.

#### Scenario 3: Ambiguity

- **Given** competing weighted signals within the authored delta,
- **When** the router cannot select one mode,
- **Then** it emits one target-free clarify decision.

#### Scenario 4: Forbidden input

- **Given** a forbidden prompt or constraint,
- **When** the router evaluates safety before positive routing,
- **Then** it emits a target-free and authority-free reject decision.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Two authored modes compile to two unique destinations through the shared compiler.
- **SC-002**: Eight typed canary rows are real-green and zero are shadow-partial.
- **SC-003**: Zero-signal fallback is exactly `route(single,[prompt-improve])`.
- **SC-004**: Explicit dual routing is exactly the authored ordered bundle.
- **SC-005**: Algebra, document parity, source integrity, rollback, and scorer digests pass.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|---|---|---|---|
| Dependency | Shared compiler and projector | Contract drift could invalidate projections. | Hash source inputs and validate the real shared paths on every run. |
| Dependency | Frozen scorer | Any edit would invalidate the proof. | Pin all three hashes before and after validation. |
| Risk | Default-null behavior copied from siblings | Unrelated prompts would defer incorrectly. | Assert bounded-default routing in fixtures, policy card, and closed-algebra checks. |
| Risk | Bundle order drift | Both modes could run in an unauthorized order. | Compile one ordered rule and drive the reversed-order falsifier. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Determinism

- Identical authored bytes produce byte-identical compiled and activation artifacts.
- Generated artifacts contain no wall-clock or random values.

### Authority

- Positive decisions withhold authority until destination VERIFY.
- Non-route decisions carry neither target nor authority.

### Reversibility

- The candidate remains shadow-only while legacy stays serving-authoritative.
- Rollback restores retained prior manifest bytes exactly.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries

- Empty or unrelated prompt: bounded default to `prompt-improve`.
- Both workflow names: ordered bundle in authored tie-break order.
- Invalid explicit mode: target-free `defer(no-match)`.

### Error Scenarios

- Dependency failure: target-free defer.
- Forbidden prompt or constraint: target-free reject.
- Scorer or authored-source digest drift: hard activation refusal.

### State Transitions

- COMMIT before VERIFY: rejected without effect.
- Mixed generation: rejected.
- Rollback: prior manifest restored byte-for-byte.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|---|---:|---|
| Scope | 13/25 | One isolated hub child with multiple executable artifacts |
| Risk | 15/25 | Default semantics and frozen-scorer parity are load-bearing |
| Research | 8/20 | Completed siblings and design authority exist |
| **Total** | **36/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

None. The requested scope, default behavior, scorer boundary, and serving authority are explicit.
<!-- /ANCHOR:questions -->

