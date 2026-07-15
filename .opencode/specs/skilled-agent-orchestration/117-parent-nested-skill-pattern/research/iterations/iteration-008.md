# Iteration 008 — /create:parent-skill scaffolder design

- **Model**: gpt-5.5-fast xhigh (cli-opencode, read-only)
- **Seat**: 008
- **model_pick**: A

## Analysis

**Recommendation**
Pick model A: keep one advisor identity and make only the mode projection/alias map registry-driven. Preserve the existing deep routing scorer and parity payload shape, but load `mode-registry.json` instead of duplicating `{legacy id -> workflowMode}` in Python and TypeScript.

**Key Findings**
- `deep-loop-workflows` already documents the intended one-identity, registry-driven architecture: hub `SKILL.md` says the hub has no per-mode logic and routes through `mode-registry.json` (`.opencode/skills/deep-loop-workflows/SKILL.md:12`, `.opencode/skills/deep-loop-workflows/SKILL.md:36`).
- The registry already has enough scaffolder-relevant shape: `skill`, discriminator docs, per-mode `workflowMode`, `runtimeLoopType`, `backendKind`, packet path, command, agent, artifact root, and aliases (`.opencode/skills/deep-loop-workflows/mode-registry.json:2`, `.opencode/skills/deep-loop-workflows/mode-registry.json:5`, `.opencode/skills/deep-loop-workflows/mode-registry.json:10`).
- The advisor still hardcodes the projection: Python has `MERGED_DEEP_SKILL_ID` plus `DEEP_ROUTING_MODE_BY_KEY` (`.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py:2319`, `.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py:2320`), and TypeScript has `MERGED_DEEP_SKILL_ID` plus `DEEP_MODE_BY_CANONICAL` (`.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/aliases.ts:90`, `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/aliases.ts:96`).
- Model B is structurally risky because skill graph discovery is recursive (`.opencode/skills/system-skill-advisor/mcp_server/lib/skill-graph/skill-graph-db.ts:601`) and every discovered skill metadata file must have `skill_id == basename(dirname(sourcePath))` (`.opencode/skills/system-skill-advisor/mcp_server/lib/skill-graph/skill-graph-db.ts:654`). That breaks the accepted `ai-council/` folder with `name: deep-ai-council` if it becomes independently discoverable.
- The parity tests are a hard compatibility target: they assert both `skill: deep-loop-workflows` and concrete mode, not just flat skill equality (`.opencode/skills/system-skill-advisor/mcp_server/tests/routing-parity-deep-skills.vitest.ts:5`, `.opencode/skills/system-skill-advisor/mcp_server/tests/routing-parity-deep-skills.vitest.ts:62`, `.opencode/skills/system-skill-advisor/mcp_server/tests/routing-parity-deep-council.vitest.ts:110`).

**Scaffolder Design**
- Add `/create:parent-skill` as a thin router, mirroring `/create:skill`: router Markdown names presentation, auto YAML, confirm YAML, then delegates behavior to YAML (`.opencode/commands/create/skill.md:7`, `.opencode/commands/create/skill.md:13`, `.opencode/commands/create/skill.md:21`).
- Add assets named `create_parent_skill_presentation.txt`, `create_parent_skill_auto.yaml`, and `create_parent_skill_confirm.yaml`, following the existing presentation/YAML ownership split (`.opencode/commands/create/skill.md:25`, `.opencode/commands/create/skill.md:36`, `.opencode/commands/deep/research.md:95`).
- Inputs should include `parent_skill_name`, `description`, `family`, `category`, `modes[]`, `shared_modules[]`, `graph_edges`, `execution_mode`, and spec linkage. Each mode should require `workflowMode`, `packet`, `packetSkillName`, `backendKind`, explicit `runtimeLoopType` string or null, `command`, `agent`, `artifactRoot`, and `aliases`.
- Generate exactly one hub `graph-metadata.json` with `skill_id` equal to parent folder basename, allowed family, derived triggers, key topics, key files, and mode aliases. `ALLOWED_FAMILIES` currently permits `cli`, `mcp`, `sk-code`, `deep-loop`, `sk-util`, and `system` (`.opencode/skills/system-skill-advisor/mcp_server/lib/skill-graph/skill-graph-db.ts:133`).
- Generate packet skeletons under the parent with each packet’s own `SKILL.md`, `references/`, `assets/`, and `scripts/`, but no packet `graph-metadata.json`. This preserves the current one-discoverable-identity pattern (`.opencode/skills/deep-loop-workflows/SKILL.md:68`, `.opencode/skills/deep-loop-workflows/SKILL.md:80`).
- Default packet folder names should equal packet `SKILL.md` names. Allow an explicit exception for cases like `ai-council/` with `name: deep-ai-council`, but require the exception to be declared in `mode-registry.json` so validators do not infer it (`.opencode/skills/deep-loop-workflows/ai-council/SKILL.md:2`).
- Generate `shared/` only as non-discoverable packet-shared helpers. Current `shared/synthesis/resource-map.cjs` is a good precedent: it lives outside the runtime backend and re-exports system-spec-kit rendering from a non-discoverable location (`.opencode/skills/deep-loop-workflows/shared/synthesis/resource-map.cjs:4`, `.opencode/skills/deep-loop-workflows/shared/synthesis/resource-map.cjs:17`).

