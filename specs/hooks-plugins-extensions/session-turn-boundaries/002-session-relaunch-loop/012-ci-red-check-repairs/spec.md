---
title: "Feature Specification: Phase 12: ci-red-check-repairs"
description: "Three CI checks failed on main before this phase: Rule Canary Sync reports AGENTS.md past the 16384-byte delivery prefix, sk-doc Script Tests flags the SESSION_RELAUNCH_REPO_ROOT example line, and Spec-Kit Check reports two failing test files in its CLI vitest project. The causes are the phase 007 exemption commit b3655ed3de, the switch-form example line from commit d001d69fee and the playbook provenance and wording from commit b830fd0276."
trigger_phrases:
  - "ci red check repairs"
  - "phase 8 ci red check repairs"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 12: ci-red-check-repairs

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-19 |
| **Branch** | `scaffold/012-ci-red-check-repairs` |
| **Parent Spec** | ../spec.md |
| **Phase** | 12 of 12 |
| **Predecessor** | 007-handoff-gate-exemptions |
| **Successor** | None |
| **Handoff Criteria** | Rule Canary Sync, sk-doc Script Tests and Spec-Kit Check all pass, with before and after evidence under scratch/. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 12** of the Repair the three CI checks the relaunch work turned red specification.

**Scope Boundary**: The repairs touch only the repository AGENTS.md, .skilled/hooks/hook-flags.env.example and the two session-relaunch playbook files under .skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/. The ~/.claude/CLAUDE.md mirror is not edited.

**Dependencies**:
- Commit b3655ed3de (phase 007 handoff gate exemptions) added the .skilled/skills/.state/ exemption that moved the AGENTS.md section end from byte 16377 to 16626.
- Commit d001d69fee added the SESSION_RELAUNCH_REPO_ROOT line to hook-flags.env.example in switch form, though the file is never read and the value must be exported in the shell.
- Commit b830fd0276 (self-relaunching session loop) wrote two playbook provenance lines as `Provenance: <path>.` with backticks and a trailing period, and wrote "the Hermes sync manifest" in session-relaunch-command-runtimes.md, where manifest is a word the invariance test bans on public surfaces. It reached main through 585c90f5f7 and 47371b495f.

**Deliverables**:
- AGENTS.md wording tightened with no rule removed or weakened, section end back inside the 16384-byte delivery prefix.
- The hook-flags.env.example SESSION_RELAUNCH_REPO_ROOT line rewritten as the export its heading describes.
- The two session-relaunch playbook files carrying the Provenance form the provenance test accepts and no word the invariance test bans.
- Before and after evidence for all three CI checks recorded under scratch/.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Three CI checks failed on main before this phase. Rule Canary Sync reported that AGENTS.md "#### Blast-Radius Management" ends at byte 16626, past the 16384-byte delivery prefix Devin delivers, because commit b3655ed3de added the .skilled/skills/.state/ runtime-state exemption to Gates 2 and 3. sk-doc Script Tests reports SESSION_RELAUNCH_REPO_ROOT because commit d001d69fee added that flag to hook-flags.env.example in switch-line form, and the validation-switch test reads every `# NAME=value` line as a switch that must take effect once uncommented. Spec-Kit Check has failed on main since 47371b495f and last passed at 33d619a538, and on cd7f160e02 its CLI vitest project reported 2 failed, 178 passed and 3 skipped test files. The cause is commit b830fd0276, which wrote two playbook provenance lines as `Provenance: <path>.` with backticks and a trailing period, a form the provenance test does not accept, and wrote "the Hermes sync manifest" in session-relaunch-command-runtimes.md, where manifest is a word the invariance test bans on public surfaces. It reached main through 585c90f5f7 and 47371b495f.

