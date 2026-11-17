---
title: "Goal: Phase 3: hook-folder-readmes"
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
    packet_pointer: "sk-doc/document-standards/006-readme-template-conformance/003-hook-folder-readmes"
    last_updated_at: "2026-11-16T19:26:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-11-16-readme-conformance-goal-003"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Goal: Phase 3: hook-folder-readmes

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Bring the 26 hook folder READMEs under `.skilled/hooks/` onto the hook template's folder scaffold, so each passes the validator and the voice scan with no hard blocker and every runtime row matches the adapters and registration files on disk.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The phase covers the 26 `.skilled/hooks/<name>/README.md` files. `shared/` and the hooks library README belong to phase 007, and runtime adapter READMEs to phase 004 |
| D2 | A symlinked README is edited at its target. The skill advisor hook doc at `.skilled/skills/system-skill-advisor/hooks/skill-advisor-hook.md` is rewritten to the folder scaffold, as the operator chose |
| D3 | Content that code reads survives: the goal README's paths and switch names, the completion evidence delivery terms, the bold runtime rows in the skill advisor hook doc and section 3 of the sk-git hooks README |
| D4 | Adapters and registration files stay unchanged. A defect found there is recorded, not fixed |
| D5 | No hand edit to a README version or a changelog entry. The pre-commit doc-version gate raises a changed README's version |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] Each of the 26 hook folder READMEs opens with an H1 naming the concern, every H2 is numbered, ALL CAPS, named in the folder scaffold and has a `---` line above it, and RUNTIME COVERAGE has a row for each of the eight runtimes
- [ ] For each of the 26 hook folder READMEs, `python3 .skilled/skills/sk-doc/scripts/validate_document.py <readme>` prints `VALID` and `python3 .skilled/skills/sk-doc/sk-create-with-human-voice/scripts/hvr_scan.py <readme>` reports `hard blockers: 0`
- [ ] `readme_links.py` run over the 26 hook folder READMEs at their real paths prints `0 problems`
- [ ] `implementation-summary.md` holds one review line per hook folder README from a session that did not write it, confirming every runtime row, path and switch holds against the code or was corrected
- [ ] `test_readme_verdict_parity.py` prints `PARITY PASS`, the sk-doc suite exits 0, and `goal-doc-contract.test.cjs`, `completion-evidence-sentinel.vitest.ts`, `advisor-runtime-list-parity.vitest.ts` and `git-setup-check.test.cjs` all pass
- [ ] `implementation-summary.md` records each of the 26 READMEs' validator and voice results before and after, and no mechanical voice ceiling ends below its baseline
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
