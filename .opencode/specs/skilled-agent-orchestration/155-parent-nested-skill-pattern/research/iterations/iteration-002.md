# Iteration 002 — Registry-driven routing feasibility + design

- **Model**: gpt-5.5-fast xhigh (cli-opencode, read-only)
- **Seat**: 002
- **model_pick**: A

## Analysis

**Recommendation**

Pick **A) ONE-IDENTITY + REGISTRY-DRIVEN**. Keep `deep-loop-workflows` as the only advisor-discoverable skill, keep mode packets non-discoverable, and replace only the Python/TS hardcoded **mode projection maps** with a validated loader for `.opencode/skills/deep-loop-workflows/mode-registry.json`.

**Why A Wins**

- The registry already has the right conceptual source data: `skill: "deep-loop-workflows"` plus per-mode `workflowMode`, `runtimeLoopType`, `backendKind`, `packet`, `command`, `agent`, `artifactRoot`, and `aliases` entries. Evidence: `.opencode/skills/deep-loop-workflows/mode-registry.json:2-19`, `.opencode/skills/deep-loop-workflows/mode-registry.json:22-49`, `.opencode/skills/deep-loop-workflows/mode-registry.json:52-96`.
- The hub documentation says routing should be registry-driven and never hardcoded. Evidence: `.opencode/skills/deep-loop-workflows/SKILL.md:34-50`, `.opencode/skills/deep-loop-workflows/SKILL.md:77-86`.
- The implementation currently contradicts that: Python hardcodes `MERGED_DEEP_SKILL_ID` and `DEEP_ROUTING_MODE_BY_KEY`; TypeScript hardcodes `MERGED_DEEP_SKILL_ID` and `DEEP_MODE_BY_CANONICAL`. Evidence: `.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py:2319-2324`, `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/aliases.ts:90-101`.
- The current parity contract is already the right public shape: Python emits `{ skill: "deep-loop-workflows", mode: <workflowMode> }`, and fixtures assert both fields. Evidence: `.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py:2513-2537`, `.opencode/skills/system-skill-advisor/mcp_server/tests/routing-parity-deep-skills.vitest.ts:27-35`, `.opencode/skills/system-skill-advisor/mcp_server/tests/routing-parity-deep-skills.vitest.ts:62-65`, `.opencode/skills/system-skill-advisor/mcp_server/tests/routing-parity-deep-council.vitest.ts:110-114`.
- Model B would intentionally create separate advisor nodes because the scanner recursively discovers every `graph-metadata.json`; it would also make the `ai-council` folder/name mismatch load-bearing because `parseSkillMetadata` requires `skill_id == basename(folder)`. Evidence: `.opencode/skills/system-skill-advisor/mcp_server/lib/skill-graph/skill-graph-db.ts:601-625`, `.opencode/skills/system-skill-advisor/mcp_server/lib/skill-graph/skill-graph-db.ts:654-657`, `.opencode/specs/skilled-agent-orchestration/155-parent-nested-skill-pattern/001-rename-fix-and-shared-decision/decision-record.md:90-98`.
- The one-identity keystone is already documented and verified: packets carry no `graph-metadata.json`; only the hub does. Evidence: `.opencode/specs/skilled-agent-orchestration/152-deep-loop-workflows/003-merged-hub-and-mode-packets/implementation-summary.md:76-88`.

**Consumption Seam**

- Python should add a small validated loader near the existing config constants, using `SKILLS_DIR` to resolve `.opencode/skills/deep-loop-workflows/mode-registry.json`. Evidence that the script already has the correct root constants and JSON tooling: `.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py:23-31`, `.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py:39-43`.
- Python should derive `MERGED_DEEP_SKILL_ID` from `registry["skill"]` and derive `DEEP_ROUTING_MODE_BY_KEY` from registry mode entries, while keeping the current Candidate-3 scoring weights and regex groups unchanged. Evidence that only the projection layer needs replacement: `.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py:2307-2324`, `.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py:2326-2366`, `.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py:2527-2529`, `.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py:2571-2574`.
- TypeScript should add a shared `deep-mode-registry` helper under `lib/scorer/` or `lib/parent-skill/`, load via `findAdvisorWorkspaceRoot`, and derive the alias-to-mode map used by `modeForAlias`. Evidence for existing workspace-root support: `.opencode/skills/system-skill-advisor/mcp_server/lib/utils/workspace-root.ts:48-62`. Evidence for the current alias seam: `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/aliases.ts:103-120`, `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/aliases.ts:128-129`.
- Keep `canonicalSkillId` behavior stable: aliases still canonicalize to mode-level legacy IDs where tests expect that, while `mergedSkillForAlias` projects mode-level IDs to `deep-loop-workflows`. Evidence: `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/aliases.ts:75-84`, `.opencode/skills/system-skill-advisor/mcp_server/tests/scorer/native-scorer.vitest.ts:347-356`.

