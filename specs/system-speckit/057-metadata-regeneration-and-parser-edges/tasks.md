---
title: "Tasks: metadata-regeneration-and-parser-edges"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "task breakdown"
  - "implementation tasks"
  - "metadata regeneration pass"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: metadata-regeneration-and-parser-edges

<!-- SPECKIT_LEVEL: 2 -->
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

- [x] T001 Census the drift: 114 packets (1 dirty) and 13 track roots; census script kept outside the repository
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T002 Regenerate the 113 clean packets (`generate-description.js`, `backfill-graph-metadata.js`); 122 generated files changed, 0 generator errors
- [x] T003 Add the shared dependency to the deep-loop runtime and install in its root; force-track the manifest the ignore rule had swallowed (`system-deep-loop/runtime/package.json`)
- [x] T004 Create sk-doc's manifest with the shared dependency and install in its root; moved from `scripts/` to the skill root so every script directory resolves it (`sk-doc/package.json`)
- [x] T005 Adopt the shared parser in deep-loop's and sk-doc's JavaScript callers (GLM lane) — `check-contract-drift.cjs`; `frontmatter-version.mjs`, its test, `validate-compiled-routing-scenarios.cjs`, `validate-playbook-topology.cjs`, `root-router-contract.cjs`, `validate-playbook-package.cjs`; the journey-proof test stages the shared package into its scaffold
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T006 Census after: 4 packets remain (1 dirty, 3 declaring children no longer on disk), 13 track roots; sample of six regenerated packets: four PASSED, two failures predate the pass (a missing referenced file; a `parent_id` already `"null"` at HEAD)
- [x] T007 Import probes: the shared parser resolves from the deep-loop runtime in ESM and CommonJS and from sk-doc's scripts
- [x] T008 Adopters' tests and the deep-loop typecheck green after adoption — drift suite 8 of 8; frontmatter-version test 23 of 23; consumer matrix 17; ten sk-create-skill tests exit 0; playbook package contract 8 assertions; typecheck 0 errors
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
