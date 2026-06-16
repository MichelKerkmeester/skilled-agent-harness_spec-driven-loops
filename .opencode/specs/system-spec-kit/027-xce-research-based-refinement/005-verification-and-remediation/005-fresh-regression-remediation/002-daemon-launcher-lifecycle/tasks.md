---
title: "Tasks: Daemon Launcher & Lifecycle Remediation"
description: "One task per deep-review finding in this sub-phase (15 total): finding id + file:line + registry recommendation + Round-2 status tag. Scaffold only."
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/027-xce-research-based-refinement/005-verification-and-remediation/005-fresh-regression-remediation/tasks.md"
    last_updated_at: "2026-06-16T00:00:00Z"
    last_updated_by: "deep-review-orchestrator"
    recent_action: "Scaffolded sub-phase tasks from fresh-regression-75 registry"
    next_safe_action: "Operator review; then implement fixes per tasks.md"
    blockers: []
    key_files:
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "027-fresh-regression-remediation-scaffold"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Daemon Launcher & Lifecycle Remediation

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] 002-S1 Capture the subsystem test/validation baseline.
- [ ] 002-S2 Re-open each finding's cited file:line to confirm real vs refuted before editing.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

One task per finding (id + file:line + registry recommendation + Round-2 status tag):

- [ ] 002-T001 · `.opencode/bin/mk-spec-memory-launcher.cjs:478` — Make reclaim atomic: on stale classification, unlink the existing owner lease then writeOwnerLeaseFileExclusive (O_EXCL); on EEXIST, re-read and return acquired:false. This collapses both paths to one _[downgraded→P2]_
- [ ] 002-T002 · `.opencode/bin/mk-code-index-launcher.cjs:979` — Mirror the sibling launchers: record the daemon childPid in code-index's lease, and in the staleReclaimable branch (and the ppid-1-orphan owner-lease reclaim) adopt the orphan via a deep probe when br _[downgraded→P2]_
- [ ] 002-T003 · `.opencode/bin/mk-spec-memory-launcher.cjs:1270` — Port skill-advisor's pattern: stamp the holder PID inside lockDir on mkdir (mk-skill-advisor-launcher.cjs:1126) and reclaim as soon as processLiveness(ownerPid)==='dead' (mk-skill-advisor-launcher.cjs _[downgraded→P2]_
- [ ] 002-T004 · `.opencode/bin/mk-code-index-launcher.cjs:839` — Apply the same PID-stamp + provable-death reclaim used in mk-skill-advisor-launcher.cjs:1080-1112 (stamp pid at mkdir, reclaim when processLiveness(ownerPid)==='dead'), retaining the 5min mtime path a _[confirmed]_
- [ ] 002-T005 · `.opencode/bin/lib/model-server-supervision.cjs:666` — Mirror the bootstrap lock: atomically rename the stale lock to a unique staleClaim path (renameSync) and only proceed if the rename succeeds, then delete the claimed copy and open 'wx'. A losing racer _[P2]_
- [ ] 002-T006 · `.opencode/bin/mk-spec-memory-launcher.cjs:1425` — In the retry setTimeout, replace the bare launcherShutdownInProgress check with the same shouldAbortRelaunchOnFire({shuttingDown: launcherShutdownInProgress, currentPpid: process.ppid, initialPpid: LA _[P2]_
- [ ] 002-T007 · `.opencode/bin/mk-code-index-launcher.cjs:897` — Before re-raising in the child-exit handler, remove the launcher's own handler for that signal first (process.removeAllListeners(signal) or set process.exit(128 + os.constants.signals[signal])) so the _[P2]_
- [ ] 002-T008 · `.opencode/scripts/orphan-mcp-sweeper.sh:293` — Before reaping a classified MCP daemon, check for live connections on its recorded UNIX socket (e.g. lsof -nP -U on the daemon's daemon-ipc.sock, or read the lease file and confirm the pid is not the  _[P2]_
- [ ] 002-T009 · `.opencode/bin/mk-skill-advisor-launcher.cjs:546` — Mirror the signal-handler escalation: after childProcess.kill('SIGTERM'), await waitForChildExit(childProcess, <grace>) and childProcess.kill('SIGKILL') if still running before process.exit(128); make _[P2]_
- [ ] 002-T010 · `.opencode/bin/mk-skill-advisor-launcher.cjs:417` — Before SIGTERM/SIGKILL of a recorded PID, verify it is still the expected process (compare /proc or `ps` comm/executablePath against the lease's executablePath, or a recorded start-time), and treat a  _[P2]_
- [ ] 002-T011 · `.opencode/bin/mk-spec-memory-launcher.cjs:754` — Before reaping, require the owner lease to be heartbeat-stale (reuse classifyOwnerLease's lastHeartbeatIso/ttlMs check), not merely pid-alive. A daemon that has heartbeated within its TTL must never b _[P2]_
- [ ] 002-T012 · `.opencode/skills/system-spec-kit/shared/ipc/socket-server.ts:310` — Exempt liveness probes from the client cap (e.g. answer the initialize probe via a lightweight pre-accept path that does not occupy a durable slot, or count probe vs bridge connections separately), so _[P2]_
- [ ] 002-T013 · `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:415` — Either map SPECKIT_<KIND>_STATE_DIR to the CLI's real home env (so the native lock relocates per replica) — weighing the auth-dir tradeoff in executor-audit.ts:78-84 — or rewrite the comment to state  _[P2]_
- [ ] 002-T014 · `.opencode/skills/deep-loop-runtime/tests/unit/fanout-run.vitest.ts:184` — Add a case with a single executor {label:'rep', kind:'cli-codex', count:2} asserting lineages/rep-1 and lineages/rep-2 each receive a distinct SPECKIT_CODEX_STATE_DIR (assert on the stub's captured st _[P2]_
- [ ] 002-T015 · `.opencode/bin/mk-skill-advisor-launcher.cjs:502` — Apply the same atomic-reclaim (unlink + O_EXCL CAS) fix to both launchers in lockstep with the spec-memory fix; consider hoisting the owner-lease acquire/clear helpers into .opencode/bin/lib to preven _[P2]_
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] 002-V1 vitest in the isolated fake-root harness; no live recycles.
- [ ] 002-V2 Whole-gate delta reported (no regressions).
- [ ] 002-V3 Update each finding's status in the registry (fixed/refuted).
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

All 15 findings resolved (fixed or refuted-with-reason); verification gate green. No fixes applied in this scaffold.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- Registry: `../../review/fresh-regression-75/deep-review-findings-registry.json`
- Coverage: `../fix-coverage.json`
<!-- /ANCHOR:cross-refs -->
