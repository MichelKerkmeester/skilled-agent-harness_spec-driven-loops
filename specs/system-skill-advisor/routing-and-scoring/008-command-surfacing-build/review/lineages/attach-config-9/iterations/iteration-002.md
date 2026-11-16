# Review Iteration 002

## Dispatcher

- Lineage: `attach-config-9` (fan-out child, session `fanout-attach-config-9-1794835877856-5ghgm4`)
- Area: `attach-config` per `review/review-scope-9.txt`
- Dimension: security
- Operator review focus: `review/review-brief-9.txt` governs, and this iteration takes its second named subject -- "the vitest config that clears an inherited AI_SESSION_CHILD and sets a per-run temp folder". It treats that config as a trust boundary: what the suite inherits, what it exports, who may read the temp records, and whether clearing the flag can weaken any assertion that is meant to prove a child-session boundary. Holdout rule honoured: no prompt store was opened, no `--summary`, no CLI session text, no hook-flags file.
- Steer channel: `steer.md` still does not exist in this lineage folder.
- Sources read: `review/review-brief-9.txt`; `review/review-scope-9.txt`; `runtime/vitest.config.ts` 1-35 at `05f776202e0`; the shared setup `system-spec-kit/runtime/tests/_support/vitest-setup.ts:1-80`; `runtime/lib/render.ts:44-52,525-535`; every `AI_SESSION_CHILD` reference under the advisor runtime (8 files, 22 matches); `runtime/tests/measure-brief-cost.vitest.ts:44-56,130-140`; `runtime/scripts/routing-accuracy/run-command-behaviour.mjs:1033-1061`; `runtime/tests/command-behaviour-guards.vitest.ts:12-40`; `runtime/tests/render-child-session.vitest.ts:40-152`.

## Files Reviewed

