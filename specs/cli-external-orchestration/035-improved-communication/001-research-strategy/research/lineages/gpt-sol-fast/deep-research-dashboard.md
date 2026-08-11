---
title: Deep Research Dashboard
description: Auto-generated reducer view over the research packet.
---

# Deep Research Dashboard - Session Overview

Auto-generated from JSONL state log, iteration files, findings registry, and strategy state. Never manually edited.

<!-- ANCHOR:overview -->
## 1. OVERVIEW

Reducer-generated observability surface for the active research packet.

<!-- /ANCHOR:overview -->
<!-- ANCHOR:status -->
## 2. STATUS
- Topic: Reverse engineer the claudish-to-english communication architecture and design a substantially improved provider-neutral display-projection system that preserves its 1:1 communication feel across Claude CLI, Codex CLI, Pi CLI, OpenCode CLI, Devin CLI, and Cursor CLI, using hosted providers including OpenCode Go DeepSeek V4 Flash plus local LLMs.
- Started: 2026-08-11T07:28:40Z
- Status: COMPLETE
- Iteration: 3 of 3
- Session ID: fanout-gpt-sol-fast-1786433150940-mdbr01
- Parent Session: none
- Lifecycle Mode: new
- Generation: 1
- continuedFromRun: none
- stopReason: maxIterationsReached

<!-- /ANCHOR:status -->
<!-- ANCHOR:progress -->
## 3. PROGRESS

| # | Focus | Track | Ratio | Findings | Status |
|---|-------|-------|-------|----------|--------|
| 1 | Primary-source integration boundaries and normalized event/message model for all six CLIs | architecture | 0.69 | 8 | complete |
| 2 | Version-aware streaming assembly state machine and layered protected-span/semantic fidelity validation | architecture-fidelity | 0.86 | 7 | complete |
| 3 | Privacy-aware hosted/local provider routing, redacted observability, perceptual 1:1 parity evaluation, and downstream phase decomposition | providers-privacy-evaluation | 0.81 | 8 | complete |

- iterationsCompleted: 3
- keyFindings: 23
- openQuestions: 0
- resolvedQuestions: 5

<!-- /ANCHOR:progress -->
<!-- ANCHOR:questions -->
## 4. QUESTIONS
- Answered: 5/5
- [x] What is the safest primary-source-supported display integration boundary in each of the six CLIs, and how should their events normalize without mutating canonical context, tools, or transcripts?
- [x] How should message assembly handle streaming, ordering, duplication, concurrency, cancellation, timeout, retry, and atomic render commitment?
- [x] Which protected-span and semantic fidelity gates can reject every changed literal, structure, fact, polarity, requirement strength, caveat, or next step and return the exact original?
- [x] How should privacy-aware routing normalize OpenCode Go DeepSeek V4 Flash, Ollama, llama.cpp, and other hosted or local providers without unapproved egress or capability assumptions?
- [x] Which observability, perceptual-parity evaluation, and downstream phase boundaries make the architecture testable and implementable?

<!-- /ANCHOR:questions -->
<!-- ANCHOR:uncovered-questions -->
## Uncovered Questions
- Count: 0
- None

<!-- /ANCHOR:uncovered-questions -->
<!-- ANCHOR:trend -->
## 5. TREND
- newInfoRatio sparkline: ▁▂▂▃▄▅▅▆▇███▇▇▇▇▇▆▆▆
- score sparkline: ▁▂▂▃▄▅▅▆▇███▇▇▇▇▇▆▆▆
- Last 3 ratios: 0.69 -> 0.86 -> 0.81
- Stuck count: 0
- Guard violations: none recorded by the reducer pass
- convergenceScore: 0.81
- coverageBySources: {"agentclientprotocol.com":1,"code":22,"code.claude.com":1,"cursor.com":1,"docs.devin.ai":1,"docs.ollama.com":2,"genai.owasp.org":1,"github.com":2,"html.spec.whatwg.org":1,"learn.chatgpt.com":1,"opencode.ai":2,"opentelemetry.io":1,"other":8,"raw.githubusercontent.com":2,"spec.commonmark.org":1,"www.jsonrpc.org":1}
- Advisory events: none

