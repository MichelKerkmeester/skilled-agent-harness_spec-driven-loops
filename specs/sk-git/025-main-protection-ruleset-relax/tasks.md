---
title: "Tasks: Main-Protection Ruleset Relaxation"
description: "Executor-ready task list for baselining, disabling, and verifying the retained GitHub main-protection ruleset."
trigger_phrases:
  - "main-protection ruleset relax tasks"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-git/025-main-protection-ruleset-relax"
    last_updated_at: "2026-08-21T09:10:00Z"
    last_updated_by: "claude"
    recent_action: "Completed toggle + verify; ruleset now disabled"
    next_safe_action: "Commit the packet"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "025-tasks"
      parent_session_id: null
---
# Tasks: Main-Protection Ruleset Relaxation

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (target)`

<!-- /ANCHOR:notation -->
---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Read the ruleset baseline — enforcement, rules, conditions, bypass actors (`gh api repos/{owner}/{repo}/rulesets/11725786`) [evidence: `enforcement=active`; rules `[deletion, non_fast_forward, pull_request, required_linear_history, required_signatures, code_scanning, copilot_code_review]`; condition `ref_name.include=[~DEFAULT_BRANCH]`; bypass `[{RepositoryRole, actor_id 5, always}]`]
- [x] T002 Confirm the collaboration model that makes disable safe (`gh api repos/{owner}/{repo}/collaborators`) [evidence: repo PUBLIC; sole collaborator `MichelKerkmeester` role `admin`; no write-level collaborators]

<!-- /ANCHOR:phase-1 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Disable enforcement on the retained ruleset (`gh api -X PUT repos/{owner}/{repo}/rulesets/11725786 -f enforcement=disabled`) [evidence: PUT returned `enforcement=disabled`, `updated_at=2026-08-21T10:53:09+02:00`]

<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T004 Read back and assert `enforcement=disabled` (SC-001) (`gh api ... --jq .enforcement`) [evidence: read-back returned `enforcement=disabled`]
- [x] T005 Assert rules, `~DEFAULT_BRANCH` condition, and admin bypass are all retained so re-enable is one call (SC-003) (`gh api ... --jq '{rules, conditions, bypass_actors}'`) [evidence: 7 rules retained; bypass `[{RepositoryRole, actor_id 5, always}]` retained]

<!-- /ANCHOR:phase-3 -->
---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] Ruleset reports `enforcement: disabled` (SC-001)
- [x] Ruleset object, rules, conditions, and bypass actors retained (SC-003)
- [x] Decision, mechanism, and rollback documented in `implementation-summary.md`

<!-- /ANCHOR:completion -->
---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`

<!-- /ANCHOR:cross-refs -->
