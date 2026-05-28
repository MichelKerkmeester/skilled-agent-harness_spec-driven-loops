---
title: "Remediation: CP-Sandbox speckit Path Fix (Deep-Loop Playbook 007)"
description: "Fix stale .opencode/commands/spec_kit references in deep-review + deep-research CP-stress setup-cp-sandbox.sh (dir renamed to speckit), unblocking CP-052..057 + CP-046..051 sandbox setup."
trigger_phrases:
  - "cp sandbox speckit path fix"
  - "007 phase 007 remediation"
  - "setup-cp-sandbox spec_kit speckit"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/116-deep-skill-evolution/007-deep-stack-playbook-validation/007-cp-sandbox-speckit-path-fix"
    last_updated_at: "2026-05-27T20:00:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Fixed stale spec_kit refs to speckit in 2 CP setup scripts"
    next_safe_action: "Run the deep-review then deep-research CP-stress scenarios in rebuilt sandboxes"
    blockers: []
    key_files:
      - ".opencode/skills/deep-review/manual_testing_playbook/07--command-flow-stress-tests/setup-cp-sandbox.sh"
      - ".opencode/skills/deep-research/manual_testing_playbook/07--command-flow-stress-tests/setup-cp-sandbox.sh"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "session-2026-05-27-deep-loop-playbook"
      parent_session_id: null
    completion_pct: 60
    open_questions: []
    answered_questions: []
---
# Remediation: CP-Sandbox speckit Path Fix (Deep-Loop Playbook 007)

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | In progress |
| **Created** | 2026-05-27 |
| **Branch** | `main` |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`.opencode/commands/spec_kit` was renamed to `.opencode/commands/speckit`, but two CP-stress `setup-cp-sandbox.sh` scripts still reference the old `spec_kit` path: deep-review `07/setup-cp-sandbox.sh` (lines 61 `require_path` + 73 `copy_dir`) and deep-research `07/setup-cp-sandbox.sh` (line 74 `copy_dir`). Each hard-fails at `require_path` before building the sandbox, blocking CP-052..057 (deep-review) and CP-046..051 (deep-research) in the 007 validation run. It is CP-test-tooling staleness from the rename, not a deep-loop runtime defect.

### Purpose
Update the 3 stale references to `speckit` so both CP-stress sandboxes build, unblocking the 12 CP scenarios. Scope is the path rename only.

<!-- /ANCHOR:problem -->
---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- deep-review `07/setup-cp-sandbox.sh`: lines 61 + 73 `commands/spec_kit` to `commands/speckit`.
- deep-research `07/setup-cp-sandbox.sh`: line 74 `commands/spec_kit` to `commands/speckit`.
- Re-run both setups; run CP-052..057 + CP-046..051; flip the BLOCKED ledger rows.

### Out of Scope
- Any other setup-script behavior; deep-agent-improvement `08` CP setup (no `commands` ref); the dir rename itself.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| deep-review `07/setup-cp-sandbox.sh` | Modify | 2 refs spec_kit to speckit |
| deep-research `07/setup-cp-sandbox.sh` | Modify | 1 ref spec_kit to speckit |

<!-- /ANCHOR:scope -->
---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Both setup scripts free of `commands/spec_kit` | `rg "commands/spec_kit"` returns nothing |
| REQ-002 | deep-review + deep-research CP sandboxes build | setup exits 0; sandbox dir + `speckit` present |
| REQ-003 | CP-052..057 + CP-046..051 verdicts recorded | ledger BLOCKED rows flipped with evidence |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Remediation lineage recorded | entry added to `006/release-readiness-matrix.md` |

<!-- /ANCHOR:requirements -->
---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: No `commands/spec_kit` refs remain in either CP setup script.
- **SC-002**: Both CP sandboxes build cleanly (exit 0, `/tmp/cp-*` + `speckit` present).
- **SC-003**: CP-052..057 + CP-046..051 verdicts recorded with evidence; BLOCKED rows flipped.

<!-- /ANCHOR:success-criteria -->
---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Wrong rename target | Sandbox still fails | Verified canonical dir is `speckit`; `spec_kit` absent |
| Risk | Sandbox blast radius | State corruption | Scripts are `/tmp`-only, `set -euo pipefail`, `rm -rf` own dir |

<!-- /ANCHOR:risks -->
---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. The rename target (`speckit`) is unambiguous and verified.

<!-- /ANCHOR:questions -->
