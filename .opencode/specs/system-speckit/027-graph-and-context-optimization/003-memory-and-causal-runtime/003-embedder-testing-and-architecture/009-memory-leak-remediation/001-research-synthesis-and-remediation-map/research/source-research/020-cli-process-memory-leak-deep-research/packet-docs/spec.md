---
title: "020: CLI Process Memory Leak Deep Research"
description: "Research-only packet for a 10-iteration deep-research sweep of system-spec-kit memory leaks, orphan process buildup, and cross-CLI process containment failures."
trigger_phrases:
  - "CLI process memory leak deep research"
  - "system-spec-kit memory leak sweep"
  - "cross CLI process spam"
  - "deep research process containment"
importance_tier: "important"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/001-research-synthesis-and-remediation-map/research/source-research/020-cli-process-memory-leak-deep-research/packet-docs"
    last_updated_at: "2026-05-22T07:57:58Z"
    last_updated_by: "main_agent"
    recent_action: "Completed 10-iteration research run and wrote final synthesis."
    next_safe_action: "Review the remediation backlog and open follow-up implementation packets."
    blockers:
      - "Per-iteration telemetry was checked in-session but was not persisted uniformly inside every iteration artifact."
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "decision-record.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000020"
      session_id: "020-cli-process-memory-leak-deep-research"
      parent_session_id: null
    completion_pct: 90
    open_questions:
      - "Which P0/P1 remediation packets should be implemented first?"
    answered_questions:
      - "User requested 10 iterations: 5 via cli-claude-code Opus 4.7 and 5 via cli-codex gpt-5.5 xhigh fast."
      - "Claude iterations used claude-opus-4-7; Codex iterations used gpt-5.5 xhigh fast."
      - "User approved continuing despite saturated swap preflight; no unrelated user processes were killed."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
# 020: CLI Process Memory Leak Deep Research

<!-- SPECKIT_LEVEL: 3 -->

---

## EXECUTIVE SUMMARY

This packet defines a broad 10-iteration `/deep:start-research-loop` investigation against `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit` to find memory leaks, orphan process buildup, and unsafe nested CLI orchestration paths. The research is intentionally evidence-only: it must map leak classes, collect process and memory telemetry, and produce a prioritized fix backlog before any implementation changes are made.

**Key Decisions**: run one CLI dispatch at a time, kill and verify process cleanup between iterations, split research across Claude Opus and Codex GPT-5.5 perspectives.

**Critical Dependencies**: `/deep:start-research-loop` executor routing, `cli-claude-code`, `cli-codex`, Apple Silicon memory telemetry commands, and local authentication for both CLI providers.

---
<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P0 |
| **Status** | Research synthesis complete; follow-up remediation pending |
| **Created** | 2026-05-22 |
| **Branch** | `020-cli-process-memory-leak-deep-research` |
| **Parent** | `system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/002-spec-memory-stack` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Several prior AI sessions reportedly used CLI skills to orchestrate agents inside other CLIs, which allowed long-lived or orphaned processes to accumulate. On a 64 GB Apple Silicon machine, that process spam can combine with swap, wired memory, sidecars, and model/runtime cold starts until the workstation overloads instead of recovering automatically.

### Purpose

Run a telemetry-gated deep-research campaign that proves where system-spec-kit and sibling CLI workflows can leak memory, leave orphan children, or fail to halt under memory pressure, then produce an evidence-ranked remediation backlog.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Ten `/deep:start-research-loop` iterations targeting `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit`.
- Five iterations routed through `cli-claude-code` using the user-requested Opus 4.7 model route, subject to the cli-claude-code self-invocation guard and auth preflight.
- Five iterations routed through `cli-codex` using `gpt-5.5`, `model_reasoning_effort="xhigh"`, and `service_tier="fast"`.
- Process-tree and memory-pressure investigation for deep research, deep review, AI council, CLI skills, sidecars, `ccc search`, `gtimeout`, rerank servers, Node/TypeScript processes, Python processes, and Ollama or embedding helpers if they are spawned by the workflow.
- Per-iteration checks for `sysctl vm.swapusage`, `vm_stat`, process counts, residual children, locks, and state-machine recovery behavior.
- Findings taxonomy that separates real leaks, orphan cleanup gaps, expected long-lived daemons, kernel-side pressure, and false positives.

### Out of Scope

- Implementing fixes during this research packet. Fixes need a follow-up implementation packet after evidence review.
- Launching parallel CLI dispatches unless the operator explicitly authorizes concurrency for a specific experiment.
- Force-killing user-owned unrelated processes without positive identification and explicit operator approval.
- Changing model defaults, skill routing, or deep-loop workflow behavior before the research synthesis is accepted.

