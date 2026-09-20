---
title: "Implementation Summary"
description: "Every byte-moving operation in the containment guard is contained against symlinked components at every level, with no-follow opens and the check-then-create window closed."
trigger_phrases:
  - "implementation summary"
  - "what shipped"
  - "validation evidence"
  - "continuation notes"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/007-executor-and-cli-hardening/010-fanout-write-containment-hardening/015-symlink-contained-paths"
    last_updated_at: "2026-09-15T00:02:08Z"
    last_updated_by: "claude-fable-5-1"
    recent_action: "Contained every guard path against symlinks and filled the packet docs"
    next_safe_action: "Commit once the full suite exits zero"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-015-symlink-contained-paths"
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
| **Spec Folder** | 015-symlink-contained-paths |
| **Completed** | 2026-09-15 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## 2. WHAT WAS BUILT

No byte the containment guard moves can be redirected by a symlink any more. `runtime/lib/deep-loop/write-containment.ts` gained one helper set: `pathRefusal` resolves a path's parent with realpath, requires it beneath the owning root and refuses any symlinked component at or below it, never following the final component; `ensureContainedDirectory` creates directories level by level and re-reads each level it creates; `openContainedRead` and `openContainedWrite` open with the kernel no-follow flag, claiming new files exclusively and replacing captures in place. Baseline capture and read, patch capture, the quarantine pass directory and its record writes, the content copy, and both restore writes all go through them, and the earlier quarantine-only refusal is subsumed. Four tests prove each gap: a symlinked parent on restore, a symlinked component on a baseline path, a symlinked component inside the baseline store, and a link swapped in between the quarantine check and its create.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

One dispatch to DeepSeek V4.1 Flash at max through the gateway on cli-pi, briefed with the three findings both review lanes agreed on. All four tests were run against the unmodified module first, each failing on its own gap. The race case needed a file-level fs mock that delegates to the real module and fires only there, because ESM namespaces cannot be spied. The orchestrator reviewed the diff and ran the whole suite before committing.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Contain every component, not only the last | A link anywhere above the file redirects the write exactly as one at the file does |
| Re-check on create and open with no-follow | A check the create does not repeat is a window; the kernel flag closes it where available |
| Leave the two existence probes and the log append alone | They move no bytes, detection semantics are frozen, and the log path is the caller's |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Four new tests against unmodified module | FAIL as expected, one gap each |
| Both touched test files plus typecheck | PASS, exit 0, 224 tests |
| Stress runner case with capture roots | PASS |
| Full deep-loop suite | `npm test` in the runtime: 152 files, 2623 passed, 8 skipped, exit 0, 1229 s |
| `validate.sh --strict` on this phase | RESULT: PASSED |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Reason on baseline entries.** A refused capture is marked as truncated; the entry carries no reason field, an additive change left for a later pass.
2. **Windows.** The kernel no-follow flag is a no-op there; the component walk alone stands.
<!-- /ANCHOR:limitations -->

---


