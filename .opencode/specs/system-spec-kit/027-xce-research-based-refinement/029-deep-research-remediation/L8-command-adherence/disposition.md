---
title: "L8 Command-Dashboard Adherence — Disposition"
description: "What the doc-only adherence fixes changed, the empirical result of re-testing render-contract adherence on a mid-tier model, and why mechanical enforcement is the real lever."
trigger_phrases:
  - "L8 adherence disposition"
  - "command dashboard render contract result"
  - "mid-tier render adherence finding"
importance_tier: "normal"
contextType: "implementation"
---
# L8 Command-Dashboard Adherence — Disposition

<!-- ANCHOR:shipped -->
## Shipped (committed)

Doc-only edits across `.opencode/commands/`, two commits (`c3911dfe2f`, plus the filled-examples commit):
- `memory/search.md`: numbered Execution Order (read the asset first), inlined the compact `MEMORY:SEARCH … STATUS` render contract marked "MUST emit exactly this shape", header/STATUS self-check line, and a Presentation Boundary section.
- `memory/save.md`, `memory/manage.md`, `memory/learn.md` and the `create/` + `deep/` routers that lacked one: Presentation Boundary sections mirroring `doctor/`.
- `memory/assets/search_presentation.md`: top-of-file template index + a filled example and a tool-field→slot mapping table for the retrieval template.
- `memory/assets/manage_presentation.md`: a filled stats-dashboard example + field-mapping table.

These are genuine structural improvements and are kept.
<!-- /ANCHOR:shipped -->

<!-- ANCHOR:result -->
## Empirical result — adherence NOT achieved by docs alone

Re-running the bare `/memory:search` command on gpt-5.5 medium (normal speed), three independent probes, **all three** rendered free prose ("Memory Search Result / Best match found, but retrieval quality was weak…") instead of the `MEMORY:SEARCH … STATUS=OK` envelope — even after the inlined MUST template and the filled examples. The model consistently runs the search, gets a real match, then narrates the result, most reliably on the degraded/low-confidence/evidence-gap path where it treats uncertainty as license to explain.

Conclusion: **doc-only render contracts improve structure but do not make a mid-tier model honor an exact output envelope.** A stronger model (the resume/doctor menu cases that rendered verbatim are static, no data-fill) or an orchestrator post-processing layer would comply; a mid-tier model on a dynamic, low-confidence path does not.
<!-- /ANCHOR:result -->

<!-- ANCHOR:real-lever -->
## The real lever (open follow-ons)

- **R8 — mechanical CI golden-fixture lint** is the durable enforcement: assert the rendered shape mechanically rather than trusting prose instructions. This is the genuine fix for adherence and remains open.
- **R7 — give the memory family YAML workflow assets** (architectural parity) so its render path isn't doc-prose-only.
- An explicit "the envelope is mandatory even at low confidence — represent confidence inside it, never abandon it for prose" rule would help stronger models, but the mid-tier result above shows wording alone is insufficient.
- Honest framing for operators: for mid-tier executors the render contract is **advisory**, reliably honored only where the orchestrator post-processes the tool output or a stronger model is used.
<!-- /ANCHOR:real-lever -->
