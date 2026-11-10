# Iteration 001 — Correctness

Dispatcher: deep-review iteration 1 of 5, focus correctness. Resolved route: mode=review target_agent=deep-review. Session `fanout-dsflash-llmgw-1791717087028-ifv8d2`, generation 1, lineageMode new, stopPolicy max-iterations (this run never stops on convergence before the cap).

## Dimension

Correctness: does each 015 commit do what its phase claims, read against the code it touches. Inventory pass over the 98-file scope bounded by `goal-file-manifest.txt`, then direct reads of the changed code paths.

## Files Reviewed

- `.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:2209-2226` — missing-config branch, `configWarnings` concat, defaults patch.
- `.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:588-594` — corruption-error preview now prints a file name for file-level warnings.
- `.skilled/skills/system-deep-loop/runtime/tests/unit/deep-review-state-reducer.vitest.ts:116-143` — the new lenient/strict test.
- `.skilled/bin/compiled-route-sync.cjs:1002-1036` — `--check` now compares every traced authored file with its served copy.
- `.skilled/bin/tests/compiled-route-manifest.test.cjs:518-537` — drift and missing-copy sandbox test.
- `.skilled/hooks/dispatch/lib/dispatch-audit.mjs:273-331` — `inspectDispatch` + `shellPayload` + the split quote-style regex.
- `.skilled/hooks/dispatch/lib/dispatch-audit.mjs:412-433` — `resolveSegment` per-segment unwrap (the same helper).
- `.skilled/hooks/dispatch/pi/dispatch-preflight-lint.ts:235-236` — guard early return on `kind === "none"`.
- `.skilled/hooks/vitest.config.ts:17-27,44` — `nodeTestFiles()` skip list.
- `.skilled/skills/system-spec-kit/runtime/hooks/lib/hook-stdin-deadline.test.mjs:233-333` — table-driven early/late rows and the three-copy parity test.
- `.opencode/plugins/system-skill-advisor.js:681-710,993` — `detectWorkspaceSurface` and its request wiring.
- `.skilled/skills/sk-doc/sk-create-skill/scripts/init_skill.py:564,644-651,728-734` — `packet_name` aliases and keywords.

Commands run (all read-only; `git status` before/after diff showed no writes outside the lineage):

- `node .skilled/bin/compiled-route-sync.cjs --check` → `all 55 served copies match their authored files`, exit 0.
- `node .skilled/skills/system-deep-loop/runtime/scripts/check-contract-drift.cjs` → `[CONTRACT DRIFT] OK commands=3`, exit 0.
- `node specs/sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/003-hub-surface-precedence/scratch/all-canaries.cjs` → `all hubs failures 0`, exit 0.
- Inline `inspectDispatch` probes (read-only) for the escaped-quote fix and the multi-wrapper case.
- Inline `reduceReviewState` probe (`write:false`) against `specs/hooks/002-injection-bloat-reduction/review/lineages/luna-max` (a real state log with no config): lenient reduced with the file-named warning, strict threw `STATE_CORRUPTION` naming `deep-review-config.json`.

## Findings by Severity

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **A dispatch inside a later shell wrapper classifies as none, so the Pi preflight guard never inspects it** -- `.skilled/hooks/dispatch/lib/dispatch-audit.mjs:326` -- `shellPayload` unwraps the FIRST `bash -c` wrapper in the whole command and `inspectDispatch` returns the recursion's verdict for that payload only (`dispatch-audit.mjs:296`). A compound command whose first wrapper is inert and whose second wrapper carries the dispatch reaches `{kind:"none"}`, and the Pi guard returns at `inspection.kind === "none"` (`.skilled/hooks/dispatch/pi/dispatch-preflight-lint.ts:236`) without applying the skill-naming gate. Confirmed by direct execution: `inspectDispatch(String.raw`bash -c 'true' ; bash -c "devin -p task </dev/null"`)` → `{"kind":"none"}` while the reverse order returns `{"kind":"direct","executor":"cli-devin"}`. Pre-existing: the old single-regex match was also first-match-only, so the range's escaped-quote fix neither introduced nor worsened this; recorded as an advisory coverage gap in the changed helper.
   Finding class: guard coverage gap (pre-existing, advisory)
   Scope proof: `shellPayload` and its call site are exactly the lines this range rewrote; the unwrap path is `.skilled/hooks/dispatch/lib/dispatch-audit.mjs:326-331`, consumed at `.skilled/hooks/dispatch/pi/dispatch-preflight-lint.ts:235-236`.
   Affected surface hints: Pi `tool_call` preflight; the hooks' `resolveSegment` loop already unwraps per segment (`.skilled/hooks/dispatch/lib/dispatch-audit.mjs:418-433`), so only the `inspectDispatch` path is single-wrapper.
   Case: a compound command whose first `bash -c` payload is inert and whose second `bash -c` payload is `devin -p task </dev/null` is classified `none`; the Pi guard never reads it as a dispatch, and the escaped-quote fix that made a single wrapper readable does not change that outcome.

