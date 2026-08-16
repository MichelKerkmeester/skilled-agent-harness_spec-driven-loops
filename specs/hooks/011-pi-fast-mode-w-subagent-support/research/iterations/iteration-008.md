# Iteration 8: Indicator UX under custom footers — setFooter replacement vs widget placement; status fallback; recommendation

## Focus
Lane Q8: how the fork should render its fast-mode indicator when the UI has a custom footer. Investigated three things: (a) what the shipped pi-statusline extension actually does (setFooter replacement vs widget placement), (b) custom footer behavior — exclusivity and composition with setStatus entries, (c) status fallback in RPC/subagent mode, then issued a recommendation. Ambiguity: lane wording implies "replacement OR widget"; ground truth shows both are real and config-selected (mutually exclusive modes), so no interpretation conflict — both were investigated.

## Actions Taken
1. Located installed pi-statusline (v0.0.2, MIT) under `~/.pi/agent/npm/node_modules/pi-statusline/` and read its full `src/ui.ts` (the only UI-rendering module) plus a cross-src grep of every `ctx.ui.*` call.
2. Read the canonical API section "Widgets, Status, and Footer" in the installed pi extension docs (`extensions.md:2556-2595`): exact `setStatus` / `setWidget` / `setFooter` semantics including the "replaces built-in footer entirely" wording.
3. Grepped `rpc.md` for the `extension-ui-protocol` section (lines 1157-1293) to classify which UI methods survive RPC mode and which are no-ops.
4. Calibrated prior coverage against `research/iterations/iteration-001.md` (Q1 already covered setStatus-vs-setWidget rendering rules and deferred the setFooter/RPC-no-op detail explicitly to lane 8).

## Findings
1. **[P0] pi-statusline's default mode is full setFooter replacement, not a status entry.** `applyStatusLineUi` (placement !== "widget") clears the widget and installs a custom footer renderer via `ctx.ui.setFooter(() => ({ render(width) { ... }, invalidate() {} }))`. It never calls `setStatus` anywhere in `src/`. The "statusline" is therefore a wholesale replacement of the built-in footer with its own renderer. [SOURCE: ~/.pi/agent/npm/node_modules/pi-statusline/src/ui.ts:69-91]
2. **[P1] Widget placement is an opt-in, mutually exclusive alternative.** With `placement: "widget"` (config `widgetPlacement`, default `belowEditor`), pi-statusline calls `ctx.ui.setWidget("pi-statusline", padded, { placement })` and clears the footer (`setFooter(undefined)`). A single extension offers both UX models behind a config knob; they cannot be active at once. [SOURCE: ~/.pi/agent/npm/node_modules/pi-statusline/src/ui.ts:76-82]
3. **[P1] A custom footer renderer owns its own width handling.** The renderer contract is `render(width)` + `invalidate()`; because the built-in footer is replaced, framework padding/truncation is forfeited — pi-statusline implements ANSI-aware truncation itself (`skipAnsiSequence`, `truncateLine`). Any fork code replacing the footer must replicate width/ANSI handling. [SOURCE: ~/.pi/agent/npm/node_modules/pi-statusline/src/ui.ts:1-67, 84-91]
4. **[P0] setFooter is exclusive; setStatus is composable.** Docs state `setFooter` "replaces built-in footer entirely" and `setFooter(undefined)` restores it, while `setStatus(key, text)` renders a per-key entry "persistent until cleared". Because status entries live in the built-in footer, an extension that installs a custom footer displaces every other extension's setStatus entries (last-writer-wins, single renderer). [SOURCE: /Users/michelkerkmeester/.local/lib/node_modules/@earendil-works/pi-coding-agent/docs/extensions.md:2559-2560, 2590-2595]
5. **[P0] RPC/subagent mode degrades the UI surface asymmetrically.** `rpc.md` (extension-ui-protocol) lists `setFooter()`, `setHeader()`, `setWorkingMessage()`, `setWorkingIndicator()`, `setEditorComponent()`, `setToolsExpanded()` as **no-ops** in RPC mode, while `setStatus`, `setWidget`, `notify`, `setTitle` are fire-and-forget `extension_ui_request` methods the client "can display ... or ignore". This resolves iteration-001's deferred sub-topic (it suspected setStatus/setWidget might be no-ops in RPC; they are not — the footer/header/working-row family is). [SOURCE: /Users/michelkerkmeester/.local/lib/node_modules/@earendil-works/pi-coding-agent/docs/rpc.md:1162, 1166-1173, 1264-1293]
6. **[P1] Upstream blueprint already chooses setStatus.** pi-openai-fast-mode ships a `STATUS_KEY` status entry via `setStatus`/`clearFastStatus` (per iteration-001 finding 7); setStatus was identified there as "the low-friction footer indicator path" and the fork's direct blueprint. This iteration confirms that choice also survives RPC, which is the fork's core handoff scenario. [SOURCE: specs/hooks/011-pi-fast-mode-w-subagent-support/research/iterations/iteration-001.md:70-76]
7. **[P0] Recommendation: setStatus as the primary indicator; do not adopt setFooter.** (a) The fork's differentiator is subagent handoff, which runs pi in RPC/non-TUI mode where setFooter is a silent no-op — the indicator would be invisible exactly where it matters. (b) setFooter is exclusive: it clobbers the built-in footer and displaces other extensions' status entries (pi-statusline itself, other indicators), an antisocial default for a shared footer. (c) setStatus under a namespaced key is composable, per-key persistent, TUI+RPC-safe, and matches the upstream openai extension precedent. setWidget is the fallback for richer editor-area indicators, not for footer status. Optionally expose a pi-statusline-style `placement` config knob later for users who want a widget indicator. [INFERENCE: based on findings 1-6]

