# system-skilled-bots runtime review (independent, read-only)

Scope: every module under `.skilled/skills/system-skilled-bots/runtime/lib/`, `scripts/bot-check.cjs`, `.skilled/bin/bots.cjs`, the post-commit leg, the bots-run reference, and the shared deep-loop code the runner leans on (`executor-audit.ts`, `loop-lock.ts`, `fanout-run.cjs` builders). Contracts: the parent spec and decision record, and spec, decision record and acceptance criteria of phases 001 to 008. Worktree `/Users/michelkerkmeester/worktrees/public/system-skilled-bots`, branch `system-skilled-bots`, HEAD `f4c318d856a`.

## 1. Verdict

The runtime is careful work. The file queue, temp-and-rename writes, fail-closed switch and hold reads, path segment guards, label grammar, plist rendering and cron translator all hold up, and the suite and typecheck are green. There is one P0. A shared-isolation bot with the default `workspace-write` sandbox can edit `bots/config.json` or its own `BOT.md` in the checkout. On its next unattended fire it then escapes the pause switch and the needs-you hold, and its `precheck` runs as unsandboxed shell. The design promise that a run cannot reach its own control state therefore holds only for direct writes, not for this indirect route. There are five P1s:

- worktree removal deletes gitignored bot output;
- the drain re-dispatches runs whose work already finished, which contradicts phase 003;
- an answered item can lose its resume permanently;
- a timeout leaves the executor's process tree alive;
- the scheduled drain burns every queued request, including resume requests, under launchd's bare PATH.

The last one comes from a known open item, but this consequence of it is not recorded. Nothing found makes the green suite wrong. The defects sit in paths the tests do not exercise.

## 2. Findings

### P0

**BOT-R-01 · P0 · Security · CONFIRMED (traced through code, not run end to end)**
- Where: `.skilled/skills/system-skilled-bots/runtime/lib/runner.ts:644` (context from the live checkout config), `runner.ts:255-268` (`resolveBotContext` reads `bots/config.json` and calls `userStateRoot`), `state-root.ts:95` (`config.stateRoot` wins over `XDG_STATE_HOME`), `installer.ts:693` (`jobEnv` returns the bare environment as soon as the config names a `stateRoot`), then `runner.ts:752`, `:762` and `:841` (the disable switch, the hold and the pause, all read under the redirected root), and `runner.ts:845-846` with `:506-513` (the precheck runs as `/bin/sh -c` in the checkout). The definition digest is computed at `runner.ts:661` and never compared with anything.
- Defect: the runner re-reads `bots/config.json` and `bots/<id>/BOT.md` from the checkout on every run. A shared-isolation child with checkout write access can change them, and the next run obeys the change.
  - The config's `stateRoot` or `identity` decides where the switches, needs-you items, leases and slot snapshots are looked up.
  - The `BOT.md` decides the precheck command, the sandbox and the isolation.
  - Nothing at fire time checks either file against what was installed or last vetted. The installer runs the checker and the posture check only at install (`installer.ts:531-547`).
- Failing scenario:
  1. A cron bot on `cli-codex` has no `sandbox` declared, so it resolves to `workspace-write` (`executor-config.ts:722-723`), and has `defaultIsolation: shared`. It is installed and enabled.
  2. The operator runs `bots pause <id>`, or the bot has an open needs-you item.
  3. A prompt-injected run writes `"stateRoot": "/tmp/x"` (or `"identity": "a/b"`) into `bots/config.json`.
  4. The next launchd fire resolves `/tmp/x`. It finds no paused switch, no item and no lease, so it dispatches. A paused or held bot runs.
  5. Alternatively, the run writes `precheck: "curl ... | sh"` into its own `BOT.md`. The next fire runs that command through `runPrecheck`, outside codex's seatbelt, with the common environment. That is a sandbox escape.
  - `bots disable` still stops launchd fires, because it boots the job out. A manual `bots run` or a drained request under the redirected root bypasses the disable too.
- Spec broken:
  - parent `spec.md:193` (success criterion 4, "no switch or needs-you item sits in a file a run can write") and `spec.md:226` (§6 State placement, "A run must not be able to write its own control state");
  - 003 `spec.md:183` REQ-006 and `spec.md:204` REQ-022.
  - This conflicts with 001 `spec.md:161` REQ-003, which honors a checkout-side `stateRoot` override. No spec document covers a run that edits its definition (grep of every phase spec found nothing).
