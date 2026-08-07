# Iteration 001 (mimo-v2.5-pro)

**Summary:** The Presentation Boundary section — a negative-scope declaration listing content that 'lives only in' the presentation asset — is present in all 13 doctor/speckit/deep commands (where /doctor rendered verbatim) but absent from all 4 memory commands (where /memory:search ignored its template). Memory commands also use weaker 'Routing Assets' naming and bury the presentation-asset-read instruction in prose rather than a numbered execution step, both of which correlate with reduced model adherence to referenced render templates.

## [P1][DOC-DRIFT] Memory commands lack Presentation Boundary section
- Evidence: All 4 memory/*.md files (search.md:1-86, save.md:1-63, manage.md:1-70, learn.md:1-59) are missing a '## Presentation Boundary' section, while all 13 doctor/speckit/deep commands have one (e.g., doctor/speckit.md:65-74, speckit/plan.md:42-51, deep/start-research-loop.md:121-129).
- Detail: The Presentation Boundary section is a negative-scope declaration that explicitly lists which user-facing content 'lives only in' the presentation asset. Its absence in memory commands means the model has no structural reinforcement that render templates must come from the asset rather than being generated inline. This directly correlates with /memory:search ignoring its search_presentation.md section 2 template.
- Fix sketch: Add a '## Presentation Boundary' section to each memory/*.md file listing the content that belongs exclusively in the corresponding presentation asset, matching the pattern used by doctor/speckit/deep.

## [P2][REFINEMENT] Memory commands use 'Routing Assets' instead of 'Owned Assets' table name
- Evidence: memory/search.md:12 uses '## 1. ROUTING ASSETS' while doctor/speckit.md:18 uses '## Owned Assets', speckit/plan.md:17 uses '## 2. Owned Assets', deep/start-research-loop.md:93 uses '## 2. Owned Assets'.
- Detail: The 'Owned Assets' naming convention signals stronger ownership and responsibility — the command OWNS the presentation contract. 'Routing Assets' suggests passive routing, which may weaken the model's sense of obligation to enforce the presentation asset's templates. All 11 memory+create commands use 'Routing Assets' while all 13 doctor/speckit/deep commands use 'Owned Assets'.
- Fix sketch: Rename 'Routing Assets' to 'Owned Assets' in all memory/*.md and create/*.md files for consistent ownership signaling across the command system.

## [P2][REFINEMENT] Memory commands use prose instruction instead of numbered Execution Order
- Evidence: memory/search.md:18 has 'Before asking startup questions or displaying results, read the presentation asset and use it as the display source of truth.' as prose after the table, while doctor/speckit.md:43 has '1. Read .opencode/commands/doctor/assets/doctor_speckit_presentation.md.' as step 1 of a numbered list.
- Detail: Numbered execution steps create a sequential imperative that the model treats as mandatory procedure. Prose instructions after a table are more easily overlooked or deprioritized. The doctor family's numbered 'Execution Order' with Read as step 1 correlates with higher adherence, while memory's buried prose instruction correlates with the model skipping the presentation asset read.
- Fix sketch: Convert the memory commands' prose 'Before rendering...' instruction into a numbered '## Execution Order' section with 'Read [presentation asset]' as step 1.

## [P3][REFINEMENT] Create commands also lack Presentation Boundary section
- Evidence: All 7 create/*.md files use '## Routing Assets' (e.g., create/agent.md:11) and have no '## Presentation Boundary' section. Grep for 'Presentation Boundary' in .opencode/commands/create/ returns 0 matches.
- Detail: Although no create command render-adherence failures were observed in the test, they share the same structural gap as memory commands. Preemptively adding Presentation Boundary sections would prevent similar adherence drift if create commands are dispatched to mid-tier models in future tests.
- Fix sketch: Add '## Presentation Boundary' sections to all create/*.md files proactively, matching the doctor/speckit/deep pattern.

## [P2][NEW-FEATURE] No manifest or validator enforces command template structural consistency
- Evidence: The doctor family has route-validate.sh (.opencode/commands/doctor/scripts/route-validate.sh) for _routes.yaml, but no equivalent exists to validate that command .md files contain required structural sections (Presentation Boundary, Owned Assets, Execution Order).
- Detail: Structural drift between command families (Presentation Boundary present in 13 of 25 commands, naming inconsistency between 'Owned Assets' and 'Routing Assets') persists because there is no CI or validation gate enforcing the template contract. A lint-like check could catch missing sections before merge.
- Fix sketch: Create a command-structure validator script that checks each command .md file for required sections (Presentation Boundary, Owned/Routing Assets, numbered Execution Order with Read as step 1).
