# Iteration 008 (deepseek-v4-pro, prose-extracted)

> The seat answered in prose instead of the findings JSON contract; key claims distilled below, full prose preserved.

## [P1][REFINEMENT] Dynamic templates lack a fill protocol and filled examples
- Evidence: prose-extracted from deepseek seat 8; search/dashboard templates demand data-to-slot mapping with no tool-key-to-slot binding and no filled example output
- Detail: Static surfaces (doctor menu, Gate-3 block) render verbatim because no filling is needed; dynamic surfaces fail because the model must invent the mapping. A filled example gives it a pattern to imitate.
- Fix sketch: For each dynamic template, add one filled example output plus an explicit tool-field-to-slot mapping table.

---
## Full seat output

```json
{"angle": 8, "findings": [
  {
    "class": "DOC-DRIFT",
    "severity": "P1",
    "title": "Gate-3 A-E block portability comes from fenced-literal emission, not template-filling",
    "evidence": "speckit_plan_presentation.md:73 (Q1), speckit_complete_presentation.md:71 (Q1), speckit_resume_presentation.md:47 (Q0) — all use single-line ````text```` fenced blocks with fixed lettered options emitted BEFORE any tool execution",
    "detail": "The Gate-3 block is a static, single-line literal (~80 chars, 5 options A-E) that the model emits verbatim before calling any tools. Search/memory dashboards (search_presentation.md §§2-6) are result templates that must be filled AFTER tool execution, requiring the model to map dynamic MCP JSON output into multi-line placeholder slots with grouping, sorting, and counting — a fundamentally harder task with no machine-level fill protocol defined.",
    "fix_sketch": "Define a per-presentation-section `fill_protocol` mapping tool output fields to template slots, so models apply templates mechanically rather than interpreting them."
  },
  {
    "class": "REFINEMENT",
    "severity": "P2",
    "title": "Doctor menu renders correctly because it follows the same fenced-literal+accepted-answer pattern as Gate-3",
    "evidence": "doctor_speckit_presentation.md:9-23 (fenced menu) + :25-39 (accepted-answer table) vs speckit_plan_presentation.md:66-85 (fenced Q1-Q8 + reply format) — both are ````text```` fenced, static, emitted pre-execution",
    "detail": "The three commands where Gate-3 rendered correctly (speckit:plan, speckit:complete, speckit:resume) all share: (1) the A-E block is inside a ````text```` or ```` ```` fence, (2) a reply-format example follows immediately (e.g. 'Reply format: B, A, A, C, A'), and (3) the block is emitted as a user-facing prompt, not computed from tool results. The doctor menu at `doctor_speckit_presentation.md:9-23` follows the identical pattern and also succeeded.",
    "fix_sketch": "Standardize all dashboard/result templates to use the ````text````+accepted-answer-table+reply-example triad; for result templates that need dynamic data, add a machine-parseable fill_protocol section."
  },
  {
    "class": "BUG",
    "severity": "P1",
    "title": "Search result template has no machine-level binding between tool output schema and template slots",
    "evidence": "search_presentation.md:30-41 defines a 12-line template with placeholders (<score>, #<id>, <title>, <leaf-folder>, <count>, <detected_intent>) but no mapping to the actual JSON keys returned by memory_context/memory_search (which emit scores, memoryId, title, specFolder fields with different key names)",
    "detail": "The search presentation contract uses human-readable placeholders (<score>, #<id>, <title>) while the MCP tools return objects with keys like `score` (not <score>), `memoryId` (not <id>), and `specFolder` (a full path, not <leaf-folder>). A mid-tier model must (a) parse the template, (b) understand the semantic intent of each placeholder, (c) extract the right values from tool output, (d) apply grouping/filtering logic, and (e) format the result — 5 cognitive steps vs. the Gate-3 block's 0 steps (verbatim emission).",
    "fix_sketch": "Add a `## Fill Protocol` section to every presentation asset that lists `tool_output_key → template_slot` mappings and transformation rules (e.g., `specFolder → leaf-folder: last path segment after /`)."
  },
  {
    "class": "REFINEMENT",
    "severity": "P2",
    "title": "Doctor's `_routes.yaml` pattern should be replicated for memory/search dashboards",
    "evidence": "doctor/speckit.md:22 references `_routes.yaml` as canonical routing manifest binding targets→workflows; memory/search.md has no equivalent machine-parseable binding between subcommands and their presentation sections",
    "detail": "The doctor command separates concerns cleanly: `_routes.yaml` is a machine-parseable manifest, the router .md references it, and the presentation .md owns display. Memory commands (search, save, manage, learn) lack `_routes.yaml` equivalents, forcing the model to interpret prose sections in the router .md (search.md §§3-4) rather than reading a structured binding that explicitly maps each analysis subcommand to its presentation section in the asset.",
    "fix_sketch": "Create per-family `_routes.yaml` manifests for memory/{search,save,manage,learn} that bind each subcommand/result mode to its presentation section number and template slot mapping."
  },
  {
    "class": "NEW-FEATURE",
    "severity": "P2",
    "title": "Result templates should adopt the Gate-3 'reply format example' pattern for parseable output",
    "evidence": "speckit_plan_presentation.md:84 includes an explicit reply format example ('B, A, A, C, A') immediately after the consolidated prompt template; search_presentation.md §§2-6 define templates but provide zero example outputs showing what a correctly-filled template looks like",
    "detail": "The Gate-3 block succeeds partly because the presentation contract includes a concrete reply-format example showing exactly what the output should look like (comma-separated letters). Search and manage presentation contracts define abstract templates with angle-bracket placeholders but never show a filled example (e.g., a complete result block with real-looking values). A mid-tier model sees the template but has no reference for what 'correct' looks like.",
    "fix_sketch": "Add one filled example output block to every presentation template section, showing the exact shape with placeholder values filled in (search: a block with 2 folders, 5 results; dashboard: a complete table with 3 sprints)."
  }
], "summary": "The Gate-3 A-E block renders correctly because it is a short, fenced, static literal emitted verbatim before execution — zero template-filling required. Search/dashboard results break because they demand dynamic data-to-template mapping with no machine-level fill protocol, no tool-key-to-template-slot binding, and no filled example outputs for the model to pattern-match against."}
```