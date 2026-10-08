---
title: "Implementation Plan: Phase 7: ci-rule-set-comparison"
description: "Extract rule sets from validator output in two CI gates and compare them instead of verdicts. Pass the previous sweep artifact as a baseline. Update documentation."
trigger_phrases:
  - "ci rule set comparison plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 7: ci-rule-set-comparison

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Bash and GitHub Actions workflow YAML |
| **Framework** | GitHub Actions, no application framework |
| **Storage** | Workflow run artifacts: the previous successful run's `report.json` is the sweep baseline |
| **Testing** | Vitest tests that run the workflows' own run blocks against a stub validator and a stub `gh`, plus the real sweep script. A first run on GitHub is still to come |

### Overview
The changed-packet validator and the weekly sweep use GitHub Actions to report spec folder validation. They compare the wrong things today. This phase parses rule names from validator output and compares them between base and head instead of comparing pass/fail verdicts.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented - spec.md sections 2 and 3
- [x] Success criteria measurable - two concrete test scenarios in spec.md section 5
- [x] Dependencies identified - none for this phase

### Definition of Done
- [x] Acceptance criteria reviewed - each row in `acceptance-criteria.md` carries its test
- [x] Docs updated - spec, plan, tasks, acceptance criteria, and the workflow README
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Declarative configuration. The workflows chain run steps that extract rule names and compare them.

### Key Components
- **Changed-packet gate** (`changed-packet-validation.yml:89-188`): `failing_rules()` reads each `--json` report and keeps the rule names with status `error`; `comm -23` of the head set against the base set names the rules the base did not fail.
- **Weekly sweep** (`strict-pass-freshness-report.yml:48-126`): a fetch step downloads the previous successful run's `report.json` and exports `BASELINE_REPORT`; the sweep step passes it as `--baseline`. The sweep script is unchanged and classifies each folder by its baseline status.

### Data Flow
The changed-packet gate runs the validator on the PR head, then on a worktree of the base for each packet that fails, extracts the failing rule names from each `--json` report, and blocks only on head rules the base did not fail. A report it cannot read fails closed. The weekly sweep downloads the previous sweep artifact and passes it as `--baseline`; the sweep script reports a `regression` when a folder passed in the baseline and fails now, a `known-failure` when it failed there and still fails, and a `first-run` for every failure when no baseline exists.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.github/workflows/changed-packet-validation.yml` lines 89-188 (formerly 131-147) | PR gate logic | Update: extract and compare rule sets instead of verdicts | A test packet with different failing rules at base and head is reported as a regression |
| `.github/workflows/strict-pass-freshness-report.yml` lines 48-126 (formerly line 56) | Weekly sweep call | Update: pass previous artifact as baseline | The sweep receives `--baseline` and compares with it |
| `.github/workflows/README.md` lines 28, 49, 62, 64 | Documentation | Update: describe the rule-set comparison approach | Rows match the workflows; the README describes behavior in table rows and carries no line numbers |

Required inventories:
- Same-class producers: no other gate compares validator output between base and head (other gates like agent-mirror-sync, comment-hygiene, and message-contract compare `github.event.pull_request.base.sha` to scope changed files, but not validator output).
- Consumers: the PR CI check and the weekly schedule both display their results in GitHub. No other system reads them.
- Matrix axes: passed-at-base vs failed-at-base, failed-at-head with same rules vs different rules, baseline present vs absent.
- Invariant: a rule set comparison detects when the set of failing rules changes, regardless of verdict.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Changed-packet gate | A packet that changes rule sets between base and head | The gate's run block, extracted from the YAML, run against a fixture repo with a stub validator (5 tests in `ci-rule-set-comparison.vitest.ts`). A test PR on GitHub is not run yet |
| Weekly sweep gate | The sweep with and without a baseline | The real sweep script with a stub validator and a baseline file (3 tests). A dispatched sweep on GitHub is not run yet |
| Artifact retrieval | Fetch the previous sweep artifact | The fetch step's run block with a stub `gh`: no run, a good report, an unparseable report (3 tests). The build uses `gh run download` with the job token and `actions: read`, not `actions/download-artifact@v4` with a fine-grained token. Previously failing packets report `known-failure` with a baseline and `first-run` without one (sweep tests). A real artifact download is for the first run on GitHub |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Validator output format (rule names) | Internal | Stable | Rules are already named in each check output |
| Previous sweep artifact | Internal | Available | First run has no baseline; job handles gracefully |
| GitHub Actions artifact storage | External | Available | Always available on GitHub |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The rule-set comparison logic produces false positives or fails to extract rules.
- **Procedure**: `git revert` the commit. Restore the verdict-based logic. The weekly sweep falls back to reporting all failures until a new baseline is created.
<!-- /ANCHOR:rollback -->

---
