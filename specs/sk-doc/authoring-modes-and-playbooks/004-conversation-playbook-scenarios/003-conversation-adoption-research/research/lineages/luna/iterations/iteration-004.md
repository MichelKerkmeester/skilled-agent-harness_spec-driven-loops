# Iteration 4 — Q1 judgment and Q4 one-shot scenarios

## Findings

1. Keep sk-design-chart CHT-009 and sk-code-review CR-013 as single-prompt scenarios. CHT-009 requires a person to judge dark-theme legibility and print readability; CR-013 asks whether prior review findings are truly closed in the new diff. Q1 takes precedence even though each case has several checks or evidence steps. [SOURCE: .skilled/skills/sk-design/sk-design-chart/manual-testing-playbook/delivery-and-routing/a-delivery-on-a-dark-system.md:32-38 — Q1] [SOURCE: .skilled/skills/sk-code/sk-code-review/manual-testing-playbook/re-review-and-stale-context/re-review-after-fixes.md:27-33 — Q1]

2. Keep MCP ClickUp MCP-H004 as a manual single-prompt scenario: the operator must first confirm that TASK_ID is the throwaway task. That target check is a human judgment, so Q1 wins over the subsequent delete-and-read sequence at Q2; automating an approve answer would erase the meaningful safety decision. A future JSON companion would need a non-destructive fixture or mock. [SOURCE: .skilled/skills/mcp-tooling/mcp-click-up/manual-testing-playbook/mcp-task-crud/delete-task.md:23-39 — Q1 target confirmation]

3. Keep sk-doc SD-012 and Chrome DevTools BDG-002 single prompt. SD-012 describes three sequential routing requests inside one prompt and forbids executing file changes; BDG-002 runs start and status commands for one requested session. Also keep Claude Code CC-021 single: it creates a structured handback in one read-only dispatch rather than continuing into a second session. None requires the runtime to ask the user or carry an answer-dependent state transition, so Q4 applies. [SOURCE: .skilled/skills/sk-doc/manual-testing-playbook/cross-cli-dispatch/multi-step-dispatch.md:60-65, 73-83 — Q4] [SOURCE: .skilled/skills/mcp-tooling/mcp-chrome-devtools/manual-testing-playbook/cli-bdg-lifecycle/session-start.md:27-33 — Q4] [SOURCE: .skilled/skills/cli-external-orchestration/cli-claude-code/manual-testing-playbook/agent-routing/handover-agent-context-transfer.md:27-33 — Q4]

4. Across sampled code, design, documentation, and MCP packages, a long TEST EXECUTION section is not itself a Q2 signal. A command result followed by a status read or a single dispatch that returns a complete report remains Q4; use JSON only when a later send/action or scripted answer is needed to reach the tested behavior. This keeps the many CRUD, routing, formatting, and one-command checks from gaining runner setup without new coverage. [SOURCE: .skilled/skills/sk-doc/sk-create-manual-testing-playbook/SKILL.md:346-357 — ordered distinction]

5. Rank the Q2 lifecycle and answer-dependent candidates from earlier passes above format-only conversion in design, code review, document routing, and ordinary MCP CRUD. High value: Pi PI-020 interactive compaction, OpenCode CO-046 later-request relaunch, and system-spec-kit directive lifecycle. Medium-to-high value and higher cost: isolated /doctor approval flows. Low value: wrapping a one-prompt dispatch trace or browser session-start check in JSON. [SOURCE: .skilled/skills/cli-external-orchestration/cli-pi/manual-testing-playbook/hook-extension-layer/session-lifecycle-bridges.md:25-31 — Q2 gap] [SOURCE: .skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/plugin-utilization/session-relaunch.md:27-35 — Q2] [SOURCE: .skilled/skills/system-spec-kit/manual-testing-playbook/ux-hooks/directive-lifecycle-dedup.md:30-45 — Q2]

## SCOPE VIOLATIONS

- The workflow's parent-spec writes, resource-map emission, fanout merge, and post-synthesis validation remain outside the dispatch's lineage-only write surface. Iteration artifacts and gateway state are confined to this lineage.
- The YAML's per-iteration executor dispatch is satisfied inline as instructed; no nested executor was launched.

## Questions Answered

- Which sampled design and code-review scenarios should stay single prompt because Q1 requires a human judgment?
- Which destructive MCP target-confirmation and multi-command scenarios should stay manual or single prompt?
- Does multiple commands or a sequence described inside one prompt automatically trigger Q2?

## Questions Remaining

- Which remaining skill/mode roots contain Q2 or Q3 candidates outside the sampled lifecycle, approval, design, review, routing and MCP examples?
- Which behaviors are missing scenario coverage in system-deep-loop and its workflow modes?
- What complete per-package coverage matrix and final value/cost ranking should synthesis report?

## Sources Consulted

- .skilled/skills/sk-design/sk-design-chart/manual-testing-playbook/delivery-and-routing/a-delivery-on-a-dark-system.md
- .skilled/skills/sk-code/sk-code-review/manual-testing-playbook/re-review-and-stale-context/re-review-after-fixes.md
- .skilled/skills/sk-doc/sk-create-manual-testing-playbook/SKILL.md
- .skilled/skills/mcp-tooling/mcp-click-up/manual-testing-playbook/mcp-task-crud/delete-task.md
- .skilled/skills/sk-doc/manual-testing-playbook/cross-cli-dispatch/multi-step-dispatch.md
- .skilled/skills/mcp-tooling/mcp-chrome-devtools/manual-testing-playbook/cli-bdg-lifecycle/session-start.md
- .skilled/skills/cli-external-orchestration/cli-claude-code/manual-testing-playbook/agent-routing/handover-agent-context-transfer.md
- .skilled/skills/cli-external-orchestration/cli-pi/manual-testing-playbook/hook-extension-layer/session-lifecycle-bridges.md
- .skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/plugin-utilization/session-relaunch.md
- .skilled/skills/system-spec-kit/manual-testing-playbook/ux-hooks/directive-lifecycle-dedup.md
- .skilled/manual-testing-playbook/doctor-commands/doctor-git-hooks-switch-gate.md
- .skilled/skills/sk-doc/sk-create-manual-testing-playbook/SKILL.md
- .skilled/skills/sk-doc/sk-create-manual-testing-playbook/references/conversation-scenarios.md

## Assessment

Five findings establish Q1 precedence for visual/review judgments and destructive-target confirmation, Q4 for multi-command one-shot tasks, and the relative value of lifecycle coverage. The TEST EXECUTION command count alone is not a reason to adopt JSON. newInfoRatio = 0.65.

## Reflection

Several tests have many deterministic steps, but the user-facing behavior is still one request and one complete result. Q1 can also override an apparent Q2 sequence when the operator must decide whether a target is safe.

## Recommended Next Focus

Audit deep-loop workflow modes and runtime packets for actual restart/resume, pause, fanout, crash-recovery, question and compaction scenarios; then map every validator-discovered package into the final recommendation matrix.

Timestamp: 2026-11-02T17:57:44Z
