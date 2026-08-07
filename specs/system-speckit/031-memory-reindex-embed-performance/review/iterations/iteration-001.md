# Deep Review Iteration 001

## Dimension

Correctness — inventory pass plus REQ-010 owner-lease fencing review.

## Files Reviewed

### Artifact map

| Scope file | Type | LOC | Requirement mapping | Iteration coverage |
|---|---:|---:|---|---|
| `.opencode/skills/system-spec-kit/mcp-server/handlers/memory-save.ts` | TypeScript handler | 4180 | REQ-006 | Inventoried |
| `.opencode/skills/system-spec-kit/mcp-server/context-server.ts` | TypeScript server | 2587 | REQ-006, REQ-008 | Inventoried |
| `.opencode/skills/system-spec-kit/mcp-server/tests/handler-memory-index.vitest.ts` | Vitest | 1716 | REQ-006 | Inventoried |
| `.opencode/skills/system-spec-kit/mcp-server/tests/context-server.vitest.ts` | Vitest | 3087 | REQ-006, REQ-008 | Inventoried |
| `.opencode/bin/lib/launcher-ipc-bridge.cjs` | Node.js CJS | 512 | REQ-007 | Inventoried; next focus |
| `.opencode/bin/mk-spec-memory-launcher.cjs` | Node.js CJS | 2018 | REQ-007, REQ-010, REQ-011 | Correctness reviewed for REQ-010 lease functions and dead-socket fallback |
| `.opencode/bin/lib/launcher-session-proxy.cjs` | Node.js CJS | 891 | REQ-007 | Inventoried; next focus |
| `.opencode/bin/lib/model-server-supervision.cjs` | Node.js CJS | 1546 | REQ-011 | Inventoried |
| `.opencode/bin/mk-skill-advisor-launcher.cjs` | Node.js CJS | 1483 | REQ-011 | Inventoried |
| `.opencode/skills/system-spec-kit/mcp-server/tools/lifecycle-tools.ts` | TypeScript tool dispatcher | 88 | REQ-009 | Inventoried |
| `.opencode/skills/system-spec-kit/mcp-server/tool-schemas.ts` | TypeScript schema | 1007 | REQ-009 | Inventoried |
| `.opencode/skills/system-spec-kit/mcp-server/tests/launcher-session-proxy.vitest.ts` | Vitest | 779 | REQ-007 | Inventoried; next focus |
| `.opencode/skills/system-spec-kit/mcp-server/tests/launcher-ipc-bridge-probe.vitest.ts` | Vitest | 394 | REQ-007 | Inventoried; next focus |
| `.opencode/skills/system-spec-kit/mcp-server/tests/launcher-spec-memory-lifecycle.vitest.ts` | Vitest | 189 | REQ-010 | Correctness reviewed and executed |
| `.opencode/skills/system-spec-kit/mcp-server/tests/lifecycle-tools-scan-default.vitest.ts` | Vitest | 73 | REQ-009 | Inventoried |
| `.opencode/skills/system-spec-kit/mcp-server/tests/embedders/launcher-model-server-cross-launcher.vitest.ts` | Vitest | 669 | REQ-011 | Inventoried |

Mapping evidence: the canonical affected-surface inventory identifies these production/test roles at `implementation-summary.md:202-210`; requirement contracts are at `spec.md:109-114`. LOC was measured with `wc -l` over the exact 16-file scope (21,219 total).

## Findings by Severity

### P0

None.

### P1

#### P1-001 — LeaseId checks do not fence heartbeat replacement or cleanup against a successor interleaving

- **File:** `.opencode/bin/mk-spec-memory-launcher.cjs:562-578`
- **Secondary evidence:** `.opencode/bin/mk-spec-memory-launcher.cjs:611-618`
- **Spec evidence:** `.opencode/specs/system-speckit/031-memory-reindex-embed-performance/spec.md:113`
- **Checklist conflict:** `.opencode/specs/system-speckit/031-memory-reindex-embed-performance/checklist.md:184-185`
- **Finding class:** algorithmic
- **Claim:** `refreshOwnerLeaseFile()` validates `leaseId` only on its initial read, then performs an unconditional temp-file rename in `writeOwnerLeaseFile()`; a successor can replace the lease between those operations and be overwritten by the stale refresher. `clearOwnerLeaseFile()` likewise reads the matching `leaseId`, then performs a second check that compares only `ownerPid`, allowing a same-PID/fresh-lease interleaving before unlink. This violates REQ-010's explicit requirement that refresh/release/cleanup prevent a stale writer from overwriting a successor.
- **Evidence refs:** `writeOwnerLeaseFile()` atomically replaces the path without compare-and-swap at `.opencode/bin/mk-spec-memory-launcher.cjs:421-435`; refresh's sole pre-write token check is at `:563-568`, followed by replacement at `:570-574`; clear's second read drops `leaseId` at `:614-618`.
- **Counterevidence sought:** inspected caller locking and lifecycle paths (`:1528-1532`, `:1646-1676`, `:1739-1905`) for a lock retained across refresh/clear; none surrounds heartbeat or shutdown cleanup. The SQLite sidecar lock limits data-integrity impact but does not make the owner-lease contract true.
- **Alternative explanation:** the implementer explicitly accepts only the tiny read→unlink residual for stale reclaim (`implementation-summary.md:247`), but the refresh read→write window includes filesystem work and is a different, wider path; REQ-010 expressly includes heartbeat replacement.
- **Final severity:** P1 — confirmed spec mismatch and availability/single-owner coordination risk, not demonstrated destructive data loss.
- **Confidence:** 0.96.
- **Downgrade trigger:** prove an existing cross-process lock is held continuously across every refresh/clear read and mutation, or narrow REQ-010/checklist claims to exclude these paths with accepted evidence.
- **Scope proof:** targeted call-site search found refresh used after spawn and by the heartbeat, and clear used across shutdown/error/bridge paths; no lock wrapper covers those operations.
- **Affected surface hints:** owner-lease heartbeat, shutdown cleanup, re-election handoff.
- **Recommendation:** use a mutation primitive that cannot replace/unlink unless the on-disk generation still matches at mutation time, or serialize refresh/clear under the same cross-process owner-election authority; add deterministic successor-interleaving tests for both refresh and clear.

