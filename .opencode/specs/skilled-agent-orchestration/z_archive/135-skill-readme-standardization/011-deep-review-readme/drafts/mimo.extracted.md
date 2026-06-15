---
title: "deep-review"
description: "Autonomous iterative code-review loop that audits one dimension per pass, classifies findings by blocking severity and ends with a release-readiness verdict."
trigger_phrases:
  - "deep review"
  - "code audit"
  - "review loop"
  - "release readiness"
  - "convergence detection"
  - "/deep:start-review-loop"
---

# deep-review

> Run an autonomous review loop that audits code one dimension at a time, stops on a convergence signal and gives you a verdict you can release against.

---

## 1. AT A GLANCE

| Aspect | What you get |
|---|---|
| **Use it for** | Multi-iteration code review that covers correctness, security, traceability and maintainability without one reviewer holding every dimension in one context window |
| **Invoke with** | `/deep:start-review-loop:auto "target"` (autonomous) or `:confirm` (approval-gated). Keyword triggers include "deep review", "code audit" and "release readiness" |
| **Works on** | Five target types: a spec folder (default), a skill package, a named agent, a spec track or an explicit file set. Pass `--dims` to limit to a subset of the four dimensions |
| **Produces** | A severity-ranked `review-report.md` with a PASS, CONDITIONAL or FAIL verdict, plus an iteration audit trail, a findings registry and a convergence dashboard under `{spec_folder}/review/` |

---

## 2. OVERVIEW

### Why This Skill Exists

A single-pass review reads the diff once and calls it done. Whatever dimension the reviewer was not thinking about that day ships unreviewed. One person holding correctness, security, maintainability and spec-traceability in one context window degrades as the window fills. The later dimensions get a worse read than the first. There is no honest stop condition, so you either keep re-reading past the point of new findings or you stop early and miss a blocker. Spec-versus-code drift goes unnoticed because nobody cross-checks the implementation against the spec on every pass. This skill dispatches a fresh agent per dimension, classifies every finding by blocking severity, gates the stop on dimension coverage plus a composite signal and ends with a verdict you can release against.

### What It Does

`deep-review` runs an autonomous multi-iteration review loop through `/deep:start-review-loop:auto`. Each iteration dispatches a fresh `@deep-review` LEAF agent that audits one review dimension, writes findings to an iteration file and appends a JSONL record with severity-weighted scores. Every P0 finding runs through an adversarial re-read (Hunter, Skeptic, Referee) before it enters the active registry. A reducer updates the strategy, dashboard and findings registry after each pass. The loop stops when a three-signal composite vote clears the convergence threshold and a nine-gate legal-stop bundle passes, or when a P0 override forces another round.

It does not investigate outward knowledge (`deep-research`), map inward code before planning (`deep-context`) or compare competing plans (`deep-ai-council`). A single-pass review is `sk-code-review`; this skill is the multi-iteration, convergence-gated loop. All four sibling loops share the `deep-loop-runtime`.

---

## 3. QUICK START

**Step 1: Invoke it.** Pick your mode. Autonomous runs straight through with no gates. Confirm asks for approval at setup, each iteration and synthesis.

```bash
/deep:start-review-loop:auto "spec my-feature"
/deep:start-review-loop:confirm "skill deep-review"
```

**Step 2: Run the primary workflow.** The command YAML initializes the review packet, dispatches iterations, evaluates convergence and synthesizes the verdict.

```bash
/deep:start-review-loop:auto "skill deep-review" --max-iterations 6 --convergence 0.08 --dims correctness,security
```

Expected output: a converged review report at `{spec_folder}/review/review-report.md` with findings ranked by severity, a PASS/CONDITIONAL/FAIL verdict and an iteration audit trail under `{spec_folder}/review/iterations/`.

**Step 3: Verify the reducer output after the loop finishes.**

```bash
node .opencode/skills/deep-review/scripts/reduce-state.cjs <spec-folder>
```

Expected output: a JSON summary with `registryPath`, `dashboardPath`, `iterationsCompleted`, `findings` and convergence fields.

---

## 4. HOW IT WORKS

### The Iteration Lifecycle

The command YAML workflow owns dispatch. It initializes the review packet on first run, then loops: check convergence, dispatch the `@deep-review` LEAF agent for one iteration, wait for the write-back, run the reducer and decide whether to continue or stop. Each iteration is a single LEAF dispatch with a per-iteration tool-call budget. The agent audits one dimension, writes a numbered iteration markdown file, appends a JSONL delta record and returns. It never dispatches sub-agents, never nests another loop and never asks the user a question.

Four review dimensions exist: correctness and security are required for coverage; traceability and maintainability are not. The strategy tracks which dimensions have been covered and steers the next focus.

