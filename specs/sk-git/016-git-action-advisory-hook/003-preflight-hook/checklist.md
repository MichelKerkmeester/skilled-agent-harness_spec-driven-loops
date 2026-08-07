---
title: "Verification Checklist: Preflight Hook"
description: "Evidence for the preflight advisory hook across five behavioural cases."
trigger_phrases:
  - "git preflight hook"
  - "sk-git advisory hook"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-git/016-git-action-advisory-hook/003-preflight-hook"
    last_updated_at: "2026-07-27T23:40:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Built and registered the preflight advisory hook"
    next_safe_action: "Phase 004 measures the fire rate"
    blockers: []
    key_files:
      - "spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-07-27-sk-git-016-003"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
# Verification Checklist: Preflight Hook

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |

<!-- /ANCHOR:protocol -->
---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] The proven sibling's output contract was read before writing
  - **Evidence**: `additionalContext` for warn, `permissionDecision` for block; this hook uses only the former
- [x] CHK-002 [P0] The existing PreToolUse Bash group was inspected
  - **Evidence**: two entries present; this appended as the third

<!-- /ANCHOR:pre-impl -->
---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-003 [P0] The hook never emits a permission decision
  - **Evidence**: only `additionalContext` is written on any path
- [x] CHK-004 [P0] Every error path approves silently
  - **Evidence**: bad payload, no repository, no rules and a thrown error all exit 0 with no output
- [x] CHK-005 [P1] No git process spawns for a non-git command
  - **Evidence**: shape regex rejects before context creation
- [x] CHK-006 [P1] Comment hygiene holds
  - **Evidence**: durable reasoning only; no spec paths or task ids

<!-- /ANCHOR:code-quality -->
---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-007 [P0] Fires on the real failure
  - **Evidence**: directory-scoped commit with an untracked file inside drew the advisory
- [x] CHK-008 [P0] Silent on an ordinary commit
  - **Evidence**: `git commit -m fix` produced no output
- [x] CHK-009 [P0] Silent on a non-git command
  - **Evidence**: `npm install` produced no output
- [x] CHK-010 [P0] Global kill works
  - **Evidence**: `SKGIT_ADVISORY=0` silenced the firing case
- [x] CHK-011 [P0] Per-rule opt-out works
  - **Evidence**: `SKGIT_ADVISORY_SKIP=<rule-id>` silenced the firing case

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-012 [P0] The rule reaches the operator at command time, not prompt time
  - **Evidence**: the hook runs on the Bash tool call carrying the command
- [x] CHK-013 [P1] Three fatigue tiers are present
  - **Evidence**: per-rule, prefix-grouped and global, two verified end to end

<!-- /ANCHOR:fix-completeness -->
---

<!-- ANCHOR:security -->
## Security

- [x] CHK-014 [P0] The hook cannot fail a command
  - **Evidence**: no deny path exists in the source
- [x] CHK-015 [P1] No repository content is echoed into the advisory
  - **Evidence**: messages are static rule text plus the invoked subcommand

<!-- /ANCHOR:security -->
---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-016 [P0] The suppression mechanism is discoverable from the advisory itself
  - **Evidence**: the closing line names the environment variable
- [x] CHK-017 [P1] Runtime coverage is stated honestly
  - **Evidence**: Claude-only registration recorded as a limitation

<!-- /ANCHOR:docs -->
---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-018 [P0] The hook lives under sk-git alongside its rules
  - **Evidence**: `sk-git/scripts/hooks/`
- [x] CHK-019 [P2] No new hook infrastructure was introduced
  - **Evidence**: appended to the existing Bash group

<!-- /ANCHOR:file-org -->
---

<!-- ANCHOR:summary -->
## Verification Summary

| Priority | Total | Complete | Outstanding |
|----------|-------|----------|-------------|
| P0 | 11 | 11 | 0 |
| P1 | 7 | 7 | 0 |
| P2 | 1 | 1 | 0 |

The five behavioural cases were executed directly against a purpose-built repository. Nothing
re-runs them automatically, which is recorded as a limitation rather than claimed as coverage.

<!-- /ANCHOR:summary -->
