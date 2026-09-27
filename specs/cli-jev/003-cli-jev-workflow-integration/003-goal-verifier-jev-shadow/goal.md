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
    last_updated_at: "2026-09-27T09:00:00Z"
    last_updated_by: "phase-amender"
    recent_action: "Amended the directive to the final synthesis, section 13"
    next_safe_action: "Execute against the completion criteria, Pi census first"
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

**Objective:** Count the goal verifier's recorded use in Pi, give its heuristic first measured error rates from three zero-call arms and test the free clamp fix, then build a key-gated Jev `choice` arm and a shadow `OPENCODE_GOAL_VERIFIER=jev` mode, inert without a key, only past a gate fixed before the build.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The heuristic's verdict is the only one that acts in every mode this phase adds. A Jev answer is logged beside it and never applied |
| D2 | Each slice keeps its own switch. The census and the zero-call arms have none and never spawn `jev`. The offline arm uses `--jev`, and the plugin mode uses `OPENCODE_GOAL_VERIFIER=jev`. Behind either switch, the parent's key gate runs with one `--provider`, `JEV_PROVIDER` or `official`, for every check and call, after one identity line |
| D3 | The plugin checks the gate once per OpenCode session. Without a key, `jev` mode writes one line at enablement and then acts exactly as `heuristic`. An exit 3 on a live call disables the shadow for the session with one line. Exit 4, a timeout or a malformed answer skip that one record. Every shadow error is caught inside the shadow call, so none reaches the error-to-`blocked` path |
| D4 | Wrapper rule: a row or verification that the heuristic stops at its length or blocking-language check is never sent to Jev |
| D5 | The keep threshold in the fifth criterion is fixed now. The Jev arm is built only when the tail-window arm leaves a false `not_met` it cannot fix, the redaction cases pass in three modules and 002 has recorded a per-call latency. The plugin mode is built only on keep |
| D6 | The operator labels every row and strips secrets before any call. State reaches `jev` on stdin, no key appears on a command line, and no row or message text appears in any record or census output. The plugin mode announces egress at enablement |
| D7 | goal-core's `not-met` normalizes to the plugin's `not_met`. Its `unclear` keeps its own report row and folds into `not_met` only inside the two-class table |
| D8 | The census and the zero-call arms come first. The clamp fix and the redaction fixes go to their owners as findings, and this phase edits neither the clamp nor any redaction rule |

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
- [ ] `score-verifier-labeled-set.cjs` with no flag reads 30 to 50 labeled rows, or prints `stop: fewer than 30 rows`. It runs three zero-call arms on identical rows: the plugin heuristic on the as-ingested text, a tail-window arm on the raw last 1,200 characters and goal-core parity. It prints a confusion table per arm with `unclear` on its own row, errors attributed to the five heuristic checks and a clamp-defect count, and a stub `jev` first on `PATH` logs no call
- [ ] When the better of the heuristic and tail-window arms has no false `met` and a false `not_met` rate at or below 0.10, the report prints `stop: no headroom`, names the clamp fix for the plugin and goal-core owners and no Jev arm code exists
- [ ] The Jev arm exists only after a false `not_met` row survives both the tail-window arm and the wrapper rule, redaction cases for `TYPESAFE_API_KEY=` and `SERVICE_TOKEN=` values under 48 characters pass in `opencode-goal.js`, `secret-scrubber.ts` and `goal-core.cjs`, and 002 has recorded a per-call latency. With `--jev` and `jev` missing, a version other than `jev 0.6.2` or `jev auth status --provider <provider>` exiting non-zero, it prints one `jev arm skipped:` line, the zero-call output unchanged and exits 0
- [ ] The Jev report ends `keep` only if, on each of 3 reruns, the arm's false `not_met` count is at most 0.70 times that of both the heuristic and the tail-window arm, it adds no false `met`, it answers every asked `blocked` row `blocked` and its aggregate flip rate over all measured calls is at most 0.10. Otherwise it ends `drop`
- [ ] On keep, `OPENCODE_GOAL_VERIFIER=jev` applies the heuristic's verdict, catches every shadow error inside the shadow call and, with the key gate failing, writes one enablement line and the same verdicts as `heuristic`. On a stop or a drop, `.opencode/plugins/opencode-goal.js` is unchanged
- [ ] `validate.sh --strict` on this phase prints `RESULT: PASSED`, and `git status` shows no change outside the census, fixture builder, fixture, scorer, their tests, this phase folder and, only on keep, the plugin, its supervisor test, `goal-plugin.md` and `ENV-REFERENCE.md`
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
| Pi census | Pending | T024 to T026, the first slice |
| Labeled set | Pending | The operator's task, T001, after the builder (T027) |
| Scorer and keep decision | Pending | Nothing built |

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

### Deviations and findings

| Item | Note |
|------|------|
| Level 1 criteria source | This phase has no `acceptance-criteria.md`, so the criteria come from `spec.md` REQ-001 to REQ-015 |
| One plugin file, not two | `.skilled/plugins` is a symlink to `../.opencode/plugins` (checked with `ls -la` on 2026-09-27). A promoted mode edits `.opencode/plugins/opencode-goal.js` once. T003 rechecks this before the edit |
| Verdict vocabulary split | The plugin returns `not_met` (`opencode-goal.js:179`). The shared core returns `not-met` for blocking language (`goal-core.cjs:603-604`) and `unclear` for its other four failing checks (`:601-617`). D7 normalizes the first and keeps the second on its own row |
| Wrapper rule without a pattern copy | `VERIFIER_BLOCKING_PATTERN` is exported by neither module. The heuristic runs its length check and then its blocking check first (`opencode-goal.js:2201-2207`), so holding rows stopped at either check holds every pattern match |
| Reading "misses no `blocked` row" | Research R2's threshold is read as rows Jev was asked about. Rows labeled `blocked` that the wrapper rule holds keep the heuristic's `not_met` and are reported on their own line |
| Key-gate amendment | The research had one log line per verification with no key. The operator's rule is one line at enablement and none per verification, with exit 3 on a live call disabling the shadow for the session (D3) |
| Census count method | The final synthesis counts 1,457 nudges in 28 sessions, dated 2026-07-29 to 2026-08-10. A raw string count of `"customType":"goal-verify-nudge"` on 2026-09-27 found 1,616 in 37 session files of the same Pi directory. The magnitude agrees, so the census must print its unit, files and window and reconcile both figures (T026) |
| The clamp defect | `DEFAULT_MAX_EVIDENCE_CHARS = 1200` (`opencode-goal.js:42`), the clamp appends `...` (`:386-389`), `:2209` reads a trailing `...` as truncation and `:2308-2311` returns `not_met`. The tail-window arm measures what that costs |
| Provider split | Judgments take `JEV_PROVIDER` (`jev_cli/__init__.py:307`) while `auth status` and `auth test` default to `official` (`:339`). The parent's D5, amended on 2026-09-27, already names `--provider`, so this phase needed no parent amendment |
| `--value` dropped | The earlier plan's `jev choice ... --value` prints only the pick. REQ-009 needs the pick probability, so the arm parses the default JSON output |
<!-- /ANCHOR:log -->
