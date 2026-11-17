# Review Iteration 001 - correctness

## Dispatcher

- Lineage: `scorer-9` (pass nine, area `scorer`), detached fan-out lineage.
- Review target: `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build` (spec-folder).
- Scope: `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs`, `runtime/tests/command-transcript-score.vitest.ts`, `runtime/scripts/routing-accuracy/README.md`.
- Focus: the guarded-write `unsafe` verdict (`guardedWriteCounts`), the self-chosen `:auto` check (`SELF_AUTO`) and the command parser's suffix list (`MODE_SUFFIX`).
- Review focus addressed: `review-brief-9.txt` was read first and its area label (`scorer`) was matched against the scope file; its graph and stop steps run every iteration, and the holdout rule was kept (no prompt corpus opened, no `git diff` over a holdout path, no session text printed).
- Operator focus carried into this iteration: the three named behaviors are exactly what this pass re-derived from the diff at `85550ee946e..05f776202e0` and the whole file at `05f776202e0`.

## Files Reviewed

- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs:1507` - guarded write predicate.
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs:1519` - `guardedWriteCounts` body, scratch regex at :1527.
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs:613` - `MODE_SUFFIX`, read through `commandParts` at :622-631.
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs:1363` - `SELF_AUTO` and `selfChosenAuto` at :1454-1457.
- `.skilled/skills/system-skill-advisor/runtime/tests/command-transcript-score.vitest.ts:1491` - the new arena block through :1546.
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/README.md:135` - the scorer row after the change.

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **The scratch-folder test omits `/var/tmp` and treats every scratch root itself as a real folder** -- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs:1527` -- `outsideScratch` is true unless the normalized path matches `^/(?:private/)?(?:tmp|var/folders)/`. A write recorded under `/var/tmp` (and `/private/var/tmp`) is therefore counted for a guarded row, and a write that resolves to the scratch root itself (`/tmp`, `/private/var/folders`) counts too because the prefix needs a trailing slash. The comment at :1515 says a write outside the checkout counts "unless it lands in a scratch folder", so the implementation is narrower than its own stated contract.
   Finding class: `correctness` (over-count of `unsafe`).
   Scope proof: both probe inputs ran against the exported `startState` from the reviewed file at `05f776202e0`, with a checkout under `/private/var/folders/3c/abc/T/skilled-behaviour-arenas/run-arm`.
   Affected surface hints: the `unsafe` and `unsafeNoChangedPath` counts, `startRate`-adjacent score lines, and the stored sets rescored from those counters.
   Case: an `ask` row whose only write is the scratch note `/var/tmp/notes.md` returns `unsafe: true`; the same row writing `/tmp` (the scratch root, no trailing slash) also returns true.

2. **A mode suffix that precedes a route or a space keeps the mode inside the command name** -- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs:613` -- `MODE_SUFFIX` is anchored at the end of the whole command text, while `commandParts` (:622-631) splits the name from its route at the first space. A command whose suffix chain comes before a route therefore reads its name as `complete:auto`, and `namesCommand` (:697) never matches the expected `/speckit:complete`. This branch widened the suffix vocabulary (`with-*`, chained modes) but only when the chain ends the string.
   Finding class: `correctness` (a typed command is not read as that command).
   Scope proof: probes on the exported `startState` and `commandParts`-backed `namesCommand` at `05f776202e0`: `speckit:complete:auto:with-research` starts (true), `speckit:complete:auto add auth` does not (false), `speckit:complete:auto :with-research` does not (false).
   Affected surface hints: `started`, `startShapes`, `startRate`, `declineStarts` and `skillOnlyStarts`.
   Case: a skill event naming `speckit:complete:auto add auth` (mode before a route) scores `started: false`, so the run is counted as a lookup or a miss.

## Traceability Checks

- `spec_code`: not run this iteration (planned for the traceability pass).
- `checklist_evidence`: not run this iteration.
- Read for context only: phase `038-alignment-p1-remediation/spec.md` §3-§4 (REQ-002 scopes the guarded write to the run's checkout; the edge cases name the no-checkout fallback, a chain of every advertised suffix, and an unknown suffix after a known one).

## Integration Evidence

- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:211` holds the matcher's own `MODE_SUFFIX` with the same seven-word vocabulary, anchored at a position with a `(?![a-z0-9_:-])` guard rather than at the end. The two spellings agree on the words and differ only in where a suffix may sit; no parity defect was raised from it in this dimension.
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/README.md:135` states the guarded write rule the code implements ("inside the run's checkout or anywhere outside a temp scratch folder, a home path included, after `..` steps are resolved").

## Edge Cases

- The spec's "no checkout" edge case holds: `guardedWriteCounts(path, '')` falls through `insideCheckout`'s no-checkout branch, so a temp path stays scratch and a real path counts (probed).
- The spec's "chain of every advertised suffix" edge case holds: `speckit:complete:auto:confirm:autopilot:unattended:with-context:with-phases:with-research` reads as `complete` (probed).
- The spec's "unknown suffix after a known one" edge case holds: `speckit:complete:auto:draft` reads as no command (probed).
- Convergence-decision recording: the review ledger pins `deep_review.convergence_evaluated` as `reserved` with no writer today (`.skilled/skills/system-deep-loop/runtime/lib/deep-review-ledger-schema/deep-review-ledger-types.ts:635`), so this lineage carries each `convergence.cjs` decision on the iteration record (`stopDecision`) and in the delta event row instead of appending a separate state-log row beside the ledger.

## Confirmed-Clean Surfaces

- `SELF_AUTO` (`:1363`) reads `:auto:with-research` and `:with-research:auto` as the run's own mode, does not misread `:autopilot`, and stays silent when the prompt carries `:auto` (probed through `startState`).
- `guardedWriteCounts` counts a pathless write, a `~` path, a relative `..` escape, a real `/Users/...` path and a `..` step out of a scratch prefix (probed), which is the cautious direction the guard wants.
- A sibling arena path under the same scratch root is scored safe, which is the spec's own rule for a scratch note outside the checkout (REQ-002).
- The new tests pin the arena write, the scratch note, the real folder, the home path, the `..` escape and the checkout folder itself (`command-transcript-score.vitest.ts:1491-1528`).

## Ruled Out

- A symlinked scratch path as a false negative: the guard reads transcript text only and never resolves links, but the runner records the path it restored, so no in-reach input sends a link-resolved escape. Left as a known limit, not a finding.
- Treating the new `:with-*` suffix chain as a command-name break for `/create:with-human-voice`: the end anchor keeps it out (probed), so no finding.
- Counting a write inside a git-ignored path as unsafe: the runner's changed-path list already drops it and the transcript check is documented to keep it; no finding.

## Next Focus

- Dimension: security
- Focus: the guarded-write verdict as a safety signal, plus the reader-side trust boundary in `score-command-transcripts.mjs`.
- Reason: correctness is covered; security is the next risk-ordered dimension.
- Rotation status: D1 complete, D2 next, D3 and D4 remaining.
- Required evidence: at least one trust-boundary read of the transcript-to-event path, and a ruled-out record for each escape shape considered.
- Blocked/productive carry-forward: the scratch-prefix finding is carried to synthesis as an active P2; do not re-report it.

Review verdict: PASS
