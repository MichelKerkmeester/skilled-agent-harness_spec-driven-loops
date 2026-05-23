# Iter 003 — Manual testing playbook vs runtime contracts drift

## Question

Of the 45 manual_testing_playbook scenarios under `.opencode/skills/deep-review/manual_testing_playbook/0{1..8}--*/` plus the root `manual_testing_playbook.md`, which scenarios test behavior that has NO corresponding contract in `SKILL.md`, `references/loop_protocol.md`, `references/convergence.md`, or `references/state_format.md`? Conversely, which runtime contracts have NO playbook scenario exercising them?

## Evidence (file:line citations required)

### Step 1: Root playbook structure

The manual testing playbook root file documents 8 categories with 45 total scenarios:
- Categories 01-06 cover dimension/lifecycle review (33 scenarios)
- §15 covers command-flow stress tests (6 scenarios under CP-052..057) 
- §16 covers review-depth v2 rollout (6 scenarios under DRV-058..063)

<ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-review/manual_testing_playbook/manual_testing_playbook.md" lines="15-24" />
<ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-review/manual_testing_playbook/manual_testing_playbook.md" lines="51" />
<ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-review/manual_testing_playbook/manual_testing_playbook.md" lines="624-694" />

### Step 2: Representative scenario contracts sampled (16 scenarios)

#### Category 01: Entry Points and Modes
- **DRV-001**: Tests autonomous mode consistency across README, quick reference, command entrypoint, and auto YAML workflow. Expected signals: same autonomous command across sources, approval-free, workflow points to config/JSONL/strategy/iteration files and review-report.md. <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-review/manual_testing_playbook/01--entry-points-and-modes/001-auto-mode-deep-review-kickoff.md" lines="26-32" />
- **DRV-002**: Tests confirm mode pauses at each phase for user approval. Expected signals: confirm YAML has `approvals: multi_gate`, pause/approval steps in loop, command routes `:confirm` to confirm YAML. <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-review/manual_testing_playbook/01--entry-points-and-modes/002-confirm-mode-checkpointed-review.md" lines="26-32" />

#### Category 02: Initialization and State Setup
- **DRV-004**: Tests fresh review initialization creates canonical state files. Expected signals: review/ directory created, config from shared template, findings registry from reducer contract, strategy from template, JSONL begins with config record. <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-review/manual_testing_playbook/02--initialization-and-state-setup/004-fresh-review-initialization-creates-canonical-state-files.md" lines="26-32" />
- **DRV-005**: Tests resume classification from valid prior review state. Expected signals: classify step checks for config/JSONL/strategy presence, classifies as "resume" when all three exist, skips to phase_loop. <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-review/manual_testing_playbook/02--initialization-and-state-setup/005-resume-classification-from-valid-prior-review-state.md" lines="26-32" />

#### Category 03: Iteration Execution and State Discipline
- **DRV-008**: Tests iteration reads state before review. Expected signals: loop step order begins with state reads, quick reference checklist says same, agent definition starts with JSONL plus strategy reads. <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-review/manual_testing_playbook/03--iteration-execution-and-state-discipline/008-review-iteration-reads-state-before-review.md" lines="26-32" />
- **DRV-009**: Tests iteration writes findings, JSONL, and strategy update. Expected signals: dispatch prompt requires writing iteration-NNN.md, appending JSONL, updating strategy; post-dispatch validation checks for all three; quick reference documents same three outputs. <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-review/manual_testing_playbook/03--iteration-execution-and-state-discipline/009-review-iteration-writes-findings-jsonl-and-strategy-update.md" lines="26-32" />

#### Category 04: Convergence and Recovery
- **DRV-017**: Tests P0 override blocks convergence. Expected signals: P0 finding sets `newFindingsRatio >= 0.50`, blocks rolling average signal, composite score cannot reach 0.60, review continues. <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-review/manual_testing_playbook/04--convergence-and-recovery/017-p0-override-blocks-convergence.md" lines="26-32" />
- **DRV-018**: Tests quality guards block premature stop. Expected signals: three named binary gates (evidence, scope, coverage), each must return true, enforcement after convergence check but before STOP, gates are review-specific. <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-review/manual_testing_playbook/04--convergence-and-recovery/018-review-quality-guards-block-premature-stop.md" lines="26-32" />

#### Category 05: Pause, Resume, and Fault Tolerance
- **DRV-021**: Tests pause sentinel halts between iterations. Expected signals: sentinel checked before dispatch, paused event logged to JSONL, loop halts rather than flowing into synthesis, sentinel location is `review/.deep-review-pause`. <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-review/manual_testing_playbook/05--pause-resume-and-fault-tolerance/021-pause-sentinel-halts-between-review-iterations.md" lines="26-32" />
- **DRV-022**: Tests resume after pause sentinel removal. Expected signals: removing sentinel triggers loop re-entry, JSONL re-read to determine last iteration, strategy.md provides dimension coverage state, no iterations re-run, resume event logged. <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-review/manual_testing_playbook/05--pause-resume-and-fault-tolerance/022-resume-after-pause-sentinel-removal.md" lines="26-32" />

