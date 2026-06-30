---
title: "Tasks: 111 026 cleanup remediation"
description: "Numbered execution checklist for Wave 3 sub-waves W3.A through W3.G."
trigger_phrases:
  - "111 tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/z_archive/090-base-files-renumbering-name-cleanup"
    last_updated_at: "2026-05-16T11:30:00Z"
    last_updated_by: "main_agent"
    recent_action: "Rewrote tasks.md against canonical L1 template"
    next_safe_action: "Final validation gate"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000113"
      session_id: "111-tasks-rewrite"
      parent_session_id: null
    completion_pct: 95
    open_questions: []
    answered_questions: []
---
# Tasks: 111 026 cleanup remediation

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## 1. TASK NOTATION

- `[x]` = completed
- `[ ]` = pending
- TID prefix per phase (T0/T3A/T3B/.../T3G)
- Per-rename atomic commit means one logical operation per git commit.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## 2. PHASE 1: SETUP

- [x] T0.1: Create `.opencode/specs/skilled-agent-orchestration/z_archive/090-base-files-renumbering-name-cleanup/`
- [x] T0.2: Author 6 L1 docs (spec/plan/tasks/impl-summary/description/graph-metadata)
- [x] T0.3: Capture BASE_111 baseline + commit scaffold
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## 3. PHASE 2: IMPLEMENTATION

### W3.A — Author 33 base files (cli-devin × 11)
- [x] T3A.1: Generate 11 prompt files
- [x] T3A.2: Dispatch 10 sub-phases in pairs + 1 solo
- [x] T3A.3: Validate per-sub-phase output + commit 11 atomic

### W3.B — Renumber 86 sub-phase children
- [x] T3B.1: Generate rename plan TSV (85 renames after skip-same)
- [x] T3B.2: Apply renames atomically (per-rename: rg + sed + git mv + commit)

### W3.C — Renumber 22 children in 007/013/014
- [x] T3C.1: Generate rename plans (20 single-pass for 007/013, 12 two-pass for 014)
- [x] T3C.2: Apply 007 + 013 single-pass (20 commits)

### W3.D — Resolve 014 dup-prefix pairs
- [x] T3D.1: Pass-A: rename to `_NNN-` temp (12 commits, alphabetic sort for dups)
- [x] T3D.2: Pass-B: strip underscore (12 commits)

### W3.E — Verbose name cleanup
- [x] T3E.1: Build list of 88 active verbose names
- [x] T3E.2: Dispatch cli-devin scorer (proposed-renames.md output)
- [x] T3E.3: Apply 14 main-agent-approved renames atomically

### W3.F — Sync 17 phase-parent docs
- [x] T3F.1: Dispatch cli-devin for 13 parents (sub-phases + grandparents)
- [x] T3F.2: Main agent syncs 4 remaining parents (007/013/014/root) via jq
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## 4. PHASE 3: VERIFICATION

### W3.G — Final validation gate
- [ ] T3G.1: `validate.sh --strict --recursive` on 026 phase parent (exit 0)
- [ ] T3G.2: `validate.sh --strict` on packet 111 (exit 0)
- [ ] T3G.3: Orphan-ref check returns 0
- [ ] T3G.4: Backfill implementation-summary.md
- [ ] T3G.5: Memory save via `/memory:save`
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## 5. COMPLETION CRITERIA

- All 7 sub-waves complete with their commits on main.
- strict-validate exit 0 on packet 111.
- strict-validate exit 0 on 026 phase parent.
- 0 orphan references for any renamed name on active surface.
- implementation-summary.md backfilled with actuals.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## 6. CROSS-REFERENCES

- spec.md — feature specification, scope, requirements.
- plan.md — sequenced execution waves.
- evidence/ — proposed-renames.md, agent-configs, per-wave baselines, 014 dup resolution.
- 107 packet — Wave 1 execution.
- 109 packet — Wave 2 execution.
- 998 packet — research backing the restructure.
- cli-devin SKILL.md — recipe + dispatch contract.
<!-- /ANCHOR:cross-refs -->
