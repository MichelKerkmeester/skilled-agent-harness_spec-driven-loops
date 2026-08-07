# Iteration 6: Refactored Mode / Procedure Architecture

## Focus
Evaluate four architecture options for the sk-design Claude Design parity refactor: keep five modes with Claude-like procedure cards, expand or rename modes, introduce internal procedural cards, or mirror the 14 external skills. This pass recommends the best OpenCode-native architecture and names routing implications only; it does not edit skill files.

## Findings
1. **Best architecture: keep the five public modes and add an internal procedure-card layer.** The current hub is explicitly one public design skill with five modes, registry-driven routing, one graph identity, and no per-mode logic in the parent. That makes public mode stability valuable; Claude-like behavior should be cloned through loaded procedures after mode resolution, not by changing public identities. [SOURCE: .opencode/skills/sk-design/SKILL.md:15] [SOURCE: .opencode/skills/sk-design/SKILL.md:41] [SOURCE: .opencode/skills/sk-design/SKILL.md:80] [SOURCE: .opencode/skills/sk-design/mode-registry.json:4]
2. **The 14 external skills are procedural taxonomy, not a public routing taxonomy.** Claude calls each skill a phased procedure with explicit triggers and checks, and its normal chain is `discovery-questions` -> `frontend-aesthetic-direction` -> `wireframe` -> `make-a-prototype` -> `polish-pass`. Codex proves the portable form is file-read procedure loading, not a skill-invocation surface. Therefore OpenCode should model them as cards selected by the hub/mode router. [SOURCE: .opencode/specs/sk-design/009-sk-design-claude-parity/external/claude/system-prompt.md:602] [SOURCE: .opencode/specs/sk-design/009-sk-design-claude-parity/external/claude/system-prompt.md:604] [SOURCE: .opencode/specs/sk-design/009-sk-design-claude-parity/external/claude/system-prompt.md:619] [SOURCE: .opencode/specs/sk-design/009-sk-design-claude-parity/external/claude/system-prompt.md:643] [SOURCE: .opencode/specs/sk-design/009-sk-design-claude-parity/external/codex/AGENTS.md:5]
3. **Expanding or renaming public modes would solve the wrong layer.** The five current modes already align to durable OpenCode axes: interface direction, static foundations, motion, audit, and measured DESIGN.md extraction. The external production procedures like deck, prototype, variations, and tweakable are deliverable shapes inside interface/build flow, while review procedures are audit checks; making each a public mode would dilute the stable axis model. [SOURCE: .opencode/skills/sk-design/mode-registry.json:32] [SOURCE: .opencode/skills/sk-design/design-interface/SKILL.md:16] [SOURCE: .opencode/skills/sk-design/design-foundations/SKILL.md:15] [SOURCE: .opencode/skills/sk-design/design-motion/SKILL.md:15] [SOURCE: .opencode/skills/sk-design/design-audit/SKILL.md:15] [SOURCE: .opencode/skills/sk-design/design-md-generator/SKILL.md:12]
4. **Do not put all procedure logic under `shared/`; use a hybrid internal layout.** The current parent says `shared/` is a reference base and must not gain per-mode workflow logic. So the clean architecture is mode-local procedures for owner-specific cards and `shared/procedures/` only for genuinely cross-mode cards such as discovery/context/proof/polish orchestration. This preserves the shared vocabulary boundary while giving Claude-like card loading. [SOURCE: .opencode/skills/sk-design/SKILL.md:82] [SOURCE: .opencode/skills/sk-design/design-interface/SKILL.md:74] [SOURCE: .opencode/skills/sk-design/design-audit/SKILL.md:97] [SOURCE: .opencode/skills/sk-design/design-motion/SKILL.md:99]
5. **Routing implication: mode first, procedure second, verifier/proof gate last.** The hub-router already has default mode, tie-break order, ordered bundles, and per-mode resource paths; the refactor should add procedure selection after `workflowMode` resolution, not before. For UI build work, keep `interface + foundations` ordered bundle, then load relevant procedure cards, then require context/proof/audit evidence before ready claims. [SOURCE: .opencode/skills/sk-design/hub-router.json:4] [SOURCE: .opencode/skills/sk-design/hub-router.json:19] [SOURCE: .opencode/skills/sk-design/hub-router.json:27] [SOURCE: .opencode/skills/sk-design/SKILL.md:58] [SOURCE: .opencode/skills/sk-design/design-audit/SKILL.md:271]

## Architecture Recommendation
Use a two-tier public/private model: keep public `workflowMode` keys `interface`, `foundations`, `motion`, `audit`, and `md-generator`; add private procedure cards under mode packets plus a small `shared/procedures/` set for cross-mode orchestration. The procedure cards can mirror Claude names where useful, but they must not get `graph-metadata.json`, advisor identities, or public mode keys.

