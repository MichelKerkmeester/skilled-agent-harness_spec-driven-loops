# Review Iteration 002

## Dispatcher

- Mode: review (fan-out lineage `render-hooks-plugin-2`, pass two)
- Session: `fanout-render-hooks-plugin-2-1794570021136-noekp0`, generation 1, lineage mode `new`
- Review target: `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build`
- Area: `render-hooks-plugin` — the hook fallback, hook entry points, process layer, plugin and their tests
- Operator review focus addressed this iteration: "safety of offering a mutating command; holdout hygiene, so no tune, fix or report path reads or leaks holdout rows" plus pass-one fix verification for `R2-P2-002` (`subprocess.ts` output caps). The holdout check is a negative result recorded under Confirmed-Clean Surfaces; the two new findings below are the defects the changed hook surface introduced.
- Budget profile: `verify` (12 analysis actions)

## Files Reviewed

- `.skilled/skills/system-skill-advisor/runtime/lib/subprocess.ts:95-160`, `:240-270` — the new `MAX_OUTPUT_CHARS` cap and both stream handlers
- `.skilled/skills/system-skill-advisor/runtime/tests/subprocess-output-cap.vitest.ts:1-67` — both cap cases
- `.skilled/skills/system-skill-advisor/hooks/lib/skill-advisor-cli-fallback.ts:130-300`, `:352-390`, `:450-540` — CLI spawn, option payload, recommendation mapping, degraded metric
- `.skilled/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts:236-260`, `:415-435` — `emitDiagnostic`, degraded field
- `.skilled/skills/system-skill-advisor/hooks/skill-advisor-hook-validation.md:88-112` — the durable-JSONL section as changed
- `.opencode/plugins/system-skill-advisor.js:370-400`, `:1074-1084`, `:1582-1592`, `:1695-1710` — plugin options, jsdoc, removed compiled-route line, status output
- `.opencode/plugins/tests/system-skill-advisor.test.cjs:365-470` — the rewritten route-rendering cases
- `.opencode/plugins/README.md:70-80`, `:150-158` — shared renderer and plugin responsibilities
- Git diff `35c3188681..HEAD` for all files above

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **The bounded-route option now controls nothing the plugin emits** -- `.opencode/plugins/system-skill-advisor.js:379` -- The fix removed the only consumer of `boundedCompiledRouteSummary` when it deleted the `renderCompiledRouteSummaryLine` delivery at `:1582-1590`, but the option is still resolved from `SYSTEM_SKILL_ADVISOR_COMPILED_ROUTE_BOUNDING` (`:62`, `:395`), still documented as "Bound long compiled-route target lists" (`:1080`), and still reported as `bounded_compiled_route_summary=` by `spec_kit_skill_advisor_status` (`:1704`). A reader who sets the flag and checks status is told a bounding that no longer has an output to bound.
Case: `MkSkillAdvisorPlugin(ctx, { boundedCompiledRouteSummary: true })` with a response whose `metadata.compiledRouteSummary` holds ten targets produces exactly one system block (the head); `status` still reports `bounded_compiled_route_summary=true`. The same call with the flag false is byte-identical.
Finding class: consumer-removal residue
Scope proof: `rg -n "boundedCompiledRouteSummary" .opencode` returns only `:379`, `:395`, the jsdoc at `:1080` and the status line at `:1704`; the test that used to assert the bounded line now asserts `output.system.length === 1` (`tests/system-skill-advisor.test.cjs:411-436`).
Affected surface hints: `.opencode/plugins/system-skill-advisor.js` option resolver, status tool output, `.opencode/plugins/README.md` if the env knob is documented there, and the test matrix in `tests/system-skill-advisor.test.cjs`.

2. **Capping stderr at 1 MiB hides a SQLITE_BUSY marker written past the cap, so the busy retry no longer fires** -- `.skilled/skills/system-skill-advisor/runtime/lib/subprocess.ts:144-150` -- `capOutput` drops every byte after `MAX_OUTPUT_CHARS` and `SQLITE_BUSY_PATTERN` is then matched against the truncated string in `classifyFailure`. The new test pins the regression: `tests/subprocess-output-cap.vitest.ts:47-66` writes 1 MiB of stderr, then `database is locked`, and asserts `errorCode: 'NON_ZERO_EXIT'` with `retriesAttempted: 0` where the pre-cap code matched the busy pattern and retried.
Case: an advisor child emits 1,048,577 bytes of warnings and then dies with `SQLITE_BUSY`; the hook reports a non-retryable non-zero exit and never retries, although the daemon is merely busy.
Finding class: cross-consumer (every caller of `runAdvisorSubprocess` shares the retry classification)
Scope proof: `capOutput` is the only accumulator on both `stdout` and `stderr` (`:250-255`), and the busy marker is read from the accumulated `stderr` in `classifyFailure`; no side-channel retains the tail.
Affected surface hints: `runtime/lib/subprocess.ts` retry classification, the hook fallback's degraded path, and the test that currently codifies the lost marker.

