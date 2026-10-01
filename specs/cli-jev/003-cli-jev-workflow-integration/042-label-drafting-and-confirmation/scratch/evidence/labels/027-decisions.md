# 027 label decisions

| Row | Lineage | Code (derived g) | Luna | SWE | Opus arbiter (medium) | Written |
|---|---|---|---|---|---|---|
| 1 | 004-system-code-graph-routing-research | 4 | 8 | 8 | 8 | 8 |
| 2 | 021-skill-metadata-json-unification sol-high-fast | 2 | 5 | 5 | 5 | 5 |
| 3 | 006-sk-prompt-routing-research | 5 | 5 | 5 | 5 | 5 |
| 4 | 005-system-deep-loop-routing-research | 7 | 8 | 7 | 9 | 9 |
| 5 | 032 relocation sol | 5 | 5 | 5 | 5 | 5 |

## How the values were decided

- Luna 6 max and SWE 2 max drafted each row blind to the code's value and to each other.
- The operator saw the per-row context in chat on 2026-10-01 and delegated the decision on all five rows to a fresh Opus arbiter: "Let fresh opus 5.5 xhigh decide".
- The operator then withdrew Opus xhigh ("dont use opus xhigh", "Instead use Opus medium") and asked for the five rows to be redone. A fresh Opus 5.5 medium arbiter, run alone, returned the same five values (8, 5, 5, 9, 5) with the same four rulings. The written file carries the medium run.
- This departs from parent D5 (no Claude leaves) and from D4 and the 027 rule that only operator-confirmed values enter the label file. The operator directed it by name, so the `labeler` field reads `operator-delegated:opus-5.5-medium`.

## Arbiter rulings

- `sources` and `evidence` arrays count as citations, the same as a singular `source`.
- A `[SOURCE: ...]` tag in an iteration's write-up counts as a citation. A file only named in passing does not.
- The run's own notes, deltas and state add no outside evidence. The packet `spec.md` does.
- A source is a file. A new line range of an already cited file is not new.

## Session checks of the arbiter's claims

- Row 2: `validate_skill_package.py` appears first in iteration 5 (checked by grep over iterations and deltas).
- Row 1: `spec.md:NN` is cited only in `iterations/iteration-008.md` (3 times), in no earlier iteration.
- Row 4: `validate-playbook-topology.cjs` is named once in passing in `iteration-003.md:23` and cited with lines in `iteration-009.md:72`. Row 4 is the arbiter's one medium-confidence call: if the passing mention counts, the value is 8.
- The arbiter's note said the written values disagree with the code on 2 of 5 rows. The count is 3 of 5 (rows 1, 2 and 4).

## Expected gate outcome

The file disagrees with the derived gold on 3 of 5 lineages, so a switched run prints `stop: derived gold disagrees on 3 of 5 lineages` and opens no arm. The gate is checked only with `--jev` or `--deem` (`score-stop-rater.cjs:1753-1758`), so no switched run happened in this phase.

## Follow-ups for 027 (recorded, not fixed here)

- P2: the gold derivation reads only the singular `source` string and matches exact strings, so it misses `sources` and `evidence` arrays and counts a new line range as a new source. That accounts for every disagreement above.
- P2: `isMovable()` (`score-stop-rater.cjs:135`) checks `convergenceMode` at the top level only, while `stopPolicy` also falls back to `antiConvergence`. REQ-002 names the fallback only for `stopPolicy`. Rows 1, 3 and 4 have `antiConvergence.convergenceMode: "off"`. If the rule was meant to read both places, those three lineages leave the sample.
