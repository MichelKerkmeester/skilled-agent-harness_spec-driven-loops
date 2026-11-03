# Iteration 8 — Runtime goal hooks, authorization and MCP flows

## Findings

1. Add JSON conversation companions to Devin, OpenCode and Pi goal-hook scenarios. Devin explicitly injects the bound goal on SessionStart and UserPromptSubmit and says file edits must appear next turn; OpenCode's goal is model-visible across turns; Pi verifies goal state after resume. Q2 decides each. Keep native adapter envelopes and two-session isolation as supplemental checks because the runner drives one interactive session per run. [SOURCE: .skilled/skills/cli-external-orchestration/cli-devin/manual-testing-playbook/goal-hook/goal-hook.md:21-31 — Q2] [SOURCE: .skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/goal-hook/goal-hook.md:21, 29-35 — Q2] [SOURCE: .skilled/skills/cli-external-orchestration/cli-pi/manual-testing-playbook/goal-hook/goal-hook.md:21-28 — Q2]

2. Keep Cursor's two-session goal-identity scenario manual because Cursor is not a conversation runtime and the contract warns its adapter response is not proof the model saw it. Keep Hermes HERMES-030 single prompt because it asks one request to quote a pre-bound goal section; keep Claude's goal scenario Q4 because it verifies the OpenCode-only command is absent and no Claude goal adapter is claimed. Do not convert these by runtime name or the word session alone. [SOURCE: .skilled/skills/cli-external-orchestration/cli-cursor/manual-testing-playbook/goal-hook/goal-hook.md:19-26 — Q2 / unsupported runtime] [SOURCE: .skilled/skills/cli-external-orchestration/cli-hermes/manual-testing-playbook/goal-hook/goal-core-binding-by-session-id.md:27-34 — Q4] [SOURCE: .skilled/skills/cli-external-orchestration/cli-claude-code/manual-testing-playbook/goal-hook/goal-hook.md:17-25 — Q4]

3. Update the root cli-external-orchestration dispatch-preflight authorization scenario with a Pi JSON conversation that first receives a dispatch request without a named executor, verifies denial, then receives an explicit user follow-up naming the executor and checks the allowed path and audit record. Q2 is yes because the user's clarification changes authorization on the next turn; current coverage compares allow/deny cases in-process but does not exercise the conversation-level repair. Pi is supported by the runner; retain the inspector and adapter unit evidence. [SOURCE: .skilled/skills/cli-external-orchestration/manual-testing-playbook/plugins-and-hooks/cli-dispatch-preflight-authorization.md:24-42 — Q2 clarification candidate] [SOURCE: .skilled/skills/sk-doc/sk-create-manual-testing-playbook/SKILL.md:348-354 — answer changes next behavior]

4. Keep Notion PAGE-005 and Figma FG-R05 single prompt: they run a scratch-page create/move/read/archive chain or one routing prompt and return complete deterministic evidence, so Q4 applies. Keep Obsidian MCP-H004 at Q1 because an operator must confirm the note is disposable before deletion. Keep the Codex hook parity matrix command-driven; one Codex invocation fires many hooks, but that is a hook-event matrix, not a user conversation or a cross-runtime turn sequence. [SOURCE: .skilled/skills/mcp-tooling/mcp-notion/manual-testing-playbook/pages/move-page.md:24-29 — Q4] [SOURCE: .skilled/skills/mcp-tooling/mcp-figma/manual-testing-playbook/intra-routing-recall/mcp-context.md:34-42 — Q4] [SOURCE: .skilled/skills/mcp-tooling/mcp-obsidian/manual-testing-playbook/mcp-roundtrip/delete-throwaway-note.md:24-30 — Q1] [SOURCE: .skilled/skills/cli-external-orchestration/manual-testing-playbook/plugins-and-hooks/codex-hook-parity.md:39-40 — one-invocation matrix]

