# Iteration 1: External/Core Inventory

## Focus

This iteration inventoried the external Claude/Codex design prompt and procedural skill taxonomy, then compared those behavioral units against the current `sk-design` parent/mode architecture. The focus override matched the strategy's first `NEXT FOCUS`, so no alternate focus was selected. [SOURCE: .opencode/specs/design/009-sk-design-claude-parity/research/deep-research-strategy.md:121]

## Scope and Sources Read

- Packet state and constraints: config, state log, strategy, findings registry, and iteration directory. [SOURCE: .opencode/specs/design/009-sk-design-claude-parity/research/deep-research-config.json:15] [SOURCE: .opencode/specs/design/009-sk-design-claude-parity/research/deep-research-strategy.md:143]
- External evidence: external README, Claude and Codex system prompts, Claude/Codex skill directories, and Codex AGENTS instructions. [SOURCE: .opencode/specs/design/009-sk-design-claude-parity/external/README.md:24] [SOURCE: .opencode/specs/design/009-sk-design-claude-parity/external/codex/AGENTS.md:3]
- Current `sk-design` evidence: parent hub, `mode-registry.json`, `hub-router.json`, graph metadata, and the five current mode SKILL files. [SOURCE: .opencode/skills/sk-design/SKILL.md:13] [SOURCE: .opencode/skills/sk-design/mode-registry.json:32]

## Findings

1. The external source is a single design-agent operating contract plus 14 invokable procedural skills, not merely a collection of style tips: its README describes an opinionated, accessibility-aware, AI-slop-resistant collaborator and says the bundle includes a 20-chapter system prompt plus 14 skills. [SOURCE: .opencode/specs/design/009-sk-design-claude-parity/external/README.md:5] [SOURCE: .opencode/specs/design/009-sk-design-claude-parity/external/README.md:22]
2. The external prompt's core behavioral unit is "designer using code," with an execution loop of understand needs, acquire context, plan visibly, build a skeleton, iterate/verify, and summarize briefly; this establishes backend/session feel as much as design taste. [SOURCE: .opencode/specs/design/009-sk-design-claude-parity/external/claude/system-prompt.md:1] [SOURCE: .opencode/specs/design/009-sk-design-claude-parity/external/claude/system-prompt.md:21]
3. The external taxonomy groups 14 procedural skills into Production, System, and Review units: seven production skills, two extraction/system skills, and five review/final-gate skills. [SOURCE: .opencode/specs/design/009-sk-design-claude-parity/external/README.md:63] [SOURCE: .opencode/specs/design/009-sk-design-claude-parity/external/claude/system-prompt.md:604] [SOURCE: .opencode/specs/design/009-sk-design-claude-parity/external/claude/system-prompt.md:614] [SOURCE: .opencode/specs/design/009-sk-design-claude-parity/external/claude/system-prompt.md:619]
4. Current `sk-design` already has a compatible parent/mode backbone: one advisor-routable hub, five workflow modes (`interface`, `foundations`, `motion`, `audit`, `md-generator`), registry-driven routing, shared reference base, and one graph-metadata identity. [SOURCE: .opencode/skills/sk-design/SKILL.md:15] [SOURCE: .opencode/skills/sk-design/SKILL.md:23] [SOURCE: .opencode/skills/sk-design/SKILL.md:41] [SOURCE: .opencode/skills/sk-design/SKILL.md:80] [SOURCE: .opencode/skills/sk-design/graph-metadata.json:3]
5. The strongest current matches are conceptual rather than one-to-one: `interface` covers distinctive direction/build judgment and design variations, `foundations` covers visual systems/tokens, `motion` covers interaction feedback and reduced motion, `audit` covers accessibility/anti-slop/polish scoring, and `md-generator` covers measured design-system extraction. [SOURCE: .opencode/skills/sk-design/design-interface/SKILL.md:24] [SOURCE: .opencode/skills/sk-design/design-foundations/SKILL.md:23] [SOURCE: .opencode/skills/sk-design/design-motion/SKILL.md:23] [SOURCE: .opencode/skills/sk-design/design-audit/SKILL.md:23] [SOURCE: .opencode/skills/sk-design/design-md-generator/SKILL.md:22]
6. High-level parity gaps are external-procedure granularity and delivery choreography: current `sk-design` has broad modes but no separate top-level equivalents for kickoff questions, deck building, clickable prototype production, tweak panels, component inventory, or named interaction-state/polish passes; those appear as aliases, references, or audit concerns rather than explicit Claude-like procedures. [SOURCE: .opencode/specs/design/009-sk-design-claude-parity/external/claude/system-prompt.md:606] [SOURCE: .opencode/specs/design/009-sk-design-claude-parity/external/claude/system-prompt.md:609] [SOURCE: .opencode/specs/design/009-sk-design-claude-parity/external/claude/system-prompt.md:610] [SOURCE: .opencode/specs/design/009-sk-design-claude-parity/external/claude/system-prompt.md:611] [SOURCE: .opencode/specs/design/009-sk-design-claude-parity/external/claude/system-prompt.md:617] [INFERENCE: current mode list and aliases in .opencode/skills/sk-design/mode-registry.json:32-127 plus the negative grep check for external skill names in sk-design]

