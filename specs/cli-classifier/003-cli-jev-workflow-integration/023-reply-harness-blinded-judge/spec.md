---
title: "Feature Specification: Phase 23: reply-harness-blinded-judge"
description: "Measure offline whether a Jev or Deem score per rubric dimension agrees with the operator's grades of masked replies from the sk-communication reply harness more often than the harness's own mechanical scores do. A zero-call census prints the masked replies, the mechanical baseline and a label gate of 20 operator-graded replies before any model call. Built and closed at its label gate on 2026-09-29, commit b5e71ae777."
trigger_phrases:
  - "reply harness blinded judge"
  - "reply harness judge agreement"
  - "judge-agreement script"
  - "masked reply grading"
  - "research R6 blinded judge"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 23: reply-harness-blinded-judge

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-09-29 |
| **Branch** | `worktrees/069-cli-jev-workflow-integration` |
| **Parent Spec** | ../spec.md |
| **Phase** | 23 of 35 |
| **Predecessor** | 022-alignment-folder-suggestion |
| **Successor** | 024-hallucination-grader |
| **Handoff Criteria** | The zero-call census has printed the masked, distinct, matched and labeled reply counts, the mechanical baseline's agreement and either a `stop:` line, `no headroom` or the planned calls. Once the operator has graded at least 20 replies, a `--deem` or `--jev` run prints one `verdict <backend>:` line per column or that backend's skip line. The verdict goes in `goal.md`'s log for the parent goal's log. No later phase waits on it |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 23** of the Later classifier items as test phases specification. It tests research item R6, the reply-harness blinded judge, which the round-3 synthesis kept `later` (`../007-classifier-deep-research/research/research.md`, section 12 ranking row 10 and the carried table "R3 to R18 and R22"). Its full record is R6 in `../001-deep-research/research/research.md` section 11. The operator asked on 2026-09-29 for one phase per later item "so we can test everything".

**Scope Boundary**: One new read-only script in the reply harness, its test file, one README row and sk-communication's skill docs under parent goal D6. It changes no harness script, rubric, case set or release-gate condition, so the harness and its release gate behave as today by construction.

**Dependencies**:
- Released on 2026-09-29, when the operator's "Bind and release" amended parent goal D3. Phases 019 to 035 build in number order, and disjoint builds may run in parallel.
- Phase 008 (`008-cli-classifier-hub`, Complete): the `cli-deem` client and its `health` check, which the Deem arm spawns.
- The recorded harness runs. Three blind runs are committed under `specs/sk-communication/006-sk-communication-clarity/005-verification-and-rollout/runs/`: `blind/`, `sonnet/blind/` and `attempt-1/blind/`, 14 masked files each.
- The operator's grades of at least 20 distinct masked replies, the label gate. No model writes a grade, as parent goal D4 rules for phases 003 and 006.
- For the Jev arm only: `jev` 0.6.2 on `PATH` and a credential that `jev auth status --provider <P>` resolves, where P is `JEV_PROVIDER` when set and `official` otherwise.
- For the Deem arm only: the served Deem passing `cli-deem health`.

**Deliverables**:
- `judge-agreement.mjs` (proposed) in `.skilled/skills/sk-communication/benchmark/reply-harness/`, with the zero-call census, a `--deem` arm and a `--jev` arm (proposed switches)
- `judge-agreement.test.mjs` (proposed) beside it, against a fixture run and stub `cli-deem` and `jev` binaries
- One zero-call census report and, once the label gate passes, one `--deem` report with its `calls.jsonl`, plus a `--jev` report when the operator passes `--jev`, in a directory the operator names
- sk-communication's `SKILL.md`, `README.md`, changelog, feature catalog and manual testing playbook, updated through sk-doc (parent goal D6)

