---
title: "Implementation Summary"
description: "Open with a hook: what changed and why it matters. One paragraph, impact first."
trigger_phrases:
  - "manual testing scenarios implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-skilled-bots/003-openbot-parity-build/013-manual-testing-scenarios"
    last_updated_at: "2026-11-25T19:32:29Z"
    last_updated_by: "template-author"
    recent_action: "Initialized Level 2 template"
    next_safe_action: "Replace continuity placeholders"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-012-manual-testing-scenarios"
      parent_session_id: null
    completion_pct: 0
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
<!-- FILL: Fill the folder name, the completion date and the level. Use the real date. GOOD: `004-rotate-logs-keep`. Completed 2026-10-24. Level 1. WEAK: Folder: TBD. -->

| Field | Value |
|-------|-------|
| **Spec Folder** | 013-manual-testing-scenarios |
| **Completed** | 2026-11-26 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built
<!-- FILL: Open with the user-visible change in two sentences, then list each changed file. GOOD: `--keep 3` leaves three archives in `logs/archive`. A plain run leaves all ten. WEAK: Implemented the feature. -->

An operator can now drive every verb and record phases 001 to 011 deliver from a plain terminal, because the playbook gained 33 scenarios in ten new category folders. The corpus stands at 58 scenarios in 17 categories. The authoring half is done and the execution half is not: a dry run was taken before those phases landed, its 33 rows all read `SKIP`, and the real run is recorded after they close.

### Phase 12: manual-testing-scenarios

The nine conversation scenarios come first, because chat is the surface an operator meets before any other. Each is one bash block whose turns are numbered, so a reader follows the exchange in order rather than reading a runner's JSON. The remaining 24 scenarios cover routines, activity, the terminal screen, the working place, memory, apps, the vault, skills and channels.

Every scenario builds a throwaway world under `mktemp -d`, drives `.skilled/bin/bots.cjs` in it and removes the world in its last turn. No scenario reads a terminal, so the screen's refusal, its key handling and the `bots answer` write are each proved by a command an automated run can repeat. Every timing scenario computes its slot from the current clock, so no scenario names a future day that goes stale.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/system-skilled-bots/manual-testing-playbook/conversations/` | Created | Nine conversation scenarios, BOT-026 to BOT-034 |
| `.skilled/skills/system-skilled-bots/manual-testing-playbook/routines/` | Created | Five routine scenarios, BOT-035 to BOT-039 |
| `.skilled/skills/system-skilled-bots/manual-testing-playbook/activity/` | Created | Three activity scenarios, BOT-040 to BOT-042 |
| `.skilled/skills/system-skilled-bots/manual-testing-playbook/terminal-screen/` | Created | Three screen scenarios, BOT-043 to BOT-045 |
| `.skilled/skills/system-skilled-bots/manual-testing-playbook/working-place/` | Created | Two working-place scenarios, BOT-046 and BOT-047 |
| `.skilled/skills/system-skilled-bots/manual-testing-playbook/memory/` | Created | Three memory scenarios, BOT-048 to BOT-050 |
| `.skilled/skills/system-skilled-bots/manual-testing-playbook/apps/` | Created | Two apps scenarios, BOT-051 and BOT-052 |
| `.skilled/skills/system-skilled-bots/manual-testing-playbook/vault/` | Created | Three vault scenarios, BOT-053 to BOT-055 |
| `.skilled/skills/system-skilled-bots/manual-testing-playbook/skills/` | Created | Two skills scenarios, BOT-056 and BOT-057 |
| `.skilled/skills/system-skilled-bots/manual-testing-playbook/channels/` | Created | One channel scenario, BOT-058 |
| `.skilled/skills/system-skilled-bots/manual-testing-playbook/manual-testing-playbook.md` | Modified | Ten category sections, the renumbered cross-references and 33 catalog rows |
| `.skilled/skills/system-skilled-bots/benchmark/reports/2026-11-26--manual-testing-playbook--openbot-parity/` | Created | The recorded run, written by the recorder |
| `.skilled/skills/system-skilled-bots/benchmark/reports/README.md` | Modified | The run's row in the benchmark index |
| `design/` | Created | Six design notes: the scenario contract, the state machines, the sequences, the refusal catalogue, the fixtures and the mockups |
| `scratch/` | Created | The baseline, the verb and record map, the inventory, the four verdict files, the results file, the failure list and 33 transcripts |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered
<!-- FILL: Name the commands that proved it and the order they ran. GOOD: Ran `--keep 3` and a plain run, then the suite. All three passed. WEAK: Tested and shipped. -->