## Traceability Checks

- `spec_code` (core) — partial this iteration: the four code-phase claims read (007 reducer, 006 sync check, 004 dispatch/vitest, 008 advisor) each map to their commit diff and to current source; the doc-phase claims (001, 002, 003, 005 README, 009 ledger) are deferred to the traceability iteration.
- `checklist_evidence` (core) — pending: phase `tasks.md` checkboxes are read in the traceability iteration.
- Overlay protocols — pending.

## Edge Cases

- The `--check` comparison uses `path.relative(sourceRoot, abs)` against `runtimeRoot`; a sandbox test passes `runtimeRoot` only and still traces authored files from the real root, which is hermetic because `buildFreshRuntime` copies the authored closure. Verified by running `--check` on the real tree: 55/55 match, exit 0.
- `detectWorkspaceSurface` caches a `null` result for a `projectDir` whose `realpathSync` threw once (`.opencode/plugins/system-skill-advisor.js:681,684,696`). The hint only steers advisor tie-breaks and a miss sends no hint (fail-open), so this stays an edge note rather than an active finding.
- `nodeTestFiles()` excludes 16 `node:test` suites and keeps 2 vitest suites in `.skilled/hooks` (enumerated by direct script over the tree); the phase's `node --test -> 257 pass, 0 fail` covers the skipped set. A future vitest suite that imports only `vitest/config` (never `'vitest'`) would be skipped silently; no such file exists today.

## Confirmed-Clean Surfaces

- The reducer missing-config change does exactly what phase 007 claims, on real data: lenient proceeds on defaults with a warning naming the file; strict throws `STATE_CORRUPTION` naming the file; the added unit test asserts both modes and the previous ENOENT path is gone.
- The compiled-route `--check` change does what phase 006 claims: drift and missing copies are both detected byte-for-byte, the failure message names each file and the repair, and `--check` still writes nothing (documented and confirmed by the clean git status).
- The escaped-quote fix does what phase 004 claims: `bash -c "devin -p \"task\" </dev/null"` inspects as `direct`, the expansion case stays `ambiguous`, and the quoted-dispatch case stays `none`.
- `init_skill.py` uses `packet_name` defined at line 564 in both new keyword sites (lines 647 and 734); no NameError path.
- The hook deadline table drives every short-deadline entry for both the in-time and late write, and the three-copy 500 ms parity test fails on any mismatch.

## Ruled Out

- Deep recursion in `inspectDispatch` via nested wrappers: each recursion consumes at least the wrapper text, a stack overflow is caught by the existing `catch (_) { return { kind: 'none' } }`, and the case is contrived; not an active finding.
- `workspaceSurfaceCache` unbounded growth: bounded by the number of distinct workspace roots in one plugin process; not actionable.
- Reducer `readJson` behavior on an existing but corrupt config: unchanged by this range and not part of its claim; deferred as out of the changed surface.

## Integration Evidence

- `.skilled/bin/compiled-route-sync.cjs --check` (canonical sync gate) — exit 0, 55/55 copies match.
- `.skilled/skills/system-deep-loop/runtime/scripts/check-contract-drift.cjs` (compiled contract gate) — OK commands=3, exit 0.
- `all-canaries.cjs` (hub surface canaries) — all hubs failures 0, exit 0.
- `.skilled/hooks/dispatch/pi/dispatch-preflight-lint.ts` is the Pi runtime consumer of the changed `dispatch-audit.mjs` helper; its test file pins the new allowed case.

## Next Focus

- Dimension: D2 security
- Focus area: wrapper and expansion handling in the dispatch guard (the multi-wrapper residual, variable-expansion fail-open and fail-closed boundaries), hook stdin deadline behavior under a hostile host, and the advisor plugin's workspace-marker reads as an input boundary.
- Reason: dimension order correctness → security; the correctness pass surfaced one guard-coverage advisory whose adversarial framing belongs in the security pass.
- Rotation status: D1 reviewed; D2 next; D3 and D4 pending.
- Required evidence: direct reads plus executable probes at cited file:line; no active P0/P1 may rely on inference.

Review verdict: PASS
