---
title: "Goal: Phase 4: rewrite the cli-orca changelogs"
description: "The durable directive this phase executes against and the criteria that decide when it is done."
trigger_phrases:
  - "packet goal"
  - "durable directive"
  - "completion criteria"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-doc/059-skill-changelog-retrofit/004-cli-orca"
    last_updated_at: "2026-09-24T18:20:00Z"
    last_updated_by: "claude-code"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "fb879d4c-5543-4760-8339-b0f3499f278d"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Goal: rewrite the cli-orca changelogs

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** The 1 listed cli-orca changelog read in the current format, and each still records exactly what shipped in its version.

### Decisions

Frozen. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The parent's decisions D1 to D7 bind this phase unchanged. |
| D2 | The target set is `../scratch/lists/cli-orca.txt`. A changelog outside it is not touched. |
| D3 | The phase starts only after phase 001 records the operator's style approval. |

### Operator copy

A change here that alters a parent decision or criterion is applied to the parent first, and the parent's chat slice is resent.
<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] Every file in `../scratch/lists/cli-orca.txt` has a pass or a failure with its reason in `../scratch/state.jsonl`
- [ ] The shape checker with `--old` exits 0 and `hvr_scan.py` reports 0 hard blockers on every kept file
- [ ] Every kept file has a PASS fact-check verdict and unchanged frontmatter
- [ ] One commit holds the cli-orca rewrites, and the compiled-route guard and every mirror `--check` pass after it
- [ ] `validate.sh --strict` on this phase reports `RESULT: PASSED`
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
| Wave | Pending | Waits on the style approval |
| Style approval | Done | Operator approved the pilot style with fixes on 2026-09-24. The wave may start |
| Wave | Done | d62d7a3a1a on origin/main holds the one kept rewrite; route guard and nine mirror checks exit 0; validate.sh --strict RESULT: PASSED |

### Deviations and findings

| Item | Note |
|------|------|
| None yet | None |
<!-- /ANCHOR:log -->
