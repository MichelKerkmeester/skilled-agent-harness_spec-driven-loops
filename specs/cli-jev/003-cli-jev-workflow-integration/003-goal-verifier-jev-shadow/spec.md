---
title: "Feature Specification: Goal Verifier Pi Census, Zero-Call Arms and Opt-In Jev Shadow Mode"
description: "Count the goal verifier's recorded use in Pi, give it its first measured error rates from three zero-call arms on a labeled set and test a free fix for the evidence clamp. A gated choice arm on Deem or Jev and a shadow mode that names its backend follow only past a gate fixed before the build."
trigger_phrases:
  - "goal verifier jev shadow"
  - "goal verifier labeled set"
  - "opencode goal verifier accuracy"
  - "jev shadow verifier mode"
  - "verifier keep threshold"
  - "pi goal verify nudge census"
  - "verifier tail-window arm"
  - "goal verifier deem shadow"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Goal Verifier Pi Census, Zero-Call Arms and Opt-In Jev Shadow Mode

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Planned |
| **Created** | 2026-09-26 |
| **Amended** | 2026-09-27, from the final synthesis, section 13. Again on 2026-09-27, for two backends, from round 3's synthesis, section 14. On 2026-09-28, for the wave 3 directive: the label gate and the Pi session source (parent D4), who builds (D5) and the skill docs (D6) |
| **Branch** | `worktrees/069-cli-jev-workflow-integration` |
| **Parent Spec** | ../spec.md |
| **Phase** | 3 of 9 |
| **Predecessor** | 002-advisor-jev-tiebreak-arm |
| **Successor** | 004-deep-research-expansion |
| **Handoff Criteria** | The phase closes at the label gate (parent D4). By then the Pi census has run on `~/.pi/agent/sessions` and printed its method and totals, the fixture builder has written unlabeled rows for the operator and the scorer's tests pass on a synthetic fixture. Everything after that waits for the operator's labels and is not part of this phase's completion: the zero-call report prints three arms on identical rows and either a stop line or a gate line. Past the gate, the model arm's report states keep or drop against REQ-006 for its backend. On a stop or a drop the plugin stays untouched. On keep, the shadow mode for the backend that kept passes REQ-010 and REQ-011 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 3** of the cli-jev workflow integration specification. It was first planned from recommendation R2 in `../001-deep-research/research/research.md`. On 2026-09-27 it was amended to the final synthesis, `../004-deep-research-expansion/research/research.md`, section 11 "R2" and section 13 "003-goal-verifier-jev-shadow". That record ranks R2 third: next for the zero-call slice, later for the Jev arm and the plugin mode. It also carries R4's optional claims column. A second amendment the same day, from round 3's synthesis, `../007-classifier-deep-research/research/research.md` section 14 "003-goal-verifier-jev-shadow" and R2 in section 12, adds Deem as a second backend. Deem is preferred for the model arm and the shadow mode, because the payload is the operator's own conversation and Deem keeps it on the machine. The zero-call slices do not change.

**Wave 3 amendment (2026-09-28).** The operator released this phase, fifth in the build order 008, 016, 002, 017, 003 (parent D3). Parent D4 stops it at its label gate. No model writes a label, and the build delivers everything up to the point where the operator labels. The labeling is not part of this phase's completion. The census and the builder's Pi rows read `~/.pi/agent/sessions`, which the operator chose. Parent D5 names who builds (`plan.md` section 4), and D6 adds the goal hooks READMEs and, on keep, the goal plugin's skill docs to the file list. D1 needed no change, because REQ-003 and REQ-011 already hold both backends' gates, and with neither backend available everything behaves as today.

**Why the amendment.** Pi already runs the goal verifier. Every Pi turn that is not `met` sends a hidden `goal-verify-nudge` custom message, which Pi records in the session file (`.skilled/hooks/goal/pi/goal-context.ts:233-259`, the nudge at `:245-253`). Since `e7c88670fb` (2026-09-27) Pi holds that nudge until the next user prompt and writes it only then, so a nudge still pending when a session ends never reaches the file (section 6). The final synthesis counted 1,457 of them in 28 sessions of this repository, dated 2026-07-29 to 2026-08-10. A raw string count on 2026-09-27 found 1,616 `"customType":"goal-verify-nudge"` matches in 37 session files under `~/.pi/agent/sessions/--Users-michelkerkmeester-MEGA-Development-Code_Environment-Public--/`. The two figures agree on magnitude. They differ on counting method and date window, so the census pins and prints both.

**Scope Boundary**: Three slices, in order. Slice 0 is the Pi census. Slice 1 is a labeled set and one offline scorer with three zero-call arms, then a model arm built only past REQ-014's gate, behind `--deem` (proposed) or `--jev` and its backend's check. Slice 2 is a shadow value for the existing `OPENCODE_GOAL_VERIFIER` switch, `deem` or `jev` (proposed), in scope only on that arm's keep. In that mode the heuristic's verdict stays the only one that acts.

