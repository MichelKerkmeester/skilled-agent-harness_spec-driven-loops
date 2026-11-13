# Review Iteration 002 - hook-close-3c

## Dispatcher

- Lineage: `hook-close-3c` (detached fan-out), session `fanout-hook-close-3c-1794596804847-827gze`, iteration 2 of 3.
- Operator review focus (binding): the no-edit half is checked second; a plausible prompt that `isNoEditRequest` misreads in a way the settled decision does not cover is explicitly in scope; every finding needs file:line and a concrete input run; the "make no changes" safe reading is not re-reported.
- How this iteration addressed the focus: it reads `NO_EDIT_REQUEST` and `isNoEditRequest` in full at the final state, reads all three production callers and the test file, and runs the real module (no copy) through `node --experimental-strip-types` against a plausible no-edit prompt and its pinned siblings. It reports one gap in the contracted "make changes" family, which the settled decision does not cover, and records the settled phrase as clean.

## Dimension

Security (the gate's purpose is to withhold a mutating command from a prompt that ruled out a change).

## Files Reviewed

- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:287-298` — `NO_EDIT_REQUEST`, `isNoEditRequest`.
- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:326-345` — `attachCommand`, including the no-edit early return at `:338` and the deep-loop wording gate.
- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:64-122` — the generated `COMMAND_ROWS` entry for `/create:agent` (`policy: 'start'`, `mutating: 'mutates'`).
- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:675-690` — `readOnlyRouteAllowed` (the `isNoEditRequest` rule at `:677`).
- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:876-886` — `commandMeaningEligible` (the `isNoEditRequest` rule at `:881`).
- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/text.ts:147-160` — `isReadOnlyExplainer` (`explicitNoWrite` at `:150`).
- `.skilled/skills/system-skill-advisor/runtime/tests/command-attach-guards.vitest.ts:28-86` — `NOEDIT4`, the scope-limit rows and the settled-phrase rows.

## Findings by Severity

### P0 Findings

None.

### P1 Findings

1. **The contracted "make changes" instruction is not in the no-edit vocabulary, so a mutating command is offered on a plain no-edit prompt** -- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:292` -- `NO_EDIT_REQUEST` covers the verb immediately after the contraction (`(?:do not|don't) (change|edit|modify|touch)`) and the literal `make no changes` phrase, but not the same instruction built as the contraction plus `make`: `don't make any changes`, `do not make changes`, `don't make changes until ...`. The predicate returns false, so `attachCommand` reaches its return and offers `/create:agent` (a `policy: 'start'`, `mutating: 'mutates'` row) on a prompt whose last clause rules out a change. The other two production gates consume the same predicate, so they miss it too.
   Finding class: class-of-bug (one shared pattern, three consumers; the fix is one alternation).
   Scope proof: `isNoEditRequest` is the single predicate; it is called at `command-attach.ts:338`, `fusion.ts:677`, `fusion.ts:881` and `text.ts:150`, and no caller adds a second object or verb check.
   Affected surface hints: `attachCommand` hub-command gate, `readOnlyRouteAllowed` confidence lift, `commandMeaningEligible` command-meaning gate, `isReadOnlyExplainer` explainer gate.
   Case: the prompt `use sk-doc to create an agent called invoice-parser, don't make any changes yet` returns `false` from `isNoEditRequest` and `/create:agent` from `attachCommand`, while the pinned sibling `... don't change anything yet` returns `true` and `undefined` and the settled phrase `... make no changes to existing agents` returns `true` and `undefined`.
   Concrete inputs run (real module, `node --experimental-strip-types probes/noedit-probe.mjs`; route is the same single-mode `sk-create-agent` route the test file uses):

   ```
   prompt "... don't make any changes yet"        -> isNoEdit=false  attach="/create:agent"
   prompt "... don't make any changes to the files" -> isNoEdit=false  attach="/create:agent"
   prompt "... do not make any changes"           -> isNoEdit=false  attach="/create:agent"
   prompt "... don't make changes until I review" -> isNoEdit=false  attach="/create:agent"
   prompt "... don't change anything yet"         -> isNoEdit=true   attach=null
   prompt "... make no changes to existing agents" -> isNoEdit=true   attach=null
   prompt "... create an agent called invoice-parser" -> isNoEdit=false attach="/create:agent"  (control)
   ```

   Why P1 and not P2: the predicate is a guard that claims the class "wording that asks for an answer and rules out a change" (`command-attach.ts:287-291`), and this input is in that class; the failure is a real caller returning a mutating command, which is the exact harm the gate exists to prevent. It is not one of the two settled decisions: decision 1 settles what the already-matched phrase means, and this phrase is not matched at all.

   Claim adjudication:

   ```json
   {
     "type": "correctness-guard-gap",
     "claim": "NO_EDIT_REQUEST does not match the contracted 'make changes' instruction, so isNoEditRequest returns false and attachCommand offers a mutating command on a plausible no-edit prompt.",
     "evidenceRefs": ["command-attach.ts:292", "command-attach.ts:338", "command-attach.ts:66", "fusion.ts:677", "fusion.ts:881", "text.ts:150", "probes/noedit-probe.mjs output"],
     "counterevidenceSought": "Checked every alternative in the pattern against the failing prompts ('no edits?', 'make no changes', 'no changes yet', 'without making changes', 'do not|don't (change|edit|modify|touch)', 'read-only only', 'only; do not', 'just show', 'just list'); none matches. Read all four call sites to confirm none adds a compensating check. Ran the pinned sibling prompts to show the guard fires for them.",
     "alternativeExplanation": "The vocabulary may deliberately exclude the contracted form because 'don't make any changes to its public API' can also be a change request limiting its scope. Rejected: the settled decision resolves that exact ambiguity for the identical 'make no changes' phrase in favour of the safe reading, so the contracted form of the same instruction should get the same treatment; the two differ only by the contraction.",
     "finalSeverity": "P1",
     "confidence": 0.9,
     "downgradeTrigger": "Downgrade to P2 if the maintainer declares the no-edit vocabulary closed at the pinned phrasings and accepts the mutating offer on this prompt as a known cost."
   }
   ```

### P2 Findings

None.

## Traceability Checks

- `spec_code` — **partial**. Commit `846eab66b8` claims: "Words alone cannot tell the two readings apart, so the phrase rules out a change whatever follows it. Tests pin both readings." Verified for the literal phrase: the test table at `tests/command-attach-guards.vitest.ts:80-85` pins `show me the plan and make no changes to the files` and `refactor the parser and make no changes to its public api` as `true`, and both return `true` in the probe. The claim does not extend to the contracted form, which the table does not contain; that gap is the finding.
- `checklist_evidence` — **not applicable**. No `checklist.md` in the target packet.
- `skill_agent` — **pass**. `attachCommand` is the delivery path and `COMMAND_ROWS` records `/create:agent` as `policy: 'start'`, `mutating: 'mutates'` (`command-attach.ts:66`), so the miss is an offer of a mutating command, not a read-only one.
- `agent_cross_runtime`, `feature_catalog_code`, `playbook_capability` — deferred to iteration 3 (traceability/maintainability rotation).

## Integration Evidence

- Exact surfaces exercised: the shared predicate and `attachCommand` through the real module; the three caller rule sites were read at the cited lines. The test file's own route helper (`SINGLE`, `tests/command-attach-guards.vitest.ts:24-26`) is the shape used in the probe, so the finding is measured on the same call shape the suite pins.
- Named consumers: `attachCommand` (`command-attach.ts:338`), `readOnlyRouteAllowed` (`fusion.ts:677`), `commandMeaningEligible` (`fusion.ts:881`), `isReadOnlyExplainer` (`text.ts:150`).
- Not exercised: the full recommend handler and the eval floors (single-file/no-suite dispatch; the predicate result and the attach return are the unit-level end of the path).

## Edge Cases

- The probe imports the real `.ts` module with `node --experimental-strip-types`; the module has no imports, so no copied module or pre-commit extraction was needed and the reviewed target stayed read-only.
- `isNoEditRequest` lowercases and folds U+2018/U+2019; the probe prompt uses a straight apostrophe. The curly form was checked by reading the fold at `:297` and is a settled, tested behaviour.
- The bare `no changes` phrasing is not reported again: it is the already-recorded `SA2-P2-002` residual, and the pass-three test table deliberately keeps it out so a change request such as `... so there are no changes to its public api` keeps its command.
- `without changing anything yet` also returns `false`; it is the same narrow-vocabulary cause and would be fixed by the same edit, but it is not the settled phrase's direct contraction, so it is recorded here as an adjacent form rather than a second finding.
- No `steer.md` existed at iteration start.

## Confirmed-Clean Surfaces

- The settled phrase returns `true` in all tested contexts (`make no changes`, `make no changes to the files`, `make no changes to existing agents`), so the safe-reading decision is implemented as decided and is not re-reported.
- The contraction with an immediate change verb works: `don't change anything yet` and `Don’t touch any files` return `true`; `touch the files` returns `false`.
- The scope-limit change requests pinned at `tests/command-attach-guards.vitest.ts:69-75` still return `false` (read as change requests), so the fix did not widen those.
- `NO_EDIT_REQUEST` is non-global, so repeated `.test()` calls cannot alternate on `lastIndex`.
- The regex has no nested quantifier or backtracking construct that would make a long prompt hang.

## Ruled Out

- "Re-report the `make no changes` reading" — not reported; it is settled decision 1 and the probe confirms it works as decided.
- "The pattern is stateful across calls" — ruled out: the literal has no `g`/`y` flag; `isNoEditRequest` constructs no new state.
- "A caller compensates for the miss" — ruled out by reading all four call sites; every one delegates to the same predicate and returns the failing branch.
- "The typed-command path hides the miss" — not applicable: a typed command is the user's own ask and is delivered by `typedCommandForTop`, not by this gate; the finding is about the hub-command path the gate protects.

## Next Focus

- Dimension: traceability and maintainability.
- Focus area: the two changed test files against the code they pin, the commit messages' test claims, and whether the lineage's dimensions and cross-reference protocols are covered before synthesis; no new correctness surface.
- Reason: correctness and security are covered; the closing round needs the test/doc and coverage pass before convergence.
- Rotation status: correctness done (iteration 1), security done (this iteration); traceability and maintainability next.
- Blocked/productive carry-forward: the no-edit gate is productive; do not re-enter its settled phrase, only confirm this P1 stays active.
- Required evidence: the test rows' ability to fail, the doc claims that mention the no-edit gate, and the packet's traceability surfaces.

## Verdict

One active P1: the contracted "make changes" instruction is outside the shared no-edit vocabulary, so a plausible no-edit prompt is offered a mutating command. The settled phrase itself behaves as decided.

Review verdict: CONDITIONAL
