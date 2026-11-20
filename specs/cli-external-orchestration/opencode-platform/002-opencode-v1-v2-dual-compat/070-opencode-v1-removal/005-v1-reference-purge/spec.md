---
title: "Feature Specification: Phase 5: v1-reference-purge"
description: "After phase 003, 39 files outside history still named OpenCode 1: the refusal code, the remove-v1 helper, their tests and dated observations. The operator chose to purge everything, so this phase removes the refusal, the helper and every live v1 mention, and narrows the version families to v2 and unknown."
trigger_phrases:
  - "v1 reference purge"
  - "phase 5 v1 reference purge"
  - "purge opencode 1 references"
  - "opencode version families v2 unknown"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 5: v1-reference-purge

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-11-20 |
| **Branch** | `worktrees/493-v1-reference-purge` |
| **Parent Spec** | ../spec.md |
| **Phase** | 5 of 5 |
| **Predecessor** | 004-v2-review-p2-fixes |
| **Successor** | None |
| **Handoff Criteria** | Every row of `acceptance-criteria.md` is Met or Superseded, and `validate.sh` on the parent with `--recursive --strict` prints `RESULT: PASSED` for every folder |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 5** of the OpenCode v1 removal. Phases 001 to 004 are complete. Phase 003 kept a list of dated OpenCode 1 survivors (its ADR-001 and `scratch/justified.txt`). The operator has now decided to purge every one of them, including the refusal code and the `remove-v1` helper.

**Scope Boundary**: the files the sweep `git grep -l -i -P 'opencode1\b|opencode-ai|opencode-v1\.db|OpenCode 1\b|remove-v1' HEAD -- ':!specs' ':!**/changelog/**' ':!**/benchmark/**'` lists on the phase base, every consumer of the `'unsupported'` version family, and v1-only remnants the regex misses. History (`specs/`, changelogs, benchmarks) is not edited.

**Dependencies**:
- The operator decision recorded in `decision-record.md` (ADR-001 and the operator-decision row)
- OpenCode 2.3.2 installed locally, for the live battery leg

**Deliverables**:
- Version resolvers, the rule engine, the wrapper, the doctor battery and the setup helper with no OpenCode 1 branch
- Tests that keep their v2 and unknown-version coverage with no v1 sample
- Docs, the CI workflow and the frozen sk-git fixture with no OpenCode 1 text
- Regenerated trigger index and retrieval fixtures
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Nothing in the repository runs OpenCode 1, yet 39 files outside history still named it. The resolvers classified major 1 as `unsupported`, the wrapper refused it, the setup helper shipped a `remove-v1` mode, and docs kept dated 1.19.x observations. Each of those is code or text a reader has to understand for a version that no longer exists here.

### Purpose
No file outside history names OpenCode 1, every version consumer reads only the `v2` and `unknown` families, and the gate shows no regression beyond the deliberately removed v1 tests.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ git grep -l -i -P 'opencode1\b|opencode-ai|opencode-v1\.db|OpenCode 1\b|remove-v1' HEAD -- ':!specs' ':!**/changelog/**' ':!**/benchmark/**' | wc -l
39
$ git grep -c "'unsupported'" HEAD -- .skilled/hooks/cli-dispatch/lib/opencode-version.mjs .skilled/skills/system-deep-loop/runtime/scripts/opencode-version.cjs .skilled/commands/doctor/scripts/opencode-version-battery.cjs .skilled/bin/skilled-loop
HEAD:.skilled/bin/skilled-loop:1
HEAD:.skilled/commands/doctor/scripts/opencode-version-battery.cjs:2
HEAD:.skilled/hooks/cli-dispatch/lib/opencode-version.mjs:5
HEAD:.skilled/skills/system-deep-loop/runtime/scripts/opencode-version.cjs:3
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Remove the major-1 `unsupported` classification from both resolvers, the battery parser, the setup helper's classifier and the rule engine's unresolved list, so major 1 reads as `unknown`
- Remove the wrapper's version probe and refusal, the battery's unsupported-binary detail, and the setup helper's `remove-v1` mode with its helpers
- Rewrite the tests that asserted the refusal onto another-major samples, and delete the ones that tested only the removed code
- Delete or rewrite every OpenCode 1 observation in docs, the CI workflow, the plugin inventory and the frozen sk-git fixture
- Regenerate the trigger index and retrieval fixtures

