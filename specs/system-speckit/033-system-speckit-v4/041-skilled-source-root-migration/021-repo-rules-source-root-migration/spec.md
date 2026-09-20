---
title: "Feature Specification: Phase 21: repo-rules-source-root-migration"
description: "Move the 13-file rule corpus to .skilled/repo-rules, leave a tracked per-entry symlink farm at the repository root, and re-point every live reference in this repository at the canonical path."
trigger_phrases:
  - "repo rules source migration"
  - "rule corpus relocation"
  - "repo rules symlink farm"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 21: repo-rules-source-root-migration

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-09-20 |
| **Branch** | `worktrees/056-repo-rules-source-root-migration` |
| **Parent Spec** | ../spec.md |
| **Phase** | 21 of 22 |
| **Predecessor** | 020-fix-admission-baseline-and-block-ci |
| **Successor** | None |
| **Handoff Criteria** | The corpus checker is green on both layouts, the farm is intact, and every live reference resolves |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 21** of the skilled source-root migration specification.

**Scope Boundary**: The rule corpus, its compatibility farm, and every live reference to it
inside this repository. The three sibling repositories that link into the root path stay
untouched, because the farm keeps their links resolving.

**Dependencies**:
- Phase 008 settled the per-entry symlink shape for `.opencode` and phase 009 rewrote the
  reference corpus; this phase reuses both outcomes rather than re-deciding them.

**Deliverables**:
- See section 3.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.

**Track**: the compiled-serving phases (17, 19 and 20) belong to a separate track inside this
parent. Nothing here gates them and they do not gate this phase.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Every authored surface in this repository lives under `.skilled/`, except the rule corpus, which
still sits at the repository root in `repo-rules/`. That split makes the root path both the
authoring home and a compatibility surface, so a reader cannot tell which one is canonical, and
the corpus checker hardcodes the root layout in a skill that is documented to work in repositories
with no `.skilled/` tree at all. The checker is also red at HEAD: `answer-the-actual-request.md`
carries three dividers against eight numbered sections, so the corpus has no green baseline.

### Purpose
One canonical corpus at `.skilled/repo-rules/`, a tracked per-entry farm at the root that keeps
every existing consumer resolving, and every live reference in this repository naming the
canonical path.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The 13 rule files move to `.skilled/repo-rules/` in a rename-only commit, with 13 tracked
  symlinks left behind at `repo-rules/<rule>.md -> ../.skilled/repo-rules/<rule>.md`.
- Every live reference outside `specs/`: `REPO RULES.md` (26 router links), `AGENTS.md` (5),
  the 13 rule-body backlinks, the corpus checker, the `sk-create-repo-rule` skill and its
  playbook, the `/create:repo-rule` command and its assets, the two authored agent files, CI,
  and the sk-communication benchmark generator.
- The pre-existing divider defect in `answer-the-actual-request.md`, fixed as its own commit.
- A farm-integrity check: every rule file is covered by exactly one root symlink, and no extra
  symlink exists.

### Out of Scope
- The three sibling repositories that link into `Public/repo-rules` — the farm keeps them
  resolving, and re-pointing them at the canonical path is a recorded follow-up needing the
  operator's go-ahead.
- Frozen records: `specs/**`, `**/changelog/**`, `**/benchmark/reports/**`, the scorer cache and
  the four captured-once retrieval fixtures. They stay byte-identical.
- Files that keep a historical or portable meaning: the `repo-rules-router-template.md` asset,
  the hub registries' keyword lists, and the `leaf-manifest` asset filename.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `repo-rules/*.md` | Move | 13 files to `.skilled/repo-rules/`, farm left at the root |
| `REPO RULES.md` | Modify | 26 router row links to the canonical path |
| `AGENTS.md` | Modify | Five links to the canonical path |
| `.skilled/skills/sk-doc/sk-create-repo-rule/scripts/check-repo-rules.cjs` | Modify | Layout-aware rules directory and router-row detection |
| `.skilled/skills/sk-doc/sk-create-repo-rule/**` | Modify | Skill docs, references and playbook to the canonical path |
| `.skilled/commands/create/repo-rule.md` | Modify | Layout-aware `rules_dir` and output strings |
| `.skilled/agents/markdown.md`, `.skilled/agents/orchestrate.md` | Modify | Canonical path |
| `.claude/agents/**`, `.pi/agents/**`, `.codex/agents/**`, `.hermes/skills/**` | Modify | Regenerated through their owners |
| `.github/workflows/repo-rules-corpus.yml`, `.github/workflows/README.md` | Modify | Canonical filters and checker path |
| `.skilled/skills/sk-communication/benchmark/reply-harness/generate-prompts.mjs` | Modify | Canonical working-tree lane, historical before-lane |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | The canonical corpus lives in `.skilled/repo-rules/` and every rule file resolves through its root farm entry. |
| REQ-002 | Every live reference in tracked files outside `specs/` and outside the frozen records names the canonical path. |
| REQ-003 | The corpus checker reports `RESULT: PASSED (9/9 checks)` in this repository, and reports the same verdict in a checkout that carries only `repo-rules/` with no `.skilled/` tree. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-004 | Every generated mirror and derived artifact regenerates with no drift, and the frozen records stay byte-identical. |
| REQ-005 | The farm-integrity check exists and covers every rule file exactly once. |
| REQ-006 | The parent packet registers this phase, its handoff row and its child id. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `node check-repo-rules.cjs` prints `RESULT: PASSED (9/9 checks)` from the worktree,
  where HEAD prints `FAILED (8/9)` with the divider row red.
- **SC-002**: `ls -L repo-rules` lists 13 rule files, and the same command in the three sibling
  repositories still lists them after this branch merges.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Farm drift: a root symlink deleted or retargeted, with nothing noticing | Med | The farm-integrity check runs as check 1 of the phase verification and reports each uncovered rule file |
| Risk | A generator refuses to write through a symlink | Med | Halt that unit and report the path; never delete the link to get past it |
| Risk | Sibling consumers resolve through the main checkout, not the worktree | Low | They stay live during the phase and are proven after merge; the farm is what keeps them resolving |
| Risk | The corpus checker loses portability to repositories without `.skilled/` | Med | Verification runs the checker from a fixture that carries only `repo-rules/` |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The corpus checker stays a single Node process under five seconds.

### Security
- **NFR-S01**: No symlink leaves the repository root; every farm target is `../.skilled/repo-rules/<rule>.md`.

### Reliability
- **NFR-R01**: The checker fails rather than warns when the rules directory cannot be found, and names the directories it probed.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- A rules directory holding a file with no router row: check 2 reports the orphan rather than crashing.
- A router row whose link resolves inside another directory: not a router row, so it is skipped.

### Error Scenarios
- Neither `.skilled/repo-rules` nor `repo-rules` exists: the checker fails with both probed paths named.
- A farm entry points at a missing file: the integrity check reports the dangling link.

### State Transitions
- Mid-move state (files moved, farm not yet committed): the checker finds the canonical directory and passes; the farm check is what reports the missing links.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 18/25 | 13 files moved, around 30 tracked references, one generator and one CI contract |
| Risk | 12/25 | Live consumer resolution through the farm, all inside one repository |
| Research | 10/20 | A cited census of consumers across five surfaces |
| **Total** | **40/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- Should the three sibling repositories be re-pointed at `.skilled/repo-rules/<rule>.md`? Recorded as a
  follow-up; it needs the operator's explicit go-ahead and is not part of this phase.
<!-- /ANCHOR:questions -->

---
