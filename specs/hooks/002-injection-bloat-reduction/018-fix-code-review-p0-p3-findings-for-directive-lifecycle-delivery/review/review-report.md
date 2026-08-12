---
title: "Deep Review Report — Phase 018 Directive-Lifecycle Implementation"
description: "Autonomous iterative review of completed phase 018 directive-lifecycle implementation and packet evidence. 6 iterations, convergence achieved, CONDITIONAL verdict."
version: "1.0"
createdAt: "2026-08-11"
stopReason: converged
totalIterations: 6
verdict: CONDITIONAL
hasAdvisories: true
---

# Deep Review Report — Phase 018 Directive-Lifecycle Implementation

## 1. Executive Summary

| Field | Value |
|-------|-------|
| **Verdict** | **CONDITIONAL** |
| **hasAdvisories** | true (19 active P2) |
| **P0 (Blockers)** | 0 |
| **P1 (Required)** | 2 |
| **P2 (Suggestions)** | 19 |
| **Iterations** | 6 of 7 |
| **Stop Reason** | converged (newFindingsRatio=0.07 < threshold=0.10) |
| **Dimensions Covered** | correctness PASS, security PASS, traceability CONDITIONAL, maintainability CONDITIONAL |
| **Overlay Protocols** | skill_agent PASS, agent_cross_runtime PASS, playbook_capability PASS |
| **Review Scope** | 37 files: canonical TypeScript core, JS mirror, 8 lifecycle adapters, boundary bridge, Python store helper, 3 test files, playbook, benchmark wrapper, 5 discovery symlinks, 9 spec docs, 6 evidence files, supersession manifest |

The implementation is sound. The canonical core correctly implements fail-open logic for transcript high-water marks, lifecycle epochs, store-wide invalidation, and file-store hardening. The Python store helper enforces all NFR-S01 invariants (path containment, ownership, no-follow, regular-file, restrictive modes, size bounds, atomic writes, temp safety). All 8 lifecycle adapters wire to the boundary bridge, and all 4 discovery symlinks are intact. The whole-gate baseline comparison is honest (same manifest hash, zero new blockers).

Two active P1 findings remain: (1) graph-metadata.json has stale status "planned" instead of "in_progress" at 95% — resolution requires canonical `generate-context.js` metadata regeneration; (2) Devin's post-compaction.cjs hardcodes the boundary bridge path instead of importing the shared module — this creates a localized drift risk.

No active P0 findings were discovered. The implementation passes correctness and security reviews with CONDITIONAL traceability and maintainability — ready for P1 remediation then `/speckit:plan`.

## 2. Planning Trigger

`/speckit:plan` is required for the two active P1 findings and recommended P2 advisories.

```json
{
  "triggered": true,
  "verdict": "CONDITIONAL",
  "hasAdvisories": true,
  "activeFindings": {
    "P0": 0,
    "P1": 2,
    "P2": 19
  },
  "remediationWorkstreams": [
    {
      "priority": "P1",
      "id": "P1-001",
      "title": "Regenerate graph-metadata.json via canonical save path",
      "effort": "trivial",
      "owner": "packet owner"
    },
    {
      "priority": "P1",
      "id": "P1-002",
      "title": "Fix Devin post-compaction.cjs to import shared boundary bridge",
      "effort": "small",
      "owner": "Devin adapter owner"
    },
    {
      "priority": "P2",
      "title": "19 P2 advisories — see Active Finding Registry",
      "effort": "small-medium",
      "owner": "packet owner"
    }
  ],
  "specSeed": [
    "Add P1-001 metadata regeneration step to tasks.md",
    "Add P1-002 Devin bridge import fix to tasks.md",
    "Update checklist.md to reflect new P1 items"
  ],
  "planSeed": [
    "Regenerate graph-metadata.json and description.json via generate-context.js",
    "Refactor Devin post-compaction.cjs to use shared boundary bridge module",
    "Address P2 advisories by priority: bundle boundary spawn testing with P1-002 fix"
  ],
  "findingClasses": {
    "correctness": ["boundary-bridge-circuit", "identity-normalization"],
    "security": ["env-exposure", "toctou-race", "symlink-injection", "posix-detection"],
    "traceability": ["metadata-staleness", "checklist-evidence", "cross-packet-import"],
    "maintainability": ["js-mirror-drift", "spawnSync-latency", "test-comment-hygiene", "description-staleness"]
  },
  "affectedSurfacesSeed": [
    "specs/hooks/002-injection-bloat-reduction/018-*/graph-metadata.json",
    "specs/hooks/002-injection-bloat-reduction/018-*/description.json",
    ".opencode/skills/system-spec-kit/mcp-server/hooks/devin/post-compaction.cjs",
    ".opencode/skills/system-skill-advisor/hooks/lib/directive-lifecycle-boundary.ts",
    ".opencode/skills/system-skill-advisor/mcp-server/dist/hooks/claude/directive-lifecycle-boundary.js",
    ".opencode/plugins/mk-skill-advisor.js"
  ],
  "fixCompletenessRequired": false
}
```

