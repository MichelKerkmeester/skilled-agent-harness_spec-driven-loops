---
title: README Indexing Pipeline
description: How README files are discovered, weighted, and indexed within the 5-source indexing pipeline alongside memory files, constitutional rules, project READMEs, and spec documents.
trigger_phrases:
  - "readme indexing"
  - "readme discovery"
  - "readme importance weight"
  - "includeReadmes parameter"
importance_tier: "normal"
---

# README Indexing Pipeline

> How README files are discovered, weighted, and indexed within the 5-source indexing pipeline alongside memory files, constitutional rules, project READMEs, and spec documents.

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

### Core Principle

README files provide persistent project documentation context that complements session-specific memories. They are indexed with reduced importance weights to ensure user work memories (decisions, blockers, context) always outrank documentation in search results.

### When This Applies

- `memory_index_scan()` is called (startup or manual)
- The `includeReadmes` parameter is `true` (default)
- README files exist in skill directories or the project root

### 5-Source Indexing Pipeline

The memory system indexes content from five distinct sources:

| #   | Source                   | Variable              | Discovery Function          | Location Pattern                        |
| --- | ------------------------ | --------------------- | --------------------------- | --------------------------------------- |
| 1   | **Memory Files**         | `specFiles`           | `findMemoryFiles()`         | `specs/*/memory/*.{md,txt}`             |
| 2   | **Constitutional Rules** | `constitutionalFiles` | `findConstitutionalFiles()` | `.opencode/skill/*/constitutional/*.md` |
| 3   | **Skill READMEs**        | `skillReadmes`        | `findSkillReadmes()`        | `.opencode/skill/*/README.{md,txt}`     |
| 4   | **Project READMEs**      | `projectReadmes`      | `findProjectReadmes()`      | `**/README.{md,txt}` (project root)     |
| 5   | **Spec Documents**       | `specDocFiles`        | `findSpecDocuments()`       | `.opencode/specs/**/*.md`               |

Sources 3 and 4 are controlled by the `includeReadmes` parameter. Source 5 is controlled by the `includeSpecDocs` parameter (default: `true`) or the `SPECKIT_INDEX_SPEC_DOCS` environment variable. The spec-document source relies on schema v13 fields (`document_type`, `spec_level`) introduced in spec 126.

Post-hardening alignment: spec-document scans use strict `specFolder` boundary filtering (no prefix bleed), and `document_type`/`spec_level` metadata is preserved on update/reinforce paths.

### Pipeline Flow

```
memory_index_scan({ includeReadmes: true })
│
├─ findMemoryFiles()          → specFiles[]
├─ findConstitutionalFiles()  → constitutionalFiles[]
├─ findSkillReadmes()         → skillReadmes[]        (if includeReadmes)
└─ findProjectReadmes()       → projectReadmes[]      (if includeReadmes)
    │
    ▼
  Merge all sources → Deduplicate → Index each file:
    1. Parse YAML frontmatter (title, triggers, tier)
    2. Extract ANCHOR tags for section-level retrieval
    3. Classify memory type via PATH_TYPE_PATTERNS
    4. Assign importance weight by source type
    5. Generate embedding → Store in SQLite
```

---

<!-- /ANCHOR:overview -->
<!-- ANCHOR:discovery-functions -->
## 2. DISCOVERY FUNCTIONS

### findSkillReadmes()

Scans `.opencode/skill/**/README.md` and `.opencode/skill/**/README.txt` for skill-level documentation.

| Property              | Value                          |
| --------------------- | ------------------------------ |
| **Scan root**         | `.opencode/skill/`             |
| **Pattern**           | `**/README.{md,txt}` (recursive) |
| **Spec folder ID**    | `skill:SKILL-NAME`             |
| **Memory type**       | `semantic`                     |
| **Importance weight** | `0.3`                          |

### findProjectReadmes()

Scans the project root for any `README.md` and `README.txt` files, excluding common non-project directories.

| Property              | Value                      |
| --------------------- | -------------------------- |
| **Scan root**         | Project root directory     |
| **Pattern**           | `**/README.{md,txt}` (recursive) |
| **Spec folder ID**    | `project-readmes`          |
| **Memory type**       | `semantic`                 |
| **Importance weight** | `0.4`                      |

