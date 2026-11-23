---
title: "Queue drain"
description: "Claims every queued request once, runs it and routes the outcome to done, retry or quarantine."
trigger_phrases:
  - "queue drain"
  - "bots drain"
  - "drain the bot queue"
  - "bot request quarantine"
version: 1.0.0.0
---

# Queue drain (bots drain)

## 1. OVERVIEW

Claims every queued request once, runs it and routes the outcome to done, retry or quarantine.

`bots drain` is one pass over the watched inbox, and every request leaves it. The installed drain job runs the same pass whenever the inbox holds something, so a request queued by a commit or an answer runs without the operator starting it.

---

## 2. HOW IT WORKS

### Routing

Each request is claimed by rename and handed to the bot runner. A completed run or a run parked on a question is done. A refusal is quarantined with its cause, because running it again would be refused the same way. The exceptions are `lease-held` and `awaiting-resume-hold`, "not now" refusals that count an attempt and go back to the inbox until the retry bound. The second means an answered question of the same bot still waits for its resume, and it lifts once that resume runs. A request for a bot whose definition nobody approved, or whose `BOT.md` or `bots/config.json` changed since approval, is quarantined as `definition-unapproved` or `definition-drifted`. A request for a paused bot or for a bot held by an open question is quarantined too, with the reason `held-needs-you` for the hold, and it is not replayed when the pause lifts or the question is answered. A request whose target repository does not match the drain's is quarantined as `target-mismatch`.

### Retry Bound

A run failure goes back to the inbox until the retry bound, then to quarantine with the reason `retry-bound` and a reason file. Two failures skip the retry and are quarantined at once under their own reason. `result-event-unrecorded` means the run already ran and its work is on disk, so a second dispatch would do the work twice. `decision-marker-empty` is the definition's own error and repeats on every attempt. A pass handles only what was in the inbox when it started, so a request retried in this pass waits for the next one. A malformed request is quarantined as `malformed-request`.

### Setup Failures And Backoff

Only a setup fault that would hit every request alike stops the pass: no identity, no usable run folder or `executor-unavailable`, an executor that is not on the PATH the runs get. The claimed request is put back and no attempt is counted, so a broken setup never burns the queue. `bots drain` then exits 1. The installed drain job throttles its fires and backs off with a growing delay after repeated failed passes.

### Output

The pass prints one line per request with its id and outcome (`ran`, `retry`, `quarantined` or `lost-claim`).

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.skilled/skills/system-skilled-bots/runtime/lib/request-drain.ts` | Shared | The drain pass and outcome routing |
| `.skilled/skills/system-skilled-bots/runtime/lib/request-queue.ts` | Shared | Claim, finish, retry, release and quarantine with reason files |
| `.skilled/skills/system-skilled-bots/runtime/lib/installer.ts` | Shared | The scheduled drain job with throttle and backoff |
| `.skilled/bin/bots.cjs` | Handler | The `drain` verb |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.skilled/skills/system-skilled-bots/runtime/tests/queued-run.vitest.ts` | Vitest | A queued request runs through the drain |
| `.skilled/skills/system-skilled-bots/runtime/tests/quarantine.vitest.ts` | Vitest | Refusals and holds go to quarantine with a reason |
| `.skilled/skills/system-skilled-bots/runtime/tests/retry.vitest.ts` | Vitest | Failures retry until the bound, a run that already ran or an author error quarantines at once and a missing executor stops the pass without an attempt |
| `.skilled/skills/system-skilled-bots/runtime/tests/resume.vitest.ts` | Vitest | A request queued behind an answer waits for the resume, then runs |
| `.skilled/skills/system-skilled-bots/runtime/tests/approval.vitest.ts` | Vitest | Unapproved and drifted queued runs are refused |
| `.skilled/skills/system-skilled-bots/runtime/tests/race.vitest.ts` | Vitest | Concurrent drains leave exactly one run record joined to each request |

---

## 4. SOURCE METADATA

- Group: Requests
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `requests/queue-drain.md`

Related references:
- [request-queue.md](request-queue.md) - the folders and renames the drain moves requests through
- [commit-triggered-requests.md](commit-triggered-requests.md) - a producer whose requests the drain runs
