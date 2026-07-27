# Iteration 5: Canonical Contract, Automation Ownership, and Fleet Gate

## Focus
Specify where the eight-file root-metadata contract belongs inside `sk-doc/create-skill`, distinguish authored/scaffolded/generated/backfillable ownership, and design a fleet-wide presence-plus-freshness gate that detects missing manifests instead of inspecting only committed ones.

## Actions Taken
1. Reused iterations 1-4's census, schemas, consumers, and two-class taxonomy rather than repeating blocked broad searches.
2. Read the current `create-skill` core workflow, reference map, standalone workflow, and parent-hub companion policy to locate exact documentation anchors.
3. Read `init_skill.py`, `validate_skill_package.py`, the leaf generator, and the current fleet freshness script to separate existing capabilities from proposed extensions.
4. Read doctor, benchmark replay, command validation, and unit-test anchors to place enforcement and regression coverage.

## Canonical Documentation Placement
The human canonical contract should be a new shared reference, `.opencode/skills/sk-doc/create-skill/references/shared/skill-root-metadata-contract.md`, because it governs both standalone and parent roots. Add it to `references/README.md` **§2 REFERENCE MAP**, then link it from `create-skill/SKILL.md` **§3 HOW IT WORKS** immediately before both **Required Standalone Skill Shape** and **Parent Hub Creation Workflow**. Those are the existing normative shape anchors, but the standalone shape currently omits all root JSON metadata and the parent workflow names only the five hub-core files. [SOURCE: .opencode/skills/sk-doc/create-skill/references/README.md:37-50] [SOURCE: .opencode/skills/sk-doc/create-skill/SKILL.md:200-218] [SOURCE: .opencode/skills/sk-doc/create-skill/SKILL.md:240-269]

The new reference should own: the H/S classifier, the eight-file matrix, overlay rules, authored-versus-derived ownership, forbidden combinations, schema owners, regeneration commands, and the fleet-gate algorithm. `parent-skills-nested-packets.md` **§7 Companion file policy** should become a parent-only projection of that shared contract, not a second authority. Its current statement that command metadata is an “advisor-facing” optional hub surface with a pending drift guard conflicts with the executable evidence: the only multi-hub reader is a fixed four-hub test, while production validation is rooted in `sk-design`. [SOURCE: .opencode/skills/sk-doc/create-skill/references/parent-skill/parent-skills-nested-packets.md:225-231] [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/tests/command-binding-existence.vitest.ts:44-64] [SOURCE: .opencode/skills/sk-design/shared/scripts/design-command-surface-check.mjs:121-180]

A new executable companion, `.opencode/skills/sk-doc/create-skill/scripts/lib/skill-root-metadata-contract.cjs`, is required to keep the class matrix and discovery predicates out of prose and out of the CI wrapper. It should export the eight filenames, H/S requirements, forbidden combinations, and overlay validators; the Markdown reference explains this library rather than duplicating its literal tables. This follows the existing split where `generate-leaf-manifest.cjs` owns filesystem reads/writes and `leaf-resource-contract.cjs` owns pure normalization/canonical bytes. [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/generate-leaf-manifest.cjs:26-28] [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/generate-leaf-manifest.cjs:173-218] [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/tests/leaf-resource-contract.test.cjs:140-177]

## Automation Matrix

