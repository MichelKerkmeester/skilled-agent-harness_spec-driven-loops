---
title: Operator decision capture - gap closure and maintainability research
description: Per-gap verdicts for the eight known decision-capture gaps, the smallest change for each, the deletion and merge surface that keeps the feature from growing, and the evidence behind every claim.
trigger_phrases:
  - "decision capture gaps"
  - "operator decision capture research"
  - "decision capture maintainability"
  - "runtime coverage matrix decision capture"
  - "pending answer nudge"
contextType: research
version: 1.0.0
---

# Operator decision capture: gap closure and maintainability

Read-only research lineage `deepseek` over `specs/system-speckit/spec-authoring-and-continuity/004-decision-capture`. Three iterations, 31 findings, five key questions resolved. Stop reason: `maxIterationsReached`.

## 1. METADATA

| Field | Value |
|---|---|
| Spec folder | `specs/system-speckit/spec-authoring-and-continuity/004-decision-capture` |
| Lineage artifact dir | `specs/system-speckit/spec-authoring-and-continuity/004-decision-capture/research/lineages/deepseek` |
| Session | `fanout-deepseek-1793639912371-mz7z8d` |
| Executor | `cli-pi`, model `deepseek-v4.1-flash-1017` |
| Iterations | 3 of 3 (`stopPolicy: max-iterations`) |
| Findings | 31 |
| Key questions | 5 answered of 5 |
| Write scope | lineage directory only; no code was modified |

## 2. INVESTIGATION REPORT

Scope: the live capture half (`.skilled/hooks/decision-capture/`, `.opencode/plugins/decision-capture.js`) and the save half (`decision-record-writer.ts`, `decision-table-matcher.ts`, `match-decision-table.ts`, `/speckit:save`), plus the runtime coverage matrix that advertises both.

Method: read the shared core before its adapters, the save instruction before its writer, and the runtime probe records before judging any matrix cell. Every claim below carries a `[SOURCE: path:line]` anchor into the repository as it stands.

## 3. EXECUTIVE OVERVIEW

- The feature has **four** live capture producers, not five: Claude, Devin, Pi and the OpenCode plugin. All four funnel into one queue core, so per-runtime code is payload mapping only.
- The nudge exists on **two of six** runtimes. Three gaps (2, 7, 8) close with one call or one wrapper each, because the shared core already exports what they need.
- The Codex gap is not a capability gap. The probe records the hook as observed working and attributes the missing adapter to per-user trust, while `.codex/hooks.json` already registers three `PostToolUse` and four `Stop` commands — the repository already asks Codex users to trust its hooks.
- The Cursor gap is an unscheduled experiment: four runtimes have a probe record and Cursor has none. The matrix is test-pinned to exactly six runtimes, and the guard accepts `unverified:` as a terminal state, so nothing forces resolution.
- The maintainability problem is not five parsers of one format. It is **five store locators plus five turn extractors**, a queue schema declared twice in two languages, a consumed log read by three implementations, and a test surface larger than the implementation it guards (4,868 test lines, 64 sweep tests).
- The single refactor that collapses the most: define one turn contract (`sessionId`, ordered turns, recovered records) and make each sweep a store adapter that produces it. Pairing is already shared, so this is the last duplicated layer.

## 4. CORE ARCHITECTURE

```text
runtime event ──► adapter (claude | devin | pi | opencode plugin)
                        │ payload mapping only
                        ▼
             capture-core: identity, process filter, lock, dedup, nudge cursor
                        │  .skilled/skills/.state/decision-capture/<hex>.jsonl
                        ▼
/speckit:save ──► sweep-* (5 store readers) ──► chat-questions (shared pairing)
                        │
                        ▼
       model authors operatorDecisions ──► normalizer ──► workflow routing
                        │
                        ▼
   match-decision-table (answer gate + weighted score) ─┐
                       decision-record-writer ◄─────────┘
                        │  operator-decisions + operator-answers-verbatim anchors
                        └► consumed.jsonl
```

The nudge is a side channel on that diagram: `takeNudge` is called by the Claude Stop hook and by the OpenCode plugin and by nothing else.

## 5. TECHNICAL SPECIFICATIONS - the eight gaps

