---
title: "Feature Specification: Phase 1: CI workflow efficiency research"
description: "The 33 GitHub Actions workflows cost about 3,812 runner-minutes a day, with no caching, almost no concurrency control and a bot commit that re-runs 13 workflows after every push. This phase measures that cost and designs the fixes, an on/off control, a /doctor:ci command and an sk-code-ci standard, without changing any workflow."
trigger_phrases:
  - "ci workflow efficiency research"
  - "053 ci research"
  - "github actions cost research"
  - "doctor ci design research"
  - "sk-code-ci research"
importance_tier: "important"
contextType: "research"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 1: CI workflow efficiency research

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-23 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 1 of 8 (research gate; phases 002-008 are proposed implementation) |
| **Predecessor** | None |
| **Successor** | `002-trigger-surgery/` (proposed, not created) |
| **Handoff Criteria** | `research/research.md` holds measured cost, ranked recommendations and the 002-008 phase plan, every load-bearing claim cited and labelled |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 1**, the research gate, of the CI workflow efficiency, speed and operator control specification. It ran `/deep:research:auto` for 20 iterations with the `cli-pi` executor on `deepseek-v4.1-flash-1017` at max thinking, stop policy max-iterations and convergence off.

**Scope Boundary**: Research only. No workflow, script, action or code changes; only this phase's own files change.

**Dependencies**:
- `gh` access to the repository's Actions history, for the measured dataset in `scratch/ci-run-data/`.
- The deep-research runtime under `.skilled/skills/system-deep-loop/` and the `pi` CLI with an llmgateway key.

**Deliverables**:
- `research/research.md`: measured cost, findings, ranked top-10 recommendations and proposed phases 002-008.
- `research/iterations/iteration-001.md` to `iteration-020.md`, deltas, the state ledger, dispatch receipts and `research/resource-map.md`.
- `scratch/ci-run-data/`: the raw `gh` JSON and its `summary.md`.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The repository runs 33 workflows. Nobody has measured what they cost, which work they repeat, or which triggers fire for nothing, and clones of the repo have no way to switch workflows off without editing YAML. Workflow-authoring rules are scattered and mostly unenforced, so every new workflow can repeat the same gaps.

### Purpose
Produce a measured, cited plan that later phases can implement mechanically: what to change, in what order, for what saving and at what risk.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Runner-minute and wall-clock cost per workflow from `gh run list` and `gh run view --json jobs`.
- Duplicate work, caching, triggers and path filters, concurrency and matrices, flaky and slow tests, timeouts, overengineering, security and pinning.
- The duplicate `provision_worktree` in three workflows, measured, with fix options.
- An on/off control for clones and base repos, a `/doctor:ci` command, an `sk-code-ci` standards surface, and who owns each.
- Ranked recommendations grouped into proposed implementation phases 002 onward.

### Out of Scope
- Editing any workflow, script, action or skill - implementation belongs to phases 002-008.
- Changing rulesets, branch protection or repository variables - read only, so no repository setting moves.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `research/` | Create | Deep-research state, 20 iterations, deltas, receipts, `research.md`, `resource-map.md` |
| `scratch/ci-run-data/` | Create | Measured `gh` dataset and `summary.md` |
| `spec.md`, `plan.md`, `tasks.md`, `acceptance-criteria.md`, `implementation-summary.md` | Create | Phase docs |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | The run uses the repo's `/deep:research:auto` workflow with executor cli-pi, model `deepseek-v4.1-flash-1017`, thinking max, recorded in `research/deep-research-config.json` before iteration 1 |
| REQ-002 | 20 iterations, stop policy max-iterations, convergence mode off, each iteration carrying route proof |
| REQ-003 | Every load-bearing claim in `research/research.md` cites a file:line or run id and is labelled confirmed, documented or inferred |
| REQ-004 | No file outside this phase folder and the parent's own docs changes |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-005 | `research.md` ranks a top 10 with saving, risk and effort, and groups recommendations into proposed phases 002+ with scope, workflows, saving, risk, order and dependencies |
| REQ-006 | `research.md` covers the on/off control, `/doctor:ci` with ownership, `sk-code-ci` with its registration cost, and the duplicate-provisioning measurement |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `verify-iteration.cjs` passes all 20 iterations, and every delta record carries `target_agent: deep-research` with the resolved route.
- **SC-002**: The parent phase map lists 001 as Complete and 002-008 as Pending, matching `research.md` section 15.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | llmgateway availability for `deepseek-v4.1-flash-1017` | Iterations cannot dispatch | The YAML's redispatch-once rule; not needed, all 20 passed first time |
| Risk | Sampling error: five job samples per workflow | Med | Spot checks against raw JSON; savings stated as estimates with their basis |
| Risk | A flash model overstating or mis-adding a figure | Med | Iteration 019 re-checked the five largest claims; the orchestrator re-checked the top claims again before synthesis (`research.md` section 20) |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Each iteration finishes inside the executor timeout of 2,400 s. Measured range: 39 s to 490 s.
- **NFR-P02**: The run fits in one session without resume. All 20 iterations ran in one sequence.

