---
title: "Tasks: Phase 020 sk-design-mcp-open-design README revisit"
description: "Task list for rewriting the sk-design-mcp-open-design README against the refined README template."
trigger_phrases:
  - "phase 20 tasks"
  - "open design readme tasks"
  - "sk-design-mcp-open-design tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/026-skill-readme-refinement/005-mode-child-readme-revisit/020-sk-design-mcp-open-design"
    last_updated_at: "2026-08-04T00:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Scaffolded phase 020 task list inside 005-mode-child-readme-revisit"
    next_safe_action: "Execute setup, implementation and verification tasks in order"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/020-sk-design-mcp-open-design"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->

# Tasks: Phase 020 sk-design-mcp-open-design README revisit

<!-- ANCHOR:notation -->
## Task Notation

- `[ ]` = pending, `[x]` = done. Completed items carry concrete evidence.
- Task IDs: T001-T013. `[P]` marks parallelizable tasks.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 [P0] Read the refined README template (`.opencode/skills/sk-doc/sk-create-skill/assets/skill/skill-readme-template.md`) and record its section model and required-section rule (REQ-001) [evidence: template read, section model `9` H2 sections with OVERVIEW required, `version: 1.9.0.0`]
- [x] T002 [P0] Read the current README (`.opencode/skills/sk-design/sk-design-mcp-open-design/README.md`) and record the baseline: the version field value, the `validate_document.py --type readme` output and the link state (REQ-002) [evidence: baseline `version: 1.4.0.11` + validator exit `0` with `0` issues + `8/8` relative links resolve + HVR baseline `2` em dashes `6` semicolons `33` Oxford hits]
- [x] T003 [P1] [P] Read the mcp-obsidian exemplar README (`.opencode/skills/mcp-tooling/mcp-obsidian/README.md`) and record its purpose-first patterns (REQ-003) [evidence: exemplar read, pitch blockquote + AT A GLANCE first + numbered ALL-CAPS H2 pattern recorded, `version: 1.6.0.0`]
- [x] T004 [P1] [P] Confirm the parent sub-phase order from `../spec.md` and record the predecessor and successor pointers (REQ-008) [evidence: `../spec.md` sub-phase table shows predecessor `019-sk-design-interface` successor `021-sk-design-md-generator`]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 [P0] Run the conformance scan against the refined template: one-line pitch, problem-first OVERVIEW, numbered ALL-CAPS H2 sections, `---` dividers and the required-section rule, then record the rewrite scope (REQ-003) [evidence: `rg -n '^## '` shows `9` numbered ALL-CAPS H2 with dividers, pitch blockquote present, OVERVIEW problem-first, rewrite covers whole body]
- [x] T006 [P0] Rewrite the README purpose-first per the refined template with a one-line pitch and a problem-first OVERVIEW, using the mcp-obsidian README as the exemplar (REQ-003) [evidence: rewritten README at target path, pitch blockquote line `16`, `## 2. OVERVIEW` opens with `Why This Skill Exists`, capability section `The Open Design Surface`]
- [x] T007 [P0] Bump the version field in the README frontmatter (REQ-005) [evidence: `rg -n '^version:'` -> `1.5.0.0` from baseline `1.4.0.11`]
- [x] T008 [P0] Add the entry at `changelog/<version>.md` (REQ-005) [evidence: `changelog/v1.5.0.0.md` created, head version `1.5.0.0`, titled `Purpose-first README rewrite`]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 [P0] Run `python3 .opencode/skills/sk-doc/scripts/validate_document.py <readme> --type readme` on the README and record zero issues (REQ-006) [evidence: validator exit `0` with `0` issues on rewritten README]
- [x] T010 [P0] Run the HVR grep and confirm zero em dashes, zero semicolons and zero Oxford commas in the README body (REQ-004) [evidence: `rg '\x{2014}'` -> `0` + `rg '\x{3B}'` -> `0` + `rg ',\s+(and|or)\b'` -> `0` on README.md]
- [x] T011 [P1] Run the link guard and confirm every linked path in the README resolves (REQ-006) [evidence: link guard `8/8` relative links resolve incl. `references/tool-surface.md` and `../../README.md`]
- [x] T012 [P1] Run the scope diff (`git diff --stat`, `git diff --check`, `git status`) and confirm no out-of-scope file changed (REQ-008) [evidence: `git diff --check` clean, `git status` shows only README.md + `changelog/v1.5.0.0.md` + phase docs]
- [x] T013 [P1] Run `validate.sh` on this phase folder with `--strict`, confirm zero errors and regenerate the phase metadata (REQ-009) [evidence: `validate.sh --strict` exit `0` with `0` errors + `generate-context.js` metadata run]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

The README ends purpose-first on the refined template with a one-line pitch and a problem-first OVERVIEW, HVR clean, version bumped, changelog entry present, validator zero issues, link guard clean and a clean scope diff. This phase folder validates with zero errors.
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
- Exemplar README: `.opencode/skills/mcp-tooling/mcp-obsidian/README.md`
- Target README: `.opencode/skills/sk-design/sk-design-mcp-open-design/README.md`
- HVR rules: `.opencode/skills/sk-doc/shared/references/hvr-rules.md`
<!-- /ANCHOR:cross-refs -->
