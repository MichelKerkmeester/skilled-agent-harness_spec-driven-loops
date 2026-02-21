---
title: "Skills Library"
description: "Domain-specific, on-demand capabilities providing specialized workflows for code, documentation, git, browser debugging and external tool integration"
trigger_phrases:
  - "skills library"
  - "available skills"
  - "skill overview"
  - "what skills exist"
  - "skill routing"
  - "skill advisor"
importance_tier: "normal"
---

# Skills Library

<!-- ANCHOR:table-of-contents -->
## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. QUICK START](#2--quick-start)
- [3. STRUCTURE](#3--structure)
- [4. SKILLS CATALOG](#4--skills-catalog)
- [5. SKILL GRAPH](#5--skill-graph)
- [6. SKILL ROUTING](#6--skill-routing)
- [7. CREATING SKILLS](#7--creating-skills)
- [8. RELATED](#8--related)

<!-- /ANCHOR:table-of-contents -->

<!-- ANCHOR:overview -->
## 1. OVERVIEW

The Skills Library contains 9 domain-specific skills across 5 categories. Each skill provides specialized workflows for complex, multi-step tasks.

Skills differ from passive knowledge files in two ways. They are explicitly invoked (on-demand, not always-on). They provide step-by-step workflow instructions with bundled resources, scripts and templates.

Skills load on-demand through Gate 2 routing via `skill_advisor.py` or through explicit invocation. Once loaded, a skill injects its instructions and resource paths into the conversation context.

<!-- /ANCHOR:overview -->

<!-- ANCHOR:quick-start -->
## 2. QUICK START

Three ways to use a skill:

**1. Automatic routing (Gate 2)**

```bash
python3 .opencode/skill/scripts/skill_advisor.py "[your request]" --threshold 0.8
```

If confidence is 0.8 or higher, the recommended skill is invoked automatically.

**2. Explicit invocation**

```
Read(".opencode/skill/<skill-name>/SKILL.md")
```

**3. Skill tool**

```
skill(name: "<skill-name>")
```

**Loading protocol:**

```
Invoke skill → SKILL.md loads → instructions + resource paths injected → follow to completion
```

Do not re-invoke a skill already in context.

<!-- /ANCHOR:quick-start -->

<!-- ANCHOR:structure -->
## 3. STRUCTURE

```
.opencode/skill/
├── mcp-code-mode/
├── mcp-figma/
├── system-spec-kit/
├── mcp-chrome-devtools/
├── sk-code--full-stack/
├── sk-code--opencode/
├── sk-code--web/
├── sk-documentation/
├── sk-git/
└── README.md              ← this file
```

Each skill folder contains:

| Directory          | Purpose                                                    |
| ------------------ | ---------------------------------------------------------- |
| `SKILL.md`         | Entry point. Loaded when the skill is invoked.             |
| `index.md`         | Map of Content (MOC) for the Skill Graph. Wikilinks to nodes. |
| `nodes/`           | Knowledge node files with YAML frontmatter and `[[wikilinks]]`. |
| `references/`      | Domain knowledge, coding standards and pattern libraries   |
| `scripts/`         | Automation scripts (validation, generation, indexing)       |
| `assets/`          | Templates, configs and static resources                    |
| `constitutional/`  | Core memory files that always surface in memory searches    |

Not every skill uses all directories. `SKILL.md` is the only required file.

<!-- /ANCHOR:structure -->

<!-- ANCHOR:skills-catalog -->
## 4. SKILLS CATALOG

### Core System

#### `system-spec-kit` (v2.2.9.0)

Unified documentation and context preservation. Spec folder workflow (levels 1-3+), CORE + ADDENDUM template architecture (v2.2), validation and Spec Kit Memory for cognitive context preservation. The foundational skill that all others depend on.

- Spec folder creation with tiered documentation levels (1 through 3+)
- Template-driven document generation with CORE + ADDENDUM architecture
- Validation scripts for structure, content quality and completeness
- Cognitive memory system for cross-session context preservation

---

### Code Workflows

#### `sk-code--full-stack` (v1.0.0.0)

Stack-agnostic development orchestrator. Auto-detects Go, Node.js, React, React Native and Swift via marker files. Implementation, Debugging and Verification lifecycle.

- Automatic stack detection through marker files (`package.json`, `go.mod`, `Podfile`, `Package.swift`)
- Three-phase lifecycle: Implementation, Debugging, Verification
- Stack-specific coding standards and testing patterns
- Language-aware linting and build verification

#### `sk-code--web` (v1.0.5.0)

Frontend development orchestrator with Webflow integration. Implementation, Debugging and Verification across 6 specialized code quality sub-skills.

- Webflow-specific patterns for custom code, attributes and embeds
- 6 code quality sub-skills for style enforcement
- Async handling, validation and error boundary patterns
- Browser verification at multiple viewports (mandatory before completion)

#### `sk-code--opencode` (v1.0.5.0)

Multi-language code standards for OpenCode system code (JavaScript, TypeScript, Python, Shell and JSON/JSONC) with language detection routing and universal patterns.

- Language detection routing across 5 language targets
- Universal patterns applied regardless of language
- Quality checklists per language
- OpenCode-specific conventions and file organization

---

### Development Ops

#### `sk-git` (v1.0.2.0)

Git development orchestrator guiding workspace setup (worktrees), clean commits (Conventional Commits) and work completion (merge, PR and cleanup).

- Git worktree management for parallel development
- Conventional Commits enforcement with scope validation
- PR creation and merge workflows
- Branch cleanup and workspace teardown

#### `mcp-chrome-devtools` (v1.0.1.0)

Chrome DevTools orchestrator with CLI (bdg) and MCP approaches. Browser debugging, screenshots, HAR files, console logs and network inspection.

- CLI-first approach via `bdg` for speed and token efficiency
- MCP fallback for multi-tool integration scenarios
- Screenshot capture, HAR recording and console log extraction
- Network inspection and performance analysis

---

### Documentation

#### `sk-documentation` (v1.0.6.0)

Document quality enforcement and content optimization. Component creation workflows for skills, agents and commands. ASCII flowcharts and install guides.

- DQI (Document Quality Index) scoring and validation
- Template-aligned output for all document types
- Component creation workflows (skills, agents, commands)
- ASCII flowchart generation and install guide formatting

---

### MCP Integrations

#### `mcp-code-mode` (v1.0.4.0)

TypeScript execution with 200+ MCP tools via progressive disclosure. 98.7% context reduction, 60% faster execution and type-safe invocation for all external tool integration.

- Progressive tool discovery with `search_tools()` and `tool_info()`
- Type-safe TypeScript execution via `call_tool_chain()`
- Supports Webflow, ClickUp, Notion, GitHub and Chrome DevTools
- Manual registration for custom tool providers

#### `mcp-figma` (v1.0.2.0)

Figma design file access via MCP providing 18 tools for file retrieval, image export, component and style extraction, team management and collaborative commenting.

- File and node retrieval with selective depth control
- Image export in multiple formats and scales
- Component and style library extraction
- Team project management and comment threading

<!-- /ANCHOR:skills-catalog -->

<!-- ANCHOR:skill-graph -->
## 5. SKILL GRAPH

### 5.1 Overview

The Skill Graph is a queryable knowledge graph built from the filesystem structure of the Skills Library. It models skills, their content nodes and the relationships between them as a directed graph traversable via SGQS (Skill Graph Query System), a Cypher-lite query language.

| Metric              | Value                                                                        |
| ------------------- | ---------------------------------------------------------------------------- |
| Skills indexed      | 10                                                                           |
| Knowledge nodes     | 83 files in `nodes/` directories                                             |
| Total graph nodes   | 435 (includes references, structural files and virtual `:Skill` roots)       |
| Node labels         | 7: `Node`, `Index`, `Skill`, `Entrypoint`, `Reference`, `Asset`, `Document` |
| Edge types          | 6: `LINKS_TO`, `CONTAINS`, `REFERENCES`, `HAS_ENTRYPOINT`, `HAS_INDEX`, `DEPENDS_ON` |
| Max traversal depth | 10 hops (variable-length paths)                                              |
| Cache TTL           | 300 seconds (5 minutes)                                                      |

The graph is built on demand, cached in memory and queried through the `memory_skill_graph_query` MCP tool.

### 5.2 Node Structure

Every `.md` file inside a skill directory becomes a graph node. Nodes are identified by their relative path without extension (e.g., `sk-git/nodes/rules`).

**YAML frontmatter** provides node properties. The graph builder parses frontmatter with a zero-dependency regex parser supporting strings, arrays, numbers, booleans and null values.

```yaml
---
description: "ALWAYS/NEVER/ESCALATE rules governing git workflow behavior"
---
# Rules

Hard constraints that apply to every git workflow operation.
```

Parsed frontmatter properties are stored alongside computed properties (`skill`, `path`, `name`, `type`, `title`).

**Node labels** are inferred from file location:

| Location                   | Label         | Example                       |
| -------------------------- | ------------- | ----------------------------- |
| `{skill}/nodes/*.md`       | `:Node`       | `sk-git/nodes/rules`          |
| `{skill}/index.md`         | `:Index`      | `sk-git/index`                |
| `{skill}/SKILL.md`         | `:Entrypoint` | `sk-git/SKILL`                |
| `{skill}/references/*.md`  | `:Reference`  | `sk-git/references/config`    |
| `{skill}/assets/*.md`      | `:Asset`      | `sk-documentation/assets/tpl` |
| Other `.md` files          | `:Document`   | `sk-git/README`               |
| Virtual (no file)          | `:Skill`      | `sk-git`                      |

**Wikilink syntax** connects nodes within and across skills:

```markdown
- [[nodes/success-criteria|Success Criteria]] — Quality gates
- [[nodes/commit-workflow]] — Commit formatting conventions
```

**Index.md MOC pattern.** Each skill includes an `index.md` that serves as a Map of Content (MOC). It uses wikilinks to reference child nodes. The graph builder creates `:CONTAINS` edges from Index nodes to any linked `nodes/` targets.

### 5.3 Edge Types

Edges are extracted from wikilinks (`[[target]]`), markdown links (`[text](path.md)`) and structural conventions. Each edge has a unique ID: `{source}--{TYPE}--{target}`.

| Edge Type        | Source              | Description                                         |
| ---------------- | ------------------- | --------------------------------------------------- |
| `LINKS_TO`       | Wikilinks / md links | General link between two nodes                     |
| `CONTAINS`       | Index wikilinks     | Structural containment (Index to nodes/ target)     |
| `REFERENCES`     | Markdown links      | Explicit reference via `[text](path.md)` syntax     |
| `HAS_ENTRYPOINT` | Structural (auto)   | Virtual `:Skill` node to `SKILL.md` `:Entrypoint`  |
| `HAS_INDEX`      | Structural (auto)   | Virtual `:Skill` node to `index.md` `:Index`        |
| `DEPENDS_ON`     | Cross-skill links   | Wikilink or markdown link crossing a skill boundary |

A validation pass removes dangling edges whose source or target nodes do not exist.

### 5.4 SGQS Query Engine

SGQS uses a Cypher-lite syntax with three clauses: `MATCH`, `WHERE` (optional) and `RETURN` (required). Queries are parsed by a recursive descent parser with post-parse semantic validation.

| Clause   | Required | Purpose                                                   |
| -------- | -------- | --------------------------------------------------------- |
| `MATCH`  | Yes      | Define graph patterns with node and relationship patterns |
| `WHERE`  | No       | Filter with boolean expressions, comparisons, null checks |
| `RETURN` | Yes      | Project results as properties, variables or aggregates    |

**Node pattern:** `(binding:Label {key: "value"})`

**Relationship pattern:** `-[binding:TYPE*min..max]->` (direction: `->` outbound, `<-` inbound, `-` both)

**WHERE operators:** `=`, `<>`, `<`, `>`, `<=`, `>=`, `CONTAINS`, `STARTS WITH`, `ENDS WITH`, `IS NULL`, `IS NOT NULL`, `AND`, `OR`, `NOT`

**RETURN modifiers:** `DISTINCT`, `AS alias`, `COUNT(*)`, `COUNT(DISTINCT n.prop)`, `COLLECT(n.prop)`

**Examples:**

```cypher
-- List all skills
MATCH (n:Skill) RETURN n.name

-- Find all nodes in a specific skill
MATCH (s:Skill)-[:HAS_INDEX]->(i:Index)-[:CONTAINS]->(n:Node)
WHERE s.name = "sk-git"
RETURN n.name, n.description

-- Count nodes per skill
MATCH (s:Skill)-[:HAS_INDEX]->(i:Index)-[:CONTAINS]->(n:Node)
RETURN s.name, COUNT(n) AS node_count

-- Find cross-skill dependencies
MATCH (a:Node)-[r:DEPENDS_ON]->(b:Node)
RETURN a.skill, a.name, b.skill, b.name
```

### 5.5 Build Pipeline

```
Scan ──► Parse ──► Extract ──► Structure ──► Validate ──► Cache
 │         │          │            │              │           │
 │       Read .md   Wikilinks   HAS_ENTRYPOINT  Remove      300s TTL
 │       Parse YAML Md links    HAS_INDEX       dangling    Single-flight
Discover            LINKS_TO                    edges       Epoch counter
skills              CONTAINS
                    REFERENCES
                    DEPENDS_ON
```

**Query execution:** `Query string` &#8594; `Tokenize` &#8594; `Parse (AST)` &#8594; `MATCH (pattern matching)` &#8594; `WHERE (filter)` &#8594; `RETURN (project/aggregate)` &#8594; `SGQSResult`

Cache provides sub-millisecond responses on hits versus ~100-150ms for cold filesystem rebuilds. Invalidate manually via `memory_skill_graph_invalidate` or wait for TTL expiry.

### 5.6 Feature Flags

Three environment variables control graph-enhanced search. All default to `true` (enabled). Set to `"false"` to disable.

| Flag                      | Default | Description                                                                           |
| ------------------------- | ------- | ------------------------------------------------------------------------------------- |
| `SPECKIT_GRAPH_UNIFIED`   | `true`  | Master switch for the graph channel in RRF fusion                                     |
| `SPECKIT_GRAPH_MMR`       | `true`  | Graph-Guided MMR diversity reranking with BFS shortest-path distance                  |
| `SPECKIT_GRAPH_AUTHORITY` | `true`  | Structural Authority Propagation scoring (Index 3.0x, Entrypoint 2.5x, Reference 1.0x, Asset 0.3x) |

### 5.7 MCP Integration

Two MCP tools on the Spec Kit Memory server expose the Skill Graph.

**`memory_skill_graph_query`** — Execute an SGQS query against the cached skill graph.

| Parameter     | Type   | Required | Description                               |
| ------------- | ------ | -------- | ----------------------------------------- |
| `queryString` | string | Yes      | SGQS query (Cypher-lite, max 4096 chars)  |

Returns `columns`, `rows`, `rowCount` and `errors`.

**`memory_skill_graph_invalidate`** — Force-clear the cached graph so the next query triggers a fresh rebuild. No parameters required.

Use after modifying skill files (adding nodes, editing wikilinks, creating new skills) to ensure the graph reflects the latest state.

<!-- /ANCHOR:skill-graph -->

<!-- ANCHOR:skill-routing -->
## 6. SKILL ROUTING

Gate 2 in the mandatory pre-execution gates handles skill routing. The `skill_advisor.py` script analyzes each request and returns a confidence score with a recommended skill.

**Routing flow:**

```
Request → skill_advisor.py → confidence >= 0.8? → MUST invoke skill
                           → confidence <  0.8? → General approach OK
```

**How it works:**

1. The script receives the user request as a quoted string
2. It matches against trigger phrases, skill descriptions and task patterns
3. It returns a confidence score (0.0 to 1.0) and the best-matching skill
4. At 0.8 or above, invocation is mandatory (not optional)

**Multi-stack detection:**

For code workflow skills, the advisor also checks marker files in the project root:

| Marker File      | Detected Stack  | Routed Skill                  |
| ---------------- | --------------- | ----------------------------- |
| `package.json`   | Node.js / React | `sk-code--web`     |
| `go.mod`         | Go              | `sk-code--full-stack`  |
| `Podfile`        | iOS / Swift     | `sk-code--full-stack`  |
| `Package.swift`  | Swift           | `sk-code--full-stack`  |

**Running the advisor manually:**

```bash
python3 .opencode/skill/scripts/skill_advisor.py "build a new React component" --threshold 0.8
```

<!-- /ANCHOR:skill-routing -->

<!-- ANCHOR:creating-skills -->
## 7. CREATING SKILLS

To create a new skill, use the `sk-documentation` skill with the skill creation template.

**Template location:**

```
.opencode/skill/sk-documentation/references/skill_creation.md
```

**Asset templates:**

```
.opencode/skill/sk-documentation/assets/opencode/skill_md_template.md
.opencode/skill/sk-documentation/assets/opencode/skill_reference_template.md
.opencode/skill/sk-documentation/assets/opencode/skill_asset_template.md
```

**Key files in every skill:**

| File / Directory   | Role                                              |
| ------------------ | ------------------------------------------------- |
| `SKILL.md`         | Entry point, loaded on invocation (required)       |
| `references/`      | Domain knowledge and pattern libraries             |
| `scripts/`         | Automation (validation, generation, indexing)       |
| `assets/`          | Templates, configs and static files                |

After creating a skill, validate its structure against the template and test invocation before committing.

<!-- /ANCHOR:creating-skills -->

<!-- ANCHOR:related -->
## 8. RELATED

**Framework:**

- [Main Framework README](../README.md)
- [AGENTS.md](../../AGENTS.md) (agent routing and behavioral framework)
- [skill_advisor.py](scripts/skill_advisor.py)

**Individual skill READMEs:**

- [system-spec-kit](system-spec-kit/)
- [sk-code--full-stack](sk-code--full-stack/)
- [sk-code--web](sk-code--web/)
- [sk-code--opencode](sk-code--opencode/)
- [sk-git](sk-git/)
- [mcp-chrome-devtools](mcp-chrome-devtools/)
- [sk-documentation](sk-documentation/)
- [mcp-code-mode](mcp-code-mode/)
- [mcp-figma](mcp-figma/)

<!-- /ANCHOR:related -->
