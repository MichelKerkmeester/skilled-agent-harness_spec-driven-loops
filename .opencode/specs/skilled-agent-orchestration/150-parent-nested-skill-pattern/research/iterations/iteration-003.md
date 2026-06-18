# Iteration 003 — The B5 discovery keystone — what makes a packet discoverable

- **Model**: gpt-5.5-fast xhigh (cli-opencode, read-only)
- **Seat**: 003
- **model_pick**: A

## Analysis

**Recommendation**
Pick **A) ONE-IDENTITY + REGISTRY-DRIVEN**. It preserves the B5 discovery keystone, keeps the existing parity fixtures valid, and closes the real drift gap by making Python/TypeScript advisor mode projection read `mode-registry.json` instead of duplicating mode maps.

**Discovery Keystone**
A nested packet becomes an advisor-discoverable skill only when the recursive skill graph scan finds a file named exactly `graph-metadata.json`. The scanner walks every subdirectory under the skill root and pushes only entries whose filename equals `SKILL_METADATA_FILENAME`, which is `graph-metadata.json`; it does not scan for nested `SKILL.md` as a discovery root. Evidence: `.opencode/skills/system-skill-advisor/mcp_server/lib/skill-graph/skill-graph-db.ts:129`, `.opencode/skills/system-skill-advisor/mcp_server/lib/skill-graph/skill-graph-db.ts:601-625`.

Presence alone is not enough: the JSON must be an object, and the file is treated as skill metadata only if it has `skill_id`, `family`, or `edges`. Non-skill `graph-metadata.json` fixtures are scanned but skipped with a warning. Evidence: `.opencode/skills/system-skill-advisor/mcp_server/lib/skill-graph/skill-graph-db.ts:628-645`, `.opencode/skills/system-skill-advisor/mcp_server/lib/skill-graph/skill-graph-db.ts:850-860`, `.opencode/skills/system-skill-advisor/mcp_server/tests/skill-graph-db.vitest.ts:54-96`.

Once parsed, a skill-shaped nested `graph-metadata.json` becomes a real skill node: `parseSkillMetadata` returns a `SkillNode`, and `indexSkillMetadata` upserts that node into `skill_nodes`. Evidence: `.opencode/skills/system-skill-advisor/mcp_server/lib/skill-graph/skill-graph-db.ts:706-719`, `.opencode/skills/system-skill-advisor/mcp_server/lib/skill-graph/skill-graph-db.ts:958-968`.

Nested `SKILL.md` alone is harmless for discovery. It is only read later for embeddings relative to an already-discovered `graph-metadata.json` source path. Evidence: `.opencode/skills/system-skill-advisor/mcp_server/lib/skill-graph/skill-graph-db.ts:586-592`, `.opencode/skills/system-skill-advisor/mcp_server/lib/skill-graph/skill-graph-db.ts:1147-1152`.

**Exact Parse Contract**
For option B to make each nested packet discoverable, each packet would need its own `.opencode/skills/deep-loop-workflows/<packet>/graph-metadata.json` satisfying all parser invariants:

- `schema_version` must be `1` or `2`: `.opencode/skills/system-skill-advisor/mcp_server/lib/skill-graph/skill-graph-db.ts:648-652`.
- `skill_id` must be a non-empty string and exactly equal the immediate parent folder basename: `.opencode/skills/system-skill-advisor/mcp_server/lib/skill-graph/skill-graph-db.ts:654-658`.
- `family` must be one of `cli`, `mcp`, `sk-code`, `deep-loop`, `sk-util`, `system`: `.opencode/skills/system-skill-advisor/mcp_server/lib/skill-graph/skill-graph-db.ts:133-140`, `.opencode/skills/system-skill-advisor/mcp_server/lib/skill-graph/skill-graph-db.ts:660-663`.
- `category` must be a non-empty string; `domains` and `intent_signals` must be string arrays: `.opencode/skills/system-skill-advisor/mcp_server/lib/skill-graph/skill-graph-db.ts:665-668`, `.opencode/skills/system-skill-advisor/mcp_server/lib/skill-graph/skill-graph-db.ts:517-528`.
- schema v2 requires a `derived` object; schema v1 permits missing/non-object derived as `null`: `.opencode/skills/system-skill-advisor/mcp_server/lib/skill-graph/skill-graph-db.ts:531-540`.
- `edges` must be an object; edge keys must be supported edge types; edge lists must be arrays of objects with `target`, `weight`, and `context`: `.opencode/skills/system-skill-advisor/mcp_server/lib/skill-graph/skill-graph-db.ts:670-704`.
- duplicate `skill_id`s in the scan throw: `.opencode/skills/system-skill-advisor/mcp_server/lib/skill-graph/skill-graph-db.ts:863-875`.

