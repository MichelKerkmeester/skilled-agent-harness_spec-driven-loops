# Iteration 6: the approval card, the paste guard and what the chat loop already has

## Focus

003-terminal-screen child 005-answer-flow and 010-conversations. The strategy's Next Focus is the terminal sentinel, so the lowest-coverage rule applies. These two are read together because both render a person's input at the moment it becomes an action: the answer overlay decides, and the chat loop types. The reference for both is turnstone's `cli.py`, the Apache-2.0 loop 010 already lifts.

## Actions Taken

1. Read the plan side: `010-conversations/002-conversation-runtime-and-chat-verb/spec.md` REQ-001 to REQ-015 (append-only file, nine-key message, routing, readline loop, transcript, single appender, block bounds, notices, secret check) and `003-terminal-screen/001-ux-and-component-map/design/component-inventory.md` REQ-021's sanitizer rule and the decision-overlay row.
2. Read turnstone's `turnstone/cli.py` from its module doc through `setup_readline`, including `_style_preview`, `_shown`, `_show_lines`, `_one_line` and `_completer`.
3. Read openhuman-tui's `README.md` controls table for the composer's keys and its paste rule. Licences: turnstone Apache-2.0, openhuman GPL-3.0-only (design reference only).

## Findings

1. **003-terminal-screen, child 005-answer-flow.** For an approval that will run a command, the reference deliberately keeps every control character on the card, and says why: "An approval card keeps every one, since in a command it changes what runs (`cd /tmp` followed by one fails)". The plan's single sanitizer replaces every control character, line breaks included, with `?` (REQ-021), which is right for a bot id and a question and wrong for a command preview: an operator reading `cd /tmp?rm -rf x` instead of a two-line command is deciding on a different command than the one that will run. The plan's decision overlay draws the item's `question` and its `grants`, and `grants.action` is the whole question clipped to 120 characters — so there is no separate preview surface where the exact bytes would be lost, and the divergence is latent rather than live. It becomes live the day a grant carries a command, and the rule to record now is one line: the sanitizer applies to every drawn string except a field that is itself a command, which is shown with its control characters visible. Size S. [SOURCE: specs/system-skilled-bots/context/turnstone-main/turnstone/cli.py:126-136] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/004-panes/spec.md:160] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/spec.md:159] (observed, plan consequence inferred)

2. **003-terminal-screen, child 005-answer-flow (and 006-approval-grants).** The reference's approval card is a *diff*: `_style_preview` reads each line's leading marker and colours removals red, additions green, separators and warnings yellow, the rest dim, and the doc says the session "sends previews as plain text, so it no longer colours them itself" — the colouring moved to the reader so the two ends cannot disagree about a preview's shape. The plan's overlay shows the question and the grant's kind, rung and scope, which answers *what kind of thing is this* and not *what exactly will change*. For the two kinds where the difference matters — `delete` and `send` — a preview is what turns an approval into a decision, and OpenBot's own approval card is described in the parity synthesis as offering four scopes over a described action. Size M, because it needs a producer per action kind rather than a renderer trick. [SOURCE: specs/system-skilled-bots/context/turnstone-main/turnstone/cli.py:95-117] [SOURCE: specs/system-skilled-bots/002-openbot-parity-research/001-openbot-parity-research/research/research.md:89] (observed, plan gap inferred)

3. **010-conversations, child 002's interactive loop.** openhuman-tui's controls table states two rules that a readline loop needs and the plan does not name: "Pasting text never sends it automatically", and a newline needs `Shift+Enter` or `Ctrl+J` while `Enter` sends. The plan's loop sends on Enter, treats an empty line as nothing, and reads `--message -` from stdin "as one line" (REQ-001, REQ-005). A pasted multi-line block into an interactive `bots chat` therefore arrives as several Enters, and each one dispatches a run — the exact hazard the reference names. The fix is cheap and specific: bracket-bracketed paste detection (crossterm and readline both expose it) so a paste ends with a newline that does not send, or a rule that a message containing a line feed is never sent by Enter alone. Size S. [SOURCE: specs/system-skilled-bots/context/openhuman-full/crates/openhuman-tui/README.md:40-58] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/010-conversations/002-conversation-runtime-and-chat-verb/spec.md:152-156] (observed)

