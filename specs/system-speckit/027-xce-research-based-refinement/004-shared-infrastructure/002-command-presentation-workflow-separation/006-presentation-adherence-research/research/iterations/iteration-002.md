# Iteration 002 (mimo-v2.5-pro)

**Summary:** The root cause is that /memory:search lacks the explicit numbered 'Execution Order' section that /doctor and all working commands use to force the model to Read the presentation asset as step 1. The render instruction is buried at step 7 of the retrieval sub-workflow, after the model has already shaped its response, and uses a vague reference ('the presentation asset') instead of inlining the file path. Adding an Execution Order section with the Read as step 1, moving the render-format gate before tool calls, inlining the path, and adding a Presentation Boundary section would make the template unmissable without introducing workflow YAML.

## [P1][DOC-DRIFT] No explicit execution-order section; presentation read is buried prose
- Evidence: search.md:18 vs doctor/speckit.md:43 ('1. Read .opencode/commands/doctor/assets/doctor_speckit_presentation.md.')
- Detail: /doctor has a dedicated 'Execution Order' section with 'Read the presentation asset' as step 1. /memory:search has only a prose sentence at line 18 ('Before asking startup questions or displaying results, read the presentation asset...') between the asset table and the startup routing section. Mid-tier models treat prose guidance as advisory and numbered steps as mandatory, so the prose gets skipped.
- Fix sketch: Add a '## Execution Order' section to search.md with '1. Read .opencode/commands/memory/assets/search_presentation.md.' as the first numbered step, before any routing logic.

## [P1][DOC-DRIFT] Render instruction is step 7 of retrieval, not a top-level gate
- Evidence: search.md:47 ('7. Render compact, parseable output using the presentation asset.')
- Detail: The only explicit render instruction lives at step 7 inside the 'RETRIEVAL MODE' section. By the time a model reaches step 7, it has already called MCP tools and formed a response shape in working memory. The instruction to use the template competes with the response the model has already drafted, and the template loses.
- Fix sketch: Move the render-format instruction to the top-level execution order (e.g., step 2: 'Render all output using the section 2 template from the presentation asset') so it is established before any tool calls happen.

## [P2][REFINEMENT] Presentation asset path not inlined in the step that needs it
- Evidence: search.md:47 vs doctor/speckit.md:43 (inline path '.opencode/commands/doctor/assets/doctor_speckit_presentation.md')
- Detail: The render step at line 47 says 'using the presentation asset' without repeating the file path. The doctor command inlines the full path in its execution step. When the model has already skipped the asset table (lines 13-16), a vague reference to 'the presentation asset' provides no anchor for a late-stage Read call.
- Fix sketch: Inline the full path in the render step: 'Render compact, parseable output using .opencode/commands/memory/assets/search_presentation.md section 2.'

## [P2][REFINEMENT] No 'Presentation Boundary' section to anchor what the asset owns
- Evidence: doctor/speckit.md:65-74 (explicit 'Presentation Boundary' section) vs search.md (no equivalent)
- Detail: Every working command (/doctor, /speckit:plan, /speckit:resume, /deep:start-research-loop) has a '## Presentation Boundary' section listing exactly which display elements live in the presentation asset. /memory:search has no such section, so the model has no structural reminder of what content it must delegate to the template.
- Fix sketch: Add a '## Presentation Boundary' section listing: startup question, retrieval result table, empty-result fallback, analysis overview, and all analysis result templates.

## [P3][REFINEMENT] Missing workflow YAML means no hard gate on presentation load
- Evidence: search.md:15 ('No memory workflow YAML exists in this checkout') vs doctor/speckit.md:51 ('Load the resolved workflow YAML...and execute it step by step')
- Detail: Commands with YAML workflows have a start condition gate (e.g., doctor/speckit.md:60: 'target bound, workflow asset exists, presentation asset loaded'). Without YAML, /memory:search relies entirely on the model's discipline to read the presentation file. This is a structural disadvantage but not independently fixable without introducing a workflow YAML.
- Fix sketch: When a workflow YAML is introduced for /memory:search, add a start condition: 'presentation asset loaded AND retrieval mode resolved.'