**Required Registry Tightening**

- The existing registry aliases are not yet complete enough to replace current advisor alias groups. For example, TypeScript includes aliases like `spec_kit:deep-review`, `/deep:start-review-loop`, and `sk-deep-review`, while the registry’s review aliases are natural-language mode phrases only. Evidence: `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/aliases.ts:13-47`, `.opencode/skills/deep-loop-workflows/mode-registry.json:29-39`.
- Add either `advisorCanonical` plus `advisorAliases`, or expand each mode’s existing `aliases` to include every legacy skill ID, command bridge ID, slash-command alias, and `sk-*` alias currently hardcoded in Python/TS. Evidence for Python’s separate alias set: `.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py:236-261`.
- Add registry validation to require unique `workflowMode`, unique aliases, valid `backendKind`, explicit `runtimeLoopType: null` for improvement/external modes, packet path existence, and no nested `graph-metadata.json`. Evidence for the load-bearing discriminator: `.opencode/skills/deep-loop-workflows/SKILL.md:38-50`, `.opencode/skills/deep-loop-workflows/SKILL.md:82-90`.

**Freshness And Runtime Risk**

- If TypeScript starts reading `mode-registry.json`, advisor freshness and watcher logic must include it. Current source signatures hash top-level `SKILL.md` and `graph-metadata.json`, not `mode-registry.json`. Evidence: `.opencode/skills/system-skill-advisor/mcp_server/lib/freshness.ts:156-173`.
- Current daemon watch targets include `SKILL.md`, `graph-metadata.json`, derived key files, and doc frontmatter, but not `mode-registry.json`. Evidence: `.opencode/skills/system-skill-advisor/mcp_server/lib/daemon/watcher.ts:228-250`.
- Advisor status recursively scans `graph-metadata.json` mtimes for source freshness, not registry mtimes. Evidence: `.opencode/skills/system-skill-advisor/mcp_server/handlers/advisor-status.ts:192-218`, `.opencode/skills/system-skill-advisor/mcp_server/handlers/advisor-status.ts:253-262`.

**Migration Cost**

- Low to moderate. The core behavioral migration is small: replace two hardcoded maps with registry-derived maps and keep the Candidate-3 scoring model intact. Evidence for the two target maps: `.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py:2319-2324`, `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/aliases.ts:96-101`.
- The real cost is validation and cache correctness: registry alias expansion, Python/TS parity tests, freshness signature coverage, watcher coverage, and a parent-skill validator. Evidence that the project already scopes this standardization work: `.opencode/specs/skilled-agent-orchestration/155-parent-nested-skill-pattern/spec.md:57-71`.
- I could not verify active TypeScript source consumers of `modeForAlias`/`mergedSkillForAlias`; source grep found definitions in `aliases.ts`, while the visible native-scorer test imports only alias-group/canonical helpers. Evidence: `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/aliases.ts:119-129`, `.opencode/skills/system-skill-advisor/mcp_server/tests/scorer/native-scorer.vitest.ts:15`, `.opencode/skills/system-skill-advisor/mcp_server/tests/scorer/native-scorer.vitest.ts:347-356`.

**Standardize**

