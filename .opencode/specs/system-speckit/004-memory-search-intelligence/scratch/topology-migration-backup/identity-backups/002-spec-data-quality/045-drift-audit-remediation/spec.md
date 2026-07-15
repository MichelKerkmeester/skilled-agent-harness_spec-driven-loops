---
title: "Feature Specification: 028 Drift Audit Remediation"
description: "Fix the 75 documentation/metadata drift and bug findings surfaced by a GPT-5.5-fast (high) cli-opencode audit of the 004-memory-search-intelligence packet: 24 confirmed high/critical (re-verified against real files) plus 51 unverified medium/low findings."
trigger_phrases:
  - "028 drift audit remediation"
  - "drift audit fix"
  - "028 findings remediation"
  - "packet 028 remediation pass"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/004-memory-search-intelligence/002-spec-data-quality/045-drift-audit-remediation"
    last_updated_at: "2026-07-04T17:11:49.048Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Scaffolded spec folder for the drift-audit remediation pass"
    next_safe_action: "Run investigation pass on the 4 code-gap findings, then dispatch per-directory fixes"
    blockers: []
    key_files:
      - "spec.md"
      - "tasks.md"
      - "checklist.md"
      - "../../000-release-cleanup/013-drift-remediation/spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-07-01-028-drift-audit-remediation"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "For the 4 code-gap findings, does the claimed code exist under a renamed/moved path, or is it genuinely absent?"
    answered_questions:
      - "Tracked as a new top-level phase (008) rather than reusing 000/013-drift-remediation, since fixes span code (001-003) and cross-cutting docs (root, 000, 005-007), broader than 000's release-cleanup remit."
      - "Code-gap findings get investigated (repo-wide search for renamed/moved equivalents) before deciding implement-vs-correct-doc, rather than assumed missing."
---

> **PASS-2 FOLLOW-UP (2026-07-01):** a second pass, `046-drift-audit-deep-history-correction` (sibling folder), supplements the 4 code-gap findings' corrections here with real git history -- all 4 were built, shadow-shipped, benchmarked, and deliberately deleted for cause, not simply absent. This pass's GENUINELY_ABSENT verdicts were correct about the current tree but incomplete on that fuller history. See `../046-drift-audit-deep-history-correction/` for details.

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Feature Specification: 028 Drift Audit Remediation

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-07-01 |
| **Branch** | `system-speckit/004-memory-search-intelligence` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
A GPT-5.5-fast (high) audit dispatched via cli-opencode across the 8 phases of the 004-memory-search-intelligence packet (10 parallel sweeps) surfaced 75 findings: 24 high/critical drift/bug/inconsistency issues (independently re-verified against real files, 24/24 confirmed) and 51 unverified medium/low findings from the single sweep pass. These range from stale child counts and status contradictions between parent and child docs, to four cases where a child doc claims shipped code that could not be found at the referenced path.

### Purpose
Reconcile every confirmed finding's target doc/code with reality, and spot-verify then fix the unverified findings, so the packet's spec docs stop making claims that contradict either each other or the filesystem.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Investigate the 4 findings claiming shipped code absent from its referenced path (hybrid-search.ts fusion lane, seeded-PPR ranking, C4 shadow-weight promoter, outcome-weighted store/rerank+tests): repo-wide search for renamed/moved equivalents before deciding fix strategy.
- Fix all 24 confirmed high/critical findings at their target file(s).
- Spot-verify each of the 51 unverified medium/low findings against the real current file content; fix only the ones that reproduce.
- Execute all fixes inside an isolated git worktree (not the live tree), dispatched via `opencode run --model xiaomi/mimo-v2.5-pro-ultraspeed --variant high`.
- Verify every fix via `opencode run --model openai/gpt-5.5-fast --variant high` reading the post-edit file against the original finding.
- Sync verified changes back to the live tree as uncommitted diffs for review.

