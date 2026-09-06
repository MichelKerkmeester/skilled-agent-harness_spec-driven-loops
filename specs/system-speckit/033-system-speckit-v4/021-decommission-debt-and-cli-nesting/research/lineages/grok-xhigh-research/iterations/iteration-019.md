# Iteration 19: Contradiction sweep (D5 vs residue vs absorbed)

## Focus
Angle rotation wrap. Separate leftover retired-surface hits from D5 preserved set and from 054-absorbed rows so synthesis does not over-claim.

## Findings

### F-I19-001 — D5 items that are not decommission misses. CONFIRMED. P2 (negative)
Keep as preserved, not residue:
- Skill advisor MCP package and `.github/workflows/routing-registry-drift.yml` (F-I9-005)
- Shared HF model server default dir `runtime/database` (F-I2-006)
- Shared IPC / `@modelcontextprotocol/sdk` imported by the advisor (F-I5-004)
- `/doctor memory` diagnosing `runtime/data/trigger-index.json` (F-I7-005)
- `/memory:save` and `/memory:search` command pair (F-I16-002)
- Claude/Pi skill symlinks (F-I10-003)
Do not recommend deleting these in a debt packet.

### F-I19-002 — Absorbed 052 rows that are not live misses. CONFIRMED. P2 (negative)
T004 fixture freshness, T005 fan-out stderr, T006 review-leaf paths, T007 rollback-runbook + MCPResponse + stale test name, T008 trigger-index move. [SOURCE: .opencode/specs/system-speckit/054-decommission-debt-fixes/tasks.md:47-51]
053 pass-3 P2s cited in iteration 1 as already gone live (README stress-test/runtime).
Eleven session-lifecycle registrations from `273767431d` still resolve (F-I4-001).
zvec lane and `system-plugins` absent (F-I3-001).
No spec-memory plugin (F-I10-004).

### F-I19-003 — Confirmed leftover set that the loops missed or deferred. CONFIRMED. P1
Highest-signal leftovers still on the tree:
1. Untracked `system-spec-kit/mcp-server/` + broken `node_modules` symlink (F-I10-001/002)
2. Live `memory_index` / `memory_entities` writers + tests (F-I11, F-I18-002)
3. Default `DB_PATH` / `resolveDatabasePaths` filename `context-index.sqlite` (F-I2-001, F-I18-003)
4. `sqlite-vec` dep + skill-root `sqlite-vec.d.ts` with no importer (F-I5-001, F-I12-001)
5. Tests importing deleted cognitive/hybrid-search/retry-manager dist (F-I6-001/002)
6. naming-migration missing-file pass (F-I6-003)
7. Doctor-update `mcp-server/database` snapshot + ignored sqlite rows in command-references (F-I14-001/003)
8. Extraction README ghost pipeline (F-I18-001)
9. Startup priming has no successor (F-I8-001)
10. CONTINUITY_FRESHNESS skip-as-pass and validate.sh helper-continue (F-I9-001/002)
11. session-prime README vs fallback-only startup (F-I4-004)
12. workflow-invariance allowlist of deleted playbooks (F-I16-001)
13. Three sk-doc validator class defects (F-I15-001)

### F-I19-004 — 054 T012 must not write "zero debt" into the 052 log. CONFIRMED. P1
T012: close this packet and record the outcome in packet 052's goal log. [SOURCE: .opencode/specs/system-speckit/054-decommission-debt-fixes/tasks.md:62]
052 objective was "prove zero drift, residue or debt". [SOURCE: specs/system-speckit/052-memory-decommission-landing/goal.md:47]
If T009-T011 go green on READMEs and tracked-file sweep only, T012 can land a lying DONE WHEN row. That is the programme-level lying gate (angle 7) sitting on an open task, not on validate.sh.
Smallest fix: T012 text must list remaining residue (this lineage's F-I19-003) or spawn a follow-on packet. Do not mark 052 DONE WHEN as satisfied.

## Sources Consulted
- Prior iteration findings F-I2 through F-I18
- .opencode/specs/system-speckit/054-decommission-debt-fixes/tasks.md:47-62
- specs/system-speckit/052-memory-decommission-landing/goal.md:47

## Assessment
- newInfoRatio: 0.30
- Novelty justification: the leftover-versus-preserved map and the T012 lying-close risk. No new file-level defect.
- Confidence: high on the map. Completeness of the leftover list is inferred (other lineages may add).

## Reflection
- Worked: one pass that refuses to re-open D5 and T004-T008.
- Failed: none.
- Ruled out: "the decommission missed the advisor MCP / HF database directory / memory:save name".

## Dead Ends
- Treating every remaining `memory` string as a miss.

## Recommended Next Focus
Iteration 20 wrap: successor coverage leftovers vs declared-loss table, then synthesize.
