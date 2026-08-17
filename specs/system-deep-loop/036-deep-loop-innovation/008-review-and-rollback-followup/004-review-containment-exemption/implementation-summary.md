---
title: "Implementation Summary: Review Containment Exemption"
description: "write-containment.ts now exempts runtime/database telemetry and description.json/descriptions.json memory-index metadata from fatal reverts, so contained fan-out reviews survive the runtime's own writes. Landed in commit 1fb79e0106; re-verified pinned tsc exit 0 and vitest 22/22 passed."
trigger_phrases:
  - "review containment exemption implementation summary"
  - "isRegenerableRuntimeState shipped"
  - "1fb79e0106"
importance_tier: "high"
contextType: "implementation"
parent: "system-deep-loop/036-deep-loop-innovation/008-review-and-rollback-followup/004-review-containment-exemption"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/008-review-and-rollback-followup/004-review-containment-exemption"
    last_updated_at: "2026-08-17T04:04:40Z"
    last_updated_by: "markdown-agent"
    recent_action: "Documented commit 1fb79e0106 and re-ran pinned tsc + the touched test file to confirm both pass"
    next_safe_action: "None; packet complete, no follow-up required"
    blockers: []
    key_files:
      - "implementation-summary.md"
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Does the exemption apply to any database/ directory anywhere in the repo? No; it matches only the exact prefix .opencode/skills/system-deep-loop/runtime/database/, proven by a test asserting other/database/graph.sqlite is NOT exempt."
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

> This packet is Complete. The fix landed in commit `1fb79e0106`; the evidence below combines that commit's diff with a fresh pinned-`tsc` and per-file `vitest` re-run captured during this documentation pass.

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 004-review-containment-exemption |
| **Level** | 1 |
| **Status** | Complete |
| **Completion** | 100% |
| **Completed** | 2026-08-13 |
| **Commit** | `1fb79e0106` |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:what-built -->
## What Was Built

Fan-out review lineages no longer fail when the runtime writes its own generated state. `write-containment.ts` now recognizes `.opencode/skills/system-deep-loop/runtime/database/*` telemetry and exact `description.json`/`descriptions.json` memory-index basenames as regenerable runtime state, and exempts exactly those paths from the fatal revert path.

### The exemption predicate (REQ-001)

`isRegenerableRuntimeState` (`write-containment.ts`) matches two path shapes: any path under the `runtime/database/` prefix, and any path whose basename is exactly `description.json` or `descriptions.json` (nested paths included). Everything else, including near-misses like `description.json.bak` or `other/database/graph.sqlite`, is rejected.

### Partition before revert (REQ-002)

`enforceWriteContainment` now splits detected out-of-scope violations into `exempted` (matches the predicate) and `guarded` (everything else) before calling `revertOutOfScopeViolations` with only `guarded`. Exempted paths are left untouched on disk and folded into the returned `advisories` array, so they are visible but never fatal and never reverted.

### Control coverage (REQ-003)

A pre-existing control test confirms a non-exempt out-of-scope source write is still reverted, so the exemption did not widen the containment boundary for real source writes.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/write-containment.ts` | Modified | Added `isRegenerableRuntimeState`; partitioned detected violations into exempted/guarded before revert |
| `.opencode/skills/system-deep-loop/runtime/tests/unit/write-containment.vitest.ts` | Modified | Added boundary and behavioral tests for the exemption |

<!-- /ANCHOR:what-built -->
---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The fix landed as commit `1fb79e0106`. This documentation pass independently re-ran the pinned type-check (`.opencode/skills/system-spec-kit/node_modules/.bin/tsc --noEmit -p .opencode/skills/system-deep-loop/runtime/tsconfig.json`, exit 0) and the touched test file (`npx vitest run tests/unit/write-containment.vitest.ts` from `.opencode/skills/system-deep-loop/runtime`, `Test Files 1 passed (1)`, `Tests 22 passed (22)`).

<!-- /ANCHOR:how-delivered -->
---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Exempt by exact path prefix and exact basename, not a substring match | A loose match (e.g. any path containing "database") could accidentally exempt real source directories elsewhere in the repo; exactness keeps the containment boundary intact for everything else |
| Partition before the revert call rather than filtering the revert's output | Prevents the exempted paths from ever being touched by `revertOutOfScopeViolations`, so there is no window where regenerable state could be reverted and then re-added |

<!-- /ANCHOR:decisions -->
---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| REQ-001 predicate matches only intended paths | PASS, boundary test rejects `other/database/graph.sqlite` and `description.json.bak` |
| REQ-002 exempted paths preserved, never reverted, never fatal | PASS, behavioral test shows empty `violations`, path in `advisories`, empty `revertResult.reverted` |
| REQ-003 non-exempt out-of-scope write still reverted | PASS, per commit message's stated control test |
| REQ-004 pinned `tsc` return code 0 | PASS, re-verified during this documentation pass |
| REQ-004 per-file `vitest` green | PASS, re-verified during this documentation pass: 22/22 passed |

<!-- /ANCHOR:verification -->
---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The exemption is scoped to a fixed path set.** If the runtime starts writing regenerable telemetry or index state to a new location outside `runtime/database/` or the two named basenames, this exemption will not cover it and a follow-up predicate update would be needed.
<!-- /ANCHOR:limitations -->

---

<!--
CORE TEMPLATE (~40 lines)
- Post-implementation documentation
- Created AFTER implementation completes
-->

