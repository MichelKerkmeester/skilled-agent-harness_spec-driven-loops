# Research: Move MACHINE ROUTER Sections into Sibling ROUTER.md Files

## 1. Executive Summary

Moving detailed machine-router material out of SKILL.md can reduce initial skill context substantially, but it requires coordinated changes to parsers, shape validators, tests, authoring templates, and Hermes packaging. This checkout contains 57 SKILL.md files and 54 MACHINE ROUTER sections; those sections total 39,159 words and 89,931 token units under a locally cached O200K-compatible export. A common 23-token pointer in each SKILL.md leaves 88,689 provisional token units out of the initial skill load. The per-skill measurements are in [token-savings.csv](token-savings.csv).

A sibling ROUTER.md is not automatically added to model context by the runtime surfaces examined. Keep a short relative pointer and load instruction in SKILL.md; have Hermes include or link the sidecar in its generated copy. For hubs that already own a root ROUTER.md, put the moved human instructions in a distinct named section and keep the existing stage-two assignment block as the sole replay projection source.

Two requirements need amendment before implementation: the current package and doctor contracts reject a mode packet's own ROUTER.md, and the compiler hashes authored source bytes, so moving text changes provenance and compiled projection hashes. The advisor accuracy baseline is recorded as 155/195, 49/66, and 19/24, but its exact corpus and evaluator were not found. Freeze them before claiming parity. Treat route replay and advisor decisions as semantic invariants; regenerate byte-provenance hashes after migration.

## 2. Scope and Method

The research answers the five questions in the packet spec by tracing parser and validator call sites, tests, authoring templates, runtime sync manifests, Hermes generation, hub replay inputs, and compiled-routing provenance. Iteration 1 mapped readers; iteration 2 compared runtime loading and agent/script context; iteration 3 checked hub projection and measured the current router sections.

The run used three iterations, with new-information ratios 1.00, 0.82, and 0.76. It stopped at the configured maxIterations cap. No repository test suite, router replay gate, or advisor benchmark was run; this is a source audit and measurement report, not an implementation verification.

## 3. Current Shape and Baseline

At historical revision 6a9946a800, the packet baseline reproduces 54 skill files with 54 MACHINE ROUTER sections and 39,159 whitespace-delimited words. The current tree has 57 SKILL.md files, 54 MACHINE ROUTER sections, and the same 39,159 router words. Three current skill files therefore have no section counted by the measurement.

The current authoring contract places the machine router in a final SKILL.md appendix. The parser-facing content includes fenced assignments such as INTENT_SIGNALS, RESOURCE_MAP, and DEFAULT_RESOURCE, as well as prose and fallback instructions. Moving the appendix must preserve a clear distinction between agent-facing selection policy and the literal grammar consumed by scripts.

## 4. RQ-1: Direct MACHINE ROUTER Readers

The following code directly parses or validates machine-router material currently authored in SKILL.md:

- .skilled/skills/sk-code/sk-code-skilled/assets/scripts/router-replay-lib.cjs:78-79,365-421,763-765 reads SKILL.md, extracts its inline router assignments, then tries an explicit references/ fallback and hub-router.json. It does not currently resolve a sibling ROUTER.md. Add sidecar resolution and a transitional fallback policy here so replay has one canonical parser.
- .skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-router-sync.cjs:47,194-205 passes skill text through the replay parser while checking parent/child resource agreement. Update it to use the same sidecar-aware resolver and exercise that path in its tests.
- .skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify_alignment_drift.py:815-839,842-879 scans fenced RESOURCE_MAP and DEFAULT_RESOURCE assignments, then checks that each destination exists relative to the skill root. Read the sidecar for declarations while keeping destination resolution rooted at the skill directory.
- .skilled/skills/sk-doc/sk-create-skill/scripts/package_skill.py:187-193,791-909,975-1010,1162-1169 owns the current router shape, appendix markers, final-section rule, and packet-file rejection. Make its structure and marker checks sidecar-aware and amend the packet restriction before migration.
- .skilled/commands/doctor/scripts/parent-skill-check.cjs:1857,1943-2013,2019-2072,2147-2155 duplicates parser and shape logic and currently emits RS-004 when a mode packet owns ROUTER.md. Align it with the package checker or a shared parser so the two gates cannot disagree.

The contract is broader than the five parser entry points: all must agree on the source file, marker shape, relative path root, and migration fallback. A temporary inline/sidecar dual-read can support staged rollout, but the checker must reject ambiguous duplicate assignments before the final cutover.

