---
title: "Deep Review Report R2 (Opus 4.8): Session Code-Graph Audit-Fix Verification [system-spec-kit/026-graph-and-context-optimization/004-code-graph/011-source-bug-and-misalignment-audit/review-r2-opus/review-report]"
description: "Second independent 10-round deep review (Opus 4.8, Workflow-orchestrated) of the 011 code-graph audit-fix work in its REMEDIATED state, cross-checking the prior gpt-5.5-fast review. Verdict CONDITIONAL: 0 P0, 1 P1, 4 P2; 21 landed fixes affirmatively verified sound and all 9 deferred findings re-validated. The P1 (OR-1-01) is a fix-incomplete: the DR-001-02/006-02 launcher migration-back landed the override-skip half but not the lock-before-migrate half, leaving a relocated target-clobber data-loss window."
trigger_phrases:
  - "opus deep review code-graph audit fixes"
  - "OR-1-01 migration-back lock-before-migrate"
  - "review-r2 fixes verified sound"
importance_tier: "important"
contextType: "implementation"
---

<!-- SPECKIT_DOC: review-report -->

# Deep Review Report R2 — Session Code-Graph Audit-Fix Verification (Opus 4.8)

> Second independent deep-review loop, **10 rounds**, executor **Opus 4.8 agents orchestrated via the Workflow tool** (per owner direction; faithful to the deep-review skill contract — externalized state, P0/P1/P2, adversarial verification, convergence, packet-local artifacts). Target: the **remediated** state of this session's `system-code-graph` + launcher audit-fix work (commits `6f6c6595` / `8943837b` / `49a8a97d` / `5ec1caf4ee` + doc fix `016f47b4`) vs baseline `0ef38d58`. Read-only; no reviewed code modified. Cross-references the prior gpt-5.5-fast xhigh review (`../review/`) and a parallel agent's Opus daemon-shutdown review (`007-mcp-daemon-reliability/011-deep-review-shutdown-and-codegraph/`).
>
> **37 Opus agents, ~2.03M tokens, 600 tool-uses, ~10.7 min.** Each finding adversarially verified by **2 independent skeptics** (one "does-it-reproduce" lens, one "already-mitigated" lens); a finding survives as CONFIRMED-REAL only if **both** agree it is outstanding in current code.

---

## 1. Verdict & Summary

**Verdict: CONDITIONAL** (PASS-with-one-required-fix). No P0; no landed fix proven outright wrong. The remediation is **fundamentally sound** — the cross-model pass affirmatively verified 21 fixes and re-validated all 9 deferrals. But **one P1 (OR-1-01)** shows the DR-001-02/006-02 launcher migration-back fix is *incomplete*: it left the exact data-loss hazard class it was meant to eliminate partially open (relocated source→target).

| | Count |
|--|--|
| Rounds | 10 |
| Raw findings | 13 |
| **CONFIRMED-REAL** | **5** (1 × P1, 4 × P2) |
| Refuted / already-fixed / false-positive | 8 |
| P0 | 0 |
| **Landed fixes affirmatively VERIFIED sound** | **21** |
| Deferred findings re-verified accurate | 9 / 9 |

**Most important finding (OR-1-01, P1):** the launcher migration-back (`mk-code-index-launcher.cjs`) copies the legacy DB **before** acquiring any lock (`acquireOwnerLeaseFile` / `acquireBootstrapLock` run *after*), with no `COPYFILE_EXCL`. The fix landed the `SPECKIT_CODE_GRAPH_DB_DIR` override-skip half, but replaced the prior review's "acquire lease BEFORE migrating" recommendation with a **source-side** liveness probe (`formerLocationOwnerLive`) that never inspects the target. Two concurrent launchers can both pass the `!exists(target)` guard, both copy, and a lagging copier can truncate-overwrite the *now-live* target DB out from under the winner's running daemon → SQLite corruption.

---

## 2. Method

