# Deep Research Strategy: Provider-Neutral CLI Display Projection

## 2. TOPIC
Reverse engineer claudish-to-english and derive an evidence-backed, provider-neutral display-projection architecture that preserves canonical runtime state while matching its direct 1:1 communication feel across Claude CLI, Codex CLI, Pi CLI, OpenCode CLI, Devin CLI, and Cursor CLI.

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [x] What is the safest primary-source-supported display integration boundary in each of the six CLIs, and how should their events normalize without mutating canonical context, tools, or transcripts?
- [x] How should message assembly handle streaming, ordering, duplication, concurrency, cancellation, timeout, retry, and atomic render commitment?
- [x] Which protected-span and semantic fidelity gates can reject every changed literal, structure, fact, polarity, requirement strength, caveat, or next step and return the exact original?
- [x] How should privacy-aware routing normalize OpenCode Go DeepSeek V4 Flash, Ollama, llama.cpp, and other hosted or local providers without unapproved egress or capability assumptions?
- [x] Which observability, perceptual-parity evaluation, and downstream phase boundaries make the architecture testable and implementable?

<!-- /ANCHOR:key-questions -->

## 4. NON-GOALS
- No production implementation, provider configuration, package installation, service startup, or deployment.
- No mutation of canonical model context, tool events, tool results, transcript state, or the read-only reference.
- No claim that protocol compatibility alone proves privacy, fidelity, or safe presentation replacement.
- No writes outside this detached lineage packet.

## 5. STOP CONDITIONS
- Complete exactly three evidence iterations, regardless of early convergence telemetry.
- Stop on an unrecoverable state or scope violation and preserve the partial packet honestly.

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
- What is the safest primary-source-supported display integration boundary in each of the six CLIs, and how should their events normalize without mutating canonical context, tools, or transcripts?
- How should message assembly handle streaming, ordering, duplication, concurrency, cancellation, timeout, retry, and atomic render commitment?
- Which protected-span and semantic fidelity gates can reject every changed literal, structure, fact, polarity, requirement strength, caveat, or next step and return the exact original?
- How should privacy-aware routing normalize OpenCode Go DeepSeek V4 Flash, Ollama, llama.cpp, and other hosted or local providers without unapproved egress or capability assumptions?
- Which observability, perceptual-parity evaluation, and downstream phase boundaries make the architecture testable and implementable?

<!-- /ANCHOR:answered-questions -->

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
- runtime-owned client protocols exposed identity, lifecycle, cancellation, and terminal states more completely than hooks, while Claude’s dedicated display hook provided the useful narrow exception. (iteration 1)
- transport standards separated source ordering, correlation, reconnection, and terminal behavior; CommonMark exposed where parsed structure loses source bytes; OWASP supported an asymmetric deterministic-first trust boundary. (iteration 2)
- provider-native documents exposed where compatibility ends, while dated privacy terms made policy freshness an explicit routing input rather than prose. (iteration 3)

<!-- /ANCHOR:what-worked -->

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
- broad rendered pages produced oversized captures, and one assumed ACP documentation route did not exist. Raw primary documents and runtime-specific pages were more reliable. (iteration 1)
- no standard can make probabilistic semantic comparison a proof, and CommonMark cannot define runtime-specific table syntax. Both gaps must become fail-closed capability/fixture requirements rather than optimistic assumptions. (iteration 2)
- the former OpenTelemetry page had moved, and mutable provider/server pages cannot prove installed behavior. The maintained repository supplied the telemetry abstraction; mutable capabilities became pinned probes. (iteration 3)

<!-- /ANCHOR:what-failed -->

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### `https://agentclientprotocol.com/protocol/session-updates` returned 404. No claims depend on that unavailable page; shared ACP semantics beyond the runtime-specific documentation remain unconfirmed. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: `https://agentclientprotocol.com/protocol/session-updates` returned 404. No claims depend on that unavailable page; shared ACP semantics beyond the runtime-specific documentation remain unconfirmed.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `https://agentclientprotocol.com/protocol/session-updates` returned 404. No claims depend on that unavailable page; shared ACP semantics beyond the runtime-specific documentation remain unconfirmed.