| # | Gap | Worth closing | Smallest change | Delete or merge instead of adding |
|---|---|---|---|---|
| 1 | Answers reach a record only at `/speckit:save` | Partly: close it as *awareness*, not as a second writer. The record's `decided` sentence needs a model, so a hook writing rows would ship templated prose. | Carry the pending count in the Claude Stop hook's existing autosave as continuity the next session already reads. | Delete the ambition of a model-free cross-runtime writer. |
| 2 | Nudge on Claude and OpenCode only | Yes for Devin and Pi; no for Cursor or Hermes. | One `takeNudge` call each on Devin's next-turn surface and Pi's `before_agent_start`. | Do not build a nudge for a runtime with no live adapter. |
| 3 | Codex captures only at save | Yes: the trust reason is contradicted by the repo's own Codex hooks. | One `PostToolUse` entry in `.codex/hooks.json` plus a thin adapter importing `recoveredRecords` from `sweep-codex`, mirroring the Pi extension. | Merge the adapter onto the sweep's mapping; delete the matrix's "by-design" cell and the probe's "no project hook is registered" line. |
| 4 | Cursor unverified, Hermes absent | Cursor once; Hermes no. | Run the documented probe once for Cursor and record `probe/cursor.json`; the folder and file kind already exist. | Delete the Hermes ambition, keep the six-column matrix and its test constant untouched. |
| 5 | Chat pairing by model judgment | Partly. | Have the sweep print a ready `operatorDecisions` skeleton per candidate (key, question, options, answer, empty `decided`). | Delete the entry field rules from `save.md` prose once the skeleton carries them. |
| 6 | Process questions filtered by keyword | Keep the code, delete two of three copies. | Surface the sweep's existing `chat_candidates_dropped` count so a dropped candidate is visible. | Delete the process-question sentence from `save.md` and the restatement in the runtime-state README. |
| 7 | Claude exit nudge is lost | Yes. | Move the count into the autosave's continuity instead of a `systemMessage` written to a turn that already ended. | Delete the exit-time write and the need for a project-level pending file. |
| 8 | Codex and Pi sweeps exit 0 on unreadable input | Yes. | Add the `try/catch → {error} + exit 1` wrapper the other three sweeps already use. | Merge: one wrapper module replaces five copies of the same three-line pattern. |

## 6. CONSTRAINTS AND LIMITATIONS

- Read-only lineage: no fix was implemented and no test was run beyond reading.
- No Cursor runtime was exercised, so the Cursor verdict rests on the probe folder's contents.
- The gap-1 recommendation is a design judgement supported by the existing autosave path, not a tested write.
- Line-level claims about `decision-record-writer.ts` rest on its exported signatures and declared constants rather than a full line-by-line read.

## 7. INTEGRATION PATTERNS

- **Live capture** runs inside a host hook and must fail open: every adapter exits 0 on a bad payload, a disabled switch or a queue write failure.
- **Save-time reading** runs inside the saving model's turn and is allowed to fail loudly: three sweeps return exit 1 with an `{error}` row.
- **Record writing** is a `--full-auto` save only, routed per packet by the save pipeline and validated by the input normalizer.
- **Matrix advertising** is a README table guarded by one test that fixes the runtime list and accepts a reason-bearing non-covered state.

## 8. IMPLEMENTATION GUIDE (ordered, smallest first)

1. Gap 8: one shared sweep-entry wrapper; Codex and Pi join the other three.
2. Gap 2: two `takeNudge` calls (Devin, Pi) reusing the exported cursor.
3. Gap 3: one Codex `PostToolUse` entry plus an adapter that imports the sweep's mapping.
4. Gap 7: move the nudge from the ending turn into the autosave's continuity fields.
5. Gap 6: delete the two prose copies of the process filter and print the dropped count.
6. Gap 5: print an `operatorDecisions` skeleton per candidate.
7. Gap 4: one Cursor probe recorded under `probe/`.
8. Gap 1: judge whether a templated `decided` sentence is acceptable before building anything.

## 9. CODE EXAMPLES AND SNIPPETS

Queue row identity, shared by every producer:

```js
toolSourceKey(runtime, sessionId, toolUseId, questionIndex)
// [runtime, sessionId, toolUseId, questionIndex].map(keyPart).join(':')
```

The seam the maintainability refactor would formalise (already shipped in Pi):

