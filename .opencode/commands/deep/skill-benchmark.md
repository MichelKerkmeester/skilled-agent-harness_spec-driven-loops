---
description: "Benchmark a skill's real-world routing, discovery, efficiency, and usefulness (Lane C). Emits a ranked, remediable Skill Benchmark Report. Modes :auto, :confirm."
argument-hint: "<skill_id_or_root> [:auto|:confirm] [--outputs-dir=PATH] [--fixtures-dir=PATH] [--trace-mode=router|live] [--advisor-mode=python]"
allowed-tools: Read, Write, Edit, Bash, Grep, Glob, Task
skill: system-deep-loop
---

# Deep Start Skill Benchmark Loop

Lane C of the `deep-improvement` skill. Benchmarks whether a **skill** is well-structured, well-routed, efficient, and useful **in practice** — how AIs actually discover and use it — and emits a ranked Skill Benchmark Report with concrete, remediable findings. Distinct from `sk-doc`/`validate.sh` (doc shape) and manual testing playbooks (described behavior).

## 1. ROUTER CONTRACT

Thin router for the skill-benchmark loop. This command verifies the runtime agent, resolves setup and execution mode, loads the presentation contract, then executes the owned workflow YAML. Scoring, contamination-lint, router-replay, and report rendering are owned by the loop-host scripts and the workflow YAML — never inline in this document.

Load the presentation contract before showing startup questions, resolved-input confirmations, result output, failure output, or next-step prompts.

> **EXECUTION PROTOCOL - READ FIRST**
>
> **YOUR FIRST ACTION (two HARD-BLOCK gates - do them in order, skip neither):**
> 1. Run Phase 0: dispatch-context check (below)
> 2. Run the Mandatory Input Gate (below) - resolve ALL inputs (in :confirm/no-suffix, present them and wait for confirmation; in :auto, resolve confidently or fail fast naming the missing inputs)
> 3. Load the matching workflow YAML and execute it only after both gates pass
>
> This command is **general-agent based** - it orchestrates the deep-improvement skill in skill-benchmark mode (Lane C). Gate 1 (dispatch-context check) and Gate 2 (the BLOCKED input gate) are HARD BLOCKS; neither may be skipped. Benchmark execution itself is owned by the workflow YAML.

### PHASE 0: DISPATCH-CONTEXT CHECK

**STATUS: ☐ CHECKED**

```
This gate checks actual dispatch context, not self-reported capability -- the prior
self-assessment version of this check produced a confirmed false-positive block (a
capable agent judged itself "uncertain" on an abstract question and hard-stopped).

CHECK: was this file invoked directly as /deep:skill-benchmark (typed by the user,
or an explicit Task delegation naming this exact command) -- as opposed to another
agent pasting this file's raw content into a Task-dispatch prompt as inline ad hoc
instructions for a worker to follow (that worker should follow its own dispatch
prompt, not re-run this command's full setup contract)?

├─ YES, or no concrete evidence of the pasted-inline case:
│   └─ general_agent_verified = TRUE → Read `.opencode/skills/system-deep-loop/deep-improvement/SKILL.md` and `references/skill_benchmark/operator_guide.md`, then continue to the Mandatory Input Gate (also a HARD BLOCK)
│
└─ NO, with concrete evidence this file's content was pasted inline rather than
   invoked as the command itself:
    │
    ├─ ⛔ HARD BLOCK - DO NOT PROCEED
    │
    ├─ DISPLAY to user:
    │   ┌────────────────────────────────────────────────────────────┐
    │   │ ⛔ DIRECT INVOCATION REQUIRED                              │
    │   │                                                            │
    │   │ This command orchestrates the deep-improvement skill in    │
    │   │ skill-benchmark mode and runs general-agent based.         │
    │   │                                                            │
    │   │ To proceed, restart with:                                  │
    │   │   /deep:skill-benchmark [arguments]                        │
    │   └────────────────────────────────────────────────────────────┘
    │
    └─ RETURN: STATUS=FAIL ERROR="Must be invoked directly, not pasted as inline sub-agent instructions"

Default on ambiguity: PROCEED. Do not block on an inability to introspect abstract
capability (e.g. "can I orchestrate a workflow") -- that question is unanswerable
from the inside and is what caused the original false-positive block. Block only on
concrete evidence of the pasted-inline case above.
```

