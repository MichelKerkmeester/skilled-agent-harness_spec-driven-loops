# Review Iteration 004

## Dispatcher

- Loop: `/deep:review`, mode `review`, executor `cli-pi` (deepseek-v4.1-flash-1017, reasoning max).
- Focus handed in: D4 maintainability, iteration 4 of 5.
- Focus executed: D4 maintainability, carried as the durability of the removal itself - the dead export surface left by the `dualPlugin` narrowing, the consumers of the keys that narrowing removed, and whether the touched docs still describe the surviving shape.
- Dimension rotation note: the seam read that D4 asked for is what exposed the P1 below. Its tag is `correctness` because the defect is a live caller that throws, not a style cost; the inspected surfaces were chosen for D4 reasons. D4 itself is complete.
- Scope fence: nothing under `review/` was modified; the reviewed branch was read only.

## Files Reviewed

Producer and its contract:

- `.opencode/plugins/lib/v2-bridge.js` - `MAPPED_HOOKS` (16), `TOOL_ALIASES` (31), `toV1ToolName` (136), the `PluginInput` typedef (307-316), `dualPlugin` (327), `setup`'s skipped-key filter (348), the returned `{ id, setup }` (593), the export list (602).
- `.opencode/plugins/session-cleanup.js:375` - the default export that the narrowed wrapper now builds.

Consumers and their evidence:

- `.vibe/plugins/repo-guards/session-cleanup.mjs` - the dynamic import of the default export (77) and the two `.server(...)` calls (51, 60).
- `.vibe/plugins/repo-guards/lib/hook-io.mjs:112-124` - `runGuard`, the fail-open wrapper.
- `.vibe/plugins/README.md:95` - the hook matrix row that records this adapter as live.

Tests and docs that encode the new shape:

- `.opencode/plugins/tests/v2-registration.test.cjs:107`, `.opencode/plugins/tests/v2-bridge.test.cjs:1680`, `.opencode/plugins/tests/v2-hard-plugins.test.cjs:93` - `Object.hasOwn(plugin, 'server') === false`.
- `.opencode/plugins/tests/plugin-inventory.test.cjs:81-82` - the only importer of any bridged table.
- `.opencode/plugins/ARCHITECTURE.md:21,123,137,224`, `.opencode/plugins/README.md:18` - the documented `{ id, setup }` contract and the disposal-branch rationale.

Packet evidence:

- `001-v1-runtime-code-and-tests/acceptance-criteria.md:60` (AC-007), `001-v1-runtime-code-and-tests/decision-record.md:49` (ADR-001), `.skilled/commands/deep/assets/deep-review-presentation.txt:474`.

## Findings - New

### P0 Findings

None.

### P1 Findings

1. **The removal dropped the dual-export `server` key while the Vibe session-cleanup hook still calls it, and the fail-open wrapper hides the break** -- `.opencode/plugins/lib/v2-bridge.js:593` -- The branch deletes `return { id, server, setup }` and returns `const plugin = { id, setup }`, keeping only `factory` as a non-enumerable property. Every OpenCode-side consumer was updated: three suites now assert `Object.hasOwn(plugin, 'server') === false` and both plugin docs state "exactly the enumerable keys `id` and `setup`". One consumer was not. `.vibe/plugins/repo-guards/session-cleanup.mjs:77` imports the default export of `.opencode/plugins/session-cleanup.js`, which is `dualPlugin('session-cleanup', sessionCleanupPlugin)` (`.opencode/plugins/session-cleanup.js:375`), and both lifecycle halves then call `sessionCleanupPlugin.server({ worktree: projectDir })` (`:51`, `:60`). After the narrowing, `server` is `undefined`, so both calls throw `TypeError: sessionCleanupPlugin.server is not a function`. `runGuard` catches it, writes one stderr line and sets `process.exitCode = 0` (`.vibe/plugins/repo-guards/lib/hook-io.mjs:112-124`), so a Vibe session starts with no startup-safety warnings and ends with neither `hooks.dispose()` nor the process sweep. The hook matrix in `.vibe/plugins/README.md:95` records this adapter as live, and its only kill switch is `SYSTEM_SESSION_CLEANUP_DISABLED`, so the default path is the broken one. AC-007 asked for a `.server(` zero-match and got it, because its search scope was `.opencode/plugins/tests` rather than the repository.
   Finding class: dangling consumer of a removed export key.
   Scope proof: the producer, the tests and the packet row are inside the 070 review scope; the caller is cited as the integration surface the removal's own acceptance criterion failed to search.
   Affected surface hints: `.vibe/plugins/repo-guards/session-cleanup.mjs`, `.opencode/plugins/session-cleanup.js`, AC-007 in `001-v1-runtime-code-and-tests/acceptance-criteria.md`, `.vibe/plugins/README.md` hook matrix, `/deep:review` traceability protocol `checklist_evidence`.
   Case: a Vibe session starts or ends with `session-cleanup` enabled (the default) - `await sessionCleanupPlugin.server({ worktree: projectDir })` throws, `runGuard` swallows it, and the startup guard warnings plus the end-of-session cleanup never run.

