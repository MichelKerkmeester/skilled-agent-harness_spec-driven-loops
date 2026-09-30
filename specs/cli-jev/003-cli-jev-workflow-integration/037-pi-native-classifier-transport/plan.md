---
title: "Implementation Plan: Phase 37: pi-native-classifier-transport"
description: "One Node script beside the cli-classifier benchmark reads Pi's classifier surface with zero calls, then behind one switch replays the 019 Jev rows through Pi's SDK against the recorded CLI answers and judges the pair under a keep rule fixed in the spec. DeepSeek writes, MiMo reviews, and the live run waits on the operator's yes."
trigger_phrases:
  - "pi transport comparison plan"
  - "pi classify replay plan"
  - "zero-call classifier census plan"
  - "pi transport keep rule"
  - "pi transport testing strategy"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 37: pi-native-classifier-transport

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node ESM (`.mjs`), standard library, plus Pi's SDK (`ModelRuntime` from `@earendil-works/pi-coding-agent`) and the 019 baseline `calls.jsonl` |
| **Framework** | None. The script runs the Pi backend in-process through the SDK and spawns `jev` only for the census identity line |
| **Storage** | None. It reads the committed 019 `calls.jsonl` and writes only to an operator-named directory on a live run |
| **Testing** | `node --test` over `benchmark/pi-transport/tests/`, the convention `benchmark/injection-screen/tests/score-injection-screen.test.mjs` uses, with both backends stubbed |

### Overview

`score-pi-transport.mjs` (proposed) prints a zero-call census by default: Pi's version, the classifier models known and available per provider, the jev CLI identity line, whether a llama.cpp router answers, and the replay row count. Behind its own switch and the operator's yes, it replays the 019 rows through Pi's SDK as `choice` questions on `openrouter` `typesafe/jev-1.13` and reads the recorded CLI answers from the 019 `calls.jsonl`. Coverage, top-choice agreement, the median absolute probability difference, p95 latency per side and Pi's cost per 100 calls feed the keep rule in `spec.md` section 4, which prints one `verdict pi-transport:` line. Nothing is wired, and no runtime file changes.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] The operator's ask is recorded: 2026-09-30, "Test it first (Recommended)", with the operator's words in `scratch/context/context.md`
- [ ] `scratch/context/context.md` is present and read, with Pi's API cites, the zero-call probe and the 019 baseline
- [ ] Pi 0.99.1 is installed and the SDK exports `ModelRuntime` and `classify()` (`dist/core/model-runtime.d.ts:56`, `:106`)
- [ ] `jev 0.6.2` is on `PATH`, and the 019 baseline `calls.jsonl` holds its 334 lines
- [ ] Phase 036 is Complete
- [ ] The executors are available under D6: DeepSeek V4.1 Flash to write, MiMo v2.6 Pro to review

### Definition of Done
- [ ] The five completion criteria in `goal.md` pass from the final state
- [ ] Every row of `acceptance-criteria.md` is `Met` with its observed command output, or left `Unmet` with the reason
- [ ] MiMo reviewed every DeepSeek diff and DeepSeek reviewed any MiMo fix, with no open P0 or P1 finding (parent D5 through D6)
- [ ] The key grep exits 1 on the script, and `git status --porcelain` is identical before and after a default run
- [ ] `validate.sh --strict` on this phase prints `RESULT: PASSED`, `check-goal.cjs` prints `RESULT: PASSED (5/5 checks)`, and `goal.cjs packet` prints `packet_durable_chars` at or under 4000
- [ ] Only the files in `spec.md` section 3 changed
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Single-file offline measurement script in 019's shape: exported pure functions for the tests and a `main()` that runs only as the entry point. The live arm sits behind one internal switch, and both backends can be stubbed, so the whole script is testable with no network and no model call.

### Key Components

- **Census**: reads Pi's version, calls `ModelRuntime.create()` then `getAvailableOfType('classifier')` with no classify call, runs `jev --version` and `jev auth status --provider official` for the identity line, checks `command -v llama-server llama-cli`, and counts the 019 `calls.jsonl` rows and calls.
- **Replay loader**: reads the 019 rows and their three orders each, then asks the design's first open question, whether `score-suggested-order.mjs` exports the prompt builder a replay needs or the build must rerun both sides (`--pi --cli`) on a fresh fixture.
- **Pi backend**: one `choice` question per row through the SDK's `classify(model, context, options?)` (`dist/core/model-runtime.d.ts:106`) on `openrouter` `typesafe/jev-1.13`, with the request shape `models.classify(model, { state, questions: { <name>: { type, instructions, criteria } } })` from `docs/models.md:103-136`.
- **CLI baseline reader**: the recorded `official` provider answers, probabilities and `call_ms` from the 019 `calls.jsonl`.
- **Comparison metrics**: coverage, top-choice agreement, the median absolute probability difference, p95 latency per side and Pi's cost per 100 calls.
- **Keep-rule judge**: the three ordered checks in `spec.md` section 4 and the one verdict line.
- **Record writer**: one `calls.jsonl` line per call and `report.json` in the operator-named directory.
- **Tests**: `node --test` over stub backends, one happy path and one edge case per public surface.

