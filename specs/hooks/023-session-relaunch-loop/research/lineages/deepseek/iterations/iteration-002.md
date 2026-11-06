# Iteration 2: Runtime adapter parity and untrusted spec-folder input

## Focus

Compare the five runtime adapters — Claude, OpenCode plugin, Pi, Codex and Hermes — on trigger detection, handoff text construction, killer target resolution, and nudge suppression. The goal was to find semantics that exist in the core but are reimplemented differently per runtime, and to test the one input that crosses from adapter environment into note frontmatter.

## Findings

1. **P2 — `handoffText` interpolates the spec-folder value into note frontmatter without validation, so an adapter-supplied newline can inject frontmatter keys.** `specValue` is copied verbatim into `spec_folder: ${specValue}` [SOURCE: .skilled/hooks/session-relaunch/lib/nudge.cjs:93]. The Pi extension and OpenCode plugin take that value straight from `SYSTEM_SPEC_FOLDER` [SOURCE: .skilled/hooks/session-relaunch/pi/session-relaunch.ts:338] [SOURCE: .opencode/plugins/session-relaunch.js:159]; Claude, Codex and Hermes take it from the hook payload [SOURCE: .skilled/hooks/session-relaunch/claude/context-nudge.mjs:108] [SOURCE: .skilled/hooks/session-relaunch/codex/shared.mjs:106]. The core already validates packet paths and rejects line breaks in `validSpecFolder` [SOURCE: .skilled/hooks/session-relaunch/lib/relaunch-core.cjs:36], but the nudge never calls it. A value such as `specs/x/001-y\nstatus: claimed` becomes a second frontmatter key, and `prepare` then either rejects the note or accepts a forged status. Fix: normalize the value in `handoffText` (`'none'` or `validSpecFolder`, otherwise `undefined`) and log the dropped value; add a test that passes a newline-bearing spec folder to every adapter.

2. **P2 — Malformed claim seeds are refused by Hermes but silently converted into instructions naming a placeholder path by the other four adapters.** Hermes returns no context when `notePathFromSeed` is null [SOURCE: .skilled/hooks/session-relaunch/hermes/context-nudge.mjs:65]. Claude, Codex and the OpenCode plugin instead pass `notePath ?? '<handoff-path>'` into `seedText` [SOURCE: .skilled/hooks/session-relaunch/claude/context-nudge.mjs:73] [SOURCE: .skilled/hooks/session-relaunch/codex/shared.mjs:67] [SOURCE: .opencode/plugins/session-relaunch.js:284], producing a claim command for a literal placeholder file. A malformed seed (relative path, trailing whitespace, injected newline) is therefore not a no-op in four runtimes and an error message in the fifth. Fix: make `notePathFromSeed === null` end seed handling in every adapter, matching Hermes, and add one parity test per adapter.

3. **P2 — Killer target resolution is reimplemented five ways; only Codex and Hermes use the core ancestor walk.** Claude uses `CLAUDE_PID || process.ppid` [SOURCE: .skilled/hooks/session-relaunch/claude/stop-arm.mjs:131], Codex uses `findLoopChildPid` [SOURCE: .skilled/hooks/session-relaunch/codex/stop-arm.mjs:118], Hermes uses `findLoopChildPid` with an injected-pid seam for tests [SOURCE: .skilled/hooks/session-relaunch/hermes/session-end-arm.mjs:79], and Pi and the OpenCode plugin pass `process.pid` [SOURCE: .skilled/hooks/session-relaunch/pi/session-relaunch.ts:244] [SOURCE: .opencode/plugins/session-relaunch.js:190]. The five paths disagree about which layer is the "runtime process", which is how the Claude bug in iteration 1 arose. Fix: add `resolveKillerTarget(loopId, { env, pid })` to `relaunch-core.cjs` with a documented preference order (runtime-exported pid, then ancestor walk, then `process.pid`), and make every adapter call it; the helper gets one test per resolution branch.

