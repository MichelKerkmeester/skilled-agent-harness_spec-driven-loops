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
    last_updated_at: "2026-09-28T08:20:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Verified both switches, the commit trap fix and the suites"
    next_safe_action: "None, the packet is complete"
    blockers: []
    key_files:
      - ".skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh"
      - ".skilled/hooks/shared/hook-flags.sh"
      - ".skilled/hooks/shared/hook-flags.cjs"
      - ".skilled/skills/sk-doc/shared/scripts/validation_switch.py"
      - ".skilled/skills/sk-doc/shared/scripts/validation-switch.cjs"
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

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/hooks/shared/hook-flags.sh` | Modified | `hook_flag_on <name>`, which refuses any name that is not a plain variable name |
| `.skilled/hooks/shared/hook-flags.cjs` | Modified | `isFlagOn(name, env?, config?)` with the precedence `isHookEnabled` uses |
| `.skilled/hooks/shared/hook-flags.test.cjs` | Modified | Tests for both, including an injected name that must run nothing |
| `.skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh` | Modified | One skip path after parsing, the file as a second source, the skipped report and the help line |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/validate-skip-switch.vitest.ts` | Created | The switch in both output modes and from both sources |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/repair-derived.vitest.ts` | Modified | The commit trap as a regression test |
| `.skilled/skills/sk-doc/shared/scripts/validation_switch.py` | Created | The Python helper, which mirrors the hooks' file parser |
| `.skilled/skills/sk-doc/shared/scripts/validation-switch.cjs` | Created | The Node helper over `isFlagOn` |
| 13 Python and 7 Node validators under `.skilled/skills/sk-doc/` | Modified | A guard at each command-line entry, check modes only |
| `.skilled/skills/sk-doc/scripts/tests/test_validation_switch.py` | Created | The helpers, all 20 validators, two controls, the exemptions and the safety gate |
| Nine docs across spec-kit, sk-doc and the hooks folder, plus `hook-flags.env.example` | Modified | Both switches, how to save them and what stays on |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Every consumer of the `validate.sh` JSON and every caller of the sk-doc validators was traced before any edit. The trap was reproduced first. Both switches default to off, so nothing changes for anyone who sets neither. The suites ran with the flags file pointed at an absent path, so no local setting could decide a result. The work lands on `main` in owner-split commits: the hooks resolver, spec-kit, sk-doc and this packet.
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
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Commit trap, the pre-commit command with the switch on | PASS, exit 0 from either source with nothing written. It exited 2 before the fix |
| Hooks resolver, `node --test hook-flags.test.cjs` | PASS, 16 of 16 |
| `validate.sh` and the trap, vitest | PASS, 19 of 19. HEAD's `validate.sh` fails the 6 new tests |
| sk-doc script tests, as CI runs them | PASS, 26 files. CI runs the rename fixture test in its own workflow |
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
<!-- /ANCHOR:limitations -->
