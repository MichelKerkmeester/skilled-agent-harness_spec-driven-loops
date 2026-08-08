# Iteration 006 — Known open limitations → prioritized backlog

## Focus

Convert known open limitations plus iterations 1–5 into a single prioritized, evidence-based improvement backlog for both forks (without rediscovering the known gaps as primary claims).

## Actions Taken

- Re-read the four known open limitations from the research brief / 006 closeout
- Cross-walked each against remediation ideas from iterations 1–5
- Prioritized by (blast radius × evidence strength × effort)

## Known limitations (accepted baselines)

| # | Limitation | Status in this lineage |
|---|------------|------------------------|
| K1 | `/deeppi` full report not surfaced non-interactively even via `pi --mode rpc` | Confirmed still true in source (`ctx.ui.notify` only); remediation shapes in iter 3 |
| K2 | deep-pi keeps no persistent stats file | Confirmed; remediation in iter 3 |
| K3 | One live regression (`opencode/deepseek-v4-flash-free`) blocked by missing opencode credential | Confirmed as environmental substitute; harness idea in iter 2 |
| K4 | pi-cache-optimizer cold-start cache-write for newly-added models uncharacterized | Confirmed still unaddressed; measurement plan in iter 4 |

[SOURCE: specs/.../006-fork-and-improve-deep-pi/003-live-verification-and-closeout/implementation-summary.md:122-124] [SOURCE: research brief]

## Prioritized improvement backlog

### P0 — Prevent silent ownership skew

1. **Shared or parity-tested DeepPi-owned model allowlist** across both forks (+ CI test). Prevents orphan routes when DeepSeek ships a new id. [SOURCE: iter 1, 2, 5]
2. **Hook-level early-return tests** for all six guarded optimizer hooks on DeepSeek-direct models. [SOURCE: iter 2]
3. **Cross-extension composition test** (both packages loaded; mutual exclusion assertions). [SOURCE: iter 2]

### P1 — Close observability & economics blind spots

4. **Persist deep-pi telemetry** to a versioned stats file (session/total), modeled after optimizer persistence. Addresses K2. [SOURCE: iter 3]
5. **Headless/RPC-safe `/deeppi` report export** (file write and/or structured JSON event). Addresses K1 without pretending RPC status already solved it. [SOURCE: iter 3]
6. **Net savings + cold-start metrics**: subtract/show cache-write cost; define warm-up window; characterize new-model write spikes in optimizer (K4). [SOURCE: iter 4]
7. **Footer anomaly badges** for `costMathErrors` / `usageUnavailable` / `transformErrors`. [SOURCE: iter 3]

### P2 — Maintainability & live-harness hygiene

8. **Upstream-delta / vendor-base check scripts** for both forks; clarify GitHub fork as provenance-only. [SOURCE: iter 5; 003 limitations]
9. **Credential-gated live harness** for K3 so missing `opencode` key is an explicit skip, not a silent substitute. [SOURCE: iter 2; K3]
10. **Extract optimizer ownership helpers** from monolith `index.ts`; unified dual-package verify script; optional machine-readable ownership policy. [SOURCE: iter 5]
11. **Optimizer handoff visibility** when `isDeepPiOwned` fires (once per model/session). [SOURCE: iter 3]
12. **Dedicated 400-retry path test** for guarded `after_provider_response` (003 limitation #2). [SOURCE: iter 2]

## Sequencing recommendation

Ship P0 before any economics claims or new model ids. Then P1 items 4–6 together (persistence + export + cold-start) because they share measurement infrastructure. P2 can proceed in parallel as hygiene.

## Questions Answered

- All five strategy key questions now have evidence-backed improvement candidates.
- Known limitations K1–K4 mapped to concrete backlog items rather than rediscovered as novel defects.

## Ruled Out

- Implementing fixes inside this research lineage (research-only contract).
- Treating convergence as a stop (stopPolicy remains max-iterations; this is the final planned iteration).

## Next Focus

phase_synthesis — compile `research.md`, dashboard, and findings registry.

## Assessment

Backlog consolidates novelty from prior iterations; newInfoRatio moderate (synthesis of angles, plus explicit prioritization). Max iterations reached after this record.
