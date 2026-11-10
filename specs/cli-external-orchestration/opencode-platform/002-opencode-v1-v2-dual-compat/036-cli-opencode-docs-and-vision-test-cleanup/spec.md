---
title: "Feature Specification: Phase 36: cli-opencode-docs-and-vision-test-cleanup"
description: "Closes the follow-ups left by phases 027 and 028. The cli-opencode pre-flight check strips shell comments by text rather than by quote state, the OpenCode 2 listing notes tell a reader to check `opencode2 models --standalone` without naming the `<provider>/` prefix to look for, and prose is not scanned for unquoted listing commands. The sk-vision kill-switch tests leave a temp directory per case, and the plugin playbook snippets still call each plugin's default export as a function, which fails since the dual export."
trigger_phrases:
  - "cli opencode docs and vision test cleanup"
  - "phase 36 cli opencode docs and vision test cleanup"
  - "confirm the provider prefix"
  - "plugin playbook snippet default server"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 36: cli-opencode-docs-and-vision-test-cleanup

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-10-20 |
| **Branch** | `worktrees/178-cli-opencode-docs-and-vision-test-cleanup` |
| **Parent Spec** | ../spec.md |
| **Phase** | 36 of 36 |
| **Predecessor** | 035-v2-bridge-plugin-effects |
| **Successor** | None |
| **Handoff Criteria** | Every follow-up below is fixed or recorded with a reason, the touched suites are at or above baseline, and CI passes at the pushed commit |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 36** of the OpenCode v1 and v2 dual compatibility specification. It closes the recorded follow-ups of phase 027 (OpenCode 2 provider listing) and phase 028 (plugin kill-switch coverage).

**Scope Boundary**: The cli-opencode doc test `opencode2-models-form.test.cjs`, the cli-opencode and cli-devin notes that point a reader at `opencode2 models --standalone`, the sk-vision `tests/plugin.test.ts` kill-switch block, and the plugin playbook snippets that load a plugin in-process. Plugin code, the battery and CI workflows stay as they are.

**Dependencies**:
- `../027-opencode2-models-provider-check/`, which added the pre-flight blocks and the doc test.
- `../028-plugin-kill-switch-coverage/`, which added the sk-vision kill-switch tests and the speckit-completion playbook step.
- `../002-pins-imports-dual-export/`, which made every plugin default-export `{ id, setup, server }`.

**Deliverables**:
- A quote-aware comment stripper and a listing-source check in the pre-flight test, plus prose and prefix guards.
- Listing notes that name the `<provider>/` prefix.
- Kill-switch tests that create no directory.
- Playbook snippets that call `default.server(...)`.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Phase 027 left three gaps. The pre-flight test drops a trailing comment at the first ` #` after a line's last quote, so a quoted `#` can hide a fake check from it. About 39 notes tell an OpenCode 2 reader to check or confirm `opencode2 models --standalone` without naming the `<provider>/` prefix to look for. Prose outside code spans is never scanned, so an unquoted listing command would carry no guard. Phase 028 left two more. Each sk-vision kill-switch case creates a temp directory for its absent switch file and never removes it: 7 per run. And the speckit-completion playbook calls `mod.default({ directory })`, which throws `mod.default is not a function` because every plugin now default-exports `{ id, setup, server }`. Six other plugin playbooks carry the same call.

### Purpose
Each of these follow-ups is fixed and guarded by a test or a rerun, or recorded with a reason.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Strip shell comments in the pre-flight test by quote state, and check that each prefix grep reads the standalone listing.
- Name the `<provider>/` prefix in every note that sends a reader to `opencode2 models --standalone`, and guard that with a test.
- Fail the doc test on an unquoted `opencode models` or `opencode2 models` command in prose.
- Point the sk-vision kill-switch tests at a switch-file path that is never created.
- Change the in-process plugin snippets in seven playbooks to call `default.server(...)`.

### Out of Scope
- The other sk-vision test temp directories (`sk-vision-host-`, `sk-vision-client-` and the `temporaryDirectory()` helper) - not a recorded follow-up; recorded in the implementation summary.
- The `.skilled/plugins/` path in those playbooks - it is a symlink to `.opencode/plugins/` and resolves; the snippets failed on the call form, not the path.
- Plugin source, the battery and the CI workflows.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/cli-external-orchestration/cli-opencode/scripts/tests/opencode2-models-form.test.cjs` | Modify | Quote-aware comment stripper, listing-source check, prose guard, prefix-note guard |
| `.skilled/skills/cli-external-orchestration/cli-opencode/**/*.md`, `.skilled/skills/cli-external-orchestration/cli-devin/references/providers-and-models.md` | Modify | Listing notes name the `<provider>/` prefix |
| `.skilled/skills/sk-vision/vision-runtime/tests/plugin.test.ts` | Modify | The kill-switch block creates no directory |
| Seven plugin playbooks under `.skilled/skills/*/manual-testing-playbook/plugins-and-hooks/` and `cli-opencode/manual-testing-playbook/git-preflight-advisory/` | Modify | In-process snippets call `default.server(...)` |
| This folder and `../spec.md` | Create / Modify | This packet, the phase map row |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The pre-flight test strips comments by quote state and checks that each prefix grep reads the standalone listing. | A line that hides a fake `grep '^opencode-go/' ... && OPENCODE_GO_OK=1` behind a quoted `#` fails the test, and so does a grep that reads anything other than the `opencode2 models --standalone` output; the real block passes. |
| REQ-002 | Every in-process plugin snippet in the playbooks runs. | Each changed snippet runs from the worktree root and prints its expected signal; the speckit-completion step 6 prints an empty hooks object with the switch set. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | A note that sends a reader to `opencode2 models --standalone` names the prefix to look for. | A test fails on a note that names neither a `<provider>/` id prefix nor the word prefix; every current note passes. |
| REQ-004 | Prose carries no unquoted listing command. | A test fails on an `opencode models` or `opencode2 models` command outside code spans and fenced blocks. |
| REQ-005 | The sk-vision kill-switch tests leave no directory behind. | A `bun test tests` run adds no `sk-vision-flags-*` entry under the temp directory, and the suite is at or above its baseline of 80. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The cli-opencode script tests pass above their baseline of 13, and each new guard fails on a mutant.
- **SC-002**: CI passes at the pushed commit.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | The prose guard flags the words "OpenCode models" in an ordinary sentence | Low | The guard matches the lowercase command form followed by a provider id or a flag, not the capitalised product name |
| Risk | The prefix guard is a wording check | Low | It reads only sentences that send a reader to the standalone listing, and review covers the rest |
| Dependency | The dual export `{ id, setup, server }` from `lib/v2-bridge.js` | Med | `server(ctx)` is the OpenCode 1 entry and returns the same hooks object the old default function did |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->

---
