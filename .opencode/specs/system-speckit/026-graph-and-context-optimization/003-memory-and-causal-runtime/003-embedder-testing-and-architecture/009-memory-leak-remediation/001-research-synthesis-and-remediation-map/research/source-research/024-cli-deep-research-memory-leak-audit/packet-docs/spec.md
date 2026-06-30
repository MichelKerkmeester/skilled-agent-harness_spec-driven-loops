---
title: "Spec: 024 CLI Deep Research Memory Leak Audit"
description: "Plan a two-lane deep-research audit of mcp-coco-index and system-code-graph for process buildup, memory leaks, and Apple Silicon memory-pressure failure modes during nested CLI, deep-research, deep-review, and council workflows."
trigger_phrases:
  - "024 CLI memory leak audit"
  - "deep research process spam"
  - "mcp-coco-index memory leak"
  - "system-code-graph memory leak"
  - "CLI orchestration RAM overload"
importance_tier: "critical"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/004-code-index-stack/024-cli-deep-research-memory-leak-audit"
    last_updated_at: "2026-05-22T07:20:00Z"
    last_updated_by: "opencode"
    recent_action: "Completed fifteen deep-research iterations and final synthesis addendum."
    next_safe_action: "Open the first remediation packet: remove-project-cancel-safety."
    blockers: []
    key_files:
      - ".opencode/skills/mcp-coco-index/"
      - ".opencode/skills/system-code-graph/"
      - ".opencode/skills/cli-claude-code/SKILL.md"
      - ".opencode/skills/cli-codex/SKILL.md"
      - ".opencode/skills/deep-research/SKILL.md"
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "decision-record.md"
    session_dedup:
      fingerprint: "sha256:0240240240240240240240240240240240240240240240240240240240240240"
      session_id: "024-cli-memory-leak-audit-intake"
      parent_session_id: null
    completion_pct: 90
    open_questions:
      - "Successful Python `.venv/bin/ccc search` RSS slope remains an implementation-packet verification gate."
      - "Sidecar 5xx/fallback RSS delta remains an implementation-packet verification gate."
      - "Public cancel identity must choose `reqId`, `indexId`, or both."
    answered_questions:
      - "Gate 3 target path was supplied by the operator."
      - "Executor plan completed as five cli-claude-code Opus-profile iterations plus ten cli-codex GPT-5.5 xhigh fast iterations."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
# Spec: 024 CLI Deep Research Memory Leak Audit

<!-- SPECKIT_LEVEL: 3 -->

---

## EXECUTIVE SUMMARY

This packet prepares a broad, evidence-driven memory-leak and process-lifecycle audit for the code-index stack. The investigation targets `.opencode/skills/mcp-coco-index/` and `.opencode/skills/system-code-graph/`, with special attention to CLI-skill orchestration paths that can leave child processes, local model sidecars, search daemons, or MCP helpers alive after deep-research, deep-review, council, or nested CLI workflows finish.

**Key Decisions**: split the initial ten research iterations into two sequential executor lanes, then extend with five additional Codex recommendation-validation iterations; treat Apple Silicon swap and wired-memory pressure as first-class failure signals, not just orphan process RSS.

**Critical Dependencies**: `/deep:start-research-loop` must own state and dispatch; CLI executions must follow the cli-skill single-dispatch and kill-between-iterations rules.

---
<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P0 |
| **Status** | Synthesized - verification gaps remain |
| **Created** | 2026-05-22 |
| **Parent Spec** | `../spec.md` |
| **Spec Folder** | `specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/004-code-index-stack/024-cli-deep-research-memory-leak-audit/` |
| **Primary Targets** | `.opencode/skills/mcp-coco-index/`, `.opencode/skills/system-code-graph/` |
| **Research Iterations** | 15 total: 5 Claude Code lane, 10 Codex lane |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Prior sessions observed CLI-orchestrated agent workflows building up many processes and consuming enough memory to threaten a 64 GB Apple Silicon workstation. The likely risk is not one simple leak: nested CLI skills, deep-flow loops, CocoIndex helpers, code-graph scans, rerank sidecars, and local model/runtime caches can combine into orphan process trees, retained memory, swap saturation, or kernel-side wired memory pressure that normal user-process cleanup does not fully release.