**Dependencies**:
- **The operator writes the labels.** The fixture builder assembles 30 to 50 rows. Claude rows arrive pre-labeled from native `goal_status` records, and the operator adjudicates the rows where that pre-label and the heuristic disagree and spot-checks about 10 agreements. Pi rows carry the recorded nudge verdict as their heuristic column and need an operator label. The operator strips secrets before any Jev call. No agent or model labels a row (parent D4), and the phase stops at this label gate: the build writes the unlabeled rows, and the labeling is the operator's, after this phase closes.
- **The redaction owners.** The Jev arm waits on redaction unit cases passing in three modules (REQ-007). This phase reports the miss to their owners and edits none of them.
- **002's latency record.** The Jev arm waits on 002 having recorded a per-call latency (REQ-014). A Deem arm waits on none, because a warm Deem call measured 60 to 80 ms against the 30 s verifier budget (`opencode-goal.js:49`, `../007-classifier-deep-research/context/deem-local.md`). The census and the zero-call arms wait on neither.
- The Python `jev-cli` 0.6.2 that `.skilled/skills/cli-jev/cli-usage/` wraps, for the Jev arm only.
- `cli-deem` (proposed, phase 008) and a local Deem server passing the Deem check, for the Deem arm only.

**Deliverables**:
- The Pi census script and its report on `~/.pi/agent/sessions`
- The fixture builder, its unlabeled rows as a JSONL fixture for the operator and one offline scorer, tested on a synthetic fixture
- The goal hooks READMEs, updated for the new files (parent D6)
- After the operator labels, outside this phase's completion (parent D4): a zero-call report with a confusion table per arm on identical rows, error attribution per heuristic check, the clamp-defect count and a stop line or a gate line
- Past the gate only: the model arm's per-call records, the cascade table and a keep or drop line for its backend
- Only on keep: the shadow mode for the backend that kept, `deem` or `jev`, in the goal plugin, its tests, its docs and the skill docs parent D6 adds

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Two runtimes judge "is this goal done" with a heuristic. In OpenCode autonomous mode the goal plugin decides after each idle. A false `not_met` costs a continuation turn and a false `met` ends a goal early. In Pi, goal-core's own heuristic runs on every turn and hands the model a hidden verdict line after every turn that is not `met`. Nobody knows how often either heuristic is wrong. The verifier's only harness is three unit tests and no labeled set (`goal-core.test.cjs:631-651`, per research R2).

The heuristic also has a defect that costs nothing to test. The plugin clamps evidence at `DEFAULT_MAX_EVIDENCE_CHARS = 1200` (`.opencode/plugins/opencode-goal.js:42`), and the clamp appends `...` (`:386-389`). The truncation check then reads a trailing `...` as truncated evidence (`:2214`), and the result is `not_met` (`:2313-2316`). goal-core clamps the same way (`goal-core.cjs:290-297`). The final synthesis counts 253 of Pi's recorded nudges on that truncation branch.

Three facts from the first research round still shape any model mode. The heuristic never returns `blocked` (`opencode-goal.js:2202-2235`). An unknown mode value silently falls back to `heuristic` (`:226-229`), so `OPENCODE_GOAL_VERIFIER=jev` or `=deem` today quietly gives the heuristic. A verifier that throws becomes `blocked` at confidence 0 (`:2383-2385`), so a Jev or Deem failure that reached that catch would show the operator a false `blocked`.

### Purpose

Count the verifier's recorded use in Pi, give the heuristic its first measured error rates and test the free clamp fix, all with zero model calls. This phase builds that measurement and stops at the operator's label gate (parent D4), so the rates arrive once the operator labels. Add a model arm on Deem or Jev, Deem preferred for privacy, and then a shadow on the backend that kept, only past a gate fixed now. With no Jev key and no Deem server passing its check, everything behaves exactly as today.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- A Pi census that reads a Pi session directory, `~/.pi/agent/sessions` for this phase's run (parent D4), and prints nudge counts per session by verdict and reason category, with no message text.
- A fixture builder that assembles 30 to 50 rows from Pi sessions in `~/.pi/agent/sessions` and Claude transcripts the operator names, and one run of it that writes the unlabeled rows. The labeled set the operator completes from those rows is past the label gate.
- The goal hooks READMEs, which list every `lib/` file, updated for the new ones through sk-doc (parent D6).
- One offline scorer with three zero-call arms on identical rows: the plugin heuristic as shipped on the as-ingested form, a tail-window arm on the raw last 1,200 characters and goal-core parity. It attributes each error to a heuristic check and counts clamp defects.
- An optional zero-call claims column for recommendation R4.
- Verdict normalization between the plugin's `not_met` and goal-core's `not-met` and `unclear`.
- Past the gate in REQ-014 only: a `choice` arm behind `--deem` or `--jev` and its backend's check, under the wrapper rule: Jev over 3 reruns, Deem over 3 option orders.
- Only if the model arm's report says keep: `OPENCODE_GOAL_VERIFIER=deem` or `=jev` (proposed) as a shadow mode in the goal plugin, naming the backend its keep was measured on, with tests, doc rows and the skill docs parent D6 adds.

