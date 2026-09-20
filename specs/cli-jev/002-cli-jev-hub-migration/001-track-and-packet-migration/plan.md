---
title: "Implementation Plan: Phase 1: track-and-packet-migration"
description: "Move the cli-jev creation packet to a new track root, author the track metadata no scaffolder writes, repair the derived facts the move invalidates, and repoint every live citation before any later phase can cite the new home."
trigger_phrases:
  - "implementation plan"
  - "technical approach"
  - "architecture decisions"
  - "testing strategy"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-jev/002-cli-jev-hub-migration/001-track-and-packet-migration"
    last_updated_at: "2026-09-20T13:20:00Z"
    last_updated_by: "claude-fable-5-1"
    recent_action: "Plan authored at closeout, mirroring the executed move"
    next_safe_action: "None; the phase is complete"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-cli-jev-002-001-track-and-packet-migration"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 1: track-and-packet-migration

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown and JSON spec documents moved with git; Node.js ESM toolchain for the repair and generation steps |
| **Framework** | system-spec-kit validators (`validate.sh`, `repair-derived.cjs`, `sweep-track-roots.mjs`) and the retrieval generators |
| **Storage** | Repository filesystem; git index carries the rename |
| **Testing** | The recursive strict gate, a zero-hit reference census, and the track-root sweep |

### Overview
The packet moves with `git mv` so the rename is recorded and no document body changes in the move itself. The target track gets hand-authored metadata because the scaffolder writes packet folders only. After the move, the sanctioned derived-fact repair pass runs, then every live citation of the old path is repointed in one ordered pass, and the two generated retrieval surfaces are regenerated rather than patched.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All acceptance criteria met
- [x] Tests passing (if applicable)
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
In-place move with derived-fact repair. The move is atomic at the folder level, the metadata repair follows the move, and the regeneration steps run last so they derive from the final location.

### Key Components
- **`git mv` of the packet folder**: records the rename and preserves per-file history, nothing else.
- **Track root metadata (`description.json`, `graph-metadata.json`)**: hand-authored, because track roots are spec-less directories the scaffolder does not write.
- **`repair-derived.cjs --roots specs/cli-jev --apply`**: rewrites recorded folder names, packet pointers, declared levels and generated-metadata fingerprints, and refuses authored facts by design.
- **Ordered citation substitution**: one pass over live trees for the four string forms of the old path (specs-prefixed, track-prefixed, quoted `parentChain`, bare folder plus slash), touching the moved packet, the skill-side docs and the generated surfaces.
- **Blessed regenerators**: the trigger index and the retrieval fixtures are rebuilt from the final tree so they cannot carry the retired path.

### Data Flow
`git mv` → hand-fixed packet metadata (description `specFolder`/`parentChain`, goal and acceptance-criteria pointers) → `repair-derived --apply` (pointers and generated metadata) → ordered citation rewrite → regenerate trigger index and retrieval fixtures → recursive strict gate → zero-hit census.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

No unit tests apply: the change moves documents and metadata. Verification is the recursive strict gate on both packets (six folders each), a repo-wide census for the old path, the track-root sweep, and a re-run of the derived report to prove it has nothing left to repair.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- Phase 002 depends on this phase: the hub scaffold and the mode move cite the packet at its new home.
- The derived repair depends on the hand-fixed packet metadata, because the tool refuses to write authored fields.
- The retrieval regeneration depends on the citation rewrite, because it derives from the final document bodies.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Re-run `git mv specs/cli-jev/001-cli-jev-creation specs/cli-external-orchestration/074-cli-jev-creation`, re-run `repair-derived.cjs --roots specs/cli-external-orchestration --apply`, and re-apply the citation substitutions in reverse. The program packet's own citations of the moved history would need the same reverse pass.
<!-- /ANCHOR:rollback -->

---
