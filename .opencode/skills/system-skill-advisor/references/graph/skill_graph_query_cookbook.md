---
title: "Skill Graph Query Cookbook"
description: "Worked examples for all 10 query types of skill_graph_query: depends_on, dependents, enhances, enhanced_by, family_members, conflicts, transitive_path, hub_skills, orphans, subgraph."
trigger_phrases:
  - "skill graph query cookbook"
  - "skill_graph_query examples"
  - "advisor graph traversal"
importance_tier: "normal"
contextType: "implementation"
version: 0.8.0.5
---

# Skill Graph Query Cookbook

Worked examples for all 10 query types of skill_graph_query: depends_on, dependents, enhances, enhanced_by, family_members, conflicts, transitive_path, hub_skills, orphans, subgraph.

---

## 1. OVERVIEW

### Purpose

Provides worked examples for every supported `skill_graph_query` query type.

### When to Use

- Building or testing graph traversal calls.
- Explaining depends-on, enhances, conflict, hub, orphan or subgraph query output.
- Revalidating graph behavior after drift reconciliation.

### Core Principle

Query examples should reflect live MCP semantics and remain tied to the package-local SQLite graph.

### Key Sources

- [`tool_ids_reference.md`](../runtime/tool_ids_reference.md)
- [`db_path_policy.md`](../config/db_path_policy.md)
- [`skill_graph_drift.md`](./skill_graph_drift.md)

---

## 2. QUERY TYPE INDEX

| Query Type | Purpose | Worked Section |
|---|---|---|
| `depends_on` | Outbound dependencies of a skill | §3 |
| `dependents` | Inbound dependencies (reverse) | §4 |
| `enhances` | Skills this one enhances | §5 |
| `enhanced_by` | Skills that enhance this one | §6 |
| `family_members` | Sibling skills in the same family | §7 |
| `conflicts` | Skills marked as mutually exclusive | §8 |
| `transitive_path` | Path between two skills through edges | §9 |
| `hub_skills` | Skills with highest in or out degree | §10 |
| `orphans` | Skills with no edges in either direction | §11 |
| `subgraph` | Local neighborhood around a skill | §12 |

---

## 3. `depends_on`

**Purpose**: Returns the outbound `depends_on` edges declared in a skill graph-metadata.json `edges.depends_on[]` array.

**Input**:

```json
{ "queryType": "depends_on", "skillId": "system-skill-advisor" }
```

**Output shape**:

```json
{
  "queryType": "depends_on",
  "skillId": "system-skill-advisor",
  "relationships": []
}
```

**Worked example**: `system-skill-advisor` currently has no hard dependencies. Query returns an empty edge list from the source graph-metadata.json.

**Gotcha**: An empty `relationships[]` does not mean the skill has no upstream needs. Many skills rely on `system-spec-kit` implicitly through the validate workflow without declaring it as a hard dependency. Cross-reference with the manual_testing_playbook for the runtime dependency story.

---

## 4. `dependents`

**Purpose**: Reverse query. Returns skills that declare `depends_on` pointing to the queried skill.

**Input**:

```json
{ "queryType": "dependents", "skillId": "system-spec-kit" }
```

**Output shape**:

```json
{
  "queryType": "dependents",
  "skillId": "system-spec-kit",
  "relationships": [
    { "source": "sk-code", "weight": 0.8, "context": "validation workflow" },
    { "source": "sk-doc", "weight": 0.6, "context": "template engine" }
  ]
}
```

**Worked example**: `system-spec-kit` is the platform anchor. Most `sk-*` skills declare it as a dependency. Query returns the full inbound dependency list with each source skill's weight and context.

**Gotcha**: A high inbound count signals a hub. If you plan to change `system-spec-kit` public surface, run `dependents` first to size the blast radius before any commit.

---

## 5. `enhances`

**Purpose**: Returns outbound `enhances` edges from the queried skill's graph-metadata.json `edges.enhances[]` array.

**Input**:

```json
{ "queryType": "enhances", "skillId": "system-skill-advisor" }
```

**Output shape**:

```json
{
  "queryType": "enhances",
  "skillId": "system-skill-advisor",
  "relationships": [
    { "target": "cli-claude-code", "weight": 0.7, "context": "routes claude delegation requests" },
    { "target": "cli-opencode", "weight": 0.7, "context": "routes opencode delegation requests" }
  ]
}
```

**Worked example**: The advisor enhances each CLI skill by routing prompts to the right one. Query returns the outbound enhancement edges, each carrying a context string explaining the relationship.

**Gotcha**: Asymmetric `enhances` declarations are common. A skill can declare it enhances another without that other declaring `enhanced_by`. The propagate-enhances internal tool (see [`propagate_enhances.md`](./propagate_enhances.md)) detects and proposes the missing reciprocals.

---

## 6. `enhanced_by`

**Purpose**: Inverse of `enhances`. Returns skills that declare they enhance the queried skill.

**Input**:

```json
{ "queryType": "enhanced_by", "skillId": "sk-code" }
```

**Output shape**:

```json
{
  "queryType": "enhanced_by",
  "skillId": "sk-code",
  "relationships": [
    { "source": "system-skill-advisor", "weight": 0.7, "context": "routes implementation requests" }
  ]
}
```

**Worked example**: `sk-code` is enhanced by the advisor that routes implementation prompts to it. Query returns the inbound enhancement edges.

**Gotcha**: The result reflects only declared inbound edges. Run `skill_graph_propagate_enhances` in `report` mode to find skills that should be enhancing this one but have not declared the edge yet.

---

## 7. `family_members`

