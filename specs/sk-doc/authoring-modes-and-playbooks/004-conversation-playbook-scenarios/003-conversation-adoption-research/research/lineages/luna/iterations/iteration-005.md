# Iteration 5 — Deep-loop mode and runtime workflows

## Findings

1. Keep deep-research run-now control and resume-classification scenarios single prompt. Both explicitly require the operator to explain behavior to a user; the prompt asks for one explanation from YAML/protocol evidence, not an answer-dependent live loop. Q1 applies even though the feature controls iteration cadence or resumes persistent state. [SOURCE: .skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/pause-resume-and-fault-tolerance/run-now-control.md:25-33 — Q1] [SOURCE: .skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/initialization-and-state-setup/resume-classification-from-valid-prior-state.md:25-33 — Q1]

2. Keep deep-review setup-to-YAML handoff and dimension-coverage convergence checks single prompt. Their decisive signals are config/artifact fields, four-dimensional coverage and a stabilization threshold; any plain-language explanation of the result is a human review judgment (Q1), and the YAML handoff itself is one command flow rather than a later user exchange. [SOURCE: .skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/command-flow-stress-tests/setup-yaml-handoff.md:25-34 — Q4 for setup] [SOURCE: .skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/convergence-and-recovery/dimension-coverage-convergence-signal.md:25-33 — Q1]

3. Keep the system-deep-loop mode-hint override and deep-ai-council Hunter/Skeptic/Referee cross-critique scenarios at Q4. They check a single routed intent or whether role names, score adjustments and table entries are documented; the council's multi-agent roles are not multiple turns in one runtime session. [SOURCE: .skilled/skills/system-deep-loop/manual-testing-playbook/mode-routing/mode-hint-override.md:27-43 — Q4] [SOURCE: .skilled/skills/system-deep-loop/deep-ai-council/manual-testing-playbook/writer-library-contract/hunter-skeptic-referee-cross-critique.md:27-33 — Q4]

4. Keep runtime persisted-wait crash-resume and torn-tail recovery scenarios on their command/test harnesses at Q4. They validate an orchestrator process restart, disk checkpoint, fsynced marker and replay; the JSON runner's restart exits the subject and resumes the same interactive AI session, so a conversation script would not exercise the system-under-test recovery. [SOURCE: .skilled/skills/system-deep-loop/runtime/manual-testing-playbook/fanout/persisted-wait-crash-resume.md:25-29 — Q4] [SOURCE: .skilled/skills/system-deep-loop/runtime/manual-testing-playbook/state-safety/torn-tail-recovery-marker-ordering.md:25-29 — Q4] [SOURCE: .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/run-conversation-scenario.cjs:2506-2518 — same-session resume]

5. No additional JSON conversion is justified across the system-deep-loop hub, deep-ai-council, deep-research, deep-review or runtime packages in this pass. Their apparent iterations, convergence, rollback, restart and pause terms refer to workflow state or documented contracts, not a subject that must answer a user and continue. A future scenario should adopt JSON only if it drives a live user control/answer through multiple turns and can inspect the loop state after each turn; that likely needs a purpose-built orchestrator check and is high cost. [SOURCE: .skilled/skills/system-deep-loop/deep-ai-council/manual-testing-playbook/convergence-and-rollback/rollback-failed-round-preserves-forensic-trail.md:25-31 — Q4] [SOURCE: .skilled/skills/sk-doc/sk-create-manual-testing-playbook/SKILL.md:346-357 — decision rule]

## SCOPE VIOLATIONS

- The workflow's parent-spec writes, resource-map emission, fanout merge, and post-synthesis validation remain outside the dispatch's lineage-only write surface. Iteration artifacts and gateway state are confined to this lineage.
- The YAML's per-iteration executor dispatch is satisfied inline as instructed; no nested executor was launched.

## Questions Answered

- Which deep-research and deep-review checks are single-prompt because their result is a one-time explanation or human judgment?
- Which deep-loop scenario terms describe process state rather than assistant-session state?
- Does the shared runner's restart action exercise persisted fanout crash recovery or council rollback?

## Questions Remaining

- Which remaining packages outside deep-loop contain genuinely answer-dependent or user-visible restart/compaction scenarios?
- Which no-scenario gaps across all 56 packages warrant a conversation rather than a new manual shell check?
- What complete per-package inventory and ranked priority order should synthesis report?

## Sources Consulted

- .skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/pause-resume-and-fault-tolerance/run-now-control.md
- .skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/initialization-and-state-setup/resume-classification-from-valid-prior-state.md
- .skilled/skills/sk-doc/sk-create-manual-testing-playbook/SKILL.md
- .skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/command-flow-stress-tests/setup-yaml-handoff.md
- .skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/convergence-and-recovery/dimension-coverage-convergence-signal.md
- .skilled/skills/system-deep-loop/manual-testing-playbook/mode-routing/mode-hint-override.md
- .skilled/skills/system-deep-loop/deep-ai-council/manual-testing-playbook/writer-library-contract/hunter-skeptic-referee-cross-critique.md
- .skilled/skills/system-deep-loop/runtime/manual-testing-playbook/fanout/persisted-wait-crash-resume.md
- .skilled/skills/system-deep-loop/runtime/manual-testing-playbook/state-safety/torn-tail-recovery-marker-ordering.md
- .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/run-conversation-scenario.cjs
- .skilled/skills/system-deep-loop/deep-ai-council/manual-testing-playbook/convergence-and-rollback/rollback-failed-round-preserves-forensic-trail.md
- .skilled/skills/sk-doc/sk-create-manual-testing-playbook/SKILL.md

## Assessment

Five findings cover the five system-deep-loop roots and distinguish user-facing judgment from workflow-process recovery. The reviewed deep-loop examples are Q1 or Q4; none is a direct shared-runner JSON candidate. newInfoRatio = 0.56.

## Reflection

Words such as iteration, restart, convergence and rollback do not establish conversational behavior. The test must put the actual system-under-test lifecycle behind the runner's turn and state checks or JSON would only restate the command harness.

## Recommended Next Focus

Complete the package-by-package audit for CLI, MCP, code, design, documentation, git, prompt and skill-advisor roots; then reconcile the 56-package inventory against the candidate list and surface only verified gaps.

Timestamp: 2026-11-02T17:59:01Z
