---
title: "Implementation Summary: Delete the sk-design hub and interface commands"
description: "Delete complete: the sk-design judgment hub (328 deletions) and the interface command namespace (8 deletions) were removed as one scoped, git-tracked destructive change after the extraction survivor was proven detached and green. Fully reversible while uncommitted; external-reference reconcile deferred to phase 006."
trigger_phrases:
  - "delete sk-design hub summary"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-design/016-deprecate-sk-design-interface/005-delete-hub-and-interface-commands"
    last_updated_at: "2026-08-19T12:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Deleted hub (328) + interface commands (8); survivor green; scoped"
    next_safe_action: "Phase 006: repo-wide reference cleanup and reconcile"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/"
      - ".opencode/commands/interface/"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-author-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---

# Implementation Summary: Delete the sk-design hub and interface commands

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Status** | Complete |
| **Level** | 1 |
| **Mutation Class** | destructive (operator-gated delete; git-tracked, reversible until commit) |
| **Executor** | main agent, in-context |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The retired design *judgment* surface was removed, leaving the extraction survivor as the entire design footprint:

- **Hub deleted** — `.opencode/skills/sk-design/` (328 tracked deletions): the parent hub wrapper, the `sk-design-interface` direction/taste mode, the retired foundations/motion/audit modes, `shared/`, `benchmark/`, and the styles remnants that did not move with the survivor.
- **Commands deleted** — `.opencode/commands/interface/` (8 tracked deletions): `design.md`, `design-reference.md`, and their auto/confirm/presentation assets.
- **Preserved** — the standalone `sk-design-md-generator/` survivor and its `styles/` corpus are untouched; the `design-reference` capability continues to resolve through its `/design:` rebind (done in a prior phase, before this delete).

Total scoped deletion: 336 files across the two in-scope trees.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The delete honored the **extraction-before-deletion invariant**: it ran only after 002–004 were verified green (survivor moved, rewired, standalone identity added, condensed design-knowledge folded), the survivor's backend suite passed 173/173, Class-S passed on the new root, and a grep proved no reference inside the survivor still pointed at `skills/sk-design/` or `../shared`. The removal is a pure git-tracked deletion of exactly two trees — no adjacent file was rewritten — so the change is a clean, reversible diff. External references that named the hub are intentionally *not* touched here; they are inventoried and reconciled in phase 006 so this phase does exactly one thing.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

- **One reversible action per phase.** The delete and the external-reference reconcile were split (005 vs 006) so the destructive step is a self-contained, easily-reviewed, easily-reverted diff rather than tangled with dozens of edits across the repo.
- **Scope lock against concurrent work.** A concurrent session's dirty work (`sk-code-mobile-cli/**`, `runtime/database/*`) was present in the checkout during this program; it is explicitly excluded from this phase's scope and from the eventual commit. The delete touches only `.opencode/skills/sk-design/**` and `.opencode/commands/interface/**`.
- **Rebind before delete.** `/interface:design-reference` was rebound to `/design:design-reference` in a prior phase, so removing `commands/interface/` drops no capability the survivor still exposes.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

- `test -d .opencode/skills/sk-design` → absent; `test -d .opencode/commands/interface` → absent.
- `git status --porcelain` deletions: 328 under `.opencode/skills/sk-design/`, 8 under `.opencode/commands/interface/` (336 total for this phase).
- Survivor intact: `sk-design-md-generator/SKILL.md` present; `/design:` command directory present; a grep from the survivor for `skills/sk-design/` returns nothing.
- Scoped: no non-sk-design, non-interface file is deleted by this phase.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

- This phase deletes only. Every *external* live reference that named the hub (advisor graph, command bridges, tests, cross-skill docs) is reconciled in phase 006 — until 006 lands, the deletion alone would leave stranded references, which is why the two phases ship together.
- Fully reversible while uncommitted (`git checkout -- .opencode/skills/sk-design .opencode/commands/interface`). Nothing committed or pushed.
<!-- /ANCHOR:limitations -->
