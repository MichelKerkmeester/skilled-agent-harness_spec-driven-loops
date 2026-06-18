# Iteration 001 — Routing/identity model selection (A/B/C/D)

- **Model**: gpt-5.5-fast xhigh (cli-opencode, read-only)
- **Seat**: 001
- **model_pick**: A

## Analysis

**Model Pick: A**
Choose **A) ONE-IDENTITY + REGISTRY-DRIVEN**. It is the smallest change that preserves the B5 one-identity keystone, closes the hardcode drift gap, and keeps the existing parity contract `{ skill: deep-loop-workflows, mode }`.

**Core Evidence**
| Claim | Evidence |
| --- | --- |
| The scanner recursively discovers every `graph-metadata.json`, including nested ones. | `.opencode/skills/system-skill-advisor/mcp_server/lib/skill-graph/skill-graph-db.ts:601-625` |
| Any discovered metadata must have `skill_id == basename(folder)`. | `.opencode/skills/system-skill-advisor/mcp_server/lib/skill-graph/skill-graph-db.ts:654-658` |
| `deep-loop` is already an allowed discoverable family. | `.opencode/skills/system-skill-advisor/mcp_server/lib/skill-graph/skill-graph-db.ts:133-140` |
| The hub has exactly one discoverable identity: `skill_id=deep-loop-workflows`, `family=deep-loop`. | `.opencode/skills/deep-loop-workflows/graph-metadata.json:4-5` |
| The registry already contains the complete mode contract: `workflowMode`, `runtimeLoopType`, `backendKind`, packet, command, agent, aliases. | `.opencode/skills/deep-loop-workflows/mode-registry.json:5-97` |
| The advisor does not currently honor the hub’s “registry-driven” claim; Python hardcodes mode projection. | `.opencode/skills/deep-loop-workflows/SKILL.md:36`, `.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py:2320-2324` |
| The TS alias layer also hardcodes merged identity and mode projection. | `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/aliases.ts:90-101` |
| Existing parity fixtures require preserving `{ skill: deep-loop-workflows, mode }`, not separate skill IDs. | `.opencode/skills/system-skill-advisor/mcp_server/tests/routing-parity-deep-skills.vitest.ts:5-10`, `.opencode/skills/system-skill-advisor/mcp_server/tests/routing-parity-deep-skills.vitest.ts:62-64`, `.opencode/skills/system-skill-advisor/mcp_server/tests/routing-parity-deep-council.vitest.ts:5-8`, `.opencode/skills/system-skill-advisor/mcp_server/tests/routing-parity-deep-council.vitest.ts:110-112` |

**Model Scores**
| Model | Requires | Breaks / Cost | Accuracy | Safety | Drift | Reuse |
| --- | --- | --- | ---: | ---: | ---: | ---: |
| A | Keep scanner identity behavior; add Python + TS registry loaders; derive mode maps from `mode-registry.json`; preserve current output shape. | Must add all legacy aliases to registry or merge them during transition. | 5 | 5 | 5 | 5 |
| B | Add nested packet `graph-metadata.json` files. Scanner will discover them recursively. Each `skill_id` must equal the packet folder. | Breaks one-identity keystone and current parity fixtures. `ai-council/` could only be `skill_id=ai-council` unless scanner is relaxed, despite its `SKILL.md` name being `deep-ai-council`. | 2 | 1 | 3 | 2 |
| C | No changes. | Leaves documented registry contract false and keeps Python/TS hardcode drift. | 3 | 5 | 1 | 1 |
| D | Add a non-skill “virtual mode” discovery layer, likely a new scanner table or sidecar harvest from `mode-registry.json`. | More schema and mental-model complexity than A; if implemented as nested metadata, it collapses into B’s breakage. | 5 | 4 | 4 | 3 |

**Recommended Design**
Implement **A** as a parent-skill pattern:

