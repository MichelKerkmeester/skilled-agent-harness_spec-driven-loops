---
title: "Feature Specification: Phase 15: compiled-serving-admission-research"
description: "Research how a new parent hub can be admitted to compiled-serving now that the Lane C parity harness that measured admission is retired, and recommend one path with its costs."
trigger_phrases:
  - "compiled-serving admission research"
  - "lane c parity replacement"
  - "compiled routing admission path"
  - "routing gold agreement checker"
importance_tier: "important"
contextType: "research"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 15: compiled-serving-admission-research

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-09-18 |
| **Branch** | `worktrees/055-skilled-source-root-migration` |
| **Parent Spec** | ../spec.md |
| **Phase** | 15 of 15 |
| **Predecessor** | 014-fix-pre-existing-defects-found-by-migration |
| **Successor** | None |
| **Handoff Criteria** | `research/research.md` recommends one admission path, names its costs and risks with cited evidence, and lists the build steps a later phase would take |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 15** of the skilled source-root migration specification.

**Scope Boundary**: Research only. Ten iterations of `/deep:research`, five on SWE 2 Max through cli-devin and five on DeepSeek V4.1 Flash at max effort through LLM Gateway on cli-pi, with early convergence off. No code changes; a build, if the operator wants one, is a later phase.

**Dependencies**:
- Phase 13 retired the skill-benchmark lane, which held the only tool that measured compiled-serving parity.
- Phase 14 recorded the gap as an open question.

**Deliverables**:
- `research/research.md` with a ranked recommendation among the three paths.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
A parent hub serves compiled routing only after it earns the `compiled-serving` verdict: its compiled decision must match its legacy decision on every scenario, with zero drift. The Lane C harness measured that, and it was retired with the skill-benchmark lane. The five hubs already admitted keep their measured verdict, but no tool can admit a new one, and `sk-doc/sk-create-skill/references/parent-skill/compiled-routing-architecture.md` now says so.

### Purpose
Decide, on evidence, how admission should work from now on: restore the retired parity path, build a new checker against routing gold, or keep admission closed.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- **Q1**: What exactly did Lane C parity measure, and which retired modules would a restored path need? The parity harness was `compiled-routing-parity.cjs`, deleted in `b45ea54cea3` with `score-skill-benchmark.cjs`, `router-replay.cjs` and `load-playbook-scenarios.cjs`; read them at `b45ea54cea3^`.
- **Q2**: Can the compiled decision from `compiledRoute(hubId, taskText)` in `.skilled/bin/lib/compiled-routing/014-runtime-engine/lib/compiled-route.cjs`, checked against each routing scenario's gold (`expected_workflow_mode`, `expected_leaf_resources`), serve as the admission bar? How should `defer`, holdout and negative scenarios count?
- **Q3**: What else does admission need beyond the check: the frozen `HUB_CHILD` and `DEFAULT_ON_HUBS` tables in `resolve.cjs`, the activation manifest re-mint, and `compiled-route-guard.cjs` freshness?
- **Q4**: What does each path cost and risk, including keeping admission closed?
- **Q5**: Which path is recommended, and what would a later phase build and test?

### Out of Scope
- Implementing any path - research reports findings; a build is a separate phase.
- Changing how the five admitted hubs serve today.
- Reopening the decision to retire the skill-benchmark lane as a whole.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `research/**` | Create | The research loop's own state, iterations and `research.md` |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-001 | Ten iterations run, five per executor, and none stops early on convergence. |
| REQ-002 | `research/research.md` answers Q1 to Q5 with every finding citing a file and line or a commit. |
| REQ-003 | The recommendation names one path, its costs, its risks, and the steps a build phase would take. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The operator can pick a path from `research/research.md` without further investigation.
- **SC-002**: Each lineage completed five iterations.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | cli-devin and cli-pi availability and quota | High | The fan-out runner's preflight and stall watchdog fail loud; a failed lineage is reported, not retried with another model |
| Risk | A lineage writes outside its sub-packet | Med | Write containment reports it against that lineage; no tracked files are edited while lineages run |
| Risk | The two models agree for the wrong reason | Med | Synthesis weighs cited evidence, not agreement |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Each lineage stays under the default four-hour ceiling.

### Security
- **NFR-S01**: No private home-derived path enters a tracked file.

### Reliability
- **NFR-R01**: A lineage failure is recorded with its cause, never hidden by the merge.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- A retired module no longer in the tree: read it from `b45ea54cea3^`.

### Error Scenarios
- One lineage fails: synthesis proceeds on the other and says so.

### State Transitions
- A lineage stalls: the watchdog aborts and requeues it within its ceiling.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 8/25 | Research only |
| Risk | 6/25 | No code changes |
| Research | 16/20 | Reads retired code from history and live runtime code |
| **Total** | **30/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- Q1 to Q5 are answered in `research/research.md`. The operator accepted the restated admission bar on 2026-09-19. Still open for the build: how a `clarify` decision counts, and what coverage floor each workflow mode needs.

<!-- BEGIN GENERATED: deep-research/spec-findings -->
**Research findings** (abridged from `research/research.md`, which stays canonical; 10 iterations, two lineages, 5 of 5 questions answered)

- **Recommendation:** build a new checker that runs each hub's `compiledRoute()` decision against its playbook's typed routing gold, and restate the admission bar it enforces. Both lineages reached this independently.
- **Restated bar:** a hub is admitted when its compiled decisions satisfy the authored routing gold on its full typed-gold corpus, with coverage floors, and no scenario drifts. The retired bar was equality with a replay of the legacy router.
- **Restore cost:** about 4,200 lines in four retired modules plus a driver, three of them SHA-256-pinned. Keeping admission closed costs nothing but freezes the cohort and leaves the admitted hubs unmeasured.
- **Corrections:** the admitted cohort is five hubs, not seven; the authored flip tool's scorer path points at a directory that no longer exists; sk-code's hub playbook carries one typed-gold scenario.
- **Corpus:** 73 typed-gold scenarios at the five hubs' playbook roots.
<!-- END GENERATED: deep-research/spec-findings -->
<!-- /ANCHOR:questions -->

---
