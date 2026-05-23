---
executor: cli-devin
model: swe-1.6
iter: 1
started_at: 2026-05-23T06:08:00.000Z
finished_at: 2026-05-23T06:08:30.000Z
target_dimension: contract-surface
---

# Iter-001: Deep-Review Contract Characterization

## Sources Read

1. `.opencode/commands/spec_kit/deep-review.md` — command entrypoint with setup phase, execution modes, and output format
2. `.opencode/commands/spec_kit/assets/spec_kit_deep-review_auto.yaml` — autonomous mode workflow with state paths and loop phases
3. `.opencode/commands/spec_kit/assets/spec_kit_deep-review_confirm.yaml` — interactive mode workflow with approval gates
4. `.opencode/agents/deep-review.md` — LEAF iteration agent with single-iteration contract and tool permissions
5. `.opencode/skills/deep-loop-runtime/SKILL.md` — shared runtime infrastructure for executor config, prompt-pack, validation, and coverage graph
6. `.opencode/skills/deep-loop-runtime/lib/coverage-graph/coverage-graph-db.ts` — coverage graph schema with ReviewNodeKind and ReviewRelation types
7. `.opencode/skills/deep-loop-runtime/lib/coverage-graph/coverage-graph-query.ts` — coverage gap detection and contradiction lookup
8. `.opencode/skills/deep-loop-runtime/lib/coverage-graph/coverage-graph-signals.ts` — ReviewConvergenceSignals with dimensionCoverage, findingStability, p0ResolutionRate
9. `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-resource-map-deep-loop-fix/003-resource-map-deep-loop-integration/review/review-report.md` — ground truth review report with 9-section structure

## Findings

### F1 — Input shape requires 7 mandatory setup fields
**Fingerprint:** `contract-surface:deep-review:input-shape-7-fields`
**Severity:** info
**Evidence:** The unified setup phase in deep-review.md requires resolution of 7 fields before loading the YAML workflow: `review_target`, `review_target_type`, `review_dimensions`, `spec_folder`, `execution_mode`, `maxIterations`, `convergenceThreshold`. The Default Resolution Table at lines 98-112 documents which fields resolve via flags, markers, auto-detection, or defaults. [SOURCE: .opencode/commands/spec_kit/deep-review.md:15-22, 98-112]

### F2 — Input shape supports PRE-BOUND SETUP ANSWERS for non-interactive :auto dispatch
**Fingerprint:** `contract-surface:deep-review:pre-bound-answers-schema`
**Severity:** info
**Evidence:** The PRE-BOUND SETUP ANSWERS schema at lines 66-95 defines a YAML marker block format for non-interactive :auto dispatch. The marker includes fields for review_target, review_target_type, review_dimensions, spec_folder, execution_mode, maxIterations, convergenceThreshold, executor, executor_model, executor_reasoning, executor_service_tier, executor_timeout, and resource_map_emit. Marker fields take precedence over $ARGUMENTS flags. [SOURCE: .opencode/commands/spec_kit/deep-review.md:66-95]

### F3 — Input shape supports 5 review target types
**Fingerprint:** `contract-surface:deep-review:target-types-5`
**Severity:** info
**Evidence:** The Default Resolution Table at line 101 and the Consolidated Setup Prompt at lines 174-179 document 5 valid review_target_type values: spec-folder, skill, agent, track, and files. Each type has a distinct scope discovery algorithm in the YAML workflow step_scope_discovery. [SOURCE: .opencode/commands/spec_kit/deep-review.md:101, 174-179; .opencode/commands/spec_kit/assets/spec_kit_deep-review_auto.yaml:227-253]

### F4 — Input shape supports 6 executor kinds with optional model/reasoning/service-tier configuration
**Fingerprint:** `contract-surface:deep-review:executor-kinds-6`
**Severity:** info
**Evidence:** The Consolidated Setup Prompt at lines 197-204 and the Default Resolution Table at lines 107-111 document 6 executor kinds: native, cli-codex, cli-gemini, cli-claude-code, cli-opencode, and cli-devin. Optional configuration includes executor_model, executor_reasoning, executor_service_tier, and executor_timeout. The executor config is stored under config.executor.* in deep-review-config.json. [SOURCE: .opencode/commands/spec_kit/deep-review.md:107-111, 197-204]

