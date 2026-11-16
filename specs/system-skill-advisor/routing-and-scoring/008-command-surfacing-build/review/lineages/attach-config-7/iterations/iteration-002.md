# Review Iteration 002

## Dispatcher

- Lineage: `attach-config-7` (fan-out child, session `fanout-attach-config-7-1794829999759-g4q8yp`)
- Area: `attach-config` per `review/review-scope-7.txt`
- Dimension: traceability
- Operator review focus: the reviewer followed `review/review-brief-7.txt` again. This iteration covers the matcher's vocabulary against the command documents and the one-name-per-command surfaces it feeds, which is the traceability half of the `attach-config` area. The scorer and docs areas stay with their lineages. No recorded limit is re-reported.
- Steer channel: `steer.md` still does not exist.

## Files Reviewed

- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts` (comment 203-210, matcher 220-244, call sites 255-263 and 512-515) [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:203]
- `.skilled/skills/system-skill-advisor/runtime/tests/command-attach-guards.vitest.ts` (436-470) [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/command-attach-guards.vitest.ts:442]
- `.skilled/commands/speckit/complete.md` (argument-hint and input table, context evidence) [SOURCE: .skilled/commands/speckit/complete.md:3]
- `.skilled/commands/speckit/plan.md` (argument-hint and workflow input table, context evidence) [SOURCE: .skilled/commands/speckit/plan.md:3]
- `.skilled/commands/deep/review.md` (argument-hint, context evidence) [SOURCE: .skilled/commands/deep/review.md:1]
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs` (612-629, 696-699, read-only integration surface owned by `scorer-7`)

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **The widened suffix vocabulary is not mirrored in the transcript scorer's command parser** -- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:210` -- The matcher now reads a `:with-*` modifier, and a chain of modifiers, as the typed command. The transcript scorer's `commandParts` still removes only a trailing `:(auto|confirm|autopilot|unattended)`, so the same typed text becomes a different command name there and the scored offer is missed.
   - Finding class: cross-surface contract drift in a measurement path (`traceability`)
   - Scope proof: the changed line is the widened `MODE_SUFFIX` in this area; the consumer is the named scoring surface, which this lineage reviews only as integration evidence.
   - Affected surface hints: `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs:612`, `:623`, `:697`
   - Case: a model prints `COMMAND: /speckit:complete:with-research → started` for a row whose expected command is `/speckit:complete`. `commandParts` produces `speckit:complete:with-research`, `namesCommand` compares it with `speckit:complete`, and the mismatch leaves `offerSeen` false even though the command was typed and attached correctly.

   Reproduction of the scorer's own parser, run outside the repository with the exact source regex and split:

   ```
   /speckit:complete:auto                 -> {namespace:"speckit", name:"complete"}                namesExpected=true
   /speckit:complete:with-research        -> {namespace:"speckit", name:"complete:with-research"}  namesExpected=false
   /speckit:complete:auto:with-research   -> {namespace:"speckit", name:"complete:auto:with-research"} namesExpected=false
   ```

   [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs:612] [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs:623] [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs:697]

   Why it is P2 and not P1: the user-facing attach path is correct, and the defect is confined to how stored runs are scored. It becomes load-bearing only when a recorded run types one of the new suffixes, and then it undercounts rather than misroutes.

   Claim adjudication:
   ```json
   {"type":"claim","claim":"A typed command carrying a :with-* modifier is a different command name for the transcript scorer than for the attach matcher, so a correctly typed chained command is scored as unnamed.","evidenceRefs":["command-attach.ts:210","command-attach.ts:230","score-command-transcripts.mjs:612","score-command-transcripts.mjs:623","score-command-transcripts.mjs:697","command-attach-guards.vitest.ts:443"],"counterevidenceSought":"Checked whether commandParts strips every mode suffix before splitting, whether namesCommand compares only the base, and whether the scorer's caller tolerates a longer name. It does not: the exact-equality comparison at line 697 rejects the extra segment.","alternativeExplanation":"The divergence may be deliberate if a with-* modifier is treated as command content rather than a suffix. The scorer's own comment calls its pattern the mode suffix, and the command docs classify :with-* as a workflow input on the same command, so a typed command with one is still that command.","finalSeverity":"P2","confidence":"high","downgradeTrigger":"Downgrade nothing: P2 is already the lowest active tier. If the scorer never reads a stored run with a :with-* suffix, impact is latent, not absent."}
   ```

