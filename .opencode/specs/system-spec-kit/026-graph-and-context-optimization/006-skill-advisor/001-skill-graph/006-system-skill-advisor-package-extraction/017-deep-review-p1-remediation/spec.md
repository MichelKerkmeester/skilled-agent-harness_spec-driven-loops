---
title: "Feature Specification: 10-iter P1 remediation"
description: "Level 2 packet for closing R-004 stale lockdir recovery and S-004 shadow-sink path containment from the 013/009 10-iteration deep review."
trigger_phrases:
  - "013/009/017"
  - "R-004 lockdir"
  - "S-004 shadow sink"
importance_tier: "critical"
contextType: "specification"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/006-system-skill-advisor-package-extraction/017-deep-review-p1-remediation"
    last_updated_at: "2026-05-15T06:09:08Z"
    last_updated_by: "codex"
    recent_action: "P1 remediation implemented and advisor Vitest green"
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
# Feature Specification: 10-iter P1 remediation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-05-15 |
| **Branch** | `main` |
| **Spec Folder** | `017-deep-review-p1-remediation` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The 10-iteration review identified two P1 edge-case risks in the extracted `mk_skill_advisor` server: a stale bootstrap lock directory could block a clean checkout after a hard crash, and the shadow delta sink accepted an environment-controlled path without workspace containment validation.

### Purpose

Close both P1 findings surgically while preserving the existing server id, tool ids, launcher name, and runtime package shape.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Add stale lockdir detection and removal to `.opencode/bin/mk-skill-advisor-launcher.cjs`.
- Keep launcher artifacts from bypassing rebuild when source files are newer than dist output.
- Validate `SPECKIT_ADVISOR_SHADOW_DELTA_PATH` against workspace-root containment.
- Add focused Vitest coverage for lock recovery, stale artifact detection, and shadow path rejection.

### Out of Scope

- Renaming server ids, tool ids, skill ids, or launcher filenames.
- Broader subprocess environment whitelisting; that is tracked in packet 018 as a named follow-on.
- Editing immutable `review-10iter/` artifacts.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/bin/mk-skill-advisor-launcher.cjs` | Modify | Lock staleness and artifact freshness checks. |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/shadow/shadow-sink.ts` | Modify | Env-var sink path containment guard. |
| `.opencode/skills/system-skill-advisor/mcp_server/tests/launcher-bootstrap.vitest.ts` | Add | Lock and stale artifact regression tests. |
| `.opencode/skills/system-skill-advisor/mcp_server/tests/shadow-sink.vitest.ts` | Modify | Path rejection regression test. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Stale bootstrap lock directories are removed before waiting. | A lock older than the stale threshold is deleted and the launcher acquires a fresh lock. |
| REQ-002 | Stale dist artifacts do not bypass bootstrap rebuild. | `artifactsReady()` returns false when source mtimes are newer than dist output. |
| REQ-003 | Env-var shadow sink paths cannot escape the workspace root. | `recordShadowDelta()` returns `written: false` and writes no file for an outside env path. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: R-004 is fixed with unit coverage.
- **SC-002**: S-004 is fixed with unit coverage.
- **SC-003**: Full advisor Vitest remains green at or above 294 tests.
- **SC-004**: Strict validation passes for 017 and parent 013/009.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Launcher refactor changes runtime entry behavior | MCP server could fail to start. | Keep `require.main === module` behavior and syntax-check the launcher. |
| Risk | Shadow-sink tests use temp paths outside repo | Explicit `logPath` remains trusted for tests; only env-var path is bounded. |
| Dependency | Existing dirty worktree | Unrelated files could be staged. | Stage explicit dispatch-owned paths only. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Maintainability

- **NFR-M01**: Launcher bootstrap helpers are directly testable without starting the MCP server.
- **NFR-M02**: Shadow path validation returns a structured failure instead of throwing.

### Reliability

- **NFR-R01**: A hard-crash lockdir cannot force a 120-second timeout on the next clean bootstrap.
- **NFR-R02**: Source changes invalidate stale dist output.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Lockdir exists but artifacts are already fresh: launcher may still skip lock ownership.
- Lockdir exists, artifacts are missing or stale, and lockdir mtime exceeds threshold: launcher removes and reacquires.
- Env-var sink path points outside workspace: no file or parent directory is created.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 12/25 | Two code surfaces plus tests. |
| Risk | 14/25 | Launcher startup and path writing are sensitive. |
| Research | 8/20 | Review report and current implementation verified. |
| **Total** | **34/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

None. Gate 3 was pre-answered as Option B for `017-deep-review-p1-remediation`.
<!-- /ANCHOR:questions -->
