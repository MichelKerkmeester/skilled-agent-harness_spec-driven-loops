---
title: "Implementation Summary"
description: "Tried and reverted: the stable split saved about 5 percent, under the 10 percent bar. fanout-run is the largest of the twelve deep-loop files that run one at a time. Splitting it and moving safe pieces into the parallel group could shorten the serial tail."
trigger_phrases:
  - "split fanout run implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/runtime-and-release/006-test-cycle-speed/004-split-fanout-run"
    last_updated_at: "2026-11-10T20:34:46Z"
    last_updated_by: "generate-context"
    recent_action: "Tried the fanout-run split three ways; stable version saved about 5 percent, reverted"
    next_safe_action: "None; rejected with evidence"
    blockers: []
    key_files:
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:93cb3b943e0744fb7d9f04d3666835300bf1b8e161a326779d243814f2f1049f"
      session_id: "scaffold-004-split-fanout-run"
      parent_session_id: null
    session_ref:
      runtime: "claude"
      sessionId: "57bcd03f-32c4-439a-a610-ec91a7c3d3ba"
      workspace: "/Users/michelkerkmeester/worktrees/public/340-local-test-scope"
      savedAt: "2026-11-10T20:34:46Z"
      locatorKind: "transcript_path"
      version: 1
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 004-split-fanout-run |
| **Completed** | 2026-11-10, rejected |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Nothing stays. The split was built, measured three ways and reverted, as the phase's rollback rule requires. `fanout-run.vitest.ts` and `vitest.config.ts` are back as they were.

### What was tried

```text
attempt 1   11 timing describes serial, 33 parallel
            deep-loop 447 s pass, 435 s FAIL, 438 s pass
            failure: live-tools preflight, a spawned fan-out returned exit code null
attempt 2   that describe moved back to serial
            deep-loop 457 s pass, 455 s pass, 445 s FAIL
            failure: containment runs for failed lanes, no containment event recorded
attempt 3   every describe that spawns a whole lineage pool kept serial (20 describes)
            deep-loop 470 s, 480 s, 480 s   all pass, 2873 tests
baseline    504-511 s
```

Attempt 3 was stable but saved about 5% (median 480 s against 507 s). That is under the 10% bar, so it was reverted.

### What this shows

Each `fanout-run` test that spawns a whole fan-out pool depends on timing. Under parallel load, a spawned run gets killed or records events late. The tests that are safe to run in parallel are the ones that cost almost nothing, so moving them saves little.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `implementation-summary.md` | Modified | The attempts and the reason for the revert |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

DeepSeek V4.1 Flash, run through cli-devin, did the first split into a shared harness and two files, and kept all 176 tests. Each later attempt moved whole describe blocks into the serial file. Every attempt ran the full deep-loop suite three times in a row on a quiet machine.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Promote one piece at a time | Two of its tests already failed under full parallel load |
| Never loosen a limit | A looser limit would hide the timing behavior the tests check |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Same tests (REQ-001) | 176 `fanout-run` tests listed in every attempt and after the revert |
| No assertion changes (REQ-002) | Whole describe blocks moved, nothing edited |
| Stable (REQ-003) | Attempts 1 and 2 each failed once. Attempt 3 passed three runs |
| Faster (REQ-004) | Not met: about 5%. Reverted |
| Revert | `git status` shows no change under `system-deep-loop/runtime` |
| `validate.sh` on this folder with `--strict` | RESULT: PASSED |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The serial tail stays at about 280 s.** Making it shorter would mean making the pool-spawning tests robust to load, for example with shorter stub sleeps or an injected clock. That changes the tests' timing, which this series ruled out.
<!-- /ANCHOR:limitations -->

---


