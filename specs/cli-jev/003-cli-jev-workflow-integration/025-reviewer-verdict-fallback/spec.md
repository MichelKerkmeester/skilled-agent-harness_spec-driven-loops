---
title: "Feature Specification: Phase 25: reviewer-verdict-fallback"
description: "Measure offline whether a Jev or Deem choice over pass, fail and block classifies reviewer outputs that the reviewer scorer's verdict regex misses more accurately than zero-call rules. A zero-call census first replays the regex over every recorded reviewer output and prints how many it misses, and the phase stops at a label gate of 12 labeled regex-miss outputs. Planned, released 2026-09-29."
trigger_phrases:
  - "reviewer verdict fallback"
  - "reviewer verdict classifier"
  - "score-verdict-fallback"
  - "verdict regex miss census"
  - "research R5 reviewer fallback"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 25: reviewer-verdict-fallback

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
| **Phase** | 25 of 35 |
| **Predecessor** | 024-hallucination-grader |
| **Successor** | 026-completion-claim-audit |
| **Handoff Criteria** | The zero-call census has printed the fixture cases, the regex hits and misses, the labeled regex-miss outputs by class, the zero-call baselines and either a `stop:` line, `no headroom` or the planned calls. Once the operator has labeled at least 12 regex-miss outputs covering all three verdicts, a `--deem` or `--jev` run prints one `verdict <backend>:` line per column or that backend's skip line. The verdict goes in `goal.md`'s log for the parent goal's log. Phase 024 shares doc paths with this phase, so the two build one after the other |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 25** of the Later classifier items as test phases specification. It tests research item R5, the reviewer verdict classification fallback, which the round-3 synthesis kept `later` (`../007-classifier-deep-research/research/research.md`, section 12 ranking row 9 and the carried table "R3 to R18 and R22"). Its full record is R5 in `../001-deep-research/research/research.md` section 11, and its open question is number 6 in that file's section 12, still open in round 3. The operator asked on 2026-09-29 for one phase per later item "so we can test everything".

**Scope Boundary**: One new read-only script beside the reviewer scorer, its vitest file, two README rows and deep-improvement's skill docs under parent goal D6. The reviewer scorer, its fixtures, its profile and the `/deep:model-benchmark` workflow are unchanged, so every reviewer benchmark behaves as today by construction.

**Dependencies**:
- Released on 2026-09-29, when the operator's "Bind and release" amended parent goal D3. Phases 019 to 035 build in number order, and disjoint builds may run in parallel.
- Phase 024 (`024-hallucination-grader`) edits the same deep-improvement docs and tests README, so the two phases build one after the other, never in parallel (parent goal D3 allows parallel builds only on disjoint paths).
- Phase 008 (`008-cli-classifier-hub`, Complete): the `cli-deem` client and its `health` check for the Deem arm.
- Regex-miss reviewer outputs with their text. None exists today (section 2), and a live run keeps only a hash of each output, so the operator supplies them (section 7).
- The operator's labels on at least 12 regex-miss outputs covering `pass`, `fail` and `block`, the label gate. No model writes a label, as parent goal D4 rules for phases 003 and 006.
- For the Jev arm only: `jev` 0.6.2 on `PATH` and a credential that `jev auth status --provider <P>` resolves, where P is `JEV_PROVIDER` when set and `official` otherwise.
- For the Deem arm only: the served Deem passing `cli-deem health`.

**Deliverables**:
- `score-verdict-fallback.cjs` (proposed) beside `reviewer-scorer.cjs`, with the zero-call census, a `--deem` arm and a `--jev` arm (proposed switches), and its vitest file
- One zero-call census report and, once the label gate passes, one `--deem` report with its `calls.jsonl`, plus a `--jev` report when the operator passes `--jev`, in a directory the operator names
- deep-improvement's `SKILL.md`, `README.md`, changelog, feature catalog and manual testing playbook, updated through sk-doc (parent goal D6)

**Changelog**:
- The parent packet has no `../changelog/` folder, so at close there is no matching file to refresh, as for phase 017.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The reviewer scorer reads a verdict from a reviewer's output with one regex (`.skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/reviewer-scorer.cjs:117-123`). It accepts a line holding only `pass`, `fail` or `block`, optionally after `verdict`, `result` or `status` and a separator (`:119`), and the last such line wins (`:120`). When no line matches, `classifyWithGrader` asks a general model through `dispatch-model.cjs` to name the verdict (`:155-167`, called from `:171`), and only when the run passes `--grader llm` (`:156`). Otherwise the case records `unknown`. The contract is documented at `reviewer-schema.md:82-90`, and the `/deep:model-benchmark` workflow reaches the scorer from `deep-model-benchmark-auto.yaml:206` and `deep-model-benchmark-confirm.yaml:228`. A three-key `choice` fits that fallback exactly.

