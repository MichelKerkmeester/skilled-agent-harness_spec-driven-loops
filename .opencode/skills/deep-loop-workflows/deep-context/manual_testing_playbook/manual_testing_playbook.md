---
title: "deep-context: Manual Testing Playbook"
description: "Operator-facing reference combining the manual testing directory, integrated review/orchestration guidance, execution expectations, and per-feature validation files for the deep-context skill."
version: 1.2.0.5
---

# deep-context: Manual Testing Playbook

> **EXECUTION POLICY**: Every scenario MUST be executed for real — not mocked, not stubbed, not classified as "unautomatable". AI agents executing these scenarios must run the actual commands, inspect real files, call real handlers, and verify real outputs. The only acceptable classifications are PASS, FAIL, or SKIP (with a specific sandbox blocker documented). "UNAUTOMATABLE" is not a valid status.

This document combines the manual testing contract for the `deep-context` skill into a single reference. The root playbook acts as the directory, review protocol, and orchestration guide while the per-feature files carry the scenario-specific execution truth.

---

Canonical package artifacts:
- `manual_testing_playbook.md`
- `01--frontier-seeding/`
- `02--by-model-parallel-sweep/`
- `03--agreement-merge/`
- `04--convergence-detection/`
- `05--context-report-synthesis/`
- `06--coverage-graph-schema/`
- `07--runtime-robustness/`

---

## 1. OVERVIEW

This playbook provides 27 deterministic scenarios across 7 categories validating the current `deep-context` skill surface. Each scenario maps to a dedicated feature file with the canonical objective, prompt summary, expected signals, and live source anchors.

### REALISTIC TEST MODEL

1. Start from the operator-visible context-loop workflow, not a synthetic command matrix.
2. Validate public docs and command surfaces before deeper YAML or reducer contracts when that order matters.
3. Capture enough evidence that another operator can reproduce the verdict without re-deriving the scenario.
4. Report a concise user-facing verdict rather than raw implementation notes.

---

## 2. GLOBAL PRECONDITIONS

- `deep-context` skill exists at `.opencode/skills/deep-loop-workflows/deep-context/`.
- `/deep:context` command exists at `.opencode/commands/deep/context.md`.
- Both YAML workflows exist at `.opencode/commands/deep/assets/deep_context_auto.yaml` and `deep_context_confirm.yaml`.
- `@deep-context` agent definition exists at `.opencode/agents/deep-context.md`.
- `reduce-state.cjs` exists at `.opencode/skills/deep-loop-workflows/deep-context/scripts/reduce-state.cjs`.
- `convergence.cjs` exists at `.opencode/skills/deep-loop-runtime/scripts/convergence.cjs`.
- `coverage-graph-signals.ts` and `coverage-graph-db.ts` exist at `.opencode/skills/deep-loop-runtime/lib/coverage-graph/`.
- All referenced assets and default config files are available in the repository.

---

## 3. GLOBAL EVIDENCE REQUIREMENTS

- A PASS, PARTIAL, or FAIL verdict with reasoning.
- Evidence captured from live file contents or generated artifacts.
- Cross-source consistency checks across command entrypoint, YAML workflow, SKILL.md, and reducer/graph assets.
- The exact prompt used when orchestration behavior is part of the scenario.

---

## 4. DETERMINISTIC COMMAND NOTATION

- Use `rg`, `node --check`, and direct artifact inspection to gather deterministic evidence.
- CLI commands shown as `node <script> <args>`.
- MCP tool calls shown as `mcp_tool({ key: value })`.
- Bash commands shown as `bash: <command>`.
- Agent prompts shown as `agent: <instruction>`.
- `->` separates sequential steps.
- Follow the prescribed order so user-facing documentation is checked before lower-level workflow contracts when sequencing matters.
- Keep the final verdict tied to captured evidence instead of inferred runtime behavior.

---

## 5. REVIEW PROTOCOL AND RELEASE READINESS

### Inputs Required

1. `manual_testing_playbook.md`
2. Referenced per-feature files under `manual_testing_playbook/NN--category-name/`
3. Scenario execution evidence
4. Feature-to-scenario coverage map
5. Triage notes for all non-pass outcomes

### Scenario Acceptance Rules

For each executed scenario, check:

1. Preconditions were satisfied.
2. Prompt and command sequence were executed as written.
3. Expected signals are present.
4. Evidence is complete and readable.
5. Outcome rationale is explicit.

Scenario verdict:
- `PASS`: all acceptance checks true
- `PARTIAL`: core behavior works but non-critical evidence or metadata is incomplete
- `FAIL`: expected behavior missing, contradictory output, or critical check failed

### Feature Verdict Rules

- `PASS`: all mapped scenarios for feature are `PASS`
- `PARTIAL`: at least one mapped scenario is `PARTIAL`, none are `FAIL`
- `FAIL`: any mapped scenario is `FAIL`

Hard rule:
- Any critical-path scenario `FAIL` forces feature verdict to `FAIL`.

### Release Readiness Rule

Release is `READY` only when:

1. No feature verdict is `FAIL`.
2. All critical scenarios are `PASS`.
3. Coverage is 100% of playbook scenarios defined by the root index and backed by per-feature files.
4. No unresolved blocking triage item remains.

### Root-vs-Feature Rule

Keep global verdict logic in the root playbook. Put feature-specific acceptance caveats in the matching per-feature files.

---

## 6. SUB-AGENT ORCHESTRATION AND WAVE PLANNING

### Purpose

This section records wave planning and capacity guidance for the manual testing package.

### Operational Rules

1. Probe runtime capacity at start.
2. Reserve one coordinator.
3. Saturate remaining worker slots.
4. Pre-assign explicit scenario IDs and matching per-feature files to each wave before execution.
5. Run destructive scenarios (none in this playbook) in a dedicated sandbox-only wave.
6. After each wave, save context and evidence, then begin the next wave.
7. Record utilization table, per-feature file references, and evidence paths in the final report.

