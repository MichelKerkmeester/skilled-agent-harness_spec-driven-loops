# Decision Record: README Anchor Schema & Memory System Integration

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

---

## ADR-001: README Anchor Schema — Simple vs Qualified IDs

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-02-12 |
| **Deciders** | @speckit, Memory System Team |

---

### Context

READMEs need anchor tags for memory indexing to enable section-based retrieval. Memory files currently use qualified anchor IDs with session context: `<!-- ANCHOR:name-SESSION_ID-SPEC_FOLDER -->`. READMEs are static documentation without session context, requiring a different anchor format.

### Constraints
- READMEs are persistent (no session lifecycle)
- Anchor extraction returns anchors keyed per-file (uniqueness handled by file path)
- Must be human-writable and memorable
- Must pass existing anchor validation scripts

---

### Decision

**Summary**: Use simple anchor IDs without session or spec folder qualifiers

**Details**: README anchors will use the format `<!-- ANCHOR:name -->` / `<!-- /ANCHOR:name -->` where `name` is a simple identifier like `overview`, `troubleshooting`, `examples`. Standard names map to common README sections: overview, quick-start, structure, features, configuration, examples, troubleshooting, faq, related.

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Simple IDs** | Easy to write/remember, clean syntax, matches section names | No built-in uniqueness guarantee | 9/10 |
| Qualified IDs (`skill/system-spec-kit/mcp-server/overview`) | Globally unique, explicit source | Verbose, error-prone, harder to maintain | 4/10 |
| Hybrid (`skill:overview`) | Balance of clarity and uniqueness | Still more complex than needed | 6/10 |

**Why Chosen**: The `extractAnchors()` function already keys anchors by file path, so uniqueness is handled at the file level. Simple IDs are easier to write, validate, and remember. Since each README is indexed as a separate document with a unique file path, anchor name collisions between different READMEs are not a concern.

---

### Consequences

**Positive**:
- Lower barrier to adding anchors to existing READMEs
- Cleaner, more readable anchor tags
- Matches conventional section heading names
- Easier to validate with regex patterns

**Negative**:
- Anchor names alone don't identify source (must inspect file path)
- Potential for inconsistent naming across READMEs - Mitigation: Standard anchor name list in template

**Risks**:
| Risk | Impact | Mitigation |
|------|--------|------------|
| Inconsistent anchor names across files | M | Provide standard anchor name list in template, validation script checks |
| Duplicate anchors within one README | L | Validation script detects, first occurrence used |

---

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | READMEs need searchable sections; anchors enable retrieval |
| 2 | **Beyond Local Maxima?** | PASS | Evaluated qualified IDs and hybrid approaches |
| 3 | **Sufficient?** | PASS | Simple format meets all requirements without added complexity |
| 4 | **Fits Goal?** | PASS | Directly enables section-based README search |
| 5 | **Open Horizons?** | PASS | Extensible to other static docs; no lock-in |

**Checks Summary**: 5/5 PASS

---

### Implementation

**Affected Systems**:
- memory-parser.ts: `extractAnchors()` function (already handles simple IDs)
- check-anchors.sh: Validation regex (may need README-specific pattern)
- readme_template.md: Anchor syntax guide and standard names

**Rollback**: Change anchor format in template, revalidate existing READMEs, re-index

---

## ADR-002: Memory Type for READMEs — `semantic` vs `reference` Type

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-02-12 |
| **Deciders** | @speckit, Memory System Team |

---

### Context

Each indexed file receives a `memoryType` classification (`semantic`, `episodic`, `declarative`, `procedural`) affecting temporal decay and retrieval scoring. READMEs document architecture, APIs, and troubleshooting — knowledge that should persist indefinitely without decay.

### Constraints
- Existing memory types have defined decay half-lives
- `semantic` = 180 days, `declarative` = 90 days, `episodic` = 30 days
- Constitutional tier (1.8x boost) + zero decay reserved for critical system knowledge
- Must balance discoverability without polluting session searches

---

### Decision

