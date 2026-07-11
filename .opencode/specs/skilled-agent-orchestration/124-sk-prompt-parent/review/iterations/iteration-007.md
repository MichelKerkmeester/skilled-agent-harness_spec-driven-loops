# Deep Review Iteration 007

## Dimension

Traceability.

## Files Reviewed

- `.opencode/skills/sk-code/code-review/references/review_core.md:28-40`
- `.opencode/skills/system-deep-loop/deep-review/references/protocol/quick_reference.md:166-176`
- `.opencode/specs/skilled-agent-orchestration/124-sk-prompt-parent/review/deep-review-state.jsonl:3-20`
- `.opencode/specs/skilled-agent-orchestration/124-sk-prompt-parent/review/deep-review-strategy.md:127-328`
- `.opencode/specs/skilled-agent-orchestration/124-sk-prompt-parent/review/deep-review-findings-registry.json:9-199`
- `.opencode/specs/skilled-agent-orchestration/124-sk-prompt-parent/spec.md:88-94`
- `.opencode/specs/skilled-agent-orchestration/124-sk-prompt-parent/008-cutover-and-rollout/implementation-summary.md:55-122`
- `.opencode/commands/prompt-improve.md:112-143`
- `.opencode/commands/prompt-improve.md:437-459`
- `.opencode/skills/sk-prompt/SKILL.md:32-85`
- `.opencode/skills/sk-prompt/mode-registry.json:16-40`
- `.opencode/skills/sk-prompt/hub-router.json:16-27`
- `.opencode/skills/sk-prompt/graph-metadata.json:127-136`
- `.opencode/skills/sk-prompt/prompt-improve/SKILL.md:76-99`
- `.opencode/skills/sk-prompt/prompt-improve/README.md:199-221`
- `.opencode/skills/sk-prompt/prompt-improve/manual_testing_playbook/manual_testing_playbook.md:53-59`
- `.opencode/skills/sk-prompt/prompt-improve/manual_testing_playbook/depth-clear-loop/depth-five-phases-order.md:45-50`
- `.opencode/skills/sk-prompt/prompt-improve/manual_testing_playbook/smart-routing/intent-model-keyword-scoring.md:46-69`
- `.opencode/skills/sk-prompt/prompt-improve/manual_testing_playbook/format-modes/format-guide-on-demand.md:45-50`
- `.opencode/skills/sk-prompt/prompt-improve/manual_testing_playbook/clear-scoring/clear-five-dimensions.md:45-50`

## Findings by Severity

### P0

None.

### P1

#### R7-P1-001 [P1] prompt-improve manual-testing scenarios still verify pre-fold hub-root resource paths

