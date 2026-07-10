---
title: "Plan: 024 CLI Deep Research Memory Leak Audit"
description: "Execution plan for a fifteen-iteration, two-executor deep-research audit of process buildup and memory leak risks in mcp-coco-index and system-code-graph."
trigger_phrases:
  - "024 CLI memory leak plan"
  - "deep research memory plan"
  - "process cleanup audit plan"
importance_tier: "critical"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/001-research-synthesis-and-remediation-map/research/source-research/024-cli-deep-research-memory-leak-audit/packet-docs"
    last_updated_at: "2026-05-22T07:20:00Z"
    last_updated_by: "opencode"
    recent_action: "Completed fifteen research iterations and final synthesis addendum."
    next_safe_action: "Open first remediation packet."
    blockers: []
    key_files:
      - "spec.md"
      - "tasks.md"
      - "checklist.md"
      - "decision-record.md"
    session_dedup:
      fingerprint: "sha256:0240240240240240240240240240240240240240240240240240240240240240"
      session_id: "024-cli-memory-leak-audit-intake"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions:
      - "Use `/deep:start-research-loop` state workflow, not custom shell loops."
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Plan: 024 CLI Deep Research Memory Leak Audit

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript, Python, shell, MCP servers, local CLI runtimes |
| **Framework** | Spec Kit deep-research workflow, CocoIndex MCP, Code Graph MCP, cli-* skills |
| **Storage** | SQLite/vector/index files, JSONL state, markdown research artifacts |
| **Testing** | Strict spec validation now; follow-up remediation will run targeted unit, integration, and process-lifecycle tests |
| **Runtime Risk** | Apple Silicon swap, wired memory, MPS/Metal allocations, long-lived child processes |

### Overview
This plan does not implement leak fixes. It prepares a disciplined research run that uses two external executor lanes, captures process and memory telemetry around every iteration, and emits findings that are specific enough to become follow-up remediation packets.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Spec folder exists at the requested `024-cli-deep-research-memory-leak-audit` path.
- [x] Corrected executor split is documented: 5 Claude Code iterations and 10 Codex iterations.
- [x] Research target paths are explicit and bounded to the code-index stack skills plus required orchestration references.
- [x] CLI auth and model availability are confirmed by successful Claude and Codex iteration dispatches.
- [x] `sysctl vm.swapusage` was captured before and between iterations; the user explicitly overrode the swap halt blocker for this run.

### Definition of Done
- [x] Fifteen iteration artifacts exist, or the loop halted early for a documented safety reason.
- [x] `research/research.md` contains final synthesis with P1/P2 findings and evidence.
- [x] Cleanup evidence and limitations are documented; unresolved long-lived helpers are assigned to follow-up process-sweep work rather than treated as a no-orphan claim.
- [x] Follow-up remediation specs are named for every P1 finding.
- [x] This packet passes strict validation after final continuation updates.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Command-owned iterative research with sequential external executor lanes and memory-safety gates between iterations.

### Key Components
- **Deep-research YAML workflow**: owns state setup, per-iteration dispatch, JSONL deltas, reducer updates, convergence, and synthesis.
- **Lane A executor**: `cli-claude-code` with Opus 4.7 / Opus profile for five high-depth iterations.
- **Lane B executor**: `cli-codex` with `gpt-5.5`, `xhigh`, `fast` for ten high-depth iterations.
- **Target skill A**: `.opencode/skills/mcp-coco-index/`, including daemon, query, indexing, rerank, and sidecar interactions.
- **Target skill B**: `.opencode/skills/system-code-graph/`, including graph scan/query/apply workflows, SQLite/index handling, and bridge behavior.
- **Safety telemetry**: process-tree inventory, `sysctl vm.swapusage`, `vm_stat`, free pages, swap delta, and explicit kill checks.

