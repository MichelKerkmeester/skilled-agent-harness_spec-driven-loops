---
title: "Follow-Ups: 006-mcp-launcher-concurrency"
description: "Six concrete follow-ups surfaced by the consolidated changelog for the MCP launcher concurrency arc. Each entry names what stalled or remained open, why it matters and the next concrete action."
trigger_phrases:
  - "006-mcp-launcher-concurrency follow-ups"
  - "launcher concurrency arc follow-ups"
  - "mcp launcher follow-ups"
importance_tier: "normal"
contextType: "implementation"
---

# Follow-Ups: 006-mcp-launcher-concurrency

> Six open follow-ups surfaced by the consolidated [CHANGELOG.md](./CHANGELOG.md). Read the changelog for shipped work. Read this for what remains.
>
> **Spec folder:** `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/006-mcp-launcher-concurrency/`

---

## 1. Phase 013 launcher-lease-acquisition-reclaim has not shipped

**What happened:** Phase 013 is a pre-implementation scaffold. Planned build targets include an atomic reclaim site in `lease.ts:300`, preserving existing read-path liveness at `lease.ts:226` and a race regression test at `daemon/lease-acquisition-reclaim.vitest.ts`.

**Why it matters:** Phase 011 REQ-006 surfaced a dead-PID auto-reclaim gap. Today operators must run the manual lease-clear recipe to recover from a stale lease after a non-clean shutdown. Acquisition-time atomic reclaim would close this gap so the daemon recovers on its own.

**Concrete next action:** Pick up the 013 scaffold and implement the atomic reclaim. Suggested approach: at lease acquisition, probe the recorded PID. If the PID is dead, atomically replace the lease record with the new PID using a database transaction (or the equivalent atomic file rename for inline PID-file leases). The race regression test must cover two contenders racing against the same stale lease. Only one should win. The other should detect the new live owner and exit cleanly with `LEASE_HELD_BY:<new-pid>`.

---

## 2. 24-hour zero-zombie soak test has not been collected

**What happened:** Multiple phase implementation-summaries (001, 002, 003) list a 24-hour zero-zombie soak as the durable proof point. The soak is operator-deferred on this machine.

**Why it matters:** Tests cover the unit-level lease semantics. Manual spawn-twice probes cover the basic interaction. Neither covers the long-tail failure modes that emerge under realistic 24-hour daemon lifetimes (signal coverage gaps, slow child shutdown timeouts, leaked PID files from edge-case crashes). The soak is the only signal that catches these.

**Concrete next action:** Pick a quiet 24-hour window. Set `MK_SPEC_MEMORY_STRICT_SINGLE_WRITER=1`, `MK_CODE_INDEX_STRICT_SINGLE_WRITER=1` and the skill-advisor equivalent. Start all three MCPs through their normal launcher entry points. Let the system idle (or run light workloads) for 24 hours. Capture before-and-after `ps aux | grep -E 'mk-(skill-advisor|code-index|spec-memory)'` snapshots plus `lsof` for the lease files and database directories. Acceptance: zero leaked processes (count matches before-and-after), zero stale lease files, zero `LEASE_HELD_BY` diagnostics in logs unrelated to actual launcher restarts.

---

## 3. 24-hour zero-corrupt soak test has not been collected

**What happened:** Phase 001 fixed the visible `.corrupt` SQLite quarantine pathway that produced 1005 files in 6 hours under the multi-daemon regime. Verification was unit-level: typecheck, vitest and manual probes. The 24-hour zero-corrupt soak that would confirm the fix is durable under long-running benchmark loads has not run.

**Why it matters:** The original failure signal was 1005 `.corrupt` files in 6 hours. The matching positive signal is 0 `.corrupt` files in 24 hours under similar load. Without that positive signal, "the fix works" is theoretical against the most spectacular failure mode this arc addressed.

**Concrete next action:** Bundle this with follow-up #2 (zero-zombie soak). Run both at the same time so one operator window covers both proof points. Check the SQLite quarantine path before and after: `find ~/.local/share -name '*.corrupt' 2>/dev/null | wc -l` should return 0 both before and after. If the run is during active development (so the database sees real load rather than idle), the signal is stronger.

---

## 4. Live Unix-socket probe for multi-client bridge

**What happened:** Phase 010 implemented the multi-client stdio-socket bridge for spec-memory. Verification was blocked by sandbox `EPERM` (permission-denied) during live testing because the sandbox cannot bind Unix sockets outside its allowed paths.

**Why it matters:** The bridge exists to allow secondary launchers from OpenCode plugin and Claude Code (or other AI runtimes) to attach to the primary daemon instead of exiting with `LEASE_HELD_BY` errors. Without a clean live test, the lifecycle, the bounded secondary-client behaviour and the message counters are theoretically correct but not empirically confirmed.

**Concrete next action:** Run a live multi-client bridge test outside the sandbox. Start one primary launcher manually, then trigger a secondary launcher from a second runtime within 30 seconds. Confirm: the secondary attaches via the bridge socket (not via fresh daemon spawn), bidirectional MCP traffic flows through the socket, the secondary disconnect cleans up without leaving the primary daemon stuck, the bounded secondary-client limit (`SPECKIT_MAX_SECONDARY_CLIENTS`) actually rejects the N+1 attach attempt. Capture the bridge socket-server lifecycle log for the run.

---

## 5. Cross-launcher LEASE_HELD_BY parity grep in CI

**What happened:** Phase 002 documented cross-launcher `LEASE_HELD_BY` parity as a manual check. Phase 009 propagated the `EPERM` handler to spec-memory and code-graph as a byte-equivalent two-line addition. The launchers should stay byte-equivalent on the lease-check paths but this is enforced by convention, not by tooling.

**Why it matters:** Without an automated check, a future edit to one launcher (debug log addition, new exit path, comment refresh) can introduce drift. Drift between the three launchers reintroduces the failure-mode-asymmetry problem this arc fixed (skill-advisor failed visibly because its symptoms were loud, the others absorbed the same race silently). Drift could put us right back there.

**Concrete next action:** Add a CI check that diffs the three launcher CJS files on the lease-check region. One approach: tag the lease-check block with sentinel comments (`// LEASE_CHECK_BEGIN` and `// LEASE_CHECK_END`) in all three launchers, then a small script extracts and compares the blocks. Acceptance: a future edit that introduces drift fails CI with a diff readout showing which launcher is out of sync.

---

## 6. EPERM handler unit test

**What happened:** Phase 009 was a byte-equivalent two-line propagation of the skill-advisor `EPERM` handler to spec-memory and code-graph launchers. No new automated test was added.

**Why it matters:** The `EPERM` path is the one that prevents sandbox-foreign PID ownership from being misinterpreted as a stale lease. If a future edit removes the handler (e.g. someone simplifies the error handling), the regression is silent until a sandbox-foreign launcher tries to acquire a held lease and gets bad behaviour.

**Concrete next action:** Add a small vitest covering `leaseHeldFromFile()` returning lease-held when `errno=EPERM`. Mock the underlying `process.kill(pid, 0)` call to throw an EPERM error. Assert the function returns `true` (lease held) rather than `false` (stale). Run the test against all three launcher packages (the skill-advisor one likely exists, the code-graph and spec-memory ones are missing). Acceptance: 3 of 3 launcher packages have the test, all 3 pass.