### Purpose
Run a wide deep-research pass that identifies concrete memory leaks, process lifecycle hazards, missing kill paths, and telemetry gaps before any implementation changes are planned.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Fifteen `/deep:start-research-loop` iterations against `.opencode/skills/mcp-coco-index/` and `.opencode/skills/system-code-graph/`.
- Lane A: five iterations using `cli-claude-code` with Opus 4.7 / Opus extended-thinking profile.
- Lane B: ten iterations using `cli-codex` with `gpt-5.5`, `model_reasoning_effort="xhigh"`, and `service_tier="fast"`.
- Process lifecycle audit for CLI skills, deep-research, deep-review, AI council, native agent dispatch, and nested CLI handoffs.
- Memory-risk audit for orphan child processes, Python/Node daemons, `ccc search`, `gtimeout`, reranker sidecars, CocoIndex daemon/indexing flows, code-graph scans, SQLite handles, file watchers, local ML model loads, subprocess pipes, and stale locks.
- Apple Silicon pressure analysis covering `sysctl vm.swapusage`, `vm_stat`, free pages, swap growth per iteration, wired memory, MPS/Metal/IOSurface implications, and reboot-only recovery cases.
- Findings classification into P0/P1/P2 with file-line evidence and candidate remediation specs.

### Out of Scope
- Implementing fixes found by the research. Implementation requires follow-up remediation packets.
- Running ad hoc shell loops, direct Task-tool deep-research dispatch, or custom CLI loops outside `/deep:start-research-loop`.
- Parallel CLI execution unless the operator explicitly approves it after seeing the memory preflight.
- Replacing the current deep-research state machine or bypassing `deep-research-state.jsonl`, `iterations/`, `deltas/`, `logs/`, and reducer-owned state.
- Re-running heavy indexes or model downloads without an explicit research-iteration reason and memory preflight.
- The superseded `cli-devin` / DeepSeek-v4-pro plan from the first user message.

### Files and Surfaces to Analyze

| Path or Surface | Action Type | Description |
|-----------------|-------------|-------------|
| `.opencode/skills/mcp-coco-index/` | Analyze | CocoIndex MCP server, daemon, CLI, search, rerank, index, and local model lifecycle. |
| `.opencode/skills/system-code-graph/` | Analyze | Code graph scan/query/apply workflows, process calls, caches, SQLite/index lifecycle, and structural MCP operations. |
| `.opencode/skills/cli-claude-code/` | Analyze | Claude Code dispatch guardrails, kill-between-iterations rules, and process cleanup references used by lane A. |
| `.opencode/skills/cli-codex/` | Analyze | Codex dispatch guardrails, stdin/process cleanup rules, and Apple Silicon memory safeguards used by lane B. |
| `.opencode/skills/deep-research/` | Analyze | Loop state machine, executor routing, per-iteration isolation, convergence, and cleanup responsibilities. |
| `.opencode/commands/deep/start-research-loop.md` | Analyze | Command setup contract, executor flags, PRE-BOUND SETUP ANSWERS, and workflow handoff. |
| `research/` under this packet | Create | Deep-research state, iteration files, synthesis, dashboard, and resource map once the loop runs. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Execute the audit through `/deep:start-research-loop` only. | Research artifacts show command-owned state files and no custom CLI loop dispatcher. |
| REQ-002 | Use the corrected two-lane executor split and continuation schedule. | Five iterations cite `cli-claude-code` Opus 4.7 / Opus profile; ten iterations cite `cli-codex` `gpt-5.5` xhigh fast. |
| REQ-003 | Enforce one CLI dispatch at a time. | Each iteration record includes pre-dispatch memory state, post-dispatch cleanup, and no overlapping cli-* process groups unless explicitly approved. |
| REQ-004 | Treat system memory pressure as blocking evidence. | Research captures `sysctl vm.swapusage` and `vm_stat` before the first lane and between iterations; halt criteria are documented. |
| REQ-005 | Produce actionable leak findings only with evidence. | Every P0/P1 finding cites file paths, line ranges, process names, expected cleanup behavior, observed risk, and a candidate fix boundary. |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | Cover both target skills broadly. | Synthesis contains separate coverage sections for mcp-coco-index and system-code-graph plus cross-skill orchestration. |
| REQ-007 | Audit nested and cross-CLI misuse. | Findings address self-invocation guards, nested CLI calls, deep-flow executor handoff, and agent/council combinations. |
| REQ-008 | Classify process cleanup hazards. | Findings distinguish orphan processes, retained caches, daemon lifecycle bugs, stale lock files, and kernel/swap pressure. |
| REQ-009 | Preserve enough evidence for follow-up fixes. | Each recommended remediation has a proposed spec-folder name, severity, affected files, verification command set, and rollback note. |
| REQ-010 | Keep research artifacts local to this packet. | `research/` contains iteration markdown, JSONL state, dashboard, final `research.md`, and `resource-map.md` if emitted. |