- `.skilled/skills/system-skill-advisor/runtime/vitest.config.ts` (8-35) [SOURCE: .skilled/skills/system-skill-advisor/runtime/vitest.config.ts:16]
- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts` (417-470, refusal and question leads as an input boundary) [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:417]
- `.skilled/skills/system-skill-advisor/runtime/tests/doctor-brief-render.vitest.ts` (56-100, the child and parent pins) [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/doctor-brief-render.vitest.ts:76]
- `.skilled/skills/system-skill-advisor/runtime/tests/command-attach-guards.vitest.ts` (414-470) [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/command-attach-guards.vitest.ts:455]

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

None.

## Traceability Checks

| Protocol | Status | Evidence |
|----------|--------|----------|
| `spec_code` | partial | Security scope only; the requirement comparison is iteration 3. The ADR the child shape implements was confirmed here: a dispatched child sees a surfaced command marked parent-named only unless it is a read-only run command. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/decision-record.md:65] |
| `checklist_evidence` | notApplicable | No `checklist.md` in the phase-parent packet; scope is the four area files. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/spec.md:1] |

## Integration Evidence

- The temp root is a single owner-only folder from `mkdtempSync`, exported on `TMPDIR`, `TEMP` and `TMP` so a POSIX or Windows child resolves the same root. The advisor's durable metrics root is `join(tmpdir(), 'speckit-skill-advisor-metrics')`, which therefore lands inside the run folder for both writer and reader, so test-generated records never reach the operator's real metrics folder. [SOURCE: .skilled/skills/system-skill-advisor/runtime/vitest.config.ts:16] [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/metrics.ts:185]
- The shared setup only fills a temp variable that is missing or non-absolute, so it cannot overwrite the run folder this config installed. Its scratch database defaults to `os.tmpdir()` as well, which is the same run folder. [SOURCE: .skilled/skills/system-spec-kit/runtime/tests/_support/vitest-setup.ts:11]
- `render.ts` derives the child shape from one environment read, `options.childSession ?? process.env.AI_SESSION_CHILD === '1'`, so the single `delete process.env.AI_SESSION_CHILD` is a complete clear for the renderer. An explicit `childSession` option still wins over the environment in both directions. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/render.ts:529]
- Every advisor test that needs the child shape sets it itself: `render-child-session.vitest.ts` stubs it in 11 places including the `'1'`, `'0'`, `'true'` and `''` matrix; `command-brief-golden.vitest.ts` and `hooks/skill-advisor-cli-fallback-envelope.vitest.ts` stub it empty; `hooks/vibe-prompt-advisor.vitest.ts` deletes it from a copied env; `command-behaviour-guards.vitest.ts` stubs `'1'` before asserting the child environment drops it. [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/render-child-session.vitest.ts:49]
- The behaviour runner builds a spawned turn's environment from an allowlist rather than from `process.env` wholesale, so clearing the flag in the test process cannot weaken the assertion that a turn does not receive it -- the test injects the flag to prove the drop. [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/run-command-behaviour.mjs:1033]
- `measure-brief-cost.vitest.ts` has the matching property for the hook path: it launches the parent script with `AI_SESSION_CHILD: '1'` and asserts the spawned hook child does not carry it. [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/measure-brief-cost.vitest.ts:130]

## Edge Cases

- The clear is process-wide, not per test. A test that wants the child shape must set the flag itself, and the sweep found every one that does. A future test that assumes an inherited flag would silently render the parent shape; that is a coverage risk, not a security hole, because the suite's own boundary assertions inject the flag before proving the drop. [SOURCE: .skilled/skills/system-skill-advisor/runtime/vitest.config.ts:27]
- The exit handler runs only on a normal exit, which the comment states, so a signal-killed run leaves the folder behind. That is a recorded limit from an earlier pass, and this pass found no new input that changes it. [SOURCE: .skilled/skills/system-skill-advisor/runtime/vitest.config.ts:20]
- An `rmSync` failure inside the exit handler would surface as a nonzero process status on an otherwise green run. Nothing in the current suite holds a file open past teardown on this host, and the handler is unchanged by this branch, so it is noted rather than raised.
- `AI_SESSION_CHILD` is exported to nothing: the command-attach matcher reads no environment at all, so the widened suffix vocabulary adds no environment-dependent path to review under this dimension. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:221]

## Confirmed-Clean Surfaces

- The suite cannot read the operator's real metrics folder while it runs: writer and reader both resolve `tmpdir()` after the config has pointed it at the run folder. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/metrics.ts:185]
- The run folder is removed with `recursive: true, force: true` on normal exit and is never shared with a second run, because each config evaluation makes a new one. [SOURCE: .skilled/skills/system-skill-advisor/runtime/vitest.config.ts:20]
- The child flag is cleared before any test module evaluates, so no module-level read can capture the inherited value. [SOURCE: .skilled/skills/system-skill-advisor/runtime/vitest.config.ts:27]
- No test asserts child behavior from the ambient value: every assertion of the parent-named marker or its absence either stubs the flag or passes `childSession` explicitly. [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/doctor-brief-render.vitest.ts:84]
- The suffix matcher's input boundary is unchanged by the chain: the prompt is still folded, still matched against constant patterns, and the only prompt-built pattern in the module still escapes its phrase. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:417]

## Ruled Out

- A temp-folder exposure: carried forward and re-checked against the new three-variable export. `mkdtempSync` creates the directory owner-only, and adding `TEMP` and `TMP` points more children at that same protected folder rather than widening it. No new input reopens the direction. [SOURCE: .skilled/skills/system-skill-advisor/runtime/vitest.config.ts:16]
- A security regression from clearing the child flag: the clear is test-process only, production still reads the flag at `render.ts:529`, and the suite's child assertions inject the flag rather than inheriting it. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/render.ts:529]
- A hook child inheriting the cleared flag: the hook path's own test launches with the flag set and asserts the child lacks it. [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/measure-brief-cost.vitest.ts:130]
- Secrets reaching a behaviour turn now that the flag is cleared: the turn environment is allowlisted by name and prefix, independent of this config. [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/run-command-behaviour.mjs:1033]
- Re-reporting the macOS-only `isolation-check.sh` limit or the `started of offered` limit: neither is touched by this area and no new input breaks either.

## Next Focus

- Dimension: traceability and maintainability (cross-reference pass)
- Focus area: the accepted suffix vocabulary against the command documents and the packet's own record, then the accuracy and durability of the boundary the branch pins in its tests.
- Reason: correctness and security produced no finding; two dimensions remain and the next pass is the cross-reference pass the strategy allows under the iteration cap.
- Rotation status: correctness and security complete; traceability and maintainability in one pass, then one confirmation pass for the coverage-age signal.
- Blocked/productive carry-forward: source-imported probes and the AI_SESSION_CHILD sweep stayed productive; nothing blocked.
- Required evidence: a documented suffix the matcher refuses, a packet claim the diff contradicts, or a boundary decision with no test behind it.
- Recovery note: not in recovery.

Review verdict: PASS
