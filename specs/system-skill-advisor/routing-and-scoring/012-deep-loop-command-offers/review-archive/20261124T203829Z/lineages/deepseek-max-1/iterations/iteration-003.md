# Review Iteration 003 — Traceability (`spec_code`, first sweep)

## Dispatcher

- Lineage `review/lineages/deepseek-max-1`, iteration 3 of 7, session `fanout-deepseek-max-1-1795550334883-gjbarh`
- Dimension: D3 traceability. Operator focus: finish `spec_code` and `checklist_evidence`. This iteration takes the first half of the REQ block, REQ-001 to REQ-022.
- Method: for a REQ whose claim is a served row, read the recorded probe output and the gate code that produces it; for a REQ whose claim is a presence or absence in a document, read the document.

## Files Reviewed

- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/spec.md:220` (REQ-001 to REQ-022)
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/scratch/probes/results-final-958fa81-worktree.json:1` (the 69-row probe record)
- `.skilled/commands/deep/assets/deep-research-presentation.txt:1`, `deep-review-presentation.txt:1` (`### Offer From an Advisor Brief`, step 6, Next Steps rows)
- `.skilled/commands/deep/research.md:86`, `.skilled/commands/deep/review.md:81` (step 0 of MODE ROUTING)
- `.skilled/commands/deep/assets/deep-research.yaml:663`, `deep-review.yaml:1` (`next_steps`, completed-packet message)
- `.skilled/commands/deep/assets/compiled/deep-review.contract.markdown:1`, `deep-research.contract.markdown:1`
- `.skilled/skills/system-deep-loop/hub-router.json:34`, `ROUTER.md:1`, `SKILL.md:20`, `deep-review/SKILL.md:1`, `deep-research/SKILL.md:1`
- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/explicit.ts:1`, `runtime/lib/command-attach.ts:1`, `:330` (`LOOP_WORDING`), `:944` (`isRunRefused`), `:1147` (`namesLoopSubject`), `:1245` (`isLoopQuestion`)
- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts` `RUN_ASK_REFUSAL_LEADS`

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

None.

## Traceability Checks

| Protocol | Level | Status this iteration | Evidence |
| --- | --- | --- | --- |
| `spec_code` | core | partial | REQ-001 to REQ-022 checked. Row claims were read from the recorded probe output: V6, H1a and E3 top `system-deep-loop` with `command=/deep:review, policy=ask` (`.skilled/.../scratch/probes/results-final-958fa81-worktree.json`, ids `V6`, `H1a`, `E3`), R7 and N9 carry no `command` key (ids `R7`, `N9`), and H3b has no top row at all (id `H3b`), which is what REQ-001, REQ-002, REQ-011 and REQ-014 state. The same file reports `status/freshness` `ok/live` on all 69 rows, which is the row shape REQ-006 and AC-010 describe. Presence and absence claims were read from the documents: `### Offer From an Advisor Brief` in both presentations and step 0 in both command docs (REQ-005); `--extend=N` and `doctor:deep-loop --scope=` rows in both YAMLs and both presentations (REQ-009); `communication-handoff.md`, `Autonomous (Recommended)` and `Native (Recommended, default)` in both presentations (REQ-010); no `ASK with SINGLE prompt` in any compiled contract (REQ-007); no `comprehensive research` or `deep investigation` in `deep-research/SKILL.md`, no `audit spec folder`, `pre-release review` or `/deep:review :auto` in `deep-review/SKILL.md`, `doctor:deep-loop` in the hub `SKILL.md`, both research aliases in `hub-router.json` and `ROUTER.md` with no `autonomous research` (REQ-011); no council wording in `explicit.ts` or `command-attach.ts` (REQ-011). REQ-023 to REQ-051 remain, so the protocol stays `partial`. |
| `checklist_evidence` | core | partial | AC-009, AC-014, AC-015, AC-016, AC-018, AC-021 and AC-027 name artifacts this iteration opened: the shared fixture and the two guard suites exist, the four command assets hold the rows their cells cite, and the probe file the cells point at holds the ids they name. No acceptance row was disproved here; the one stale cell remains AC-038 from iteration 1. |

