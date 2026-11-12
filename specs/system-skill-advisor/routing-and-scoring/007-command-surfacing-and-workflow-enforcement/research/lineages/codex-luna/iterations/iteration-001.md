# Iteration 1: Inventory and bridge coverage

## Focus
Angle 1, inventory. I reconciled the 45 command files with the generated bridge projection and its three source families. This is the denominator for later scoring and output-contract work.

## Actions Taken
1. Counted command files at the command-root and immediate group level, then compared file command names with the generated bridge command strings.
2. Read the three metadata files, the compatibility allow-list, the doctor route manifest and the bridge derivation documentation.
3. Checked exact-name gaps and aliases in both directions, then compared current counts with the earlier Pi lineage and the 003 doctor-surfacing synthesis.

## Findings
1. The current command tree contains 45 entry files: 44 grouped commands plus the root-level local-skilled-alignment command. The earlier lineage's count is confirmed when that root-level file is included. [SOURCE: .skilled/commands/local-skilled-alignment.md:1-9] [SOURCE: specs/system-skill-advisor/routing-and-scoring/007-command-surfacing-and-workflow-enforcement/research/lineages/pi-deepseek/iterations/iteration-001.md:16]
2. The bridge projection combines 19 metadata entries, 8 allow-list entries and 35 doctor route entries into 62 bridge rows. Those rows collapse to 43 distinct command strings. The projection reports 40 TypeScript-active and 50 Python-active rows; a distinct-string count yields 21 and 32 enabled commands respectively. [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/command-bridges.generated.json:4-10] [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/derive-command-bridges.cjs:663-700]
3. Five shipped identifiers are absent from the projection under their own names: /local-skilled-alignment, /prompt:improve, /speckit:handoff, /speckit:save and /speckit:search. The allow-list keeps /prompt and /memory:save aliases, so exact-name absence does not prove that every related workflow is unreachable. Three projected names have no matching command file: /memory:save, /prompt and deprecated /spec_kit. [SOURCE: .skilled/commands/local-skilled-alignment.md:1] [SOURCE: .skilled/commands/prompt/improve.md:1] [SOURCE: .skilled/commands/speckit/handoff.md:1] [SOURCE: .skilled/commands/speckit/save.md:1] [SOURCE: .skilled/commands/speckit/search.md:1] [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/allow-list.json:31-57]
4. Doctor files and route command names are not one-to-one. The directory has 17 command files, while the manifest parses to 16 distinct top-level command names. /doctor:mcp is a command file without a top-level route command, but the bridge documentation says its mcp_subroutes produce runnable /doctor:mcp <sub_action> bridge rows. [SOURCE: .skilled/commands/doctor/_routes.yaml:4-6] [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/README.md:18] [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/README.md:64] [SOURCE: .skilled/commands/doctor/mcp.md:1]
5. The 003 doctor-surfacing synthesis is historical evidence, not a current count: it reports 27 bridge entries and 5 TypeScript-active, while today's generated projection reports 62 and 40. Its route-identity recommendation still applies, but its metrics need a dated baseline. [SOURCE: specs/system-skill-advisor/routing-and-scoring/003-doctor-command-surfacing/001-doctor-command-guidance/research/research.md:24] [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/command-bridges.generated.json:4-10]
6. A drift-proof inventory should join each command file to a normalized command id, owner, source metadata, aliases or retirement status and per-runtime enabled status, while keeping child route and runnable-target rows. Support: the current deriver combines metadata, compatibility inputs and doctor routes and validates bridge ids. Contrary evidence: multi-route doctor commands and MCP subroutes need target-level runnable data, so one flattened row per bridge would blur the command and route units. [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/README.md:16-28] [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/README.md:54-64] [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/derive-command-bridges.cjs:663-700]

## Questions Answered
- None fully. Q1 is partially addressed: the current count, exact-name gaps, aliases and route-level multiplicity are mapped. The drift-check contract still needs the relevant guard tests.

## Questions Remaining
- Q1: Which source should own command identity, alias status and route targets when the files, metadata, allow-list and route manifest disagree?
- Q2-Q5 remain open: scoring, output contract and run-or-ask policy, chat-only routing and skill linkage, benchmark/prior-art/failure controls.

