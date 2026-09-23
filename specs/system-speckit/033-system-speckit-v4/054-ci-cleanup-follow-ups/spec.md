---
title: "Feature Specification: CI Cleanup Follow-ups"
description: "The spec gate exempted every write under /tmp and /private/tmp by location, so a repository that lives under /tmp was not gated and CI carried a TMPDIR workaround because of that rule. Six recorded cli-jev probe scripts lacked pipefail and were the drift guard's last errors. This phase removes the location rule, drops the CI workaround, corrects the docs and clears the drift errors."
trigger_phrases:
  - "ci cleanup follow-ups"
  - "spec gate tmp exemption"
  - "cli-jev pipefail"
  - "tmpdir ci workaround"
  - "drift guard errors"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: CI Cleanup Follow-ups

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-09-23 |
| **Branch** | `worktrees/066-ci-cleanup-follow-ups` |
| **Parent Spec** | ../spec.md |
| **Phase** | 54 of 55 |
| **Predecessor** | 050-ci-cleanup-pi-proof |
| **Successor** | None |
| **Handoff Criteria** | N/A - no successor phase |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 54** of the system-speckit v4 parent specification, the follow-up to phase 050 that closes its loose ends, and it shares no files with phases 051 to 053 and 055.

**Scope Boundary**: Only the spec-gate core and its test, the CI workflow step, the two playbooks, the six cli-jev probe scripts, the packet docs and the parent records may change. Anything outside that list is recorded, not repaired.

**Dependencies**:
- Phase 050-ci-cleanup-pi-proof, the predecessor whose loose ends this phase closes.
- Worktree .worktrees/066-ci-cleanup-follow-ups on branch worktrees/066-ci-cleanup-follow-ups, rebased onto origin/main.

**Deliverables**:
- T001 to T005: the /tmp location rule removed from the spec gate, with the new core test green across the core, devin, cursor and Pi suites under both temp dirs.
- T006: the TMPDIR workaround removed from the runtime vitest step of .github/workflows/spec-kit-check.yml.
- T007 and T008: the spec-mutation playbook wording and its 108 test count, plus the codex hook parity playbook wording.
- T009: the six cli-jev probe scripts running under set -uo pipefail.
- T010: the sk-code drift guards at 0 errors.
- T011: commits 9b95bd06b1 and 9ace27983c on branch worktrees/066-ci-cleanup-follow-ups.
- T012: the packet docs and the parent rows.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The spec gate exempted every write under /tmp and /private/tmp by location, and any path outside the repository is already exempt, so the extra rule only switched the gate off for a repository that itself lives under /tmp. Test workspaces made under os.tmpdir() hit that case whenever the temp dir is /tmp, and phase 050 worked around it with a TMPDIR line in the runtime vitest step of CI. Measured before the change with TMPDIR=/tmp, the core spec-gate suite failed 16 tests, the devin suite 6 and the cursor suite 8, while six recorded cli-jev probe scripts carried only set -u and were the sk-code drift guard's 6 remaining errors.

### Purpose
A repository under /tmp is gated like any other, the CI workaround that existed only because of the old rule is gone, the docs that described it are correct, and the drift guard reports 0 errors.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The spec-gate core drops the /tmp and /private/tmp clause and its helper, and the doc comment says anything outside the repo already covers /tmp scratch space.
- The core spec-gate suite gains the test "a repository rooted under /tmp is gated like any other", and makeWorkspace takes a base directory that defaults to os.tmpdir().
- The runtime vitest step of .github/workflows/spec-kit-check.yml runs without the TMPDIR workaround.
- The spec-mutation gate enforce playbook says any fixture location works and expects 108 tests.
- The codex hook parity playbook no longer says the core exempts /tmp.
- The six cli-jev probe scripts run under set -uo pipefail.
- The packet docs and the parent rows record the outcome.

