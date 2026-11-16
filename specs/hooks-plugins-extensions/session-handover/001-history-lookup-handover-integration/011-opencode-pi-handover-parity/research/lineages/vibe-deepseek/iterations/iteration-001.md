# Iteration 1: Prepare text and claim text asymmetry across OpenCode and Pi

## Focus

The sender's prepare text and the receiver's claim text, because the known 4/5 Pi failure is a text failure: the sender withheld the side word as instructed, then wrote that a fresh session could not recover it, and the receiver asked the operator instead of running the History Lookup. This iteration asks what each side is actually told, and whether either text names the recovery path the other side owns.

## Actions Taken

1. Read the prepare nudge text builder in `lib/nudge.cjs` (the text a sender reads before writing its note).
2. Read the `prepare` command's stdout in `bin/session-handover.cjs`.
3. Read the claim seed text builder (`seedText`) and the `claim` command's stdout.
4. Read both live-run notes and both scorecards under `scratch/runs/`.
5. Read the Pi receiver's pane transcript to see what it actually concluded.

## Findings

1. The prepare nudge text enumerates the note's frontmatter shape and every required section, and never mentions the History Lookup. A sender reading it learns only that the note is the carrier, so a detail deliberately kept out of the note reads as a detail the hop loses. [SOURCE: .skilled/hooks/session-handover/lib/nudge.cjs:180]

2. The `prepare` command's only stdout is the arming line: `[session-handover] handoff prepared; stop now and end this turn.` plus the note path. It names no recovery path either, so the sender's last instruction before it stops carries the same omission. [SOURCE: .skilled/hooks/session-handover/bin/session-handover.cjs:630]

3. The Pi sender's note turned that omission into a false claim about the hop: `Ask the operator for it rather than inventing one, and say plainly that a fresh session cannot recover it from this note.` The sentence is true of the note and false of the hop, because the claim prints a working lookup. [SOURCE: specs/hooks-plugins-extensions/session-handover/001-history-lookup-handover-integration/011-opencode-pi-handover-parity/scratch/runs/base1-pi/note-20261116T053237Z-01a1e2d7-6b7b-75de-a705-ee16233b97a3.md:31]

4. The OpenCode sender's note pointed the other way: `the side word recovered from the sender's earlier turn through the claim's History Lookup section. The note does not carry the side word by instruction.` Same withholding instruction, opposite instruction to the receiver, and that run scored 5/5. [SOURCE: specs/hooks-plugins-extensions/session-handover/001-history-lookup-handover-integration/011-opencode-pi-handover-parity/scratch/runs/base1-opencode/note-20261116T052759Z-ses_e1d2c7c81ffeJTAeWEY1UQO3wn.md:25]

5. The claim seed text tells the receiver `1. Run <claim>; it prints the note body.` and then walks it through the note's sections, the goal, the active command and completion. It never names the History Lookup, so the only place the offer appears is the claim command's own stdout, after the note body. [SOURCE: .skilled/hooks/session-handover/lib/nudge.cjs:276]

6. The claim output appends the lookup section with the instruction `Use it for a detail this note does not spell out, before you guess.` That is a weaker directive than the note's own `Ask the operator for it`, and the note body is printed first, so the note's claim wins the reading order. [SOURCE: .skilled/hooks/session-handover/bin/session-handover.cjs:729]

7. The Pi receiver's reply shows the note's claim beating the offer: `A fresh session has no path to it — not through the note, not through history lookup, since it was never written.` It named the lookup and dismissed it on the note's authority, then asked the operator and left the note `claimed`. [SOURCE: specs/hooks-plugins-extensions/session-handover/001-history-lookup-handover-integration/011-opencode-pi-handover-parity/scratch/runs/base1-pi/pane.txt:331]

## Ruled Out

