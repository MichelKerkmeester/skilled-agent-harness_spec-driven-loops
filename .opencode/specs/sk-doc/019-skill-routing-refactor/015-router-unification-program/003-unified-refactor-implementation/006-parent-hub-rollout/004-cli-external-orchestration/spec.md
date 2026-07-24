---
title: "Feature Specification: cli-external-orchestration Per-Hub Rollout"
description: "Activate the compiled router contract for the external-executor hub in shadow mode, with deterministic single and ordered-bundle routes, closed-algebra negatives, real scorer parity, execution fencing, and byte-exact rollback."
trigger_phrases:
  - "cli external orchestration router activation"
  - "external executor ordered bundle"
  - "cli executor canary"
importance_tier: "critical"
contextType: "implementation"
status: "implemented; REAL-GREEN canary; legacy remains serving-authoritative"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/020-router-unification-program/007-unified-refactor-implementation/006-parent-hub-rollout/004-cli-external-orchestration"
    last_updated_at: "2026-07-19T00:00:00Z"
    last_updated_by: "cli-codex"
    recent_action: "Built and verified the external-executor rollout child"
    next_safe_action: "Keep legacy authoritative until the parent rollout selects this candidate"
    blockers: []
    key_files: ["spec.md", "harness/validate-canary.cjs", "compiled/policy.json"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "cli-codex-2026-07-19-cli-external-rollout-spec"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# cli-external-orchestration Per-Hub Rollout

This child compiles the live `cli-external-orchestration` hub into `CompiledPolicyV1` without changing the hub, its executor children, shared contracts, or the frozen benchmark scorer. The three executor modes are actor destinations with external effects: `cli-opencode`, `cli-claude-code`, and `cli-codex`. One explicit or dominant executor produces `single`; multiple explicitly requested executors produce `orderedBundle` in authored `tieBreak` order; semantic ties clarify once; zero signal defers; forbidden requests reject.

The generated candidate remains shadow-only and legacy stays serving-authoritative. The canary projects typed decisions through the shared projector into the real read-only route-gold scorer, enforces actor-first and target-free negative branches, proves PREPARE→VERIFY→COMMIT, and restores the prior manifest byte-for-byte.

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| Status | Implemented; REAL-GREEN canary |
| Level | 2 |
| Archetype | External-executor dispatch |
| Serving authority | Legacy |
| Candidate | Shadow-only |
| Live mutations | None |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The authored hub declares three equally weighted external CLI executors and supports explicit multi-executor dispatch, but its compiled contract needs a deterministic representation that the shared decision parser, projector, scorer, and execution plane can all consume. Incorrect modeling could silently collapse explicit bundles, grant authority to a negative decision, route ambiguous input, or commit an external effect without current authority.

### Purpose

Compile the authored router and registry faithfully, evaluate representative canaries through the shared contracts, and prove the candidate can be activated and rolled back under a fenced manifest while legacy remains authoritative.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Compile the hub router, mode registry, hub skill, and three executor skills as hashed read-only sources.
- Emit deterministic policy, destination graph, advisor projection, typed route gold, policy card, blast radius, and activation artifacts.
- Evaluate `single`, `orderedBundle`, `clarify`, `defer`, and `reject` decisions.
- Project typed decisions through the shared projector and score them through the real frozen read-only scorer.
- Prove actor-first routes, target-free and authority-free negative decisions, execution fencing, hard blocks, and byte-exact rollback.

### Out of Scope

- Editing live skills, router configuration, registries, shared libraries, or scorer files.
- Executing a real external CLI or making a network request.
- Replacing the legacy serving route or committing/pushing repository changes.
- Inventing executor modes, signals, cross-hub judgment roles, or external-mutation policy.

### Files to Change

Only files under this child are created: five libraries, two harnesses, one fixture, generated compiled and activation artifacts, and the Level-2 documentation set.
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Compile only authored executors and signals | Three actor destinations and their selector classes derive from the hub router and mode registry; no invented destination or signal exists. |
| REQ-002 | Preserve authored ordering | Explicit multi-executor requests emit `orderedBundle` in `cli-opencode`, `cli-claude-code`, `cli-codex` tie-break order. |
| REQ-003 | Enforce the closed algebra | Routes carry actor-first targets; every `clarify`, `defer`, and `reject` branch is target-free with authority `Withheld`. |
| REQ-004 | Handle uncertainty safely | Forbidden input rejects, zero signal defers, and a semantic score tie emits one clarify decision. |
| REQ-005 | Use the real compatibility path | Typed decisions project through the shared projector and all gold rows pass the real read-only scorer with the scorer files unchanged. |
| REQ-006 | Fence external effects | Actor execution cannot commit before VERIFY; the proven path is PREPARE→VERIFY→COMMIT. |
| REQ-007 | Build and roll back deterministically | Recompile is byte-identical, activation uses a fenced CAS, and rollback restores the exact prior bytes. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-008 | Advisor cannot override decisions | Only a live identity-matching projection contributes; stale, absent, or drifted state contributes nothing. |
| REQ-009 | Document-only parity | The generated policy card replays every fixture to the same typed decision and detects a tampered ordering payload. |
| REQ-010 | Preserve source identity | Authored inputs and protected scorer files have identical before/after SHA-256 values. |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- `node harness/build-artifacts.cjs` writes six compiled and five activation artifacts deterministically.
- `node harness/validate-canary.cjs` exits zero with `status: GREEN`.
- Eight typed route-gold rows pass the real scorer and a corrupted observation fails.
- The action distribution proves five routes, one clarify, one defer, and one reject.
- A commit without READY fails, one simulated commit follows PREPARE→VERIFY→COMMIT, and no real CLI effect occurs.
- Wrong-preimage and mixed-generation states are blocked; the prior manifest is restored byte-for-byte.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Mitigation |
|------|------|------------|
| Dependency | Shared canonical, compiler, projector, decision, execution, and activation contracts | Import the committed implementations directly and test their real paths. |
| Risk | Explicit multi-executor intent is confused with an ordinary semantic tie | Treat two or more explicit alias classes as a bundle; clarify only a non-explicit score tie. |
| Risk | External effects escape rollback | Keep the candidate shadow-only, simulate the effect, and document that manifest rollback cannot undo a committed external effect. |
| Risk | Scorer compatibility is masked by local assertions | Call the real read-only scorer and prove a corrupted observation fails. |
<!-- /ANCHOR:risks -->

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Determinism

Canonical serialization and content hashing define every generated byte. No wall clock, randomness, package install, or network access participates in the build.

### Authority

Every destination is an actor with destination-local authority withheld until VERIFY. Negative decisions carry no target and cannot acquire authority.

### Reversibility

The activation selector retains the prior manifest, checks its preimage and fencing epoch, and restores the exact retained bytes. External effects remain destination-owned after COMMIT.
<!-- /ANCHOR:nfr -->

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Explicit bundle boundaries

One explicit executor is a `single`; two or three distinct explicit executor alias classes are an `orderedBundle`; repeated aliases do not duplicate a target.

### Ambiguous and empty input

A non-explicit top-score tie clarifies once and includes `none_of_these`. Zero detector hits defer. Neither branch carries targets.

### Forbidden input

Negative admission produces `reject` before scoring and cannot be converted into a route through fallback behavior.
<!-- /ANCHOR:edge-cases -->

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

This is Level 2: the code footprint exceeds a small change and requires QA artifacts, but it is one bounded hub with three homogeneous destinations, no cross-hub graph, and no live mutation. The principal complexity lies in compatibility and negative invariants rather than destination count.
<!-- /ANCHOR:complexity -->

## 7. MIGRATION GATE

The child is eligible only when compile determinism, schema validation, route-gold, advisor identity, document parity, closed algebra, execution fencing, rollback, source protection, and static checks are green together. Any scorer digest change or need to edit a protected scorer is a hard failure. Passing leaves legacy serving-authoritative and the candidate shadow-only.

### Implementation Evidence

- Effective policy: `4554f82a2dcb22e940581734e6a958d73fbbcee8344278bcd8408ef7568e1c9d`.
- Destination graph: `aae29ab476ed629167fc89a206b339dcb0e23981ccc7260a8f75989fb6fd35d2`.
- Real scorer: 8/8 rows green; corrupted observation false.
- Closed algebra: one clarify, one defer, one reject; all three negative branches target-free and authority-free.
- Execution: PREPARE→VERIFY→COMMIT; commit-without-ready blocked; zero real CLI effects.
- Rollback: restored hash equals prior hash `5485c5a4a6faddca886425dedc59bd0d5340f7946f9bf7f6a8fec36e802a8c23`.

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

None. Live activation remains a parent-rollout decision outside this child.
<!-- /ANCHOR:questions -->

## RELATED DOCUMENTS

- `plan.md` — implementation sequence and gates.
- `tasks.md` — completed work units.
- `checklist.md` — verification evidence.
- `implementation-summary.md` — delivered state and limitations.
