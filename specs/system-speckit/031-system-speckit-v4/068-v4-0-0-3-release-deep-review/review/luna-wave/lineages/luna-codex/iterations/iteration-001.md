# Iteration 1 — Correctness: cross-runtime fetched-text screening

## Dimension

Correctness pass following the first lead-steered area: runtime hooks for the fetched-text injection screen. Scope is the 1,997-path release manifest; this pass follows the screen from registration through payload extraction, classification, and advisory delivery.

## Files Reviewed

- [SOURCE: specs/system-speckit/033-system-speckit-v4/068-v4-0-0-3-release-deep-review/review/luna-wave/lineages/luna-codex/steer.md:1] — lead steer; included as requested.
- [SOURCE: specs/system-speckit/033-system-speckit-v4/068-v4-0-0-3-release-deep-review/goal-file-manifest.txt:3] — manifest scope.
- [SOURCE: .skilled/hooks/classifier-injection-screen/lib/classifier-screen-fetched-text.mjs:73] — section splitting, short-section merging, bounds, and classifier request construction.
- [SOURCE: .skilled/hooks/classifier-injection-screen/lib/classifier-screen-fetched-text.mjs:125] — answer parsing and deadline handling.
- [SOURCE: .skilled/hooks/classifier-injection-screen/lib/classifier-injection-advisory.mjs:45] — cross-runtime text extraction.
- [SOURCE: .skilled/hooks/classifier-injection-screen/lib/classifier-injection-advisory.mjs:91] — feature gate and advisory creation.
- [SOURCE: .skilled/hooks/classifier-injection-screen/claude/classifier-injection-screen-posttooluse.mjs:46] — Claude event and fail-open adapter.
- [SOURCE: .skilled/hooks/classifier-injection-screen/devin/classifier-injection-screen-posttooluse.mjs:47] — Devin event and payload adapter.
- [SOURCE: .opencode/plugins/classifier-injection-screen.js:70] — OpenCode fetch hook and session-scoped advisory queue.
- [SOURCE: .skilled/hooks/classifier-injection-screen/pi/classifier-injection-screen.ts:29] — Pi result hook.
- [SOURCE: .hermes/plugins/repo-guards/__init__.py:379] — Hermes result extraction and Devin-adapter bridge.
- [SOURCE: .hermes/plugins/repo-guards/__init__.py:538] — Hermes result advisory attachment.
- [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/hook-registry.json:680] — canonical Claude, Devin, and Pi bindings.
- [SOURCE: .claude/settings.json:220] — Claude WebFetch registration.
- [SOURCE: .devin/hooks.v1.json:155] — Devin webfetch registration.
- [SOURCE: .opencode/plugins/tests/classifier-injection-screen.test.cjs:74] — session buffering, draining, bounds, and fail-open cases (read only; not run).
- [SOURCE: .skilled/hooks/classifier-injection-screen/lib/classifier-screen-fetched-text.test.mjs:47] — section scoring, unreadable answers, time budget, and section bounds (read only; not run).
- [SOURCE: .skilled/hooks/classifier-injection-screen/README.md:24] — declared thresholds, limits, runtime adapters, and exclusions.

## Findings by Severity

### P0 Findings

No P0 findings.

### P1 Findings

No P1 findings.

### P2 Findings

No P2 findings.

## Traceability Checks

- Overlay agent_cross_runtime: PASS for the reviewed screen surface. The canonical hook registry binds Claude and Devin adapters and the Pi extension; the OpenCode plugin and Hermes bridge are present at their declared paths. Runtime-specific registrations use the same tool names and delivery points described in the hook documentation.
- Core spec_code and checklist_evidence: not exercised in this correctness pass.

## Dispatcher

The dispatch route remains the in-process deep-review iteration described by the YAML fan-out pre-dispatch rule. No nested executor or agent was invoked.

## Integration Evidence

Claude and Devin hooks match their configured WebFetch/webfetch event names. OpenCode buffers advisories by session and drains once into the next system transform. Pi appends the advisory only to fetch_content results. Hermes extracts web_extract result text, passes it through the Devin adapter, and appends returned context. The .pi/extensions/classifier-injection-screen.ts and hook-hub OpenCode entry resolve to the intended shared implementations.

## Edge Cases

- Blank text and unsupported payload shapes produce no classifier call.
- Non-fetch tools are ignored by adapters.
- Invalid classifier output is unmeasured; a straddling answer pair requires a readable third response.
- Screening caps work to 12 sections, four concurrent sections, and a 20-second screen budget; sections past those bounds remain unchecked.
- Adapter or classifier failure follows the documented fail-open path and does not alter the fetched result.

## Confirmed-Clean Surfaces

- Cross-runtime adapter routing and fetch-tool names match the canonical registration and documentation.
- The adapter passes page text to the shared classifier path as data; transport command construction is reserved for the next security pass.
- OpenCode queues are bounded and session-scoped; read-only tests cover one-shot drain, per-session isolation, and buffer capacity.

## Ruled Out

- No mismatch found between registration paths and the inspected adapters.
- Cursor and Codex do not register this local screen; the hook README records their fetch-text limitations. This is an explicit scope choice, not a missing binding.
- No finding was supported by the checked code paths. The tests were read as evidence of intended cases but were not executed.

## Claim Adjudication

No P0 or P1 claims were raised.

## Next Dimension

Security. Follow the classifier transport and hook process boundaries, then inspect feature-gate behavior and secrets/log exposure.

## Verdict
Review verdict: PASS
