# Iteration 4: Consumer-Derived Skill Classes and Exceptional Cases

## Focus
Derive the smallest consumer-based taxonomy for all 12 roots and resolve graph-without-description, aliases, command metadata, and sparse `sk-git` without defining classes from current presence alone.

## Actions Taken
1. Reused iterations 1-3's exact census and consumer anchors rather than repeating blocked broad searches.
2. Read hub doctor checks and advisor graph ingestion to separate documentation identity from scoring identity.
3. Read standalone manifest generation/freshness and `sk-git`'s router/corpus to test sparse-class legitimacy.
4. Read alias dual-resolution/replay and compared registry command bindings with the design-local command validator.

## Findings
1. **Two classes explain all 12 roots; no sparse third class is needed.** Class H is a packet hub (seven roots); Class S is a registry-less single-mode skill with routed leaves (five roots, including `sk-git`). Graph metadata is universal because advisor nodes and scoring fields come from skill-shaped graph files; standalone config is the one-mode substitute for a registry. [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/lib/skill-graph/skill-graph-db.ts:753-828] [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/lib/skill-graph/skill-graph-db.ts:946-970] [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/generate-leaf-manifest.cjs:95-127] [INFERENCE: these behavior rules reconcile the census at research/lineages/sol-high-fast/iterations/iteration-001.md:15-28]
2. **Class H requires `SKILL.md`, graph, description, registry, and router; all seven current hubs also require their generated manifest because they adopted typed leaf routing.** Doctor explicitly requires hub description, but production advisor ingestion reads graph metadata—not root description. Adding description to Class S therefore cannot directly change current advisor scoring/routing. [SOURCE: .opencode/commands/doctor/scripts/parent-skill-check.cjs:252-321] [SOURCE: .opencode/commands/doctor/scripts/parent-skill-check.cjs:1020-1045] [SOURCE: .opencode/commands/doctor/scripts/parent-skill-check.cjs:1063-1074] [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/lib/skill-graph/skill-graph-db.ts:1037-1099] [INFERENCE: exact production search under `.opencode/skills/system-skill-advisor/mcp-server` found no `description.json` reader]
3. **Class S requires `SKILL.md`, graph, standalone config, generated manifest, and aliases when raw strings need the absent workflow mode—which all five current resource routers do.** The four configured roots state the one-mode contract. `sk-git` has the same `RESOURCE_MAP` pattern and routed references/assets/package corpus but lacks config, manifest, and aliases; the freshness gate misses this because it discovers only committed manifests. Thus `sk-git` is the most non-conforming Class S root, not a legitimate sparse class; missing description is not its defect. [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/generate-leaf-manifest.cjs:95-147] [SOURCE: .opencode/skills/mcp-code-mode/leaf-manifest.config.json:1-8] [SOURCE: .opencode/skills/system-code-graph/leaf-manifest.config.json:1-8] [SOURCE: .opencode/skills/system-skill-advisor/leaf-manifest.config.json:1-8] [SOURCE: .opencode/skills/system-spec-kit/leaf-manifest.config.json:1-8] [SOURCE: .opencode/skills/sk-git/SKILL.md:42-95] [SOURCE: .opencode/skills/sk-git/graph-metadata.json:143-152] [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/ci-leaf-manifest-freshness.cjs:54-71]
4. **Aliases stay authored as a capability overlay.** The resolver refuses to infer shared ownership and accepts legacy/shared paths only through explicit `{workflowMode, leafResourceId, diskPath}` rows. Hubs resolve packet-qualified strings from registries, so `sk-doc` needs aliases only for relocated shared resources; registry-less Class S roots need same-path rows to attach a workflow mode to untyped replay input. This policy mapping is not safe generated inventory. [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/lib/leaf-resource-contract.cjs:242-299] [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs:204-260] [SOURCE: .opencode/skills/sk-doc/leaf-aliases.json:1-31] [SOURCE: .opencode/skills/mcp-code-mode/leaf-aliases.json:1-36]
5. **`command-metadata.json` remains an authored `sk-design` extension; command ownership is not a class rule.** Generic hub commands already live in registries (`sk-doc`, `system-deep-loop`). The sole multi-hub reader treats command metadata as optional over a fixed four-hub list and excludes registry-less `system-spec-kit`; production validation is path-bound to `sk-design` interface semantics. Generalization would require a new schema/consumer, not copying the singleton. [SOURCE: .opencode/skills/sk-doc/mode-registry.json:20-40] [SOURCE: .opencode/skills/sk-doc/mode-registry.json:67-76] [SOURCE: .opencode/skills/system-deep-loop/mode-registry.json:35-76] [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/tests/command-binding-existence.vitest.ts:44-64] [SOURCE: .opencode/skills/sk-design/shared/scripts/design-command-surface-check.mjs:121-179]

