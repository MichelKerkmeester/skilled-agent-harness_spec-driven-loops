---
title: "Decision Record: Daemon supervisor probes before adopting"
description: "Why the stale-reclaim adopt decision was gated on a deep JSON-RPC probe and routed through its own reap+respawn block rather than the shared dead-socket path."
trigger_phrases:
  - "daemon probe before adopt decision"
  - "stale reclaim respawn adr"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/006-operator-tooling/009-daemon-supervisor-probe-before-adopt"
    last_updated_at: "2026-06-14T19:50:00Z"
    last_updated_by: "main-agent"
    recent_action: "Recorded ADR-001 for the probe-before-adopt fix"
    next_safe_action: "Deep-review + commit"
    blockers: []
    key_files:
      - ".opencode/bin/mk-spec-memory-launcher.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "009-daemon-supervisor-probe-before-adopt"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
# Decision Record: Daemon supervisor probes before adopting

<!-- SPECKIT_LEVEL: 3 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Gate stale-reclaim adoption on a deep probe; reap+respawn on failure

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-06-14 |
| **Deciders** | Michel Kerkmeester (owner), main agent |

---

<!-- ANCHOR:adr-001-context -->
### Context

The launcher's stale-reclaim path adopted a released daemon whenever the pid was alive and a socket file existed. A daemon whose event loop is wedged satisfies both — it is alive to `kill(pid,0)` and still owns its listening socket — but it never services a request. Adopting it bridged every client into a dead end (`ECONNREFUSED`), and because the pid stayed alive the supervisor never reaped it, so the failure was permanent. We needed the adopt decision to distinguish "alive" from "responsive" without sacrificing the warm-daemon reuse the adoption path exists to provide.

### Constraints

- Must not false-reap a daemon that is merely busy (e.g. mid-FTS-merge) — that would churn healthy daemons.
- Must preserve the single-writer invariant: never spawn a replacement while the old daemon might still be writing.
- The launcher is hand-authored `.cjs` with no build step; the fix must be revertible by `git revert` alone.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: Send a real JSON-RPC liveness probe before adopting; adopt only on a reply, otherwise fall through to the stale-reclaim path's own reap+respawn block.

**How it works**: The adopt branch now calls `probeLeaseHolderWithRetries` (the same deep probe the dead-socket decision already uses) against the daemon's recorded socket. A `status === 'alive'` reply adopts exactly as before. Any other result logs the reason and falls through to the existing block that takes the respawn lock, reaps the orphan (SIGTERM then SIGKILL after the 7s grace), and spawns a fresh daemon.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Probe in the adopt branch, fall through to its own reap block (chosen)** | Localized; reuses tuned probe; warm reuse intact; single-writer preserved | One extra probe round on the stale-reclaim path | 9/10 |
| Route the stale-reclaim path through `respawnAfterDeadSocket` | Would share one respawn implementation | Does not work: that path expects the owner lease to match the *old daemon* pid, but here the launcher owns the lease, so it always reports "superseded" | 3/10 |
| Don't clear the owner lease before bridging | Smallest diff | Still broken: the lease holds *this launcher's* pid, not the old daemon's, so the downstream respawn still mismatches | 2/10 |
| Invent a new lightweight liveness check | Could be faster | A second liveness mechanism to keep correct; risks diverging from the tuned probe that already tolerates busy daemons | 4/10 |

**Why this one**: It is the smallest change that makes the decision correct, and it reuses a probe already proven not to false-reap a busy daemon.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- A live-but-wedged daemon self-heals on the next launcher invocation — no operator `kill` required.
- The supervisor's "healthy" verdict now means "answers requests," not "process exists."

**What it costs**:
- One extra deep-probe round-trip on the stale-reclaim path. Mitigation: bounded by the tuned timeout, and only on that path; the warm-adoption happy path resolves in tens of milliseconds.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Probe false-negative reaps a healthy busy daemon | H | Reuse the existing 5s-timeout + retry policy already tuned against busy-but-responsive daemons |
| Reaping a wedged daemon abandons an uncheckpointed WAL | L | SQLite WAL is crash-safe; the replacement rebuilds the FTS shadow at boot |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | A live incident left the daemon wedged for ~4h with no recovery |
| 2 | **Beyond Local Maxima?** | PASS | Three alternatives weighed and rejected with reasons |
| 3 | **Sufficient?** | PASS | ~15 LOC reusing an existing probe; no new mechanism |
| 4 | **Fits Goal?** | PASS | Daemon-lifecycle reliability is the operator-tooling track's remit |
| 5 | **Open Horizons?** | PASS | Leaves the broader "fail loud on probe failure" and root-cause-#1 work unblocked |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- `mk-spec-memory-launcher.cjs` stale-reclaim adopt branch: deep-probe gate before adoption; fall through to reap+respawn on a non-alive probe.
- `mk-spec-memory-launcher.cjs` post-lock revalidation: after taking the respawn lock, re-read the lease and defer if `childPid` changed — closes the race the new probe's latency widened, mirroring the dead-socket path. Plus a try/catch that treats a probe-infrastructure throw as not-alive.
- `daemon-reelection-adoption-live.vitest.ts`: a SIGSTOP'd-daemon regression case proving reap+respawn and single writer.

**Adversarial review**: A gpt-5.5 red-team of the diff raised five findings. P1-001 (race widened by the probe latency) and P2-002 (probe throw) are fixed here. P1-002 (false-reap budget) is left as the pre-existing, author-tuned tradeoff the dead-socket path already accepts; P2-001 (adopt double-probe, self-heals next launch) and P2-003 (deterministic concurrent-race test, flaky-prone) are documented in `implementation-summary.md`.

**How to roll back**: `git revert` the launcher commit; the test edit reverts with it. No build step, no data migration.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->
