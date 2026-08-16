# Iteration [9]: TheBinaryGuy pi-fast-mode edge cases — adopt vs reject

## Focus
Evaluate the five TheBinaryGuy (TBG) `pi-fast-mode` edge cases against the fork (`pi-fast-mode-w-subagent-support`) and issue an adopt/reject verdict for each: footer-composition wrapper; atomic state writes; service_tier guard; payload.model guard; supportsFastMode regex. Source of truth: `context/pi-fast-mode/` (TBG's shipped extension + its Vitest suite). This is approved lane Q9 of the ten-lane queue.

## Actions Taken
1. Read TBG extension source end-to-end (`context/pi-fast-mode/extensions/openai-codex-fast-mode.ts`, 211 lines).
2. Read TBG test suite end-to-end (`context/pi-fast-mode/test/openai-codex-fast-mode.test.ts`, 270 lines) — every guard is unit-tested.
3. Verified the in-process footer slot semantics against the installed pi build (`dist/core/extensions/runner.js` noOpUIContext) and `docs/rpc.md:1168` to resolve the apparent setFooter contradiction with iteration-8 findings.

## Findings

1. **[P2] supportsFastMode regex gate** — `supportsFastMode(modelId)` is a pure function: `modelId === "gpt-5.5" || /^gpt-5\.6(?:-|$)/.test(modelId)` — exact `gpt-5.5` or any `gpt-5.6*` id that starts a dash segment (`gpt-5.6`, `gpt-5.6-luna/sol/terra`); `gpt-5.6x`/`gpt-5.61` do NOT match (dash-or-end anchor). The suite enumerates both sides (supported: gpt-5.5, gpt-5.6, 5.6-luna/sol/terra; unsupported: gpt-5.4, gpt-5.4-mini, gpt-5.3-codex-spark, gpt-6). Pattern quality is high: small, pure, unit-tested, exact boundary. [SOURCE: context/pi-fast-mode/extensions/openai-codex-fast-mode.ts:29-31] [SOURCE: context/pi-fast-mode/test/openai-codex-fast-mode.test.ts:24-38]

2. **[P1] service_tier guard** — in `before_provider_request`, TBG returns early when `"service_tier" in event.payload`, i.e. fast mode never overrides an explicit tier. Test `does not override an existing service tier` asserts the handler returns `undefined` for `service_tier: "default"`. This is a user-respect guard: an explicit tier choice (e.g. opting out of priority pricing) survives fast mode. [SOURCE: context/pi-fast-mode/extensions/openai-codex-fast-mode.ts:204] [SOURCE: context/pi-fast-mode/test/openai-codex-fast-mode.test.ts:196-212]

3. **[P1] payload.model guard** — the handler first requires `isRecord(event.payload)` (object, non-null, non-array), then mutates ONLY when `event.payload.model === model.id` (plus provider `openai-codex` and api `openai-codex-responses` checks, and `fastModeEnabled`). This prevents stamping `service_tier: "priority"` onto requests that belong to a different model than the one fast mode is authorized for (parallel/subagent requests). [SOURCE: context/pi-fast-mode/extensions/openai-codex-fast-mode.ts:196-203]

4. **[P2] atomic state writes** — `writeFastModeState` writes to `${statePath}.${process.pid}.${Date.now()}.tmp`, then `renameSync(tmp, statePath)` (atomic on the same filesystem), with `rmSync(tmp, { force: true })` in `finally` for failure cleanup and `mkdirSync(dirname, { recursive: true })`. Read side falls back to `{ enabled: false }` on missing file, non-record shape, or parse error. This is the canonical atomic-write idiom — a crash mid-write cannot tear the state file. [SOURCE: context/pi-fast-mode/extensions/openai-codex-fast-mode.ts:44-63]

5. **[P2] footer-composition wrapper** — `installFastModeFooter` registers a `ctx.ui.setFooter` factory that CONSTRUCTS the real `FooterComponent` (wrapping `ctx` in a `sessionAdapter` + `footerData`), delegates `dispose()`/`invalidate()`, subscribes `onBranchChange(() => tui.requestRender())`, and composes a ` • fast` suffix onto the second stats line ONLY when it contains the current modelId, re-rendering at `width - suffixWidth` to avoid overflow. Idempotent (`footerInstalled` flag), TUI-mode gated, removed via `setFooter(undefined)`, reinstalled on `session_start`. This is compose-not-replace. Layer verification: in-process `ui.setFooter` is real in TUI mode; `noOpUIContext` (runner.js:88-103) stubs ALL ui methods in print mode; RPC `setFooter` is a documented no-op for remote extensions (rpc.md:1168). The footer is a single slot — whoever installs last owns it. [SOURCE: context/pi-fast-mode/extensions/openai-codex-fast-mode.ts:66-149] [SOURCE: ~/.local/lib/node_modules/@earendil-works/pi-coding-agent/dist/core/extensions/runner.js:88-103] [SOURCE: ~/.local/lib/node_modules/@earendil-works/pi-coding-agent/docs/rpc.md:1168]

6. **[P2] state-read safety + state path** — `readFastModeState` validates `isRecord(value) && typeof value.enabled === "boolean"` before trusting the file. State lives at `join(getAgentDir(), "openai-codex-fast-mode.json")`; tests redirect the agent dir via `process.env.PI_CODING_AGENT_DIR` (the env-mutation pattern already catalogued in iteration-7 finding 43). Fork implication: the fork MUST use a distinct state file name (and its `fast` command collides with TBG's — iteration-5 semantics apply: keep-all + numeric suffix, load order owns bare /fast). [SOURCE: context/pi-fast-mode/extensions/openai-codex-fast-mode.ts:17,33-42,44] [SOURCE: context/pi-fast-mode/test/openai-codex-fast-mode.test.ts:150-176]

7. **[P3] adopt/reject verdict (synthesis)** —
   - ADOPT: service_tier guard (P1) and payload.model guard (P1) — cheap, unit-testable, prevent real behavioral bugs (clobbering explicit user tiers; priority-stamping wrong-model requests).
   - ADOPT: atomic write pattern (P2) + invalid-state-safe read (P2) — the fork's self-upgrade write-back (iteration-4 finding 22) should use tmp+rename too; crash-torn config/state is the failure mode this prevents.
   - ADOPT (pattern only): a pure, unit-tested model-gate function like `supportsFastMode` — but with the fork's OWN model set; REJECT TBG's gpt-5.6 regex verbatim (model family mismatch; the fork's gate is config-driven per iteration-4 finding 27).
   - OPT-IN, NOT DEFAULT: footer-composition wrapper. It preserves the default footer (compose-not-replace) and is technically sound in-process, but it owns the single footer slot (displaces pi-statusline's default mode) and is silent in print mode. Iteration-8's recommendation stands: setStatus is the fork's primary, composable, RPC-surviving indicator; the TBG wrapper is a viable optional "in-footer" indicator behind a later config knob.
   [SOURCE: specs/hooks/011-pi-fast-mode-w-subagent-support/research/iterations/iteration-008.md] [INFERENCE: based on findings 1-6 and iteration-8 f-55]

## Questions Answered
- Q9 answered: all five TBG edge cases evaluated with per-item adopt/reject verdicts (finding 7). 9 of 10 lanes now complete.

## Questions Remaining
- Q10: Licensing, notices, docs, maintenance — MIT compliance; THIRD_PARTY_NOTICES; README provenance; PLUGINS.md and sync-manifest; npm keywords and pi key. (iteration 10)

## Ruled Out
- Adopting TBG's gpt-5.6 `supportsFastMode` regex as the fork's model gate as-is — model family mismatch; the fork's gate is config-driven (iteration-4 finding 27). The pure-gate PATTERN is adopted, not the regex.
- Footer-composition wrapper as the fork's DEFAULT indicator — single-slot footer displaces other compositors; setStatus remains primary (iteration-8 finding 55).

## Dead Ends
- None definitively eliminated this iteration. Candidate for later verification: whether TBG's wrapper actually renders in a live TUI (its own suite mocks `ui.setFooter`, so real-runtime rendering is unproven by its tests).

## Edge Cases
- Ambiguous input: none. Lane scope was unambiguous after the orchestrator override.
- Contradictory evidence: RESOLVED. Iteration-8 f-53 ("RPC no-ops: setFooter family") vs TBG's working `ctx.ui.setFooter` are compatible once layered: (a) in-process TUI adapter provides a real single-slot setFooter; (b) print mode injects `noOpUIContext` where ALL ui methods no-op (runner.js:88-103); (c) the cross-process RPC protocol documents setFooter as a no-op for remote extensions (rpc.md:1168). Both claims preserved; the mechanism boundary is the resolution.
- Missing dependencies: none.
- Partial success: none.

## Sources Consulted
- specs/hooks/011-pi-fast-mode-w-subagent-support/context/pi-fast-mode/extensions/openai-codex-fast-mode.ts:29-31,44-63,66-149,196-208
- specs/hooks/011-pi-fast-mode-w-subagent-support/context/pi-fast-mode/test/openai-codex-fast-mode.test.ts:24-38,116-134,196-212
- ~/.local/lib/node_modules/@earendil-works/pi-coding-agent/dist/core/extensions/runner.js:88-103
- ~/.local/lib/node_modules/@earendil-works/pi-coding-agent/docs/rpc.md:1168
- specs/hooks/011-pi-fast-mode-w-subagent-support/research/iterations/iteration-008.md (f-53, f-55)

## Assessment
- New information ratio: 0.93 (6 of 7 findings fully new; finding 7 partially reuses iteration-8 setFooter evidence; no simplicity bonus — synthesis drew on new external evidence)
- Questions addressed: 1 (Q9, all five edge-case items)
- Questions answered: 1 (Q9 complete)

## Reflection
- What worked and why: reading TBG's extension and test suite side-by-side made every edge case provable — each guard (service_tier, payload.model, atomic write, regex boundary) has a dedicated test, so the adopt/reject verdict is grounded in executable evidence rather than inference. Verifying the setFooter contradiction against the installed dist (`noOpUIContext`) and rpc.md resolved it by layering instead of picking a winner.
- What did not work and why: nothing failed. The one gap: TBG's own suite mocks `ui.setFooter`, so real-runtime footer rendering is unproven by TBG's tests — worth a live smoke test in the testing lane if the wrapper is ever adopted.
- What I would do differently: verify in-process `setFooter` wiring earlier in the lane; it was the single claim the TBG suite cannot prove.

## Next Focus
Q10 — Licensing, notices, docs, maintenance (iteration 10, final lane).

## Recommended Next Focus
Q10 — Licensing, notices, docs, maintenance (MIT compliance; THIRD_PARTY_NOTICES; README provenance; PLUGINS.md and sync-manifest; npm keywords and pi key). The TBG package carries an MIT LICENSE in-repo (context/pi-fast-mode/LICENSE) — a concrete comparison surface for the fork's notice obligations.
