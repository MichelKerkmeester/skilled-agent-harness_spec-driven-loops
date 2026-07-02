---
title: "Tasks: Phase 2 - Derivation Engine"
description: "Completed tasks for the deterministic frontmatter-version engine, including anchor resolution, numstat-gated edit counts, line-wise insertion, manifests, and verification modes."
trigger_phrases:
  - "derivation engine tasks"
  - "frontmatter version engine tasks"
  - "numstat gated tasks"
  - "version manifest tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/118-frontmatter-versioning/002-derivation-engine"
    last_updated_at: "2026-07-02T05:45:00Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Replaced scaffold frontmatter with completed phase tasks"
    next_safe_action: "Run recursive strict validation"
    blockers: []
    key_files:
      - ".opencode/skills/sk-doc/scripts/frontmatter-version.mjs"
      - ".opencode/skills/sk-doc/scripts/tests/test_frontmatter_version.mjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "remediated-002-derivation-engine-tasks"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "The engine is deterministic; MiMo is not in the compute path."
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 2 - Derivation Engine

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

- [x] T001 Pick the engine home and the self-contained ES-module form (no build step) — Evidence: a TypeScript dist pipeline was judged dead weight for plain sk-doc scripts.
- [x] T002 Build the fixture harness with a skills-root test hook over an isolated tree — Evidence: harness builds an isolated skills tree covering every frontmatter variant and runs the real command.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Implement the anchor resolver (higher of frontmatter and changelog) with 3-part normalization — Evidence: frontmatter 2.1.0 plus changelog 2.3.0.0 reconciles to 2.3.0.0.
- [x] T004 Implement the child-version formula (skill major and minor, zero patch, build segment) — Evidence: a live-skill reference dry-ran to a 4-part version off the skill anchor.
- [x] T005 Implement the numstat-gated edit counter (one git call per file; drop zero-line commits) — Evidence: a reference with a raw count of 31 drops the one true zero-line rename commit to 30.
- [x] T006 Implement line-wise insertion as the last key, never re-serializing YAML — Evidence: version inserted as last key with the multi-line trigger array intact.
- [x] T007 Implement compute, apply, and verify modes with a CSV plus JSON manifest — Evidence: compute emits a dry-run manifest; verify confirms value and last-key position.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Run the fixture harness across all frontmatter variants — Evidence: 21 of 21 assertions pass (5-field, 2-field, no-frontmatter, already-versioned, 3-part handled).
- [x] T009 Confirm idempotency, skip-equal, skip-conflict, and the update override — Evidence: a second apply is a byte-level no-op; skip and update paths pass.
- [x] T010 Dry-run on a live skill against real git history — Evidence: SKILL.md and a reference resolved to expected 4-part values across the in-scope file set, anchor taken as the higher of frontmatter and changelog.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed (engine dry-runs correctly; idempotent apply confirmed)
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