## Traceability Checks

| Protocol | Status | Evidence |
|----------|--------|----------|
| `spec_code` | pass | The accepted vocabulary equals the union of every `argument-hint` suffix under `.skilled/commands`: `:auto` (26 files), `:confirm` (25), `:unattended` (3), `:autopilot` (3), `:with-phases` (2), `:with-context` (2), `:with-research` (1). No documented suffix is refused. [SOURCE: .skilled/commands/speckit/complete.md:3] [SOURCE: .skilled/commands/speckit/plan.md:3] |
| `checklist_evidence` | notApplicable | Phase-parent packet has no `checklist.md`; scope is the five area files. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/spec.md:1] |

The sweep covered every `argument-hint:` line under `.skilled/commands` (46 files), so the comparison is against the whole advertised surface, not a sample.

## Integration Evidence

- `command-attach.ts` is imported by the scorer's fusion path, and both sides name the same typed command there; the drift above is confined to the transcript parser, not to ranking. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:1231]
- The scorer's `commandParts` is also used for document lookup and confirm-workflow stems, so the same extra segment affects three read paths, not only `namesCommand`. [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs:645]
- The guard tests pin `/speckit:complete:auto:with-research` as a command for the attach matcher, which is the exact input the scorer still splits differently. [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/command-attach-guards.vitest.ts:445]

## Edge Cases

- The scorer's `MODE_SUFFIX` is anchored at the end, so a chain that ends in `:auto` still parses correctly while the same chain ending in `:with-research` does not. The defect is asymmetric, which is why a single path test on `:auto` would not catch it. [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs:612]
- The command docs treat `:with-*` as a workflow input, not an execution mode, which is a reason to keep its words in prompt tokenization. That choice is separate from the name-parsing defect and does not excuse it. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/text.ts:43]
- This finding is reported against the changed matcher line because the transcript parser belongs to the `scorer-7` area. The scorer owner can fix it in its own file; no code was changed here.

## Confirmed-Clean Surfaces

- Every documented suffix is accepted, and no extra suffix is accepted beyond the documented union. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:210]
- The negative cases stay refused: an unknown modifier before or after a known one gives no command. [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/command-attach-guards.vitest.ts:447]
- `typedCommandForTop` still gates the command on the leading skill's ownership, so the widened vocabulary cannot carry a command under an unrelated skill. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:261]

## Ruled Out

- A missing documented suffix: the sweep found none; the matcher's set is the complete union. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:210]
- A per-command vocabulary requirement in the spec: no spec requirement narrows the suffix set per command, so the shared set is not a spec contradiction. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/goal.md:365]
- Double reporting the previous review's file-extension limit: not repeated; the recorded limit states the behavior and this iteration found no new input that breaks it.

## Next Focus

- Dimension: security and maintainability (cross-reference pass)
- Focus area: the vitest config's environment handling as a trust boundary, then the accuracy of the new module comment and the test coverage the branch adds.
- Reason: traceability produced one P2 on a measurement surface; the remaining configured dimensions are security and maintainability.
- Rotation status: correctness and traceability complete; security and maintainability next, in one cross-reference pass because two dimensions remain under a three-iteration cap.
- Blocked/productive carry-forward: direct diff read plus source-reproduced probes stay productive; no blocked approaches.
- Required evidence: an input that crosses the test-environment trust boundary, or a comment claim contradicted by a command document.
- Recovery note: not in recovery.

Review verdict: PASS
