---
title: "Feature Specification: Phase 17: build-compiled-serving-gold-admission-checker"
description: "Build the checker that admits a hub to compiled-serving by running its compiled decisions against its playbook's routing gold, with coverage floors, so admission works again without the retired parity harness."
trigger_phrases:
  - "compiled-serving admission checker"
  - "routing gold admission check"
  - "compiled route admission build"
  - "phase 17 gold checker"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 17: build-compiled-serving-gold-admission-checker

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | In Progress |
| **Created** | 2026-09-19 |
| **Branch** | `worktrees/055-skilled-source-root-migration` |
| **Parent Spec** | ../spec.md |
| **Phase** | 17 of 17 |
| **Predecessor** | 016-fix-stale-compiled-routing-docs-and-research-workflow |
| **Successor** | None |
| **Handoff Criteria** | The checker runs over all five admitted hubs in CI, its baseline is triaged, and the flip step works again |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 17** of the skilled source-root migration specification.

**Scope Boundary**: Build the admission checker, its tests and its CI step, run it once over the admitted hubs, and repair the flip step. Admitting a new hub is out of scope because none is waiting.

**Dependencies**:
- Phase 15's research, whose recommendation and scoring rules this phase builds.
- The operator's choice of the restated admission bar on 2026-09-19.
- The operator's answers in section 10.

**Deliverables**:
- `.skilled/bin/compiled-route-admission.cjs` with tests and a CI step.
- A baseline report over the five admitted hubs, with each failure triaged.
- A working flip step.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
A hub serves compiled routing only after it earns the `compiled-serving` verdict, and the only tool that measured it was retired. No hub can be admitted, and the five admitted hubs are measured against nothing. On 2026-09-19 the operator chose the bar phase 15 recommended: a hub's compiled decisions must satisfy the routing gold its playbook already authors, with coverage floors. Nothing checks that yet, and the authored tool that flips a hub to compiled serving fails first, because its scorer path no longer exists.

### Purpose
Any hub can be checked against the admission bar with one command, the check runs in CI, and a hub that passes can be flipped.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A checker, `.skilled/bin/compiled-route-admission.cjs`, taking `--hub <id>` or `--all` and writing JSON and Markdown reports. It exits non-zero on drift, a broken engine or too little coverage.
- A gold loader that reads each scenario's typed frontmatter (`expected_workflow_mode`, `expected_leaf_resources`, `stage`) and fails loudly on a value it cannot parse.
- Scoring as phase 15 set out in section 6 of its research. Decisions come from `compiledRoute()`, and targets are bridged through `qualifiedIdToLeaf`. Leaf gold is must-include at mode granularity, and negative, `UNKNOWN` and `defer` gold fail a compiled route. Gold-less rows count as `n/a`, and fitted and holdout results are reported apart.
- Coverage floors, per the decision in section 10.
- Tests: a fixture per status, a live run on one hub, and a pin on the corpus size.
- One baseline run over the five admitted hubs, triaging each failure as engine drift or stale gold.
- A CI step beside `compiled-route-guard.cjs`.
- A working flip step, per the decision in section 10.
- The admission runbook in `compiled-routing-architecture.md`.

