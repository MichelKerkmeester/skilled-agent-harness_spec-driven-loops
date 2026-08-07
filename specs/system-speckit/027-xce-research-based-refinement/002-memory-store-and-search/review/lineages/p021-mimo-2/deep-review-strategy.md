# Deep Review Strategy

## Topic

Review of cooperative heavy phases keep the daemon responsive (spec folder 021-cooperative-heavy-phases). The reindex scan now measures event-loop lag and per-phase wall-clock; the trigger-embedding-backfill transaction is chunked and cancellable; and each un-yielded tail phase refreshes the maintenance marker on entry.

## Completed Dimensions

- [x] D1: Correctness — PASS. 3 P2 advisories (lag drift, missing TTL warning, cache-hit cancel gap). No logic errors, no broken invariants. [iteration 1]

## Review Dimensions

- [ ] D2: Security — Injection, auth bypass, secrets exposure, unsafe deserialization
- [ ] D3: Traceability — Spec/code alignment, checklist evidence, cross-reference integrity
- [ ] D4: Maintainability — Patterns, clarity, documentation quality, ease of safe follow-on changes

## Files Under Review

| File | Coverage | Notes |
|------|----------|-------|
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts` | Pending | Event-loop lag sampler + timedPhase + isCancelled threading |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/trigger-embedding-backfill.ts` | Pending | Chunked phrase sync + isCancelled + cache-hit yield |
| `.opencode/skills/system-spec-kit/mcp_server/tests/trigger-embedding-backfill.vitest.ts` | Pending | Cancel/yield unit tests |
| `spec.md` | Pending | Spec document |
| `plan.md` | Pending | Plan document |
| `tasks.md` | Pending | Task list |
| `implementation-summary.md` | Pending | Implementation summary |

## Cross-Reference Status

### Core (hard-gated)

| Protocol | Status | Notes |
|----------|--------|-------|
| spec_code | pass | All 6 normative claims verified against shipped code [iteration 1] |
| checklist_evidence | skipped | No checklist.md in Level 1 spec folder |

### Overlay (advisory)

| Protocol | Status | Notes |
|----------|--------|-------|
| feature_catalog_code | pass | Lag sampler, chunked backfill, per-phase refresh all verified in code [iteration 1] |

## Known Context

- Spec is Level 1 (< 100 LOC of core logic across 3 files)
- Status: Complete (code); deploy-time lag read pending
- Predecessor: 020-maintenance-grace-background-embedding
- The launcher adopt/reap path was investigated and found correct; no launcher code changed
- Live reindex lag read: max event-loop lag 634ms, no block spikes, slowest phase enrichment-repair 2216ms (slow-but-cooperative)
- resource-map.md not present. Skipping coverage gate.

## Running Findings

| Severity | Active | New This Iteration | Refined |
|----------|--------|--------------------|---------|
| P0 | 0 | 0 | 0 |
| P1 | 0 | 0 | 0 |
| P2 | 3 | 3 | 0 |

## What Worked

- spec_code protocol: all 6 normative claims verified with concrete file:line evidence [iteration 1]
- Adversarial self-check on all P2 findings: no P0/P1 escalation warranted [iteration 1]

## What Failed

(none yet)

## Exhausted Approaches

(none yet)

## Ruled Out Directions

(none yet)

## Next Focus

D1: Correctness — Review the core implementation files for logic errors, edge cases, and correctness of the chunking/yielding pattern.

## Review Boundaries

- Max iterations: 1
- Convergence threshold: 0.10
- Stuck threshold: 2
- Severity threshold: P2
- Target files are READ-ONLY