### Security
- **NFR-S01**: The llmgateway key is never printed or written. Only its presence was checked.
- **NFR-S02**: No repository setting is written: rulesets, variables and branch protection were read only.

### Reliability
- **NFR-R01**: State is written only through the append gateway, so each record has a receipt.
- **NFR-R02**: Iteration writes stay inside `research/`. Write containment reported no violation.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Workflows with no run in the window (PR-only or scheduled): cost read from their 40 latest runs, and excluded from the per-day total.
- Self-skipped runs (trigger-index-rebuild on its own commit): counted as zero cost, noted as a sampling artifact.

### Error Scenarios
- Iteration dispatch failure: redispatch once, then record the iteration as error and continue. This did not occur.
- A claim that does not reproduce: corrected in a later iteration or in the synthesis addendum. Three corrections were made.

### State Transitions
- Settings changed before iteration 1 (10 to 20 iterations, convergence off): the not-yet-started state was re-initialized rather than edited, so the ledger's opening record matches the config.
- Lock: acquired once and refreshed every iteration.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 8/25 | One phase folder; 33 workflows read, none changed |
| Risk | 4/25 | Read only; no setting or code change |
| Research | 18/20 | 20 iterations, 11 angles, measured dataset |
| **Total** | **30/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Is the CI workflow efficiency topic covered end to end? Yes: deep-research ran on it for 20 iterations, and `research/research.md` is canonical.
- Open questions carried to the implementation phases are listed in `research/research.md` section 18: fileParallelism safety, variable-write permission, message-contract's required context on rebuild commits, cache size and throughput, the hooks vitest globs, and further hook duplicates.

### Research Context

Deep-research ran on this topic for 20 iterations and is complete. `research/research.md` remains canonical.

<!-- BEGIN GENERATED: deep-research/spec-findings -->
- The rebuild commit re-runs 13 workflows on 36 of 73 push SHAs: about 2,073 of 3,812 runner-min/day (confirmed).
- No workflow caches anything; 32 of 33 have no concurrency group; 27 of 33 have no timeout; 12 of 33 declare no permissions (confirmed).
- spec-kit-check's CLI vitest project runs 183 files serially (`fileParallelism: false`) and is 65% of the slowest job (confirmed).
- The on/off control is `vars.SKILLED_CI*` in a job-level `if:`, on by default. Skipped jobs report Success (documented), and only one ruleset context is required (confirmed).
- `/doctor:ci` is a new doctor router (`report` read-only, `scaffold` confirmed write). `sk-code-ci` is a read-only sk-code surface holding the rules and templates. sk-git owns neither.
- Proposed phases: 002 trigger surgery, 003 caching, 004 sk-code-ci, 005 on/off and hygiene, 006 consolidation decision, 007 /doctor:ci, 008 slow tests.
<!-- END GENERATED: deep-research/spec-findings -->
<!-- /ANCHOR:questions -->

---