### Data Flow
The operator starts lane A through `/deep:start-research-loop:auto` with pre-bound setup. The workflow writes state under this packet's `research/` directory, dispatches one iteration at a time, validates required artifacts, and runs cleanup checks. After lane A, the operator verifies or explicitly overrides memory state, then runs lane B with Codex settings and the same research charter. The continuation adds five Codex validation iterations over the recommendation matrix. Final synthesis merges findings and emits remediation recommendations.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `mcp-coco-index` daemon/search/index code | Owns semantic code indexing and search processes. | Research only. Identify leak or cleanup hazards. | File-line findings plus proposed tests. |
| `system-code-graph` MCP workflows | Owns structural graph scans, queries, apply recovery, and bridge behavior. | Research only. Identify process and cache hazards. | File-line findings plus proposed tests. |
| `cli-claude-code` skill | Lane A executor and cleanup contract. | Research only. Confirm guardrails and kill commands. | Iteration metadata plus cleanup evidence. |
| `cli-codex` skill | Lane B executor and cleanup contract. | Research only. Confirm stdin, sandbox, fast-tier, and cleanup rules. | Iteration metadata plus cleanup evidence. |
| `deep-research` workflow | Owns loop state and dispatch. | Research only. Verify no bypassed state machine or nested loops. | Required state files and JSONL records. |
| Apple Silicon runtime | Machine-level memory pressure source. | Observe only. Capture swap/wired/free-page signals. | `sysctl vm.swapusage` and `vm_stat` snapshots. |

Required inventories:
- Same-class producers: process launch points, cleanup hooks, daemon/spawn helpers, sidecar startup, lock handling, cache retention, and SQLite/index handle ownership.
- Consumers of changed symbols for follow-up fixes: all CLI skills, deep-flow commands, MCP server entrypoints, and docs that promise cleanup behavior.
- Matrix axes: executor lane, target skill, process kind, failure mode, telemetry source, and cleanup expectation.
- Algorithm invariant: every spawned process group, daemon, sidecar, watcher, or long-lived model helper must have a documented owner, timeout, and cleanup path.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup and Safety Preflight
- [x] Create Level 3 phase packet and docs.
- [x] Confirm `claude` CLI, `codex` CLI, and auth status through successful dispatches.
- [x] Capture `sysctl vm.swapusage` and `vm_stat` before the first iteration.
- [x] Record existing `claude`, `codex`, `ccc search`, `gtimeout`, rerank sidecar, CocoIndex daemon, and MCP helper process inventory.

### Phase 2: Lane A - Claude Code Research
- [x] Run five `/deep:start-research-loop:auto` iterations using `cli-claude-code` and Opus 4.7 / Opus profile.
- [x] After every iteration, validate markdown and JSONL outputs exist.
- [ ] Kill and verify lane A process groups and known child helpers.
- [x] Capture memory telemetry deltas and halt if thresholds are unsafe; user overrode the halt blocker.

### Phase 3: Lane B - Codex Research
- [x] Run ten `/deep:start-research-loop:auto` iterations using `cli-codex`, `gpt-5.5`, `xhigh`, `fast`.
- [x] After every iteration, validate markdown and JSONL outputs exist.
- [ ] Kill and verify lane B process groups and known child helpers.
- [x] Capture memory telemetry deltas and halt if thresholds are unsafe; Codex sandbox limits are documented in iteration 006.

