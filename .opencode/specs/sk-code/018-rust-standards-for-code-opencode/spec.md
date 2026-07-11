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
    last_updated_at: "2026-07-11T13:20:00Z"
    last_updated_by: "claude-code"
    recent_action: "All phases 001-006 complete; Rust is a first-class code-opencode language"
    next_safe_action: "Packet 018 complete — no further action"
    blockers: []
    key_files:
      - "spec.md"
      - "001-research/research/research.md"
      - "002-standard-docs/spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-07-11-sk-code-018-rust-standards-parent"
      parent_session_id: null
    completion_pct: 100
    status: "Complete"
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Feature Specification: Rust Standards for the code-opencode Surface (Phase Parent)

## How to read this packet

This packet adds **Rust** as a first-class language to the `sk-code` `code-opencode` surface, so that when Rust enters the codebase (the 011/013/030 rewrite-research packets all point at napi-rs/WASM/sidecar Rust as the realistic target), sk-code already carries its standards, checklists, and routing. Phase `001-research/` runs the deep-research pass; phases `002-standard-docs/` through `006-gate-verification-rollup/` implement the code-opencode change from the research findings (see the Phase Documentation Map below).

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Complete |
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
| `001-research/**` | Create | 001 | 10-round GPT-5.6-sol deep-research charter + loop artifacts (complete) |
| `002-standard-docs/**` | Create | 002 | Author the Rust trio + checklist + playbook |
| `003-surface-routing/**` | Create | 003 | code-opencode/SKILL.md detection + RUST intent/resource |
| `004-parent-union-drift-guard/**` | Create | 004 | smart_routing.md parent union + drift guard green |
| `005-touchpoints-and-multilang/**` | Create | 005 | Six registration touchpoints + touched-language-set change |
| `006-gate-verification-rollup/**` | Create | 006 | Run the gate plan + roll up the parent |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 001 | `001-research/` | 10-round deep-research pass (GPT-5.6-sol, high, fast, via `cli-opencode`) producing `research.md` with the Rust standard synthesis and an exact upgrade file/edit manifest | Complete |
| 002 | `002-standard-docs/` | Author the Rust standard docs: `references/rust/{style_guide,quality_standards,quick_reference}.md`, `assets/checklists/rust_checklist.md`, and `manual_testing_playbook/language-standards/009-rust-standards.md` (content from research.md Deliverables 1 + 3) | Complete |
| 003 | `003-surface-routing/` | `code-opencode/SKILL.md`: `.rs`/Cargo detection, RUST `INTENT_SIGNALS` + `RESOURCE_MAP`, `CODE_QUALITY` registration, surface non-negotiable (Deliverable 2B) | Complete |
| 004 | `004-parent-union-drift-guard/` | `shared/references/smart_routing.md` parent RUST union + `CODE_QUALITY`; make `sk-code-router-sync.vitest.ts` pass (Deliverable 2C). NOTE: the union is here, not in `sk-code/SKILL.md` | Complete |
| 005 | `005-touchpoints-and-multilang/` | Six registration touchpoints (stack_detection, hub-router.json, two Python verifiers, router-replay.cjs, shared trio) + the touched-language-set behavior change (Deliverable 2D) | Complete |
| 006 | `006-gate-verification-rollup/` | Run the Deliverable 4 gate plan (drift guard, fail-closed router-replay, verifiers, `validate.sh --strict`) and roll up the parent | Complete |

### Phase Transition Rules

- 001 is research-only (complete): it wrote findings under `001-research/research/` and touched no skill source.
- 002–005 run in dependency order (docs → surface routing → parent union → touchpoints); each phase's plan/tasks derive from `research.md`'s upgrade manifest.
- The upgrade is not "done" until phase 006's gates — the drift guard, the skill-benchmark router-replay (asserted fail-closed), and strict validation — are all green (the parent-hub union equality is a hard gate).

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001-research | 002-standard-docs | Loop hit the 10-round cap with a decision-ready manifest | `001-research/research/research.md` exists with a Rust standard + file/edit manifest (done) |
| 002 | 003 | Rust trio + checklist + playbook authored | The five `references/rust/*` + checklist + playbook files exist |
| 003 | 004 | code-opencode/SKILL.md routes RUST | Detection + RUST intent/resource + CODE_QUALITY registration present |
| 004 | 005 | Parent union mirrors the child map | `sk-code-router-sync.vitest.ts` passes |
| 005 | 006 | Every touchpoint recognizes Rust; touched-language set works | Verifiers + router-replay fixtures green |
| 006 | done | All gates green and parent rolled up | drift guard + fail-closed router-replay + verifiers + `validate.sh --strict` all pass |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- None for parent wiring. The substantive research questions live in `001-research/spec.md`; the implementation questions resolve across phases `002-standard-docs/` through `006-gate-verification-rollup/` after research.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Research child**: `001-research/` (complete)
- **Implementation children**: `002-standard-docs/`, `003-surface-routing/`, `004-parent-union-drift-guard/`, `005-touchpoints-and-multilang/`, `006-gate-verification-rollup/`
- **Upgrade target**: `../../../skills/sk-code/code-opencode/` (and parent hub `../../../skills/sk-code/`)
- **Motivating precedent**: `../../system-code-graph/011-rust-backend-rewrite-research/`, `../../system-skill-advisor/013-rust-backend-rewrite-research/`, `../../system-speckit/030-rust-backend-rewrite-research/`
- **Graph metadata**: `graph-metadata.json`
