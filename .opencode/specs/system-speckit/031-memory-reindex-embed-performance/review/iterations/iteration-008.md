# Iteration 8 — Adversarial Re-verification of P1-001

## Dimension

D1 Correctness (adversarial re-verification): treat P1-001 as a hypothesis under challenge. Try to REFUTE the prior iterations' claim that `refreshOwnerLeaseFile` and `clearOwnerLeaseFile` are not mutation-atomic against the validated `leaseId`. Construct three concrete interleaving scenarios, adjudicate each against the actual code, and give an honest final severity.

## Files Reviewed

- `.opencode/bin/mk-spec-memory-launcher.cjs:454-468` — `buildOwnerLease` (leaseId generator: `crypto.randomUUID()` per lease instance).
- `.opencode/bin/mk-spec-memory-launcher.cjs:512-560` — `acquireOwnerLeaseFile` with its reclaim fence at lines 529-548.
- `.opencode/bin/mk-spec-memory-launcher.cjs:562-579` — `refreshOwnerLeaseFile` (heartbeat refresh).
- `.opencode/bin/mk-spec-memory-launcher.cjs:588-604` — `startOwnerLeaseHeartbeat` (interval driver).
- `.opencode/bin/mk-spec-memory-launcher.cjs:611-626` — `clearOwnerLeaseFile` (graceful-shutdown cleanup).
- `.opencode/bin/mk-spec-memory-launcher.cjs:628-638` — `clearOwnerLeaseFileIfOwner` (idempotent cleanup variant).
- `.opencode/skills/system-spec-kit/mcp-server/tests/launcher-spec-memory-lifecycle.vitest.ts:114-161` — existing TOCTOU test for the ACQUIRE reclaim path (covers lines 535-542, NOT refresh/clear).
- `.opencode/skills/system-spec-kit/mcp-server/tests/launcher-lease.vitest.ts` — CAS reclaim suite (read-only, structural reference).
- `.opencode/specs/system-speckit/031-memory-reindex-embed-performance/deep-review-findings-registry.json` — re-load to confirm current adjudication state.
- `.opencode/specs/system-speckit/031-memory-reindex-embed-performance/deep-review-strategy.md` §7 + §12 — confirm "next focus" was adversarial P1-001 re-verification.
- `.opencode/specs/system-speckit/031-memory-reindex-embed-performance/review/iterations/iteration-007.md` — previous iteration's P2-003 narrative (invariant anchor gap in clear paths).
- `.opencode/specs/system-speckit/031-memory-reindex-embed-performance/review/deltas/iter-007.jsonl` — previous iteration's P2-003 delta (asymmetric-protection rationale: only `acquireOwnerLeaseFile` changes leaseId, and it always changes ownerPid first via O_EXCL-CAS — so checking ownerPid on the reread IS sufficient).

## Pre-Plan

Read the three lease-mutation functions (refresh + clear × 2) completely. Verify line citations from iteration 1 and iteration 7 against the actual current code. Construct three timestamped interleaving scenarios. For each: (i) genuine data-integrity/split-brain, (ii) cosmetic/self-healing bookkeeping confusion, or (iii) NOT POSSIBLE. Adjudicate P1-001 final severity with a CLAIM ADJUDICATION block (claim/evidenceRefs/counterevidenceSought/alternativeExplanation/finalSeverity/confidence/downgradeTrigger).

## Re-read Verification of Prior Line Citations

| Citation | Source | Re-verified |
|---|---|---|
| iter-1: `mk-spec-memory-launcher.cjs:562-578` (refresh fence) | iter-1 state.jsonl line 3 findingDetails[0].file | YES — current code at lines 562-579; one additional line at 578 (`return true`) which iter-1 cited by end of function. |
| iter-7: `mk-spec-memory-launcher.cjs:611-638` (clear fence asymmetry) | iter-7.md line 7 + iter-7.jsonl line 2 | YES — current code at lines 611-638 matches exactly. L615-616 ownerPid+leaseId+ownerPid, L631-632 ownerPid+ownerPid only. |
| iter-7: `mk-spec-memory-launcher.cjs:576` (refresh second-read is leaseId-checked) | iter-7.md line 41 | YES — line 576 reads `reread.ownerPid !== nextOwnerPid || reread.leaseId !== lease.leaseId` (both fields). |
| iter-7: `mk-spec-memory-launcher.cjs:564-567` (refresh WHY comment) | iter-7.md line 37 | YES — exact four-line comment anchored, citing "a stale writer whose ownerPid happens to still read back". |

