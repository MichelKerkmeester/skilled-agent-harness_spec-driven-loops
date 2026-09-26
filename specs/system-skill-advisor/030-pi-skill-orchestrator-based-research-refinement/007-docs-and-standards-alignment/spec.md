---
title: "Feature Specification: Docs and Standards Alignment for the Advisor Refinements"
description: "Phases 2 to 5 changed advisor hook, CLI, renderer and plugin behavior, but the feature catalog, the playbooks and the READMEs still describe the old behavior in about twenty places, and one added line breaks an sk-code P1 rule. This phase brings those documents up to date and fixes the code line, with MiMo v2.6 Pro at high effort doing the writing."
trigger_phrases:
  - "advisor docs alignment"
  - "advisor feature catalog update"
  - "sk-code alignment advisor refinements"
  - "pi prompt advisor catalog entry"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Docs and Standards Alignment for the Advisor Refinements

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-09-26 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 7 of 7 |
| **Predecessor** | 006-fanout-deep-review |
| **Successor** | None |
| **Handoff Criteria** | Every document in the scope table describes current behavior and passes its sk-doc validator, the code audit leaves no open P0 or P1, and the deferred P2 items carry a recorded reason |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 7** of the Pi skill orchestrator research for skill advisor refinement specification. It aligns the code phases 2 to 5 added with the sk-code standards and brings the documents that describe that code up to date.

**Scope Boundary**: The files in the scope table below. Files that phase 6 is reviewing wait until the review closes, so the reviewers read a stable tree: the Pi prompt advisor, `hooks/skill-advisor-hook.md` and `ARCHITECTURE.md`.

**Dependencies**:
- 006-fanout-deep-review, soft. Only the edits to files in its manifest wait for it.

**Deliverables**:
- Updated feature-catalog leaves, one new catalog leaf for the Pi prompt advisor, updated playbook scenarios and updated READMEs
- One code fix for the confirmed sk-code P1
- An audit record: comment hygiene, drift guards and the checklist audit, with each finding confirmed or refuted

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Phases 2 to 5 changed what an operator sees from the advisor: a no-brief turn now opens with a status line, the hook skips casual prompts before spawning the CLI, `advisor_recommend` takes `includeCompiledRoute`, the CLI retries once for a stale daemon, and each runtime labels its diagnostics. The documents that describe these surfaces still show the old behavior. One playbook scenario now tests nothing: it sends `hello`, which the new gate declines before the CLI call it exists to exercise, and it still expects a warm-only probe the hook no longer runs. The Pi prompt advisor gained a deadline but has no catalog entry at all.

### Purpose
Every document that describes a surface these phases changed says what the code does now, and the added code meets the sk-code checklists.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- sk-code audit of the phase 2 to 5 code: comment hygiene on every changed file, the sk-code drift guards, and a checklist audit of the added lines.
- The system-skill-advisor feature catalog, plus the two system-spec-kit catalog leaves that describe the advisor hook path.
- Playbook scenarios whose expected signals or inputs the changes invalidated.
- READMEs and code-folder READMEs that describe a changed surface or list the test files by name.
- The root README's Skill Advisor section.
- The deep-review `SKILL.md` completion rule that phase 5 made false for fan-out runs.