### Out of Scope
- The containment capture fix and the capture untrack. They live in packet specs/system-deep-loop/036-deep-loop-innovation/007-executor-and-cli-hardening/010-fanout-write-containment-hardening/021-capture-folders-out-of-snapshot.
- The phase 030 goal trim. It is recorded in the log of specs/system-speckit/033-system-speckit-v4/030-spec-kit-simplification-research/goal.md and its brief is wu8 in this packet's evidence/dispatch/.
- Building the gitignored dists in a fresh worktree. Their tests fail to load until built, and this is a known limitation recorded here and not repaired.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-spec-kit/runtime/hooks/lib/spec-gate/spec-gate-core.mjs` | Modify | Remove the helper isUnderAnyRoot and the /tmp and /private/tmp clause in isExemptTargetPath, and reword the doc comment |
| `spec-gate-core.test.mjs` | Modify | makeWorkspace takes a base directory that defaults to os.tmpdir(), the new /tmp test is added, and the path-traversal test comment is reworded |
| `.github/workflows/spec-kit-check.yml` | Modify | Remove the 4-line TMPDIR workaround from the Runtime vitest project step |
| `.skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/spec-mutation-gate-enforce.md` | Modify | Step 3 says any fixture location works with /tmp included, and step 2 expects 108 tests |
| `.skilled/skills/cli-external-orchestration/manual-testing-playbook/plugins-and-hooks/codex-hook-parity.md` | Modify | Step 1 no longer says the core exempts /tmp |
| Six cli-jev probe scripts under `benchmark/reports/2026-09-20-hub-routing-baseline/raw/` and `cli-usage/benchmark/reports/2026-09-20-post-migration-reverification/raw/` | Modify | hub-routing-run.sh, auth-probe.sh, preflight-probe.sh, preflight-probe2.sh, probe-matrix.sh and probe-surface.sh move from set -u to set -uo pipefail |
| `specs/system-speckit/033-system-speckit-v4/054-ci-cleanup-follow-ups/` packet documents | Modify | The packet documents record the phase outcome and the parent records register the phase |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | A repository under /tmp is gated like any other. Acceptance criterion AC-001, a repository rooted under /tmp is denied under enforcement and the core suite passes 108 of 108. |
| REQ-002 | No spec-gate suite regresses with the temp dir at /tmp or elsewhere. Acceptance criterion AC-002, the core, devin, cursor and Pi suites pass under both temp dirs and the runtime root project passes with the temp dir at /tmp. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-003 | CI runs the runtime vitest step with the runner's default temp dir. Acceptance criterion AC-003, grep -c TMPDIR in spec-kit-check.yml returns 0. |
| REQ-004 | No doc still describes the /tmp exemption or the old 107 count. Acceptance criterion AC-004, a repo-wide search finds no such text. |
| REQ-005 | The six cli-jev scripts run under pipefail and the drift guard reports 0 errors. Acceptance criterion AC-005, the drift guards report Errors 0 and bash -n is ok on the six scripts. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Every spec-gate suite and the runtime root project pass with the temp dir at /tmp.
- **SC-002**: The drift guards report 0 errors.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A repository under /tmp now needs the Gate-3 answer before a write | Medium | This is the intended change, and the out-of-repo exemption still covers /tmp scratch space for a repository that lives elsewhere |
| Risk | CI now runs the runtime suites with the temp dir at /tmp | Low | The suites pass with TMPDIR=/tmp and with the default temp dir as measured |
| Risk | The recorded cli-jev exit codes change | Low | Every pipeline in the six scripts starts with printf, so a recorded exit code only changes if printf itself fails |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: N/A - insufficient source context
- **NFR-P02**: N/A - insufficient source context

### Security
- **NFR-S01**: N/A - insufficient source context
- **NFR-S02**: N/A - insufficient source context

### Reliability
- **NFR-R01**: N/A - insufficient source context
- **NFR-R02**: N/A - insufficient source context
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty input: N/A - insufficient source context
- Maximum length: N/A - insufficient source context
- Invalid format: N/A - insufficient source context

### Error Scenarios
- External service failure: N/A - insufficient source context
- Network timeout: N/A - insufficient source context
- Concurrent access: N/A - insufficient source context

### State Transitions
- Partial completion: N/A - insufficient source context
- Session expiry: N/A - insufficient source context
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | N/A - insufficient source context | N/A - insufficient source context |
| Risk | N/A - insufficient source context | N/A - insufficient source context |
| Research | N/A - insufficient source context | N/A - insufficient source context |
| **Total** | **N/A - insufficient source context** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- None open.
<!-- /ANCHOR:questions -->

---


