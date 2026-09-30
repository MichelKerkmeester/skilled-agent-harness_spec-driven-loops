---
title: "Tasks: Doc validation off switches"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "doc validation off switch tasks"
  - "validation switch verification"
  - "commit trap regression"
  - "sk-doc validator guard tasks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Doc validation off switches

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Scaffold the packet and score its level (`recommend-level.sh`: Level 2, 50 of 100, no phases)
- [x] T002 Reproduce the commit trap: `repair-derived.cjs` exits 2 under `SPECKIT_SKIP_VALIDATION=1` (evidence: before the fix it printed `UNREADABLE specs/sk-doc/061-skilled-release-changelog/003-adjacent-alignment` and `inspected=1 repairable=0 failed=1`, and HEAD's `validate.sh --json` under the switch exits 0 with 0 bytes on stdout)
- [x] T003 Trace every consumer of the `validate.sh` JSON and every caller of the sk-doc validators (`plan.md` fix addendum)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 `hook_flag_on` and `isFlagOn` with tests (`.skilled/hooks/shared/hook-flags.sh`, `hook-flags.cjs`, `hook-flags.test.cjs`) (evidence: `node --test` 16 pass, 0 fail)
- [x] T005 One skip path after parsing, file persistence, the skipped JSON report and the help text (`runtime/cli/spec/validate.sh`) (evidence: `exit_if_switched_off` runs after `apply_env_overrides`, and both old exits are gone)
- [x] T006 Switch tests and the commit-trap regression (`cli/tests/validate-skip-switch.vitest.ts`, `cli/tests/repair-derived.vitest.ts`) (evidence: 2 files, 19 tests pass. HEAD's `validate.sh` fails the 6 new tests)
- [x] T007 The Node and Python helpers (`sk-doc/shared/scripts/validation-switch.cjs`, `validation_switch.py`) (evidence: the parser parity test matches `loadConfigFile` on a file with a BOM, CRLF, quotes and malformed lines)
- [x] T008 [P] Guard the 13 Python validators at their command-line entry (evidence: the sweep test spawns each one with the switch on)
- [x] T009 [P] Guard the 7 Node validators, check modes only (evidence: the same sweep, 20 validators in all, and removing the `hvr_scan.py` or `check-repo-rules.cjs` guard fails it by name)
- [x] T010 Helper and validator tests the CI runner picks up (`sk-doc/scripts/tests/test_validation_switch.py`) (evidence: 7 tests pass under `run-script-tests.sh`)
- [x] T011 [P] Spec-kit docs (`ENV-REFERENCE.md`, `path-scoped-rules.md`, `validation-rules.md`, `spec-validation-rule-engine.md`)
- [x] T012 [P] sk-doc and hooks docs (`core-standards.md`, `validation-and-enforcement.md`, `shared/scripts/README.md`, `.skilled/hooks/README.md`, `.skilled/hooks/shared/README.md`, `hook-flags.env.example`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T013 Rerun the commit trap: `repair-derived.cjs --folder <packet> --apply` exits 0 with the switch on (evidence: `inspected=1 repaired=0 failed=0` and exit 0 with the switch in the environment and again with it only in a flags file, packet metadata unchanged. With the switch off the same packet reports its real repairs and exits 1)
- [x] T014 Suites: the hooks resolver, the spec-kit cli and root projects, and the sk-doc script runner (evidence: hooks 16 of 16, cli project 156 files and 1561 tests with 19 skipped, root project 107 files and 1281 tests with 13 skipped as in the baseline, sk-doc runner 26 files. The rename fixture test passed in a private full clone of `4f4d25288c` plus this work, since in the shared checkout it trips on other sessions' concurrent writes)
- [x] T015 Docs pass `validate_document.py` and `hvr_scan.py`, and frontmatter versions are applied (evidence: 9 edited docs are valid, the one warning in `ENV-REFERENCE.md` is also there at HEAD, HVR findings are the same as HEAD's on all 9, and the 5 versioned docs carry the value `frontmatter-version.mjs apply` computed. The enforced `gate` reports ok=2951 with 9 docs skipped for having no frontmatter)
- [x] T016 Packet passes `validate.sh --strict`, and the scoped diff holds only this packet's paths (evidence: `RESULT: PASSED` with 0 errors and 0 warnings after `repair-derived.cjs --apply` re-derived the graph metadata. Each commit's `git diff --cached --name-status` listed only this work's paths)
- [x] T017 Keep the example's validation comments on their own lines, so a line uncommented as the docs say turns its switch on (`.skilled/hooks/hook-flags.env.example`, `sk-doc/scripts/tests/test_validation_switch.py`) (evidence: the new test failed on the old example, whose trailing comments left both switches off, and passes now, 8 of 8)
- [x] T018 End a value at a `#` after a space or tab in every reader of `hook-flags.env`, so every line of the example works once uncommented, the hook lines included. Restore the example's validation comments beside their values (`hook-flags.cjs`, `hook-flags.sh`, `hook-flags.test.cjs`, `sk-doc/shared/scripts/validation_switch.py`, `sk-doc/scripts/tests/test_validation_switch.py`, `sk-code-quality/scripts/check-dist-staleness.sh`, `hook-flags.env.example`, both hooks READMEs) (evidence: hooks 18 of 18, and reverting the rule in any one of the four readers fails the cross-reader test. sk-doc 8 of 8, and the old Node parser fails the example test. With `SYSTEM_DIST_FRESHNESS_DISABLED=1  # note` saved, the dist checker made 0 calls to its Node helper, against 1 for the control and 1 for the old parser. The sk-doc runner passes 26 files and the git hook suites 8 of 8 with 228 checks. The plugin tests pass 21 of 21)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:phase-4 -->
## Phase 4: Review Remediation

Added after the deep review of 2026-09-28 (`review/review-report.md`, CONDITIONAL, one P1 and seven P2), at the operator's request to fix every finding. Each new test was run against the unfixed code first and failed.

- [x] T019 WS-A, P1-LUNA-002: capture `validate.sh`'s stdout apart from its stderr under `--json` and carry `skipped` into the wrapper's report (`runtime/cli/spec/progressive-validate.sh`, `cli/tests/progressive-validation.vitest.ts`) (evidence: T-PB2-16a parses level 1's stdout and finds the notice on stderr, and T-PB2-16b reads `skipped: true` with `passed: true` at the default level and `skipped: false` for the control. Against the unfixed wrapper, T-PB2-10b, 16a and 16b fail)
- [x] T020 WS-B, F001, P2-LUNA-004, P2-LUNA-001 and P2-LUNA-005: the shell reader trims only a value's edges and tests whether the variable is set, and the shell and dist readers drop a byte order mark (`.skilled/hooks/shared/hook-flags.sh`, `sk-code-quality/scripts/check-dist-staleness.sh`, `.skilled/hooks/shared/hook-flags.test.cjs`) (evidence: the two new cross-reader tests failed 18 of 20 before the fix and 19 of 20 with only the shell fixed, the byte order mark case still failing in the dist reader. All four readers now pass 20 of 20)
- [x] T021 WS-C, P2-LUNA-003: a skipped status in both local audit consumers (`runtime/cli/spec/quality-audit.sh`, `runtime/cli/sweep/strict-pass-freshness.ts`, `cli/tests/quality-audit-script.vitest.ts`, `cli/tests/strict-pass-freshness.vitest.ts`) (evidence: against the unfixed code the three new tests fail. After the fix the audit reports `skipped: 1` with the folder's status `skipped`, and the sweep reports `skipped: 1`, exits 0 and treats a skipped baseline row followed by a failure as a new failure. The three files pass 62 of 62, and the sweep typechecks under `tsc --strict`)
- [x] T022 WS-D, F002 and F004: both switches in `.env.example` Section 5, and "a space or tab" in the hooks README (`.env.example`, `.skilled/hooks/README.md`)
- [x] T023 WS-D, F003: a Doc Validation section and upgrade notes in the unreleased v4.0.0.2 entry, plus component entries for system-spec-kit, sk-doc and sk-code-quality with their versions bumped (`.skilled/changelog/skilled/v4.0.0.2.md`, `system-spec-kit/changelog/v4.1.5.0.md`, `sk-doc/changelog/v2.2.3.0.md`, `sk-code-quality/changelog/v1.0.1.0.md`) (evidence: all four pass `validate_document.py` with 0 issues and `hvr_scan.py` with 0 hard blockers. The Hermes copies are in sync, 71 of 71)
- [x] T024 [P] The docs that describe the changed consumers (`runtime/ENV-REFERENCE.md`, `runtime/cli/sweep/README.md`, `feature-catalog/tooling-and-scripts/progressive-validation-for-spec-documents.md`) (evidence: each shows the same `validate_document.py` result as at HEAD, and the catalog entry carries the version `frontmatter-version.mjs apply` computed)
- [x] T025 Rerun every suite this work touches beside the baseline, plus shellcheck, comment hygiene and the drift guard (evidence: see the verification rows in `implementation-summary.md`)
<!-- /ANCHOR:phase-4 -->

---

<!-- ANCHOR:phase-5 -->
## Phase 5: Release Review

Added when the operator asked for a review of the v4.0.0.2 entry and a release tag. Packets 062 and 067 both wrote into the entry, so both record the review. T028 to T030 followed the operator's note that the entry led with the goal work when the skill advisor changes mattered more, T031 followed a request for tighter prose, T032 followed a request to rewrite the entry in the new changelog style and T033 followed the operator's go-ahead to fix the tag.

- [x] T026 Review the v4.0.0.2 entry against the changelog contract and the 172 commits since `v4.0.0.1`, then fix what the review found (`.skilled/changelog/skilled/v4.0.0.2.md`) (evidence: the review found five user-visible changes missing, a topic phrase carrying a version number, four topic phrases where the contract asks for one or two and seven topical sections. The entry now covers all five, keeps two topic phrases and has six sections. It passes `validate_document.py` with 0 issues and `hvr_scan.py` with 0 hard blockers, and every link resolves)
- [x] T027 Tag and publish v4.0.0.2 through the changelog mode's release step, with the operator's approval (evidence: all ten CI workflows passed on `68dd665c5d` first. The annotated tag `v4.0.0.2` peels to `68dd665c5d` on origin, and the release, titled with the tag and the entry's editorial title, is published as Latest, neither draft nor pre-release. Its body matches the entry without frontmatter and title plus the full-changelog line, 25,277 characters)
- [x] T028 Fix the release step in both changelog workflows so the notes end with the full-changelog line and the tag message is built from the editorial title (`.skilled/commands/create/assets/create-changelog-auto.yaml`, `.skilled/commands/create/assets/create-changelog-confirm.yaml`) (evidence: commit `a71cf79ef2`, pushed to main. Applied to v4.0.0.2, the new rules reproduce the published body and tag subject exactly and the old rules do not. The fix landed after the tag, so the entry does not mention it)
- [x] T029 Rebalance the v4.0.0.2 entry so the skill advisor leads and the searchable changelogs are explained (`.skilled/changelog/skilled/v4.0.0.2.md`) (evidence: commit `31a279037a`, pushed to main. The advisor has its own section of twelve subsections and the changelog work has six, covering what an entry declares, how to look one up with and without `--triggers`, what the search reads and how the writers and the validator hold it. `validate_document.py` reports 0 issues and `hvr_scan.py` 0 hard blockers. The description is 217 characters, no subsection title passes nine words, and the entry keeps 12 summary bullets and 5 opening paragraphs. Each advisor, spec-kit and search item traces to the advisor v0.11.2.0 and v0.12.0.0 entries, the spec-kit v4.1.2.0, v4.1.3.0 and v4.1.4.0 entries or the search code, and sits inside the tag window)
- [x] T030 Update the published release to the rebalanced entry (evidence: `gh release edit` replaced the body and title. The live body equals the entry without frontmatter and title plus the full-changelog line, 32,927 characters, and v4.0.0.2 is still Latest, neither draft nor pre-release. The annotated tag message keeps its old wording, because changing it means deleting and re-pushing the tag. The old body is saved outside the repository)
- [x] T031 Tighten the prose of the v4.0.0.2 entry and its published release notes without changing its title, frontmatter, structure or facts (`.skilled/changelog/skilled/v4.0.0.2.md`) (evidence: the entry fell from 33,447 to 30,260 bytes and the release body from 32,927 to 29,741 characters. Every number and inline code term from the old entry is still present except a `GOAL_AUTHORING` comment note and one `assets/` folder name, both dropped on purpose. `validate_document.py` reports 0 issues and `hvr_scan.py` 0 hard blockers with a 100 ceiling. The frontmatter and title are byte-identical, so the trigger index needs no rebuild, and `gh release edit` left the title alone. The live body equals the new body. The old body is saved outside the repository)
- [x] T032 Rewrite the v4.0.0.2 entry in the new changelog style, where each section has one job and says each fact once, and republish its release notes (`.skilled/changelog/skilled/v4.0.0.2.md`) (evidence: the entry fell from 30,260 to 17,577 bytes and the release body from 29,740 to 17,057 characters. The opening went from 4 paragraphs to 2, the glance list from 12 bullets to 9, the subsections from 38 to 28 and the upgrade notes from 15 bullets and an intro line to 11 action bullets. Dropped: the research history with its packet number and phase count, the docs-and-scenarios housekeeping and upgrade notes that carried no action. Every number and inline code term in the new entry appears in the old one. The structure checker reports PASSED with 0 violations, where the old entry failed once on a packet number, `validate_document.py` reports 0 issues and `hvr_scan.py` 0 hard blockers with a 98 ceiling. The frontmatter and title are byte-identical, so the trigger index and the release title stay as they are. The live body equals the new body, v4.0.0.2 is still Latest and the tag was not touched. The old body is saved outside the repository)
- [x] T033 Re-annotate the `v4.0.0.2` tag so its message carries the release title, with the operator's approval (evidence: the old tag object `001e62dcbf` was saved outside the repository and hashes back to the same id. The new annotated tag `756b47843e` points at the same commit `68dd665c5d` with the same tagger and date, and its message is `v4.0.0.2: A Steadier Skill Advisor, Findable Changelogs and Leaner Goals`, the form the release step builds. Only that tag was force-pushed, origin reports the new object peeling to `68dd665c5d`, and the release stays published as Latest with its body unchanged)
<!-- /ANCHOR:phase-5 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---

## Verification Checklist

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md
- [x] CHK-002 [P0] Technical approach defined in plan.md
- [x] CHK-003 [P1] Dependencies identified and available
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes lint/format checks (evidence: 15 Python files parse, 10 Node files pass `node --check`, `hook-flags.sh` passes `bash -n` and `sh -n`, and shellcheck reports the same finding set as HEAD on both shell files. After the comment rule, the same checks pass on its 6 code files and shellcheck still reports HEAD's 5 findings on `hook-flags.sh`. After the review fixes, `bash -n` passes on the three changed shell scripts, `sh -n` on `hook-flags.sh`, `py_compile` on the dist checker, `node --check` on the reader test and `tsc --strict` on the sweep. shellcheck reports HEAD's set on `hook-flags.sh` and `progressive-validate.sh`, and one finding against HEAD's three on `quality-audit.sh`)
- [x] CHK-011 [P0] No console errors or warnings (evidence: with a switch off every validator prints what it printed at HEAD, and with one on the only new output is the one-line notice the spec asks for)
- [x] CHK-012 [P1] Error handling implemented (evidence: an unreadable or missing flags file yields no values, a missing `hook-flags.sh` warns and validates, and `validate.sh` still exits 3 on a missing folder)
- [x] CHK-013 [P1] Code follows project patterns (evidence: the sk-code drift guard reports nothing new in this work's files, and the two helpers carry the standard headers)
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met (evidence: `acceptance-criteria.md`, AC-001 to AC-014 Met)
- [x] CHK-021 [P0] Manual testing complete (evidence: the pre-commit repair command with the switch on, and the six symlinked shims in `sk-doc/scripts/` probed with the switch on, each exiting 0 with the notice)
- [x] CHK-022 [P1] Edge cases tested (evidence: environment `0`, empty and `skip` over a file set to `1`, quoted values, a BOM, CRLF endings, a missing file, `--help` and JSON requested three ways. The comment rule adds a comment after a bare value, after quotes and after a tab, `a#b`, `on#x` and a line holding only a comment after `=`. The review fixes add `o n` in the file and the environment, spaces and a tab around `on`, the shell reader's old absence marker over a file set to `1`, and a file that opens with a byte order mark)
- [x] CHK-023 [P1] Error scenarios validated (evidence: a missing folder exits 3 with the switch on, and a switch name built to inject a command is refused before `eval`)
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`. (evidence: the commit trap is `cross-consumer`, fixed at the producer, `validate.sh`. Of the review findings, P1-LUNA-002 and P2-LUNA-003 are `cross-consumer`, fixed in each consumer the report reaches. F001, P2-LUNA-001 and P2-LUNA-005 are `class-of-bug` across the four readers, fixed in every reader that differed. F002, F003 and F004 are `instance-only` doc gaps)
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep. (evidence: `rg -n 'SPECKIT_SKIP_VALIDATION|SPECKIT_VALIDATION\b' .skilled` found one reader with two exits, both now on one path. Every sk-doc validator that prints JSON gets its skip line from one helper. For the comment rule, `rg -l -L 'HOOK_FLAGS_CONFIG|hook-flags\.env'` over the code and every runtime folder found four readers that parse the file: `hook-flags.cjs`, `hook-flags.sh`, `validation_switch.py` and `check-dist-staleness.sh`. Each runtime's dist checker is a link to the last one. For the skipped report, `rg -l 'validate\.sh'` over the code found the consumers that turn its result into a pass count: `quality-audit.sh`, the freshness sweep and the progressive wrapper, all fixed, plus `upgrade-legacy.mjs`, recorded as a follow-up because it belongs to the upgrade tooling)
- [x] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests. (evidence: `plan.md` affected surfaces, including `audit_readmes.py`, which reads `valid`)
- [x] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases. (evidence: the parser parity test covers `NOEQ`, `=novalue`, `D=`, `E=a=b`, an unclosed quote and a repeated key, and the `hook_flag_on` test proves an injected name runs nothing. The cross-reader test in `hook-flags.test.cjs` holds all four readers to one table with comments after bare and quoted values, a tab, `a#b`, `on#x` and an empty value before a comment)
- [x] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed. (evidence: `plan.md` lists the axes. The rows run are 20 validators with the switch on, 8 source rows for the two controls, 6 for `validate.sh`, 3 exemptions and 1 safety gate)
- [x] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state. (evidence: each new test scrubs both switches and points `HOOK_FLAGS_CONFIG` at an absent file, and the suites ran the same way, so no local flags file can decide a result)
- [x] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range. (evidence: `4f4d25288c..396d26d4ff` on `main`: `b274f085fb` hooks, `3303e85a43` spec-kit, `396d26d4ff` sk-doc. The comment rule is `079d9cb31e..12c9351b5c`: `f5485b51d1` sk-code, `a0127c7a92` the sk-doc reader, `3ad952e58e` hooks and `12c9351b5c` the sk-doc test. Checked out one by one in a scratch clone, each of the four passes the hooks suite and the two sk-doc parser tests. The review fixes are `762044fae7` sk-code, `5f7eb1812f` hooks, `24243d3e17` spec-kit, `ecfd23483b` the sk-doc entry, `400c97f337` `.env.example` and `20f5477f5e` the release entry. Checked out in a scratch clone, the hooks suite passes 18 of 18 at the first and 20 of 20 at the second)
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets (evidence: the change reads two switch names and one file path, nothing else)
- [x] CHK-031 [P0] Input validation implemented (evidence: values match a fixed truthy set, the flags file is parsed as text and never sourced, and `hook_flag_on` accepts only a plain variable name)
- [x] CHK-032 [P1] Auth/authz working correctly (not applicable: local command-line tools with no auth surface)
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized (evidence: `spec.md` names the final validator set and the three exclusions)
- [x] CHK-041 [P1] Code comments adequate (evidence: the comment hygiene checker passes all 29 changed code files, and the 6 code files of the comment rule. It passes the 9 code files of the review fixes too)
- [x] CHK-042 [P2] README updated (if applicable) (evidence: `.skilled/hooks/README.md`, `.skilled/hooks/shared/README.md` and `sk-doc/shared/scripts/README.md`)
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only (evidence: all test output went to the session scratchpad, and the two manifests one dry run wrote at the repository root were removed)
- [x] CHK-051 [P1] scratch/ cleaned before completion (evidence: the packet's `scratch/` holds only `.gitkeep`)
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 13 | 13/13 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-09-28
<!-- /ANCHOR:summary -->

---
