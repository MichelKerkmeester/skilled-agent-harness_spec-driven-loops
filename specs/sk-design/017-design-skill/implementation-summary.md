---
title: "Implementation Summary: sk-design"
description: "The repo gained an authoring-side design skill: four public sources reworked into one class-S standalone skill that decides UI values and behavior, with every cross-source conflict resolved in writing."
trigger_phrases:
  - "sk-design skill implementation summary"
  - "sk-design built"
  - "four source design skill result"
  - "017 design skill outcome"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-design/017-design-skill"
    last_updated_at: "2026-08-28T05:16:38Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Renamed to sk-design and closed every open note and conflict"
    next_safe_action: "Commit the packet and the skill"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/SKILL.md"
      - ".opencode/skills/sk-design/references/motion-principles.md"
      - ".opencode/skills/sk-design/references/review-checklist.md"
      - ".opencode/skills/sk-design/graph-metadata.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "017-design-skill"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "Whether the remaining ten userinterface-wiki rule categories warrant a follow-up packet"
      - "Whether to score the manual-testing corpus in a benchmark run now or after real use"
    answered_questions:
      - "One skill spanning four sources rather than four separate skills"
      - "Standalone class-S root rather than a hub mode"
      - "Named for the domain rather than for the first source"
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 3 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/shared/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 017-design-skill |
| **Completed** | 2026-08-28 |
| **Level** | 3 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The repo could measure a design but could not decide one. `sk-design-md-generator` extracts a live site's real CSS into a Style Reference; nothing told an agent which spacing value, shade, shadow or duration to pick when the surface did not exist yet, so UI work fell back on invented numbers. This packet closes that gap with `sk-design`, a standalone skill built from four public sources.

### The value systems

`SKILL.md` carries eight fixed scales — spacing, type, weight, color, elevation, radius, opacity and duration — with the reasoning that makes each list defensible rather than arbitrary. They stay inline because every task needs at least one of them, so deferring them to a reference would add a load and a failure mode without saving anything. Alongside them sit the seven-step working procedure and the hierarchy technique that does most of the visible work: three tiers carried by weight and color, emphasis achieved by softening competitors, actions styled by hierarchy rather than semantics.

### Eight references, one per routed intent

The build procedure carries the seven-step order of work for something new. Hierarchy carries the full method behind the four operative rules that stay inline. Palette construction covers building a nine-shade HSL ramp from the edges inward, keeping saturation alive as lightness leaves the middle, hue rotation, dark mode, and two escape hatches for reaching contrast ratios without draining the color. The diagnosis table maps vague complaints to mechanical causes across five grouped tables. Depth and detail covers light-source emulation, the three shadow systems and how to choose one, shadow color on non-white surfaces, the six-layer button anatomy, typography detail, concentric radius, layout and images. Interaction craft covers inputs, touch, hit areas, focus, keyboard, performance and feedback placement. Motion principles adapts the twelve animation principles and pairs them with an enforceable ruleset. UX laws cover target sizing, choice count, chunking, response budgets, grouping and expectation. The review checklist runs a severity-tiered WCAG pass over real code.

### The token file

