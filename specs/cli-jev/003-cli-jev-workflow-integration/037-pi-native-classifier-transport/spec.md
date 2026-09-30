---
title: "Feature Specification: Phase 37: pi-native-classifier-transport"
description: "Pi 0.99.1 can call Jev itself through `ModelRuntime.classify()`, while this packet reaches Jev only by shelling out to the `jev` CLI. Nobody has measured whether Pi's route gives the same answers at a similar speed and cost, and the packet has no measured basis for wiring Pi in. This phase produces one measured verdict before any integration change."
trigger_phrases:
  - "pi native classifier transport"
  - "pi model runtime classify"
  - "jev transport comparison"
  - "pi transport verdict"
  - "classifier replay comparison"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 37: pi-native-classifier-transport

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-09-30 |
| **Branch** | `worktrees/071-cli-jev-sk-alignment` |
| **Parent Spec** | ../spec.md |
| **Phase** | 37 of 37 |
| **Predecessor** | 036-sk-code-and-sk-doc-alignment |
| **Successor** | None |
| **Handoff Criteria** | The five completion criteria in `goal.md` each run from the final state: the zero-call census prints Pi's version, the classifier models per provider, the jev CLI identity line and the replay row count while making no model call, one approved live run prints its agreement, probability-difference, latency and cost lines with every call in `calls.jsonl` and ends in one `verdict pi-transport:` line under the keep rule fixed in `spec.md` section 4, the comparison script's `node --test` suite passes with both backends stubbed, `validate_document.py` is VALID on every changed doc, and `validate.sh --strict` prints `RESULT: PASSED` for this phase. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 37** of the cli-jev workflow integration specification. It is the test the operator chose on 2026-09-30 after sharing a post that Pi 0.99 supports Jev natively and asking how to bring it in. The operator chose "Test it first (Recommended)": "New phase 037 in 003: run Pi's classify() and our jev CLI on the same rows and compare answers, speed and cost. Check which of our providers work, including the free OpenCode Jev. Check whether a llama.cpp model could stand in for Deem. Then decide."

The first slice is a zero-call census, the pattern phases 002 and 019 already use: read what is installed and what is available before any call costs anything. The live comparison is a second slice behind its own switch and the operator's yes. Nothing is decided by inference. One measured verdict on Pi as a Jev transport goes into the record, and a later phase decides whether to wire it.

**Scope Boundary**: one new Node comparison script under `.skilled/skills/cli-classifier/benchmark/pi-transport/` (proposed) with its tests, and the cli-classifier doc updates parent D6 requires for it: the folder README, a `benchmark/README.md` row, a feature catalog entry and a playbook scenario, each written through sk-doc. Nothing is wired into `cli-classifier` or `cli-pi`. No file in the skill-advisor runtime tree is edited, and no install runs.

**Dependencies**:
- Phase 036 (`036-sk-code-and-sk-doc-alignment`), Complete.
- The operator's yes for the live run. The default run needs none of it.
- For any llama.cpp column, an install yes, because `command -v llama-server llama-cli` finds nothing on this machine.
- Installed Pi 0.99.1 at `~/.local/lib/node_modules/@earendil-works/pi-coding-agent` and `jev 0.6.2` on `PATH`, both recorded in `scratch/context/context.md`.
- The 019 baseline `specs/cli-jev/003-cli-jev-workflow-integration/019-advisor-suggested-order/scratch/w4-session/jev-run/calls.jsonl`, 334 lines: one `auth_test` and 333 `choice` calls over 111 rows on `jev-1.13.0` through provider `official`.
- Build roles: parent D5 through this phase's D6. Skill docs: parent D6.

