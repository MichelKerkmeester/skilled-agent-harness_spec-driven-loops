---
title: "Implementation Summary"
description: "A neighbour's new file no longer halts a fan-out lane under preserve; the guard records it as an advisory and the lane's verdict stands."
trigger_phrases:
  - "implementation summary"
  - "what shipped"
  - "validation evidence"
  - "continuation notes"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/007-executor-and-cli-hardening/010-fanout-write-containment-hardening/001-never-fatal-untracked"
    last_updated_at: "2026-09-14T09:08:59Z"
    last_updated_by: "claude-fable-5-1"
    recent_action: "Fixed the preserve partition and filled the packet docs"
    next_safe_action: "Commit once the full suite exits zero"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-007-never-fatal-untracked"
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
| **Spec Folder** | 001-never-fatal-untracked |
| **Completed** | 2026-09-14 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## 2. WHAT WAS BUILT

Under the preserve remedy a neighbour's new file outside the packet no longer halts a fan-out lane. The partition in `enforceWriteContainment` now treats every preserved untracked path as an advisory when the mode is preserve or omitted, while restore keeps its packet-scope rule and an escaping symlink stays fatal in both modes. Two unit tests pin the partition per mode, five existing tests that pinned the old rule now ask for restore explicitly, and a runner stub lane proves the lane settles fulfilled with a `containment_advisory` ledger event naming the untouched file.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

One dispatch to DeepSeek V4.1 Flash at max thinking through the gateway on cli-pi, with a brief naming the three files, the frozen behaviour and the gate. The new preserve-mode tests were run against the unmodified guard first and failed at the expected assertions. The orchestrator then reviewed the diff and ran the whole deep-loop suite before committing.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Advisory regardless of packet relationship under preserve | Preservation already guarantees nothing is lost, so a halt bought only a false stop from another session's write |
| Restore keeps the packet-scope partition | Proves the change is scoped to preserve and keeps the opt-in remedy's stricter posture |
| Graceful self-stop fixture asks for a tree explicitly | The test had assumed the old worktree default and was red at HEAD; the fixture now states its need instead of inheriting a default |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| New preserve test against unmodified guard | FAIL as expected: violations held the stray path |
| Touched test files plus typecheck | PASS, exit 0, 199 tests |
| Full deep-loop suite | PASS: 156 files, 2657 tests, 7 skipped, exit 0 |
| `validate.sh --strict` on this phase | RESULT: PASSED |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Lane status string.** The lane settles `fulfilled` with a ledger advisory; the driver reserves its dedicated advisory status for the violations partition, so a stray untracked file does not change the status string.
<!-- /ANCHOR:limitations -->

---


