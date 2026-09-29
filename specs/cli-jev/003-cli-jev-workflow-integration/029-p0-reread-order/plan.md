---
title: "Implementation Plan: Phase 29: p0-reread-order"
description: "Build one read-only replay script in the system-deep-loop runtime that counts archived P0 findings and their downgrades, writes a label sheet, stops at the operator's 20-negative label gate, then runs a Jev and a Deem severity choice behind their own switches and prints one verdict per column."
trigger_phrases:
  - "severity replay plan"
  - "score-severity-replay build"
  - "p0 label gate plan"
  - "validity funnel plan"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 29: p0-reread-order

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node CommonJS (`.cjs`), standard library only |
| **Framework** | None. The script spawns `jev`, `cli-deem` and `git cat-file` as binaries |
| **Storage** | None. Reads tracked registries and iteration files, writes only to operator-named paths |
| **Testing** | Vitest, the `system-deep-loop/runtime` config (`tests/**/*.{vitest,test}.ts`) |

### Overview

`score-severity-replay.cjs` (proposed) counts every tracked review registry's findings, severities and transitions and grok-04's rejected-P0 phrases, with zero calls. It writes a label sheet of the P0 rows outside the repository and reads the operator's filled file. With fewer than 20 negatives it prints its stop line. Past the gate, behind `--jev` or `--deem` and a passing gate, it asks one severity `choice` per row in three option orders and prints one verdict per backend column under spec section 4's Keep Rule, with the reread order and a validity funnel reported beside it. Jev first, then Deem (parent D1).
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] The operator released this phase on 2026-09-29: the "Bind and release" answer amended parent D3, so this is a check, not a wait. Builds run in number order, and disjoint builds may run in parallel
- [ ] The Keep Rule, the four options and the `-q` wordings are unchanged since this spec was written
- [ ] Phase 008's `cli-deem` answers `health`, for the Deem arm only
- [ ] `jev --version` prints `jev 0.6.2` and `jev auth status --provider P` exits 0, for a `--jev` run only

### Definition of Done
- [ ] The vitest file exits 0 with at least 22 passed tests and 0 failed
- [ ] The census printed on the real tree, and either the gate stop line, `no headroom` or one verdict per model column that ran
- [ ] `git status --porcelain` is the same before and after every run, and no registry changed
- [ ] `validate_document.py` exits 0 on every skill doc the phase changed (parent D6)
- [ ] A cross-family review leaves no open P0 or P1 finding, and the runtime vitest suite fails nothing beyond its baseline (parent D5)
- [ ] The census numbers and every stop or verdict line are in `goal.md`'s log for the parent's log
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Single-file offline measurement script with exported pure functions for the tests and a `main()` behind `require.main === module`.

### Key Components
- **Census**: registry walker, severity and transition counts, P0 rows per registry and the phrase counter over tracked review iteration files.
- **Label sheet and reader**: writes P0 rows outside the repository, reads the filled file, validates each label and applies the 20-negative gate.
- **Baseline and headroom**: the recorded severity scored on the labeled rows.
- **Jev arm and Deem arm**: phase 002's gates, the notice, the published-only check, three option orders per row, exit handling and one `calls.jsonl` writer. The state builder drops the finding id.
- **Verdict and report-only lines**: the Keep Rule in its fixed order, the reread order, the validity funnel and the exact-class line.

### Data Flow

Registries become a census and a P0 row list. The operator's labels turn the list into K rows. The gate either stops or passes. Past it, each backend answers each row three times, the modal pick scores against the label and the baseline, and the verdict applies the rule. Nothing is written back to any registry.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.

**Who builds (parent D5).** A fresh Opus 5.5 xhigh build orchestrator writes one single-change brief per step and runs the CLI executors by Bash only: Devin `deepseek-v4-1-flash-max` and Pi `llmgateway/mimo-v2.6-pro` at thinking `high`. The orchestrator session verifies each step, gets a cross-family review of the code, fixes P0 and P1 findings, records P2 findings and commits path-scoped. Code follows sk-code's OpenCode route, and the docs go through sk-doc (parent D6).

Each step's observable check:

1. **Baseline.** Record the runtime vitest pass count at HEAD. Check: the number is in `goal.md`'s log.
2. **Census.** Check: the real-tree census prints its lines, and its P0 and transition counts match a second count by an independent `node` pass.
3. **Label sheet and gate.** Check: the sheet writes outside the repository and refuses inside, and the gate stops at 19 negatives and passes at 20 on fixtures.
4. **Model arms.** Jev first, then Deem. Check: the stub cases pass, one `--provider` appears on every logged `jev` call and no logged call carries a finding id.
5. **Verdict and report-only lines.** Check: the `keep`, `kill` and `stop (coverage)` cases pass, and the order and funnel lines print without moving the verdict.
6. **Runs.** One census run on the real tree and one label sheet for the operator. Model runs only after the operator's labels pass the gate. Check: the stop or verdict lines go in `goal.md`'s log.
7. **Skill docs.** Check: `validate_document.py` exits 0 on each changed doc.
8. **Review and commit.** Check: no open P0 or P1, and the runtime suite fails nothing beyond step 1's baseline.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Census counts, phrase counter, label reader, the gate at 19 and 20, headroom, the state builder without ids, each Keep Rule step | Vitest with fixture registries and iteration files in a temp directory |
| Integration | Default run with stub binaries, label sheet inside and outside the repository, Jev gate pass and `no credential` skip, Deem fake health and stub-backend skip byte-identical, Deem exit 4 with a new pair, an unpublished row withheld from Jev, `--jev` without `--out` exit 2 | Vitest with stub `jev` and `cli-deem` first on `PATH` |
| Manual | One census run and the label sheet on the real tree, then gated model runs | Terminal, operator-named paths |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| The operator's release | Operator | Given 2026-09-29: "Bind and release" amended parent D3. Builds run in number order, and disjoint builds may run in parallel | Nothing is built |
| The operator's labels, 20 negatives | Operator | Not written | Every model arm stops at the gate. The phase can close there |
| Phase 008 `cli-deem` | Internal | Complete | The Deem arm cannot run |
| Local Deem server | External, operator-run | Served per `deem-local.md` | The Deem arm prints its skip line |
| `jev` 0.6.2 and a credential for P | External, operator-held | Used once by 017 on 2026-09-29 | The Jev arm prints its skip line |
| Phases 027, 028 and 030 | Internal | Planned | Shared doc files, so doc steps run one after another |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A test fails after merge, a run writes outside its operator-named paths, or the operator drops R10.
- **Procedure**: Revert the phase's path-scoped commits: the script, its test, the README rows and the skill docs, then regenerate any generated copy they touched. The label file and reports sit outside the repository or in operator-named paths, so nothing else reverts.
<!-- /ANCHOR:rollback -->

---