```ts
import { recoveredRecords } from '../../.skilled/hooks/decision-capture/bin/sweep-pi.mjs';
const records = recoveredRecords(lines, sessionId, new Date().toISOString())
  .map((record) => ({ ...record, source: 'hook' }));
```

The nudge cursor every new runtime surface can call without new code:

```js
const count = takeNudge(projectDir, sessionId); // reports a count once, per session
```

## 10. TESTING AND DEBUGGING

- Coverage today: 15 test files, 4,868 lines; 64 tests spread over five sweep suites (23 transcript, 12 codex, 11 pi, 10 opencode, 8 devin), each re-asserting `chat_candidates` and queue behaviour for its own store.
- The matrix itself is tested once, by `runtime-refusal.test.mjs`, which is the right shape: assert the contract once rather than per runtime.
- The asymmetry that hid gap 8: a clean Codex or Pi sweep prints nothing, and so does a failed read, so no test could distinguish them without an exit code.

## 11. PERFORMANCE OPTIMIZATION

Not measured and not in scope. The capture path is one JSONL append under a lock; the save path opens one store read-only. No finding in this lineage supports a performance change, and none should be made on suspicion.

## 12. SECURITY CONSIDERATIONS

- The queue holds verbatim operator wording; it is git-ignored and only its README is tracked.
- `SYSTEM_DECISION_CAPTURE_DISABLED=1` is the single kill switch for every live producer.
- Capture fails open by design, so a broken queue can never block a tool result. That same property is why the sweeps, which run at save time, are the place a read failure must be loud.

## 13. FUTURE-PROOFING AND MAINTENANCE

- Keep the six-column matrix; do not add Hermes without an adapter and a probe.
- Make the turn contract the extension point: a new runtime should add a store adapter, not a sixth sweep, a sixth prose branch and a sixth test suite.
- One declaration of the queue row schema, consumed by both the capture core and the TypeScript CLI.
- Delete the OpenCode plugin's local `answerMap` in favour of the sweep's mapping, the pattern Pi already uses.

## 14. API REFERENCE

| Surface | Contract |
|---|---|
| `normalizeAskUserQuestion({runtime, sessionId, toolUseId, toolInput, toolResponse, source, now})` | Returns normalized queue records; empty on an unreadable payload. |
| `appendRecords(projectDir, sessionId, records)` | Deduplicated, locked append; returns `{appended, skipped}`. |
| `pendingRecords(projectDir, sessionId)` | Queue rows minus consumed keys. |
| `takeNudge(projectDir, sessionId)` | Pending count, reported once per increase; writes the per-session cursor. |
| `isProcessQuestion({question, header, options})` | True for Gate 3, spec-folder, worktree, branch and commit/push process questions. |
| `chatCandidatesFromTurns(...)` | Shared chat-candidate detector used by every sweep. |
| `matchRecords(records, rows, consumedLines, opts)` | Answer-gated, weighted table match; threshold 0.4 plus a tie margin. |
| `writeDecisionRecord(...)` / `recordConsumedKeys(...)` | Row and appendix upsert plus the consumed-key log. |

## 15. TROUBLESHOOTING GUIDE

| Symptom | Cause | Check |
|---|---|---|
| No nudge on Devin or Pi | No runtime surface calls `takeNudge` there | Only two call sites exist |
| Save offers no answers on Codex or Pi | The sweep printed nothing | Exit code is 0 in both the empty and the unreadable case |
| A process question landed in a record | The prose rule drifted from the code rule | Which copy the run actually used |
| A record entry lost its `Q` id | The row was written by hand and matched by text | The `<!-- source: KEY -->` line under the heading |
| Same answer recorded twice | Consumed key missing after a partial save | `consumed.jsonl` for that key |

## 16. ACKNOWLEDGEMENTS

Evidence base: this lineage's three iteration files and 31 delta findings.

## 17. RECOMMENDATIONS

Close gaps 8, 2, 3 and 7 first, because each is one call or one wrapper against a seam that already exists. Then delete the two prose copies of the process filter (gap 6) and print the candidate skeleton (gap 5). Treat the Cursor probe (gap 4) as one scheduled manual session and Hermes as out of scope. Decide the gap-1 product question before writing code: a deterministic `decided` sentence would close it at a quality cost the record cannot absorb.