**Summary**: Index READMEs as `semantic` memory type with `important` importance tier

**Details**: READMEs will use `memoryType='semantic'` (180-day half-life) and `importanceTier='important'` (1.5x boost). Combined, this provides effectively zero decay for persistent documentation while maintaining separation from `constitutional` tier (1.8x boost, reserved for core system prompts).

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **semantic + important** | 180-day half-life + 1.5x boost = ~zero decay, preserves constitutional distinction | Reuses existing types | 9/10 |
| declarative + important | 90-day half-life, simpler classification | READMEs are conceptual (semantic), not factual (declarative) | 5/10 |
| New `reference` type | Explicit classification, custom decay | Requires schema change, new tier logic, over-engineering | 4/10 |
| semantic + constitutional | Zero decay, maximum boost | Pollutes constitutional tier meant for system prompts | 2/10 |

**Why Chosen**: READMEs document architecture, design principles, and conceptual models (semantic knowledge). The `important` tier provides sufficient boost for persistent visibility without conflating READMEs with system-critical constitutional memories. Reusing existing types avoids schema changes and new decay logic.

---

### Consequences

**Positive**:
- No schema changes required
- Clear semantic fit (concepts, not facts)
- Effectively zero decay with 180-day half-life + 1.5x boost
- Constitutional tier preserved for system prompts

**Negative**:
- Not immediately obvious from type name that READMEs are indexed - Mitigation: `contentSource='readme'` field makes source explicit

**Risks**:
| Risk | Impact | Mitigation |
|------|--------|------------|
| READMEs ranked too high in results | M | `contentSource` filter allows excluding READMEs from session searches |
| Semantic type overloaded with mixed content | L | Acceptable — semantic is broad by design (concepts, principles) |

---

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | READMEs must be discoverable long-term; decay would hide them |
| 2 | **Beyond Local Maxima?** | PASS | Considered new type, constitutional tier, declarative type |
| 3 | **Sufficient?** | PASS | Achieves zero decay without schema changes |
| 4 | **Fits Goal?** | PASS | Enables persistent README retrieval |
| 5 | **Open Horizons?** | PASS | Reuses existing infrastructure; extensible to other docs |

**Checks Summary**: 5/5 PASS

---

### Implementation

**Affected Systems**:
- memory-index.ts: Set `memoryType='semantic'`, `importanceTier='important'` for READMEs
- memory-types.ts: Document README classification in type definitions

**Rollback**: Change memoryType/tier assignment, re-index READMEs

---

## ADR-003: Discovery Function — New `findSkillReadmes()` vs Extend `findConstitutionalFiles()`

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-02-12 |
| **Deciders** | @speckit, Memory System Team |

---

### Context

The memory indexer needs to discover README files during scans. Currently, `findConstitutionalFiles()` discovers files in `.opencode/skill/*/constitutional/`. READMEs are in `.opencode/skill/*/README.md` (different location, different characteristics).

### Constraints
- Must support toggling README indexing independently
- Must avoid breaking existing constitutional file discovery
- Must handle skill subdirectories (e.g., `mcp_server/lib/search/README.md`)
- Must integrate cleanly with existing scan workflow

---

### Decision

**Summary**: Create new standalone `findSkillReadmes()` function

**Details**: Implement a new function that discovers all `README.md` files within `.opencode/skill/` directories, callable via `includeReadmes` flag in `memory_index_scan()`. This function will recursively find READMEs in skill subdirectories and return standardized file metadata for indexing.

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **New `findSkillReadmes()`** | Clean separation, independent toggling, clear responsibility | One more function to maintain | 9/10 |
| Extend `findConstitutionalFiles()` | Reuse existing discovery logic | Conflates two different content types, harder to toggle independently | 4/10 |
| Generic `findFilesByPattern()` | Flexible, reusable | Over-engineering for current needs, unclear responsibility | 5/10 |

**Why Chosen**: READMEs and constitutional files have different indexing characteristics (memory type, importance tier, lifecycle). Separating discovery allows independent control via feature flags (`includeConstitutional`, `includeReadmes`) and clearer code organization. The additional function is low cost (simple file discovery) and high clarity.

