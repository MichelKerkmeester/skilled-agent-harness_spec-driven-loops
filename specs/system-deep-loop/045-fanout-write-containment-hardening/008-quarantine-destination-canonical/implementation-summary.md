---
title: "Implementation Summary"
description: "The quarantine writer canonicalizes every destination and refuses symlinked components, so a lane cannot redirect the runner's evidence writes."
trigger_phrases:
  - "implementation summary"
  - "what shipped"
  - "validation evidence"
  - "continuation notes"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/045-fanout-write-containment-hardening/008-quarantine-destination-canonical"
    last_updated_at: "2026-09-14T17:44:14Z"
    last_updated_by: "claude-fable-5-1"
    recent_action: "Canonicalized the quarantine destination and filled the packet docs"
    next_safe_action: "Commit once the full suite exits zero"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-008-quarantine-destination-canonical"
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
| **Spec Folder** | 008-quarantine-destination-canonical |
| **Completed** | 2026-09-14 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## 2. WHAT WAS BUILT

The quarantine writer in `runtime/lib/deep-loop/write-containment.ts` no longer writes through a symlink. `quarantineDestinationRefusal` resolves the deepest existing ancestor of each destination with realpath, requires it beneath the real artifact directory, and refuses any component below that root which lstat reports as a link; every mkdir and write in the writer calls it first, and refusals are collected on the quarantine result as `refused` entries instead of thrown. A lane that plants a link at its quarantine path now gets nothing written at the link's target, the result names the refusal, and its verdict is unchanged.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

One dispatch to DeepSeek V4.1 Flash at max through the gateway on cli-pi. The three new tests were run against the unmodified writer first, where the guard's own record appeared at the link's target. The delegate's first full run of its gate hit a test another session was editing concurrently in `fanout-run.vitest.ts`; by the next run that test had changed under it and the gate was green. The orchestrator reviewed the diff and ran the whole suite before committing.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Refuse any link below the root, even one resolving inside | A link is a redirection the lane controls; where it points today is not where it points tomorrow |
| Record refusals rather than throw | The writer must never fail the lane it documents |
| Compare real paths for the root itself | An artifact root that is a symlink is legitimate; only components below it are the lane's to plant |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Three new tests against the unmodified writer | FAIL as expected: the record appeared at the link's target |
| Both touched test files plus typecheck | PASS, exit 0, 208 tests |
| Full deep-loop suite | `npm test` in the runtime: 151 files, 145 passed and 6 failed, 2580 tests passed; all six failures are the cli-adapter manifest-integrity cases asserting allAdapterBound after another session added a cli-hermes executor kind to the matrix manifest at 19:46 mid-run; none imports the changed paths, the containment and fan-out files passed (208 tests), typecheck exit 0; the whole suite is rerun before the next phase |
| `validate.sh --strict` on this phase | RESULT: PASSED |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Concurrent edits.** Another session was editing the runtime's fan-out tests during this phase; the suite result records the tree as it stood.
<!-- /ANCHOR:limitations -->

---


