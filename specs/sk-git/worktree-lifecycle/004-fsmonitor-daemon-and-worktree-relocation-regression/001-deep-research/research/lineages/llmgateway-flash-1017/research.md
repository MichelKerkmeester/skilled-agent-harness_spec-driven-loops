---
title: "Research: git fsmonitor daemon pile-up and the 30-minute pre-push stall"
description: "Root cause and fix design for the fsmonitor IPC stall in this repo, the eleven-daemon pile-up across nested worktrees, and the sk-git/026 relocation regression."
importance_tier: important
contextType: research
---

# Research: git fsmonitor daemon pile-up and the 30-minute pre-push stall

<!-- SPECKIT_TEMPLATE_SOURCE: research-report | v1.0 -->

**Packet**: `specs/sk-git/035-fsmonitor-daemon-and-worktree-relocation-regression/001-deep-research/research/lineages/llmgateway-flash-1017`
**Run**: `fanout-llmgateway-flash-1017-1793088864734-4s5169`, iteration lineage of the fsmonitor research fan-out
**Iterations**: 3 (lineage cap)
**Stop reason**: `maxIterationsReached`
**Questions**: 5 of 5 answered

---

## 1. Summary

The 30-minute push was not a slow hook. It was an unbounded wait inside a synchronisation protocol that git itself documents as infinite on both sides.

A `git check-ignore` call in the pre-push skill gate asked the fsmonitor daemon what had changed. The daemon answers that question by creating a cookie file inside the watched tree and blocking until its filesystem-event thread reports seeing that file. If the event never arrives, the daemon's worker thread waits forever — the source comment calls this "an infinite wait" and says the timed variant was never implemented. The client that asked (`read_packetized_to_strbuf`) has no deadline either, so it waits forever too. The only release observed in practice was killing the daemon, which closes the socket.

Three conditions made that latent defect a 30-minute outage:

1. `core.fsmonitor=true` is shared config, so every worktree and the main checkout each start their own daemon on demand.
2. The worktrees had moved back inside the main checkout, so the main daemon watched roughly 2M extra files across 93 `node_modules` trees and received an event for every file any worktree touched.
3. On macOS the daemon has no idle exit and its health thread is an empty stub, so daemons are immortal, are never recycled, and are never replaced when wedged. Eleven were alive, the oldest for 16 days.

The hook had no ceiling, and its fallback only handles a returned failure, so a hang had no exit. That is the whole causal chain, and each link is separately fixable.

The packet's framing of one link needs correction: the reaper's removed daemon handling targeted retired MCP `context-server.js` daemons, not git fsmonitor daemons. Restoring it would not stop a single fsmonitor daemon. A fsmonitor reaper is new work.

---

## 2. Symptom and evidence timeline

| Time (2026-10-27) | Observation |
|---|---|
| ~08:00 | `git push origin main` enters the pre-push hook; total stall about 30 minutes; push then lands (`e023536201..f273dba74c`). |
| — | Child `git check-ignore -z --stdin` (PID 28423) sleeps for 16+ minutes at 0 % CPU. |
| — | `sample 28423` stack: `repo_read_index → read_index_from → tweak_fsmonitor → refresh_fsmonitor → fsmonitor_ipc__send_query → ipc_client_send_command_to_connection → read_packetized_to_strbuf`. |
| 08:34 | Main-checkout daemon PID 23895 holds `.git/fsmonitor--daemon.ipc`. `git fsmonitor--daemon stop` hangs and is killed after 15 s. |
| 08:51:33 | `kill 23895` releases the blocked `check-ignore`; git auto-starts PID 17228. |
| after restart | Each `git check-ignore` takes about 10 s, against a normal fraction of a second. |
| 09:08:10 | Another worktree daemon starts, taking the population to 12. |
| 09:17:59 | Daemon 17228 is gone; PID 18482 takes the socket. A blocked `git status` returns; its step logs `duration_ms: 189183`. |
| 09:22Z | Lineage census: 11 `fsmonitor--daemon run --detach --ipc-threads=8` processes, oldest PID 1157 from Oct 11 18:29:55. |

