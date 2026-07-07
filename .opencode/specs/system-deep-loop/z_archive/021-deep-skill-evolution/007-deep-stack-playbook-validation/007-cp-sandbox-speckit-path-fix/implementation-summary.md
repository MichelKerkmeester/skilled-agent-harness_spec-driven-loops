---
title: "Implementation Summary: CP-Sandbox speckit Path Fix (007)"
description: "What changed + verification for the stale spec_kit to speckit CP setup-script remediation."
trigger_phrases:
  - "cp sandbox speckit path fix summary"
  - "007 phase 007 implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/z_archive/021-deep-skill-evolution/007-deep-stack-playbook-validation/007-cp-sandbox-speckit-path-fix"
    last_updated_at: "2026-05-27T20:00:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "CP setup speckit fix shipped and sandbox build verified"
    next_safe_action: "Run CP scenarios then record matrix lineage"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "session-2026-05-27-deep-loop-playbook"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary: CP-Sandbox speckit Path Fix (007)

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 007-cp-sandbox-speckit-path-fix |
| **Completed** | (in progress) |
| **Level** | 1 |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:what-built -->
## What Was Built

Remediated the run's first confirmed FAIL: the CP-stress `setup-cp-sandbox.sh` scripts referenced the renamed `.opencode/commands/spec_kit` directory (now `speckit`), hard-failing at `require_path` and blocking 12 CP scenarios (CP-052..057 deep-review, CP-046..051 deep-research).

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/deep-review/manual_testing_playbook/07--command-flow-stress-tests/setup-cp-sandbox.sh` | Modified | lines 61 + 73 `commands/spec_kit` to `commands/speckit` |
| `.opencode/skills/deep-research/manual_testing_playbook/07--command-flow-stress-tests/setup-cp-sandbox.sh` | Modified | line 74 `commands/spec_kit` to `commands/speckit` |

<!-- /ANCHOR:what-built -->
---

<!-- ANCHOR:how-delivered -->
## HOW IT WAS DELIVERED

1. Located the 3 stale `commands/spec_kit` refs via `rg` (deep-review:61,73; deep-research:74).
2. Edited each to `commands/speckit` (require_path + copy_dir source/target).
3. Confirmed `rg "commands/spec_kit"` is clean; re-ran the deep-review setup (exit 0; sandbox + speckit present).
4. CP scenario execution + ledger flips follow (tasks T006/T007).

<!-- /ANCHOR:how-delivered -->
---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Rationale |
|----------|-----------|
| Rename refs to `speckit` (not recreate `spec_kit`) | `speckit` is the canonical post-rename dir; `spec_kit` no longer exists |
| Scope limited to 3 line edits | Pure path fix; no other setup-script behavior changes |
| Record as 007 child | Operator chose record+remediate model for confirmed FAILs |

<!-- /ANCHOR:decisions -->
---

<!-- ANCHOR:verification -->
## Verification

| Test Type | Status | Notes |
|-----------|--------|-------|
| Static (`rg "commands/spec_kit"`) | Pass | No refs remain in either script |
| Build (deep-review setup) | Pass | exit 0; `/tmp/cp-deep-review-sandbox/.opencode/commands/speckit` present |
| CP-052..057 (deep-review) | SKIP | sandbox builds OK (007 fix verified); copilot CLI policy-blocked -> scenarios SKIP |
| CP-046..051 (deep-research) | Pending | phase 004 setup re-run; same copilot blocker expected |

<!-- /ANCHOR:verification -->
---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **deep-research sandbox not yet rebuilt** — its setup is re-run during phase 004 before CP-046..051.
2. **CP verdicts pending** — the script fix is verified; scenario execution + ledger flips happen next (T006/T007).

<!-- /ANCHOR:limitations -->
