---
title: "Implementation Plan: Phase 7: rewrite command namespace rename"
description: "Plan to relocate the two trigger commands into a rewrite/ subfolder, drop the rewrite- prefix, and update the functional invocation references."
importance_tier: "supporting"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-communication/002-sk-communication-triggers/007-command-namespace-rename"
    last_updated_at: "2026-08-19T20:34:00.000Z"
    last_updated_by: "claude"
    recent_action: "Moved commands and updated references"
    next_safe_action: "Validate the packet recursively"
    blockers: []
    key_files:
      - ".opencode/commands/rewrite/response.md"
      - ".opencode/commands/rewrite/response-by-external-agent.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-007-command-namespace-rename"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 7: rewrite command namespace rename

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

Relocate the two shipped trigger commands into a `rewrite/` subfolder with `git mv`, drop the redundant `rewrite-` filename prefix, and update the invocation strings inside the commands, the `SKILL.md` trigger-command list, and the feature-catalog reference. No command behavior changes; this is a naming and location move that aligns the pair with the existing `folder/name.md → /folder:name` namespace convention.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

- Both command files exist at their new `rewrite/` paths and the flat paths are gone.
- A search for `/rewrite-response` over the command files, `SKILL.md`, and the feature-catalog returns nothing.
- Historical spec docs and phase-folder names are untouched.
- The packet validates recursively with no errors.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

The runtime resolves a command file at `.opencode/commands/<group>/<name>.md` as the slash command `/<group>:<name>`, the same way `.opencode/commands/deep/research.md` resolves to `/deep:research`. Moving `rewrite-response.md` to `rewrite/response.md` therefore changes its invocation from `/rewrite-response` to `/rewrite:response`, and the `-by-external-agent` command follows the same prefix swap. The only edits beyond the move are the invocation strings that name those commands: the self-referential examples inside each file, the two-line trigger list in `SKILL.md`, and one sentence in the feature-catalog.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Move and rename

- [x] Create `.opencode/commands/rewrite/` and `git mv` both command files into it, dropping the `rewrite-` prefix.

### Phase 2: Update references

- [x] Update the invocation strings inside both command files.
- [x] Update the `SKILL.md` trigger list and the feature-catalog reference.

### Phase 3: Verify

- [x] Confirm no functional surface references the old flat invocation and validate the packet recursively.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

- Structural: the new paths exist, the old paths are gone, and `git status` shows both moves as renames.
- Reference: a repo search for `/rewrite-response` over the functional surfaces returns nothing.
- Packet: `validate.sh` over the parent runs recursively with no errors.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- The two shipped trigger commands (phases 002 and 003) and the external-cli entrypoint (phase 006) that the second command invokes.
- The runtime's `folder/name.md → /folder:name` command-namespace convention.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

`git mv` the two files back to their flat paths and revert the reference edits. Because the change is a rename plus string edits with no behavior change, the revert is exact.
<!-- /ANCHOR:rollback -->
