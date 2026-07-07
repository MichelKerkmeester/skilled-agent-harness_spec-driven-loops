---
title: "Feature Specification: Skill-Advisor CLI Feasibility [system-skill-advisor/008-skill-advisor-cli/000-skill-advisor-cli-research/spec]"
description: "Deep-research feasibility study: can the mk_skill_advisor MCP (9 tools) gain a dual-stack CLI fallback with zero feature loss? Single gpt-5.5 lane, forced 10 iterations, spec-memory record as settled prior art."
trigger_phrases:
  - "skill advisor cli feasibility"
  - "skill advisor cli fallback"
  - "mk_skill_advisor cli"
  - "028 003 research"
  - "skill-advisor-cli research"
importance_tier: "important"
contextType: "specification"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/008-skill-advisor-cli/000-skill-advisor-cli-research"
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
      - "Skill-Advisor CLI CLI: GO (dual-stack, daemon-backed); see research/research.md"
---
# Feature Specification: Skill-Advisor CLI Feasibility

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
The mk_skill_advisor MCP server (9 tools: 4 advisor + 5 skill_graph) powers Gate-2 routing and the prompt-submit advisor brief, but the MCP surface has the same transport fragility class as the other servers - and this system already shipped a partial answer: skill_advisor.py (3,642 lines) is the documented Gate-2 fallback covering advisor_recommend via a DIVERGENT Python scorer with a native-bridge probe, while advisor_rebuild and 4 of 5 skill_graph tools have no CLI at all. Six orphaned mk-skill-advisor launchers were observed on this host - the lifecycle question is live here.

### Purpose
A verdict-shaped research report: per-tool parity matrix, daemon-dependency loss table, a reconcile-vs-supersede-vs-coexist decision for skill_advisor.py, and a go/no-go for a dual-stack skill-advisor CLI.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- One deep-research run: single cli-codex lane (gpt-5.5, reasoning high, service tier fast), forced 10 iterations (terminal cap, convergence pinned 0), artifact dir `research/`.
- The settled spec-memory record as premise: generic CLI-over-daemon viability is NOT relitigated; the lane investigates mk_skill_advisor-specific deltas only.
- Verdict synthesis in `research/research.md`: 9-tool parity matrix, daemon-dependency loss table, prior-art transfer assessment, integration-surface map, risk register + deltas, go/no-go with effort.

### Research Key Questions
- **KQ1** — Parity matrix, all 9 tools (TOOL_DEFINITIONS): STATELESS vs STATE-DAEMON classification + CLI mapping per tool
- **KQ2** — Daemon-dependency audit: FS watcher (graph-metadata auto-rebuild), daemon-lease sqlite, prompt cache, telemetry sink - what dies per architecture
- **KQ3** — MCP-affordance replacements: which spec-memory answers transfer verbatim and which do not (Zod schemas here ARE exportable - closest to the spec-memory codegen path)
- **KQ4** — Prior-art deep-dive THE CENTRAL QUESTION: skill_advisor.py coverage matrix per tool; QUANTIFY Python-vs-TypeScript scorer divergence (same prompts, both paths, measure recommendation deltas); native-bridge probe mechanics; verdict: reconcile, supersede, or coexist
- **KQ5** — Long-running ops fit: advisor_rebuild and skill_graph_scan + skill_graph_compiler.py build chain - per-call CLI vs job semantics
- **KQ6** — Integration-surface migration map MEASURED: UserPromptSubmit hooks across claude/gemini/codex, prompt-wrapper fallback, OpenCode plugin + bridge, doctor:skill-advisor + skill-budget routes, deep-loop callers - exact files and counts
- **KQ7** — Hook-latency fit SHARPEST HERE: the advisor brief sits on the prompt-submit critical path in every runtime - measure the current brief path and bound what a CLI shell-out adds under the warm-only policy
- **KQ8** — Dual-stack coexistence + spawn races on the skill-advisor lease + THE ORPHAN INCIDENT: root-cause the six-orphaned-launchers class and what reaping guarantee a CLI-spawn path needs
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
| REQ-002 | `research/research.md` is verdict-shaped | Complete 9-row parity matrix, daemon-dependency loss table, prior-art transfer table, go/no-go with risk register and effort, anchored in file:line evidence |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Zero-feature-loss bar applied honestly | Every tool and daemon service classed ported/adapted/lost per architecture; no unclassified items |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A defensible go/no-go for a dual-stack mk_skill_advisor CLI, with the architecture named.
- **SC-002**: Coverage spans all 9 tools, all daemon services, and the prior-art transfer assessment.
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

- Gap audit (run 2): is anything missing across this workstream's phase set before implementation? — ANSWERED: 0 P0, 7 P1 (resident services, Devin trace, Gemini doc, inventory, tri-daemon drill, latency split, dual-failure), 2 P2 — all patched into the packet docs 2026-06-06. Register: `research/gap-audit/lineages/gpt-gap/research.md`.
- Can mk_skill_advisor gain a dual-stack CLI fallback with zero feature loss, and at what effort? — ANSWERED: GO — additive generated 9-tool CLI over the handler/compat stack; skill_advisor.py RECONCILED as legacy facade (not superseded); warm-only hooks mandatory (one-shot native 824.8ms measured). Effort: 3 medium packets. See `research/research.md`.

<!-- BEGIN GENERATED: deep-research/spec-findings -->
_Source: `research/research.md` (single-lane synthesis, 2026-06-06). Do not edit inside this fence._

- **Verdict: GO** — additive, generated, handler-backed 9-tool CLI over the existing handler/compat stack with launcher/IPC auto-spawn; MCP stays the rich primary transport. **NO-GO: MCP removal or blessing skill_advisor.py as the final CLI.**
- **Central question answered — RECONCILE, not supersede**: `skill_advisor.py` (3,642 lines) stays as a legacy compatibility facade; measured scorer parity 10/10 identical top recommendations local-vs-native; coverage gaps confirmed (zero CLI for advisor_rebuild + 4 of 5 skill_graph tools). Parity fixture becomes a regression gate (D2).
- **Measured (5-sample sweeps)**: one-shot native bridge **824.8ms median — kills per-prompt hook use**; local one-shot 74.9ms; batch-10 ~276ms (startup amortizes). **Warm-only hook policy is mandatory**; cache-hit p95 <60ms test bar stays the acceptance gate.
- **Orphan class root-caused**: leak paths sit outside normal child-exit cleanup (killed parents, stale lease/no socket, removed worktrees) — CLI spawn path requires owner token + process-group reaping + stale-socket probe + idle timeout (D6). Graph-mutating commands get a fail-closed trusted-caller gate (D3).
- **Deltas D1–D8** specified; **effort: medium, 3 implementation packets** (registry/parser, handler-IPC + Python reconciliation, hook/plugin/doctor/lifecycle). Lane: 10/10 forced iterations, 10/10 KQs.
<!-- END GENERATED: deep-research/spec-findings -->
<!-- /ANCHOR:questions -->
