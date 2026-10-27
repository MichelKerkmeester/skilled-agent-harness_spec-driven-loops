---
title: "Research: git fsmonitor daemon pile-up and the 30-minute pre-push stall"
description: "Root cause and fix design for the fsmonitor IPC stall in this repo, the twelve-daemon pile-up across nested worktrees, and the sk-git/026 relocation regression."
importance_tier: important
contextType: research
---

# Research: git fsmonitor daemon pile-up and the 30-minute pre-push stall

<!-- SPECKIT_TEMPLATE_SOURCE: research-report | v1.0 -->

**Packet**: `specs/sk-git/035-fsmonitor-daemon-and-worktree-relocation-regression/001-deep-research/research/lineages/llmgateway-flash-undated-run2`
**Run**: `fanout-llmgateway-flash-undated-run2-1793094321851-ufzori`, iteration lineage of the fsmonitor research fan-out
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
3. On macOS the daemon has no idle exit and its health thread is an empty stub, so daemons are immortal, are never recycled, and are never replaced when wedged. Twelve were alive at the last census, the oldest for 16 days.

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
| 09:54Z | Lineage census: 12 `fsmonitor--daemon run --detach --ipc-threads=8` processes, oldest PID 1157 from Oct 11 18:29:55; four started today alone. |
| 10:45:09 | Main-checkout daemon PID 5979 takes `.git/fsmonitor--daemon.ipc` (socket attribution via `lsof`). |

A fresh daemon wedged within about 23 minutes, so the stall is not an artefact of one long-lived process. Restarting is not a fix.

---

## 3. Method

Three iterations, each with one focus:

1. **The regression (Q1).** Read the completed sk-git/026 packet, traced the reaper with `git log -S daemon` and read the daemon-related diff hunks of the commit that dropped its block, traced the worktree-base write-back, and re-measured the live worktree and daemon population.
2. **The daemon (Q2, Q3).** Read the installed build's manual (`Git 2.50.1 Apple Git-155`) and the exact v2.50.1 sources that define the lifecycle, the cookie handshake and the IPC client read, then checked 2.51-2.53 release notes for any announced fix.
3. **The repo (Q4, Q5).** Followed the hook symlink chain into the gate script and its imported manifest builder, enumerated unbounded git call sites, found the repository's existing fsmonitor opt-out convention, and derived the default posture and reaping design.

Read-only discipline: every git command used is non-index-reading (`log`, `show`, `config`, `rev-parse`), because an index-reading command in this checkout is exactly the failure under study. Status-time measurement was deliberately not performed: it can write the index, which is a repository write outside this lineage's authority.

---

## 4. Root-cause chain

Five links, in order of causation:

**4.1 Config: fsmonitor on everywhere.** `core.fsmonitor=true` and `core.untrackedCache=true` live in the shared `.git/config`, so they apply to the main checkout and, through the shared config, to every worktree. Each working directory starts its own daemon on first index read. [SOURCE: git config --show-origin --get-regexp, iteration 1]

