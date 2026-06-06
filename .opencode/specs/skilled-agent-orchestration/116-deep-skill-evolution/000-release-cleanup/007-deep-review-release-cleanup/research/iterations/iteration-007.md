# Iter 007 — CP-052..057 command-flow stress tests vs command/YAML contracts drift

## Question

Of the 6 CP-052..057 command-flow stress-test scenarios under `.opencode/skills/deep-review/manual_testing_playbook/07--command-flow-stress-tests/`, which test contracts that are NOT actually present in `.opencode/commands/deep/start-review-loop.md` or `.opencode/commands/deep/assets/deep_start-review-loop_{auto,confirm}.yaml`? Conversely, which command/YAML contracts have NO CP scenario exercising them?

## Evidence (file:line citations required)

### CP-052: Setup-to-YAML handoff contract
- CP-052 tests: command setup resolves inputs (target, mode, dimensions, spec folder, max iterations, convergence) before YAML execution <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-review/manual_testing_playbook/07--command-flow-stress-tests/setup-yaml-handoff.md" lines="14-18" />
- Command markdown has PRE-BOUND SETUP ANSWERS schema for :auto non-interactive dispatch <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/commands/deep/start-review-loop.md" lines="66-95" />
- Command has three-tier resolution contract (Tier 1: resolve confidently, Tier 2: targeted ask, Tier 3: fail fast) <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/commands/deep/start-review-loop.md" lines="56-62" />
- YAML has step_preflight_contract that validates required setup bindings before any file writes <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/commands/deep/assets/deep_start-review-loop_auto.yaml" lines="132-139" />
- YAML has step_create_config that creates deep-review-config.json with all required fields <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/commands/deep/assets/deep_start-review-loop_auto.yaml" lines="286-321" />

### CP-053: Three-artifact iteration contract
- CP-053 tests: post-dispatch produces iteration markdown, state JSONL with "type":"iteration", and delta JSONL <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-review/manual_testing_playbook/07--command-flow-stress-tests/three-artifact-iteration-contract.md" lines="14-18" />
- YAML defines iteration_pattern: "{artifact_dir}/iterations/iteration-{NNN}.md" <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/commands/deep/assets/deep_start-review-loop_auto.yaml" lines="100" />
- YAML defines delta_pattern: "{artifact_dir}/deltas/iter-{NNN}.jsonl" with note that it MUST contain at least one record with `type === "iteration"` <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/commands/deep/assets/deep_start-review-loop_auto.yaml" lines="102-105" />
- YAML defines state_log: "{artifact_dir}/deep-review-state.jsonl" <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/commands/deep/assets/deep_start-review-loop_auto.yaml" lines="93" />
- YAML has step_dispatch_iteration for agent dispatch <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/commands/deep/assets/deep_start-review-loop_auto.yaml" lines="651" />
- YAML has post_dispatch_validate that asserts iteration_pattern and state_log exist <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/commands/deep/assets/deep_start-review-loop_auto.yaml" lines="928-960" />

### CP-054: Resource-map coverage gate
- CP-054 tests: resource-map presence is persisted in config/state and referenced in strategy or report output <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-review/manual_testing_playbook/07--command-flow-stress-tests/resource-map-coverage-gate.md" lines="14-18" />
- YAML has step_detect_resource_map that inspects {spec_folder}/resource-map.md before config creation <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/commands/deep/assets/deep_start-review-loop_auto.yaml" lines="145-154" />
- YAML step_create_config populates resource_map_present field <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/commands/deep/assets/deep_start-review-loop_auto.yaml" lines="301" />
- YAML step_create_state_log includes resource_map_present and resource_map.emit in the config record <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/commands/deep/assets/deep_start-review-loop_auto.yaml" lines="328" />
- YAML has step_enrich_strategy_resource_map that injects resource-map status into Known Context <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/commands/deep/assets/deep_start-review-loop_auto.yaml" lines="355-358" />
- YAML step_read_state extracts resource_map_present and resource_map_prompt_line for each iteration <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/commands/deep/assets/deep_start-review-loop_auto.yaml" lines="395-396" />
- YAML has step_resource_map_coverage_gate in synthesis phase <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/commands/deep/assets/deep_start-review-loop_auto.yaml" lines="1219-1221" />

### CP-055: Synthesis and save boundary
- CP-055 tests: synthesis writes review artifacts and routes continuity via generate-context.js, not retired memory files <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-review/manual_testing_playbook/07--command-flow-stress-tests/synthesis-save-boundary.md" lines="14-18" />
- YAML has phase_synthesis with step_compile_review_report that creates review-report.md <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/commands/deep/assets/deep_start-review-loop_auto.yaml" lines="1124-1276" />
- YAML has step_generate_context that routes continuity via generate-context.js <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/commands/deep/assets/deep_start-review-loop_auto.yaml" lines="1301-1304" />
- YAML critical_rule: "NEVER manually author files under retired memory/ paths; use generate-context.js" <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/commands/deep/assets/deep_start-review-loop_auto.yaml" lines="1304" />
- Command markdown references generate-context.js in workflow overview and memory integration <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/commands/deep/start-review-loop.md" lines="290,365" />

