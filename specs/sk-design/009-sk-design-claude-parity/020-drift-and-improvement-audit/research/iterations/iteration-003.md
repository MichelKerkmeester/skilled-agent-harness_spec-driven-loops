# Iteration 3: Agent and Mode Tool-Surface Parity

## Focus
This iteration checked whether `.opencode/agents/design.md` and mode contracts enforce the registry's actual per-mode tool permissions and routing constraints.

## Findings
1. **P2 misalignment — the design agent grants Write/Edit/Bash globally while the registry forbids those tools for the four advisory modes.** Agent frontmatter allows write, edit, and bash, but the registry forbids Write/Edit/Bash for `interface`, `foundations`, `motion`, and `audit`; the agent workflow does not explicitly say to downshift permissions by selected mode. [SOURCE: .opencode/agents/design.md:6] [SOURCE: .opencode/agents/design.md:8] [SOURCE: .opencode/skills/sk-design/mode-registry.json:43] [SOURCE: .opencode/skills/sk-design/mode-registry.json:64] [SOURCE: .opencode/skills/sk-design/mode-registry.json:85] [SOURCE: .opencode/skills/sk-design/mode-registry.json:106]
2. **P2 improvement — the agent's mode map omits the nested Open Design transport even though the hub routes to it.** The agent description says it routes to interface/foundations/motion/audit/md-generator, and the Mode Map lists only those five modes; the registry includes `design-mcp-open-design` as a transport mode. [SOURCE: .opencode/agents/design.md:3] [SOURCE: .opencode/agents/design.md:68] [SOURCE: .opencode/skills/sk-design/mode-registry.json:145]
3. **P3 improvement — the agent uses a generic `.opencode/skills/sk-design/design-<mode>/SKILL.md` template that does not cleanly describe all current modes.** It works for the five `design-*` workflow folders, but it does not document the transport's `design-mcp-open-design` path or the registry's `packet` field as the source of truth. [SOURCE: .opencode/agents/design.md:61] [SOURCE: .opencode/skills/sk-design/mode-registry.json:49] [SOURCE: .opencode/skills/sk-design/mode-registry.json:154]
4. **P3 positive control — no per-mode `graph-metadata.json` files were discovered under mode packets, matching the hub's single-advisor-identity rule.** The hub forbids discoverable graph metadata inside mode packets, and scoped discovery found only the hub graph metadata. [SOURCE: .opencode/skills/sk-design/SKILL.md:209] [SOURCE: .opencode/skills/sk-design/SKILL.md:215] [SOURCE: glob:.opencode/skills/sk-design/**/graph-metadata.json]

## Ruled Out
- The agent is correctly LEAF-only and denies Task, so the audit did not find nested-dispatch drift in the agent contract. [SOURCE: .opencode/agents/design.md:15] [SOURCE: .opencode/agents/design.md:45]

## Dead Ends
- No implementation validation was run against actual agent dispatch because this research task is audit-only and must not implement or dispatch sub-agents.

## Edge Cases
- Ambiguous input: agent-level broad permissions may be required for md-generator, but the current text does not explicitly constrain read-only modes to registry tool surfaces.
- Contradictory evidence: the agent advertises five modes while hub/registry advertise five workflow modes plus one transport.
- Missing dependencies: none.
- Partial success: findings are doc/contract-level; runtime enforcement behavior remains untested.

## Sources Consulted
- `.opencode/agents/design.md:1`
- `.opencode/skills/sk-design/mode-registry.json:43`
- `.opencode/skills/sk-design/mode-registry.json:145`
- `.opencode/skills/sk-design/SKILL.md:209`

## Assessment
- New information ratio: 0.42
- Questions addressed: agent route parity, agent permission/tool-surface parity, single graph identity.
- Questions answered: agent docs need transport and per-mode tool-surface clarification; graph identity rule appears preserved.

## Reflection
- What worked and why: registry-to-agent comparison exposed a focused documentation/runtime-boundary gap.
- What did not work and why: without dispatching the agent, this cannot prove runtime permission escalation occurs; it only proves the contract lacks an explicit downshift.
- What I would do differently: a follow-up implementation pass should add or test registry-derived permission wording in the agent.

## Recommended Next Focus
No further research iteration recommended before fixes; the next useful step is implementation planning for command metadata and naming cleanup.
