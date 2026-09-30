---
title: "Implementation Summary: Doc validation off switches"
description: "Two local off switches for people who do not care whether their docs drift from the expected formats: SPECKIT_SKIP_VALIDATION no longer traps commits, and SKDOC_SKIP_VALIDATION turns off every sk-doc format validator. Both can be saved in hook-flags.env, and CI keeps enforcing."
trigger_phrases:
  - "doc validation off switches summary"
  - "skdoc skip validation shipped"
  - "spec validation commit trap fixed"
  - "validation switch evidence"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/062-doc-validation-off-switches"
    last_updated_at: "2026-09-28T20:03:09Z"
    last_updated_by: "generate-context"
    recent_action: "Re-annotated the v4.0.0.2 tag with the release title after the changelog restyle"
    next_safe_action: "Run a deep review of packet 061's changelog work, the review's deferred item"
    blockers: []
    key_files:
      - ".skilled/changelog/skilled/v4.0.0.2.md"
      - "specs/sk-doc/062-doc-validation-off-switches/tasks.md"
      - "specs/sk-doc/062-doc-validation-off-switches/implementation-summary.md"
      - "specs/sk-doc/062-doc-validation-off-switches/review/review-report.md"
    session_dedup:
      fingerprint: "sha256:ba19fdad89fa8d32cf51b72a2717d07cb1c2b5c13984adf5e99db4a2c41c6ff2"
      session_id: "75aab0e6-dcc7-401b-9d10-f48248374023"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary: Doc validation off switches

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 062-doc-validation-off-switches |
| **Completed** | 2026-09-28 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

If drift from this repository's formats is not your concern, you can now turn validation off once and keep working. `SPECKIT_SKIP_VALIDATION` covers spec folders and `SKDOC_SKIP_VALIDATION` covers every sk-doc format validator. You set them in the environment or save them in `.skilled/hooks/hook-flags.env`. CI keeps enforcing because it never sees either one.

### Doc validation off switches

The spec switch already existed, but it trapped commits. With it set, `validate.sh --json` printed nothing. The pre-commit metadata gate read the empty output as a broken report and refused every commit that staged a spec doc. `validate.sh` now checks the switch after it parses its arguments. When JSON was asked for, it prints a report marked `skipped: true` with one info entry and no errors, so the gate finds nothing to repair and lets the commit through. `SPECKIT_VALIDATION=false` takes the same path.

sk-doc had no off switch. `SKDOC_ENFORCE_STRUCTURE=0` relaxed three structure rules inside one validator. Now 13 Python and 7 Node validators call one small helper at their command-line entry. When the switch is on, the helper prints one line on stderr naming where it was set. It prints `{"skipped": true, "valid": true, ...}` if JSON was asked for, then exits 0 before any check runs. The environment wins over the file even when it holds `0` or nothing, so `=0` brings validation back for one run.

### Comments after a value

The docs say to copy `hook-flags.env.example` and uncomment the lines you want. Most of its lines carry a comment after the value, and every reader of the file kept that comment as part of the value. `SYSTEM_SKILL_ADVISOR_DISABLED=1  # why` read as `1  # why`, which is not a truthy value, so an uncommented line disabled nothing. The four readers now end a value at a `#` that follows a space or tab: `hook-flags.cjs`, `hook-flags.sh`, sk-doc's `validation_switch.py` and sk-code's `check-dist-staleness.sh`. A `#` with no space before it stays in the value, so `a#b` reads as `a#b`. One test holds all four readers to the same answers, and another uncomments every switch line of the example as it stands and finds each switch on.

### Review fixes

A two-model deep review on 2026-09-28 returned CONDITIONAL with one P1 and seven P2 findings, and every one is now fixed. The P1 was the progressive wrapper: under `--json` it merged `validate.sh`'s stderr into its stdout, so at level 1 the skip notice came first and the output did not parse. It now captures stdout alone and reports `skipped`. `quality-audit.sh` and the strict-pass freshness sweep counted a switched-off folder as a pass. Both now report it as skipped, and the sweep never lets a skipped baseline row turn a later failure into a known one.

The shell reader of `hook-flags.env` disagreed with the Node and Python readers three ways. It deleted spaces inside a value, so `o n` read as on. It compared the environment against a marker that one exact value could match, and it kept a byte order mark on the first name, as the dist checker did too. All four readers now trim only a value's edges, let any set environment value answer and drop the mark. `.env.example` names both switches, and the hooks README states the comment rule with its tab case. The unreleased v4.0.0.2 entry and three component changelogs now cover the switches.

### Release review