## 12-Root Class Mapping
Mapping is from behavior; presence is only a cross-check. [INFERENCE: Findings 1-5 applied to research/lineages/sol-high-fast/iterations/iteration-001.md:15-28]

| Root | Class | Mandatory current root set | Status / overlay |
|---|---|---|---|
| `cli-external-orchestration` | H | SKILL, graph, description, registry, router, manifest | Conforming |
| `mcp-code-mode` | S | SKILL, graph, config, manifest, aliases | Conforming; no description needed |
| `mcp-tooling` | H | SKILL, graph, description, registry, router, manifest | Conforming |
| `sk-code` | H | SKILL, graph, description, registry, router, manifest | Conforming |
| `sk-design` | H | SKILL, graph, description, registry, router, manifest | Design-only command overlay |
| `sk-doc` | H | SKILL, graph, description, registry, router, manifest | Authored shared-resource aliases |
| `sk-git` | S | SKILL, graph, config, manifest, aliases | **Defective:** last three missing |
| `sk-prompt` | H | SKILL, graph, description, registry, router, manifest | Conforming |
| `system-code-graph` | S | SKILL, graph, config, manifest, aliases | Conforming |
| `system-deep-loop` | H | SKILL, graph, description, registry, router, manifest | Registry-owned commands |
| `system-skill-advisor` | S | SKILL, graph, config, manifest, aliases | Conforming; graph drives scoring |
| `system-spec-kit` | S | SKILL, graph, config, manifest, aliases | Conforming; commands do not imply design overlay |

## Per-Class Mandatory File Sets
- **Universal:** `SKILL.md` + `graph-metadata.json`. [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/lib/skill-graph/skill-graph-db.ts:753-828]
- **H — packet hub:** universal + `description.json` + `mode-registry.json` + `hub-router.json`; generated `leaf-manifest.json` when typed leaves are adopted (all seven current hubs). Aliases are authored only for explicit legacy/shared mappings; command metadata is not a class file. [SOURCE: .opencode/commands/doctor/scripts/parent-skill-check.cjs:252-321] [SOURCE: .opencode/commands/doctor/scripts/parent-skill-check.cjs:1020-1074]
- **S — standalone routed resource:** universal + authored `leaf-manifest.config.json` + generated `leaf-manifest.json` + authored `leaf-aliases.json` for current untyped replay. Description, registry, router, and command metadata are not required. [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/generate-leaf-manifest.cjs:95-147] [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs:240-260]

## Defects
1. **“Five graph-only skills” is false.** Five roots have graph without description, but only `sk-git` has graph and none of the other seven JSON types. [SOURCE: research/lineages/sol-high-fast/iterations/iteration-001.md:23-28] [INFERENCE: comparison across all eight census columns]
2. `sk-git` lacks its three Class S leaf files despite routing a resource corpus; the current freshness gate cannot detect absent manifests. [SOURCE: .opencode/skills/sk-git/SKILL.md:42-95] [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/ci-leaf-manifest-freshness.cjs:54-71]
3. The command-binding test's “advisor-facing” label is terminology drift: no production advisor reader was found; behavior is optional test input plus design-local validation. [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/tests/command-binding-existence.vitest.ts:44-64] [SOURCE: .opencode/skills/sk-design/shared/scripts/design-command-surface-check.mjs:121-179]

