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
version: 1.14.3.0
---

# Deep Research Strategy - Session Tracking Template

Runtime template copied to `{spec_folder}/research/` during initialization. Tracks research progress across iterations.

## 1. OVERVIEW

### Purpose

Serves as the "persistent brain" for a deep research session. Records what to investigate, what worked, what failed, and where to focus next. Read by the orchestrator and agents at every iteration.

### Usage

- **Init:** Orchestrator copies this template to `{spec_folder}/research/deep-research-strategy.md` and populates Topic, Key Questions, Known Context, and Research Boundaries from config and memory context.
- **Per iteration:** Agent reads Next Focus, writes iteration evidence, and the reducer refreshes What Worked/Failed, answered questions, carried-forward questions, ruled-out directions, and Next Focus.
- **Mutability:** Mutable — analyst-owned sections remain stable, while machine-owned sections are rewritten by the reducer after each iteration. Section 3 is a generated projection from the reducer registry.
- **Protection:** Shared state with explicit ownership boundaries. Orchestrator validates consistency on resume.

### Question Injection Surface

Use `{spec_folder}/research/inbox.jsonl` to append external questions during an active run. Each line is one JSON object with:

- `id`: stable inbox record identifier
- `text`: question text to promote
- `source`: concrete source label, such as an angle bank entry, analyst strategy, or operator note
- `origin`: one of `angle-bank`, `analyst-strategy`, `frontier`, `operator`, or `legacy-import`
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
What changes would make the deep-loop fan-out orchestration trustworthy and identical across CLI runtimes, ranked by value over effort, given what the last two expansive dogfood runs taught?

Read the code at HEAD b8003a7df42. The spec folder is specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode (SPEC below). Inputs: SPEC/scratch/dogfood-review-gen2.md and SPEC/scratch/dogfood-research-gen3.md (the conductor logs of the previous fan-out review and research), and the previous research with its improvement-backlog.md, now the newest folder under SPEC/research_archive/. Commits adade6c293e..07cf5f92b61 built backlog rows 1-11, 14, 16b, 18a and 19-26: build on them and do not re-report them. Every recommendation names one concrete change, cites file:line (or a source URL for prior art), and states value, effort (S/M/L) and risk.

Q1 Lineage honesty: one lineage wrote 9 of 12 review passes 20-60 s apart, most with zero findings, and reported newInfoRatio 1.0 on all 10 research passes; model-written timestamps were placeholders, whole minutes or future-dated. Which runner-side signals (pass duration, cited locations, tool calls, repeated sources, gateway receipt time) would detect an unexamined pass or a false stamp without trusting the model, and how should convergence and fanout-merge.cjs weigh such a pass?

Q2 Cross-CLI execution contract: across native, cli-claude-code, cli-opencode, cli-codex, cli-pi, cli-devin, cli-cursor, cli-deepseek-harness and cli-mistral-vibe, where do permission and sandbox, effort, output format (cli-claude-code still uses --output-format text, so it reports no tokens or cost), session resume, failure classes, log shape and prompt channel still differ in fanout-run.cjs LINEAGE_COMMAND_ADAPTERS, runtime/lib/deep-loop/executor-config.ts and dispatch-iteration.cjs (runClaude, runCodex)? What single adapter contract and conformance test would remove the differences, including the agent and command mirrors (.claude .codex .pi .dsh .vibe .opencode against .skilled)?

Q3 Orchestration robustness: process tree and kill semantics (the runner re-executes itself, so killing the runner pid misses the lineage CLIs), mid-run provider quota and --only-lineage reruns, re-entrancy, the ledger as the only live view, capability-aware dealing of frontier nodes (a web question to a lineage with web tools) and a root dashboard for a fan-out.

Q4 Frontier economics: the node cap and growth slots (5 of 7 proposals pruned at iteration 1 last run), the depth-band split, duplicate work, and whether and in which order to build the held backlog rows 12 (one projectFrontier), 13 (one executor path), 29 (alias and dead-probe deletion) and 30 (per-node research dashboard).