### Out of Scope
- Admitting a new hub - no candidate is waiting.
- Changing how the five admitted hubs serve - a baseline failure is triaged and reported, not acted on here.
- Writing the missing gold - the baseline lists the gaps as authoring work for each hub's owner.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/bin/compiled-route-admission.cjs` | Create | The checker's command line |
| `.skilled/bin/lib/compiled-route-admission.cjs` | Create | Gold loader, scorer and report writer |
| `.skilled/bin/tests/compiled-route-admission.test.cjs` and fixtures | Create | Status fixtures, live run, corpus pin |
| `.github/workflows/routing-registry-drift.yml` | Modify | Run the checker beside the route guard |
| `specs/sk-doc/019-skill-routing-refactor/015-router-unification-program/shared/frozen-scorer-contract.cjs`, `shared/admission-gate.cjs`, `014-runtime-engine/lib/flip-serving.cjs`, `013-live-activation/lib/activate-hub.cjs` | Modify and Create | A flip that works, gated on the admission check |
| `.skilled/skills/sk-doc/sk-create-skill/references/parent-skill/compiled-routing-architecture.md` | Modify | Admission runbook |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | The checker scores every typed-gold scenario of a hub by the rules in scope, and a scenario it cannot parse fails the run rather than being skipped. |
| REQ-002 | The checker never changes serving: it calls `compiledRoute()` directly and writes no manifest. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-003 | Coverage floors are enforced as decided, and a hub below them fails `insufficient-coverage`. |
| REQ-004 | Tests cover every status and sub-reason, one live hub, and the corpus size. |
| REQ-005 | CI runs the checker over the five admitted hubs. |
| REQ-006 | A baseline report exists, and every failure in it is classed as engine drift or stale gold. |
| REQ-007 | The flip step runs to completion in a sandbox. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `node .skilled/bin/compiled-route-admission.cjs --all` reports a result per hub, and CI fails when a hub drifts.
- **SC-002**: A hub author can follow the reference's runbook from a built shadow child to a flipped manifest.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Coverage floors fail most admitted hubs on day one | High | Section 10 decides whether floors bind admitted hubs or only new ones; the phase 15 count shows four of five hubs below a per-mode floor |
| Risk | Authored gold has drifted from live behaviour | Med | The baseline triages each failure before CI is made blocking |
| Risk | The checker becomes its own oracle | Med | Scoring rules are fixed in fixtures before the live run |
| Dependency | The answers in section 10 | Low | Answered on 2026-09-19 |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: `--all` finishes in under a minute on a developer machine; it evaluates 73 prompts.

### Security
- **NFR-S01**: The checker reads only the repository and writes only its report path.

### Reliability
- **NFR-R01**: The same tree gives the same report, byte for byte.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- A scenario with gold for a mode the hub does not declare: fails as stale gold.
- Multi-mode gold such as `sk-create-agent+sk-create-command`: scored per the decision in section 10.
- 21 of the 73 scenarios have an empty leaf list: the mode is scored and there is no leaf to check.

### Error Scenarios
- A hub's engine throws: the hub reports `broken`, not a pass.

### State Transitions
- Flag forced off or a legacy manifest: irrelevant to the checker, which bypasses the serving gate by design.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 14/25 | A new tool, its tests, a CI step and a flip repair |
| Risk | 12/25 | A new blocking CI gate over admitted hubs |
| Research | 6/20 | Phase 15 did it |
| **Total** | **32/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

The operator accepted all five recommendations on 2026-09-19, so none is open:

- **A `clarify` decision counts like `defer`, as a non-route.** It passes on `UNKNOWN` or `defer` gold and fails on concrete gold.
- **Coverage floors bind new hubs only.** A new hub needs at least one scored positive scenario per declared workflow mode and at least one negative or `defer` scenario. The admitted hubs get the same measurement as a gap report that does not fail them.
- **Multi-mode gold is must-include.** The route passes when its targets cover every listed mode.
- **The flip tool is repaired, not replaced.** `SCORER_DIR` is repointed at `runtime/lib/scorer`, and the digests are re-pinned.
- **CI starts warn-only** and blocks once the baseline is triaged.

The build found three things these answers did not cover, and each needs a decision:

- **The canary gate was dead for every hub.** The activation and flip tools both ran each hub's `validate-canary.cjs`, and all five canaries pinned and scored through the skill-benchmark modules phase 13 retired, and pinned authored sources that have since moved. The operator chose on 2026-09-19 to replace that gate with the admission check, which this phase did.
- **The scorer freeze cannot be renewed on its own rule.** The pins say to re-freeze only when the routing battery is green on the new scorer, and two of the advisor's parity tests are red. The operator moved that work to phase 18.
- **Blocking CI needs the baseline clean or excused.** The baseline records three engine drifts and one stale gold entry against admitted hubs, so a blocking step would fail every push.
<!-- /ANCHOR:questions -->

---
