---
title: "cli-claude-code Skill-Benchmark Artifacts"
description: "Benchmark tree for the cli-claude-code cross-runtime dispatcher skill, scored by the deep-improvement Lane C harness where applicable. Its first entry is a hand-authored, derived-after-the-fact documentation-only SKIP for the Claude Code native-/goal scenario, not a Lane C harness run."
trigger_phrases:
  - "cli-claude-code benchmark"
  - "cli-claude-code skill-benchmark artifacts"
  - "claude code goal hook benchmark"
importance_tier: "important"
contextType: "reference"
---

# cli-claude-code Skill-Benchmark Artifacts

> Reports and inputs for benchmarking how well the `cli-claude-code` skill is routed, discovered, and used in practice, kept beside the skill it measures. Each run-label folder holds one run's report pair; this file indexes them.

---

## 1. OVERVIEW

The deep-improvement Lane C skill-benchmark harness can benchmark `cli-claude-code` against its own manual-testing-playbook scenarios across five dimensions (D1 routing, D2 discovery, D3 efficiency, D4 usefulness, D5 connectivity). This `benchmark/` tree holds the dual report each run writes, one run-label folder per run, per the fleet-wide storage convention (section 4).

The first entry in this tree is **not** a Lane C harness run. It is a hand-authored, derived-after-the-fact record of manual-testing-playbook scenario `CC-029`: Claude Code ships its own native `/goal` session-goal feature, the cross-runtime goal-hook port at `.opencode/hooks/goal/` deliberately ships no `claude/` adapter directory, and `mk_goal()` is an OpenCode-only plugin tool with no matching Claude Code tool. There is no headless model-turn surface to dispatch against, so the live-validation leg of `CC-029` is a documentation-only **SKIP** by design, not a coverage gap. Full reasoning lives in the run folder's own `README.md` and `findings-and-recommendations.md`.

## 2. RUN-LABEL INDEX

| Run label | Trace mode | Verdict | Status | Notes |
|---|---|---|---|---|
| [`2026-07-29--manual-testing-playbook--native-goal/`](./reports/2026-07-29--manual-testing-playbook--native-goal/) | doc | SKIP | derived-after-the-fact (hand-authored, not a harness run) | Claude Code's native `/goal` has no cross-runtime adapter and no headless dispatch surface — see `CC-029` |

## 3. RE-RUNNING

The entry in section 2 has no re-run command. It is a hand-authored documentation derivation of scenario `CC-029` from the goal-hook manual-testing-playbook corpus, not a Lane C harness invocation — there is nothing to dispatch, because Claude Code's native `/goal` is a first-party product surface with no cross-runtime hook state or headless entry point this repo can score.

For a future live Lane C run against `cli-claude-code`'s other scenarios, run from the repository root:

```bash
node .opencode/skills/system-deep-loop/deep-improvement/scripts/shared/loop-host.cjs \
  --mode=skill-benchmark --skill=cli-claude-code \
  --outputs-dir=.opencode/skills/cli-external-orchestration/cli-claude-code/benchmark/reports/<run-label> \
  --trace-mode=router
```

Expected result: a `verdict=` line on stdout plus `skill-benchmark-report.json` and `skill-benchmark-report.md` in the outputs dir. The D5 connectivity gate runs first and hard-fails the run on structural breaks. Add each new run as a fresh sibling run-label folder and a new row in section 2 — never overwrite an existing run-label.

## 4. RELATED RESOURCES

| Document | Purpose |
|---|---|
| [`cli-claude-code`](../SKILL.md) | The skill under measurement |
| [`goal-hook.md`](../manual-testing-playbook/goal-hook/goal-hook.md) | The `CC-029` scenario this run's entry derives from |
| [`goal-prompting-runtime-specific.md`](../../../system-spec-kit/constitutional/goal-prompting-runtime-specific.md) | The constitutional routing rule: Claude Code native `/goal`, cross-runtime routing for Devin/Cursor/Pi |
| [`deep-improvement`](../../../system-deep-loop/deep-improvement/SKILL.md) | Owns the Lane C skill-benchmark harness, runner, and scoring |
| [`skill-benchmark-storage-guide.md`](../../../sk-doc/sk-create-benchmark/references/skill-benchmark/skill-benchmark-storage-guide.md) | The storage and naming standard this tree follows |
| [`scoring-contract.md`](../../../system-deep-loop/deep-improvement/references/skill-benchmark/scoring-contract.md) | The normative Lane C measurement contract a future live verdict would be scored against |
