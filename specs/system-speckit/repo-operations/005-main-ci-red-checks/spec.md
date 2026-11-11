---
title: "Feature Specification: Repair the five checks that fail on main"
description: "Five workflows fail on every push to main. Each has its own cause, from a Node 22 test command to a stale baseline. This packet fixes each cause at its source."
trigger_phrases:
  - "main ci red checks"
  - "repair the five checks that fail on main"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Repair the five checks that fail on main

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-11-11 |
| **Branch** | `worktrees/346-main-ci-red-checks` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Five workflows fail on every push to main: Chart Corpus, Diagram Corpus, sk-doc Script Tests, Routing Registry Drift Guard and Spec-Kit Check. They failed on `5966aca389` and on the main commits before it, so a red run no longer tells anyone whether a push broke something.

### Purpose
Each of the five workflows passes on main again, with every failure fixed at its cause and no check weakened.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ gh run list --branch main (head 5966aca389, conclusion failure)
42975985867  Chart Corpus
42975985714  Diagram Corpus
42975985815  Spec-Kit Check
42975985640  Routing Registry Drift Guard
42975985629  sk-doc Script Tests

Chart Corpus and Diagram Corpus, step "Mutation suite", Node v22.23.4:
  Error: Cannot find module '.../sk-design-diagram/scripts/tests'

sk-doc Script Tests:
  FAIL test_readme_manifest.py (exit 1)
  MANIFEST derived=923 frozen=922 ... reproduced=False (added: .skilled/hooks/env-secret-guard)
  FAIL test_readme_verdict_parity.py (exit 1)
  PARITY baseline_files=1143 post_files=1143 diff_entries=48

Routing Registry Drift Guard:
  DRIFT cli-external-orchestration alias=0 stage-two=1 triggers=0 packets=0
  stage-two cli-deepseek-harness: "opencode go route" routes here in hub-router.json
  but no ROUTER.md intent for this mode carries it
  checked=7 hub(s), drift=1

Spec-Kit Check, CLI project:
  FAIL tests/upgrade-legacy-host-root.vitest.ts
    Error: ENOENT: no such file or directory, lstat '.../runtime/cli/.workflow-lock'
  FAIL tests/hook-registration-sync.vitest.ts
    AssertionError: expected 116 to be 108
  FAIL tests/template-staleness-discovery.vitest.ts (8 tests)
    SyntaxError: Unexpected end of JSON input
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Change the two corpus workflows to pass test files to `node --test` as a glob, which Node 22 accepts.
- Refresh the two sk-doc README baselines after the tree changes that made them stale.
- Add the phrase "opencode go route" to the DeepSeek harness intent in the CLI hub's `ROUTER.md` and carry it into the derived metadata.
- Fix the three Spec-Kit test failures: the binding count, the copy race on `.workflow-lock` and the array length expansion in the staleness checker.

### Out of Scope
- The three `sk-create-goal` READMEs that show `node --test` with a directory - no failing check runs them. They are noted as a follow-up.
- Two CLI tests that time out at 30 seconds in a full local run - they pass alone and did not fail in CI.
- A version bump or release note for the CLI hub - the change adds one keyword that the hub router already carried.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.github/workflows/chart-corpus.yml` | Modify | Pass the test files as a glob |
| `.github/workflows/diagram-corpus.yml` | Modify | Pass the test files as a glob |
| `.skilled/skills/sk-design/sk-design-chart/scripts/tests/README.md` | Modify | Show the glob command |
| `.skilled/skills/sk-design/sk-design-diagram/scripts/tests/README.md` | Modify | Show the glob command |
| `.skilled/skills/sk-design/sk-design-diagram/scripts/families/README.md` | Modify | Show the glob command |
| `.skilled/skills/sk-doc/scripts/tests/code-folder/durable-directory-manifest.json` | Modify | Add the new hook folder |
| `.skilled/skills/sk-doc/scripts/tests/code-folder/baseline-readme-verdicts.json` | Modify | Drop 48 removed READMEs and add 49 new ones |
| `.skilled/skills/cli-external-orchestration/ROUTER.md` | Modify | Add the phrase to the harness intent |
| `.skilled/skills/cli-external-orchestration/graph-metadata.json` | Modify | Regenerated intent signals |
| `.skilled/skills/system-skill-advisor/runtime/scripts/skill-graph.json` | Modify | Regenerated compiled graph |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/hook-registration-sync.vitest.ts` | Modify | Expect 116 bindings |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/upgrade-legacy-host-root.vitest.ts` | Modify | Leave `.workflow-lock` out of the copy |
| `.skilled/skills/system-spec-kit/runtime/cli/spec/check-template-staleness.sh` | Modify | Read the array length without a default |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | On Node 22, the mutation suite command of each corpus workflow runs every test file and exits 0. |
| REQ-002 | `bash .skilled/skills/sk-doc/scripts/tests/run-script-tests.sh` prints `all sk-doc script tests passed`. |
| REQ-003 | `node .skilled/skills/sk-doc/sk-create-skill/scripts/ci-hub-vocabulary-source.cjs` prints `drift=0` and `RESULT: PASSED`, and every other step of the routing workflow still passes. |
| REQ-004 | The three failing Spec-Kit test files pass in the CLI vitest project. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-005 | All five workflows conclude `success` on the main commit that carries these fixes. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Each of the five workflow commands that failed passes when run from worktree 346.
- **SC-002**: `gh run list --branch main` shows no failed workflow on the commit that carries the fixes.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | A push to main, which is the operator's call | REQ-005 stays open until then | Local gates prove REQ-001 to REQ-004 first |
| Risk | The array expansion fix is inferred, since no Bash 4 or later exists on this machine | Med | The CI run on Linux confirms it. The bare length form is valid on every Bash |
| Risk | A refreshed baseline could hide a real verdict change | Low | All 48 mismatches were READMEs that no longer exist on disk, checked one by one |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- /ANCHOR:nfr -->

N/A: the packet changes CI commands, test fixtures and one routing keyword. It runs no service.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: a spec root with no packets makes the staleness checker print a zero count and exit 0.
- Maximum input: the glob passes every `*.test.cjs` file, 21 diagram tests and 88 chart tests today.
- Failure path: a real failing test still exits 1 through the glob form, since `node --test` reports per file.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 8/25 | 13 files, about 20 hand-written lines, two regenerated baselines |
| Risk | 5/25 | CI commands and test fixtures, one routing keyword |
| Research | 8/20 | Five separate root causes to trace |
| **Total** | **21/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->

---