## External Taxonomy Inventory

| External behavioral unit | Evidence | Current-match read |
| --- | --- | --- |
| Designer identity and code-as-medium | The agent is "a designer who happens to use code" and produces HTML/CSS/SVG/JS artifacts. [SOURCE: .opencode/specs/design/009-sk-design-claude-parity/external/claude/system-prompt.md:1] [SOURCE: .opencode/specs/design/009-sk-design-claude-parity/external/claude/system-prompt.md:11] | Partially matches `interface`'s studio/design-lead posture, but `sk-design` keeps build implementation as handoff to `sk-code`. [SOURCE: .opencode/skills/sk-design/design-interface/SKILL.md:16] [SOURCE: .opencode/skills/sk-design/SKILL.md:137] |
| Workflow/session feel | Understand needs, acquire context, plan visibly, build skeleton, iterate/verify, summarize. [SOURCE: .opencode/specs/design/009-sk-design-claude-parity/external/claude/system-prompt.md:23] | Partially matches the interface process and context-loading contract, but the explicit Claude-like skeleton/show-early loop is not a parent-level `sk-design` contract yet. [SOURCE: .opencode/skills/sk-design/design-interface/SKILL.md:57] [SOURCE: .opencode/skills/sk-design/SKILL.md:58] |
| Context-first design | Acquire design system, brand assets, existing codebase, and screenshots before drawing. [SOURCE: .opencode/specs/design/009-sk-design-claude-parity/external/claude/system-prompt.md:64] | Strong match: `sk-design` build bundle requires context manifests and proof cards; interface routes to real UI grounding and reuse-before-generate. [SOURCE: .opencode/skills/sk-design/SKILL.md:60] [SOURCE: .opencode/skills/sk-design/design-interface/SKILL.md:79] |
| Content/aesthetic anti-slop doctrine | No filler, purposeful visuals, anti-template defaults. [SOURCE: .opencode/specs/design/009-sk-design-claude-parity/external/claude/system-prompt.md:88] [SOURCE: .opencode/specs/design/009-sk-design-claude-parity/external/claude/system-prompt.md:122] | Strong match: parent hub includes anti-slop shared base; interface and audit explicitly reject templated defaults and model-specific slop. [SOURCE: .opencode/skills/sk-design/SKILL.md:82] [SOURCE: .opencode/skills/sk-design/design-interface/SKILL.md:189] [SOURCE: .opencode/skills/sk-design/design-audit/SKILL.md:27] |
| Visual-system doctrine | Hierarchy, typography, color, accessibility, interaction, system thinking, medium-respect. [SOURCE: .opencode/specs/design/009-sk-design-claude-parity/external/README.md:13] [SOURCE: .opencode/specs/design/009-sk-design-claude-parity/external/README.md:18] | Strong match across `foundations`, `motion`, `audit`, and `md-generator`. [SOURCE: .opencode/skills/sk-design/design-foundations/SKILL.md:15] [SOURCE: .opencode/skills/sk-design/design-motion/SKILL.md:15] [SOURCE: .opencode/skills/sk-design/design-audit/SKILL.md:15] [SOURCE: .opencode/skills/sk-design/design-md-generator/SKILL.md:12] |
| Production procedures | Discovery questions, aesthetic direction, wireframe, deck, prototype, tweakable panel, hi-fi variations. [SOURCE: .opencode/specs/design/009-sk-design-claude-parity/external/claude/system-prompt.md:604] [SOURCE: .opencode/specs/design/009-sk-design-claude-parity/external/claude/system-prompt.md:606] | Partially matched by `interface` and `foundations`; deck/prototype/tweakable are gaps as explicit procedures. [SOURCE: .opencode/skills/sk-design/mode-registry.json:34] [SOURCE: .opencode/skills/sk-design/mode-registry.json:46] [INFERENCE: negative grep check found only incidental wireframe mentions in sk-design, not external procedure names] |
| System/extraction procedures | Design-system-extract and component-extract. [SOURCE: .opencode/specs/design/009-sk-design-claude-parity/external/claude/system-prompt.md:614] | `md-generator` strongly covers measured CSS/design-token extraction; component inventory is a gap or future audit/foundations sub-procedure. [SOURCE: .opencode/skills/sk-design/design-md-generator/SKILL.md:22] [SOURCE: .opencode/skills/sk-design/design-md-generator/SKILL.md:87] |
| Review/final gates | Accessibility, AI-slop, hierarchy/rhythm, interaction-states, polish-pass. [SOURCE: .opencode/specs/design/009-sk-design-claude-parity/external/claude/system-prompt.md:619] | Mostly covered by `audit`, with motion/foundations contributing standards; named interaction-state and polish-pass choreography are less explicit in the parent taxonomy. [SOURCE: .opencode/skills/sk-design/design-audit/SKILL.md:23] [SOURCE: .opencode/skills/sk-design/design-motion/SKILL.md:24] |
| Claude vs Codex execution model | Claude review skills can delegate parallel verification; Codex reads skills as reference docs and verifies in-loop without subagents. [SOURCE: .opencode/specs/design/009-sk-design-claude-parity/external/claude/system-prompt.md:621] [SOURCE: .opencode/specs/design/009-sk-design-claude-parity/external/codex/AGENTS.md:5] [SOURCE: .opencode/specs/design/009-sk-design-claude-parity/external/codex/AGENTS.md:7] | Relevant for OpenCode: `sk-design` should preserve OpenCode-native mode routing and not copy Claude subagent assumptions wholesale. [SOURCE: .opencode/skills/sk-design/SKILL.md:41] [SOURCE: .opencode/skills/sk-design/SKILL.md:99] |

