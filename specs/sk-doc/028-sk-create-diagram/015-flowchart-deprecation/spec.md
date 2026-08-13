---
title: "Feature Specification: sk-create-flowchart full deprecation"
description: "Delete the superseded sk-create-flowchart skill outright and purge every live hub, router, advisor, and doc reference to it, now that sk-create-diagram fully covers its capability."
trigger_phrases:
  - "flowchart full deprecation"
  - "delete sk-create-flowchart"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/028-sk-create-diagram/015-flowchart-deprecation"
    last_updated_at: "2026-08-13T05:55:33.000Z"
    last_updated_by: "claude"
    recent_action: "Skill deleted; live hub/router/advisor/doc references purged or repointed"
    next_safe_action: "Run packet-wide validate.sh; report to operator"
    blockers: []
    key_files:
      - "spec.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-create-diagram-fork"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Deletion depth: delete the skill directory outright (not a de-indexed-but-present redirect stub) — operator chose this over the softer de-index-only option."
      - "Historical specs/ docs referencing sk-create-flowchart are intentionally left untouched — phase-parent convention treats them as append-only history, not live surface."
      - "The .opencode/bin/lib/compiled-routing/ generated artifacts are out of scope — a separate, complex compiled-routing program; flagged as a follow-up, not hand-edited."
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Feature Specification: sk-create-flowchart full deprecation

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-08-13 |
| **Branch** | `sk-doc/0145-sk-create-diagram` |
| **Parent Spec** | `../spec.md` |
| **Phase** | 15 of 15 |
| **Predecessor** | `../014-review-remediation/spec.md` |
| **Successor** | None — closes the packet's current phase set |
| **Handoff Criteria** | `sk-create-flowchart` deleted; 0 live references remain outside historical spec docs; advisor rebuilt and validated; `validate.sh --recursive --strict` clean |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## PHASE CONTEXT

**Scope Boundary**: Delete `sk-create-flowchart` entirely and purge/repoint every LIVE reference to it (skill, commands, hub JSONs, advisor index, live docs, test fixtures). Historical `specs/` docs from other, already-completed packets are explicitly out of scope — they are append-only history, not live surface.

**Dependencies**: Phase 012's flowchart-capability merge (already ported every ASCII/markdown resource into `sk-create-diagram`) and phase 014's remediation (already fixed the leaf-manifest and hub-JSON drift this phase builds on).

**Deliverables**: `sk-create-flowchart/` deleted; 8 command/prompt mirror files deleted across 4 runtimes; 9 live hub/router/advisor JSON and Python entries removed or repointed; ~20 live doc files (SKILL.md, README.md, feature-catalog, quick-reference, smart-routing, agent docs x3, post-edit-quality docs) corrected; 5 manual-testing-playbook scenario fixtures mechanically updated; advisor index rebuilt and validated.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Phase 012 merged `sk-create-flowchart`'s ASCII/markdown capability into `sk-create-diagram` and left the source skill as a redirect stub, matching the "redirect, not delete" decision recorded at the time. With `sk-create-diagram` now complete, reviewed, and twice shipped to the release branch, the redirect stub is a permanent stale surface: a dead `workflowMode`, a dead command, and dozens of live doc/routing references still describing a skill that no longer does independent work.

### Purpose

