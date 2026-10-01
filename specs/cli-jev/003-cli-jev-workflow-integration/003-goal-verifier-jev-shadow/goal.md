---
title: "Goal: Phase 3: Goal Verifier Pi Census, Zero-Call Arms and Opt-In Jev Shadow Mode"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "packet goal"
  - "durable directive"
  - "completion criteria"
  - "goal binding"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "cli-jev/003-cli-jev-workflow-integration/003-goal-verifier-jev-shadow"
    last_updated_at: "2026-09-28T21:30:00Z"
    last_updated_by: "closure-leaf"
    recent_action: "Closed the phase at the label gate: 7 of 7 criteria ticked, 4 amended at close"
    next_safe_action: "Orchestrator commits the phase docs. The operator labels at least 30 fixture rows"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-cli-jev-003-workflow-integration"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 3: Goal Verifier Pi Census, Zero-Call Arms and Opt-In Jev Shadow Mode

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> Everything between the frontmatter and the log is the DURABLE SLICE: it is
> what an operator sets as the session objective, and it must stay true for the
> life of the packet. The frontmatter above it is bookkeeping and never leaves
> this file: it is not sent in chat, not injected, not stored in an objective.
> Keep the slice short. A phase parent or top-level packet has one limit, 4000
> characters, measured from the frontmatter's closing fence to the log anchor.
> Up to 4000 passes and past it fails; the runtime goal surfaces cap what they
> hold, and a truncated objective loses its tail, which is where the criteria
> live.

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Count the goal verifier's recorded use in Pi and build, up to the operator's label gate, three zero-call arms that give its heuristic first measured error rates and test the free clamp fix, leaving for after the labels a gated `choice` arm on Jev first, else Deem, and a shadow `OPENCODE_GOAL_VERIFIER=deem` or `=jev` mode (proposed), inert without its backend, built only past a gate fixed before the build.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The heuristic's verdict is the only one that acts in every mode this phase adds. A Jev or Deem answer is logged beside it and never applied |
| D2 | Each slice and backend keeps its own switch. The census and the zero-call arms have none and never spawn `jev` or `cli-deem` (proposed). The offline arm uses `--deem` (proposed) or `--jev`, and the plugin mode uses `OPENCODE_GOAL_VERIFIER=deem` or `=jev`. Jev runs behind the parent's key gate with one `--provider`, `JEV_PROVIDER` or `official`, for every check and call, after one identity line. Deem runs behind its health check, which refuses the stub backend and never starts the server. A failed gate never falls over to the other backend |
| D3 | The plugin checks its backend's gate once per OpenCode session, Deem within 500 ms. With the gate failing, the mode writes one line at enablement and then acts exactly as `heuristic`. A changed Deem commit pair or a Jev exit 3 on a live call disables the shadow for the session with one line. A Jev exit 4, a timeout, a malformed answer or any other Deem failure skip that one record. Every shadow error is caught inside the shadow call, so none reaches the error-to-`blocked` path |
| D4 | Wrapper rule: a row or verification that the heuristic stops at its length or blocking-language check is never sent to either backend |
| D5 | The keep threshold in the fifth criterion is fixed now. A model arm is built only when the tail-window arm leaves a false `not_met` it cannot fix. A Jev arm also needs the redaction cases to pass in three modules and 002 to have recorded a per-call latency. The plugin mode is built only on keep, for the backend that kept |
| D6 | The operator labels every row, and no model writes a label: this phase closes at that label gate. The operator strips secrets before any Jev call. State reaches `jev` on stdin, no key appears on a command line and no row or message text appears in any record or census output. `jev` mode announces egress at enablement, and `deem` mode announces that nothing leaves the machine |
| D7 | goal-core's `not-met` normalizes to the plugin's `not_met`. Its `unclear` keeps its own report row and folds into `not_met` only inside the two-class table |
| D8 | The census and the zero-call arms come first. The clamp fix and the redaction fixes go to their owners as findings, and this phase edits neither the clamp nor any redaction rule |
| D9 | Jev runs first for the model arm and the shadow mode, then Deem (operator, 2026-09-29). The payload is the operator's conversation and Deem keeps it on the machine, so Jev still needs the redaction and secret-stripping gate of D5 and D6, and Deem runs when that gate is not accepted. A Deem keep holds only for the commit pair it was measured on |
| D10 | The census and the builder's Pi rows read `~/.pi/agent/sessions`, the operator's choice |

### Operator copy

