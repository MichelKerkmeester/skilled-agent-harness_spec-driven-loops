# Iteration 3: mcp-magicpath Current-State Gap

## Focus

This iteration maps Claude Design parity dimensions onto `mcp-magicpath`. Unlike `sk-design-interface`, MagicPath already has a canvas-oriented execution surface, so the key question is how to make the skill feel more like a conversational design workflow without exceeding CLI boundaries.

## Findings

1. `mcp-magicpath` can discover, inspect, install, author, edit, and import UI components through the `magicpath-ai` CLI. It therefore already owns a real design-to-code and canvas execution channel. [SOURCE: file:.opencode/skills/mcp-magicpath/SKILL.md:15]
2. MagicPath themes are the closest local analog to Claude Design's organization design system. The skill can list and fetch themes, then apply CSS variables, fonts, and natural-language styling prompts during adaptation. [SOURCE: file:.opencode/skills/mcp-magicpath/references/magicpath_operations.md:124]
3. Canvas authoring through `code start` and `code submit` already provides a stateful local-code-to-canvas flow, but the skill contract is operational and does not define a chat/comment/revision loop. [SOURCE: file:.opencode/skills/mcp-magicpath/references/magicpath_operations.md:289]
4. Design Defaults enforce important canvas quality: responsive, centered, single screen, no device mockups, and fully interactive components. These are strong Claude Design parity anchors for prototype quality. [SOURCE: file:.opencode/skills/mcp-magicpath/references/magicpath_operations.md:295]
5. The repository import reference is a strong context-grounding surface: read global CSS, tokens, fonts, theming, primitives, and dependencies before recreating UI on the canvas. This maps well to Claude Design's codebase attachment behavior. [SOURCE: file:.opencode/skills/mcp-magicpath/references/working_with_repositories.md:74]
6. The embedded-browser guidance already models a persistent project canvas beside the agent. That is close to Claude Design's chat-plus-canvas model, but it needs an explicit feedback protocol and a revision ledger. [SOURCE: file:.opencode/skills/mcp-magicpath/references/working_with_embedded_browsers.md:20]
7. The current skill does not produce multi-format exports. Its realistic handoff path is component source, project/canvas share URLs, and a generated handoff manifest for `sk-code` or human implementers. [SOURCE: file:.opencode/skills/mcp-magicpath/references/cli_reference.md:226]

## Sources Consulted

- `.opencode/skills/mcp-magicpath/SKILL.md`
- `.opencode/skills/mcp-magicpath/references/magicpath_operations.md`
- `.opencode/skills/mcp-magicpath/references/cli_reference.md`
- `.opencode/skills/mcp-magicpath/references/working_with_repositories.md`
- `.opencode/skills/mcp-magicpath/references/working_with_embedded_browsers.md`

## Assessment

- newInfoRatio: 0.63
- Novelty justification: this pass identified MagicPath primitives that can support parity without inventing a new product.
- Confidence: high for CLI capabilities and boundaries, medium for how much revision state should be added to the skill.

## Reflection

What worked: the MagicPath references are explicit about the source/destination mental models.

What failed: no live `magicpath-ai` session was exercised because this packet is research-only and should not modify external canvas state.

Ruled out: using `add` or `inspect` as the repository-to-canvas import path.

## Recommended Next Focus

Convert the gaps into ADOPT, ADAPT, and SKIP recommendations per skill.
