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
| **Storage** | Git artifacts (for the baseline) |
| **Testing** | Manual PR dispatch with test packets, workflow log inspection |

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
- **Changed-packet gate** (lines 131-147): Compares the validator output from base and head for rule set differences.
- **Weekly sweep** (lines 47-85): Downloads the previous artifact, extracts its rule counts, and compares them with the current run.

### Data Flow
The changed-packet gate runs the validator on both the base tree and the PR head, extracts rule names from each output, and compares the sets. The weekly sweep downloads the previous sweep artifact, extracts the rule counts, and reports only regressions (new failures) not all failures.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.github/workflows/changed-packet-validation.yml` lines 131-147 | PR gate logic | Update: extract and compare rule sets instead of verdicts | A test packet with different failing rules at base and head is reported as a regression |
| `.github/workflows/strict-pass-freshness-report.yml` line 56 | Weekly sweep call | Update: pass previous artifact as baseline | The sweep receives `--baseline` and compares with it |
| `.github/workflows/README.md` | Documentation | Update: describe the rule-set comparison approach | Document is accurate and refers to line numbers |

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
| Changed-packet gate | PR with a test packet that changes rule sets | Dispatch a test PR and inspect the gate output |
| Weekly sweep gate | Run the sweep with and without a baseline | Trigger manually and check the baseline was used |
| Artifact retrieval | Download the previous sweep artifact | Download from a prior run: retrieve its run-id from workflow history, use `actions/download-artifact@v4` with `run-id` parameter and a fine-grained token with repo:read scope; verify previously-failing packets report as `known-failure` (loaded baseline) vs `first-run` (no baseline) |
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
