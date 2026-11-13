# Review Iteration 001

## Dispatcher

- Run: `fanout-noedit-close-3c-1794596804847-827gze` (lineage `noedit-close-3c`, pass three closing round, area `noedit`)
- Mode: review; executor: this process (in-process, no nested dispatch)
- Dimension: correctness
- Review focus addressed: the dispatch orders this lineage to take the no-edit gate first and deepest, and to report only defects that are not one of the two settled decisions. This iteration reads the final state of `NO_EDIT_REQUEST` / `isNoEditRequest` and all three of its call sites, then runs the shipped TypeScript modules against prompts designed to separate a genuine no-edit instruction from a change request. No hook file was read this iteration; it is next.
- Budget profile: `verify` (11-13 calls), used 12.

## Files Reviewed

- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:287-298` (the shared matcher and its normalisation)
- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:317-358` (`attachCommand`, the hub-attach gate at `:338`)
- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:676-679` (`readOnlyRouteAllowed`, the read-only lift gate)
- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:865-885` (`commandMeaningEligible`, the meaning gate)
- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/text.ts:145-166` (`isReadOnlyExplainer`)
- `.skilled/skills/system-skill-advisor/runtime/tests/command-attach-guards.vitest.ts:1-148` (the pinning tests, read not re-run: the change under review is the matcher's vocabulary, not its wiring)
- Commit `846eab66b8` diff for `command-attach.ts` and `command-attach-guards.vitest.ts`
- Executed: `.skilled/skills/system-deep-loop/runtime/node_modules/.bin/tsx .../probes/probe-noedit-1.mjs`, `probe-noedit-2.mjs`, `probe-noedit-3.mjs` — each imports the shipped `command-attach.ts`, `scorer/text.ts` and `scorer/fusion.ts` and prints the matcher, the explainer classification and the attached command per prompt. Output is quoted in the findings.

## Findings - New

### P0 Findings

None.

### P1 Findings

1. **`NO_EDIT_REQUEST` omits the write verbs, so "don't create it yet" keeps a mutating command** -- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:292` -- The negative-instruction alternative is `(?:do not|don't) (change|edit|modify|touch)`. A reader who says "don't create it yet", "don't write the file yet" or "do not save them yet" rules out the change exactly as clearly as "don't change anything yet", but the matcher returns `false` for the first three and `true` for the last. The prompt then keeps its hub command. With the single-mode route the hub derives for the naming prompt, `attachCommand('sk-doc', { action: 'route', selectionKind: 'single', targets: [{ workflowMode: 'sk-create-changelog' }] }, "use sk-doc to plan the changelog, don't create it yet")` returns `"/create:changelog"` (a `mutates` row at `command-attach.ts:67`). The same prompt with the covered verb — "…, don't change anything yet" — returns `undefined`. The route is not held at the explainer floor: `isReadOnlyExplainer` is `false` for the prompt (no read-only verb), so the attach path is the reachable one and not a dead branch behind an abstention.
   Finding class: class-of-bug
   Scope proof: the matcher is the changed line (`command-attach.ts:292`) and the attach gate is its caller (`:338`); the prompt is a hub naming prompt with one selected mode, which is the shape `attachCommand` requires.
   Affected surface hints: hub command attachment; the `/create:*` mutating offers; the shared matcher consumed by `fusion.ts:677`, `fusion.ts:881` and `text.ts:150`.
   Case: `use sk-doc to plan the changelog, don't create it yet` → `isNoEditRequest` `false`, `isReadOnlyExplainer` `false`, `attachCommand(..., sk-create-changelog)` `"/create:changelog"`; the control `use sk-doc to plan the changelog, don't change anything yet` → `isNoEditRequest` `true`, command `undefined`.
   ```json
   {
     "type": "claim_adjudication",
     "claim": "The negative-instruction alternative covers four verbs only, so a genuine no-edit instruction that uses create/write/save is not matched and the hub attach path offers a mutating command on it.",
     "evidenceRefs": [
       ".skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:292",
       ".skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:338",
       ".skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:67",
       ".skilled/skills/system-skill-advisor/runtime/lib/scorer/text.ts:150"
     ],
     "counterevidenceSought": "Checked whether the miss is out of the pattern's contract: the module comment says the wording \"rules out a change\" and the pass-one fix R2-P2-001 and pass-three NE3-P1-001 both treat a missed no-edit phrase as a defect, so the verb list is vocabulary under test, not a stated limit. Checked whether the prompt is held earlier: isReadOnlyExplainer is false because it has no read-only verb, so the route survives and the attach gate is the only guard. Checked the settled decision: it pins the meaning of \"make no changes\", not the verb list.",
     "alternativeExplanation": "The author may have intended the four verbs as the only instruction verbs worth matching, and 'create' may look like task intent. That reading does not hold here because 'don't create it yet' is the ruling-out clause, and the write-verb regex at text.ts:154 already reads 'create' as write work, so both vocabularies disagree about the same sentence.",
     "finalSeverity": "P1",
     "confidence": "high",
     "downgradeTrigger": "Downgrade to P2 if a follow-up shows the router never selects a mutating single-mode command for a prompt that also carries a no-edit clause, or if the project explicitly accepts this lost guard as a heuristic limit."
   }
   ```

### P2 Findings

