# Deep Review Report — Memory Reindex and Embed Performance Hardening

## 1. Executive Summary

**Verdict: CONDITIONAL**  
**Release readiness:** `converged`  
**hasAdvisories:** `true`

The implementation is behaviorally solid and independently verified, but project convention does not permit PASS while an active P1 remains. The registry contains no P0, one bounded P1 (`P1-001`, confidence 0.75), and three P2 advisories. CONDITIONAL is therefore the correct verdict: FAIL would overstate a low-probability, self-healing lease-file race that has no demonstrated data-integrity impact, while PASS would ignore the active P1 gate.

The condition is explicit remediation or formal accepted-risk documentation for `P1-001`. The P2 items are non-blocking documentation and maintainability follow-ups.

## 2. Scope Reviewed

The review covered **REQ-006 through REQ-011** and both implemented sub-scopes:

1. **Data-integrity fix:** scan-origin write-back gating in `memory-save.ts` and startup-scan/file-watcher provenance handling in `context-server.ts`.
2. **Daemon/startup/MCP hardening:** redundant-probe collapse, async-ingest origin correction, background-scan defaulting, owner-lease `leaseId` fencing, and canonical model-socket fallback behavior.

The 16-file review target was:

1. `.opencode/skills/system-spec-kit/mcp-server/handlers/memory-save.ts`
2. `.opencode/skills/system-spec-kit/mcp-server/context-server.ts`
3. `.opencode/skills/system-spec-kit/mcp-server/tests/handler-memory-index.vitest.ts`
4. `.opencode/skills/system-spec-kit/mcp-server/tests/context-server.vitest.ts`
5. `.opencode/bin/lib/launcher-ipc-bridge.cjs`
6. `.opencode/bin/mk-spec-memory-launcher.cjs`
7. `.opencode/bin/lib/launcher-session-proxy.cjs`
8. `.opencode/bin/lib/model-server-supervision.cjs`
9. `.opencode/bin/mk-skill-advisor-launcher.cjs`
10. `.opencode/skills/system-spec-kit/mcp-server/tools/lifecycle-tools.ts`
11. `.opencode/skills/system-spec-kit/mcp-server/tool-schemas.ts`
12. `.opencode/skills/system-spec-kit/mcp-server/tests/launcher-session-proxy.vitest.ts`
13. `.opencode/skills/system-spec-kit/mcp-server/tests/launcher-ipc-bridge-probe.vitest.ts`
14. `.opencode/skills/system-spec-kit/mcp-server/tests/launcher-spec-memory-lifecycle.vitest.ts`
15. `.opencode/skills/system-spec-kit/mcp-server/tests/lifecycle-tools-scan-default.vitest.ts`
16. `.opencode/skills/system-spec-kit/mcp-server/tests/embedders/launcher-model-server-cross-launcher.vitest.ts`

The packet's original performance-measurement objective, **REQ-001 through REQ-005**, was explicitly out of scope and remains a separate, not-yet-started workstream.

## 3. Findings Summary Table

| ID | Severity | Description | Evidence |
|---|---|---|---|
| P1-001 | P1 | Refresh and clear validate lease generation but do not atomically bind the subsequent write/unlink to that generation. | `.opencode/bin/mk-spec-memory-launcher.cjs:562-579,611-638` |
| P2-001 | P2 | Continuity frontmatter uses contradictory phase labels. | `.opencode/specs/system-speckit/031-memory-reindex-embed-performance/plan.md:15-17` |
| P2-002 | P2 | FIX ADDENDUM verification cells are not uniformly re-runnable. | `.opencode/specs/system-speckit/031-memory-reindex-embed-performance/plan.md:222-240` |
| P2-003 | P2 | Clear-path lease-fencing invariant and asymmetric protection lack an anchor explanation. | `.opencode/bin/mk-spec-memory-launcher.cjs:611-638` |

## 4. Dimension-by-Dimension Results

| Dimension | Result | Assessment |
|---|---|---|
| Correctness | **PASS — 1 reaffirmed P1** | REQ-006 through REQ-011 behavior passed focused review and regression verification. P1-001 remains a bounded lease-file mutation-atomicity/documentation-completeness concern rather than a demonstrated data-integrity failure. |
| Security | **PASS** | No injection, credential exposure, unsafe spawn, authority-confusion, or path-traversal finding survived review. `crypto.randomUUID()` is appropriate for lease identity. |
| Traceability | **PASS WITH ADVISORIES** | Spec/code and checklist evidence align for the implemented REQs, subject to P1-001's bounded framing. P2-001 and P2-002 remain documentation advisories. |
| Maintainability | **PASS WITH ADVISORIES** | Implementation patterns are coherent; P2-003 requests a durable invariant explanation at the clear paths. |

All four configured dimensions and both core cross-reference protocols (`spec_code`, `checklist_evidence`) received coverage. No scope violation was recorded across the ten iterations.

## 5. Independent Verification

Iteration 9 independently re-ran the 17-file Vitest selection intersecting the reviewed surfaces and observed:

- **521 passed**
- **0 failed**
- **36 skipped**
- **16 test files passed, 1 skipped**

