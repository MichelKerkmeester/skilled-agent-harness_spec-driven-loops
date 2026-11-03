---
title: "Research: decision capture gap closure and maintainability"
description: "Five-iteration fan-out research (three DeepSeek V4.1 Flash, two GPT-6 Luna) over the decision-capture feature: which known gaps are worth closing, the smallest change for each, and what to merge or delete instead of add."
trigger_phrases:
  - "decision capture gaps"
  - "decision capture maintainability"
importance_tier: "important"
contextType: "research"
---
# Research: decision capture gap closure and maintainability

<!-- ANCHOR:deep-research-decision-capture-gaps -->

## 1. Run Provenance

| Lineage | Executor | Iterations | newInfoRatio by iteration | Duration |
|---|---|---|---|---|
| `deepseek` | cli-pi, `deepseek-v4.1-flash-1017`, thinking max | 3 | 0.88, 0.80, 0.60 | 10 min |
| `luna` | cli-codex, `gpt-6-luna`, xhigh, fast tier | 2 | 0.42, 0.58 | 16 min |

Stop policy `max-iterations`: each lineage ran its full count, so the run ended at the cap, not at convergence. Both lineages exited 0 with no salvage and no timeout. The lineage iteration files are under `lineages/<label>/iterations/`; `fanout-attribution.md` maps the 42 merged findings to their lineage. The prior completed run is archived at `../research_archive/2026-11-02-pre-gaps/`.

Every claim below that carries weight was checked against the code after the run (section 9). Two lineage claims failed that check and are corrected there.

## 2. Executive Summary

The feature's shape is right and should not grow. Both lineages agree the architecture already has the shared seams it needs: one queue core owns identity, filtering, locking and the nudge cursor; one chat detector serves every reader; one writer owns the record; one matcher owns table matching. The five save-time readers parse five formats that other tools own, so merging them into one parser would move format knowledge without removing any.

Of the eight known gaps, four are worth closing and each is small: the silent read failure in the Codex and Pi sweeps, the missing nudge on Devin and Pi, answers orphaned by a session that never saved, and the undocumented Codex and Cursor matrix cells. Three are not worth closing as described: a live record writer, a Codex live hook, and a rewrite of the process filter. One needs a probe before any change: deterministic chat pairing.

The maintainability gains are deletions and reuse, not new layers: the OpenCode plugin should import its sweep's mapping the way Pi already does, `consumed.jsonl` should have one reader per language instead of three, and the save instruction should stop restating a filter the code already applies.

## 3. Gap-by-Gap Decision

| # | Gap | Worth closing? | Smallest change | Lineage agreement |
|---|---|---|---|---|
| 1 | Answers reach a record only when `/speckit:save` runs | No, by design | None to the writer. The save is where the packet is chosen and the decision sentence is rewritten; a live writer would write before either exists. | Both |
| 1b | A session that ends without a save orphans its answers | Yes | Have the save step run the existing `match-decision-table --scan-orphans` and list other sessions' pending answers. One line in `save.md`, no new code. | Orchestrator finding (section 9) |
| 2 | Nudge only on Claude and OpenCode | Yes, Devin and Pi | Call the existing `takeNudge` from the Devin Stop hook and a Pi lifecycle event, the way `session-stop.ts:105` does. No second cursor or queue. | Both |
| 3 | Codex captures only at save time | No | Keep the rollout sweep. A live hook would add a sixth adapter whose only gain is a live nudge, and the sweep already reads the same answers the probe showed the hook sees. | Split (see section 5) |
| 4 | Cursor unverified, Hermes absent | Documentation only | Add the missing `decision-capture` section to `.skilled/hooks/coverage-rationale.md` for the Codex and Cursor cells. Probe Cursor or Hermes only when an answered question event can be observed; register no adapter on a guessed surface. | Both |
| 5 | Chat pairing depends on the saving model | Probe first | Use the detector's existing turn ids to auto-accept a unique direct reply and leave shared replies pending, after one multi-question live case confirms the ids hold. No new classifier. | Both |
| 6 | Process questions filtered by keyword | No rewrite | The filter already reads header, option shape and permission wording, not keywords alone, and runs on chat candidates too. Delete the prose restatement in `save.md` instead. | Both on keeping the filter; DeepSeek on the deletion |
| 7 | Claude nudge at session exit is lost | Folded into 1b | The answer stays queued; the orphan listing at the next save reaches it. No exit-time redesign. | Orchestrator synthesis |
| 8 | Codex and Pi sweeps exit 0 silently on an unreadable transcript | Yes | Match the Claude and Devin convention: an explicitly named transcript that cannot be read prints `error` and exits 1; a readable empty transcript stays quiet. Needs an amendment to 003 NFR-R02. | Both |

