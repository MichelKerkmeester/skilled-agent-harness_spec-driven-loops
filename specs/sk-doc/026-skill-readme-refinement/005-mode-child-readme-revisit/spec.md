---
title: "Feature Specification: Phase 005 — mode child skill README revisit (per-skill phases)"
description: "Phase parent: one child phase per mode (child) skill, each revisiting that skill's README against the refined template from phase 001, using mcp-obsidian as the exemplar."
trigger_phrases:
  - "mode readme revisit"
  - "child skill readme revisit"
  - "readme fleet revisit"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/026-skill-readme-refinement/005-mode-child-readme-revisit"
    last_updated_at: "2026-08-04T00:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Convert phase 005 to a phase parent with one child phase per mode (child) skill"
    next_safe_action: "Execute the per-skill child phases once phases 001 and 004 are complete"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/005-mode-child-readme-revisit"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->
<!-- CONTENT DISCIPLINE: PHASE PARENT
  FORBIDDEN content (do NOT author at phase-parent level):
    - merge/migration/consolidation narratives
    - heavy docs: plan.md, tasks.md, checklist.md, decision-record.md, implementation-summary.md — these belong in child phase folders only
  REQUIRED content (MUST author at phase-parent level):
    - Root purpose: what problem does this entire phased decomposition solve?
    - Sub-phase list: which child phase folders exist and what each one does
    - What needs done: the high-level outcome the phases work toward
-->

# Feature Specification: Phase 005 — mode child skill README revisit (per-skill phases)

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 (phase parent) |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-08-04 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | `../spec.md` (sk-doc track) |
| **Parent Packet** | `sk-doc/026-skill-readme-refinement` |
| **Predecessor** | `004-standalone-readme-revisit` |
| **Successor** | `006-validation-and-closeout` |
| **Handoff Criteria** | Every child phase closes with its mode skill README purpose-first on the refined template, HVR clean, versioned with a changelog entry, validated with zero issues, and phase docs validated with zero errors |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Root Purpose

The mcp-obsidian README pilot proved the standard for mode (child) skill READMEs too: narrative, purpose-first documents in the Human Voice Rules, validated by the sk-doc README validator. The other child-mode skills in the repo still carry the older tabular reference-card style and predate the pilot learnings.

This parent coordinates one child phase per mode skill across every hub in the repo: cli-external-orchestration, mcp-tooling, sk-code, sk-design, sk-doc, sk-prompt and system-deep-loop. Each child owns its own README: inventory, rewrite or verify-only, version bump, changelog entry and validation.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:phases -->
## 3. SUB-PHASES

