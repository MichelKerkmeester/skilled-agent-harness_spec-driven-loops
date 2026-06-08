# Deep Review Report — opus-3 fan-out lineage

**Spec folder:** `skilled-agent-orchestration/139-multi-model-deep`
**Lineage:** `fanout-opus-3` · **Executor:** native (opus) · **Mode:** review · **Target type:** files
**Iterations:** 1 of 1 (`maxIterations`, single-iteration fan-out lineage) · **Stop reason:** maxIterations reached
**Date:** 2026-06-08

---

## 1. Executive Summary

**Verdict: CONDITIONAL** · `hasAdvisories: true` · `releaseReadinessState: in-progress`

| Severity | Active count |
|----------|-------------|
| P0 | 0 |
| P1 | 1 |
| P2 | 5 |

Reviewed the recent daemon-reliability work: the stale-lease reclaim **reap-before-respawn** fix (`7c8b221cf3`), the re-election default-on doc/comment alignment (`592ebc059e`), the two live durability tests, and the **hook portability** rewrite (`7b082bdcf4`, `3b087a4a25`). The reap fix correctly closes the *no-secondary* double-writer it targets, but it introduces one real P1: a **fresh session reaps a daemon that a live secondary is still bridged to**, regressing the feature's headline guarantee under a common multi-session trigger. Five P2s cover the same missing-guard root cause (PID-reuse, unverified SIGKILL exit), an EPERM availability corner, a hook `node`-on-PATH tradeoff, and a test gap that would have caught the P1. No P0; the P1's blast radius is bounded by the secondary's reconnecting proxy, so it is degraded-but-recoverable, not data-loss.

## 2. Planning Trigger

CONDITIONAL → route to `/speckit:plan` for the P1 remediation (socket-liveness gate / adopt-before-reap) and to fold in the P2 hardening. The P1 is borderline-P0 and defeats the documented re-election promise, so it should be scheduled before the next release claim, not deferred.

## 3. Active Finding Registry

| ID | Sev | File:line | Title |
|----|-----|-----------|-------|
| F1 | **P1** | `mk-spec-memory-launcher.cjs:1482` | Fresh-session stale-reclaim reap kills a daemon a live secondary is still bridged to |
| F2 | P2 | `mk-spec-memory-launcher.cjs:1491` | Reap has no process-identity check; PID reuse can SIGKILL an unrelated process |
| F3 | P2 | `mk-spec-memory-launcher.cjs:1493` | Stale-reclaim EPERM path reports lease-held-reconnect instead of bridging to the live socket |
| F4 | P2 | `.claude/settings.local.json:38` (+`.codex/hooks.json`, `.devin/hooks.v1.json`) | Hooks switched to bare `node`; minimal-PATH/GUI launches lose the interpreter |
| F5 | P2 | `mk-spec-memory-launcher.cjs:713` | `reapLeaseChildBeforeRespawn` returns `allowed:true` without confirming the SIGKILL'd child exited |
| F6 | P2 | `daemon-reelection-adoption-live.vitest.ts:210` | Adoption test never exercises fresh-session reap while a secondary is bridged |

Full evidence chains and the F1 claim-adjudication packet are in `iterations/iteration-001.md`.

## 4. Remediation Workstreams

**WS-1 — Adopt-before-reap (fixes F1, contains F2):** In the `staleReclaimable` branch (`main()` 1482-1502), before reaping `childPid`, probe the daemon socket (`bridgeReadiness`/`getIpcSocketPath`). If the socket is live, **bridge/adopt** the daemon and rewrite the lease owner to self (mirror `respawnAfterDeadSocket`'s superseded checks) instead of reaping. Only reap when the socket is confirmed dead or unowned. Add a daemon-identity guard (compare a `childStartedAt` recorded in the lease, or the socket's reported pid) so a recycled pid is never signalled — closes F2.

**WS-2 — Reap completeness (fixes F5):** Honour the post-SIGKILL `waitForPidExit` result in `reapLeaseChildBeforeRespawn` (713); if the child is still alive after SIGKILL, return `!allowed` so `main()` reports lease-held rather than spawning a second writer.

**WS-3 — EPERM availability (fixes F3):** On `child-liveness-unknown-eperm` in the stale-reclaim branch, attempt `bridgeOrReportLeaseHeldAndExit` against the live socket before falling back to the reconnect error, matching the dead-socket path.

