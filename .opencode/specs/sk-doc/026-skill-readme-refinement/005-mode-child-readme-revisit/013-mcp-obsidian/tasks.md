---
title: "Tasks: Phase 013 mcp-obsidian README revisit (verify-only exemplar)"
description: "Task list for verifying the mcp-obsidian README against the refined template and for the conditional rewrite path."
trigger_phrases:
  - "phase 13 tasks"
  - "mcp obsidian readme tasks"
  - "exemplar verify tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/026-skill-readme-refinement/005-mode-child-readme-revisit/013-mcp-obsidian"
    last_updated_at: "2026-08-04T00:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Scaffolded phase 013 task list inside 005-mode-child-readme-revisit"
    next_safe_action: "Execute setup, implementation and verification tasks in order"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/013-mcp-obsidian"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->

# Tasks: Phase 013 mcp-obsidian README revisit (verify-only exemplar)

<!-- ANCHOR:notation -->
## Task Notation

- `[ ]` = pending, `[x]` = done. Completed items carry concrete evidence.
- Task IDs: T001-T013. `[P]` marks parallelizable tasks.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 [P0] Read the refined README template (`.opencode/skills/sk-doc/sk-create-skill/assets/skill/skill-readme-template.md`) and record its section model and required-section rule (REQ-001) [evidence: `skill-readme-template.md` read; section model 9 sections, OVERVIEW the only required section]
- [x] T002 [P0] Read the current README (`.opencode/skills/mcp-tooling/mcp-obsidian/README.md`) and record the baseline: the version field value, the `validate_document.py --type readme` output and the link state (REQ-002) [evidence: baseline version `1.2.0.0`, validator `0 issues` exit 0, links `11/11` resolve]
- [x] T003 [P1] [P] Confirm the parent sub-phase order from `../spec.md` and record the predecessor and successor pointers (REQ-008) [evidence: predecessor `012-mcp-mobbin`, successor `014-mcp-refero` in `../spec.md`]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 [P0] Run the conformance check against the refined template: one-line pitch, problem-first OVERVIEW, numbered ALL-CAPS H2 sections, `---` dividers and the required-section rule (REQ-003) [evidence: pitch `1/1`, OVERVIEW problem-first `1/1`, H2 `9/9` numbered ALL-CAPS with `---` dividers; HVR gate `FAIL` on 2 prose semicolons]
- [x] T005 [P0] Record the conformance verdict per gate in checklist.md (REQ-003) [evidence: verdict `FAIL` recorded in `checklist.md` at CHK-010]
- [x] T006 [P0] Only on conformance failure: rewrite the README purpose-first per the refined template with a one-line pitch and a problem-first OVERVIEW (REQ-003) [evidence: surgical rewrite executed: `2/2` semicolon cells fixed at lines 60-61, `1` comma removed at line 25; pitch and OVERVIEW already conformant]
- [x] T007 [P0] Only on conformance failure: bump the version field in the README frontmatter (REQ-005) [evidence: version field `1.2.0.0` to `1.6.0.0` in README frontmatter]
- [x] T008 [P0] Only on conformance failure: add the entry at `changelog/<version>.md` (REQ-005) [evidence: entry added at `changelog/v1.6.0.0.md`]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 [P0] Run `python3 .opencode/skills/sk-doc/scripts/validate_document.py <readme> --type readme` on the README and record zero issues (REQ-006) [evidence: validator exit `0`, `0 issues`, document VALID on final README]
- [x] T010 [P0] Run the HVR grep and confirm zero em dashes, zero semicolons and zero Oxford commas in the README body (REQ-004) [evidence: em dash `0`, prose semicolons `0` (code-fence hits `2` exempt), Oxford comma hits `0`]
- [x] T011 [P1] Run the link guard and confirm every linked path in the README resolves (REQ-006) [evidence: `11/11` relative links resolve]
- [x] T012 [P1] Run the scope diff (`git diff --stat`, `git diff --check`, `git status`) and confirm no out-of-scope file changed (REQ-008) [evidence: `git diff --check` clean, staged files `0`, this phase changed `3` files: README, changelog entry, phase docs]
- [x] T013 [P1] Run `validate.sh` on this phase folder with `--strict`, confirm zero errors and regenerate the phase metadata (REQ-009) [evidence: `validate.sh --strict` exit `0` zero errors, metadata regenerated via `generate-context.js`]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

The conformance verdict is recorded per gate with evidence. A conformant README stays byte-for-byte unchanged. A non-conformant README ends purpose-first, versioned, with a changelog entry, validator zero issues, HVR clean, link guard clean and a clean scope diff. This phase folder validates with zero errors.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- Spec: `spec.md` (REQ-001..REQ-009)
- Plan: `plan.md`
- Checklist: `checklist.md`
- Parent spec: `../spec.md`
- Packet spec: `../../spec.md`
- Refined template: `.opencode/skills/sk-doc/sk-create-skill/assets/skill/skill-readme-template.md`
- Target README: `.opencode/skills/mcp-tooling/mcp-obsidian/README.md`
- HVR rules: `.opencode/skills/sk-doc/shared/references/hvr-rules.md`
<!-- /ANCHOR:cross-refs -->
