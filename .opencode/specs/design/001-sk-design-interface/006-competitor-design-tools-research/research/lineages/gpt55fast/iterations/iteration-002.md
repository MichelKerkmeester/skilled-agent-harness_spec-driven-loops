# Iteration 2: Lovable - Direction Gates, Preview Toolbar, Adherence, and Browser Testing

## Focus

Survey Lovable for visual-direction, feedback, design-system, and verification mechanisms that are distinct from v0 and packet 005.

## Findings

1. Lovable's Design guidance introduces a pre-build gate: for open-ended visual prompts it renders three lightweight HTML/Tailwind directions before the full build, then lets the user refine a direction up to six times before submitting. This is net-new versus packet 005: it is not a post-render fidelity loop, but a pre-commit exploration gate. [SOURCE: https://docs.lovable.dev/features/design-guidance.md]
2. The adoptable part for `sk-design-interface` is a direction-comparison protocol, not the curated chooser. The skill could produce 2-3 brief-specific directions with named rationale and an anti-default critique, while explicitly avoiding reusable style presets. [SOURCE: file:.opencode/skills/sk-design-interface/SKILL.md] [SOURCE: https://docs.lovable.dev/features/design-guidance.md]
3. Lovable's preview toolbar supports Select elements, Edit text inline, Draw annotation, and Add comment. Multi-select attaches selected elements to the chat; drawing attaches an annotated screenshot; comments stay pinned to page context. This reinforces and expands v0's element-target grammar. [SOURCE: https://docs.lovable.dev/features/preview-toolbar.md]
4. Lovable queues toolbar requests while earlier edits run. For `mcp-magicpath`, this suggests a safe batch boundary: collect several target edits, then run one `code submit` / verification cycle rather than interleaving hidden partial changes. [SOURCE: https://docs.lovable.dev/features/preview-toolbar.md]
5. Lovable design systems include a canonical schema, rendered rules, design-token docs, library guidelines, setup verification, version prompts, and adherence scans. The key local idea is the violation taxonomy: raw colors, one-off values, inline styles, and local component implementations that bypass a design system. [SOURCE: https://docs.lovable.dev/features/design-systems.md]
6. Lovable browser testing is useful for real-browser screenshots, clicks, forms, console/network checks, and viewport testing, but the docs explicitly say it is not reliable for subtle visual design details or color differences. This is important negative knowledge for packet 005's fidelity loop: screenshots support judgment, but should not become an automated subtle visual-diff claim. [SOURCE: https://docs.lovable.dev/features/browser-testing.md]
7. Lovable separates always-on knowledge from on-demand skills. The local system already has skills and memory; the sharper recommendation is to keep always-on brand/system facts in a context snapshot or knowledge-like artifact, while keeping task-specific design playbooks as skills. [SOURCE: https://docs.lovable.dev/features/knowledge.md] [SOURCE: https://docs.lovable.dev/features/skills.md]

## Sources Consulted

- Lovable Design guidance. [SOURCE: https://docs.lovable.dev/features/design-guidance.md]
- Lovable Preview toolbar. [SOURCE: https://docs.lovable.dev/features/preview-toolbar.md]
- Lovable Browser testing. [SOURCE: https://docs.lovable.dev/features/browser-testing.md]
- Lovable Design systems. [SOURCE: https://docs.lovable.dev/features/design-systems.md]
- Lovable Knowledge and Skills docs. [SOURCE: https://docs.lovable.dev/features/knowledge.md] [SOURCE: https://docs.lovable.dev/features/skills.md]

## Assessment

- newInfoRatio: 0.82
- Novelty: high. Direction gates and adherence scanners are distinct from the packet 005 loop.
- Confidence: high for Lovable feature claims; high for SKIP guardrails because they align with local skill rules.

## Reflection

- What worked: Lovable docs expose both capabilities and limitations clearly.
- What failed: a previous `visual-edits` page path is stale; use `preview-toolbar.md`.
- Ruled out: copying Lovable's curated palette/font/layout questions as a local preset chooser.

## Recommended Next Focus

Figma Make's plan mode, Make kits, guidelines, and local-codebase workflow.
