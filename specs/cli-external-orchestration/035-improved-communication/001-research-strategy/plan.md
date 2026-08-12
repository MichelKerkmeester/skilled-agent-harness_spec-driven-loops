---
title: "Implementation Plan: Portable CLI communication research strategy"
description: "A dual-track research plan that combines native primary-source crawling with two forced-depth system-deep-loop lineages, then triangulates the evidence into an implementation architecture."
trigger_phrases:
  - "portable CLI research plan"
  - "deep research 7 and 3"
  - "communication projection architecture"
importance_tier: "important"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/035-improved-communication/001-research-strategy"
    last_updated_at: "2026-08-11T08:09:22Z"
    last_updated_by: "codex"
    recent_action: "Completed 7+3 research synthesis."
    next_safe_action: "Use the canonical synthesis to scaffold Phase 002 contracts and fixtures."
    blockers: []
    key_files:
      - "plan.md"
      - "spec.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "001-research-strategy-plan-20260811"
      parent_session_id: "001-research-strategy-20260811"
    completion_pct: 100
    open_questions:
      - "Version-pinned runtime event fields remain Phase 002 fixture questions."
    answered_questions:
      - "Use native subagents for current web crawling and system-deep-loop for iterative research."
      - "Run the external lineages in .worktrees/0138-system-deep-loop-communication-research and copy back only validated research artifacts."
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Portable CLI communication research strategy

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Documentation and research in this phase; likely TypeScript core in later phases, subject to research |
| **Framework** | `system-deep-loop` plus native subagent research; no new production framework in phase 001 |
| **Storage** | Spec packet documents and canonical deep-loop JSONL/Markdown artifacts |
| **Testing** | Source verification, exact iteration/state checks, document validation, and future golden-corpus design |

### Overview

Use different research mechanisms for different uncertainty. Native subagents crawl current primary sources in parallel and answer bounded capability questions quickly. The existing `/deep:research:auto` state machine then explores architectural alternatives, challenges assumptions across iterations, preserves deltas, and produces auditable synthesis. The two evidence streams are reconciled only after each remains independently inspectable.

No prototype code is needed to answer the phase's primary question. Read-only CLI probes are allowed when official documentation does not establish a capability; all implementation is deferred until the architecture and safety gates are explicit.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] Problem and frozen phase scope are documented in `spec.md`.
- [x] Reference repository has been inventoried without modification.
- [x] Requested executor models are discoverable through the installed OpenCode CLI.
- [x] The two native research questions are independent and source-bounded.
- [x] An isolated executor worktree is authorized for dangerous-permission cli-opencode dispatch.

### Definition of Done

- [x] All P0 requirements and checklist items have evidence.
- [x] Native research and both deep-loop lineages have been triangulated.
- [x] Exactly 7 DeepSeek and 3 GPT iterations are proven by canonical state and iteration files.
- [x] The final synthesis recommends downstream phases and inherited gates.
- [x] Parent and child pass recursive strict spec validation from final state.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Architecture under research

### Pattern

Protocol-neutral, fail-open display projection with capability-negotiated runtime and model adapters.

### Key Components

- **`RuntimeAdapter`**: Converts one CLI's events into a normalized envelope and commits presentation only through a documented safe surface.
- **`MessageAssembler`**: Reconstructs complete messages with hashed identities, private state, ordering, deduplication, locks, limits, cancellation, and expiry.
- **`ContextProvider`**: Selects bounded conversational context without changing the source message or exposing more content than policy allows.
- **`ProtectedSpanCodec`**: Replaces code, paths, flags, variables, URLs, hashes, quoted literals, identifiers, and numbers with opaque placeholders before inference.
- **`RewriteProvider`**: Normalizes OpenAI Chat Completions, Anthropic Messages, Ollama-native, and optional OpenAI Responses request/stream semantics.
- **`FidelityValidator`**: Rejects placeholder, completion, structural, semantic, polarity, or requirement-strength violations.
- **`RenderDecision`**: Chooses atomic replace, append, sidecar, notice, or exact original based on runtime capability and validation result.

### Data Flow

```text
canonical runtime events
  -> RuntimeAdapter
  -> MessageAssembler
  -> ContextProvider
  -> ProtectedSpanCodec
  -> RewriteProvider
  -> response accumulator
  -> FidelityValidator
  -> RenderDecision
  -> display projection only

canonical events/transcript/model context -----------------> unchanged
```

Whole-message rewriting is the default. Paragraph-level speculative rewriting risks changing referents and qualifications that appear later. Provider streaming is still useful for cancellation, heartbeat, and time-to-first-token measurement, but replace mode must not publish partial unvalidated text.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## 4. AFFECTED SURFACES