- Define a `parent-skill` pattern in `sk-doc`: one discoverable hub `graph-metadata.json`, one `mode-registry.json`, non-discoverable mode packets, optional non-discoverable `shared/`, and no per-mode graph metadata. Evidence: `.opencode/specs/skilled-agent-orchestration/155-parent-nested-skill-pattern/spec.md:57-71`, `.opencode/specs/skilled-agent-orchestration/155-parent-nested-skill-pattern/001-rename-fix-and-shared-decision/decision-record.md:67-70`.
- Ship `/create:parent-skill` with hub `SKILL.md`, registry, hub `graph-metadata.json`, packet directories, and shared helper scaffolding. Evidence: `.opencode/specs/skilled-agent-orchestration/155-parent-nested-skill-pattern/spec.md:71`.
- Ship `/doctor:parent-skill` to validate registry schema, alias uniqueness, Python/TS registry parity, no nested `graph-metadata.json`, packet folder/SKILL naming policy, freshness/watch inclusion, and routing parity fixtures. Evidence for required fixture preservation: `.opencode/specs/skilled-agent-orchestration/155-parent-nested-skill-pattern/spec.md:69-71`, `.opencode/skills/system-skill-advisor/mcp_server/tests/routing-parity-deep-skills.vitest.ts:52-67`.
- Add a routing/discovery benchmark that checks one-identity discovery, alias-to-mode precision, stale-registry invalidation, and no mode flattening. Evidence for phase charter: `.opencode/specs/skilled-agent-orchestration/155-parent-nested-skill-pattern/spec.md:69-71`, `.opencode/skills/deep-loop-workflows/README.md:21-28`.

No files were edited or written. No tests were run because the request was read-only research only.

===RESEARCH-JSON===
{"angle":"registry-driven routing feasibility","recommendation":"Adopt model A: keep one advisor identity and load deep-loop-workflows/mode-registry.json in both Python and TypeScript through a validated registry helper, with freshness/watch coverage and parity tests.","model_pick":"A","key_findings":[{"claim":"The registry already contains the intended shared mode source data, including skill id, workflowMode, runtimeLoopType, backendKind, packet, command, agent, artifactRoot, and aliases.","evidence":".opencode/skills/deep-loop-workflows/mode-registry.json:2-19","confidence":"high"},{"claim":"Advisor routing is currently hardcoded despite hub docs saying the registry is the source of truth.","evidence":".opencode/skills/deep-loop-workflows/SKILL.md:36; .opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py:2319-2324; .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/aliases.ts:90-101","confidence":"high"},{"claim":"The existing public contract is already {skill: deep-loop-workflows, mode: workflowMode}, so registry-driven mapping can preserve parity fixtures.","evidence":".opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py:2513-2537; .opencode/skills/system-skill-advisor/mcp_server/tests/routing-parity-deep-skills.vitest.ts:62-65","confidence":"high"},{"claim":"Model B would break the one-identity keystone because recursive graph metadata discovery would rank packet graph-metadata files as separate skills and parseSkillMetadata requires skill_id==folder.","evidence":".opencode/skills/system-skill-advisor/mcp_server/lib/skill-graph/skill-graph-db.ts:601-625; .opencode/skills/system-skill-advisor/mcp_server/lib/skill-graph/skill-graph-db.ts:654-657","confidence":"high"},{"claim":"Registry aliases are not yet complete enough to replace current advisor aliases without expansion or an advisorAliases/advisorCanonical field.","evidence":".opencode/skills/system-skill-advisor/mcp_server/lib/scorer/aliases.ts:13-47; .opencode/skills/deep-loop-workflows/mode-registry.json:29-39","confidence":"high"},{"claim":"If TS reads the registry, advisor freshness and daemon watching must include mode-registry.json or registry edits can be invisible to cached recommendations.","evidence":".opencode/skills/system-skill-advisor/mcp_server/lib/freshness.ts:156-173; .opencode/skills/system-skill-advisor/mcp_server/lib/daemon/watcher.ts:228-250","confidence":"high"}],"risks":["Registry aliases currently omit several legacy advisor aliases and command bridge aliases, so a naive loader would regress routing.","mode-registry.json is not part of current advisor source signatures or watcher targets, so runtime loading it without freshness changes risks stale cached recommendations.","I could not verify active TS source consumers of modeForAlias/mergedSkillForAlias beyond definitions and tests, so TS migration may be contract-hardening before it is hot-path behavior."],"standardize":["Parent-skill registry schema with skill, modes, workflowMode, runtimeLoopType, backendKind, packet, command, agent, artifactRoot, advisorCanonical/advisorAliases, and validation rules.","/create:parent-skill scaffold for one hub graph-metadata.json, mode-registry.json, non-discoverable mode packets, and shared/.","/doctor:parent-skill validator for registry schema, alias uniqueness, Python/TS parity, no nested graph-metadata.json, packet naming policy, and freshness/watch coverage.","Routing/discovery benchmark covering one-identity discovery, alias-to-mode precision, stale-registry invalidation, and no mode flattening."],"open_questions":["Should registry aliases be expanded in-place, or should advisorCanonical/advisorAliases be separate fields to keep operator-facing aliases cleaner?","Should TypeScript aliases.ts remain a no-arg pure module with workspace-root discovery, or should mode resolution become workspaceRoot-explicit through scoreAdvisorPrompt?","Should /deep command markdown also be generated or validated from mode-registry.json, since I did not verify command runtime consumption of the registry?"]}
===END===

