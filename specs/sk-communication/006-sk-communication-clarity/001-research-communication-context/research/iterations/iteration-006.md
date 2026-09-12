# Iteration 6: Anchor spot checks on the five hardest-leaned stack citations

## Focus

Verify, by direct file:line reads, the stack anchors the merged map leans on hardest, then hold
budget. The dispatch focus and iteration 5's Recommended Next Focus match verbatim. The named
candidates were `repo-rules/communication.md:49-51` (ceiling), `HVR:114`, `AGENTS.md:144` and
`communication.md:116-126`.

A citation census over iterations 1-5 (grep for `[SOURCE: ...]` tokens, one call) confirmed those four
are the top-cited stack anchors (`communication.md:49-51` 4x, `communication.md:116-126` and
`communication.md:76` 2x each, `HVR:114` and `AGENTS.md:144` in the conflict rows) and surfaced a
fifth, `communication.md:104-106`, the repo side of open conflict row C-2. Five anchors, no source
rereads, no ambiguity in the focus.

Deliberately out of scope this iteration: the merge itself, the corrected counts (32 gate-facing rows,
iteration 5 F1/F3), and the two closed verifications (candidate 24 doctor mirrors, candidate 25
comment checklist). Both the dispatch focus and iteration 5's own next-focus note bar them.

## Actions Taken

1. Read runtime state: `deep-research-config.json`, `deep-research-state.jsonl` (5 iteration records
   plus 1 pre-existing `containment_violation` event for iteration 5 naming untracked files under
   `specs/hooks/022-smart-rule-injection/**`, all `preserved_untracked`), and
   `deep-research-strategy.md` sections 3, 9, 10A, 11, 13. Hard-block invariants hold:
   `convergenceMode: "off"`, `progressiveSynthesis: true`, `lineageMode: "new"`, 10 max iterations.
2. Verified the packet write boundary: packet root is
   `.../001-research-communication-context/research/`; `iterations/iteration-006.md` and
   `deltas/iter-006.jsonl` did not exist; no reducer-owned file scheduled for a write.
3. Citation census over `iteration-001..005.md` to rank the anchors by citation count (one grep).
4. Spot-check reads (two bounded `awk`/`grep` calls): the five anchors verbatim, the ceiling
   vocabulary, and the `load-bearing` term census across `AGENTS.md` and `repo-rules/`.
5. Read `deltas/iter-005.jsonl` line 1 and the gateway script's arg handling before composing this
   iteration's record, to mirror the accepted schema exactly (identity pair
   `runId`/`lineageId`, `run` field, graph event shapes).

## Findings

### F1 - All five hardest-leaned anchors hold verbatim (0.5, partially new)

Direct reads, each matching the map's attribution exactly:

- `repo-rules/communication.md:49-51`: "The shape of a decision you hand over, the verdict-first
  ordering and the recommendation, moved to [`presenting-decisions.md`] ... when this file reached
  its length ceiling." The ceiling sentence the split-not-append constraint rests on is verbatim at
  the cited lines, with "length ceiling" appearing at :51 and nowhere else in the file.
- `repo-rules/communication.md:104-106`: "**Never use an em dash.** Replace it with a comma, a full
  stop or a colon, whichever the sentence actually wanted." Colon is the repo's own suggested
  replacement, which is C-2's repo side.
- `repo-rules/communication.md:116-126`: "This rule carries the ban because it fires on every
  substantive reply. The full standard ... is the Human Voice Rules, which `sk-doc` routes to. Load
  all of it when writing a document." (:119) then "**In a reply, take its voice half and leave its
  document half.**" (:121). The cited band is exactly the reply/document carve-out the map says
  reply-facing adoption flows through.
- `AGENTS.md:144`: "keep every load-bearing claim legible, size effort to its blast radius, and
  close out honestly." The exact hyphenated term sits in the root doc's Operating Discipline
  blockquote, which is C-4's premise.
- `.opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md:114`: the Em Dash Ban
  table row (Action: NEVER use; Replace With: Comma, full stop or colon). The row number is exact.

No correction is needed to any of the five, and the two-line bands render the claimed content, not a
neighbouring one.

`[SOURCE: repo-rules/communication.md:49-51, :104-106, :113, :116-126]`
`[SOURCE: AGENTS.md:144]`
`[SOURCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md:112-118]`