`pipeline(10 rounds, finder → 2-skeptic adversarial verify)` — disjoint focus per round so each round's findings verify while later rounds still run. Rounds: 1 launcher migration-back, 2 launcher lease CAS, 3 owner-lease race-class + bootstrap rename-claim, 4 path/socket security, 5 **regression-test validity (false-confidence audit)**, 6 DR-010-01 intra-phase cancellation, 7 status degraded envelope + handlers, 8 doc/code contract, 9 deferred re-verification + maintainability, 10 adversarial synthesis + completeness critic. Each finder read the *actual current* code and git-diffed it vs `0ef38d58`. Stop reason: **maxIterationsReached (10)**, convergence saturated by round 8.

---

## 3. CONFIRMED-REAL findings (fix these)

| ID | Sev | Kind | Location | Issue | Fix |
|----|-----|------|----------|-------|-----|
| **OR-1-01** | **P1** | fix-incomplete | `mk-code-index-launcher.cjs:857-878` | Migration-back runs **before any lock**; two concurrent launchers can both copy and a lagging one can clobber the first's now-live target DB (no `COPYFILE_EXCL`). DR-001-02's "lock-before-migrate" half was replaced by a source-only liveness probe. | Move migration **after** `acquireBootstrapLock()` (only the lock winner copies, before opening the DB); + re-check `!exists(target)` under the lock + `copyFileSync(…, COPYFILE_EXCL)`. Add a two-launcher migration regression test. |
| OR-2-01 | P2 | test-false-confidence | `tests/launcher-lease.vitest.ts:207` | The sole concurrency test takes the fresh `O_EXCL wx` path, never the DR-002-01 **reclaim** re-read CAS. Passes identically against un-fixed code. | Seed a stale-heartbeat lease (live ownerPid) and spawn **two** launchers so both hit the reclaim branch; assert exactly one wins. |
| OR-3-01 | P2 | fix-incomplete | `owner-lease.ts:104-148` | An orphaned **empty** mutation-lock (write/fsync failure mid-creation) is permanently unreclaimable (`lockPid===null` skips stale-reclaim) → `refreshOwnerLease` returns false forever → spurious heartbeat self-shutdown. New gap introduced by the DR-001-03/002-03 lock itself. | On write/fsync failure, `unlinkSync` the just-created lock before rethrow; OR treat `lockPid===null` as reclaimable behind an mtime-age guard. |
| OR-5-01 | P2 | test-false-confidence | `tests/ensure-ready.vitest.ts:375-420` | Both new auto-establish tests pass against the un-fixed gate (empirically confirmed: neutralizing `firstTimeAutoEstablish` left both green) — the `evaluateGuardedFullScan` fallback already yields the same decision. | Refixture so the fallback would produce the **opposite** decision, isolating `isDefaultEndUserScope` as the sole cause; both should flip when the gate is neutralized. |
| OR-8-01 | P2 | traceability | `readiness_and_scope_fingerprint.md:57` + `ARCHITECTURE.md:136` | `absent` still shown as a top-level readiness/freshness state, contradicting the remediation's own SKILL.md correction (`absent` is the trust-state projection of `empty`). Code: freshness ∈ `{fresh,stale,empty,error}` only. | Propagate the SKILL.md framing to both sibling docs; document `absent` only as the empty-graph `trustState`/`canonicalReadiness:missing` projection. |

---

## 4. Landed fixes affirmatively VERIFIED sound (cross-model value, 21)

The Opus pass did what the gpt-5.5 review could not — it **verified the remediation**, reading current code and (for tests) confirming they fail against restored baseline source:

- **7 of 8 prior P1s sound + complete:** DR-002-01 (reclaim re-read CAS + fresh O_EXCL), DR-002-02 (legacy PID+owner probe, fail-safe liveness), DR-003-01 (uid-check rejects foreign legacy lease + bridge derives from `resolvedDbDir`), DR-001-03 (release under mutation lock + re-read), DR-002-03 (stale cleanup re-reads pid, attempt-cap prevents spin), DR-008-02 (bootstrap atomic `renameSync`-claim before `rmSync`), DR-008-03 (double re-read before unlink). *(DR-001-02/006-02 is the 8th — partially sound; see OR-1-01.)*
- **The 4 new regression tests genuinely FAIL against baseline** (not false confidence): DR-003-02 canonical-db-dir symlink-escape-before-mkdir, DR-008-01 socket-dir owner/mode, DR-008-04 idle re-arm, DR-001-01 status degraded envelope.
- **DR-010-01** parse-candidates per-file abort: reachable (parseFile awaits getParser → yields), no partial-DB leak (persist runs only after the race resolves), only `indexWithTimeout` passes a signal.
- **Other session work verified:** BUG-03/CG-020 prune deferral wired end-to-end, BUG-01 read-path blocking widened, BUG-07 query blocked-envelope crash fix, CG-003 removeFile transaction safety, CG-005 tree-sitter `tree.delete()` finally, and all doc fixes in `016f47b4` (incl. exactly 8 tools in `tool-schemas.ts` + dispatch switch).

