# Iteration 2: Smallest changes and parser ownership

## Focus
Resolve the remaining questions by assigning each gap a worth-it decision, its smallest evidence-backed change, and the code or abstraction that should remain absent. Trace parser ownership from live adapters and save-time sweeps through the queue, writer, matcher, and CLI.

## Actions Taken
Read every save-time sweep and its shared imports, the Pi extension's parser reuse, the process-question predicate, the runtime coverage matrix, save instructions, decision-record writer and matcher exports, their public API exports, the save pipeline, and the synthesis lifecycle. Re-read the lineage steer file before this iteration; it is absent.

## Findings
1. The decision record should remain save-bound because only save has selected and validated the destination packet. Closing this as an automatic live write is not worthwhile. Pending-answer delivery is worthwhile: Claude can reuse takeNudge at the next visible lifecycle point, while runtimes without a trusted notification hook can use the existing save-time pending output. Merge with the shared counter; do not add a record writer, queue, or nudge cursor. [SOURCE: .skilled/hooks/decision-capture/lib/capture-core.mjs:305] [SOURCE: .skilled/hooks/decision-capture/lib/capture-core.mjs:361] [SOURCE: .skilled/commands/speckit/save.md:64] [SOURCE: .skilled/skills/system-spec-kit/feature-catalog/ux-hooks/operator-decision-capture.md:43]
2. A Codex live adapter is not worth adding while hook trust is a precondition; its save-time rollout sweep is the smallest safe path. Closing matrix coverage is worthwhile as documentation: add Hermes to the existing matrix with an explicit unknown/unverified status, and keep Cursor unverified until an answered question-tool event is observed. Do not add adapters or a second runtime inventory. [SOURCE: .skilled/hooks/README.md:267] [SOURCE: .skilled/hooks/README.md:271] [SOURCE: .skilled/commands/speckit/save.md:67] [SOURCE: specs/system-speckit/spec-authoring-and-continuity/004-decision-capture/006-live-conversation-test/implementation-summary.md:106]
3. Reducing chat-pairing judgment is worthwhile because a wrong pair pollutes the decision record. The smallest candidate rule is to use the detector's existing ordered-turn IDs only for a unique direct reply and leave shared or ambiguous replies pending; a multi-question live case should confirm it before the save instructions change. The process-question concern is overstated: isProcessQuestion evaluates header, option shape, direct permission wording, and the question text. Keep that filter; add only a narrow rule after a demonstrated false positive or negative, and do not add a second classifier. [SOURCE: .skilled/hooks/decision-capture/lib/chat-questions.mjs:81] [SOURCE: .skilled/hooks/decision-capture/lib/chat-questions.mjs:158] [SOURCE: .skilled/hooks/decision-capture/lib/capture-core.mjs:87] [SOURCE: .skilled/hooks/decision-capture/lib/capture-core.mjs:109] [SOURCE: .skilled/commands/speckit/save.md:70]
4. Fixing the silent unreadable-transcript path is worthwhile. Codex and Pi should reuse the visible error and nonzero-exit convention in Claude and Devin, while readable empty transcripts remain quiet. Remove only the current null-to-success behavior; two aligned branches do not justify a new generic error framework. [SOURCE: .skilled/hooks/decision-capture/bin/sweep-codex.mjs:276] [SOURCE: .skilled/hooks/decision-capture/bin/sweep-codex.mjs:323] [SOURCE: .skilled/hooks/decision-capture/bin/sweep-pi.mjs:198] [SOURCE: .skilled/hooks/decision-capture/bin/sweep-pi.mjs:265] [SOURCE: .skilled/hooks/decision-capture/bin/sweep-transcript.mjs:284] [SOURCE: .skilled/hooks/decision-capture/bin/sweep-devin.mjs:285]
5. Consolidating runtime storage readers is not worthwhile: OpenCode SQLite, Codex rollouts, Devin sessions, Pi sessions, and Claude transcripts have distinct host-owned formats. The shared normalization, append queue, and chat detector already form the common boundary, and Pi live capture already imports the save reader's recoveredRecords. Keep the decision writer as the sole record upsert, the matcher library as the sole table parser/scorer, and the CLI as queue and consumed-key orchestration. Merge only duplicated policy/error behavior; add no cross-runtime parser or parallel writer/matcher. [SOURCE: .skilled/hooks/decision-capture/lib/capture-core.mjs:129] [SOURCE: .skilled/hooks/decision-capture/lib/capture-core.mjs:305] [SOURCE: .skilled/hooks/decision-capture/lib/chat-questions.mjs:81] [SOURCE: .skilled/hooks/decision-capture/pi/decision-capture.ts:5] [SOURCE: .skilled/hooks/decision-capture/pi/decision-capture.ts:85] [SOURCE: .skilled/skills/system-spec-kit/runtime/lib/continuity/decision-record-writer.ts:667] [SOURCE: .skilled/skills/system-spec-kit/runtime/lib/continuity/decision-table-matcher.ts:78] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/continuity/match-decision-table.ts:283] [SOURCE: .skilled/skills/system-spec-kit/runtime/api/index.ts:124]

