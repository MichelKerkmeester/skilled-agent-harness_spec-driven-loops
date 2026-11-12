---
title: "Feature Specification: Phase 11: sparse-checkout-rollout"
description: "Seven CI workflows check out all 134,068 tracked files to read a named path set outside specs/. The phase adds the sparse cone already measured in rule-canary-sync.yml to those seven and proves the checkout step gets shorter."
trigger_phrases:
  - "sparse checkout rollout"
  - "phase 11 sparse checkout rollout"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 11: sparse-checkout-rollout

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-11-12 |
| **Branch** | `worktrees/350-test-ci-wait-cuts` |
| **Parent Spec** | ../spec.md |
| **Phase** | 11 of 17 |
| **Predecessor** | 010-sk-doc-tests-path-filter |
| **Successor** | 012-advisor-suite-parallel-trial |
| **Handoff Criteria** | Seven workflows carry a cone whose coverage check prints `OK`, and the comparison over `scratch/checkout-baseline.md` and `scratch/checkout-after.md` prints `ALL LOWER`. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 11** of the Shorten the wait after a push by rearranging CI checks and removing dead test infrastructure specification.

**Scope Boundary**: The checkout step of seven workflows whose steps read a named path set outside `specs/`. Trigger filters, job steps, timeouts and test code stay unchanged.

**Dependencies**:
- The sparse block in `.github/workflows/rule-canary-sync.yml`, measured at 3 s against a 52 s baseline in ADR-010.
- The operator's go-ahead for the push that measures the result.

**Deliverables**:
- One `with:` block per checkout step, eight in total across the seven workflows.
- The read-set inventory in `plan.md` section 3, covering all 32 workflows.
- `scratch/checkout-baseline.md` and `scratch/checkout-after.md`, the before and after checkout times.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Every job checks out 134,068 tracked files, and 113,819 of them sit under `specs/`. The checkout step in the seven workflows this phase touches spent 55 to 74 s in its latest completed run, although none of their steps reads `specs/`.

### Purpose
Cut the checkout to the named paths each job reads in seven workflows, and prove the cut parses, covers every path the steps name, and shortens the checkout after a push.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior

Run from the repository root on 2026-11-12. The checkout figures are the `actions/checkout` step of each workflow's latest successful run at that time, one figure per job, with the Pi matrix jobs listed in job order.

```text
$ bash -c '
printf "tracked files: %s\n" "$(git ls-files | wc -l | tr -d " ")"
printf "tracked files under specs/: %s\n" "$(git ls-files specs | wc -l | tr -d " ")"
printf "workflow YAMLs: %s\n" "$(ls -1 .github/workflows/*.yml | wc -l | tr -d " ")"
printf "workflows with sparse-checkout: %s\n" "$(rg -l "sparse-checkout" .github/workflows/*.yml | wc -l | tr -d " ")"
for f in prompt-card-sync repo-rules-corpus runtime-no-spec-import chart-corpus diagram-corpus pi-extension-tests sk-code-script-tests; do
  id=$(gh run list --workflow "$f.yml" --limit 15 --json databaseId,conclusion --jq "[.[]|select(.conclusion==\"success\")][0].databaseId")
  vals=$(gh run view "$id" --json jobs --jq "[.jobs[] | .steps[] | select(.name|test(\"^Run actions/checkout\";\"i\")) | (((.completedAt|fromdateiso8601)-(.startedAt|fromdateiso8601))|tostring)] | join(\",\")")
  printf "checkout %s: %s s\n" "$f.yml" "$vals"
done
rg -n "Checkout takes" specs/system-speckit/runtime-and-release/006-test-cycle-speed/007-test-and-ci-bloat-research/research/research.md
rg -n "sparse variant at 3 s" specs/system-speckit/repo-operations/002-ci-workflow-efficiency/004-setup-caching-provisioning/decision-record.md
'
tracked files: 134068
tracked files under specs/: 113819
workflow YAMLs: 32
workflows with sparse-checkout: 1
checkout prompt-card-sync.yml: 57 s
checkout repo-rules-corpus.yml: 59 s
checkout runtime-no-spec-import.yml: 74 s
checkout chart-corpus.yml: 57 s
checkout diagram-corpus.yml: 59 s
checkout pi-extension-tests.yml: 58,27,31 s
checkout sk-code-script-tests.yml: 55 s
79:The repository tracks 133,851 files and 2.1 GB. About 1.8 GB of that is under `specs/`, and 88,003 of the 113,605 tracked files under `specs/` are research, review, scratch or archive artifacts. Every job checks all of it out. Checkout takes 25 to 64 seconds per job.
32:      - "Does filter: blob:none save anything on a single-commit checkout? No: 98 s against a 52 s baseline, and the sparse variant at 3 s was kept (scratch/checkout-probe.md)"
```

The 25 to 64 s line is the research's earlier sample. The per-workflow figures above are the measurements this phase compares against.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add the sparse cone to `prompt-card-sync.yml`, `runtime-no-spec-import.yml`, `chart-corpus.yml`, `diagram-corpus.yml` and `pi-extension-tests.yml`. The plan also named `repo-rules-corpus.yml` and `sk-code-script-tests.yml`. Both were reverted after a local simulation of the cone failed: the repo-rules guard failed its rule-links check, and an sk-code test could not open `.opencode/plugins/system-skill-advisor.js`.
- Record each workflow's read set in `plan.md` section 3 before the edit.
- Prove that each edited file parses and that its cone covers every path its steps name.
- Compare the post-push checkout step duration with the pre-change duration.

