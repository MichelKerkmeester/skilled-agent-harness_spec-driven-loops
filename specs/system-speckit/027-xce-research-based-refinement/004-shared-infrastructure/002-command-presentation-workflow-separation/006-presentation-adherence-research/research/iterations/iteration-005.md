# Iteration 005 (mimo-v2.5-pro)

**Summary:** The memory family's 'Before [action], read [asset]' phrasing is the weakest startup-routing convention across all 25 commands — every other family uses either imperative 'Load the presentation contract before...' prose or explicit numbered '1. Read [exact path]' Execution Order steps. The doctor and create families' Execution Order pattern (step 1 = 'Read [presentation asset path]') is the strongest convention and should be adopted uniformly across all command families to eliminate the three-tier drift that correlates with the /memory:search free-prose rendering failure.

## [P1][DOC-DRIFT] memory/* ROUTING ASSETS uses advisory phrasing while all other families use imperative or explicit-step patterns
- Evidence: memory/search.md:18 'Before asking startup questions or displaying results, read the presentation asset and use it as the display source of truth.' vs doctor/mcp.md:30 '1. Read `.opencode/commands/doctor/assets/doctor_mcp_presentation.md`.' (Execution Order step 1) and speckit/resume.md:15 'Load the presentation contract before showing startup questions...' (imperative).
- Detail: The memory family (search.md, save.md, manage.md, learn.md) uses the softest phrasing of any family: 'Before [action], read [asset]'. The speckit and deep families use imperative 'Load the presentation contract before [actions]'. The doctor and create families use explicit numbered Execution Order steps starting with '1. Read [asset]'. The memory family's advisory tone is the weakest convention and correlates with the observed /memory:search free-prose failure.
- Fix sketch: Add an '## Execution Order' section to each memory command with '1. Read `.opencode/commands/memory/assets/<name>_presentation.md`.' as step 1, matching the doctor/create pattern.

## [P1][DOC-DRIFT] memory/* commands lack an Execution Order section entirely — no numbered first-action step for reading the presentation asset
- Evidence: Compare memory/search.md (has '## 1. ROUTING ASSETS', '## 2. STARTUP ROUTING', '## 3. RETRIEVAL MODE' — no Execution Order) with create/agent.md (has '## Routing Assets' then '## Execution Order' with '1. Read [presentation]. 2. Run Phase 0...' as explicit numbered steps). Same gap in memory/save.md, memory/manage.md, memory/learn.md.
- Detail: Every create/* command (7 files), every doctor/* command (3 files with assets), and the agent_router.md all have an explicit '## Execution Order' section where step 1 is 'Read [presentation asset]'. The memory family is the only one that relies solely on a prose sentence in the ROUTING ASSETS section rather than a numbered execution step. Mid-tier models following numbered steps are far more likely to comply than models asked to honor a prose reminder.
- Fix sketch: Restructure each memory command to add '## Execution Order' with numbered steps: 1. Read the presentation asset, 2. Parse $ARGUMENTS, 3. Route, 4. Render from the presentation asset.

## [P2][REFINEMENT] speckit/* and deep/* families use 'Load the presentation contract' but lack explicit Execution Order sections
- Evidence: speckit/plan.md:15 'Load the presentation contract before showing startup questions, checkpoints, dashboards, success output, failure output, or next-step prompts.' — imperative but no numbered step. deep/start-research-loop.md:15 same pattern. All 14 commands in these two families share this gap.
- Detail: While the speckit and deep families use stronger imperative phrasing than memory, they still lack the explicit numbered Execution Order pattern that doctor/* and create/* use. The 'Load... before' phrasing is stronger than 'Before... read' but weaker than '1. Read [exact path].' as a numbered step. This creates a two-tier convention where doctor/create are more explicit than speckit/deep.
- Fix sketch: Add '## Execution Order' with '1. Read [presentation asset].' as step 1 to all speckit/* and deep/* commands, consolidating the imperative prose into the numbered step.

## [P2][REFINEMENT] Inconsistent section naming: ROUTING ASSETS vs Routing Assets vs Owned Assets
- Evidence: memory/search.md uses '## 1. ROUTING ASSETS' (numbered, uppercase). create/agent.md uses '## Routing Assets' (unnumbered, title case). speckit/resume.md uses '## 2. Owned Assets' (numbered, title case). deep/start-research-loop.md uses '## 2. Owned Assets'. doctor/speckit.md uses '## Owned Assets' (unnumbered).
- Detail: Four different heading conventions exist for the section that declares the presentation asset path. While cosmetic, inconsistent naming reduces scannability for both humans and models scanning for the 'read this first' directive. The numbered prefix in memory/* ('## 1. ROUTING ASSETS') also implies a sequence that doesn't exist — it's a declaration, not a step.
- Fix sketch: Standardize all commands to '## Routing Assets' (unnumbered, title case) for the asset table, and use a separate '## Execution Order' section for numbered steps.

## [P3][REFINEMENT] doctor/speckit.md and doctor/mcp.md have the strongest convention — 'Execution Order: 1. Read [exact path]' — but are not cited as the template
- Evidence: doctor/mcp.md:29-30: '## Execution Order

1. Read `.opencode/commands/doctor/assets/doctor_mcp_presentation.md`.' — explicit path, numbered, first action. Same in doctor/speckit.md:43 and doctor/update.md:29.
- Detail: The doctor family's Execution Order pattern is the most robust convention: it names the exact file path as step 1, leaving zero ambiguity for a dispatched model. If this pattern were documented as the canonical template (e.g., in a contributing guide or the command-authoring skill), all families could converge on it, eliminating the three-tier drift.
- Fix sketch: Document the doctor/create Execution Order pattern as the canonical command-authoring convention in a shared reference, then apply it uniformly.