### Severity and Verdicts

Every finding carries a severity that weights it for the convergence vote and determines the final verdict.

| Severity | Weight | What it means | Effect on verdict |
|---|---|---|---|
| **P0** | 10 | Correctness failure, security vulnerability or spec contradiction | Blocks PASS. Any active P0 makes the verdict FAIL. |
| **P1** | 5 | Degraded behavior, incomplete implementation or missing validation | Triggers CONDITIONAL when P0 is zero. |
| **P2** | 1 | Style, naming or documentation | Rides as a PASS advisory. |

PASS means no active P0 or P1. CONDITIONAL means P0 is zero and P1 is present. FAIL means any active P0 or a required gate failed. PASS routes to `/create:changelog`. FAIL and CONDITIONAL route to `/speckit:plan`.

Every P0 enters the active findings registry only after a Hunter, Skeptic, Referee re-read that checks whether the finding survives adversarial scrutiny.

### Convergence Detection

Convergence is a three-signal weighted vote. Rolling Average carries weight 0.30, MAD Noise Floor carries 0.25 and Dimension Coverage carries 0.45. The loop stops only when the weighted score clears the composite stop score (default 0.60) and then the legal-stop bundle (nine gates) all pass.

Key defaults: `maxIterations` 7, `convergenceThreshold` 0.10, `stuckThreshold` 2. The convergence threshold is tuned per sibling and is not interchangeable: deep-review uses 0.10, deep-research uses 0.05. A P0 override raises the new-findings ratio so that any fresh P0 forces at least one more iteration regardless of the other signals. The full signal math lives in `references/convergence/convergence.md`.

### Externalized State

All continuity lives in packet files under `{spec_folder}/review/`, not in conversation memory. The config file holds settings. The append-only JSONL log records every iteration, event and convergence signal. The findings registry indexes every finding with its severity and status. The strategy file tracks dimension coverage, what worked and what needs another pass. The dashboard shows convergence trends. The reducer owns the strategy sections, the registry and the dashboard. The agent writes only iteration files and JSONL records. The workflow owns the canonical `review-report.md`.

Because state is on disk, a crashed or paused run resumes from the packet files. Re-invoke the command and the workflow picks up the active lineage.

### Fan-Out

Optional parallel lineages run through the `--executor` / `--executors` / `--concurrency` flags. Lineages merge with strongest-restriction semantics: any lineage with an active P0 makes the merged verdict FAIL.

---

## 5. INTEGRATION & NAVIGATION

### When To Use This Skill

Run `deep-review` after implementation when you want a convergence-gated audit that covers multiple dimensions. Run it when a spec folder exists and you need to check whether the code matches the spec. Run it when you want the review to run unattended and stop itself.

Skip it for a quick single-pass review, where `sk-code-review` is faster. Skip it for inward code mapping (`deep-context`), outward investigation (`deep-research`) or strategy comparison (`deep-ai-council`).

### Sibling Deep Loops

`deep-review` shares the `deep-loop-runtime` with three sibling skills. Each owns a different phase and none crosses into another's territory.

| Skill | Relationship |
|---|---|
| `deep-research` | Investigates outward knowledge with web access. `deep-review` audits code only with no web access. |
| `deep-context` | Maps inward code before planning. Run it before `/speckit:plan`. Run `deep-review` after implementation. |
| `deep-ai-council` | Compares competing plans with structured disagreement. Run `deep-review` first when the council needs a quality baseline. |

`/speckit:plan` and `/speckit:implement` consume the review report. `system-spec-kit` owns the spec folder, validation and memory continuity. `deep-loop-runtime` provides the shared executor, state layer and coverage graph.

---

## 6. TROUBLESHOOTING

| What you see | Why | Fix |
|---|---|---|
| Loop runs to max iterations without converging | The threshold is too tight or the target has real structural issues | Raise `--convergence` and re-run with auto-resume |
| P0 keeps blocking convergence | A real P0 survived the adversarial check, or a P1 was misclassified up | Read the Hunter/Skeptic/Referee output in the iteration file |
| Loop stuck on one dimension | The strategy next-focus is not advancing | Inspect `deep-review-strategy.md` |
| `review-report.md` missing sections | Synthesis was interrupted | Re-run synthesis. JSONL state is intact. |
| Reducer refuses to write derived state | `reduce-state.cjs` detected JSONL corruption | Repair the line or pass `--lenient` |
| Packet resumes when you expected a new run | An active lineage exists in the config | Inspect `deep-review-config.json` for the current `sessionId`. Archive the existing `review/` tree and pass `--restart`. |
| Loop will not continue after pause | The pause file is still present | Remove `{spec_folder}/review/.deep-review-pause` and re-invoke the command |

---

## 7. FAQ

