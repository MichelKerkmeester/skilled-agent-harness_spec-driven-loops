# Iteration 004 — Naming + discovery conventions to standardize

- **Model**: gpt-5.5-fast xhigh (cli-opencode, read-only)
- **Seat**: 004
- **model_pick**: A

## Analysis

**Recommendation**
Pick **A) ONE-IDENTITY + REGISTRY-DRIVEN**. Keep one discoverable parent identity, make Python and TypeScript advisor routing read `mode-registry.json`, and standardize packet naming as “folder == packet `SKILL.md name` unless the registry declares an explicit exception.”

**Key Findings**
- The B5 one-identity model is the right keystone: the hub declares `skill_id: deep-loop-workflows` and `family: deep-loop`, while the hub text says this is the public advisor-routable home and must keep exactly one `graph-metadata.json` (`.opencode/skills/deep-loop-workflows/graph-metadata.json:4-5`, `.opencode/skills/deep-loop-workflows/SKILL.md:12`, `.opencode/skills/deep-loop-workflows/SKILL.md:77-86`).
- Model B would fight current discovery rules: advisor discovery recursively indexes every `graph-metadata.json`, then rejects any metadata whose `skill_id` does not equal the metadata file’s parent folder (`.opencode/skills/system-skill-advisor/mcp_server/lib/skill-graph/skill-graph-db.ts:601-625`, `.opencode/skills/system-skill-advisor/mcp_server/lib/skill-graph/skill-graph-db.ts:648-663`, `.opencode/skills/system-skill-advisor/mcp_server/lib/skill-graph/skill-graph-db.ts:843-860`).
- The current router is not actually registry-driven: the registry says routers and advisor read it, but Python hardcodes `DEEP_ROUTING_MODE_BY_KEY`, and TypeScript hardcodes `DEEP_MODE_BY_CANONICAL` (`.opencode/skills/deep-loop-workflows/mode-registry.json:2-8`, `.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py:2319-2324`, `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/aliases.ts:90-101`).
- The current hardcoded routing surface is incomplete relative to the registry: Python’s deep routing CLI advertises only `research|review|ai-council`, while the registry has `context`, three graph-backed non-council modes, `ai-council`, and four improvement lanes (`.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py:16`, `.opencode/skills/deep-loop-workflows/mode-registry.json:10-97`).
- Four packet folders match their `SKILL.md name`; `ai-council/` intentionally does not: `ai-council/SKILL.md` declares `name: deep-ai-council`, and the decision record accepts keeping `ai-council` as the folder (`.opencode/skills/deep-loop-workflows/deep-context/SKILL.md:1-8`, `.opencode/skills/deep-loop-workflows/deep-research/SKILL.md:1-9`, `.opencode/skills/deep-loop-workflows/deep-review/SKILL.md:1-10`, `.opencode/skills/deep-loop-workflows/deep-improvement/SKILL.md:1-20`, `.opencode/skills/deep-loop-workflows/ai-council/SKILL.md:1-8`, `.opencode/specs/skilled-agent-orchestration/117-parent-nested-skill-pattern/001-rename-fix-and-shared-decision/decision-record.md:90-98`).
- Under one identity, packet folder names do not define advisor identity; they define internal packet paths through registry `packet`, while hub `graph-metadata.json` defines the advisor node (`.opencode/skills/deep-loop-workflows/mode-registry.json:12-19`, `.opencode/skills/deep-loop-workflows/mode-registry.json:42-49`, `.opencode/specs/skilled-agent-orchestration/117-parent-nested-skill-pattern/001-rename-fix-and-shared-decision/decision-record.md:94-105`).
- The hub `Keywords` and hub `derived.trigger_phrases` are advisor-relevant; nested packet `Keywords` preserve packet contracts but are not the discoverable projection under one identity, because projection reads `SKILL.md` adjacent to the discovered metadata path (`.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/projection.ts:179-218`, `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/lexical.ts:66-75`, `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/bm25.ts:14-32`).
- The hub trigger list should be generated or validated against the registry alias union: current `derived.trigger_phrases` is manually curated, while registry aliases are authoritative per mode (`.opencode/skills/deep-loop-workflows/graph-metadata.json:67-100`, `.opencode/skills/deep-loop-workflows/mode-registry.json:19`, `.opencode/skills/deep-loop-workflows/mode-registry.json:29`, `.opencode/skills/deep-loop-workflows/mode-registry.json:39`, `.opencode/skills/deep-loop-workflows/mode-registry.json:49`, `.opencode/skills/deep-loop-workflows/mode-registry.json:61`, `.opencode/skills/deep-loop-workflows/mode-registry.json:72`, `.opencode/skills/deep-loop-workflows/mode-registry.json:83`, `.opencode/skills/deep-loop-workflows/mode-registry.json:95`).
- There is naming-doc drift now: hub `SKILL.md` still documents old bare packet folders, and `graph-metadata.derived.source_docs` still lists `context/`, `research/`, `review/`, and `improvement/` even though `key_files` and the registry use `deep-*` folders (`.opencode/skills/deep-loop-workflows/SKILL.md:58-68`, `.opencode/skills/deep-loop-workflows/SKILL.md:94-99`, `.opencode/skills/deep-loop-workflows/graph-metadata.json:117-125`, `.opencode/skills/deep-loop-workflows/graph-metadata.json:148-156`).
- `family` should stay an existing advisor family, not a new `parent` family: `deep-loop` is already allowed in the TypeScript graph DB and Python compiler (`.opencode/skills/system-skill-advisor/mcp_server/lib/skill-graph/skill-graph-db.ts:133-140`, `.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_graph_compiler.py:35-42`).

