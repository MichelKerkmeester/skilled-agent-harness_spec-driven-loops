---
title: Deep Research Strategy - Session Tracking (deepseek-go lineage)
description: Persistent research plan for the deepseek-go fan-out lineage of the portable CLI communication research phase.
trigger_phrases:
  - "portable CLI communication research deepseek"
  - "claudish reverse engineering deepseek lineage"
version: 1.14.0.19
---

# Deep Research Strategy - Session Tracking (deepseek-go lineage)

Lineage: deepseek-go | executor: cli-opencode / opencode-go/deepseek-v4-flash | session: fanout-deepseek-go-1786433150940-mdbr01

## 1. OVERVIEW

### Purpose

Serves as the persistent brain for this lineage of the deep research session. Records what to investigate, what worked, what failed, and where to focus next.

### Usage

- **Init:** Copied from template and populated with Topic, Key Questions, Known Context, and Research Boundaries.
- **Per iteration:** Read Next Focus, write iteration evidence to `iterations/iteration-NNN.md`, append JSONL records, and refresh machine-owned sections.
- **Mutability:** Mutable — analyst-owned sections remain stable, machine-owned sections are refreshed after each iteration.

---

## 2. TOPIC

Reverse engineer the claudish-to-english communication architecture and design a substantially improved provider-neutral display-projection system that preserves its 1:1 communication feel across Claude CLI, Codex CLI, Pi CLI, OpenCode CLI, Devin CLI, and Cursor CLI, using hosted providers including OpenCode Go DeepSeek V4 Flash plus local LLMs.

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)

- [x] Q1: What is the exact claudish-to-english architecture (hooks, buffering, context, prompt, provider call, display modes, cleanup, failure paths) with file-and-line evidence?
- [x] Q2: What is the safest integration boundary in each of the six CLIs (Claude CLI, Codex CLI, Pi CLI, OpenCode CLI, Devin CLI, Cursor CLI) for display-only projection?
- [x] Q3: What normalized event and message model preserves canonical transcript, model context, tool events, and streaming behavior across all six runtimes?
- [x] Q4: What streaming, buffering, ordering, concurrency, cancellation, and retry semantics must the portable assembler honor?
- [x] Q5: How should protected spans be encoded and fidelity validated so the system can objectively reject bad rewrites and fall back to the exact original?
- [x] Q6: What provider-neutral configuration (protocol, base URL, model, auth, privacy class, cost, capability, fallback) supports OpenCode Go DeepSeek V4 Flash and local Ollama/llama.cpp with privacy-aware routing?
- [x] Q7: What observability and evaluation methods objectively measure perceptual 1:1 communication parity?
- [x] Q8: What downstream phase decomposition and handoff evidence should follow this research phase?
<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS

- No production implementation or packaging in this phase.
- No edits to the reference repository under `../context/claudish-to-english-main/`.
- No rewriting of canonical transcripts, model-visible messages, tool inputs, or tool results.
- No publishing, deployment, provider purchases, or remote content egress outside the explicitly requested research executors.
- No default local-to-hosted fallback; protocol compatibility does not grant privacy consent.

---

## 5. STOP CONDITIONS

