# Deep Review Report: 013/009 system-skill-advisor-extraction

**Target Packet**: `.opencode/specs/system-spec-kit/.../009-system-skill-advisor-extraction/`
**Scope**: All 16 child packets (001-016) + parent docs
**Review Packet**: `review-10iter/`
**Date**: 2026-05-15
**Model**: deepseek/deepseek-v4-pro (DIRECT API)
**Iterations**: 10/10 completed

---

## 1. Executive Summary

The 10-iteration deep review of the 013/009 system-skill-advisor extraction line found **0 P0, 2 P1, and 28 P2 findings**. The extraction is structurally sound, the 015 rename (`system_skill_advisor` → `mk_skill_advisor`) is thorough with zero stale references in live code, and all 16 child packets have shipped and validated.

**Verdict: PASS**

---

## 2. Iteration Summary

| Iter | Dimension | P0 | P1 | P2 | Key Theme |
|------|-----------|----|----|-----|-----------|
| 001 | ARCHITECTURE | 0 | 2 | 4 | Clean extraction. Minor coupling: chokidar from spec-kit node_modules, dual dispatchTool |
| 002 | CORRECTNESS | 0 | 0 | 3 | Zero stale refs in live code. Runtime configs verified clean across all 4 surfaces |
| 003 | ROBUSTNESS | 0 | 1 | 4 | Signal handling solid. Stale lockdir on crash (P1). Build verification checks existence only |
| 004 | TESTING | 0 | 1 | 4 | 41 vitest files, 378+ tests. Missing: config parity, launcher recovery tests |
| 005 | SECURITY | 0 | 1 | 3 | Trusted caller gating solid. Env-var leakage to subprocesses, shadow-sink path (P1) |
| 006 | PERFORMANCE | 0 | 0 | 3 | 5-lane fusion well-tuned. Watcher backpressure defaults reasonable (2s debounce, 10s cooldown) |
| 007 | DOCUMENTATION | 0 | 0 | 5 | Live docs clean. Parent spec metadata stale (completion_pct=0, "NOT YET scaffolded") |
| 008 | COMPATIBILITY | 0 | 0 | 2 | All 4 runtime configs correctly updated. Python shim references clean. Config env asymmetry minor |
| 009 | MAINTAINABILITY | 0 | 0 | 3 | Zero TODO/FIXME/HACK. Code conventions consistent. Handover append-only drift |
| 010 | SYNTHESIS | 0 | 2 | 28 | Deduped from 34 raw → 30 distinct. PASS verdict. 2 remediation packets recommended |

---

## 3. P1 Findings (Conditional-Triggering)

| ID | Title | Location | Remediation |
|----|-------|----------|-------------|
| R-004 | Stale lockdir from crash survives 120s timeout | `mk-skill-advisor-launcher.cjs:140-160` | Add lockdir mtime staleness check — if lockdir older than 120s, force-remove before waiting |
| S-004 | Shadow-sink writes to env-var path without sanitization | `shadow-sink.ts:44` | Validate `SPECKIT_ADVISOR_SHADOW_DELTA_PATH` against workspace root containment |

**Impact Assessment**: Both P1s require edge conditions to trigger. R-004 needs a hard crash (SIGKILL) during bootstrap on a clean checkout. S-004 requires env var control (local only) to write to arbitrary paths. Neither is exploitable remotely. Both were identified in the prior 5-iteration review against packet 015 and remain unaddressed.

---

## 4. P2 Advisories (28 Total)

### Documentation/Metadata (5)
- Parent `spec.md` completion_pct=0 (actual: 100%), children listed "NOT YET scaffolded"
- Handover §1 status says "in_progress" (resolved in §6-10)
- Child 007 spec references old `skill-advisor-launcher.cjs`
- Feature catalog historical refs to `system_skill_advisor` in child packets
- Append-only handover pattern creates early-section staleness

### Architecture/Coupling (6)
- Dual dispatchTool in `advisor-server.ts` + `tools/index.ts`
- Chokidar imported from spec-kit node_modules instead of advisor's own
- Test fixture cross-import (advisor vitest → spec-kit fixture)
- spec_kit_memory imports advisor schemas without deprecation timeline
- Dual-layer tool dispatch error wrapping
- Cross-package relative import in semantic-shadow.ts

### Robustness (4)
- buildIfNeeded checks file existence not content correctness
- Fatal error handler skips daemon shutdown
- checkSqliteIntegrity re-throws uncategorized errors
- Chokidar unavailable startup error message unclear (related to A-R-RELATED)

