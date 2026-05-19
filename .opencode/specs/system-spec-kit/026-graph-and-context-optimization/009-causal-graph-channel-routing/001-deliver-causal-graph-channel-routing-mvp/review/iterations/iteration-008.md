# Iteration 8 — Traceability Replay

**Date**: 2026-05-11
**Dimension**: traceability
**Mode**: review
**Run**: run-001

---

## Dimension

Traceability Replay — deep-audit of resource-map coverage, feature catalog content, playbook capability claims, spec-vs-implementation cross-reference, checklist evidence, and open-question resolution.

---

## Files Reviewed

| File | Lines | Purpose |
|------|-------|---------|
| `resource-map.md` | 1-85 | Resource map path catalog — existence verification of 18 entries |
| `spec.md` | 1-234 | Feature spec — scope, requirements, open questions |
| `checklist.md` | 1-166 | Verification checklist — CHK evidence review |
| `implementation-summary.md` | 1-152 | Completion narrative — answered_questions, verification table, file list |
| `query-router.ts` | 1-396 | Core routing logic — shouldPreserveGraph, routeQuery, feature flag |
| `entity-density.ts` | 1-172 | Entity-density cache — build/index/lookup |
| `routing-telemetry.ts` | 1-93 | Telemetry ring buffer |
| `memory-crud-health.ts` | 620-678 | Handler — data.routing block |
| `feature_catalog/12--query-intelligence/12-graph-channel-preservation.md` | 1-79 | Feature catalog — traceability table, source files, overview |
| `feature_catalog/03--discovery/03-health-diagnostics-memoryhealth.md` | 1-62 | Feature catalog — health diagnostics entry |
| `playbook/14--pipeline-architecture/272-routing-telemetry-and-graph-channel-invocation.md` | 1-88 | Manual test playbook — scenario contract |
| `scratch/live-smoke-results.md` | 1-120 | Live smoke evidence |
| `scratch/stress-test-results.md` | 1-129 | Stress test evidence |

---

## Findings by Severity

### P2 Findings

#### P2-TR-001 [P2] Implementation-summary internal test-count inconsistency
- **File**: `implementation-summary.md:87,124`
- **Evidence**: The "Files Changed" table (line 87) says query-router.vitest.ts was modified to "Add 27 tests covering shouldPreserveGraph, integration, telemetry, latency." The "Verification" table (line 124) says "PASS — 48 tests (33 pre-existing + 15 new for 012-T1..T4)." 27 ≠ 15. Additionally, the full vitest regression row (line 130) says "25 new tests added" — a third number that doesn't match either.
- **Finding class**: instance-only
- **Scope proof**: These three lines within implementation-summary.md reference the same test file but cite different test counts. 48-33=15, not 27. The "25 new tests added" on line 130 may include entity-density tests (12) but 15+12=27 not 25, and 27+12=39 not 25.
- **Recommendation**: Reconcile to a single accurate count. The actual number of 012-labeled tests added: 15 in query-router.vitest.ts (012-T1..T4) + 12 in entity-density.vitest.ts (012-ED-1..ED-3) + 11 in routing-telemetry-stress.vitest.ts (012-S1..S4) = 38. Update line 87 to match.

#### P2-TR-002 [P2] Resource-map omits scratch evidence files
- **File**: `resource-map.md:59-74`
- **Evidence**: `scratch/live-smoke-results.md` and `scratch/stress-test-results.md` exist on disk and are cited in implementation-summary.md (lines 132-133) as verification evidence. Neither appears in the resource-map Specs table. The table lists `scratch/baseline.md` and `scratch/post-change.md` but omits these two post-implementation evidence files.
- **Finding class**: instance-only
- **Scope proof**: Grep for `live-smoke-results` and `stress-test-results` in resource-map.md returns zero matches.
- **Recommendation**: Add both scratch evidence files to the resource-map Specs table, or add a note explaining they are ephemeral artifacts outside the formal catalog.

#### P2-TR-003 [P2] Stale line reference in live-smoke-results.md
- **File**: `scratch/live-smoke-results.md:80`
- **Evidence**: Line 80 cites `query-router.ts:167-189` for the `shouldPreserveGraph` function. The actual function is at lines 183-205. The code sample in the file is correct, but the file:line citation in the surrounding text is stale.
- **Finding class**: instance-only
- **Scope proof**: Direct comparison of live-smoke-results.md line 80 vs query-router.ts lines 183-205.
- **Recommendation**: Update the citation to `query-router.ts:183-205`.