- Hard cap: 7 iterations (config.maxIterations). stopPolicy is max-iterations; convergence before the cap is telemetry only and must NOT trigger early synthesis.
- Convergence before iteration 7 is recorded as telemetry and the loop broadens review angles instead of synthesizing early.

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
- Q1: Reference architecture captured with file-and-line evidence: hooks.json:3/:14; buffering rewrite.sh:89-106; context rewrite.sh:154-155; prompt rewrite.sh:149; Ollama call rewrite.sh:162-168; modes rewrite.sh:113,219,223; fail-open rewrite.sh:62-63,174-212; Markdown path rewrite-md.sh:201-213. Confirmed absence of any fidelity validator is itself a finding.
- Q2 (6/6 CLIs): Claude CLI — `MessageDisplay` `displayContent` for presentation-only rewriting (confirmed display-only per primary source), or owning the `claude -p --output-format stream-json` pipeline; Codex CLI — App Server JSON-RPC client consuming `item/agentMessage/delta` with local rendering (confirmed), hooks reserved for context injection. Pi CLI — native extension renderers (`renderCall`/`renderResult`, `message_end` replacement, `registerMessageRenderer`) for presentation (confirmed), or own the `--mode json`/RPC pipeline; OpenCode CLI — server/SDK/ACP client consuming `/event` SSE and message `parts` for local rendering (confirmed), plugin events observational only. Devin CLI — ACP client consuming `session/update` (confirmed); Cursor CLI — ACP client consuming `agent_message_chunk` (confirmed), hooks decision/notice only.
- Q3: Normalized envelope `{runtime, sessionId, messageId, eventType (chunk|final|tool_call|tool_result|status|completion|notice), index, final, delta, parts[], sequence}`; projection-input only, never write-back; only Claude `displayContent` and Pi `message_end`/renderers are sanctioned display mutations.
- Q6: Provider record shape confirmed: protocol family per model, base URL, auth, model, cost, privacy class (dated), capability flags (thinkingControl, streaming), discovery endpoint, explicit fallback policy. Go DeepSeek V4 Flash = OpenAI-compatible Chat Completions at `https://opencode.ai/zen/go/v1/chat/completions`; Ollama = `ollama-native` with `/api/show` discovery; llama.cpp = probe-gated OpenAI-compatible. Dated privacy facts must be re-probed (DeepSeek ZDR expires 2026-08-31).
- Q5: Protected-span encoding = opaque placeholder substitution before inference; objective machine rejection gates (zero changed/missing/duplicated/reordered protected spans, structure intact, completion valid) with exact-original fallback; semantic gates (new fact/polarity/requirement strength) human-adjudicated; evaluation = deterministic gates + blind rubric (meaning/plainness/fluency/indistinguishability, >=3 runs) + operational metrics + SARI/LENS regression signals. Pipeline-owner runtimes make the display swap naturally atomic.
- Q4: Assembler reconciles ordering/completion explicitly, tolerates unknown events; buffers per stable hashed identity (private, locked, bounded, expired on missing-final); isolates concurrency per identity; cancellation via Codex turn/interrupt, Cursor session/cancel, OpenCode /abort, Pi session_shutdown; bounded backoff retry for transient provider failures only.
- Q7: Observability = operational metrics (p50/p95 first-token/full latency, fallback rate, token use, cost, privacy class) + rejection-reason dashboard; evaluation = deterministic machine gates + blind human rubric (meaning/plainness/fluency/indistinguishability, >=3 runs) + SARI/LENS regression signals.
- Q8: Five downstream phases recommended — A adapters+envelope, B assembler+concurrency, C codec+validator, D providers+privacy, E render+eval — with handoffs A>B, B>C, A>D, C>E, D>E; per-child gates; rollback confined to research artifacts.
<!-- /ANCHOR:answered-questions -->

---

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
- Full-file reads with line-level citation: produced precise, verifiable reference findings (iteration 1).
- Primary-source web fetches + repo-local skill references cross-confirmed each CLI surface (iterations 2-4).
- ACP protocol-family discovery unified Devin/Cursor/OpenCode into one adapter family (iteration 4).
- Primary-source provider facts: Go endpoint/protocol/pricing/privacy dated 2026-08-09, Ollama discovery, Pi provider-record shape (iteration 5).
- Grounding every fidelity gate in spec/plan citations and closing the process-death gap via atomic pipeline-owner swap (iteration 6).
- Threading confirmed runtime stream/cancel surfaces through the spec failure matrix into a five-child phase map and architecture freeze (iteration 7).
<!-- /ANCHOR:what-worked -->

---

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
[None yet]
<!-- /ANCHOR:what-failed -->

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
[None yet]
<!-- /ANCHOR:exhausted-approaches -->