The operator holds this directive as the session objective, and that copy is
what judges completion, not this file. Whenever anything above the log changes
(objective, a decision, the binding table, a criterion), resend this file's
chat slice so the operator can update their copy. The chat slice is the
durable slice without its frontmatter, HTML comments, anchor markers, `---`
dividers or heading section numbers, and `goal.cjs packet` prints it as
`chat_slice`. Never send more than 4000 characters: cut this file first. Keep
reminding while the copy stays unset, and never stop work for it. A child goal
change that alters a parent decision or criterion is an amendment to the
parent: apply it there first, then resend the parent.
<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

Three to seven bullets, each checkable without opening another file. Copy them
verbatim into the objective: nothing dereferences a path, so criteria left only
here are invisible to whatever judges completion.

- [x] `count-pi-goal-nudges.mjs`, run on a Pi session directory the operator names, first prints its counting method (one `goal-verify-nudge` custom-message record as the unit, the files scanned and the date window), then per-session nudge counts by verdict and reason category with first and last dates. It prints no message text and exits non-zero with a named error on an unknown record type
- [x] `score-verifier-labeled-set.cjs` with no flag reads 30 to 50 labeled rows, or prints `stop: fewer than 30 rows`. It runs three zero-call arms on identical rows: the plugin heuristic on the as-ingested text, a tail-window arm on the raw last 1,200 characters and goal-core parity. It prints a confusion table per arm with `unclear` on its own row, errors attributed to the five heuristic checks and a clamp-defect count, and stub `jev` and `cli-deem` binaries first on `PATH` log no call
- [x] When the better of the heuristic and tail-window arms has no false `met` and a false `not_met` rate at or below 0.10, the report prints `stop: no headroom`, names the clamp fix for the plugin and goal-core owners and no model arm code exists
- [x] At the label gate no model arm and no `--jev` or `--deem` flag exist: the scorer refuses each flag as unknown with exit 2 and holds no call site for `jev` or `cli-deem`. Past the gate, outside this phase's completion, a model arm is built only after a false `not_met` row survives both the tail-window arm and the wrapper rule. A Jev arm also needs redaction cases for `TYPESAFE_API_KEY=` and `SERVICE_TOKEN=` values under 48 characters to pass in `opencode-goal.js`, `secret-scrubber.ts` and `goal-core.cjs`, and 002 to have recorded a per-call latency. Once built, with `--jev` and `jev` missing, a version other than `jev 0.6.2` or `jev auth status --provider <provider>` exiting non-zero, the scorer prints one `jev arm skipped:` line, and with `--deem` and the Deem health check failing it prints one `deem arm skipped:` line. Either way the zero-call output is unchanged and it exits 0
- [x] The keep threshold is fixed before any model arm exists, and at the label gate the scorer prints no `keep` or `drop` line. Past the gate, outside this phase's completion, a model arm's report ends `keep` only if, on each of 3 Jev reruns or 3 Deem option orders, the arm's false `not_met` count is at most 0.70 times that of both the heuristic and the tail-window arm, it adds no false `met`, it answers every asked `blocked` row `blocked` and its flip rate over all measured calls, across reruns or option orders, is at most 0.10. Otherwise it ends `drop`
- [x] At the label gate, and on a stop or a drop, `.opencode/plugins/opencode-goal.js` is unchanged. Only on a keep past the gate, outside this phase's completion, `OPENCODE_GOAL_VERIFIER=deem` or `=jev`, for the backend that kept, applies the heuristic's verdict, catches every shadow error inside the shadow call and, with its backend's gate failing, writes one enablement line and the same verdicts as `heuristic`
- [x] `validate.sh --strict` on this phase prints `RESULT: PASSED`. The build commit `1da5b193d2` changes no path outside the census, fixture builder, scorer, their tests, `.skilled/hooks/goal/README.md`, `.skilled/hooks/README.md` and this phase folder, and the fixture stays untracked and in no commit. Only on a keep past the gate may a later change add the plugin, its supervisor test, `goal-plugin.md`, `ENV-REFERENCE.md`, the `goal-opencode-plugin.md` catalog and playbook pages of system-spec-kit and system-skill-advisor and one changelog entry in each of those two skills
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 4. LOG

Everything below is VOLATILE. It is not part of the directive, it is not copied
into the objective, and it is expected to grow. Progress, evidence, deviations
and findings belong here.

### Progress

