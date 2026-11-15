# Hop recall, before and after

Same harness, same prompt, same question, Claude Code with Sonnet at medium effort. A run counts when the note was claimed by a different session, the question was asked and the note did not hold the code. `lookup_ran` is the harness field `lookup_attempted`.

| Stage | Counted runs | lookup_ran | Correct answer | Receiver said UNKNOWN |
|---|---|---|---|---|
| Before, lookup arm (offer only after a compaction) | 3 | 0 | 0 | 3 |
| Before, baseline arm (lookup core hidden) | 3 | 0 | 0 | 3 |
| After the claim offer, reader not yet fixed | 3 | 3 | 1 | 2 |
| After the claim offer, reader fixed | 3 | 3 | 3 | 0 |

What the rows show:

- Before the change no receiver attempted a lookup in 6 of 6 counted runs, and none recovered the code.
- With the section printed at the claim, every receiver ran the lookup (`lookup_ran` 3 of 3, then 3 of 3 again).
- Two of the first three were refused with `store_unreadable`. The shared Claude transcript reader rejected a sender message that made two tool calls, because Claude Code writes one transcript line per content block. The reader now joins those lines into one turn.
- After that fix, 3 of 3 receivers answered correctly.

Not counted: `lookup-r1` (before) and `lookup-after-r1` (after). In both the sender copied all 120 codes into the note, so the answer came from the note.

Limits of this measurement: six counted runs per side, one runtime, one model, one kind of detail. The baseline arm was not rerun after the change, because with the lookup core hidden the claim withholds the section and the receiver is in the same position as before.

Evidence: `../../001-hop-recall-baseline/scratch/runs/`.
