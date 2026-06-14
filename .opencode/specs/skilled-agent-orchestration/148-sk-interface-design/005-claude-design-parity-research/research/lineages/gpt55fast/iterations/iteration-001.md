# Iteration 1: Claude Design Capability Baseline

## Focus

This iteration establishes what Claude Design parity means for two local CLI skills. The target is not only visual generation; Claude Design combines an organization design system, conversational creation, a canvas, inline comments, context attachments, revision management, export, and Claude Code handoff.

## Findings

1. Claude Design has a chat-plus-canvas working model: describe a design in chat, review it on the canvas, then iterate through chat and inline comments. This makes the user experience a live design conversation rather than a one-shot prompt. [SOURCE: https://support.claude.com/en/articles/14604416-get-started-with-claude-design]
2. New projects inherit the organization's design system automatically, so brand colors, typography, and component patterns are present before the user writes a prompt. [SOURCE: https://support.claude.com/en/articles/14604416-get-started-with-claude-design]
3. Claude Design accepts context attachments including screenshots, assets, slide decks, documents, code repositories, and existing design files. This makes context grounding a product behavior rather than a best-effort prompt habit. [SOURCE: https://support.claude.com/en/articles/14604416-get-started-with-claude-design]
4. Inline comments are intentionally scoped for targeted component-level changes, while chat is for structural or broad design changes. That distinction is a useful parity target for local skills: route feedback by granularity. [SOURCE: https://support.claude.com/en/articles/14604416-get-started-with-claude-design]
5. Export and handoff are broad: zip, PDF, PPTX, Canva, standalone HTML, local Claude Code, and Claude Code Web are all listed. CLI skills should not clone all formats, but they should produce explicit handoff artifacts. [SOURCE: https://support.claude.com/en/articles/14604416-get-started-with-claude-design]
6. Design-system setup extracts reusable components, colors, typography, and layout patterns from codebases, slide decks, documents, brand assets, screenshots, and other design references. [SOURCE: https://support.claude.com/en/articles/14604397-set-up-your-design-system-in-claude-design]

## Sources Consulted

- `https://support.claude.com/en/articles/14604416-get-started-with-claude-design`
- `https://support.claude.com/en/articles/14604397-set-up-your-design-system-in-claude-design`
- `https://support.claude.com/en/articles/14604406-claude-design-admin-guide-for-team-and-enterprise-plans`
- `.opencode/specs/skilled-agent-orchestration/148-sk-interface-design/005-claude-design-parity-research/spec.md`

## Assessment

- newInfoRatio: 1.00
- Novelty justification: first pass established the external target and all parity dimensions.
- Confidence: high for public product capabilities cited from Anthropic support; medium for translating them into local skill improvements.

## Reflection

What worked: using the public help docs prevented vague parity language.

What failed: the docs do not expose Claude Design internals, so recommendations must target observable experience and local skill contracts.

Ruled out: treating Claude Design as only a UI generator.

## Recommended Next Focus

Map the dimensions onto `sk-interface-design`: design-system inheritance, context grounding, feedback loop, quality levers, and handoff.
