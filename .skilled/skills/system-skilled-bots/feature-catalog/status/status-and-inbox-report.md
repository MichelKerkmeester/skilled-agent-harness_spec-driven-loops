---
title: "Status and inbox report"
description: "Joins the status index, the install records and launchctl print into one bots status report and the needs-you inbox."
trigger_phrases:
  - "status and inbox report"
  - "bots status"
  - "bots inbox"
  - "/bots:status"
  - "which bots are installed"
version: 1.0.0.0
---

# Status and inbox report (bots status, bots inbox)

## 1. OVERVIEW

Joins the status index, the install records and launchctl print into one bots status report and the needs-you inbox.

Run records alone miss a bot that is installed and never ran, and launchd alone says nothing about what ran or whether it was delivered. Status joins the two. The status mode runs `bots status`, `bots status --json` and `bots inbox`, all read-only for the consumer checkout.

---

## 2. HOW IT WORKS

### Bot Rows

Each installed bot gets a row with its last run and delivery and one state: `ok`, `never-run`, `held`, `launchd-failed`, `needs-reinstall`, `run-folder-gone`, `missing`, `unreadable`, `retired` or `unknown`. `needs-reinstall` comes from the installer's own install-record check. Status never opens a run folder. It only asks whether the folder's path still exists, so a folder lost to a re-pin shows as gone instead of crashing.

### launchctl print

For each installed label, status reads `launchctl print` through the installer's seam. Its man page says the output is not API, so the reader takes only the state, the run count and the last exit code, skips every line it does not know and answers `unknown` for a field it cannot read. It never guesses a healthy or failed job from output it does not understand.

### Checkout Paths

A checkout path is judged present, missing or unreadable. An unreadable path judges nothing, so it is never reported as missing and never relinked. A missing path is relinked only when exactly one other registered checkout of the same identity is present, so one clone's history is never moved onto another.

### Inbox

`bots inbox` lists open and expired needs-you items with their item ids, which `bots answer` takes. Answering is a run action and belongs to the run mode.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.skilled/skills/system-skilled-bots/runtime/lib/status.ts` | Shared | Row states, path judgment, relink rule, report build and formatting |
| `.skilled/skills/system-skilled-bots/runtime/lib/launchctl-print.ts` | Shared | Reads three fields from `launchctl print` and answers unknown otherwise |
| `.skilled/bin/bots.cjs` | Handler | The `status` and `inbox` verbs |
| `.skilled/commands/bots/status.md` | Handler | The `/bots:status` command router |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.skilled/skills/system-skilled-bots/runtime/tests/status.vitest.ts` | Vitest | Reading launchctl print, row states and needs-you rows |
| `.skilled/skills/system-skilled-bots/manual-testing-playbook/hub-routing/status-last-run.md` | Manual playbook | Routes a last-run question to the status mode |
| `.skilled/skills/system-skilled-bots/manual-testing-playbook/hub-routing/status-bot-inbox.md` | Manual playbook | Routes an inbox question to the status mode |

---

## 4. SOURCE METADATA

- Group: Status
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `status/status-and-inbox-report.md`

Related references:
- [status-index.md](status-index.md) - the index the report reads
- [../scheduling/launchd-installer.md](../scheduling/launchd-installer.md) - the install records behind `needs-reinstall`
