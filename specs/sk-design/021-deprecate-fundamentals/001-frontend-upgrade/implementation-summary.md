---
title: "Implementation Summary"
description: "The sk-code frontend surface now answers spacing, type, colour, hierarchy and motion questions from three local references and a moved token file, so the design hub no longer holds the only copy."
trigger_phrases:
  - "frontend upgrade implementation summary"
  - "sk-code-frontend visual references delivered"
  - "design token move to sk-code"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-design/021-deprecate-fundamentals/001-frontend-upgrade"
    last_updated_at: "2026-11-05T12:00:00Z"
    last_updated_by: "markdown"
    recent_action: "Recorded what the phase built and how the gates proved it"
    next_safe_action: "None, the phase is closed"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-design-021-001-frontend-upgrade"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata
<!-- FILL: Fill the folder name, the completion date and the level. Use the real date. GOOD: `004-rotate-logs-keep`. Completed 2026-10-24. Level 1. WEAK: Folder: TBD. -->

| Field | Value |
|-------|-------|
| **Spec Folder** | 001-frontend-upgrade |
| **Status** | Complete |
| **Completed** | 2026-11-05 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built
<!-- FILL: Open with the user-visible change in two sentences, then list each changed file. GOOD: `--keep 3` leaves three archives in `logs/archive`. A plain run leaves all ten. WEAK: Implemented the feature. -->

A value prompt such as `what padding should this card have` now lands on sk-code-frontend and is answered from a scale. Before this phase the same prompt deferred on sk-code and reached sk-design at 0.65 confidence, so the frontend surface could not answer the question it was writing code for.

### Phase 1: frontend-upgrade

You can now ask the sk-code frontend surface for a spacing, type, colour, elevation, hierarchy or motion value and get an answer from a local reference. The three files carry the value, hierarchy and motion guidance that the frontend surface lacked, and the token file moved with them, so the design hub no longer holds the only copy. The routing vocabulary sends the matching prompts there before the fundamentals skill is removed in phase 2.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/sk-code/sk-code-frontend/references/web-visual-values.md` | Created | Spacing, type, colour, elevation, radius, opacity and duration values, items V1 to V41, 566 lines |
| `.skilled/skills/sk-code/sk-code-frontend/references/web-visual-hierarchy.md` | Created | Hierarchy method, diagnosis tables, build procedure, UX laws and the review pass, 618 lines |
| `.skilled/skills/sk-code/sk-code-frontend/references/web-motion-and-interaction.md` | Created | Motion rules, input and touch rules, focus and keyboard rules and feedback rules, items M1 to M57, 642 lines |
| `.skilled/skills/sk-code/sk-code-frontend/assets/tokens.css` | Moved | Token file moved by git mv from sk-design-fundamentals/assets, header no longer cites a book |
| `.skilled/skills/sk-code/sk-code-frontend/ROUTER.md` | Modified | Added WEB_VISUAL_VALUES, WEB_VISUAL_HIERARCHY and WEB_MOTION, plus six WEB_A11Y phrases |
| `.skilled/skills/sk-code/hub-router.json` | Modified | Added the code-frontend-visual vocabulary class to the frontend router signals |
| `.skilled/skills/sk-code/graph-metadata.json` | Modified | Added 88 screen-design intent signals moved from sk-design |
| `.skilled/skills/sk-code/ROUTER.md` | Modified | Mirrored the three frontend intents into RESOURCE_MAP |
| `.skilled/skills/sk-code/sk-code-frontend/references/frontend-practice.md` | Modified | Repointed principle 11 and section 3 |
| `.skilled/skills/sk-code/sk-code-frontend/references/web-markup-and-css.md` | Modified | Repointed the value guidance |
| `.skilled/skills/sk-code/sk-code-frontend/references/figma-to-code.md` | Modified | Repointed the value guidance |
| `.skilled/skills/sk-code/SKILL.md` | Modified | Version 3.11.0.0 and the visual value guidance now points at sk-code-frontend |
| `.skilled/skills/sk-code/README.md` | Modified | Repointed the reference links |
| `.skilled/skills/sk-code/sk-code-frontend/README.md` | Modified | Lists the three visual topic files and the token file |
| `.skilled/skills/sk-code/sk-code-frontend/manual-testing-playbook/frontend-surface/visual-values.md` | Created | WEB_VISUAL_VALUES routing scenario, replayed by router-sync check 4 |
| `.skilled/skills/sk-code/changelog/v3.11.0.0.md` | Created | Hub changelog for the release |
| `.skilled/skills/sk-code/sk-code-frontend/changelog/v1.1.0.0.md` | Created | Mode changelog for the release |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered
<!-- FILL: Name the commands that proved it and the order they ran. GOOD: Ran `--keep 3` and a plain run, then the suite. All three passed. WEAK: Tested and shipped. -->

Each reference came from one DeepSeek dispatch on `llmgateway/deepseek-v4.1-flash-1017#max` under OpenCode v2.2.5, with its brief in `scratch/task-{1,2,3}.md`. The orchestrator checked every file before the next step: `validate_document.py` reported VALID 0 issues, the leak grep came back empty, the spacing, type and opacity scales were byte-exact, and the hierarchy rows counted 40 diagnosis rows, 21 review rows and 21 UX laws. The token move, the routing entries and the five link repoints followed. The final gate run covered `parent-skill-check`, both routing replays, the drift guards, `compiled-route-sync`, the link check, the vocabulary reach check and the runtime mirrors.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions
<!-- FILL: Write one decision per row. Give the reason, not the label. GOOD: Option over environment variable: one run can pick a different count without editing config. WEAK: Used the best approach. -->

