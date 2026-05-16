---
title: "Tasks: 008 mk-spec-memory stress test"
description: "Numbered execution checklist mapped to handover.md 4-phase flow."
trigger_phrases:
  - "008 tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-stress-test/008-mk-spec-memory-stress-test"
    last_updated_at: "2026-05-16T14:47:00Z"
    last_updated_by: "main_agent"
    recent_action: "Phase 0 complete: baseline 5/5 PASS + global checkpoint"
    next_safe_action: "Scaffold evidence/ subdir + agent-config-008.json then dispatch Phase 1"
    blockers: []
    key_files:
      - "handover.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000008003"
      session_id: "008-tasks"
      parent_session_id: null
    completion_pct: 25
    open_questions: []
    answered_questions: []
---
# Tasks: 008 mk-spec-memory stress test

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## 1. TASK NOTATION

- `[x]` = completed
- `[ ]` = pending
- Per-row atomic commit for any mutation surfaced
- Paired-parallel cli-devin dispatch (2 concurrent)
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## 2. PHASE 1: SETUP

### Baseline
- [x] T0.1: Verify git HEAD includes packet 113 commits — 7/8 listed hits in ancestry (956595dbd, 58e3f3646, aaf509797, 296e64b2d, 3909f8202, 12302d853, b062b12b4); `280fe4888` subject is "config:" so grep missed but commit is present; bonus `37daeb8cb 113 W4: backfill...` also in ancestry
- [x] T0.2: `cli.js stats` shows ≥ 11201 memories, schema v27 — actual: 11426 memories, schema v27
- [x] T0.3: z_archive row count ≥ 2618 in `memory_index` — actual: 2786 (+168 ambient growth since handover authored; handover §2 explicitly allows "give or take")
- [x] T0.4: `getArchiveMultiplier('/foo/z_archive/bar')` returns 0.1 — actual: 0.1
- [x] T0.5: vitest 159/159 on the 2 targeted files — actual: 159/159 passed in 732ms
- [x] T0.6: `checkpoint_create` named `pre-008-sweep-<UTC>` — created `pre-008-sweep-20260516T144620Z` (id=2, global scope, 11426 memories, 124 MB snapshot at 2026-05-16T14:46:52Z)

### 39-tool inventory sweep
- [ ] T1.1: Generate 39 cli-devin prompts (one per mk-spec-memory tool)
- [ ] T1.2: Dispatch paired-parallel (2 concurrent × 20 batches)
- [ ] T1.3: Verify every tool has a row in `evidence/tool-sweep.jsonl`
- [ ] T1.4: Commit Phase 1 evidence
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## 3. PHASE 2: IMPLEMENTATION

### 345-scenario playbook sweep
- [ ] T2.1: Generate 25 category prompts (cat 16 with 55 scenarios → ~3 sub-batches; cats 13/14-pipeline near 30 may need 2)
- [ ] T2.2: Dispatch paired-parallel
- [ ] T2.3: Verify every scenario has a row in `evidence/playbook-results.jsonl`
- [ ] T2.4: Commit Phase 2 evidence

### z_archive revalidation
- [ ] T2.5: Filter PARTIAL rows that cite z_archive impact
- [ ] T2.6: Reclassify each to PASS or FAIL with packet 113 attribution
- [ ] T2.7: Commit Phase 3 reclassifications
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## 4. PHASE 3: VERIFICATION

> Maps to handover.md Phase 4 (synthesis).

- [ ] T3.1: Aggregate totals (PASS / FAIL / SKIP / UNAUTOMATABLE / PARTIAL)
- [ ] T3.2: Per-category breakdown table
- [ ] T3.3: z_archive impact summary
- [ ] T3.4: Backfill implementation-summary.md
- [ ] T3.5: strict-validate 008 packet exit 0
- [ ] T3.6: z_archive row count + decay multiplier re-verified post-sweep
- [ ] T3.7: Memory save via `/memory:save`
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## 5. COMPLETION CRITERIA

- 39 tool rows + 345 scenario rows in evidence/
- Aggregated PASS ratio ≥ 80% (target)
- All FAILs documented with reproduction
- Follow-on packet list generated for genuine regressions
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## 6. CROSS-REFERENCES

- handover.md — primary entry point for new session
- spec.md — scope + requirements
- Packet 113 — predecessor (z_archive un-exclusion)
- Packet 111 — workflow precedent (paired-parallel cli-devin dispatch)
- Manual testing playbook root: `.opencode/skills/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md`
- cli-devin recipe: `.opencode/skills/cli-devin/assets/agent-config-deep-research-iter.json`
<!-- /ANCHOR:cross-refs -->