**Required Invariants**
- `glob(parent/**/graph-metadata.json)` returns exactly one file: the hub metadata.
- Hub `graph-metadata.json.skill_id` equals the parent folder basename, or `parseSkillMetadata` throws (`.opencode/skills/system-skill-advisor/mcp_server/lib/skill-graph/skill-graph-db.ts:654`).
- `mode-registry.json.skill` equals hub `skill_id`.
- Every mode has a unique `workflowMode`, existing `packet` directory, explicit `runtimeLoopType` including null, valid `backendKind`, and unique command.
- `backendKind=runtime-loop-type` requires non-null `runtimeLoopType`; improvement-host requires null.
- Hub `SKILL.md` stays a routing hub only; per-mode convergence, state, artifacts, and tool guards stay in packet `SKILL.md` files (`.opencode/skills/deep-loop-workflows/SKILL.md:52`).
- Generated packet skeletons preserve per-mode contract separation. Current packets prove the need: research allows WebFetch and has research-specific threshold semantics (`.opencode/skills/deep-loop-workflows/deep-research/SKILL.md:4`, `.opencode/skills/deep-loop-workflows/deep-research/SKILL.md:33`), review is code-only and forbids direct invocation patterns (`.opencode/skills/deep-loop-workflows/deep-review/SKILL.md:8`, `.opencode/skills/deep-loop-workflows/deep-review/SKILL.md:46`), and improvement has three lanes behind one packet (`.opencode/skills/deep-loop-workflows/deep-improvement/SKILL.md:30`).

**Standardization**
- Add a sk-doc “parent skill” definition: a skill package with one discoverable hub identity, a registry of mode packets, packet-local contracts, and non-discoverable shared helpers.
- Add `/create:parent-skill` scaffolding templates and YAML workflows.
- Add `/doctor parent-skill` as a read-only route in `_routes.yaml`, using the doctor manifest pattern with mutation class and target-specific assets (`.opencode/commands/doctor/_routes.yaml:9`, `.opencode/commands/doctor/_routes.yaml:14`).
- Add a parent-skill validator that checks one identity, registry schema, packet existence, no nested graph metadata, graph metadata parse constraints, and routing parity fixtures.
- Add a benchmark fixture family for `{prompt, expectedSkill, expectedMode}`. Reuse the skill-benchmark philosophy where routing/discovery/efficiency are measured in practice (`.opencode/commands/deep/skill-benchmark.md:8`, `.opencode/skills/deep-loop-workflows/deep-improvement/references/skill_benchmark/operator_guide.md:21`).

**Drift To Fix**
- The hub and README still show old packet names `context/`, `research/`, `review/`, `improvement/`, while the registry and actual folders use `deep-context/`, `deep-research/`, `deep-review/`, `deep-improvement/` (`.opencode/skills/deep-loop-workflows/SKILL.md:64`, `.opencode/skills/deep-loop-workflows/README.md:24`, `.opencode/skills/deep-loop-workflows/mode-registry.json:15`).
- I could not verify any advisor code path that actually reads `mode-registry.json`; the references I found in advisor code are comments around hardcoded maps, not registry loading (`.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py:2311`, `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/aliases.ts:77`).

