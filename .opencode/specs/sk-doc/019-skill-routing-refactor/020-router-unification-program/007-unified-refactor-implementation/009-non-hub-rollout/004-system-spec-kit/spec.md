---
title: "Feature Specification: system-spec-kit Non-Hub Router Rollout"
description: "Compile the authored single-skill system-spec-kit router into a deterministic policy and read-only projections. Prove real-scorer compatibility, zero-authority parity, closed decision algebra, and fenced byte-exact rollback without changing live routing or shared scorer code."
trigger_phrases:
  - "system spec kit router rollout"
  - "system spec kit compiled policy"
  - "non hub real scorer parity"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-sk-doc-router-alignment/020-router-unification-program/007-unified-refactor-implementation/009-non-hub-rollout/004-system-spec-kit"
    last_updated_at: "2026-07-19T10:39:28Z"
    last_updated_by: "codex"
    recent_action: "Built and verified the system-spec-kit compiled router rollout"
    next_safe_action: "Review the rollout evidence before any separate activation decision"
    blockers: []
    key_files:
      - "harness/run-rollout.cjs"
      - "compiled/system-spec-kit/policy.json"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "system-spec-kit-rollout"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# system-spec-kit Non-Hub Router Rollout

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-07-19 |
| **Branch** | Existing worktree; no commit or push |
| **Blast radius** | Isolated read-only rollout artifacts; no live authority |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The unified compiler was proven on one standalone skill, but `system-spec-kit` has a materially larger authored router: 17 intent classes, 48 manifest leaves, multiline resource arrays, and an explicit always-loaded default resource. The rollout needs target-local evidence that those authored semantics survive compilation and real scorer replay without relying on the stale checked artifact in the original compiler packet.

### Purpose

Produce one deterministic `CompiledPolicyV1` and its three projections for `system-spec-kit`, then prove scorer compatibility, shadow parity, closed-algebra safety, and reversible one-generation selection while legacy remains authoritative.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Import the generic compiler, canonical contract, projection, activation, and parity modules from the frozen implementation packets.
- Read the real `system-spec-kit/SKILL.md`, `leaf-manifest.json`, `leaf-aliases.json`, and all 48 routable leaf files without modifying them.
- Preserve the 17 authored intent maps and `references/workflows/quick-reference.md` as the explicit `bounded-default` route.
- Emit policy, advisor, typed route-gold, policy-card, five typed fixtures, and four activation JSON artifacts.
- Run projected rows through the real read-only scorer and compare compiled observations with the real legacy router at zero authority.
- Prove one-generation fencing and byte-exact rollback in the reused activation state machine.

### Out of Scope

- Editing the shared scorer, the generic compiler, any live skill, or any routing configuration.
- Activating compiled routing in a serving process.
- Repairing the stale `mcp-code-mode` checked policy in the original compiler packet.
- Git commit, push, dependency installation, or network access.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `harness/*.cjs` | Create | Target-local source adapter, artifact builder, scorer bridge, and real-green gate |
| `activation/*` | Create | Reused fence module plus prior/current/candidate manifests and fence state |
| `parity/shadow-parity.cjs` | Create | Re-export of the frozen zero-authority parity module |
| `compiled/system-spec-kit/*` | Create | Deterministic policy and three projection families |
| Packet documentation and metadata | Create | Level-2 scope, plan, tasks, checklist, evidence, and memory metadata |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Compile the real authored router without a skill-name branch | Policy has one `system-spec-kit` destination, 17 selectors, 48 leaves, empty composition/authority collections, null overlay, and static provenance |
| REQ-002 | Preserve authored default semantics | Zero signal produces a single `bounded-default` route to the authored quick reference; positive routes include that always-loaded resource |
| REQ-003 | Preserve the closed decision algebra | Ambiguity yields one target-free clarification; an authored forbidden admission yields target-free rejection; non-route decisions emit no effects or authority references |
| REQ-004 | Emit deterministic projections | Two complete rebuilds and three policy compiles are byte-identical and carry one effective policy hash |
| REQ-005 | Pass the real scorer untouched | Five projected rows pass the real evaluator, two falsifiers fail, and all three protected scorer hashes remain exact |
| REQ-006 | Hold shadow parity at zero authority | Exact, bounded-default, and singular-route cases match the real legacy router with zero mismatches and effects while legacy remains authoritative |
| REQ-007 | Prove reversible selection | Generation 1 pins the candidate; rollback restores the exact generation-0 manifest bytes and advances the monotonic fence |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-008 | Keep the rollout isolated | Every write stays within this child packet; protected sources and live routing remain unchanged |
| REQ-009 | Keep verification self-contained | Every target-local CommonJS file passes `node --check`; the default validator performs no writes |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `node harness/run-rollout.cjs` exits 0 with `result=GREEN`.
- **SC-002**: Artifact rebuild is byte-identical at body SHA-256 `3cd7c7161c06826e543829435c2349feb63cff286e631ee180168c207ec5b2c6`.
- **SC-003**: Real scorer reports five passing rows, two rejected falsifiers, and unchanged protected digests.
- **SC-004**: Shadow parity reports three matches, zero mismatches, zero effects, and legacy authority.
- **SC-005**: Rollback preimage and restored hashes both equal `5485c5a4a6faddca886425dedc59bd0d5340f7946f9bf7f6a8fec36e802a8c23`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Frozen compiler and canonical schemas | Missing or changed imports invalidate policy identity | Import directly and schema-validate every artifact |
| Risk | Explicit default mistaken for unconditional singleton admission | Would erase authored negative and ambiguity paths | Use `bounded-default` only after zero selector evidence; keep negative admission first |
| Risk | Self-fulfilling scorer test | Could mask projector drift | Pin explicit expected rows and prove extra-resource and fabricated-oracle falsifiers fail |
| Risk | Unrelated dirty worktree state | Could obscure scope | Hash protected files directly and report only child-local writes |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Determinism

- **NFR-D01**: Canonical artifacts are identical across repeated in-process and isolated-process compilation.

### Security

- **NFR-S01**: No network, secrets, live authority, or destination effects enter the rollout.

### Reliability

- **NFR-R01**: Verification fails closed on artifact drift, schema failure, scorer mismatch, parity mismatch, hash drift, or rollback mismatch.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Admission Boundaries

- Zero signal uses only the authored bounded default.
- Equal top evidence yields exactly one clarification with `none_of_these`.
- Authored forbidden language rejects before positive selector evidence.

### State Transitions

- The prior request pin remains generation 0 while the candidate pin observes generation 1.
- Rollback restores prior bytes while the fence advances to epoch 2, preventing ABA reuse.

### Failure Boundaries

- A protected scorer hash change, extra projected resource, fabricated intent, or checked artifact drift fails the gate.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 17/25 | One isolated child with six CommonJS files and generated artifacts |
| Risk | 18/25 | Benchmark-adjacent and policy identity sensitive, but zero live authority |
| Research | 15/20 | Required full template, scorer, authored router, and 48-leaf inventory study |
| **Total** | **50/70** | **Level 2 with explicit verification** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

None. Live activation is a separate authorization and is outside this child.
<!-- /ANCHOR:questions -->
