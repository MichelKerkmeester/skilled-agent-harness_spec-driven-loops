# Iteration 7 — Operator questions and OpenCode session state

## Findings

1. Convert central `/doctor:skill-advisor` DOC-367 into a JSON conversation for the safe menu branches: no target, X cancel, invalid answer twice, H help, then a test-only numeric target. Every answer changes the next displayed state or status, so Q2 is yes; runner question matching and scripted replies can test the menu without guessing. Keep unknown-target/cross-target command-line failures and any target that launches a mutating workflow as existing isolated checks. [SOURCE: .skilled/manual-testing-playbook/doctor-commands/doctor-skill-advisor-target-menu.md:22-30 — Q2] [SOURCE: .skilled/skills/sk-doc/sk-create-manual-testing-playbook/references/conversation-scenarios.md:46-55 — scripted question answers]

2. Treat DOC-370 git-hook switch, DOC-372 standards edit, DOC-359 release update, and DOC-394 CI toggle as Q2 because no/approve answers determine writes, follow-up questions, and rollback. Add conversation coverage first for DOC-370 in a disposable checkout; DOC-372 and DOC-359 are higher value but need fixture setup and rollback checks; DOC-394 should cover only the safe declined branch unless its credentialed remote write can be isolated and restored. [SOURCE: .skilled/manual-testing-playbook/doctor-commands/doctor-git-hooks-switch-gate.md:22-30 — Q2] [SOURCE: .skilled/manual-testing-playbook/doctor-commands/doctor-git-standards-change-rule.md:22-30 — Q2] [SOURCE: .skilled/manual-testing-playbook/doctor-commands/doctor-update-apply.md:22-30 — Q2] [SOURCE: .skilled/manual-testing-playbook/doctor-commands/doctor-ci-toggle.md:22-30 — Q2]

3. Update both system-skill-advisor CL-007 and system-spec-kit goal-opencode-plugin coverage with a two-turn OpenCode JSON companion: set or bind an isolated goal, then send a later task request and verify the active-goal prompt is injected; add pause/resume only if the same state checks remain clear. Q2 is yes because the goal is per-session state and the requirement is model-visible context on a subsequent prompt, while both current contracts emphasize command/status output and injection preview. [SOURCE: .skilled/skills/system-skill-advisor/manual-testing-playbook/cli-hooks-and-plugin/goal-opencode-plugin.md:28, 62-78 — Q2] [SOURCE: .skilled/skills/system-spec-kit/manual-testing-playbook/ux-hooks/goal-opencode-plugin.md:24-30 — Q2]

4. Update system-spec-kit session-cleanup-plugin with a bounded OpenCode conversation companion: first send verifies the startup guard appears in model context, a second send proves it is delivered only once, and session restart/end checks cleanup behavior. Q2 applies to the session-created/injected/disposed lifecycle, but preserve the existing real-script and Claude SessionEnd evidence because the shared runner restart alone does not prove every teardown command. [SOURCE: .skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/session-cleanup-plugin.md:23-42, 54-68 — Q2 lifecycle] [SOURCE: .skilled/skills/sk-doc/sk-create-manual-testing-playbook/references/conversation-scenarios.md:46-50 — restart action]

5. Keep DOC-403 sk-skill-convert dry-run, DOC-390 unrelated no-hint, and one-prompt command plans single prompt. They explicitly ask nothing or invoke the hook once and produce a deterministic report; no scripted user reply changes what happens next, so Q4 applies. The numeric menu and approval cases above are the exceptions because their answer controls the flow. [SOURCE: .skilled/manual-testing-playbook/doctor-commands/doctor-sk-skill-convert.md:22-30 — Q4] [SOURCE: .skilled/manual-testing-playbook/doctor-commands/doctor-routing-no-hint-unrelated.md:22-30 — Q4]

## SCOPE VIOLATIONS

- The workflow's parent-spec writes, resource-map emission, fanout merge, and post-synthesis validation remain outside the dispatch's lineage-only write surface. Iteration artifacts and gateway state are confined to this lineage.
- The YAML's per-iteration executor dispatch is satisfied inline as instructed; no nested executor was launched.

## Questions Answered

- Which /doctor question-tool flow has the clearest low-risk Q2 conversation script?
- Which approval flows should be prioritized by safety, rollback and execution cost?
- Which OpenCode goal/session-cleanup features need later-turn JSON coverage?

## Questions Remaining

- Which remaining CLI goal-hook and MCP packages contain a real second-turn injection or answer-dependent flow?
- Does the final 56-root matrix assign every package a Q1/Q2/Q3/Q4 outcome or a concrete no-scenario gap?
- Which candidates remain highest after all package families are considered?

## Sources Consulted

- .skilled/manual-testing-playbook/doctor-commands/doctor-skill-advisor-target-menu.md
- .skilled/skills/sk-doc/sk-create-manual-testing-playbook/references/conversation-scenarios.md
- .skilled/skills/sk-doc/sk-create-manual-testing-playbook/SKILL.md
- .skilled/manual-testing-playbook/doctor-commands/doctor-git-hooks-switch-gate.md
- .skilled/manual-testing-playbook/doctor-commands/doctor-git-standards-change-rule.md
- .skilled/manual-testing-playbook/doctor-commands/doctor-update-apply.md
- .skilled/manual-testing-playbook/doctor-commands/doctor-ci-toggle.md
- .skilled/skills/system-skill-advisor/manual-testing-playbook/cli-hooks-and-plugin/goal-opencode-plugin.md
- .skilled/skills/system-spec-kit/manual-testing-playbook/ux-hooks/goal-opencode-plugin.md
- .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/run-conversation-scenario.cjs
- .skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/session-cleanup-plugin.md
- .skilled/manual-testing-playbook/doctor-commands/doctor-sk-skill-convert.md
- .skilled/manual-testing-playbook/doctor-commands/doctor-routing-no-hint-unrelated.md
- .skilled/skills/sk-doc/sk-create-manual-testing-playbook/SKILL.md
- .skilled/skills/sk-doc/sk-create-manual-testing-playbook/references/conversation-scenarios.md

## Assessment

Five findings add a strong question-menu conversion, four approval-branch candidates, two goal-injection updates, one cleanup lifecycle update, and Q4 examples that remain single. newInfoRatio = 0.71.

## Reflection

Question answers and later prompt injection are distinct Q2 triggers. A script can automate an answer only where that answer is safe to script; destructive or remote mutation stays bound to a disposable fixture, no path, or existing human approval process.

## Recommended Next Focus

Finish the audit of runtime goal-hook packages and remaining MCP/documentation modes; reconcile all candidate documents and build the package-level coverage matrix for synthesis.

Timestamp: 2026-11-02T18:01:35Z
