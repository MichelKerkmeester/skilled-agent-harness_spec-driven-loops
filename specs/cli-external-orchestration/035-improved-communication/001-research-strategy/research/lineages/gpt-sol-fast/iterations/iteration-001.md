# Iteration 1: Integration Boundaries and Normalized Events

## Focus

This iteration established the safest documented display integration boundary for Claude CLI, Codex CLI, Pi CLI, OpenCode CLI, Devin CLI, and Cursor CLI, then derived a provider-neutral event envelope. “Safest” means that the projector observes canonical runtime state and owns only a separate display projection; it does not rewrite model-visible context, tool inputs/results, or persisted transcripts. Sources were accessed on 2026-08-11. Version-specific schemas remain capabilities to pin and test rather than stable cross-runtime assumptions.

## Actions Taken

1. Read the detached lineage controls, strategy, registry, phase capability snapshot, and read-only `claudish-to-english` reference.
2. Checked official Claude Code, Codex, OpenCode, Devin, and Cursor documentation for lifecycle, event, cancellation, and client-integration surfaces.
3. Recovered Pi evidence from the repository’s raw extension documentation after the GitHub HTML rendering failed.
4. Compared the six surfaces and derived the smallest common event model that preserves canonical payloads while allowing a replaceable display projection.

## Findings