**Q: How does deep-review differ from `sk-code-review`?**

A: `sk-code-review` is a single-pass review that runs once on a diff. `deep-review` is a multi-iteration loop that dispatches a fresh agent per dimension, externalizes state to disk and stops on a convergence signal. Use `sk-code-review` for a quick pass. Use `deep-review` when you want dimension coverage, severity-weighted findings and a release-readiness verdict.

**Q: What does a FAIL verdict mean and what do I do next?**

A: FAIL means at least one active P0 finding (correctness failure, security vulnerability or spec contradiction) survived adversarial scrutiny, or a required quality gate failed. The review report lists every P0 with its evidence. Fix the blockers and re-run. FAIL routes to `/speckit:plan` so you can re-plan the fix.

**Q: How do I review a single file set or a skill?**

A: Pass the target directly.

```bash
/deep:start-review-loop:auto "files src/auth/"
/deep:start-review-loop:auto "skill deep-review"
```

The five target types are a spec folder, a skill, an agent, a track and a file set.

**Q: Why does each iteration get a fresh agent?**

A: A shared context window fills with stale findings that degrade review quality across a long session. By dispatching a fresh LEAF agent per iteration and externalizing state to disk, every round starts with a clean window. The agent reads only the current strategy, dimension focus and prior findings, then writes back. Nothing lingers.

**Q: How do I pause a running loop?**

A: Create a pause sentinel file at `{spec_folder}/review/.deep-review-pause`. The workflow checks for it before dispatching the next iteration and stops cleanly. Remove the file and re-invoke the command to resume.

---

## 8. VERIFICATION

The skill ships two validation packages. You can also check that this document passes structural validation.

### Feature Catalog

The `feature_catalog/` covers every capability across four categories: loop lifecycle, state management, review dimensions and severity system. Each category documents inputs, outputs, the owning resource and acceptance criteria.

### Manual Testing Playbook

Deterministic scenarios under `manual_testing_playbook/` cover entry points and modes, initialization, iteration execution, convergence and recovery, pause and resume, synthesis and guardrails, command-flow stress tests, review-depth rollout and fan-out. Preconditions, expected signals and pass, fail or partial verdict rules are defined in the root playbook.

```bash
python3 .opencode/skills/sk-doc/scripts/validate_document.py .opencode/skills/deep-review/README.md --type readme
```

Expected output: zero issues reported.

---

## 9. RELATED DOCUMENTS

| Document | Purpose |
|---|---|
| [`SKILL.md`](./SKILL.md) | Runtime instructions, the smart router, the rules and the full operating contract |
| [`references/protocol/quick_reference.md`](./references/protocol/quick_reference.md) | One-page operator cheat sheet with commands, parameters and state files |
| [`references/protocol/loop_protocol.md`](./references/protocol/loop_protocol.md) | Four-phase lifecycle, dispatch contract and executor invariants |
| [`references/protocol/loop_state_and_gates.md`](./references/protocol/loop_state_and_gates.md) | State transitions, error handling and binary quality gates |
| [`references/convergence/convergence.md`](./references/convergence/convergence.md) | The convergence math, signals and legal-stop gates |
| [`references/convergence/convergence_signals.md`](./references/convergence/convergence_signals.md) | Rolling average, noise floor, dimension coverage and stuck count |
| [`references/convergence/convergence_recovery.md`](./references/convergence/convergence_recovery.md) | Stuck recovery, recovery strategy selection and escalation |
| [`references/state/state_format.md`](./references/state/state_format.md) | Packet file hub with owners, mutability rules and navigation |
| [`references/state/state_jsonl.md`](./references/state/state_jsonl.md) | Config, iteration, event, lineage and blocked-stop JSONL record types |
| [`references/state/state_outputs.md`](./references/state/state_outputs.md) | Strategy, iteration markdown, report, dashboard and resource-map outputs |
| [`references/state/state_reducer_registry.md`](./references/state/state_reducer_registry.md) | Reducer ownership, findings registry, validation and file protection |
| [`assets/review_mode_contract.yaml`](./assets/review_mode_contract.yaml) | Single source of truth for dimensions, severities, verdicts, gates and lifecycle modes |
| [`scripts/reduce-state.cjs`](./scripts/reduce-state.cjs) | The state reducer that owns registry, dashboard and strategy derived fields |
| [`scripts/runtime-capabilities.cjs`](./scripts/runtime-capabilities.cjs) | Machine-readable runtime capability lookup |
| [`feature_catalog/`](./feature_catalog/) | Feature inventory across loop lifecycle, state management, review dimensions and severity system |
| [`manual_testing_playbook/`](./manual_testing_playbook/) | Deterministic scenarios with preconditions, expected signals and per-feature execution contracts |