**Canonical Convention Set**
- Parent identity: exactly one discoverable `graph-metadata.json` at the parent root; `skill_id` must equal the parent folder name; `family` must be an allowed family.
- Registry: `mode-registry.json` owns `workflowMode`, `runtimeLoopType`, `backendKind`, `packet`, `command`, `agent`, `artifactRoot`, and `aliases`; advisor code must load this registry instead of duplicating mode maps.
- Packet folder naming: default `packet folder == packet SKILL.md name == legacy/direct-load skill name`; exceptions require explicit registry declaration and validator acceptance. Keep current `ai-council` exception for now because it is already documented and path-churn would not improve routing.
- Discovery: nested packets and `shared/` must not contain discoverable `graph-metadata.json`; if per-mode metadata is needed later, keep it in `mode-registry.json` or a non-advisor filename.
- Keywords and triggers: hub `SKILL.md` `Keywords`, hub `intent_signals`, and hub `derived.trigger_phrases` must be generated or checked as the union of registry aliases, workflow modes, packet names, commands, and high-signal packet keywords; nested packet keywords remain local contract documentation.
- Per-mode contracts: packet `SKILL.md`, references, scripts, assets, and allowed-tool differences stay in each packet; the hub never flattens convergence, state, artifacts, or tool permissions.

**Standardize**
- `sk-doc`: add a parent-skill section defining one-identity parent skills, registry fields, folder/name exception policy, trigger union rules, and non-discoverable `shared/`.
- `/create:parent-skill`: scaffold hub `SKILL.md`, hub `graph-metadata.json`, `mode-registry.json`, nested packet folders, `shared/`, and a generated trigger/keyword union.
- `/doctor:parent-skill`: validate exactly one discoverable graph metadata, `skill_id==folder`, family allowed, all registry packets exist, packet `SKILL.md name` matches folder or explicit exception, hub triggers cover registry aliases, no stale packet paths in hub docs/metadata, and no per-packet graph metadata.
- Routing/discovery benchmark: preserve current `{ skill: deep-loop-workflows, mode }` parity fixtures and extend coverage to `context` plus all four improvement lanes.

