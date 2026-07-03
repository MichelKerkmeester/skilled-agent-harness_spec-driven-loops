---
title: "Spec: Command Contract Compiler"
description: "Phase 003 of packet 035 (unified command-contract architecture). Design-first. The central restructure (plan-review GAP-58): every command emits ONE build-time self-contained typed contract the executor reads first — Gate-3 line, verbatim render block, output template, write boundary, receipts + progress contract refs, tool list, absorption-abort rule — with maintainers keeping layered sources behind a drift guard. Subsumes old render/agent-contracts/compiled/injection phases. Closes F-006/007/009/019/020/021/022/027/029/035/036/037/038/039/042. Absorbs GAP-02/09/10/42/43/46/52/53/55/56/57/58."
trigger_phrases:
  - "035 phase 003"
  - "command contract compiler"
  - "compiled execution contract"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "deep-loops/035-gpt-reliability-fixes/003-command-contract-compiler"
    last_updated_at: "2026-07-03T16:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Authored: command contract compiler"
    next_safe_action: "Execute after 002; first deliverable is the contract schema + compiler + drift-guard design"
    blockers: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "035-003-restructure"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Spec: Command Contract Compiler

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-03 |
| **Parent Packet** | ../ (035-gpt-reliability-fixes) |
| **Parent Spec** | ../spec.md |
| **Predecessor** | [../002-gate3-precedence-and-validator/spec.md](../002-gate3-precedence-and-validator/spec.md) |
| **Successor** | [../004-dispatch-receipts-and-progress/spec.md](../004-dispatch-receipts-and-progress/spec.md) |
| **Closes findings** | F-006, F-007, F-009, F-019, F-020, F-021, F-022, F-027, F-029, F-035, F-036, F-037, F-038, F-039, F-042 |
| **Effort** | L |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

GPT executors don't reliably see a command's contract because it's distributed across ~14 files and weighted by file position — the single root defect the plan-review found the original plan fixing in five fragments (render, agent-contracts, compiled, injection, prelude). This phase implements the unified fix (GAP-58): a build-time compiler emits ONE self-contained typed contract per command, embedded as the first ~150 lines of the compiled prompt. Executors read the contract; maintainers keep the layered sources; a drift guard keeps them in sync. This also neutralizes the risk (GAP-57) that a raw-injected hard-rule prelude becomes a new Claude-shaped convention — the contract is typed and mode-bound, not prose.

No 034 design iteration exists for the compiled contract or setup loader (GAP-53), so this phase is DESIGN-FIRST: the contract schema, compiler, and drift-guard contract are designed before any build. Findings closed: F-006, F-007, F-009, F-019, F-020, F-021, F-022, F-027, F-029, F-035, F-036, F-037, F-038, F-039, F-042. Absorbs GAP-02, GAP-09, GAP-10, GAP-42, GAP-43, GAP-46, GAP-52, GAP-53, GAP-55, GAP-56, GAP-57, GAP-58.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

**In scope:** the contract schema (typed sections + external-ref types), the build/compile step and its canonical target, the drift-guard contract, a deterministic setup loader, the render block (:auto + :confirm), the EXECUTOR CONTRACT block, the injection step (inject the contract + one link), and converting all 14 agent files to contract pointers. The first command's contract (review) is built end-to-end; remaining commands are retrofit in phase 005.

**Out of scope:** the receipt + progress contract MECHANISMS (phase 004 authors them; this phase only references them in the contract schema); retrofit of the other four commands + sibling lanes (phase 005).
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

- **REQ-001 (design-first)**: Design the contract schema (typed sections: Gate-3 precedence line, verbatim render block, output template, write boundary, receipts/progress refs, tool list, absorption-abort rule), the compiler, the external-ref type taxonomy (read_contract | render_template | invoke_script | dynamic_target | conditional_fanout | post_loop_save), and the drift-guard CONTRACT — when it fires (fail/warn/override), the resolve order between sources and the compiled artifact, and the recovery command (F-035/036/037, GAP-53, GAP-55).
- **REQ-002**: Build the compiler + a single canonical build target and a deterministic setup loader that emits one hydrated execution packet before the model sees the workflow; unresolved placeholders fail early (F-038, F-009).
- **REQ-003**: The contract embeds the verbatim setup-render block with START/END markers and a "render only the marked block" rule, covering BOTH `:auto` and `:confirm` (F-006, F-007, F-042, GAP-42).
- **REQ-004**: The contract embeds the EXECUTOR CONTRACT block (7-10 numbered hard rules: authority, first action, forbidden, required output, verification, write boundary, stop condition) typed and mode-bound to `executionMode==='autonomous'` + `writeBoundary` presence — NOT raw injected prose (F-019/020/021/022/039, GAP-57). All 14 agent files reduce to a "load the contract for command X" pointer (GAP-43).
- **REQ-005**: The injection step injects the contract + one link and dedupes the double-injected root policy (hash → one canonical copy + mirror note); enumerate the other injection paths (session-prime, MCP transport briefs, hooks) and slim/defer them for autonomous runs via a per-command deferral matrix that keeps first-turn Gate-2 routing tokens (F-027, F-029, GAP-46, GAP-56).
- **REQ-006**: The contract embeds the absorption-abort rule ("producing findings without a dispatch receipt is role absorption; write no findings") so the durable guard lands with the first command's contract, BEFORE phase 004's structural receipts (GAP-02).
- **REQ-007**: Structural acceptance artifacts (GAP-10): a contract-present assertion (`grep -c '^## EXECUTOR CONTRACT' == 1` in the first N lines), a drift-guard CI check, a deterministic-loader unit test (unresolved placeholder fails before model execution), and a token-budget assertion (≤1 canonical root-policy copy).
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

1. Contract schema + compiler + drift-guard contract designed and reviewed before build (design-first gate).
2. The review command emits one self-contained contract; the drift guard blocks source/compiled divergence; the loader fails on unresolved placeholders.
3. Agent files are pointers; injection is deduped; the deferral matrix preserves first-turn routing tokens.
4. Structural assertions green (contract-present, drift CI, loader unit test, token budget).

**Acceptance harness (033 cells):** RVB-002, CXB-002, IMB-003 (D2 render) on the review command + the structural assertions. Ship behind the phase-001 feature flag.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Risk / Dependency | Handling |
|---|---|
| GAP-53 — no design exists | Design-first REQ-001; if it exceeds an implementation phase, carve into a 036 packet |
| GAP-55 — new source/compiled drift class | Drift-guard contract specified before build (REQ-001) |
| GAP-57 — prelude becomes a new convention | Contract typed + mode-bound, not raw prose |
| GAP-56 — slimming starves first-turn routing | Per-command deferral matrix keeps routing tokens; 006-cell non-regression gate (phase 005) |
| GAP-09 — 002↔010 collision | Dissolved: one contract, not two injection edits |
| Depends on 002 validator + boundSpecFolder | Contract's Gate-3 line consumes the phase-002 classifier API |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Contract artifact format (single compiled markdown vs structured JSON + renderer) is a REQ-001 design decision; escalate to a 036 packet if the compiler + drift guard exceed an implementation phase.
<!-- /ANCHOR:questions -->
