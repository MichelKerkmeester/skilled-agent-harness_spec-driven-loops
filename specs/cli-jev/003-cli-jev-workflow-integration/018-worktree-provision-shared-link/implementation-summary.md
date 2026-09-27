---
title: "Implementation Summary"
description: "sk-git worktree provisioning now installs a package whose only dependencies are @spec-kit/* links, so sk-doc gets its @spec-kit/shared link. The fix and three harness assertions are verified, and the approved one-time repair gave this worktree its sk-doc link."
trigger_phrases:
  - "implementation summary"
  - "what shipped"
  - "validation evidence"
  - "continuation notes"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-jev/003-cli-jev-workflow-integration/018-worktree-provision-shared-link"
    last_updated_at: "2026-09-27T13:30:00Z"
    last_updated_by: "build-018"
    recent_action: "Recorded the approved sk-doc repair and closed the phase"
    next_safe_action: "None. The phase is closed; the orchestrator commits"
    blockers: []
    key_files:
      - ".skilled/skills/sk-git/scripts/worktree-naming.sh"
      - ".skilled/skills/sk-git/scripts/tests/worktree-naming.test.sh"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-018-worktree-provision-shared-link"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 018-worktree-provision-shared-link |
| **Status** | Complete |
| **Completed** | 2026-09-27 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

### Phase 18: worktree-provision-shared-link

Worktree provisioning no longer skips a package whose only dependencies are `@spec-kit/*` links. Before this change `_wn_deps_satisfied` dropped every `@spec-kit/` name and then treated an empty list as nothing to install, so `sk-doc`, which declares only `"@spec-kit/shared": "file:../system-spec-kit/shared"`, read as present in every new worktree and never got its link. Now the check falls back to the first declared name when none is outside `@spec-kit/`, and the existing `node_modules` walk decides. A package with any other dependency is still checked by that dependency, and a package that declares nothing stays satisfied.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/sk-git/scripts/worktree-naming.sh` | Modified | `:488-490` keeps every declared name, filters `@spec-kit/` out, and prints `names[0] \|\| all[0] \|\| ""`. `:478-480` states when a `@spec-kit/*` entry decides |
| `.skilled/skills/sk-git/scripts/tests/worktree-naming.test.sh` | Modified | Two fixtures (`spec-kit-only`, `spec-kit-and-real`), a stub `npm` that also makes `node_modules/@spec-kit/shared`, and three assertions |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The build took a baseline first (harness `PASS=80 FAIL=0`, and a read-only survey where all nine listed packages with a manifest read satisfied). It then changed the name choice and its comment, added the fixtures and assertions, and proved each assertion fails when its own behavior is reverted. The `sk-doc` repair is an install, so it waited for the operator's yes. After that yes on 2026-09-27, the orchestrator ran `bash .skilled/skills/sk-git/scripts/worktree-naming.sh provision` after the operator's yes on 2026-09-27. It printed `provisioning .skilled/skills/sk-doc (ci)` and `provisioned: 1 installed, 0 built, 8 already present, 0 failed`, exit 0. A second run printed `provisioned: 0 installed, 0 built, 9 already present, 0 failed`. The link `.skilled/skills/sk-doc/node_modules/@spec-kit/shared -> ../../../system-spec-kit/shared` resolves inside this worktree, and no tracked file changed. Rollback: `rm -rf .skilled/skills/sk-doc/node_modules`. Nothing was committed: the orchestrator commits.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Fall back to the first `@spec-kit/*` entry only when a package declares nothing else | A `@spec-kit/*` link beside a real dependency proves no install, so the filter keeps its purpose. The survey confirms `sk-doc` is the only listed package whose result changes |
| Keep the fallback inside the existing `node -e` call | No new process per package, and the walk, `provision_worktree` and the path list stay unchanged |
| Repair through the fixed `provision` rather than a link from the main checkout | `sk-git` rule 8 forbids a shared path that resolves back to the source checkout. The install makes a relative link inside this worktree |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `bash -n` on both files | Exit 0 on both |
| `shellcheck` on both files | Exit 1 on both, as at `HEAD`. 2 findings in the script and 11 in the harness before and after, and a line-number-free diff of the finding sets is empty, so the edit adds none |
| `bash .skilled/skills/sk-git/scripts/tests/worktree-naming.test.sh` | `worktree-naming tests: PASS=83 FAIL=0`, exit 0. Baseline `PASS=80 FAIL=0` |
| Revert only the name choice | `FAIL: spec-kit-only installs once across both runs (exp='1' got='0')`, `PASS=82 FAIL=1`, exit 1. Restored and confirmed with `cmp` |
| Remove only the filter / make an empty manifest unsatisfied | `FAIL: spec-kit-and-real installs although its link was present`, exit 1 / `FAIL: needs-build declares nothing and is never installed (exp='0' got='2')`, exit 1 |
| Read-only survey over the path list | Only `.skilled/skills/sk-doc` reads unsatisfied. The other eight packages with a manifest exit 0 |
| `git status --porcelain -- .skilled` | Only the two `sk-git` files. `worktree-provision-paths.txt` unchanged, `sk-doc` status empty |
| Comment hygiene search on the script | No match, exit 1. The same pattern matches 10 lines of this phase's `spec.md` |
| Repair: `worktree-naming.sh provision` (orchestrator-run) | `provisioned: 1 installed, 0 built, 8 already present, 0 failed`, exit 0. Second run `0 installed, 0 built, 9 already present, 0 failed` |
| Repair: link and hub check | `readlink` prints `../../../system-spec-kit/shared`, whose `pwd -P` is inside this worktree. `parent-skill-check.cjs .skilled/skills/sk-doc` prints `OK: parent-skill-check`, exit 0 (rerun by this build). The orchestrator also saw `OK` for `sk-design`, `cli-jev` and `system-deep-loop` |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Other checkouts are not repaired.** The two other worktrees without the link each need `worktree-naming.sh provision` once the fix is on their branch. That work is out of scope for this phase.
2. **A brand-new worktree is not proven.** Whether its provisioning builds `system-spec-kit/shared/dist` is UNKNOWN. `spec.md` section 10 records it as an open question.
3. **Both files already fail `shellcheck`** on lines this phase did not touch. Recorded for the `sk-git` owner, not fixed here.
<!-- /ANCHOR:limitations -->

---
