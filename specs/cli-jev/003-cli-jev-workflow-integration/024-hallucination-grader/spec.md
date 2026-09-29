---
title: "Feature Specification: Phase 24: hallucination-grader"
description: "Turn the model-benchmark runner's silent mock fallback for an unknown --grader into a startup error, then measure offline whether a Jev or Deem noul that flags invented flags, files or functions in benchmark outputs agrees with the operator's labels more often than the 5dim scorer's deterministic hallucination-flag check. A zero-call census prints the outputs, the allowlist coverage and a label gate of 30 labeled outputs first. Built and closed at its label gate on 2026-09-29, commit fb3f9c0599."
trigger_phrases:
  - "hallucination grader"
  - "d4 hallucination grader kind"
  - "score-d4-agreement"
  - "silent mock grader fallback"
  - "research R7 d4 grader"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 24: hallucination-grader

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
| **Phase** | 24 of 35 |
| **Predecessor** | 023-reply-harness-blinded-judge |
| **Successor** | 025-reviewer-verdict-fallback |
| **Handoff Criteria** | `run-benchmark.cjs --grader jev` exits 2 before loading a profile. The zero-call census has printed the output, fixture, allowlist and labeled counts, the deterministic baseline and either a `stop:` line, `no headroom` or the planned calls. Once the operator has labeled at least 30 outputs, a `--deem` or `--jev` run prints one `verdict <backend>:` line per column or that backend's skip line. The verdict goes in `goal.md`'s log for the parent goal's log. Phase 025 shares doc paths with this phase, so the two build one after the other |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 24** of the Later classifier items as test phases specification. It tests research item R7, the D4 hallucination grader kind, which the round-3 synthesis kept `later` (`../007-classifier-deep-research/research/research.md`, section 12 ranking row 11 and the carried table "R3 to R18 and R22"). Its full record is R7 in `../001-deep-research/research/research.md` section 11, and round 2 added that the grader harness's parse statuses are a vocabulary any grader can reuse (`../004-deep-research-expansion/research/research.md` section 11, carried row R7). The operator asked on 2026-09-29 for one phase per later item "so we can test everything".

**Scope Boundary**: A startup check for the runner's `--grader` value, one new read-only measurement script beside the 5dim scorer, its tests and deep-improvement's skill docs under parent goal D6. No grader kind is added to the runner, and D4's weight, the `llm` grader and the deterministic checks are unchanged.

**Dependencies**:
- Released on 2026-09-29, when the operator's "Bind and release" amended parent goal D3. Phases 019 to 035 build in number order, and disjoint builds may run in parallel.
- Phase 025 (`025-reviewer-verdict-fallback`) edits the same deep-improvement docs and tests README, so the two phases build one after the other, never in parallel (parent goal D3 allows parallel builds only on disjoint paths).
- Phase 008 (`008-cli-classifier-hub`, Complete): the `cli-deem` client and its `health` check for the Deem arm.
- Benchmark outputs to label. A `/deep:model-benchmark` run writes one `<fixture-id>.md` per fixture under its outputs directory (`run-benchmark.cjs:138-141`). None exists in the tree today, so the operator produces or names them.
- The operator's labels on at least 30 outputs, the label gate. No model writes a label, as parent goal D4 rules for phases 003 and 006.
- For the Jev arm only: `jev` 0.6.2 on `PATH` and a credential that `jev auth status --provider <P>` resolves, where P is `JEV_PROVIDER` when set and `official` otherwise.
- For the Deem arm only: the served Deem passing `cli-deem health`.

**Deliverables**:
- The `--grader` startup check in `run-benchmark.cjs` and `buildGraderFn`, with tests
- `score-d4-agreement.cjs` (proposed) beside `score-model-variant.cjs`, with the zero-call census, a `--deem` arm and a `--jev` arm (proposed switches), and its vitest file
- One zero-call census report and, once the label gate passes, one `--deem` report with its `calls.jsonl`, plus a `--jev` report when the operator passes `--jev`, in a directory the operator names
- deep-improvement's `SKILL.md`, `README.md`, changelog, feature catalog and manual testing playbook, updated through sk-doc (parent goal D6)