| Surface | Current Role | Phase 001 Action | Verification |
|---------|--------------|------------------|--------------|
| `../context/claudish-to-english-main/rewrite.sh` | Claude MessageDisplay prototype | Read only; inventory behavior and risks | `bash -n`, line evidence, and source analysis |
| `../context/claudish-to-english-main/rewrite-md.sh` | Optional Markdown mutation | Read only; separate from display architecture | `bash -n`, line evidence, and scope decision |
| `../context/claudish-to-english-main/hooks/hooks.json` | Hook registration | Read only; capture event/timeouts | `jq empty` and line evidence |
| Six CLI primary docs | Current integration contracts | Build confirmed/inferred capability matrix | Primary links and dated snapshot |
| Hosted/local provider primary docs | Protocol, discovery, privacy, cost, and capability facts | Build provider matrix and probe policy | Primary links and dated snapshot |
| `system-deep-loop` output | Iterative research state | Generate through named workflow only | State reducer, iteration count, logs, and final synthesis |
| Phase packet docs/metadata | Research contract and handoff | Author and validate | Strict recursive validation and placeholder scan |

The implementation phase must later inventory every normalized-event producer and consumer before changing shared contracts. Phase 001 records the axes: runtime, integration surface, event ordering, render mode, provider protocol, capability confidence, privacy class, completion status, and fallback class.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 5. IMPLEMENTATION PHASES

These are research-execution phases. Production implementation remains out of scope.

### Phase 1: Ground truth the local reference

- [x] Inventory manifests, hooks, scripts, environment controls, prompt, context, display modes, filesystem behavior, and failure paths.
- [x] Run shell syntax, JSON parse, executable-bit, and advisory ShellCheck checks.
- [x] Separate confirmed behavior from inferred reasons the prose feels natural.

### Phase 2: Native primary-source crawling

- [x] Dispatch a six-CLI integration-surface lane.
- [x] Dispatch a hosted/local provider and fidelity-evaluation lane.
- [x] Reopen key primary sources and verify their load-bearing claims.
- [x] Preserve the final dated matrices in deep-research synthesis or a dedicated research artifact.

### Phase 3: Capability matrices

- [x] Establish initial `confirmed`, `inferred`, `unsupported`, and `unknown` labels.
- [x] Reconcile runtime/version caveats and provider claims with deep-loop output.
- [x] Identify which claims require read-only active probes before implementation.

### Phase 4: Forced-depth deep research

Run one fanout with two independent lineages through `/deep:research:auto`. The global stop policy is `max-iterations`; per-lineage iteration counts force the requested 7+3 split. Live web is enabled for both.

```json
{
  "executors": [
    {
      "kind": "cli-opencode",
      "model": "opencode-go/deepseek-v4-flash",
      "label": "deepseek-go",
      "count": 1,
      "iterations": 7,
      "promptFramework": "rcaf",
      "timeoutSeconds": 1800,
      "liveTools": { "webSearch": "live" }
    },
    {
      "kind": "cli-opencode",
      "model": "openai/gpt-5.6-sol-fast",
      "label": "gpt-sol-fast",
      "count": 1,
      "iterations": 3,
      "reasoningEffort": "high",
      "promptFramework": "crispe",
      "timeoutSeconds": 1800,
      "liveTools": { "webSearch": "live" }
    }
  ],
  "concurrency": 2
}
```

The DeepSeek-specific prompt profile is not present in the local small-model registry, so the documented index-only fallback uses RCAF and medium prompt complexity without inventing model behavior. GPT-5.6 SOL high is supported by official OpenAI documentation; `openai/gpt-5.6-sol-fast` is the exact locally discovered OpenCode route and must not be silently substituted.

The dispatch prompt must contain literal `BANNED OPERATIONS` and `ALLOWED WRITE PATHS` sections. Writes are restricted to this phase's deep-research lineage/state directories in an isolated worktree. No lineage may modify the reference, production code, parent docs, or unrelated worktree content.

Execution completed in `.worktrees/0138-system-deep-loop-communication-research`. DeepSeek produced 7/7 iterations and GPT produced 3/3; both stopped with `maxIterationsReached`. All ten canonical iteration validators passed. The root reducer merged 97 findings from 10 deltas with no skipped registry or corruption. One DeepSeek timestamp stream was anomalous and is retained only as content provenance, not chronological evidence.

### Phase 5: Triangulate and challenge

- [x] Compare every load-bearing deep-loop claim with primary sources or explicit probe evidence.
- [x] Record disagreements between native agents, DeepSeek, and GPT rather than averaging them away.
- [x] Distinguish confirmed facts, inferences, dated policy, unknowns, and implementation hypotheses.
- [x] Convert provider/runtime uncertainty into capability probes and release gates.