- Suggested fix: on `scheduled` and `queued` runs, compare the resolved identity, the state root and the definition digest with the install record, or with a vetted digest kept under the state root. Refuse on drift with a named cause such as `definition-drifted`, and have `bots enable` or `bots schedule install` re-vet the files. Alternatively, move `stateRoot` and `identity` out of the checkout for scheduled jobs: pin both in the job file and ignore the checkout values on a scheduled fire. Run the precheck under the same posture the executor gets, or refuse a precheck on a write-capable shared bot.

### P1

**BOT-R-02 · P1 · Data loss · CONFIRMED (git behaviour reproduced; the `finishBotWorktree` path traced, not run)**
- Where: `isolation.ts:600` (`git status --porcelain=v1 -z --untracked-files=all`, without `--ignored`) and `isolation.ts:695` (plain `git worktree remove`).
- Defect: `git status` without `--ignored` does not list gitignored files, and `git worktree remove` deletes a tree that holds only ignored changes. A bot whose output lands in a gitignored path, such as a report under an ignored `out/`, `tmp/`, `.env.local` or build folder, therefore has its tree judged clean and removed.
- Repro, in a scratch repo:
  1. `.gitignore` holds `out/`.
  2. `git worktree add`, then write `out/report.md` in the tree.
  3. `git status` prints nothing, and `git worktree remove` exits 0 and deletes the tree along with the report.
- Spec broken: parent `spec.md:222` (invariant 6, "A dirty or unmerged worktree is never reclaimed automatically"), 004 `spec.md:133` REQ-003, and the module's own promise at `isolation.ts:20`: "losing a bot's work is worse than a tree left on disk".
- Suggested fix: add `git status --porcelain --ignored=matching` (or `git ls-files --others --ignored --exclude-standard --directory`) to `unexpectedChanges`, filtering out the recorded links and the created folders. Keep the tree with reason `ignored-changes` when anything remains.

**BOT-R-03 · P1 · Contract conflict between phases · CONFIRMED (`routeOutcome` called directly)**
- Where: `request-drain.ts:110-111` (every `failed` outcome routes to `retry`), `request-drain.ts:209-213`, and `runner.ts:1053-1068` (a run whose result event could not be recorded ends `failed`, reason `result-event-unrecorded`).
- Defect: the runner header (`runner.ts:15-17`) and 003 REQ-011 say a failed result write is retried by replaying the event, and the run is never dispatched twice. The drain, following 005 ADR-002, retries every `failed` outcome by dispatching the whole run again. That includes `result-event-unrecorded`, where the child has already finished and its side effects (commits, edits) are on disk, and `needs-you-item-refused:*`.
- Failing scenario: a queued bot run completes and commits, but its gateway append fails three times. The run ends `failed / result-event-unrecorded`, and the drain re-enqueues it with `attempts` 1. Two more full dispatches of the same work follow before quarantine. Calling `routeOutcome({kind:'failed', reason:'result-event-unrecorded', ...})` returns `{"kind":"retry"}`, and `decision-marker-empty` (class `author`, deterministic) does too.
- Spec broken: 003 `spec.md:196` REQ-011 against 005 `decision-record.md:131` ADR-002. This review does not pick a side. One of the two documents has to change.
- Suggested fix, if 003 prevails: route `result-event-unrecorded`, and any `failed` whose record says the child was dispatched and exited cleanly, to `done` or to quarantine, never to `retry`. Optionally do not retry deterministic `author`-class failures either.