**Changelog**:
- The parent packet has no `../changelog/` folder, so at close there is no matching file to refresh, as for phase 017.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The 5dim scorer weighs D4, the hallucination dimension, at 0.15 (`.skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/score-model-variant.cjs:58`) and takes D4 from the grader (`:300`). Through the runner the grader defaults to `noop` (`.skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/run-benchmark.cjs:577`), a fixed D4 of 1.0 (`score-model-variant.cjs:208-209`). The runner never checks the value, and `buildGraderFn` turns any kind other than `noop` or `llm` into `mock` (`:211`), so `--grader jev` today scores with the stub and prints no warning. A failed grade returns 0.0 (`:222-224`). The deterministic `hallucination-flag` check runs on every 5dim output (`:284`) and never feeds D4. A default 5dim run therefore carries no hallucination signal at all.

The research kept R7 `later` for two reasons: no gold, and the silent `mock` fallback. The lineages' proposed gold, the reviewer fixtures, never reaches D4: the reviewer profile routes to the reviewer scorer, and the runner offers only `pattern` and `5dim` (`run-benchmark.cjs:571`). This leaf found a third gap on 2026-09-29. On the runner path `scoreFixture5dim` passes `acceptance`, `requiredHeadings` and `requiredPatterns` and no `allowlist` (`run-benchmark.cjs:457-461`), so the virtual fixture's allowlist is empty (`score-model-variant.cjs:270`). None of the 21 fixture files under `.skilled/skills/system-deep-loop/deep-improvement/assets/model-benchmark/benchmark-fixtures/` holds an `allowlist` key. The deterministic check, the research's own comparator, therefore judges every output against an empty allowlist. The grader cache holds 32 committed records of the `llm` grader, 18 `D4` and 14 `D4-R`, which are grader answers and not labeled outputs.

### Purpose
Make an unknown grader kind fail loudly, then produce one agreement number per backend column against the operator's hallucination labels, compared with the deterministic check on the same outputs under a keep rule fixed here. A zero-call census prints the baseline and the label gate first, and a run without `--deem` or `--jev` changes nothing.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The fallback fix. `run-benchmark.cjs` exits 2 with a message naming the value and the usage line of `:582` when `--grader` is not `noop`, `mock` or `llm`, before any profile loads. `buildGraderFn` throws for a kind outside those three instead of returning `mock`. The direct-call default `mock` (`score-model-variant.cjs:21`, `:253`) is unchanged. `/deep:model-benchmark` already rejects other values at its own layer (`.skilled/commands/deep/assets/deep-model-benchmark-auto.yaml:64`, `deep-model-benchmark-confirm.yaml:64`), so its users see no change.
- A zero-call census over an outputs directory the operator names (`--outputs <dir>`). Each `<id>.md` or `<id>.run<k>.md` maps to the fixture `<id>.json` in a fixtures directory (`--fixtures <dir>`, by default `benchmark-fixtures/`). It prints outputs, matched and unmatched counts, fixtures with an `allowlist` and the labeled count by class.
- A deterministic baseline: `scorer/deterministic/hallucination-flag.cjs`, unchanged, on each labeled output with a virtual fixture holding that fixture's `allowlist`, empty when absent. The check's score below 1.0 counts as `yes`, hallucinated.
- A labels file the operator writes (REQ-004) and a label gate of 30 labeled outputs with at least 5 of each class.
- A Deem arm behind `--deem` and a Jev arm behind `--jev`. Each asks one `noul` per output under a pre-registered keep rule applied to its own column (section 4, Keep Rule).
- Jev first, then Deem, the parent's order (parent goal D1). Each arm runs only on its own switch and its own checks. A failed check never starts the other arm.
- A per-call JSONL shared by both arms, and a report written to a directory the operator names.
- deep-improvement's skill docs under parent goal D6, written through sk-doc.

