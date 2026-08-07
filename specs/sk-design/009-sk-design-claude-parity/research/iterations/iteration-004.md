# Iteration 4: Preserve Unique OpenCode Features

## Focus
This iteration used the override focus: identify existing `sk-design` features/assets worth preserving or elevating while cloning the Claude Design / Claude Code feel, then place each preservation candidate in a layer: core, backend, review/verifier, or compatibility. The selected interpretation was intentionally narrow: preservation and layer placement only, not implementation planning.

## Findings
1. **Core layer — preserve the single advisor-routable hub plus five packet modes.** `sk-design` already declares itself as one public advisor-routable design skill with five modes and no per-mode logic in the parent, while the mode table keeps interface, foundations, motion, audit, and md-generator as separate packet contracts. This should remain the core skeleton rather than being flattened into one Claude-like mega-prompt or split into many public identities. [SOURCE: .opencode/skills/sk-design/SKILL.md:15] [SOURCE: .opencode/skills/sk-design/SKILL.md:23] [SOURCE: .opencode/skills/sk-design/SKILL.md:29]
2. **Core layer — elevate the registry/hub-router contract, not hand-coded routing prose.** The hub says routing is registry-driven, with `workflowMode` and `backendKind` as discriminators, and the registry records the same contract plus per-mode `advisorRouting` blocks. This is the OpenCode-native equivalent of Claude Code's skill metadata/frontmatter discovery: preserve it as the core routing source of truth while cloning Claude's concise activation feel. [SOURCE: .opencode/skills/sk-design/SKILL.md:41] [SOURCE: .opencode/skills/sk-design/SKILL.md:43] [SOURCE: .opencode/skills/sk-design/mode-registry.json:4] [SOURCE: https://docs.anthropic.com/en/docs/claude-code/slash-commands]
3. **Backend layer — preserve `design-md-generator` as the unique mutating backend, not a reference-base mode.** The registry marks four modes as non-mutating `reference-base` packets but marks `md-generator` as `playwright-extract` with Write/Edit/Bash and workspace mutation; its packet describes a live-site, measured-CSS, extract/write/validate Playwright pipeline. That makes it a backend engine under the design family, not just a Claude-style instruction skill. [SOURCE: .opencode/skills/sk-design/mode-registry.json:32] [SOURCE: .opencode/skills/sk-design/mode-registry.json:110] [SOURCE: .opencode/skills/sk-design/mode-registry.json:114] [SOURCE: .opencode/skills/sk-design/design-md-generator/SKILL.md:12]
4. **Review/verifier layer — keep context/proof cards and playbooks as evidence gates.** The UI build bundle requires a context manifest, `context_loaded_card`, and `proof_of_application_card` before recommendations or ready claims, while the md-generator playbook defines deterministic scenarios, safe execution policy, and fidelity-proof/report checks. These belong in a verifier/review layer that proves Claude-like design judgment was actually applied instead of merely stated. [SOURCE: .opencode/skills/sk-design/SKILL.md:60] [SOURCE: .opencode/skills/sk-design/design-md-generator/manual_testing_playbook/manual_testing_playbook.md:15] [SOURCE: .opencode/skills/sk-design/design-md-generator/manual_testing_playbook/manual_testing_playbook.md:42] [SOURCE: .opencode/skills/sk-design/design-md-generator/manual_testing_playbook/manual_testing_playbook.md:341]
5. **Compatibility layer — preserve one advisor identity and transport boundaries while borrowing Claude's support-file ergonomics.** The hub layout keeps exactly one `graph-metadata.json`, prohibits mode-packet graph metadata, and treats Figma/Open Design as transports after design mode selection. Claude Code's public model similarly values skill folders with supporting files and subagent execution for context control, but those mechanics should be compatibility inspiration, not a reason to expose every sk-design packet as a separate advisor identity. [SOURCE: .opencode/skills/sk-design/SKILL.md:70] [SOURCE: .opencode/skills/sk-design/SKILL.md:80] [SOURCE: .opencode/skills/sk-design/SKILL.md:92] [SOURCE: .opencode/skills/sk-design/SKILL.md:99] [SOURCE: https://docs.anthropic.com/en/docs/claude-code/sub-agents]
6. **Shared reference base — preserve as core vocabulary, not workflow logic.** The parent states the shared base provides anti-slop principles, cognitive laws, and design-token vocabulary for consistency across the four doc-guidance modes, but it must not gain per-mode workflow logic. Layer placement: core shared vocabulary consumed by interface/foundations/motion/audit, with `md-generator` consuming its own backend. [SOURCE: .opencode/skills/sk-design/SKILL.md:83] [SOURCE: .opencode/skills/sk-design/SKILL.md:111] [SOURCE: .opencode/skills/sk-design/SKILL.md:122]

## Ruled Out
- **Flattening the five packets into the parent hub**: ruled out because the hub explicitly stays routing-only and packet logic remains in each mode. [SOURCE: .opencode/skills/sk-design/SKILL.md:91]
- **Turning `md-generator` into a non-mutating guidance packet**: ruled out because its registry surface is `playwright-extract` and mutates workspace outputs. [SOURCE: .opencode/skills/sk-design/mode-registry.json:112]
- **Letting design transports become taste authorities**: ruled out because the hub explicitly says Figma/Open Design are transports, not taste or critique authority. [SOURCE: .opencode/skills/sk-design/SKILL.md:99]

## Dead Ends
- A literal Claude Code subagent clone is not the right preservation route for this focus: Claude subagents are useful for context preservation and constraints, but this leaf research scope cannot introduce subagent mechanics and the OpenCode design skill already has one identity plus mode packets. [SOURCE: https://docs.anthropic.com/en/docs/claude-code/sub-agents]
- A 14-public-skill split remains a dead end for preservation because it would collide with the single `sk-design` advisor identity and packet-local logic rules. [SOURCE: .opencode/skills/sk-design/SKILL.md:92]

## Edge Cases
- Ambiguous input: none; the override narrowed the focus to preservation and layer placement.
- Contradictory evidence: none found.
- Missing dependencies: none; local evidence and external Claude Code docs were available.
- Partial success: none; research.md was not updated because the dispatch explicitly limited writes to the iteration markdown and one JSONL append.

## Sources Consulted
- `.opencode/specs/sk-design/009-sk-design-claude-parity/research/deep-research-config.json`
- `.opencode/specs/sk-design/009-sk-design-claude-parity/research/deep-research-state.jsonl`
- `.opencode/specs/sk-design/009-sk-design-claude-parity/research/deep-research-strategy.md`
- `.opencode/skills/sk-design/SKILL.md`
- `.opencode/skills/sk-design/mode-registry.json`
- `.opencode/skills/sk-design/design-md-generator/SKILL.md`
- `.opencode/skills/sk-design/design-md-generator/manual_testing_playbook/manual_testing_playbook.md`
- `https://docs.anthropic.com/en/docs/claude-code/slash-commands`
- `https://docs.anthropic.com/en/docs/claude-code/sub-agents`

## Assessment
- New information ratio: 0.77
- Questions addressed: Q3 - OpenCode feature preservation; Q4 - Parent hub contract; Q5 - Verification and benchmark proof
- Questions answered: Q3 preservation candidates now have layer placement across core, backend, review/verifier, and compatibility

## Reflection
- What worked and why: Reading the hub, registry, md-generator packet, playbook evidence, and Claude Code docs together exposed a clean layer model without needing implementation edits.
- What did not work and why: Broad file discovery produced more assets than could be deeply read under the 12-call budget, so the iteration prioritized high-signal root contracts and cited exact packet lines.
- What I would do differently: Next pass should inspect the shared context/proof cards and benchmark baseline directly, then convert this layer model into verifier scenarios.

## Recommended Next Focus
Inspect `shared/assets/context_loaded_card.md`, `shared/assets/proof_of_application_card.md`, benchmark baseline reports, and audit/interface playbooks directly to define the minimum proof suite for Claude Design feel without weakening OpenCode-specific evidence gates.
