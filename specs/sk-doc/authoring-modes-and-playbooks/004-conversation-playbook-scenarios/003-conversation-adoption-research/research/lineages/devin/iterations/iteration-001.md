# Deep Research Iteration 1

## Focus

Audit the first four unaudited packages: cli-classifier, cli-classifier/cli-jev, mcp-code-mode and the mcp-tooling hub. Read each package's scenario inventory and the scenarios that mention questions, sessions, approvals, restart or compaction.

## Actions Taken

- Read the cli-classifier root playbook and its seven scenario entries.
- Read the cli-jev root playbook and its 22-scenario index.
- Read the mcp-tooling hub root playbook and the MT-004 defer scenario.
- Read the mcp-code-mode root playbook and the mcp-route-guard scenario file.
- Confirmed no `json conversation` block exists in any of the 28 unaudited packages.

## Findings

1. cli-classifier has no conversation candidate: its seven scenarios are one routing decision or one offline scorer run whose verdict is a single advisor, front-door or exit-status result, so Q2 finds no second exchange and Q4 keeps every scenario single prompt. [SOURCE: .skilled/skills/cli-classifier/manual-testing-playbook/manual-testing-playbook.md:83] [SOURCE: .skilled/skills/cli-classifier/manual-testing-playbook/manual-testing-playbook.md:119] [SOURCE: .skilled/skills/cli-classifier/manual-testing-playbook/manual-testing-playbook.md:32]
2. cli-jev has no conversation candidate: all 22 scenarios drive the `jev` binary's invocation, exit-code, provider or MCP-handshake surface from one command, and the shared runner drives an interactive runtime session rather than a shell binary, so Q2 does not apply and Q4 keeps them single prompt. [SOURCE: .skilled/skills/cli-classifier/cli-jev/manual-testing-playbook/manual-testing-playbook.md:98] [SOURCE: .skilled/skills/cli-classifier/cli-jev/manual-testing-playbook/manual-testing-playbook.md:16]
3. The mcp-tooling hub has no conversation candidate: its 16 scenarios are routing gold where one prompt must resolve one `workflowMode`, including MT-004's `defer` outcome, so there is no answer-dependent next step for Q2 to test. [SOURCE: .skilled/skills/mcp-tooling/manual-testing-playbook/manual-testing-playbook.md:31] [SOURCE: .skilled/skills/mcp-tooling/manual-testing-playbook/hub-routing/ambiguous-defer.md:16] [SOURCE: .skilled/skills/mcp-tooling/manual-testing-playbook/manual-testing-playbook.md:65]
4. mcp-code-mode's 26 command scenarios stay single prompt: each is one `call_tool_chain`, script or config-recovery command whose result one shell check reads in a single pass; the steps that say "restart Code Mode" restart an MCP server, not the runtime session the runner can restart, so Q2 does not apply and Q4 keeps them. [SOURCE: .skilled/skills/mcp-code-mode/manual-testing-playbook/manual-testing-playbook.md:99] [SOURCE: .skilled/skills/mcp-code-mode/manual-testing-playbook/manual-testing-playbook.md:395] [SOURCE: .skilled/skills/mcp-code-mode/manual-testing-playbook/manual-testing-playbook.md:434]
5. mcp-code-mode's mcp-route-guard is the one add candidate in this group: the advisory exists to change the model's next tool choice, and the current file records the live OpenCode adapter path as UNAUTOMATABLE, so a two-turn companion on claude-code or opencode would cover behavior no scenario checks today (Q2). Keep the existing unit and live-core commands as primary evidence. [SOURCE: .skilled/skills/mcp-code-mode/manual-testing-playbook/plugins-and-hooks/mcp-route-guard.md:24] [SOURCE: .skilled/skills/mcp-code-mode/manual-testing-playbook/plugins-and-hooks/mcp-route-guard.md:29] [SOURCE: .skilled/skills/mcp-code-mode/manual-testing-playbook/plugins-and-hooks/mcp-route-guard.md:109]

## Ruled Out

- Treating "restart Code Mode" in CM-021, CM-022 and CM-024 as the runner's `restart` action. The restart is an MCP-server process restart inside the task, not a runtime session restart, so a conversation turn cannot perform it.
- Converting cli-classifier's routing scenarios because they gate release. Q3's regression-gate clause still needs turns a shell check can decide; a one-send conversation would add setup cost without a new check.

## Dead Ends

- Keyword scanning for "session", "restart" or "compact" alone. The terms appear in cli-jev and mcp-code-mode as command or server lifecycle language, not as runtime-session behavior.

## Edge Cases

- Ambiguous input: "conversation candidate" is read as a scenario that needs more than one exchange in a runner-driven runtime session. Package-level routing checks and command-level restarts are excluded by that reading.
- Contradictory evidence: none.
- Missing dependencies: none; all four root playbooks and the mcp-route-guard scenario were readable.
- Partial success: none; all four packages reached a verdict.

## Sources Consulted

- .skilled/skills/cli-classifier/manual-testing-playbook/manual-testing-playbook.md
- .skilled/skills/cli-classifier/cli-jev/manual-testing-playbook/manual-testing-playbook.md
- .skilled/skills/mcp-tooling/manual-testing-playbook/manual-testing-playbook.md
- .skilled/skills/mcp-tooling/manual-testing-playbook/hub-routing/ambiguous-defer.md
- .skilled/skills/mcp-code-mode/manual-testing-playbook/manual-testing-playbook.md
- .skilled/skills/mcp-code-mode/manual-testing-playbook/plugins-and-hooks/mcp-route-guard.md
- .skilled/skills/sk-doc/sk-create-manual-testing-playbook/SKILL.md
- specs/sk-doc/065-conversation-playbook-scenarios/003-conversation-adoption-research/research/research.md

## Assessment

- New information ratio: 1.00
- Questions addressed: Which of the 28 packages meet Q2 or Q3 (first four packages).
- Questions answered: none in full; the first question spans all 28 packages.

## Reflection

- What worked and why: reading the root index first made the per-package shape visible without opening every scenario; the one candidate in mcp-code-mode came from its scenario file, not its index, because the index does not mention the live-session gap.
- What did not work and why: a keyword scan would have misclassified mcp-code-mode's "restart Code Mode" steps as runner restarts.
- What I would do differently: read the one hook or plugin scenario per package before ruling a package out, since those are the likeliest places for a later-turn behavior.

## Recommended Next Focus

Audit mcp-mobbin, mcp-refero, sk-code, sk-code-ci and sk-code-quality, reading each root index plus any plugin, hook, session or approval scenario.

Timestamp: 2026-11-02T18:19:24Z
