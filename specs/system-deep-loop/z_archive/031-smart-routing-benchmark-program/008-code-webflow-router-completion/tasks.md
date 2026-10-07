---
title: "Tasks: Complete code-webflow Inline Router + Fix LANGUAGE_STANDARDS Keywords"
description: "Task breakdown for the code-webflow router completion phase, reconstructed from spec.md. The original tasks.md was never written."
trigger_phrases:
  - "code-webflow router completion tasks"
  - "webflow language keyword fix tasks"
importance_tier: "important"
contextType: "implementation"
---

> Reconstructed on 2026-10-07 from spec.md and git history. It was not written at the time.

# Tasks: Complete code-webflow Inline Router + Fix LANGUAGE_STANDARDS Keywords

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Capture the current `sk-code-router-sync` failure on the webflow side (`childResourceMap('code-webflow')` empty; ~85 parent paths uncovered)
- [ ] T002 Record the 9 css/html/js gold paths WF-013 must route
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T003 Land the code-webflow inline router content (equal to 028 and the working tree) on the target branch (code-webflow `SKILL.md`)
- [ ] T004 Fix `LANGUAGE_STANDARDS` keywords to css/html/js (code-webflow `SKILL.md`)
- [ ] T005 Fix the same keywords in the parent machine block (`smart_routing.md`
      machine projection) and the parent prose reference
- [ ] T006 Co-rewrite the WF-013 scenario prompt to css/html/js (its `expected_resources` stay unchanged)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T007 Run `sk-code-router-sync` — child parses non-empty; parent equals union(children) + tier
- [ ] T008 Run `surface-slice-sync` — no webflow to opencode leak
- [ ] T009 Run `parent-hub-vocab-sync`
- [ ] T010 Run the standalone code-webflow router-replay on WF-013 and confirm it routes the 9 gold paths
- [ ] T011 Confirm no bare `js` token (substring false-match on `commonjs`/`jsonc`)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
