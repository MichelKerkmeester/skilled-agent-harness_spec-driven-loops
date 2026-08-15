---
title: "Feature Specification: Phase 016 Default-Off and Advisor Exclusion"
description: "Record the completed default-off enablement gate for communication projection and the adjustable advisor route-exclusion that holds sk-communication out of automatic routing."
trigger_phrases:
  - "default-off-and-advisor-exclusion"
  - "communication projection default off"
  - "advisor route exclusion"
  - "sk-communication routing exclusion"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-communication/001-sk-communication-creation/016-default-off-and-advisor-exclusion"
    last_updated_at: "2026-08-14T06:14:47.000Z"
    last_updated_by: "claude"
    recent_action: "Recorded the completed default-off enablement gate and advisor route-exclusion."
    next_safe_action: "After landing on main, rebuild the advisor dist, reindex, and re-probe to confirm the exclusion."
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "decision-record.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-016-default-off-20260813"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Projection is off by default and opts in through an environment variable or a git-ignored local file, with the variable winning."
      - "The advisor had no per-skill exclusion mechanism, so an adjustable denylist was built rather than deprecating or archiving the skill."
      - "The advisor dist is git-ignored, so the compiled gate takes effect on main only after a rebuild and reindex."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
# Feature Specification: Phase 016 Default-Off and Advisor Exclusion

<!-- SPECKIT_LEVEL: 3 -->

---

## EXECUTIVE SUMMARY

Communication projection is now off by default for everyone, privately opt-in-able on a single machine, and its skill is held out of advisor routing. This phase records two completed and verified changes. The package gains a default-off enablement gate that every activation path checks before it rewrites output. The advisor gains an adjustable route-exclusion denylist that keeps `sk-communication` from being recommended, so the skill is invoked by hand.

**Key decision**: gate enablement at the activation seam through a pure resolver, and exclude the skill through an adjustable denylist rather than deprecating or archiving it.

**Critical dependency**: the completed package (`npm run check`) and the advisor source build, plus a post-land advisor rebuild and reindex on main for the compiled gate to take effect there.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-08-13 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | `../spec.md` |
| **Phase** | 16 of 16 |
| **Predecessor** | `015-package-into-skill` |
| **Successor** | `017-runtime-wiring-feasibility-and-contract` |
| **Handoff Criteria** | Projection resolves to off with no opt-in present, the two opt-in sources switch it on with the environment variable winning, the advisor no longer recommends `sk-communication` under a live probe, the package gate passes 296 of 296 tests, the advisor route-exclusion tests pass with zero new failures against the known 41-failure baseline, and this phase plus the parent pass strict validation with zero errors and warnings. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This completed phase makes communication projection dormant by default and removes the skill from automatic advisor routing, so adopting the layer is an explicit, private, per-machine choice.

**Scope boundary**: Document and verify the completed enablement gate and route-exclusion. The source, tests, and config are already built and verified. This packet records evidence and wires the phase into the parent. It does not change runtime code.

**Dependencies**:

- The completed package build and test gate at `.opencode/skills/sk-communication/cli-communication-projection`
- The advisor source, its two routability seams, and its config directory
- A post-land advisor rebuild and reindex on main, because the advisor dist is git-ignored

**Deliverables**:

- A default-off enablement gate with a pure resolver and two opt-in sources
- An adjustable advisor route-exclusion denylist with a committed default and an optional git-ignored local override
- Final-state evidence: package gate 296 of 296 tests, ten new advisor tests passing, and a live advisor probe that no longer returns `sk-communication`
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The projection layer was reachable by default, and the advisor could recommend `sk-communication` automatically. Both behaviors made the layer feel like an active default rather than an explicit choice. Pulling the repository could change how CLI output reads, and a routine prompt could surface a skill that the operator did not intend to run yet. The advisor also had no way to hold one skill out of routing without misrepresenting it.

### Purpose

Make communication projection off by default for everyone, opt-in-able privately on one machine, and absent from automatic routing, so the layer is adopted deliberately and never surprises a repository consumer.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- A default-off enablement gate in the package, `isProjectionEnabled()`, backed by a pure `resolveProjectionEnablement(env, localOverride)`.
- Two opt-in sources: the `COMMUNICATION_PROJECTION_ENABLED` environment variable and a git-ignored `enablement.local.json` at the package root, with the variable winning when set.
- An adjustable advisor route-exclusion loader with a committed default denylist and an optional git-ignored local override that fully replaces it.
- Wiring the denylist into both advisor routability seams, fail-safe on missing or malformed config.
- Recording final-state evidence and wiring Phase 016 into the parent packet.

