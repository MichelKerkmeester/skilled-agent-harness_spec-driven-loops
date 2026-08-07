---
title: "058 Phase 4 Batch B — Edit Evidence (3 mcp_server READMEs)"
batch: B
files_touched: 3
timestamp: 2026-05-15T19:50:00Z
---

# Phase 4 Batch B Edit Evidence

Three mcp_server READMEs targeted. Two received surgical drift fixes per verified delta. One received a major expansion from a stub (66 lines, 4 sections) to a full scaffold (361 lines, 10 anchor pairs, 9 numbered sections).

## File 1 — system-spec-kit/mcp_server/README.md

- Before: 322 lines, 10 anchor pairs, 5 references to non-existent `code_graph/` and `skill_advisor/` directories enumerated in verified delta (B-001 through B-012, plus 1 cleanup of a box width).
- After: 314 lines, 10 anchor pairs, 12 verified delta EDITs applied.
- validate_document.py --type readme: VALID (0 issues).

### EDIT B-001 (iter 008 finding 1)
- Location: PACKAGE TOPOLOGY block, lines 129-130 of pre-edit file.
- BEFORE:
  ```
  +-- code_graph/              # Structural code graph scanner, query handlers, and tools
  +-- skill_advisor/           # Native prompt-to-skill routing package
  ```
- AFTER: lines removed.
- Citation: iter 008 finding 1 — directories moved to separate packages per ADR-002. Actual filesystem confirms no `code_graph/` or `skill_advisor/` under `mcp_server/`.

### EDIT B-002 (iter 008 finding 2)
- Location: line 141 of pre-edit file, end of PACKAGE TOPOLOGY paragraph.
- BEFORE: `See [`code_graph/README.md`](code_graph/README.md#8-scan-scope) §8 SCAN SCOPE for full details and granular per-skill selection.`
- AFTER: `See the [`system-code-graph` skill](../../system-code-graph/mcp_server/README.md) for full details and granular per-skill selection.`
- Citation: iter 008 finding 2 — code_graph/ is not a subdirectory of mcp_server/; redirect to the external system-code-graph package README.

### EDIT B-003 (iter 008 finding 3)
- Location: allowed dependency direction block, line 147 of pre-edit file.
- BEFORE: `handlers/ → lib/ / code_graph/ / skill_advisor/ / formatters/`
- AFTER: `handlers/ → lib/ / formatters/ / database adapters`
- Citation: iter 008 finding 3.

### EDIT B-004 (iter 008 finding 4)
- Location: allowed dependency direction block, line 149 of pre-edit file.
- BEFORE: `hooks/ → lib/ / code_graph/ / skill_advisor/ read surfaces`
- AFTER: `hooks/ → lib/ read surfaces`
- Citation: iter 008 finding 4.

### EDIT B-005 (iter 008 finding 5)
- Location: DIRECTORY TREE block, lines 172 and 184 of pre-edit file.
- BEFORE: two tree entries `+-- code_graph/` and `+-- skill_advisor/`
- AFTER: lines removed.
- Citation: iter 008 finding 5 — directories no longer exist in this package.

### EDIT B-006 (iter 008 finding 6)
- Location: KEY FILES table, line 210 of pre-edit file.
- BEFORE: `| `code_graph/` | Owns structural scan, query, context, status, and diff attribution tools. |`
- AFTER: row removed.
- Citation: iter 008 finding 6.

### EDIT B-007 (iter 008 finding 7)
- Location: KEY FILES table, line 211 of pre-edit file.
- BEFORE: `| `skill_advisor/` | Owns native skill recommendation scoring, freshness, and MCP handlers. |`
- AFTER: row removed.
- Citation: iter 008 finding 7.

### EDIT B-008 (iter 008 finding 8)
- Location: BOUNDARIES AND FLOW table, line 227 of pre-edit file.
- BEFORE: `Handler logic | Handler modules may call `lib/`, `code_graph/`, `skill_advisor/`, `formatters/`, and database adapters.`
- AFTER: `Handler logic | Handler modules may call `lib/`, `formatters/`, and database adapters.`
- Citation: iter 008 finding 8.

### EDIT B-009 (iter 008 finding 9)
- Location: BOUNDARIES AND FLOW table, line 228 of pre-edit file.
- BEFORE: `Domain logic | `lib/` and `code_graph/` should not import top-level handlers.`
- AFTER: `Domain logic | `lib/` should not import top-level handlers.`
- Citation: iter 008 finding 9.

### EDIT B-010 (iter 008 finding 10)
- Location: main tool flow ASCII diagram, line 257 of pre-edit file.
- BEFORE: `│ lib, code_graph, skill_advisor, database  │`
- AFTER: `│ lib, database                             │` (trailing whitespace adjusted to match box width of 49 chars).
- Citation: iter 008 finding 10.

