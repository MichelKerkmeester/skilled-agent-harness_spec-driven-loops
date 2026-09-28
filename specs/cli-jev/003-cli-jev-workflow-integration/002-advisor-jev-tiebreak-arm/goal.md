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
    last_updated_at: "2026-09-28T15:55:00Z"
    last_updated_by: "closure-leaf"
    recent_action: "Closed from build and session evidence, 7 of 7 criteria ticked"
    next_safe_action: "Orchestrator commits the phase docs"
    blockers: []
    key_files:
      - "specs/cli-jev/003-cli-jev-workflow-integration/002-advisor-jev-tiebreak-arm/spec.md"
      - "specs/cli-jev/003-cli-jev-workflow-integration/002-advisor-jev-tiebreak-arm/scratch/w3-build/build-evidence.md"
      - ".skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-jev-tiebreak.mjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-cli-jev-003-workflow-integration"
      parent_session_id: null
    completion_pct: 100
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

- [x] `score-jev-tiebreak.mjs` exists in `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/`, and a run without `--jev` prints eligible, movable, gold-first, gold-outside and top-3 counts for the 177 labeled and 64 holdout skill-firing rows, holdout top-1 `53/70`, MRR, right@1 and right@3 for the scorer, confidence order, always-second and the outcome-weighted rerank, and a power line, then exits 0 while stub `jev` and `cli-deem` binaries first on PATH log zero invocations
- [x] With `--jev`, a line naming the `jev` path and the provider prints first, a stub whose `jev auth status --provider <that provider>` exits 3 makes the script print `jev arm skipped: no credential`, and a stub whose version line is not `jev 0.6.2` makes it print `jev arm skipped: version`. With `--deem`, a stub `cli-deem health` reporting a stub backend prints `deem arm skipped: stub backend`, and one reporting model `deem-1.5` prints `deem arm skipped: model`. Each run exits 0 with census output identical to the default run, and the stub logs show no judgment call
- [x] `grep -nE 'API_KEY|TYPESAFE'` on `score-jev-tiebreak.mjs` returns no match, in a stub run that passes the Jev gate every logged `auth status`, `auth test` and judgment call carries the same `--provider` value, and no logged `cli-deem` call carries a key or `--provider`
- [x] `tests/parity/score-jev-tiebreak.vitest.ts` under `.skilled/skills/system-skill-advisor/runtime/` exits 0 with cases where a row missing one of 3 rerun answers stays out of the sign test, a stub exit 3 after the gate prints `jev arm stopped: key rejected`, a stub that hangs past the spawn cap, 90 s by default and shortened by the test, marks its row `unmeasured_timeout`, a `cli-deem` exit 4 whose recheck shows a new commit pair prints `deem arm stopped: model commit changed mid-run`, and a fake-server `--deem` run prints its own column with its order-flip rate and commit pair
- [x] One keyed `--jev` run either prints `no headroom` and makes no call, or writes a `calls.jsonl` in which every line has a wall time, exit code, provider, model and status and prints one of two results: `underpowered` with accuracy, F1, Brier score and flip rate beside 0.9843, or wins, losses, ties, abstentions, unmeasured rows, the exact p, the aggregate flip rate, latency p50 and p95 and one verdict line of `keep`, `kill`, `inconclusive` or `underpowered`. One `--deem` run against the local server prints accuracy, F1, Brier score, a 5-bin ECE and a fitted temperature beside 0.9843 and, unless the census printed `no headroom` or `underpowered`, a Deem column with its order-flip rate, the commit pair and one verdict line
- [x] `git status --porcelain` prints the same before and after each script run, and the build commits `807ce287be` and `3d3885274d` with the trigger index commit `64968e9b58` change no path other than `score-jev-tiebreak.mjs`, `score-jev-tiebreak.vitest.ts`, this phase folder, system-skill-advisor's `SKILL.md`, README files, changelog, feature catalog, playbook with its scenario-count test `manual-testing-playbook.vitest.ts` and leaf manifest pair, the Hermes copy of that `SKILL.md` and the trigger index with its fixtures
- [x] `validate.sh --strict` on this phase prints `RESULT: PASSED`
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
| Build | Done | Released by the operator on 2026-09-28 (parent `goal.md` D3) and built third, after 008 and 016, from `scratch/w3-build/briefs/`. Committed as `807ce287be`, with the follow-up `3d3885274d` and the trigger index rebuild `64968e9b58`. Rows below |
| Baseline | Done | HEAD `10697dcceb`: advisor `npm run build` exit 0, full advisor suite 129 files, 971 passed, 6 skipped, typecheck clean, skill docs 9 of 9 `validate_document.py` exit 0, playbook 47 scenarios, skill-root metadata 16 of 16, Hermes 73 in sync. The trigger index was already stale on one 008 doc. Source: build record section 1 |
| Planning probe | Done | Read-only `probe-census.mjs`: holdout top-1 53/70, labeled 177 rows with 93 eligible and 22 movable, holdout 64 with 18 and 1, no cluster over 25. The built census printed the same numbers. Source: build record section 1 |
| Code briefs 01 to 18 | Done | 18 code briefs and one corrective brief, 12b, on Cursor and Devin, each `STATUS: DONE` on first dispatch with a tree diff holding only its allowed files. The vitest file grew 7 to 47 cases. Source: build record section 3 |
| Doc briefs 20 to 29 | Done | Pi, each `STATUS: DONE`: the two folder READMEs, the catalog entry and index, the playbook scenario and index, the inventory test 47 to 48, `changelog/v0.13.0.0.md`, `SKILL.md` 0.13.0.0 and the README row. `validate_document.py` exit 0 on each. Source: build record section 3 |
| Regeneration | Done | Leaf manifest pair `--fix` `fixed=1`, then 16 of 16. Hermes copy rewritten, then `PASS: 73`. Source: build record section 4 |
| Proof plan P1 to P7 | Done | All PASS from the final state: zero-call census, gate skips, one provider and no key, vitest cases, both live runs, identical porcelain and `validate.sh --strict`. Source: build record section 5 |
| Keyed Jev run | Done | 16:10:17 to 16:16:26, provider `official`, `jev auth status --provider official` exit 0 at the session's check. 334 calls, each line with wall time, exit code, provider, model and status. Latency p50 377 ms, p95 2830 ms. Source: build record section 5, session record |
| Deem server stop | Done | At 16:18 the server was down: the 12:15Z update restarted it inside a launchd job with no `AbandonProcessGroup`, so launchd killed it when the job exited. The session added the key to both plist copies, reloaded the job and restarted the server. The pair moved to `8cbabbb` / `c8a5523`. Source: session record |
| Review round 1 | Done | Claude `review` agent: FAIL, one P0 (a three-way split counted 2 flips, not 3) and two P1s (a Deem verdict printed before the `noul` pass, an exit-4 first attempt missing from `calls.jsonl` and p50/p95). Host confirmed the P0 against `spec.md` section 4. Source: session record |
| Fix briefs 30 to 34 | Done | Cursor: alias options made distinct for Deem, the flip count, the verdict after calibration, the retry record and `--jev` needing `--out`. Vitest 47 to 52. Source: build record section 10 |
| Deciding Deem run | Done | 16:59:13 to 17:01:05, after the fixes: 528 calls, one commit pair on every line, calibration beside 0.9843, porcelain unchanged. Source: build record section 10, session record |
| Review round 2 and brief 35 | Done | FAIL on one P1: the `--jev` refusal ran before the census and the gate, so an unavailable Jev exited 2. Brief 35 moved it after `jevGate`. Host reproduced the P1 and then the fix. Source: session record, build record section 11 |
| Review round 3 | Done | PASS. The P1 closed on every path. Two new P2s: no test for the refusal's headroom branches, and `--deem` could call without `--out`. Source: session record |
| Build commit | Done | `807ce287be`, 443 files: 15 build paths and 428 record files, `*.log` streams excluded by `.gitignore:265`. Trigger index rebuilt from `git archive HEAD` as `64968e9b58`: `--check` exit 0, 23,314 documents, 0 stale. Source: session record |
| Follow-up briefs 36 to 40 | Done | `--deem` refuses without `--out` once its gate passes (36), tests for the Jev refusal at `no headroom` and `underpowered` (37), and the `--out` need in the catalog entry, README and changelog (38 to 40). Committed as `3d3885274d`. Source: build record sections 13 and 14, session record |
| Review round 4 | Done | PASS. The refusal adds no call before it, and the one doc P2 closed with briefs 39 and 40. No open P0 or P1. Source: session record |
| Host reruns from the final state | Done | Eval file 55 passed, exit 0. Full advisor suite 130 files, 1026 passed, 6 skipped, exit 0, against the 129 / 971 / 6 baseline: +1 file, +55 tests, 0 failures. Typecheck exit 0. Default run byte-identical. Source: session record |
| Phase docs | Done | Closure leaf, 2026-09-28: tasks, this log and `implementation-summary.md` record the evidence, and `spec.md` and `plan.md` carry the corrected premises. Gate results are in `implementation-summary.md` Verification |

