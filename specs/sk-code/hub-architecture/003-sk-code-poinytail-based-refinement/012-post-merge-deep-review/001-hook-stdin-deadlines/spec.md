---
title: "Feature Specification: Phase 1: hook-stdin-deadlines"
description: "Three registered hooks read stdin to end of stream with no deadline, so a host that never closes the pipe holds each one until the host's own timeout kills it."
trigger_phrases:
  - "hook stdin deadlines"
  - "phase 1 hook stdin deadlines"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 1: hook-stdin-deadlines

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
| **Branch** | `scaffold/001-hook-stdin-deadlines` |
| **Parent Spec** | ../spec.md |
| **Phase** | 1 of 5 |
| **Predecessor** | None |
| **Successor** | 002-webflow-runtime-and-references |
| **Handoff Criteria** | Both new deadline tests pass, the existing hook suites hold, and every one of the ten stdin readers has a recorded verdict |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 1** of the Fix the confirmed P2 findings of the post-merge review specification.

**Scope Boundary**: The three hook files that need a deadline, two tests, and the version lines and changelogs of `sk-git` and `sk-vision`.

**Dependencies**:
- Review finding 1 (R2-COR-001) in `../review/review-report.md`
- The shared reader `readStdin` in `.skilled/hooks/shared/hook-adapter-shared.cjs`, which settles on end of stream or 3000 ms

**Deliverables**:
- A stdin deadline in `git-message-gate.mjs`, `git-preflight-advisory.mjs` and `sk-vision.mjs`
- One failing-before test per hook family
- A verdict for each of the ten stdin readers
- `sk-git` 1.8.1.0 and `sk-vision` 0.3.1.0 with changelogs

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`git-message-gate.mjs` and `git-preflight-advisory.mjs` are registered as PreToolUse hooks in Claude (5 s), Codex (5 s), Devin (5 s) and Cursor (10 s), and `sk-vision.mjs` is registered as Devin's UserPromptSubmit hook (60 s). Each read stdin with `for await (const chunk of process.stdin)`, which waits for end of stream. A host that holds the pipe open leaves the hook running until the host kills it, which the operator sees as a stalled turn.

### Purpose
Every registered stdin reader a real host can hang settles on its own within the shared 3000 ms deadline, and every reader that cannot be hung is recorded with its reason.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Replace the three local readers with `readStdin` from `.skilled/hooks/shared/hook-adapter-shared.cjs`
- Add `scripts/hooks/stdin-deadline.test.mjs` for both sk-git hooks and one open-stdin case to `sk-vision-devin.test.mjs`
- Record a verdict for each of the ten stdin readers the review counted
- Bump `sk-git` to 1.8.1.0 and `sk-vision` to 0.3.1.0 with changelogs

### Out of Scope
- The seven readers recorded as not needing a deadline, listed under Key Decisions in `implementation-summary.md`
- Git hooks under `.skilled/scripts/git-hooks/`, which another track owns
- The advisor's runtime scorer files

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/sk-git/scripts/hooks/git-message-gate.mjs` | Modify | Shared deadline reader |
| `.skilled/skills/sk-git/scripts/hooks/git-preflight-advisory.mjs` | Modify | Shared deadline reader |
| `.skilled/skills/sk-git/scripts/hooks/stdin-deadline.test.mjs` | Create | Open-stdin test for both sk-git hooks |
| `.skilled/skills/sk-git/SKILL.md` | Modify | Version 1.8.1.0 |
| `.skilled/skills/sk-git/README.md` | Modify | Version 1.8.1.0 |
| `.skilled/skills/sk-git/changelog/v1.8.1.0.md` | Create | Changelog entry |
| `.skilled/skills/sk-vision/hooks/devin/sk-vision.mjs` | Modify | Shared deadline reader |
| `.skilled/skills/sk-vision/hooks/devin/sk-vision-devin.test.mjs` | Modify | Open-stdin case |
| `.skilled/skills/sk-vision/SKILL.md` | Modify | Version 0.3.1.0 |
| `.skilled/skills/sk-vision/README.md` | Modify | Version 0.3.1.0 |
| `.skilled/skills/sk-vision/changelog/v0.3.1.0.md` | Create | Changelog entry |
| `.hermes/skills/sk-git/SKILL.md` | Modify | Regenerated Hermes copy |
| `.hermes/skills/sk-vision/SKILL.md` | Modify | Regenerated Hermes copy |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Both sk-git hooks exit on their own with stdin held open | `node --test .skilled/skills/sk-git/scripts/hooks/stdin-deadline.test.mjs` prints `pass 2`, `fail 0`. Before the fix it printed `pass 0`, `fail 2`, each hook killed at about 6000 ms |
| REQ-002 | The Devin vision hook exits on its own with stdin held open | `exits on its own when the host never closes stdin` passes in `sk-vision-devin.test.mjs`. Before the fix it failed at 6006 ms |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Existing behavior holds | `git-preflight-advisory.test.mjs` prints `pass 7`, `fail 0`, `message-contract.test.mjs` prints `pass 38`, `fail 0`, and the sk-vision suite keeps its one pre-existing failure, the build-dependent `resolves a built entry` case |
| REQ-004 | Versions and Hermes copies | `sk-git` reads 1.8.1.0 and `sk-vision` 0.3.1.0 in SKILL.md, README.md and the new changelog, and `sync-skills-hermes.cjs --check` prints `PASS: 70 Hermes skill copies in sync` |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Three registered hooks that could hang now settle within about 3 seconds
- **SC-002**: Ten stdin readers each carry a recorded verdict
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A slow host writes its payload after 3000 ms | Low | The hooks then see a partial or empty payload, fail to parse it and fail open. All four hosts write the payload at spawn |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. Every reader's verdict is recorded under Key Decisions in `implementation-summary.md`.
<!-- /ANCHOR:questions -->

---
