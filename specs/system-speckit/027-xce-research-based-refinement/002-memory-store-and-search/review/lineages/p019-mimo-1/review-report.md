# Review Report: maintenance-grace daemon survives re-election

**Spec folder**: `019-maintenance-grace-daemon-survives-reelection`
**Verdict**: CONDITIONAL
**hasAdvisories**: true
**Stop reason**: maxIterations (1) reached
**Iterations**: 1
**Dimension coverage**: 1/4 (Correctness only)
**Severity counts**: P0: 0 | P1: 1 | P2: 3
**Release readiness state**: in-progress
**Session**: fanout-p019-mimo-1-1781719527072-mk6no9

---

## 1. Executive Summary

The maintenance-active marker system that prevents the launcher from reaping a daemon mid-scan was reviewed for correctness. The core mechanism is sound: reference-counted marker lifecycle with atomic writes, a pure injectable supervision predicate, guard at both reap paths, and fail-safe toward reaping on stale/mismatched markers. Test coverage is comprehensive (7 predicate cases, 5 reader cases, 5 isolated-harness integration tests including stale-marker negative control).

No P0 correctness issues were found. One P1 spec-code alignment issue remains: the spec defines the marker shape as `{ childPid, activeUntilMs, jobId, refreshedAtIso }` but the implementation writes `{ childPid, activeUntilMs, labels, refreshedAtIso }`. Three P2 advisories cover the TTL drift (spec says 60s, code uses 180s), wrong file paths in spec.md, and a minor defensive-logging gap.

The CONDITIONAL verdict requires updating the spec to match the shipped implementation before this phase can claim PASS.

---

## 2. Planning Trigger

The CONDITIONAL verdict routes to planning for spec updates. The P1 finding is a spec-code alignment issue that requires updating `spec.md` to document the `labels` field instead of `jobId`, the 180s TTL, and the correct file paths. No code changes are needed — only spec documentation updates.

**Next command**: `/speckit:plan` to create a spec-update plan, or directly update `spec.md` with the correct marker shape, TTL, and paths.

---

## 3. Active Finding Registry

### F001 [P1] Spec-code marker shape mismatch: `jobId` vs `labels`

- **Category**: spec-alignment
- **Evidence**: `mcp_server/lib/storage/maintenance-marker.ts:44-50`, `spec.md:103`
- **Claim**: Spec defines marker as `{ childPid, activeUntilMs, jobId, refreshedAtIso }` but code writes `{ childPid, activeUntilMs, labels, refreshedAtIso }`. The `labels` array is the correct reference-counted design (supports overlapping scan + embedding sources) and is not documented in the spec.
- **Final severity**: P1
- **Confidence**: 0.90
- **Downgrade trigger**: Update spec.md to document `labels` instead of `jobId`

### F002 [P2] Spec says 60s TTL, code uses 180s

- **Category**: spec-alignment
- **Evidence**: `spec.md:103`, `mcp_server/lib/storage/maintenance-marker.ts:25`, `implementation-summary.md:56`
- **Claim**: TTL was deliberately raised from 60s to 180s after a live failure during a ~79s blocking tail phase. Implementation summary documents this; spec.md does not.

### F003 [P2] File paths in spec.md are wrong

- **Category**: spec-alignment
- **Evidence**: `spec.md:117-119` vs actual paths at `.opencode/bin/`
- **Claim**: Spec lists `mcp_server/bin/lib/model-server-supervision.cjs` and `mcp_server/bin/mk-spec-memory-launcher.cjs` but actual paths are `.opencode/bin/lib/model-server-supervision.cjs` and `.opencode/bin/mk-spec-memory-launcher.cjs`.

### F004 [P2] Silent clamping in marker `end()` without defensive logging

- **Category**: correctness
- **Evidence**: `mcp_server/lib/storage/maintenance-marker.ts:75`
- **Claim**: `Math.max(0, activeCount - 1)` silently clamps without logging if `end()` is called more times than `beginMaintenance()`. Harmless but a debug log would help catch double-end bugs.

---

## 4. Remediation Workstreams

