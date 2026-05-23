# Iteration 4 — ADR + Storage + Resource-Map + Changelog (cli-devin swe-1.6)

## Summary

Iteration 4 focused on ADR alignment with actual implementation, SQLite storage lifecycle verification, Phase 116 resource-map accuracy, and deep-review v1.4.0.0 changelog completeness. Found 3 new findings (1 P1, 2 P2) across ADR drift, documentation staleness, and missing shared helper implementation.

## Findings

### P0 (Blockers)
None.

### P1 (Required)

**F-021: ADR-001 implementation drift — shared helper not implemented**
- **Dimension**: adr-alignment
- **File**: `.opencode/specs/skilled-agent-orchestration/118-deep-loop-full-isolation-no-mcp/003-script-shim-and-db-relocation/decision-record.md`
- **Line**: 80
- **Evidence**: "A shared helper `.opencode/skills/deep-loop-runtime/scripts/lib/db-open.cjs` exposes `openDatabase(path)` and `withDatabase(path, fn)`. `withDatabase` wraps a `try/finally` so `db.close()` runs on every exit path"
- **Fix**: Either implement the `_lib/db-open.cjs` helper as described or update ADR-001 to reflect the actual implementation (scripts directly import from TypeScript lib and call `db.closeDb()` in finally blocks)

**F-022: ADR-004 incomplete deletion — coverage-graph README.md still references deleted tools**
- **Dimension**: adr-alignment  
- **File**: `.opencode/skills/system-spec-kit/mcp_server/handlers/coverage-graph/README.md`
- **Line**: 71-74, 152-155
- **Evidence**: Lines 71-74 list "deep_loop_graph_upsert handler", "deep_loop_graph_query handler", "deep_loop_graph_status handler", "deep_loop_graph_convergence handler" in directory tree. Lines 152-155 reference the same tool surfaces in entrypoints table.
- **Fix**: Update README.md to reflect that handler files are deleted and tools no longer exist, or delete the README.md entirely if the folder is being removed

### P2 (Suggestions)

**F-023: ADR-001 §Implementation file list incomplete — missing script TSX loader pattern**
- **Dimension**: adr-alignment
- **File**: `.opencode/specs/skilled-agent-orchestration/118-deep-loop-full-isolation-no-mcp/003-script-shim-and-db-relocation/decision-record.md`
- **Line**: 193-197
- **Evidence**: "What changes" section lists scripts entry points and shared helper, but omits the TSX loader bootstrap pattern that all 4 scripts use (spawnSync with --import flag and DEEP_LOOP_TSX_LOADED guard)
- **Fix**: Add TSX loader pattern to §Implementation changes or add a §Script Bootstrapping subsection explaining the loader pattern

**F-024: Resource-map test count mismatch — summary says 4 tests, table shows 4 moved + 1 cited**
- **Dimension**: resource-map-accuracy
- **File**: `.opencode/specs/skilled-agent-orchestration/116-deep-review-complexity/008-playbooks-and-default-calibration/resource-map.md`
- **Line**: 30
- **Evidence**: Summary line "By category: Documents=8, Skills=1, Scripts=1, Tests=4" but Tests table shows 4 moved entries plus 1 cited entry (total 5 test references)
- **Fix**: Update summary count to Tests=5 or clarify that "Cited" entries are counted separately

## Convergence Signal
- newFindings: 4
- newFindingsRatio: 4/20 = 0.20 (above 0.10 threshold)
- Cumulative: P0=0 P1=11 P2=10