**WS-4 — Hook interpreter resolution (fixes F4):** Resolve `node` robustly in the hook command (e.g. `command -v node || /opt/homebrew/bin/node || /usr/local/bin/node`) so macOS GUI-launched minimal-PATH environments keep a working interpreter without reintroducing the Linux-breaking hardcode.

**WS-5 — Close the test gap (fixes F6):** Add a third live adoption case: owner + secondary, dispose owner, assert secondary still served, THEN start a fresh session and assert the secondary keeps transport AND single-writer holds. This is the regression oracle for F1/WS-1.

## 5. Spec Seed

> The re-election launcher MUST preserve a live secondary's transport when a new session starts after the owner is disposed. A fresh session that finds a stale (dead-owner) lease pointing at a **live, socket-serving** daemon MUST adopt that daemon (bridge + reassign ownership), not reap and respawn it. Reaping the recorded `childPid` is permitted only when the daemon socket is confirmed dead/unowned AND the pid's identity is verified, and only after confirming the child has actually exited post-SIGKILL.

## 6. Plan Seed

1. WS-1 adopt-before-reap + identity guard in `main()` 1482-1502 and `reapLeaseChildBeforeRespawn` (P1/P2). 
2. WS-2 honour post-SIGKILL exit result (P2). 
3. WS-3 EPERM → bridge attempt (P2). 
4. WS-5 add the secondary-survives-fresh-session live test (regression gate for #1). 
5. WS-4 hook `node` resolution across `.claude/settings.local.json`, `.codex/hooks.json`, `.devin/hooks.v1.json` (P2). 
6. Re-run `stress:durability` (target 19/19 incl. new case) + launcher-lease suite; reconcile changelog/ENV_REFERENCE if the adopt-before-reap behaviour changes the documented lifecycle.

## 7. Traceability Status

| Protocol | Class | Status | Notes |
|----------|-------|--------|-------|
| `spec_code` | core/hard | **pass** | Launcher header comment (185-197) now states default-on-via-configs / code-default-off; `daemonReelectionEnabled` (198-200) returns off-by-default — comment matches code. Reap commit message claim ("reaps the released daemon before respawn for a single writer") matches `main()` 1482-1502 — but the doc omits the live-secondary eviction (F1) the code now causes. |
| `checklist_evidence` | core/hard | N/A (files target) | No checklist.md in review scope for this fan-out lineage; covered by parent packet. |
| `feature_catalog_code` | overlay/advisory | not run | Catalog files outside this lineage's file target; deferred to sibling lineages / merge. |
| `agent_cross_runtime` | overlay/advisory | partial | Hook configs across `.claude`/`.codex`/`.devin` are now uniform (`${RT_PROJECT_DIR:-$PWD}` + bare `node`), confirming parity — but uniformly carry the F4 PATH dependency. |

**Unresolved traceability gap:** the changelog/feature-catalog narrative describes "secondary keeps transport through owner disposal" as an unconditional guarantee; the code (F1) makes it conditional on no later session starting. Doc-vs-code drift to reconcile with WS-1.

## 8. Deferred Items

- All five P2s (F2–F6) are advisories under the CONDITIONAL verdict; none block on their own, but F2 and F5 share F1's root cause and should ship together with WS-1.
- Overlay protocols `feature_catalog_code` / `playbook_capability` not executed (target files did not include catalog/playbook docs) — left to sibling fan-out lineages and the merge step.
- `check-comment-hygiene.sh` (a Python checker named `.sh`) and the `model-server-supervision.cjs` reap primitives were read and found sound for the recent-change surface; no findings.

## 9. Audit Appendix

- **Coverage:** 12/12 in-scope files read; all 4 dimensions touched in the single breadth pass (correctness F1/F2/F5, availability/portability F3/F4, traceability §7, test-coverage F6).
- **Replay validation:** single iteration; `newFindingsRatio=0.6` (P1 present forces ratio ≥ 0.50 P0/P1 override floor). `maxIterations=1` is the legal stop reason — not a convergence-claimed stop, so the dimension-coverage stabilization gate is intentionally not asserted for this fan-out lineage; the parent `fanout-merge` applies strongest-restriction across lineages.
- **Adversarial replay:** F1 passed Hunter/Skeptic/Referee with a typed claim-adjudication packet (5 file:line citations + a passing adoption test proving secondary use of the reaped daemon); finalSeverity P1, downgradeTrigger recorded. No P0 asserted, so no P0 replay required.
- **Method integrity:** every finding cites re-read code at the stated file:line; the release-path mechanism behind F1 was independently confirmed at `mk-spec-memory-launcher.cjs:1372-1384`.

---

Review verdict: CONDITIONAL
