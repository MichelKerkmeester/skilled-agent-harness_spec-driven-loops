---
title: "Tasks: Phase 011 system-spec-kit README revisit"
description: "Task list for rewriting the system-spec-kit README purpose-first against the refined template from phase 001."
trigger_phrases:
  - "phase 011 tasks"
  - "system spec kit readme tasks"
  - "spec kit readme rewrite tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/026-skill-readme-refinement/004-standalone-readme-revisit/011-system-spec-kit"
    last_updated_at: "2026-08-04T00:00:00Z"
    last_updated_by: "phase-executor"
    recent_action: "Executed the README rewrite, version bump and changelog entry"
    next_safe_action: "None, phase complete"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/README.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/011-system-spec-kit"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->

# Tasks: Phase 011 system-spec-kit README revisit

<!-- ANCHOR:notation -->
## Task Notation

- `[ ]` = pending, `[x]` = done. Completed items carry concrete evidence.
- Task IDs: T001-T010. `[P0]` blocks phase completion, `[P1]` completes or is explicitly deferred.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 [P0] Read the current README at `.opencode/skills/system-spec-kit/README.md` and record the `version:` field value and the current section list [evidence: `version: 3.6.0.99` recorded, old section list `10` sections inventoried across `1110` lines]
- [x] T002 [P0] Run `validate_document.py --type readme` on the current README and record the baseline output [evidence: baseline `Total issues: 0`, exit `0`]
- [x] T003 [P1] Run the link guard on the current README and record which links resolve [evidence: scope scan reports `0` FAIL lines for `system-spec-kit/README.md`; pre-existing failures are confined to `shared/node_modules/` and third-party package docs]
- [x] T004 [P0] Read the refined template at `.opencode/skills/sk-doc/sk-create-skill/assets/skill/skill-readme-template.md` and the exemplar at `.opencode/skills/mcp-tooling/mcp-obsidian/README.md` and record the section model [evidence: template section model `9` rows recorded, exemplar `9` numbered ALL-CAPS sections mirrored]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 [P0] Rewrite `.opencode/skills/system-spec-kit/README.md` per the refined template with the one-line pitch and the problem-first OVERVIEW [evidence: pitch blockquote at line `22`, `## 2. OVERVIEW` opens with `Why This Skill Exists`, `11` numbered ALL-CAPS H2 sections]
- [x] T006 [P0] Map every old claim into the new sections so the shipped facts survive the rewrite [evidence: old `10` sections mapped to new `11` sections, old `4.1`-`4.5` facts land in `HOW IT WORKS` and `VERIFICATION`, script inventories `25` rows preserved]
- [x] T007 [P0] Bump the `version:` field in the README frontmatter [evidence: `version: 3.8.0.0` at line `13`, next version after changelog `v3.7.1.0`]
- [x] T008 [P0] Add the changelog entry under `.opencode/skills/system-spec-kit/changelog/` with the name matching the new version value [evidence: `changelog/v3.8.0.0.md` present with titled CHANGED/NOT CHANGED entry]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 [P0] Run `validate_document.py --type readme` and the HVR grep (em dashes, semicolons and Oxford commas) on the rewritten README [evidence: validator `Total issues: 0`, HVR greps return `0` hits for em dash, semicolon, Oxford comma and banned words]
- [x] T010 [P1] Run the link guard, `git diff --check`, the scope diff via `git diff --name-only` and `validate.sh` on this phase folder, then record all evidence in checklist.md [evidence: link guard `0` README failures, `git diff --check` exit `0`, `validate.sh` exit `0` with `Errors: 0`, scope delta `2` skill files plus phase docs]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

The README reads purpose-first with the one-line pitch and the problem-first OVERVIEW. Every shipped fact survives. The HVR grep and the readme validator pass. The version field is bumped with a matching changelog entry. The scope diff lists only the README, the changelog entry and this phase folder. `validate.sh` on this phase folder returns zero errors.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- Spec: `spec.md` (REQ-001..REQ-009)
- Plan: `plan.md`
- Checklist: `checklist.md`
- Parent spec: `../spec.md` (004-standalone-readme-revisit)
- Refined template: `.opencode/skills/sk-doc/sk-create-skill/assets/skill/skill-readme-template.md`
- Exemplar: `.opencode/skills/mcp-tooling/mcp-obsidian/README.md`
- Validation script: `.opencode/skills/system-spec-kit/scripts/spec/validate.sh`
<!-- /ANCHOR:cross-refs -->