| Item | State | Evidence |
|------|-------|----------|
| Phase planned | Done | `spec.md`, `plan.md`, `tasks.md` and this goal authored from research R2 on 2026-09-26 |
| Phase amended | Done | Amended on 2026-09-27 to the final synthesis, `../004-deep-research-expansion/research/research.md` section 13, with R2 and R4 from section 11. Status stays Planned |
| Two-backend amendment | Done | Amended on 2026-09-27 for two backends per `../007-classifier-deep-research/research/research.md` section 14 "003-goal-verifier-jev-shadow", R2, the shared gate contract in section 12 and the parent goal's D1, D5 and fourth criterion. Status stays Planned |
| Wave 3 amendment | Done | Amended on 2026-09-28 for the parent's wave 3 directive: D1 confirmed, D4 label gate and Pi session source, D5 builders, D6 docs and moved line numbers. Status stays Planned. Detail in the amendment table below |
| Build | Done | Released by the operator on 2026-09-28 (parent `goal.md` D3) and built from `scratch/w3-build/briefs/` in parallel with 017 and 006, after the operator's "Do fast fix" decision. Committed as `1da5b193d2`. Source: build record, session record |
| Baseline | Done | HEAD `996cf85eef`, before the first dispatch: goal hooks suite 146 of 146, exit 0. Plugin goal suites 143 tests, 135 failing with `ERR_MODULE_NOT_FOUND` under plain Node and 1 with `--preserve-symlinks`. Both READMEs `VALID`, strict validate `RESULT: PASSED`, check-goal 5 of 5 and alignment drift 0 findings. Source: build record section 1 |
| Pi census (T024 to T026) | Done | Brief 01 on Devin and the method-line fix 01b on Pi, census test 3 of 3. One run on `~/.pi/agent/sessions`: exit 0 in 7 s, 43 lines, each in one of the three fixed shapes, 0 message-text markers. Totals: 1,822 nudges in 41 session files, 407 `not-met` and 1,415 `unclear`, dated 2026-07-29 to 2026-08-10. A throwaway count before the build found the same totals. Source: build record section 3 |
| Fixture builder (T027) | Done | Brief 02 on Devin (Pi path) and brief 03 on Pi (Claude path), builder test 5 of 5. Source: build record section 5 |
| Unlabeled rows (T034) | Done | One run at the label gate on `~/.pi/agent/sessions`, Pi only: 50 rows, 10 per recorded reason, `label` empty on all 50 and 38 of 50 reproducing their recorded verdict and reason. The file has mode `0600`, is untracked, is in no commit and is listed in the local `.git/info/exclude`. Source: build record section 4, session record |
| Scorer (T005 to T007, T010) | Done | Briefs 04 and 06 on Devin, 05, 07 and 07b on Pi, scorer test 12 of 12. On the unlabeled fixture it prints `stop: fewer than 30 rows` with exit 0, and `--jev` and `--deem` each exit 2 as unknown flags. Source: build record sections 5 and 6 |
| Goal hooks READMEs (T035) | Done | Briefs 08 and 09 on Pi, `validate_document.py` `VALID` with 0 issues on each. Source: build record section 5, `logs/09.last.txt` |
| Final checks | Done | Goal hooks suite 166 of 166, exit 0 (baseline 146, +20). Plugin suites delta 0. The plugin, `goal-core.cjs` and `secret-scrubber.ts` unchanged, drift 0 findings, no em dash and no comment-hygiene match. Source: build record section 6 |
| Session reruns | Done | From the final state: suite 166 of 166 exit 0, both READMEs `VALID`, `node --check` clean, no key or secret match, the scorer's flag refusals and stop line as above, the plugin unchanged. A leak probe of 167 fixture snippets found no hit in any code file, README or this folder. Source: session record |
| Review | Done | Claude `review` agent over code by DeepSeek via Devin and MiMo via Pi: PASS, no P0 and no P1. It ran the three test files itself: 3 of 3, 5 of 5 and 12 of 12. 11 P2 findings were recorded, and the session fixed one on the local side (the fixture exclude). Source: session record |
| Build commit | Done | `1da5b193d2`, 50 paths: the six scripts and tests, the two READMEs and 42 record files under `scratch/w3-build/`, with 0 fixture matches. The session deferred the trigger index rebuild until 005 and 006 commit. Source: session record, `git show --name-only 1da5b193d2` |
| Labeled set | Operator | T001, past the label gate: the operator labels at least 30 of the 50 rows. Not part of this phase's completion (parent D4) |
| Keep decision | Past the label gate | Nothing past the gate is built. The scorer's run on labeled rows waits for the operator |
| Phase docs | Done | Closure pass, 2026-09-28: `tasks.md`, this log, `implementation-summary.md`, `spec.md` and `plan.md` record the evidence and correct the stale premises. Gate results are in `implementation-summary.md` Verification |

### Amendment 2026-09-27

Source: the final synthesis, section 13 "003-goal-verifier-jev-shadow", with R2 and R4 in section 11, section 5 (RQ3) and What Not To Build rows 46, 58, 59, 60 and 72. One line per changed requirement:

| Requirement | Change |
|-------------|--------|
| REQ-013 (new) | The Pi census is the first slice: per-session `goal-verify-nudge` counts by verdict and reason category, with a printed method line and no text |
| REQ-001 | Rows carry the raw text, its as-ingested form and the raw length. Claude rows are pre-labeled from native `goal_status` records, and Pi rows carry the recorded nudge verdict |
| REQ-002 | One heuristic arm becomes three zero-call arms, heuristic, tail-window and goal-core parity, with the clamp-defect count |
| REQ-003 | The gate adds an identity line and passes one `--provider` to all three checks, with the shared contract's three skip lines |
| REQ-005 | `unclear` keeps its own row and folds into `not_met` only in the two-class table (was: always folded) |
| REQ-006 | Clause (d) replaces the stability coefficient with an aggregate flip rate of at most 0.10, and (a) and (b) read against the tail-window arm as well as the heuristic |
| REQ-007 | Redaction unit cases must pass in three modules, with fixture values under 48 characters, before any egress. The egress line adds estimated input tokens |
| REQ-008 | The stop boundaries read against the better of the heuristic and tail-window arms, and a stop names the clamp fix for its owners |
| REQ-009 | Each call records its pick probability, and the report adds the cascade table with pre-registered bands |
| REQ-010 | Shadow errors are caught inside the shadow call, and a `verifier_shadow` line prints only on disagreement |
| REQ-011 | The session gate passes one `--provider` to every check and call, and the passing enablement line names the provider |
| REQ-012 | The scope list adds the census, the fixture builder and their tests |
| REQ-014 (new) | The Jev arm is built only when the tail-window arm leaves an unfixable false `not_met`, the three redaction cases pass and 002 has a latency record. The plugin mode needs keep and a p95 under 30 s |
| REQ-015 (new) | R4's optional zero-call claims column, `detectCompletionClaim` on the raw text beside an optional operator label |
| Out of Scope | The Pi line is replaced: Pi runs goal-core's own heuristic every turn, and a live Pi form, never built here, would not await inside `turn_end`. Rows 46, 58, 59 and 72 join the list |
| Decisions | D2, D3, D5, D6 and D7 rewritten and D8 added. D2 no longer restates the parent's gate |
| Criteria | Seven criteria replace six: the census criterion and the stop criterion are new, and the others follow the requirement changes above |

### Amendment 2026-09-27, two backends

Source: `../007-classifier-deep-research/research/research.md` section 14 "003-goal-verifier-jev-shadow", R2 in section 12, the shared two-backend gate contract in section 12 and conditions C2, C3, C4, C8, C10 and C14. Approval: section 14 says each amendment waits for the operator. The parent goal settles that: its D1 binds every phase to two backends, its D5 assigns the amendment to an Opus 5.5 high leaf and its fourth criterion requires 003 to carry the two-backend gate. The zero-call slices do not change, and no requirement id was added. One line per change:

| Item | Change |
|------|--------|
| `spec.md:3` description | A gated `choice` arm on Deem or Jev and a shadow mode that names its backend |
| Scope boundary `:48` | The model arm is behind `--deem` or `--jev` and its backend's check. Slice 2 is a `deem` or `jev` value (proposed) |
| Dependencies `:53`, `:54` | A Deem arm waits on no latency record, since a warm call measured 60 to 80 ms against the 30 s budget. `cli-deem` from phase 008 and a server passing the Deem check join, for the Deem arm only |
| In Scope `:97`, `:98` | The arm runs Jev over 3 reruns or Deem over 3 option orders. The shadow value names the backend its keep was measured on |
| Files `:124-129` | The scorer adds `--deem` through `cli-deem` and a fake server in its tests. The plugin's mode set and branch, `goal-plugin.md:70` and `ENV-REFERENCE.md:337` list both values |
| REQ-003 | The Jev gate is kept. The Deem half is added from the shared text: `cli-deem health` within 2,000 ms, four skip lines, no server start, no key, no fallback |
| REQ-004 | Blocking language stays away from either backend (carried from the `:97` change) |
| REQ-006 | For Deem, (a) to (c) hold on each of 3 option orders and (d) is the order-flip rate at most 0.10 (C4). A Deem keep holds per commit pair and requalifies on a new one (C3) |
| REQ-007 | The redaction cases and egress line apply to the Jev arm. A Deem arm prints "nothing leaves the machine", planned calls and an estimated wall time (C14) |
| REQ-009 | Deem lines carry the backend, the model id, the commit pair and the option order (C2). The cascade bands are fixed before the first model call, not the first billed call |
| REQ-010 | The shadow spawns `cli-deem` or `jev` per the mode value, after the heuristic verdict is applied |
| REQ-011 | For Deem: the check runs once per session within 500 ms and never starts the server. A failed check writes one enablement line, a passing one names Deem and says nothing leaves the machine and a changed commit pair disables the shadow with one line |
| REQ-014 | For a Deem arm only the tail-window condition remains. The redaction cases and 002's latency record gate the Jev arm. The plugin mode is built for the backend that kept (C10) |
| Edge cases | Deem check failures, Deem exits after the gate with the `deem arm stopped:` lines (C8), an update mid-session and a busy server |
| Proof plan, SC-002, SC-003, risks, questions | Carried through to both backends. Two open questions added: the Deem option-order scheme and Deem's accuracy on this judgment |
| Decisions | D1 to D6 name both backends. D9 is new: Deem is preferred, and a Deem keep holds per commit pair |
| Criteria | Still seven. Criteria 2 to 6 now name both backends |
| `plan.md`, `tasks.md`, `implementation-summary.md` | Carried through. T032 and T033 are new for the Deem gate and the Deem arm |