Before tagging v4.0.0.2, the operator asked for a review of its entry. It was accurate, but it left out five user-visible changes made since `v4.0.0.1`. One topic phrase also carried a version number, and its smaller items were spread over seven sections. The entry now covers the changelog history rewrite, the validator's `AGENTS.md` fix, the Hermes copy links, Grok 4.7 in Cursor and cli-jev's routing. It keeps its two identity phrases and two topic phrases, and it folds Deep Loops and Editing in Pi into one section with the new items. Packet 067 wrote into the same entry and records the review too. The release went out on 2026-09-28 as `v4.0.0.2`, tagged on `68dd665c5d` once every CI workflow had passed there.

The release step then showed two defects. It never wrote the full-changelog line the mode requires, and it built the tag message from the summary's first sentence. Both workflows now close the notes with that line and build the tag message from the tag and the editorial title. The operator then pointed out that the entry read as a goal release although the skill advisor changes mattered more, and that the searchable-changelog work was unclear. The entry now opens with the advisor, which has its own section, and a new Changelogs section says what each entry declares, how to look one up with and without `--triggers`, what the search reads and how the writers and the validator keep it true. The published release carries the same text and a new title. Its annotated tag message keeps the old title, since changing it means deleting and re-pushing the tag. A last pass then tightened the entry's prose without touching its title, structure or facts, and republished the release body to match. Once the changelog mode learned to choose content by reader impact and state each fact once, the operator asked for the entry in that style. The rewrite keeps the title, frontmatter and sections, cuts the entry by 42 percent and republishes the release body from it. The operator then approved fixing the tag, so `v4.0.0.2` was re-annotated on the same commit and date with the release title as its message.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/hooks/shared/hook-flags.sh` | Modified | `hook_flag_on <name>`, which refuses any name that is not a plain variable name, plus the comment rule |
| `.skilled/hooks/shared/hook-flags.cjs` | Modified | `isFlagOn(name, env?, config?)` with the precedence `isHookEnabled` uses, plus the comment rule |
| `.skilled/hooks/shared/hook-flags.test.cjs` | Modified | Tests for both, including an injected name that must run nothing, the comment rule in all four readers and an example line uncommented as it stands |
| `.skilled/skills/sk-code/sk-code-quality/scripts/check-dist-staleness.sh` | Modified | The comment rule in the dist checker's own reader of the file |
| `.skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh` | Modified | One skip path after parsing, the file as a second source, the skipped report and the help line |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/validate-skip-switch.vitest.ts` | Created | The switch in both output modes and from both sources |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/repair-derived.vitest.ts` | Modified | The commit trap as a regression test |
| `.skilled/skills/sk-doc/shared/scripts/validation_switch.py` | Created | The Python helper, which mirrors the hooks' file parser, comment rule included |
| `.skilled/skills/sk-doc/shared/scripts/validation-switch.cjs` | Created | The Node helper over `isFlagOn` |
| 13 Python and 7 Node validators under `.skilled/skills/sk-doc/` | Modified | A guard at each command-line entry, check modes only |
| `.skilled/skills/sk-doc/scripts/tests/test_validation_switch.py` | Created | The helpers, all 20 validators, two controls, the exemptions, the safety gate and every switch line of the example |
| Nine docs across spec-kit, sk-doc and the hooks folder, plus `hook-flags.env.example` | Modified | Both switches, how to save them and what stays on |
| `.skilled/skills/system-spec-kit/runtime/cli/spec/progressive-validate.sh` | Modified | Review fix: stdout captured apart from stderr under `--json`, and `skipped` in the report |
| `.skilled/skills/system-spec-kit/runtime/cli/spec/quality-audit.sh` | Modified | Review fix: a switched-off folder counted as skipped, in JSON and text output |
| `.skilled/skills/system-spec-kit/runtime/cli/sweep/strict-pass-freshness.ts` | Modified | Review fix: a `skipped` status, its count, and skipped baseline rows left out of the known set |
| Three spec-kit cli tests | Modified | The wrapper at level 1 and at the default level, the audit's skipped count and the sweep's skipped rows |
| `.skilled/hooks/shared/hook-flags.sh`, `check-dist-staleness.sh` and `hook-flags.test.cjs` | Modified | Review fix: edge-only trimming, a presence test and a dropped byte order mark, held by two new cross-reader tests |
| `.env.example`, `.skilled/hooks/README.md`, `ENV-REFERENCE.md`, the sweep README and the progressive validation catalog entry | Modified | Review fix: the switches named where users look, the tab case and the skipped status |
| `.skilled/changelog/skilled/v4.0.0.2.md` and three component changelogs | Modified and Created | Review fix: the release entry covers the switches. The three component versions and their Hermes copies move with their entries |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Every consumer of the `validate.sh` JSON and every caller of the sk-doc validators was traced before any edit. The trap was reproduced first. Both switches default to off, so nothing changes for anyone who sets neither. The suites ran with the flags file pointed at an absent path, so no local setting could decide a result. The work lands on `main` in owner-split commits: the hooks resolver, spec-kit, sk-doc and this packet. The comment rule came after close, when the operator approved it, in its own commits for the hooks, sk-doc and sk-code. The readers landed before the tests and the example that depend on them, so each commit passes the parser tests on its own.

The review fixes followed the review's own workstreams. Every new test ran against the unfixed code first and failed there: six of the 62 cli tests and two of the 20 reader tests. Then each fix turned its tests green, and every suite this work touches ran again beside the baseline taken before the fixes.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| One switch per family, saved in `hook-flags.env` | The operator chose it, and the hooks already resolve that file with the precedence people expect |
| Only `1`, `true`, `yes` or `on` turn a switch on | It matches every hook kill-switch. `SPECKIT_SKIP_VALIDATION` used to accept any non-empty value, so `0` or `false` in the environment now leaves validation on. Nothing in the repository set it |
| Fix the trap in `validate.sh`, not in the gate | The empty stdout was the defect, and every JSON caller gains from a report it can parse |
| A skipped report says `passed: true` and `skipped: true` | It keeps the orchestrator's shape, as a track root's report does, and `skipped` says outright that no rule ran |
| The create-diff report validator stays on | It proves a generated report is safe to open, with no script and no external reference. That is a safety check, not a format check |
| Writers and self-tests ignore the switch | `--fix`, `apply` and `--self-test` change files or test the tool, and neither judges a doc |
| A `#` after a space or tab ends a value, in all four readers | The example's lines carry a comment after the value, and the docs say to uncomment them as they stand. Asking for the space keeps a `#` inside a value such as `a#b`, and one rule everywhere keeps the readers in agreement |
| The progressive wrapper's auto-fix still runs under the switch | The switch turns off checks, never the tools that write, as REQ-004 already says for sk-doc |
| A skipped baseline row counts as unseen in the sweep | The row says nothing about the folder, so a failure after it is new, and its message says the baseline only recorded a skipped run |
| `quality-audit.sh` reads the JSON report in both output modes | Only the report says whether validation was switched off, and the exit code is the same either way |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Commit trap, the pre-commit command with the switch on | PASS, exit 0 from either source with nothing written. It exited 2 before the fix |
| Hooks resolver, `node --test hook-flags.test.cjs` | PASS, 18 of 18 with the comment rule, and reverting the rule in any one of the four readers fails the cross-reader test |
| Dist checker with `SYSTEM_DIST_FRESHNESS_DISABLED=1  # note` saved | PASS, 0 calls to its Node helper, against 1 for the control and 1 for the old parser |
| Git hook shell suites and the plugin tests that run the dist checker | PASS, 8 of 8 suites with 228 checks, plus 21 of 21 tests |
| `validate.sh` and the trap, vitest | PASS, 19 of 19. HEAD's `validate.sh` fails the 6 new tests |
| sk-doc script tests, as CI runs them | PASS, 26 files, again after the comment rule. CI runs the rename fixture test in its own workflow |
| Rename fixture test, in a private full clone of `4f4d25288c` plus this work | PASS, 4 tests. The shared checkout cannot host it while other sessions write there |
| Node suites beside the guarded validators | PASS, check-goal 14, template parity 4, three validators 1 each, frontmatter versions 23, root-name matrix 11 |
| Spec-kit runtime root suite | PASS, 107 files and 1281 tests, 13 skipped, the same as the baseline |
| Spec-kit cli project | PASS, 156 files and 1561 tests, 19 skipped |
| Docs | PASS, 9 docs valid with no new finding, and HVR findings the same as HEAD's. The enforced version `gate` reports ok=2951 |
| Comment hygiene, shellcheck and the sk-code drift guard | PASS on this work's files. The guard's 19 errors all sit in another packet's evidence scripts |
| Review fixes, red first | PASS. Against the unfixed code, 6 of the 62 tests in the three changed cli test files failed, and 2 of the 20 reader tests. With only the shell reader fixed, the byte order mark test still failed until the dist reader opened the file as `utf-8-sig` |
| Hooks resolver after the review fixes | PASS, 20 of 20 |
| Spec-kit cli project after the review fixes | PASS, 156 files and 1566 tests, 19 skipped, against 1561 tests in the baseline taken before the fixes. The 5 extra are the new tests |
| Spec-kit runtime root suite after the review fixes | PASS, 107 files and 1281 tests, 13 skipped, the same as the baseline |
| Git hook suites after the review fixes | PASS, all eight. commit-msg runs 19 checks and pre-commit 55, against 17 and 49 in the baseline, because the sibling phase 067 added its bypass checks. The other six match the baseline |
| sk-doc script tests after the review fixes | 129 passed and 1 failed, against 128 and 2 in the baseline. Both runs fail only the rename fixture test, which fails when the shared checkout changes during its run, and files there changed during both runs. This round changed no sk-doc code, and the private-clone row above is that test's evidence |
| Docs and changelogs after the review fixes | PASS. The release entry and the three component entries are valid with 0 HVR hard blockers, and every relative link in them and in the edited docs resolves |
| Comment hygiene, shellcheck and the drift guard after the review fixes | PASS on the 9 changed code files. shellcheck reports HEAD's set on `hook-flags.sh` and `progressive-validate.sh`, and one finding against HEAD's three on `quality-audit.sh`. The guard's 56 errors all sit in another packet's evidence folders |
| v4.0.0.2 entry after the release review | PASS. `validate_document.py` reports 0 issues and `hvr_scan.py` 0 hard blockers. Every link resolves, and the entry keeps 12 summary bullets. Its upgrade-note commands and paths exist, and each number traces to a commit message or to packet 060/012's measurements |
| v4.0.0.2 release | PASS. Ten of ten CI workflows passed on `68dd665c5d` before tagging. The annotated tag peels to that commit on origin, and the release is Latest, neither draft nor pre-release, with a body that matches the prepared notes character for character |
| Release step fix | PASS. Commit `a71cf79ef2`: applied to v4.0.0.2, the new rules reproduce the published body and tag subject exactly and the old rules do not |
| v4.0.0.2 entry after the rebalance | PASS. `validate_document.py` reports 0 issues and `hvr_scan.py` 0 hard blockers. The description is 217 characters, the longest subsection title is nine words, and the entry keeps 12 summary bullets and 5 opening paragraphs. The 34 semicolons are all `&nbsp;` spacers, and every inline path resolves or is a fragment of a path that does |
| Published release after the rebalance | PASS. The live body equals the entry without frontmatter and title plus the full-changelog line, 32,927 characters, and v4.0.0.2 is still Latest. The tag message keeps the old title |
| v4.0.0.2 entry and release after the concision pass | PASS. The entry is 30,260 bytes, down from 33,447, and the release body is 29,741 characters, down from 32,927. `validate_document.py` reports 0 issues and `hvr_scan.py` 0 hard blockers with a 100 ceiling. The frontmatter and title are unchanged, the live body equals the new body and v4.0.0.2 is still Latest |
| v4.0.0.2 entry and release in the new changelog style | PASS. The entry is 17,577 bytes, down from 30,260, and the release body is 17,057 characters, down from 29,740. The structure checker reports PASSED with 0 violations, `validate_document.py` 0 issues and `hvr_scan.py` 0 hard blockers with a 98 ceiling. Every number and inline code term traces to the old entry. The frontmatter and title are unchanged, the live body equals the new body and v4.0.0.2 is still Latest |
| v4.0.0.2 tag re-annotation | PASS. Origin's `v4.0.0.2` is the annotated tag `756b47843e`, which peels to `68dd665c5d` and keeps the original tagger and date. Its message reads `v4.0.0.2: A Steadier Skill Advisor, Findable Changelogs and Leaner Goals`. The release is still published as Latest, and its live body equals the new body |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **A saved switch also silences validators in local test runs.** The suites expect validators to run. Unset both switches, or point `HOOK_FLAGS_CONFIG` at an empty file, before running them. The notice names where the switch was set.
2. **A skip is no evidence.** A skipped `validate.sh` exits 0, so it cannot back a completion claim. The env reference says so.
3. **Dead doc-model bypass mentions remain.** `SPECKIT_SKIP_DOC_MODEL_VALIDATE` is still named in the git hook installer, its README and one test, though nothing reads it. That is a follow-up outside this packet.
4. **A value cannot hold a space or tab followed by `#`.** Every reader ends the value there, even inside quotes, so `NAME="x #y"` reads as `"x`. No switch needs such a value, since each is one word.
5. **The legacy upgrade tool still reads a skip as a pass.** `runtime/cli/spec/upgrade-legacy.mjs` trusts `report.passed === true` (lines 493 to 585), so with `SPECKIT_SKIP_VALIDATION` on it would count every packet as passing and repair none. It is the same class as the review's audit finding but belongs to the upgrade tooling, where the right answer, refusing to run or reporting the packets as unmeasured, is that tool's decision. A follow-up outside this packet.
<!-- /ANCHOR:limitations -->
