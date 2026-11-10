# Iteration 003 — sk-git Skill Documentation

**Timestamp:** 2026-10-16T05:09:06Z  
**Focus:** Skill package, README, commit template, setup scenario, and playbook index  
**Dimensions:** correctness, maintainability, traceability

## Scope and Sources

Reviewed the five skill-document targets in the bound manifest: `.skilled/skills/sk-git/SKILL.md`, `.skilled/skills/sk-git/README.md`, `.skilled/skills/sk-git/assets/commit-message-template.md`, `.skilled/skills/sk-git/manual-testing-playbook/doctor-commands/doctor-git-setup-check.md`, and `.skilled/skills/sk-git/manual-testing-playbook/manual-testing-playbook.md`. Read the lead steer at `specs/sk-git/033-git-setup-customization/006-release-conformance-review/review/lineages/luna-max-fast/steer.md` and the applicable skill, README, playbook, and Human Voice Rules contracts.

The skill package validator and playbook package validator were run in read-only mode. README, setup-scenario, and playbook-index structure checks were also run without `--fix`. The HVR scan covered all five target files; code blocks and inline code were masked by the scanner as specified by the HVR scope contract.

## Findings by Severity

### P0 Findings

None.

### P1 Findings

1. **The sk-git skill fails its package size gate** — `.skilled/skills/sk-git/SKILL.md:1`

   - Evidence: `python3 .skilled/skills/sk-doc/sk-create-skill/scripts/validate_skill_package.py .skilled/skills/sk-git` exited 1 and reported `SKILL.md exceeds word limit (5038 words, max: 5000)`. The skill-authoring contract caps `SKILL.md` at 5,000 words. The README currently says the package check reports `PASS` at `.skilled/skills/sk-git/README.md:272`, which does not match the observed result.
   - Finding class: package validation failure.
   - Affected surface: skill validation and release packaging.
   - Recommendation: trim the skill below the 5,000-word cap and rerun the package validator before release.

### P2 Findings

1. **The skill's playbook summary reports an obsolete scenario range and category count** — `.skilled/skills/sk-git/SKILL.md:573`

   - Evidence: this line says `GIT-001` through `GIT-042` across 8 categories. The playbook validator reports 46 scenarios across 9 categories; the README also says 9 categories at `.skilled/skills/sk-git/README.md:204` and `:267`. The index includes GIT-044, GIT-045, and GIT-046 at `.skilled/skills/sk-git/manual-testing-playbook/manual-testing-playbook.md:289`, `:305`, and `:321`.
   - Finding class: stale inventory reference.
   - Affected surface: playbook discovery and release coverage claims.
   - Recommendation: update the scenario range and category count to match the current package inventory.

2. **The playbook validation example cannot run as written** — `.skilled/skills/sk-git/SKILL.md:573`

   - Evidence: the example invokes a Python validator through `bash`. It also pairs a repository-root validator path with a target path relative to the sk-git folder, so neither the repository root nor the skill folder can resolve both paths at once. The README's verification row uses `python3` and a repository-root target path at `.skilled/skills/sk-git/README.md:271`.
   - Finding class: invalid documented command.
   - Affected surface: manual playbook structural verification.
   - Recommendation: use the Python interpreter and make both paths relative to one declared working directory.

3. **The playbook wave plan double-books GIT-042 and omits GIT-044–GIT-046** — `.skilled/skills/sk-git/manual-testing-playbook/manual-testing-playbook.md:161`

   - Evidence: wave 5 assigns the inclusive range GIT-023 through GIT-043, which contains GIT-042. Wave 6 assigns GIT-042 again at line 162. GIT-044 through GIT-046 are indexed in the commit-formation category at lines 289–335 but appear in no suggested wave. The structural validator passes, but it does not check wave coverage or uniqueness.
   - Finding class: incomplete orchestration plan.
   - Affected surface: deterministic execution and evidence coverage for the full scenario battery.
   - Recommendation: assign each scenario to one wave and add GIT-044–GIT-046 to the plan.

4. **The skill prose has widespread HVR punctuation blockers** — `.skilled/skills/sk-git/SKILL.md:220`

   - Evidence: the HVR scan with `--all` reports 61 hard punctuation findings, primarily em dashes and semicolons, across this 579-line document. Under the HVR long-document rule, the relevant report is blocker count plus deduction density rather than an absolute score: 314 mechanical deductions, or 54.2 per 100 lines. Line 220 is one authored prose example with an em dash; line 308 contains multiple semicolons in the worktree provisioning rule.
   - Finding class: documentation-standard failure.
   - Affected surface: skill instructions and maintainability of the published guidance.
   - Recommendation: revise the authored prose to remove the prohibited punctuation, then rerun the scan and assess the long-document density.

5. **The playbook index has widespread HVR punctuation blockers** — `.skilled/skills/sk-git/manual-testing-playbook/manual-testing-playbook.md:14`

   - Evidence: the HVR scan with `--all` reports 53 hard punctuation findings, primarily semicolons, across this 1,024-line document. Under the HVR long-document rule, the report is blocker count plus deduction density: 268 mechanical deductions, or 26.2 per 100 lines. The opening tagline at line 14 is an authored em-dash example; the remaining hits include authored scenario and orchestration prose.
   - Finding class: documentation-standard failure.
   - Affected surface: operator-facing scenario and release-readiness guidance.
   - Recommendation: revise the authored prose to remove prohibited punctuation and rerun the scan.

6. **The README repeats the worktree reaper outcome** — `.skilled/skills/sk-git/README.md:57`

   - Evidence: the row says, “Keeps the rest and keeps and reports the rest,” which repeats the same outcome and leaves the distinction between reaped and report-only worktrees unclear.
   - Finding class: proofreading defect.
   - Affected surface: the README's worktree safety summary.
   - Recommendation: state once that qualifying wrapper worktrees are reaped and all other worktrees are reported without removal.

## Verification Evidence

| Check | Result |
|---|---|
| `validate_skill_package.py .skilled/skills/sk-git` | **FAIL**, exit 1: 5,038 words exceeds the 5,000-word limit |
| `validate-playbook-package.cjs --package .skilled/skills/sk-git/manual-testing-playbook --repo-root .` | **PASS**, exit 0: 46 scenarios, 9 categories, 0 violations, 0 warnings |
| README, setup scenario, and playbook-index structure checks | **PASS**, exit 0 with 0 issues for each document |
| HVR scan of five targets | **PARTIAL**: README, commit template, and setup scenario have no hard blockers; SKILL.md has 61 and the playbook index has 53 |

The HVR scan's absolute mechanical ceilings are not used for the two documents over 400 lines. Their hard-blocker counts and deduction densities are reported above in line with the HVR scope guidance. The wave-plan defect is an orchestration gap that the structural validator does not evaluate.

## Workflow Deviation

This iteration used more than the deep-review skill's 12-call target while reading the five bound artifacts, contracts, and read-only validators. The required inline review was completed without a nested dispatch, and no write escaped the lineage directory. Fixture tests that create temporary repositories or files were not run.

## Next Focus

Review the manifest's cross-repository command, skill, and setup references, including all repo listings that mention doctor commands or `/doctor:git` targets.

Review verdict: CONDITIONAL