### Out of Scope
- Fixing phase 6 review findings. They are handled after the report.
- New playbook scenarios for the stale-daemon retry and the Pi deadline. Both need fault injection that the automated tests already perform.
- Pre-existing catalog debt unrelated to these changes, such as the baseline metrics table and the unauthored OpenCode hook row.
- Line-length P2 items. Each flagged line follows its file's established pattern, recorded in `implementation-summary.md`.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-skill-advisor/feature-catalog/hooks-and-plugin/claude-hook.md` | Modify | Shim budget and its ceiling, prompt gate, headed fallback, head-only repeats, runtime label, diagnostic fields |
| `.skilled/skills/system-skill-advisor/feature-catalog/hooks-and-plugin/opencode-plugin-bridge.md` | Modify | Plugin fallback mirror and transform dedup order |
| `.skilled/skills/system-skill-advisor/feature-catalog/hooks-and-plugin/pi-prompt-advisor.md` | Create | Pi prompt advisor entry: in-process call, deadline race, debug labels |
| `.skilled/skills/system-skill-advisor/feature-catalog/feature-catalog.md` | Modify | Root row and counts for the new leaf |
| `.skilled/skills/system-skill-advisor/feature-catalog/cli-surface/advisor-recommend.md` | Modify | `includeCompiledRoute` option and its test |
| `.skilled/skills/system-skill-advisor/feature-catalog/cli-surface/skill-advisor-cli.md` | Modify | Stale-daemon retry and its test |
| `.skilled/skills/system-spec-kit/feature-catalog/ux-hooks/directive-lifecycle-dedup.md` | Modify | Headed fallback repeats and plugin dedup order |
| `.skilled/skills/system-spec-kit/feature-catalog/tooling-and-scripts/cli-runtime-warm-only-fallbacks.md` | Modify | Gate before the CLI, the bounded cold start with its degraded fallback, and the outage head |
| `.skilled/skills/system-spec-kit/feature-catalog/feature-catalog.md` | Modify | The root entry for the CLI hook fallback leaf: its heading and description |
| `.skilled/skills/system-skill-advisor/manual-testing-playbook/cli-hooks-and-plugin/claude-user-prompt-submit.md` | Modify | No-brief turns show the headed fallback, not `{}` |
| `.skilled/skills/system-spec-kit/manual-testing-playbook/ux-hooks/cli-hook-transport-down-fail-open.md` | Modify | A work-intent prompt that reaches the CLI, and the outage head |
| `.skilled/skills/system-skill-advisor/README.md` | Modify | Six recommend options, headed fallback repeats, plugin dedup order |
| `.skilled/skills/system-skill-advisor/hooks/lib/README.md` | Modify | The hook payload sends `includeCompiledRoute: false` |
| `.skilled/skills/system-skill-advisor/hooks/pi/README.md` | Modify | Deadline race, debug labels, `pi` runtime label |
| `.skilled/skills/system-skill-advisor/runtime/README.md` | Modify | Stale-daemon retry in the CLI row |
| `.skilled/skills/system-skill-advisor/runtime/tests/README.md` | Modify | Two new root test files |
| `.skilled/skills/system-skill-advisor/runtime/tests/handlers/README.md` | Modify | One new handler test file |
| `.skilled/skills/system-spec-kit/runtime/hooks/claude/README.md` | Modify | The shim's child budget |
| `.skilled/skills/system-spec-kit/runtime/hooks/codex/README.md` | Modify | `SPECKIT_RUNTIME` and the test that now covers `shared.ts` |
| `.skilled/skills/system-spec-kit/runtime/hooks/cursor/README.md` | Modify | `SPECKIT_RUNTIME` |
| `.skilled/skills/system-spec-kit/runtime/hooks/devin/README.md` | Modify | `SPECKIT_RUNTIME` |
| `.opencode/plugins/README.md` | Modify | Dedup order, and fail-open now renders the headed fallback |
| `README.md` | Modify | Runtimes that reach the advisor, and what a no-brief turn shows |
| `.skilled/skills/system-deep-loop/deep-review/SKILL.md` | Modify | Root dashboard required only without lineage state logs |
| `.skilled/skills/system-skill-advisor/hooks/skill-advisor-hook.md` | Modify | Hook reference checked against the facts sheet after the review (T013) |
| `.skilled/skills/system-skill-advisor/ARCHITECTURE.md` | Modify | Architecture notes checked against the facts sheet after the review (T013) |
| `.skilled/skills/system-skill-advisor/hooks/pi/prompt-advisor.ts` | Modify | Named default budget with the hook's positive-integer parse (after the review) |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Every scoped document states current behavior | Each changed sentence names behavior the orchestrator confirmed in the cited code |
| REQ-002 | Every edited document passes its sk-doc check | `validate_document.py` passes on each edited catalog leaf and README, and `validate-playbook-package.cjs` passes on each edited playbook package |
| REQ-003 | No confirmed sk-code P0 or P1 remains in the phase 2 to 5 code | The Pi budget fix lands with a test, and comment hygiene and the drift guards stay clean |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | The transport-down playbook exercises the CLI path again | Its prompt passes the prompt gate, checked by running the gate on it |
| REQ-005 | The Pi prompt advisor has a catalog entry | The leaf exists, the root index links it, and the package validator passes |
| REQ-006 | Deferred audit items carry a reason | Each P2 left open is listed with the reason in `implementation-summary.md` |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A reader of any scoped document meets the behavior the code has now, with no step or expected signal the code no longer produces.
- **SC-002**: Running the edited playbook scenarios by hand produces the signals they list.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The phase 6 review | Three files cannot change until it closes | Those edits run last |
| Risk | A writer states behavior the code does not have | High | Each brief names the code lines, and the orchestrator checks each changed sentence against them |
| Risk | Edits to shared system-spec-kit docs collide with another session | Med | Only the named lines change, and the tree is checked for other edits to the same files before staging |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->

---