### Wave Planning Guidance

- Wave 1 covers frontier seeding (FS-001 through FS-003) and parallel sweep (SWEEP-001 through SWEEP-004).
- Wave 2 covers agreement merge (MERGE-001 through MERGE-003) and convergence detection (CONV-001 through CONV-005).
- Wave 3 covers context report synthesis (SYN-001 through SYN-003) and coverage-graph schema (CG-001 through CG-004).
- Wave 4 covers runtime robustness (RUNTIME-001 through RUNTIME-005).

### What Belongs In Per-Feature Files

- Real user request
- Prompt following the Role -> Context -> Action -> Format contract for orchestrator-driven scenarios
- Expected delegation or alternate-CLI routing
- Desired user-visible outcome
- Feature-specific acceptance caveats or isolation constraints

---

## 7. FRONTIER SEEDING (`FS-001..FS-003`)

This category covers 3 scenario summaries while the linked feature files remain the canonical execution contract.

### FS-001 | Frontier Initialization and Session Classification

#### Description
Verify that the auto YAML's `phase_init` classifies session state (fresh / resume / completed-session / invalid) before writing any files, and that a fresh session creates all canonical state artifacts from the shipped templates.

#### Scenario Contract
Prompt: As a manual-testing orchestrator, validate the session classification and state-file creation contract for `deep-context` against the command entrypoint, auto YAML, and asset templates. Verify `step_classify_session` inspects `deep-context-config.json`, `deep-context-state.jsonl`, and `deep-context-strategy.md` before writing, and that fresh sessions create those files from the default templates. Return a concise user-facing pass/fail verdict with the key evidence.

Expected signals: `step_classify_session` is named in the auto YAML; fresh/resume/completed-session/invalid outcomes are documented in `context.md` or SKILL.md; asset templates exist at `assets/deep_context_config.json`.

Desired user-visible outcome: the command creates all three state files on a fresh run and skips init writes on a valid resume.

#### Test Execution
> **Feature File:** [FS-001](01--frontier-seeding/frontier-initialization.md)

---

### FS-002 | Scope Binding and Code-Graph Seeding

#### Description
Verify that `step_seed_frontier` extracts anchors from the supplied scope and expands them via `code_graph_query` into ranked SLICE nodes before the first sweep.

#### Scenario Contract
Prompt: As a manual-testing orchestrator, validate the scope-binding and frontier-seeding contract for `deep-context` against the command entrypoint, auto YAML, SKILL.md, and loop_protocol.md. Verify `step_seed_frontier` calls `code_graph_query` with 2-5 word concept descriptions from the scope and falls back to Glob+Grep when the graph is stale. Verify the result is written to `deep-context-strategy.md`. Return a concise user-facing verdict.

Expected signals: `step_seed_frontier` appears in the auto YAML; `code_graph_query` is the seeding tool in SKILL.md §3 and loop_protocol.md §4; Glob+Grep fallback is documented; strategy.md receives the frontier before `phase_loop`.

Desired user-visible outcome: the strategy file contains seeded SLICE anchors from the scope before the first parallel sweep runs.

#### Test Execution
> **Feature File:** [FS-002](01--frontier-seeding/scope-binding-and-code-graph-seeding.md)

---

### FS-003 | Config Shape and Default Pool

#### Description
Verify that `step_create_config` writes the correct config fields from the `deep_context_config.json` template, including the default heterogeneous executor pool and all threshold defaults.

#### Scenario Contract
Prompt: As a manual-testing orchestrator, validate the config shape and default pool contract for `deep-context` against the command entrypoint, auto YAML, asset template, and SKILL.md quick reference. Verify `deep_context_config.json` defines the default pool (2 native + MiMo + gpt + deepseek), `relevanceGate: 0.55`, `agreementMin: 2`, `maxIterations: 8`, `convergenceThreshold: 0.10`, and `fanout.mode: "by-model-shared-scope"`. Return a concise verdict.

Expected signals: `assets/deep_context_config.json` is present with correct field names; SKILL.md §8 quick reference matches the config defaults; the command's default resolution table in `context.md` aligns with the config template.

Desired user-visible outcome: fresh sessions always produce a config file whose defaults match the documented thresholds and the default heterogeneous pool.

#### Test Execution
> **Feature File:** [FS-003](01--frontier-seeding/config-shape-and-default-pool.md)

---

## 8. BY-MODEL PARALLEL SWEEP (`SWEEP-001..SWEEP-004`)

This category covers 5 scenario summaries while the linked feature files remain the canonical execution contract.

### SWEEP-001 | Heterogeneous Pool Dispatch

#### Description
Verify that `step_parallel_sweep` launches `step_sweep_native_batch` and `step_sweep_cli_pool` together without waiting for either, then barrier-joins all seats before merge.

#### Scenario Contract
Prompt: As a manual-testing orchestrator, validate the heterogeneous pool dispatch contract for `deep-context` against the auto YAML, loop_protocol.md, and SKILL.md §3. Verify `step_parallel_sweep` names both `step_sweep_native_batch` and `step_sweep_cli_pool` as concurrent sub-steps and that the auto YAML includes a barrier-join before `step_merge_findings`. Return a concise user-facing verdict.

Expected signals: `step_parallel_sweep` with both sub-steps appears in the auto YAML; SKILL.md §3 describes "barrier-join" for the sweep; loop_protocol.md §5 describes both seat groups starting together.

Desired user-visible outcome: native and CLI seats start simultaneously each iteration and the host only merges after all seats have returned.

#### Test Execution
> **Feature File:** [SWEEP-001](02--by-model-parallel-sweep/heterogeneous-pool-dispatch.md)

---

### SWEEP-002 | Native Task Batch

#### Description
Verify that `step_sweep_native_batch` dispatches all native `@deep-context` seats in a single parallel Task batch, each receiving the four-part lineage contract, and that the agent definition enforces the LEAF read-only boundary.

