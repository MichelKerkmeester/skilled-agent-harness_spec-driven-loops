---
title: "deep-review"
description: "Autonomous review loop that audits one dimension per iteration with fresh context, classifies every finding by blocking severity and ends with a release-readiness verdict."
trigger_phrases:
  - "deep review"
  - "code audit"
  - "review loop"
  - "release readiness"
  - "convergence detection"
  - "/deep:review"
version: 1.11.0.34
---

# deep-review

> Run an autonomous review loop that audits one dimension per pass with fresh context, classifies every finding by blocking severity and ends with a release-readiness verdict that routes the next command.

---

## 1. AT A GLANCE

| Aspect | What you get |
|---|---|
| **Use it for** | Multi-pass code audit where each dimension gets a fresh agent, findings carry blocking severity and the loop stops on a convergence signal |
| **Invoke with** | `/deep:review:auto "target"` (autonomous) or `:confirm` (approval-gated). Keyword triggers include "deep review", "code audit" and "review loop" |
| **Works on** | Five target types: a spec folder, a skill package, a named agent, a spec track or an explicit file set |
| **Produces** | A release-readiness verdict (PASS, CONDITIONAL or FAIL) with a full findings registry, a dashboard, an iteration audit trail and a nine-section review report under `{spec_folder}/review/` |

---

## 2. OVERVIEW

### Why This Skill Exists

A single-pass review reads the diff once and calls it done. Whichever dimension the reviewer was not thinking about that day ships unreviewed. One reviewer holding correctness, security, maintainability and spec alignment in one context window degrades as the window fills. The later dimensions get a worse read than the first. There is no honest stop condition, so you keep re-reading past the point of new findings or stop early and miss a blocker. Spec-versus-code drift goes unnoticed because nobody cross-checks the implementation against the spec on every pass. This skill dispatches a fresh agent per dimension, classifies every finding by blocking severity, gates the stop on a weighted convergence signal and ends with a verdict you can release against.

### What It Does

`deep-review` runs an autonomous multi-iteration review loop through `/deep:review:auto`. Each iteration dispatches a fresh `@deep-review` LEAF agent that reads accumulated state from disk, audits one review dimension, writes findings to an iteration file and appends a JSONL delta record. A reducer updates the strategy, findings registry and dashboard after each pass. The loop stops when a composite convergence signal clears and nine legal-stop gates pass, producing a release-readiness verdict. PASS routes to changelog creation. FAIL and CONDITIONAL route to remediation planning.

It does not investigate outward knowledge (`deep-research`), map inward code before planning (`deep-context`), compare competing plans (`deep-ai-council`) or run evaluator-first improvement lanes (`deep-improvement`). A single-pass review is `sk-code-review`. The five top-level deep-loop personas share the `deep-loop-runtime` for executors, state handling and coverage graphs.

---

## 3. QUICK START

**Step 1: Invoke it.** Pick your mode. Autonomous runs straight through with no gates. Confirm asks for approval at each iteration.

```bash
/deep:review:auto "skill deep-review"
/deep:review:confirm "specs/005-memory"
```

The target can be a spec folder path, a skill name, an agent name, a track name or a file set.

**Step 2: Run the primary workflow.** The command YAML initializes the packet, dispatches iterations, evaluates convergence and synthesizes the report.

```bash
/deep:review:auto "track skilled-agent-orchestration" --max-iterations 10 --convergence 0.05
```

Expected output: a review report at `{spec_folder}/review/review-report.md` with a verdict, the active findings registry, remediation workstreams and an audit appendix. Iteration files live under `{spec_folder}/review/iterations/`.

**Step 3: Verify the reducer output after the loop finishes.**

```bash
node .opencode/skills/deep-loop-workflows/deep-review/scripts/reduce-state.cjs <spec-folder>
```

Expected output: a JSON summary with `registryPath`, `dashboardPath`, `iterationsCompleted`, `findings` and convergence fields.