---

## 5. Deferred-findings re-verification (9 / 9 accurate)

All 9 deferrals from audit child `002` re-verified against current code: CG-002 (PARTIAL — numeric ranges still unenforced), CG-006/007/008/009/010/013/037 still standing and accurately deferred, **CG-020 confirmed CLOSED** by BUG-03 (verified wiring). CG-013 is now both standing *and* accurately documented.

---

## 6. What this Opus pass found that gpt-5.5 did not

1. **Fix-correctness verification** — affirmatively confirmed 21 fixes sound + that the 4 new tests genuinely fail against baseline. The gpt-5.5 review only flagged bugs; it did not validate the remediation.
2. **A genuinely-new P1 (OR-1-01)** — a fix-the-fix finding the prior review *could not* produce because it post-dates the remediation.
3. **Two new P2s introduced by the remediation itself** — OR-3-01 (orphan mutation-lock, from the DR-001-03/002-03 lock) and the false-confidence tests OR-2-01 / OR-5-01.

**Overlap with the parallel 007-opus daemon-shutdown review:** non-overlapping by design (that review = daemon shutdown idempotence / IPC-bridge liveness; this = launcher migration/lease/socket + readiness seams). A round-7 candidate (OR-7-01) noted as *complementary* to their IT02-CORR-01 was a single-skeptic finding, refuted/downgraded here, and is **not** carried forward as confirmed.

---

## 7. Convergence

Clean monotone decay. New-confirmed ratio: R1 `1.0` (OR-1-01 P1) → R2 `0.5` → R3 `0.33` → R4 `0.0` (security clean) → R5 `0.25` → R6 `0.0` → R7 `0.0` → R8 `0.2` (doc) → **R9 `0.0` → R10 `0.0`**. Rounds 6, 7, 9, 10 raw findings were all refuted/downgraded by the second skeptic — the loop self-corrected rather than inflating. The final two fresh-context adversarial passes added **zero** confirmed findings: the surface is saturated. **No further review rounds needed.**

---

## 8. Recommendations

1. **FIX BEFORE CLOSING THE AUDIT (P1, OR-1-01):** move migration-back **after** `acquireBootstrapLock()` so only the lock winner copies (before opening the DB); min hardening = re-check `!exists(target)` under the lock + `copyFileSync(…, COPYFILE_EXCL)`; add a two-concurrent-launcher migration regression test.
2. **HARDEN (P2, OR-3-01):** unlink the just-created lock on write/fsync failure in `tryAcquireOwnerLeaseMutationLock` (or self-heal an empty lock behind an mtime guard) to avoid spurious heartbeat self-shutdown under disk/IO failure.
3. **FIX FALSE-CONFIDENCE TESTS (P2, OR-2-01 + OR-5-01):** add a true reclaim-contention test; refixture the auto-establish tests so the fallback would decide the opposite. Optionally close the noted DR-010-01 abort-path coverage gap (correct but untested).
4. **DOC CONSISTENCY (P2, OR-8-01):** propagate the `absent`-is-not-a-freshness-state correction to `readiness_and_scope_fingerprint.md` §2 and `ARCHITECTURE.md` §136.

---

## 9. Status

`STATUS=OK` — review complete. Verdict **CONDITIONAL** (0 P0, 1 P1, 4 P2). Packet: `review-r2-opus/iterations/iteration-001..010.md`, `deep-review-state.jsonl`, `deep-review-findings-registry.json`, this report. **No reviewed code modified at review time.** Remediation landed afterward — see §10.

---

## 10. Remediation landed 2026-05-29