#### Scenario Contract
Prompt: As a manual-testing orchestrator, validate the native Task batch dispatch contract for `deep-context` against the auto YAML, the `@deep-context` agent definition, and loop_protocol.md. Verify `step_sweep_native_batch` dispatches a parallel Task batch (not sequential), each seat receives gather-subject + scope/slice + known-context + output schema, and the agent is LEAF-only (no writes, no sub-agent dispatch). Return a concise verdict.

Expected signals: `agent: deep-context` appears in the auto YAML's native batch step; `.opencode/agents/deep-context.md` has `task: deny` and `write: deny` in its permissions; loop_protocol.md §5 describes native seats as a single concurrent batch.

Desired user-visible outcome: native seats run concurrently as a parallel batch and return structured findings to the host without writing any merged state.

#### Test Execution
> **Feature File:** [SWEEP-002](02--by-model-parallel-sweep/native-task-batch.md)

---

### SWEEP-003 | CLI Council Seats

#### Description
Verify that `step_sweep_cli_pool` uses `multi-seat-dispatch.cjs#dispatchCouncilSeats` to fan CLI seats out concurrently, with correct per-kind dispatch flags including closed stdin for cli-opencode.

#### Scenario Contract
Prompt: As a manual-testing orchestrator, validate the CLI council seats dispatch contract for `deep-context` against the auto YAML, loop_protocol.md, and SKILL.md §4 ALWAYS rules. Verify cli-opencode seats use `</dev/null` for closed stdin and omit top-level `--agent`; cli-opencode seats use `--sandbox read-only`; and `multi-seat-dispatch.cjs` provides `dispatchCouncilSeats`. Return a concise verdict.

Expected signals: `multi-seat-dispatch.cjs` referenced in loop_protocol.md §5; SKILL.md ALWAYS rule 5 mandates cli-* contract compliance including `</dev/null`; `dispatchCouncilSeats` export exists in the file.

Desired user-visible outcome: CLI seats are dispatched concurrently and read-only, with per-kind flags enforced by the dispatch scaffold.

#### Test Execution
> **Feature File:** [SWEEP-003](02--by-model-parallel-sweep/cli-council-seats.md)

---

### SWEEP-004 | Per-Model Prompt Framework

#### Description
Verify that `step_render_seat_prompts` applies per-seat prompt frameworks (MiMo → COSTAR, MiniMax/DeepSeek → TIDD-EC, native → none) and that the four-part lineage contract is mandatory in every rendered prompt.

#### Scenario Contract
Prompt: As a manual-testing orchestrator, validate the per-model prompt framework application for `deep-context` against the command entrypoint, auto YAML, SKILL.md, and sk-prompt-models references. Verify MiMo seats use COSTAR, DeepSeek and MiniMax seats use TIDD-EC, native seats carry no framework, and every seat prompt includes all four lineage contract fields. Return a concise verdict.

Expected signals: SKILL.md ALWAYS rule 3 mandates `sk-prompt-models` per seat; `context.md` shows per-seat `promptFramework` field in the executor JSON schema; the four-part contract is documented in loop_protocol.md §5.

Desired user-visible outcome: seat prompts are rendered with the correct model-specific framing before dispatch, ensuring small-model seats receive structured guidance rather than generic analysis instructions.

#### Test Execution
> **Feature File:** [SWEEP-004](02--by-model-parallel-sweep/per-model-prompt-framework.md)

---

## 9. AGREEMENT MERGE (`MERGE-001..MERGE-003`)

This category covers 4 scenario summaries while the linked feature files remain the canonical execution contract.

### MERGE-001 | Finding Dedup by Symbol

#### Description
Verify that `step_merge_findings` computes `unit_id = sha256(path:symbol:kind)` for deduplication, unions per-executor attribution into `producedBy`, and marks findings as agreement-eligible when `agreement >= agreementMin`.

#### Scenario Contract
Prompt: As a manual-testing orchestrator, validate the finding deduplication contract for `deep-context` against the auto YAML, reduce-state.cjs, loop_protocol.md §6, and SKILL.md §3. Verify `unit_id = sha256(path:symbol:kind)` is the dedup key, `producedBy` unions distinct seat labels, and `agreement >= config.agreementMin` (default 2) marks a finding as agreement-eligible. Also verify `node --check` passes on `reduce-state.cjs`. Return a concise verdict.

Expected signals: `sha256` and `unitId` appear in `reduce-state.cjs`; `producedBy` and `agreement` are fields in the registry schema; `DEFAULT_AGREEMENT_MIN = 2` constant exists; `node --check .opencode/skills/deep-loop-workflows/deep-context/scripts/reduce-state.cjs` exits 0.

Desired user-visible outcome: findings from multiple seats for the same `file:symbol:kind` are merged into a single unit with cross-executor attribution and a correct agreement count.

#### Test Execution
> **Feature File:** [MERGE-001](03--agreement-merge/finding-dedup-by-symbol.md)

---

### MERGE-002 | Cross-Executor Agreement

#### Description
Verify that the relevance gate drops below-threshold findings to a `lowConfidence` bucket, that marginal near-misses [0.40, 0.55) route to the report's Gaps section, and that surviving agreement-eligible findings drive the saturation check.

#### Scenario Contract
Prompt: As a manual-testing orchestrator, validate the cross-executor agreement and relevance-gate contract for `deep-context` against reduce-state.cjs, loop_protocol.md §6, and convergence.md §6. Verify `DEFAULT_RELEVANCE_GATE = 0.55` is in reduce-state.cjs, below-gate units go to a `lowConfidence` bucket (not discarded), and `new_agreement_eligible_count` drives the per-iteration saturation check. Return a concise verdict.

Expected signals: `DEFAULT_RELEVANCE_GATE = 0.55` constant in `reduce-state.cjs`; `lowConfidence` bucket populated when relevance is below gate; loop_protocol.md §6 documents marginal range and Gaps routing; convergence.md references `new_agreement_eligible_count` or equivalent saturation signal.

