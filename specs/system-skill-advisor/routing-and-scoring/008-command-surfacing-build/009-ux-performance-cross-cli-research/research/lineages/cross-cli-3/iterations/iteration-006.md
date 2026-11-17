# Iteration 6: Floor-input map and the close of question coverage

## Focus

Close the loop by grounding the ranked set's "risk to the floors: none" claim in what each floor actually reads, and by re-stating the exact (e) answer text so the reducer can tick it — iteration 2's record carried the question without its backticks, so the exact-match tick did not fire.

## Actions Taken

1. Read the floor runner (`012-plain-offer-reach/scratch/floorcheck.sh`) to see which scripts produce every gated number.
2. Traced each ranked change from iteration 4 to the files those scripts read.
3. Re-read the strategy's key-question lines against the answered records produced so far.

## Findings

1. **The floors are two capture scripts over the prompt corpus and the scorer, and no ranked change is an input to either.** `FLOOR` and `TYPED` and `PLAIN` come from `capture-command-routing-baseline.mjs`; `EVAL` comes from `capture-scorer-eval-baseline.mjs`. The gates are typed recall ≥ 24 of 44, `false_offer` exactly 0 of 35, `false_offer_attached` exactly 0 of 35, typed combined ≥ 44, and the eval tuple ≥ [159,50,20,5]. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/012-plain-offer-reach/scratch/floorcheck.sh:20]

2. **Rank 1 cannot move a floor because it changes only the Claude mirror tree.** The capture reads `.skilled/commands` through the handler and the scorer; the mirror tree under `.claude/commands` is not an input to it, and the change adds no row and no alias. The one residual path — adding the skill to the canonical `.skilled/skills` inventory — was ruled out in iteration 4 for exactly this reason. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-runtime-mirrors.cjs:200]

3. **Rank 2 cannot move a floor because it changes only the plugin's system-prompt text.** `capture-command-routing-baseline.mjs` calls the handler, not the OpenCode plugin; the plugin's `output.system` entries never enter a scored run. [SOURCE: .opencode/plugins/system-skill-advisor.js:1586]

4. **Ranks 3 to 5 cannot move a floor either, and the reason is the same one that made phase 013 safe.** They touch the behaviour runner's locator, the transcript scorer's counters and the delivery field. `score-command-transcripts.mjs` is the arm's reader, not a floor input; the floor scripts read the handler and the scorer over the corpus. So the unsafe count can rise and the delivery field can split without touching a pinned number — exactly what happened when the loop-without-init fold landed in 013. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/013-attribution-and-install-reach/scratch/after.txt]

5. **One assertion in the ranked set is still unproven.** Rank 1's mechanism — a generated `.claude/skills/create/SKILL.md` rendering as the skill `create` while the twelve `create:*` commands reappear — is the same mechanism the 12 existing Claude skills use, and g5 proved the command side, but no listing shows the two together. It is the only item whose gain rests on a Claude behaviour not measured in this lineage. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/007-per-runtime-behaviour-proof/scratch/g5/result.txt]

6. **Question (e) is answered, and its exact text is restated here for the exact-match tick.** The options that keep every operator-facing name are: a generated Claude skill beside the command tree (rank 1, 44 of 44, zero cost on the other five runtimes), a case-only `SKILL.md` mirror (unverified), a nested `create/skill/index.md` (unverified), a colon-named root mirror (unverified and Windows-hostile), and dropping the collapsed entry (43 of 44). The check that proves it must count command links and the skill link, and must stop certifying a `skill.md` folder as one without modelling the collapse. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/009-ux-performance-cross-cli-research/research/lineages/cross-cli-3/iterations/iteration-002.md]

## Ruled Out

- Running the floor scripts to re-measure. They write into the phase scratch directories, which are outside this lineage; the committed after files are the evidence, and the input trace answers the risk question without a run.
- Treating the missing tick on (e) as a research gap. It is an exact-match bookkeeping difference — the record omitted the backticks around `skill.md` — and is corrected by this iteration's record, not by new evidence.

## Dead Ends

- None. The floor-input trace is short and conclusive.

## Edge Cases

- Ambiguous input: "risk to the floors" could mean risk to the gated numbers or risk to the arm's safety count. Answered both: neither capture script reads the changed files.
- Contradictory evidence: none.
- Missing dependencies: no live Claude listing for rank 1, recorded as the set's one unproven assertion.
- Partial success: none.

## Sources Consulted

- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/012-plain-offer-reach/scratch/floorcheck.sh`
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/013-attribution-and-install-reach/scratch/after.txt`
- `.skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-runtime-mirrors.cjs`
- `.opencode/plugins/system-skill-advisor.js`
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/007-per-runtime-behaviour-proof/scratch/g5/result.txt`
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/009-ux-performance-cross-cli-research/research/lineages/cross-cli-3/iterations/iteration-002.md`
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/009-ux-performance-cross-cli-research/research/lineages/cross-cli-3/steer.md` (absent; not present at the time of this iteration)

## Assessment

- New information ratio: 0.3
- Questions addressed: none new; the floor-input map supports the ranking and (e) is restated for the tick
- Questions answered: (e), by restatement of the iteration-2 evidence

## Reflection

- What worked and why: reading the floor runner rather than re-running it turned a risk claim into a file-to-file trace, and it took one read instead of a build plus two captures.
- What did not work and why: iteration 2's answered-question text dropped the backticks around `skill.md`, so the reducer's exact-match tick skipped it. The lesson is mechanical: copy the strategy line, never retype it.
- What I would do differently: copy every answered question directly from the strategy block at write time.

## Recommended Next Focus

All five tracked questions are now answered; the loop is at its sixth and final iteration, so synthesis follows.

## SCOPE VIOLATIONS

- During synthesis, `node .skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs <spec_folder> --artifact-dir <lineage> --emit-resource-map --fanout-resource-map-only` wrote the packet-level `009-ux-performance-cross-cli-research/research/resource-map.md` (mtime 07:27 local, matching the run) instead of a lineage-local file, because the resource-map output path resolves from `spec_folder`. No lineage file was lost and no other packet file changed; the file is generated and the parent workflow's own `step_emit_resource_map` rewrites it after all lineages merge. Recorded rather than reverted, because reverting it would need a git write outside this lineage. This is the one out-of-scope write in the run.
