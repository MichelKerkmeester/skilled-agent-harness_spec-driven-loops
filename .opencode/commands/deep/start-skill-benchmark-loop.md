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
- **trace mode** — `router` (Mode A, deterministic, default/CI) or `live` (Mode B, follow-on).

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

Mode A (router-replay) scores D1-intra, D2, D3, D5 deterministically. D1-inter (advisor selection) is also built and deterministic, but opt-in via `--advisor-mode=python` (off by default and in CI; scored out-of-band through the in-repo SQLite advisor). Only D4 (usefulness ablation) and the live in-situ trace (Mode B) remain follow-on per the 002 implementation playbook; they report as `unscored-mode-a` until built. Modes `:auto` / `:confirm` follow the shared deep-loop command contract.
