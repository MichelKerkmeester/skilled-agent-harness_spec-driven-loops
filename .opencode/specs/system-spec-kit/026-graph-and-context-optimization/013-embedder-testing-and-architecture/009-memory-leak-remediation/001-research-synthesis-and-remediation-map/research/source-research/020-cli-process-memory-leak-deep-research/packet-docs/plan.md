---
title: "Implementation Plan: CLI Process Memory Leak Deep Research"
description: "Plan for running a telemetry-gated 10-iteration deep-research campaign across system-spec-kit memory, process, CLI dispatch, and deep-flow cleanup paths."
trigger_phrases:
  - "memory leak research plan"
  - "CLI process containment plan"
  - "deep research executor split"
importance_tier: "important"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/002-spec-memory-stack/020-cli-process-memory-leak-deep-research"
    last_updated_at: "2026-05-22T07:57:58Z"
    last_updated_by: "main_agent"
    recent_action: "Completed telemetry-gated deep research and final synthesis."
    next_safe_action: "Plan follow-up implementation slices from the remediation backlog."
    blockers:
      - "Live telemetry harnesses remain follow-up work."
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
    open_questions: []
    answered_questions:
      - "Research must use 5 Claude/Opus and 5 Codex/GPT-5.5 iterations."
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: CLI Process Memory Leak Deep Research

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript, JavaScript, Shell, Python, Markdown |
| **Framework** | system-spec-kit command workflows, MCP server scripts, cli-X skill dispatchers |
| **Storage** | Spec packet `research/` state, JSONL deep-research state, local process telemetry |
| **Testing** | Deep-research artifact validation, process telemetry checks, strict spec validation |

### Overview

This plan runs deep research as a controlled evidence-gathering workflow, not as an implementation pass. Each iteration must start with fresh context, inspect one leak class, write the required markdown and JSONL artifacts, clean up spawned processes, and record memory telemetry before the next iteration starts.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] Problem statement clear and scope documented in `spec.md`.
- [x] Success criteria measurable and tied to telemetry.
- [x] Executor split and target path documented.
- [x] Claude CLI auth, model id, and self-invocation route checked.
- [x] Codex CLI auth and `gpt-5.5` xhigh fast route checked.
- [x] `sysctl vm.swapusage` preflight captured; user explicitly approved continuing despite saturated swap.

### Definition of Done

- [x] Ten iteration artifacts exist, or an early stop event explains why continuing would be unsafe.
- [ ] Every iteration has markdown, JSONL, telemetry, cleanup result, and source citations. Note: markdown, JSONL, and citations exist; telemetry was not uniformly persisted per iteration.
- [x] `research/research.md` synthesizes leak classes, severity, owners, and follow-up fixes.
- [x] No unexpected dispatcher process remains after the final iteration.
- [x] Spec docs and memory metadata are refreshed after synthesis.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Research-only, reducer-owned deep-loop with sequential cross-CLI executor dispatch and explicit process cleanup gates.

### Key Components

- **Deep-research command workflow**: Owns state files, iteration dispatch, convergence checks, and synthesis.
- **CLI executor routes**: `cli-claude-code` handles five Opus iterations and `cli-codex` handles five GPT-5.5 xhigh fast iterations.
- **Memory telemetry gate**: Captures `sysctl vm.swapusage`, `vm_stat`, process list, residual children, and lock state before and after each iteration.
- **Cleanup verifier**: Confirms known dispatchers and child helpers are gone before the next iteration starts.
- **Finding classifier**: Groups evidence into real leak, orphan cleanup gap, expected daemon, kernel-side pressure, config/auth failure, or false positive.

### Data Flow