1. **Claude CLI has the narrowest native display-only boundary.** Claude Code documents `MessageDisplay` as firing while assistant text is displayed and explicitly places it outside the agentic lifecycle as display-only. The reference confirms a chunk contract containing `session_id`, `message_id`, `index`, `final`, `delta`, and `transcript_path`; therefore a Claude adapter can assemble projection text without changing canonical context, but it must commit only after the final chunk and retain the original for exact fallback. [SOURCE: https://code.claude.com/docs/en/hooks] [SOURCE: specs/cli-external-orchestration/042-improved-communication/context/claudish-to-english-main/rewrite.sh:89]

2. **Codex’s safest arbitrary-rendering boundary is an App Server client, not a lifecycle hook.** App Server is the documented rich-client interface and exposes version-generated schemas, thread/turn/item identity, `item/started`, `item/completed`, `item/agentMessage/delta`, a terminal `turn/completed`, and `turn/interrupt`. A projector can therefore maintain a read-only mirror keyed by thread, turn, and item while cancellation remains a runtime command rather than a synthetic display event. [SOURCE: https://learn.chatgpt.com/docs/app-server]

3. **Pi offers a native extension rendering boundary, but extension event mutation must be kept out of the canonical lane.** Pi documents custom rendering for tool calls, results, and messages, plus `message_start/update/end` and tool execution start/update/end events. It also permits a `message_end` handler to replace the finalized message; that capability is unsafe for a display-only projector because the replacement participates in Pi’s message lifecycle. Use custom rendering/UI for projection and treat message replacement as out of scope. [SOURCE: https://raw.githubusercontent.com/earendil-works/pi/main/packages/coding-agent/docs/extensions.md]

4. **OpenCode’s server/SSE boundary is the portable choice.** The official server is the same client/server architecture used by the TUI, publishes OpenAPI 3.1, exposes canonical session messages and child sessions, streams bus events over `/event` or `/global/event`, and provides `/session/:id/abort`. A separate server/SDK client can project events without depending on undocumented TUI replacement behavior. [SOURCE: https://opencode.ai/docs/server/]

5. **Devin confirms an ACP process boundary but not a Devin-specific update schema on the consulted command page.** `devin acp` is documented as a non-interactive stdio JSON-RPC server for ACP-aware hosts. This supports a separate renderer process, but field-level mapping, completion, ancestry, and cancellation must be capability-tested against the pinned Devin/ACP version rather than copied from Cursor. [SOURCE: https://docs.devin.ai/cli/reference/commands] [INFERENCE: based on Devin documenting only the ACP transport boundary while the attempted shared session-update page was unavailable]

6. **Cursor confirms the complete ACP client loop needed for projection.** Cursor documents newline-delimited JSON-RPC over stdio, `session/new` or `session/load`, streamed `session/update`, blocking `session/request_permission`, optional `session/cancel`, and a terminal prompt result with `stopReason`. Its extensions also expose task identity and cancellation-like todo states, so the adapter must preserve both ACP core and Cursor extension events rather than flattening everything into text. [SOURCE: https://cursor.com/docs/cli/acp]

7. **The common architecture is an immutable event mirror plus a replaceable projection, not a universal hook.** Normalize every runtime event into `{runtime, runtimeVersion, sessionId, turnId, messageId, itemId, partId, toolCallId, parentId, kind, phase, sequence, sourceTimestamp, canonicalPayloadRef, terminalStatus, eventId}`. Keep text deltas, tool inputs/results, approvals, and extension payloads as typed canonical references; store rewritten prose only under a separate `projection` object with its provider, model, policy, validation result, and fallback reason. Missing native fields remain `null` with a capability-confidence tag; adapters must not invent ancestry or order. [INFERENCE: based on the identity/lifecycle fields documented by Codex App Server, OpenCode SSE/session APIs, Cursor ACP, Pi events, and Claude MessageDisplay]

8. **Atomic commitment requires two independent orders and an explicit terminal state.** `sourceSequence` records runtime arrival order; `assemblySequence` records projector assembly order. Deduplicate on stable runtime event identity when available and otherwise on an adapter-scoped event ID plus canonical payload hash. Only `completed` may replace the original; `cancelled`, `interrupted`, `error`, timeout, missing completion, duplicate conflict, or validation failure renders the exact canonical original. This corrects the reference’s replace mode, which suppresses non-final chunks before rewrite validation and buffers under raw session/message-derived paths. [SOURCE: specs/cli-external-orchestration/042-improved-communication/context/claudish-to-english-main/rewrite.sh:102] [SOURCE: specs/cli-external-orchestration/042-improved-communication/context/claudish-to-english-main/rewrite.sh:109] [INFERENCE: based on Codex terminal statuses, Cursor cancellation/stopReason, OpenCode abort, and the reference’s pre-final suppression]

## Ruled Out

- A single universal lifecycle hook: the six runtimes expose materially different boundaries; only Claude confirms a dedicated presentation-only hook. [SOURCE: https://code.claude.com/docs/en/hooks] [SOURCE: https://opencode.ai/docs/server/]
- Reusing Cursor’s ACP field mapping unchanged for Devin: both expose ACP, but the consulted Devin source confirms transport rather than identical update payloads. [SOURCE: https://docs.devin.ai/cli/reference/commands] [SOURCE: https://cursor.com/docs/cli/acp]
- Pi finalized-message replacement as the projector: the documented handler can replace the lifecycle message, violating the immutable-canonical-lane requirement. [SOURCE: https://raw.githubusercontent.com/earendil-works/pi/main/packages/coding-agent/docs/extensions.md]

## Dead Ends

- The GitHub HTML view of Pi’s extension documentation failed to render content; the raw repository URL supplied the primary document instead.
- `https://agentclientprotocol.com/protocol/session-updates` returned 404. No claims depend on that unavailable page; shared ACP semantics beyond the runtime-specific documentation remain unconfirmed.
- A narrow grep over the captured Claude web response exceeded the tool record limit. The official page’s directly returned lifecycle table and the local reference supplied the used evidence.

## Edge Cases

- Ambiguous input: “safest boundary” could mean least code, deepest native integration, or strongest state isolation. This iteration selected strongest canonical-state isolation and deferred implementation cost comparisons.
- Contradictory evidence: none. The phase matrix and independently consulted primary sources aligned, with the Devin field-level caveat narrowed rather than smoothed over.
- Missing dependencies: the shared ACP session-update URL was unavailable. Runtime-specific Cursor and Devin documentation was used, and cross-runtime ACP payload equivalence remains unsupported.
- Partial success: one Pi source route and the shared ACP route failed, and the Claude capture grep was unusable. Alternative primary sources still established at least one supported boundary for all six runtimes, so status is `complete` with explicit version caveats.

## Sources Consulted

- [Claude Code hooks reference](https://code.claude.com/docs/en/hooks), accessed 2026-08-11.
- [Codex App Server](https://learn.chatgpt.com/docs/app-server), accessed 2026-08-11.
- [Pi extensions raw documentation](https://raw.githubusercontent.com/earendil-works/pi/main/packages/coding-agent/docs/extensions.md), accessed 2026-08-11.
- [OpenCode server documentation](https://opencode.ai/docs/server/), last-updated marker 2026-08-09 and accessed 2026-08-11.
- [Devin CLI commands](https://docs.devin.ai/cli/reference/commands), accessed 2026-08-11.
- [Cursor CLI ACP](https://cursor.com/docs/cli/acp), accessed 2026-08-11.
- `specs/cli-external-orchestration/042-improved-communication/001-research-strategy/plan.md:264`.
- `specs/cli-external-orchestration/042-improved-communication/context/claudish-to-english-main/rewrite.sh:89`.

## Assessment

- New information ratio: 0.69 (3 fully new findings and 5 partially new findings across 8 total; `(3 + 0.5 × 5) / 8 = 0.6875`, rounded).
- Questions addressed: safest integration boundary in all six CLIs; normalized events without canonical-state mutation.
- Questions answered: key question 1 at architecture-selection level, with version-pinned field mapping still required for implementation.

## Reflection

- What worked and why: runtime-owned client protocols exposed identity, lifecycle, cancellation, and terminal states more completely than hooks, while Claude’s dedicated display hook provided the useful narrow exception.
- What did not work and why: broad rendered pages produced oversized captures, and one assumed ACP documentation route did not exist. Raw primary documents and runtime-specific pages were more reliable.
- What I would do differently: fetch version-pinned schemas or source definitions directly for every adapter and build a field-by-field capability matrix before discussing assembly algorithms.

## Questions Answered

- What is the safest primary-source-supported display integration boundary in each CLI? Claude `MessageDisplay`; Codex App Server; Pi custom rendering/UI; OpenCode server/SDK event client; Devin ACP client with schema probing; Cursor ACP client.
- How should events normalize without mutating canonical state? Through an immutable typed event mirror and a separately validated, atomic display projection.

## Questions Remaining

1. How should assembly implement streaming, ordering, duplication, concurrency, cancellation, timeout, retry, and atomic commit against version-pinned event fixtures?
2. Which deterministic protected-span and semantic fidelity gates reject unsafe rewrites and return the exact original?
3. How should privacy-aware provider routing cover OpenCode Go DeepSeek V4 Flash and local providers?
4. Which observability and perceptual-parity evaluation gates make the architecture testable?
5. Which exact Devin ACP and Claude MessageDisplay fields vary by installed version?

## Recommended Next Focus

Create a version-aware assembly state machine from representative event fixtures for the six adapters. Resolve duplicate/reordered deltas, concurrent tools, cancellation, timeout, retry, and missing completion before researching rewrite providers.