For B specifically:
- `deep-context/graph-metadata.json` would need `skill_id: "deep-context"`.
- `deep-research/graph-metadata.json` would need `skill_id: "deep-research"`.
- `deep-review/graph-metadata.json` would need `skill_id: "deep-review"`.
- `deep-improvement/graph-metadata.json` would need `skill_id: "deep-improvement"`.
- `ai-council/graph-metadata.json` would need `skill_id: "ai-council"`, not `deep-ai-council`, unless the folder is renamed. This matters because its nested `SKILL.md` currently says `name: deep-ai-council` while the folder is `ai-council`. Evidence: `.opencode/skills/deep-loop-workflows/ai-council/SKILL.md:1-5`, `.opencode/skills/system-skill-advisor/mcp_server/lib/skill-graph/skill-graph-db.ts:654-658`.

**One-Identity Invariants**
A reusable parent-skill pattern must enforce these invariants:

- Exactly one skill-shaped `graph-metadata.json` under the whole parent tree: the hub file. The current hub file identifies `skill_id: deep-loop-workflows` and `family: deep-loop`. Evidence: `.opencode/skills/deep-loop-workflows/graph-metadata.json:1-6`.
- No mode packet or `shared/` directory may contain skill-shaped `graph-metadata.json`; the hub itself states this rule. Evidence: `.opencode/skills/deep-loop-workflows/SKILL.md:68-80`, `.opencode/skills/deep-loop-workflows/SKILL.md:82-86`.
- Nested packet `SKILL.md` files may exist to preserve per-mode contracts, but they are not advisor identities unless paired with a discoverable graph metadata file. Evidence: `.opencode/skills/deep-loop-workflows/deep-research/SKILL.md:1-6`, `.opencode/skills/deep-loop-workflows/deep-review/SKILL.md:1-8`, `.opencode/skills/system-skill-advisor/mcp_server/lib/skill-graph/skill-graph-db.ts:601-625`.
- `mode-registry.json` must remain the routing contract for `workflowMode`, `runtimeLoopType`, and `backendKind`. Evidence: `.opencode/skills/deep-loop-workflows/mode-registry.json:1-9`, `.opencode/skills/deep-loop-workflows/mode-registry.json:10-98`.
- `shared/` must stay non-discoverable by absence of graph metadata, not by special scanner logic; the scanner has no `shared/` exception. Evidence: `.opencode/skills/system-skill-advisor/mcp_server/lib/skill-graph/skill-graph-db.ts:606-621`, `.opencode/skills/deep-loop-workflows/shared/synthesis/resource-map.cjs:4-9`.

**Routing Gap**
The hub claims registry-driven routing, but the advisor still hardcodes mode maps:

- Hub claim: advisor reads `mode-registry.json`; no router should re-derive the mapping. Evidence: `.opencode/skills/deep-loop-workflows/SKILL.md:34-50`, `.opencode/skills/deep-loop-workflows/SKILL.md:77-86`.
- Python hardcode: `DEEP_ROUTING_MODE_BY_KEY` maps only `deep-review`, `deep-research`, and `deep-ai-council`. Evidence: `.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py:2310-2324`.
- TypeScript hardcode: `DEEP_MODE_BY_CANONICAL` maps `deep-research`, `deep-review`, `deep-ai-council`, and `deep-improvement`; it explicitly excludes `deep-context`. Evidence: `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/aliases.ts:75-101`.
- Registry has eight modes, including `context` and four improvement lanes, so hardcoded maps are already not isomorphic with the registry. Evidence: `.opencode/skills/deep-loop-workflows/mode-registry.json:10-98`.

**Why A Beats B/C/D**
A keeps the only advisor identity as `deep-loop-workflows` and makes only the mode projection registry-driven. That matches the existing parity contract: tests assert both `skill: deep-loop-workflows` and a concrete `mode`, because flat skill equality is insufficient. Evidence: `.opencode/skills/system-skill-advisor/mcp_server/tests/routing-parity-deep-skills.vitest.ts:5-10`, `.opencode/skills/system-skill-advisor/mcp_server/tests/routing-parity-deep-skills.vitest.ts:27-37`, `.opencode/skills/system-skill-advisor/mcp_server/tests/routing-parity-deep-council.vitest.ts:5-8`.

