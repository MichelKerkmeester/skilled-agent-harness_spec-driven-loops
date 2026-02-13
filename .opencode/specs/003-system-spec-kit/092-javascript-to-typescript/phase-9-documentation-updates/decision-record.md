# Decision Record: Phase 8 — Documentation Updates

> **Parent Spec:** 092-javascript-to-typescript/
> **Workstream:** W-I
> **Level:** 3
> **Created:** 2026-02-07

---

## Overview

Phase 8 focuses on documentation updates after code conversion. Unlike prior phases with formal ADRs (D1-D8 in parent spec), Phase 8 decisions are **implementation choices** for documentation consistency and maintainability.

**Parent ADRs (from `../decision-record.md`):**
- **D1:** CommonJS output (not ESM) — affects how we document compiled vs. source syntax
- **D2:** In-place compilation (no dist/) — affects path references in docs
- **D7:** Central `shared/types.ts` — affects code examples showing type imports

These parent decisions constrain Phase 8 documentation approach.

---

## Implementation Choices (Phase 8 Specific)

### IC-1: Documentation Update Strategy — Parallel Streams

**Context:** 55 files to update with minimal inter-file dependencies.

**Choice:** 6 parallel, independent streams (8a-8f) executable simultaneously.

**Rationale:**
- Maximizes agent utilization in Session 4 (10 available agents)
- Reduces coordination overhead (no sequential bottlenecks)
- Allows specialized focus per stream (e.g., README expert, code sample expert)

**Alternatives considered:**
1. **Sequential file-by-file:** Too slow (~55 hours serial vs. ~11 hours parallel)
2. **Random parallel assignment:** Risk of inconsistent code sample patterns across agents
3. **Document-type batching (all READMEs, then all references):** Doesn't leverage full parallelism

**Impact:**
- Session 4 completion time: ~11 hours wall-clock (vs. ~55 serial)
- Agent 6-8 allocated to Phase 8, Agents 1-5 + 9-10 handle Phase 7 + Phase 9
- No stream dependencies → no blocked agents

**Status:** Decided (2026-02-07)

---

### IC-2: Code Sample Conversion Approach — Source Syntax in Docs

**Context:** Documentation shows code examples. Source is TypeScript (ES modules), compiled output is CommonJS.

**Choice:** Show **TypeScript source syntax** in all code examples with note explaining compilation.

**Example:**
```typescript
// Documentation shows this (source):
import { retryWithBackoff } from '../shared/utils/retry';

// Note: Compiles to CommonJS (output):
// const { retryWithBackoff } = require('../shared/utils/retry');
```

**Rationale:**
- **Developer mental model:** Developers read/write `.ts` source, not compiled `.js` output
- **Type visibility:** TypeScript syntax makes type annotations visible in docs
- **Future-proof:** If we switch to ESM output (override D1), docs don't need rewrite
- **Consistency:** Align with TypeScript ecosystem conventions (docs show source syntax)

**Alternatives considered:**
1. **Show compiled CommonJS:** Mismatches what developers see in editor
2. **Show both source + compiled:** Clutters documentation, doubles code block count
3. **Mix based on context:** Confusing, inconsistent

**Note placement:**
- High-impact files (shared/README, mcp_server/README): Explicit note in introduction
- Low-impact files: Brief inline comment in first code block
- Standard note template (see `plan.md` §4)

**Status:** Decided (2026-02-07)

---

### IC-3: Path Reference Update Strategy — Source-Focused with Execution Distinction

**Context:** Three categories of path references: source files, compiled output, cross-references.

**Choice:**
1. **Source file references:** Always use `.ts` extension
2. **Execution commands:** Always use compiled `.js` (e.g., `node scripts/memory/generate-context.js`)
3. **Cross-references:** Use source `.ts` when linking to code, compiled `.js` when showing CLI usage

**Rationale:**
- **Clarity:** Explicit distinction prevents "which file do I edit?" confusion
- **Accuracy:** Execution commands match actual runtime behavior (Node.js runs `.js`)
- **Consistency:** All docs follow same pattern for source vs. execution

**Examples:**

| Context | Reference Format |
|---------|-----------------|
| "The retry module is located at..." | `shared/utils/retry.ts` |
| "To run the script, use..." | `node scripts/memory/generate-context.js` |
| "See implementation in..." | `mcp_server/lib/search/vector-index.ts:42-58` |
| Directory listing (source-focused) | Show `.ts` files only |
| Directory listing (runtime-focused) | Show both `.ts` (source) and `.js` (compiled) with note |

