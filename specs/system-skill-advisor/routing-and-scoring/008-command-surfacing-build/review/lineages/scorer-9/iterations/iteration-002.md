# Review Iteration 002 - security

## Dispatcher

- Lineage: `scorer-9` (pass nine, area `scorer`), detached fan-out lineage.
- Review target: `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build` (spec-folder).
- Scope: the three `scorer` files named in `review-scope-9.txt`.
- Review focus addressed: this iteration kept the brief's holdout rule (no prompt corpus opened, no `git diff` over a holdout path, no session text printed, `hook-flags.env` untouched) and treated the transcript text as untrusted input at the trust boundary, which is the security reading of the same three behaviors the operator focus names.

## Files Reviewed

- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs:613` - `MODE_SUFFIX` applied to command text.
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs:1363` - `SELF_AUTO` applied to spoken command text.
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs:1519` - `guardedWriteCounts` path handling.
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs:512` - `COMMAND_LINE`, the other unbounded-text matcher.
- `.skilled/skills/system-skill-advisor/runtime/tests/command-transcript-score.vitest.ts:1491` - the new arena block as the guard's only regression net.
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/README.md:135` - the documented `unsafe` contract.

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **The suffix patterns run in quadratic time on an unbounded command token** -- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs:613` (and `:1363`) -- both patterns are `(?:...)+$`/lookahead chains with no length bound, and `commandParts` applies `MODE_SUFFIX` at every start position of the whole string. A near-miss tail makes the engine try every start offset against a chain that fails only at the end, so cost grows with the square of the token length. The token comes from transcript text the scorer does not bound: `COMMAND_LINE` (:512) captures an unbounded `[A-Za-z0-9][\w.:-]*`, and `spokenCommands` (:1369) takes a skill event's `command` whole. `commandParts` is called several times per command (`namesCommand`, `commandTallyKey`, `confirmStem`, `documentTails`), so the cost multiplies per scored row.
   Finding class: `security` (algorithmic complexity on untrusted input).
   Scope proof: timing probes on the exported `startState` at `05f776202e0`, command `speckit:complete` + `:auto` repeated N times + `:draft`: N=2500 9.4 ms, N=5000 30.5 ms, N=10000 122.8 ms, N=20000 438.8 ms - a clean 4x per doubling.
   Affected surface hints: `--summary`/`--runtime` scoring of stored transcripts, any rescore of a set holding a long command line.
   Case: a stored assistant line `COMMAND: /speckit:complete:auto:auto...:draft -> started` with 100k `:auto` repeats (about 500 KB) spends roughly 12 s in one `MODE_SUFFIX` call and several times that per row, so a single hostile or runaway transcript can stall a whole rescore.

## Traceability Checks

- `spec_code`: not run this iteration (traceability pass next).
- `checklist_evidence`: not run this iteration.
- NFR-S01/S02 (spec §L2): no prompt text read or printed, and `.skilled/hooks/hook-flags.env` was never read or created - held.

## Integration Evidence

- The reader boundary is `normalize()` (:375): model text becomes a `text` event, tool args become `read`/`write`/`shell`/`skill` events, and the scorer only reads those fields. Nothing in the reviewed change widens what the transcript can reach.
- `guardedWriteCounts` (:1519) is text-only and never resolves a path on disk, so a symlinked scratch folder cannot flip the verdict; the runner's own restore list is the authority for what changed.

## Edge Cases

- A non-string write path (object with a throwing `toString`) is counted as unsafe without calling it (`:1520` returns before any coercion) - probed, safe.
- A NUL-bearing path such as `/tmp/a\0b` stays inside the scratch prefix and scores safe - probed; the string is never handed to a filesystem call, so the NUL cannot truncate a real path.
- A 400 KB write path costs about 20 ms in `posix.normalize` and stays linear - probed.
- A command line with a bad tail after 20k `:with-research` repeats costs about 88 ms; the same quadratic shape as the finding above, recorded there rather than twice.

## Confirmed-Clean Surfaces

- Path-traversal shapes stay on the cautious side: `../escape.md`, `sub/note.md`, `/Users/dev/x`, `~/x` and `/private/var/folders/.../../../../../Users/dev/x` all count for a guarded row, and the `/private` alias of a temp path compares equal to its plain spelling (probed).
- The `COMMAND:` reader still refuses a fenced block, a blockquote and a placeholder-shaped token, so a transcript cannot inject a report from quoted text (:504-519, read).
- No new capability: the change adds no file read, no network access and no environment read.

## Ruled Out

- A symlink escape from a scratch folder: the guard never asks the filesystem, and the runner's own restore list is the residual authority. Known limit, not a finding.
- NUL truncation as a scratch-prefix bypass: the string is not used as a path, so there is nothing to truncate.
- ReDoS in `COMMAND_LINE`/`FENCE_LINE`: both are single-line anchored patterns with no nested quantifier over the same span; the measured cost is linear in line length.
- Reading a secret through the new suffix vocabulary: the patterns only classify text and print no match, so no transcript content reaches output.

## Next Focus

- Dimension: traceability
- Focus: `spec_code` against phase `038-alignment-p1-remediation` REQ-002/REQ-003 and `checklist_evidence` against its acceptance criteria.
- Reason: security covered; traceability is the next risk-ordered dimension and the run needs both core protocols recorded before a clean stop.
- Rotation status: D1 and D2 complete, D3 next, D4 remaining.
- Required evidence: a file:line citation for each core protocol result.
- Blocked/productive carry-forward: both active P2s are carried to synthesis; do not re-report them.

Review verdict: PASS
