# Iteration 4 - traceability (spec_code, part 1)

## Dispatcher

- Lineage: `deepseek-max-1`, generation 10, run `fanout-deepseek-max-1-1795556727682-axtzf8`
- Dimension: traceability
- Review target: `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers`
- Operator focus addressed: this pass starts the `spec_code` map at REQ-001 and carries it through REQ-022, checking each requirement against its implementation, its fixture or its recorded probe result, and reads the continuity records that say where the packet stands.

## Files Reviewed

- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/spec.md:150` (REQ-001 to REQ-022)
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/acceptance-criteria.md:63` (AC-001 to AC-029 rows)
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/scratch/probes/results-after.json` (the five gain rows, R7, N9, D1 and the stage-one rows)
- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:69` (`COMMAND_ROWS`, the tracked table)
- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:1213` (`asksForLoopRun`)
- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/explicit.ts:452` (`passesAsked`)
- `.skilled/commands/deep/assets/deep-review-presentation.txt:13` (the offer section, option A and the flag table)
- `.skilled/commands/deep/assets/deep-research-presentation.txt:13` (the same section for research)
- `.skilled/commands/deep/research.md:86` and `.skilled/commands/deep/review.md:81` (step 0 pointer)
- `.skilled/commands/deep/assets/deep-research.yaml:663` (the completed-packet message)
- `.skilled/commands/deep/assets/deep-research.yaml:2268` and `.skilled/commands/deep/assets/deep-review.yaml:2534` (`next_steps` rows)
- `.skilled/commands/deep/assets/deep-research-presentation.txt:477` and `.skilled/commands/deep/assets/deep-review-presentation.txt:582` (Next Steps rows)
- `.skilled/commands/deep/assets/compiled/deep-research.contract.markdown` and `deep-review.contract.markdown` (no `ASK with SINGLE prompt`)
- `.skilled/skills/system-deep-loop/hub-router.json:34`, `.skilled/skills/system-deep-loop/ROUTER.md:63` (the two research aliases)
- `.skilled/skills/system-deep-loop/deep-research/SKILL.md:34` (its own alias list, left as ADR-007 says)
- `.skilled/skills/system-deep-loop/deep-review/SKILL.md:20` (the doctor sentence and no depth triggers)
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/command-prompts.jsonl` (near-miss and holdout rows)
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/implementation-summary.md:13` (the continuity block)
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/decision-record.md:13` (the continuity block)

## Findings - New

### P0 Findings

None.

### P1 Findings

None new. Carried forward: `L1-P1-001` (a refused run ask after a loop question is read as an ask) is still active.

### P2 Findings

1. **The continuity metadata still names generation 8 as the latest round** -- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/implementation-summary.md:13` -- The `_memory.continuity` block says `recent_action: "Generation 8 recorded: 0 P0, 0 P1, 9 P2"` and `next_safe_action: "Fix the nine generation 8 P2s, then run generation 9"`, while the file's own thirteenth-round paragraph (line 270) and its thirteenth-round verification rows (line 202) record that generation 9 was reviewed and a thirteenth fix round landed. The block's `last_updated_at` is `2026-11-24T21:44:00Z`, the timestamp of the thirteenth-round edit, so the timestamp and the content disagree as well. `acceptance-criteria.md:13` ("Eleventh fix round criteria met; AC-040 open") and `decision-record.md:13` ("Recorded ADR-009 for the eleventh fix round") carry the same lag. A resumed session reads the first block it opens and is sent back to work the packet already finished.
   - Finding class: `docs-drift`
   - Scope proof: `implementation-summary.md`, `acceptance-criteria.md` and `decision-record.md` are all on `review-scope-files.txt`; the three `_memory` blocks and the thirteenth-round rows were read at this revision, and the timestamps were compared with the round each block names.
   - Affected surface hints: `implementation-summary.md` continuity block, `acceptance-criteria.md` continuity block, `decision-record.md` continuity block, `timeline.md` last-updated line, resume and `/speckit:resume`
   - Case: an operator resumes the packet, reads `recent_action` in `implementation-summary.md`, and starts fixing generation 8's nine P2s or reruns generation 9; both already happened, and generation 10 is the run that is open.
   - Fix direction: set each block's `recent_action` to the thirteenth-round result (with the generation 10 rerun named as the open action), and keep `next_safe_action` pointed at AC-040 and the current rerun.
   - Claim adjudication:
     - `type`: `stale_continuity_record`
     - `claim`: three continuity blocks name an older round than the tree's latest round and timestamp, so a resume surfaces a next action the packet has already completed.
     - `evidenceRefs`: `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/implementation-summary.md:13`, `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/implementation-summary.md:202`, `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/implementation-summary.md:270`, `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/acceptance-criteria.md:13`, `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/decision-record.md:13`
     - `counterevidenceSought`: checked whether the block is labelled as history (it is `_memory.continuity`, the resume surface), whether a later line corrects it (the thirteenth-round prose does, but the block is read first), and whether the timestamps were left from an older edit (they are the thirteenth-round timestamp, so the block was touched without being rewritten).
     - `alternativeExplanation`: the block may be regenerated by `generate-context.js` and the latest generation's save may not have run after the thirteenth round; that makes it a tooling outcome rather than an authored claim, but the packet still presents it as the current state.
     - `finalSeverity`: P2
     - `confidence`: 0.95
     - `downgradeTrigger`: if the packet marks the block as generated-at-save state that a resume must not treat as current, the finding drops to a note on the continuity writer.

