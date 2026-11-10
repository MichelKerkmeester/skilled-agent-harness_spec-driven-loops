---
title: Deep Research Strategy Template
description: Runtime template copied to research/ during initialization to track research progress, focus decisions, and outcomes across iterations.
trigger_phrases:
  - "deep research strategy"
  - "research strategy template"
  - "research session tracking"
  - "exhausted research approaches"
  - "research stop conditions"
  - "ruled out research directions"
importance_tier: normal
contextType: planning
version: 1.14.0.19
---

# Deep Research Strategy - Session Tracking Template

Runtime template copied to `system-speckit/031-memory-reindex-embed-performance/research/` during initialization. Tracks research progress across iterations.

## 1. OVERVIEW

### Purpose

Serves as the "persistent brain" for a deep research session. Records what to investigate, what worked, what failed, and where to focus next. Read by the orchestrator and agents at every iteration.

### Usage

- **Init:** Orchestrator copies this template to `{spec_folder}/research/deep-research-strategy.md` and populates Topic, Key Questions, Known Context, and Research Boundaries from config and memory context.
- **Per iteration:** Agent reads Next Focus, writes iteration evidence, and the reducer refreshes What Worked/Failed, answered questions, carried-forward questions, ruled-out directions, and Next Focus.
- **Mutability:** Mutable — analyst-owned sections remain stable, while machine-owned sections are rewritten by the reducer after each iteration. Section 3 is a generated projection from the reducer registry.
- **Protection:** Shared state with explicit ownership boundaries. Orchestrator validates consistency on resume.

### Question Injection Surface

Use `system-speckit/031-memory-reindex-embed-performance/research/inbox.jsonl` to append external questions during an active run. Each line is one JSON object with:

- `id`: stable inbox record identifier
- `text`: question text to promote
- `source`: concrete source label, such as an angle bank entry, analyst strategy, or operator note
- `origin`: one of `angle-bank`, `analyst-strategy`, `operator`, or `legacy-import`
- `injectedAtIteration`: iteration number when the question was introduced
- `promotedQuestionId`: promoted registry question id, or `null` until promotion

The reducer reads the inbox on every reduce step and carries `origin` into the question registry and dashboard badges. Direct edits to Section 3 still work as a compatibility path, but they are attributed as `legacy-import`.

Question ownership is explicit:

- Inbox rows are immutable input.
- The reducer registry is canonical question state.
- Section 3 is rendered only from the registry view.

When an inbox row targets an existing registry question but carries different text, the reducer keeps the registry value, records `operatorDecision: needs_decision`, and appends a `question_conflict` event with both `inboxValue` and `registryValue`.

---

## 2. TOPIC
Harden and refine the mk-spec-memory daemon/startup/MCP issues surfaced in the 031 packet: (1) audit for other unaudited call sites of the persistQualityLoopContent scan-write-back bug class beyond startupScan/file-watcher/force-reindex; (2) root-cause and fix the OpenCode MCP "server unavailable/failed" transient startup race for mk-spec-memory; (3) fix the model-server-supervision.cjs sun_path-overflow latent bug (falls back to an over-104-byte macOS socket path when HF_EMBED_SERVER_URL/SPECKIT_IPC_SOCKET_DIR are absent); (4) diagnose and harden the single-writer lock contention on context-index.sqlite that caused a memory_index_scan to hang 30 minutes with no response; (5) general daemon startup/lease/re-election robustness given heavy concurrent-session usage of this shared repo.

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [ ] Is the persistQualityLoopContent write-back a one-off bug class or are there other still-unaudited callers of indexMemoryFile / indexSingleFile across the codebase (e.g. memory_ingest_start, retry-queue reprocessing, checkpoint rebuild paths) that could reintroduce the same destructive write-back?
- [ ] What is the exact mechanism inside mk-spec-memory-launcher.cjs (live-owner detection, IPC round-trip, bootstrap lock, hf-model-server demand-listener setup) that can exceed OpenCode's MCP connection timeout during a cold/contended boot, and what's the minimal robustness fix (retry, faster ack, or a client-side reconnect nudge)?
- [ ] Is the sun_path-overflow bug in resolveModelServerSocketPath() reachable under any real (non-bare-shell) invocation path today, and what is the safest short-path fallback default that doesn't depend on env vars being set correctly?
- [ ] What specifically holds the single-writer lock on context-index.sqlite for 30+ minutes, and is that a legitimate long operation (e.g. a large embedding backfill) or a genuine deadlock/leak that needs a timeout or lock-holder diagnostic?
- [ ] Given this repo runs many concurrent OpenCode/Claude Code sessions against ONE shared daemon, what are the highest-leverage robustness improvements to daemon startup, lease/re-election, and lock arbitration to reduce contention-driven failures like the ones seen this session?