### Out of Scope
- Adding a `jev` or `deem` grader kind to the runner, or letting any classifier answer set D4. Offline only. Wiring a grader needs a later phase and a `keep`, and opening one is the operator's call.
- Changing the failed grade's 0.0 (`score-model-variant.cjs:222-224`). Research row 9 drops any default number, and the later wiring phase owns that change. The new script never writes a default score.
- Adding an `allowlist` to fixtures or passing one through `scoreFixture5dim`. That changes the benchmark's scores and is the owner's call (section 7).
- Changing D4's weight, the `llm` grader, `harness.cjs`, `dispute.cjs`, the deterministic checks or any profile.
- Producing benchmark outputs. The census reads outputs the operator names.
- Writing a label with a model, failover between backends, a global switch, a shared client library or a dollar figure in any cost line.

### Files to Change

Owner of every path below: `system-deep-loop`, in its `deep-improvement` packet. The build follows that packet's `scripts/model-benchmark/README.md`, `scorer/README.md` and `tests/README.md`, its vitest config at `scripts/vitest.config.mjs` and sk-code's OpenCode route for the code. The skill docs go through sk-doc's modes (parent goal D6). Code comments carry no spec path, phase number or requirement id. S below is `.skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark`.

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `S/run-benchmark.cjs` | Modify | Reject a `--grader` value outside `noop`, `mock` and `llm` with exit 2 before any profile loads |
| `S/scorer/score-model-variant.cjs` | Modify | `buildGraderFn` throws for a kind outside the three instead of returning `mock` |
| `S/scorer/score-d4-agreement.cjs` | Create | Census, deterministic baseline, label gate, both arms and the per-column verdicts. Proposed name |
| `S/tests/d4-agreement.vitest.ts` | Create | Fixture outputs, labels and stub `cli-deem` and `jev` cases. Proposed name |
| `S/tests/run-benchmark-hardening.vitest.ts` and `S/tests/scorer.vitest.ts` | Modify | One case each: `--grader jev` exits 2 with the usage line, and `buildGraderFn('jev')` throws |
| `S/scorer/README.md` and `S/tests/README.md` | Modify | One script row, and the new test file with the suite's counts |
| `.skilled/skills/system-deep-loop/deep-improvement/SKILL.md` | Modify | The scoring line at `:222` names the startup check, and one sentence names the offline D4 measurement (parent goal D6) |
| `.skilled/skills/system-deep-loop/deep-improvement/README.md` | Modify | One line naming the script and its switches (parent goal D6) |
| `.skilled/skills/system-deep-loop/deep-improvement/changelog/v<next>.md` | Create | The next version file after the newest at build time (`v1.9.0.0.md` at planning), through `sk-create-changelog` |
| `.skilled/skills/system-deep-loop/deep-improvement/feature-catalog/scoring-system/<entry>.md` and `feature-catalog/feature-catalog.md`, plus `feature-catalog/model-benchmark-mode/opt-in-5dim-scorer.md` | Create and Modify | One catalog entry and its index row, and the grader-selection paragraph of the 5dim entry updated for the startup check, through `sk-create-feature-catalog` |
| `.skilled/skills/system-deep-loop/deep-improvement/manual-testing-playbook/five-d-scorer/<scenario>.md` and `manual-testing-playbook/manual-testing-playbook.md` | Create and Modify | One scenario covering the unknown-grader exit, the zero-call census and a stub-backend skip, plus its index row, through `sk-create-manual-testing-playbook` |
| `S/scorer/deterministic/hallucination-flag.cjs` and `.skilled/skills/system-deep-loop/deep-improvement/assets/model-benchmark/benchmark-fixtures/*.json` | Read only | The baseline check, spawned unchanged, and the fixtures' `task`, `visibleSpec` and `allowlist` |
| `<operator-named outputs dir>`, `<labels file>` and `<report dir>/` | Read, and create at run time | Outputs and labels, and `report.json` plus `calls.jsonl` from a run with a model arm |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | An unknown grader kind fails at startup | `node S/run-benchmark.cjs --profile default --outputs-dir <dir> --scorer 5dim --grader jev` exits 2 before loading the profile, and stderr names `jev` and prints the usage line. `--grader noop`, `mock` and `llm` behave as today, and the existing suite fails nothing beyond its recorded baseline. `buildGraderFn('jev')` throws an error naming the kind |
| REQ-002 | The default census run makes zero model calls | Without `--deem` or `--jev`, `score-d4-agreement.cjs` prints the census, the baseline, the `margin: 0.10` and `keep rule:` lines, the power line and one of `stop: fewer than 30 labeled outputs`, `stop: fewer than 5 labeled <yes|no> outputs`, `no headroom` or `planned calls:`. It never spawns `cli-deem` or `jev` and writes no file. Stub binaries first on `PATH` log nothing |
| REQ-003 | The census maps outputs to fixtures and counts honestly | It prints outputs found, matched to a fixture, unmatched, fixtures with an `allowlist` and, per class, labeled outputs. An unmatched output leaves the labeled set and is counted. On today's fixtures the allowlist line prints 0 of 21 |
| REQ-004 | The labels are the operator's and the gate is fixed | The labels file is JSONL with one row per output: `output`, the file name, and `hallucinated`, `yes` or `no`, where `yes` means the output names a command-line flag, file or function that the fixture's task does not provide. Any other value exits 2 naming the row. Below 30 labeled matched outputs, or below 5 of either class, the run prints its `stop:` line and no arm calls. The report prints the labels file's SHA-256 |
| REQ-005 | The keep rule is fixed before any model run and applies per backend column | Section 4, Keep Rule, verbatim. Changing it after the first model run is an amendment that voids every earlier verdict |
| REQ-006 | The Deem arm is dormant unless `--deem` is set and the Deem check passes | As phase 017's REQ-005: `cli-deem health` within 2,000 ms, the four `deem arm skipped:` lines, each skip byte-identical to the census and exit 0, and the script never starts the server |
| REQ-007 | The Jev arm is dormant unless `--jev` is set and phase 002's Jev gate passes | One identity line with the `jev` path and provider P, then `command -v jev`, `jev --version` printing exactly `jev 0.6.2` and `jev auth status --provider P` exiting 0, else `jev arm skipped: jev not on PATH`, `version` with a details line, or `no credential`. Each skip is byte-identical to the census and exits 0. The same `--provider P` goes to that check, to one `jev auth test --provider P` and to every judgment |
| REQ-008 | Read-only, offline and no key | A census or model run leaves `git status --porcelain` as it was, except an operator-named report directory. The script never reads, stores, logs or passes a key, and `grep -nE 'API_KEY\|TYPESAFE\|Bearer\|Authorization'` on it returns no match. When any labeled output file is not tracked by git, the Jev arm needs `--accept-payload` (proposed), else it prints `jev arm skipped: payload not accepted` and a requested Deem arm still runs |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-009 | The call shape is fixed and shared | Each call is `noul` with one fixed `-q`, printed verbatim before any call: "Does this output name a command-line flag, file or function that the task does not provide?" (proposed wording, fixed here). The state on stdin, closed after writing, is the fixture's `task` and `visibleSpec`, its `allowlist` when present, then the output. An answer of 0.5 or more counts as `yes`. Deem asks each output once. Jev asks three times with no answer cache, and the row's call is the modal answer |
| REQ-010 | Every call and exit has one handling, and the cost prints first | Before its first call the Deem arm prints "nothing leaves the machine", its planned calls (one per labeled output) and a wall time at 60.5 ms per call, labeled as the `noul` p50 in `deem-local.md`. Before `jev auth test` the Jev arm prints the payload class, its planned calls (3 per labeled output, plus 1) and the estimated input tokens, never a dollar figure. `calls.jsonl` and the exit handling follow phase 017's REQ-008, with the output name in place of the row id and the `noul` value in place of the pick. `--deem` or `--jev` without `--out <dir>` exits 2 before any call |
| REQ-011 | A keep holds only for what it was measured on | The report records the Deem commit pair or the Jev version, provider and model per column. A run whose `--out` already holds a `report.json` from another pair prints `requalify: model commit changed`, or `requalify: model changed` for Jev, before its own verdict |
| REQ-012 | The parse vocabulary is reused | A model answer that is not a number in 0 to 1 is `unmeasured` and never a score, and each row's status uses the grader harness's words where they fit (`failed` for an unparseable answer, from `harness.cjs:231-284`) |
| REQ-013 | Tests cover every public surface | The new vitest file exits 0 with at least 16 passing cases: a happy path and one edge case each for the output-to-fixture map (an unmatched output), the labels parser (a bad value), the class gate (4 labeled `yes` prints the stop line), the baseline (an output naming an unlisted flag reads `yes`), headroom (a saturated fixture prints `no headroom`), the default run (stubs log nothing), the Deem gate (a fake health passes, a stub backend skips byte-identical), the Jev gate (exit 0 passes, exit 3 prints `jev arm skipped: no credential`), the payload gate, `--out` missing (exit 2 before any call) and the verdict (`keep`, `kill`, `stop (margin)`, `stop (coverage)` and a Jev `stop (flips)`). The two fallback cases of REQ-001 pass in their own files |
| REQ-014 | The changed skill's docs stay true to the code (parent goal D6) | deep-improvement's `SKILL.md`, `README.md`, one new changelog file, the catalog entry with its index row and the updated 5dim entry, and one playbook scenario with its index row name the startup check, the script, its zero-call default and its two switches, written through sk-doc. `validate_document.py` exits 0 on each changed doc. No doc claims a verdict the runs did not print |

