---
title: "Implementation Plan: Phase 31: debug-next-check"
description: "Build one read-only measurement script in the system-spec-kit runtime that prints the missing seam, reads an operator-labeled fixture of debug hypotheses, scores the four constant answers, holds Jev behind a payload gate and a 30-row label gate, then runs a Jev and a Deem next-check choice behind their own switches and prints one verdict per column."
trigger_phrases:
  - "debug next check plan"
  - "score-debug-next-check build"
  - "next check label gate plan"
  - "constant answer baseline"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 31: debug-next-check

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node ESM (`.mjs`), standard library only, like `runtime/scripts/compaction-recall/score-compaction-recall.mjs` |
| **Framework** | None. The script spawns `jev`, `cli-deem` and `git` as binaries |
| **Storage** | None. Reads an operator-named fixture outside the repository and writes only to an operator-named directory |
| **Testing** | Vitest, run from `.skilled/skills/system-spec-kit/runtime` with its own config, as phase 005 ran its test |

### Overview

`score-debug-next-check.mjs` (proposed) first prints the seam search: no caller, no mined corpus. Given an operator-named fixture it validates each row, scores the four constant answers and picks the best as the baseline. Below 30 labeled rows it prints its stop line. Past the gate, behind `--jev` or `--deem` and a passing gate, it asks one `choice` per row in three option orders and prints one verdict per backend column under spec section 4's Keep Rule. Jev reads only rows the operator accepted. Jev first, then Deem (parent D1).
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] The operator released this phase on 2026-09-29: the "Bind and release" answer amended parent D3, so this is a check, not a wait. Builds run in number order, and disjoint builds may run in parallel
- [ ] The operator has confirmed the owner, `system-spec-kit`, or named another
- [ ] The Keep Rule, the four options and the `-q` wording are unchanged since this spec was written
- [ ] Phase 008's `cli-deem` answers `health` for the Deem arm, and `jev --version` prints `jev 0.6.2` with `jev auth status --provider P` exiting 0 for a `--jev` run

### Definition of Done
- [ ] The vitest file exits 0 with at least 22 passed tests and 0 failed
- [ ] The census printed `seam: none` on the real tree, and either the gate stop line, `no headroom` or one verdict per model column that ran
- [ ] `git status --porcelain` is the same before and after every run, and no agent or debugging reference changed
- [ ] `validate_document.py` exits 0 on every skill doc the phase changed (parent D6)
- [ ] A cross-family review leaves no open P0 or P1 finding, and the `system-spec-kit` runtime suite fails nothing beyond its baseline (parent D5)
- [ ] Every stop or verdict line is in `goal.md`'s log for the parent's log
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Single-file offline measurement script with exported pure functions for the tests and a `main()` guarded for direct runs, the shape of `score-compaction-recall.mjs`.

### Key Components
- **Seam search**: `git grep` outside `specs/` for `next_check` and counts of tracked handoff files and hypothesis headings.
- **Fixture reader**: refuses a path inside the repository, validates each row and label and applies the 30-row gate.
- **Constant baselines**: accuracy of each of the four answers and the best one, ties to `read_code`.
- **Payload gate**: splits rows by `jev_ok` for the Jev column.
- **Jev arm and Deem arm**: phase 002's gates, the notice, three option orders per row, exit handling and one `calls.jsonl` writer that stores ids, never row text.
- **Verdict**: the Keep Rule in its fixed order.

### Data Flow

The seam search prints first. The fixture becomes K labeled rows, the baselines score them and the gate stops or passes. Past it, each backend answers each row three times, the modal pick scores against the label and the best constant, and the verdict applies the rule. Nothing flows into any debug session.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.

**Who builds (parent D5).** A fresh Opus 5.5 xhigh build orchestrator writes one single-change brief per step and runs the CLI executors by Bash only: Devin `deepseek-v4-1-flash-max` and Pi `llmgateway/mimo-v2.6-pro` at thinking `high`. The orchestrator session verifies each step, gets a cross-family review of the code, fixes P0 and P1 findings, records P2 findings and commits path-scoped. Code follows sk-code's OpenCode route, and the docs go through sk-doc (parent D6).

Each step's observable check:

1. **Baseline.** Record the `system-spec-kit` runtime vitest pass count at HEAD. Check: the number is in `goal.md`'s log.
2. **Seam search.** Check: the real tree prints `seam: none` and `mined rows: 0`, and a planted fixture file flips the first line.
3. **Fixture reader and baselines.** Check: the gate stops at 29 rows and passes at 30, a path inside the repository exits 2 and the constant lines match hand-counted values.
4. **Model arms.** Jev first, then Deem. Check: the stub cases pass, the payload gate withholds rows without `jev_ok` and `calls.jsonl` holds no row text.
5. **Verdict.** Check: the `keep`, `kill` and `stop (coverage)` cases pass.
6. **Runs.** One census run on the real tree. Model runs only after the operator's fixture passes the gate. Check: the stop or verdict lines go in `goal.md`'s log.
7. **Skill docs.** Check: `validate_document.py` exits 0 on each changed doc.
8. **Review and commit.** Check: no open P0 or P1, and the runtime suite fails nothing beyond step 1's baseline.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Seam search on a clean and a planted tree, fixture reader and label validation, the gate at 29 and 30, constant baselines and the tie rule, headroom, the payload split, each Keep Rule step | Vitest with synthetic fixtures in a temp directory |
| Integration | Default run with stub binaries, a fixture path inside the repository, Jev gate pass and `no credential` skip, `payload not accepted`, Deem fake health and stub-backend skip byte-identical, Deem exit 4 with a new pair, `--jev` without `--out` exit 2 | Vitest with stub `jev` and `cli-deem` first on `PATH` |
| Manual | One census run on the real tree, then gated model runs on the operator's fixture | Terminal, operator-named paths |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| The operator's release | Operator | Given 2026-09-29: "Bind and release" amended parent D3. Builds run in number order, and disjoint builds may run in parallel | Nothing is built |
| The operator's labeled fixture, 30 rows | Operator | Not written | Every model arm stops at the gate. The phase can close there |
| Phase 008 `cli-deem` and a served Deem | Internal and external | Complete, served per `deem-local.md` | The Deem arm prints its skip line |
| `jev` 0.6.2 and a credential for P | External, operator-held | Used once by 017 on 2026-09-29 | The Jev arm prints its skip line |
| Other `system-spec-kit` doc edits | Internal | Unknown at build time | Shared `SKILL.md`, README and index files, so a parallel build on the same skill runs its doc step apart from this one |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A test fails after merge, a run writes outside its operator-named paths, or the operator drops R18.
- **Procedure**: Revert the phase's path-scoped commits: the script, its test, the README rows and the skill docs, then regenerate any generated copy they touched. The fixture sits outside the repository, and no debug workflow changed, so nothing else reverts.
<!-- /ANCHOR:rollback -->

---
