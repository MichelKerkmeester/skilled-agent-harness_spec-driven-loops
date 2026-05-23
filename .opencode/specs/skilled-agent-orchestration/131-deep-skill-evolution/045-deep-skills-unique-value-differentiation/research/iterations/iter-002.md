---
executor: cli-devin
model: swe-1.6
iter: 2
started_at: 2026-05-23T08:10:00.000Z
finished_at: 2026-05-23T08:12:00.000Z
target_dimension: contract-surface
---

# Iter-002: Deep-Research Contract Characterization

## Sources Read

1. `.opencode/specs/skilled-agent-orchestration/130-deep-skills-unique-value-differentiation/research/iterations/iter-001.md` — prior iter findings on deep-review (baseline priors)
2. `.opencode/specs/skilled-agent-orchestration/130-deep-skills-unique-value-differentiation/research/findings-registry.json` — current registry for fingerprint dedup
3. `.opencode/commands/spec_kit/deep-research.md` — command entrypoint with setup phase, execution modes, and output format
4. `.opencode/commands/spec_kit/assets/spec_kit_deep-research_auto.yaml` — autonomous mode workflow with state paths and loop phases
5. `.opencode/commands/spec_kit/assets/spec_kit_deep-research_confirm.yaml` — interactive mode workflow with approval gates
6. `.opencode/agents/deep-research.md` — LEAF iteration agent with single-iteration contract and tool permissions
7. `.opencode/skills/deep-loop-runtime/SKILL.md` — shared runtime infrastructure for executor config, prompt-pack, validation, and coverage graph
8. `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/010-system-spec-kit-mcp-sidecar-investigation/001-deep-research-drift-and-simplification/research/research.md` — ground truth research report with 17-section structure

## Findings

### F17 — Input shape requires 5 mandatory setup fields
**Fingerprint:** `contract-surface:deep-research:input-shape-5-fields`
**Severity:** info
**Evidence:** The unified setup phase in deep-research.md requires resolution of 5 fields before loading the YAML workflow: `research_topic`, `spec_folder`, `execution_mode`, `maxIterations`, `convergenceThreshold`. This is 2 fewer fields than deep-review (which requires 7). The Default Resolution Table at lines 89-103 documents which fields resolve via flags, markers, auto-detection, or defaults. [SOURCE: .opencode/commands/spec_kit/deep-research.md:14-20, 89-103]

### F18 — Input shape supports PRE-BOUND SETUP ANSWERS for non-interactive :auto dispatch
**Fingerprint:** `contract-surface:deep-research:pre-bound-answers-schema`
**Severity:** info
**Evidence:** The PRE-BOUND SETUP ANSWERS schema at lines 68-85 defines a YAML marker block format for non-interactive :auto dispatch. The marker includes fields for research_topic, spec_folder, execution_mode, maxIterations, convergenceThreshold, executor, executor_model, executor_reasoning, executor_service_tier, executor_timeout, and resource_map_emit. Marker fields take precedence over $ARGUMENTS flags. This matches the deep-review schema structure. [SOURCE: .opencode/commands/spec_kit/deep-research.md:68-85]

### F19 — Input shape does NOT support target types (unlike deep-review's 5 types)
**Fingerprint:** `contract-surface:deep-research:no-target-types`
**Severity:** info
**Evidence:** Unlike deep-review which supports 5 review_target_type values (spec-folder, skill, agent, track, files), deep-research has no target_type field. The Default Resolution Table at lines 89-103 shows only research_topic, spec_folder, execution_mode, maxIterations, and convergenceThreshold. Deep-research operates on a single research_topic string rather than typed targets. [SOURCE: .opencode/commands/spec_kit/deep-research.md:89-103; contrast with iter-001 F3]

### F20 — Input shape supports 6 executor kinds with optional model/reasoning/service-tier configuration
**Fingerprint:** `contract-surface:deep-research:executor-kinds-6`
**Severity:** info
**Evidence:** The Default Resolution Table at lines 98-102 and the consolidated setup prompt at lines 173-179 document 6 executor kinds: native, cli-codex, cli-gemini, cli-claude-code, cli-opencode, and cli-devin. Optional configuration includes executor_model, executor_reasoning, executor_service_tier, and executor_timeout. This matches deep-review's executor configuration. [SOURCE: .opencode/commands/spec_kit/deep-research.md:98-102, 173-179]

