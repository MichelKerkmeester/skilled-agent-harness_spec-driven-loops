# Cross-Skill Auto-Propagation of Inbound Enhancement Edges

## Executive Summary

- Current design is intentionally source-authored:
  each skill's own `graph-metadata.json` owns outbound `edges.*`.
- The indexer auto-discovers new skills and auto-indexes outbound declarations.
- It does not infer missing inbound declarations in other skills.
- That explains both recent manual fixes:
  `sk-prompt -> cli-devin` / `system-skill-advisor -> cli-devin`,
  then the same pair for `cli-opencode`.
- Recommended direction:
  add a proposal-first cross-skill edge propagator.
- MVP:
  detect missing `edges.enhances[]` candidates for cli-family additions,
  report them through a dedicated MCP tool, and apply only on explicit operator
  request.
- Do not auto-write from the daemon watcher on day one.
- Do not require schema v3 on day one.
- Do not use embeddings for applyable candidates on day one.

## Current Architecture Evidence

- `system-skill-advisor` exposes the advisor and skill graph tools under the
  standalone `mk_skill_advisor` server.
  Evidence: `.opencode/skills/system-skill-advisor/ARCHITECTURE.md:40-49`.
- Package-owned surfaces include handlers, scorer, freshness, daemon, derived
  metadata, database, tests, scripts, and docs.
  Evidence: `.opencode/skills/system-skill-advisor/ARCHITECTURE.md:58-66`.
- Adding MCP tools is guarded work requiring tools, handlers, schemas, docs,
  README, and feature catalog updates.
  Evidence: `.opencode/skills/system-skill-advisor/ARCHITECTURE.md:244-248`.
- The SQLite schema has `skill_nodes` and `skill_edges`; runtime edges are
  directional rows.
  Evidence: `.opencode/skills/system-skill-advisor/mcp_server/lib/skill-graph/skill-graph-db.ts:133-177`.
- `skill_edges` is unique on `(source_id, target_id, edge_type)`.
  Evidence: `.opencode/skills/system-skill-advisor/mcp_server/lib/skill-graph/skill-graph-db.ts:150-158`.
- Supported edge types are exactly:
  `depends_on`, `enhances`, `siblings`, `conflicts_with`, `prerequisite_for`.
  Evidence: `.opencode/skills/system-skill-advisor/mcp_server/lib/skill-graph/skill-graph-db.ts:21-26`.
- `enhances` recommended weight band is `[0.3, 0.7]`.
  Evidence: `.opencode/skills/system-skill-advisor/mcp_server/lib/skill-graph/skill-graph-db.ts:121-127`.
- Metadata parser accepts only schema versions `1` and `2`.
  Evidence: `.opencode/skills/system-skill-advisor/mcp_server/lib/skill-graph/skill-graph-db.ts:468-472`.
- Static compiler also accepts only metadata schema versions `1` and `2`.
  Evidence: `.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_graph_compiler.py:35-37`.
- Scoring uses five lanes:
  `explicit_author`, `lexical`, `graph_causal`, `derived_generated`,
  `semantic_shadow`.
  Evidence: `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lane-registry.ts:7-12`.

## Current Indexing Boundary

- `indexSkillMetadata(skillDir)` discovers `graph-metadata.json` files under a
  skills root.
  Evidence: `.opencode/skills/system-skill-advisor/mcp_server/lib/skill-graph/skill-graph-db.ts:557-566`.
- It reads JSON, filters non-skill metadata, hashes content, and parses each
  skill into node and edge declarations.
  Evidence: `.opencode/skills/system-skill-advisor/mcp_server/lib/skill-graph/skill-graph-db.ts:571-582`.
- Parsed metadata must contain `skill_id`, `family`, `category`, domains,
  intent signals, `derived`, and `edges`.
  Evidence: `.opencode/skills/system-skill-advisor/mcp_server/lib/skill-graph/skill-graph-db.ts:468-539`.
- The indexer upserts changed nodes and skips unchanged node files by content
  hash.
  Evidence: `.opencode/skills/system-skill-advisor/mcp_server/lib/skill-graph/skill-graph-db.ts:625-693`.
