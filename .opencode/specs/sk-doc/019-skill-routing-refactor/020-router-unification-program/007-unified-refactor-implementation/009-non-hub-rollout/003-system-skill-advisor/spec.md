---
title: "Feature Specification: system-skill-advisor Non-Hub Rollout"
description: "Compile the standalone system-skill-advisor inline router into CompiledPolicyV1, emit typed projections and fixtures, prove frozen-scorer compatibility and exact positive-route shadow parity at zero authority, and exercise fenced byte-exact rollback."
trigger_phrases:
  - "system skill advisor compiled policy"
  - "system skill advisor non hub rollout"
  - "advisor router shadow parity"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-sk-doc-router-alignment/020-router-unification-program/007-unified-refactor-implementation/009-non-hub-rollout/003-system-skill-advisor"
    last_updated_at: "2026-07-19T10:55:36Z"
    last_updated_by: "codex"
    recent_action: "Conformed the rollout specification to the Level-2 contract"
    next_safe_action: "Regenerate canonical metadata and run strict validation"
    blockers: []
    key_files:
      - "harness/run-phase.cjs"
      - "compiled/system-skill-advisor/policy.json"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "system-skill-advisor-rollout-20260719"
      parent_session_id: null
    completion_pct: 95
    open_questions: []
    answered_questions: []
---
# system-skill-advisor Non-Hub Rollout

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Active — routing green; documentation conformance pending |
| **Created** | 2026-07-19 |
| **Branch** | Existing worktree; no commit or push |
| **Authority** | Legacy only; compiled policy remains shadow-only |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The authored `system-skill-advisor` inline router had no target-local compiled policy, typed scorer projection, exact positive-route shadow-parity proof, or fenced rollback evidence. The rollout needed to exercise the real frozen router replay and route-gold scorer without changing either protected code or live authority.

### Purpose

Compile the inline `INTENT_SIGNALS` and `RESOURCE_MAP` owned by `system-skill-advisor` through the frozen generic compiler. The child remains shadow-only: the legacy router keeps serving authority, the compiled evaluator emits no effects, and activation evidence is limited to a fenced one-generation state transition with byte-exact rollback.

The real frozen router replay and route-gold scorer are the compatibility authority. Their three protected files must retain the captured SHA-256 values before and after the rollout.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Read the live `system-skill-advisor/SKILL.md`, `leaf-manifest.json`, `leaf-aliases.json`, and every routed documentation leaf without modifying them.
- Translate the authored inline router into the generic authored-source model and compile it through the shared compiler modules.
- Preserve 20 weighted intents and 20 exact `RESOURCE_MAP` leaves.
- Preserve the two `DEFAULT_RESOURCES` as fallback-only support. They are not a compiled default route, so zero signal defers with `no-match`.
- Derive the authored replacement exclusion as negative admission, producing `reject(forbidden)`.
- Emit `policy.json`, `advisor-projection.json`, `route-gold.typed.json`, `policy-card.md`, and five typed fixture files.
- Prove 20/20 positive-route shadow parity against the real legacy router, five real-scorer route-gold rows, the closed four-action algebra, and fenced rollback.

### Out of Scope

