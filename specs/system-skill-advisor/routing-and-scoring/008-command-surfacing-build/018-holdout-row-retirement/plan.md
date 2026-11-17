---
title: "Implementation Plan: Phase 18: holdout-row-retirement"
description: "Run a count-only leak check, delete the sealed row suppressed-codex-abstain by its id, recapture the scorer eval baseline with the scoring date unchanged and say in the routing-accuracy README how a sealed row is retired."
trigger_phrases:
  - "holdout row retirement plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 18: holdout-row-retirement

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | JSON Lines data, a generated JSON baseline and Markdown. No source code changes |
| **Framework** | None. Node.js runs the capture script and the probes against the advisor's build (`npm run build` in `ADV`) |
| **Storage** | `holdout-prompts.jsonl` loses one line and `scorer-eval-baseline.json` is regenerated. Nothing outside the repository is written |
| **Testing** | Vitest in `ADV`: the scorer eval ratchet, the independence gate, the capture-date test and the full suite |

### Overview
The coordinator records the before numbers and runs the leak check before any edit. One worker deletes the sealed row with a single `grep -v` that prints nothing and sees the ratchet fail on the holdout hash. The coordinator recaptures the baseline with the scoring date unchanged and checks that only the holdout values moved. A second worker adds one sentence to the README row that describes the sealed file. The coordinator reruns the gates and the leak check, checks the boundaries and closes the phase.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Phases 016 and 017 are committed: `git -c core.fsmonitor=false log -1 --format=%h -- .skilled/commands/create/sk-skill.md` prints a hash and `git -c core.fsmonitor=false ls-files --error-unmatch .skilled/skills/system-skill-advisor/runtime/tests/derive-command-bridges-strings.vitest.ts` exits 0
- [x] The operator has answered Q6 in `spec.md` section 10
- [ ] `scratch/before.txt` holds every reading T001 names and the ratchet is green

### Definition of Done
- [ ] All acceptance criteria met
- [ ] The three parity tests and `env -u AI_SESSION_CHILD npx vitest run` in `ADV` report 0 failed, the command capture's four floor lines equal their before lines and the baseline moved only in the holdout values, `holdoutSha256` and `capturedAtSha`
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
A data retirement with a regenerated pin. No module, option or helper is added.

### Key Components
- **`holdout-prompts.jsonl`**: the sealed set. One line leaves it and every other byte stays.
- **`scorer-eval-baseline.json`**: the pin. Its `holdoutSha256` makes the ratchet fail until the recapture runs, and its `capturedAt` is the scoring date six other readers replay, so the recapture must keep it.
- **`probe-leak-scan.mjs` in `scratch/planning/`**: the count-only leak check. It runs before the edit to decide whether the phase may go on and after it to show the data line is empty.

### Data Flow
`capture-scorer-eval-baseline.mjs` reads the sealed file, scores each row under the recorded scoring date and writes the holdout counts and the file's hash into the baseline. The ratchet and the independence gate re-score the same file and compare with that baseline. The command capture and four tests read only the baseline's scoring date, and the ambiguity-slice test also reads the ambiguity values, which this phase leaves alone.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This plan answers a review observation and changes a shared gate's pinned input, so the addendum applies.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `holdout-prompts.jsonl` | The sealed set the holdout metric counts | update: delete one line | `--numstat` reads one line deleted, `HCOUNT` drops by one, `HROW` prints nothing |
| `scorer-eval-baseline.json` | Pins the holdout hash and counts and holds the scoring date | update: recapture | `HASHES`, `OTHERM` and `HOLDM` against `before.txt` |
| `scorer-eval-baseline-ratchet.vitest.ts` | Consumer: hash, exact correct count, 0.725 floor | unchanged | Fails on the hash after T003, passes after T004 |
| `holdout-independent.vitest.ts` | Consumer: 60-row floor, declared overlaps, top-1 floor | unchanged | Passes, and the overlap probe keeps every declared pair above 0 |
| `capture-scorer-eval-baseline.mjs` | Producer of the baseline | unchanged | T004 runs it with `--write` and no date variable |
| `build-holdout.mjs` | The builder, no longer the file's writer | unchanged | It already omits the id (`probe-rebuild-drift.mjs`) |
| `capture-command-routing-baseline.mjs`, `doctor-phrase-reach.cjs` and four advisor tests | Read the scoring date, and the ambiguity-slice test the ambiguity values | unchanged | `FLOOR` equals before and `VALL` reports 0 failed |
| `cli-classifier/benchmark/pi-transport/replay-helpers.mjs` | Pins 70 rows, stale since 2026-10-11 | unchanged, out of scope | Named in `spec.md` section 3 |
| `cli-external-orchestration` metadata, hub router, mode registry and `skill-graph.json` | Hold the cli-codex alias text | unchanged | `G diff --quiet BASE` over them exits 0 in T008 |
| Routing-accuracy `README.md` | Describes the sealed file | update: one sentence | T005 `rg` checks |