### CP-056: LEAF-only nested dispatch refusal
- CP-056 tests: @deep-review body refuses nested agent dispatch requests instead of delegating <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-review/manual_testing_playbook/07--command-flow-stress-tests/leaf-only-nested-dispatch-refusal.md" lines="14-18" />
- Agent markdown has ILLEGAL NESTING (HARD BLOCK) section <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/agents/deep-review.md" lines="51-71" />
- Agent markdown: "NEVER use the Task tool" <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/agents/deep-review.md" lines="56" />
- Agent markdown: canonical refusal wording "REFUSE: nested Task tool dispatch is forbidden for LEAF agents" <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/agents/deep-review.md" lines="67-69" />
- YAML agent_config has leaf_only: true <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/commands/deep/assets/deep_start-review-loop_auto.yaml" lines="75" />
- YAML has step_marker_scan to detect nested review markers <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/commands/deep/assets/deep_start-review-loop_auto.yaml" lines="635-650" />

### CP-057: Write boundary and reducer-owned files
- CP-057 tests: @deep-review refuses instructions to edit review targets, runtime mirrors, config, registry, dashboard, or report files <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-review/manual_testing_playbook/07--command-flow-stress-tests/write-boundary-reducer-owned-files.md" lines="14-18" />
- Agent markdown SPEC FOLDER PERMISSION: "@deep-review may write only the resolved local-owner review packet... Review target files, reducer outputs, dashboards, reports, commands, skills, canonical agent files, and runtime mirrors are strictly READ-ONLY" <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/agents/deep-review.md" lines="35" />
- Agent markdown: "Treat review target paths as read-only even when write permissions are technically available" <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/agents/deep-review.md" lines="94" />
- Agent markdown: "Treat config and findings registry as read-only" <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/agents/deep-review.md" lines="148" />
- Agent markdown: "This leaf agent must not overwrite reducer-owned files" <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/agents/deep-review.md" lines="359" />
- Agent markdown Write Safety: "Only write to review/iterations/iteration-NNN.md, review/deep-review-strategy.md, and review/deep-review-state.jsonl. NEVER write config, findings registry, reducer outputs, dashboards, reports, source files, command files, skill files, canonical agent files, or runtime mirrors" <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/agents/deep-review.md" lines="393-395" />
- YAML invariants include "treat_review_target_as_read_only" <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/commands/deep/assets/deep_start-review-loop_auto.yaml" lines="1360" />

## Findings (numbered)

**Finding 1: No drift detected between CP-052..057 scenarios and command/YAML contracts**

All 6 CP-052..057 command-flow stress-test scenarios test contracts that are actually present in the command and YAML surfaces:

1. **CP-052 (Setup-to-YAML handoff)**: The command markdown has the PRE-BOUND SETUP ANSWERS schema and three-tier resolution contract, and the YAML has step_preflight_contract and step_create_config that validate and persist setup bindings. <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/commands/deep/start-review-loop.md" lines="66-95" /> <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/commands/deep/assets/deep_start-review-loop_auto.yaml" lines="132-139" />

2. **CP-053 (Three-artifact iteration contract)**: The YAML defines iteration_pattern, delta_pattern, and state_log paths, has step_dispatch_iteration, and post_dispatch_validate asserts these artifacts exist. <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/commands/deep/assets/deep_start-review-loop_auto.yaml" lines="100,105,93,651,928-960" />

3. **CP-054 (Resource-map coverage gate)**: The YAML has step_detect_resource_map, populates resource_map_present in config and state_log, has step_enrich_strategy_resource_map, and step_resource_map_coverage_gate in synthesis. <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/commands/deep/assets/deep_start-review-loop_auto.yaml" lines="145-154,301,328,355-358,1219-1221" />

4. **CP-055 (Synthesis and save boundary)**: The YAML has phase_synthesis with step_compile_review_report, step_generate_context with generate-context.js routing, and a critical_rule forbidding retired memory/ paths. <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/commands/deep/assets/deep_start-review-loop_auto.yaml" lines="1124-1276,1301-1304" />

5. **CP-056 (LEAF-only nested dispatch refusal)**: The agent markdown has ILLEGAL NESTING (HARD BLOCK) section with canonical refusal wording, and the YAML has leaf_only: true and step_marker_scan for nested review detection. <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/agents/deep-review.md" lines="51-71" /> <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/commands/deep/assets/deep_start-review-loop_auto.yaml" lines="75,635-650" />