3. **The validation playbook says every hook run writes a health record, but the OpenCode plugin never writes one** -- `.skilled/skills/system-skill-advisor/hooks/skill-advisor-hook-validation.md:100` -- The changed sentence claims "Every hook run writes a prompt-free health record to the diagnostics sink". `persistAdvisorHookDiagnosticRecord` is called only from `hooks/claude/user-prompt-submit.ts:244`, which the Claude, Pi and DSH entry points reach with a runtime label; the OpenCode plugin (`system-skill-advisor.js`) has no diagnostics import and spawns the CLI directly, so an OpenCode session produces a brief and no health record. Step 3's own instruction ("drive a prompt through any runtime hook ... and confirm a fresh line appears") therefore fails on OpenCode.
Case: one OpenCode prompt that delivers a brief; `${TMPDIR}/speckit-skill-advisor-metrics/diagnostics.jsonl` gains no line, and the next `advisor_validate` health rollup reports no invocation for that session.
Finding class: doc-code divergence
Scope proof: `rg -n "persistAdvisorHookDiagnosticRecord"` over `.skilled/skills/system-skill-advisor` and `.opencode/plugins` returns the Claude hook and its tests only; `rg -n "diagnostic" .opencode/plugins/system-skill-advisor.js` returns no hit.
Affected surface hints: `hooks/skill-advisor-hook-validation.md` Step 3, `hooks/claude/user-prompt-submit.ts` persistence seam, and the plugin's CLI delivery path.

## Pass-One Fix Verification

- **R2-P2-002 (`subprocess.ts:239`, uncapped stdout/stderr) — the cap holds, with the regression above.** `capOutput` bounds both streams at `MAX_OUTPUT_CHARS` (`:144-150`) and both handlers assign through it (`:250-255`). `tests/subprocess-output-cap.vitest.ts` passes: a 2 MiB JSON array returns `JSON_PARSE_FAILED`, and the stderr case stops at the cap. The cap is real; the finding above is what the cap's truncation costs.
- **The child downgrade still applies on the CLI fallback path.** `recommendationFromCli` now carries `command`, `policy`, `ownerSkillId` and `needsMode` through (`hooks/lib/skill-advisor-cli-fallback.ts:365-390`), so the renderer's `(parent-named only)` rule reaches a hook-delivered row, not only an in-process one. `tests/hooks/skill-advisor-cli-fallback-envelope.vitest.ts` passes.
- **Runtime list parity (R4-P2-001--09ff48e9a0b9).** `tests/hooks/advisor-runtime-list-parity.vitest.ts` passes against `ADVISOR_RUNTIME_VALUES`; the added `Object.keys(capabilities)` assertion is present in the file reviewed in iteration 3.
- Test run: `env -u AI_SESSION_CHILD npx vitest run tests/subprocess-output-cap.vitest.ts tests/hooks/skill-advisor-cli-fallback-envelope.vitest.ts tests/hooks/advisor-runtime-list-parity.vitest.ts` -> 3 files, 8 tests passed, exit 0.

## Traceability Checks

| Protocol | Level | Status | Notes |
|---|---|---|---|
| `spec_code` | core | partial | The hook health record matches the changed doc for Claude/Pi/DSH; the OpenCode gap is finding 3. |
| `checklist_evidence` | core | notApplicable | No checklist row governs this code pass. |
| `skill_agent` | overlay | notApplicable | No agent definition in this area's changed set. |
| `agent_cross_runtime` | overlay | partial | Claude, Pi and DSH share `handleClaudeUserPromptSubmit` with a runtime label; OpenCode uses its own plugin path and is the subject of finding 3. Devin and Codex have no prompt hook in this area. |
| `feature_catalog_code` | overlay | deferred | `hooks-and-plugin/claude-hook.md` is iteration 4. |
| `playbook_capability` | overlay | partial | `hooks/skill-advisor-hook-validation.md` Step 3 reviewed; finding 3 records where the playbook and code disagree. |

## Integration Evidence

