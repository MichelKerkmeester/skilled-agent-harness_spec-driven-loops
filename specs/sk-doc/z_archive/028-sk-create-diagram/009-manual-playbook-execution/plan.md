---
title: "Implementation Plan: sk-create-diagram manual playbook execution"
description: "3 dispatches to deepseek/deepseek-v4-flash direct API, each independently verified, results recorded via the canonical wrapper."
trigger_phrases:
  - "diagram playbook execution plan"
importance_tier: "important"
contextType: "planning"
status: "draft"
_memory:
  continuity:
    packet_pointer: "sk-doc/028-sk-create-diagram/009-manual-playbook-execution"
    last_updated_at: "2026-08-12T18:40:07.000Z"
    last_updated_by: "claude"
    recent_action: "Authored plan"
    next_safe_action: "Run dispatch 1"
    blockers: []
    key_files:
      - "plan.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-create-diagram-fork"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: sk-create-diagram manual playbook execution

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown scenario prompts, real HTML/SVG outputs, Python extraction scripts, Node.js result wrapper |
| **Framework** | `sk-create-manual-testing-playbook` execution contract, `run-manual-playbook-scenario.cjs` results storage contract |
| **Storage** | `docs/` (repo-root scratch outputs, per Global Precondition #4), `benchmark/reports/` (harness-owned) |
| **Testing** | Real skill execution is the test; every claim independently re-verified afterward |

### Overview

3 dispatches to `deepseek/deepseek-v4-flash` (direct DeepSeek API, via `cli-opencode`), grouped by dependency: (1) diagram-generation DIA-001..004, (2) import IMP-001..002 (needs fixtures provisioned first), (3) IMP-003+CMD-001+CMD-002 (IMP-003 depends on DIA-001's output). Orchestrator independently verifies every claim before recording via the canonical wrapper.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] All 9 scenarios' exact prompts read from `manual-testing-playbook.md`.
- [x] DeepSeek direct-API provider confirmed authenticated (`opencode providers list` shows 5 credentials).
- [x] Missing fixtures (`docs/system.drawio`, `docs/onboarding.md`) provisioned and smoke-tested against the real extraction scripts.
- [x] Playwright availability checked (absent — IMP-003 PNG sub-step expected `SKIP`).

### Definition of Done

- [x] 9/9 scenarios executed for real.
- [x] Every claim independently verified (caught 1 real discrepancy: a fabricated checksum claim).
- [x] 9/9 results recorded via `run-manual-playbook-scenario.cjs`.
- [x] Harness-generated run index confirms all 9 results.
- [x] `implementation-summary.md` and `checklist.md` written honestly, including the fabrication finding and the 2 packet-content follow-ups.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Dispatch-execute-verify-record, 3 times: launch one `opencode run` dispatch against the direct DeepSeek API, wait, independently verify every claim against real files/checksums/registry content, fix or correct anything that doesn't match reality, then record through the canonical wrapper — never accept a self-report as evidence.

### Key Components

- **Dispatch 1** (DIA-001..004): diagram-generation category, produces 3 real diagrams + 1 gate-refusal test.
- **Dispatch 2** (IMP-001..002): import category, uses provisioned fixtures, produces 2 real redrawn diagrams with fidelity ledgers.
- **Dispatch 3** (IMP-003, CMD-001, CMD-002): export (depends on DIA-001's output), command router, hub registration verification.
- **Independent verification**: file existence/bytes/checksums, `xml.dom.minidom` XML validity, registry JSON structure walks, `git status` mutation checks — run by the orchestrator, separate from what each dispatch claims.

### Data Flow

Read scenario prompts -> provision fixtures -> dispatch 1 (creates docs/checkout-architecture.html, needed by dispatch 3) -> verify -> record -> dispatch 2 -> verify -> record -> dispatch 3 -> verify (catches 1 fabricated checksum, corrects it) -> record -> confirm harness-generated run index -> evaluate Release Readiness Rule.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `docs/*.drawio`, `docs/*.md` (fixtures) | Do not exist | Create, smoke-test | Real extraction script run |
| `docs/*.html`, `docs/*.svg` (outputs) | Do not exist | Create via real scenario execution | File existence, byte count, checksum, XML validity, accessible-SVG contract grep |
| `benchmark/reports/` | Does not exist | Create via `run-manual-playbook-scenario.cjs` (9 invocations) | Harness-generated run index re-read |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup

- [x] Read all 9 scenario prompts, confirm DeepSeek direct-API auth, provision + smoke-test 2 fixtures, confirm Playwright absence.

### Phase 2: Implementation

- [x] Dispatch 1, verify, record (4 scenarios).
- [x] Dispatch 2, verify, record (2 scenarios).
- [x] Dispatch 3, verify (catches 1 fabricated checksum claim), record (3 scenarios).

### Phase 3: Verification

- [x] Confirm harness-generated run index shows 9/9 results correctly.
- [x] Evaluate Release Readiness Rule.
- [x] Write `implementation-summary.md` and `checklist.md`.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Real execution | All 9 scenarios | Live skill use — real file reads, real script runs, real writes |
| Evidence verification | Every dispatched claim | File existence, `shasum`, `xml.dom.minidom`, JSON structure walks, `git status` |
| Results integrity | 9 recorded outcomes | `run-manual-playbook-scenario.cjs` + harness-generated run index |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 008 clean packet structure | Internal | Satisfied | Scenarios would load stale/wrong paths |
| DeepSeek direct API auth | External | Satisfied (5 credentials configured) | Would need to ask the user for auth before dispatching |
| Playwright (IMP-003 PNG) | External/environment | Absent | Documented `SKIP`, matches the playbook's own expectation |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A scenario mutates a file it shouldn't (e.g. DIA-003 accidentally writing `style-guide.md`).
- **Procedure**: `git checkout -- <path>` immediately; all 9 scenarios were designed so only new `docs/*` files and the harness-owned `benchmark/reports/` tree are ever write targets.
<!-- /ANCHOR:rollback -->