It also independently ran `npm run build`. The three prepare-build entries completed, `tsc --build` completed without errors, and finalization completed cleanly.

These results were **independently reproduced by the reviewer** in the review worktree. They were not merely copied from or accepted on the implementer's assertion.

## 6. P1-001 Full Adjudication Record

### Claim

`refreshOwnerLeaseFile` and `clearOwnerLeaseFile` / `clearOwnerLeaseFileIfOwner` validate a lease generation (`leaseId`, `ownerPid`) before mutation but do not atomically bind the later replacement or unlink to that generation. A stale process can mutate a successor lease during the sub-microsecond filesystem window between validation and mutation.

### Evidence

- Refresh reads and validates at `.opencode/bin/mk-spec-memory-launcher.cjs:563-568`, writes at `:570`, then rereads its own write at `:575-576`. The exploitable window is validation-to-write.
- Clear reads, validates, rereads, then unlinks at `.opencode/bin/mk-spec-memory-launcher.cjs:614-617`. The exploitable window is second-read-to-unlink.
- `clearOwnerLeaseFileIfOwner` has the same class of window at `.opencode/bin/mk-spec-memory-launcher.cjs:631-633`, using an ownerPid-only fence.
- The existing regression test exercises the acquire/reclaim path, not refresh or clear: `.opencode/skills/system-spec-kit/mcp-server/tests/launcher-spec-memory-lifecycle.vitest.ts:114-161`.

### Counterevidence Sought

- **Pre-write reread:** absent for refresh; the check at line 568 is the last validation before line 570 writes.
- **Post-write reread sufficiency:** insufficient for this race because lines 575-576 read the stale writer's own replacement and therefore match its in-memory generation.
- **Clear second-read sufficiency:** incomplete because a successor can replace the lease after line 616 and before line 617.
- **Heartbeat mitigation:** meaningful but partial. Lines 595-601 detect successor inconsistency and trigger graceful shutdown, bounding damage but not preventing the stale mutation.
- **Same-process race:** structurally ruled out because these functions are synchronous and Node executes the relevant JavaScript on one event-loop thread.

### Alternative Explanation

The most likely explanation is that the implementer understood refresh and clear as the same accepted TOCTOU class already documented for acquire/reclaim, but §13 framed that acceptance too narrowly. A less likely explanation is that analysis concentrated only on the requirement's acquire/reclaim wording and did not separately enumerate refresh and clear.

Under either explanation, the safety story remains intact: the race is extremely narrow, the heartbeat fence detects lease inconsistency, damage is bounded to successor-process termination/recovery rather than data corruption, and the SQLite sidecar remains the integrity backstop. The immediate gap is therefore primarily documentation completeness, while pre-write generation revalidation or file locking would provide stronger code-level closure.

### Confidence

**0.75.** Code-path and interleaving analysis is strong; uncertainty concerns real-world incidence of the sub-microsecond cross-process window.

### Final Severity

**P1, reaffirmed.** It is not P0 because no data corruption or unrecoverable split-brain was demonstrated. It is not yet P2 because the accepted-risk framing does not explicitly cover refresh and clear.

### Downgrade Trigger

Extend §13 to explicitly classify refresh and clear as the same accepted-risk class as acquire/reclaim. That documentation-only action is sufficient to downgrade P1-001 to P2 as acknowledged-but-unmitigated. For stronger closure, additionally move validation immediately before mutation where practical or adopt an OS-level file lock.

## 7. Recommended Next Steps

Use `/speckit:plan` to create a low-effort documentation-extension follow-up covering:

1. **P1-001:** extend §13's acceptance framing to explicitly include refresh and both clear paths, including the narrow race window, bounded damage, heartbeat recovery, and SQLite integrity backstop.
2. **P2-001:** reconcile the contradictory continuity phase labels in `plan.md:15-17`.
3. **P2-002:** make every FIX ADDENDUM verification cell concrete and re-runnable in `plan.md:222-240`.
4. **P2-003:** add a durable invariant explanation for the clear-path generation/owner checks and their intentional asymmetry at `mk-spec-memory-launcher.cjs:611-638`.

If the merge policy requires code-level rather than documentation-level closure, include a focused lease-fencing workstream for pre-mutation generation validation or file locking plus adversarial refresh/clear tests.

Do not fold REQ-001 through REQ-005 into this remediation. The original performance-measurement objective remains a separate, not-yet-started workstream.

## 8. Reviewer's Overall Assessment

This implementation is genuinely solid. The data-integrity provenance gating, MCP default boundary, daemon probe behavior, model-socket fallback, tests, and build all held up under independent review. There are no residual security or data-corruption concerns beyond the four recorded findings.

The only merge-relevant concern is P1-001. It is real as an interleaving argument, but bounded, low-probability, self-healing, and primarily under-documented rather than evidence of an unsafe persistence path. A human should know that merging as-is accepts a tiny possibility of avoidable successor-process restart during a precisely timed cross-process lease race. Extending the accepted-risk record before merge is the proportionate minimum; stronger locking is optional hardening, not evidence that the current implementation is broadly unsound.
