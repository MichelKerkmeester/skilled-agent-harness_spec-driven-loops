# Iteration 4: RQ7 tool and MCP filtering

## Focus
RQ7 from the phase spec: the extension can filter tools and MCP servers while keeping essentials always allowed. Does anything in our stack, such as Code Mode's tool surface or the hook outputs, over-advertise tools the same way, and would the idea carry over? [SOURCE: specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/001-deep-research/spec.md:135]

I read the question narrowly: what reaches the model's context as tool advertisements, and whether calls are gated. I deferred the host-owned skill listing to the Recommended Next Focus, because it concerns skills, not tools.

## Actions Taken
1. Read the extension's tool filter end to end and its pure availability policy.
2. Grepped the extension's settings for the tool-filter defaults, and its README for how it pitches and limits the feature.
3. Enumerated our native MCP registrations for Claude Code and OpenCode, and the Code Mode manuals in `.utcp_config.json`.
4. Read Code Mode's native tool registrations and the `search_tools` / `list_tools` handlers.

## Findings

1. **Extension mechanism (confirmed from code).** Tool filtering is opt-in and off by default: `enabled: false, mode: "tools", cadence: "prompt", maxAdded: 8, minCandidates: 0` and empty `alwaysAllowedTools` / `alwaysAllowedMcpServers` [SOURCE: specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/context/pi-context-decisions-main/src/settings.ts:71]. It has two levers. Declared tools are removed with `pi.setActiveTools`, and the filter only ever restores tools it removed itself. Codemode and deferred tools cannot be hidden, so they are gated at `tool_call` instead [SOURCE: specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/context/pi-context-decisions-main/src/extension/tool-filter.ts:5]. Availability is additive per branch: internal tools are always available, and a group is available when it is in the ledger or an allowlist [SOURCE: specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/context/pi-context-decisions-main/src/apps/tool-policy.ts:45]. The file comment says it is "NOT a sandbox", and the README repeats the point [SOURCE: specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/context/pi-context-decisions-main/src/extension/tool-filter.ts:8] [SOURCE: specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/context/pi-context-decisions-main/README.md:159].

2. **Our native tool surface is one server with seven fixed tools (confirmed from config and code).** Claude Code registers exactly one MCP server, `code_mode` [SOURCE: .mcp.json:3], and OpenCode registers the same one [SOURCE: opencode.json:22]. Behind it, `.utcp_config.json` holds 13 manuals: aside, three chrome_devtools instances, clickup_official, figma, github, gitkraken, mobbin, notion, obsidian, refero and webflow [SOURCE: .utcp_config.json:16] [SOURCE: .utcp_config.json:233]. Code Mode registers seven static meta-tools: `register_manual`, `deregister_manual`, `search_tools`, `list_tools`, `get_required_keys_for_tool`, `tool_info` and `call_tool_chain` [SOURCE: .skilled/skills/mcp-code-mode/mcp-server/index.ts:245] [SOURCE: .skilled/skills/mcp-code-mode/mcp-server/index.ts:352]. Their descriptions are fixed strings that never list a manual's tools [SOURCE: .skilled/skills/mcp-code-mode/mcp-server/index.ts:354]. The roughly 200 manual tools reach context only when the model pulls them through `search_tools`, which is capped by a `limit` parameter [SOURCE: .skilled/skills/mcp-code-mode/mcp-server/index.ts:281] [SOURCE: .skilled/skills/mcp-code-mode/SKILL.md:12]. So the problem the extension solves, too many declared tool schemas in every request, does not exist on our native surface. Code Mode's pull design already removed it.

3. **Verdict on porting the advertisement filter: REJECT (inferred from findings 1 and 2).** The only tool schemas we advertise are seven fixed meta-tools, so there is nothing to withhold. Scoring "which manuals are relevant to this prompt" would only change what `search_tools` returns, and the model already passes its own task description to that call [SOURCE: .skilled/skills/mcp-code-mode/mcp-server/index.ts:280]. Cost: a second scorer and ledger, with no saved schema tokens. One probe would confirm the "no saved tokens" claim: measure the token size of the seven declared tool schemas in a fresh session. A few hundred tokens would mean nothing is left to save. This verdict matches the sibling research's REJECT of pull replacing push, here in the opposite direction: push filtering for a surface that is already pull.

4. **Call gating: Code Mode has no per-task gate. That is a gap only in theory (confirmed absence; risk inferred).** `call_tool_chain` executes code "with direct access to all registered tools" [SOURCE: .skilled/skills/mcp-code-mode/mcp-server/index.ts:354], and `list_tools` returns every registered name [SOURCE: .skilled/skills/mcp-code-mode/mcp-server/index.ts:307]. The launcher does no manual filtering. It only resolves a Node interpreter and spawns the server [SOURCE: .skilled/bin/mcp-code-mode-launcher.cjs:141]. The extension's own `tool_call` gate cannot stop codemode-style access in a meaningful way either: it gates by tool name, and it admits that `bash` and discovery are unaffected [SOURCE: specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/context/pi-context-decisions-main/src/extension/tool-filter.ts:7]. In our stack, the controls that actually bind are static ones: the host permission prompts and per-agent `permission:` blocks (for example `chrome_devtools: deny` in the dispatched deep-research agent definition) [INFERENCE: based on the agent persona frontmatter supplied in this dispatch]. **Verdict: REJECT.** A relevance-scored gate is the wrong tool for safety, because a probabilistic model call would decide access. It is not needed for context, per finding 2. If per-task MCP scoping is ever wanted, it belongs in static agent permissions or UTCP manual enablement, not in an advisor-scored gate.