### Exclude Patterns

Both discovery functions exclude the following directories:

| Pattern        | Reason                      |
| -------------- | --------------------------- |
| `node_modules` | Third-party dependencies    |
| `.git`         | Version control internals   |
| `dist`         | Build output                |
| `build`        | Build output                |
| `coverage`     | Test coverage reports       |
| `vendor`       | Vendored dependencies       |
| `__pycache__`  | Python bytecode cache       |
| `.next`        | Next.js build directory     |
| `.nuxt`        | Nuxt.js build directory     |
| `.output`      | Nitro/Nuxt output directory |

**Skill READMEs** additionally exclude files found inside `node_modules/` and hidden directories (`.`-prefixed).

---

<!-- /ANCHOR:discovery-functions -->
<!-- ANCHOR:importance-weights-and-scoring -->
## 3. IMPORTANCE WEIGHTS AND SCORING

### Tiered Importance System

README sources receive reduced importance weights relative to user work memories. This ensures documentation never outranks session-specific context (decisions, blockers, implementation notes) in search results.

| Source Type                   | `importance_weight` | Effective Multiplier | Rationale                                                        |
| ----------------------------- | ------------------: | -------------------: | ---------------------------------------------------------------- |
| **User work** (spec memories) |               `0.5` |               `1.0x` | Highest priority: decisions, context, blockers                   |
| **Spec documents**            |            Per-type |  Per-type multiplier | Document-type scoring: spec 1.4x, plan 1.3x, constitutional 2.0x |
| **Project READMEs**           |               `0.4` |               `0.9x` | Project-level docs, moderately relevant                          |
| **Skill READMEs**             |               `0.3` |               `0.8x` | Skill documentation, background reference                        |

### Scoring Formula

The importance weight modifies the base search score:

```
score *= (0.5 + importance_weight)
```

**Worked examples:**

| Source         | importance_weight | Multiplier `(0.5 + w)` | Base Score 0.80 | Final Score |
| -------------- | ----------------: | ---------------------: | --------------: | ----------: |
| User work      |               0.5 |                   1.00 |            0.80 |        0.80 |
| Project README |               0.4 |                   0.90 |            0.80 |        0.72 |
| Skill README   |               0.3 |                   0.80 |            0.80 |        0.64 |

This means at equal semantic relevance, user work memories always rank higher than README documentation.

---

<!-- /ANCHOR:importance-weights-and-scoring -->
<!-- ANCHOR:yaml-frontmatter -->
## 4. YAML FRONTMATTER

README files can include optional YAML frontmatter to improve indexing quality. When frontmatter is absent, the system falls back to filename-based metadata extraction.

### Supported Fields

```yaml
---
title: "Project Architecture Guide"
description: "Overview of the project's module structure and conventions"
trigger_phrases:
  - "project structure"
  - "architecture"
  - "module layout"
importance_tier: "normal"
---
```

| Field             | Type     | Required | Default          | Description                                                                |
| ----------------- | -------- | -------- | ---------------- | -------------------------------------------------------------------------- |
| `title`           | string   | No       | Filename-derived | Display title for the memory entry                                         |
| `description`     | string   | No       | First paragraph  | Brief description used in search results                                   |
| `trigger_phrases` | string[] | No       | `[]`             | Keywords for fast trigger matching via `memory_match_triggers()`           |
| `importance_tier` | string   | No       | `normal`         | One of: constitutional, critical, important, normal, temporary, deprecated |

### Frontmatter Best Practices

- **Add `trigger_phrases`** for README files that should surface on specific keywords
- **Keep `importance_tier` at `normal`** unless the README contains critical project rules
- **Use `description`** to provide a concise summary when the first paragraph is not descriptive
- Frontmatter is optional; the system indexes READMEs without it

---

<!-- /ANCHOR:yaml-frontmatter -->
<!-- ANCHOR:anchor-tags -->
## 5. ANCHOR TAGS

README files support `<!-- ANCHOR:name -->` tags for section-level retrieval, enabling token-efficient context loading.

### Valid Anchor Tags

