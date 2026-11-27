# Iteration 3: Correctness — whether the rejected findings were rightly rejected

## Dispatcher

- Mode: review. Target agent: `@deep-review`. Execution: single review iteration, inline in the `vibe-1` fan-out lineage.
- Artifact directory: `specs/system-skilled-bots/002-openbot-parity-research/004-reference-evidence-research/review/lineages/vibe-1`.
- `steer.md` does not exist in the lineage directory at the time of this iteration; it is listed among the sources as absent.
- Dimension this iteration: correctness. Focus: the regrade log's `wrong` and `dropped as out of scope` verdicts, sampled where the rejection removes a recommendation, and whether the document's own statements about what it excludes match what it excludes.

## Files Reviewed

- `research/regrade-log.md:1-53` (001, 002), `:99-148` (005, 009, 010), `:307-372` (net-new and `openhuman-full`)
- `research/research.md:22` (the grade rule), `:34` (the bottom-line counts), `:304-317` (009 pitfalls), `:386` (012 differs row 1), `:359` (011 lift row 2), `:640-658` (section 8)
- Plan lines behind the sampled rejections: `B/contracts/decisions.md:35` (D11), `B/contracts/prompt-sections.md:210-214`, `B/005-memory/design/module-contract.md:94-100`, `B/005-memory/spec.md:146-154`, `B/009-skills/spec.md:162`, `B/009-skills/design/fixtures.md:128`, `B/006-approval-grants/spec.md:97-101`, `B/003-terminal-screen/002-architecture-and-contracts/design/architecture.md:384-388`
- Reference lines behind the sampled rejections: `C/OpenBot-main/docs/automatic-learning.md:77-81`, `C/OpenGhost-main/memory.js:26-40`, `C/OpenBot-main/docs/approvals.md:1-10` and `:36-44`, `C/OpenBot-main/shared/standing-rule.ts:8-30`

## Findings - New

### P0 Findings

None.

### P1 Findings

None new. `R2-P1-001` remains active.

### P2 Findings

1. **Section 1 says a finding graded `wrong` is not in the document, and 27 `wrong` origins are credited in the Origin column of surviving rows** -- `research/research.md:22` -- The rule reads "A finding graded `wrong` or `not verified` is not in this document. It is in `research/regrade-log.md` with the reason." Twenty-seven origins the regrade log marks `wrong` are credited as origins of rows that are in the document: `V1-9-6` and `V1-7-1` on 012 differs row 1 (`:386`), `V2-6-5` on 009 pitfall row 4 (`:311`), `P2-1-5` on 011 lift row 2 (`:359`), and 23 more. Thirty-two origins marked `dropped as out of scope` are credited the same way, `V2-9-3` among them on net-new candidate 16. Section 8's clarification covers only two of the six outcomes — "A finding counted 'downgraded to weak' or 'citation corrected' is also a row in sections 3 to 5" — and says nothing about `wrong` or `out of scope`. The practice is defensible, since a partly-wrong finding can still be the origin of the part that survived, but the rule as written is false for 59 origins.
   Finding class: documentation-accuracy
   Scope proof: the 27 and 32 are script counts of distinct origins by outcome in `research/regrade-log.md`, intersected with the origins cited in `research/research.md`. Four were opened by hand and each is credited on the row named: `V1-9-6` and `V1-7-1` at `research/research.md:386`, `V2-6-5` at `:311`, `P2-1-5` at `:359`. The rule is at `research/research.md:22`; the partial clarification is at `:658`.
   Affected surface hints: `research/research.md:22`, `:658`, and every Origin cell that credits a `wrong` or `out-of-scope` origin.
   Case: a reader takes section 1 at its word, treats the 106 `wrong` rows as absent from the document, and then finds `V1-9-6` credited on 012 differs row 1 — and cannot tell whether the row is supported by a finding the log calls wrong or by a part of it that survived.

2. **Section 2 says the plan lacks "about twenty guards", and section 3's pitfall tables hold 32 rows** -- `research/research.md:34` -- The bottom line reads "about twenty guards the plan lacks". The fourteen phase sections carry 32 pitfall rows across eleven phases: 001 two, 002 two, 003 five, 005 two, 006 four, 008 four, 009 six, 010 one, 011 four, 012 one, 014 one. Three phases (004, 007, 013) have none. The gap is not a rounding: a reader who counts the tables gets 32, and the eight "guards with the highest stakes" that follow are a selection from that 32, not a summary of twenty.
   Finding class: documentation-accuracy
   Scope proof: the count is a script count of rows matching `| <n> |` inside each `**Pitfalls the plan does not guard against**` table in `research/research.md`, section by section; the per-phase figures are in the iteration delta. The claim is at `research/research.md:34`.
   Affected surface hints: `research/research.md:34`, `:45-54` (the eight highest-stakes guards), and the eleven pitfall tables in section 3.
   Case: a builder scoping the guard work from section 2 plans for twenty guards, then finds 32 rows in the phase sections and cannot tell which twelve the bottom line dropped or whether they are lower priority.