| File type | Contract role | Existing/new automation and safe backfill rule |
|---|---|---|
| `description.json` | H-only scaffold, then authored | Existing `init_skill.py --kind parent` writes it. The fleet gate validates required fields and forbids registry-owned duplicates; no unattended backfill is safe because description/keywords are semantic. A future assisted backfill may emit a review-required draft only. [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/init_skill.py:513-526] [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/init_skill.py:551-553] [SOURCE: .opencode/commands/doctor/scripts/parent-skill-check.cjs:1020-1045] |
| `graph-metadata.json` | Universal scaffold, then authored identity/scoring input | Existing parent initialization writes a skeleton, but standalone initialization currently creates `SKILL.md` plus playbook/benchmark trees and no graph file. Extend `init_skill.py` to scaffold graph metadata for new standalone roots; existing roots need author-reviewed domains, intent signals, and edges, so no blind backfill. [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/init_skill.py:231-289] [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/init_skill.py:469-512] [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/init_skill.py:548-550] |
| `mode-registry.json` | H-only scaffold, then authored source of truth | Existing parent initialization scaffolds it. Do not infer/backfill it from directories because packet kind, aliases, tools, and extensions are declared semantics. [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/init_skill.py:542-544] [SOURCE: .opencode/skills/sk-doc/create-skill/references/parent-skill/parent-skills-nested-packets.md:94-115] |
| `hub-router.json` | H-only scaffold, then authored routing policy | Existing parent initialization scaffolds it. It is not safely backfillable from registry modes because default, tie-break, signals, bundles, vocabulary classes, and resources are policy. [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/init_skill.py:545-547] [SOURCE: .opencode/skills/sk-doc/create-skill/references/parent-skill/parent-skills-nested-packets.md:117-126] |
| `leaf-manifest.config.json` | S-only authored generator input | The existing generator validates and reads it but does not create it. Extend standalone initialization with explicit `workflowMode`, packet, and leaf-root inputs; existing roots may be backfilled only from those operator-declared values, never inferred silently. [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/generate-leaf-manifest.cjs:95-127] [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/init_skill.py:231-289] |
| `leaf-aliases.json` | Authored compatibility/policy overlay; required for current S routers, optional for H | Existing generation treats absence as zero aliases and validates a present file, but does not author it. No generic backfill is safe because aliases assign workflow ownership to legacy/shared paths. [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/generate-leaf-manifest.cjs:50-68] [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/lib/leaf-resource-contract.cjs:242-299] |
| `leaf-manifest.json` | Deterministically generated, safely backfillable | Existing `generate-leaf-manifest.cjs --write <skillDir>` is the sole safe writer; `--check` performs byte comparison. It derives H from registry plus optional aliases and S from standalone config. [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/generate-leaf-manifest.cjs:173-218] [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/generate-leaf-manifest.cjs:222-240] |
| `command-metadata.json` | Authored `sk-design`-specific overlay, not a class requirement | Keep authored and validated by the design command-surface check. There is no fleet generator or safe generic backfill; broader use first requires a real shared schema/consumer rather than copying the singleton. [SOURCE: .opencode/skills/sk-design/shared/scripts/design-command-surface-check.mjs:121-180] [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/tests/command-binding-existence.vitest.ts:44-64] |

## Fleet Gate Algorithm
1. Enumerate direct child directories of `.opencode/skills/`; a candidate root must have root `SKILL.md`. Reject metadata-bearing direct children without `SKILL.md` and never recurse to classify nested packets. [INFERENCE: this preserves the direct-child scope used by the exact census at research/lineages/sol-high-fast/iterations/iteration-001.md:13-28]
2. Require one root `graph-metadata.json`, reject nested `graph-metadata.json` and `description.json`, and apply the skill-identity discriminator so same-named `.opencode/specs/` continuity files never enter this gate. Doctor already enforces root/nested identity for hubs; the fleet wrapper must apply the same invariant to every class. [SOURCE: .opencode/commands/doctor/scripts/parent-skill-check.cjs:252-313] [SOURCE: research/lineages/sol-high-fast/iterations/iteration-002.md:13-14]
3. Classify **H** only when both `mode-registry.json` and `hub-router.json` exist; classify **S** when neither exists. Exactly one of the pair is an unclassified/partial root and fails. This classifies `sk-git` as S before checking presence, so its missing config/aliases/manifest cannot disappear from discovery. [INFERENCE: applying the two-class behavior model at research/lineages/sol-high-fast/iterations/iteration-004.md:13-15 to the direct-child discovery rule]
4. Enforce presence and forbidden combinations: H requires graph, description, registry, router, and generated manifest and forbids standalone config; S requires graph, standalone config, generated manifest, and aliases and forbids hub registry/router/description and command metadata. H aliases are optional authored overlays; command metadata is allowed only for the documented `sk-design` exception until a shared command extension actually ships. [SOURCE: research/lineages/sol-high-fast/iterations/iteration-004.md:37-45]
5. Parse every present file and dispatch to its schema owner: graph identity parser; doctor hub checks for description/registry/router; generator parsing for standalone config/aliases; leaf-resource contract for manifest shape/canonicalization; design command validator for the singleton overlay. Unknown root JSON metadata among the eight-contract namespace, malformed overlays, or schema-owner absence fails closed. [SOURCE: research/lineages/sol-high-fast/iterations/iteration-002.md:13-17] [SOURCE: research/lineages/sol-high-fast/iterations/iteration-003.md:14-18]
6. For every classified root that requires a manifest, call `buildManifestBytes` even when the committed manifest is absent. Missing output fails presence; present output is byte-compared to regeneration. `--fix` may write only `leaf-manifest.json`; it must never synthesize authored inputs. [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/generate-leaf-manifest.cjs:173-218] [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/ci-leaf-manifest-freshness.cjs:74-91]
7. Emit stable JSON with discovered/classified/unclassified roots, per-file status, forbidden extras, schema failures, and stale/missing derived files; exit nonzero for any unclassified root, missing requirement, forbidden file, nested identity, malformed schema, regeneration error, or byte drift. [INFERENCE: combines the current fleet JSON result shape at .opencode/skills/sk-doc/create-skill/scripts/ci-leaf-manifest-freshness.cjs:98-132 with class-first discovery]