#### P2-TR-004 [P2] Feature catalog validation table omits stress test file
- **File**: `feature_catalog/12--query-intelligence/12-graph-channel-preservation.md:50-53`
- **Evidence**: The "Validation And Tests" table lists `query-router.vitest.ts` and `entity-density.vitest.ts` but omits `routing-telemetry-stress.vitest.ts`, which contains 11 stress tests (012-S1..S4) created by this packet. Implementation-summary.md lines 89 and 133 confirm this file was created.
- **Finding class**: instance-only
- **Scope proof**: Grep for `routing-telemetry-stress` in the feature catalog file returns zero matches.
- **Recommendation**: Add `mcp_server/tests/routing-telemetry-stress.vitest.ts` to the Validation And Tests table with focus "012-S1..S4: ring overflow, latency burst, cache invalidation, flag toggle".

#### P2-TR-005 [P2] Resource-map summary count mismatch
- **File**: `resource-map.md:29`
- **Evidence**: The summary claims "Total references: 18" and "Skills=8, Specs=10." The Skills table (lines 44-54) lists 9 entries. The Specs table (lines 62-73) lists 10 entries. 9+10=19, not 18. The "Skills=8" count is one short of the 9 listed rows.
- **Finding class**: instance-only
- **Scope proof**: Direct count of table rows vs summary line 29.
- **Recommendation**: Update summary to "Skills=9" and "Total references: 19", or remove the playbook entry if it was intentionally excluded from the count.

#### P2-TR-006 [P2] Spec §9 Q2 only partially answered in implementation-summary
- **File**: `spec.md:229-230`, `implementation-summary.md:32-37`
- **Evidence**: Spec §9 question 2 asks: "What is the target graph_channel_invocation_rate band for healthy utilization? Initial baseline pass needed before declaring a number; SC-001 ≥0.30 is a placeholder." The implementation-summary answered_questions (line 35) says "Live SC-001 ≥ 0.30? — YES; live rate 0.714 (21 prior) and 0.625 (40 post-scenario-1); both above threshold." This confirms the placeholder was met but does NOT establish a sustained healthy-utilization band as the question asks. The question is about long-term operational bands, not a one-time check.
- **Finding class**: instance-only
- **Scope proof**: Direct comparison of spec §9 Q2 wording vs implementation-summary answer wording. The answer addresses "did we meet the placeholder?" but not "what band constitutes healthy utilization going forward?"
- **Recommendation**: Either add a note stating the long-term band question remains open (deferred to post-baseline observation), or declare a provisional band based on the observed rates (e.g., 0.55-0.75).

