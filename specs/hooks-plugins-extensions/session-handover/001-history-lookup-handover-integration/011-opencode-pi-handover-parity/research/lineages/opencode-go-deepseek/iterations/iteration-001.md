# Iteration 1: The Prepare Text And The Claim Text (Sender Over-Promise And Receiver Under-Verification)

## Focus

Read the text each runtime gives the sender at the hand-over moment, and the text the receiver reads when it claims the note, then compare both against the recorded live runs in `scratch/runs/base1-pi` and `scratch/runs/base1-opencode`. The goal was to pin the Pi 4/5 failure to a line rather than to a model disposition. Ambiguity handled: "prepare text" was read as the nudge/handoff instruction produced by the shared nudge module (used by every adapter), because no runtime-specific prepare prose exists outside it.

## Actions Taken

- Read the shared nudge module's sender text and claim-seed text.
- Read the claim-side History Lookup offer builder and the lookup-offer text it renders.
- Read both live run directories (notes, panes, scorecards, relaunch logs, argv logs).
- Read the Pi receiver's own session log for the rendered claim output, to prove whether the lookup section was actually printed.

## Findings

1. Every runtime's prepare text is the same shared string, and it never mentions the History Lookup. `handoffText` lists the note shape (Goal, Done, Remaining work, In-flight state), the continuity save, the fan-out/lock release, and `prepare`/`keep`, and ends with the "skip these steps only when the operator said not to hand off" exception. No line names the lookup, so a sender has no way to learn that a detail kept out of the note is still recoverable. [SOURCE: .skilled/hooks/session-handover/lib/nudge.cjs:193]

2. The claim-seed text, which is the receiver's first instruction set, also has no lookup step. Its ordered steps are claim, read, resume, goal, `goal.md`, active command, continue Remaining work, complete — the offer is only whatever the `claim` command happens to print after the note body. A receiver that follows the seed literally can finish without ever opening the lookup. [SOURCE: .skilled/hooks/session-handover/lib/nudge.cjs:296]

3. The Pi 4/5 note carries an explicit false instruction written by the sender: "Ask the operator for it rather than inventing one, and say plainly that a fresh session cannot recover it from this note." That is the sentence the receiver obeyed. [SOURCE: specs/hooks-plugins-extensions/session-handover/001-history-lookup-handover-integration/011-opencode-pi-handover-parity/scratch/runs/base1-pi/note-20261116T053237Z-01a1e2d7-6b7b-75de-a705-ee16233b97a3.md:28]

4. The sender's recorded reasoning shows the over-promise is caused by missing knowledge, not by a careless claim: it reasoned "The claim seed carries only the note path and the spec folder. Hmm, does the seed carry anything else? ... So literally impossible", and then wrote the note accordingly. The sender had read only the first 175 lines of the README, so it never saw the History Lookup section at line 198. [SOURCE: specs/hooks-plugins-extensions/session-handover/001-history-lookup-handover-integration/011-opencode-pi-handover-parity/scratch/runs/base1-pi/pane.txt:273]

5. The offer was in fact printed to the Pi receiver, complete with a runnable `browse` command and the sentence "Use it for a detail this note does not spell out, before you guess." The receiver's own session log contains the rendered `## History Lookup` section, so this is not a minting failure, a store failure, or a transaction failure. [SOURCE: .skilled/hooks/session-handover/lib/relaunch-core.cjs:1072]

6. The Pi receiver then asserted the opposite of what the lookup could do: "A fresh session has no path to it — not through the note, not through history lookup, since it was never written." The side word had been written, in the sender's first user turn, which is exactly what the offered `browse` reads. A generic offer that arrives after a note which says "cannot recover" loses to the note. [SOURCE: specs/hooks-plugins-extensions/session-handover/001-history-lookup-handover-integration/011-opencode-pi-handover-parity/scratch/runs/base1-pi/pane.txt:330]

7. The parity difference is sender knowledge, not runtime prose. The OpenCode note told the receiver to recover the side word "from the sender's earlier turn through the claim's History Lookup section", and that receiver ran the lookup, loaded the sender's first user turn, and quoted it. Both senders received the same shared prepare text; only the OpenCode sender had read far enough into the README to know the lookup existed. [SOURCE: specs/hooks-plugins-extensions/session-handover/001-history-lookup-handover-integration/011-opencode-pi-handover-parity/scratch/runs/base1-opencode/note-20261116T052759Z-ses_e1d2c7c81ffeJTAeWEY1UQO3wn.md:22]

8. The receiver's completion is never gated on the note's claims having been checked, so a false note claim survives to `complete`. On Pi the note stayed `claimed` only because the operator was asked; nothing in the protocol required the lookup to be tried first. [SOURCE: .skilled/hooks/session-handover/lib/nudge.cjs:340]

