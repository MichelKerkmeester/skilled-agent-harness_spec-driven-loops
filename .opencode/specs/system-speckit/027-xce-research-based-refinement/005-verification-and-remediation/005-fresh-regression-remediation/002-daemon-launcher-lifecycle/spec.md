---
title: "Feature Specification: Daemon Launcher & Lifecycle Remediation"
description: "Remediation sub-phase of the 027 fresh+regression deep-review: 15 findings (4 P1) in this subsystem, each carried as a task with its registry recommendation. Scaffold only — no fixes applied."
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/027-xce-research-based-refinement/005-verification-and-remediation/005-fresh-regression-remediation/spec.md"
    last_updated_at: "2026-06-16T00:00:00Z"
    last_updated_by: "deep-review-orchestrator"
    recent_action: "Scaffolded sub-phase spec from fresh-regression-75 registry"
    next_safe_action: "Operator review; then implement fixes per tasks.md"
    blockers: []
    key_files:
      - "spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "027-fresh-regression-remediation-scaffold"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Daemon Launcher & Lifecycle Remediation

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete — all 15 findings fixed; verification green |
| **Created** | 2026-06-16 |
| **Branch** | `system-speckit/027-xce-research-based-refinement` |
| **Parent Spec** | ../spec.md |
| **Findings** | 15 (4 P1 / 11 P2) |
| **Handoff Criteria** | Every listed finding fixed-or-refuted-with-reason, each code fix test-gated; vitest in the isolated fake-root harness; no live recycles. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

Sub-phase of `005-fresh-regression-remediation` (phase parent). It owns the subsystem cluster from the fresh+regression deep-review's findings registry. Per operator directive every finding is carried (refuted ones as hardening, asserted ones fix-as-stated). Source: `../../review/fresh-regression-75/deep-review-findings-registry.json`.

**Scope Boundary**: only findings assigned to this sub-phase by `fix-coverage.json`. No cross-phase edits.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The deep-review surfaced 15 findings in this subsystem. Left unaddressed they risk real defects (data integrity / lifecycle / safety) plus robustness and traceability debt. This sub-phase remediates each.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

**In scope**: the 15 findings enumerated in tasks.md (and `fix-coverage.json`).
**Out of scope**: findings owned by sibling sub-phases; any change outside the cited files + their tests.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

- **R1** (002-T001, downgraded→P2) — `.opencode/bin/mk-spec-memory-launcher.cjs:478`: Make reclaim atomic: on stale classification, unlink the existing owner lease then writeOwnerLeaseFileExclusive (O_EXCL); on EEXIST, re-read and return acquired:false. This collapses both paths to one
- **R2** (002-T002, downgraded→P2) — `.opencode/bin/mk-code-index-launcher.cjs:979`: Mirror the sibling launchers: record the daemon childPid in code-index's lease, and in the staleReclaimable branch (and the ppid-1-orphan owner-lease reclaim) adopt the orphan via a deep probe when br
- **R3** (002-T003, downgraded→P2) — `.opencode/bin/mk-spec-memory-launcher.cjs:1270`: Port skill-advisor's pattern: stamp the holder PID inside lockDir on mkdir (mk-skill-advisor-launcher.cjs:1126) and reclaim as soon as processLiveness(ownerPid)==='dead' (mk-skill-advisor-launcher.cjs
- **R4** (002-T004, confirmed) — `.opencode/bin/mk-code-index-launcher.cjs:839`: Apply the same PID-stamp + provable-death reclaim used in mk-skill-advisor-launcher.cjs:1080-1112 (stamp pid at mkdir, reclaim when processLiveness(ownerPid)==='dead'), retaining the 5min mtime path a
- **R5** (002-T005, P2) — `.opencode/bin/lib/model-server-supervision.cjs:666`: Mirror the bootstrap lock: atomically rename the stale lock to a unique staleClaim path (renameSync) and only proceed if the rename succeeds, then delete the claimed copy and open 'wx'. A losing racer
- **R6** (002-T006, P2) — `.opencode/bin/mk-spec-memory-launcher.cjs:1425`: In the retry setTimeout, replace the bare launcherShutdownInProgress check with the same shouldAbortRelaunchOnFire({shuttingDown: launcherShutdownInProgress, currentPpid: process.ppid, initialPpid: LA
- **R7** (002-T007, P2) — `.opencode/bin/mk-code-index-launcher.cjs:897`: Before re-raising in the child-exit handler, remove the launcher's own handler for that signal first (process.removeAllListeners(signal) or set process.exit(128 + os.constants.signals[signal])) so the
- **R8** (002-T008, P2) — `.opencode/scripts/orphan-mcp-sweeper.sh:293`: Before reaping a classified MCP daemon, check for live connections on its recorded UNIX socket (e.g. lsof -nP -U on the daemon's daemon-ipc.sock, or read the lease file and confirm the pid is not the 
- **R9** (002-T009, P2) — `.opencode/bin/mk-skill-advisor-launcher.cjs:546`: Mirror the signal-handler escalation: after childProcess.kill('SIGTERM'), await waitForChildExit(childProcess, <grace>) and childProcess.kill('SIGKILL') if still running before process.exit(128); make
- **R10** (002-T010, P2) — `.opencode/bin/mk-skill-advisor-launcher.cjs:417`: Before SIGTERM/SIGKILL of a recorded PID, verify it is still the expected process (compare /proc or `ps` comm/executablePath against the lease's executablePath, or a recorded start-time), and treat a 
- **R11** (002-T011, P2) — `.opencode/bin/mk-spec-memory-launcher.cjs:754`: Before reaping, require the owner lease to be heartbeat-stale (reuse classifyOwnerLease's lastHeartbeatIso/ttlMs check), not merely pid-alive. A daemon that has heartbeated within its TTL must never b
- **R12** (002-T012, P2) — `.opencode/skills/system-spec-kit/shared/ipc/socket-server.ts:310`: Exempt liveness probes from the client cap (e.g. answer the initialize probe via a lightweight pre-accept path that does not occupy a durable slot, or count probe vs bridge connections separately), so
- **R13** (002-T013, P2) — `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:415`: Either map SPECKIT_<KIND>_STATE_DIR to the CLI's real home env (so the native lock relocates per replica) — weighing the auth-dir tradeoff in executor-audit.ts:78-84 — or rewrite the comment to state 
- **R14** (002-T014, P2) — `.opencode/skills/deep-loop-runtime/tests/unit/fanout-run.vitest.ts:184`: Add a case with a single executor {label:'rep', kind:'cli-codex', count:2} asserting lineages/rep-1 and lineages/rep-2 each receive a distinct SPECKIT_CODEX_STATE_DIR (assert on the stub's captured st
- **R15** (002-T015, P2) — `.opencode/bin/mk-skill-advisor-launcher.cjs:502`: Apply the same atomic-reclaim (unlink + O_EXCL CAS) fix to both launchers in lockstep with the spec-memory fix; consider hoisting the owner-lease acquire/clear helpers into .opencode/bin/lib to preven

<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- Every finding resolved (fixed, or refuted-with-reason recorded in the registry).
- vitest in the isolated fake-root harness; no live recycles.
- No regression to prior epic-sweep remediations; whole-gate delta reported.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

- Asserted findings may be false positives (Round-2 refuted 3/16 code candidates) — confirm against cited code before editing.
- Touches live daemon write/lifecycle paths — use the isolated test harness, never live recycles.
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None at scaffold time; raise per-task if a cited finding proves refuted on inspection.
<!-- /ANCHOR:questions -->
