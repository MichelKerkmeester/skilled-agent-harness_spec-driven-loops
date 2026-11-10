---
title: "Tasks: Check whether the v4.0.1.0 release means AGENTS.md or the repo rules need updating"
description: "Research the rules against v4.0.1.0, apply the approved Gate 2 edit and regenerate the doctor manifest, each with the command that verified it."
trigger_phrases:
  - "v4 0 1 0 rules refresh tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Check whether the v4.0.1.0 release means AGENTS.md or the repo rules need updating

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`

`D` is `.skilled/commands/doctor/scripts`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Run five research iterations over the rules and the v4.0.1.0 release (`research/`). Verify: `research/research.md` holds the ranked findings F1 to F4.
- [x] T002 Capture the check baseline. Verify: `node D/agents-md-check.cjs` printed `STATUS=OK rows=12 findings=0` and A6 read 16368 of 16384 bytes.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Replace "Routing means loading what the router resolves" with "Routing means loading what its ROUTER.md resolves" (`AGENTS.md:70`). Verify: `git diff --stat AGENTS.md` shows one line changed.
- [x] T004 Regenerate the manifest's `derived` key (`.skilled/commands/doctor/assets/agents-md-manifest.json`). Verify: `node D/agents-md-manifest.cjs --write` printed `WROTE: 44 sections, 30 pins, 13 history bodies`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T005 Confirm the check read the edit before the regeneration. Verify: `node D/agents-md-check.cjs` printed A4, A9 and A12 as `FINDING`.
- [x] T006 Confirm the manifest matches. Verify: `node D/agents-md-manifest.cjs --check` prints `PASS: 44 sections, 30 pins, derived matches AGENTS.md`.
- [x] T007 Confirm the full check. Verify: `node D/agents-md-check.cjs` prints `STATUS=OK rows=12 findings=0`, A6 reads 16371 of 16384 bytes and A10 reads 6 of 6 copies.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Research**: See `research/research.md`, finding F1
<!-- /ANCHOR:cross-refs -->

---
