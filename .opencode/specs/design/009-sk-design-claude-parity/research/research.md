# Deep Research Synthesis - sk-design Claude Parity

## Progressive Findings

### Iteration 1 - External/Core Inventory

- External Claude/Codex design material is best understood as one design-agent operating contract plus 14 procedural skills grouped into Production, System, and Review clusters. [SOURCE: .opencode/specs/design/009-sk-design-claude-parity/research/iterations/iteration-001.md]
- Current `sk-design` already has the right OpenCode-native backbone: one advisor-routable parent hub, five modes, registry-driven routing, shared reference base, and one graph metadata identity. [SOURCE: .opencode/specs/design/009-sk-design-claude-parity/research/iterations/iteration-001.md]
- Initial gaps are not core taste coverage; they are explicit procedure granularity and Claude-like delivery choreography for discovery, wireframes, decks, prototypes, tweak panels, component inventory, interaction-state passes, and final polish aggregation. [SOURCE: .opencode/specs/design/009-sk-design-claude-parity/research/iterations/iteration-001.md]

### Iteration 2 - 14-Skill Mapping

- All 14 external procedures have a proposed placement without creating 14 new advisor identities: one core hub preflight (`discovery-questions`), several `interface` production procedures, one preserved extraction backend path, shared component/review references, and `audit` as the final-gate aggregator. [SOURCE: .opencode/specs/design/009-sk-design-claude-parity/research/iterations/iteration-002.md]
- `design-system-extract` should preserve and strengthen the current `design-md-generator` measured extraction backend, while `component-extract` is the main system gap as a component-inventory reference rather than a new mode. [SOURCE: .opencode/specs/design/009-sk-design-claude-parity/research/iterations/iteration-002.md]
- The review cluster maps to `audit` plus shared `foundations`/`motion` standards; Claude-only parallel-agent mechanics should not be copied into OpenCode placement. [SOURCE: .opencode/specs/design/009-sk-design-claude-parity/research/iterations/iteration-002.md]

### Iteration 5 - Backend / Operating Model

- The OpenCode-native Claude Design backend model is not a monolithic prompt: it is an operating constitution in the parent hub, registry-selected procedure cards in mode packets, an evidence/source-of-truth gate, and a verifier cadence after substantive visual changes. [SOURCE: .opencode/specs/design/009-sk-design-claude-parity/research/iterations/iteration-005.md]
- The Codex no-subagent variant shows the verifier cadence should be transport-adaptive: delegate when a verifier exists, self-verify with browser/Playwright/devtools when it does not, and never claim success on unverified UI behavior. [SOURCE: .opencode/specs/design/009-sk-design-claude-parity/research/iterations/iteration-005.md]
- Preserve `mode-registry` as the routing/source-of-truth layer and keep `design-md-generator` as the unique mutating `playwright-extract` backend while cloning Claude’s prompt/procedure/evidence/review feel. [SOURCE: .opencode/specs/design/009-sk-design-claude-parity/research/iterations/iteration-005.md]

### Iteration 7 - Subskill / Procedure Content Strategy

- `design-interface` should host the production procedure cards: discovery, aesthetic direction, wireframe, variations, prototype flow, tweakable controls, and preflight, while preserving register/dials and anti-default critique. [SOURCE: .opencode/specs/design/009-sk-design-claude-parity/research/iterations/iteration-007.md]
- `design-foundations`, `design-motion`, `design-audit`, and `design-md-generator` should absorb external procedures as mode-local cards, not new public modes: token/component inventories in foundations, interaction-state pass in motion, review-lane aggregation in audit, and stricter measured extraction in md-generator. [SOURCE: .opencode/specs/design/009-sk-design-claude-parity/research/iterations/iteration-007.md]
- Shared/procedure assets should define a private procedure index and card schema while the parent hub remains routing-only with one advisor identity; Claude parallel-agent mechanics become audit lanes/proof fields, not required nested agents. [SOURCE: .opencode/specs/design/009-sk-design-claude-parity/research/iterations/iteration-007.md]

## Open Threads

- Define the parent hub/session contract that chooses among the mapped procedure cards while preserving one `sk-design` identity.
- Separate clone-feel behaviors from runtime-specific Claude/Codex mechanics.
- Preserve OpenCode-native routing, design-md-generator extraction, benchmark/playbook evidence, and one skill identity.

## Final Synthesis / Refactor Blueprint (Iteration 10)

- **Architecture:** preserve one public `sk-design` hub, five public modes, registry-driven `workflowMode`/`backendKind`, and one graph identity; add a private procedure-card layer inside existing packets instead of 14 public modes. [SOURCE: .opencode/skills/sk-design/SKILL.md:15] [SOURCE: .opencode/skills/sk-design/mode-registry.json:32] [SOURCE: .opencode/specs/design/009-sk-design-claude-parity/research/iterations/iteration-010.md]
- **Parent contract:** make the hub feel like a Claude Design manager by enforcing context acquisition, visible planning for build work, smallest-useful-mode routing, proof gates, and verifier cadence, while keeping all mode logic in packets. [SOURCE: .opencode/specs/design/009-sk-design-claude-parity/external/claude/system-prompt.md:21] [SOURCE: .opencode/skills/sk-design/SKILL.md:60] [SOURCE: .opencode/specs/design/009-sk-design-claude-parity/research/iterations/iteration-010.md]
- **Procedure map:** `interface` hosts production cards, `foundations` system/source cards, `motion` state/temporal cards, `audit` review lanes, and `md-generator` a strict extraction bridge. [SOURCE: .opencode/specs/design/009-sk-design-claude-parity/research/iterations/iteration-007.md:11] [SOURCE: .opencode/specs/design/009-sk-design-claude-parity/research/iterations/iteration-010.md]
- **Acceptance:** pass router baseline first, then parity addendum scenarios for procedure selection, packet loading, context/proof fields, anti-slop lanes, `md-generator` fidelity, and negative controls; do not overwrite frozen baselines. [SOURCE: .opencode/specs/design/009-sk-design-claude-parity/research/iterations/iteration-008.md:11] [SOURCE: .opencode/specs/design/009-sk-design-claude-parity/research/iterations/iteration-009.md:36]
- **Migration:** baseline/ownership gate → compatibility shell → private procedure layer → mode-by-mode refactor → benchmark/live checks → metadata regeneration only if approved. [SOURCE: .opencode/specs/design/009-sk-design-claude-parity/research/iterations/iteration-009.md:13] [SOURCE: .opencode/specs/design/009-sk-design-claude-parity/research/iterations/iteration-010.md]
- **Open decisions:** existing uncommitted `sk-design` change ownership, private procedure cards vs public taxonomy expansion, router-only vs live acceptance threshold, metadata regeneration scope, and release authority for benchmark failures. [SOURCE: .opencode/specs/design/009-sk-design-claude-parity/research/iterations/iteration-009.md:27]
