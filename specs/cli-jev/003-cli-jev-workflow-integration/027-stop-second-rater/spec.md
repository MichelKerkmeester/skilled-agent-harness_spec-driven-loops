---
title: "Feature Specification: Phase 27: stop-second-rater"
description: "Test research R8 offline: replay archived deep-research lineages, derive the stop each one should have made from its cited sources and measure whether a Jev or Deem score of each iteration's novelty moves the replayed stop closer to that gold than the zero-call stop rules do. A zero-call census prints the headroom first, the operator's five-lineage read gates the gold and each backend column ends in one verdict line under a keep rule fixed here."
trigger_phrases:
  - "stop second-rater replay"
  - "score-stop-rater"
  - "deep-research stop gold"
  - "novelty second rater"
  - "research r8 test phase"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 27: stop-second-rater

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
| **Phase** | 27 of 35 |
| **Predecessor** | 026-completion-claim-audit |
| **Successor** | 028-confirm-mode-stop-hint |
| **Handoff Criteria** | The zero-call census has printed the lineage counts, the derived gold, the three zero-call stop methods' accuracy on identical lineages and either `no headroom` or the planned calls. Then either the scorer printed `stop: fewer than 5 confirmed lineages` or `stop: derived gold disagrees on <k> of 5 lineages`, or a run past that gate printed one `verdict <backend>:` line per backend column that ran, or that backend's skip line. Phase 028 reads this phase's `report.json` and `calls.jsonl` and makes no call of its own |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 27** of the cli-jev workflow integration specification. On 2026-09-29 the operator asked for "a phase per later item not yet planned or implemented so we can test everything". This phase tests research R8, the stop second-rater replay, ranked 12th and `later` in `../007-classifier-deep-research/research/research.md` section 12 (judgment type `score`, preferred backend Deem, for archived evidence). The full record is `../001-deep-research/research/research.md` section 11, `### R8.`, with its promote line at `:1273` and open question 8 at `:1139`.

**Scope Boundary**: One new read-only replay script in the `system-deep-loop` runtime, its vitest file and the skill docs parent D6 requires. It changes no convergence code, no reducer, no workflow YAML and no state file, so every live loop stops exactly as today by construction.

**Dependencies**:
- Released on 2026-09-29, when the operator's "Bind and release" amended parent D3. Phases 019 to 035 build in number order, and disjoint builds may run in parallel.
- Phase 008 (`008-cli-classifier-hub`), Complete: the `cli-deem` client and its `health` check, for the Deem arm only.
- For the Deem arm only: the local Deem server passing `cli-deem health`.
- For the Jev arm only: the Python `jev-cli` 0.6.2 on `PATH` and a credential that `jev auth status --provider P` resolves, where P is `JEV_PROVIDER` when set and `official` otherwise, as phase 002's gate says.
- For any model arm: the operator's read of five lineages (REQ-006). No model writes a gold row.
- The build roles of parent D5 and the doc route of parent D6, in `plan.md`.

**Deliverables**:
- `score-stop-rater.cjs` (proposed) with the zero-call census and baselines by default, a `--jev` arm and a `--deem` arm (proposed switches)
- `tests/unit/score-stop-rater.vitest.ts` (proposed) against a fixture lineage corpus with stub `jev` and `cli-deem` binaries
- One zero-call report and, past the label gate and only when the census leaves headroom, one report per model arm in a directory the operator names
- The `system-deep-loop` docs parent D6 names, written through sk-doc

**Changelog**:
- None. The parent packet has no `../changelog/` folder (checked 2026-09-29).
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

A deep-research loop decides when to stop from the model's own `newInfoRatio`, the self-reported share of new information in each iteration. Three weighted votes read it: a rolling average of the last three ratios below `convergenceThreshold` (0.30), a MAD noise floor (0.35) and question coverage of at least 0.85 (0.35), and a weighted score above 0.60 nominates STOP (`.skilled/commands/deep/assets/deep-research-confirm.yaml:637-661`, `.skilled/skills/system-deep-loop/deep-research/references/convergence/convergence-signals.md:41-47`). The reducer already distrusts the number when it sits flat at 0.9 or higher and emits `novelty_signal_inert` (`deep-research/scripts/reduce-state.cjs:965-989`). Nobody has measured whether a second rater would stop a loop closer to where it stopped finding things.

