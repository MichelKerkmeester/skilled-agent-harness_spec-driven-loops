[0m
> build · glm-5.2
[0m
[0m→ [0mRead .opencode/bin/mk-code-index-launcher.cjs
```json
{
  "angle": "race-and-permission-safety",
  "insights": [
    "The uid check in leaseHeldFromFile (L591-599) is gated on `legacyPath` only, so the PRIMARY lease (.code-graph-owner.json / .mk-code-index-launcher.json in skill-local dbDir) and its recorded socketPath are trusted without any ownership verification. On a shared/multi-user repo volume, a foreign user's primary lease is treated as a live owner, we bridge to a foreign-owned socket, and acquireOwnerLeaseFile will unlink a foreign lease file (L493) we happen to have permission to delete.",
    "acquireOwnerLeaseFile's CAS is unlink-then-O_EXCL (L491-505). The win-once property holds (loser hits EEXIST at L498), but the unlink at L493 is DESTRUCTIVE and runs on a lease that was only classified stale a few syscalls earlier — there is no re-stat of mtime/inode between classifyOwnerLease (L479) and unlink (L493), so an owner whose heartbeat just refreshed (startOwnerLeaseHeartbeat fires every ttlMs/2 = 30s) can have its now-live lease ripped out from under it.",
    "refreshOwnerLeaseFile (L517-532) writes via writeOwnerLeaseFile, which is tmp+rename and NON-exclusive (L344-349). Its post-write re-read (L528-529) only detects 'another owner wrote between my read and write' — it does NOT detect 'I just clobbered the winner's lease with my own pid'. After a concurrent reclaim, the dying owner's heartbeat rename overwrites the winner's O_EXCL lease, re-read sees its OWN pid, and returns true (success). This is a plausible mechanism for the incident's 'lease file gone / pointing at dead owner while a second daemon spawns' signature.",
    "processLiveness (L423-433) maps EPERM → 'unknown-eperm', and classifyOwnerLease (L458) + acquireOwnerLeaseFile (L480) treat that as untouchable-live. This is safe against foreign-process kills but is NON-self-healing: a wedged owner in a sandbox that returns EPERM on kill(0) can never be reclaimed, so the wedge persists exactly as observed (0% CPU, socket never recreated). There is no socket-liveness tiebreaker to escape this.",
    "PID reuse is unguarded before SIGTERM/SIGKILL. reapOwnerBeforeRespawn (L640-666) and the reclaimedOrphanPid reap (L1175) signal the recorded pid with only processLiveness as the gate. buildOwnerLease records executablePath and startedAtIso (L410-421), but nothing re-verifies them against the live process before kill. The PID lease (.mk-code-index-launcher.json via writeLeaseFile L756-761) is even weaker: it stores only pid + startedAt, no executable/token, so a reused PID is indistinguishable from the original holder.",
    "classifyOwnerLease's 'ppid-1-orphan' branch (L461-463) conflates legitimate reparent-to-init (the orphan we WANT to reap after the launcher dies) with PID reuse in a container where every process has ppid=1. Combined with the missing cmdline/start-time check, a reused PID with ppid=1 in a container is classified reclaimable and then SIGKILLed as an unrelated process.",
    "The stale-heartbeat-reclaim threshold (L467, ttlMs*2 = 120s) is the incident's most likely trigger: a long synchronous SQLite op, a GC pause, or a stalled event loop > 2 min flips a healthy-but-slow owner into reclaimable. The heartbeat interval (ttlMs/2 = 30s) offers no margin against a multi-second event-loop stall, and there is no 'grace extension' on a partial stall."
  ],
  "recommendations": [
    {
      "change": "Lift the uid check out of the `if (legacyPath)` guard so it applies to the PRIMARY lease too; also stat the recorded socketPath's owner uid before bridging. Refuse to unlink or bridge any lease whose file uid != process.getuid().",
      "where": "mk-code-index-launcher.cjs:leaseHeldFromFile L591-599 (move uid check before the legacyPath branch) and acquireOwnerLeaseFile L491-497 (guard the unlink) and bridgeOrReportLeaseHeld/ownerSocketPath consumer L719-727",
      "why": "Removes the spoofed-IPC-socket and foreign-lease-unlink exposure on shared volumes; the legacy-only gate was a relic of the relocation, not a security boundary."
    },
    {
      "change": "Before any SIGTERM/SIGKILL in reapOwnerBeforeRespawn, verify PID identity: read /proc/PID/cmdline (Linux) or `ps -o command=` (macOS) and assert it contains lease.executablePath's basename; additionally compare the process start time against lease.startedAtIso (ps -o lstart= or /proc/PID/stat boottime-relative). On mismatch, treat as PID-reuse, do NOT signal, log 'pid-reuse-suspected' and exit the reclaim path.",
      "where": "mk-code-index-launcher.cjs:reapOwnerBeforeRespawn L640-666 (insert identity check after processLiveness, before L651 SIGTERM); reuse the helper at the reclaimedOrphanPid reap site L1174-1180",
      "why": "Closes the PID-reuse → SIGKILL-unrelated-process hole; both the PID lease (pid-only) and the owner lease currently trust pid alone."
    },
    {
      "change": "Make the stale-lease reclaim non-destructive: replace unlink-then-O_EXCL with a generation-pointer scheme (write new lease to .code-graph-owner.json.gen.<nonce>, then atomically link/rename it in only if the current lease still matches the stale snapshot's mtime+ownerPid). At minimum, re-stat the lease (mtime + size + ownerPid) between classifyOwnerLease and unlink; if changed, re-classify and abort the reclaim.",
      "where": "mk-code-index-launcher.cjs:acquireOwnerLeaseFile L491-505",
      "why": "Closes the TOCTOU where a just-heartbeated owner is unlinked and reaped; preserves the single-writer CAS while removing the destructive blind window."
    },
    {
      "change": "Make refreshOwnerLeaseFile fail-fast on ANY ownership change by checking the pre-write lease's identity (read-ownerPid + mtime) immediately before the rename and re-reading after, returning false if the file it would overwrite is not provably still its own previous content. Equivalently, write through writeOwnerLeaseFileExclusive semantics (O_EXCL on a fresh file is wrong for refresh, so use read-mine → write-temp → rename → re-read-mine, aborting if the pre-write snapshot no longer matches).",
      "where": "mk-code-index-launcher.cjs:refreshOwnerLeaseFile L517-532 and writeOwnerLeaseFile L344-349",
      "why": "The current re-read at L528 cannot detect self-clobber of a reclaimed lease; this is the most likely path by which the winner's lease silently migrates back to the dying owner."
    },
    {
      "change": "Add a socket-liveness tiebreaker to the unknown-eperm path: when classifyOwnerLease returns 'unknown-eperm' AND the recorded socketPath refuses connection (ECONNREFUSED) AND heartbeat is stale, reclassify as reclaimable. reapOwnerBeforeRespawn already runs under a confirmed-dead-socket gate in respawnAfterDeadSocket; surface the same gate into acquireOwnerLeaseFile for the cold-start reclaim.",
      "where": "mk-code-index-launcher.cjs:classifyOwnerLease L455-472 (accept optional socketProbe result) and acquireOwnerLeaseFile L478-484",
      "why": "Restores self-healing for sandboxed/EPERM owners; the incident's wedge would have recovered instead of requiring manual PID kill + wal_checkpoint."
    },
    {
      "change": "Embed a per-launcher random nonce in the lease and have the daemon echo it on its IPC socket; reclaim/reap paths probe the socket for the nonce before signaling. This is the strongest PID-reuse defense and subsumes the cmdline check for the daemon-controlled socket.",
      "where": "mk-code-index-launcher.cjs:buildOwnerLease L410-421 (add nonce) + reapOwnerBeforeRespawn L640 (probe via bridge module) + launcher-ipc-bridge.cjs getIpcSocketPath consumer",
      "why": "cmdline/start-time checks are heuristic; a nonce attestation from the live socket is proof the PID still IS our daemon."
    },
    {
      "change": "Stop treating ppid==1 as sufficient for 'ppid-1-orphan': require the cmdline/start-time identity check (rec. 2) AND a stale heartbeat before reclaiming a ppid-1 process; in containers where ppid==1 is the norm, rely on heartbeat+socket staleness alone.",
      "where": "mk-code-index-launcher.cjs:classifyOwnerLease L460-463",
      "why": "Prevents container PID-reuse from being misclassified as a reclaimable orphan and killed."
    },
    {
      "change": "On reclaim of a stale owner, before spawning the successor, probe for and reap the orphan's CHILD daemon (the recorded ownerLeasePid post-refreshOwnerLeaseFile in launchServer L974-983) — not just the launcher pid. The current reclaimedOrphanPid path reaps lease.ownerPid which may be the launcher; the actual DB writer is the child recorded in the refreshed lease.",
      "where": "mk-code-index-launcher.cjs:launcherMain L1058-1067 (reclaimedOrphanPid selection) and reapOwnerBeforeRespawn L640",
      "why": "The incident's 17MB orphaned WAL was held by the CHILD daemon, not the launcher; reaping only the launcher pid leaves the DB writer alive, producing the two-writer -32000."
    },
    {
      "change": "After any successful reap and before launchServer, run an explicit wal_checkpoint(TRUNCATE) on the DB (or defer to the daemon's startup but gate on WAL size) so a long-lived orphan WAL doesn't leave the successor opening a 17MB WAL under a possibly-stale shm.",
      "where": "mk-code-index-launcher.cjs:launcherMain after reapOwnerBeforeRespawn success L1174-1180, before writeLeaseFile L1182",
      "why": "Mirrors the manual recovery performed in the incident; turns the wedge's residual state into a clean start."
    }
  ],
  "risks": [
    "Adding a socket probe to the reclaim path introduces a new failure mode: if the socket probe itself hangs (not ECONNREFUSED but a wedged accept queue), reclaim latency grows and could exceed bootstrap lock deadlines. Bound the probe with a 250ms SO_RCVTIMEO/SO_SNDTIMEO and treat timeout as 'live'.",
    "The uid-check-primary-lease change can break a legitimate same-uid-but-different-runtime scenario (e.g., a launcher spawned by a different agent runtime under the same user). The check should reject only DIFFERENT uids, not same-uid, and should never block the owner's own refresh path.",
    "The non-destructive CAS (generation pointer) adds filesystem-op count per reclaim; on a slow NFS-style volume this could push cold-start latency. Keep the fast-path (no existing lease) on the original O_EXCL and only pay the generation dance on the reclaim branch.",
    "cmdline-based PID identity is bypassable by a malicious same-uid process that execs a matching argv; the nonce-attestation recommendation is the real boundary, but it requires the daemon to implement a nonce-echo RPC, which is a daemon-side change, not launcher-only.",
    "wal_checkpoint(TRUNCATE) from the launcher requires opening the SQLite DB from a second process before the daemon owns it — if the orphan isn't fully dead, this is a second writer and can itself corrupt. The reap must be confirmed-dead (waitForPidExit) before any checkpoint; consider deferring checkpoint to the daemon's first startup hook instead.",
    "Lifting uid checks to the primary lease may surface false positives on macOS where getuid() under sudo/seatbelt differs from the file's recorded uid; the guard should fall open (treat as own) when process.getuid is unavailable (Windows) or when the stat fails with EACCES rather than ENOENT."
  ]
}
```