## Ruled Out

- "Pi did not mint or print the lookup": ruled out by finding 5 — the receiver's session log holds the rendered section and a `hl1_` handle.
- "The Pi session reader could not find the sender's session": ruled out indirectly; the claim mint calls the same reader and the mint succeeded, since the section printed. The remaining reader risk is therefore about breadth of what a found session yields, not about finding it.
- "The shared prepare text differs between OpenCode and Pi": ruled out; both adapters call the same `handoffText`.

## Dead Ends

- Searching the prepare/seed text for any recovery wording: there is none to find. Any fix has to add it rather than repair it.

## Edge Cases

- Ambiguous input: "prepare text" could mean the runtime-level prompt (system prompt) or the shared handoff instruction. Chose the shared handoff instruction because it is the only text the sender sees at the hand-over moment; runtime prompt differences are deferred to the delivery iteration.
- Contradictory evidence: none. The note text, the sender's reasoning, the receiver's claim output and the receiver's reply all agree on the causal chain.
- Missing dependencies: the Pi receiver transcript lives outside the repository (`~/.pi/agent/sessions/`), so it is cited as inference-with-path rather than as a repo-relative source. The pane and the relaunch log in the run directory corroborate it.
- Partial success: none; all planned reads succeeded.

## Questions Answered

- What does each runtime's prepare text tell the sender about keeping details out of the note, and does it over-promise what a fresh session can recover through the History Lookup?
- What claim text and History Lookup offer does the receiver read on OpenCode versus Pi, and what makes a receiver leave a claim unverified instead of running the lookup?

## Questions Remaining

3 of 5 key questions remain open (readers, model/effort carry, the four known limits).

## Sources Consulted

- .skilled/hooks/session-handover/lib/nudge.cjs:193
- .skilled/hooks/session-handover/lib/nudge.cjs:296
- .skilled/hooks/session-handover/lib/nudge.cjs:340
- .skilled/hooks/session-handover/lib/relaunch-core.cjs:1072
- .skilled/hooks/session-handover/history/lib/lookup-offer.ts:82
- .skilled/hooks/session-handover/README.md:198
- specs/hooks-plugins-extensions/session-handover/001-history-lookup-handover-integration/011-opencode-pi-handover-parity/scratch/runs/base1-pi/note-20261116T053237Z-01a1e2d7-6b7b-75de-a705-ee16233b97a3.md:28
- specs/hooks-plugins-extensions/session-handover/001-history-lookup-handover-integration/011-opencode-pi-handover-parity/scratch/runs/base1-pi/pane.txt:273
- specs/hooks-plugins-extensions/session-handover/001-history-lookup-handover-integration/011-opencode-pi-handover-parity/scratch/runs/base1-pi/pane.txt:330
- specs/hooks-plugins-extensions/session-handover/001-history-lookup-handover-integration/011-opencode-pi-handover-parity/scratch/runs/base1-opencode/note-20261116T052759Z-ses_e1d2c7c81ffeJTAeWEY1UQO3wn.md:22
- specs/hooks-plugins-extensions/session-handover/001-history-lookup-handover-integration/011-opencode-pi-handover-parity/scratch/runs/base1-opencode/pane.txt:22
- ~/.pi/agent/sessions/--Users-michelkerkmeester-worktrees-public-422-opencode-pi-handover-parity--/2026-11-16T05-32-58-558Z_01a1e2d8-253d-75b7-978c-e205cabefd81.jsonl (rendered claim output containing the lookup section)

## Assessment

- New information ratio: 1.0
- Questions addressed: prepare text; claim text and offer
- Questions answered: prepare text; claim text and offer

## Reflection

- What worked and why: reading the live note against the generated text rather than against the README's own description of behaviour. The note sentence and the sender's reasoning line match the absence of lookup wording in `handoffText` exactly, which turns a behavioural score into a text defect with a location.
- What did not work and why: treating the README's History Lookup section as evidence of the protocol failed — the section describes what `claim` prints, and the sender is never told that section exists. Documentation of a receiver capability is not instruction to the sender.
- What I would do differently: check the receiver's raw session log first when the question is "was it offered"; the pane collapses tool output, and the session log settles offer-versus-mint in one read.

## Recommended Next Focus

Iteration 2: the two session readers that feed the lookup. Read `.skilled/hooks/shared/session-readers/opencode.mjs` and `pi.mjs` against `history/lib/core.ts` redaction, and establish exactly which tool-call argument shapes reach the redactor, what the OpenCode store without a `directory` column changes about folder proof, and what the 160-character preview cut hides from a receiver who is searching for an exact value.
