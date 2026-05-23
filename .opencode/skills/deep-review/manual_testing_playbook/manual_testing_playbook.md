---
title: "deep-review: Manual Testing Playbook"
description: "Operator-facing reference combining the manual testing directory, integrated review protocol, orchestration guidance, and per-scenario validation files for the deep-review skill."
---

# deep-review: Manual Testing Playbook

> **EXECUTION POLICY**: Every scenario MUST be executed for real — not mocked, not stubbed, not classified as "unautomatable". AI agents executing these scenarios must run the actual commands, inspect real files, call real handlers, and verify real outputs. The only acceptable classifications are PASS, FAIL, or SKIP (with a specific sandbox blocker documented). "UNAUTOMATABLE" is not a valid status.


This document combines the operator-facing manual testing contract for the `deep-review` skill into a single reference. The root playbook acts as the directory, review protocol, and orchestration guide while the per-feature files carry the scenario-specific execution truth.

---

Canonical package artifacts:
- `manual_testing_playbook.md`
- `01--entry-points-and-modes/`
- `02--initialization-and-state-setup/`
- `03--iteration-execution-and-state-discipline/`
- `04--convergence-and-recovery/`
- `05--pause-resume-and-fault-tolerance/`
- `06--synthesis-save-and-guardrails/`
- `07--command-flow-stress-tests/`
- `08--review-depth-v2-rollout/`

---

## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. GLOBAL PRECONDITIONS](#2--global-preconditions)
- [3. GLOBAL EVIDENCE REQUIREMENTS](#3--global-evidence-requirements)
- [4. DETERMINISTIC COMMAND NOTATION](#4--deterministic-command-notation)
- [5. REVIEW PROTOCOL AND RELEASE READINESS](#5--review-protocol-and-release-readiness)
- [6. SUB-AGENT ORCHESTRATION AND WAVE PLANNING](#6--sub-agent-orchestration-and-wave-planning)
- [7. ENTRY POINTS AND MODES](#7--entry-points-and-modes)
- [8. INITIALIZATION AND STATE SETUP](#8--initialization-and-state-setup)
- [9. ITERATION EXECUTION AND STATE DISCIPLINE](#9--iteration-execution-and-state-discipline)
- [10. CONVERGENCE AND RECOVERY](#10--convergence-and-recovery)
- [11. PAUSE, RESUME, AND FAULT TOLERANCE](#11--pause-resume-and-fault-tolerance)
- [12. SYNTHESIS, SAVE, AND GUARDRAILS](#12--synthesis-save-and-guardrails)
- [13. AUTOMATED TEST CROSS-REFERENCE](#13--automated-test-cross-reference)
- [14. FEATURE CATALOG CROSS-REFERENCE INDEX](#14--feature-catalog-cross-reference-index)
- [15. COMMAND FLOW STRESS TESTS](#15--command-flow-stress-tests)
- [16. REVIEW DEPTH V2 ROLLOUT](#16--review-depth-v2-rollout)

---

## 1. OVERVIEW

This playbook provides 45 deterministic scenarios across 8 categories validating the current `deep-review` skill surface. The first 6 categories cover dimension/lifecycle review (33 scenarios); §15 covers command-flow stress tests (6 scenarios under CP-052..057), and §16 covers the review-depth v2 rollout (6 scenarios under DRV-058..063). Each scenario maps to a dedicated feature file with the canonical objective, prompt summary, expected signals, and live source anchors.

### REALISTIC TEST MODEL

1. Start from the user-facing review workflow rather than a synthetic command checklist.
2. Inspect public docs before lower-level workflow or runtime anchors when that order matters.
3. Capture enough evidence for another operator to reproduce the verdict without re-deriving the scenario.
4. Report a concise user-facing verdict, not just raw implementation notes.

---

## 2. GLOBAL PRECONDITIONS

- `deep-review` skill exists at `.opencode/skills/deep-review/`.
- `/deep:start-review-loop` command exists at `.opencode/commands/deep/start-review-loop.md`.
- `@deep-review` agent definition exists at `.opencode/agents/deep-review.md` plus runtime variants.
- Review YAML workflows exist at `.opencode/commands/deep/assets/deep_start-review-loop_auto.yaml` and `.opencode/commands/deep/assets/deep_start-review-loop_confirm.yaml`.
- `review_mode_contract.yaml` exists at `.opencode/skills/deep-review/assets/`.

---

## 3. GLOBAL EVIDENCE REQUIREMENTS

- A clear PASS/FAIL verdict with reasoning.
- Evidence captured from actual file contents instead of assumptions.
- Cross-source consistency checks across README, SKILL.md, command, YAML, and runtime agent surfaces.
- The exact prompt used for the scenario when the root summary is not enough on its own.

---

## 4. DETERMINISTIC COMMAND NOTATION

- Use `rg` and `sed` to gather deterministic evidence.
- Execute steps in order so higher-level user-facing surfaces are checked before lower-level workflow contracts whenever that sequencing matters.
- Keep the final verdict anchored to captured evidence rather than inferred behavior.

---

## 5. REVIEW PROTOCOL AND RELEASE READINESS

### Inputs Required

1. `manual_testing_playbook.md`
2. Referenced per-feature files under `manual_testing_playbook/NN--category-name/`
3. Scenario execution evidence including `review/iterations/iteration-NNN.md`, `review/deep-review-state.jsonl`, and `review/review-report.md` when synthesis runs
4. Feature-to-scenario coverage map (every DRV-NNN appears in section 14)
5. Triage notes for all non-pass outcomes including pause-sentinel halts, malformed-state recovery, and convergence stalls

### Scenario Acceptance Rules

For each executed scenario, check:

1. Preconditions were satisfied (state files initialized, prior review state validated where applicable, scope discovery complete).
2. The canonical prompt and command sequence were executed against the canonical deep-review surface.
3. Expected signals are present in the captured iteration files, JSONL events, and `review-report.md` when produced.
4. Evidence is complete and readable, including `deep-review-state.jsonl` events and any `graphEvents` arrays the scenario produces.
5. Outcome rationale is explicit and references the user-visible deliverable named in the scenario.

Scenario verdict:
- `PASS`: all acceptance checks true
- `PARTIAL`: core behavior works but non-critical evidence or metadata is incomplete
- `FAIL`: expected behavior missing, contradictory output, convergence misbehaves at a gate, P0 finding wrongly downgraded, or critical check failed

### Feature Verdict Rules

- `PASS`: all mapped scenarios for the feature are `PASS`
- `PARTIAL`: at least one mapped scenario is `PARTIAL`, none are `FAIL`
- `FAIL`: any mapped scenario is `FAIL`

Hard rule:
- Any critical-path scenario `FAIL` (DRV-001 auto-mode kickoff, DRV-005 resume classification, DRV-008/009 iteration read+write contract, DRV-017 P0 override, or DRV-027 final synthesis guardrail) forces feature verdict to `FAIL` and blocks release.

### Release Readiness Rule

Release is `READY` only when:

1. No feature verdict is `FAIL`.
2. All critical scenarios are `PASS`.
3. Coverage is 100% of playbook scenarios defined by the root index and backed by per-feature files (every DRV-NNN under a category folder is referenced in section 14).
4. No unresolved blocking triage item remains.
5. Pause sentinel and JSONL fault-tolerance scenarios (DRV-021..024 in pause-resume) have been exercised at least once and behaved as documented.

### Root-vs-Feature Rule

Keep global verdict logic in this root playbook. Put feature-specific acceptance caveats (state schema constraints, dimension-rotation expectations, graph-event payload shape) in the matching per-feature files.

---

## 6. SUB-AGENT ORCHESTRATION AND WAVE PLANNING

- Probe capacity before parallelizing review work.
- Keep one coordinator slot free when using sub-agents.
- Group scenarios by category so resume and synthesis artifacts are not mixed across waves.
- Run pause/resume and synthesis scenarios only after the entrypoint, initialization, and iteration categories are already verified.

---

## 7. ENTRY POINTS AND MODES

This category covers 3 scenario summaries while the linked feature files remain the canonical execution contract.

### DRV-001 | Auto mode deep-review kickoff

#### Description
Verify that autonomous mode is exposed consistently across the README, quick reference, command entrypoint, and auto YAML workflow.

#### Scenario Contract
Prompt: `Validate the autonomous deep-review entrypoint and report whether docs, command routing, YAML, and expected artifacts agree.`

Expected signals: The same autonomous command appears across sources, autonomous mode is approval-free, and the workflow points to config, JSONL, strategy, iteration files, and `review/review-report.md`.

#### Test Execution
> **Feature File:** [DRV-001](01--entry-points-and-modes/001-auto-mode-deep-review-kickoff.md)

### DRV-002 | Confirm mode checkpointed review

#### Description
Verify that `/deep:start-review-loop:confirm` pauses at each phase for user approval before proceeding.

#### Scenario Contract
Prompt: `Validate the confirm-mode deep-review entrypoint and report whether approval gates appear at every phase transition.`

Expected signals: The confirm YAML has `approvals: multi_gate`, pause/approval steps appear in the loop, and the command entrypoint routes `:confirm` to the confirm YAML.

#### Test Execution
> **Feature File:** [DRV-002](01--entry-points-and-modes/002-confirm-mode-checkpointed-review.md)

### DRV-003 | Parameterized invocation max-iterations and convergence

#### Description
Verify that `--max-iterations` (default 7) and `--convergence` (default 0.10) parameters work and are documented consistently.

#### Scenario Contract
Prompt: `Validate deep-review parameter handling for --max-iterations and --convergence across quick reference, command entrypoint, and YAML workflows.`

Expected signals: Default values of 7 and 0.10 appear consistently across all sources; the YAML writes these into `deep-review-config.json` during init.

#### Test Execution
> **Feature File:** [DRV-003](01--entry-points-and-modes/003-parameterized-invocation-max-iterations-convergence.md)


---

## 8. INITIALIZATION AND STATE SETUP

This category covers 4 scenario summaries while the linked feature files remain the canonical execution contract.

### DRV-004 | Fresh review initialization creates canonical state files

#### Description
Verify that a fresh session creates the canonical config, JSONL, strategy, and iteration directory from the shipped assets.

#### Scenario Contract
Prompt: `Validate fresh deep-review initialization and report whether all canonical review state files are created from live templates.`

Expected signals: The review/ directory is created, config comes from the shared deep-review config template, the findings registry is created from the reducer contract, strategy comes from the deep-review strategy template, and the JSONL begins with a config record.

#### Test Execution
> **Feature File:** [DRV-004](02--initialization-and-state-setup/004-fresh-review-initialization-creates-canonical-state-files.md)

### DRV-005 | Resume classification from valid prior review state

#### Description
Verify that resume detects existing review state and continues from the last completed iteration.

#### Scenario Contract
Prompt: `Validate deep-review resume classification from existing review state and report whether it skips directly to phase_loop.`

Expected signals: The classify step checks for config, JSONL, and strategy presence; classifies as "resume" when all three exist and are consistent; and skips to phase_loop.

#### Test Execution
> **Feature File:** [DRV-005](02--initialization-and-state-setup/005-resume-classification-from-valid-prior-review-state.md)

### DRV-006 | Invalid or contradictory review state halts for repair

#### Description
Verify that invalid state (missing JSONL, corrupted config, contradictory artifacts) halts with a repair message instead of proceeding.

#### Scenario Contract
Prompt: `Validate invalid deep-review state handling and report whether partial or contradictory state halts with a repair message.`

Expected signals: The classify step has an explicit "invalid-state" classification for partial or contradictory combinations; it halts with a descriptive message; the migration step also halts on canonical/legacy conflicts.

#### Test Execution
> **Feature File:** [DRV-006](02--initialization-and-state-setup/006-invalid-or-contradictory-review-state-halts-for-repair.md)

### DRV-007 | Scope discovery and dimension ordering

#### Description
Verify that scope discovery resolves target type to a file list and dimensions are ordered by risk priority (Correctness > Security > Traceability > Maintainability).

#### Scenario Contract
Prompt: `Validate deep-review scope discovery and dimension ordering for target resolution and Correctness > Security > Traceability > Maintainability.`

Expected signals: The scope discovery step has resolution rules for each target type (spec-folder, skill, agent, track, files); the dimension ordering step enforces correctness > security > traceability > maintainability; the quick reference dimension table matches.

#### Test Execution
> **Feature File:** [DRV-007](02--initialization-and-state-setup/007-scope-discovery-and-dimension-ordering.md)


---

## 9. ITERATION EXECUTION AND STATE DISCIPLINE

This category covers 8 scenario summaries while the linked feature files remain the canonical execution contract.

### DRV-008 | Review iteration reads state before review

#### Description
Verify that each dispatched @deep-review iteration reads JSONL and strategy state before performing any review actions.

#### Scenario Contract
Prompt: `Validate that each deep-review iteration reads JSONL and strategy state before any review actions.`

Expected signals: Loop step order begins with state reads, the quick reference checklist says the same, and the agent definition starts with JSONL plus strategy reads.

#### Test Execution
> **Feature File:** [DRV-008](03--iteration-execution-and-state-discipline/008-review-iteration-reads-state-before-review.md)

### DRV-009 | Review iteration writes findings, JSONL, and strategy update

#### Description
Verify that each iteration writes iteration-NNN.md with P0/P1/P2 findings, appends a JSONL record, and updates the strategy.

#### Scenario Contract
Prompt: `Validate the deep-review per-iteration write contract for iteration markdown, JSONL severity counts, and strategy updates.`

Expected signals: The dispatch prompt requires writing iteration-NNN.md, appending JSONL, and updating strategy; the post-dispatch validation checks for all three; the quick reference checklist documents the same three outputs.

#### Test Execution
> **Feature File:** [DRV-009](03--iteration-execution-and-state-discipline/009-review-iteration-writes-findings-jsonl-and-strategy-update.md)

### DRV-010 | Strategy next focus and dimension rotation

#### Description
Verify that the strategy rotates through dimensions and respects exhausted approaches.

#### Scenario Contract
Prompt: `Validate deep-review dimension rotation through strategy Next Focus and skipped exhausted dimensions.`

Expected signals: The read-state step extracts the next uncovered dimension; the dispatch step injects it as the focus; the strategy template has a "Next Focus" section; the convergence docs require all dimensions to be covered.

#### Test Execution
> **Feature File:** [DRV-010](03--iteration-execution-and-state-discipline/010-strategy-next-focus-and-dimension-rotation.md)

### DRV-011 | Cross-reference verification detects misalignment

#### Description
Verify that cross-reference checks (spec_code, checklist_evidence, skill_agent protocols) detect misalignment between documentation and implementation.

#### Scenario Contract
Prompt: `Validate deep-review traceability cross-reference checks and confirm the configured protocols dispatch correctly.`

Expected signals: The config includes crossReference with core and overlay protocols; the dispatch prompt includes traceability constraints; the strategy template tracks cross-reference results; the quality guards require cross-reference checks before convergence.

#### Test Execution
> **Feature File:** [DRV-011](03--iteration-execution-and-state-discipline/011-cross-reference-verification-detects-misalignment.md)

### DRV-012 | Adversarial self-check runs on P0 findings

#### Description
Verify that the Hunter/Skeptic/Referee adversarial self-check runs on P0 candidates before recording them as confirmed findings.

#### Scenario Contract
Prompt: `Validate that deep-review runs adversarial self-checks on P0 findings before accepting them.`

Expected signals: Rule 10 in SKILL.md mandates adversarial self-check for P0; the iteration checklist includes it as step 5; the YAML has a claim adjudication step that checks for P0/P1 self-check evidence; the agent definitions describe the Hunter/Skeptic/Referee roles.

#### Test Execution
> **Feature File:** [DRV-012](03--iteration-execution-and-state-discipline/012-adversarial-self-check-runs-on-p0-findings.md)

### DRV-013 | Review dashboard generation after iteration

#### Description
Verify that the dashboard with Findings Summary, Progress Table, Coverage, and Trend is generated after each iteration.

#### Scenario Contract
Prompt: `Validate deep-review dashboard generation after each iteration from JSONL and strategy state.`

Expected signals: The step_generate_dashboard runs after step_validate_iteration; it reads JSONL and strategy; it writes to deep-review-dashboard.md; the output includes Findings Summary, Progress Table, Coverage, and Next Focus sections.

#### Test Execution
> **Feature File:** [DRV-013](03--iteration-execution-and-state-discipline/013-review-dashboard-generation-after-iteration.md)

### DRV-014 | Severity classification in JSONL

#### Description
Verify that findingsSummary and findingsNew fields in JSONL include P0/P1/P2 counts for every iteration record.

#### Scenario Contract
Prompt: `Validate deep-review JSONL severity classification for findingsSummary, findingsNew, and convergence severity weights.`

Expected signals: Rule 11 mandates the fields; the YAML dispatch prompt constrains them; the convergence algorithm references severity_weights with P0=10.0, P1=5.0, P2=1.0; the P0 override sets newFindingsRatio >= 0.50.

#### Test Execution
> **Feature File:** [DRV-014](03--iteration-execution-and-state-discipline/014-severity-classification-in-jsonl.md)

### DRV-015 | Review iterations emit structured graphEvents

#### Description
verify that a running deep review iteration writes a `graphEvents` array that includes review graph nodes such as `dimension_node`, `file_node`, and `finding_node`.

#### Scenario Contract
Prompt: `Validate deep-review graphEvents records for dimension, file, and finding nodes in graph-aware review convergence.`

Expected signals: `graphEvents` referenced as iteration-record input for graph-aware review convergence; replay tests include review node-type coverage for `dimension_node`, `file_node`, and `finding_node`.

#### Test Execution
> **Feature File:** [DRV-015](03--iteration-execution-and-state-discipline/015-graph-events-review.md)


---

## 10. CONVERGENCE AND RECOVERY

This category covers 9 scenario summaries while the linked feature files remain the canonical execution contract.

### DRV-030 | Stop on max iterations

#### Description
Verify review stops at maxIterations (default 7) even if dimensions remain uncovered.

#### Scenario Contract
Prompt: `Validate the deep-review hard iteration cap and report whether synthesis still runs after maxIterations stops the loop.`

Expected signals: `maxIterations=7` default, unconditional exit at that count, synthesis phase runs after hard stop, review-report.md is still produced.

#### Test Execution
> **Feature File:** [DRV-030](04--convergence-and-recovery/030-stop-on-max-iterations.md)

### DRV-031 | Composite review convergence stop behavior

#### Description
Verify 3-signal composite convergence (rolling avg 0.30, MAD 0.25, dimension coverage 0.45) with threshold 0.60.

#### Scenario Contract
Prompt: `Validate deep-review composite convergence scoring, including rolling average, MAD noise floor, dimension coverage, and stop threshold.`

Expected signals: Three named signals with weights 0.30/0.25/0.45, severity-weighted newFindingsRatio, rollingStopThreshold of 0.08, a composite stop threshold above 0.60, and dimension coverage requiring all 4 review dimensions.

#### Test Execution
> **Feature File:** [DRV-031](04--convergence-and-recovery/016-composite-review-convergence-stop-behavior.md)

### DRV-017 | P0 override blocks convergence

#### Description
Verify new P0 finding sets newFindingsRatio >= 0.50, blocking convergence.

#### Scenario Contract
Prompt: `Validate that new P0 findings block deep-review convergence by forcing a high newFindingsRatio.`

Expected signals: P0 finding sets `newFindingsRatio >= 0.50`, this blocks the rolling average signal from contributing to convergence, the composite score cannot reach 0.60, and review continues.

#### Test Execution
> **Feature File:** [DRV-017](04--convergence-and-recovery/017-p0-override-blocks-convergence.md)

### DRV-018 | Review quality guards block premature stop

#### Description
Verify 3 binary gates (evidence, scope, coverage) must all pass before STOP.

#### Scenario Contract
Prompt: `Validate deep-review quality guards for evidence, scope, and coverage before any STOP decision.`

Expected signals: Three named binary gates (evidence, scope, coverage), each must return true, enforcement happens after convergence check but before STOP transition, and gates are review-specific.

#### Test Execution
> **Feature File:** [DRV-018](04--convergence-and-recovery/018-review-quality-guards-block-premature-stop.md)

### DRV-019 | Stuck recovery widens dimension focus

#### Description
Verify stuck recovery switches to least-covered dimension.

#### Scenario Contract
Prompt: `Validate deep-review stuck recovery and report whether the loop switches to the least-covered dimension.`

Expected signals: `stuckThreshold=2` consecutive low-progress iterations trigger recovery, `noProgressThreshold=0.05` defines low progress, recovery selects the dimension with the lowest coverage count, strategy.md "Next Focus" is updated, and a stuck event is logged to JSONL.

#### Test Execution
> **Feature File:** [DRV-019](04--convergence-and-recovery/019-stuck-recovery-widens-dimension-focus.md)

### DRV-020 | Dimension coverage convergence signal

#### Description
Verify dimension coverage signal (weight 0.45) requires all 4 dimensions + minStabilizationPasses >= 1.

#### Scenario Contract
Prompt: `Validate the deep-review dimension coverage convergence signal and its stabilization requirement.`

Expected signals: Weight 0.45, all 4 dimensions required, `minStabilizationPasses=1`, signal contributes 0 until conditions are met, strategy.md "Covered" list tracks dimension coverage.

#### Test Execution
> **Feature File:** [DRV-020](04--convergence-and-recovery/020-dimension-coverage-convergence-signal.md)

### DRV-032 | Review graph convergence signals participate in legal-stop gates

#### Description
verify that when review stability signals nominate STOP but graph-backed dimension coverage remains below threshold, the legal-stop gates block premature STOP.

#### Scenario Contract
Prompt: `Validate the graph-backed legal-stop gate and report whether blocked-stop state persists when coverage fails.`

Expected signals: review convergence docs describe `blockedStop` when legal-stop gates fail; graph convergence handler enforces review `dimensionCoverage`; fixture evidence shows `blocked_stop` with `blockedBy: ["dimensionCoverage", ...]`.

#### Test Execution
> **Feature File:** [DRV-032](04--convergence-and-recovery/032-graph-convergence-review.md)

### DRV-033 | Review reducer surfaces blocked-stop history across registry, dashboard, and next-focus

#### Description
verify that a review packet with at least one `blocked_stop` event preserves the review-specific legal-stop bundle in `blockedStopHistory`, renders that blocked-stop evidence in the dashboard, and rewrites the strategy `next-focus` anchor with the recovery strategy.

#### Scenario Contract
Prompt: `Validate blocked-stop reducer surfacing in deep-review dashboard and strategy recovery output.`

Expected signals: `blockedStopHistory` is non-empty; review entries preserve `convergenceGate`, `dimensionCoverageGate`, `p0ResolutionGate`, `evidenceDensityGate`, and `hotspotSaturationGate`; `BLOCKED STOPS` renders the same blocked-stop data; the strategy `next-focus` anchor contains the blocked-stop recovery strategy.

#### Test Execution
> **Feature File:** [DRV-033](04--convergence-and-recovery/033-blocked-stop-reducer-surfacing.md)

### DRV-034 | Review reducer fails closed on corruption and missing anchors

#### Description
verify that malformed JSONL blocks the reducer unless `--lenient` is passed, that missing machine-owned anchors block strategy rewrites unless `--create-missing-anchors` is passed, and that `corruptionWarnings` remains visible in reducer-owned state even when lenient recovery is used.

#### Scenario Contract
Prompt: `Validate deep-review reducer fail-closed behavior for malformed JSONL and missing machine-owned anchors.`

Expected signals: corrupt JSONL exits `2` without `--lenient`; `corruptionWarnings` is populated in the registry; missing anchors throw `Missing machine-owned anchor ...`; `--lenient` exits `0` while preserving `corruptionWarnings`; `--create-missing-anchors` appends the `next-focus` anchor and allows the reducer to proceed.

#### Test Execution
> **Feature File:** [DRV-034](04--convergence-and-recovery/034-fail-closed-reducer.md)


---

## 11. PAUSE, RESUME, AND FAULT TOLERANCE

This category covers 4 scenario summaries while the linked feature files remain the canonical execution contract.

### DRV-021 | Pause sentinel halts between review iterations

#### Description
Verify that the `review/.deep-review-pause` sentinel halts the loop between iterations and logs a pause event.

#### Scenario Contract
Prompt: `Validate the deep-review pause sentinel and report whether the loop halts before synthesis.`

Expected signals: The sentinel is checked before dispatch, a paused event is logged to JSONL, the loop halts rather than flowing into synthesis, and the sentinel location is `review/.deep-review-pause`.

#### Test Execution
> **Feature File:** [DRV-021](05--pause-resume-and-fault-tolerance/021-pause-sentinel-halts-between-review-iterations.md)

### DRV-022 | Resume after pause sentinel removal

#### Description
Verify removing pause sentinel lets review resume from read-state.

#### Scenario Contract
Prompt: `Validate deep-review resume after pause removal and report whether the next iteration resumes without replay.`

Expected signals: Removing the sentinel triggers loop re-entry, JSONL is re-read to determine last iteration, strategy.md provides dimension coverage state, no iterations are re-run, and the resume event is logged.

#### Test Execution
> **Feature File:** [DRV-022](05--pause-resume-and-fault-tolerance/022-resume-after-pause-sentinel-removal.md)

### DRV-023 | Malformed JSONL lines are skipped with defaults

#### Description
Verify malformed JSONL lines are skipped gracefully in review state.

#### Scenario Contract
Prompt: `Validate malformed deep-review JSONL handling and report whether bad lines are skipped with safe defaults.`

Expected signals: Malformed lines are skipped (not crash), defaults applied (e.g., `newFindingsRatio = 1.0` to force continuation), iteration count still derived from valid lines, and the skip is observable.

#### Test Execution
> **Feature File:** [DRV-023](05--pause-resume-and-fault-tolerance/023-malformed-jsonl-lines-are-skipped-with-defaults.md)

### DRV-024 | JSONL reconstruction from review iteration files

#### Description
Verify JSONL can be reconstructed from review/iterations/ files.

#### Scenario Contract
Prompt: `Validate deep-review JSONL reconstruction from iteration markdown and report whether resume still works.`

Expected signals: Iteration files contain metadata matching JSONL fields, reconstruction path is documented or derivable, reconstructed JSONL allows loop resume, and iteration files are write-once (immutable after creation).

#### Test Execution
> **Feature File:** [DRV-024](05--pause-resume-and-fault-tolerance/024-jsonl-reconstruction-from-review-iteration-files.md)


---

## 12. SYNTHESIS, SAVE, AND GUARDRAILS

This category covers 4 scenario summaries while the linked feature files remain the canonical execution contract.

### DRV-025 | Review report synthesis has all 9 sections

#### Description
Verify review-report.md has all 9 sections: Executive Summary, Planning Trigger, Active Finding Registry, Remediation Workstreams, Spec Seed, Plan Seed, Traceability Status, Deferred Items, Audit Appendix.

#### Scenario Contract
Prompt: `Validate deep-review report synthesis and confirm review-report.md contains all 9 required sections.`

Expected signals: All 9 section headers present, Executive Summary contains verdict and P0/P1/P2 counts, Active Finding Registry has deduplicated findings with evidence, and Audit Appendix includes convergence data.

#### Test Execution
> **Feature File:** [DRV-025](06--synthesis-save-and-guardrails/025-review-report-synthesis-has-all-9-sections.md)

### DRV-026 | Review verdict determines post-review workflow

#### Description
Verify FAIL->plan, CONDITIONAL->plan, PASS->changelog routing with hasAdvisories metadata.

#### Scenario Contract
Prompt: `Validate deep-review verdict routing for FAIL, CONDITIONAL, and PASS post-review workflows.`

Expected signals: Three distinct verdicts, each with a documented next command, `hasAdvisories` flag on PASS with P2 findings, verdict appears in Executive Summary, and routing rationale appears in Planning Trigger.

#### Test Execution
> **Feature File:** [DRV-026](06--synthesis-save-and-guardrails/026-review-verdict-determines-post-review-workflow.md)

### DRV-027 | Final synthesis memory save and guardrail behavior

#### Description
Verify memory save via generate-context.js after review completion.

#### Scenario Contract
Prompt: `Validate deep-review finalization, memory-save routing, LEAF-only behavior, and read-only target handling.`

Expected signals: Synthesis produces `review/review-report.md`, memory save calls `generate-context.js`, the runtime agent forbids nested delegation (LEAF-only), the agent never modifies files under review (read-only), and memory save uses the spec folder established at setup.

#### Test Execution
> **Feature File:** [DRV-027](06--synthesis-save-and-guardrails/027-final-synthesis-memory-save-and-guardrail-behavior.md)

### DRV-028 | Finding deduplication and registry

#### Description
Verify finding deduplication uses adjudicated finalSeverity and produces clean registry.

#### Scenario Contract
Prompt: `Validate deep-review finding deduplication and confirm the active registry preserves unique P0/P1/P2 findings.`

Expected signals: Findings are compared across iterations by location and description, `finalSeverity` is the highest severity encountered, the Active Finding Registry contains unique entries only, P0 findings are never downgraded or discarded, and the registry includes file:line evidence for each finding.

#### Test Execution
> **Feature File:** [DRV-028](06--synthesis-save-and-guardrails/028-finding-deduplication-and-registry.md)

---

## 13. AUTOMATED TEST CROSS-REFERENCE

No dedicated automated test suite currently exists for `deep-review`. This playbook anchors directly to the live `deep-review` docs plus the active command and runtime definitions.

- `SKILL.md`: `.opencode/skills/deep-review/SKILL.md`
- `README.md`: `.opencode/skills/deep-review/README.md`
- `Command`: `.opencode/commands/deep/start-review-loop.md`
- `Auto YAML`: `.opencode/commands/deep/assets/deep_start-review-loop_auto.yaml`
- `Confirm YAML`: `.opencode/commands/deep/assets/deep_start-review-loop_confirm.yaml`
- `Agent (OpenCode)`: `.opencode/agents/deep-review.md`
- `Agent (Claude)`: `.claude/agents/deep-review.md`
- `Review Contract`: `.opencode/skills/deep-review/assets/review_mode_contract.yaml`
- `Loop Protocol`: `.opencode/skills/deep-review/references/loop_protocol.md`
- `Convergence`: `.opencode/skills/deep-review/references/convergence.md`
- `State Format`: `.opencode/skills/deep-review/references/state_format.md`
- `Quick Reference`: `.opencode/skills/deep-review/references/quick_reference.md`

---

## 14. FEATURE CATALOG CROSS-REFERENCE INDEX

### ENTRY POINTS AND MODES

- DRV-001: [Auto-mode deep-review kickoff](01--entry-points-and-modes/001-auto-mode-deep-review-kickoff.md)
- DRV-002: [Confirm-mode checkpointed review](01--entry-points-and-modes/002-confirm-mode-checkpointed-review.md)
- DRV-003: [Parameterized invocation: max iterations + convergence](01--entry-points-and-modes/003-parameterized-invocation-max-iterations-convergence.md)

### INITIALIZATION AND STATE SETUP

- DRV-004: [Fresh review initialization creates canonical state files](02--initialization-and-state-setup/004-fresh-review-initialization-creates-canonical-state-files.md)
- DRV-005: [Resume classification from valid prior review state](02--initialization-and-state-setup/005-resume-classification-from-valid-prior-review-state.md)
- DRV-006: [Invalid or contradictory review state halts for repair](02--initialization-and-state-setup/006-invalid-or-contradictory-review-state-halts-for-repair.md)
- DRV-007: [Scope discovery and dimension ordering](02--initialization-and-state-setup/007-scope-discovery-and-dimension-ordering.md)

### ITERATION EXECUTION AND STATE DISCIPLINE

- DRV-008: [Review iteration reads state before review](03--iteration-execution-and-state-discipline/008-review-iteration-reads-state-before-review.md)
- DRV-009: [Review iteration writes findings.jsonl and strategy update](03--iteration-execution-and-state-discipline/009-review-iteration-writes-findings-jsonl-and-strategy-update.md)
- DRV-010: [Strategy next-focus and dimension rotation](03--iteration-execution-and-state-discipline/010-strategy-next-focus-and-dimension-rotation.md)
- DRV-011: [Cross-reference verification detects misalignment](03--iteration-execution-and-state-discipline/011-cross-reference-verification-detects-misalignment.md)
- DRV-012: [Adversarial self-check runs on P0 findings](03--iteration-execution-and-state-discipline/012-adversarial-self-check-runs-on-p0-findings.md)
- DRV-013: [Review dashboard generation after iteration](03--iteration-execution-and-state-discipline/013-review-dashboard-generation-after-iteration.md)
- DRV-014: [Severity classification in JSONL](03--iteration-execution-and-state-discipline/014-severity-classification-in-jsonl.md)
- DRV-015: [Review iterations emit structured graphEvents](03--iteration-execution-and-state-discipline/015-graph-events-review.md)

### CONVERGENCE AND RECOVERY

- DRV-017: [P0 override blocks convergence](04--convergence-and-recovery/017-p0-override-blocks-convergence.md)
- DRV-018: [Review quality guards block premature stop](04--convergence-and-recovery/018-review-quality-guards-block-premature-stop.md)
- DRV-019: [Stuck recovery widens dimension focus](04--convergence-and-recovery/019-stuck-recovery-widens-dimension-focus.md)
- DRV-020: [Dimension coverage convergence signal](04--convergence-and-recovery/020-dimension-coverage-convergence-signal.md)
- DRV-030: [Stop on max iterations](04--convergence-and-recovery/030-stop-on-max-iterations.md)
- DRV-031: [Composite review convergence stop behavior](04--convergence-and-recovery/016-composite-review-convergence-stop-behavior.md)
- DRV-032: [Review graph convergence signals participate in legal-stop gates](04--convergence-and-recovery/032-graph-convergence-review.md)
- DRV-033: [Review reducer surfaces blocked-stop history across registry, dashboard, next-focus](04--convergence-and-recovery/033-blocked-stop-reducer-surfacing.md)
- DRV-034: [Review reducer fails closed on corruption and missing anchors](04--convergence-and-recovery/034-fail-closed-reducer.md)

### PAUSE, RESUME, AND FAULT TOLERANCE

- DRV-021: [Pause sentinel halts between review iterations](05--pause-resume-and-fault-tolerance/021-pause-sentinel-halts-between-review-iterations.md)
- DRV-022: [Resume after pause sentinel removal](05--pause-resume-and-fault-tolerance/022-resume-after-pause-sentinel-removal.md)
- DRV-023: [Malformed JSONL lines are skipped with defaults](05--pause-resume-and-fault-tolerance/023-malformed-jsonl-lines-are-skipped-with-defaults.md)
- DRV-024: [JSONL reconstruction from review-iteration files](05--pause-resume-and-fault-tolerance/024-jsonl-reconstruction-from-review-iteration-files.md)

### SYNTHESIS, SAVE, AND GUARDRAILS

- DRV-025: [Review-report synthesis has all 9 sections](06--synthesis-save-and-guardrails/025-review-report-synthesis-has-all-9-sections.md)
- DRV-026: [Review verdict determines post-review workflow](06--synthesis-save-and-guardrails/026-review-verdict-determines-post-review-workflow.md)
- DRV-027: [Final synthesis memory save and guardrail behavior](06--synthesis-save-and-guardrails/027-final-synthesis-memory-save-and-guardrail-behavior.md)
- DRV-028: [Finding deduplication and registry](06--synthesis-save-and-guardrails/028-finding-deduplication-and-registry.md)
- DRV-029: [Resource map emission](06--synthesis-save-and-guardrails/029-resource-map-emission.md)

### COMMAND FLOW STRESS TESTS

- CP-052: [Deep-review setup-to-YAML handoff (sandboxed)](07--command-flow-stress-tests/052-setup-yaml-handoff.md)
- CP-053: [Three-artifact iteration contract (sandboxed)](07--command-flow-stress-tests/053-three-artifact-iteration-contract.md)
- CP-054: [Resource-map coverage gate (sandboxed)](07--command-flow-stress-tests/054-resource-map-coverage-gate.md)
- CP-055: [Synthesis and save boundary (sandboxed)](07--command-flow-stress-tests/055-synthesis-save-boundary.md)
- CP-056: [LEAF-only nested dispatch refusal (sandboxed)](07--command-flow-stress-tests/056-leaf-only-nested-dispatch-refusal.md)
- CP-057: [Write boundary and reducer-owned files (sandboxed)](07--command-flow-stress-tests/057-write-boundary-reducer-owned-files.md)

### REVIEW-DEPTH V2 ROLLOUT

- DRV-058: [Validator warn rollout for legacy unversioned records](08--review-depth-v2-rollout/058-validator-warn-rollout.md)
- DRV-059: [Validator strict v2 with all five failure codes](08--review-depth-v2-rollout/059-validator-strict-v2.md)
- DRV-060: [Reducer search-debt registry + dashboard + report persistence](08--review-depth-v2-rollout/060-reducer-search-debt.md)
- DRV-061: [candidateCoverageGate STOP blocker](08--review-depth-v2-rollout/061-stop-gate-candidate-coverage.md)
- DRV-062: [graphlessFallbackGate STOP blocker](08--review-depth-v2-rollout/062-stop-gate-graphless-fallback.md)
- DRV-063: [Ledger-led graph vocabulary upserts (BUG_CLASS / INVARIANT / PRODUCER / CONSUMER / TEST)](08--review-depth-v2-rollout/063-graph-vocabulary.md)

---

## 15. COMMAND FLOW STRESS TESTS

This category covers 6 sandboxed stress-test scenarios that exercise the full command-to-runtime handoff against a synthetic spec folder under `/tmp/cp-deep-review-sandbox`. Setup uses `07--command-flow-stress-tests/setup-cp-sandbox.sh`. Each scenario validates a single contract boundary in isolation.

### Naming Convention: CP- vs DRV-

Tests in this category carry the `CP-` (Command Pattern) prefix instead of the standard `DRV-` (Deep Review) prefix. The distinction is intentional and load-bearing:

- `DRV-NNN` tests validate review-loop behavior on real or synthetic targets, exercising the iteration / convergence / synthesis contracts.
- `CP-NNN` tests validate the command-flow boundary itself (setup-to-YAML handoff, three-artifact contract, write boundaries, nested-dispatch refusal) using a sandboxed spec folder so the same scenarios run repeatably without touching real packets.

The convention was established by the `z_archive/062-deep-loop-command-flow-stress-tests/004-deep-review-stress-runs` packet and carried forward into the release surface. Keep CP-NNN for command-flow scenarios; new behavioral tests added to dirs 01-06 or 08 use DRV-NNN.

### CP-052 | Deep-review setup-to-YAML handoff (sandboxed)

#### Description
Verify the command setup phase produces a YAML-handoff bundle that the runtime workflow can consume without modification.

#### Test Execution
> **Feature File:** [CP-052](07--command-flow-stress-tests/052-setup-yaml-handoff.md)

### CP-053 | Three-artifact iteration contract (sandboxed)

#### Description
Verify each iteration produces exactly three artifacts: iteration markdown, JSONL delta append, and strategy update.

#### Test Execution
> **Feature File:** [CP-053](07--command-flow-stress-tests/053-three-artifact-iteration-contract.md)

### CP-054 | Resource-map coverage gate (sandboxed)

#### Description
Verify the resource-map coverage audit pass runs when `{spec_folder}/resource-map.md` is present and skips cleanly when absent.

#### Test Execution
> **Feature File:** [CP-054](07--command-flow-stress-tests/054-resource-map-coverage-gate.md)

### CP-055 | Synthesis and save boundary (sandboxed)

#### Description
Verify synthesis writes `review-report.md` and the save phase routes through `generate-context.js` without leaking state to context.

#### Test Execution
> **Feature File:** [CP-055](07--command-flow-stress-tests/055-synthesis-save-boundary.md)

### CP-056 | LEAF-only nested dispatch refusal (sandboxed)

#### Description
Verify the runtime agent refuses any nested-dispatch attempt with the canonical REFUSE wording.

#### Test Execution
> **Feature File:** [CP-056](07--command-flow-stress-tests/056-leaf-only-nested-dispatch-refusal.md)

### CP-057 | Write boundary and reducer-owned files (sandboxed)

#### Description
Verify that only the reducer mutates reducer-owned files (registry, dashboard, strategy) and that iterations stay write-once for their own narrative.

#### Test Execution
> **Feature File:** [CP-057](07--command-flow-stress-tests/057-write-boundary-reducer-owned-files.md)

---

## 16. REVIEW DEPTH V2 ROLLOUT

This category covers 6 scenarios that validate the review-depth v2 contract rollout: validator warn/strict modes, reducer search-debt persistence, stop-gate blockers, graphless fallback, and ledger-led graph vocabulary upserts. Tests carry standard DRV- IDs since they live inside the deep-review release surface.

### DRV-058 | Validator warn rollout for legacy unversioned records

#### Description
Verify the validator emits warnings (not failures) when records lack the v2 schema version field, preserving backward compatibility during rollout.

#### Test Execution
> **Feature File:** [DRV-058](08--review-depth-v2-rollout/058-validator-warn-rollout.md)

### DRV-059 | Validator strict v2 with all five failure codes

#### Description
Verify strict-mode validator emits all five v2 failure codes when records violate the new schema contract.

#### Test Execution
> **Feature File:** [DRV-059](08--review-depth-v2-rollout/059-validator-strict-v2.md)

### DRV-060 | Reducer search-debt registry + dashboard + report persistence

#### Description
Verify the reducer accumulates search-debt across iterations and surfaces it in the registry, dashboard, and final report.

#### Test Execution
> **Feature File:** [DRV-060](08--review-depth-v2-rollout/060-reducer-search-debt.md)

### DRV-061 | candidateCoverageGate STOP blocker

#### Description
Verify the candidateCoverageGate blocks STOP votes until candidate coverage reaches the configured threshold.

#### Test Execution
> **Feature File:** [DRV-061](08--review-depth-v2-rollout/061-stop-gate-candidate-coverage.md)

### DRV-062 | graphlessFallbackGate STOP blocker

#### Description
Verify the graphlessFallbackGate blocks STOP votes when graph backing is required but unavailable, falling back to a documented degraded path.

#### Test Execution
> **Feature File:** [DRV-062](08--review-depth-v2-rollout/062-stop-gate-graphless-fallback.md)

### DRV-063 | Ledger-led graph vocabulary upserts

#### Description
Verify ledger-led upserts emit the canonical graph vocabulary (BUG_CLASS, INVARIANT, PRODUCER, CONSUMER, TEST) during synthesis.

#### Test Execution
> **Feature File:** [DRV-063](08--review-depth-v2-rollout/063-graph-vocabulary.md)