===RESEARCH-JSON===
{"angle":"naming-discovery-conventions","recommendation":"Pick A: keep one discoverable parent identity, make advisor routing registry-driven from mode-registry.json, and standardize folder==SKILL.md name by default with explicit registry-declared exceptions such as ai-council.","model_pick":"A","key_findings":[{"claim":"The hub is the one advisor identity: graph-metadata declares skill_id deep-loop-workflows and family deep-loop, and the hub rules require exactly one graph-metadata.json.","evidence":".opencode/skills/deep-loop-workflows/graph-metadata.json:4-5; .opencode/skills/deep-loop-workflows/SKILL.md:77-86","confidence":"high"},{"claim":"Advisor discovery recursively indexes every graph-metadata.json and rejects skill_id values that do not match the containing folder, making discoverable nested packets a separate-identity model and risky for ai-council.","evidence":".opencode/skills/system-skill-advisor/mcp_server/lib/skill-graph/skill-graph-db.ts:601-625; .opencode/skills/system-skill-advisor/mcp_server/lib/skill-graph/skill-graph-db.ts:654-658","confidence":"high"},{"claim":"Routing is currently duplicated outside the registry in Python and TypeScript, despite mode-registry.json declaring itself the routing source of truth.","evidence":".opencode/skills/deep-loop-workflows/mode-registry.json:2-8; .opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py:2319-2324; .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/aliases.ts:90-101","confidence":"high"},{"claim":"Four packet folders match their SKILL.md name, while ai-council intentionally differs from name: deep-ai-council.","evidence":".opencode/skills/deep-loop-workflows/deep-context/SKILL.md:1-8; .opencode/skills/deep-loop-workflows/ai-council/SKILL.md:1-8; .opencode/specs/skilled-agent-orchestration/117-parent-nested-skill-pattern/001-rename-fix-and-shared-decision/decision-record.md:90-98","confidence":"high"},{"claim":"Hub Keywords and derived trigger phrases are advisor-relevant under one identity; nested packet Keywords preserve local packet contracts but are not the discovered projection unless packet metadata is added.","evidence":".opencode/skills/system-skill-advisor/mcp_server/lib/scorer/projection.ts:179-218; .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/lexical.ts:66-75; .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/bm25.ts:14-32","confidence":"high"},{"claim":"Current hub docs and derived source_docs still contain stale bare packet names, so a parent-skill validator should check naming drift.","evidence":".opencode/skills/deep-loop-workflows/SKILL.md:58-68; .opencode/skills/deep-loop-workflows/graph-metadata.json:148-156","confidence":"high"}],"risks":["Adding nested graph-metadata.json files would create separate advisor nodes or parser failures, breaking the one-identity keystone.","Registry-driven routing must preserve existing parity fixture outputs for research, review, and ai-council while extending coverage to context and improvement lanes.","Current category/schema validators may have drift around category workflow; verify legacy compiler behavior before turning /doctor:parent-skill into a hard gate."],"standardize":["Parent root owns the only advisor-discoverable graph-metadata.json; nested packets and shared/ are non-discoverable.","mode-registry.json owns workflowMode, runtimeLoopType, backendKind, packet, command, agent, artifactRoot, aliases, and any packet-name exception metadata.","Default packet folder == packet SKILL.md name; exceptions require explicit registry declaration and validator evidence.","Hub Keywords, intent_signals, and derived.trigger_phrases are generated or validated from registry aliases plus packet names/keywords.","sk-doc parent-skill definition, /create:parent-skill scaffolder, /doctor:parent-skill validator, and routing/discovery benchmark."],"open_questions":["Should ai-council remain a permanent explicit exception or be renamed after registry-driven routing lands?","Should Python --deep-skill-routing-json expose all eight workflow modes or only the historical Candidate-3 modes plus a separate advisor mode layer?","Should category workflow be added to every legacy category validator before parent-skill validation is hardened?"]}
===END===

## Structured output

