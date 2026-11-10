# Iteration 2 — Security: classifier transport and hook process boundary

## Dimension

Security pass on the classifier process boundary, feature gates, and untrusted fetched-page handling. The pass is limited to the first-priority injection-screen path; broader manifest security remains for later iterations.

## Files Reviewed

- [SOURCE: specs/system-speckit/033-system-speckit-v4/068-v4-0-0-3-release-deep-review/review/luna-wave/lineages/luna-codex/steer.md:1] — lead steer, reread for this iteration.
- [SOURCE: .skilled/hooks/classifier-injection-screen/lib/classifier-screen-fetched-text.mjs:91] — line-based section construction and screening deadline.
- [SOURCE: .skilled/skills/cli-classifier/benchmark/injection-screen/score-injection-screen.mjs:288] — line splitter and section joiner.
- [SOURCE: .skilled/hooks/classifier-injection-screen/lib/classifier-screen-fetched-text.mjs:147] — classifier request receives section text through stdin.
- [SOURCE: .skilled/skills/cli-classifier/shared/scripts/jev-transport.mjs:455] — child process argv/stdin handling and bounded call timeout.
- [SOURCE: .skilled/skills/cli-classifier/shared/scripts/jev-features.mjs:90] — feature switch and auth readiness checks.
- [SOURCE: .skilled/hooks/shared/hook-flags.cjs:99] — persisted feature/hook switch parsing.
- [SOURCE: .skilled/hooks/classifier-injection-screen/lib/classifier-injection-advisory.mjs:91] — screen activation and text-only handoff.
- [SOURCE: .skilled/hooks/classifier-injection-screen/README.md:18] — documented credential gate and line/section/time limits.
- [SOURCE: .skilled/hooks/classifier-injection-screen/lib/classifier-screen-fetched-text.test.mjs:131] — line-count and time-bound examples (read only; not run).

## Findings by Severity

### P0 Findings

No P0 findings.

### P1 Findings

No P1 findings.

### P2 Findings

1. **LUNA-CODEX-02-P2-001 — Page byte size is unbounded before screening timeout** — [SOURCE: .skilled/hooks/classifier-injection-screen/lib/classifier-screen-fetched-text.mjs:106]. The section splitter caps line count, not bytes. A fetched page with a very long unbroken/minified line remains a single section; prepareSections splits the full text into lines and also calls splitSections, which splits it again, before screenText starts its 20-second classifier deadline. The resulting whole section is passed as stdin to each classifier call. A large page can therefore allocate and resend a large payload before the advertised time budget applies, causing hook stalls or process memory exhaustion. Class: resource exhaustion. Scope proof: this hook is listed in the supplied manifest at goal-file-manifest.txt:251. Affected paths: Claude, Devin, OpenCode, Pi, and Hermes all use this shared screen.

## Traceability Checks

- No formal traceability protocol was required for this security pass. The hook documentation’s 12-section/four-concurrent/20-second limits match the constants and scheduling, but do not describe or implement a byte limit.

## Dispatcher

Inline execution continued in the same lineage. No nested executor, CLI dispatch, or agent dispatch was invoked.

## Integration Evidence

Feature readiness is checked before the screen runs; the feature is enabled by default and Jev readiness requires a stored credential. The screen call itself passes each selected section as stdin. The Jev CLI receives an argv array, not a shell command; hook reporting is silenced for the screen call, and auth-check output is captured rather than returned.

## Edge Cases

- A newline-free payload remains one line regardless of its byte length.
- A payload with several long sections can run four section workers concurrently, each starting two classifier calls.
- The classifier deadline starts after section preparation, so it does not cover splitting and assembling the fetched page.
- The fetch adapters are advisory and fail open, but a memory or latency failure can still affect the hook process before its fallback runs.

## Confirmed-Clean Surfaces

- Untrusted page text is passed as process input, not interpolated into the fixed classifier arguments.
- Auth status output is piped and not exposed; the screening call’s report callback is a no-op.
- Environment switches override persisted feature values; the adapter checks hook kill switches before reading its payload.

## Ruled Out

- No shell command construction from fetched page text found in the reviewed adapter/transport path.
- No credential value is read by this screen or emitted in its hook output.
- No feature-switch bypass found across the shared adapter path.

## Claim Adjudication

No P0 or P1 claims were raised.

## Next Dimension

Traceability. Review .github/workflows and the exact actions/scripts they invoke; follow their inputs, permissions, artifacts, and failure handling.

## Verdict
Review verdict: PASS