### Out of Scope
- Workflows that walk the whole repository, such as `markdown-link-integrity.yml` and `advisory-checks.yml`. Their read set is not a named path list.
- Workflows that need `fetch-depth: 0` changed-path history, such as `comment-hygiene.yml` and `message-contract.yml`. A sparse cone can hide a changed path from the diff.
- Workflows that read `specs/`, such as `changed-packet-validation.yml` and `routing-registry-drift.yml`.
- Workflows whose test read set is not enumerated, such as `spec-kit-check.yml`, `deep-loop-runtime.yml` and `sk-doc-rename-harness.yml`. A later phase can take them once the inventory exists.
- Trigger filters, job steps, timeouts and test code. This phase changes only the checkout `with:` block.
- Untracking the `specs/` artifacts. The research leaves that as a separate decision.

**Regression exposure**: none. Each cone names every path its steps read, and six of the seven workflows fail closed when a named input is missing. The prompt-card guard prints `MISSING` and exits 1, the repo-rules guard fails on a missing router or corpus file, the no-spec-import guard exits 2 on an empty scan, the two corpus checkers fail when their package directory or a named asset is absent, and the Pi discovery job exits 1 on an empty `find`. `sk-code-script-tests.yml` is the one exception: its `node --test` globs exit 0 with 0 tests when a path is absent, so its protection is the cone entry for `.skilled/skills/sk-code/`, the coverage check in T010, and the post-push test count in T013. None of the seven runs a whole-repository walk or a `git diff` across paths outside its cone.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.github/workflows/prompt-card-sync.yml` | Modify | Add the four-entry cone from `plan.md` section 3 |
| `.github/workflows/repo-rules-corpus.yml` | Modify | Add the five-entry cone from `plan.md` section 3 |
| `.github/workflows/runtime-no-spec-import.yml` | Modify | Add the one-entry cone from `plan.md` section 3 |
| `.github/workflows/chart-corpus.yml` | Modify | Add the two-entry cone from `plan.md` section 3 |
| `.github/workflows/diagram-corpus.yml` | Modify | Add the two-entry cone from `plan.md` section 3 |
| `.github/workflows/pi-extension-tests.yml` | Modify | Add the one-entry cone to both checkout steps, from `plan.md` section 3 |
| `.github/workflows/sk-code-script-tests.yml` | Modify | Add the eight-entry cone from `plan.md` section 3 |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Each of the seven workflows checks out only its named read set, with `sparse-checkout-cone-mode: false` and no `/specs` entry. | The coverage check prints `OK` for the file, and the cone holds no `/specs` line. |
| REQ-002 | Every edited workflow parses as YAML. | `yaml.safe_load` exits 0 for each of the seven files. |
| REQ-003 | Every tracked symlink a step reaches through is named in the cone. | `/.opencode/skills` is present wherever a step calls `.opencode/skills/...`, and the coverage check prints `OK`. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | No workflow outside the seven changes. | `git status --porcelain .github/workflows` lists exactly seven paths, all from section 3. |
| REQ-005 | Each edited workflow's post-push checkout duration is lower than its pre-change duration. | The comparison command prints `ALL LOWER`. |
| REQ-006 | The sk-code job still runs its suites after the push, since its `node --test` globs pass with 0 tests on a missing path. | `gh run view <id> --log` holds at least one `tests <n>` line with n above 0. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The coverage check prints `OK` for all seven edited files, and `yaml.safe_load` parses each one.
- **SC-002**: A push leaves the seven workflows green, and each printed checkout duration is lower than its pre-change value.
- **SC-003**: The sk-code job reports a nonzero test count in its post-push log.
- **SC-004**: `git status --porcelain .github/workflows` lists exactly the seven files named in section 3.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Operator go-ahead for the push | The post-push measurement cannot run | Run the local checks, leave the push task blocked `[B]`, and record the run URL for the operator |
| Dependency | `actions/checkout` v7 sparse support | The cone is ignored or the checkout step fails | The reference block in `rule-canary-sync.yml` uses the same inputs. Revert the file's `with:` block |
| Risk | A step reads a path the inventory missed | High, the job fails at checkout or at the step | `plan.md` section 3 names every read. Six checkers fail closed, and one file reverts alone. The sk-code globs do not fail closed, so T010 and T013 cover that file |
| Risk | A git-diff step reads a path outside the cone | High, the diff silently sees nothing | No included workflow runs a `git diff`. The workflows that do are excluded |
| Risk | A test reads a fixture outside the named roots | Medium, the test fails | The seven read sets include every fixture root the steps name. Outside sk-code a missing path fails the step. The sk-code globs are the exception, covered by T010 and T013 |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Does the checkout drop below its pre-change time in every edited workflow, or does runner variance hide it? Decision: compare against the latest pre-change run, and read two more runs when a drop is under 5 s.
- Which excluded workflow gets the next trial once its read set is enumerated? Decision: a later phase. This phase stops at the seven bounded files.
<!-- /ANCHOR:questions -->

---