- Hook entry points named: `.skilled/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts` (Claude), `hooks/pi/prompt-advisor.ts:283-301` (Pi), `hooks/dsh/prompt-advisor.mjs:122-131` (DSH), `.opencode/plugins/system-skill-advisor.js` (OpenCode plugin).
- CLI fallback surface named: `hooks/lib/skill-advisor-cli-fallback.ts` spawns `.skilled/bin/skill-advisor.cjs advisor_recommend --json -` with `includeCompiledRoute: true` and `compiledRouteTopOnly: true`; the CLI handler reads both at `runtime/handlers/advisor-recommend.ts:630-632`, `:705-707`.
- Health-record sink named: `persistAdvisorHookDiagnosticRecord` in `runtime/lib/metrics.ts:453-462`, with `writeBoundedJsonl(..., { requireDebug: false })` at `:322-323`.

## Edge Cases

- **Hook latency with the new compiled-route request.** `includeCompiledRoute` was false and is now true. Measured warm, warm-only CLI calls: 88/98/90 ms without the route and 160/134/134 ms with `compiledRouteTopOnly`. The fallback budget is 250 ms (`DEFAULT_CLI_FALLBACK_TIMEOUT_MS`, `:88`), so the added route fits on a warm daemon; a cold daemon already exceeds the budget before this change. No finding, recorded so the headroom is known.
- **`degraded` freshness vs metric.** `freshnessFrom` maps a local-scorer answer to `stale` (`:334-338`) while `metrics.degraded` is set separately (`:514-518`). The health record carries the flag, so a reader cannot distinguish stale-graph from degraded-scorer through `freshness` alone; the metric is the named carrier and the changed doc says so. No finding.
- **Prompt-free health record.** `persistAdvisorHookDiagnosticRecord` strips `skillLabel` and `errorDetails` unless `SKILL_ADVISOR_DEBUG` is set (`runtime/lib/metrics.ts:453-462`); the remaining fields are closed labels plus duration and byte counts. No prompt text is persisted on the default path.

## Confirmed-Clean Surfaces

- **Holdout hygiene in this area.** `rg -n "holdout|command-prompts"` over `.opencode/plugins`, `.skilled/hooks/shared/session-readers`, `.skilled/skills/system-skill-advisor/hooks` and `runtime/lib` returns one prose mention in the validation playbook (line 94, an `advisor_validate` slice list). No render, hook, tune or report path in this area opens a holdout fixture; no holdout row was read or printed in this iteration.
- **No prompt text in the fallback payload's argv.** The CLI payload (including the prompt) is written to stdin, not argv (`hooks/lib/skill-advisor-cli-fallback.ts:262-269`), so the process table exposes nothing.
- **Child environment for the CLI.** `childEnvForCli` copies the caller environment and adds the socket dir and prompt-time marker (`:203-209`); it inherits whatever the host has, which is the caller's own session, not a widened boundary. Not a new exposure.
- **Plugin mapper keeps only known policy values.** `policy` is forwarded only for `run|start|ask`, `ownerSkillId` only when non-blank, `command` only when non-blank, `needsMode` only when true (`.opencode/plugins/system-skill-advisor.js:574-585`).

## Ruled Out

- **Removing the compiled-route summary line drops a documented feature.** The plugin README describes `lib/skill-advisor-render.js` as the fallback and compiled-route renderers "shared by the advisor plugin and its tests" (`README.md:76`); the fallback half is still shared, so the sentence is not false. The dead renderer itself sits outside this area's changed set and is noted as an affected surface of finding 1 rather than a separate finding.
- **The new compiled-route request leaks the prompt.** `enrichCompiledRoutes` receives the prompt inside the already-spawned CLI; it adds no new transport. The env and argv surfaces are unchanged.
- **`getStatus` reporting an inert flag is harmless.** It is harmless to the brief, but it is the observable half of finding 1 and is cited there, not as a separate finding.

## Next Focus

- Dimension: correctness
- Focus area: the four session readers (`claude.mjs`, `devin.mjs`, `dsh.mjs`, `pi.mjs`), `index.mjs`, their tests, and the pass-one fixes `R1-P2-002--fabc628596e7`, `R1-P2-003`, `R1-P2-004` and `R4-P2-001--09ff48e9a0b9`.
- Reason: the hook fallback and process layer are done; the largest unchanged-in-pass-two block of pass-one fixes is the session-reader cluster, where containment and transcript fallback interact.
- Rotation status: dimension 1 of 4 revisited (correctness after security).
- Blocked/productive carry-forward: none.
- Required evidence: the committed diff of each reader, one direct read of each changed loader branch, and the four session-reader test files.

Review verdict: PASS
