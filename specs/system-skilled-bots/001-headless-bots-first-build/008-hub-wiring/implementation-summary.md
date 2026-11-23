---
title: "Implementation Summary"
description: "Hub, commands, doctor check, mirrors and compiled-route activation for system-skilled-bots, built through the create workflows. Both routing stages route all four modes."
trigger_phrases:
  - "hub wiring implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-skilled-bots/001-headless-bots-first-build/008-hub-wiring"
    last_updated_at: "2026-11-23T15:45:00Z"
    last_updated_by: "orchestrator"
    recent_action: "Q011-Q013 fixed review 4 P1; gates green"
    next_safe_action: "Run review 5, then commit on approval"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-008-hub-wiring"
      parent_session_id: null
    completion_pct: 95
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
| **Spec Folder** | 008-hub-wiring |
| **Completed** | Not yet. Every acceptance row is Met (2026-11-23); the packet stays In Progress until T001 closes, which waits on phase 002's weekday probe |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built
<!-- FILL: Open with the user-visible change in two sentences, then list each changed file. GOOD: `--keep 3` leaves three archives in `logs/archive`. A plain run leaves all ten. WEAK: Implemented the feature. -->

A request to author, run, schedule or check a bot now reaches `system-skilled-bots` at stage one and the right mode at stage two, where the hub serves from the compiled router. The hub, its four mode packets, the four `/bots:<mode>` commands and the read-only `/doctor:bots` check were produced by running `/create:skill-parent` and `/create:command`, and the runtime mirrors by the sync scripts.

### Phase 8: hub-wiring

