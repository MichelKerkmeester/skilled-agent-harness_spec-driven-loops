---
title: "cli-claude-code Skill-Benchmark Artifacts"
description: "Historical benchmark tree for the cli-claude-code cross-runtime dispatcher skill, whose reports were produced by the retired deep-improvement Lane C harness where applicable. Its first entry is a hand-authored, derived-after-the-fact documentation-only SKIP for the Claude Code native-/goal scenario, not a Lane C harness run."
trigger_phrases:
  - "cli-claude-code benchmark"
  - "cli-claude-code skill-benchmark artifacts"
  - "claude code goal hook benchmark"
importance_tier: "important"
contextType: "reference"
---

# cli-claude-code Skill-Benchmark Artifacts

> Reports and inputs for benchmarking how well the `cli-claude-code` skill is routed, discovered, and used in practice, kept beside the skill it measures. Each run-label folder holds one run's report pair; this file indexes them.

> **Retired lane:** the Lane C skill-benchmark harness, its runner, its scoring contract and the `/deep:skill-benchmark` command were removed. This tree is a frozen index of the reports that lane produced; no new skill-benchmark run can be started from it.

---

## 1. OVERVIEW

The retired deep-improvement Lane C skill-benchmark harness benchmarked `cli-claude-code` against its own manual-testing-playbook scenarios across five dimensions (D1 routing, D2 discovery, D3 efficiency, D4 usefulness, D5 connectivity). This `benchmark/` tree holds the dual report each archived run wrote, one run-label folder per run, per the fleet-wide storage convention (section 4).

The first entry in this tree is **not** a Lane C harness run. It is a hand-authored, derived-after-the-fact record of manual-testing-playbook scenario `CC-029`: Claude Code ships its own native `/goal` session-goal feature, the cross-runtime goal-hook port at `.skilled/hooks/goal/` deliberately ships no `claude/` adapter directory, and `opencode_goal()` is an OpenCode-only plugin tool with no matching Claude Code tool. There is no headless model-turn surface to dispatch against, so the live-validation leg of `CC-029` is a documentation-only **SKIP** by design, not a coverage gap. Full reasoning lives in the run folder's own `README.md` and `findings-and-recommendations.md`.

---

## 2. RUN-LABEL INDEX

| Run label | Trace mode | Verdict | Status | Notes |
|---|---|---|---|---|
| [`2026-07-29--manual-testing-playbook--goal-hook/`](./reports/2026-07-29--manual-testing-playbook--goal-hook/) | doc | SKIP | derived-after-the-fact (hand-authored, not a harness run) | Claude Code's native `/goal` has no cross-runtime adapter and no headless dispatch surface, see `CC-029` |

---

## 3. RE-RUNNING

The entry in section 2 has no re-run command. It is a hand-authored documentation derivation of scenario `CC-029` from the goal-hook manual-testing-playbook corpus, not a Lane C harness invocation: there is nothing to dispatch, because Claude Code's native `/goal` is a first-party product surface with no cross-runtime hook state or headless entry point this repo can score.

There is no re-run path for a skill-benchmark report. The Lane C harness that produced them was removed, and `loop-host.cjs` now accepts only the surviving `agent-improvement` and `model-benchmark` modes.

---

## 4. RELATED RESOURCES

| Document | Purpose |
|---|---|
| [`cli-claude-code`](../SKILL.md) | The skill under measurement |
| [`goal-hook.md`](../manual-testing-playbook/goal-hook/goal-hook.md) | The `CC-029` scenario this run's entry derives from |
| [`hooks/goal/README.md`](../../../../hooks/goal/README.md) | The per-runtime goal routing contract (§3): Claude Code native `/goal`, cross-runtime delivery for Devin/Cursor/Pi |
| [`deep-improvement`](../../../system-deep-loop/deep-improvement/SKILL.md) | Owns the surviving improvement lanes (agent-improvement, model-benchmark) |
| [`skill-benchmark-storage-guide.md`](../../../sk-doc/sk-create-benchmark/references/skill-benchmark/skill-benchmark-storage-guide.md) | The storage and naming standard this tree follows |