### Data Flow

The census runs first and prints what is installed, what is available and how many replay rows exist. Its lines decide whether anything may call. Behind the live switch and `--out`, each row's three orders go through the Pi SDK as `choice` questions, and every answer returns a probability map. The maps reduce to one Pi top key per row under the keep rule's definitions, and the recorded CLI top key comes from the same row's 019 answers. The two columns feed the three ordered checks, which print one verdict line and write the run's records. A dormant run stops after the census.

### Affected Surfaces

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Pi's SDK `ModelRuntime` | Classifier transport in the installed 0.99.1 package | Read only, through `ModelRuntime.create()` and `classify()` | The census prints the version and the model list, and the live arm's identity line names the model it asked |
| The `jev` CLI | Today's transport, pinned at `jev 0.6.2` | Read only, for the identity line and the 019 baseline | `jev --version` and one identity line print in the census |
| The 019 `calls.jsonl` | The recorded CLI side of the comparison | Read only, never edited | The replay row count prints, and `git status --porcelain` shows no change to it |
| `.skilled/skills/cli-classifier/benchmark/pi-transport/` | Does not exist | Create the script, its tests and its README | `node --test` passes, and the README passes `validate_document.py` |
| `benchmark/README.md`, `feature-catalog/`, `manual-testing-playbook/` | The hub's doc surfaces | Add two index rows and two entries | `validate_document.py` VALID on each changed doc |
| `cli-classifier` and `cli-pi` mode registries | Route today's transports | Not a consumer of this phase | No registry or runtime file changes |
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This is a measurement phase, not a bug fix, so the addendum records the surfaces the new comparison reads and the consumers that must stay untouched.

- Same-class producers of the compared shapes: `rg -n 'probabilities|choice' .skilled/skills/cli-classifier/cli-usage/benchmark/reports` and the 019 `calls.jsonl`, which hold the recorded CLI answers this phase reads.
- Consumers of Pi's classifier surface: `rg -n 'classify' .skilled/skills/cli-external-orchestration/cli-pi` returns only incidental hits, the `spec-gate-classify` guard name and one prose line about classifying a failure. `cli-pi/SKILL.md` itself never mentions classifiers, and this phase adds no consumer.
- Consumers of the keep rule: the new script's judge and the docs this phase writes. No runtime reads the rule.
- Matrix axes: the provider axis (Pi `openrouter` against the CLI `official`), the row axis (111 replay rows, three orders each) and the column axis (the Jev column in the first run, each extra column behind its own yes).
- Algorithm invariant: every reported number comes from the run's own records, and a row without a full probability map on either side is unmeasured rather than zero.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the task checkboxes and state. The six phases below are the plan of record.

