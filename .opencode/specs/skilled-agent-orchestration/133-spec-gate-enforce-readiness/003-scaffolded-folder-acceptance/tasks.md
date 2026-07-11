---
title: "Tasks: Scaffolded-folder acceptance for the spec-gate binding path"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "spec gate acceptance tasks"
  - "classifyIntent relaxed accept tasks"
  - "scaffolded folder test matrix"
  - "missing_metadata accept implementation"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/133-spec-gate-enforce-readiness/003-scaffolded-folder-acceptance"
    last_updated_at: "2026-07-11T11:05:57.515Z"
    last_updated_by: "spec-author"
    recent_action: "Broke the relaxed-accept fix into setup, implementation, and verification tasks"
    next_safe_action: "Execute T001-T003 setup and capture the green baseline"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/runtime/lib/spec-gate/spec-gate-core.mjs"
      - ".opencode/skills/system-spec-kit/runtime/lib/spec-gate/spec-gate-core.test.mjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/003-scaffolded-folder-acceptance"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: Scaffolded-folder acceptance for the spec-gate binding path

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

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

- [ ] T001 Re-read the `classifyIntent` `prior_answer` branch and `validateSpecFolderCandidate` to confirm the `missing_metadata` reason path and the `validation.path` payload (`spec-gate-core.mjs:501-516`, `gate-3-classifier.ts:543-566`)
- [ ] T002 Capture the baseline: run `node --test spec-gate-core.test.mjs` and confirm green before any change (`.opencode/skills/system-spec-kit/runtime/lib/spec-gate/spec-gate-core.test.mjs`)
- [ ] T003 [P] Inventory the status-enum and `validateSpecFolderBinding` consumers with `rg` to confirm Option A adds no new consumer surface (`.opencode/skills/system-spec-kit/runtime`, `.opencode/plugins/mk-spec-gate.js`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 In `classifyIntent`, add the relaxed accept: when the `prior_answer` binding validation returns `reason === 'missing_metadata'`, re-derive the folder absolute path from `validation.path`, `statSync` `spec.md`, and on presence persist `satisfied` with `boundSpecFolder` (source `prior_answer`) + `validatedResolvedPath` (`spec-gate-core.mjs`)
- [ ] T005 Preserve fail-open: wrap the added `statSync` so any throw falls through to the existing re-ask path, and keep the outer `try/catch` stale-state eviction intact (`spec-gate-core.mjs`)
- [ ] T006 Keep the relaxation scoped to `source:'prior_answer'` only; do not edit `validateSpecFolderBinding` or `applyGate3Satisfaction` (`spec-gate-core.mjs`, no edit to `gate-3-classifier.ts`)
- [ ] T007 Add a durable WHY comment for the relaxed accept with no artifact ids or spec paths, and confirm no stdout/stderr is introduced (`spec-gate-core.mjs`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T008 Add the happy-path test: scaffold `spec.md` only, answer "B, <folder>", assert `classifyIntent` returns `satisfied`, then assert a `Write` under enforce returns `allow` (`spec-gate-core.test.mjs`)
- [ ] T009 Add adversarial negatives: non-existent folder -> `open`; folder with `description.json` but no `spec.md` -> `open`; out-of-tree and traversal (`../`) -> `open` (`spec-gate-core.test.mjs`)
- [ ] T010 Add invariant tests: a deprecated folder carrying the full trio stays `open` (unchanged); `MK_SPEC_GATE_DISABLED=1` short-circuits; assert the core is the only relaxation site (prebound AUTONOMOUS path unaffected) (`spec-gate-core.test.mjs`)
- [ ] T011 Run the full suite `node --test spec-gate-core.test.mjs` and confirm green (`.opencode/skills/system-spec-kit/runtime/lib/spec-gate/spec-gate-core.test.mjs`)
- [ ] T012 Run `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <this-phase-folder> --strict` and confirm `Errors: 0`
- [ ] T013 Confirm `git status`/`git diff` shows no change to `gate-3-classifier.ts`, `shared/dist/`, or `mcp_server/` dist
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---

<!--
CORE TEMPLATE (~60 lines)
- Simple task tracking
- 3 phases: Setup, Implementation, Verification
- Add L2/L3 addendums for complexity
-->
