# Review Iteration 002

- Dimension: correctness
- Operator review focus: narrow pass three over the `advisor-runtime` area; this iteration read every changed line of the routing-accuracy runners, the cost script and the bridge generator, then followed each changed export to its caller and test. The focus's "changed lines and callers" boundary is what bounded the file list below.
- Budget profile: verify (11-13 calls)
- Base/HEAD: `ec1869dae8..1ca14a44988d3812ef18d968aba304ed31481648`

## Dispatcher

`@deep-review` LEAF iteration dispatched by the fan-out lineage `advisor-runtime-3`, session `fanout-advisor-runtime-3-1794593402980-zhrui5`, generation 1. Sources read this iteration: `review-scope-3.txt`, `017-review-pass-two-remediation/tasks.md` task lines T009 to T021 and T029, `git diff ec1869dae8..HEAD` for the eight files below, the current code at the cited lines, the changed tests, `steer.md` (absent).

## Files Reviewed

- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/command-offer.mjs:326-500`
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/worktree-restore.mjs:38-128`
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/run-command-behaviour.mjs:794-820,982-1000,1150-1258`
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs:1-130`
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/capture-command-routing-baseline.mjs:81-96,361-397,680-692`
- `.skilled/skills/system-skill-advisor/runtime/scripts/measure-brief-cost.mjs:155-180`
- `.skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/derive-command-bridges.cjs:955-968,1408-1415`
- `.skilled/skills/system-skill-advisor/runtime/tests/command-offer.vitest.ts:286-526`
- `.skilled/skills/system-skill-advisor/runtime/tests/worktree-restore.vitest.ts:111-147`
- `.skilled/skills/system-skill-advisor/runtime/tests/command-behaviour-guards.vitest.ts:66-110`
- `.skilled/skills/system-skill-advisor/runtime/tests/command-transcript-score.vitest.ts:622-638`
- `.skilled/skills/system-skill-advisor/runtime/tests/command-routing-slice.vitest.ts:21-120`
- `.skilled/skills/system-skill-advisor/runtime/tests/derive-command-bridges-strings.vitest.ts:1-33`
- `.skilled/skills/system-skill-advisor/runtime/tests/measure-brief-cost.vitest.ts:36-147`

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
| `spec_code` | pass | T009 `tsString` escaping matches `derive-command-bridges.cjs:955-963`; T010 `trustedCheckout` matches `command-offer.mjs:333-344`; T011 NUL porcelain matches `worktree-restore.mjs:50-68`; T012 `armFor` matches `run-command-behaviour.mjs:985-997`; T013 `lineFixture` matches `run-command-behaviour.mjs:797-806` and the `runArm`/`runTurn` wiring at `:1231` and `:1157`; T014 the nine saved names match every assignment at `capture-command-routing-baseline.mjs:381-396`; T015 the `delete env.AI_SESSION_CHILD` matches `measure-brief-cost.mjs:167-171`; T016 to T021 match `score-command-transcripts.mjs:20-40,109-126`. |
| `checklist_evidence` | pass | `env -u AI_SESSION_CHILD npx vitest run` over the six changed suites this iteration (`worktree-restore`, `command-offer`, `command-behaviour-guards`, `command-transcript-score`, `derive-command-bridges-strings`, `measure-brief-cost`) reported `6 passed (6)`, `114 passed (114)`, exit 0. |
| `skill_agent` | notApplicable | No agent surface in this iteration. |
| `feature_catalog_code` | notApplicable | Catalog files belong to the `doctor-docs` area. |

## Integration Evidence

- `runArm` builds the job with `fixture` only for `G2_PROMPTS` ids (`run-command-behaviour.mjs:1231`) and `runTurn` copies it onto the line (`:1157`); `backfillLog` reads it back through `lineFixture` (`:1247`). The three sites agree.
- `armFor` is called once, from `main` after `selectedRowIds` and `selectMode` (`run-command-behaviour.mjs:1262`); `parseOptions` defaults `arm` to `null` (`:1007`), so the row-derived arm is reachable.
- `trustedCheckout` is the default value of `trusted` in `backfillRunLog` (`command-offer.mjs:403`); `trustedCheckout`'s marker path `.git/skilled-behaviour-arena` matches the builder's `writeFileSync(join(dest, '.git', MARK), ...)` at `prepare-behaviour-arena.mjs:314`.
- `tsString` is used only inside the deriver's generated string writer; the new export changes no generated output unless a value holds a line break or a Unicode line separator.

## Edge Cases

- `statusSnapshot` keys a rename's destination and source under the same `R` code; `restoreTurn` then restores the source from HEAD and removes the destination, which is what the new rename test asserts. A rename whose source was already dirty at turn start is skipped by the `!before.has(path)` filter and surfaces as a leftover instead of a silent pass, which is the conservative outcome.
- `armFor` refuses a mixed selection only when no explicit `--arm` is passed; T012 states that an explicit arm wins, so this ordering is the contract, not a defect.
- `backfillRunLog` still resolves every prompt before the first line is written; an unknown or holdout row therefore leaves no output file behind, unchanged from before the diff.

## Confirmed-Clean Surfaces

- The nine environment names the capture writes or deletes are exactly the nine in `PROJECTED_ENV_NAMES`; no tenth mutation exists at `capture-command-routing-baseline.mjs:381-396`.
- `tsString` escapes backslash before quote before the four line breaks, so a value holding `\` and a newline round-trips; the new round-trip test covers LF, CR, U+2028, U+2029, a quote and a backslash.
- `trustedCheckout` uses `realpathSync` on both sides and returns `false` on a throw, so a path that does not exist fails toward untrusted.

## Ruled Out

- A replay from an unmarked checkout: ruled out by reading `backfillRunLog`; the warm and replay calls are inside the `trusted` branch, and the new test proves both fake binaries stay untouched.
- A lost `fixture` on a backfilled g2 line: ruled out by the `job.fixture` to `line.fixture` to `lineFixture` chain at the three cited sites.
- A missed environment name in the capture restore: ruled out by comparing all nine assignments with `PROJECTED_ENV_NAMES`.
- A raw line break in a generated bridge literal: ruled out by the escaping chain and the new round-trip test.

## Next Focus

- Dimension: security
- Focus area: the trust and privacy boundaries the changed lines touch: the untrusted backfill checkout, the captured-environment projection, the subprocess stderr scan and holdout hygiene
- Reason: correctness of the runners is now covered; the remaining risk in this area is what an untrusted run log or a child process can make the code do or disclose.
- Rotation status: correctness completed; security begins.
- Blocked/productive carry-forward: none blocked; diff-then-caller reading is productive.
- Required evidence: diff, current code, the holdout numstat check, and one concrete input per finding.

Review verdict: PASS
