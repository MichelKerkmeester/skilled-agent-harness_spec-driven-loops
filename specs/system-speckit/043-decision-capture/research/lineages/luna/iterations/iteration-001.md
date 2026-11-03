# Iteration 1: Runtime coverage and save boundary

## Focus
Verify the eight reported runtime and behavior gaps against current capture code, save instructions, the runtime matrix, and recorded live runs.

## Actions Taken
Read the shared queue and chat-question detector, the five runtime sweeps, the save command, nudge entry points, runtime coverage table, and the 006 live-run results. The index and packet context surfaced earlier research, so this pass checked executable paths and current run evidence directly.

## Findings
1. The decision record is intentionally save-bound: adapters and sweeps append normalized answers to the shared queue, while the save command selects the target packet and the full-auto writer upserts its record. This is not a missing capture adapter; bypassing save would write before packet choice is confirmed. Do not add live record writers. Improve how pending answers reach the operator and keep the queue plus central writer. [SOURCE: .skilled/hooks/decision-capture/lib/capture-core.mjs:305] [SOURCE: .skilled/commands/speckit/save.md:64] [SOURCE: .skilled/skills/system-spec-kit/feature-catalog/ux-hooks/operator-decision-capture.md:39]
2. The pending nudge is delivered by Claude Stop and the OpenCode plugin, while Devin and Pi have capture adapters without that nudge surface. The 006 record also confirms that Claude's async Stop message can be dropped when a session restarts before the next prompt, although the answer remains queued and a later Stop recounts it. Closing this is worthwhile. Reuse the existing pending-count helper at the next user-visible lifecycle point instead of adding another queue. [SOURCE: .skilled/skills/system-spec-kit/runtime/hooks/claude/session-stop.ts:101] [SOURCE: .opencode/plugins/decision-capture.js:105] [SOURCE: .skilled/hooks/decision-capture/lib/capture-core.mjs:361] [SOURCE: specs/system-speckit/043-decision-capture/006-live-conversation-test/decision-record.md:148]
3. Codex's save-time rollout reader is an intentional trust boundary, and the 006 results prove it captured and saved answers without a live project hook. Cursor remains explicitly unverified, and the six-runtime coverage table has no Hermes column. Do not add another Codex capture path. Add a Hermes status row and probe Cursor or Hermes only when an answered question-tool event can be observed; do not register an adapter on a guessed surface. [SOURCE: .skilled/hooks/README.md:271] [SOURCE: .skilled/commands/speckit/save.md:67] [SOURCE: .skilled/skills/system-spec-kit/benchmark/reports/2026-11-02--manual-testing-playbook--decision-capture-live-conversation/results.csv:7] [SOURCE: specs/system-speckit/043-decision-capture/006-live-conversation-test/implementation-summary.md:106]
4. Chat candidates already pair ordered assistant and user turns and carry both turn IDs, but save.md still asks the saving model to decide whether a candidate clearly replies, and several candidates may share one reply. The process filter also reads option labels and question context, so “keyword-only” overstates the implementation. Inference: use existing turn IDs for a unique candidate and leave a shared or ambiguous reply pending; keep the current filter and do not add a second classifier. A multi-question live case would confirm the remaining edge. [SOURCE: .skilled/hooks/decision-capture/lib/chat-questions.mjs:81] [SOURCE: .skilled/hooks/decision-capture/lib/chat-questions.mjs:158] [SOURCE: .skilled/commands/speckit/save.md:70] [SOURCE: .skilled/hooks/decision-capture/lib/capture-core.mjs:99] [SOURCE: specs/system-speckit/043-decision-capture/006-live-conversation-test/implementation-summary.md:103]
5. Codex and Pi treat an unreadable transcript like an empty result: each catches a read error as null and then exits 0 without output. Claude and Devin emit an error and exit nonzero. This is worth fixing because a save can look successful while missing answers. Reuse the existing error-result convention in the two sweeps and keep empty, readable sessions quiet. [SOURCE: .skilled/hooks/decision-capture/bin/sweep-codex.mjs:276] [SOURCE: .skilled/hooks/decision-capture/bin/sweep-codex.mjs:323] [SOURCE: .skilled/hooks/decision-capture/bin/sweep-pi.mjs:198] [SOURCE: .skilled/hooks/decision-capture/bin/sweep-pi.mjs:265] [SOURCE: .skilled/hooks/decision-capture/bin/sweep-transcript.mjs:284] [SOURCE: .skilled/hooks/decision-capture/bin/sweep-devin.mjs:285]
6. The handover says the Codex/Pi, OpenCode/Devin, chat-detection, and live-run work had not started, while the 006 implementation summary and current results record all five runtime runs as passing. This is a documentation conflict, not a missing implementation. Use the current run artifacts as evidence and refresh the stale handover through its normal owner later; do not repeat completed runtime work. [SOURCE: specs/system-speckit/043-decision-capture/handover.md:22] [SOURCE: specs/system-speckit/043-decision-capture/006-live-conversation-test/implementation-summary.md:43] [SOURCE: .skilled/skills/system-spec-kit/benchmark/reports/2026-11-02--manual-testing-playbook--decision-capture-live-conversation/results.csv:7]