B is technically possible but intentionally breaks the one-identity keystone by adding nested rankable nodes. It would also force the `ai-council` identity problem above and require deliberate parity test migration.

C leaves the current drift gap.

D is only worth using if “hybrid” means non-rankable, registry-derived mode hints attached to the single hub recommendation. If D adds nested rankable nodes, it has the same B5 problem as B.

**Standardize**
Standardize these as reusable parent-skill rules:

- `sk-doc`: define “parent skill with nested sub-skills” as one discoverable hub `graph-metadata.json`, mandatory `mode-registry.json`, nested packet `SKILL.md`s, and zero nested skill-shaped graph metadata.
- `/create:parent-skill`: scaffold hub `SKILL.md`, hub `graph-metadata.json`, `mode-registry.json`, packet folders, and a guard test that recursive graph discovery yields exactly one skill id.
- `/doctor:parent-skill`: validate exactly one `graph-metadata.json` under the parent unless explicit B-mode is selected, validate `skill_id == basename(dirname(graph-metadata.json))`, validate registry packet paths exist, validate aliases are unambiguous, and validate no `shared/` discoverability.
- Advisor benchmark: assert Python and TypeScript resolve deep aliases from registry to `{ skill: "deep-loop-workflows", mode }`, and keep `routing-parity-deep-*.vitest.ts` green.
- Registry schema: add or standardize an advisor-specific alias/projection field if needed, because current `agent: deep-improvement` is shared by multiple improvement modes and cannot uniquely drive a deep-improvement alias projection. Evidence: `.opencode/skills/deep-loop-workflows/mode-registry.json:52-95`.

**Verified Drift/Risks**
The hub docs still contain stale bare packet names in the layout/reference section even though the live registry uses `deep-context`, `deep-research`, `deep-review`, and `deep-improvement`. Evidence: `.opencode/skills/deep-loop-workflows/SKILL.md:58-68`, `.opencode/skills/deep-loop-workflows/SKILL.md:94-99`, `.opencode/skills/deep-loop-workflows/mode-registry.json:12-20`, `.opencode/skills/deep-loop-workflows/mode-registry.json:22-30`, `.opencode/skills/deep-loop-workflows/mode-registry.json:32-40`, `.opencode/skills/deep-loop-workflows/mode-registry.json:52-62`.

I did not run tests or benchmarks, to avoid any toolchain side effects in a read-only research request.

===RESEARCH-JSON===
{"angle":"B5 discovery keystone","recommendation":"Use A: keep one hub graph-metadata identity and make advisor mode projection read mode-registry.json so routing cannot drift from the registry.","model_pick":"A","key_findings":[{"claim":"Advisor discovery is recursive but filename-gated on graph-metadata.json, not SKILL.md.","evidence":".opencode/skills/system-skill-advisor/mcp_server/lib/skill-graph/skill-graph-db.ts:601-625","confidence":"high"},{"claim":"A skill-shaped graph-metadata.json becomes a skill node only after parser validation and skill_id==parent-folder-name.","evidence":".opencode/skills/system-skill-advisor/mcp_server/lib/skill-graph/skill-graph-db.ts:648-719","confidence":"high"},{"claim":"Nested SKILL.md alone is harmless for discovery; SKILL.md is read only as embedding text for an already-discovered graph-metadata source path.","evidence":".opencode/skills/system-skill-advisor/mcp_server/lib/skill-graph/skill-graph-db.ts:586-592; .opencode/skills/system-skill-advisor/mcp_server/lib/skill-graph/skill-graph-db.ts:1147-1152","confidence":"high"},{"claim":"Current routing is hardcoded in Python and TypeScript despite the hub claiming registry-driven routing.","evidence":".opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py:2310-2324; .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/aliases.ts:75-101; .opencode/skills/deep-loop-workflows/SKILL.md:34-50","confidence":"high"},{"claim":"Option B would require per-packet graph-metadata skill_id values matching folder basenames; ai-council would need skill_id ai-council unless renamed.","evidence":".opencode/skills/system-skill-advisor/mcp_server/lib/skill-graph/skill-graph-db.ts:654-658; .opencode/skills/deep-loop-workflows/ai-council/SKILL.md:1-5","confidence":"high"}],"risks":["Adding any skill-shaped graph-metadata.json under a mode packet or shared/ will create an extra advisor identity.","Registry aliases are not currently sufficient to derive every existing hardcoded projection unambiguously, especially deep-improvement shared by multiple improvement lanes.","Hub SKILL.md still has stale bare packet path references that can confuse future scaffolding or validation."],"standardize":["sk-doc parent-skill definition: one hub graph-metadata.json, mandatory mode-registry.json, nested packet SKILL.md files, no nested skill-shaped graph metadata","/create:parent-skill scaffolder with hub metadata, registry, packet templates, and one-identity guard test","/doctor:parent-skill validator for recursive graph-metadata count, skill_id==folder, registry packet paths, alias uniqueness, and shared/ non-discoverability","Routing/discovery benchmark that proves Python and TypeScript advisor projections are registry-driven while routing-parity-deep fixtures remain green"],"open_questions":["Should mode-registry.json grow an explicit advisorRouting/legacySkillIds field, or should advisor projections derive solely from aliases?","Should the accepted ai-council folder versus deep-ai-council SKILL.md mismatch remain a documented exception, or should future parent-skill scaffolds forbid it?","Should /doctor:parent-skill fail on any nested graph-metadata.json, or allow non-skill graph metadata that the scanner would skip?"]}
===END===