- Claim: The `prompt-improve` manual-testing playbook can no longer reliably validate the live packet because multiple scenario commands still read `.opencode/skills/sk-prompt/SKILL.md` and `.opencode/skills/sk-prompt/references/...`, while the live prompt-improve implementation now lives under `.opencode/skills/sk-prompt/prompt-improve/` and `.opencode/skills/sk-prompt/references/*.md` does not exist.
- Evidence: The root playbook preconditions still require `.opencode/skills/sk-prompt/SKILL.md` to contain the old packet-local smart-router sections and require `.opencode/skills/sk-prompt/references/depth_framework.md` and `.opencode/skills/sk-prompt/references/patterns_evaluation.md` to resolve [SOURCE: `.opencode/skills/sk-prompt/prompt-improve/manual_testing_playbook/manual_testing_playbook.md:53-59`]. Depth/CLEAR and format scenarios repeat those hub-root paths in executable verification commands [SOURCE: `.opencode/skills/sk-prompt/prompt-improve/manual_testing_playbook/depth-clear-loop/depth-five-phases-order.md:45-50`; `.opencode/skills/sk-prompt/prompt-improve/manual_testing_playbook/clear-scoring/clear-five-dimensions.md:45-50`; `.opencode/skills/sk-prompt/prompt-improve/manual_testing_playbook/format-modes/format-guide-on-demand.md:45-50`]. The live packet documents the correct resource locations as packet-local relative paths under `prompt-improve/` [SOURCE: `.opencode/skills/sk-prompt/prompt-improve/SKILL.md:76-99`; `.opencode/skills/sk-prompt/prompt-improve/README.md:213-221`], and a direct glob found no files at `.opencode/skills/sk-prompt/references/*.md` while finding the expected files at `.opencode/skills/sk-prompt/prompt-improve/references/*.md`.
- Counterevidence sought: Checked the parent hub README, hub `SKILL.md`, `mode-registry.json`, `hub-router.json`, and prompt-improve README/SKILL for a deliberate alias or compatibility rule that would make hub-root `references/` valid; none was present. Checked prior active findings to avoid duplicating stale `/prompt` agent metadata, prompt-models README path drift, or command save-path findings.
- Alternative explanation: Some playbook commands may be historical examples rather than commands to execute, but this playbook explicitly says every scenario must run against the live skill and lists command transcripts plus source-anchor `rg` output as evidence requirements [SOURCE: `.opencode/skills/sk-prompt/prompt-improve/manual_testing_playbook/manual_testing_playbook.md:7-11`; `.opencode/skills/sk-prompt/prompt-improve/manual_testing_playbook/manual_testing_playbook.md:63-75`].
- Final severity: P1.
- Confidence: 0.91.
- Downgrade trigger: Downgrade to P2 if the playbook is explicitly declared historical/non-executable, or if a compatibility shim makes `.opencode/skills/sk-prompt/references/*.md` resolve to the packet-local references during scenario execution.
- Finding class: matrix/evidence.
- Scope proof: Exact search under `.opencode/skills/sk-prompt` found repeated stale hub-root scenario commands across the prompt-improve playbook, while direct glob showed the referenced hub-root `references/*.md` paths do not exist and packet-local references do.
- Affected surface hints: `prompt-improve manual_testing_playbook`, `DEPTH/CLEAR scenario evidence`, `format-guide scenario evidence`, `release-readiness playbook coverage`.
- Recommendation: Repoint prompt-improve manual-testing scenario commands and preconditions from `.opencode/skills/sk-prompt/SKILL.md` / `.opencode/skills/sk-prompt/references/...` / `.opencode/skills/sk-prompt/assets/...` to the packet-local `prompt-improve/SKILL.md`, `prompt-improve/references/...`, and `prompt-improve/assets/...` paths, except for scenarios intentionally testing the thin hub router.

### P2

None.

## Traceability Checks

- Core `spec_code`: PARTIAL. Hub topology remains aligned with the parent spec and registry/router evidence, but the prompt-improve playbook still carries pre-fold verification anchors for packet-local behavior.
- Core `checklist_evidence`: PARTIAL. Phase 008 is Level 1 and intentionally has no checklist, but its closeout claims clean stale-reference sweeps; this iteration found a live traceability gap in the prompt-improve playbook surface that was not covered by those sweeps.
- Overlay `skill_agent`: PASS for hub and packet routing metadata in this slice. The parent hub routes via `mode-registry.json` and `hub-router.json`; this finding is about playbook verification anchors, not router selection.
- Overlay `agent_cross_runtime`: NOT RETRIED as a new direction because stale runtime-agent `/prompt` metadata remains covered by `R1-P1-001`.
- Overlay `feature_catalog_code`: NOT APPLICABLE. No feature-catalog artifact is part of the declared review scope.
- Overlay `playbook_capability`: FAIL for prompt-improve packet-level scenario source anchors. The manual playbook's executable verification commands target paths that no longer resolve or no longer represent packet-local behavior.

## SCOPE VIOLATIONS

None.

## Verdict

CONDITIONAL. One new P1 traceability finding was recorded.

## Next Dimension

Maintainability or traceability stabilization, with focus on whether playbook path drift is isolated to prompt-improve manual-testing files or also affects benchmark/readme operator commands.

Review verdict: CONDITIONAL
