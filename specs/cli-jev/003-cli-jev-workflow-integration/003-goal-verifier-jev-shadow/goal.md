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
    last_updated_at: "2026-09-28T11:30:00Z"
    last_updated_by: "wave-3-spec-leaf"
    recent_action: "Wave 3 amendment: label gate, Pi source, builders, skill docs, moved lines"
    next_safe_action: "Build to the label gate, Pi census on ~/.pi/agent/sessions first"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-cli-jev-003-workflow-integration"
      parent_session_id: null
    completion_pct: 0
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

**Objective:** Count the goal verifier's recorded use in Pi and build, up to the operator's label gate, three zero-call arms that give its heuristic first measured error rates and test the free clamp fix, leaving for after the labels a gated `choice` arm on Deem or Jev, Deem preferred, and a shadow `OPENCODE_GOAL_VERIFIER=deem` or `=jev` mode (proposed), inert without its backend, built only past a gate fixed before the build.

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
| D9 | Deem is the preferred backend for the model arm and the shadow mode, because the payload is the operator's conversation and Deem keeps it on the machine. A Deem keep holds only for the commit pair it was measured on |
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

- [ ] `count-pi-goal-nudges.mjs`, run on a Pi session directory the operator names, first prints its counting method (one `goal-verify-nudge` custom-message record as the unit, the files scanned and the date window), then per-session nudge counts by verdict and reason category with first and last dates. It prints no message text and exits non-zero with a named error on an unknown record type
- [ ] `score-verifier-labeled-set.cjs` with no flag reads 30 to 50 labeled rows, or prints `stop: fewer than 30 rows`. It runs three zero-call arms on identical rows: the plugin heuristic on the as-ingested text, a tail-window arm on the raw last 1,200 characters and goal-core parity. It prints a confusion table per arm with `unclear` on its own row, errors attributed to the five heuristic checks and a clamp-defect count, and stub `jev` and `cli-deem` binaries first on `PATH` log no call
- [ ] When the better of the heuristic and tail-window arms has no false `met` and a false `not_met` rate at or below 0.10, the report prints `stop: no headroom`, names the clamp fix for the plugin and goal-core owners and no model arm code exists
- [ ] At the label gate no model arm and no `--jev` or `--deem` flag exist. Past it, a model arm exists only after a false `not_met` row survives both the tail-window arm and the wrapper rule. A Jev arm also needs redaction cases for `TYPESAFE_API_KEY=` and `SERVICE_TOKEN=` values under 48 characters to pass in `opencode-goal.js`, `secret-scrubber.ts` and `goal-core.cjs`, and 002 to have recorded a per-call latency. With `--jev` and `jev` missing, a version other than `jev 0.6.2` or `jev auth status --provider <provider>` exiting non-zero, it prints one `jev arm skipped:` line. With `--deem` and the Deem health check failing, it prints one `deem arm skipped:` line. Either way the zero-call output is unchanged and it exits 0
- [ ] Past the label gate, a model arm's report ends `keep` only if, on each of 3 Jev reruns or 3 Deem option orders, the arm's false `not_met` count is at most 0.70 times that of both the heuristic and the tail-window arm, it adds no false `met`, it answers every asked `blocked` row `blocked` and its flip rate over all measured calls, across reruns or option orders, is at most 0.10. Otherwise it ends `drop`
- [ ] On keep, `OPENCODE_GOAL_VERIFIER=deem` or `=jev`, for the backend that kept, applies the heuristic's verdict, catches every shadow error inside the shadow call and, with its backend's gate failing, writes one enablement line and the same verdicts as `heuristic`. On a stop, a drop or at the label gate, `.opencode/plugins/opencode-goal.js` is unchanged
- [ ] `validate.sh --strict` on this phase prints `RESULT: PASSED`, and `git status` shows no change outside the census, fixture builder, fixture, scorer, their tests, `.skilled/hooks/goal/README.md`, `.skilled/hooks/README.md`, this phase folder and, only on keep, the plugin, its supervisor test, `goal-plugin.md`, `ENV-REFERENCE.md`, the `goal-opencode-plugin.md` catalog and playbook pages of system-spec-kit and system-skill-advisor and one changelog entry in each of those two skills
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
| Pi census | Pending | T024 to T026, the first slice, run on `~/.pi/agent/sessions` |
| Unlabeled rows | Pending | The builder (T027) and its one run at the label gate (T034) |
| Labeled set | Past the label gate | The operator's task, T001, after T034. Not part of this phase's completion (parent D4) |
| Scorer and keep decision | Pending | Nothing built. The scorer is tested on a synthetic fixture before the gate, and its run on labeled rows waits for the operator |

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
| D5 | `plan.md` section 4, `tasks.md` notation | Who builds: an Opus 5.5 xhigh build orchestrator, CLI executors by Bash (Devin `deepseek-v4-1-flash-max`, Pi on Cline `cline-pass/cline-pass/deepseek-v4.1-flash` at `xhigh`, Cursor `grok-4.7-xhigh-fast`). The orchestrator session verifies, gets a cross-family code review and commits. No phase doc named another builder, reviewer or release step, so nothing was replaced |
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
| Census count method | The final synthesis counts 1,457 nudges in 28 sessions, dated 2026-07-29 to 2026-08-10. A raw string count of `"customType":"goal-verify-nudge"` on 2026-09-27 found 1,616 in 37 session files of the same Pi directory. The magnitude agrees, so the census must print its unit, files and window and reconcile both figures (T026) |
| The clamp defect | `DEFAULT_MAX_EVIDENCE_CHARS = 1200` (`opencode-goal.js:42`), the clamp appends `...` (`:386-389`), `:2214` reads a trailing `...` as truncation and `:2313-2316` returns `not_met`. The tail-window arm measures what that costs |
| Provider split | Judgments take `JEV_PROVIDER` (`jev_cli/__init__.py:307`) while `auth status` and `auth test` default to `official` (`:339`). The parent's gate decision, D5 when amended on 2026-09-27 and D1 since the wave 3 directive, already names `--provider`, so this phase needed no parent amendment |
| Title kept | The title still says "Opt-In Jev Shadow Mode", like the folder name, which section 14 keeps. The body names both backends |
| Deem exits placed in edge cases | 003 keeps its Jev exit handling in the edge cases rather than in a requirement, so the shared contract's Deem exits sit there too. They follow `cli-deem`'s exit codes, which phase 008 proposes |
| Option-order scheme left open | REQ-006 requires the scheme fixed before the Deem arm runs. Section 14 names none for 003, so it is an open question (T030) |
| `--value` dropped | The earlier plan's `jev choice ... --value` prints only the pick. REQ-009 needs the pick probability, so the arm parses the default JSON output |
| Pi nudge delivery changed (2026-09-28) | `e7c88670fb`, from main on 2026-09-27, sends the nudge with `deliverAs: "nextTurn"` (`goal-context.ts:245-253`). In the installed Pi 0.87.1 such a message waits in a queue (`dist/core/agent-session.js:1491-1492`) until the next user prompt (`:1302-1306`), and its session entry takes the write time (`dist/core/session-manager.js:956`). So "every non-`met` turn leaves a record" holds only before that date. The design is unchanged. `spec.md` records it as a risk and asks how the census should report it |
| Conflict: D4 and Claude pre-labels | Parent D4 says no model writes a label. REQ-001 and T001 let a Claude row keep the pre-label written by Claude Code's native goal judge, a model, when the operator's spot check agrees. Named for the operator, not resolved. It does not block this phase, which stops before T001 |
| Claude source not named | Parent D4 names only `~/.pi/agent/sessions`. T034 therefore writes Pi rows alone unless the operator names a Claude transcript directory, and `spec.md` section 7 asks for one |
| Budget report | `goal.cjs packet` prints `packet_budget=unknown` for this folder. The 4,000-character cap applies to top-level packets and phase parents, and a phase child is exempt (`goal-slice.cjs` `budgetApplies`) |
<!-- /ANCHOR:log -->