### Out of Scope

- Any mode where a Jev or Deem answer changes goal state. The heuristic stays authoritative in every mode this phase adds.
- The shadow mode when the report says drop or a stop fires. The phase then ends with the plugin unchanged.
- Fixing the clamp, the heuristic's checks or `VERIFIER_BLOCKING_PATTERN`. The clamp fix goes to the plugin and goal-core owners as a report finding.
- Editing `goal-core.cjs`, `secret-scrubber.ts` or the plugin's redaction rule. The redaction miss goes to their owners as a report.
- A live Pi form. Pi awaits each `turn_end` handler, so if one is ever built it runs detached or offline and never awaits a Jev or Deem call inside `turn_end`. This replaces the earlier Pi line, whose reason was wrong: Pi runs goal-core's own heuristic on every turn and does not follow OpenCode's result (`goal-context.ts:233-259`).
- The Cursor, Devin, Claude and Codex goal surfaces. Claude transcripts are read only as a row source, and no goal behavior there changes.
- The goal store as an evidence source or as proof that no verifier runs. It holds 6 records, all Hermes, all `not_evaluated`, swept after 2 days (What Not To Build row 59).
- Injecting `options.supervisorVerifier` to measure the heuristic. That replaces it instead of wrapping it (row 58).
- A model arm whose only evidence is the stored goal string (row 72).
- Any npm `jevctl` subcommand, `verify` above all (row 46). The gate refuses the npm `jevctl`, which prints a bare `0.2.3` for `--version`.
- Any key literal on a command line, in a fixture, a report or a log.
- Writing a label, by a model or by the build. Labels are the operator's, and the label gate closes this phase before them (parent D4).

### Files to Change

