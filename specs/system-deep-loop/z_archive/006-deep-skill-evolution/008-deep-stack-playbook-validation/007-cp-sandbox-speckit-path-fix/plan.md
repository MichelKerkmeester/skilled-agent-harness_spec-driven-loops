---
title: "Implementation Plan: CP-Sandbox speckit Path Fix (007)"
description: "Fix plan for stale spec_kit to speckit references in deep-review + deep-research CP-stress setup scripts."
trigger_phrases:
  - "cp sandbox speckit path fix plan"
  - "007 phase 007 plan"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/z_archive/006-deep-skill-evolution/008-deep-stack-playbook-validation/007-cp-sandbox-speckit-path-fix"
    last_updated_at: "2026-05-27T20:00:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Authored 007 plan for CP setup speckit path fix"
    next_safe_action: "Dispatch the deep-review CP-stress scenarios to devin in the sandbox"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "session-2026-05-27-deep-loop-playbook"
      parent_session_id: null
    completion_pct: 60
    open_questions: []
    answered_questions: []
---
# Implementation Plan: CP-Sandbox speckit Path Fix (007)

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Bash (setup-cp-sandbox.sh) |
| **Surface** | OpenCode skill playbook tooling |
| **Scope** | 3 string references across 2 files |

### Overview
Rename 3 stale `commands/spec_kit` references to `commands/speckit` (matching the renamed directory) in the deep-review and deep-research CP-stress setup scripts, then rebuild the sandboxes and run the blocked CP scenarios.

<!-- /ANCHOR:summary -->
---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Root cause confirmed (dir renamed spec_kit to speckit; scripts stale)
- [x] Exact stale lines located (deep-review:61,73; deep-research:74)

### Definition of Done
- [x] No `commands/spec_kit` refs remain
- [x] deep-review sandbox builds (exit 0)
- [ ] CP-052..057 + CP-046..051 verdicts recorded

<!-- /ANCHOR:quality-gates -->
---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Surgical string replacement; no behavioral change to the setup scripts beyond the path rename.

### Key Components
- **deep-review setup-cp-sandbox.sh**: require_path + copy_dir of the commands dir into the sandbox.
- **deep-research setup-cp-sandbox.sh**: copy_dir of the commands dir into the sandbox.

<!-- /ANCHOR:architecture -->
---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Fix
- [x] deep-review line 61 `require_path` spec_kit to speckit
- [x] deep-review line 73 `copy_dir` spec_kit to speckit (source + target)
- [x] deep-research line 74 `copy_dir` spec_kit to speckit (source + target)

### Phase 2: Verify build
- [x] `rg "commands/spec_kit"` returns nothing in both scripts
- [x] deep-review setup-cp-sandbox.sh re-run exits 0; sandbox + speckit present

### Phase 3: Run scenarios
- [ ] Run CP-052..057 in deep-review sandbox; flip 003 ledger
- [ ] Run CP-046..051 in deep-research sandbox (phase 004); flip 004 ledger

<!-- /ANCHOR:phases -->
---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Static | No stale refs remain | `rg` |
| Build | Sandbox rebuilds cleanly | `bash setup-cp-sandbox.sh` |
| Scenario | CP-052..057 + CP-046..051 | cli-devin pinned to sandbox + orchestrator spot-verify |

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `.opencode/commands/speckit` dir | Internal | Green | Sandbox copy_dir fails |
| cli-devin SWE-1.6 | External | Green | CP scenarios cannot dispatch |

<!-- /ANCHOR:dependencies -->
---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The rename breaks sandbox build in an unforeseen way.
- **Procedure**: Revert the 3 line edits in the 2 setup scripts (git checkout); the change is isolated to those lines.

<!-- /ANCHOR:rollback -->
