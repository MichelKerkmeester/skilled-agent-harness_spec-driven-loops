# Research: closing operator decision-capture gaps without adding layers

## 1. Executive Summary

Keep the current capture pipeline: runtime adapters normalize answers into a shared queue, then `/speckit:save` chooses the packet and the central writer persists decisions. Immediate record writes would run before destination selection and create duplicate or misplaced records. The real work is narrower: make pending-answer nudges reach a visible lifecycle point, make unreadable Codex and Pi transcripts fail visibly, and reduce chat-pairing ambiguity only where existing turn IDs support a unique match. [SOURCE: .skilled/hooks/decision-capture/lib/capture-core.mjs:129,305,361] [SOURCE: .skilled/commands/speckit/save.md:61-73] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/core/workflow.ts:731-743]

Do not build a universal reader for host-owned formats. The source inventory identifies four live runtime adapters (Claude, Pi, OpenCode, Devin), five save-time sweeps, and Codex as intentionally save-time; it does not support the premise of five live adapters. The sweeps already share answer normalization, queue writes, and chat pairing, and Pi live capture reuses the Pi sweep parser. Keep those boundaries and the existing record writer, matcher, and CLI roles. [SOURCE: .skilled/skills/system-spec-kit/feature-catalog/ux-hooks/operator-decision-capture.md:55-68] [SOURCE: .skilled/hooks/README.md:271-275] [SOURCE: .skilled/hooks/decision-capture/pi/decision-capture.ts:5-6,85-88]

## 2. Scope and Method

This is read-only research on the eight reported behavior gaps and the maintainability concern. Two inline iterations inspected the shared queue and normalizer, runtime adapters, five save-time readers, save instructions, runtime matrix, record writer, table matcher, CLI, and recorded 006 live-run evidence. No product code was changed and no tests were run. The workflow artifacts and this synthesis are confined to this lineage. [SOURCE: specs/system-speckit/spec-authoring-and-continuity/004-decision-capture/research/lineages/luna/iterations/iteration-001.md] [SOURCE: specs/system-speckit/spec-authoring-and-continuity/004-decision-capture/research/lineages/luna/iterations/iteration-002.md]

The handover's claim that later runtime and chat work had not started conflicts with the 006 implementation summary and the current benchmark rows, which record five runtime scenarios as passing. Treat the handover as stale; use the current run evidence and refresh that packet document through its owner later rather than repeating completed runs. [SOURCE: specs/system-speckit/spec-authoring-and-continuity/004-decision-capture/handover.md:22] [SOURCE: specs/system-speckit/spec-authoring-and-continuity/004-decision-capture/006-live-conversation-test/implementation-summary.md:43,103,106] [SOURCE: .skilled/skills/system-spec-kit/benchmark/reports/2026-11-02--manual-testing-playbook--decision-capture-live-conversation/results.csv:7-12]

## 3. Current Capture and Save Architecture

A live adapter or save-time sweep feeds runtime-specific question and answer data into `normalizeAskUserQuestion`. The normalized record is appended idempotently to the locked session queue. Every save-time sweep also emits the same pending-answer and chat-candidate shape. The save workflow validates the target packet, then asks its session model to select decisions; full-auto persistence calls `writeDecisionRecord` and records consumed source keys. [SOURCE: .skilled/hooks/decision-capture/lib/capture-core.mjs:129-179,305-329] [SOURCE: .skilled/commands/speckit/save.md:61-73] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/core/workflow.ts:733-743]

This separates capture from destination selection. Queueing an answer is reversible and packet-neutral; writing a record is not packet-neutral because the decision belongs to the packet selected at save time. The record should therefore remain save-bound. [SOURCE: .skilled/skills/system-spec-kit/feature-catalog/ux-hooks/operator-decision-capture.md:39-41]

## 4. Runtime Coverage and the Adapter Count

The current matrix has six columns: Claude, Codex, Cursor, Devin, OpenCode, and Pi. Claude, Devin, OpenCode, and Pi have live capture coverage; Codex is explicitly `by-design` at save time because a project hook requires user trust; Cursor remains unverified because no answered question-tool call was found. Hermes is missing from the matrix. The feature catalog likewise lists four live adapters and five save-time sweep readers. [SOURCE: .skilled/hooks/README.md:267-275] [SOURCE: .skilled/skills/system-spec-kit/feature-catalog/ux-hooks/operator-decision-capture.md:55-68]