## Structured output

```json
{
  "angle": "B5 discovery keystone",
  "recommendation": "Use A: keep one hub graph-metadata identity and make advisor mode projection read mode-registry.json so routing cannot drift from the registry.",
  "model_pick": "A",
  "key_findings": [
    {
      "claim": "Advisor discovery is recursive but filename-gated on graph-metadata.json, not SKILL.md.",
      "evidence": ".opencode/skills/system-skill-advisor/mcp_server/lib/skill-graph/skill-graph-db.ts:601-625",
      "confidence": "high"
    },
    {
      "claim": "A skill-shaped graph-metadata.json becomes a skill node only after parser validation and skill_id==parent-folder-name.",
      "evidence": ".opencode/skills/system-skill-advisor/mcp_server/lib/skill-graph/skill-graph-db.ts:648-719",
      "confidence": "high"
    },
    {
      "claim": "Nested SKILL.md alone is harmless for discovery; SKILL.md is read only as embedding text for an already-discovered graph-metadata source path.",
      "evidence": ".opencode/skills/system-skill-advisor/mcp_server/lib/skill-graph/skill-graph-db.ts:586-592; .opencode/skills/system-skill-advisor/mcp_server/lib/skill-graph/skill-graph-db.ts:1147-1152",
      "confidence": "high"
    },
    {
      "claim": "Current routing is hardcoded in Python and TypeScript despite the hub claiming registry-driven routing.",
      "evidence": ".opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py:2310-2324; .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/aliases.ts:75-101; .opencode/skills/deep-loop-workflows/SKILL.md:34-50",
      "confidence": "high"
    },
    {
      "claim": "Option B would require per-packet graph-metadata skill_id values matching folder basenames; ai-council would need skill_id ai-council unless renamed.",
      "evidence": ".opencode/skills/system-skill-advisor/mcp_server/lib/skill-graph/skill-graph-db.ts:654-658; .opencode/skills/deep-loop-workflows/ai-council/SKILL.md:1-5",
      "confidence": "high"
    }
  ],
  "risks": [
    "Adding any skill-shaped graph-metadata.json under a mode packet or shared/ will create an extra advisor identity.",
    "Registry aliases are not currently sufficient to derive every existing hardcoded projection unambiguously, especially deep-improvement shared by multiple improvement lanes.",
    "Hub SKILL.md still has stale bare packet path references that can confuse future scaffolding or validation."
  ],
  "standardize": [
    "sk-doc parent-skill definition: one hub graph-metadata.json, mandatory mode-registry.json, nested packet SKILL.md files, no nested skill-shaped graph metadata",
    "/create:parent-skill scaffolder with hub metadata, registry, packet templates, and one-identity guard test",
    "/doctor:parent-skill validator for recursive graph-metadata count, skill_id==folder, registry packet paths, alias uniqueness, and shared/ non-discoverability",
    "Routing/discovery benchmark that proves Python and TypeScript advisor projections are registry-driven while routing-parity-deep fixtures remain green"
  ],
  "open_questions": [
    "Should mode-registry.json grow an explicit advisorRouting/legacySkillIds field, or should advisor projections derive solely from aliases?",
    "Should the accepted ai-council folder versus deep-ai-council SKILL.md mismatch remain a documented exception, or should future parent-skill scaffolds forbid it?",
    "Should /doctor:parent-skill fail on any nested graph-metadata.json, or allow non-skill graph metadata that the scanner would skip?"
  ]
}
```
