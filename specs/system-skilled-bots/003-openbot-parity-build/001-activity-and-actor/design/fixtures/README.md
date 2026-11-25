---
title: "Fixtures: Activity and actor inputs and expected outputs"
description: "The state-root inputs that reproduce the terminal screen's activity and inbox samples, the queued-request, inbox --all, legacy-record and empty cases, the vitest file that reads each and the type-check rule for the screen's sample payloads."
trigger_phrases:
  - "activity fixtures"
  - "one data set state root"
  - "inbox all fixture"
importance_tier: "normal"
contextType: "implementation"
version: 1.0.0.0
---

# Activity and actor fixtures

Each file is an input this phase's tests write into a temporary state root, with the output the read must give. The expected payloads for the one data set are not copied here: they are the screen's own samples in `003-terminal-screen/002-architecture-and-contracts/design/payloads/`, so the runtime and the screen are tested against the same files. Paths in the JSON are repository-relative.

## Files

| File | Holds | Read by |
|------|-------|---------|
| `one-data-set.json` | Six run records, three items, one live lease, three install records and the clock that together give `payloads/activity.json` and `payloads/inbox.json` | `activity.vitest.ts`, tests `order`, `row sources` and `refresh on read`. `cli-run.vitest.ts`, test `payload types` |
| `queued-request.json` | One queued request and the `scheduled` row it gives | `activity.vitest.ts`, test `row sources` |
| `inbox-all.json` | One open item, one answered item with `by` and `scope`, one answered before this phase and both `inbox --json` outputs | `cli-run.vitest.ts`, test `answered item` |
| `legacy-records.json` | What an answer, a record, a summary, a lease side file, an install record and an index written before this phase read as | `needs-you.vitest.ts` test `old answer`, `run-record.vitest.ts`, `status-index.vitest.ts` test `old-ddl`, `activity.vitest.ts` test `row sources` |
| `empty.json` | The empty outputs of both verbs in both forms | `activity.vitest.ts` test `empty`, `cli-run.vitest.ts` test `inbox empty` |

## How a test builds the one data set

1. Set `process.env.TZ` to `UTC` before the first `Date` is made, because the cron `15 */6 * * *` must give `2026-11-26T00:15:00.000Z`, as the screen's fixed facts assume. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/002-architecture-and-contracts/design/contracts.md:44-46]
2. Each entry of `records` is the file `recordBase` names, with every dotted path in `recordBaseDrop` deleted, then every dotted key of the entry set. A record entry with no `actor` key is a record written before this phase. Write each through `writeRunRecord`.
3. Write each of `items` through `writeNeedsYouItem`.
4. For each of `leases`, compute the lease path with `leaseFile(stateRoot, identity, leaseKey(identity, botId, specFolder))`, create that file and write the side file at `<lease>.run.json` with `ownerPid` set to `process.pid`.
5. Write each of `installs` at `installFile(stateRoot, identity, botId)` as a full install record with `schemaVersion: 1`, `identity` and `checkoutRoot` set to the data set's top-level values, `labels` set to the one label `buildBotLabel(identity, botId, 0)` gives, or `buildDrainLabel(identity)` for the drain, and every other key set to any value `readInstallRecord` accepts.
6. Build the index with `rebuildIndex`, then call `activityReport` at `clock`. With `describe` built from the `describe` map the payload must deep-equal `expect.activityWithDescribe`. With no `describe` it must deep-equal `expect.activityWithoutDescribe`.

The held `archive` install and the `drain` install give no row, which proves the two filters without changing the expected payload.

## The payload type check

The T033 check compares the real output of `bots status --json`, `bots activity --json` and `bots inbox --json` against `status.json`, `activity.json` and `inbox.json` in the screen's `design/payloads/`. It compares each key's JSON type against the Type and Null columns of the screen contract's sections 4 to 6, never against the literal value in the sample: a key whose Null column allows null passes as null or as the stated type. It checks only keys whose Producer column says `today` or `packet 001`. So `lastRun.branch` and `lastRun.worktreePath`, which packet 004 adds, are not checked here, and `schedule`, which is null until 002 lands, passes as null.

## Check every file parses

```bash
node -e 'require("fs").readdirSync(process.argv[1]).filter((n) => n.endsWith(".json")).forEach((n) => JSON.parse(require("fs").readFileSync(process.argv[1] + "/" + n, "utf8"))), console.log("done")' specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor/design/fixtures
```

It runs from the repository root, prints `done` and exits 0. A file that does not parse throws and exits 1.
