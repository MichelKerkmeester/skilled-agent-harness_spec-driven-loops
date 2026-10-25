---
title: "Feature Specification: Phase 10: deep-review-finding-fixes"
description: "Fix the nine required findings and every reproducing suggestion from the 2026-10-25 deep review of packet 054, plus the three tooling gaps that review hit, each proved by a check that failed before the fix."
trigger_phrases:
  - "deep review finding fixes"
  - "phase 10 deep review finding fixes"
  - "054 review remediation"
  - "create.sh track traversal fix"
  - "placeholder scanner parity fix"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.3 -->
# Feature Specification: Phase 10: deep-review-finding-fixes

<!-- SPECKIT_LEVEL: 3 -->


---

## EXECUTIVE SUMMARY

The 2026-10-25 deep review of packet 054 returned CONDITIONAL with nine required findings (P1) in surfaces the packet built or relied on, about sixty suggestions (P2) and three tooling gaps. This phase fixes each P1 at its source, fixes every P2 that reproduces when re-checked and closes the three gaps. Each fix is proved by a check that failed before it, recursive strict validation over `specs/` keeps its pass and fail counts, and a closing review by cli-devin and then cli-codex luna reports no P0 or P1.

**Key Decisions**: the required-section check applies only to docs stamped v2.3 or later, the same boundary the parent's decision D2 set for the placeholder gate. A P2 is fixed only after it reproduces, and one that does not is recorded as not reproduced with the check that showed it.

**Critical Dependencies**: the review report `../review/review-report.md` and its merged registry `../review/deep-review-findings-registry.json`, committed as `84887f37f7`, and the parent decisions D1 to D8 in `../goal.md`.

---
<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-25 |
| **Branch** | `worktrees/217-weak-model-spec-authoring` |
| **Parent Spec** | ../spec.md |
| **Phase** | 10 of 10 |
| **Predecessor** | 009-authoring-benchmark-and-closeout |
| **Successor** | None |
| **Handoff Criteria** | Every P1 has a fix and a check that failed before it, every P2 has a recorded outcome, and the closing reviews report no P0 or P1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 10** of the weak-model spec authoring specification. It acts on the review that ran after phase 9 closed.

**Scope Boundary**: the findings recorded in `../review/review-report.md` and its registry, the source files those findings cite, the tests that prove the fixes and the release records the fixes require. A defect found outside those findings is recorded for the operator, not fixed.

**Dependencies**:
- Phase 9 is closed and the review is committed as `84887f37f7`.
- The system-spec-kit runtime and CLI build with `npm run build`, because strict validation runs the compiled orchestrator.

**Deliverables**:
- One fix and one regression check per P1, and one recorded outcome per P2.
- Fixes for the three tooling gaps, each with a test.
- Release records for system-spec-kit and system-deep-loop, synced runtime mirrors and a phase changelog.
- Two closing review replies, from cli-devin and then cli-codex luna.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The deep review of packet 054 ran 40 iterations across four model lineages and confirmed nine required defects. `create.sh` creates a spec folder outside the repository when `--track` holds `..`, and the three placeholder scanners disagree: two miss a token that follows a backticked example, and the post-edit scan cannot see the v2.3 token while it flags ordinary bracketed text. Strict validation passes a doc with a required section deleted, the guidance a weak model reads contradicts itself in three places, and one playbook scenario never checks where its dangerous-mode writer wrote.

### Purpose
Every required finding is fixed at its source with a check that failed before the fix, every suggestion that reproduces is fixed, and no existing packet's validation verdict changes.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Fix the nine P1 findings at their source files, each with a regression check that fails before the fix.
- Re-check each P2 in the review registry, fix the ones that reproduce and record the rest as not reproduced.
- Fix the three tooling gaps: the fan-out root's resource-map step, the 150-character description cut and the trigger index's git calls under fsmonitor.
- Record the changes in the system-spec-kit and system-deep-loop changelogs and sync every runtime mirror of an edited command or agent.
- Close with a read-only review of the phase diff by cli-devin and then cli-codex luna.

