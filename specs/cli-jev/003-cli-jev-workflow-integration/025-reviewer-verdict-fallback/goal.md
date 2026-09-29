---
title: "Goal: Phase 25: reviewer-verdict-fallback"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "reviewer verdict fallback goal"
  - "score-verdict-fallback completion criteria"
  - "reviewer fallback keep rule"
  - "verdict regex miss gate"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "cli-jev/003-cli-jev-workflow-integration/025-reviewer-verdict-fallback"
    last_updated_at: "2026-09-29T16:00:00Z"
    last_updated_by: "authoring-leaf"
    recent_action: "Authored the Planned goal from research item R5"
    next_safe_action: "Released 2026-09-29 (parent goal D3): build per plan.md in number order"
    blockers: []
    key_files:
      - "specs/cli-jev/003-cli-jev-workflow-integration/025-reviewer-verdict-fallback/spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-cli-jev-003-025-reviewer-verdict-fallback"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 25: reviewer-verdict-fallback

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Count with zero calls how often recorded reviewer outputs miss the reviewer scorer's verdict regex, and settle offline, on a counted number per backend, whether a Jev or Deem choice over pass, fail and block classifies the labeled misses more accurately than zero-call rules.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Changed paths: new `lib/score-verdict-fallback.cjs` and `tests/verdict-fallback.vitest.ts` under deep-improvement's `scripts/model-benchmark/`, two README rows and, per parent D6, deep-improvement's `SKILL.md`, README, changelog, catalog and playbook through sk-doc. `reviewer-scorer.cjs`, its fixtures, profile, schema and workflows are unchanged |
| D2 | The census imports `extractVerdict` unchanged and never dispatches a case. Only regex misses enter the labeled population |
| D3 | The operator labels each miss with the verdict it gives, `pass`, `fail` or `block`, and no model writes a label. `expectedVerdict` is never the label. Below 12 labeled misses, or with a verdict absent, the run prints its `stop:` line, and the phase may close there |
| D4 | Spec section 4's Keep Rule, per column, in order: 90 percent coverage, `kill` when p_loss is below 0.05, a 10-point gain over the better of the majority class and the loose last-word rule, p_win below 0.05 and a flip rate of at most 0.10 over three option orders. A baseline above 0.90 prints `no headroom` |
| D5 | Jev first, then Deem, each only on its own switch and checks, with no failover. An untracked outputs file needs `--accept-payload` before Jev. A `keep` wires nothing: a classifier `--grader` value needs a later phase the operator opens |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `node .skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/score-verdict-fallback.cjs` exits 0, prints `fixture cases: 8 hits: 8 misses: 0` and a `stop:`, `no headroom` or `planned calls:` line, and stub `cli-deem` and `jev` first on `PATH` log zero calls
- [ ] With a stub `cli-deem health` reporting backend `stub`, `--deem` prints `deem arm skipped: stub backend`, and with a stub `jev auth status --provider official` exiting 3, `--jev` prints `jev arm skipped: no credential`. Each exits 0 with the rest of stdout byte-identical to the census
- [ ] From `.skilled/skills/system-deep-loop/deep-improvement/scripts`, `npx vitest run model-benchmark/tests/verdict-fallback.vitest.ts` exits 0 with at least 16 passed and 0 failed
- [ ] Either the census printed a `stop:` line below 12 labeled misses, or one live `--deem --out <dir>` run printed a `verdict deem:` line and wrote `calls.jsonl` lines each holding `wallMs`, `exitCode`, `modelId`, `modelCommit` and `sourceCommit`
- [ ] `grep -nE 'API_KEY|TYPESAFE|Bearer|Authorization'` on `score-verdict-fallback.cjs` prints nothing, and `git status --porcelain` is the same before and after each run
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
| Planning documents | Done | `spec.md`, `plan.md`, `tasks.md`, this goal and a Planned `implementation-summary.md`, authored 2026-09-29 from R5 and open question 6 in `../001-deep-research/research/research.md` sections 11 and 12, and the carried table in `../007-classifier-deep-research/research/research.md` section 12 |
| Seam check | Done | At the worktree HEAD `reviewer-scorer.cjs:11`, `:117-123`, `:119`, `:155-167`, `:171`, `:192`, `:231-236` and `:273-292`, `reviewer-schema.md:74-76` and `:82-90`, `deep-model-benchmark-auto.yaml:206` and `deep-model-benchmark-confirm.yaml:228` hold the text R5 cites. No line moved |
| Census inputs | Done | This leaf replayed the exported `extractVerdict` on 2026-09-29: 4 fixtures, 8 cases, all `fail`, all with a recorded output, 8 hits and 0 misses. No `reviewer-report.json` exists in the worktree or the main checkout |
| Release | Done | 2026-09-29: the operator's "Bind and release" amended parent goal D3, which releases 019 to 035. Builds run in number order, and disjoint builds may run in parallel. Phase 024 shares doc paths, so the two build in turn |
| Label gate | Pending | No regex-miss output exists to label |
| Build | Pending | Not started |

### Deviations and findings

| Item | Note |
|------|------|
| Finding: a live run keeps no output text | `runCase` records a 16-character hash of each output (`reviewer-scorer.cjs:203`), so even a live reviewer run leaves nothing to label. How the operator gathers misses is spec section 7's first question |
| Baseline beyond today's behavior | Today a miss records `unknown`, which a model beats on every row. The keep rule compares against the better of the majority class and a loose last-word rule instead, so a `keep` means a model beats a regex change, the cheaper fix R5's fitness check names |
<!-- /ANCHOR:log -->
