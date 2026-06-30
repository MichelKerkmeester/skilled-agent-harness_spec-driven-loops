# Iteration 010 — Routing/discovery benchmark design (dogfood skill-benchmark)

- **Model**: gpt-5.5-fast xhigh (cli-opencode, read-only)
- **Seat**: 010
- **model_pick**: A

## Analysis

**Recommendation**
Pick **A, ONE-IDENTITY + REGISTRY-DRIVEN**. Keep one advisor-discoverable `deep-loop-workflows` node, make the advisor’s mode projection read `mode-registry.json`, and dogfood the effectiveness benchmark through Lane C `skill-benchmark` with a small parent-skill extension rather than a new harness.

**Key Findings**
| Finding | Evidence |
|---|---|
| The docs already declare the desired invariant: registry-driven routing, no hardcoded router map. | `.opencode/skills/deep-loop-workflows/SKILL.md:36`, `.opencode/skills/deep-loop-workflows/SKILL.md:78` |
| Actual Python advisor routing still hardcodes the mode map and only covers `research`, `review`, `ai-council`. | `.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py:2319-2324`, `.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py:2513-2533` |
| Actual TS advisor alias layer also hardcodes the merged skill and mode map. | `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/aliases.ts:90-101` |
| Native `advisor_recommend` does not currently expose `workflowMode`, so per-mode precision cannot be scored from the public TS recommendation output as-is. | `.opencode/skills/system-skill-advisor/mcp_server/handlers/advisor-recommend.ts:247-267`, `.opencode/skills/system-skill-advisor/mcp_server/schemas/advisor-tool-schemas.ts:181-193` |
| The one-identity invariant is structurally important because discovery recursively indexes every `graph-metadata.json`, and metadata parsing rejects `skill_id != folder`. | `.opencode/skills/system-skill-advisor/mcp_server/lib/skill-graph/skill-graph-db.ts:601-625`, `.opencode/skills/system-skill-advisor/mcp_server/lib/skill-graph/skill-graph-db.ts:654-658` |
| The hub has the single advisor identity. | `.opencode/skills/deep-loop-workflows/graph-metadata.json:4-5` |
| The skill explicitly forbids nested `graph-metadata.json` files. | `.opencode/skills/deep-loop-workflows/SKILL.md:68`, `.opencode/skills/deep-loop-workflows/SKILL.md:80`, `.opencode/skills/deep-loop-workflows/SKILL.md:86` |
| Lane C `skill-benchmark` is the right dogfood envelope: it already runs D5, scenarios, scoring, and JSON plus Markdown reporting. | `.opencode/skills/deep-loop-workflows/deep-improvement/references/skill_benchmark/operator_guide.md:21`, `.opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/README.md:21-25` |
| Current Lane C cannot score parent-mode precision without a small extension because `advisor-probe` returns only ranked skills and `scoreD1Inter` compares skill id only. | `.opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/advisor-probe.cjs:52-71`, `.opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/advisor-probe.cjs:84-98` |
| There is live path drift in hub docs: registry uses `deep-context`, `deep-research`, `deep-review`, `deep-improvement`, while hub prose still names bare `context/research/review/improvement`. The benchmark should catch this. | `.opencode/skills/deep-loop-workflows/mode-registry.json:15`, `.opencode/skills/deep-loop-workflows/mode-registry.json:25`, `.opencode/skills/deep-loop-workflows/mode-registry.json:35`, `.opencode/skills/deep-loop-workflows/mode-registry.json:55`, `.opencode/skills/deep-loop-workflows/SKILL.md:64`, `.opencode/skills/deep-loop-workflows/SKILL.md:97` |

**Model Decision**
A beats the alternatives.

| Model | Verdict |
|---|---|
| A | Best. It preserves the B5 one-identity keystone, closes hardcode drift, keeps mode packets non-discoverable, and lets the benchmark assert both `skillId` and `workflowMode`. |
| B | Reject. If nested packets get `graph-metadata.json`, recursive discovery sees extra nodes; if `skill_id` keeps legacy names under nested folders, parsing throws; if `skill_id==folder`, advisor node count is no longer 1. |
| C | Reject. It is measurable but not reusable because the registry can drift from Python and TS maps. |
| D | Only acceptable as A plus non-discoverable derived mode hints. Do not add partial nested advisor nodes. |

