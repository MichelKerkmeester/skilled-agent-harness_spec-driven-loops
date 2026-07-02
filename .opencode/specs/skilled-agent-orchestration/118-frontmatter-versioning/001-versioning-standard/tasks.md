---
title: "Tasks: Phase 1 - Versioning Standard"
description: "Completed tasks for the frontmatter versioning standard, sk-doc template updates, create-command generator output, and validator format checks."
trigger_phrases:
  - "versioning standard tasks"
  - "phase 1 version tasks"
  - "sk-doc version field tasks"
  - "frontmatter validator tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/118-frontmatter-versioning/001-versioning-standard"
    last_updated_at: "2026-07-02T05:45:00Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Replaced scaffold frontmatter with completed phase tasks"
    next_safe_action: "Run recursive strict validation"
    blockers: []
    key_files:
      - ".opencode/skills/sk-doc/references/frontmatter_versioning.md"
      - ".opencode/skills/sk-doc/assets/frontmatter_templates.md"
      - ".opencode/skills/sk-doc/scripts/quick_validate.py"
      - ".opencode/skills/sk-doc/scripts/package_skill.py"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "remediated-001-versioning-standard-tasks"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Version is 4-part X.Y.Z.W; missing-version enforcement is deferred to phase 5."
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 1 - Versioning Standard

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

- [x] T001 Read the existing frontmatter template contract and both validators to extend, not rewrite — Evidence: changes were additive; permissive parsers left untouched.
- [x] T002 Lock the `X.Y.Z.W` format and the staged-enforcement decision (format-check now, require later) — Evidence: recorded as a key decision to avoid turning ~2,500 docs red at once.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Author the versioning standard reference (format, changelog-anchored derivation, numstat-gated build segment, rollout) — Evidence: reference created as the single source of truth.
- [x] T004 Add `version` to the frontmatter contract field tables, templates, and validation rules — Evidence: contract modified; version listed as required for SKILL.md and skill reference/asset docs.
- [x] T005 [P] Place `version: 1.0.0.0` in the nine template example blocks (skill, reference, asset, parent-hub, readme, feature-catalog, testing-playbook, snippets) — Evidence: grep found 15 keys, no leftover 3-part in skill docs.
- [x] T006 Make the skill generator emit a `version` line so new docs are born versioned — Evidence: generated SKILL.md emits version.
- [x] T007 Add a 4-part format-check to the quick validator and the packaging validator (validate when present; absence allowed) — Evidence: 3-part `1.0.0` rejected with "must be 4-part X.Y.Z.W"; 4-part `1.0.0.0` accepted.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Compile both validators and confirm reject/accept behavior — Evidence: `py_compile` PASS on both; 3-part rejected, 4-part accepted.
- [x] T009 Run validator suites and the real sk-doc doc; move the format-check fixture to 4-part — Evidence: quick-validate fixture 5/5, package-regressions exit 0, validator 11/11, sk-doc still valid (version 1.5.0.0).
- [x] T010 Confirm the nine templates carry the version example with no leftover 3-part in skill docs — Evidence: 15 version keys present; the four 3-part SKILL.md files are left for phase 3 normalization (expected, surfaces real work).
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed (validators format-check; templates and generator emit version)
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