### F21 — Output artifacts include 11 canonical files under resolved artifact_dir
**Fingerprint:** `contract-surface:deep-research:output-artifacts-11-files`
**Severity:** info
**Evidence:** The state_paths section in both YAML workflows defines 11 canonical output files: deep-research-config.json, deep-research-state.jsonl, findings-registry.json, deep-research-strategy.md, deep-research-dashboard.md, .deep-research-pause sentinel, .deep-research.lock lock file, prompts/ directory, iterations/iteration-{NNN}.md files, deltas/iter-{NNN}.jsonl files, and research.md. The workflow also emits resource-map.md at synthesis. This is 2 more files than deep-review (which has 9), due to the addition of .deep-research.lock lock file. [SOURCE: .opencode/commands/spec_kit/assets/spec_kit_deep-research_auto.yaml:94-119; contrast with iter-001 F5]

### F22 — Output artifacts include per-iteration markdown with 10 required sections
**Fingerprint:** `contract-surface:deep-research:iteration-artifact-10-sections`
**Severity:** info
**Evidence:** The deep-research agent definition at lines 181-222 specifies that iteration-{NNN}.md must include 10 sections: Focus, Findings, Ruled Out, Dead Ends, Edge Cases, Sources Consulted, Assessment, Reflection, Recommended Next Focus. This is 2 more sections than deep-review's 8-section structure. Deep-research adds explicit "Dead Ends" and "Reflection" sections. [SOURCE: .opencode/agents/deep-research.md:181-222; contrast with iter-001 F6]

### F23 — Output artifacts include research.md with 17 sections
**Fingerprint:** `contract-surface:deep-research:research-report-17-sections`
**Severity:** info
**Evidence:** The ground truth research report shows 17 sections: 1. Executive Summary, 2. Methodology, 3. Findings by Angle, 4. Findings by Surface, 5. Cross-Angle Themes, 6. P0/P1/P2 Summary, 7. Remediation Roadmap, 8. Coverage Analysis, 9. Source Diversity, 10. Convergence Analysis, 11. Executor Performance, 12. Negative Knowledge, 13. Open Questions, 14. Resolved Questions, 15. Key Findings, 16. Ruled Out Directions, 17. Next Steps. The command entrypoint at line 234 mentions research.md as a synthesis output. This is 8 more sections than deep-review's 9-section review-report.md. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/010-system-spec-kit-mcp-sidecar-investigation/001-deep-research-drift-and-simplification/research/research.md:1-139; .opencode/commands/spec_kit/deep-research.md:234; contrast with iter-001 F7]

### F24 — State files include 3 core persistence artifacts plus JSONL append log
**Fingerprint:** `contract-surface:deep-research:state-files-3-core-plus-jsonl`
**Severity:** info
**Evidence:** The step_classify_session in both YAML workflows inspects 3 core state artifacts: deep-research-config.json, deep-research-state.jsonl, and deep-research-strategy.md. The findings registry is also checked. Session classification depends on whether these artifacts exist and agree on mode/topic. The JSONL state log receives append-only iteration records and event records (migration, resumed, restarted). This matches deep-review's state file structure. [SOURCE: .opencode/commands/spec_kit/assets/spec_kit_deep-research_auto.yaml:197-236; .opencode/commands/spec_kit/assets/spec_kit_deep-research_confirm.yaml:157-200]