### Amendment 2026-09-28, wave 3

Source: the parent goal's decisions D1, D4, D5 and D6 and its log row "New directive, wave 3". The operator released this phase that day, fifth in D3's order. The worktree had just merged main (`bbf2a8e4cd`), so every cited line of code the phase will change was reopened. Status stays Planned, and nothing is built. Every criterion is kept. Criteria 4, 5, 6 and 7 are amended, each for the reason in its row. One line per change:

| Source | Item | Change |
|--------|------|--------|
| D1 | Backend gates | Confirmed, no change. REQ-003 holds the Jev gate (`jev auth status --provider <provider>` exit 0) and the Deem gate (`cli-deem health`), REQ-011 holds both for the plugin and `spec.md` section 2 says that with neither everything behaves as today |
| D4 | Objective | Now builds up to the operator's label gate and leaves the model arm and shadow mode for after the labels, because the labeling is not part of this phase's completion |
| D4 | D6 | Adds that no model writes a label and that this phase closes at the label gate |
| D4 | D10 (new) | The census and the builder's Pi rows read `~/.pi/agent/sessions`, the operator's choice |
| D4 | Criterion 4 | Opens with "At the label gate no model arm and no `--jev` or `--deem` flag exist. Past it,". Reason: the skip lines need the gated flags, which the plan builds only past the labels, so as written the criterion could not be met at close |
| D4 | Criterion 5 | Opens with "Past the label gate,". Reason: a keep or drop needs labeled results, which this phase no longer produces. The threshold stays fixed as D5 requires |
| D4 | Criterion 6 | "On a stop or a drop" becomes "On a stop, a drop or at the label gate". Reason: the phase now also ends at the gate, with the plugin unchanged |
| D6 | Criterion 7 | Adds the two goal hooks READMEs and, only on keep, the four catalog and playbook pages and one changelog entry each in system-spec-kit and system-skill-advisor. Reason: D6 makes those docs change with the code, which would break the old scope list |
| D4 | `spec.md` metadata, phase context, deliverables, scope, REQ-001, REQ-013, proof plan, SC-002, risks, questions | The label gate is defined and placed after the census run, the builder's run and the scorer's synthetic tests. A synthetic test label describes no real session. REQ-001 has the builder leave Pi labels empty |
| D4 | `plan.md` quality gates, overview, components, invocation, phases, testing | The session directory is ticked as named, the Definition of Done splits at the gate and the phase order gains a builder run, a docs step and the gate |
| D4 | `tasks.md` | T034 (new) runs the builder once at the gate and leaves the fixture uncommitted. T001 and T011 are `[B]` past the gate. T026 and T027 name the Pi source. The completion criteria split at the gate |
| D5 | `plan.md` section 4, `tasks.md` notation | Who builds: an Opus 5.5 xhigh build orchestrator, CLI executors by Bash (Devin `deepseek-v4-1-flash-max`, Pi on Cline `cline-pass/cline-pass/deepseek-v4.1-flash` at `xhigh`, Cursor `grok-4.7-xhigh-fast`). The orchestrator session verifies, gets a cross-family code review and commits. No phase doc named another builder, reviewer or release step, so nothing was replaced. The operator's roster amendment of 2026-09-28 20:30 superseded this roster before the build (see Deviations) |
| D6 | `spec.md` files, REQ-012, `plan.md` standards and testing, `tasks.md` T016, T022, T035 and T036 | Added `.skilled/hooks/goal/README.md` and `.skilled/hooks/README.md`, which list every goal `lib/` file. The goal hooks are not a skill, so they carry no catalog, playbook or changelog. On keep, added both skills' `goal-opencode-plugin.md` catalog and playbook pages and a changelog entry in each. Neither skill's `SKILL.md` or README lists the verifier values, checked with `rg`. Code follows `sk-code-opencode` |
| Stale premise | Pi nudge delivery | Since `e7c88670fb` a nudge is written only when the next user prompt delivers it. Recorded in `spec.md` sections 2, 6 and 7 without a design change |
| Stale citations | Moved line numbers | `opencode-goal.js` shifted by 5 lines after `:1281`, `goal-context.ts` by 12 to 15 and `ENV-REFERENCE.md` by 1. Corrected in `spec.md`, `plan.md`, `tasks.md` and the findings below. The two earlier amendment tables keep the lines they cited then. The "Provider split" finding now names the parent's gate decision by its current id, D1 |