The package validator ran first and last, so the corpus was measured before the first file and after the last. It printed `scenarios=25 categories=7` at the start and `scenarios=58 categories=17 operator=52 routing_gold_excluded=6 violations=0 warnings=0` at the end.

A dry run of the 33 scenarios was then taken as far as the tree allows. Nine verbs and two fields the corpus drives belong to phases 001 to 011, which are built in parallel, so each scenario recorded `SKIP` with its blocker rather than a verdict about behavior it never observed. That run is a dry run and not this phase's evidence: T051 moves its folder aside because the recorder refuses an existing one, and the real run is recorded after wave 7 executes the corpus against a tree where those phases are closed.

The packet validator ran with `--strict` and printed `RESULT: PASSED`.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions
<!-- FILL: Write one decision per row. Give the reason, not the label. GOOD: Option over environment variable: one run can pick a different count without editing config. WEAK: Used the best approach. -->

| Decision | Why |
|----------|-----|
| One scenario per requirement cluster, not per requirement | 33 scenarios cover 58 requirements, because a cluster shares one world and one block, and a scenario per requirement would rebuild the same world three times to assert three lines |
| The nine conversation scenarios come first | Chat is the surface an operator meets before any other, and a reader who learns the block shape on a conversation reads the rest faster |
| Every timing scenario computes its slot at run time | A scenario that names a future day goes stale, and a stale scenario records a false `FAIL` against a phase that works |
| A scenario that cannot run records `SKIP` with its blocker | A `FAIL` is a claim about behavior the run observed, and a missing verb is not a wrong answer |
| The recorder is the one writer of the run folder | A hand-edited `results.csv` is a record with no provenance, and the recorder also writes the run's page and its index row |
| The channel scenarios run on the fake transport | A real account is an optional operator prerequisite, so a scenario that needs one records `SKIP` with the missing account rather than blocking the corpus |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification
<!-- FILL: Write one check per row with the exact output. GOOD: `ls logs/archive | wc -l` after `--keep 3`: 3. After a plain run: 10. Suite: PASSED. WEAK: All tests pass. -->

| Check | Result |
|-------|--------|
| Package validator | `PASS package=system-skilled-bots tier=FAIL_CLOSED scenarios=58 categories=17 operator=52 routing_gold_excluded=6 violations=0 warnings=0` |
| Section count per file | `rg -c '^## [1-5]\. '` prints 58 lines each holding `5` |
| Conversation turns | `rg -c '^### Turn [0-9]'` prints nine lines, the smallest holding `4` |
| Root index headings | `rg -c '^### BOT-0'` prints 58, and the scoped catalog count prints 58 |
| No tty | `rg -n 'isTTY|/dev/tty'` over the ten folders exits 1 |
| Temp world per file | `rg -c 'mktemp -d'` over the ten folders prints 33 lines each holding `1` or more |
| Contract re-check | Pending. T050 writes `scratch/contract-recheck.md` with one row per file before any scenario runs |
| Recorded run | Pending. The dry run's 33 `SKIP` rows are not this phase's evidence, and T051 moves that folder aside before the recorder writes the real one |
| Coverage | Pending, for the same reason |
| Packet validator | `validate.sh --strict` prints `RESULT: PASSED` |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations
<!-- FILL: Name one real limit and the workaround. GOOD: `--keep` deletes the older archives for good. Copy `logs/archive/` aside first when a run may cut too deep. WEAK: No limitations. -->

1. **The corpus is authored and not yet executed.** Phases 001 to 011 are built in parallel, so the nine verbs and the two fields the corpus drives are absent from the tree the dry run was taken on. Run the corpus once those phases land, and each row becomes a `PASS` or a `FAIL` about behavior rather than a blocker. AC-013 then refuses a `SKIP` whose reason is a missing verb or field.
2. **The scenario files were authored before the contracts were reconciled.** T050 re-checks all 33 files against `contracts/cli-json.md`, `contracts/refusals.md` and `design/refusal-catalogue.md` before execution, because a file that asserts a field name, a verb or a refusal form the contracts do not carry records a false `FAIL` against a correct product.
3. **BOT-058 reads its port from the transport source.** The Signal transport names no port in a frozen contract, so the scenario greps the port from `channel-signal.ts` at run time and records `SKIP` when the source names none. A frozen port constant would remove the guess.
4. **The feature catalog has no entry for the ten new categories.** The 33 new catalog rows carry a dash in the last column rather than a link to a near neighbour, so the catalog needs its own pass before those rows can point anywhere.
<!-- /ANCHOR:limitations -->

---


