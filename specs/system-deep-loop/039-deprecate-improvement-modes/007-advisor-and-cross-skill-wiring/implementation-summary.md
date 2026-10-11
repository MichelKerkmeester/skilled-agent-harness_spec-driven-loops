---
title: "Implementation Summary"
description: "The skill advisor, sk-doc, sk-create-benchmark, the CLI skills, cli-classifier and system-spec-kit no longer route to, document or validate the retired improvement and benchmark lanes, and the advisor now fails fewer tests than before."
trigger_phrases:
  - "advisor and cross skill wiring implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/039-deprecate-improvement-modes/007-advisor-and-cross-skill-wiring"
    last_updated_at: "2026-10-11T01:10:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Closed phase 007: advisor and cross-skill wiring cleared of the retired lanes"
    next_safe_action: "Start phase 008: docs and READMEs"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-005-advisor-and-cross-skill-wiring"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 007-advisor-and-cross-skill-wiring |
| **Completed** | 2026-10-10 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

No skill outside the deep-loop hub routes to, documents or validates the retired lanes any more. The advisor's aliases, explicit anchors, projections, Python router, command bridges, fixtures and tests name three deep-loop modes. sk-create-benchmark keeps two families, behavior and MCP promotion, and ships as 1.6.0.0. sk-doc's hub routing, templates and code-folder fixtures, the CLI skills' agent rosters, cli-classifier's feature registry and system-spec-kit's references and validator registry match.

### Phase 7: advisor-and-cross-skill-wiring

The spec-kit validator rule that checked `improvement/` folders in spec packets is gone, with its registry entry and the rule counts that cited it. Two Jev feature switches whose only readers were in the deleted packet are gone from the feature registry.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| Advisor `aliases.ts`, `explicit.ts`, `projection.ts`, `skill_advisor.py`, fixtures, holdout, tests, playbook | Modified | Three deep-loop modes |
| Advisor `scoring-compatibility.json`, `command-bridges.generated.json` | Modified/Regenerated | Two removed command bridges dropped |
| Advisor `scorer-eval-baseline.json` | Re-captured | Holdout lost four rows for removed modes |
| sk-create-benchmark (7 files deleted, 5 modified, changelog `v1.6.0.0.md` added) | Deleted/Modified/Created | Two families |
| sk-doc hub, templates, allowlists, code-folder fixtures, `leaf-manifest.json` | Modified/Regenerated | No removed-lane routing |
| sk-doc activation `manifest.json` and its authored copy | Refreshed | New policy hash |
| CLI skill docs and playbooks, sk-code docs and drift-guard script | Modified | 11-agent roster |
| cli-classifier `jev-features.mjs` and its test | Modified | Two orphan switches removed |
| system-spec-kit references, ENV reference, two tests, README, ARCHITECTURE | Modified | No improvement artifacts; 41-rule registry |
| `rules/check-improvement-artifacts.sh` and its registry entry | Deleted | Rule served only the removed runtime |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Five DeepSeek V4.1 Flash work units at max effort on DevPass, run in order from tree `d1d15bc28`. The orchestrator regenerated the command bridges and re-captured the scorer baseline after checking every metric delta, refreshed the sk-doc activation manifest, restored two files a work unit had edited on a false match, corrected agent counts a provider error left unfinished, removed two orphan feature switches and fixed the validator rule counts a test caught. Tree after the phase: `2c1452142`.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
| Decision | Why |
|----------|-----|
| Keep `skill-benchmark-report.{json,md}` mentions | They are the report files of every playbook run, not the retired lane; two edits on that false match were restored |
| Re-capture the scorer baseline | The 66 remaining holdout rows score as before (49 = 53 - 4); the full corpus gained one correct prompt |
| Keep dated probe and result records at their recorded counts | They describe what a past run observed |
| Keep `cite-drift-redirects.json` and defer `shadow-diff.md` | Historical rename chains and a frozen shadow record; listed in phase 010 exceptions |
| Remove the `IMPROVEMENT_ARTIFACTS` validator rule and two Jev feature switches | Each served only the removed runtime; the research missed them |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Advisor typecheck, Python tests | Exit 0 |
| Advisor vitest | 2 failures, both pre-existing and improved (baseline 7): corpus parity 112/113 (was 107), divergence ratchet 1 unrecorded prompt (was 9) |
| Advisor regression | 82/84, `P0-CHROME-002` only, as baseline |
| sk-doc pytests | 171 passed, as baseline |
| sk-doc node tests, cite-drift node tests | Pass |
| jev-features test | 17/17 |
| Spec-kit registry tests (doc count, help, runs-every-rule, grep convention, orchestrator) | Pass |
| `validate.sh --strict` on a live packet | PASSED |
| Leaf manifests, freshness, route guard, router sync, mirrors | Match baseline |
| Hermes skill mirror check | Drift on 8 skills, regenerated in phase 010 |
| Removed-name search over every changed live file | No match |
| Phase diff against `scratch/files.txt` | 79 files, none outside the list |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. Generated retrieval fixtures, the trigger index and Hermes skill mirrors still name the retired lanes; phase 010 regenerates them.
2. The two pre-existing advisor failures remain; they predate this work.
<!-- /ANCHOR:limitations -->

---