### Out of Scope
- Changelogs, `specs/` and benchmarks - they are history, and the sweep excludes them
- `session-handover-loop.md`, `runtime-behavior.md` and `phase-definitions.md` - another session owns them; the one sweep hit in `session-handover-loop.md` is edited on top of that session's change at rebase time
- The `opencode2` name in the setup helper's `check` mode - not an OpenCode 1 reference

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/hooks/cli-dispatch/lib/opencode-version.mjs` | Modify | Drop the major-1 branch and the `unsupported` family |
| `.skilled/skills/system-deep-loop/runtime/scripts/opencode-version.cjs` | Modify | Drop the major-1 branch and its refusal message |
| `.skilled/hooks/cli-dispatch/lib/dispatch-rule-checks.mjs` | Modify | `UNRESOLVED_FAMILIES` holds only `unknown` |
| `.skilled/bin/skilled-loop` | Modify | Remove the version probe and refusal, keep the `--standalone` insertion |
| `.skilled/commands/doctor/scripts/opencode-version-battery.cjs` | Modify | Drop the major-1 branch and the unsupported-binary detail |
| `.skilled/skills/cli-external-orchestration/cli-opencode/scripts/opencode-setup.sh` | Modify | Remove the `remove-v1` mode, its helpers and the `opencode1` name in `check` |
| `.skilled/hooks/cli-dispatch/lib/opencode-version-corpus.json` | Modify | Replace the v1 rows with the same shapes on v2 or another major |
| Tests under `cli-dispatch/lib`, `doctor/scripts/tests`, `session-handover/tests`, `cli-opencode/scripts/tests`, deep-loop `tests/unit` | Modify | Keep v2 and unknown coverage with no v1 sample |
| `.github/workflows/opencode-v2-battery.yml`, `.github/workflows/README.md` | Modify | Drop the `remove-v1` description |
| 25 docs and the sk-git fixture | Modify | Delete or rewrite every OpenCode 1 observation |
| Trigger index and retrieval fixtures | Regenerate | Rebuilt by `generate-trigger-index.mjs` |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | The sweep on the final tree lists no hand-written file; any remaining hit is a generated file whose v1 phrase comes only from history or from the `cli-opencode` 1.x skill-version phrases. |
| REQ-002 | No code path classifies a version as `unsupported`: `rg -n "'unsupported'"` over the resolvers, the rule engine, the battery, the wrapper and the setup helper prints nothing. |
| REQ-003 | The gate from phase 004, the whole deep-loop vitest and the doctor suite pass with no new failure; every test-count drop is a named, deliberate removal. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-004 | The ESM and CJS parsers stay in parity over the shared corpus and the hand-written outputs. |
| REQ-005 | The sk-skill-convert suite passes with the fixture's OpenCode 1 sentence removed. |
| REQ-006 | The live battery `--family=v2 --json` exits 0 on the installed OpenCode 2.3.2. |
| REQ-007 | Phase 003's replacement checks still print 0, and its `justified.txt` is marked superseded. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The sweep prints only the two generated retrieval files, each traced to history or skill-version phrases.
- **SC-002**: The gate totals match the baseline minus the five named removed tests, with zero failures.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Another session editing session-handover files on the same base | A rebase conflict | Avoid its files, fetch and rebase before the push, rerun the gate |
| Risk | A leftover OpenCode 1 binary now reads as `unknown` | Med | The deep-loop resolver still refuses it with "was not supported"; the wrapper launches it and it fails on `--standalone`, which the operator accepted |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- /ANCHOR:nfr -->

### Performance
- **NFR-P01**: The wrapper no longer spawns a `--version` probe before an OpenCode launch, so a launch does one process start fewer.

### Security
- **NFR-S01**: N/A: the change removes code paths and adds no input surface.

### Reliability
- **NFR-R01**: An unknown version keeps the fail-closed deep-loop refusal and the fail-open dispatch guard that holds every rule at its declared severity.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: empty `--version` output stays `unknown` in every parser, and the corpus keeps that row.
- Maximum input: joined output such as `3.0.0 2.0.32` is decided by its first token and reads as `unknown`.
- Failure path: a binary reporting any major other than 2 throws `E_OPENCODE_UNRESOLVED` in the deep loop with "was not supported".
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 14/25 | About 50 files, most of them doc line edits |
| Risk | 8/25 | Narrows a shared family contract whose consumers are all in this repository |
| Research | 4/20 | Consumer inventory and remnant search |
| **Total** | **26/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None. The operator answered how far the purge goes (ADR-001).
<!-- /ANCHOR:questions -->

---
