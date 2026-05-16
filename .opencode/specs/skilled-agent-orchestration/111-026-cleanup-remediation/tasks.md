---
title: "111: Tasks — 026 cleanup remediation"
description: "Numbered execution checklist for Wave 3, mapped 1:1 to plan.md sub-waves."
trigger_phrases:
  - "111 tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/111-026-cleanup-remediation"
    last_updated_at: "2026-05-16T09:00:00Z"
    last_updated_by: "main_agent"
    recent_action: "Authored tasks.md"
    next_safe_action: "Capture baselines, dispatch W3.A"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000113"
      session_id: "111-tasks-scaffold"
      parent_session_id: null
    completion_pct: 5
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# 111: Tasks — 026 cleanup remediation

<!-- SPECKIT_LEVEL: 1 -->

---

## Phase 0 — Scaffold

- [x] T0.1: Create `.opencode/specs/skilled-agent-orchestration/111-026-cleanup-remediation/`
- [x] T0.2: Author L1 docs (spec/plan/tasks/impl-summary)
- [ ] T0.3: Author description.json + graph-metadata.json
- [ ] T0.4: Capture BASE_111 baseline
- [ ] T0.5: Commit scaffold on main

## Phase W3.A — Author 33 sub-phase base files (cli-devin × 11)

- [ ] T3A.1: Dispatch 11 parallel cli-devin SWE-1.6 agents
- [ ] T3A.2: For each: commit 3 files per sub-phase
- [ ] T3A.3: `validate_document.py` exit 0 on all 33

## Phase W3.B — Renumber 86 sub-phase children

- [ ] T3B.1: 000/001-release-readiness — 6 renumbers
- [ ] T3B.2: 000/002-audit — 8 renumbers (two-pass for `008` dup)
- [ ] T3B.3: 000/003-cleanup — 31 renumbers (two-pass for `006` dup)
- [ ] T3B.4: 000/004-followup-post-program — 4 renumbers
- [ ] T3B.5: 000/005-stress-test — 7 renumbers
- [ ] T3B.6: 000/006-research — 4 renumbers
- [ ] T3B.7: 008/001-skill-graph — 7 renumbers
- [ ] T3B.8: 008/002-scorer — 8 renumbers
- [ ] T3B.9: 008/003-router — 5 renumbers
- [ ] T3B.10: 008/004-hardening — 4 renumbers
- [ ] T3B.11: 008/005-docs — 2 renumbers

## Phase W3.C — Renumber 22 children in 007/013/014

- [ ] T3C.1: Pre-flight snapshot 014's 55 children → `evidence/pre-flight-014-children.txt`
- [ ] T3C.2: 007-code-graph — 16 renumbers
- [ ] T3C.3: 013-doctor-update-orchestrator — 3 renumbers
- [ ] T3C.4: 014-local-embeddings-migration — 3 gap-fix renumbers

## Phase W3.D — Resolve 014 dup-prefix pairs (2 ops)

- [ ] T3D.1: 026-dup pair resolution + provenance
- [ ] T3D.2: 040-dup pair resolution + provenance

## Phase W3.E — Verbose name cleanup

- [ ] T3E.1: Dispatch cli-devin scorer → `evidence/proposed-renames.md`
- [ ] T3E.2: Apply approved renames (~25)

## Phase W3.F — Parent-doc sync

- [ ] T3F.1: Dispatch cli-devin parent-sync agent
- [ ] T3F.2: Verify children_ids match filesystem for 17 parents

## Phase W3.G — Final validation gate

- [ ] T3G.1: `validate_document.py` on 111 + 33 + 17
- [ ] T3G.2: `validate.sh 026 --strict` exit 0
- [ ] T3G.3: Orphan-ref check = 0
- [ ] T3G.4: Backfill implementation-summary.md
- [ ] T3G.5: Final commit + memory save