## Traceability Checks

| Protocol | Status | Evidence |
|---|---|---|
| `spec_code` | pass | Four sampled `wrong` verdicts were re-derived from the lines they cite and all four hold: `V1-2-1` is wrong because D11 lowered the list cap to 20,480 and `B/contracts/prompt-sections.md:212` says "a bot at both caps fits and is not refused"; `V2-5-9` is wrong because `C/OpenBot-main/docs/automatic-learning.md:79` makes auto-approval a skills setting, not a memory one; `P2-5-2` is wrong because `C/OpenGhost-main/memory.js:28-30` skips the reload while a local change is pending; `V1-2-3` is wrong because `B/005-memory/design/module-contract.md:98` bounds the overshoot and `B/005-memory/spec.md:152` gives `--forget` as the exit. |
| `checklist_evidence` | pass | The regrade log's cross-references into the document resolve: `V1-2-1`'s rejection says "The contradiction is now 009 pitfall 5", and 009 pitfall 5 exists at `research/research.md:313` and states the D11 contradiction with both sides cited. `V2-6-1`'s rejection rests on `B/003-terminal-screen/002-architecture-and-contracts/design/architecture.md:386`, which does say runtime text has bidi overrides replaced. |

## Integration Evidence

- The 006 contradiction section 2 lists is real and correctly described: `B/006-approval-grants/spec.md:99` calls the kind order "OpenBot's order", `C/OpenBot-main/docs/approvals.md:5` lists delete, send, share, post, pay, credentials, and only the table rows at `:38-43` run in the plan's order. No line states a precedence among kinds.
- The 009 contradiction section 2 lists is real: `B/009-skills/spec.md:162` and `B/009-skills/design/fixtures.md:128` still say a bot at both caps is "always refused", against D11 at `B/contracts/decisions.md:35` and `B/contracts/prompt-sections.md:212`.
- The 006 lift row 1 predicate is exact: `C/OpenBot-main/shared/standing-rule.ts:21-29` is `offersStandingRule`, and `:10-14` gives the check-in reason the row quotes.

## Edge Cases

- The regrade log's outcome column is not a partition of the findings. An origin can appear in more than one row with different outcomes, and an origin marked `wrong` can still be credited on a surviving row for the part that held. This is why the 27 and 32 counts are of distinct origins, not of rows.
- `V2-9-3` is marked `dropped as out of scope` for phase 009 and is a confirmed origin of net-new candidate 16. Read as "out of scope for that phase", the verdict is right; read as "dropped", it contradicts section 5. The document does not say which reading applies.
- The `not verified` outcome has one origin, and it is also cited in the document. One case is not enough to call the rule false on its own; the finding rests on the 27 `wrong` origins.

## Confirmed-Clean Surfaces

- Every sampled `wrong` verdict is right on the lines it cites. The four opened by hand were re-derived independently and each rejection holds.
- The regrade log's internal cross-references resolve: "009 pitfall 5" exists and covers the D11 contradiction it is said to cover.
- The two plan contradictions sampled from section 2's list of six (006's kind order, 009's both-caps sentence) are real and correctly described.
- The 006 lift row 1 predicate and its reason lines are exact.

## Ruled Out

- **The `wrong` verdicts as a pattern of over-rejection.** Four were re-derived from their cited lines and all four hold; the rejections are grounded, not dismissive.
- **The 59 dual-status origins as a defect in the regrade log itself.** The log's reason text usually says which part survived ("The narrow part, a refusal that names no repair, is kept as weak in 005 pitfall 1"), so the log is internally honest. The defect is in section 1's absolute rule, not in the log.
- **The `out of scope` verdicts as hiding a phase gap.** The sampled ones either belong to a phase outside the fourteen or survive as a net-new candidate; none names a phase requirement left uncovered.

## Next Focus

- Dimension: security
- Focus area: the security-relevant recommendations — the 008 leak-scan forms, the 011 send-unknown ordering, the 009 invisible-character and symlink guards, and the 006 deny-resume sentence.
- Reason: these are the rows where a wrong recommendation costs more than a wrong citation, and the document itself ranks them as the highest-stakes guards.
- Rotation status: correctness twice (iterations 1, 3), traceability once (iteration 2); security and maintainability not yet started.
- Blocked/productive carry-forward: nothing blocked. Productive: re-deriving a verdict from the lines it cites rather than reading the reason text.
- Required evidence: `research/research.md:45-54` and the 006, 008, 009 and 011 sections; the plan's leak-check, refusal and prompt-section contracts.

Review verdict: CONDITIONAL
