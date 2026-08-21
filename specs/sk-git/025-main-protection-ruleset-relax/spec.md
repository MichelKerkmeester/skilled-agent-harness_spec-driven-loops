---
title: "Feature Specification: Main-Protection Ruleset Relaxation"
description: "Disable the server-side GitHub main-protection ruleset so the owner (and any AI acting under the owner's git auth) pushes to main without generating admin-bypass audit-log 'violations', while outside contributors still fork-and-PR because a public repo grants them no direct push regardless of the ruleset."
trigger_phrases:
  - "make branch protection less strict"
  - "stop main-protection violation logging"
  - "disable github ruleset admin push"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-git/025-main-protection-ruleset-relax"
    last_updated_at: "2026-08-21T09:10:00Z"
    last_updated_by: "claude"
    recent_action: "Disabled main-protection ruleset; rules and bypass retained"
    next_safe_action: "Commit the packet; re-enable if a write collaborator is added"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "025-spec"
      parent_session_id: null
---
# Feature Specification: Main-Protection Ruleset Relaxation

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-08-21 |
| **Branch** | `skilled/v4.0.0.0` |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Every direct push to `main` records a bypass entry under the repository's Rule Insights, surfaced to the operator as "1 violation (unsigned / no-PR)". The entry is not a block and not a failed run — it is GitHub logging that a repository admin used their always-on bypass of the `main-protection` ruleset. The operator wants direct pushes (including pushes an AI makes under the operator's git auth) to stop generating that noise, while keeping the property that other people cannot push straight to `main` and must open a pull request.

The mechanism that actually governs "who may push directly" is repository collaboration, not the ruleset:

- The repository is **public** and has exactly **one collaborator** — the owner, with the admin role.
- Outside users (non-collaborators) can never push to a public repository with or without any ruleset; they must fork and open a PR. That is baseline GitHub behaviour.
- The `main-protection` ruleset's `pull_request` rule only changes behaviour for collaborators granted write or maintain access — of which there are currently zero.
- The admin owner is in `bypass_actors` with `bypass_mode: always`, so the ruleset never blocks the owner; its only present-day effect is the bypass-audit "violation" on the owner's own pushes.
- A bypassed-but-active rule is logged by design. There is no setting that keeps a rule active yet silences its bypass entry — so the noise cannot be removed while the rule stays active.

### Purpose

Disable the `main-protection` ruleset (retained, not deleted) so the owner and any AI acting under the owner's auth push to `main` with zero bypass-audit noise, outside contributors still fork-and-PR (unchanged — they have no push access), and the ruleset can be re-enabled in one call the day a write-level collaborator is added.

<!-- /ANCHOR:problem -->
---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Set the `main-protection` ruleset (id `11725786`) `enforcement` from `active` to `disabled` via the GitHub REST API.
- Retain the ruleset object, its rules, conditions, and `bypass_actors` intact, so re-enabling is a single `enforcement=active` call.
- Document the governance decision, the collaboration-vs-ruleset mechanism, and the rollback.

### Out of Scope

- Deleting the ruleset (disable keeps the config for cheap reversal).
- Any change to classic branch protection (there is none configured).
- Any change to `skilled/v*` push behaviour (the ruleset never targeted it; it targets `~DEFAULT_BRANCH` only).
- The pre-existing `Routing Registry Drift Guard` GitHub Actions failures, which are routing-manifest drift unrelated to this ruleset and unaffected by this change.
- The local sk-git remote-push allowlist and pre-push hook (governed by `015-remote-branch-policy`); this packet is the server-side ruleset only.

### Target State

| Target | Change Type | Description |
|--------|-------------|-------------|
| GitHub ruleset `main-protection` (id `11725786`) | Modify | `enforcement`: `active` → `disabled`; all rules, conditions, and bypass actors retained |

<!-- /ANCHOR:scope -->
---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The ruleset no longer enforces on direct pushes | `gh api repos/{owner}/{repo}/rulesets/11725786 --jq .enforcement` returns `disabled` |
| REQ-002 | The ruleset is retained for cheap re-enable | The ruleset id `11725786` still exists after the change with its rules, conditions, and `bypass_actors` unchanged |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Outside-contributor PR requirement is preserved by collaboration | The repository stays public with no added write collaborators, so non-collaborators must still fork-and-PR; no repository-permission change is made in this packet |

<!-- /ANCHOR:requirements -->
---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The `main-protection` ruleset reports `enforcement: disabled` after the change.
- **SC-002**: A subsequent direct push to `main` records no new bypass "violation" under Rule Insights.
- **SC-003**: The ruleset object, its seven rules, its `~DEFAULT_BRANCH` condition, and its admin `bypass_actors` are all still present, so `enforcement=active` restores the prior state in one call.

<!-- /ANCHOR:success-criteria -->
---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A future write-level collaborator could push straight to `main` while the ruleset is disabled | Low today (zero such collaborators) | Re-enable with `enforcement=active` the day such a collaborator is added; SC-003 keeps re-enable a one-call operation |
| Risk | Losing `deletion` / `non_fast_forward` protection on `main` | Low | Those rules only ever applied to accounts with push access — currently only the admin owner, who already always-bypassed them |
| Dependency | GitHub REST rulesets API + `gh` auth as an admin | External | The authenticated user is the repository admin owner |

<!-- /ANCHOR:risks -->
---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. Disable (not delete) is chosen deliberately so the ruleset can be re-enabled in one call if a write collaborator is later added.

<!-- /ANCHOR:questions -->
