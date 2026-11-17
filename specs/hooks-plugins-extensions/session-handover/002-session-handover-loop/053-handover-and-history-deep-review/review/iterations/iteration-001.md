# Iteration 001: correctness

## Dispatcher

- Run: iteration 1 of 5, session `2026-11-17T06:46:29Z`, generation 3, lineage `restart`.
- Dimension: correctness. Iteration number derived from the state log (zero `type:"iteration"` records, so 1) and matches the dispatch.
- Operator focus (handover logic and history search across every runtime) was covered on the shared path every runtime goes through: the `skilled-loop` wrapper hop and decline paths, the relaunch core decision, claim, supersede and manual-command builders, the CLI `prepare`, `should-relaunch`, `claim`, `consume` and `hand-over` commands, the hop history, and the history navigator search, browse and load. Per-runtime adapter files (Claude, Codex, OpenCode, Pi, Vibe hook entry points) were reached only through the wrapper's per-runtime argument builders this iteration; their own hook files are the carried-forward target.

## Files Reviewed

- `.skilled/bin/skilled-loop:1-1636` (whole file)
- `.skilled/hooks/session-handover/lib/relaunch-core.cjs:60-429`, `:1635-1944`
- `.skilled/hooks/session-handover/bin/session-handover.cjs:560-899`
- `.skilled/hooks/session-handover/lib/hop-history.cjs:30-264`
- `.skilled/hooks/session-handover/history/lib/navigator.ts:120-575`
- `.skilled/hooks/session-handover/history/README.md:87,104` (contract lines)
- `.skilled/hooks/session-handover/runtime-behavior.md:71-75` (name numbering contract)

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **History search `files` filter is exact string equality, with an undocumented format** -- .skilled/hooks/session-handover/history/lib/navigator.ts:559 -- `matchesFilters` keeps a turn only when every requested file is `includes`-equal to an entry of `metadata.files`, which holds the path exactly as the tool call argument carried it (absolute in most runtimes). Free-text search indexes the same paths split into segments (`navigator.ts:256-262`), so `query: "relaunch-core.cjs"` finds the turn while `files: ["relaunch-core.cjs"]` or a repo-relative path silently returns nothing. The README lists `files` as a filter with no word on the form it must take (`history/README.md:87`, `:104`), so a receiver that narrows a search by file can conclude the file was never touched.
   Finding class: contract-gap (filter semantics vs documented surface)
   Scope proof: one predicate in `HistoryNavigator.matchesFilters`; no other filter path exists in `navigator.ts`.
   Affected surface hints: `history/lib/navigator.ts` `matchesFilters`; `history/README.md` search row; any adapter docs that tell a receiver to filter by file.
   Case: a receiver calls search with `files: ["lib/relaunch-core.cjs"]` after a turn that edited `/abs/repo/.skilled/hooks/session-handover/lib/relaunch-core.cjs`, and gets an empty result.

## Traceability Checks

| Protocol | Status | Evidence | Summary |
|---|---|---|---|
| `spec_code` | pass | `.skilled/hooks/session-handover/runtime-behavior.md:73`, `.skilled/bin/skilled-loop:295-304`, `.skilled/bin/skilled-loop:432` | Name numbering contract (stem plus next number, first receiver `(2)`) matches `name_stem` and `append_name_arguments`, and the wrapper tests assert `(2)` for the first hop. |
| `checklist_evidence` | partial | `.skilled/hooks/session-handover/bin/session-handover.cjs:588`, `.skilled/hooks/session-handover/lib/relaunch-core.cjs:1724` | Hop-cap behaviour agrees between prepare and should-relaunch; packet checklist rows were not walked this iteration (traceability dimension owns them). |

## Integration Evidence

- Wrapper to CLI: `.skilled/bin/skilled-loop:1308` calls `session-handover.cjs should-relaunch`; `:99` calls `consume`; `:114` calls `hand-over`. Each CLI command read at `bin/session-handover.cjs:668-709`, `:799-877`, `:883-899`.
- Wrapper to core: manual command built by `relaunch-core.cjs:1895` `manualClaimCommand` through `skilled-loop:83-89`; note state through `relaunch-core.cjs:407` `noteState` via `skilled-loop:506-515`.