5. **What does carry over: "essentials always allowed" as a static, additive floor (ADAPT, inferred).** The extension makes an allowlist grant bypass scoring and records it as `allowlisted`, never with a score, so removing the allowlist entry later never takes availability away [SOURCE: specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/context/pi-context-decisions-main/src/extension/tool-filter.ts:258] [SOURCE: specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/context/pi-context-decisions-main/src/apps/tool-policy.ts:66]. Our analogue is the skill's `allowed-tools` frontmatter, which names the four Code Mode meta-tools a skill may use [SOURCE: .skilled/skills/mcp-code-mode/SKILL.md:4]. It already plays the role of a static essentials list. I found nothing to add. I record this only so a later phase does not rebuild the extension's allowlist machinery for tools. Verdict: ADAPT means "keep the static floor we already have", with no new work. The skill-side pinned set was already ruled out in iteration 2.

6. **Fail-closed polarity differs for tools (confirmed from code).** For tools, the extension fails closed. With no registry snapshot it blocks every external call, a throwing allowlist read falls back to fewer grants, and an unknown tool on a degraded registry is blocked [SOURCE: specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/context/pi-context-decisions-main/src/extension/tool-filter.ts:360] [SOURCE: specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/context/pi-context-decisions-main/src/extension/tool-filter.ts:461]. That is the right polarity for an access gate, and the wrong one for the advisor's additive brief. This agrees with iteration 2's REJECT of porting `failMode: "closed"` by name. The two features in one extension use opposite failure policies, which supports the iteration 2 reading that polarity must follow what the component does: an access gate fails closed, an advertisement fails open.

## Ruled Out
- Porting the advertisement-side tool filter (`setActiveTools` withholding) to Code Mode (finding 3).
- An advisor-scored `call_tool_chain` gate (finding 4).

## Dead Ends
- Porting relevance-scored tool or MCP filtering into our stack. Our only native surface is seven fixed meta-tools, and access control is static by design.

## Edge Cases
- Ambiguous input: "hook outputs over-advertising tools" could mean the skill listing the host injects. That listing is host-owned and covers skills, not tools, so I deferred it.
- Contradictory evidence: none.
- Missing dependencies: I did not measure the live token size of Code Mode's declared schemas. Finding 3 names the probe that would.
- Partial success: none.

## SCOPE VIOLATIONS
- `research/research.md`: the config sets `progressiveSynthesis: true`, but this dispatch's allowed-write list names only the iteration narrative, the delta and the gateway writes. I did not create or edit `research.md`. The workflow synthesis step owns that file.

## Sources Consulted
- specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/context/pi-context-decisions-main/src/extension/tool-filter.ts
- specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/context/pi-context-decisions-main/src/apps/tool-policy.ts
- specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/context/pi-context-decisions-main/src/settings.ts
- specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/context/pi-context-decisions-main/README.md
- .mcp.json, opencode.json, .utcp_config.json
- .skilled/skills/mcp-code-mode/mcp-server/index.ts, .skilled/skills/mcp-code-mode/SKILL.md
- .skilled/bin/mcp-code-mode-launcher.cjs

## Assessment
- New information ratio: 0.75 (four new findings, two partly new because they restate iteration 2's polarity and pin verdicts with tool-side evidence; (4 + 0.5*2)/6 = 0.83, minus 0.08 because the main answer is a structural "the problem does not exist here")
- Questions addressed: RQ7
- Questions answered: RQ7

## Reflection
- What worked and why: counting the native MCP registrations first. Finding one server settled the over-advertising question before any deep read of Code Mode.
- What did not work and why: pipes and `--include` globs were refused or failed under zsh. Single plain greps worked.
- What I would do differently: measure the declared-schema token size directly, to turn finding 3's "no saved tokens" into a confirmed claim.

## Questions Answered
- Tool and MCP filtering (RQ7)

## Questions Remaining
- None of RQ1 to RQ8 are open. Iteration 5 can consolidate the verdicts.

## Recommended Next Focus
Iteration 5: a consolidation pass across iterations 1-4. Produce the final ADOPT, ADAPT and REJECT table in the spec's answer shape, check each verdict cites both codebases at `file:line`, and list the live probes that would confirm inferred claims: the iteration 3 follow-up routing probe and this iteration's schema token measurement. Optionally look at whether the host-injected skill listing, which is not hook-controlled, makes the advisor brief partly redundant.
