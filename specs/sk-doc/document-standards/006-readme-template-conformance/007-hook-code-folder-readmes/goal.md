---
title: "Goal: Phase 7: hook-code-folder-readmes"
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
    packet_pointer: "sk-doc/document-standards/006-readme-template-conformance/007-hook-code-folder-readmes"
    last_updated_at: "2026-11-16T19:26:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-11-16-readme-conformance-goal-007"
      parent_session_id: null
    completion_pct: 95
    open_questions: []
    answered_questions: []
---
# Goal: Phase 7: hook-code-folder-readmes

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Bring the 31 hook code folder READMEs and the hooks library README onto the code-folder template, so each passes the validator and the voice scan with no hard blocker and lists only files, exports and commands the folders confirm.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The phase covers the `lib/`, `tests/`, `bin/`, `history/`, `session-readers/` and fixtures READMEs inside `.skilled/hooks/`, `.skilled/hooks/shared/README.md` and `.skilled/hooks/README.md`, which is rewritten last |
| D2 | The hooks library README keeps its switch index and the coverage matrix header, rows and cell vocabulary `runtime-refusal.test.mjs` reads |
| D3 | A flat folder may name its complete file table FILES, as the code-folder template allows. The fixtures README is validated with `--no-exclude` |
| D4 | The code in these folders stays unchanged. A defect found there is recorded, not fixed |
| D5 | No hand edit to a README version or a changelog entry. The pre-commit doc-version gate raises a changed README's version |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] Each of the 32 READMEs opens with an H1 naming the folder and its responsibility, and every H2 is numbered, ALL CAPS, named in the code-folder scaffold or the FILES table name and has a `---` line above it
- [ ] For each of the 32 READMEs, `python3 .skilled/skills/sk-doc/scripts/validate_document.py <readme>` prints `VALID` and `python3 .skilled/skills/sk-doc/sk-create-with-human-voice/scripts/hvr_scan.py <readme>` reports `hard blockers: 0`, run with `--no-exclude` for the fixtures README
- [ ] `readme_links.py` run over the 32 READMEs prints `0 problems`
- [ ] `implementation-summary.md` holds one review line per README from a session that did not write it, confirming every file table, export and command holds against the folder or was corrected
- [ ] `test_readme_verdict_parity.py` prints `PARITY PASS`, the sk-doc suite exits 0 and `runtime-refusal.test.mjs` passes
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
| H1 and H2 model, 32 files | Done | `h2model.py` printed `SUBSET nodiv=0` for all 32 |
| Validator and voice scan | Done | 32 `✅ VALID` (fixtures with `--no-exclude`) and `hard=0` on every line |
| `readme_links.py` | Done | 182 outbound and 2 inbound anchored links, `0 problems` |
| Review line per README | Done | 32 lines in `implementation-summary.md`, 3,040 claims, 78 applied, 2 rejected |
| Parity, sk-doc suite, runtime-refusal | Done | `PARITY PASS`, 58 PASS with exit 0, `pass 6` |

### Deviations and findings

| Item | Note |
|------|------|
| Writer effort | From wave 6 on, writers ran DeepSeek V4.1 Flash at high effort on OpenCode Go at the operator's request, and reviewers stayed at max. The parent goal's D4 names max. Wave 6 drew 13 findings against 12 for wave 5, so quality held |
| Fallback route | The operator named cli-pi on llmgateway with DeepSeek V4.1 Flash as the fallback for an OpenCode Go quota hit. No hit happened, so no session used it |
| Early commits | The first five READMEs and an OpenCode-to-Skilled wording fix in four README files were committed before the phase closed, at the operator's request |
| Sample review | A Claude review agent sampled 160 claims after the waves, as phase 006 did, and 7 findings were applied |
<!-- /ANCHOR:log -->
