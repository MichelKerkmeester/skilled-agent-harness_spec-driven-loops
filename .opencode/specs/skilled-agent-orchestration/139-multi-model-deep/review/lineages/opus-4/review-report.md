# Deep Review Report — fanout lineage opus-4

**Target:** recent daemon-reliability + re-election + reap-before-respawn + hook-portability work (12 files)
**Mode:** review / files · **Executor:** native (opus) · **Iterations:** 1 (maxIterations=1) · **Dimensions:** correctness, security, traceability, maintainability

---

## 1. Executive Summary

**Verdict: CONDITIONAL** · `hasAdvisories: true` · Release-readiness: `converged`

| Severity | Active |
|----------|--------|
| P0 | 0 |
| P1 | 1 |
| P2 | 3 |

The recent work is largely sound and well-instrumented: the reap-before-respawn fix, the
re-election release-vs-kill decision, the lease-probe retry hardening, the reconnecting
session proxy, the session-cleanup ancestry re-proof, and the hook-portability rewrite all
hold up under reading, and the live + hermetic durability tests verify the headline
SEQUENTIAL single-writer path (including an `lsof`-based co-residency assertion). Two weak
candidate findings were actively refuted during review (the live test's `SPEC_KIT_DB_DIR`
is honored at `dist/core/config.js:35`, not dead; every portability hook target exists on
disk, including the Devin cross-package one).

