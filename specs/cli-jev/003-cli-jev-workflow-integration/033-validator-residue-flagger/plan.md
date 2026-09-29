---
title: "Implementation Plan: Phase 33: validator-residue-flagger"
description: "One read-only Node script in deep-review's scripts counts committed correctness and traceability finding rows, draws 100 passages for the operator to label and, behind --jev or --deem and each backend's own gate, asks one noul per labeled passage under a keep rule fixed in the spec. Jev first, else Deem. Offline only, no review table changes."
trigger_phrases:
  - "residue flagger plan"
  - "score-residue-flagger plan"
  - "residue flagger label gate"
  - "residue flagger build order"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 33: validator-residue-flagger

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node CommonJS (`.cjs`), standard library only, beside `render-contract-snapshot.cjs` in `.skilled/skills/system-deep-loop/deep-review/scripts/` |
| **Framework** | None. The script runs `git ls-files`, `git log` and `git show` for reads, and spawns `jev` and `cli-deem` as binaries |
| **Storage** | None. Reads committed review files and documents, writes the labels file only in `--draw` mode and reports only to an operator-named directory |
| **Testing** | `node --test` on `scripts/tests/score-residue-flagger.test.cjs`, beside `reduce-state-summary-fallback.test.cjs` |

### Overview

`score-residue-flagger.cjs` (proposed) reads finding tables in committed review files by header, resolves each correctness and traceability row to a passage at the commit the review read and prints a census with zero calls. `--draw` writes 100 rows with no text: 50 finding-cited passages and 50 passages from the same documents that no finding cites. The operator labels every row `defect` or `clean`. Until 100 rows carry a label, every run prints `stop: fewer than 100 labeled rows`. With labels, it prints the flag-nothing baseline and a headroom line, then, behind `--jev` or `--deem` and a passing gate, asks one `noul` per row for its category and prints `verdict <backend>: keep`, `kill (precision)` or `stop (<reason>)` per column under spec REQ-006. Jev first, else Deem (parent goal D1).
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] The operator released this phase on 2026-09-29: the "Bind and release" answer amended parent goal D3, so this is a check, not a wait. Builds run in number order, and disjoint builds may run in parallel
- [ ] The keep rule, the draw rule and the two `-q` instructions in `spec.md` are unchanged since 2026-09-29
- [ ] Phase 008 (`ee3a1b057c`) and phase 009 (`ea883967d4`) are Complete, which they are, so this is a check, not a wait

### Definition of Done
- [ ] The test file exits 0 with at least 18 passed
- [ ] The labels file holds 100 operator labels, or the phase log records `stop: fewer than 100 labeled rows` as the state it waits in
- [ ] One verdict line per backend whose gate passed, or `no headroom` or `underpowered`, is in `goal.md`'s log for the parent goal's log
- [ ] `git status --porcelain` shows only the Files to Change paths, this phase folder and the report directory
- [ ] `validate_document.py` exits 0 on every skill doc the phase changed (parent goal D6)
- [ ] A cross-family review of the code leaves no open P0 or P1 finding (parent goal D5)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Single-file offline measurement script with exported pure functions for the tests and a `main()` that runs only as the entry point, the shape of phase 017's scorer.

### Key Components
- **Corpus walker**: tracked `*.md` under `specs/` with `/review/` or `/ai-council/` in the path, outside `/context/` and `/scratch/`.
- **Table parser**: finds a table by its header, reads the severity, dimension and location columns and counts the tables it skips per header shape.
- **Commit and location resolver**: the first parent of the commit that added the review file, then a tracked `.md` and a line that exists there, read with `git show`, with `.env` basenames refused.
- **Drawer**: `--draw --seed <n>` writes 100 rows at their reviewed commits, 50 positives and 50 negatives, 25 per category each, negatives kept 20 lines from any cited line.
- **Baseline and label gate**: flag-nothing on the labeled rows, the stop line under 100 labels and the headroom lines.
- **Deem arm**: the health gate, the payload notice, one `cli-deem noul` per row with its category's instruction, exit handling and records with the commit pair.
- **Jev arm**: the identity line, the three checks, one `jev auth test --provider P`, the payload notice, three `jev noul --provider P` calls per row with no cache, the 90 s cap, exit handling and records with version, provider and model.
- **Verdict**: spec REQ-006's five conditions in order, integer counts, an exact p and one line per column on stdout and in `report.json`.

### Data Flow

Committed review files become finding rows. Correctness and traceability rows with a resolvable location become the positive frame, and the same documents at the same commits give the negative frame. `--draw` samples both into the labels file, and the operator labels it. Each run reads each labeled window at its commit and prints the baseline and headroom. With a switch and a passing gate, each row gets its backend's probability, reduced to a flag at 0.5, and each column's verdict compares that flag with flag-nothing on the rows it measured. A failed gate never starts the other backend.

### Affected Surfaces

| Surface | Current role | Action | Verification |
|---------|--------------|--------|--------------|
| Review files, templates, reducers and findings | Deep-review's record | Read only, never edited, no column added | `git status --porcelain` unchanged by a run, and `git diff --stat` on `deep-review/assets/` and `runtime/scripts/reduce-state.cjs` is empty |
| Documents a finding cites | Read-only input | Read at the reviewed commit with `git show` | No working-tree file opened for a passage |
| `cli-deem`, `jev` | Transports | Spawned only behind a switch and a passing gate | Stub logs empty on the default run |
| deep-review `SKILL.md`, `README.md`, changelog, catalog, playbook | Skill docs (parent goal D6) | One addition each through sk-doc | `validate_document.py` exits 0 on each |
| Credentials | `jev` resolves its own key | Never read or passed | The key grep of spec REQ-009 returns no match |
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.

