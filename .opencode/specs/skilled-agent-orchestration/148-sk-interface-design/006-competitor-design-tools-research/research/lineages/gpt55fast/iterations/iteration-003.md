# Iteration 3: Figma Make - Plan Artifacts, Make Kits, Guidelines, and Local Codebase Editing

## Focus

Survey Figma Make for prototype-to-code, planning, design-system context, and local-codebase patterns that are transferable without platform cloning.

## Findings

1. Figma Make is a prompt-to-app tool that can attach Figma designs, components, Community content, images, and web search context; users can point to specific preview parts and iterate through chat and edit tools. This overlaps with packet 005's context/fidelity loop but reinforces selected-preview feedback as a cross-product standard. [SOURCE: https://help.figma.com/hc/en-us/articles/31304412302231-Explore-Figma-Make]
2. Plan mode is a separate mode that analyzes the project and generates a structured plan plus `plan.md` before any code is written; users can edit the plan or ask for revisions before clicking Build. This is a strong adoptable pattern for complex `mcp-magicpath` authoring: a short, reviewable design plan before canvas/code generation when the task is high-risk. [SOURCE: https://help.figma.com/hc/en-us/articles/40830441709719-Use-plan-mode-in-Figma-Make]
3. Make kits can package npm code context, variables/styles from design libraries, and guidelines, then publish them for teams. For local skills, the adoptable pattern is "kit as context bundle": component/tokens/guidelines as one explicit input object, not a hosted Make kit. [SOURCE: https://help.figma.com/hc/en-us/articles/39241689698839-Get-started-with-Make-kits]
4. Figma Make design-system package docs emphasize using the exact production React design system and writing/generating guidelines so Make knows how components, tokens, variants, and rules should behave. This overlaps with Lovable design systems but adds detailed guideline-writing advice. [SOURCE: https://help.figma.com/hc/en-us/articles/35946832653975-Use-your-design-system-package-in-Make-kits]
5. The guidelines article says guidelines can include coding/personality rules, design-system rules, variant rules, and explicit "don't" constraints; it also advises that more context is not always better. This maps almost directly to a future `sk-interface-design` design-brief/context artifact. [SOURCE: https://help.figma.com/hc/en-us/articles/33665861260823-Add-guidelines-to-Figma-Make]
6. Figma Make's local-codebase beta lets users open a real local/GitHub repository, run the app with real data, annotate the UI, point-edit properties, save each prompt as a local commit, and open a PR from Figma. The adoptable local-skill part is not branch/PR ownership; it is treating each prompt-driven UI edit as a reversible unit with visible provenance. [SOURCE: https://help.figma.com/hc/en-us/articles/40775535020695-Make-in-your-local-codebase]
7. Figma Make can copy a preview snapshot as design layers back into Figma Design, supporting a design round trip. For `mcp-magicpath`, this is likely SKIP unless MagicPath exposes an equivalent layer export; the useful idea is a final visual artifact link/screenshot in the handoff manifest. [SOURCE: https://help.figma.com/hc/en-us/articles/31304412302231-Explore-Figma-Make]

## Sources Consulted

- Figma Make overview. [SOURCE: https://help.figma.com/hc/en-us/articles/31304412302231-Explore-Figma-Make]
- Figma Make plan mode. [SOURCE: https://help.figma.com/hc/en-us/articles/40830441709719-Use-plan-mode-in-Figma-Make]
- Figma Make kits. [SOURCE: https://help.figma.com/hc/en-us/articles/39241689698839-Get-started-with-Make-kits]
- Figma Make design-system package. [SOURCE: https://help.figma.com/hc/en-us/articles/35946832653975-Use-your-design-system-package-in-Make-kits]
- Figma Make guidelines. [SOURCE: https://help.figma.com/hc/en-us/articles/33665861260823-Add-guidelines-to-Figma-Make]
- Figma Make in local codebase. [SOURCE: https://help.figma.com/hc/en-us/articles/40775535020695-Make-in-your-local-codebase]

## Assessment

- newInfoRatio: 0.72
- Novelty: medium-high. Planning and guidelines artifacts are distinct; point-editing and local-code commits overlap with prior fidelity/ledger ideas.
- Confidence: high for Figma Make features; medium for adoption because some are beta/platform-only.

## Reflection

- What worked: the Make kit docs give concrete guideline structure and pitfalls.
- What failed: local-codebase branch/PR features are tempting but outside MagicPath's scope.
- Ruled out: implementing Git branch/PR management in `mcp-magicpath`; route that to sk-git.

## Recommended Next Focus

Subframe's deterministic code generation, sync boundaries, MCP access, and AI-ready design-system model.
