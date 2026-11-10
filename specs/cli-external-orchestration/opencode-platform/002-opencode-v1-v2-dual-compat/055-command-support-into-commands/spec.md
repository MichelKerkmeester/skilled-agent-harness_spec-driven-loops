---
title: "Feature Specification: Phase 55: command-support-into-commands"
description: "Phase 004 moved the 12 non-command markdown files out of .skilled/commands/ into .skilled/command-support/ so neither OpenCode version would register them, which put supporting assets outside the tree the operator reads commands from. The operator chose on 2026-10-22 to keep everything inside .skilled/commands/ and rename the non-command files to .markdown, a suffix both OpenCode 1.19.3 and 2.0.32 ignore. This phase moves the 12 files back, updates every consumer and re-proves that both versions list the same commands as before."
trigger_phrases:
  - "command support into commands"
  - "phase 55 command support into commands"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 55: command-support-into-commands

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-22 |
| **Branch** | `worktrees/200-command-support-into-commands` |
| **Parent Spec** | ../spec.md |
| **Phase** | 55 of 55 |
| **Predecessor** | 054-v4-0-0-13-changelog-opencode |
| **Successor** | None |
| **Handoff Criteria** | The operator chose on 2026-10-22 to keep everything inside `.skilled/commands/` with `.markdown` names, and both versions list the same commands before and after (`055/scratch/commands-*.json`) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 55** of the OpenCode v1 and v2 dual compatibility packet. It reverses the destination that phase 004 chose, without reopening the problem phase 004 solved.

**Scope Boundary**: the 12 non-command markdown files, the consumers that name their paths or file names, the three checks that had to learn the new suffix, and the live and tracked proof that neither version registers the moved files as commands. No command, agent, config, plugin or hook keeps a different behaviour, because the change touches only files that are not commands.

**Dependencies**:
- `../004-agents-commands-config/`, whose decision 1 chose `.skilled/command-support/` as the destination this phase supersedes, and which supplies the 12-file move map the reverse move follows.
- `../005-version-aware-guards/`, which owns the version-aware checks this phase leaves alone.
- Both installed OpenCode versions, 1.19.3 and 2.0.32, for the before and after command lists.

**Deliverables**:
- The 12 files under `.skilled/commands/<sub>/`, every one of them carrying a `.markdown` name, and `.skilled/command-support/` removed.
- The updated consumers and tooling: the deep-loop contract scripts and manifest, the gate-3 parity test, `.gitignore`, the sk-create-command contract, the six moved READMEs, the sk-code-skilled checklist, the two sk-doc fixtures and the deep-loop census row.
- `scratch/commands-before.json`, `scratch/commands-after.json`, `scratch/suites-before.txt` and `scratch/suites-after.txt`.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Phase 004 solved a real problem: both OpenCode versions scan `{command,commands}/**/*.md` and registered all 12 non-command markdown files as commands. It solved it by moving them to `.skilled/command-support/`, which put supporting assets, contract bodies and script READMEs outside the tree the operator reads commands from. The operator wants everything inside `.skilled/commands/`.

### Purpose
Keep the 12 files where the operator wants them, under `.skilled/commands/`, and stop both versions registering them by name alone: a `.markdown` suffix, which neither version scans.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The 12 non-command markdown files and their return to `.skilled/commands/<sub>/` under `.markdown` names.
- Every consumer that names one of those paths or file names, plus the three checks that had to recognise the new suffix.
- The live command lists on both versions before and after, and the tracked suites that cover the touched files.