<!-- /ANCHOR:trend -->
<!-- ANCHOR:dead-ends -->
## 6. DEAD ENDS
- `https://agentclientprotocol.com/protocol/session-updates` returned 404. No claims depend on that unavailable page; shared ACP semantics beyond the runtime-specific documentation remain unconfirmed. (iteration 1)
- A narrow grep over the captured Claude web response exceeded the tool record limit. The official page’s directly returned lifecycle table and the local reference supplied the used evidence. (iteration 1)
- A single universal lifecycle hook: the six runtimes expose materially different boundaries; only Claude confirms a dedicated presentation-only hook. [SOURCE: https://code.claude.com/docs/en/hooks] [SOURCE: https://opencode.ai/docs/server/] (iteration 1)
- Pi finalized-message replacement as the projector: the documented handler can replace the lifecycle message, violating the immutable-canonical-lane requirement. [SOURCE: https://raw.githubusercontent.com/earendil-works/pi/main/packages/coding-agent/docs/extensions.md] (iteration 1)
- Reusing Cursor’s ACP field mapping unchanged for Devin: both expose ACP, but the consulted Devin source confirms transport rather than identical update payloads. [SOURCE: https://docs.devin.ai/cli/reference/commands] [SOURCE: https://cursor.com/docs/cli/acp] (iteration 1)
- The GitHub HTML view of Pi’s extension documentation failed to render content; the raw repository URL supplied the primary document instead. (iteration 1)
- A deterministic gate cannot prove every semantic equivalence claim. The safe resolution is asymmetric: deterministic checks can approve literal/structural invariants, while semantic uncertainty can only reject and fall back. [SOURCE: https://genai.owasp.org/llmrisk/llm01-prompt-injection/] [INFERENCE: fail-closed consequence of non-fool-proof model behavior] (iteration 2)
- A universal table parser is not available from CommonMark because tables are a dialect extension. Version-pinned runtime fixtures must declare Markdown dialect and parser version before implementation. [SOURCE: https://spec.commonmark.org/0.31.2/] (iteration 2)
- Arrival order as canonical assembly order: JSON-RPC permits concurrent batch responses in any order, and SSE reconnects can replay from `Last-Event-ID`. [SOURCE: https://www.jsonrpc.org/specification] [SOURCE: https://html.spec.whatwg.org/multipage/server-sent-events.html] (iteration 2)
- Reconstructing the original from placeholders, a Markdown AST, or decoded text: parsing and decoding can erase byte-level distinctions. [SOURCE: https://spec.commonmark.org/0.31.2/] [SOURCE: https://html.spec.whatwg.org/multipage/server-sent-events.html] (iteration 2)
- Suppressing original chunks until a rewrite succeeds: it turns missing-final, timeout, cancellation, and validator failure into blank or reconstructed output rather than exact fallback. [SOURCE: specs/cli-external-orchestration/042-improved-communication/001-research-strategy/research/lineages/gpt-sol-fast/iterations/iteration-001.md:30] (iteration 2)
- Treating an LLM judge as a deterministic semantic proof: OWASP describes prompt injection prevention as non-fool-proof and recommends deterministic validation boundaries. [SOURCE: https://genai.owasp.org/llmrisk/llm01-prompt-injection/] (iteration 2)
- A localhost-shaped URL cannot prove offline execution: Ollama compatibility documents a localhost example, while llama.cpp separately exposes host, offline, model-download, and remote-server controls. Deployment and egress must be recorded and enforced independently. [SOURCE: https://docs.ollama.com/api/openai-compatibility] [SOURCE: https://raw.githubusercontent.com/ggml-org/llama.cpp/master/tools/server/README.md] (iteration 3)
- Automatic local-to-hosted fallback, even to a zero-retention route, because egress consent and residency remain separate decisions. [SOURCE: https://opencode.ai/docs/go/] [INFERENCE: privacy-class and consent boundary] (iteration 3)
- Automatic readability or model-judge scores as proof of semantic or perceptual parity. [SOURCE: specs/cli-external-orchestration/042-improved-communication/001-research-strategy/research/lineages/gpt-sol-fast/iterations/iteration-002.md:26] [INFERENCE: diagnostic metrics cannot authorize a projection] (iteration 3)
- Content-bearing telemetry or raw provider errors; lifecycle enums and keyed correlation are sufficient for operations. [SOURCE: https://github.com/open-telemetry/semantic-conventions-genai] [INFERENCE: data-minimization consequence] (iteration 3)
- Current mutable documentation cannot substitute for version-pinned provider/build/model fixtures. [SOURCE: https://opencode.ai/docs/go/] [SOURCE: https://raw.githubusercontent.com/ggml-org/llama.cpp/master/tools/server/README.md] (iteration 3)
- Treating provider name or OpenAI compatibility as a privacy or capability class. [SOURCE: https://opencode.ai/docs/go/] [SOURCE: https://docs.ollama.com/api/openai-compatibility] (iteration 3)

<!-- /ANCHOR:dead-ends -->
<!-- ANCHOR:divergent-pivots -->
## 6A. DIVERGENT PIVOTS
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Saturated: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

<!-- /ANCHOR:divergent-pivots -->
<!-- ANCHOR:next-focus -->
## 7. NEXT FOCUS
[All tracked questions are resolved]

<!-- /ANCHOR:next-focus -->
<!-- ANCHOR:active-risks -->
## 8. ACTIVE RISKS
- None active beyond normal research uncertainty.

<!-- /ANCHOR:active-risks -->
<!-- ANCHOR:blocked-stops -->
## 9. BLOCKED STOPS
No blocked-stop events recorded.

<!-- /ANCHOR:blocked-stops -->
<!-- ANCHOR:graph-convergence -->
## 10. GRAPH CONVERGENCE
- graphConvergenceScore: 0.00
- graphDecision: [Not recorded]
- graphBlockers: none recorded

<!-- /ANCHOR:graph-convergence -->