All 5 confirmed findings fixed via 4 file-disjoint Opus agents (Workflow-orchestrated) + per-fix adversarial verification. Typecheck clean; full suite **592 passed / 1 skipped / 0 failed**; `launcher-lease` stable 3×.

- **OR-1-01 (P1) — FIXED.** `mk-code-index-launcher.cjs`: the migration-back block was moved out of the pre-lock main IIFE and **into the `if (lockHeld)` branch** (after `acquireBootstrapLock()` succeeds, before `launchServer()` opens the DB), so only the single bootstrap-lock winner migrates. Belt-and-suspenders: pre-copy re-check of the sqlite target + every copy now uses `fs.copyFileSync(src, dst, fs.constants.COPYFILE_EXCL)` with EEXIST → treat the existing target as authoritative (never truncate-overwrite a possibly-live target). Verified `launchServer()` is the only DB-open and runs strictly after. New regression test asserts the target is migrated exactly once under two concurrent launchers. *Honesty note:* that test is a **probabilistic** race detector (deterministically stable-PASS on the fix; catches the un-fixed bug ~75% of runs, not 100%) — the fix's correctness does not depend on it; the lock-gate + `COPYFILE_EXCL` are the guarantee.
- **OR-3-01 (P2) — FIXED.** `owner-lease.ts` `tryAcquireOwnerLeaseMutationLock`: on the write/fsync failure path (fd owned) the orphan lock is now `unlinkSync`'d before re-throw; plus a conservative self-heal for pre-existing wedged empty locks (30 s mtime gate + re-confirm pid-still-null & mtime-unchanged before unlink). New dedicated test (`tests/lib/owner-lease-mutation-lock.vitest.ts`) genuinely **fails against the un-fixed code** (verified by reverting).
- **OR-5-01 (P2) — FIXED.** `tests/ensure-ready.vitest.ts`: both auto-establish tests refixtured so the `evaluateGuardedFullScan` fallback would decide the **opposite**, isolating `isDefaultEndUserScope`; both now genuinely **fail** when the gate is neutralized (verified empirically). Test-only; code-under-test untouched.
- **OR-2-01 (P2) — ADDRESSED with an honest scope note.** Added positive coverage of the concurrent stale-heartbeat **reclaim** branch (which the prior fresh-workspace test never reached). It is **not** a fail-iff-re-read-deleted test: empirically the DR-002-01 acquire-time re-read CAS is **redundant** at the launcher-spawn boundary — single-writer is independently enforced by `acquireBootstrapLock()` + the PID lease + the DR-008-03 re-read-before-unlink guard, so the re-read only narrows a sub-syscall window the other guards already cover. Documented in the test rather than fabricating a deterministic failure.
- **OR-8-01 (P2) — FIXED.** `readiness_and_scope_fingerprint.md` §2 + `ARCHITECTURE.md` §136 corrected to the four-value freshness enum with `absent` as the empty-graph trust projection; additionally propagated the same correction to two residual `absent` enumerations in `SKILL.md` (lines 293, 379) for full consistency.

### Residual finding for a FOLLOW-UP packet (NOT fixed — out of scope)

While fixing OR-1-01/OR-2-01, the launcher agent surfaced a **deeper owner-lease single-writer election race** (call it **OR-R-01**, observed on the *patched* launcher too): under two concurrent launchers both entering the stale-heartbeat **reclaim** branch, (a) the recorded PID lease (`writeLeaseFile()`) is last-writer-wins and can flip between the two launcher pids, and (b) the concurrent reclaim does not always reach a clean `LEASE_HELD_BY`/exit terminal state within ~12 s (both launchers can stay alive briefly). The `acquireBootstrapLock()` gate still prevents two *daemons*, so this is a lease-record-consistency / election-latency issue rather than a confirmed dual-writer — but it warrants its own scoped investigation (is it record-only, or can it transiently bridge to the wrong owner?). **Deferred to a follow-up packet; not fixed here** because it touches the owner-lease election beyond the 5 reviewed findings' file scope.

**Post-remediation verdict: PASS** (the 1 P1 + 4 P2 are resolved; OR-R-01 tracked as a follow-up).
