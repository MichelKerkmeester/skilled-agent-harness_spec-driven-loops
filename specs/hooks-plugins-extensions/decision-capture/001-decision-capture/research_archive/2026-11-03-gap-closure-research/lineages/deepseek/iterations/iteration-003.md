# Iteration 3: Per-gap verdicts, smallest changes, and the deletion/merge surface

## Focus

Convert the two evidence iterations into the charter's answer: for each of the eight gaps, is it worth closing, what is the smallest change, and what should be deleted or merged instead of added. Then name the single maintainability refactor and the test surface that moves with it.

## Actions Taken

1. Inventoried the test surface (15 test files, 4,868 lines) and counted tests per sweep suite.
2. Read `runtime-refusal.test.mjs`, the test that pins the README coverage row.
3. Read the decision-capture runtime-state README's structure table.
4. Read all four files in `.skilled/skills/.state/decision-capture/probe/` and compared them with the matrix's non-covered cells.
5. Enumerated `.codex/hooks.json` by event to see what the repo already asks a Codex user to trust.
6. Confirmed the sweep store locators (`CODEX_HOME`, `opencode.db`, per-runtime `RUNTIME` constants).

## Findings

1. The probe folder holds four probes — codex, devin, opencode, pi — and no Claude and no Cursor probe. The value of "unverified" for Cursor is therefore literal: the documented probe method was run for four runtimes and simply not run for Cursor, so the cell records an unscheduled experiment rather than an observed absence. [SOURCE: .skilled/skills/.state/decision-capture/probe/codex.json:4] [SOURCE: .skilled/skills/.state/decision-capture/probe/pi.json:4] [SOURCE: .skilled/hooks/README.md:275]
2. The Codex probe contradicts the matrix's reason for the Codex cell: it records `status: "observed: hook and rollout both tie the answer to its call"` and then attributes the missing hook to per-user trust, so the capability was demonstrated and not shipped. [SOURCE: .skilled/skills/.state/decision-capture/probe/codex.json:8] [SOURCE: .skilled/skills/.state/decision-capture/probe/codex.json:9]
3. The trust objection does not separate decision capture from hooks the repo already ships: `.codex/hooks.json` registers three `PostToolUse` commands and four `Stop` commands today, so a Codex user already trusts this repository's hooks before any decision-capture entry could be added. [SOURCE: .codex/hooks.json:1] (event inventory: SessionStart 6, UserPromptSubmit 3, PreToolUse 5, PostToolUse 3, Stop 4, PreCompact 1)
4. The probe already carries the exact Codex payload shape the hook would see (`request_user_input` with `tool_response` as a JSON string whose `answers` are keyed by question id), so a Codex live adapter needs no new schema discovery — only the mapping the sweep already performs. [SOURCE: .skilled/skills/.state/decision-capture/probe/codex.json:6]
5. The matrix is test-pinned to exactly six runtimes: `runtime-refusal.test.mjs` hard-codes `RUNTIMES = ['Claude','Codex','Cursor','Devin','OpenCode','Pi']` and asserts the row has six cells, so adding a Hermes column is a test edit, not a documentation edit. [SOURCE: .skilled/hooks/decision-capture/bin/runtime-refusal.test.mjs:10]
6. That test also accepts `unverified:` as a valid, reason-bearing terminal state, which is why an unverified cell can persist indefinitely: the guard checks form, never resolution. [SOURCE: .skilled/hooks/decision-capture/bin/runtime-refusal.test.mjs:14]
7. The documented state contract already names the probe folder as part of the queue's shape, so recording a Cursor probe result needs no new file kind and no new documentation page. [SOURCE: .skilled/skills/.state/decision-capture/README.md:36]
8. The test surface is now larger than the implementation it guards: 4,868 test lines over roughly 3,000 implementation lines, with 64 tests spread across the five sweep suites (23 transcript, 12 codex, 11 pi, 10 opencode, 8 devin), each suite re-asserting `chat_candidates` and queue behaviour for its own store. [SOURCE: .skilled/hooks/decision-capture/bin/sweep-transcript.test.mjs:1] [SOURCE: .skilled/hooks/decision-capture/bin/sweep-codex.test.mjs:1]
9. The process-question rule now exists in three places: the executable filter, the save instruction's prose, and the runtime-state README's prose description. Only the first can be tested, and the other two are the copies that drift. [SOURCE: .skilled/hooks/decision-capture/lib/capture-core.mjs:99] [SOURCE: .skilled/commands/speckit/save.md:72] [SOURCE: .skilled/skills/.state/decision-capture/README.md:23]
10. Every sweep resolves its own store location as well as its own shape, so the "five readers" are five store locators + five turn extractors + five record mappers, not five parsers of one format; the shared seams (`capture-core` for identity/append, `chat-questions` for pairing) already exist and are used by all five. [SOURCE: .skilled/hooks/decision-capture/bin/sweep-codex.mjs:122] [SOURCE: .skilled/hooks/decision-capture/bin/sweep-opencode.mjs:288]

## Questions Answered

- Which of the eight known gaps are worth closing, and the smallest change for each.
- Which gaps close by removing a surface instead of adding code.
- What each runtime exposes and whether the Cursor and Hermes rows are worth filling or deleting.
- What test coverage exists and which refactor collapses the most duplication.

## Gap verdicts

