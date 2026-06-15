# Iteration 009 — /doctor:parent-skill validator design

- **Model**: gpt-5.5-fast xhigh (cli-opencode, read-only)
- **Seat**: 009
- **model_pick**: A

## Analysis

**Recommendation**
Pick **A) ONE-IDENTITY + REGISTRY-DRIVEN**. Keep exactly one advisor-discoverable `graph-metadata.json` at `.opencode/skills/deep-loop-workflows/graph-metadata.json`, and make the advisor's Python and TypeScript mode projections load `mode-registry.json` instead of carrying parallel hardcoded maps.

**Why A**
| Model | Assessment |
| --- | --- |
| A | Best fit. The hub metadata already declares `skill_id: deep-loop-workflows` and `family: deep-loop` at `.opencode/skills/deep-loop-workflows/graph-metadata.json:4-5`, while `mode-registry.json` already carries the three-tier discriminator at `.opencode/skills/deep-loop-workflows/mode-registry.json:5-9`. |
| B | Not recommended. Advisor discovery recursively indexes every `graph-metadata.json` under the skill root at `.opencode/skills/system-skill-advisor/mcp_server/lib/skill-graph/skill-graph-db.ts:601-625`, so per-packet metadata would create multiple advisor nodes or throw on folder/name mismatch. The `ai-council` packet's accepted `name: deep-ai-council` mismatch would be incompatible with `skill_id == basename(folder)` if copied into packet metadata, because that throw is explicit at `.opencode/skills/system-skill-advisor/mcp_server/lib/skill-graph/skill-graph-db.ts:654-658`. |
| C | Current state, but unsafe. The hub says routing is registry-driven at `.opencode/skills/deep-loop-workflows/SKILL.md:36`, while Python hardcodes `DEEP_ROUTING_MODE_BY_KEY` at `.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py:2319-2324` and TypeScript hardcodes `DEEP_MODE_BY_CANONICAL` at `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/aliases.ts:90-101`. |
| D | Only useful if "hybrid" means non-discoverable generated hints under the single hub identity. Do not add nested `graph-metadata.json`; that violates the one-identity keystone and the current recursive discovery behavior. |

**Doctor Validator**
The current doctor router is target-based: `_routes.yaml` calls itself the source of truth for `/doctor <target>` at `.opencode/commands/doctor/_routes.yaml:4-10`, while colon forms are separate companion or standalone commands at `.opencode/commands/doctor/_routes.yaml:158-195`. I would implement this as `/doctor parent-skill` unless you intentionally add a new standalone `/doctor:parent-skill` command.

