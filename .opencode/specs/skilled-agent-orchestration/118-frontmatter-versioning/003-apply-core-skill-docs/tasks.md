---
title: "Tasks: Phase 3: apply-core-skill-docs [template:level_1/tasks.md]"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "tasks"
  - "name"
  - "template"
  - "tasks core"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "scaffold/003-apply-core-skill-docs"
    last_updated_at: "2026-06-23T07:33:11Z"
    last_updated_by: "template-author"
    recent_action: "Initialize continuity block"
    next_safe_action: "Replace template defaults on first save"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/003-apply-core-skill-docs"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 3: apply-core-skill-docs

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

- [x] T001 Compute the full corpus once into a manifest, then scope the apply to core classes — Evidence: 2,222 files computed in 9.5 minutes; core slice applied with no further git.
- [x] T002 Confirm the read-only audit transport so the model stays out of the write path — Evidence: the deterministic engine does the writes; the model runs read-only after a documented write-incident.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Apply the computed version across SKILL.md, README, references, and assets from the manifest — Evidence: 457 core docs versioned (422 fresh inserts, 23 already correct).
- [x] T004 Normalize the 3-part SKILL.md files and reconcile stale ones to their changelog anchor — Evidence: four 3-part files canonicalized to 4-part; stale skills moved up to anchor.
- [x] T005 Skip frontmatter-less core docs instead of synthesizing a block — Evidence: 12 frontmatter-less docs skipped; the engine never synthesizes frontmatter.
- [x] T006 Fix the normalization skip bug that left a malformed 3-part value on disk — Evidence: apply now compares the raw value, so a 3-part value is no longer skip-equal'd after normalization.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T007 Run verify over the core classes — Evidence: PASS, exit 0, ok=457.
- [x] T008 Run gate over the core classes (after the normalization fix) — Evidence: PASS, exit 0, ok=457, 12 skipped.
- [x] T009 Run the unit suite with the added 3-part-normalization regression — Evidence: 21 of 21 pass.
- [x] T010 Run a read-only model audit of one skill's versioned docs — Evidence: asset, reference, and README values confirmed correct, 4-part, last-key, trigger array intact.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed (verify and gate exit 0; read-only audit confirmed)
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