### F5 — Output artifacts include 9 canonical files under resolved artifact_dir
**Fingerprint:** `contract-surface:deep-review:output-artifacts-9-files`
**Severity:** info
**Evidence:** The state_paths section in both YAML workflows defines 9 canonical output files: deep-review-config.json, deep-review-state.jsonl, deep-review-findings-registry.json, deep-review-strategy.md, deep-review-dashboard.md, .deep-review-pause sentinel, prompts/ directory, iterations/iteration-{NNN}.md files, and deltas/iter-{NNN}.jsonl files. The workflow also emits review-report.md and resource-map.md at synthesis. Root specs use {spec_folder}/review/ while child phases use {spec_folder}/review/{packet}-pt-{NN}/. [SOURCE: .opencode/commands/spec_kit/assets/spec_kit_deep-review_auto.yaml:82-108, 115-123]

### F6 — Output artifacts include per-iteration markdown with 8 required sections
**Fingerprint:** `contract-surface:deep-review:iteration-artifact-8-sections`
**Severity:** info
**Evidence:** The deep-review agent definition at lines 189-196 specifies that iteration-{NNN}.md must include 8 sections: Dispatcher, Files Reviewed, Findings - New (with P0/P1/P2 subsections), Traceability Checks, Integration Evidence, Edge Cases, Confirmed-Clean Surfaces, Ruled Out, and Next Focus. The reducer reads both legacy section names and these live section names. [SOURCE: .opencode/agents/deep-review.md:189-196]

### F7 — Output artifacts include review-report.md with 9 sections
**Fingerprint:** `contract-surface:deep-review:review-report-9-sections`
**Severity:** info
**Evidence:** The ground truth review report shows 9 sections: 1. Summary, 2. Scope, 3. Methodology, 4. Findings (with P1/P2 subsections), 5. Recommendations, 6. Coverage, 7. Traceability, 8. Integration, 9. Release-readiness. The command entrypoint at line 267 mentions review-report.md as a synthesis output. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-resource-map-deep-loop-fix/003-resource-map-deep-loop-integration/review/review-report.md:1-100; .opencode/commands/spec_kit/deep-review.md:267]

### F8 — State files include 3 core persistence artifacts plus JSONL append log
**Fingerprint:** `contract-surface:deep-review:state-files-3-core-plus-jsonl`
**Severity:** info
**Evidence:** The step_classify_session in both YAML workflows inspects 3 core state artifacts: deep-review-config.json, deep-review-state.jsonl, and deep-review-strategy.md. The findings registry is also checked. Session classification depends on whether these artifacts exist and agree on mode/target. The JSONL state log receives append-only iteration records and event records (migration, resumed, restarted). [SOURCE: .opencode/commands/spec_kit/assets/spec_kit_deep-review_auto.yaml:190-226; .opencode/commands/spec_kit/assets/spec_kit_deep-review_confirm.yaml:179-222]

### F9 — State file ownership is split between main loop and LEAF agent
**Fingerprint:** `contract-surface:deep-review:state-ownership-split`
**Severity:** info
**Evidence:** The main loop (YAML workflow) owns deep-review-config.json, deep-review-strategy.md, deep-review-dashboard.md, and deep-review-findings-registry.json. The LEAF agent (@deep-review) owns iteration-{NNN}.md and appends to deep-review-state.jsonl. The agent's Step 9 at line 210 requires appending exactly ONE type:"iteration" line per execution. The agent cannot modify config, registry, or strategy except for the strategy edit in Step 8. [SOURCE: .opencode/agents/deep-review.md:189-211; .opencode/commands/spec_kit/assets/spec_kit_deep-review_auto.yaml:82-108]

### F10 — Convergence semantics use Bayesian scoring via coverage-graph signals
**Fingerprint:** `contract-surface:deep-review:convergence-bayesian-signals`
**Severity:** info
**Evidence:** The deep-loop runtime SKILL.md at lines 134-135 documents bayesian-scorer.ts and coverage-graph-signals.ts as shared runtime libraries. The coverage-graph-signals module defines ReviewConvergenceSignals with dimensionCoverage, findingStability, p0ResolutionRate, evidenceDensity, and hotspotSaturation. The convergence.cjs script computes typed CONTINUE / STOP_ALLOWED / STOP_BLOCKED decisions. [SOURCE: .opencode/skills/deep-loop-runtime/SKILL.md:134-135; .opencode/skills/deep-loop-runtime/lib/coverage-graph/coverage-graph-signals.ts:44-50]