- Then it republishes every edge from every parsed source file.
  Evidence: `.opencode/skills/system-skill-advisor/mcp_server/lib/skill-graph/skill-graph-db.ts:696-723`.
- It deletes edges by source before inserting that source's declarations.
  Evidence: `.opencode/skills/system-skill-advisor/mcp_server/lib/skill-graph/skill-graph-db.ts:649-656`.
- Unknown targets are rejected.
  Evidence: `.opencode/skills/system-skill-advisor/mcp_server/lib/skill-graph/skill-graph-db.ts:712-717`.
- Existing tests cover a different backfill case:
  if a source already declares an edge to a missing target, a later scan accepts
  it when the target appears.
  Evidence: `.opencode/skills/system-skill-advisor/mcp_server/tests/skill-graph-db.vitest.ts:18-47`.
- That test does not cover the current gap:
  an upstream source lacks any declaration to the new target.
- Conclusion:
  inbound propagation needs a layer above the source-authored indexer.

## Current Trigger Surfaces

- `skill_graph_scan` calls the indexer, refreshes embeddings, and publishes a
  live generation.
  Evidence: `.opencode/skills/system-skill-advisor/mcp_server/handlers/skill-graph/scan.ts:28-64`.
- `advisor_rebuild` calls `indexSkillMetadata()` on `.opencode/skills` and
  publishes generation `advisor_rebuild`.
  Evidence: `.opencode/skills/system-skill-advisor/mcp_server/handlers/advisor-rebuild.ts:84-106`.
- The daemon watcher tracks `SKILL.md`, `graph-metadata.json`, and derived key
  files.
  Evidence: `.opencode/skills/system-skill-advisor/mcp_server/lib/daemon/watcher.ts:227-255`.
- Watcher add/change/unlink events enqueue debounced reindex work.
  Evidence: `.opencode/skills/system-skill-advisor/mcp_server/lib/daemon/watcher.ts:481-504`
  and `.opencode/skills/system-skill-advisor/mcp_server/lib/daemon/watcher.ts:567-575`.
- The watcher already has storm-circuit behavior.
  Evidence: `.opencode/skills/system-skill-advisor/mcp_server/lib/daemon/watcher.ts:466-479`.
- The orchestrator calls `reindexSkill()`, publishes generation, and refreshes
  targets.
  Evidence: `.opencode/skills/system-skill-advisor/mcp_server/lib/daemon/watcher-orchestrator.ts:75-128`.
- `skill_graph_validate` checks schema versions, broken edges, cycles, weight
  bands, dependency/sibling symmetry, and orphans.
  Evidence: `.opencode/skills/system-skill-advisor/mcp_server/handlers/skill-graph/validate.ts:40-119`.
- It does not check missing family-parity inbound `enhances`.

## Metadata Pattern Evidence

- `cli-codex` is `family: "cli"` / `category: "cli-orchestrator"`, with
  outbound sibling edges and no outbound `enhances`.
  Evidence: `.opencode/skills/cli-codex/graph-metadata.json:1-33`.
- `cli-devin` has the same family/category/sibling shape.
  Evidence: `.opencode/skills/cli-devin/graph-metadata.json:1-33`.
- `cli-opencode` has the same family/category/sibling shape.
  Evidence: `.opencode/skills/cli-opencode/graph-metadata.json:1-33`.
- `sk-prompt` enhances cli skills at weight `0.4` with context
  `"prompt quality card"`.
  Evidence: `.opencode/skills/sk-prompt/graph-metadata.json:8-34`.
- `system-skill-advisor` enhances cli skills at weight `0.7` with routing
  contexts such as `"routes codex delegation requests"`.
  Evidence: `.opencode/skills/system-skill-advisor/graph-metadata.json:14-99`.
- The cli skills all carry `assets/prompt_quality_card.md` and
  `references/cli_reference.md`.
- The derived extractor already walks references and assets.
  Evidence: `.opencode/skills/system-skill-advisor/mcp_server/lib/derived/extract.ts:176-183`.
- It includes asset/key-file paths in derived key files.
  Evidence: `.opencode/skills/system-skill-advisor/mcp_server/lib/derived/extract.ts:205-215`.
- The projection uses derived key files and source docs as scorer keywords.
  Evidence: `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/projection.ts:176-193`.

## 1. Detection

