# Iteration 5: Deduplication and Prioritized Adoption Matrix

## Focus

Deduplicate competitor findings against packet 005 and turn the net-new ideas into per-skill ADOPT / ADAPT / SKIP recommendations.

## Findings

1. Packet 005 already covers the broad Claude Design parity loop: design-context snapshot, visible iteration ledger, handoff manifest, design-system inheritance, and fidelity verification. This packet's net-new value is more tactical: direction gates, element-target grammar, adherence scanners, editable plan/guideline artifacts, and generated/presentational boundaries. [SOURCE: file:.opencode/specs/skilled-agent-orchestration/143-sk-design-interface/005-claude-design-parity-research/research/research.md]
2. Pre-build direction gates are ADAPT for `sk-design-interface`: produce 2-3 brief-specific directions with anti-default critique and one recommended route. They are SKIP as generic presets. For `mcp-magicpath`, they are ADAPT only when the user asks for canvas authoring variations or the task is high-blast; otherwise keep one focused canvas run. [SOURCE: https://docs.lovable.dev/features/design-guidance.md] [SOURCE: https://docs.subframe.com/learn/ask-ai/prompt-to-design.md]
3. Element-target feedback grammar is ADOPT for `mcp-magicpath`: introduce a revision-intake shape that distinguishes selected element, annotation/screenshot evidence, targeted prompt, scope, and expected verification. It is ADAPT for `sk-design-interface` as a feedback taxonomy used during critique, not a tool protocol. [SOURCE: https://vercel.com/docs/v0/design-mode] [SOURCE: https://docs.lovable.dev/features/preview-toolbar.md] [SOURCE: https://help.figma.com/hc/en-us/articles/40775535020695-Make-in-your-local-codebase] [SOURCE: https://docs.subframe.com/learn/ask-ai/making-quick-edits.md]
4. Design-system adherence scanning is ADOPT for both skills. `sk-design-interface` should explicitly name design-system violation classes during critique: raw colors, token bypass, one-off values, component misuse, inline styles. `mcp-magicpath` should run a post-generation adherence check before claiming a component is adapted. [SOURCE: https://docs.lovable.dev/features/design-systems.md] [SOURCE: https://help.figma.com/hc/en-us/articles/39241689698839-Get-started-with-Make-kits]
5. Editable plan/guideline artifacts are ADAPT for complex MagicPath authoring and larger design tasks: before code/canvas work, produce a short plan or guidelines block only when the task is complex enough to justify the overhead. Keep it optional to avoid slowing small tasks. [SOURCE: https://help.figma.com/hc/en-us/articles/40830441709719-Use-plan-mode-in-Figma-Make] [SOURCE: https://help.figma.com/hc/en-us/articles/33665861260823-Add-guidelines-to-Figma-Make]
6. The presentational/generated boundary is ADOPT for `mcp-magicpath`: generated component source is the visual layer; app-specific logic belongs in wrappers/adapters; the handoff manifest must say which files are generated, which are safe to edit, and what logic remains. It is ADAPT for `sk-design-interface` as a "visual direction, not app logic" statement. [SOURCE: https://docs.subframe.com/concepts/design-to-code.md] [SOURCE: https://docs.subframe.com/concepts/syncing-components.md]
7. Browser testing limitations are ADOPT as a caveat in the fidelity loop: use screenshots and real-browser checks for behavior, responsive layout, and obvious visual divergence, but do not claim automated subtle color/detail parity. [SOURCE: https://docs.lovable.dev/features/browser-testing.md]
8. Platform features are SKIP: full-stack app hosting, backend setup, public publishing, billing/admin governance, live multiplayer canvas, Figma layer round-trip without a MagicPath equivalent, and Git branch/PR ownership inside MagicPath. [SOURCE: https://docs.lovable.dev/introduction/welcome.md] [SOURCE: https://help.figma.com/hc/en-us/articles/40775535020695-Make-in-your-local-codebase]

## Sources Consulted

- Packet 005 canonical synthesis. [SOURCE: file:.opencode/specs/skilled-agent-orchestration/143-sk-design-interface/005-claude-design-parity-research/research/research.md]
- Local skills. [SOURCE: file:.opencode/skills/sk-design-interface/SKILL.md] [SOURCE: file:.opencode/skills/mcp-magicpath/SKILL.md]
- All primary competitor docs cited in iterations 1-4.

## Assessment

- newInfoRatio: 0.31
- Novelty: mostly synthesis; still produced a net-new prioritized local adoption matrix.
- Confidence: high for top recommendations; medium for MagicPath implementation details until the host reviews actual MagicPath CLI constraints.

## Reflection

- What worked: framing the recommendations around existing skill boundaries avoided product cloning.
- What failed: cross-lineage reconciliation could not be completed inside this lineage because sibling iteration artifacts were not present.
- Ruled out: hosted/platform features, preset choosers, subtle visual-diff automation, and MagicPath-owned Git workflows.

## Recommended Next Focus

Packet-level merge: compare with `opus48-claude2`, preserve agreements, resolve divergences toward the lower-risk anti-default option.
