# Deep Review Iteration 2

**Review target:** `specs/system-speckit/053-ci-workflow-efficiency`  
**Focus:** security boundaries and sensitive-data handling  
**Route:** Resolved route: mode=review target_agent=deep-review  
**Agent definition loaded:** yes  
**Sources reviewed:** phase 007 permission and switch requirements; phase 009 report, scaffold, and toggle contracts; the current CI report implementation, toggle workflow, message-contract workflow, Dependabot workflow, and the cited task evidence.

## Security review

- `ci-report.cjs` reads repository-variable values but maps them to state labels and prints no values [SOURCE: `.skilled/commands/doctor/scripts/ci-report.cjs:11`] [SOURCE: `.skilled/commands/doctor/scripts/ci-report.cjs:147`] [SOURCE: `.skilled/commands/doctor/scripts/ci-report.cjs:373`]. GitHub CLI calls use argument arrays rather than a shell, and commit SHAs are constrained to 40 lowercase hexadecimal characters [SOURCE: `.skilled/commands/doctor/scripts/ci-report.cjs:85`] [SOURCE: `.skilled/commands/doctor/scripts/ci-report.cjs:119`] [SOURCE: `.skilled/commands/doctor/scripts/ci-report.cjs:195`].
- The toggle allowlists six variables, excludes secrets and organization variables, requires explicit approval for each change, and refuses to disable either `SKILLED_CI_MESSAGES` or the master `SKILLED_CI` while the message-contract check is required [SOURCE: `.skilled/commands/doctor/assets/doctor-ci-toggle.yaml:27`] [SOURCE: `.skilled/commands/doctor/assets/doctor-ci-toggle.yaml:34`] [SOURCE: `.skilled/commands/doctor/assets/doctor-ci-toggle.yaml:71`] [SOURCE: `.skilled/commands/doctor/assets/doctor-ci-toggle.yaml:75`] [SOURCE: `.github/workflows/README.md:95`].
- The current Dependabot workflow confines the third-party metadata action to a read-only job. The separate write-scoped job has no checkout and runs only `gh pr merge` [SOURCE: `.github/workflows/dependabot-auto-merge.yml:13`] [SOURCE: `.github/workflows/dependabot-auto-merge.yml:19`] [SOURCE: `.github/workflows/dependabot-auto-merge.yml:29`] [SOURCE: `.github/workflows/dependabot-auto-merge.yml:38`] [SOURCE: `.github/workflows/dependabot-auto-merge.yml:58`].

## Findings by Severity

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **[LUNA-P2-002] Phase 007 closure text says the permission split is absent after it landed**

   **Case:** Given phase 007 is still open for other acceptance work, when a reader uses its closure statement to understand the security state, the statement says the Dependabot workflow still has one job with both write scopes even though task T019 is marked complete and the current workflow separates the read-only metadata action from the write-only merge command.

   **Evidence:** AC-002 remains `Unmet` and the closure text says the split has not been built [SOURCE: `specs/system-speckit/053-ci-workflow-efficiency/007-workflow-hygiene-on-off-control/acceptance-criteria.md:62`] [SOURCE: `specs/system-speckit/053-ci-workflow-efficiency/007-workflow-hygiene-on-off-control/acceptance-criteria.md:100`]. Task T019 is marked complete and records the two-job permission split [SOURCE: `specs/system-speckit/053-ci-workflow-efficiency/007-workflow-hygiene-on-off-control/tasks.md:509`] [SOURCE: `specs/system-speckit/053-ci-workflow-efficiency/007-workflow-hygiene-on-off-control/tasks.md:590`]. The current workflow has a read-only metadata job and a separate write-scoped job [SOURCE: `.github/workflows/dependabot-auto-merge.yml:13`] [SOURCE: `.github/workflows/dependabot-auto-merge.yml:33`]. The recorded live runs both skipped auto-merge because neither update was a security patch, so AC-002 may still require further behavioral evidence [SOURCE: `specs/system-speckit/053-ci-workflow-efficiency/007-workflow-hygiene-on-off-control/tasks.md:674`].

   **Impact:** The phase accurately remains open, but its closure explanation overstates the remaining security gap and obscures the one verification step that is still unobserved. This is a minor evidence and status-sync defect, not a finding that the current permission split is unsafe.

   **Suggested correction:** Update the closure text to distinguish the completed structural split from any remaining live security-patch run evidence, while leaving AC-002 unmet until its stated proof is satisfied.

   **Scope proof:** The finding concerns the phase 007 packet's acceptance and closure statements. The workflow was read only as evidence; no implementation files were changed.

## Workflow scope notes

- No P0 or P1 security finding was found in the reviewed report, toggle, or current Dependabot permission boundary.
- The phase 007 live evidence records two real Dependabot runs, but both skipped the write-scoped merge job. The privileged path remains explicitly deferred for follow-up evidence.
- The read-only convergence telemetry still reports an empty graph and `CONTINUE`; convergence is telemetry only under the max-iterations stop policy.

## Search coverage

- Credential-value exposure, shell argument injection, toggle approval bypass, and write-scope co-location were checked and ruled out in the reviewed surfaces.
- Phase 007's closure narrative was checked against task and workflow evidence and produced LUNA-P2-002.
- Live execution of the write-scoped job for a security patch remains deferred because the recorded runs did not exercise it.

Review verdict: PASS