---

## 4. HOW IT WORKS

### Iteration Lifecycle

The command YAML workflow owns dispatch. It initializes the review packet on first run, then loops: check convergence, dispatch the `@deep-review` LEAF agent for one iteration, wait for the write-back, run the reducer and decide whether to continue or stop. Each iteration audits one review dimension. The agent reads the current strategy, audit focus and prior findings from disk, executes review actions, writes a numbered iteration markdown file, appends a JSONL delta record and returns. It never dispatches sub-agents, never nests another loop and never asks the user a question.

The four review dimensions are correctness, security, traceability and maintainability. Correctness and security are required for coverage before the loop can stop. Traceability and maintainability are not required but are audited when configured.

### Severity Classification and Verdicts

Every finding carries a blocking severity. P0 (weight 10) is a correctness failure, security vulnerability or spec contradiction and blocks a PASS verdict. P1 (weight 5) is degraded behavior, incomplete implementation or missing validation and triggers a CONDITIONAL verdict. P2 (weight 1) is style, naming or documentation gaps and rides as a PASS advisory.

The loop ends with one of three verdicts. **FAIL** means an active P0 remains or a legal-stop gate failed at terminal stop time. **CONDITIONAL** means no P0 remains but P1 findings still need attention. **PASS** means zero active P0 and P1 findings. PASS routes to `/create:changelog`. FAIL and CONDITIONAL route to `/speckit:plan` for remediation.

### Externalized State

All continuity lives in packet files under `{spec_folder}/review/`, not in conversation memory. The config file (`deep-review-config.json`) holds settings and is immutable after init. The append-only JSONL log (`deep-review-state.jsonl`) records every iteration, event and convergence signal. The strategy file (`deep-review-strategy.md`) tracks dimension coverage, findings and the next audit focus. The findings registry (`deep-review-findings-registry.json`) indexes every discovery. The dashboard (`deep-review-dashboard.md`) shows convergence trends. The reducer machine-owns the strategy sections, the registry and the dashboard. The agent writes only iteration files and JSONL records. The workflow owns the canonical `review-report.md`.

Because state is on disk, a crashed run resumes from the packet files. Use `/deep:review:auto` again and the workflow picks up the active lineage.

### Convergence Detection

Convergence is a three-signal weighted vote: Rolling Average (0.30) evaluates the last two severity-weighted finding yields, MAD Noise Floor (0.25) tests the latest ratio against statistical noise and Dimension Coverage (0.45) checks that every configured dimension has been audited. When the weighted stop score clears the composite threshold (default 0.60), the loop enters the legal-stop gate bundle.

Nine gates must all pass before STOP is legal. The bundle covers finding stability, dimension coverage, P0 resolution, evidence density, hotspot saturation, claim adjudication, fix-completeness replay, candidate coverage and graphless fallback. If any gate fails the loop persists a `blocked_stop` event and continues with a recovery focus. A P0 override raises the new-findings ratio so any fresh P0 finding forces at least one more iteration regardless of the other signals.

### Adversarial Self-Check

Every P0 finding runs through a Hunter, Skeptic, Referee re-read before it enters the active findings registry. The agent re-reads the cited code, verifies the finding is not inference-only and confirms the source evidence. Findings that fail this check are downgraded with a rationale recorded in the iteration narrative.

---

## 5. INTEGRATION & NAVIGATION

### When To Use This Skill

Run `deep-review` when you need a multi-pass audit where each dimension gets a dedicated agent and the stop condition is gated rather than guessed. Run it before a release to get a verdict you can ship against. Run it when you want the review to run unattended. Run it after `deep-context` mapped the codebase and `speckit:plan` produced a plan, to audit code against that plan. Run it when you want a convergence-gated review loop that stops when findings run dry instead of when you decide to call it.

Skip it for a single-pass review, where `sk-code-review` is faster. Skip it for external investigation (`deep-research`), inward code mapping (`deep-context`) or strategy comparison (`deep-ai-council`).