One **P1** keeps this CONDITIONAL: the reap-before-respawn fix documents an `O_EXCL` "spawn
mutex" that does not actually hold for the stale-owner-lease reclaim branch it guards.
Under CONCURRENT fresh-launcher startup against a stale (SIGKILL'd/crashed/heartbeat-stale)
owner lease — the case where a detached re-election daemon is still alive — two launchers
can both "acquire" via the non-exclusive last-writer-wins reclaim and both respawn a daemon,
re-opening the double-WAL-writer window the fix exists to close. The clean-disposal headline
path is safe (it clears the owner lease and takes the real `O_EXCL` branch); only the
stale-owner sub-case is exposed.

**Scope note:** the packet's `spec.md` / `implementation-summary.md` are unfilled Level-2
scaffolds (`completion_pct: 0`); the operative contract reviewed against is
`review/shared-context.md`. The 3 runtime MCP configs that flip the re-election default-on
are not in the 12-file target set and were not verified here.

## 2. Planning Trigger

CONDITIONAL routes to `/speckit:plan` for remediation. The single P1 (F001) is a latent
correctness/data-integrity hole in the single-writer invariant; it warrants a small,
well-scoped fix (atomic compare-and-swap reclaim + a concurrent-reclaim regression test)
before this work is treated as release-final. The three P2 advisories can ride the same
plan or defer.

## 3. Active Finding Registry

| ID | Sev | Dim | Title | Evidence | First/Last |
|----|-----|-----|-------|----------|------------|
| F001 | P1 | correctness | Stale-owner-lease reclaim is not a true mutex; reap fix's `O_EXCL` claim does not hold for its branch | `mk-spec-memory-launcher.cjs:468-481,456-467,1486-1502,1522-1529` | 1/1 |
| F002 | P2 | security | spec-memory `leaseHeldFromFile` lacks the foreign-uid legacy-lease guard code-index enforces | `mk-spec-memory-launcher.cjs:556-572` vs `mk-code-index-launcher.cjs:502-510` | 1/1 |
| F003 | P2 | correctness | Re-election release path SIGTERMs then `process.exit(0)` synchronously; SIGKILL escalation never fires | `mk-spec-memory-launcher.cjs:1372-1385`, `model-server-supervision.cjs:351-356` | 1/1 |
| F004 | P2 | maintainability | code-index launcher carries the same non-exclusive stale-owner reclaim + overstated comment | `mk-code-index-launcher.cjs:415-429,916-918` | 1/1 |

## 4. Remediation Workstreams

**WS-1 — Single-writer reclaim mutex (F001, F004) [recommended first]**
Replace the non-exclusive `writeOwnerLeaseFile` + reread reclaim with an atomic
compare-and-swap (reclaim by renaming an `O_EXCL`-created temp keyed on a unique token, or
share owner-lease's mutation lock) in BOTH launchers. Add a CONCURRENT stale-reclaim
co-residency regression: two launchers racing a SIGKILL'd owner, assert
`sqliteOpenerPids(dbDir).length === 1`.

**WS-2 — Release-path teardown escalation (F003)**
Mirror the normal-shutdown SIGTERM→grace→SIGKILL escalation for the released model-server
tree, or explicitly document the single-signal best-effort behavior and its reliance on
idle-self-exit + orphan-sweep (which defaults OFF).

**WS-3 — Legacy-lease uid parity (F002)**
Port the code-index foreign-uid guard into spec-memory `leaseHeldFromFile` for legacy-path
leases before trusting their recorded `socketPath`.

## 5. Spec Seed

- REQ: The owner-lease reclaim of a stale (non-null) lease MUST be atomically exclusive —
  at most one concurrent launcher may transition to owner. Acceptance: a concurrent
  stale-reclaim test shows exactly one sqlite opener under the DB dir.
- REQ: A LEGACY-path lease MUST NOT be honored (bridged to) unless its file is owned by the
  current uid, in BOTH launchers.
- REQ: The re-election release teardown MUST bound model-server (and descendant) survival
  with a SIGKILL escalation OR document the bounded-by-sweep behavior.

## 6. Plan Seed

1. (F001/F004) Implement atomic CAS reclaim in `acquireOwnerLeaseFile()` for both launchers; update the inline comments to state the ACTUAL guarantee.
2. (F001) Add `daemon-reelection-concurrent-reclaim.vitest.ts`: spawn owner, SIGKILL it (leave detached daemon), start N fresh launchers simultaneously, assert single sqlite writer.
3. (F003) Add SIGTERM→grace→SIGKILL escalation (or `await`/document) in the release branch.
4. (F002) Add the uid guard to spec-memory `leaseHeldFromFile` legacy path.

## 7. Traceability Status

| Protocol | Level | Status | Notes |
|----------|-------|--------|-------|
| spec_code | core (hard) | partial | All shared-context claims verify against code EXCEPT the inline "O_EXCL spawn mutex" claim (F001). Reap-before-respawn + EPERM bail confirmed (`:1482-1502`). |
| checklist_evidence | core (hard) | partial | `spec.md`/`implementation-summary.md` are unfilled scaffolds; verified against `review/shared-context.md`. |
| feature_catalog_code | overlay (advisory) | n/a | Re-election default-on configs out of the 12-file target scope. |
| playbook_capability | overlay (advisory) | n/a | No in-scope playbook scenarios. |

## 8. Deferred Items

- **memory_save replay duplicate-secondary-index gap** (`launcher-session-proxy.cjs:146-153`): explicitly documented as a known, out-of-scope-for-this-proxy gap (needs an idempotency token threaded into the save handler behind the daemon IPC). Recorded as deferred, not a new defect.
- **`check-comment-hygiene.sh` python-in-`.sh`**: invoked via `python3` everywhere; cosmetic naming convention, pre-existing — no action.
- Verifying the 3 runtime MCP re-election-default configs and the Barter mirror sync (out of scope).

## 9. Audit Appendix

**Coverage:** 12/12 target files read in full; all 4 dimensions covered in the single breadth pass.

**Iteration table:**
| Iter | Focus | Files | newFindingsRatio | P0/P1/P2 | Status |
|------|-------|-------|------------------|----------|--------|
| 1 | all dimensions (breadth) | 12 | 0.85 | 0/1/3 | complete → CONDITIONAL |

**Convergence / stop:** `maxIterations=1` reached after one full-coverage pass; dimensionCoverage=1.0; not a false-positive STOP (single-pass run by design). P0-override not triggered (no P0). Claim-adjudication packet present and passing for the sole P1 (F001).

**Adversarial replay (F001):** counter-evidence sought across the bootstrap lock (build-only, not a spawn mutex), the writeLeaseFile reprobe (second non-exclusive TOCTOU, reduces not eliminates), and SQLite WAL semantics (multiple openers permitted — no OS backstop). Severity held at P1 with confidence 0.72; downgrade trigger recorded (atomic CAS reclaim + concurrent-reclaim regression, or exclusive DB-open lock).

**Refuted candidates (kept out of the registry):** dead-`SPEC_KIT_DB_DIR` (honored at `dist/core/config.js:35`); missing Devin hook target (exists on disk).