- Editing the shared compiler, scorer, live skill, live routing configuration, or any sibling packet.
- Granting the compiled policy live serving authority.
- Adding a hub router, mode registry, sub-mode packet, bundle, handoff, authority edge, or learning overlay.
- Installing dependencies, using the network, committing, or pushing.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Compile deterministically | Three in-process compiles, two process-isolated compiles, and two full artifact builds are byte-identical |
| REQ-002 | Preserve N=1 degeneracy | One candidate selects `single`; bundle, cross-target, handoff, and authority collections stay empty; overlay is null; provenance is static; rank calls remain zero |
| REQ-003 | Preserve authored routing | Twenty intent keys exactly match 20 resource-map keys, and every routed leaf exists in the manifest, alias projection, and filesystem |
| REQ-004 | Close the admission algebra | Positive signal routes; zero signal defers; tied evidence clarifies exactly once; authored replacement exclusion rejects as forbidden; non-routes expose no target or authority reference and carry `Withheld` |
| REQ-005 | Pass the frozen scorer | Five typed rows project to legacy observations and pass `evaluateRouteGold`; an extra-resource falsifier fails |
| REQ-006 | Match legacy positive routes | All 20 exact positive routes match the real legacy router with zero mismatches and zero effects while legacy remains authoritative |
| REQ-007 | Prove reversible activation | Generation 1 activates under the fence, requests pin generations 0 or 1, stale epoch is rejected, and rollback restores byte-identical prior manifest bytes at epoch 2 |
| REQ-008 | Preserve protected files | `router-replay.cjs`, `score-skill-benchmark.cjs`, and `load-playbook-scenarios.cjs` retain their captured SHA-256 values |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The target-local `--write` build emits nine deterministic compiled artifacts and four activation state files.
- **SC-002**: Default validation exits zero without changing target bytes.
- **SC-003**: All policy, decision, advisor, policy-card, and typed-gold schema checks pass.
- **SC-004**: The real scorer reports five passing rows and rejects the falsifier.
- **SC-005**: Shadow parity reports `routes=20 matches=20 mismatches=0 effects=0`.
- **SC-006**: Rollback reports identical pre/restored SHA-256 `5485c5a4a6faddca886425dedc59bd0d5340f7946f9bf7f6a8fec36e802a8c23`.
- **SC-007**: Every target-local CommonJS file passes `node --check` and comment hygiene.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Frozen compiler and canonical contract | Policy identity cannot be trusted if shared APIs drift | Import the existing modules directly and validate every emitted schema and hash |
| Dependency | Protected scorer trio | Compatibility cannot be claimed without the real read-only path | Execute the protected scorer in a subprocess and verify all three SHA-256 values |
| Risk | Fallback-only defaults become a compiled route | Zero signal would route instead of defer | Keep both defaults as support suggestions and assert `defer(no-match)` for zero signal |
| Risk | Candidate authority escapes the shadow lane | The rollout could affect live decisions | Require `servingAuthority="legacy"`, `shadowOnly=true`, and zero effects in checked and candidate manifests |

### Safety Boundary

This child has zero live authority. `manifest.json` remains generation 0 with `servingAuthority="legacy"` and `shadowOnly=true`; `manifest.candidate.json` names generation 1 but retains the same authority boundary. The rollback drill runs over copied manifest state and cannot produce external effects.
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Determinism

- **NFR-D01**: Repeated in-process and isolated-process compiles must produce identical policy bytes.
- **NFR-D02**: Complete artifact rebuilds must byte-match all nine checked compiled artifacts.

### Safety

- **NFR-S01**: Verification must not modify the live skill, shared compiler, scorer, routing configuration, or serving authority.
- **NFR-S02**: Non-route decisions must contain no target, authority reference, or effect.

### Operability

- **NFR-O01**: The default harness invocation must stay read-only and emit concise line-oriented receipts.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- **Zero signal**: Emit `defer(no-match)` and keep both authored defaults fallback-only.
- **Tied evidence**: Request exactly one clarification with no target or authority.
- **Forbidden admission**: Reject the authored replacement exclusion before routing.
- **Fabricated resource**: Reject the extra-resource falsifier in the real scorer.
- **Stale fence**: Reject activation after a newer epoch is observed.
- **Rollback**: Restore prior manifest bytes exactly while advancing the fence to epoch 2.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Assessment | Evidence |
|-----------|------------|----------|
| Scope | Isolated | One target-local rollout child; no shared or live writes |
| Verification | High | Determinism, real scorer, 20-route parity, algebra, hashes, syntax, and rollback |
| Risk | Controlled | Shadow-only candidate with legacy authority and zero effects |
| Documentation level | Level 2 | Verification-heavy work with an explicit evidence checklist |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

None. Live activation is a separate authorization and remains outside this child.

### Verification Command

```bash
node .opencode/specs/sk-doc/019-sk-doc-router-alignment/020-router-unification-program/007-unified-refactor-implementation/009-non-hub-rollout/003-system-skill-advisor/harness/run-phase.cjs
```
<!-- /ANCHOR:questions -->