Add Hermes to the existing matrix as unknown or unverified. Keep Cursor unverified until a real answered-question event is observable. This closes a documentation gap without implying support or registering an adapter against a guessed event surface. [SOURCE: .skilled/hooks/README.md:267-275]

## 5. Save-Bound Records Are Intentional

**Worth closing:** No. Answers already reach the shared queue; the missing step is that a record is written only after `/speckit:save` chooses its destination. That is a deliberate ownership boundary, not a missing capture adapter. [SOURCE: .skilled/hooks/decision-capture/lib/capture-core.mjs:305-329] [SOURCE: .skilled/commands/speckit/save.md:61-73]

**Smallest justified change:** None to persistence. Improve pending-answer delivery separately, then preserve the central save writer.

**Merge or delete:** Do not add per-runtime live record writers or a second persistence queue. Keep the normalized queue and the single writer/upsert path. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/core/workflow.ts:68,733-743]

## 6. Pending-Answer Nudges

The Claude Stop hook and OpenCode plugin are the proactive nudge surfaces. `takeNudge` already shares the pending-count cursor, and save-time sweeps print pending answers. The 006 record shows a Claude exit-time message can be lost if the session ends before another prompt; the answer itself remains queued and a later nudge can report it. [SOURCE: .skilled/skills/system-spec-kit/runtime/hooks/claude/session-stop.ts:101-107] [SOURCE: .opencode/plugins/decision-capture.js:105-115] [SOURCE: .skilled/hooks/decision-capture/lib/capture-core.mjs:351-384] [SOURCE: .skilled/commands/speckit/save.md:64-67] [SOURCE: specs/system-speckit/spec-authoring-and-continuity/004-decision-capture/006-live-conversation-test/decision-record.md:148-150]

**Worth closing:** Yes, for runtimes where a trusted, user-visible lifecycle point exists. For Claude, report the count at the next reachable prompt or session lifecycle point rather than relying only on an exit message. For Devin and Pi, reuse the shared helper if their current lifecycle can display a nudge. For Codex, retain save-time collection and use its existing pending output; do not require a project hook that users have not trusted.

**Smallest justified change:** Call the existing nudge helper from an already registered, visible event where supported. Keep save output as the fallback for runtimes without that event.

**Merge or delete:** Reuse the existing queue and nudge cursor. Do not add another queue, count file, or runtime-specific nudge implementation. The exact Devin/Pi notification event remains an implementation-time capability check.

## 7. Codex, Cursor, and Hermes

Codex already recovers answers from its stored rollout at save time, and the 006 implementation summary records this as the trust-safe path. The available live-run rows cover five runtimes, not Hermes; Cursor remains unverified. [SOURCE: .skilled/hooks/README.md:271-275] [SOURCE: .skilled/commands/speckit/save.md:67] [SOURCE: specs/system-speckit/spec-authoring-and-continuity/004-decision-capture/006-live-conversation-test/implementation-summary.md:106] [SOURCE: .skilled/skills/system-spec-kit/benchmark/reports/2026-11-02--manual-testing-playbook--decision-capture-live-conversation/results.csv:7-12]

**Worth closing:** Do not close the Codex live-hook gap while hook trust is required. Close the Hermes matrix omission as a coverage-recording task. Probe Cursor and Hermes only after an answered question event is observed.

**Smallest justified change:** Add one Hermes status cell to the current matrix, and document the evidence required before changing either runtime's status.

**Merge or delete:** Keep the existing Codex sweep. Do not add a second runtime matrix or speculative Cursor/Hermes adapters.

## 8. Chat-Answer Pairing

The shared chat detector pairs ordered assistant and user turns and preserves turn IDs. The save instructions still ask the saving model to decide which candidate the answer “clearly replies to,” and they acknowledge that one reply can be associated with several questions. The exact safe pairing behavior is therefore not fully proven by current artifacts. [SOURCE: .skilled/hooks/decision-capture/lib/chat-questions.mjs:81-145,158-206] [SOURCE: .skilled/commands/speckit/save.md:70-73] [SOURCE: specs/system-speckit/spec-authoring-and-continuity/004-decision-capture/006-live-conversation-test/implementation-summary.md:103]