**Benchmark Design**
Use Lane C `skill-benchmark` as the runner, not a new harness.

Command shape for the future run:

```bash
node .opencode/skills/deep-loop-workflows/deep-improvement/scripts/shared/loop-host.cjs \
  --mode=skill-benchmark \
  --skill=.opencode/skills/deep-loop-workflows \
  --outputs-dir=<benchmark-output-dir> \
  --trace-mode=router \
  --advisor-mode=python \
  --playbook-dir=.opencode/skills/deep-loop-workflows/manual_testing_playbook
```

Required small extensions inside Lane C:

| Extension | Reason |
|---|---|
| Add `expectedWorkflowMode` to advisor scenarios. | Existing gold supports `expectedSkillId`; parent skills need `expectedSkillId + expectedWorkflowMode`. |
| Add a `modeProbe` path to `advisor-probe.cjs`. | Python already has `--deep-skill-routing-json` with `{skill, mode}`; TS should expose equivalent mode after the registry-driven fix. |
| Add `modePrecision` to `aggregate()`. | Existing report has `dimensionScores`, `funnel`, `coverage`; parent mode precision should be a first-class reported metric. |
| Add a parent-skill D5 subtype. | Current D5 checks `INTENT_SIGNALS + RESOURCE_MAP`; parent hubs route via `mode-registry.json`, so D5 should validate registry/discovery/packet contracts instead of failing `router_unparseable`. |

Before metrics:

| Metric | Current Expected Baseline |
|---|---|
| Per-mode routing precision | Partially measurable only for Python `research/review/ai-council`; TS public `advisor_recommend` is `mode_unobservable`; `context` and improvement sub-lanes are not covered by the hardcoded Python deep map. |
| Discovery node count | Should be exactly 1 under the parent identity; fail if any nested packet gains `graph-metadata.json`. |
| Drift detection | Should report hardcoded-map risk: Python and TS maps exist outside the registry. |
| Contract preservation | Should pass packet existence and graph-metadata absence, but should flag stale hub prose paths. |

After metrics:

| Metric | Target |
|---|---|
| Per-mode routing precision | 100 percent on the curated mode corpus, with each positive scenario returning `skillId=deep-loop-workflows` and the expected `workflowMode`. |
| Discovery node count | Exactly 1 advisor node for `deep-loop-workflows`. |
| Drift detection | Zero registry-vs-advisor drift; Python and TS derive mode maps from `mode-registry.json`. |
| Contract preservation | All registry packet paths exist, no nested graph metadata, each packet keeps its own `SKILL.md` name and resources, `runtimeLoopType` nullability matches `backendKind`. |

**Scenario Corpus**
Seed one positive scenario per registry mode and one adversarial negative per sibling boundary.

| Mode | Positive Scenario Intent |
|---|---|
| `context` | “Map existing code and produce a reuse-first context report before planning.” |
| `research` | “Run an iterative investigation until new information converges.” |
| `review` | “Run a multi-pass audit until P0/P1 findings stabilize.” |
| `ai-council` | “Deliberate across multiple architecture options until a council verdict converges.” |
| `agent-improvement` | “Evaluate and improve a bounded agent candidate with scoring and promotion gates.” |
| `model-benchmark` | “Benchmark a model or prompt framework against repeatable fixtures.” |
| `skill-benchmark` | “Benchmark whether a skill routes, discovers references, and is useful.” |
| `ai-system-improvement` | “Benchmark and refine non-dev AI-system packaging behind guardrails.” |

**Registry-Driven Fix**
Keep this minimal.

| Component | Change |
|---|---|
| Python advisor | Replace `DEEP_ROUTING_MODE_BY_KEY` literals with a JSON load of `mode-registry.json`; keep regex scoring heuristics, but project winner keys through registry data. |
| TS advisor | Replace `DEEP_MODE_BY_CANONICAL` literals with a registry loader used by alias projection. |
| Native recommend schema | Add optional `mode` or `workflowMode` only when a recommendation is a parent skill mode recommendation. |
| Tests | Keep existing routing parity fixtures green by asserting `{skill: deep-loop-workflows, mode}` exactly as they already do. |