4. **P2 — The OpenCode plugin treats a note file's existence as "handoff done" but treats its readability as "not claimed", so a corrupt note permanently suppresses the nudge.** Outside a loop, `shouldPushActiveNudge` returns `!fs.existsSync(activeNudge.notePath)` [SOURCE: .opencode/plugins/session-relaunch.js:64]. The seed path in the same file deliberately treats a read or parse failure as `open` so a failed read is not mistaken for a claim [SOURCE: .opencode/plugins/session-relaunch.js:72]. A zero-byte or half-written note therefore silences the nudge while the session still cannot prepare, and only a manual retry recovers. Fix: use one note-state helper for both paths (open when missing, unreadable or invalid; stop only on `claimed`/`done`), and add a corrupt-note test.

5. **P2 — The environment reference says Claude and Codex take `spec_folder` from the hook payload, but no repository hook or host configuration produces that field.** The reference row states the value comes from the payload [SOURCE: .skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md:113], and the adapters read `payload.spec_folder` [SOURCE: .skilled/hooks/session-relaunch/codex/shared.mjs:106] [SOURCE: .skilled/hooks/session-relaunch/claude/context-nudge.mjs:108]. Only test fixtures set it [SOURCE: .skilled/hooks/session-relaunch/tests/claude-adapters.test.cjs:156]. No generated settings row, hook, or spec-gate writes it, so real Claude and Codex runs pass `undefined` and the hop loses the Gate 3 answer that the parent AGENTS.md says persists for the session. Fix: either document the empty fallback as expected and remove the "from the hook payload" claim, or read the bound packet from the repo-owned spec-gate state (for example the same `SYSTEM_SPEC_FOLDER` channel Pi and OpenCode use) and test that real producer.

## Ruled Out

- Treating OpenCode's `process.pid` target as a bug: the plugin is hosted in the OpenCode process the wrapper starts, and the plugin tests assert that pid is passed to the killer [SOURCE: .opencode/plugins/tests/session-relaunch.test.cjs:916].
- Re-checking the threshold math per adapter: every adapter calls the shared `relaunchThreshold`, `nextLevel` and `handoffPending` helpers, and the per-runtime windows are intentional.
- Flagging Codex's separate `prompt-seed.mjs` and `context-nudge.mjs` entry points: the installer allows one script per event, and both route through `shared.mjs`.

## Dead Ends

- Searching for a runtime that resolves the window from a different source than documented: Pi uses `ctx.getContextUsage()`, OpenCode uses `model.limit.context`, Codex the transcript's `model_context_window`, Hermes the payload or model metadata, all with the same env override.

## Edge Cases

- Ambiguous input: the OpenCode `message.part.updated` ordering assumption cannot be settled from the repository; it is recorded here as a residual risk rather than a finding.
- Contradictory evidence: none.
- Missing dependencies: the external fact whether Claude Code exports `CLAUDE_PID` remains unresolved and is carried forward.
- Partial success: the adapter survey covers all five adapters, but only the Claude and OpenCode plugin host processes were verified from local evidence.

## Sources Consulted

- .skilled/hooks/session-relaunch/pi/session-relaunch.ts
- .opencode/plugins/session-relaunch.js
- .skilled/hooks/session-relaunch/codex/shared.mjs
- .skilled/hooks/session-relaunch/codex/prompt-seed.mjs
- .skilled/hooks/session-relaunch/codex/context-nudge.mjs
- .skilled/hooks/session-relaunch/codex/stop-arm.mjs
- .skilled/hooks/session-relaunch/hermes/context-nudge.mjs
- .skilled/hooks/session-relaunch/hermes/session-end-arm.mjs
- .skilled/hooks/session-relaunch/claude/context-nudge.mjs
- .skilled/hooks/session-relaunch/claude/stop-arm.mjs
- .skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md

## Assessment

- New information ratio: 0.9
- Questions addressed: adapter parity; spec-folder provenance
- Questions answered: the adapter-parity key question, with five concrete drift points

## Reflection

- What worked and why: reading every adapter in one pass made the duplicated target-resolution logic visible; no single file looks wrong, but the set does.
- What did not work and why: the payload-provenance question needed a repository-wide producer search, and absence of a producer is weaker evidence than a failing test.
- What I would do differently: start from the environment reference's producer claims and verify each against the code that reads the variable, before reviewing adapter internals.

## Recommended Next Focus

Command and documentation surface: `/speckit:handoff`, the README contract, the playbooks and the environment reference against the code paths proven in iterations 1-2, with the sk-doc document standards as the yardstick.
