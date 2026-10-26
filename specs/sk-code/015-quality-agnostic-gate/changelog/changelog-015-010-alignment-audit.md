---
title: "Changelog: Phase 10: alignment-audit [015-quality-agnostic-gate/010-alignment-audit]"
description: "Chronological changelog for the Phase 10: alignment-audit phase."
trigger_phrases:
  - "quality agnostic gate alignment audit changelog"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-10-26

> Spec folder: `specs/sk-code/015-quality-agnostic-gate/010-alignment-audit` (Level 2)
> Parent packet: `specs/sk-code/015-quality-agnostic-gate`

### Summary

The phase's changes sit on HEAD 6d6e82c269 as an uncommitted change set of about 230 working-tree entries. tasks.md holds one task per fix group with its evidence, and acceptance-criteria.md holds the eighteen criteria, all Met. The CI routing fix closed the last open criterion, and an audit of AGENTS.md and the repo rules closed its five surviving findings.

### Added

- Build the scope file from the two packets' commits, symlinks resolved. Verify: wc -l < scratchpad/audit-scope-real.txt prints 705. Re-run 2026-10-26: it printed 705, and the code-and-config subset in align/q1/code.txt printed 405.
- CODE-01 and CODE-02, six test files placed beside their source (batches b1, b2). Batch b1 moved post-edit-router.test.cjs and b2 moved the other five under tests/, with their callers repointed in the workflow, the quality SKILL.md, two scripts READMEs, two playbooks and the hook README. Verify: node --test .skilled/hooks/post-edit-quality/tests/*.test.cjs and the three bash suites exit 0. Re-run 2026-10-26: the hook suite printed # tests 13, # pass 13, # fail 0, and ceiling-report.test.sh, check-comment-hygiene.test.sh and check-rule-copies.test.sh each exited 0 from their new tests/ folders.
- CODE-05, CODE-06 and CODE-07, workflow strictness (batches b4, b5, b6). set -euo pipefail is the first line of three run: blocks, one comment states why spec-kit-check.yml runs set -uo pipefail, and the ci-workflow-standards.md row now counts 29 of 30 workflow files and names all eight deliberate -uo steps. Verify: actionlint .github/workflows/*.yml exits 0. Re-run 2026-10-26: actionlint printed nothing and exited 0. The re-audit counted the -uo steps in advisory-checks.yml, spec-kit-check.yml, strict-pass-freshness-report.yml and trigger-index-rebuild.yml and got the same eight.
- SKILL-05, two skills over the word cap (batch b10). The cli-opencode SKILL.md went from 5216 to 4979 words by moving the single-dispatch text to a new section of references/integration-patterns.md, and the sk-git SKILL.md from 5026 to 4964 by moving a known-gap note to a troubleshooting entry. Verify: validate_skill_package.py --strict on each. Re-run 2026-10-26: both printed package_skill.py --check --strict: PASS (exit 0).
- SKILL-04, /doctor:ci scaffold and toggle had no scenario (batch b9). New doctor-ci-scaffold.md and doctor-ci-toggle.md scenarios, root playbook section 14 and index rows. Verify: validate-playbook-package.cjs --package sk-code. Re-run 2026-10-26: PASS ... scenarios=28 categories=9 operator=20 routing_gold_excluded=8 violations=0 warnings=0.
- Raise fifteen versions at patch level, one segment up each. sk-code 3.9.1.0, sk-code-ci 1.1.2.0, sk-code-quality 1.13.1.0, sk-code-review 1.9.1.0, sk-code-skilled 2.1.3.0, cli-external-orchestration 1.7.4.0, cli-opencode 1.5.1.0, cli-cursor 1.5.3.0, sk-doc 2.3.14.0, sk-create-repo-rule 1.1.2.0, sk-create-manual-testing-playbook 1.0.4.0, sk-git 1.9.6.0, system-deep-loop 1.6.8.0, system-skill-advisor 0.17.3.0 and system-spec-kit 2.11.1.0. Verify: each SKILL.md version has a changelog/v<version>.md. Re-run 2026-10-26: a loop over the fifteen packets printed ok for each, none MISSING.

### Changed

- [P] CODE lane, question 1. Findings CODE-01 to CODE-08, one P1 and seven P2. Reported: nothing the checkers cover failed, and the findings came from the contract text, a workflow rule check and shellcheck.
- CODE-03 and CODE-04, standard headers (batches b2, b3). A COMPONENT divider header went on six bash scripts and one Python script, and a MODULE header on router-replay-lib.cjs. Verify: head -5 of each shows the divider, and run-all-drift-guards.sh exits 0. Re-run 2026-10-26: check-gate-inputs.sh printed files=45 ... failures=0 and RESULT: PASSED, check-gate-inputs.test.sh exited 0, and the guards printed all 4 guards PASSED, 10 non-blocking warning(s).
- CODE-08, an unquoted glob in test-dist-freshness.sh (batch b7). CACHE_DIR replaces CACHE_GLOB, and lines 44 and 82 quote it. Verify: shellcheck -S warning on the file prints nothing. Re-run 2026-10-26: it printed nothing and exited 0, and the test exited 0.
- SKILL-11, ROUTER.md numbered 1, 2, 3, 6 to 12 (batches b16, c2). Sections renumbered 1 to 10, the inner citations and the SKILL.md:66 pointer moved to section 9, and verify-router-sync.cjs now matches its heading by pattern. Verify: parent-skill-check.cjs and verify-router-sync.cjs exit 0 and compiled-route-guard.cjs exits 0. Reported by b16: the renumber verified except the guard, which waited on the manifest. Re-run 2026-10-26: the guard exited 0 with every hub fresh, and the drift guards, which run verify-router-sync, passed 4 of 4.
- SKILL-14 and ROUTE-03, citations to the old section 11 (batch c4). README.md:124 and :135 and restraint-prompt.md:102 now cite section 9. Verify: ! rg -n 'section 11' $H/README.md. Reported by c4: no match and exit 0.
- On the operator's request, two audit lenses and a refute pass read AGENTS.md, REPO RULES.md and the repo-rule files. Five findings survived, four were fixed, and the fifth was resolved by amending agents-md-integration.md section 1: the trigger and index rows are required and checked, and the governed-section pointer is the default where an AGENTS.md section expands the rule. The measured corpus had rules with no pointer and rules with one, so the old two-to-four claim was stale. AGENTS.md was not edited, because it mirrors the operator's global CLAUDE.md. check-repo-rules.cjs printed RESULT: PASSED and its pytest suite passed.
- SKILL-13, the doctor-commands category README still counted three scenarios (batch c3). Line 18 now names five scenarios and line 32 their environment. Verify: a count of the scaffold scenario's name in the README. Reported by c3: the README validated with 0 issues.

### Fixed

- Record the audit-time readings that the fixes are measured against. Reported 2026-10-26: quality-gate.cjs over the 405 code files exited 0 with NO_BLOCKER_FOUND, 390 checked, 15 skipped as generated output and 0 findings. actionlint over 32 workflows exited 0. shellcheck -S warning over 12 shell files gave one real warning. run-all-drift-guards.sh passed 4 of 4. validate_skill_package.py --strict over 23 packets gave 21 PASS and 2 FAIL. validate_document.py --blocking-only over 1202 documents gave 28 failures.
- [P] DOCS lane, questions 2 and 3. Findings SKILL-01 to SKILL-12, four P1 and eight P2. Reported: the playbook corpus check had 0 violations before the fixes, so the findings came from the contract text and the feature coverage read.
- [P] READ lane, questions 4, 5 and 8. Findings README-01 to README-11 and CHANGELOG-01, five P1 and seven P2. Reported: 142 READMEs passed validate_document.py before the fixes, so the findings came from reading the READMEs against the tree.
- [P] ROUT lane, questions 6, 7, 9 and 10. Findings ROUTE-01, ROUTE-02, ADV-01, CMD-01, CMD-02 and AGT-01, all P2. Reported: every routing and mirror leg of the CI gate script exited 0 before the fixes.
- SKILL-01, SKILL-02 and SKILL-03, three shipped features with no scenario (batch b8). New scenarios untrusted-config.md, scoped-checklist-faults.md and parallel-syntax-pool.md under quality-gate/, indexed in the root playbook. Verify: validate-playbook-package.cjs --package sk-code/sk-code-quality. Re-run 2026-10-26: PASS ... scenarios=11 ... operator=11 ... violations=0 warnings=11. The 11 warnings are BACKTICK_PATH_UNRESOLVED on fixture paths, and existing scenarios carry the same warning.
- Clear GitHub Actions requests now reach the CI mode. deploy workflow, release workflow, turn off the ci, turn on the ci and ci review workflow joined the sk-code-ci keywords in hub-router.json, mode-registry.json and both CI_WORKFLOW rows of ROUTER.md, and the bare github actions keyword was narrowed to github actions permissions, because the bare phrase also counted inside github actions workflow and github actions yaml and pushed the review workflow out of the CI surface bundle. The sk-code manifest was re-minted and the admission test's live corpus size raised for the two new /doctor:ci scenarios. Re-run 2026-10-26: harden the GitHub Actions permissions, add concurrency to the deploy workflow, turn off the CI review workflows and add a timeout to the CI job route to sk-code-ci, review the github actions workflow yaml keeps its review and CI bundle, the route guard and admission check pass, and the compiled-route suites report no failure.
- REPO RULES.md section 4 now says AGENTS.md section 4, under Reply Rules and Mandates, keeps the two clauses, where it said section 8.
- The repo-rules-corpus.yml comments now say .opencode/repo-rules is a tracked symlink, so git reports no changes beneath it, where they said no such tree exists. actionlint exited 0 and check-gate-inputs.sh printed RESULT: PASSED.
- The sk-create-repo-rule rule-anatomy.md and repo-rule-template.md give ../../REPO%20RULES.md for .skilled/repo-rules/ and ../REPO%20RULES.md for a root repo-rules/, and point at check-repo-rules.cjs in place of quoted corpus counts.
- README-03, README-04, README-06, README-08 and README-12, the source-folder READMEs (batches b2, b20, b22, c8). The quality scripts, lib and hooks READMEs list their real files and the trust and pool behavior, drop the migration history and the false "only place" claim, and the review and skilled scripts READMEs gained their directory tree and contents table. The quality README's semicolon and run-on sentence from the first edit were fixed in c8. Verify: validate_document.py --type code_folder and the file-name loops. Reported by the re-audit: README-03, 04, 06 and 08 each printed Total issues 0 on code_folder, and c8 printed 0 for the two defect patterns.

### Verification

- Code gate over 421 files - Exit 0, NO_BLOCKER_FOUND, 0 findings
- actionlint, shellcheck, gate inputs, drift guards - Each exit 0, guards all 4 guards PASSED, 10 non-blocking warning(s)
- Route guard, admission, sync - All hubs fresh or excused, Every hub passes the admission check, all 55 served copies match their authored files
- Mirrors - Hermes 67 copies in sync, codex and pi 11 agents in sync, agent mirrors 11 agent(s) checked
- Node suites - the quality, hook, sk-code-skilled and doctor suites all pass
- Package and playbook validators - cli-opencode and sk-git strict PASS, six playbook packages 0 violations, sk-code topology verdict=PASS valid=14
- Changed markdown - 86 files printed no FAIL under validate_document.py --blocking-only
- Versions - 15 of 15 SKILL.md versions have a changelog file at that number
- Routing prompts - four CI prompts reach sk-code-ci, the workflow-yaml review keeps its review and CI bundle, the quality prompt reaches sk-code-quality
- Repo rules - check-repo-rules.cjs RESULT: PASSED, its pytest suite passes
- Moved tests in CI - sk-code-script-tests.yml names the new tests/ paths and opencode-plugin-tests.yml finds hook tests with a recursive find

### Files Changed

| File | Action | What changed |
|---|---|---|
| `Six test files under .skilled/hooks/post-edit-quality/, sk-code-quality/scripts/ and sk-code-review/scripts/` | Move | Placed under a tests/ tree with callers repointed |
| `Seven scripts and router-replay-lib.cjs` | Edit | The standard COMPONENT and MODULE headers |
| `Four workflow files, ci-workflow-standards.md and test-dist-freshness.sh` | Edit | Run-block strictness, one comment, the corrected rule row and one quoted glob |
| `cli-opencode/SKILL.md, sk-git/SKILL.md and one new reference section each` | Edit, create | Both under the 5000-word cap |
| `sk-code/ROUTER.md, SKILL.md, README.md, verify-router-sync.cjs` | Edit | Sections 1 to 10 with every citation moved |
| `Three quality scenarios, two /doctor:ci scenarios and the category README` | Create, edit | Coverage for the shipped features |
| `Eight scenario files, four root playbooks, 14 fanout-stress files and playbook-corpus-manifest.json` | Edit | The five-section shape and the narrowed routing-gold list |
| `Thirteen READMEs, README.md and .skilled/commands/README.txt` | Edit | Inventories, trust and pool wording, the quality target |
| `hub-router.json, mode-registry.json, ROUTER.md` | Edit | CI and quality-config vocabulary, with the narrowed github actions permissions keyword |
| `.skilled/bin/tests/compiled-route-admission.test.cjs` | Edit | The live corpus size for the two new /doctor:ci scenarios |
| `REPO RULES.md, .github/workflows/repo-rules-corpus.yml` | Edit | The AGENTS.md section citation and the symlink comment |
| `sk-create-repo-rule rule-anatomy.md, repo-rule-template.md, agents-md-integration.md` | Edit | Link forms per rule location, the checker in place of counts, the amended pointer contract |
| `derive-command-bridges.cjs, _routes.yaml, route-validate.py and the bridge README` | Edit | The default_target rule for a bare /doctor:ci |
| `validate_document.py, test_changelog_validator.py` | Edit | A warning for internal ids and test counts in a changelog entry |
| `.skilled/agents/code.md, .claude/agents/code.md and the generated mirrors` | Edit, regenerate | The Iron Law citation |
| `Fifteen SKILL.md files, fifteen changelog entries, JSON metadata, four route manifests and the Hermes copies` | Edit, create, regenerate | Versions and generated copies |

### Follow-Ups

- Add the three governed-section pointers AGENTS.md lacks. An operator option, not an open defect: the amended contract makes the pointer a default, and AGENTS.md mirrors the operator's global CLAUDE.md.
- Raise the per-document edition of every markdown file edited after the last staging. OPEN. frontmatter-version.mjs bump raises only staged documents and this phase cannot stage. Re-run 2026-10-26: bump --check --base a506589406^ printed 207 changed docs | every changed body raised its version and exited 0, but that compares committed history, and bump --check --base HEAD printed 0 changed docs because the audit's edits are uncommitted, so it proves nothing about them. frontmatter-version.mjs verify printed 5517 files | ok=2920 skip-no-frontmatter=2597. Close it by staging the files and running the pre-commit gate, or node .skilled/skills/sk-doc/shared/scripts/frontmatter-version.mjs bump after staging.
- ADV-02, the bare-command keyword also matches other typed targets of the same command. OPEN as a design call. Reported: /doctor:git hooks returns the git-hooks bridge, then the git-setup bridge, then sk-git. The README now documents it (T028). Whether an exact-token match should replace the substring match belongs to the advisor owner.
- CHANGELOG-01 residual, two released entries still carry an internal id and test counts. OPEN by design. sk-code-quality/changelog/v1.4.0.0.md names an internal scenario id and v1.5.0.0.md carries test counts. Released entries are immutable and the released-changelog guard protects them. The new changelog check added detection, so a new entry now warns. An erratum entry is the operator's call.
- Decide whether a code folder without a README is a rule. OPEN as a question. The folder verifier flagged 15 in-scope folders, among them .github/scripts, .skilled/commands/doctor/scripts and .skilled/skills/sk-code/benchmark/scripts. No contract line states it as a rule, so none was reported as a finding.
- Commit the working tree. OPEN and the operator's. This phase made no git write, so every fix and this folder sit in the working tree, about 230 entries before the packet changelog is written. The command rules bar a commit here.