```json
{
  "angle": "naming-discovery-conventions",
  "recommendation": "Pick A: keep one discoverable parent identity, make advisor routing registry-driven from mode-registry.json, and standardize folder==SKILL.md name by default with explicit registry-declared exceptions such as ai-council.",
  "model_pick": "A",
  "key_findings": [
    {
      "claim": "The hub is the one advisor identity: graph-metadata declares skill_id deep-loop-workflows and family deep-loop, and the hub rules require exactly one graph-metadata.json.",
      "evidence": ".opencode/skills/deep-loop-workflows/graph-metadata.json:4-5; .opencode/skills/deep-loop-workflows/SKILL.md:77-86",
      "confidence": "high"
    },
    {
      "claim": "Advisor discovery recursively indexes every graph-metadata.json and rejects skill_id values that do not match the containing folder, making discoverable nested packets a separate-identity model and risky for ai-council.",
      "evidence": ".opencode/skills/system-skill-advisor/mcp_server/lib/skill-graph/skill-graph-db.ts:601-625; .opencode/skills/system-skill-advisor/mcp_server/lib/skill-graph/skill-graph-db.ts:654-658",
      "confidence": "high"
    },
    {
      "claim": "Routing is currently duplicated outside the registry in Python and TypeScript, despite mode-registry.json declaring itself the routing source of truth.",
      "evidence": ".opencode/skills/deep-loop-workflows/mode-registry.json:2-8; .opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py:2319-2324; .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/aliases.ts:90-101",
      "confidence": "high"
    },
    {
      "claim": "Four packet folders match their SKILL.md name, while ai-council intentionally differs from name: deep-ai-council.",
      "evidence": ".opencode/skills/deep-loop-workflows/deep-context/SKILL.md:1-8; .opencode/skills/deep-loop-workflows/ai-council/SKILL.md:1-8; .opencode/specs/skilled-agent-orchestration/117-parent-nested-skill-pattern/001-rename-fix-and-shared-decision/decision-record.md:90-98",
      "confidence": "high"
    },
    {
      "claim": "Hub Keywords and derived trigger phrases are advisor-relevant under one identity; nested packet Keywords preserve local packet contracts but are not the discovered projection unless packet metadata is added.",
      "evidence": ".opencode/skills/system-skill-advisor/mcp_server/lib/scorer/projection.ts:179-218; .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/lexical.ts:66-75; .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/bm25.ts:14-32",
      "confidence": "high"
    },
    {
      "claim": "Current hub docs and derived source_docs still contain stale bare packet names, so a parent-skill validator should check naming drift.",
      "evidence": ".opencode/skills/deep-loop-workflows/SKILL.md:58-68; .opencode/skills/deep-loop-workflows/graph-metadata.json:148-156",
      "confidence": "high"
    }
  ],
  "risks": [
    "Adding nested graph-metadata.json files would create separate advisor nodes or parser failures, breaking the one-identity keystone.",
    "Registry-driven routing must preserve existing parity fixture outputs for research, review, and ai-council while extending coverage to context and improvement lanes.",
    "Current category/schema validators may have drift around category workflow; verify legacy compiler behavior before turning /doctor:parent-skill into a hard gate."
  ],
  "standardize": [
    "Parent root owns the only advisor-discoverable graph-metadata.json; nested packets and shared/ are non-discoverable.",
    "mode-registry.json owns workflowMode, runtimeLoopType, backendKind, packet, command, agent, artifactRoot, aliases, and any packet-name exception metadata.",
    "Default packet folder == packet SKILL.md name; exceptions require explicit registry declaration and validator evidence.",
    "Hub Keywords, intent_signals, and derived.trigger_phrases are generated or validated from registry aliases plus packet names/keywords.",
    "sk-doc parent-skill definition, /create:parent-skill scaffolder, /doctor:parent-skill validator, and routing/discovery benchmark."
  ],
  "open_questions": [
    "Should ai-council remain a permanent explicit exception or be renamed after registry-driven routing lands?",
    "Should Python --deep-skill-routing-json expose all eight workflow modes or only the historical Candidate-3 modes plus a separate advisor mode layer?",
    "Should category workflow be added to every legacy category validator before parent-skill validation is hardened?"
  ]
}
```
