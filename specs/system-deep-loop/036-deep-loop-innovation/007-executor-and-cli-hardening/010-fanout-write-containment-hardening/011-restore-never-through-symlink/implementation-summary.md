---
title: "Implementation Summary"
description: "A baseline restore never writes through a symlink at the violated path; the refusal is recorded and the lane's outcome is unchanged."
trigger_phrases:
  - "implementation summary"
  - "what shipped"
  - "validation evidence"
  - "continuation notes"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/007-executor-and-cli-hardening/010-fanout-write-containment-hardening/011-restore-never-through-symlink"
    last_updated_at: "2026-09-14T17:44:16Z"
    last_updated_by: "claude-fable-5-1"
    recent_action: "Guarded the baseline restore against symlinks and filled the packet docs"
    next_safe_action: "Commit once the full suite exits zero"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-011-restore-never-through-symlink"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 011-restore-never-through-symlink |
| **Completed** | 2026-09-14 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## 2. WHAT WAS BUILT

The opt-in restore no longer writes through a symlink. In `runtime/lib/deep-loop/write-containment.ts` the baseline write branch of `revertOutOfScopeViolations` checks the violated path with lstat first; a symlink is left exactly as the lane set it, the action is recorded as `preserved_in_head` with `ok: true` and a `reason` naming the link, and no bytes are written. The path stays a violation on the event, so the lane's outcome is unchanged. The HEAD restore path needed no guard because `git checkout` replaces the link itself.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

One dispatch to DeepSeek V4.1 Flash at max through the gateway on cli-pi. The link test was run against the unmodified restore first, where the outside file was overwritten through the link, and a negative control against the HEAD module in a scratch copy reproduced the same. The orchestrator reviewed the diff and ran the whole suite before committing.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Record the refusal as preserved with a reason | The path stays a violation; the operator sees why nothing was written |
| Leave the HEAD path unguarded | git checkout replaces the link, confirmed, so a guard there would be dead code |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Link test against unmodified restore | FAIL as expected: outside target overwritten |
| Both touched test files plus typecheck | PASS, exit 0, 214 tests |
| Full deep-loop suite | `npm test` in the runtime: 152 files, 151 passed and 1 failed, 2611 tests passed; the one failure is another session's untracked cli-hermes adapter test still in progress, unrelated to this change; the containment and fan-out files passed (214 tests), typecheck exit 0 |
| `validate.sh --strict` on this phase | RESULT: PASSED |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Scope.** Only the baseline write branch changed; the containment finding for a symlinked path is unchanged.
<!-- /ANCHOR:limitations -->

---