- "The Pi lookup was never offered." The packet goal records that the offer was printed and works, and `handoverLookupSection` mints the locator at claim time from the note's own `session_id`, `runtime` and `cwd`, all three of which the Pi note carries. The pane capture collapses tool output, so its silence is not evidence of absence. [SOURCE: .skilled/hooks/session-handover/lib/relaunch-core.cjs:1072]
- "The Pi sender leaked the side word." Both scorecards record `sideWordInNote: false`, so the withholding instruction held on both runtimes.

## Dead Ends

- Reading the pane transcript for the claim command's stdout. The capture collapses tool output, so the offer's presence cannot be proven or disproven from the pane. The code path plus the goal's recorded observation is the stronger evidence.

## Edge Cases

- Ambiguous input: "the prepare text each runtime gives the sender" could mean the nudge text or the prepare command's stdout. Both were read; they agree, so the ambiguity does not change the finding.
- Contradictory evidence: the packet goal says the lookup "was offered and works", while the Pi pane shows no lookup section. Resolved as a capture artifact, not a contradiction in the product.
- Missing dependencies: none.
- Partial success: none.

## Sources Consulted

- `.skilled/hooks/session-handover/lib/nudge.cjs:180`
- `.skilled/hooks/session-handover/lib/nudge.cjs:276`
- `.skilled/hooks/session-handover/bin/session-handover.cjs:630`
- `.skilled/hooks/session-handover/bin/session-handover.cjs:729`
- `.skilled/hooks/session-handover/lib/relaunch-core.cjs:1072`
- `specs/hooks-plugins-extensions/session-handover/001-history-lookup-handover-integration/011-opencode-pi-handover-parity/scratch/runs/base1-pi/note-20261116T053237Z-01a1e2d7-6b7b-75de-a705-ee16233b97a3.md:31`
- `specs/hooks-plugins-extensions/session-handover/001-history-lookup-handover-integration/011-opencode-pi-handover-parity/scratch/runs/base1-opencode/note-20261116T052759Z-ses_e1d2c7c81ffeJTAeWEY1UQO3wn.md:25`
- `specs/hooks-plugins-extensions/session-handover/001-history-lookup-handover-integration/011-opencode-pi-handover-parity/scratch/runs/base1-pi/pane.txt:331`
- `specs/hooks-plugins-extensions/session-handover/001-history-lookup-handover-integration/011-opencode-pi-handover-parity/scratch/runs/base1-pi/scorecard.json`
- `specs/hooks-plugins-extensions/session-handover/001-history-lookup-handover-integration/011-opencode-pi-handover-parity/scratch/runs/base1-opencode/scorecard.json`

## Assessment

- New information ratio: 0.79
- Questions addressed: prepare text per runtime; claim text and lookup offer
- Questions answered: What does the prepare text each runtime give the sender say, and where does it let the sender drop a detail the receiver must later recover?; What claim text and History Lookup offer does the receiver read, and why would a receiver skip the lookup and ask the operator instead?

## Reflection

- What worked and why: reading the two live notes side by side isolated the variable. Both senders got the same withholding instruction and both obeyed it; only the sentence each wrote about recoverability differed, and that sentence tracked the score. The code then explained where each sentence came from.
- What did not work and why: grepping the pane for the lookup section produced a false negative, because the capture collapses tool output. Treating a terminal capture as a complete transcript is the mistake.
- What I would do differently: read the claim command's stdout path before the pane, so the code establishes what must have been printed and the pane is only corroboration.

## Recommended Next Focus

The session readers that feed the lookup, and whether their tool-call argument shapes are redacted. The offer is only as good as the reader behind it, and the packet's completion criteria require a `[REDACTED:` marker on a planted token.

## Fixes Named

- Add one line to the prepare nudge text and to the `prepare` stdout: the receiver gets a History Lookup over this session's turns, so a detail kept out of the note is still recoverable and must not be described as lost. [SOURCE: .skilled/hooks/session-handover/lib/nudge.cjs:180]
- Add the same line to the claim seed text, and move the lookup offer above the note body in the claim output so the recovery path is read before the note's own claims. [SOURCE: .skilled/hooks/session-handover/lib/nudge.cjs:276]