---

### Consequences

**Positive**:
- Independent toggling of README indexing
- Clear separation of concerns
- Easy to disable if issues arise
- Supports future expansion (e.g., CHANGELOG indexing)

**Negative**:
- One more function to maintain - Mitigation: Function is simple (glob pattern + file validation)

**Risks**:
| Risk | Impact | Mitigation |
|------|--------|------------|
| Discovery logic duplication | L | Abstract common file validation if patterns emerge |
| Performance overhead from separate passes | L | Combined in single scan loop; minimal overhead |

---

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | READMEs need discovery; existing function conflates types |
| 2 | **Beyond Local Maxima?** | PASS | Considered extending existing function, generic pattern matcher |
| 3 | **Sufficient?** | PASS | Simple function meets all requirements |
| 4 | **Fits Goal?** | PASS | Enables README indexing with clean separation |
| 5 | **Open Horizons?** | PASS | Extensible to other doc types; no lock-in |

**Checks Summary**: 5/5 PASS

---

### Implementation

**Affected Systems**:
- memory-parser.ts: New `findSkillReadmes()` function
- memory-index.ts: Call `findSkillReadmes()` when `includeReadmes: true`
- memory-types.ts: Document `includeReadmes` flag in scan options

**Rollback**: Remove function, remove flag, READMEs no longer indexed

---

## ADR-004: Backward Compatibility — `contentSource` Field vs Tag-Based Filtering

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-02-12 |
| **Deciders** | @speckit, Memory System Team |

---

### Context

Adding READMEs to the memory index could pollute session-focused searches (e.g., "what did we decide last session?"). Users need a way to filter results by content origin: session memories vs constitutional files vs READMEs.

### Constraints
- Must not break existing `memory_search()` calls (backward compatibility)
- Must be performant (SQL-level filtering preferred over post-query filtering)
- Must be extensible to future content types (e.g., CHANGELOG, API docs)
- Must be clear and unambiguous (no tag parsing logic)

---

### Decision

**Summary**: Add new `contentSource` database column with filter parameter in `memory_search()`

**Details**: Extend the database schema with a `contentSource` column (enum: 'memory' | 'constitutional' | 'readme') and add an optional `contentSource` parameter to `memory_search()`. When provided, the search filters results at the SQL level. When omitted, all content types are included (backward compatible).

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **`contentSource` column** | SQL-level filtering (fast), clear semantics, extensible | Schema migration required | 9/10 |
| Tag-based filtering (`tags: ['readme']`) | Reuses existing tag system, no schema change | Slower (post-query filtering), tag namespace pollution | 5/10 |
| Separate search functions (`memory_search_readme()`) | No parameter overload | API proliferation, harder to combine sources | 3/10 |
| File path pattern matching | No schema change | Fragile (path changes break filtering), slow | 2/10 |

**Why Chosen**: Column-level filtering is faster (SQL WHERE clause), cleaner (no tag parsing), and more extensible (enum values are explicit and exhaustive). The three values ('memory', 'constitutional', 'readme') are mutually exclusive and cover all current content types. Schema migration is straightforward with a default value for existing records.

---

### Consequences

**Positive**:
- Fast SQL-level filtering
- Clear, type-safe enum values
- Backward compatible (default includes all types)
- Extensible to future content types

**Negative**:
- Schema migration required - Mitigation: Default value handles existing records transparently
- One more parameter in search API - Mitigation: Optional parameter, defaults to inclusive behavior

**Risks**:
| Risk | Impact | Mitigation |
|------|--------|------------|
| Migration breaks existing data | H | Thorough testing, default value, rollback plan |
| Filter parameter misuse | L | TypeScript types enforce valid values |

