# Deep Research Synthesis: Portable CLI Communication Projection (deepseek-go lineage)

Lineage: deepseek-go | executor: cli-opencode / opencode-go/deepseek-v4-flash | session: fanout-deepseek-go-1786433150940-mdbr01 | stop: max-iterations (7/7)

## 1. Executive Summary

The claudish-to-english reference proves whole-message rewriting with a local model can make assistant output noticeably easier to read, but it depends on assumptions that do not hold across six evolving CLIs or arbitrary hosted/local providers: Claude's `MessageDisplay`, one Ollama protocol, serialized chunk delivery, filesystem-safe identifiers, and prompt obedience without a deterministic fidelity validator. This lineage establishes, with primary-source evidence:

1. **A six-CLI boundary taxonomy**: native-replacement runtimes (Claude `MessageDisplay`/`displayContent`; Pi `message_end`/`renderCall`/`renderResult`) vs pipeline-owner runtimes (Codex App Server, OpenCode server/SSE, Devin ACP, Cursor ACP). ACP is a shared adapter family across Devin, Cursor, and OpenCode.
2. **A normalized event/message envelope** (`{runtime, sessionId, messageId, eventType, index, final, delta, parts[], sequence}`) that is projection-input only — never a write-back — preserving canonical transcript, model context, tool events, and streaming.
3. **A confirmed provider record shape**: protocol family per model (Go is protocol-heterogeneous), base URL, auth, model, cost, dated privacy class, capability flags, discovery endpoint, explicit fallback policy. OpenCode Go DeepSeek V4 Flash = OpenAI-compatible Chat Completions at `https://opencode.ai/zen/go/v1/chat/completions`; Ollama = `ollama-native` with `/api/show` discovery; llama.cpp = probe-gated OpenAI-compatible.
4. **An objective fidelity contract**: opaque protected-span substitution before inference, deterministic machine rejection gates (SC-003), exact-original fallback, and a display swap that is naturally atomic in pipeline-owner runtimes.
5. **A five-child downstream phase map** with dependencies, handoffs, gates, and rollback boundaries.

Confirmed facts are distinguished from inferences throughout; dated facts (DeepSeek V4 Flash ZDR expires 2026-08-31) are flagged for re-probe.

## 2. Reference Reverse Engineering (Iteration 1)

The reference plugin (`specs/cli-external-orchestration/042-improved-communication/context/claudish-to-english-main/`) is a Claude Code plugin, version 0.1.1, that rewrites assistant messages into plain English using a local Ollama model, display-only.

- Hook registration: `MessageDisplay` → `rewrite.sh` with 60s timeout (`hooks/hooks.json:3`); `PostToolUse` (`Write|Edit`) → `rewrite-md.sh` with 180s timeout (`hooks/hooks.json:14`).
- Chunk model: Claude fires `MessageDisplay` once per streamed chunk; each fire is a separate process carrying `.message_id`, `.index`, `.final`, `.delta` (non-cumulative text fragment). The hook buffers each delta to `$mdir/<index>.part` (`rewrite.sh:102-106`) and calls the LLM only on the final chunk (`rewrite.sh:117`).
- Context: the last real user message from `.transcript_path`, truncated to 800 codepoints, injected as context only (`rewrite.sh:93`, `:154-155`, `:158`).
- Prompt: "much simpler, plain English... Keep every fact, name, number, and file path. Leave fenced code blocks unchanged" (`rewrite.sh:149`).
- Provider call: Ollama-native `/api/chat`, `stream:false`, `think:false`, `options.temperature:0.3`, messages `[system, user]` (`rewrite.sh:162-163`); response via `.message.content` (`rewrite.sh:168`).
- Display modes: `append` (default; original streams, then a `💬 In plain English:` block is appended, `rewrite.sh:56`, `:223`); `replace` (intermediate chunks suppressed via empty `displayContent`, `rewrite.sh:77-80`, `:113`; only the rewrite is shown on the final chunk, `rewrite.sh:219`).
- Fail-open: on any problem it emits nothing and exits 0 (`rewrite.sh:62-63`, `:174-212`); append never suppresses; replace re-shows the full original on failure (`rewrite.sh:129-137`, `:209-211`).
- Confirmed risks: (a) replace-mode blank-screen window if the process dies between a suppressed chunk and the final handler (`rewrite.sh:113`); (b) raw `session_id`/`message_id` interpolated into buffer paths and a later `find -exec rm -rf` (`rewrite.sh:99`, `:102`) — path traversal/deletion risk; (c) no deterministic fidelity validator anywhere — preservation is prompt-only.
- Markdown path (`rewrite-md.sh`): opt-in by `CLAUDISH_MD_DIR`, does its own atomic file write (`rewrite-md.sh:201-213`), splits YAML frontmatter verbatim (`rewrite-md.sh:116-133`), supports sibling/overwrite modes with an idempotency marker (`rewrite-md.sh:60`, `:135-142`). This is a semantic file-mutation surface, distinct from display projection.

