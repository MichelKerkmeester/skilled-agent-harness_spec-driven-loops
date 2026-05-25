---
title: "Tasks: Remove remaining post-014-deprecation coco/ccc/rerank residue across non-code-graph surfaces [template:level_2/tasks.md]"
description: "Task Format: T### [P?] Description (file path) — one task per surface + grep/tsc/vitest gates"
trigger_phrases:
  - "cross-surface residue tasks"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/014-deprecate-coco-index/015-remediate-cross-surface-residue"
    last_updated_at: "2026-05-25T16:10:00Z"
    last_updated_by: "main-agent"
    recent_action: "All surface tasks complete; gates green"
    next_safe_action: "Validate and commit"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "remediate-cross-surface-residue-001"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Remove remaining post-014-deprecation coco/ccc/rerank residue across non-code-graph surfaces

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

- [x] T001 Re-verify the 6 findings against current reality + classify the sweep's extra hits (keep cli-* pkill, fixtures, accurate prose)
- [x] T002 Investigate nuanced surfaces (allowlist live?, hook's real check, manage ccc route, harness rules)
- [x] T003 Create Level-2 packet on main
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 [P] `.gemini/GEMINI.md` — coco routing → canonical HYBRID (code-graph + Grep)
- [x] T005 [P] `.gitignore` — remove `.cocoindex_code/`
- [x] T006 [P] `.opencode/bin/lib/sidecar-env-allowlist.cjs` — remove dead `RERANK_` prefix (file kept — live embedder allowlist)
- [x] T007 [P] `250-session-start-startup.md` — `.venv/bin/ccc` (×3) → "code-graph readiness"
- [x] T008 advisor `skill-graph.json` — tracked `scripts/` copy confirmed clean; gitignored `database/` runtime copy synced
- [x] T009 `/memory:manage` manage.md — remove ccc from description/argument-hint/validate/error/purpose/action/instructions/routing-tree; remove CCC MODE §17; renumber §18→17, §19→18; remove CCC error row
- [x] T010 `process-memory-harness.ts` — remove cocoindex-daemon/cocoindex-mcp/rerank-sidecar rules, `ccc-daemon` type + classify branch, `isCccProcess`, deleted-skill owner paths, `RERANK_SIDECAR_OWNER_TOKEN`, coco/rerank fixtures
- [x] T011 `process-memory-harness.vitest.ts` — drop coco/rerank fixture lines; re-point assertions to code-graph (2002); fix `expectedDaemonCount`; fix live pid-lock pid
- [x] T012 `process-sweep.vitest.ts` — re-point "preserves sidecar" test to ollama; remove "preserves ccc daemons" test
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T013 Per-target grep gate: all 7 surfaces == 0
- [x] T014 `tsc -p scripts/tsconfig.json` 0 errors; `process-memory-harness` + `process-sweep` vitests 20/20 green
- [ ] T015 `validate.sh <packet> --strict`; reconcile packet docs; commit
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Grep gate 0 + tsc/vitest green + validate clean
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Source of findings**: `../013-post-deprecation-deep-review/` + this-session daemon-kill check
- **Sibling**: `../014-remediate-codegraph-naming/` (code-graph doc residue)
<!-- /ANCHOR:cross-refs -->