Q5 Prior art: how multi-agent orchestrators and eval harnesses (for example Inspect eval sets, OpenHands, LangGraph, the Claude Agent SDK, AutoGen) verify worker honesty, normalize heterogeneous executors and rerun partial failures. This is the only question that needs the web; cite source URLs, and never put personal data such as an email address in a search query or request.

Q6 Bookkeeping that fires on a healthy run: the synthesis_incomplete alarm when a finding is refined into an earlier id (runtime/scripts/synthesis-closeout.cjs:373), the research commit step that fails on an ignored pathspec exclude (deep-research.yaml:2158), the closeout lineageId taken from the parent session, and any other invariant or warning this run shows firing without a real fault.

Report only: change no code or doc outside your own lineage directory.

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [x] Lineage honesty: which runner-side signals (pass duration, cited file:line count, tool calls, repeated sources, gateway receipt time against the model-written timestamp) would flag an unexamined pass or a false stamp without trusting the model, and how should convergence.cjs and fanout-merge.cjs weigh such a pass?
- [x] Orchestration robustness: what changes fix the process tree and kill semantics (the runner re-executes itself), mid-run provider quota and --only-lineage reruns, re-entrancy, the ledger as the only live view, capability-aware dealing of frontier nodes and a root dashboard for a fan-out?
- [x] Prior art: how do multi-agent orchestrators and eval harnesses (Inspect eval sets, OpenHands, LangGraph, the Claude Agent SDK, AutoGen) verify worker honesty, normalize heterogeneous executors and rerun partial failures, and which idea fits this runner? Cite source URLs; no personal data in any query.
- [x] Which per-runtime JSON log shapes (claude stream-json, codex --json, opencode, pi, devin, cursor, vibe) expose timestamped tool-call events that one passEvidence extractor could bucket by gateway commit time?
- [x] What unexamined-pass thresholds flag the gen2 review deepseek stamps without flagging the gen3 research deepseek passes or any opus pass, and does the observed ratio change any committed lineage stop iteration?

<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS
- Changing any code or doc outside this lineage directory (report only).
- Re-reporting backlog rows already built in adade6c293e..07cf5f92b61 (rows 1-11, 14, 16b, 18a, 19-26).
- The frontier nodes dealt to the deepseek lineage (F-1-002, F-1-004, F-1-006), except where they bear on this lineage nodes.

---

## 5. STOP CONDITIONS
- Every frontier node in this lineage share (F-1-001, F-1-003, F-1-005) answered with ranked, cited recommendations.
- maxIterations (10) reached.

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
- Lineage honesty: which runner-side signals (pass duration, cited file:line count, tool calls, repeated sources, gateway receipt time against the model-written timestamp) would flag an unexamined pass or a false stamp without trusting the model, and how should convergence.cjs and fanout-merge.cjs weigh such a pass?
- Orchestration robustness: what changes fix the process tree and kill semantics (the runner re-executes itself), mid-run provider quota and --only-lineage reruns, re-entrancy, the ledger as the only live view, capability-aware dealing of frontier nodes and a root dashboard for a fan-out?
- Prior art: how do multi-agent orchestrators and eval harnesses (Inspect eval sets, OpenHands, LangGraph, the Claude Agent SDK, AutoGen) verify worker honesty, normalize heterogeneous executors and rerun partial failures, and which idea fits this runner? Cite source URLs; no personal data in any query.
- Which per-runtime JSON log shapes (claude stream-json, codex --json, opencode, pi, devin, cursor, vibe) expose timestamped tool-call events that one passEvidence extractor could bucket by gateway commit time?
- What unexamined-pass thresholds flag the gen2 review deepseek stamps without flagging the gen3 research deepseek passes or any opus pass, and does the observed ratio change any committed lineage stop iteration?

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
### **A minimum-reads threshold:** it flags real context-carried passes (finding 5). -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **A minimum-reads threshold:** it flags real context-carried passes (finding 5).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A minimum-reads threshold:** it flags real context-carried passes (finding 5).

