---
title: "Goal: Phase 7: docs-and-closeout"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "packet goal"
  - "durable directive"
  - "completion criteria"
  - "goal binding"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-speckit/050-open-knowledge-format-adoption/007-docs-and-closeout"
    last_updated_at: "2026-10-04T09:20:00Z"
    last_updated_by: "claude-sonnet-5-5"
    recent_action: "Added the operator UX and command-surface criterion"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-10-04-speckit-050"
      parent_session_id: null
    completion_pct: 80
    open_questions: []
    answered_questions: []
---
# Goal: Phase 7: docs-and-closeout

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Leave both skills' docs describing exactly what shipped, then close the program. Done when: the sk-create-frontmatter contract text and the spec-kit key table state the shipped contextType and importance_tier rules; validation-rules.md documents each shipped rule and none that was recorded as not built; every skill doc edited in this program has a bumped four-part version and a changelog entry, and check-frontmatter-versions.sh exits 0; validate.sh --strict --recursive on the packet prints RESULT: PASSED; the closure record lists each deferred item and why; the doc of every changed /create:*, /speckit:*, /deep:* and /doctor command names the check it now runs or the value it now emits.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | This phase documents and verifies only. It adds no behavior. |
| D2 | A phase recorded as not built gets no catalog or contract entry. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] the sk-create-frontmatter contract text and the spec-kit key table state the shipped contextType and importance_tier rules
- [x] validation-rules.md documents each shipped rule and none that was recorded as not built
- [ ] every skill doc edited in this program has a bumped four-part version and a changelog entry, and check-frontmatter-versions.sh exits 0
- [x] validate.sh --strict --recursive on the packet prints RESULT: PASSED
- [x] the closure record lists each deferred item and why
- [x] the doc of every changed /create:*, /speckit:*, /deep:* and /doctor command names the check it now runs or the value it now emits
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 4. LOG

Everything below is VOLATILE. It is not part of the directive, it is not copied
into the objective, and it is expected to grow. Progress, evidence, deviations
and findings belong here.

### Progress

| Item | State | Evidence |
|------|-------|----------|
| Phase opened | Done | plan.md and tasks.md written |
| Contract text and key table | Done | `frontmatter-templates.md`, `grep-convention.md` |
| Rule sections | Done | `validation-rules.md` has FRONTMATTER_VALUES and SOURCE_TAGS, and nothing for the not-built anchor form |
| Command docs | Done | Seven docs, implementation-summary.md:129 |
| Changelogs and skill versions | Done | Six entries, version check exit 0, implementation-summary.md:123-125 |
| Each doc's fourth version digit | Waiting | Counts commits, so it moves only in the commit root D4 holds |
| Closure record | Done | implementation-summary.md:63-73 |

### Deviations and findings

| Item | Note |
|------|------|
| Strict-mode claim fixed in two docs | Both said `--strict` fails on warnings; the orchestrator passes on zero errors |
| Missing rule test added | The phase 003 rule had none; `check-frontmatter-values.vitest.ts` adds three cases |
<!-- /ANCHOR:log -->