The research parked R8 as `later` for one reason: no gold stop is confirmed (`../007-classifier-deep-research/research/research.md:420`). Its planned gold, the last iteration that adds a first-appearance cited source in `deltas/`, is derived by code, and whether it matches the iteration prose is open question 8, answered only by a five-lineage manual read. The record also says the local replays come first, because they are non-model work and decide whether a model arm is worth buying. The corpus is larger than the record's 178: this leaf counted 449 tracked lineages with a `deep-research-config.json` on 2026-09-29. Of those, 246 cannot move their stop (`stopPolicy` `max-iterations`, `convergenceMode` `off` or `minIterations` at least `maxIterations`), 203 can, and 115 of the 203 keep a `deltas/` folder, holding 1,160 iteration records. Nine of the 115 hold three consecutive ratios at or above 0.9. These are rough counts by one `node` pass. The census fixes the rule and prints its own.

### Purpose

Settle, on a counted number per backend, whether a Jev or Deem score of each iteration's novelty moves the replayed stop onto the derived gold more often than the best zero-call stop rule, with the zero-call replay printed first and nothing changed for anyone who passes neither `--jev` nor `--deem`.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- A lineage set: every tracked `deep-research-state.jsonl` whose `deep-research-config.json` lets a stop move and whose `deltas/` folder exists (REQ-002). The sample K is at most 25 lineages, the record's sample size: lineages with an inert window first, then the rest, each group ordered by SHA-256 of the lineage path.
- The derived gold per lineage and three zero-call stop methods scored on identical lineages: the recorded stop, the replayed legacy vote on self-reported `newInfoRatio` and the same vote fed a zero-call source ratio (REQ-003). The best of the three is the baseline.
- A label gate: the operator's read of the first five sampled lineages confirms the derived gold before any model call (REQ-006).
- A Jev arm behind `--jev` and a Deem arm behind `--deem`, each asking one `score` per iteration over the five `newInfoRatio` rubric levels, then replaying the legacy vote on those levels, with one verdict per backend column under the Keep Rule (REQ-004, REQ-007).
- Jev first, then Deem (parent D1, operator 2026-09-29). With both switches set and both gates passing, both columns run, each with its own verdict. No failover.
- A per-call `calls.jsonl` and a `report.json` in a directory the operator names. The report holds, per sampled lineage, the gold, the recorded last iteration, every method's and column's stop and the label-gate state, because phase 028 reads it.
- The `system-deep-loop` skill docs parent D6 requires, through sk-doc (REQ-011).

### Out of Scope

- Any live second rater, any new field on an iteration record and any input to STOP legality. What Not To Build row 13 drops a model input to STOP, and STOP authority stays frozen on legacy convergence (`runtime/lib/stopping-clocks/stopping-clock-shadow.ts:10-19`, `runtime/scripts/convergence.cjs:480-486`). Serving a rater needs a later phase and a `keep`, and that is the operator's call.
- Editing `convergence.cjs`, either `reduce-state.cjs`, the deep-research workflow YAML, `convergence-signals.md` or any archived lineage file.
- A model writing a gold row. The operator's five-lineage read is the only confirmation.
- The confirm-mode stop hint. Phase 028 reads this phase's report for that.
- A shared Jev or Deem client or a global switch. The script spawns `jev` and `cli-deem` as binaries.
- The npm `jevctl` package, and a dollar figure in any cost line.

### Files to Change

