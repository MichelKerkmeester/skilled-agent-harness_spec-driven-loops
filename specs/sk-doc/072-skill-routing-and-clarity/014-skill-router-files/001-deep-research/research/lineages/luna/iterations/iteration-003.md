# Iteration 3: Direct readers, hub replay, and measured migration

## Focus

Close RQ-1, RQ-4, and RQ-5 with exact parser and projection paths, measured router size by skill, and a migration plan that exposes any incompatible baseline requirement.

## Actions Taken

Traced each caller of the SKILL.md router parsers, compared hub MACHINE ROUTER sections with their existing root ROUTER.md inputs, reviewed the authoring and package contracts, reproduced the packet's word baseline against revision 6a9946a800, and counted the current sections with the locally cached O200K-compatible rank export.

## Findings

1. Direct readers are the replay parser, router-sync check, dead-resource-path scanner, and two routing-shape validators; the skill-creation template and Hermes mirror are migration producers, while the measurement harness only extracts SMART ROUTING. [SOURCE: .skilled/skills/sk-code/sk-code-skilled/assets/scripts/router-replay-lib.cjs:78-79,365-421,763-765; .skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-router-sync.cjs:47; .skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify_alignment_drift.py:815-879; .skilled/skills/sk-doc/sk-create-skill/scripts/package_skill.py:791-909,975-1010; .skilled/commands/doctor/scripts/parent-skill-check.cjs:1857,1943-2013,2019-2072,2147-2155; .skilled/skills/system-spec-kit/runtime/cli/observability/smart-router-measurement.ts:373-381,517-545]

