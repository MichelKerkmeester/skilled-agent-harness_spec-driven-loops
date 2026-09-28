---
title: "Goal: Phase 2: advisor-jev-tiebreak-arm"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "advisor jev tie-break goal"
  - "score-jev-tiebreak completion criteria"
  - "jev near-tie cluster arm"
  - "jev arm key gate"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "cli-jev/003-cli-jev-workflow-integration/002-advisor-jev-tiebreak-arm"
    last_updated_at: "2026-09-28T10:30:00Z"
    last_updated_by: "amendment-leaf"
    recent_action: "Amended for the wave 3 directive: the Keep Rule for 009, build roles and the skill docs"
    next_safe_action: "Build after 008 and 016: the advisor dist, then the zero-call census, comparators and power line"
    blockers: []
    key_files:
      - "specs/cli-jev/003-cli-jev-workflow-integration/002-advisor-jev-tiebreak-arm/spec.md"
      - "specs/cli-jev/003-cli-jev-workflow-integration/004-deep-research-expansion/research/research.md"
      - "specs/cli-jev/003-cli-jev-workflow-integration/007-classifier-deep-research/research/research.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-cli-jev-003-workflow-integration"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Goal: Phase 2: advisor-jev-tiebreak-arm

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
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

**Objective:** Measure, offline and by hand, whether a `choice` from the Python `jev-cli` or the local Deem over the skill advisor's near-tie cluster beats the scorer's order and three zero-call comparators under a keep rule that can fail, through one new script whose default census makes zero model calls and prints a power line first, and whose `--jev` and `--deem` (proposed) arms each stay dormant unless their own backend's checks pass.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Two new code files: `score-jev-tiebreak.mjs` in `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/` and `tests/parity/score-jev-tiebreak.vitest.ts` under `.skilled/skills/system-skill-advisor/runtime/`. The only other changes are the skill docs of D10 and the files generated from them, with `SKILL.md`'s `description` and Keywords line unchanged. Nothing is served and nothing runs in a hook |
| D2 | The Jev arm needs `--jev`. It prints an identity line with the `jev` path and the provider P, `JEV_PROVIDER` when set and `official` otherwise. Then, in order: `command -v jev`, `jev --version` printing `jev 0.6.2` and `jev auth status --provider P` exiting 0. A failure prints `jev arm skipped: jev not on PATH`, `jev arm skipped: version` with a details line or `jev arm skipped: no credential`, leaves the census byte-identical and exits 0 |
| D3 | The script never reads, logs or passes a key and holds no key literal or key variable name. The same `--provider P` goes to check 3, `jev auth test` and every judgment |
| D4 | The census covers the 177 labeled and 64 holdout skill-firing rows under the exact env of `capture-scorer-eval-baseline.mjs:35-46`. Holdout top-1 other than 53/70 voids the run. Zero movable rows prints `no headroom`, 1 to 4 prints `underpowered`, and neither runs the `choice` arm |
| D5 | `keep` needs an exact one-sided sign test at 0.05 over decided rows, a win over each comparator, no fall in right@3 and an aggregate flip rate of at most 0.10. `kill` means the sign test favors the scorer. Gold demotions are losses. Each backend gets its own column and verdict, and only `kill` on a column closes that backend's served advisor forms. The Keep Rule in `spec.md` section 4 fixes the inputs, the order and the verdict line before any run. Only a Deem `keep` unlocks phase 009, for the commit pair on its line. Without one the phase still closes and records every verdict line |
| D6 | A row is decided only when all 3 reruns return a submitted key, and no path writes a default score or verdict. Exit 3 after the gate stops the arm with `jev arm stopped: key rejected`, and a spawn past 90 s is `unmeasured_timeout` |
| D7 | R21's Deem half, 195 `noul` calls in one pass printing accuracy, F1, Brier score, a 5-bin ECE and a fitted temperature, runs on every `--deem` run. The Jev half runs only when the census prints `underpowered`, under the same switch and gate, in place of the Jev `choice` arm |
| D8 | The Deem arm needs `--deem` and a pass from `cli-deem health` (proposed, phase 008): the pinned check within 2,000 ms, no `stub` backend and model `deem-0.8-v1`. A failure prints its `deem arm skipped:` line, leaves the census and the Jev column byte-identical and exits 0. The script never starts the server and passes `cli-deem` no key |
| D9 | The Deem arm asks at most 25 cluster keys plus `none` in 3 option orders, the scorer's order with `none` last and its two left rotations, with an order-flip rate of at most 0.10 for `keep`. Every call records the commit pair, and a Deem `keep` holds only for that pair. Exit 4 rechecks once, and a gone server or a changed pair stops the arm with finished rows `partial` |
| D10 | Parent D5 and D6 bind. A fresh Opus 5.5 xhigh build orchestrator writes single-change briefs and runs CLI executors by Bash only: Devin `deepseek-v4-1-flash-max`, Pi on Cline `cline-pass/cline-pass/deepseek-v4.1-flash` at `xhigh` and Cursor `grok-4.7-xhigh-fast`. The orchestrator session verifies, gets a cross-family review of the code and commits. System-skill-advisor's `SKILL.md`, README, changelog, feature catalog and playbook go through sk-doc, and code follows sk-code's OpenCode route |

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