Desired user-visible outcome: relevance-gated findings are excluded from convergence decisions while near-misses remain accessible in the report's Gaps section.

#### Test Execution
> **Feature File:** [MERGE-002](03--agreement-merge/cross-executor-agreement.md)

---

### MERGE-003 | Contradiction Surfacing

#### Description
Verify that contradictions between seats (incompatible signatures or reuse verbs for the same `unit_id`) are detected, recorded as `CONTRADICTS` pairs, and surfaced in the findings registry — never silently resolved.

#### Scenario Contract
Prompt: As a manual-testing orchestrator, validate the contradiction surfacing contract for `deep-context` against reduce-state.cjs, loop_protocol.md §6, and the dashboard rendered by the reducer. Verify `detectContradictions()` in reduce-state.cjs surfaces incompatible `signatureByProducer` or `reuseByProducer` values for the same unit_id, the `contradictions` array is present in `findings-registry.json`, and the dashboard section renders all active contradiction pairs. Return a concise verdict.

Expected signals: `detectContradictions` function exported from `reduce-state.cjs`; `contradictions` key in registry; dashboard section "CONTRADICTIONS (surfaced, never auto-resolved)" exists in `renderDashboard`; loop_protocol.md §6 states contradictions are never silently resolved.

Desired user-visible outcome: when two seats report incompatible contracts for the same `file:symbol`, the host surfaces both sides for operator review rather than choosing one silently.

#### Test Execution
> **Feature File:** [MERGE-003](03--agreement-merge/contradiction-surfacing.md)

---

## 10. CONVERGENCE DETECTION (`CONV-001..CONV-005`)

This category covers 4 scenario summaries while the linked feature files remain the canonical execution contract.

### CONV-001 | Context Coverage Signals

#### Description
Verify that `coverage-graph-signals.ts` exports `ContextConvergenceSignals` with all five fields and that `computeContextSignals` (or `computeContextSignalsFromData`) is present and returns the correct structure.

#### Scenario Contract
Prompt: As a manual-testing orchestrator, validate the context coverage signals contract for `deep-context` against `coverage-graph-signals.ts`, `convergence.md` §2, and SKILL.md §8 quick reference. Verify `ContextConvergenceSignals` interface has `sliceCoverage`, `reuseCatalogCoverage`, `agreementRate`, `relevanceFloor`, and `dependencyCompleteness`; `computeContextSignalsFromData` is exported; and the signal roles match those documented in `convergence.md`. Return a concise verdict.

Expected signals: `ContextConvergenceSignals` interface with all five fields in `coverage-graph-signals.ts`; `computeContextSignalsFromData` export; vacuous-pass behavior (1.0 when kind absent) documented in convergence.md §2; SKILL.md §8 lists the same signals.

Desired user-visible outcome: the convergence engine evaluates five distinct signals from the live coverage graph and each signal vacuously passes when its node kind is absent, preventing false-positive STOP_BLOCKED outcomes.

#### Test Execution
> **Feature File:** [CONV-001](04--convergence-detection/context-coverage-signals.md)

---

### CONV-002 | Relevance Gate

#### Description
Verify that `step_check_convergence` in the auto YAML only accepts STOP when both `host_saturated` (low_progress_streak >= K consecutive iterations) AND `graph_decision == "STOP_ALLOWED"`, and that `STOP_BLOCKED` forces `CONTINUE`.

#### Scenario Contract
Prompt: As a manual-testing orchestrator, validate the relevance gate and stop-acceptance contract for `deep-context` against the auto YAML `step_check_convergence`, `convergence.md` §4, and SKILL.md §6 quality gates. Verify STOP requires both `host_saturated` and `graph_decision == "STOP_ALLOWED"`; `STOP_BLOCKED` records blocker names and forces CONTINUE; blocking conditions include `sliceCoverage < 0.70`, `relevanceFloor < 0.50`, and `agreementRate < 0.50`. Return a concise verdict.

Expected signals: `step_check_convergence` in auto YAML combines host saturation and graph decision; `convergence.md` §4 lists the three STOP_BLOCKED conditions with exact threshold values; SKILL.md §6 lists `relevanceFloor >= 0.50` as a quality gate.

Desired user-visible outcome: the loop continues when the collected context is noisy or tangentially relevant, even if raw iteration count suggests saturation.

#### Test Execution
> **Feature File:** [CONV-002](04--convergence-detection/relevance-gate.md)

---

### CONV-003 | Agreement Gate

#### Description
Verify that the agreement gate (`agreementRate < 0.50` → `STOP_BLOCKED`) is enforced by `convergence.cjs`, and that a 1-seat pool triggers the documented warning about no agreement signal.

#### Scenario Contract
Prompt: As a manual-testing orchestrator, validate the agreement gate contract for `deep-context` against `convergence.cjs` (via `--loop-type context`), `convergence.md` §4, and `context.md` pool resolution notes. Verify `convergence.cjs --loop-type context` exits 0 with a parseable JSON output structure; `convergence.md` §4 shows `agreementRate < 0.50` as a STOP_BLOCKED condition; the command documents the 1-seat pool warning. Return a concise verdict.

Expected signals: `node --check .opencode/skills/deep-loop-runtime/scripts/convergence.cjs` exits 0; `convergence.md` §4 lists `agreementRate < 0.50` → STOP_BLOCKED; `context.md` notes "1-seat pool is legal but defeats the purpose (no agreement signal)".

Desired user-visible outcome: the loop does not converge when only a single executor has confirmed findings, ensuring agreement-confidence is a hard requirement for stopping.

#### Test Execution
> **Feature File:** [CONV-003](04--convergence-detection/agreement-gate.md)

---

### CONV-004 | Evaluate Context via Convergence Script

#### Description
Verify that `convergence.cjs --loop-type context` runs without error, accepts `--spec-folder`, `--session-id`, `--iteration` arguments, and emits a parseable JSON result with `decision`, `signals`, and `blockers`.