### Family-Membership Inference

- Rule:
  if target `Y` has `family: "cli"` and source `A` enhances multiple other cli
  members, propose `A enhances Y`.
- This catches `sk-prompt -> cli-devin`.
- This catches `system-skill-advisor -> cli-devin`.
- It also would have caught `cli-opencode`.
- Correctness is high for cli because the family is explicit and coherent.
- False-positive risk rises outside cli.
- MVP threshold:
  source enhances at least two existing members of target family.
- Better threshold:
  source enhances at least 60% of family peers excluding the target.
- Suggested confidence contribution:
  up to `0.45`.

### Asset-Shape Inference

- Rule:
  target with `assets/prompt_quality_card.md` is a candidate for
  `sk-prompt -> target`.
- Rule:
  cli target with `references/cli_reference.md` is a candidate for
  `system-skill-advisor -> target`.
- This should be evidence, not sole authority.
- Correctness is high for the prompt-card pattern.
- False positives are low when combined with `family: "cli"`.
- Suggested confidence contribution:
  up to `0.30`.

### Sibling-Edge Transitivity

- Rule:
  if `Y` is sibling of `B` and `A enhances B`, then `A enhances Y` is a
  candidate.
- Cli sibling declarations are dense and reciprocal.
  Evidence: `.opencode/skills/cli-devin/graph-metadata.json:9-30`.
- Compiler validates sibling reciprocity.
  Evidence: `.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_graph_compiler.py:635-649`.
- Runtime validation also checks sibling symmetry.
  Evidence: `.opencode/skills/system-skill-advisor/mcp_server/handlers/skill-graph/validate.ts:211-227`.
- Do not use sibling transitivity alone.
- Deep-loop siblings are workflow peers, not necessarily shared enhancement
  targets.
- Suggested confidence contribution:
  up to `0.15`.

### Embedding Similarity

- Rule:
  compare skill descriptions/domains/derived topics to find semantic proximity.
- Runtime can refresh skill embeddings.
  Evidence: `.opencode/skills/system-skill-advisor/mcp_server/lib/skill-graph/skill-graph-db.ts:746-812`.
- This is too expensive and too hard to audit for MVP.
- Use later for report-only drift discovery.
- Do not use semantic similarity for auto-apply.

### Explicit Hint Fields

- New skill could declare inbound hints, but that needs schema work.
- Example:

```json
{
  "schema_version": 3,
  "skill_id": "cli-devin",
  "inbound_hints": {
    "enhanced_by": [
      {
        "source": "sk-prompt",
        "weight": 0.4,
        "context": "prompt quality card"
      }
    ]
  }
}
```

- Correctness would be high.
- Implementation cost is higher because schema v3 must be accepted by TS and
  Python compiler paths.
- Not needed for MVP.

### Composite Detector

- Recommended detection score:
  family parity + asset shape + sibling transitivity.
- Emit high-confidence candidate at `>= 0.80`.
- Emit medium candidate at `>= 0.60`.
- Default tool threshold:
  `0.75`.
- MVP should only mark candidates applyable when weight and context are
  deterministic.

## 2. Trigger Model

### Daemon Watcher Event

- Pros:
  catches new skill registration immediately.
- Cons:
  background writes would surprise operators.
- Cons:
  cross-skill writes can produce watcher cascades.
- Use only for future report-only diagnostics.
- Do not auto-add from watcher in MVP.

### Explicit `skill_graph_scan`

- Pros:
  explicit maintenance surface.
- Cons:
  existing scan contract is indexing + embeddings.
- Optional future:
  `skill_graph_scan({ auditInboundEnhances: true })`.
- Not recommended as the main MVP surface.

### Scheduled Audit

- Pros:
  finds drift without operator memory.
- Cons:
  noisy unless candidate quality is proven.
- Good second phase after explicit tool adoption.

### Dedicated MCP Tool

- Recommended tool:
  `skill_graph_propagate_enhances`.
- Modes:
  `report`, `propose`, `apply`.
- Default:
  `report`.
- This keeps the operator action explicit.
- This keeps validation separate from mutation.
- This matches the guarded extension-point requirement for new tools.

## 3. Operator Approval Gate

### Auto-Add