**Who builds (parent goal D5).** A fresh Opus 5.5 xhigh build orchestrator writes one single-change brief per step below and runs them through Devin `deepseek-v4-1-flash-max` and Pi `llmgateway/mimo-v2.6-pro` at thinking `high`, by Bash only. The parent session verifies each step against its check, sends the code to a review by a model family other than the one that wrote it and commits with path-scoped commits. The build fixes P0 and P1 findings and records P2 findings. Code follows sk-code's OpenCode route, and the skill docs go through sk-doc (parent goal D6).

Each step's observable check:

1. **Baseline.** Run `node --test .skilled/skills/system-deep-loop/deep-review/scripts/tests/` and record the pass and fail counts with the exit code before any change.
2. **Census.** Check: the default run prints rows per severity, per dimension and per header shape, the skipped tables and the resolvable correctness and traceability rows, with the HEAD commit, and the stub logs stay empty.
3. **Draw.** Check: `--draw --seed 1` twice into two temp paths gives byte-identical files with 100 rows and no text field, no negative sits within 20 lines of a cited line, and a third `--draw` over a file with a label exits 2. With fewer than 25 resolvable rows in a category, the draw exits 2 and names the shortfall.
4. **Baseline and label gate.** Check: the default run on the drawn file prints `stop: fewer than 100 labeled rows`, and on a test file with 100 labels prints flag-nothing's accuracy, the `defect` share, `margin: 0.10`, the `keep rule:` line and a headroom line.
5. **Model arms.** Add the Deem arm, then the Jev arm. Check: the test cases for both gates, both skips, both exit paths and one `--provider` per `jev` call pass.
6. **Verdict.** Check: the test cases `keep`, `kill (precision)`, `stop (coverage)`, `stop (margin)` and `requalify` pass.
7. **Label gate.** The build commits the drawn file and stops. The operator labels 100 rows. Check: the default run no longer prints the stop line.
8. **Runs.** One zero-call run, then, unless it prints `no headroom` or `underpowered`, one `--jev --out <dir>` run when the Jev gate passes and one `--deem --out <dir>` run when the Deem gate passes. Check: one verdict line per column that ran, and every `calls.jsonl` line carries `wallMs` and `exitCode`, the commit pair on Deem lines and provider and model on Jev lines. The lines go in `goal.md`'s log.
9. **Skill docs.** After the runs. Check: `validate_document.py` exits 0 on each changed doc, and the Hermes copy of `SKILL.md` is regenerated.
10. **Review and commit.** Check: no open P0 or P1 finding, and the deep-review test run fails nothing beyond step 1's baseline.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test type | Scope | Tools |
|-----------|-------|-------|
| Unit | Table parser (header read, skipped shape), commit resolver (parent of the adding commit, untracked review file), location resolver (tracked `.md` line, refused `.env`), drawer (reproducible, 20-line spacing, no overwrite, category shortfall), verdict (`keep`, `kill (precision)`, `stop (coverage)`, `stop (margin)`, `requalify`) | `node --test`, fixture review folders in a temp git repository with two commits |
| Integration | Default run with stub binaries (no call, no file), label gate at 99 rows, Deem gate (fake health passes, stub backend skips byte-identically), Deem exit 4 with a changed pair, Jev gate (passing stub, `no credential` skip), Jev exit 3 after the gate, `--out` required, one `--provider` on every stub `jev` call | `node --test` with stub `jev` and `cli-deem` first on `PATH` |
| Manual | One zero-call run on the real tree, the operator's labels, then one live run per available backend | Terminal, operator-named `--out` directory |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if blocked |
|------------|------|--------|-------------------|
| The operator's release | Operator | Released 2026-09-29 (parent goal D3, amended by the operator's "Bind and release"). Builds run in number order, and disjoint builds may run in parallel | Nothing is built |
| The operator's 100 labels | Operator | Waiting on the draw | Steps 8 and 9 wait. The phase holds at the label gate |
| Phase 008 `cli-deem` | Internal | Complete (`ee3a1b057c`) | The Deem arm cannot run |
| Local Deem server passing its check | External, operator-run | Served per `007-classifier-deep-research/context/deem-local.md` | The Deem run prints its skip line |
| `jev` 0.6.2 and a credential for provider P | External, operator-held | `jev --version` printed `jev 0.6.2` on 2026-09-29 (this leaf) | The Jev run prints its skip line |
| sk-doc modes for the docs | Internal | Available | Step 9 waits |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A test fails after merge, a run writes outside its report directory, or the operator drops R26 after a `kill` or `stop`.
- **Procedure**: Stop a running arm with Ctrl-C, which exits 130 and prints `interrupted`. Revert the phase's path-scoped commits: the script, its test, the labels file, the two README rows and the skill docs. Delete the operator-named report directory if it is inside the repository. No review file changed, so nothing else reverts.
<!-- /ANCHOR:rollback -->

---
