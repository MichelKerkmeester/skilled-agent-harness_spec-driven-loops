# Deep Review Report - gpt-3 Lineage

## Executive Summary
- **Verdict:** PASS
- **hasAdvisories:** true
- **Scope:** daemon CLI front-door UX hardening spec folder and referenced implementation surfaces.
- **Iterations:** 6 of 6
- **Active findings:** P0=0, P1=0, P2=2
- **Stop reason:** converged after all dimensions and required protocols were covered with no P0/P1 findings.

## Planning Trigger
No remediation plan is required for release-blocking issues because there are no active P0/P1 findings. Optional planning can address the two P2 advisories if the owner wants the implementation summaries and bridge policy tightened.

## Active Finding Registry
| ID | Severity | Dimension | Title | Evidence | Status |
| --- | --- | --- | --- | --- | --- |
| F001 | P2 | correctness | Code-index and skill-advisor hash gates lack build-time fingerprint persistence | `.opencode/bin/code-index.cjs:51-78`; `.opencode/bin/skill-advisor.cjs:72-95`; `.opencode/skills/system-code-graph/package.json:7`; `.opencode/skills/system-skill-advisor/mcp_server/package.json:7-9`; `.opencode/skills/system-spec-kit/mcp_server/scripts/finalize-dist.mjs:68-82` | active |
| F002 | P2 | maintainability | Spec-memory bridge allowlist permits cross-paired request/tool combinations | `.opencode/skills/system-spec-kit/mcp_server/plugin_bridges/mk-spec-memory-bridge.mjs:18-19`; `.opencode/skills/system-spec-kit/mcp_server/plugin_bridges/mk-spec-memory-bridge.mjs:347-356`; `.opencode/skills/system-spec-kit/mcp_server/tests/spec-memory-bridge-allowlist.vitest.ts:21-47` | active |

## Remediation Workstreams
| Workstream | Findings | Suggested Action |
| --- | --- | --- |
| Freshness metadata parity | F001 | Add build-time source-hash finalizers for code-index and skill-advisor, or narrow the docs/summary claim to spec-memory-only freshness hardening. |
| Bridge policy exactness | F002 | Replace independent request/tool set membership with exact allowed pairs and add negative tests for `status+session_resume` and `brief+memory_health`. |

## Spec Seed
- If accepting F001, amend 001 docs to say only spec-memory has build-time freshness metadata, while code-index and skill-advisor use runtime hash caching.
- If fixing F001, add acceptance text requiring build-time source-hash metadata for all three shims.
- If fixing F002, add acceptance text requiring exact prompt-time request-to-tool pair allowlisting.

## Plan Seed
1. For F001, implement code-index and skill-advisor finalizer scripts or package `postbuild` steps that write `.code-index-cli-source-hash.json` and `.skill-advisor-cli-source-hash.json` from the watched sources.
2. For F002, change `promptSafeSpecMemoryBridgePolicy` to compare against a map such as `{ brief: session_resume, status: memory_health }`.
3. Add focused tests for first-run-after-build freshness metadata and cross-paired bridge policy rejection.

## Traceability Status
| Protocol | Gate | Status | Evidence | Notes |
| --- | --- | --- | --- | --- |
| spec_code | hard | partial | `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/016-cli-tooling-ux/001-cli-freshness-and-smoke/implementation-summary.md:54`; `.opencode/skills/system-code-graph/package.json:7` | Advisory partial only; no P0/P1 mismatch. |
| checklist_evidence | hard | pass | child implementation summaries lines with verification tables | Level 1 children use implementation summaries rather than checklist files. |
| feature_catalog_code | advisory | pass | `.opencode/skills/system-spec-kit/references/cli/daemon_cli_reference.md:14-18` | 37/8/9 surfaces documented. |
| playbook_capability | advisory | pass | `.opencode/skills/system-spec-kit/references/cli/daemon_cli_reference.md:115-121` | Smoke path documented; not executed in this lineage to avoid out-of-scope writes. |

## Deferred Items
- F001 and F002 are advisories. They do not block the CLI UX hardening release posture.
- Code graph readiness was stale, so structural graph queries were not used as primary evidence.
- Full build/test commands were not executed by this lineage because the user constrained writes to the lineage artifact directory.

## Audit Appendix
| Iteration | Dimension | New P0 | New P1 | New P2 | Ratio | Outcome |
| ---: | --- | ---: | ---: | ---: | ---: | --- |
| 1 | correctness | 0 | 0 | 1 | 1.00 | PASS |
| 2 | security | 0 | 0 | 0 | 0.00 | PASS |
| 3 | traceability | 0 | 0 | 0 | 0.00 | PASS |
| 4 | maintainability | 0 | 0 | 1 | 1.00 | PASS |
| 5 | stabilization | 0 | 0 | 0 | 0.00 | PASS |
| 6 | final replay | 0 | 0 | 0 | 0.00 | PASS |

Replay validation: JSONL parsed successfully, iteration files end with canonical verdict lines, and registry counts match synthesis counts.

Graphless fallback: code graph status was stale (`git HEAD changed`, 882 stale files). Evidence came from direct file reads and exact text search.
