---
title: "Lineage Research: Competitor AI design-tool ideas for sk-design-interface and mcp-magicpath (gpt55fast)"
description: "gpt55fast fan-out lineage synthesis for packet 006: competitor AI UI/design tool ideas from v0, Lovable, Figma Make, Subframe, and adjacent tools. Research-only; no skill implementation changes."
trigger_phrases:
  - "gpt55fast competitor design tool research"
  - "v0 lovable figma make subframe lineage"
  - "sk-design-interface mcp-magicpath competitor ideas"
importance_tier: "important"
contextType: "implementation"
---

# Lineage Research: Competitor AI Design-Tool Ideas (gpt55fast)

This is the `gpt55fast` lineage synthesis for packet 006. It ran five iterations to the configured cap and wrote only inside the lineage artifact directory.

## 1. Executive Summary

The net-new competitor lesson is not "build a hosted design product." The useful patterns are smaller and more transferable:

1. **Pre-build direction gate**: show 2-3 brief-specific directions before building when the visual axis is open.
2. **Element-target feedback grammar**: selected element / annotation / screenshot / prompt / apply boundary is now a standard interaction pattern across v0, Lovable, Figma Make, and Subframe.
3. **Design-system adherence scanner**: raw colors, one-off values, inline styles, and custom component bypasses should become explicit violation classes.
4. **Editable plan/guidelines artifact**: complex design work benefits from a short reviewable plan or guidelines file before code/canvas generation.
5. **Presentational/generated boundary**: generated visual layer and app/business logic must have a clear wrapper/adaptation seam.

Packet 005 already covered the broad Claude Design parity loop. This lineage sharpens the tactical controls around that loop.

## 2. Method and Provenance

| Item | Value |
| --- | --- |
| Lineage | `gpt55fast` |
| Executor | `cli-opencode` / `openai/gpt-5.5-fast` |
| Iterations | 5/5, stopped at maxIterations |
| Primary competitor docs | v0, Lovable, Figma Make, Subframe |
| Adjacent docs | Anima, Builder, Framer surface checks |
| Local evidence | `sk-design-interface` SKILL.md, `mcp-magicpath` SKILL.md, packet 005 synthesis |
| Write boundary | Artifact directory only; parent spec write-back skipped/deferred |

## 3. Competitor Capability Matrix

