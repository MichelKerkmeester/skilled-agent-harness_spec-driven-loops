---
title: "Tasks — Phase 20 — README and skill message refinement"
description: "Task list for the README rewrite and SKILL.md purpose correction."
trigger_phrases:
  - "phase 20 tasks"
  - "readme rewrite tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/013-mcp-obsidian/020-readme-and-message-refinement"
    last_updated_at: "2026-08-04T05:41:57Z"
    last_updated_by: "spec-author"
    recent_action: "Author Phase 20 tasks"
    next_safe_action: "Execute README rewrite and SKILL.md refinement"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/020-readme-and-message-refinement"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->

# Tasks — Phase 20 — README and skill message refinement

<!-- ANCHOR:notation -->
## Task Notation

- `[x]` = done; completed items carry concrete evidence.
- Task IDs: T001–T007; P-tagged items are blockers.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 [P] Capture the baseline: current README validation state, factual inventory to preserve, and all purpose-framing statements in README + SKILL.md [evidence: pre-rewrite `validate_document.py --type readme` VALID 0 issues; fact inventory extracted from old README sections 1-9; purpose statements located in `SKILL.md` frontmatter description and H1 intro]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T002 [P] Rewrite `README.md` in the repo-root narrative voice with the corrected purpose and a plugin-knowledge section [evidence: full rewrite (13.4KB) with pitch blockquote, AT A GLANCE, problem-first OVERVIEW, dedicated Plugin Knowledge Layer section, and all nine template sections]
- [x] T003 [P] Reframe the `SKILL.md` frontmatter description and H1 intro to the corrected purpose [evidence: description now leads with "Makes AI use inside Obsidian effective"; H1 intro states the same; routing, rules, and references untouched]
- [x] T004 Bump versions (`SKILL.md` → 1.4.1.0, `README.md` → 1.1.0.0) and create `changelog/v1.4.1.0.md` [evidence: both frontmatter versions updated; changelog entry written with NEW/CHANGED/NOT CHANGED sections]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T005 [P] Run `validate_document.py --type readme` and the HVR grep (zero em dashes and semicolons) [evidence: readme validator reports 0 issues; `rg "—|;"` matches only TypeScript code-fence lines; 30 Oxford-comma fixes applied; `SKILL.md --type skill` also VALID 0 issues]
- [x] T006 [P] Verify link integrity, leaf-manifest freshness, and phase validation [evidence: README local links resolve (broken: 0); `generate-leaf-manifest.cjs --check` OK; `validate.sh` errors 0]
- [x] T007 Regenerate phase metadata and write the implementation summary [evidence: description.json + graph-metadata.json regenerated; `implementation-summary.md` written]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

The README states the true purpose (effective AI use inside Obsidian with plugin knowledge), validates as a readme document, contains no HVR violations, and preserves every factual claim. SKILL.md carries the same corrected message.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- Spec: `spec.md` (REQ-001..REQ-006)
- README template: `.opencode/skills/sk-doc/sk-create-skill/assets/skill/skill-readme-template.md`
- Human Voice Rules: `.opencode/skills/sk-doc/shared/references/hvr-rules.md`
- Parent packet: `../spec.md`
<!-- /ANCHOR:cross-refs -->
