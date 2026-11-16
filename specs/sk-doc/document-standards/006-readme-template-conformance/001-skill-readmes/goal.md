---
title: "Goal: Phase 1: skill-readmes"
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
    packet_pointer: "sk-doc/document-standards/006-readme-template-conformance/001-skill-readmes"
    last_updated_at: "2026-11-16T18:30:35Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-11-16-readme-conformance-goal-001"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Goal: Phase 1: skill-readmes

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Bring the 14 skill READMEs under `.skilled/skills/` onto the skill README template, with a new one for `sk-design`, so each passes the validator and the voice scan with no hard blocker and states only facts the skill's own files confirm.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The phase covers the 13 tracked skill READMEs and a new `.skilled/skills/sk-design/README.md`. `local-webflow` is a symlink into another project and stays out. Mode packet READMEs below a hub belong to phase 002 |
| D2 | Content that code reads survives the rewrite: the `42-rule registry` phrase in the spec-kit README, every registered packet folder name in the deep-loop README, the anchor the root README links into the sk-code README and a valid `readme-check` block in the sk-git README |
| D3 | `SKILL.md`, `ROUTER.md`, references and every other file inside a skill stay unchanged. A defect found there is recorded, not fixed |
| D4 | No hand edit to a README version or a changelog entry. The pre-commit doc-version gate raises a changed README's version |
| D5 | A claim the skill's files do not confirm is dropped, never kept on trust. A section with no real content for its skill is removed and the rest renumbered, never filled with a placeholder |
| D6 | The skill README template as read at Setup is the contract for the whole phase |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] Each of the 14 skill READMEs (every `.skilled/skills/*/README.md` except the `local-webflow` symlink, the new `sk-design` one included) opens with an H1 and a one-line blockquote pitch, then `## 1. OVERVIEW` led by a four-row At a Glance table. Every H2 in them is numbered and ALL CAPS with a `---` line above it
- [ ] For each of the 14 skill READMEs, `python3 .skilled/skills/sk-doc/scripts/validate_document.py <readme>` prints `VALID` and `python3 .skilled/skills/sk-doc/sk-create-with-human-voice/scripts/hvr_scan.py <readme>` reports `hard blockers: 0`
- [ ] `readme_links.py` run over the 14 skill READMEs prints `0 problems`, counting their outbound links and the anchored links into them from the rest of the repository
- [ ] `implementation-summary.md` holds one review line per skill README from a reviewer who did not write it. Each line confirms that every path, command, count and list holds against the skill's files or was corrected and that every command block states its expected output
- [ ] `python3 .skilled/skills/sk-doc/scripts/tests/test_readme_verdict_parity.py` prints `PARITY PASS` against the rebuilt README verdict baseline
- [ ] The spec-kit registry count test and the deep-loop documentation drift check both pass on the rewritten READMEs
- [ ] `implementation-summary.md` records each of the 14 skill READMEs' validator and voice results before and after the rewrite. It also records the link checker result before and after. No rewritten README's mechanical voice ceiling ends below its baseline
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
| [Item] | [Pending/In Progress/Done] | [Command output, file:line, or artifact] |

### Deviations and findings

| Item | Note |
|------|------|
| [What diverged from the directive] | [Why, and what was done instead] |
<!-- /ANCHOR:log -->