`bots inbox` belongs to status and `bots answer` belongs to run. No file under the bots runtime folder changed.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/system-skilled-bots/` (`SKILL.md`, `README.md`, `ROUTER.md`, `mode-registry.json`, `hub-router.json`, `graph-metadata.json`, `description.json`, `leaf-manifest.json`, `changelog/`, `shared/`, `benchmark/`, `manual-testing-playbook/`) | Created by `/create:skill-parent` (update) | Hub identity, registry, routers and generated manifest. Root `ROUTER.md` promoted to `active` after the scaffold |
| `.skilled/skills/system-skilled-bots/bots-{author,run,schedule,status}/` | Created by `/create:skill-parent` | One packet per mode with `SKILL.md`, `ROUTER.md`, `README.md`, `changelog/` and `references/` |
| `.skilled/skills/system-skilled-bots/command-metadata.json` | Authored from the sk-doc template | One entry per `/bots:*` command; no workflow writes this file |
| `.skilled/commands/bots/{author,run,schedule,status}.md` and `assets/bots-<mode>-{auto.yaml,confirm.yaml,presentation.txt}` | Created by `/create:command` | One command set per mode |
| `.skilled/commands/doctor/bots.md`, `assets/doctor-bots-{auto.yaml,confirm.yaml,presentation.txt}` | Created by `/create:command` | Read-only definition check |
| `.skilled/commands/doctor/_routes.yaml` | Modified (shared) | `/doctor:bots` route, router count 17 to 18, post-workflow registration |
| `.skilled/commands/doctor/assets/doctor-setup-presentation.txt`, `.skilled/commands/README.txt` | Modified (shared) | `/doctor:bots` row and the bots command group, needed by the doctor catalog and setup-list tests |
| `.skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/scoring-compatibility.json` | Modified (shared) | Activates the `command-doctor-bots` bridge |
| `command-attach.ts`, `scorer/projection.ts`, `command-bridges.generated.json`, `skill_advisor.py` | Regenerated (shared) | Output of `derive-command-bridges.cjs` |
| `command-metadata-e2e.vitest.ts`, `skill-root-metadata-contract.test.cjs` | Modified (shared) | Command census 27 to 31, and the new root expected as class hub |
| `system-deep-loop/graph-metadata.json`, `system-skilled-doctor/graph-metadata.json` | Modified (shared) | Reverse edges the graph validator requires |
| `routing-accuracy/command-prompts.jsonl`, `command-routing-baseline.json` | Modified (shared) | 15 blind held-out rows for the five new commands, then the baseline recaptured |
| `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/011-system-skilled-bots/` and its authored source under `specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program/` | Created | Compiled engine, 20 canary cases, compiled artifacts |
| `013-live-activation/activation/system-skilled-bots/` (runtime and authored) | Created | Manifest serving `compiled`, fence at epoch 2, activation and flip records |
| `resolve.cjs`, `compiled-route.cjs` (runtime and authored), `serving-closure.manifest.json`, `compiled-route-guard.cjs`, `compiled-route-sync.cjs`, `compiled-routing-foundation.vitest.ts`, `compiled-routing-flag.ts` | Modified (shared) | Ninth hub in the default-on cohort and the serving closure |
| `frozen-scorer-pins.json` | Modified (shared) | Scorer re-frozen from the final state (operator decision Q006) |
| Authored `007-sk-doc/lib/registry-compiler.cjs` | Modified (out of scope, approved) | Brought in line with its runtime copy (operator decision Q007) |
| `README.md`, `.skilled/skills/README.txt` | Modified (shared) | Hub count, new hub row |
| `.claude/`, `.cursor/`, `.codex/`, `.pi/`, `.dsh/`, `.vibe/`, `.opencode/` bots and doctor-bots entries | Created by sync scripts | Runtime mirrors |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered
<!-- FILL: Name the commands that proved it and the order they ran. GOOD: Ran `--keep 3` and a plain run, then the suite. All three passed. WEAK: Tested and shipped. -->

A first build hand-wrote the hub and commands after reading the two workflows, which broke the workflow-only rule. The operator chose a redo (Q001). The hand-built files were moved out of the repository, and a @markdown agent ran `/create:skill-parent` and then `/create:command` five times, step by step, logging every step id (`scratch/workflow-run-log.txt`). A generic worker had first stopped at the workflow's Phase 0, which requires @markdown.

After the workflows: `command-metadata.json` was authored from its template, the bridges were regenerated, and the mirrors were synced. A separate agent built the compiled engine, canaries and activation, following commit `6a5e1048ea5` (Q002), after the operator approved the scorer re-freeze (Q006) and the sk-doc authored-copy repair (Q007). A blind agent that saw only the five command descriptions wrote the held-out corpus rows (Q003). Every gate was then rerun from the final state.

Deviations, each recorded rather than absorbed:

1. The operation resolved to `update`, because the skill root already held `runtime/`, `scripts/` and `assets/`, and the YAML refuses `create` on an existing folder.
2. `command-metadata.json` is authored, not workflow output: the canon calls it an authored companion. A workflow amendment is proposed in Known Limitations.
3. The doctor command came out as the split set `doctor-bots-{auto,confirm}.yaml` and `doctor-bots-presentation.txt`, not the single `doctor-bots-check.yaml` first planned. The spec's file table was amended.
4. Six shared hunks from the first build were reapplied, each because a named gate failed without it (`scratch/workflow-run-log.txt`).
5. The command-routing baseline was recaptured twice. The first capture ran before the `/doctor:bots` compatibility rows and drifted, so the second, final-state capture is the baseline of record. No vocabulary changed between the two.
6. The scorer was re-frozen twice: once before activation, and once after the last bridge regeneration changed `projection.ts`.
7. The activation ran in the order the tools allow (registration and engine copy, admission, activate, flip, sync build), not the order first planned (`scratch/activation-log.txt`).
8. The first review returned REQUESTED_CHANGES (P1: admission passed with no gold; P1: packet claimed Complete while T001 is blocked). The fix round added playbook gold, widened the run and schedule phrasing, corrected the resolver comment, set the packet back to In Progress and corrected stale ADR and spec text (`scratch/review-fix-log.txt`).
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions
<!-- FILL: Write one decision per row. Give the reason, not the label. GOOD: Option over environment variable: one run can pick a different count without editing config. WEAK: Used the best approach. -->

| Decision | Why |
|----------|-----|
| Four metadata modes, inbox on status and answer on run | The two verbs read and continue the same records those modes own, so a fifth mode would split one surface |
| Five aliases and phrases kept out of the hub (`run bot now`, `install the bot schedule`, `uninstall the bot schedule`, `check the bot definition`, `bot now`) | With them, the hub topped doctor prompts in the advisor's own slice |
| Stage-two phrases added during activation and the review fix (`run the nightly-digest bot`, `bot's needs-you`, `status of my bots`, `run my nightly bot`, `run the nightly bot`, `kick off the nightly-digest bot`, `pause the nightly-digest bot`, `schedule for the nightly-digest bot`) | Without them the gate prompts and common run and schedule phrasings got no mode. A first `bot by hand` phrase was replaced, because its token `hand` sent `hand off to QA` to the hub . After review 2, `needs-you question` was replaced because its token `question` sent `answer this question` to the hub. Its first replacement, `answer the open needs-you`, and the status keyword `open needs-you items` both carried `open`, which sent `answer the open question` to the hub, so after review 3 both were dropped and run took `bot's needs-you` with a reworded gold prompt. After review 4, `launchd schedule` was dropped because it sent non-bot launchd prompts to schedule, and the schedule gold prompt was reworded to name the bot the existing keyword matches (ADR-002 amendments, operator answers Q008 to Q013) |
| Eight gold scenarios in the hub playbook | Admission's coverage floor applies only to a hub not yet in the cohort; the review found the hub live with no gold, so gold now covers every mode and two negatives |
| Blind rows recorded as they score | Tuning vocabulary to pass held-out rows would make them tune rows. The four `/bots:*` rows miss because their bridges are not active yet |
| One command per mode (ADR-003) and a doctor check (ADR-004) | Built as proposed. Both name the operator as decider, so they stay Proposed until confirmed |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification
<!-- FILL: Write one check per row with the exact output. GOOD: `ls logs/archive | wc -l` after `--keep 3`: 3. After a plain run: 10. Suite: PASSED. WEAK: All tests pass. -->

| Check | Result |
|-------|--------|
| Per-hub gate `parent-skill-check.cjs .skilled/skills/system-skilled-bots` | `INFO: Parent skill: .skilled/skills/system-skilled-bots`, `PASS: 10b-byte-drift`, `OK`, exit 0 (`specs/system-skilled-bots/001-headless-bots-first-build/008-hub-wiring/scratch/parent-skill-check-final.txt:66`) |
| Stage one, four modes plus inbox and answer | Hub first at 0.929, 0.896, 0.95, 0.896, 0.855 and 0.91 (`specs/system-skilled-bots/001-headless-bots-first-build/008-hub-wiring/scratch/stage-one-final.jsonl:1`) |
| Stage two, compiled front door | Manifest `compiled`; author, run, schedule, status, status and run, one target each (`specs/system-skilled-bots/001-headless-bots-first-build/008-hub-wiring/scratch/stage-two-after-review-fix.jsonl:1`) |
| Out-of-domain probes | Stage two defers on all six (`specs/system-skilled-bots/001-headless-bots-first-build/008-hub-wiring/scratch/stage-two-after-review-fix.jsonl:12`). Stage one: see AC-008 and Known Limitations |
| Compiled-routing gates | Foundation vitest 37/37, guard 9 hubs fresh, `sync --check` `all 67 served copies match`, canary build 20 cases, compiled-route tests 117/117 (`specs/system-skilled-bots/001-headless-bots-first-build/008-hub-wiring/scratch/activation-log.txt:1`). Guard and sync rerun after the final re-freeze: both exit 0 |
| Bridges | `derive-command-bridges.cjs --check` exit 0, `"changed": []` (`specs/system-skilled-bots/001-headless-bots-first-build/008-hub-wiring/scratch/bridge-check-redo.txt:1`) |
| Mirrors | Every sync `--check` exit 0, parity `PASS: 271 mirrors across 10 trees are in sync.` (`specs/system-skilled-bots/001-headless-bots-first-build/008-hub-wiring/scratch/mirrors-redo.txt:312`) |
| Advisor suite, final state | `Test Files 178 passed (178)`, `Tests 2474 passed \| 4 skipped (2478)`, exit 0. Rerun after the review 4 fix. Before this phase's fixes: 2 failed, 2472 passed (`specs/system-skilled-bots/001-headless-bots-first-build/008-hub-wiring/scratch/advisor-suite-fix6.txt:1`) |
| Doctor script tests, final state | `tests 1674`, `pass 1674`, `fail 0`, exit 0, rerun after the review 4 fix (`specs/system-skilled-bots/001-headless-bots-first-build/008-hub-wiring/scratch/doctor-suite-fix6.txt:1`) |
| sk-doc root metadata contract test | 1 pass, 0 fail |
| Staged re-pin | `RESULT: STAGED`; `bots/` diffs empty; run folder survived; `needs-reinstall` with `pin-changed` once the staged tree takes the copy's path (`specs/system-skilled-bots/001-headless-bots-first-build/008-hub-wiring/scratch/repin-proof-final.txt:61`) |
| Runtime untouched | Diff stat and status over the runtime folder print nothing (`specs/system-skilled-bots/001-headless-bots-first-build/008-hub-wiring/scratch/d4-final.txt:1`) |
| Runtime suite and typecheck | `Tests 355 passed (355)`, vitest exit 0; typecheck exit 0 |
| Main checkout | `git status --short` prints only ` M .pi/settings.json` before and after every workflow run |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations
<!-- FILL: Name one real limit and the workaround. GOOD: `--keep` deletes the older archives for good. Copy `logs/archive/` aside first when a run may cut too deep. WEAK: No limitations. -->

1. **`show me ...` prompts miss at stage one.** The scorer caps a match with no intent booster at 0.25 confidence, so `show me the status of my bots and their last runs` gets no recommendation; `what is the status of my bots ...` gets 0.896. Other hubs pass the cap through hub-id boosters in the scorer. Adding one for this hub is a scorer change and needs another re-freeze, so it is left to the operator.
2. **`update skilled now` ties three hubs at 0.82.** The bots hub, the doctor hub and sk-git all score 0.82, and the bots hub sorts first on raw score (0.1113 against 0.1091), because both hub ids share the token `skilled` and the bots derived block is newer. `is my skilled install healthy` still goes to the doctor. A fix is a scorer change, left to the operator.
3. **The four `/bots:*` advisor bridges are inactive.** Their blind rows score 0 at top 1 in the routing slice; `/doctor:bots` reaches top 1. Activating them in `scoring-compatibility.json` and adding the bots family to `command-contract.json` is a follow-up.
4. **Two-mode prompts defer.** `schedule this bot and show its status` defers at stage two rather than bundling schedule and status, as `ROUTER.md` describes. The canary pins the actual behaviour.
5. **Stage-two phrases name example bots.** The router matches contiguous text, and every hub phrase contains `bot` except `answer a needs-you`, so `run my nightly bot` routes but `pause the weekly-cleanup bot` defers. Wider coverage needs bot-anchored phrasing that does not pull generic tokens such as `hand` into the advisor's lexical lane. The match also runs inside longer words, so `the robot needs you` and `list my chatbot runs` route to status and `answer dependabot's needs-you question` routes to run at stage two. Stage one gives none of them a forced load (0.618 at most), so they misroute only once the hub is already loaded. `answer a needs-you form for HR` is captured at both stages (0.852, then run) through `answer a needs-you`, the one phrase without `bot`. These were found in review 5 and are recorded, not fixed.
6. **Non-bot `launchd` prompts lead at stage one.** `set up a launchd schedule`, `install a launchd schedule for my backup script`, `write a launchd plist` and `pause the launchd agent` rank the hub first at 0.82 to 0.85, partly through the bare keyword `launchd` in the hub `SKILL.md` Keywords comment. With that keyword stripped, `pause the launchd agent` still scored 0.82 (`specs/system-skilled-bots/001-headless-bots-first-build/008-hub-wiring/scratch/fix5-log.txt:115`), so another source contributes, likely the `launchd` domain and the `launchd schedule` key topic in `graph-metadata.json` (inferred, not stripped). Other examples review 5 found include `my launchd daemon keeps crashing` and `configure a launchd job to rotate logs`. Stage two defers on all of them (`specs/system-skilled-bots/001-headless-bots-first-build/008-hub-wiring/scratch/stage-two-fix6.jsonl:25`), and no other skill owns launchd. The keyword stays because removing it dropped an in-domain blind corpus row below the 0.8 bar and failed the advisor routing slice (operator answer Q013). The bare `needs-you` keyword was removed, and the `needs you` capture it caused is gone (`specs/system-skilled-bots/001-headless-bots-first-build/008-hub-wiring/scratch/stage-one-fix6.txt:18`).
7. **Proposed workflow amendment, not applied.** `create-skill-parent-auto.yaml` should fill `command-metadata.json` from its template when the hub owns commands, and its presentation should not default to "hub owns no slash commands". Its `update` output scope also omits the packet README, ROUTER and changelog, the hub playbook, benchmark and `shared/README.md`.
8. **Precondition.** T001 stays blocked until phase 002's weekday probe closes its rows.
<!-- /ANCHOR:limitations -->

---