## Ruled Out
- Standalone-description class: descriptions are enforced for hubs but absent from advisor scoring ingestion. [SOURCE: .opencode/commands/doctor/scripts/parent-skill-check.cjs:1020-1045] [INFERENCE: exact production advisor search found no reader]
- Legitimate sparse `sk-git` class: its router/corpus triggers the configured standalone contract. [SOURCE: .opencode/skills/sk-git/SKILL.md:42-95] [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/generate-leaf-manifest.cjs:95-147]
- Fleet command metadata based only on command ownership: registry commands are already generic, while the singleton validator is interface-specific. [SOURCE: .opencode/skills/sk-doc/mode-registry.json:20-40] [SOURCE: .opencode/skills/sk-design/shared/scripts/design-command-surface-check.mjs:121-179]

## Dead Ends
- Generating aliases from file presence would erase explicit workflow-mode/shared ownership policy. [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/lib/leaf-resource-contract.cjs:242-299]
- Running the current freshness gate cannot classify missing-manifest eligibility because it enumerates only existing manifests. [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/ci-leaf-manifest-freshness.cjs:54-71]

## Edge Cases
- Ambiguous input: “graph-only” is separated into literal eight-file presence versus graph-without-description.
- Contradictory evidence: the five-item phrase conflicts with the census; corrected to one literal graph-only and five graph-without-description roots.
- Missing dependencies: code graph remained empty; exact local reads/searches were used.
- Partial success: none; all 12 roots and disputed cases are resolved.

## Sources Consulted
- `iterations/iteration-001.md:15-34`, `iteration-002.md:12-17`, `iteration-003.md:13-18`
- `.opencode/commands/doctor/scripts/parent-skill-check.cjs:252-321,1020-1074`
- `.opencode/skills/system-skill-advisor/mcp-server/lib/skill-graph/skill-graph-db.ts:753-828,946-970,1037-1099`
- `.opencode/skills/sk-doc/create-skill/scripts/generate-leaf-manifest.cjs:95-208`
- `.opencode/skills/sk-doc/create-skill/scripts/ci-leaf-manifest-freshness.cjs:54-105`
- `.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs:204-294`
- `.opencode/skills/sk-doc/create-skill/scripts/lib/leaf-resource-contract.cjs:242-299`
- `.opencode/skills/sk-git/SKILL.md:42-95`, `graph-metadata.json:143-152`
- Standalone configs/aliases; `sk-doc` aliases; `sk-doc` and `system-deep-loop` registries
- Command binding test and `sk-design` command surface validator

## Assessment
- New information ratio: 0.80
- Novelty calculation: 2 fully new + 3 partially new findings: `(2 + 0.5 × 3) / 5 = 0.70`; resolving two open questions with one simpler model adds `0.10`.
- Questions addressed: 12-root taxonomy and every exceptional presence case.
- Questions answered: key questions 3 and 4.

## Reflection
- What worked and why: consumer obligations reduced eight presence columns to two classes plus narrow overlays, allowing the census to expose defects rather than define classes.
- What did not work and why: the freshness gate could not test missing-manifest eligibility because it discovers only committed manifests.
- What I would do differently: derive a declarative class/eligibility predicate before extending enforcement.

## Questions Answered
1. The 12 roots map to packet hubs or standalone routed-resource skills.
2. Five means graph-without-description; only `sk-git` is graph-only. Descriptions do not score standalone roots; aliases remain authored; command metadata stays design-specific; `sk-git` is defective.

## Questions Remaining
1. Where should the canonical two-class contract live, what can be generated/backfilled, and what presence-plus-freshness gate should enforce it?

## Recommended Next Focus
Specify the canonical two-class contract and a fleet gate that classifies every root before checking required presence and generated freshness, including missing-manifest detection.

## Provenance
- Iteration/run: 4/4
- Mode: research
- Route proof: `Resolved route: mode=research; target_agent=@deep-research; execution=single_iteration; state_source=externalized_files; do_not_switch_mode=true`
- Executor: `cli-opencode`
- Model: `openai/gpt-5.6-sol-fast`
- Reasoning effort: `high`
