---
title: "Score Recovery V2"
description: "Skill Graph quality recovery from 2.75/5.0 to 5.0/5.0 across three benchmark suites via parser, executor, graph builder and advisor fixes."
trigger_phrases:
  - "score recovery"
  - "skill graph"
  - "SGQS benchmarks"
  - "benchmark scores"
importance_tier: "normal"
---

# Score Recovery V2

> From 2.75 to perfect 5.0 across all three benchmark suites.

Child spec 009 of hybrid-rag-fusion (spec 138). Repaired the Skill Graph system — parser, executor, graph builder and skill advisor — to restore benchmark quality from a failing 2.75/5.0 to a perfect 5.0/5.0 across Legacy20, V2 and StrictHoldout suites.

---

## TABLE OF CONTENTS
<!-- ANCHOR:table-of-contents -->

- [1. OVERVIEW](#1--overview)
- [2. SKILL GRAPH](#2--skill-graph)
- [3. SGQS QUERY LANGUAGE](#3--sgqs-query-language)
- [4. MCP INTEGRATION](#4--mcp-integration)
- [5. BENCHMARKS](#5--benchmarks)
- [6. WHAT WAS FIXED](#6--what-was-fixed)
- [7. QUICK START](#7--quick-start)
- [8. TROUBLESHOOTING](#8--troubleshooting)
- [9. STRUCTURE](#9--structure)
- [10. RELATED RESOURCES](#10--related-resources)

<!-- /ANCHOR:table-of-contents -->

---

## 1. OVERVIEW
<!-- ANCHOR:overview -->

### The Problem

The Skill Graph — the structured map of every AI assistant capability — was returning poor results. Benchmark average: 2.75/5.0, below the minimum passing threshold of 3.0. Three root causes:

1. **Cross-skill links not materializing.** Graph construction dropped connections between skills, breaking multi-domain queries.
2. **Query parsing gaps.** Alias handling and keyword normalization were inconsistent. Same question, different phrasing, different results.
3. **Advisor misrouting.** The skill advisor sent queries in the wrong direction.

### The Solution

Four core files fixed (graph-builder, parser, executor, advisor) plus 11 node vocabulary enrichments across 5 skills. All three benchmark suites now score 5.0/5.0.

### By The Numbers

| Category | Count |
| --- | --- |
| **Core files fixed** | 4 |
| **Node files enriched** | 11 (across 5 skills) |
| **Benchmark suites** | 3 (Legacy20, V2, StrictHoldout) |
| **Scenarios per suite** | 20 |
| **Final score** | 5.0/5.0 (all suites) |
| **Previous score** | 2.75/5.0 |
| **Freeze integrity** | Cryptographically verified |

---

<!-- /ANCHOR:overview -->

## 2. SKILL GRAPH
<!-- ANCHOR:skill-graph -->

### What It Is

A skill graph is a structured map of everything an AI assistant system knows how to do. Instead of a flat list, capabilities are organized as a network: skills connect to other skills, individual capabilities reference capabilities in other skills.

### Why a Graph

| Approach | Strengths | Weaknesses |
| --- | --- | --- |
| Flat list | Easy to maintain | No relationships between items |
| Folder hierarchy | Groups related items | No cross-group relationships |
| Graph | Captures grouping and cross-references | Requires a query system |

Real-world questions span multiple skills. "How do I set up a new project with git and proper documentation?" touches version control and documentation. The graph traces those connections.

### Building Blocks

**Skills** — Named bundles of related capabilities. Each skill lives in its own folder.

| Skill | Domain | Example Capabilities |
| --- | --- | --- |
| `sk-git` | Version control | Commit workflows, workspace setup, branch management |
| `sk-code--opencode` | Coding standards | Language detection, integration points, quick reference |
| `sk-documentation` | Documentation | Document quality, component creation, flowcharts |
| `system-spec-kit` | Project management | Validation workflows, checklists, phase systems |
| `sk-code--web` | Web development | Debugging, implementation, frontend setup |

**Nodes** — Single markdown files in a skill's `nodes/` folder describing one capability. Structured frontmatter (name, description, keywords) plus wikilinks to other nodes.

**Edges** — Directional connections between nodes, created automatically from references.

| Edge Type | Meaning |
| --- | --- |
| `LINKS_TO` | General reference from one node to another |
| `CONTAINS` | A skill contains a node |
| `REFERENCES` | A node mentions another node's topic |
| `DEPENDS_ON` | A node requires another to function |

Cross-skill edges are what allow multi-domain queries to work.

### Build Pipeline

| Stage | Component | Input | Output |
| --- | --- | --- | --- |
| Parse | `parser.ts` | Node markdown files | Structured metadata + edge candidates |
| Build | `graph-builder.ts` | Parsed metadata | In-memory graph (nodes + edges) |
| Cache | Cache manager | Built graph + 5-min TTL | Fast-access graph snapshot |
| Execute | `executor.ts` | SGQS query string | Matching rows, columns, graph stats |
| Route | `skill_advisor.py` | Agent's question | Ranked skill suggestions with confidence |

---

<!-- /ANCHOR:skill-graph -->

## 3. SGQS QUERY LANGUAGE
<!-- ANCHOR:sgqs -->

### What It Is

**SGQS** (Skill Graph Query Search) — a simplified Cypher-inspired query language for searching the skill graph. No Cypher knowledge required.

### Basic Structure

```
MATCH (variable:Label) WHERE condition RETURN fields
```

- **MATCH**: What to search for. `n` = placeholder, `Node` = type.
- **WHERE**: Filter results by property.
- **RETURN**: Fields to include in output.

### Example Queries

```sql
-- Find all nodes related to "git"
MATCH (n:Node) WHERE n.name CONTAINS "git" RETURN n.name, n.skill

-- Cross-skill connections from sk-git
MATCH (n:Node)-[:LINKS_TO]->(m:Node) WHERE n.skill = "sk-git" RETURN n.name, n.skill, m.name, m.skill

-- All nodes in a specific skill
MATCH (n:Node) WHERE n.skill = "sk-documentation" RETURN n.name, n.description
```

### Quick Reference

| Clause | Purpose | Example |
| --- | --- | --- |
| `MATCH (n:Node)` | Search all nodes | `MATCH (n:Node)` |
| `MATCH (n:Node)-[:EDGE]->(m:Node)` | Follow edge type | `[:LINKS_TO]`, `[:CONTAINS]` |
| `WHERE n.property = "value"` | Exact match | `WHERE n.skill = "sk-git"` |
| `WHERE n.property CONTAINS "text"` | Substring match | `WHERE n.name CONTAINS "commit"` |
| `RETURN field1, field2` | Output columns | `RETURN n.name, n.skill` |

---

<!-- /ANCHOR:sgqs -->

## 4. MCP INTEGRATION
<!-- ANCHOR:mcp-integration -->

### How It Works

The skill graph is exposed through `memory_skill_graph_query` on the MCP server. One parameter: a SGQS query string.

| Property | Value |
| --- | --- |
| Tool name | `memory_skill_graph_query` |
| Parameter | `queryString` (SGQS query) |
| Returns | `columns`, `rows`, `rowCount`, `errors`, `graphStats` |
| Cache | 5-minute TTL, auto-refresh |

### Integration Flow

```
Agent question
      |
      v
Agent calls memory_skill_graph_query("MATCH ...")
      |
      v
MCP server receives call → SGQS executor runs against cached graph
      |
      v
Results (columns, rows, stats) returned to agent
```

### Current Limitation

No manual cache refresh endpoint. Graph cache operates on a fixed 5-minute timer. Node file changes appear in results within 5 minutes at most.

---

<!-- /ANCHOR:mcp-integration -->

## 5. BENCHMARKS
<!-- ANCHOR:benchmarks -->

### Scoring

Each benchmark suite contains 20 scenarios. Each scenario scores 0-5:

| Score | Meaning |
| --- | --- |
| 5 | Perfect — correct skill, high confidence |
| 4 | Good — correct skill, minor issues |
| 3 | Acceptable — correct skill present, not top-ranked |
| 2 | Weak — partially correct or low confidence |
| 1 | Poor — mostly wrong |
| 0 | Fail — completely wrong or no results |

Suite overall score = average across all 20 scenarios.

### The Three Suites

| Suite | Purpose | Passing Threshold |
| --- | --- | --- |
| **Legacy20** | Safety net — old behavior preserved | 3.0/5.0 |
| **V2** | Primary quality measure | 3.5/5.0 |
| **StrictHoldout** | Hardest scenarios + freeze integrity verification | 4.5/5.0 |

- **Legacy20**: Even if new changes improve V2 scores, old functionality must not break. Drop below 3.0 = change rejected.
- **V2**: Primary quality milestone the team aims to clear first.
- **StrictHoldout**: Most demanding suite. Includes cryptographic locking (hash-based) of test inputs and runner, proving no tampering.

### Score History

| Phase | Score | Status |
| --- | --- | --- |
| Phase 006 (baseline) | 2.50/5.0 | Below all thresholds |
| Phase 007 (first improvement) | 2.75/5.0 | Still below |
| **Phase 009 — Legacy20** | **5.00/5.0** | PASS (threshold: 3.0) |
| **Phase 009 — V2** | **5.00/5.0** | PASS (threshold: 3.5) |
| **Phase 009 — StrictHoldout** | **5.00/5.0** | PASS (threshold: 4.5) |

---

<!-- /ANCHOR:benchmarks -->

## 6. WHAT WAS FIXED
<!-- ANCHOR:fixes -->

### Core File Changes

| File | Component | What Changed |
| --- | --- | --- |
| `graph-builder.ts` | Graph Builder | Cross-skill links now reliably materialized |
| `parser.ts` | Parser | Alias handling and query normalization fixed |
| `executor.ts` | Query Executor | Benchmark scenarios produce accurate, complete results |
| `skill_advisor.py` | Skill Advisor | Routing confidence and boosting tuned |

### Node Vocabulary Enrichments

11 node files across 5 skills updated with improved descriptions and keywords matching real query terms:

| Skill | Nodes Updated |
| --- | --- |
| `system-spec-kit` | 3 |
| `sk-code--web` | 3 |
| `sk-code--opencode` | 2 |
| `sk-git` | 2 |
| `sk-documentation` | 1 |

---

<!-- /ANCHOR:fixes -->

## 7. QUICK START
<!-- ANCHOR:quick-start -->

All commands run from repository root.

### Run V2 Benchmark

```bash
node specs/003-system-spec-kit/138-hybrid-rag-fusion/009-score-recovery-v2/scratch/benchmark-runner.cjs \
  specs/003-system-spec-kit/138-hybrid-rag-fusion/009-score-recovery-v2/scratch/benchmark-scenarios-v2.json \
  /tmp/sgqs-v2-quickstart.json
```

Expected: `{ "suite": "V2", "averageScore": 5, "totalScenarios": 20 }`

### Run Legacy20 Benchmark

```bash
node specs/003-system-spec-kit/138-hybrid-rag-fusion/009-score-recovery-v2/scratch/benchmark-runner.cjs \
  specs/003-system-spec-kit/138-hybrid-rag-fusion/009-score-recovery-v2/scratch/benchmark-scenarios-legacy20.json \
  /tmp/sgqs-legacy20-quickstart.json
```

### Run StrictHoldout Benchmark

```bash
node .opencode/specs/003-system-spec-kit/138-hybrid-rag-fusion/009-score-recovery-v2/scratch/benchmark-runner.cjs \
  .opencode/specs/003-system-spec-kit/138-hybrid-rag-fusion/009-score-recovery-v2/scratch/benchmark-scenarios-strictholdout.json \
  /tmp/sgqs-strict-quickstart.json
```

### Verify Report Format

```bash
python3 - <<'PY'
import json
from pathlib import Path
obj = json.loads(Path('/tmp/sgqs-v2-quickstart.json').read_text())
print(sorted(obj.keys()))
print(sorted(obj['results'][0].keys()))
PY
```

Expected:

```
['averageScore', 'description', 'generatedAt', 'results', 'suite', 'totalScenarios', 'totalScore']
['exitCode', 'id', 'output', 'persona', 'query', 'reason', 'score', 'stderr', 'threshold', 'type']
```

### Test Cross-Skill Traversal

```bash
node specs/003-system-spec-kit/138-hybrid-rag-fusion/006-skill-graph-utilization/scratch/run-sgqs-test.cjs \
  "MATCH (n:Node)-[:LINKS_TO]->(m:Node) WHERE n.skill = \"sk-git\" RETURN n.name, n.skill, m.name, m.skill"
```

Expected: rows with nodes from different skills connected by `LINKS_TO` edges.

---

<!-- /ANCHOR:quick-start -->

## 8. TROUBLESHOOTING
<!-- ANCHOR:troubleshooting -->

### Quick Fixes

| Symptom | Check | Fix |
| --- | --- | --- |
| Score below threshold | Open results JSON, inspect `reason` per failed scenario | Re-run failing scenarios individually |
| Cross-skill queries return 0 rows | Run `LINKS_TO` query (see Quick Start) | Rebuild graph, verify node wikilinks |
| Advisor returns empty list | Run advisor with `--threshold 0.8` | Expand routing terms in advisor config |
| Node changes not in results | Wait up to 5 min for cache refresh | Restart MCP server for immediate refresh |
| Build errors in SGQS files | Check `scripts/sgqs/*.ts` compilation | Errors in `mcp_server/` are unrelated |

---

<!-- /ANCHOR:troubleshooting -->

## 9. STRUCTURE
<!-- ANCHOR:structure -->

```
009-score-recovery-v2/
├── spec.md                    # Requirements and scope
├── plan.md                    # Implementation plan with quality gates
├── tasks.md                   # Task breakdown with status
├── checklist.md               # Verification checklist (all passed)
├── implementation-summary.md  # Record of what was built
├── README.md                  # This file
├── memory/                    # Session context for future work
└── scratch/
    ├── benchmark-runner.cjs                   # Benchmark execution script
    ├── benchmark-scenarios-legacy20.json      # 20 Legacy test scenarios
    ├── benchmark-scenarios-v2.json            # 20 V2 test scenarios
    ├── benchmark-scenarios-strictholdout.json # 20 StrictHoldout test scenarios
    ├── results-legacy20.json                  # Legacy20 score evidence
    ├── results-v2.json                        # V2 score evidence
    ├── results-strictholdout.json             # StrictHoldout score evidence
    ├── score-dashboard.md                     # Consolidated score summary
    ├── strict-score-dashboard.md              # Strict-cycle score summary
    ├── strict-freeze-manifest.json            # Cryptographic integrity hashes
    └── agent-wave*.md                         # Verification wave logs
```

---

<!-- /ANCHOR:structure -->

## 10. RELATED RESOURCES
<!-- ANCHOR:related -->

### This Spec Folder

| Document | Purpose |
| --- | --- |
| [spec.md](./spec.md) | Requirements and acceptance criteria |
| [plan.md](./plan.md) | Implementation phases and quality gates |
| [tasks.md](./tasks.md) | Task list with completion status |
| [checklist.md](./checklist.md) | Verification evidence (28/28 passed) |
| [implementation-summary.md](./implementation-summary.md) | Complete record of changes |

### Earlier Phases

| Phase | Purpose |
| --- | --- |
| [002 — Skill Graph Integration](../002-skill-graph-integration/README.md) | Established graph structure and SGQS layer |
| [003 — Unified Graph Intelligence](../003-unified-graph-intelligence/implementation-summary.md) | Connected graph to retrieval system |
| [006 — Skill Graph Utilization](../006-skill-graph-utilization/spec.md) | Measured usage, established 2.50 baseline |
| [007 — Skill Graph Improvement](../007-skill-graph-improvement/) | First improvement attempt (2.75) |

### Key Source Files

| File | Purpose |
| --- | --- |
| `scripts/sgqs/parser.ts` | Node file parsing and metadata extraction |
| `scripts/sgqs/executor.ts` | SGQS query execution |
| `scripts/sgqs/graph-builder.ts` | Graph construction from parsed metadata |
| `skill_advisor.py` | Skill routing with confidence scoring |
| `memory_skill_graph_query` | MCP tool for graph queries |

<!-- /ANCHOR:related -->