**Deliverables**:
- `compare-pi-transport.mjs` (proposed name) under `.skilled/skills/cli-classifier/benchmark/pi-transport/`, with a zero-call census by default and one live comparison arm behind its own switch.
- `tests/compare-pi-transport.test.mjs` (proposed) covering every public surface, both backends stubbed.
- One zero-call report, and on the operator's yes one live run with its `calls.jsonl` in a directory the operator names.
- The cli-classifier docs of section 3, written through sk-doc.
- Every run line and the verdict line recorded in `implementation-summary.md` and `goal.md`'s log.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Pi 0.99.1 can call Jev itself. Pi's `CHANGELOG.md` 0.99 lines 29, 36, 40, 41, 45 and 52 record classifier models in `ModelRuntime` with `classify()`, a built-in TypeSafe `jev-latest` model, Jev on OpenRouter, Cloudflare Workers AI, Vercel AI Gateway and OpenCode Zen, every llama.cpp chat model also listed as a classifier, and `models.classify()` in codemode scripts with its cost added to the session. `docs/models.md:103-136` says classifier models answer typed `choice`, `bool` and `score` questions about JSON state with probabilities, and reach them through codemode, an extension or the SDK. `.skilled/skills/cli-external-orchestration/cli-pi/SKILL.md` never mentions classifiers.

This packet reaches Jev by shelling out instead. `.skilled/skills/cli-classifier/cli-usage/SKILL.md:97` pins `jev --version` at `jev 0.6.2`, and the shipped arms run `jev noul|choice|score` after `jev auth status --provider <p>`. Nobody has measured whether Pi's route answers the packet's questions the same way, at a similar speed and cost, so the packet has no measured basis for wiring Pi in.

The session's zero-call probe, `ModelRuntime.create()` then `getAvailableOfType('classifier')` with no classify call, found 12 classifier models known and 7 with credentials present, all through `openrouter`: `~typesafe/jev-latest`, `typesafe/jev-1.13`, `jaredpalmer/kev-4b`, `respan/span-01`, `respan/span-01-lite`, `respan/span-01-lite:free` and `upstage/solar-decide`. `typesafe/jev-latest` was not available without a `TYPESAFE_API_KEY` in Pi, and `opencode/jev-1.13` and `opencode/jev-1.13-free` were not available because our OpenCode credential is Go, not Zen. Cloudflare and Vercel were not available either. The packet also holds a recorded comparison baseline. The operator's live 019 Jev run holds 333 `choice` calls over 111 rows on `jev-1.13.0` through provider `official`, every call `measured` on attempt 1, each with `row_id`, `order`, `call_ms` and the full `probabilities` map. That is the same Jev 1.13 model the Pi route would ask through OpenRouter, so both sides can be compared on identical rows without inventing a fixture.

### Purpose

Produce one measured verdict, before any integration change, on whether Pi's native classifier runtime answers the packet's Jev questions as the jev CLI does at a similar speed and cost.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- The zero-call census: Pi's version, the classifier models known and available per provider, the jev CLI identity line, whether a llama.cpp router answers, and the replay row count. No model call and no file written.
- The live comparison arm behind its own switch and the operator's yes: replay the 019 rows through Pi `classify()` on `openrouter` `typesafe/jev-1.13` as `choice` questions, with the CLI side read from the recorded `calls.jsonl`, or both sides rerun on a fresh fixture when section 10's first question resolves that way.
- Coverage, top-choice agreement, the median absolute probability difference, p95 latency per side and Pi's cost per 100 calls.
- The keep rule in section 4, fixed at spec approval before any live run, and one verdict line.
- The proposed script under `.skilled/skills/cli-classifier/benchmark/pi-transport/`, its `node --test` tests with both backends stubbed, and the cli-classifier docs parent D6 requires.
- The operator's yes gates the live run and every extra column.

### Out of Scope