| Workstream | Findings | Effort |
|------------|----------|--------|
| Update spec marker shape | F001 | Low — update `spec.md` to document `labels` instead of `jobId` |
| Update spec TTL | F002 | Low — change "60s TTL" to "180s TTL" in `spec.md` |
| Fix spec file paths | F003 | Low — correct paths in `spec.md` Files to Change table |
| Add defensive logging | F004 | Low — optional, add a `console.warn` in `end()` for unexpected clamping |

---

## 5. Spec Seed

Update `spec.md` section 3 (Scope / marker shape) to:
- Replace `jobId` with `labels` (array of active maintenance source labels)
- Replace "60s TTL" with "180s TTL" (and add a note explaining the rationale)
- Correct file paths from `mcp_server/bin/` to `.opencode/bin/`

---

## 6. Plan Seed

1. Edit `spec.md:103`: change marker shape from `{ childPid, activeUntilMs, jobId, refreshedAtIso }` to `{ childPid, activeUntilMs, labels, refreshedAtIso }`
2. Edit `spec.md:103`: change "60s TTL" to "180s TTL" with rationale note
3. Edit `spec.md:117-119`: correct the file paths in the Files to Change table
4. Optionally add a debug log in `maintenance-marker.ts:75` for unexpected clamping
5. Run `validate.sh` on the spec folder to confirm clean state

---

## 7. Traceability Status

### Core Protocols

| Protocol | Status | Gate | Details |
|----------|--------|------|---------|
| `spec_code` | partial | hard | 3 claims match, 2 mismatch (marker shape, TTL, paths) |
| `checklist_evidence` | skipped | hard | No `checklist.md` exists (Level 1 spec) |

### Overlay Protocols

None applicable for spec-folder target at Level 1.

---

## 8. Deferred Items

- **F004**: Defensive logging in `end()` is advisory-only and can be added in a follow-up if desired.
- **Background-embedding queue coverage**: The implementation summary notes the marker protects the scan but not the post-scan background-embedding burst. Extending the marker to cover the embedding queue is an open follow-on (documented in `implementation-summary.md:104`).
- **Identifying the blocking tail phase**: The implementation summary notes the exact phase blocking the event loop was not pinned down on the live daemon. This is a deploy-time investigation item, not a code review finding.

---

## 9. Audit Appendix

### Convergence Evidence

- **Iterations completed**: 1/1 (maxIterations reached)
- **Convergence math**: Not applicable — loop terminated due to maxIterations, not convergence signal
- **Dimension coverage**: 1/4 (Correctness reviewed; Security, Traceability, Maintainability not reached due to maxIterations)
- **newFindingsRatio**: 0.40 (4 findings / 10 total items reviewed)

### Replay Validation

- **JSONL records**: 1 config + 1 iteration = 2 records
- **Iteration file**: `iterations/iteration-001.md` exists, non-empty, ends with canonical `Review verdict: CONDITIONAL` line
- **Findings registry**: 4 open findings (0 P0, 1 P1, 3 P2), consistent with JSONL

### Coverage

| Item | Status |
|------|--------|
| Config validity | PASS |
| Strategy initialization | PASS |
| State consistency | PASS |
| Iteration completeness | PASS |
| Severity coverage | PASS (all findings have severity, category, evidence, content_hash) |
| Adversarial replay | PASS (P1 F001 survived adversarial self-check) |
| Coverage threshold | NOT MET (1/4 dimensions, maxIterations reached before full coverage) |

### Test Coverage Assessment

The test suite is comprehensive for the reviewed scope:
- **Unit test** (7 cases): fresh marker adopt, expired marker reap, childPid mismatch reap, dead child reap, unknown-eperm reap, no-marker reap, invalid childPid reap
- **Reader test** (5 cases): valid marker, missing file, corrupt JSON, missing childPid, non-finite activeUntilMs
- **Isolated harness** (5 cases): flag ON release+secondary adopt, fresh session adopt released daemon, wedged daemon not adopted, fresh marker ADOPTS despite non-responsive probe, stale marker does NOT block reaping

All test cases align with the fail-safe-toward-reaping design principle.