### F2 - The `load-bearing` census corrects C-4's named locations (1.0, new)

An exact-term grep over `AGENTS.md` and `repo-rules/` (the declared scope of C-4's parenthetical)
finds four occurrences, but not where the row says. C-4 names "`AGENTS.md:144`, `AGENTS.md:243`,
`handoff-and-questions.md:39` (four occurrences)". Actual census:

- `AGENTS.md:144` (hit, "load-bearing claim legible")
- `AGENTS.md:243` (hit, "A load-bearing claim carries its evidence")
- `repo-rules/evidence-and-proof.md:42` (hit, "Every load-bearing claim ...", the rule's declaration
  sentence)
- `repo-rules/evidence-and-proof.md:204` (hit, "Every load-bearing sentence is marked OBSERVED,
  DERIVED, or INFERRED.", the rule's self-check row)

`repo-rules/handoff-and-questions.md:39` contains the bare noun only: "...which is when this rule
earns its load." No hyphenated term. So the count (4) is right within the declared scope while the
named anchor set is 2 of 3 accurate and omits both real repo-rule occurrences.

Consequence for open conflict row C-4 (the "load-bearing" ban versus framework vocabulary): the
exemption has to cover `evidence-and-proof.md:42` and its self-check at :204, and the
`handoff-and-questions.md:39` citation should be dropped. One correction, and the row's blank is in
exactly the place phase 002 would look for the collision surface.

`[SOURCE: grep -n "load-bearing" AGENTS.md; grep -rn "load-bearing" repo-rules/]`
`[SOURCE: repo-rules/evidence-and-proof.md:42, :204]`
`[SOURCE: repo-rules/handoff-and-questions.md:39]`
`[SOURCE: research/iterations/iteration-004.md line 118 (C-4 row)]`

### F3 - The root doc already delegates register rules to the rule files (0.5, partially new)

`AGENTS.md:148`: "Registers are expanded by [`communication.md`] and [`presenting-decisions.md`] (the
intended-path bullet); blast radius by [`blast-radius.md`]." The line sits immediately under the
:144 blockquote and shows the root doc's role is to point at the rule files for register rules. That
confirms Q4's premise: a new register rule's owning surface is the named rule file, and the root doc
carries only the clauses that must bind when nothing loads (already recorded in the strategy's Known
Context for section 8). First time this exact line is cited in this run.

`[SOURCE: AGENTS.md:148]`
`[SOURCE: research/deep-research-strategy.md section 12, Known Context]`

## Ruled Out

- Re-opening the merge, the corrected counts (32 gate-facing rows) or the two closed verifications
  (candidates 24 and 25): both the dispatch focus and iteration 5's Recommended Next Focus bar them.
  Neither was approached. `[SOURCE: iteration-005.md, Recommended Next Focus]`
- Treating the four-occurrence count in C-4 as wrong because only three lines are named: the count
  is correct within the declared scope. Only the location list is wrong, so the correction is a
  citation fix, not a recount. `[SOURCE: F2 above]`

## Dead Ends

- No new dead ends worth reducer promotion. The standing exhausted items (`sk-communication` as a
  rule owner, and the strategy's BLOCKED directions) were used as constraints, not revisited.

## Edge Cases

- **Ambiguous input: none.** Dispatch focus and strategy's next focus agree verbatim.
- **Contradictory evidence (found and resolved).** The map's C-4 row and the exact-term census make
  incompatible claims about where `load-bearing` occurs. Resolved in favour of the direct file
  evidence (F2); the row's count stands, its location list is corrected. Flagged for the reducer so
  the map is republished before phase 002 consumes it.
- **Missing dependencies: none.** Reducer-owned files read-only and untouched.
- **Partial success: none.**
- **Pre-existing workspace condition (not this iteration's).** The state log's last record before
  this iteration is a `containment_violation` event for iteration 5 (`research-i5-g1`) listing
  untracked files under `specs/hooks/022-smart-rule-injection/**`. All were `preserved_untracked`.
  This iteration wrote only to its two artifact paths and the gateway. `[SOURCE:
  deep-research-state.jsonl, containment_violation record]`

## SCOPE VIOLATIONS

None. Every persistent write stayed inside the allowed list
(`research/iterations/iteration-006.md`, `research/deltas/iter-006.jsonl`, plus the gateway's own
writes). One contracted scratch file was created under `/tmp` as the gateway's `--event-json` input;
it is outside the repository and is not state. `research/research.md` was left untouched: the config
sets `progressiveSynthesis: true`, but the iteration pack's allowed-write list excludes it, and
iteration 5's F2 already records the consumer consequence of that gap.

## Sources Consulted

- `research/deep-research-config.json`, `research/deep-research-state.jsonl` (5 iteration records +
  1 containment event), `research/deep-research-strategy.md` (sections 3, 9, 10A, 11, 13)
- `research/iterations/iteration-001.md` through `iteration-005.md` (citation census via grep only,
  no rereads)
- `repo-rules/communication.md:45-60`, `:102-130` (bounded reads)
- `AGENTS.md:140-150`, `:240-246` (bounded reads)
- `repo-rules/handoff-and-questions.md:37-41` (bounded read)
- `repo-rules/evidence-and-proof.md:42`, `:204` (grep hits)
- `.opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md:110-120` (bounded read)
- `research/deltas/iter-005.jsonl` line 1 and `.opencode/skills/system-deep-loop/runtime/scripts/append-mode-event.cjs` (arg handling) for schema mirroring

## Assessment

- **New information ratio: 0.67.** F1: 0.5 (five anchors confirmed verbatim, content known from
  earlier iterations, direct confirmation is the new evidence), F2: 1.0 (first exact-term census,
  corrects a conflict row's evidence set), F3: 0.5 (consistent with the known structure, first cited
  at this line). (0.5 + 1.0 + 0.5) / 3 = 0.67. No simplicity bonus: this iteration confirms and
  corrects, it does not collapse the model further.
- **Questions addressed:** Q4's supporting evidence (owning surface) via F2 and F3. No key question
  changes answer state.
- **Questions answered:** none of Q1-Q5 fully. The iteration closes the anchor-reliability question
  raised by iteration 5's next-focus note: the five hardest-leaned stack citations are accurate.

## Reflection

- **What worked and why:** ranking the anchors by citation frequency before reading them turned a
  vague "spot-check the map" into a bounded, ordered list, so five anchors fit in two read calls.
  Reading iteration 5's file first supplied the exact anchor set instead of guessing it.
- **What did not work and why:** nothing failed. The one surprise (F2) came from the narrow grep
  being exact-term rather than phrase-family, which is what made the `handoff-and-questions.md:39`
  mismatch visible at all.
- **What I would do differently:** nothing material. If a further iteration is spent, the same
  census method should run over the remaining conflict-row citations, since F2 shows the map's
  evidence lists can be imprecise even where its counts are right.

## Questions Answered

- Anchor reliability (carried forward from iteration 5's next focus): the five hardest-leaned stack
  anchors are verbatim accurate at their cited lines (F1). No key question changes state.
- C-4's evidence set: corrected (F2). `handoff-and-questions.md:39` is not an occurrence, and
  `evidence-and-proof.md:42` / `:204` are.

## Questions Remaining

- Whether CI also runs the pi checkers, the codex-hooks-installer check and the fallback-health rows
  (`.github/workflows/agent-mirror-sync.yml` is the likely next read), iteration 5's F5 residual.
- Whether the unread `code-style-guide.md` section 4 and Webflow style-guide section 5 comment
  sections carry present-state wording, iteration 5's F4 residual.
- The baseline-capture scheduling question from iteration 4's F4 (with the reducer/operator).
- The 001 to 002 handoff's missing `research.md` (iteration 5 F2), a named gate blocker owned by the
  workflow/reducer.
- Duplicate `CHK-CMT-01` id in the `sk-code-quality` checklist asset (owned by that skill).
- New: the reducer should republish C-4 with the corrected location list before phase 002 consumes
  the map (F2). A reducer action, not a research direction.

## Next Focus

Hold budget. The anchor spot check passed, so iterations 7-10 have negative marginal value for this
run's questions; the dispatch's instruction to hold after the spot check applies. If the orchestrator
spends another iteration anyway, the two smallest named residuals are the
`agent-mirror-sync.yml` CI read (iteration 5 F5) and the two unread comment sections (iteration 5
F4). Recommended: do not spend.

## Recommended Next Focus

Hold: no further research iteration is needed for the five key questions. Route the F2 correction for
C-4 to the reducer, and leave the remaining residuals with their named owners.