## Eliminated Alternatives

| Approach | Reason Eliminated | Evidence | Iteration(s) |
|---|---|---|---|
| Treat gap 3 as a missing Codex adapter | The rollout already carries the answers; the hook works when trusted, and trust is already asked for other concerns | `probe/codex.json`, `.codex/hooks.json` | 1, 3 |
| Count gate/pause hooks as capture adapters | They share the hooks tree but write no queue rows | `capture-core.mjs` | 1 |
| Make the live adapter write a decision record directly | A hook runs before a bound packet exists and before the operator agrees the `decided` sentence | `save.md`, `normalizeAskUserQuestion` | 2 |
| Replace the matcher scoring with exact text equality | The scorer exists because hand-written rows phrase the same decision differently | `decision-table-matcher.ts` | 2 |
| Add a Hermes runtime column | The matrix is test-pinned to six; Hermes has no adapter and no probe | `runtime-refusal.test.mjs` | 3 |
| A model-free decision-record writer | The `decided` sentence is the product value; a template fills the record with prose no reader can act on | `save.md`, `decision-record-writer.ts` | 3 |
| Probe Cursor inside this research run | Read-only lineage with no Cursor session; the probe is a manual live session | `.skilled/skills/.state/decision-capture/probe/` | 3 |

## Divergence Map

- Saturated directions: none. `stopPolicy: max-iterations` ended the run at the cap, not at convergence; the ratio trend was 0.88 → 0.80 → 0.60, falling but not converged.
- Completed pivots: 0. Failed pivots: 0. Audited overrides: 0.
- Remaining frontier, deliberately left open: the Cursor probe (a manual live session), and the gap-1 product decision (is a templated `decided` sentence acceptable?).

## Open Questions

None tracked by this lineage's strategy remain open. Two boundaries are named above rather than answered: the Cursor probe (an experiment, not a finding) and the gap-1 product call (a decision, not a research question).

## References

- `.skilled/hooks/decision-capture/lib/capture-core.mjs` - identity keys, process filter, queue, lock, nudge cursor.
- `.skilled/hooks/decision-capture/lib/chat-questions.mjs` - shared chat-candidate detector.
- `.skilled/hooks/decision-capture/{claude,devin}/ask-capture-posttooluse.mjs`, `pi/decision-capture.ts`, `.opencode/plugins/decision-capture.js` - the four live producers.
- `.skilled/hooks/decision-capture/bin/sweep-{transcript,opencode,devin,codex,pi}.mjs` - the five save-time readers.
- `.skilled/hooks/README.md` - coverage matrix and kill-switch index.
- `.skilled/hooks/coverage-rationale.md` - per-concern rationale, missing this concern.
- `.codex/hooks.json` - the repository's existing Codex hook registrations.
- `.skilled/skills/.state/decision-capture/README.md` and `probe/*.json` - the queue contract and the four runtime probes.
- `.skilled/commands/speckit/save.md` - the save-side prose contract.
- `.skilled/skills/system-spec-kit/runtime/lib/continuity/decision-record-writer.ts`, `decision-table-matcher.ts` - the writer and the matcher.
- `.skilled/skills/system-spec-kit/runtime/cli/continuity/match-decision-table.ts` - the matcher CLI.
- `.skilled/skills/system-spec-kit/runtime/hooks/claude/session-stop.ts` - the Claude nudge and the autosave.
- `.skilled/skills/system-spec-kit/feature-catalog/ux-hooks/operator-decision-capture.md` - the catalog entry.
- Resource map: `specs/system-speckit/spec-authoring-and-continuity/004-decision-capture/research/lineages/deepseek/resource-map.md`.
- Iteration trail: `iterations/iteration-001.md`, `iteration-002.md`, `iteration-003.md`; deltas in `deltas/`.

## Convergence Report

- Stop reason: maxIterationsReached
- Total iterations: 3
- Questions answered: 5 / 5
- Remaining questions: 0
- Last 3 iteration summaries: run 1 survey of the live capture surface and matrix (0.88); run 2 the save path, pairing and parse duplication (0.80); run 3 per-gap verdicts, probe evidence and the deletion surface (0.60)
- Convergence threshold: 0.05 (telemetry only under `max-iterations`)
- Divergence summary: no divergent pivots recorded
