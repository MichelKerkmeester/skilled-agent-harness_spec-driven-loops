---
title: "Tasks: Packet Identity Cleanup"
description: "Task list for old-packet-name cleanup and native lock removal."
trigger_phrases:
  - "packet identity cleanup tasks"
importance_tier: "medium"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "deep-loops/030-agent-loops-improved/009-research-backlog-remediation/005-packet-identity-cleanup"
    last_updated_at: "2026-07-01T07:40:00Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Authored tasks"
    next_safe_action: "Dispatch implementation to MiMo v2.5 ultraspeed via cli-opencode"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sonnet-009-remediation"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: Packet Identity Cleanup

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

`[x]` complete, `[ ]` pending.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 `grep -rln "123-agent-loops-improved\|156-agent-loops-improved"` under `030-agent-loops-improved/` — real count was much larger than the original 16-file estimate once logs/iterations/changelogs were included (~166 raw hits); scoped the audit to the files that could plausibly carry a live navigational reference (all phase-parent `spec.md` files)
- [x] T002 Read each candidate in context; classified LIVE vs HISTORICAL with reasoning (see implementation-summary.md for the full per-file table). The dispatch initially found 3 files with old-name hits in metadata table fields (001, 002, 003) and 4 more with old-name hits in "Phase Context" prose (004-007) it judged out of its own literal write-scope; this orchestrating session re-classified those 4 as LIVE too (present-tense self-description of the current phase's identity, not historical narration) and fixed them directly
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Fixed all LIVE hits: navigational table fields in `001-reference-research`, `002-deep-loop-runtime`, `003-deep-loop-workflows` (dispatch); Phase Context prose in `004-system-spec-kit` through `007-testing`, plus 3 more Out-of-Scope/Open-Questions/frontmatter mentions in `001-reference-research` and `002-deep-loop-runtime` found by a follow-up sweep (this orchestrating session) — all now read `deep-loops/030-agent-loops-improved`
- [x] T004 Left every HISTORICAL hit unchanged (changelogs, `timeline.md`, `impl-logs/*.log`, `.run-logs/*.log`, `research/lineages/**`, `review/lineages/glm/**` — confirmed via diff that none of these were touched)
- [x] T005 Deleted `review/lineages/native/.deep-review.lock` (confirmed gone: `native/` no longer exists at its original path)
- [x] T006 Archived `review/lineages/native/` to `review/lineages_archive/native-abandoned-20260630/` (date corrected to match the lock's actual `started_at_iso`, 2026-06-30, not the dispatch date); confirmed all 8 original entries preserved (`.executor-state/`, `deep-review-config.json`, `deep-review-findings-registry.json`, `deep-review-state.jsonl`, `deep-review-strategy.md`, `deltas/`, `iterations/`, `prompts/`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T007 Re-grepped repo-wide for old-name hits in `spec.md` files: **0 remain** anywhere in the packet outside `research_archive/` and this child's own planning docs (which legitimately discuss the old names as historical context)
- [x] T008 Ran `validate.sh` on all 7 touched phase-parent folders (001-007): each parent-level entry **passes cleanly (0 errors)** after regenerating `graph-metadata.json` to clear the source-fingerprint mismatch the spec.md edits caused. Pre-existing `SOURCE_FINGERPRINT_MISMATCH` on nested leaf children (confirmed present even in files this child never touched) is unrelated packet-wide staleness, out of this child's scope, already tracked by sibling children 004/006/007
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

All 8 tasks complete; classification documented (7 LIVE files fixed, all HISTORICAL files confirmed untouched); zero LIVE-field old-name hits remain anywhere in the packet; native lock removed and lineage archived to `review/lineages_archive/native-abandoned-20260630/`; validate.sh clean on all 7 touched phase-parents.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- Spec: `./spec.md` · Plan: `./plan.md` · Implementation summary: `./implementation-summary.md`
- Source findings: `../../research/research_archive/20260701T071133Z-gen1/research.md` §4.2 (F-011, F-007)
<!-- /ANCHOR:cross-refs -->
