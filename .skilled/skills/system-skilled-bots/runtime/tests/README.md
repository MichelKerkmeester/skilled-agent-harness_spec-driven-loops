---
title: "system-skilled-bots runtime tests"
description: "Vitest suites, shared test worlds and the post-commit hook harness for the system-skilled-bots runtime."
trigger_phrases:
  - "skilled bots runtime tests"
  - "bots vitest suites"
---

# system-skilled-bots / runtime / tests

---

## 1. OVERVIEW

This folder is the executable test surface for the bots runtime. Each .vitest.ts file covers one `lib/` module or one end-to-end behavior of the request pipeline. Four support files build the temp worlds those suites share. One shell harness drives the post-commit hook leg.

Every test works in temp folders outside the checkout: a temp state root, temp repositories, a temp Skilled tree and a temp agents folder. Executors are stubs first on a PATH that holds nothing else, and `launchctl` is answered by an in-process stand-in. No test calls a model or the real scheduler, and none writes the operator's state root or agents folder.

---

## 2. DIRECTORY TREE

```text
tests/
├── fixtures/                 # BOT.md inputs, stub binaries and child drivers
├── support.ts                # Temp worlds and isolated git
├── runner-support.ts         # Runner worlds with a stub codex on PATH
├── queue-support.ts          # Queue folders, records and one drain pass
├── status-support.ts         # Run records, install records and a launchctl stand-in
├── post-commit-leg.test.sh   # Hook harness, run by hand
└── *.vitest.ts               # One suite per module or behavior
```

---

## 3. FILES

### Support

| File | Responsibility |
|---|---|
| `support.ts` | Creates temp state roots, temp repositories and a temp Skilled tree, and runs git with a temp HOME and no system config. |
| `runner-support.ts` | Builds runner worlds from `fixtures/bots/` with the stub executors from `fixtures/stub-executor/` first on PATH. |
| `queue-support.ts` | Names a world's queue folders and run records, writes needs-you items to the state root and runs one drain pass with the recursion guard's host reads pinned empty. |
| `status-support.ts` | Builds run records, needs-you items, install records with their job files and a stand-in for `launchctl`, all in temp folders. |

### Contracts and Schedule

| File | Responsibility |
|---|---|
| `definition.vitest.ts` | Worked BOT.md shapes, rejected definitions, isolation resolution, the author template and executor bounds. |
| `repo-config.vitest.ts` | `readRepoConfig` defaults and named refusals. |
| `identity.vitest.ts` | The shared resolver shape, `identityGuard`, two checkouts of one origin and `identityKey`. |
| `identity-refusal.vitest.ts` | A repository with no remote and no declared identity cannot enqueue and writes nothing. |
| `state-root.vitest.ts` | `userStateRoot`, the user-level layout, run folders and placement guards. |
| `approval.vitest.ts` | Unattended runs refuse a bot nobody approved and a `BOT.md` or bots config changed since approval, never run a planted precheck and run again once a manual run approves the change. |
| `run-record.vitest.ts` | Record validation, the `awaiting-decision` exit and worktree evidence. |
| `switches.vitest.ts` | The disable and pause stop files. |
| `needs-you.vitest.ts` | Needs-you item validation and derived state. |
| `cron-translator.vitest.ts` | Cron field forms expanded to calendar dictionaries, with each refusal asserted by id. |
| `slot-lister.vitest.ts` | Slot listing under a fixed time zone across both daylight-saving changes of 2026, checked against a minute-by-minute cron walk. |
| `slot-accounting.vitest.ts` | Grace windows, lateness classes and skipped-slot summaries on records the runner writes. |
| `label.vitest.ts` | Bot labels, drain labels and the refusal to parse foreign labels. |

### Runner, Dispatch and Isolation

| File | Responsibility |
|---|---|
| `runner.vitest.ts` | Manual runs, refusals before dispatch, a timed-out precheck ended with its whole process group, stops during dispatch, needs-you decisions and lineage cleanup. |
| `cli-run.vitest.ts` | `bots run --schedule-index` is a usage error unless the scheduled-fire marker is set, the job values stay out of the child and the precheck, and the run usage text names both the shared checkout and the worktree. |
| `runner-hardening.vitest.ts` | A run that throws or cannot record its result ends with one record and a released lease, and an unreadable needs-you item holds the bot without dispatch. |
| `runner-kill.vitest.ts` | A run killed mid-dispatch holds its lease while alive, then is reclaimed and closed as unknown once its owner is gone. |
| `dispatch.vitest.ts` | The secret-literal detector, the bot prompt, the decision marker parser and the final answer reader. |
| `posture.vitest.ts` | The posture matrix over executor kinds. |
| `result-ledger.vitest.ts` | Result events through the append gateway, stored once per key. |
| `isolation.vitest.ts` | Worktree placement, removal, a tree kept for gitignored changes, worktree runs through the runner and a parked worktree run with its resume. |
| `delivery.vitest.ts` | Target resolution and the desktop channel, sent to a stub that counts calls. |

### Request Pipeline

| File | Responsibility |
|---|---|
| `request-record.vitest.ts` | The idempotency key comes from the event, never the body, and a resume keys on its item. |
| `request-queue.vitest.ts` | Every queue move is one rename between sibling folders. |
| `dedupe.vitest.ts` | One source event sent twice with a changed payload runs once. |
| `quarantine.vitest.ts` | Every refused request leaves the watched folder with its reason and is never replayed. |
| `retry.vitest.ts` | A failing request runs at most the retry bound, then quarantines. A run that already ran or an author error quarantines at once, and a missing executor stops the pass without spending an attempt. |
| `race.vitest.ts` | Two drain processes released together against one request leave exactly one run. |
| `queued-run.vitest.ts` | A drained request's prompt reaches the run, and the runner writes its record once. |
| `resume.vitest.ts` | Resume requests keyed by the needs-you item, drained like any request, and scheduled or queued runs held while an answered item waits for its resume. |
| `answer.vitest.ts` | `bots answer` records the answer before one resume request, and items can expire. |

### Installer, Status and Checker

| File | Responsibility |
|---|---|
| `installer.vitest.ts` | The install transaction, the disabled default, preflight with its `registered-roots-unreadable` refusal, uninstall, the drain job, the pinned state root and identity, the approval install and enable write, and job environments resolved from other shells. |
| `status-index.vitest.ts` | Index build and rebuild parity, retention bounds and what retention never deletes. |
| `status.vitest.ts` | Reading `launchctl print`, every row state, needs-you rows, the reinstall flag and unregister. |
| `bot-check.vitest.ts` | Runs `../../scripts/bot-check.cjs` on a temp copy of every fixture under `../../scripts/fixtures/` and checks one defect per hard invariant, a folder that differs from its bot id included. |
| `post-commit-leg.test.sh` | Commits through the real post-commit hook in temp repositories and counts what lands in the watched folder of a temp state root. Vitest does not collect it. |

---

## 4. VALIDATION

Run from the repository root. Vitest collects only the .vitest.ts files.

```bash
cd .skilled/skills/system-skilled-bots/runtime && npm test
```

Expected result: every suite passes and Vitest exits 0.

The hook harness is a separate script. It prints one `PASS:` or `FAIL:` line per row and exits 0 only when every row passes.

```bash
bash .skilled/skills/system-skilled-bots/runtime/tests/post-commit-leg.test.sh
```

---

## 5. RELATED

- [Runtime overview](../README.md)
- [Runtime library](../lib/README.md)
- [Test fixtures](fixtures/README.md)
- [Checker fixtures](../../scripts/fixtures/README.md)
