---
title: "Implementation Plan: Phase 35: fetched-text-injection-screen"
description: "One offline Node scorer in the cli-classifier hub's benchmark folder counts agent fetches and a fixed corpus of public vendored text, draws 90 rows for the operator to label or plant, and, behind --jev or --deem and each backend's own gate, asks one noul per labeled row under a keep rule fixed in the spec. Jev first, else Deem. No hook, and the seam stays open."
trigger_phrases:
  - "injection screen plan"
  - "score-injection-screen plan"
  - "injection screen label gate"
  - "injection screen build order"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 35: fetched-text-injection-screen

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node ESM (`.mjs`), standard library only, in `.skilled/skills/cli-classifier/benchmark/injection-screen/` (proposed placement) |
| **Framework** | None. The script runs `git ls-files` and `git show` for reads and spawns `jev` and `cli-deem` as binaries |
| **Storage** | None. Reads tracked state logs, agent files and vendored text, writes the labels file only in `--draw` mode and reports only to an operator-named directory |
| **Testing** | `node --test` on `injection-screen/tests/score-injection-screen.test.mjs`, the runner `cli-deem.test.mjs` uses |

### Overview

`score-injection-screen.mjs` (proposed) prints two censuses with zero calls: how often agents fetch, from tool names in tracked state logs, and the size of a fixed corpus of 185 public vendored markdown files under the parent's `context/` with the lexical screen's hits. `--draw` writes 90 rows with no text: 60 natural sections for the operator to label and 30 sections that will carry one instruction sentence the operator writes. Until all 90 rows carry a label, every run prints `stop: fewer than 90 labeled rows`. With labels, it prints the baseline and a headroom line, then, behind `--jev` or `--deem` and a passing gate, asks one `noul` per row and prints `verdict <backend>: keep`, `kill (precision)` or `stop (<reason>)` per column under spec REQ-006. Jev first, else Deem (parent goal D1). No hook is added, and the seam stays an open question.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] The operator released this phase on 2026-09-29: the "Bind and release" answer amended parent goal D3, so this is a check, not a wait. Builds run in number order, and disjoint builds may run in parallel
- [ ] The operator has confirmed or moved the proposed placement in the cli-classifier hub's `benchmark/` folder
- [ ] The keep rule, the draw rule, the lexical patterns and the `-q` instruction in `spec.md` are unchanged since 2026-09-29
- [ ] Phase 008 (`ee3a1b057c`) and phase 009 (`ea883967d4`) are Complete, which they are, so this is a check, not a wait

### Definition of Done
- [ ] The test file exits 0 with at least 18 passed
- [ ] The labels file holds 60 operator labels and `planted.jsonl` 30 operator sentences, or the phase log records `stop: fewer than 90 labeled rows` as the state it waits in
- [ ] One verdict line per backend whose gate passed, or `no headroom` or `underpowered`, is in `goal.md`'s log for the parent goal's log
- [ ] `git status --porcelain` shows only the Files to Change paths, this phase folder and the report directory, and `git diff --stat .claude/settings.json .skilled/hooks` is empty
- [ ] `validate_document.py` exits 0 on every hub doc the phase changed (parent goal D6)
- [ ] A cross-family review of the code leaves no open P0 or P1 finding (parent goal D5)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Single-file offline measurement script with exported pure functions for the tests and a `main()` that runs only as the entry point, the shape of phase 017's scorer.

### Key Components
- **Fetch census**: tracked `deep-research-state.jsonl` records whose `toolsUsed` names `WebFetch` or `WebSearch`, and `.claude/agents/*.md` whose `tools:` line grants either. Tool names only.
- **Corpus walker**: tracked `.md` under the parent's `context/`, the operator's notes file excluded, `.env` basenames refused, grouped by source.
- **Section splitter**: ATX headings outside fenced code, sections of 5 to 60 lines.
- **Lexical screen**: the four fixed patterns, printed with their SHA-256 before any label.
- **Drawer**: `--draw --seed <n>` writes 60 natural and 30 planted rows, 20 per source group at most, with a seeded insert line per planted row.
- **Baseline and label gate**: flag-nothing and the lexical screen, the stop line under 90 labels or a missing planted sentence, and the headroom lines.
- **Deem arm**: the health gate, the payload notice, one `cli-deem noul` per row, exit handling and records with the commit pair.
- **Jev arm**: the identity line, the three checks, one `jev auth test --provider P`, the payload notice, three `jev noul --provider P` calls per row with no cache, the 90 s cap, exit handling and records with version, provider and model.
- **Verdict**: spec REQ-006's five conditions in order, integer counts, an exact p and one line per column on stdout and in `report.json`.

### Data Flow

Tracked state logs and agent files become the fetch census. Vendored markdown becomes sections, and the lexical screen marks its hits. `--draw` samples natural and host sections into the labels file. The operator labels the natural rows and writes the planted sentences. Each run rebuilds each labeled section at its commit, with the planted sentence inserted at its line, and prints the baseline and headroom. With a switch and a passing gate, each row gets its backend's probability, reduced to a flag at 0.5, and each column's verdict compares that flag with the baseline on the rows it measured. A failed gate never starts the other backend.

### Affected Surfaces

| Surface | Current role | Action | Verification |
|---------|--------------|--------|--------------|
| `.claude/settings.json`, `.skilled/hooks/` | Hook wiring | Untouched. No matcher or hook is added | `git diff --stat` on both is empty |
| `deep-research-state.jsonl` files, `.claude/agents/` | Read-only census input | Tool names and `tools:` lines read, nothing else | No fetched text, URL or query printed |
| Vendored text under the parent's `context/` | Read-only corpus | Read at a recorded commit with `git show` | `git status --porcelain` unchanged by a run |
| `cli-deem`, `jev` | Transports | Spawned only behind a switch and a passing gate | Stub logs empty on the default run |
| The hub's `SKILL.md`, `README.md`, benchmark README, changelog, catalog and playbook | Skill docs (parent goal D6) | One addition each through sk-doc | `validate_document.py` exits 0 on each |
| Credentials | `jev` resolves its own key | Never read or passed | The key grep of spec REQ-009 returns no match |
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.

