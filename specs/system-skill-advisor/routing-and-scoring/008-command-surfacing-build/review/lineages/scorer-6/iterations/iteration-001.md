# Review Iteration 001

## Dispatcher

- Lineage: `scorer-6`, area `scorer`, artifact dir `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/review/lineages/scorer-6`.
- Review focus (pass six): scorer area of `review-scope-6.txt` — the heredoc redirect fix, the start shape split, and the rule that a document read with no checkout write is a lookup, not a start.
- Diff reviewed: `git -c core.fsmonitor=false diff ddb12a6852c 85550ee946e -- <scorer files>`.
- Sources read: `review/review-brief-6.txt`, `review/review-scope-6.txt`, the three scoped files, the packet's phase 034, 035 and 036 specs, and the packet findings registry for deduplication. `steer.md` does not exist in this lineage directory.
- Dimension: correctness.

## Files Reviewed

- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs:255-300` (redirect scan), `:315-328` (write target selection), `:711-760` (checkout boundary and the heredoc pattern), `:1370-1520` (`readDocument`, `startState`, `startShape`), `:2140-2260` (tally), `:2380-2420` (`addScored`), `:2550-2605` (text summary).
- `.skilled/skills/system-skill-advisor/runtime/tests/command-transcript-score.vitest.ts:250-300` (new heredoc cases), `:1469-1530` (new start shape cases), `:2165-2195` (new summary cases).
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/README.md:112-135` (scorer row and start-rule paragraph).

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **A second heredoc on one opening line is not stripped, so its body's `>` comparison becomes a write** -- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs:752` -- `HEREDOC_BODY` keeps `[^\n]*` after the first delimiter, so an opening line that lists two heredocs has its second delimiter folded into group 1 and only the first body is consumed; the second body stays in the scanned text and a comparison in it reads as a redirect.
   Finding class: correctness.
   Scope proof: the pattern and its only redirect consumer (`redirectTargets`, line 269) are inside the pass-six scoped scorer file.
   Affected surface hints: `HEREDOC_BODY`, `redirectTargets`, `shellWriteTargets`, `firstWritePosition`, `workflowPath`, `startShape`.
   Case: a Bash tool call whose command is `cat <<A <<B` with both bodies on later lines — `normalize` emits a write event to `0` from `echo x>0` inside B's body, so the run is credited with a checkout write it never made.
   Fix completeness: extend the opening-line match to consume every delimiter on the line, or strip each heredoc pair in document order.

2. **A write whose target the transcript never names counts as inside the checkout, so a lookup plus an unnamed write scores as a `readWrite` start** -- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs:327` -- `writePaths` keeps a write with no target as `[null]`, and `firstWritePosition` (line 729) skips a write only when its `path` is a string outside the checkout, so an unnamed write passes the boundary that `startShape` (line 1513) reads as "wrote inside the checkout".
   Finding class: correctness.
   Scope proof: `writePaths`, `firstWritePosition` and `startShape` are the scoped scorer's own write-boundary path, and phase 036's edge-case row promises that a run which wrote only outside the checkout is a lookup.
   Affected surface hints: `writePaths`, `firstWritePosition`, `insideCheckout`, `startShape`, `startRate`, `startShapes.readWrite`.
   Case: a transcript with one `Read` of `.claude/commands/create/readme.md` and one `Write` tool call that carries only `content` (no path key), or a Bash `apply_patch` whose body uses `---`/`+++` headers instead of `*** Update File:`. `startState` returns `{started: true, shape: 'readWrite'}` where the rule requires `readOnly`.
   Fix completeness: treat a write with no named target as neither an inside nor an outside write — count it for `unsafe`, as today, but not for the checkout boundary.

## Traceability Checks

- `spec_code`: pass. Phase 036 REQ-004 maps to `startState`'s read-alone return and to the cases at `command-transcript-score.vitest.ts:1504` and `:2182`; REQ-001's arithmetic follows by construction, because `startShape` returns a non-`readOnly` shape exactly when the old rule counted a start minus the lookups (`.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs:1494-1518`). The numeric restatement itself is not re-run here: the brief forbids `--summary`, so the claim is verified as code, not as a fresh score.
- `checklist_evidence`: not run this iteration; deferred to iteration 2.

## Integration Evidence

- `redirectTargets` and `shellWriteTargets` share `HEREDOC_BODY`; the net diff's `startState` signature is consumed only by `scoreRun` (`.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs:2083`) and by the scoped vitest file, so no runtime mirror carries a stale call shape.

## Edge Cases

- A run whose locator line holds no `projectDir` falls back to `insideCheckout`'s scratch-folder rule, which phase 036 records as intended. Verified by reading `insideCheckout` at line 711.
- The probe of the new heredoc cases is a direct module import, not `--summary`, so no prompt file was opened and no holdout text was read.

## Confirmed-Clean Surfaces

- The empty-body fix does what its comment claims: `cat <<EOF > a.txt`, `EOF`, then `echo hi > b.txt` yields exactly `a.txt` and `b.txt` (probe output).
- A backslash-quoted end word (`python3 - <<\PY`) and a body comparison (`if len(sys.argv)>0:`) each leave one `shell` event and no write.
- `startShapes` sums to `started`: `scoreRun` sets `startShape` for every touched row, `started` is `touched && shape !== 'readOnly'`, and `addScored` counts both over the same uncapped start-row set (lines 2407-2414).
- `startRate`, `startedOfOffered` and `byPolicy.started` all read the same `result.started` fact, as the README's new paragraph states.

## Ruled Out

- A `$'EOF'` ANSI-C-quoted delimiter leaving its body in the scan: already recorded as an open P2 in the packet registry ("A heredoc whose delimiter is not a bare identifier is read as commands"), so not re-reported; pass six fixed only the backslash form.
- `startShape`'s skill/reported/expanded precedence changing a count: all four starting shapes add to `started`, so the order changes only which label a start carries.
- A write outside the checkout defeating the read-alone rule when `projectDir` is present: the vitest case at `command-transcript-score.vitest.ts:1520` pins it and the probe agrees.
- `readDocument` counting a `cat` of the document with a redirect as a shell read: normalize emits a write event instead of a shell event for a redirecting command, which the registry already records as "A shell read counts as a workflow load but not as a start or a loop".

## Next Focus

- Dimension: security and traceability (one cross-reference pass).
- Focus area: holdout handling in `loadRowLabels`/`scoreRun`, and the README's start-rule sentences against the new code.
- Reason: the correct path is read; the remaining risk is a doc that still states the old rule and any prompt leak in the label reader.
- Rotation status: open.
- Required evidence: a read of the label path and of every README sentence that names a start.

Review verdict: PASS