## Current sk-design Architecture Inventory

- Parent hub: one public advisor identity that routes by `workflowMode` through `mode-registry.json`; the hub intentionally holds no per-mode design logic. [SOURCE: .opencode/skills/sk-design/SKILL.md:15] [SOURCE: .opencode/skills/sk-design/SKILL.md:41]
- Modes: `interface`, `foundations`, `motion`, `audit`, and `md-generator`; their backend kinds are four reference-base guidance modes plus one Playwright extraction backend. [SOURCE: .opencode/skills/sk-design/SKILL.md:23] [SOURCE: .opencode/skills/sk-design/mode-registry.json:34] [SOURCE: .opencode/skills/sk-design/mode-registry.json:112]
- Bundle behavior: UI build work can load an ordered `interface` + `foundations` bundle with shared resources and proof-card requirements. [SOURCE: .opencode/skills/sk-design/SKILL.md:58] [SOURCE: .opencode/skills/sk-design/hub-router.json:19]
- Shared base: anti-slop principles, cognitive laws, design-token vocabulary, and proof-token references are loaded as common vocabulary, not as a separate user workflow. [SOURCE: .opencode/skills/sk-design/SKILL.md:82] [SOURCE: .opencode/skills/sk-design/hub-router.json:13]
- Graph identity: current architecture intentionally preserves exactly one `graph-metadata.json` for the whole skill. [SOURCE: .opencode/skills/sk-design/SKILL.md:92] [SOURCE: .opencode/skills/sk-design/graph-metadata.json:3]

## Gap Summary

1. **Explicit procedure gap:** Claude/Codex exposes 14 named task procedures; `sk-design` exposes five broad modes. The refactor probably needs a Claude-like procedure layer inside or above modes, not 14 new advisor identities. [SOURCE: .opencode/specs/design/009-sk-design-claude-parity/external/README.md:30] [SOURCE: .opencode/skills/sk-design/SKILL.md:23] [INFERENCE: preserve one graph identity from .opencode/skills/sk-design/SKILL.md:92]
2. **Production artifact gap:** Deck, prototype, tweakable panel, and low-fi wireframe procedures are explicit externally but not first-class `sk-design` modes. [SOURCE: .opencode/specs/design/009-sk-design-claude-parity/external/claude/system-prompt.md:608] [SOURCE: .opencode/specs/design/009-sk-design-claude-parity/external/claude/system-prompt.md:609] [SOURCE: .opencode/specs/design/009-sk-design-claude-parity/external/claude/system-prompt.md:610] [SOURCE: .opencode/specs/design/009-sk-design-claude-parity/external/claude/system-prompt.md:611]
3. **Review choreography gap:** `audit` covers most review content, but Claude's `polish-pass` is a named aggregator over accessibility, slop, interaction states, and hierarchy/rhythm. [SOURCE: .opencode/specs/design/009-sk-design-claude-parity/external/claude/system-prompt.md:621] [SOURCE: .opencode/specs/design/009-sk-design-claude-parity/external/claude/system-prompt.md:625] [SOURCE: .opencode/skills/sk-design/design-audit/SKILL.md:15]
4. **Session-feel gap:** External prompts define chat behavior and progress cadence directly; `sk-design` has strong mode routing but less parent-level language about one consolidated question round, showing work early, and brief summaries. [SOURCE: .opencode/specs/design/009-sk-design-claude-parity/external/claude/system-prompt.md:25] [SOURCE: .opencode/specs/design/009-sk-design-claude-parity/external/claude/system-prompt.md:27] [SOURCE: .opencode/specs/design/009-sk-design-claude-parity/external/claude/system-prompt.md:30] [SOURCE: .opencode/skills/sk-design/SKILL.md:47]

