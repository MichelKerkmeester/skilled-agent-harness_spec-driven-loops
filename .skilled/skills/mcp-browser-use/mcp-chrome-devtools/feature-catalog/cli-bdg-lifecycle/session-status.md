---
title: "Session Status"
description: "bdg status --json: session JSON with an active flag, plus session detail when a session runs."
trigger_phrases:
  - "bdg status"
  - "check browser session state"
  - "session health check"
version: 1.0.2.0
---

# Session Status

---

## 1. OVERVIEW

`bdg status --json 2>&1` returns valid JSON describing the current session. Plain `bdg status` prints text. The JSON has no `state` key. It always carries `version` and `active`. With no session it is `{"version":"0.6.10","active":false}`. An active session adds detail such as `port`, `targetId` and a nested page `url`.

---

## 2. HOW IT WORKS

Verify session status before every CDP command (SKILL.md ALWAYS rule 3). The standard gate is `bdg status --json 2>/dev/null | jq -e '.active'`; `bdg status --json` reports `active` as true or false, and `stale` when the recorded bdg process is gone. Plain `bdg status` prints text, not JSON. The session_management reference builds a health-check function on top of it with distinct exit codes.

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
| `manual-testing-playbook/cli-bdg-lifecycle/status-json.md` | Manual playbook | BDG-003 scenario contract |

---

## 4. SOURCE METADATA

- Group: CLI bdg Lifecycle
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `cli-bdg-lifecycle/session-status.md`
Related references:
- [session-start.md](../../feature-catalog/cli-bdg-lifecycle/session-start.md) — Session Start
- [dead-session.md](../../feature-catalog/recovery-and-troubleshooting/dead-session.md) — Dead Session Recovery
