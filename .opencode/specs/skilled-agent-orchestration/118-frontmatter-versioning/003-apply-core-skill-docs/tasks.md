---
title: "Tasks: Phase 3 - Apply Core Skill Docs"
description: "Completed tasks for applying computed versions to core skill docs, normalizing SKILL.md files, fixing the normalization regression, and verifying the core slice."
trigger_phrases:
  - "apply core skill docs tasks"
  - "SKILL.md version normalize tasks"
  - "core docs verify tasks"
  - "manifest core apply tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/118-frontmatter-versioning/003-apply-core-skill-docs"
    last_updated_at: "2026-07-02T05:45:00Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Replaced scaffold frontmatter with completed phase tasks"
    next_safe_action: "Run recursive strict validation"
    blockers: []
    key_files:
      - ".opencode/skills/sk-doc/scripts/frontmatter-version.mjs"
      - ".opencode/skills/*/SKILL.md"
      - ".opencode/skills/*/README.md"
      - ".opencode/skills/*/references"
      - ".opencode/skills/*/assets"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "remediated-003-apply-core-skill-docs-tasks"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "MiMo audits read-only; the deterministic engine writes and verifies every result."
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 3 - Apply Core Skill Docs

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
