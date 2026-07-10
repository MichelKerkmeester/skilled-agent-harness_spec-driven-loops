---
title: "Decision Record: CLI Process Memory Leak Deep Research"
description: "ADR for running the memory-leak investigation as sequential telemetry-gated deep research instead of ad hoc nested CLI loops or speculative fixes."
trigger_phrases:
  - "CLI process memory leak ADR"
  - "sequential deep research dispatch"
  - "process cleanup gate decision"
importance_tier: "important"
contextType: "decision"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/001-research-synthesis-and-remediation-map/research/source-research/020-cli-process-memory-leak-deep-research/packet-docs"
    last_updated_at: "2026-05-22T07:57:58Z"
    last_updated_by: "main_agent"
    recent_action: "Applied sequential telemetry-gated research decision through 10 iterations."
    next_safe_action: "Use the final synthesis backlog to plan follow-up remediation."
    blockers:
      - "No implementation fixes were made in this research-only packet."
    key_files:
      - "decision-record.md"
      - "spec.md"
      - "plan.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000020"
      session_id: "020-cli-process-memory-leak-deep-research"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
# Decision Record: CLI Process Memory Leak Deep Research

<!-- SPECKIT_LEVEL: 3 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Run Sequential Telemetry-Gated Deep Research

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-05-22 |
| **Deciders** | User, main agent |

---

<!-- ANCHOR:adr-001-context -->
### Context

Prior sessions created memory pressure by using CLI skills to orchestrate agents inside other CLI runtimes. The risk is not only a JavaScript or Python heap leak; it includes orphan dispatchers, nested self-invocation, sidecars, stale locks, swap saturation, and Apple Silicon wired memory that user-mode kills cannot always release.

### Constraints

- The user requested 10 `/deep:start-research-loop` iterations against `.opencode/skills/system-spec-kit`.
- The user requested five `cli-claude-code` Opus 4.7 iterations and five `cli-codex` GPT-5.5 xhigh fast iterations.
- cli-X self-invocation guards must still apply when the active runtime matches the delegated CLI provider.
- The research run must not reproduce the process-spam failure mode by dispatching multiple CLIs concurrently.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: Run the investigation as sequential, telemetry-gated deep research with one CLI dispatch at a time and mandatory cleanup verification between iterations.

**How it works**: The workflow captures memory and process baselines, runs one iteration, writes required markdown and JSONL artifacts, kills or verifies dispatcher-owned children, records residual processes, and only then starts the next iteration. It stops before the next iteration if swap, free pages, JSONL state, or process cleanup is unsafe.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Sequential telemetry-gated deep research** | Matches deep-research state model, controls process growth, preserves evidence, respects cli-X safety rules. | Slower than parallel research. | 9/10 |
| Ad hoc shell loop over `claude` and `codex` | Easy to script. | Violates deep-research workflow ownership, risks orphan processes, bypasses state reducer. | 2/10 |
| Parallel CLI research wave | Faster wall-clock time. | Directly increases memory pressure and recreates the failure mode being investigated. | 3/10 |
| Implement fixes immediately | Could remove obvious issues quickly. | Risks speculative changes without leak classification or reproduction evidence. | 4/10 |

**Why this one**: Sequential telemetry-gated research is the only option that tests the suspected failure mode while actively preventing the test from overloading the machine.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- The research run has a hard safety boundary around process count, swap growth, and orphan cleanup.
- Follow-up fixes get evidence, owners, and verification strategies before implementation starts.
- The synthesis can separate expected daemons, user-process RSS leaks, and kernel-side pressure.

**What it costs**:
- The run takes longer because no CLI dispatches overlap. Mitigation: use the requested high-quality models and require each iteration to cover a distinct leak class.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Claude Opus 4.7 model flag is unavailable locally. | M | Block the Claude route and ask before substituting another model. |
| Memory pressure is already high before iteration 1. | H | Stop and recommend reboot if swap is above 70 percent. |
| Cleanup kills an unrelated process. | H | Require process lineage and dispatcher-owned matching before kill actions. |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | User reported real workstation overload from process buildup during multi-CLI AI sessions. |
| 2 | **Beyond Local Maxima?** | PASS | The plan inspects CLI skills, deep flows, MCP processes, sidecars, locks, and OS memory pressure. |
| 3 | **Sufficient?** | PASS | Ten iterations cover breadth without launching uncontrolled parallel dispatches. |
| 4 | **Fits Goal?** | PASS | The goal is leak discovery and fix backlog, not immediate implementation. |
| 5 | **Open Horizons?** | PASS | Findings become follow-up packets with testable remediation plans. |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- This packet creates the research contract, not production code changes.
- The future research run must use workflow-owned `/deep:start-research-loop` state files and executor audit metadata.
- The future synthesis must create remediation packets instead of patching code directly inside the research loop.

**How to roll back**: Preserve the completed `research/` artifacts. If a follow-up packet is not accepted, archive this packet as evidence-only and do not implement the remediation backlog.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->