| Invariant | Concrete Check | Failure Message |
| --- | --- | --- |
| `PARENT_IDENTITY_SINGLETON` | Recursively walk `<skillRoot>` for `graph-metadata.json`; require exactly one file and require it at `<skillRoot>/graph-metadata.json`. This mirrors the advisor's recursive discovery at `.opencode/skills/system-skill-advisor/mcp_server/lib/skill-graph/skill-graph-db.ts:601-625`. | `FAIL PARENT_IDENTITY_SINGLETON: expected exactly one graph-metadata.json at {root}/graph-metadata.json; found {count}: {paths}` |
| `HUB_METADATA_VALID` | Parse the hub metadata and apply the same fatal rules as `parseSkillMetadata`: `schema_version` is `1|2`, `skill_id` exists, `skill_id == basename(dirname(sourcePath))`, `family` exists, and family is one of `cli|mcp|sk-code|deep-loop|sk-util|system`. Evidence: `.opencode/skills/system-skill-advisor/mcp_server/lib/skill-graph/skill-graph-db.ts:133-140` and `.opencode/skills/system-skill-advisor/mcp_server/lib/skill-graph/skill-graph-db.ts:648-663`. | `FAIL HUB_METADATA_VALID: {path}: skill_id "{skillId}" does not match folder name "{folderName}"` or `FAIL HUB_METADATA_VALID: {path}: family "{family}" is not supported; expected one of cli,mcp,sk-code,deep-loop,sk-util,system` |
| `NO_PACKET_METADATA` | Reject any `graph-metadata.json` below a mode packet or `shared/`. The hub contract says packets carry no `graph-metadata.json` at `.opencode/skills/deep-loop-workflows/SKILL.md:68` and forbids discoverable markers in packets/shared at `.opencode/skills/deep-loop-workflows/SKILL.md:86`. | `FAIL NO_PACKET_METADATA: nested graph-metadata.json is discoverable by the advisor and violates one-identity parent-skill layout: {paths}` |
| `REGISTRY_EXISTS_AND_OWNS_SKILL` | Require `<skillRoot>/mode-registry.json`, require `skill` to equal the hub folder basename, and require `modes` to be a non-empty array. The current registry declares `skill: deep-loop-workflows` at `.opencode/skills/deep-loop-workflows/mode-registry.json:2` and `modes` at `.opencode/skills/deep-loop-workflows/mode-registry.json:10-97`. | `FAIL REGISTRY_EXISTS_AND_OWNS_SKILL: mode-registry.json skill "{skill}" does not match parent folder "{folderName}"` |
| `REGISTRY_PACKET_DIRS` | Build `distinct(modes[].packet)` and compare it to direct child dirs with `SKILL.md`, excluding `shared`. Current registry packet values include `deep-context`, `deep-research`, `deep-review`, `ai-council`, and `deep-improvement` at `.opencode/skills/deep-loop-workflows/mode-registry.json:15,25,35,45,55,67,78,89`. | `FAIL REGISTRY_PACKET_DIRS: registry packets do not match packet directories; missing_dirs={missing}; unregistered_dirs={extra}` |
| `REGISTRY_MODE_UNIQUENESS` | Require unique `workflowMode` values. Current workflow modes span context, research, review, ai-council, and four improvement lanes at `.opencode/skills/deep-loop-workflows/mode-registry.json:12-96`. | `FAIL REGISTRY_MODE_UNIQUENESS: duplicate workflowMode values in mode-registry.json: {duplicates}` |
| `DISCRIMINATOR_COMPLETE` | For every mode, require explicit `workflowMode`, `runtimeLoopType` key, `backendKind`, `packet`, `command`, and `agent`. The discriminator fields are documented at `.opencode/skills/deep-loop-workflows/mode-registry.json:5-9`. | `FAIL DISCRIMINATOR_COMPLETE: mode at index {i} missing required field(s): {fields}` |
| `RUNTIME_LOOP_TYPE_VALID` | If `backendKind == "runtime-loop-type"`, require `runtimeLoopType` in `research|review|council|context`. The runtime enforces that union at `.opencode/skills/deep-loop-runtime/scripts/convergence.cjs:308-312`, `.opencode/skills/deep-loop-runtime/scripts/status.cjs:92-94`, `.opencode/skills/deep-loop-runtime/scripts/query.cjs:93-97`, and `.opencode/skills/deep-loop-runtime/scripts/upsert.cjs:107-109`. | `FAIL RUNTIME_LOOP_TYPE_VALID: mode "{workflowMode}" has runtimeLoopType "{value}"; expected research,review,council,context for backendKind runtime-loop-type` |
| `NULL_RUNTIME_FOR_IMPROVEMENT` | If `backendKind` is `improvement-host` or `external-adapter`, require `runtimeLoopType === null`. The registry states explicit null is required and never inferred at `.opencode/skills/deep-loop-workflows/mode-registry.json:7`, and the hub repeats it at `.opencode/skills/deep-loop-workflows/SKILL.md:40,83-84`. | `FAIL NULL_RUNTIME_FOR_IMPROVEMENT: mode "{workflowMode}" uses backendKind "{backendKind}" but runtimeLoopType is "{value}"; expected explicit null` |
| `BACKEND_KIND_VALID` | Require `backendKind` in `runtime-loop-type|improvement-host|external-adapter`. Current examples are at `.opencode/skills/deep-loop-workflows/mode-registry.json:14,24,34,44,54,66,77,88`. | `FAIL BACKEND_KIND_VALID: mode "{workflowMode}" has unsupported backendKind "{backendKind}"` |
| `BACKEND_MODE_FIELDS` | For `improvement-host`, require `loopHostMode`; for `external-adapter`, require `loopHostMode` and `externalLoopOwner`. Current improvement-host fields are at `.opencode/skills/deep-loop-workflows/mode-registry.json:52-83`; current external-adapter fields are at `.opencode/skills/deep-loop-workflows/mode-registry.json:86-95`. | `FAIL BACKEND_MODE_FIELDS: mode "{workflowMode}" with backendKind "{backendKind}" missing required field(s): {fields}` |
| `PACKET_CONTRACT_PRESERVED` | Require each registered packet to have its own `SKILL.md`; require frontmatter `name` to equal the packet folder except the accepted `ai-council -> deep-ai-council` mismatch. Evidence: packet names at `.opencode/skills/deep-loop-workflows/deep-context/SKILL.md:1-5`, `.opencode/skills/deep-loop-workflows/deep-research/SKILL.md:1-6`, `.opencode/skills/deep-loop-workflows/deep-review/SKILL.md:1-6`, `.opencode/skills/deep-loop-workflows/deep-improvement/SKILL.md:1-5`, and `.opencode/skills/deep-loop-workflows/ai-council/SKILL.md:1-5`. | `FAIL PACKET_CONTRACT_PRESERVED: {packet}/SKILL.md frontmatter name "{name}" is not "{packet}" and is not an accepted mismatch` |
| `PACKET_CONTRACT_NOT_FLATTENED` | Do not require packet `allowed-tools` to match. The per-mode contracts differ: research allows `WebFetch` and memory tools at `.opencode/skills/deep-loop-workflows/deep-research/SKILL.md:4`, review allows `code_graph_query` and no `WebFetch` at `.opencode/skills/deep-loop-workflows/deep-review/SKILL.md:4`, and improvement has its own bounded mutator surface at `.opencode/skills/deep-loop-workflows/deep-improvement/SKILL.md:4`. | `FAIL PACKET_CONTRACT_NOT_FLATTENED: validator attempted to normalize per-packet allowed-tools; parent-skill validation must preserve packet-local contracts` |
| `PY_ROUTING_PARITY` | Compare Python's merged skill id and mode map to the registry-derived expected map. Current Python constants are at `.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py:2307-2324`, and the payload emits `{skill, mode, scores}` from that map at `.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py:2523-2533`. | `FAIL PY_ROUTING_PARITY: Python deep routing map differs from mode-registry.json; expected {expected}; found {found}` |
| `TS_ROUTING_PARITY` | Compare TypeScript `MERGED_DEEP_SKILL_ID` and `DEEP_MODE_BY_CANONICAL` to the registry-derived expected map. Current TS constants and projection are at `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/aliases.ts:90-101` and `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/aliases.ts:103-130`. | `FAIL TS_ROUTING_PARITY: TypeScript deep alias map differs from mode-registry.json; expected {expected}; found {found}` |
| `PARITY_FIXTURE_GUARD` | Execute or parse the existing parity fixtures and require every expected `{skill, mode}` to be present in the registry. The fixtures explicitly assert merged skill plus mode at `.opencode/skills/system-skill-advisor/mcp_server/tests/routing-parity-deep-skills.vitest.ts:5-10`, `.opencode/skills/system-skill-advisor/mcp_server/tests/routing-parity-deep-skills.vitest.ts:62-64`, and `.opencode/skills/system-skill-advisor/mcp_server/tests/routing-parity-deep-council.vitest.ts:105-115`. | `FAIL PARITY_FIXTURE_GUARD: routing fixture "{id}" expected {skill:"deep-loop-workflows",mode:"{mode}"} but registry does not define that workflowMode` |
| `HUB_DOC_LAYOUT_PARITY` | Warn if hub docs list packet names that differ from registry `packet` values. Current hub docs still name `context/ research/ review/ improvement/` at `.opencode/skills/deep-loop-workflows/SKILL.md:58-68` and `.opencode/skills/deep-loop-workflows/README.md:17-27`, while the registry uses `deep-context`, `deep-research`, `deep-review`, `ai-council`, and `deep-improvement` at `.opencode/skills/deep-loop-workflows/mode-registry.json:15,25,35,45,55`. | `WARN HUB_DOC_LAYOUT_PARITY: hub docs list packet dirs {docDirs} but registry packets are {registryPackets}; update docs or registry before standardizing this pattern` |
| `SHARED_NONDISCOVERABLE` | Allow `shared/` helpers, but reject `shared/SKILL.md` and `shared/**/graph-metadata.json`. The shared resource-map file describes itself as workflow-shared and non-runtime plumbing at `.opencode/skills/deep-loop-workflows/shared/synthesis/resource-map.cjs:4-9`. | `FAIL SHARED_NONDISCOVERABLE: shared/ contains advisor-discoverable marker(s): {paths}` |

