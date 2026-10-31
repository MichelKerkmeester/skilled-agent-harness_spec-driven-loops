# Evidence for an independent read

## Setup
- Task every run got: a frozen Level 3 brief, "add a --quiet flag to recommend-level.sh" (brief text: `results/<run>/<variant>/r1/author.brief`). Model: DeepSeek V4.1 Flash max via cli-devin. Steps: author (write the packet), upkeep (add one requirement later).
- Variants: `pre054` (before packet 054), `main-no054` (today's main without 054, a control for main drift), `now054` (original 054), `refined` (run 1: 054 + phase 012 only; run 2: today's tree, 054 + phases 012 and 013).
- Results root: `specs/system-speckit/054-weak-model-spec-authoring/011-authoring-speed-research/scratch/speed-loop/results/`
  - Run 1: `20261026T050500Z-67716/summary.md` (refined = phase 012 snapshot)
  - Run 2: `20261026T140632Z-79914/summary.md` (refined = today's tree, phase 013 included)
  - Each run keeps every authored packet at `<variant>/r<n>/author-packet/001-recommend-level-quiet-flag/`.
- Speed-loop method: `011-authoring-speed-research/scratch/speed-loop/README.md`.

## Blind quality grades (Opus medium, 1-5 per dimension, total /30, graded against the real script)

Run 1 (grader 1): pre054 17.7, main-no054 20.7, now054 25.0, refined(012 only) 20.7.
Run 2 (grader 2): pre054 17.3, main-no054 20.0, now054 22.7, refined(today) 23.3.

Per-dimension means, run 2:
| | pre054 | main-no054 | now054 | today |
|---|---|---|---|---|
| Correct | 4.0 | 2.7 | 3.7 | 3.3 |
| Testable | 2.7 | 2.7 | 5.0 | 5.0 |
| Consistent | 2.7 | 3.7 | 3.7 | 4.0 |
| Filler | 2.3 | 3.0 | 3.3 | 3.0 |
| Proportion | 2.0 | 3.7 | 3.0 | 3.7 |
| Clarity | 3.7 | 4.3 | 4.0 | 4.3 |

Grader 2's list of sections that most often held generic or wrong content (of 12 packets):
Sign-off role table 9; enhanced-rollback pre-deployment rows 8; CHK-FIX-001 copied verbatim 7; edge-case "External service failure / Network timeout" N/A rows 6; phase-dependency "Phase 1.5 (Config)" diagram 6; wrong report shape in the problem statement 5; "Tests passing (if applicable)" 4; template code-quality/security rows 3; "See decision-record.md" for a file that does not exist 3; invented complexity scores 1.
Recurring factual errors across graders: "five-row" / "nine-line" / "eight-line" report shapes, "Level 3" for a Level 2 input, `head -1` assumed to return the level line (it returns a blank line), plans that contradict their own requirement.

## Timing, run 2 (seconds, mean of valid runs)
author: pre054 351 (2 valid), main-no054 244, now054 265, today 322. upkeep: 78, 114, 76, 106.
Validator runs per author step: 2.5, 2, 4.3, 4. Output tokens per author: 44.8k, 38.9k, 40.9k, 51.8k.
All paired verdicts INCONCLUSIVE except where noted in summary.md; single-run spread is up to ~200 s.

## Structural facts found by the conductor
- No plan written on today's tree has numbered `### Step N` blocks with Acceptance/Verify lines; 2 of 3 original-054 plans did. The authoring card section 6 asks for 3 or 4 such steps, but the plan template's phases FILL note says "Point to `tasks.md` and name the three phases in one line" (`templates/core/plan.md.tmpl:124`).
- Template sources: sign-off `tasks.md.tmpl:290`, enhanced rollback `plan.md.tmpl:219`, phase diagram `plan.md.tmpl:192`, DoD line `plan.md.tmpl:76`, edge cases `spec.md.tmpl:261`, decision-record pointers `spec.md.tmpl:450` and `tasks.md.tmpl:232` (decision-record.md is created only on request since phase 013).
- Phase 013 dropped the before-after, roadmap and resource-map add-ons. The operator wants those to stay dropped.