```json
{
  "type": "correctness",
  "claim": "dualPlugin returns exactly { id, setup }, so every Vibe call to sessionCleanupPlugin.server(...) throws and the startup-warning and end-of-session cleanup legs silently never run",
  "evidenceRefs": [
    ".opencode/plugins/lib/v2-bridge.js:593",
    ".opencode/plugins/session-cleanup.js:375",
    ".vibe/plugins/repo-guards/session-cleanup.mjs:77",
    ".vibe/plugins/repo-guards/session-cleanup.mjs:51",
    ".vibe/plugins/repo-guards/session-cleanup.mjs:60",
    ".vibe/plugins/repo-guards/lib/hook-io.mjs:112",
    ".opencode/plugins/tests/v2-registration.test.cjs:107",
    ".vibe/plugins/README.md:95"
  ],
  "counterevidenceSought": "checked whether dualPlugin keeps server non-enumerably (it defines only factory); whether the removal was accidental (three suites assert its absence, so it is deliberate and host-facing); whether the Vibe hook passes the inner factory instead of the default export (it destructures default at :77); whether the hook is off by default (its kill switch is SYSTEM_SESSION_CLEANUP_DISABLED); whether a test covers the hook (none does)",
  "alternativeExplanation": "the Vibe adapter may have no live session traffic and be retired in practice; its README matrix and kill-switch row record it as active, and with no test the break is invisible either way",
  "finalSeverity": "P1",
  "confidence": 0.9,
  "downgradeTrigger": "evidence that .vibe/plugins/repo-guards/session-cleanup.mjs is no longer executed by a supported Vibe session, or a shim that restores server before the hook reads it"
}
```

### P2 Findings

1. **Two of the four re-exported internals in `v2-bridge` have no importer** -- `.opencode/plugins/lib/v2-bridge.js:602` -- The module closes with `export { MAPPED_HOOKS, EVENT_ALIASES, EVENT_MAPPINGS, TOOL_ALIASES }`. Only the two event tables have a consumer: `.opencode/plugins/tests/plugin-inventory.test.cjs:81-82` builds its known-event set from `EVENT_ALIASES` and `EVENT_MAPPINGS`. `MAPPED_HOOKS` is used internally at `:348` and `TOOL_ALIASES` at `:136`, and neither is imported anywhere else in the repository. `.opencode/plugins/ARCHITECTURE.md:137` cites `MAPPED_HOOKS` by symbol, which is a documentation reference rather than a code dependency. The effect is small and real: the export line reads as the module's public contract, so the next reader who wants to add a tool alias can import `TOOL_ALIASES` and edit the table directly, bypassing the two-way mapping `toV1ToolName`/`toV2ToolArgs` maintains.
   Finding class: export surface wider than its consumers.
   Scope proof: all four cited lines are inside the 070 review scope.
   Affected surface hints: `.opencode/plugins/tests/plugin-inventory.test.cjs`, `.opencode/plugins/ARCHITECTURE.md` hook-mapping row, any future bridge test.
   Case: a maintainer reads the export list as the bridge's contract, imports `TOOL_ALIASES`, and mutates the alias table directly instead of routing the change through the two-way tool-name mapping.

## Traceability Checks