### A deterministic gate cannot prove every semantic equivalence claim. The safe resolution is asymmetric: deterministic checks can approve literal/structural invariants, while semantic uncertainty can only reject and fall back. [SOURCE: https://genai.owasp.org/llmrisk/llm01-prompt-injection/] [INFERENCE: fail-closed consequence of non-fool-proof model behavior] -- BLOCKED (iteration 2, 1 attempts)
- What was tried: A deterministic gate cannot prove every semantic equivalence claim. The safe resolution is asymmetric: deterministic checks can approve literal/structural invariants, while semantic uncertainty can only reject and fall back. [SOURCE: https://genai.owasp.org/llmrisk/llm01-prompt-injection/] [INFERENCE: fail-closed consequence of non-fool-proof model behavior]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A deterministic gate cannot prove every semantic equivalence claim. The safe resolution is asymmetric: deterministic checks can approve literal/structural invariants, while semantic uncertainty can only reject and fall back. [SOURCE: https://genai.owasp.org/llmrisk/llm01-prompt-injection/] [INFERENCE: fail-closed consequence of non-fool-proof model behavior]

### A localhost-shaped URL cannot prove offline execution: Ollama compatibility documents a localhost example, while llama.cpp separately exposes host, offline, model-download, and remote-server controls. Deployment and egress must be recorded and enforced independently. [SOURCE: https://docs.ollama.com/api/openai-compatibility] [SOURCE: https://raw.githubusercontent.com/ggml-org/llama.cpp/master/tools/server/README.md] -- BLOCKED (iteration 3, 1 attempts)
- What was tried: A localhost-shaped URL cannot prove offline execution: Ollama compatibility documents a localhost example, while llama.cpp separately exposes host, offline, model-download, and remote-server controls. Deployment and egress must be recorded and enforced independently. [SOURCE: https://docs.ollama.com/api/openai-compatibility] [SOURCE: https://raw.githubusercontent.com/ggml-org/llama.cpp/master/tools/server/README.md]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A localhost-shaped URL cannot prove offline execution: Ollama compatibility documents a localhost example, while llama.cpp separately exposes host, offline, model-download, and remote-server controls. Deployment and egress must be recorded and enforced independently. [SOURCE: https://docs.ollama.com/api/openai-compatibility] [SOURCE: https://raw.githubusercontent.com/ggml-org/llama.cpp/master/tools/server/README.md]

### A narrow grep over the captured Claude web response exceeded the tool record limit. The official page’s directly returned lifecycle table and the local reference supplied the used evidence. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: A narrow grep over the captured Claude web response exceeded the tool record limit. The official page’s directly returned lifecycle table and the local reference supplied the used evidence.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A narrow grep over the captured Claude web response exceeded the tool record limit. The official page’s directly returned lifecycle table and the local reference supplied the used evidence.

### A single universal lifecycle hook: the six runtimes expose materially different boundaries; only Claude confirms a dedicated presentation-only hook. [SOURCE: https://code.claude.com/docs/en/hooks] [SOURCE: https://opencode.ai/docs/server/] -- BLOCKED (iteration 1, 1 attempts)
- What was tried: A single universal lifecycle hook: the six runtimes expose materially different boundaries; only Claude confirms a dedicated presentation-only hook. [SOURCE: https://code.claude.com/docs/en/hooks] [SOURCE: https://opencode.ai/docs/server/]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A single universal lifecycle hook: the six runtimes expose materially different boundaries; only Claude confirms a dedicated presentation-only hook. [SOURCE: https://code.claude.com/docs/en/hooks] [SOURCE: https://opencode.ai/docs/server/]

### A universal table parser is not available from CommonMark because tables are a dialect extension. Version-pinned runtime fixtures must declare Markdown dialect and parser version before implementation. [SOURCE: https://spec.commonmark.org/0.31.2/] -- BLOCKED (iteration 2, 1 attempts)
- What was tried: A universal table parser is not available from CommonMark because tables are a dialect extension. Version-pinned runtime fixtures must declare Markdown dialect and parser version before implementation. [SOURCE: https://spec.commonmark.org/0.31.2/]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A universal table parser is not available from CommonMark because tables are a dialect extension. Version-pinned runtime fixtures must declare Markdown dialect and parser version before implementation. [SOURCE: https://spec.commonmark.org/0.31.2/]

### Arrival order as canonical assembly order: JSON-RPC permits concurrent batch responses in any order, and SSE reconnects can replay from `Last-Event-ID`. [SOURCE: https://www.jsonrpc.org/specification] [SOURCE: https://html.spec.whatwg.org/multipage/server-sent-events.html] -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Arrival order as canonical assembly order: JSON-RPC permits concurrent batch responses in any order, and SSE reconnects can replay from `Last-Event-ID`. [SOURCE: https://www.jsonrpc.org/specification] [SOURCE: https://html.spec.whatwg.org/multipage/server-sent-events.html]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Arrival order as canonical assembly order: JSON-RPC permits concurrent batch responses in any order, and SSE reconnects can replay from `Last-Event-ID`. [SOURCE: https://www.jsonrpc.org/specification] [SOURCE: https://html.spec.whatwg.org/multipage/server-sent-events.html]

### Automatic local-to-hosted fallback, even to a zero-retention route, because egress consent and residency remain separate decisions. [SOURCE: https://opencode.ai/docs/go/] [INFERENCE: privacy-class and consent boundary] -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Automatic local-to-hosted fallback, even to a zero-retention route, because egress consent and residency remain separate decisions. [SOURCE: https://opencode.ai/docs/go/] [INFERENCE: privacy-class and consent boundary]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Automatic local-to-hosted fallback, even to a zero-retention route, because egress consent and residency remain separate decisions. [SOURCE: https://opencode.ai/docs/go/] [INFERENCE: privacy-class and consent boundary]

### Automatic readability or model-judge scores as proof of semantic or perceptual parity. [SOURCE: specs/cli-external-orchestration/042-improved-communication/001-research-strategy/research/lineages/gpt-sol-fast/iterations/iteration-002.md:26] [INFERENCE: diagnostic metrics cannot authorize a projection] -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Automatic readability or model-judge scores as proof of semantic or perceptual parity. [SOURCE: specs/cli-external-orchestration/042-improved-communication/001-research-strategy/research/lineages/gpt-sol-fast/iterations/iteration-002.md:26] [INFERENCE: diagnostic metrics cannot authorize a projection]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Automatic readability or model-judge scores as proof of semantic or perceptual parity. [SOURCE: specs/cli-external-orchestration/042-improved-communication/001-research-strategy/research/lineages/gpt-sol-fast/iterations/iteration-002.md:26] [INFERENCE: diagnostic metrics cannot authorize a projection]

### Content-bearing telemetry or raw provider errors; lifecycle enums and keyed correlation are sufficient for operations. [SOURCE: https://github.com/open-telemetry/semantic-conventions-genai] [INFERENCE: data-minimization consequence] -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Content-bearing telemetry or raw provider errors; lifecycle enums and keyed correlation are sufficient for operations. [SOURCE: https://github.com/open-telemetry/semantic-conventions-genai] [INFERENCE: data-minimization consequence]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Content-bearing telemetry or raw provider errors; lifecycle enums and keyed correlation are sufficient for operations. [SOURCE: https://github.com/open-telemetry/semantic-conventions-genai] [INFERENCE: data-minimization consequence]

### Current mutable documentation cannot substitute for version-pinned provider/build/model fixtures. [SOURCE: https://opencode.ai/docs/go/] [SOURCE: https://raw.githubusercontent.com/ggml-org/llama.cpp/master/tools/server/README.md] -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Current mutable documentation cannot substitute for version-pinned provider/build/model fixtures. [SOURCE: https://opencode.ai/docs/go/] [SOURCE: https://raw.githubusercontent.com/ggml-org/llama.cpp/master/tools/server/README.md]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Current mutable documentation cannot substitute for version-pinned provider/build/model fixtures. [SOURCE: https://opencode.ai/docs/go/] [SOURCE: https://raw.githubusercontent.com/ggml-org/llama.cpp/master/tools/server/README.md]

### Pi finalized-message replacement as the projector: the documented handler can replace the lifecycle message, violating the immutable-canonical-lane requirement. [SOURCE: https://raw.githubusercontent.com/earendil-works/pi/main/packages/coding-agent/docs/extensions.md] -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Pi finalized-message replacement as the projector: the documented handler can replace the lifecycle message, violating the immutable-canonical-lane requirement. [SOURCE: https://raw.githubusercontent.com/earendil-works/pi/main/packages/coding-agent/docs/extensions.md]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Pi finalized-message replacement as the projector: the documented handler can replace the lifecycle message, violating the immutable-canonical-lane requirement. [SOURCE: https://raw.githubusercontent.com/earendil-works/pi/main/packages/coding-agent/docs/extensions.md]

### Reconstructing the original from placeholders, a Markdown AST, or decoded text: parsing and decoding can erase byte-level distinctions. [SOURCE: https://spec.commonmark.org/0.31.2/] [SOURCE: https://html.spec.whatwg.org/multipage/server-sent-events.html] -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Reconstructing the original from placeholders, a Markdown AST, or decoded text: parsing and decoding can erase byte-level distinctions. [SOURCE: https://spec.commonmark.org/0.31.2/] [SOURCE: https://html.spec.whatwg.org/multipage/server-sent-events.html]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Reconstructing the original from placeholders, a Markdown AST, or decoded text: parsing and decoding can erase byte-level distinctions. [SOURCE: https://spec.commonmark.org/0.31.2/] [SOURCE: https://html.spec.whatwg.org/multipage/server-sent-events.html]

### Reusing Cursor’s ACP field mapping unchanged for Devin: both expose ACP, but the consulted Devin source confirms transport rather than identical update payloads. [SOURCE: https://docs.devin.ai/cli/reference/commands] [SOURCE: https://cursor.com/docs/cli/acp] -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Reusing Cursor’s ACP field mapping unchanged for Devin: both expose ACP, but the consulted Devin source confirms transport rather than identical update payloads. [SOURCE: https://docs.devin.ai/cli/reference/commands] [SOURCE: https://cursor.com/docs/cli/acp]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Reusing Cursor’s ACP field mapping unchanged for Devin: both expose ACP, but the consulted Devin source confirms transport rather than identical update payloads. [SOURCE: https://docs.devin.ai/cli/reference/commands] [SOURCE: https://cursor.com/docs/cli/acp]

### Suppressing original chunks until a rewrite succeeds: it turns missing-final, timeout, cancellation, and validator failure into blank or reconstructed output rather than exact fallback. [SOURCE: specs/cli-external-orchestration/042-improved-communication/001-research-strategy/research/lineages/gpt-sol-fast/iterations/iteration-001.md:30] -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Suppressing original chunks until a rewrite succeeds: it turns missing-final, timeout, cancellation, and validator failure into blank or reconstructed output rather than exact fallback. [SOURCE: specs/cli-external-orchestration/042-improved-communication/001-research-strategy/research/lineages/gpt-sol-fast/iterations/iteration-001.md:30]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Suppressing original chunks until a rewrite succeeds: it turns missing-final, timeout, cancellation, and validator failure into blank or reconstructed output rather than exact fallback. [SOURCE: specs/cli-external-orchestration/042-improved-communication/001-research-strategy/research/lineages/gpt-sol-fast/iterations/iteration-001.md:30]

### The GitHub HTML view of Pi’s extension documentation failed to render content; the raw repository URL supplied the primary document instead. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: The GitHub HTML view of Pi’s extension documentation failed to render content; the raw repository URL supplied the primary document instead.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The GitHub HTML view of Pi’s extension documentation failed to render content; the raw repository URL supplied the primary document instead.

### Treating an LLM judge as a deterministic semantic proof: OWASP describes prompt injection prevention as non-fool-proof and recommends deterministic validation boundaries. [SOURCE: https://genai.owasp.org/llmrisk/llm01-prompt-injection/] -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Treating an LLM judge as a deterministic semantic proof: OWASP describes prompt injection prevention as non-fool-proof and recommends deterministic validation boundaries. [SOURCE: https://genai.owasp.org/llmrisk/llm01-prompt-injection/]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating an LLM judge as a deterministic semantic proof: OWASP describes prompt injection prevention as non-fool-proof and recommends deterministic validation boundaries. [SOURCE: https://genai.owasp.org/llmrisk/llm01-prompt-injection/]

### Treating provider name or OpenAI compatibility as a privacy or capability class. [SOURCE: https://opencode.ai/docs/go/] [SOURCE: https://docs.ollama.com/api/openai-compatibility] -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Treating provider name or OpenAI compatibility as a privacy or capability class. [SOURCE: https://opencode.ai/docs/go/] [SOURCE: https://docs.ollama.com/api/openai-compatibility]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating provider name or OpenAI compatibility as a privacy or capability class. [SOURCE: https://opencode.ai/docs/go/] [SOURCE: https://docs.ollama.com/api/openai-compatibility]

<!-- /ANCHOR:exhausted-approaches -->

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
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

<!-- /ANCHOR:ruled-out-directions -->

<!-- ANCHOR:divergence-frontier -->
## 10A. SATURATED DIRECTIONS AND DIVERGENCE FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Saturated: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

<!-- /ANCHOR:divergence-frontier -->

<!-- ANCHOR:carried-forward-open-questions -->
## 11A. CARRIED-FORWARD OPEN QUESTIONS
- How should assembly implement streaming, ordering, duplication, concurrency, cancellation, timeout, retry, and atomic commit against version-pinned event fixtures? (iteration 1)
- Which deterministic protected-span and semantic fidelity gates reject unsafe rewrites and return the exact original? (iteration 1)
- How should privacy-aware provider routing cover OpenCode Go DeepSeek V4 Flash and local providers? (iteration 1)
- Which observability and perceptual-parity evaluation gates make the architecture testable? (iteration 1)
- Which exact Devin ACP and Claude MessageDisplay fields vary by installed version? (iteration 1)
- Which observability, perceptual-parity evaluation, and downstream phase boundaries make the architecture testable and implementable? (iteration 2)
- How should privacy-aware provider routing cover OpenCode Go DeepSeek V4 Flash, Ollama, llama.cpp, and other hosted/local providers without unapproved egress or capability assumptions? (iteration 2)
- Which exact event fields and Markdown dialect capabilities appear in version-pinned fixtures for Claude, Devin, and the other four adapters? (iteration 2)
- Which exact version-pinned runtime event fields, Markdown dialect/parser behaviors, provider request/stream/error shapes, Ollama native timing/keep-alive fields, and llama.cpp build/model capability outcomes appear in executable fixtures? (iteration 3)

<!-- /ANCHOR:carried-forward-open-questions -->

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
[All tracked questions are resolved]

<!-- /ANCHOR:next-focus -->
<!-- MACHINE-OWNED: END -->

## 12. KNOWN CONTEXT
- The phase packet already records a dated initial capability matrix and provider matrix, but this lineage must independently verify load-bearing claims before relying on them. [SOURCE: specs/cli-external-orchestration/042-improved-communication/001-research-strategy/plan.md:264]
- The reference buffers per-chunk `MessageDisplay` deltas to files and commits a whole-message rewrite only on `final:true`; replace mode suppresses non-final original chunks before validation. [SOURCE: specs/cli-external-orchestration/042-improved-communication/context/claudish-to-english-main/rewrite.sh:89]
- The reference prompt requests preservation but has no deterministic protected-span or semantic validator. [SOURCE: specs/cli-external-orchestration/042-improved-communication/context/claudish-to-english-main/rewrite.sh:149]
- Raw external session and message identifiers become filesystem paths, and stale buffers are recursively removed; this is unsafe to generalize. [SOURCE: specs/cli-external-orchestration/042-improved-communication/context/claudish-to-english-main/rewrite.sh:99]
- Memory retrieval returned no canonical packet records for this scoped query; packet documents and primary sources remain the evidence base.
- `resource-map.md` was not present at phase init; skipping the input coverage gate.

## 13. RESEARCH BOUNDARIES
- Max iterations: 3
- Stop policy: max-iterations; convergence is telemetry until iteration 3
- Convergence threshold: 0.05
- Per-iteration budget: 12 tool calls, 30 minutes
- Progressive synthesis: false; final synthesis owns `research.md`
- Allowed write root: `specs/cli-external-orchestration/042-improved-communication/001-research-strategy/research/lineages/gpt-sol-fast`
- Session: `fanout-gpt-sol-fast-1786433150940-mdbr01`
- Started: 2026-08-11T07:28:40Z