### Out of Scope
- Auto-committing the synced-back changes - the operator reviews and commits (or discards) manually.
- Building brand-new features for the 4 code-gap findings if investigation shows they are genuinely unimplemented - that is a separate follow-up decision, not silently absorbed into this doc-remediation pass.
- Re-running the original 10-phase audit itself (already complete, see `../../` root packet docs).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| 42 directories across `.opencode/specs/system-speckit/004-memory-search-intelligence/**` and 2 skill source files | Modify | Corrected per-finding, see `tasks.md` Phase 2 for the full per-directory task list |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Investigate the 4 code-gap findings before fixing their docs | Each has a documented verdict: code found elsewhere (path cited) or genuinely absent (repo-wide search command + zero-hit evidence cited) |
| REQ-002 | Fix all 24 confirmed high/critical findings | Each target file, re-read after edit, no longer contains the contradicting claim |
| REQ-003 | All edits happen in an isolated worktree, never against the live dirty tree | `opencode run --dir` for every fix/verify dispatch points at the worktree path, confirmed via dispatch logs |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Spot-verify and fix the 51 unverified findings | Each has an outcome: fixed / did-not-reproduce (no change) / needs-follow-up |
| REQ-005 | Sync fixes back to the live tree as reviewable diffs | `git diff --stat` in the live tree shows exactly the files this pass touched, nothing auto-committed |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All 24 confirmed findings verified fixed by an independent GPT-5.5 read-back pass.
- **SC-002**: The 4 code-gap findings each have an explicit investigation verdict recorded in their fix, not a silent assumption.
- **SC-003**: The live tree's `git diff --stat` after sync-back matches the set of directories in `tasks.md` Phase 2, with no unrelated files touched.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | This project's `opencode.json` sets `edit: allow, bash: allow` globally, so any `opencode run --dir <repo-root>` dispatch has no per-call safety net | A confused fix-model could mutate/delete files outside its assigned directory (see RM-8 incident, 44 files deleted 2026-05-04) | All fix dispatches run with `--dir` pointed at an isolated git worktree cut from HEAD, never the live repo root |
| Risk | 4 findings claim shipped code missing from its referenced path | Fixing the doc without investigating could either paper over a real regression or delete a true "planned" claim by mistake | REQ-001: investigate (repo-wide search) before deciding implement-vs-correct-doc |
| Dependency | Xiaomi Direct API (`xiaomi/mimo-v2.5-pro-ultraspeed`) and OpenAI (`openai/gpt-5.5-fast`) providers configured on this machine | If either drops mid-run, dispatch fails | Provider pre-flight already confirmed both configured (`opencode providers list`) before this pass started |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: No latency target applies - this is a one-time documentation remediation pass, not a runtime feature.

### Security
- **NFR-S01**: No fix dispatch may run destructive shell commands (`rm`, `mv`, `git rm`, `find -delete`) - enforced via explicit prompt instruction per dispatch, not a runtime gate.

### Reliability
- **NFR-R01**: Every directory with a confirmed finding must reach an independently-verified fixed state before this pass is considered complete (achieved: 42/42).
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- A directory with zero confirmed findings and only unverified findings that don't reproduce: no edit made, logged as `skipped_not_reproduced`.
- A directory whose fix dispatch reports zero files changed despite having confirmed findings: treated as a failure requiring manual fix, not silently passed (this exact case occurred for 11 directories and was caught by cross-checking pipeline output against source findings).

### Error Scenarios
- Fix dispatch times out or errors: retried once with the verifier's specific feedback; if still failing, finished by direct manual edit.
- Investigation dispatch is flaky (transient provider error): retried with the identical command until a clean run completes (occurred once, for the `hybrid-search.ts` investigation).

### State Transitions
- Partial fix (top-level claim corrected, deeper sections still contradicting): caught by independent verification, not assumed complete from the fix dispatch's own report.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 20/25 | 63 files across 42 directories, spanning all 8 sibling phase parents of the packet |
| Risk | 15/25 | Live-tree edits mitigated by worktree isolation; no schema/API/breaking-change surface |
| Research | 15/20 | 4 code-gap investigations, each requiring repo-wide search and cross-referencing changelog/successor-phase evidence |
| **Total** | **50/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- For the 4 code-gap findings, does the claimed code exist under a renamed/moved path, or is it genuinely absent? (Answered per-item during Phase 1 investigation, recorded in each fix's evidence.)
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Source audit**: 10-dispatch GPT-5.5-fast (high) sweep across `../../000-release-cleanup/` through `../../005-dark-flag-graduation/` (findings enumerated in `tasks.md`)
- **Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
