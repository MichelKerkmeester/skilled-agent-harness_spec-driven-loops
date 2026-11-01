---
title: "Decision Record: Doctor scripts find a nested .skilled root"
description: "Why the doctor scripts resolve their root from the .skilled sentinel, where the work is documented and which workspace it uses, with the operator's answers verbatim."
trigger_phrases:
  - "nested skilled root decision"
  - "doctor root finding decision"
importance_tier: "normal"
contextType: "decision"
_memory:
  continuity:
    packet_pointer: "commands/002-doctor-audit-and-fixes/003-nested-skilled-root"
    last_updated_at: "2026-11-01T06:08:23Z"
    last_updated_by: "orchestrator"
    recent_action: "Recorded the operator's root-finding, placement and workspace answers"
    next_safe_action: "Record the implementation result against this decision"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "barter-coder-conversion-orchestration"
      parent_session_id: null
    completion_pct: 50
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
# Decision Record: Doctor scripts find a nested .skilled root

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Fix the root finding in Skilled, then re-pin the vendored copy

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-11-01 |
| **Deciders** | Operator, in six questions recorded below |

---

<!-- ANCHOR:adr-001-context -->
### Context

Barter vendors Skilled one folder below its own git root (`ai-speckit/coder/.skilled`, with `.git` at `ai-speckit/`). From
there, `sk-skill-check.cjs` exits 2 with `HUB_NOT_FOUND` and `skill-graph-freshness.cjs` exits 0 while scanning a missing
`ai-speckit/.skilled/skills`. Both walk to the first `.git`. The measurements are in `scratch/baseline-before-change.md`.

### Constraints

- Behaviour in the Skilled checkout and in a project that links `.skilled` must not change.
- Scripts whose git root is correct by design keep it.

### Operator questions and answers

| Date | Topic | Question | Options offered | Answer (verbatim) |
|------|-------|----------|-----------------|-------------------|
| 2026-10-31 | Root finding | Skilled's doctor scripts assume `.skilled` sits at the git root. Barter's `coder/.skilled` sits one level below Barter's git root, so from coder some scripts read the wrong folder. Measured: `/doctor:sk-skill check` fails with HUB_NOT_FOUND, and `skill-graph-freshness` exits 0 while scanning a non-existent `ai-speckit/.skilled`, a silent green. Git-only scripts (worktrees, hooks) correctly use Barter's root. How should this be fixed? | Fix in Skilled, re-pin (rec.); Patch in coder via overlay; Document only | Fix in Skilled, re-pin (Recommended) |
| 2026-11-01 | Spec folder | Before I proceed, I need to ask about documentation. The root-finding fix (R31) changes Skilled's own doctor scripts, outside the Barter packet. Where should it be documented? | B) New: 042-nested-skilled-root; C) Related: under 037; D) Skip | Check commands tracker for doctor command existing specs |
| 2026-11-01 | Workspace | Which git workspace should the Skilled fix use? Skilled main is at 82e726664d, 9 commits past the pin coder uses, and another session has untracked files under specs/system-speckit/040-*. | A) Create a git worktree; B) Work on current branch | B) Work on current branch |
| 2026-11-01 | Spec folder | I checked specs/commands for existing doctor specs. Where should the root-finding fix go? It makes the doctor and maintenance scripts find the folder holding .skilled even when that folder sits below another repo's git root, as in Barter's coder/. All three candidate parents are Complete phase parents, and either option adds a new child. | 005-symlink-install child 007 (rec.); 002-audit-and-fixes child 003 | 002-audit-and-fixes child 003 |
| 2026-11-01 | Commit | The Skilled changes are verified and ready to commit on main, with no push. Commit 1, fix(doctor): the 3 scripts, the freshness asset, the new doctor-root-resolution test (8/8; fails 5/8 on the old code) and spec packet 002/003. Commit 2, docs(system-spec-kit): the two policy lines allowing an optional parent decision-record.md, with the 009 parent spec and child 005. Undo before a push: git reset --soft HEAD~2; after a push: git revert both. May I commit? | Commit both, no push (rec.); Commit and push; One combined commit; Don't commit yet | Commit and push |
| 2026-11-01 | Closeout commit | (Chat question.) Can I commit and push the 7 closeout files to Skilled main? Undo before a push is git reset --soft HEAD~1; after a push it is git revert. | yes / no (chat) | Yes push to skilled main |

The complete log of every question in the conversion is the Barter packet's root decision record,
`barter/ai-speckit/specs/barter-framework/001-coder-skilled-v4-conversion/decision-record.md`.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: fix the three doctor scripts in Skilled so they resolve the root through the shared sentinel resolver
`shared/workspace/repo-root.mjs`, documented as this child of `002-doctor-audit-and-fixes`, on `main`. The vendored copy then
re-pins to the fixed commit with a pinned re-copy and its overlay replay.

**How it works**: `spec.md` and `plan.md` carry the requirements and the approach; this record carries why and who decided.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Fix in Skilled, re-pin (chosen)** | Every nested install gains it; one place to maintain | Needs a Skilled change and a re-pin | 9/10 |
| Patch the vendored copy with hash-guarded overlays | Skilled untouched | Each future pin may need the patches rebased | 5/10 |
| Document overrides only | No code change | `/doctor:sk-skill` stays unusable from a nested copy, and the freshness panel stays a silent green | 2/10 |

**Why this one**: the defect is Skilled's assumption, so the fix belongs where every consumer receives it.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- Doctor checks work from a `.skilled` copy that sits below another repository's git root.

**What it costs**:
- A change to shared root resolution in three scripts. Mitigation: regression cases for the Skilled and linked layouts.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A script that needed the git root is switched by mistake | Medium | Scope names the git scripts that keep `git rev-parse`; REQ-006 states it |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Two measured failures from a nested copy |
| 2 | **Beyond Local Maxima?** | PASS | Three options compared |
| 3 | **Sufficient?** | PASS | Reuses the existing sentinel resolver; no new module |
| 4 | **Fits Goal?** | PASS | Makes the doctor commands usable in the vendored install |
| 5 | **Open Horizons?** | PASS | Any future nested install inherits it |

**Checks Summary**: 5/5 PASS.
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**: `lib/sk-skill-surface.cjs`, `skill-graph-freshness.cjs` and `parent-skill-check.cjs` resolve through the
shared resolver; a new test suite covers the nested, Skilled and linked layouts.

**How to roll back**: revert the three scripts and delete the new test file; behaviour returns to the `.git` walk.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->
