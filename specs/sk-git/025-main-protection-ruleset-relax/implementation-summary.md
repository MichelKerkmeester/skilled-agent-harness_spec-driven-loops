---
title: "Implementation Summary: Main-Protection Ruleset Relaxation"
description: "Disabled the retained GitHub main-protection ruleset (enforcement active to disabled) so direct pushes to main stop generating admin-bypass audit noise; all seven rules and the admin bypass are retained for one-call re-enable, and outside contributors still fork-and-PR because a public repo grants them no direct push."
trigger_phrases:
  - "main-protection ruleset relax summary"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-git/025-main-protection-ruleset-relax"
    last_updated_at: "2026-08-21T09:10:00Z"
    last_updated_by: "claude"
    recent_action: "Disabled main-protection ruleset; rules and bypass retained"
    next_safe_action: "Commit the packet on v4 and main"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "025-implementation-summary"
      parent_session_id: null
---
# Implementation Summary: Main-Protection Ruleset Relaxation

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 025-main-protection-ruleset-relax |
| **Completed** | 2026-08-21 |
| **Level** | 1 |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:what-built -->
## What Was Built

The `main-protection` ruleset's `enforcement` was flipped from `active` to `disabled` via one GitHub REST write, plus this packet recording the decision, the collaboration-vs-ruleset mechanism, and the rollback. Direct pushes to `main` — including those an AI makes under the owner's git auth — now generate no admin-bypass audit "violation"; outside contributors are unaffected because a public repo grants them no direct push regardless.

### Target State

| Target | Action | Purpose |
|--------|--------|---------|
| GitHub ruleset `main-protection` (id `11725786`) | Disabled | Stopped admin-bypass audit "violations" on direct pushes to `main`; object retained for one-call re-enable |
| This spec packet | Created | Record the decision, the collaboration-vs-ruleset mechanism, and the rollback |

### The command the operator runs

```
gh api -X PUT repos/{owner}/{repo}/rulesets/11725786 -f enforcement=disabled
```

### Rollback (one call)

```
gh api -X PUT repos/{owner}/{repo}/rulesets/11725786 -f enforcement=active
```

<!-- /ANCHOR:what-built -->
---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The recommendation was reached from the real repository state, not assumption: the repo is public, its only collaborator is the admin owner, and the `main-protection` ruleset carries an admin `bypass_actors` entry with `bypass_mode: always`. That means the ruleset never blocked the owner — it only logged the admin bypass as a "violation" on each direct push. Because a public repo grants non-collaborators no direct push, the "others must open a PR" property comes from collaboration, not from the ruleset's `pull_request` rule; disabling the ruleset therefore removes the audit noise without changing what any outside contributor can do. Disable (not delete) was chosen so the object, its seven rules, its `~DEFAULT_BRANCH` condition, and its admin bypass all survive, making re-enable a single `enforcement=active` call the day a write-level collaborator is added.

<!-- /ANCHOR:how-delivered -->
---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Rationale |
|----------|-----------|
| Disable rather than delete the ruleset | Retains rules, conditions, and bypass so re-enable is one call; deletion would force reconstruction |
| Relax the server-side ruleset, not repository permissions | "Outsiders must fork-and-PR" already holds on a public repo via collaboration; only the audit noise needed removing |
| Leave `skilled/v*` untouched | The ruleset only targeted `~DEFAULT_BRANCH`; release-line pushes already generated no violations |
| Operator executes the API write | The assistant's `gh api -X PUT` on a ruleset is denied by the local classifier; the write is outward-facing config the operator authorizes directly |

<!-- /ANCHOR:decisions -->
---

<!-- ANCHOR:verification -->
## Verification

| Test Type | Status | Notes |
|-----------|--------|-------|
| Baseline (negative control) | Captured | `enforcement=active`; rules `[deletion, non_fast_forward, pull_request, required_linear_history, required_signatures, code_scanning, copilot_code_review]`; condition `~DEFAULT_BRANCH`; bypass `[{RepositoryRole, actor_id 5, always}]` |
| Collaboration model | Confirmed | Repo PUBLIC; sole collaborator `MichelKerkmeester` (admin); no write-level collaborators |
| Enforcement disabled (SC-001) | Pass | `PUT` returned `enforcement=disabled` (`updated_at 2026-08-21T10:53:09+02:00`); read-back confirms `enforcement=disabled` |
| Reversibility (SC-003) | Pass | After the write: 7 rules retained, `~DEFAULT_BRANCH` condition retained, admin bypass `[{RepositoryRole, actor_id 5, always}]` retained — `enforcement=active` restores prior state in one call |

<!-- /ANCHOR:verification -->
---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **SC-002 confirmed by mechanism, observed on next push** — `enforcement=disabled` is proven from the ruleset read-back; that a subsequent direct push logs no new bypass "violation" follows from disabling enforcement and becomes visible on the next push to `main`.
2. **Future write collaborators are not gated while disabled** — the day a write-level collaborator is added, re-enable with `enforcement=active` to force them through PRs.
3. **Unrelated CI failures unaffected** — the `Routing Registry Drift Guard` Actions failures are routing-manifest drift, independent of this ruleset, and are out of scope here.

<!-- /ANCHOR:limitations -->
