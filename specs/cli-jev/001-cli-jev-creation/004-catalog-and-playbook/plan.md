---
title: "Implementation Plan: Phase 4: catalog-and-playbook"
description: "Author the catalog and the playbook around shell-observable facts, execute every scenario the pin left runnable, record the skips with their blocker, and pass both package validators."
trigger_phrases:
  - "implementation plan"
  - "approach and phases"
  - "testing strategy"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-jev/001-cli-jev-creation/004-catalog-and-playbook"
    last_updated_at: "2026-09-20T11:30:00Z"
    last_updated_by: "claude-fable-5-1"
    recent_action: "Plan executed; the playbook was restructured to the per-scenario contract"
    next_safe_action: "None; the phase is closed"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-074-004-catalog-and-playbook"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "The two authenticated scenarios need a stored credential; both are recorded as skips"
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 4: catalog-and-playbook

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| Surfaces | Feature catalog (4 categories), manual testing playbook (22 scenarios, 5 categories), run report |
| Enforcement | `validate_catalog_package.py`, `validate-playbook-package.cjs`, the two dispatch suites |
| Evidence base | Phase 001's `scratch/probe-matrix.txt`, `probe-surface.txt` and `mcp-probe.py` |
| Baseline | No catalog and no playbook existed; the two package validators had nothing to judge |

### Overview

Write the inventory from what exists, then the test plan from what a shell can observe, then run what the pin left runnable. The catalog's anchors were written after the registration landed so every cited path resolves; the playbook's scenarios name an exit status, a stdout string, a JSON field or a suite verdict, which is what makes 20 of 22 executable without a provider key.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- The packet's rules and references exist, so the catalog has anchors to cite
- The pin's transcripts are on disk, so the exit-code scenarios have recorded evidence
- The two dispatch suites pass, so the guard scenarios can cite them

### Definition of Done

- [ ] The catalog package validator reports 0 violations for `cli-jev`
- [ ] The playbook package validator reports 22 scenarios, 5 categories, 0 violations
- [ ] Every executed scenario's evidence is quoted in its own file and summarized in the run report
- [ ] The two skipped scenarios name their blocker and the variables that would close them
- [ ] The run report's tally matches the scenario files
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Documentation-first inventory plus a contract-shaped test plan.

### Key Components

- **Catalog root and four categories**: transport classification, judgment primitives, dispatch guards, surfaces. Each category file carries implementation anchors.
- **Playbook root**: execution policy, provider and transport boundaries, the 22-entry index, the run-record pointer and failure triage.
- **Scenario files**: one per scenario, each carrying the contract table, the command, the expected signals, the recorded result and the triage.
- **Run report**: the verdict table, the raw evidence paths and the delta statement.

### Data Flow

A reader opens the catalog to learn what exists; an operator opens the playbook to prove it still works; both point into the packet's references, and the playbook's scenarios point at the pin's transcripts where those are the evidence.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Package validation | Catalog and playbook structure | `validate_catalog_package.py`, `validate-playbook-package.cjs` |
| Suite-backed scenarios | The three guard scenarios | `npx vitest run .skilled/hooks/dispatch/lib/dispatch-audit.test.mjs`, `node --test .skilled/hooks/dispatch/lib/dispatch-rule-checks.test.mjs` |
| Executed scenarios | The 20 runnable ones | The exact commands in each scenario file, from the repository root |
| Manual | The run record | Reading the report's tally against the files |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 001's pin and transcripts | Internal | Green | The exit-code scenarios would have no evidence |
| Phase 003's registration | Internal | Green | The catalog could not anchor a registered mode |
| The two dispatch suites | Internal | Green | The guard scenarios would cite nothing |
| A Jev credential | External | Red | Two scenarios stay SKIP; the other twenty are unaffected |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a package validator failure that traces to the authored shape, or a scenario whose observable proves unobservable.
- **Procedure**: revert the affected document tree (`git checkout -- <path>` for tracked files, re-author from the packet's references otherwise). The run report is regenerated from the scenario files, never hand-edited into agreement.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.skilled/skills/cli-external-orchestration/leaf-manifest.json` | Registers the packet's reference and asset leaves | Unchanged by this phase: the catalog and playbook are not leaves in the manifest's sense (the sibling packets' entries list references and assets only) | The hub gate's leaf-manifest byte check stayed green |
| `cli-jev/feature-catalog/**` | The packet's inventory | Create | Package validator: 0 violations |
| `cli-jev/manual-testing-playbook/**` | The operator test plan | Create, then restructure to one file per scenario | Package validator: 22 scenarios, 5 categories, 0 violations |
| Phase 001's `scratch/` transcripts | The evidence the scenarios cite | Unchanged: cited, not rewritten | Every cited line resolves |
<!-- /ANCHOR:affected-surfaces -->
