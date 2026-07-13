---
title: "Tasks: sk-code Split-Doc Template Alignment"
description: "Per-batch conformance + verification task checklist with evidence."
trigger_phrases:
  - "019 tasks sk-code split doc alignment"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-code/019-split-doc-template-alignment"
    last_updated_at: "2026-07-12T14:23:42Z"
    last_updated_by: "claude-code"
    recent_action: "All batches complete; 163/163 at 0 issues"
    next_safe_action: "Terminal gates"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: sk-code Split-Doc Template Alignment

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation
`[x]` complete · `[ ]` pending. Each row carries evidence.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup
- [x] T001 Read create-skill asset/reference templates + package_skill.py resource-doc contract
- [x] T002 Confirm 027 collision scope (027 done; did not rename reference/asset split files)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation
- [x] T003 code-quality assets (pilot) — 3 files conformed + renamed
- [x] T004 code-opencode references — config/python/js/shell/typescript/rust/shared (recursive)
- [x] T005 code-opencode assets — checklists/scripts
- [x] T006 code-webflow references — animation/css/html/debugging/deployment/performance/verification/js/shared/implementation (recursive)
- [x] T007 code-webflow assets
- [x] T008 Cross-surface reference-link repair (whole-hub staging fix after per-surface staging dropped cross-refs)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification
- [x] T009 validate_document.py 0 issues on all 163 sk-code ref+asset files
- [x] T010 0 hyphenated split filenames remaining across all three surfaces
- [x] T011 0 broken relative .md links to/among renamed files (all conformed files + referrers resolve; 2 pre-existing non-navigational artifacts hub-wide are out of scope)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria
163/163 files at 0 issues; 0 hyphenated; 0 broken links to renamed files; all batches committed + pushed to v4. Met.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References
- `./spec.md`, `./plan.md`, `./checklist.md`, `./implementation-summary.md`
- `.opencode/skills/sk-code/{code-opencode,code-webflow,code-quality}/` (deliverable)
<!-- /ANCHOR:cross-refs -->