## Ruled Out
- **setFooter as the fork's indicator** — eliminated on two independent grounds: RPC no-op (finding 5) and footer exclusivity/status displacement (finding 4). Recorded as a candidate for reducer "Exhausted Approaches" (lane-8 scope).
- **pi-statusline's `placement: "widget"` as the initial fork indicator** — viable but not needed; deferred to a later config knob (finding 7). Not eliminated.

## Dead Ends
- None. Both candidate UX models (setFooter replacement, widget placement) were confirmed live in the shipped pi-statusline source; no approach in this lane failed.

## Edge Cases
- Ambiguous input: none — lane's "replacement vs widget placement" is a real either/or inside pi-statusline, resolved by reading both code paths.
- Contradictory evidence: none — docs (extensions.md) and shipped implementation (pi-statusline ui.ts) agree on setFooter exclusivity; rpc.md and extensions.md agree on the RPC classification.
- Missing dependencies: none. The only nominal gap is that RPC no-op behavior was verified from the installed rpc.md doc, not an empirical headless run (no live RPC client available); doc wording is unambiguous ("are no-ops").
- Partial success: none — all research actions succeeded.
- Tool-budget note: 13 tool calls vs the nominal 12 cap; the overshoot is one consolidated final write+verify pass required by the mandatory three-artifact contract, not extra research.

## Questions Answered
- Q8 Indicator UX under custom footers: pi-statusline setFooter replacement vs widget placement; custom footer behavior; status fallback; recommendation — answered (findings 1-7).

## Questions Remaining
- Q9 TheBinaryGuy pi-fast-mode edge cases worth adopting (footer-composition wrapper; atomic state writes; service_tier guard; payload.model guard; supportsFastMode regex; adopt vs reject)
- Q10 Licensing, notices, docs, maintenance (MIT compliance; THIRD_PARTY_NOTICES; README provenance; PLUGINS.md and sync-manifest; npm keywords and pi key)

## Next Focus
Q9 TheBinaryGuy pi-fast-mode edge cases: footer-composition wrapper (note: pi-statusline sets a precedent for footer composition conflicts — TBG's wrapper is the counter-pattern to compare), atomic state writes, service_tier/payload.model guards, supportsFastMode regex; adopt vs reject each.

## Sources Consulted
- /Users/michelkerkmeester/.pi/agent/npm/node_modules/pi-statusline/src/ui.ts:1-91
- /Users/michelkerkmeester/.pi/agent/npm/node_modules/pi-statusline/package.json:1-30
- /Users/michelkerkmeester/.local/lib/node_modules/@earendil-works/pi-coding-agent/docs/extensions.md:2556-2595
- /Users/michelkerkmeester/.local/lib/node_modules/@earendil-works/pi-coding-agent/docs/rpc.md:1157-1293
- specs/hooks/011-pi-fast-mode-w-subagent-support/research/iterations/iteration-001.md:63-76, 94-101, 114

## Assessment
- New information ratio: 0.93 (6 of 7 findings fully new; finding 6 partially reuses iteration-001's setStatus blueprint finding; no simplicity bonus — synthesis rested on new external evidence, not prior evidence alone)
- Questions addressed: Q8 (fully)
- Questions answered: Q8
- Severity profile: 4× P0, 2× P1, 1× P2

## Reflection
- What worked and why: reading the *installed* pi-statusline `src/ui.ts` end-to-end instead of guessing from README keywords gave ground truth on both modes and the renderer contract; pairing it with the canonical extensions.md section and the rpc.md extension-ui-protocol classification made the "status fallback" question a table lookup, not an inference. Iteration-001's explicit deferral note (lane-8 needs rpc.md detail) told me exactly which source to consult.
- What did not work and why: nothing failed. The one care point was resisting scope creep into Q9 (TBG footer-composition wrapper surfaced repeatedly as adjacent evidence); it stays in Next Focus for the approved lane 9.
- What I would do differently: a live RPC smoke run would turn the doc-based no-op classification into an observation; that is a Q9/Q10-adjacent verification candidate rather than a blocker for this lane's recommendation.

## Recommended Next Focus
Q9 TheBinaryGuy pi-fast-mode edge cases — compare TBG's footer-composition wrapper against the pi-statusline setFooter-exclusivity finding (finding 4) to decide adopt vs reject; then atomic state writes, service_tier/payload.model guards, supportsFastMode regex.