## 4. Maintainability: Merge and Delete, Do Not Add

1. **OpenCode plugin mapping.** `.opencode/plugins/decision-capture.js:41` keeps its own `answerMap`, while the Pi extension imports `recoveredRecords` from its sweep so live and swept rows share one mapping. Make the OpenCode plugin import from `sweep-opencode.mjs` and delete `answerMap`. [SOURCE: .opencode/plugins/decision-capture.js:41] [SOURCE: .skilled/hooks/decision-capture/pi/decision-capture.ts:6]
2. **One consumed-log reader per language.** `consumed.jsonl` is read by `capture-core.mjs:338`, by `decision-record-writer.ts:752`, and by `match-decision-table.ts:204`, with a second filename constant at `match-decision-table.ts:38`. Keep the core's reader for the hooks and the writer's for the runtime; have the matcher CLI import the writer's path and reader. [SOURCE: .skilled/hooks/decision-capture/lib/capture-core.mjs:338] [SOURCE: .skilled/skills/system-spec-kit/runtime/lib/continuity/decision-record-writer.ts:752] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/continuity/match-decision-table.ts:204]
3. **One sweep CLI convention.** The five `main()` functions come in two shapes; aligning Codex and Pi with the other three (gap 8) leaves one. Two aligned branches do not justify a shared error framework.
4. **Prose copies of code rules.** The process-question rule exists as code (`capture-core.mjs:109`, applied to chat candidates at `chat-questions.mjs:97`) and again as prose in `save.md` and the state README. Only the code is tested; delete the prose rule and keep one sentence saying the sweeps already filter.
5. **Keep the five readers separate.** Each is a store locator, a turn extractor and a record mapper for a format another tool owns. The shared seams (`capture-core` for identity and append, `chat-questions` for pairing) are already used by all five. Codex and Pi share four function names with different bodies; that is naming, not duplication.

## 5. The Split: a Codex Live Hook

DeepSeek recommended adding one: the probe at `.skilled/skills/.state/decision-capture/probe/codex.json` records the hook seeing the answer, and `.codex/hooks.json` already registers project PostToolUse and Stop hooks, so a user who trusts the repo's hooks would run this one too. Luna recommended against it because the rollout sweep already captures at save time and hook trust stays a precondition.

Decision: do not add it. Both facts DeepSeek cites are true, but the hook would add a sixth adapter and a fourth live mapping to keep in step with the sweep, and its only gain is a live pending nudge. Without a save, neither path writes a record; with one, the sweep already finds every answer. The 006 Codex run passed on the sweep alone. The matrix cell's stated reason should change from "a project hook would need each user to trust it first" to that cost argument, recorded in `coverage-rationale.md`.

## 6. Ranked Recommendations

1. Gap 8: Codex and Pi sweeps report an unreadable named transcript (two small edits, two test changes, one spec amendment).
2. Gap 1b: the save step lists orphaned answers through the existing `--scan-orphans` (one `save.md` line).
3. Gap 2: Devin and Pi call `takeNudge` (two call sites).
4. Maintainability 1: the OpenCode plugin imports its sweep's mapping and drops `answerMap`.
5. Maintainability 2: the matcher CLI reuses the writer's consumed-log reader.
6. Gap 6 and maintainability 4: delete the prose restatements of the process filter.
7. Gap 4: write the `coverage-rationale.md` section for the Codex and Cursor cells.
8. Gap 5: one multi-question live case, then decide on auto-accepting unique replies.

## 7. Eliminated Alternatives

