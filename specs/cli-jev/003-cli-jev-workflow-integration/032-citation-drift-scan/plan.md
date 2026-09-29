---
title: "Implementation Plan: Phase 32: citation-drift-scan"
description: "One read-only Node script in sk-doc's shared scripts counts skill-doc file:line citations, settles dead ones with no model, draws 40 rows for labels and, behind --jev or --deem and each backend's own gate, asks one noul per labeled row under a keep rule fixed in the spec. Jev first, else Deem. Offline only."
trigger_phrases:
  - "citation drift plan"
  - "cite-drift-scan plan"
  - "citation drift label gate"
  - "citation drift build order"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 32: citation-drift-scan

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node ESM (`.mjs`), standard library only, beside `frontmatter-version.mjs` in `.skilled/skills/sk-doc/shared/scripts/` |
| **Framework** | None. The script runs `git ls-files` and `git show` for reads, and spawns `jev` and `cli-deem` as binaries |
| **Storage** | None. Reads tracked docs and files at a recorded commit, writes the labels file only in `--draw` mode and reports only to an operator-named directory |
| **Testing** | `node --test` on `.skilled/skills/sk-doc/scripts/tests/test-cite-drift-scan.mjs`, beside `test-frontmatter-version.mjs` |

### Overview

`cite-drift-scan.mjs` (proposed) extracts `file:line` citations from tracked skill docs, resolves them in the synthesis's order and prints a census and a dead count with zero calls. `--draw` writes 40 rows with no text: 20 live citations the operator labels and 20 constructed drifts labeled by construction. Until 40 rows carry a label, every run prints `stop: fewer than 40 labeled rows`. With labels, it scores flag-nothing and an identifier-overlap check on identical rows, prints the baseline and a headroom line, and then, behind `--jev` or `--deem` and a passing gate, asks one `noul` per row and prints `verdict <backend>: keep`, `kill (precision)` or `stop (<reason>)` per column under spec REQ-006. Jev first, else Deem (parent goal D1).
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] The operator released this phase on 2026-09-29: the "Bind and release" answer amended parent goal D3, so this is a check, not a wait. Builds run in number order, and disjoint builds may run in parallel
- [ ] The keep rule, the construction rule, the comparator and the `-q` instruction in `spec.md` are unchanged since 2026-09-29
- [ ] Phase 008 (`ee3a1b057c`) and phase 009 (`ea883967d4`) are Complete, which they are, so this is a check, not a wait

### Definition of Done
- [ ] The test file exits 0 with at least 18 passed
- [ ] The labels file holds 40 labeled rows, 20 by the operator and 20 by construction, or the phase log records `stop: fewer than 40 labeled rows` as the state it waits in
- [ ] One verdict line per backend whose gate passed, or `no headroom` or `underpowered`, is in `goal.md`'s log for the parent goal's log
- [ ] `git status --porcelain` shows only the Files to Change paths, this phase folder and the report directory
- [ ] `validate_document.py` exits 0 on every skill doc the phase changed (parent goal D6)
- [ ] A cross-family review of the code leaves no open P0 or P1 finding (parent goal D5)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Single-file offline measurement script, the shape of `score-track-narrowing.mjs` in phase 017: exported pure functions for the tests and a `main()` that runs only as the entry point.

### Key Components
- **Extractor**: the citation pattern over prose, with fenced code blocks skipped, returning doc, line, sentence and target.
- **Resolver**: the synthesis's order (citing folder, repository root, skill root, unique basename) against `git ls-files` only, with `.env` basenames refused.
- **Census and dead check**: counts per skill and a `cite dead:` line per dead citation, with no model.
- **Drawer**: `--draw --seed <n>` writes 40 rows at the HEAD commit, 20 live and 20 constructed by the 60-line wrapping offset, with hashes and no text.
- **Comparators**: flag-nothing and identifier overlap over a 21-line window, scored on identical rows.
- **Deem arm**: the health gate, the payload notice, one `cli-deem noul` per row, exit handling and records with the commit pair.
- **Jev arm**: the identity line, the three checks, one `jev auth test --provider P`, the payload notice, three `jev noul --provider P` calls per row with no cache, the 90 s cap, exit handling and records with version, provider and model.
- **Verdict**: spec REQ-006's five conditions in order, integer counts, an exact p and one line per column on stdout and in `report.json`.

### Data Flow

Tracked docs become citations, citations become resolved, dead or refused. `--draw` turns resolved in-range citations into the labels file. The operator fills the live labels. Each run then reads each labeled row's window at its recorded commit, scores both comparators and prints the headroom line. With a switch and a passing gate, each row gets its backend's probability, reduced to a flag at 0.5, and each column's verdict compares that flag with the baseline on the rows it measured. A failed gate never starts the other backend.

### Affected Surfaces

| Surface | Current role | Action | Verification |
|---------|--------------|--------|--------------|
| `validate_document.py`, `validate.sh`, `check-ac-coverage.sh`, `validate_catalog_package.py` | Validators with frozen exit contracts | Unchanged, not called | `git diff --stat` on each is empty |
| Every cited file and doc | Read-only input | Read at a recorded commit, never edited | `git status --porcelain` unchanged by a run |
| `cli-deem`, `jev` | Transports | Spawned only behind a switch and a passing gate | Stub logs empty on the default run |
| sk-doc `SKILL.md`, `README.md`, changelog, catalog, playbook | Skill docs (parent goal D6) | One addition each through sk-doc | `validate_document.py` exits 0 on each |
| Credentials | `jev` resolves its own key | Never read or passed | The key grep of spec REQ-009 returns no match |
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.