### Purpose
The three checks that main turned red pass again locally, with no rule removed or weakened and the delivery-prefix margin restored. On main, Rule Canary Sync and sk-doc Script Tests passed on e38ff13143 and cd7f160e02, while Spec-Kit Check had been red on main since 47371b495f; its fix passes locally (scratch/after/spec-kit-check-vitest.txt, scratch/after/spec-kit-cli-project-summary.txt).
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Tighten AGENTS.md wording so Blast-Radius Management ends inside the 16384-byte delivery prefix.
- Rewrite the SESSION_RELAUNCH_REPO_ROOT line in .skilled/hooks/hook-flags.env.example as the export its heading describes.
- Bring the two session-relaunch playbook files under .skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/ to the provenance form the provenance test accepts and wording the invariance test accepts.
- Record before and after evidence for all three CI checks under scratch/.

### Out of Scope
- ~/.claude/CLAUDE.md - it mirrors AGENTS.md outside the repository, is not edited here, and now differs from AGENTS.md by the 11 tightenings.
- Other rule copies - the canary checks only the repository's AGENTS.md for the delivery prefix, so no further copy is measured.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| AGENTS.md | Modify | 11 wording tightenings, no rule removed or weakened; section end moves from byte 16626 to 16323 and the file from 27505 to 27202 bytes |
| .skilled/hooks/hook-flags.env.example | Modify | The SESSION_RELAUNCH_REPO_ROOT line becomes the export its heading describes instead of a switch line |
| .skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/session-relaunch-command-runtimes.md | Modify | The Provenance line becomes the bare form and the Hermes sentence names .hermes/SYNC.md instead of the sync manifest |
| .skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/session-relaunch-pi-opencode.md | Modify | The Provenance line becomes the bare form the provenance test accepts |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Tighten AGENTS.md wording so Blast-Radius Management ends inside the 16384-byte delivery prefix, with no rule removed or weakened | Rule canary check-rule-copies.js exits 0; scratch/after/canary.txt shows the section end at byte 16323 with a 61-byte margin |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | Write the SESSION_RELAUNCH_REPO_ROOT line in hook-flags.env.example as the export its heading describes | test_validation_switch.py no longer reports it; scratch/after/validation-switch.txt shows 8 passed |
| REQ-003 | Bring the two session-relaunch playbook files to the provenance form the provenance test accepts and wording the invariance test accepts | The playbook provenance and workflow invariance tests pass; scratch/after/spec-kit-check-vitest.txt shows 5 of 5 tests with exit 0 |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: check-rule-copies.js exits 0 with the AGENTS.md section end at byte 16323, a 61-byte margin inside the 16384-byte delivery prefix.
- **SC-002**: test_validation_switch.py passes with 8 tests, and the full sk-doc script suite (run-script-tests.sh) passes (scratch/after/sk-doc-script-tests.txt).
- **SC-003**: The Spec-Kit Check vitest tests pass 5 of 5 with exit 0 (scratch/after/spec-kit-check-vitest.txt), and the whole CLI vitest project passes 180 files with 3 skipped, 2059 tests passed and 20 skipped, exit 0 (scratch/after/spec-kit-cli-project-summary.txt).
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 007 handoff gate exemptions, commit b3655ed3de | Its .skilled/skills/.state/ exemption keeps the AGENTS.md section end at byte 16626, so Rule Canary Sync stays red on main | Tighten wording without removing or weakening any rule until the end sits inside the prefix |
| Risk | A tightening weakens or removes a load-bearing rule | Med | Restate-only edits: ten rewordings keep each rule in fewer words, and Gate 2 refers to the gitignored runtime state Gate 3 exempts |
| Dependency | The self-relaunch loop commit b830fd0276 | Its playbook provenance form and its "Hermes sync manifest" wording keep Spec-Kit Check red on main | Rewrite the provenance lines bare and name .hermes/SYNC.md, which documents both steps at line 41. Neither test changes |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. All three repairs are fixed and verified by the evidence in scratch/after.
<!-- /ANCHOR:questions -->

---