| Tool | Distinctive design-relevant capability | Local transfer |
| --- | --- | --- |
| v0 | Design Mode edits live preview elements with visual controls, natural-language selected-element prompts, pending before/after state, and diffable applied versions. [SOURCE: https://vercel.com/docs/v0/design-mode] | ADOPT element-target feedback grammar for `mcp-magicpath`; ADAPT selected-render critique for `sk-design-interface`. |
| v0 | Figma link import extracts layout plus design tokens; docs recommend component-first decomposition. [SOURCE: https://vercel.com/docs/v0/figma] | ADAPT into design-context decomposition guidance. |
| v0 | Registries pass components, blocks, and tokens as AI-native design-system context. [SOURCE: https://vercel.com/docs/v0/design-systems] | ADAPT as compact local context/handoff packet, not hosted registry. |
| Lovable | Three rendered design directions appear before full build for open-ended visual prompts; refinements are capped before submitting. [SOURCE: https://docs.lovable.dev/features/design-guidance.md] | ADAPT as anti-default direction gate for `sk-design-interface`; avoid presets. |
| Lovable | Preview toolbar supports select, inline text edit, draw annotation, comments, and queued changes. [SOURCE: https://docs.lovable.dev/features/preview-toolbar.md] | ADOPT as MagicPath revision-intake grammar. |
| Lovable | Design-system attach includes schema/docs and adherence scans for raw colors, one-off values, inline overrides, and local component bypass. [SOURCE: https://docs.lovable.dev/features/design-systems.md] | ADOPT violation taxonomy for both skills. |
| Lovable | Browser testing captures screenshots and behavior but is not reliable for subtle design/color differences. [SOURCE: https://docs.lovable.dev/features/browser-testing.md] | ADOPT limitation statement in fidelity verification. |
| Figma Make | Plan mode writes editable `plan.md` before build. [SOURCE: https://help.figma.com/hc/en-us/articles/40830441709719-Use-plan-mode-in-Figma-Make] | ADAPT as optional plan artifact for complex design/canvas tasks. |
| Figma Make | Make kits package npm packages, library styles, and guidelines. [SOURCE: https://help.figma.com/hc/en-us/articles/39241689698839-Get-started-with-Make-kits] | ADAPT as local design-context kit/guidelines input. |
| Figma Make | Local-codebase beta uses real app preview, annotations, point edits, local commits, and PRs. [SOURCE: https://help.figma.com/hc/en-us/articles/40775535020695-Make-in-your-local-codebase] | ADAPT reversible edit provenance; SKIP Git/PR ownership in MagicPath. |
| Subframe | Deterministic presentational React code; no LLM in codegen path. [SOURCE: https://docs.subframe.com/concepts/code-generation.md] | ADOPT explicit generated/presentational boundary; do not overclaim determinism. |
| Subframe | Components sync one-way; wrapper `index.tsx` owns business logic. [SOURCE: https://docs.subframe.com/concepts/syncing-components.md] | ADOPT wrapper/adaptation boundary for MagicPath installed components. |
| Subframe | MCP exposes pages, components, theme, and design documents to AI coding assistants. [SOURCE: https://docs.subframe.com/guides/mcp-server.md] | ADAPT as handoff/design-document manifest; do not add a new MCP server. |

## 4. Dedup Against Packet 005

Packet 005 already recommended a shared protocol: design-context snapshot, iteration ledger, handoff manifest, MagicPath fidelity verification, and design-system inheritance. [SOURCE: file:.opencode/specs/design/001-sk-design-interface/005-claude-design-parity-research/research/research.md]

This lineage does not duplicate those as top-line novelty. It adds sharper mechanisms:

| New or sharper idea | Relationship to packet 005 |
| --- | --- |
| Pre-build direction gate | Net-new before-build complement to post-build fidelity loop. |
| Element-target feedback grammar | Sharper operational shape for iteration ledger rows. |
| Design-system adherence scanner | Sharper validation taxonomy for design-system inheritance. |
| Editable plan/guidelines artifact | Sharper setup artifact before complex generation. |
| Presentational/generated wrapper boundary | Sharper handoff rule for generated component code. |
| Browser-testing limitation caveat | Corrects overconfidence risk in fidelity verification. |

## 5. Design Principles for Local Adoption

- Preserve `sk-design-interface` as a judgment skill, not a generator or preset picker. [SOURCE: file:.opencode/skills/sk-design-interface/SKILL.md]
- Preserve `mcp-magicpath` as a CLI/canvas operator, not a hosted product or git workflow owner. [SOURCE: file:.opencode/skills/mcp-magicpath/SKILL.md]
- Prefer small protocol additions over new infrastructure.
- Treat SKIP as success when a competitor feature would dilute local boundaries.

## 6. Net-New Ideas

| Idea | Evidence | Why it matters |
| --- | --- | --- |
| Direction gate | Lovable three previews; Subframe 1-4 variations. [SOURCE: https://docs.lovable.dev/features/design-guidance.md] [SOURCE: https://docs.subframe.com/learn/ask-ai/prompt-to-design.md] | Reduces first-build misses and forces deliberate visual direction before code/canvas output. |
| Element-target grammar | v0 selected elements; Lovable toolbar; Figma Make annotations; Subframe quick edits. [SOURCE: https://vercel.com/docs/v0/design-mode] [SOURCE: https://docs.lovable.dev/features/preview-toolbar.md] [SOURCE: https://help.figma.com/hc/en-us/articles/40775535020695-Make-in-your-local-codebase] [SOURCE: https://docs.subframe.com/learn/ask-ai/making-quick-edits.md] | Makes feedback precise and auditable. |
| Adherence scanner | Lovable design systems; Figma Make kit guidelines. [SOURCE: https://docs.lovable.dev/features/design-systems.md] [SOURCE: https://help.figma.com/hc/en-us/articles/39241689698839-Get-started-with-Make-kits] | Turns vague "use the design system" into explicit violation checks. |
| Editable plan/guidelines artifact | Figma Make plan mode and guidelines. [SOURCE: https://help.figma.com/hc/en-us/articles/40830441709719-Use-plan-mode-in-Figma-Make] [SOURCE: https://help.figma.com/hc/en-us/articles/33665861260823-Add-guidelines-to-Figma-Make] | Supports complex work without changing runtime architecture. |
| Generated/presentational boundary | Subframe components/pages and sync docs. [SOURCE: https://docs.subframe.com/concepts/design-to-code.md] [SOURCE: https://docs.subframe.com/concepts/syncing-components.md] | Prevents generated component drift and clarifies what app code may safely edit. |

## 7. Ranked Net-New Ideas

| Rank | Idea | `sk-design-interface` verdict | `mcp-magicpath` verdict | Rationale |
| --- | --- | --- | --- | --- |
| P1 | Element-target feedback grammar | ADAPT | ADOPT | `sk` uses it as critique language; `mp` can operationalize selected element, annotation, screenshot, prompt, and verification fields. |
| P1 | Design-system adherence scanner | ADOPT | ADOPT | Both skills need explicit violation classes when a system exists. |
| P1 | Presentational/generated boundary | ADAPT | ADOPT | `sk` states visual direction only; `mp` needs generated vs wrapper/adaptation file rules. |
| P2 | Pre-build direction gate | ADOPT with guardrails | ADAPT | Strong for open visual tasks; keep it brief-specific, never a preset menu. |
| P2 | Editable plan/guidelines artifact | ADAPT | ADAPT | Useful for complex/high-blast tasks; too heavy for simple component work. |
| P2 | Browser-testing limitation caveat | ADOPT | ADOPT | Prevents false completion claims from screenshots alone. |
| P3 | AI-native design-document manifest | ADAPT | ADAPT | Subframe MCP design docs suggest richer handoff docs; use manifest, not new server. |
| P3 | Figma/preview layer round trip | SKIP | SKIP unless MagicPath exposes equivalent | Useful product feature but not currently available in local CLI scope. |

## 8. Recommendations for sk-design-interface

| Priority | Verdict | Recommendation | Guardrail |
| --- | --- | --- | --- |
| P1 | ADOPT | Add a design-system adherence checklist when a system is present: semantic tokens first, no raw colors, no arbitrary spacing, no local component bypass, no inline override without reason. | Do not become a linter; this is design judgment plus evidence. |
| P1 | ADAPT | Add element-target feedback vocabulary for rendered self-critique: selected region, observed issue, intended design principle, proposed one-change revision. | Do not require a render for every design task. |
| P2 | ADOPT | Add a brief-specific direction gate for open-ended visual work: 2-3 direction sketches, critique against AI defaults, recommend one. | No reusable style presets; no curated palette menu. |
| P2 | ADAPT | Emit optional guideline snippets for complex handoffs: token quirks, do-not rules, typography/spacing priorities. | Keep concise; more context is not always better. |
| P3 | ADAPT | State when output is visual direction only and what app logic remains out of scope. | Implementation remains `sk-code` / `mcp-magicpath`. |

## 9. Recommendations for mcp-magicpath

| Priority | Verdict | Recommendation | Guardrail |
| --- | --- | --- | --- |
| P1 | ADOPT | Add a MagicPath revision-intake grammar: target element/component, visual evidence, requested change, scope, expected verification, and whether feedback is broad or targeted. | Do not infer ambiguous targets; ask or inspect. |
| P1 | ADOPT | Add generated-vs-adapted source boundary to install/author flows: generated component source, wrapper/adaptation files, safe edit points, and remaining business logic. | Never copy generated markup instead of importing installed components. |
| P1 | ADOPT | Add design-system adherence scan after generated output when project/theme context exists: raw color, arbitrary spacing, inline style, unapproved component, token misuse. | Keep mechanical; design choices still route to `sk-design-interface`. |
| P2 | ADAPT | For complex canvas authoring, create a short plan/guidelines block before `code start`/`code submit`. | Skip for simple exact component operations. |
| P2 | ADAPT | Batch queued visual edits into one submit/verify cycle when safe. | Do not hide partial changes from the user. |
| P3 | SKIP | Do not own Git branch/PR flows, local repo setup scripts, public publishing, or backend setup. | Route Git to `sk-git`; route app code to `sk-code`. |

## 10. Eliminated Alternatives

| Approach | Reason Eliminated | Evidence | Iteration(s) |
| --- | --- | --- | --- |
| Hosted full-stack app/deployment agent | v0/Lovable platform scope exceeds these two skills. | [SOURCE: https://vercel.com/docs/v0] [SOURCE: https://docs.lovable.dev/introduction/welcome.md] | 1, 5 |
| Preset palette/font/layout chooser | Conflicts with `sk-design-interface` anti-default mandate. | [SOURCE: https://docs.lovable.dev/features/design-guidance.md] [SOURCE: file:.opencode/skills/sk-design-interface/SKILL.md] | 2, 5 |
| MagicPath-owned Git branch/PR workflow | Belongs to `sk-git` or external workflow, not MagicPath CLI. | [SOURCE: https://help.figma.com/hc/en-us/articles/40775535020695-Make-in-your-local-codebase] | 3, 5 |
| Subtle visual diff automation as sole quality gate | Browser testing docs say it is unreliable for subtle visual design details/color differences. | [SOURCE: https://docs.lovable.dev/features/browser-testing.md] | 2, 5 |
| Two-way generated component source ownership | Subframe uses one-way sync and wrapper boundaries; local generated files should not become ambiguous source-of-truth. | [SOURCE: https://docs.subframe.com/concepts/syncing-components.md] | 4, 5 |
| Live multiplayer canvas, public publishing, billing/admin governance | Hosted product capabilities, not lean CLI-skill responsibilities. | [SOURCE: https://help.figma.com/hc/en-us/articles/31304412302231-Explore-Figma-Make] | 3, 5 |

## 11. Recommendations

1. **Implement first as protocol text, not code**: add a shared reference describing element-target feedback, adherence checks, and generated/presentational boundaries.
2. **Update `sk-design-interface` next**: direction gate and adherence checklist are small additions aligned with the existing two-pass process.
3. **Update `mcp-magicpath` after that**: revision-intake grammar, wrapper boundary, post-submit adherence scan, and optional complex-task plan block.
4. **Keep packet 005 as the broad loop**: this packet should refine operational mechanics, not replace the context/iteration/handoff protocol.

## 12. Open Questions

- How much of MagicPath's current `code submit --wait` output can be inspected automatically for raw colors, arbitrary values, and generated/adapted boundary violations?
- Does MagicPath expose enough preview/selection metadata to support a true selected-element feedback grammar, or should the first version be text/screenshot based?
- When the sibling opus lineage completes, does it agree that the direction gate and adherence scanner are the main net-new ideas?

## 13. Cross-Lineage Notes

At the time this lineage synthesized, `opus48-claude2` had only config/strategy visible and no completed iteration artifacts. Cross-lineage reconciliation is therefore deferred to the host merge step. This lineage is ready to merge and highlights expected comparison points:

- Does the sibling also prioritize element-target feedback?
- Does it treat the direction gate as ADOPT or too preset-like?
- Does it agree on the generated/presentational boundary for MagicPath?
- Does it identify any competitor feature stronger than the adherence scanner?

## 14. Source Notes and Limitations

- Primary docs were used where possible.
- Some adjacent-product docs were broad or marketing-heavy and are not load-bearing for top recommendations.
- Browser/WebFetch pages do not provide stable line numbers; citations use URLs.
- Local file evidence uses exact file paths from reads.

## 15. References

- v0 overview, Design Mode, Design Systems, Figma integration: [SOURCE: https://vercel.com/docs/v0] [SOURCE: https://vercel.com/docs/v0/design-mode] [SOURCE: https://vercel.com/docs/v0/design-systems] [SOURCE: https://vercel.com/docs/v0/figma]
- Lovable design guidance, preview toolbar, browser testing, design systems, knowledge, skills: [SOURCE: https://docs.lovable.dev/features/design-guidance.md] [SOURCE: https://docs.lovable.dev/features/preview-toolbar.md] [SOURCE: https://docs.lovable.dev/features/browser-testing.md] [SOURCE: https://docs.lovable.dev/features/design-systems.md] [SOURCE: https://docs.lovable.dev/features/knowledge.md] [SOURCE: https://docs.lovable.dev/features/skills.md]
- Figma Make overview, plan mode, Make kits, design-system package, guidelines, local codebase: [SOURCE: https://help.figma.com/hc/en-us/articles/31304412302231-Explore-Figma-Make] [SOURCE: https://help.figma.com/hc/en-us/articles/40830441709719-Use-plan-mode-in-Figma-Make] [SOURCE: https://help.figma.com/hc/en-us/articles/39241689698839-Get-started-with-Make-kits] [SOURCE: https://help.figma.com/hc/en-us/articles/35946832653975-Use-your-design-system-package-in-Make-kits] [SOURCE: https://help.figma.com/hc/en-us/articles/33665861260823-Add-guidelines-to-Figma-Make] [SOURCE: https://help.figma.com/hc/en-us/articles/40775535020695-Make-in-your-local-codebase]
- Subframe overview, code generation, design-to-code, syncing components, Ask AI, quick edits, theme export, MCP server: [SOURCE: https://docs.subframe.com/overview.md] [SOURCE: https://docs.subframe.com/concepts/code-generation.md] [SOURCE: https://docs.subframe.com/concepts/design-to-code.md] [SOURCE: https://docs.subframe.com/concepts/syncing-components.md] [SOURCE: https://docs.subframe.com/learn/ask-ai/prompt-to-design.md] [SOURCE: https://docs.subframe.com/learn/ask-ai/making-quick-edits.md] [SOURCE: https://docs.subframe.com/learn/theme/exporting-theme.md] [SOURCE: https://docs.subframe.com/guides/mcp-server.md]
- Adjacent sources: [SOURCE: https://docs.animaapp.com/docs/getting-started] [SOURCE: https://www.builder.io/c/docs/import-from-figma] [SOURCE: https://www.framer.com/]
- Local sources: [SOURCE: file:.opencode/skills/sk-design-interface/SKILL.md] [SOURCE: file:.opencode/skills/mcp-magicpath/SKILL.md] [SOURCE: file:.opencode/specs/design/001-sk-design-interface/005-claude-design-parity-research/research/research.md]

## 16. Convergence Report

- Stop reason: maxIterationsReached.
- Total iterations: 5.
- Questions answered: 5 / 5.
- Remaining questions: 0 for this lineage; cross-lineage merge remains.
- Average newInfoRatio trend: [1.00, 0.82, 0.72, 0.58, 0.31].
- Quality gates: pass for source diversity, negative knowledge, local-scope guardrails, and per-skill verdicts.
- Graph gates: not applicable; no graph events emitted.

## 17. Final Lineage Output

This lineage recommends a focused follow-up implementation packet that updates both skills with protocol-level guidance first. The safest P1 bundle is:

- Element-target feedback grammar.
- Design-system adherence violation taxonomy.
- Generated/presentational wrapper boundary for MagicPath.
- Direction gate for `sk-design-interface`, guarded against presets.
