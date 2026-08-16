---
title: "Feature Specification: Playbook Inventory Reconciliation"
description: "The manual-testing-playbook inventory test drifted after the kebab-migration: its dir glob (^\\d{2}--) matches nothing, table links point at stale paths while renamed files sit unlinked, and the count/path-format are stale. Reconcile the table + test to the ACTUAL scenario files without fabricating or dropping any scenario."
trigger_phrases:
  - "manual playbook inventory drift"
  - "playbook 47 scenario test"
  - "playbook table stale links"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/022-playbook-inventory-reconciliation"
    last_updated_at: "2026-08-16T04:15:28Z"
    last_updated_by: "claude-code"
    recent_action: "Reconciled 43 stale round-trip links + the kebab dir glob; inventory test green, tsc exit 0"
    next_safe_action: "Commit the two-file reconciliation; land on v4 + main per operator gate"
    blockers: []
    key_files:
      - "spec.md"
      - "implementation-summary.md"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Playbook Inventory Reconciliation

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-08-16 |
| **Branch** | `skilled/v4.0.0.0` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

`tests/manual-testing-playbook.vitest.ts` guards that the root playbook table matches the live scenario corpus. The kebab-migration renamed the scenario directories (`NN--name` → kebab like `scorer-fusion/`), so the test's `/^\d{2}--/` directory glob now matches **zero** files, the table's scenario links point at stale paths while the renamed files sit unlinked, and the hardcoded count (47) and path-format no longer match reality.

### Purpose

Reconcile the root playbook table and the inventory test to the ACTUAL scenario files so the test passes because the doc matches reality — never by dropping a real scenario, inventing an ID, or loosening an assertion.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- `manual-testing-playbook/manual-testing-playbook.md` — reconcile each scenario row's link to its actual file; fix the count/text.
- `mcp-server/tests/manual-testing-playbook.vitest.ts` — fix the stale dir glob, count, and path-format to the real kebab structure.

### Out of Scope

- Adding or removing scenarios (author no new scenario, drop no real one).
- Loosening any assertion.
- Other advisor subsystems.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `system-skill-advisor/manual-testing-playbook/manual-testing-playbook.md` | Modify | Point each scenario row at its actual file; fix the count/text |
| `system-skill-advisor/mcp-server/tests/manual-testing-playbook.vitest.ts` | Modify | Fix the stale glob / count / path-format |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The inventory test passes because the doc matches the real files | `vitest run tests/manual-testing-playbook.vitest.ts` green |
| REQ-002 | No scenario fabricated or dropped | Every table row maps to a real file and every real scenario file is listed once |
| REQ-003 | No assertion loosened | The table↔file equality check and the existence checks remain; only stale glob/count/paths are corrected |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Typecheck stays clean | `tsc --noEmit` exit 0 |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The inventory test is green and the table lists exactly the live scenario files, one-to-one.
- **SC-002**: The diff is table-link + test-glob/count/path corrections only — no scenario added/removed, no assertion weakened.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A weak model fabricates IDs or drops a scenario to force green | High | Isolated worktree + BANNED-OPS scope lock + parent reviews the full diff for fabrication before integrating |
| Risk | The mapping is genuinely ambiguous | Medium | Executor stops and reports rather than guessing |
| Dependency | The renamed scenario files are the canonical set | Green | Reconcile the table to the files on disk |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- If any table row cannot be mapped one-to-one to a real file, is it a stale row to update or a scenario to author? Resolved during reconciliation; authoring is out of scope and stops for review.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Sibling packet**: `021-advisor-suite-drift-reconciliation`
