---
description: "Benchmark a skill's real-world routing, discovery, efficiency, and usefulness (Lane C). Emits a ranked, remediable Skill Benchmark Report. Modes :auto, :confirm."
skill: deep-improvement
---

# /deep:start-skill-benchmark-loop

Lane C of the `deep-improvement` skill. Benchmarks whether a **skill** is well-structured, well-routed, efficient, and useful **in practice** — how AIs actually discover and use it — and emits a ranked Skill Benchmark Report with concrete, remediable findings. Distinct from `sk-doc`/`validate.sh` (doc shape) and manual testing playbooks (described behavior).

## Phase 0 — self-verification

Read `.opencode/skills/deep-improvement/SKILL.md` and `references/skill-benchmark/operator_guide.md` before dispatch.

## Setup

Resolve:
- **target skill** — the skill id or root to benchmark (must have an `INTENT_SIGNALS` + `RESOURCE_MAP` smart router for Mode A; e.g. the `cli-*` skills).
- **outputs dir** — where `skill-benchmark-report.{json,md}` are written.
- **fixtures dir** (optional) — defaults to `<skill>/assets/skill-benchmark/fixtures/<skill-id>/`.
- **trace mode** — `router` (Mode A, deterministic, default/CI) or `live` (Mode B, BUILT — playbook corpus dispatched through `cli-opencode`).

## Run

```bash
node .opencode/skills/deep-improvement/scripts/shared/loop-host.cjs \
  --mode=skill-benchmark \
  --skill=<skill-id-or-root> \
  --outputs-dir=<path> \
  [--fixtures-dir=<path>] [--trace-mode=router] [--advisor-mode=python]
```

`--advisor-mode=python` enables the built-but-opt-in D1-inter advisor probe (deterministic in-repo SQLite advisor, scored out-of-band; off by default and in CI). The orchestrator (`scripts/skill-benchmark/run-skill-benchmark.cjs`) runs the D5 hard gate first, then per-scenario contamination-lint → router-replay → score, then writes the dual report.

## Output

- `skill-benchmark-report.json` — machine report (verdict, D1–D5, funnel, ranked bottlenecks, scenario rows).
- `skill-benchmark-report.md` — rendered FROM the JSON (anti-drift).

Lane C is **diagnostic by default** (no target-skill mutation). Findings hand off to Lane A (`/deep:start-agent-improvement-loop`) or a follow-up spec packet via the remediation taxonomy.

## Scope (current)

Mode A (router-replay) scores D1-intra, D2, D3, D5 deterministically; D1-inter (advisor selection) is opt-in via `--advisor-mode=python`.

**Mode B (live playbook) is now BUILT** (packet `122-deep-improvement-skill-benchmark-mode/010-skill-benchmark-live-playbook-mode`): a skill's own `manual_testing_playbook` is the corpus, scored in `--trace-mode router` (deterministic CI gate, real-gold) or `--trace-mode live` (real `cli-opencode` dispatch). Live routing/advisor scenarios are graded from the model's stated routing + observed activation; browser scenarios (MR/CB) route to a `bdg` executor; D4 usefulness is an **approximate** skill-on/off ablation; an opt-in staged generator can author scenarios for skills lacking them. Live flags: `--scenarios`, `--executor`, `--playbook-dir`; live model via env `SKILL_BENCH_OPENCODE_MODEL`/`SKILL_BENCH_OPENCODE_VARIANT` (use `gpt-5.5-fast --variant high`; `xhigh` times out). Live is advisory — the gated verdict stays router mode + the D5 hard gate. Modes `:auto` / `:confirm` follow the shared deep-loop command contract.