## 3. Active Finding Registry

### P1 Findings (Required)

| ID | Title | Dimension | File:Line | Impact | Fix |
|----|-------|-----------|-----------|--------|-----|
| P1-001 | graph-metadata.json derived.status "planned" vs "in_progress" at 95% | traceability | `graph-metadata.json` | Blocks CHK-140/141/142 and `validate.sh --strict`. All other packet docs say "in_progress" at 95%. | Regenerate `description.json` and `graph-metadata.json` through canonical `generate-context.js` save. |
| P1-002 | Devin post-compaction.cjs hardcoded boundary bridge path | maintainability | `devin/post-compaction.cjs:104-129` | If the boundary bridge dist path or name changes, Devin's adapter breaks while all 7 other adapters continue working. Drift risk localized to Devin. | Import `notifyDirectiveLifecycleBoundary` from the shared bridge module instead of duplicating the spawn logic inline. |

### P2 Findings (Suggestions)

| ID | Title | Dimension | File:Line |
|----|-------|-----------|-----------|
| P2-001 | JS mirror duplicates canonical core logic (RR-001) | maintainability | `mk-skill-advisor.js:67,246-292` |
| P2-002 | Epoch-advancement bridge circuit not verified end-to-end | correctness | **RESOLVED** — dist verified intact (iter 2) |
| P2-003 | Synchronous spawnSync with 500ms timeout in hook context (RR-002) | maintainability | `directive-lifecycle-boundary.ts:15,46-54` |
| P2-004 | Boundary bridge spawn path not tested | correctness | `directive-lifecycle.vitest.ts` |
| P2-005 | Checklist CHK-012 evidence chain thin (marked [x] without dist verification) | traceability | `checklist.md` |
| P2-006 | Python dependency for durable store not documented | security | `directive-lifecycle-store.py` |
| P2-007 | `SPECKIT_HOOK_STATE_DIR` exposed in spawned child environment | security | `directive-lifecycle-boundary.ts:48` |
| P2-008 | buildPoison — TOCTOU between directory check and open | security | `directive-lifecycle-store.py:193-206` |
| P2-009 | helperPath symlink not validated before use | security | `directive-lifecycle-store.py:47-50` |
| P2-010 | POSIX detection gap on macOS | security | `directive-lifecycle.ts` |
| P2-011 | CWD-hash partitioning yields single directory under sequential PIDs | security | `directive-lifecycle-store.py:120-137` |
| P2-012 | Adapter parity test file missing from disk | traceability | `user-prompt-submit-adapter-parity.vitest.ts` (not found) |
| P2-013 | graph-metadata.json timestamps predate final implementation state | maintainability | `graph-metadata.json:214,236-237` |
| P2-014 | description.json field is stale pre-implementation problem statement | maintainability | `description.json:4` |
| P2-015 | Implementation summary does not reference deep review | traceability | `implementation-summary.md` |
| P2-016 | Checklist CHK-044 has stale timestamp | traceability | `checklist.md` |
| P2-017 | Test descriptions embed ephemeral CHK-XXX IDs in code comments | maintainability | Test files (vitest.ts) |
| P2-018 | Cross-packet import from phase 007 introduces fragility | traceability | `directive-lifecycle.ts` |
| P2-019 | Checklist CHK-130 checkbox stale despite security review passing | traceability | `checklist.md` |