2. Seven runtime surfaces discover or copy SKILL.md through distinct paths, and none automatically adds an arbitrary sibling ROUTER.md to model context; a short pointer in SKILL.md must direct an on-demand read. [SOURCE: .claude/SYNC.md:14,27; .opencode/SYNC.md:14,26; .codex/SYNC.md:35; .cursor/SYNC.md:39; .pi/SYNC.md:34; .devin/SYNC.md:20,34; .hermes/SYNC.md:16,24,27; https://code.claude.com/docs/en/skills; https://opencode.ai/v2/docs/skills; https://cursor.com/docs/skills; https://pi.dev/docs/latest/skills; https://developers.openai.com/blog/skills-agents-sdk/]

3. The agent needs the route decision rule, resource destinations, load levels, and ambiguity fallback; scripts need literal assignment grammar, delimiters, and path-resolution rules, so keep the decision rule in the short skill prose and use the sidecar as the detailed source. [SOURCE: .skilled/skills/sk-doc/sk-create-skill/assets/skill/skill-smart-router.md:22-26; .skilled/skills/system-skill-advisor/SKILL.md:100-115,220-240; .skilled/skills/sk-code/sk-code-skilled/assets/scripts/router-replay-lib.cjs:72-129,388-421; .skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify_alignment_drift.py:815-879]

4. Seven hubs already have root ROUTER.md files, and their moved MACHINE ROUTER sections contain no INTENT_SIGNALS, INTENT_MODEL, RESOURCE_MAP, or DEFAULT_RESOURCE assignment rows; merge the hub instructions into a separate named section and retain the existing stage-two map as the sole projection source. [SOURCE: .skilled/skills/sk-design/SKILL.md:154-173; .skilled/skills/sk-design/ROUTER.md:17-60; .skilled/skills/sk-code/sk-code-skilled/assets/scripts/router-replay-lib.cjs:652-676; .skilled/skills/sk-doc/sk-create-skill/scripts/leaf-route-replay.cjs:117-128,323-345; .skilled/skills/sk-doc/sk-create-skill/scripts/lib/root-router-contract.cjs:578-613; .skilled/bin/lib/compiled-routing/009-parent-hub-rollout/009-sk-design/lib/registry-compiler.cjs:327-348]

5. The current package validator, doctor check, smart-router template, and parent creation workflow forbid a mode packet's own ROUTER.md, so RS-004 and the authoring contract must be revised before the requested sibling-file migration can pass. [SOURCE: .skilled/skills/sk-doc/sk-create-skill/scripts/package_skill.py:187-193,1004-1009; .skilled/commands/doctor/scripts/parent-skill-check.cjs:2065-2069,2150-2152; .skilled/skills/sk-doc/sk-create-skill/assets/skill/skill-smart-router.md:24-26; create-skill-parent-auto.yaml:437,476,627,634]

6. The current tree has 57 SKILL.md files and 54 router sections totaling 39,159 words and 89,931 local O200K-export tokens; a standardized 23-token pointer leaves 88,689 initial-load token units, with exact gpt-6-luna counts unverified. [SOURCE: spec.md:63-70; token-savings.csv; local tiktoken O200K-compatible export measurement]

7. Exact compiled hash preservation conflicts with the current byte-provenance contract: moved text changes SKILL.md or ROUTER.md source hashes, which feed effectivePolicyHash and projectionHash; the accuracy dataset behind 155/195, 49/66, and 19/24 also needs a frozen fixture before parity can be proven. [SOURCE: .skilled/bin/lib/compiled-routing/009-parent-hub-rollout/009-sk-design/lib/registry-compiler.cjs:291-315,419-467; .skilled/bin/lib/compiled-routing/003-contract-schemas/lib/canonical.cjs:113-130; spec.md:79-83; .skilled/skills/system-skill-advisor/changelog/v0.17.23.0.md:16; .skilled/skills/system-spec-kit/runtime/tests/smart-router-measurement.vitest.ts:120-150]

## RQ Status

- RQ-1: answered with direct source readers, adjacent readers, authoring producers, and regression-test locations.
- RQ-2: answered in Iteration 2; runtime discovery remains progressive and Hermes currently mirrors only SKILL.md.
- RQ-3: answered in Iteration 2; retain a relative ROUTER.md pointer in SKILL.md and load the detailed route only when needed.
- RQ-4: answered with a non-duplicating hub section and first-match replay invariant.
- RQ-5: answered with a measured provisional per-skill table, a benchmark freeze requirement, and the compiled-hash conflict.

## Measurement Note

The packet baseline at revision 6a9946a800 is reproducible as 54 router sections and 39,159 whitespace-delimited words; the current tree has 57 SKILL.md files, 54 sections, and the same 39,159 router words. token-savings.csv counts each complete MACHINE ROUTER H2 section, including its heading, against the locally available packed O200K-compatible export. The export decodes to 199,991 ranks and reconstructs to SHA256 9d9087b5163318eacfeaf3366cbaba11a4380edac61f210172a20d2fdcd1a7df; installed tiktoken pins SHA256 446a9538cb6c348e3516120d7c08b09f57c36495e2acfffe59a5bf8b0cfb1a2d. Counts are therefore provisional until an authoritative tokenizer for gpt-6-luna is available. The 88,689 figure subtracts one standardized 23-token pointer per skill and measures initial SKILL.md load only. A later ROUTER.md read adds its contents back for tasks that need the resource map; workload savings depend on sidecar-read frequency.

## Source Classification

- Direct current SKILL.md parser and route replay: router-replay-lib.cjs.
- Direct synchronizer and validators: verify-router-sync.cjs, verify_alignment_drift.py, package_skill.py, and parent-skill-check.cjs.
- Adjacent parser that reads SMART ROUTING only: smart-router-measurement.ts.
- Existing hub-root ROUTER.md readers: root-router-contract.cjs, leaf-route-replay.cjs, registry-compiler.cjs, and router-replay-lib.cjs loadSurfaceRouter.
- Authoring and mirror producers: skill-smart-router.md, create-skill-parent-auto.yaml, init_skill.py, and sync-skills-hermes.cjs.
- Tests requiring corresponding updates: test_verify_alignment_drift.py, verify-router-sync.test.cjs, smart-router-measurement.vitest.ts, test_routing_shape.py, test_package_skill_regressions.py, test_create_skill_contract.py, and parent-skill-check-routing-shape.test.cjs.

## Limits

The Devin and Hermes loader behavior is grounded in this checkout's sync manifests and copy generator; an official public loader contract was not confirmed for either. The baseline metric's changelog records the accuracy totals, while the source prompt corpus and full evaluator needed to rerun them were not found in the inspected files. No repository tests or routing gates were run in this research pass.
