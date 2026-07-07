---
title: "Tasks: Phase 5 — foldin review"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "sk-code foldin review tasks"
  - "code-review mode identity tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-code/001-sk-code-parent/005-foldin-review"
    last_updated_at: "2026-07-04T00:00:00Z"
    last_updated_by: "gpt-5.5"
    recent_action: "Documented completed review fold-in tasks"
    next_safe_action: "phase 006 build-remaining-modes"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "bootstrap-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 5 — foldin review

<!-- SPECKIT_LEVEL: 1 -->

---

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

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Confirm cohesive fold-in facts; evidence: `SKILL.md`, `README.md`, references[4], assets[6 checklists], scripts[2], changelog[5], and manual_testing_playbook[8 sections] now live under `sk-code/code-review/`.
- [x] T002 Confirm standalone advisor de-registration; evidence: `sk-code-review/graph-metadata.json` was deleted and the standalone folder is retired.
- [x] T003 Preserve scope lock; evidence: review doctrine and historical changelogs are excluded from rewrite, and the pre-existing playbook typo remains untouched.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Adapt `SKILL.md` identity; evidence: `name: code-review`, version `1.0.0.0`, `metadata.author: OpenCode`, `metadata.family: sk-code`, and `allowed-tools: [Read, Bash, Grep, Glob, Write]`.
- [x] T005 Adapt `SKILL.md` self-references and sibling references; evidence: own identity points to `code-review` mode, and sibling pointers use `code-implement`, `code-quality`, `code-debug`, and `code-verify`.
- [x] T006 Adapt `README.md` identity and paths; evidence: title/H1 use `code-review mode`, runtime reads point at `.opencode/skills/sk-code/code-review/`, and sibling navigation no longer treats `sk-code` as an external review companion.
- [x] T007 Preserve legacy alias in registry; evidence: `sk-code-review` appears in `mode-registry.json` review aliases.
- [x] T008 Preserve legacy alias in hub router; evidence: `sk-code-review` appears in `hub-router.json` review-aliases keywords.
- [x] T009 Preserve legacy alias in hub graph metadata; evidence: `sk-code-review` appears in `graph-metadata.json` derived trigger phrases.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T010 Check allowed-tools decision; evidence: the doctrine body remains non-mutating, says not to implement fixes during review, and only describes cache writes, so no `Edit` conflict was found.
- [x] T011 Check alias coverage; evidence: the legacy alias is present in all three requested hub routing surfaces.
- [x] T012 Record untouched playbook typo; evidence: `manual_testing_playbook.md -> cli-opencode-and-cli-opencode-handback.md` remains a pre-existing broken link whose target filename is `cli-opencode-and-cli-claude-code-handback.md`.
- [x] T013 Respect command restrictions; evidence: no git, build, validation, or npm command was run for this phase.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Fold-in-review identity adaptation accepted and complete; phase 006 build-remaining-modes is the next safe action
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Summary**: See `implementation-summary.md`
<!-- /ANCHOR:cross-refs -->

---

<!--
CORE TEMPLATE (~60 lines)
- Simple task tracking
- 3 phases: Setup, Implementation, Verification
- Add L2/L3 addendums for complexity
-->
