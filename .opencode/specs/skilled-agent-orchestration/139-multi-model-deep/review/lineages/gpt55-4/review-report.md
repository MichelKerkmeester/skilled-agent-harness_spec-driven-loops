# Deep Review Report: gpt55-4

## Executive Summary

Verdict: **CONDITIONAL**. This lineage reviewed recent daemon-reliability and hook-portability work and found one active P1 correctness issue plus one active P2 advisory. No P0 blockers were confirmed.

| Field | Value |
|-------|-------|
| Stop reason | maxIterationsReached |
| Iterations | 1 |
| Active P0 | 0 |
| Active P1 | 1 |
| Active P2 | 1 |
| hasAdvisories | true |
| Release readiness | in-progress |

## Planning Trigger

Route to remediation planning for F001. The finding is not a proven live data-corruption reproduction, but it directly contradicts the single-writer safety intent for crash/stale-owner recovery and is missing a regression test.

## Active Finding Registry

| ID | Severity | Dimension | Title | Evidence | Status |
|----|----------|-----------|-------|----------|--------|
| F001 | P1 | correctness | Stale owner-lease reclaim is not an atomic claim | `.opencode/bin/mk-spec-memory-launcher.cjs:443-480`; `.opencode/bin/mk-spec-memory-launcher.cjs:1476-1502`; `.opencode/bin/mk-spec-memory-launcher.cjs:1507-1529`; `.opencode/skills/system-spec-kit/mcp_server/tests/launcher-lease.vitest.ts:287-311` | active |
| F002 | P2 | security | Live adoption test interpolates temp paths into shell commands | `.opencode/skills/system-spec-kit/mcp_server/stress_test/durability/daemon-reelection-adoption-live.vitest.ts:50-62`; `.opencode/skills/system-spec-kit/mcp_server/stress_test/durability/daemon-reelection-adoption-live.vitest.ts:69-88` | active |

## Remediation Workstreams

| Workstream | Findings | Action |
|------------|----------|--------|
| Owner-lease atomicity | F001 | Make stale owner-lease takeover atomic with rename/exclusive create or hold an exclusive respawn lock across stale owner takeover, child reap, PID lease write, and launch. Add a two-fresh-launcher stale-owner regression. |
| Test command hardening | F002 | Replace shell-interpolated `execSync` calls with argument-array process APIs or shell-escaped paths. |

## Spec Seed

- Add a requirement to the daemon reliability follow-up spec: stale owner-lease recovery must be single-writer safe under two concurrent fresh launchers after owner crash/SIGKILL.
- Add acceptance criteria: a regression test plants or creates a stale owner lease and verifies exactly one launcher reaches daemon launch / sqlite writer ownership.

## Plan Seed

1. Reproduce the stale-owner race in a controlled launcher test by planting a stale owner lease plus stale PID lease, then starting two fresh launchers concurrently.
2. Implement atomic stale owner-lease takeover using a claim-by-rename pattern or a shared respawn lock.
3. Keep the normal release path behavior unchanged: normal SIGTERM disposal clears the owner lease while leaving the daemon lease available for live secondary adoption.
4. Harden the live adoption test shell calls with argument-array process APIs.
5. Run launcher lease tests and the live adoption durability test.

## Traceability Status

| Protocol | Status | Gate | Notes |
|----------|--------|------|-------|
| spec_code | partial | hard | Packets 138 and 028 identify concrete implementation files; packet 139 is scaffold-only and did not provide review scope. |
| checklist_evidence | partial | hard | Packet 139 checklist is scaffold/unverified, so this lineage cannot claim packet completion. |
| feature_catalog_code | not-run | advisory | Max iteration cap reached before catalog pass. |
| playbook_capability | not-run | advisory | Max iteration cap reached before playbook pass. |

## Deferred Items

- Maintainability pass over launcher lease code after the atomicity fix.
- Catalog/playbook consistency pass for daemon re-election default-on and reap-before-respawn docs.
- Optional cleanup: replace generated runtime owner-file absolute-path grep noise with a scoped hook-config verification script.

## Audit Appendix

| Item | Result |
|------|--------|
| Config parsed | PASS |
| Iteration file created | PASS |
| JSONL records emitted | PASS |
| Claim adjudication | PASS for F001 |
| Convergence replay | STOP due to maxIterationsReached |
| Full dimension coverage | FAIL, 2 of 4 dimensions covered |
| Resource map | Not present at init, coverage gate skipped |

Reviewed files were read-only. All lineage writes stayed inside `.opencode/specs/skilled-agent-orchestration/139-multi-model-deep/review/lineages/gpt55-4`.