4. **003-terminal-screen, child 004-panes (a rule for the sanitizer's placement).** turnstone's `_shown` exists so "a top-level field printed from one is shown without anyone remembering to", and its implementation is deliberately shallow, with two reasons stated: a nested dict "comes back as the same object, unshown", and a tool's arguments "which a model can nest deeper than Python recurses, are never walked"; the doc adds that the copy exists only because the session "reads back what the UI writes into the original (a denial), and policy checks use its labels, so only printing reads the copy". The plan's rule — every drawn runtime string passes through one sanitizer, applied in `view/panes.rs` — has the same property by construction, because the sanitizer runs at draw time and never mutates the item. Recording the reference's second half is what matters: a sanitizer that sanitizes *in place* would change the answer the operator wrote, which is the failure this design avoids. Size 0; it is a constraint, not a task. [SOURCE: specs/system-skilled-bots/context/turnstone-main/turnstone/cli.py:119-146] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/004-panes/spec.md:115] (observed)

5. **010-conversations, negative finding.** Everything else the loop needs is already better specified in the plan than in either reference: readline history and tab completion (REQ-005) is turnstone's `setup_readline` with `set_history_length(1000)` and a slash-command `_completer`, and the plan adds `@bot` completion; the append-only file with a torn last line skipped and counted (REQ-002) has no counterpart in either reference; the reserved `needs you:` and `failed:` prefixes escaped with one leading backslash so a bot reply "can never draw as a parked question or a failure" (REQ-007) is a guard neither reference states; and the conversation block's 40-message and 8,000-character bounds (REQ-009) are more specific than openhuman's unbounded transcript. Recorded so a later iteration does not re-read `cli.py` looking for a chat contract that is not there: 010's lift is the loop's shape, not its rules. [SOURCE: specs/system-skilled-bots/context/turnstone-main/turnstone/cli.py:168-180] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/010-conversations/002-conversation-runtime-and-chat-verb/spec.md:152-168] (observed)

## Ruled Out

- **Lifting `_one_line`'s 400-character summary cap as a requirement.** The plan already clips `grants.action` to 120 characters and puts only stderr's first line in the status row, so the reference's cap is a weaker version of a rule the plan has. The one detail worth keeping is the reason: the reference caps because "its line feeds could push the card and its RISK line off screen", which is the same argument the plan's status-row rule makes.
- **Reading openhuman's composer** (`src/composer.rs`, 343 lines) for the paste rule. The README's controls table states the rule normatively, and the implementation would only show the escape sequence it listens for, which the plan's crate would pick for itself.
- **Treating the diff-preview finding as a 010 item.** A conversation shows what was said, not what an action will change; the preview belongs to the approval card.

## Dead Ends

- `grep` for `REQ-0` in `010-conversations/spec.md` returned two rows that are *requirement-id history*, not requirements: the phase parent assigns its children's id ranges and records two renumbering decisions. The real requirement tables live in the three children, which is where they were read. Recorded so a later iteration does not mistake the parent's range table for a missing requirement list.
- Reading `_show_lines`'s CR-LF rule as a finding for the plan's message storage: the plan already keeps every line feed and drops every other control character, "the carriage return included" (REQ-003, decision D10), which is the same rule with a clearer boundary. No finding.

## Edge Cases

- **Contradictory evidence:** finding 1 is a genuine divergence between the plan's single sanitizer and the reference's exception for commands. It is resolved in the plan's favour *for now* (no grant carries a command), and the finding states the condition under which the reference wins, rather than pretending one side is simply right.
- **Ambiguous input:** the strategy's Next Focus is the terminal sentinel; the lowest-coverage rule was applied again.
- **Missing dependency:** none.
- **Partial success:** finding 5 is negative. The iteration's positive yield is three findings, two of which are latent (a command preview and a diff) rather than live defects, and the narrative says so.

## Sources Consulted

- specs/system-skilled-bots/context/turnstone-main/turnstone/cli.py:1-20,90-180
- specs/system-skilled-bots/context/openhuman-full/crates/openhuman-tui/README.md:30-60
- specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/004-panes/spec.md:115,160
- specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/001-ux-and-component-map/design/component-inventory.md:24-45
- specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/spec.md:159
- specs/system-skilled-bots/003-openbot-parity-build/010-conversations/spec.md:138,172-174
- specs/system-skilled-bots/003-openbot-parity-build/010-conversations/002-conversation-runtime-and-chat-verb/spec.md:152-168
- specs/system-skilled-bots/002-openbot-parity-research/001-openbot-parity-research/research/research.md:89

## Assessment

- New information ratio: 0.75
- Questions addressed: 003's answer card and 010's terminal loop
- Questions answered: none tracked; carried by findings

## Reflection

- **What worked and why:** reading the reference's helper functions in the order they appear. `_style_preview`, `_shown`, `_show_lines` and `_one_line` sit next to each other and each carries a paragraph explaining the case it was written for, so four adjacent functions produced a divergence (commands keep their control characters), a missing feature (the diff), and a rule (sanitize the display copy) in one read.
- **What did not work and why:** grepping the 010 phase parent for requirement rows. The parent carries an id-range table and two renumbering decisions instead of requirements, so the first read produced two hits that looked like weak requirements. The children hold the real tables, and the parent's own text says so.
- **What I would do differently:** for a phase parent, read the child list first and the parent last; the parent's job here is allocation, so treating it as a requirements document wastes the read.

## Recommended Next Focus

013-manual-testing-scenarios, 014-skilled-and-doc-alignment and 015-deep-review together, because all three are "rules" phases whose evidence is corpora rather than features: read `openhuman-full/e2e` and `openhuman-full/tests`, `tinychannels`' conformance fixtures, turnstone's six memory test files, and openhuman's `FINDINGS-*.md` notes (voice, gemini-live) as the record of what a review found in practice. Then a second net-new sweep over the vendored crates the first pass listed but did not read (`tinyflows`, `tinyeventqueues`, `tinyskills`, `tinysearch`, `tinybus`, `tinydocs`, `tinyartifacts`).
