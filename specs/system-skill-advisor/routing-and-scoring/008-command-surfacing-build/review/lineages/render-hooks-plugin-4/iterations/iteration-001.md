# Review Iteration 001

## Dispatcher

- Mode: review (fan-out lineage `render-hooks-plugin-4`, pass four)
- Session: `fanout-render-hooks-plugin-4-1794669272137-9v23rz`, generation 1, lineage mode `new`
- Review target: `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build`
- Area: `render-hooks-plugin` — the seven rows of `review/review-scope-4.txt` for this area, plus the shared docs that state their contract.
- Operator review focus addressed this iteration: the brief's "behaviour on claude, codex, opencode, pi, devin and dsh; whether a refusal, a question or a mention of a command can still attach or start a mutating command" — this iteration read the two changed producers (the shared renderer and the OpenCode plugin request) and the one changed reader (Codex), then traced each through its consumer. The refusal/question surface is rendered by the same shared renderer for every runtime, so its label logic is checked here; the scorer-side guards are owned by `scorer-attach` and are cited only as integration evidence. The transcript-scorer effect of the Codex body is checked at the reader boundary and handed to `accuracy-runner` as an integration note.
- Budget profile: `verify` (11 analysis actions)

## Files Reviewed

- `.opencode/plugins/system-skill-advisor.js:607-616` — `parseCliResponse` first-passing-row selection
- `.opencode/plugins/system-skill-advisor.js:848-862` — `advisorCliRequest` request shape and `compiledRouteTopOnly`
- `.opencode/plugins/tests/system-skill-advisor.test.cjs:519-607` — first-passing-row and top-only-request cases
- `.skilled/hooks/shared/session-readers/codex.mjs:103-133`, `:142-192` — custom tool call mapping and the containment/read path
- `.skilled/hooks/shared/tests/session-readers/codex.test.mjs:28-76` — custom-call body and function-call argument cases
- `.skilled/skills/system-skill-advisor/runtime/lib/render.ts:514-627` — head, companion and ambiguous labels; child marker
- `.skilled/skills/system-skill-advisor/runtime/tests/doctor-brief-render.vitest.ts:52-133` — companion policy and repeated-command cases
- `.skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts:452-494` — `enrichCompiledRoutes` top-only branch (integration evidence)
- `.skilled/hooks/shared/session-readers/README.md:24-32` — the containment and Codex body contract
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/021-brief-head-parity/spec.md:110-118`, `implementation-summary.md:118-126` — the claimed behaviour and its known limitations
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/021-brief-head-parity/tasks.md:68-76` — T003, T004, T005, T006 and T014 as the change record

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **Codex opens the caller's locator after containment resolved a different path** -- `.skilled/hooks/shared/session-readers/codex.mjs:167` -- `loadCodexSession` assigns `const storePath = containment.path` at `:163` and reports it as `source.storePath` at `:188`, but reads the bytes from `transcriptPath` at `:167`. `resolveInside` realpaths its input and returns the resolved path, so the file the check approved is the file the reader must open; the other path-locator readers already do that. `claude.mjs:219`, `devin.mjs:356` and `dsh.mjs:313` read `storePath`, and `pi.mjs` reads the guard's `path`; Codex is now the only reader that re-opens the caller's spelling. The session-readers contract states the rule at `README.md:28`: a reader "opens the path its containment check resolved, so a path swapped after the check is not followed."
   Finding class: `security-hardening`
   Scope proof: `rg -n "readFileSync\(transcriptPath" .skilled/hooks/shared/session-readers` returns only `codex.mjs:167`; `rg -n "readFileSync\(storePath|readFileSync\(containment.path"` returns `claude.mjs:219`, `devin.mjs:356` and `dsh.mjs:313`. The pass-two fix `R1-P2-002--fabc628596e7` covered four readers and omitted Codex because the pass-one scope proof said Codex had no path locator (`review/lineages/render-hooks-plugin/iterations/iteration-001.md:47`); the Codex module has used `transcript_path` since its introduction (`codex.mjs:30`, `:139-153`).
   Affected surface hints: `loadCodexSession`; the `source.storePath` value consumed by the history lookup; `score-command-transcripts.mjs`'s `--runtime codex` path, which scores `loadSession` records.
   Case: A rollout path inside `~/.codex/sessions` that is a symlink to another file in the same store passes `resolveInside` and records the real target as `source.storePath`; the read then re-opens the link name. If the link is repointed between the check and the read, the records come from a file the containment check never approved, while `source.storePath` names a different file than the bytes.