| Surface | Design |
| --- | --- |
| Discovery identity | Exactly one `graph-metadata.json` at the parent folder. Never add packet-level `graph-metadata.json`. |
| Mode source | `mode-registry.json` is the only source for `workflowMode`, `runtimeLoopType`, `backendKind`, packet, command, agent, and aliases. |
| Python advisor | Replace `DEEP_ROUTING_MODE_BY_KEY` projection with a registry-derived map. Keep Candidate-3 scoring internals keyed by legacy discriminators where needed, but project winners through registry entries. |
| TS advisor | Replace `MERGED_DEEP_SKILL_ID` / `DEEP_MODE_BY_CANONICAL` hardcode with a registry-derived projection. Preserve legacy alias tests by moving old aliases into registry or a transitional `legacyAliases` field. |
| Scanner | No required scanner change for A. Add validator/doctor checks rather than changing indexing semantics. |
| Tests | Keep existing parity fixtures unchanged. Add registry parity tests that compare Python and TS projections against `mode-registry.json`. |

**Naming / Discovery Conventions**
The discoverable parent folder, graph metadata `skill_id`, and advisor identity must match exactly because the scanner enforces `skill_id == folderName` (`skill-graph-db.ts:654-658`). Mode packet folders do not need discoverable IDs because they must not carry graph metadata.

The accepted `ai-council/` folder and `name: deep-ai-council` mismatch is safe only under A/C/D because no packet `graph-metadata.json` is present. Under B, that mismatch becomes a scanner or identity problem.

One doc drift should be cleaned up when edits are allowed: the hub `SKILL.md` still documents packet paths as `context/ research/ review/ improvement/`, while the actual registry and files use `deep-context`, `deep-research`, `deep-review`, `deep-improvement` (`SKILL.md:64`, `SKILL.md:97`, `mode-registry.json:15`, `mode-registry.json:25`, `mode-registry.json:35`, `mode-registry.json:55`).

**Standardize**
| Item | Standard |
| --- | --- |
| `sk-doc` definition | “Parent skill” means one discoverable graph identity plus a registry-driven set of non-discoverable mode packets. |
| `/create:parent-skill` | Scaffold hub `SKILL.md`, one `graph-metadata.json`, `mode-registry.json`, packet folders, packet `SKILL.md`s, and parity fixtures. |
| `/doctor:parent-skill` | Read-only validator: exactly one metadata file, no nested metadata, registry schema valid, packet dirs exist, aliases unique, Python and TS projections match registry. |
| Benchmark | A routing/discovery battery that asserts one skill node, all registry aliases route to the parent plus correct mode, and Python/TS routing agree. |

**Could Not Verify**
I could not verify an existing `/create:parent-skill` or `/doctor:parent-skill` command. Existing `/create:skill` is a general skill router (`.opencode/commands/create/skill.md:7-29`), and current doctor assets cover skill-advisor and deep-loop diagnostics but not parent-skill validation (`.opencode/commands/doctor/assets/doctor_skill-advisor.yaml:20-28`, `.opencode/commands/doctor/assets/doctor_deep-loop.yaml:24-31`).

===RESEARCH-JSON===
{"angle":"routing-identity-model","recommendation":"Choose A: keep one discoverable parent identity and make both advisor routing layers derive mode projections from mode-registry.json.","model_pick":"A","key_findings":[{"claim":"The scanner recursively discovers every graph-metadata.json and enforces skill_id == containing folder, so nested packet metadata would become separate skill nodes and cannot reuse the parent identity.","evidence":".opencode/skills/system-skill-advisor/mcp_server/lib/skill-graph/skill-graph-db.ts:601-625,654-658","confidence":"high"},{"claim":"deep-loop-workflows already has the intended single discoverable identity and deep-loop family metadata.","evidence":".opencode/skills/deep-loop-workflows/graph-metadata.json:4-5","confidence":"high"},{"claim":"mode-registry.json already contains the reusable three-tier discriminator and all eight mode entries needed for registry-driven routing.","evidence":".opencode/skills/deep-loop-workflows/mode-registry.json:5-97","confidence":"high"},{"claim":"The current advisor violates the hub's registry-driven claim because Python and TS still hardcode mode projections.","evidence":".opencode/skills/deep-loop-workflows/SKILL.md:36; .opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py:2320-2324; .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/aliases.ts:90-101","confidence":"high"},{"claim":"Existing parity fixtures require preserving the merged skill plus concrete mode output shape.","evidence":".opencode/skills/system-skill-advisor/mcp_server/tests/routing-parity-deep-skills.vitest.ts:5-10,62-64; .opencode/skills/system-skill-advisor/mcp_server/tests/routing-parity-deep-council.vitest.ts:5-8,110-112","confidence":"high"}],"risks":["Registry aliases do not yet include every legacy alias present in Python/TS, so migration must add legacyAliases or a compatibility merge.","Hub SKILL.md packet path docs drift from the actual deep-* registry paths.","Could not verify existing /create:parent-skill or /doctor:parent-skill commands."],"standardize":["sk-doc parent-skill definition: one graph-metadata.json identity plus registry-driven non-discoverable mode packets.","/create:parent-skill scaffolder for hub SKILL.md, graph-metadata.json, mode-registry.json, packet folders, and parity fixtures.","/doctor:parent-skill read-only validator for one-identity, no nested metadata, registry schema, packet existence, alias uniqueness, and Python/TS projection parity.","routing/discovery benchmark asserting one skill node and correct parent-plus-mode routing for every registry alias."],"open_questions":["Should legacy command aliases such as command-spec-kit-deep-review and /deep:start-review-loop live in mode-registry.json as legacyAliases or in a transitional compatibility table?","Should the TS mode alias seam be wired into runtime scorer code beyond its current tested alias contract?"]}
===END===

