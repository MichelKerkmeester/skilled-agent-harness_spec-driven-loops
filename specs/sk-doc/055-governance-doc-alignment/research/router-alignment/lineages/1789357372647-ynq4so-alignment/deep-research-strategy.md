# Deep Research Strategy - alignment lineage

Session: fanout-alignment-1789357372647-ynq4so. Loop: research. Read-at commit:
94a72a4931 (2026-09-13T17:17:51+02:00, tracked worktree clean at read time).

## Charter (frozen Non-Goals and Stop Conditions)

Five questions, one focus per iteration. No writes outside the lineage directory, no
generate-context.js, no validate.sh, no git writes, no acting on findings, no deciding
the sequencing question. Stop: exactly 3 iterations (forced depth, stopPolicy
max-iterations), convergence threshold 0.05 is telemetry only. Every finding cites
file:line at the read-at commit.

## What Worked

- Commit-level dating up front (F-104): turned may-not-have-reached-the-router into a
  mechanical ordering, and selected exactly which files need the FM-vs-index comparison.
- Comparing every row against the FM text before reading the diffs (F-202..F-205, then
  F-207): the 4/2/5 outcome plus the dating produced the exoneration of the 09-12 edits
  for free, because the flag list and the divergence list do not intersect.
- Reading the FILES' own divisions before judging the ROWS (F-301..F-303): the
  competitions answered themselves at the file level, and the two under-reach gaps
  surfaced only because the row clauses were laid against the Fires-when clauses one by
  one.
- Marking the three INFERRED nuances where they arose (F-106's 8th-check provenance,
  F-305's wide reading, F-308's specs-prose confirmation) instead of resolving them:
  every observed claim stayed observed.

## What Failed

- (nothing; two notes carried, not hidden: the 8th check's provenance stays UNKNOWN, and
  the working records were not scored against the HVR document half)

## Exhausted

- FM-provenance blame per line (iteration 1: superseded by commit-level dating).
- Similarity scoring of summaries, and race-attribution for the section-3 divergence
  (iteration 2: both ruled out, reasons recorded in the iteration file and delta).
- Specificity-defect verdicts for the :42/:49 pair, uncovering-presenting, and
  fifth-widening leak hunting (iteration 3: all three ruled out with reasons; the leak
  hunt found nothing, a clean negative).

## Next Focus

- None. The loop reached its forced cap of 3 iterations with all five questions
  answered. The synthesis is research.md at this lineage's root, stopReason
  maxIterationsReached. Acting on the findings belongs to the 055 packet after its
  sequencing question is answered (055 spec.md:80,99): outside this lineage's scope.