<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS
- Re-litigating the already-fixed persistQualityLoopContent scan-origin gate in memory-save.ts/context-server.ts (031's existing fix) — this research audits for OTHER unaudited instances of the same bug class, not re-verifying the shipped fix.
- Redesigning the daemon's overall architecture (single-writer lock model, lease/re-election protocol) from scratch — focus on incremental hardening of the existing design, not a rewrite.
- The original reindex-performance measurement objective (REQ-001–REQ-005 in this packet's spec.md) — that remains a separate, not-yet-started workstream.
- Implementing fixes directly as part of this research loop — this session investigates and proposes; implementation is a follow-up (`/speckit:plan` / `/speckit:implement`).

---

## 5. STOP CONDITIONS
- All 5 key questions have concrete, evidence-based answers (root cause identified via code reading, not speculation).
- A further iteration would only re-confirm findings already backed by direct code/log evidence, with no new call sites, mechanisms, or robustness gaps surfacing.
- 10 iterations reached (hard cap) regardless of convergence state.

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
[None yet]

<!-- /ANCHOR:answered-questions -->

---

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
[None yet]

<!-- /ANCHOR:what-worked -->

---

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
[None yet]

<!-- /ANCHOR:what-failed -->

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
[No exhausted approach categories yet]

<!-- /ANCHOR:exhausted-approaches -->

---

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
[None yet]

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
- Which incremental daemon lease, re-election, and lock-arbitration changes have the best concurrency payoff? (iteration 1)
- What exact launcher sequence exceeds OpenCode's MCP startup timeout during cold or contended boot? (iteration 1)
- Is the model-server socket fallback reachable outside bare-shell invocation, and what short fallback is safest? (iteration 1)
- What holds the SQLite writer lock during the observed long scan stall? (iteration 1)
- What exact `mcp_timeout` default and retry behavior does the active OpenCode version apply, and does its failure timer begin at process spawn, transport creation, or initialize dispatch? (iteration 2)
- What exact `mcp_timeout` default and retry behavior does the active OpenCode version apply? (iteration 3)

<!-- /ANCHOR:carried-forward-open-questions -->

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
What exact `mcp_timeout` default and retry behavior does the active OpenCode version apply?

<!-- /ANCHOR:next-focus -->

---

<!-- MACHINE-OWNED: END -->
## 12. KNOWN CONTEXT
Populated from this session's direct prior work (no memory_context prior-research lookup performed yet; will be layered in before iteration 1 dispatch).

### Bounded Context Snapshot

- Source pointers: `.opencode/skills/system-spec-kit/mcp-server/handlers/memory-save.ts` (indexMemoryFile, processPreparedMemory, persistQualityLoopContent gate at ~line 2974), `.opencode/skills/system-spec-kit/mcp-server/context-server.ts` (startupScan, file-watcher reindexFn, memory_ingest_start processFile callback), `.opencode/skills/system-spec-kit/mcp-server/handlers/memory-index.ts` (indexSingleFile, runMemoryIndexScan), `.opencode/bin/mk-spec-memory-launcher.cjs` (live-owner detection, lease bridging, hf-model-server demand listener), `.opencode/bin/lib/model-server-supervision.cjs` (resolveModelServerSocketPath, sun_path assertion).
- Reuse candidates: the existing regression-test pattern in `mcp-server/tests/handler-memory-index.vitest.ts` (schema-backed real-DB harness) as a template for any new tests; the existing `SPECKIT_*_ENABLED`-style env-var-gated-default-off convention for any new hardening flags.
- Integration points: the mk-spec-memory MCP registration in `opencode.json`, the daemon lease file protocol, `context-index.sqlite`'s single-writer lock (referenced in generate-context.js's Step 11.5 skip warning, incident class "026/004/012").
- Constraints and risks: this is shared critical infrastructure with heavy concurrent-session usage right now — any proposed fix must be evaluated for blast radius before implementation (this research proposes; it does not implement). Code Graph is empty for this session (0 nodes) — rely on Grep/Read, not code_graph_query, for code discovery.

---

## 13. RESEARCH BOUNDARIES
- Max iterations: 10
- Convergence threshold: 0.05
- Per-iteration budget: 12 tool calls, 10 minutes
- Progressive synthesis: true (default)
- research/research.md ownership: workflow-owned canonical synthesis output
- Lifecycle branches: `resume`, `restart` (live); `fork`, `completed-continue` (deferred, not runtime-wired)
- Machine-owned sections: reducer controls Sections 3, 6, 7-11A, including Section 10A pivot lineage
- Question injection surface: `system-speckit/031-memory-reindex-embed-performance/research/inbox.jsonl`
- Question conflict owner: reducer registry; `question_conflict` events surface inbox/registry disagreements for operator decision
- Canonical pause sentinel: `research/.deep-research-pause`
- Capability matrix: `.opencode/skills/system-deep-loop/deep-research/assets/runtime-capabilities.json`
- Capability matrix doc: `.opencode/skills/system-deep-loop/deep-research/references/guides/capability-matrix.md`
- Capability resolver: `.opencode/skills/system-deep-loop/deep-research/scripts/runtime-capabilities.cjs`
- Current generation: 1
- Started: 2026-07-23T09:09:54.000Z
