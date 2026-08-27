---
title: "Tasks: Phase 3: template-dedup"
description: "Correct decision-record frontmatter duplication, preserve the shared ADR body and research routes, and verify the focused output changes."
trigger_phrases:
  - "decision-record dedup tasks"
  - "frontmatter correction"
  - "research anchor preservation"
  - "template snapshot review"
importance_tier: "important"
contextType: "general"
---
# Tasks: Phase 3: template-dedup

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

**Task Format**: `T### [P?] Description (file path); done when ...`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 [REQ-001] Isolate the roughly 24 duplicated frontmatter lines from the shared ADR body (`.opencode/skills/system-spec-kit/templates/addons/decision-record.md.tmpl`); done when the intended metadata-only diff and unchanged body boundary are explicit.
- [ ] T002 [REQ-002, REQ-004] Inventory the research_finding anchor set and taxonomy decision (`.opencode/skills/system-spec-kit/templates/addons/research.md.tmpl`, `.opencode/skills/system-spec-kit/mcp-server/lib/content-router.ts`); done when every route has a preserved destination or a documented deferral rationale.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T003 [REQ-001] Consolidate the L3/L3+ decision-record frontmatter and correct the malformed description (`.opencode/skills/system-spec-kit/templates/addons/decision-record.md.tmpl`); done when one combined metadata block serves both levels and the ADR body remains one shared block.
- [ ] T004 [REQ-002, REQ-004] Neutralize the research widget taxonomy or record the explicit deferral (`.opencode/skills/system-spec-kit/templates/addons/research.md.tmpl`, `003-template-dedup/implementation-summary.md`); done when the research_finding anchor contract remains intact and the chosen outcome has rationale.
- [ ] T005 [REQ-003] Prepare the rebuilt runtime surfaces (`.opencode/skills/system-spec-kit/scripts/dist/`, `.opencode/skills/system-spec-kit/mcp-server/dist/`); done when both distributions are regenerated from the corrected template sources before validation.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T006 [REQ-001] Review the decision-record snapshot diff (`.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap`); done when L3 and L3+ retain the same ADR body and only intended frontmatter lines differ.
- [ ] T007 [REQ-002] Review the research snapshot and routes (`.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap`, `.opencode/skills/system-spec-kit/mcp-server/lib/content-router.ts`); done when every research_finding target resolves without an unintended route change.
- [ ] T008 [REQ-003] Validate representative fresh L3 and L3+ scaffolds (`.opencode/skills/system-spec-kit/scripts/spec/validate.sh`); done when strict validation exits successfully against rebuilt distributions.
- [ ] T009 [REQ-001, REQ-002, REQ-003, REQ-004] Confirm the phase acceptance record (`003-template-dedup/spec.md`); done when all four requirements have evidence or the permitted research deferral is explicitly recorded.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] REQ-001 through REQ-004 each have a completed mapped task and evidence
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Analysis**: See `../001-analysis/research/research.md`
<!-- /ANCHOR:cross-refs -->