**Standardize**
| Standard | Content |
|---|---|
| `sk-doc` parent-skill section | Define hub `SKILL.md`, `mode-registry.json`, one `graph-metadata.json`, nested mode packets, non-discoverable `shared/`, and accepted folder/name mismatch rules. |
| `/create:parent-skill` | Scaffold hub, registry, graph metadata, packet directories, no nested graph metadata, optional shared directory, and a parent-mode playbook for `skill-benchmark`. |
| `/doctor parent-skill` | Read-only validator for registry schema, packet paths, graph metadata count, advisor map drift, command path drift, stale hub prose paths, and runtimeLoopType/backendKind consistency. |
| Skill-benchmark parent profile | A Lane C profile/playbook that scores mode precision, discovery node count, registry drift, and contract preservation through existing `loop-host --mode=skill-benchmark`. |

**Risks**
| Risk | Why It Matters |
|---|---|
| Public TS recommend currently cannot report mode. | Without a mode field, the benchmark can prove only “right skill,” not “right mode.” |
| Existing Lane C assumes `INTENT_SIGNALS + RESOURCE_MAP`. | Parent hubs use `mode-registry.json`, so a parent-specific D5 path is needed. |
| Hub docs still contain stale bare packet paths. | A reusable pattern needs doc/registry/path consistency or scaffolding will copy drift. |
| The runtime “no system-spec-kit dependency” claim was not verified. | `deep-loop-runtime/graph-metadata.json` declares a `system-spec-kit` dependency for zod, better-sqlite3, TSX loader, command YAML consumers, and shared test discovery at `.opencode/skills/deep-loop-runtime/graph-metadata.json:9-14`. |

===RESEARCH-JSON===
{"angle":"routing-discovery-benchmark","recommendation":"Use Model A: keep one advisor identity and make advisor mode projection registry-driven, then dogfood mode precision, discovery count, and drift checks through Lane C skill-benchmark with a small parent-skill extension.","model_pick":"A","key_findings":[{"claim":"Advisor docs claim registry-driven routing, but Python and TS still hardcode mode maps.","evidence":".opencode/skills/deep-loop-workflows/SKILL.md:36; .opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py:2319-2324; .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/aliases.ts:90-101","confidence":"high"},{"claim":"Native advisor_recommend cannot currently score correct mode because public recommendations expose skillId but no workflowMode.","evidence":".opencode/skills/system-skill-advisor/mcp_server/handlers/advisor-recommend.ts:247-267; .opencode/skills/system-skill-advisor/mcp_server/schemas/advisor-tool-schemas.ts:181-193","confidence":"high"},{"claim":"One-identity must stay: discovery recursively indexes graph-metadata.json and parse rejects skill_id mismatches.","evidence":".opencode/skills/system-skill-advisor/mcp_server/lib/skill-graph/skill-graph-db.ts:601-625; .opencode/skills/system-skill-advisor/mcp_server/lib/skill-graph/skill-graph-db.ts:654-658","confidence":"high"},{"claim":"Lane C skill-benchmark is the correct dogfood harness but needs parent-mode extensions because advisor-probe is skill-only today.","evidence":".opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/README.md:21-25; .opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/advisor-probe.cjs:52-71","confidence":"high"},{"claim":"Hub path prose still drifts from registry packet paths and should become a benchmark/doctor finding.","evidence":".opencode/skills/deep-loop-workflows/mode-registry.json:15; .opencode/skills/deep-loop-workflows/SKILL.md:64","confidence":"high"}],"risks":["TS recommend mode is unobservable until schema/output is extended.","Current Lane C D5 hard-gates routerless skills, so parent-skill registry D5 must be added inside the existing harness.","Stale hub prose paths can seed bad scaffolds if not standardized.","The claimed deep-loop-runtime no-system-spec-kit-dependency was not verified against graph metadata."],"standardize":["sk-doc parent-skill section with hub, registry, one graph-metadata, nested non-discoverable packets, shared boundary, and naming rules.","/create:parent-skill scaffolder for hub, mode-registry.json, graph-metadata.json, packets, shared, and parent benchmark playbook.","/doctor parent-skill read-only validator for registry schema, packet paths, graph-metadata count, advisor drift, command drift, and stale docs.","Lane C parent-skill benchmark profile reporting modePrecision, discoveryNodeCount, registryDrift, and contractPreservation."],"open_questions":["Should TS advisor_recommend expose the mode as recommendation.mode or recommendation.workflowMode?","Should context and improvement sub-lanes be routed by native advisor mode output or only by command bridges?","Should ai-council remain the only accepted folder/name mismatch in the standard?"]}
===END===