Delete `sk-create-flowchart` outright and purge every live reference to it, so the only path to ASCII/markdown flowcharts is `sk-create-diagram --output-format ascii-markdown` — one skill, one advisor identity, no dead redirect.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Delete `.opencode/skills/sk-doc/sk-create-flowchart/` (17 files) outright.
- Delete every command/prompt mirror: `.opencode/commands/create/flowchart.md` + 3 asset files, `.codex/prompts/create-flowchart.md`, `.pi/prompts/create-flowchart.md`, `.cursor/commands/create-flowchart.md`.
- Remove the `sk-create-flowchart` entry from `command-metadata.json`, `mode-registry.json`, `hub-router.json` (tie-break list, skill-mapping block, and the now-redundant `create-flowchart-aliases` class), `leaf-manifest.json`, and the `command-create-flowchart` block in `skill_advisor.py` (adding the missing `sk-create-diagram` counterpart where one had never existed).
- Repoint the `sk-doc/scripts/` facade symlink for `validate-flowchart.sh` from the deleted skill to `sk-create-diagram/scripts/validate-flowchart.sh`.
- Repoint `post-edit-router.cjs`'s `flowchart` checker path and its `isFlowchartCandidate()` path-segment match (from `create-flowchart/assets/` to `sk-create-diagram/ascii-patterns/`, since `sk-create-diagram/assets/` now also holds non-flowchart content).
- Fix every live doc surface: `sk-doc/SKILL.md`, `sk-doc/README.md`, `sk-doc/description.json`, `sk-doc/graph-metadata.json`, `sk-doc/feature-catalog/feature-catalog.md`, `sk-doc/shared/references/{quick-reference,smart-routing}.md`, `sk-create-quality-control/references/workflows.md`, 3 cross-runtime `agents/markdown.md` mirrors, `.opencode/commands/{README.txt,create/README.txt}`, `sk-code/manual-testing-playbook/plugins-and-hooks/post-edit-quality-router.md`, `packet-authored-registry-routing.md`, and `sk-create-diagram/README.md`'s own self-contradictory "that's sk-create-flowchart's scope" lines.
- Mechanically update 5 manual-testing-playbook scenario fixtures (3 general + 2 holdout) that assert `expected_workflow_mode: sk-create-flowchart`.
- Remove the 3 stale `sk-create-flowchart` entries from 2 baseline test-fixture JSONs (`durable-directory-manifest.json`, `baseline-readme-verdicts.json`).
- Regenerate `command-bridges.generated.json` via its own script; rebuild and validate the skill advisor index.

### Out of Scope

- Rewriting historical `specs/` docs from other, already-completed packets (026, 016, 014, 019) that mention `sk-create-flowchart` — append-only history, not live surface.
- Fixing the `.opencode/bin/lib/compiled-routing/` generated artifacts — a separate, complex compiled-routing program; flagged as a follow-up.
- Fully re-syncing `durable-directory-manifest.json`'s 284-entry pre-existing drift (unrelated to this deletion, dominated by `cli-external-orchestration` benchmark reports) or generating fresh `sk-create-diagram` verdicts for `baseline-readme-verdicts.json` — both are separate, larger bodies of work.
- Fixing the repo-wide `.opencode/changelog/sk-doc/*` symlink prefix bug (every packet's global changelog symlink is missing its `sk-` prefix, not just flowchart's) — a systemic, pre-existing bug; only the dead flowchart entry itself was removed.

### Aggregate File Scope

