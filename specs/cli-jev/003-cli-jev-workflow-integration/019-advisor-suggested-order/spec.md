---
title: "Feature Specification: Phase 19: advisor-suggested-order"
description: "Test research R3 offline: whether a Jev or Deem choice that reorders the skill advisor's whole near-tie cluster beats the scorer's own order and fits the hook's 2,200 ms advisor budget when timed inside a child like the one the hook spawns. Phase 002 printed kill on both backends for moving one pick first, so a zero-call run prints the order census and the advisor's own time before any call. Planned, released 2026-09-29."
trigger_phrases:
  - "advisor suggested order"
  - "near-tie cluster order"
  - "score-suggested-order"
  - "advisor child latency budget"
  - "r3 live form test"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 19: advisor-suggested-order

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Planned |
| **Created** | 2026-09-29 |
| **Branch** | `worktrees/069-cli-jev-workflow-integration` |
| **Parent Spec** | ../spec.md |
| **Phase** | 19 of 35 |
| **Predecessor** | 018-worktree-provision-shared-link |
| **Successor** | 020-routing-clarify-default |
| **Handoff Criteria** | The zero-call run has printed the order census, the MRR of the scorer's order and two zero-call comparators, the advisor-only child p50 and p95 against 2,200 ms and either `no headroom` or the planned calls. Then each model run the operator asks for printed one `verdict jev:` or `verdict deem:` line with `keep`, `kill` or `stop (<reason>)`, or that backend's skip line. Every verdict line goes in `goal.md`'s log for the parent goal's log. A `keep` serves nothing |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 19** of the cli-jev workflow integration specification. It tests research R3, the advisor's suggested order inside the near-tie cluster, which is the live form of phase 002's question. The sources are `../007-classifier-deep-research/research/research.md` section 12 (the R3 row of the carried table, condition C11 and open questions 21 and 43) and the full record in `../001-deep-research/research/research.md` section 11 (`### R3.`). On 2026-09-29 the operator asked for one phase per later item "so we can test everything", so this phase ends in a measured verdict per backend rather than staying parked.

**Scope Boundary**: One new read-only measurement script beside phase 002's `score-jev-tiebreak.mjs`, its vitest file and the system-skill-advisor docs that parent D6 requires. It serves nothing, wires nothing into the prompt hook and changes no scorer, ratchet, corpus or hook file, so every live advisor path behaves as today by construction.

**Dependencies**:
- Phase 002 (`002-advisor-jev-tiebreak-arm`), Complete. This phase imports its exports read-only and treats its two verdicts as the prior (section 2).
- Phase 008 (`008-cli-classifier-hub`), Complete (`ee3a1b057c`), for `cli-deem` on the Deem arm only.
- For the Deem arm only: the served Deem passing `cli-deem health`. For the Jev arm only: the Python `jev-cli` 0.6.2 on `PATH` and a credential that `jev auth status --provider P` resolves, where P is `JEV_PROVIDER` when set and `official` otherwise.
- Release: released on 2026-09-29, when the operator's "Bind and release" amended parent D3. Phases 019 to 035 build in number order, and disjoint builds may run in parallel.
- Build roles: parent D5 (`plan.md` section 4). Skill docs: parent D6.

**Deliverables**:
- `score-suggested-order.mjs` (proposed) with a zero-call census, comparators, advisor-only child timing and power line by default, a `--jev` arm and a `--deem` arm (proposed switches)
- `tests/parity/score-suggested-order.vitest.ts` (proposed) with stub-`jev`, stub-`cli-deem` and synthetic-corpus cases
- One zero-call report and, for each switch the operator passes, one report with its `calls.jsonl` in a directory the operator names
- The system-skill-advisor docs of section 3, written through sk-doc
- Every verdict line recorded in `implementation-summary.md` and `goal.md`'s log

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The advisor marks a near-tie cluster. `applyAmbiguity` gives every passing recommendation within 0.05 of the passing top, on score or on confidence, an `ambiguousWith` list (`.skilled/skills/system-skill-advisor/runtime/lib/scorer/ambiguity.ts:7-8`, `:22-36`, `:44-58`), and the fused order decides who goes first inside it. R3 would put the cluster in a model's order live. The research parked it as later for two reasons: no measured win until R1 keeps, and latency. The prompt shim kills the advisor child at 2,500 ms and gives the advisor 2,200 ms of that (`.skilled/skills/system-spec-kit/runtime/hooks/claude/user-prompt-submit.ts:22-24`, `:106-111`), inside a 3 s hook (`.claude/settings.json:110`).