**Alternatives considered:**
1. **Always show .ts:** Confuses execution commands (node can't run .ts directly)
2. **Always show .js:** Hides source code location from developers
3. **No distinction:** Ambiguous, requires readers to infer context

**Status:** Decided (2026-02-07)

---

### IC-4: Directory Structure Representation — Simplified Source View

**Context:** In-place compilation creates both `.ts` source and `.js` compiled files in same directory.

**Choice:** READMEs show **simplified source-focused view** (`.ts` only) with note explaining compilation.

**Example:**

**Full file system (actual):**
```
shared/
├── embeddings.ts
├── embeddings.js (compiled)
├── embeddings.d.ts (type declarations)
├── chunking.ts
├── chunking.js (compiled)
└── chunking.d.ts
```

**Simplified in docs (recommended):**
```
shared/
├── embeddings.ts
└── chunking.ts

Note: TypeScript source files compile to .js in the same directory.
```

**Rationale:**
- **Readability:** 3x fewer entries, focuses on what developers edit
- **Source of truth:** `.ts` files are canonical (`.js` are artifacts)
- **Less maintenance:** If we add `.js.map` or change compilation target, docs don't need update

**Exception:** If explaining compilation model or debugging compiled output, show full view with labels.

**Status:** Decided (2026-02-07)

---

### IC-5: Code Sample Type Annotation Depth — Practical Not Exhaustive

**Context:** Code examples in documentation can have varying levels of type annotation detail.

**Choice:** **Public API fully typed, internal helpers minimally typed** in code samples.

**Example:**

**Public API (full types):**
```typescript
export async function searchMemories(
  query: string,
  options?: SearchOptions
): Promise<SearchResult[]> {
  // implementation
}
```

**Internal helper (minimal types, rely on inference):**
```typescript
function normalizeQuery(query: string) {
  return query.trim().toLowerCase(); // return type inferred as string
}
```

**Rationale:**
- **Documentation clarity:** Readers focus on public API contracts, not internal implementation details
- **Brevity:** Shorter code blocks easier to read in documentation
- **Pragmatism:** TypeScript inference handles most internal code

**When to use full types in docs:**
- Function parameters (always)
- Public function return types (always)
- Complex data structures (interfaces/types shown separately)
- Error handling (typed catch blocks where showing error types)

**When inference is acceptable:**
- Simple return types (`string`, `number`, `boolean`)
- Local variables with obvious initialization
- Internal helper functions not part of public API

**Status:** Decided (2026-02-07)

---

### IC-6: CHANGELOG Entry Structure — Comprehensive with Cross-References

**Context:** CHANGELOG.md must document entire migration (10 phases, 8 ADRs, 241 files).

**Choice:** Structured entry with cross-references to `decision-record.md` for detailed rationale.

**Structure:**
1. **Migration Summary:** High-level scope (file count, LOC, phases)
2. **Architecture Decisions:** List all 8 ADRs with one-line rationale + link to decision-record.md
3. **Infrastructure:** TypeScript setup details
4. **Migration Phases:** One-sentence summary per phase
5. **Changed/Added/Preserved:** Standard changelog sections
6. **Performance:** Metrics (build time, startup time, etc.)
7. **Cross-Reference:** Link to full spec folder for deep dive

**Rationale:**
- **CHANGELOG brevity:** Summary fits in 50-100 lines
- **Deep dive available:** Link to decision-record.md for full ADR details (avoids duplicating 2,000+ lines)
- **Standard format:** Follows Keep a Changelog conventions
- **Searchable:** Developers can grep CHANGELOG for "TypeScript" and find entry

**Alternatives considered:**
1. **Full ADRs in CHANGELOG:** 3,000+ line entry, unreadable
2. **Minimal entry:** "Migrated to TypeScript" — insufficient context
3. **Separate migration doc:** Violates single-source-of-truth (CHANGELOG is canonical)

**Status:** Decided (2026-02-07)

---

### IC-7: Code Block Language Tags — Explicit TypeScript Annotation

**Context:** Markdown code blocks need language tags for syntax highlighting.

**Choice:** All code blocks use ` ```typescript ` (not ` ```javascript ` or ` ```ts `).

**Rationale:**
- **Clarity:** Explicit "typescript" tag signals language to readers
- **GitHub rendering:** ` ```typescript ` renders correctly (` ```ts ` is non-standard)
- **Consistency:** All docs use same tag convention
- **Future-proof:** If we document .mts (ES modules) vs .ts (CommonJS), distinction visible

**Tag mapping:**
- TypeScript source code: ` ```typescript `
- Shell commands: ` ```bash ` or ` ```sh `
- JSON config: ` ```json ` or ` ```jsonc ` (for tsconfig with comments)
- Plain text output: ` ```text ` or ` ``` ` (no tag)

**Status:** Decided (2026-02-07)

---

## Cross-Cutting Concerns

### Backward Compatibility

**Preserved:**
- All snake_case export aliases documented (e.g., `detect_spec_folder` still exported)
- Compiled output behavior unchanged (100% test pass rate)
- File paths unchanged (in-place compilation, Decision D2)
- Configuration unchanged (`opencode.json` startup paths identical)

**Documentation impact:**
- Show both camelCase and snake_case in export tables where applicable
- Note that snake_case exports are deprecated but preserved for compatibility

---

### Security Patterns

**Preserved:**
- Path validation (CWE-22 prevention) still active
- Input length limits (SEC-003) still enforced
- No new attack surface from TypeScript (compiled output identical behavior)

**Documentation impact:**
- Security examples show typed validation functions
- Input sanitization examples show typed string manipulation

---

### Maintenance

**Simplification:**
- Type annotations serve as inline documentation (reduces need for JSDoc comments)
- Barrel exports (`index.ts`) make module structure visible
- Interface definitions in `shared/types.ts` documented once, referenced everywhere

**Documentation impact:**
- Link to `shared/types.ts` for canonical type definitions
- Reduce duplication of type documentation across files

---

## Decision Summary Table

| ID | Decision | Rationale | Status |
|----|----------|-----------|--------|
| IC-1 | Parallel streams (6 independent streams) | Maximize agent utilization, minimize coordination | Decided |
| IC-2 | Show TypeScript source syntax in code examples | Developer mental model, type visibility, future-proof | Decided |
| IC-3 | Source-focused paths (.ts) with execution distinction (.js) | Clarity, accuracy, consistency | Decided |
| IC-4 | Simplified directory view (.ts only) with note | Readability, source of truth, less maintenance | Decided |
| IC-5 | Public API fully typed, internals minimally typed | Clarity, brevity, pragmatism | Decided |
| IC-6 | Comprehensive CHANGELOG with cross-references | Brevity + depth, standard format, searchable | Decided |
| IC-7 | Explicit ` ```typescript ` language tags | Clarity, GitHub rendering, consistency | Decided |

---

## Parent ADR References

Phase 8 decisions are **constrained by** parent spec ADRs:

| Parent ADR | Phase 8 Impact |
|------------|----------------|
| D1: CommonJS output | Docs show source (ES modules) but note compiled output (CommonJS) |
| D2: In-place compilation | Path references don't need dist/ prefix |
| D3: Strict mode | Code examples assume strict null checks, no `any` |
| D4: File moves | Docs reference new locations (shared/utils/retry, etc.) |
| D5: Keep I prefix | `IEmbeddingProvider`, `IVectorStore` documented with I prefix |
| D6: Standards first | Code examples follow style_guide.md conventions |
| D7: Central types.ts | Code examples import types from shared/types |
| D8: Tests last | Test file docs updated in Phase 7 (not Phase 8) |

See `../decision-record.md` for full parent ADR details.

---

## Implementation Notes

**Pre-execution checklist:**
- [ ] Phases 5 and 6 complete (all code converted to TypeScript)
- [ ] Compiled output verified functional (MCP server + CLI scripts work)
- [ ] Standard code sample template agreed (IC-2, IC-5)
- [ ] Path reference convention agreed (IC-3, IC-4)

**During execution:**
- Track actual vs. estimated reference counts for accuracy
- Document any discovered files not in original 55-file list
- Flag inconsistencies between code and documentation for resolution

**Post-execution verification:**
- Run automated link checker (all internal links resolve)
- Validate 10 spot-check files manually (accuracy + completeness)
- Verify CHANGELOG entry against decision-record.md (all 8 ADRs referenced)
- Confirm all 24 tasks (T280-T303) marked complete

---

## Cross-References

- **Parent Decision Record:** `../decision-record.md` (ADRs D1-D8)
- **Plan:** `plan.md` (execution strategy, code sample templates)
- **Tasks:** `tasks.md` (detailed task breakdown T280-T303)
- **Checklist:** `checklist.md` (verification items CHK-150 through CHK-171)