**Phase Output:**
- `general_agent_verified = ________________`

### MANDATORY INPUT GATE

**STATUS: ☐ BLOCKED** — resolve ALL inputs below before loading the workflow YAML. In `:confirm`/no-suffix, present the resolved inputs and wait for confirmation; in `:auto`, resolve confidently from arguments/defaults or fail fast naming the missing inputs. Do NOT load the YAML until inputs are resolved.

**YAML START CONDITION**: do not load the workflow YAML until `general_agent_verified`, `skill`, `outputs_dir`, `trace_mode`, and `execution_mode` are bound (`fixtures_dir` and `advisor_mode` are optional and stay unset when absent). Markdown owns setup; the YAML owns dispatch.

Resolve:
- **target skill** — the skill id or root to benchmark (must have an `INTENT_SIGNALS` + `RESOURCE_MAP` smart router for Mode A; e.g. the `cli-*` skills).
- **outputs dir** — where `skill-benchmark-report.{json,md}` are written.
- **fixtures dir** (optional) — defaults to `<skill>/assets/skill_benchmark/fixtures/<skill-id>/`.
- **trace mode** — `router` (Mode A, deterministic, default/CI) or `live` (Mode B, BUILT — playbook corpus dispatched through `cli-opencode`).
- **advisor mode** (optional) — `python` enables the opt-in D1-inter advisor probe; off by default and in CI.

## 2. OWNED ASSETS

| Purpose | Asset |
|---------|-------|
| Presentation source of truth | `.opencode/commands/deep/assets/deep_skill-benchmark_presentation.txt` |
| Auto workflow | `.opencode/commands/deep/assets/deep_skill-benchmark_auto.yaml` |
| Confirm workflow | `.opencode/commands/deep/assets/deep_skill-benchmark_confirm.yaml` |
| Loop host (dispatch target) | `.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/loop-host.cjs` (`--mode=skill-benchmark`) |
| Benchmark orchestrator | `scripts/skill-benchmark/run-skill-benchmark.cjs` (D5 hard gate → per-scenario contamination-lint → router-replay → score → dual report) |
| Methodology + operator guide | `references/skill_benchmark/operator_guide.md`, `references/skill_benchmark/routing_optimization.md`, and the target skill's SKILL.md |

No workflow-asset gap exists for this command.

## 3. MODE ROUTING

1. Parse `$ARGUMENTS` for attached suffixes: `:auto` sets `execution_mode = AUTONOMOUS`; `:confirm` sets `execution_mode = INTERACTIVE`; no suffix sets `execution_mode = ASK`.
2. Treat the skill id/root, `--outputs-dir`, `--fixtures-dir`, `--trace-mode`, and `--advisor-mode` as workflow inputs, not execution modes.
3. Resolve the Mandatory Input Gate values from `$ARGUMENTS` and defaults. For `:auto`, resolve confidently or fail fast naming the missing inputs; for `:confirm`/no suffix, present the resolved inputs and wait for confirmation.
4. After Phase 0 and the input gate pass, read the target skill's SKILL.md + the operator guide, then load the matching workflow YAML in §4 and execute it step by step using the resolved setup values.

## 4. EXECUTION TARGETS

| Mode | Workflow |
|------|----------|
| `:auto` | `.opencode/commands/deep/assets/deep_skill-benchmark_auto.yaml` |
| `:confirm` or interactive choice | `.opencode/commands/deep/assets/deep_skill-benchmark_confirm.yaml` |

Both workflows dispatch the benchmark loop host exactly once with the resolved inputs. The dispatch is byte-identical to the prior direct invocation — only required `--skill` and `--outputs-dir` are always passed; `--fixtures-dir`, `--trace-mode`, and `--advisor-mode` are appended only when set:

```bash
node .opencode/skills/system-deep-loop/deep-improvement/scripts/shared/loop-host.cjs \
  --mode=skill-benchmark \
  --skill=<skill-id-or-root> \
  --outputs-dir=<path> \
  [--fixtures-dir=<path>] [--trace-mode=router] [--advisor-mode=python]
```

`--advisor-mode=python` enables the built-but-opt-in D1-inter advisor probe (deterministic in-repo SQLite advisor, scored out-of-band; off by default and in CI). The orchestrator (`scripts/skill-benchmark/run-skill-benchmark.cjs`) runs the D5 hard gate first, then per-scenario contamination-lint → router-replay → score, then writes the dual report.

