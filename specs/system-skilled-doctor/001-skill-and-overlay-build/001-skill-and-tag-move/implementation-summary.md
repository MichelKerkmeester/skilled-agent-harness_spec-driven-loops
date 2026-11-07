---
title: "Implementation Summary"
description: "Open with a hook: what changed and why it matters. One paragraph, impact first."
trigger_phrases:
  - "skill and tag move implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-skilled-doctor/001-skill-and-overlay-build/001-skill-and-tag-move"
    last_updated_at: "2026-11-06T07:49:16Z"
    last_updated_by: "generate-context"
    recent_action: "Moved ten doctor tags to system-skilled-doctor"
    next_safe_action: "Run phase 002 overlay engine port"
    blockers: []
    key_files:
      - ".skilled/skills/system-skilled-doctor/SKILL.md"
      - ".skilled/skills/system-skilled-doctor/README.md"
      - ".skilled/commands/doctor/install.md"
    session_dedup:
      fingerprint: "sha256:5f31a9282d03a92adab26f396601e3e82ccf2392d0c05cc4b180d3f3051d435b"
      session_id: "scaffold-001-skill-and-tag-move"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 3 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 001-skill-and-tag-move |
| **Completed** | 2026-11-06 |
| **Level** | 3 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A request to put Skilled into a project now routes to a skill built for it. `system-skilled-doctor` owns ten doctor commands, and each of them runs exactly what it ran before.

### Phase 1: skill-and-tag-move

The new standalone skill names the commands it owns and the six it leaves with their domain skill. Its README holds the command table that used to sit in the `system-spec-kit` README, and its router loads that table first. Each of the ten commands changed one line, its `skill_agent` tag, and the regenerated bridges credit them to the new skill.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/system-skilled-doctor/` | Created | The skill, its router, README, metadata, changelog and playbook |
| `.skilled/commands/doctor/{install,symlink,update,setup,helper,runtime-mirrors,env,speckit,mcp,agents-md}.md` | Modified | The `skill_agent` tag |
| `.skilled/commands/doctor/scripts/tests/doctor-{install,helper,symlink,agents-md}-contract.test.cjs` | Modified | The pinned tag |
| `command-bridges.generated.json`, `skill_advisor.py` | Generated | The new owner per bridge |
| `.skilled/skills/system-spec-kit/README.md` | Modified | The table moved out, one pointer kept |
| `.hermes/skills/system-skilled-doctor/SKILL.md` | Generated | The Hermes copy |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The baseline came first: 1005 doctor tests, 5 drift-guard tests and 12 advisor prompts. The four pinned tests were run on the moved tags before their update and failed 4, which proved they guard the tag. The whole gate ran again after the last edit.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| The README table is the router's default resource | The design gives the skill one reference, for overlays, and the command table already lives in the README |
| Graph edges use `enhances` | A `siblings` edge needs a mirror in the target skill, and its absence failed nine converter tests (ADR-001) |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Doctor contract tests | PASS, 1005 of 1005, the baseline count |
| Command-bridge drift guard | PASS, 5 of 5 |
| Skill package `--strict` | PASS |
| Skill graph validator | PASS |
| Hermes and runtime mirrors | PASS, 66 Hermes copies and 213 mirrors in sync |
| Advisor routing | `system-skilled-doctor` first on 8 of 12 prompts, up from 0 |
| Doctor routing slice, after the follow-up | PASS, 2 of 2. It had failed 8 rows on `main` |

**Follow-up.** The intent signals and keywords this phase gave the skill copied each command's own phrasing, so the skill outranked the command bridges. The doctor routing slice, which this phase never ran, failed 8 rows on `main`. The skill's routing words now describe Skilled in a project and vendored copies, and the routes gained the phrasings people use. The slice's one bare "doctor" control row now expects this skill, by the operator's decision.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Two prompts still route elsewhere by design.** "check the speckit trigger index is fresh" ranks `system-spec-kit` first, which owns the index, and "debug code mode mcp registration" ranks `mcp-code-mode` first.
2. **"show the environment switches skilled reads" gets no recommendation,** before and after this phase.
3. **The router's scaffold lines carry two semicolons** that `hvr_scan.py` flags. Every router made from the template has the same lines.
<!-- /ANCHOR:limitations -->

---