**Worth closing:** Yes, cautiously; an incorrect association pollutes a durable decision record.

**Smallest justified change:** First capture a multi-question live case. If the existing turn IDs show one unique direct answer, use that pair; leave a shared or ambiguous reply pending. Change the save instruction only after that case confirms the rule.

**Merge or delete:** Reuse the existing candidate metadata. Do not add a second classifier or broader semantic matching layer. This recommendation is an inference; the multi-question live case would confirm it.

## 9. Process-Question Filtering

The reported “keyword filter” description is incomplete. `isProcessQuestion` checks header and question text, option shapes for Gate 3/scope and workspace choices, and direct commit/push permission wording. It can distinguish a process menu from a product question that merely mentions a gate or commit. [SOURCE: .skilled/hooks/decision-capture/lib/capture-core.mjs:87-120]

**Worth closing:** No broad redesign is justified by the evidence. The current filter already uses structured signals available in the runtime payload.

**Smallest justified change:** If a false positive or negative is demonstrated, add a narrow rule to the current predicate and a focused fixture. No new code is justified from the current evidence alone.

**Merge or delete:** Keep the existing predicate. Do not add a classifier, policy registry, or post-save filtering pass.

## 10. Unreadable Transcript Errors

Codex and Pi catch transcript read errors as `null`, then return without an error and exit successfully. Claude and Devin report the error and exit nonzero. A readable but empty transcript is a separate successful result and should remain quiet. [SOURCE: .skilled/hooks/decision-capture/bin/sweep-codex.mjs:276-281,323-333] [SOURCE: .skilled/hooks/decision-capture/bin/sweep-pi.mjs:198-204,265-275] [SOURCE: .skilled/hooks/decision-capture/bin/sweep-transcript.mjs:284-293] [SOURCE: .skilled/hooks/decision-capture/bin/sweep-devin.mjs:285-294]

**Worth closing:** Yes. A failed read should not look like a successful empty sweep.

**Smallest justified change:** Use the existing visible-error and nonzero-exit convention in the Codex and Pi read-failure branches. Preserve silence for readable empty sessions.

**Merge or delete:** Remove the silent null-to-success path. Two branches do not justify a new generic error framework.

## 11. Maintainability: Preserve Format Ownership

The five save-time readers access different host-owned representations: OpenCode SQLite, Codex rollout files, Devin session data, Pi session files, and Claude transcripts. Their parsing is not a single repeated storage format that can be replaced by one useful parser. The common pipeline already provides `normalizeAskUserQuestion`, `appendRecords`, and `chatCandidatesFromTurns`. Pi's live extension imports `recoveredRecords` from the Pi sweep, so that parser is already shared across its live and save paths. [SOURCE: .skilled/hooks/decision-capture/bin/sweep-opencode.mjs:28-37,113-130] [SOURCE: .skilled/hooks/decision-capture/bin/sweep-codex.mjs:26-31,208,287-293] [SOURCE: .skilled/hooks/decision-capture/bin/sweep-devin.mjs:23-32,136,203-213] [SOURCE: .skilled/hooks/decision-capture/bin/sweep-pi.mjs:77-80,129-132,206-215] [SOURCE: .skilled/hooks/decision-capture/bin/sweep-transcript.mjs:29-34,52-58] [SOURCE: .skilled/hooks/decision-capture/pi/decision-capture.ts:5-6,85-88]

**Worth closing:** Not by merging the five readers. Keep each host-format parser close to its storage owner and converge only at the existing normalized queue boundary.

**Smallest justified change:** Continue using the shared normalizer, append function, and chat detector; share an individual parser only when live and save code read the same format, as Pi already does.

**Merge or delete:** Do not delete format-specific sweeps or add a universal parser. The premise of five live adapters is not supported by the current inventory: it lists four live adapters, five sweeps, and Codex as save-time by design. [SOURCE: .skilled/skills/system-spec-kit/feature-catalog/ux-hooks/operator-decision-capture.md:55-68] [SOURCE: .skilled/hooks/README.md:271-275]

## Eliminated Alternatives