**4.2 Topology: worktrees inside the checkout.** The relocation to `~/worktrees/public` recorded by sk-git/026 had been undone: the config key is unset, `~/worktrees` is empty, and 13 worktrees sit under `Public/.worktrees/`. The main daemon therefore watches roughly 570k files plus roughly 2M under `.worktrees/`, including 93 `node_modules` trees, and every worktree file is watched twice — once by the main daemon and once by its own. [SOURCE: ls -d .worktrees/*, this session] [SOURCE: specs/sk-git/035-fsmonitor-daemon-and-worktree-relocation-regression/scratch/findings.md]

**4.3 Lifecycle: daemons never retire.** On macOS the daemon has no idle timeout, no TTL, and a health thread that returns immediately (`fsm_health__ctor/loop/stop_async` are empty stubs), so it cannot detect its own stall or end itself; the header contract says the health thread should call `ipc_server_stop_async()` to cause shutdown, but Darwin never does. Nothing in the repo stops a daemon when its worktree goes away; `worktree-reaper.sh` is manual and now promises never to signal a process. Twelve daemons accumulated, one of them 16 days old. [SOURCE: compat/fsmonitor/fsm-health-darwin.c:8-27] [SOURCE: compat/fsmonitor/fsm-health.h:31-45] [SOURCE: .skilled/bin/README.md:168]

**4.4 Protocol: unbounded wait on both sides.** The daemon blocks in `while (cookie->result == FCIR_INIT) pthread_cond_wait(...)` after writing a cookie into the watched tree; the source comment admits this is an infinite wait and that `pthread_cond_timedwait()` was unavailable in their thread-utils. The client blocks in `read_packetized_to_strbuf` with no poll and no timeout; only EOF or a read error unblocks it, and the error string on that path is exactly the `could not read IPC response` the packet observed from `git fetch`. One undelivered filesystem event for the cookie therefore parks one daemon worker and one client forever, and eight such clients saturate the pool so that `status` and `stop` stop answering too. [SOURCE: builtin/fsmonitor--daemon.c:198-212] [SOURCE: compat/simple-ipc/ipc-unix-socket.c:210-213]

**4.5 Repo: the hook has no ceiling.** `.skilled/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs:129` runs `spawnSync('git', ['check-ignore', '-z', '--stdin'], { cwd, input, encoding })` with no `timeout` and no `-c core.fsmonitor=false`, once per skill root, reached from `ci-skill-root-metadata.cjs` in the pre-push gate. The fallback at line 136 needs a returned result, so it cannot rescue a hang. A hang is not a failure; nothing above it imposes a ceiling. [SOURCE: .skilled/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs:129] [SOURCE: .skilled/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs:51]

---

## 5. Answers to the five questions

### Q1. What unset `speckit.worktreeBase` and removed the reaper's daemon handling, and does anything still create worktrees under `.worktrees/` by default?

**Two unrelated events, and yes.**

- The reaper's daemon block was deleted by `3c7c3f83874` (2026-09-03, "refactor(runtime): remove the memory launcher, plugin, hooks and the tool-ownership commit gate"), not by the `.opencode` → `.skilled` source-root move (`330427cf30`, 2026-09-17). That commit removed `--reap-daemons`, `_daemon_worktree_path_from_cmdline()`, `_daemon_cmdline_is_orphan()` and the whole "ORPHAN DAEMON REPORTING" block. [SOURCE: git show 3c7c3f83874 -- .opencode/bin/worktree-reaper.sh]
- The removed logic only matched `pgrep -f 'context-server\.js'` and skipped any other command line, i.e. retired spec-memory MCP daemons. It never matched `git fsmonitor--daemon`. Restoring it would reap nothing relevant. [SOURCE: git show 3c7c3f83874 -- .opencode/bin/worktree-reaper.sh]
- The base key is unversioned local config, so no commit unset it. The durable in-checkout default is re-created by `.skilled/bin/worktree-session.sh:293-294`, which writes the resolved base into `.git/config` whenever the key is unset, while `_wn_base_dir()` defaults to `<toplevel>/.worktrees`. One launch without `SPECKIT_WORKTREE_BASE` silently and permanently re-pins the in-checkout layout. That write-back arrived in `f83952c3a94` (2026-09-11), three weeks after the base became configurable in `a69a621a39a` (2026-08-21). [SOURCE: .skilled/bin/worktree-session.sh:219] [SOURCE: .skilled/bin/worktree-session.sh:293] [SOURCE: .skilled/skills/sk-git/scripts/worktree-naming.sh:69]
- `.worktrees` remains the documented code default (`worktree-naming.sh:69`, changelog v1.5.2.0), and `.worktrees/` is gitignored (`.gitignore:320`) but sits inside the checkout, so the main daemon watches it.
- **UNKNOWN**: which specific action unset the key. `.git/config` is not versioned. Resolving check: a `.git/config` copy in a backup, or shell history from the session that ran the unset.

### Q2. Git 2.50.1's documented daemon lifecycle on macOS, `fsmonitor.socketDir`, and `stop` on a wedged daemon

**There is no idle shutdown and no self-exit.**

- The manual documents `start`, `run`, `stop`, `status` over a single working directory, and describes the daemon only as "long running". No idle timeout, no lifetime bound, no TTL. [SOURCE: man git-fsmonitor--daemon (Git 2.50.1)]
- `fsmonitor.socketDir` only relocates the Unix socket when `.git` (or `$HOME`) is on a network mount; it has no bearing on lifecycle. [SOURCE: man git-fsmonitor--daemon (Git 2.50.1)]
- On macOS the health thread is an empty stub: `fsm_health__ctor`, `fsm_health__loop` and `fsm_health__stop_async` all return immediately, so the daemon never monitors its listener and never exits on health grounds. [SOURCE: compat/fsmonitor/fsm-health-darwin.c:8-27]
- `git fsmonitor--daemon stop` sends `quit` and then polls `fsmonitor_ipc__get_state()` every 50 ms with no deadline, so on a wedged daemon the stop command hangs — the observed 15-second kill. [SOURCE: builtin/fsmonitor--daemon.c:84-101]
- `fsmonitor.starttimeout` (60 s default) is the only timeout in the lifecycle and bounds startup alone. [SOURCE: builtin/fsmonitor--daemon.c:35-39]

### Q3. Event overload, or a known daemon deadlock?

**The defect is an acknowledged unbounded wait; overload is the trigger.**

- Daemon side: every non-`quit` query creates a cookie file in the watched tree and blocks on `pthread_cond_wait` until the event thread reports the cookie seen. The comment states it is an infinite wait and that `pthread_cond_timedwait()` was wanted but unavailable. [SOURCE: builtin/fsmonitor--daemon.c:198-212]
- Client side: `ipc_client_send_command_to_connection` writes the command then calls `read_packetized_to_strbuf` with no poll and no deadline; only EOF or a read error unblocks it. [SOURCE: compat/simple-ipc/ipc-unix-socket.c:210-213]
- `--ipc-threads=8` is git's compiled default for `fsmonitor.ipcthreads`, not repo configuration, and this checkout sets no `fsmonitor.*` key. It multiplies the number of clients that can be parked, but it is not the cause. [SOURCE: builtin/fsmonitor--daemon.c:36]
- No announced fix: the 2.51, 2.52 and 2.53 release notes contain zero fsmonitor entries. Upgrading is not the fix path. [SOURCE: Documentation/RelNotes/2.51.0.adoc]
- A large event source is the plausible way to lose a cookie's event, which is why the topology link matters: the main daemon sits on top of 2.5M files it should never have been watching.

### Q4. Which call sites run git without a timeout, and which should opt out of fsmonitor?

Proven hung site:

| File | Call | Timeout | fsmonitor opt-out |
|---|---|---|---|
| `.skilled/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs:129` | `check-ignore -z --stdin` | none | none |

Reached from `ci-skill-root-metadata.cjs:51` via the pre-push gate (`~/.config/git/hooks/pre-push:425-451`); the hook's comment says the gate "finishes in about a second", which is the assumption that failed.

Close siblings needing the same treatment:

| File | Call | Timeout | fsmonitor opt-out |
|---|---|---|---|
| `.skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-router-sync.cjs:168` | `check-ignore --stdin -z` | none | none |
| `.skilled/skills/sk-doc/sk-create-skill/scripts/regenerate-skill-derived.cjs:73` | `check-ignore -q` | none | none |
| `.skilled/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs:111` | `rev-parse --show-toplevel` | none | n/a (non-index) |
| `.skilled/skills/system-spec-kit/runtime/cli/rules/check-source-tags-helper.mjs:206` | `check-ignore -z --stdin` | none | `GIT_NO_FSMONITOR` present |

The repository already has both fix conventions in use: `GIT_NO_FSMONITOR = ['-c', 'core.fsmonitor=false']` in `cite-drift-scan.mjs:145`, `continuity-freshness.ts:38`, `check-source-tags-helper.mjs:53` and `run-check.cjs:28`, plus `git -c core.fsmonitor=false` in `hook-flags.sh:20`; and timeouts in `message-contract.mjs:262` (`GIT_TIMEOUT_MS`) and `git-message-gate.mjs:290` (`timeout: 3000`). Roughly 59 files under `.skilled` spawn git; the priority class is index-reading commands (`check-ignore`, `status`, `ls-files`) run against the main checkout, because those query the daemon, while `rev-parse`/`log`/`show`/`cat-file` never do.

### Q5. Safest default: fsmonitor on with worktrees outside the checkout, or fsmonitor off for the main checkout and on per worktree?

**fsmonitor on with worktrees outside the checkout.**

- It removes the trigger — the main daemon's event volume from ~2M worktree files — instead of masking it, and keeps the measured benefit on the 570k-file main checkout. [SOURCE: specs/sk-git/035-fsmonitor-daemon-and-worktree-relocation-regression/scratch/findings.md]
- The per-worktree opt-out (`core.fsmonitor=false` for the main checkout only) requires `extensions.worktreeConfig`, which this checkout does not set, and it loses the largest benefit while leaving worktree daemons free to wedge their own commands. [SOURCE: git config --show-origin --get-regexp, this session]
- Under both options the hook ceiling is required, because a wedge can still occur in any worktree.

---

## 6. Fix design

Cheapest first, each independently valuable:

1. **Clear the leaked daemons (today only).** `pkill -f "fsmonitor--daemon run"`; git restarts one on demand. This fixes the current pile-up and nothing else.
2. **Give the hook's git call a ceiling.** Add `timeout` to the `spawnSync` at `generate-leaf-manifest.cjs:129` and prepend the repo's existing `-c core.fsmonitor=false` convention, so a stalled daemon falls through to the existing `fallbackIgnored` path. Apply the same pair to `verify-router-sync.cjs:168` and `regenerate-skill-derived.cjs:73`. This is the smallest change that would have turned the 30-minute stall into a one-second fallback.
3. **Make the relocation durable.** Set `speckit.worktreeBase` explicitly (so the policy is recorded) and stop the write-back at `worktree-session.sh:293-294` from persisting the default as policy — otherwise the next launch without `SPECKIT_WORKTREE_BASE` re-pins `.worktrees` and the relocation silently reverts again. Re-migrate the worktrees outside the checkout.
4. **Reap daemons whose worktree no longer exists — as new work.** A fsmonitor reaper is a separate entry point with its own stated invariant, because the current reaper promises never to signal a process and `git fsmonitor--daemon stop` hangs on exactly the daemon a reaper must remove. Attribution must use the socket path (the main daemon holds `.git/fsmonitor--daemon.ipc`; worktree daemons hold one under their per-worktree git dirs) because every daemon's argv is identical. [SOURCE: lsof output, this session]
5. **Keep the default posture.** fsmonitor on, worktrees outside the checkout; per-worktree opt-out remains the fallback for the main checkout only if relocation cannot be restored.

---

## 7. Prevention invariants

- No git call in a hook or gate may run without a wall-clock ceiling.
- No index-reading git call in repo tooling may run without `-c core.fsmonitor=false` unless it deliberately measures fsmonitor behaviour.
- Worktree bases for this repository live outside the checkout; the config key is set, not inferred.
- A daemon's lifetime is bounded by its worktree's lifetime; a reaper states its signalling invariant explicitly.
- A wedged daemon is released by ending the process, never by asking it to stop.

---

## 8. Risks and limitations

- The call-site inventory is a bounded sample (the proven site plus its closest siblings), not an exhaustive audit of all 59 git-spawning files; the classification rule (index-reading = daemon-touching) is stated so the audit can be completed mechanically.
- `extensions.worktreeConfig` support was not exercised live; the recommendation treats it as available-but-unset, which the config read confirms.
- The reaper's socket-path attribution was verified for the main daemon and one worktree daemon; a full census mapping every PID to its socket was not performed.

---

## 9. Unverified items and their resolving checks

- **Which action unset `speckit.worktreeBase`.** Resolving check: a `.git/config` copy in a backup, or shell history from the session that ran the unset.
- **Why daemon PID 17228 exited at 09:17:59.** The source rules out a timeout; a signal or crash remains. Resolving check: the unified log or `~/Library/Logs/DiagnosticReports` entry for that PID.
- **Whether the cookie event is actually lost under load.** Resolving check: run a daemon with `GIT_TRACE_FSMONITOR=1` during a heavy install in a nested worktree and watch its queue and reply latency, then repeat with the worktree outside the checkout.

---

## 10. Eliminated Alternatives

- **Restore the reaper's daemon handling.** The deleted code targeted MCP `context-server.js` daemons and the current reaper promises never to signal a process; a fsmonitor reap is new work, not a revert. (iterations 1, 3)
- **Rely on `git fsmonitor--daemon stop` in a reaper.** Stop polls forever on a wedged daemon, so it cannot be the escalation path by itself. (iteration 2)
- **Match daemons by command line.** Every daemon's argv is identical; the socket path is the only attribution key. (iteration 3)
- **A git upgrade fixes it.** The 2.51-2.53 release notes contain zero fsmonitor entries and the 2.50.1 source states the timed wait was not implemented. (iteration 2)
- **`--ipc-threads=8` is the cause.** It is the compiled default of `fsmonitor.ipcthreads`; a risk multiplier, not a root cause. (iteration 2)
- **Disable fsmonitor everywhere.** Rejected as the default rather than ruled out as an option: it discards a measured benefit on a 570k-file checkout, and per-worktree config gives the same safety with a narrower blast radius. (iteration 3)
- **The daemon exits on its own after idling.** No idle timeout exists in the manual or the source, and the macOS health thread is an empty stub. (iteration 2)
- **The `.opencode` → `.skilled` move removed the daemon handling.** The deletion is in `3c7c3f83874` (2026-09-03); the move commit is `330427cf30` (2026-09-17). (iteration 1)

---

## 11. Divergence Map

No divergent pivots were recorded for this lineage (convergence mode `default`; no saturated directions; no pivot lineage). The investigation frontier was fixed by the packet's five questions and was fully covered; the remaining frontier is implementation and measurement, recorded in sections 8-9.

---

## 12. Open Questions

Implementation-level questions that follow from this research (not part of the packet's five):

1. Should the hook ceiling be a `timeout` on the `spawnSync`, the `-c core.fsmonitor=false` opt-out, or both? (Both is the recommendation; the timeout also covers non-fsmonitor hangs.)
2. Should the write-back persist only an explicitly configured base, or default the base for this repo to a location outside the checkout?
3. Where should the fsmonitor reaper live — a `--reap-fsmonitor` sibling of `worktree-reaper.sh`, or a separate entry point?
4. Should the main checkout keep fsmonitor after relocation, or opt out per worktree as a belt-and-braces measure?

---

## 13. References

- `specs/sk-git/035-fsmonitor-daemon-and-worktree-relocation-regression/scratch/findings.md` — the packet's symptom record and section 8 questions.
- `specs/sk-git/026-worktree-hygiene-and-relocation/implementation-summary.md` — the original relocation, fsmonitor enablement and reaper work.
- `man git-fsmonitor--daemon` (Git 2.50.1 Apple Git-155).
- `builtin/fsmonitor--daemon.c` (git v2.50.1): lines 35-42, 84-101, 190-215.
- `compat/simple-ipc/ipc-unix-socket.c` (git v2.50.1): lines 195-217.
- `compat/fsmonitor/fsm-health-darwin.c`, `compat/fsmonitor/fsm-health.h` (git v2.50.1).
- `Documentation/RelNotes/2.51.0.adoc`, `2.52.0.adoc`, `2.53.0.adoc` (git v2.51.0, v2.52.0, v2.53.0).
- `.skilled/bin/worktree-session.sh:219-229,293-294`; `.skilled/bin/worktree-reaper.sh`; `.skilled/bin/README.md:168`.
- `.skilled/skills/sk-git/scripts/worktree-naming.sh:65-79`; `.skilled/skills/sk-git/changelog/v1.5.2.0.md:21-24`.
- `.skilled/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs:111,129-136`; `ci-skill-root-metadata.cjs:51`; `regenerate-skill-derived.cjs:73`.
- `~/.config/git/hooks/pre-push:417-451`.
- `.skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-router-sync.cjs:168`.
- `.skilled/skills/system-spec-kit/runtime/cli/rules/check-source-tags-helper.mjs:53,206`; `continuity-freshness.ts:38`.
- `.skilled/skills/sk-doc/shared/scripts/cite-drift-scan.mjs:145`; `.skilled/skills/sk-code/sk-code-quality/scripts/lib/run-check.cjs:28`; `.skilled/hooks/shared/hook-flags.sh:20`.
- `.skilled/skills/sk-git/scripts/lib/message-contract.mjs:262`; `.skilled/skills/sk-git/scripts/hooks/git-message-gate.mjs:290`.
- `git show 3c7c3f83874 -- .opencode/bin/worktree-reaper.sh`; `git log -S` runs over both reaper and wrapper path spellings.
- Live commands: `git config --show-origin --get-regexp`, `ls -d .worktrees/*`, `ls ~/worktrees`, `ps -Ao pid,lstart,command`, `lsof` socket attribution.

---

## 14. Verification and provenance notes

**Artifact inventory (all under this lineage directory).**

| Artifact | Present |
|---|---|
| `deep-research-config.json` (status flipped to `complete` after synthesis) | yes |
| `deep-research-state.jsonl` (gateway projection) | yes, 5 records |
| `deep-research-strategy.md` (5/5 questions checked, reducer-owned sections refreshed) | yes |
| `deep-research-dashboard.md` (Status COMPLETE, stopReason maxIterationsReached) | yes |
| `findings-registry.json` (resolvedQuestions 5, openQuestions 0, iterationsCompleted 3) | yes |
| `iterations/iteration-001.md`, `-002.md`, `-003.md` | yes |
| `deltas/iter-001.jsonl`, `iter-002.jsonl`, `iter-003.jsonl` | yes |
| `research.md`, `resource-map.md` | yes |

**Ledger provenance.** The run opened as `deep_research.run_initialized` (sequence 1), each iteration was handed to the append gateway immediately after its own artifacts were written (sequences 2-4, `deep-research.ledger.iteration-completed`), and the terminal record `deep_research.synthesis_complete` carries `stopReason: maxIterationsReached` with `totalIterations: 3`, `answeredCount: 5`, `totalQuestions: 5`. Every gateway call exited 0 and refreshed the projection (`projectionError: null`).

**Recorded harness observation: the legacy-row upcast is lossy in the projection.** The iteration records handed to the gateway carried `focus`, `findingsCount`, `answeredQuestions`, `noveltyJustification` and `sourcesQueried`. The refreshed `deep-research-state.jsonl` keeps only `type`, `iteration`, `run`, `status`, `newInfoRatio`, `ruledOut` and `timestamp`, and the gateway returned no warning field alongside `ok: true`. The delta files retain every field, which is why the reducer still resolved 5 of 5 questions and counted every finding; a reducer that read only the projection would have seen unanswered questions. Fix direction for the loop owner: emit the canonical `{stem, scope, data}` envelope rather than a legacy-shaped row, or have the upcaster surface a lossy-field warning. Recorded here instead of repaired, because re-appending a corrected iteration record would duplicate the iteration count.

**Scope discipline.** Every write in this lineage landed inside `research/lineages/llmgateway-flash-undated-run2`. No index-reading git command was run (only `log`, `show`, `config`, `rev-parse`), so the checkout's index and `.git/config` are untouched. `validate.sh --strict`, `generate-context.js`, `git add` staging and the `spec.md` findings write-back were **not** run: they write outside this lineage's authority, and the dispatcher's write limit outranks the workflow's default save/synthesis steps. Their content is preserved in `research.md` for the follow-up packet.

---

## Appendix A: Convergence Report

- Stop reason: `maxIterationsReached` (dispatcher set `stopPolicy: max-iterations`; the lineage ran all 3 configured iterations)
- Total iterations: 3
- Questions answered: 5 / 5
- Remaining questions: 0 of the packet's five; four implementation-level open questions are recorded in section 12
- Last 3 iteration summaries:
  - run 1: sk-git/026 regression — the reaper's daemon block and the re-based worktree default (0.85)
  - run 2: git 2.50.1 fsmonitor daemon lifecycle and the unbounded cookie wait (0.90)
  - run 3: unbounded git call sites and the safest default posture (0.90)
- Convergence threshold: 0.05 (telemetry only under `max-iterations`)
- Divergence summary: no divergent pivots recorded; no saturated direction; frontier is measurement and implementation
- Segment transitions, wave scores and checkpoint metrics are experimental and omitted from the live report.