**Who builds (parent D5 through this phase's D6).** DeepSeek V4.1 Flash writes the script, the tests and the docs, each dispatched by Bash through the external orchestration route. MiMo v2.6 Pro reviews every DeepSeek diff, and DeepSeek reviews any MiMo fix. No Claude worker writes or reviews. The session runs the census on the real tree and the one approved live run, records every result and commits path-scoped. P0 and P1 findings are fixed and rechecked, P2 findings are recorded.

Each phase's observable check:

1. **Design.** Read `score-suggested-order.mjs` and Pi's SDK, then write the interface and the test cases as a design note under `scratch/`. Check: the note names the exports the replay needs, the exact `classify()` request shape, the fixed timeout bound, the same-day-rerun decision and the fallback fixture, with every `UNKNOWN` item named.
2. **Zero-call census slice with tests.** The census, both availability lines, the identity line, the llama.cpp check and the replay row count, plus their tests. Check: a stub-backed default run prints the census lines, exits 0, makes no classify call and writes no file, and `node --test` exits 0.
3. **Live comparison arm with stubbed tests.** The replay, the Pi backend, the metrics and the verdict behind the switch, plus their tests with both backends stubbed. Check: `--pi --out <dir>` on stubs writes one `calls.jsonl` line per call and prints the report lines, and every public surface has a happy path and an edge case.
4. **Docs through sk-doc.** The folder README, the `benchmark/README.md` row, the catalog entry with its index row and the playbook scenario with its index row. Check: `validate_document.py` exits 0 on each.
5. **Cross-family review.** MiMo reviews every DeepSeek diff and DeepSeek reviews any MiMo fix. Check: one review file with a verdict, no open P0 or P1 finding, each review's file hashes equal before and after, and P2 findings recorded.
6. **The approved live run and closure.** On the operator's yes, the session runs the live arm on the real tree, reads the verdict line and every report line, records them in `goal.md`'s log and `acceptance-criteria.md`, runs the gates and refreshes the derived metadata. Check: one `verdict pi-transport:` line and `validate.sh --strict` `RESULT: PASSED`.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Commands run from the repository root. `S` is `.skilled/skills/cli-classifier/benchmark/pi-transport/score-pi-transport.mjs` (proposed) and `T` its test file (proposed).

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | The census readers, the metrics, the map reduction and the keep-rule judge, all pure | `node --test` |
| Stub integration | The default run and the live arm with a logging `jev` stub and a stubbed Pi backend, so no test opens a socket | `node --test`, stub fixtures |
| Zero-call check | The default run leaves `git status --porcelain` as it was and spawns no model call | `git status --porcelain`, stub logs |
| Doc gates | The folder README, the two index rows and the two entries | `validate_document.py` |
| Manual | The operator's one approved live run on the real tree | Terminal, the run's `report.json` and `calls.jsonl` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 036 | Internal | Complete | The phase could not be released |
| Pi 0.99.1 with `ModelRuntime.classify()` | External, installed | Installed at `~/.local/lib/node_modules/@earendil-works/pi-coding-agent` | No Pi side exists |
| A Pi credential for at least one classifier model | External, in Pi's own store | The probe found 7 of 12 available through `openrouter` | The live arm reports zero available and stops before any call |
| `jev 0.6.2` and the 019 baseline | Internal | Present | The census identity line and the CLI side are missing |
| The operator's yes for the live run | Operator | Not yet given | The live arm never starts. The default run is unaffected |
| The operator's install yes for a llama.cpp column | Operator | Not yet given | That extra column never runs |
| `score-suggested-order.mjs` | Internal, another session's tree | Read only | Without its prompt builder the build reruns both sides (`--pi --cli`) on a fresh fixture (`spec.md` section 10) |
| DeepSeek V4.1 Flash and MiMo v2.6 Pro | External, dispatched by Bash | Under D6 | A phase waits or reports the blocker |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A default run writes a file, the key grep matches, a stub-backed test opens a socket, or a file outside `spec.md` section 3 changes.
- **Procedure**: Stop the phase. Revert its path-scoped commits: the `benchmark/pi-transport/` folder, the `benchmark/README.md` row, the two catalog or playbook entries and their index rows. No runtime file changed, so nothing else reverts, and no mode registry or activation manifest needs a remint. Delete the operator-named report directory if it sits inside the repository.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Design) ──► Phase 2 (Census) ──► Phase 3 (Live arm) ──► Phase 5 (Review) ──► Phase 6 (Live run)
                                   └──► Phase 4 (Docs) ──────────────┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| 1. Design | `scratch/context/context.md` and the two read-only sources | Phase 2 |
| 2. Census | Phase 1 | Phases 3, 4 |
| 3. Live arm | Phase 2 | Phase 6 |
| 4. Docs | Phases 2 and 3, so the docs describe what the code does | Phase 6 |
| 5. Review | Phases 2 to 4 | Phase 6 |
| 6. Live run and closure | Phases 3 and 5, and the operator's yes | Nothing |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| 1. Design | Med | One read-and-record pass over the two sources |
| 2. Census | Low | One script slice plus its tests |
| 3. Live arm | Med | One script slice, the metrics and the stubbed tests |
| 4. Docs | Low | Two entries and two index rows through sk-doc |
| 5. Review | Med | One review round plus one fix round |
| 6. Live run and closure | Low | One approved run and the closure gates |
| **Total** | | The six phases above |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Baseline recorded: the 019 `calls.jsonl` row and call counts, Pi's version and model counts from the probe, and the key grep exit 1
- [ ] The stubs exist and the default run is byte-identical across two repeats
- [ ] The operator's yes is recorded before the live run starts

### Rollback Procedure
1. Stop the run or the phase at its failing check.
2. Revert the phase's path-scoped commits, paths only.
3. Rerun the default census and the key grep.
4. Record the revert and the reason in `goal.md`'s log.

### Data Reversal
- **Has data migrations?** No. The phase edits no persisted data and no runtime file.
- **Reversal procedure**: Not applicable. A `git revert` of the path-scoped commits removes the new folder and the doc rows, and deleting the operator-named report directory removes the run's output.
<!-- /ANCHOR:enhanced-rollback -->

---