Preflight checks establish baseline memory and auth state. The workflow dispatches one deep-research iteration, writes iteration markdown and JSONL, captures post-iteration telemetry, kills unexpected children, verifies cleanup, updates strategy, and only then launches the next iteration. Synthesis reads all iteration deltas and produces `research/research.md` plus a ranked follow-up backlog.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.opencode/skills/system-spec-kit/` | Primary target: commands, memory workflow, deep-loop scripts, validation, and continuity saves. | Research only. | Iteration citations to source paths and line references. |
| `.opencode/commands/spec_kit/` | Slash-command routing for deep research, deep review, and related workflows. | Research only. | Command contract inventory and dispatch path map. |
| `.opencode/skills/cli-claude-code/` | Claude CLI delegation and process cleanup rules. | Research only. | Opus route audit plus self-invocation and cleanup checks. |
| `.opencode/skills/cli-codex/` | Codex CLI delegation, stdin, sandbox, and cleanup rules. | Research only. | GPT-5.5 xhigh fast route audit plus cleanup checks. |
| `.opencode/skills/cli-devin/`, `.opencode/skills/cli-opencode/`, `.opencode/skills/cli-gemini/` | Sibling CLI skills that can participate in nested orchestration. | Research only. | Parity review against single-dispatch and self-invocation rules. |
| Local process table | Runtime evidence for leaks and orphans. | Observe and clean dispatcher-owned processes only. | Pre/post telemetry and residual-process report per iteration. |

Required inventories:
- Same-class producers: search for CLI dispatch patterns, background `&`, `spawn`, `exec`, `pkill`, `.lock`, `deep-research-state.jsonl`, and sidecar startup commands under `.opencode/skills/system-spec-kit/`, `.opencode/commands/spec_kit/`, and `.opencode/skills/cli-*`.
- Consumers of changed symbols: not applicable until a follow-up implementation packet selects a fix.
- Matrix axes: runtime provider, executor skill, deep-flow type, sidecar process type, memory threshold, cleanup command, state recovery path.
- Algorithm invariant: no next iteration starts until state is valid, spawned dispatcher lineage is cleaned, and memory pressure is below the halt threshold.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup

- [x] Confirm the target path exists: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit`.
- [x] Run provider auth and model preflight for `cli-claude-code` and `cli-codex`.
- [x] Capture baseline `sysctl vm.swapusage`, `vm_stat`, and process inventory.
- [x] Initialize or resume the local deep-research packet under this spec folder's `research/` directory.

### Phase 2: Core Implementation

- [x] Iteration 001, Claude Opus route: inventory process-spawn entrypoints and background execution patterns.
- [x] Iteration 002, Claude Opus route: audit `/spec_kit:deep-research` state, locks, reducer writes, and failed-dispatch cleanup.
- [x] Iteration 003, Claude Opus route: audit deep-review, AI council, and multi-agent workflow process behavior.
- [x] Iteration 004, Claude Opus route: audit cli-X self-invocation guards, nested routing, and cross-CLI loop risks.
- [x] Iteration 005, Claude Opus route: audit Apple Silicon swap, wired memory, sidecar, and daemon classification logic.
- [x] Iteration 006, Codex GPT-5.5 xhigh fast route: independently map process owners and cleanup gaps.
- [x] Iteration 007, Codex GPT-5.5 xhigh fast route: inspect MCP server, context server, reducers, and save workflows for long-lived handles.
- [x] Iteration 008, Codex GPT-5.5 xhigh fast route: inspect `ccc search`, reranker sidecar, Ollama, embedder, `gtimeout`, and browser/devtools leftovers.
- [x] Iteration 009, Codex GPT-5.5 xhigh fast route: inspect stale locks, pause files, resume behavior, and interrupted-session recovery.
- [x] Iteration 010, Codex GPT-5.5 xhigh fast route: synthesize leak taxonomy and verify the remediation backlog against evidence.

### Phase 3: Verification