### Phase 6: Synthesize downstream work

- [x] Freeze the normalized architecture and provider policy only after triangulation.
- [x] Produce the evaluation corpus design, deterministic gates, blind rubric, and operational metrics.
- [x] Recommend child phases with scope, dependencies, handoffs, rollback, and authoritative checks.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 6. TESTING STRATEGY

### Evaluation and evidence strategy

### Research-phase proof

| Check | Scope | Tool or Evidence |
|-------|-------|------------------|
| Reference syntax | Both shell scripts and hook JSON | `bash -n`, `jq empty`, executable bits, advisory ShellCheck |
| Source traceability | Six runtimes and provider families | Primary-source URL plus `confirmed`/`inferred` label and snapshot date |
| Deep-loop depth | Two requested lineages | Canonical JSONL state, iteration filenames, reduced state, and stop reason |
| Artifact integrity | Parent and phase 001 | Placeholder scan, exact file inventory, `validate.sh --recursive --strict` |

### Implementation-phase golden corpus

Create a versioned, secret-free corpus from representative assistant communication:

- progress updates, final summaries, blockers, corrections, plans, reviews, and terse messages;
- Markdown headings, lists, tables, links, inline code, fenced code, commands, paths, flags, hashes, identifiers, names, numbers, units, negations, caveats, priorities, and requirement language;
- long outputs, code-only outputs, adversarial instruction-like text, refusals, truncation, and malformed provider responses;
- event fixtures for all six runtimes, including deltas, tools, approvals, subagents, status, cancellation, duplication, reordering, and missing completion.

Evaluate every provider/model/prompt at least three times because style quality is distributional rather than byte-deterministic.

| Gate | Release rule |
|------|--------------|
| Protected literals and structure | Zero changed, missing, duplicated, or illegally reordered protected spans; fenced code and required Markdown structure remain intact |
| Meaning | No new fact, omission, polarity change, weakened/strengthened requirement, altered uncertainty, or changed next step |
| Completion | Reject refusal, empty output, malformed stream, truncation, missing stop state, or token-limit completion |
| Fail-open | Every rejected rewrite renders the exact original; no partial replacement is observable |
| Human quality | Blind raters score meaning preservation, target plainness, and fluency separately, then choose reference-likeness with an `indistinguishable` option |
| Regression signals | SARI, LENS, and a semantic similarity metric inform investigation but cannot independently prove fidelity |
| Operations | Record p50/p95 first-token/full latency, local cold/warm latency, fallback rate, token use, cost, and privacy class |

Human-adjudicated semantic regressions block release. Automatic style improvement cannot override a meaning failure.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 7. DEPENDENCIES

### Current evidence

### Runtime capability snapshot, 2026-08-11

`[C]` is confirmed by linked primary documentation. `[I]` is the plan's inference from that surface.