## Structured output

```json
{
  "angle": "registry-driven routing feasibility",
  "recommendation": "Adopt model A: keep one advisor identity and load deep-loop-workflows/mode-registry.json in both Python and TypeScript through a validated registry helper, with freshness/watch coverage and parity tests.",
  "model_pick": "A",
  "key_findings": [
    {
      "claim": "The registry already contains the intended shared mode source data, including skill id, workflowMode, runtimeLoopType, backendKind, packet, command, agent, artifactRoot, and aliases.",
      "evidence": ".opencode/skills/deep-loop-workflows/mode-registry.json:2-19",
      "confidence": "high"
    },
    {
      "claim": "Advisor routing is currently hardcoded despite hub docs saying the registry is the source of truth.",
      "evidence": ".opencode/skills/deep-loop-workflows/SKILL.md:36; .opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py:2319-2324; .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/aliases.ts:90-101",
      "confidence": "high"
    },
    {
      "claim": "The existing public contract is already {skill: deep-loop-workflows, mode: workflowMode}, so registry-driven mapping can preserve parity fixtures.",
      "evidence": ".opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py:2513-2537; .opencode/skills/system-skill-advisor/mcp_server/tests/routing-parity-deep-skills.vitest.ts:62-65",
      "confidence": "high"
    },
    {
      "claim": "Model B would break the one-identity keystone because recursive graph metadata discovery would rank packet graph-metadata files as separate skills and parseSkillMetadata requires skill_id==folder.",
      "evidence": ".opencode/skills/system-skill-advisor/mcp_server/lib/skill-graph/skill-graph-db.ts:601-625; .opencode/skills/system-skill-advisor/mcp_server/lib/skill-graph/skill-graph-db.ts:654-657",
      "confidence": "high"
    },
    {
      "claim": "Registry aliases are not yet complete enough to replace current advisor aliases without expansion or an advisorAliases/advisorCanonical field.",
      "evidence": ".opencode/skills/system-skill-advisor/mcp_server/lib/scorer/aliases.ts:13-47; .opencode/skills/deep-loop-workflows/mode-registry.json:29-39",
      "confidence": "high"
    },
    {
      "claim": "If TS reads the registry, advisor freshness and daemon watching must include mode-registry.json or registry edits can be invisible to cached recommendations.",
      "evidence": ".opencode/skills/system-skill-advisor/mcp_server/lib/freshness.ts:156-173; .opencode/skills/system-skill-advisor/mcp_server/lib/daemon/watcher.ts:228-250",
      "confidence": "high"
    }
  ],
  "risks": [
    "Registry aliases currently omit several legacy advisor aliases and command bridge aliases, so a naive loader would regress routing.",
    "mode-registry.json is not part of current advisor source signatures or watcher targets, so runtime loading it without freshness changes risks stale cached recommendations.",
    "I could not verify active TS source consumers of modeForAlias/mergedSkillForAlias beyond definitions and tests, so TS migration may be contract-hardening before it is hot-path behavior."
  ],
  "standardize": [
    "Parent-skill registry schema with skill, modes, workflowMode, runtimeLoopType, backendKind, packet, command, agent, artifactRoot, advisorCanonical/advisorAliases, and validation rules.",
    "/create:parent-skill scaffold for one hub graph-metadata.json, mode-registry.json, non-discoverable mode packets, and shared/.",
    "/doctor:parent-skill validator for registry schema, alias uniqueness, Python/TS parity, no nested graph-metadata.json, packet naming policy, and freshness/watch coverage.",
    "Routing/discovery benchmark covering one-identity discovery, alias-to-mode precision, stale-registry invalidation, and no mode flattening."
  ],
  "open_questions": [
    "Should registry aliases be expanded in-place, or should advisorCanonical/advisorAliases be separate fields to keep operator-facing aliases cleaner?",
    "Should TypeScript aliases.ts remain a no-arg pure module with workspace-root discovery, or should mode resolution become workspaceRoot-explicit through scoreAdvisorPrompt?",
    "Should /deep command markdown also be generated or validated from mode-registry.json, since I did not verify command runtime consumption of the registry?"
  ]
}
```