| Approach | Reason Eliminated | Evidence | Iteration(s) |
|---|---|---|---|
| Write decision records directly from each live adapter | The destination packet is selected and validated during save; immediate writers would duplicate or misroute persistence. | Shared pending queue and save-selected target [SOURCE: .skilled/hooks/decision-capture/lib/capture-core.mjs:305-329] [SOURCE: .skilled/commands/speckit/save.md:61-73] | 1–2 |
| Add a project-trusted Codex hook | Codex's rollout sweep already captures at save, while the matrix explicitly says a live hook needs user trust. | [SOURCE: .skilled/hooks/README.md:271] [SOURCE: .skilled/commands/speckit/save.md:67] | 1–2 |
| Build one parser for all five saved runtime formats | The stores have different owners and schemas; the current common normalized record is the appropriate shared seam. | [SOURCE: .skilled/skills/system-spec-kit/feature-catalog/ux-hooks/operator-decision-capture.md:60-68] [SOURCE: .skilled/hooks/decision-capture/lib/capture-core.mjs:129-179] | 2 |
| Add another chat classifier or process-question layer | Existing turn IDs and the current header/options predicate provide narrower reuse; no demonstrated error justifies another model. | [SOURCE: .skilled/hooks/decision-capture/lib/chat-questions.mjs:81-145] [SOURCE: .skilled/hooks/decision-capture/lib/capture-core.mjs:87-120] | 1–2 |
| Rerun completed runtime scenarios to resolve the stale handover | Current 006 artifacts and benchmark rows record the five existing scenarios as passing; the contradiction is documentary. | [SOURCE: specs/system-speckit/spec-authoring-and-continuity/004-decision-capture/006-live-conversation-test/implementation-summary.md:43,106] [SOURCE: .skilled/skills/system-spec-kit/benchmark/reports/2026-11-02--manual-testing-playbook--decision-capture-live-conversation/results.csv:7-12] | 1 |

## Divergence Map

- Saturated directions: none recorded.
- Completed or failed pivots: none.
- Audited overrides: none.
- Remaining frontier: confirm the unique-pair rule with a multi-question chat case; verify whether Cursor or Hermes exposes an answered-question event; identify a visible Devin/Pi lifecycle point if proactive nudges are required.

## 12. Open Questions

The five strategy questions are answered. Three implementation-time probes remain open: whether current chat turn IDs make the proposed unique-pair rule reliable in a multi-question exchange; whether Cursor or Hermes exposes a usable answered-question event; and which visible lifecycle event, if any, Devin and Pi can use for pending nudges. These uncertainties do not change the recommendation to avoid guessed adapters or new classifiers.

## 13. Gap-by-Gap Decision Table

| Reported gap | Worth closing? | Smallest justified change | Merge, delete, or retain |
|---|---|---|---|
| Answers reach a record only at `/speckit:save` | No; this is the destination-selection boundary. | Keep normalized answers pending until save selects a packet. | Retain the shared queue and central writer; add no live writer. |
| Pending nudge absent on Devin, Codex, and Pi | Yes, selectively. | Reuse the existing nudge count at a visible event where supported; retain save-time pending output as fallback. | Merge into `takeNudge`; add no second cursor or queue. |
| Codex capture only at save time | No, while hook trust is required. | Keep reading the stored rollout during save. | Retain the existing Codex sweep; do not add a live hook. |
| Cursor unverified; Hermes missing from matrix | Yes for matrix completeness; runtime probing only after an observed event. | Add Hermes to the current matrix as unknown/unverified; keep Cursor unverified. | Merge status into the existing matrix; add no speculative adapters. |
| Chat pairing depends on save model judgment | Yes, after a focused live case. | Use existing IDs for one unique direct answer; leave shared/ambiguous replies pending. | Reuse the current detector; do not add a classifier. |
| Gate 3/spec-folder/branch questions filtered by keyword | No broad rewrite; the description is overstated. | Add a narrow rule only after a demonstrated false result. | Retain the current header/options predicate; no second filter. |
| Claude exit-time nudge can be lost | Yes. | Deliver through the next reachable visible lifecycle point. | Reuse the current pending counter; remove reliance on exit-only delivery. |
| Codex/Pi unreadable transcript exits 0 silently | Yes. | Match Claude/Devin's visible error and nonzero exit for read failures. | Remove silent null success; keep readable empty output quiet. |
| Five live adapters and five readers duplicate formats | No universal consolidation; the live-adapter count is not supported by the inventory. | Keep five format-specific sweeps and shared normalized output; Pi already shares its reader. | Retain host parsers, shared normalizer/queue/chat detector, one writer, one matcher, and a thin CLI. |

