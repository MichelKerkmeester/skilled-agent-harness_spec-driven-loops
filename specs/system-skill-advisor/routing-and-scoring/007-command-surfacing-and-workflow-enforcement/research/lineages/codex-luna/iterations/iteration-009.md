# Iteration 9: Prior art for command surfacing

## Focus

Investigate Angle 9: how agent systems expose exact slash commands, trigger packaged workflows from plain-language requests and keep host-specific invocation behavior explicit. The reducer still names Q1 as Next Focus, while the dispatch explicitly orders prior art ninth; I followed Angle 9. [SOURCE: specs/system-skill-advisor/routing-and-scoring/007-command-surfacing-and-workflow-enforcement/research/lineages/codex-luna/deep-research-strategy.md:293-296]

## Findings
1. GitHub Copilot’s app documents a typed slash picker, commands that invoke skills and workflows, and context/session-dependent command availability; this supports a visible, runtime-owned picker with direct command aliases, while the context caveat contradicts assuming one universal static slash surface. [SOURCE: https://docs.github.com/en/copilot/reference/github-copilot-app-reference/slash-commands?plain=1] [SOURCE: .skilled/skills/system-skill-advisor/hooks/skill-advisor-hook.md:47-60]
2. OpenAI’s skill pattern exposes name and description metadata first, then loads the workflow when the request matches or the user invokes it directly; repository command metadata already carries user-goal signals and ordered parent/leaf resources, supporting plain chat and explicit command paths that converge on one workflow identity. [SOURCE: https://developers.openai.com/plugins/concepts/skills] [SOURCE: .skilled/skills/system-deep-loop/command-metadata.json:3-33] [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/command-bridges.generated.json:319-340]
3. OpenAI’s skill-evaluation guidance tests both intended activation and unwanted activation, includes direct and natural-language prompts, and suggests 10–20 prompts as an early single-skill set; this supports positive and negative gold examples, but does not justify using a small pilot set as proof for all 45 commands or every adapter. [SOURCE: https://developers.openai.com/blog/eval-skills?trk=article-ssr-frontend-pulse_little-text-block] [SOURCE: specs/system-skill-advisor/routing-and-scoring/007-command-surfacing-and-workflow-enforcement/spec.md:57-73] [SOURCE: specs/system-skill-advisor/routing-and-scoring/007-command-surfacing-and-workflow-enforcement/research/lineages/codex-luna/iterations/iteration-008.md:9-17]
4. Repository policy separates skill routing from command workflow and write approval: Gate 2 chooses/loads the skill, Gate 4 gives the command workflow precedence over executor transport, and Gate 3 or an action contract can still require a question; the hook itself is advisory and fail-open. This contradicts treating an advisor match as permission to execute. [SOURCE: AGENTS.md:63-89] [SOURCE: .skilled/skills/system-skill-advisor/hooks/skill-advisor-hook.md:21-25] [SOURCE: .skilled/skills/system-skill-advisor/hooks/skill-advisor-hook.md:33-39]
5. Prior art and local adapters support one runtime-neutral route contract with host-specific invocation: explicit slash input resolves exactly, plain-language descriptions resolve the same packaged workflow, then the workflow’s action policy decides run or ask. Copilot’s commands are context-bound, the local adapters use different delivery channels, and DSH has no command loader, so no source supports assuming every runtime can invoke the same slash API. [SOURCE: https://docs.github.com/en/copilot/reference/github-copilot-app-reference/slash-commands?plain=1] [SOURCE: https://developers.openai.com/plugins/concepts/skills] [SOURCE: .skilled/skills/system-skill-advisor/hooks/skill-advisor-hook.md:47-60] [SOURCE: specs/system-skill-advisor/routing-and-scoring/007-command-surfacing-and-workflow-enforcement/research/lineages/codex-luna/iterations/iteration-005.md:8-16] [SOURCE: specs/system-skill-advisor/routing-and-scoring/007-command-surfacing-and-workflow-enforcement/research/lineages/codex-luna/deep-research-strategy.md:123-132]

## Ruled Out

- Adding a static table of all commands to every fallback; the reducer marks this direction BLOCKED because prior work rejected universal route guidance in the fallback. [SOURCE: specs/system-skill-advisor/routing-and-scoring/007-command-surfacing-and-workflow-enforcement/research/lineages/codex-luna/deep-research-strategy.md:123-127]
- Assuming every runtime can invoke slash commands from model context; the reducer marks this direction BLOCKED because DSH uses prompt stubs and has no command loader. [SOURCE: specs/system-skill-advisor/routing-and-scoring/007-command-surfacing-and-workflow-enforcement/research/lineages/codex-luna/deep-research-strategy.md:129-132]
- Treating a skill match as approval to execute a command; local policy separates confidence routing from artifact, write and stop-for-yes gates. [SOURCE: AGENTS.md:63-89]

## Dead Ends

- None newly established. The comparison supports a dual entry point, but it does not establish that every host can call a native slash command.

## Edge Cases

- Contradictory evidence: Copilot documents a native slash picker, while local runtime adapters use distinct event and delivery channels and DSH has no command loader. Keep the command catalog separate from each host’s invocation capability.
- Missing dependencies: No source dependency was missing. Public documentation is a design precedent, not proof of behavior in this repository.
- Partial success: Prior art supports metadata-triggered skills and direct command pickers; it does not decide this repository’s safety policy or demonstrate all-command execution.
- Scope conflict: The packet spec describes a 30-iteration, three-executor fan-out, while this dispatched lineage is configured for 10 iterations. This artifact covers one configured lineage only; it makes no packet-wide fan-out completion claim. [SOURCE: specs/system-skill-advisor/routing-and-scoring/007-command-surfacing-and-workflow-enforcement/spec.md:57,98-105] [SOURCE: specs/system-skill-advisor/routing-and-scoring/007-command-surfacing-and-workflow-enforcement/research/lineages/codex-luna/deep-research-config.json:3]
- Strategy divergence: The reducer recommends Q1 source authority, but the dispatch fixes the ten-angle order; Angle 9 was followed after checking that it did not retry a BLOCKED direction. [SOURCE: specs/system-skill-advisor/routing-and-scoring/007-command-surfacing-and-workflow-enforcement/research/lineages/codex-luna/deep-research-strategy.md:123-132,293-296]

## Sources Consulted

- https://docs.github.com/en/copilot/reference/github-copilot-app-reference/slash-commands?plain=1
- https://developers.openai.com/plugins/concepts/skills
- https://developers.openai.com/blog/eval-skills?trk=article-ssr-frontend-pulse_little-text-block
- AGENTS.md:63-89
- .skilled/skills/system-skill-advisor/hooks/skill-advisor-hook.md:21-25,33-60
- .skilled/skills/system-deep-loop/command-metadata.json:3-33
- .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/command-bridges.generated.json:319-340
- specs/system-skill-advisor/routing-and-scoring/007-command-surfacing-and-workflow-enforcement/spec.md:57-73,98-105
- specs/system-skill-advisor/routing-and-scoring/007-command-surfacing-and-workflow-enforcement/research/lineages/codex-luna/deep-research-strategy.md:123-132,293-296
- specs/system-skill-advisor/routing-and-scoring/007-command-surfacing-and-workflow-enforcement/research/lineages/codex-luna/iterations/iteration-005.md:8-16
- specs/system-skill-advisor/routing-and-scoring/007-command-surfacing-and-workflow-enforcement/research/lineages/codex-luna/iterations/iteration-008.md:9-17

## Assessment

- New information ratio: 0.90 (four findings add external activation, command-picker and evaluation patterns plus policy separation; one extends prior runtime constraints).
- Questions addressed: What public prior art supports for explicit slash invocation, natural-language skill activation, eval design and host-specific capability.
- Questions answered: None fully; no external pattern establishes the command-by-command run-or-ask policy or proves cross-runtime execution for this repository.

## Reflection

- What worked and why: Comparing official skill metadata and command-picker documentation with local hook and gate contracts separated workflow discovery, host invocation and permission to act.
- What did not work and why: Vendor documentation describes its own command picker or skill activation; none offers a portable invocation API across this repository’s runtime set.
- What I would do differently: Validate one contract on an exact slash command and one plain-language prompt per route family, then measure delivery and action-policy outcomes separately on every active adapter.

## Recommended Next Focus

Angle 10: failure modes—over-triggering, skill/command ambiguity, child-session auto-start, loops and brief-budget loss—and controls tied to current scorer, gates, adapters and renderer.