## 4. Remediation Workstreams

### P1 — Required

1. **Regenerate packet metadata** (P1-001): Run `generate-context.js` to refresh `description.json` and `graph-metadata.json` with correct status "in_progress" at 95%. Closes CHK-140/141/142.

2. **Fix Devin bridge path** (P1-002): Refactor `devin/post-compaction.cjs` to import `notifyDirectiveLifecycleBoundary` from the shared bridge module (`'../claude/directive-lifecycle-boundary.js'`) instead of duplicating the spawn logic with a hardcoded dist path. Bundle with boundary bridge spawn test (P2-004).

### P2 — Advisory

3. **Document Python dependency** (P2-006): Add a note to README or spec that the durable store requires Python 3.8+ on Linux/macOS; confirm no pure-JS fallback exists (by design — fail-open delivery is the fallback).

4. **Fix env exposure** (P2-007): Strip `SPECKIT_HOOK_STATE_DIR` from the spawned child environment.

5. **Document RR-001/RR-002** (P2-001, P2-003): Verify JS mirror drift risk and spawnSync latency are registered in the residual-risk register with owners and reopen criteria.

6. **Resolve remaining P2 traceability items** (P2-005, P2-012, P2-014, P2-015, P2-016, P2-019): Clean up checklist checkboxes, fix stale description, create adapter parity test skeleton, update implementation summary.

7. **Fix test comment hygiene** (P2-017): Replace ephemeral CHK-XXX IDs in test descriptions with durable descriptions.

## 5. Spec Seed

- Add P1-001: Regenerate `description.json` and `graph-metadata.json` through `generate-context.js` to synchronize packet status at 95% "in_progress"
- Add P1-002: Refactor Devin post-compaction.cjs to import shared boundary bridge module
- Document residual risks RR-001 (JS mirror drift), RR-002 (cross-process race monitoring), RR-003 (Cursor dormant event), RR-004 (host receipt gap), RR-005 (pre-existing suite failures) with owners and reopen criteria
- Create adapter parity test skeleton for Codex/Cursor/Devin (`user-prompt-submit-adapter-parity.vitest.ts`)
- Update `implementation-summary.md` to reference completed deep review and verdict

## 6. Plan Seed

| # | Task | File | Priority |
|---|------|------|----------|
| 1 | Regenerate metadata via `generate-context.js` | `graph-metadata.json`, `description.json` | P1 |
| 2 | Refactor Devin bridge to import shared module | `devin/post-compaction.cjs` | P1 |
| 3 | Add boundary bridge spawn test | `directive-lifecycle.vitest.ts` | P2 |
| 4 | Strip `SPECKIT_HOOK_STATE_DIR` from child env | `directive-lifecycle-boundary.ts` | P2 |
| 5 | Document Python dependency | `README.md` or `decision-record.md` | P2 |
| 6 | Fix stale description.json text | `description.json` | P2 |
| 7 | Update implementation-summary to reference review | `implementation-summary.md` | P2 |
| 8 | Clean up CHK-XXX IDs from test descriptions | `*.vitest.ts` | P2 |
| 9 | Create adapter parity test skeleton | `user-prompt-submit-adapter-parity.vitest.ts` | P2 |
| 10 | Verify checklist checkboxes against evidence | `checklist.md` | P2 |

## 7. Traceability Status

### Core Protocols