### Phase 4: Synthesis and Remediation Planning
- [x] Merge findings across both lanes.
- [x] Deduplicate, classify, and rank P0/P1/P2 issues.
- [x] Assign proposed remediation packet names and verification commands.
- [x] Update `research/research.md`, `resource-map.md`, checklist, and implementation summary.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Spec validation | Packet docs before and after research | `.opencode/skills/system-spec-kit/scripts/spec/validate.sh` |
| Artifact validation | Each iteration markdown and JSONL delta | Deep-research post-dispatch validation |
| Process cleanup | CLI parent and child process groups | `ps`, process-name inventory, skill-owned kill commands |
| Memory telemetry | Swap, free pages, wired pressure trend | `sysctl vm.swapusage`, `vm_stat` |
| Follow-up test design | Candidate fixes from findings | pytest, vitest, shell checks, MCP smoke tests as proposed by synthesis |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `/deep:start-research-loop` workflow | Internal | Available | Required state machine for the loop. |
| `cli-claude-code` skill and Claude Code CLI | Internal/external | Needs preflight | Lane A cannot run if unavailable. |
| Opus 4.7 / Opus model access | External | Needs preflight | Lane A may need a concrete local model ID mapping. |
| `cli-codex` skill and Codex CLI | Internal/external | Needs preflight | Lane B cannot run if unavailable. |
| GPT-5.5 xhigh fast access | External | Needs preflight | Lane B may block if model or tier is unavailable. |
| Apple Silicon system telemetry | Local runtime | Available | Required for safe halt decisions. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Research execution creates unsafe memory pressure, leaves unkillable process trees, corrupts deep-research state, or writes findings to the wrong packet.
- **Procedure**: Stop the deep-research workflow, kill known CLI/process helpers, preserve existing artifacts for diagnosis, record the halted state in `implementation-summary.md`, and restart from a clean machine state if swap/wired pressure remains high.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```text
Setup and Safety Preflight
  -> Lane A: Claude Code Research
  -> Cleanup and Memory Settle Check
  -> Lane B: Codex Research
  -> Synthesis and Remediation Planning
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup and Safety Preflight | Spec packet creation | Both executor lanes |
| Lane A | Setup, Claude CLI/auth, safe memory state | Lane B |
| Cleanup Between Lanes | Lane A completion or halt | Lane B |
| Lane B | Cleanup Between Lanes, Codex CLI/auth, safe memory state | Synthesis |
| Synthesis | Lane A plus Lane B results, or documented safety halt | Follow-up remediation |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup and Safety Preflight | Medium | 30-60 minutes |
| Lane A Research | High | 5 deep-research iterations |
| Lane B Research | High | 10 deep-research iterations |
| Synthesis and Remediation Planning | High | 1-3 hours after iterations |
| **Total** | | **15 iterations plus synthesis** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-run Checklist
- [ ] Run `sysctl vm.swapusage` and confirm swap used is not above 70 percent.
- [ ] Capture `vm_stat` and note free pages.
- [ ] Capture current matching process names before lane A.
- [ ] Confirm no unrelated long-running local model or indexing task is already active.

### Rollback Procedure
1. Stop the active deep-research command.
2. Kill the active executor process group and known helper processes for that executor.
3. Run the process inventory again and compare with pre-run state.
4. Recheck `sysctl vm.swapusage` and `vm_stat`.
5. If swap or wired pressure remains unsafe, recommend reboot before continuing.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: remove only incomplete research artifacts if the operator asks; otherwise preserve them for failure diagnosis.
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```text
Spec Packet
  -> Deep Research Workflow
    -> Lane A: cli-claude-code / Opus
      -> Cleanup Gate
        -> Lane B: cli-codex / GPT-5.5 xhigh fast
          -> Synthesis
            -> Remediation Packet Queue
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Spec packet | Scaffold templates | Research charter | Deep-research setup |
| Deep-research workflow | Spec folder and setup answers | State files and dispatches | Iteration execution |
| Lane A | Claude CLI/auth and safe memory state | First five iteration findings | Lane B |
| Lane B | Codex CLI/auth and cleanup after lane A | Ten Codex findings and validation passes | Synthesis |
| Synthesis | Iteration deltas and findings registry | Final report and remediation queue | Follow-up fixes |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Safety preflight** - Must complete before any external CLI iteration.
2. **Lane A execution and cleanup** - Must complete or halt safely before Codex starts.
3. **Lane B execution and cleanup** - Must complete or halt safely before final synthesis.
4. **Synthesis classification** - Must complete before opening implementation packets.

**Total Critical Path**: fifteen sequential research iterations plus cleanup gates and synthesis.

**Parallel Opportunities**:
- Documentation review can happen while waiting for CLI auth checks.
- Follow-up remediation spec drafting can begin after any P0 finding is confirmed, but implementation should wait for final synthesis.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Packet ready | Spec docs validate and setup is clear | Before research |
| M2 | Lane A done | Five Claude Code iterations completed | Done |
| M3 | Lane B done | Ten Codex iterations completed | Done |
| M4 | Synthesis done | Final report ranks findings and names remediation packets | Done |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: Sequential Two-Lane Research with Kill-Between-Iterations

**Status**: Proposed

**Context**: The audit itself can reproduce the memory-pressure problem if it runs multiple CLI executors concurrently.

**Decision**: Run the Claude Code lane and Codex lane sequentially, with process and memory cleanup evidence between every iteration and between lanes.

**Consequences**:
- Reduces risk of self-inflicted memory overload during research.
- Makes attribution clearer because each iteration has one executor and one cleanup boundary.
- Costs more wall-clock time than parallel research.

**Alternatives Rejected**:
- Parallel five-by-five execution: rejected because it would hide which executor or helper process caused a leak and could overload the workstation.