### Keep Rule (fixed 2026-09-29, before any model run)

**Inputs.** K is the count of labeled outputs matched to a fixture (REQ-004). An output is measured in a column when its call, or for Jev all three reruns, returned a number in 0 to 1. M counts measured outputs. The column's call on a measured output is `yes` at 0.5 or more, for Jev the modal call of the three. A counts the measured outputs where the column's call equals the label, and B those where the baseline method's call equals it. The baseline method is the better of the deterministic check and the majority class of the labels, the check on a tie. W counts the outputs only the column gets right and L those only the baseline method gets right. F, for Jev only, sums each output's non-modal calls, 3 minus the count of its most common call.

**Checks, in this order.** The first that fails sets the verdict.
1. Coverage: `10*M >= 9*K`, else `stop (coverage)`.
2. Kill: when the exact one-sided binomial p_loss, the chance of L or more successes in W+L fair trials, is below 0.05, the verdict is `kill`.
3. Margin: `10*(A-B) >= M`, a gain of at least 10 points, else `stop (margin)`.
4. Sign test: p_win, the chance of W or more successes in W+L fair trials, is below 0.05, else `stop (sign test)`. Both p values are 1 when W+L is 0.
5. Flips, for Jev: `10*F <= 3*M`, a flip rate of at most 0.10 over its 3M calls, else `stop (flips)`. For Deem this check prints `flips: n/a (commit pair)`: a Deem `noul` has no rerun clause and its stability is the commit pair (research C4, `../007-classifier-deep-research/research/research.md:88`).