| Decision | Why |
|----------|-----|
| Move `tokens.css` instead of copying it | One file owns the values, so there is no fork to drift. Git history keeps the old copy after phase 2 deletes the folder |
| Drop the slides and print guidance | Chart owns a measured type scale and diagram owns a 4px grid, and neither linked to fundamentals, so nothing was copied |
| Link A5 and A8 for focus instead of repeating the shadow advice | A shadow vanishes in forced-colors mode, so the old box-shadow ring left the focus state invisible |
| Author each reference in one dispatch | One brief, one file and one verification pass per file keeps the checks attributable |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification
<!-- FILL: Write one check per row with the exact output. GOOD: `ls logs/archive | wc -l` after `--keep 3`: 3. After a plain run: 10. Suite: PASSED. WEAK: All tests pass. -->

| Check | Result |
|-------|--------|
| `validate_document.py` on the three new references | PASS, VALID 0 issues on each file |
| Leak grep over the three new references | PASS, no hit for the fundamentals name, sk-design, research, a spec path, slide, print or the em dash marker |
| Scale comparison across the references | PASS, the spacing, type and opacity scales are byte-exact |
| Hierarchy row counts | PASS, diagnosis rows 40/40, review rows 21/21, UX laws 21/21 |
| `parent-skill-check` on sk-code | PASS, all hard invariants passed with 0 warnings at exit 0 |
| Stage-one advisor replay | PASS, padding 0.63, type scale 0.88, palette 0.88, looks wrong 0.90 and dropdown animation 0.82 all resolve to sk-code |
| Stage-two compiled-route replay | PASS, all eight value, review and motion prompts route to sk-code-frontend and the vitest prompt still routes to sk-code-skilled |
| sk-code drift guards | PASS, all 4 guards passed with 11 non-blocking warnings, the same count as the main baseline |
| `compiled-route-sync --check` | PASS, all 55 served copies match their authored files |
| `check-markdown-links` | PASS, 0 broken markdown links across 14494 links |
| `ci-router-vocabulary-reach` | PASS, wrong-hub=0 outranked=0 no-reach=0, sk-code declared phrases at 172 from 94 |
| `runtime-mirrors --check` | PASS, 213 mirrors |
| `validate.sh --strict` on this folder | PASS, RESULT: PASSED |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations
<!-- FILL: Name one real limit and the workaround. GOOD: `--keep` deletes the older archives for good. Copy `logs/archive/` aside first when a run may cut too deep. WEAK: No limitations. -->

1. **Slides and print guidance is gone.** It lived in the fundamentals folder and neither chart nor diagram used it. Recover it from git history if a future mode needs it.
2. **Each reference rests on one authoring pass.** The orchestrator checked structure, scales and row counts, but it did not re-derive every rule from a second source.
3. **Routing follows vocabulary.** A prompt that names no visual signal still defers, so an operator with an unusual phrasing may need to say padding, type scale, colour, hierarchy or motion before the frontend reference loads.
<!-- /ANCHOR:limitations -->

---
