---
title: "Feature Specification: 10-iter P2 cleanup"
description: "Level 2 packet for auditing and closing the P2 findings from the 013/009 10-iteration deep review."
trigger_phrases:
  - "013/009/018"
  - "P2 cleanup"
  - "10-iter remediation"
importance_tier: "important"
contextType: "specification"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/006-system-skill-advisor-package-extraction/018-followup-p2-cleanup"
    last_updated_at: "2026-05-15T06:09:08Z"
    last_updated_by: "codex"
    recent_action: "P2 cleanup implemented with named deferrals"
    next_safe_action: "Strict-validate packet and commit"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "implementation-summary.md"
    completion_pct: 100
---
# Feature Specification: 10-iter P2 cleanup

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-05-15 |
| **Branch** | `main` |
| **Spec Folder** | `018-followup-p2-cleanup` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The review retained 28 P2 advisories across architecture, correctness, robustness, testing, security, performance, documentation, compatibility, and maintainability. The dispatch contract required every finding to be bucketed before fixing and limited single P2 fixes to surgical scope.

### Purpose

Close at least 75% of P2 findings through current-code audit, surgical remediation, or explicit stale/not-applicable classification, and name follow-on packets for the items that are too broad for this dispatch.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Consolidate duplicate advisor dispatch registration.
- Normalize the semantic-shadow shared import.
- Move advisor-owned test fixture helpers into the advisor package.
- Add dispatch, launcher, runtime config, and SQLite integrity coverage.
- Improve stale artifact detection, fatal cleanup, chokidar diagnostics, scorer lane indexing, and watcher configurability.
- Add runtime env parity across OpenCode, Claude, Gemini, and Codex configs.

### Out of Scope

- Tool-id, server-id, or skill-id renames.
- Editing immutable review artifacts.
- Editing sibling packets 001-016, except by named future packet.
- Broad subprocess environment whitelisting and schema bridge redesign.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `advisor-server.ts`, `tools/index.ts` | Modify | Single dispatch source of truth. |
| `semantic-shadow.ts` | Modify | Use `@spec-kit/shared` import. |
| `skill-graph-db.vitest.ts`, `tests/fixtures/skill-graph-db.ts` | Modify/Add | Advisor-local fixture ownership. |
| `fusion.ts`, `watcher.ts`, `sqlite-integrity.ts` | Modify | P2 robustness/performance cleanup. |
| Runtime configs | Modify | Env parity for advisor server. |
| Advisor tests | Modify/Add | Dispatch, config, launcher, SQLite, and shadow coverage. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P2 - Advisories

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Account for all 28 P2 findings. | Implementation summary contains a full bucket ledger. |
| REQ-002 | Close at least 75% through fixed or not-applicable classification. | 18 fixed and 3 not-applicable findings recorded. |
| REQ-003 | Name every deferred follow-on. | Seven deferred findings mapped to five named packets. |
| REQ-004 | Keep public ids stable. | No server/tool/skill id rename. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: P2 ledger has no silent skips.
- **SC-002**: Advisor Vitest reaches 299/299.
- **SC-003**: Strict validation passes for 018 and parent 013/009.
- **SC-004**: Files outside dispatch scope remain unstaged.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Dirty worktree contains parallel-session files | Accidental commit scope expansion. | Stage explicit file list only. |
| Risk | Some P2s are architectural rather than surgical | Scope creep. | Defer to named packets. |
| Dependency | Runtime configs parse correctly | Broken connector startup. | JSON parse check plus rename invariants test. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Maintainability

- **NFR-M01**: Tool dispatch has one implementation.
- **NFR-M02**: Advisor tests do not import spec-kit test fixtures.

### Performance

- **NFR-P01**: Fusion scorer avoids repeated lane match filter/map passes.
- **NFR-P02**: Watcher backpressure defaults are environment-configurable.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Runtime config parity must include OpenCode's `environment`, JSON `env`, and Codex TOML env sections.
- Unknown SQLite open errors should be reported as categorized integrity failures.
- Chokidar startup errors should report every checked path.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 18/25 | Multiple small P2s across code, tests, and configs. |
| Risk | 14/25 | Dispatch and runtime config paths are sensitive. |
| Research | 12/20 | Full 30-finding ledger audited. |
| **Total** | **44/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

None. Gate 3 was pre-answered as Option B for `018-followup-p2-cleanup`.
<!-- /ANCHOR:questions -->
