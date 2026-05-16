---
title: "Implementation Plan: 008 mk-spec-memory stress test"
description: "4-phase plan: baseline, 39-tool sweep, 345-scenario sweep, z_archive revalidation. Executed by a future session per handover.md."
trigger_phrases:
  - "008 plan"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-stress-test/008-mk-spec-memory-stress-test"
    last_updated_at: "2026-05-16T14:30:00Z"
    last_updated_by: "main_agent"
    recent_action: "Patched component count 24→25 with heavy-category split note"
    next_safe_action: "Future session executes per handover.md"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000008002"
      session_id: "008-plan"
      parent_session_id: null
    completion_pct: 5
    open_questions: []
    answered_questions: []
---
# Implementation Plan: 008 mk-spec-memory stress test

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| Executor | cli-devin SWE-1.6 paired (2 concurrent) |
| Storage | `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-stress-test/008-mk-spec-memory-stress-test/` |
| Output | `evidence/tool-sweep.jsonl` + `evidence/playbook-results.jsonl` |
| Testing | Real handler calls (not mocked). Playbook execution policy enforced. |

### Overview

Stress test all 39 mk-spec-memory tools + all 345 manual_testing_playbook scenarios. Pickup via `handover.md`. Baseline state captured post packet 113 z_archive un-exclusion (commit b062b12b4).
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Packet 113 shipped (z_archive un-exclusion)
- [x] 2618 z_archive rows indexed
- [x] handover.md authored
- [ ] Pre-sweep checkpoint created

### Definition of Done
- [ ] Phase 1: 39 tools all have JSONL rows
- [ ] Phase 2: 345 scenarios all have JSONL rows
- [ ] Phase 3: z_archive PARTIALs reclassified
- [ ] Phase 4: aggregated report in implementation-summary.md
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Paired-parallel cli-devin dispatch with JSONL-aggregated results, single-source-of-truth scope guarded by pre-sweep checkpoint.

### Key Components
- 39 prompt files (one per tool) for Phase 1.
- 25 prompt files (one per playbook category dir; `14--pipeline-architecture` and `14--stress-testing` share the `14--` prefix) for Phase 2. Heavy categories may split into sub-batches (cat 16 = 55 scenarios → ~3 batches).
- `evidence/agent-config-008.json` — cli-devin recipe with allow-list for Write to `evidence/`.

### Data Flow
Prompt → cli-devin → real handler call → JSONL row → aggregate → synthesis.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

See `handover.md` §3 for the 4-phase flow (baseline → 39-tool sweep → 345-scenario sweep → z_archive revalidation → synthesis).
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

- Every scenario MUST be executed for real (playbook policy)
- Classifications: PASS / FAIL / SKIP / UNAUTOMATABLE / PARTIAL
- z_archive row count must hold ≥ 2618 throughout
- Decay multiplier 0.1 must hold throughout
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- Packet 113 (z_archive un-exclusion) — must be in HEAD ancestry
- cli-devin v1.0.4.1 recipe
- 39 mk-spec-memory tool surface in `.claude/mcp.json`
- 345-scenario playbook under `.opencode/skills/system-spec-kit/manual_testing_playbook/`
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

`checkpoint_restore` from the `pre-008-sweep-<UTC>` checkpoint created in Phase 0 reverts any DB mutations from the sweep. Generated evidence files are append-only and can be discarded; the underlying DB state restores cleanly.
<!-- /ANCHOR:rollback -->
