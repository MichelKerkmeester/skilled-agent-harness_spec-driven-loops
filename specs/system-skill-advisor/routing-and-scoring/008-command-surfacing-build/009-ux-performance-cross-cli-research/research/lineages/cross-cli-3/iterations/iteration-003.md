# Iteration 3: Does phase 013's delivery and attribution read true per runtime

## Focus

The third carried question of this lane: on the committed after arm, does phase 013's attribution now answer `briefDelivered` truthfully for each runtime, and where does it still overstate or understate reach.

## Actions Taken

1. Scored the committed `013-.../scratch/runs-post-attributed.jsonl` with the committed scorer, `node .../score-command-transcripts.mjs --summary`.
2. Counted `briefDelivered` per runtime directly from the 144 run lines, independently of the summary.
3. Read the scorer's `offerOf`, `addScored` and `scoreRun` to check what each printed counter actually reads.
4. Compared the scored numbers with `013-.../scratch/summary-post-after.json` and with the parent goal log's after-arm rows.

## Findings

1. **Delivery is answered on 119 of 144 lines, and the split is exactly the one the phase claims.** From the file: claude `true` 24, pi `true` 24, devin `true` 24, dsh `true` 23 plus `unknown` 1, codex `false` 24, opencode `unknown` 24. That is 95 true, 24 false, 25 unknown. The 013 summary's "119 of 144, up from 24" reproduces exactly, and the offer fields on every line are unchanged. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/013-attribution-and-install-reach/scratch/runs-post-attributed.jsonl] [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/013-attribution-and-install-reach/scratch/summary-post-after.json]

2. **The new summary counters read the field they were added for.** OpenCode prints `delivery unknown 24`, Codex prints `offer reached 0`, and the other four print `offer reached 3`; `offer field absent` is 0 on all six where the pre-arm read 24. So the rename from `offerUnknown` to `offerFieldAbsent` and the new `deliveryUnknown` are live, not decorative. [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs:1293] [scorer output 2026-11-13]

3. **Codex's `false` is an approval fact, not a delivery failure.** The line carries `briefDelivered:false` with `briefBackfilled:true` and `offeredCommand:null`, and the value comes from the Codex hook-approval check rather than from a session read. The arm is now honest that nothing arrived, but it still cannot separate "the host refused the hook" from "the hook was never approved" — both read `false`. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/013-attribution-and-install-reach/scratch/runs-post-attributed.jsonl] [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/command-offer.mjs]

4. **`true` proves the store holds the brief, not that the model saw it.** For Claude the evidence is the transcript's `hook_additional_context`, which is as close to proof as the arm gets. For pi, devin and dsh the evidence is a session-store entry the harness wrote, so `briefDelivered: true` means "the runtime stored the injected text" — the same text the shared readers previously dropped. The field name promises slightly more than the evidence carries. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/013-attribution-and-install-reach/implementation-summary.md:117] [SOURCE: .skilled/hooks/shared/session-readers/README.md]

5. **One unknown is invisible in the summary because the same row cannot be scored.** DSH's single `unknown` belongs to `cmd-deep-review-plain-tune-01`, whose locator has no `sessionId`; the scorer records it `locator_unavailable`. `deliveryUnknown` is counted inside `addScored`, so a row that never scores contributes no `delivery unknown`. DSH therefore prints `delivery unknown 0` while its log holds one. The denominator for delivery unknown is scored rows, not run lines. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/013-attribution-and-install-reach/scratch/runs-post-attributed.jsonl] [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs:1300]

6. **The safety fold landed and Devin's unsafe count rose, as rank 5 of segment two intended.** The scored after arm reads unsafe: devin 2, pi 1, opencode 2, dsh 0, claude 0, codex 0, with `loops without init 1 of 1` on Devin. The goal log's after-arm row says Devin 1; the extra one is the loop-without-init row now counted unsafe, so "unsafe 0" again means what it says on the other runtimes. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/013-attribution-and-install-reach/scratch/summary-post-after.json] [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/goal.md:132]

7. **Attribution changed no behaviour, which is the correct result.** Start rates on the attributed arm equal the pre-013 arm: claude 4 of 12, codex 0 of 12, pi 2 of 10, devin 3 of 9, opencode 1 of 5, dsh 6 of 12. `--brief-only` replays no offer and writes no brief, so the arm is the same measurement with a better label. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/013-attribution-and-install-reach/scratch/summary-post-before.json] [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/013-attribution-and-install-reach/scratch/summary-post-after.json]

## Ruled Out

- Re-running the arm to answer OpenCode delivery. The brief never becomes a session part, so a rerun would produce the same 24 `unknown`; the only fix is a written marker, which the phase deliberately declined because a plugin-written marker proves the plugin ran, not that the host delivered.
- Reading `briefDelivered: true` as obedience. It is a delivery fact; every start rate in this iteration is computed from the scorer's own start rows.

## Dead Ends

- Trying to derive the DSH unknown from the store: the row has no session id, so there is nothing to open. The row needs the runner to record a session id, not the reader to guess one.

## Edge Cases

- Ambiguous input: "read true" could mean "the field is populated" or "the field means what its name says". Answered both: populated on 119 lines, and `true` means stored, not seen.
- Contradictory evidence: the goal log says Devin unsafe 1 after the arm and the scorer says 2. Resolved in favour of the scorer: the extra row is the loop-without-init fold, which the goal log predates.
- Missing dependencies: no OpenCode store exists, so its 24 rows stay unknown; recorded as a gap, not an error.
- Partial success: attribution is complete for five runtimes and structurally incomplete for one.

## Sources Consulted

- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/013-attribution-and-install-reach/scratch/runs-post-attributed.jsonl`
- `.../scratch/summary-post-before.json`, `.../scratch/summary-post-after.json`
- `.../013-attribution-and-install-reach/implementation-summary.md`
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs`
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/command-offer.mjs`
- `.skilled/hooks/shared/session-readers/README.md`
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/goal.md`
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/009-ux-performance-cross-cli-research/research/lineages/cross-cli-3/steer.md` (absent; not present at the time of this iteration)

## Assessment

- New information ratio: 0.8
- Questions addressed: Does phase 013's delivery and attribution now read true per runtime, and where does it still overstate or understate reach?
- Questions answered: the same question, with the OpenCode and DSH residuals named

## Reflection

- What worked and why: counting the field straight from the JSONL rather than trusting the summary caught the DSH row the summary cannot see. The summary is a view over scored rows, and one delivery fact lives on an unscored row.
- What did not work and why: my first per-runtime filter compared a boolean to the string `"true"`, so it printed every DSH row. The second pass selected on the string `unknown` and found the one row immediately.
- What I would do differently: read `addScored` before reading the summary, so the counting scope is known before the numbers are interpreted.

## Recommended Next Focus

Rank the cross-CLI options by started-when-useful gain per unit of floor risk, naming the file, the measured gain and the check for each, and settle whether the OpenCode compiled-routing line and the Claude visibility option rank above or below the delivery residuals.