### **A run-level lock through `loop-lock.cjs`.** That lock is per-loop and per-artifact-dir, and the lineages already hold their own. A runner lock at the base directory is simpler (finding 4). -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **A run-level lock through `loop-lock.cjs`.** That lock is per-loop and per-artifact-dir, and the lineages already hold their own. A runner lock at the base directory is simpler (finding 4).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A run-level lock through `loop-lock.cjs`.** That lock is per-loop and per-artifact-dir, and the lineages already hold their own. A runner lock at the base directory is simpler (finding 4).

### **AutoGen's text-mention termination as a model:** a stop the model announces itself is exactly the self-report this work is trying to avoid. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **AutoGen's text-mention termination as a model:** a stop the model announces itself is exactly the self-report this work is trying to avoid.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **AutoGen's text-mention termination as a model:** a stop the model announces itself is exactly the self-report this work is trying to avoid.

### **Finding-id novelty as an observed ratio:** ids are minted fresh on every pass. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **Finding-id novelty as an observed ratio:** ids are minted fresh on every pass.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Finding-id novelty as an observed ratio:** ids are minted fresh on every pass.

### **Inspect `working_time` as a pass-duration signal:** its own docs say it can undercount overlapped work, and iteration 1 already found duration alone weak. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **Inspect `working_time` as a pass-duration signal:** its own docs say it can undercount overlapped work, and iteration 1 already found duration alone weak.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Inspect `working_time` as a pass-duration signal:** its own docs say it can undercount overlapped work, and iteration 1 already found duration alone weak.

### **Mirrors as a source of fan-out divergence:** the persona is inlined from `.skilled` (finding 7). -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **Mirrors as a source of fan-out divergence:** the persona is inlined from `.skilled` (finding 7).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Mirrors as a source of fan-out divergence:** the persona is inlined from `.skilled` (finding 7).

### **Pass duration as a standalone signal:** real deepseek passes run as short as 33 s (finding 5). -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **Pass duration as a standalone signal:** real deepseek passes run as short as 33 s (finding 5).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Pass duration as a standalone signal:** real deepseek passes run as short as 33 s (finding 5).

### **The record's `toolsUsed` and `sourcesQueried`:** both are model-authored (finding 6). -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **The record's `toolsUsed` and `sourcesQueried`:** both are model-authored (finding 6).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The record's `toolsUsed` and `sourcesQueried`:** both are model-authored (finding 6).

### **Treating a quota hit as retryable.** That would burn the same allowance again. The current non-retryable class is right; only the rerun path is missing. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **Treating a quota hit as retryable.** That would burn the same allowance again. The current non-retryable class is right; only the rerun path is missing.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Treating a quota hit as retryable.** That would burn the same allowance again. The current non-retryable class is right; only the rerun path is missing.

### Claude Agent SDK hooks: a `PostToolUse` hook could keep an audit trail [SOURCE: https://code.claude.com/docs/en/agent-sdk/hooks]. Installing one means writing into the operator's Claude config dir, though, and stream-json gives the same events without that write. Dropped in favour of finding 2. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Claude Agent SDK hooks: a `PostToolUse` hook could keep an audit trail [SOURCE: https://code.claude.com/docs/en/agent-sdk/hooks]. Installing one means writing into the operator's Claude config dir, though, and stream-json gives the same events without that write. Dropped in favour of finding 2.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Claude Agent SDK hooks: a `PostToolUse` hook could keep an audit trail [SOURCE: https://code.claude.com/docs/en/agent-sdk/hooks]. Installing one means writing into the operator's Claude config dir, though, and stream-json gives the same events without that write. Dropped in favour of finding 2.

### None. -- BLOCKED (iteration 5, 4 attempts)
- What was tried: None.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: None.