Owner of every code path below: `system-deep-loop`. The code lives in its `runtime/` package and follows sk-code's OpenCode route. The docs go through sk-doc's modes (parent D6). Code comments carry no spec path, phase number or requirement id.

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-deep-loop/runtime/scripts/score-stop-rater.cjs` | Create | Lineage set, gold, the three zero-call methods, census, label gate, both arms and the per-column verdicts. Proposed name. About 500 to 650 LOC (estimate) |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/score-stop-rater.vitest.ts` | Create | Fixture-lineage, stub-`jev` and stub-`cli-deem` cases. The runtime vitest config includes `tests/**/*.{vitest,test}.ts` |
| `.skilled/skills/system-deep-loop/runtime/scripts/README.md` | Modify | One row for the new script |
| `.skilled/skills/system-deep-loop/SKILL.md` | Modify | Parent D6: one sentence naming the offline replay and saying it changes no stop |
| `.skilled/skills/system-deep-loop/runtime/README.md` | Modify | Parent D6: one line naming the script, its zero-call default and its two switches |
| `.skilled/skills/system-deep-loop/runtime/changelog/v<next>.md` | Create | Parent D6, through `sk-create-changelog`. The newest file at planning is `v1.5.0.1.md` |
| `.skilled/skills/system-deep-loop/runtime/feature-catalog/scoring/stop-rater-replay.md` and `feature-catalog.md` | Create, Modify | Parent D6, through `sk-create-feature-catalog`: one entry (proposed name) and its index row |
| `.skilled/skills/system-deep-loop/runtime/manual-testing-playbook/scoring/stop-rater-replay.md` and `manual-testing-playbook.md` | Create, Modify | Parent D6, through `sk-create-manual-testing-playbook`: the zero-call run and a stub-backend skip, plus the index row |
| Generated copies (the Hermes `SKILL.md`, leaf manifests, trigger index) | Regenerate | Only when their own checks report them stale after the doc edits. The build names each one it touched |
| `specs/**/deep-research-state.jsonl`, `deep-research-config.json`, `deltas/*.jsonl` | Read only | The lineage corpus |
| `<operator-named report dir>/` | Create at run time | `report.json`, and `calls.jsonl` from a run with a model arm |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The default run makes zero model calls | Without `--jev` or `--deem` the script prints the census, the gold, the three methods and the headroom line, never spawns `jev` or `cli-deem` and writes no file unless `--out <dir>` names one, where it writes only `report.json`. Stub `jev` and `cli-deem` binaries first on `PATH`, each logging one line per call, log nothing |
| REQ-002 | The lineage set and gold are fixed rules | A lineage is kept when its config's `stopPolicy` (top level or under `antiConvergence`) is not `max-iterations`, its `convergenceMode` is not `off`, `minIterations` is below `maxIterations` and a `deltas/` folder sits beside its state file. A source is each entry of a `type: finding` delta record's `source` field. It is first-appearance when no earlier iteration of the same lineage named it. The gold g is the last iteration with at least one first-appearance source. A lineage with none is dropped as `no gold` and counted. The report prints kept, forced, `no gold` and sampled counts, and the inert-window count |
| REQ-003 | Three zero-call stop methods are scored on identical lineages | `recorded`: the lineage's last iteration record. `legacy`: the vote of `deep-research-confirm.yaml:648-661` replayed on recorded `newInfoRatio` (rolling average, MAD noise floor, question coverage where counts exist, weights redistributed when a signal is unavailable, stop above 0.60), never before `minIterations`, with a recorded `graph_convergence` event of `STOP_BLOCKED` blocking that iteration. `sources`: the same vote fed each iteration's share of first-appearance sources, 0 when it cites none. A method's stop is its first STOP iteration, else the lineage's last iteration. A method is right on a lineage when its stop s satisfies g <= s <= g + 1. The baseline is the method right on most sampled lineages, ties going to `legacy`, then `sources`. When it is right on more than 90 percent of K, the census prints `no headroom` and no arm calls |
| REQ-004 | The Keep Rule is fixed here, before any model run, per backend column | See the Keep Rule below. The verdict line prints on stdout and in that column of `report.json` |
| REQ-005 | Each arm is dormant unless its own switch is set and its gate passes | Jev: one identity line with the resolved `jev` path and provider P first. Then `command -v jev`, failing prints `jev arm skipped: jev not on PATH`. `jev --version` printing exactly `jev 0.6.2`, failing prints `jev arm skipped: version` and a details line with the version found and the path. `jev auth status --provider P` exiting 0, failing prints `jev arm skipped: no credential`. The same `--provider P` goes to one `jev auth test` and every judgment. Deem: `cli-deem health` within 2,000 ms, printing backend, model id and commit pair, failing prints `deem arm skipped: not reachable`, `stub backend`, `model` with a details line or `bad health response`. Each skip leaves the census and the other column byte-identical and exits 0. The script never starts the server |
| REQ-006 | The label gate stops every model arm until the operator confirms the gold | `--gold-reads <file>` (proposed) is the operator's JSON lines file, one row per lineage: `lineage`, `gold_iteration` and `labeler`. The census names the first five sampled lineages to read. Fewer than five rows for them prints `stop: fewer than 5 confirmed lineages`. Any of the five whose `gold_iteration` differs from the derived g prints `stop: derived gold disagrees on <k> of 5 lineages`. Either stop leaves the census printed, runs no arm and exits 0. No model writes a row of this file |
| REQ-007 | No key in any file, and the Jev payload is published text only | The script never reads, stores, logs or passes a key. `grep -nE 'API_KEY\|TYPESAFE\|Bearer\|Authorization' score-stop-rater.cjs` returns no match. A Jev request carries only the fixed `-q` instruction, the five levels and the state of REQ-008, and only for a lineage whose delta files exist at `origin/main` (`git cat-file -e origin/main:<path>`, proposed). Other lineages are `unmeasured_unpublished` in the Jev column and counted. Deem sends nothing off the machine and runs every lineage |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-008 | The call shape is fixed and shared | Each iteration goes to `jev score --provider P` or `cli-deem score` on stdin, closed after writing, with `-q "How much new information did this iteration add to the research so far?"` (proposed wording, fixed before any run) and five `-l` levels from lowest to highest, each the verbatim row of `convergence-signals.md:59-63`. The state is the iteration's delta finding labels and sources, then the labels of every earlier finding in the lineage, as plain lines. A state over 24,000 characters (proposed bound, because the 0.8B's usable context is UNKNOWN, research question 41) goes to neither backend and is `unmeasured_oversize`. Jev asks each iteration 3 times with no answer cache and takes the median level. Deem asks once, and its stability is the commit pair (research C4). The arm's stop is the `legacy` vote replayed on the level values in place of self-reported `newInfoRatio` |
| REQ-009 | Every call and exit has one handling, and the cost prints first | Before its first call the Deem arm prints "nothing leaves the machine", its planned calls and an estimated wall time at 65.6 ms, labeled as the 2-option p50 of `deem-local.md`. Before `jev auth test` the Jev arm prints the payload class (published research delta text), planned calls and estimated input tokens, never a dollar figure. `calls.jsonl` holds one line per call: lineage, iteration, rerun index, wall ms, exit code, backend, level, its probability and a status of `measured`, `unmeasured`, `unmeasured_timeout`, `unmeasured_oversize` or `unmeasured_unpublished`. Deem lines add model id and both commits. Jev lines add version, provider and model. Deem exits: 1 or HTTP 400 `unmeasured`, 2 stops the arm, 3 prints `deem arm stopped: backend refused`, 4 rechecks health once (`deem arm stopped: model commit changed mid-run` or `deem arm stopped: server gone`, a passing recheck retries once), 130 `interrupted`. Jev exits: 1 or unparseable output `unmeasured`, 2 stops the arm, 3 after the gate `jev arm stopped: key rejected`, 4 one backoff retry, a spawn past 90 s `unmeasured_timeout`, 130 `interrupted`. A stopped arm prints finished lineages as `partial` and no verdict. `--jev` or `--deem` without `--out <dir>` exits 2 before any call |
| REQ-010 | A keep holds only for what it was measured on | The report records the Deem commit pair or the Jev version, provider and model per column. A later run on a different pair prints `requalify: model commit changed`, and on a different Jev provider or model `requalify: model changed`, before its verdict |
| REQ-011 | Tests cover every public surface, and the docs stay true (parent D6) | `score-stop-rater.vitest.ts` exits 0 with a happy path and one edge case each: the lineage filter keeps a movable lineage and drops a `max-iterations` one, the gold picks the last first-appearance source and drops a lineage with none, each zero-call method stops at the right fixture iteration and `legacy` honors `minIterations`, the census prints `no headroom` on a saturated fixture, the label gate prints both stop lines, the Jev gate passes a stub and skips on exit 3 of `auth status`, the Deem gate passes a fake health and skips a stub backend byte-identically, the verdict prints `keep`, `kill` and `stop (coverage)` on scripted answers, a Deem exit 4 with a new pair stops the arm and an unpublished lineage is withheld from Jev. `SKILL.md`, both READMEs, the changelog, the catalog entry and the playbook entry each name the script, its zero-call default and both switches, and `validate_document.py` exits 0 on each |