### P2 - Optional

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-011 | Compare behavior against a clean reboot baseline. | Research notes whether reboot is required to release wired/swap pressure and when to recommend it. |
| REQ-012 | Propose lightweight operator dashboards. | Synthesis includes optional telemetry views for RSS, swap, wired pages, and process-tree counts. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Fifteen iteration artifacts exist or the loop halts early with a documented safety reason tied to memory pressure or repeated executor failure.
- **SC-002**: Final `research/research.md` includes P0/P1/P2 findings with file-line evidence for both target skills.
- **SC-003**: The final synthesis names concrete remediation packets for every P0/P1 finding.
- **SC-004**: No orphaned `claude`, `codex`, `ccc search`, `gtimeout`, rerank sidecar, CocoIndex daemon, or deep-flow child process remains after each lane cleanup check.
- **SC-005**: The audit documents whether user-process cleanup is sufficient or whether reboot-only Apple Silicon wired/swap pressure is part of the failure mode.
- **SC-006**: This spec packet validates strictly before research begins and after synthesis updates packet docs.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Swap already saturated before research | Running fifteen iterations could worsen kernel pressure and make cleanup misleading. | Run `sysctl vm.swapusage` before the first iteration; stop if swap used is above 70 percent unless the operator explicitly overrides. |
| Risk | Nested CLI self-invocation | A CLI may start itself or another CLI in a way that bypasses single-dispatch controls. | Research must verify cli-skill self-invocation guards and executor routing. |
| Risk | Findings without reproduction | The audit could produce vague "possible leak" claims. | Require file-line evidence, process names, and verification commands for P0/P1. |
| Risk | Long-running local models | Rerankers or embedding backends may retain memory after the CLI process exits. | Track sidecar processes separately from parent CLI RSS. |
| Dependency | `claude` CLI auth and model availability | Lane A cannot run without available Claude Code auth and Opus model access. | Preflight CLI availability and auth before lane A; record blocker if unavailable. |
| Dependency | `codex` CLI auth and fast tier | Lane B cannot run without available Codex auth and `gpt-5.5` access. | Preflight CLI availability and auth before lane B; record blocker if unavailable. |
| Dependency | Deep-research executor support | Executor flags must be accepted by `/deep:start-research-loop`. | Use PRE-BOUND SETUP ANSWERS or explicit command flags from the command contract. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Research execution must avoid parallel cli-* dispatch by default.
- **NFR-P02**: Each iteration must capture enough memory telemetry to detect monotonic swap growth greater than 1 GB per iteration.