**BOT-R-04 · P1 · An answered item can lose its resume for good · PLAUSIBLE (each step traced)**
- Where: `answer.ts:92-110` (the answer is written before the enqueue, so the hold lifts at once), `runner.ts:762` (the hold applies to a resume like any run), `request-drain.ts:89` and `:118` (`lease-held` is retried and counts an attempt), `request-drain.ts:114` (a hold refusal is quarantined `held-needs-you`), and 005 `decision-record.md:189` (a quarantined resume cannot be re-sent through any verb).
- Defect: between `bots answer` and the resumed run, the bot is no longer held, so its schedule fires freely. Two chains then lose the resume permanently:
  - (a) The scheduled run holds the lease. The drain job (60 s throttle) gets `lease-held` three times, and the resume is quarantined `retry-bound` after about two minutes.
  - (b) The scheduled run parks a new question (item Y). The resume of X is then refused `awaiting-decision-hold` and quarantined `held-needs-you`.
  In both chains the answered item X stays answered, holds nothing, and its parked worktree stays `kept` (`awaiting-decision`) forever.
- Failing scenario: an hourly bot whose runs take 10 minutes. The operator answers during a run, and the resume is quarantined before that run ends. The only recovery is deleting the seen-key marker by hand.
- Spec broken: parent `spec.md` success criterion 10 ("`bots answer` enqueues one `resume` request, and the resumed run carries the question and answer"). The individual rules are each documented. This chain is not.
- Suggested fix: hold scheduled and queued runs of a bot while it has an answered item whose resume has not run, which is the same predicate retention already uses at `status-index.ts:518-519`. Alternatively, route `lease-held` for a `resume` request back without counting an attempt, and exempt a resume from a hold created after its own item was answered.

**BOT-R-05 · P1 · Timeout leaves the executor's process tree alive · mechanism CONFIRMED by repro, impact PLAUSIBLE**
- Where: `dispatch.ts:601` calls `runAuditedExecutorCommand`, which runs `spawnSync` with `timeout` and the default `killSignal` (`executor-audit.ts:1607-1615`). The precheck has the same shape (`runner.ts:507-513`).
- Defect: on timeout, Node signals only the direct child. Repro: `spawnSync('sh', ['-c', 'sleep 23 & sleep 23'], {timeout: 1000, stdio: ['pipe', fd, 'pipe']})` returned in 1004 ms with `SIGTERM/ETIMEDOUT`, and both `sleep 23` processes were still alive afterwards (`pgrep`; killed after the check). Any tool subprocess, shell or MCP server the executor started survives unless the CLI forwards the signal itself. The runner then:
  - inspects and may remove the worktree while an orphan still writes into it (`runner.ts:1076`);
  - writes the terminal record and releases the lease (`runner.ts:1110`).
- Failing scenario: in a `bots drain` pass, or a manual `bots run` from a terminal, a timed-out codex run's tool process keeps editing the shared checkout. The drain's next request for the same bot acquires the lease and dispatches into the same checkout at the same time. Under launchd the orphans die only when the job process exits and launchd reaps its process group, which is after the record and the tree decision.
- Spec broken: 003 `spec.md:193` REQ-008 ("`timeoutSeconds` stops a stuck invocation") and 003 `spec.md:180` REQ-003 ("A second concurrent run of the same bot is refused at the lease"). The lease is released while the old run's processes still work.
- Suggested fix: spawn the executor (and the precheck) as its own process group (`detached: true` with the async API plus a sync wait, or a small wrapper) and kill the group with `-pid`, SIGTERM then SIGKILL after a grace period, before judging the tree or releasing the lease.