### Keep Rule (fixed 2026-09-29, before any model run)

**Inputs.** K is the sampled lineages that passed REQ-006's gate. A column's M measured lineages are those whose every iteration returned a level after REQ-009's handling. On each measured lineage, the column is right when its stop s satisfies g <= s <= g + 1, and the baseline method (REQ-003) is right on the same test. A counts the lineages the column gets right and B the lineages the baseline gets right. W counts the lineages only the column gets right and L those only the baseline gets right. C counts the column's measured calls, and F counts its answers that differ from their iteration's median. Deem's F is not computed (C4).

**Thresholds, in this order.** The first that applies sets the verdict.
1. Coverage: `10*M >= 9*K`, else `verdict <backend>: stop (coverage)`.
2. Kill: the exact one-sided binomial P(X >= L) for X ~ Binomial(W + L, 0.5) is below 0.05, else continue. When it is, `verdict <backend>: kill`.
3. Margin: `10*(A-B) >= M`, a gain of at least 10 points, else `stop (margin)`.
4. Sign test: P(X >= W) below 0.05, with p = 1 when W + L is 0, else `stop (sign test)`.
5. Flips, Jev only: `10*F <= C`, a flip rate of at most 0.10, else `stop (flips)`.
6. Otherwise `verdict <backend>: keep`.