## Integration and Test Plan
- **Doctor:** add a fleet entry point that imports `skill-root-metadata-contract.cjs`, then delegates H detail to `parent-skill-check.cjs`; refactor doctor guard 10 from manifest-presence opt-in to class-required generation. Today guard 10 is silent when the file is missing, so it cannot enforce H/S presence. [SOURCE: .opencode/commands/doctor/scripts/parent-skill-check.cjs:1063-1081]
- **CI:** replace or extend `ci-leaf-manifest-freshness.cjs` with class-first root discovery. Its current `findManifestDirs` recursively starts from files named `leaf-manifest.json`, so missing outputs and unclassified roots are invisible. No `package.json` script currently wires this exact gate, so the CI integration must explicitly invoke the new fleet command rather than assume existing package wiring. [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/ci-leaf-manifest-freshness.cjs:54-71] [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/README.md:28-38] [INFERENCE: targeted `package.json` search for `ci-leaf-manifest-freshness` returned no matches]
- **Package validation:** make `validate_skill_package.py` use the shared classifier. It currently declares “parent” solely from `mode-registry.json` presence and runs doctor only for that branch, which misclassifies a half-authored hub and leaves standalone metadata outside the structural gate. [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/validate_skill_package.py:200-247]
- **Benchmark:** run the fleet/class gate as a D5 preflight before router replay; replay currently no-ops when a manifest is absent, exactly the behavior that lets a defective S root avoid typed-resource checks. [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs:204-238] [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/run-skill-benchmark.cjs:479-519]
- **Tests:** add table-driven fixtures for all 12 roots/classes; missing S manifest/config/aliases; missing H description/router; XOR hub pair; stale bytes; malformed each file type; forbidden H config/S hub files; nested identities; unknown direct-child root; and command-overlay misuse. Retain current deterministic-byte and doctor guard-chain tests as lower-level coverage. [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/tests/leaf-resource-contract.test.cjs:140-177] [SOURCE: .opencode/commands/doctor/scripts/tests/parent-skill-check-leaf-manifest.test.cjs:175-272]

## Findings
1. The canonical prose belongs in a new shared create-skill reference, with links from both existing shape sections; a pure executable companion is needed so doctor, CI, packaging, and benchmarks share one class matrix instead of reimplementing it. [SOURCE: .opencode/skills/sk-doc/create-skill/references/README.md:37-50] [SOURCE: .opencode/skills/sk-doc/create-skill/SKILL.md:200-218] [SOURCE: .opencode/skills/sk-doc/create-skill/SKILL.md:240-269]
2. Of the eight files, only `leaf-manifest.json` is safely and deterministically backfillable by current automation; four H files are scaffolded then authored, config/aliases are authored inputs, and command metadata is an authored local extension. [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/init_skill.py:537-553] [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/generate-leaf-manifest.cjs:173-240]
3. A class-first gate closes the missing-manifest hole by discovering roots before outputs, classifying H from the complete registry/router pair and S from its absence, and invoking regeneration for every class-required manifest. [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/ci-leaf-manifest-freshness.cjs:54-91] [INFERENCE: class rules from research/lineages/sol-high-fast/iterations/iteration-004.md:13-15]
4. Current doctor, package validation, freshness CI, and benchmark replay all have presence-driven opt-ins that must be replaced or fronted by the shared classifier; otherwise missing or partial metadata remains invisible. [SOURCE: .opencode/commands/doctor/scripts/parent-skill-check.cjs:1063-1074] [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/validate_skill_package.py:200-247] [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs:204-238]
5. The canonical parent documentation overstates command metadata's fleet/advisor role; the contract should preserve it as a validated `sk-design` exception until a shared extension and production consumer exist. [SOURCE: .opencode/skills/sk-doc/create-skill/references/parent-skill/parent-skills-nested-packets.md:225-231] [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/tests/command-binding-existence.vitest.ts:44-64] [SOURCE: .opencode/skills/sk-design/shared/scripts/design-command-surface-check.mjs:121-180]

## Ruled Out
- Extending the current manifest-first scanner alone: it cannot see a required output that does not exist. [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/ci-leaf-manifest-freshness.cjs:54-71]
- Treating all eight files as generated: aliases, registries, routers, graph intent, and command policy contain authored semantics. [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/generate-leaf-manifest.cjs:50-68] [SOURCE: .opencode/skills/sk-doc/create-skill/references/parent-skill/parent-skills-nested-packets.md:94-126]
- Creating a third sparse class for `sk-git`: class-first discovery makes it a failing S root and exposes the three missing files. [SOURCE: research/lineages/sol-high-fast/iterations/iteration-004.md:15-15]

