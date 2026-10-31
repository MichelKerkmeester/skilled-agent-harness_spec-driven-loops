---
title: "Feature Specification: Phase 12: alignment-fixes"
description: "Seven alignment findings left CI and its tests out of step with the tree: stale workflow citations, an advisor suite no workflow ran, a naming guard that rejected a runtime-written name and skipped main, two host-dependent hook tests and a runtime lint check that could not pass."
trigger_phrases:
  - "alignment fixes"
  - "phase 12 alignment fixes"
  - "advisor default suite in ci"
  - "synthesis marker naming exemption"
  - "runtime lint check passes"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 12: alignment-fixes

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-10-27 |
| **Branch** | `main` (worktree `236-ci-test-fixes`) |
| **Parent Spec** | ../spec.md |
| **Phase** | 12 of 12 |
| **Predecessor** | 011-ci-health-followups |
| **Successor** | None |
| **Handoff Criteria** | Every finding below is fixed with a recorded check, and `validate.sh --strict` passes on this folder and the parent |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 12** of the CI workflow efficiency specification.

**Scope Boundary**: the seven findings of the CI and tests lane of the alignment audit: B-01, B-02, C-crit-03, C-crit-04, A-05, A-06 and A-07. Nothing else.

**Dependencies**:
- The workflows and sk-code-ci references as shipped by phases 006 to 011.

**Deliverables**:
- Corrected citations, one CI step pair for the advisor default suite, a naming-guard exemption plus a `main` push trigger, two hook tests pinned to a version, and a runtime lint check that exits 0.

**Changelog**:
- Component changelogs: sk-code-ci v1.1.3.0, sk-doc v2.3.22.0, system-spec-kit v2.12.10.0.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The alignment audit found seven places where CI or its tests disagreed with the tree. Two reference docs cited workflow lines that had moved, the advisor's default vitest suite ran in no workflow, the naming guard rejected a file name the deep-loop runtime writes and never ran on pushes to `main`, two hook tests passed or failed with the host's opencode version, and the spec-kit runtime's `npm run check` failed on 239 lint errors from its own configuration.

### Purpose
Each finding is fixed at its cause and carries a check that fails before the change and passes after it.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ sed -n 61p .github/workflows/pi-extension-tests.yml ; sed -n 92p .github/workflows/opencode-dual-version.yml
      fail-fast: false
      fail-fast: false            (the doc cited :57 and :91)

$ npx vitest run   (advisor runtime, fresh checkout, no skill-graph database)
 Test Files  5 failed | 145 passed (150)
      Tests  6 failed | 1247 passed | 8 skipped (1261)

$ python3 check_no_new_snake_case.py --changed-since 583316d0833e   (before)
FAIL: 18 newly introduced since 583316d0833e ... (10 of them synthesis_complete.json)

$ node --test .skilled/hooks/shared/hook-stdin-deadline.test.mjs   (host opencode v2.1.4)
ℹ pass 19  ℹ fail 2

$ npx eslint .   (spec-kit runtime)
52 files, 239 errors, 5 warnings   (cli 167, hooks 73, tests 4)
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Correct the four stale `file:line` citations in `trigger-and-filter-rules.md` and `ci-workflow-standards.md`.
- Run the advisor default suite, which includes the Python compatibility suite, in `skill-advisor-stress.yml` under its existing filters and the `SKILLED_CI_TESTS` switch.
- Exempt `synthesis_complete.json` in the naming guard and add `main` to its push trigger.
- Pin the OpenCode version in the A-06 and A-07 test cases through existing seams.
- Make `npm --prefix .skilled/skills/system-spec-kit/runtime run check` exit 0.

