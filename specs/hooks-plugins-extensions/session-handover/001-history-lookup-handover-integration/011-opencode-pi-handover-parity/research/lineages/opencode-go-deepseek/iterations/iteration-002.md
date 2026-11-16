# Iteration 2: The Session Readers That Feed The Lookup (Shapes, Redaction, Folder Proof, Preview Cut)

## Focus

Read the OpenCode and Pi session readers that the History Lookup depends on, then the projection and redaction layers above them, and establish what each can fail to recover. Also quantified the 160-character preview cut against the live Pi run rather than treating it as a general caution.

## Actions Taken

- Read the shared projection contract and the two runtime readers.
- Read the reader dispatcher's failure mapping and the lookup CLI's reader call.
- Read the redaction layer and the navigator's preview/excerpt bounds.
- Measured the side word's position inside the live Pi sender prompt against the preview bound.

## Findings

1. Tool-call arguments that are not a plain object are silently replaced with `{}`. `toolCallBlock` keeps arguments only when they are a non-array object, and the projection's `validBlock` requires an object; a runtime that stores a tool call's arguments as a JSON string yields a block that renders as the tool name plus `{}`, so the path, command or figure inside it is unrecoverable while the turn still looks intact. [SOURCE: .skilled/hooks/shared/session-readers/project.mjs:40]

2. An OpenCode store without a `directory` column cannot prove which folder a session ran in, and the reader does not fail closed. It selects `id` alone, and the folder check only runs when `hasDirectory` is true, so the session is accepted whatever folder it came from. The claim's mint then treats that acceptance as proof, which means the "note folder and recorded folder are in the same checkout" invariant is unenforced on exactly the stores the charter names. [SOURCE: .skilled/hooks/shared/session-readers/opencode.mjs:256]

3. A projection defect is reported as `store_unreadable`, which misdiagnoses the cause and costs the whole session. One orphaned, duplicated or mismatched tool result makes `projectEntries` fail, and `readSession` converts any projection failure into `store_unreadable` — the same code the README tells receivers means the store "is missing or could not be read". The receiver is told the store is broken when the real cause is one turn's pairing. [SOURCE: .skilled/hooks/shared/session-readers/index.mjs:127]

4. Pi finds a historical session only by exact project directory plus exact header id plus matching header `cwd`, and refuses two candidates as `session_ambiguous` rather than guessing. That is the correct conservative behaviour, but it makes the note's `cwd` load-bearing: a note whose `cwd` differs from the directory Pi keyed the session under cannot be read at all, and the claim then offers no lookup. [SOURCE: .skilled/hooks/shared/session-readers/pi.mjs:222]

5. The lookup CLI reads through the projected path, so hook-injected messages never reach a receiver. `cli.ts` calls `readSession`, which returns only `items`; the raw `loadSession` envelope is the only path that carries `injected`, and it is not the one the lookup uses. A detail that arrived as an injected block rather than a user or assistant turn is outside the lookup's reach. [SOURCE: .skilled/hooks/session-handover/history/lib/cli.ts:406]

6. Redaction runs once, before projection, on text, thinking and tool-call arguments. Argument keys matching the credential pattern are replaced whole, and every other string goes through the shared scrubber plus URL-password and authorization-value patterns. The consequence is safe by construction — no route reaches a raw entry — but it also means redaction can only see a secret whose key or shape it knows; a secret carried as an opaque positional argument under a neutral key such as `command` survives unless a value pattern matches. [SOURCE: .skilled/hooks/session-handover/history/lib/core.ts:56]

7. The 160-character preview cut hides the live case's side word from the offer's own primary command. `previewFor` slices a turn's text to 160 characters, and `browse` returns those previews; the side word in the Pi sender's first user turn sits at character 295 of a 425-character prompt, so a receiver that ran exactly the offered `browse` would see a preview that does not contain it. Only `load`, the second operation listed in the offer's "Also:" line, returns the full turn. [SOURCE: .skilled/hooks/session-handover/history/lib/navigator.ts:265]

8. Search previews are centered on the match, but browse previews are not. `searchPreview` calls `excerptAround` with the matched token's offsets, so a search for an identifier shows it even deep in a turn; `browse` uses the leading slice. The offer leads with `browse`, which is the one operation that cannot center on a value the receiver does not already know. [SOURCE: .skilled/hooks/session-handover/history/lib/navigator.ts:284]

## Ruled Out

- "Redaction drops secrets from tool-call arguments in a shape-dependent way": ruled out for objects, which are key-checked and string-scrubbed; the shape hazard is the reverse — non-object arguments are dropped before redaction can matter.
- "The Pi reader enumerates the store and may pick the wrong session": ruled out; it filters by exact id and refuses ambiguity.

## Dead Ends

- Looking for a reader-level fallback when the project directory misses: none exists, by design. Any fix must be at the note/claim layer (record the store key) rather than in the reader.

## Edge Cases

- Ambiguous input: "secret redaction of their tool-call argument shapes" could mean leak-prevention or recovery loss. Read both ways; finding 6 covers leak-prevention, finding 1 covers recovery loss.
- Contradictory evidence: the README says a lookup failure means the store is unreadable, while the dispatcher maps projection defects to the same code. Both are true statements about different layers; recorded as finding 3 rather than resolved into one cause.
- Missing dependencies: none.
- Partial success: the Pi mid-session `cd` hazard (finding 4) is inferred from the reader's keying and the note's `cwd` field, not observed in a run; it is stated as a mechanism, not as an observed failure.

## Questions Answered

- How do the OpenCode and Pi session readers feed the History Lookup, including their tool-call argument shapes and secret redaction, and what does each fail to recover?

## Questions Remaining

2 of 5 remain open (model/effort carry, and the four known limits as a set).

## Sources Consulted

- .skilled/hooks/shared/session-readers/project.mjs:40
- .skilled/hooks/shared/session-readers/project.mjs:152
- .skilled/hooks/shared/session-readers/opencode.mjs:256
- .skilled/hooks/shared/session-readers/pi.mjs:222
- .skilled/hooks/shared/session-readers/index.mjs:127
- .skilled/hooks/session-handover/history/lib/cli.ts:406
- .skilled/hooks/session-handover/history/lib/core.ts:56
- .skilled/hooks/session-handover/history/lib/navigator.ts:265
- .skilled/hooks/session-handover/history/lib/navigator.ts:284
- .skilled/hooks/session-handover/history/lib/loads.ts:1
- .skilled/hooks/session-handover/history/lib/lookup-offer.ts:85
- specs/hooks-plugins-extensions/session-handover/001-history-lookup-handover-integration/011-opencode-pi-handover-parity/scratch/runs/base1-pi/meta.json

## Assessment

- New information ratio: 1.0
- Questions addressed: reader coverage, redaction, preview cut
- Questions answered: reader coverage and redaction

## Reflection

- What worked and why: measuring the preview bound against the actual prompt offset turned a documented caution into a number (295 > 160), which makes the fix testable.
- What did not work and why: reading the README's refusal-code list first suggested `store_unreadable` was a store problem; only the dispatcher showed it is also the wrapper for every projection defect.
- What I would do differently: start from the reader dispatcher's failure envelope, then walk down to the reader, because the code a receiver sees is produced at the top, not at the store.

## Recommended Next Focus

Iteration 3: model and effort carry on relaunch, plus the double-nudge limit. Read `relaunch-core.cjs`'s record/consume path against `skilled-loop`'s relaunch argv builder, and read the Pi extension's held-nudge state and the OpenCode plugin's `shouldPushActiveNudge` so both the silent-degradation path and the two-hook repeat are pinned to code.
