---
title: "Goal: Phase 4: template-section-fill-guidance"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "template section fill guidance goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-speckit/054-weak-model-spec-authoring/004-template-section-fill-guidance"
    last_updated_at: "2026-10-23T14:00:00Z"
    last_updated_by: "planning-session"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "054-weak-model-spec-authoring-planning"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 4: template-section-fill-guidance

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Make every core template section tell a weak model exactly what to write, and keep the hand-written examples aligned with the templates.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Each `## ` section carries one `<!-- FILL: instruction GOOD: example WEAK: example -->` line immediately below the heading. |
| D2 | Every good and weak pair is about the same feature: a `--quiet` flag on `recommend-level.sh`. |
| D3 | An optional section may be deleted when it does not apply. A required section gets `N/A` and one reason. |
| D4 | The example drift guard delegates anchor comparison to `runtime/cli/utils/template-structure.js compare`. |
| D5 | The 14 example documents in the alignment table are aligned by the contract output. No example is regenerated, because each carries content. |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `npx vitest run runtime/cli/tests/template-fill-guidance.vitest.ts` prints `Tests  16 passed (16)`
- [ ] `npx vitest run runtime/cli/tests/scaffold-golden-snapshots.vitest.ts` prints `Tests  12 passed (12)` without `-u`
- [ ] `bash runtime/cli/spec/check-example-drift.sh` prints `EXAMPLE_DRIFT_OK`
- [ ] The awk crossing command in `plan.md` section 3 prints nothing on every `.tmpl` under `templates`
- [ ] `diff scratch/baseline/anchor-counts.txt scratch/baseline/anchor-counts-after.txt` prints nothing
- [ ] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh <this phase> --strict` prints `RESULT: PASSED`
- [ ] `git status --porcelain` lists only the files in `spec.md` section 3 and this phase folder
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
| Planning docs audited | Fixed | `scratch/verify/report.txt` findings applied, `scratch/verify/fixed.txt` lists each one |

### Deviations and findings

| Item | Note |
|------|------|
| Phase numbering | The packet has nine phases. The docs work is `007-playbook-catalog-readme-alignment`, and `006-speckit-command-and-agent-alignment` owns the commands and agents. |
| Phase 002 dependency | Phase 002 rewrites the 18 leaked example descriptions, rows K-01 to K-18, before this phase runs. The drift guard's three description rules pass only on the post-002 tree. |
| Phase 003 dependency | Phase 003 converts every bare hint in the five named templates to the `[YOUR_VALUE_HERE: ...]` form. T001 records the token count and the repair blocks give both the pre-token and the post-003 locator form. |
| Fenced-code scanner hits | `check-placeholders.sh` on the planning tree reports 22 hits, all quoted template text inside fenced blocks. The scanner skips only the fence delimiter lines, not the fenced body, so the hits are a known false positive rather than an unfilled placeholder. The post-003 forms carry the token and are not counted. The remaining hits are the pre-token fallback forms in the same blocks. |
| Derived metadata refresh | After the doc edits the validator reported `SOURCE_FINGERPRINT_MISMATCH` and a stale derived description in `graph-metadata.json`. The validator's own `repair-derived.cjs --apply` re-derived `graph-metadata.json` only. No authored doc outside the allowed list changed. |
| Handoff at close | Phase 005 may assume every core section carries one fill line. Phase 006 may assume the commands and agents can name the card, the token and the guards. Phase 007 may assume the authoring docs describe the same three things. |
<!-- /ANCHOR:log -->
