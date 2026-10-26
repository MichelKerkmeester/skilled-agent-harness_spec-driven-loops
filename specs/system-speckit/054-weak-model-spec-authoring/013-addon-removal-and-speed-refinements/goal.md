---
title: "Goal: Phase 13: addon-removal-and-speed-refinements"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "addon removal and speed refinements goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-speckit/054-weak-model-spec-authoring/013-addon-removal-and-speed-refinements"
    last_updated_at: "2026-10-26T07:30:00Z"
    last_updated_by: "conductor"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "054-013-addon-removal-and-speed-refinements"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 13: addon-removal-and-speed-refinements

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE
<!-- FILL: Write one sentence: what the packet is for, not how. GOOD: Print one parseable level line on request. WEAK: Improve the script. -->

**Objective:** Drop the before-after, roadmap and resource-map add-ons and build the six speed refinements, with no existing packet changing verdict.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Drop the resource-map add-on only. The deep loops keep writing their own map, the `--no-resource-map` flag and the coverage gate stay. |
| D2 | The repair hint prints the `--apply` command first; the dry run stays as an optional line. |
| D3 | DeepSeek V4.1 Flash max through cli-pi makes the edits, one change per brief; cli-codex Luna is the fallback; a fresh Opus medium agent reviews. |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA
<!-- FILL: Write one command-checkable criterion per line. GOOD: `--quiet` prints 1 line and exits 0. WEAK: The work is done. -->

- [x] `acceptance-criteria.md` reads Closeable: Yes with every row Met or Superseded by an ADR
- [x] The six-rule census diff prints nothing, and every strict-census change only removes a failure (ADR-001)
- [x] `validate.sh` on this folder with `--strict` prints `RESULT: PASSED`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 4. LOG
<!-- FILL: Record each step with its command output. Keep this table current. GOOD: T001 Done. `rg -n quiet` printed line 510. WEAK: Progress is good. -->

Everything below is VOLATILE. It is not part of the directive, it is not copied
into the objective, and it is expected to grow. Progress, evidence, deviations
and findings belong here.

### Progress

| Item | State | Evidence |
|------|-------|----------|
| Phase opened | Done | `create.sh --phase --phase-parent` scaffolded this folder on 2026-10-26 at start commit `fdc0ddde40` |
| Add-on removal (A, B, C, C2, C3, C4) | Done | 7 add-ons left; template-name `rg` exits 1 |
| Docs (D1, D2, D3) | Done | Docs `rg` empty; Hermes 67 in sync; 0 broken links |
| Card (E, E2, E3) | Done | `--quiet` and "every failing rule" in section 9; CARD SYNC OK |
| Hint (F) | Done | repair-hint-order 2 passed; `--apply` first |
| Templates (G) | Done | 36/36 passed; EXAMPLE_DRIFT_OK |
| Verification | Done except final validate | Six scaffolds PASSED; six-rule diff empty; strict diff 2 rows toward PASS, ADR-001 |

### Deviations and findings

| Item | Note |
|------|------|
| AC-003 superseded | strict census: 2 archived folders lost a failure from their root resource-map.md, ADR-001 |
| Criteria 1 and 2 amended | Reworded to match ADR-001 on 2026-10-26; the strict diff is 2 rows, both toward PASS |
<!-- /ANCHOR:log -->
