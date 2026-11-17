---
title: "Goal: Changelog Layout Retrofit"
description: "Every skill and release changelog and every GitHub release body reads in the v4.1.0.0 layout and records exactly what shipped."
trigger_phrases:
  - "changelog layout retrofit goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-doc/document-standards/003-changelog-system/010-changelog-layout-retrofit"
    last_updated_at: "2026-11-17T18:13:02Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "cbc62a39-7ca8-4b5a-989f-a86fdea260ea"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Changelog Layout Retrofit

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE
<!-- FILL: Write one sentence: what the packet is for, not how. GOOD: Keep only the newest n archives on request. WEAK: Improve the script. -->

**Objective:** Every skill and release changelog, and every GitHub release body, reads in the v4.1.0.0 layout and records exactly what shipped.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Only free models write: Hy4 Flash Free at high thinking through cli-opencode, with Devin's free `glm-5-2` as the only fallback |
| D2 | A rewrite keeps every fact of its source and adds none. The fact lock and the shape check gate every draft, and a failed draft is restored |
| D3 | Only release bodies change. No tag moves and no release is deleted |
| D4 | The 1,652 packet-local changelogs under `specs/` stay as they are |
| D5 | Phases run in order, and each validates before the next one starts |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:binding -->
## 2. BINDING
<!-- FILL: List each child phase and its goal path. Name the precedence rule. GOOD: 001 and 002. Decisions here outrank child detail. WEAK: Children are bound. -->

**Read the child goal before working a phase.** Each is authoritative for its
phase and binds as if written here.

| Phase | Goal document |
|-------|---------------|
| 001-layout-tooling-and-pilot | `001-layout-tooling-and-pilot/goal.md` |
| 002-skilled-release-line | `002-skilled-release-line/goal.md` |
| 003-sk-doc-changelogs | `003-sk-doc-changelogs/goal.md` |
| 004-cli-external-orchestration-changelogs | `004-cli-external-orchestration-changelogs/goal.md` |
| 005-sk-code-changelogs | `005-sk-code-changelogs/goal.md` |
| 006-mcp-tooling-changelogs | `006-mcp-tooling-changelogs/goal.md` |
| 007-system-spec-kit-changelogs | `007-system-spec-kit-changelogs/goal.md` |
| 008-system-deep-loop-changelogs | `008-system-deep-loop-changelogs/goal.md` |
| 009-system-skill-advisor-changelogs | `009-system-skill-advisor-changelogs/goal.md` |
| 010-sk-design-changelogs | `010-sk-design-changelogs/goal.md` |
| 011-sk-git-changelogs | `011-sk-git-changelogs/goal.md` |
| 012-small-skill-changelogs | `012-small-skill-changelogs/goal.md` |
| 013-github-release-notes-sync | `013-github-release-notes-sync/goal.md` |

**Precedence.** Decisions above outrank child detail. Child detail outranks any
summary of it. Name a conflict rather than resolving it silently.

**Stop.** Only the criteria below decide done. An evaluator sees the objective
string, not these files.
<!-- /ANCHOR:binding -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA
<!-- FILL: Write one command-checkable criterion per line. GOOD: `--keep 3` leaves 3 archives in `logs/archive` and exits 0. WEAK: The work is done. -->

- [ ] The driver state records `pass` or `unchanged` for all 1,576 skill and release changelogs, with 0 restored
- [ ] The fact lock reports 0 missing code spans, numbers or spec-folder lines across all 1,576 rewrites
- [ ] `hvr_scan.py` reports 0 hard blockers on every rewritten changelog
- [ ] All 152 GitHub release bodies read in the new layout, and every tag points at the commit it pointed at before
- [ ] `validate.sh --recursive --strict` on `010-changelog-layout-retrofit` prints `RESULT: PASSED`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 4. LOG
<!-- FILL: Record each step with its command output. Keep this table current. GOOD: T001 Done. `ls logs/archive | wc -l` printed 3. WEAK: Progress is good. -->

Everything below is VOLATILE. It is not part of the directive, it is not copied
into the objective, and it is expected to grow. Progress, evidence, deviations
and findings belong here.

### Progress

| Item | State | Evidence |
|------|-------|----------|
| Parent goal authored | Done | `check-goal.cjs` on this packet |

### Deviations and findings

| Item | Note |
|------|------|
| None yet | - |
<!-- /ANCHOR:log -->