- Core `spec_code` - **pass**. AC-007 is the packet row that records the `server`-entry removal, and the code matches it: the key is gone (`.opencode/plugins/lib/v2-bridge.js:593`), the three suites assert its absence, and `ARCHITECTURE.md:123` / `README.md:18` state the surviving shape. No code-vs-spec drift on the decision itself.
- Core `checklist_evidence` - **partial**. AC-007's verification cell is `rg -l -F '.server(' .opencode/plugins/tests | wc -l` prints 0 (`001-v1-runtime-code-and-tests/acceptance-criteria.md:60`). That range is the test folder, so the check proves the removal inside the tests and cannot see the one production caller at `.vibe/plugins/repo-guards/session-cleanup.mjs:51`. The row is honest about what it ran; what it cannot do is support the closure claim the packet reads from it.
- Overlay protocols - not run this iteration; no overlay claim is made.

## Integration Evidence

Exact surfaces checked, not merely named:

- `.vibe/plugins/repo-guards/session-cleanup.mjs` - the Mistral Vibe hook, read end to end at its import (`:77`), its two call sites (`:51`, `:60`) and its entry (`await runGuard(main, 'session-cleanup')`).
- `.vibe/plugins/repo-guards/lib/hook-io.mjs:112-124` - `runGuard`'s catch path, which is what turns the throw into one stderr line and exit code 0.
- `.vibe/plugins/README.md:95,118,163` - the hook matrix row that declares the adapter live and the kill switch that is its only disable path.
- `.opencode/plugins/ARCHITECTURE.md:224` with `tests/plugin-inventory.json:12` - the `global.disposed` rationale, read together because the doc claims the branch survives on purpose and the inventory carries the observation behind it.

## Edge Cases

- **Dispatch iteration number vs state.** The prompt's STATE SUMMARY and the config agree on iteration 4; the state log holds three `type:"iteration"` records plus one `iteration_start`, so the JSONL-derived number matches. No mismatch to report.
- **Dimension vs severity tag.** The P1 is `correctness` while the rotation is on `maintainability`. Recorded rather than reordered: the surfaces were selected by the D4 focus, and the defect they exposed is a behaviour break, so tagging it maintainability to fit the rotation would understate it.
- **A consumer outside the declared scope.** `.vibe/` is not in `reviewScopeFiles`. A removal finding is not checkable without its consumers, so the file was read as an integration surface and the finding is anchored on the in-scope producer. Neither `.vibe/plugins/repo-guards/session-cleanup.mjs` nor the intermediate `.opencode/plugins/session-cleanup.js:375` appears in `reviewScopeFiles`; both are named as integration surfaces and neither was modified. This is the reading the review-boundaries clause allows; it is stated here so the reducer and the operator can see it rather than infer it.
- **Unverified reach.** The throw is inferred from the export shape and from `runGuard`'s documented catch. The hook was not executed, so "throws" means "the call target is `undefined`"; nothing in the review depends on a live Vibe session.
- **Stale-prose precedence.** AC-007's cell says the check passes. The code and its consumers outweigh the prose; the row is treated as a scope gap, not as evidence of correctness.

## Confirmed-Clean Surfaces

- The `PluginInput` typedef (`.opencode/plugins/lib/v2-bridge.js:307-316`) matches what `setup` actually passes: only `client`, `worktree` and `directory` carry values; `project`, `experimental_workspace`, `serverUrl` and `$` are `undefined` (`:335-343`). The previously reported ambiguity about where `project` comes from is resolved in the current text.
- `dualPlugin`'s doc block (`:319-326`) and the returned object (`:593-595`) agree: enumerable `{ id, setup }`, non-enumerable `factory`, and the host reads only `setup`.
- The docs that describe the export shape are correct and were updated by the branch: `ARCHITECTURE.md:21`, `:123`, `README.md:18`.
- The `global.disposed` branches in `opencode-goal.js:3689`, `system-dist-freshness-guard.js:221` and `system-skill-advisor.js:1663` are not v1 leftovers: `decision-record.md:49` keeps them by name and `ARCHITECTURE.md:224` records that OpenCode 2.3.2 defines the bus type while delivery is uncaptured.

## Ruled Out

- **Orphaned `global.disposed` handlers left by the v1 removal.** Ruled out: ADR-001 keeps all three by name after reading the 2.3.2 binary, and the code matches the decision. No finding.
- **A stale native-lineage claim in the deep-loop presentation assets.** Ruled out: the two surviving mentions (`.skilled/commands/deep/assets/deep-review-presentation.txt:474`, `deep-research-presentation.txt:368`) assert that a native lineage is refused, which is the post-removal behaviour. No finding.
- **The legacy body file left behind by the asset sweep.** Ruled out: `.skilled/commands/deep/assets/legacy/deep-review.body.markdown` is still named as `legacyBodyPath` by `.skilled/skills/system-deep-loop/runtime/scripts/render-command-contract.cjs:29`, so it has a reader.
- **`--pure` surviving in a supported recipe.** Not re-entered: recorded BLOCKED at iteration 3 with two dated mentions, and nothing in this iteration's reads contradicts it.
- **`MAPPED_HOOKS` as a dead internal.** Ruled out as dead code (it drives the skipped-key filter at `:348`); only its export is surplus, which is the P2 above.

## Next Focus

- Dimension: none remaining; iteration 5 is the final pass on the four dimensions already covered.
- Focus area: the fix surface for the P1 rather than new ground - whether a restore of the `server` key, a `.factory`-based call, or a stale-adapter retirement is the smaller change, and whether AC-007's check should be re-scoped to the repository root.
- Reason: D1-D4 are complete and the only active required finding is the P1 above; a fifth pass that opens a new dimension would dilute the run rather than converge it.
- Rotation status: D1 complete, D2 complete, D3 complete, D4 complete.
- Blocked/productive carry-forward: reading a removal against its consumers, not against its own test folder, is what produced the P1; apply the same consumer sweep to the rest of the removed keys in the final pass.
- Required evidence: `.vibe/plugins/repo-guards/session-cleanup.mjs` against whichever fix shape the operator picks, plus the AC-007 cell after re-scoping.
- Recovery note: none; no iteration is stuck.

Review verdict: CONDITIONAL
