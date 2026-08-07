---
title: "Tasks: Phase 1 cli-external-orchestration README rewrite"
description: "Task list for rewriting the cli-external-orchestration skill README purpose-first against the refined standalone template, bumping the version to 1.3.0.0 and adding a changelog entry."
trigger_phrases:
  - "phase 1 tasks"
  - "cli external orchestration readme tasks"
  - "hub readme rewrite tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/026-skill-readme-refinement/004-standalone-readme-revisit/001-cli-external-orchestration"
    last_updated_at: "2026-08-04T12:45:00Z"
    last_updated_by: "phase-executor-001"
    recent_action: "All tasks executed with evidence marked"
    next_safe_action: "Hand phase off: phase 1 complete, successor 002-mcp-code-mode ready"
    blockers: []
    key_files:
      - ".opencode/skills/cli-external-orchestration/README.md"
      - ".opencode/skills/cli-external-orchestration/changelog/v1.3.0.0.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/001-cli-external-orchestration"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->

# Tasks: Phase 1 cli-external-orchestration README rewrite

<!-- ANCHOR:notation -->
## Task Notation

- `[ ]` = pending, `[x]` = done. Completed items carry concrete evidence.
- Task IDs: T001-T010. `[P]` marks parallelizable tasks.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Run the template readiness gate: `ls` `.opencode/skills/sk-doc/sk-create-skill/assets/skill/skill-readme-template.md` and read the template body [evidence: `ls` confirmed file + template body read (`skill-readme-template.md` `1.9.0.0`)]
- [x] T002 [P] Read the current README (`.opencode/skills/cli-external-orchestration/README.md`) in full and record the baseline: `version` field value, `validate_document.py` output and relative link state [evidence: `version: 1.2.0.0` + `validate_document.py` exit `0` with `0` issues + `13` baseline links]
- [x] T003 [P] Read the mcp-obsidian exemplar (`.opencode/skills/mcp-tooling/mcp-obsidian/README.md`) and record its pitch blockquote and OVERVIEW pattern [evidence: pitch + `Why This Hub Exists` OVERVIEW pattern mirrored from `mcp-obsidian/README.md`]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Draft the one-line pitch blockquote and the problem-first OVERVIEW for `.opencode/skills/cli-external-orchestration/README.md` per the refined template [evidence: pitch line 25 + `## 2. OVERVIEW` `Why This Hub Exists` section in rewritten README]
- [x] T005 Rewrite the body sections preserving all six mode pointers (cli-opencode, cli-claude-code, cli-codex, cli-cursor, cli-devin and cli-pi) and the routing facts (mode-registry.json and hub-router.json usage, tieBreak order, defaultMode) [evidence: `rg -c` hits `7/4/5/4/5/5` + `FOUND` for `mode-registry.json`, `hub-router.json`, `tieBreak`, `defaultMode`, `orderedBundle`]
- [x] T006 Bump the frontmatter `version` field from 1.2.0.0 to 1.3.0.0 [evidence: `grep '^version:'` → `1.3.0.0`]
- [x] T007 Add `changelog/v1.3.0.0.md` with a titled entry covering the README rewrite [evidence: `changelog/v1.3.0.0.md` exists + `validate_document.py --type changelog` exit `0`]
- [x] T008 Run a section-by-section diff of the old vs new README and confirm no dispatch fact was lost [evidence: `7` H2 sections `1..7` + all `6` mode pointers present + `18/18` links resolve]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 [P] Run `validate_document.py --type readme` on the rewritten README, the HVR grep (zero em dashes, semicolons and Oxford commas), the link guard and `git diff --check` [evidence: validator exit `0` + HVR greps `0` matches (exit `1`) + links `18/18` + `git diff --check` exit `0`]
- [x] T010 Run `validate.sh` on this phase folder, confirm the scope diff lists only allowed files and record evidence in checklist.md [evidence: `validate.sh --strict` exit `0` + scope diff `2` files + `0` staged]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

The README exists purpose-first per the refined template with a one-line pitch and a problem-first OVERVIEW, preserves all six mode pointers and the routing facts, carries `version: 1.3.0.0` with a `changelog/v1.3.0.0.md` entry, passes the readme validator with zero issues, passes the HVR grep and the link guard and validates this phase folder with zero errors. No SKILL.md, template, registry, manifest or vault file is modified.
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
