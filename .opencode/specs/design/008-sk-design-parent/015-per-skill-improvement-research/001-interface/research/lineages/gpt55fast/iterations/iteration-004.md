# Iteration 4: Usefulness, UX, And Handoff Gaps

## Focus

Find improvements that make the interface skill more useful in real work, not just better connected in the router.

## Findings

1. Make the handoff manifest required when interface work proceeds to implementation. `real_ui_loop.md` currently defines an optional one-block handoff manifest with token system, files changed, interactions, quality checks, risks, and next `sk-code` steps [SOURCE: file:.opencode/skills/sk-design/design-interface/references/design-process/real_ui_loop.md:90] [SOURCE: file:.opencode/skills/sk-design/design-interface/references/design-process/real_ui_loop.md:93]. The skill also states implementation belongs to `sk-code` [SOURCE: file:.opencode/skills/sk-design/design-interface/SKILL.md:253]. Making the manifest required at the design-to-build boundary would raise usefulness and reduce repeated context loading.
2. Add a small redesign intake. The current skill says it handles reshaping/restyling and redesign triggers [SOURCE: file:.opencode/skills/sk-design/design-interface/SKILL.md:25] [SOURCE: file:.opencode/skills/sk-design/design-interface/SKILL.md:32], but it lacks an explicit preserve/overhaul decision tree. The external `taste-skill` calls misclassifying redesign mode the biggest source of bad redesign output and requires greenfield vs preserve vs overhaul detection [SOURCE: file:.opencode/specs/design/008-sk-design-parent/external/taste-skill.md:783] [SOURCE: file:.opencode/specs/design/008-sk-design-parent/external/taste-skill.md:785].
3. Redesign intake should include a short never-change-silently list. External corpus says do not silently change URL slugs, primary nav labels, form field names/order, brand logo, or legal/cookie copy [SOURCE: file:.opencode/specs/design/008-sk-design-parent/external/taste-skill.md:825]. That is directly useful for interface UX because it prevents beautiful redesigns from breaking SEO, analytics, autofill, and legal obligations.
4. Add a user-visible reference lookup status line for Mobbin/Refero. The current doc has a good initiative/ask/fallback gate [SOURCE: file:.opencode/skills/sk-design/design-interface/references/design-grounding/design_references_mcp.md:75] and source pick rules [SOURCE: file:.opencode/skills/sk-design/design-interface/references/design-grounding/design_references_mcp.md:84], but an operator-friendly output line would make the path legible: `Reference lookup: skipped/asked/pulled one; source: Mobbin/Refero; reason; copied: no`.
5. Visual asset strategy is present indirectly but not as an operator-efficient decision surface. The current content gate covers image seeds and fake screenshots [SOURCE: file:.opencode/skills/sk-design/design-interface/references/design-process/copy_and_mock_data.md:121], while the external corpus gives a stronger priority order: image generation first, real images second, labeled placeholders last [SOURCE: file:.opencode/specs/design/008-sk-design-parent/external/taste-skill.md:262] [SOURCE: file:.opencode/specs/design/008-sk-design-parent/external/taste-skill.md:266]. Fold this into `copy_and_mock_data.md` or a tiny card only if it does not overload routing.

## Sources Consulted

- `real_ui_loop.md`
- `design_references_mcp.md`
- `copy_and_mock_data.md`
- `taste-skill.md`
- `SKILL.md`

## Assessment

- newInfoRatio: 0.34
- Novelty justification: Added user-facing workflow improvements that were not solely benchmark-driven.
- Confidence: High for redesign gap and handoff opportunity; moderate for visual asset strategy priority because current content gate already covers part of it.

## Reflection

What worked: external corpus supplied practical process detail where the current packet is still abstract.

What failed or was ruled out: making paid Mobbin/Refero lookup mandatory. The docs explicitly make it optional and non-blocking.

## Recommended Next Focus

Review manual testing and verification gates so follow-up implementation can prove improvement.
