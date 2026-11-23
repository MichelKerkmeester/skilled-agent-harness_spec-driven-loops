---
title: "Definition approval"
description: "Lets an unattended run use only the BOT.md and bots/config.json an operator approved, and refuses one whose files are unapproved or changed since."
trigger_phrases:
  - "definition approval"
  - "definition-unapproved"
  - "definition-drifted"
  - "approve a bot definition"
  - "bot definition drift"
version: 1.0.0.0
---

# Definition approval

## 1. OVERVIEW

Lets an unattended run use only the BOT.md and bots/config.json an operator approved, and refuses one whose files are unapproved or changed since.

A run with write access to the checkout can edit its own `BOT.md` or the repository's `bots/config.json`. Without approval the next scheduled fire or queued run would obey that edit: a rewritten precheck would run as plain shell, and a dropped isolation would go unenforced. Approval ties every unattended run to the exact bytes an operator last saw.

---

## 2. HOW IT WORKS

### What Gets Approved

An approval is the `sha256` hash of the bot's `BOT.md` and of the checkout's `bots/config.json`, with the time and the operator act that wrote it. A config file that does not exist hashes as `absent`, so adding one later reads as a change. The record lives at `<stateRoot>/<identity>/approvals/<bot>.json`, under the user-level state root where no run can write.

Three operator acts write it. `bots schedule install <id>` approves the bytes its preflight vetted. `bots enable <id>` approves the files as they are now, and it does so for a bot with no installed schedule too, so its queued requests may run. Every hand-typed `bots run <id>` approves the files it is about to run, because the operator typing it is the approval.

### What Gets Refused

The runner checks approval first in its check order, ahead of the definition parse and the disable switch, for a scheduled fire, a queued request and a resume. A bot with no readable approval is refused as `definition-unapproved`, so a damaged approval file fails closed. A `BOT.md` or `bots/config.json` whose hash differs from the approval is refused as `definition-drifted`, and the detail names the changed file and the approval it no longer matches. A refusal never approves anything, so the bot stays refused while the file stays changed.

A manual run is never refused for drift. The queue drain quarantines both refusals under their own reason, so a drifted request is never replayed after the change is approved. The fix is to review the change, then run `bots enable <id>` or run the bot by hand once.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.skilled/skills/system-skilled-bots/runtime/lib/approval.ts` | Shared | Digests, `approveDefinition`, `readApproval` and `checkApproval` with its two refusals |
| `.skilled/skills/system-skilled-bots/runtime/lib/runner.ts` | Shared | Checks approval first for unattended runs and approves on a manual run |
| `.skilled/skills/system-skilled-bots/runtime/lib/installer.ts` | Shared | Approves on install and on enable, with or without a schedule |
| `.skilled/skills/system-skilled-bots/runtime/lib/state-root.ts` | Shared | `approvalFile`, the per-bot approval path |
| `.skilled/skills/system-skilled-bots/runtime/lib/request-drain.ts` | Shared | Quarantines a refused queued run under its cause |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.skilled/skills/system-skilled-bots/runtime/tests/approval.vitest.ts` | Vitest | Unapproved and drifted refusals for queued, scheduled and resume runs, a planted precheck never run and approval by a manual run |
| `.skilled/skills/system-skilled-bots/runtime/tests/installer.vitest.ts` | Vitest | Install approves the vetted definition and config, and enable approves the current ones |
| `.skilled/skills/system-skilled-bots/manual-testing-playbook/request-queue/drift-refused-before-run.md` | Manual playbook | A queued request for a bot whose BOT.md changed after approval is quarantined and never dispatched |

---

## 4. SOURCE METADATA

- Group: Runs
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `runs/definition-approval.md`

Related references:
- [bot-runner.md](bot-runner.md) - the check order approval opens
- [../requests/queue-drain.md](../requests/queue-drain.md) - where a refused queued run is quarantined
- [../scheduling/launchd-installer.md](../scheduling/launchd-installer.md) - the install and enable that write an approval
