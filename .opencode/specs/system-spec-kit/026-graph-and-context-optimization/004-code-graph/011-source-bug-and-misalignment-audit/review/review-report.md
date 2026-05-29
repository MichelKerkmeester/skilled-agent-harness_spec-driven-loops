---
title: "Deep Review Report: Session Code-Graph Work (10 iterations) [system-spec-kit/026-graph-and-context-optimization/004-code-graph/011-source-bug-and-misalignment-audit/review/review-report]"
description: "10-iteration autonomous deep review (cli-opencode → openai/gpt-5.5-fast --variant xhigh) of this session's system-code-graph audit remediation + fix #1 DB relocation. Verdict CONDITIONAL: no P0; the DB relocation core is sound (suite green), but the launcher migration-back/legacy-lease code added for fix #1 has confirmed P1 bugs the test suite does not cover. Deferred-findings documentation verified accurate."
trigger_phrases:
  - "deep review session code-graph"
  - "fix #1 launcher migration-back bugs"
importance_tier: "important"
contextType: "implementation"
---

<!-- SPECKIT_DOC: review-report -->

# Deep Review Report — Session Code-Graph Work

> Autonomous deep-review loop, **10 iterations**, executor **`cli-opencode → openai/gpt-5.5-fast --variant xhigh`**, dimensions correctness / security / traceability / maintainability. Read-only; no reviewed code modified. Target: this session's changes vs baseline `0ef38d58` (fix #1 DB relocation + audit remediation, commits `69e7bf12` / `4f1dc0ed` / `574267cf67`).

---

## 1. Verdict & Summary

**Verdict: CONDITIONAL** (PASS-with-required-fixes). No P0. The fix #1 **DB relocation core is sound** (resolves skill-local, suite 577 green) and the **audit-fix subset is correct**, but the **launcher (`.cjs`) migration-back + legacy-lease logic I wrote for fix #1 has 6 confirmed P1 bugs** the green test suite never exercises (no test covers the migration path or legacy-lease probing).

| | Count |
|--|--|
| Raw findings (iters 1-8, 10) | 36 |
| **P1 CONFIRMED-REAL** (session-owned, actionable) | **8** |
| P1 PRE-EXISTING (real, not this session — predate baseline / operator WIP) | 11 |
| P2 | 14 |
| P0 | 0 |
| Adversarial verdicts (iter 9) | 16 (7 CONFIRMED-REAL, 9 PRE-EXISTING/downgraded) |

**Most important finding:** the launcher migration-back block (`mk-code-index-launcher.cjs:787`) copies the legacy `.spec-kit` DB **before** any lease check and **ignores `SPECKIT_CODE_GRAPH_DB_DIR`** — so an override run still seeds the default skill-local DB, and two concurrent launchers can both migrate (DR-001-02 / DR-006-02).

---

## 2. Method

Iterations 1-2 correctness, 3 security, 4 traceability, 5 maintainability, 6 fix-#1 soundness, 7 deferred-findings verification, 8 launcher/IPC reliability, **9 adversarial verification** (independently confirm/refute every P0/P1), 10 completeness-critic. Each iteration was a fresh `gpt-5.5-fast xhigh` reviewer reading the externalized packet state and writing findings with exact `file:line` evidence. Stop reason: **maxIterationsReached (10)**.

---

## 3. CONFIRMED-REAL findings — session-owned, fix these (8 × P1, 1 × P2)

All cluster in the **fix #1 launcher migration-back / legacy-lease** code and `owner-lease.ts`:

| ID | Sev | Location | Issue | Fix |
|----|-----|----------|-------|-----|
| DR-001-02 / DR-006-02 | P1 | `mk-code-index-launcher.cjs:787` | Migration-back copies the legacy DB **before** lease checks (two launchers can both migrate) **and ignores `SPECKIT_CODE_GRAPH_DB_DIR`** (override runs still seed the default skill-local DB) | Acquire the bootstrap/owner lease before migrating; resolve the migration target from `resolvedDbDir()` (honoring the override), not the hardcoded skill-local default |
| DR-002-01 | P1 | `mk-code-index-launcher.cjs:347` | Launcher `acquireOwnerLeaseFile` reclaim still uses last-writer-wins — the CG-016/017 CAS fix I made in `owner-lease.ts` was **not** mirrored into the `.cjs` launcher copy | Port the re-read+verify CAS to the launcher reclaim path |
| DR-002-02 | P1 | `mk-code-index-launcher.cjs:220` | My relocated `legacyLeasePaths()` probes legacy **PID** leases but not legacy **owner** leases at `.spec-kit` | Probe both the PID and owner lease at the former location |
| DR-003-01 | P1 (sec) | `mk-code-index-launcher.cjs:411` | A PID-only legacy lease can bridge MCP traffic to a **spoofed `/tmp` socket** | Validate the bridged socket's owner/identity before connecting |
| DR-002-03 | P1 | `owner-lease.ts:122` | Mutation-lock stale cleanup can `unlink` a **successor** lock (read-then-unlink race) — same class as the CG-016/017 fix but in the mutation-lock path | Re-verify ownership immediately before unlink (CAS) |
| DR-007-07 | P1 (doc) | `recovery-procedures.ts:261` + audit child `002` | **CG-010 deferred reason is WRONG**: my child-002 note misstates the rollback no-op semantics | Correct the CG-010 deferral note |
| DR-007-01 | P2 (doc) | `tool-schemas.ts:200` + audit child `002` | **CG-002 is PARTIAL, not done**: BUG-04 enforces enum/minLength/additionalProperties but **not numeric ranges** | Update child-002 to "PARTIAL" + note the numeric-range gap |