### P2

None.

## REQ-010 Hypothesis Adjudication

The immediately-before-unlink check at `.opencode/bin/mk-spec-memory-launcher.cjs:535-542` does close the specific JavaScript-level interleaving encoded by the new test: when racer B installs a distinct `leaseId` before A's second read, A returns without unlinking. It does not eliminate the already-documented read→unlink OS race (`implementation-summary.md:247`), and acquisition is not itself continuously protected by the bootstrap/respawn lock in the ordinary startup path (`mk-spec-memory-launcher.cjs:1767` precedes bootstrap acquisition at `:1878`). The more material unfulfilled claim is refresh/clear fencing in P1-001.

The regression test is non-vacuous. Its spy returns stale content on the classification read while installing a fresh distinct lease (`launcher-spec-memory-lifecycle.vitest.ts:136-148`), then requires `acquired:false` and survival of that exact fresh `leaseId` (`:150-160`). Removing/bypassing the `leaseId` mismatch return at launcher `:535-542` would let A unlink B's lease and win the following exclusive create, failing both assertions. Current execution: 8/8 passed.

## Traceability Checks

| Protocol | Status | Evidence |
|---|---|---|
| `spec_code` | partial/passed for REQ-010 | Spec `spec.md:113` compared to launcher `:421-435,512-625,938-947,1767-1878`; one P1 mismatch found. |
| `checklist_evidence` | partial/failed for CHK-074 | CHK-074 claims stale removal and heartbeat replacement are fenced, but refresh/clear remain vulnerable to successor interleavings. |
| `feature_catalog_code` | pending | No feature catalog reviewed in this inventory/correctness pass. |
| `skill_agent` | notApplicable | No skill-authoring change. |
| `agent_cross_runtime` | notApplicable | No agent-definition change. |
| `playbook_capability` | notApplicable | No playbook change. |

## SCOPE VIOLATIONS

None. Reviewed files remained read-only; writes were limited to the four authorized review-state paths.

## Verdict

CONDITIONAL — one P1 correctness/spec-alignment finding. The targeted REQ-010 regression suite passes, and the stale-reclaim test genuinely exercises its claimed interleaving, but heartbeat replacement/cleanup do not satisfy the broader fencing requirement.

## Next Dimension

Continue correctness in iteration 2 with REQ-007 probe collapse: `.opencode/bin/lib/launcher-ipc-bridge.cjs`, `.opencode/bin/lib/launcher-session-proxy.cjs`, the `bridgeStdioThroughSessionProxy` passthrough at `.opencode/bin/mk-spec-memory-launcher.cjs:323-332`, and their two focused test files. Verify warm-owner skip and reattach-path probe preservation independently.

## Verification

- `wc -l <the exact 16 scope files>` — all files counted; 21,219 total LOC.
- `rg -n "acquireOwnerLeaseFile\\(|refreshOwnerLeaseFile\\(|clearOwnerLeaseFile\\(|clearOwnerLeaseFileIfOwner\\(" .opencode/bin/mk-spec-memory-launcher.cjs` — enumerated mutation call sites.
- `read .opencode/bin/mk-spec-memory-launcher.cjs:390-625,872-967,1498-1533,1646-1905` — verified lease operations, fallback, and lock/caller context.
- `read .opencode/skills/system-spec-kit/mcp-server/tests/launcher-spec-memory-lifecycle.vitest.ts:92-162` — verified non-vacuous interleaving and assertions.
- `npx vitest run tests/launcher-spec-memory-lifecycle.vitest.ts` from `.opencode/skills/system-spec-kit/mcp-server` — 1 file passed, 8 tests passed.

Review verdict: CONDITIONAL
