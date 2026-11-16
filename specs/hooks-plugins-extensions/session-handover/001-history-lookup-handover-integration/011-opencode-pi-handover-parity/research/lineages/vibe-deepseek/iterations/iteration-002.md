# Iteration 2: Session readers, redaction of tool-call arguments, and the preview cut

## Focus

The two session readers that feed the History Lookup (`opencode.mjs`, `pi.mjs`) and the redaction layer that every lookup reply passes through. The offer is only as good as the reader behind it, and the packet's completion criteria require a `[REDACTED:` marker on a planted token, so this iteration asks whether the readers can prove which session they read and whether the redaction covers the argument shapes they emit.

## Actions Taken

1. Read the redaction layer in `history/lib/core.ts` (text, argument and block scrubbers).
2. Read the shared scrubber's pattern table in `system-spec-kit/shared/dist/parsing/secret-scrubber.js`.
3. Read the OpenCode reader's session lookup and the Pi reader's header proof.
4. Ran the scrubber against five credential shapes to test the key rule and the length floor.
5. Measured where the side word sits inside the sender's live prompt against the 160-character preview bound.

## Findings

1. Redaction runs once, in the core, before projection: `redactHistoryEntries` maps every entry's content through `redactBlock`, so search, previews, part lists and pages all read already-redacted text. A route cannot reach an unredacted byte. [SOURCE: .skilled/hooks/session-handover/history/lib/core.ts:101]

2. `redactArgument` redacts a string argument only when its key matches `SECRET_ARGUMENT_KEY`; every other string falls through to `redactText`, which is a pattern scan of the value alone. The key rule is therefore the only thing that catches a short credential. [SOURCE: .skilled/hooks/session-handover/history/lib/core.ts:71]

3. `SECRET_ARGUMENT_KEY` does not match a prefixed header name. `x-api-key` fails the anchored alternation, so its value is scanned as bare text and a short token survives. Verified by running the scrubber: `{"x-api-key":"sk-live-abc123"}` comes back unchanged. [SOURCE: .skilled/hooks/session-handover/history/lib/core.ts:57]

4. The scrubber's `credential-assignment` pattern requires a 20-character value, so a short token is invisible to text scanning even when the key is spelled out. Verified: `apiKey=sk-live-abc123` is unchanged while `apiKey=sk-live-abcdefghij1234567890` redacts. [SOURCE: .skilled/skills/system-spec-kit/shared/dist/parsing/secret-scrubber.js:120]

5. The Pi reader proves the session before reading it: it requires the header's `type` to be `session`, its `id` to equal the requested id, and `samePath(header.cwd, projectDir)`, returning `session_mismatch` on any failure. [SOURCE: .skilled/hooks/shared/session-readers/pi.mjs:242]

6. The OpenCode reader skips that proof when the store has no `directory` column. `hasDirectory` is false, the SELECT narrows to `id`, and the `projectDir` comparison is guarded by `hasDirectory`, so a same-id session from another project is accepted and its parts are served. [SOURCE: .skilled/hooks/shared/session-readers/opencode.mjs:256]

7. The 160-character preview cut hides the very detail a lookup is for. The side word sits at character 295 of the 425-character sender turn, so a `search` preview ends 135 characters before it; only `load` or `page` reaches the value. [SOURCE: .skilled/hooks/session-handover/history/lib/pages.ts:300]

8. The OpenCode receiver's success came from doing exactly that: it reported that it "loaded the sender's first user turn" and quoted the sentence holding the side word, rather than reading a preview. [SOURCE: specs/hooks-plugins-extensions/session-handover/001-history-lookup-handover-integration/011-opencode-pi-handover-parity/scratch/runs/base1-opencode/pane.txt:22]

## Ruled Out

- "Redaction is per-adapter, so one runtime can miss it." Both readers emit `toolCallBlock`, and the core redacts every block regardless of which reader produced it, so the layer is shared.
- "The preview cut is harmless because search returns the whole turn." It returns a bounded preview plus a read handle; the value is only reachable through the handle.

## Dead Ends

- Reading the Pi fixture for a tool-call argument shape. `pi-assistant-message-end.json` carries no `toolCall` item, so the argument shape had to be read from the reader's mapping instead.

## Edge Cases

- Ambiguous input: "secret redaction of their tool-call argument shapes" could mean the readers' own redaction or the core's. The readers do none; the core does all of it. Recorded as the shared-layer finding.
- Contradictory evidence: none.
- Missing dependencies: no Pi fixture with a tool call, so the argument shape is inferred from `assistantBlocks` rather than observed in a fixture.
- Partial success: the scrubber was executed directly, which proves the pattern behaviour but not the end-to-end reply; the end-to-end proof belongs to the live-hop harness.

## Sources Consulted

- `.skilled/hooks/session-handover/history/lib/core.ts:57`
- `.skilled/hooks/session-handover/history/lib/core.ts:71`
- `.skilled/hooks/session-handover/history/lib/core.ts:101`
- `.skilled/hooks/session-handover/history/lib/pages.ts:300`
- `.skilled/hooks/session-handover/history/lib/navigator.ts:267`
- `.skilled/hooks/shared/session-readers/opencode.mjs:256`
- `.skilled/hooks/shared/session-readers/pi.mjs:242`
- `.skilled/skills/system-spec-kit/shared/dist/parsing/secret-scrubber.js:120`
- `specs/hooks-plugins-extensions/session-handover/001-history-lookup-handover-integration/011-opencode-pi-handover-parity/scratch/runs/base1-opencode/pane.txt:22`

## Assessment

- New information ratio: 0.88
- Questions addressed: session readers and redaction; the 160-character preview cut
- Questions answered: How do the OpenCode and Pi session readers feed the History Lookup, and do they redact secrets in tool-call argument shapes?

## Reflection

- What worked and why: executing the scrubber against five shapes turned a reading of the regex into a fact. The 20-character floor and the anchored key alternation are both invisible until a short token is put through them.
- What did not work and why: looking for a Pi fixture with a tool call wasted a call; the fixture set covers the message-end event, not a tool-call content item.
- What I would do differently: measure the preview bound against the live prompt earlier, because it explains the OpenCode/Pi score gap more directly than the reader code does.

## Recommended Next Focus

Model and reasoning effort carry on relaunch, then the remaining known limits: `AI_SESSION_CHILD` leaking into test sandboxes and the double nudge from two hooks.

## Fixes Named

- Extend `SECRET_ARGUMENT_KEY` to match a prefixed header name (`(?:^|[_-])(?:api[_-]?key|authorization|token|secret)$`) so `x-api-key` and its siblings take the key rule. [SOURCE: .skilled/hooks/session-handover/history/lib/core.ts:57]
- Lower the scrubber's credential-assignment floor, or add a key-anchored short-value rule, so a token under 20 characters still redacts. [SOURCE: .skilled/skills/system-spec-kit/shared/dist/parsing/secret-scrubber.js:120]
- Make the OpenCode reader refuse a store without a `directory` column when the caller supplied `projectDir`, instead of silently skipping the proof, so it fails closed the way the Pi reader does. [SOURCE: .skilled/hooks/shared/session-readers/opencode.mjs:256]
- Have the lookup reply say when a preview was cut, so a receiver knows the value may sit past the bound and must `load` the part. [SOURCE: .skilled/hooks/session-handover/history/lib/pages.ts:300]