#### Scenario Contract
Prompt: As a manual-testing orchestrator, validate the `convergence.cjs --loop-type context` invocation contract for `deep-context` against the script's CLI argument handling and the YAML's `step_graph_convergence`. Verify the script parses `--loop-type context`, `--spec-folder`, and `--session-id` flags; exits 0 on valid input with a `decision` field; exits 1/2/3 on error/DB/input-validation failures. Run `node --check` on the script. Return a concise verdict.

Expected signals: `node --check .opencode/skills/deep-loop-runtime/scripts/convergence.cjs` exits 0; `--loop-type context` is a valid recognized value from `VALID_KINDS.context` in coverage-graph-db.ts; the auto YAML's `step_graph_convergence` shows the exact invocation pattern; the script's exit-code contract is documented in the convergence feature file.

Desired user-visible outcome: the convergence script produces a machine-readable decision that the auto YAML's `step_check_convergence` can consume without transformation.

#### Test Execution
> **Feature File:** [CONV-004](04--convergence-detection/evaluate-context.md)

### CONV-005 | Cross-Mode Anti-Convergence Contract

#### Description
Verify that `deep-context` declares the shared anti-convergence floor and fail-closed stop policy, with shared runtime and optimizer guard anchors.

#### Scenario Contract
Prompt: As a manual-testing orchestrator, validate the deep-context anti-convergence contract against `deep_context_config.json`, the shared runtime capability resolver, and the optimizer manifest. Return a concise verdict.

Expected signals: `deep_context_config.json` contains `antiConvergence.minIterations = 2`, `convergenceMode = "default"`, and `stopPolicy = "fail-closed"`; the shared runtime resolver rejects missing/non-fail-closed policy; the optimizer manifest locks convergence mode and carries `minIterations<=maxIterations`.

Desired user-visible outcome: the context loop cannot be documented as a one-sweep stop path; it carries a two-iteration floor and fail-closed stop-policy contract.

#### Test Execution
> **Feature File:** [CONV-005](04--convergence-detection/cross-mode-anti-convergence-contract.md)

---

## 11. CONTEXT REPORT SYNTHESIS (`SYN-001..SYN-003`)

This category covers 3 scenario summaries while the linked feature files remain the canonical execution contract.

### SYN-001 | Reuse Catalog Generation

#### Description
Verify that `step_compile_report` reads from `findings-registry.json` and verifies every reuse candidate's `file:symbol` against the code graph before including it in the REUSE catalog, labeling stale refs `unverified`.

#### Scenario Contract
Prompt: As a manual-testing orchestrator, validate the reuse catalog generation contract for `deep-context` against the auto YAML `step_compile_report`, `context_report_template.md`, and SKILL.md §3 output description. Verify the REUSE catalog leads the Context Report, each entry includes `id`, `symbol`, `signature`, `reuse verb`, `confidence`, `agreement`, `freshness`, and `notes`; stale refs are labeled `unverified`; pointers not source bodies are shipped. Return a concise verdict.

Expected signals: `context_report_template.md` at `assets/context_report_template.md` exists and contains a REUSE section as the first content section; SKILL.md §3 describes "pointers + signatures, not source bodies"; the template's freshness field allows `verified | unverified`; `step_verify_citations` or equivalent is named in the auto YAML.

Desired user-visible outcome: the REUSE catalog is the first section of the Context Report and every entry cites a code-graph-verified `file:symbol` reference.

#### Test Execution
> **Feature File:** [SYN-001](05--context-report-synthesis/reuse-catalog-generation.md)

---

### SYN-002 | Context Report Assembly

#### Description
Verify that `step_compile_report` assembles all seven Context Report sections from merged findings and that `step_emit_report_json` writes the companion machine-readable JSON.

#### Scenario Contract
Prompt: As a manual-testing orchestrator, validate the Context Report assembly contract for `deep-context` against the auto YAML `phase_synthesis`, `context_report_template.md`, and SKILL.md §3 output description. Verify the report has seven sections (REUSE Catalog, Integration Points, Touch List, Conventions, Pruned Dependency Subgraph, Prior Art/Decisions, Gaps & Unknowns); `[HARD]`/`[soft]` markers are used for integration points; `context-report.json` is also written. Return a concise verdict.

Expected signals: `context_report_template.md` contains all seven section headings; `step_emit_report_json` or equivalent is named in the auto YAML; `phase_synthesis` updates `config.status = "complete"` via `step_update_config_status`; SKILL.md §3 describes both `context-report.md` and `context-report.json` as outputs.

Desired user-visible outcome: the synthesized Context Report is ready for direct consumption by `/speckit:plan` or `/speckit:implement` with structured pointers for every category of discovery.

#### Test Execution
> **Feature File:** [SYN-002](05--context-report-synthesis/context-report-assembly.md)

---

### SYN-003 | Reduce-State Merge

#### Description
Verify that `reduce-state.cjs` passes syntax check, exposes the correct exports (`reduceContextState`, `dedupByUnit`, `detectContradictions`, `buildRegistry`), and reads from the correct artifact paths relative to the spec folder.

#### Scenario Contract
Prompt: As a manual-testing orchestrator, validate the reduce-state.cjs script contract for `deep-context` by running `node --check` and inspecting its exports and constants. Verify `DEFAULT_RELEVANCE_GATE = 0.55`, `DEFAULT_AGREEMENT_MIN = 2`, `KIND_TO_BUCKET` maps all five kinds, `reduceContextState(specFolder)` is exported, and the script reads from `{artifact_dir}/deep-context-state.jsonl` and `{artifact_dir}/seats/`. Return a concise verdict.

