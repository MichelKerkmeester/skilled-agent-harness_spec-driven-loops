# Iteration 6: Canonical six-mode typed-pair reconciliation

## Focus
Reconcile iteration 1's six-mode `(workflowMode, leafResourceId)` evidence with iterations 2-5 and close the reducer's remaining exact-text question without changing researched sources. Exact route proof: `Resolved route: mode=research; target_agent=@deep-research; execution=single_iteration; state_source=externalized_files; do_not_switch_mode=true`; the canonical `.opencode/agents/deep-research.md` definition was loaded before research. [SOURCE: .opencode/specs/sk-doc/019-sk-doc-router-alignment/016-sk-design-routing-research/research/prompts/iteration-006.md:1-3] [SOURCE: .opencode/agents/deep-research.md:24-45]

## Findings
1. The authoritative registry still defines exactly six independent mode namespaces and packet joins: `interface -> design-interface`, `foundations -> design-foundations`, `motion -> design-motion`, `audit -> design-audit`, `md-generator -> design-md-generator`, and `design-mcp-open-design -> design-mcp-open-design`. The first five are workflow packets and the sixth is a transport packet, but all six carry independent `workflowMode` identities. [SOURCE: .opencode/skills/sk-design/mode-registry.json:38-164] [SOURCE: .opencode/specs/sk-doc/019-sk-doc-router-alignment/016-sk-design-routing-research/research/iterations/iteration-001.md:7]
2. Each independent gold pair uses that registry mode plus a leaf selected by its packet-local map: `interface` uses its twelve intent families; `foundations` its seven foundation families; `motion` its six motion families; `audit` its six audit families; `md-generator` its five extraction/validation families; and `design-mcp-open-design` its `WIRE`, `READ`, or `RUN` transport family. Thus the canonical mapping is `(interface, local leaf)`, `(foundations, local leaf)`, `(motion, local leaf)`, `(audit, local leaf)`, `(md-generator, local leaf)`, and `(design-mcp-open-design, local leaf)`, with the exact leaf chosen from the corresponding packet's `RESOURCE_MAP`. [SOURCE: .opencode/specs/sk-doc/019-sk-doc-router-alignment/016-sk-design-routing-research/research/iterations/iteration-001.md:9-18] [SOURCE: .opencode/skills/sk-design/design-interface/SKILL.md:108-136] [SOURCE: .opencode/skills/sk-design/design-foundations/references/smart_router_pseudocode.md:24-46] [SOURCE: .opencode/skills/sk-design/design-motion/SKILL.md:126-142] [SOURCE: .opencode/skills/sk-design/design-audit/references/smart_router_pseudocode.md:23-43] [SOURCE: .opencode/skills/sk-design/design-md-generator/SKILL.md:131-166] [SOURCE: .opencode/skills/sk-design/design-mcp-open-design/references/smart_router_pseudocode.md:23-47]
3. `leafResourceId` is packet-root-relative and typed-pair uniqueness is composite. Valid examples are `(motion, references/motion_strategy.md)` and `(md-generator, assets/cardinal_rules_card.md)`; packet-qualified forms such as `design-motion/references/...` are not canonical public IDs. [SOURCE: .opencode/specs/sk-doc/019-sk-doc-router-alignment/012-sk-doc-routing-fixes/decision-record.md:68-84] [SOURCE: .opencode/specs/sk-doc/019-sk-doc-router-alignment/012-sk-doc-routing-fixes/decision-record.md:138-165] [SOURCE: .opencode/specs/sk-doc/019-sk-doc-router-alignment/016-sk-design-routing-research/research/iterations/iteration-001.md:16]
4. No substantive contradiction appears in iterations 2-5: iteration 2 confirms six generated namespaces including the transport; iteration 3 preserves typed pairs as narrow independent routing oracles; iteration 4 says the frozen corpus has zero typed-gold rows rather than disputing the mapping; and iteration 5 makes manifest and independent-gold authoring prerequisites to any router edit. [SOURCE: .opencode/specs/sk-doc/019-sk-doc-router-alignment/016-sk-design-routing-research/research/iterations/iteration-002.md:7-10] [SOURCE: .opencode/specs/sk-doc/019-sk-doc-router-alignment/016-sk-design-routing-research/research/iterations/iteration-003.md:4-11] [SOURCE: .opencode/specs/sk-doc/019-sk-doc-router-alignment/016-sk-design-routing-research/research/iterations/iteration-004.md:9-13] [SOURCE: .opencode/specs/sk-doc/019-sk-doc-router-alignment/016-sk-design-routing-research/research/iterations/iteration-005.md:9-13]
5. The apparent state contradiction is textual, not evidentiary: iteration 1 recorded the question as answered without backticks around `(workflowMode, leafResourceId)`, while the registry's canonical question includes backticks and therefore remained unresolved under exact-text reconciliation. Appending the exact canonical text closes that bookkeeping gap without reopening or changing the six-mode result. [SOURCE: .opencode/specs/sk-doc/019-sk-doc-router-alignment/016-sk-design-routing-research/research/deep-research-state.jsonl:4] [SOURCE: .opencode/specs/sk-doc/019-sk-doc-router-alignment/016-sk-design-routing-research/research/findings-registry.json:8-20] [INFERENCE: the only question-text difference is the canonical backtick pair]

