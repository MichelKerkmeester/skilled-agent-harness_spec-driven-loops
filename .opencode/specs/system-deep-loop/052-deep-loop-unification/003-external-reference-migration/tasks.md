---
title: "Tasks: External Reference Migration"
description: "Task ledger for the dependency-ordered migration of every deep-loop-workflows/deep-loop-runtime reference to system-deep-loop."
trigger_phrases:
  - "external reference migration tasks"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/052-deep-loop-unification/003-external-reference-migration"
    last_updated_at: "2026-07-08T00:00:00Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Authored task ledger, not yet executed"
    next_safe_action: "Wait for 002 to land, then execute T001"
    blockers:
      - "Depends on 002-hub-rename-and-runtime-nesting landing first"
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "deep-loop-unification-052-003-scaffold"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: External Reference Migration

<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

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

- [B] T001 Capture Stage-A baseline: scoped `rg` inventory + `score-routing-corpus.py` accuracy numbers. Blocked on 002 landing.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T002 Stage B: consume the physical move; drop temporary compat symlinks.
- [ ] T003 Stage C.1-C.7: hardcoded code constants (`skill_advisor.py`, `aliases.ts`, `explicit.ts`, `mk-deep-loop-guard.js`, `parent-skill-check.cjs`, contract-compiler scripts, pre-commit+CI pair).
- [ ] T004 Stage D: structured identity fields + `--emit-routing-projection` codegen + drift-guard test path.
- [ ] T005 Stage E: source YAML `skill:` fields + router `.md` one-liners + regenerate compiled contracts.
- [ ] T006 [P] Stage F: `.opencode/agents/**` + `.claude/agents/**` (per-file scoped verification, not blanket diff).
- [ ] T007 [P] Stage F: READMEs (root + 6 others) + `system-spec-kit` constitutional doc/references + cross-skill prose.
- [ ] T008 Stage G: sibling `graph-metadata.json` edges (5+ skills), collapsing dual edges to one.
- [ ] T009 Stage H: grandfather-example files with the prefix-exception caveat.
- [ ] T010 Stage I: advisor corpus field-scoped label rename + divergence ledger manual re-approve.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T011 Stage J.1: residual-grep sweep clean.
- [ ] T012 Stage J.2: `parent-skill-check.cjs` self-check passes.
- [ ] T013 Stage J.3: advisor codegen clean + drift-guard passes.
- [ ] T014 Stage J.4: contract-compile determinism confirmed.
- [ ] T015 Stage J.5: routing-accuracy re-baseline holds.
- [ ] T016 Stage J.6: divergence ratchet suite passes.
- [ ] T017 Stage J.7-10: agent-mirror sync, doctor skill-graph rebuild, CI parity, full vitest.
- [ ] T018 Stage J.11: `create:skill-parent` smoke check.
- [ ] T019 Remove temporary compat symlinks.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`.
- [ ] No `[B]` blocked tasks remaining.
- [ ] `validate.sh --strict` exits 0 for this folder.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Parent**: `../spec.md`
<!-- /ANCHOR:cross-refs -->