- Wiring Pi into `cli-classifier` or `cli-pi`. A later phase decides that after the verdict, on the operator's call.
- Editing anything under `.skilled/skills/system-skill-advisor/runtime`, including `score-suggested-order.mjs`. Another session's align packet owns that tree, so this phase reads the script and the 019 outputs and never edits them.
- Installing llama.cpp, or any dependency. A llama.cpp column waits on the operator's install yes, and the machine has no `llama-server` or `llama-cli`.
- Writing a key anywhere, opening a `.env` file or moving a credential. Pi's own store keeps its credentials.
- A shared client library, a change to any existing transport, or any prompt-hook behavior.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/cli-classifier/benchmark/pi-transport/compare-pi-transport.mjs` | Create | Census, live arm, comparison metrics and the keep-rule verdict. Proposed name |
| `.skilled/skills/cli-classifier/benchmark/pi-transport/tests/compare-pi-transport.test.mjs` | Create | Every public surface, both backends stubbed, run with `node --test`. Proposed name |
| `.skilled/skills/cli-classifier/benchmark/pi-transport/README.md` | Create | The folder README through sk-doc: what the run measures, how to run it, the switch and the verdict. Proposed name |
| `.skilled/skills/cli-classifier/benchmark/README.md` | Modify | One row in section 2 LAYOUT for the new folder |
| `.skilled/skills/cli-classifier/feature-catalog/measurements/pi-transport-comparison.md` | Create | One catalog entry through sk-doc. Proposed name |
| `.skilled/skills/cli-classifier/feature-catalog/feature-catalog.md` | Modify | The index row for the entry above |
| `.skilled/skills/cli-classifier/manual-testing-playbook/measurements/pi-transport-comparison.md` | Create | One playbook scenario through sk-doc. Proposed name |
| `.skilled/skills/cli-classifier/manual-testing-playbook/manual-testing-playbook.md` | Modify | The index row for the scenario above |
| `<operator-named report dir>/` | Create at run time | `report.json` and `calls.jsonl` from a live run |
| `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-suggested-order.mjs` | Read only | The prompt shape a replay needs. Owned outside this phase |
| `specs/cli-jev/003-cli-jev-workflow-integration/019-advisor-suggested-order/scratch/w4-session/jev-run/calls.jsonl` | Read only | The recorded CLI answers and their timings |
| This phase folder's six docs, plus `description.json` and `graph-metadata.json` through `repair-derived.cjs` | Modify | The phase record |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | **The default run makes zero model calls.** It prints Pi's version, the classifier models known and available per provider, the jev CLI identity line, whether a llama.cpp router answers, and the replay row count. It calls no `classify()`, reaches no network service and writes no file. Boundary: a machine with no Pi credential still prints the per-provider availability and exits 0 |
| REQ-002 | **The live arm is dormant behind its own switch and the operator's yes.** Without the switch the default lines print byte-identically and nothing is spawned. A live run needs `--out <dir>` and refuses with exit 2 before any call without it (proposed). Every call is recorded, one line per call in `calls.jsonl` with row id, order, wall ms, exit code, status and the full probability map |
| REQ-003 | **The script never handles a credential.** It calls `ModelRuntime.create()` and lets Pi resolve credentials from its own store. It never reads, prints, stores or passes a key. `grep -nE 'API_KEY\|TYPESAFE\|Bearer\|Authorization'` on the script exits 1 |
| REQ-004 | **Both sides ask the same model, Jev 1.13.** Pi asks `openrouter` `typesafe/jev-1.13`. The CLI side is the recorded `official` provider run on `jev-1.13.0` in the 019 `calls.jsonl`. If the design finds the two sides do not line up row for row, both sides rerun on a fresh fixture the design builds, on the operator's yes (proposed fallback) |
| REQ-005 | **The live run reports its numbers.** Coverage, top-choice agreement, the median absolute probability difference over the measured maps, p95 latency per side and Pi's cost per 100 calls. Every number comes from the run's own records, never from memory or another report |
| REQ-006 | **The keep rule is fixed at spec approval and prints one verdict line.** The rule in the Keep Rule block below is fixed before any live run. Changing it after the first live call is an amendment that voids the verdict. The run ends in one `verdict pi-transport: adopt\|keep-cli\|stop (<reason>)` line plus its fields |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-007 | **A measured row needs a full probability map.** An answer counts only with a probability for every submitted choice. A partial map marks the row `unmeasured` and never becomes a zero. A row measured by neither side stays out of both totals |
| REQ-008 | **Every non-measured exit has one handling.** A timeout at the design's fixed bound, a backend refusal, a missing credential and an unknown model each print one skip or stop line and record their status in `calls.jsonl`. A stopped arm prints its finished rows `partial` and no verdict |
| REQ-009 | **Tests cover every public surface.** Each surface gets a happy path and one edge case, and both backends are stubbed: no test opens a network socket, calls a model or needs a credential |
| REQ-010 | **Read-only where it matters.** A default run leaves `git status --porcelain` as it was. A live run writes only inside the operator-named report directory. The 019 baseline, the corpus and every skill runtime file stay unchanged |
| REQ-011 | **Docs through sk-doc.** The folder README, the `benchmark/README.md` row, the catalog entry with its index row and the playbook scenario with its index row each pass `validate_document.py` VALID, and no doc claims a verdict that no run printed |
| REQ-012 | **Executors and scope (parent D5 through D6).** DeepSeek V4.1 Flash writes, MiMo v2.6 Pro reviews, no Claude worker writes or reviews. P0 and P1 findings are fixed and rechecked, P2 findings are recorded. Only the files in section 3 change, and code comments carry no spec path, phase number or requirement id |

### Keep Rule (fixed at spec approval, before any live run)

The rule below is the context's proposed frame, fixed here at spec approval. Changing a threshold after the first live call is an amendment that voids the verdict.

**Inputs.**
- K: the replay rows the arm may ask. The 019 baseline holds 111 rows and 333 `choice` calls.
- M: the rows with a full Pi probability map.
- The CLI side's per-row top key: the top key by the CLI's own recorded probabilities over the row's orders.
- The Pi side's per-row top key: the top key by the mean Pi probability over the row's orders.
- Agreement: the share of the M rows whose two top keys match.
- The median absolute probability difference: over the M rows' full maps, the median of the absolute difference between the Pi and CLI probabilities for each submitted key.
- p95 latency per side: over each side's calls in the run.
- Pi's cost per 100 calls: the number Pi reports for the run, scaled to 100 calls.

**Thresholds, checked in this order.** The first that applies sets the verdict.

1. Coverage: at least 90 percent of K measured, else `stop (coverage)`.
2. Agreement at least 95 percent and Pi's p95 latency at most 1.5 times the CLI's, else `keep-cli` naming the failed bound.
3. Otherwise `adopt`.

**The verdict line.** One line on stdout, and the same fields in `report.json`:

`verdict pi-transport: <adopt|keep-cli|stop (<reason>)> K=<K> M=<M> coverage=<pct> agreement=<pct> median_abs_dp=<v> p95_ms=<pi>/<cli> cost_per_100=<v>`

**What a verdict means.** An `adopt` holds only for the identities on its line and wires nothing. A `keep-cli` leaves today's transport in place. A `stop (coverage)` closes nothing and names what to fix. A stub or vitest verdict never counts.

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Before any call, the operator reads which providers carry a Jev classifier on Pi, whether the CLI identity line reports `jev 0.6.2`, and how many replay rows exist.
- **SC-002**: One approved live run yields the agreement, probability-difference, latency and cost numbers and one `verdict pi-transport:` line, under a rule fixed before the run.
- **SC-003**: A default run calls nothing, writes nothing and leaves `git status --porcelain` as it was.
- **SC-004**: Every changed doc passes `validate_document.py` VALID, and `validate.sh --strict` prints `RESULT: PASSED` for this phase.

### Proof Plan

Written before the build. `S` is the proposed `.skilled/skills/cli-classifier/benchmark/pi-transport/compare-pi-transport.mjs`, `T` its test file, and `STUB` a directory of logging `jev` and stub-backend fixtures.

1. With `STUB` first on `PATH` and the Pi SDK probe stubbed, `node $S` prints the census lines, exits 0, makes no classify call and writes nothing. Boundary: with no Pi credential the per-provider line reports zero available and the run still exits 0.
2. `node --test $T` exits 0 with at least one happy path and one edge case per public surface. Boundary: a partial probability map marks its row `unmeasured` and never a zero.
3. `node $S --live --out <dir>` on stubs writes `calls.jsonl` with one line per call and prints the report lines. `node $S --live` without `--out` exits 2 before any call (proposed).
4. On the operator's yes, one live run on the real tree prints one `verdict pi-transport:` line and every report line, with the model identity on each side read from the run. Boundary: any number not read from the run voids the verdict.
5. `python3 .skilled/skills/sk-doc/scripts/validate_document.py` exits 0 on every changed doc, and `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/cli-jev/003-cli-jev-workflow-integration/037-pi-native-classifier-transport --strict` prints `RESULT: PASSED`.

**Kill criterion.** A stub or vitest verdict never counts. A `stop (coverage)` closes nothing. An `adopt` or `keep-cli` holds only for the identities on its line, and a later Pi or Jev identity reruns the rule in full before any use.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 036 Complete | The phase could not be released | Complete, recorded in the parent goal |
| Dependency | The operator's yes for the live run | The live arm never runs | The default census stands alone and needs no yes |
| Dependency | Pi 0.99.1 with a credential in its own store for at least one classifier model | The Pi side cannot ask | The probe found 7 of 12 models available through `openrouter`, `typesafe/jev-1.13` among them |
| Dependency | The operator's install yes for a llama.cpp column | That column never runs | The column is extra, and the machine has no `llama-server` or `llama-cli` |
| Risk | Pi's classifier answers may not be comparable to the CLI's `choice` maps | High for the comparison | The design reads both shapes before the arm is written, records the mapping, and a mismatch reruns both sides on one fixture |
| Risk | A recorded CLI latency may not be comparable to a fresh Pi latency | Med for the speed bound | The keep rule takes the design's decision on a same-day rerun (section 10) |
| Risk | The Pi SDK `classify()` shape may differ from the docs in 0.99.1 | Med | The design reads `dist/core/model-runtime.d.ts` and one real answer before the arm is written |
| Risk | Pi's SDK probe touches the network | Low. `ModelRuntime.create()` refreshes no network state unless asked (`dist/core/model-runtime.d.ts:11`) | The census records whether any call left the machine |
| Risk | A llama.cpp model's raw label probabilities are overconfident and a small model may follow instructions inside the state (`docs/llama-cpp.md:89-99`) | Med for a llama.cpp column | That column is extra, behind its own yes, and reports the same metrics beside the Jev column |
| Risk | Another session edits the skill-advisor runtime tree while this phase reads it | Med | The read is read-only and the design records the revision it read |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The default run makes no network call and finishes in seconds on the recorded inputs.
- **NFR-P02**: Every live latency number is measured by the run, never budgeted or estimated elsewhere.

### Security
- **NFR-S01**: No key, token or `.env` file is read, written or printed. Credentials stay in Pi's own store.
- **NFR-S02**: The key grep on the script exits 1, and no file outside the named scope changes.

### Reliability
- **NFR-R01**: A stub-backed default run is byte-identical across repeats apart from any re-measured probe.
- **NFR-R02**: A live run records its own identity and its own timings, so a repeat run can be told apart from the first.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- A partial probability map marks its row `unmeasured`, never a zero.
- An empty or unreadable replay file stops with one line naming the path.
- A row with no recorded CLI answer stays out of both totals and is reported as unmeasured.

### Error Scenarios
- No Pi credential: the census reports zero available per provider and exits 0.
- An unknown model id: one skip line, and the arm does not start.
- A backend refusal or a timeout at the design's fixed bound: one recorded status, and the row stays unmeasured.
- The key grep matching anything: stop and remove the reference before any run.

### State Transitions
- A default run leaves no state behind.
- A live run's state is its operator-named report directory.
- An interrupted run prints its finished rows `partial` and writes no verdict line.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 16/25 | One new folder, one script and one test file, one doc folder, two index rows |
| Risk | 7/25 | Read-only, no runtime change, one switch and one operator yes |
| Research | 7/20 | The design must read Pi's SDK and the 019 scorer before the arm is written |
| **Total** | **30/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- Does `score-suggested-order.mjs` export the prompt builder a replay needs? UNKNOWN until the design reads it. The script sits in the skill-advisor runtime tree, which this phase reads and never edits. Proposed answer: if it exports a usable builder, the arm replays its rows. If not, both sides rerun on a fresh fixture the design builds, so both sides see identical rows.
- Is a same-day CLI rerun needed for a fair latency comparison? Proposed answer: the design decides from the 019 `calls.jsonl`. If its `call_ms` came from the same in-process path the replay uses, the recorded answers keep the comparison fair. If not, one same-day CLI rerun on the same fixture, on the operator's yes, so both sides share a day and a machine load.
- Which extra columns the operator wants. Proposed answer: none before the first verdict. The four other OpenRouter classifier families and a llama.cpp model each cost money, so each is its own operator yes, and the llama.cpp column also needs an install yes.
<!-- /ANCHOR:questions -->

---