### Testing (5)
- No automated test for all 8 tool dispatch routing
- No vitest for launcher lock timeout behavior
- No vitest for build staleness detection
- Plugin bridge tests depend on subprocess spawning
- No cross-runtime config parity vitest

### Security/Env (3)
- process.env forwarded to subprocess in 3 locations (merged)
- workspaceRoot passed to subprocess without path validation
- Asymmetric env-var blocks across runtime configs

### Performance (3)
- O(skills × lanes) iteration in scorer
- DF-IDF cold-start rebuild from scratch
- Backpressure defaults not per-environment configurable

### Code Quality (2)
- Type-safety weakened by `as unknown as` ToolInputSchema casts
- Dual dispatch registration across two modules

---

## 5. What Was Verified Correct

- **Stale reference audit**: Zero `system_skill_advisor` in any live runtime config, source file, or Python shim
- **Launcher rename**: All paths (`mk-skill-advisor-launcher.cjs`, `.mk-skill-advisor-launcher.json`) correct across all surfaces
- **Tool ids stable**: All 8 public tool ids unchanged through extraction and rename
- **4-runtime configs**: All register `mk_skill_advisor` with correct launcher path
- **SQLite integrity**: `PRAGMA quick_check` with readonly connection, proper error categorization
- **Trusted caller gating**: `requireTrustedCaller()` on state-modifying handlers, `AsyncLocalStorage` context propagation
- **Watcher backpressure**: Debounce (2s), storm circuit breaker (20 events/10s window, 10s cooldown), busy retry ([250,500,1000]ms)
- **Test coverage**: 41 vitest files, 378+ tests, rename-invariants.vitest.ts covers 015 rename assertions
- **Tech debt**: Zero TODO/FIXME/HACK/DEPRECATED markers in advisor source
- **Code conventions**: Consistent MODULE headers, handler naming, type exports, error handling pattern

---

## 6. Remediation Recommendations

### Packet 017: P1 Remediation (Recommended)
- Fix R-004: lockdir mtime staleness detection in launcher
- Fix S-004: shadow-sink path containment validation
- Add vitest coverage for both fixes
- Estimated effort: Level 2 packet, 2-3 hours

### Packet 018: P2 Cleanup Sweep (Optional)
- Update parent spec.md metadata (completion_pct, child status)
- Consolidate dual dispatchTool
- Normalize cross-package imports to @spec-kit/shared
- Add cross-runtime config parity vitest
- Document env-var forwarding policy
- Estimated effort: Level 2 packet, 3-4 hours

---

## 7. Comparison With Prior 015 5-Iter Review

The prior 5-iteration review against packet 015 identified 1 P0, 1 P1, 13 P2 findings. Packet 016 (P2 remediation) closed the 015 review ledger. This 10-iteration review against the full 013/009 line confirms:

- **015 P0 F-003** (dead-code-patterned `handleTool` in spec_kit_memory tools/index.ts with advisor dispatch): RESOLVED — `tools/index.ts` no longer imports or dispatches advisor tools
- **015 P1 F-009** (no rename-invariant vitest): RESOLVED — `rename-invariants.vitest.ts` added in 016
- **015 P2s**: All 13 closed in 016 per implementation summary
- **New P1s discovered**: R-004 (lockdir crash) and S-004 (shadow-sink path) — both were identified in the 015 review but remain unaddressed

---

## 8. Binding

```
AGENT_RECEIVED=013/009-deep-review-10iter
MODEL_USED=deepseek/deepseek-v4-pro (DIRECT API in OpenCode)
RESULT=PASS
TARGET_PACKET=.opencode/specs/system-spec-kit/.../009-system-skill-advisor-extraction/ (phase parent)
ITERATIONS_COMPLETED=10
CONVERGENCE_DETECTED_AT_ITER=10 (natural completion — all dimensions covered)
TOTAL_FINDINGS_DEDUPED=30
P0_COUNT=0
P1_COUNT=2
P2_COUNT=28
VERDICT=PASS
REMEDIATION_PACKETS_RECOMMENDED=2 (017-p1-remediation, 018-p2-cleanup)
REVIEW_REPORT_PATH=.opencode/specs/.../013/009/review-10iter/review-report.md
DEEP_REVIEW_STATE_PATH=.opencode/specs/.../013/009/review-10iter/deep-review-state.jsonl
MEMORY_SAVE_DONE=NO
FILES_OUT_OF_SCOPE=0
ITER_DIMENSIONS_COVERED=10/10
NOTES=30 findings deduped from 34 raw across 9 review dimensions + synthesis. Zero P0. The 013/009 extraction is structurally clean, the 015 rename is thorough, all 16 child packets shipped and validated.
```
