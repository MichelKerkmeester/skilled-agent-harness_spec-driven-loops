# Checklist: Phase 17 — workflows-code--opencode Alignment Audit + Remediation

## P0 — HARD BLOCKERS (Audit Phase Complete)

- [x] **CHK-170**: Audit all mcp_server TypeScript files (62 files) — `scratch/audit-01-mcp-server-ts.md`
- [x] **CHK-171**: Audit all mcp_server handler files (10 files) — `scratch/audit-02-mcp-handlers-js.md`
- [x] **CHK-172**: Audit all mcp_server lib JavaScript files (1 file, 3326 LOC) — `scratch/audit-03-mcp-lib-js.md`
- [x] **CHK-173**: Audit all shared/embeddings TypeScript files (6 files) — `scratch/audit-04-shared-embeddings-ts.md`
- [x] **CHK-174**: Audit all shared/ non-embeddings TypeScript files (6 files) — `scratch/audit-05-shared-other-ts.md`
- [x] **CHK-175**: Audit all scripts/ JavaScript files (13 files) — `scratch/audit-06-scripts-js.md`
- [x] **CHK-176**: Audit all scripts/ Shell files (27 files) — `scratch/audit-07-scripts-sh.md`
- [x] **CHK-177**: Audit all scripts/ Python files (1 file) — `scratch/audit-08-scripts-py.md`
- [x] **CHK-178**: Audit all config/JSON files (10 files) — `scratch/audit-09-config-json.md`
- [x] **CHK-179**: Bi-directional skill gap analysis — `scratch/audit-10-skill-gap-analysis.md`
- [x] **CHK-180**: All scratch audit files written with per-file, per-priority findings

## P1 — REQUIRED (Analysis Phase Complete)

- [x] **CHK-181**: Violation counts aggregated across all domains (136 files, 645 violations)
- [x] **CHK-182**: Two-track remediation plan documented (Track A: Skill, Track B: Code)
- [x] **CHK-183**: Priority ordering established (A1-A3 immediate, A4-A7/B1/B3/B4 short-term, rest deferred)
- [x] **CHK-184**: Decision record with 5 decisions (D1-D5) documented in plan.md
- [x] **CHK-185**: snake_case → camelCase migration identified as separate Phase 18 — **COMPLETED IN-PHASE** (user requested "apply all fixes")
- [x] **CHK-186**: Stale evidence citations cataloged (25+ broken references)
- [x] **CHK-187**: TypeScript header template direction decided (skill adapts to code, D1)

## P2 — IMPLEMENTATION (Complete)

- [x] **CHK-188**: Python file audit complete (1 file, 7 violations)
- [x] **CHK-189**: Config/JSON audit complete (10 files, 13 violations)
- [x] **CHK-190**: tsconfig baseline alignment verified (core settings match, outDir deviates)
- [x] **CHK-191**: Implementation of Track A changes — 9 tasks (A1-A9) complete via 4 parallel agents
- [x] **CHK-192**: Implementation of Track B changes — 6 tasks (B1-B6) complete via 4 parallel agents
- [x] **CHK-193**: Post-implementation verification — `tsc --build` shows 151 pre-existing errors, 0 new errors from changes; `grep` confirms zero `// ============` headers, zero `'use strict'` in .ts files

## Audit Quality Verification

- [x] 10 Opus agents dispatched simultaneously per orchestrate.md (audit phase)
- [x] All 10 agents completed successfully with written reports
- [x] Reports cross-referenced for consistency (header finding confirmed by agents 1,2,4,5,6,10)
- [x] Bi-directional analysis completed (code→skill AND skill→code gaps)
- [x] Level 2 documentation: spec.md, plan.md, tasks.md, checklist.md complete

## Implementation Quality Verification

- [x] 8 agents dispatched simultaneously (4 opus, 4 sonnet) for implementation phase
- [x] All 8 agents completed successfully
- [x] Track A: All 9 skill update tasks verified (header, citations, counts, diagrams, 5 new sections)
- [x] Track B: All 6 code fix tasks verified (use-strict, rename, barrel, shell, filters, headers)
- [x] TypeScript build verification: 0 new errors introduced (151 pre-existing)
- [x] B6 header verification: 0 files use old `// ============` format