### F25 — State file ownership is split between main loop and LEAF agent
**Fingerprint:** `contract-surface:deep-research:state-ownership-split`
**Severity:** info
**Evidence:** The main loop (YAML workflow) owns deep-research-config.json, deep-research-strategy.md, deep-research-dashboard.md, and findings-registry.json. The LEAF agent (@deep-research) owns iteration-{NNN}.md and appends to deep-research-state.jsonl. The agent's Step 8 at line 235 requires appending exactly ONE type:"iteration" line per execution. The agent cannot modify config, registry, or strategy except for the strategy edit in Step 8. This matches deep-review's ownership split. [SOURCE: .opencode/agents/deep-research.md:226-232; .opencode/commands/spec_kit/assets/spec_kit_deep-research_auto.yaml:94-119]

### F26 — Convergence semantics use Bayesian scoring via coverage-graph signals
**Fingerprint:** `contract-surface:deep-research:convergence-bayesian-signals`
**Severity:** info
**Evidence:** The deep-loop runtime SKILL.md at lines 134-135 documents bayesian-scorer.ts and coverage-graph-signals.ts as shared runtime libraries. The coverage-graph-signals module defines ReviewConvergenceSignals with dimensionCoverage, findingStability, p0ResolutionRate, evidenceDensity, and hotspotSaturation. The convergence.cjs script computes typed CONTINUE / STOP_ALLOWED / STOP_BLOCKED decisions. This matches deep-review's convergence mechanism. [SOURCE: .opencode/skills/deep-loop-runtime/SKILL.md:134-135; .opencode/skills/deep-loop-runtime/lib/coverage-graph/coverage-graph-signals.ts:44-50]

### F27 — Convergence semantics use newInfoRatio calculation without severity tiers
**Fingerprint:** `contract-surface:deep-research:convergence-newinfo-ratio-no-tiers`
**Severity:** info
**Evidence:** The deep-research agent at lines 264-269 documents newInfoRatio calculation: fully new findings count as 1.0, partially new as 0.5, with a +0.10 simplicity bonus capped at 1.0. Unlike deep-review's P0/P1/P2 severity tiers with weighted calculation (P0=10, P1=5, P2=1), deep-research has no severity classification system. Convergence is based purely on information novelty ratio. [SOURCE: .opencode/agents/deep-research.md:264-269; contrast with iter-001 F11]

### F28 — Convergence semantics do NOT include adversarial adjudication
**Fingerprint:** `contract-surface:deep-research:convergence-no-adversarial`
**Severity:** info
**Evidence:** Unlike deep-review which requires Hunter/Skeptic/Referee adjudication for P0 findings (iter-001 F12), deep-research has no adversarial self-check mechanism. The deep-research agent at lines 133-150 defines edge case handling (ambiguous input, contradictory evidence, missing dependency, partial success) but does not require adversarial adjudication for any finding severity. [SOURCE: .opencode/agents/deep-research.md:133-150; contrast with iter-001 F12]

### F29 — Command-mode suffixes are :auto and :confirm with three-tier resolution contract
**Fingerprint:** `contract-surface:deep-research:command-modes-auto-confirm`
**Severity:** info
**Evidence:** The command entrypoint at lines 52-66 documents :auto and :confirm suffixes. :auto follows a three-tier resolution contract: Tier 1 resolves confidently from flags/markers/defaults, Tier 2 asks targeted questions for 1-2 ambiguous fields, Tier 3 fails fast with named-missing-inputs error. :confirm uses a consolidated setup prompt with multi-gate approvals after setup. This matches deep-review's command-mode structure. [SOURCE: .opencode/commands/spec_kit/deep-research.md:52-66]

### F30 — Command-mode :auto supports non-interactive dispatch via PRE-BOUND SETUP ANSWERS
**Fingerprint:** `contract-surface:deep-research:auto-non-interactive`
**Severity:** info
**Evidence:** The PRE-BOUND SETUP ANSWERS schema at lines 68-85 is specifically for :auto non-interactive dispatch. The marker block allows binding all 5 required fields in the prompt body, avoiding interactive questions. The three-tier resolution contract at lines 56-64 applies only to :auto mode. This matches deep-review's non-interactive dispatch capability. [SOURCE: .opencode/commands/spec_kit/deep-research.md:52-66, 68-85]