A fresh daemon wedged within about 23 minutes, so the stall is not an artefact of one long-lived process. Restarting is not a fix.

---

## 3. Method

Three iterations, each with one focus:

1. **The regression (Q1).** Read the completed sk-git/026 packet, traced the reaper with `git log -S daemon` and read the full diff of the commit that dropped its daemon block, traced the worktree-base write-back, and re-measured the live worktree and daemon population.
2. **The daemon (Q2, Q3).** Read the installed build's manual (`Git 2.50.1.428.g0e8243`) and the exact v2.50.1 sources that define the lifecycle, the cookie handshake and the IPC client read, then checked 2.51-2.53 release notes for any announced fix.
3. **The repo (Q4, Q5).** Followed the hook symlink chain into the gate script and its imported manifest builder, enumerated unbounded git call sites, found the repository's existing fsmonitor opt-out convention, and derived the default posture and reaping design.

Read-only discipline: every git command used is non-index-reading (`log`, `show`, `config`, `rev-parse`), because an index-reading command in this checkout is exactly the failure under study. Status-time measurement was deliberately not performed: it can write the index, which is a repository write outside this lineage's authority.

---

## 4. Root-cause chain

Five links, in order of causation:

**4.1 Config: fsmonitor on everywhere.** `core.fsmonitor=true` and `core.untrackedCache=true` live in the shared `.git/config`, so they apply to the main checkout and, through the shared config, to every worktree. Each working directory starts its own daemon on first index read. [SOURCE: git config --show-origin --get-regexp, iteration 1]

