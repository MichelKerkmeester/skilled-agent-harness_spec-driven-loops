# Iteration 007 — shared/ + backend boundary as a pattern element

- **Model**: gpt-5.5-fast xhigh (cli-opencode, read-only)
- **Seat**: 007
- **model_pick**: A

## Analysis

**Recommendation**
Pick **A) ONE-IDENTITY + REGISTRY-DRIVEN**.

Keep `deep-loop-workflows` as the only advisor-discoverable skill, and make the advisor derive mode projection from `.opencode/skills/deep-loop-workflows/mode-registry.json` instead of duplicating the mode map in Python and TypeScript. This is the smallest change that closes drift while preserving the B5 one-identity keystone and current parity fixture shape.

**Evidence**
The one-identity model is already the documented and implemented shape. The hub declares `name: deep-loop-workflows` and says it routes through `mode-registry.json` with no per-mode logic at `.opencode/skills/deep-loop-workflows/SKILL.md:2` and `.opencode/skills/deep-loop-workflows/SKILL.md:12`. The only discoverable graph metadata under the parent tree is the hub file, and it has `skill_id: deep-loop-workflows` plus `family: deep-loop` at `.opencode/skills/deep-loop-workflows/graph-metadata.json:4` and `.opencode/skills/deep-loop-workflows/graph-metadata.json:5`.

The registry already contains the complete three-tier discriminator. It defines `workflowMode`, `runtimeLoopType`, and `backendKind` at `.opencode/skills/deep-loop-workflows/mode-registry.json:5` through `.opencode/skills/deep-loop-workflows/mode-registry.json:9`, and lists all eight public workflow modes at `.opencode/skills/deep-loop-workflows/mode-registry.json:10` through `.opencode/skills/deep-loop-workflows/mode-registry.json:97`.

The drift gap is real. The registry says routers read it and do not re-derive the mapping at `.opencode/skills/deep-loop-workflows/mode-registry.json:4`, and the hub repeats that claim at `.opencode/skills/deep-loop-workflows/SKILL.md:36`. But Python hardcodes `MERGED_DEEP_SKILL_ID` and `DEEP_ROUTING_MODE_BY_KEY` at `.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py:2319` through `.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py:2324`, then uses that hardcoded table to emit the payload at `.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py:2527` through `.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py:2533`. TypeScript also hardcodes `MERGED_DEEP_SKILL_ID` and `DEEP_MODE_BY_CANONICAL` at `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/aliases.ts:90` through `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/aliases.ts:101`.

Do not pick B. Advisor discovery recursively indexes every `graph-metadata.json` under a skill dir at `.opencode/skills/system-skill-advisor/mcp_server/lib/skill-graph/skill-graph-db.ts:601` through `.opencode/skills/system-skill-advisor/mcp_server/lib/skill-graph/skill-graph-db.ts:625`, and parsed metadata throws if `skill_id` does not equal the immediate folder basename at `.opencode/skills/system-skill-advisor/mcp_server/lib/skill-graph/skill-graph-db.ts:654` through `.opencode/skills/system-skill-advisor/mcp_server/lib/skill-graph/skill-graph-db.ts:657`. Adding mode-level graph metadata would make the advisor see separate skills or fail on naming mismatches. Existing parity tests explicitly assert `{ skill: deep-loop-workflows, mode }`, for example `.opencode/skills/system-skill-advisor/mcp_server/tests/routing-parity-deep-skills.vitest.ts:62` through `.opencode/skills/system-skill-advisor/mcp_server/tests/routing-parity-deep-skills.vitest.ts:64`.

**Registry-Driven Shape**
Implement a small registry reader in advisor code and derive only the projection layer from it.

For Python:
Read `mode-registry.json`; set `MERGED_DEEP_SKILL_ID` from `registry.skill`; build `legacyKey -> workflowMode` by matching each mode’s `agent`, `packet`, `command`, and `aliases`. Keep the existing lexical and structural scoring patterns for now, because those are scoring heuristics, not identity projection. Replace only `DEEP_ROUTING_MODE_BY_KEY`.