## 3. Six-CLI Capability Matrix (Iterations 2-4)

Legend: [C] confirmed by linked primary source or repo-local live note; [I] inference from that surface; [U] unknown/needs probe.

| Runtime | Safest display-projection boundary | Event/stream model | Render capability | Semantic-mutation risk | Status |
|---|---|---|---|---|---|
| Claude CLI | [C] `MessageDisplay` `displayContent` (display-only; transcript/model keep original); or own `claude -p --output-format stream-json` pipeline | [C] per-chunk `{message_id, index, final, delta}`; once-per-message in `-p` mode (index 0, final true, full delta); `message_id` ≠ API msg id | [C] `displayContent` replaces rendered text; no decision control; default timeout lowered to 10s | [C] none for display; `transcript_path` may lag (use `last_assistant_message` on Stop/SubagentStop) | Confirmed |
| Codex CLI | [C] App Server JSON-RPC client consuming `item/agentMessage/delta` + `turn/completed`, rendering locally | [C] thread/turn/item; `item/agentMessage/delta`; `turn/completed`; `turn/interrupt`; `turn/steer` | [C] arbitrary (client owns the stream); hooks = context injection only, no display-replacement event | [C] `thread/inject_items` mutates model-visible history — MUST NOT be used for display | Confirmed |
| Pi CLI | [C] native extension renderers (`renderCall`/`renderResult`, `message_end` replacement, `registerMessageRenderer`/`registerEntryRenderer`); or own `--mode json`/RPC pipeline | [C] `message_start`/`message_update`/`message_end`; parallel tool events (source-order start, completion-order end); `ctx.mode` ∈ tui/rpc/json/print | [C] `message_end {message}` replacement (same role); per-tool `renderCall`/`renderResult` returning TUI Components | [C] `tool_call` can block, `tool_result` can modify — not for projection; invalid extension fails closed at startup | Confirmed |
| OpenCode CLI | [C] server/SDK/ACP client consuming `/event` SSE + message `{info, parts}`, rendering locally | [C] OpenAPI 3.1 `/doc`; SSE bus; `POST /session/:id/message`; `prompt_async`; `abort`; `fork`; `revert` | [C] arbitrary (TUI is itself a client of the server); plugin events observational only, no documented renderer replacement | [C] none documented for plugins; ACP server available via `opencode acp` | Confirmed |
| Devin CLI | [C] `devin acp` ACP client consuming `session/update`, rendering locally | [C] ACP JSON-RPC over stdio; slash-commands advertised; `--export` ATIF conversation export | [C] arbitrary (ACP client); exact chunk schema [U] to probe | [C] hooks are lifecycle controls, not output replacement | Confirmed (schema probe pending) |
| Cursor CLI | [C] `agent acp` ACP client consuming `session/update` `agent_message_chunk`, rendering locally | [C] JSON-RPC 2.0 NDJSON; `session/new`, `session/prompt`, `session/update`, `session/cancel`, `session/request_permission`; extension methods `cursor/ask_question`, `cursor/create_plan` (blocking), `cursor/update_todos`, `cursor/task`, `cursor/generate_image` (notify) | [C] arbitrary (ACP client); hooks envelope = `{permission, user_message, agent_message}` only — not a renderer; `beforeSubmitPrompt` not delivered under tested build | [C] hooks decide/notice only | Confirmed |

Architectural insight: ACP (Agent Client Protocol) is a shared stdio JSON-RPC adapter family across Devin, Cursor, and OpenCode (`devin acp`, `agent acp`, `opencode acp`), giving the portable design one common client pattern for three runtimes.