## 5. RQ-1: Tests, Producers, and Adjacent Readers

Update the regression fixtures that encode the current appendix or packet-file prohibition:

- .skilled/skills/sk-code/sk-code-skilled/assets/scripts/test_verify_alignment_drift.py:228-285 covers resource-path scanning.
- .skilled/skills/sk-code/sk-code-skilled/scripts/tests/verify-router-sync.test.cjs:41-42,97-170 covers skill maps and the separate hub ROUTER.md controls.
- .skilled/skills/sk-doc/scripts/tests/test_routing_shape.py:229-271,455-458 covers appendix and packet router shape.
- .skilled/skills/sk-doc/scripts/tests/test_package_skill_regressions.py:391-434 covers packaging regressions.
- .skilled/commands/doctor/scripts/tests/parent-skill-check-routing-shape.test.cjs:328-358 asserts the current final appendix and RS-004 behavior.
- .skilled/skills/sk-doc/scripts/tests/test_create_skill_contract.py:631 exercises the hub root-router contract; retain that root-router coverage while adding sidecar cases.

Authoring and packaging producers also need changes. .skilled/skills/sk-doc/sk-create-skill/assets/skill/skill-smart-router.md:22-26 directs authors to the final MACHINE ROUTER section and describes the hub-only root router rule. .skilled/commands/create/assets/create-skill-parent-auto.yaml:437,476,627,634 repeats the packet-local router prohibition. The Hermes generator .skilled/skills/system-spec-kit/runtime/cli/hermes/sync-skills-hermes.cjs:51-70,89-100,142-160,234-270 walks and emits SKILL.md copies only; extend it to carry the sidecar or point to its canonical path.

Several related tools are not direct MACHINE ROUTER readers. .skilled/skills/system-spec-kit/runtime/cli/observability/smart-router-measurement.ts:373-381,517-545 reads SKILL.md but extracts the SMART ROUTING anchor, not the MACHINE ROUTER appendix. .skilled/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs:192-230 enumerates declared leaf roots without parsing router text. The compiled registry reads source bytes for provenance, which affects hashes but is not a router grammar parser. Existing root-router consumers are addressed in Section 8.

## 6. RQ-2: How the Seven Runtime Surfaces Load Skills