### Sibling Deep Loops

`deep-review` shares the `deep-loop-runtime` with four sibling personas. Each owns a different phase and none crosses into another's territory.

| Skill | Relationship |
|---|---|
| `deep-research` | Investigates outward knowledge with web access. `deep-review` audits inward code with no web access. |
| `deep-context` | Maps existing code, patterns and integration points before planning. Run it before `deep-review` when the codebase is unfamiliar. |
| `deep-ai-council` | Compares competing plans with structured disagreement. Run it before implementation, then `deep-review` after. |
| `deep-improvement` | Runs evaluator-first improvement across four lanes: agent improvement, model benchmark, skill benchmark and AI-system improvement. |

`sk-code-review` handles a single-pass review with no convergence gating. `deep-review` is the multi-iteration loop. `system-spec-kit` owns the spec folder, validation and memory continuity.

---

## 6. TROUBLESHOOTING

| What you see | Why | Fix |
|---|---|---|
| Loop runs to max iterations without converging | The threshold is too tight or the target has real structural issues | Raise `--convergence` and re-run with auto-resume |
| P0 keeps blocking convergence | A real P0 survived the adversarial check, or a P1 was misclassified up | Read the Hunter/Skeptic/Referee output in the iteration file |
| Loop stuck on one dimension | The strategy next-focus is not advancing | Inspect `deep-review-strategy.md` |
| `review-report.md` missing sections | Synthesis was interrupted | Re-run synthesis. JSONL state is intact. |
| Reducer refuses to write derived state | `reduce-state.cjs` detected JSONL corruption | Repair the line or pass `--lenient` |
| Packet resumes when you expected a new run | An active lineage exists in the config | Archive the existing `review/` tree and pass `--restart` or delete the config |
| Loop will not continue after pause | The pause file is still present | Remove `{spec_folder}/review/.deep-review-pause` and re-invoke the command |

---

## 7. FAQ

**Q: How does deep-review differ from sk-code-review?**

A: `sk-code-review` is a single-pass review that reads the diff once and reports findings with no convergence gating. `deep-review` runs multiple iterations, each with a fresh agent auditing one dimension, and stops only when the convergence signal clears and every legal-stop gate passes. It produces a full findings registry, a dashboard and a release-readiness verdict. Use `sk-code-review` for a quick PR check. Use `deep-review` when you need a gated audit with a verdict.

**Q: What does FAIL mean and what do I do next?**

A: FAIL means an active P0 finding remains at terminal stop time or a legal-stop gate failed. The P0 is a correctness failure, a security vulnerability or a spec contradiction that blocks release. The review report includes remediation workstreams grouped from the active findings. Run `/speckit:plan` to create a fix plan from those workstreams. Fix the P0s, then re-run the review loop.

**Q: How do I review a skill or a single file set?**

A: Pass the target directly. A skill review audits the skill's SKILL.md, references, assets, scripts and the files it claims to own. A file set review accepts an explicit set. Both modes run the same iteration lifecycle and produce the same verdict-bearing report.

```bash
/deep:review:auto "skill deep-research"
/deep:review:auto "files src/handler.ts,src/middleware/auth.ts,__tests__/handler.test.ts"
```

**Q: Why does each iteration get a fresh agent?**

A: A shared context window fills with stale findings that degrade reasoning quality across a long session. By dispatching a fresh LEAF agent per iteration and externalizing state to disk, every round starts with a clean window. The agent reads only the current strategy, audit focus and prior findings, then writes back. Nothing lingers.

**Q: Can I pause the loop and resume later?**

A: Yes. Place a `.deep-review-pause` sentinel file in the `review/` directory. The loop finishes the current iteration, detects the sentinel and stops. Remove the sentinel and re-invoke the command to resume. All state is on disk, so you can resume days later.

---

## 8. VERIFICATION

