---
title: "Feature Specification: 101/008 Council Surface Polish"
description: "Surface 101/007's new artifacts (CONTRIBUTING.md, feature_catalog/, replay helper) through SKILL.md, publish a changelog entry covering the full 101/001..007 series, and add a smoke vitest covering the untested helper scripts (replay helper and bash runner)."
trigger_phrases:
  - "council surface polish"
  - "deep-ai-council changelog v1.1"
  - "council helpers smoke vitest"
  - "101/008"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/z_archive/020-deep-multi-ai-council-skill/008-council-surface-polish"
    last_updated_at: "2026-05-11T11:35:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Authored 008 spec"
    next_safe_action: "Update SKILL.md surface routes"
    blockers: []
    key_files:
      - .opencode/skills/deep-ai-council/SKILL.md
      - .opencode/skills/deep-ai-council/changelog/v1.1.0.0.md
      - .opencode/skills/system-spec-kit/mcp_server/tests/council-helpers-smoke.vitest.ts
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "101-008-surface-polish"
      parent_session_id: null
    completion_pct: 10
    open_questions: []
    answered_questions:
      - "Small additive packet; main-agent Edit/Write throughout, no cli-codex dispatch."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: 101/008 Council Surface Polish

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | In Progress |
| **Created** | 2026-05-11 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` (101 phase parent) |
| **Phase** | 8 of 8 |
| **Predecessor** | `007-council-infrastructure-hardening` |
| **Successor** | None |
| **Handoff Criteria** | All three follow-up items closed: SKILL.md surfaces new artifacts, changelog covers 101/001..007, smoke vitest covers replay helper + bash runner |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
After 101/007 closed the six earlier residual gaps, three smaller items remained: (1) SKILL.md does not reference the new artifacts shipped in 007 (`CONTRIBUTING.md`, `feature_catalog/`, `scripts/replay-graph-from-artifacts.cjs`), so a fresh consumer reading the skill entry point wouldn't discover them; (2) the `changelog/` directory only carries `v1.0.0.0.md` covering 101/001 and 101/003 — there's no published changelog entry for the 101/001..007 series as a whole; (3) the replay helper and bash matrix runner have no automated regression tests, so JSONL-mapping or shell-command-shape regressions would slip through.

### Purpose
Close these three follow-ups in one small additive packet, leaving 101 with discoverable + changelogged + test-protected helper infrastructure.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add SKILL.md cross-references to `CONTRIBUTING.md`, `feature_catalog/`, and `scripts/replay-graph-from-artifacts.cjs` in the appropriate sections (resource discovery, key resources, intent routing as applicable).
- Author `changelog/v1.1.0.0.md` summarizing the 101/001..007 series in the same human-readable style as `v1.0.0.0.md`.
- Add `mcp_server/tests/council-helpers-smoke.vitest.ts` with two tests: (a) replay helper end-to-end on a synthetic JSONL fixture; (b) `test-council-matrix.sh` shape assertion (exists, executable, contains expected command chain).
- Update `npm run test:council` script to include the new vitest file.

### Out of Scope
- Modifying any council runtime code or graph handlers.
- Touching 101/001..007 spec docs except parent 101 phase map.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/deep-ai-council/SKILL.md` | Modify | Reference CONTRIBUTING.md, feature_catalog/, replay helper |
| `.opencode/skills/deep-ai-council/changelog/v1.1.0.0.md` | Create | Series changelog for 101/001..007 |
| `.opencode/skills/system-spec-kit/mcp_server/tests/council-helpers-smoke.vitest.ts` | Create | 3 smoke tests |
| `.opencode/skills/system-spec-kit/mcp_server/package.json` | Modify | Append new vitest to `test:council` script |
| Parent 101 `spec.md` + `graph-metadata.json` | Modify | Add phase 008 |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | SKILL.md surfaces the new graph + catalog artifacts | grep finds `feature_catalog` and `replay-graph` in SKILL.md (`CONTRIBUTING.md` intentionally omitted per user direction; the file is discoverable by convention) |
| REQ-002 | Changelog v1.1.0.0.md exists and follows v1.0.0.0 format | File exists; passes sk-doc validate_document.py |
| REQ-003 | Smoke vitest passes 2/2 | `npx vitest run tests/council-helpers-smoke.vitest.ts` returns 2 tests passed |
| REQ-004 | `npm run test:council` includes the new vitest | Script string contains `council-helpers-smoke.vitest.ts` |
| REQ-005 | Full 10-file council vitest matrix passes | `npm run test:council` → 10 files, 0 failures |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | sk-doc quick_validate passes | Exit 0 |
| REQ-007 | Strict spec validation passes for 008 + parent 101 | Both 0 errors / 0 warnings |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A new consumer reading SKILL.md discovers the feature catalog and the replay helper without spelunking. (`CONTRIBUTING.md` stays discoverable by convention, not via skill cross-reference, per user direction.)
- **SC-002**: The 7-phase 101 work has a single discoverable changelog entry.
- **SC-003**: The three helper scripts have regression coverage so a future rename or path change surfaces immediately.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Smoke test for replay helper diverges from helper behavior | Low | Test uses helper's actual output as oracle; failures point at the helper, not the test |
| Risk | Shell-script shape tests too strict, break on cosmetic edits | Low | Assertions check command presence (substring) not exact byte-equivalence |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. User approved scope ("fix all").
<!-- /ANCHOR:questions -->
