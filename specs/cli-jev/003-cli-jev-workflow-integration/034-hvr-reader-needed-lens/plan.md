---
title: "Implementation Plan: Phase 34: hvr-reader-needed-lens"
description: "One read-only Python script beside hvr_scan.py counts flagged skill-doc sections through the unchanged scanner, draws 150 rows for the operator to label across three reader-needed categories and, behind --jev or --deem and each backend's own gate, asks one noul per labeled row under a keep rule fixed in the spec. Jev first, else Deem. Offline only."
trigger_phrases:
  - "hvr reader lens plan"
  - "reader lens sibling script plan"
  - "reader-needed lens label gate"
  - "reader-needed lens build order"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 34: hvr-reader-needed-lens

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Python 3, standard library only, beside `hvr_scan.py` in `.skilled/skills/sk-doc/sk-create-with-human-voice/scripts/` |
| **Framework** | None. The script runs `hvr_scan.py --json`, a `git ls-tree` read of HEAD's tree and `git show` as subprocesses and spawns `jev` and `cli-deem` as binaries |
| **Storage** | None. Reads committed skill docs, writes the labels file only in `--draw` mode and reports only to an operator-named directory |
| **Testing** | A plain-runner test file, `scripts/tests/test_hvr_reader_lens.py`, in `test_hvr_scan.py`'s style: one `check()` per case, `ALL PASS` at the end, exit 0 |

### Overview

`hvr_reader_lens.py` (proposed) runs the unchanged scanner over tracked skill docs, splits each file into heading sections and prints a census with zero calls: flagged sections and the sections each lexical rule catches. `--draw` writes 150 rows with no text, 50 per category, with the false-range and significance rows drawn up to half from their comparator's candidates. The operator labels every row `yes` or `no` for its category. Until 150 rows carry a label, every run prints `stop: fewer than 150 labeled rows`. With labels, it prints each category's baseline and headroom line, then, behind `--jev` or `--deem` and a passing gate, asks one `noul` per row and prints three category lines and `verdict <backend>: keep`, `kill (precision)` or `stop (<reason>)` per column under spec REQ-006. Jev first, else Deem (parent goal D1).
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] The operator released this phase on 2026-09-29: the "Bind and release" answer amended parent goal D3, so this is a check, not a wait. Builds run in number order, and disjoint builds may run in parallel. Evidence: the build ran under the release, `2588231589` sits on the released line and this phase is Complete at its label gate (`git log` at this closure pass)
- [x] The keep rule, the draw rule, the two comparators and the three `-q` instructions in `spec.md` are unchanged since 2026-09-29. Evidence: no fix touched the keep rule or the questions; `T` pins the verdict outcomes and the question digests, and its last run prints 42 `PASS` lines and `ALL PASS` (`SE` sections 1 and 2)
- [x] Phase 008 (`ee3a1b057c`) and phase 009 (`ea883967d4`) are Complete, which they are, so this is a check, not a wait. Evidence: design section 1 rechecked both statuses; the Deem client path c11f fixed is phase 008's `.skilled/skills/cli-classifier/cli-deem/scripts/cli-deem.mjs` (`SE` sections 1 and 3)

### Definition of Done
- [x] `test_hvr_reader_lens.py` prints `ALL PASS` with at least 18 checks, and `test_hvr_scan.py` still prints `ALL PASS`. Evidence: 42 `PASS` lines and `ALL PASS`; `test_hvr_scan.py` prints 11 and `ALL PASS` (`SE` section 2)
- [x] The labels file holds 150 operator labels, or the phase log records `stop: fewer than 150 labeled rows` as the state it waits in. Evidence: no labels file is committed (parent D4), and the phase log records the stop line as the state it waits in (`SE` section 2)
- [x] One verdict line per backend whose gate passed, or `stop: fewer than 2 categories can pass`, or the label gate stop line `stop: fewer than 150 labeled rows` (parent D4), is in `goal.md`'s log for the parent goal's log. Evidence: the phase closed on the label gate stop; no verdict line exists (`SE` section 2)
- [x] `git status --porcelain` shows only the Files to Change paths, this phase folder and the report directory, and `git diff --stat` on `hvr_scan.py` is empty. Evidence: the runs moved porcelain only by the parallel doc queues and the session's own commits; `hvr_scan.py` is byte-identical to HEAD (`SE` sections 1 and 2)
- [x] `validate_document.py` exits 0 on every skill doc the phase changed (parent goal D6). Evidence: exit 0 on all eight docs (`SE` section 2)
- [x] A cross-family review of the code leaves no open P0 or P1 finding (parent goal D5). Evidence: Pi MiMo on the code printed `VERDICT: FAIL` with 2 P1; c11f, c11g, c11h, c12f and c12g closed them (two rechecks `VERDICT: PASS`); DeepSeek on the docs printed `VERDICT: FAIL` with 1 P1, closed by c13f and c13g (recheck Pi MiMo `VERDICT: PASS`); five P2 recorded (`SE` section 3)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Single-file offline measurement script with plain functions the test imports and a `main()` that runs only under `if __name__ == "__main__"`, the shape of `hvr_scan.py`.