---

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Without filtering, READMEs pollute session searches |
| 2 | **Beyond Local Maxima?** | PASS | Evaluated tags, separate functions, path patterns |
| 3 | **Sufficient?** | PASS | Enum column solves filtering without over-engineering |
| 4 | **Fits Goal?** | PASS | Enables clean separation of content types |
| 5 | **Open Horizons?** | PASS | Extensible to CHANGELOG, API docs, etc. |

**Checks Summary**: 5/5 PASS

---

### Implementation

**Affected Systems**:
- memory-types.ts: Add `contentSource` field to schema, enum type definition
- memory-index.ts: Set `contentSource` during indexing based on file source
- memory-search.ts: Add `contentSource` filter parameter, SQL WHERE clause
- Database schema: Add `content_source` column with default 'memory'

**Rollback**: Drop column, remove parameter, existing searches work unfiltered

---

## ADR-005: Spec Folder Extraction — `skill:` Prefix vs Bare Name

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-02-12 |
| **Deciders** | @speckit, Memory System Team |

---

### Context

The `extractSpecFolder()` function derives a "spec folder" identifier from file paths for grouping and filtering memory results. It currently handles paths like `specs/003-memory/memory/session.md` → `003-memory`. README paths like `.opencode/skill/system-spec-kit/README.md` don't fit this pattern and need a consistent extraction rule.

### Constraints
- Must avoid name collisions (e.g., spec folder `system-spec-kit` vs skill `system-spec-kit`)
- Must be human-readable and filterable
- Must be derivable from file path alone
- Must support nested skill directories (e.g., `mcp_server/lib/search/README.md`)

---

### Decision

**Summary**: Use `skill:SKILL-NAME` prefix for README spec folder extraction

**Details**: `extractSpecFolder()` will return `skill:system-spec-kit` for paths like `.opencode/skill/system-spec-kit/README.md`. Nested READMEs (e.g., `mcp_server/lib/search/README.md`) will use the top-level skill name: `skill:system-spec-kit`. This provides clear namespacing and enables filtering by content origin.

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **`skill:` prefix** | Prevents collisions, clear origin, filterable | Slightly longer identifier | 9/10 |
| Bare skill name | Shorter, simpler | Collision risk with spec folder names | 4/10 |
| Full path (`skill/system-spec-kit/mcp_server`) | Globally unique, explicit | Very long, harder to filter/group | 5/10 |
| NULL/undefined for READMEs | Simple to implement | Loses grouping/filtering capability | 2/10 |

**Why Chosen**: The `skill:` prefix makes the source clear, prevents name collisions, and enables filtering with `specFolder: 'skill:system-spec-kit'`. It's concise enough for practical use while being explicit about content origin. Nested READMEs using the top-level skill name keeps identifiers manageable while preserving grouping.

---

### Consequences

**Positive**:
- Clear separation from spec folder names
- Filterable by skill origin
- Human-readable identifiers
- Supports nested README structures

**Negative**:
- Identifiers slightly longer than bare names - Mitigation: `skill:` prefix is only 6 characters, acceptable overhead

**Risks**:
| Risk | Impact | Mitigation |
|------|--------|------------|
| Nested README path ambiguity | L | Use top-level skill name consistently |
| Filter confusion (spec vs skill) | L | Prefix makes distinction obvious |

---

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | READMEs need spec folder identifiers for filtering/grouping |
| 2 | **Beyond Local Maxima?** | PASS | Considered bare names, full paths, null values |
| 3 | **Sufficient?** | PASS | Prefix solves collision/filtering without complexity |
| 4 | **Fits Goal?** | PASS | Enables README filtering by skill origin |
| 5 | **Open Horizons?** | PASS | Extensible to other namespaces (e.g., `agent:`, `cmd:`) |

**Checks Summary**: 5/5 PASS

---

### Implementation

**Affected Systems**:
- memory-parser.ts: Update `extractSpecFolder()` with README path handling
- memory-search.ts: Document `skill:` prefix in specFolder filter parameter

**Rollback**: Remove prefix logic, use bare skill names (collision risk)

---

## ADR-006: Tiered importance_weight for Project README Indexing

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-02-12 |
| **Deciders** | @speckit, Memory System Team |