### Reliability
- **NFR-R01**: Cleanup checks must run even when an iteration errors, times out, or returns malformed research artifacts.
- **NFR-R02**: The workflow must halt instead of compounding memory pressure when free pages drop below the cli-skill safety threshold.

### Operability
- **NFR-O01**: Findings must translate into small follow-up specs with clear owners and verification commands.
- **NFR-O02**: The final report must distinguish "kill orphan processes" from "reboot to release kernel/wired pressure".
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

### Process Boundaries
- Parent CLI exits but child `ccc search` remains alive.
- A timeout kills the shell wrapper but not the process group.
- A deep-flow executor starts a sibling CLI from inside a CLI sandbox.
- A reranker sidecar or local model server survives the research iteration and retains memory.
- Stale lock files make a later run resume an unsafe or incomplete state.

### Memory Boundaries
- User-process RSS drops after kill but `vm_stat` still shows wired memory growth.
- Swap usage grows across iterations even though no obvious orphan process remains.
- MPS/Metal/IOSurface allocations survive normal user-process cleanup.
- The machine starts research in a swap-saturated state and needs reboot before any useful test.

### Workflow Boundaries
- Lane A reaches convergence before five iterations; the operator still wants five iterations unless memory safety halts.
- Lane B needs to resume or fork the research state created by lane A without corrupting JSONL continuity.
- Executor auth is unavailable; the workflow should record a blocker, not silently substitute another model.
<!-- /ANCHOR:edge-cases -->

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 22/25 | Two skills, cli-skill orchestration, deep-flow workflows, local daemons, sidecars, and system telemetry. |
| Risk | 24/25 | Prior real RAM overloads on a 64 GB MacBook; process buildup can degrade the whole workstation. |
| Research | 20/20 | Fifteen fresh-context iterations with broad code, workflow, runtime investigation, and continuation validation. |
| Multi-Agent | 14/15 | Two external CLI executors and deep-research state handoff. |
| Coordination | 13/15 | Follow-up remediation packets likely across CLI skills, CocoIndex, code graph, and system-spec-kit. |
| **Total** | **93/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Fifteen iterations create additional memory pressure. | High | Medium | Preflight swap, single dispatch, kill-between, halt thresholds, and explicit operator override for this run. |
| R-002 | Research misses leaks outside the two target skills. | Medium | Medium | Include cross-skill orchestrator and cli-skill references in scope, but keep remediation targets explicit. |
| R-003 | CLI auth/model mismatch blocks one lane. | Medium | Medium | Record blocker and do not substitute models without operator approval. |
| R-004 | Findings conflate kernel pressure with process leaks. | High | Medium | Require separate RSS, process-tree, swap, wired, and free-page evidence. |
| R-005 | Follow-up fixes become too broad. | Medium | Medium | Each P0/P1 finding must propose a small remediation packet with specific files and tests. |

---

## 11. USER STORIES

### US-001: Safe Deep-Flow Research (Priority: P0)

**As an** operator running Claude Code, OpenCode, Codex, or another CLI runtime, **I want** deep-research and related workflows to clean up subprocesses between iterations, **so that** long sessions do not overload a 64 GB Apple Silicon machine.

**Acceptance Criteria**:
1. Given a deep-research iteration launches a CLI executor, When the iteration completes, Then cleanup evidence proves its process group and known child helpers are gone or explicitly reported.
2. Given swap or free-page thresholds are unsafe, When the next iteration would start, Then the workflow halts and recommends reboot or cleanup before continuing.

---

### US-002: Actionable Leak Findings (Priority: P0)

**As a** maintainer of mcp-coco-index and system-code-graph, **I want** memory-leak findings tied to files, process names, and tests, **so that** follow-up fixes can be implemented surgically.

**Acceptance Criteria**:
1. Given the final research report lists a P0/P1 finding, When I inspect the finding, Then it includes file-line evidence, affected process/lifecycle boundary, expected fix, and verification command.
2. Given a suspected issue lacks direct evidence, When the final report is synthesized, Then it is classified as P2 or "needs reproduction" rather than as a blocker.

