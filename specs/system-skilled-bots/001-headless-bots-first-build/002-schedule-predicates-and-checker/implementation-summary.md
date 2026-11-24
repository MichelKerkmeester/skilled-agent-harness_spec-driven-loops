---
title: "Implementation Summary"
description: "Translator, label grammar, slot lister and definition checker built and tested. The weekday probe fired only on its weekday, so a lone day field is emitted and the phase is closed."
trigger_phrases:
  - "schedule predicates and checker implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-skilled-bots/001-headless-bots-first-build/002-schedule-predicates-and-checker"
    last_updated_at: "2026-11-24T11:18:08Z"
    last_updated_by: "generate-context"
    recent_action: "Recorded the weekday probe and set the day rule to emit"
    next_safe_action: "None: the phase is complete"
    packet_purpose: "Purpose: Every cron string either becomes calendar entries that fire as cron would or is refused with a named reason, and every `BOT.md` is checked by one script that imports the same predicates the installer will use."
    blockers: []
    key_files:
      - ".skilled/skills/system-skilled-bots/runtime/lib/cron-translator.ts"
      - ".skilled/skills/system-skilled-bots/runtime/tests/cron-translator.vitest.ts"
      - "specs/system-skilled-bots/001-headless-bots-first-build/002-schedule-predicates-and-checker/scratch/probe-result.txt"
    session_dedup:
      fingerprint: "sha256:c4340e581d57513d0cdaf711447fd6b184ad55169b5607bc7d799d20d0ca1734"
      session_id: "scaffold-002-schedule-predicates-and-checker"
      parent_session_id: null
    session_ref:
      runtime: "claude"
      sessionId: "335d5a41-9d36-45cb-8bae-6e6010fef894"
      workspace: "/Users/michelkerkmeester/worktrees/public/system-skilled-bots"
      savedAt: "2026-11-24T11:18:08Z"
      locatorKind: "transcript_path"
      version: 1
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 002-schedule-predicates-and-checker |
| **Completed** | 2026-11-24. Code built 2026-11-22, weekday probe observed 2026-11-23 and 2026-11-24 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A cron string now either becomes launchd calendar dictionaries that fire as cron would or is refused with a named id. `bot-check.cjs` fails a bad `BOT.md` before anything installs it. The checker imports the same parser, config reader, identity resolver, executor bounds, translator and label grammar that later code uses, so it restates no rule.

### Phase 2: schedule-predicates-and-checker

- **Translator** (`cron-translator.ts`). Expands star, list, range, step and the macros. Maps weekday `7` to `0` and keeps both day fields in one dictionary when cron reads them as OR. Emits every minute as `StartInterval 60`. Refuses past a cap of 128 dictionaries and names the would-be count. Every refusal id is in one exported list, `CRON_REFUSALS`.
- **Label grammar** (`label.ts`). Builds and parses the bot form and the drain form. Reserves the bot id `drain`. Encodes the identity into a dot-free slug that decodes exactly.
- **Slot lister** (`slot-lister.ts`). Reads only translator output. Uses local wall-clock time, drops a time inside a spring-forward gap and lists a repeated time once.
- **Checker** (`bot-check.cjs`). Reads `bots/<id>/BOT.md` under a checkout and prints one `PASS|FAIL|WARN|INFO: <id>: <message>` line per finding. Exits 0, 1 or 2. `--strict` turns the one advisory finding, `folder-id-mismatch`, into a failure.

Weekday probe result: a lone `Weekday` key fires only on its weekday. The probe, set to Weekday 1 at 12:00, fired on Monday 2026-11-23 at 12:00:04 and did not fire on Tuesday 2026-11-24, with the host awake through both slots (`scratch/probe-result.txt`). The translator therefore emits a lone `Weekday` or `Day` key, so `0 9 * * 1-5` becomes five dictionaries.