### Deviations and findings

| Item | Note |
|------|------|
| Level 1 criteria source | This phase has no `acceptance-criteria.md`, so the criteria come from `spec.md` REQ-001 to REQ-015 |
| One plugin file, not two | `.skilled/plugins` is a symlink to `../.opencode/plugins` (checked with `ls -la` on 2026-09-27). A promoted mode edits `.opencode/plugins/opencode-goal.js` once. T003 rechecks this before the edit |
| Verdict vocabulary split | The plugin returns `not_met` (`opencode-goal.js:179`). The shared core returns `not-met` for blocking language (`goal-core.cjs:603-604`) and `unclear` for its other four failing checks (`:601-617`). D7 normalizes the first and keeps the second on its own row |
| Wrapper rule without a pattern copy | `VERIFIER_BLOCKING_PATTERN` is exported by neither module. The heuristic runs its length check and then its blocking check first (`opencode-goal.js:2206-2212`), so holding rows stopped at either check holds every pattern match |
| Reading "misses no `blocked` row" | Research R2's threshold is read as rows Jev was asked about. Rows labeled `blocked` that the wrapper rule holds keep the heuristic's `not_met` and are reported on their own line |
| Key-gate amendment | The research had one log line per verification with no key. The operator's rule is one line at enablement and none per verification, with exit 3 on a live call disabling the shadow for the session (D3) |
| Census count method | The final synthesis counts 1,457 nudges in 28 sessions, dated 2026-07-29 to 2026-08-10. A raw string count of `"customType":"goal-verify-nudge"` on 2026-09-27 found 1,616 in 37 session files of the same Pi directory. The magnitude agrees, so the census must print its unit, files and window and reconcile both figures (T026). Reconciled at the build: both are subsets of 1,822 nudges in 41 files, and they differ by scope, not by window. The 1,616 is this repository's session directory with its nested files (1,452 + 164 in 27 + 10 files). The 1,457 is its 27 top-level files plus one worktree file (1,452 + 5), without the nested files. Source: build record section 3 |
| The clamp defect | `DEFAULT_MAX_EVIDENCE_CHARS = 1200` (`opencode-goal.js:42`), the clamp appends `...` (`:386-389`), `:2214` reads a trailing `...` as truncation and `:2313-2316` returns `not_met`. The tail-window arm measures what that costs |
| Provider split | Judgments take `JEV_PROVIDER` (`jev_cli/__init__.py:307`) while `auth status` and `auth test` default to `official` (`:339`). The parent's gate decision, D5 when amended on 2026-09-27 and D1 since the wave 3 directive, already names `--provider`, so this phase needed no parent amendment |
| Title kept | The title still says "Opt-In Jev Shadow Mode", like the folder name, which section 14 keeps. The body names both backends |
| Deem exits placed in edge cases | 003 keeps its Jev exit handling in the edge cases rather than in a requirement, so the shared contract's Deem exits sit there too. They follow `cli-deem`'s exit codes, which phase 008 proposes |
| Option-order scheme left open | REQ-006 requires the scheme fixed before the Deem arm runs. Section 14 names none for 003, so it is an open question (T030) |
| `--value` dropped | The earlier plan's `jev choice ... --value` prints only the pick. REQ-009 needs the pick probability, so the arm parses the default JSON output |
| Pi nudge delivery changed (2026-09-28) | `e7c88670fb`, from main on 2026-09-27, sends the nudge with `deliverAs: "nextTurn"` (`goal-context.ts:245-253`). In the installed Pi 0.87.1 such a message waits in a queue (`dist/core/agent-session.js:1491-1492`) until the next user prompt (`:1302-1306`), and its session entry takes the write time (`dist/core/session-manager.js:956`). So "every non-`met` turn leaves a record" holds only before that date. The design is unchanged. `spec.md` records it as a risk and asks how the census should report it |
| Conflict: D4 and Claude pre-labels | Parent D4 says no model writes a label. REQ-001 and T001 let a Claude row keep the pre-label written by Claude Code's native goal judge, a model, when the operator's spot check agrees. Named for the operator, not resolved. It does not block this phase, which stops before T001. The session's ruling at the build: no build step reaches it, because until the operator names a Claude folder the builder writes Pi rows only, each with an empty `label`. Both questions are post-gate operator items. Source: session record, conflicts named by spec leaves |
| Claude source not named | Parent D4 names only `~/.pi/agent/sessions`. T034 therefore writes Pi rows alone unless the operator names a Claude transcript directory, and `spec.md` section 7 asks for one |
| Budget report | `goal.cjs packet` prints `packet_budget=unknown` for this folder. The 4,000-character cap applies to top-level packets and phase parents, and a phase child is exempt (`goal-slice.cjs` `budgetApplies`) |
| Deviation: parallel build | Parent D3 ordered 003 fifth, after 017. The operator's "Do fast fix" decision on 2026-09-28 let 003 and 006 build in parallel with 017 on disjoint paths, so D3's order reads as a release order. Source: session record, operator decisions 20:25 to 20:30 |
| Deviation: executor roster | The operator's amendment of 2026-09-28 20:30 replaced the roster this log and `plan.md` section 4 stated. The build ran Devin `deepseek-v4-1-flash-max` for briefs 01, 02, 04 and 06 and Pi on `llmgateway/mimo-v2.6-pro` at `--thinking high` for 01b, 03, 05, 07, 07b, 08 and 09. Cursor was retired and Pi on Cline was not used. Source: build record sections 5 and 7, session record |
| Deviation: builder test added | `build-verifier-fixture.test.cjs` is not in the `spec.md` file table. Criterion 7 names "their tests" and the sk-code coverage floor needs one. Only a test proves that the builder refuses to overwrite and writes mode `0600`. Source: build record section 7 |
| Deviation: Claude pre-label column | A Claude row's native `goal_status` result goes to a `prelabel` column, and `label` stays empty on every row. `spec.md` said Claude rows "arrive pre-labeled". Parent D4 wins, and the operator's question on pre-labels stays open. Source: build record section 7 |
| Deviation: not built | The orchestrator's build list left out T028's optional claims column (REQ-015) and the census `--from` and `--to` window from `plan.md`'s invocation. The census covers every date, as T026 asks. Source: build record section 7 |
| Deviation: no fake Deem server | The scorer test has no fake Deem server, which `spec.md` section 3 listed. No Deem arm exists at the label gate, so stub `jev` and `cli-deem` binaries on `PATH` are the zero-call proof. Source: build record section 7 |
| Deviation: goal README sentence | The goal hooks README said "Nothing imports the plugin." The scorer imports it for its `__test` helpers, so brief 08 corrected that sentence. Source: build record section 7 |
| Deviation: scorer IMPORTS line | Brief 06 replaced the scorer's IMPORTS placeholder "None: label, verdict and reason handling is pure string work." against the brief's "keep existing lines". The line had become false, so the replacement stands. Source: build record section 7 |
| Deviation: `--preserve-symlinks` | The scorer loads the plugin through the `.skilled/plugins` link, and in this worktree, which has no `.opencode/node_modules`, it needs `node --preserve-symlinks`. Without it the scorer exits 2 with a named error. The README states the flag nowhere outside that error text (review P2 10). Installing `.opencode/node_modules` would be an install (parent D7), so the build did not. Source: build record sections 1 and 7, session record |
| Deviation: improver pass | The prompt-quality card's Tier 2 improver pass was not run, because it needs an agent dispatch the build leaf could not make. Each brief was checked by hand against the card's one-change, literal-text and accept-line rules. Source: build record section 7 |
| Finding: redaction miss (T023) | Confirmed on synthetic strings: a value of 19 to 23 characters after `TYPESAFE_API_KEY=` or `SERVICE_TOKEN=` survives `goal-core.cjs` `redactEvidence`, the plugin's regex chain and `secret-scrubber.ts` `scrubSecrets`. A bare `API_KEY=` is redacted by all three. Cause: `\b` cannot match between `_` and `API` or `TOKEN`, and the generic rule needs 48 characters. Recorded for the goal hooks, plugin and system-spec-kit owners. No module was edited (D8), and no owner's case passes yet. Source: build record section 9, session record |
| Finding: 12 of 50 rows | 12 of the 50 rows do not reproduce their recorded verdict and reason under goal-core. Suspected cause, not confirmed: Pi judged against the goal record's full objective, while the builder recovers only the brief's `objective:` line. Review P2 1 names a second suspect, `objectiveFrom` reading every message role. Confirming either needs the goal records or the fixture, which this build did not read. Source: build record section 4, session record |
| Finding: review P2s | Recorded, not fixed (parent D5). Builder: `objectiveFrom` runs on every role (1), `--pi` on a missing directory prints a raw ENOENT stack with exit 1 (2), zero usable nudges write an empty file with exit 0 (3) and `ingested_text` uses goal-core's `redactEvidence`, which lacks the plugin's AIza, xox, AKIA and 48-character rules (4). Scorer: no test asserts `main`'s exit 1 on an invalid label (5), a set with no `met` label prints `stop: no headroom` on an undefined rate (6), `--out` writes outside any try and a bare `--out` is ignored (7) and nothing enforces the 50-row ceiling (8). Census: a partial trailing line aborts the run, with no `MALFORMED_RECORD` or `DIR_NOT_FOUND` test (9). README: the scorer's flags appear only in error text (10). The fixture was untracked but not ignored (11), fixed locally by the session in `.git/info/exclude`. Source: session record |
| Stale premises corrected at close | `spec.md` sections 2, 6 and 7 and this log's census row: the 1,457 and 1,616 figures reconciled, 431 `truncated` nudges beside the synthesis's 253, no recorded nudge after 2026-08-10 and none after the 2026-09-27 delivery change. `plan.md` sections 3 and 4 and `tasks.md`: the built invocation, row fields and executor roster. Source: build record section 8 |
| Criterion 4 amended at close | Its sentences after "Past it" read as present facts about `--jev` and `--deem`. At the gate both flags exit 2 as unknown, so ticking that wording would tick an untrue sentence. The criterion now names the at-gate proof, the exit 2 refusal and no call site, and places the build condition and skip lines past the gate, outside this phase's completion (parent D4). No condition changed. Evidence: build record section 6 proofs 3 and 4, session record. Source: closure pass. The operator can revert this amendment |
| Criterion 5 amended at close | A keep or drop needs labeled results, which this phase does not produce (parent D4), so no report exists to judge. The criterion now says what holds at the gate, a threshold fixed before any model arm and no `keep` or `drop` output, and keeps the threshold word for word for the work past the gate. Evidence: the scorer's only `keep` matches are two comment lines, and it has no spawn call. Source: closure pass. The operator can revert this amendment |
| Criterion 6 amended at close | It opened with the keep case, which is outside this phase's completion. The at-gate clause now comes first, and the keep clause is marked as past the gate. Evidence: `git diff --quiet 996cf85eef HEAD -- .opencode/plugins/opencode-goal.js` exit 0, and no commit since the build started touches it. Source: closure pass. The operator can revert this amendment |
| Criterion 7 amended at close | It read `git status`. After the commit `git status` cannot show the build's paths, and in this shared tree it lists the concurrent work of 005 and 006. The criterion now reads the build commit, as 002, 008 and 017 did at their close, and keeps the fixture rule. Evidence: `git show --name-only 1da5b193d2` lists the six scripts and tests, the two READMEs and 42 files under `scratch/w3-build/`, with 0 fixture matches. `git ls-files --error-unmatch` on the fixture exits 1. Source: closure pass. The operator can revert this amendment |
| Amendment: Jev first (2026-09-29) | Source: the operator's "Flip now" of 2026-09-29 and the parent goal's D1, now "Features run on Jev first, else Deem". Objective "on Deem or Jev, Deem preferred" became "on Jev first, else Deem". D9 "Deem is the preferred backend for the model arm and the shadow mode, because the payload is the operator's conversation and Deem keeps it on the machine" became "Jev runs first for the model arm and the shadow mode, then Deem (operator, 2026-09-29). The payload is the operator's conversation and Deem keeps it on the machine, so Jev still needs the redaction and secret-stripping gate of D5 and D6, and Deem runs when that gate is not accepted". The same order changed in `spec.md` (Phase Context, section 2 Purpose and the risks table), `plan.md` (overview and slice 1) and `tasks.md` (T012). No gate changed: D5, D6 and REQ-007 stand word for word. Rows above that quote the old wording stay as history |
| Clamp fix in goal-core (2026-10-01) | The operator chose "Fix it in goal-core" after phase 042's labels repeated `clamp_defects=11`. SWE 2 max changed `verifyGoalHeuristic` in `.skilled/hooks/goal/lib/goal-core.cjs` to judge the last 1,200 characters with no added marker, added four cases to `goal-core.test.cjs` and moved one pinned assertion in `score-verifier-labeled-set.test.cjs` from the old parity `unclear` row to `verdict=met label_met=29`. Suites from the final state: goal-core 78 pass (74 before), goal-slice 24, score-verifier-labeled-set 12, build-verifier-fixture 5, count-pi-goal-nudges 3, goal-pi 22, 0 failing. On the real 50-row set goal-core's parity arm now answers `met` on 0 rows, so no false met appears against the 47 `not_met` labels. `clamp_defects` still prints 11 because it measures the OpenCode plugin's own copy (`.opencode/plugins/opencode-goal.js:2215`), which this change leaves alone. The README's verification paragraph says so |
<!-- /ANCHOR:log -->
