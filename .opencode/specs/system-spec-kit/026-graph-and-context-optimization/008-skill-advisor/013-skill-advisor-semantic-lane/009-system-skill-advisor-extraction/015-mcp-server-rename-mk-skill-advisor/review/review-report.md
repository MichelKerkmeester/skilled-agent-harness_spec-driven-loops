# Deep Review Report: Rename system_skill_advisor MCP server to mk_skill_advisor

**Target Packet**: `015-mcp-server-rename-mk-skill-advisor` (under `013/009`)

**Date**: 2026-05-14

**Executor**: opencode-go/deepseek-v4-pro (5 iterations)

**Stop Reason**: Iteration cap reached (5/5). Convergence detected (new-info ratio < 0.15 in iter-005).

---

## Executive Summary

The `system_skill_advisor` → `mk_skill_advisor` rename is a well-executed atomic operation. All four runtime configs, the launcher binary/state, the server registration, and all live namespace consumers are aligned. No stale `system_skill_advisor` or `mcp__system_skill_advisor__` references remain in live code. The rename correctly preserves the folder name (`system-skill-advisor`), graph `skill_id`, and public tool ids per the ADR boundaries.

**Verdict**: **PASS** — 0 P0, 0 P1, 9 P2 advisories.

---

## Findings Summary

| ID | Severity | Title | Category | Iteration |
|----|----------|-------|----------|-----------|
| F-001 | P2 | Parent `graph-metadata.json` key_files still references old launcher path `.opencode/bin/skill-advisor-launcher.cjs` | consistency | 001 |
| F-002 | P2 | Parent `graph-metadata.json` entities list includes old `skill-advisor-launcher.cjs` entity | consistency | 001 |
| F-003 | P2 | Parent `graph-metadata.json` trigger_phrases still include `system_skill_advisor` | consistency | 001 |
| F-004 | P2 | Env var `SYSTEM_SKILL_ADVISOR_DB_DIR` inconsistent with renamed server id | consistency | 002 |
| F-005 | P2 | No post-build verification of mk-prefixed log output in `buildIfNeeded` | robustness | 003 |
| F-006 | P2 | No automated vitest assertion for mk_skill_advisor server registration identity | testing | 004 |
| F-007 | P2 | No automated vitest assertion for launcher state file command identity | testing | 004 |
| F-008 | P2 | No automated cross-config consistency check for mk_skill_advisor across runtime configs | testing | 004 |
| F-009 | P2 | Legacy vitest path in system-skill-advisor README validation section | documentation | 005 |

---

## Findings by Category

### Consistency (F-001, F-002, F-003, F-004)

The parent `013/009/graph-metadata.json` has 3 stale references (old launcher path in `key_files`, old launcher entity in `entities`, and `system_skill_advisor` in `trigger_phrases`). The `SYSTEM_SKILL_ADVISOR_DB_DIR` env var is intentionally unchanged per CHK-031 but creates a discoverability gap. All 4 are P2.

### Robustness (F-005)

The launcher's `buildIfNeeded` function checks file existence but not content freshness. A stale dist with the old `system_skill_advisor` registration would pass the readiness check even though its content is outdated. P2.

### Testing (F-006, F-007, F-008)

Three blind spots in automated testing: no vitest assertion for the `mk_skill_advisor` server name, no assertion for the launcher state file command field, and no cross-config consistency check. The rename is verified only through the manual smoke matrix. All P2.

### Documentation (F-009)

The `system-skill-advisor/README.md` validation section references the spec-kit vitest path (legacy) instead of the standalone advisor package test path. Pre-existing issue surfaced during review. P2.

---

## Convergence Analysis

| Iteration | New Findings | Cumulative | New-Info Ratio |
|-----------|-------------|------------|----------------|
| 001 (ARCHITECTURE) | 3 | 3 | 1.00 |
| 002 (CORRECTNESS) | 1 | 4 | 0.25 |
| 003 (ROBUSTNESS) | 1 | 5 | 0.20 |
| 004 (TESTING) | 3 | 8 | 0.38 |
| 005 (DOCUMENTATION) | 1 | 9 | 0.11 |

The new-info ratio dropped significantly after iter-001, with a brief uptick in iter-004 (testing gap discovery) before converging at 0.11 in iter-005. F-010 in iter-005 is F-001 rediscovered across dimensions, reinforcing convergence.

---

## Dimension Coverage

| Dimension | Iteration | Status |
|-----------|-----------|--------|
| ARCHITECTURE | 001 | Covered — ADR alignment verified |
| CORRECTNESS | 002 | Covered — 0 stale refs in live code |
| ROBUSTNESS | 003 | Covered — error handling adequate |
| TESTING | 004 | Covered — gaps identified (P2 only) |
| DOCUMENTATION | 005 | Covered — 1 legacy doc path found |

---

## Verdict

**PASS** with 9 P2 advisories.

**Basis**: Zero P0 (correctness/security) or P1 (degraded behavior) findings. All findings are P2 — minor consistency issues, documentation gaps, or testing coverage improvements. The rename is complete, verified, and production-ready.

---

## Remediation Recommendations

### Follow-on Packet: `docs(013/009/015): close 9 P2 deep-review advisories`

| Finding | Remediation | Effort |
|---------|-------------|--------|
| F-001, F-002, F-003 | Run `generate-context.js` on parent 013/009 to refresh derived metadata | 5 min |
| F-004 | Add `MK_SKILL_ADVISOR_DB_DIR` as fallback with deprecation note, or document divergence in ADR | 15 min |
| F-005 | Add content-based freshness check or document build requirement | 10 min |
| F-006 | Add vitest assertion for server registration name | 10 min |
| F-007 | Add vitest assertion for launcher state file command field | 10 min |
| F-008 | Add cross-config consistency vitest test | 15 min |
| F-009 | Update README validation section to advisor package test path | 5 min |

**Total estimated effort**: ~70 minutes (1 packet, 9 P2 items).

---

## What Worked Well

1. **Atomic rename**: The launcher, server, configs, and consumers moved together cleanly.
2. **ADR discipline**: All four boundary decisions (server id, folder, tool ids, state file) were explicitly documented and followed.
3. **Sweep completeness**: Two commits achieved zero stale references across 50 files.
4. **Parent continuity**: Child 015 correctly registered as active in parent metadata.
5. **Verification rigor**: Typechecks, launcher smoke, MCP list, and grep all passed.

---

## Release Readiness

| Gate | Status |
|------|--------|
| P0 findings | 0 — CLEAR |
| P1 findings | 0 — CLEAR |
| P2 advisories | 9 — documented, non-blocking |
| Verification complete | Yes — all checks in implementation-summary.md passed |
| Rollback documented | Yes — plan.md §7 |
| Commit on main | Yes — no branches, no force push |

**Recommendation**: Ship as-is. P2 advisories can be addressed in a follow-on cleanup packet.
