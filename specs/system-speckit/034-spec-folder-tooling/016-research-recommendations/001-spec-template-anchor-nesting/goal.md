---
title: "Goal: Spec template anchor nesting"
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
    packet_pointer: "system-speckit/034-spec-folder-tooling/016-research-recommendations/001-spec-template-anchor-nesting"
    last_updated_at: "2026-10-08T12:00:00Z"
    last_updated_by: "orchestrator"
    recent_action: "Phase built and verified"
    next_safe_action: "Commit with wave 1"
    blockers: []
    key_files:
      - ".skilled/skills/system-spec-kit/templates/core/spec.md.tmpl"
      - ".skilled/skills/system-spec-kit/runtime/cli/tests/scaffold-golden-snapshots.vitest.ts"
      - ".skilled/skills/system-spec-kit/runtime/cli/tests/snapshots/scaffold-golden-snapshots.vitest.ts.snap"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "bd2aa56c-623b-43f8-a2ef-69a13c32d626"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Goal: Spec template anchor nesting

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Move the spec.md template's questions anchor from inside NFR/edge-cases/complexity to wrap only the questions section, fixing retrieval and merges for new scaffolds.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Fix the template at the source rather than individual documents; SH-11 (anchor-repair-mode) handles the 549 existing files |
| D2 | Built in wave 1 by DeepSeek V4.1 Flash max through cli-pi on the OpenCode Go route: `SYSTEM_SPEC_GATE_ENFORCE=0 AI_SESSION_CHILD=1 PI_BLACKHOLE_PASSIVE=true pi -p "<brief>" --model opencode-go/deepseek-v4.1-flash --thinking max --mode text --offline </dev/null`. One task from tasks.md per brief, in task order, and the diff is checked before the next brief |
| D3 | Reviewed read-only by Luna max fast through cli-codex with `--sandbox read-only`. The builder applies a finding only after confirming it in the code, for at most two rounds |
| D4 | The builder writes only the files in spec.md Files to Change, its tests and this folder. The orchestrator reverts any other write |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] The golden snapshot test passes with the fixed anchor layout for L1, L2, L3 and L3+
- [x] A new L1, L2, L3 and L3+ scaffold from `create.sh` passes strict validation on ANCHORS_VALID
- [x] The snapshot test asserts no anchor nesting, order and pairing for every level
- [x] The spec-kit test suite runs with no regressions
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
| Template anchors moved | Done | Four per-level openers directly above OPEN QUESTIONS (template lines 302, 307, 390, 394); the L3+ closer now sits after Question 1 |
| Anchor order assertions added | Done | `expectAnchorsWellOrdered` in the golden test; against the old template it failed 2 tests with named messages |
| Snapshots regenerated | Done | 3 entries updated (2, 3, 3+) and 1 added (`review-spec.md`); 12 passed |
| Fresh scaffolds validate | Done | `create.sh` at L1, L2, L3 and L3+, each `validate.sh --strict` RESULT: PASSED with Errors 0, and a node stack check found no nesting |
| Cross-family review | Done | Luna round 1: one P1 (`review.spec.md.tmpl` not rendered by the golden test), fixed |
| Full suite | Done | `npm test` in runtime/cli rc 0, 1648 passed and 0 failed against a baseline of 1639; `check`, typecheck and build rc 0 |
| Packet documents closed | Done | All five criteria Met; `validate.sh --strict` RESULT: PASSED |

### Deviations and findings

| Item | Note |
|------|------|
| L1, L2 and L3 closer not moved | tasks.md T004 planned to move it to just before RELATED DOCUMENTS, but at old line 399 it already sat directly after Question 2. Only the opener moved for those levels; the L3+ closer was the one that wrapped RELATED DOCUMENTS and was moved |
| Helper instead of `assert` calls | The anchor checks are one vitest `expect` helper, `expectAnchorsWellOrdered`, shared by the four spec levels, the phase-parent spec and the review and research spec templates |
| Review-driven addition | Luna round 1 found `review.spec.md.tmpl` was never rendered by the golden test. It is now in the render matrix, which added a snapshot entry (25 in the file, 24 at the baseline) |
| Cosmetic P2 not applied | Removing the opener leaves a doubled blank line in the L2 and L3 renders; left unchanged as cosmetic |
| Suite run through `npm test` | The suite gate ran as `npm --prefix .skilled/skills/system-spec-kit/runtime/cli test` at the wave 1 final gate, not as a phase-only `npx vitest run runtime/cli/tests`, so its counts cover every wave 1 phase |
<!-- /ANCHOR:log -->