| Phase | Mode skill README it revisits |
|-------|-------------------------------|
| `001-cli-claude-code` | `.opencode/skills/cli-external-orchestration/cli-claude-code/README.md` |
| `002-cli-codex` | `.opencode/skills/cli-external-orchestration/cli-codex/README.md` |
| `003-cli-cursor` | `.opencode/skills/cli-external-orchestration/cli-cursor/README.md` |
| `004-cli-devin` | `.opencode/skills/cli-external-orchestration/cli-devin/README.md` |
| `005-cli-opencode` | `.opencode/skills/cli-external-orchestration/cli-opencode/README.md` |
| `006-cli-pi` | `.opencode/skills/cli-external-orchestration/cli-pi/README.md` |
| `007-mcp-aside-devtools` | `.opencode/skills/mcp-tooling/mcp-aside-devtools/README.md` |
| `008-mcp-chrome-devtools` | `.opencode/skills/mcp-tooling/mcp-chrome-devtools/README.md` |
| `009-mcp-click-up` | `.opencode/skills/mcp-tooling/mcp-click-up/README.md` |
| `010-mcp-figma` | `.opencode/skills/mcp-tooling/mcp-figma/README.md` |
| `011-mcp-magnific` | `.opencode/skills/mcp-tooling/mcp-magnific/README.md` |
| `012-mcp-mobbin` | `.opencode/skills/mcp-tooling/mcp-mobbin/README.md` |
| `013-mcp-obsidian` | `.opencode/skills/mcp-tooling/mcp-obsidian/README.md` (verify-only, the exemplar) |
| `014-mcp-refero` | `.opencode/skills/mcp-tooling/mcp-refero/README.md` |
| `015-sk-code-opencode` | `.opencode/skills/sk-code/sk-code-opencode/README.md` |
| `016-sk-code-quality` | `.opencode/skills/sk-code/sk-code-quality/README.md` |
| `017-sk-code-review` | `.opencode/skills/sk-code/sk-code-review/README.md` |
| `018-sk-code-webflow` | `.opencode/skills/sk-code/sk-code-webflow/README.md` |
| `019-sk-design-interface` | `.opencode/skills/sk-design/sk-design-interface/README.md` |
| `020-sk-design-mcp-open-design` | `.opencode/skills/sk-design/sk-design-mcp-open-design/README.md` |
| `021-sk-design-md-generator` | `.opencode/skills/sk-design/sk-design-md-generator/README.md` |
| `022-sk-create-agent` | `.opencode/skills/sk-doc/sk-create-agent/README.md` |
| `023-sk-create-benchmark` | `.opencode/skills/sk-doc/sk-create-benchmark/README.md` |
| `024-sk-create-changelog` | `.opencode/skills/sk-doc/sk-create-changelog/README.md` |
| `025-sk-create-command` | `.opencode/skills/sk-doc/sk-create-command/README.md` |
| `026-sk-create-diff` | `.opencode/skills/sk-doc/sk-create-diff/README.md` |
| `027-sk-create-feature-catalog` | `.opencode/skills/sk-doc/sk-create-feature-catalog/README.md` |
| `028-sk-create-flowchart` | `.opencode/skills/sk-doc/sk-create-flowchart/README.md` |
| `029-sk-create-manual-testing-playbook` | `.opencode/skills/sk-doc/sk-create-manual-testing-playbook/README.md` |
| `030-sk-create-quality-control` | `.opencode/skills/sk-doc/sk-create-quality-control/README.md` |
| `031-sk-create-readme` | `.opencode/skills/sk-doc/sk-create-readme/README.md` |
| `032-sk-create-skill` | `.opencode/skills/sk-doc/sk-create-skill/README.md` |
| `033-sk-prompt-improve` | `.opencode/skills/sk-prompt/sk-prompt-improve/README.md` |
| `034-sk-prompt-models` | `.opencode/skills/sk-prompt/sk-prompt-models/README.md` |
| `035-deep-ai-council` | `.opencode/skills/system-deep-loop/deep-ai-council/README.md` |
| `036-deep-alignment` | `.opencode/skills/system-deep-loop/deep-alignment/README.md` |
| `037-deep-improvement` | `.opencode/skills/system-deep-loop/deep-improvement/README.md` |
| `038-deep-research` | `.opencode/skills/system-deep-loop/deep-research/README.md` |
| `039-deep-review` | `.opencode/skills/system-deep-loop/deep-review/README.md` |
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:success-criteria -->
## 4. SUCCESS CRITERIA

- **SC-001**: Every child phase reports its mode README purpose-first on the refined template with a one-line pitch and a problem-first OVERVIEW.
- **SC-002**: Every rewritten README passes `validate_document.py --type readme` with zero issues, carries a version field and has a changelog entry.
- **SC-003**: The mcp-obsidian exemplar README stays unchanged, verify-only.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 5. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phases 001 and 004 must precede | Modes rewritten against a moving standard | Child phases gate their start on the refined template and the standalone fleet |
| Risk | Child-mode READMEs vary widely in size and shape | One standard may not fit small modes | Template allows dropping non-earning sections; validator only requires OVERVIEW |
| Risk | HVR violations accumulate in large rewrites | Voice check fails | Scripted grep gates in each child phase |
| Risk | Changelog discipline drifts | Releases without entries | Per-skill changelog entries recorded in each child phase |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 6. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->
