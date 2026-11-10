# Iteration 4: Detector heuristic, false-positive surface and fixtures

## Focus

Define the detector that decides a turn ended in a prose option menu without an ask-tool
call. The repository already ships a question detector for decision capture; the question is
whether it can be reused, what it misses, and how often it would fire on ordinary numbered
steps, summaries and code blocks.

## Actions Taken

- Read the chat-question detector's constants, prose stripper, option matcher and candidate
  selection.
- Read the process-question filter, which suppresses scope, permission, gate and shipping
  questions from capture.
- Read the detector's 13 tests and listed the per-runtime fixtures already in the tree.
- Read the Claude transcript sweep's tool constant, which proves the "did an ask tool run"
  half of the rule is already implemented per runtime.

## Findings

1. **A question detector already exists and is close to the needed shape.** `chat-questions.mjs` reads the closing paragraph, requires a `?` in prose, collects lettered options from that paragraph or an immediately following options-only paragraph, and skips process questions. The ask-surface guard can reuse it instead of inventing a second parser. [SOURCE: .skilled/hooks/decision-capture/lib/chat-questions.mjs:120] [SOURCE: .skilled/hooks/decision-capture/lib/chat-questions.mjs:277]
2. **Its option grammar is too narrow for enforcement.** `OPTION_LINE` accepts only `A)` through `D)`, optionally bulleted or bolded. A numbered menu (`1)`, `2)`), an `A.` style, or an `Option 1:` label is invisible to it, so a guard built on the constant alone would miss real prose menus. [SOURCE: .skilled/hooks/decision-capture/lib/chat-questions.mjs:28]
3. **The prose stripper is the anti-code-block defense.** Before testing for a question mark, it removes fenced code, inline code, straight and curly quotes, and blockquote, table and heading lines. A `?` inside a code sample or a quoted transcript therefore cannot open a candidate. [SOURCE: .skilled/hooks/decision-capture/lib/chat-questions.mjs:118]
4. **Ordinary numbered steps are a low false-positive risk.** The gate is the option list, not the number, and step lists use `1.` at the margin while the option matcher requires an `A)`-shaped marker. A reply can be a numbered plan and still contain no candidate. [INFERENCE: from the option regex at chat-questions.mjs:28 and the numbered-line regex at chat-questions.mjs:49]
5. **Summaries are a low risk only while a question mark is required.** A closing "Anything else?" has no option list, so it fails the option gate. A summary that both asks a question and prints four `A)`-shaped lines would fire, which is the intended behavior but also the residual false positive. [INFERENCE: from the candidate rule at chat-questions.mjs:277]
6. **Two real false-positive vectors remain: options-only code blocks and blockquoted menus.** `isOptionsOnly` and `optionLabelsOf` read raw lines, while only the question test is prose-stripped. A paragraph that is entirely a code block of `A)` lines, or a quoted menu inside a blockquote, can satisfy the option half. The guard must strip fences and quotes before option extraction, not only before the question test. [SOURCE: .skilled/hooks/decision-capture/lib/chat-questions.mjs:133]
7. **The "no ask-tool call in the turn" half is already implemented per runtime.** Claude's transcript sweep keys on `AskUserQuestion`, Codex on `request_user_input`, OpenCode on `question`, Pi on `ask_user_question` or `question`, Devin and DSH on `ask_user_question`. A guard can reuse those readers to prove the negative. [SOURCE: .skilled/hooks/decision-capture/bin/sweep-transcript.mjs:41] [SOURCE: .skilled/hooks/decision-capture/bin/sweep-codex.mjs:38] [SOURCE: .skilled/hooks/decision-capture/bin/sweep-opencode.mjs:46] [SOURCE: .skilled/hooks/decision-capture/bin/sweep-pi.mjs:35]
8. **Claude's Stop payload cannot prove the negative by itself.** `last_assistant_message` carries the text, but whether an ask tool ran in the turn lives in the transcript, so the Claude guard needs the payload for the text and `transcript_path` for the tool-use scan. [SOURCE: https://docs.claude.com/en/docs/claude-code/hooks]
9. **A fixture base already exists and needs negatives, not positives.** The tree holds positive ask fixtures for Claude, Codex, OpenCode, Pi and Devin, plus 13 detector tests; what it lacks is the negative set a guard must not fire on: numbered steps, a summary question with no options, a fenced code menu, a blockquoted menu, a single option, and a question already asked through the tool. [SOURCE: .skilled/hooks/decision-capture/bin/fixtures/claude-chat-questions.jsonl] [SOURCE: .skilled/hooks/decision-capture/lib/chat-questions.test.mjs:10]

## Ruled Out

- **Reusing `isProcessQuestion` as the guard's filter.** It suppresses scope, permission, gate
  and shipping questions from *capture*, which is the opposite polarity: those are exactly the
  decisions the ask surface exists to carry. Reusing it would silence the guard on Gate 3.
- **A pure `last_assistant_message` check with no tool scan.** It cannot distinguish a turn
  that asked through the tool from one that printed a menu.

## Dead Ends

- None. The detector's limits are documented in its own constants and tests.

## Edge Cases

- Ambiguous input: whether a numbered menu should count as a prose menu. Decided yes; the
  grammar must be widened or the guard has a known blind spot.
- Contradictory evidence: none.
- Missing dependencies: none.
- Partial success: the fixture set is proposed, not created; creation belongs to implementation.

## Sources Consulted

- .skilled/hooks/decision-capture/lib/chat-questions.mjs
- .skilled/hooks/decision-capture/lib/chat-questions.test.mjs
- .skilled/hooks/decision-capture/lib/capture-core.mjs
- .skilled/hooks/decision-capture/bin/sweep-transcript.mjs
- .skilled/hooks/decision-capture/bin/sweep-codex.mjs
- .skilled/hooks/decision-capture/bin/sweep-opencode.mjs
- .skilled/hooks/decision-capture/bin/sweep-pi.mjs
- .skilled/hooks/decision-capture/bin/fixtures/
- https://docs.claude.com/en/docs/claude-code/hooks

## Assessment

- New information ratio: 0.9
- Questions addressed: Q3
- Questions answered: Q3 in full, including the false-positive classes and a fixture set.

## Reflection

- What worked and why: reading the detector's constants first made the false-positive analysis
  concrete, because each risk maps to one regex and one function.
- What did not work and why: nothing failed. The detector's option grammar is the one real gap,
  and it was visible in a single line.
- What I would do differently: list the fixtures before the tests next time; the positive-only
  fixture set explains why the detector was never tuned against menus it must reject.

## Recommended Next Focus

Iteration 5: wiring and rule text. Map the guard onto `hook-registry.json`,
`sync-hook-registrations.cjs` and the `.skilled/hooks/<name>/<runtime>/` layout, decide the
sync-versus-async and loop-guard details, define the escape hatch, and draft the exact
amendments for `communication-handoff.md` §4/§5 and `AGENTS.md` Gate 3 inside the ask-surface
carve-out.