## Questions Answered
- What is the smallest justified change for each confirmed gap, and what code can be merged or deleted?
- Which decisions can be paired or filtered deterministically without adding a new layer?
- Which storage readers can be consolidated without moving format ownership or losing failure reporting?

## Questions Remaining
- None for the requested scope. The multi-question pairing behavior and Cursor/Hermes event surfaces remain implementation-time probes, not prerequisites for these recommendations.

## Next Focus
Synthesize the two iterations into a gap-by-gap recommendation, preserve the trust and source-format boundaries, and report unresolved runtime probes as explicit uncertainty. The run is capped at two iterations, so record stopReason maxIterationsReached.

## Sources Consulted
- specs/system-speckit/spec-authoring-and-continuity/004-decision-capture/research/lineages/luna/steer.md (checked; absent)
- .skilled/hooks/decision-capture/lib/capture-core.mjs
- .skilled/hooks/decision-capture/lib/chat-questions.mjs
- .skilled/hooks/decision-capture/bin/sweep-codex.mjs
- .skilled/hooks/decision-capture/bin/sweep-pi.mjs
- .skilled/hooks/decision-capture/bin/sweep-transcript.mjs
- .skilled/hooks/decision-capture/bin/sweep-devin.mjs
- .skilled/hooks/decision-capture/bin/sweep-opencode.mjs
- .skilled/hooks/decision-capture/pi/decision-capture.ts
- .opencode/plugins/decision-capture.js
- .skilled/commands/speckit/save.md
- .skilled/hooks/README.md
- .skilled/skills/system-spec-kit/feature-catalog/ux-hooks/operator-decision-capture.md
- .skilled/skills/system-spec-kit/runtime/lib/continuity/decision-record-writer.ts
- .skilled/skills/system-spec-kit/runtime/lib/continuity/decision-table-matcher.ts
- .skilled/skills/system-spec-kit/runtime/cli/continuity/match-decision-table.ts
- .skilled/skills/system-spec-kit/runtime/api/index.ts
- .skilled/skills/system-spec-kit/runtime/cli/core/workflow.ts
- .skilled/commands/deep/assets/deep-research-auto.yaml
- .skilled/skills/system-deep-loop/runtime/scripts/synthesis-closeout.cjs

## Assessment
- newInfoRatio: 0.58
- Novelty justification: the second pass converted the confirmed gaps into scoped changes and verified where normalization, Pi parsing, record upsert, matching, and queue orchestration already have shared owners.
- Confidence: high for current parser and writer boundaries and the silent read-error behavior; medium for the proposed chat-pairing rule until a multi-question live case verifies it. Cursor and Hermes capabilities remain unknown until their event surfaces are observed.

## Reflection
The apparent duplication is mostly at host-owned input boundaries. Existing shared contracts already handle answer normalization, pending storage, and chat candidates, while the writer and matcher centralize persistence and matching. Recommendations stop at those boundaries instead of introducing a generic runtime parser.

## Recommended Next Focus
Finalize the synthesis with explicit worth-it, smallest-change, and merge/delete guidance for every reported gap; keep platform uncertainty visible.

## SCOPE VIOLATIONS
- None. This iteration wrote only to the lineage directory; parent spec writeback and resource-map emission remain disabled under the dispatch write limit.

## Workflow Conflicts
- The runner's per-iteration executor dispatch was treated as satisfied by this inline process as directed. The two-iteration max-iterations policy governs, even if convergence telemetry would otherwise suggest stopping.
