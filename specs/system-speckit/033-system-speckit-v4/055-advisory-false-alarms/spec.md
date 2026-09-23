---
title: "Feature Specification: Stop the sk-git pathspec advisory and the completion-evidence sentinel from raising false alarms"
description: "Two advisories warned about problems that did not exist. The sk-git pathspec checks judged a path behind a shell expansion as literal text. The completion-evidence sentinel took a cited document with its line number as the packet folder."
trigger_phrases:
  - "feature specification"
  - "problem statement"
  - "requirements and scope"
  - "success criteria"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Stop the sk-git pathspec advisory and the completion-evidence sentinel from raising false alarms

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-09-23 |
| **Branch** | `worktrees/065-fix-advisory-false-alarms` |
| **Parent Spec** | ../spec.md |
| **Phase** | 55 of 55 |
| **Predecessor** | 053-legacy-template-default-detection |
| **Successor** | None |
| **Handoff Criteria** | N/A - last phase of the parent |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 55** of the system-speckit v4 parent specification. Number 054 is left to `054-ci-cleanup-follow-ups`, which another session is writing on its own branch.

**Scope Boundary**: Only the sk-git command parser and its two "nothing matched" checks, the completion-evidence sentinel's folder resolver, one test for each, this packet's docs, the parent's phase map and the parent's derived metadata may change. Anything else is recorded, not repaired.

**Dependencies**:
- Phase 053-legacy-template-default-detection, the predecessor. It is Planned and shares no files with this phase, so this phase does not wait for it.
- Worktree .worktrees/065-fix-advisory-false-alarms on branch worktrees/065-fix-advisory-false-alarms, created from main at d4ffc18aca and fast-forwarded to 83ee20d219 before the commit.

**Deliverables**:
- A pathspec behind a shell expansion no longer reads as matching nothing.
- A cited document, with or without a line number, resolves to its packet folder.
- One regression test per fix, each failing on the old source.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The sk-git advisory hook warned that `git add -- $A/...` matched no files when the files existed. `parseGitCommand` in `.skilled/skills/sk-git/scripts/lib/git-rule-checks.mjs` passes every pathspec token on as literal text. `add-pathspec-matches-nothing` hands it to git's dry run and `commit-pathspec-empty-change` looks it up among staged and unstaged changes. A path behind a shell variable, a backtick command or a leading `~` therefore never matches. The parser already leaves an unexpandable `cd` or `-C` directory alone, but pathspecs had no such rule. Before the fix, `git add -- $A/README.md`, `` git add `echo README.md` `` and `git add ~/x.md` each raised `add-pathspec-matches-nothing` and `git commit --only $A/README.md -m x` raised `commit-pathspec-empty-change`. The same literal path spelled out stayed silent.

The completion-evidence sentinel warned that a packet had no implementation summary when it had one. `resolveSpecFolderFromText` in `.skilled/skills/system-spec-kit/runtime/lib/hooks/completion-evidence-sentinel.cjs` takes the first `specs/...` token in a reply up to the next space and trims only trailing punctuation. A reply that cites a document inside the packet, with or without a line number, therefore resolves to that document rather than its folder. The evidence check then looks for files inside it. In one session the sentinel logged this advisory three times, for replies citing the packet's `spec.md`, its `implementation-summary.md:16` and its `spec.md:25`.

### Purpose

A shell-expanded pathspec draws no advisory and a cited document resolves to the folder that holds it.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Mark a parsed command whose pathspec needs shell expansion and keep `add-pathspec-matches-nothing` and `commit-pathspec-empty-change` silent for it.
- Trim a trailing `:line` or `:line:column` suffix and a trailing file name from the folder the sentinel resolves.
- One regression test for each fix.

### Out of Scope
- The other pathspec checks: they look for something present. A literal `$X/...` never matches, so they stay silent without a change. Guarding the shared `contextFor` helper instead would also mute `reset-hard-discards-changes`, `clean-force-deletes-files` and `add-update-skips-untracked` for a command such as `git reset --hard $REF`.
- Reading git commands out of quoted strings and heredoc bodies: the hook still parses `echo "x && git add missing.txt"` as a git command. A shell-aware tokenizer is a larger change than this packet.
- A document cited from a packet subfolder: the resolver has no filesystem access, so `.../scratch/notes.md:3` still resolves to the `scratch` folder.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| .skilled/skills/sk-git/scripts/lib/git-rule-checks.mjs | Modify | `parseGitCommand` returns `pathsResolved`. The two "nothing matched" checks stay silent when it is false |
| .skilled/skills/sk-git/scripts/lib/git-rule-checks.test.mjs | Modify | Test that a `$`, backtick or `~` pathspec never reads as matching nothing |
| .skilled/skills/system-spec-kit/runtime/lib/hooks/completion-evidence-sentinel.cjs | Modify | `resolveSpecFolderFromText` trims a line suffix and a trailing file name |
| .skilled/skills/system-spec-kit/runtime/tests/completion-evidence-sentinel.vitest.ts | Modify | Test that a cited `path:line` document resolves to its folder |
| specs/system-speckit/033-system-speckit-v4/055-advisory-false-alarms/ (packet docs) | Create | This packet's documentation |
| specs/system-speckit/033-system-speckit-v4/spec.md | Modify | Phase-map and transition rows for this phase |
| specs/system-speckit/033-system-speckit-v4/graph-metadata.json | Modify | Re-derived so the parent lists this phase as a child |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | A pathspec behind a shell expansion never draws the "matches nothing" or "empty change" advisory | The new sk-git test passes and fails against the old parser. The full sk-git suite passes |
| REQ-002 | The sentinel resolves a cited `path:line` document to its folder | The new sentinel test passes and fails against the old resolver. The sentinel suite passes |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | No true advisory is lost | Literal paths behave as before, the existing tests pass unchanged and `git reset --hard $REF` still draws `reset-hard-discards-changes` on a tree with changes |
| REQ-004 | Strict packet validation passes | `validate.sh specs/system-speckit/033-system-speckit-v4/055-advisory-false-alarms --strict` prints `RESULT: PASSED` |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The sk-git suites pass 33 of 33 and the new test fails on the old parser (REQ-001).
- **SC-002**: The sentinel suite passes 24 of 24 and the new test fails on the old resolver (REQ-002).
- **SC-003**: The completion-evidence stop-hook suite passes, the full spec-kit root project shows no failure tied to this change and the destructive-command advisory still fires (REQ-003).
- **SC-004**: `validate.sh --strict` prints `RESULT: PASSED` for this packet (REQ-004).
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A single-quoted `'$A/x'` is literal to the shell but now reads as unresolved | Low | The check stays silent, which is the fail-open direction the parser already takes for unknowable input |
| Risk | Both modules run in every runtime's hooks | Low | Both are advisory and never block. Each fix reverts in one commit |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. The operator asked for one packet covering both fixes under the system-speckit v4 parent. The operator chose number 055 because another branch holds 054.
<!-- /ANCHOR:questions -->

---
