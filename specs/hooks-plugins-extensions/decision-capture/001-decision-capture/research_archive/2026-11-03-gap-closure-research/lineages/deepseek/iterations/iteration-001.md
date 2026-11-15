# Iteration 1: Live capture surface and runtime matrix (gaps 2, 3, 4, 7)

## Focus

Map the live half of decision capture: which adapters exist, which runtime event each hooks, what the coverage matrix claims per runtime, where the pending-answer nudge is emitted, and how each save-time sweep reports an unreadable source. Gaps in scope: (2) nudge only on Claude and OpenCode, (3) Codex captures only at save time, (4) Cursor unverified and Hermes absent, (7) a Claude nudge at session exit is lost, (8) silent exit 0 from the Codex and Pi sweeps.

## Actions Taken

1. Enumerated `.skilled/hooks/decision-capture/` (adapters, sweeps, shared lib, fixtures, tests) and counted the producers.
2. Read `capture-core.mjs` end to end: key construction, process-question filter, lock/append, `takeNudge`.
3. Read the Claude adapter, the Devin adapter, the Pi extension and the OpenCode plugin to compare how each normalizes its runtime's payload.
4. Read the coverage matrix and the kill-switch index in `.skilled/hooks/README.md`, then checked `.skilled/hooks/coverage-rationale.md` for a `decision-capture` rationale section.
5. Read the Claude Stop hook's nudge function and its output path, plus the `.claude/settings.json` wiring for `Stop` and `PostToolUse`.
6. Compared the `main()` error paths of all five sweeps (codex, devin, opencode, pi, transcript).

## Findings

1. The live capture surface is **four** producers, not five: a Claude PostToolUse adapter, a Devin PostToolUse adapter, a Pi `tool_result` extension, and the OpenCode `tool.execute.after` plugin. There is no Cursor and no Hermes adapter folder in the tree. [SOURCE: .skilled/hooks/decision-capture/claude/ask-capture-posttooluse.mjs:51] [SOURCE: .skilled/hooks/decision-capture/devin/ask-capture-posttooluse.mjs:1] [SOURCE: .skilled/hooks/decision-capture/pi/decision-capture.ts:46] [SOURCE: .opencode/plugins/decision-capture.js:70]
2. All four producers funnel into one queue core that owns identity, the process-question filter, locking, dedup and the nudge cursor; the only per-runtime code is payload mapping. That is what makes the nudge gap cheap to close and hard to justify leaving open. [SOURCE: .skilled/hooks/decision-capture/lib/capture-core.mjs:305] [SOURCE: .skilled/hooks/decision-capture/lib/capture-core.mjs:361]
3. The pending-answer nudge exists on **two of six** runtimes. Claude emits it from the Stop hook, OpenCode from `experimental.chat.system.transform`; Devin and Pi capture answers but never report a pending count, Codex has no live producer at all, and Cursor/Hermes have no column or no adapter. [SOURCE: .skilled/skills/system-spec-kit/runtime/hooks/claude/session-stop.ts:96] [SOURCE: .opencode/plugins/decision-capture.js:104]
4. Gap 7 is a consumer problem, not a producer problem: the Claude nudge is written as a bare `{"systemMessage": ...}` to stdout **after** the Stop hook's own work resolves, and a Stop hook's output is read by the turn that just ended, so at a real session exit the line has no reader. [SOURCE: .skilled/skills/system-spec-kit/runtime/hooks/claude/session-stop.ts:651]
5. The nudge cursor is session-scoped on disk (`<hex-session>.nudge` beside `<hex-session>.jsonl`), so a next-session reader cannot see a prior session's pending count without scanning the queue directory. Any "nudge at session start instead of exit" fix must therefore add either a bounded scan or a project-level pointer file; the smallest version replaces the exit write with a project-level pending marker. [SOURCE: .skilled/hooks/decision-capture/lib/capture-core.mjs:246] [SOURCE: .skilled/hooks/decision-capture/lib/capture-core.mjs:238]
6. The coverage matrix has six runtime columns (Claude, Codex, Cursor, Devin, OpenCode, Pi): Hermes is absent, and the Cursor cell reads "unverified: no answered question tool call was found to probe" — an absence of evidence, recorded as a permanent state. [SOURCE: .skilled/hooks/README.md:271] [SOURCE: .skilled/hooks/README.md:275]
7. The matrix's own documentation contract is unmet for this row: the README points to `.skilled/hooks/coverage-rationale.md` for the reason behind each non-covered cell, and that file carries no `decision-capture` section at all. The Codex "by-design" and Cursor "unverified" cells are therefore the only two cells in the matrix with no recorded justification. [SOURCE: .skilled/hooks/README.md:269] [SOURCE: .skilled/hooks/coverage-rationale.md:44]
8. Gap 3 is a tooling-policy constraint, not an information constraint: the Codex rollout the save-time sweep reads contains the same answered tool calls a hook would see, so the Codex cell describes where the data is read from, not whether the data exists. [SOURCE: .skilled/hooks/decision-capture/bin/sweep-codex.mjs:284] [SOURCE: .skilled/hooks/README.md:275]
9. Gap 8 is a two-shape `main()` split, not five independent behaviours: `sweep-transcript`, `sweep-opencode` and `sweep-devin` wrap the sweep in try/catch and return 1 with an `{error}` row, while `sweep-codex` and `sweep-pi` return `null` from an unreadable transcript, which prints nothing and leaves the process at exit 0. [SOURCE: .skilled/hooks/decision-capture/bin/sweep-transcript.mjs:284] [SOURCE: .skilled/hooks/decision-capture/bin/sweep-devin.mjs:285] [SOURCE: .skilled/hooks/decision-capture/bin/sweep-codex.mjs:283] [SOURCE: .skilled/hooks/decision-capture/bin/sweep-pi.mjs:200]
10. Pi already demonstrates the merge that OpenCode has not taken: the Pi extension imports `recoveredRecords` from its own sweep so live and swept records share one mapping, while the OpenCode plugin re-implements that mapping locally in `answerMap`. [SOURCE: .skilled/hooks/decision-capture/pi/decision-capture.ts:6] [SOURCE: .skilled/hooks/decision-capture/pi/decision-capture.ts:85] [SOURCE: .opencode/plugins/decision-capture.js:41]

