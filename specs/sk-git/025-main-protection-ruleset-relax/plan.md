---
title: "Implementation Plan: Main-Protection Ruleset Relaxation"
description: "Approach for disabling the retained GitHub main-protection ruleset via one REST enforcement toggle, with before/after verification and a one-call rollback."
trigger_phrases:
  - "main-protection ruleset relax plan"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-git/025-main-protection-ruleset-relax"
    last_updated_at: "2026-08-21T09:10:00Z"
    last_updated_by: "claude"
    recent_action: "Disabled the ruleset via the single enforcement toggle"
    next_safe_action: "Commit the packet"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "025-plan"
      parent_session_id: null
---
# Implementation Plan: Main-Protection Ruleset Relaxation

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | GitHub REST rulesets API via `gh api` |
| **Components** | Repository ruleset `main-protection` (id `11725786`) |
| **Testing** | Before/after `gh api` reads of `enforcement` and rule/bypass shape |
| **Runtime** | GitHub server-side branch protection for `~DEFAULT_BRANCH` |

### Overview

The change is a single field flip — `enforcement`: `active` → `disabled` — on a retained ruleset. No repository-permission change, no rule deletion, no classic-branch-protection change. The verification is a pair of `gh api` reads that prove enforcement went to `disabled` and that the rules, conditions, and admin bypass survived intact so the toggle is reversible in one call.

<!-- /ANCHOR:summary -->
---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Current ruleset state captured (enforcement `active`, 7 rules, `~DEFAULT_BRANCH` condition, admin `bypass_actors` always)
- [x] Confirmed repo is public with the owner as the only collaborator
- [x] Confirmed the "violation" is admin-bypass audit logging, not a block or a failed run
- [x] Rollback command identified

### Definition of Done
- [x] Ruleset reports `enforcement: disabled`
- [x] Rules, conditions, and bypass actors unchanged (reversible in one call)
- [x] Decision, mechanism, and rollback documented

<!-- /ANCHOR:quality-gates -->
---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

A reversible, retained-object disable: flip enforcement rather than delete, so the governance intent is preserved and re-enable is trivial.

### Key Components

- **The ruleset (`11725786`)**: `enforcement` is the only mutated field.
- **`bypass_actors`**: `actor_type: RepositoryRole`, `actor_id: 5` (Repository admin), `bypass_mode: always` — retained; it is why direct pushes never blocked, only logged.
- **Conditions**: `ref_name.include: ["~DEFAULT_BRANCH"]` — retained; confirms `skilled/v*` was never in scope.

### Data Flow

1. Read the ruleset — record `enforcement=active` as the baseline (negative control for the "violation" noise).
2. `PUT` the ruleset with `enforcement=disabled`.
3. Read it back — assert `enforcement=disabled` and that rules/conditions/bypass are unchanged.

<!-- /ANCHOR:architecture -->
---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Baseline
- [x] Capture the ruleset's current enforcement, rules, conditions, and bypass actors
- [x] Confirm collaboration model (public, solo admin) that makes disable safe

### Phase 2: Toggle
- [x] `gh api -X PUT repos/{owner}/{repo}/rulesets/11725786 -f enforcement=disabled`

### Phase 3: Verification
- [x] Read back `enforcement=disabled`
- [x] Confirm the 7 rules, the `~DEFAULT_BRANCH` condition, and the admin bypass are all retained

<!-- /ANCHOR:phases -->
---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| State assertion | `enforcement` transitions `active` → `disabled` | `gh api ... --jq .enforcement` |
| Reversibility | Rules, conditions, bypass actors unchanged | `gh api ... --jq '{rules, conditions, bypass_actors}'` |

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| GitHub REST rulesets API | External | Green | The only way to toggle enforcement programmatically |
| `gh` auth as repo admin | External | Green | Authenticated user is the admin owner |
| Local auto-approve permission for the `gh api` write | Internal | Blocked | The assistant's `gh api -X PUT` is denied by the local classifier; the operator runs the one-liner (via `!`) or grants a Bash permission rule |

<!-- /ANCHOR:dependencies -->
---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A write-level collaborator is added and must be forced through PRs, or the operator wants the protection back.
- **Procedure**:
  1. `gh api -X PUT repos/{owner}/{repo}/rulesets/11725786 -f enforcement=active`
  2. The ruleset resumes enforcing with its original rules, conditions, and bypass actors — no reconstruction needed because disable retained the object.
  3. No state migration to undo.

<!-- /ANCHOR:rollback -->
