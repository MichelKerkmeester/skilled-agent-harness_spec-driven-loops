# Iteration 1: v0 by Vercel - Live Visual Editing, Registries, and Figma Import

## Focus

Survey v0's distinctive design-relevant capabilities and compare them to packet 005's Claude Design baseline.

## Findings

1. v0 treats the running app preview as an editable design surface: Design Mode overlays tools on the live Preview tab, lets the user select elements, tweak typography/color/layout/border/shadow/content, and see pending edits live before applying them. This sharpens packet 005's generic fidelity loop into a concrete "pending visual edit" state. [SOURCE: https://vercel.com/docs/v0/design-mode]
2. Design Mode combines precision controls with selected-element natural-language instructions; v0 attaches a screenshot of the selected element to the prompt for complex changes. This is directly adoptable as a `mcp-magicpath` feedback-intake shape: selected element, screenshot/preview evidence, requested change, and apply/revert boundary. [SOURCE: https://vercel.com/docs/v0/design-mode]
3. v0 commits applied visual edits as normal chat versions, making them diffable, reviewable, and revertable. This suggests `mcp-magicpath` should treat each post-submit visual revision as a ledger row with a generated artifact diff, not a private edit. [SOURCE: https://vercel.com/docs/v0/design-mode]
4. v0's Figma integration extracts visual layout plus design tokens such as color palettes and spacing, and recommends breaking complex Figma designs into smaller frames, generating components first, testing/refining in isolation, then composing. This complements packet 005's context snapshot with a practical decomposition rule. [SOURCE: https://vercel.com/docs/v0/figma]
5. v0's design-system docs position registries as a distribution spec for components, blocks, and tokens, with `Open in v0` metadata and MCP access for AI code editors. For local skills, the adoptable part is not hosting a registry; it is emitting a compact component/token context packet that AI can consume. [SOURCE: https://vercel.com/docs/v0/design-systems]
6. v0's broad product scope includes backend, deployment, diagnostics, APIs, databases, and app shipping. Those are useful as contrast but mostly SKIP for this packet: they belong to app-building platforms, not `sk-design-interface` or `mcp-magicpath`. [SOURCE: https://vercel.com/docs/v0]

## Sources Consulted

- v0 overview. [SOURCE: https://vercel.com/docs/v0]
- v0 Design Mode. [SOURCE: https://vercel.com/docs/v0/design-mode]
- v0 Design Systems. [SOURCE: https://vercel.com/docs/v0/design-systems]
- v0 Figma integration. [SOURCE: https://vercel.com/docs/v0/figma]
- Local `sk-design-interface` and `mcp-magicpath` SKILL.md files. [SOURCE: file:.opencode/skills/sk-design-interface/SKILL.md] [SOURCE: file:.opencode/skills/mcp-magicpath/SKILL.md]

## Assessment

- newInfoRatio: 1.00
- Novelty: first pass; v0 added live pending visual edits, selected-element prompts, versioned apply/revert, and registry context.
- Confidence: high for cited v0 features; medium for local adoption mechanics until merged with other competitors.

## Reflection

- What worked: primary docs were concise and current.
- What failed: v0's full-stack scope is too broad for direct adoption.
- Ruled out: clone v0 deployment/backend/error-fixing agent behavior for these two skills.

## Recommended Next Focus

Lovable's pre-build design guidance and preview toolbar, especially whether it adds patterns beyond v0 and packet 005.
