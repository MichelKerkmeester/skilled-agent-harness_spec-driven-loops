---
title: "Feature Specification: Memory MCP to CLI Feasibility [system-spec-kit/027-xce-research-based-refinement/004-shared-infrastructure/001-mcp-to-cli-tool-transition/001-spec-memory-cli/000-spec-memory-cli-research/spec]"
description: "Deep-research feasibility study: can the mk-spec-memory MCP (37 tools) be replaced by a CLI tool with zero feature loss? Three candidate architectures evaluated by a 3-model fan-out."
trigger_phrases:
  - "memory mcp cli feasibility"
  - "mcp to cli"
  - "zero feature loss"
  - "mk-spec-memory cli"
  - "replace mcp with cli"
importance_tier: "important"
contextType: "specification"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-xce-research-based-refinement/004-shared-infrastructure/001-mcp-to-cli-tool-transition/001-spec-memory-cli/000-spec-memory-cli-research"
    last_updated_at: "2026-06-06T12:55:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Research record nested as phase 000"
    next_safe_action: "Run speckit:plan on ../001-cli-core to open implementation"
    blockers: []
    key_files:
      - "spec.md"
      - "research/research.md"
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Zero loss achievable: YES iff the daemon stays; GO with CLI-over-daemon plus auto-spawn"
      - "Run 4: all remaining items terminal (2 RESOLVED, 4 MITIGATED-terminal, 2 ACCEPTED); nothing unknown"
---
# Feature Specification: Memory MCP to CLI Feasibility

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
The mk-spec-memory MCP server (37 tools) is the spec-kit's continuity backbone, but the MCP transport carries real operational costs: a mid-session disconnect on 2026-06-06 permanently removed 45 tools from a live session because Claude Code never reconnects MCP transports, every session pays tool-schema token overhead, and each runtime needs separate MCP registration. Whether a CLI tool could replace the MCP surface WITHOUT losing any feature is unknown.

### Purpose
A verdict-shaped deep-research report that settles feasibility: a complete feature-parity matrix, a per-architecture loss table, and a go/no-go recommendation for replacing the MCP with a CLI.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- One heterogeneous deep-research fan-out run: DeepSeek-v4-pro, MiniMax-M3, and MiMo-V2.5-Pro lanes via cli-opencode, 5 iterations per lane (terminal cap), concurrency 2.
- Evaluation of THREE candidate architectures against the zero-feature-loss bar: (a) pure per-invocation CLI with no background processes; (b) CLI front-end over the existing daemon/IPC socket, killing only the MCP protocol layer; (c) hybrid CLI that auto-spawns the daemon on demand.
- Verdict synthesis in `research/research.md`: 37-tool parity matrix, daemon-dependency loss table, MCP-affordance replacement design, integration-surface migration map, risk register, go/no-go.
- Run 2 (operator-directed follow-up, 2026-06-06): CLI back-end design for dual-stack coexistence — 1 cli-codex lane (gpt-5.5, xhigh, fast), 3 forced iterations under `research/cli-backend/`.

### Research Key Questions
- **KQ1 — Parity matrix, all 37 tools.** A CLI equivalent per tool. Prior art: `generate-context.js` already performs memory_save; ~11 maintenance CLIs exist under `scripts/dist/memory/`.
- **KQ2 — Daemon-dependency audit.** What dies per architecture: warm embedder, file-watcher reindex, async embedding retry queue/enrichment, RSS watchdog, single-writer serialization, warm session briefs.
- **KQ3 — MCP-only affordances and replacements.** Tool-schema auto-discovery, runtime permissioning, Zod boundary validation, -32001 retryable semantics plus session-proxy replay classification.
- **KQ4 — Integration-surface migration.** Runtime hooks (Claude/OpenCode/Codex/Copilot) calling `session_bootstrap`/`memory_context`; agents' allowed-tools; `/doctor` flows; deep-loop allowed-tools.
- **KQ5 — Architecture comparison.** Architectures a/b/c scored with effort estimates, a risk register, and a go/no-go recommendation.