### Out of Scope
- The scanner behaviour itself - the phase records what both versions scan and works with it rather than asking upstream for an ignore file or a frontmatter opt-out, neither of which exists.
- The prompt-mirror walkers (`sync-prompts*.cjs`, `sync-runtime-mirrors.cjs`, `validate-command-references.cjs`) - they already read only `*.md`, so the rename does not reach them.
- The trigger index - `.skilled/commands` is not in its corpus.
- Comment hygiene - it checks code comments only.
- Any change to a real command, agent, config, plugin or hook.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/commands/deep/assets/compiled/` | Move and rename | `README`, `deep-ai-council.contract`, `deep-research.contract` and `deep-review.contract` arrive as `.markdown` |
| `.skilled/commands/deep/assets/legacy/` | Move and rename | `README`, `deep-ai-council.body`, `deep-research.body` and `deep-review.body` arrive as `.markdown` |
| `.skilled/commands/doctor/scripts/`, `doctor/scripts/tests/`, `scripts/`, `scripts/fixtures/` | Move and rename | The four remaining `README` files arrive as `README.markdown` |
| `.skilled/command-support/` | Delete | The old tree is gone, and nothing pointed at it |
| `.skilled/skills/system-deep-loop/runtime/scripts/render-command-contract.cjs` | Modify | The manifest path and the six body and contract paths |
| `.skilled/skills/system-deep-loop/runtime/scripts/compile-command-contracts.cjs` | Modify | `outputPathFor` writes `.markdown` |
| `.skilled/skills/system-deep-loop/runtime/lib/legacy-projections/legacy-projection-manifest.ts` | Modify | The projection paths |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/compile-command-contracts.vitest.ts` | Modify | The expected output names |
| `.skilled/skills/system-spec-kit/runtime/tests/hooks/gate-3-menu-parity.test.mjs` | Modify | The parity fixture paths |
| `.gitignore` | Modify | The manifest.jsonl ignore follows its folder |
| `.skilled/skills/sk-doc/sk-create-command/assets/command-contract.json` | Modify | The contract paths |
| The six moved `README.markdown` files | Modify | Paths, file names and the top note |
| `.skilled/skills/sk-code/sk-code-skilled/assets/checklists/command-authoring.md` | Modify | The checklist names the new suffix |
| `.skilled/skills/sk-doc/scripts/tests/code-folder/durable-directory-manifest.json` | Modify | The 4 old directories replaced |
| `.skilled/skills/sk-doc/scripts/tests/code-folder/baseline-readme-verdicts.json` | Modify | Only the 6 moved paths rewritten |
| `.skilled/skills/system-spec-kit/runtime/cli/check-markdown-links.cjs` | Modify | Walks `.markdown` too |
| `.skilled/skills/system-spec-kit/runtime/cli/spec/template-phrase-lint.mjs` | Modify | Stages `*.markdown` too |
| `.skilled/skills/sk-doc/sk-create-readme/scripts/audit_readmes.py` | Modify | Recognises `readme.markdown`, lowercase included |
| `.skilled/skills/sk-doc/scripts/tests/test_readme_verdict_parity.py` | Modify | Recognises `README.markdown` |
| `.skilled/skills/sk-doc/shared/scripts/validate_document.py` | Modify | Classifies `readme.markdown` as `readme` before the commands-folder rule |
| `specs/system-deep-loop/036-deep-loop-innovation/001-research-inputs-and-architecture/003-baseline-taxonomy-and-state-census/state-backend-census.json` | Modify | The census row that `legacy-projections.test.ts` compares with the projection manifest |
| `spec.md`, `plan.md`, `tasks.md`, `implementation-summary.md` | Modify | This phase's packet, filled from the scaffold |
| `../spec.md` | Modify | The phase map row for 055 and the 054 to 055 handoff row |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The 12 non-command markdown files live under `.skilled/commands/<sub>/` with `.markdown` names, and `.skilled/command-support/` no longer exists. | `git status` shows 12 renames into `.skilled/commands/` and no `.skilled/command-support/`; no runtime mirror or symlink pointed at the old tree. |
| REQ-002 | Neither OpenCode version registers any of the 12 moved files as a command, so both list the same commands as before the move. | `scratch/commands-before.json` and `scratch/commands-after.json` both read 40 on v1 and 42 on v2, with nothing added and nothing removed. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Every consumer that named a moved path or file name is updated, and the three compiled contracts recompile to the same bytes as the moved files. | `compile-command-contracts.cjs --command <c> --write` produces output byte-identical to the moved files for all three commands. |
| REQ-004 | The checks that read `.md` files keep their coverage of the moved files: the link guard walks `.markdown`, `template-phrase-lint.mjs` stages `*.markdown`, and the three sk-doc scripts recognise `README.markdown` while a real command stays classified as a command. | The link guard reports 0 broken links over 7794 files and 14204 links, and `validate_document.py` classifies `.skilled/commands/create/readme.md` as `command` while `readme.markdown` reads as `readme`. |
| REQ-005 | The tracked suites report the same numbers as the baseline, or the difference is explained. | `scratch/suites-before.txt` and `scratch/suites-after.txt` match on every suite, with the one deep-loop run that failed on the census row recorded and its rerun green. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The operator's layout holds: everything is inside `.skilled/commands/`, the non-command files carry `.markdown`, and `.skilled/command-support/` is gone.
- **SC-002**: Both versions list exactly what they listed before, 40 commands on v1 and 42 on v2, so the rename changed file names and nothing the hosts dispatch.
- **SC-003**: No suite regressed: plugins 516, hook node 889 across 30 files, battery unit 51, gate-3 parity 17 and deep-loop vitest 2799 passed with 8 skipped, both times.
- **SC-004**: A separate read-only review found no open issue: round 1 passed with 2 P2s, both fixed and rechecked in a narrow round 2.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Both OpenCode versions scanning `{command,commands}/**/*.md` with `dot:true` and no ignore list | High | Probed on 1.19.3 and 2.0.32: a leading underscore, a dot-folder, `README`, `node_modules`, `assets/` and an ignore file are all still registered, so only the file name could carry the exclusion |
| Dependency | A suffix neither version scans | High | `.markdown`, `.mdx`, `.md.txt` and `.md.bak` are all unregistered, and there is no frontmatter opt-out on either version; `.markdown` is the closest readable choice |
| Risk | A consumer keeps a stale path and breaks silently | High | The suites cover the touched consumers, the three contracts recompiled byte-identical, and the README manifest reproduced |
| Risk | The sk-doc fixtures are regenerated wholesale instead of edited | Med | `baseline-readme-verdicts.json` had only the 6 moved paths rewritten; a full regeneration would have added 7 unrelated READMEs |
| Risk | The rename quietly drops a check that used to cover these files | Med | The link guard, the phrase lint and the three sk-doc scripts were each taught the new suffix rather than left behind |
| Risk | A hosted command-cache difference between versions hides a regression | Low | The battery method reads the list from a private data home on v1 and a private `serve` on v2, never the shared service |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None for this phase. The operator's layout decision of 2026-10-22 settled the destination that phase 004 had left to the orchestrator, and both versions list the same commands afterwards.
<!-- /ANCHOR:questions -->

---