| File Path | Change Type | Description |
|-----------|-------------|--------------|
| `.opencode/skills/sk-doc/sk-create-flowchart/` | Delete | Entire skill directory (17 files) |
| `.opencode/commands/create/flowchart.md`, `assets/create-flowchart-{auto,confirm}.yaml`, `assets/create-flowchart-presentation.txt` | Delete | Command + assets |
| `.codex/prompts/create-flowchart.md`, `.pi/prompts/create-flowchart.md`, `.cursor/commands/create-flowchart.md` | Delete | Cross-runtime prompt mirrors |
| `.opencode/changelog/sk-doc/create-flowchart` | Delete | Pre-existing broken symlink (wrong target prefix, unrelated bug) |
| `.opencode/skills/sk-doc/{command-metadata,mode-registry,hub-router,leaf-manifest,description,graph-metadata}.json` | Edit | Dead entries removed; `sk-create-diagram` gaps filled where found |
| `.opencode/skills/system-skill-advisor/mcp-server/scripts/skill_advisor.py` | Edit | `command-create-flowchart` removed, `command-create-diagram` added |
| `.opencode/skills/system-skill-advisor/mcp-server/scripts/command-bridges/command-bridges.generated.json`, `mcp-server/lib/scorer/projection.ts` | Regenerate | Via `derive-command-bridges.cjs` |
| `.opencode/hooks/post-edit-quality/lib/post-edit-router.cjs` | Edit | Checker path + candidate-match logic repointed |
| `.opencode/skills/sk-doc/scripts/validate-flowchart.sh` | Repoint | Facade symlink now targets `sk-create-diagram/scripts/` |
| `.opencode/skills/sk-doc/{SKILL.md,README.md,feature-catalog/feature-catalog.md,shared/references/quick-reference.md,shared/references/smart-routing.md,sk-create-quality-control/references/workflows.md}` | Edit | Dead references removed/repointed; `sk-create-diagram` gaps filled |
| `.opencode/skills/sk-doc/sk-create-diagram/README.md` | Edit | Self-contradictory "that's sk-create-flowchart's scope" lines corrected |
| `.opencode/{agents,commands}/**`, `.claude/agents/markdown.md`, `.pi/agents/markdown.md` | Edit | Cross-runtime doc mirrors corrected |
| `.opencode/skills/sk-code/manual-testing-playbook/plugins-and-hooks/post-edit-quality-router.md`, `.opencode/skills/sk-doc/feature-catalog/packet-authored-registry-routing/packet-authored-registry-routing.md` | Edit | Live checker-path and workflowMode-list citations fixed |
| `.opencode/skills/sk-doc/manual-testing-playbook/{token-cost-baseline/max-load.md,resource-loading/assets-only.md,unknown-fallback/ambiguous-multi-intent.md,holdout/flowchart-natural.md,holdout/ind-flowchart.md}` | Edit | `sk-create-flowchart` → `sk-create-diagram` mechanical substitution |
| `.opencode/skills/sk-doc/scripts/tests/code-folder/{durable-directory-manifest.json,baseline-readme-verdicts.json}` | Edit | 3 stale entries removed each |
| `015-flowchart-deprecation/` | Create | This phase's spec-folder history |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `sk-create-flowchart` no longer exists on disk. | `find .opencode/skills/sk-doc/sk-create-flowchart` returns nothing. |
| REQ-002 | No live routing surface (hub JSON, advisor, command) references the deleted skill. | `sk-create-flowchart` and `/create:flowchart` absent from every JSON/YAML/command file. |
| REQ-003 | Every symlink and code path that pointed at the deleted skill's scripts is repointed, not left dangling. | `sk-doc/scripts/validate-flowchart.sh` resolves; `post-edit-router.cjs`'s checker path resolves. |
| REQ-004 | The skill advisor index rebuilds and validates clean for `sk-doc` with no new regressions. | `advisor_rebuild` succeeds; `advisor_validate` shows `explicit_skill_top1_regression.passed: true`. |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Manual-testing-playbook scenario fixtures that assert a `sk-create-flowchart` workflow mode are updated to `sk-create-diagram`, not left silently stale. | 5 fixtures mechanically substituted; no `sk-create-flowchart` string remains in any of them. |
| REQ-006 | Historical spec-folder docs are not rewritten. | `specs/` references outside `sk-doc/028-sk-create-diagram/015-flowchart-deprecation` are untouched. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `sk-create-flowchart` fully deleted, 0 live references remain outside historical spec docs (verified by repo-wide grep).
- **SC-002**: `advisor_rebuild` + `advisor_validate` clean, no regression in `sk-doc`'s routing accuracy.
- **SC-003**: Packet-wide `validate.sh --recursive --strict` clean (parent's pre-existing warning aside).
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Deleting a skill referenced by a hardcoded checker path could silently break the post-edit-quality router for every future edit to an ASCII flowchart asset. | High (realized) | Found and repointed both the facade symlink and the router's own hardcoded path + segment-match logic before deletion, not after. |
| Risk | Manual-testing-playbook scenario fixtures with `expected_workflow_mode: sk-create-flowchart` could fail an automated routing-gold gate once the mode no longer exists. | Medium (realized) | Mechanically updated all 5 affected fixtures to the new mode name and resource paths. |
| Dependency | Phase 012's already-ported `sk-create-diagram/assets/ascii-patterns/` and `references/ascii-format/` content | High | Every repointed reference targets real, already-shipped files — confirmed present before editing. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None — the two judgment calls (deletion depth, phase placement) were both put to the operator via `AskUserQuestion` and answered before work began.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- Plan: `plan.md`
- Tasks: `tasks.md`
- Checklist: `checklist.md`
- Packet root: `../spec.md`
- Predecessor: `../014-review-remediation/spec.md`
- Superseding merge: `../012-flowchart-capability-merge/spec.md`
