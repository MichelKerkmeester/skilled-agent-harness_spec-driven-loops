---
title: "Run delivery"
description: "Announces each run's outcome to its declared targets at most once, after the terminal record is written."
trigger_phrases:
  - "run delivery"
  - "bot delivery targets"
  - "bot desktop notice"
  - "delivery at most once"
version: 1.0.0.0
---

# Run delivery

## 1. OVERVIEW

Announces each run's outcome to its declared targets at most once, after the terminal record is written.

An unattended run that fails is silent until someone reads the state root, so every run tells its declared targets what happened. A duplicate notice costs more than a lost one, so a send whose result is uncertain is never retried.

---

## 2. HOW IT WORKS

A bot with `delivery: local-only` sends nothing. Otherwise its targets receive the notice, and a failed run uses the separate failure targets when the definition names them. A refusal that is not a failure (a held lease, a skipped precheck or a disabled bot) tells nobody. A run that parked a question sends a notice for its needs-you item. A target on an unknown channel is recorded `not-attempted` with the evidence `channel-unsupported`.

The shipped channels are `local-only` and the macOS desktop notice. Nothing acknowledges a desktop notice, so it can claim `attempted` and never `delivered`. A message carries the bot id, run id, outcome, evidence pointers, a kept worktree's path and branch and a parked run's question. It never carries a command line or an environment value, and a body that holds a known secret literal is withheld rather than sent.

A send is claimed before it is made, by creating a claim file exclusively and recording the entry as claimed, so no pass sends the same notice twice. An uncertain result is recorded `unknown`. Delivery starts only after the run's terminal record exists and only ever changes the record's delivery entries, so a failed send never changes the run's outcome.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.skilled/skills/system-skilled-bots/runtime/lib/delivery.ts` | Shared | Target resolution, the desktop sender, message build and claimed delivery |
| `.skilled/skills/system-skilled-bots/runtime/lib/run-record.ts` | Shared | The delivery states each entry records |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.skilled/skills/system-skilled-bots/runtime/tests/delivery.vitest.ts` | Vitest | Target resolution, the desktop channel and delivery through the runner |
| `.skilled/skills/system-skilled-bots/scripts/fixtures/delivery-channel-unknown` | Fixture | A definition with a delivery channel the checker must refuse |

---

## 4. SOURCE METADATA

- Group: Operator loop
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `operator-loop/run-delivery.md`

Related references:
- [needs-you-items.md](needs-you-items.md) - the parked runs whose question a notice carries
- [stop-switches.md](stop-switches.md) - disabled runs that send no notice