| Gap | Worth closing? | Smallest change | Delete / merge instead of adding |
|---|---|---|---|
| 1. Record only at save | Partly. Close it as *awareness*, not as a second writer: the record's `decided` sentence needs a model, so a hook writing rows would ship templated prose. | Put the pending count into the Claude Stop hook's existing autosave as a continuity field the next session already reads, so the answer cannot be lost silently. | Delete the ambition of a model-free cross-runtime record writer. |
| 2. Nudge on Claude and OpenCode only | Yes for Devin and Pi; no for Cursor and Hermes. | One `takeNudge` call each on Devin's next-turn surface and Pi's `before_agent_start`, both already used by the session-relaunch concern. | Delete any plan for a nudge on a runtime with no live adapter. |
| 3. Codex only at save | Yes — the trust reason is contradicted by the repo's own Codex hooks. | One `PostToolUse` entry in `.codex/hooks.json` plus a thin adapter importing `recoveredRecords` from `sweep-codex`, mirroring the Pi extension. | Merge: the adapter reuses the sweep's mapping; delete the matrix's "by-design" reason and the probe's "no project hook is registered" line. |
| 4. Cursor unverified, Hermes absent | Cursor: yes, once. Hermes: no. | Run the documented probe once for Cursor and record `probe/cursor.json`; the folder and the file kind already exist. | Delete the Hermes ambition, not the Hermes absence: keep six runtime columns and keep the test's `RUNTIMES` constant untouched. |
| 5. Pairing by model judgment | Partly. | Have the sweep print a ready `operatorDecisions` skeleton per candidate (key, question, options, answer, empty `decided`), so the model fills one sentence instead of re-deriving the entry shape. | Delete the entry field rules from `save.md` prose once the skeleton carries them. |
| 6. Keyword filter | Keep the code; delete two of three copies. | Surface the sweep's existing `chat_candidates_dropped` count and let `isProcessQuestion` be the only rule. | Delete the process-question sentence from `save.md` and the restatement in the runtime-state README, replacing both with a pointer to the filter. |
| 7. Claude exit nudge lost | Yes. | Carry the count into the autosave's continuity fields instead of a `systemMessage` written to a turn that has already ended. | Delete the exit-time `systemMessage` write and, with it, the need for a new project-level pending file. |
| 8. Codex and Pi sweeps exit 0 | Yes. | Add the same `try/catch → {error} + exit 1` wrapper the other three sweeps already use; better, extract it once and call it from all five. | Merge: one wrapper module replaces five copies of the same three-line pattern. |

## Maintainability verdict

- **One refactor collapses the most duplication:** define a turn contract (`sessionId`, ordered turns, recovered records) and make each sweep a store adapter that produces it. Pairing is already shared, so this is the last duplicated layer; it also removes the Codex/Pi function-name collision.
- **Delete, do not dedupe:** the OpenCode plugin's local `answerMap` (the Pi extension already imports its sweep's mapping), and the TypeScript duplicate of the queue row schema, replaced by one declaration both languages can read or generate.
- **Do not add:** a Hermes adapter, a cross-runtime record writer, a sixth prose branch in `save.md`, or a second process filter.
- **Test surface:** collapsing five turn extractors onto one contract turns 64 store-shaped sweep tests into per-store parser tests plus one shared behaviour suite, which is the same shape `runtime-refusal.test.mjs` already uses to assert the matrix once.

## Ruled Out

- **Adding a Hermes runtime column.** The matrix is pinned by a test constant, Hermes has no adapter and no probe, and adding the column would document an absence the repo has no plan to fill.
- **A model-free decision-record writer.** The record's `decided` sentence is the feature's product value; generating it from a template would fill `decision-record.md` with prose no reader can act on.

## Dead Ends

- Searching for a Cursor probe result: none exists, and no code path probes a runtime's question surface — the folder is populated by hand.

## Edge Cases

- Ambiguous input: whether gap 1 "should" close depends on whether templated `decided` prose is acceptable, which is a product call. Recorded as the boundary of the recommendation rather than decided.
- Contradictory evidence: the Codex matrix cell says the hook is absent by design while the probe says the hook was observed working; the trust explanation is the reconciling fact, and the repo's own Codex hooks are the counter-evidence.
- Missing dependencies: no Cursor runtime was exercised, so the Cursor verdict rests on the probe folder's contents, not on a Cursor session.
- Partial success: the gap-1 recommendation is a design judgement supported by the autosave path, not a tested write.

## Sources Consulted

- `.skilled/skills/.state/decision-capture/probe/{codex,devin,opencode,pi}.json`
- `.skilled/skills/.state/decision-capture/README.md`
- `.codex/hooks.json`
- `.skilled/hooks/decision-capture/bin/runtime-refusal.test.mjs`
- `.skilled/hooks/decision-capture/bin/*.test.mjs` (sizes and test counts)
- `.skilled/hooks/README.md` (coverage matrix)
- `.skilled/commands/speckit/save.md`

## Assessment

- New information ratio: 0.6
- Questions addressed: 1, 3, 4, 5
- Questions answered: 1, 3, 4, 5

## Reflection

- What worked and why: reading the probe folder last was the right order — it converted two "unknown" cells into one policy question and one unscheduled experiment, which is exactly the distinction the charter asked for.
- What did not work and why: no Cursor evidence could be gathered, because the repository has no Cursor probe and running one is a manual session outside a read-only research lineage.
- What I would do differently: check the test that pins the matrix earlier, since `RUNTIMES` being hard-coded reframes gap 4 from "documentation is incomplete" to "the guard fixes the shape at six".

## Recommended Next Focus

None — the charter's three questions are answered and the remaining work is implementation, which this read-only lineage must not perform.