Required inventories, run at planning:
- Same-class producers: `PL/probe-leak-scan.mjs` checks every sealed row and every command holdout row against 50 data files and 100 scorer source files. At planning only `suppressed-codex-abstain` hits a data file at three words or more (`spec.md` section 2).
- Consumers of the changed files: `rg -l --hidden "holdout-prompts" -g '!**/node_modules/**' -g '!**/dist/**' -g '!specs/**' -g '!.git/**' .` lists the builder, the capture, the ratchet, the independence gate, the README and the classifier census helper. `rg -l --hidden "scorer-eval-baseline" -g '!**/node_modules/**' -g '!**/dist/**' -g '!specs/**' -g '!.git/**' .` adds the command capture, `doctor-phrase-reach.cjs` and its test, six advisor tests, the CI workflow, two changelogs, a reference doc and a retrieval allowlist, none of which pins a holdout value.
- Matrix axes: the row is a miss or a hit at T001, and phase 016 kept or moved the scoring date. Both are covered by the rules in REQ-002, which the T004 verify spells out.
- Algorithm invariants: every line other than the retired one is unchanged byte for byte, `capturedAt` is unchanged, every metric other than `holdout_top1` is unchanged and `holdoutSha256` equals the trimmed file's hash.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state. Setup is T001 and T002, both coordinator tasks. Implementation is T003 and T005 for workers, which may run in parallel, and T004 for the coordinator after T003. Verification is T006 to T009, run one at a time by the coordinator.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | The ratchet alone, failing on the hash after the deletion and passing after the recapture | `env -u AI_SESSION_CHILD npx vitest run tests/parity/scorer-eval-baseline-ratchet.vitest.ts` in `ADV` |
| Integration | The independence gate, the capture-date test, the full advisor suite and the command capture floors | `VX` on each parity test, `VALL`, `FLOOR` |
| Manual | The leak check before and after, the row verdict, the overlap counts and the `--paths` check over this folder | `scratch/planning/*`, each run as its first comment line says |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phases 016 and 017 committed | Internal | Yellow until T001 passes | No task starts, because the baseline and the README move under them |
| The operator's answer to Q6 | Operator | Answered 2026-11-13 | T002 applies the answered rule |
| The tsx loader in `.skilled/skills/system-spec-kit/node_modules` | Internal | Green | The overlap probe cannot load the TypeScript corpora |
| A new package | None | Not needed | Nothing |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a metric other than the holdout values moves in T004, a gate fails in T006 or the operator reverses the decision.
- **Procedure**: revert the phase commit with `git revert <sha>`. The sealed line and the baseline come back together, which the ratchet needs, because it pins the file's hash. No step writes data outside the repository.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup (T001, T002) ──► Implementation (T003 then T004, T005 in parallel) ──► Verification (T006 to T009)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Phases 016 and 017 committed, Q6 answered | Every edit |
| Implementation | T001 and T002 | Verification |
| Verification | T003, T004 and T005 ended | Close-out |
<!-- /ANCHOR:phase-deps -->

---
