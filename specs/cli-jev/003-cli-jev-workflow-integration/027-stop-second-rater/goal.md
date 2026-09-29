---
title: "Goal: Phase 27: stop-second-rater"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "stop second-rater goal"
  - "score-stop-rater completion criteria"
  - "stop gold keep rule"
  - "research r8 test goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "cli-jev/003-cli-jev-workflow-integration/027-stop-second-rater"
    last_updated_at: "2026-09-29T13:30:00Z"
    last_updated_by: "spec-leaf"
    recent_action: "Authored the Planned phase documents for research R8"
    next_safe_action: "Build per plan.md in number order, released 2026-09-29 (parent D3)"
    blockers: []
    key_files:
      - "specs/cli-jev/003-cli-jev-workflow-integration/027-stop-second-rater/spec.md"
      - "specs/cli-jev/003-cli-jev-workflow-integration/027-stop-second-rater/plan.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-cli-jev-003-027-stop-second-rater"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Goal: Phase 27: stop-second-rater

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Settle, offline and on a counted number per backend, whether a Jev or Deem novelty score per iteration moves a replayed deep-research stop onto the stop each archived lineage should have made, through one read-only script whose default run makes zero model calls and prints the zero-call stop methods first.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Changed paths: new `runtime/scripts/score-stop-rater.cjs` and `runtime/tests/unit/score-stop-rater.vitest.ts` in `system-deep-loop`, plus its `SKILL.md`, runtime READMEs, changelog, scoring catalog and playbook. No convergence code, reducer, workflow YAML or state file changes |
| D2 | Lineages: tracked research state whose config lets a stop move and whose `deltas/` exists. Gold: the last iteration with a first-appearance cited source. Sample: at most 25, inert windows first, then SHA-256 of the path |
| D3 | A stop s is right when gold <= s <= gold + 1. The baseline is the best of `recorded`, `legacy` (the workflow's three-signal vote on self-reported `newInfoRatio`) and `sources` (the same vote on the source ratio), ties to `legacy` |
| D4 | Keep rule per backend column, in order: at least 90 percent of sampled lineages measured, `kill` when the one-sided sign test favors the baseline at 0.05, a gain of at least 10 points, a one-sided sign test below 0.05 and, for Jev, a flip rate of at most 0.10. A baseline right on more than 90 percent prints `no headroom` |
| D5 | The operator's read of five named lineages gates every model call. Fewer than five reads, or one disagreement with the derived gold, stops the arms. No model writes a gold row |
| D6 | Each iteration gets one `score` over the five rubric levels, 3 Jev reruns with the median or 1 Deem call. Jev receives only lineages published at `origin/main`. A keep serves nothing |
<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `node .skilled/skills/system-deep-loop/runtime/scripts/score-stop-rater.cjs` without `--jev` or `--deem` exits 0, prints `lineages:`, `gold:`, `method recorded:`, `method legacy:`, `method sources:`, `baseline:` and either `no headroom` or `planned calls:`, and stub `jev` and `cli-deem` binaries first on `PATH` log zero calls
- [ ] With `--jev --deem --out <dir>` and fewer than 5 operator gold reads the script prints `stop: fewer than 5 confirmed lineages` and both stub logs stay empty. Past the gate, a stub `jev` whose `auth status --provider official` exits 3 gives a line naming the `jev` path and provider `official`, then `jev arm skipped: no credential`, and a stub `cli-deem health` reporting backend `stub` gives `deem arm skipped: stub backend`. Each run exits 0
- [ ] From `.skilled/skills/system-deep-loop/runtime`, `npx vitest run tests/unit/score-stop-rater.vitest.ts` exits 0 with at least 20 passed tests and 0 failed
- [ ] The default run printed `no headroom`, or the gate printed a `stop:` line, or one live `--deem --out <dir>` run past the gate printed `verdict deem: keep`, `verdict deem: kill` or `verdict deem: stop (<reason>)` with its commit pair and wrote a `calls.jsonl` whose every line holds a status and a wall time
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
| Planning documents | Done | `spec.md`, `plan.md`, `tasks.md`, this goal and the Planned `implementation-summary.md`, authored 2026-09-29 by a spec leaf from `../007-classifier-deep-research/research/research.md` section 12 and `../001-deep-research/research/research.md` section 11 `### R8.` |
| Release | Done | 2026-09-29: the operator's "Bind and release" amended parent D3, which releases 019 to 035. Builds run in number order, and disjoint builds may run in parallel |
| Build | Pending | Not started |

### Deviations and findings

| Item | Note |
|------|------|
| Seam check (2026-09-29) | Every R8 citation resolves in today's tree with no line drift: `runtime/scripts/convergence.cjs:506-549` (`buildNoveltyCorroboration`), `:618-631` (`applyNoveltyCorroborationGuard`), `:805-808` (the guard's call), `runtime/lib/stopping-clocks/stopping-clock-shadow.ts:10-19`, `deep-research/scripts/reduce-state.cjs:965-989` and `deep-research/references/convergence/convergence-signals.md:41-47`, `:55-73`. The vote the replay copies is at `.skilled/commands/deep/assets/deep-research-confirm.yaml:648-661` |
| Corpus drift | The record's 178 archived lineages is now 449 tracked lineages with a config, of which 203 can move their stop and 115 keep `deltas/` (1,160 iteration records, 9 with three consecutive ratios at or above 0.9). Rough counts by one `node` pass of this leaf. The census fixes the rule |
| `novelty_signal_inert` is not persisted | No tracked `deep-research-state.jsonl` holds the event: the reducer computes it at reduce time (`reduce-state.cjs:950-990`). The replay recomputes inert windows from recorded ratios |
<!-- /ANCHOR:log -->