**BOT-R-06 · P1 · The scheduled drain quarantines every queued request under the bare PATH · CONFIRMED by trace (root cause already open; this consequence is not recorded)**
- Where: `bots.cjs:258` (`scheduledDrain` gets `env: process.env`, launchd's bare environment), `request-drain.ts:191-195` (runs execute under that `env`), `fanout-run.cjs:3636-3637` (`command -v codex` against the env's PATH throws `ExecutorUnavailableError`), `dispatch.ts:588-597` (`executor-unavailable`, a `failed` outcome), and `request-drain.ts:110-111` (retry). `routeOutcome` on `executor-unavailable` returns `{"kind":"retry"}`.
- Defect: 006 `spec.md:322` records that "a real scheduled dispatch fails" under launchd's PATH. It does not record the queue side. Once the drain job is installed and enabled, every request in the inbox fails `executor-unavailable`. That includes each `resume` request `bots answer` writes, and each git-commit request. Every one is retried and quarantined `retry-bound` within about two minutes (60 s throttle, bound 3). A quarantined resume cannot be re-sent (005 `decision-record.md:189`).
- Failing scenario: the operator installs `bots schedule install drain`, enables it, then answers an item. The answer is effectively lost about two minutes later.
- Suggested fix: until the PATH question at 006 `spec.md:322` is decided, refuse `bots schedule install drain`. Or classify `executor-unavailable` as a setup fault (the drain's `stop` route with back-off, which puts the request back) rather than a retryable failure.

### P2

**BOT-R-07 · P2 · Hold check is not atomic with the lease · PLAUSIBLE**
- Where: `runner.ts:762` (the hold is read) precedes `runner.ts:809` (the lease is acquired). The hold is not re-read once the lease is held. The lease key includes the spec folder (`runner.ts:283-285`), and a resume uses the item's spec folder (`runner.ts:798`).
- Defect:
  - A run that passed the hold check can take the lease just after another run of the bot parked and released it, and so run past an open item.
  - A resume and a regular run whose spec folders differ (the author edited `spec_folder` after the park) hold different leases and can run at once in one shared checkout.
- Spec broken: 003 `spec.md:204` REQ-022, and REQ-003's same-bot lease refusal.
- Suggested fix: re-check `holdForBot` immediately after `acquireLoopLock`, refusing with the lease released. Key the lease on identity and bot only, or add a per-bot lease beside the spec-target one.

**BOT-R-08 · P2 · `danger-full-access` is admitted · CONFIRMED by read**
- Where: `posture.ts:39` and `posture.ts:59-63`. A preventive kind honors every class. This is recorded as built in 003 `decision-record.md:236`.
- Defect: a `sandbox: danger-full-access` bot on codex, cursor or the DeepSeek Harness has no boundary. It can delete its own switch files, write needs-you items, or run `bots answer` on its own item.
- Spec broken: in tension with parent `spec.md:193` (success criterion 4). The ADR admits it explicitly, so this is a design question rather than a code bug.
- Suggested fix: refuse `danger-full-access` for unattended runs, or require a config opt-in that also records that success criterion 4 does not hold for that bot.

**BOT-R-09 · P2 · Install leaves a job with no record when the registered-roots file is damaged · CONFIRMED by trace**
- Where: `installer.ts:916` (`registerRoot`) runs after the move at `:866` and the bootstrap at `:873`, but before the install record at `:938`. `registerRoot` parses the file with no catch (`state-root.ts:278`). For a first install, `holdingClone` returns before reading the file (`installer.ts:751`), so no earlier step trips on it.
- Failing scenario: a corrupt `registered-roots` file. `bots schedule install x` throws after the plist is in place and launchctl has been told about it, and the CLI prints the raw error. No install record is written, so `bots enable` reports no schedule.
- Suggested fix: read the registered-roots file in the preflight, so it refuses before any write, or call `registerRoot` before the transaction.

**BOT-R-10 · P2 · A killed run can end with no record at all · CONFIRMED by trace**
- Where: `runner.ts:441` (`closeKilledRun` declines when the old pid is alive again after pid reuse) followed by `runner.ts:838` (the new run overwrites the side file, losing the killed run's seed). Also, nothing closes a killed run unless a later run of the same lease key reclaims it.
- Defect: the runner header (`runner.ts:17-18`) promises that "no run can vanish without a trace". Two cases break it: a Ctrl-C on a manual `bots run` whose bot is never run again, and a killed run whose pid is reused before the reclaim. Neither leaves a record, so status never shows the run.
- Suggested fix:
  - keep side files per run id rather than per lease;
  - have `bots status --rebuild` close any side file whose owner pid and nonce are gone.

**BOT-R-11 · P2 · Generation stamp lost update · PLAUSIBLE**
- Where: `state-root.ts:248-261`, a read-modify-write with no lock.
- Defect: two writers finishing in the same instant (two bots of one identity, or a run and a `bots answer`) can both write `N+1`. An index refreshed between the two then reads as fresh and misses the second change, such as a new needs-you item.
- Suggested fix: make the stamp monotonic and unique, for example `max(previous+1, Date.now()*1000 + random)`, or create one stamp file per change.

**BOT-R-12 · P2 · Held or paused fires grow state without bound · CONFIRMED by trace (partly recorded)**
- Where: `runner.ts:665-671`. Each refused scheduled fire still makes a run folder and writes a record.
- Defect: `pause` and the needs-you hold do not stop launchd. An every-minute bot held for the default 7 days writes about 10,000 records and run folders. Records are never pruned (007 `spec.md:256`).
- Suggested fix: write no run folder for a refusal before dispatch, and coalesce consecutive held or paused refusals of one schedule into the slot snapshot.

**BOT-R-13 · P2 · Checker and runner disagree on folder and id · CONFIRMED by read**
- Where: `bot-check.cjs:184` (a folder whose name differs from the id is advisory, `WARN`) against `runner.ts:726` and `installer.ts:538` (refused as `definition-malformed`).
- Defect: a definition the checker passes can never run, be enqueued (`request-queue.ts:201`) or be installed.
- Suggested fix: make `folder-id-mismatch` a hard invariant.

**BOT-R-14 · P2 · A manual `--schedule-index` corrupts slot accounting · CONFIRMED by trace**
- Where: `bots.cjs:435` accepts `--schedule-index` on a hand-typed `run`, and `recordScheduledFire` then writes the schedule's snapshot (`slot-accounting.ts:222-228`).
- Defect: the next real fire computes its skipped slots and lateness from the manual run's time.
- Suggested fix: accept `--schedule-index` only when the caller is the launchd job, for example an env marker the plist sets, or record a manual fire separately.

**BOT-R-15 · P2 · Index rebuild deletes the live index's WAL files · PLAUSIBLE**
- Where: `status-index.ts:718-719`.
- Defect: a concurrent `bots status` that holds the old database open in WAL mode can see `SQLITE_IOERR`, or lose a write made through `refreshItemRows`. The index is derived and can be rebuilt, so the impact is low.
- Suggested fix: rename the new file into place first, and let SQLite clean its own side files. Or take an exclusive lock file around the rebuild.

**BOT-R-16 · P2 · Minor contract mismatches · CONFIRMED by read**
- 005 `spec.md:166` REQ-012 lists `duplicate` as a drain outcome. The drain never emits it, and emits `lost-claim` instead (`request-drain.ts:48`).
- The CLI usage text at `bots.cjs:24` and `bots-run/references/run-queue-and-answer.md` say `bots run` runs "in the shared checkout". A worktree bot runs in its own tree.

**BOT-R-17 · P2 · Risky paths with no test**
- No drain test routes `result-event-unrecorded` (the grep finds it only in the runner and record tests).
- No test edits `bots/config.json` or `BOT.md` between two runs.
- No test finishes a worktree that holds ignored files.
- No test times out a child that spawned a grandchild.
- No test covers a resume losing the lease to a scheduled run.

## 3. Already recorded in the spec (not counted as findings)

- **Executors under launchd's bare PATH.** A real scheduled dispatch fails (006 `spec.md:322`). BOT-R-06 adds the queue consequence.
- **Drain throttle against the retry bound.** The bound is reached in two or three minutes while a long run holds the lease (006 `spec.md:323`).
- **Uninstall and its sweep ignore the clone rule** (006 `spec.md:324`). The sweep also removes another clone's job whose definition this clone lacks (`installer.ts:1159-1185`).
- **No interpreter check** in the needs-reinstall check (006 `spec.md:325`).
- **Status is stale after every run.** The runner never adds the run to the index (007 `spec.md:251`).
- **Run records are never pruned** (007 `spec.md:256`).
- **The lease-held, identity-unknown and run-folder-refused routing** departs from ADR-002 (005 `spec.md:273`).
- **Lone day fields are refused until the weekday probe runs** (002 `spec.md:240`, `cron-translator.ts:66`). As a result `@weekly`, `@monthly`, `@yearly` and the flagship `0 9 * * 1-5` all refuse today. Only crons that leave both day fields `*`, or restrict both with no `*`, install.

## 4. Checked and found sound

**State and queue writes**
- Every state write goes through `writeStateAtomic`: records, items, switches, install records, slot snapshots, the back-off file and registered roots. Plists go through `writeTextAtomic`.
- The queue: enqueue writes to `tmp/`, creates the seen marker exclusively, then renames into `inbox/`. A claim is one rename. Quarantine writes its reason file before the move. All folders are siblings, so each rename stays on one filesystem.
- The drain handles only the names present when the pass began. A stale claim is reported, never redispatched (005 NFR-R02). A target-identity mismatch is quarantined.

**Fail-closed reads**
- A damaged switch reads as set (`switches.ts:82-90`).
- A damaged item holds its bot, and so does an item whose `botId` cannot be read (`needs-you.ts:286-297`).
- An unlistable needs-you folder holds every bot.
- A damaged registered-roots file is never read as empty.

**Path safety**
- Bot ids, run ids, item ids, request `workflowId` and resume keys all pass `isSafeSegment`.
- `identityKey` percent-encoding cannot escape its folder.
- `pruneRunFolder` re-checks both the lexical and the real path tail before `rmSync`.
- Retention never prunes an open item, an item awaiting its resume, or the run folders they name.

**Scheduler surface**
- The label slug is one-to-one and decodes exactly, the reserved `drain` id is refused, and only the hub prefix parses.
- The plist accepts absolute paths only, escapes XML, and starts `ProgramArguments` with no shell.
- osascript receives its title and body as argv, never spliced into the script.
- The installer disables a held install before the file lands, refuses the kill switch, and never calls `launchctl load` (grep-verified in 006 scratch).

**Cron and slots**
- The translator follows Vixie cron's day-field rule: a `*`-led field forces AND, which is refused, and both fields restricted is OR. That matches launchd's either-match. Also correct: the 7 to 0 fold, steps, `a/n`, ranges, the `%` refusal, the `@reboot` refusal and the 128-dictionary cap.
- The slot lister handles DST by skipping missing wall-clock times and taking a repeated one once.
- Interval slot accounting does not invent a catch-up from runner start latency, because the fallback fired slot is `firedAt`.

**Runner**
- Lease TTL: staleness needs 2 x TTL (`loop-lock.ts:652-658`), and TTL = bound + 120 s. That covers the synchronous section with no heartbeat (precheck at most 60 s, worktree create at most 120 s, then dispatch), so a live owner is not reclaimed by heartbeat age alone.
- The recursion guard walks ancestors from `ppid`, so a checkout path in the runner's own argv does not trip it, and under launchd `ppid` is 1.
- The append gateway binding is pre-resolved (`append-mode-event.ts:475`), so a commit during the run does not fail the result append.
- The secret-literal check covers the body, the question, the answer, the request prompt and every delivery body. The child environment is the deep-loop allowlist, and `native` is refused.

**Delivery and worktrees**
- Delivery is at most once: a send needs an exclusive claim file, an uncertain send records `unknown`, and a send is never retried.
- Worktree links are unlinked before removal, removal is never forced, and unmerged, stashed or link-replaced trees are kept. Apart from BOT-R-02, the clean check is right.

**Status index**
- The index is built in a temp file and renamed into place, and files are pruned only after the new index stands.
- `launchctl print` parsing is tolerant: an unknown or duplicated field reads `unknown`.

## 5. Test and typecheck

- `cd .skilled/skills/system-skilled-bots/runtime && npx vitest run --no-coverage`: 33 test files passed, 355 tests passed, 58.0 s. Exit status 0.
- `npm run typecheck` (`tsc --noEmit --composite false -p tsconfig.json`): no output. Exit status 0.
- Extra read-only checks, run in the session scratchpad:
  - `routeOutcome` on `result-event-unrecorded`, `decision-marker-empty` and `executor-unavailable` returned `retry` each time, and `atRetryBound` for attempts 0, 1, 2 returned `false, false, true`.
  - The git ignored-file worktree removal repro is the one described under BOT-R-02.
  - The `spawnSync` timeout repro returned in 1004 ms with both grandchildren surviving; they were killed afterwards.
- Worktree state during review: `git diff --stat HEAD -- .skilled/` is empty, so the reviewed code equals `f4c318d856a`. Another agent was writing phase 009 material at the same time (untracked READMEs, `feature-catalog/` and playbook folders, and the parent `spec.md` phase-map row "| 9 | 009-skilled-alignment-and-docs/ | [Phase 9 scope] | Pending |"). This review wrote only this file.