### F31 — Convergence-distinctive value is negative knowledge and research charter without adversarial checks
**Fingerprint:** `contract-surface:deep-research:unique-negative-knowledge`
**Severity:** observation
**Evidence:** Deep-research uniquely emphasizes negative knowledge (ruled-out directions) as first-class research output through the "Ruled Out" and "Dead Ends" sections in iteration artifacts. It also uses a research charter (non-goals, stop conditions) validated at init. Unlike deep-review's adversarial P0 adjudication with coverage-graph signals, deep-research converges based purely on newInfoRatio without severity tiers or adversarial self-checks. [SOURCE: .opencode/agents/deep-research.md:181-222, 264-269; .opencode/commands/spec_kit/deep-research.md:371-372; contrast with iter-001 F15]

### F32 — Tier 1/2/3 resolution contract applies only to :auto mode
**Fingerprint:** `contract-surface:deep-research:tier-contract-auto-only`
**Severity:** info
**Evidence:** The three-tier resolution contract at lines 56-64 is explicitly under the `:auto` Setup Resolution section. Tier 1 resolves confidently, Tier 2 asks targeted questions, Tier 3 fails fast. :confirm mode uses the Consolidated Setup Prompt instead with multi-gate approvals. The Default Resolution Table at lines 89-103 documents which fields are Tier-2 candidates (spec_folder). This matches deep-review's tier contract. [SOURCE: .opencode/commands/spec_kit/deep-research.md:56-64, 89-103]

## Comparison with Deep-Review

1. **Input field count**: Deep-research requires 5 mandatory setup fields (research_topic, spec_folder, execution_mode, maxIterations, convergenceThreshold) vs deep-review's 7 fields (review_target, review_target_type, review_dimensions, spec_folder, execution_mode, maxIterations, convergenceThreshold). Deep-research lacks target_type and dimensions fields. [F17 vs iter-001 F1]

2. **Target type support**: Deep-research has no target_type field and operates on a single research_topic string, whereas deep-review supports 5 typed targets (spec-folder, skill, agent, track, files) with distinct scope discovery algorithms. [F19 vs iter-001 F3]

3. **Iteration artifact structure**: Deep-research iteration artifacts have 10 sections (Focus, Findings, Ruled Out, Dead Ends, Edge Cases, Sources Consulted, Assessment, Reflection, Recommended Next Focus) vs deep-review's 8 sections. Deep-research adds explicit "Dead Ends" and "Reflection" sections. [F22 vs iter-001 F6]

4. **Convergence mechanism**: Deep-research uses newInfoRatio calculation without severity tiers (fully new=1.0, partially new=0.5, +0.10 simplicity bonus) vs deep-review's weighted P0/P1/P2 calculation (P0=10, P1=5, P2=1). Deep-research has no adversarial adjudication for any findings. [F27, F28 vs iter-001 F11, F12]

5. **Synthesis output structure**: Deep-research research.md has 17 sections (Executive Summary, Methodology, Findings by Angle, Findings by Surface, Cross-Angle Themes, P0/P1/P2 Summary, Remediation Roadmap, Coverage Analysis, Source Diversity, Convergence Analysis, Executor Performance, Negative Knowledge, Open Questions, Resolved Questions, Key Findings, Ruled Out Directions, Next Steps) vs deep-review's 9-section review-report.md. [F23 vs iter-001 F7]

6. **State file count**: Deep-research has 11 canonical state files (adding .deep-research.lock) vs deep-review's 9 files. The lock file is required by the spec_check_protocol for session classification. [F21 vs iter-001 F5]

## Open Questions for Iter-003

1. Does deep-ai-council use the same PRE-BOUND SETUP ANSWERS schema for non-interactive dispatch?
2. Does deep-ai-council use the same three-tier resolution contract for :auto mode?
3. Does deep-ai-council require adversarial adjudication for high-severity findings?
4. Does deep-ai-council use coverage-graph signals for convergence detection?
5. What are the finding severity tiers in deep-ai-council?
6. Does deep-ai-council use the same 6 executor kinds?
7. What are the state file ownership splits in deep-ai-council?
8. Does deep-ai-council support multi-seat deliberation with artifact persistence?