### Out of Scope
- Renaming the 32 tracked `synthesis_complete.json` copies or changing the deep-loop runtime - the brief forbids it, and the runtime would write the name again.
- The 8 other snake_case names the guard still reports since `583316d0833e` (session transcripts and one `research_archive` folder) - not part of these findings.
- The intentional 3-second timeout test in `dispatch-rule-checks.test.mjs` - it tests the timeout itself, and no seam shortens the timer.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/sk-code/sk-code-ci/references/trigger-and-filter-rules.md` | Modify | Citation `:9-12` and `:21-24` |
| `.skilled/skills/sk-code/sk-code-ci/references/ci-workflow-standards.md` | Modify | Citation `:61` and `:92` |
| `.skilled/skills/sk-code/sk-code-ci/references/job-shape-rules.md` | Modify | Timeout table gains the advisor job |
| `.github/workflows/skill-advisor-stress.yml` | Modify | Graph scan plus default suite, timeout 25 |
| `.github/workflows/naming-standard-guard.yml` | Modify | `main` added to the push branches |
| `.github/workflows/README.md` | Modify | Two rows follow the workflow changes |
| `.skilled/skills/sk-doc/shared/scripts/check_no_new_snake_case.py` | Modify | Runtime-generated name exemption |
| `.skilled/skills/sk-doc/scripts/tests/test_no_new_snake_case_guard.py` | Modify | New exemption test |
| `.skilled/hooks/dispatch/lib/dispatch-rule-checks.test.mjs` | Modify | Cache the stub versions through the probe seam |
| `.skilled/hooks/shared/hook-stdin-deadline.test.mjs` | Modify | v1 stub first on PATH |
| `.skilled/skills/system-spec-kit/runtime/eslint.config.mjs` | Modify | `^_` rule for all JS flavours |
| `.skilled/skills/system-spec-kit/runtime/cli/**` (36 files) | Modify | Dead imports, helpers and bindings removed, `any` replaced with real types, two `require()` calls given a module-scoped `createRequire` |
| `.skilled/skills/system-spec-kit/runtime/hooks/claude/session-prime.ts` | Modify | Drop an unused type import |
| `.skilled/skills/system-spec-kit/runtime/hooks/lib/spec-gate/spec-gate-core.mjs` | Modify | Drop an unused parameter, mark another |
| `.skilled/skills/system-spec-kit/runtime/tests/hooks/spec-gate-devin.test.mjs` | Modify | Drop a dead helper |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Each corrected citation prints the claimed text: `sed -n` on the cited lines shows the twin entry and `fail-fast: false` (B-01, B-02). |
| REQ-002 | `skill-advisor-stress.yml` runs `npm test` in the advisor runtime after a skill-graph scan, inside the job gated by `SKILLED_CI` and `SKILLED_CI_TESTS` (C-crit-03). |
| REQ-003 | The naming guard accepts `synthesis_complete.json`, still rejects a sibling snake_case name, and its push trigger lists `main` (C-crit-04). |
| REQ-004 | `npm --prefix .skilled/skills/system-spec-kit/runtime run check` exits 0 with `cli/` linted and no rule disabled: 239 errors before, 137 after the `^_` rule change (133 of them in `cli/`), 0 after the code fixes. The cli package's own typecheck, `check` and test suite still pass (A-05). |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-005 | The quoted/wrapped/path-qualified case in `dispatch-rule-checks.test.mjs` spawns no version probe, and the file passes 5 runs in a row (A-06). |
| REQ-006 | The two preflight cases in `hook-stdin-deadline.test.mjs` pass on a host whose opencode is v2, and the file passes 5 runs in a row (A-07). |
| REQ-007 | The runner-minute cost of the new advisor step is measured and recorded here (C-crit-03). |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `check_no_new_snake_case.py --changed-since 583316d0833e` reports 8 names instead of 18, none of them `synthesis_complete.json`.
- **SC-002**: The advisor default suite passes 150 of 150 files after `skill_graph_scan`, where a fresh checkout failed 5.
- **SC-003**: The spec-kit runtime lint reports 0 errors, down from 239.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The advisor CLI and daemon start in CI from the built `dist/` | The scan step fails if the build fails | The build step runs first in the same job, and a failed scan fails the job visibly |
| Risk | The default suite is slower on a CI runner than locally | Med | Timeout raised to 25 minutes with its basis in a comment, to be resized after 40 runs |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- /ANCHOR:nfr -->

### Performance
- **NFR-P01**: The advisor step adds about 2.7 minutes per run (local `npm test`: 2:40.51 wall). Over the 30 days to 2026-10-27 the workflow ran 73 times (59 push, 14 pull request), so the added load is about 197 runner-minutes a month, near 6.6 a day.
- **NFR-P02**: The A-06 case drops from 50 to 266 ms to 3.5 to 8 ms per run.

### Security
- **NFR-S01**: No new secret, token or permission. Both edited workflows keep `contents: read`.
- **NFR-S02**: The scan step runs repository code the job already ran in its build step, so it adds no new trust boundary.

### Reliability
- **NFR-R01**: The A-06 and A-07 cases no longer depend on probe timing or the host's opencode.
- **NFR-R02**: The guard's new exemption is one exact file name, never a pattern.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: a push that only adds synthesis markers passes the guard, which the new fixture test shows.
- Maximum input: the guard's replay of everything since `583316d0833e` finishes in 12.6 seconds locally.
- Failure path: a directory named `synthesis_complete.json` or a sibling such as `synthesis_pending.json` still fails the guard with exit 1.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 12/25 | 14 source files across three skills, two workflows and two hook tests |
| Risk | 8/25 | Two protected-adjacent workflows and one spec-gate signature change |
| Research | 8/20 | The advisor failures and the spec-gate parameter needed tracing |
| **Total** | **28/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- `naming-standard-guard.yml` is in the protected set as an input guard, and `protected-set.md` rule 2 asks for a second named confirmation before it is edited. The operator gave that second confirmation for this edit on 2026-10-27.
- The plan asked for `main` with path filters. A filter that has to list every top-level root saves no runner minutes, and it would also narrow the `skilled/v*` push coverage the guard has today, so the trigger adds `main` with no filter.
<!-- /ANCHOR:questions -->

---
