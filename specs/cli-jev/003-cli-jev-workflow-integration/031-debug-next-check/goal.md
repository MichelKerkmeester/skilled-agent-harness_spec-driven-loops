---
title: "Goal: Phase 31: debug-next-check"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "debug next check goal"
  - "score-debug-next-check completion criteria"
  - "next check keep rule"
  - "research r18 test goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "cli-jev/003-cli-jev-workflow-integration/031-debug-next-check"
    last_updated_at: "2026-09-29T13:30:00Z"
    last_updated_by: "spec-leaf"
    recent_action: "Authored the Planned phase documents for research R18"
    next_safe_action: "Build per plan.md in number order, released 2026-09-29 (parent D3)"
    blockers: []
    key_files:
      - "specs/cli-jev/003-cli-jev-workflow-integration/031-debug-next-check/spec.md"
      - "specs/cli-jev/003-cli-jev-workflow-integration/031-debug-next-check/plan.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-cli-jev-003-031-debug-next-check"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Goal: Phase 31: debug-next-check

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Settle, offline and on a counted number per backend, whether a Jev or Deem choice of the cheapest next check for a debug hypothesis beats the best constant answer on an operator-labeled fixture, through one read-only script that first shows no caller seam exists and holds Jev to rows the operator accepted.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Changed paths: new `runtime/scripts/debug-next-check/score-debug-next-check.mjs` and `runtime/tests/debug-next-check.vitest.ts` in `system-spec-kit`, plus its `SKILL.md`, README, `runtime/scripts/README.md`, changelog, tooling-and-scripts catalog and playbook. No agent, debugging reference or workflow changes |
| D2 | Rows come only from the operator's fixture outside the repository: symptom, claim, evidence, a label among `read_code`, `run_test`, `reproduce` and `instrument`, and `jev_ok`. Fewer than 30 labeled rows stops every arm. No model writes a row or a label |
| D3 | The baseline is the best of the four constant answers on the labeled rows, ties to `read_code`. Above 90 percent right it prints `no headroom` |
| D4 | Keep rule per backend column, in order: at least 90 percent of its rows measured, `kill` when the one-sided sign test favors the baseline at 0.05, a gain of at least 10 points, a one-sided sign test below 0.05 and a flip rate of at most 0.10 over three option orders |
| D5 | One `choice` per row over the four keys with their vendored descriptions, in three left rotations. Jev reads only rows marked `jev_ok`, Deem reads every row and `calls.jsonl` holds no row text |
| D6 | The caller seam and the reader stay open questions. A keep serves nothing and changes no debug step |
<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `node .skilled/skills/system-spec-kit/runtime/scripts/debug-next-check/score-debug-next-check.mjs` without `--jev` or `--deem` exits 0 and prints `seam: none` and `mined rows: 0`, while stub `jev` and `cli-deem` binaries first on `PATH` log zero calls
- [ ] A `--fixture` path inside the repository exits 2. With `--jev --deem --out <dir>` and a fixture of 29 labeled rows the script prints `stop: fewer than 30 labeled rows` and both stub logs stay empty. At 30 rows with none marked `jev_ok` it prints `jev arm skipped: payload not accepted`, and a stub `cli-deem health` reporting backend `stub` gives `deem arm skipped: stub backend`
- [ ] From `.skilled/skills/system-spec-kit/runtime`, `npx vitest run tests/debug-next-check.vitest.ts` exits 0 with at least 22 passed tests and 0 failed
- [ ] The phase closed on `stop: fewer than 30 labeled rows` or `no headroom`, or one live `--deem --out <dir>` run printed `verdict deem: keep`, `verdict deem: kill` or `verdict deem: stop (<reason>)` with its commit pair and wrote a `calls.jsonl` holding no row text
- [ ] `grep -nE 'API_KEY|TYPESAFE|Bearer|Authorization'` on the script returns no match, `git status --porcelain` is the same before and after each run, `git diff --stat .skilled/agents/` is empty and the build commit touches only `system-spec-kit` files, generated copies and this phase folder
- [ ] `validate_document.py` exits 0 on every changed skill doc, and `validate.sh --strict` on this phase prints `RESULT: PASSED`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 4. LOG

Everything below is VOLATILE. It is not part of the directive, it is not copied
into the objective, and it is expected to grow. Progress, evidence, deviations
and findings belong here.

### Progress

| Item | State | Evidence |
|------|-------|----------|
| Planning documents | Done | `spec.md`, `plan.md`, `tasks.md`, this goal and the Planned `implementation-summary.md`, authored 2026-09-29 by a spec leaf from `../007-classifier-deep-research/research/research.md` section 12 and `../001-deep-research/research/research.md` section 11 `### R18.` |
| Release | Done | 2026-09-29: the operator's "Bind and release" amended parent D3, which releases 019 to 035. Builds run in number order, and disjoint builds may run in parallel |
| Build | Pending | Not started |

### Deviations and findings

| Item | Note |
|------|------|
| Seam check (2026-09-29) | The record opened no repository seam, and none exists. `git grep -l next_check -- ':!specs'` prints nothing. The vendored citation `hypotheses.ts:41-45` resolves at `../context/external repo's/claude-jev-main/src/domain/catalog/hypotheses.ts:41-45`, with the four options at `:10-15`. The nearest prompt step is `.skilled/agents/debug.md:246-276`, which has no code line to call from |
| No mined corpus | One tracked `debug-delegation.md` exists outside the template, and no tracked spec file holds a `### Hypothesis <n>` heading. The fixture is the operator's |
| Owner placement | The script sits in `system-spec-kit` because it owns `references/debugging/universal-debugging-methodology.md`. The operator may name another owner before the build |
<!-- /ANCHOR:log -->