1. **"just show" and "just list" read a two-step change request as a no-edit request** -- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:292` -- The alternative `just show|just list` is a read-only marker, but it is not anchored to the end of the request. "just show me the changelog draft, then create it" asks for the creation as plainly as the same sentence without "just"; both forms were run through the shipped module. The "just" form returns `isNoEditRequest` `true` and `attachCommand(..., sk-create-changelog)` `undefined`; dropping the single word returns `false` and `"/create:changelog"`. The settle decision covers the phrase "make no changes", not this marker, and no test pins this reading.
   Finding class: class-of-bug
   Scope proof: both prompts exercise the changed matcher at `command-attach.ts:292` through the hub gate at `:338` with the same single-mode route; the only input difference is the word "just".
   Affected surface hints: hub command attachment; two-step "look first, then change" prompts; the shared matcher's read-only branches.
   Case: `just show me the changelog draft, then create it` → matcher `true`, command `undefined`; `show me the changelog draft, then create it` → matcher `false`, command `"/create:changelog"`.

## Traceability Checks

- `spec_code` — partial. The module comment at `command-attach.ts:287-292` states that the pattern is "wording that asks for an answer and rules out a change", and the three gates apply it as that. The two findings show the vocabulary does not yet cover that statement in both directions; no packet acceptance row was read this iteration.
- `checklist_evidence` — pending (not in this iteration's focus).
- `skill_agent`, `agent_cross_runtime`, `feature_catalog_code` — pending.
- `playbook_capability` — notApplicable: neither reviewed file has a playbook surface.

## Integration Evidence

- `.skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts:474` is the production caller of `attachCommand`; the no-edit gate sits inside the attach path, so a missed phrase reaches the public `command` field of the recommendation.
- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:677` (`readOnlyRouteAllowed`) and `:881` (`commandMeaningEligible`) are the two scorer gates; `.skilled/skills/system-skill-advisor/runtime/lib/scorer/text.ts:150` is the explainer classifier. All three consume the same `isNoEditRequest`, so the verb-list gap is shared by four gates.

## Edge Cases

- The P1 prompt was chosen so the route is not held at the read-only explainer floor: a prompt with a read-only verb would abstain before the attach path and the finding would have no reach. `isReadOnlyExplainer` was run for the prompt and is `false`.
- `isNoEditRequest` lowercases and folds U+2018/U+2019, and the probes ran the lowercase forms; the curly-apostrophe path is pinned by `command-attach-guards.vitest.ts:62-65` and is unaffected.
- Prior findings were checked for overlap: pass-two `SA2-P2-002` named contractions, "no changes yet" and "make no changes"; the pass-three confirming round named the "make no changes to|in" lookahead. Neither names the four-verb list, so the P1 is a new hole rather than a re-report. The P2 marker "just show" appears in no prior finding.
- The settled "make no changes" cost is not re-reported: the settled control prompt was run and returns `true` as pinned, and no finding here depends on reversing it.

## Confirmed-Clean Surfaces

- `isNoEditRequest` is stateless: `NO_EDIT_REQUEST` carries no `g` flag, so repeated `.test` calls on the same prompt do not alternate.
- The curly-apostrophe fold at `:297` is applied once per call and the callers pass an already-lowercased prompt; the double lowercase is harmless.
- `attachCommand`'s own-key lookups and route-shape narrowing are unchanged by the two commits and were clean under the prompts above.
- The three surviving "change request limits its scope" test rows at `command-attach-guards.vitest.ts:69-75` pass for the right reason: "there are no changes to" and "with no changes to" are not matched by any alternative, so the rows can fail if the pattern widens further.
- `isReadOnlyExplainer` still returns `true` for the read-only request that rules out a change, and `commandMeaningEligible` still returns `false` for every command on the covered phrasings.

## Ruled Out

- **Catastrophic backtracking or a hang in the matcher.** The alternatives are literals and single-verb groups with no nested quantifier; every probe returned in milliseconds.
- **A `lastIndex` state bug.** `NO_EDIT_REQUEST` has no global flag, and the direct `.test` call at `command-attach-guards.vitest.ts:49` is stable.
- **A crash on non-string input.** All four call sites pass `promptLower`/`prompt` strings produced from the request; no public path reaches `isNoEditRequest` with a non-string.
- **The curly-apostrophe regression.** The fold is intact and the probe with `don’t` (curly) was not needed beyond the pinned test.
- **The settled "make no changes" cost as a finding.** Ran the settled control; it behaves as the settled decision says and is not reported.

## Next Focus

- Dimension: correctness
- Focus area: the doctor hook check, `readHook`/`readWords`/`simpleCommands`/`commandWords`/`nodeFlagSkipsScript`/`runsNodeOnMarker`/`scriptWord`/`runsMarker` in `.skilled/commands/doctor/scripts/hook-wiring-check.cjs`, with `.skilled/commands/doctor/scripts/tests/hook-wiring-check.test.cjs`
- Reason: the dispatch orders this lineage to review the hook check once after the no-edit gate
- Rotation status: first hook pass for this lineage; the no-edit dimension is complete for correctness
- Blocked/productive carry-forward: nothing blocked; the probe-under-mktemp method worked and is the right tool for a hook case
- Required evidence: a settings file under a mktemp root, `node .skilled/commands/doctor/scripts/hook-wiring-check.cjs --root <folder>` run and its output quoted, then the folder removed
- Recovery note: if no new hook defect is found, say so plainly and use the third iteration for traceability and maintainability rather than widening the heuristic

Review verdict: CONDITIONAL