Phase 002 has answered the first reason for one form of R3. Moving the modal pick first printed `kill` on both backends, from its committed reports `../002-advisor-jev-tiebreak-arm/scratch/w3-build/runs/jev/report.json` and `runs/deem-review/report.json`:
- `verdict: kill backend=jev decided=38 wins=11 losses=27 p_win=0.9975 p_loss=0.0069 flip=0.0153 provider=official model=jev-1.13.0`
- `verdict: kill backend=deem decided=38 wins=8 losses=30 p_win=0.9999 p_loss=0.0002 flip=0.3123 model=deem-0.8-v1 model_commit=8cbabbb2... source_commit=c8a5523c...`

Under 002's kill criterion (`../002-advisor-jev-tiebreak-arm/spec.md` section 5), each kill closes that backend's served forms of R3 at that identity. Three parts of R3 stay untested:
- **The whole-cluster order.** 002 scored only the modal pick moved first. Both clients return a probability map: `cli-deem choice` rekeys it by option key (`.skilled/skills/cli-classifier/cli-deem/SKILL.md:104`), and 002 read Jev's map for the pick and `none` (`score-jev-tiebreak.mjs:1070-1072`). Whether Jev's map holds every submitted key is UNKNOWN until one recorded answer is read.
- **The budget inside the child.** 002's `choice` p95 was 340 ms on Deem and 2,830 ms on Jev (derived from its two `calls.jsonl` files, 333 calls each), timed from a standalone script. The advisor's own share of the 2,200 ms is UNKNOWN (research question 43). A Jev p95 of 2,830 ms alone exceeds 2,200 ms, so a Jev live form is expected not to fit. This phase measures that instead of inferring it.
- **Real-use value.** The shadow sink that would count live `ambiguousWith` events is opt-in (`runtime/lib/shadow/shadow-sink.ts:144-155`), and `runtime/data/` holds no `shadow-deltas.jsonl` (rechecked 2026-09-29, research question 21). The live frequency stays UNKNOWN here.

The corpus leaves little room. 002's census counted 111 eligible rows of 241 skill-firing rows, 23 movable, 76 gold-first and a decided-row ceiling of 99 (`../002-advisor-jev-tiebreak-arm/implementation-summary.md:66-75`).

### Purpose

Produce one verdict per backend that settles, offline, whether a model's whole-cluster order beats the best zero-call order and fits the 2,200 ms advisor budget when every call is timed inside a child spawned the way the shim spawns the advisor, with a zero-call run first that prints whether a win and a fit are reachable at all.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- A zero-call census over the 177 skill-firing rows of `labeled-prompts.jsonl` and the 64 of `holdout-prompts.jsonl`, through 002's `loadCensus` (`score-jev-tiebreak.mjs:252`) under its capture env: eligible, movable, gold-first and gold-outside rows, the decided-row ceiling and the power line.
- Zero-call orders scored with MRR, right@1 and right@3 on identical rows: the scorer's order, confidence order (`:350`) and always-second (`:360`). The outcome-weighted rerank prints on held-out rows beside them and never decides.
- Zero-call timing of the advisor alone. For every skill-firing prompt one child is spawned like the shim spawns the advisor (`process.execPath`, a 2,500 ms timeout and `SIGKILL`, `user-prompt-submit.ts:113-120`). It runs the built hook's exported `handleClaudeUserPromptSubmit` (`.skilled/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts:252`) under the capture env. The report prints p50, p95, max and the count of children past 2,200 ms. This answers research question 43.
- A Jev arm behind `--jev` and a Deem arm behind `--deem` (proposed). Per eligible row, three option orders: the three left rotations of the cluster keys plus `none` that 002 built for its Deem arm. Each `choice` runs inside a timed child that first runs the advisor for the row's prompt. The Deem child also runs one `cli-deem health` first. The Jev child runs no gate step, because a live form checks the Jev gate once per session.
- The row's order: cluster keys sorted by their mean probability over the three answers, ties kept in the scorer's order and placed through 002's `reorderSlots` (`:210`). When `none` has the highest mean, the row keeps the scorer's order and counts as an abstention.
- Jev first, then Deem (parent D1). With both switches set, the Jev column runs first. Each column stands alone and a failed gate never starts the other backend.
- The Keep Rule in section 4, fixed here before any model run, and one verdict line per column.
- A per-call `calls.jsonl` and a `report.json` in a directory the operator names.
- The system-skill-advisor docs parent D6 requires, through sk-doc.

