---
title: "Iter 016 — Track 7: tool-ids-reference.md spec"
iteration: 16
track: 7
focus: "tool-ids-reference.md spec"
status: complete
newInfoRatio: 1.00
findings: 10
timestamp: 2026-05-15T17:31:35Z
---

## Iter 016 Findings (tool-ids-reference.md spec)

### Frontmatter Shape

```yaml
---
title: Tool IDs Reference
description: Complete reference for all 9 public + 1 internal system-skill-advisor MCP tool IDs, including namespaces, purposes, input/output schemas, and usage signals.
category: reference
tags: [mcp, tools, skill-advisor, skill-graph]
lastUpdated: 2026-05-15
---
```

### Section Outline

1. Overview
2. Advisor Tools (4 public tools)
3. Skill Graph Tools (5 public tools)
4. Internal Tools (1 internal tool)
5. MCP Namespace Convention
6. Schema Index

### Tool Reference Table

| Tool Name | MCP Namespace | Purpose | Typical Input Args | Output Shape Signal |
|-----------|--------------|---------|-------------------|---------------------|
| advisor_recommend | mcp__mk_skill_advisor__advisor_recommend | [L8:Skill Advisor] Recommend skills for a prompt using the native TypeScript advisor scorer. Returns prompt-safe recommendations, lane attribution, lifecycle redirect metadata, cache state, and freshness trust. | prompt (required), options.topK, options.includeAttribution, options.includeAbstainReasons, options.confidenceThreshold, options.uncertaintyThreshold | recommendations[] with skillId, score, confidence, uncertainty, dominantLane, laneBreakdown, redirectFrom/To, status; freshness, trustState, cache, _shadow |
| advisor_rebuild | mcp__mk_skill_advisor__advisor_rebuild | [L8:Skill Advisor] Explicitly rebuild the native advisor skill graph from checked-in skill metadata. Use when advisor_status reports stale, absent, or unavailable; pass force:true to rebuild even when status is live. | force (boolean, default false), workspaceRoot (optional) | rebuilt, skipped, reason, freshnessBefore/After, generationBefore/After, skillCount, summary, diagnostics |
| advisor_status | mcp__mk_skill_advisor__advisor_status | [L8:Skill Advisor] Report native advisor freshness, skill-graph generation, trust state, lane weights, and daemon availability without exposing prompt content. | workspaceRoot (required), maxMetadataFiles (optional) | freshness, generation, trustState, lastGenerationBump, lastScanAt, skillCount, laneWeights, daemonPid, errors |
| advisor_validate | mcp__mk_skill_advisor__advisor_validate | [L8:Skill Advisor] Run the native advisor regression bundle and return prompt-safe corpus, holdout, parity, safety, and latency slices. Requires confirmHeavyRun=true because this executes heavier validation work. | confirmHeavyRun (required, must be true), skillSlug (optional, nullable), outcomeEvents[] (optional) | workspaceRoot, skillSlug, thresholdSemantics, overallAccuracy, perSkill[], slices{corpus, holdout, parity, safety, latency}, telemetry{diagnostics, outcomes}, generatedAt |
| skill_graph_scan | mcp__mk_skill_advisor__skill_graph_scan | [L7:Maintenance] Index or re-index all .opencode/skills/*/graph-metadata.json files into skill-graph.sqlite using the hash-aware SQLite indexer. Token Budget: 800. | skillsRoot (optional, default .opencode/skills) | skillsRoot, scanResult{indexedCount, skippedCount, errors[]}, embeddings{refreshedCount, failedCount}, sourceSignature |
| skill_graph_query | mcp__mk_skill_advisor__skill_graph_query | [L6:Analysis] Query the SQLite-backed skill graph using structural relationship traversals. Supports depends_on, dependents, enhances, enhanced_by, family_members, conflicts, transitive_path, hub_skills, orphans, and subgraph. Token Budget: 1000. | queryType (required), skillId (for single-skill queries), sourceSkillId/targetSkillId (for transitive_path), family (for family_members), minInbound (for hub_skills), depth (for subgraph), limit | queryType, relationships[] or members[] or path[] or skills[] or graph{}; varies by queryType |
| skill_graph_status | mcp__mk_skill_advisor__skill_graph_status | [L7:Maintenance] Report skill graph health. Returns totalSkills, totalEdges, lastIndexedAt, families, categories, schemaVersions, staleness, validation, and dbStatus from the live SQLite graph. Token Budget: 500. | (none) | totalSkills, totalEdges, lastIndexedAt, families[], categories[], schemaVersions[], staleness{trackedSkills, freshSourceFiles, changedSourceFiles, missingSourceFiles, staleSkillIds[]}, validation{brokenEdgeCount, weightBandViolations, unsupportedSchemaVersionCount, isHealthy}, dbStatus |
| skill_graph_validate | mcp__mk_skill_advisor__skill_graph_validate | [L7:Maintenance] Validate the live skill graph for schema-version drift, broken edges, recommended weight-band violations, reciprocal symmetry, and lightweight dependency-cycle errors. Token Budget: 800. | (none) | isValid, errorCount, warningCount, checkedNodes, checkedEdges, errors[], warnings[] |
| skill_graph_propagate_enhances | mcp__mk_skill_advisor__skill_graph_propagate_enhances | [L7:Maintenance] Detect, report, and optionally apply missing inbound edges.enhances[] declarations across skills. Default mode: report (no writes). | skillsRoot (optional, default .opencode/skills), mode (report/propose/apply, default report), minConfidence (default 0.75), targetSkillIds[], sourceSkillIds[], applyCandidateIds[], applyAllHighConfidence (boolean), dryRun (boolean, default true) | skillsRoot, mode, candidates{detected[], proposed[], applied[]}, confidenceScores{}, dryRun, warnings[] |

### MCP Namespace Convention

All tools follow the pattern: `mcp__mk_skill_advisor__<tool<tool_name>` where `tool<tool_name>` matches the tool descriptor's `name` field (snake_case).

### Schema Index

| Tool | Input Schema | Output Schema |
|------|-------------|---------------|
| advisor_recommend | AdvisorRecommendInputSchema | AdvisorRecommendOutputSchema |
| advisor_rebuild | AdvisorRebuildInputSchema | AdvisorRebuildOutputSchema |
| advisor_status | AdvisorStatusInputSchema | AdvisorStatusOutputSchema |
| advisor_validate | AdvisorValidateInputSchema | AdvisorValidateOutputSchema |
| skill_graph_scan | ScanArgs (inline interface) | HandlerResponse (envelope) |
| skill_graph_query | QueryArgs (inline interface) | HandlerResponse (envelope) |
| skill_graph_status | (none) | HandlerResponse (envelope) |
| skill_graph_validate | (none) | HandlerResponse (envelope) |
| skill_graph_propagate_enhances | PropagateEnhancesArgs (inline interface) | HandlerResponse (envelope) |

ITER_016_COMPLETE: 10 findings, newInfoRatio=1.00