**Registry-Driven Routing Detail**
The registry can drive routing, but one ambiguity needs standardization: `deep-improvement` is one packet backing four workflow modes at `.opencode/skills/deep-loop-workflows/mode-registry.json:52-96`, while TypeScript currently maps legacy `deep-improvement` only to `agent-improvement` at `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/aliases.ts:92-101`. The simplest non-breaking fix is to add an advisor routing section to `mode-registry.json`, or a per-mode field like `advisorCanonicalKey`, so the default legacy key is explicit instead of inferred from array order.

**Standardize**
| Surface | Standard |
| --- | --- |
| `sk-doc` | Add a "parent skill with mode packets" definition: one hub `SKILL.md`, one hub `graph-metadata.json`, one `mode-registry.json`, packet-local `SKILL.md` contracts, and no nested advisor metadata. |
| `/create:parent-skill` | Scaffold the hub, registry, README, and packet folders; drop per-packet `graph-metadata.json`; require explicit accepted name mismatches like `ai-council -> deep-ai-council`. |
| `/doctor parent-skill` | Add a read-only route and validator with the invariants above. The route manifest supports read-only targets and Gate 3 `n/a` locations at `.opencode/commands/doctor/_routes.yaml:101-117`. |
| Routing benchmark | Run registry-derived fixtures through Python `--deep-skill-routing-json` and native TS alias projection; assert `{skill:"deep-loop-workflows", mode}` parity, preserving the current fixture contract at `.opencode/skills/system-skill-advisor/mcp_server/tests/routing-parity-deep-skills.vitest.ts:39-50`. |
| Discovery benchmark | Simulate `discoverGraphMetadataFiles` and `parseSkillMetadata` without writing to SQLite, because the advisor's live indexer mutates state after discovery at `.opencode/skills/system-skill-advisor/mcp_server/lib/skill-graph/skill-graph-db.ts:843-860`. |