- [ ] `score-jev-tiebreak.mjs` exists in `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/`, and a run without `--jev` prints eligible, movable, gold-first, gold-outside and top-3 counts for the 177 labeled and 64 holdout skill-firing rows, holdout top-1 `53/70`, MRR, right@1 and right@3 for the scorer, confidence order, always-second and the outcome-weighted rerank, and a power line, then exits 0 while stub `jev` and `cli-deem` binaries first on PATH log zero invocations
- [ ] With `--jev`, a line naming the `jev` path and the provider prints first, a stub whose `jev auth status --provider <that provider>` exits 3 makes the script print `jev arm skipped: no credential`, and a stub whose version line is not `jev 0.6.2` makes it print `jev arm skipped: version`. With `--deem`, a stub `cli-deem health` reporting a stub backend prints `deem arm skipped: stub backend`, and one reporting model `deem-1.5` prints `deem arm skipped: model`. Each run exits 0 with census output identical to the default run, and the stub logs show no judgment call
- [ ] `grep -nE 'API_KEY|TYPESAFE'` on `score-jev-tiebreak.mjs` returns no match, in a stub run that passes the Jev gate every logged `auth status`, `auth test` and judgment call carries the same `--provider` value, and no logged `cli-deem` call carries a key or `--provider`
- [ ] `tests/parity/score-jev-tiebreak.vitest.ts` under `.skilled/skills/system-skill-advisor/runtime/` exits 0 with cases where a row missing one of 3 rerun answers stays out of the sign test, a stub exit 3 after the gate prints `jev arm stopped: key rejected`, a stub that hangs past 90 s marks its row `unmeasured_timeout`, a `cli-deem` exit 4 whose recheck shows a new commit pair prints `deem arm stopped: model commit changed mid-run`, and a fake-server `--deem` run prints its own column with its order-flip rate and commit pair
- [ ] One keyed `--jev` run either prints `no headroom` and makes no call, or writes a `calls.jsonl` in which every line has a wall time, exit code, provider, model and status and prints one of two results: `underpowered` with accuracy, F1, Brier score and flip rate beside 0.9843, or wins, losses, ties, abstentions, unmeasured rows, the exact p, the aggregate flip rate, latency p50 and p95 and one verdict line of `keep`, `kill`, `inconclusive` or `underpowered`. One `--deem` run against the local server prints accuracy, F1, Brier score, a 5-bin ECE and a fitted temperature beside 0.9843 and, unless the census printed `no headroom` or `underpowered`, a Deem column with its order-flip rate, the commit pair and one verdict line
- [ ] `git status --porcelain` prints the same before and after each script run, and at close lists no changed path other than `score-jev-tiebreak.mjs`, `score-jev-tiebreak.vitest.ts`, this phase folder, system-skill-advisor's `SKILL.md`, README files, changelog, feature catalog, playbook and leaf manifest pair, the Hermes copy of that `SKILL.md` and the trigger index with its fixtures
- [ ] `validate.sh --strict` on this phase prints `RESULT: PASSED`
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
| Planning documents | Done | `spec.md`, `plan.md`, `tasks.md` and this goal authored from `001-deep-research/research/research.md` R1 and its proposed phase 002 |
| Amendment | Done | 2026-09-27, from the final synthesis `004-deep-research-expansion/research/research.md` section 13 (`### 002-advisor-jev-tiebreak-arm`), with its R1 and R21 records and What Not To Build rows 47, 52 to 54 and 66 to 68 |
| Amendment, round 3 | Done | 2026-09-27, for two backends per 007 `research.md` section 14 (`### 002-advisor-jev-tiebreak-arm (Planned, amended)`) and parent goal D1 and D5, with section 12's R1, R21, the shared two-backend gate contract, section 10's kill lines and conditions C2 to C7, C14 and C15 |
| Amendment, wave 3 | Done | 2026-09-28, for the wave 3 directive: parent `goal.md` D1, D4, D5 and D6 and its log row "New directive, wave 3". Rows below |
| Build | Pending | Nothing is built. The phase is Planned and released: parent D3 builds it third, after 008 and 016 |

