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
    last_updated_at: "2026-09-28T11:08:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Made every reader of hook-flags.env drop a comment after a value"
    next_safe_action: "None, the packet is complete"
    blockers: []
    key_files:
      - ".skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh"
      - ".skilled/hooks/shared/hook-flags.sh"
      - ".skilled/hooks/shared/hook-flags.cjs"
      - ".skilled/skills/sk-doc/shared/scripts/validation_switch.py"
      - ".skilled/skills/sk-doc/shared/scripts/validation-switch.cjs"
      - ".skilled/skills/sk-code/sk-code-quality/scripts/check-dist-staleness.sh"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
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
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Every consumer of the `validate.sh` JSON and every caller of the sk-doc validators was traced before any edit. The trap was reproduced first. Both switches default to off, so nothing changes for anyone who sets neither. The suites ran with the flags file pointed at an absent path, so no local setting could decide a result. The work lands on `main` in owner-split commits: the hooks resolver, spec-kit, sk-doc and this packet. The comment rule came after close, when the operator approved it, in its own commits for the hooks, sk-doc and sk-code. The readers landed before the tests and the example that depend on them, so each commit passes the parser tests on its own.
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
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **A saved switch also silences validators in local test runs.** The suites expect validators to run. Unset both switches, or point `HOOK_FLAGS_CONFIG` at an empty file, before running them. The notice names where the switch was set.
2. **A skip is no evidence.** A skipped `validate.sh` exits 0, so it cannot back a completion claim. The env reference says so.
3. **Dead doc-model bypass mentions remain.** `SPECKIT_SKIP_DOC_MODEL_VALIDATE` is still named in the git hook installer, its README and one test, though nothing reads it. That is a follow-up outside this packet.
4. **A value cannot hold a space or tab followed by `#`.** Every reader ends the value there, even inside quotes, so `NAME="x #y"` reads as `"x`. No switch needs such a value, since each is one word.
5. **Two readers keep a byte order mark.** `hook-flags.cjs` and `validation_switch.py` drop a byte order mark at the start of the file, while `hook-flags.sh` and `check-dist-staleness.sh` keep it on the first name. A switch saved on the first line of a file written with one therefore counts in two readers only. This predates this packet, and it is a follow-up outside it.
<!-- /ANCHOR:limitations -->
