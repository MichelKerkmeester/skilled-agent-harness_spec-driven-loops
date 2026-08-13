# Improving the Packet-039 Pi Forks — Research Synthesis (Grok Lineage)

## Verdict

Prioritize **ownership coherence and regression gates (P0)** before economics or UX polish. The two forks are already correctly split for today's DeepSeek V4 flash/pro ids, but the allowlists are duplicated, optimizer DeepPi-owned early-returns are only predicate-tested, and deep-pi's economics remain session-ephemeral and hard to observe headlessly. Closing those gaps yields the highest confidence for any later model-id expansion or cost claims.

This synthesis completed all 6 required iterations under `stopPolicy: max-iterations`. Convergence scores declined (0.95→0.55) as telemetry only; the loop did not stop early.

## Scope Reviewed

| Fork | Path | Sibling packet |
|------|------|----------------|
| pi-cache-optimizer (DeepSeek-guard) | `.pi/extensions/pi-cache-optimizer/` | `003-fork-and-guard-cache-optimizer` |
| deep-pi (hardened DeepSeek-direct) | `.pi/extensions/deep-pi/` | `006-fork-and-improve-deep-pi` |

## Known Open Limitations (baselines — not rediscovered)

1. `/deeppi` full report still does not surface non-interactively (`ctx.ui.notify` only; RPC confirms status-level channel, not full body). [SOURCE: .pi/extensions/deep-pi/extensions/deeppi.ts:64-81] [SOURCE: specs/.../006/.../003-live-verification-and-closeout/implementation-summary.md:122-124]
2. deep-pi keeps no persistent stats file (unlike `pi-cache-optimizer-stats.json`). [SOURCE: .pi/extensions/deep-pi/extensions/deeppi/telemetry.ts:38-45] [SOURCE: .pi/extensions/pi-cache-optimizer/index.ts:96-97]
3. Live regression for `opencode/deepseek-v4-flash-free` remains credential-blocked / substituted. [SOURCE: specs/.../006/.../003-live-verification-and-closeout/implementation-summary.md:56,123]
4. Optimizer cold-start cache-write behavior for newly-added models remains uncharacterized. [SOURCE: research brief; .pi/extensions/pi-cache-optimizer/index.ts:3645-3668]

## Improvement Backlog

### P0 — Prevent silent ownership skew

| ID | Improvement | Evidence |
|----|-------------|----------|
| P0-1 | Shared constant or CI parity test so `isDeepPiOwned` ≡ `DEEPPI_MODEL_IDS` | [SOURCE: .pi/extensions/pi-cache-optimizer/index.ts:1279-1281] [SOURCE: .pi/extensions/deep-pi/extensions/deeppi/eligibility.ts:1-18] |
| P0-2 | Hook-level early-return tests for all six guarded optimizer hooks | [SOURCE: .pi/extensions/pi-cache-optimizer/tests/review-findings.test.ts:73-80] |
| P0-3 | Cross-extension composition test (both packages loaded; mutual exclusion) | [SOURCE: specs/.../006/.../003-live-verification-and-closeout/implementation-summary.md:52] |

### P1 — Observability and economics

| ID | Improvement | Addresses |
|----|-------------|-----------|
| P1-1 | Persist deep-pi telemetry (session/total JSON, model keys) | K2 |
| P1-2 | Headless/RPC-safe report export (file and/or structured JSON event) | K1 |
| P1-3 | Net savings after cache-write cost; warm-up window; new-model write-spike characterization | K4; [SOURCE: .pi/extensions/deep-pi/extensions/deeppi/telemetry.ts:60-67] |
| P1-4 | Footer anomaly badges for `costMathErrors` / `usageUnavailable` / `transformErrors` | [SOURCE: .pi/extensions/deep-pi/extensions/deeppi/telemetry.ts:75-78] |

### P2 — Maintainability and live hygiene

| ID | Improvement | Evidence |
|----|-------------|----------|
| P2-1 | Upstream-delta / vendor-base checks; treat GitHub optimizer fork as provenance-only | [SOURCE: specs/.../003/.../implementation-summary.md:140-143] |
| P2-2 | Credential-gated live harness for K3 (explicit skip vs silent substitute) | [SOURCE: K3] |
| P2-3 | Extract optimizer ownership helpers; dual-package verify script; optional machine-readable ownership policy | [SOURCE: iter 5] |
| P2-4 | Optimizer handoff visibility when DeepPi-owned guard fires | [SOURCE: .pi/extensions/pi-cache-optimizer/index.ts:7279-7304] |
| P2-5 | Dedicated 400-retry path test for guarded `after_provider_response` | [SOURCE: specs/.../003/.../implementation-summary.md:141] |

## Angle Summaries

### Correctness

Predicates currently agree on flash/pro, but dual definitions plus asymmetric drift signaling (deep-pi warns; optimizer does not) create a future orphan-route failure mode when DeepSeek ships a new direct id. `session_shutdown` remains intentionally unguarded; model-transition flush edge cases deserve a test, not a redesign. [SOURCE: iterations/iteration-001.md]

### Test coverage

deep-pi's vitest suite is strong at module/integration level. Optimizer guard coverage is the weak link (predicate-only). Missing composition and allowlist-parity tests leave the dual-extension contract documentation-borne. [SOURCE: iterations/iteration-002.md]

### Telemetry / observability

Persist deep-pi stats; export full reports for headless/RPC; surface error counters in the footer; optionally mark optimizer handoff. Do not treat RPC status visibility as closing K1. [SOURCE: iterations/iteration-003.md]

### Cost-economics

Subtract/show cache-write cost in savings; separate "no usage yet" from write-dominated warm-up; characterize new-model write spikes in the optimizer (K4). Keep disclaiming universal savings. [SOURCE: iterations/iteration-004.md]

### Maintainability

Vendored copies are operational sources of truth; upstream remotes and a non-operational GitHub optimizer fork create drift tax. Heterogeneous verify tooling and a monolith optimizer entrypoint raise change cost. [SOURCE: iterations/iteration-005.md]

## Recommended Sequencing

1. P0-1 → P0-2 → P0-3 (coherence + gates)
2. P1-1 + P1-2 + P1-3 together (shared measurement plumbing)
3. P1-4 and P2 items in parallel as hygiene

## Explicit Non-Goals (this research)

- Implementing patches in either fork during the research loop
- Re-opening the narrow `provider === "deepseek"` ownership predicate to blanket DeepSeek-like exclusion
- Upstream merge-back as a blocker for local improvements

## Convergence Report

| Field | Value |
|-------|-------|
| Stop reason | `max_iterations` |
| Iterations completed | 6 / 6 |
| newInfoRatio trend | 0.95 → 0.88 → 0.82 → 0.78 → 0.72 → 0.55 |
| Questions answered | 5 / 5 key strategy questions addressed with backlog items |
| Quality note | Source diversity across both forks + sibling specs; focus aligned each iteration |

## Source Notes

Primary evidence is the vendored fork source under `.pi/extensions/` and completed sibling packets 003/006. Known limitations K1–K4 were treated as baselines to build remediations upon, not as novel discoveries.