- Directly patches upstream `graph-metadata.json`.
- Lowest manual effort.
- Highest surprise.
- Risky from daemon watcher.
- Not recommended.

### Propose With Confirmation

- Tool returns candidates and an apply plan.
- Operator reruns with explicit candidate ids or `applyAllHighConfidence`.
- Low surprise.
- Easy to undo via git diff.
- Recommended.

### Report-Only

- Return JSON in MCP response.
- Do not write a persistent audit file by default.
- Persistent audit files create another repo artifact to maintain.
- Useful as default mode.

### Opt-In Flag

- Future source-side policy:

```json
{
  "auto_propagate_outbound": {
    "enhances": [
      {
        "target_family": "cli",
        "required_files": ["assets/prompt_quality_card.md"],
        "weight": 0.4,
        "context": "prompt quality card"
      }
    ]
  }
}
```

- Better authority.
- Requires schema design.
- Not MVP.

## 4. Avoiding Pollution and False Positives

- Never emit from one weak signal.
- Family-only is too broad outside cli.
- Asset-only is too broad outside cli.
- Sibling-only is too broad outside cli.
- High-confidence MVP requires family parity plus at least one supporting signal.
- Copy weight only when existing family edges have a stable weight.
- If weights vary, use median and mark candidate medium confidence.
- Clip inferred `enhances` weights to `[0.3, 0.7]`.
- Copy context when all relevant source family edges share the same context.
- For provider contexts, use narrow template replacement:
  `"routes codex delegation requests"` -> `"routes devin delegation requests"`.
- Do not ask an LLM to invent context strings in runtime code.
- If context cannot be inferred deterministically, candidate is not applyable.
- Candidate generation must skip existing edges.
- Apply must parse JSON and check the edge still does not exist.
- Apply must write the edge once.
- Re-running after apply must return zero duplicate candidates.
- Authority should remain source-owned:
  patches go into the source skill's `edges.enhances[]`.
- Target hints can be advisory later.
- `conflicts_with` should stay explicit and reciprocal.
  Evidence: `.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_graph_compiler.py:49-60`.

## 5. Implementation Surface

### Module Location

- Add:
  `.opencode/skills/system-skill-advisor/mcp_server/lib/cross-skill-edges/`.
- Suggested files:
  `types.ts`.
- Suggested files:
  `metadata-loader.ts`.
- Suggested files:
  `detect-inbound-enhances.ts`.
- Suggested files:
  `context-template.ts`.
- Suggested files:
  `apply-graph-metadata-patch.ts`.
- Do not put this inside `lib/skill-graph/` initially.
- Reason:
  `lib/skill-graph/` owns runtime SQLite indexing/querying.
- Cross-skill propagation owns authored source metadata proposals.

### Core Types

```ts
export type PropagationMode = 'report' | 'propose' | 'apply';

export interface InboundEnhanceCandidate {
  id: string;
  sourceSkillId: string;
  targetSkillId: string;
  edgeType: 'enhances';
  weight: number | null;
  context: string | null;
  confidence: number;
  confidenceLabel: 'high' | 'medium' | 'low';
  rules: CandidateRuleEvidence[];
  sourcePath: string;
  targetPath: string;
  applyable: boolean;
  blockers: string[];
}
```

### Detector Sketch

```ts
export function detectInboundEnhances(
  skills: SkillMetadata[],
  options: DetectInboundEnhancesOptions,
): InboundEnhanceCandidate[] {
  const byId = new Map(skills.map((skill) => [skill.skillId, skill]));
  const byFamily = groupBy(skills, (skill) => skill.family);
  const candidates: InboundEnhanceCandidate[] = [];

  for (const target of skills) {
    if (!matchesTargetFilter(target, options)) continue;

    for (const source of skills) {
      if (source.skillId === target.skillId) continue;
      if (!matchesSourceFilter(source, options)) continue;
      if (hasEdge(source, 'enhances', target.skillId)) continue;

      const family = byFamily.get(target.family) ?? [];
      const evidence = scoreEnhanceCandidate(source, target, family, byId);
      if (evidence.confidence < options.minConfidence) continue;

      candidates.push(buildCandidate(source, target, evidence));
    }
  }

  return stableSort(candidates);
}
```

### Payload Inference Sketch