### Out of Scope

- Any change to package or advisor runtime source, tests, or config, because that work is already built and verified.
- Rebuilding or committing the advisor dist, which is git-ignored and rebuilt on the target after landing.
- Rewriting historical spec or research references under `specs/`, which stay as an append-only record.
- Changing which skill ids are excluded beyond the committed `sk-communication` default.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-communication/cli-communication-projection/docs/configuration.md` | Modify | Add the Enablement section describing default-off and the two opt-in sources |
| `.opencode/skills/sk-communication/SKILL.md` | Modify | Note default-off and the advisor route-exclusion, so the skill is invoked by hand |
| `.opencode/skills/system-skill-advisor/mcp-server/config/README.md` | Create | Reference for the route-exclusion denylist, precedence, override directory, and the rebuild-and-reindex requirement |
| `016-default-off-and-advisor-exclusion/` | Create | Record the completed Level-3 packet and final-state evidence |
| `../spec.md`, `../graph-metadata.json`, `../015-package-into-skill/spec.md` | Modify | Add Phase 016 to the map, transition chain, handoff table, files table, graph, and the 015 successor |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Default to off. | With no environment variable and no local file, `resolveProjectionEnablement` and `isProjectionEnabled()` return `false`. |
| REQ-002 | Support a private per-machine opt-in. | Setting `COMMUNICATION_PROJECTION_ENABLED` to `1`, `true`, or `on` enables projection, and a git-ignored `enablement.local.json` holding `{ "enabled": true }` enables it when the variable is unset. The variable wins when both are present. |
| REQ-003 | Gate every activation path. | Each activation path calls `isProjectionEnabled()` before it projects and returns the exact original when the answer is `false`. |
| REQ-004 | Exclude the skill from automatic routing. | A live advisor probe for a projection-shaped prompt no longer returns `sk-communication`. |
| REQ-005 | Make the exclusion adjustable and fail-safe. | A committed `route-exclusions.json` holds the denylist, an optional git-ignored `route-exclusions.local.json` fully replaces it, and a missing or malformed config resolves to an empty set without throwing. |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | Prove no regression in the advisor. | Ten new route-exclusion tests pass, and a negative control with an empty exclusions directory shows the change adds zero new failures against the known 41-failure baseline. |
| REQ-007 | Prove the package gate stays green. | `npm run check` passes typecheck, build, 296 of 296 tests, and the public-import smoke. |
| REQ-008 | Record the deployment requirement. | The packet and the config README state that the git-ignored advisor dist must be rebuilt and reindexed on main for the compiled gate to take effect. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: With no opt-in present, projection resolves to off and no activation path rewrites output.
- **SC-002**: The environment variable and the local file each opt in, and the variable wins when both are set.
- **SC-003**: A live advisor probe for `make CLI output readable, claudish to english` at threshold 0.5 returns `cli-external-orchestration`, `sk-git`, `sk-design`, and `sk-code`, and no longer returns `sk-communication`.
- **SC-004**: The package gate reports 296 of 296 tests passing, and the advisor route-exclusion suite adds ten passing tests with zero new failures against the 41-failure baseline.
- **SC-005**: Phase 016 and the parent strict validators each report `Errors: 0  Warnings: 0`.

### Acceptance Scenarios

1. **Given** a clean environment with no opt-in, **When** enablement resolves, **Then** it returns `false` and projection stays dormant.
2. **Given** both opt-in sources set to conflicting values, **When** enablement resolves, **Then** the environment variable decides the result.
3. **Given** the live advisor and a projection-shaped prompt, **When** the probe runs, **Then** `sk-communication` is absent from the recommendations.
4. **Given** an empty or malformed route-exclusions config, **When** the loader runs, **Then** it returns an empty set and never throws.
5. **Given** the completed packet and parent links, **When** strict validation runs, **Then** both targets report zero errors and zero warnings.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Advisor dist is git-ignored | High | Record the rebuild-and-reindex requirement in the packet and the config README so the compiled gate takes effect on main. |
| Dependency | Advisor known-failure baseline | Medium | Pin the 41 pre-existing failures and prove the change adds zero new failures with a negative control. |
| Risk | A malformed config hides an active skill or crashes routing | High | The loader is fail-safe: any read or parse failure resolves to an empty set, so a broken file can only stop excluding a skill. |
| Risk | An operator opt-in leaks into the repository | Medium | Keep both opt-in files git-ignored and ship only committed `.example` templates. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance

- **NFR-P01**: Enablement and exclusion resolution are local, synchronous reads with no network access. The exclusion set is cached after first read.

### Security and Privacy

- **NFR-S01**: The opt-in choice stays on one machine. Both `enablement.local.json` and `route-exclusions.local.json` are git-ignored, and only `.example` templates are committed.
- **NFR-S02**: The config files and packet contain no credentials, message content, or protected spans.

### Reliability

- **NFR-R01**: A missing or malformed route-exclusions file resolves to an empty set and never throws, so a broken config cannot crash the advisor.
- **NFR-R02**: The default-off resolver is a pure function of its inputs, so its result is deterministic and exhaustively testable without disk access.

## 8. EDGE CASES

- The environment variable is set to an unrecognized value, which keeps projection off rather than guessing.
- Both opt-in sources are present and disagree, which the environment variable resolves.
- A local override sets `excludedSkillIds` to an empty list, which re-enables every skill on that machine.
- The route-exclusions config is absent or malformed, which yields an empty set.
- The advisor dist is stale on the target, which leaves the old routing in place until a rebuild and reindex run.

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Trigger |
|-----------|-------|---------|
| Scope | 16/25 | Two coordinated changes across the package and the shared advisor |
| Risk | 20/25 | Changes a default output behavior and touches the shared advisor routing runtime |
| Research | 12/20 | Confirming the advisor had no per-skill exclusion mechanism and locating both routability seams |
| Multi-Agent | 8/15 | Independent package and advisor verification lanes |
| Coordination | 15/15 | Explicit predecessor, successor, and post-land deployment handoffs |
| **Total** | **71/100** | **Level 3** |

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Projection activates without an explicit opt-in | High | Low | Default-off resolver and an activation-seam gate that returns the exact original |
| R-002 | A malformed config crashes routing or hides a skill | High | Low | Fail-safe loader that resolves to an empty set and never throws |
| R-003 | The compiled advisor gate is skipped because dist is stale | Medium | Medium | Documented rebuild-and-reindex requirement on main |

## 11. USER STORIES

### US-001: Dormant by default (Priority: P0)

**As a** repository consumer, **I want** projection off until I opt in, **so that** pulling the repository never changes how my CLI output reads.

**Acceptance Criteria**:

1. **Given** no opt-in, **When** enablement resolves, **Then** it returns `false` and no rewrite runs.
2. **Given** an opt-in source, **When** enablement resolves, **Then** projection is enabled for that machine only.

### US-002: Manual-only skill (Priority: P0)

**As an** operator, **I want** `sk-communication` held out of automatic routing, **so that** the advisor never surfaces it and I invoke it deliberately.

**Acceptance Criteria**:

1. **Given** the live advisor and a projection-shaped prompt, **When** the probe runs, **Then** `sk-communication` is absent.
2. **Given** a malformed config, **When** the loader runs, **Then** it returns an empty set and never throws.

### US-003: Adjustable denylist (Priority: P1)

**As a** maintainer, **I want** to change the exclusion without deprecating the skill, **so that** the denylist stays honest and reversible.

**Acceptance Criteria**:

1. **Given** a git-ignored local override, **When** the loader runs, **Then** it fully replaces the committed list.
2. **Given** an empty override list, **When** the loader runs, **Then** every skill is routable again on that machine.

## 12. OPEN QUESTIONS

No unresolved question blocks completion. The post-land advisor rebuild and reindex on main is a recorded deployment step, not an open design question.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: `plan.md`
- **Task Breakdown**: `tasks.md`
- **Verification Checklist**: `checklist.md`
- **Decision Record**: `decision-record.md`
- **Implementation Summary**: `implementation-summary.md`
- **Parent Packet**: `../spec.md`
