---
title: "Tasks: Data Canonicalization"
description: "Tasks to freeze writers, classify and hash packets, resolve divergent duplicates, and move legacy-only packets to canonical with quarantine."
trigger_phrases:
  - "data canonicalization tasks"
  - "quarantine tasks"
importance_tier: "important"
contextType: "implementation"
---
# Tasks: Data Canonicalization

<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
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

**Task Format**: `T### [P?] Description (file path)`

<!-- /ANCHOR:notation -->
---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Implement the packet-writer freeze + freeze self-check
- [ ] T002 Wire the phase-001 classifier into a hashed-manifest generator

<!-- /ANCHOR:phase-1 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T003 Generate the hashed manifest over all packets
- [ ] T004 Resolve divergent duplicates with explicit winner decisions
- [ ] T005 Move legacy-only packets to canonical; quarantine originals

<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T006 Prove lossless quarantine restore (byte-exact)
- [ ] T007 Confirm zero divergent same-ID survivors under two roots

<!-- /ANCHOR:phase-3 -->
---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] Freeze active through migration; hashed manifest complete
- [ ] Divergent duplicates explicitly resolved
- [ ] Lossless quarantine restore proven

<!-- /ANCHOR:completion -->
---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Parent Research**: See `../research/research.md`

<!-- /ANCHOR:cross-refs -->
