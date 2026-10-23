---
title: "Goal: Phase 6: fix-write-recipe-move-destination"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "fix write recipe move destination goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-speckit/041-write-recipe-fixes/006-fix-write-recipe-move-destination"
    last_updated_at: "2026-10-23T13:49:00Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "041-write-recipe-fixes-006-planning"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 6: fix-write-recipe-move-destination

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Replace the bare move destination in Step 2 of the spec folder write recipe with a real example path and one sentence that tells the reader to substitute their own track, so the block runs as written.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | One known row carries both the destination and the sentence. `apply_row.py` is the only writer of the recipe. |
| D2 | The new destination is `specs/system-speckit/078-opencode-authoring-recipe`. The `system-speckit` track and the 078 number are examples, and the added sentence says so. |
| D3 | The bare placeholders outside Step 2 are out of scope: `<folder>` at lines 64, 72, 78, 84 and 92, `<repo-root>` at line 79, `<track>/<packet>` at line 104 and `<spec-folder>` in `references/debugging/troubleshooting.md` line 304. Section 4 lists them as adjacent findings. |
| D4 | This phase runs after 054 phase 002 saves `apply_row.py`, and it reads the 054 phase 001 ledger when that file exists. |
| D5 | The phase closes on scripted gates plus one read-only frontier review. The operator commits the recipe fix. |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `grep -cF -- '  <spec-folder>' .skilled/skills/system-spec-kit/references/workflows/spec-folder-write-recipe.md` prints `0` and `grep -cF -- '  specs/system-speckit/078-opencode-authoring-recipe' .skilled/skills/system-spec-kit/references/workflows/spec-folder-write-recipe.md` prints `1`
- [ ] `grep -cF -- 'track in the destination above is an example' .skilled/skills/system-spec-kit/references/workflows/spec-folder-write-recipe.md` prints `1`
- [ ] `grep -c '^YES ' specs/system-speckit/041-write-recipe-fixes/006-fix-write-recipe-move-destination/scratch/recheck.txt` prints `0` and `grep -c '^bare=0$' specs/system-speckit/041-write-recipe-fixes/006-fix-write-recipe-move-destination/scratch/recheck.txt` prints `1`
- [ ] `wc -l < specs/system-speckit/041-write-recipe-fixes/006-fix-write-recipe-move-destination/scratch/changed-files.txt` prints `1`
- [ ] `diff specs/system-speckit/041-write-recipe-fixes/006-fix-write-recipe-move-destination/scratch/suite-start-summary.txt specs/system-speckit/041-write-recipe-fixes/006-fix-write-recipe-move-destination/scratch/suite-end-summary.txt > /dev/null && echo SUITE_MATCH` prints `SUITE_MATCH`
- [ ] `grep -cvE '^(P[012]) |^NO FINDINGS$' specs/system-speckit/041-write-recipe-fixes/006-fix-write-recipe-move-destination/scratch/review/T009.txt` prints `0`
- [ ] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-speckit/041-write-recipe-fixes/006-fix-write-recipe-move-destination --strict` prints `RESULT: PASSED`
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
| Phase opened | Pending | |
| Start commit | Pending | |
| Applier present | Pending | |
| Known row saved | Pending | |
| Known row applied | Pending | |
| Ledger sweep | Pending | |
| Diff check | Pending | |
| Evidence recheck | Pending | |
| Suite match | Pending | |
| Frontier review | Pending | |
| Phase close | Pending | |

### Deviations and findings

| Item | Note |
|------|------|
| Adjacent, not fixed | `spec-folder-write-recipe.md` Steps 3 to 6 hold bare `<folder>` placeholders at lines 64, 72, 78, 84 and 92. Step 5 also holds `<repo-root>` at line 79, and Step 7 holds `<track>/<packet>` at line 104. |
| Adjacent, not fixed | `references/debugging/troubleshooting.md` line 304 ends a `generate-context.js` command with `  <spec-folder>`. It is the same class in another file and no ledger row owns it here. |
| Execution deviations | None yet |
<!-- /ANCHOR:log -->