### F11 — Convergence semantics include saturation rate and P0/P1/P2 finding tiers
**Fingerprint:** `contract-surface:deep-review:convergence-saturation-tiers`
**Severity:** info
**Evidence:** The deep-review agent at lines 174-186 documents P0/P1/P2 severity classification with shared definitions from sk-code-review. P0 candidates require full Hunter/Skeptic/Referee adjudication in-iteration. Gate-relevant P1 requires compact skeptic/referee pass. The JSONL newFindingsRatio field uses weighted calculation (P0=10, P1=5, P2=1) with refinement at 0.5x. [SOURCE: .opencode/agents/deep-review.md:174-186, 217]

### F12 — Convergence semantics include adversarial adjudication for P0 findings
**Fingerprint:** `contract-surface:deep-review:convergence-adversarial-p0`
**Severity:** info
**Evidence:** The deep-review agent at line 183 requires running full Hunter/Skeptic/Referee adjudication for P0 candidates BEFORE writing to JSONL. The finding includes typed claim-adjudication fields: type, claim, evidenceRefs, counterevidenceSought, alternativeExplanation, finalSeverity, confidence, and downgradeTrigger. This is an adversarial self-check mechanism unique to deep-review. [SOURCE: .opencode/agents/deep-review.md:182-183]

### F13 — Command-mode suffixes are :auto and :confirm with three-tier resolution contract
**Fingerprint:** `contract-surface:deep-review:command-modes-auto-confirm`
**Severity:** info
**Evidence:** The command entrypoint at lines 38 and 52-64 documents :auto and :confirm suffixes. :auto follows a three-tier resolution contract: Tier 1 resolves confidently from flags/markers/defaults, Tier 2 asks targeted questions for 1-2 ambiguous fields, Tier 3 fails fast with named-missing-inputs error. :confirm uses a consolidated setup prompt with multi-gate approvals after setup. [SOURCE: .opencode/commands/spec_kit/deep-review.md:38, 52-64]

### F14 — Command-mode :auto supports non-interactive dispatch via PRE-BOUND SETUP ANSWERS
**Fingerprint:** `contract-surface:deep-review:auto-non-interactive`
**Severity:** info
**Evidence:** The PRE-BOUND SETUP ANSWERS schema at lines 66-95 is specifically for :auto non-interactive dispatch. The marker block allows binding all 7 required fields in the prompt body, avoiding interactive questions. The three-tier resolution contract at lines 56-58 applies only to :auto mode. [SOURCE: .opencode/commands/spec_kit/deep-review.md:52-64, 66-95]

### F15 — Convergence-distinctive value is adversarial P0 adjudication with coverage-graph signals
**Fingerprint:** `contract-surface:deep-review:unique-adversarial-p0`
**Severity:** observation
**Evidence:** Deep-review uniquely requires in-iteration adversarial adjudication for P0 findings (Hunter/Skeptic/Referee) with typed claim-adjudication fields. It also uses coverage-graph signals (dimensionCoverage, findingStability, p0ResolutionRate) for Bayesian convergence scoring. No sibling skill is known to combine adversarial self-checks with graph-based convergence signals. [SOURCE: .opencode/agents/deep-review.md:182-183; .opencode/skills/deep-loop-runtime/lib/coverage-graph/coverage-graph-signals.ts:44-50]

### F16 — Tier 1/2/3 resolution contract applies only to :auto mode
**Fingerprint:** `contract-surface:deep-review:tier-contract-auto-only`
**Severity:** info
**Evidence:** The three-tier resolution contract at lines 56-64 is explicitly under the `:auto` Setup Resolution section. Tier 1 resolves confidently, Tier 2 asks targeted questions, Tier 3 fails fast. :confirm mode uses the Consolidated Setup Prompt instead with multi-gate approvals. The Default Resolution Table at lines 98-112 documents which fields are Tier-2 candidates (review_target_type and spec_folder). [SOURCE: .opencode/commands/spec_kit/deep-review.md:52-64, 98-112]

## Open Questions for Sibling Skill Iters

1. Does deep-research use the same PRE-BOUND SETUP ANSWERS schema for non-interactive dispatch?
2. Does deep-research use the same three-tier resolution contract for :auto mode?
3. Does deep-research require adversarial adjudication for high-severity findings?
4. Does deep-council use coverage-graph signals for convergence detection?
5. What are the finding severity tiers in deep-research and deep-council?
6. Do deep-research and deep-council use the same 6 executor kinds?
7. What are the state file ownership splits in deep-research and deep-council?