## Structured output

```json
{
  "angle": "routing-discovery-benchmark",
  "recommendation": "Use Model A: keep one advisor identity and make advisor mode projection registry-driven, then dogfood mode precision, discovery count, and drift checks through Lane C skill-benchmark with a small parent-skill extension.",
  "model_pick": "A",
  "key_findings": [
    {
      "claim": "Advisor docs claim registry-driven routing, but Python and TS still hardcode mode maps.",
      "evidence": ".opencode/skills/deep-loop-workflows/SKILL.md:36; .opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py:2319-2324; .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/aliases.ts:90-101",
      "confidence": "high"
    },
    {
      "claim": "Native advisor_recommend cannot currently score correct mode because public recommendations expose skillId but no workflowMode.",
      "evidence": ".opencode/skills/system-skill-advisor/mcp_server/handlers/advisor-recommend.ts:247-267; .opencode/skills/system-skill-advisor/mcp_server/schemas/advisor-tool-schemas.ts:181-193",
      "confidence": "high"
    },
    {
      "claim": "One-identity must stay: discovery recursively indexes graph-metadata.json and parse rejects skill_id mismatches.",
      "evidence": ".opencode/skills/system-skill-advisor/mcp_server/lib/skill-graph/skill-graph-db.ts:601-625; .opencode/skills/system-skill-advisor/mcp_server/lib/skill-graph/skill-graph-db.ts:654-658",
      "confidence": "high"
    },
    {
      "claim": "Lane C skill-benchmark is the correct dogfood harness but needs parent-mode extensions because advisor-probe is skill-only today.",
      "evidence": ".opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/README.md:21-25; .opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/advisor-probe.cjs:52-71",
      "confidence": "high"
    },
    {
      "claim": "Hub path prose still drifts from registry packet paths and should become a benchmark/doctor finding.",
      "evidence": ".opencode/skills/deep-loop-workflows/mode-registry.json:15; .opencode/skills/deep-loop-workflows/SKILL.md:64",
      "confidence": "high"
    }
  ],
  "risks": [
    "TS recommend mode is unobservable until schema/output is extended.",
    "Current Lane C D5 hard-gates routerless skills, so parent-skill registry D5 must be added inside the existing harness.",
    "Stale hub prose paths can seed bad scaffolds if not standardized.",
    "The claimed deep-loop-runtime no-system-spec-kit-dependency was not verified against graph metadata."
  ],
  "standardize": [
    "sk-doc parent-skill section with hub, registry, one graph-metadata, nested non-discoverable packets, shared boundary, and naming rules.",
    "/create:parent-skill scaffolder for hub, mode-registry.json, graph-metadata.json, packets, shared, and parent benchmark playbook.",
    "/doctor parent-skill read-only validator for registry schema, packet paths, graph-metadata count, advisor drift, command drift, and stale docs.",
    "Lane C parent-skill benchmark profile reporting modePrecision, discoveryNodeCount, registryDrift, and contractPreservation."
  ],
  "open_questions": [
    "Should TS advisor_recommend expose the mode as recommendation.mode or recommendation.workflowMode?",
    "Should context and improvement sub-lanes be routed by native advisor mode output or only by command bridges?",
    "Should ai-council remain the only accepted folder/name mismatch in the standard?"
  ]
}
```