## Ruled Out
- Recursive markdown counting as a command denominator, because it includes nested test fixtures.
- Treating 62 bridge rows as 62 commands, because the projection includes aliases and route-target multiplicity.
- Treating a legacy alias as proof that a shipped command has a bridge under its own identifier.

## Dead Ends
- The first filtered rg listing returned 44 grouped markdown files and missed the root-level command file; direct directory enumeration and the file itself resolved the count.
- Counting only the top-level doctor route command fields misses the /doctor:mcp subroutes that the deriver adds.

## Edge Cases
- Ambiguous input: the initial filtered listing showed 44 files; checking the command root directly found local-skilled-alignment.md, giving 45.
- Contradictory evidence: 003 reports older bridge counts than the current generated projection. The difference is temporal, not an unresolved disagreement.
- Missing dependencies: none.
- Partial success: none. The inventory comparison succeeded; only the exact ownership rules for a future drift guard remain open.

## SCOPE VIOLATIONS
- scope_violation: phase_init's pre-init branch and phase_synthesis's writeback/strict-validation steps target the parent spec.md outside this lineage, and phase_save writes continuity outside it. Those writes were skipped under the dispatch's lineage-only write boundary. [SOURCE: .skilled/commands/deep/assets/deep-research-auto.yaml:487-533] [SOURCE: .skilled/commands/deep/assets/deep-research-auto.yaml:2315-2338] [SOURCE: .skilled/commands/deep/assets/deep-research-auto.yaml:2439-2466]
- scope_violation: resource-map emission would resolve from the parent spec folder, outside this lineage, so config.resource_map.emit was disabled. [SOURCE: .skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs:1792-1798]
- workflow/packet conflict: the target spec calls for 30 iterations across three executors, but this dispatched lineage binds one cli-codex executor and maxIterations 10. I followed the lineage bindings. [SOURCE: specs/system-skill-advisor/routing-and-scoring/007-command-surfacing-and-workflow-enforcement/spec.md:57] [SOURCE: specs/system-skill-advisor/routing-and-scoring/007-command-surfacing-and-workflow-enforcement/research/lineages/codex-luna/deep-research-config.json:2] [SOURCE: specs/system-skill-advisor/routing-and-scoring/007-command-surfacing-and-workflow-enforcement/research/lineages/codex-luna/deep-research-config.json:30-35]

## Sources Consulted
- .skilled/commands and .skilled/commands/local-skilled-alignment.md
- .skilled/commands/doctor/_routes.yaml and .skilled/commands/doctor/mcp.md
- .skilled/skills/sk-doc/command-metadata.json, .skilled/skills/sk-design/command-metadata.json and .skilled/skills/system-deep-loop/command-metadata.json
- .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/allow-list.json
- .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/scoring-compatibility.json
- .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/command-bridges.generated.json
- .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/derive-command-bridges.cjs and README.md
- specs/system-skill-advisor/routing-and-scoring/007-command-surfacing-and-workflow-enforcement/research/lineages/pi-deepseek/iterations/iteration-001.md
- specs/system-skill-advisor/routing-and-scoring/003-doctor-command-surfacing/001-doctor-command-guidance/research/research.md
- specs/system-skill-advisor/routing-and-scoring/003-doctor-command-surfacing/002-doctor-command-routing/implementation-summary.md
- specs/system-speckit/spec-authoring-and-continuity/005-goldfish-cold-read-plan-review and its 001, 005 and 006 child packets

## Assessment
- New information ratio: 0.42 (2 new findings, 1 partially new, 3 redundant; (2 + 0.5) / 6).
- Questions addressed: Q1, partially.
- Questions answered: none.
- Remaining key questions: 5.
- Duration upper bound: 588332 ms, measured from the last recorded pre-iteration state event because an exact iteration-start timestamp was not captured.

## Reflection
- What worked and why: comparing command names and bridge names in both directions exposed missing command identifiers and stale aliases; checking the root command file resolved the apparent 44-versus-45 discrepancy.
- What did not work and why: the filtered rg inventory omitted the root-level file, while an unfiltered recursive listing mixed command files with doctor test fixtures. Direct root and group enumeration was needed; the cause of rg's omission was not verified.
- What I would do differently: read the exact drift-guard tests before recommending the final inventory schema.

## Recommended Next Focus
Angle 2, Scoring: explain why plain planning and research prompts return no recommendation, how command intent competes with skill intent in fusion, and the effects of the no-slash penalty and mutating-command gate on recall and precision.
