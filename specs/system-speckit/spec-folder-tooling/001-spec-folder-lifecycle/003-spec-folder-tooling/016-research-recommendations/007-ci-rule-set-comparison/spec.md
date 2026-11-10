---
title: "Feature Specification: Phase 7: ci-rule-set-comparison"
description: "Two CI gates compare the wrong thing today. The changed-packet validator compares verdicts (passed vs failed) instead of rule sets, and the weekly sweep never receives a baseline so its regression warning never fires. This phase fixes both gates to compare actual changes."
trigger_phrases:
  - "ci rule set comparison"
  - "phase 7 ci rule set comparison"
  - "ci regression gate comparison rule sets"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 7: ci-rule-set-comparison

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-08 |
| **Branch** | `worktrees/091-consolidate-small-packets` |
| **Parent Spec** | ../spec.md |
| **Phase** | 7 of 16 |
| **Predecessor** | 006-evidence-gated-provenance |
| **Successor** | 008-legacy-era-report |
| **Handoff Criteria** | The changed-packet validator compares rule sets between base and head, and the weekly sweep receives and uses the previous artifact as a baseline |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 7** of the Research recommendations specification. Research recommendation [SH-07](../../014-spec-auto-healing-research/research/research.md#section-11-row-sh-07) found that two validation gates compare the wrong thing. The PR validation gate marks a regression only if a packet passed at the base and fails at the head, ignoring packets that fail both but with different rule sets. The weekly sweep never receives a baseline, so failing packets report as `first-run` and the regression warning never fires.

**Scope Boundary**: `.github/workflows/changed-packet-validation.yml` and `.github/workflows/strict-pass-freshness-report.yml`.

**Dependencies**: None. The phase is independent.

**Deliverables**:
- Compare failing rule sets instead of verdicts in the PR gate.
- Pass the previous sweep report as a baseline to the weekly job.
- Update the gates' documentation.

**Changelog**: When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`.github/workflows/changed-packet-validation.yml` lines 139 to 146 compare only verdicts: if the base passed and the head failed, it is a regression. If the base failed and the head also failed, it is marked pre-existing and passes. But the head might fail on five new rules while only two of the base rules still fail. `.github/workflows/strict-pass-freshness-report.yml` line 56 never passes `--baseline` to the sweep, so the regression warning reads an empty baseline and never fires.

### Purpose
Gates accurately detect when a PR introduces new rule failures or when the corpus-wide validation regresses.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Change the changed-packet comparison from verdict-based to rule-set-based on lines 131-147 of changed-packet-validation.yml.
- Pass the previous sweep artifact as `--baseline` on line 56 of strict-pass-freshness-report.yml.
- Update the gate documentation in `.github/workflows/README.md` (narrow scope: comparison methods and artifact retrieval; 004-trigger-index-rebuild-hardening documents token scope and non-fast-forward recovery in different sections).

### Out of Scope
- Changing the validator itself.
- Changing what rules the validator enforces.
- Changing any acceptance criteria or failure handling.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.github/workflows/changed-packet-validation.yml` | Modify | Compare rule sets instead of verdicts |
| `.github/workflows/strict-pass-freshness-report.yml` | Modify | Pass previous artifact as baseline |
| `.github/workflows/README.md` | Modify | Document the comparison methods |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | A packet that fails different rules at base and head is detected as a regression, not pre-existing |
| REQ-002 | The weekly sweep compares with the previous artifact and reports actual regressions, not all failures |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-003 | The PR gate reports which new rules appeared |
| REQ-004 | The weekly sweep baseline is retrieved and passed as a flag |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A test packet that fails rules 5 and 10 at base and rules 3, 7, 12 and 15 at head is reported as a regression (showing the rule set changed).
- **SC-002**: The weekly sweep runs with a baseline and reports zero regressions when the rule counts are identical to the previous week.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Extracting rule sets from the validator output adds processing complexity | Low | The validator already reports rule names; parsing is straightforward |
| Risk | The previous sweep artifact might not exist on first run | Low | Gracefully default to no baseline on first run |
| Risk | A rule set comparison might miss some edge cases in how rules combine | Med | Test multiple failure scenarios before shipping |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Accuracy
- **NFR-A01**: A rule set comparison catches every new rule in any packet that changed verdict or rules.

### Reliability
- **NFR-R01**: The baseline fetch does not fail the job if the artifact does not exist (first run scenario).

### Maintainability
- **NFR-M01**: The comparison logic is documented so a future change to the validator does not break the gate.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- A packet that passed at base and fails at head (current regression detection) remains a regression.
- A packet that failed at base and passed at head (an improvement) is not a regression.

### Error Scenarios
- No baseline artifact exists on the first run of the weekly sweep: it runs without a baseline and reports all failures, not regressions.
- A validator output format change breaks the rule extraction: error is caught and reported clearly.

### State Transitions
- The PR gate runs on every PR; the weekly gate runs on a schedule and uses the latest sweep as the next baseline.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 8/25 | Two workflow files, lines 131-147 in one and line 56 in the other, plus README |
| Risk | 8/25 | CI gates; a bug could cause false positives or negatives; caught immediately in test PRs |
| Research | 2/20 | Phase 14 named the issues exactly |
| **Total** | **18/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

None open. The research identified the exact lines and the expected behavior.

Settled during the build, from the local checks and the two review rounds:

- **What counts as a failing rule.** A rule whose entry has status `error` in the validator's `--json` report. A strict run fails only on `error` entries, so warnings are left out of both sets. The changed-packet gate compares the head set against the base set and flags only the head rules the base did not already fail.
- **Unreadable validator output.** A report that does not parse, has no `entries` list or records a skipped run fails the gate closed, for the head copy and for the base copy, instead of reading silence as a pass.
- **Where the sweep baseline comes from.** The report uploaded by the last successful run of the same workflow on the same branch, fetched with `gh run list` and `gh run download` using the job's own token. That needs `actions: read`. No run, a failed download, or a report without a `results` array each print a notice and run the sweep without a baseline.
- **How the weekly sweep compares.** The sweep script is unchanged. It classifies each failing folder by what the baseline recorded for it: a folder that passed there is a `regression`, one the baseline recorded as failing is a `known-failure`, one absent from it is a `new-failure`, and with no baseline every failure is `first-run`. It does not compare rule counts. Success criterion SC-002 says "rule counts"; the observable result is zero regressions and `known-failure` rows.
- **How it was verified.** Locally, by tests that run the two workflows' own run blocks against a stub validator and a stub `gh`, plus the real sweep script. Nothing is pushed, so neither workflow has run on GitHub. The deviations are in implementation-summary.md.
<!-- /ANCHOR:questions -->

---


