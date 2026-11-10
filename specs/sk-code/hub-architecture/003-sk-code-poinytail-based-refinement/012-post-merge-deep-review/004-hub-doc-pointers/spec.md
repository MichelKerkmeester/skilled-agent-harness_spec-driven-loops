---
title: "Feature Specification: Phase 4: hub-doc-pointers"
description: "Two sk-code hook scenarios and the playbook root call a legacy, unregistered shell hook the live PostToolUse hook, and the stack detection table cites a file that does not exist."
trigger_phrases:
  - "hub doc pointers"
  - "phase 4 hub doc pointers"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 4: hub-doc-pointers

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-10-10 |
| **Branch** | `scaffold/004-hub-doc-pointers` |
| **Parent Spec** | ../spec.md |
| **Phase** | 4 of 5 |
| **Predecessor** | 003-drift-guard-warning-count |
| **Successor** | 005-claim-corrections |
| **Handoff Criteria** | No hub doc calls the shell hook shared or live, the stack detection row cites an existing file, and every edited doc keeps its validator count |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 4** of the Fix the confirmed P2 findings of the post-merge review specification.

**Scope Boundary**: Two playbook scenarios, the playbook root and `stack-detection.md` in the sk-code hub, plus the hub's six version carriers and one changelog.

**Dependencies**:
- Review findings 2 (R9-MNT-001) and 9 (R9-MNT-002) in `../review/review-report.md`
- `.skilled/skills/sk-code/sk-code-quality/SKILL.md` line 97, which names the `.sh` the legacy hook registered in no runtime

**Deliverables**:
- Accurate hook wording in TH-001, TH-002 and the playbook root
- A real file in the stack detection mixed-marker row
- Hub version 2.2.8.0, its changelog, a re-minted manifest and a Hermes copy

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`comment-hygiene-hook.md:11` and `check-dist-staleness-hook.md:11` call `sk-code-quality/scripts/hooks/claude-posttooluse.sh` "the shared Claude Code PostToolUse hook that fires on every Write/Edit", and the playbook root repeats it. The quality packet says that script is registered in no runtime, and `.claude/settings.json` runs `.skilled/hooks/post-edit-quality/claude/claude-posttooluse.cjs`. Separately, `stack-detection.md:145` cites `.skilled/skills/sk-doc/scripts/preview-server.js`, which does not exist.

### Purpose
The hub docs describe the shell hook as the legacy script it is and point at the live hook, and the stack detection table cites only real files.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Reword the description and overview of TH-001 and TH-002 and the playbook root bullet
- Replace the dead path in `stack-detection.md:145` with `.skilled/skills/sk-doc/scripts/frontmatter-version.mjs`
- Bump the sk-code hub to 2.2.8.0 across its six carriers, add `changelog/v2.2.8.0.md`, re-mint and refresh the Hermes copy

### Out of Scope
- The procedures of TH-001 and TH-002, which still test the `.sh` directly and stay valid
- Playbook prompts in RD-001, CS-003 and DR-003 that name a hypothetical `preview-server` file as part of a user request. They describe imagined work, not a file the docs claim exists
- The historical incident notes in the two scenarios, which record what happened at the time

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/sk-code/manual-testing-playbook/tooling-and-hooks/comment-hygiene-hook.md` | Modify | Legacy hook wording and live hook pointer |
| `.skilled/skills/sk-code/manual-testing-playbook/tooling-and-hooks/check-dist-staleness-hook.md` | Modify | Legacy hook wording and live hook pointer |
| `.skilled/skills/sk-code/manual-testing-playbook/manual-testing-playbook.md` | Modify | Legacy hook wording |
| `.skilled/skills/sk-code/shared/references/stack-detection.md` | Modify | Real file in the mixed-marker row |
| `.skilled/skills/sk-code/SKILL.md` | Modify | Version 2.2.8.0 |
| `.skilled/skills/sk-code/README.md` | Modify | Version 2.2.8.0 |
| `.skilled/skills/sk-code/ROUTER.md` | Modify | Version 2.2.8.0 |
| `.skilled/skills/sk-code/description.json` | Modify | Version 2.2.8.0 |
| `.skilled/skills/sk-code/hub-router.json` | Modify | Version 2.2.8.0 |
| `.skilled/skills/sk-code/mode-registry.json` | Modify | Version 2.2.8.0 |
| `.skilled/skills/sk-code/changelog/v2.2.8.0.md` | Create | Changelog entry |
| `.hermes/skills/sk-code/SKILL.md` | Modify | Regenerated Hermes copy |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | No hub doc calls the shell hook shared or live | `rg -n "shared Claude Code PostToolUse|shared PostToolUse|shared .claude-posttooluse"` over the two scenarios and the playbook root prints nothing |
| REQ-002 | The stack detection row cites a real file | `rg -n preview-server` on `stack-detection.md` prints nothing and `.skilled/skills/sk-doc/scripts/frontmatter-version.mjs` exists |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Validator counts hold | Both scenarios and `stack-detection.md` report `Total issues: 0`, and the playbook root keeps its 1 issue from before |
| REQ-004 | Hub version 2.2.8.0 | All six carriers read 2.2.8.0, the changelog validates with `Total issues: 0`, the route guard prints `sk-code fresh` and Hermes `--check` passes |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A reader of TH-001 or TH-002 learns which hook runs in a live session
- **SC-002**: Every path the stack detection table names exists
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | The hub bump leaves the compiled manifest stale | Low | The pre-commit route-remint gate re-mints sk-code, and the route guard is rerun after the commit |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. The scenarios keep testing the `.sh`, which is still kept for direct tests.
<!-- /ANCHOR:questions -->

---
