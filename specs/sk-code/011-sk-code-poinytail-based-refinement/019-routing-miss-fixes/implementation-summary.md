---
title: "Implementation Summary"
description: "DOC-331 now defers, P4 and P7 reach sk-code on both advisor entry points, and the deep-loop hub passes admission without --warn-only."
trigger_phrases:
  - "routing miss fixes implementation summary"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-code/011-sk-code-poinytail-based-refinement/019-routing-miss-fixes"
    last_updated_at: "2026-10-11T18:30:00Z"
    last_updated_by: "routing-miss-fixes-builder"
    recent_action: "Closed the phase with every goal criterion passing"
    next_safe_action: "Start the next phase"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "summary-019-routing-miss-fixes"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 019-routing-miss-fixes |
| **Completed** | 2026-10-11 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The three misses that phases 15 and 16 closed as needing a one-caller mechanism are fixed. The deep-loop hub now passes its whole playbook, and both advisor batteries reach 17/17 with 0 of 5 false positives.

### Phase 19: routing-miss-fixes

**DOC-331.** The deep-loop router matched `deep-research` as a substring wherever it appeared, so "We just finished a deep-research run" scored `research` at 4. The hub router has no negative or past-tense signal, only a hard-coded `forbidden` reject and discovery classes it never scores. The fix is one constant beside `WORD_BOUNDARY_KEYWORDS`: a clause with a completion verb, a determiner, one or two words and a run noun is removed from the text the mode scores see. DOC-331 then names no mode and defers. "For a deep research run, resolve the mode" and "Run a deep-research fan-out" have no completion verb and route as before, and a request after the clause still routes.

**P4 and P7.** Both lost to a rule written for a different intent. `deepReviewSkCodeReviewPenalty` fires on any prompt naming a deep-review phrase, and `corpusStudySpecKitBonus` fires on any prompt naming a study artifact. Neither asks whether the prompt writes code. One condition, add, build, create, implement or write followed by helper, vitest or test with no deep-review phrase between them, now switches the corpus bonus off and turns the penalty into a +0.1 sk-code bonus. The penalty alone was not enough: without it sk-code still trailed system-deep-loop by 0.012. N3, a real resume with no authoring verb, keeps the penalty.

**Why the batteries disagreed.** The native scorer orders by raw score plus the intent bonus, but the bonus never reaches the reported score or confidence. `skill_advisor.py` re-sorts the native list by confidence and score, so it could not see the bonus: P7 passed there by accident, and P4 needed the Python deep-loop precedence to follow the native rank on a code-authoring prompt.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program/009-parent-hub-rollout/002-system-deep-loop/lib/canary-router.cjs` | Modify | Finished-run clause (authored source) |
| `.skilled/bin/lib/compiled-routing/` router copy and `serving-closure.manifest.json` | Modify | Published by `compiled-route-sync.cjs` |
| `.skilled/bin/tests/compiled-route-finished-run.test.cjs` | Create | Four cases |
| `.skilled/bin/tests/compiled-route-admission.test.cjs` | Modify | Corpus pin 86 to 82 |
| `.github/workflows/routing-registry-drift.yml` | Modify | Deep-loop admission blocks, other hubs stay warn-only |
| `runtime/lib/scorer/fusion.ts`, `scoring-constants.ts` | Modify | Code-authoring condition, `deepReviewCodeAuthoringSkCodeBonus` |
| `runtime/scripts/skill_advisor.py` | Modify | Mirror in the deep-loop precedence |
| `runtime/scripts/fixtures/gate2-golden-prompts.jsonl`, `tests/python/test_skill_advisor.py` | Modify | Four golden rows, T243-SA-012b |
| `runtime/tests/parity/fixtures/local-native-approved-divergences.json`, `runtime/scripts/routing-accuracy/scorer-eval-baseline.json` | Modify | Recaptured after the two improvements |
| system-skill-advisor `SKILL.md`, `changelog/v0.15.3.0.md`, Hermes copy | Modify, Create | Release 0.15.3.0 |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Baselines first, then a 1,342-prompt top-three snapshot before and after. Each new test ran on the old source and failed before it ran on the new one.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| A hub-local constant for the finished-run clause | The router has no schema field for it, a field would need the compiler and the router to change with it, and the sibling `WORD_BOUNDARY_KEYWORDS` is the same kind of constant |
| Block deep-loop admission only | The other hubs already pass but their baseline is untriaged; the step runs `--hub system-deep-loop` before `--all --warn-only` |
| Leave the Python re-sort alone | It differs from the native order on 8 of 195 labeled prompts, right on some and wrong on others, so changing it is its own decision |
| Re-pin the admission corpus at 82 | The pin failed on main before this phase; the removed improvement modes took 4 scenarios |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| advisor-battery.cjs (Python path) | 16/17 before, 17/17 after; 0/5 false positives |
| advisor-battery.py (CLI path) | 15/17 before, 17/17 after; 0/5 false positives |
| `compiled-route-admission.cjs --all` | system-deep-loop 19 pass 1 drift before, 20 pass 0 drift after; exit 1 to 0; one scenario changed in 82 |
| all-canaries.cjs, route guard, sync --check | 0 failures, fresh, 55 of 55 |
| system-skill-advisor vitest | 1,036 passed before, 1,040 after, 0 failed |
| Python harness, regression suite | 64 to 65 passed; `overall_pass` true, top1 accuracy 1.0 |
| Corpus snapshot, 1,342 prompts | Seven rows moved, all of them P4, P7 or probe variants of them |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. The Python entry point still re-sorts by confidence, so a native intent bonus reaches it only where a deep-loop precedence rule follows the native rank.
2. The local Python fallback scorer still reads P4 and P7 as system-deep-loop; both are recorded in the divergence ledger.
<!-- /ANCHOR:limitations -->

---