## Evidence Table

| Claim | External evidence | sk-design evidence | Parity read |
| --- | --- | --- | --- |
| External is prompt + skill library | 20 chapters + 14 invokable skills. [SOURCE: .opencode/specs/design/009-sk-design-claude-parity/external/README.md:29] [SOURCE: .opencode/specs/design/009-sk-design-claude-parity/external/README.md:30] | Parent hub + five modes. [SOURCE: .opencode/skills/sk-design/SKILL.md:13] [SOURCE: .opencode/skills/sk-design/SKILL.md:23] | Need taxonomy mapping, not literal copy. |
| Production cluster is larger than current mode count | Seven production skills listed. [SOURCE: .opencode/specs/design/009-sk-design-claude-parity/external/README.md:65] [SOURCE: .opencode/specs/design/009-sk-design-claude-parity/external/README.md:66] | `interface` aliases include UI build and design variations, but not deck/prototype/tweak panel as mode keys. [SOURCE: .opencode/skills/sk-design/mode-registry.json:46] | Gaps are sub-procedure granularity. |
| Extraction overlaps strongly | External has design-system-extract and component-extract. [SOURCE: .opencode/specs/design/009-sk-design-claude-parity/external/README.md:68] [SOURCE: .opencode/specs/design/009-sk-design-claude-parity/external/README.md:69] | `md-generator` extracts live CSS/tokens into DESIGN.md and validates. [SOURCE: .opencode/skills/sk-design/design-md-generator/SKILL.md:12] [SOURCE: .opencode/skills/sk-design/design-md-generator/SKILL.md:72] | Design-system extraction matches; component inventory is weaker. |
| Review overlaps strongly | External review skills include a11y, slop, hierarchy/rhythm, interaction states, polish. [SOURCE: .opencode/specs/design/009-sk-design-claude-parity/external/README.md:71] [SOURCE: .opencode/specs/design/009-sk-design-claude-parity/external/README.md:72] | Audit covers accessibility, performance, responsive, theming, anti-patterns, quality, and hardening. [SOURCE: .opencode/skills/sk-design/design-audit/SKILL.md:15] | Mostly covered; aggregation/name choreography differs. |
| OpenCode-native preservation matters | Codex variant has no skill tool and no verifier subagent; it reads skill docs and verifies itself. [SOURCE: .opencode/specs/design/009-sk-design-claude-parity/external/codex/AGENTS.md:5] [SOURCE: .opencode/specs/design/009-sk-design-claude-parity/external/codex/AGENTS.md:7] | sk-design has advisor routing, transport boundaries, and one graph identity. [SOURCE: .opencode/skills/sk-design/SKILL.md:99] [SOURCE: .opencode/skills/sk-design/graph-metadata.json:3] | Clone feel should adapt to OpenCode runtime, not import Claude/Codex mechanics verbatim. |

## Ruled Out

- Web research was ruled out because the task is a local external/core inventory and the local packet contains both external variants plus current `sk-design` sources. [SOURCE: .opencode/specs/design/009-sk-design-claude-parity/research/deep-research-strategy.md:134]
- A literal one-to-one mode clone was ruled out for this iteration because current `sk-design` explicitly requires one advisor identity and registry-driven mode routing. [SOURCE: .opencode/skills/sk-design/SKILL.md:92] [SOURCE: .opencode/skills/sk-design/SKILL.md:97]
- Modifying `sk-design` was ruled out by packet boundaries and the strategy non-goal. [SOURCE: .opencode/specs/design/009-sk-design-claude-parity/research/deep-research-strategy.md:56] [SOURCE: .opencode/specs/design/009-sk-design-claude-parity/research/deep-research-strategy.md:59]

## Dead Ends