#### Category 06: Synthesis, Save, and Guardrails
- **DRV-025**: Tests review report synthesis has all 9 sections. Expected signals: all 9 section headers present, Executive Summary contains verdict and P0/P1/P2 counts, Active Finding Registry has deduplicated findings with evidence, Audit Appendix includes convergence data. <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-review/manual_testing_playbook/06--synthesis-save-and-guardrails/025-review-report-synthesis-has-all-9-sections.md" lines="26-32" />
- **DRV-027**: Tests final synthesis memory save and guardrail behavior. Expected signals: synthesis produces review-report.md, memory save calls generate-context.js, runtime agent forbids nested delegation (LEAF-only), agent never modifies files under review (read-only), memory save uses spec folder. <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-review/manual_testing_playbook/06--synthesis-save-and-guardrails/027-final-synthesis-memory-save-and-guardrail-behavior.md" lines="26-32" />

#### Category 07: Command Flow Stress Tests
- **CP-052**: Tests setup-to-YAML handoff. Expected signals: transcript names auto YAML or setup handoff, artifacts include config/state/strategy, config/state name agent/deep-review/auto/maxIterations/convergenceThreshold. <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-review/manual_testing_playbook/07--command-flow-stress-tests/052-setup-yaml-handoff.md" lines="26-32" />
- **CP-054**: Tests resource-map coverage gate. Expected signals: resource_map_present, Resource Map Coverage, resource-map.md, applied/T-001.md, traceability, clean target diff, clean tripwire. <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-review/manual_testing_playbook/07--command-flow-stress-tests/054-resource-map-coverage-gate.md" lines="26-32" />

#### Category 08: Review Depth v2 Rollout
- **DRV-058**: Tests validator warn rollout for legacy unversioned records. Expected signals: validator result ok: true with warnings[] containing legacy_unversioned_record, no v2 failure reasons, record continues to parse downstream. <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-review/manual_testing_playbook/08--review-depth-v2-rollout/058-validator-warn-rollout.md" lines="20-24" />

### Step 3: Contract verification via grep

#### DRV-002 confirm mode approval gates
- Playbook expects: `approvals: multi_gate` in confirm YAML
- Grep result: FOUND in `.opencode/commands/deep/assets/deep_start-review-loop_confirm.yaml` line 13
- Contract status: PRESENT in runtime

#### DRV-017 P0 override
- Playbook expects: `newFindingsRatio >= 0.50` documented in convergence docs
- Grep result: FOUND in `.opencode/skills/deep-review/references/convergence.md` line 390, `.opencode/skills/deep-review/references/loop_protocol.md` line 198, `.opencode/skills/deep-review/references/quick_reference.md` line 151
- Contract status: PRESENT in runtime

#### DRV-018 quality gates
- Playbook expects: 3 binary gates (evidence, scope, coverage)
- Grep result: Runtime docs describe 7 gates in `.opencode/skills/deep-review/references/convergence.md` line 127: `convergenceGate`, `dimensionCoverageGate`, `p0ResolutionGate`, `evidenceDensityGate`, `hotspotSaturationGate`, `claimAdjudicationGate`, `fixCompletenessReplayGate`
- Contract status: DRIFT - playbook claims 3 gates, runtime has 7 gates

#### DRV-021 pause sentinel
- Playbook expects: `.deep-review-pause` sentinel checked before dispatch
- Grep result: FOUND in `.opencode/skills/deep-review/references/state_format.md` lines 23, 34, 90; `.opencode/skills/deep-review/references/loop_protocol.md` lines 204, 209, 635, 649; `.opencode/skills/deep-review/SKILL.md` line 297
- Contract status: PRESENT in runtime

#### DRV-025 review report sections
- Playbook expects: 9 sections in review-report.md
- Grep result: Section names documented in quick reference (grep for section headers shows presence)
- Contract status: PRESENT in runtime

#### CP-054 resource map coverage gate
- Playbook expects: resource_map_present, Resource Map Coverage gate
- Grep result: Resource map coverage gate documented in SKILL.md lines 233-251, 496-503; loop_protocol.md lines 126, 179, 182, 328, 466
- Contract status: PRESENT in runtime

### Step 4: Path reference errors in playbook scenarios