## 14. Writer, Matcher, and CLI Responsibilities

The save pipeline calls `writeDecisionRecord` for upsert behavior and records consumed keys. The public runtime API exports that writer. Separately, the matcher library owns decision-table parsing and scoring; the CLI imports those functions, reads the queue and consumed log, and records matched rows when `--apply` is requested. These are distinct jobs, not duplicated implementations. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/core/workflow.ts:68,733-743] [SOURCE: .skilled/skills/system-spec-kit/runtime/api/index.ts:124-130] [SOURCE: .skilled/skills/system-spec-kit/runtime/lib/continuity/decision-record-writer.ts:667,782] [SOURCE: .skilled/skills/system-spec-kit/runtime/lib/continuity/decision-table-matcher.ts:78,144] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/continuity/match-decision-table.ts:22-30,283-298]

Keep this separation. Do not combine the Markdown writer with table matching or move queue orchestration into a second matcher. If a later change finds duplicated rules, keep the rule in its current shared owner and make adapters or CLI callers thin.

## 15. Evidence and Implementation Handoff

The five-runtime manual run results are useful evidence that the common capture and save paths work in the tested scenarios. They do not cover Hermes, an observed Cursor answered-question event, unreadable transcript failures, or the proposed ambiguous multi-question rule. Those need focused verification when implementation work is authorized. [SOURCE: .skilled/skills/system-spec-kit/benchmark/reports/2026-11-02--manual-testing-playbook--decision-capture-live-conversation/results.csv:7-12] [SOURCE: specs/system-speckit/spec-authoring-and-continuity/004-decision-capture/006-live-conversation-test/implementation-summary.md:103,106]

Implement the Codex/Pi read-error alignment first because the mismatch is confirmed. Then move Claude's nudge to a reachable lifecycle point and add Devin/Pi nudges only where an existing trusted event can surface them. Update the matrix with Hermes status. Validate the chat rule with a multi-question case before changing save instructions. Leave the process filter and source readers alone unless evidence shows a real failure.

## 16. Convergence and Workflow Notes

The run reached its configured cap of two iterations. The recorded information ratios were 0.42 and 0.58 (mean 0.50), and the reducer marked all five key questions answered. Because the stop policy is `max-iterations`, the terminal stop reason is `maxIterationsReached`; convergence before the cap was not used to stop early. [SOURCE: specs/system-speckit/spec-authoring-and-continuity/004-decision-capture/research/lineages/luna/deep-research-state.jsonl] [SOURCE: specs/system-speckit/spec-authoring-and-continuity/004-decision-capture/research/lineages/luna/findings-registry.json]

Parent spec writeback and resource-map emission were skipped because the dispatcher limited writes to this lineage. No tests or product-code edits were made. The stale handover was recorded as a documentation conflict; this synthesis uses the current implementation summary and run rows. [SOURCE: specs/system-speckit/spec-authoring-and-continuity/004-decision-capture/research/lineages/luna/iterations/iteration-001.md] [SOURCE: specs/system-speckit/spec-authoring-and-continuity/004-decision-capture/research/lineages/luna/iterations/iteration-002.md]

## 17. Proposed Implementation Phases

1. **Make recovery failures visible.** Change Codex and Pi sweeps so an unreadable transcript returns a visible error and nonzero exit, matching Claude and Devin. Preserve the silent readable-empty case.
2. **Deliver nudges at a reachable event.** Move Claude's notification away from exit-only delivery and reuse the shared pending-count helper. Add Devin/Pi delivery only at an existing trusted, user-visible event. Let Codex retain save-time reporting.
3. **Close the coverage table.** Add Hermes to the existing runtime matrix with an unknown/unverified status. Change Cursor or Hermes implementation status only after an answered-question event is observed.
4. **Verify chat pairing before changing policy.** Capture a multi-question exchange and inspect the existing turn IDs. If they isolate one direct answer, use that pair; keep ambiguity pending. Update the save prompt only after evidence supports this rule.
5. **Preserve the current architecture.** Keep host-specific sweeps, shared normalized queue, central writer, matcher library, and thin CLI. Do not add a universal storage parser or another classification layer.