---

## 4. PRE-EXISTING findings (real, but NOT caused by this session)

The adversarial pass attributed these to baseline `0ef38d58` or operator BUG-03/04/06 WIP — they are real but out of this session's authorship:

- DR-003-02 (P1 sec) `canonical-db-dir.ts:25` — symlink-escape: dir created before the outside-workspace reject. Pre-dates baseline.
- DR-001-01 (P1) `status.ts:204` — degraded fallback can be bypassed by a stored-scope read. Pre-existing.
- DR-001-03 (P1) `owner-lease.ts:451` — `releaseOwnerLease` successor race. Pre-existing.
- DR-008-01/02/03 (P1 sec) launcher `/tmp` IPC trust, bootstrap-lock successor delete, owner-lease read-then-unlink — pre-existing launcher reliability gaps.
- DR-010-01 (P1) auto-index `AbortSignal` can't stop the monolithic parse phase — operator BUG-06 WIP.

---

## 5. Deferred-findings reconciliation (validates the audit packet)

The review independently re-checked all 9 deferrals from child `002`. **8 of 9 deferral calls were correct:**

| Finding | Audit said | Review verdict |
|---------|-----------|----------------|
| CG-006 | deferred (BUG-06 overlap) | ✅ STILL-STANDS (`scan.ts:631`) |
| CG-007 | deferred | ✅ STILL-STANDS (`ensure-ready.ts:494`) |
| CG-008 | deferred | ✅ STILL-STANDS (`ensure-ready.ts:187`) |
| CG-009 | deferred | ✅ STILL-STANDS (`apply-orchestrator.ts:415`) |
| CG-013 | deferred (cwd-divergence) | ✅ STILL-STANDS (`readiness-marker.ts:22`) |
| CG-020 | done by BUG-03 | ✅ confirmed addressed |
| CG-002 | done by BUG-04 | ⚠️ **PARTIAL** — numeric ranges still unenforced (DR-007-01) |
| CG-010 | deferred | ⚠️ stands, but **deferral reason is wrong** (DR-007-07) |

---

## 6. Coverage

10 iterations covered all 4 dimensions across the 47-file session scope. Most reviewed: launcher `.cjs`, `owner-lease.ts`, `config.ts`, `readiness-marker.ts`, `code-graph-db.ts`, `scan.ts`, `apply-orchestrator.ts`, `recovery-procedures.ts`, `tool-schemas.ts`, IPC + docs. Completeness pass (iter 10) flagged `structural-indexer.ts` / `cross-file-edge-resolver.ts` as lighter-touch (no findings surfaced there).

---

## 7. Recommended remediation

1. **Fix the launcher migration-back** (DR-001-02 / DR-006-02): lease-before-migrate + honor `SPECKIT_CODE_GRAPH_DB_DIR`. Highest priority — it's the riskiest fix #1 defect and untested.
2. **Port the CAS fixes into the `.cjs` launcher** (DR-002-01/02, DR-003-01) — the launcher has its own copies of the lease logic that didn't get the `owner-lease.ts` CG-016/017 treatment.
3. **`owner-lease.ts` mutation-lock CAS** (DR-002-03).
4. **Correct the audit packet** (DR-007-01, DR-007-07): mark CG-002 PARTIAL, fix the CG-010 deferral reason.
5. Pre-existing items (§4) are tracked but out of this session's scope.

These should become scoped follow-on fix packets; none block the already-landed, suite-green relocation.

---

## 8. Convergence

Ran to **maxIterations=10** (operator-requested). New-findings ratio fell across iters 4-6 and 8-10 (doc + maintainability passes added mostly P2); the adversarial + completeness passes (9-10) surfaced reclassification and one new P1, indicating the P1 surface was near-saturated by iter 8.

---

## 9. Status

`STATUS=OK` — review complete, no P0, verdict CONDITIONAL. Packet: `review/iterations/iteration-001..010.md`, `review/deep-review-state.jsonl`, this report.

### Remediation landed 2026-05-29 (commit pending)

The 5 CONFIRMED-REAL session-owned findings from §3 are now FIXED + verified (typecheck clean; full suite 583 passed / 0 failed):
- **DR-001-02 / DR-006-02** — launcher migration-back now skips when `SPECKIT_CODE_GRAPH_DB_DIR` is set, targets `resolvedDbDir()`, and refuses to copy while a live legacy PID **or** owner lease exists (`formerLocationOwnerLive`).
- **DR-002-01** — `acquireOwnerLeaseFile` reclaim + `refreshOwnerLeaseFile` now re-read after the atomic write (single-winner CAS), matching the `owner-lease.ts` CG-016/017 fix.
- **DR-002-02** — the migration guard now probes the legacy `.code-graph-owner.json` owner lease (not just the PID lease).
- **DR-003-01** — `leaseHeldFromFile` rejects a legacy-location lease whose file is not owned by the current uid (no bridging to a foreign/spoofed socket).
- **DR-002-03** — `owner-lease.ts` stale mutation-lock removal is now identity-checked (re-read pid immediately before unlink). Residual: a nonce/lock-dir would close the final narrow window fully (noted for a future hardening packet).

PRE-EXISTING findings (§4) and the deferred audit findings remain out of scope (operator WIP / separate packets).