### Out of Scope
- Any implementation - no CLI is built, no code or config changes to mk-spec-memory, no migration; implementation is a future packet gated on this verdict.
- Benchmark execution - latency or RSS measurements may be proposed by the research, not run by it.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| research/** | Create | Workflow-owned deep-research outputs (lineages, registries, research.md) |
| spec.md | Modify | Generated spec-findings fence appended by the workflow at synthesis |
| tasks.md, implementation-summary.md | Modify | Post-run reconciliation |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | All three lanes complete (or salvaged partials are documented) and results merge | `research/orchestration-summary.json` records succeeded lanes; merged `deep-research-findings-registry.json` + `fanout-attribution.md` exist |
| REQ-002 | `research/research.md` is verdict-shaped | Contains a complete 37-row tool parity matrix, a per-architecture (a/b/c) daemon-dependency loss table, and a go/no-go recommendation with risk register and effort estimates, anchored in file:line evidence |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Zero-feature-loss bar applied honestly | Every feature is classed ported/adapted/lost per architecture; no unclassified features; "lost" entries enumerated explicitly |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A defensible go/no-go answer to "can the MCP be dropped without losing features", with the winning architecture named.
- **SC-002**: Parity coverage spans all 37 tools plus daemon services plus MCP-protocol affordances.
- **SC-003**: Per-lane iteration state recorded (terminal cap 5 x 3 lanes); any lane that legally stopped early is documented with its stop reason.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | opencode CLI + three provider pools (deepseek-api, minimax-token-plan, xiaomi-token-plan) | Lane fails mid-run | Salvage sweep recovers partials; merge tolerates partial lineages; single-executor re-run path documented in plan.md |
| Risk | A lane converges before iteration 5 (composite vote) | Med | Broad KQs resist saturation; actual per-lane counts recorded at reconciliation |
| Risk | MiniMax-M3 lane hits the 4h hard cap | Low | 1500s per-iteration ceiling; salvage sweep recovers completed iterations |
| Risk | Research drifts into implementation | Low | Explicit non-goals; lanes are read-only investigators |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Gap audit (run 2): is anything missing across this workstream's phase set before implementation? — ANSWERED: 0 P0, 2 P1 (Codex live-registration mismatch; Gemini documentation), 3 P2 — all patched into the packet docs 2026-06-06. Register: `research/gap-audit/lineages/gpt-gap/research.md`.
- Which architecture survives the zero-feature-loss bar, and at what effort? — ANSWERED: (b) and (c) survive; (a) fails. Adjudicated pick: (b) + auto-spawn at ~3 weeks. See generated findings below.
- Is strict zero loss achievable at all? — ANSWERED: YES, iff the daemon remains behind the CLI; only the MCP protocol layer is disposable. No tool is MCP-only.
- Can every remaining MITIGATED/DEFERRED/hedged item be terminally classified so nothing about the dual-stack CLI is unknown? — ANSWERED: YES — run 4 converged at 4/20 with all 8 closure questions terminal (2 RESOLVED, 4 MITIGATED-terminal with verified mitigations, 2 ACCEPTED with rationale); zero unknowns remain in dual-stack scope. See `research/research.md` §14.

<!-- BEGIN GENERATED: deep-research/spec-findings -->
_Source: `research/research.md` (merged 3-lane synthesis, 2026-06-06). Do not edit inside this fence._

- **Verdict: GO** — replace the MCP protocol layer with a CLI over the existing daemon/IPC socket, with connect-falls-back-to-spawn ("(b) + auto-spawn"). Zero feature loss confirmed: 37/37 tools, all daemon services, all protocol affordances preserved; MCP schema token overhead eliminated (net gain).
- **(a) pure per-invocation CLI FAILS the bar**: loses warm embedder, file-watcher reindex, async queues, and live session state; only 31–32/37 tools survive.
- **Parity**: 0 MCP-only tools; 22 STATELESS, 9–10 STATE-EMBED, 5–6 STATE-WATCHER; 5 tools already have CLI ports today (generate-context.js, cli.ts stats/bulk-delete, reindex-embeddings.js, validate-memory-quality.js).
- **Critical path**: OpenCode runtime support for registered shell tools with permission gating — 1–3 weeks upstream or a 2–3 day CLI shim. Total effort ~3 weeks; the CLI is a ~1,000 LOC thin IPC adapter; ship behind a feature flag with a dual-stack window; rollback is a 1–2 day revert.
- **Lane verdicts**: deepseek GO-(b), minimax GO-(c), mimo GO-(b) (deepseek-informed, not independent); orchestrator adjudicated to (b)+auto-spawn on the 2026-06-06 incident-mode evidence (owner-exit leaves the daemon down until demand; auto-spawn closes exactly that gap).
- **Run 2 (CLI back-end design, dual-stack)**: compiled `mcp_server/spec-memory-cli.ts` + `.opencode/bin/spec-memory.cjs` shim; subcommands GENERATED from `TOOL_DEFINITIONS` (37) with Zod at argv; auto-spawn via the existing launcher; exits 0/1/64/69/75; CLI = additional IPC client (multi-client bridge already test-proven); `--session-id` continuity; MCP stays registered; **8–12 day effort**. Full design: `research/cli-backend/lineages/gpt/research.md`.
- **Run 3 (risk resolution — CLEARED FOR IMPLEMENTATION)**: convergence-driven 2-lane run stopped at 3/20 and 5/20 with all questions terminally classified: 7 RESOLVED, 4 MITIGATED, 0 unresolved; 2 DEFERRED out-of-scope (OpenCode `tools:` gate, ~125-ref migration); 8 design deltas (~2–2.5d) absorbed into a consolidated **10–13 day** estimate; per-call overhead MEASURED ~50ms warm / ~150ms cold; gpt-5.5 escalation gate not triggered. Matrix: `research/research.md` §13.
- **Run 4 (total risk closure — NOTHING UNKNOWN)**: single gpt-5.5/xhigh lane converged at 4/20 (9.4 min, convergence 0.97); final posture **2 RESOLVED · 4 MITIGATED-terminal (mitigations specified + verified by code-trace/measurement) · 2 ACCEPTED · 0 UNRESOLVED · 0 unexamined hedges**. Both run-3 deferrals terminally classified: OpenCode `tools:` gate ACCEPTED (1.16.2 has no first-class shell gate; dual-stack doesn't need it), migration MEASURED at 93 files/1,041 refs (broad basis) and ACCEPTED as future packet. Corrections: warm hook overhead ~40–46ms p95 (not <1ms), default socket path 134B pre-pin. Deltas D1–D7+DD-001 re-derived bottom-up at 2.0–2.5d; **10–13d total confirmed**. Matrix: `research/research.md` §14.
<!-- END GENERATED: deep-research/spec-findings -->
<!-- /ANCHOR:questions -->

