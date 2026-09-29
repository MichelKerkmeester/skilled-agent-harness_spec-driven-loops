---
title: "Goal: Phase 29: p0-reread-order"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "p0 reread order goal"
  - "score-severity-replay completion criteria"
  - "severity replay keep rule"
  - "research r10 test goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "cli-jev/003-cli-jev-workflow-integration/029-p0-reread-order"
    last_updated_at: "2026-09-29T13:30:00Z"
    last_updated_by: "spec-leaf"
    recent_action: "Authored the Planned phase documents for research R10"
    next_safe_action: "Build per plan.md in number order, released 2026-09-29 (parent D3)"
    blockers: []
    key_files:
      - "specs/cli-jev/003-cli-jev-workflow-integration/029-p0-reread-order/spec.md"
      - "specs/cli-jev/003-cli-jev-workflow-integration/029-p0-reread-order/plan.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-cli-jev-003-029-p0-reread-order"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Goal: Phase 29: p0-reread-order

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Settle, offline and on a counted number per backend, whether a Jev or Deem severity choice separates real P0 review findings from false ones better than the recorded severity, through one read-only script whose default run counts the P0 population with zero calls and whose model arms wait for 20 operator-labeled P0 negatives.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Changed paths: new `runtime/scripts/score-severity-replay.cjs` and `runtime/tests/unit/score-severity-replay.vitest.ts` in `system-deep-loop`, plus its `SKILL.md`, runtime READMEs, changelog, scoring catalog and playbook. No registry, review workflow or `mode-adapters.ts` changes |
| D2 | Rows are the P0 findings of tracked review registries. Gold is the operator's label per row: `real`, `P1`, `P2` or `not_a_finding`. Fewer than 20 non-`real` labels stops every arm. No model writes a label |
| D3 | The baseline is the recorded severity, right on every `real` row. Above 90 percent right it prints `no headroom` |
| D4 | Keep rule per backend column, in order: at least 90 percent of labeled rows measured, `kill` when the one-sided sign test favors the baseline at 0.05, a gain of at least 10 points, a one-sided sign test below 0.05 and a flip rate of at most 0.10 over three option orders |
| D5 | One `choice` per row over `P0`, `P1`, `P2` and `not_a_finding` in three left rotations. The state never holds the finding id. Jev receives only registries published at `origin/main` |
| D6 | The reread order and a one-`noul` validity funnel are reported per column and never decide. A keep serves nothing and never writes a severity |
<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `node .skilled/skills/system-deep-loop/runtime/scripts/score-severity-replay.cjs` without `--jev` or `--deem` exits 0 and prints `registries:`, `findings:`, `transitions:`, `p0 rows:`, `phrases:` and `labels needed:`, while stub `jev` and `cli-deem` binaries first on `PATH` log zero calls
- [ ] `--write-label-sheet` with a path inside the repository exits 2 and writes nothing. With `--jev --deem --out <dir>` and a labels file holding 19 negatives the script prints `stop: fewer than 20 labeled P0 negatives` and both stub logs stay empty. At 20 negatives a stub `cli-deem health` reporting backend `stub` gives `deem arm skipped: stub backend`, and a stub `jev` whose `auth status --provider official` exits 3 gives `jev arm skipped: no credential`
- [ ] From `.skilled/skills/system-deep-loop/runtime`, `npx vitest run tests/unit/score-severity-replay.vitest.ts` exits 0 with at least 22 passed tests and 0 failed
- [ ] The phase closed on `stop: fewer than 20 labeled P0 negatives` or `no headroom`, or one live `--deem --out <dir>` run printed `verdict deem: keep`, `verdict deem: kill` or `verdict deem: stop (<reason>)` with its commit pair and wrote a `calls.jsonl` in which no line holds a finding id
- [ ] `grep -nE 'API_KEY|TYPESAFE|Bearer|Authorization'` on the script returns no match, `git status --porcelain` is the same before and after each run and the build commit touches only `system-deep-loop` files, generated copies and this phase folder
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
| Planning documents | Done | `spec.md`, `plan.md`, `tasks.md`, this goal and the Planned `implementation-summary.md`, authored 2026-09-29 by a spec leaf from `../007-classifier-deep-research/research/research.md` section 12, `../001-deep-research/research/research.md` section 11 `### R10.` and `../004-deep-research-expansion/research/research.md` C27 and row 50 |
| Release | Done | 2026-09-29: the operator's "Bind and release" amended parent D3, which releases 019 to 035. Builds run in number order, and disjoint builds may run in parallel |
| Build | Pending | Not started |

### Deviations and findings

| Item | Note |
|------|------|
| Seam check (2026-09-29) | Every R10 citation resolves with no drift: `deep-review/references/protocol/completion-criteria.md:61-63` (severity coverage, `riskScore`, adversarial replay), `:75` (verdict logic) and `runtime/lib/blinded-adjudication/mode-adapters.ts:59` (`legacy-canonical-shadow-only`), `:63-72` (`createDeepReviewAdjudicationRequest`) |
| Census preview | Counted by this leaf with `node` over `git ls-files`: 412 registries, 2,852 findings, 95 at P0 in 36 registries (17 with two or more), 44 transitions into P0 at discovery and 0 out of P0. Over 3,270 tracked review iteration files, grok-04's five phrases hit 0, 1, 1, 1 and 1 files, none a rejected finding |
<!-- /ANCHOR:log -->