Expected signals: `node --check .opencode/skills/deep-loop-workflows/deep-context/scripts/reduce-state.cjs` exits 0; `rg "DEFAULT_RELEVANCE_GATE" .opencode/skills/deep-loop-workflows/deep-context/scripts/reduce-state.cjs` returns `0.55`; `rg "DEFAULT_AGREEMENT_MIN" .opencode/skills/deep-loop-workflows/deep-context/scripts/reduce-state.cjs` returns `2`; `module.exports` contains `reduceContextState`, `dedupByUnit`, `detectContradictions`, `buildRegistry`.

Desired user-visible outcome: the reducer can be safely invoked on any spec folder to reconstruct the findings registry and dashboard from the persisted state log and seat artifacts.

#### Test Execution
> **Feature File:** [SYN-003](05--context-report-synthesis/reduce-state-merge.md)

---

## 12. COVERAGE-GRAPH SCHEMA (`CG-001..CG-004`)

This category covers 3 scenario summaries while the linked feature files remain the canonical execution contract.

### CG-001 | Loop Type: Context Schema

#### Description
Verify that `coverage-graph-db.ts` defines `'context'` as a valid `LoopType`, exports the correct `VALID_KINDS.context` array and `VALID_RELATIONS.context` array, and that `CONTEXT_WEIGHTS.REUSES` is the highest-weighted relation.

#### Scenario Contract
Prompt: As a manual-testing orchestrator, validate the coverage graph context schema for `deep-context` by inspecting `coverage-graph-db.ts`. Verify `LoopType` includes `'context'`, `VALID_KINDS.context` contains all eight node kinds (SLICE, FILE, SYMBOL, PATTERN, REUSE_CANDIDATE, DEPENDENCY, CONSTRAINT, GAP), `VALID_RELATIONS.context` contains all eleven relations, and `CONTEXT_WEIGHTS.REUSES === 1.5` is the highest weight. Return a concise verdict.

Expected signals: `rg "'context'" .opencode/skills/deep-loop-runtime/lib/coverage-graph/coverage-graph-db.ts` returns the LoopType definition; `VALID_KINDS.context` array lists all eight kinds; `CONTEXT_WEIGHTS.REUSES` equals 1.5; `SCHEMA_VERSION` is present; WAL and foreign keys are enabled.

Desired user-visible outcome: the coverage graph correctly partitions context-loop data from research and review data via the namespace `(spec_folder, loop_type, session_id)` primary key.

#### Test Execution
> **Feature File:** [CG-001](06--coverage-graph-schema/loop-type-context-schema.md)

---

### CG-002 | Context Node Kinds and Relations

#### Description
Verify that each context node kind and relation has a documented semantic role aligned with the loop protocol, and that the eight node kinds and eleven relations listed in `coverage-graph-db.ts` match those described in `loop_protocol.md` and `convergence.md`.

#### Scenario Contract
Prompt: As a manual-testing orchestrator, validate the context node kind and relation documentation for `deep-context` by cross-referencing `coverage-graph-db.ts`, `loop_protocol.md`, and `convergence.md`. Verify SLICE, REUSE_CANDIDATE, COVERED_BY, CONFIRMS, and CONTRADICTS are consistently described across all three sources. Return a concise verdict.

Expected signals: `SLICE` appears in `VALID_KINDS.context` in the db file and in `loop_protocol.md` §4 as frontier scope units; `COVERED_BY` relation in both the db and `convergence.md` §2 `sliceCoverage` formula; `CONFIRMS` drives `agreementRate` per `convergence.md` §2; `CONTRADICTS` is a relation in both the db and `loop_protocol.md` §6.

Desired user-visible outcome: every node kind and relation in the schema has a clear semantic role traceable to the loop protocol or convergence contract — no orphaned schema elements.

#### Test Execution
> **Feature File:** [CG-002](06--coverage-graph-schema/context-node-kinds-relations.md)

---

### CG-003 | Context Convergence Signals

#### Description
Verify that `computeContextSignalsFromData` in `coverage-graph-signals.ts` returns all five `ContextConvergenceSignals` fields, that vacuous-pass behavior is implemented for each kind, and that `createSnapshot` uses upsert-on-conflict semantics.

#### Scenario Contract
Prompt: As a manual-testing orchestrator, validate the `computeContextSignalsFromData` function and `createSnapshot` upsert contract in `coverage-graph-signals.ts`. Verify the function is exported, the five signals are computed from node/edge data without requiring DB queries (pure function), vacuous-pass returns 1.0 when the denominator is zero for each signal, and `createSnapshot` uses `ON CONFLICT DO UPDATE` semantics. Return a concise verdict.

Expected signals: `computeContextSignalsFromData` is exported from `coverage-graph-signals.ts`; `sliceNodes.length > 0 ? ... : 1` pattern appears for each signal; `CONTEXT_RELEVANCE_GATE = 0.55` and `CONTEXT_AGREEMENT_MIN = 2` constants are present; `createSnapshot` uses `ON CONFLICT(spec_folder, loop_type, session_id, iteration) DO UPDATE` in `coverage-graph-db.ts`.

Desired user-visible outcome: the convergence engine can be unit-tested with in-memory node/edge data without requiring a live SQLite database, and snapshot writes are safe to retry idempotently.

#### Test Execution
> **Feature File:** [CG-003](06--coverage-graph-schema/context-convergence-signals.md)

### CG-004 | Code-Graph Coverage Seed Bridge

#### Description
Verify that `deep-context` seeds coverage-graph nodes from frontier/code-graph evidence with seed source and confidence metadata before the first convergence check.

#### Scenario Contract
Prompt: As a manual-testing orchestrator, validate the deep-context code-graph to coverage-graph seed bridge against `deep_context_auto.yaml`, `upsert.cjs`, and `coverage-graph-db.ts`. Return a concise verdict.

Expected signals: YAML binds `coverage_seed_source` and `coverage_seed_confidence`; context uses 0.55 for code-graph and 0.35 for fallback seeds; `upsert.cjs` requires both seed fields and validates 0..1 confidence; `coverage-graph-db.ts` stores and returns `seed_source` and `seed_confidence`; tests cover seed metadata.

