---
title: "Feature Specification: Phase 12: playbook-docs-and-closeout"
description: "Phases 004 to 011 build cli-mistral-vibe, but no playbook exercises it, no cross-runtime doc or feature catalog names it, and the parent packet has not passed recursive strict validation. This phase writes the playbook and the docs, reconciles completion state and closes the parent."
trigger_phrases:
  - "playbook docs and closeout"
  - "phase 12 playbook docs and closeout"
  - "cli-mistral-vibe manual testing playbook"
  - "mistral vibe closeout"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 12: playbook-docs-and-closeout

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-11-14 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 12 of 12 |
| **Predecessor** | 011-vibe-context-and-goal-hooks |
| **Successor** | None |
| **Handoff Criteria** | `validate.sh --strict --recursive` on the parent prints `RESULT: PASSED` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 12** of the Mistral Vibe runtime mode build specification.

**Scope Boundary**: The manual testing playbook, the cross-runtime docs, the feature catalog and the parent closeout. No new runtime behavior.

**Dependencies**:
- Phase 010 (`010-hub-registration-and-routing`), so the docs describe a mode the hub routes.
- Phase 011 (`011-vibe-context-and-goal-hooks`), so the playbook can exercise the goal and context hook.

**Deliverables**:
- `.skilled/skills/cli-external-orchestration/cli-mistral-vibe/manual-testing-playbook/` with a recorded result per scenario, linked from `.vibe/manual-testing-playbook`.
- A feature catalog entry, cross-runtime doc rows and a parent that passes recursive strict validation.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
No playbook exercises the mode end to end, so nothing records whether the built pieces work together on a real dispatch. The cross-runtime docs, the root README, `AGENTS.md` and the feature catalog name seven runtimes and no `.vibe/` surface, so a reader cannot find the eighth.

### Purpose
The mode has a playbook with a recorded result per scenario, every runtime list names it, and the parent closes with recursive strict validation passing.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ H=.skilled/skills/cli-external-orchestration
$ ls $H/cli-mistral-vibe/manual-testing-playbook; echo "exit=$?"
ls: .skilled/skills/cli-external-orchestration/cli-mistral-vibe/manual-testing-playbook: No such file or directory
exit=1
$ rg -c 'cli-mistral-vibe|\.vibe/' .skilled/CROSS-CLI.md $H/feature-catalog/feature-catalog.md README.md AGENTS.md; echo "exit=$?"
exit=1
$ rg -o 'one of seven CLI-executor workflow packets' $H/feature-catalog/feature-catalog.md; echo "exit=$?"
one of seven CLI-executor workflow packets
exit=0
$ rg -c 'MISTRAL_API_KEY' .env.example .skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md; echo "exit=$?"
exit=1
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Author the `cli-mistral-vibe` manual testing playbook, link it from `.vibe/manual-testing-playbook` and record a result per scenario.
- Add the feature catalog entry and index row, and change the catalog's runtime count and lists to eight.
- Add `.vibe/` and the eighth runtime to `.skilled/CROSS-CLI.md`, `AGENTS.md`, the root `README.md`, `.skilled/skills/README.txt`, the sibling `cli-*/README.md` mode tables, and the `MISTRAL_API_KEY` and `VIBE_HOME` names to `ENV-REFERENCE.md` and `.env.example`.
- Regenerate the derived manifests and the trigger index.
- Reconcile completion metadata in the parent and every child, then run recursive strict validation on the parent.

### Out of Scope
- New runtime behavior - phases 004 to 011 own it.
- Playbook scenarios for the ACP supervisor - deferred until print mode is proven.
- Playbook scenarios for session relaunch - deferred, because Vibe has no idle or compaction event.
- Playbook scenarios for turn-stopping guards - deferred, because `post_agent` cannot be strict.
- Playbook scenarios for sandbox mode - deferred, because Vibe has no sandbox field.
- Rewriting historical changelog entries that say "seven" - they record past releases.
- Key values in `.env.example` - only variable names are allowed.
- Any change to default models - DevPass stays the default.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/cli-external-orchestration/cli-mistral-vibe/manual-testing-playbook/` | Create | Playbook index, scenario files and results |
| `.vibe/manual-testing-playbook` | Create | Link to the packet playbook, following `.dsh/manual-testing-playbook` |
| `.skilled/skills/cli-external-orchestration/feature-catalog/mistral-vibe-dispatch-mode/mistral-vibe-dispatch-mode.md` | Create | Catalog entry |
| `.skilled/skills/cli-external-orchestration/feature-catalog/feature-catalog.md` and the runtime-list entries | Modify | Index row, count of eight and runtime lists |
| `.skilled/skills/cli-external-orchestration/cli-*/README.md` | Modify | Sibling mode tables |
| `.skilled/skills/cli-external-orchestration/cli-mistral-vibe/changelog/` | Create | Packet changelog entry |
| `.skilled/CROSS-CLI.md` | Modify | `.vibe/` row, generator rows and the SYNC contract line |
| `AGENTS.md`, `README.md`, `.skilled/skills/README.txt` | Modify | Eighth runtime and `.vibe/agents/` |
| `.skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md`, `.env.example` | Modify | Variable names only |
| `.skilled/commands/doctor/assets/agents-md-manifest.json` | Regenerate | Manifest from `AGENTS.md` |
| `.skilled/skills/sk-doc/scripts/tests/code-folder/durable-directory-manifest.json`, `baseline-readme-verdicts.json` | Modify | Packet directories and README verdicts |
| `.skilled/skills/system-spec-kit/runtime/data/trigger-index.json` | Regenerate | Rebuilt trigger index |
| Parent `spec.md` and each child's completion metadata | Modify | Reconciled completion state |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The parent closes | `validate.sh <parent> --strict --recursive --quiet` prints `RESULT: PASSED` for the parent and every child |
| REQ-002 | Every playbook scenario has a recorded result | Each scenario file carries a result line with a date and evidence, and none reads pending |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Every runtime list names the mode | `rg -L 'cli-mistral-vibe'` over the edited docs prints nothing |
| REQ-004 | Derived files match their sources | The agents-md manifest, the code-folder manifests and the trigger index regenerate with no further diff |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Recursive strict validation on the parent prints `RESULT: PASSED`.
- **SC-002**: `rg -c 'one of seven' .skilled/skills/cli-external-orchestration/feature-catalog/feature-catalog.md` prints nothing, and the catalog names eight runtimes.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phases 010 and 011 complete, and `MISTRAL_API_KEY` for keyed scenarios | High: keyed scenarios cannot record a result without both | Setup confirms both handoffs and the key before any scenario runs |
| Risk | Another session edits `cli-opencode` files and `.skilled/CROSS-CLI.md`, so the doc edits could conflict | Med | Edit those files after that session lands, and read `git status` for them first |
| Risk | Recursive validation fails on a child closed earlier | Med | Run each child's strict validation first and fix it in its own folder |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Which scenario categories the playbook needs beyond the built phases depends on what phases 004 to 011 actually ship. UNKNOWN until they close.
<!-- /ANCHOR:questions -->

---
