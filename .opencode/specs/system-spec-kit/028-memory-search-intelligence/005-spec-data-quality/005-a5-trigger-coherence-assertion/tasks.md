---
title: "Tasks: A5 Trigger Coherence Assertion [template:level_2/tasks.md]"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "trigger phrases coherence"
  - "cross-surface assertion"
  - "subset coherence"
  - "description.json triggers"
  - "graph-metadata derived"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/005-spec-data-quality/005-a5-trigger-coherence-assertion"
    last_updated_at: "2026-06-21T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Authored phase task breakdown for A5 trigger coherence scaffold"
    next_safe_action: "Hold for implementation, no task has started yet"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/scripts/rules/check-trigger-coherence.sh"
      - ".opencode/skills/system-spec-kit/scripts/lib/validator-registry.json"
      - ".opencode/skills/system-spec-kit/scripts/extractors/spec-folder-extractor.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "markdown-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: A5 Trigger Coherence Assertion

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

- [ ] T001 Read the normalization order at lines 387-390 and capture case-fold, trim, dedupe, slice 12 (`.opencode/skills/system-spec-kit/scripts/extractors/spec-folder-extractor.ts`)
- [ ] T002 Sample live folders to confirm the derived trigger key, checking `graph-metadata.derived.trigger_phrases` and any legacy variant that needs a fallback read
- [ ] T003 [P] Pick the parse path for spec.md frontmatter, `description.json`, and `graph-metadata.json`, matching how existing rule scripts read those files
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Author the rule to read the three surfaces and build three normalized trigger sets (`.opencode/skills/system-spec-kit/scripts/rules/check-trigger-coherence.sh`)
- [ ] T005 Implement the subset comparison so an indexed or derived phrase absent from the curated frontmatter set emits a warn finding naming that phrase (`.opencode/skills/system-spec-kit/scripts/rules/check-trigger-coherence.sh`)
- [ ] T006 Treat a missing or empty surface as no-data so absent surfaces never report divergence (`.opencode/skills/system-spec-kit/scripts/rules/check-trigger-coherence.sh`)
- [ ] T007 Register the rule at `severity: warn` next to the description and graph-metadata shape rules (`.opencode/skills/system-spec-kit/scripts/lib/validator-registry.json`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T008 Confirm a crafted fixture with an indexed or derived trigger absent from frontmatter emits a warn finding, and a capped 12-entry derived subset against 15 frontmatter triggers reports no finding
- [ ] T009 Confirm a fixture lacking the derived surface reports no coherence finding for that surface, and a case-only difference normalizes away
- [ ] T010 Run a dry pass across the live spec corpus and confirm exit non-error with current divergences listed as warn findings
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