| Runtime | Safest current surface | Research conclusion |
|---------|------------------------|---------------------|
| Claude CLI | `[C]` [`stream-json` headless mode](https://code.claude.com/docs/en/headless) and [`MessageDisplay`](https://code.claude.com/docs/en/hooks) | Native `MessageDisplay` is presentation-only; a wrapper is still useful for full lifecycle portability. Preserve final result and subagent ancestry. |
| Codex CLI | `[C]` [App Server JSON-RPC](https://learn.chatgpt.com/docs/app-server) or `codex exec --json` | `[I]` Use an App Server client for arbitrary presentation. Hooks cannot supply a generic renderer, and [`suppressOutput` is parsed but unimplemented](https://learn.chatgpt.com/docs/hooks). |
| Pi CLI | `[C]` [extension rendering and JSON/RPC](https://github.com/earendil-works/pi/blob/main/packages/coding-agent/docs/extensions.md) | `[I]` Prefer native `renderCall`/`renderResult` for tools; use JSON/RPC when the whole UI must be controlled. Pin a tested release. |
| OpenCode CLI | `[C]` [HTTP server with SSE](https://opencode.ai/docs/server/) and [plugin events](https://opencode.ai/docs/plugins/) | `[I]` Use a server/SDK/ACP client. Plugins observe messages but do not document a generic safe renderer replacement. |
| Devin CLI | `[C]` [`devin acp`](https://docs.devin.ai/cli/reference/commands) | `[I]` Render ACP `session/update` locally; documented hooks are semantic lifecycle controls, not assistant-output replacement. |
| Cursor CLI | `[C]` [`agent acp`](https://cursor.com/docs/cli/acp) and [`afterAgentResponse`](https://cursor.com/docs/hooks) observation | `[I]` Use ACP or stream JSON for arbitrary rendering; final-response hooks do not document replacement output. |

Pi is the only researched runtime with a clearly documented native renderer override that separates tool execution from display. ACP supplies a shared client pattern for Devin and Cursor; OpenCode's server/SSE and Codex App Server remain distinct adapter families.

### Provider capability snapshot, 2026-08-11

| Provider family | Confirmed evidence | Design consequence |
|-----------------|--------------------|--------------------|
| OpenCode Go DeepSeek V4 Flash | [`deepseek-v4-flash` uses OpenAI-compatible Chat Completions](https://opencode.ai/docs/go/) at the documented Go endpoint | Use `openai-chat`; request non-thinking behavior, but probe forwarded field support. Recheck the time-bounded ZDR agreement after 2026-08-31. |
| Arbitrary OpenCode providers | [Custom providers, Ollama, and compatible base URLs](https://opencode.ai/docs/providers) | Provider is a model-specific configuration record, not a protocol synonym. |
| Ollama local | [`/api/show` exposes details and capabilities](https://docs.ollama.com/api-reference/show-model-details) | Prefer `ollama-native` for discovery, timings, thinking control, and keep-alive; local-only policy must remain distinguishable from Ollama Cloud. |
| llama.cpp local | [OpenAI-compatible server endpoints](https://github.com/ggml-org/llama.cpp/blob/master/tools/server/README.md) | Compatibility is best-effort; probe streaming and structured-output behavior per build/model. |
| OpenAI GPT-5.6 SOL | [Official model page](https://developers.openai.com/api/docs/models/gpt-5.6-sol) and [model guidance](https://developers.openai.com/api/docs/guides/latest-model) | High reasoning is supported. The `-fast` route is OpenCode-local discovery, not an official OpenAI model ID. |

Capability discovery precedence:

1. Explicit user/model override.
2. Native discovery such as Ollama `/api/show`.
3. Trusted catalog metadata.
4. `/v1/models` for availability only.
5. Tiny non-sensitive active probes run deliberately through a `doctor` command.

Capabilities use `yes | no | unknown`. Probe results are cached by base URL, model ID, model digest/revision, and application version. Ordinary completion must not spend tokens or transmit content just to discover a feature.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 8. ROLLBACK PLAN

- **Trigger**: Research artifacts escape the declared phase paths, an executor targets the populated current worktree, provider identity differs from the requested models, a lineage stops early, or packet validation fails.
- **Procedure**: Stop the workflow, preserve logs for diagnosis, and copy nothing from the isolated executor worktree until every lineage and write-scope check passes. Remove the temporary worktree only after accepted artifacts exist in the primary packet and final validation succeeds.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```text
Reference inventory ───────┐
Native CLI crawl ──────────┼──> Capability matrices ──┐
Native provider crawl ─────┘                           ├──> Triangulation ──> Downstream phase map
DeepSeek 7 iterations ─────────────────────────────────┤
GPT SOL high 3 iterations ─────────────────────────────┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Reference inventory | None | Matrices and synthesis |
| Native crawling | Official sources and native subagents | Matrices and triangulation |
| Deep-loop fanout | Executor access and isolated-worktree authorization | Triangulation |
| Triangulation | Both native lanes plus both full-depth lineages | Final architecture and phase map |
| Verification | Final artifacts | Phase 001 completion |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Reference and native research | Medium | Completed in this session |
| Forced-depth fanout | High | 10 external iterations plus reducer/validation time |
| Triangulation and synthesis | High | Evidence-dependent; no calendar promise |
| Verification | Medium | One final reconciliation and strict gate |
| **Total** | **High** | **Bound by requested iteration depth and source review** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-execution Checklist

- [x] Temporary worktree path and branch are explicitly authorized.
- [x] Current branch commit and dirty-state recovery information are recorded.
- [x] Executor prompt contains literal banned operations and allowed write paths.
- [x] Model IDs, reasoning effort, iteration counts, stop policy, timeout, and live-web policy pass preflight.
- [x] Copy-back allowlist is restricted to validated research artifacts for this phase.

### Rollback Procedure

1. Stop both external lineages and the orchestrating run.
2. Inspect state and logs without copying partial output into the current worktree.
3. Retain or export only diagnostic evidence the user explicitly wants.
4. Remove the temporary worktree through the project worktree workflow after confirming no accepted artifact exists only there.
5. Re-run current-packet status and validation to prove rollback left the working tree unchanged.

### Data Reversal

- **Has data migrations?** No.
- **Reversal procedure**: Delete only task-created packet or isolated research artifacts after exact-path inspection. The reference repository and unrelated user changes remain untouched.
<!-- /ANCHOR:enhanced-rollback -->
