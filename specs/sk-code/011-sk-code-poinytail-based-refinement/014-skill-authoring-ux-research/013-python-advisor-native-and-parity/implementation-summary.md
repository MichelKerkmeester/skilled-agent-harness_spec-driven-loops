---
title: "Implementation Summary"
description: "skill_advisor.py stays on the native scorer after the advisor daemon idles out, its local fallback now follows the path and doc-target rules, and both battery scripts refuse a run that is not native."
trigger_phrases:
  - "python advisor native and parity implementation summary"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-code/011-sk-code-poinytail-based-refinement/014-skill-authoring-ux-research/013-python-advisor-native-and-parity"
    last_updated_at: "2026-10-10T21:00:00Z"
    last_updated_by: "orchestrator"
    recent_action: "Closed the phase with every goal criterion passing"
    next_safe_action: "Start the next phase"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "summary-014-013-python-advisor-native-and-parity"
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
| **Spec Folder** | 013-python-advisor-native-and-parity |
| **Completed** | 2026-10-10 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

skill_advisor.py stays on the native scorer after the advisor daemon idles out, its local fallback now follows the path and doc-target rules, and both battery scripts refuse a run that is not native.

### Phase 13: python-advisor-native-and-parity

Native bridge cause: when the daemon stops on its launcher idle timeout, daemon shutdown publishes the skill-graph generation file with state unavailable. The bridge probe in skill_advisor.py accepted only live or stale, so `--force-native` reported freshness unavailable and the default path fell back to the local scorer, although readAdvisorStatus reported indexStaleness fresh and an in-process recommend call worked. The probe now treats a content-fresh index as eligible. The local Python scorer gains `_has_plain_mention` and `_targets_own_doc_file`, mirroring the native rules (review finding P2-07). The CLI battery fails when the CLI status is not ok or freshness is not live or stale, and gains `--via python`, which runs skill_advisor.py with `--force-native` and fails on any row whose source is not native. The round-four battery passes `--force-native` and fails on a non-native row.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py` | Modify | Bridge eligibility; two ported rules |
| `.skilled/skills/system-skill-advisor/runtime/tests/python/test_skill_advisor.py` | Modify | Checks SA-022 to SA-026 |
| `007-advisor-name-mention-scoring/scratch/advisor-battery.py` | Modify | Degraded run fails; --via python |
| `../011-round-four-remediation/003-hub-surface-precedence/scratch/advisor-battery.cjs` | Modify | --force-native; non-native row fails |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The orchestrator traced the cause by running the bridge, readAdvisorStatus, readSkillGraphGeneration and handleAdvisorRecommend directly. Three DeepSeek V4.1 Flash max builds through cli-pi on the LLM gateway: the bridge fix with its check, the battery scripts, and the Python port with its checks. The orchestrator ran the new checks against the earlier scorer to see them fail.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Fix the reader, not the shutdown | Other readers rely on shutdown publishing unavailable; the content-hash staleness the status handler already computes is the right evidence for a one-shot reader |
| Fail rather than relabel a degraded battery | A fallback score posing as a native result is how the 9/17 reading misled |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `skill_advisor.py ... --force-native` | prints native recommendations |
| Python harness | pass=64, fail=0; SA-022 failed on the committed bridge, SA-023, SA-024, SA-026 failed before the port |
| `pytest test_skill_advisor.py` | 4 passed |
| `npx vitest run tests/parity` | 54 passed |
| Battery through the CLI | positives 14/17, negatives-false-positive 0/5 |
| Battery through skill_advisor.py --force-native | positives 15/17, 0/5 (both batteries) |
| Battery with force-local set | exit 1, refuses to score |
| `validate.sh --strict` on this phase | RESULT: PASSED |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. The CLI and the Python path count a win differently (top skill versus a 0.8 threshold), so their numbers differ by one.
<!-- /ANCHOR:limitations -->

---