Otherwise the verdict is `keep`. Counts stay integers and p is computed exactly. When the baseline method is right on more than 90 percent of labeled outputs, the census prints `no headroom` and neither arm calls. The power line states that a keep needs at least 5 wins with no loss, since 0.5^5 is 0.031.

**The verdict line.** One line per column on stdout and in that column of `report.json`:

`verdict <jev|deem>: <keep|kill|stop (<reason>)> K=<k> M=<m> A=<a> B=<b> W=<w> L=<l> F=<f|n/a> p_win=<p> p_loss=<p> labels_sha256=<hash>`

The Deem line adds `model=<id> model_commit=<sha> source_commit=<sha>`, and the Jev line adds `jev_version=0.6.2 provider=<P> model=<model>`. Only a live `--out` run counts, never a stub, fake-server or test verdict. A `keep` wires nothing: a grader kind in the runner needs a later phase, which must also settle the failed grade's 0.0, and opening it is the operator's call. A `kill` is evidence against that backend as a D4 grader. A stopped arm prints its stop line and no verdict.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Nobody who types an unknown grader kind gets stub scores. The runner stops and names the value.
- **SC-002**: Before any model call, the operator reads how many outputs are labeled, how often the deterministic check agrees with the labels, how many fixtures carry an allowlist and whether a 10-point gain fits.
- **SC-003**: Past the label gate, one `--deem --out <dir>` run prints `verdict deem:` with its commit pair and a per-call record, so R7 is settled on a counted number. A `--jev` run, when the operator asks for one, does the same for Jev. A run with neither switch calls nothing.

