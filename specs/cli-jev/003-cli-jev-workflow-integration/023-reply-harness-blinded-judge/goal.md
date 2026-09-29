---
title: "Goal: Phase 23: reply-harness-blinded-judge"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "reply harness judge goal"
  - "judge-agreement completion criteria"
  - "blinded judge keep rule"
  - "reply harness label gate"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "cli-jev/003-cli-jev-workflow-integration/023-reply-harness-blinded-judge"
    last_updated_at: "2026-09-29T16:00:00Z"
    last_updated_by: "authoring-leaf"
    recent_action: "Authored the Planned goal from research item R6"
    next_safe_action: "Released 2026-09-29 (parent goal D3): build per plan.md in number order"
    blockers: []
    key_files:
      - "specs/cli-jev/003-cli-jev-workflow-integration/023-reply-harness-blinded-judge/spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-cli-jev-003-023-reply-harness-blinded-judge"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 23: reply-harness-blinded-judge

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Settle offline, on a counted number per backend, whether a Jev or Deem score per rubric dimension agrees with the operator's grades of masked reply-harness replies more often than the harness's mechanical scores, through one read-only script whose default run makes zero model calls.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Changed paths: new `judge-agreement.mjs` and `judge-agreement.test.mjs` in sk-communication's `benchmark/reply-harness/`, one harness README row and, per parent D6, sk-communication's `SKILL.md`, README, changelog, catalog and playbook through sk-doc. No harness script, rubric, case set or release-gate edit |
| D2 | Masked replies join to committed reply files by SHA-256 of their text. The baseline is `score.mjs`, unchanged, on three levels: 0 is `absent`, 1 is `fully met`, anything between is `partly met` |
| D3 | The operator grades every labeled reply on all seven dimensions, and no model writes a grade. Below 20 graded distinct replies the run prints `stop: fewer than 20 labeled replies`, and the phase may close there |
| D4 | Spec section 4's Keep Rule, per column, in order: 90 percent coverage, `kill` when p_loss is below 0.05, a 10-point gain over the baseline on measured cells, p_win below 0.05 over replies and, for Jev, a flip rate of at most 0.10 over three reruns. A Deem `score` holds by its commit pair. A baseline above 0.90 prints `no headroom` |
| D5 | Jev first, then Deem, each only on its own switch and checks, with no failover. An untracked masked file needs `--accept-payload` before Jev. A `keep` serves nothing: any use needs a later phase the operator opens |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `node judge-agreement.mjs` over the masked directories `blind/`, `sonnet/blind/` and `attempt-1/blind/` under `specs/sk-communication/006-sk-communication-clarity/005-verification-and-rollout/runs/` exits 0, prints `masked: 42`, `distinct: 38`, `matched: 38` and a `stop:`, `no headroom` or `planned calls:` line, and stub `cli-deem` and `jev` first on `PATH` log zero calls
- [ ] With a stub `cli-deem health` reporting backend `stub`, `--deem` prints `deem arm skipped: stub backend`, and with a stub `jev auth status --provider official` exiting 3, `--jev` prints `jev arm skipped: no credential`. Each exits 0 with the rest of stdout byte-identical to the default run
- [ ] `node --test .skilled/skills/sk-communication/benchmark/reply-harness/judge-agreement.test.mjs` exits 0 with at least 18 passed and 0 failed
- [ ] Either the census printed `stop: fewer than 20 labeled replies`, or one live `--deem --out <dir>` run printed a `verdict deem:` line and wrote `calls.jsonl` lines each holding `wallMs`, `exitCode`, `modelId`, `modelCommit` and `sourceCommit`
- [ ] `grep -nE 'API_KEY|TYPESAFE|Bearer|Authorization'` on `judge-agreement.mjs` prints nothing, and `git status --porcelain` is the same before and after each run
- [ ] `validate.sh --strict` on this phase prints `RESULT: PASSED`
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
| Planning documents | Done | `spec.md`, `plan.md`, `tasks.md`, this goal and a Planned `implementation-summary.md`, authored 2026-09-29 from R6 in `../001-deep-research/research/research.md` section 11 and the carried table in `../007-classifier-deep-research/research/research.md` section 12 |
| Seam check | Done | `.skilled/skills/sk-communication/benchmark/reply-harness/README.md:3`, `:11`, `:12` and `:20` resolve at the worktree HEAD with the text R6 cites. `rubric.json` holds 7 dimensions and `cases.json` 7 cases. No line moved |
| Census inputs | Done | Counted by this leaf on 2026-09-29: 3 committed blind runs, 42 masked files, 38 distinct reply texts by SHA-256, 38 matching a committed reply file. Across the 8 committed results files, 24 of 392 mechanical cells are fractional, all `mechanical-tells` |
| Release | Done | 2026-09-29: the operator's "Bind and release" amended parent goal D3, which releases 019 to 035. Builds run in number order, and disjoint builds may run in parallel |
| Label gate | Pending | 0 of 38 distinct replies graded |
| Build | Pending | Not started |

### Deviations and findings

| Item | Note |
|------|------|
| Flip bound for a Deem `score` | The authoring brief asks for a flip bound over option orders. A `score` asks ordered levels, so it has no option order to rotate, and research C4 gives a Deem `score` no rerun clause because the server answered the same in 40 of 40 repeats. The Deem column prints `flips: n/a (commit pair)`, and the Jev column keeps its three reruns |
| Research premise corrected | R6's record said no harness run was recorded (seat-reported). Three blind runs are committed under `specs/sk-communication/006-sk-communication-clarity/005-verification-and-rollout/runs/`. The later reason stands, because none of their replies carries an operator grade |
| Stale path in a sealed order | `runs/attempt-1/blind/order-sealed.json` names `runs/before-replies` and `runs/after-replies`, not the `attempt-1/` directories, so the census joins by reply text and never by the recorded path |
<!-- /ANCHOR:log -->