**Risks**
- The current hub docs are already drifted from the registry packet names, so standardizing from docs alone would encode the wrong layout.
- The "backend has NO system-spec-kit dependency" claim is not verified. Runtime code imports `zod` and `better-sqlite3` from `system-spec-kit` at `.opencode/skills/deep-loop-runtime/lib/deep-loop/executor-config.ts:1-4` and `.opencode/skills/deep-loop-runtime/lib/coverage-graph/coverage-graph-db.ts:1-4`, and runtime docs say this is why graph metadata lists `system-spec-kit` under `depends_on` at `.opencode/skills/deep-loop-runtime/references/integration_points.md:102-107`.
- If Model A is implemented without an explicit advisor routing key, `deep-improvement` default-mode selection can remain implicit and drift-prone.
- If Model B is attempted, the advisor will either index separate packet skills or throw on accepted name/folder mismatches.

===RESEARCH-JSON===
{"angle":"doctor-parent-skill-validator","recommendation":"Adopt Model A: keep one hub advisor identity and make both advisor routing layers read mode-registry.json, with /doctor parent-skill enforcing one-identity, registry, packet, and routing parity invariants.","model_pick":"A","key_findings":[{"claim":"Advisor discovery recursively indexes every graph-metadata.json, so nested packet metadata is incompatible with one-identity parent skills.","evidence":".opencode/skills/system-skill-advisor/mcp_server/lib/skill-graph/skill-graph-db.ts:601-625","confidence":"high"},{"claim":"Advisor metadata parsing throws when skill_id does not match the containing folder basename, which would reject a discoverable ai-council packet declaring skill_id deep-ai-council.","evidence":".opencode/skills/system-skill-advisor/mcp_server/lib/skill-graph/skill-graph-db.ts:654-658","confidence":"high"},{"claim":"mode-registry.json already carries the required three-tier discriminator and eight workflow modes, including explicit null runtimeLoopType for improvement modes.","evidence":".opencode/skills/deep-loop-workflows/mode-registry.json:5-9,52-96","confidence":"high"},{"claim":"Python and TypeScript advisor routing still hardcode merged deep-loop mode maps instead of consuming the registry.","evidence":".opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py:2319-2324; .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/aliases.ts:90-101","confidence":"high"},{"claim":"Parity fixtures require both the merged skill and concrete mode, so registry-driven routing can preserve behavior if it still emits {skill:deep-loop-workflows,mode}.","evidence":".opencode/skills/system-skill-advisor/mcp_server/tests/routing-parity-deep-skills.vitest.ts:5-10","confidence":"high"},{"claim":"The claimed runtime independence from system-spec-kit is contradicted by current runtime imports and integration docs.","evidence":".opencode/skills/deep-loop-runtime/lib/deep-loop/executor-config.ts:1-4; .opencode/skills/deep-loop-runtime/references/integration_points.md:102-107","confidence":"high"}],"risks":["deep-improvement maps one packet to four workflow modes, so registry-driven advisor routing needs an explicit advisor default key rather than array-order inference.","Hub SKILL.md and README currently list stale packet folder names, so documentation-driven scaffolding would drift from the actual registry.","Adding nested graph-metadata.json would either create multiple advisor identities or trigger basename mismatch failures."],"standardize":["sk-doc parent-skill definition with one hub identity, registry, non-discoverable packets, and packet-local contracts","/create:parent-skill scaffolder that emits hub metadata plus mode-registry.json and drops packet graph-metadata.json","/doctor parent-skill read-only validator with singleton discovery, registry, packet, discriminator, and routing-parity checks","routing/discovery benchmark that simulates advisor discovery and runs Python plus TS routing parity fixtures","mode-registry advisorRouting fields for legacy canonical aliases and default shared-packet modes"],"open_questions":["Should the public command be target-style /doctor parent-skill to match _routes.yaml, or a new standalone /doctor:parent-skill colon command?","Should deep-loop-runtime remove its system-spec-kit imports before the parent-skill pattern documents the backend as dependency-free?","Should ai-council -> deep-ai-council be hardcoded as the only accepted packet/name mismatch or represented explicitly in mode-registry.json?"]}
===END===

