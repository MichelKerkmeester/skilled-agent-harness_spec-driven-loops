---
title: "Bot runner"
description: "Runs one bot once in a fixed order of checks, with distinct exit codes for a completed, failed, refused, recursion-guarded or parked run."
trigger_phrases:
  - "bot runner"
  - "bots run"
  - "run a bot manually"
  - "/bots:run"
  - "bot run exit codes"
version: 1.0.0.0
---

# Bot runner (bots run)

## 1. OVERVIEW

Runs one bot once in a fixed order of checks, with distinct exit codes for a completed, failed, refused, recursion-guarded or parked run.

Every way a run starts (by hand, from a schedule or from a queued request) ends in the same runner. A stop before dispatch is a refusal with a named cause and never a run failure, so a scheduler or the queue drain can tell "did not start" from "broke". The run mode reaches it through `bots run <id>`.

---

## 2. HOW IT WORKS

### Check Order

The runner checks definition approval, the disable switch, the needs-you hold, the lease, the pause switch, the precheck, the posture and the secret check, then dispatches and records the result. Each refusal records a cause such as `definition-unapproved`, `definition-drifted`, `disabled`, `lease-held`, `precheck-failed`, `precheck-silent`, `posture-refused` or `body-secret`. An unknown bot id is refused without a record, and a malformed definition is refused with one.

Approval applies to a scheduled fire, a queued request and a resume. A manual run is never refused for drift, and it approves the definition and config it runs. A scheduled or queued run, but never a resume or a manual run, also waits as `awaiting-resume-hold` while an answered needs-you item of the same bot still waits for its resume, so the resume finds the lease free and no newer question in its way.

### Precheck

The precheck is a shell command that runs in the checkout in a process group of its own, for up to 60 seconds. A nonzero exit refuses the run as `precheck-failed`, and output holding `[SILENT]` refuses it as `precheck-silent`. On timeout the whole group gets SIGTERM, then SIGKILL after 2 seconds, so a process the command left in the background cannot keep working in the checkout while the run goes on.

### Exit Codes

`bots run` exits 0 when the run completed, 1 on a run failure, 2 on a usage error, 3 when the recursion guard refused, 4 when the run was refused before dispatch and 5 when the run parked a needs-you item. A run that ends at exit 5 holds every later run of that bot until its item is answered or expires. Only the installed schedule may pass `--schedule-index`, because its job file sets `SKILLED_BOTS_SCHEDULED_FIRE`. A hand-typed `bots run --schedule-index` is a usage error and exits 2, and so does a fire of a job file installed before that marker existed, which `bots schedule install <id>` repairs.

### Lease, Timeout And Kill

The lease is the deep-loop loop lock, keyed by bot, repository and spec target and never by a checkout path, and it is released on every exit path the process survives. A run is bounded by the shorter of its budget duration and its `timeoutSeconds`. A stuck invocation is classed as a timeout and a budget stop keeps its own class, even when the child printed a decision marker first. A run killed outright leaves a lease that the pid, nonce and heartbeat rule reclaims, and only then, with the owner proved gone, is the killed run's record closed as unknown.

### Recursion Guard And Resilience

Dispatch goes through the deep-loop audited runner, whose recursion guard refuses a dispatch before spawn when the executor kind is already in the process ancestry, the dispatch stack, its own session variables, a fan-out lineage or a dispatch lockfile. That refusal exits 3 and dispatches nothing. The child also receives the `SKILLED_BOT_RUN_ID` run marker and the child-session flag, and a commit made inside a bot run enqueues nothing, so a bot cannot trigger itself. A throw anywhere inside the run still ends in exactly one record and a released lease, so no run vanishes without a trace.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.skilled/skills/system-skilled-bots/runtime/lib/runner.ts` | Shared | Check order, refusal causes, exit codes, precheck process group, lease, bound and killed-run reclaim |
| `.skilled/skills/system-skilled-bots/runtime/lib/approval.ts` | Shared | The approval check that opens the order for unattended runs |
| `.skilled/skills/system-skilled-bots/runtime/lib/needs-you.ts` | Shared | `itemAwaitingResume`, the answered item that holds scheduled and queued runs |
| `.skilled/skills/system-skilled-bots/runtime/lib/dispatch.ts` | Shared | The guard environment with the run marker and the audited dispatch |
| `.skilled/bin/bots.cjs` | Handler | The `run` verb and the outcome-to-exit mapping |
| `.skilled/commands/bots/run.md` | Handler | The `/bots:run` command router |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.skilled/skills/system-skilled-bots/runtime/tests/runner.vitest.ts` | Vitest | Happy path, refusals, exit codes, recursion guard, timeout and budget classes and a timed-out precheck ended with its process group |
| `.skilled/skills/system-skilled-bots/runtime/tests/cli-run.vitest.ts` | Vitest | A hand-typed `--schedule-index` exits 2 and the scheduled-fire marker admits it |
| `.skilled/skills/system-skilled-bots/runtime/tests/resume.vitest.ts` | Vitest | Scheduled and queued runs held while an answered item waits for its resume |
| `.skilled/skills/system-skilled-bots/runtime/tests/runner-kill.vitest.ts` | Vitest | A run killed mid-dispatch is reclaimed and closed as unknown |
| `.skilled/skills/system-skilled-bots/runtime/tests/runner-hardening.vitest.ts` | Vitest | A throwing run ends in one record and releases its lease |
| `.skilled/skills/system-skilled-bots/bots-run/references/run-queue-and-answer.md` | Reference | Run verbs and exit codes for operators |
| `.skilled/skills/system-skilled-bots/manual-testing-playbook/hub-routing/run-named-bot.md` | Manual playbook | Routes a run request to the run mode |

---

## 4. SOURCE METADATA

- Group: Runs
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `runs/bot-runner.md`

Related references:
- [definition-approval.md](definition-approval.md) - the approval check that opens the order
- [executor-posture-and-secret-guard.md](executor-posture-and-secret-guard.md) - the posture and secret checks before dispatch
- [run-record-and-result-ledger.md](run-record-and-result-ledger.md) - the record every run ends in