Every path is proposed and fixed at build time after `rg` confirms no clash.

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/hooks/goal/lib/count-pi-goal-nudges.mjs` | Create | The Pi census. About 80 to 120 LOC |
| `.skilled/hooks/goal/lib/count-pi-goal-nudges.test.mjs` | Create | A fixture session with one nudge per reason, an unknown record type and a no-text grep |
| `.skilled/hooks/goal/lib/build-verifier-fixture.cjs` | Create | Builds rows from Pi sessions in `~/.pi/agent/sessions` and Claude transcripts the operator names. About 140 LOC |
| `.skilled/hooks/goal/lib/verifier-labeled-set.jsonl` | Create (builder, then operator) | 30 to 50 rows. The builder's run writes them unlabeled at the label gate and leaves the file uncommitted. The operator labels them, strips secrets and decides whether the file is committed |
| `.skilled/hooks/goal/lib/score-verifier-labeled-set.cjs` | Create | The offline scorer: three zero-call arms, normalization, stop and gate lines and, past the gate, the two backend gates and the model arm: `--jev` through `jev` and `--deem` through `cli-deem`. About 280 LOC, plus the Deem half |
| `.skilled/hooks/goal/lib/score-verifier-labeled-set.test.cjs` | Create | The test cases in the plan, on a synthetic fixture with a stub `jev`, a stub `cli-deem` and a fake Deem server |
| `.opencode/plugins/opencode-goal.js` | Modify, keep only | The `deem` and `jev` mode values at `:134`, their branch at `:226-234` and the shadow call. About 60 to 100 LOC. `.skilled/plugins` is a symlink to `../.opencode/plugins`, so this is the one real file |
| `.opencode/plugins/tests/opencode-goal-supervisor.test.cjs` | Modify, keep only | No-backend parity, a malformed answer, an exit 3 mid-session, an exit 4 and a thrown shadow error against a stub `jev` on `PATH`. For `deem` mode, a fake Deem server with a failed check and a changed commit pair |
| `.skilled/hooks/goal/goal-plugin.md` | Modify, keep only | The idle-verification bullet at `:53` and the `OPENCODE_GOAL_VERIFIER` row at `:70`, listing both values |
| `.skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md` | Modify, keep only | The `OPENCODE_GOAL_VERIFIER` enum row at `:338`, listing both values |
| `.skilled/hooks/goal/README.md` | Modify | Added by parent D6. The directory tree (section 4), key files (section 5) and validation commands (section 8) list every `lib/` file and test, so the census, builder, scorer and their tests join them. The goal hooks are not a skill, so D6 names no catalog, playbook or changelog for them |
| `.skilled/hooks/README.md` | Modify | Added by parent D6. The hub tree's `goal/` lines (`:138-139`) list the goal `lib/` files |
| `.skilled/skills/system-spec-kit/feature-catalog/ux-hooks/goal-opencode-plugin.md` | Modify, keep only | Added by parent D6. The verifier paragraph at `:38` names `heuristic` and `llm` |
| `.skilled/skills/system-spec-kit/manual-testing-playbook/ux-hooks/goal-opencode-plugin.md` | Modify, keep only | Added by parent D6. The execution process at `:27` and the fail line at `:181` name both current values |
| `.skilled/skills/system-skill-advisor/feature-catalog/hooks-and-plugin/goal-opencode-plugin.md` | Modify, keep only | Added by parent D6. The verifier sentence at `:37` names both current values |
| `.skilled/skills/system-skill-advisor/manual-testing-playbook/cli-hooks-and-plugin/goal-opencode-plugin.md` | Modify, keep only | Added by parent D6. Step 12 at `:84` and the failure rows at `:112` and `:114` name both current values |
| `.skilled/skills/system-spec-kit/changelog/` and `.skilled/skills/system-skill-advisor/changelog/` | Create, keep only | Added by parent D6. One new version entry in each skill whose docs change. Neither skill's `SKILL.md` or README lists the verifier values (`rg` on 2026-09-28), so they change only if the build's recheck finds one |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

REQ-001 to REQ-012 keep their ids. The 2026-09-27 amendment rewrote REQ-001 to REQ-012 in place, except REQ-004, and added REQ-013 to REQ-015. The two-backend amendment the same day rewrote REQ-003, REQ-006, REQ-007, REQ-009, REQ-010, REQ-011 and REQ-014 in place and added no id. The wave 3 amendment on 2026-09-28 rewrote REQ-001, REQ-012 and REQ-013 in place for parent D4 and D6 and added no id. `goal.md`'s log lists each change.

**Label gate (parent D4).** No model writes a label. Before the gate, this phase builds REQ-013 and runs it on `~/.pi/agent/sessions`, and it builds the loader, arms, normalization and stop lines of REQ-001, REQ-002, REQ-005 and REQ-008 and tests them on a synthetic fixture. Running them on the operator's labeled rows, and everything behind REQ-014, waits for the operator's labels and is not part of this phase's completion. A synthetic test row carries a label its test sets, and that label describes no real session.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-013 | The Pi census runs first, with zero calls, and pins its method | `count-pi-goal-nudges.mjs` reads the Pi session directory it is given, and this phase runs it on `~/.pi/agent/sessions`, the operator's choice (parent D4). Its first line prints the counting method: the unit (one session record whose `customType` is `goal-verify-nudge`), the files scanned and the date window with the timestamp field it reads. It then prints, per session file, the nudge count, the counts per verdict and per reason category and the first and last date, then totals. It prints no message text. An unknown record type exits non-zero with a named error. Pi records no `met` turn, so the `met` count prints as not recorded |
| REQ-001 | The labeled set's shape is enforced, and the set itself is the operator's, past the label gate | The builder writes each Pi row with `label` empty, and no model fills a label (parent D4). The scorer reads 30 to 50 rows, each with an `id`, a `source` of `claude` or `pi`, the `objective`, the raw text, its as-ingested form, the raw length and a `label` that normalizes to `met`, `not_met` or `blocked`. Claude rows carry the pre-label from their native `goal_status` record. Pi rows carry the recorded nudge verdict. It rejects any other label by row id and exits non-zero. Under 30 valid rows it prints `stop: fewer than 30 rows` and runs nothing further |
| REQ-002 | Three zero-call arms run on identical rows | With no flag, the scorer runs the plugin heuristic as shipped on the as-ingested form, through `MkGoalPlugin.__test.writeGoalAtomic` and `maybeVerifyGoal` in a temporary state directory. It runs a tail-window arm, the same checks on the raw last 1,200 characters with no appended marker, and goal-core parity through `verifyGoalHeuristic`. Each arm prints a label-by-verdict confusion table and attributes each error to one of the five heuristic reasons (`opencode-goal.js:2207`, `:2211`, `:2215`, `:2219`, `:2225`). The report prints the clamp-defect count: rows where the as-ingested arm stops at the truncation branch and the tail-window arm does not. A stub `jev` placed first on `PATH` logs no call |
| REQ-003 | The backend gates run before any model call, and behavior with no backend is unchanged | Each backend runs only behind its own switch and only when its own check passes, once per run. A failed gate never falls over to the other backend. The Jev arm runs only with `--jev`. It then prints one identity line with the resolved `jev` path and the provider it will use, `JEV_PROVIDER` or `official`. The three checks run in order with that same `--provider`: `command -v jev`, `jev --version` printing `jev 0.6.2` and `jev auth status --provider <provider>` exiting 0. A failure prints one line, `jev arm skipped: jev not on PATH`, `jev arm skipped: version` with one details line, or `jev arm skipped: no credential`. The Jev gate checks presence, not validity. The Deem arm runs only with `--deem`. `cli-deem health` (proposed, phase 008) applies the pinned Deem check within 2,000 ms and prints the backend, the model id and the commit pair. A failure prints one line, `deem arm skipped: not reachable`, `deem arm skipped: stub backend`, `deem arm skipped: model` with one details line naming the id found, or `deem arm skipped: bad health response` (all proposed). The scorer never starts the Deem server. Deem needs no key, and the scorer passes it none. With neither switch set, or with every gate failing, the zero-call output stays byte-identical, no binary is spawned and the scorer exits 0 |
| REQ-004 | The wrapper rule keeps blocking language away from either backend | The arm never asks Jev or Deem about a row the heuristic stopped at its length check or its blocking-language check. Those two run first (`:2206-2212`), so every row the pattern matches is held. The scorer asserts that no per-call record carries either reason, and that every row the shared core marks `not-met` is held |
| REQ-005 | Verdicts from both vocabularies are normalized, and `unclear` keeps its own row | Labels and verdicts map `not-met` to `not_met`. goal-core's `unclear` keeps its own report row and folds into `not_met` only inside the two-class table. Any other value is an error. The report records the vocabulary split as a finding |
| REQ-006 | The keep threshold is fixed now and read as written | Keep only if, on each of 3 reruns, (a) the Jev arm's false `not_met` count is at most 0.70 times that of the heuristic and at most 0.70 times that of the tail-window arm, (b) the Jev arm has no false `met` that either arm lacked, (c) every asked row labeled `blocked` is answered `blocked`, and (d) the aggregate flip rate, non-modal answers over all measured calls, is at most 0.10. A row with three different answers is `unstable` and undecided. A missing answer never becomes a verdict. Any added false `met` means drop, whatever else improves. For a Deem arm, (a) to (c) hold for that arm on each of 3 option orders, and (d) is the order-flip rate, non-modal answers over all measured calls across the 3 orders, at most 0.10. A row with three different picks is `unstable`. The option-order scheme is fixed in this requirement before the Deem arm runs. A Deem keep holds only for the commit pair it was measured on. A new pair reruns this rule in full on the same harness before the plugin mode uses it, and the report prints `requalify: model commit changed` (proposed) |
| REQ-007 | Jev gets no secret, and egress waits on redaction | Before any egress, one redaction unit case per module passes for `TYPESAFE_API_KEY=` and `SERVICE_TOKEN=` assignments with fixture values under 48 characters, in `opencode-goal.js:474`, `secret-scrubber.ts:128` and `goal-core.cjs:374`. Longer fixtures would hide the gap, because the plugin's generic rule catches a 48-character value. Before the first call the scorer prints the payload class ("labeled objective and evidence excerpts from the operator's own sessions"), the row count, the planned call count and the estimated input tokens, never a dollar figure. State reaches `jev` on stdin. No key appears on a command line, and no key, row text or evidence text appears in a per-call record. The redaction cases and the egress line apply to the Jev arm. A Deem arm sends nothing off the machine. Before its first call the scorer prints "nothing leaves the machine", the planned calls and an estimated wall time at the measured p50, and no row text reaches a Deem record either |
| REQ-014 | The model arm and the plugin mode are built only past a gate fixed now | The Jev arm is built only when all three hold, and the report prints each: the tail-window arm leaves false `not_met` it cannot fix, meaning REQ-008 did not stop and at least one such row survives the wrapper rule, the three redaction cases of REQ-007 pass, and 002 has recorded a per-call latency. For a Deem arm only the tail-window condition remains. The redaction cases and 002's latency record gate the Jev arm alone. The plugin mode is built only on the arm's keep, for the backend that kept, and a per-call p95 under the 30 s verifier budget (`opencode-goal.js:49`) |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-008 | Cheap stop boundaries run before any call | The stop rule reads against the better of the heuristic and tail-window arms, the one with fewer false `met`, then the lower false `not_met` rate. When that arm has no false `met` and a false `not_met` rate at or below 0.10, the scorer prints `stop: no headroom`, the report names the clamp fix for the plugin and goal-core owners and no model arm is built. The rate is rows labeled `met` that the arm calls `not_met` over all rows labeled `met`. It prints `stop: no reachable rows` when every false `not_met` row is held by the wrapper rule |
| REQ-009 | Every call leaves a per-call record, and confidence is scored | A JSONL line per call holds row id, rerun number, `jev` version, provider, exit code, wall time in ms, the parsed key or `unmeasured`, the pick probability and the reason. Latency p50 and p95 print in the report. The report adds a cascade table: the heuristic first, then the model arm only on rows the heuristic calls `not_met` without blocking language, split by confidence bands written into this spec before the first model call. A Deem line replaces the rerun number, the `jev` version and the provider with the backend `deem`, the model id, the model commit, the source commit and the option order, with the commit pair taken from `cli-deem health` |
| REQ-010 | The shadow mode, only on keep, leaves the heuristic in charge | `normalizeVerifierMode` returns `deem` for `deem` and `jev` for `jev`, only for the backend that kept, and the heuristic's result is what `maybeVerifyGoal` applies. The shadow call spawns `cli-deem` or `jev` per the mode value, after the heuristic verdict is applied, as an async spawn bounded by the verifier timeout. It writes a shadow record whose `source` names its backend, `deem-shadow` or `jev-shadow`, to its own JSONL file in the goal state directory. At most one shadow call runs per session at a time. Every shadow error is caught inside the shadow call and never reaches `:2383-2385`. A `verifier_shadow` line (proposed name) prints only when the shadow answer disagrees with the heuristic |
| REQ-011 | The shadow mode is inert without its backend, and model failures stay out of the verdict path | In `jev` mode the gate runs once per OpenCode session, with the same `--provider` for every check and call. With it failing, the mode writes one enablement line naming the failed check, then behaves exactly as `heuristic` with no line per verification. With it passing, the enablement line names the provider and announces that objective and evidence leave the machine. An exit 3 on a live call disables the shadow for the rest of the session with one line. Exit 4, a timeout or a malformed answer skip that one shadow record. In `deem` mode the Deem check runs once per session within 500 ms and never starts the server. A failed check writes one enablement line naming the failed check, and the mode then behaves exactly as `heuristic`. A passing check writes one enablement line that names Deem, the model id and the commit pair and says nothing leaves the machine. A changed commit pair disables the shadow for the rest of the session with one line. Any other Deem failure skips that one shadow record. The existing `opencode-goal-*.test.cjs` suites pass, and the new cases pass against a stub `jev` and a fake Deem server |
| REQ-012 | The change stays inside its files | `git status` shows no change outside the census, the fixture builder, the fixture, the scorer, their tests, the two goal hooks READMEs, this phase folder and, only on keep, the plugin, its supervisor test, `goal-plugin.md`, `ENV-REFERENCE.md` and the D6 catalog, playbook and changelog files in the table above. The fixture stays untracked until the operator decides to commit it |

### P2 - Optional

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-015 | R4's claims column rides on the same rows, with zero calls | When enabled, each row gains `claims_regex`, the result of the exported `detectCompletionClaim` (`.skilled/skills/system-spec-kit/runtime/lib/hooks/completion-evidence-sentinel.cjs:113-119`, the 400-character tail at `:70`) on the raw text, and an optional operator `claim_label`. The report prints the regex against the label on labeled rows and the unlabeled count. Without the column the report is byte-identical |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:edge-cases -->
## Edge Cases

- **The census meets an unknown Pi record type.** It exits non-zero with a named error instead of skipping, because a skip would shrink the count unseen.
- **A 1,300-character text ending in a full stop.** The as-ingested arm stops at the truncation branch, the tail-window arm does not, and the row counts as one clamp defect.
- **No `jev` on `PATH`, the npm `jevctl` on `PATH` or `jev auth status --provider <provider>` exiting 3.** The scorer prints the zero-call report and one `jev arm skipped:` line, and exits 0. The shadow mode writes one enablement line and then acts as `heuristic`. `jev auth status` checks presence, not validity: it exits 0 for a stored key or an exported provider key, exits 3 with neither, never prints the key and spends no quota (confirmed live on 2026-09-26, recorded in the parent goal log).
- **The Deem check fails: no server, a server still loading its weights, the stub backend, a model other than `deem-0.8-v1` or a malformed health body.** The scorer prints the zero-call report and one `deem arm skipped:` line, and exits 0. A loading server refuses connections for about 10 s after a start, so it counts as not reachable and is never awaited. The shadow mode writes one enablement line and then acts as `heuristic`.
- **A Deem call fails after the gate.** Exit 1 or HTTP 400 marks the row `unmeasured`. Exit 2 stops the arm, because the scorer built a bad command. Exit 3 prints `deem arm stopped: backend refused` (proposed). Exit 4 triggers one recheck of health and the commit pair: a changed pair prints `deem arm stopped: model commit changed mid-run` and an unreachable server prints `deem arm stopped: server gone` (both proposed), with finished rows `partial`. A passing recheck with the same pair retries the row once, then marks it `unmeasured`. Exit 130 stops the arm as `interrupted`. These exits follow the shared gate contract in `../007-classifier-deep-research/research/research.md` section 12.
- **A Deem update lands mid-session.** The commit pair changes, and `deem` mode disables the shadow for the rest of the session with one line (REQ-011).
- **A busy Deem server.** It serves one request at a time, so a shadow call waits behind any other caller. The 30 s bound still holds, and a call past it skips that record.
- **Judgments and the auth check read different providers.** Judgments take `JEV_PROVIDER` (`jev_cli/__init__.py:307`), while `auth status` and `auth test` default to `official` (`:339`). The scorer and the plugin therefore pass one `--provider` to every check and call.
- **A present but rejected key.** The gate passes and the first call exits 3. The scorer prints `jev arm stopped: key rejected` (proposed) and reports the finished rows as partial. The shadow mode disables itself for the rest of the session with one line.
- **Exit 4 (429, 5xx, connection).** The scorer retries once after a backoff, then marks the row `unmeasured`. The shadow mode skips that record.
- **Exit 1, exit 2 or an answer outside `met`, `not_met` and `blocked`.** The row is `unmeasured`. Exit 2 also stops the scorer's arm, because it means the scorer built a bad command. Exit 130 stops the arm as `interrupted`.
- **A call past 30 s.** Offline, the row is `unmeasured_timeout` and its wall time is kept. Live, that shadow record is skipped and the heuristic's verdict, already applied, stands.
- **Unmeasured rows.** They leave every arm's table, and their count prints beside every metric. A Jev rerun or a Deem option order where more than 10% of asked rows are unmeasured does not count toward the keep.
- **A row labeled `blocked` that the wrapper rule holds.** Its arm verdict is the heuristic's `not_met`. It is reported in its own line and does not count against REQ-006 (c), which judges only rows the model arm was asked about.
- **The labels file uses `not-met`.** It normalizes to `not_met`. An `unclear` verdict keeps its own row.
- **A shadow call throws.** The error is caught inside the shadow call, the record is skipped and the verdict path never sees it.
- **A second idle arrives while a shadow call is in flight.** The new shadow record is skipped with reason `busy`, and the heuristic runs as usual.
- **`OPENCODE_GOAL_VERIFIER=llm`.** Unchanged. The shadow runs only in `deem` or `jev` mode.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:proof-plan -->
## Proof Plan

Written before the build from research R2, amended on 2026-09-27 to the final synthesis, with the operator's key-gate amendment to step 6, then amended the same day for two backends from `../007-classifier-deep-research/research/research.md` section 14. Parent D4 (2026-09-28) closes this phase at the label gate, after step 1, the builder's unlabeled rows and the scorer's synthetic tests. Steps 2 to 6 run only after the operator labels and are not part of this phase's completion.

1. The Pi census prints its method and its totals for a named directory and date window, with no message text. **Boundary:** an unknown record type or any message text in the output voids the census.
2. The labeled set holds at least 30 rows, each with an objective, the raw text, its as-ingested form, the raw length and one label. **Boundary:** under 30 rows proves nothing, and the phase stops there.
3. The three zero-call arms run on identical rows and print confusion tables with each error attributed to its check and the clamp-defect count. **Boundary:** if the better of the heuristic and tail-window arms has no false `met` and a false `not_met` rate at or below 0.10, stop, name the clamp fix for its owners and build no model arm. Stop as well if no false `not_met` row survives the wrapper rule.
4. The model arm is built only past REQ-014 for its backend and runs under the wrapper rule, Jev for 3 reruns and Deem over 3 option orders. **Boundary:** it never asks either backend about a row where the blocking pattern matched, and the script asserts this.
5. The report reads the keep threshold (REQ-006) for its backend against both the heuristic's and the tail-window arm's numbers. **Boundary:** any added false `met` fails the keep, whatever else improves.
6. Only then the plugin shadow mode, for the backend that kept. **Boundary:** with that backend unavailable, a session in `deem` or `jev` mode reaches the same verdicts as `heuristic` mode, with one log line at enablement and none per verification. Before this step, a per-call p95 from slice 1, or for Jev from 002, must sit under the 30 s budget. If it does not, the shadow would mostly time out, and the phase stops at the report.
<!-- /ANCHOR:proof-plan -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The operator knows how often Pi's hidden verdict line fired and why, counted by a stated method.
- **SC-002**: Once the operator labels, the operator knows the goal heuristic's false `met` and false `not_met` rates on their own sessions, which check causes each error and how many errors the clamp alone causes, whether or not a model mode ever ships. At the label gate that closes this phase (parent D4), the scorer that measures them is built and tested and the unlabeled rows are ready.
- **SC-003**: A shadow mode ships only on a measured keep past the gate, for the backend that kept, and with that backend unavailable a session cannot tell it from `heuristic` mode apart from one enablement line.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The operator's labeling time | The phase closes at the label gate (parent D4), so past the census only the builder's run and the scorer's synthetic tests happen inside it | The census needs no label. The scripts are built and checked on synthetic fixtures. The labels are the operator's task, after this phase closes |
| Dependency | Redaction fixes in three modules, owned elsewhere | The Jev arm waits | REQ-007 names the cases. This phase reports the miss and edits none of the modules |
| Dependency | 002's per-call latency record and the Python `jev-cli` 0.6.2 with a key | The Jev arm waits or is skipped | The skip is the specified keyless behavior. The census and the zero-call report still ship |
| Dependency | `cli-deem` from phase 008 and a local Deem server passing its check | The Deem arm waits or is skipped | The skip is the specified behavior with no server. The census and the zero-call report still ship |
| Risk | The census counts differ by method: 1,457 in 28 sessions against 1,616 matches in 37 files | Med | REQ-013 prints the unit, the files scanned and the date window, and the report reconciles both figures |
| Risk | Stale premise, found 2026-09-28: every non-`met` Pi turn no longer leaves a record. Since `e7c88670fb` (main, 2026-09-27, merged here in `bbf2a8e4cd`) the nudge goes out with `deliverAs: "nextTurn"` (`goal-context.ts:245-253`). The installed Pi, `@earendil-works/pi-coding-agent` 0.87.1, queues such a message (`dist/core/agent-session.js:1491-1492`) and hands it over only with the next user prompt (`:1302-1306`). The session entry then takes its `timestamp` from the write (`dist/core/session-manager.js:956`) | Med | Records dated before 2026-09-27 follow the old delivery. After it, the census undercounts by every nudge still queued when a session ended, and dates show the delivery, not the turn. The census's printed date window shows how much of the count falls after the change. The design is unchanged, and section 7 asks how to report it |
| Conflict | Parent D4 says no model writes a label. A Claude row's pre-label comes from Claude Code's native goal judge, a model, and T001 lets agreements stand after a spot check of about 10 | Med | Named, not resolved. The builder still writes the pre-label, and section 7 carries the question for the operator |
| Risk | The payload is the operator's own conversation, the most sensitive after the compaction arm | High | Deem is the preferred backend, because nothing leaves the machine. For a Jev arm the operator strips secrets, the redaction cases must pass first and the scorer announces egress, calls and tokens before any call. State goes on stdin, and no row text reaches a report or record |
| Risk | The wrapper rule also holds rows where "error" or "failed" appear in a real completion ("fixed the failing test") | Med | This caps the model arm's upside by design. The report counts false `not_met` rows held by the rule. REQ-008 stops when nothing is reachable |
| Risk | A small set gives a noisy threshold | Med | 3 Jev reruns or 3 Deem option orders, a flip rate of at most 0.10 and a rule that a rerun or order with more than 10% unmeasured rows does not count |
| Risk | A Deem update changes the weights under a keep. The schedule can land one every six hours | Med | A keep holds only for its commit pair and reruns in full on a new pair (REQ-006). `deem` mode disables the shadow on a changed pair (REQ-011) |
| Risk | A spawn from OpenCode blocks the plugin host (`completion-evidence-sentinel.cjs:90-93`) | High, slice 2 only | Async spawn only, bounded by the verifier timeout, after the heuristic verdict is applied, with every error caught inside the shadow call |
| Risk | The mode set and `OPENCODE_GOAL_VERIFIER` are a documented contract | Med, slice 2 only | `VALID_VERIFIER_MODES` has no reader outside the plugin (`rg` on 2026-09-26 and again on 2026-09-28: `:134` and `:228` only). The build reruns that search, and `goal-plugin.md:70`, `ENV-REFERENCE.md:338` and the four catalog and playbook pages parent D6 added change in the same commit. `.env.example:295` also lists `heuristic` or `llm`. It is outside the file list and outside D6, so on keep the build names it for the orchestrator rather than editing it |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- How many of Pi's 253 truncation-branch nudges are clamp artifacts? A lengths-only pass over the Pi session files, printing the length of the turn text behind each nudge, would answer it. UNKNOWN until then.
- Does the operator still run Pi goals? The synthesis dates every nudge it counted between 2026-07-29 and 2026-08-10. The census rerun, with its date window printed, answers it.
- Which unit and window explain the gap between 1,457 nudges in 28 sessions and 1,616 matches in 37 files? The census answers it.
- What are the confidence bands for the cascade table? They must be written into REQ-009 before the first model call. UNKNOWN now.
- Can the provider and model be read from a `choice` answer's JSON, or only from one billed `jev auth test`? 002 may answer it first. Otherwise the scorer spends one `jev auth test` at the arm's start and counts it in the announced call count.
- Which option-order scheme does REQ-006 fix for a Deem `choice` over `met`, `not_met` and `blocked`? Rotations, a reversal or seeded shuffles would all serve. It is fixed before the Deem arm runs. UNKNOWN now.
- How accurate is Deem 0.8B on this judgment? UNKNOWN until R21's Deem half reports in 002 and this arm runs.
- Is the labeled set committed? It holds excerpts of the operator's conversations, so that is the operator's call after review. The scorer takes the set's path as an argument either way.
- Does parent D4's "no model labels" let a Claude row's native `goal_status` pre-label stand? Claude Code's native goal judge, a model, writes that pre-label, and T001 has the operator adjudicate disagreements and spot-check about 10 agreements. If D4 means every label comes from the operator, T001 confirms every Claude row. The operator decides. Until then the design is unchanged, and the question does not block this phase, which stops before T001.
- Which Claude transcript directory does the builder read? Parent D4 names only the Pi source. Until the operator names one, the builder's run at the label gate writes Pi rows alone, and a later run adds the Claude rows.
- How should the census report the delivery change of 2026-09-27? Since then a nudge is written only when the next user prompt arrives, and it carries the write time (section 6). Totals before and after that date, printed apart, would show the effect. UNKNOWN whether the operator wants the split.
- Answered: the npm `jevctl` prints a bare `0.2.3` for `--version` (npm `cli.ts:89`, per the final synthesis). The gate refuses it.
<!-- /ANCHOR:questions -->

---
