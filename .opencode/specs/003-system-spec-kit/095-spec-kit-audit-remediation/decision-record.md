# Decision Record: System Spec-Kit Code Audit & Remediation

## DR-001: Audit Strategy -- 10 Parallel Agents
**Decision:** Use 10 parallel Opus 4.6 agents for the audit phase, each scanning a different directory/concern.
**Rationale:** Parallel scanning maximizes coverage and finds cross-cutting issues. Sequential scanning would miss inconsistencies between directories.
**Alternatives considered:** Single-agent sequential scan (too slow, misses cross-references), 5 agents (insufficient granularity).
**Outcome:** Found 15+ P0, 50+ P1, 13 bugs across all file types.

## DR-002: `require()` vs `import()` for Optional Cross-Workspace Modules
**Decision:** Keep `require()` with try-catch for optional runtime-only module loading in `errors/core.ts`.
**Rationale:** TypeScript cannot resolve cross-workspace paths at compile time (`shared/utils/retry.ts` to `dist/lib/utils/retry.js`). Dynamic `import()` causes TS2307. The project is CommonJS, so `require()` is the appropriate pattern.
**Alternatives considered:** Dynamic `import()` (caused TS2307 build error), path aliasing (over-engineering), moving retry.ts to local workspace (code duplication).
**Outcome:** Documented with explanatory comment; no build errors.

## DR-003: BM25 Backward Compatibility Strategy
**Decision:** Rename methods to camelCase AND provide deprecated snake_case aliases at the class bottom.
**Rationale:** Ensures existing external consumers (if any) don't break, while new code uses the standard naming.
**Alternatives considered:** Breaking rename (simpler but risky), re-export wrapper (over-engineering).
**Outcome:** 5 methods renamed, 5 aliases added, 32 test updates, zero breaking changes.

## DR-004: MemoryRow Canonical Location
**Decision:** Place canonical MemoryRow in `shared/types.ts` with all fields optional.
**Rationale:** `shared/` is imported by both `mcp_server/` and `scripts/`, making it the natural home. Optional fields accommodate different consumers needing different subsets.
**Alternatives considered:** `mcp_server/lib/types.ts` (not accessible from scripts), separate `memory-types.ts` file (unnecessary given existing types.ts), intersection types per consumer (complex).
**Outcome:** 3 local definitions removed, all import from canonical. `RetryMemoryRow extends MemoryRow` for required fields.

## DR-005: Duplicate Function Handling
**Decision:** Only consolidate functions with IDENTICAL implementations; add cross-reference comments to intentionally different pairs.
**Rationale:** 4 of 5 duplicate pairs had genuine behavioral differences (timezone handling, stopword sets, randomness sources). Consolidating would change runtime behavior.
**Alternatives considered:** Force-consolidate all (would break behavior), ignore all (misses the 1 true duplicate).
**Outcome:** `cleanDescription()` consolidated; 4 pairs documented with NOTE comments explaining differences.

## DR-006: Archival SQL Logic Change (OR to AND)
**Decision:** Change archival query from OR to AND logic for qualifying memories for archival.
**Rationale:** OR logic was too aggressive -- any memory that was old OR had low access OR had low confidence would be archived. AND logic requires ALL conditions, preventing good but rarely-accessed memories from being archived.
**Alternatives considered:** Tiered thresholds (complex), weighted scoring (over-engineering for the issue).
**Outcome:** More conservative archival; important memories preserved longer.

## DR-007: Pre-existing 136 TS Errors -- Out of Scope
**Decision:** Document but do not fix the 136 pre-existing TypeScript errors.
**Rationale:** These are interface version drift between the MCP SDK types and handler implementations. Fixing them requires reconciling the MCP SDK type definitions, which is a separate large effort unrelated to coding standards.
**Alternatives considered:** Fix inline (scope creep, high risk), suppress with ts-ignore (hides real issues).
**Outcome:** Documented as out-of-scope P2 deferral in checklist.md.

## DR-008: Default Export Removal
**Decision:** Remove all `export default` blocks that duplicated named exports.
**Rationale:** The coding standard requires named exports only. Default exports alongside named exports create ambiguity about import style.
**Alternatives considered:** Keep defaults for CommonJS compat (unnecessary -- project uses ESM import syntax with CJS compilation).
**Outcome:** Zero default exports remaining in codebase. No callers broke (all already used named imports).