## 5. PRESENTATION BOUNDARY

The following content lives only in `.opencode/commands/deep/assets/deep_skill-benchmark_presentation.txt`:

- Startup-question wording, consolidated setup prompt text, resolved-input confirmation, and reply-format examples.
- `:auto` setup resolution rules and fail-fast display references.
- Benchmark purpose/contract display, scoring-dimension reference tables, workflow overview display, and user-facing examples.
- Result and error templates, benchmark report display, and next-step suggestions.

The following router-owned display must still render verbatim from this document when triggered:

- Phase 0 general-agent-required failure block and `STATUS=FAIL ERROR="Must be invoked directly, not pasted as inline sub-agent instructions"`.
- Mandatory Input Gate blocked-state wording, resolved-input confirmation, and missing-input failure summary.

The following content must not come from this router: loop-host progress, benchmark scores, verdicts, ranked bottlenecks, scenario rows, report wording, remediation details, and any skill-owned fixture, playbook, live-routing, advisor, or browser-scenario description beyond the setup fields named here.

Lane C is **diagnostic by default** (no target-skill mutation). Findings hand off to Lane A (`/deep:agent-improvement`) or a follow-up spec packet via the remediation taxonomy.

## 6. WORKFLOW SUMMARY

The dispatched loop host runs the D5 hard gate, then per-scenario contamination-lint → router-replay → score, and writes two reports: `skill-benchmark-report.json` (machine report — verdict, D1–D5, funnel, ranked bottlenecks, scenario rows) and `skill-benchmark-report.md` (rendered FROM the JSON, anti-drift). This command adds no iteration, reduction, or promotion; Lane C is diagnostic by default and never mutates the target skill or its gold.

Mode A (router-replay) scores D1-intra, D2, D3, D5 deterministically; D1-inter (advisor selection) is opt-in via `--advisor-mode=python`. **Mode B (live playbook) is BUILT**: a skill's own `manual_testing_playbook` is the corpus, scored in `--trace-mode router` (deterministic CI gate, real-gold) or `--trace-mode live` (real `cli-opencode` dispatch). Live routing/advisor scenarios are graded from the model's stated routing + observed activation; browser scenarios (MR/CB) route to a `bdg` executor; D4 usefulness is an **approximate** skill-on/off ablation; an opt-in staged generator can author scenarios for skills lacking them. Live flags: `--scenarios`, `--executor`, `--playbook-dir`; live model via env `SKILL_BENCH_OPENCODE_MODEL`/`SKILL_BENCH_OPENCODE_VARIANT` (use `gpt-5.5-fast --variant high`; `xhigh` times out). Live is advisory — the gated verdict stays router mode + the D5 hard gate. Modes `:auto` / `:confirm` follow the shared deep-loop command contract.

**Optimize target.** Lane C also drives a **routing-optimization** workflow that turns the benchmark's own signals into concrete parent-router and per-child `skill.md` → `references/`/`assets/` routing fixes. It is **propose-by-default** — never mutate a target skill or its gold without explicit operator review. Runnable today (signal → fix, following the methodology reference):

1. Run the benchmark above; read `dimensionScores.D5` + `bottlenecks[class="orphan_reference"]` (references reachable from no `RESOURCE_MAP` intent) and `dimensionScores.D3` (over-routing).
2. Apply the fix class per signal, per `references/skill_benchmark/routing_optimization.md`: wire orphan references into a meaningful intent; map always-loaded files into `RESOURCE_MAP`; align each scenario's gold with the router's *declared* designed load; intent-gate genuine over-routing.
3. Re-benchmark to confirm the rise and no regression; keep the parent `RESOURCE_MAP` a union of its children (drift guard).

The **anti-gaming guard is mandatory** (methodology §7): never invent gold, never add keywords that misroute. `code-review` is the worked example (D5 85→100, live 69→100).

> Planned automation: `loop-host.cjs --mode=skill-benchmark-optimize` → `scripts/skill-benchmark/optimize-skill-benchmark.cjs` emitting `proposals/router.patch` + `proposals/gold.patch` behind `--apply-router` / `--apply-gold`. Until it lands, optimize is the operator-driven runbook above.