```ts
function inferEdgePayload(source: SkillMetadata, target: SkillMetadata) {
  const familyEdges = source.edges.enhances.filter((edge) => {
    return metadataById.get(edge.target)?.family === target.family;
  });

  const weight = inferStableWeight(familyEdges);
  const context = inferStableOrProviderContext(familyEdges, target.skillId);
  const blockers = [];

  if (weight === null) blockers.push('cannot infer weight');
  if (context === null) blockers.push('cannot infer context');

  return {
    weight,
    context,
    blockers,
    applyable: blockers.length === 0,
  };
}
```

### Tool Schema Sketch

```ts
export const skillGraphPropagateEnhancesTool = {
  name: 'skill_graph_propagate_enhances',
  description: '[L7:Maintenance] Detect, report, and optionally apply missing inbound edges.enhances[] declarations.',
  inputSchema: {
    type: 'object',
    additionalProperties: false,
    properties: {
      skillsRoot: { type: 'string' },
      mode: { type: 'string', enum: ['report', 'propose', 'apply'], default: 'report' },
      targetSkillIds: { type: 'array', items: { type: 'string' } },
      sourceSkillIds: { type: 'array', items: { type: 'string' } },
      minConfidence: { type: 'number', minimum: 0, maximum: 1, default: 0.75 },
      applyCandidateIds: { type: 'array', items: { type: 'string' } },
      applyAllHighConfidence: { type: 'boolean', default: false },
      dryRun: { type: 'boolean', default: true }
    },
    required: []
  }
};
```

### Handler Sketch

```ts
export async function handleSkillGraphPropagateEnhances(args, callerContext) {
  if (args.mode === 'apply') {
    const trusted = requireTrustedCaller(callerContext);
    if (!trusted.ok) return errorResponse(trusted.error, trusted.code);
  }

  const workspaceRoot = process.cwd();
  const skillsRoot = resolveUnderWorkspace(workspaceRoot, args.skillsRoot ?? '.opencode/skills');
  const skills = loadSkillMetadataFromFilesystem(skillsRoot);
  const candidates = detectInboundEnhances(skills, normalizeOptions(args));

  if (args.mode !== 'apply' || args.dryRun !== false) {
    return okResponse({ mode: args.mode ?? 'report', candidates, applied: [] });
  }

  const selected = selectApplyCandidates(candidates, args);
  const applied = applyEnhanceCandidates(selected);
  const scanResult = indexSkillMetadata(skillsRoot);

  publishSkillGraphGeneration({
    workspaceRoot,
    changedPaths: applied.map((item) => item.sourcePath),
    reason: 'skill_graph_propagate_enhances',
    state: 'live',
    sourceSignature: computeAdvisorSourceSignature(workspaceRoot),
  });

  return okResponse({ mode: 'apply', candidates, applied, scanResult });
}
```

### Tests

- Add detector tests under
  `mcp_server/tests/cross-skill-edges/`.
- Fixture:
  `sk-prompt` enhances `cli-alpha` and `cli-beta`.
- Fixture:
  `cli-new` has `family: "cli"` and `assets/prompt_quality_card.md`.
- Assert:
  propose `sk-prompt -> cli-new`, weight `0.4`, context
  `"prompt quality card"`.
- Fixture:
  `system-skill-advisor` enhances cli peers with provider routing contexts.
- Assert:
  infer `"routes new delegation requests"`.
- Negative fixture:
  deep-loop siblings do not trigger applyable cross-family suggestions.
- Idempotence fixture:
  existing edge means no candidate.
- Handler tests can mirror the current skill graph handler style.
  Evidence: `.opencode/skills/system-skill-advisor/mcp_server/tests/skill-graph-handlers.vitest.ts:44-126`.
- Tool registration changes belong beside existing skill graph tools.
  Evidence: `.opencode/skills/system-skill-advisor/mcp_server/tools/skill-graph-tools.ts:20-70`.
- Dispatch changes belong in the same file.
  Evidence: `.opencode/skills/system-skill-advisor/mcp_server/tools/skill-graph-tools.ts:100-121`.

### Migration

