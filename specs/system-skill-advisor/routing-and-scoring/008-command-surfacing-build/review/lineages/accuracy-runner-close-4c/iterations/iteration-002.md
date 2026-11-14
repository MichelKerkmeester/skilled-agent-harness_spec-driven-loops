# Review Iteration 2

- Mode: review
- Lineage: `accuracy-runner-close-4c`
- Run: `fanout-accuracy-runner-close-4c-1794682797954-pcdanq`
- Iteration: 2 of 2
- Dimension: traceability and maintainability
- Budget profile: adjudicate (8-10 read actions)
- Sources read: `review-brief-4c.txt`, `steer.md` (absent), the iteration-1 strategy and registry,
  `review/verify-4/report.md`, `027-review-pass-four-remediation/scratch/review-rounds.txt`,
  `027-review-pass-four-remediation/spec.md:204-238`, `tasks.md:100-110`

## Dispatcher

`/deep:review` fan-out lineage `accuracy-runner-close-4c`. The traceability pass reads the
routing-accuracy `README.md` against the writers and the scorer after the 4c doc fix. It confirms
the two 4b accuracy-runner findings and looks for sentences the `offeredAs` persistence fix made
false.

Operator focus addressed: the docs-agree-with-code half of the 4c checks — the T030 field lists
and head-moved sentence, plus the `offeredAs` sentences the writers changed.

## Files Reviewed

- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/README.md:63-85,120-126,185-188`
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/command-offer.mjs:440-508`
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/run-command-behaviour.mjs:980-1085,1187-1206`
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs:1458-1478,1620-1685,1880-1897`
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/027-review-pass-four-remediation/spec.md:204-238`
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/027-review-pass-four-remediation/tasks.md:100-110`

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **The README says a stored run line holds no `offeredAs`, but both current writers store it** -- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/README.md:123` -- The sentence "A stored run line holds no `offeredAs`, so its offer counts as before" is now true only for a line written before the field existed. The backfill writes `offeredAs` at `command-offer.mjs:496`, the live turn spreads `offerLineFields` at `run-command-behaviour.mjs:1203`, and the scorer reads it at `score-command-transcripts.mjs:1471-1476` to split `offeredAsPartner` from `offered`. A newly stored line therefore holds the field, and a partner-side command is counted in `offeredAsPartner`, not in `offered`. [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/README.md:123]
   Finding class: traceability
   Scope proof: the README is the changed accuracy-runner path in `review-scope-4c.txt`; both writers and the scorer are the brief's verification surfaces.
   Affected surface hints: `offerOf`, `offeredAsPartner`, `offerFieldAbsent`, stored run logs, backfill.
   Case: a live line written at `run-command-behaviour.mjs:1201-1205` carries `offeredAs: "partner"`; `offerOf` counts it in `offeredAsPartner` and not in `offered`, while `README.md:123` says a stored line holds no `offeredAs` and counts as before.
   Claim: the blanket stored-line statement is false after the writers began keeping `offeredAs`.
   Evidence refs: `README.md:123`, `command-offer.mjs:496`, `run-command-behaviour.mjs:1203`, `score-command-transcripts.mjs:1471-1476`.
   Counterevidence sought: checked whether `stored` is defined elsewhere as a pre-field line; the README's `--brief-only` paragraph at `:85` says "present or absent", so the document already knows a stored line can hold the field.
   Alternative explanation: the sentence was written when only legacy lines existed and was not updated after T006/T007.
   Final severity: P2. Confidence: high.
   Downgrade trigger: withdraw if a later definition names `stored` as the pre-offeredAs corpus only.

2. **The runner row says `--brief-only` rewrites the four fields, but that mode copies the offer fields untouched** -- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/README.md:125` -- The row lists `[--brief-only]` in the same sentence as "rewrites a finished log with `offeredCommand`, `offeredPolicy`, `offeredAs` and `briefDelivered`". `backfillRunLog` at `command-offer.mjs:489-490` copies the line and changes only `briefDelivered` and `briefBackfilled` when `briefOnly`; a legacy line with no offer fields stays without them. The paragraph at `README.md:85` already says brief-only keeps every offer field exactly as the input line holds it. [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/README.md:125]
   Finding class: maintainability
   Scope proof: the README is the changed accuracy-runner path; the backfill branch is the writer the row describes.
   Affected surface hints: `--brief-only`, backfill field list, `briefBackfilled`, legacy run logs.
   Case: a legacy line with no `offeredCommand`, `offeredPolicy` or `offeredAs`, run through `--backfill --brief-only`; the output line has `briefDelivered` and `briefBackfilled` but none of the three offer fields, contradicting the runner row.
   Claim: the `[--brief-only]` clause in the row promises the four-field rewrite the mode does not perform.
   Evidence refs: `README.md:125`, `README.md:85`, `command-offer.mjs:489-490`, `run-command-behaviour.mjs:1067-1082`.
   Counterevidence sought: checked whether `--brief-only` is rejected with `--backfill` or whether the row scopes the bracket to a different path; `run-command-behaviour.mjs:1081-1082` accepts the pair, and the row names both in one sentence.
   Alternative explanation: "rewrites with" could mean the output may hold the fields when the input does; the paragraph at `:85` is the precise statement, and the row is the imprecise one.
   Final severity: P2. Confidence: high.
   Downgrade trigger: withdraw if the row is read as describing the default backfill only and the bracket is treated as a separate mode heading.