## 4. Normalized Event and Message Model (Iteration 4)

All six streams normalize to:

```
{runtime, sessionId, messageId, eventType: chunk|final|tool_call|tool_result|status|completion|notice,
 index, final, delta, parts[], createdAt, sequence}
```

- Provenance must be sufficient to reconstruct and validate without transcript correlation (Claude `message_id` is not the transcript msg id; confirmed).
- Projection-input only, never write-back. The only sanctioned display mutations are Claude `displayContent` and Pi `message_end` replacement / renderers (both confirmed display-only). All other runtimes render via the owning client.
- Tool events are observed for display ordering, never mutated (Pi `tool_call`/`tool_result` mutation ruled out).
- Stable identity = runtime-provided message ids hashed to opaque local keys (never raw ids in filesystem paths; iteration-1 ruling).

## 5. Streaming, Buffering, Ordering, Concurrency, Cancellation, Retry (Iteration 7)

- Ordering: `index`/`final` where provided (Claude, Pi); completion-event anchor where provided (Codex `turn/completed`); arrival sequence otherwise (Cursor/OpenCode/Devin). Unknown events tolerated and skipped (NFR-R02).
- Buffering: per stable hashed identity; private, locked, bounded, expired on missing-final (emit no replacement).
- Concurrency: isolated buffers, locks, notices, cancellation, cleanup per hashed identity (spec edge-case requirement; Claude fires per-chunk processes that naturally interleave).
- Cancellation: Codex `turn/interrupt`; Cursor `session/cancel`; OpenCode `POST /session/:id/abort`; Pi `session_shutdown` cleanup hooks. On cancel: no replacement, expire state.
- Retry: bounded exponential backoff with jitter for transient provider failures (auth, quota, network); NEVER retry semantic validation rejection — a rejected rewrite selects the original immediately. Capability probes cached by base URL/model/digest.

## 6. Provider Model (Iteration 5)

