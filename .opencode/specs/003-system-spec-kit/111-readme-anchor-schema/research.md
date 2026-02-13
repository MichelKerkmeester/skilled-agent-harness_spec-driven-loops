---
title: "README Anchor Schema & Memory Integration Research"
status: complete
created: 2026-02-12
researcher: "@research agent"
spec_folder: 003-memory-and-spec-kit/111-readme-anchor-schema
---

# README Anchor Schema & Memory Integration

> Research into how README files in `.opencode/skill/` should be anchored and indexed by the Spec Kit Memory system, given that READMEs are static documentation (not session artifacts like memory files).

---

## TABLE OF CONTENTS

- [1. Investigation Report](#1-investigation-report)
- [2. Executive Overview](#2-executive-overview)
- [3. Core Architecture](#3-core-architecture)
- [4. Technical Specifications](#4-technical-specifications)
- [5. Constraints & Limitations](#5-constraints--limitations)
- [6. Integration Patterns](#6-integration-patterns)
- [7. Implementation Guide](#7-implementation-guide)
- [8. Code Examples](#8-code-examples)
- [9. Testing & Debugging](#9-testing--debugging)
- [10. Performance](#10-performance)
- [11. Security](#11-security)
- [12. Maintenance](#12-maintenance)
- [13. API Reference](#13-api-reference)
- [14. Troubleshooting](#14-troubleshooting)
- [15. Acknowledgements](#15-acknowledgements)
- [16. Appendix & Changelog](#16-appendix--changelog)
- [17. Decision Matrix](#17-decision-matrix)

---

## 1. Investigation Report

### Research Question

How should README files in `.opencode/skill/` be anchored and indexed by the Spec Kit Memory system, given that READMEs are static documentation (not session artifacts like memory files)?

### Sub-Questions Investigated

| # | Question | Status | Confidence |
|---|----------|--------|------------|
| 1 | Anchor schema for READMEs | Answered | High |
| 2 | Anchor ID format & uniqueness | Answered | High |
| 3 | YAML frontmatter schema | Answered | High |
| 4 | Memory type classification | Answered | High |
| 5 | Importance tier assignment | Answered | High |
| 6 | Decay model for static docs | Answered | High |
| 7 | Discovery function design | Answered | High |
| 8 | Spec folder extraction for skill paths | Answered | High |
| 9 | Backward compatibility safeguards | Answered | High |
| 10 | Template updates needed | Answered | Medium |

### Key Findings

1. **Anchors should map 1:1 to the 9 README template sections** — simple names like `overview`, `quick-start`, etc. Uniqueness is scoped to the file, not global. [SOURCE: memory-parser.ts:493-515, extractAnchors() returns `Record<string, string>` keyed per-file]

2. **READMEs need a new `contentSource` field** (`'readme'`) to prevent pollution of session-focused memory searches. The existing system has no filtering mechanism for document type. [SOURCE: memory-parser.ts:36-52, ParsedMemory interface has no source-type field]

3. **`semantic` is the best memory type** for skill READMEs — 180-day half-life matches "core concepts, architecture, design principles" which is exactly what skill READMEs document. [SOURCE: memory-types.ts:77-83]

4. **A new `findSkillReadmes()` function is needed** — separate from `findConstitutionalFiles()`. Constitutional files are rules; READMEs are documentation. Different indexing characteristics. [SOURCE: memory-index.ts:102-132, findConstitutionalFiles() explicitly skips README.md at line 118]

5. **`extractSpecFolder()` needs a new skill-path pattern** — current regex only matches `specs/XXX/memory/` paths. Skill READMEs need `skill:system-spec-kit` style identifiers. [SOURCE: memory-parser.ts:198, regex: `/specs\/([^/]+(?:\/[^/]+)*?)\/memory\//`]

### Recommendations

| Option | Approach | Confidence |
|--------|----------|------------|
| **Recommended** | Section-mapped anchors + new `contentSource` field + `semantic` type + new discovery function | High |
| Alternative A | Semantic-purpose anchors (AI-optimized naming) + extend constitutional discovery | Medium |
| Alternative B | No anchors (full-document indexing only) + tag-based filtering | Low |

---

## 2. Executive Overview

### Summary

The Spec Kit Memory system currently indexes two categories of files: (1) session-based memory files in `specs/**/memory/` and (2) constitutional files in `.opencode/skill/*/constitutional/`. README files are explicitly excluded from both paths.

This research designs an integration approach that treats READMEs as a **third category** of indexable content — static reference documentation — with distinct anchor schemas, decay behavior, and discovery mechanisms. The key insight is that READMEs serve a fundamentally different purpose (human orientation + AI reference) than session memories (ephemeral context) or constitutional files (immutable rules).

### Architecture Diagram

```
Current Indexing Pipeline
=========================

memory_index_scan()
    |
    ├── findMemoryFiles()        → specs/**/memory/*.md
    │       └── isMemoryFile()   → validates path pattern
    │
    └── findConstitutionalFiles() → .opencode/skill/*/constitutional/*.md
            └── skips README.md   ← THIS IS THE GATE WE EXTEND
    
                    ↓
            
            parseMemoryFile()
                |
                ├── extractSpecFolder()     ← needs skill-path support
                ├── extractTitle()
                ├── extractTriggerPhrases() ← from frontmatter
                ├── extractContextType()
                ├── extractImportanceTier()
                ├── inferMemoryType()       ← needs README patterns
                ├── extractCausalLinks()
                └── computeContentHash()
                    
                    ↓
                    
            indexMemoryFile()  → SQLite + vector embedding


Proposed Extension
==================

memory_index_scan(args)
    |
    ├── findMemoryFiles()         → specs/**/memory/*.md
    ├── findConstitutionalFiles() → .opencode/skill/*/constitutional/*.md
    └── findSkillReadmes()     ──→ .opencode/skill/*/README.md        [NEW]
            |                       .opencode/skill/*/*/README.md     [NEW]
            └── isReadmeFile()  ──→ validates readme path pattern     [NEW]
            
                    ↓
            
            parseMemoryFile()      ← REUSED (no changes needed)
                |
                ├── extractSpecFolder() ← EXTENDED for skill: prefix
                └── inferMemoryType()   ← NEW path pattern for READMEs
                    
                    ↓
                    
            indexMemoryFile()
                └── contentSource: 'readme'  ← NEW field in DB schema
```

---

## 3. Core Architecture

### Current Indexing Pipeline (Evidence-Based)

The indexing pipeline has three critical gatekeepers:

#### 3.1 `isMemoryFile()` — Path Validator
[SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:435-453`]

```typescript
export function isMemoryFile(filePath: string): boolean {
  const normalizedPath = filePath.replace(/\\/g, '/');
  const isSpecsMemory = (
    normalizedPath.endsWith('.md') &&
    normalizedPath.includes('/memory/') &&
    normalizedPath.includes('/specs/')
  );
  const isConstitutional = (
    normalizedPath.endsWith('.md') &&
    normalizedPath.includes('/.opencode/skill/') &&
    normalizedPath.includes('/constitutional/') &&
    !normalizedPath.toLowerCase().endsWith('readme.md')  // ← EXPLICIT EXCLUSION
  );
  return isSpecsMemory || isConstitutional;
}
```

**Key observation**: README.md is explicitly excluded at line 450. This is intentional — the current system does not consider READMEs as memory files.

#### 3.2 `findConstitutionalFiles()` — Discovery
[SOURCE: `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:102-132`]

```typescript
function findConstitutionalFiles(workspacePath: string): string[] {
  // ...
  for (const file of files) {
    if (file.isFile() && file.name.endsWith('.md')) {
      if (file.name.toLowerCase() === 'readme.md') continue;  // ← SKIPS READMEs
      results.push(path.join(constitutionalDir, file.name));
    }
  }
}
```

**Key observation**: The README skip at line 118 is a deliberate filter. READMEs in constitutional folders are human documentation about constitutional rules, not constitutional rules themselves.

#### 3.3 `extractSpecFolder()` — Namespace Extraction
[SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:187-218`]

```typescript
export function extractSpecFolder(filePath: string): string {
  const match = normalizedPath.match(/specs\/([^/]+(?:\/[^/]+)*?)\/memory\//);
  // Only matches: specs/XXX-name/.../memory/ pattern
  // Falls back to parent directory name
}
```

**Key observation**: This function has NO support for `.opencode/skill/` paths. For a skill README, it would fall through to the "last resort" fallback, returning the parent directory name (e.g., `system-spec-kit`), which is ambiguous.

#### 3.4 Anchor Format
[SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:461-462`]

```
Opening pattern: /<!--\s*(?:ANCHOR|anchor):\s*([^>\s]+)\s*-->/gi
Valid anchor ID:  /^[a-zA-Z0-9][a-zA-Z0-9-/]*$/
```

**Key observation**: Anchor IDs support alphanumeric characters, hyphens, and forward slashes. This means both `overview` and `skill/system-spec-kit/overview` are valid anchor IDs. The choice is a design decision, not a technical constraint.

### Existing Skill READMEs (3 Found)

| README | Lines | Has Anchors | Has Frontmatter |
|--------|-------|-------------|-----------------|
| `.opencode/skill/system-spec-kit/README.md` | 725 | No | No |
| `.opencode/skill/mcp-figma/README.md` | exists | No | No |
| `.opencode/skill/mcp-code-mode/README.md` | exists | No | No |

[SOURCE: Glob search `.opencode/skill/*/README.md` returned 3 files]

**Key observation**: None of the existing READMEs have anchors or YAML frontmatter. This is a greenfield design — we're adding structure, not retrofitting.

### Constitutional File Pattern (Reference)
[SOURCE: `.opencode/skill/system-spec-kit/constitutional/gate-enforcement.md:1-70`]

Constitutional files use this frontmatter:
```yaml
---
title: "CRITICAL GATES & RULES - HARD BLOCK ENFORCEMENT"
importanceTier: constitutional
contextType: decision
triggerPhrases:
  - continue
  - fix
  - implement
  # ...
---
```

And anchor pairs like:
```html
<!-- ANCHOR:gate-hard-blocks -->
...content...
<!-- /ANCHOR:gate-hard-blocks -->
```

---

## 4. Technical Specifications

### 4.1 Anchor Schema Design

#### Research Question 1: What anchors should READMEs have?

**Recommendation: Option A — Map 1:1 to README 9-section template**

| Anchor ID | Maps To | Retrieval Use Case |
|-----------|---------|-------------------|
| `overview` | Section 1: Overview | "What is [skill]?", "What does [skill] do?" |
| `quick-start` | Section 2: Quick Start | "How to set up [skill]", "Getting started with [skill]" |
| `structure` | Section 3: Structure | "Where are files in [skill]?", "Directory layout" |
| `features` | Section 4: Features | "What can [skill] do?", "Capabilities of [skill]" |
| `configuration` | Section 5: Configuration | "How to configure [skill]", "Settings for [skill]" |
| `usage-examples` | Section 6: Usage Examples | "Show me examples of [skill]", "How to use [skill]" |
| `troubleshooting` | Section 7: Troubleshooting | "Fix [skill] issue", "Debug [skill] problem" |
| `faq` | Section 8: FAQ | "Common questions about [skill]" |
| `related-docs` | Section 9: Related Documents | "Documentation for [skill]", "More info about [skill]" |

**Evidence for this choice:**
- The README template already defines 9 well-scoped sections [SOURCE: readme_template.md:150-164]
- Each section answers a distinct type of question (evaluation, exploration, support phases) [SOURCE: readme_template.md:168-195]
- The `extractAnchors()` function returns `Record<string, string>` scoped per-file, so simple names work [SOURCE: memory-parser.ts:493-515]
- Constitutional files already use descriptive anchor names (`gate-hard-blocks`, `gate-behavioral`, etc.) [SOURCE: gate-enforcement.md:78-135]

**Alternative B: Semantic-purpose anchors (AI-optimized)**

| Anchor ID | Maps To | Rationale |
|-----------|---------|-----------|
| `purpose` | Overview | Better semantic match for "what is this?" queries |
| `setup` | Quick Start | Clearer than "quick-start" for AI search |
| `layout` | Structure | Disambiguates from code "structure" |
| `capabilities` | Features | More descriptive for capability queries |
| `config` | Configuration | Shorter, common abbreviation |
| `patterns` | Usage Examples | Better matches "show me patterns" queries |
| `diagnostics` | Troubleshooting | More precise than generic "troubleshooting" |
| `knowledge` | FAQ | Captures "things to know" better |
| `references` | Related Docs | Standard term for cross-references |

**Trade-off analysis:**

| Criterion | Option A (Section-mapped) | Option B (Semantic) |
|-----------|--------------------------|---------------------|
| Learnability | High (matches visible headings) | Medium (requires mapping) |
| Template alignment | Perfect 1:1 | Requires translation |
| Search relevance | Good | Slightly better |
| Consistency with existing | High (constitutional uses descriptive names) | Medium |
| Maintenance burden | Low (template-driven) | Medium (separate naming layer) |

**Verdict: Option A wins** on simplicity and maintainability. The marginal search improvement of Option B doesn't justify the added cognitive overhead.

---

### 4.2 Anchor ID Format & Uniqueness

#### Research Question 2: Should anchor IDs include path qualifiers?

**Recommendation: Simple names (no qualifiers)**

| Format | Example | Globally Unique? | Usability |
|--------|---------|-------------------|-----------|
| Simple | `overview` | No (per-file only) | Best |
| Qualified | `skill/system-spec-kit/overview` | Yes | Verbose |
| Prefixed | `readme-overview` | Partially | OK |

**Evidence:**
- Anchors are extracted per-file by `extractAnchors()` — uniqueness is at the file level, not global [SOURCE: memory-parser.ts:493-515]
- The `memory_search` `anchors` parameter filters content within each returned result — it asks "give me the `overview` anchor from each matching file" [SOURCE: formatters/search-results.ts:175]
- Constitutional files already use simple names: `gate-hard-blocks`, `gate-behavioral`, `gate-soft-advisory` [SOURCE: gate-enforcement.md]
- The valid anchor pattern `/^[a-zA-Z0-9][a-zA-Z0-9-/]*$/` supports both formats, but simpler is better

**Reasoning**: When you search `memory_search({ query: "how to configure spec kit", anchors: ["configuration"] })`, you WANT it to return the configuration section from ALL matching READMEs. Qualified names would require knowing the exact path upfront, defeating the purpose of semantic search.

---

### 4.3 YAML Frontmatter Schema

#### Research Question 3: What frontmatter should READMEs have for indexing?

**Recommended frontmatter schema for skill READMEs:**

```yaml
---
title: "Spec Kit Framework"
description: "Unified documentation and memory system for AI-assisted development"
importanceTier: important
contextType: general
memoryType: semantic
contentSource: readme
triggerPhrases:
  - "spec kit"
  - "spec folder"
  - "memory system"
  - "documentation framework"
keywords:
  - spec-kit
  - memory
  - documentation
  - templates
readmeType: skill
---
```

**Field-by-field justification:**

| Field | Value | Rationale | Evidence |
|-------|-------|-----------|----------|
| `title` | From `# heading` | Already extracted by `extractTitle()` | [SOURCE: memory-parser.ts:221-232] |
| `description` | Short summary | Human + AI readable context | Standard practice |
| `importanceTier` | `important` | 1.5x boost, no auto-expiry; READMEs are persistent | [SOURCE: memory-types.ts:41-96] |
| `contextType` | `general` | No exact match in CONTEXT_TYPE_MAP for "reference" | [SOURCE: memory-parser.ts:77-93] |
| `memoryType` | `semantic` | "Core concepts, architecture, design principles" = README content | [SOURCE: memory-types.ts:77-83] |
| `contentSource` | `readme` | **NEW FIELD** — enables filtering in search queries | [CITATION: NONE — new design] |
| `triggerPhrases` | Skill-specific | Already parsed by `extractTriggerPhrases()` | [SOURCE: memory-parser.ts:235-298] |
| `keywords` | Topic tags | Enhances BM25 keyword matching | Design decision |
| `readmeType` | `skill`/`component`/`project`/`feature` | Enables type-specific defaults | [SOURCE: readme_template.md:88-147] |

**Alternative: Minimal frontmatter (title + triggerPhrases only)**

```yaml
---
title: "Spec Kit Framework"
triggerPhrases:
  - "spec kit"
  - "memory system"
---
```

**Trade-off:**

| Criterion | Full Schema | Minimal Schema |
|-----------|-------------|----------------|
| Indexing quality | Best (all fields explicit) | Relies on inference |
| Maintenance burden | Higher (more fields to maintain) | Lower |
| Backward compatibility | Needs parser updates for new fields | Works with existing parser |
| Type inference confidence | 1.0 (explicit) | 0.5-0.8 (inferred) |

**Verdict: Full schema for skill READMEs** (they're maintained by the system), minimal for component/project READMEs (user-maintained).

---

### 4.4 Memory Type Classification

#### Research Question 4: What `memoryType` should READMEs be?

**Recommendation: `semantic` for skill READMEs, `procedural` for how-to READMEs**

Analysis of the 9 existing memory types against README content:

| Memory Type | Half-Life | Description | README Fit |
|-------------|-----------|-------------|------------|
| `working` | 1 day | Active session context | No — READMEs are permanent |
| `episodic` | 7 days | Event-based memories | No — READMEs aren't events |
| `prospective` | 14 days | Future intentions | No — READMEs aren't plans |
| `implicit` | 30 days | Learned patterns | Partial — some READMEs document patterns |
| `declarative` | 60 days | Facts and knowledge | Partial — READMEs contain facts |
| `procedural` | 90 days | How-to knowledge | Good — Quick Start, Usage Examples |
| **`semantic`** | **180 days** | **Core concepts, architecture, design** | **Best — READMEs document core concepts** |
| `autobiographical` | 365 days | Project history | No — READMEs aren't history |
| `meta-cognitive` | ∞ | Rules, standards | No — reserved for constitutional |

**Why `semantic` (not `declarative` or `procedural`):**
- READMEs document "what is this system" and "how it's designed" — that's `semantic` territory
- `declarative` (60-day half-life) decays too fast for persistent documentation
- `procedural` (90-day half-life) is close but focused on "how to do X" — only some README sections are procedural
- `semantic` (180 days) has the right decay profile for documentation that evolves slowly
- The `important` tier override (no auto-expiry) ensures skill READMEs never disappear

**Alternative: Introduce a new `reference` memory type**

```typescript
reference: {
  halfLifeDays: null,  // Never decays
  description: 'Static reference documentation: READMEs, guides, API docs',
  autoExpireDays: null,
  decayEnabled: false,
}
```

**Trade-off:**

| Criterion | Use `semantic` | New `reference` type |
|-----------|---------------|---------------------|
| Code changes | Zero (type already exists) | Modify memory-types.ts, tests, DB schema |
| Semantic accuracy | Good (READMEs ARE core concepts) | Perfect (purpose-built) |
| Risk | None | Medium (new type needs migration) |
| Decay behavior | 180-day half-life (offset by `important` tier) | No decay |

**Verdict: Use `semantic` for now.** Adding a new type is a larger change with migration implications. The `important` tier + `semantic` type combination gives effectively zero decay for skill READMEs. A `reference` type can be added later if the system indexes many non-skill READMEs.

---

### 4.5 Importance Tier Assignment

#### Research Question 5: What tier should READMEs default to?

**Recommendation: Tier varies by README type**

| README Type | Tier | Boost | Decay | Rationale |
|-------------|------|-------|-------|-----------|
| **Skill README** (`.opencode/skill/*/README.md`) | `important` | 1.5x | No auto-expiry | Core system documentation |
| **Component README** (`.opencode/skill/*/*/README.md`) | `normal` | 1.0x | 90-day | Sub-component documentation |
| **Project README** (root `README.md`) | `important` | 1.5x | No auto-expiry | Project entry point |
| **Feature README** (custom locations) | `normal` | 1.0x | 90-day | Feature-specific docs |

**Evidence:**
- `important` tier gives 1.5x search boost and no auto-expiry [SOURCE: memory-types.ts, inferred from README.md:259-266]
- `normal` tier gives 1.0x boost with 90-day decay — appropriate for less critical docs
- Constitutional tier (3.0x, never) is reserved for rules, not documentation
- The tier system is the primary mechanism for controlling memory longevity

---

### 4.6 Decay Model

#### Research Question 6: Should READMEs decay at all?

**Recommendation: Minimal decay via tier + type combination**

| Approach | Implementation | Effective Behavior |
|----------|---------------|-------------------|
| **Recommended** | `importanceTier: important` + `memoryType: semantic` | 1.5x boost, no auto-expiry, 180-day half-life (practically no decay for skill docs) |
| Alternative A | `memoryType: meta-cognitive` + `importanceTier: constitutional` | Never decays, always surfaces — too aggressive for READMEs |
| Alternative B | New field `decayEnabled: false` in frontmatter | Requires parser changes, explicit opt-out |

**Why minimal decay is better than zero decay:**
- READMEs that aren't accessed or updated for 6+ months SHOULD fade in relevance
- A README for a deprecated skill should naturally sink in search results
- The `important` tier prevents auto-deletion, but half-life scoring still works for ranking
- Constitutional tier is semantically wrong — READMEs are not rules

**Why not `meta-cognitive` type:**
- `meta-cognitive` has `decayEnabled: false` — never decays at all [SOURCE: memory-types.ts:90-95]
- This is reserved for AGENTS.md, constitutional rules, invariants
- READMEs are not rules; they're documentation that CAN become outdated

---

### 4.7 Discovery Function

#### Research Question 7: New function vs extend existing?

**Recommendation: New `findSkillReadmes()` function**

**Option A: New `findSkillReadmes()` function**

```typescript
function findSkillReadmes(workspacePath: string): string[] {
  const results: string[] = [];
  const skillDir = path.join(workspacePath, '.opencode', 'skill');
  
  if (!fs.existsSync(skillDir)) return results;
  
  const skillEntries = fs.readdirSync(skillDir, { withFileTypes: true });
  for (const entry of skillEntries) {
    if (!entry.isDirectory() || entry.name.startsWith('.')) continue;
    
    // Skill-root README
    const rootReadme = path.join(skillDir, entry.name, 'README.md');
    if (fs.existsSync(rootReadme)) {
      results.push(rootReadme);
    }
    
    // Sub-directory READMEs (e.g., mcp_server/README.md)
    const subDirs = fs.readdirSync(path.join(skillDir, entry.name), { withFileTypes: true });
    for (const sub of subDirs) {
      if (!sub.isDirectory() || sub.name.startsWith('.') || sub.name === 'node_modules') continue;
      const subReadme = path.join(skillDir, entry.name, sub.name, 'README.md');
      if (fs.existsSync(subReadme)) {
        results.push(subReadme);
      }
    }
  }
  
  return results;
}
```

**Option B: Extend `findConstitutionalFiles()`**

```typescript
// Add includeReadmes parameter
function findConstitutionalFiles(workspacePath: string, includeReadmes: boolean = false): string[] {
  // ... existing code ...
  if (includeReadmes) {
    // Also check for README.md in skill root and subdirs
  }
}
```

**Trade-off:**

| Criterion | Option A (New function) | Option B (Extend existing) |
|-----------|------------------------|---------------------------|
| Separation of concerns | Clean | Muddled (constitutional ≠ readme) |
| Independent toggling | Yes (`includeReadmes` param) | Requires parameter threading |
| Test surface | New tests only | Risk of regression in existing tests |
| Naming clarity | `findSkillReadmes` is self-documenting | `findConstitutionalFiles(includeReadmes=true)` is confusing |
| Code complexity | +1 function (~30 lines) | +15 lines in existing function |

**Verdict: Option A (new function)** — cleaner separation, easier to test, better naming.

---

### 4.8 Spec Folder Extraction for Skill Paths

#### Research Question 8: How should `extractSpecFolder()` handle README paths?

**Recommendation: Add skill-path pattern with `skill:` prefix**

**Current behavior** for `.opencode/skill/system-spec-kit/README.md`:
- Regex `/specs\/([^/]+(?:\/[^/]+)*?)\/memory\//` → no match
- Falls through to "last resort" → returns `system-spec-kit` (parent dir name)
- Problem: `system-spec-kit` could collide with spec folder names

**Proposed extension:**

```typescript
export function extractSpecFolder(filePath: string): string {
  let normalizedPath = filePath.replace(/\\/g, '/');
  
  // Pattern 1: specs/XXX-name/.../memory/ (existing)
  const specsMatch = normalizedPath.match(/specs\/([^/]+(?:\/[^/]+)*?)\/memory\//);
  if (specsMatch) return specsMatch[1];
  
  // Pattern 2: .opencode/skill/SKILL-NAME/... (NEW)
  const skillMatch = normalizedPath.match(/\.opencode\/skill\/([^/]+)/);
  if (skillMatch) {
    const skillName = skillMatch[1];
    // Check if it's a sub-directory README
    const subDirMatch = normalizedPath.match(/\.opencode\/skill\/[^/]+\/([^/]+)\/readme\.md$/i);
    if (subDirMatch) {
      return `skill:${skillName}/${subDirMatch[1]}`;
    }
    return `skill:${skillName}`;
  }
  
  // Existing fallback...
}
```

**Naming convention:**

| Path | Extracted specFolder |
|------|---------------------|
| `.opencode/skill/system-spec-kit/README.md` | `skill:system-spec-kit` |
| `.opencode/skill/system-spec-kit/mcp_server/README.md` | `skill:system-spec-kit/mcp_server` |
| `.opencode/skill/mcp-figma/README.md` | `skill:mcp-figma` |
| `specs/042-auth/memory/session.md` | `042-auth` (unchanged) |

**Why `skill:` prefix:**
- Namespaces skill paths separately from spec folder paths
- Prevents collision: `system-spec-kit` (skill) vs `system-spec-kit` (hypothetical spec)
- Makes it clear in search results where the content came from
- The colon is NOT in the valid anchor pattern but IS fine for specFolder (it's a DB field, not an anchor)

**Alternative: Use `/` delimiter only (e.g., `skill/system-spec-kit`)**

| Criterion | `skill:system-spec-kit` | `skill/system-spec-kit` |
|-----------|------------------------|------------------------|
| Collision risk | None (`:` is unique) | Low but possible |
| Visual distinction | Clear namespace | Could look like a path |
| DB query compatibility | Works (string field) | Works |
| Existing pattern consistency | Different from spec folders | Closer to spec folder format |

**Verdict: `skill:` prefix** for clarity and zero collision risk.

---

### 4.9 Backward Compatibility

#### Research Question 9: Will README indexing affect existing search results?

**Risk assessment:**

| Concern | Impact | Mitigation |
|---------|--------|------------|
| Search result dilution | Medium — READMEs could crowd out session memories | `contentSource` filter |
| Trigger phrase overlap | High — README triggers like "memory", "spec" overlap with session context | Scope triggers narrowly |
| Performance | Low — 68 READMEs is small vs typical memory count | Negligible |
| Database size | Low — ~50KB per README (68 files = ~3.4MB) | Acceptable |

**Recommended safeguards:**

1. **New `contentSource` field** in the indexed record:
   ```typescript
   interface IndexedMemory {
     // ... existing fields ...
     contentSource: 'memory' | 'constitutional' | 'readme';  // NEW
   }
   ```

2. **Default search behavior**: `memory_search` should include READMEs by default (they're useful reference context), but add `excludeReadmes: true` option for session-focused queries.

3. **`includeReadmes` parameter on `memory_index_scan`**:
   ```typescript
   interface ScanArgs {
     specFolder?: string | null;
     force?: boolean;
     includeConstitutional?: boolean;
     incremental?: boolean;
     includeReadmes?: boolean;  // NEW, default: true
   }
   ```

4. **Trigger phrase scoping**: README trigger phrases should be more specific (e.g., "spec kit readme", "spec kit documentation") rather than generic ("spec kit", "memory").

**Alternative: Tag-based filtering (no schema change)**

Instead of a new `contentSource` field, use metadata tags:
```yaml
tags:
  - readme
  - documentation
  - skill
```

**Trade-off:**

| Criterion | `contentSource` field | Tag-based |
|-----------|----------------------|-----------|
| Query performance | Fast (indexed column) | Slower (text search in tags) |
| Schema change | Yes (DB migration) | No |
| Filtering precision | Exact | Fuzzy |
| Extensibility | Limited (enum) | High (arbitrary tags) |

**Verdict: `contentSource` field** — the enum is well-defined (3 values), and column-based filtering is significantly faster for a frequently-used filter.

---

### 4.10 Template Updates

#### Research Question 10: What changes to readme_template.md are needed?

**Changes catalog:**

| Change | File | Type | Scope |
|--------|------|------|-------|
| Add YAML frontmatter section | `readme_template.md` | Addition | New section |
| Add anchor placement guide | `readme_template.md` | Addition | New sub-section |
| Add anchor examples in template | `readme_template.md` | Addition | Section 12 (Complete Template) |
| Update checklist | `readme_template.md` | Update | Section 8 |

**Frontmatter section to add (before Section 1):**

```markdown
## 0. YAML FRONTMATTER (for Memory Indexing)

When a README will be indexed by the Spec Kit Memory system, add this
frontmatter block before the first heading:

\```yaml
---
title: "[PROJECT_NAME]"
description: "[One-sentence description]"
importanceTier: important          # important (skill) or normal (component)
contextType: general
memoryType: semantic               # semantic (concepts) or procedural (how-to)
contentSource: readme
triggerPhrases:
  - "[skill-name]"
  - "[primary-function]"
  - "[key-topic]"
keywords:
  - [keyword-1]
  - [keyword-2]
readmeType: skill                  # skill | component | project | feature
---
\```

**Note**: Frontmatter is OPTIONAL. READMEs without frontmatter can still be
indexed — the system infers metadata from content. Adding frontmatter improves
indexing accuracy from ~0.5 (inferred) to 1.0 (explicit) confidence.
```

**Anchor placement guide to add:**

```markdown
## ANCHOR PLACEMENT

Wrap each major section in ANCHOR tags for section-level memory retrieval:

\```html
<!-- ANCHOR:overview -->
## 1. 📖 OVERVIEW
...section content...
<!-- /ANCHOR:overview -->
\```

Standard anchor IDs (map to 9 README sections):

| Anchor ID | Section |
|-----------|---------|
| `overview` | 1. Overview |
| `quick-start` | 2. Quick Start |
| `structure` | 3. Structure |
| `features` | 4. Features |
| `configuration` | 5. Configuration |
| `usage-examples` | 6. Usage Examples |
| `troubleshooting` | 7. Troubleshooting |
| `faq` | 8. FAQ |
| `related-docs` | 9. Related Documents |
```

---

## 5. Constraints & Limitations

### Technical Constraints

| Constraint | Impact | Source |
|------------|--------|--------|
| Anchor ID must match `/^[a-zA-Z0-9][a-zA-Z0-9-/]*$/` | No special characters in IDs | [SOURCE: memory-parser.ts:462] |
| `isMemoryFile()` explicitly excludes README.md | Must extend or bypass this gatekeeper | [SOURCE: memory-parser.ts:450] |
| `extractSpecFolder()` only matches `specs/.../memory/` | Must add skill-path pattern | [SOURCE: memory-parser.ts:198] |
| SQLite schema may need `contentSource` column | DB migration required | [CITATION: NONE — design] |
| 9 memory types are hardcoded | Adding `reference` type needs migration | [SOURCE: memory-types.ts:16-25] |
| Content max 100KB | Large READMEs (>100KB) will fail validation | [SOURCE: memory-parser.ts:531] |

### Design Constraints

| Constraint | Impact |
|------------|--------|
| READMEs are human-first, machine-second | Anchors must not degrade readability |
| Existing READMEs have no frontmatter | Migration needed for existing files |
| Constitutional tier is semantically reserved | READMEs should NOT be constitutional |
| Session deduplication assumes ephemeral content | READMEs are permanent — dedup irrelevant |

### Compatibility Constraints

| Constraint | Impact |
|------------|--------|
| Existing `memory_search` queries | Must not return README noise for session queries |
| Existing `memory_index_scan` | Must be opt-in for READMEs initially |
| `parseMemoryFile()` interface | Adding `contentSource` to `ParsedMemory` is backward-compatible |
| Test suite (3,872 tests) | New tests needed; existing tests must not break |

---

## 6. Integration Patterns

### How README Indexing Fits the Existing System

```
User Query: "How do I configure the memory system?"
    |
    ├── memory_match_triggers()  → May match README trigger phrases
    │                               e.g., "memory system" → Spec Kit README
    │
    ├── memory_search()          → Vector similarity finds README sections
    │   |                          + session memories about memory config
    │   |
    │   └── extractAnchors()     → Returns `configuration` anchor content
    │                               from matching README
    │
    └── memory_context()         → Unified entry surfaces both:
                                   1. Constitutional rules (always first)
                                   2. README reference docs (if relevant)
                                   3. Session memories (if available)
```

### Interaction with Constitutional Memories

Constitutional memories always surface first (3.0x boost). READMEs with `important` tier (1.5x boost) will appear below constitutional but above `normal` session memories. This is the desired behavior — rules first, then reference docs, then session context.

### Interaction with Session Deduplication

Session deduplication tracks `sentMemories` per session. Since README content is static, it will be sent once per session and then deduplicated. This is correct behavior — you don't need the same README overview sent twice.

---

## 7. Implementation Guide

### Phase 1: Core Infrastructure (Minimum Viable)

| Step | File | Change | LOC Estimate |
|------|------|--------|-------------|
| 1 | `memory-parser.ts` | Extend `isMemoryFile()` to accept README paths | ~10 |
| 2 | `memory-parser.ts` | Extend `extractSpecFolder()` with skill-path pattern | ~15 |
| 3 | `memory-parser.ts` | Add `contentSource` to `ParsedMemory` interface | ~3 |
| 4 | `memory-index.ts` | Add `findSkillReadmes()` function | ~30 |
| 5 | `memory-index.ts` | Wire `findSkillReadmes()` into `handleMemoryIndexScan()` | ~15 |
| 6 | `memory-types.ts` | Add README path pattern to `PATH_TYPE_PATTERNS` | ~3 |
| 7 | DB schema | Add `content_source` column (nullable, default 'memory') | ~5 |

**Phase 1 total: ~81 LOC**

### Phase 2: README Enhancement

| Step | File | Change | LOC Estimate |
|------|------|--------|-------------|
| 8 | `readme_template.md` | Add frontmatter schema section | ~40 |
| 9 | `readme_template.md` | Add anchor placement guide | ~30 |
| 10 | Existing READMEs (3) | Add frontmatter + anchors | ~30 each (~90 total) |

**Phase 2 total: ~160 LOC**

### Phase 3: Search Filtering

| Step | File | Change | LOC Estimate |
|------|------|--------|-------------|
| 11 | Search handlers | Add `contentSource` filter to queries | ~20 |
| 12 | `memory_search` handler | Add `includeReadmes` parameter | ~15 |
| 13 | `memory_index_scan` handler | Add `includeReadmes` parameter | ~10 |

**Phase 3 total: ~45 LOC**

### Phase 4: Testing

| Step | File | Change | LOC Estimate |
|------|------|--------|-------------|
| 14 | New test file | `findSkillReadmes()` tests | ~50 |
| 15 | Existing test files | `isMemoryFile()` and `extractSpecFolder()` updates | ~30 |
| 16 | Integration test | End-to-end README indexing | ~40 |

**Phase 4 total: ~120 LOC**

**Grand total: ~406 LOC across 4 phases**

---

## 8. Code Examples

### Example 1: Anchored Skill README (After Template Update)

```markdown
---
title: "Spec Kit Framework"
description: "Unified documentation and memory system for AI-assisted development"
importanceTier: important
contextType: general
memoryType: semantic
contentSource: readme
triggerPhrases:
  - "spec kit readme"
  - "spec folder documentation"
  - "memory system overview"
  - "documentation framework"
keywords:
  - spec-kit
  - memory
  - documentation
readmeType: skill
---

# Spec Kit Framework

> Your AI assistant forgets everything between sessions. Not anymore.

<!-- ANCHOR:overview -->

## 1. 📖 OVERVIEW

### The Problem Nobody Talks About
AI coding assistants are powerful but stateless...

### The Solution
Spec Kit adds the missing layers...

<!-- /ANCHOR:overview -->

<!-- ANCHOR:quick-start -->

## 2. 🚀 QUICK START

### 30-Second Setup
...

<!-- /ANCHOR:quick-start -->

<!-- ANCHOR:structure -->

## 3. 📊 DOCUMENTATION LEVELS
...

<!-- /ANCHOR:structure -->

<!-- ...remaining sections with anchors... -->
```

### Example 2: `isMemoryFile()` Extension

```typescript
export function isMemoryFile(filePath: string): boolean {
  const normalizedPath = filePath.replace(/\\/g, '/');

  // Standard memory files in specs
  const isSpecsMemory = (
    normalizedPath.endsWith('.md') &&
    normalizedPath.includes('/memory/') &&
    normalizedPath.includes('/specs/')
  );

  // Constitutional memories in skill folder
  const isConstitutional = (
    normalizedPath.endsWith('.md') &&
    normalizedPath.includes('/.opencode/skill/') &&
    normalizedPath.includes('/constitutional/') &&
    !normalizedPath.toLowerCase().endsWith('readme.md')
  );

  // NEW: README files in skill folder
  const isSkillReadme = (
    normalizedPath.toLowerCase().endsWith('readme.md') &&
    normalizedPath.includes('/.opencode/skill/')
  );

  return isSpecsMemory || isConstitutional || isSkillReadme;
}
```

### Example 3: `extractSpecFolder()` Extension

```typescript
export function extractSpecFolder(filePath: string): string {
  let normalizedPath = filePath.replace(/\\/g, '/');

  // Pattern 1: specs/XXX-name/.../memory/ (existing)
  const specsMatch = normalizedPath.match(/specs\/([^/]+(?:\/[^/]+)*?)\/memory\//);
  if (specsMatch) return specsMatch[1];

  // Pattern 2: .opencode/skill/SKILL-NAME/... (NEW)
  const skillMatch = normalizedPath.match(/\.opencode\/skill\/([^/]+)/);
  if (skillMatch) {
    const skillName = skillMatch[1];
    const subDirMatch = normalizedPath.match(
      /\.opencode\/skill\/[^/]+\/([^/]+)\/readme\.md$/i
    );
    if (subDirMatch) {
      return `skill:${skillName}/${subDirMatch[1]}`;
    }
    return `skill:${skillName}`;
  }

  // Existing fallback...
  const segments = normalizedPath.split('/');
  const specsIndex = segments.findIndex(s => s === 'specs');
  // ...
}
```

### Example 4: Search with README Filtering

```typescript
// Include READMEs (default behavior — useful for reference queries)
memory_search({
  query: "how to configure spec kit",
  includeContent: true,
  anchors: ["configuration"]
})
// Returns: README configuration anchor + any session memories about config

// Exclude READMEs (for session-focused queries)
memory_search({
  query: "what did I change in the last session",
  excludeReadmes: true
})
// Returns: Only session memories, no README content
```

---

## 9. Testing & Debugging

### Test Plan

| Test Category | Test Cases | Priority |
|---------------|-----------|----------|
| `isMemoryFile()` accepts README paths | 4 cases (skill root, subdir, non-skill, edge) | P0 |
| `findSkillReadmes()` discovers files | 5 cases (empty, single, nested, hidden dirs, symlinks) | P0 |
| `extractSpecFolder()` handles skill paths | 6 cases (root, subdir, Windows paths, UNC) | P0 |
| Anchor extraction from READMEs | 3 cases (all 9, partial, malformed) | P1 |
| Frontmatter parsing for READMEs | 4 cases (full, minimal, missing, invalid) | P1 |
| Search filtering by contentSource | 3 cases (include, exclude, mixed) | P1 |
| Integration: index + search | 2 cases (single README, bulk scan) | P2 |
| Backward compatibility | 3 cases (existing searches unchanged) | P0 |

### Validation Checklist

```
□ Existing tests pass (zero regression)
□ isMemoryFile() returns true for .opencode/skill/*/README.md
□ isMemoryFile() still returns false for constitutional/README.md
□ extractSpecFolder() returns skill:SKILL-NAME for skill READMEs
□ findSkillReadmes() finds all 3 existing READMEs
□ parseMemoryFile() successfully parses README with frontmatter
□ Anchors extracted from README content
□ memory_index_scan includes READMEs when includeReadmes=true
□ memory_search returns README results by default
□ memory_search excludes READMEs with excludeReadmes=true
```

---

## 10. Performance

### Impact Assessment

| Metric | Current | After README Indexing | Impact |
|--------|---------|----------------------|--------|
| Index scan files | ~50-100 memory files + ~3 constitutional | +68 READMEs | +68 files |
| Database size | ~2-5MB | +~3.4MB (68 × ~50KB) | +70% storage |
| Scan time | ~2-5 seconds | +~3-5 seconds (embedding generation) | +~100% first scan |
| Search latency | ~50-200ms | +~10ms (broader result set) | Negligible |
| Embedding cost | Per memory file | +68 embeddings (one-time) | One-time cost |

### Optimization Strategies

1. **Incremental indexing**: Only re-index READMEs when content hash changes (existing mechanism works)
2. **Lazy embedding**: Generate embeddings for READMEs on first search, not on startup
3. **Anchor-level indexing**: In future, index individual anchors as separate records for finer-grained search (not recommended for v1)

---

## 11. Security

### Content Exposure Risk

| Risk | Severity | Mitigation |
|------|----------|------------|
| README content in search results | Low | READMEs are already public documentation |
| Trigger phrase injection | Low | Frontmatter is author-controlled |
| Path traversal in skill discovery | Medium | Validate paths stay within `.opencode/skill/` |

### Path Validation

The `findSkillReadmes()` function must validate:
- Path is within `.opencode/skill/` directory
- No symlink following outside workspace
- No `..` path components

---

## 12. Maintenance

### Migration Path for Existing READMEs

| Phase | Action | Files Affected |
|-------|--------|---------------|
| 1 | Add frontmatter to 3 existing skill READMEs | 3 |
| 2 | Add anchors to 3 existing skill READMEs | 3 |
| 3 | Run `memory_index_scan` to index | 0 (automated) |
| 4 | Verify search results include READMEs | 0 (testing) |

### Ongoing Maintenance

- When new skills are created, their READMEs should include frontmatter + anchors
- The `readme_template.md` update ensures new READMEs follow the schema
- `memory_index_scan` automatically discovers new READMEs on each run

---

## 13. API Reference

### New Parameters

| Tool | Parameter | Type | Default | Description |
|------|-----------|------|---------|-------------|
| `memory_index_scan` | `includeReadmes` | boolean | `true` | Include skill READMEs in scan |
| `memory_search` | `excludeReadmes` | boolean | `false` | Exclude README content from results |

### New Functions

| Function | Signature | Returns |
|----------|-----------|---------|
| `findSkillReadmes` | `(workspacePath: string) => string[]` | Array of README file paths |
| `isReadmeFile` | `(filePath: string) => boolean` | Whether path is an indexable README |

### Modified Functions

| Function | Change | Backward Compatible |
|----------|--------|-------------------|
| `isMemoryFile()` | Add skill README path check | Yes (additive) |
| `extractSpecFolder()` | Add `skill:` prefix pattern | Yes (new pattern, existing unchanged) |
| `handleMemoryIndexScan()` | Wire in `findSkillReadmes()` | Yes (new parameter, default true) |

### New DB Column

| Column | Type | Default | Nullable |
|--------|------|---------|----------|
| `content_source` | TEXT | `'memory'` | Yes |

---

## 14. Troubleshooting

### Common Issues (Anticipated)

#### README Not Appearing in Search

**Symptom**: README was indexed but doesn't appear in `memory_search` results

**Likely Causes**:
1. Frontmatter missing `triggerPhrases` — add relevant trigger phrases
2. `excludeReadmes: true` is set — check search parameters
3. Low semantic similarity — verify query matches README content
4. README content too short (<5 chars after parsing) — check content length

**Diagnostic**:
```
memory_list({ specFolder: "skill:system-spec-kit" })
```

#### Anchor Extraction Returns Empty

**Symptom**: `anchors: ["overview"]` returns no content

**Likely Causes**:
1. Missing closing anchor tag — check `<!-- /ANCHOR:overview -->` exists
2. Anchor ID mismatch — IDs are case-sensitive
3. Content between anchors is empty

**Diagnostic**:
```
memory_save({ filePath: "...", dryRun: true })
// Check anchor validation results
```

---

## 15. Acknowledgements

### Sources Referenced

| Source | Type | Use |
|--------|------|-----|
| `memory-parser.ts` (671 lines) | Grade A — Primary source code | Core parsing architecture |
| `memory-index.ts` (377 lines) | Grade A — Primary source code | Discovery and indexing pipeline |
| `memory-types.ts` (313 lines) | Grade A — Primary source code | Type system and decay model |
| `type-inference.ts` (325 lines) | Grade A — Primary source code | Type inference cascade |
| `gate-enforcement.md` (302 lines) | Grade A — Constitutional file | Anchor format reference |
| `readme_template.md` (1217 lines) | Grade A — Template asset | README section structure |
| `system-spec-kit/README.md` (725 lines) | Grade A — Existing README | Current state reference |

---

## 16. Appendix & Changelog

### Glossary

| Term | Definition |
|------|-----------|
| **Anchor** | HTML comment pair `<!-- ANCHOR:id -->` / `<!-- /ANCHOR:id -->` wrapping a content section |
| **Constitutional** | Highest importance tier; never decays; always surfaces in search |
| **Content source** | Classification of indexed content: `memory`, `constitutional`, or `readme` |
| **Spec folder** | Directory containing documentation for a feature/task |
| **Trigger phrase** | Keywords that cause a memory to surface in `memory_match_triggers()` |

### Related Research

- Wave 1 exploration provided the initial context about current indexing pipeline
- This research builds on Wave 1 by designing the specific anchor schema and integration approach

### Change Log

| Date | Change | Author |
|------|--------|--------|
| 2026-02-12 | Initial research complete | @research agent |

---

## 17. Decision Matrix

### Summary of All Decisions

| # | Decision | Recommendation | Alternative | Confidence |
|---|----------|---------------|-------------|------------|
| 1 | Anchor schema | Map 1:1 to 9 README sections | Semantic-purpose names | High |
| 2 | Anchor ID format | Simple names (`overview`) | Qualified (`skill/name/overview`) | High |
| 3 | Frontmatter schema | Full schema (8 fields) for skill READMEs | Minimal (title + triggers only) | High |
| 4 | Memory type | `semantic` (180-day half-life) | New `reference` type | High |
| 5 | Importance tier | `important` for skill READMEs, `normal` for others | Single tier for all | High |
| 6 | Decay model | Minimal decay (important tier + semantic type) | Zero decay (meta-cognitive) | High |
| 7 | Discovery function | New `findSkillReadmes()` | Extend `findConstitutionalFiles()` | High |
| 8 | Spec folder extraction | `skill:SKILL-NAME` prefix | No prefix (bare name) | High |
| 9 | Backward compatibility | New `contentSource` field + filter params | Tag-based filtering | High |
| 10 | Template updates | Add frontmatter section + anchor guide | No template changes | Medium |

### Implementation Priority

| Priority | Change | Rationale |
|----------|--------|-----------|
| **P0** | `findSkillReadmes()` + `isMemoryFile()` extension | Core discovery mechanism |
| **P0** | `extractSpecFolder()` skill-path pattern | Required for correct indexing |
| **P0** | `content_source` DB column | Required for backward compatibility |
| **P1** | `handleMemoryIndexScan()` wiring + `includeReadmes` param | Enables the feature |
| **P1** | Search filtering (`excludeReadmes`) | Prevents search pollution |
| **P1** | `PATH_TYPE_PATTERNS` for READMEs | Correct type inference |
| **P2** | `readme_template.md` updates | Documentation for future READMEs |
| **P2** | Existing README migration (add frontmatter + anchors) | Enables indexing of current files |
| **P2** | Integration tests | Verification |

### Code Change Catalog

| File | Function/Area | Change Type | LOC | Priority |
|------|--------------|-------------|-----|----------|
| `memory-parser.ts` | `isMemoryFile()` | Extend | ~10 | P0 |
| `memory-parser.ts` | `extractSpecFolder()` | Extend | ~15 | P0 |
| `memory-parser.ts` | `ParsedMemory` interface | Add field | ~3 | P0 |
| `memory-index.ts` | `findSkillReadmes()` | New function | ~30 | P0 |
| `memory-index.ts` | `handleMemoryIndexScan()` | Wire new function | ~15 | P1 |
| `memory-types.ts` | `PATH_TYPE_PATTERNS` | Add pattern | ~3 | P1 |
| DB schema | `memories` table | Add column | ~5 | P0 |
| Search handlers | Query filters | Add parameter | ~35 | P1 |
| `readme_template.md` | New sections | Addition | ~70 | P2 |
| Existing READMEs (3) | Frontmatter + anchors | Migration | ~90 | P2 |
| Test files | New + updated tests | Testing | ~120 | P1/P2 |

**Total estimated LOC: ~406**
