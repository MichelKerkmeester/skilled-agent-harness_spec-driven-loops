# Iteration 3: Axis 1b — Diff Streaming + Token/Cost Rendering Vocabulary

## Focus
Design the diff-streaming mechanism (incremental edit events) and the token/cost rendering vocabulary for the PWA, grounded in Pi's actual `--mode rpc` event vocabulary (the 041-003 pinned contract), Claude Code's cost vocabulary, and LSP's incremental-edit wire format.

## Findings

### F1. Pi `--mode rpc` already emits the raw transcript material (architecture-critical)
Fetch of the live Pi RPC docs ([SOURCE: https://pi.dev/docs/latest/rpc]) shows NDJSON event kinds on stdout:
- `message_update` carries `assistantMessageEvent` with delta types `text_start|text_delta|text_end`, `thinking_start|thinking_delta|thinking_end`, `toolcall_start|toolcall_delta|toolcall_end` — **extended thinking deltas and tool-call-argument deltas are already native**.
- `tool_execution_start|update|end` carry `toolCallId`, `toolName`, `args`, `partialResult`, `result`, `isError` — tool-call inputs and results are already streamed.
- `bash_execution_update` streams command output chunks tied to the originating `bash` command id.
- `queue_update` carries `steering` + `followUp` — this is the **native attention signal** (someone/something is waiting on input): the raw source for the axis-3 `needs_input` class.
- `turn_start|turn_end`, `message_start|end`, `agent_start|end|settled`, `compaction_start|end` (with `usage`), `auto_retry_*`, `summarization_retry_*`, `extension_error`, and `session_before_switch|fork` extension events.
Implication: 041-003's relay does not need to invent a transcript vocabulary — it must **classify, redact, and re-emit** these events as immutable epoch envelopes, plus add relay-level enrichments (diffs, usage chips, attention class, session meta). The reference product's stream-json vocabulary (iteration 2) is strictly poorer: no thinking deltas, no queue/attention events, no per-turn cost.

### F2. Claude Code's cost vocabulary — the bar for usage rendering
- `/usage` (`/cost`): current-session total estimated cost, duration, code changes, per-model input/output/cache-token usage; dollar figure is a local estimate, Console is authoritative ([SOURCE: code.claude.com/docs/en/costs]).
- `session-report` plugin: explorable HTML report with tokens, cache efficiency, subagents, skills, most-expensive prompts ([SOURCE: claude.com/plugins/session-report]).
- OTel metrics `claude_code.cost.usage`, `claude_code.token.usage` segmented by user/model/skill/plugin/agent ([SOURCE: code.claude.com/docs/en/monitoring-usage]).
- Implication: everything is end-of-session or post-hoc; **nobody streams per-message cost**. Pi's own footer already shows live input/output/cache tokens, cost, context usage, and model ([SOURCE: pi.dev/docs/latest/usage]) — Pi is closer to streaming usage than the reference.

### F3. Diff wire format: LSP incremental edits beat diff-match-patch
- LSP `textDocument/didChange` incremental sync: full-file snapshot on open/reconnect, then `{uri, version, edits:[{range, text}]}` range-replacements applied in order against the prior version; version gaps force resync ([SOURCE: github.com/microsoft/language-server-protocol/blob/gh-pages/_specifications/lsp/3.18/specification.md]).
- diff-match-patch is best-effort/fuzzy — wrong for deterministic sync; hybrid: LSP-style range edits live, unified diff derived for display/audit ([SOURCE: github.com/google/diff-match-patch/wiki/API]).

## Design: Axis 1b deliverables

### Diff streaming (`transcript.tool.diff` refinement)
- Relay derives per-file edit streams from `tool_execution_*` events of file-edit tools (Edit/Write/ApplyPatch), using the tool's own args (path, old/new or patch) to produce deterministic LSP-style range edits: `{pathWs, version, edits:[{range:{start:{line,char},end:{line,char}}, text}]}`.
- PWA keeps a per-file document snapshot; applies edits in order; on `epochFloor`/snapshot barrier (003) or reconnect it requests a full snapshot instead of blending (005 REQ-002 semantics).
- Unified diff is rendered from the snapshot for the "review changes" view; hunks stream in as edits arrive.
- Redaction: paths are workspace-relative (`ws-<opaque>:...`); ranges/text may contain secrets → policy-masked lines render as `[redacted]` with count, and the digest chain still covers the true bytes host-side (006).

### Usage vocabulary (`transcript.usage`)
- Emit at `turn_end` boundaries: `{model, tokens:{input, output, cacheRead, cacheWrite, thinking}, cost:{amount, currency}, context:{percentUsed, window}}`, sourced from Pi's per-turn usage (same data as the live footer; authoritative local estimate, labeled as estimate — matching the reference's honesty bar).
- Attribution: `{turnId, toolCallId?}` so the PWA can attribute cost to a tool call or message; session aggregates derive a budget ring + per-message chips + per-session total + a "most expensive turn" card (borrowed from session-report, but live).
- Privacy: usage metadata contains no transcript content — safe to persist durably and include in redacted envelopes.

## Sources Consulted
- [SOURCE: https://pi.dev/docs/latest/rpc] (fetched)
- [SOURCE: https://pi.dev/docs/latest/usage]
- [SOURCE: https://code.claude.com/docs/en/costs]
- [SOURCE: https://claude.com/plugins/session-report]
- [SOURCE: https://code.claude.com/docs/en/monitoring-usage]
- [SOURCE: https://github.com/microsoft/language-server-protocol/blob/gh-pages/_specifications/lsp/3.18/specification.md]
- [SOURCE: https://github.com/google/diff-match-patch/wiki/API]

## Assessment
- newInfoRatio: 0.85
- Novelty justification: Pi's native RPC event vocabulary is new and load-bearing (thinking deltas + queue_update already exist natively); the LSP-range diff mapping and per-turn usage vocabulary are new design.
- Confidence: high on RPC docs (fetched); design mappings are proposals to validate against the relay implementation.

## Reflection
- What worked: fetching the actual Pi RPC docs instead of assuming the 041-003 framing contract — the relay's job is classification/redaction, not vocabulary invention.
- What failed / ruled out: diff-match-patch as the live wire format (fuzzy application breaks deterministic sync — LSP range edits win); per-message cost events from the reference (doesn't exist — Pi's footer model already exceeds it).
- Ruled out: emitting raw `tool_execution_start` args unredacted across the boundary (direct 004/006 violation).

## Recommended Next Focus
Axis 2: low-friction phone approval — reduce friction vs foreground-only reauth + separate exact-action card while keeping canonical-digest exact-action binding; prior art: 1Password/Banking push approvals, Duo, GitHub Mobile merge approval, Claude Code permission prompts.