**Purpose**: Returns all skills sharing the same `family` field in graph-metadata.json.

**Input**:

```json
{ "queryType": "family_members", "family": "system" }
```

**Output shape**:

```json
{
  "queryType": "family_members",
  "family": "system",
  "members": [
    { "skillId": "system-spec-kit", "category": "system" },
    { "skillId": "system-code-graph", "category": "system" },
    { "skillId": "system-skill-advisor", "category": "system" }
  ]
}
```

**Worked example**: The `system` family contains the three first-party `system-*` skills. Query returns all members with their categories.

**Gotcha**: `family` is a soft grouping for navigation. It does not imply runtime dependencies. Use `depends_on` or `enhances` for the real causal edges.

---

## 8. `conflicts`

**Purpose**: Returns skills marked as mutually exclusive via `edges.conflicts[]` in graph-metadata.json.

**Input**:

```json
{ "queryType": "conflicts", "skillId": "cli-opencode" }
```

**Output shape**:

```json
{
  "queryType": "conflicts",
  "skillId": "cli-opencode",
  "relationships": []
}
```

**Worked example**: Most cli-* skills do not declare conflicts. They route per dispatch and do not interfere. An empty result is the common case.

**Gotcha**: A non-empty `conflicts[]` signals a skill-level invariant. The advisor will refuse to surface both skills in the same recommendation set when conflicts are declared.

---

## 9. `transitive_path`

**Purpose**: Finds a path between two skills through any combination of edge types.

**Input**:

```json
{ "queryType": "transitive_path", "from": "system-skill-advisor", "to": "sk-code" }
```

**Output shape**:

```json
{
  "queryType": "transitive_path",
  "from": "system-skill-advisor",
  "to": "sk-code",
  "path": [
    { "skillId": "system-skill-advisor", "edge": "enhances", "weight": 0.7 },
    { "skillId": "sk-code", "edge": "(terminal)", "weight": null }
  ]
}
```

**Worked example**: The advisor enhances sk-code directly. Path length is 1 hop. For deeper skills the path may include multiple edges of different types.

**Gotcha**: If no path exists the response returns `path: []`. BFS depth is capped at the runtime configured limit (typically 4 hops). Beyond that the query returns `path: []` even when a longer chain exists.

---

## 10. `hub_skills`

**Purpose**: Returns skills with the highest combined in plus out degree across all edge types.

**Input**:

```json
{ "queryType": "hub_skills", "topN": 5 }
```

**Output shape**:

```json
{
  "queryType": "hub_skills",
  "topN": 5,
  "skills": [
    { "skillId": "system-spec-kit", "inDegree": 18, "outDegree": 6, "total": 24 },
    { "skillId": "sk-doc", "inDegree": 12, "outDegree": 4, "total": 16 },
    { "skillId": "system-skill-advisor", "inDegree": 9, "outDegree": 7, "total": 16 }
  ]
}
```

**Worked example**: `system-spec-kit` is the highest-degree hub because almost every other skill depends on its validation workflow. Use this query to identify high-blast-radius skills before refactors.

**Gotcha**: A high degree count does not mean a skill is high-quality. It just means many other skills point at it. Cross-reference with `advisor_validate` accuracy slices to see whether routing TO this skill is actually high-precision.

---

## 11. `orphans`

**Purpose**: Returns skills with zero edges in either direction.

**Input**:

```json
{ "queryType": "orphans" }
```

**Output shape**:

```json
{
  "queryType": "orphans",
  "skills": []
}
```

**Worked example**: A healthy skill graph has zero orphans. Every skill should declare at least one outbound or inbound edge so the advisor can route to it via graph signals.

**Gotcha**: An orphan skill will still surface in `advisor_recommend` if its explicit_author or lexical lanes score high enough. But the graph_causal lane contribution will be zero. Orphans are a signal to add at least one edge in the skill graph-metadata.json.

---

## 12. `subgraph`

**Purpose**: Returns the local neighborhood around a skill (default radius 1, configurable).

**Input**:

```json
{ "queryType": "subgraph", "skillId": "system-skill-advisor", "radius": 2 }
```

**Output shape**:

```json
{
  "queryType": "subgraph",
  "skillId": "system-skill-advisor",
  "radius": 2,
  "graph": {
    "nodes": [
      { "skillId": "system-skill-advisor", "depth": 0 },
      { "skillId": "system-code-graph", "depth": 1 },
      { "skillId": "cli-claude-code", "depth": 1 }
    ],
    "edges": [
      { "source": "system-skill-advisor", "target": "system-code-graph", "type": "enhances" },
      { "source": "system-skill-advisor", "target": "cli-claude-code", "type": "enhances" }
    ]
  }
}
```

**Worked example**: Use subgraph to build a visual neighborhood map around a skill before making changes. Radius 1 returns direct neighbors. Radius 2 includes neighbors of neighbors.

**Gotcha**: At radius 3 or higher the response can grow large for hub skills. The runtime caps the result at a configurable node count (default 100). Trim radius before requesting unless you need the full transitive closure.

---

## 13. RELATED

- [`tool_ids_reference.md`](../runtime/tool_ids_reference.md) §3, full `skill_graph_query` schema
- [`freshness_contract.md`](../runtime/freshness_contract.md), trust state must be `live` for reliable results
- [`propagate_enhances.md`](./propagate_enhances.md), internal tool that detects missing reciprocal enhances edges
- [`skill_graph_drift.md`](./skill_graph_drift.md), what to do when SQL graph diverges from graph-metadata.json source files
- `mcp_server/handlers/skill-graph/query.ts`, handler source
