# Iteration 12: sqlite-vec stub, scripts deps, mcp-lib eval names

## Focus
Angle 3. Confirm the scripts-package sqlite-vec declaration has a type stub and no importer, and whether eval filenames still advertise an MCP library.

## Findings

### F-I12-001 — Skill-root `sqlite-vec.d.ts` declares a module with no package.json owner. CONFIRMED. P1
`.opencode/skills/system-spec-kit/sqlite-vec.d.ts` declares `module 'sqlite-vec'` with `load(db: Database)`. [SOURCE: .opencode/skills/system-spec-kit/sqlite-vec.d.ts:1-8]
The skill-root `package.json` has no `sqlite-vec` key. The declaration exists so TypeScript can type a dependency that only `scripts/package.json` still lists. [SOURCE: .opencode/skills/system-spec-kit/scripts/package.json:21-29]
Together with F-I5-001 (no source importer; only a `vec_memories` stand-in comment), this is a type stub for a retired vector extension.
Smallest fix: drop `sqlite-vec` and `sqlite-vec-darwin-arm64` from scripts, delete `sqlite-vec.d.ts`.

### F-I12-002 — `@spec-kit/scripts` still describes itself as memory management. CONFIRMED. P2
`description` is "CLI tools for spec-kit context generation and memory management"; `main` is `dist/memory/generate-context.js`. [SOURCE: .opencode/skills/system-spec-kit/scripts/package.json:3-6]
Restates F-I5-003. D7 allows the `/memory:save` command name; it does not require the package blurb to say "memory management".
Smallest fix: describe continuity generation; keep the `scripts/memory/` folder if the writer path stays.

### F-I12-003 — Evals still named `check-no-mcp-lib-imports` after D8. CONFIRMED. P2
`scripts/evals/README.md` lists `check-no-mcp-lib-imports.ts` and the AST variant as "Internal runtime import checks". [SOURCE: .opencode/skills/system-spec-kit/scripts/evals/README.md:37-38]
`scripts/package.json` `check` / `check:ast` still invoke those filenames. [SOURCE: .opencode/skills/system-spec-kit/scripts/package.json:18-19]
The checkers exist (iteration 5/6 ruled out "the eval path is gone"). The name is D8 identity residue. The file header says it scans scripts for prohibited internal runtime imports. [SOURCE: .opencode/skills/system-spec-kit/scripts/evals/check-no-mcp-lib-imports.ts:1-9]
Smallest fix: rename to `check-no-runtime-lib-imports` in a follow-on; not a 054 T004-T008 item.

### F-I12-004 — `better-sqlite3` on scripts is not automatically residue. CONFIRMED. P2 (negative)
`scripts/package.json` still depends on `better-sqlite3`. [SOURCE: .opencode/skills/system-spec-kit/scripts/package.json:24]
Live readers remain: folder-detector `session_learning` (F-I5-002), legacy-lane (F-I5-006), entity-extractor Database types (F-I11-001). Dropping the dep before those readers are deleted would break typecheck, not prove D8.
Smallest fix: remove `better-sqlite3` only after the leftover readers/writers are gone.

## Sources Consulted
- .opencode/skills/system-spec-kit/sqlite-vec.d.ts:1-8
- .opencode/skills/system-spec-kit/scripts/package.json:3-6,18-29
- .opencode/skills/system-spec-kit/scripts/evals/README.md:37-38
- .opencode/skills/system-spec-kit/scripts/evals/check-no-mcp-lib-imports.ts:1-9

## Assessment
- newInfoRatio: 0.55
- Novelty justification: type stub at skill root is new; package blurb and eval names corroborate earlier findings.
- Confidence: high.

## Reflection
- Worked: skill-root d.ts vs scripts package.json, not a workspace-wide grep.
- Failed: none.
- Ruled out: dropping better-sqlite3 as a first cut.

## Dead Ends
- None.

## Recommended Next Focus
054 T009-T012 still open: whether the leftover runtime modules are in-scope for T009 or are unabsorbed 052 debt.