### Out of Scope

- Any live, served or hook-time call, and any edit to the hook, `fusion.ts`, `ambiguity.ts`, `lane-registry.ts`, `shadow-sink.ts` or the ratchet. Serving an order needs a later phase and a `keep`, and opening it is the operator's call.
- Enabling the shadow sink or counting live `ambiguousWith` events (research question 21).
- Editing, or changing the behavior of, `score-jev-tiebreak.mjs`. This phase imports its exports only, so 002's verdicts stay reproducible.
- Widening the 2,500 ms kill or the 300 ms start margin (What Not To Build row 83).
- A shared client library, a global switch, the npm `jevctl` package or a dollar figure in any cost line.
- Writing `scorer-eval-baseline.json` or any corpus file.

### Files to Change

Owner of every code path below: `system-skill-advisor`. Code follows sk-code's OpenCode route and the docs go through sk-doc (parent D6). Code comments carry no spec path, phase number or requirement id.

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-suggested-order.mjs` | Create | Census, zero-call orders, advisor-only child timing, power line, both arms, the timed child and the verdicts. Proposed name. About 350 to 500 LOC (estimate) |
| `.skilled/skills/system-skill-advisor/runtime/tests/parity/score-suggested-order.vitest.ts` | Create | Synthetic-corpus, stub-`jev`, stub-`cli-deem` and timed-child cases. The package's vitest config includes only `tests/**/*.vitest.ts` |
| `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-jev-tiebreak.mjs` | Read only | Exports imported: `loadCensus`, `reorderSlots`, `reciprocalRank`, `rankMetrics`, `binomTail`, `confidenceOrder`, `alwaysSecondOrder`, `buildFold`, `rerankOrder`, `jevGate`, `deemGate`, `spawnCall` |
| `routing-accuracy/labeled-prompts.jsonl`, `holdout-prompts.jsonl`, `scorer-eval-baseline.json` | Read only | The rows and gold labels, and the pinned 53/70 |
| `.skilled/skills/system-skill-advisor/runtime/dist/**` | Read only | The built scorer and the built hook the child runs |
| `<operator-named report dir>/` | Create at run time | `report.json`, and `calls.jsonl` from a run with a model arm |
| `.skilled/skills/system-skill-advisor/SKILL.md` | Modify | Parent D6: the `version` line and a pointer to the new eval. The frontmatter `description` and the `<!-- Keywords: -->` line stay unchanged, because the projection reads both and a change could move 53/70 |
| `.skilled/skills/system-skill-advisor/README.md` | Modify | Parent D6: names the eval, its zero-call default and its two switches |
| `.skilled/skills/system-skill-advisor/changelog/v<next>.md` | Create | Parent D6: the next version file after the newest at build time, through `sk-create-changelog` |
| `feature-catalog/scorer-fusion/suggested-order-eval.md` and `feature-catalog/feature-catalog.md` | Create, Modify | Parent D6: one catalog entry (proposed name) beside `tie-break-eval.md` and its index row |
| `manual-testing-playbook/scorer-fusion/suggested-order-eval.md` and `manual-testing-playbook/manual-testing-playbook.md` | Create, Modify | Parent D6: scenarios for the default run and a gate skip, and the index row |
| `.skilled/skills/system-skill-advisor/runtime/tests/manual-testing-playbook.vitest.ts` | Modify | The test pins the playbook at 48 scenarios (`:45-55`), so a new scenario moves each pin to 49 |
| `runtime/scripts/routing-accuracy/README.md`, `runtime/tests/parity/README.md` | Modify | One row each for the new script and the new test |
| `leaf-manifest.json`, `leaf-aliases.json`, `.hermes/skills/system-skill-advisor/SKILL.md`, the trigger index and its fixtures | Regenerate | Rebuilt by their generators, as 002 did: `ci-skill-root-metadata.cjs --fix`, `sync-skills-hermes.cjs` and the index rebuild when its `--check` reports stale docs |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The default run makes zero model calls | Without `--jev` or `--deem` the script prints the census, the zero-call orders, the advisor-only timing and the power line, and never spawns `jev` or `cli-deem`. Stub `jev` and `cli-deem` binaries first on `PATH`, each appending one line per call to its own log, leave both logs empty |
| REQ-002 | Each arm is dormant unless its switch is set and its gate passes, once per run | The gates are 002's `jevGate` and `deemGate`, unchanged. Jev: an identity line with the resolved `jev` path and provider P first, then `jev arm skipped: jev not on PATH`, `jev arm skipped: version` with a details line, or `jev arm skipped: no credential` when `command -v jev`, `jev --version` printing `jev 0.6.2` or `jev auth status --provider P` fails. Deem: `cli-deem health` within 2,000 ms, else `deem arm skipped: not reachable`, `stub backend`, `model` with a details line or `bad health response`. A skip leaves the zero-call output and the other column byte-identical and exits 0. The script never starts the Deem server |
| REQ-003 | The script never handles a credential | It never reads, stores, logs or passes a key and holds no key literal or key variable name. `grep -nE 'API_KEY\|TYPESAFE\|Bearer\|Authorization' score-suggested-order.mjs` returns no match. The same `--provider P` goes to `auth status`, one `jev auth test` and every judgment. `cli-deem` gets no key |
| REQ-004 | Headroom and fit print before any call | The zero-call run prints the power line from 002's census and the advisor-only child p50, p95 and max. It prints `no headroom (movable)` below 5 movable rows and `no headroom (latency)` when the advisor-only p95 is above 2,200 ms. Either line stops both arms before any call |
| REQ-005 | The baseline reproduces the pinned number | Under 002's capture env the census prints holdout top-1 `53/70`. Any other number prints `baseline mismatch: comparison void` and no arm runs |
| REQ-006 | The phase is read-only and offline | A default run and each model run leave `git status --porcelain` as it was, except an operator-named report directory inside the repository. The corpus files, `scorer-eval-baseline.json`, the hook and 002's script are unchanged |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-007 | The call shape and the order are fixed | Options are the cluster keys and `none`, each described by the skill's projection description, as in 002. Both backends use the three left rotations 002 built for Deem (`score-jev-tiebreak.mjs:1255`), each a fresh call with no answer cache, so for Jev they are also its three reruns. The `-q` instruction is 002's `CHOICE_QUESTION`, "Which skill should handle this request?" (`:21`), printed verbatim before the first call. A row is measured only when all three answers carry a probability for every submitted key. A partial map marks the row `unmeasured` and never becomes a zero |
| REQ-008 | Every call is timed inside the child and recorded | Each call runs in a child spawned with `process.execPath`, a 2,500 ms timeout and `SIGKILL`. The child runs the advisor for the row's prompt, then for Deem one `cli-deem health`, then the `choice`. `calls.jsonl` holds one line per call with row id, order index, child wall ms, advisor ms, call ms, exit code, the full probability map and a status of `measured`, `unmeasured` or `unmeasured_timeout`. Deem lines add model id, model commit and source commit. Jev lines add the `jev` version, provider and model from `jev auth test`. A child killed at 2,500 ms marks its row `unmeasured_timeout` and counts toward the latency condition |
| REQ-009 | Every exit has one handling | 002's exit handling for both backends, unchanged: Jev 1 or a bad answer `unmeasured`, 2 stops, 3 after the gate `jev arm stopped: key rejected`, 4 one backoff retry. Deem 1 or HTTP 400 `unmeasured`, 2 stops, 3 `deem arm stopped: backend refused`, 4 one recheck with `deem arm stopped: server gone` or `model commit changed mid-run`. 130 stops as `interrupted`. A stopped arm prints finished rows `partial` and no verdict |
| REQ-010 | The operator sees the cost first | Before the first call the Jev arm prints its payload class (routing corpus prompts and skill projection descriptions, both committed), the planned calls (eligible rows times 3, plus 1) and the estimated input tokens. The Deem arm prints "nothing leaves the machine", the planned calls and an estimated wall time from the zero-call advisor p50 plus 002's measured Deem p50 of 241 ms. No line prints a dollar figure. `--jev` or `--deem` without `--out <dir>` exits 2 before any output |
| REQ-011 | Tests cover every public surface | `score-suggested-order.vitest.ts` exits 0 with a happy path and one edge case each: the order census on a synthetic corpus and `no headroom (movable)` at 4 movable rows, the zero-call orders and a tie kept in scorer order, the advisor-only timing and `no headroom (latency)` with a stub child over 2,200 ms, the order from a probability map and a `none`-first row kept as scorer order, a partial map marked `unmeasured`, both gates passing a stub and each skip line with byte-identical output, a child killed at 2,500 ms marked `unmeasured_timeout`, and the verdict printing `keep`, `kill`, `stop (margin)`, `stop (coverage)` and `stop (latency)` on synthetic columns. Every logged stub `jev` call carries one `--provider` value |
| REQ-012 | The changed skill's docs stay true to the code (parent D6) | `SKILL.md`, README, one changelog file, one catalog entry and one playbook entry with their index rows name the script, its zero-call default and its two switches, each through its sk-doc mode, and `validate_document.py` exits 0 on each. No doc claims a verdict the runs did not print |

### Keep Rule (fixed 2026-09-29, before any model run)

Each backend column is judged on its own inputs. Changing this rule after the first model run is an amendment that voids every earlier verdict.

**Inputs.**
- K: the eligible rows the column may ask. The Deem column leaves out clusters over 25 keys (`deem_server.py:166`), which 002's census counted at 0.
- M: the measured rows (REQ-007).
- The baseline method: whichever of the scorer's order, confidence order and always-second has the highest MRR on the M rows, the scorer's order on a tie.
- W and L: measured rows where the column gives the gold a higher or a lower reciprocal rank than the baseline method. Gold-first rows count, so a demotion is a loss.
- F: the sum over measured rows of 3 minus the count of the row's most common top key.
- SA and SB: the sums of the gold's reciprocal rank under the column and under the baseline method over the M rows.
- T: the p95 of child wall time over every call the column made, killed children included at 2,500 ms.

**Thresholds, checked in this order.** The first that applies sets the verdict.
1. Coverage: `10*M >= 9*K`, else `stop (coverage)`.
2. Kill: the exact one-sided binomial P(X >= L) for X ~ Binomial(W+L, 0.5) is at or below 0.05. Then the verdict is `kill`.
3. Margin: `20*(SA - SB) >= M`, a mean reciprocal-rank gain of at least 0.05, else `stop (margin)`.
4. Sign test: P(X >= W) below 0.05, with p = 1 when W+L is 0, else `stop (sign test)`.
5. Flips: `10*F <= 3*M`, a flip rate of at most 0.10 over the 3M calls, else `stop (flips)`.
6. Latency: T at or below 2,200 ms, the advisor budget ceiling, else `stop (latency)`.
7. Otherwise `keep`.

**The verdict line.** One line per column on stdout, and the same fields under `columns.<backend>.verdict` in `report.json`:

`verdict <jev|deem>: <keep|kill|stop (<reason>)> K=<K> M=<M> W=<W> L=<L> F=<F> p=<p> mrr=<SA/M>/<SB/M> p95_ms=<T>`

The Deem line adds `model=<id> model_commit=<sha> source_commit=<sha>` from `cli-deem health`. The Jev line adds `jev_version=<v> provider=<P> model=<m>` from `jev auth test`. Before the first call the script prints `margin: 0.05` and one `keep rule:` line naming all six conditions.

**What a verdict means.** A `keep` holds only for the identity on its line and serves nothing. A served order needs a later phase and the operator's call. A `kill` closes that backend's whole-cluster order at that identity, beside 002's kill of the pick-first form. A stub, fake-server or vitest verdict never counts.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Before any model call the operator reads how many rows can move, how the three zero-call orders score and how much of the 2,200 ms the advisor itself spends, which settles whether a fit is possible at all.
- **SC-002**: Each model run the operator asks for yields one verdict line per column with its identity and a per-call record, so R3 is settled on counted numbers for both backends.
- **SC-003**: A run with neither switch, or with every requested gate failing, calls nothing and changes nothing.

### Proof Plan

Written before the build. `S` is `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-suggested-order.mjs` and `STUB` a directory of logging `jev` and `cli-deem` stubs.

1. `PATH="$STUB:$PATH" node $S` prints the census, `53/70`, the three zero-call orders, `advisor child: p50=<ms> p95=<ms> max=<ms> over_2200=<n>`, the power line and `margin: 0.05`, exits 0, and both stub logs stay empty. Boundary: a synthetic corpus with 4 movable rows prints `no headroom (movable)`.
2. With a stub `cli-deem health` reporting backend `stub`, `node $S --deem --out <dir>` prints `deem arm skipped: stub backend` and output otherwise byte-identical to step 1. With a stub `jev` whose `auth status --provider official` exits 3, `--jev --out <dir>` prints the identity line and `jev arm skipped: no credential`.
3. A stub `cli-deem choice` answering full maps on a synthetic corpus prints a Deem column and a `verdict deem:` line with the stub's commit pair. Boundary: a stub answering a map without one key marks that row `unmeasured`.
4. A stub child that sleeps past 2,500 ms is killed, marked `unmeasured_timeout` and pushes T past 2,200 ms, and the column prints `stop (latency)`.
5. `git status --porcelain` is the same before and after each run.
6. `grep -nE 'API_KEY|TYPESAFE|Bearer|Authorization' $S` exits 1 with no match.
7. From `.skilled/skills/system-skill-advisor/runtime`, `npx vitest run tests/parity/score-suggested-order.vitest.ts` exits 0 with at least 20 passed tests.

**Kill criterion.** `baseline mismatch: comparison void` voids the run. `verdict <backend>: kill` closes that backend's whole-cluster order at that identity. `no headroom`, `stop (<reason>)` and every skip or stop line close nothing. A later model identity reruns the rule in full before any use.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 002's exports | A change to `score-jev-tiebreak.mjs` could move this phase's census | Import only. The census must print 53/70 and 002's per-file counts, or the run is void |
| Risk | Jev's `choice` map may hold only the pick and `none` | High for the Jev column. Every row would be `unmeasured` and the column `stop (coverage)` | That outcome is the measured answer that the Jev order form cannot be scored. The build reads one real answer's JSON before the arm is written and records whether the map is full |
| Risk | 002's Jev p95 of 2,830 ms already exceeds 2,200 ms | High for a Jev `keep` | The latency condition decides it on in-child numbers. A `stop (latency)` is a valid result |
| Risk | The built hook writes diagnostics or state when the child runs it | Med. A run could change files outside the report directory | The build reads `hooks/claude/user-prompt-submit.ts` first, runs the child under the capture env's temp `SYSTEM_SKILL_ADVISOR_DB_DIR`, and REQ-006's porcelain check fails the run on any write |
| Risk | Small headroom: 23 movable rows and 76 gold-first rows that can only lose | High | The power line prints first. Below 5 movable rows no arm calls |
| Risk | Deem's 002 order-flip rate was 0.3123 | Med. The flips condition may stop the Deem column | Measured, never tuned. The rule is fixed here |
| Dependency | The served Deem, or a Jev credential for provider P | That column cannot run | Each arm prints its skip line. The operator runs `deem-ctl start` or sets a key, never the script |
| Risk | Corpus prompts and skill descriptions leave the machine on the Jev arm | Low. Both are committed to a public repository, the ruling logged for 002 in the parent goal | The payload line prints before the first call. No session text is sent |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Does the Python client's `choice` answer carry a probability for every submitted key? UNKNOWN. 002 recorded only the pick and `none` probabilities. One real answer read at build settles it.
- How much of the 2,200 ms does the advisor itself spend (research question 43)? The zero-call run answers it.
- Is a 0.05 mean reciprocal-rank margin right? It is fixed here so the build cannot tune it. Changing it before the first model run is an amendment.
- How often does the live advisor set `ambiguousWith`? Still 0 recorded, because the shadow sink is off by default. Enabling it is the advisor owner's call and outside this phase.
<!-- /ANCHOR:questions -->

---