For TypeScript:
Load the same registry and build `DEEP_MODE_BY_CANONICAL` from the registry’s `agent`, `packet`, `command`, and `aliases`, while keeping `RAW_ALIAS_GROUPS` as the legacy command alias list. This preserves `canonicalSkillId` behavior while making `modeForAlias` registry-backed.

For tests:
Keep current parity tests unchanged for research, review, and council because they assert the right public contract at `.opencode/skills/system-skill-advisor/mcp_server/tests/routing-parity-deep-skills.vitest.ts:27` through `.opencode/skills/system-skill-advisor/mcp_server/tests/routing-parity-deep-skills.vitest.ts:35`. Add a registry-parity test that fails if Python and TypeScript projections differ from `mode-registry.json`, and add coverage for `context`, `agent-improvement`, `model-benchmark`, `skill-benchmark`, and `ai-system-improvement`.

**Naming And Discovery**
Standardize this convention:

The parent folder name, parent `SKILL.md` name, and parent `graph-metadata.json.skill_id` must match. That is true here at `.opencode/skills/deep-loop-workflows/SKILL.md:2` and `.opencode/skills/deep-loop-workflows/graph-metadata.json:4`.

Nested packet folder names must match `mode-registry.json[].packet`, not necessarily `SKILL.md name`. The accepted `ai-council` mismatch is safe if the registry is the contract: `packet: ai-council` is at `.opencode/skills/deep-loop-workflows/mode-registry.json:45`, while the nested packet’s `SKILL.md` declares `name: deep-ai-council` at `.opencode/skills/deep-loop-workflows/ai-council/SKILL.md:2`.

Nested packets and `shared/` must not contain `graph-metadata.json`. The hub states this rule at `.opencode/skills/deep-loop-workflows/SKILL.md:80` and `.opencode/skills/deep-loop-workflows/SKILL.md:86`.

**Per-Mode Contracts**
The merge preserved per-mode contracts, and the standard should require this. The hub says per-mode behavior is not flattened at `.opencode/skills/deep-loop-workflows/SKILL.md:52`. The nested packets still carry their own tool and behavior contracts: deep-research allows `WebFetch` and memory tools at `.opencode/skills/deep-loop-workflows/deep-research/SKILL.md:4`; deep-review is code-audit oriented and lacks `WebFetch` at `.opencode/skills/deep-loop-workflows/deep-review/SKILL.md:4`; deep-improvement defines four lanes at `.opencode/skills/deep-loop-workflows/deep-improvement/SKILL.md:30` through `.opencode/skills/deep-loop-workflows/deep-improvement/SKILL.md:41`.

**Shared/ And Backend Boundary**
Confirmed: `shared/synthesis/resource-map.cjs` re-exports the resource-map renderer from `system-spec-kit`, and its comment explicitly says this is workflow output rendering, not runtime backend plumbing, so it belongs in non-discoverable `shared/` rather than `deep-loop-runtime` at `.opencode/skills/deep-loop-workflows/shared/synthesis/resource-map.cjs:4` through `.opencode/skills/deep-loop-workflows/shared/synthesis/resource-map.cjs:9`. The actual require points to `system-spec-kit/scripts/resource-map/extract-from-evidence.cjs` at `.opencode/skills/deep-loop-workflows/shared/synthesis/resource-map.cjs:16` through `.opencode/skills/deep-loop-workflows/shared/synthesis/resource-map.cjs:19`.

The reducers consume both layers separately: workflow synthesis comes from parent `shared/`, and backend artifact-root resolution comes from `deep-loop-runtime`, as shown in `.opencode/skills/deep-loop-workflows/deep-research/scripts/reduce-state.cjs:14` through `.opencode/skills/deep-loop-workflows/deep-research/scripts/reduce-state.cjs:15` and `.opencode/skills/deep-loop-workflows/deep-review/scripts/reduce-state.cjs:13` through `.opencode/skills/deep-loop-workflows/deep-review/scripts/reduce-state.cjs:14`.

