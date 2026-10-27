---
title: "Feature Specification: Clear the five doctor:ci drift flags and decide Node 20 CI coverage"
description: "The doctor:ci report raised five drift flags: three workflows wrote event SHAs straight into a run script and two carried no concurrency block. This packet clears all five and adds a Node 20 step for the two suites that once failed only there."
trigger_phrases:
  - "ci drift flags"
  - "clear the five doctor ci drift flags"
  - "event-in-run drift flag"
  - "concurrency-missing drift flag"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Clear the five doctor:ci drift flags and decide Node 20 CI coverage

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-27 |
| **Branch** | `worktrees/242-ci-drift-flags` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`/doctor:ci report` raised five drift flags on this repository. `agent-mirror-sync.yml`, `comment-hygiene.yml` and `changed-packet-validation.yml` interpolated `${{ github.event.* }}` values straight into a `run:` script, which the job shape rules forbid, and `dependabot-auto-merge.yml` and `strict-pass-freshness-report.yml` carried no `concurrency:` block. Separately, two suites that failed only on Node 20 run on Node 22 alone in CI, so a Node 20 regression would show only on a laptop.

### Purpose
The report shows zero drift flags, every workflow keeps its behaviour, and the two Node 20 sensitive suites also run on Node 20 in CI.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ node .skilled/commands/doctor/scripts/ci-report.cjs --json   (exit 0, flags per workflow)
agent-mirror-sync.yml ["event-in-run"]
changed-packet-validation.yml ["event-in-run"]
comment-hygiene.yml ["event-in-run"]
dependabot-auto-merge.yml ["concurrency-missing"]
strict-pass-freshness-report.yml ["concurrency-missing"]
workflowCount 32, errors []
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Move each `${{ github.event.* }}` value in the three flagged run scripts into a step `env:` entry and read it as a quoted shell variable.
- Add a `concurrency:` block that queues runs to `dependabot-auto-merge.yml` and the standard block to `strict-pass-freshness-report.yml`.
- Update the concurrency count claim in `job-shape-rules.md` to the recounted value.
- Add a Node 20 step for the advisor plugin suite and the parallel node check suite in the two workflows that run them.
- Keep the changed-packet rule-set comparison test running the gate's real script now that the script reads step env.

### Out of Scope
- The protected workflows (gate-inputs, trigger-index-rebuild, dispatch-enforcement-guard, naming-standard-guard, message-contract) - frozen by the brief.
- `.github/scripts/**` - frozen by the brief, so the pre-existing gate-inputs parser miss on `pre-push:263` stays for the commit already on main.
- Any other line of the sk-code-ci references - another lane owns them.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.github/workflows/agent-mirror-sync.yml` | Modify | Event SHAs through step env |
| `.github/workflows/comment-hygiene.yml` | Modify | Event SHAs through step env |
| `.github/workflows/changed-packet-validation.yml` | Modify | Event name and SHAs through step env |
| `.github/workflows/dependabot-auto-merge.yml` | Modify | Concurrency block, `cancel-in-progress: false` |
| `.github/workflows/strict-pass-freshness-report.yml` | Modify | Standard concurrency block |
| `.github/workflows/opencode-plugin-tests.yml` | Modify | Node 20 step for the advisor plugin suite |
| `.github/workflows/sk-code-script-tests.yml` | Modify | Node 20 step for the parallel node check suite |
| `.skilled/skills/sk-code/sk-code-ci/references/job-shape-rules.md` | Modify | Concurrency count claim and doc version |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/ci-rule-set-comparison.vitest.ts` | Modify | Supplies the step env to the gate script |
| `.skilled/skills/sk-code/sk-code-ci/changelog/v1.1.4.0.md`, `.skilled/skills/system-spec-kit/changelog/v2.12.11.0.md` | Create | Changelog entries |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | `node .skilled/commands/doctor/scripts/ci-report.cjs --json` reports zero flags across all 32 workflows. |
| REQ-002 | No flagged run script contains `${{ github.event`; each reads the same values for push and pull_request through step env. |
| REQ-003 | `dependabot-auto-merge.yml` carries a concurrency block with `cancel-in-progress: false`; `strict-pass-freshness-report.yml` carries the standard block. |
| REQ-004 | `actionlint` passes on every workflow and the gate-inputs check prints `RESULT: PASSED`. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-005 | The concurrency claim in `job-shape-rules.md` reads 32 of 32, recounted from the tree. |
| REQ-006 | When Node 20 support is declared, the two Node 20 sensitive suites run on Node 20 in CI with path filters, timeout and concurrency unchanged, and the extra time is recorded. |
| REQ-007 | The rule-set comparison vitest and the doctor ci tests stay green. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The ci report sums to 0 flags over 32 workflows, from 5 before.
- **SC-002**: `grep -h -A2 '^concurrency:' .github/workflows/*.yml` shows 32 blocks, 30 with the pull-request-only cancel value and 2 with `false`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The rule-set comparison test runs the changed-packet script by text substitution | The env move leaves `EVENT_NAME` unbound and fails ten cases | The test now reads the step's `env:` entries and supplies them, rendered the same way |
| Risk | An auto-merge run cancelled half way | Medium | `cancel-in-progress: false` queues the next run instead |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- /ANCHOR:nfr -->

### Performance
- **NFR-P01**: The two Node 20 steps add one `setup-node` call and one suite each, about 2 s of suite time measured locally, so well under a minute per run.

### Security
- **NFR-S01**: No event value is expanded into script text; each reaches the shell as a quoted environment variable.

### Reliability
- **NFR-R01**: Push, pull_request and the first-push fallback in the changed-packet gate keep the same SHAs.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: on a push, the pull_request SHA entries expand to empty strings and the script never reads them.
- Maximum input: N/A, no input size changes.
- Failure path: a branch's first push still has an all-zero before-SHA and still falls back to the parent commit.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 7/25 | Seven workflows, one reference line, one test |
| Risk | 6/25 | Required checks among the workflows; behaviour kept identical |
| Research | 5/20 | Node 20 support decision and the test that renders the gate script |
| **Total** | **18/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Is Node 20 supported? Decision: yes. No root `package.json` exists and the README asks for Node 24, but the advisor runtime declares `^20.19.0 || >=22.12.0` and system-spec-kit declares `>=20.11.0`, and those are the packages the two suites exercise.
<!-- /ANCHOR:questions -->

---
