# general-purpose mentions in orchestrate.md

The ten lines `rg -n 'general-purpose' .skilled/agents/orchestrate.md` printed at commit 0d6afbafc4, each classified.

- Line 125, `LEGAL: Orchestrator(0) → @general-purpose(1)`: built-in agent name, kept.
- Line 132, `ILLEGAL: Orch(0) → @review(1) → @general-purpose(2)`: built-in agent name, kept.
- Line 149, `SET subagent_type: "general-purpose" (all custom agents ...)`: dispatch instruction, rewritten to dispatch by agent name.
- Line 161, `subagent_type: "general-purpose" is only the runtime wrapper`: dispatch instruction, rewritten.
- Line 198, `"built-in" for @general-purpose`: built-in agent name, kept.
- Line 432, `rewrite the task for @markdown, @general-purpose, or main-agent`: built-in agent name, kept.
- Line 440, `ALWAYS dispatch @context (subagent_type: "general-purpose")`: dispatch instruction, rewritten to `"context"`.
- Line 519, `@general-purpose, @review, @debug`: built-in agent name, kept.
- Line 630, `Try different agent type (e.g., @general-purpose instead of @context)`: built-in agent name, kept.
- Line 689, `[implemented by @general-purpose]`: built-in agent name, kept.

The same-class search also covers the quoted wrapper spelling: `rg -n '"general"' .skilled/agents/orchestrate.md` printed nine lines, eight tier-table cells and the task-package template line. All nine are dispatch instructions and are rewritten.

Consumers of the `code` return vocabulary: `rg -n -e 'RETURN:' -e '\bDONE\b' .skilled/commands .skilled/agents/orchestrate.md` printed only `status: 'DONE'` rows in the doctor `sk-skill-integrate` script and its test, which are that script's own outcome values. No command or orchestrator line reads `DONE` from `@code`.