## Option Verdicts
- **Keep 5 modes with Claude-like procedure cards:** Accept, but make the cards an explicit internal procedure layer rather than prose embedded in mode SKILL.md files.
- **Expand or rename modes:** Reject for now; current mode names represent durable axes and backend kinds better than deliverable names.
- **Introduce internal procedural cards under shared/procedures:** Accept only as a cross-mode subset; keep owner-specific procedures mode-local to avoid turning `shared/` into workflow logic.
- **Mirror 14 external skills:** Reject; it conflicts with one advisor identity, creates routing noise, and demotes existing OpenCode backends.

## Routing Implications
- Advisor continues to route to single identity `sk-design`; no new public skill ids.
- `mode-registry.json` remains the source of truth for public modes and backend kinds.
- `hub-router.json` may gain procedure signal metadata, but procedure bodies stay in markdown cards under mode-local or shared internal paths.
- Multi-axis work routes to ordered mode bundles first, then procedure chains. Example: greenfield UI becomes `interface + foundations`, then discovery/aesthetic/wireframe-or-prototype/polish cards as needed.
- `md-generator` stays the only measured extraction backend and should not be recast as a generic design-system procedure.

## Ruled Out
- 14 public sk-design subskills or modes.
- Renaming `md-generator` to match external `design-system-extract`; the existing backend is a stronger, measured CSS extraction contract.
- A single `shared/procedures/` dumping ground for every external card.
- Parent-hub prose that manually hardcodes all procedure logic.

## Dead Ends
- Literal Claude skill mirroring looked attractive by taxonomy count but failed against OpenCode's one-identity and registry contracts.
- Expanding modes by deliverable shape failed because deck/prototype/variation are output forms, not durable backend axes.

## Edge Cases
- The external Codex `AGENTS.md` contains operating instructions; in this iteration it was treated only as evidence about the Codex no-skill-tool procedure-loading model. [SOURCE: .opencode/specs/sk-design/009-sk-design-claude-parity/external/codex/AGENTS.md:3] [SOURCE: .opencode/specs/sk-design/009-sk-design-claude-parity/external/codex/AGENTS.md:5]
- User instructions mentioned Task dispatch and also a no-subagent leaf constraint; the deep-research skill contract resolves this iteration as LEAF-only, so no subagent was dispatched.

## Sources Consulted
- `.opencode/specs/sk-design/009-sk-design-claude-parity/research/deep-research-state.jsonl`
- `.opencode/specs/sk-design/009-sk-design-claude-parity/research/deep-research-strategy.md`
- `.opencode/specs/sk-design/009-sk-design-claude-parity/research/iterations/iteration-005.md`
- `.opencode/specs/sk-design/009-sk-design-claude-parity/external/claude/system-prompt.md`
- `.opencode/specs/sk-design/009-sk-design-claude-parity/external/claude/skills/`
- `.opencode/specs/sk-design/009-sk-design-claude-parity/external/codex/system-prompt.md`
- `.opencode/specs/sk-design/009-sk-design-claude-parity/external/codex/AGENTS.md`
- `.opencode/skills/deep-loop-workflows/mode-registry.json`
- `.opencode/skills/sk-design/SKILL.md`
- `.opencode/skills/sk-design/mode-registry.json`
- `.opencode/skills/sk-design/hub-router.json`
- `.opencode/skills/sk-design/design-interface/SKILL.md`
- `.opencode/skills/sk-design/design-foundations/SKILL.md`
- `.opencode/skills/sk-design/design-motion/SKILL.md`
- `.opencode/skills/sk-design/design-audit/SKILL.md`
- `.opencode/skills/sk-design/design-md-generator/SKILL.md`

## Assessment
- New information ratio: 0.78
- Novelty justification: 2 of 5 findings are fully new architecture-selection conclusions, 3 are partial synthesis from prior mapping/backend work, and the public-mode/private-procedure model adds a simplicity bonus.
- Questions addressed: Q2, Q3, Q4, and Q5.
- Questions answered: Q4 now has a concrete architecture: public five-mode registry plus private procedure cards with cross-mode shared cards only where ownership is genuinely shared.

## Reflection
- What worked and why: Comparing external procedure taxonomy with current router/mode packet contracts separated public routing identity from private task procedure.
- What failed and why: A literal 14-skill clone failed because it would make deliverable forms compete with durable OpenCode mode axes.
- What I would do differently: Next pass should turn this architecture into a proposed procedure inventory and file placement table without editing skill files.

## Recommended Next Focus
Define the concrete procedure inventory and placement table: which cards are mode-local, which belong in `shared/procedures/`, which current references become cards, and which route triggers belong in `hub-router.json` versus mode-local routers.