## Edge Cases

- **Strategy vs state contradiction (ambiguity):** the strategy file listed correctness and security as completed and Next Focus as traceability, while the state log holds zero iteration records and the dispatch names correctness. The dispatch plus the JSONL-derived count were followed; the strategy dimension lists were rewritten to match the state.
- **Consume run from the wrapper's current directory on early decline paths:** `skilled-loop:1329`, `:1344`, `:1350` consume before `cd -- "$relaunch_cwd"`, and the CLI resolves the record's note through `handoffPathWithinRepo` (`bin/session-handover.cjs:829`). When the wrapper's directory and the record's cwd sit in different checkouts, the note could be dropped as outside the repo. Not proven reachable this iteration (the record cwd is the sender's own `process.cwd()`, normally the wrapper's); carried forward.
- **Launch name already numbered:** a launch named `X (2)` produces a receiver also named `X (2)`; documented as intended at `runtime-behavior.md:73`.

## Confirmed-Clean Surfaces

- `consumed_withdrawn` substring match (`skilled-loop:135-137`): a quote inside any record value is escaped by `JSON.stringify`, so `"withdrawn":true` can only match the real key.
- Manual claim command escaping (`relaunch-core.cjs:1897-1904`): `\ " $ \`` and `!` are escaped for the double-quoted seed; the spec folder suffix is restricted by `validSpecFolder`; other carried options are single-quoted by `shell_quote_argument` (`skilled-loop:568-584`).
- Hop cap: `prepare` declines at `hops >= maxHops` (`bin/session-handover.cjs:588`) with the same switch and default that `shouldRelaunch` uses (`relaunch-core.cjs:1719-1726`), and the record count is never coerced.
- Stale and clock-step handling in `shouldRelaunch` (`relaunch-core.cjs:1705-1713`).
- Claim, complete and supersede run their read and write under one lock per note (`relaunch-core.cjs:1780`, `:1806`, `:1849`).
- Wrapper `SKILLED_LOOP_HOPS` is unset at launch (`skilled-loop:955-957`) and validated before the loop (`:1262-1266`); the arithmetic at `:432` and `:1419` only runs after validation.
- Navigator browse with an empty history and no anchor returns `[]` before index math (`navigator.ts:483`); search with no terms and no filter returns `[]` (`:446`).
- Hop history counts: `readHistory` treats `last` as a count and zero as nothing (`hop-history.cjs:69-71`, `:161-162`).

## Ruled Out

- First receiver numbered `(2)` instead of `(1)`: intended, documented at `runtime-behavior.md:73`, asserted by `tests/skilled-loop-wrapper-launch-arguments.test.cjs:261`.
- AppleScript injection through the hop notice (`hop-history.cjs:134-137`): `JSON.stringify` escapes `"` and `\` the way an AppleScript string literal reads them, and the goal is flattened first.
- `notifyHandOver` returning true where `osascript` is absent: the doc promises only that a notice was requested, which holds.

## Next Focus

- Dimension: security
- Focus area: per-runtime hook entry points (Claude `handover-*.mjs`, Codex `handover-*.mjs` and `shared.mjs`, `opencode/session-handover.js`, `pi/session-handover.ts`, `vibe/handover-parts.mjs`), `lib/killer.cjs` process targeting, `lib/withdraw.cjs`, and `handoffPathWithinRepo` trust boundary for record and seed paths.
- Reason: correctness of the shared path is clean; the adapters and the killer are where untrusted payloads and process signals enter.
- Rotation status: correctness done (1/4).
- Blocked/productive carry-forward: productive = direct reads of wrapper decision branches; carry the consume-before-cd edge case.
- Required evidence: file:line for any signal target or path acceptance that leaves the repo or the loop.

Review verdict: PASS
