# Iteration 1: Machine-router reader inventory

## Focus
Inventory production parsers, checkers, generators and provenance readers that depend on the MACHINE ROUTER section or on the fact that it lives in SKILL.md. The strategy's first focus selected RQ-1.

## Findings
1. The package checker parses H2 sections and fenced machine assignments from SKILL.md. It requires the MACHINE ROUTER appendix to be final, and the SMART ROUTING marker check includes the appendix body. Moving the block therefore changes both structural and marker validation. [SOURCE: .skilled/skills/sk-doc/sk-create-skill/scripts/package_skill.py:815-906] [SOURCE: .skilled/skills/sk-doc/sk-create-skill/scripts/package_skill.py:1162-1169]
2. Router replay reads SKILL.md and parses INTENT_SIGNALS, RESOURCE_MAP and DEFAULT_RESOURCE from its text. Its fallback follows a references/ markdown pointer, then tries hub-router.json, but it does not currently resolve a root sibling ROUTER.md. verify-router-sync calls this same parser. [SOURCE: .skilled/skills/sk-code/sk-code-skilled/assets/scripts/router-replay-lib.cjs:41-50] [SOURCE: .skilled/skills/sk-code/sk-code-skilled/assets/scripts/router-replay-lib.cjs:373-417] [SOURCE: .skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-router-sync.cjs:47-53]
3. The optional dead-route check reads each live SKILL.md and extracts fenced RESOURCE_MAP or DEFAULT_RESOURCE paths. The measurement parser also reads SKILL.md before extracting the router model, so both need a sibling-file resolver if those declarations leave the skill body. [SOURCE: .skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify_alignment_drift.py:815-839] [SOURCE: .skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify_alignment_drift.py:842-879] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/observability/smart-router-measurement.ts:517-544]
4. The doctor parent check independently parses the same final section and rejects a packet-local ROUTER.md. The routing-shape tests also assert appendix location, finality and marker discovery, so the package gate, doctor gate and their fixtures must move together. [SOURCE: .skilled/commands/doctor/scripts/parent-skill-check.cjs:1943-2013] [SOURCE: .skilled/commands/doctor/scripts/parent-skill-check.cjs:2037-2069] [SOURCE: .skilled/skills/sk-doc/scripts/tests/test_routing_shape.py:455-490] [SOURCE: .skilled/commands/doctor/scripts/tests/parent-skill-check-routing-shape.test.cjs:328-349]
5. Both skill-generation workflows still instruct authors to put packet machine routing in the final SKILL.md section, while both structural gates forbid a ROUTER.md inside mode packets. This conflicts with a blanket move of every skill to a sibling ROUTER.md. LOGIC-SYNC REQUIRED is recorded: the migration needs an explicit canon change or a narrowed eligibility rule. [SOURCE: .skilled/commands/create/assets/create-skill-auto.yaml:347] [SOURCE: .skilled/commands/create/assets/create-skill-parent-auto.yaml:476] [SOURCE: .skilled/skills/sk-doc/sk-create-skill/scripts/package_skill.py:1004-1009]
6. The leaf-manifest generator walks configured resource roots and does not parse SKILL.md router declarations. Compiled-routing inputs do attest whole source bytes, so the relocated ROUTER.md must enter the source identity and hash set even when the selected route projection stays unchanged. [SOURCE: .skilled/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs:192-230] [SOURCE: .skilled/bin/lib/compiled-routing/009-parent-hub-rollout/002-system-deep-loop/lib/registry-compiler.cjs:68-92] [SOURCE: .skilled/bin/lib/compiled-routing/009-parent-hub-rollout/009-sk-design/lib/registry-compiler.cjs:291-315]

## Ruled Out
- Treating the leaf-manifest generator as a direct MACHINE ROUTER reader. Its source walks configured leaf roots and does not parse SKILL.md.
- Treating every root ROUTER.md parser as a current reader of the SKILL.md appendix. The root-router checks read the separate stage-two router; their merge behavior is examined in RQ-4.

## Dead Ends
The broad full-text search was noisy because every skill, changelog and prior research note names the router. A code-only symbol search located the direct parsers and duplicate shape gates.

## Edge Cases
- Ambiguous input: "every skill" includes mode packets, but the existing canon explicitly forbids packet-local ROUTER.md files. Continue by mapping the root-router replay constraint and report this as a required canon decision.
- Contradictory evidence: the requested blanket migration conflicts with the generator and validator contract; record it and continue under the dispatcher's instruction.
- Missing dependencies: none for this iteration.
- Partial success: workflow-owned spec writeback, temporary event staging outside the lineage and continuity save are skipped because the dispatch bounds all writes to this lineage. This deviation is recorded here as instructed.

## Sources Consulted
- .skilled/skills/sk-code/sk-code-skilled/assets/scripts/router-replay-lib.cjs:41-50, 373-417
- .skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-router-sync.cjs:47-53
- .skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify_alignment_drift.py:815-879
- .skilled/skills/system-spec-kit/runtime/cli/observability/smart-router-measurement.ts:517-544
- .skilled/skills/sk-doc/sk-create-skill/scripts/package_skill.py:815-906, 975-1009, 1162-1169
- .skilled/commands/doctor/scripts/parent-skill-check.cjs:1943-2013, 2037-2069
- .skilled/skills/sk-doc/scripts/tests/test_routing_shape.py:455-490
- .skilled/commands/doctor/scripts/tests/parent-skill-check-routing-shape.test.cjs:328-349
- .skilled/commands/create/assets/create-skill-auto.yaml:347
- .skilled/commands/create/assets/create-skill-parent-auto.yaml:476
- .skilled/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs:192-230
- .skilled/bin/lib/compiled-routing/009-parent-hub-rollout/002-system-deep-loop/lib/registry-compiler.cjs:68-92
- .skilled/bin/lib/compiled-routing/009-parent-hub-rollout/009-sk-design/lib/registry-compiler.cjs:291-315

## Assessment
- New information ratio: 1.0
- Questions addressed: RQ-1, with dependencies surfaced for RQ-4 and RQ-5
- Questions answered: none yet; this pass establishes the direct reader inventory but runtime and replay interactions remain open

## Reflection
- What worked and why: tracing parser calls from the replay and checker entry points separated direct router readers from whole-file provenance readers.
- What did not work and why: the broad full-text scan drowned code paths in corpus mentions; its root cause was a content pattern applied to all markdown.
- What I would do differently: use code extensions and parser symbols first, then inspect the relevant tests and templates.

## Recommended Next Focus
Map how all seven runtimes discover, copy and load skill files, including Hermes' copy step and whether sibling ROUTER.md is loaded.