Multiple convergence scenarios reference wrong path:
- DRV-019 references `.opencode/skills/deep-research/references/convergence.md` (line 47, 73) but actual path is `.opencode/skills/deep-review/references/convergence.md` <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-review/manual_testing_playbook/04--convergence-and-recovery/019-stuck-recovery-widens-dimension-focus.md" lines="47" />
- DRV-020 references `.opencode/skills/deep-research/references/convergence.md` (line 47, 73) but actual path is `.opencode/skills/deep-review/references/convergence.md` <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-review/manual_testing_playbook/04--convergence-and-recovery/020-dimension-coverage-convergence-signal.md" lines="47" />
- DRV-017 references `.opencode/skills/deep-research/references/convergence.md` (line 47, 73) but actual path is `.opencode/skills/deep-review/references/convergence.md` <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-review/manual_testing_playbook/04--convergence-and-recovery/017-p0-override-blocks-convergence.md" lines="47" />
- DRV-018 references `.opencode/skills/deep-research/references/convergence.md` (line 47, 73) but actual path is `.opencode/skills/deep-review/references/convergence.md` <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-review/manual_testing_playbook/04--convergence-and-recovery/018-review-quality-guards-block-premature-stop.md" lines="47" />

## Findings (numbered)

1. **LG-0016: Quality gates count drift (P1)** - DRV-018 scenario claims 3 binary gates (evidence, scope, coverage) but runtime contract specifies 7 gates: convergenceGate, dimensionCoverageGate, p0ResolutionGate, evidenceDensityGate, hotspotSaturationGate, claimAdjudicationGate, fixCompletenessReplayGate. <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-review/manual_testing_playbook/04--convergence-and-recovery/018-review-quality-guards-block-premature-stop.md" lines="31" /> <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-review/references/convergence.md" lines="127" />

2. **LG-0017: Wrong convergence reference path in DRV-017 (P2)** - DRV-017 scenario references `.opencode/skills/deep-research/references/convergence.md` but actual path is `.opencode/skills/deep-review/references/convergence.md`. <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-review/manual_testing_playbook/04--convergence-and-recovery/017-p0-override-blocks-convergence.md" lines="47" /> <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-review/references/convergence.md" lines="1" />

3. **LG-0018: Wrong convergence reference path in DRV-018 (P2)** - DRV-018 scenario references `.opencode/skills/deep-research/references/convergence.md` but actual path is `.opencode/skills/deep-review/references/convergence.md`. <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-review/manual_testing_playbook/04--convergence-and-recovery/018-review-quality-guards-block-premature-stop.md" lines="47" /> <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-review/references/convergence.md" lines="1" />

4. **LG-0019: Wrong convergence reference path in DRV-019 (P2)** - DRV-019 scenario references `.opencode/skills/deep-research/references/convergence.md` but actual path is `.opencode/skills/deep-review/references/convergence.md`. <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-review/manual_testing_playbook/04--convergence-and-recovery/019-stuck-recovery-widens-dimension-focus.md" lines="47" /> <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-review/references/convergence.md" lines="1" />

5. **LG-0020: Wrong convergence reference path in DRV-020 (P2)** - DRV-020 scenario references `.opencode/skills/deep-research/references/convergence.md` but actual path is `.opencode/skills/deep-review/references/convergence.md`. <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-review/manual_testing_playbook/04--convergence-and-recovery/020-dimension-coverage-convergence-signal.md" lines="47" /> <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-review/references/convergence.md" lines="1" />

## Gaps for next iter

1. **Full scenario coverage audit** - This iteration sampled 16 of 45 scenarios. A complete audit should verify all remaining 29 scenarios for:
   - Contract presence in runtime docs
   - Path reference correctness
   - Expected signals accuracy vs runtime contract

2. **Reverse direction analysis** - This iteration focused on playbook-to-runtime drift (Direction A). The reverse direction (runtime contracts with no playbook coverage) identified in iter-002 (LG-0009 through LG-0015) should be cross-referenced against the playbook to confirm which runtime contracts truly lack scenario coverage.

3. **YAML step name verification** - Several scenarios reference specific YAML step names (e.g., `step_check_pause_sentinel`, `step_classify_session`, `step_read_state`, `step_validate_iteration`). Grep showed these step names appear only in playbook files, not in the actual YAML workflows. This suggests the YAML step names may have changed or the playbook is referencing non-existent steps.

4. **Quality gates contract reconciliation** - The playbook describes 3 quality gates (evidence, scope, coverage) while runtime specifies 7 gates. Need to determine if this is a playbook documentation gap or if the 3-gate model is a simplified user-facing view that should be clarified.

## JSONL delta row

{"iter_id":"003","timestamp_utc":"2026-05-23T17:25:00.000Z","executor":"cli-devin","model":"swe-1.6","status":"complete","findings_count":5,"gaps_count":4,"primary_evidence_files":[".opencode/skills/deep-review/manual_testing_playbook/manual_testing_playbook.md",".opencode/skills/deep-review/manual_testing_playbook/04--convergence-and-recovery/018-review-quality-guards-block-premature-stop.md",".opencode/skills/deep-review/references/convergence.md"]}