### Files to Inspect or Produce

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-spec-kit/` | Inspect | Primary research target for deep-loop, memory, workflow, and process cleanup behavior. |
| `.opencode/skills/cli-claude-code/` | Inspect | Claude CLI dispatch rules, self-invocation guard, process cleanup guidance, and memory handback. |
| `.opencode/skills/cli-codex/` | Inspect | Codex CLI dispatch rules, xhigh fast routing, stdin handling, and orphan cleanup guidance. |
| `.opencode/skills/cli-devin/`, `.opencode/skills/cli-opencode/`, `.opencode/skills/cli-gemini/` | Inspect | Cross-CLI orchestration risks and process cleanup parity. |
| `.opencode/commands/spec_kit/` | Inspect | Deep research, deep review, council, and command workflow entrypoints. |
| `research/iterations/iteration-NNN.md` | Create later | Iteration narratives from the deep-research workflow. |
| `research/deep-research-state.jsonl` | Create later | Reducer-owned iteration state and executor audit fields. |
| `research/research.md` | Created | Final synthesis with ranked memory-leak findings and remediation backlog. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The research run must target `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit`. | Deep-research config, prompts, and synthesis name that target path explicitly. |
| REQ-002 | Execute exactly 10 deep-research iterations unless a memory-pressure stop gate fires. | Ten non-empty `research/iterations/iteration-NNN.md` files and ten JSONL records, or a documented STOP_BLOCKED event with telemetry. |
| REQ-003 | Use the requested executor split. | Five iteration records show `cli-claude-code` plus Opus 4.7 route, and five records show `cli-codex` plus `gpt-5.5` xhigh fast route. |
| REQ-004 | Enforce one CLI dispatch at a time. | No overlapping `claude`, `codex`, `devin`, `opencode`, `gemini`, or nested CLI executor windows unless explicitly authorized in the research log. |
| REQ-005 | Capture Apple Silicon memory telemetry before and after every iteration. | Each iteration records `sysctl vm.swapusage`, `vm_stat`, relevant process counts, and RSS samples for spawned CLI and sidecar processes. |
| REQ-006 | Kill and verify known dispatcher children between iterations. | Post-iteration checks show no unexpected `claude -p`, `codex exec`, `ccc search`, `gtimeout`, reranker sidecar, stale deep-loop lock, or orphaned child process. |
| REQ-007 | Audit nested runtime and self-invocation guards. | Findings cover Claude Code calling `cli-claude-code`, OpenCode calling `cli-opencode`, Codex calling `cli-codex`, and cross-CLI loops launched by deep research, deep review, or council. |
| REQ-008 | Classify every suspected leak with evidence. | Each finding includes class, source file or command path, reproduction path, telemetry signal, severity, and proposed fix owner. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-009 | Produce a prioritized remediation backlog. | `research/research.md` lists P0/P1/P2 fixes with evidence links and suggested follow-up packets. |
| REQ-010 | Distinguish user-process RSS from kernel-side wired and swap pressure. | The synthesis explains when user-mode process kills are sufficient and when reboot or OS-level recovery is required. |
| REQ-011 | Keep secrets out of telemetry artifacts. | Prompts, logs, and synthesis redact API keys, auth tokens, OAuth details, and private model credentials. |
| REQ-012 | Include failure-mode guidance for memory-pressure aborts. | The runbook states when to stop, kill children, recommend reboot, and resume safely. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The deep-research packet produces a complete 10-iteration evidence set or a justified early stop with memory-pressure telemetry.
- **SC-002**: The final synthesis ranks all plausible leak vectors by severity, likelihood, affected workflow, and fix owner.
- **SC-003**: The research identifies whether process spam comes from CLI dispatchers, deep-loop reducers, sidecars, stale locks, nested self-invocation, or Apple Silicon swap and wired memory pressure.
- **SC-004**: Every proposed remediation includes a verification strategy that can prove process cleanup and memory-pressure recovery improved.
- **SC-005**: The research run itself does not overload the workstation because it uses preflight swap checks, sequential dispatch, kill-between iterations, and halt gates.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Claude CLI auth and exact Opus 4.7 model id | Claude iterations may be blocked or misrouted. | Run cli-claude-code auth and model preflight before the first Claude iteration. |
| Dependency | Codex CLI auth and fast tier | Codex iterations may fail or fall back to slower defaults. | Run cli-codex auth preflight and pass `gpt-5.5`, `xhigh`, and `fast` explicitly. |
| Risk | Swap is already saturated before the run | Research can worsen kernel-side pressure. | Stop if swap usage is above 70 percent and recommend reboot before iterations. |
| Risk | Nested self-invocation from the active runtime | CLI recursion can create process storms. | Enforce cli-X self-invocation guards and route through a sibling runtime only when safe. |
| Risk | False positive daemon kills | Legitimate long-lived MCP or sidecar process could be killed. | Classify expected daemons separately and only kill dispatcher-owned children. |
| Risk | Research logs capture credentials | Security incident in artifacts. | Redact env, auth, and token material before writing iteration artifacts. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance

- **NFR-P01**: Between iterations, unexpected dispatcher process count returns to zero before the next iteration starts.
- **NFR-P02**: Swap usage does not grow by more than 1 GB per iteration without triggering a stop-and-diagnose event.
- **NFR-P03**: Free pages below roughly 50K after an iteration triggers a halt and reboot recommendation.

### Security

- **NFR-S01**: Telemetry artifacts must not persist API keys, OAuth tokens, session tokens, or secrets from process environments.
- **NFR-S02**: Cleanup commands must identify process lineage before killing anything not launched by the current research run.

### Reliability

- **NFR-R01**: Each iteration must leave a markdown artifact, a JSONL delta, and cleanup telemetry, or it must fail closed with a recovery event.
- **NFR-R02**: Stale locks and paused state files must be inspected before resume so the loop does not double-dispatch.

---

## 8. EDGE CASES

### Process Boundaries

- Current runtime is Claude Code and the requested route is `cli-claude-code`: self-invocation guard must block direct Claude CLI dispatch unless routed from a non-Claude runtime.
- Current runtime is Codex and the requested route is `cli-codex`: self-invocation guard must block direct Codex CLI dispatch unless routed from a non-Codex runtime.
- A child process detaches from its dispatcher: record parent PID, command, RSS, age, and kill result before continuing.

### Memory Pressure

- Swap usage starts above 70 percent: stop before iteration 1 and recommend reboot.
- `vm_stat` free pages fall below roughly 50K: stop, preserve artifacts, kill dispatcher children, and recommend reboot.
- User-process RSS is low while wired memory is high: classify as kernel-side pressure, not a simple user-process leak.

### Workflow Recovery

- Deep-research JSONL append fails: do not launch the next iteration until reducer state is repaired.
- Iteration markdown is empty: treat the iteration as failed and record it as a schema mismatch.
- CLI auth missing or model unavailable: block the affected executor route rather than silently substituting another model.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 22/25 | Multiple CLI skills, deep workflows, MCP processes, sidecars, and OS telemetry. |
| Risk | 24/25 | Memory exhaustion can destabilize the workstation and lose work. |
| Research | 20/20 | Requires 10 fresh-context research iterations and synthesis. |
| Multi-Agent | 13/15 | Two CLI executor families, plus deep-research workflow-owned agents. |
| Coordination | 12/15 | Sequencing, cleanup, auth, and state-machine constraints. |
| **Total** | **91/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Research run itself triggers process buildup. | H | M | Single-dispatch rule, pre/post memory checks, and mandatory cleanup between iterations. |
| R-002 | Nested CLI self-invocation bypasses guard. | H | M | Audit all cli-X dispatch paths and record runtime ancestry checks. |
| R-003 | Kernel-side wired memory continues after user-process kills. | H | M | Track swap and wired/free pages, then recommend reboot when user-mode cleanup is insufficient. |
| R-004 | Findings conflate expected daemons with leaks. | M | M | Require process lineage and expected-daemon classification before assigning severity. |
| R-005 | Synthesis recommends speculative fixes. | M | L | Require reproduction path, telemetry signal, and owning file before any remediation item is P0/P1. |

---

## 11. USER STORIES

### US-001: Prevent Process Storms During Deep Flows (Priority: P0)

**As a** developer running Claude Code, OpenCode, Codex, or another CLI, **I want** deep research, deep review, council, and CLI-skill delegation to clean up children reliably, **so that** long-running AI sessions do not overload a 64 GB workstation.

**Acceptance Criteria**:
1. Given a deep-flow iteration dispatches a CLI executor, When the iteration ends, Then the dispatcher and unexpected children are gone before the next iteration starts.
2. Given the active runtime matches the requested cli-X provider, When dispatch is attempted, Then self-invocation is blocked and the run fails closed.

---

### US-002: Diagnose Real Memory Pressure (Priority: P0)

**As a** maintainer, **I want** per-iteration memory telemetry that separates RSS, swap, wired memory, and expected daemons, **so that** fixes target the real failure mode rather than only killing visible processes.

**Acceptance Criteria**:
1. Given an iteration completes, When telemetry is written, Then the artifact includes swap, free pages, process list, and residual-process assessment.
2. Given swap or free-page halt thresholds are crossed, When the workflow evaluates readiness, Then the run stops and recommends reboot instead of launching another CLI process.

---

### US-003: Produce a Fixable Backlog (Priority: P1)

**As a** future implementer, **I want** each memory-leak finding to identify the owning code path and verification command, **so that** follow-up fixes can be scoped and tested without repeating the whole research sweep.

**Acceptance Criteria**:
1. Given the synthesis identifies a leak class, When the backlog is produced, Then the item includes severity, source evidence, suspected owner, and a concrete test or manual verification path.

---

## 12. OPEN QUESTIONS

- Which P0/P1 remediation packets should be implemented first from `research/research.md`?
- Should follow-up verification prioritize live process harnesses, atomic state recovery, or host-memory telemetry first?
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