---

### Context

The memory system indexes README files from `.opencode/skill/` with importance_weight 0.3 (ADR-002). The user requested that READMEs outside of skill folders (project root, infrastructure directories like `.opencode/install_guides/`, `.opencode/scripts/`) should also be indexed but with HIGHER priority than skill READMEs while NEVER outranking user work memories. Discovery found 4 such READMEs in the project.

### Constraints
- Must rank above skill READMEs (0.3 weight) but below user work memories (0.5 weight)
- Must auto-discover new READMEs without code changes
- Must avoid fragmenting namespace with per-path spec folders
- Must reuse existing flags where possible (YAGNI)

---

### Decision

**Summary**: Assign importance_weight 0.4 to project/code-folder READMEs with catch-all discovery

**Details**: Use catch-all discovery: any README.md NOT under `.opencode/skill/` and not in exclusion patterns (node_modules, .git, dist/, build/, .next/, coverage/, vendor/, __pycache__, .pytest_cache). Map all project READMEs to a single virtual spec folder: `project-readmes`. Reuse existing `includeReadmes` flag — no new flag. Symmetric 10% gaps: user work (1.0x) → project READMEs (0.9x) → skill READMEs (0.8x).

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Weight 0.4 (0.9x multiplier)** | Symmetric 10% gap both directions, survives similarity variance | Slightly arbitrary round number | 9/10 |
| Weight 0.35 (0.85x) | Closer to skill READMEs | 5% gap too small, within similarity noise range | 4/10 |
| Weight 0.45 (0.95x) | Higher visibility for project READMEs | 5% gap below user work too aggressive, README could outrank moderately relevant user decision | 5/10 |
| Explicit path allowlist | Precise control over which READMEs indexed | Brittle, requires code change for every new README | 3/10 |
| Per-path spec folder prefixes (`project:root`, `opencode:scripts`) | Fine-grained filtering | Fragmented namespace, nobody searches by file location | 4/10 |
| Separate `include_project_readmes` flag | Independent toggle | YAGNI, 2×2 state matrix confusing | 3/10 |

**Why Chosen**: 0.4 weight provides symmetric 10% gap both directions (above skill 0.3, below user 0.5). The 10% delta survives typical similarity score variance (±0.05). A project README must be ~11% more semantically relevant than a user work memory to outrank it — correct behavior for reference documentation. Catch-all discovery future-proofs for new READMEs without code changes. Single `project-readmes` bucket avoids fragmented namespace. No new flag avoids confusing 2×2 state matrix.

---

### Consequences

**Positive**:
- Clean 4-tier hierarchy: Constitutional → User work → Project READMEs → Skill READMEs
- New project READMEs auto-indexed without code changes
- ~40-50 lines of new code across 3 files; no schema changes

**Negative**:
- Exclusion list requires maintenance if new build tools create READMEs in unexpected directories - Mitigation: Exclusion patterns cover all common build tool outputs
- Very large READMEs (>2000 lines) may degrade embedding quality - Mitigation: Consider chunking in future iteration

**Risks**:
| Risk | Impact | Mitigation |
|------|--------|------------|
| Exclusion list misses new build tool directories | M | Review exclusion list when adding new build tools |
| Large READMEs degrade embedding quality | M | Monitor embedding scores; chunk if >2000 lines |
| Project READMEs outrank relevant user decisions | L | 10% gap verified against typical similarity variance |

---

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Project READMEs contain critical setup/architecture info not currently indexed |
| 2 | **Beyond Local Maxima?** | PASS | Evaluated 6 alternatives including different weights, path strategies, and flags |
| 3 | **Sufficient?** | PASS | Catch-all discovery + single weight solves requirements without over-engineering |
| 4 | **Fits Goal?** | PASS | Directly enables project README indexing with correct priority hierarchy |
| 5 | **Open Horizons?** | PASS | Catch-all discovery auto-includes future READMEs; exclusion list is extensible |

**Checks Summary**: 5/5 PASS

---

### Implementation

