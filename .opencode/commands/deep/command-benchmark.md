---
description: "Run the command-surface benchmark through reused conformance and behavior engines. Modes :auto/:confirm."
argument-hint: "<spec-folder> [:auto|:confirm] [--axis=conformance|behavior|all] [--run-id=ID]"
allowed-tools: [Read, Bash, Grep, Glob, Task, mcp__mk_spec_memory__memory_context, mcp__mk_spec_memory__memory_search, mcp__mk_code_index__code_graph_query]
skill: system-deep-loop
---

# Deep Command-Surface Benchmark

Workflow router for the deterministic command-conformance lane and the bounded behavioral matrix. It verifies dispatch context, binds setup, selects a mode and axis, then executes owned workflow assets without implementing either benchmark engine.

## 1. ROUTER CONTRACT

This Markdown owns dispatch-context verification, the blocking input gate, input binding, mode and axis selection, and execution-target selection. Workflow execution and evidence writes belong to the YAML assets. Subject checks, verdict reduction, and matrix execution remain with their existing owners.

Load `.opencode/commands/deep/assets/deep_command-benchmark_presentation.txt` before displaying setup questions, resolved-input confirmations, checkpoints, terminal output, errors, or next steps.

### PHASE 0: DISPATCH-CONTEXT CHECK

Proceed when this file was invoked directly as the command, or by an explicit delegation naming this exact command. Stop only when there is concrete evidence that its raw contents were pasted into an unrelated worker prompt. Ambiguity is not evidence of a bad dispatch context.

### MANDATORY INPUT GATE

**STATUS: BLOCKED** until `spec_folder`, `run_id`, `axis`, and `execution_mode` are bound.

1. Parse `$ARGUMENTS`; remove the `:auto` or `:confirm` suffix and recognized flags before resolving the required positional `<spec-folder>`.
2. Treat an absent, undefined, or whitespace-only spec folder as missing. Do not infer it from conversation history, open files, screenshots, repository state, or a previously active packet.
3. When the spec folder is missing, render the presentation contract's missing-input prompt, stop, and wait for an explicit path. Use only `$ARGUMENTS` or that explicit reply.
4. Validate that the resolved path is inside `specs/` or `.opencode/specs/`. Bind `axis = all` when omitted. Bind a UTC run identifier when `--run-id` is omitted.
5. In `:confirm` or no-suffix mode, render the consolidated resolved-input prompt and wait. In `:auto`, fail fast on an invalid binding and continue only when every field is valid.

| Field | Required | Source |
|---|---:|---|
| `dispatch_context_verified` | yes | Phase 0 |
| `spec_folder` | yes | explicit positional input or explicit reply |
| `run_id` | yes | `--run-id` or UTC identifier |
| `axis` | yes | `--axis` or `all` |
| `execution_mode` | yes | suffix or confirmed choice |

If any blocking phase was skipped, stop, report the skipped phase through the presentation contract, return to it, and complete it before loading YAML.

## 2. OWNED ASSETS

| Purpose | Asset |
|---|---|
| Presentation source of truth | `.opencode/commands/deep/assets/deep_command-benchmark_presentation.txt` |
| Auto workflow | `.opencode/commands/deep/assets/deep_command-benchmark_auto.yaml` |
| Confirm workflow | `.opencode/commands/deep/assets/deep_command-benchmark_confirm.yaml` |
| Reused conformance workflow | `.opencode/commands/deep/assets/deep_alignment_auto.yaml` or `.opencode/commands/deep/assets/deep_alignment_confirm.yaml` |
| Stable conformance lane | `.opencode/skills/system-deep-loop/deep-alignment/assets/conformance_benchmark/command-surface/lane-config.json` |
| Behavioral matrix | `.opencode/skills/system-deep-loop/deep-alignment/assets/command_benchmark/command_benchmark_matrix.json` |
| Behavioral matrix scheduler | `.opencode/skills/system-deep-loop/deep-alignment/scripts/command-benchmark/run-command-behavior-matrix.cjs` |

The launcher is instrument infrastructure. It is intentionally absent from the bounded behavioral scenarios so the benchmark never measures its own dispatcher recursively; the separate hermetic launcher smoke owns that coverage.

## 3. MODE ROUTING

1. `:auto` binds `execution_mode = AUTONOMOUS`; `:confirm` binds `execution_mode = INTERACTIVE`; no suffix binds `execution_mode = ASK` until the presentation contract resolves it.
2. `--axis=conformance` selects only the pre-bound alignment target. `--axis=behavior` selects only the matrix scheduler. `--axis=all` or no axis flag selects both targets in conformance-then-behavior order.
3. Treat `<spec-folder>`, `--run-id`, and `--axis` as workflow inputs, never execution modes.
4. Load the selected mode workflow only after the blocking gate is complete.

## 4. EXECUTION TARGETS

| Mode | Workflow |
|---|---|
| `:auto` | `.opencode/commands/deep/assets/deep_command-benchmark_auto.yaml` |
| `:confirm` or interactive choice | `.opencode/commands/deep/assets/deep_command-benchmark_confirm.yaml` |

The selected workflow binds the stable lane config and executing spec folder directly into the matching alignment workflow asset. It invokes the behavioral matrix scheduler with its frozen `--matrix` and `--out-dir` interface. `all` composes the two target outputs side by side and never combines their subject results.

## 5. PRESENTATION BOUNDARY

The presentation asset exclusively owns:

- Missing-input and consolidated setup wording.
- Approval, checkpoint, and progress layouts.
- The terminal `STATUS`, `INSTRUMENT`, `CONFORMANCE`, and `BEHAVIOR` envelope.
- Evidence-layout display, error text, and next-step suggestions.

The router and workflow assets supply bound values and owner-produced evidence only. They do not synthesize presentation text or reinterpret a subject result.

## 6. WORKFLOW SUMMARY

1. Verify direct command dispatch and bind the explicit spec folder, run ID, mode, and axis.
2. Load the presentation contract and the selected auto or confirm workflow.
3. Dispatch the requested reused engine or both engines with their inputs pre-bound.
4. Preserve the frozen evidence roots, surface the native axis results separately, and render the terminal envelope from the presentation contract.
