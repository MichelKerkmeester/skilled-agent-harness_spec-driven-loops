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

`cite-drift-scan.mjs` (built at 1,707 lines) extracts `file:line` citations from tracked skill docs, resolves them in the synthesis's order and prints a census and a dead count with zero calls. `--draw` writes 40 rows with no text: 20 live citations the operator labels and 20 constructed drifts labeled by construction. Until 40 rows carry a label, every run prints `stop: fewer than 40 labeled rows`. With labels, it scores flag-nothing and an identifier-overlap check on identical rows, prints the baseline and a headroom line, and then, behind `--jev` or `--deem` and a passing gate, asks one `noul` per row and prints `verdict <backend>: keep`, `kill (precision)` or `stop (<reason>)` per column under spec REQ-006. Jev first, else Deem (parent goal D1).
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] The operator released this phase on 2026-09-29: the "Bind and release" answer amended parent goal D3, so this is a check, not a wait. Builds run in number order, and disjoint builds may run in parallel. Evidence: the build ran under the release, `c5d3ced36f` sits on the released line and this phase is Complete at its label gate (`git log` at this closure pass)
- [x] The keep rule, the construction rule, the comparator and the `-q` instruction in `spec.md` are unchanged since 2026-09-29. Evidence: no fix touched the keep rule, and `T` pins its fixed order and every outcome, its last run printing `tests 32`, `pass 32`, `fail 0` (`SE` sections 1 and 2)
- [x] Phase 008 (`ee3a1b057c`) and phase 009 (`ea883967d4`) are Complete, which they are, so this is a check, not a wait. Evidence: design section 1 rechecked both statuses; no owner amendment was made, and the script landed under `.skilled/skills/sk-doc/shared/scripts/` (`SE` section 1)

### Definition of Done
- [x] The test file exits 0 with at least 18 passed. Evidence: `tests 32`, `pass 32`, `fail 0`, exit 0, against the floor of 18 (`SE` section 2)
- [x] The labels file holds 40 labeled rows, 20 by the operator and 20 by construction, or the phase log records `stop: fewer than 40 labeled rows` as the state it waits in. Evidence: the draw wrote 40 rows with seed 20260929 at commit 709b1078ee5d into the session scratchpad and no labels file is committed, so the phase log records the stop line as the state it waits in (parent D4; `SE` section 2)
- [x] One verdict line per backend whose gate passed, or `no headroom` or `underpowered`, or the label gate stop line, is in `goal.md`'s log for the parent goal's log. Evidence: the phase closed on `stop: fewer than 40 labeled rows`; no verdict line exists (parent D4; `SE` section 2)
- [x] `git status --porcelain` shows only the Files to Change paths, this phase folder and the report directory. Evidence: the runs moved porcelain only by the parallel 031 and 033 doc queues, and the build commit touches only the Files to Change paths, its generated copies and this phase folder (`SE` sections 2 and 5)
- [x] `validate_document.py` exits 0 on every skill doc the phase changed (parent goal D6). Evidence: exit 0 on every changed doc but the playbook index, whose three `missing_required_section` errors are identical at HEAD (pre-existing, out of scope; `SE` section 1)
- [x] A cross-family review of the code leaves no open P0 or P1 finding (parent goal D5). Evidence: Pi MiMo on the code printed `VERDICT: FAIL` with 1 P0 and 1 P1; the P0 closed by c8f and c8g (recheck `VERDICT: PASS`) and the P1 was ruled against; the docs review's P1 and four P2 closed by f1 (recheck `VERDICT: PASS`); six P2 recorded (`SE` section 3)
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

**Who builds (parent D5, amended on 2026-09-29).** Only Pi writes, with no Claude leaves: DeepSeek V4.1 Flash on Cline at `--thinking xhigh`, then OpenCode Go, then LLM Gateway at `--thinking max`, and `llmgateway/mimo-v2.6-pro` at `high`. The session writes one single-change brief per step, runs the CLI executors by Bash only, verifies each step against its check, gets a cross-family review (a file goes to the family that did not write it), fixes P0 and P1 findings, records P2 findings and commits path-scoped. Code follows sk-code's OpenCode route, and the docs go through sk-doc (parent D6). The code steps and both fixes ran on DeepSeek V4.1 Flash through Cline, each checked by the test file; the eight docs ran on Pi MiMo at `high`, after the session built `scratch/w4-session/docs/facts.txt` from its own runs.

Each step's observable check:

1. **Baseline.** Record the sk-doc suite's pass and fail counts (`bash .skilled/skills/sk-doc/scripts/tests/run-script-tests.sh`) and `node .skilled/skills/sk-doc/scripts/tests/test-frontmatter-version.mjs` before any change. Check: both outputs saved with exit codes.
2. **Census and dead check.** Check: the default run prints per-skill counts and `dead=`, with the HEAD commit, and the stub logs stay empty.
3. **Draw.** Check: `--draw --seed 1` twice into two temp paths gives byte-identical files with 40 rows and no text field, and a third `--draw` over a file with an operator label exits 2.
4. **Comparators and label gate.** Check: the default run on the drawn file prints `stop: fewer than 40 labeled rows`, and on a test file with 40 labels prints both accuracies, the baseline method, `margin: 0.10`, the `keep rule:` line and a headroom line.
5. **Model arms.** Add the Deem arm, then the Jev arm. Check: the test cases for both gates, both skips, both exit paths and one `--provider` per `jev` call pass.
6. **Verdict.** Check: the test cases `keep`, `kill (precision)`, `stop (coverage)`, `stop (margin)` and `requalify` pass.
7. **Label gate.** The draw runs with a recorded seed and commit, and no labels file is committed (parent D4). The operator labels the 20 live rows. Check: the default run no longer prints the stop line.
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
| The operator's 20 live labels | Operator | Not written | Every arm stops at the gate. The phase closed there: the 2026-09-29 draw wrote 40 rows with seed 20260929 at `709b1078ee5d` into the session scratchpad and no labels file is committed |
| Phase 008 `cli-deem` | Internal | Complete (`ee3a1b057c`) | The Deem arm cannot run |
| Local Deem server passing its check | External, operator-run | Served per `007-classifier-deep-research/context/deem-local.md` | The Deem run prints its skip line |
| `jev` 0.6.2 and a credential for provider P | External, operator-held | `jev --version` printed `jev 0.6.2` on 2026-09-29 (this leaf) | The Jev run prints its skip line |
| sk-doc modes for the docs | Internal | Ran: the eight docs landed in `c5d3ced36f` and the hub version fields moved to 2.2.3.0 | None |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A test fails after merge, a run writes outside its report directory, or the operator drops R24 after a `kill` or `stop`.
- **Procedure**: Stop a running arm with Ctrl-C, which exits 130 and prints `interrupted`. Revert the phase's path-scoped commits: the script, its test, the labels file, the two README rows and the skill docs. Delete the operator-named report directory if it is inside the repository. Nothing else changed, so nothing else reverts.
<!-- /ANCHOR:rollback -->

---