The research kept R5 `later` for one reason: no gold, because no recorded case misses the regex. That still holds. On 2026-09-29 this leaf replayed the exported `extractVerdict` over the four reviewer fixtures of `reviewer-regression.json`: 8 cases, all expecting `fail`, all carrying a recorded `reviewer_output` that replaces dispatch (`reviewer-scorer.cjs:192`), and the regex found a verdict in all 8. No `reviewer-report.json` exists anywhere in the tree. A live run would not help by itself either, because `runCase` keeps a 16-character hash of each output and not its text (`:203`). So the fallback runs on 0 of 8 known cases, and nobody knows how often a live reviewer output misses the verdict line.

### Purpose
First count, with zero calls, how many recorded reviewer outputs the regex misses. Then, once the operator has labeled enough misses, produce one accuracy number per backend column on those misses, compared with zero-call rules on the same outputs under a keep rule fixed here. A run without `--deem` or `--jev` changes nothing.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A zero-call census. It replays `extractVerdict`, imported from `reviewer-scorer.cjs` and never copied, over three sources: every case of the reviewer fixtures (by default the four named in `reviewer-regression.json`), every row of an outputs file the operator names (`--outputs <file>`) and the per-test `verdictMethod` counts of any `reviewer-report.json` the operator names (`--reports <dir>`, repeatable). It prints hits, misses and, for reports, the `pattern`, `llm-grader` and `none` counts that answer research question 6.
- Two zero-call baselines on the labeled misses: the majority class of the labels, and a loose rule (proposed) that takes the last whole word `pass`, `fail` or `block` anywhere in the output, case-insensitive, with no match counted wrong. The better of the two is the baseline method. Today's behavior, `unknown`, is right on no row and prints for reference.
- A label gate of 12 labeled regex-miss outputs with each verdict present at least once.
- A Deem arm behind `--deem` and a Jev arm behind `--jev`. Each asks one `choice` over `pass`, `fail` and `block` per output per option order, in three orders, under a pre-registered keep rule applied to its own column (section 4, Keep Rule).
- Jev first, then Deem, the parent's order (parent goal D1). Each arm runs only on its own switch and its own checks. A failed check never starts the other arm.
- A per-call JSONL shared by both arms, and a report written to a directory the operator names.
- deep-improvement's skill docs under parent goal D6, written through sk-doc.

### Out of Scope
- A `--grader jev` or `--grader deem` value in the reviewer scorer, or any classifier answer written into a reviewer report. Offline only. Wiring the fallback needs a later phase and a `keep`, and opening one is the operator's call.
- Editing `reviewer-scorer.cjs`, the reviewer fixtures, `reviewer-regression.json`, `reviewer-schema.md` or the two workflow YAML files.
- Saving live reviewer outputs from the scorer. The census reads what the operator names (section 7).
- Running the existing `--grader llm` classifier as a column. It dispatches a general model, not one of the parent's two classifier backends (section 7).
- Treating the fixtures' `expectedVerdict` as the label. The fallback reads what a reviewer decided, which the operator labels, and a reviewer can decide wrongly.
- Writing a label with a model, failover between backends, a global switch, a shared client library or a dollar figure in any cost line.

### Files to Change