### Proof Plan

Written before the build. S is `.skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark`, and the vitest commands run from `.skilled/skills/system-deep-loop/deep-improvement/scripts`.

1. Before the fix, `node S/run-benchmark.cjs --profile default --outputs-dir <tmp> --scorer 5dim --grader jev` runs and reports `grader: jev` with mock D4 scores, the negative control. After it, the same command exits 2 and prints the usage line. Boundary: `--grader noop` still exits as before.
2. `node S/scorer/score-d4-agreement.cjs --outputs <fixture outputs>` with stub binaries first on `PATH` exits 0, prints the census with `allowlist: 0 of 21` on today's fixtures and a `stop:` line, and both stub logs stay empty. Boundary: one output with no matching fixture prints `unmatched: 1`.
3. `--deem` with a stub `cli-deem health` reporting backend `stub` prints `deem arm skipped: stub backend`, and `--jev` with a stub whose `auth status --provider official` exits 3 prints the identity line, then `jev arm skipped: no credential`. Each exits 0 with the rest of stdout byte-identical to the census.
4. `npx vitest run model-benchmark/tests/d4-agreement.vitest.ts model-benchmark/tests/run-benchmark-hardening.vitest.ts model-benchmark/tests/scorer.vitest.ts` exits 0 with 0 failed and at least 16 new passing cases, and the whole `model-benchmark/tests/` suite fails nothing beyond T002's baseline.
5. After each census and model run `git status --porcelain` matches its pre-run output, and the secret grep of REQ-008 prints nothing.
6. Past the label gate, one live `--deem --out <dir>` run prints one `verdict deem:` line, and every `calls.jsonl` line holds `wallMs`, `exitCode`, `modelId`, `modelCommit` and `sourceCommit`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Labeled outputs | High. None exists in the tree today, and without 30 labels no arm runs | The census stops at the label gate and prints the counts. The phase closes at that gate if the labels never arrive, as 003 and 006 did |
| Dependency | Release and backends | The operator released the phase on 2026-09-29, so the build can start. An arm cannot run without its backend | Parent goal D3, amended by the operator's "Bind and release", releases this phase. Builds run in number order, and disjoint builds may run in parallel. Each arm prints its skip line |
| Risk | The runner's convention for an unknown `--scorer` is a warning and a default (`run-benchmark.cjs:572-576`, playbook scenario MB-041), while this phase makes an unknown `--grader` an error | Med. Two conventions in one argument parser | The research asks for a startup error, because a grader silently swapped for a stub changes the scores a reader trusts. The owner may choose the warning form at review, which is recorded as an amendment |
| Risk | The deterministic check reads an empty allowlist on every fixture today | High for the baseline's accuracy | The census prints the allowlist coverage, and the baseline method falls back to the majority class when the check does worse. Adding allowlists is the owner's call (section 7) |
| Risk | Without an allowlist the classifier sees only the task text | Med. It cannot know every real flag or function | The question asks about what the task provides, the same thing the operator labels. The report prints the allowlist coverage beside every verdict |
| Risk | Output text leaves the machine on the Jev arm | Med. Benchmark outputs are usually untracked | An untracked labeled output needs `--accept-payload`, the payload class prints first and Deem keeps everything on the machine |
| Risk | A Deem update lands mid-run | Low | Exit 4 rechecks the commit pair and stops the arm with finished rows `partial`. A keep holds only for its pair (REQ-011) |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Should fixtures carry an `allowlist`, and should `scoreFixture5dim` pass it (`run-benchmark.cjs:457-461`)? Today the deterministic check reads `{}` on the runner path. The owner decides, because it changes every 5dim D4-adjacent score.
- Who reads a D4 grade, and what would a `keep` change? R7's value is that D4's 0.15 weight would mean something. No reader is named, so a `keep` wires nothing until the operator opens a later phase.
- Should the 32 cached `llm` grader records join the report as a third reported column? They cover 10 fixture ids, of which only `fixture-baseline`, `fixture-improved` and `fixture-edge` exist under `benchmark-fixtures/`, and they are grader answers rather than labels, so this phase leaves them out.
<!-- /ANCHOR:questions -->

---
