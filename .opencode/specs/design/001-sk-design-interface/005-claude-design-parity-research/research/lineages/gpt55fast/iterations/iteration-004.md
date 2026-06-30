# Iteration 4: ADOPT, ADAPT, SKIP Recommendations

## Focus

This iteration ranks improvements for each skill while preserving their boundaries: `sk-design-interface` owns visual judgment and design intent; `mcp-magicpath` owns canvas and CLI execution.

## Findings

1. ADOPT for `sk-design-interface`: add a design-context intake protocol that asks for or discovers brand assets, existing UI, target audience, device targets, and code/design-system references before visual choices. This mirrors Claude Design's context attachments without requiring a hosted upload system. [SOURCE: https://support.claude.com/en/articles/14604416-get-started-with-claude-design]
2. ADOPT for `sk-design-interface`: emit a design handoff manifest with subject, audience, job, token system, anti-default critique, quality-floor checks, open risks, and implementation notes for `sk-code` or `mcp-magicpath`. [SOURCE: file:.opencode/skills/sk-design-interface/SKILL.md:182]
3. ADAPT for `sk-design-interface`: make the iteration loop visible by persisting a short revision ledger when a task goes through screenshot critique or user visual feedback. Keep it lightweight; do not build a canvas product. [SOURCE: file:.opencode/skills/sk-design-interface/references/design_principles.md:71]
4. SKIP for `sk-design-interface`: do not auto-pick styles, palettes, or typefaces from the CSV catalog. Use the catalog only to name the expected default and justify deviation. [SOURCE: file:.opencode/skills/sk-design-interface/references/design_inventory.md:69]
5. ADOPT for `mcp-magicpath`: add a Claude Design-style preflight that resolves active project, workspace, theme/design system, source context, intended viewport, output target, and feedback mode before `code start` or repo import. [SOURCE: file:.opencode/skills/mcp-magicpath/references/magicpath_operations.md:48]
6. ADOPT for `mcp-magicpath`: formalize chat-vs-comment feedback handling. Broad changes become a new planning pass; targeted canvas feedback becomes scoped component edits with a revision record. [SOURCE: https://support.claude.com/en/articles/14604416-get-started-with-claude-design]
7. ADAPT for `mcp-magicpath`: produce a handoff manifest after `code submit`, including project URL, generatedName, changed editable files, theme tokens used, responsive assumptions, interaction map, known limitations, and `sk-code` next steps. [SOURCE: file:.opencode/skills/mcp-magicpath/references/cli_reference.md:322]
8. SKIP for `mcp-magicpath`: do not promise PDF/PPTX/Canva exports. Instead, point to MagicPath share/project links and code handoff unless the upstream CLI adds those outputs. [SOURCE: https://support.claude.com/en/articles/14604416-get-started-with-claude-design]

## Sources Consulted

- Claude Design user guide and design-system setup article.
- `sk-design-interface` skill and references.
- `mcp-magicpath` skill and references.

## Assessment

- newInfoRatio: 0.42
- Novelty justification: this pass moved from diagnosis to ranked action candidates and negative knowledge.
- Confidence: high that these recommendations fit current contracts; medium that they are the only necessary changes.

## Reflection

What worked: ADOPT/ADAPT/SKIP kept recommendations within the skill boundary.

What failed: ranking depends on follow-up implementation cost, which this research did not estimate from code changes.

Ruled out: hosted multi-format export replication.

## Recommended Next Focus

Build a final scorecard and host-merge notes.