Owner of every path below: `system-deep-loop`, in its `deep-improvement` packet. The build follows that packet's `scripts/model-benchmark/README.md`, `lib/README.md` and `tests/README.md`, its vitest config at `scripts/vitest.config.mjs` and sk-code's OpenCode route for the code. The skill docs go through sk-doc's modes (parent goal D6). Code comments carry no spec path, phase number or requirement id. S below is `.skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark`.

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `S/lib/score-verdict-fallback.cjs` | Create | Census, zero-call baselines, label gate, both arms and the per-column verdicts. Proposed name |
| `S/tests/verdict-fallback.vitest.ts` | Create | Fixture, outputs-file, report and stub `cli-deem` and `jev` cases. Proposed name |
| `S/lib/README.md` and `S/tests/README.md` | Modify | One script row, and the new test file with the suite's counts |
| `.skilled/skills/system-deep-loop/deep-improvement/SKILL.md` | Modify | One sentence in the model-benchmark scoring lines (`:222-224`) naming the offline fallback measurement. `SKILL.md` names the reviewer scorer nowhere today, only `reviewer-schema.md` in its resource map (`:118`), so sk-doc places the sentence (parent goal D6) |
| `.skilled/skills/system-deep-loop/deep-improvement/README.md` | Modify | One line naming the script and its switches (parent goal D6) |
| `.skilled/skills/system-deep-loop/deep-improvement/changelog/v<next>.md` | Create | The next version file after the newest at build time (`v1.9.0.0.md` at planning, or phase 024's file if it lands first), through `sk-create-changelog` |
| `.skilled/skills/system-deep-loop/deep-improvement/feature-catalog/model-benchmark-mode/<entry>.md` and `feature-catalog/feature-catalog.md` | Create and Modify | One catalog entry and its index row, through `sk-create-feature-catalog` |
| `.skilled/skills/system-deep-loop/deep-improvement/manual-testing-playbook/model-benchmark-mode/<scenario>.md` and `manual-testing-playbook/manual-testing-playbook.md` | Create and Modify | One scenario covering the census on the fixtures and a stub-backend skip, plus its index row, through `sk-create-manual-testing-playbook` |
| `S/lib/reviewer-scorer.cjs`, the four `reviewer-*.json` fixtures and `reviewer-regression.json` | Read only | `extractVerdict` is imported unchanged, and the fixtures and profile are replayed |
| `<operator-named outputs file>`, `<reports dir>` and `<report dir>/` | Read, and create at run time | Outputs with labels and live reports, and `report.json` plus `calls.jsonl` from a run with a model arm |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The default run makes zero model calls | Without `--deem` or `--jev` the script prints the census, both baselines, the `margin: 0.10` and `keep rule:` lines, the power line and one of `stop: fewer than 12 labeled regex-miss outputs`, `stop: no labeled <verdict> output`, `no headroom` or `planned calls:`. It never spawns `cli-deem`, `jev` or `dispatch-model.cjs` and writes no file. Stub `cli-deem` and `jev` binaries first on `PATH` log nothing |
| REQ-002 | The census replays the real regex and counts honestly | It imports `extractVerdict` from `reviewer-scorer.cjs` (exported at `:336`). On today's fixtures it prints `fixture cases: 8 hits: 8 misses: 0`. A fixture case with no recorded output is counted as `no recorded output` and never dispatched, because `runCase` would send it to a live model (`reviewer-scorer.cjs:192`). For an outputs file it prints rows, hits and misses, and for each named report the `pattern`, `llm-grader` and `none` counts of `per_test[].verdictMethod`. A regex hit leaves the labeled population, because the fallback never sees it |
| REQ-003 | The labels are the operator's and the gate is fixed | The outputs file is JSONL with one row per output: `id`, `output`, the reviewer's text, and `label`, `pass`, `fail` or `block`, the verdict the operator reads in the output. An optional `expectedVerdict` is kept for reference and never scored. Any other label exits 2 naming the row. Below 12 labeled regex-miss outputs the run prints `stop: fewer than 12 labeled regex-miss outputs`, and with a verdict absent `stop: no labeled <verdict> output`, and no arm calls. The report prints the outputs file's SHA-256 |
| REQ-004 | The keep rule is fixed before any model run and applies per backend column | Section 4, Keep Rule, verbatim. Changing it after the first model run is an amendment that voids every earlier verdict |
| REQ-005 | The Deem arm is dormant unless `--deem` is set and the Deem check passes | As phase 017's REQ-005: `cli-deem health` within 2,000 ms, the four `deem arm skipped:` lines, each skip byte-identical to the census and exit 0, and the script never starts the server |
| REQ-006 | The Jev arm is dormant unless `--jev` is set and phase 002's Jev gate passes | One identity line with the `jev` path and provider P, then `command -v jev`, `jev --version` printing exactly `jev 0.6.2` and `jev auth status --provider P` exiting 0, else `jev arm skipped: jev not on PATH`, `version` with a details line, or `no credential`. Each skip is byte-identical to the census and exits 0. The same `--provider P` goes to that check, to one `jev auth test --provider P` and to every judgment |
| REQ-007 | Read-only, offline and no key | A census or model run leaves `git status --porcelain` as it was, except an operator-named report directory. The script never reads, stores, logs or passes a key, and `grep -nE 'API_KEY\|TYPESAFE\|Bearer\|Authorization'` on it returns no match. When the outputs file is not tracked by git, the Jev arm needs `--accept-payload` (proposed), else it prints `jev arm skipped: payload not accepted` and a requested Deem arm still runs |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-008 | The call shape is fixed and shared | Each call is `choice` with the output on stdin, closed after writing, one fixed `-q` printed verbatim before any call, "Which verdict does this reviewer output give?" (proposed), and three options with fixed descriptions (proposed): `pass` "The reviewer approves the change", `fail` "The reviewer rejects the change and names what must change" and `block` "The reviewer says it cannot give a verdict". The report prints one SHA-256 over the question and options. Both arms use three orders: the keys in the order above, then rotated left by one, then by two. Each order is a fresh call with no answer cache, so for Jev the orders are also its three reruns. The modal pick is the row's pick, and three different picks make it `unstable`, a miss |
| REQ-009 | Every call and exit has one handling, and the cost prints first | Before its first call the Deem arm prints "nothing leaves the machine", its planned calls (3 per labeled output) and a wall time at 65.6 ms per call, labeled as the `choice` p50 in `deem-local.md`. Before `jev auth test` the Jev arm prints the payload class, its planned calls (3 per labeled output, plus 1) and the estimated input tokens, never a dollar figure. `calls.jsonl` and the exit handling follow phase 017's REQ-008, with the output id in place of the row id. Exit 4 or a malformed answer leaves that call `unmeasured`, never a guessed verdict. `--deem` or `--jev` without `--out <dir>` exits 2 before any call |
| REQ-010 | A keep holds only for what it was measured on | The report records the Deem commit pair or the Jev version, provider and model per column. A run whose `--out` already holds a `report.json` from another pair prints `requalify: model commit changed`, or `requalify: model changed` for Jev, before its own verdict |
| REQ-011 | Tests cover every public surface | The new vitest file exits 0 with at least 16 passing cases: a happy path and one edge case each for the fixture replay (a synthetic output with no verdict line counts as a miss), the outputs-file parser (a bad label), the report reader (a `none` count), the label gate (11 labeled prints the stop line, and a missing `block` prints its stop line), the loose baseline (a trailing "fail" after prose reads `fail`), headroom (a saturated fixture prints `no headroom`), the default run (stubs log nothing), the Deem gate (a fake health passes, a stub backend skips byte-identical), the Jev gate (exit 0 passes, exit 3 prints `jev arm skipped: no credential`), `--out` missing (exit 2 before any call) and the verdict (`keep`, `kill`, `stop (margin)`, `stop (coverage)` and `stop (flips)`) |
| REQ-012 | The changed skill's docs stay true to the code (parent goal D6) | deep-improvement's `SKILL.md`, `README.md`, one new changelog file, one catalog entry with its index row and one playbook scenario with its index row name the script, its zero-call default and its two switches, written through sk-doc. `validate_document.py` exits 0 on each changed doc. No doc claims a verdict the runs did not print |

### Keep Rule (fixed 2026-09-29, before any model run)

**Inputs.** K is the count of labeled regex-miss outputs (REQ-003). An output is measured in a column when all three option orders returned a submitted key. M counts measured outputs. A counts the measured outputs whose modal pick equals the label, with `unstable` a miss. B counts those where the baseline method's pick equals it. The baseline method is the better of the majority class and the loose rule on the K labeled outputs, the loose rule on a tie. W counts the outputs only the column gets right and L those only the baseline method gets right. F sums each output's non-modal picks, 3 minus the count of its most common pick.

**Checks, in this order.** The first that fails sets the verdict.
1. Coverage: `10*M >= 9*K`, else `stop (coverage)`.
2. Kill: when the exact one-sided binomial p_loss, the chance of L or more successes in W+L fair trials, is below 0.05, the verdict is `kill`.
3. Margin: `10*(A-B) >= M`, a gain of at least 10 points, else `stop (margin)`.
4. Sign test: p_win, the chance of W or more successes in W+L fair trials, is below 0.05, else `stop (sign test)`. Both p values are 1 when W+L is 0.
5. Flips: `10*F <= 3*M`, a flip rate of at most 0.10 over the 3M calls, else `stop (flips)`. The three option orders are the stability clause for both backends (research C4).

Otherwise the verdict is `keep`. Counts stay integers and p is computed exactly. When the baseline method is right on more than 90 percent of labeled outputs, the census prints `no headroom` and neither arm calls. The power line states that a keep needs at least 5 wins with no loss, since 0.5^5 is 0.031.

**The verdict line.** One line per column on stdout and in that column of `report.json`:

`verdict <jev|deem>: <keep|kill|stop (<reason>)> K=<k> M=<m> A=<a> B=<b> W=<w> L=<l> F=<f> p_win=<p> p_loss=<p> labels_sha256=<hash>`

The Deem line adds `model=<id> model_commit=<sha> source_commit=<sha>`, and the Jev line adds `jev_version=0.6.2 provider=<P> model=<model>`. Only a live `--out` run counts, never a stub, fake-server or test verdict. A `keep` wires nothing: a classifier value for `--grader` needs a later phase, and opening one is the operator's call. A `kill` is evidence against that backend as the fallback. A stopped arm prints its stop line and no verdict.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: With zero calls, the operator learns how often recorded reviewer outputs miss the verdict line, which is research question 6, and whether any reviewer report names a `none` verdict.
- **SC-002**: Past the label gate, one `--deem --out <dir>` run prints `verdict deem:` with its commit pair and a per-call record, so R5 is settled on a counted number. A `--jev` run, when the operator asks for one, does the same for Jev.
- **SC-003**: A run with neither switch, or with every requested check failing, calls nothing and changes nothing.

### Proof Plan

Written before the build. S is `.skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark`, and the vitest command runs from `.skilled/skills/system-deep-loop/deep-improvement/scripts`.

1. `node S/lib/score-verdict-fallback.cjs` with stub binaries first on `PATH` exits 0, prints `fixture cases: 8 hits: 8 misses: 0` and `stop: fewer than 12 labeled regex-miss outputs`, and both stub logs stay empty. Boundary: a synthetic output ending "Looks fine to ship." counts as a miss.
2. With an outputs file of 12 labeled misses covering all three verdicts, the census prints both baselines and `planned calls:`. Boundary: 11 misses print the stop line, and no `block` label prints `stop: no labeled block output`.
3. `--deem` with a stub `cli-deem health` reporting backend `stub` prints `deem arm skipped: stub backend`, and `--jev` with a stub whose `auth status --provider official` exits 3 prints the identity line, then `jev arm skipped: no credential`. Each exits 0 with the rest of stdout byte-identical to the census.
4. `npx vitest run model-benchmark/tests/verdict-fallback.vitest.ts` exits 0 with at least 16 passed and 0 failed, and the whole `model-benchmark/tests/` suite fails nothing beyond T002's baseline.
5. After each census and model run `git status --porcelain` matches its pre-run output, and the secret grep of REQ-007 prints nothing.
6. Past the label gate, one live `--deem --out <dir>` run prints one `verdict deem:` line, and every `calls.jsonl` line holds `wallMs`, `exitCode`, `modelId`, `modelCommit` and `sourceCommit`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Regex-miss outputs with text | High. None exists, and a live run keeps only a hash (`reviewer-scorer.cjs:203`) | The census counts what the operator names and stops at the gate. The phase closes there if no misses arrive, which is itself R5's answer: the fallback has nothing to classify |
| Dependency | Release and backends | The operator released the phase on 2026-09-29, so the build can start. An arm cannot run without its backend | Parent goal D3, amended by the operator's "Bind and release", releases this phase. Builds run in number order, and disjoint builds may run in parallel. Each arm prints its skip line |
| Risk | The meaning of `block` is not defined in the fixtures or the schema | Med. The option descriptions shape every answer | The descriptions are fixed here as proposals and printed with their hash. The owner confirms them at review, and a change before the first run is an amendment |
| Risk | 12 labeled misses give little power | Med. A keep needs at least 5 discordant wins with no loss | The power line prints before any call. A `stop (sign test)` on a small set is recorded as underpowered evidence, not a kill |
| Risk | The loose rule may already classify most misses | Low for the phase, high for the value | That outcome prints `no headroom` or `stop (margin)`, and it answers R5 without a model: a regex change would do |
| Risk | Output text leaves the machine on the Jev arm | Med. Operator-named outputs are usually untracked | An untracked outputs file needs `--accept-payload`, the payload class prints first and Deem keeps everything on the machine |
| Risk | A Deem update lands mid-run | Low | Exit 4 rechecks the commit pair and stops the arm with finished rows `partial`. A keep holds only for its pair (REQ-010) |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- How does the operator collect regex-miss outputs with their text? A live run records only a hash (`reviewer-scorer.cjs:203`). The options are an opt-in output save in the reviewer scorer, a change to the owner's file that this phase does not make, or reviewer outputs gathered from other review sessions.
- Should the existing `--grader llm` classifier (`reviewer-scorer.cjs:155-167`) join as a reported column? R5's smallest slice runs it once for a first classifier number. It dispatches a general model, and this phase measures the parent's two classifier backends.
- What does `block` mean to the reviewer prompt family? The prompt templates offer `PASS`, `FAIL` and `BLOCK` with no definition, so the proposed description needs the owner's word.
<!-- /ANCHOR:questions -->

---