Confirmed provider record shape (grounded in the Go docs and Pi's live `registerProvider` example):

```
{protocolFamily, baseUrl, auth: {envVar|header}, model, capabilities: {thinkingControl, streaming},
 cost: {input, output, cacheRead, cacheWrite}, privacyClass (dated), discoveryEndpoint, fallbackPolicy}
```

- OpenCode Go DeepSeek V4 Flash: model `deepseek-v4-flash`; `https://opencode.ai/zen/go/v1/chat/completions`; `@ai-sdk/openai-compatible`; pricing `$0.14/$0.28/$0.0028` per M tokens, $60/month included; ZDR: not used for training, 0-day retention, valid through 2026-08-31 (re-probe after). ~158k requests/month at typical usage.
- Go is protocol-heterogeneous: `/v1/chat/completions` (most), `/v1/responses` (GPT 5.6 Luna), `/v1/messages` (MiniMax/Qwen, Anthropic-compatible). Provider record MUST carry protocol family per model.
- Ollama: `ollama-native` protocol (`/api/chat`, `/api/generate`, `/api/show`, `/api/tags`); `/api/show` returns parameters, license, details, capabilities, model_info, template — capability-negotiated local routing without a probe. Ollama-local must be distinguishable from Ollama Cloud.
- llama.cpp: OpenAI-compatible server endpoints; probe-gated (streaming + structured output per build/model).
- Privacy routing: local vs local-adjacent-hosted vs hosted must be distinct classes; no auto-cascade of local content to hosted (spec NFR-S03); every privacy fact is dated.
- Non-thinking request: reference sends `think:false` to Ollama. For hosted OpenAI-compatible models, the equivalent lever varies; `thinkingControl` capability enum (`native|openai-compatible|unsupported`) requires a probe before assumption.

## 7. Fidelity Validation, Protected Spans, Fallback (Iteration 6)

- Protected-span classes (spec REQ-006/CHK-020): code, paths, commands, flags, variables, URLs, hashes, identifiers, quotes, names, numbers; fenced code blocks unchanged.
- Encoding: opaque placeholder substitution BEFORE inference (collision-free tokens, never recognizable natural text), decode + validate AFTER. `ProtectedSpanCodec` in the plan architecture (plan.md:97).
- Deterministic machine gates (SC-003, automatic): zero changed/missing/duplicated/illegally reordered protected spans; fenced code and required Markdown structure intact; reject refusal, empty output, malformed stream, truncation, missing stop state, token-limit completion; reject new facts, polarity changes, weakened/strengthened requirements.
- Fallback: exact original on every failure, at most one bounded notice per session (NFR-R01). Never suppress before a validated replacement exists (fixes the iteration-1 blank-screen window).
- Semantic gates (new fact/omission/polarity/requirement strength): human-adjudicated; SARI/LENS/semantic similarity are regression signals only, never proof.
- Atomicity: pipeline-owner runtimes (Codex/OpenCode/Devin/Cursor) render the original until a validated rewrite is ready and swap because the client owns the frame — naturally atomic, removing the process-death risk entirely. In replace-capable runtimes (Claude `displayContent`, Pi `message_end`) commit only after validation.

## 8. Evaluation Methods (Iterations 6-7)

- Versioned, secret-free corpus from representative assistant communication (progress, summaries, blockers, corrections, plans, reviews, terse messages; Markdown structure + protected spans; long/code-only/adversarial/refusal/truncation/malformed; 6-CLI event fixtures including deltas, tools, approvals, subagents, status, cancellation, duplication, reordering, missing completion).
- Blind human rubric: meaning preservation, target plainness, fluency scored separately; pairwise reference-likeness with an `indistinguishable` option; ≥3 runs per provider/model/prompt (style quality is distributional).
- Operational metrics: p50/p95 first-token and full rewrite latency, local cold/warm latency, fallback rate, token use, cost, privacy class.
- Regression signals: SARI, LENS, semantic similarity (investigation only).
- Observability: rejection-reason dashboard; redacted failure reasons for auth/quota/network/timeout/refusal/truncation/empty/malformed.

## 9. Recommendations

- Freeze the normalized envelope and the six-CLI boundary taxonomy as the architecture contract.
- Implement the five downstream phases (Section 10) with the plan's existing component set (RuntimeAdapter, MessageAssembler, ContextProvider, RewriteProvider, ProtectedSpanCodec, FidelityValidator, RenderDecision) — this lineage confirms the set is compatible with all findings; no redesign required.
- Default to whole-message rewriting; paragraph-level speculative rewriting risks changing referents and qualifications that appear later.
- Treat all dated provider/runtime facts as re-probe gates (DeepSeek ZDR 2026-08-31; CLI/SSE surface versions).

## 10. Downstream Phase Map (Iteration 7)

| Phase | Scope | Inherited evidence | Gate |
|---|---|---|---|
| A — Runtime adapters + envelope | Six per-runtime adapters (Claude MessageDisplay/stream-json, Codex App Server, Pi extensions/json-rpc, OpenCode server/SSE, Devin ACP, Cursor ACP) normalizing into the envelope | Iterations 2-4 matrix + stream events | Replay fixtures per runtime; schema conformance tests |
| B — Assembler + concurrency core | Buffering, ordering, dedup, idempotent writes, isolation, cancellation, expiry | Iteration 7 contract; reference buffer design (iteration 1) | Full failure/concurrency matrix (REQ-011): out-of-order, duplicate, missing-final, concurrent, oversized, malformed |
| C — Protected-span codec + validator | Opaque placeholder substitution, deterministic rejection gates, exact-original fallback | Iteration 6 contract; spec REQ-006/SC-003 | Zero-span-change corpus; automatic rejection harness |
| D — Provider records + privacy routing | Provider record schema, capability discovery (Ollama `/api/show`, Go `/v1/models`, llama.cpp probe), dated privacy, explicit-consent routing | Iteration 5 record + privacy facts | Re-probe DeepSeek ZDR post-2026-08-31; no-auto-cascade test |
| E — Render + evaluation harness | RenderDecision (replace/append/sidecar/original), blind rubric, operational metrics, regression signals | Iterations 6-7 evaluation contract | ≥3 runs per provider/model/prompt; semantic adjudication |

Handoffs: A→B (normalized events), B→C (assembled messages), C→E (validation verdicts), A→D (runtime capability matrix), D→E (provider latency/privacy facts). Rollback: research artifacts only; no source/reference mutation. Verification: strict recursive validation; canonical 7+3 iteration-count proof (SC-004).

## 11. Eliminated Alternatives

| Approach | Reason Eliminated | Evidence | Iteration(s) |
|---|---|---|---|
| Raw session/message IDs in buffer paths | Path traversal / recursive-deletion risk | rewrite.sh:99,102 | 1 |
| Replace-mode fail-open across process death | Blank-screen window between suppression and final handler | rewrite.sh:113 | 1 |
| Codex hooks as generic renderer | No display-replacement event exists; context injection only | learn.chatgpt.com/docs/app-server + hook-contract.md | 2 |
| `thread/inject_items` for display projection | Mutates model-visible history | learn.chatgpt.com/docs/app-server | 2 |
| `codex exec` for arbitrary presentation | Plain-text one-shot; no renderer hook | cli-codex integration-patterns.md:115 | 2 |
| Pi `tool_call`/`tool_result` mutation for display | Changes model-visible tool inputs/results | pi.dev/docs/latest/extensions | 3 |
| OpenCode plugin hooks as renderer replacement | No documented display-replacement output | opencode.ai/docs/server/ | 3 |
| Cursor hooks as renderer replacement | Envelope is `permission`/`user_message`/`agent_message` only | cursor.com/docs/cli/acp + hook-contract.md | 4 |
| Cursor `beforeSubmitPrompt` for projection | Not delivered under tested build | hook-contract.md:106 | 4 |
| Single provider protocol for all models | Go endpoints are protocol-heterogeneous | opencode.ai/docs/go/ | 5 |
| Undated privacy facts | DeepSeek ZDR expires 2026-08-31; must re-probe | opencode.ai/docs/go/ | 5 |
| Auto-cascade local→hosted | Spec privacy rule requires explicit consent | spec.md:165 | 5 |
| Prompt-only preservation | Reference proves it is insufficient (no validator) | rewrite.sh:117,168,215-224 | 6 |
| Machine-only semantic proof | SARI/LENS cannot independently prove fidelity | plan.md:254-255 | 6 |
| Retry semantic validation failures | Rejected rewrite selects original immediately | spec.md:187 | 7 |
| Shared mutable assembler state across identities | Isolation required per hashed identity | spec.md:222 | 7 |

## 12. Open Questions

- Exact per-runtime chunk schemas for Devin ACP, OpenCode, and Codex App Server messages (probe-gated).
- Codex hooks `suppressOutput` parsed-but-unimplemented status (unverified in current primary source).
- Hosted-model non-thinking lever per provider (probe-gated `thinkingControl`).
- llama.cpp streaming/structured-output behavior per build/model (probe-gated).
- Placeholder-token grammar and automated new-fact/polarity gate implementation (Phase C design detail).

## 13. Sources and References

- Reference: `specs/cli-external-orchestration/042-improved-communication/context/claudish-to-english-main/` (rewrite.sh, rewrite-md.sh, hooks/hooks.json, README.md, plugin.json).
- Claude Code hooks: https://code.claude.com/docs/en/hooks
- Codex App Server: https://learn.chatgpt.com/docs/app-server
- Pi extensions: https://pi.dev/docs/latest/extensions
- OpenCode server: https://opencode.ai/docs/server/
- OpenCode Go: https://opencode.ai/docs/go/
- Devin CLI commands: https://docs.devin.ai/cli/reference/commands
- Cursor CLI ACP: https://cursor.com/docs/cli/acp
- Ollama show model details: https://docs.ollama.com/api-reference/show-model-details
- Phase packet: `spec.md`, `plan.md`, `checklist.md` (specs/cli-external-orchestration/042-improved-communication/001-research-strategy/).

## Convergence Report

- Stop reason: maxIterationsReached (config.stopPolicy = max-iterations; hard cap 7 reached)
- Total iterations: 7
- Questions answered: 8/8
- Remaining questions: 0
- Last 3 iteration summaries: run 5: provider model (0.58) -> run 6: fidelity/fallback/eval (0.50) -> run 7: concurrency + phase map (0.42)
- Convergence threshold: 0.05 (telemetry only; hard cap governs this lineage per fan-out contract)
- Divergence summary: no divergent pivots recorded (convergence mode default; stop policy max-iterations)