**Changelog**:
- The parent packet has no `../changelog/` folder, so at close there is no matching file to refresh, as for phase 017.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The reply harness masks two conditions' replies so that "a judge, human or model," can read them blind (`.skilled/skills/sk-communication/benchmark/reply-harness/README.md:11`). No script calls a model (`:3`), and the judge "scores by `rubric.json` outside these scripts" (`:20`). The release gate reads only printed lines from `compare.mjs` and names the missing blind human study as its gap (`release-gate.md:11`, `:13-15`). So a reply-rule change is compared on mechanical predicates alone, and nobody has measured whether those predicates agree with a human reader.

The research ranked R6 `later` for one reason: no gold. Its record says no judge can be trusted before a human-scored subset of about 20 masked replies exists, and its promote line is that subset. The record also said no harness run was recorded (seat-reported). That part no longer holds. On 2026-09-29 this leaf counted three committed blind runs holding 42 masked files, 38 distinct reply texts by SHA-256, and every one matches a committed reply file. Each run's `results/` files hold the mechanical `dimensionScores` of `score.mjs` per reply. No operator grade exists for any of them, so the missing piece is still the gold.

### Purpose
Produce one agreement number per backend column, against the operator's grades on the rubric's seven dimensions, compared with the mechanical scorer's agreement on the same replies under a keep rule fixed here. A zero-call census prints the baseline and stops at the label gate first, and a run without `--deem` or `--jev` changes nothing.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A zero-call census over masked directories the operator names (`--masked <dir>`, repeatable). Each masked file is joined through its reply text's SHA-256 to a committed reply file under the replies directories the operator names (`--replies <dir>`, repeatable), so a stale path in `order-sealed.json` never decides the join. `attempt-1/blind/order-sealed.json` names `runs/before-replies` and `runs/after-replies`, not the `attempt-1/` directories, which is why the join reads text.
- A mechanical baseline: `score.mjs`, unchanged, run over each named replies directory into a temporary `--out` file outside the repository, and each reply's seven `dimensionScores` mapped to three levels (REQ-003).
- A labels file the operator writes (REQ-004) and a label gate of 20 graded distinct replies.
- A Deem arm behind `--deem` and a Jev arm behind `--jev`. Each asks one `score` per reply per dimension over the same three levels, under a pre-registered keep rule applied to its own column (section 4, Keep Rule).
- Jev first, then Deem, the parent's order (parent goal D1). Each arm runs only on its own switch and its own checks. With both switches set and both checks passing, both columns run, each with its own verdict. A failed check never starts the other arm.
- A per-dimension agreement table for every column that ran, reported and never deciding.
- A per-call JSONL shared by both arms, and a report written to a directory the operator names.
- sk-communication's skill docs under parent goal D6, written through sk-doc.

### Out of Scope
- Serving a judge, or feeding any model grade into `score.mjs`, `compare.mjs` or the release gate. Offline only. Serving needs a later phase and a `keep`, and opening one is the operator's call.
- Editing `blind.mjs`, `score.mjs`, `compare.mjs`, `generate-prompts.mjs`, `rubric.json`, `cases.json` or `release-gate.md`.
- Writing a grade with a model. The operator grades every labeled reply.
- Generating new replies. The census reads committed or operator-named replies only.
- Failover between backends, a global switch or a shared client library. The script spawns `jev` and `cli-deem` as binaries.
- A dollar figure in any cost line.

### Files to Change