**Who builds (parent goal D5).** A fresh Opus 5.5 xhigh build orchestrator writes one single-change brief per step below and runs them through Devin `deepseek-v4-1-flash-max` and Pi `llmgateway/mimo-v2.6-pro` at thinking `high`, by Bash only. The parent session verifies each step against its check, sends the code to a review by a model family other than the one that wrote it and commits with path-scoped commits. The build fixes P0 and P1 findings and records P2 findings. Code follows sk-code's OpenCode route, and the hub docs go through sk-doc (parent goal D6).

Each step's observable check:

1. **Baseline.** Run `node --test .skilled/skills/cli-classifier/cli-deem/scripts/tests/cli-deem.test.mjs` and record the counts with the exit code before any change. On 2026-09-29 it printed tests 34, pass 34 and fail 0 and exited 0 (this leaf).
2. **Censuses.** Check: the default run prints the fetch census and the corpus census with 185 files grouped by source, sections in the band and lexical hits, with the HEAD commit, and the stub logs stay empty.
3. **Draw.** Check: `--draw --seed 1` twice into two temp paths gives byte-identical files with 90 rows and no text field, no source group passes 20 rows, each planted row names an insert line inside its section, and a third `--draw` over a file with a label exits 2.
4. **Baseline and label gate.** Check: the default run on the drawn file prints `stop: fewer than 90 labeled rows`, and on a test file with 90 labels and 30 sentences prints both accuracies, the `instructs` share, `margin: 0.10`, the `keep rule:` line and a headroom line.
5. **Model arms.** Add the Deem arm, then the Jev arm. Check: the test cases for both gates, both skips, both exit paths, the missing answer recorded `unmeasured` and one `--provider` per `jev` call pass.
6. **Verdict.** Check: the test cases `keep`, `kill (precision)`, `stop (coverage)`, `stop (margin)` and `requalify` pass.
7. **Label gate.** The build commits the drawn file and stops. The operator labels 60 rows and writes 30 sentences. Check: the default run no longer prints the stop line.
8. **Runs.** One zero-call run, then, unless it prints `no headroom` or `underpowered`, one `--jev --out <dir>` run when the Jev gate passes and one `--deem --out <dir>` run when the Deem gate passes. Check: one verdict line per column that ran, and every `calls.jsonl` line carries `wallMs` and `exitCode`, the commit pair on Deem lines and provider and model on Jev lines. The lines go in `goal.md`'s log.
9. **Hub docs.** After the runs. Check: `validate_document.py` exits 0 on each changed doc, and the Hermes copy of `SKILL.md` is regenerated.
10. **Review and commit.** Check: no open P0 or P1 finding, and `cli-deem.test.mjs` fails nothing beyond step 1's baseline.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test type | Scope | Tools |
|-----------|-------|-------|
| Unit | Fetch census (a fetch record, a record with no `toolsUsed`), section splitter (band, heading inside a fence), corpus walker (notes file excluded, refused `.env`), lexical screen (a hit, a section that quotes an example directive), drawer (reproducible, per-source cap, seeded insert, no overwrite), verdict (`keep`, `kill (precision)`, `stop (coverage)`, `stop (margin)`, `requalify`) | `node --test`, fixture corpora in a temp git repository with two commits |
| Integration | Default run with stub binaries (no call, no file), label gate at 89 rows and at a missing sentence, Deem gate (fake health passes, stub backend skips byte-identically), Deem exit 4 with a changed pair, Jev gate (passing stub, `no credential` skip), Jev exit 3 after the gate, a missing answer `unmeasured`, `--out` required, one `--provider` on every stub `jev` call | `node --test` with stub `jev` and `cli-deem` first on `PATH` |
| Manual | One zero-call run on the real tree, the operator's labels and sentences, then one live run per available backend | Terminal, operator-named `--out` directory |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if blocked |
|------------|------|--------|-------------------|
| The operator's release | Operator | Released 2026-09-29 (parent goal D3, amended by the operator's "Bind and release"). Builds run in number order, and disjoint builds may run in parallel | Nothing is built |
| The operator's placement call | Operator | Proposed: the hub's `benchmark/` folder | Step 2 waits |
| The operator's 60 labels and 30 sentences | Operator | Waiting on the draw | Steps 8 and 9 wait. The phase holds at the label gate |
| Phase 008 `cli-deem` | Internal | Complete (`ee3a1b057c`) | The Deem arm cannot run |
| Local Deem server passing its check | External, operator-run | Served per `007-classifier-deep-research/context/deem-local.md` | The Deem run prints its skip line |
| `jev` 0.6.2 and a credential for provider P | External, operator-held | `jev --version` printed `jev 0.6.2` on 2026-09-29 (this leaf) | The Jev run prints its skip line |
| sk-doc modes for the docs | Internal | Available | Step 9 waits |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A test fails after merge, a run writes outside its report directory, or the operator drops R16 after a `kill` or `stop`.
- **Procedure**: Stop a running arm with Ctrl-C, which exits 130 and prints `interrupted`. Revert the phase's path-scoped commits: the `injection-screen/` folder, the benchmark README row and the hub docs. Delete the operator-named report directory if it is inside the repository. No hook or settings file changed, so nothing else reverts.
<!-- /ANCHOR:rollback -->

---