### Deciding verdicts for phase 009

Both lines as printed. Neither is a `keep`, so this phase does not unlock 009, and that decision passes to phase 017.

| Backend | Verdict line | Source |
|---------|--------------|--------|
| Jev | `verdict: kill backend=jev decided=38 wins=11 losses=27 p_win=0.9975 p_loss=0.0069 flip=0.0153 provider=official model=jev-1.13.0` | `scratch/w3-build/runs/jev.stdout.txt`, build record section 5 |
| Deem | `verdict: kill backend=deem decided=38 wins=8 losses=30 p_win=0.9999 p_loss=0.0002 flip=0.3123 model=deem-0.8-v1 model_commit=8cbabbb2c4a7ef13c6b43f0ef3ae4157983c6d21 source_commit=c8a5523c5a7ead9a2132363edfcffd1ec86a6dbc` | `scratch/w3-build/runs/deem-review.stdout.txt`, the run after the fixes. Pre-fix Deem runs are VOID, kept under `runs/deem-void*` |

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
| Conflict resolved: corpus privacy (2026-09-28) | The session settled `spec.md` section 7's privacy stop under parent D7. The routing corpus, `labeled-prompts.jsonl`, `holdout-prompts.jsonl` and `ambiguity-prompts.jsonl`, is committed and on `origin/main` (`ec33385ae5e`), and `gh repo view` reports the repository `PUBLIC`, so the keyed Jev run disclosed nothing unpublished. Source: session record, conflicts table |
| Resolved: a Jev key exists (2026-09-28) | `jev auth status --provider official` exited 0 and `--provider openrouter` exited 3, so the keyed run used `official`. Source: session record |
| D-1: the playbook inventory test | `runtime/tests/manual-testing-playbook.vitest.ts` pins the scenario count and failed at 48, and `spec.md` Files to Change did not list it. Parent D6 requires the scenario and parent criterion 4 requires no new suite failure, so brief 26 changed its six `47`s to `48`. The host judged it a mechanical consequence of the new scenario (scope-discipline section 2), and the test diff is only the counts. Source: build record section 7, session record |
| D-2: changelog number | The spec said the entry follows `v0.11.1.0.md`, but `main` already carries `v0.11.2.0.md` and `v0.12.0.0.md` and its `SKILL.md` reads 0.12.0.0. The entry is `v0.13.0.0.md` and `SKILL.md` moved 0.11.1.0 to 0.13.0.0, so nothing collides on merge. Source: build record section 7 |
| D-3: literal text by sidecar | The three new docs run 30 to 95 lines, too long for a brief under 90 lines, so their text sat in `scratch/w3-build/content/` and the briefs had Pi copy it byte for byte, `cmp` exit 0 each. Source: build record section 7 |
| D-4: report directories inside the repository | T016 and T036 say `--out` outside the repository, and the build prompt named `scratch/w3-build/runs/`. REQ-006 allows a named directory inside the repository, and the porcelain was the same before and after each run. Source: build record section 7 |
| D-5: four live `--deem` runs | The build prompt allowed one. Four ran against the local server: skipped (server down), stopped (exit 2 on a duplicate option description, fixed by brief 30), VOID (the old flip count) and the deciding run after the fixes. Nothing left the machine. Source: build record sections 7 and 10 |
| `--out` refusal the spec did not name | `--jev` and `--deem` now exit 2 without `--out` once their gate passes and they would call, so every call is recorded (REQ-009). A failed gate still exits 0 with the census (parent D1). Round 1 raised it for `--jev` (brief 34), round 2 moved the refusal after the gate (brief 35) and round 3 raised it for `--deem` (brief 36). Source: session record, build record sections 10, 11 and 13 |
| Alias options for Deem | `memory:save` and `command-memory-save` share one projection description, and `cli-deem` refuses two options with the same text. Brief 30 appends ` [key]` to a description shared inside one cluster, in the Deem arm only. Jev maps options by key and was unaffected. Source: build record section 10 |
| Index regeneration | The build leaf rebuilt the trigger index from the working tree and moved two gitignored local sweep-report files aside and back to keep them out of `corpus-manifest.json`, sha1 identical before and after. The session left those four index files out of the build commit and rebuilt them from `git archive HEAD` as `64968e9b58`. Source: build record section 4, session record |
| Jev run not repeated after the fixes | The keyed run predates briefs 31 to 37. Its `calls.jsonl` has no exit 4 and no three-way row, so fixes 31 and 33 do not change it, and a recompute with the fixed code gives the same verdict line byte for byte (`runs/jev-recheck.txt`). No second paid run was made. Source: build record section 10, session record |
| Interpretation choices | The column comparison uses a one-sided 95% normal-approximation bound, printed both ways. A Jev calibration label counts only when all 3 passes return a probability, and its pair uses their mean. "Zero stub calls" after a refusal means zero billed calls, because the gate's `--version` and `auth status` still run. The build's third choice, a verdict printed before a stopped `noul` pass, was reversed by brief 32. Source: build record sections 7, 10 and 11 |
| Stale premise: the rerank module | `score-outcome-rerank.mjs:38` imports `outcome-weighted-rerank.js`, which commit `6b99eb68d2` deleted, so that script no longer runs. The eval inlines the blend. `plan.md` now says so. Source: build record section 8, closure pass `ls` |
| Stale premise: the Deem commit pair | The hand-off named `8cbabbb` / `7cf293f`. The 12:16:22Z update moved the source to `c8a5523`, and the deciding run's line carries `8cbabbb` / `c8a5523`. Corrected in the `spec.md` risk row. Source: build record section 8, session record |
| Stale premise: Files to Change | The table omitted the playbook inventory test (D-1) and left the new entry names open. It now lists the test and names `tie-break-eval.md` and `v0.13.0.0.md`. Source: build record section 8 |
| Criterion 4 amended at close | It said "a stub that hangs past 90 s". The test injects a 1,500 ms cap so the suite does not wait 90 s, and its stub sleeps 30 s. The 90 s default is `deps.timeoutMs ?? 90000` in `main()`, read, not run. The requirement, a spawn past its cap killed and marked `unmeasured_timeout` (REQ-010), is met, so the wording now names the cap. Source: closure pass, the vitest file and `score-jev-tiebreak.mjs:1544`. The operator can revert this amendment |
| Criterion 6 amended at close | It said `git status --porcelain` "at close lists no changed path other than" the allowed set. After the commits `git status` cannot show the build's paths, and in this shared tree it lists phase 017's concurrent files. The criterion now reads the three commits. It also names the playbook inventory test, the D-1 change the host accepted. Evidence: `git diff --name-only 31cf3bf2af HEAD`, this folder excluded, lists 19 paths, each on the amended list. Source: closure pass. The operator can revert this amendment |
| Devin permission mode | The session's pre-flight records that cli-devin requires explicit approval for `--permission-mode dangerous`, read as given by parent D5 with D7 and logged for the operator. This phase's dispatch records name only the executor, so whether its five Devin briefs used that mode is not recorded. Source: session record, `scratch/w3-build/logs/*.dispatch.txt` |
| Changelog not refreshed | The phase metadata asks for a refresh under `../changelog/`. The parent packet has no `changelog/` folder and no phase of this packet wrote one, so nothing was refreshed. Source: closure pass |
<!-- /ANCHOR:log -->