## Structured output

```json
{
  "angle": "doctor-parent-skill-validator",
  "recommendation": "Adopt Model A: keep one hub advisor identity and make both advisor routing layers read mode-registry.json, with /doctor parent-skill enforcing one-identity, registry, packet, and routing parity invariants.",
  "model_pick": "A",
  "key_findings": [
    {
      "claim": "Advisor discovery recursively indexes every graph-metadata.json, so nested packet metadata is incompatible with one-identity parent skills.",
      "evidence": ".opencode/skills/system-skill-advisor/mcp_server/lib/skill-graph/skill-graph-db.ts:601-625",
      "confidence": "high"
    },
    {
      "claim": "Advisor metadata parsing throws when skill_id does not match the containing folder basename, which would reject a discoverable ai-council packet declaring skill_id deep-ai-council.",
      "evidence": ".opencode/skills/system-skill-advisor/mcp_server/lib/skill-graph/skill-graph-db.ts:654-658",
      "confidence": "high"
    },
    {
      "claim": "mode-registry.json already carries the required three-tier discriminator and eight workflow modes, including explicit null runtimeLoopType for improvement modes.",
      "evidence": ".opencode/skills/deep-loop-workflows/mode-registry.json:5-9,52-96",
      "confidence": "high"
    },
    {
      "claim": "Python and TypeScript advisor routing still hardcode merged deep-loop mode maps instead of consuming the registry.",
      "evidence": ".opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py:2319-2324; .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/aliases.ts:90-101",
      "confidence": "high"
    },
    {
      "claim": "Parity fixtures require both the merged skill and concrete mode, so registry-driven routing can preserve behavior if it still emits {skill:deep-loop-workflows,mode}.",
      "evidence": ".opencode/skills/system-skill-advisor/mcp_server/tests/routing-parity-deep-skills.vitest.ts:5-10",
      "confidence": "high"
    },
    {
      "claim": "The claimed runtime independence from system-spec-kit is contradicted by current runtime imports and integration docs.",
      "evidence": ".opencode/skills/deep-loop-runtime/lib/deep-loop/executor-config.ts:1-4; .opencode/skills/deep-loop-runtime/references/integration_points.md:102-107",
      "confidence": "high"
    }
  ],
  "risks": [
    "deep-improvement maps one packet to four workflow modes, so registry-driven advisor routing needs an explicit advisor default key rather than array-order inference.",
    "Hub SKILL.md and README currently list stale packet folder names, so documentation-driven scaffolding would drift from the actual registry.",
    "Adding nested graph-metadata.json would either create multiple advisor identities or trigger basename mismatch failures."
  ],
  "standardize": [
    "sk-doc parent-skill definition with one hub identity, registry, non-discoverable packets, and packet-local contracts",
    "/create:parent-skill scaffolder that emits hub metadata plus mode-registry.json and drops packet graph-metadata.json",
    "/doctor parent-skill read-only validator with singleton discovery, registry, packet, discriminator, and routing-parity checks",
    "routing/discovery benchmark that simulates advisor discovery and runs Python plus TS routing parity fixtures",
    "mode-registry advisorRouting fields for legacy canonical aliases and default shared-packet modes"
  ],
  "open_questions": [
    "Should the public command be target-style /doctor parent-skill to match _routes.yaml, or a new standalone /doctor:parent-skill colon command?",
    "Should deep-loop-runtime remove its system-spec-kit imports before the parent-skill pattern documents the backend as dependency-free?",
    "Should ai-council -> deep-ai-council be hardcoded as the only accepted packet/name mismatch or represented explicitly in mode-registry.json?"
  ]
}
```