## Traceability Checks

- `spec_code` — partial (REQ-001 to REQ-022 mapped; REQ-023 to REQ-059 remain for the next two passes). The map:
  - REQ-001 and REQ-002: `results-after.json` holds V6, H1a, H1b, E1 and E3 with `/deep:review` or `/deep:research`, and R7 with no command; the gate is `asksForLoopRun` at `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:1213` and the scorer lane at `.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/explicit.ts:452`.
  - REQ-003 and REQ-004: the keep and negative groups are recorded in the same 69-row file; no negative gained a command in the after file.
  - REQ-005: both presentation files carry `### Offer From an Advisor Brief` at line 13, option A at line 37, the flag table below it, and the `--spec-folder=<the Gate 3 answer>` line at 58/59; both command documents carry the step 0 pointer at `research.md:86` and `review.md:81`.
  - REQ-006: the shared fixture is `tests/fixtures/deep-loop-offer-cases.json` (368 rows) and the guards file is `tests/command-attach-guards.vitest.ts`; the fixture is read by both suites.
  - REQ-007: `rg -c 'ASK with SINGLE prompt' .skilled/commands/deep/assets/compiled/` prints nothing (exit 1), and the compiled contracts are present at `.skilled/commands/deep/assets/compiled/deep-research.contract.markdown` and `deep-review.contract.markdown`; the mirror and reference scripts are recorded by AC-011.
  - REQ-008: `passesAsked` in `explicit.ts` reads `MULTI_PASS`, `LOOP_COUNT` and `ITERATIVE_ASK` through `asksForLoopRun`, and the stage-one probe rows (R2, V2, V4, H7, H10) read as AC-013 states.
  - REQ-009: `deep-research.yaml:663` names `--extend=N` and `--restart`; both `next_steps` lists carry `--extend=N` at `deep-research.yaml:2268` and `deep-review.yaml:2534`, and both Next Steps tables carry the `--extend=N` and `/doctor:deep-loop --scope=` rows at `deep-research-presentation.txt:477` and `deep-review-presentation.txt:582`.
  - REQ-010: both presentation files name the question tool at line 30, Q2 marks `Autonomous (Recommended)` and Q-Exec marks `Native (Recommended, default)`.
  - REQ-011: the council words are absent from `command-attach.ts` and `explicit.ts`; the two research aliases are in `hub-router.json:34` and `ROUTER.md:63`; `comprehensive research` and `deep investigation` are absent from `deep-research/SKILL.md`; `audit spec folder` and `pre-release review` are absent from `deep-review/SKILL.md`; the hub `SKILL.md:20` names `/doctor:deep-loop`.
  - REQ-012: the near-miss rows are in `command-prompts.jsonl` (`nm-system-deep-loop-03` for N9 and the other probes), and the D1 positive row is `cmd-doctor-deep-loop-plain-tune-01`.
  - REQ-013: the three deep-family holdout rows end `-holdout-04` (`cmd-deep-research-plain-holdout-04`, `cmd-deep-review-plain-holdout-04`, `cmd-doctor-deep-loop-plain-holdout-04`).
  - REQ-014: `results-after.json` N9 tops `system-deep-loop` with no `command` field.
  - REQ-015 to REQ-022: the prompts are shared fixture rows read by both suites; the refusal, question, spelling, denied-symptom, subject and typed-command grammar are in `command-attach.ts` (`RUN_ASK_REFUSED_AFTER`, `LOOP_QUESTION`, `NAMED_LOOP_MODE`, `COUNT_AS_SUBJECT`, `COMMAND_*`) and the Python mirror.
  - The one active violation of this slice is `L1-P1-001`: a refusal in a question's later clause is read as an ask, so REQ-015's general rule is not complete. That is why the protocol is `partial`, not `pass`.