## Ruled Out
- A seventh hub mode: hub entrypoints and defaults do not create another `workflowMode`. [SOURCE: .opencode/specs/sk-doc/019-sk-doc-router-alignment/016-sk-design-routing-research/research/iterations/iteration-001.md:20-25]
- Flattening `design-mcp-open-design` into `interface`: the registry and later manifest evidence preserve its independent transport namespace. [SOURCE: .opencode/skills/sk-design/mode-registry.json:145-162] [SOURCE: .opencode/specs/sk-doc/019-sk-doc-router-alignment/016-sk-design-routing-research/research/iterations/iteration-002.md:7-10]
- Packet-qualified `leafResourceId` values: the public contract requires packet-root-relative IDs. [SOURCE: .opencode/specs/sk-doc/019-sk-doc-router-alignment/012-sk-doc-routing-fixes/decision-record.md:68-84]

## Dead Ends
The seventh-mode, transport-flattening, and packet-qualified-ID directions remain contractually exhausted; this reconciliation found no evidence that warrants reopening them. [INFERENCE: based on Findings 1-4 and the strategy's blocked directions]

## Edge Cases
- Ambiguous input: none; the iteration prompt supplies one exact canonical question and a narrow reconciliation scope.
- Contradictory evidence: resolved. The state log and registry disagree only because iteration 1 omitted canonical backticks in `answeredQuestions`; the six-mode content is consistent across iterations 1-5. [SOURCE: .opencode/specs/sk-doc/019-sk-doc-router-alignment/016-sk-design-routing-research/research/deep-research-state.jsonl:4] [SOURCE: .opencode/specs/sk-doc/019-sk-doc-router-alignment/016-sk-design-routing-research/research/findings-registry.json:8-20]
- Missing dependencies: none.
- Partial success: none; the exact canonical question is answered in the state and delta records.

## Sources Consulted
- `.opencode/agents/deep-research.md:24-45`
- `.opencode/specs/sk-doc/019-sk-doc-router-alignment/016-sk-design-routing-research/research/prompts/iteration-006.md:1-35`
- `.opencode/specs/sk-doc/019-sk-doc-router-alignment/016-sk-design-routing-research/research/iterations/iteration-001.md:1-60`
- `.opencode/specs/sk-doc/019-sk-doc-router-alignment/016-sk-design-routing-research/research/iterations/iteration-002.md:4-46`
- `.opencode/specs/sk-doc/019-sk-doc-router-alignment/016-sk-design-routing-research/research/iterations/iteration-003.md:4-11`
- `.opencode/specs/sk-doc/019-sk-doc-router-alignment/016-sk-design-routing-research/research/iterations/iteration-004.md:9-13`
- `.opencode/specs/sk-doc/019-sk-doc-router-alignment/016-sk-design-routing-research/research/iterations/iteration-005.md:9-13,53`
- `.opencode/skills/sk-design/mode-registry.json:38-164`
- `.opencode/specs/sk-doc/019-sk-doc-router-alignment/012-sk-doc-routing-fixes/decision-record.md:68-84,138-165`

## Assessment
- New information ratio: 0.10
- Novelty justification: All five findings reconcile already captured evidence; the 0.10 simplicity bonus reflects closure of the exact-text registry mismatch and the resolved apparent contradiction.
- Questions addressed: How do the six sk-design modes map to independent `(workflowMode, leafResourceId)` gold pairs?
- Questions answered: How do the six sk-design modes map to independent `(workflowMode, leafResourceId)` gold pairs?

## Reflection
- What worked and why: Comparing the canonical registry question, iteration 1 record, and later iteration anchors exposed the exact-text mismatch without broad rereads or source mutation.
- What did not work and why: No evidence path failed; broad remapping was intentionally avoided because the authoritative anchors already covered all six modes.
- What I would do differently: Emit canonical key-question text byte-for-byte in every future `answeredQuestions` record at the first evidentiary closure.

## Recommended Next Focus
Synthesize the now-complete five-question evidence set and emit the packet's final resource map without reopening the six-mode mapping or changing router sources.
