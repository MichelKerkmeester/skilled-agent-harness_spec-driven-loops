# Iteration 001 — Correctness

## Dispatcher
- Executor: cli-claude-code (claude-opus-5-5, medium), inline fan-out lineage opus-medium-1
- Sources read: steer.md (absent), deep-review-config.json, deep-review-strategy.md, review-scope-files.txt

## Dimension
correctness, aimed at the operator focus: the deep-loop offer gate in `command-attach.ts`, the Python fallback gate in `skill_advisor.py`, and the typed-command hint added by packet 013.

## Files Reviewed
- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:198-265` (typed command detection), `:267-673` (loop-ask gate), `:827-924` (attachCommand, deferred path)
- `.skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts:395-447`, `:556-561`, `:628-633`
- `.skilled/skills/system-skill-advisor/runtime/lib/render.ts:227-253`
- `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:4623-4856`
- `.skilled/skills/system-skill-advisor/runtime/tests/deep-loop-offer-cases.vitest.ts:1-80`
- `.skilled/skills/system-skill-advisor/runtime/tests/fixtures/deep-loop-offer-cases.json` (typed-stuck case)

## How this iteration addressed the review focus
I ran the TypeScript gate source through a type-stripping loader (`probes/gate-probe.mjs`, inside the lineage directory) on prompts that are typed, deferred, stuck, refused and depth-only. Then I followed a typed command through the recommend handler to the brief head and compared that path with the Python fallback's `_apply_deep_loop_offer_gate`.

## Findings by Severity

### P0 Findings
None.

### P1 Findings
1. **A typed deep command overrides the stuck-run doctor, and the Python fallback does not** -- `.skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts:428` -- `attachCommand` answers a stuck-run complaint with `/doctor:deep-loop` (`command-attach.ts:837-841`). `attachTypedCommand` then runs after `enrichCompiledRoutes` on both the cache-hit path and the fresh path (`advisor-recommend.ts:556-561`, `:628-633`), and it replaces the top row's command with whatever `typedCommandForTop` returns. `typedCommandForTop` (`command-attach.ts:257-265`) checks only `commandOnlyMentioned` and ownership, not `isStuckRunComplaint`. So the native brief offers a new `/deep:review` run for a stuck run, which is the outcome the doctor path exists to prevent. The Python gate drops the run rows on a stuck complaint "even when one is typed" (`skill_advisor.py:4835-4853`), so the two advisors disagree on the same prompt. The shared fixture pins `typed-stuck` to `typedReviewKept: false`, but `deep-loop-offer-cases.vitest.ts:65-67` asserts it against `attachCommand` alone. It never exercises the `attachTypedCommand` layer, where the override happens.
   Finding class: cross-layer contract drift (gate bypassed by a later enrichment step)
   Scope proof: probe output `"my deep review run is stuck, /deep:review again" | rev: /doctor:deep-loop | typedTop: /deep:review | stuck: true`, and the same for `"the /deep:research run hangs, /deep:research:auto"`
   Affected surface hints: advisor-recommend.ts attachTypedCommand; command-attach.ts typedCommandForTop; deep-loop-offer-cases.vitest.ts typed cases; render.ts commandLabel (prints plain `(ask)` because `typed: true`)
   Case: the prompt "my deep review run is stuck, /deep:review again" gets the native head `system-deep-loop → /deep:review (ask)`, where the doctor command is expected; the Python fallback gives no run row for the same prompt.

```json
{"type":"claim-adjudication","findingId":"R1-P1-001","claim":"For a stuck-run prompt that also types /deep:review, the native recommend output carries /deep:review instead of /doctor:deep-loop, which diverges from the Python fallback and the stuck-run rule.","evidenceRefs":[".skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts:428",".skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts:628",".skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:257",".skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:837",".skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:4848",".skilled/skills/system-skill-advisor/runtime/tests/deep-loop-offer-cases.vitest.ts:65"],"counterevidenceSought":"Looked for a stuck check inside typedCommandForTop or attachTypedCommand, and for a test that runs the typed-stuck case through attachTypedCommand. Found neither. The guards suite covers stuck only through attachCommand (command-attach-guards.vitest.ts:575-593).","alternativeExplanation":"The authors may intend a typed command to always win, as the comment at advisor-recommend.ts:424 says. But the fixture's typedReviewKept=false and the Python docstring both say a stuck run drops the typed run, so that intent contradicts the packet's own pinned answer.","finalSeverity":"P1","confidence":0.85,"downgradeTrigger":"Downgrade to P2 if the operator rules that a typed command outranks the stuck diagnosis and the fixture plus the Python gate are changed to match."}
```

### P2 Findings
None.

## Traceability Checks
- spec_code (partial): the spec's explicit-loop clauses (spec.md §2) match `LOOP_WORDING`, `ITERATIVE_ASK`, `MULTI_PASS`, `LOOP_COUNT` and `LOOP_NAMES`. Typed `/deep:*` is honoured through `typedCommandIn`. Depth-only prompts return undefined (probe: "do a thorough review of the parser" → undefined on all three paths). The continue/resume/extend clause runs through `LOOP_CONTINUE_VERB` (command-attach.ts:556).
- checklist_evidence: deferred to the traceability iteration.

## Integration Evidence
- `advisor-recommend.ts` handler → `attachCommand` → `attachTypedCommand` → `render.ts commandLabel`, all read directly.
- `skill-advisor-cli-fallback.ts:393-395` carries `typed` from the CLI output into the hook brief.

## Edge Cases
- Dist is not built in this worktree, so the TS source was probed through a type-stripping loader. The handler module uses TS-only syntax and could not be loaded, so the override at `attachTypedCommand` is proved by direct read plus `typedCommandForTop` output, not by an end-to-end run.
- A deferred route ignores typed commands inside `deferredLoopCommand` (command-attach.ts:899-919). `attachTypedCommand` restores them later, so that is not a defect on its own.

## Confirmed-Clean Surfaces
- Refused typed command: "do not run /deep:review, just tell me what it does" → no command on every path.
- Depth-only prompt: no command on any path.
- Typed command with a mode suffix (`/deep:review:auto`) resolves to `/deep:review`.

## Ruled Out
- Routed research mode attaching `/deep:research` to "run 5 review iterations": this depends on the router picking research for a review-named prompt, which I did not observe. Not reported.

## Next Focus
- Dimension: security
- Focus area: untrusted prompt text through the regex gate (ReDoS-prone nested quantifiers in LOOP_REQUEST, COMMAND_* leads), plus the `typed` flag trust through the CLI fallback
- Reason: rotation; the gate runs on every prompt
- Rotation status: correctness done (1/4)
- Required evidence: timing probe on adversarial long prompts

Review verdict: CONDITIONAL
