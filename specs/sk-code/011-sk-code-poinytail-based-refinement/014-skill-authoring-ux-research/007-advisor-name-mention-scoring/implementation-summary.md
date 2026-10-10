---
title: "Implementation Summary"
description: "The advisor no longer lets a skill name inside a path, a skill named only as the doc file being edited, a stale .opencode guard or the generic word findings pull the route; the probe battery moves from 12/17 and 2/5 to 14/17 and 0/5."
trigger_phrases:
  - "advisor name mention scoring implementation summary"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-code/011-sk-code-poinytail-based-refinement/014-skill-authoring-ux-research/007-advisor-name-mention-scoring"
    last_updated_at: "2026-10-10T21:00:00Z"
    last_updated_by: "orchestrator"
    recent_action: "Closed the phase with every goal criterion passing"
    next_safe_action: "Start the next phase"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "summary-014-007-advisor-name-mention-scoring"
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
| **Spec Folder** | 007-advisor-name-mention-scoring |
| **Completed** | 2026-10-10 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The advisor no longer lets a skill name inside a path, a skill named only as the doc file being edited, a stale .opencode guard or the generic word findings pull the route; the probe battery moves from 12/17 and 2/5 to 14/17 and 0/5.

### Phase 7: advisor-name-mention-scoring

Four fixes in the scorer. The executor-delegation negative guard now matches `.skilled/` paths as well as `.opencode/`, so a project path next to "type is cli-opencode" no longer reads as delegation (mirrored in the Python scorer). The explicit lane counts a skill name or author phrase only when one occurrence is plain: not inside a path token and not directly before SKILL.md, ROUTER.md, a README or a changelog. When a write verb targets a skill's own doc file, that skill's author phrases are skipped, because the skill is the location being edited. `skill.md` and `router.md` join the write-doc surface, and the generic `findings` token boost is removed from both scorers and from sk-code's intent signals.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/system-skill-advisor/runtime/lib/scorer/executor-delegation.ts` | Modify | Guard matches .skilled/ |
| `.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/explicit.ts` | Modify | Plain-mention helper, doc-target rule, doc surface, findings token |
| `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py` | Modify | Same guard and findings removal for parity |
| `.skilled/skills/system-skill-advisor/runtime/tests/name-mention-scoring.vitest.ts` | Create | Five cases |
| `.skilled/skills/system-skill-advisor/runtime/tests/parity/fixtures/local-native-approved-divergences.json` | Modify | One recorded divergence with its reason |
| `.skilled/skills/sk-code/graph-metadata.json` | Modify | Drop the generic findings intent signal |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Five DeepSeek V4.1 Flash max builds through cli-pi on the LLM gateway: the guard, the first explicit-lane pass, the author-phrase helper, the doc-target rule and the test file. After each scorer change the orchestrator rebuilt dist and replayed the battery, and read the lane evidence directly from the built scorer to find the next cause. The orchestrator mirrored the guard and the findings removal into the Python scorer, dropped the sk-code intent signal and recorded the one ratchet divergence.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Skip a mention, never subtract | A path or doc-file mention carries no intent, so it adds nothing rather than counting against the skill |
| Ledger entry for the findings prompt | Both scorers missed its deep-review gold before and after; the change removed a false sk-code lift and left local abstaining |
| Drop the findings intent signal from sk-code | It was the last source of the false lift on research prompts once the token boost was gone |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `advisor-battery.py` | positives 14/17 negatives-false-positive 0/5 (baseline 12/17, 2/5) |
| `npx vitest run tests/name-mention-scoring.vitest.ts` | 5 passed; against the committed scorer 4 failed, 1 passed (the control) |
| `npm run typecheck` | exit 0 |
| `npx vitest run` | 136 files, 1018 passed, 6 skipped, 0 failed (baseline 1013 passed, 0 failed) |
| `pytest tests/python/test_skill_advisor.py` | 4 passed |
| sk-code doctor, leaf-manifest and intent-signal checks; compiled-route-guard | pass |
| `validate.sh --strict` on this phase | RESULT: PASSED |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. P4, P7 and P15 still route elsewhere; each names another skill's surface (a deep-loop phrase, a research packet helper, a doc alignment script) and none is caused by a name mention.
2. The compiled skill graph now lags sk-code's metadata until phase 009 regenerates it.
<!-- /ANCHOR:limitations -->

---
