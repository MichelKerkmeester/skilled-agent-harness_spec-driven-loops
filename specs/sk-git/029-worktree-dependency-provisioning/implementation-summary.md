---
title: "Implementation Summary"
description: "Creating a worktree now installs the nine dependency trees it needs, because an unprovisioned one failed in ways that read as broken code."
trigger_phrases:
  - "implementation summary"
  - "what shipped"
  - "validation evidence"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-git/029-worktree-dependency-provisioning"
    last_updated_at: "2026-09-11T00:00:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Shipped the provision step and proved it end to end"
    next_safe_action: "None outstanding"
    blockers: []
    key_files:
      - ".opencode/skills/sk-git/scripts/worktree-naming.sh"
      - ".opencode/skills/sk-git/scripts/worktree-provision-paths.txt"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-11-skgit-029"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 029-worktree-dependency-provisioning |
| **Status** | Complete |
| **Completed** | 2026-09-11 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Creating a worktree now installs what it needs to build. Before this, the
documented command allocated a number, checked out eighty thousand files, and
handed back a tree that could not compile, test, or pass its own commit gates.

The evidence came from using it. Provisioning one worktree by hand surfaced six
levels of missing dependencies, and the two worst were silent: `npm ci` fails in
a package with no lockfile, the build script's `&&` chain stops after its first
step, and the whole thing exits 0 having compiled nothing. A caller reading the
exit code concludes the build succeeded.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `scripts/worktree-provision-paths.txt` | Created | The nine packages a worktree needs, as data rather than code |
| `scripts/worktree-naming.sh` | Modified | `provision` subcommand; `create` calls it unless `--no-provision` |
| `SKILL.md` | Modified | Rule 8 already named this problem and now names the fix |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The step installs rather than symlinks, skips a package whose dependencies are
already reachable, and reports every outcome. Deciding "already installed" took
three attempts, and the first two were wrong in instructive ways.

Checking for a local `node_modules` fails because a workspace member never gets
one: npm hoists its packages to the workspace root. Calling `require.resolve` on
the first dependency fails for two further reasons, both real here: a package
whose `exports` map has no root entry is unresolvable by name even when
installed, and a hoisted dependency resolves from a different directory than the
one that declared it. What works is walking the `node_modules` chain the way
Node does, bounded at the worktree root, looking for the directory.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Install rather than symlink | A package's `node_modules` carries relative workspace self-links that resolve back to where they were created. Symlinking one made a build fail against another checkout's older type definitions while this tree's source was correct |
| Provision by default | The failure mode is silent. A command that hands back an unusable tree and says nothing is worse than one that takes longer |
| Keep the list as data | It sits beside the remote-branch allowlist, which is the same shape. Both consumers can read one copy |
| Leave the launch wrapper alone | It symlinks where this installs. Pointing it at this list would extend symlinking to trees where that silently builds against another checkout, which is the defect being fixed |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `bash -n` on the allocator | PASS |
| `provision` on a partly-provisioned worktree | PASS. 3 installed, 6 present, 0 failed; chose `install` for the lockfile-less packages and `ci` for the rest |
| `provision` re-run | PASS. `0 installed, 9 already present, 0 failed`, exit 0 |
| `create` end to end | PASS. Allocated, checked out, then 5 installed and 4 satisfied by hoisting from packages installed earlier in the same run |
| Build in the created worktree, no manual install | PASS. `dist/runtime/advisor-server.js` produced, not merely exit 0 |
| CLI in the created worktree | PASS. Nine commands |
| Throwaway removed | PASS. Worktree and branch deleted |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **`create` now takes minutes rather than seconds.** Installing nine trees is
   the cost of handing back something usable. `--no-provision` returns the old
   behaviour for a caller who only wants the branch.
2. **The list is maintained by hand.** A package added to the repository does
   not appear here on its own. A missing entry fails the same loud way it does
   today rather than a silent one, which is the property worth keeping.
3. **The build script that exits 0 having compiled nothing is untouched.** That
   defect belongs to the package that owns the script. This packet records it;
   the provision step removes the condition that triggered it most often.
<!-- /ANCHOR:limitations -->