## Questions Answered
- Which capture and save-time paths currently exist for each runtime, and where does each listed gap sit?
- Which gaps are confirmed by executable code or live-run evidence, and which are stale or unverified claims?

## Questions Remaining
- What is the smallest justified change for each confirmed gap, and what code can be merged or deleted?
- Which decisions can be paired or filtered deterministically without adding a new layer?
- Which storage readers can be consolidated without moving format ownership or losing failure reporting?

## Next Focus
Trace format parsing and shared normalization across the live adapters and five save-time readers. Check whether one existing normalized-turn boundary can absorb real duplication without hiding format-specific failures.

## Sources Consulted
- .skilled/hooks/decision-capture/lib/capture-core.mjs
- .skilled/hooks/decision-capture/lib/chat-questions.mjs
- .skilled/hooks/decision-capture/bin/sweep-codex.mjs
- .skilled/hooks/decision-capture/bin/sweep-pi.mjs
- .skilled/hooks/decision-capture/bin/sweep-transcript.mjs
- .skilled/hooks/decision-capture/bin/sweep-devin.mjs
- .skilled/commands/speckit/save.md
- .skilled/hooks/README.md
- .skilled/skills/system-spec-kit/feature-catalog/ux-hooks/operator-decision-capture.md
- .skilled/skills/system-spec-kit/runtime/hooks/claude/session-stop.ts
- .opencode/plugins/decision-capture.js
- specs/system-speckit/043-decision-capture/006-live-conversation-test/decision-record.md
- specs/system-speckit/043-decision-capture/006-live-conversation-test/implementation-summary.md
- .skilled/skills/system-spec-kit/benchmark/reports/2026-11-02--manual-testing-playbook--decision-capture-live-conversation/results.csv
- specs/system-speckit/043-decision-capture/handover.md

## Assessment
- newInfoRatio: 0.42
- Novelty justification: the prompt supplied the suspected gaps, so confirming them is partial novelty; the exact nudge drop, the ordered-turn IDs, the broader-than-keyword filter, the silent error paths, and the stale handover were newly verified here.
- Confidence: high for current code behavior and recorded 006 results; inferred for the narrowest safe chat-pairing change until a multi-question live case is examined.

## Reflection
- Direct code inspection separated confirmed defects from the intentionally save-bound design and from runtime claims that need probing.
- The runtime matrix and old handover disagree about current completion status; direct run results support the current implementation summary.

## Recommended Next Focus
Assess existing normalization reuse and parsing ownership, then turn each remaining behavior gap into a smallest-change recommendation with explicit code to retain, merge, or delete.

## SCOPE VIOLATIONS
- The YAML spec-seed and synthesis-writeback steps target the parent spec folder, outside this lineage's write authority. They were skipped. The resource-map emission was also disabled because its normal path can write outside this lineage. No out-of-scope write was performed.

## Workflow Conflicts
- The fan-out YAML normally skips phase_init and phase_main_loop after lineage dispatch. The user explicitly directed this process to run both phases inline, so that instruction was followed.
- The compiled sk-doc route returned defer because these are workflow-owned research artifacts. system-spec-kit explicitly exempts deep-research packet markdown from its authored-doc template gate, so the system-deep-loop output contract governs these files.