**Who builds (parent goal D5).** A fresh Opus 5.5 xhigh build orchestrator writes one single-change brief per step below and runs them through Devin `deepseek-v4-1-flash-max` and Pi `llmgateway/mimo-v2.6-pro` at thinking `high`, by Bash only. The parent session verifies each step against its check, sends the code to a review by a model family other than the one that wrote it and commits with path-scoped commits. The build fixes P0 and P1 findings and records P2 findings. Code follows sk-code's OpenCode route, and the skill docs go through sk-doc (parent goal D6).

Each step's observable check:

1. **Baseline.** Record the sk-doc suite's pass and fail counts (`bash .skilled/skills/sk-doc/scripts/tests/run-script-tests.sh`) and `node .skilled/skills/sk-doc/scripts/tests/test-frontmatter-version.mjs` before any change. Check: both outputs saved with exit codes.
2. **Census and dead check.** Check: the default run prints per-skill counts and `dead=`, with the HEAD commit, and the stub logs stay empty.
3. **Draw.** Check: `--draw --seed 1` twice into two temp paths gives byte-identical files with 40 rows and no text field, and a third `--draw` over a file with an operator label exits 2.
4. **Comparators and label gate.** Check: the default run on the drawn file prints `stop: fewer than 40 labeled rows`, and on a test file with 40 labels prints both accuracies, the baseline method, `margin: 0.10`, the `keep rule:` line and a headroom line.
5. **Model arms.** Add the Deem arm, then the Jev arm. Check: the test cases for both gates, both skips, both exit paths and one `--provider` per `jev` call pass.
6. **Verdict.** Check: the test cases `keep`, `kill (precision)`, `stop (coverage)`, `stop (margin)` and `requalify` pass.
7. **Label gate.** The build commits the drawn file and stops. The operator labels the 20 live rows. Check: the default run no longer prints the stop line.
8. **Runs.** One zero-call run, then, unless it prints `no headroom` or `underpowered`, one `--jev --out <dir>` run when the Jev gate passes and one `--deem --out <dir>` run when the Deem gate passes. Check: one verdict line per column that ran, and every `calls.jsonl` line carries `wallMs` and `exitCode`, the commit pair on Deem lines and provider and model on Jev lines. The lines go in `goal.md`'s log.
9. **Skill docs.** After the runs, so no doc names a verdict that did not print. Check: `validate_document.py` exits 0 on each changed doc, and the Hermes copy of `SKILL.md` is regenerated.
10. **Review and commit.** Check: no open P0 or P1 finding, and the sk-doc suite fails nothing beyond step 1's baseline.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test type | Scope | Tools |
|-----------|-------|-------|
| Unit | Extractor (match, fenced skip), resolver (order, ambiguous basename), dead check (missing, past end), refusal (untracked, `.env`), comparator (flag, no token), drawer (reproducible, no overwrite), verdict (`keep`, `kill (precision)`, `stop (coverage)`, `stop (margin)`, `requalify`) | `node --test`, fixture docs in a temp git repository |
| Integration | Default run with stub binaries (no call, no file), label gate at 39 rows, Deem gate (fake health passes, stub backend skips byte-identically), Deem exit 4 with a changed pair, Jev gate (passing stub, `no credential` skip), Jev exit 3 after the gate, `--out` required, one `--provider` on every stub `jev` call | `node --test` with stub `jev` and `cli-deem` first on `PATH` |
| Manual | One zero-call run on the real tree, the operator's labels, then one live run per available backend | Terminal, operator-named `--out` directory |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if blocked |
|------------|------|--------|-------------------|
| The operator's release | Operator | Released 2026-09-29 (parent goal D3, amended by the operator's "Bind and release"). Builds run in number order, and disjoint builds may run in parallel | Nothing is built |
| The operator's 20 live labels | Operator | Waiting on the draw | Steps 8 and 9 wait. The phase holds at the label gate |
| Phase 008 `cli-deem` | Internal | Complete (`ee3a1b057c`) | The Deem arm cannot run |
| Local Deem server passing its check | External, operator-run | Served per `007-classifier-deep-research/context/deem-local.md` | The Deem run prints its skip line |
| `jev` 0.6.2 and a credential for provider P | External, operator-held | `jev --version` printed `jev 0.6.2` on 2026-09-29 (this leaf) | The Jev run prints its skip line |
| sk-doc modes for the docs | Internal | Available | Step 9 waits |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A test fails after merge, a run writes outside its report directory, or the operator drops R24 after a `kill` or `stop`.
- **Procedure**: Stop a running arm with Ctrl-C, which exits 130 and prints `interrupted`. Revert the phase's path-scoped commits: the script, its test, the labels file, the two README rows and the skill docs. Delete the operator-named report directory if it is inside the repository. Nothing else changed, so nothing else reverts.
<!-- /ANCHOR:rollback -->

---