### Amendment 2026-09-27

Source: the final synthesis, section 13. One line per changed requirement. IDs were kept and new ones added.

| ID | Change |
|----|--------|
| REQ-002 | Identity line before check 1, `jev arm skipped: version` plus a details line replaces `jev arm refused: expected jev 0.6.2`, and check 3 becomes `jev auth status --provider P` (C8, approved through the parent's amended D5) |
| REQ-003 | No key literal or key variable name, grep widened to `API_KEY\|TYPESAFE`, and one `--provider P` on check 3, `auth test` and every judgment |
| REQ-004 | Census over all 177 plus 64 skill-firing rows, alias-aware, with gold-first, gold-outside and top-3 columns, the power line before any billed call and `underpowered` at 1 to 4 movable rows (C3) |
| REQ-005 | The env is `capture-scorer-eval-baseline.mjs:35-46` exactly, adding `SPECKIT_SKILL_ADVISOR_FORCE_LOCAL`, `PYTHONDONTWRITEBYTECODE`, `VITEST` and the three lane deletes (C6) |
| REQ-006 | The vitest file joins the allowed changed paths |
| REQ-007 | Four-outcome rule over decided rows, gold-first rows included, movable wins and gold demotions printed apart, rerank comparator on held-out rows only (C2). Replaces the MRR-and-right@3 keep |
| REQ-008 | Aggregate flip rate of at most 0.10 replaces the 0.95 stability coefficient, and three different picks make a row `unstable` (C1) |
| REQ-009 | Adds pick and `none` probabilities, the `unmeasured_timeout` status, a provider-scoped `auth test` and p50 and p95 |
| REQ-010 | Decided only when all 3 reruns answer (C4), 90 s spawn cap (C7), `none` counted on gold-in-cluster rows (C5), `jev arm stopped: key rejected` on exit 3 after the gate |
| REQ-011 | Adds estimated input tokens and drops every dollar figure, including the risk table's (C9) |
| REQ-012 | The tau 0.03 split is reported without a veto |
| REQ-013 | New: the three zero-call comparators, confidence order, always-second and the held-out rerank |
| REQ-014 | New: research R21, the Gate 3 calibration, as a conditional arm |
| Other | Cost ceiling 723 judgments plus 1 `auth test`, not 456. Size 330 to 530 LOC plus about 50, not 150 to 200. Only `kill` closes the served forms. The stdin edge case now says an inherited terminal exits 2 |

### Amendment 2026-09-27, round 3, two backends

Source for every row: amended for two backends per 007 `research.md` section 14 and parent goal D1 and D5. Section 14 says each amendment waits for operator approval. The parent goal settles that: D1 binds every phase to Jev or Deem, D5 assigns amendments to an Opus 5.5 high leaf, and its fourth criterion requires 002 to carry the two-backend gate. No requirement ID was added.

| Item | Change |
|------|--------|
| Objective | A `choice` from `jev-cli` or the local Deem, zero model calls by default, and `--jev` and `--deem` arms each dormant unless their own checks pass (section 14 `:3`) |
| D2 | Scoped to the Jev arm. Its checks and skip lines are unchanged |
| D5 | One verdict per backend column, and a `kill` closes only that backend's served forms of R3 (section 14 kill row, section 10 kill lines) |
| D7 | R21's Deem half on every `--deem` run, the Jev half still only at `underpowered` (section 14 `:87`, REQ-014, C7) |
| D8 | New: the Deem gate from the shared contract, its four skip lines, no server start and no key (REQ-002, REQ-003) |
| D9 | New: at most 25 keys plus `none`, 3 option orders, order-flip rate at most 0.10, the commit pair on every call, a keep per commit pair, the exit 4 recheck (C2 to C5, REQ-010) |
| Criteria 1 to 5 | Stub `cli-deem` logs, two Deem skip lines, no key to `cli-deem`, the Deem vitest cases and one `--deem` run. Still seven criteria |
| `spec.md` | Every row of section 14 applied: `:3`, `:35`, `:49`, `:52-53`, `:73`, `:86`, `:87`, `:92`, `:97`, REQ-001 to REQ-004, REQ-007 to REQ-011, REQ-014, the six edge cases, SC-003, proof steps 1, 4 and 5, the kill line and the `:210` and `:216` risk rows. A second trace table records the changes |
| `plan.md`, `tasks.md` | The Deem gate, arm, exits, records, R21's Deem half and the column comparison. Tasks T027 to T037 added, and T005, T007, T011, T012, T024 and T025 amended in place |

### Amendment 2026-09-28, wave 3

Each row names its source. The round-3 row above says "D5 assigns amendments to an Opus 5.5 high leaf". That was the parent's D5 on 2026-09-27 and stays as history. D10 here states the D5 of 2026-09-28.

| Item | Source | Change |
|------|--------|--------|
| Keep Rule | Parent D4 | `spec.md` section 4 gains a Keep Rule fixed before any run. Its inputs are the baseline, the census, the rows, the 3 answers, the comparison rows, the decided rows and the comparators. Its thresholds run in a fixed order: `underpowered` below 5, then `kill`, then `keep` on all four conditions, then `inconclusive`. Its verdict line carries the backend and, for Deem, the commit pair, and `report.json` holds the same. Two gaps were closed, not redesigned: a win over a comparator is a higher MRR on the same rows, and a stopped arm prints no verdict |
| D5, REQ-007, SC-002, kill criterion, proof step 7 | Parent D4 | Point to the Keep Rule. Only a Deem `keep` unlocks 009, for its commit pair. Without one the phase still closes and records every verdict line |
| `plan.md` `verdict()`, first slice steps 10 and 11, T023, T025, T019, T042 | Parent D4 | The rule's order and line, three vitest cases for it and the verdict record handed to the orchestrator |
| D10, `plan.md` Build Roles, `tasks.md` notation | Parent D5 | Names the build orchestrator and the three executors with their models. The orchestrator session verifies, gets a cross-family review and commits, and it alone makes the live runs. No wording contradicted D5: a search of this folder for codex, gpt, `llmgateway`, Opus, builder, reviewer and release found only the history row above |
| D1, D10, scope, Files to Change, T038, T039, T040, T041 | Parent D6 | System-skill-advisor's `SKILL.md`, README, changelog, feature catalog and playbook join the file list through sk-doc. The changelog, catalog and playbook were missing. The two folder READMEs join because each tables its folder's files. The leaf manifest pair, the Hermes copy and the trigger index follow as generated files. Code follows `sk-code-opencode` |
| Criterion 6, REQ-006, proof step 6, T017, plan rollback | Parent D6 | Criterion 6 said only the two new files change. Parent D6 makes that untrue, so it now allows this phase folder, the D6 docs and their generated files, and it keeps the read-only proof as "the same before and after each script run". The other six criteria are unchanged |
| Risk, `SKILL.md` fields | Parent D6 | The projection reads `SKILL.md`'s `description` and Keywords line (`projection.ts:693-703`, `skill-markdown.ts:50`), so D1 and Files to Change keep both unchanged, and T041 rereads 53/70 after the doc commit |
| D1 check | Parent D1 | Confirmed, no change: D2 and D8 hold each backend's gate, REQ-003 gives Jev no secret and SC-003 keeps today's behavior with neither backend |
| Stale premises | Reread 2026-09-28 after merge `bbf2a8e4cd` | Every cited line of `ambiguity.ts`, `capture-scorer-eval-baseline.mjs`, `score-outcome-rerank.mjs`, `scorer-eval-baseline.json`, `types.ts`, `projection.ts`, `jev_cli/__init__.py` 0.6.2 and `deem_server.py` holds, and the three corpus hashes match the baseline. One citation was off by one: `deem_server.py:222-230` is now `:223-231`. The Deem source commit on disk moved from `6755b30` to `7cf293f` with `serve/` unchanged, recorded as a risk |

### Deviations and findings

| Item | Note |
|------|------|
| Option-order scheme (research question 46) | Section 14 asks REQ-008 to fix the scheme before the arm runs and names rotations, a reversal or seeded shuffles. This leaf chose three left rotations of the scorer's order with `none` last: no seed to record, every option takes three positions, and an eligible row always has at least 3 options, so the orders differ |
| Jev-half calibration question | The Deem half now runs at every census result, so the open question about `no headroom` narrows to the Jev half |
| Column comparison power | At most 55 movable rows cannot resolve a 0.10 gap between backends (C6, about 137 rows needed, lineage-reported). The comparison is still printed, with its one-sided bound, and is expected to be wide |
| Phase number | `spec.md` still says Phase 2 of 6. The parent now binds nine phases. Section 14 does not change the number, so it was left for the orchestrator |
| Level 1 has no `acceptance-criteria.md` | The criteria above come from the `spec.md` requirements REQ-001 to REQ-014 and its proof plan |
| Scaffold title | The scaffold titled every document "Phase 1". This phase is Phase 2, now of 6, as this title and the `spec.md` metadata say |
| Criteria in the objective | The objective stays one sentence. The criteria reach the evaluator verbatim through the chat slice, which carries section 3 unchanged |
| Vitest file location | The synthesis puts the test file beside the script. The advisor's `vitest.config.ts` includes only `tests/**/*.vitest.ts`, so a file there would never run. It goes to `tests/parity/`, where `capture-ledger-workspace-root.vitest.ts` already tests a routing-accuracy script |
| Calibration trigger | The synthesis triggers R21 on `underpowered` only, while its value line promises a latency number even with no headroom. The phase follows the trigger as written and lists the question in `spec.md` section 7 |
| Criteria count | Six became seven: the vitest criterion carries the missing-answer, key-rejected and hang cases that the old exit criterion lacked |
| Conflict: corpus privacy stop (2026-09-28) | `spec.md` section 7 has the operator decide whether any corpus prompt is private before the first keyed Jev run. Parent D7 stops the build only for an install yes or a missing credential. Named for the orchestrator, not resolved |
| Conflict: file scope (2026-09-28) | The old D1 and criterion 6 allowed two new files and nothing else. Parent D6 requires the skill docs, and the parent's precedence rule puts its decisions above child detail, so D1 and criterion 6 were amended with the reason above |
| Keyed Jev run (2026-09-28) | Whether a Jev key exists for provider P is UNKNOWN: this pass called no `jev`. Without one, the fifth criterion's keyed run cannot happen, and parent D7 makes that a stop for the operator |
| Packet budget | `goal.cjs packet` prints `packet_budget=unknown` for this folder, before and after this pass. A plain phase child carries no durable-slice budget (`goal-slice.cjs:407-409`), so no edit here can make it print `ok` |
<!-- /ANCHOR:log -->