---

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
- Carry raw session/message IDs into buffer paths: path traversal / recursive-deletion risk (iteration 1, evidence: rewrite.sh:99,102).
- Rely on replace-mode fail-open across process death: blank-screen window exists (iteration 1, evidence: rewrite.sh:113).
- Codex hooks as a generic renderer: no display-replacement event exists (iteration 2, evidence: https://learn.chatgpt.com/docs/app-server + hook-contract.md).
- `thread/inject_items` for display projection: mutates model-visible history (iteration 2, evidence: https://learn.chatgpt.com/docs/app-server).
- `codex exec` for arbitrary presentation: plain-text, no renderer hook (iteration 2, evidence: cli-codex integration-patterns.md:115).
- Pi `tool_call`/`tool_result` mutation for display projection: changes model-visible tool inputs/results (iteration 3, evidence: https://pi.dev/docs/latest/extensions).
- OpenCode plugin hooks as renderer replacement: no documented display-replacement output (iteration 3, evidence: https://opencode.ai/docs/server/).
- Cursor hooks as renderer replacement: envelope is permission/user_message/agent_message only (iteration 4, evidence: https://cursor.com/docs/cli/acp + hook-contract.md).
- Cursor `beforeSubmitPrompt` reliance for projection: not delivered under tested build (iteration 4, evidence: hook-contract.md:106).
- Assume one provider protocol for all models: Go endpoints are protocol-heterogeneous (iteration 5, evidence: https://opencode.ai/docs/go/).
- Trust privacy facts without dates: DeepSeek ZDR expires 2026-08-31 (iteration 5, evidence: https://opencode.ai/docs/go/).
- Auto-cascade local content to hosted providers: explicit consent required (iteration 5, evidence: spec.md:165).
- Trust prompt-only preservation: reference proves it is insufficient (iteration 6, evidence: rewrite.sh:117,168,215-224).
- Machine-only semantic proof: SARI/LENS cannot independently prove fidelity (iteration 6, evidence: plan.md:254-255).
- Retry semantic validation failures: validation rejection selects the original immediately (iteration 7, evidence: spec.md:187).
- Share mutable assembler state across concurrent identities: isolation required per hashed identity (iteration 7, evidence: spec.md:222).
<!-- /ANCHOR:ruled-out-directions -->

---

<!-- ANCHOR:divergence-frontier -->
## 10A. SATURATED DIRECTIONS AND DIVERGENCE FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Saturated: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded
<!-- /ANCHOR:divergence-frontier -->

---

<!-- ANCHOR:carried-forward-open-questions -->
## 11A. CARRIED-FORWARD OPEN QUESTIONS
[None yet]
<!-- /ANCHOR:carried-forward-open-questions -->

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
Synthesis: compile all seven iterations into research/research.md with the 17-section format, Eliminated Alternatives, convergence report, and the five-child downstream phase recommendation.
<!-- /ANCHOR:next-focus -->

---

<!-- MACHINE-OWNED: END -->
## 12. KNOWN CONTEXT

The parent phase packet (specs/cli-external-orchestration/042-improved-communication/) is a Level 2 research phase. Prior native research (plan.md) established:

- Claude CLI: `MessageDisplay` hook + `stream-json` headless; presentation-only.
- Codex CLI: App Server JSON-RPC or `codex exec --json`; `suppressOutput` parsed but unimplemented in hooks.
- Pi CLI: extension rendering (`renderCall`/`renderResult`) and JSON/RPC.
- OpenCode CLI: HTTP server with SSE and plugin events.
- Devin CLI: `devin acp` session/update rendering.
- Cursor CLI: `agent acp` and `afterAgentResponse` observation.
- OpenCode Go DeepSeek V4 Flash: OpenAI-compatible Chat Completions at the documented Go endpoint.
- Ollama: `/api/show` discovery; `ollama-native` for timings/thinking/keep-alive.
- llama.cpp: OpenAI-compatible server endpoints; best-effort.
- The reference registers `MessageDisplay` + `PostToolUse` hooks (hooks.json:3, :14), buffers per-chunk deltas, calls a local Ollama model, and supports append/replace display modes with fail-open semantics.

resource-map.md not present; skipping coverage gate.

---

## 13. RESEARCH BOUNDARIES
- Max iterations: 7 (hard cap; max-iterations stop policy)
- Convergence threshold: 0.05 (telemetry only before cap)
- Per-iteration budget: 12 tool calls, 30 minutes
- Progressive synthesis: true (default)
- research/research.md ownership: workflow-owned canonical synthesis output
- Lifecycle branches: `new` only (detached fan-out lineage, session fanout-deepseek-go-1786433150940-mdbr01)
- Current generation: 1
- Started: 2026-08-11T09:30:00Z