The skill ships two validation packages.

### Feature Catalog

The `feature_catalog/` covers every capability across its categories: loop lifecycle, state management, convergence and review output. Each category documents inputs, outputs, the owning resource and acceptance criteria.

### Manual Testing Playbook

Deterministic scenarios under `manual_testing_playbook/` cover loop lifecycle, state management, convergence and recovery and review output. Preconditions, expected signals and pass, fail or partial verdict rules are defined in the root playbook. Every scenario maps to a dedicated feature file with the canonical prompt, expected signals and live source anchors.

```bash
python3 .opencode/skills/sk-doc/scripts/validate_document.py .opencode/skills/deep-loop-workflows/deep-review/README.md --type readme
```

Expected output: zero issues reported.

---

## 9. RELATED DOCUMENTS

| Document | Purpose |
|---|---|
| [`SKILL.md`](./SKILL.md) | Runtime instructions, the smart router and the full operating contract |
| [`references/protocol/quick_reference.md`](./references/protocol/quick_reference.md) | One-page operator cheat sheet with commands, defaults, dimensions, verdicts and convergence rules |
| [`references/protocol/loop_protocol.md`](./references/protocol/loop_protocol.md) | Four-phase lifecycle, dispatch contract and executor invariants |
| [`references/protocol/loop_state_and_gates.md`](./references/protocol/loop_state_and_gates.md) | State transitions, error handling and binary quality gates |
| [`references/convergence/convergence.md`](./references/convergence/convergence.md) | Stop condition algorithms, legal-stop gates and recovery strategies |
| [`references/convergence/convergence_signals.md`](./references/convergence/convergence_signals.md) | Three-signal weighted vote, severity-weighted ratio and signal math |
| [`references/convergence/convergence_recovery.md`](./references/convergence/convergence_recovery.md) | Stuck recovery, recovery strategy selection and escalation |
| [`references/state/state_format.md`](./references/state/state_format.md) | Packet file hub with owners, mutability rules and navigation |
| [`references/state/state_jsonl.md`](./references/state/state_jsonl.md) | Config, iteration, event and blocked-stop JSONL record types |
| [`references/state/state_outputs.md`](./references/state/state_outputs.md) | Strategy, iteration markdown, report, dashboard and resource-map outputs |
| [`references/state/state_reducer_registry.md`](./references/state/state_reducer_registry.md) | Reducer ownership, findings registry, validation and reconstruction |
| [`assets/review_mode_contract.yaml`](./assets/review_mode_contract.yaml) | Single source of truth for dimensions, severities, verdicts, gates and lifecycle modes |
| [`scripts/reduce-state.cjs`](./scripts/reduce-state.cjs) | The single state reducer that updates the findings registry, dashboard and strategy |
| [`scripts/runtime-capabilities.cjs`](./scripts/runtime-capabilities.cjs) | Machine-readable capability lookup for the active runtime |
| [`assets/deep_review_config.json`](./assets/deep_review_config.json) | Config template with defaults for max iterations, convergence threshold and executor |
| [`assets/deep_review_strategy.md`](./assets/deep_review_strategy.md) | Strategy template with dimensions, coverage tracker and next-focus rotation |
| [`assets/deep_review_dashboard.md`](./assets/deep_review_dashboard.md) | Dashboard template with convergence trend and iteration summary |
| [`assets/prompt_pack_iteration.md.tmpl`](./assets/prompt_pack_iteration.md.tmpl) | The per-iteration prompt template dispatched to the LEAF agent |
| [`assets/runtime_capabilities.json`](./assets/runtime_capabilities.json) | Declared capability manifest checked at runtime for parity gate validation |
| [`feature_catalog/`](./feature_catalog/) | Feature inventory across loop lifecycle, state management, convergence and review output |
| [`manual_testing_playbook/`](./manual_testing_playbook/) | Deterministic scenarios with preconditions, expected signals and per-feature execution contracts |