5. Keep Orca runtime-stopped recovery and Chrome DevTools dead-session recovery on their native command sequences. They restart a stopped runtime or CDP browser and re-read new terminal/session identifiers; this is Q2-shaped process recovery, but neither is a supported AI conversation runtime and the shared runner's restart cannot perform those product restarts. MCP Aside's Q2 session continuation also remains manual because its runtime is unsupported. These are lower-value JSON targets than supported CLI goal injection. [SOURCE: .skilled/skills/cli-orca/manual-testing-playbook/runtime/runtime-stopped-recovery.md:26-32 — Q2-shaped process recovery] [SOURCE: .skilled/skills/mcp-tooling/mcp-chrome-devtools/manual-testing-playbook/recovery-and-failure/dead-session.md:29-34 — Q2-shaped process recovery] [SOURCE: .skilled/skills/mcp-tooling/mcp-aside-devtools/manual-testing-playbook/agent-task/session-continuation.md:27-33 — Q2 / unsupported runtime]

## SCOPE VIOLATIONS

- The workflow's parent-spec writes, resource-map emission, fanout merge, and post-synthesis validation remain outside the dispatch's lineage-only write surface. Iteration artifacts and gateway state are confined to this lineage.
- The YAML's per-iteration executor dispatch is satisfied inline as instructed; no nested executor was launched.

## Questions Answered

- Which supported runtime goal hooks need later-turn JSON coverage?
- Does dispatch authorization have an answer-dependent cross-runtime conversation gap?
- Which MCP/API sequences, hook-event matrices and process restarts remain single prompt or native-harness work?

## Questions Remaining

- Which of the remaining noncandidate packages have Q1 judgment or Q4 one-shot contracts and should be listed in the matrix?
- Which candidates should be ranked first after considering supported runtimes, runner semantics, host prerequisites, rollback and per-pass time?
- Which local evidence and workflow constraints must appear in final synthesis?

## Sources Consulted

- .skilled/skills/cli-external-orchestration/cli-devin/manual-testing-playbook/goal-hook/goal-hook.md
- .skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/goal-hook/goal-hook.md
- .skilled/skills/cli-external-orchestration/cli-pi/manual-testing-playbook/goal-hook/goal-hook.md
- .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/run-conversation-scenario.cjs
- .skilled/skills/sk-doc/sk-create-manual-testing-playbook/SKILL.md
- .skilled/skills/cli-external-orchestration/cli-cursor/manual-testing-playbook/goal-hook/goal-hook.md
- .skilled/skills/cli-external-orchestration/cli-hermes/manual-testing-playbook/goal-hook/goal-core-binding-by-session-id.md
- .skilled/skills/cli-external-orchestration/cli-claude-code/manual-testing-playbook/goal-hook/goal-hook.md
- .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs
- .skilled/skills/cli-external-orchestration/manual-testing-playbook/plugins-and-hooks/cli-dispatch-preflight-authorization.md
- .skilled/skills/mcp-tooling/mcp-notion/manual-testing-playbook/pages/move-page.md
- .skilled/skills/mcp-tooling/mcp-figma/manual-testing-playbook/intra-routing-recall/mcp-context.md
- .skilled/skills/mcp-tooling/mcp-obsidian/manual-testing-playbook/mcp-roundtrip/delete-throwaway-note.md
- .skilled/skills/cli-external-orchestration/manual-testing-playbook/plugins-and-hooks/codex-hook-parity.md
- .skilled/skills/cli-orca/manual-testing-playbook/runtime/runtime-stopped-recovery.md
- .skilled/skills/mcp-tooling/mcp-chrome-devtools/manual-testing-playbook/recovery-and-failure/dead-session.md
- .skilled/skills/mcp-tooling/mcp-aside-devtools/manual-testing-playbook/agent-task/session-continuation.md
- .skilled/skills/sk-doc/sk-create-manual-testing-playbook/SKILL.md
- .skilled/skills/sk-doc/sk-create-manual-testing-playbook/references/conversation-scenarios.md
- .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs

## Assessment

Five findings add supported Devin/OpenCode/Pi goal-hook conversation candidates and a Pi user-clarification authorization gap, while classifying unsupported runtimes and MCP/process workflows by their actual test layer. newInfoRatio = 0.63.

## Reflection

Session ids and repeated adapter invocations can be machine-level tests, while only a later user turn can prove that a directive reaches the same model session. Q2 candidates should use the runner for that visible behavior and retain native payload checks for the adapter contract.

## Recommended Next Focus

Reconcile the 56 discovered package roots and all named candidates into a package-by-package Q1/Q2/Q3/Q4 matrix, then rank conversions, companions, manual constraints, no-scenario gaps and cost.

Timestamp: 2026-11-02T18:03:27Z