- `checklist_evidence` — partial. AC-001 to AC-029 and AC-037 to AC-042 were read row by row; each cites a file that exists, and the evidence-tail checker reports `problems=0`. AC-040 is `Unmet` by design. The task checklist is not yet read end to end, so the protocol stays `partial`.

## Integration Evidence

- Command surface: `/deep:review` (`.skilled/commands/deep/review.md:81`) and `/deep:research` (`.skilled/commands/deep/research.md:86`) carry the step 0 pointer that makes the offer section reachable.
- Presentation surface: `.skilled/commands/deep/assets/deep-review-presentation.txt:13` and `deep-research-presentation.txt:13` are the two files REQ-005 names, and both ask the offer in the same call as the Gate 3 question.
- Probe surface: `scratch/probes/results-after.json` is the 69-row record AC-001, AC-002, AC-003 and AC-013 cite; the rows were read directly rather than assumed.
- Resume surface: the `_memory.continuity` blocks in `implementation-summary.md`, `acceptance-criteria.md` and `decision-record.md` are what `/speckit:resume` reads first; the finding is on that path.

## Edge Cases

- The probe rows are a recorded snapshot, not a live rerun; this iteration reads the snapshot and does not re-execute the advisor (the dispatch forbids running the repo's build/test tooling). The snapshot's `freshness` field is `live` on every row read.
- `results-after.json` N9 has no `command` key at all rather than an explicit `cmd=-`; AC-021 treats the absence as the no-command outcome, and the probe schema records a missing command the same way for R7.
- The `_memory` block in `implementation-summary.md` may be generated by `generate-context.js`; the finding is recorded against the file as it stands, with the tooling cause named as an alternative explanation.
- A requirement that names no code (REQ-013's blind-writer clause) is checked against the decision record and AC-020's waiver, not against code; that is the decision-backed form the focus allows.

## Confirmed-Clean Surfaces

- `results-after.json` -- V6, H1a, H1b, E1 and E3 each carry their command, R7 carries none, and N9 carries none; the five gain rows and the one lose row match REQ-001, REQ-002 and REQ-014.
- `.skilled/commands/deep/assets/deep-review-presentation.txt:58` and `deep-research-presentation.txt:58` -- option A names the `:auto` suffix and `--spec-folder=<the Gate 3 answer>`, and option C is the no-loop path.
- `.skilled/commands/deep/assets/compiled/` -- no compiled contract holds `ASK with SINGLE prompt` (rg exit 1), matching AC-011.
- `.skilled/skills/system-deep-loop/hub-router.json:34` and `ROUTER.md:63` -- both carry `iterative research` and `multi-round research`, and neither carries `autonomous research` (the mode packet's own list does, as ADR-007 says).
- `routing-accuracy/command-prompts.jsonl` -- the near-miss rows named by REQ-012 and the three `-holdout-04` rows named by REQ-013 are present and carry their expected values.

## Ruled Out

- "R7 regained a command": ruled out. The after snapshot's R7 top row has no `command` key and the route is research with policy absent.
- "N9 still carries a command": ruled out. Its after row has no `command` key.
- "The presentation files lost the `--spec-folder` clause": ruled out. Both carry it at line 58/59.
- "The two research aliases were dropped from the hub": ruled out. Both hub files carry them, and the mode packet's own list is the one ADR-007 leaves alone.
- "AC-014's verification command is broken by the table escaping": ruled out. The `\|` in the raw cell is Markdown table escaping; the rendered command uses plain alternation, and the cited line `deep-research.yaml:663` holds the named message.

## Next Focus

- Dimension: traceability
- Focus area: `spec_code`, part 2: REQ-023 to REQ-052, especially the word-rule requirements whose cases live only in the shared fixture, plus the overlay protocols (`skill_agent`, `agent_cross_runtime`, `feature_catalog_code`, `playbook_capability`).
- Reason: the first half of the requirement map holds apart from the active P1; the denser half (refusal verbs, typed commands, mode cues, long prompts) and the overlays remain.
- Rotation status: three dimensions done; traceability pass 1 of 4 complete.
- Blocked/productive carry-forward: productive -- the probe snapshot and the fixture make the requirements checkable without a build.
- Required evidence: one file:line per requirement and one exact overlay surface per protocol.
- Recovery note: none.

Review verdict: CONDITIONAL