## Traceability Checks

- `spec_code` -- partial. T030 fixed the two 4b list counts and added the head-moved sentence; `README.md:70` matches `run-command-behaviour.mjs:1180-1184`, `:76` says four fields and `:125` lists `offeredAs`. The two sentences above remain the only doc-code drift.
- `checklist_evidence` -- partial. AC-010 asks the docs to name the behaviour the code has; the T030 sentences do, but `:123` and the `[--brief-only]` clause at `:125` do not. `CHK-040`'s offeredAs field-list claim is met by both lists.
- `skill_agent` -- notApplicable. No agent definition changed in this area.
- `agent_cross_runtime` -- notApplicable. No runtime branch in the changed doc; the Codex reader is covered by the iteration-1 check.
- `feature_catalog_code` -- notApplicable. No feature-catalog page describes the changed accuracy-runner lines.
- `playbook_capability` -- notApplicable. No playbook surface changed.

## Integration Evidence

- The 4c brief's "docs agree with code" check is the one this pass runs. Its doc of record is
  `routing-accuracy/README.md`; the code it describes is `command-offer.mjs`,
  `run-command-behaviour.mjs` and `score-command-transcripts.mjs`.
- The T030 verification strings are present: `rg 'three fields'` finds nothing,
  `README.md:70` carries "carries none of the four", and `README.md:125` carries the four-field
  backfill list.
- The verify-4 report's deferred items are phase 026 work by
  `027-review-pass-four-remediation/spec.md:214`: the pair-doc shared-row sentence, the reserved
  `paired` arm name and the `unscoredOnly` field are not re-reported here.

## Edge Cases

- The `--brief-only` sentence at `:125` and the paragraph at `:85` contradict each other. The
  finding cites the row because T030 edited it; the paragraph is the correct statement and needs
  no change.
- The stored-line sentence at `:123` can be read as the legacy corpus the scorer was built on.
  The finding is scoped to a line written by the current writers, which the T006/T007 fix makes
  possible; it does not dispute a legacy line's count.
- The pair-doc shared-row sentence (`:123`), the reserved `paired` arm name and the dead
  `unscoredOnly` field remain open by design. They are deferred to phase 026 and are not counted
  as new findings.
- The redirect P2 from iteration 1 remains active. It is carried forward, not re-opened as a
  second finding.

## Confirmed-Clean Surfaces

- AR4B-P2-001 is fixed: `README.md:76` says "four fields", `:125` lists `offeredAs` in the backfill
  field list, and no "three fields" string remains in the document.
- AR4B-P2-002 is fixed: `README.md:70` names the head-moved line's four-field exception, and the
  exception matches `run-command-behaviour.mjs:1180-1184`.
- The backfill's default path writes the four attribution fields plus `offerError` and
  `offerBackfilled` (`command-offer.mjs:492-500`), and `README.md:188` lists them.
- The brief-only path copies a present offer and leaves an absent one absent
  (`command-offer.mjs:489-490`), as `README.md:85` says.
- The head-moved row says `restored: false` and lists the changed paths
  (`run-command-behaviour.mjs:1183-1184`), as `README.md:125` says.
- The `--pair` block's shape (`from`, `to`, `rows`, `gained`, `lost`, `bothFollowed`,
  `neitherFollowed`) matches `score-command-transcripts.mjs:1896`; the shared-owned-row limit is
  the deferred phase 026 item, not a new finding.

## Ruled Out

- **The T030 edits are incomplete.** Ruled out: the three exact strings are present, and the
  head-moved sentence matches the writer's early return.
- **The top field list still says three fields.** Ruled out: `README.md:65-70` names four,
  including `offeredAs` and the head-moved exception.
- **The output sentence still omits `offeredAs`.** Ruled out: `README.md:188` lists it.
- **The pair-doc shared-row limit is a new finding.** Ruled out: `027` spec:214 defers the pair
  doc, the `paired` name and `unscoredOnly` to phase 026.
- **The redirect edge is a P1.** Ruled out: the false start needs a `2>` or `&>` target that names
  a command document, and the parser's supported redirect grammar is a P2 edge, not a blocked
  release path.

## Next Focus

- Dimension: none remaining within the cap; synthesis
- Focus area: compile the lineage report from the registry, the two deltas and the three active
  P2 findings.
- Reason: two iterations are complete; the cap is reached with three active P2 advisories and no
  P0/P1.
- Rotation status: correctness and security complete in iteration 1; traceability and
  maintainability complete in iteration 2.
- Required evidence: the registry's active counts, the two iteration final lines and the synthesis
  report.
- Blocked/productive carry-forward: no blocked approach; the redirect P2 is carried.
- Recovery note: none; the cap is reached before a legal convergence stop.

## Verdict

No active P0 or P1 finding. Three P2 documentation and parser-edge findings remain active; the
verdict is PASS with advisories.

Review verdict: PASS