**4.2 Topology: worktrees inside the checkout.** The relocation to `~/worktrees/public` recorded by sk-git/026 had been undone: the config key is unset, `~/worktrees` is empty, and 13 worktrees sit under `Public/.worktrees/`. The main daemon therefore watches roughly 570k files plus roughly 2M under `.worktrees/`, including 93 `node_modules` trees, and every worktree file is watched twice — once by the main daemon and once by its own. [SOURCE: ls -d .worktrees/*, this session] [SOURCE: specs/sk-git/035-fsmonitor-daemon-and-worktree-relocation-regression/scratch/findings.md]

**4.3 Lifecycle: daemons never retire.** On macOS the daemon has no idle timeout, no TTL, and a health thread that returns immediately, so it cannot detect its own stall or end itself. Nothing in the repo stops a daemon when its worktree goes away; `worktree-reaper.sh` is manual and now promises never to signal a process. Eleven daemons accumulated, one of them 16 days old. [SOURCE: compat/fsmonitor/fsm-health-darwin.c:1] [SOURCE: .skilled/bin/README.md:168]

**4.4 Protocol: unbounded wait on both sides.** The daemon blocks in `while (cookie->result == FCIR_INIT) pthread_cond_wait(...)` after writing a cookie into the watched tree; the source comment admits this is an infinite wait. The client blocks in `read_packetized_to_strbuf` with no poll and no timeout. One undelivered filesystem event for the cookie therefore parks one daemon worker and one client forever, and eight such clients saturate the pool so that `status` and `stop` stop answering too. [SOURCE: builtin/fsmonitor--daemon.c:198] [SOURCE: compat/simple-ipc/ipc-unix-socket.c:192]

**4.5 Repo: the hook has no ceiling.** `.skilled/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs:129` runs `spawnSync('git', ['check-ignore', '-z', '--stdin'], { cwd, input, encoding })` with no `timeout` and no `-c core.fsmonitor=false`, once per skill root, reached from `ci-skill-root-metadata.cjs` in the pre-push gate. The fallback at line 136 needs a returned result, so it cannot rescue a hang. A hang is not a failure; nothing above it imposes a ceiling. [SOURCE: .skilled/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs:129] [SOURCE: .skilled/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs:51]

---

## 5. Answers to the five questions

### Q1. What unset `speckit.worktreeBase` and removed the reaper's daemon handling, and does anything still create worktrees under `.worktrees/` by default?

**Two unrelated events, and yes.**

- The reaper's daemon block was deleted by `3c7c3f83874` (2026-09-03, "refactor(runtime): remove the memory launcher, plugin, hooks and the tool-ownership commit gate"), not by the `.opencode` → `.skilled` source-root move. That commit removed `--reap-daemons`, `_daemon_worktree_path_from_cmdline()`, `_daemon_cmdline_is_orphan()` and the whole "ORPHAN DAEMON REPORTING" block. [SOURCE: git show 3c7c3f83874 -- .opencode/bin/worktree-reaper.sh]
- The removed logic only matched `pgrep -f 'context-server\.js'` and skipped any other command line, i.e. retired spec-memory MCP daemons. It never matched `git fsmonitor--daemon`. Restoring it would reap nothing relevant.
- The base key is unversioned local config, so no commit unset it. The durable in-checkout default is re-created by `.skilled/bin/worktree-session.sh:292-295`, which writes the resolved base into `.git/config` whenever the key is unset, while `_wn_base_dir()` defaults to `<toplevel>/.worktrees`. One launch without `SPECKIT_WORKTREE_BASE` silently and permanently re-pins the in-checkout layout. That write-back arrived in `f83952c3a94` (2026-09-11), three weeks after the base became configurable in `a69a621a39a` (2026-08-21). [SOURCE: .skilled/bin/worktree-session.sh:292] [SOURCE: .skilled/skills/sk-git/scripts/worktree-naming.sh:71]
- `.worktrees` remains the documented code default (`worktree-naming.sh:13`, `README.md:115,125`), and the changelog advertises unsetting the config as the supported way back to it.
- **UNKNOWN**: which specific action unset the key. No shell-history hit; `.git/config` is not versioned. Resolving check: a `.git/config` copy in a backup, or shell history from the session that ran the unset.

### Q2. Git 2.50.1's documented daemon lifecycle on macOS, `fsmonitor.socketDir`, and `stop` on a wedged daemon

**There is no idle shutdown and no self-exit.**

- The manual documents `start`, `run`, `stop`, `status` over a single working directory, and describes the daemon only as "long running". No idle timeout, no lifetime bound, no TTL. [SOURCE: man git-fsmonitor--daemon]
- `fsmonitor.socketDir` only relocates the Unix socket when `.git` (or `$HOME`) is on a network mount; it has no bearing on lifecycle.
- On macOS the health thread is an empty stub: `fsm_health__ctor`, `fsm_health__loop` and `fsm_health__stop_async` all return immediately, so the daemon never monitors its listener and never exits on health grounds. [SOURCE: compat/fsmonitor/fsm-health-darwin.c:1]
- `git fsmonitor--daemon stop` sends `quit` and then polls `fsmonitor_ipc__get_state()` every 50 ms with no deadline, so on a wedged daemon the stop command hangs — the observed 15-second kill. [SOURCE: builtin/fsmonitor--daemon.c:88]
- `fsmonitor.starttimeout` (60 s default) is the only timeout in the lifecycle and bounds startup alone. [SOURCE: builtin/fsmonitor--daemon.c:38]

### Q3. Event overload, or a known daemon deadlock?

**The defect is an acknowledged unbounded wait; overload is the trigger.**

- Daemon side: every non-`quit` query creates a cookie file in the watched tree and blocks on `pthread_cond_wait` until the event thread reports the cookie seen. The comment states it is an infinite wait and that `pthread_cond_timedwait()` was wanted but unavailable. [SOURCE: builtin/fsmonitor--daemon.c:198]
- Client side: `ipc_client_send_command_to_connection` writes the command then calls `read_packetized_to_strbuf` with no poll and no deadline; only EOF or a read error unblocks it. [SOURCE: compat/simple-ipc/ipc-unix-socket.c:192]
- `--ipc-threads=8` is git's compiled default for `fsmonitor.ipcthreads`, not repo configuration, and this checkout sets no `fsmonitor.*` key. It multiplies the number of clients that can be parked, but it is not the cause. [SOURCE: builtin/fsmonitor--daemon.c:35]
- No announced fix: the 2.51, 2.52 and 2.53 release notes contain zero fsmonitor entries. Upgrading is not the fix path. [SOURCE: Documentation/RelNotes/2.51.0.adoc]
- A large event source is the plausible way to lose a cookie's event, which is why the topology link matters: the main daemon sits on top of 2.5M files it should never have been watching.

### Q4. Which call sites run git without a timeout, and which should opt out of fsmonitor?

Proven hung site:

| File | Call | Timeout | fsmonitor opt-out |
|---|---|---|---|
| `.skilled/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs:129` | `git check-ignore -z --stdin` | none | none |

Further unbounded sites found by pattern sweep (automation only; tests and `node_modules` excluded):

| File | Call | Notes |
|---|---|---|
| `.skilled/skills/sk-doc/sk-create-skill/scripts/regenerate-skill-derived.cjs:73` | `git check-ignore -q` | index-reading, no timeout |
| `.skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-router-sync.cjs:168` | `git check-ignore --stdin -z` | index-reading |
| `.skilled/commands/doctor/scripts/git-hook-gates.cjs:180` | `execFileSync('git', ...)` | command list, no timeout |
| `.skilled/commands/doctor/scripts/release-update.cjs:282` | `execFileSync('git', args)` | no timeout |
| `.skilled/skills/sk-git/scripts/validate-message.mjs:88` | `execFileSync('git', ...)` | runs inside the message gate |
| `.skilled/skills/system-deep-loop/shared/behavior-benchmark/behavior-bench-run.cjs:885` | `git status --porcelain` | index-reading |

Rule: every index-reading git call in automation gets **both** a timeout and the repo's existing `-c core.fsmonitor=false` opt-out; non-index calls (`rev-parse`, `cat-file`, `log`) need only a timeout when they run inside a gate. The opt-out is already a house pattern — `GIT_NO_FSMONITOR = ['-c', 'core.fsmonitor=false']` exists in `check-source-tags-helper.mjs:53`, `cite-drift-scan.mjs:145` and `continuity-freshness.ts:38`; the hung path simply never adopted it. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/rules/check-source-tags-helper.mjs:53]

Coverage limit: the sweep covers JS/TS/MJS spawn and exec patterns in `.skilled`, not every shell `git` line inside `.skilled/scripts/git-hooks/*`.

### Q5. The safest default

**FSMonitor stays on — but only under three preconditions. Without them, off for the main checkout and on only in worktrees.**

1. Worktrees live outside the checkout, so the main daemon's event source is bounded to the checkout's own files. This is a prerequisite, not an alternative.
2. Every automated git call opts out (`-c core.fsmonitor=false`) and carries a timeout, so a wedged daemon degrades one gate instead of stopping a push.
3. A reaper guarantees no daemon outlives its worktree, and a bounded probe restarts a wedged daemon.

If (1) cannot be enforced — because the write-back silently re-pins the in-checkout base — then fsmonitor must be off for the main checkout, using `extensions.worktreeConfig=true` plus `git config --worktree core.fsmonitor false`. That keeps the benefit in short-lived worktrees while removing the daemon whose wedge stops pushes. Turning fsmonitor off globally is the last resort, not the default: it discards a measured benefit on a 570k-file checkout and does nothing about the immortal worktree daemons.

---

## 6. Fix design

Four layers, ordered by cost and by how much of the recurrence each removes.

### Layer 1 — Bound the gate (minutes, reversible)

- `generate-leaf-manifest.cjs:129`: add `timeout: 20000` and prepend `...GIT_NO_FSMONITOR` to argv (same constant shape as the three existing modules). The existing `fallbackIgnored` path then handles a timeout, because `spawnSync` returns an `error` the fallback already checks.
- Apply the same two changes at `regenerate-skill-derived.cjs:73` and `verify-router-sync.cjs:168`.
- Acceptance: with the daemon SIGSTOPped, the pre-push skill gate still completes inside its timeout and warns instead of blocking, and the manifest content is unchanged when git answers normally.

### Layer 2 — Restore the topology, remove the silent re-pin (half a day)

- Set `speckit.worktreeBase=~/worktrees/public` again and move the 13 worktrees back with `git worktree move` + `git worktree repair`.
- Change the write-back at `.skilled/bin/worktree-session.sh:292-295` so it only persists a base that was **explicitly** chosen (env var present, or an explicit flag). A launch that falls through to the default must not write config; it should log that the in-checkout default is in effect.
- Add a doctor check: fail (or warn loudly) when the resolved base is inside the checkout and more than a handful of worktrees exist, naming the file-count cost.
- Acceptance: a launch without the env var leaves `speckit.worktreeBase` unset, and a fresh worktree lands outside the checkout with the relocated base configured.

### Layer 3 — Reap daemons deterministically (new script, one day)

New entry point, e.g. `.skilled/bin/fsmonitor-daemon-reaper.sh`, deliberately **outside** `worktree-reaper.sh` so the published "never signals a process" invariant of that script stays true.

- Attribution: every daemon's argv is identical (`run --detach --ipc-threads=8`), so argv cannot identify the worktree. Resolve it from the socket each process holds (`lsof` → `.git/fsmonitor--daemon.ipc` → owning working directory), which also survives a dangling socket file.
- Classification: keep a daemon whose worktree appears in `git worktree list --porcelain`; report a daemon whose worktree is gone or whose socket is unlinked.
- Escalation: `timeout 5 git -C <wt> fsmonitor--daemon stop`, then SIGTERM, then SIGKILL after a bounded wait — because `stop` itself polls forever on a wedged daemon.
- Triggers: after every `git worktree remove` (stop-before-remove), from the doctor, and manually.
- Acceptance: after removing a worktree, its daemon is gone within the bounded window; a synthetic wedge (SIGSTOP on a daemon) is detected and killed by the probe; the reaper never touches a daemon whose worktree is live.

### Layer 4 — Detect and recover from a wedge (optional, same script)

- Probe: `timeout 10 git -C <wt> -c core.fsmonitor=true status --porcelain >/dev/null`; exit 124 identifies a wedged daemon for that worktree.
- Recovery: kill by socket inode and let git auto-start a fresh daemon.
- Acceptance: a SIGSTOPped daemon is replaced within one probe interval, and the probe itself never exceeds its timeout.

---

## 7. Prevention invariants

1. **No daemon outlives its worktree.** Enforced at removal, not by a periodic sweep alone.
2. **No automated git call waits without a ceiling.** Enforced by a shared helper (timeout + optional `GIT_NO_FSMONITOR`) that hooks and doctor scripts must use.
3. **No silent policy downgrade.** A configuration that changes where worktrees live is only written when a human or an explicit flag chose it.
4. **The main checkout watches only itself.** Worktrees inside the checkout are a detected defect, not a preference.
5. **A wedge is recoverable without a human.** Probe, kill, restart.

---

## 8. Risks and limitations

- FD limits and nproc cost of many immortal daemons are real but not measured here; the reaper reduces them as a side effect.
- `lsof` attribution costs a few seconds per daemon; acceptable for a doctor or post-removal hook, not for every command.
- Changing the write-back could surprise other clones (the tests assert the current write-back behaviour, so the change needs its own test update). [SOURCE: .skilled/bin/tests/worktree-session.test.sh:147]
- The 10-second `check-ignore` after a restart shows that a cold daemon on this tree is itself slow; reaping must not repeatedly cold-start a healthy daemon, so reap only strays and provable wedges.
- The exact benefit of fsmonitor in this checkout is unmeasured in this run, by design (measurement would write the index).

## 9. Unverified items and their resolving checks

| Item | Status | Resolving check |
|---|---|---|
| Why PID 17228 disappeared at 09:17:59 | UNKNOWN — source rules out a timeout | Unified log or `~/Library/Logs/DiagnosticReports` entry for that PID |
| Which action unset `speckit.worktreeBase` | UNKNOWN — config is unversioned | Backup copy of `.git/config`, or another session's shell history |
| Status-time benefit of fsmonitor here | UNMEASURED — would write the index | `git status` timing with/without fsmonitor in a scratch clone |
| Shell-level git calls in hook scripts | PARTIAL — swept JS/TS/MJS only | Line-by-line read of `.skilled/scripts/git-hooks/*` |

---

## 10. Eliminated Alternatives

- **Restore the reaper's removed daemon handling.** Eliminated: it matched `node … context-server.js` MCP daemons only, and the current reaper documents that it never signals a process.
- **Attribute daemons by command line.** Eliminated: every daemon's argv is byte-identical; the socket is the only attribution key.
- **Use `git fsmonitor--daemon stop` as the reaper's escalation.** Eliminated: `stop` sends `quit` and then polls forever, so it hangs on exactly the daemon a reaper must remove.
- **Upgrade git.** Eliminated for 2.51-2.53: zero fsmonitor entries in their release notes, and the 2.50.1 source still carries the unbounded wait.
- **Disable fsmonitor globally.** Rejected as the default rather than eliminated: it discards a real benefit and leaves worktree daemons — and their wedges — in place. Retained as the fallback when the three preconditions cannot hold.

---

## 11. Divergence Map

- Saturated directions: none. No pivot was taken; the three iterations followed the question dependency chain (regression → daemon lifecycle → repo call sites).
- Pivots taken: none.
- Failed pivots: none.
- Audited overrides: none.
- Council or pivot artifacts: none.
- Remaining frontier: measurement of fsmonitor's status-time benefit, and implementation of the four layers in the follow-up packets (`002-worktree-relocation-restore`, `003-fsmonitor-daemon-lifecycle`, `004-push-gate-git-timeout`).

---

## 12. Open Questions

1. Did a specific operator action unset `speckit.worktreeBase`, or did the write-back simply re-pin it after an intervening `git config` edit? (Check: `.git/config` backup copies.)
2. Why did daemon PID 17228 exit at 09:17:59 without a signal from this session? (Check: unified log, crash reports.)
3. Is a 20-second gate timeout the right ceiling for a cold daemon on this tree, or does the first post-restart minute need a longer one? (Check: timed gate runs after a deliberate daemon restart.)
4. Should the main checkout opt out of fsmonitor permanently, given that automation already opts out per call? (Decide after measuring interactive status time.)

---

## 13. References

- `.skilled/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs:111,129,136`
- `.skilled/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs:51`
- `.skilled/skills/sk-doc/sk-create-skill/scripts/regenerate-skill-derived.cjs:73`
- `.skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-router-sync.cjs:168`
- `.skilled/skills/system-spec-kit/runtime/cli/rules/check-source-tags-helper.mjs:53`
- `.skilled/skills/sk-doc/shared/scripts/cite-drift-scan.mjs:145`
- `.skilled/skills/system-spec-kit/runtime/cli/validation/continuity-freshness.ts:38`
- `.skilled/commands/doctor/scripts/git-hook-gates.cjs:86,95,180`
- `.skilled/commands/doctor/scripts/release-update.cjs:282`
- `.skilled/skills/sk-git/scripts/validate-message.mjs:81,88`
- `.skilled/skills/system-deep-loop/shared/behavior-benchmark/behavior-bench-run.cjs:885`
- `.skilled/bin/worktree-session.sh:219,292-295`
- `.skilled/bin/worktree-reaper.sh`
- `.skilled/bin/README.md:168`
- `.skilled/bin/tests/worktree-session.test.sh:147`
- `.skilled/skills/sk-git/scripts/worktree-naming.sh:13,61-83`
- `.skilled/skills/sk-git/README.md:115,125`
- `.skilled/skills/sk-git/changelog/v1.5.2.0.md:21,29`
- `.skilled/skills/sk-git/feature-catalog/feature-catalog.md:85`
- `specs/sk-git/026-worktree-hygiene-and-relocation/implementation-summary.md`
- `specs/sk-git/035-fsmonitor-daemon-and-worktree-relocation-regression/scratch/findings.md`
- `~/.config/git/hooks/pre-push:425`
- git v2.50.1 sources: `builtin/fsmonitor--daemon.c:35-61,88-101,198-212,689-772`; `compat/simple-ipc/ipc-unix-socket.c:192-220,440-506`; `compat/fsmonitor/fsm-health-darwin.c`; `compat/fsmonitor/fsm-health.h`
- git release notes: `Documentation/RelNotes/2.51.0.adoc`, `2.52.0.adoc`, `2.53.0.adoc`
- `man git-fsmonitor--daemon`, `man git-config` (Git 2.50.1.428.g0e8243)
- This lineage's `resource-map.md` (30 references, generated from the convergence deltas)

---

## 14. Verification and provenance notes

**Artifact inventory (all under this lineage directory).**

| Artifact | Present |
|---|---|
| `deep-research-config.json` (status flipped to `complete` after synthesis) | yes |
| `deep-research-state.jsonl` (gateway projection) | yes, 5 records |
| `deep-research-strategy.md` (5/5 questions checked, reducer-owned sections refreshed) | yes |
| `deep-research-dashboard.md` (Status COMPLETE, stopReason maxIterationsReached) | yes |
| `findings-registry.json` (resolvedQuestions 5, openQuestions 0, keyFindings 33, iterationsCompleted 3) | yes |
| `iterations/iteration-001.md`, `-002.md`, `-003.md` | yes |
| `deltas/iter-001.jsonl`, `iter-002.jsonl`, `iter-003.jsonl` (13 / 16 / 15 rows) | yes |
| `research.md`, `resource-map.md` (30 references) | yes |

**Ledger provenance.** The run opened as `deep_research.run_initialized` (sequence 1), each iteration was handed to the append gateway immediately after its own artifacts were written (sequences 2-4, `deep-research.ledger.iteration-completed`), and the terminal record `deep_research.synthesis_complete` carries `stopReason: maxIterationsReached` with `totalIterations: 3`, `answeredCount: 5`, `totalQuestions: 5` (sequence 5). Every gateway call exited 0 and refreshed the projection (`projectionError: null`).

**Recorded harness observation: the legacy-row upcast is lossy in the projection.** The iteration records handed to the gateway carried `focus`, `findingsCount`, `answeredQuestions`, `noveltyJustification` and `sourcesQueried`. The refreshed `deep-research-state.jsonl` keeps only `type`, `iteration`, `run`, `status`, `newInfoRatio`, `ruledOut` and `timestamp`, and the gateway returned no warning field alongside `ok: true`. The delta files retain every field, which is why the reducer still resolved 5 of 5 questions and counted 33 findings; a reducer that read only the projection would have seen unanswered questions. Fix direction for the loop owner: emit the canonical `{stem, scope, data}` envelope rather than a legacy-shaped row, or have the upcaster surface a lossy-field warning. Recorded here instead of repaired, because re-appending a corrected iteration record would duplicate the iteration count.

**Scope discipline.** Every write in this lineage landed inside `research/lineages/llmgateway-flash-1017`. No index-reading git command was run (only `log`, `show`, `config`, `rev-parse`), so the checkout's index and `.git/config` are untouched. `validate.sh --strict`, `generate-context.js`, `git add` staging and the `spec.md` findings write-back were **not** run: they write outside this lineage's authority, and the dispatcher's write limit outranks the workflow's default save/synthesis steps. Their content is preserved in `research.md` for the follow-up packet.

**External concurrent activity.** Files under `specs/system-speckit/054-weak-model-spec-authoring/` carry an mtime of 09:21:47 during this run. They are outside this lineage and were written by another process; this lineage never opened them.

---

## Appendix A: Convergence Report

- Stop reason: `maxIterationsReached` (dispatcher set `stopPolicy: max-iterations`; the lineage ran all 3 configured iterations)
- Total iterations: 3
- Questions answered: 5 / 5
- Remaining questions: 0 of the packet's five; four implementation-level open questions are recorded in section 12
- Last 3 iteration summaries:
  - run 1: sk-git/026 regression — the reaper's daemon block and the re-based worktree default (0.85)
  - run 2: git 2.50.1 fsmonitor daemon lifecycle and the unbounded cookie wait (0.90)
  - run 3: unbounded git call sites and the safest default posture (0.80)
- Convergence threshold: 0.05 (telemetry only under `max-iterations`)
- Divergence summary: no divergent pivots recorded; no saturated direction; frontier is measurement and implementation
- Segment transitions, wave scores and checkpoint metrics are experimental and omitted from the live report.
