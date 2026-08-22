---
title: "Implementation Plan: Phase 005 — mcp-notion verification + closeout"
description: "Author the mcp-notion closeout artifacts (manual-testing playbook, read-only install/doctor scripts, changelog), validate every mode doc, sweep cross-doc consistency, and reconcile completion metadata across the packet."
trigger_phrases:
  - "mcp-notion verification plan"
  - "mcp-notion closeout plan"
  - "notion mode phase 5 plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/014-mcp-notion/005-verification-and-closeout"
    last_updated_at: "2026-08-21T00:00:00Z"
    last_updated_by: "claude"
    recent_action: "Whole-mode validate 0 issues; doctor.sh green; packet continuity reconciled"
    next_safe_action: "Defer live Notion API round-trip smoke to the operator"
    blockers: []
    key_files: ["../001-deep-research/research/research.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "014-005-verification"
      parent_session_id: null
    completion_pct: 95
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 005 — mcp-notion verification + closeout

<!-- SPECKIT_LEVEL: 1 -->
<!--
SELF-CHECK:
- Confirm the plan names the simplest viable approach, affected surfaces, and verification path.
- Match phases to the stated scope; remove setup theater that does not change the outcome.
FAILURE MODES:
- Over-planning, missing rollback, and treating assumptions as dependencies.
-->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Bash setup scripts (read-only) + Markdown docs; no new runtime code |
| **Framework** | spec-kit `validate_document.py` + `mcp-tooling` hub routing/advisor |
| **Storage** | Mode docs + `changelog/`; no runtime state |
| **Testing** | `validate_document.py` (whole mode), `doctor.sh` (read-only), cross-doc consistency sweep |

### Overview
Author the closeout artifacts — an 11-scenario read-only / scratch-safe manual-testing playbook, read-only `install.sh` and `doctor.sh` (plus their README), and the `v0.1.0.0` changelog. Validate every mode doc, run the read-only diagnostics, sweep the mode's headline numbers for consistency, then reconcile completion metadata across the 014 parent and all five phase-children. The live Notion API round-trip smoke is deferred to the operator because it needs a real `notion_NOTION_TOKEN`.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Phases 001–004 complete (package authored + registered + advisor-rebuilt)
- [x] Live-smoke availability known (no real `notion_NOTION_TOKEN` in-env → operator-deferred)

### Definition of Done
- [x] All 14 mode docs pass `validate_document.py` at 0 issues
- [x] `doctor.sh` runs green (exit 0, read-only): Node/npx, registered manual, token-presence report
- [x] Cross-doc headline numbers agree across the mode
- [x] Completion metadata reconciled; `implementation-summary.md` written; `changelog/v0.1.0.0.md` authored
- [ ] Live Notion API round-trip smoke — deferred to the operator (needs a real `notion_NOTION_TOKEN`)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Author-then-verify-then-close — write the closeout artifacts, run every independent read-only check, sweep consistency, reconcile metadata, then write the closeout docs.

### Key Components
- **Closeout artifacts**: manual-testing playbook + read-only `install.sh`/`doctor.sh` (+ README) + changelog.
- **Checks**: whole-mode `validate_document.py` + `doctor.sh` diagnostics + cross-doc consistency sweep.
- **Closeout**: metadata reconciliation across the packet + `implementation-summary.md`.

### Data Flow
Completed package → authored closeout artifacts → whole-mode validate (0 issues) → doctor.sh (green) → consistency sweep → reconciled metadata → closeout docs → live API smoke deferred to operator.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Not applicable as a runtime/policy fix — this phase authors mode documentation and read-only setup scripts, and writes packet documentation (`implementation-summary.md`, cross-doc completion metadata, changelog). It adds no runtime code and makes no hub/advisor edits. `install.sh` and `doctor.sh` write no config and never print the token value; both are read-only probes. No mutation of a real Notion workspace occurs — the live API round-trip is deferred to the operator. (All runtime surfaces were inventoried and edited in Phases 002–004.)
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Confirm Phases 001–004 complete
- [x] Determine live-smoke availability (no real `notion_NOTION_TOKEN` in-env → plan operator-deferred)

### Phase 2: Core Implementation
- [x] Author `manual-testing-playbook/manual-testing-playbook.md` (11 read-only / scratch-safe scenarios)
- [x] Author read-only `scripts/install.sh` + `scripts/doctor.sh` + `scripts/README.md`
- [x] Author `changelog/v0.1.0.0.md`
- [x] Run `validate_document.py` across all 14 mode docs (0 issues)
- [x] Run `doctor.sh` (exit 0, read-only)

### Phase 3: Verification
- [x] Sweep cross-doc consistency (headline numbers agree across the mode)
- [x] Reconcile completion metadata across the 014 parent + all five phase-children (no conflicting states)
- [x] Write `implementation-summary.md` with verification evidence + final state
- [ ] Live Notion API round-trip smoke — deferred to the operator (needs a real `notion_NOTION_TOKEN`)
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Doc | Whole mode structure + content | `validate_document.py` (14 docs) |
| Diagnostics | Node/npx, registered manual, token presence | `doctor.sh` (read-only) |
| Consistency | Headline numbers across the mode | Cross-doc consistency sweep |
| Live smoke | Notion API round-trip | Code Mode `call_tool_chain` (operator-run; deferred) |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phases 001–004 | Internal | Green | Nothing to verify until the mode ships + registers |
| Real `notion_NOTION_TOKEN` + live workspace | External | Yellow | No live API smoke → operator-deferred |
| `validate_document.py` | Internal | Green | No whole-mode doc evidence without it |
| Node 18+/npx + registered Code Mode `notion` manual | Internal | Green | `doctor.sh`/`install.sh` probes report the gap otherwise |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: `validate_document.py` reports issues, `doctor.sh` exits non-zero, or the consistency sweep finds a disagreeing number.
- **Procedure**: this phase writes only docs and read-only scripts — no runtime to revert. Route any surfaced defect back to its owning phase (002–004 for a tool/registration bug) rather than patching here; re-run the checks after that phase's fix. Closeout stays blocked until validation is at 0 issues and `doctor.sh` is green.
<!-- /ANCHOR:rollback -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->