<!-- /ANCHOR:exhausted-approaches -->

---

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
- **Pass duration as a standalone signal:** real deepseek passes run as short as 33 s (finding 5). (iteration 1)
- **The record's `toolsUsed` and `sourcesQueried`:** both are model-authored (finding 6). (iteration 1)
- None. (iteration 1)
- **A run-level lock through `loop-lock.cjs`.** That lock is per-loop and per-artifact-dir, and the lineages already hold their own. A runner lock at the base directory is simpler (finding 4). (iteration 2)
- **Treating a quota hit as retryable.** That would burn the same allowance again. The current non-retryable class is right; only the rerun path is missing. (iteration 2)
- **AutoGen's text-mention termination as a model:** a stop the model announces itself is exactly the self-report this work is trying to avoid. (iteration 3)
- **Inspect `working_time` as a pass-duration signal:** its own docs say it can undercount overlapped work, and iteration 1 already found duration alone weak. (iteration 3)
- Claude Agent SDK hooks: a `PostToolUse` hook could keep an audit trail [SOURCE: https://code.claude.com/docs/en/agent-sdk/hooks]. Installing one means writing into the operator's Claude config dir, though, and stream-json gives the same events without that write. Dropped in favour of finding 2. (iteration 3)
- **A minimum-reads threshold:** it flags real context-carried passes (finding 5). (iteration 4)
- **Finding-id novelty as an observed ratio:** ids are minted fresh on every pass. (iteration 4)
- **Mirrors as a source of fan-out divergence:** the persona is inlined from `.skilled` (finding 7). (iteration 5)

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
[All tracked questions are resolved]

<!-- /ANCHOR:next-focus -->

---

<!-- MACHINE-OWNED: END -->
## 12. KNOWN CONTEXT
Prior research: research_archive/20261120T125555Z (research.md, improvement-backlog.md). Conductor logs: scratch/dogfood-review-gen2.md, scratch/dogfood-research-gen3.md. Built rows: adade6c293e..07cf5f92b61. resource-map.md not present; skipping coverage gate.

### Bounded Context Snapshot

Populate during initialization when the target is codebase-scoped. Keep this pointer-based and small:

- Source pointers: paths, symbols, or resource-map entries relevant to the topic.
- Reuse candidates: existing utilities, patterns, docs, or agents worth extending.
- Integration points: files or contracts the research is likely to touch.
- Constraints and risks: scope limits, stale graph or memory gaps, and known non-goals.

Do not inline full source bodies. Do not dispatch the retired standalone context loop. Use `@context` for one-shot retrieval, and use this snapshot only to seed the research loop.

---

## 13. RESEARCH BOUNDARIES
- Max iterations: 10
- Convergence threshold: 0.05
- Per-iteration budget: 24 tool calls, 10 minutes
- Progressive synthesis: true (default)
- research/research.md ownership: workflow-owned canonical synthesis output
- Lifecycle branches: `new`, `resume`, `restart`, `completed-continue` through `--extend=N` and `--extend-minutes=M` (live)
- Deferred lifecycle branch: `fork` (not runtime-wired)
- Machine-owned sections: reducer controls Sections 3, 6, 7-11A, including Section 10A pivot lineage
- Question injection surface: `{spec_folder}/research/inbox.jsonl`
- Question conflict owner: reducer registry; `question_conflict` events surface inbox/registry disagreements for operator decision
- Canonical pause sentinel: `research/.deep-research-pause`
- Capability matrix: `.skilled/skills/system-deep-loop/deep-research/assets/runtime-capabilities.json`
- Capability matrix doc: `.skilled/skills/system-deep-loop/deep-research/references/guides/capability-matrix.md`
- Capability resolver: `.skilled/skills/system-deep-loop/deep-research/scripts/runtime-capabilities.cjs`
- Current generation: 1
- Started: 2026-11-20T12:59:05.039Z
