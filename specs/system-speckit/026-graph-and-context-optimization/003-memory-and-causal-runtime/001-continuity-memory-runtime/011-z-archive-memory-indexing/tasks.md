---
title: "Tasks: 026/003/011 z_archive memory indexing"
description: "Numbered execution checklist for un-exclusion fix + doc/test propagation."
trigger_phrases:
  - "026/003/011 tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/003-memory-and-causal-runtime/001-continuity-memory-runtime/011-z-archive-memory-indexing"
    last_updated_at: "2026-05-16T13:25:00Z"
    last_updated_by: "main_agent"
    recent_action: "Authored tasks.md"
    next_safe_action: "Mark all complete + memory save"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000113002"
      session_id: "113-tasks"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: 026/003/011 z_archive memory indexing

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## 1. TASK NOTATION

- `[x]` = completed
- `[ ]` = pending
- Per-task atomic commit
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## 2. PHASE 1: SETUP

- [x] T1.1: Scaffold packet 113 (spec.md)
- [x] T1.2: Inspect ARCHIVE_MULTIPLIERS decay system
- [x] T1.3: Confirm operator intent (z_archive un-exclude only)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## 3. PHASE 2: IMPLEMENTATION

### W1 — Source fix
- [x] T2.1: Edit `lib/utils/index-scope.ts` (remove z_archive)
- [x] T2.2: `npm run build` — rebuild dist
- [x] T2.3: Run `cli.js reindex --force` — populate z_archive (2618 rows)

### W2 — Deep-research propagation audit
- [x] T2.4: Phase 1 parallel Explore agents (3 agents, 14 baseline hits)
- [x] T2.5: cli-devin SWE-1.6 5-iter deep-research loop (converged iter-5)
- [x] T2.6: Synthesize research.md + remediation-plan.tsv

### W3 — Apply remediation
- [x] T2.7: Fix BREAKING tests (index-scope.vitest.ts + full-spec-doc-indexing.vitest.ts)
- [x] T2.8: Update STALE-INVARIANT docs (010-memory-indexer-invariants — 5 files)
- [x] T2.9: Update STALE-DESCRIPTIVE drift (doctor_update.yaml + memory-save.ts)
- [x] T2.10: Author SSOT section in `lib/utils/README.md`
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## 4. PHASE 3: VERIFICATION

- [x] T3.1: vitest exit 0 on 2 target files (159 tests pass)
- [x] T3.2: z_archive row count ≥ 2618 (DB query)
- [x] T3.3: `getArchiveMultiplier('/z_archive/')` returns 0.1
- [x] T3.4: strict-validate packet 113 exit 0 (after this commit)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## 5. COMPLETION CRITERIA

- All 6 commits land on main (b062b12b4 + 12302d853 + 3909f8202 + 296e64b2d + aaf509797 + 58e3f3646)
- Tests pass
- Memory rows present
- Decay intact
- Strict-validate passes
- Memory entry saved for future sessions
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## 6. CROSS-REFERENCES

- spec.md — feature spec
- plan.md — sequenced plan
- implementation-summary.md — post-execution actuals
- research/research.md — cli-devin deep-research synthesis
- research/remediation-plan.tsv — TSV consumed by W3
- 010-memory-indexer-invariants/ — the historical packet that introduced the redundant exclusion
- packet 111 — workflow pattern reused (atomic commits, evidence dir)
<!-- /ANCHOR:cross-refs -->