#### P2-TR-007 [P2] Checklist CHK-052 evidence omits stress test file from modified-files enumeration
- **File**: `checklist.md:142`
- **Evidence**: CHK-052 [P1] claims "No changes outside the declared scope in spec.md 'Files to Change' table." The evidence lists "only modified files: query-router.ts, entity-density.ts (new), routing-telemetry.ts (new), memory-crud-health.ts, query-router.vitest.ts, entity-density.vitest.ts (new)." This omits `routing-telemetry-stress.vitest.ts` (created, 11 tests) which is a new test file created by this packet. While the omission may be editorial (test files generally don't violate the scope constraint), the evidence enumeration is incomplete, weakening the checklist item's verifiability.
- **Finding class**: instance-only
- **Scope proof**: Compare checklist line 142 enumeration against actual files listed in implementation-summary.md lines 80-91. The stress test file appears in implementation-summary line 89 but not in checklist CHK-052 evidence.
- **Recommendation**: Append `routing-telemetry-stress.vitest.ts (new)` to the CHK-052 evidence enumeration for completeness.

---

## Prior Finding Confirmations

The following prior findings were confirmed during this traceability pass with additional evidence noted:

- **P1-002** (Resource-map playbook path wrong): Confirmed. The resource-map line 54 references `210-routing-telemetry-and-graph-channel-invocation.md` which does NOT exist on disk. The actual file is at `272-routing-telemetry-and-graph-channel-invocation.md`. The resource-map also claims Status "OK" for this path, which is incorrect — the file at path 210 is MISSING.
- **P2-015** (routing-telemetry-stress.vitest.ts not in resource-map): Confirmed. Thorough grep of resource-map.md returns zero matches for this file.
- **P2-016** (Feature catalog traceability line numbers stale): Confirmed. Two additional specific instances documented: (a) line 62 cites `query-router.ts:routeQuery:233-249` for the override but those lines are in `buildQualityGapFallbackPlan`, not the override. (b) line 65 cites `memory-crud-health.ts:624-650` for the `data.routing` block but the actual keys are at lines 662-667, outside the claimed range.

---

## Traceability Checks

### Resource-Map Coverage
| Check | Result |
|-------|--------|
| All 18 listed paths verified on disk | 17/18 OK; 1 MISSING: playbook at path 210 (P1-002) |
| All files modified by packet listed in resource-map | PARTIAL — `routing-telemetry-stress.vitest.ts` missing (P2-015), `scratch/live-smoke-results.md` missing (P2-TR-002), `scratch/stress-test-results.md` missing (P2-TR-002) |
| Resource-map summary counts accurate | FAIL — Skills=8 but 9 entries; total=18 but 19 (P2-TR-005) |

### Overlay: Feature Catalog Content
| Check | Result |
|-------|--------|
| Feature catalog traceability table line numbers correct | FAIL — 6 of 8 entries have stale or wrong line ranges (P2-016, confirmed this pass at lines 62, 65) |
| Feature catalog "Validation And Tests" table complete | FAIL — omits routing-telemetry-stress.vitest.ts (P2-TR-004) |
| Feature catalog "Implementation" table complete | PASS — all 5 implementation files listed |
| Feature catalog overview matches delivered behavior | PASS — intent gate + entity-density gate descriptions accurate |

### Overlay: Playbook Capability
| Check | Result |
|-------|--------|
| Playbook scenario contract matches delivered behavior | PASS with advisory — expected graph rate 0.6 vs observed 0.4 (P2-014 already reported) |
| Playbook pass/fail criteria achievable | PASS — all criteria verifiable with correct query mix |
| Playbook source file links valid | PASS — links resolve to existing files |

### Spec vs Implementation
| Check | Result |
|-------|--------|
| All 8 requirements (REQ-001..REQ-008) trace to code | PASS — each maps to a specific code path |
| Spec "Files to Change" table matches actual modified files | PASS — 7 declared; scratch files and stress tests are test/docs additions, not core code |
| Spec claims not overpromising vs implementation | PASS — all documented behavior is delivered |
| Spec §7 NFR performance claim (<5ms p99) verified | PASS — microbenchmark + stress test confirm |

### Checklist Evidence
| Check | Result |
|-------|--------|
| All CHK items marked [x] have concrete evidence | PASS with advisory — CHK-052 evidence enumeration incomplete (P2-TR-007) |
| CHK-011 (no console output) verified | PASS — no console calls in entity-density.ts, query-router.ts additions, or routing-telemetry.ts |
| CHK-026 (0 regressions) internally consistent | PASS — numbers provided, though test count varies across docs (P2-TR-001) |
| CHK-052 (scope locked) claim verifiable | PASS — actual code changes within declared scope; evidence list just incomplete |

### Open Questions Resolution
| Spec §9 Q# | Question | Answered in impl-summary? | Status |
|------------|----------|---------------------------|--------|
| Q1 | Graph channel for intent=understand on entity-rich? | YES — "via entity-density gate" | ANSWERED |
| Q2 | Target rate band for healthy utilization? | PARTIAL — confirms SC-001 ≥0.30 met, no band established | PARTIAL (P2-TR-006) |
| Q3 | Degree always pair with graph? | YES — "only on entity-density activation" | ANSWERED |

---

## Verdict

**CONDITIONAL (hasAdvisories=true)**

No new P0 or P1 findings. Seven P2 documentation traceability findings identified, all non-blocking. The core traceability chain (spec → code → test → evidence) is intact — all 8 requirements trace to implemented code with passing tests. The documented gaps are editorial (stale line numbers, incomplete file listings, count mismatches) rather than functional. The resource-map has one known broken path (P1-002) and several missing entries.

The conditional verdict reflects that P1-002 (resource-map playbook path) and P2-016 (stale traceability line numbers) remain unresolved from prior iterations — both are P1/P2 traceability issues that prevent a clean PASS on this dimension.

---

## Next Dimension

All four dimensions (correctness, security, traceability, maintainability) have been covered in this review cycle. If additional iterations remain in the configured 10-iteration budget, consider:
- **completeness** (close-out pass): verify that all prior P1 findings have been addressed or deferred with owner assignment
- **maintainability** (replay): validate any fixes applied for prior findings

---

## Graph Events

- Node: dimension_traceability_complete — traceability dimension full pass with advisories
- Edge: COVERS → traceability overlay protocols (feature_catalog_code, playbook_capability)
- Edge: CONFIRMS → P2-016 (feature catalog traceability table stale lines)
- Edge: CONFIRMS → P2-015 (stress test not in resource-map)