Desired user-visible outcome: a context run starts convergence with seeded graph context when frontier data exists, and seeded nodes remain auditable by source and confidence.

#### Test Execution
> **Feature File:** [CG-004](06--coverage-graph-schema/code-graph-coverage-seed-bridge.md)

---

## 13. RUNTIME ROBUSTNESS (`RUNTIME-001..RUNTIME-005`)

This category covers 5 scenario summaries validating the safety and reliability mechanisms wired into the `deep-context` loop. The linked feature files remain the canonical execution contract.

### RUNTIME-001 | Atomic State

#### Description
Verify that `reduce-state.cjs` implements the atomic temp+fsync+rename write pattern for both `findings-registry.json` (via runtime `writeStateAtomic`) and `deep-context-dashboard.md` (via inline `writeTextAtomic`), and that `atomic-state.ts` exports `writeStateAtomic` with the expected pattern.

#### Scenario Contract
Prompt: As a manual-testing orchestrator, validate the atomic-state write contract for deep-context against reduce-state.cjs and the runtime atomic-state.ts module. Verify `writeStateAtomic` and `writeTextAtomic` are present in reduce-state.cjs; `loadStateSafety` is exported; `atomic-state.ts` exports `writeStateAtomic` with temp+fsync+rename. Return a concise verdict.

Expected signals: `node --check` exits 0; `writeStateAtomic` and `writeTextAtomic` in reduce-state.cjs; `loadStateSafety` exported; `export function writeStateAtomic` in atomic-state.ts; `fsyncSync` and `renameSync` in atomic-state.ts.

Desired user-visible outcome: the registry and dashboard are always written atomically so a crash between iterations never leaves a corrupt file visible to downstream readers.

#### Test Execution
> **Feature File:** [RUNTIME-001](07--runtime-robustness/atomic-state.md)

---

### RUNTIME-002 | JSONL Repair

#### Description
Verify that `reduce-state.cjs` invokes `repairJsonlTail` on the state log before reading and surfaces the outcome in `registry.stateLogRepair { repaired, droppedBytes }`, with `repairJsonlTailInline` as the inline fallback.

#### Scenario Contract
Prompt: As a manual-testing orchestrator, validate the JSONL repair contract for deep-context against reduce-state.cjs and the runtime jsonl-repair.ts module. Verify `repairJsonlTail` and `stateLogRepair` appear in reduce-state.cjs; `repairJsonlTailInline` is present; `jsonl-repair.ts` exports `repairJsonlTail` with `truncateSync`. Return a concise verdict.

Expected signals: `repairJsonlTail` and `stateLogRepair` in reduce-state.cjs; `repairJsonlTailInline` in reduce-state.cjs; `export function repairJsonlTail` in jsonl-repair.ts; `truncateSync` in jsonl-repair.ts.

Desired user-visible outcome: a crash-corrupted state log is automatically repaired before the reducer reads it, and the amount of data trimmed is visible in `registry.stateLogRepair.droppedBytes`.

#### Test Execution
> **Feature File:** [RUNTIME-002](07--runtime-robustness/jsonl-repair.md)

---

### RUNTIME-003 | Post-Dispatch Validate (Seat Validation)

#### Description
Verify that `reduce-state.cjs` calls `validateSeatFinding` before merging each seat finding and surfaces invalid findings in `registry.seatValidationWarnings` rather than silently merging or dropping them.

#### Scenario Contract
Prompt: As a manual-testing orchestrator, validate the post-dispatch seat finding validation contract for deep-context against reduce-state.cjs. Verify `validateSeatFinding` and `seatValidationWarnings` appear in the script; confirm `validateSeatFinding` checks kind, path/symbol, and relevance. Return a concise verdict.

Expected signals: `validateSeatFinding` in reduce-state.cjs; `seatValidationWarnings` in the registry assignment; validation reason strings for unknown kind, missing path/symbol, and non-numeric relevance present in reduce-state.cjs.

Desired user-visible outcome: invalid seat findings are surfaced in `registry.seatValidationWarnings` rather than silently merged, so operators know when a seat returned malformed output.

#### Test Execution
> **Feature File:** [RUNTIME-003](07--runtime-robustness/post-dispatch-validate.md)

---

### RUNTIME-004 | Loop Lock

#### Description
Verify that `loop-lock.cjs` passes syntax check and that `step_acquire_lock`/`step_release_lock` are wired into both `deep_context_auto.yaml` and `deep_context_confirm.yaml`.

#### Scenario Contract
Prompt: As a manual-testing orchestrator, validate the loop lock contract for deep-context by running `node --check` on loop-lock.cjs and confirming `step_acquire_lock` and `step_release_lock` appear in both auto and confirm YAML files. Return a concise verdict.

Expected signals: `node --check loop-lock.cjs` exits 0; `loop-lock.cjs` referenced in both YAMLs; both `step_acquire_lock` and `step_release_lock` found in each YAML.

Desired user-visible outcome: concurrent deep-context sessions targeting the same spec folder are blocked at `step_acquire_lock` without corrupting shared state artifacts.

#### Test Execution
> **Feature File:** [RUNTIME-004](07--runtime-robustness/loop-lock.md)

---

### RUNTIME-005 | Executor Audit

#### Description
Verify that `SPECKIT_CLI_DISPATCH_STACK` and the `executor-audit` recursion-guard contract are referenced in `deep_context_auto.yaml`, and that `buildExecutorDispatchEnv` is exported from `executor-audit.ts`.

#### Scenario Contract
Prompt: As a manual-testing orchestrator, validate the executor-audit recursion-guard contract for deep-context against the auto YAML cli_contract block. Verify `SPECKIT_CLI_DISPATCH_STACK` and `executor-audit` appear in `deep_context_auto.yaml`; `CLI_DISPATCH_STACK_ENV` and `buildExecutorDispatchEnv` are exported from `executor-audit.ts`. Return a concise verdict.