**Affected Systems**:
- memory-parser.ts: New `findProjectReadmes()` function with exclusion patterns
- memory-index.ts: Call `findProjectReadmes()` when `includeReadmes: true`, set importance_weight 0.4
- memory-types.ts: Document `project-readmes` virtual spec folder

**Rollback**: Remove `findProjectReadmes()` call, project READMEs no longer indexed

---

## ADR-007: Resume Detection Fix Approach

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-02-12 |
| **Deciders** | @speckit, Memory System Team |

---

### Context

`/spec_kit:resume` command failed to detect active sessions because (1) glob patterns referenced `specs/*/memory/*.md` instead of `.opencode/specs/**/memory/*.md`, (2) Tier 2 semantic search used wrong query concept ("active session" is temporal, not topical), (3) Tier 3 trigger matching used generic "resume" prompt. The spec folder structure evolved from `specs/` to `.opencode/specs/` with 2-level category nesting but resume commands were never updated.

### Constraints
- Must fix detection without architectural redesign
- Must handle current `.opencode/specs/` path with arbitrary nesting depth
- Must preserve existing 4-tier resume detection system

---

### Decision

**Summary**: Fix all 3 resume command files with corrected glob paths, replace Tier 2 query with `memory_list({ limit: 3, sortBy: 'updated_at' })` for recency-based detection, and make Tier 3 trigger query more specific. Fix in-place rather than architectural redesign.

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **In-place fix (3 files)** | Minimal scope, corrects root cause, preserves architecture | Paths still hardcoded | 9/10 |
| Architectural redesign | Single MCP-based approach, cleaner | Scope too large, current system works once paths correct | 4/10 |
| Path configuration variable | Single source of truth for spec base path | Good improvement but not blocking fix | 6/10 |
| Enforce tier progression | Make tiers mandatory instead of advisory | Behavioral fix requires agent prompt changes across multiple files | 3/10 |

**Why Chosen**: The root cause was incorrect paths and query strategies, not architectural flaws. Fixing the 3 files directly addresses all failure modes with minimal risk. The `**` glob wildcard handles arbitrary nesting depth, future-proofing against further path restructuring.

---

### Consequences

**Positive**:
- Resume detection works correctly for current `.opencode/specs/` structure
- `**` glob wildcard handles arbitrary nesting depth
- Tier 2 recency-based detection more reliable than semantic search for temporal queries
- Minimal change footprint (3 files)

**Negative**:
- Paths still hardcoded in resume command files - Mitigation: `**` wildcard absorbs most path structure changes
- If folder structure changes again, same paths need updating - Mitigation: limited to 3 known files

**Risks**:
| Risk | Impact | Mitigation |
|------|--------|------------|
| Folder structure changes again | M | `**` glob wildcard handles arbitrary nesting depth |
| Tier 2 `memory_list` returns stale results | L | `sortBy: 'updated_at'` ensures most recent memories surface |
| Other commands have same stale paths | M | Audit other spec_kit commands for hardcoded `specs/` paths |

---

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Resume command completely non-functional without fix |
| 2 | **Beyond Local Maxima?** | PASS | Evaluated redesign, config variable, tier enforcement |
| 3 | **Sufficient?** | PASS | Fixes all 3 root causes identified in diagnosis |
| 4 | **Fits Goal?** | PASS | Directly restores resume detection capability |
| 5 | **Open Horizons?** | PASS | `**` wildcard future-proofs paths; no architectural lock-in |

**Checks Summary**: 5/5 PASS

---

### Implementation

**Affected Systems**:
- `.opencode/command/spec_kit:resume.md`: Corrected glob path for Tier 1
- `.opencode/command/spec_kit:continue.md`: Corrected glob path and Tier 2 query strategy
- `.opencode/command/spec_kit:resume-session.md`: Corrected glob path and Tier 3 trigger query

**Rollback**: Revert 3 command files to previous versions

---

<!--
Level 3 Decision Record
Documents 7 significant technical decisions
Each ADR includes Five Checks evaluation
-->
