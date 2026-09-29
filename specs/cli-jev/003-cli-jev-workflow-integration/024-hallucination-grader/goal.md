---
title: "Goal: Phase 24: hallucination-grader"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "hallucination grader goal"
  - "score-d4-agreement completion criteria"
  - "d4 grader keep rule"
  - "unknown grader startup check"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "cli-jev/003-cli-jev-workflow-integration/024-hallucination-grader"
    last_updated_at: "2026-09-29T16:00:00Z"
    last_updated_by: "authoring-leaf"
    recent_action: "Authored the Planned goal from research item R7"
    next_safe_action: "Released 2026-09-29 (parent goal D3): build per plan.md in number order"
    blockers: []
    key_files:
      - "specs/cli-jev/003-cli-jev-workflow-integration/024-hallucination-grader/spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-cli-jev-003-024-hallucination-grader"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 24: hallucination-grader

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Stop the model-benchmark runner from silently scoring an unknown grader kind with its stub, and settle offline, on a counted number per backend, whether a Jev or Deem hallucination judgment agrees with the operator's labels more often than the deterministic hallucination-flag check.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Changed paths: `run-benchmark.cjs` and `buildGraderFn` in `score-model-variant.cjs` refuse a grader kind outside `noop`, `mock` and `llm`. New `scorer/score-d4-agreement.cjs` and `tests/d4-agreement.vitest.ts`, one case each in two existing test files, two READMEs and, per parent D6, deep-improvement's `SKILL.md`, README, changelog, catalog and playbook through sk-doc. No grader kind added, D4 weight and the failed grade's 0.0 unchanged |
| D2 | The baseline method is the better of `hallucination-flag.cjs`, unchanged, with each fixture's `allowlist` or `{}`, and the labels' majority class. A check score below 1.0 reads `yes` |
| D3 | The operator labels every output `yes` or `no`, and no model writes a label. Below 30 labeled outputs, or 5 of either class, the run prints its `stop:` line, and the phase may close there |
| D4 | Spec section 4's Keep Rule, per column, in order: 90 percent coverage, `kill` when p_loss is below 0.05, a 10-point gain, p_win below 0.05 and, for Jev, a flip rate of at most 0.10 over three reruns. A Deem `noul` holds by its commit pair. A baseline above 0.90 prints `no headroom` |
| D5 | Jev first, then Deem, each only on its own switch and checks, with no failover. An untracked output needs `--accept-payload` before Jev. A `keep` wires nothing: a grader kind needs a later phase the operator opens |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `node .skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/run-benchmark.cjs --profile default --outputs-dir <tmp> --scorer 5dim --grader jev` exits 2 and prints the usage line, and the same command with `--grader noop` exits as it did before the change
- [ ] `node score-d4-agreement.cjs --outputs <dir>` exits 0, prints the output counts, `allowlist: 0 of 21` on today's fixtures and a `stop:`, `no headroom` or `planned calls:` line, and stub `cli-deem` and `jev` first on `PATH` log zero calls
- [ ] With a stub `cli-deem health` reporting backend `stub`, `--deem` prints `deem arm skipped: stub backend`, and with a stub `jev auth status --provider official` exiting 3, `--jev` prints `jev arm skipped: no credential`. Each exits 0 with the rest of stdout byte-identical to the census
- [ ] From `.skilled/skills/system-deep-loop/deep-improvement/scripts`, `npx vitest run model-benchmark/tests/` exits 0 with at least 16 more passing tests than before the build and no new failure
- [ ] Either the census printed a `stop:` line below 30 labeled outputs, or one live `--deem --out <dir>` run printed a `verdict deem:` line and wrote `calls.jsonl` lines each holding `wallMs`, `exitCode`, `modelId`, `modelCommit` and `sourceCommit`
- [ ] `grep -nE 'API_KEY|TYPESAFE|Bearer|Authorization'` on `score-d4-agreement.cjs` prints nothing, `git status --porcelain` is the same before and after each run, and `validate.sh --strict` on this phase prints `RESULT: PASSED`
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
| Planning documents | Done | `spec.md`, `plan.md`, `tasks.md`, this goal and a Planned `implementation-summary.md`, authored 2026-09-29 from R7 in `../001-deep-research/research/research.md` section 11, its round-2 row in `../004-deep-research-expansion/research/research.md` section 11 and the carried table in `../007-classifier-deep-research/research/research.md` section 12 |
| Seam check | Done | At the worktree HEAD `score-model-variant.cjs:21`, `:58`, `:207-226`, `:208-209`, `:211`, `:222-224`, `:284` and `:300`, `run-benchmark.cjs:16-17`, `:571`, `:577`, `:582` and `:614-621`, and `grader/harness.cjs:231-284` hold the text R7 cites. No line moved |
| Census inputs | Done | Counted by this leaf on 2026-09-29: 21 fixture files under `benchmark-fixtures/`, 0 with an `allowlist`. No 5dim output or `report.json` under a model-benchmark path. 32 cached `llm` grader records, 18 `D4` and 14 `D4-R` |
| Release | Done | 2026-09-29: the operator's "Bind and release" amended parent goal D3, which releases 019 to 035. Builds run in number order, and disjoint builds may run in parallel. Phase 025 shares doc paths, so the two build in turn |
| Label gate | Pending | No output and no label exist |
| Build | Pending | Not started |

### Deviations and findings

| Item | Note |
|------|------|
| Finding: empty allowlist on the runner path | `scoreFixture5dim` passes no `allowlist` (`run-benchmark.cjs:457-461`), so the virtual fixture holds `{}` (`score-model-variant.cjs:270`), and no fixture carries one. The research named the deterministic check as a comparator without this fact. The phase records it and leaves the fix to the owner |
| Flip bound for a Deem `noul` | The authoring brief asks for a flip bound over option orders. A `noul` has no options, and research C4 gives a Deem `noul` no rerun clause. The Deem column prints `flips: n/a (commit pair)`, and the Jev column keeps its three reruns |
| Two conventions for an unknown flag | The runner warns and defaults on an unknown `--scorer` (`run-benchmark.cjs:572-576`), and this phase makes an unknown `--grader` exit 2 as the research asks. Recorded so the owner can choose at review |
<!-- /ANCHOR:log -->
