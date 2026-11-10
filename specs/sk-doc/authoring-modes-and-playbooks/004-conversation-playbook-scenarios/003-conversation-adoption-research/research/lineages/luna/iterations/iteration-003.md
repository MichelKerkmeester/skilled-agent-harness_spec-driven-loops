# Iteration 3 — Question tools, approvals and lifecycle evidence

## Findings

1. Update central `/doctor` DOC-370 and DOC-372 with scripted answer turns: each presents a proposed local rule change, branches on `no` versus `approve`, then verifies the resulting config and prose state. Both stop at Q2 because the user's answer changes whether the write and follow-up occur. DOC-370 is the cleaner first conversion in a disposable repo; DOC-372 has multiple approvals and costs more. Keep DOC-394's GitHub variable round trip as manual evidence, with at most a safe no-answer JSON companion, because its yes branch changes shared Actions state and requires credentials. [SOURCE: .skilled/manual-testing-playbook/doctor-commands/doctor-git-hooks-switch-gate.md:22-30 — Q2] [SOURCE: .skilled/manual-testing-playbook/doctor-commands/doctor-git-standards-change-rule.md:22-30 — Q2] [SOURCE: .skilled/manual-testing-playbook/doctor-commands/doctor-ci-toggle.md:22-30 — Q2 / external-state cost]

2. Update system-spec-kit `ux-hooks/directive-lifecycle-dedup.md` with a JSON conversation for the first request, same-session repeat, and a compact or boundary-reset request, checking delivery evidence after each turn. Q2 is the deciding yes: expected signals explicitly depend on turn order, repeated state, transcript shrink, and reset; the existing contract asks for one prompt and leaves the operator to run the sequence manually. Keep its adapter/native-host evidence matrix as supplemental coverage because the runner cannot collapse those evidence classes into one runtime pass. [SOURCE: .skilled/skills/system-spec-kit/manual-testing-playbook/ux-hooks/directive-lifecycle-dedup.md:30-45 — Q2]

3. Keep MCP Aside DevTools ASD-005 as a manual multi-command scenario for now. Its seed task, captured session id, and context-dependent follow-up are Q2 because the result depends on a prior exchange, but Aside is absent from the runner's five accepted runtime ids; a JSON block would be rejected until the runtime is supported. Revisit after adapter support, retaining its version-specific session-id discovery check. [SOURCE: .skilled/skills/mcp-tooling/mcp-aside-devtools/manual-testing-playbook/agent-task/session-continuation.md:27-33 — Q2] [SOURCE: .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs:39 — runtime allowlist]

4. The system-spec-kit runtime-family count census is a Q3 candidate: it compares three runtime mirrors and deterministic shell output can decide equality after each command. A three-send JSON script could check `.skilled`, `.claude`, then `.codex` counts in sequence and identify the first missing mirror; this is low authoring cost but low-to-medium value because the current single prompt already reports all three counts together. Keep one-shot refusal and dry-run scenarios such as GIT-011 and GIT-034 at Q4: each request has a complete verdict from one response plus final-state shell evidence. [SOURCE: .skilled/skills/system-spec-kit/manual-testing-playbook/tooling-and-scripts/runtime-family-count-census.md:21-27 — Q3] [SOURCE: .skilled/skills/sk-git/manual-testing-playbook/safety-refusals/amend-published-commit-refused.md:27-33 — Q4] [SOURCE: .skilled/skills/sk-git/manual-testing-playbook/owner-first-worktree-tooling/reaper-dry-run-no-mutation.md:27-33 — Q4]

5. The existing MTP-007 shared-runner scenario already covers single-choice, multi-select and free-text question tools plus restart and compaction; the high-value uncovered question behavior is skill-specific approval, where the answer must control a real state transition. Rank DOC-370 first (isolated local write, moderate setup), DOC-372 second (multiple approvals and prose repair, higher cost), and DOC-394's no-path companion third (safe but limited evidence); rank directive-lifecycle JSON above all three for release risk reduction, with high value and high execution cost across runtime evidence classes. [SOURCE: .skilled/skills/sk-doc/sk-create-manual-testing-playbook/manual-testing-playbook/conversation-runner/drive-a-scripted-conversation.md:69-177 — existing generic question/restart/compact coverage]

## SCOPE VIOLATIONS

- The workflow's parent-spec writes, resource-map emission, fanout merge, and post-synthesis validation remain outside the dispatch's lineage-only write surface. Iteration artifacts and gateway state are confined to this lineage.
- The YAML's per-iteration executor dispatch is satisfied inline as instructed; no nested executor was launched.

## Questions Answered

- Which skill-specific question-tool behavior is not covered by the generic question/restart/compact runner scenario?
- Which answer-dependent and multi-turn candidates are unsupported by the runner or too risky to convert directly?
- Which Q4 examples should remain single prompt, and is there a bounded Q3 comparison candidate?

## Questions Remaining

- Which modes outside CLI lifecycle, /doctor approvals, and the sampled system-spec-kit areas meet Q2 or Q3?
- Which exact packages have Q1 judgment surfaces, Q4 one-shot checks, or no conversation-worthy gap?
- What is the priority order across the full corpus once code, design, documentation, MCP, and deep-loop modes are covered?

## Sources Consulted

- .skilled/manual-testing-playbook/doctor-commands/doctor-git-hooks-switch-gate.md
- .skilled/manual-testing-playbook/doctor-commands/doctor-git-standards-change-rule.md
- .skilled/manual-testing-playbook/doctor-commands/doctor-ci-toggle.md
- .skilled/skills/sk-doc/sk-create-manual-testing-playbook/SKILL.md
- .skilled/skills/sk-doc/sk-create-manual-testing-playbook/references/conversation-scenarios.md
- .skilled/skills/system-spec-kit/manual-testing-playbook/ux-hooks/directive-lifecycle-dedup.md
- .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/run-conversation-scenario.cjs
- .skilled/skills/mcp-tooling/mcp-aside-devtools/manual-testing-playbook/agent-task/session-continuation.md
- .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs
- .skilled/skills/system-spec-kit/manual-testing-playbook/tooling-and-scripts/runtime-family-count-census.md
- .skilled/skills/sk-git/manual-testing-playbook/safety-refusals/amend-published-commit-refused.md
- .skilled/skills/sk-git/manual-testing-playbook/owner-first-worktree-tooling/reaper-dry-run-no-mutation.md
- .skilled/skills/sk-doc/sk-create-manual-testing-playbook/manual-testing-playbook/conversation-runner/drive-a-scripted-conversation.md
- .skilled/skills/sk-doc/sk-create-manual-testing-playbook/SKILL.md
- .skilled/skills/sk-doc/sk-create-manual-testing-playbook/references/conversation-scenarios.md
- .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs
- .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/run-conversation-scenario.cjs

## Assessment

Five findings: explicit Q2 answer-dependent approvals, a Q2 in-session lifecycle gap, a Q2 session-continuation gap blocked by runtime support, one Q3 low-to-medium value mirror comparison, and Q4 examples that stay single prompt. newInfoRatio = 0.78.

## Reflection

A generic question-tool demonstration does not cover approval semantics in the skill being tested. The best additions make a consequential answer observable at the next state check and keep external mutation paths separated from safe declined paths.

## Recommended Next Focus

Continue package-by-package through system-spec-kit, system-deep-loop and runtime feature modes; enumerate any existing conversations, and classify candidate scenarios by Q2/Q3 before broadening to code, design, document, git, prompt and MCP packages.

Timestamp: 2026-11-02T17:55:51Z
