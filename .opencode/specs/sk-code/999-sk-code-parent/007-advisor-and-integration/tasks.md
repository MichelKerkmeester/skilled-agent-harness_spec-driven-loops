---
title: "Tasks: Phase 7 — advisor and integration"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "sk-code advisor integration tasks"
  - "sk-code reference repoint tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/124-sk-code-parent/007-advisor-and-integration"
    last_updated_at: "2026-07-04T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Documented completed repoint + advisor-integration tasks"
    next_safe_action: "phase 008 routing-benchmark-and-review"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "bootstrap-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 7 — advisor and integration

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
## Phase 1: Setup
- [x] T001 Repoint definitely-broken `sk-code-review/` path loads; evidence: deep-review agent (`.opencode` + `.claude`; `.codex` symlink), deep-loop `prompt_pack_iteration.md.tmpl`, and `check-rule-copies.js` → `review_core.md`/TARGETS now under `sk-code/code-review/`.
- [x] T002 Confirm the 004 external-reference regression; evidence: `.opencode/hooks/pre-commit` `CHECKER` pointed at deleted `sk-code/scripts/check-comment-hygiene.sh` (moved to `code-quality/scripts/`) — the pre-commit hygiene gate had been silently skipping.
- [x] T003 Extract ground-truth rename maps; evidence: 128 pairs from 004 commit + 42 from 005 + explicit code-review SKILL.md/README.md mappings (005 delete+add).
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation
- [x] T004 Build the deterministic repointer; evidence: exact-file + derived single-destination directory mappings, longest-match, on-disk target validation, dry-run default (`scratchpad/repoint-007.py`).
- [x] T005 Dry-run and de-risk; evidence: 77 files / 225 replacements; excluded JS/TS test fixtures (synthetic assertions) and `changelog/`/`specs/` archives; kept real-file consumers (`check-rule-copies.test.sh`).
- [x] T006 Apply the sweep; evidence: 77 files repointed; load-bearing pre-commit `CHECKER`, `.claude/settings.json` PostToolUse, CI workflows, and hub key_files now resolve.
- [x] T007 Integrate the hub advisor node; evidence: removed 2 dangling `sk-code-review` edges (enhances/siblings), absorbed `deep-loop-workflows` prerequisite, merged review `domains` (review/audit/security/quality-gate/merge-readiness/findings) + `intent_signals`, kept alias trigger-phrase.
- [x] T008 Fix `check-rule-copies.test.sh` `REPO_ROOT` depth; evidence: `../../../..` → `../../../../..` for the deeper `sk-code/code-review/scripts/` location.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification
- [x] T009 Residual grep; evidence: 0 live broken references to old flat `sk-code/{refs,assets,scripts}/` or `sk-code-review/` paths; the only 2 remaining are the intentional `zzz-fake-surface` validator test fixture; deleted `graph-metadata.json` left unmapped by design.
- [x] T010 Load-bearing resolution; evidence: pre-commit `CHECKER`, `.claude/settings.json` hook, CI workflow paths, and hub graph-metadata key_files all point at existing files.
- [x] T011 Advisor node integrity; evidence: hub `graph-metadata.json` valid JSON, review keywords merged, 0 `sk-code-review` edges, `deep-loop-workflows` prerequisite present, alias trigger-phrase retained.
- [x] T012 Confirm deferrals; evidence: advisor rebuild + memory reindex staged for main (not run in worktree); alias-covered NAME references deferred to 009.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria
- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] References repaired and advisor node integrated; phase 008 routing-benchmark-and-review is the next safe action
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References
- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Summary**: See `implementation-summary.md`
<!-- /ANCHOR:cross-refs -->
