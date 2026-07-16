---
title: "Tasks: Launcher EPERM Parity Fix"
description: "Task list for 009 EPERM parity patch."
trigger_phrases:
  - "009 tasks"
importance_tier: "useful"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/006-mcp-launcher-concurrency/009-launcher-eperm-parity-fix"
    last_updated_at: "2026-05-18T00:00:00Z"
    last_updated_by: "claude"
    recent_action: "All tasks complete"
    next_safe_action: "Commit + push"
    blockers: []
---
# Tasks: Launcher EPERM Parity Fix

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## 1. TASK NOTATION

- `[x]` complete; `[ ]` pending; `[!]` blocker
- 3 phases: setup, implementation, verification
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## 2. PHASE 1: SETUP

- [x] **T001** Read RCA at `<arc>/005-cross-cutting-quality/005-cocoindex-install-hygiene/scratch/mcp-disconnect-rca.md`
- [x] **T002** Read skill-advisor reference at `mk-skill-advisor-launcher.cjs:171-180`
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## 3. PHASE 2: IMPLEMENTATION

- [x] **T003** Add `if (error.code === 'EPERM') return { held: true, ... };` in `mk-spec-memory-launcher.cjs:137`
- [x] **T004** Add identical branch in `mk-code-index-launcher.cjs:171`
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## 4. PHASE 3: VERIFICATION

- [x] **T005** `node --check .opencode/bin/mk-spec-memory-launcher.cjs` → exit 0
- [x] **T006** `node --check .opencode/bin/mk-code-index-launcher.cjs` → exit 0
- [x] **T007** Grep confirms `016/006/009.*EPERM` comment landed in both files
- [x] **T008** `validate.sh <009> --strict` → PASSED
- [x] **T009** Commit + push on main
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## 5. COMPLETION CRITERIA

All 9 tasks complete. No deferred work. Single commit on `main` per arc convention.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## 6. CROSS-REFERENCES

- Spec: `spec.md`
- Plan: `plan.md`
- Implementation summary: `implementation-summary.md`
- Predecessor: `../007-skill-advisor-zombie-launcher-fix/`
- RCA: `<arc>/005-cross-cutting-quality/005-cocoindex-install-hygiene/scratch/mcp-disconnect-rca.md`
<!-- /ANCHOR:cross-refs -->
