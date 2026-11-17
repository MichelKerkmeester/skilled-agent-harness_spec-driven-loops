---
title: "Goal: Phase 6: runtime-folder-readmes"
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
    packet_pointer: "sk-doc/document-standards/006-readme-template-conformance/006-runtime-folder-readmes"
    last_updated_at: "2026-11-16T19:26:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-11-16-readme-conformance-goal-006"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Goal: Phase 6: runtime-folder-readmes

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Bring the 7 runtime folder READMEs and 8 `SYNC.md` manifests onto the runtime folder template and write `.vibe/README.md`, so all 16 pass the validator and the voice scan with no hard blocker and state only surfaces, commands and checks the folders confirm.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The phase covers the README in `.claude/`, `.codex/`, `.cursor/`, `.devin/`, `.dsh/`, `.opencode/` and `.pi/`, the `SYNC.md` in those and in `.vibe/`, and a new `.vibe/README.md` |
| D2 | `.opencode/SYNC.md` keeps `## 2. SURFACE INVENTORY` with an H2 numbered 3 after it and every inventory row matching the disk |
| D3 | Generators, drift checks and runtime configs stay unchanged. A defect found there is recorded, not fixed |
| D4 | No hand edit to a README version or a changelog entry. The pre-commit doc-version gate raises a changed README's version |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] Each of the 16 files follows its scaffold in the runtime folder template, every README opens OVERVIEW with a four-row At a Glance table, and every H2 is numbered, ALL CAPS and has a `---` line above it
- [ ] For each of the 16 files, `.vibe/README.md` included, `python3 .skilled/skills/sk-doc/scripts/validate_document.py <file>` prints `VALID` and `python3 .skilled/skills/sk-doc/sk-create-with-human-voice/scripts/hvr_scan.py <file>` reports `hard blockers: 0`
- [ ] `readme_links.py` run over the 16 files prints `0 problems`
- [ ] `implementation-summary.md` holds one review line per file from a session that did not write it, confirming every surface row, command and check holds against the folder or was corrected
- [ ] `test_readme_verdict_parity.py` prints `PARITY PASS`, the sk-doc suite exits 0 and `opencode-compat-layout.test.cjs` passes
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