### Out of Scope
- Rerunning the phase 9 benchmark - the fixes change neither the frozen task nor the metric definitions, so a new benchmark is a separate run.
- Fixing a defect the review did not record - it is listed for the operator, as scope discipline requires.
- Letting `fanout-run.cjs` add lineages to a running fan-out - the review recorded it as a limitation, and it is a feature rather than a defect.
- Rewriting what a closed phase recorded about its own run - a correction is added as a dated note beside the original record.
- A push - this phase commits on the worktree branch, and pushing waits for the operator.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-spec-kit/runtime/cli/spec/create.sh` | Modify | Reject a `--track` value that leaves `specs/` before any `mkdir` (P1-01) |
| `.skilled/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts` | Modify | Scan every placeholder match on a line and align fence and legacy-token rules (P1-02 and P2) |
| `.skilled/skills/system-spec-kit/runtime/cli/rules/check-placeholders.sh` | Modify | Match the orchestrator's scan, fence and title rules (P1-02 and P2) |
| `.skilled/skills/system-spec-kit/runtime/cli/spec/check-placeholders.sh` | Modify | Rebuild the post-edit scan on the shared marker set (P1-03, P1-04 and P2) |
| `.skilled/skills/system-spec-kit/runtime/lib/validation/spec-doc-structure.ts` | Modify | Check required-section presence for v2.3 docs from the level's `sectionGates` (P1-05) |
| `.skilled/skills/system-spec-kit/runtime/cli/lib/validator-registry.json` | Modify | Describe the required-section check (P1-05) |
| `.skilled/skills/system-spec-kit/runtime/cli/rules/check-scaffold-never-touched.sh` | Modify | See a `[template:...]` title token (P2) |
| `.skilled/skills/system-spec-kit/runtime/cli/lib/status-classifier.sh` | Modify | Read every Status row, if the baseline shows no verdict change (P2) |
| `.skilled/skills/system-spec-kit/runtime/lib/description/packet-synopsis.ts` | Modify | End a cut description at a sentence or clause boundary (tooling gap) |
| `.skilled/skills/system-spec-kit/runtime/cli/retrieval/lib/corpus.mjs` | Modify | Disable fsmonitor for the one git call the trigger index generator makes (tooling gap) |
| `.skilled/commands/deep/assets/deep-review-auto.yaml`, `deep-review-confirm.yaml` and `compiled/*.contract.markdown` | Modify | Skip the root resource-map reducer at a fan-out root and recompile every contract whose sources changed (tooling gap) |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/*.vitest.ts`, `runtime/cli/tests/snapshots/*.snap`, `runtime/cli/test-fixtures/**`, `.skilled/skills/system-deep-loop/runtime/tests/unit/*.vitest.ts` | Modify, Create | Parity matrix, traversal, post-edit scan, required-anchor, guard, synopsis, trigger-index and fan-out tests, and the scaffold snapshots the template edits change |
| `.skilled/skills/system-spec-kit/runtime/**/README.md` | Modify | Only where a README states the behavior a fix changes |
| `.skilled/skills/system-spec-kit/references/workflows/spec-authoring-card.md` | Modify | Card fixes for P1-07 and the card P2s |
| `.skilled/skills/system-spec-kit/references/structure/sub-folder-versioning.md`, `references/workflows/{auto-mode-contract,nested-changelog,worked-examples,intake-contract}.md` | Modify | Replace the retired `/spec_kit:` prefix (P2) |
| `.skilled/skills/system-spec-kit/templates/examples/level-*/tasks.md`, `templates/core/*.tmpl`, `templates/packet-types/phase-parent.spec.md.tmpl` | Modify | Task lines the card accepts, the L3+ clarifier, the promised fill examples and the retired prefix (P1-07 and P2) |
| `.skilled/skills/system-spec-kit/assets/template-mapping.md` | Modify | Teach the v2.3 token form and the optional decision record (P1-08 and P2) |
| `.skilled/skills/system-spec-kit/runtime/cli/spec/check-example-drift.sh`, `check-card-sync.sh` | Modify | Guard P2s: missing `rg`, anchor order, coverage floor and the checklist checks |
| `.skilled/commands/speckit/assets/speckit-plan.yaml`, `speckit-implement.yaml`, `plan.md`, `implement.md` | Modify | Name the authoring card and the v2.3 token rule (P1-06 and P2) |
| `.skilled/agents/markdown.md` and its runtime mirrors | Modify | Name the token rule and the guards beside the card (P2) |
| `.skilled/skills/system-spec-kit/manual-testing-playbook/template-authoring/*.md` | Modify | Containment check before cleanup in scenario 483, cleanup and tool-list P2s (P1-09 and P2) |
| `.skilled/skills/system-spec-kit/feature-catalog/**`, `benchmark/reports/2026-10-25--model-eval--authoring-baseline/{README,source}.md` | Modify | Catalog and report claims that match the code and the run (P2) |
| `../spec.md`, `../graph-metadata.json`, `../goal.md`, closed phase records | Modify | Record-hygiene P2s as dated notes, the phase map row and the goal binding. Generated files change only through their generators, continuity frontmatter only through the continuity writer |
| `.skilled/skills/system-spec-kit/changelog/`, `.skilled/skills/system-deep-loop/changelog/` and version carriers, including the `.hermes` skill copies | Create, Modify | Release records for both skills |
| `.skilled/skills/system-spec-kit/runtime/data/trigger-index.json` and the retrieval fixtures its generator writes | Modify | Regenerated by the generator after the doc changes |
| `spec.md`, `plan.md`, `tasks.md`, `acceptance-criteria.md`, `goal.md`, `implementation-summary.md` | Modify | Plan, progress and evidence |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | `create.sh` exits non-zero before any `mkdir` when `--track` holds a `..` segment or resolves outside `specs/`, and a valid track still creates its folder under `specs/<track>/` (P1-01). |
| REQ-002 | `PLACEHOLDER_FILLED` and `rules/check-placeholders.sh` flag an unfilled token that follows a backticked example on the same line and still skip the backticked one (P1-02). |
| REQ-003 | `spec/check-placeholders.sh` flags `[YOUR_VALUE_HERE: ...]` and reports 0 placeholders on packet 054, which passes recursive strict validation (P1-03 and P1-04). |
| REQ-004 | Strict validation fails a v2.3 doc that is missing a section its level's `sectionGates` require, and a v2.2 doc validates as it did before (P1-05). |
| REQ-005 | Recursive strict validation over `specs/` gives the same pass and fail counts before and after this phase. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-006 | `speckit-plan.yaml`, `speckit-implement.yaml` and their command entry points name the authoring card and the v2.3 token rule where they describe spec-doc authoring, and every runtime mirror matches (P1-06). |
| REQ-007 | Every example task line the card calls safe to imitate passes the card's own task check (P1-07). |
| REQ-008 | `template-mapping.md` teaches the v2.3 token form, and no system-spec-kit doc teaches `[PLACEHOLDER]` as the marker to replace (P1-08). |
| REQ-009 | Scenario 483's Pass rule checks, before cleanup, that the worker wrote only inside its scratch packet (P1-09). |
| REQ-010 | Every P2 in the review registry has a recorded outcome: fixed with evidence, or not reproduced with the check that showed it. |
| REQ-011 | The fan-out root skips the root resource-map reducer, the description extractor ends at a sentence or clause boundary and the trigger index generator's git calls disable fsmonitor, each with a test. |
| REQ-012 | Read-only reviews of the phase diff by cli-devin and then cli-codex luna report no P0 or P1. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: In a sandbox copy, `create.sh --track ../../escaped ...` exits non-zero and creates nothing outside `specs/`.
- **SC-002**: `placeholder-token-gate.vitest.ts` passes with a parity matrix that includes the mixed-line, fenced, indented-fence and legacy-token shapes.
- **SC-003**: `spec/check-placeholders.sh specs/system-speckit/054-weak-model-spec-authoring --json` prints `"placeholders":0`.
- **SC-004**: A v2.3 fixture with one required section removed fails strict validation on the new check.
- **SC-005**: The recursive pass and fail counts over `specs/` match the baseline taken before the first edit.
- **SC-006**: `check-example-drift.sh` and `check-card-sync.sh` exit 0 on the final tree, and each exits non-zero on a seeded defect.
- **SC-007**: Both closing review replies report no P0 or P1.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The compiled orchestrator under `runtime/dist/` | Strict validation runs the compiled file, so a stale build hides a source fix | Rebuild after each TypeScript change and prove the fix on a seeded fixture through `validate.sh` |
| Risk | A gate change gives an existing packet a new failure | High | Take the recursive baseline first, keep every new check to v2.3 docs and compare the counts after |
| Risk | An edited command or agent drifts from its runtime mirrors | Medium | Sync the mirrors in the same lane and run the mirror parity check |
| Risk | Card and example edits break the card-sync or drift guard | Medium | One lane owns the card, the examples and both guards, and runs both guards after each change |
<!-- /ANCHOR:risks -->

---


## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Strict validation of packet 054 takes no more than 10% longer than the baseline run, because the scanner now reads every match on a line.

### Security
- **NFR-S01**: No scaffold path can resolve outside `specs/`, and every fix is proved without writing outside the repository or the session scratchpad.

### Reliability
- **NFR-R01**: N/A. This phase runs no service, so there is no uptime target.

---

## 8. EDGE CASES

### Data Boundaries
- Empty input: an empty `--track` keeps today's behavior, and a line with no token produces no finding in any scanner.
- Maximum length: a line holding several tokens is reported once per line in every scanner, so the three counts stay comparable.

### Error Scenarios
- Missing tool: a guard that needs `rg` exits non-zero with a message when `rg` is absent, rather than reporting success.
- Stale build: a fix that passes its unit test but not `validate.sh` points at a stale `dist/`, so the lane rebuilds before it records the evidence.

### State Transitions
- Partial completion: a lane that stops mid-way leaves its files for the conductor to finish or revert, and the other lanes are unaffected because no two lanes share a file.
- Session restart: the goal log and `tasks.md` record each finished task, so a new session resumes from the first open task.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 21/25 | Files: about 60, LOC: about 900, Systems: validator, scaffold, guards, templates, commands, playbook, deep loop, retrieval |
| Risk | 18/25 | Auth: N, API: N, Breaking: N, path containment and a shared validator |
| Research | 10/20 | Each P2 is re-checked before it is fixed |
| Multi-Agent | 12/15 | Workstreams: 3 parallel lanes |
| Coordination | 12/15 | Dependencies: the build, the mirrors, two changelogs and two closing reviews |
| **Total** | **73/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | The required-section check fails an existing v2.3 packet | H | M | Baseline count first, v2.3 boundary per D2, and a named list of any packet that would change |
| R-002 | The placeholder loop change exposes a real leftover token in an existing packet | M | L | The baseline names it, and the operator decides at the end |
| R-003 | Reading every Status row turns a Draft packet's warnings into errors | M | M | Apply that P2 only if the baseline shows no verdict change, otherwise record it |
| R-004 | A lane edits a file another lane owns | M | L | The plan assigns every file to exactly one lane |

---

## 11. USER STORIES

### US-001: Gates that hold the card's rules (Priority: P0)

**As a** weak-model worker following the authoring card, **I want** `create.sh` and strict validation to reject what the card forbids, **so that** a packet that passes is filled and sits inside the repository.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

### US-002: Findings closed with proof (Priority: P1)

**As the** operator, **I want** each review finding closed by a check that failed before the fix, **so that** I can trust the next review's verdict.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

<!-- ANCHOR:questions -->
## 12. OPEN QUESTIONS

- Does any existing v2.3 packet already miss a required section? The baseline in the plan's first step answers it before the check lands.
- None other blocks the work.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `tasks.md`
- **Decision Records**: See `decision-record.md`

---