Rule to standardize:
Put cross-mode workflow helpers in parent `shared/` when they render, adapt, or synthesize mode artifacts and are not generic runtime primitives. Put primitives in `deep-loop-runtime` only when they are reusable backend contracts such as state, locks, coverage graph, scoring, fan-out, lifecycle, or capability resolution, and they carry no public routing or workflow-output semantics. The runtime feature catalog already states that resource-map emission stays in workflow shared-synthesis, not runtime, at `.opencode/skills/deep-loop-runtime/feature_catalog/feature_catalog.md:32`.

MCP-free is verified: runtime README says invoke through imports or `.cjs` scripts with “No MCP tools, no slash commands” at `.opencode/skills/deep-loop-runtime/README.md:27`, and the FAQ says every runtime call goes through direct `.cjs` or TypeScript import at `.opencode/skills/deep-loop-runtime/README.md:164` through `.opencode/skills/deep-loop-runtime/README.md:166`. But I could not verify “NO system-spec-kit dependency” as written. Current runtime graph metadata declares a `system-spec-kit` dependency at `.opencode/skills/deep-loop-runtime/graph-metadata.json:11` through `.opencode/skills/deep-loop-runtime/graph-metadata.json:13`, and integration docs say production imports still depend on `system-spec-kit` local dependencies at `.opencode/skills/deep-loop-runtime/references/integration_points.md:102` through `.opencode/skills/deep-loop-runtime/references/integration_points.md:107`.

**Standardize**
Add an sk-doc parent-skill definition: one discoverable parent identity, declarative `mode-registry.json`, no nested `graph-metadata.json`, packet-local contracts preserved, optional non-discoverable `shared/`, backend boundary rules.

Extend `/create:skill` or add `/create:parent-skill`. Current create workflow only supports `full-create`, `full-update`, `reference-only`, and `asset-only` at `.opencode/commands/create/assets/create_sk_skill_auto.yaml:33` through `.opencode/commands/create/assets/create_sk_skill_auto.yaml:37`, so parent-skill scaffolding needs a new operation/profile.

Add `/doctor parent-skill` or `/doctor:parent-skill`. The current doctor manifest is route-driven and tells maintainers to append routes in `_routes.yaml` at `.opencode/commands/doctor/_routes.yaml:9` through `.opencode/commands/doctor/_routes.yaml:23`; it currently has deep-loop and skill-advisor routes but no parent-skill route in `.opencode/commands/doctor/_routes.yaml:101` through `.opencode/commands/doctor/_routes.yaml:140`.

Add a routing/discovery benchmark: assert exactly one discoverable graph metadata for the parent, registry-to-advisor projection parity in Python and TS, current routing parity fixtures still green, mode aliases route to expected `{ skill, mode }`, and registry parse overhead is cached.