## Integration Evidence

- `.skilled/commands/deep/review.md:81` and `research.md:86` carry the step 0 that points at the presentation contract, and both presentation files carry the section it names, so the command-to-presentation wiring REQ-005 requires is present end to end.
- `.skilled/commands/deep/assets/deep-review.yaml` and `deep-research.yaml` carry the `next_steps` lines and the completed-packet message REQ-009 names (`--extend=N`, `--restart`), and the compiled contracts under `assets/compiled/` no longer hold the retired prompt text, which is the surface REQ-007 names.
- `.skilled/skills/system-deep-loop/hub-router.json` and `ROUTER.md` carry the two research aliases in their keyword lists, which is the surface REQ-011 and AC-043 name.

## Edge Cases

- The row claims in REQ-001 to REQ-004, REQ-008, REQ-014 and REQ-019 are served-head claims. This lineage can read the recorded probe run but cannot re-serve a prompt without writing outside its directory (the advisor CLI starts a daemon that keeps state), so the evidence here is the recorded 69-row live file plus the gate code, not a fresh run. Recorded so synthesis does not read this as a fresh probe: if a later round re-serves, the file to compare against is `scratch/probes/results-final-958fa81-worktree.json`.
- `runtime/dist` in this checkout holds only `dist/hooks` and `dist/runtime`; `dist/` is gitignored (`.gitignore:60`), so its contents are a build artifact and not evidence for or against REQ-006. The evidence used for REQ-006 is the live freshness the probe file records.

## Confirmed-Clean Surfaces

- Every presence claim in REQ-005, REQ-007, REQ-009, REQ-010 and REQ-011 was found exactly where the requirement says, with no near-miss: each grep either matched in both files the requirement names or matched nowhere.
- The council wording REQ-011 removes is absent from both `explicit.ts` and `command-attach.ts`, so the removal was complete rather than one file of two.
- The refusal-lead list (`command-attach.ts`, `RUN_ASK_REFUSAL_LEADS`) holds every lead word the REQ-015 and REQ-023 prompts use (`do not`, `don't`, `never`, `no need to`, `not asking for`, `instead of`, `refuse`, `skip`, `avoid`), which is why both rounds' refusals are withheld by one rule rather than by prompt-specific guards.

## Ruled Out

- Missing offer wiring between the command docs and the presentations (REQ-005): eliminated, step 0 in both docs names the section and both presentations carry it.
- A stale compiled contract (REQ-007): eliminated, no compiled file holds the retired `ASK with SINGLE prompt` text.
- A left-behind council boost on either lane (REQ-011): eliminated in both files.
- Drift between the probe file and the requirements it is cited for (REQ-001, REQ-002, REQ-014): eliminated for the ids checked, the probe rows carry the commands and the absences the requirements state.

## Review Focus

The operator focus asked for the two core protocols to finish. This iteration finished the code side of REQ-001 to REQ-022 and left `spec_code` `partial` only because REQ-023 to REQ-051 are still open. `checklist_evidence` stays `partial` for the same reason on the AC side.

## Next Focus

- Dimension: D3 traceability, `spec_code` second sweep — the sixth fix round, REQ-023 to REQ-034, with ADR-005 and ADR-006
- Focus area: the refusal verbs, the stuck-run withhold, the double-typed command, the deferred mode cue, the stage-one loop rule, the degraded `(ask)` rendering, the typed-on-stuck exception, the long-prompt bound, the vocabulary guard, the refinement rule, the coverage gate and the closure docs
- Reason: this is the block the operator focus names first, and each requirement in it names a code surface and a test that can be read together
- Rotation status: D1, D2 and the first D3 sweep done; D3 continues
- Blocked/productive carry-forward: the recorded-probe limitation carries forward and applies to REQ-034 and REQ-039 as well
- Required evidence: `file:line` per REQ, plus the ADR line where a decision rather than code is the record

Review verdict: PASS