- [ ] Validate every iteration has markdown, JSONL, telemetry, and cleanup evidence. Note: markdown and JSONL validated; telemetry persistence is incomplete.
- [x] Confirm no unexpected dispatcher process remains after iteration 010 or early stop.
- [x] Run strict spec validation after writing synthesis and continuity metadata.
- [ ] Save or index the final research packet through the Spec Kit memory workflow.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Artifact validation | Iteration markdown, JSONL, strategy, synthesis, and resource map if generated. | `/spec_kit:deep-research` post-dispatch validation and manual file inspection. |
| Process cleanup | Dispatcher and child processes after every iteration. | `ps`, `pgrep`, process ancestry, skill-specific `pkill` cleanup patterns. |
| Memory pressure | Apple Silicon swap, free pages, wired pressure, and RSS. | `sysctl vm.swapusage`, `vm_stat`, `ps -o pid,ppid,rss,command`. |
| Static source audit | Dispatchers, locks, sidecars, child-process helpers, signal handlers. | CocoIndex, Grep, direct reads, and source citations. |
| Spec validation | Packet structure and metadata. | `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <folder> --strict`. |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `cli-claude-code` | Internal skill and external CLI | Unknown until preflight | Claude iterations blocked; ask operator before substituting executor. |
| `cli-codex` | Internal skill and external CLI | Unknown until preflight | Codex iterations blocked; ask operator before substituting executor. |
| `/spec_kit:deep-research` | Internal command workflow | Available by skill contract | Research state machine cannot run if command assets are broken. |
| Apple Silicon telemetry commands | Local OS | Expected available | Memory-pressure gates lose evidence if unavailable. |
| Provider credentials | Environment or OAuth | Unknown until preflight | CLI dispatch must fail closed instead of silently changing route. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Swap above 70 percent, free pages below roughly 50K, repeated iteration failures, missing JSONL, empty iteration artifacts, or unexpected process growth that cleanup cannot resolve.
- **Procedure**: Stop dispatching, preserve the latest artifacts, kill only dispatcher-owned children, release stale deep-loop locks if proven stale, record STOP_BLOCKED, and recommend reboot when kernel-side memory pressure remains.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```text
Phase 1 Setup -> Phase 2 Research Iterations -> Phase 3 Verification and Synthesis
       |                    |                                  |
       +-> Auth checks      +-> Cleanup after every iteration   +-> Memory save and indexing
       +-> Swap baseline    +-> Halt gates before next launch   +-> Follow-up fix backlog
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Existing spec folder and target path | All research iterations |
| Research Iterations | Setup, auth preflight, memory baseline | Synthesis and backlog |
| Verification | Completed or safely stopped iterations | Follow-up implementation packets |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Medium | 30-60 minutes |
| Research Iterations | High | 10 controlled iterations |
| Verification and Synthesis | High | 2-4 hours after iterations finish |
| **Total** | | **One extended research session, gated by memory pressure** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist

- [ ] No code deployment occurs in this packet.
- [ ] Preflight memory baseline captured before iteration 1.
- [ ] Cleanup commands identify dispatcher-owned process patterns.

### Rollback Procedure

1. Stop launching new CLI dispatches.
2. Preserve current `research/` artifacts and JSONL state.
3. Kill only dispatcher-owned children that match the active iteration lineage.
4. Re-check `sysctl vm.swapusage`, `vm_stat`, and process inventory.
5. Recommend reboot if swap or wired memory remains saturated after cleanup.

### Data Reversal

- **Has data migrations?** No.
- **Reversal procedure**: Remove or archive incomplete research artifacts only after user approval.
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```text
Target path + auth + memory baseline
        |
        v
Deep-research state packet
        |
        v
Sequential executor dispatch
        |
        v
Per-iteration telemetry + cleanup verification
        |
        v
Research synthesis + remediation backlog
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Preflight | Target path, auth, memory commands | Baseline and route readiness | Iteration 001 |
| Claude iterations | cli-claude-code readiness and self-invocation-safe runtime | Five Opus-perspective findings | Balanced synthesis |
| Codex iterations | cli-codex readiness | Five GPT-5.5 findings | Balanced synthesis |
| Cleanup verifier | Process lineage and skill cleanup rules | Residual-process evidence | Next iteration |
| Synthesis | All iteration artifacts | Ranked remediation backlog | Follow-up implementation |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Preflight memory and auth checks** - CRITICAL.
2. **Sequential iteration execution with kill-between gates** - CRITICAL.
3. **Synthesis with evidence-ranked fix backlog** - CRITICAL.

**Total Critical Path**: One controlled 10-iteration research run plus synthesis.

**Parallel Opportunities**:
- Static reading and artifact summarization can happen inside individual research iterations, but CLI dispatches must not overlap.
- Follow-up implementation packets can split by finding class after synthesis is accepted.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Exit Criteria |
|-----------|---------------|
| M1: Ready to launch | Auth, model, target path, baseline memory, and state packet are verified. |
| M2: Claude half complete | Five Opus-route iterations finish or safely stop with telemetry. |
| M3: Codex half complete | Five GPT-5.5 xhigh fast iterations finish or safely stop with telemetry. |
| M4: Synthesis complete | `research/research.md` ranks findings and follow-up fixes. |
| M5: Packet indexed | Spec metadata and memory index can surface the research packet. |
<!-- /ANCHOR:milestones -->