### EDIT B-011 (iter 008 finding 11)
- Location: ENTRYPOINTS table, line 279 of pre-edit file.
- BEFORE: `| `code_graph/handlers/*` | Modules | Execute structural graph scan, status, query, context, and diff tools. |`
- AFTER: row removed.
- Citation: iter 008 finding 11.

### EDIT B-012 (iter 008 finding 12)
- Location: ENTRYPOINTS table, line 280 of pre-edit file.
- BEFORE: `| `skill_advisor/handlers/*` | Modules | Execute advisor recommend, rebuild, status, and validate tools. |`
- AFTER: row removed.
- Citation: iter 008 finding 12.

### Residual drift NOT in verified delta

Four occurrences of `code_graph/` or `skill_advisor/` remain in this README. They are NOT listed in the verified delta and were preserved per "voice preservation: existing prose in spec-kit + code-graph READMEs stays unless delta calls for change":

1. Line 43 (OVERVIEW prose): `- `handlers/`, `code_graph/`, `lib/`, and `skill_advisor/` own the runtime behavior behind those tools.`
2. Line 104 (ARCHITECTURE ASCII diagram): the `code_graph/` box near the bottom of the diagram.
3. Line 109 (ARCHITECTURE dependency direction text inside the code block): `transport ───▶ schemas/tools ───▶ handlers ───▶ lib/code_graph/shared`
4. Line 312 (RELATED section, broken link): `- [`skill_advisor/README.md`](./skill_advisor/README.md)` — this link target does not exist.

Recommendation: open a follow-on packet to extend the iter 008 sweep to these four occurrences. The line 312 link is a broken markdown link and should be removed or repointed to `../../system-skill-advisor/mcp_server/README.md`.

## File 2 — system-code-graph/mcp_server/README.md

- Before: 262 lines, 10 anchor pairs.
- After: 262 lines, 10 anchor pairs. No edits applied.
- validate_document.py --type readme: VALID (0 issues).

Iter 009 found 0 factual drift between this README and `tool-schemas.ts`. All claims verified correct: tool count (11 in CODE_GRAPH_TOOL_SCHEMAS), re-export pattern, dispatcher path, server identifier `mk-code-index`, directory tree, boundaries. The verified delta lists no B-EDIT for this file. Skip applied as instructed.

## File 3 — system-skill-advisor/mcp_server/README.md (MAJOR EXPANSION)

- Before: 65 lines, 4 anchor pairs (overview, structure, entrypoints, related).
- After: 361 lines, 10 anchor pairs.
- validate_document.py --type readme: VALID (0 issues).
- Source: iter 010 gap analysis (7 missing sections), iter 011 target scope (7 findings with content), iter 012 draft outline (9 findings).

### Sections added (outline-level)

1. **TABLE OF CONTENTS** (new): 9-link navigation block matching the 9 numbered sections below. Anchor pattern uses model README's `#N--section-name` double-dash form.

2. **OVERVIEW** (renumbered from existing section 1, expanded): added purpose statement, current-state bullets covering `advisor-server.ts` (262 lines), `tools/` dispatch (`tools/index.ts:37-43`), `handlers/` orchestration, `lib/` 11-subdirectory layout, database ownership, and the packet 013/009/011 migration note (preserved from original). Local-first design statement closes the section.

3. **ARCHITECTURE** (NEW): ASCII diagram modeled on the spec-kit mcp_server README's diagram. Six-box layout showing MCP clients → advisor-server.ts → tools/ → handlers/ → lib/ → database/, plus a lib/skill-graph/ branch for SQLite queries. Dependency-direction footer.

4. **PACKAGE TOPOLOGY** (NEW): high-level directory tree (12 entries), allowed/disallowed dependency-direction blocks. Captures the boundary rules from iter 011 finding 2.

5. **DIRECTORY TREE** (NEW, replaces the old STRUCTURE section): complete tree from iter 011 finding 3. Lists every file under `tools/`, `handlers/`, `handlers/skill-graph/`, and all 12 `lib/` subdirectories plus flat modules. Schemas, database, data, compat, bench, tests, scripts, plugin_bridges shown to depth-1.

6. **KEY FILES** (NEW): 9-row table citing source files with line ranges where applicable. Cites `advisor-server.ts` (lines 1-262), `tools/index.ts` (lines 1-70, descriptor registry at 37-43), `tools/skill-graph-tools.ts` (lines 1-143), and the lib/skill-graph + lib/scorer + lib/daemon highlights.

7. **BOUNDARIES AND FLOW** (NEW): 7-row boundary table covering public API, transport-to-tools, handler logic, domain logic, storage, schemas, and build output. Tool invocation flow ASCII diagram with 7 boxes (MCP client → advisor-server.ts → tools/index.ts → handlers/* → lib/* → database/skill-graph.sqlite → response).

8. **ENTRYPOINTS** (renumbered from existing section 3, expanded): 12-row table covering `advisor-server.ts`, 4 advisor_* tools, 5 skill_graph_* tools, plus `npm run build` and `npm test`. Header note cites tool count (9 public tools defined in `tools/index.ts:37-43` + `skill-graph-tools.ts:22,35,55,61,67`) and the MCP server identifier (`mk_skill_advisor`).

9. **VALIDATION** (NEW): `npm run build`, `npm test -- --runInBand`, sk-doc validate_document.py + extract_structure.py invocations. Expected-result statement.

10. **RELATED** (renumbered from existing section 4, expanded): 9 links instead of 5. Adds Architecture, Library, Schemas, Database, Tests, and Bench sibling READMEs.

### Frontmatter
- Preserved as-is from the original file (title, description, 3 trigger_phrases).
- Added one tagline blockquote below the H1 (matches model README pattern).

### HVR compliance
- Punctuation scan: no em dashes, no semicolons, no Oxford commas.
- Hard-blocker word scan: no hits (single false positive on `bench/` directory name during grep).
- Voice: factual, concise, anchored. Cites source files for every load-bearing claim.

## Summary

| File | Lines before | Lines after | Anchors before | Anchors after | EDITs |
|---|---|---|---|---|---|
| system-spec-kit/mcp_server/README.md | 322 | 314 | 10 | 10 | 12 surgical |
| system-code-graph/mcp_server/README.md | 262 | 262 | 10 | 10 | 0 (skip per iter 009) |
| system-skill-advisor/mcp_server/README.md | 65 | 361 | 4 | 10 | 1 major expansion |

All three files pass `validate_document.py --type readme` with 0 issues.