Expected signals: `SPECKIT_CLI_DISPATCH_STACK` and `executor-audit` in auto YAML; `CLI_DISPATCH_STACK_ENV` and `export function buildExecutorDispatchEnv` in executor-audit.ts.

Desired user-visible outcome: every CLI seat launched by the context loop carries `SPECKIT_CLI_DISPATCH_STACK` in its environment so recursive deep-context launches are blocked before dispatch.

#### Test Execution
> **Feature File:** [RUNTIME-005](07--runtime-robustness/executor-audit.md)

---

## 14. AUTOMATED TEST CROSS-REFERENCE

| Test Module | Coverage | Playbook Overlap |
|---|---|---|
| `.opencode/skills/deep-loop-runtime/tests/integration/convergence-script.vitest.ts` | `convergence.cjs --loop-type context` exit codes and JSON output | CONV-004 |
| `.opencode/skills/deep-loop-runtime/tests/integration/review-depth-convergence.vitest.ts` | `computeContextSignalsFromData` vacuous-pass behavior | CG-003 |
| `.opencode/skills/deep-loop-runtime/tests/integration/status-script.vitest.ts` | Coverage graph stats and signal snapshots | CG-001 |
| `.opencode/skills/deep-loop-runtime/tests/integration/upsert-script.vitest.ts` | Seed metadata validation through the upsert CLI | CG-004 |
| `.opencode/skills/deep-loop-runtime/tests/unit/coverage-graph-db.vitest.ts` | Seed metadata persistence and zero-node seed warnings | CG-004 |

---

## 15. FEATURE CATALOG CROSS-REFERENCE INDEX

| Feature ID | Feature Name | Category | Feature File |
|---|---|---|---|
| FS-001 | Frontier Initialization | Frontier Seeding | [FS-001](01--frontier-seeding/frontier-initialization.md) |
| FS-002 | Scope Binding and Code-Graph Seeding | Frontier Seeding | [FS-002](01--frontier-seeding/scope-binding-and-code-graph-seeding.md) |
| FS-003 | Config Shape and Default Pool | Frontier Seeding | [FS-003](01--frontier-seeding/config-shape-and-default-pool.md) |
| SWEEP-001 | Heterogeneous Pool Dispatch | By-Model Parallel Sweep | [SWEEP-001](02--by-model-parallel-sweep/heterogeneous-pool-dispatch.md) |
| SWEEP-002 | Native Task Batch | By-Model Parallel Sweep | [SWEEP-002](02--by-model-parallel-sweep/native-task-batch.md) |
| SWEEP-003 | CLI Council Seats | By-Model Parallel Sweep | [SWEEP-003](02--by-model-parallel-sweep/cli-council-seats.md) |
| SWEEP-004 | Per-Model Prompt Framework | By-Model Parallel Sweep | [SWEEP-004](02--by-model-parallel-sweep/per-model-prompt-framework.md) |
| MERGE-001 | Finding Dedup by Symbol | Agreement Merge | [MERGE-001](03--agreement-merge/finding-dedup-by-symbol.md) |
| MERGE-002 | Cross-Executor Agreement | Agreement Merge | [MERGE-002](03--agreement-merge/cross-executor-agreement.md) |
| MERGE-003 | Contradiction Surfacing | Agreement Merge | [MERGE-003](03--agreement-merge/contradiction-surfacing.md) |
| CONV-001 | Context Coverage Signals | Convergence Detection | [CONV-001](04--convergence-detection/context-coverage-signals.md) |
| CONV-002 | Relevance Gate | Convergence Detection | [CONV-002](04--convergence-detection/relevance-gate.md) |
| CONV-003 | Agreement Gate | Convergence Detection | [CONV-003](04--convergence-detection/agreement-gate.md) |
| CONV-004 | Evaluate Context via Convergence Script | Convergence Detection | [CONV-004](04--convergence-detection/evaluate-context.md) |
| CONV-005 | Cross-Mode Anti-Convergence Contract | Convergence Detection | [CONV-005](04--convergence-detection/cross-mode-anti-convergence-contract.md) |
| SYN-001 | Reuse Catalog Generation | Context Report Synthesis | [SYN-001](05--context-report-synthesis/reuse-catalog-generation.md) |
| SYN-002 | Context Report Assembly | Context Report Synthesis | [SYN-002](05--context-report-synthesis/context-report-assembly.md) |
| SYN-003 | Reduce-State Merge | Context Report Synthesis | [SYN-003](05--context-report-synthesis/reduce-state-merge.md) |
| CG-001 | Loop Type: Context Schema | Coverage-Graph Schema | [CG-001](06--coverage-graph-schema/loop-type-context-schema.md) |
| CG-002 | Context Node Kinds and Relations | Coverage-Graph Schema | [CG-002](06--coverage-graph-schema/context-node-kinds-relations.md) |
| CG-003 | Context Convergence Signals | Coverage-Graph Schema | [CG-003](06--coverage-graph-schema/context-convergence-signals.md) |
| CG-004 | Code-Graph Coverage Seed Bridge | Coverage-Graph Schema | [CG-004](06--coverage-graph-schema/code-graph-coverage-seed-bridge.md) |
| RUNTIME-001 | Atomic State | Runtime Robustness | [RUNTIME-001](07--runtime-robustness/atomic-state.md) |
| RUNTIME-002 | JSONL Repair | Runtime Robustness | [RUNTIME-002](07--runtime-robustness/jsonl-repair.md) |
| RUNTIME-003 | Post-Dispatch Validate (Seat Validation) | Runtime Robustness | [RUNTIME-003](07--runtime-robustness/post-dispatch-validate.md) |
| RUNTIME-004 | Loop Lock | Runtime Robustness | [RUNTIME-004](07--runtime-robustness/loop-lock.md) |
| RUNTIME-005 | Executor Audit | Runtime Robustness | [RUNTIME-005](07--runtime-robustness/executor-audit.md) |
