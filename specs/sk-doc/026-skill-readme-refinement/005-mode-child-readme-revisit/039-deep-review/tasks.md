---
title: "Tasks: Phase 039 deep-review mode README rewrite"
description: "Task list for rewriting the deep-review mode skill README against the refined README template from phase 001, with a version bump and a changelog entry."
trigger_phrases:
  - "phase 039 tasks"
  - "deep review readme tasks"
  - "mode readme rewrite tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/026-skill-readme-refinement/005-mode-child-readme-revisit/039-deep-review"
    last_updated_at: "2026-08-04T18:54:00Z"
    last_updated_by: "spec-author"
    recent_action: "Phase 039 executed: README rewritten, version 1.11.0.36, changelog added"
    next_safe_action: "Phase complete; closeout reconciles completion metadata"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/deep-review/README.md"
      - ".opencode/skills/system-deep-loop/deep-review/changelog/v1.11.0.36.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/039-deep-review"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->

# Tasks: Phase 039 deep-review mode README rewrite

<!-- ANCHOR:notation -->
## Task Notation

- `[ ]` = pending, `[x]` = done. Completed items carry concrete evidence.
- Task IDs: T001-T012. `[P]` marks parallelizable tasks.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 [P0] Read the current README (`.opencode/skills/system-deep-loop/deep-review/README.md`) and record the baseline: version field, validator output and link state [evidence: version=1.11.0.35, validator=0 issues exit 0, links=20/20 OK]
- [x] T002 [P0] Read the refined template (`.opencode/skills/sk-doc/sk-create-skill/assets/skill/skill-readme-template.md`) and the mcp-obsidian exemplar (`.opencode/skills/mcp-tooling/mcp-obsidian/README.md`) and record the section model and the required-section rule [evidence: template=skill-readme-template.md, exemplar=mcp-obsidian/README.md, H2 sections=9/9]
- [x] T003 [P1] Read the newest `changelog/` entry under `.opencode/skills/system-deep-loop/deep-review/changelog/` and confirm the entry convention [evidence: newest=v1.11.0.0.md, shape=H1 title + `## 1. OVERVIEW` + `## What Changed`]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 [P0] Rewrite the README purpose-first: one-line pitch and problem-first OVERVIEW per the refined template (or verify-only when the README already meets the standard) [evidence: pitch=blockquote, OVERVIEW=problem-first, H2=9/9 numbered, capability=The Dimension Coverage]
- [x] T005 [P0] Bump the frontmatter version field from `1.11.0.35` to `1.11.0.36` [evidence: version=1.11.0.36]
- [x] T006 [P0] Add the changelog entry at `changelog/v1.11.0.36.md` per the confirmed convention [evidence: changelog/v1.11.0.36.md created]
- [x] T007 [P1] Run a section-by-section diff against the baseline and confirm every factual claim survives the rewrite [evidence: baseline tokens=62/62 preserved, substance=10/10]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 [P0] Run `validate_document.py --type readme` on the README and confirm zero issues [evidence: validator=0 issues exit 0]
- [x] T009 [P0] Run the HVR grep and confirm zero em dashes, zero semicolons and zero Oxford commas [evidence: emdash=0, semicolon=0, oxford=0, banned=0, HVR=4/4 greps clean]
- [x] T010 [P1] Run the link guard over the README links and confirm all resolve [evidence: links=22/22 resolve]
- [x] T011 [P1] Confirm the scope diff shows only the README and the changelog entry and `git diff --check` is clean [evidence: scope=README+changelog+phase docs, git diff --check exit 0]
- [x] T012 [P1] Run `validate.sh` on this phase folder and record the evidence in checklist.md [evidence: validate.sh --strict errors=0 warnings=0 exit 0]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

The README is purpose-first on the refined template, the version field is bumped, a changelog entry is present, the readme validator reports zero issues, the HVR grep is clean, the scope diff is limited and this phase folder validates with zero errors.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- Spec: `spec.md` (REQ-001..REQ-009)
- Plan: `plan.md`
- Checklist: `checklist.md`
- Parent packet spec: `../spec.md`
- Refined template: `.opencode/skills/sk-doc/sk-create-skill/assets/skill/skill-readme-template.md`
- Exemplar: `.opencode/skills/mcp-tooling/mcp-obsidian/README.md`
<!-- /ANCHOR:cross-refs -->