---

### US-003: Cross-Executor Coverage (Priority: P1)

**As a** workflow maintainer, **I want** both Claude Code and Codex executor lanes to inspect the same risk area from fresh contexts, **so that** model-specific blind spots are reduced.

**Acceptance Criteria**:
1. Given lane A and lane B complete, When synthesis runs, Then findings show which lane discovered or confirmed each issue.
2. Given the two lanes disagree, When synthesis runs, Then the report preserves the disagreement with evidence and proposes a deciding check.

---

## 12. DEEP-RESEARCH EXECUTION CHARTER

### Lane A - Claude Code

- Executor: `cli-claude-code`.
- Model intent: Opus 4.7 / Opus extended-thinking profile. If the local CLI maps this to a concrete ID such as `claude-opus-4-6`, record the actual ID in `deep-research-config.json` and the iteration JSONL.
- Iterations: 10 total, including five continuation validation passes.
- Safety: preflight `claude` availability and auth, run read-only research prompts, kill `claude -p` process groups and known child helpers between iterations.

### Lane B - Codex

- Executor: `cli-codex`.
- Model: `gpt-5.5`.
- Reasoning: `xhigh`.
- Service tier: `fast`.
- Iterations: 5.
- Safety: preflight `codex` availability and auth, use explicit model/effort/tier flags, redirect stdin from `/dev/null` where background execution is involved, kill `codex exec --model` process groups and known child helpers between iterations.

### Command Discipline

- Preferred mode: `/deep:start-research-loop:auto` with PRE-BOUND SETUP ANSWERS for each lane.
- State owner: the deep-research YAML workflow and reducer, not ad hoc scripts.
- Mandatory artifacts per iteration: `iterations/iteration-NNN.md` plus JSONL delta with `type`, `iteration`, `newInfoRatio`, `status`, and `focus`.
- No nested CLI loops: executors can inspect code and produce findings, but must not spawn their own deep-research, deep-review, council, or sibling CLI loops.
- Cleanup evidence: capture process list deltas, `sysctl vm.swapusage`, and `vm_stat` before and after each iteration.

### Example PRE-BOUND SETUP ANSWERS Blocks

```yaml
PRE-BOUND SETUP ANSWERS:
  research_topic: Memory leaks and process lifecycle hazards in mcp-coco-index and system-code-graph during CLI deep-flow orchestration
  spec_folder: specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/004-code-index-stack/024-cli-deep-research-memory-leak-audit
  execution_mode: AUTONOMOUS
  maxIterations: 5
  convergenceThreshold: 0.05
  executor: cli-claude-code
  executor_model: claude-opus-4-7
  executor_reasoning: high
  executor_service_tier: ""
  executor_timeout: 900
  resource_map_emit: true
```

```yaml
PRE-BOUND SETUP ANSWERS:
  research_topic: Memory leaks and process lifecycle hazards in mcp-coco-index and system-code-graph during CLI deep-flow orchestration
  spec_folder: specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/004-code-index-stack/024-cli-deep-research-memory-leak-audit
  execution_mode: AUTONOMOUS
  maxIterations: 5
  convergenceThreshold: 0.05
  executor: cli-codex
  executor_model: gpt-5.5
  executor_reasoning: xhigh
  executor_service_tier: fast
  executor_timeout: 900
  resource_map_emit: true
```

---

<!-- ANCHOR:questions -->
## 13. OPEN QUESTIONS

The research synthesis is complete. Remaining questions are non-blocking verification gates for follow-up remediation packets:

- Successful Python `.venv/bin/ccc search` RSS slope outside the Homebrew `ccc` collision.
- Sidecar 5xx/fallback RSS delta in this operator environment.
- Active-vs-stale parent PID classification for measured `ccc mcp` children.
- Effective `SPECKIT_CODE_GRAPH_DB_DIR` identity across measured code-graph servers.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
- **Resource Map**: See `resource-map.md`
