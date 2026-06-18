# Iteration 4: Subframe and Adjacent Tools - Deterministic Presentational UI and Sync Boundaries

## Focus

Survey Subframe and adjacent design-to-code tools for ideas about design-system source of truth, component/page handoff, generated-code boundaries, and AI access.

## Findings

1. Subframe's central claim is deterministic, production-ready React code: visual edits modify underlying code directly, with no LLM in the codegen path, and if something cannot translate to code it cannot be done in Subframe. This is a useful contrast to generative MagicPath canvas work: `mcp-magicpath` should make generated/presentational boundaries explicit because it cannot promise deterministic codegen. [SOURCE: https://docs.subframe.com/concepts/code-generation.md]
2. Subframe separates components and pages: components are design system assets synced by CLI, while pages are exported and later modified with app logic. This maps cleanly to `mcp-magicpath`: installed/generated component source should be treated as design-owned/presentational; app logic belongs in wrapper/adaptation code. [SOURCE: https://docs.subframe.com/concepts/design-to-code.md]
3. Subframe's sync is one-way from Subframe to codebase; local changes to synced files can be overwritten. The documented safe extension point is a wrapper `index.tsx`, optionally protected by `@subframe/sync-disable`. `mcp-magicpath` can adopt the wrapper-boundary principle without copying Subframe's exact marker. [SOURCE: https://docs.subframe.com/concepts/syncing-components.md]
4. Subframe Ask AI generates 1-4 variations for new designs, allows previews, supports "apply design", "save as new page", "ask follow-up", and even mix-and-match by dragging elements from generated variations. This corroborates Lovable's direction gate and adds a more granular "mix useful elements" concept. Local adoption should keep it text/wireframe-level unless MagicPath supports multiple canvas candidates cheaply. [SOURCE: https://docs.subframe.com/learn/ask-ai/prompt-to-design.md]
5. Subframe quick edits let users select an element and ask AI to edit or insert near it, with automatic layout/wrapping. This reinforces element-target grammar as a competitor-wide pattern rather than a one-off. [SOURCE: https://docs.subframe.com/learn/ask-ai/making-quick-edits.md]
6. Subframe exports Tailwind v3/v4 theme configurations and syncs theme/components to code. This supports a recommendation for `sk-interface-design` to emit token/handoff blocks in a machine-consumable form, but not to own the implementation. [SOURCE: https://docs.subframe.com/learn/theme/exporting-theme.md]
7. Subframe MCP exposes project metadata, pages, components, snippets, flows, design documents, and theme editing to AI coding assistants. `mcp-magicpath` is explicitly CLI-only in this repo, so the adoptable part is a design-document/handoff manifest, not adding a new MCP server. [SOURCE: https://docs.subframe.com/guides/mcp-server.md] [SOURCE: file:.opencode/skills/mcp-magicpath/SKILL.md]
8. Adjacent tools support the same broad pattern: Anima starts from prompts, URLs, or Figma and produces editable code; Builder has Figma import, visual editor, comments, branches/PRs, quality review, and design-system intelligence surfaces. They corroborate the trend but did not add stronger local recommendations than the four primary tools. [SOURCE: https://docs.animaapp.com/docs/getting-started] [SOURCE: https://www.builder.io/c/docs/import-from-figma]

## Sources Consulted

- Subframe overview and docs index. [SOURCE: https://docs.subframe.com/overview.md]
- Subframe code generation. [SOURCE: https://docs.subframe.com/concepts/code-generation.md]
- Subframe design-to-code workflow. [SOURCE: https://docs.subframe.com/concepts/design-to-code.md]
- Subframe syncing components. [SOURCE: https://docs.subframe.com/concepts/syncing-components.md]
- Subframe generating designs and quick edits. [SOURCE: https://docs.subframe.com/learn/ask-ai/prompt-to-design.md] [SOURCE: https://docs.subframe.com/learn/ask-ai/making-quick-edits.md]
- Subframe theme export and MCP server. [SOURCE: https://docs.subframe.com/learn/theme/exporting-theme.md] [SOURCE: https://docs.subframe.com/guides/mcp-server.md]
- Anima and Builder adjacent docs. [SOURCE: https://docs.animaapp.com/docs/getting-started] [SOURCE: https://www.builder.io/c/docs/import-from-figma]

## Assessment

- newInfoRatio: 0.58
- Novelty: moderate. The presentational/generated boundary and wrapper rule are the strongest new ideas.
- Confidence: high for Subframe; lower for Builder/Anima because only broad docs were used.

## Reflection

- What worked: Subframe docs are unusually explicit about design/code ownership boundaries.
- What failed: adjacent products were useful for corroboration but too broad for priority recommendations.
- Ruled out: making generated MagicPath component files the durable two-way source of truth.

## Recommended Next Focus

Synthesize, dedupe against packet 005, classify ADOPT / ADAPT / SKIP per local skill, and record negative knowledge.