- MVP needs no SQLite schema change.
- MVP needs no `graph-metadata.json` schema v3.
- MVP report mode persists nothing.
- Apply mode patches source JSON, then runs the existing indexer.
- If persistent proposals are later required, use a separate
  `skill_edge_proposals` table.
- Do not put inferred-only edges into `skill_edges`.

## 6. Tradeoffs Across Options

| Option | Correctness | Surprise | Reversible | Cost | Non-cli fit |
|---|---:|---:|---:|---:|---:|
| Family parity + dedicated tool + propose/apply | 4 | 1 | 5 | 3 | 3 |
| Family parity + daemon auto-add | 4 | 5 | 3 | 4 | 3 |
| Asset shape + dedicated tool + propose/apply | 4 | 1 | 5 | 3 | 2 |
| Sibling transitivity + scan warning | 3 | 2 | 5 | 2 | 2 |
| Embedding similarity + scheduled report | 2 | 2 | 5 | 5 | 4 |
| Explicit hints + dedicated apply | 5 | 2 | 5 | 4 | 5 |
| Composite detector + dedicated tool + propose/apply | 5 | 1 | 5 | 4 | 4 |

- Scale:
  `1` low, `5` high.
- Low surprise is good.
- High reversibility is good.
- High cost is bad.
- Best immediate option:
  family parity plus asset-shape evidence through a dedicated tool.
- Best long-term option:
  composite detector plus optional explicit hints.

## 7. Recommendation

- Build `skill_graph_propagate_enhances`.
- Default to report mode.
- Use a composite detector.
- MVP should make only high-confidence cli-family candidates applyable.
- MVP should catch:
  `sk-prompt -> new cli skill`.
- MVP should catch:
  `system-skill-advisor -> new cli skill`.
- MVP should infer:
  weight `0.4` and context `"prompt quality card"` for `sk-prompt`.
- MVP should infer:
  weight `0.7` and context `"routes <provider> delegation requests"` for
  `system-skill-advisor`.
- MVP should not mutate files unless:
  `mode: "apply"`, `dryRun: false`, trusted caller, and explicit candidate
  selection.
- After apply:
  run `indexSkillMetadata(skillsRoot)` and publish a skill graph generation.
- Keep `skill_graph_validate` unchanged initially.
- Add validation warnings only after report quality is proven.

### Minimum Viable Cut

1. Filesystem metadata loader.
2. `detectInboundEnhances()` for `enhances` only.
3. Family parity rule.
4. Asset-shape boost for prompt quality card.
5. Narrow provider-context inference.
6. Report-mode handler.
7. Tests for cli positive, deep-loop negative, and idempotence.
8. Apply mode behind trusted caller after report mode passes review.

### Why Not Auto-Add

- It would mutate skills the operator did not open.
- It could cascade through the watcher.
- It blurs ownership of outbound edges.
- It is harder to explain when a proposal is wrong.
- A dedicated apply mode gives the same eventual automation with normal git
  review.

## 8. Open Questions and Risks

- Should `system-skill-advisor` get a special broad-router rule?
- Should `sk-prompt` get a special prompt-card rule, or should that become an
  explicit source-side policy?
- Should apply mode preserve append order or sort `edges.enhances[]` by target?
- Should `manual.related_to[]` be updated with `edges.enhances[]`?
- Should apply mode regenerate `mcp_server/scripts/skill-graph.json`, or only
  patch source metadata and rebuild SQLite?
- Should report mode include medium-confidence candidates by default?
- Should thresholds differ by family?
- Should archived/future/deprecated skills be excluded?
- Should target-side explicit hints be allowed in schema v3?
- Should source-side propagation policies be allowed in schema v3?
- Should watcher events later emit report-only diagnostics?
- Should `advisor_rebuild` optionally run this audit?
- How should operators dismiss known false positives?
- Where should candidate ids be documented so follow-up automation can target
  them safely?
- Should non-cli family propagation wait until there is a labeled audit set?

## Final Position

- The architecture should not silently mutate upstream skills when a new skill
  is registered.
- It should detect high-confidence missing inbound `enhances` edges and make the
  patch cheap, explicit, and repeatable.
- The MVP is narrow:
  cli-family parity plus asset evidence, surfaced through
  `skill_graph_propagate_enhances`, with apply mode gated by operator intent.

STATUS=OK
