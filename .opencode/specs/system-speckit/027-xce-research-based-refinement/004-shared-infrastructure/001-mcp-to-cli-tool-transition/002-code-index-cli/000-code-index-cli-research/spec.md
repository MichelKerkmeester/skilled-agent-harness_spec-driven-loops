---
title: "Feature Specification: Code-Index CLI Feasibility [system-spec-kit/027-xce-research-based-refinement/004-shared-infrastructure/001-mcp-to-cli-tool-transition/002-code-index-cli/000-code-index-cli-research/spec]"
description: "Deep-research feasibility study: can the mk_code_index MCP (8 tools) gain a dual-stack CLI fallback with zero feature loss? Single gpt-5.5 lane, forced 10 iterations, spec-memory record as settled prior art."
trigger_phrases:
  - "code index cli feasibility"
  - "code graph cli fallback"
  - "mk_code_index cli"
  - "028 002 research"
  - "code-index-cli research"
importance_tier: "important"
contextType: "specification"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-xce-research-based-refinement/004-shared-infrastructure/001-mcp-to-cli-tool-transition/002-code-index-cli/000-code-index-cli-research"
    last_updated_at: "2026-06-06T14:15:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Research complete: GO verdict with terminal KQ answers"
    next_safe_action: "Scaffold implementation phases on operator direction"
    blockers: []
    key_files:
      - "spec.md"
      - "research/research.md"
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Code-Index CLI CLI: GO (dual-stack, daemon-backed); see research/research.md"
---
# Feature Specification: Code-Index CLI Feasibility

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-06-06 |
| **Branch** | `main` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The mk_code_index MCP server (8 tools) is the structural-code-search backbone, but its only client surface is the MCP protocol layer: a mid-session transport disconnect removes the tools until restart (Code Graph showed "unavailable" at this session's own startup), every session pays schema token overhead, and hooks/cron/CI have no sanctioned shell path. The daemon architecture (launcher + IPC socket + owner lease, shared launcher-ipc-bridge.cjs) mirrors mk-spec-memory, whose CLI feasibility is already settled.

### Purpose
A verdict-shaped research report: per-tool parity matrix, daemon-dependency loss table, prior-art transfer assessment from the spec-memory record, and a go/no-go for a dual-stack code-index CLI.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- One deep-research run: single cli-codex lane (gpt-5.5, reasoning high, service tier fast), forced 10 iterations (terminal cap, convergence pinned 0), artifact dir `research/`.
- The settled spec-memory record as premise: generic CLI-over-daemon viability is NOT relitigated; the lane investigates mk_code_index-specific deltas only.
- Verdict synthesis in `research/research.md`: 8-tool parity matrix, daemon-dependency loss table, prior-art transfer assessment, integration-surface map, risk register + deltas, go/no-go with effort.

### Research Key Questions
- **KQ1** — Parity matrix, all 8 tools (CODE_GRAPH_TOOL_SCHEMAS): STATELESS vs STATE-DAEMON classification + CLI mapping per tool
- **KQ2** — Daemon-dependency audit: owner-lease heartbeat (20s), launcher idle monitor, plugin transport cache (TTL ~5s), readiness marker - what dies per architecture
- **KQ3** — MCP-affordance replacements: which spec-memory answers transfer verbatim (exit map, auto-spawn, --session-id) and which do not (validateToolArgs is hand-coded JSON-schema, NOT Zod - codegen path differs)
- **KQ4** — Prior-art deep-dive: mk-code-index-launcher.cjs as template; doctor:update orchestrator usage; zero existing CLI today
- **KQ5** — Long-running ops fit: code_graph_scan duration profile - per-call CLI vs async job semantics; code_graph_apply verification-gated recovery from a CLI
- **KQ6** — Integration-surface migration map MEASURED: agents (context/deep-review/deep-research), session-prime hooks across runtimes, plugin, doctor routes - exact files and counts
- **KQ7** — Hook-latency fit: session-prime and code_graph_status calls vs hook ceilings under the warm-only policy and the ~40-46ms p95 process-overhead baseline
- **KQ8** — Dual-stack coexistence + spawn races on the code-graph lease implementation (strict single-writer mode, MK_CODE_INDEX_STRICT_SINGLE_WRITER) + orphan reaping on a CLI-spawn path
- **KQ9** — Risk register + named design deltas (D-series) the implementation phases must absorb
- **KQ10** — Verdict synthesis: go/no-go, architecture pick, bottom-up effort, inheritance list for implementation phases

### Out of Scope
- Any implementation — no CLI is built; implementation phases are future siblings gated on this verdict.
- MCP removal or reference migration — dual-stack scope throughout.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| research/** | Create | Workflow-owned deep-research outputs (lineage, registry, research.md) |
| spec.md | Modify | Generated spec-findings fence appended at synthesis |
| tasks.md, implementation-summary.md | Modify | Post-run reconciliation |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The lane completes its forced-10 budget (or a salvaged partial is documented) | `research/orchestration-summary.json` records the lane outcome; state log carries 10 iteration records or a documented stop |
| REQ-002 | `research/research.md` is verdict-shaped | Complete 8-row parity matrix, daemon-dependency loss table, prior-art transfer table, go/no-go with risk register and effort, anchored in file:line evidence |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Zero-feature-loss bar applied honestly | Every tool and daemon service classed ported/adapted/lost per architecture; no unclassified items |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A defensible go/no-go for a dual-stack mk_code_index CLI, with the architecture named.
- **SC-002**: Coverage spans all 8 tools, all daemon services, and the prior-art transfer assessment.
- **SC-003**: Every spec-memory assumption reused is either confirmed-transferable or corrected with evidence.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | codex CLI + ChatGPT OAuth | Lane fails to dispatch | Auth proven on this host today; salvage sweep recovers partials |
| Risk | Forced-10 pads after register saturation | Low | 10 orthogonal KQs, one focus per iteration (run-1 precedent kept newInfoRatio flat) |
| Risk | Research drifts into implementation | Low | Explicit non-goals; lane is a read-only investigator |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Gap audit (run 2): is anything missing across this workstream's phase set before implementation? — ANSWERED: 0 P0, 2 P1 (phase-3 inventory; dual-failure acceptance), 3 P2 — all patched into the packet docs 2026-06-06. Register: `research/gap-audit/lineages/gpt-gap/research.md`.
- Can mk_code_index gain a dual-stack CLI fallback with zero feature loss, and at what effort? — ANSWERED: GO — daemon-backed dual-stack CLI with auto-spawn; 8/8 tools portable, 0 MCP-only; pure per-invocation CLI is NO-GO. Effort 6–9 days. See `research/research.md`.

<!-- BEGIN GENERATED: deep-research/spec-findings -->
_Source: `research/research.md` (single-lane synthesis, 2026-06-06). Do not edit inside this fence._

- **Verdict: GO** — daemon-backed dual-stack CLI for `mk_code_index` with auto-spawn; 8/8 tools portable, 0 MCP-only; launcher/lease/IPC-bridge/readiness all reused unchanged; MCP stays registered. **NO-GO: pure per-invocation CLI** (would reimplement lease/bridge/readiness/rollback machinery).
- **Prior-art transfer**: spec-memory pattern ports verbatim EXCEPT Zod codegen — code-index validation is hand-coded `validateToolArgs()` JSON-schema subset; manifest generates from `CODE_GRAPH_TOOL_SCHEMAS` instead. Exit map 0/1/64/69/75 inherited; **blocked-read rendering is the top system-specific risk** (stale-readiness `status: blocked` must never render as false success).
- **Measured**: integration surface ~51 files / 163 matching lines; short socket dirs already pinned in all 3 runtime configs. Hooks: warm-only; scan/apply/verify are explicit maintenance contexts.
- **Deltas D1–D10** specified (shim, compiled CLI, all-8 parity, validation parity, blocked-read rendering, exit taxonomy, timeout policy, dual-client + dual-spawn tests, dist-freshness). **Effort 6–9 engineering days.** Lane: 10/10 forced iterations, 10/10 KQs, newInfoRatio 1.00→0.22.
<!-- END GENERATED: deep-research/spec-findings -->
<!-- /ANCHOR:questions -->
