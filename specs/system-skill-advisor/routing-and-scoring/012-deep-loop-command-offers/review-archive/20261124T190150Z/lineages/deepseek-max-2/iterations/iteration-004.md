# Review Iteration 004

## Dispatcher

- Lineage `deepseek-max-2`, iteration 4 of 7, mode `review`, `AUTONOMOUS`.
- Dimension: **security**. Operator focus carried as the degraded-path slice: REQ-028's plain `(ask)` render and REQ-038's supplied-command rule are the two sixth-round requirements that touch a trust boundary.
- Review target: `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers` (`spec-folder`).

## Files Reviewed

- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:231` to `:330` - `asRecord`, `typedAt`, `typedCommandIn`, `typedCommandsIn`, `typedCommandForTop`.
- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:1475` to `:1520` and `:1529` to `:1620` - `commandOnlyMentioned` and `attachCommand`, read for the own-key lookups and the untrusted-route narrowing.
- `.skilled/skills/system-skill-advisor/runtime/lib/subprocess.ts:187` to `:262` and `:382` to `:460` - `parseRecommendations`, `typedCommandForRecommendation`, `withTypedCommand`, and the spawn that carries the prompt over stdin.
- `.skilled/skills/system-skill-advisor/runtime/skill-advisor-cli.ts:1480` to `:1594` - `trackedCommandForOwner` and `degradedRecommendations`.
- `.skilled/skills/system-skill-advisor/runtime/lib/render.ts:240` to `:260` - the typed-command render rule.
- `.skilled/skills/system-skill-advisor/runtime/schemas/advisor-tool-schemas.ts` - `ADVISOR_PROMPT_MAX_CHARS`.
- `.skilled/skills/system-skill-advisor/runtime/tests/cli-degraded-command-contract.vitest.ts:140` to `:190` - the two supplied-command cases.
- `.skilled/commands/deep/assets/compiled/deep-review.contract.markdown` - the generated header, checked for any absolute path or credential-shaped string in its recorded digests.

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
| `spec_code` | partial | REQ-028 and REQ-038 were checked against their code and both hold; the security slice added no requirement mapping beyond those two. REQ-001 to REQ-031 are mapped; REQ-032 to REQ-046 are mapped in iteration 6. |
| `checklist_evidence` | partial | AC-035 and AC-047 are the two cells this iteration's requirements own; both were re-read against the tree and both hold. The remaining cells were covered in iteration 3 and are re-read in iteration 7. |

Observed measurements behind the rows (read-only probes under the lineage, no repository tooling run):

- **Compiled-route narrowing holds.** Seven malformed routes were fed to `attachCommand` for the hub: `workflowMode: "__proto__"`, `workflowMode: "constructor"`, a route passed as an array, `targets` as an array-like object, `workflowMode: 42`, `targets: [null]`, and a `defer` route with no targets. The first six returned no command; the seventh returned `/deep:review`, which is the deferred route's correct answer and not a leak. `asRecord` at `command-attach.ts:1524` excludes arrays and null, and both command tables are read through `Object.prototype.hasOwnProperty.call` (`:1582`, `:1584`), so an inherited name cannot resolve to a command the hub never declared.
- **Prototype-named skill ids are inert.** `attachCommand('__proto__', …)`, `('constructor', …)` and `('toString', …)` each returned no command, through the same own-key guard in `deferredLoopCommand` (`:1633`).
- **The degraded path drops every supplied string it cannot vouch for.** `degradedRecommendations` was called with a typed row carrying `command: "rm -rf /"`, then `command: "/speckit:save"`, then `command: "/deep:review; rm -rf /tmp/x"`. Each rendered as `{"skillId":"system-deep-loop","confidence":0.9,"uncertainty":0.1,"reason":""}` with no command, policy, owner or typed marker. The tracked control `command: "/deep:review"` rendered with all four fields. This is REQ-038 exactly, and `trackedCommandForOwner` (`skill-advisor-cli.ts:1489`) is the gate: the string must be a `TRACKED_COMMANDS` key whose `ownerSkillId` is the row's skill or its merged alias.
- **A typed row renders plainly.** `render.ts:250` offers the three options only when `policy === 'ask'`, the command is a deep-loop offer command and `recommendation.typed !== true`; a typed row therefore prints `/deep:review (ask)` with no `A ` option text. REQ-028's render half holds on the file, and its degraded half is pinned by `cli-degraded-command-contract.vitest.ts:152` and `:178`.
- **No super-linear gate cost.** Four long prompts were timed through `attachCommand`: 96,000 characters of repeated `"do not run /deep:review."` returned no command in 4.4 ms; 9,984 characters of the same shape in 0.8 ms; 38,000 characters naming a review per clause returned `/deep:review` in 6.3 ms; a 40,032-character prefix ending in one loop ask returned `/deep:review` in 0.7 ms. `LEAD_WINDOW` bounds every prefix read at 400 characters (`command-attach.ts:748`), and `forwardSearch` (`:1389`) keeps a repeating prompt from costing a scan per occurrence. REQ-030's bounded-window clause holds on the native side.
- **Prompt text never reaches argv.** `runAdvisorSubprocess` passes `--stdin` and carries the prompt through the child's stdin (`subprocess.ts:415`, spawn at `:283` with `stdio: ['pipe','pipe','pipe']`), so prompt text is not visible in a process listing.
- **The head is capped on both sides.** `ADVISOR_PROMPT_MAX_CHARS` reads 10000, matching the value the drift guard compares against the Python source.

