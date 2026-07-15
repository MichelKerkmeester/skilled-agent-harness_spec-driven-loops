---
title: "Tasks: sk-prompt subtree rollup gate (017 phase 004.007)"
description: "Tasks for phase 007 of the sk-prompt kebab-case program: aggregate sibling evidence, reconcile path classifications, run the final census, and publish a pass/block gate without new migration work."
trigger_phrases:
  - "sk-prompt rollup gate tasks"
  - "sk-prompt final naming census"
  - "sk-prompt phase 007 tasks"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/019-hyphen-naming-convention/008-component-migration/004-sk-prompt/007-skill-gate"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-hyphen-naming-convention/008-component-migration/004-sk-prompt/007-skill-gate"
    last_updated_at: "2026-07-14T18:04:33Z"
    last_updated_by: "codex"
    recent_action: "Authored the final subtree gate task map"
    next_safe_action: "Collect sibling verdicts and enumerate the complete sk-prompt surface"
    blockers: []
    key_files:
      - ".opencode/specs/sk-doc/019-hyphen-naming-convention/008-component-migration/004-sk-prompt/"
      - ".opencode/skills/sk-prompt/"
      - ".opencode/skills/sk-prompt/prompt-improve/"
      - ".opencode/skills/sk-prompt/prompt-models/"
    completion_pct: 0
    open_questions: []
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

# Tasks: sk-prompt subtree rollup gate

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

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Pin final candidate and BASE SHAs and collect phases 001–006 checklist verdicts (`004-sk-prompt/001-*` through `006-*`)
- [ ] T002 [P] Collect sibling path maps, hashes, and release-evidence handoffs (`004-sk-prompt/001-*` through `006-*`)
- [ ] T003 [P] Enumerate the complete sk-prompt skill surface, excluding the assigned spec-folder docs (`.opencode/skills/sk-prompt/`)
- [ ] T004 Build the final path-classification and sibling-verdict matrices (`phase evidence`)
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T005 Reconcile every retained non-kebab filesystem name with the 017 exemption set or an owning sibling disposition (`phase evidence`)
- [ ] T006 [P] Resolve active references against the final child source-target maps (`.opencode/skills/sk-prompt/`)
- [ ] T007 [P] Check phase 006 release evidence against the final map and version metadata (`006-changelog-verify/`)
- [ ] T008 Record each unknown, stale, conflicting, or incomplete result as a blocking finding routed to its owner (`phase evidence`)
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T009 Re-run the final census and reconcile it with the classification matrix (`.opencode/skills/sk-prompt/`)
- [ ] T010 Confirm every sibling P0 check passes and no handoff contains an unresolved contradiction (`004-sk-prompt/001-*` through `006-*`)
- [ ] T011 Record commands, exit codes, SHAs, census/map hashes, verdicts, and findings (`phase evidence`)
- [ ] T012 Publish the pass/block result for central validation without modifying the skill surface (`007-skill-gate/`)
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remain
- [ ] Every sibling checklist and final filesystem path has a recorded verdict/classification
- [ ] No new migration work was performed by the rollup gate
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Verifier contract**: See `checklist.md`
- **Parent phase map**: See `../spec.md`
<!-- /ANCHOR:cross-refs -->
