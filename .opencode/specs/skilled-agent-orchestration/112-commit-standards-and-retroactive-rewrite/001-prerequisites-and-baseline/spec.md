---
title: "Phase 001: Prerequisites & Baseline"
description: "Install git-filter-repo, pin tool versions, and snapshot the pre-rewrite baseline (backup branch + full git bundle + text log) before any rewrite work begins."
trigger_phrases:
  - "112-prerequisites-and-baseline"
  - "git-filter-repo install"
  - "pre-rewrite bundle"
  - "tooling pins"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/112-commit-standards-and-retroactive-rewrite/001-prerequisites-and-baseline"
    last_updated_at: "2026-05-16T00:00:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Scaffolded phase 001 docs"
    next_safe_action: "Install git-filter-repo and capture tooling pins"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "evidence/tooling-pins.json"
      - "evidence/baseline-log.txt"
      - "evidence/pre-rewrite.bundle"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-001-2026-05-16"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Phase 001: Prerequisites & Baseline

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P0 |
| **Status** | Draft |
| **Created** | 2026-05-16 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Phase** | 1 of 5 |
| **Predecessor** | None |
| **Successor** | 002-commit-standards-definition |
| **Handoff Criteria** | `git-filter-repo` installed; `evidence/pre-rewrite.bundle` exists and verifies; `evidence/baseline-log.txt` captured (2,795 lines); `evidence/tooling-pins.json` populated |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 1** of the 112 commit-standards-and-retroactive-rewrite packet.

**Scope Boundary**: Pre-execution tooling and baseline only. No git refs are written or modified — only `evidence/` files are added.

**Why before Phase 002**: Tool gaps (e.g., missing `git-filter-repo` binary) must surface now, not at execution time. A real backup (full bundle, not just a branch) must exist before any phase touches HEAD. Phase 002 doesn't depend on the bundle, but it benefits from knowing the baseline log is locked in: any drift in commit count between now and Phase 005 is a red flag.

**What this phase does NOT do**: define standards (Phase 002), update sk-git (Phase 003), author rewrite prompts (Phase 004), execute the rewrite (Phase 005).
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Two unknowns block downstream phases: (1) `git-filter-repo` is not currently installed on this Mac (verified at planning time — Phase 005 needs it for the message-callback rewrite), and (2) no point-in-time backup of HEAD history exists, so a botched rewrite would have no easy recovery path.

### Purpose
Make Phase 005 reversible. Lock the tooling versions so the rewrite is reproducible. Capture a diffable text snapshot so we can confirm post-rewrite that no commits were silently lost.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `brew install git-filter-repo` (or confirm existing install).
- Verify `devin --version`, `sequential_thinking` MCP availability (used in Phase 002 + Phase 004).
- `git bundle create evidence/pre-rewrite.bundle --all` — full bundle covering all refs, not just HEAD.
- `git log --pretty=format:'%H %s' > evidence/baseline-log.txt` — text snapshot for diffability.
- Confirm GPG signing is off (already verified at planning time — no signed commits).
- Write `evidence/tooling-pins.json` with versions of: `git`, `git-filter-repo`, `devin`, `python3`, `bash`, `node` (for any callback scripts), macOS version.

### Out of Scope
- Standards definition (Phase 002).
- Any modification to sk-git, cli-devin, or commit history.
- Mirroring evidence to other clones — single-machine workflow.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `evidence/tooling-pins.json` | Create | Pinned tool versions used by Phase 004/005 |
| `evidence/pre-rewrite.bundle` | Create | Full `git bundle --all` snapshot |
| `evidence/baseline-log.txt` | Create | `%H %s` text snapshot of all 2,795 HEAD commits |
| `implementation-summary.md` | Update | Fill at phase close |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance |
|----|-------------|------------|
| REQ-001 | `git-filter-repo` installed and on `$PATH` | `git filter-repo --version` exits 0 |
| REQ-002 | Full repo snapshot recoverable | `git bundle verify evidence/pre-rewrite.bundle` exits 0 |
| REQ-003 | Baseline log captured | `wc -l evidence/baseline-log.txt` reports 2,795 |
| REQ-004 | Tooling pins documented | `evidence/tooling-pins.json` exists and is valid JSON with version fields for git/filter-repo/devin/python3/bash/node/macOS |
| REQ-005 | GPG signing state documented | Note in `evidence/tooling-pins.json` confirming `commit.gpgsign` is false (or unset) — signing during rewrite would break filter-repo |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- All 5 REQs above pass.
- `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh ./001-prerequisites-and-baseline --strict` exits 0.
- `evidence/` is committable: no secrets, no machine-specific absolute paths in the JSON (only tool versions + short paths relative to repo root).
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

- **Bundle size**: `git bundle --all` may produce a large file. Acceptable — single-machine workflow, ~tens of MB expected. Document size in implementation-summary.
- **Brew install side effects**: `brew install git-filter-repo` may pull Python dependencies. Low risk; tool is widely used.
- **Drift between baseline and rewrite execution**: if commits are added to HEAD between Phase 001 and Phase 005, the baseline log will be stale. Mitigation: Phase 005 re-captures `git log --pretty=format:'%H %s'` and confirms count matches (or recomputes baseline if drifted).
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None. All Phase 001 decisions are mechanical.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- Parent: `../spec.md`
- Next phase: `../002-commit-standards-definition/spec.md`
- Plan: `plan.md`
- Tasks: `tasks.md`
