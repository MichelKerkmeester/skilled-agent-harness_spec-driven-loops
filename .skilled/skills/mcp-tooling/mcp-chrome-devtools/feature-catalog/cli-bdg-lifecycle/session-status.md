---
title: "Session Status"
description: "bdg status — JSON session state with state and url fields."
trigger_phrases:
  - "bdg status"
  - "check browser session state"
  - "session health check"
version: 1.0.0.0
---

# Session Status

<!-- sk-doc-template: skill_asset_feature_catalog -->

---

## 1. OVERVIEW

`bdg status 2>&1` returns valid JSON describing the current session, including `state` and `url` fields. Session states are `inactive`, `starting`, `active`, and `error`.

---

## 2. HOW IT WORKS

Verify session status before every CDP command (SKILL.md ALWAYS rule 3). The standard gate is `bdg status 2>&1 | jq -e '.state == "active"'`; the session_management reference builds a full health-check function on top of it with per-state exit codes.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `SKILL.md` §7 | CLI | Essential command list (`bdg status`) |
| `references/session-management.md` §5 | Reference | Status check patterns and health-check function |

### Validation And Tests

| File | Type | Role |
|------|------|------|
| `manual-testing-playbook/cli-bdg-lifecycle/status-json.md` | Manual | BDG-003 scenario contract |

---

## 4. SOURCE METADATA

- Group: CLI bdg Lifecycle
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `cli-bdg-lifecycle/session-status.md`
Related references:
- [session-start.md](../../feature-catalog/cli-bdg-lifecycle/session-start.md) — Session Start
- [dead-session.md](../../feature-catalog/recovery-and-troubleshooting/dead-session.md) — Dead Session Recovery
