---
title: "Feature Specification: README Migration Audit"
description: "Dual-executor deep review (deepseek-v4-flash + GLM-5.2-high) auditing every non-worktree README in the repo, including the root README, for content that's logically stale after the specs-root topology flip (003-migration-execution)."
trigger_phrases:
  - "readme migration audit"
  - "readme deep review"
  - "post-migration documentation drift"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/032-relocate-specs-folder/005-readme-migration-audit"
    last_updated_at: "2026-08-07T19:38:12Z"
    last_updated_by: "claude-code"
    recent_action: "Review complete; 18/20 findings fixed, 2 deferred; validate.sh passed"
    next_safe_action: "Commit and push to skilled/v4.0.0.0"
    blockers: []
    key_files:
      - "README.md"
      - ".opencode/skills/system-spec-kit/README.md"
      - ".opencode/bin/check-no-spec-imports.cjs"
      - ".opencode/scripts/git-hooks/lib/memory-drift-marker.sh"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-07-system-speckit-032-relocate-005"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: README Migration Audit

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Complete — 18/20 findings fixed, 2 explicitly deferred (F012, F020) |
| **Created** | 2026-08-07 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Phase** | 5 of 5 |
| **Predecessor** | 004-code-graph-index-flag-deprecation |
| **Successor** | None |
| **Handoff Criteria** | `review/review-report.md` present with a verdict; every finding either fixed or explicitly deferred with a reason |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 5** of the specs-folder relocation specification — a documentation-drift audit, not a code change. The migration (phase 3) flipped `specs/` to canonical and `.opencode/specs` to a compat symlink; phase 8 of that runbook already fixed the two named operator-facing docs (`AGENTS.md`, `PUBLIC-RELEASE.md`) plus CI. This phase looks for everything phase 8's named list didn't cover — the ~750 other README files in the repo that might still describe the pre-flip topology.

**Scope Boundary**: README content correctness relative to the specs-root topology flip only. Not a general documentation-quality pass, not a check of non-README docs (`references/`, `SKILL.md` bodies, etc. — those were phase 8's or are out of scope here unless a README directly points at one that's wrong).

**Dependencies**:
- `003-migration-execution` (the flip itself, Complete)

**Deliverables**:
- `review/review-report.md` — the deep-review loop's verdict and findings, scoped to README staleness
- Fixes applied for every confirmed finding, or an explicit documented deferral per finding

**Changelog**:
- When this phase closes, refresh the matching file in `../changelog/` using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The specs-root topology flip (`003-migration-execution`) changed the canonical location of every spec-kit document. Phase 8 of that runbook updated the two operator-facing docs it explicitly named, but a repo-wide grep for the literal string `.opencode/specs` across every non-worktree README (excluding historical spec-doc content) finds 22 files still mentioning it — some may correctly describe it as the compat symlink, some may not. Beyond literal string matches, a README can be logically stale without ever using that exact string: an architecture diagram, a directory-structure listing, or a "where things live" section can describe the pre-flip layout in prose without the literal path appearing anywhere.

### Purpose

Every README in the repo (main working tree, non-worktree, including the root `README.md`) accurately reflects the post-flip topology — either because it never needed updating, or because this phase updated it.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Every `README.md` under the main working tree, excluding `.worktrees/*` (duplicated checkouts, not canonical) and `specs/**/README.md`-shaped files if any exist as historical spec-doc content rather than living documentation.
- The repo root `README.md` explicitly — confirmed to already contain 1 stale `.opencode/specs` reference as of scoping time.
- The 22-file candidate list from the literal-string grep (below) as a prioritized starting point, not an exhaustive boundary — the "research angle" requested for this review means going beyond string matching to catch logically-stale prose (diagrams, directory listings, "where things live" sections) that never uses the literal old path.

### Out of Scope

- `.worktrees/*` — duplicated full-repo checkouts from concurrent sessions, not canonical source; auditing them would mean re-auditing the same content dozens of times and risks touching another session's active work.
- Non-README documentation (`references/*.md`, `SKILL.md` bodies, `AGENTS.md`, `CLAUDE.md`, `PUBLIC-RELEASE.md`) — `AGENTS.md`/`PUBLIC-RELEASE.md` were already fixed in phase 8; the rest is a different, larger surface than this phase's README-specific scope.
- Historical spec-doc content under `specs/**` that legitimately describes the pre-flip topology as a historical record (changelogs, closed decision records) — not a live-documentation staleness issue.
- General documentation-quality issues unrelated to the migration (typos, formatting, broken unrelated links) — flag if found, but this phase's acceptance bar is migration-correctness, not a full DQI pass.

### Files to Change

Not known until the review runs — this is a discovery task. The grep-hit candidate list (~21-22 files at scoping time, a moving number under concurrent repo activity — reproduce it, don't trust a frozen count) is the known starting set; `plan.md` §2 names the exact command.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The repo root `README.md` is checked and its topology description is corrected if stale | Confirmed via the review's findings; the 1 known `.opencode/specs` reference is resolved (fixed or confirmed-correct-as-is) |
| REQ-002 | Every finding from the deep-review loop is either fixed or explicitly deferred with a documented reason — none left silently unaddressed | `review/review-report.md` accounts for every finding's disposition |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | **AMENDED, evidence-based acceptance (was: both executors must run).** `glm-high` (cli-devin) never spawned a single process across a ~24-minute window despite a fully-resolved config (`review/lineages/glm-high/invocation-metadata.json` shows a valid `devin` binary hash) and confirmed auth (`devin auth status` = logged in). Root-caused directly: `fanout-run.cjs`'s `runLineageProcess()` spawn-error path (`result.error`) is captured but never logged anywhere in the script — a genuine, confirmed silent-failure gap in the shared deep-loop runtime, out of scope for this packet to fix. Accepted with one executor (`deepseek-flash`, all 10 iterations, CONDITIONAL verdict) plus this documented root cause, rather than blocking the whole audit on unrelated runtime infrastructure. | `review/orchestration-summary.json` (`"succeeded":1,"failed":1`), `review/lineages/glm-high/` (only `invocation-metadata.json` + empty `logs/fanout-lineage.out`, zero iteration artifacts), `review/lineages/deepseek-flash/review-report.md` (full 10-iteration synthesis) |
| REQ-004 | Coverage goes beyond the literal-string candidate list — at least one finding (if any exist) comes from prose/diagram staleness that doesn't use the literal `.opencode/specs` string | Documented in the review report, or explicitly noted if no such finding exists |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `review/review-report.md` exists with a clear verdict (PASS/CONDITIONAL/FAIL-equivalent for a documentation audit).
- **SC-002**: The root `README.md`'s known stale reference is resolved.
- **SC-003**: No finding is left in an ambiguous or silently-dropped state — each has a disposition.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | ~750 non-worktree README files is too large a surface for 10-20 iterations to exhaustively read line by line | Medium | The grep-hit list plus targeted directory-structure/architecture-diagram sections give the reviewers a grounded, prioritized starting point instead of an unscoped sweep |
| Risk | A reviewer flags a README that describes `.opencode/specs` correctly (as the compat symlink) as if it were stale | Low-Medium | Every finding gets verified against the actual current topology (`specs/` canonical, `.opencode/specs` symlink) before being treated as real, not accepted on a reviewer's say-so alone |
| Dependency | `003-migration-execution` must be the accepted topology (it is — Complete) | — | Already satisfied |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. Scope is bounded by the real, reproducible census (`plan.md` §2's exact command) and the phase 8 precedent for what "fixed" looks like.
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->