**The line.** `verdict <backend>: keep|kill|stop (<reason>) K=<k> M=<m> A=<a> B=<b> W=<w> L=<l> F=<f|n/a> p=<p> baseline=<method>`, then for Deem `model=<id> model_commit=<sha> source_commit=<sha>` and for Jev `jev_version=<v> provider=<p> model=<m>`. Counts stay integers and p is exact. A stub, fake-server or vitest verdict never counts. A change to this rule after the first model run voids every earlier verdict.

**What a keep means.** It holds for the pair or model on its line only. It serves nothing: a live rater, or any field on the iteration record, needs a later phase, and opening one is the operator's call.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Before any model call, the operator reads how many lineages can move their stop, where each zero-call method stops against the derived gold and whether a 10-point gain fits.
- **SC-002**: Past the label gate, one run per model arm prints one verdict line per backend column with what it was measured on, so R8 is settled on a counted number. At the gate the phase closes on its stop line.
- **SC-003**: A run with neither switch, or with every requested gate failing, calls nothing and changes nothing.

### Proof Plan

Written before the build. Each step names its command and expected output.

1. `node .skilled/skills/system-deep-loop/runtime/scripts/score-stop-rater.cjs` with logging stubs first on `PATH`: exit 0, lines `lineages:`, `gold:`, `method recorded:`, `method legacy:`, `method sources:`, `baseline:` and either `no headroom` or `planned calls:`, both stub logs absent. Boundary: a fixture where `legacy` is right on 10 of 10 prints `no headroom`.
2. The same run with `--jev --deem --out <tmp>` and no `--gold-reads`: `stop: fewer than 5 confirmed lineages`, no call in either stub log, exit 0. Boundary: a reads file with one disagreeing row prints `stop: derived gold disagrees on 1 of 5 lineages`.
3. Gate skips on stubs: `jev arm skipped: no credential` after the identity line, and `deem arm skipped: stub backend`. Each stdout is the default run's output plus only those lines.
4. From `.skilled/skills/system-deep-loop/runtime`, `npx vitest run tests/unit/score-stop-rater.vitest.ts` exits 0 with at least 20 passed tests and 0 failed.
5. `grep -nE 'API_KEY|TYPESAFE|Bearer|Authorization'` on the script prints nothing, and `git status --porcelain` is the same before and after every run.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The operator's five-lineage read | No model arm can run without it | REQ-006 stops cleanly and the phase closes at the gate, as 003 and 006 did (parent D4) |
| Risk | The derived gold is wrong, because a delta can cite a source the prose rejected | High for the verdict | The five-lineage read checks it first, and one disagreement stops every arm |
| Risk | `sources` already sits on the gold, since it reads the same deltas the gold comes from | Med | It is a fair zero-call rival and belongs in the baseline. A saturated baseline prints `no headroom`, which is itself an answer: no model is needed |
| Risk | Question counts are missing from many records | Med | The vote redistributes weight as the workflow does (`deep-research-confirm.yaml:659`), and the census prints how many lineages lacked counts |
| Risk | 25 lineages give a small sign test | Med | The census prints the power line: with W + L discordant lineages a keep needs W wins at p below 0.05, at least 5 of 5 |
| Dependency | Published text for Jev | Lineages committed only on this worktree branch are withheld from Jev | Counted as `unmeasured_unpublished`. If that sinks Jev's coverage, the Jev column stops on coverage and says so |
| Risk | The 0.8B's usable context is UNKNOWN | Long states fail or truncate | The 24,000-character bound withholds them, and they count against coverage |
| Dependency | Shared doc files with phases 028, 029 and 030 | Parallel builds would collide on `SKILL.md`, the runtime README, changelog and index files | The doc steps of those phases run one after another |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Does the derived stop gold match the iteration prose (research question 8)? The operator's five-lineage read answers it, and REQ-006 turns that answer into a gate.
- Is K = 25 enough? It is the record's sample size (MiMo-09). The census prints the power line, and widening K is an amendment before the first model run.
- Is the 24,000-character state bound right for the 0.8B? UNKNOWN until one timed Deem call at that size (research question 41).
- Who would read a kept rater? Nothing reads one today. Phase 028 tests the confirm-mode hint that would, and a live form needs a later phase.
<!-- /ANCHOR:questions -->

---