| Anchor ID    | Content Type                 | Use Case                |
| ------------ | ---------------------------- | ----------------------- |
| `summary`    | High-level overview          | Quick context refresh   |
| `state`      | Current project state        | Resume work             |
| `decisions`  | Key decisions made           | Understanding rationale |
| `context`    | Project/domain context       | Understand scope        |
| `artifacts`  | Files, outputs, deliverables | Track what exists       |
| `next-steps` | Planned actions              | Continue work           |
| `blockers`   | Current blockers or issues   | Identify problems       |

### Anchor Format

```markdown
This project implements a memory indexing system that supports
five source types for comprehensive context retrieval.

- Chose SQLite + FTS5 for full-text search capability
- README importance weights set below user work to prevent outranking
```

### Token Savings with Anchors

| Retrieval Method                                  | Typical Tokens | Savings |
| ------------------------------------------------- | -------------: | ------: |
| Full file (`includeContent: true`)                |          ~2000 |       - |
| Single anchor (`anchors: ['summary']`)            |           ~150 |    ~93% |
| Two anchors (`anchors: ['summary', 'decisions']`) |           ~300 |    ~85% |

---

<!-- /ANCHOR:anchor-tags -->
<!-- ANCHOR:configuration -->
## 6. CONFIGURATION

### The `includeReadmes` Parameter

The `includeReadmes` parameter on `memory_index_scan()` controls whether README sources (both skill and project) are included in the indexing scan.

```javascript
// Include READMEs (default behavior)
memory_index_scan({ includeReadmes: true })

// Skip README indexing
memory_index_scan({ includeReadmes: false })

// Scan specific spec folder only (READMEs still included by default)
memory_index_scan({ specFolder: "007-auth", includeReadmes: true })
```

| Value            | Behavior                                                                             |
| ---------------- | ------------------------------------------------------------------------------------ |
| `true` (default) | Discovers and indexes both skill READMEs and project READMEs                         |
| `false`          | Skips README discovery entirely; only indexes spec memories and constitutional rules |

### When to Disable README Indexing

- **Large monorepos** with hundreds of README files (performance concern)
- **Focused debugging** where only spec memories are relevant
- **Testing** the memory system without README noise

---

<!-- /ANCHOR:configuration -->
<!-- ANCHOR:known-limitations -->
## 7. KNOWN LIMITATIONS

### Composite ID Matching Issue

Anchor retrieval for README-sourced memories has a known issue with composite ID matching. When a README is indexed under a composite spec folder identifier (e.g., `skill:system-spec-kit` or `project:docs/guides`), anchor-based retrieval may not correctly resolve the memory.

**Symptom:** `memory_search()` with `anchors` parameter returns empty content for README-sourced memories, even though the anchors exist in the file.

**Workaround:** Use `includeContent: true` instead of `anchors` for README-sourced memories to retrieve full content, then extract sections manually.

```javascript
// May fail for README-sourced memories
memory_search({
  query: "project structure",
  anchors: ['summary']  // Composite ID may not resolve
})

// Reliable workaround
memory_search({
  query: "project structure",
  includeContent: true  // Full content always works
})
```

**Status:** Discovered during testing; fix pending.

### Other Considerations

| Limitation                      | Description                                            | Impact                           |
| ------------------------------- | ------------------------------------------------------ | -------------------------------- |
| No real-time sync               | README changes require manual `memory_index_scan()`    | Must re-scan after README edits  |
| No partial update               | Changing one README re-indexes the entire file         | Minor performance overhead       |
| Exclude patterns are hardcoded  | Cannot add custom exclude directories                  | Fork or PR required to customize |
| Flat importance per source type | All skill READMEs get 0.3, all project READMEs get 0.4 | No per-file weight customization |

---

<!-- /ANCHOR:known-limitations -->
<!-- ANCHOR:related-resources -->
## 8. RELATED RESOURCES

### Reference Files
- [memory_system.md](./memory_system.md) - Full memory system reference (MCP tools, tiers, decay)
- [save_workflow.md](./save_workflow.md) - Memory save workflow and context preservation
- [embedding_resilience.md](./embedding_resilience.md) - Provider fallback and offline mode

### Scripts
- `scripts/memory/generate-context.ts` - Memory file generation
- `mcp_server/context-server.ts` - MCP server with indexing pipeline

### Related Skills
- `system-spec-kit` - Parent skill orchestrating spec folder workflow
<!-- /ANCHOR:related-resources -->