## Integration Evidence

`cli-degraded-command-contract.vitest.ts:152` and `:178` are the two named integration cases for the degraded CLI path, and both were read rather than rerun. No other integration surface was reviewed this iteration.

## Edge Cases

- **Boundary observed, no finding (environment passthrough).** `runAdvisorSubprocess` spawns the Python child with `env: process.env` (`subprocess.ts:285`), so every environment variable the session holds reaches the child. The child is first-party code in the same repository and reads no secret, so this is a deliberate inheritance rather than an exposure path; recorded as an observation.
- **Boundary observed, no finding (unvalidated skill label on a degraded row).** `degradedRecommendations` writes `skillId: entry.skill` (`skill-advisor-cli.ts:1541`, `:1580`) without the `sanitizeSkillLabel` the shadow rows use at `:468`. The only producer of `entries` is `runLocalScorer`, and the only producer of a supplied command is `parseRecommendations`, which validates that `skill` is a non-empty string; both are first-party, so no outside value reaches that field. Recorded as hardening that is not in reach, per the review doctrine's P2 rule.
- **Not reproducible here.** The two vitest cases behind REQ-028 were read as sources, not run; the cells they back were accepted on the code plus the case text.

## Confirmed-Clean Surfaces

- `attachCommand` against seven malformed compiled routes and three prototype-named skill ids: no command offered, no throw.
- `degradedRecommendations` against three hostile supplied command strings: every one dropped, and the tracked control kept with its four fields.
- `render.ts` typed-command rule: a typed row never renders the three-option offer.
- `runAdvisorSubprocess`: prompt over stdin, no argv exposure, bounded timeout with one busy-retry.
- Gate timing: worst measured 6.3 ms on a 38,000-character prompt, with every prefix read bounded at 400 characters.

## Ruled Out

- **Prototype pollution through a compiled route.** Every lookup on the route and on both command tables is an own-key check, and the six malformed shapes all fail closed.
- **Command injection through a degraded row's supplied string.** The string is only printed when it is a tracked command owned by (or merged into) the row's own skill; three hostile strings were dropped.
- **ReDoS through the loop-ask grammar.** Long repeated prompts stayed under 7 ms; the window bound and the forward-search cache remove the quadratic shape REQ-030 records.
- **Secret exposure through argv.** The prompt travels on stdin.

## Next Focus

- Dimension: `maintainability`, with the operator focus carried as the reducer and closeout slice of the sixth round (REQ-032, REQ-046, and REQ-034's closure-doc clause).
- Focus area: `.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs` (the refinement fold, the ruled-out direction, the heading-first replacement) and `synthesis-closeout.cjs`, plus the four unit tests the packet names for them.
- Reason: `maintainability` is the last configured dimension with no iteration, and three sixth-round requirements are claims about those two scripts.
- Rotation status: `correctness` complete (gate layer); `security` complete; `traceability` has two of three passes done.
- Blocked/productive carry-forward: productive - exercising a predicate with hostile input is cheaper than reading its guard and proves the same thing; blocked - no suite rerun, so the reducer claims are checked by reading the code and its tests, and by running the reducer itself on this lineage, which is legitimate work rather than repo tooling.
- Required evidence: the function that implements each claim, plus one test that pins it, plus what the reducer actually wrote for this lineage.
- Recovery note: none.

Review verdict: PASS
