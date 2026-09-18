---
title: "Tasks: Audit the agent behavior ruleset against six agent-avoidance anti-patterns and give the uncovered family one home"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "task breakdown"
  - "implementation tasks"
  - "verification checklist"
  - "task dependencies"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Audit the agent behavior ruleset against six agent-avoidance anti-patterns and give the uncovered family one home

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Audit

- [x] T001 Read `AGENTS.md`, `REPO RULES.md`, and all 12 `repo-rules/*.md` end-to-end [evidence: full-file reads this session; files listed in coverage map]
- [x] T002 Map each of the six pasted anti-patterns to its current home or gap [evidence: `spec.md` §3.5 coverage map, six rows with verdicts]
- [x] T003 Decide new-file vs amend-existing for the uncovered family [evidence: `spec.md` §3.5 root-family note + `plan.md` §3: one file, one home]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Author packet docs: spec.md, plan.md, tasks.md, acceptance-criteria.md [evidence: all four files authored with real content, no placeholders]
- [x] T005 Create `repo-rules/answer-the-actual-request.md` with six sections + house frontmatter + self-check [evidence: `grep -n '^## '` shows Fires when, The rule, §1–§6, what-this-is-not, self-check]
- [x] T006 Add trigger-table row and index row to `REPO RULES.md` [evidence: `grep -n 'answer-the-actual-request' "REPO RULES.md"` → hits at lines 47 and 67]
- [x] T007 Add the first-report-is-honest sentence to `evidence-and-proof.md` §10 [evidence: `grep -n 'interrogation'` → line 203]
- [x] T008 Write `implementation-summary.md` [evidence: file authored with verification table]
- [x] T013 Add the §8 routing sentence to `AGENTS.md` (amended in review: reply-facing trigger unreachable via Gate 5 on read-only turns) [evidence: `AGENTS.md:261`; negative control `git show HEAD:AGENTS.md` → 0]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Regenerate trigger index so Gate 1 surfaces this packet [evidence: `generate-trigger-index.mjs` exit 0; 27,278 docs, index sha256 e2707d78]
- [x] T010 Negative control: each net-new phrase absent pre-edit [evidence: `git show HEAD:"REPO RULES.md" | grep -c 'answer-the-actual-request'` → 0; `git show HEAD:repo-rules/evidence-and-proof.md | grep -c 'first report is the honest one'` → 0]
- [x] T011 Scoped diff review: only the declared files + index artifacts + packet changed [evidence: `git status --short` — `.claude/settings.json` modification is pre-existing/runtime-managed, unrelated; `AGENTS.md` +1/−1 added by T013]
- [x] T012 `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/agents/012-agent-avoidance-anti-patterns --strict` prints `RESULT: PASSED` [evidence: command output this session]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]` with evidence
- [x] No `[B]` blocked tasks remaining
- [x] `acceptance-criteria.md` rows all `Met`, `Waived` or `Superseded`
- [x] `validate.sh --strict` → `RESULT: PASSED`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Acceptance Criteria**: See `acceptance-criteria.md`
<!-- /ANCHOR:cross-refs -->

---

## Verification Checklist

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md [evidence: REQ-001..006 with coverage map]
- [x] CHK-002 [P0] Technical approach defined in plan.md [evidence: §3 components + affected surfaces]
- [x] CHK-003 [P1] Dependencies identified and available [evidence: plan.md §6 — all green]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Authoring Quality

- [x] CHK-010 [P0] New rule file follows house structure (frontmatter, Fires when, The rule, numbered sections, what-this-is-not, self-check) [evidence: `grep -n '^## '` on the file shows all sections]
- [x] CHK-011 [P0] No rule text duplicated between files — overlaps are cross-cites [evidence: new file §1→communication §3, §2→scope §1, §3→uncertainty §2, §5→decisions §4, §6→evidence §10]
- [x] CHK-012 [P1] `REPO RULES.md` rows match existing row grammar (action-verb triggers, "It settles" column) [evidence: lines 47, 67 match surrounding row shapes]
- [x] CHK-013 [P1] No ephemeral artifact ids inside rule prose [evidence: new file body contains no spec paths, REQ/CHK ids, or packet numbers]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met [evidence: `acceptance-criteria.md` rows AC-001..006 all `Met`]
- [x] CHK-021 [P0] `validate.sh --strict` → `RESULT: PASSED` [evidence: command output this session]
- [x] CHK-022 [P1] Trigger index regenerated; packet retrievable [evidence: generator exit 0; index sha256 e2707d78]
- [x] CHK-023 [P1] Negative control: new phrases absent in `git show HEAD:` versions [evidence: both greps → 0]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each of the six anti-patterns has a named home or explicit covered verdict in `spec.md` §3.5 [evidence: coverage map, six verdict rows]
- [x] CHK-FIX-002 [P0] Same-class inventory done: no existing rule file already owns the avoidance family [evidence: all 12 rule files read end-to-end; coverage map records nearest misses]
- [x] CHK-FIX-003 [P0] Router consumers enumerated: `REPO RULES.md` §2 and §3 are the only wiring needed [evidence: §4 scope unchanged — file fits existing "In" list]
- [x] CHK-FIX-005 [P1] Matrix axes listed: six anti-patterns → six sections/citations [evidence: spec.md §3.5 table + new-file sections]
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized [evidence: statuses all Complete; REQ/AC/task ids consistent across docs]
- [x] CHK-041 [P1] implementation-summary.md reconciles completion state with spec.md [evidence: completion_pct 100, key_files, verification table]
- [x] CHK-042 [P2] Open questions recorded for deferred items (uncertainty §2 enumeration, corpus widening, §12 self-check row) [evidence: spec.md §10]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] No scratch files left outside `scratch/` [evidence: packet contains only the authored docs + scaffolded dirs]
- [x] CHK-051 [P1] `git status --short` shows only declared files + index artifact + packet [evidence: scoped diff review; `.claude/settings.json` unrelated pre-existing change]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 9 | 9/9 |
| P1 Items | 10 | 10/10 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-09-18
<!-- /ANCHOR:summary -->

---