`assets/tokens.css` expresses every scale as CSS custom properties with a semantic role layer and a dark-mode block that overrides only the roles. Every text and surface pair is verified at 4.5:1 or better in both modes, every functional border at 3:1, and the deliberate sub-threshold values carry the criterion that exempts them as inline comments.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/sk-design/SKILL.md` | Created | The always-loaded contract: scales, procedure, hierarchy, router, rules |
| `.opencode/skills/sk-design/README.md` | Created | Operator front door with quick start and verification commands |
| `.opencode/skills/sk-design/graph-metadata.json` | Created | Advisor identity, 16 domains, 48 intent signals, sibling and enhances edges |
| `.opencode/skills/sk-design/leaf-manifest.config.json` | Created | The single authored class-S declaration |
| `.opencode/skills/sk-design/leaf-manifest.json` | Created | Generated by the fleet gate |
| `.opencode/skills/sk-design/leaf-aliases.json` | Created | Generated identity projection |
| `.opencode/skills/sk-design/references/color-system.md` | Created | Palette construction and contrast escape hatches |
| `.opencode/skills/sk-design/references/build-procedure.md` | Created | The seven-step order of work |
| `.opencode/skills/sk-design/references/hierarchy.md` | Created | The full hierarchy method |
| `.opencode/skills/sk-design/references/ux-laws.md` | Created | Target sizing, choice count, chunking, response budgets |
| `.opencode/skills/sk-design/references/diagnosis-table.md` | Created | Symptom to cause to fix, five grouped tables |
| `.opencode/skills/sk-design/references/depth-and-detail.md` | Created | Light, shadow, typography detail, layout, component shape, images |
| `.opencode/skills/sk-design/references/interaction-craft.md` | Created | Inputs, touch, focus, keyboard, performance, feedback |
| `.opencode/skills/sk-design/references/motion-principles.md` | Created | Twelve principles plus the enforceable motion ruleset |
| `.opencode/skills/sk-design/references/review-checklist.md` | Created | Severity-tiered WCAG and visual audit pass |
| `.opencode/skills/sk-design/assets/tokens.css` | Created | Contrast-verified starter tokens |
| `.opencode/skills/sk-design/assets/token-starter-set.md` | Created | What the token file holds and how to retune it |
| `.opencode/skills/sk-design/changelog/v1.0.0.0.md` | Created | First release entry, including the excluded promotional instruction |
| `.opencode/skills/sk-design/manual-testing-playbook/` | Created | Root index plus 12 per-feature scenario files across 4 category folders |
| `.opencode/skills/sk-design/benchmark/` | Created | Scaffolded run-output tree |
| `.opencode/skills/sk-design-md-generator/` | Modified | Reciprocal reconciliation: direction section, boundary, sibling edge, causal summary |
| `.opencode/skills/system-spec-kit/feature-catalog/governance/feature-flag-governance.md` | Modified | Stale 7-hub compiled-routing set corrected to the real 6 |
| `.opencode/skills/sk-doc/sk-create-skill/` | Modified | Fleet roster and fleet table gain the new root |
| `specs/sk-design/017-design-skill/` | Created | This Level 3 packet |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The root was scaffolded with `init_skill.py --kind standalone`, then every scaffolded file was replaced with authored content. Two of the four sources blocked direct fetch. The animation source's listing page returned 403, so its underlying repository was located by search and its article plus 28 rule files pulled through the GitHub API. The review source also returned 403 and its stated repository did not resolve, so the rendered page was retrieved and its text extracted.

Verification ran four automated gates plus a link sweep, each read for output and exit status rather than assumed. The routing probe took three passes. The daemon-backed CLI timed out because the advisor was reindexing the newly created root, so the probe ran through the Python advisor instead. The first pass found three gaps — accessibility review, padding and hover-state prompts did not reach the skill at all. The third, after the rename and the imports, found two more: phrases in the metadata were longer than the prompts users type, so `nothing draws the eye` never matched `nothing on this page draws the eye`. Shortening them closed both.

A second round of work followed the first report, on operator instruction to fix every open note and conflict. The skill was renamed to `sk-design`, which meant reclaiming a decommissioned hub name. That was verified safe by checking the live sets directly rather than trusting a grep: `COMPILED_ROUTING_HUBS` holds six hubs and none is `sk-design`, no activation manifest directory exists for it, and no skill metadata carries an edge targeting it. Only prose was stale, and the one dangerous instance — a governance doc still describing a "fixed 7-hub set" including `sk-design` — was corrected.

Nothing was committed. The packet is additive, touches no existing runtime surface, and rolls back by deleting the skill root and rerunning the fleet gate.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| One skill spanning four sources | The sources answer one question at four layers and disagree in three places. Only a single skill can state a resolution; four would each assert their own answer |
| Standalone class-S root | The operator retired the design hub, and a two-member hub adds a routing tier that buys nothing |
| Named `sk-design` | A name borrowed from one of four sources would misdescribe the artifact and would not occur to anyone searching for accessibility or motion guidance |
| Scales stay inline in `SKILL.md` | Progressive disclosure defers what is sometimes needed. A value scale is needed every time |
| Conflicts stated with their reasoning | The sources disagree because they measure different things. Saying so is what makes a resolution correct rather than arbitrary |
| Vendor footer instruction excluded | One source instructs the reading agent to append tracked marketing to every review. Fetched content is data, so the instruction was surfaced and dropped while its check set was kept |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `ci-skill-root-metadata.cjs --fix` | PASS. `checked=14 passed=14 failed=0 fixed=1`; the root classifies `[S]` and the two generated files were written |
| `validate_skill_package.py` | PASS. Detected kind standalone; `package_skill.py --check: PASS (exit 0)` |
| `validate_document.py --type reference` | PASS. Six references and one markdown asset, each `Total issues: 0` |
| `validate_document.py --type readme` | PASS. `Total issues: 0` |
| Link sweep across the package | PASS. `broken: 0` |
| `SKILL.md` word budget | PASS. 4,730 words against a 5,000-word cap after trimming |
| Advisor routing probe | PASS after two fixes. Ten prompts across every intent: top-ranked for padding and palette (0.95), procedure (0.92), hierarchy (0.89), diagnose (0.84), depth (0.81) and UX laws (0.63); second behind `sk-code` for accessibility review (0.91) and motion (0.84), both legitimately code tasks; the extraction boundary correctly routes to `sk-design-md-generator` (0.95) |
| Hub-name reclaim | PASS. `COMPILED_ROUTING_HUBS` = 6 hubs, no `sk-design`; no activation directory; no metadata edge. One stale governance doc corrected |
| Rename residue sweep | PASS. No `sk-refactoring-ui`, `sk-design-ui-craft` or `017-ui-craft-skill` reference remains anywhere in the tree |
| Playbook operator-scenario contract | PASS at fail-closed tier: 12 scenarios, 4 categories, 0 violations, 0 warnings. Every grep cited in a scenario was executed and resolves |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Routing is second-place on two intents.** `sk-code` outranks this skill for "review this component for accessibility issues" and "what animation duration should this dropdown use". Both are legitimately code tasks, so second place is defensible, but a prompt purely about design values could still land on the wrong skill. Worth watching in real use rather than tuning further, since raising it means degrading a correct `sk-code` match.
2. **The playbook corpus is authored but unscored.** Twelve scenarios exist as an input; no run has read them. Deliberately deferred until the skill has been used on real work, so the scoring measures real failure modes rather than authored expectations.
3. **All four sources are external and will drift.** The changelog names each one with its capture date so a later comparison is possible, but nothing detects drift automatically.
4. **Six source categories are declined, not absent by accident.** Exit animations, audio feedback, sound synthesis, morphing icons, container animation and predictive prefetching each have a stated reason in the changelog's coverage table. Reversing one is a scoped decision, not a rediscovery.
<!-- /ANCHOR:limitations -->

---