All four citations hold. No drift between prior iterations' citations and current code.

## The Three Interleaving Scenarios

### Scenario (a) — Refresh late-arrival heartbeat (cross-process)

**Setup**:
- T0: Process A holds lease L1 with `leaseId=X`, `ownerPid=A`. A's in-memory `ownerLeaseId=X`.
- T0+ε: A's heartbeat timer fires; A enters `refreshOwnerLeaseFile(A)`.
- T0+ε+δ: A's `readOwnerLeaseFile()` at L563 returns L1 (leaseId=X, ownerPid=A).
- T0+ε+2δ: L568 check `lease.ownerPid === A && lease.leaseId === X` — PASSES.
- T0+ε+3δ: Window — A is about to call `writeOwnerLeaseFile` at L570.
- **T0+ε+4δ: Process B's stale-reclaim completes** (B was already past its own classify-as-stale read and just finished `unlinkSync` + `writeFileSync` of L2 with `leaseId=Y`, `ownerPid=B`).
- T0+ε+5δ: A's `writeOwnerLeaseFile` at L570 OVERWRITES L2 with L1 (with heartbeat patch: `lastHeartbeatIso`).
- T0+ε+6δ: A's `readOwnerLeaseFile()` at L575 reads L1 (because A just wrote it).
- T0+ε+7δ: L576 check `reread.ownerPid === A && reread.leaseId === X` — PASSES (A's own write).
- T0+ε+8δ: `refreshOwnerLeaseFile` returns `true`. A "wins" the race.
- T0+ε+9δ: B's next heartbeat: `refreshOwnerLeaseFile(B)` reads L1 (ownerPid=A), ownerPid mismatch (A vs B) — returns `false`. B's heartbeat caller at L595 shuts B down via SIGTERM.

**Verdict**: **(ii) cosmetic/self-healing bookkeeping confusion** — the file ends up with A's leaseId (not corrupted as a different leaseId), but B's acquisition was lost. The damage is bounded: B self-terminates via the heartbeat fence at L595-601, no data corruption (lease file is metadata; SQLite sidecar is the integrity backstop), A continues as if nothing happened. A's "win" is silent — neither side logs a "I stole the lease" event.

**Is this exploitable as (i) split-brain?** No. The fence at L595 catches B's misaligned heartbeat and triggers shutdown. There is never a moment where both A and B believe they are simultaneously valid owners of the file AND both are writing to it.

**Was the existing second-read fence (L575-576) intended to close this scenario?** No — the L575-576 reread sees A's own write (which has A's leaseId), so it doesn't help. The window for the bug is specifically between L563 (first read) and L570 (write).

**Counterevidence sought**: Could the L575-576 fence catch this? No, because A's write at L570 resets the file to A's leaseId BEFORE L575 reads. The fence reads back A's own write.

**Alternative explanation for why this hasn't surfaced**: The window is sub-microsecond (between two sync fs operations on the same Node thread). On Linux, two concurrent processes racing for this would need extraordinarily precise timing. On macOS/Windows, slightly different but still OS-bound. The implementer's note in strategy.md §13 ("a sub-microsecond OS-level TOCTOU window between the re-validation read and the unlink syscall — implementer judged this proportionate given the SQLite sidecar lock is the real integrity backstop") frames this exact class of window as accepted-risk. The refresh path's window is the SAME class as the acquire path's already-accepted window (acknowledged in §13 item 1).

### Scenario (c) — Heartbeat vs stale-reclaim within the SAME process

**Setup**:
- A single Node process. A is the only owner of the lease file.
- A's heartbeat interval (`ownerLeaseHeartbeatTimer`, L593-602) fires every `ttlMs/2`.
- Could `refreshOwnerLeaseFile` interleave with `acquireOwnerLeaseFile` on the SAME process?

**Analysis**:
- `refreshOwnerLeaseFile` at L562-579 is fully SYNCHRONOUS — no `await`, no `setTimeout`, no I/O scheduling that releases the event loop between L563 and L578.
- `acquireOwnerLeaseFile` at L512-560 is also fully SYNCHRONOUS.
- Node's event loop is single-threaded; while either function runs, no other JS code (timer callback, microtask, I/O callback) can execute.
- The heartbeat interval callback (L594) and any "external" call to `acquireOwnerLeaseFile` (e.g., from another code path that the launcher itself drives) are mutually exclusive within a single tick.