Owner of every path below: `sk-communication`. The build follows that owner's `benchmark/reply-harness/README.md` conventions and sk-code's OpenCode route for the code. The skill docs go through sk-doc's modes (parent goal D6). Code comments carry no spec path, phase number or requirement id.

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/sk-communication/benchmark/reply-harness/judge-agreement.mjs` | Create | Census, mechanical baseline, label gate, both arms and the per-column verdicts. Proposed name, Node standard library only |
| `.skilled/skills/sk-communication/benchmark/reply-harness/judge-agreement.test.mjs` | Create | `node --test` cases against a fixture run and stub `cli-deem` and `jev` binaries. Proposed name. T002 confirmed `node --test`, because the harness shipped no test file at planning |
| `.skilled/skills/sk-communication/benchmark/reply-harness/README.md` | Modify | One "What each piece does" row and one run-order step naming the script, its zero-call default and its two switches |
| `.skilled/skills/sk-communication/SKILL.md` | Modify | One sentence naming the offline judge measurement. A search for `reply-harness` in `SKILL.md` finds nothing today, so sk-doc places the sentence (parent goal D6) |
| `.skilled/skills/sk-communication/README.md` | Modify | One line naming the script and its switches (parent goal D6) |
| `.skilled/skills/sk-communication/changelog/v<next>.md` | Create | The next version file after the newest at build time (`v1.3.0.0.md` at planning), through `sk-create-changelog` |
| `.skilled/skills/sk-communication/feature-catalog/evaluation-and-observability/<entry>.md` and `feature-catalog/feature-catalog.md` | Create and Modify | One catalog entry (name chosen at build) and its index row, through `sk-create-feature-catalog` |
| `.skilled/skills/sk-communication/manual-testing-playbook/release-gating/<scenario>.md` and `manual-testing-playbook/manual-testing-playbook.md` | Create and Modify | One scenario covering the zero-call census and a stub-backend skip, plus its index row, through `sk-create-manual-testing-playbook` |
| `.skilled/skills/sk-communication/benchmark/reply-harness/{score.mjs,rubric.json,cases.json}` | Read only | `score.mjs` is spawned unchanged for the baseline. `rubric.json` supplies the seven dimension ids and their `judgeGuidance` text |
| `specs/sk-communication/006-sk-communication-clarity/005-verification-and-rollout/runs/` | Read only | The three committed blind runs and their six replies directories |
| `<operator-named labels file>` and `<operator-named report dir>/` | Read, and create at run time | The operator's grades, and `report.json` plus `calls.jsonl` from a run with a model arm |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The default run makes zero model calls | Without `--deem` or `--jev` the script prints the census, the baseline, the `margin: 0.10` and `keep rule:` lines, the power line and one of `stop: fewer than 20 labeled replies`, `no headroom` or `planned calls:`. It never spawns `cli-deem` or `jev` and writes no file. Stub `cli-deem` and `jev` binaries first on `PATH`, each appending one line per call to its own log, log nothing |
| REQ-002 | The census joins by reply text and counts honestly | It prints `masked`, `distinct`, `matched` and `unmatched` counts. A masked file's reply is the text after its `Reply A:` or `Reply B:` line, trimmed, and it matches a reply file whose trimmed text has the same SHA-256. An unmatched reply leaves the labeled set and is counted. On the three committed runs the expected counts are 42 masked, 38 distinct and 38 matched |
| REQ-003 | The mechanical baseline is today's harness score on three levels | For each matched reply the baseline reads the seven `dimensionScores` that `score.mjs` gives its committed file. A score of 0 maps to `absent`, 1 to `fully met` and anything strictly between to `partly met` (proposed mapping). The report prints the baseline's agreement with the operator over all labeled cells and per dimension |
| REQ-004 | The labels are the operator's and the gate is fixed | The labels file is JSONL with one row per graded masked file: `masked`, a path relative to the repository root, and `grades`, all seven dimension ids from `rubric.json`, each `absent`, `partly met` or `fully met`. A row with a missing dimension or another value exits 2 naming the row. Two rows whose replies share a SHA-256 must agree, else the script prints `stop: label conflict` and exits 2. With fewer than 20 graded distinct matched replies it prints `stop: fewer than 20 labeled replies` and no arm calls. The report prints the labels file's SHA-256 |
| REQ-005 | The keep rule is fixed before any model run and applies per backend column | Section 4, Keep Rule, verbatim. Changing it after the first model run is an amendment that voids every earlier verdict |
| REQ-006 | The Deem arm is dormant unless `--deem` is set and the Deem check passes | `cli-deem health` within 2,000 ms: HTTP 200, `status` `ok`, model `deem-0.8-v1` and a backend other than `stub`. It prints the backend, the model id and the commit pair. Failures print `deem arm skipped: not reachable`, `deem arm skipped: stub backend`, `deem arm skipped: model` with a details line naming the id found, or `deem arm skipped: bad health response`. Each skip leaves the census and any Jev column byte-identical and exits 0. The script never starts the server |
| REQ-007 | The Jev arm is dormant unless `--jev` is set and phase 002's Jev gate passes | One identity line first: the resolved `jev` path and provider P. Then `command -v jev` (else `jev arm skipped: jev not on PATH`), `jev --version` printing exactly `jev 0.6.2` (else `jev arm skipped: version` and a details line) and `jev auth status --provider P` exiting 0 (else `jev arm skipped: no credential`). Each skip leaves the census and any Deem column byte-identical and exits 0. The same `--provider P` goes to that check, to one `jev auth test --provider P` at the arm's start and to every judgment |
| REQ-008 | Read-only, offline and no key | After every run `git status --porcelain` is the same as before it, except an operator-named report directory inside the repository. The script never reads, stores, logs or passes a key. `grep -nE 'API_KEY\|TYPESAFE\|Bearer\|Authorization'` on the script returns no match. When any named masked file is not tracked by git, the Jev arm needs `--accept-payload` (proposed), else it prints `jev arm skipped: payload not accepted` and a requested Deem arm still runs. The committed runs are tracked, so their payload class prints as committed masked replies |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-009 | The call shape is fixed and shared | Each call is `score` with the masked file's full text as state on stdin, closed after writing, one `-q` per dimension equal to that dimension's `judgeGuidance` in `rubric.json`, verbatim, and three levels in this order: `absent`, `partly met`, `fully met`. The answer's position rounds to the nearest of 0, 1 and 2, and a value outside 0 to 2 is `unmeasured`. The report prints one SHA-256 over the seven questions and the three levels. Deem asks each cell once. Jev asks each cell three times with no answer cache |
| REQ-010 | Every call and exit has one handling, and the cost prints first | Before its first call the Deem arm prints "nothing leaves the machine", its planned calls (7 times the labeled replies) and a wall time at 60.2 ms per call, labeled as the 3-level `score` p50 in `deem-local.md`. Before `jev auth test` the Jev arm prints the payload class, its planned calls (21 times the labeled replies, plus 1) and the estimated input tokens, never a dollar figure. `calls.jsonl` holds one line per call: reply SHA-256 prefix, dimension, rerun index, wall ms, exit code, backend, position and a status of `measured`, `unmeasured` or `unmeasured_timeout`. Deem lines add model id, model commit and source commit. Jev lines add `jev` version, provider and model. Deem exits: 1 or HTTP 400 `unmeasured`, 2 stops the arm, 3 prints `deem arm stopped: backend refused`, 4 rechecks health once (a changed pair prints `deem arm stopped: model commit changed mid-run`, a gone server `deem arm stopped: server gone`, a passing recheck retries the call once), 130 stops the arm as `interrupted`. Jev exits: 1 or unparseable stdout `unmeasured`, 2 stops the arm, 3 after the gate prints `jev arm stopped: key rejected`, 4 gets one backoff retry then `unmeasured`, a spawn past 90 s is killed as `unmeasured_timeout`, 130 stops the arm. A stopped arm prints finished replies as `partial` and no verdict. `--deem` or `--jev` without `--out <dir>` exits 2 before any call |
| REQ-011 | A keep holds only for what it was measured on | The report records the Deem commit pair or the Jev version, provider and model per column. When `--out` already holds a `report.json` measured on another pair, the run prints `requalify: model commit changed`, and on another Jev provider or model `requalify: model changed`, before its own verdict |
| REQ-012 | The per-dimension table is reported, never deciding | For each column that ran, the report prints agreement per dimension beside the baseline's. It changes no verdict |
| REQ-013 | Tests cover every public surface | `node --test` on the test file exits 0 with at least 18 passing cases: a happy path and one edge case each for the census join (an unmatched reply), the labels parser (a missing dimension, a conflict), the baseline mapping (a fractional score), the label gate (19 graded prints the stop line), headroom (a saturated fixture prints `no headroom`), the default run (stubs log nothing), the Deem gate (a fake health passes, a stub backend skips byte-identical), the Jev gate (exit 0 passes, exit 3 prints `jev arm skipped: no credential`), the payload gate (an untracked masked file without `--accept-payload` skips Jev and still runs Deem), `--out` missing (exit 2 before any call) and the verdict (`keep` on stub answers, `stop (margin)`, `kill` and `stop (coverage)`), plus a Jev `stop (flips)` case and one `--provider` value on every logged `jev` call |
| REQ-014 | The changed skill's docs stay true to the code (parent goal D6) | sk-communication's `SKILL.md`, `README.md`, one new changelog file, one feature-catalog entry with its index row and one playbook scenario with its index row each name the script, its zero-call default and its two switches, written through sk-doc. `validate_document.py` exits 0 on each changed doc. No doc claims a verdict the runs did not print |

### Keep Rule (fixed 2026-09-29, before any model run)

**Inputs.** K is the count of graded distinct matched replies (REQ-004). A reply is measured in a column when all seven of its cells returned a level, and for Jev all three reruns of each cell. M counts measured replies, so a column is judged on 7M cells. On each measured cell the column's level is its answer, for Jev the modal level of the three reruns, and three different levels make the cell `unstable`, which counts as a disagreement. A counts the cells where the column's level equals the operator's grade. B counts the cells where the baseline's level equals it, over the same measured replies. W counts the measured replies where the column agrees on more cells than the baseline, and L those where it agrees on fewer. F, for Jev only, sums each cell's non-modal reruns, 3 minus the count of its most common level.

**Checks, in this order.** The first that fails sets the verdict.
1. Coverage: `10*M >= 9*K`, else `stop (coverage)`.
2. Kill: when the exact one-sided binomial p_loss, the chance of L or more successes in W+L fair trials, is below 0.05, the verdict is `kill`, because the baseline agrees with the operator more often.
3. Margin: `10*(A-B) >= 7*M`, a gain of at least 10 points of the measured cells, else `stop (margin)`.
4. Sign test: p_win, the chance of W or more successes in W+L fair trials, is below 0.05, else `stop (sign test)`. Both p values are 1 when W+L is 0.
5. Flips, for Jev: `10*F <= 21*M`, a flip rate of at most 0.10 over its 21M calls, else `stop (flips)`. For Deem this check prints `flips: n/a (commit pair)`: a Deem `score` has no rerun clause and its stability is the commit pair (research C4, `../007-classifier-deep-research/research/research.md:88`), because the served model returned the same answer in 40 of 40 repeats (`../007-classifier-deep-research/context/deem-local.md:92`).

Otherwise the verdict is `keep`. Counts stay integers and p is computed exactly, so no rounding decides a verdict. When the baseline agrees on more than 90 percent of labeled cells, a 10-point gain cannot fit, so the census prints `no headroom` and neither arm calls. The power line states the fewest wins a keep needs: 5 with no loss, since 0.5^5 is 0.031.

**The verdict line.** One line per column on stdout and in that column of `report.json`:

`verdict <jev|deem>: <keep|kill|stop (<reason>)> K=<k> M=<m> A=<a> B=<b> W=<w> L=<l> F=<f|n/a> p_win=<p> p_loss=<p> labels_sha256=<hash>`

The Deem line adds `model=<id> model_commit=<sha> source_commit=<sha>` from `cli-deem health` at the gate. The Jev line adds `jev_version=0.6.2 provider=<P> model=<model>` from `jev auth test`. Only a verdict from a live `--out` run counts. A stub, fake-server or test verdict never does. A `keep` serves nothing: using a judge anywhere needs a later phase, and opening one is the operator's call. A `kill` is evidence against that backend's judge for this harness. A stopped arm prints its stop line and no verdict.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Before any model call, the operator reads how many masked replies exist, how many are distinct and graded, how often the mechanical scores agree with the grades and whether a 10-point gain fits.
- **SC-002**: Past the label gate, one `--deem --out <dir>` run prints `verdict deem:` with its commit pair and a per-call record, so R6 is settled on a counted number. A `--jev` run, when the operator asks for one, does the same for Jev.
- **SC-003**: A run with neither switch, or with every requested check failing, calls nothing and changes nothing.

### Proof Plan

Written before the build. Each check names its command and the boundary it exposes. Paths are relative to `.skilled/skills/sk-communication/benchmark/reply-harness/`, and R is `specs/sk-communication/006-sk-communication-clarity/005-verification-and-rollout/runs`.

1. `node judge-agreement.mjs --masked $R/blind --masked $R/sonnet/blind --masked $R/attempt-1/blind --replies <each of the six replies dirs>` with stub binaries first on `PATH` exits 0, prints `masked: 42`, `distinct: 38`, `matched: 38` and `stop: fewer than 20 labeled replies`, and both stub logs stay empty. Boundary: a fixture with one edited reply prints `unmatched: 1`.
2. With a fixture labels file of 20 graded replies, the census prints the baseline agreement and `planned calls:`. Boundary: 19 graded replies print the stop line, and a saturated fixture prints `no headroom`.
3. `--deem` with a stub `cli-deem health` reporting backend `stub` prints `deem arm skipped: stub backend`, and `--jev` with a stub whose `auth status --provider official` exits 3 prints the identity line, then `jev arm skipped: no credential`. Each exits 0 with the rest of stdout byte-identical to the default run.
4. `node --test judge-agreement.test.mjs` exits 0 with at least 18 passed and 0 failed.
5. After each run `git status --porcelain` matches its pre-run output, and the secret grep of REQ-008 prints nothing.
6. Past the label gate, one live `--deem --out <dir>` run prints one `verdict deem:` line, and every `calls.jsonl` line holds `wallMs`, `exitCode`, `modelId`, `modelCommit` and `sourceCommit`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The operator's grades | High. Without 20 graded replies no arm runs | The census stops at the label gate and prints how many replies are graded. The phase closes at that gate if the grades never arrive, as 003 and 006 did |
| Dependency | Release and backends | The operator released the phase on 2026-09-29, so the build can start. An arm cannot run without its backend | Parent goal D3, amended by the operator's "Bind and release", releases this phase. Builds run in number order, and disjoint builds may run in parallel. Each arm prints its skip line and the operator runs `deem-ctl start` or sets a key, never the script |
| Risk | 38 distinct replies over 7 cases and 2 models are a small, clustered set | Med. Replies to the same case share wording, so agreement may not carry to new cases | The sign test counts replies, not cells, and the report prints per-dimension and per-case counts. A keep names what it was measured on |
| Risk | The three-level mapping of mechanical scores is a proposal | Med. Most mechanical scores are 0 or 1, and only `mechanical-tells` is fractional in the recorded results | The mapping is fixed here before any run and printed in the report. Changing it is an amendment |
| Risk | A masked file carries the case prompt beside the reply | Low. The judge sees the prompt a human rater sees | The state is the masked file as `blind.mjs` wrote it, the same text a human judge reads (`README.md:11`) |
| Risk | Reply text leaves the machine on the Jev arm | Low for the committed runs, which sit in this public repository | The payload class prints first. An untracked masked file needs `--accept-payload`, and Deem keeps everything on the machine |
| Risk | A Deem update lands mid-run | Low | Exit 4 rechecks the commit pair and stops the arm with finished replies `partial`. A keep holds only for its pair (REQ-011) |
| Risk | The mechanical scanner behind `score.mjs` needs `python3` | Low | The census stops with exit 2 naming the failed `score.mjs` spawn, and never scores a reply without a baseline |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Who reads the agreement number, and what would a `keep` change? R6's record names the reply-rule comparison as the value (about 98 scores per run at 7 cases, 2 conditions and 7 dimensions, seat-002 arithmetic). No reader is named, so a `keep` serves nothing until the operator names one.
- Should a graded reply's blocking class (`rubric.json` `blockingClass`) be graded too? This phase grades the seven weighted dimensions only.
- Is three levels the right grain for the operator? The rubric's scale runs from 0, absent, to 1, fully met. A finer scale would need more labels per dimension to reach the same power.
<!-- /ANCHOR:questions -->

---