2. **The OpenCode top-only request can strip the head command from the first passing row** -- `.opencode/plugins/system-skill-advisor.js:858` -- the plugin now sends `compiledRouteTopOnly: true`, which makes `enrichCompiledRoutes` return every row after index 0 unchanged (`handlers/advisor-recommend.ts:462`). The renderer, however, leads with the first row that passes the threshold (`render.ts:530-540`), not row 0. When row 0 fails and a lower row passes, the route lookup was spent on the failing row and the passing head has no compiled-route command. The phase 021 implementation summary records this as Known Limitation 1 and calls it inferred; this review confirms a concrete input makes it reachable. Claude and the other hooks already send the same top-only option, so the new line copies the gap to OpenCode for head parity rather than introducing a new runtime difference.
   Finding class: `cross-consumer`
   Scope proof: `rg -n "compiledRouteTopOnly: true" .opencode/plugins/system-skill-advisor.js` prints one line at `:858`; `advisor-recommend.ts:460-462` returns early for `topOnly && index > 0`; `render.ts:530-540` filters to passing rows and takes `[0]`. The plugin test at `tests/system-skill-advisor.test.cjs:519-553` proves the label and scores come from the first passing row, but its first row is a command row whose own `command` is carried by `publicRecommendation` (`advisor-recommend.ts:318`, `:359-363`), so the test does not cover a plain hub row that lost its route lookup.
   Affected surface hints: `advisorCliRequest`; `enrichCompiledRoutes`; the renderer's head selection; `doctor` and hub rows in `lib/command-attach.ts`; the phase 025 top-only documentation task.
   Case: The CLI returns row 0 `sk-doc` at `0.70/0.20` (fails the `0.8/0.35` thresholds) and row 1 `system-deep-loop` at `0.95/0.12` (passes). With `compiledRouteTopOnly: true`, only row 0 is looked up; the renderer leads with row 1 and prints `Advisor: live; use system-deep-loop 0.95/0.12 pass.` with no `/deep:review`. Before the plugin sent the top-only option, row 1 was enriched and the head carried `/deep:review`.

## Traceability Checks

| Protocol | Level | Status | Notes |
|---|---|---|---|
| `spec_code` | core | partial | Phase 021's requirement "the head row keeps its command under every request shape" (`spec.md:112-118`) is met only when the enriched row is the passing row; `system-skill-advisor.js:858` + `advisor-recommend.ts:462` show the gap for a failing row 0. The codex reader's path contract is stated at `session-readers/README.md:28` and contradicted at `codex.mjs:167`. |
| `checklist_evidence` | core | notApplicable | This is a code pass; the phase 021 task evidence is read as the change record, not as the closure gate for its code. |
| `skill_agent` | overlay | notApplicable | No agent definition changed in this area. |
| `agent_cross_runtime` | overlay | partial | The renderer is shared by claude, codex, opencode, pi, devin and dsh; the only runtime-specific branch is the child flag. The OpenCode plugin now matches the hooks' top-only request. The Codex reader is the one runtime reader with the unresolved-path read. |
| `feature_catalog_code` | overlay | deferred | `feature-catalog/cli-surface/advisor-recommend.md` and the companion-line pages are read in iteration 2 against the code. |
| `playbook_capability` | overlay | notApplicable | No playbook surface changed in this area. |

## Integration Evidence

- Dispatcher: `.skilled/commands/deep/review.md` owns the loop; this lineage runs detached under the pass-four fan-out config and writes only under `review/lineages/render-hooks-plugin-4/`.
- Append gateway: `.skilled/skills/system-deep-loop/runtime/scripts/append-mode-event.cjs` accepts the canonical `type:"iteration"` record whole under `deep_review.iteration_recorded` and refreshes `deep-review-state.jsonl`; the run-open receipt is `event-2ea466b9-da73-4560-baa4-afc690bd1f4c`.
- Reducer: `.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs` owns the findings registry, dashboard and strategy anchors.
- Codex body consumer: `score-command-transcripts.mjs:390` reads `execBodyCommand(args.input)` after `normalize` maps a Codex `exec` tool call to a shell event, so the reader change now feeds the transcript score. The scorer's own string-literal fallback is left to `accuracy-runner-4`; this lineage records only that the body reaches it.
- Head producer: `enrichCompiledRoutes` and `attachTypedCommand` in `handlers/advisor-recommend.ts` are the only producers of a recommendation's `command` on the scored path; the renderer prints what they attach.
- The phase 021 implementation summary records Known Limitations 1, 3 and 5 at `implementation-summary.md:120-126`; finding 2 is the reachable half of limitation 1.

## Edge Cases

