---
title: "Teams"
description: "MagicPath team and member listings: the teams the current user belongs to with their role, and the members of one team. Both read-only."
trigger_phrases:
  - "magicpath teams"
  - "magicpath list teams"
  - "magicpath members"
  - "magicpath list members"
version: 1.0.0.0
---

# Teams (list_teams / list_members)

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Carries team scope. `list_teams` returns the teams the current user belongs to, with their role in each. `list_members` returns the members of one team. Together they establish the team boundary that `search_components`, `list_projects`, and `list_themes` can narrow to with a `team` argument.

Both tools are READ-ONLY.

---

## 2. HOW IT WORKS

`magicpath.list_teams({})` takes no arguments and returns the teams the user belongs to with their role. `magicpath.list_members({ team })` takes one required `team` (team name or id) and returns the members of that team. The `team` value used here is the same `team` value the `team?` optional argument on `search_components`, `list_projects`, and `list_themes` accepts. Calls are synchronous (no `await`, no returned Promise); inspect the returned value for an `error`/`code` field before using it.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `references/tool-surface.md` | Shared | Team tool arguments, bounds, and the team-scope role |
| `references/credential-setup.md` | Shared | The credential these tools require |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `references/mutation-boundary.md` | Reference | The read-only boundary these tools sit inside |

---

## 4. SOURCE METADATA

- Group: Teams
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `teams/teams.md`

Per-tool leaves in this domain:
- [list-teams.md](list-teams.md) - teams the user belongs to, with role
- [list-members.md](list-members.md) - members of one team (name or id)

Related references:
- [projects.md](../projects/projects.md) covers `list_projects`, which accepts a `team` filter
- [themes.md](../themes/themes.md) covers `list_themes`, which accepts a `team` filter