- **Claude Code:** this checkout exposes .claude/skills through its sync path (.claude/SYNC.md:14,27). Claude loads a selected SKILL.md progressively; supporting files require a link or instruction that causes an on-demand read. The official guide documents the skill format and supporting-file pattern: [Claude Code skills](https://code.claude.com/docs/en/skills).
- **OpenCode:** .opencode/skills is linked through the local sync path (.opencode/SYNC.md:14,26). Its skill documentation describes progressive skill loading and explicit skill paths: [OpenCode skills](https://opencode.ai/v2/docs/skills).
- **Codex:** this repository has no .codex/skills or .agents/skills source tree in its local setup; .codex/SYNC.md:14-35 and AGENTS.md:65-70 route through the skill-advisor instructions and canonical skill paths. OpenAI documents the .agents/skills convention, but it is not provisioned in this checkout: [OpenAI skills and agents](https://developers.openai.com/blog/skills-agents-sdk/).
- **Cursor:** the local manifest records its own discovery location (.cursor/SYNC.md:39), while current Cursor documentation also discovers .claude/skills, which this checkout links to the canonical tree. Supporting files remain on-demand: [Cursor skills](https://cursor.com/docs/skills).
- **Pi:** .pi/skills is exposed through the local sync manifest (.pi/SYNC.md:34), with supporting files available when the loaded skill points to them. See [Pi skills](https://pi.dev/docs/latest/skills).
- **Devin:** .devin/skills is linked through the repository sync setup (.devin/SYNC.md:20,34). An official public loader contract was not confirmed in this pass; treat the repository manifest as the evidence for this checkout.
- **Hermes:** .hermes/SYNC.md:16,24,27 documents a generated skill view. The generator copies only SKILL.md and rewrites relative links; it omits sibling references, scripts, assets, and other sidecars (sync-skills-hermes.cjs:51-70,89-100,142-160,234-270). An official public loader contract was not confirmed. The generator must include ROUTER.md or rewrite the pointer to the canonical sidecar.

None of the inspected runtime sources establishes automatic loading of an arbitrary sibling ROUTER.md. For each runtime, put a short relative read instruction in SKILL.md and verify that its packaging path preserves the sidecar or pointer.

## 7. RQ-3: Agent Context Versus Script Inputs

The agent needs the intent-to-resource decision rule, the route destinations, the level or condition at which each destination should load, and a fallback for ambiguous or low-confidence matches. Keep those behavioral instructions concise in SKILL.md, with a relative pointer such as: “Read ./ROUTER.md before selecting skill-local resources; open only the matched files.” The pointer must be sufficiently explicit to trigger an on-demand read under each runtime's progressive loading behavior.

Scripts need deterministic syntax: assignment names, fenced-block boundaries, valid value shapes, relative path roots, fallback ordering, and duplicate-source behavior. Put that contract in ROUTER.md and teach parsers to read it directly. Do not require agents to interpret parser-only delimiters or load the entire route inventory for tasks that do not need it. The authoring template and live advisor descriptions provide the policy reference (skill-smart-router.md:22-26; system-skill-advisor/SKILL.md:100-115,220-240).

## 8. RQ-4: Hub Router Integration Without Replay Projection Drift

Seven hubs already have root ROUTER.md files: cli-classifier, cli-external-orchestration, mcp-tooling, sk-code, sk-design, sk-doc, and system-deep-loop. The measured MACHINE ROUTER sections in those hubs contain no INTENT_SIGNALS, INTENT_MODEL, RESOURCE_MAP, or DEFAULT_RESOURCE assignment rows. The design hub illustrates the split between SKILL.md and existing root router (.skilled/skills/sk-design/SKILL.md:154-173; .skilled/skills/sk-design/ROUTER.md:17-60).

Merge the moved hub instructions into a separate named prose section of each existing root ROUTER.md. Keep the existing stage-two assignment block and its values as the only replay projection source. Do not append a second map or duplicate assignment block. router-replay-lib.cjs:652-676, leaf-route-replay.cjs:117-128,323-345, root-router-contract.cjs:578-613, and registry-compiler.cjs:327-348 read or validate the hub root router. Regression tests should compare the projected route result before and after while allowing source provenance hashes to refresh.

## 9. Existing Authoring Contract Conflict

The requested blanket sibling-file shape conflicts with existing rules. package_skill.py:187-193,1004-1009 and parent-skill-check.cjs:2065-2069,2150-2152 reject a mode packet's own ROUTER.md; skill-smart-router.md:22-26 and the parent creation workflow (create-skill-parent-auto.yaml:437,476,627,634) preserve the final inline appendix and hub-only root file model. The packet spec also names the current rule as RS-004.

This is a real contract mismatch, not just a missing parser path. Amend RS-004 and the authoring workflow to define the intended sidecar rule, including the hub exception: a hub's route prose joins its existing root ROUTER.md, while a mode or leaf skill may own its sibling ROUTER.md. Update tests and package checks in the same change before moving any production sections.

## 10. RQ-5: Advisor Accuracy and Compiled Hashes

The recorded accuracy figures are 155/195, 49/66, and 19/24 (spec.md:79-83; .skilled/skills/system-skill-advisor/changelog/v0.17.23.0.md:16). The source prompt corpus and full evaluator were not located. The current smart-router-measurement.vitest.ts:120-150 covers a small fixture, not enough to establish those full baselines. Freeze the exact inputs, evaluator version, expected decisions, and fixture hashes before migration.

Exact compiled hash preservation is incompatible with the present source-provenance design. The compiler loads raw bytes for mode-registry.json, hub-router.json, SKILL.md, and ROUTER.md (registry-compiler.cjs:291-315); it hashes source bytes (:282-288) and carries those digests into provenance, effectivePolicyHash, and projectionHash (:419-467). Moving content changes the authored bytes and therefore the relevant source digests. The implementation can preserve route decisions and canonical intent/resource projection, then regenerate source and compiled hashes. Keeping byte-identical hashes would require changing the hash contract to normalize or exclude the relocated content and would no longer attest the same source set.

## 11. Recommendations

1. Freeze the advisor corpus and replay fixtures, including expected decisions and current route projection, before touching files.
2. Amend RS-004 and the skill-creation templates to allow sidecars for leaf/mode skills and define the hub exception.
3. Create one shared sidecar-aware parser/resolver and migrate replay, synchronization, drift, packaging, and doctor checks to it.
4. Keep a compact SKILL.md pointer; make Hermes emit the router content or a canonical-path pointer.
5. Migrate in batches. After each batch, verify sidecar count, no duplicate assignments, dead-resource paths, replay outputs, advisor fixtures, and per-skill token counts. Refresh provenance hashes and preserve the previous hash set as a comparison artifact.

## Eliminated Alternatives

| Approach | Reason Eliminated | Evidence | Iteration(s) |
|---|---|---|---|
| Treat all root ROUTER.md parsers as readers of the inline MACHINE ROUTER appendix | They consume a separate stage-two router file; conflating them would misstate the migration surface. | router-replay-lib.cjs:652-676; root-router-contract.cjs:578-613 | 1, 3 |
| Treat the leaf-manifest generator as a direct router parser | It walks configured leaf roots and does not parse SKILL.md router declarations. | generate-leaf-manifest.cjs:192-230 | 1 |
| Treat smart-router-measurement.ts as a direct MACHINE ROUTER reader | It reads the SMART ROUTING anchor, not the MACHINE ROUTER appendix. | smart-router-measurement.ts:373-381,517-545 | 1, 3 |
| Assume a sibling ROUTER.md automatically enters model context | Runtime discovery loads the skill progressively; sidecar content needs an explicit pointer/read instruction. | .claude/SYNC.md:14,27; .opencode/SYNC.md:14,26; runtime documentation in Section 6 | 2, 3 |
| Require identical source-derived compiled hashes after moving the bytes | The compiler's provenance hashes include authored source bytes, which change when router text moves. | registry-compiler.cjs:282-315,419-467 | 1, 3 |

## Divergence Map

The run used the default convergence mode. No divergent pivots, failures, or audited overrides were recorded. The registry and strategy record no saturated directions and no remaining divergence frontier. This means the requested research angles were covered in three passes; it does not remove the validation gaps in Section 12.

## 12. Open Questions

The five packet RQs are answered in the current registry. Three implementation evidence gaps remain:

- The exact gpt-6-luna tokenizer and authoritative per-skill token count are UNKNOWN. The local export differs from the installed tiktoken rank-file checksum.
- The benchmark corpus and full evaluator behind 155/195, 49/66, and 19/24 are UNKNOWN. Their changelog totals are recorded, but parity cannot be independently rerun without the inputs.
- The official public loader contract for Devin and Hermes was not confirmed. The repository sync manifests and Hermes generator establish how this checkout provisions them.

These are verification prerequisites for implementation, not unresolved results about the five RQs.

## 13. Proposed Implementation Phases

1. **Baseline freeze:** capture the exact advisor corpus and output, replay fixtures and projection, all current source hashes, and authoritative tokenizer version.
2. **Contract and parser:** revise RS-004, templates, and creation flows; implement the shared sidecar resolver with clear precedence and duplicate rejection; update direct-reader and shape tests.
3. **Runtime packaging:** update Hermes copying and each runtime sync manifest that must preserve or reference the sidecar; test on-demand loading through a minimal pointer.
4. **Hub migration:** merge hub prose into a named section of each existing root router without adding assignment declarations; compare replay projections.
5. **Leaf migration:** move sections in controlled batches, retaining only the short pointer in SKILL.md; maintain a debt list for unconverted skills.
6. **Acceptance and provenance refresh:** run the frozen advisor and replay suites, check route semantics and dead-resource paths, measure sidecar/initial-load counts with the authoritative tokenizer, and regenerate compiled source hashes.

## 14. Verification Plan

Acceptance should require all of the following before rollout:

- Every migrated SKILL.md points to an existing sibling or hub root router, with exactly one active assignment source.
- The shared parser, router-sync check, drift scanner, package validator, and doctor check all accept the new shape and reject missing, duplicated, malformed, or path-escaping routes.
- Runtime-specific fixtures demonstrate that Claude Code, OpenCode, Codex, Cursor, Pi, Devin, and Hermes can access the referenced router; Hermes output must include the sidecar or canonical pointer.
- Frozen advisor outputs retain the recorded baseline decisions, and router replay produces the same canonical intent-to-resource projection.
- Source hashes are regenerated and the diff explains each change; exact old hash equality is not an acceptance condition under the current provenance contract.
- token-savings.csv is regenerated with the authoritative tokenizer and includes initial SKILL.md load, sidecar load, and net workload savings by skill/read frequency.

## 15. Evidence Strength and Limitations

The direct-reader locations, package restrictions, hub projection readers, and compiled hash inputs are confirmed by the cited repository source. Runtime-specific packaging behavior is confirmed for this checkout by its sync manifests; official documentation is additionally available for Claude Code, OpenCode, Cursor, Pi, and Codex. Devin and Hermes behavior remains grounded in local provisioning code.

The token table is measured but provisional: the locally cached packed O200K-compatible export has 199,991 ranks and reconstructed checksum 9d9087b5163318eacfeaf3366cbaba11a4380edac61f210172a20d2fdcd1a7df, while installed tiktoken pins 446a9538cb6c348e3516120d7c08b09f57c36495e2acfffe59a5bf8b0cfb1a2d. The exact Luna tokenizer count is therefore UNKNOWN. The 88,689 figure measures only the reduction in initial skill context; reading a router sidecar later adds its contents back for that task.

## 16. Convergence and Workflow Notes

- Stop reason: maxIterationsReached.
- Total iterations: 3.
- Questions answered: 5 / 5.
- Remaining packet questions: none.
- Iteration summaries: run 1 mapped readers (1.00); run 2 mapped runtimes and context (0.82); run 3 covered hubs, measurements, and contract conflicts (0.76).
- Configured convergence threshold: 0.05; early convergence was telemetry only and did not shorten the run.
- No tests or repository routing gates were run. The report records source evidence and a proposed acceptance plan.
- Closeout conflict: the lineage config labels deep-research-config.json immutable, while deep-research-auto.yaml:2295-2298 requires status complete. Resolved by changing only the lifecycle status and preserving all other config fields.
- The final reducer emitted an informational warning that the five strategy questions were imported from legacy key-question rows; all five now show resolved in the registry.
- The canonical packet spec and any files outside this lineage were not modified, as required by the dispatch write boundary.

## 17. References

**Repository sources**

- specs/sk-doc/072-skill-routing-and-clarity/014-skill-router-files/001-deep-research/spec.md:63-83
- .claude/SYNC.md:14,27; .opencode/SYNC.md:14,26; .codex/SYNC.md:14-35; .cursor/SYNC.md:39; .pi/SYNC.md:34; .devin/SYNC.md:20,34; .hermes/SYNC.md:16,24,27
- .skilled/skills/sk-code/sk-code-skilled/assets/scripts/router-replay-lib.cjs:78-79,365-421,652-676,763-765
- .skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-router-sync.cjs:47,194-205; .skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify_alignment_drift.py:815-879
- .skilled/skills/sk-doc/sk-create-skill/scripts/package_skill.py:187-193,791-909,975-1010,1162-1169; .skilled/commands/doctor/scripts/parent-skill-check.cjs:1857,1943-2013,2019-2072,2147-2155
- .skilled/skills/sk-doc/scripts/tests/test_routing_shape.py:229-271,455-458; .skilled/skills/sk-doc/scripts/tests/test_package_skill_regressions.py:391-434; .skilled/commands/doctor/scripts/tests/parent-skill-check-routing-shape.test.cjs:328-358
- .skilled/skills/sk-doc/sk-create-skill/assets/skill/skill-smart-router.md:22-26; .skilled/commands/create/assets/create-skill-parent-auto.yaml:437,476,627,634
- .skilled/skills/system-spec-kit/runtime/cli/hermes/sync-skills-hermes.cjs:51-70,89-100,142-160,234-270
- .skilled/bin/lib/compiled-routing/009-parent-hub-rollout/009-sk-design/lib/registry-compiler.cjs:282-315,327-348,419-467
- .skilled/skills/system-skill-advisor/changelog/v0.17.23.0.md:16; .skilled/skills/system-spec-kit/runtime/tests/smart-router-measurement.vitest.ts:120-150
- token-savings.csv (54 per-skill measurements)

**Official runtime documentation**

- [Claude Code skills](https://code.claude.com/docs/en/skills)
- [OpenCode skills](https://opencode.ai/v2/docs/skills)
- [Cursor skills](https://cursor.com/docs/skills)
- [Pi skills](https://pi.dev/docs/latest/skills)
- [OpenAI skills and agents](https://developers.openai.com/blog/skills-agents-sdk/)

**Convergence Report**

- Stop reason: maxIterationsReached
- Total iterations: 3
- Questions answered: 5 / 5
- Remaining questions: tokenizer identity, frozen advisor corpus/evaluator, and official Devin/Hermes loader documentation
- Convergence threshold: 0.05
- Divergence summary: no divergent pivots, failures, overrides, saturated directions, or remaining frontier recorded
