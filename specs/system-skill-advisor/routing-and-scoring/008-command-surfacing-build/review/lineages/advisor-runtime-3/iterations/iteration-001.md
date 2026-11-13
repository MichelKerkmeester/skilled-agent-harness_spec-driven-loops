# Review Iteration 001

- Dimension: correctness
- Operator review focus: narrow pass three over the `advisor-runtime` area; this iteration read the changed lines of the shared no-edit gate and of the subprocess busy scan, then followed each changed function to its callers. The focus's "changed lines and callers" boundary is what selected the four files below.
- Budget profile: verify (11-13 calls)
- Base/HEAD: `ec1869dae8..1ca14a44988d3812ef18d968aba304ed31481648`

## Dispatcher

`@deep-review` LEAF iteration dispatched by the fan-out lineage `advisor-runtime-3`, session `fanout-advisor-runtime-3-1794593402980-zhrui5`, generation 1, lineage mode `new`. Sources read this iteration: `review-scope-3.txt`, `017-review-pass-two-remediation/tasks.md`, `git diff ec1869dae8..HEAD` for the four files below, the current code at the cited lines, and `review/lineages/advisor-runtime-3/steer.md` (absent at read, so no lead ruling applied).

## Files Reviewed

- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:286-339`
- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/text.ts:2-6,147-163`
- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:17-20,674-690,876-887`
- `.skilled/skills/system-skill-advisor/runtime/lib/subprocess.ts:90-95,214-300,352-372`
- `.skilled/skills/system-skill-advisor/runtime/tests/command-attach-guards.vitest.ts:25-75,123-140`
- `.skilled/skills/system-skill-advisor/runtime/tests/scorer/read-only-explainer.vitest.ts:26-40`
- `.skilled/skills/system-skill-advisor/runtime/tests/command-meaning-anchor.vitest.ts:334-347`
- `.skilled/skills/system-skill-advisor/runtime/tests/subprocess-output-cap.vitest.ts:42-91`
- `.skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts:470-476` (caller of `attachCommand`)

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **`make no changes` reads a scope-limiting change request as a no-edit request** -- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:289` -- The widened pattern adds the alternative `make no changes` without a boundary that keeps it from matching a constraint inside a change request. `isNoEditRequest('create an agent that refactors the parser internals and make no changes to its public api')` returns `true`, so `attachCommand` returns `undefined` and the reader who asked for the change gets no command. The same value reaches `isReadOnlyExplainer` (`lib/scorer/text.ts:150`) and both `commandMeaningEligible` gates (`lib/scorer/fusion.ts:677,881`). The task that narrowed the pattern, T042, states the goal "a change request that limits its scope keeps its command" and tests `no changes to its public api`; the `make no changes` alternative reintroduces the same class the task removed.
   Finding class: class-of-bug (the wording class the same pattern introduced, not a single prompt).
   Scope proof: the alternative is on the changed line `command-attach.ts:289`; its consumers are `text.ts:150`, `fusion.ts:677` and `fusion.ts:881`, all changed in this diff to call the shared helper.
   Affected surface hints: hub command attachment (`handlers/advisor-recommend.ts:474`), read-only explainer gate, command-meaning eligibility.
   Case: `create an agent that refactors the parser internals and make no changes to its public api` returns `undefined` from `attachCommand('sk-doc', {action:'route',selectionKind:'single',targets:[{workflowMode:'sk-create-agent'}]}, prompt)` where `/create:agent` is expected. Verified by a tsx probe of the current source; the three T042 cases still return `false`.

## Traceability Checks

| Protocol | Status | Evidence |
|----------|--------|----------|
| `spec_code` | partial | T003/T004/T005 and T042 name the shared helper and its consumers; the consumers call `isNoEditRequest` at the three sites the task names. T042's stated intent is only partly met (finding AR3-P2-001). |
| `checklist_evidence` | pass | `env -u AI_SESSION_CHILD npx vitest run tests/command-attach-guards.vitest.ts tests/scorer/read-only-explainer.vitest.ts tests/command-meaning-anchor.vitest.ts` reported `3 passed (3)`, `56 passed (56)`, exit 0. |
| `skill_agent` | notApplicable | No agent file in this area. |
| `feature_catalog_code` | notApplicable | Catalog files are in the `doctor-docs` area. |

## Integration Evidence

- `attachCommand` has one production caller, `handlers/advisor-recommend.ts:474`, which passes the raw prompt; the changed gate therefore governs every recommendation that carries a compiled single-mode route.
- `isReadOnlyExplainer` is the scorer's explainer gate; `readOnlyRouteAllowed` and `commandMeaningEligible` in `fusion.ts` are the two command-eligibility gates the task names (`rg` shows exactly two `isNoEditRequest(promptLower)` call sites in `fusion.ts`).
- `runAdvisorSubprocess` retry decision reads `attemptResult.sawBusy || SQLITE_BUSY_PATTERN.test(attemptResult.stderr)` at `subprocess.ts:371`; `sawBusy` is set on every resolve path in `runSpawnAttempt`.

## Edge Cases

- `NO_EDIT_REQUEST` itself remains exported and is still tested directly (`command-attach-guards.vitest.ts:49`), so a caller that bypasses `isNoEditRequest` does not get the curly-apostrophe fold. No production caller does; recorded as a design edge, not a finding.
- The busy scan keeps only the last 64 characters between chunks. `SQLITE_BUSY` and `database is locked` are shorter than 64, and the new split test proves a two-write split after the cap; a marker split with more than 64 characters of unrelated text between its halves is not in reach for SQLite's own message.
- `subprocess.ts` retry now scans stderr before `capOutput`; a busy marker written after the cap changes a former `NON_ZERO_EXIT` into `SQLITE_BUSY_EXHAUSTED` with one retry, which is the behavior T029 asks for.

## Confirmed-Clean Surfaces

- `command-attach.ts` still has no `import` statement, so `text.ts` importing it introduces no cycle (checked with `grep '^import' command-attach.ts`, no output).
- `SQLITE_BUSY_PATTERN` has no `g` flag (`subprocess.ts:106`), so repeated `.test` calls are stateless.
- The T003, T004 and T005 matrix cases pass: the four no-edit endings, the curly-apostrophe helper case and the change-request cases all hold in the run above.

## Ruled Out

- A circular-import defect from `text.ts` importing `command-attach.js`: ruled out because `command-attach.ts` imports nothing.
- A lost-retry defect from the new `sawBusy` flag: ruled out by reading every `resolve` in `runSpawnAttempt` and the retry condition; both paths carry the flag.
- A wrongly-failing `attachCommand` on the T042 scope-limiting cases: ruled out by running the three test files; the three cases pass. Only the `make no changes` variant fails.

## Next Focus

- Dimension: correctness
- Focus area: the routing-accuracy scripts `command-offer.mjs`, `worktree-restore.mjs`, `run-command-behaviour.mjs`, `score-command-transcripts.mjs`, `capture-command-routing-baseline.mjs`, plus `measure-brief-cost.mjs` and `derive-command-bridges.cjs`
- Reason: the library and gate changes are now covered; the remaining changed production files are the runners and the bridge generator.
- Rotation status: correctness remains current until the runner pass completes.
- Blocked/productive carry-forward: none blocked; direct-read plus diff reading is productive for this narrow pass.
- Required evidence: per-file diff, current code, caller reads, one concrete input per finding.

Review verdict: PASS