| Protocol | Status | Evidence |
|----------|--------|----------|
| spec_code | PASS | REQ-P1-001 (high-water mark) verified in `directive-lifecycle.ts:165-173`; REQ-P1-002 (identity rejection) verified in `mk-skill-advisor.js:421-448`; REQ-P1-003 (store hardening) verified in `directive-lifecycle-store.py:339-397`; REQ-P1-004 (discovery symlinks) verified in iteration 4; REQ-P1-008 (phase reconciliation) verified — 017 superseded; REQ-P1-009 (whole-gate) verified — same manifest, zero new blockers |
| checklist_evidence | CONDITIONAL | CHK-012 evidence chain thin (verified in iter 2 but checkbox stale on disk); CHK-044 stale timestamp; CHK-130 stale checkbox; CHK-140/141/142 blocked by P1-001; CHK-124 (rollback) verified; remaining items reviewed in iter 6 |
| AC_COVERAGE | exempt | `resource-map.md` not present in spec folder |

### Overlay Protocols

| Protocol | Status | Evidence |
|----------|--------|----------|
| skill_agent | PASS | `@deep-review` agent definition at `.opencode/agents/deep-review.md` complete; agent references align with implementation |
| agent_cross_runtime | PASS | Claude/Codex/Cursor/Devin discovery symlinks all point to expected dist targets; adapter paths consistent across runtimes |
| feature_catalog_code | notApplicable | No feature catalog entries reference phase 018 implementation |
| playbook_capability | PASS | `directive-lifecycle-dedup.md` playbook uses evidence-class annotations; Cursor native delivery marked UNCONFIRMED/dormant; scenario 457 evidence classified correctly |

## 8. Deferred Items

- Adapter parity test file (`user-prompt-submit-adapter-parity.vitest.ts`) was listed as "Create" in spec but not found on disk. Skeleton file creation deferred to remediation.
- Python store helper TOCTOU edge case (P2-008): Requires `openat2` with `RESOLVE_NO_SYMLINKS` (Linux-specific) or platform-specific hardening — deferred as platform-specific defense-in-depth.
- CWD-hash partitioning under sequential PIDs (P2-010): Known edge case with no known exploit path; deferred with monitoring.

## Dimension Expansion Map

| Metric | Value |
|--------|-------|
| Completed pivots | 0 |
| Failed pivots | 0 |
| Audited overrides | 0 |
| Swept | none (no divergent pivot needed) |
| Pivot lineage | none |
| Remaining frontier | none recorded |

No divergent pivot was triggered — convergence was achieved naturally through the default convergence path.

## 9. Search Ledger

*No search-depth state captured (legacy v1 record)*.

| Metric | Value |
|--------|-------|
| graphCoverageMode | none |
| searchDebt | 0 |
| candidateCoverage | empty |
| ruledOutCandidates | 0 |
| cleanSearchProof | 0 |

## 10. Audit Appendix

### Convergence Summary

| # | Dimension | NewFindingsRatio | P0/P1/P2 (new) | Verdict |
|---|-----------|------------------|----------------|---------|
| 1 | correctness (inventory) | 1.00 | 0/0/3 | complete |
| 2 | correctness (deep verify) | 0.75 | 0/1/4 | complete |
| 3 | security (store hardening) | 0.33 | 0/0/5 | complete |
| 4 | traceability | 0.32 | 0/1/3 | complete |
| 5 | maintainability | 0.13 | 0/0/2 | complete |
| 6 | overlay + closeout | 0.07 | 0/0/2 | complete |

**Trend:** 1.00 → 0.75 → 0.33 → 0.32 → 0.13 → 0.07 — clear downward convergence.

### Coverage Summary

| Coverage | Status |
|----------|--------|
| correctness | PASS — fail-open core verified; epoch circuit proven; all 8 adapters wired |
| security | PASS — Python store enforces all NFR-S01 invariants; 13 edge cases classified |
| traceability | CONDITIONAL — 2 active P1 items block final checkmark satisfaction |
| maintainability | CONDITIONAL — JS mirror drift, spawnSync latency, test comment hygiene |
| skill_agent | PASS |
| agent_cross_runtime | PASS |
| playbook_capability | PASS |

### Sources Reviewed

37 files across 6 iterations. Full file inventory available in `deep-review-strategy.md` §15.
