---
title: "Feature Specification: Rust Standards for the code-opencode Surface (Phase Parent)"
description: "Phase parent for adding Rust as a first-class language to the sk-code code-opencode surface: a 10-round GPT-5.6-sol deep-research pass over Rust best practices (weighted to napi-rs/WASM interop with the TS/Node MCP backend and determinism parity), our own skill conventions, and how code-opencode encodes standards for its other languages, followed by an implementation phase that ships the Rust standards/assets and keeps the parent-hub union + drift guard green."
trigger_phrases:
  - "018 rust standards code-opencode"
  - "sk-code rust language support"
  - "code-opencode rust standards"
  - "rust best practices sk-code"
  - "add rust to sk-code"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-code/018-rust-standards-for-code-opencode"
    last_updated_at: "2026-07-11T00:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Authored phase parent + the 001-research charter (10-round GPT-5.6-sol deep-research pass) and stubbed the 002-upgrade phase"
    next_safe_action: "Smoke-test the cli-opencode executor at 1 round, then launch the 10-round loop; then execute 002-upgrade from research.md"
    blockers: []
    key_files:
      - "spec.md"
      - "001-research/spec.md"
      - "002-upgrade/spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-07-11-sk-code-018-rust-standards-parent"
      parent_session_id: null
    completion_pct: 0
    status: "Not Started"
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Feature Specification: Rust Standards for the code-opencode Surface (Phase Parent)

## How to read this packet

This packet adds **Rust** as a first-class language to the `sk-code` `code-opencode` surface, so that when Rust enters the codebase (the 011/013/030 rewrite-research packets all point at napi-rs/WASM/sidecar Rust as the realistic target), sk-code already carries its standards, checklists, and routing. Phase `001-research/` runs the deep-research pass; phase `002-upgrade/` implements the code-opencode change from the research findings.

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Not Started |
| **Created** | 2026-07-11 |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | `sk-code` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`sk-code`'s `code-opencode` surface encodes per-language standards (TypeScript, Python, shell, JavaScript, config) as a `references/<lang>/{style_guide,quality_standards,quick_reference}.md` trio plus an `assets/checklists/<lang>_checklist.md` and a `manual_testing_playbook/language-standards/` entry, wired into a machine-readable SMART ROUTING block whose `RESOURCE_MAP` the parent hub mirrors under a drift guard. **Rust is not represented.** As the rewrite-research packets (`system-code-graph/011`, `system-skill-advisor/013`, `system-speckit/030`) converge on napi-rs/WASM/sidecar Rust as the plausible future, sk-code has no Rust standard to route to — a task touching a future `.rs` file would fall through to generic guidance.

### Purpose
Produce, from evidence, a Rust standard that (1) matches idiomatic Rust and the official API/style/lint guidance, (2) is weighted toward how this repo will actually use Rust — native modules interoperating with a TypeScript/Node MCP backend, under byte-for-byte determinism/parity contracts — and (3) is a faithful structural sibling of the existing language trios, then ship it into `code-opencode` without breaking the parent-hub union or the drift guard.

> **Phase-parent note:** This `spec.md` is the only authored document at this parent level. The research charter and the implementation plan live in the phase children.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Root-level routing for this packet's phase children.
- Holding `code-opencode` (and its parent hub `sk-code`) as the upgrade target and the existing language trios as the template.

### Out of Scope
- Writing Rust application code or scaffolding a Rust crate (this packet ships *standards*, not a Rust implementation).
- Changing the other language standards, the code-review or code-quality modes, or unrelated surfaces.

### Files to Change

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `spec.md` | Create | parent | Root purpose and child map |
| `description.json` | Create | parent | Search metadata for the parent |
| `graph-metadata.json` | Create | parent | Child identity and parent graph metadata |
| `001-research/**` | Create | 001 | 10-round GPT-5.6-sol deep-research charter + loop artifacts |
| `002-upgrade/**` | Create | 002 | Implementation of the Rust standards/assets + SKILL/parent-hub/drift-guard edits |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 001 | `001-research/` | 10-round deep-research pass (GPT-5.6-sol, high, fast, via `cli-opencode`) over three thrusts — external Rust best practices (weighted to napi-rs/WASM interop + determinism parity), our own skill/standard conventions, and how code-opencode encodes its other languages — producing `research.md` with a concrete Rust standards synthesis and an exact upgrade file/edit manifest | Not Started |
| 002 | `002-upgrade/` | Implement the manifest: `references/rust/*`, `assets/checklists/rust_checklist.md`, `manual_testing_playbook/language-standards/004-rust-standards.md`, `code-opencode/SKILL.md` detection + SMART-ROUTING edits, and the parent `sk-code` hub union + drift-guard update; gate on drift guard + skill-benchmark router-replay + `validate.sh --strict` | Planned |

### Phase Transition Rules

- 001 is research-only: it writes findings under `001-research/research/` and touches no skill source.
- 002 begins only after 001 converges; its plan/tasks are derived from `research.md`'s upgrade manifest.
- The upgrade in 002 is not "done" until the drift guard, the skill-benchmark router-replay, and strict validation are all green (the parent-hub union equality is a hard gate).

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| root | 001-research | Research charter authored with predefined angles + runnable executor config | `001-research/spec.md` §7 lists the angles; `deep-research-fanout-config.json` uses `cli-opencode` |
| 001-research | 002-upgrade | Loop converged or hit the 10-round cap with a decision-ready manifest | `001-research/research/research.md` exists with a Rust standard + file/edit manifest |
| 002-upgrade | done | Rust standards shipped and gates green | drift guard + router-replay + `validate.sh --strict` all pass |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- None for parent wiring. The substantive research questions live in `001-research/spec.md`; the implementation questions resolve in `002-upgrade/` after research.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Research child**: `001-research/`
- **Upgrade child**: `002-upgrade/`
- **Upgrade target**: `../../../skills/sk-code/code-opencode/` (and parent hub `../../../skills/sk-code/`)
- **Motivating precedent**: `../../system-code-graph/011-rust-backend-rewrite-research/`, `../../system-skill-advisor/013-rust-backend-rewrite-research/`, `../../system-speckit/030-rust-backend-rewrite-research/`
- **Graph metadata**: `graph-metadata.json`