6. **CP-057 (Write boundary and reducer-owned files)**: The agent markdown has SPEC FOLDER PERMISSION section, treats review targets as read-only, treats config and registry as read-only, and has Write Safety rules limiting writes to iteration artifacts, strategy, and JSONL only. <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/agents/deep-review.md" lines="35,94,148,359,393-395" />

**Finding 2: Command/YAML contracts without CP scenario coverage**

The following command/YAML contracts exist but have no dedicated CP scenario exercising them:

1. **Legacy state migration contract**: YAML has step_migrate_legacy_review_state that rehomes legacy review artifacts from scratch/ to review/iterations, but no CP scenario tests this migration path. <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/commands/deep/assets/deep_start-review-loop_auto.yaml" lines="156-188" />

2. **Session classification (resume/restart/completed-session/invalid-state)**: YAML has step_classify_session with multiple lifecycle branches, but no CP scenario tests resume, restart, or completed-session flows. <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/commands/deep/assets/deep_start-review-loop_auto.yaml" lines="190-224" />

3. **Graph convergence gate**: YAML has step_graph_convergence that calls convergence.cjs before the inline review stop vote, but no CP scenario tests graph-assisted convergence detection. <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/commands/deep/assets/deep_start-review-loop_auto.yaml" lines="419-438" />

4. **Legal-stop decision tree gates**: YAML has complex legal-stop decision tree with multiple gates (convergenceGate, dimensionCoverageGate, p0ResolutionGate, evidenceDensityGate, hotspotSaturationGate, claimAdjudicationGate, fixCompletenessReplayGate, candidateCoverageGate, graphlessFallbackGate), but no CP scenario tests these gates individually. <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/commands/deep/assets/deep_start-review-loop_auto.yaml" lines="440-560" />

5. **Executor dispatch variants**: YAML has multiple executor dispatch branches (native, cli-codex, cli-copilot, cli-gemini, cli-claude-code, cli-opencode, cli-devin), but no CP scenario tests non-native executors. <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/commands/deep/assets/deep_start-review-loop_auto.yaml" lines="696-927" />

6. **Stuck detection and recovery**: YAML has stuck detection with threshold 2 and stuck recovery logic, but no CP scenario tests stuck recovery. <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/commands/deep/assets/deep_start-review-loop_auto.yaml" lines="456-457,612-614" />

7. **Pause sentinel handling**: YAML has step_check_pause_sentinel, but no CP scenario tests manual pause/resume. <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/commands/deep/assets/deep_start-review-loop_auto.yaml" lines="407-417" />

## Gaps for next iter

1. **Add CP scenarios for untested command/YAML contracts**: Create CP scenarios for legacy state migration, session classification (resume/restart/completed-session), graph convergence gate, legal-stop decision tree gates, executor dispatch variants, stuck detection/recovery, and pause sentinel handling.

2. **Verify CP-056 and CP-057 body-level enforcement**: While the agent contracts exist, the CP scenarios test body-level behavior by prepending the agent body to bait instructions. Verify that the actual agent body enforces these contracts at runtime when invoked through the YAML workflow.

3. **Review CP-054 resource-map coverage gate implementation**: While the contract exists, verify that the step_resource_map_coverage_gate actually cross-checks target_files from applied/T-*.md against resource-map.md and produces the expected coverage classifications.

## JSONL delta row

```jsonl
{"iter_id":"007","timestamp_utc":"2026-05-23T17:41:00.000Z","executor":"cli-devin","model":"swe-1.6","status":"complete","findings_count":2,"gaps_count":3,"primary_evidence_files":[".opencode/skills/deep-review/manual_testing_playbook/07--command-flow-stress-tests/setup-yaml-handoff.md",".opencode/skills/deep-review/manual_testing_playbook/07--command-flow-stress-tests/three-artifact-iteration-contract.md",".opencode/skills/deep-review/manual_testing_playbook/07--command-flow-stress-tests/resource-map-coverage-gate.md",".opencode/skills/deep-review/manual_testing_playbook/07--command-flow-stress-tests/synthesis-save-boundary.md",".opencode/skills/deep-review/manual_testing_playbook/07--command-flow-stress-tests/leaf-only-nested-dispatch-refusal.md",".opencode/skills/deep-review/manual_testing_playbook/07--command-flow-stress-tests/write-boundary-reducer-owned-files.md",".opencode/commands/deep/start-review-loop.md",".opencode/commands/deep/assets/deep_start-review-loop_auto.yaml",".opencode/commands/deep/assets/deep_start-review-loop_confirm.yaml",".opencode/agents/deep-review.md"]}
```