| Approach | Reason eliminated | Evidence | Lineage |
|---|---|---|---|
| Write decision records from each live adapter | The packet is chosen and the decision sentence rewritten only at save time | [SOURCE: .skilled/commands/speckit/save.md:64] [SOURCE: .skilled/hooks/decision-capture/lib/capture-core.mjs:305] | Both |
| Attach queued answers to the Claude Stop autosave | The autosave exists (`session-stop.ts:140`), but its payload would carry the raw answer, not a rewritten decision, which the goal requires | [SOURCE: .skilled/skills/system-spec-kit/runtime/hooks/claude/session-stop.ts:140] | DeepSeek proposed; rejected in synthesis |
| One parser for all five stored formats | The formats belong to five different tools; the normalized record is already the shared seam | [SOURCE: .skilled/hooks/decision-capture/lib/capture-core.mjs:129] | Both |
| A second chat or process classifier | The current predicate and turn ids are narrower; no observed error justifies another model | [SOURCE: .skilled/hooks/decision-capture/lib/chat-questions.mjs:81] | Both |
| Exact text equality instead of the matcher's scoring | Hand-written rows phrase the same decision differently | [SOURCE: .skilled/skills/system-spec-kit/runtime/lib/continuity/decision-table-matcher.ts:65] | DeepSeek |
| A model-free decision sentence | The rewritten sentence is the record's value | [SOURCE: .skilled/commands/speckit/save.md:70] | DeepSeek |
| A Codex live hook | See section 5 | [SOURCE: .skilled/skills/.state/decision-capture/probe/codex.json:8] | Split; rejected in synthesis |
| A Hermes column now | The matrix test pins six runtimes and Hermes has no adapter or probe; a column would record only "unknown" | [SOURCE: .skilled/hooks/decision-capture/bin/runtime-refusal.test.mjs:10] | DeepSeek |

## 8. Divergence Map

- Saturated directions: none. The run stopped at the iteration cap.
- Pivots: none taken, none failed, no audited overrides.
- Remaining frontier: the multi-question chat case (gap 5), a Cursor or Hermes answered-question probe (gap 4), and which visible Pi lifecycle event can carry a nudge (gap 2).

## 9. Verification Addendum (orchestrator, post-synthesis)

Checked against the code after the run:

| Claim | Result |
|---|---|
| OpenCode plugin keeps its own `answerMap` and imports nothing from its sweep | Confirmed: `.opencode/plugins/decision-capture.js:41`, no import of `sweep-opencode` |
| `consumed.jsonl` has three readers | Confirmed: `capture-core.mjs:338`, `decision-record-writer.ts:752`, `match-decision-table.ts:204` |
| Devin and Pi never call `takeNudge` | Confirmed: the only caller is `session-stop.ts:105` |
| Chat candidates pass through `isProcessQuestion` | Confirmed: `chat-questions.mjs:97` |
| The Claude Stop hook runs a context autosave | Confirmed: `session-stop.ts:140` |
| `.codex/hooks.json` already registers PostToolUse and Stop hooks | Confirmed in substance; DeepSeek's per-event counts were wrong (actual: SessionStart 2, UserPromptSubmit 3, PreToolUse 3, PostToolUse 3, Stop 2, PreCompact 1) |
| Tests outweigh the implementation (4,868 test lines over about 3,000) | Refuted: 3,824 test lines over 5,954 implementation lines across the hook files, adapters and plugin |
| Nothing surfaces orphaned answers | New finding: `--scan-orphans` exists in `match-decision-table.ts:401`, but no command or doc runs it |

## 10. Open Questions

1. Does a multi-question chat exchange keep turn ids unique enough to auto-accept a single reply? (gap 5)
2. Which Pi lifecycle event is visible to the operator and can carry a pending count? (gap 2)
3. Does Cursor or Hermes expose an answered-question event? (gap 4)

## 11. Convergence Report

- Stop reason: maxIterationsReached
- Total iterations: 5 (deepseek 3, luna 2)
- Questions answered: every strategy question in both lineages; three implementation-time probes remain (section 10)
- Last iteration summaries: deepseek run 3 runtime matrix and probes (0.60); luna run 1 coverage and save boundary (0.42); luna run 2 smallest changes and parser ownership (0.58)
- Convergence threshold: 0.05, reported as telemetry only under the `max-iterations` stop policy
- Divergence summary: no divergent pivots recorded

## 12. References

- Lineage reports: `lineages/deepseek/research.md`, `lineages/luna/research.md`
- Finding attribution: `fanout-attribution.md`
- Resource map: `resource-map.md`
- Prior research: `../research_archive/2026-11-02-pre-gaps/research.md`

<!-- /ANCHOR:deep-research-decision-capture-gaps -->