- Searching `sk-design` for the exact external procedure names (`make-a-deck`, `make-a-prototype`, `make-tweakable`, `component-extract`, `interaction-states-pass`, `polish-pass`) did not reveal first-class current units; only incidental `wireframe` mentions appeared. [INFERENCE: negative grep check over .opencode/skills/sk-design/**/*.md plus current mode registry .opencode/skills/sk-design/mode-registry.json:32-127]
- Treating Claude subagent verification as portable was eliminated because Codex explicitly removes verifier subagents and current `sk-design` must stay OpenCode-native. [SOURCE: .opencode/specs/design/009-sk-design-claude-parity/external/codex/AGENTS.md:7] [SOURCE: .opencode/skills/sk-design/SKILL.md:99]

## Edge Cases

- Ambiguous input: none materially blocking; the focus override and strategy `NEXT FOCUS` agree. [SOURCE: .opencode/specs/design/009-sk-design-claude-parity/research/deep-research-strategy.md:121]
- Contradictory evidence: Claude delegates some verification to parallel agents, while Codex requires in-loop verification and no subagent; this is a runtime difference, not a factual contradiction. [SOURCE: .opencode/specs/design/009-sk-design-claude-parity/external/claude/system-prompt.md:621] [SOURCE: .opencode/specs/design/009-sk-design-claude-parity/external/codex/AGENTS.md:7]
- Missing dependencies: `research/research.md` was absent at the start, but `progressiveSynthesis=true`, so a packet-local synthesis file was created after this iteration. [SOURCE: .opencode/specs/design/009-sk-design-claude-parity/research/deep-research-config.json:15]
- Partial success: none. The local inventory answered the requested first-pass mapping; detailed 14-skill-by-14-skill procedure analysis remains for later.

## Sources Consulted

- `.opencode/specs/design/009-sk-design-claude-parity/research/deep-research-config.json:15`
- `.opencode/specs/design/009-sk-design-claude-parity/research/deep-research-state.jsonl:1`
- `.opencode/specs/design/009-sk-design-claude-parity/research/deep-research-strategy.md:121`
- `.opencode/specs/design/009-sk-design-claude-parity/research/deep-research-findings-registry.json:12`
- `.opencode/specs/design/009-sk-design-claude-parity/external/README.md:24`
- `.opencode/specs/design/009-sk-design-claude-parity/external/claude/system-prompt.md:1`
- `.opencode/specs/design/009-sk-design-claude-parity/external/claude/system-prompt.md:600`
- `.opencode/specs/design/009-sk-design-claude-parity/external/codex/system-prompt.md:597`
- `.opencode/specs/design/009-sk-design-claude-parity/external/codex/AGENTS.md:1`
- `.opencode/skills/sk-design/SKILL.md:13`
- `.opencode/skills/sk-design/mode-registry.json:32`
- `.opencode/skills/sk-design/hub-router.json:19`
- `.opencode/skills/sk-design/graph-metadata.json:3`
- `.opencode/skills/sk-design/design-interface/SKILL.md:24`
- `.opencode/skills/sk-design/design-foundations/SKILL.md:23`
- `.opencode/skills/sk-design/design-motion/SKILL.md:23`
- `.opencode/skills/sk-design/design-audit/SKILL.md:23`
- `.opencode/skills/sk-design/design-md-generator/SKILL.md:22`

## Assessment

- New information ratio: 1.00
- Novelty justification: 6 of 6 findings were new because the state log had no previous iteration records and the registry had no findings.
- Questions addressed: Q1 (Claude Design essence), Q2 (external taxonomy mapping), Q3 (OpenCode preservation constraints).
- Questions answered: Q2 initial external/current inventory baseline.
- Questions remaining: Q1 needs deeper prompt-voice/session synthesis; Q2 needs a full 14-procedure mapping table; Q3 needs preservation constraints; Q4 and Q5 remain open.

## Reflection

- What worked and why: Starting from the strategy's `NEXT FOCUS` and reading the external README/system prompt sections first produced a clean taxonomy before comparing against `sk-design` modes.
- What did not work and why: Broad globbing under `external/**` returned no files despite the directory being present, so direct directory reads were used instead; this cost extra tool budget but did not block the inventory.
- What I would do differently: Next iteration should read the individual external skill files in clusters, not all at once, and produce a detailed mapping table from each external procedure to current or proposed `sk-design` placement.

## Recommended Next Focus

Map all 14 external procedural skills one-by-one to existing `sk-design` modes or proposed internal procedure cards, with special attention to whether production procedures should live inside `interface`, as a parent workflow layer, or as benchmark/playbook scenarios.
