# Iteration 003 — Telemetry and observability

## Focus

What telemetry/observability improvements close the stats-file and non-interactive report gaps?

## Actions Taken

- Compared optimizer persistence (`pi-cache-optimizer-stats.json`) with deep-pi session-only `TelemetryState`
- Re-read `/deeppi` command handler and `formatDeepPiReport`
- Built on 006's disclosed RPC/`--print` limitations rather than rediscovering them
- Checked footer vs full-report channels

## Findings

1. **deep-pi still has no durable stats store (known; improvement path clear).** Telemetry lives in process memory and `resetTelemetry` clears it on every `session_start`. Operators cannot compare DeepSeek-direct economics across days the way `pi-cache-optimizer-stats.json` enables for non-DeepSeek routes. Concrete improvement: add a versioned JSON stats file (session + total scopes, model keys `deepseek/deepseek-v4-flash|pro`) mirroring the optimizer's persistence pattern without inventing a second schema language. [SOURCE: .pi/extensions/deep-pi/extensions/deeppi/telemetry.ts:38-45,123-128] [SOURCE: .pi/extensions/pi-cache-optimizer/index.ts:96-97] [SOURCE: specs/cli-external-orchestration/039-pi-caching-like-reasonix/006-fork-and-improve-deep-pi/001-fix-and-test-deep-pi/plan.md:42]

2. **Full `/deeppi` report remains UI-notify-only (known).** Handler calls `ctx.ui.notify(formatDeepPiReport(...), "info")`. 006 confirmed this does not appear in `pi --print` stdout or session `.jsonl`; `pi --mode rpc` exposes status/`notify` channel events but not a confirmed full multi-line report body. Improvements (pick one, measure): (a) also write report to a well-known path under the Pi state dir; (b) register a command that returns/prints plain text for headless capture; (c) emit a structured `extension` log/event with the report fields as JSON for RPC consumers. [SOURCE: .pi/extensions/deep-pi/extensions/deeppi.ts:64-81] [SOURCE: specs/cli-external-orchestration/039-pi-caching-like-reasonix/006-fork-and-improve-deep-pi/003-live-verification-and-closeout/implementation-summary.md:122-124]

3. **Footer is a lossy projection of the report.** `footerText` shows only hit-rate or "warming". Counters that matter for ops (`costMathErrors`, `usageUnavailable`, `transformErrors`, loop/edit stats) are invisible unless `/deeppi` is invoked interactively. Improvement: escalate footer to a compact anomaly badge when any error counter > 0 (e.g. `DeepPi · err:costMath`). [SOURCE: .pi/extensions/deep-pi/extensions/deeppi/telemetry.ts:75-78,94-118]

4. **Optimizer observability is rich but DeepSeek-owned silence is opaque.** When `isDeepPiOwned` early-returns, footer/status updates for that model are skipped; there is no explicit "handed off to deep-pi" marker. Operators debugging dual-extension setups must infer ownership from absent stats entries. Improvement: optional status note or log line when a guard fires (rate-limited once per model/session). [SOURCE: .pi/extensions/pi-cache-optimizer/index.ts:7279-7304]

5. **No joint economics view.** Split ownership means DeepSeek-direct savings live only in deep-pi memory while other providers live in the optimizer stats file. A thin aggregator (read-only) or shared export format would improve fleet-level cost review without merging mutation authority.

## Questions Answered

- Highest-leverage observability improvements: persist deep-pi stats; add a headless/RPC-safe report export; surface error counters in the footer; make optimizer handoff visible.

## Ruled Out

- Treating RPC status-bar visibility as closing the report gap — 006 already narrowed that to a partial answer. [SOURCE: specs/.../003-live-verification-and-closeout/implementation-summary.md:124]

## Next Focus

Cost-economics and cold-start cache-write characterization gaps.

## Assessment

Builds directly on known open limitations with concrete remediation shapes. Convergence telemetry only; continue.