**Verdict**: **(iii) NOT POSSIBLE.** Node's single-threaded event loop makes this scenario structurally impossible. The "single-process race" the prompt asks about is ruled out by the runtime, not by any fence.

**Could there be a filesystem-level race within the same process?** No — sync I/O is sync to JS. No preemption within a synchronous code path.

### Scenario (b) — Clear cross-process (cleanup fence)

**Setup**:
- T0: Process A holds lease L1 (leaseId=X, ownerPid=A). A is shutting down (calls `clearOwnerLeaseFile`).
- A's in-memory `ownerLeasePid=A`, `ownerLeaseId=X`.
- T0+ε: A enters `clearOwnerLeaseFile` at L611.
- T0+ε+δ: L612 check `Number.isInteger(ownerLeasePid)` — TRUE.
- T0+ε+2δ: L614 reads lease, returns L1.
- T0+ε+3δ: L615 checks `lease.ownerPid === A && lease.leaseId === X` — TRUE.
- T0+ε+4δ: L616 second read — returns L1 (B hasn't acted yet).
- **T0+ε+5δ: Process B's stale-reclaim completes** — unlinks L1, writes L2 (leaseId=Y, ownerPid=B).
- T0+ε+6δ: A's `fs.unlinkSync(ownerLeasePath())` at L617 — removes L2.

**Verdict**: **(ii) cosmetic/self-healing bookkeeping confusion.** Damage: B's fresh lease is deleted by A's stale-clear. B's next heartbeat at L594 reads lease — but the file is now gone (`readOwnerLeaseFile` returns null), L568 check `lease === null` — returns false. B shuts down via L595-601.

**Is this exploitable as (i) split-brain?** No — A is shutting down; B is heartbeating. There's no simultaneous concurrent write to the same file from both. The damage is B's L2 being deleted, but B's heartbeat fence catches the inconsistency (no lease file → shutdown).

**Counterevidence sought**: Does the second-read fence at L616 close this? L616 reads L1 (B hasn't acted yet). The check at L616 is `readOwnerLeaseFile()?.ownerPid === ownerLeasePid` — that's A's pid matching L1's pid — TRUE. So the second-read fence PASSES, then unlinkSync at L617 executes. The fence did NOT close this scenario because the race window is between L616 (second read) and L617 (unlinkSync), NOT between L614 and L616.

**Alternative explanation**: Could B's reclaim complete BEFORE A's L614 read? If so, A's L614 returns L2 (ownerPid=B), L615 ownerPid mismatch (B vs A) — returns false (skips unlink). SAFE. So the exploitable window is specifically: L614-L616 reads L1 (A's), then B reclaims, then L617 unlinks L2. This requires B to act in the sub-microsecond gap between two sync filesystem reads.

**Was the `clearOwnerLeaseFileIfOwner` variant (L628-638) checked?** Yes. L631 checks `lease.ownerPid === ownerPid` (ownerPid-only, no leaseId). Same race window: between L632 second read and L633 unlink. B can interleave and have L2 deleted. Same verdict (ii). Note that `clearOwnerLeaseFileIfOwner` is even weaker (no leaseId check at all), but the asymmetry is logically sufficient because `acquireOwnerLeaseFile` always changes ownerPid first via O_EXCL-CAS — so if A still holds its in-memory ownerLeasePid and the FILE shows a different ownerPid, A knows B (or someone else) has taken over.

## Honest Synthesis — does P1-001 stand, get upgraded, or get downgraded?

| Aspect | Scenario (a) Refresh | Scenario (c) Same-process | Scenario (b) Clear |
|---|---|---|---|
| Exploitable window | L563→L570 (read→write) | None — JS single-threaded | L616→L617 (second-read→unlink) |
| Damage when triggered | B self-terminates | N/A | B self-terminates |
| Data corruption | No | N/A | No |
| Caught by existing fence? | No (L575-576 reads A's own write) | N/A | No (L616 reads L1, B acts before L617) |
| Likelihood | Sub-microsecond OS-level race | 0 | Sub-microsecond OS-level race |
| Severity class | (ii) bookkeeping confusion | (iii) not possible | (ii) bookkeeping confusion |
| Same class as implementer's accepted §13 item 1? | YES (the same TOCTOU class the implementer already acknowledged) | N/A | YES |

**Severity decision**: P1-001 STAYS P1. The original framing was directionally correct: refresh and clear validate a generation but do not fully bind the mutation atomically to that generation. The damage in all three scenarios is bounded (B self-terminates via the heartbeat fence; no data corruption; SQLite sidecar is the real integrity backstop per the implementer's own §13 acknowledgement). This matches the SAME class of TOCTOU the implementer already documented as accepted-risk for the ACQUIRE path (which has a stronger fence but still has a sub-microsecond window).

**Could it be downgraded to P2?** Only if the implementer ALSO moves the refresh reread fence to be a PRE-WRITE reread (L568's read-back-and-validate-then-write), or adopts flock on the lease file. Both are invasive changes for marginal safety gain. The §13 item 1 explicitly frames this as proportionate-accepted-risk. Downgrading would require the implementer to formally classify the refresh/clear windows as equally acceptable. Until that formal classification is made, P1-001's "this fence is incomplete" framing holds.

**Could it be upgraded to P0?** No. No data corruption, no security boundary crossed, no service-disruption-without-recovery. The heartbeat fence at L595-601 catches every inconsistency and triggers graceful shutdown with `clearAllLeaseFiles()` fallback (L599) so the system recovers.

**Final severity: P1.**
**Confidence: 75%.** The analysis is solid against the code; the 25% uncertainty is around the empirical probability of the sub-microsecond race actually firing in production (which would require real-world telemetry to confirm, not a code review).
**Downgrade trigger**: If the implementer formally accepts the refresh/clear windows as same-class-as-§13-item-1 (acknowledged-risk, sub-microsecond, bounded damage, no data corruption) and either (a) moves the reread to a pre-write position, or (b) adds flock on the lease file, P1-001 downgrades to P2 (documentation gap: the implementer's §13 acknowledgement should explicitly include the refresh/clear paths, not just the ACQUIRE path).

## Final P1-001 Adjudication (CLAIM ADJUDICATION block per doctrine)

- **Claim**: `refreshOwnerLeaseFile` (L562-579) and `clearOwnerLeaseFile`/`clearOwnerLeaseFileIfOwner` (L611-638) validate a generation (leaseId, ownerPid) before mutation but do not atomically bind the later replace/unlink to that generation. A stale writer can mutate a successor's lease in a sub-microsecond OS-level window between the second-read fence and the write/unlink syscall.
- **EvidenceRefs**:
  - `.opencode/bin/mk-spec-memory-launcher.cjs:563,568,570,575,576` — refresh: read, validate, write, reread, validate. Window between L568-validation and L570-write; L575-576 reread sees the writer's own write.
  - `.opencode/bin/mk-spec-memory-launcher.cjs:614,615,616,617` — clear: read, validate, reread, unlink. Window between L616-reread and L617-unlink.
  - `.opencode/bin/mk-spec-memory-launcher.cjs:631,632,633` — clearIfOwner: same class with weaker ownerPid-only fence.
  - `.opencode/skills/system-spec-kit/mcp-server/tests/launcher-spec-memory-lifecycle.vitest.ts:114-161` — only the ACQUIRE reclaim path is tested; no test exercises refresh or clear in TOCTOU window.
  - `.opencode/specs/system-speckit/031-memory-reindex-embed-performance/deep-review-strategy.md` §13 item 1 — implementer's own acknowledged risk for ACQUIRE path; refresh/clear windows are the SAME class but not explicitly acknowledged.
- **CounterevidenceSought**:
  - Is there a pre-write reread? NO (refresh L568 is the only validation before write at L570; clear L615-616 is the only validation before unlink at L617).
  - Is the L575-576 reread sufficient? NO — it reads A's own write, so it always matches.
  - Is the L616 reread sufficient? NO — it reads L1 (A's), then B can act before L617.
  - Could the heartbeat fence at L595-601 make this moot? PARTIALLY — it catches the inconsistency and triggers graceful shutdown, but the immediate "winner" of the race still mutates a lease it shouldn't.
  - Is the same-process scenario a real risk? NO (Node single-threaded; ruled out structurally).
- **AlternativeExplanation**:
  - **Possibility A** (most likely): the implementer understood the refresh/clear TOCTOU windows are the SAME class as the ACQUIRE window already documented in §13 item 1, and consciously extended the accepted-risk framing to the refresh/clear paths. The §13 acknowledgement should be tightened to explicitly include all three lease-mutation paths, not just ACQUIRE.
  - **Possibility B** (less likely): the implementer focused on the ACQUIRE path because that's where the original spec language ("fence against TOCTOU race") pointed, and didn't independently reason about refresh/clear. In that case, this iteration's finding surfaces a real gap in the implementer's analysis.
  - Either way, the underlying safety story is intact (bounded damage, heartbeat fence catches inconsistency, SQLite sidecar is the integrity backstop). The fix is documentation-level (extend §13 to cover all three paths) OR code-level (pre-write reread / flock).
- **FinalSeverity**: **P1 (unchanged from prior iterations).**
- **Confidence**: **0.75.** Solid code analysis; 25% uncertainty around empirical race-window probability in production.
- **DowngradeTrigger**: If the implementer (a) extends §13 to explicitly acknowledge the refresh/clear windows as accepted-risk same-class, AND (b) either moves the reread to a pre-write position OR adopts flock on the lease file, P1-001 downgrades to P2 (documentation gap only, no remaining correctness concern). If the implementer only does (a) without (b), P1-001 can downgrade to P2 (acknowledged-but-unmitigated, treated same as ACQUIRE).

## Traceability Checks

- **spec_code**: not re-tested in iter 8 (out of scope; iter 6 stands). REQ-010's "complete-fencing" claim remains bounded by P1-001; the iter-7 adjudication of asymmetric protection (`clearOwnerLeaseFile`'s ownerPid-only second-read is logically sufficient because `acquireOwnerLeaseFile` always changes ownerPid first via O_EXCL-CAS) holds and is REAFFIRMED.
- **checklist_evidence**: not re-tested; iter 6 stands. CHK-074 (REQ-010 complete-fencing) scope remains bounded by P1-001.
- **skill_agent**: notApplicable.
- **agent_cross_runtime**: notApplicable.
- **feature_catalog_code**: notApplicable.
- **playbook_capability**: notApplicable.

## Verdict

**P1-001 STAYS P1.** Final adjudications: scenario (a) and (b) are exploitable in sub-microsecond OS-level windows; damage is bounded to successor-process self-termination; no data corruption; same class as implementer's own §13 item 1 acknowledged risk. Scenario (c) ruled out by Node single-threaded event loop.

The "generation check + reread is not mutation-atomic" framing is **REFUTED for the reread-after-mutation part** (the reread DOES catch most cases — it sees A's own write and matches A's in-memory state, which is internally consistent) and **REAFFIRMED for the mutation-after-validation part** (the write/unlink can still act on a stale read in the sub-microsecond gap).

The most useful framing for the synthesis pass in iter 10: **P1-001 is a documentation-completeness finding (extend §13 to cover all three lease-mutation paths) more than a code-correctness finding.** Whether it stays P1 or downgrades to P2 in iter 10 depends on whether the implementer treats the refresh/clear windows as same-class-accepted-risk OR tightens the fences with a pre-write reread or flock. Either choice is defensible; current state is P1 because the safety story is implicit (per §13 item 1) but not explicit for these two specific paths.

## Next Dimension — Recommendation for §12 Iteration 9

Per the prompt's directive, set §12 NEXT FOCUS for iteration 9:

**Recommended Focus: Iteration 9 — final adversarial sweep.**
Re-run the FULL project regression test suite intersecting the 16 scope files' test coverage, from a fresh read of the actual test output (not the implementer's reported numbers), to confirm the "521 passed, 0 new failures" claim independently. Also do a final check that no BANNED file mutations occurred anywhere in this review session (no `rm`, `mv`, `sed -i`, or out-of-scope writes). This is the last review pass before the synthesis iteration 10; its purpose is to confirm the cumulative state matches the per-iteration narratives and that no review-side regression has been introduced.

Alternative lower-priority focus: review plan.md phase-label cleanup (P2-001 from iter 6) — but P2-001 is documentation-only and lower blast radius than the final adversarial sweep. Defer to iter 9 only if iter 8's recommendation above cannot be completed in budget.

## SCOPE VIOLATIONS

None.
