---
description: "Benchmark a skill's real-world routing, discovery, efficiency, and usefulness (Lane C). Emits a ranked, remediable Skill Benchmark Report. Modes :auto, :confirm."
skill: deep-loop-workflows
---

# /deep:skill-benchmark

Lane C of the `deep-improvement` skill. Benchmarks whether a **skill** is well-structured, well-routed, efficient, and useful **in practice** — how AIs actually discover and use it — and emits a ranked Skill Benchmark Report with concrete, remediable findings. Distinct from `sk-doc`/`validate.sh` (doc shape) and manual testing playbooks (described behavior).

> **EXECUTION PROTOCOL — READ FIRST**
>
> **YOUR FIRST ACTION (two HARD-BLOCK gates — do them in order, skip neither):**
> 1. Run Phase 0: @general agent self-verification (below)
> 2. Run the Setup phase (BLOCKED gate) — resolve ALL inputs (in :confirm/no-suffix, present them and wait for confirmation; in :auto, resolve confidently or fail fast naming the missing inputs)
> 3. Execute the Run step only after both gates pass
>
> This command is **general-agent based** — it orchestrates the deep-improvement skill in skill-benchmark mode (Lane C). Gate 1 (@general verification) and Gate 2 (the BLOCKED Setup phase) are HARD BLOCKS; neither may be skipped.

---

# 🚨 PHASE 0: @GENERAL AGENT VERIFICATION

**STATUS: ☐ BLOCKED**

```
EXECUTE THIS AUTOMATIC SELF-CHECK (NOT A USER QUESTION):

SELF-CHECK: Are you operating as the @general agent?
│
├─ INDICATORS that you ARE @general agent:
│   ├─ You can orchestrate the deep-improvement skill-benchmark (Lane C) loop-host invocation
│   ├─ You can orchestrate Read/Write/Edit/Bash workflow execution
│   ├─ You can load skill references and execute defined logic
│
├─ IF YES (all indicators present):
│   └─ general_agent_verified = TRUE → Read `.opencode/skills/deep-loop-workflows/deep-improvement/SKILL.md` and `references/skill_benchmark/operator_guide.md`, then continue to the Setup phase (also a HARD BLOCK)
│
└─ IF NO or UNCERTAIN:
    │
    ├─ ⛔ HARD BLOCK - DO NOT PROCEED
    │
    ├─ DISPLAY to user:
    │   ┌────────────────────────────────────────────────────────────┐
    │   │ ⛔ GENERAL AGENT REQUIRED                                  │
    │   │                                                            │
    │   │ This command orchestrates the deep-improvement skill in    │
    │   │ skill-benchmark mode and runs general-agent based.         │
    │   │                                                            │
    │   │ To proceed, restart with:                                  │
    │   │   /deep:skill-benchmark [arguments]             │
    │   └────────────────────────────────────────────────────────────┘
    │
    └─ RETURN: STATUS=FAIL ERROR="General agent required"
```

**Phase Output:**
- `general_agent_verified = ________________`

---

## SETUP

**STATUS: ☐ BLOCKED** — resolve ALL inputs below before the Run step. In `:confirm`/no-suffix, present the resolved inputs and wait for confirmation; in `:auto`, resolve confidently from arguments/defaults or fail fast naming the missing inputs. Do NOT run the loop-host command until inputs are resolved.

Resolve:
- **target skill** — the skill id or root to benchmark (must have an `INTENT_SIGNALS` + `RESOURCE_MAP` smart router for Mode A; e.g. the `cli-*` skills).
- **outputs dir** — where `skill-benchmark-report.{json,md}` are written.
- **fixtures dir** (optional) — defaults to `<skill>/assets/skill_benchmark/fixtures/<skill-id>/`.
- **trace mode** — `router` (Mode A, deterministic, default/CI) or `live` (Mode B, BUILT — playbook corpus dispatched through `cli-opencode`).

---

## RUN

```bash
node .opencode/skills/deep-loop-workflows/deep-improvement/scripts/shared/loop-host.cjs \
  --mode=skill-benchmark \
  --skill=<skill-id-or-root> \
  --outputs-dir=<path> \
  [--fixtures-dir=<path>] [--trace-mode=router] [--advisor-mode=python]
```

`--advisor-mode=python` enables the built-but-opt-in D1-inter advisor probe (deterministic in-repo SQLite advisor, scored out-of-band; off by default and in CI). The orchestrator (`scripts/skill-benchmark/run-skill-benchmark.cjs`) runs the D5 hard gate first, then per-scenario contamination-lint → router-replay → score, then writes the dual report.

---

## OUTPUT

- `skill-benchmark-report.json` — machine report (verdict, D1–D5, funnel, ranked bottlenecks, scenario rows).
- `skill-benchmark-report.md` — rendered FROM the JSON (anti-drift).

---

## PRESENTATION BOUNDARY

The following router-owned display must render verbatim when triggered:

- Phase 0 general-agent-required failure block and `STATUS=FAIL ERROR="General agent required"`.
- Setup blocked-state wording, resolved-input confirmation, and missing-input failure summary.

The following content must not come from this router:

- Loop-host progress, benchmark scores, verdicts, ranked bottlenecks, scenario rows, report wording, and remediation details.
- Skill-owned fixture, playbook, live-routing, advisor, and browser-scenario descriptions beyond the setup fields named here.

Lane C is **diagnostic by default** (no target-skill mutation). Findings hand off to Lane A (`/deep:agent-improvement`) or a follow-up spec packet via the remediation taxonomy.

---

## SCOPE (CURRENT)

Mode A (router-replay) scores D1-intra, D2, D3, D5 deterministically; D1-inter (advisor selection) is opt-in via `--advisor-mode=python`.

**Mode B (live playbook) is now BUILT** (packet `122-deep-improvement-skill-benchmark-mode/010-skill-benchmark-live-playbook-mode`): a skill's own `manual_testing_playbook` is the corpus, scored in `--trace-mode router` (deterministic CI gate, real-gold) or `--trace-mode live` (real `cli-opencode` dispatch). Live routing/advisor scenarios are graded from the model's stated routing + observed activation; browser scenarios (MR/CB) route to a `bdg` executor; D4 usefulness is an **approximate** skill-on/off ablation; an opt-in staged generator can author scenarios for skills lacking them. Live flags: `--scenarios`, `--executor`, `--playbook-dir`; live model via env `SKILL_BENCH_OPENCODE_MODEL`/`SKILL_BENCH_OPENCODE_VARIANT` (use `gpt-5.5-fast --variant high`; `xhigh` times out). Live is advisory — the gated verdict stays router mode + the D5 hard gate. Modes `:auto` / `:confirm` follow the shared deep-loop command contract.
