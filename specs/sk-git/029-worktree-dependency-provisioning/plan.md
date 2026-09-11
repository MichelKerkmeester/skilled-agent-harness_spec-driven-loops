---
title: "Implementation Plan: A New Worktree Should Be Able To Build"
description: "One shared path list, a provision step that installs, and create calling it by default."
trigger_phrases:
  - "worktree provisioning plan"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-git/029-worktree-dependency-provisioning"
    last_updated_at: "2026-09-11T00:00:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Authored the plan"
    next_safe_action: "Implement phase 1"
    blockers: []
    key_files:
      - ".opencode/skills/sk-git/scripts/worktree-naming.sh"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-11-skgit-029"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: A New Worktree Should Be Able To Build

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

Move the provisioned path list into one data file, add a `provision` subcommand
that installs those paths into a worktree, and have `create` call it unless the
caller opts out.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

- `bash -n` clean on both changed scripts.
- A worktree created by `create` builds and runs a suite with no manual install.
- `provision` re-run on a provisioned worktree exits 0 and changes nothing.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

The list is data, not code, so it lives beside `remote-branch-allowlist.txt`
where sk-git already keeps a list of this shape. Both the allocator and the
launch wrapper read it, which is what stops them drifting apart. The wrapper
keeps its own sharing mechanism for the paths it shares; the allocator installs.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

**Phase 1 — the list.** Extract the paths into
`scripts/worktree-provision-paths.txt`, covering all six levels found in
practice rather than the five the wrapper carried.

**Phase 2 — the step.** Add `provision <dir>` to the allocator: for each listed
package, install when its dependency tree is absent, skip when present, report
each outcome, and exit non-zero if any install failed.

**Phase 3 — the default.** `create` provisions what it made and prints where it
went. `--no-provision` returns the old behaviour.

**Phase 4 — the record.** State in sk-git why provisioning installs rather than
symlinks, since the symlink shortcut is the obvious move and it silently builds
against another checkout.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Create a throwaway worktree through `create`, build one package in it, and run
one suite. Then re-run `provision` and confirm it is a no-op. Remove the
worktree afterwards.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

None beyond npm, which every listed package already requires.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Both changes are additive to two shell scripts. Reverting the commit restores
the previous behaviour; no state is migrated and nothing on disk needs undoing.
<!-- /ANCHOR:rollback -->