## Structured output

```json
{
  "angle": "routing-identity-model",
  "recommendation": "Choose A: keep one discoverable parent identity and make both advisor routing layers derive mode projections from mode-registry.json.",
  "model_pick": "A",
  "key_findings": [
    {
      "claim": "The scanner recursively discovers every graph-metadata.json and enforces skill_id == containing folder, so nested packet metadata would become separate skill nodes and cannot reuse the parent identity.",
      "evidence": ".opencode/skills/system-skill-advisor/mcp_server/lib/skill-graph/skill-graph-db.ts:601-625,654-658",
      "confidence": "high"
    },
    {
      "claim": "deep-loop-workflows already has the intended single discoverable identity and deep-loop family metadata.",
      "evidence": ".opencode/skills/deep-loop-workflows/graph-metadata.json:4-5",
      "confidence": "high"
    },
    {
      "claim": "mode-registry.json already contains the reusable three-tier discriminator and all eight mode entries needed for registry-driven routing.",
      "evidence": ".opencode/skills/deep-loop-workflows/mode-registry.json:5-97",
      "confidence": "high"
    },
    {
      "claim": "The current advisor violates the hub's registry-driven claim because Python and TS still hardcode mode projections.",
      "evidence": ".opencode/skills/deep-loop-workflows/SKILL.md:36; .opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py:2320-2324; .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/aliases.ts:90-101",
      "confidence": "high"
    },
    {
      "claim": "Existing parity fixtures require preserving the merged skill plus concrete mode output shape.",
      "evidence": ".opencode/skills/system-skill-advisor/mcp_server/tests/routing-parity-deep-skills.vitest.ts:5-10,62-64; .opencode/skills/system-skill-advisor/mcp_server/tests/routing-parity-deep-council.vitest.ts:5-8,110-112",
      "confidence": "high"
    }
  ],
  "risks": [
    "Registry aliases do not yet include every legacy alias present in Python/TS, so migration must add legacyAliases or a compatibility merge.",
    "Hub SKILL.md packet path docs drift from the actual deep-* registry paths.",
    "Could not verify existing /create:parent-skill or /doctor:parent-skill commands."
  ],
  "standardize": [
    "sk-doc parent-skill definition: one graph-metadata.json identity plus registry-driven non-discoverable mode packets.",
    "/create:parent-skill scaffolder for hub SKILL.md, graph-metadata.json, mode-registry.json, packet folders, and parity fixtures.",
    "/doctor:parent-skill read-only validator for one-identity, no nested metadata, registry schema, packet existence, alias uniqueness, and Python/TS projection parity.",
    "routing/discovery benchmark asserting one skill node and correct parent-plus-mode routing for every registry alias."
  ],
  "open_questions": [
    "Should legacy command aliases such as command-spec-kit-deep-review and /deep:start-review-loop live in mode-registry.json as legacyAliases or in a transitional compatibility table?",
    "Should the TS mode alias seam be wired into runtime scorer code beyond its current tested alias contract?"
  ]
}
```