- **Custom tool call with both `arguments: "{}"` and `input`.** `parseJsonObject("{}")` returns `{}`, which is truthy, so the `??` fallback to `payload.input` does not run and the body is lost. Codex's `custom_tool_call` schema carries `input` and no `arguments`, and the fixture at `codex.test.mjs:38-46` matches that, so no current producer reaches this. Recorded for a future Codex event revision; no finding.
- **OpenCode child marker lives in the host process.** The plugin renderer defaults `childSession` from `process.env.AI_SESSION_CHILD`, which a dispatched `opencode` process carries. A same-process subagent session inherits the host's parent state; the framework's child convention is process-scoped (`spec-gate-core.mjs:93-104`), so this is the intended boundary, not a new defect.
- **Known Limitation 3 (needs-mode fallback).** `needsMode` is set only for a `COMPILED_ROUTING_HUBS` id (`compiled-routing-flag.ts:14-22`), and none of those hub ids is a key of `COMMAND_ROWS`; `commandRowFor(top.skill)?.ownerSkillId` is therefore undefined and the plugin's `metadata.skillLabel` is the same hub id the fallback would name. The limitation is structural today, not reachable; no finding.
- **The empty-command companion.** `companionCommandLabel` returns the command alone when `policyWord` returns `null`, but every doctor row in `COMMAND_ROWS:65-105` has a policy, so the bare form is not reachable from the generated table. No finding.

## Confirmed-Clean Surfaces

- Companion policy uses the head's single source: `companionCommandLabel` (`render.ts:258-266`) calls `policyWord(row?.policy, row?.mutating, childSession)`, the function the head uses at `:240`; the tests pin `(run)`, `(ask)` and `(parent-named only)` at `doctor-brief-render.vitest.ts:67-94`.
- A child session keeps a read-only companion visible and downgrades `start`, `ask` and writing `run`: `render-child-session.vitest.ts` covers the matrix and `doctor-brief-render.vitest.ts:76-84` covers the read-only and ask cases.
- The companion is dropped when it repeats the head's command: `render.ts:565-572` compares the head's printed command, and `doctor-brief-render.vitest.ts:98-116` covers the repeat and the next-bridge case.
- The plugin's first-passing-row test asserts both the label and the scores (`system-skill-advisor.test.cjs:533-534`), so the old raw-row-id head cannot return unnoticed.
- The Codex custom-call test asserts the body reaches `arguments.input` (`codex.test.mjs:62-64`), and the function-call test asserts parsed JSON arguments still win (`:68-75`).
- `render.ts` sanitizes every printed label through `sanitizeSkillLabel`, and the instruction-shaped rejection is pinned at `doctor-brief-render.vitest.ts:177-178`.

## Ruled Out

- **The plugin selects row 0 when no row passes and renders the wrong head.** `parseCliResponse` falls back to `recommendations[0]`, but the renderer filters to zero passing rows and returns `null`, so the plugin emits the no-match fallback rather than a head. Not a defect.
- **The prompt cache can carry a lower-row command into a top-only request.** The handler caches the un-enriched `parsed` value (`advisor-recommend.ts:693-699`) and runs `enrichCompiledRoutes` on every hit, so a cached entry holds no route-derived `command`/`compiledRoute` for a top-only request to inherit. The cache key also omits the route options, but the stored value makes that harmless today; recorded as a future risk if the cache starts storing enriched output.
- **A custom call's body is counted as a shell step the model did not run.** The reader only exposes the body; the scorer decides what counts. `score-command-transcripts.mjs:390` is outside this area and is handed to `accuracy-runner-4` as integration evidence.
- **`parseCliResponse` can disagree with the renderer's threshold when `thresholdConfidence` is unset.** `normalizeOptions` always resolves it through `normalizeThreshold` (`system-skill-advisor.js:198-203`, `:386`), so the plugin and renderer compare the same number.
- **The ambiguous partner's command can print twice through the companion line.** The normal branch's selection excludes the head command (`render.ts:567-572`) and the ambiguous branch also excludes the partner's command (`:575-582`); the doctor rows in `COMMAND_ROWS` carry unique commands, so the two checks cover the reachable pairs.

## Next Focus

- Dimension: traceability
- Focus area: the shared docs that state this area's contract (`session-readers/README.md`, `.opencode/plugins/README.md`, the advisor `README.md`, `hooks/skill-advisor-hook.md`) against the changed code, plus the phase 021 acceptance evidence and the codex test coverage.
- Reason: the correctness/security pass is complete with two P2 findings; the remaining changed surface is the doc-to-code trace and the tests that pin the new request and body shapes.
- Rotation status: dimension 1 of 4 complete.
- Blocked/productive carry-forward: none.
- Required evidence: exact doc sentence plus code line for each claim; the phase 021 acceptance rows and known limitations; the codex and plugin test files.

Review verdict: PASS
