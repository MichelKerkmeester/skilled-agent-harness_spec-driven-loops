# Deep Review Report

## Executive Summary
Verdict: CONDITIONAL

The review completed all four dimensions and ran to the configured maximum of six iterations. No P0 findings were identified. One active P1 finding remains: code-index and skill-advisor use content-hash freshness gates but their build scripts do not persist the hash state the way spec-memory does. Two P2 advisories remain for prompt-safe bridge route-pair exactness and stale playbook documentation.

| Field | Value |
| --- | --- |
| Active P0 | 0 |
| Active P1 | 1 |
| Active P2 | 2 |
| hasAdvisories | true |
| Stop reason | `maxIterationsReached` |
| Release readiness | `in-progress` |

## Planning Trigger
The result routes to remediation planning because F001 is a P1 correctness finding. Fixing F001 should make the final verdict eligible for PASS after replay, assuming no new P0/P1 findings appear.

## Active Finding Registry
| ID | Severity | Dimension | Title | Evidence | Status |
| --- | --- | --- | --- | --- | --- |
| F001 | P1 | correctness | code-index and skill-advisor freshness hashes are not written by their build scripts | `.opencode/bin/code-index.cjs:60-78`; `.opencode/bin/skill-advisor.cjs:81-95`; `.opencode/skills/system-code-graph/package.json:6-8`; `.opencode/skills/system-skill-advisor/mcp_server/package.json:6-10` | active |
| F002 | P2 | security | spec-memory bridge allowlist validates requests and tools independently instead of allowed route pairs | `.opencode/skills/system-spec-kit/mcp_server/plugin_bridges/mk-spec-memory-bridge.mjs:18-19`; `:221-227`; `:347-356` | active |
| F003 | P2 | traceability | CLI parity playbook was not redirected to the unified offline smoke check | `001-cli-freshness-and-smoke/spec.md:89-96`; `implementation-summary.md:54-58`; `manual_testing_playbook/tooling-and-scripts/cli-list-tools-parity.md:32-50` | active |

## Remediation Workstreams
| Workstream | Findings | Action |
| --- | --- | --- |
| Build-hash parity | F001 | Add build-finalization hash writing for code-index and skill-advisor, or otherwise ensure normal builds persist the hash state their shims consume. |
| Prompt-safe bridge exactness | F002 | Validate exact allowed pairs: `brief -> session_resume` and `status -> memory_health`. |
| Documentation sync | F003 | Replace the old parity playbook command block with the unified `cli-offline-smoke.cjs` command and keep parity suites as supplemental evidence. |

## Spec Seed
- Add acceptance coverage requiring all three CLI packages to initialize source-hash freshness metadata during build, not only after a successful shim run.
- Add an explicit route-pair allowlist requirement for the spec-memory bridge.
- Add a documentation acceptance criterion that the parity playbook names the unified smoke command as the primary scenario.

## Plan Seed
1. Implement hash-state finalizers for `system-code-graph` and `system-skill-advisor` builds, mirroring `system-spec-kit/mcp_server/scripts/finalize-dist.mjs`.
2. Add tests that delete the hash file, run the package build, touch a watched source without content change, and verify `list-tools` does not exit `69`.
3. Tighten `promptSafeSpecMemoryBridgePolicy()` to validate request/tool pairs.
4. Update `cli-list-tools-parity.md` to make `node .opencode/bin/cli-offline-smoke.cjs --format json` the primary command.

## Traceability Status
| Protocol | Status | Notes |
| --- | --- | --- |
| spec_code | partial | F003 documents a scoped file target that remains stale. |
| checklist_evidence | partial | Implementation summary claims smoke wraps the playbook, but the playbook still shows old commands. |
| feature_catalog_code | pass | Compact and names-only paths were found in all three CLI files. |
| playbook_capability | partial | Unified reference is current; legacy playbook is not. |

## Deferred Items
- F002 is advisory because the current bridge still restricts direct calls to prompt-safe read tools.
- F003 is advisory because the unified smoke command exists and is documented in the canonical reference.
- Live smoke/tests were not run in this lineage to avoid writing outside the requested artifact root.

## Audit Appendix
| Iteration | Focus | Result |
| ---: | --- | --- |
| 1 | correctness | F001 found and adjudicated as P1. |
| 2 | security | F002 found as P2. |
| 3 | traceability | F003 found as P2. |
| 4 | maintainability | No new findings. |
| 5 | traceability stabilization | No new findings. |
| 6 | max-iteration replay | No new findings; max iteration stop. |

Replay validation: JSONL totals reconcile to P0=0, P1=1, P2=2. Every active finding carries file:line evidence. Code graph readiness was stale, so no graph-derived structural claims are included.