No handoff to phase 1 is needed: the worked example `0 9 * * 1-5` translates as written.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/system-skilled-bots/runtime/lib/cron-translator.ts` | Create | Cron to calendar dictionaries, `StartInterval 60`, or a refusal by id |
| `.skilled/skills/system-skilled-bots/runtime/lib/label.ts` | Create | Bot and drain labels, the identity slug, the reserved id |
| `.skilled/skills/system-skilled-bots/runtime/lib/slot-lister.ts` | Create | Slots between two instants from the translator's output |
| `.skilled/skills/system-skilled-bots/runtime/lib/definition.ts` | Modify (additive) | Exports `BOT_ID_PATTERN` and adds `checkExecutorBounds`, which reads the executor kinds and timeout bound from the deep-loop executor schema. `parseDefinition` is unchanged |
| `.skilled/skills/system-skilled-bots/scripts/bot-check.cjs` | Create | The definition checker |
| `.skilled/skills/system-skilled-bots/scripts/fixtures/` | Create | `clean` plus 13 one-defect fixtures, one per hard invariant |
| `.skilled/skills/system-skilled-bots/runtime/tests/{cron-translator,label,slot-lister,bot-check}.vitest.ts` | Create | 53 tests |
| `.skilled/skills/system-skilled-bots/runtime/tests/definition.vitest.ts` | Modify (additive) | 2 tests for `checkExecutorBounds`, the bound read from the executor schema |
| `scratch/com.skilled.probe.weekday.plist`, `scratch/probe-weekday.sh` | Create | The probe, run from 2026-11-22 to 2026-11-24 and removed |
| `scratch/probe-result.txt` | Create | The probe's status output, fire log, wake check and removal |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The work followed `/speckit:implement` in autonomous mode in the worktree on branch `system-skilled-bots`. The review and save steps were left to the orchestrator. Phase 3 was being built in the same worktree at the same time. This phase touched only its own files and made one additive edit to `definition.ts`.

Proof, in the order it ran:
1. Baseline suite before any change: 6 files, 56 tests passed.
2. Wrote the translator, label grammar, lister and checker, then the four test files. Suite over this phase's and the contract files: 10 files, 111 tests passed. `npm run typecheck` exit 0.
3. Mutation checks, each restored afterwards. Dropping the spring-forward gap rule failed 2 lister tests. Turning the AND refusal off failed 1 translator test. Making the either-match rule AND failed 2 lister tests. Passing `identity-missing` instead of failing it failed 2 checker tests.
4. Ran the CLI over every fixture. Clean exits 0. Each defect exits 1 with its id on a `FAIL:` line. A missing path exits 2.
5. Ran the grep gates and the `git status` hash check (see Verification).
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| A lone day field is emitted alone (ADR-001, Accepted 2026-11-24) | It was refused until the probe ran, because a wrong emit could fire an unattended bot every day. The probe fired only on its weekday, so the constant and its test flipped to emit |
| [DEVIATION: the plan says install the probe on day one] The probe was loaded on 2026-11-22 after the code was built | The orchestrator barred loading any launchd agent until the operator said yes |
| Refuse a day-field pair that cron reads as AND (`cron-day-fields-and`) | Cron needs both day fields to match when either starts with `*`. launchd's two-key rule is either-match, so this form has no exact translation |
| Cap of 128 dictionaries (ADR-002, Accepted) | Covers the 48 and 96 forms and names the count when it refuses |
| Local wall clock: drop gap times, keep the first occurrence of a repeated time (ADR-003, Accepted) | The lister feeds accounting, so it never invents or doubles a slot |
| [DEVIATION: the task listed ten defect fixtures] 13 fixtures | Reserved id, undeclared isolation and invalid identity are hard invariants too, and each needs its own defect fixture |
| [DEVIATION: phase 1 had no executor-kind or timeout-bound predicate] Added `checkExecutorBounds` to `definition.ts` | The checker must fail an unknown executor kind and a timeout past the executor's bound without restating either. Parsing stays shape-only, so the runner is unaffected |
| The checker loads the TypeScript runtime through the runtime's own `tsx` `tsImport` | The `.cjs` script and the vitest suite then run the same modules, and no build step is needed |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `npx vitest run --no-coverage` over this phase's and the contract files | 10 files, 111 tests passed (baseline 56). A full-suite run also picked up another builder's in-progress `runner.vitest.ts`, which had 2 to 4 failures that this phase does not touch |
| `npm run typecheck` | exit 0 |
| `node --check scripts/bot-check.cjs` | exit 0 |
| Clean fixture | 7 `PASS:` lines, exit 0 |
| 13 defect fixtures | 12 exit 1 in this checkout, each with its id on a `FAIL:` line. `no-identity` exits 0 here, because the worktree's own origin supplies the identity. In a remote-less repository it exits 1 with `FAIL: identity-missing:`, shown by the test and by a hand run under `env -i` |
| `rg -n 'cli-opencode\|3600\|@reboot' scripts/bot-check.cjs` | no match, exit 1 |
| `rg -n 'launchctl bootstrap' .skilled/skills/system-skilled-bots` | no match, exit 1 |
| `git status --porcelain` hash of the skill before and after checking all fixtures | identical |
| `ls ~/Library/LaunchAgents \| rg com.skilled.probe` after `probe-weekday.sh remove` | no match, exit 1. `launchctl print` for the label exits 113 |
| Weekday probe, 2026-11-22 to 2026-11-24 | One fire, Monday 12:00:04, none on Tuesday with the host awake (`scratch/probe-result.txt`) |
| `npm test` and `npm run typecheck` after the flip to emit | 35 files, 372 tests passed. Typecheck exit 0 |
| `plutil -lint` on the probe plist with Weekday 1, `bash -n` on the script | `OK`, exit 0. Both exit 0 |
| Acceptance criteria | Every row Met |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **A lone `Day` key is inferred, not observed.** The probe tested a lone `Weekday` only. `0 0 1 * *`, `@monthly` and `@yearly` take the same rule because launchd's one wildcard sentence covers both keys.
2. **One week observed.** The probe saw one matching and one non-matching day. It did not test every weekday or a host that sleeps through the slot.
3. **launchd at a daylight-saving change is unverified.** The lister's rule is tested only against its own fixture under `TZ=Europe/Amsterdam`.
4. **No body-secret invariant.** It waits for the runner's secret detector and is not duplicated here.
5. **Bot layout is this phase's choice.** The checker reads `bots/<id>/BOT.md`. The runner's lookup by id must agree, and neither spec states the layout.
<!-- /ANCHOR:limitations -->

---