### Key Components
- **Frame walker**: tracked `*.md` under `.skilled/skills/`, outside `/changelog/`, `/fixtures/` and `node_modules`, `.env` basenames refused.
- **Scanner bridge**: `hvr_scan.py --json` in batches, reading each report's finding lines, with a `{"skipped": true}` line stopping the run.
- **Section splitter**: ATX headings outside fenced code, a section running to the line before the next heading.
- **Comparators**: the eight significance phrases parsed from the standard's section at run time, and the false-range pattern.
- **Drawer**: `--draw --seed <n>` writes 150 rows at their commits, 50 per category, candidate halves where a comparator exists, 5 per skill per category at most.
- **Baselines and label gate**: flag-nothing and the comparator per category, the stop line under 150 labels and the headroom and power lines.
- **Deem arm**: the health gate, the payload notice, one `cli-deem noul` per row with its category's instruction, exit handling and records with the commit pair.
- **Jev arm**: the identity line, the three checks, one `jev auth test --provider P`, the payload notice, three `jev noul --provider P` calls per row with no cache, the 90 s cap, exit handling and records with version, provider and model.
- **Verdict**: spec REQ-006's order, integer counts, an exact p, three category lines and one verdict line per column on stdout and in `report.json`.

### Data Flow

Tracked skill docs go through the unchanged scanner. Its finding lines mark flagged sections, and the comparators mark candidates. `--draw` samples rows per category into the labels file, and the operator labels it. Each run reads each labeled section at its commit and prints each category's baseline, headroom and power. With a switch and a passing gate, each row gets its backend's probability, reduced to a flag at 0.5, and each category compares that flag with its baseline on the rows it measured. A failed gate never starts the other backend.

### Affected Surfaces

| Surface | Current role | Action | Verification |
|---------|--------------|--------|--------------|
| `hvr_scan.py`, its test, its fixtures and `hvr-rules.md` | The scanner and its standard | Read only, never edited | `git diff --stat` empty on each, and `test_hvr_scan.py` prints `ALL PASS` |
| Skill docs under `.skilled/skills/` | Read-only input | Read at a recorded commit with `git show` | `git status --porcelain` unchanged by a run |
| `cli-deem`, `jev` | Transports | Spawned only behind a switch and a passing gate | Stub logs empty on the default run |
| The packet's `SKILL.md`, `README.md`, `scripts/README.md`, changelog and playbook, plus the sk-doc hub catalog | Skill docs (parent goal D6) | One addition each through sk-doc | `validate_document.py` exits 0 on each |
| Credentials | `jev` resolves its own key | Never read or passed | The key grep of spec REQ-009 returns no match |
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.

**Who builds (parent D5, amended on 2026-09-29).** Only Pi writes, with no Claude leaves: DeepSeek V4.1 Flash on Cline at `--thinking xhigh`, then OpenCode Go, then LLM Gateway at `--thinking max`, and `llmgateway/mimo-v2.6-pro` at `high`. The session writes one single-change brief per step, runs the CLI executors by Bash only, verifies each step against its check, sends a file to a review by a model family other than the one that wrote it, fixes P0 and P1 findings, records P2 findings and commits path-scoped. Code follows sk-code's route for Python, and the skill docs go through sk-doc (parent goal D6). The design step ran on Devin first and exited 1 when Devin's daily quota ran out, so it and every code step and fix ran on DeepSeek V4.1 Flash through Cline at `--thinking xhigh`; the eight docs ran on Pi MiMo at `high`, after the session built `scratch/w4-session/docs/facts.txt` from its own runs.

Each step's observable check:

1. **Baseline.** Run `python3 .skilled/skills/sk-doc/sk-create-with-human-voice/scripts/tests/test_hvr_scan.py` and record the pass count, the `ALL PASS` line and the exit code before any change. On 2026-09-29 it printed 11 PASS and `ALL PASS` and exited 0 (this leaf).
2. **Census.** Check: the default run prints files, sections, flagged sections, flagged sections of 5 to 80 lines and candidates per comparator, with the HEAD commit, and the stub logs stay empty. With `SKDOC_SKIP_VALIDATION=1` it prints `stop: scanner skipped`.
3. **Draw.** Check: `--draw --seed 1` twice into two temp paths gives byte-identical files with 150 rows and no text field, no skill passes 5 rows in one category, the report prints each category's candidate count, and a third `--draw` over a file with a label exits 2.
4. **Baselines and label gate.** Check: the default run on the drawn file prints `stop: fewer than 150 labeled rows`, and on a test file with 150 labels prints both accuracies per category, the `yes` share, `margin: 0.10`, the `keep rule:` line and the headroom and power lines.
5. **Model arms.** Add the Deem arm, then the Jev arm. Check: the test cases for both gates, both skips, both exit paths and one `--provider` per `jev` call pass.
6. **Verdict.** Check: the test cases `keep`, `kill (precision)`, `stop (coverage)`, `stop (categories)` and `requalify` pass.
7. **Label gate.** The draw runs with a recorded seed and commit as a scratchpad proof, and no labels file is committed (parent D4, which outranks the phase's ruling 4). The operator labels 150 rows. Check: the default run no longer prints the stop line.
8. **Runs.** One zero-call run, then, unless it prints `stop: fewer than 2 categories can pass`, one `--jev --out <dir>` run when the Jev gate passes and one `--deem --out <dir>` run when the Deem gate passes. Check: one verdict line and three category lines per column that ran, and every `calls.jsonl` line carries `wallMs` and `exitCode`, the commit pair on Deem lines and provider and model on Jev lines. The lines go in `goal.md`'s log.
9. **Skill docs.** After the runs. Check: `validate_document.py` exits 0 on each changed doc, and the Hermes copy of `SKILL.md` is regenerated.
10. **Review and commit.** Check: no open P0 or P1 finding, and `test_hvr_scan.py` still prints step 1's 11 PASS and `ALL PASS`.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test type | Scope | Tools |
|-----------|-------|-------|
| Unit | Section splitter (heading split, heading inside a fence), comparators (a listed phrase, a false range, a genuine range still flagged), frame walker (refused `.env`, untracked file), drawer (reproducible, per-skill cap, no overwrite), verdict (`keep`, `kill (precision)`, `stop (coverage)`, `stop (categories)`, `requalify`) | `python3` plain runner, fixture docs in a temp git repository with two commits |
| Integration | Default run with stub binaries (no call, no file), the scanner-skipped stop, label gate at 149 rows, Deem gate (fake health passes, stub backend skips byte-identically), Deem exit 4 with a changed pair, Jev gate (passing stub, `no credential` skip), Jev exit 3 after the gate, `--out` required, one `--provider` on every stub `jev` call | `python3` plain runner with stub `jev` and `cli-deem` first on `PATH` |
| Manual | One zero-call run on the real tree, the operator's labels, then one live run per available backend | Terminal, operator-named `--out` directory |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if blocked |
|------------|------|--------|-------------------|
| The operator's release | Operator | Released 2026-09-29 (parent goal D3, amended by the operator's "Bind and release"). Builds run in number order, and disjoint builds may run in parallel | Nothing is built |
| The operator's 150 labels | Operator | Not written | Every arm stops at the gate. The phase closed there: the 2026-09-29 draw proof wrote 150 rows with seed 20260929 into the session scratchpad and no labels file is committed (parent D4) |
| Phase 008 `cli-deem` | Internal | Complete (`ee3a1b057c`) | The Deem arm cannot run |
| Local Deem server passing its check | External, operator-run | Served per `007-classifier-deep-research/context/deem-local.md`; no live run started | The Deem run prints its skip line |
| `jev` 0.6.2 and a credential for provider P | External, operator-held | `jev --version` printed `jev 0.6.2` on 2026-09-29 (this leaf); no live run started | The Jev run prints its skip line |
| `node` on `PATH` when `cli-deem` is not | External | Present on the operator's machine (assumed, UNKNOWN on another) | The Deem gate prints `deem arm skipped: not reachable` |
| sk-doc modes for the docs | Internal | Ran: the eight docs landed in `2588231589` and `validate_document.py` exits 0 on each | None |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A test fails after merge, `test_hvr_scan.py` stops printing `ALL PASS`, a run writes outside its report directory, or the operator drops R22 after a `kill` or `stop`.
- **Procedure**: Stop a running arm with Ctrl-C, which exits 130 and prints `interrupted`. Revert the phase's path-scoped commits: the script, its test, the labels file, the README rows and the skill docs. Delete the operator-named report directory if it is inside the repository. The scanner never changed, so nothing else reverts.
<!-- /ANCHOR:rollback -->

---
