---
title: "Implementation Summary"
description: "All 36 doctor scenarios ran with DeepSeek: 35 pass and DOC-362 fails only because 14 skills' derived metadata lacks a field the advisor schema now requires."
trigger_phrases:
  - "doctor scenario runs summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/049-doctor-audit-followups/025-doctor-scenario-runs"
    last_updated_at: "2026-10-05T07:30:00Z"
    last_updated_by: "doctor-scenario-runs"
    recent_action: "Ran every doctor scenario and recorded the results"
    next_safe_action: "Operator decision on the 14 skills' sanitizer_version"
    blockers: []
    key_files:
      - ".skilled/skills/sk-doc/leaf-manifest.json"
      - ".skilled/skills/system-spec-kit/manual-testing-playbook/doctor-commands/README.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "doctor-scenario-runs"
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
| **Spec Folder** | 025-doctor-scenario-runs |
| **Completed** | 2026-10-04 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Every doctor command now has evidence from a real run, and the runs found three problems on main and two gaps in the environments.

### Phase 25: doctor-scenario-runs

- **Results by command.** `/doctor:update` 6 of 6, `/doctor:speckit` 3 of 3, `/doctor:env` 3 of 3, `/doctor:runtime-mirrors` 2 of 2, `/doctor:deep-loop` 4 of 4, `/doctor:git` 6 of 6, `/doctor:mcp` 5 of 5 including the new unknown-flag error, `/doctor:skill-advisor` 6 of 7.
- **The one failure.** DOC-362, the tune scenario, behaves as specified and its tests pass 1004 of 1010 with 6 skipped, but its verification folds to `PARTIAL` because graph validation warns that 14 skills' derived blocks have no `sanitizer_version`. No skill has ever carried that field, so tune verification cannot reach `PASS` until the data or the contract changes.
- **Fixed on main.** Another packet's commit added an sk-doc asset without regenerating the leaf manifest, which failed the skill root metadata check and DOC-362 and DOC-366. The manifest is regenerated and DOC-366 now passes.
- **Environment causes found.** The spec-kit runtime was never built by provisioning, which made DOC-352 skip; another packet's provisioning fix now builds it, confirmed by reprovisioning. An advisor rebuild leaves recommendations `stale` until a trusted scan, which made DOC-364 skip until a scan ran; the guide now says so.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `sk-doc/leaf-manifest.json` | Modified | List the frontmatter value file |
| Doctor-commands README | Modified | Advisor-state note |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Thirty-six Pi sessions with DeepSeek v4.1 flash at max thinking through opencode-go, one at a time, about four hours in total. Each session read the doctor command file and followed it, which is what Pi's own doctor prompt templates instruct, and answered approval prompts the way its scenario says. Three scenarios needed reruns after a named cause was fixed.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Leave the 14 skills' derived metadata alone | Adding the field rewrites tracked metadata for 14 skills and is the operator's call |
| Fix the sk-doc manifest directly | It was one generated line, it broke two scenarios and the metadata check, and the operator approved continuing |
| Rerun only after naming a cause | A rerun without a fix would hide flakiness rather than explain it |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Scenario verdicts | 35 PASS, 1 FAIL (DOC-362) |
| Environment status after each run | Empty in all 42 runs, reruns included |
| Pilot against an independent run | Unit statuses and class counts identical |
| `ci-skill-root-metadata` after the manifest fix | 14 of 14 |
| Reprovisioning without the spec-kit build | Provisioning built it again, 0 failed |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. The advisor daemon's first launch in the fresh environment failed once and worked after it started. The cause was not found.
2. The tester and the runtime were the same model, so a result is that model's reading of its own run, checked per criterion against observed output.
<!-- /ANCHOR:limitations -->

---