## Dead Ends
- Inferring H/S from `graph-metadata.json.family` is not reliable: live families describe domains (`cli`, `mcp`, `sk-hub`, `system`, and others), not the H/S file contract. [INFERENCE: bounded `jq` inventory of `.opencode/skills/*/graph-metadata.json` in this iteration]
- A generic command-metadata backfill remains unjustified because there is no fleet production consumer or shared schema to generate toward. [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/tests/command-binding-existence.vitest.ts:44-64] [SOURCE: .opencode/skills/sk-design/shared/scripts/design-command-surface-check.mjs:121-180]

## Edge Cases
- Ambiguous input: “new artifact role” was interpreted narrowly as one shared human reference plus one executable contract library, not a ninth metadata file copied into every skill root.
- Contradictory evidence: parent doctrine calls command metadata advisor-facing/pending-fleet, while executable evidence is test-only across hubs and production-local to `sk-design`; the executable behavior governs the recommendation.
- Missing dependencies: no repository workflow file or package-script wiring for the current fleet freshness command was located; integration is therefore a required explicit addition, not claimed as existing.
- Partial success: none; the recommendation is complete, but it is research only and does not prove an implementation.

## Sources Consulted
- `.opencode/skills/sk-doc/create-skill/SKILL.md:70-79,200-218,240-269,304-325`
- `.opencode/skills/sk-doc/create-skill/references/README.md:37-50`
- `.opencode/skills/sk-doc/create-skill/references/parent-skill/parent-skills-nested-packets.md:21-58,94-137,225-231`
- `.opencode/skills/sk-doc/create-skill/scripts/init_skill.py:231-289,469-553`
- `.opencode/skills/sk-doc/create-skill/scripts/generate-leaf-manifest.cjs:46-240`
- `.opencode/skills/sk-doc/create-skill/scripts/ci-leaf-manifest-freshness.cjs:54-143`
- `.opencode/skills/sk-doc/create-skill/scripts/validate_skill_package.py:200-271`
- `.opencode/commands/doctor/scripts/parent-skill-check.cjs:252-321,1020-1233`
- `.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs:180-299`
- `.opencode/skills/sk-doc/create-skill/scripts/tests/leaf-resource-contract.test.cjs:140-220`
- `.opencode/commands/doctor/scripts/tests/parent-skill-check-leaf-manifest.test.cjs:175-272`
- `.opencode/skills/system-skill-advisor/mcp-server/tests/command-binding-existence.vitest.ts:44-64`
- `.opencode/skills/sk-design/shared/scripts/design-command-surface-check.mjs:121-180`
- `research/lineages/sol-high-fast/iterations/iteration-001.md:13-34`
- `research/lineages/sol-high-fast/iterations/iteration-002.md:13-17`
- `research/lineages/sol-high-fast/iterations/iteration-003.md:14-18`
- `research/lineages/sol-high-fast/iterations/iteration-004.md:13-45`

## Assessment
- New information ratio: 0.90
- Novelty calculation: 3 findings are fully new and 2 are partially new: `(3 + 0.5 × 2) / 5 = 0.80`; closing both remaining canonical questions with one class-first enforcement model adds the `0.10` simplicity bonus.
- Questions addressed: canonical contract placement; all eight automation/backfill owners; fleet discovery/classification/presence/schema/freshness enforcement; doctor/CI/benchmark/test integration; exact exceptional-case closure.
- Questions answered: both remaining key questions.

## Reflection
- What worked and why: starting from the reducer's two-class model made missing-output discovery the first gate step, while focused reads of the authoring and enforcement surfaces exposed exactly where current presence-driven opt-ins fail.
- What did not work and why: broad integration searches overflowed on historical packet records; narrower package-script and executable-owner searches established the relevant negative evidence without repeating the blocked repository-wide approach.
- What I would do differently: in implementation, begin with table-driven classifier fixtures before moving any existing validator, so class and forbidden-file semantics are frozen before integration.

## Questions Answered
1. How should the five graph-only skills, `leaf-aliases.json`, `command-metadata.json`, and sparse `sk-git` be classified after behavior-impact checks?
2. Where should the canonical contract live in `sk-doc/create-skill`, what can be generated/backfilled, and what fleet-wide presence-plus-freshness gate should enforce it?

## Questions Remaining
- No key research questions remain. Implementation still must prove the proposed classifier and gate against all 12 live roots and negative fixtures.

## Recommended Next Focus
Reducer synthesis and implementation planning: freeze the shared H/S contract with table-driven fixtures, then add class-first discovery before integrating doctor, package validation, CI, and benchmark D5.

## Provenance
- Iteration/run: 5/5
- Mode: research
- Route proof: `Resolved route: mode=research; target_agent=@deep-research; execution=single_iteration; state_source=externalized_files; do_not_switch_mode=true`
- Executor: `cli-opencode`
- Model: `openai/gpt-5.6-sol-fast`
- Reasoning effort: `high`