===RESEARCH-JSON===
{"angle":"/create:parent-skill scaffolder","recommendation":"Implement /create:parent-skill as a thin router that generates one discoverable hub identity, registry-backed mode packets, and validator/benchmark fixtures, while moving advisor mode projection from hardcoded maps to mode-registry.json.","model_pick":"A","key_findings":[{"claim":"The intended architecture is already one hub identity with registry-driven mode routing.","evidence":".opencode/skills/deep-loop-workflows/SKILL.md:12","confidence":"high"},{"claim":"The current advisor projection is hardcoded in Python and TypeScript rather than loaded from the registry.","evidence":".opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py:2320; .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/aliases.ts:96","confidence":"high"},{"claim":"Recursive graph metadata discovery plus skill_id==folder validation makes discoverable nested packets unsafe for the current ai-council mismatch and breaks one-identity parity.","evidence":".opencode/skills/system-skill-advisor/mcp_server/lib/skill-graph/skill-graph-db.ts:601; .opencode/skills/system-skill-advisor/mcp_server/lib/skill-graph/skill-graph-db.ts:654","confidence":"high"},{"claim":"Existing parity tests require {skill: deep-loop-workflows, mode: ...}, so scaffolding and advisor changes must preserve both fields.","evidence":".opencode/skills/system-skill-advisor/mcp_server/tests/routing-parity-deep-skills.vitest.ts:8","confidence":"high"},{"claim":"The create command family already uses the right router plus presentation plus YAML asset pattern for /create:parent-skill.","evidence":".opencode/commands/create/skill.md:13","confidence":"high"}],"risks":["Registry fields are sufficient for projection but not all existing legacy aliases are present, so migration needs alias backfill before deleting hardcoded maps.","Hub docs currently drift from actual packet folder names, so a scaffolder must render hub docs from registry data.","Generic parent-skill benchmarking may need a new fixture schema because current Lane C expects INTENT_SIGNALS + RESOURCE_MAP routers."],"standardize":["sk-doc parent-skill definition","/create:parent-skill router plus presentation/auto/confirm assets","mode-registry JSON schema with explicit null runtimeLoopType","/doctor parent-skill read-only validator","routing/discovery benchmark fixtures for expected {skill,mode}"],"open_questions":["Should parent-skill packet SKILL.md names always match packet folder names except declared migrations like ai-council/deep-ai-council?","Should mode-registry grow an advisorRouting block for Candidate-3 eligibility and legacy alias migration, or should aliases remain the only advisor extension?","Should /doctor parent-skill validate via a standalone parser only, or also run an optional skill_graph_scan/advisor_recommend probe after user confirmation?"]}
===END===

## Structured output

```json
{
  "angle": "/create:parent-skill scaffolder",
  "recommendation": "Implement /create:parent-skill as a thin router that generates one discoverable hub identity, registry-backed mode packets, and validator/benchmark fixtures, while moving advisor mode projection from hardcoded maps to mode-registry.json.",
  "model_pick": "A",
  "key_findings": [
    {
      "claim": "The intended architecture is already one hub identity with registry-driven mode routing.",
      "evidence": ".opencode/skills/deep-loop-workflows/SKILL.md:12",
      "confidence": "high"
    },
    {
      "claim": "The current advisor projection is hardcoded in Python and TypeScript rather than loaded from the registry.",
      "evidence": ".opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py:2320; .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/aliases.ts:96",
      "confidence": "high"
    },
    {
      "claim": "Recursive graph metadata discovery plus skill_id==folder validation makes discoverable nested packets unsafe for the current ai-council mismatch and breaks one-identity parity.",
      "evidence": ".opencode/skills/system-skill-advisor/mcp_server/lib/skill-graph/skill-graph-db.ts:601; .opencode/skills/system-skill-advisor/mcp_server/lib/skill-graph/skill-graph-db.ts:654",
      "confidence": "high"
    },
    {
      "claim": "Existing parity tests require {skill: deep-loop-workflows, mode: ...}, so scaffolding and advisor changes must preserve both fields.",
      "evidence": ".opencode/skills/system-skill-advisor/mcp_server/tests/routing-parity-deep-skills.vitest.ts:8",
      "confidence": "high"
    },
    {
      "claim": "The create command family already uses the right router plus presentation plus YAML asset pattern for /create:parent-skill.",
      "evidence": ".opencode/commands/create/skill.md:13",
      "confidence": "high"
    }
  ],
  "risks": [
    "Registry fields are sufficient for projection but not all existing legacy aliases are present, so migration needs alias backfill before deleting hardcoded maps.",
    "Hub docs currently drift from actual packet folder names, so a scaffolder must render hub docs from registry data.",
    "Generic parent-skill benchmarking may need a new fixture schema because current Lane C expects INTENT_SIGNALS + RESOURCE_MAP routers."
  ],
  "standardize": [
    "sk-doc parent-skill definition",
    "/create:parent-skill router plus presentation/auto/confirm assets",
    "mode-registry JSON schema with explicit null runtimeLoopType",
    "/doctor parent-skill read-only validator",
    "routing/discovery benchmark fixtures for expected {skill,mode}"
  ],
  "open_questions": [
    "Should parent-skill packet SKILL.md names always match packet folder names except declared migrations like ai-council/deep-ai-council?",
    "Should mode-registry grow an advisorRouting block for Candidate-3 eligibility and legacy alias migration, or should aliases remain the only advisor extension?",
    "Should /doctor parent-skill validate via a standalone parser only, or also run an optional skill_graph_scan/advisor_recommend probe after user confirmation?"
  ]
}
```
