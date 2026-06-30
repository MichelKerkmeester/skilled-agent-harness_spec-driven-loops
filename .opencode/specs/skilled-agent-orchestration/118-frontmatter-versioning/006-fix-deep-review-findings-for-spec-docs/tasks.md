---
title: "Tasks: Phase 6 — Fix Deep-Review Findings"
description: "The task breakdown for reconciling the MiMo + DeepSeek deep-review findings: spec.md counts, child continuity, plan/tasks population, the standard's reconcile note, engine hardening, and the final metadata refresh + validation."
trigger_phrases:
  - "fix deep review findings tasks"
  - "spec doc remediation tasks"
  - "metadata refresh tasks"
  - "continuity reconcile tasks"
  - "engine hardening tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/118-frontmatter-versioning/006-fix-deep-review-findings-for-spec-docs"
    last_updated_at: "2026-06-23T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Tracked the remediation tasks through to completion"
    next_safe_action: "Phase complete; commit the working tree when ready"
    blockers: []
    key_files:
      - ".opencode/specs/skilled-agent-orchestration/118-frontmatter-versioning/spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-006-fix-deep-review-findings-for-spec-docs"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Every deep-review finding maps to a task or an accepted-with-rationale note."
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 6 — Fix Deep-Review Findings

<!-- SPECKIT_LEVEL: 1 -->

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

- [x] T001 Correct parent spec.md counts to 2,222 / 457 / 1,753 (spec.md) — matches `frontmatter-version.mjs gate`
- [x] T002 Fix execution-model wording: engine sole writer, MiMo read-only audit (spec.md)
- [x] T003 Note the 4 three-part SKILL.md normalizations in the phase map (spec.md)
- [x] T004 [P] Reconcile child continuity completion_pct 0 -> 100 (00{1..5}/spec.md)
- [x] T005 [P] Replace scaffold recent_action / next_safe_action in child specs (00{1..5}/spec.md)
- [x] T006 Fix the `.ts` -> `.mjs` key_files reference (002-derivation-engine/spec.md)
- [x] T007 Populate the five child plan.md + tasks.md from impl-summaries (00{1..5}/{plan,tasks}.md)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T008 Document the SKILL.md reconcile exception (references/frontmatter_versioning.md)
- [x] T009 Remove the dead `trailing` variable (frontmatter-version.mjs) — engine tests 21/21
- [x] T010 Add the `node` PATH guard to the gate wrapper (check-frontmatter-versions.sh)
- [x] T011 Raise the git maxBuffer 64MB -> 256MB (frontmatter-version.mjs)
- [x] T012 Accept path-boundary + anchor-cache findings with rationale — no code change (low-risk / bounded by skill count)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T013 Backfill graph-metadata on parent + all 6 children (graph-metadata.json)
- [x] T014 generate-context for description + continuity (description.json)
- [x] T015 `validate.sh --strict` green on parent + all 6 children
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed (engine 21/21, gate exit 0, validate --strict exit 0)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