## Questions Answered

None fully. The runtime surface is now mapped, but the "worth filling versus worth deleting" judgment for the Cursor and Hermes rows needs the save-path evidence gathered in iteration 2.

## Questions Remaining

- Which of the eight known gaps are worth closing, and the smallest change for each.
- How many independent storage-format parsers exist, and which can be deleted or merged.
- Which gaps close by removing a surface rather than adding one.
- What test coverage guards the path, and which refactor collapses the most duplicated tests.

## Ruled Out

- **Treating gap 3 as a missing adapter.** Codex already receives the answers; what is missing is a live read, and the README attributes that to hook trust. Building a Codex hook would either require per-user trust or duplicate the rollout read inside the runtime, so the sweep is the correct shape and the "gap" is a documentation claim, not missing behavior.
- **Counting the pause/gate hooks as capture adapters.** They share the tree but write no queue rows.

## Dead Ends

- Reading `.skilled/hooks/coverage-rationale.md` for the Codex and Cursor rationale: the file has no `decision-capture` section, so the matrix's stated documentation contract cannot answer why those two cells are empty. Recorded as finding 7 instead of pursued.

## Edge Cases

- Ambiguous input: "five live adapters" in the charter does not match the tree's four producers. Chosen interpretation: count the four capture producers, and treat the OpenCode nudge surface as a fifth *surface* only if Cursor/Hermes adapters are later found. Recorded, not silently reconciled.
- Contradictory evidence: the matrix labels Codex "by-design" while the README's own rationale pointer is empty for the row. Preserved both claims; the absence of a rationale is the finding.
- Missing dependencies: none; all sources were local files.
- Partial success: the Claude session-exit loss was established from the output path and the Stop-hook contract, not from a live exit trace.

## Sources Consulted

- `.skilled/hooks/decision-capture/lib/capture-core.mjs`
- `.skilled/hooks/decision-capture/claude/ask-capture-posttooluse.mjs`
- `.skilled/hooks/decision-capture/devin/ask-capture-posttooluse.mjs`
- `.skilled/hooks/decision-capture/pi/decision-capture.ts`
- `.opencode/plugins/decision-capture.js`
- `.skilled/skills/system-spec-kit/runtime/hooks/claude/session-stop.ts`
- `.skilled/hooks/README.md`
- `.skilled/hooks/coverage-rationale.md`
- `.skilled/hooks/decision-capture/bin/sweep-{transcript,opencode,devin,codex,pi}.mjs`
- `.skilled/skills/system-spec-kit/feature-catalog/ux-hooks/operator-decision-capture.md`
- `.claude/settings.json` (Stop and PostToolUse wiring)

## Assessment

- New information ratio: 0.88
- Questions addressed: 2, 3, 4, 7, 8 (mechanism only)
- Questions answered: none fully

## Reflection

- What worked and why: reading the shared core before the adapters turned four files into one mechanism and exposed that the adapters hold only mapping code, which is what makes "add a nudge to Devin and Pi" a small change rather than an adapter rewrite.
- What did not work and why: looking for the Codex/Cursor rationale in `coverage-rationale.md` failed because the section does not exist; the failure is itself the evidence for finding 7.
- What I would do differently: check the sweeps' `main()` shapes together earlier, since the exit-code split was a two-line comparison once the files were opened side by side.

## Recommended Next Focus

The save half: how `/speckit:save` discovers the queue, which reader parses which owned store, where chat-answer pairing lives, whether the process-question filter is re-applied at save time, and what the writer/matcher duplicate.