===RESEARCH-JSON===
{"angle":"shared-backend-boundary","recommendation":"Pick A: keep one advisor identity and make Python/TypeScript advisor mode projection read mode-registry.json, while keeping nested packet contracts and non-discoverable shared/ helpers intact.","model_pick":"A","key_findings":[{"claim":"deep-loop-workflows already implements one public advisor identity with a registry-described mode layer.","evidence":".opencode/skills/deep-loop-workflows/graph-metadata.json:4","confidence":"high"},{"claim":"The drift gap is real because Python and TypeScript hardcode mode projection instead of consuming the registry.","evidence":".opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py:2320","confidence":"high"},{"claim":"Discoverable-nested graph metadata would either expose multiple skills or hit the skill_id==folder invariant.","evidence":".opencode/skills/system-skill-advisor/mcp_server/lib/skill-graph/skill-graph-db.ts:654","confidence":"high"},{"claim":"shared/synthesis/resource-map.cjs is explicitly workflow output rendering, non-discoverable shared code, and re-exports from system-spec-kit.","evidence":".opencode/skills/deep-loop-workflows/shared/synthesis/resource-map.cjs:4","confidence":"high"},{"claim":"deep-loop-runtime is MCP-free, but current files do not support a strict no-system-spec-kit-dependency claim.","evidence":".opencode/skills/deep-loop-runtime/references/integration_points.md:102","confidence":"high"}],"risks":["Registry-driven projection can silently diverge unless Python and TypeScript share parity tests.","Existing parity fixtures only cover research, review, and ai-council, not context or the four improvement modes.","The stated no-system-spec-kit dependency conflicts with current runtime graph metadata and integration docs."],"standardize":["sk-doc parent-skill definition","/create:parent-skill scaffolder or parent-skill operation in /create:skill","/doctor parent-skill validator route","routing/discovery benchmark covering one-identity discovery plus registry projection parity","shared/ boundary rule for workflow rendering helpers versus backend runtime primitives"],"open_questions":["Should the runtime be made truly system-spec-kit-free, or is the documented dependency seam acceptable?","Should mode-registry.json gain an explicit advisorRouting block, or should projection derive from existing agent/packet/command/aliases fields?"]}
===END===

## Structured output

```json
{
  "angle": "shared-backend-boundary",
  "recommendation": "Pick A: keep one advisor identity and make Python/TypeScript advisor mode projection read mode-registry.json, while keeping nested packet contracts and non-discoverable shared/ helpers intact.",
  "model_pick": "A",
  "key_findings": [
    {
      "claim": "deep-loop-workflows already implements one public advisor identity with a registry-described mode layer.",
      "evidence": ".opencode/skills/deep-loop-workflows/graph-metadata.json:4",
      "confidence": "high"
    },
    {
      "claim": "The drift gap is real because Python and TypeScript hardcode mode projection instead of consuming the registry.",
      "evidence": ".opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py:2320",
      "confidence": "high"
    },
    {
      "claim": "Discoverable-nested graph metadata would either expose multiple skills or hit the skill_id==folder invariant.",
      "evidence": ".opencode/skills/system-skill-advisor/mcp_server/lib/skill-graph/skill-graph-db.ts:654",
      "confidence": "high"
    },
    {
      "claim": "shared/synthesis/resource-map.cjs is explicitly workflow output rendering, non-discoverable shared code, and re-exports from system-spec-kit.",
      "evidence": ".opencode/skills/deep-loop-workflows/shared/synthesis/resource-map.cjs:4",
      "confidence": "high"
    },
    {
      "claim": "deep-loop-runtime is MCP-free, but current files do not support a strict no-system-spec-kit-dependency claim.",
      "evidence": ".opencode/skills/deep-loop-runtime/references/integration_points.md:102",
      "confidence": "high"
    }
  ],
  "risks": [
    "Registry-driven projection can silently diverge unless Python and TypeScript share parity tests.",
    "Existing parity fixtures only cover research, review, and ai-council, not context or the four improvement modes.",
    "The stated no-system-spec-kit dependency conflicts with current runtime graph metadata and integration docs."
  ],
  "standardize": [
    "sk-doc parent-skill definition",
    "/create:parent-skill scaffolder or parent-skill operation in /create:skill",
    "/doctor parent-skill validator route",
    "routing/discovery benchmark covering one-identity discovery plus registry projection parity",
    "shared/ boundary rule for workflow rendering helpers versus backend runtime primitives"
  ],
  "open_questions": [
    "Should the runtime be made truly system-spec-kit-free, or is the documented dependency seam acceptable?",
    "Should mode-registry.json gain an explicit advisorRouting block, or should projection derive from existing agent/packet/command/aliases fields?"
  ]
}
```
